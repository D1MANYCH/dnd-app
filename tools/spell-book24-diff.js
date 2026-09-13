// ============================================================
// tools/spell-book24-diff.js — сверка PH24-записей SPELLS_BASE с гл.7 PHB 2024 (E24-2).
//
// Вход: tests/_spell-book24-index.json (генерится python tools/spell-book24-extract.py
// из локального PDF; в индексе только имена/уровень/школа/классы). Пары строятся по
// нормализованному русскому имени; для неспаренных выводятся обе стороны по уровням,
// чтобы вручную разобрать варианты перевода (наши имена — dnd.su, книга — фан-перевод).
// Дополнительные соответствия «книга → наше имя» — в ALIASES ниже.
//
// Запуск (из корня репо; вывод в UTF-8 файл, консоль cp1251):
//   node tools/spell-book24-diff.js diff [out.txt]      — отсутствующие/лишние/школа
//   node tools/spell-book24-diff.js classes             — отчёт docs/spell-audit/ph24-classes.md
//   node tools/spell-book24-diff.js classes <class>     — по одному классу (bard|cleric|…), в tests/_spell-book24-classes-<class>.txt
//   node tools/spell-book24-diff.js classes apply       — дописать в spells.js классы из «Добавить» («Убрать» руками)
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SPELLS_FILE = path.join(ROOT, 'spells.js');
const INDEX_FILE = path.join(ROOT, 'tests', '_spell-book24-index.json');
const REPORT_FILE = path.join(ROOT, 'docs', 'spell-audit', 'ph24-classes.md');

// английское имя из книги → имя в БД (dnd.su), когда фан-перевод книги расходится с нашим
const ALIASES = {
  'Starry Wisp': 'Звёздная искра', 'Guidance': 'Указание', 'Sorcerous Burst': 'Чародейский взрыв',
  'Protection from Evil and Good': 'Защита от добра и зла', 'Illusory Script': 'Невидимое письмо',
  'Guiding Bolt': 'Направленный снаряд',
  'Barkskin': 'Дубовая кора', "Nystul’s Magic Aura": 'Нистулова ложная аура', 'Locate Object': 'Поиск предмета',
  'Shining Smite': 'Клеймящая кара', 'Knock': 'Открывание', 'Spike Growth': 'Шипы',
  'Conjure Animals': 'Призыв животных', 'Conjure Barrage': 'Призыв заграждения', 'Revivify': 'Возрождение',
  'Animate Dead': 'Восставший труп', 'Wind Wall': 'Стена ветров',
  'Conjure Woodland Beings': 'Призыв лесных обитателей', 'Conjure Minor Elementals': 'Призыв малых элементалей',
  'Vitriolic Sphere': 'Кислотная сфера', 'Charm Monster': 'Очарование чудовища', 'Polymorph': 'Превращение',
  'Wall of Fire': 'Огненная стена',
  'Conjure Elemental': 'Призыв элементаля', 'Contact Other Plane': 'Связь с иным миром', 'Raise Dead': 'Оживление',
  'Wall of Stone': 'Каменная стена', 'Wall of Force': 'Силовая стена',
  'Conjure Fey': 'Призыв феи', 'Heal': 'Полное исцеление', 'Wall of Thorns': 'Терновая стена', 'Wall of Ice': 'Ледяная стена',
  'Chain Lightning': 'Пляшущая молния',
  "Mordenkainen’s Sword": 'Дуговой клинок', 'Conjure Celestial': 'Призыв небожителя', 'Resurrection': 'Воскрешение',
  'Forcecage': 'Узилище', 'Plane Shift': 'Уход в иной мир',
  'Incendiary Cloud': 'Воспламеняющая туча', 'Befuddlement': 'Слабоумие', 'Antimagic Field': 'Преграда магии',
  'Power Word Stun': 'Слово Силы: оглушение',
  'Wish': 'Исполнение желаний', 'Weird': 'Смертный ужас', 'True Polymorph': 'Истинное превращение', 'Mass Heal': 'Множественное полное исцеление',
  'Lightning Arrow': 'Молниевая стрела', 'Dream': 'Вещий сон', 'Arcane Vigor': 'Волшебная бодрость', 'Conjure Volley': 'Призыв залпа',
};

const CLASS_RU = {
  'бард': 'bard', 'волшебник': 'wizard', 'друид': 'druid', 'жрец': 'cleric',
  'колдун': 'warlock', 'паладин': 'paladin', 'следопыт': 'ranger', 'чародей': 'sorcerer',
};
const CLASS_ORDER = ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard'];

