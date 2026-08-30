#!/usr/bin/env node
// Генератор docs/map.md — карта крупных файлов (секции CSS, блоки разметки,
// функции и таблицы данных со строками). Нужна, чтобы читать файлы диапазонами
// вместо разведочных чтений целиком.
// CLI: node tools/gen-map.js [--check]   (--check: не писать, только сверить)
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'map.md');

const JS_FILES = [
  'rules.js', 'app-core.js', 'app-migrate.js', 'app-builds.js', 'app-io.js',
  'app-combat.js', 'app-conditions.js', 'app-cast-effects.js', 'app-proficiencies.js',
  'app-hp.js', 'app-inventory.js', 'app-spells.js', 'app-party.js', 'app-notes.js',
  'app-ui.js', 'app-dice.js', 'app-settings.js', 'app-asi.js', 'app-progress.js',
  'app-desktop.js', 'app-help.js', 'app-backup.js', 'app-pdf.js', 'app-home.js',
];
const DATA_FILES = [
  'data.js', 'data-2024.js', 'spells.js', 'spell-effects.js', 'character-builds.js',
  'build-notes-data.js', 'class-choices.js', 'subclass-choices-data.js',
  'magic-items.js', 'gear-catalog.js', 'glossary-data.js', 'monsters-srd.js', 'npc-srd.js',
];

function lines(file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8').split(/\r?\n/);
}

// --- style.css: секции /* ===== Название ===== */ ---
function cssSections() {
  const L = lines('style.css');
  if (!L) return [];
  const marks = [];
  L.forEach(function (s, i) {
    if (!/^\/\*\s*=+/.test(s)) return;
    let title = s.replace(/^\/\*\s*=+/, '').replace(/=+\s*\*\/\s*$/, '').replace(/=+\s*$/, '').replace(/\*\/\s*$/, '').trim();
    // Многострочная шапка: название лежит на следующей строке комментария
    for (let k = 1; !title && k < 4 && i + k < L.length; k++) {
      title = String(L[i + k]).replace(/^\s*/, '').replace(/=+\s*\*\/\s*$/, '').replace(/^=+/, '').replace(/=+$/, '').trim();
    }
    marks.push({ line: i + 1, title: title || '(без названия)' });
  });
  return marks.map(function (m, i) {
    const end = i + 1 < marks.length ? marks[i + 1].line - 1 : L.length;
    return { from: m.line, to: end, title: m.title };
  });
}

// --- index.html: блоки с id на малом отступе ---
function htmlBlocks() {
  const L = lines('index.html');
  if (!L) return [];
  const out = [];
  L.forEach(function (s, i) {
    const m = s.match(/^(\s{0,4})<(div|section|main|nav|header|footer|dialog|template)\b[^>]*\sid="([^"]+)"/);
    if (m) out.push({ line: i + 1, tag: m[2], id: m[3] });
  });
  for (let i = 0; i < out.length; i++) out[i].to = i + 1 < out.length ? out[i + 1].line - 1 : L.length;
  return out;
}

// --- js: функции верхнего уровня (в т.ч. внутри IIFE, отступ до 2) ---
function jsFuncs(file) {
  const L = lines(file);
  if (!L) return null;
  const out = [];
  L.forEach(function (s, i) {
    const m = s.match(/^\s{0,2}function\s+([A-Za-z0-9_$]+)/);
    if (m) out.push(m[1] + ':' + (i + 1));
  });
  return { total: L.length, list: out };
}

// --- файлы данных: константы верхнего уровня ---
function dataConsts(file) {
  const L = lines(file);
  if (!L) return null;
  const out = [];
  L.forEach(function (s, i) {
    const m = s.match(/^(?:const|var|let)\s+([A-Za-z0-9_$]+)\s*=/);
    if (m) out.push(m[1] + ':' + (i + 1));
  });
  return { total: L.length, list: out };
}

function build() {
  const body = [];
  const push = (s) => body.push(s);

  push('## style.css — секции');
  push('');
  push('| Строки | Секция |');
  push('|---|---|');
  cssSections().forEach(function (s) {
    push('| ' + s.from + '–' + s.to + ' | ' + s.title.replace(/\|/g, '/') + ' |');
  });
  push('');

  push('## index.html — блоки верхнего уровня (`#id:строки`)');
  push('');
  const hb = htmlBlocks().map(function (b) { return '#' + b.id + ':' + b.line + '-' + b.to; });
  for (let i = 0; i < hb.length; i += 8) push(hb.slice(i, i + 8).join(' ') + '  ');
  push('');

  push('## Функции по файлам (`имя:строка`)');
  push('');
  JS_FILES.forEach(function (f) {
    const r = jsFuncs(f);
    if (!r || !r.list.length) return;
    push('**' + f + '** (' + r.total + ' строк, ' + r.list.length + ' функций)  ');
    push(r.list.join(' ') + '');
    push('');
  });

  push('## Данные — константы верхнего уровня (`имя:строка`)');
  push('');
  DATA_FILES.forEach(function (f) {
    const r = dataConsts(f);
    if (!r || !r.list.length) return;
    push('**' + f + '** (' + r.total + ' строк)  ');
    push(r.list.join(' ') + '');
    push('');
  });

  // Оглавление со строками внутри самого map.md считаем вторым проходом.
  const head = [
    '# Карта кода',
    '',
    'Сгенерировано `node tools/gen-map.js` — руками не править, перегенерировать после',
    'крупных правок `style.css`, `index.html` или добавления функций.',
    '',
    'Как пользоваться: найти нужный диапазон здесь → `Read` с `offset`/`limit` по нему,',
    'вместо чтения файла целиком или разведочных grep. Сам этот файл тоже читается',
    'диапазонами — оглавление ниже указывает строки внутри map.md.',
    '',
    '## Оглавление',
    '',
    '| Раздел | Строки в map.md |',
    '|---|---|',
  ];
  const marker = [];
  body.forEach(function (l, i) { if (/^## /.test(l)) marker.push({ t: l.slice(3), i }); });
  const tocLen = head.length + marker.length + 2;
  const toc = marker.map(function (m, k) {
    const start = tocLen + m.i + 1;
    const end = k + 1 < marker.length ? tocLen + marker[k + 1].i : tocLen + body.length;
    return '| ' + m.t + ' | ' + start + '–' + end + ' |';
  });
  return head.concat(toc, ['', ''], body).join('\n') + '\n';
}

const text = build();
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== text) { console.error('docs/map.md устарела — запусти node tools/gen-map.js'); process.exit(1); }
  console.log('docs/map.md актуальна');
  process.exit(0);
}
fs.writeFileSync(OUT, text, 'utf8');
console.log('docs/map.md: ' + text.split('\n').length + ' строк, ' + text.length + ' символов');
