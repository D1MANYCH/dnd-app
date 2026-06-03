// ============================================================
// tools/spell-xedition.js — кросс-редакционная сверка PH14 ↔ PH24
// Фаза SPELL-AUDIT-6 (см. memory/project_spell_audit_plan.md).
//
// Назначение: спарить записи SPELLS_BASE по нормализованному имени и сдиффить
// поля между редакциями, чтобы отделить РЕАЛЬНЫЕ отличия 2024 (школа/классы/
// концентрация/дистанция — уже сверены против dnd.su в -1..-5) от copy-paste
// ошибок (одна сторона по ошибке отличается/совпадает). Плюс отчёт по
// singleton-именам (есть только в одной редакции) — для разбора source-переносов.
//
// Запуск (из корня репо):
//   node tools/spell-xedition.js diff      — пары с расхождениями полей
//   node tools/spell-xedition.js singles    — имена только в одной редакции
//   node tools/spell-xedition.js report     — записать docs/spell-audit/L_XEDITION.md
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SPELLS_FILE = path.join(ROOT, 'spells.js');
const DOCS_DIR = path.join(ROOT, 'docs', 'spell-audit');

function loadSpells() {
  const src = fs.readFileSync(SPELLS_FILE, 'utf8');
  const ctx = {};
  vm.runInNewContext(src + ';this.S = SPELLS_BASE;', ctx, { filename: 'spells.js' });
  if (!Array.isArray(ctx.S)) throw new Error('SPELLS_BASE не загрузился');
  return ctx.S;
}

function normName(s) { return String(s || '').toLowerCase().replace(/ё/g, 'е').trim(); }

// концентрация — да/нет из duration
function conc(s) { return /концентрац/i.test(String(s || '')); }

// нормализация дистанции к сравнимой форме (футы)
function normRange(s) {
  return normName(s)
    .replace(/фут(ов|а|ы)?/g, 'фт').replace(/фт\.?/g, 'фт')
    .replace(/\s+/g, ' ').trim();
}
function normTime(s) {
  return normName(s).replace(/действи[ея]/g, 'действие').replace(/\s+/g, ' ').trim();
}
// компоненты → набор уникальных V/S/M (без материала)
function normComp(s) {
  let t = String(s || '').replace(/\([^)]*\)/g, '').toUpperCase();
  t = t.replace(/В/g, 'V').replace(/С/g, 'S').replace(/М/g, 'M');
  return Array.from(new Set((t.match(/[VSM]/g) || []))).sort().join('');
}
function classesKey(c) { return (Array.isArray(c) ? c : []).slice().sort().join(','); }

// группировка по имени
function group(S) {
  const m = new Map();
  for (const s of S) {
    const k = normName(s.name);
    if (!m.has(k)) m.set(k, { ph14: [], ph24: [] });
    const g = m.get(k);
    if (s.source === 'PH14') g.ph14.push(s);
    else if (s.source === 'PH24') g.ph24.push(s);
  }
  return m;
}

// сравнение пары записей по «жёстким» полям
function diffPair(a, b) {
  const out = [];
  if (normName(a.school) !== normName(b.school)) out.push(['school', a.school, b.school]);
  if (a.level !== b.level) out.push(['level', a.level, b.level]);
  if (classesKey(a.classes) !== classesKey(b.classes)) out.push(['classes', classesKey(a.classes), classesKey(b.classes)]);
  if (conc(a.duration) !== conc(b.duration)) out.push(['concentration', conc(a.duration), conc(b.duration)]);
  if (normRange(a.range) !== normRange(b.range)) out.push(['range', a.range, b.range]);
  if (normTime(a.time) !== normTime(b.time)) out.push(['time', a.time, b.time]);
  if (normComp(a.components) !== normComp(b.components)) out.push(['components', a.components, b.components]);
  return out;
}

function pairs(S) {
  const g = group(S);
  const both = [], singles = [];
  for (const [k, v] of g) {
    if (v.ph14.length && v.ph24.length) {
      // берём первую запись каждой редакции (дублей быть не должно после -1..-5)
      both.push({ key: k, a: v.ph14[0], b: v.ph24[0], dupes: (v.ph14.length > 1 || v.ph24.length > 1) });
    } else {
      singles.push({ key: k, only: v.ph14.length ? 'PH14' : 'PH24', rec: (v.ph14[0] || v.ph24[0]) });
    }
  }
  return { both, singles };
}

function main() {
  const cmd = process.argv[2] || 'diff';
  const S = loadSpells();
  const { both, singles } = pairs(S);

  if (cmd === 'diff' || cmd === 'report') {
    const flagged = both.map(p => ({ ...p, d: diffPair(p.a, p.b) })).filter(p => p.d.length || p.dupes);
    const lines = [];
    lines.push(`Пар «есть в обеих редакциях»: ${both.length}. С расхождениями полей: ${flagged.length}.`);
    lines.push('');
    for (const p of flagged) {
      lines.push(`### ${p.a.name}  (PH14 id${p.a.id} ↔ PH24 id${p.b.id})${p.dupes ? '  ⚠️ДУБЛЬ' : ''}`);
      for (const [f, av, bv] of p.d) lines.push(`  - ${f}: PH14=\`${av}\`  |  PH24=\`${bv}\``);
      lines.push('');
    }
    const text = lines.join('\n');
    if (cmd === 'report') {
      if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
      const out = path.join(DOCS_DIR, 'L_XEDITION.md');
      fs.writeFileSync(out, '# Кросс-редакционная сверка PH14↔PH24 (SPELL-AUDIT-6)\n\n' + text + '\n', 'utf8');
      console.log('Записано:', path.relative(ROOT, out));
    } else {
      console.log(text);
    }
    return;
  }

  if (cmd === 'singles') {
    const byEd = { PH14: [], PH24: [] };
    singles.forEach(s => byEd[s.only].push(s));
    for (const ed of ['PH14', 'PH24']) {
      console.log(`\n=== только ${ed}: ${byEd[ed].length} ===`);
      byEd[ed].sort((a, b) => a.rec.level - b.rec.level)
        .forEach(s => console.log(`  L${s.rec.level} id${s.rec.id}  ${s.rec.name}`));
    }
    return;
  }

  console.error('Команды: diff | singles | report');
  process.exit(1);
}

main();
