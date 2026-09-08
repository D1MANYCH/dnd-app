#!/usr/bin/env node
// Отчёт по записи в кеш: куда уходит вторая по величине статья счёта.
//
// Чтение кеша дешёвое и растёт с длиной сессии — это лечится /carry → /clear.
// Запись в кеш стоит в 12–20 раз дороже чтения за токен и от длины сессии
// зависит слабо: платить приходится каждый раз, когда кеш протух и префикс
// контекста пишется заново. Протухает он по TTL (1 час, при овераже 5 минут),
// поэтому пауза в работе над большой сессией стоит дороже, чем кажется:
// вернуться через час к сессии на 200k — это 200k по ставке записи.
//
// Скрипт группирует запись по паузе перед запросом и показывает, подтверждается
// ли это на реальных транскриптах.
//
// CLI: node tools/cache-write-report.js [--project <подстрока>] [--top N]
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// $/Mtok, Opus 5. Запись тарифицируется по TTL: 5m — 1.25 базового входа, 1h — 2.
const PRICE = { in: 5, out: 25, read: 0.5, write5m: 6.25, write1h: 10 };

// Границы бакетов по паузе перед запросом, в минутах.
const BUCKETS = [
  { name: 'подряд (<1 мин)', max: 1 },
  { name: 'пауза 1–5 мин', max: 5 },
  { name: 'пауза 5–60 мин', max: 60 },
  { name: 'пауза >60 мин', max: Infinity }
];

function parseArgs(argv) {
  const a = { project: null, top: 10 };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--project') a.project = argv[++i];
    else if (argv[i] === '--top') a.top = parseInt(argv[++i], 10) || 10;
  }
  return a;
}

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.jsonl')) out.push(p);
  }
  return out;
}

function money(v) { return '$' + v.toFixed(2); }
function pct(v, total) { return total ? (v / total * 100).toFixed(1) + '%' : '0%'; }
function k(v) { return Math.round(v / 1000) + 'k'; }
function pad(s, n) { s = String(s); return s + ' '.repeat(Math.max(0, n - s.length)); }
function padL(s, n) { s = String(s); return ' '.repeat(Math.max(0, n - s.length)) + s; }

const args = parseArgs(process.argv);
const root = path.join(os.homedir(), '.claude', 'projects');
let files = walk(root, []);
if (args.project) files = files.filter(function (f) { return f.indexOf(args.project) !== -1; });

if (!files.length) {
  console.error('Транскрипты не найдены: ' + root + (args.project ? ' (фильтр: ' + args.project + ')' : ''));
  process.exit(1);
}

const stats = BUCKETS.map(function (b) {
  return { name: b.name, max: b.max, req: 0, write: 0, read: 0, ctxSum: 0 };
});
const totals = { req: 0, read: 0, write: 0, write5m: 0, write1h: 0, out: 0, in: 0, sessions: 0, starts: 0, startWrite: 0 };
const worst = [];   // самые дорогие одиночные записи

for (const f of files) {
  let text;
  try { text = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }

  let prevTs = null;
  let seen = 0;

  for (const line of text.split('\n')) {
    if (line.indexOf('"cache_read_input_tokens"') === -1) continue;
    if (line.indexOf('"isSidechain":true') !== -1) continue;   // у сабагента свой контекст

    let rec;
    try { rec = JSON.parse(line); } catch (e) { continue; }
    const u = rec.message && rec.message.usage;
    if (!u) continue;

    const read = u.cache_read_input_tokens || 0;
    const write = u.cache_creation_input_tokens || 0;
    const cc = u.cache_creation || {};
    const w1h = cc.ephemeral_1h_input_tokens || 0;
    const w5m = cc.ephemeral_5m_input_tokens || 0;
    const ctx = (u.input_tokens || 0) + read + write;
    const ts = rec.timestamp ? Date.parse(rec.timestamp) : NaN;

    totals.req++;
    totals.read += read;
    totals.write += write;
    totals.write1h += w1h;
    totals.write5m += w5m;
    totals.out += u.output_tokens || 0;
    totals.in += u.input_tokens || 0;
    seen++;

    // Первый запрос сессии считаем отдельно: там кеша заведомо нет и
    // сравнивать его с «паузой» некорректно.
    if (prevTs === null || !isFinite(ts)) {
      if (prevTs === null) { totals.starts++; totals.startWrite += write; }
      if (isFinite(ts)) prevTs = ts;
      continue;
    }

    const gapMin = (ts - prevTs) / 60000;
    prevTs = ts;

    for (const s of stats) {
      if (gapMin < s.max) {
        s.req++; s.write += write; s.read += read; s.ctxSum += ctx;
        break;
      }
    }

    if (gapMin >= 5 && write > 0) {
      worst.push({ file: path.basename(f), gap: gapMin, write: write, ctx: ctx, ts: rec.timestamp });
    }
  }
  if (seen) totals.sessions++;
}