function loadSpells() {
  const src = fs.readFileSync(SPELLS_FILE, 'utf8');
  const ctx = {};
  vm.runInNewContext(src + ';this.S = SPELLS_BASE;', ctx, { filename: 'spells.js' });
  return ctx.S;
}
let CLASS_LISTS = {};
function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) throw new Error('нет ' + INDEX_FILE + ' — сначала python tools/spell-book24-extract.py');
  const idx = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  CLASS_LISTS = {};
  Object.keys(idx.classLists || {}).forEach(function (ru) {
    CLASS_LISTS[CLASS_RU[ru]] = new Set((idx.classLists[ru] || []).map(normName));
  });
  return idx.spells;
}
function normName(s) { return String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim(); }
function bookKey(b) { return normName(ALIASES[b.en] || b.ru); }
// классы книги по скобкам под заголовком (подклассы и виды отбрасываем: в БД поле classes — только базовые классы)
function parenClasses(b) {
  const out = [];
  (b.classes || []).forEach(function (c) {
    const k = CLASS_RU[normName(c)];
    if (k && out.indexOf(k) === -1) out.push(k);
  });
  return out.sort();
}
// классы книги по спискам гл.3 (таблицы «Заклинания <класса> N уровня»)
function listClasses(b) {
  const k = normName(b.ru);
  return CLASS_ORDER.filter(function (c) { return CLASS_LISTS[c] && CLASS_LISTS[c].has(k); });
}
// итог — объединение двух источников книги; расхождение между ними помечается в отчёте
function bookClasses(b) {
  const u = parenClasses(b);
  listClasses(b).forEach(function (c) { if (u.indexOf(c) === -1) u.push(c); });
  return u.sort();
}
function sourcesDisagree(b) {
  const a = parenClasses(b).join(','), l = listClasses(b).join(',');
  return a !== l ? ('скобки: ' + (a || '—') + ' · список: ' + (l || '—')) : '';
}

function pair() {
  const ours = loadSpells().filter(function (s) { return s.source === 'PH24'; });
  const book = loadIndex();
  const byName = new Map();
  ours.forEach(function (s) { byName.set(normName(s.name), s); });
  const pairs = [], missing = [];
  const matched = new Set();
  book.forEach(function (b) {
    const s = byName.get(bookKey(b));
    if (s) { pairs.push({ book: b, ours: s }); matched.add(s); }
    else missing.push(b);
  });
  const extra = ours.filter(function (s) { return !matched.has(s); });
  return { ours: ours, book: book, pairs: pairs, missing: missing, extra: extra };
}

function cmdDiff(outPath) {
  const r = pair();
  const L = [];
  L.push('PH24 в БД: ' + r.ours.length + ' | в книге: ' + r.book.length + ' | спарено: ' + r.pairs.length);
  L.push('');
  L.push('## Нет в БД (' + r.missing.length + ')');
  for (let lv = 0; lv <= 9; lv++) {
    const m = r.missing.filter(function (b) { return b.level === lv; });
    const e = r.extra.filter(function (s) { return s.level === lv; });
    if (!m.length && !e.length) continue;
    L.push('### L' + lv + ' — нет в БД ' + m.length + ', не спарено в БД ' + e.length);
    m.forEach(function (b) { L.push('  - ' + b.ru + ' [' + b.en + '] ' + b.school + (b.ritual ? ' (ритуал)' : '') + ' — ' + b.classes.join(', ') + ' — стр. ' + b.page); });
    e.forEach(function (s) { L.push('  ? БД: ' + s.name + ' (id ' + s.id + ', ' + s.school + ')'); });
  }
  L.push('');
  L.push('## Расхождения уровня/школы у спаренных');
  r.pairs.forEach(function (p) {
    const d = [];
    if (p.book.level !== p.ours.level) d.push('уровень ' + p.ours.level + ' → книга ' + p.book.level);
    if (p.book.school !== normName(p.ours.school)) d.push('школа ' + p.ours.school + ' → книга ' + p.book.school);
    if (d.length) L.push('  - ' + p.ours.name + ' (id ' + p.ours.id + '): ' + d.join('; '));
  });
  const out = outPath || path.join(ROOT, 'tests', '_spell-book24-diff.txt');
  fs.writeFileSync(out, L.join('\n') + '\n', 'utf8');
  console.log('ours ' + r.ours.length + ' book ' + r.book.length + ' paired ' + r.pairs.length + ' missing ' + r.missing.length + ' extra ' + r.extra.length + ' -> ' + out);
}

