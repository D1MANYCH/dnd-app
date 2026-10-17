#!/usr/bin/env node
// CLI: node tools/check-typo.js [root] [--report[=kind]] [--update-baseline]
// DS-4: ratchet типографики видимых строк (Ководство §62/97/158).
//
// Видимые строки — сегменты с кириллицей:
//   index.html — текст между тегами и атрибуты placeholder/title/aria-label/alt
//                (<script>/<style> и on*-обработчики пропускаются);
//   app-*.js, history-stack.js, start-equip-2014.js — строковые литералы вне комментариев, HTML-теги внутри вырезаются
//                (атрибуты title/placeholder/aria-label из них берутся отдельно).
//
// Счётчики (FAIL только при РОСТЕ против tools/typo-baseline.json):
//   ellipsis — «...» вместо «…» (образец кода «[...]» не в счёт);
//   range    — диапазон чисел через дефис «3-5» вместо «3–5» (кости «1к20-1» не в счёт);
//   quote    — прямые кавычки " вместо «ёлочек»;
//   nbsp     — обычный пробел после короткого предлога/союза или между числом и
//              единицей («в бою», «5 фт») вместо неразрывного U+00A0.
//
// Режимы:
//   (default)          — все счётчики против базы, exit 1 при росте.
//   --report[=kind]    — список находок файл:строка (все виды или один), exit 0.
//   --update-baseline  — перезаписать tools/typo-baseline.json текущими счётчиками.
'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const root = path.resolve(args.find(function (a) { return a[0] !== '-'; }) || path.join(__dirname, '..'));
const reportArg = args.find(function (a) { return a.indexOf('--report') === 0; });
const reportKind = reportArg && reportArg.indexOf('=') > 0 ? reportArg.split('=')[1] : null;
const BASELINE = path.join(root, 'tools', 'typo-baseline.json');

const CYR = /[А-Яа-яЁё]/;
const SHORT = 'в|во|к|ко|с|со|у|о|об|обо|и|а|но|да|на|по|за|из|от|до|не|ни|для|при|без|под|над|про|или';
const UNITS = 'фт|м|км|см|мм|зм|пм|эм|фнт|кг|мин|ч|ур|ед';
const CHECKS = {
  ellipsis: /(?<!\[)\.\.\.(?!\])/g,
  range: /(?:^|[^\wА-Яа-яЁё+\-.,\/])\d+-\d+(?![\wА-Яа-яЁё])/g,
  quote: /(?:^|[^=\w])"(?=[А-Яа-яЁё«])|[А-Яа-яЁё.!?»]"(?!>|\s*[\w-]+=)/g,
  nbsp: new RegExp('(?<=^|[\\s(«—])(?:' + SHORT + ') (?=\\S)|\\d (?:' + UNITS + ')(?![А-Яа-яЁё\\w])', 'gi'),
};

// Имена предметов в таблицах — идентификаторы (сверяются с каталогом и инвентарём),
// неразрывные пробелы в них сломали бы поиск; интерфейсные строки файла правим вручную.
const NBSP_SKIP = ['start-equip-2014.js'];

// ---------- извлечение сегментов ----------

function lineAt(src, idx) {
  var n = 1;
  for (var i = 0; i < idx; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}

var ATTR_RE = /\b(?:placeholder|title|aria-label|alt)\s*=\s*"([^"]*)"/g;

function pushText(out, text, line) {
  if (CYR.test(text)) out.push({ text: text, line: line });
}

// Строка из JS: атрибуты отдельно, теги вырезать.
function pushJsString(out, s, line) {
  var m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(s))) pushText(out, m[1], line);
  pushText(out, s.replace(/<[^>]*>/g, ' ').replace(/\b[\w-]+="[^"]*"/g, ' '), line);
}