const costRead = totals.read / 1e6 * PRICE.read;
const costW5m = totals.write5m / 1e6 * PRICE.write5m;
const costW1h = totals.write1h / 1e6 * PRICE.write1h;
// Записи без разбивки по TTL (старые транскрипты) считаем по 5m — консервативно.
const wUnknown = Math.max(0, totals.write - totals.write5m - totals.write1h);
const costWU = wUnknown / 1e6 * PRICE.write5m;
const costWrite = costW5m + costW1h + costWU;
const costOut = totals.out / 1e6 * PRICE.out;
const costIn = totals.in / 1e6 * PRICE.in;
const costAll = costRead + costWrite + costOut + costIn;

console.log('');
console.log('Файлов: ' + files.length + ' | сессий: ' + totals.sessions + ' | запросов: ' + totals.req);
console.log('');
console.log('СТАТЬИ РАСХОДА');
console.log('  ' + pad('статья', 22) + padL('токены', 10) + padL('стоимость', 12) + padL('доля', 8));
const rows = [
  ['чтение кеша', totals.read, costRead],
  ['запись кеша (1h)', totals.write1h, costW1h],
  ['запись кеша (5m)', totals.write5m, costW5m],
  ['запись кеша (н/д TTL)', wUnknown, costWU],
  ['вход без кеша', totals.in, costIn],
  ['выход', totals.out, costOut]
];
for (const r of rows) {
  if (!r[1]) continue;
  console.log('  ' + pad(r[0], 22) + padL((r[1] / 1e9).toFixed(3) + 'B', 10) + padL(money(r[2]), 12) + padL(pct(r[2], costAll), 8));
}
console.log('  ' + pad('ИТОГО', 22) + padL('', 10) + padL(money(costAll), 12));
console.log('');

console.log('ЗАПИСЬ В КЕШ ПО ПАУЗЕ ПЕРЕД ЗАПРОСОМ');
console.log('  ' + pad('бакет', 18) + padL('запросов', 10) + padL('запись/запрос', 15) + padL('ср. контекст', 14) + padL('доля записи', 13));
for (const s of stats) {
  const avgW = s.req ? s.write / s.req : 0;
  const avgC = s.req ? s.ctxSum / s.req : 0;
  console.log('  ' + pad(s.name, 18) + padL(s.req, 10) + padL(k(avgW), 15) + padL(k(avgC), 14) + padL(pct(s.write, totals.write), 13));
}
console.log('  ' + pad('старт сессии', 18) + padL(totals.starts, 10) + padL(k(totals.starts ? totals.startWrite / totals.starts : 0), 15) + padL('—', 14) + padL(pct(totals.startWrite, totals.write), 13));
console.log('');

// Главная проверка: после долгой паузы запись должна подскочить до размера
// контекста — это и есть переписывание протухшего префикса.
const longB = stats[stats.length - 1];
const shortB = stats[0];
if (longB.req && shortB.req) {
  const avgLong = longB.write / longB.req;
  const avgShort = shortB.write / shortB.req;
  const ratio = avgShort ? avgLong / avgShort : 0;
  const avgCtxLong = longB.ctxSum / longB.req;
  const share = avgCtxLong ? avgLong / avgCtxLong : 0;
  console.log('ВЕРДИКТ');
  console.log('  После паузы >60 мин пишется ' + k(avgLong) + ' против ' + k(avgShort) +
    ' при работе подряд — в ' + ratio.toFixed(1) + ' раза больше.');
  console.log('  Это ' + (share * 100).toFixed(0) + '% среднего контекста таких запросов' +
    (share > 0.5 ? ' — префикс переписывается целиком, TTL протухает.' : '.'));
  const overpay = (avgLong - avgShort) * longB.req / 1e6 * PRICE.write1h;
  console.log('  Переплата за паузы: ' + money(overpay) + ' (' + pct(overpay, costAll) + ' счёта).');
  console.log('');
}

if (worst.length) {
  worst.sort(function (a, b) { return b.write - a.write; });
  console.log('САМЫЕ ДОРОГИЕ ОДИНОЧНЫЕ ЗАПИСИ');
  console.log('  ' + pad('когда', 22) + padL('пауза', 10) + padL('запись', 10) + padL('цена', 9));
  for (const w of worst.slice(0, args.top)) {
    const gap = w.gap >= 60 ? (w.gap / 60).toFixed(1) + ' ч' : Math.round(w.gap) + ' мин';
    console.log('  ' + pad((w.ts || '').slice(0, 16).replace('T', ' '), 22) + padL(gap, 10) +
      padL(k(w.write), 10) + padL(money(w.write / 1e6 * PRICE.write1h), 9));
  }
  console.log('');
}