function cmdClasses(cls) {
  const r = pair();
  const rows = [];
  r.pairs.forEach(function (p) {
    const b = bookClasses(p.book);
    const o = (p.ours.classes || []).slice().sort();
    const add = b.filter(function (c) { return o.indexOf(c) === -1; });
    const del = o.filter(function (c) { return b.indexOf(c) === -1; });
    if (add.length || del.length) rows.push({ s: p.ours, add: add, del: del, book: b, b: p.book });
  });
  if (cls === 'apply') {
    // дописываем недостающие классы в spells.js (только «Добавить»; блок classes — по строке на класс)
    const lines = fs.readFileSync(SPELLS_FILE, 'utf8').split('\n');
    let n = 0;
    rows.filter(function (x) { return x.add.length; }).forEach(function (x) {
      const idLine = lines.findIndex(function (l) { return /^\s*"id": (\d+),?\s*$/.test(l) && parseInt(l.match(/\d+/)[0], 10) === x.s.id; });
      if (idLine === -1) { console.log('id ' + x.s.id + ': не найден'); return; }
      let open = -1, close = -1;
      for (let k = idLine + 1; k < idLine + 15; k++) {
        if (/^\s*"classes": \[/.test(lines[k])) open = k;
        if (open !== -1 && /^\s*\]/.test(lines[k])) { close = k; break; }
      }
      if (open === -1 || close === -1) { console.log('id ' + x.s.id + ': нет блока classes'); return; }
      const merged = (x.s.classes || []).concat(x.add);
      const body = merged.map(function (c) { return '      "' + c + '"'; }).join(',\n');
      lines.splice(open + 1, close - open - 1, body);
      n++;
    });
    fs.writeFileSync(SPELLS_FILE, lines.join('\n'), 'utf8');
    console.log('classes добавлены в ' + n + ' записях');
    return;
  }
  if (cls) {
    const sub = rows.filter(function (x) { return x.add.indexOf(cls) !== -1 || x.del.indexOf(cls) !== -1; });
    const L = ['# ' + cls + ': расхождений ' + sub.length];
    sub.forEach(function (x) { L.push('- L' + x.s.level + ' ' + x.s.name + ' (id ' + x.s.id + '): ' + (x.add.indexOf(cls) !== -1 ? 'нет у нас, есть в книге' : 'есть у нас, нет в книге')); });
    const out = path.join(ROOT, 'tests', '_spell-book24-classes-' + cls + '.txt');
    fs.writeFileSync(out, L.join('\n') + '\n', 'utf8');
    console.log(cls + ': ' + sub.length + ' -> ' + out);
    return;
  }
  const L = [];
  L.push('# Сверка `classes` PH24 со списками классов PHB 2024');
  L.push('');
  L.push('Источник — объединение двух мест книги: скобки под заголовком заклинания в гл.7 и таблицы');
  L.push('«Заклинания <класса> N уровня» гл.3. Подклассы и виды не учитываются — в БД поле `classes`');
  L.push('держит только базовые классы. Колонка «Источники» непуста, если два места книги расходятся');
  L.push('(фан-перевод; тогда строка требует сверки с оригиналом). «Убрать» скриптом не применяется.');
  L.push('Генерится `node tools/spell-book24-diff.js classes`; по классу — `classes <class>`; `classes apply` — дописать «Добавить» в spells.js.');
  L.push('');
  L.push('| Что | Значение |');
  L.push('|---|---|');
  L.push('| PH24 в БД | ' + r.ours.length + ' |');
  L.push('| в книге | ' + r.book.length + ' |');
  L.push('| спарено по имени | ' + r.pairs.length + ' |');
  L.push('| нет в БД | ' + r.missing.length + ' |');
  L.push('| не спарено в БД | ' + r.extra.length + ' |');
  L.push('| расхождения classes | ' + rows.length + ' |');
  L.push('');
  L.push('## Число заклинаний на класс (книга / БД)');
  L.push('');
  L.push('| Класс | Книга | БД |');
  L.push('|---|---|---|');
  CLASS_ORDER.forEach(function (c) {
    const nb = r.book.filter(function (b) { return bookClasses(b).indexOf(c) !== -1; }).length;
    const no = r.ours.filter(function (s) { return (s.classes || []).indexOf(c) !== -1; }).length;
    L.push('| ' + c + ' | ' + nb + ' | ' + no + ' |');
  });
  L.push('');
  L.push('## Расхождения (' + rows.length + ')');
  L.push('');
  if (rows.length) {
    L.push('| L | Заклинание | id | Добавить | Убрать | Источники |');
    L.push('|---|---|---|---|---|---|');
    rows.sort(function (a, b) { return a.s.level - b.s.level || a.s.name.localeCompare(b.s.name, 'ru'); });
    rows.forEach(function (x) { L.push('| ' + x.s.level + ' | ' + x.s.name + ' | ' + x.s.id + ' | ' + (x.add.join(', ') || '—') + ' | ' + (x.del.join(', ') || '—') + ' | ' + (sourcesDisagree(x.b) || '—') + ' |'); });
  } else {
    L.push('Нет.');
  }
  if (r.missing.length || r.extra.length) {
    L.push('');
    L.push('## Не спарено');
    L.push('');
    r.missing.forEach(function (b) { L.push('- книга: L' + b.level + ' ' + b.ru + ' [' + b.en + ']'); });
    r.extra.forEach(function (s) { L.push('- БД: L' + s.level + ' ' + s.name + ' (id ' + s.id + ')'); });
  }
  fs.writeFileSync(REPORT_FILE, L.join('\n') + '\n', 'utf8');
  console.log('pairs ' + r.pairs.length + ' class diffs ' + rows.length + ' -> ' + REPORT_FILE);
}

const mode = process.argv[2];
if (mode === 'diff') cmdDiff(process.argv[3]);
else if (mode === 'classes') cmdClasses(process.argv[3]);
else { console.log('usage: node tools/spell-book24-diff.js diff [out.txt] | classes [class]'); process.exit(2); }