function jsSegments(src) {
  var out = [];
  var i = 0, n = src.length, prevSig = '';
  while (i < n) {
    var c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { var e = src.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === '\'' || c === '"' || c === '`') {
      var start = i, buf = '';
      i++;
      while (i < n && src[i] !== c) {
        if (src[i] === '\\' && src[i + 1] === 'u' && /^[0-9a-f]{4}$/i.test(src.substr(i + 2, 4))) { buf += String.fromCharCode(parseInt(src.substr(i + 2, 4), 16)); i += 6; continue; }
        if (src[i] === '\\') { buf += src[i + 1] === 'n' ? '\n' : src[i + 1]; i += 2; continue; }
        if (c !== '`' && src[i] === '\n') break;
        buf += src[i]; i++;
      }
      i++;
      pushJsString(out, buf, lineAt(src, start));
      prevSig = 'a';
      continue;
    }
    // литерал регулярного выражения: «/» там, где ожидается значение
    if (c === '/' && (prevSig === '' || '(,=:[!&|?{};+-*%<>~^'.indexOf(prevSig) >= 0 || /\breturn$/.test(src.slice(Math.max(0, i - 7), i).trim()))) {
      i++;
      var inClass = false;
      while (i < n && src[i] !== '\n') {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '[') inClass = true; else if (src[i] === ']') inClass = false;
        else if (src[i] === '/' && !inClass) break;
        i++;
      }
      i++;
      prevSig = 'a';
      continue;
    }
    if (!/\s/.test(c)) prevSig = c;
    i++;
  }
  return out;
}

function htmlSegments(src) {
  var out = [];
  var clean = src.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, function (m) { return m.replace(/[^\n]/g, ' '); })
    .replace(/<!--[\s\S]*?-->/g, function (m) { return m.replace(/[^\n]/g, ' '); });
  var re = /<[^>]*>|[^<]+/g, m;
  while ((m = re.exec(clean))) {
    var tok = m[0], line = lineAt(clean, m.index);
    if (tok[0] === '<') {
      var a;
      ATTR_RE.lastIndex = 0;
      while ((a = ATTR_RE.exec(tok))) pushText(out, a[1], line);
    } else {
      pushText(out, tok, line);
    }
  }
  return out;
}

// ---------- подсчёт ----------

function collect() {
  var files = fs.readdirSync(root).filter(function (f) { return /^app-.*\.js$/.test(f); }).sort().concat(['history-stack.js', 'start-equip-2014.js']);
  files.unshift('index.html');
  var hits = { ellipsis: [], range: [], quote: [], nbsp: [] };
  files.forEach(function (f) {
    var src = fs.readFileSync(path.join(root, f), 'utf8');
    var segs = f === 'index.html' ? htmlSegments(src) : jsSegments(src);
    segs.forEach(function (s) {
      Object.keys(CHECKS).forEach(function (k) {
        if (k === 'nbsp' && NBSP_SKIP.indexOf(f) >= 0) return;
        var re = CHECKS[k], m;
        re.lastIndex = 0;
        while ((m = re.exec(s.text))) {
          hits[k].push(f + ':' + s.line + '  ' + JSON.stringify(m[0].trim()) + '  ‹' + s.text.trim().slice(0, 70) + '›');
          if (m[0] === '') re.lastIndex++;
        }
      });
    });
  });
  return hits;
}

var hits = collect();
var counts = {};
Object.keys(hits).forEach(function (k) { counts[k] = hits[k].length; });

if (reportArg) {
  Object.keys(hits).forEach(function (k) {
    if (reportKind && reportKind !== k) return;
    console.log('== ' + k + ' (' + hits[k].length + ')');
    hits[k].forEach(function (h) { console.log('  ' + h); });
  });
  process.exit(0);
}

if (args.indexOf('--update-baseline') >= 0) {
  var data = Object.assign({ comment: 'Ratchet DS-4: типографика видимых строк. CI падает только при РОСТЕ. Обновлять при снижении: node tools/check-typo.js --update-baseline' }, counts);
  fs.writeFileSync(BASELINE, JSON.stringify(data, null, 2) + '\n');
  console.log('typo-baseline обновлён: ' + JSON.stringify(counts));
  process.exit(0);
}

var base = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
var fail = false;
Object.keys(counts).forEach(function (k) {
  var b = base[k] == null ? Infinity : base[k];
  var st = counts[k] > b ? 'FAIL' : 'ok';
  if (st === 'FAIL') fail = true;
  console.log(st + '  ' + k + ': ' + counts[k] + ' (база ' + base[k] + ')' + (counts[k] < b ? ' — снизилось, запусти --update-baseline' : ''));
});
if (fail) console.log('Новые типографские нарушения: node tools/check-typo.js --report');
process.exit(fail ? 1 : 0);
