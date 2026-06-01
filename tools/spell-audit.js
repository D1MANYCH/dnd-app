// ============================================================
// tools/spell-audit.js — харнесс аудита SPELL_DATABASE против dnd.su
// Фаза SPELL-AUDIT (см. memory/project_spell_audit_plan.md).
//
// Назначение: автоматизирует ДВЕ механические части аудита, чтобы агент
// тратил WebSearch/WebFetch только на то, что нельзя заскриптовать:
//   1. Генерация скелета отчёта docs/spell-audit/L<level>_<source>.md
//      с предзаполненной «нашей» стороной (поля из spells.js) и пустыми
//      колонками «dnd.su» / «вердикт» — агент заполняет их из WebFetch.
//   2. Управление кэшем RU-имя→URL (tests/_spell-url-map.json) и список
//      заклинаний, которым ещё нужен резолв URL (готовые поисковые запросы).
//
// Резолв URL и чтение страниц делает АГЕНТ (WebSearch/WebFetch) — заскриптовать
// нельзя. Скрипт лишь готовит вход и собирает выход.
//
// Запуск (из корня репо):
//   node tools/spell-audit.js stats
//   node tools/spell-audit.js urls   <level> [PH14|PH24]
//   node tools/spell-audit.js report <level> [PH14|PH24]
//   node tools/spell-audit.js norm "<строка>"   — показать нормализацию поля
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SPELLS_FILE = path.join(ROOT, 'spells.js');
const URLMAP_FILE = path.join(ROOT, 'tests', '_spell-url-map.json');
const DOCS_DIR = path.join(ROOT, 'docs', 'spell-audit');

// ── Загрузка SPELLS_BASE из spells.js (vanilla, без экспортов) ─────────────
function loadSpells() {
  const src = fs.readFileSync(SPELLS_FILE, 'utf8');
  const ctx = {};
  vm.runInNewContext(src + ';this.S = SPELLS_BASE;', ctx, { filename: 'spells.js' });
  if (!Array.isArray(ctx.S)) throw new Error('SPELLS_BASE не загрузился из spells.js');
  return ctx.S;
}

// ── Карта школ: наш термин (нижний регистр) → EN. На dnd.su те же 8 школ,
//    но с заглавной буквы → сравнение школ ВСЕГДА регистронезависимо. ───────
const SCHOOL_EN = {
  'воплощение': 'Evocation',
  'вызов': 'Conjuration',
  'иллюзия': 'Illusion',
  'некромантия': 'Necromancy',
  'ограждение': 'Abjuration',
  'очарование': 'Enchantment',
  'преобразование': 'Transmutation',
  'прорицание': 'Divination',
};

// ── Нормализация имени для ключа кэша: lower + ё→е + trim ──────────────────
function normName(s) {
  return String(s || '').toLowerCase().replace(/ё/g, 'е').trim();
}

// ── Нормализаторы полей (рубрика «формат vs ошибка», см. docs/.../README.md).
//    Возвращают каноничную форму для сравнения — РАЗНИЦА формата не должна
//    флагаться как ошибка. Реальная ошибка — расхождение ПОСЛЕ нормализации. ─
// NB: \b в JS-regex не распознаёт кириллицу как «слово» → границы слов тут НЕ используем.
function normSchool(s) { return normName(s); } // регистр — единственная разница
function normTime(s) {
  return normName(s).replace(/действи[ея]/g, 'действие').replace(/\s+/g, ' ').trim();
}
function normRange(s) {
  return normName(s)
    .replace(/фут(ов|а|ы)?/g, 'фт')   // футов/фута/футы/фут → фт
    .replace(/фт\.?/g, 'фт')
    .replace(/\s+/g, ' ').trim();
}
function normComponents(s) {
  // Латиница V/S/M ↔ кириллица В/С/М — одно и то же. Сводим к набору заглавных
  // латинских букв; материал в скобках сравнивается отдельно по смыслу.
  let t = String(s || '').replace(/\([^)]*\)/g, '').toUpperCase(); // убрать материал, регистр→верх
  t = t.replace(/В/g, 'V').replace(/С/g, 'S').replace(/М/g, 'M');   // кириллица→латиница (заглавные)
  const letters = (t.match(/[VSM]/g) || []);
  return Array.from(new Set(letters)).sort().join('');             // уникальные, отсортированы: напр. "MSV"
}
function normDuration(s) {
  return normName(s)
    .replace(/мгновенн(о|ая|ый)/g, 'мгновенно')
    .replace(/вплоть до/g, 'до')
    .replace(/концентрация,?\s*до/g, 'концентрация до')
    .replace(/\s+/g, ' ').trim();
}

// ── Кэш RU-имя→URL ────────────────────────────────────────────────────────
// Схема: { "<normName>": { en, ph14, ph24 } }. Один поиск отдаёт оба издания.
function loadUrlMap() {
  try { return JSON.parse(fs.readFileSync(URLMAP_FILE, 'utf8')); }
  catch (e) { return {}; }
}
function urlFor(map, name, source) {
  const e = map[normName(name)];
  if (!e) return null;
  return source === 'PH24' ? (e.ph24 || null) : (e.ph14 || null);
}

// ── Команды ───────────────────────────────────────────────────────────────
function cmdStats(S) {
  const by = {};
  S.forEach(s => { const k = s.source + ' L' + s.level; by[k] = (by[k] || 0) + 1; });
  Object.keys(by).sort().forEach(k => console.log(k.padEnd(10), by[k]));
  console.log('— всего:', S.length);
}

function selectSpells(S, level, source) {
  return S.filter(s => s.level === level && (!source || s.source === source))
          .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}

function cmdUrls(S, level, source) {
  const map = loadUrlMap();
  const list = selectSpells(S, level, source);
  let need = 0;
  list.forEach(s => {
    if (!urlFor(map, s.name, s.source)) {
      need++;
      console.log(`site:dnd.su ${s.name}   [${s.source} L${s.level} id${s.id}]`);
    }
  });
  console.log(`\n— нужен резолв URL: ${need} из ${list.length} (${source || 'обе редакции'} L${level})`);
}

function cmdReport(S, level, source) {
  const map = loadUrlMap();
  const list = selectSpells(S, level, source);
  if (!list.length) { console.error('Нет заклинаний под фильтр'); process.exit(1); }
  const lines = [];
  lines.push(`# Аудит заклинаний — уровень ${level}${source ? ' / ' + source : ''}`);
  lines.push('');
  lines.push(`Сгенерировано \`tools/spell-audit.js report ${level}${source ? ' ' + source : ''}\`. `
    + `Колонки «dnd.su» и «вердикт» заполняет агент из WebFetch. Рубрика и правила нормализации — `
    + `[README.md](README.md).`);
  lines.push('');
  lines.push(`Записей: **${list.length}**. Вердикты: ✅ совпадает · 🔤 имя-вариант (алиас) · ⚠️ требует правки · ❓ перепроверить.`);
  lines.push('');
  list.forEach(s => {
    const url = urlFor(map, s.name, s.source);
    const urlCell = url ? `[dnd.su](${url})` : `_НУЖЕН ПОИСК: \`site:dnd.su ${s.name}\`_`;
    const en = SCHOOL_EN[normName(s.school)] || '?';
    lines.push(`### ${s.name} — ${s.source} L${s.level} (id ${s.id})`);
    lines.push(`URL: ${urlCell}`);
    lines.push('');
    lines.push('| поле | наше | dnd.su | вердикт |');
    lines.push('|---|---|---|---|');
    lines.push(`| name | ${s.name} |  |  |`);
    lines.push(`| level | ${s.level} |  |  |`);
    lines.push(`| school | ${s.school} (${en}) |  |  |`);
    lines.push(`| time | ${s.time} |  |  |`);
    lines.push(`| range | ${s.range} |  |  |`);
    lines.push(`| components | ${s.components} |  |  |`);
    lines.push(`| duration | ${s.duration} |  |  |`);
    lines.push(`| classes | ${(s.classes || []).join(', ')} |  |  |`);
    lines.push(`| desc-механика | ${(s.desc || '').replace(/\|/g, '\\|')} |  |  |`);
    lines.push(`| higherLevel | ${(s.higherLevel || '—').replace(/\|/g, '\\|')} |  |  |`);
    lines.push('');
  });
  if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
  const out = path.join(DOCS_DIR, `L${level}${source ? '_' + source : ''}.md`);
  fs.writeFileSync(out, lines.join('\n'), 'utf8');
  console.log(`Скелет записан: ${path.relative(ROOT, out)} (${list.length} записей)`);
}

function cmdNorm(arg) {
  console.log('school     :', normSchool(arg));
  console.log('time       :', normTime(arg));
  console.log('range      :', normRange(arg));
  console.log('components :', normComponents(arg));
  console.log('duration   :', normDuration(arg));
}

// ── CLI ────────────────────────────────────────────────────────────────────
function main() {
  const [cmd, a1, a2] = process.argv.slice(2);
  if (!cmd || cmd === 'help') {
    console.log('Команды: stats | urls <level> [PH14|PH24] | report <level> [PH14|PH24] | norm "<строка>"');
    return;
  }
  if (cmd === 'norm') { cmdNorm(a1 || ''); return; }
  const S = loadSpells();
  if (cmd === 'stats') return cmdStats(S);
  const level = parseInt(a1, 10);
  if (Number.isNaN(level)) { console.error('Укажи уровень (0–9)'); process.exit(1); }
  const source = a2 ? a2.toUpperCase() : null;
  if (source && source !== 'PH14' && source !== 'PH24') { console.error('Источник: PH14 или PH24'); process.exit(1); }
  if (cmd === 'urls') return cmdUrls(S, level, source);
  if (cmd === 'report') return cmdReport(S, level, source);
  console.error('Неизвестная команда:', cmd); process.exit(1);
}

main();

// Экспорт нормализаторов для возможного авто-diff в поздних фазах.
module.exports = { loadSpells, normName, normSchool, normTime, normRange, normComponents, normDuration, SCHOOL_EN };
