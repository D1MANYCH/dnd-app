#!/usr/bin/env node
// CLI: node tools/bump-version.js <patch|minor|major> "<changelog text>" [--type chore|feat|fix]
// Синхронно бампает APP_VERSION + APP_VERSION_DATE + APP_CHANGELOG[0] в data.js
// и CACHE_NAME в sw.js. Без частичной записи: если что-то не парсится — exit 1.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data.js');
const SW = path.join(ROOT, 'sw.js');
const INDEX = path.join(ROOT, 'index.html');

const RU_MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

function usage() {
  console.log('Usage: node tools/bump-version.js <patch|minor|major> "<changelog text>" [--type chore|feat|fix]');
  console.log('');
  console.log('Bumps:');
  console.log('  data.js:    APP_VERSION, APP_VERSION_DATE, APP_CHANGELOG[0] (prepend new, demote prior to badge:"old")');
  console.log('  sw.js:      CACHE_NAME (dnd-sheet-vN -> vN+1)');
  console.log('  index.html: все ?v= токены js/css → vN+1 (TOOL-2)');
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    usage();
    process.exit(0);
  }
  const level = args[0];
  if (!['patch', 'minor', 'major'].includes(level)) {
    console.error('ERROR: первый аргумент — patch|minor|major (получено: ' + level + ')');
    process.exit(1);
  }
  let type = 'chore';
  const ti = args.indexOf('--type');
  if (ti !== -1) {
    type = args[ti + 1];
    if (!['chore', 'feat', 'fix'].includes(type)) {
      console.error('ERROR: --type должен быть chore|feat|fix');
      process.exit(1);
    }
    args.splice(ti, 2);
  }
  const text = args[1];
  if (!text || typeof text !== 'string') {
    console.error('ERROR: второй аргумент — строка changelog в кавычках');
    process.exit(1);
  }
  return { level, text, type };
}

function bumpSemver(v, level) {
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) throw new Error('APP_VERSION не SemVer: ' + v);
  let [_, X, Y, Z] = m;
  X = +X; Y = +Y; Z = +Z;
  if (level === 'major') { X++; Y = 0; Z = 0; }
  else if (level === 'minor') { Y++; Z = 0; }
  else { Z++; }
  return `${X}.${Y}.${Z}`;
}

// Сравнение SemVer: >0 если a новее b, <0 если старше, 0 если равны. Нечисловой формат → 0 (не блокируем).
function semverCmp(a, b) {
  const pa = String(a).match(/^(\d+)\.(\d+)\.(\d+)$/), pb = String(b).match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!pa || !pb) return 0;
  for (let i = 1; i <= 3; i++) { const d = (+pa[i]) - (+pb[i]); if (d) return d < 0 ? -1 : 1; }
  return 0;
}

function todayIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function todayRu() {
  const d = new Date();
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function bumpData(src, level, text, type) {
  const verRe = /(const\s+APP_VERSION\s*=\s*")([^"]+)(";)/;
  const vm = src.match(verRe);
  if (!vm) throw new Error('не найден APP_VERSION в data.js');
  const oldVer = vm[2];
  const newVer = bumpSemver(oldVer, level);

  const dateRe = /(const\s+APP_VERSION_DATE\s*=\s*")([^"]+)(";)/;
  if (!dateRe.test(src)) throw new Error('не найден APP_VERSION_DATE в data.js');

  const changelogRe = /const\s+APP_CHANGELOG\s*=\s*\[/;
  const cm = src.match(changelogRe);
  if (!cm) throw new Error('не найден APP_CHANGELOG в data.js');
  const insertAt = cm.index + cm[0].length;

  // Найти первый объект и демотнуть badge: "new" -> "old"
  // Искать только в первом блоке (от insertAt до закрытия первого объекта)
  const after = src.slice(insertAt);
  const firstObjEnd = after.indexOf('},');
  if (firstObjEnd === -1) throw new Error('не найден первый блок APP_CHANGELOG');
  const firstBlock = after.slice(0, firstObjEnd + 2);
  const demoted = firstBlock.replace(/(badge\s*:\s*")new(")/, '$1old$2');

  const newEntry =
    '\n  {\n' +
    '    version: "' + newVer + '",\n' +
    '    date: "' + todayRu() + '",\n' +
    '    badge: "new",\n' +
    '    changes: [\n' +
    '      { type: "' + type + '", text: ' + JSON.stringify(text) + ' }\n' +
    '    ]\n' +
    '  },';

  let out = src.slice(0, insertAt) + newEntry + demoted + after.slice(firstObjEnd + 2);
  out = out.replace(verRe, `$1${newVer}$3`);
  out = out.replace(dateRe, `$1${todayIso()}$3`);

  return { src: out, oldVer, newVer };
}

function bumpSw(src) {
  const re = /(CACHE_NAME\s*=\s*['"]dnd-sheet-v)(\d+)(['"])/;
  const m = src.match(re);
  if (!m) throw new Error('не найден CACHE_NAME=dnd-sheet-vN в sw.js');
  const oldN = +m[2];
  const newN = oldN + 1;
  const out = src.replace(re, `$1${newN}$3`);
  return { src: out, oldN, newN };
}

// TOOL-2: единый счётчик ?v= токенов в index.html.
// После bump CACHE_NAME до vN — все js/css токены переписываются на v<N>.
// Webp/png ассеты НЕ трогаем — у них свой редкий цикл (общий v=2 для класс-иконок).
function bumpHtmlTokens(src, newN) {
  const tokenRe = /(\.(?:js|css)\?v=)[^"'\s>]+/g;
  let count = 0;
  const out = src.replace(tokenRe, function(_match, prefix) {
    count++;
    return prefix + 'v' + newN;
  });
  if (count === 0) {
    throw new Error('не найдено ни одного js/css ?v= токена в index.html');
  }
  return { src: out, count };
}

// Проверка remote перед bump (BUGFIX-9 follow-up): если origin/main опережает
// по APP_VERSION или CACHE_NAME — остановиться, чтобы не возник дубль номера.
// Soft-fail при отсутствии git/origin или сети — релиз офлайн не блокируется.
function checkRemote() {
  let remoteData, remoteSw;
  try {
    execFileSync('git', ['fetch', 'origin', 'main', '--quiet'], { cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe'] });
    remoteData = execFileSync('git', ['show', 'origin/main:data.js'], { cwd: ROOT }).toString('utf8');
    remoteSw   = execFileSync('git', ['show', 'origin/main:sw.js'],   { cwd: ROOT }).toString('utf8');
  } catch (e) {
    console.warn('WARN: пропуск remote-check (' + String(e.message || e).split('\n')[0] + ')');
    return;
  }
  const localData = fs.readFileSync(DATA, 'utf8');
  const localSw   = fs.readFileSync(SW, 'utf8');
  const verRe = /const\s+APP_VERSION\s*=\s*"([^"]+)"/;
  const cacheRe = /CACHE_NAME\s*=\s*['"]dnd-sheet-v(\d+)/;
  const lv = (localData.match(verRe)  || [])[1];
  const rv = (remoteData.match(verRe) || [])[1];
  const lc = +((localSw.match(cacheRe)  || [])[1] || 0);
  const rc = +((remoteSw.match(cacheRe) || [])[1] || 0);
  const conflicts = [];
  if (rv && lv && semverCmp(rv, lv) > 0) conflicts.push('APP_VERSION: local=' + lv + ', origin/main=' + rv);
  if (rc && lc && rc > lc)   conflicts.push('CACHE_NAME: local=v' + lc + ', origin/main=v' + rc);
  if (conflicts.length) {
    console.error('ERROR: origin/main опережает локальную версию:');
    conflicts.forEach(function(c) { console.error('  - ' + c); });
    console.error('Сначала: git pull origin main, затем повторить bump (получит свежий номер поверх remote).');
    process.exit(1);
  }
}

function main() {
  const { level, text, type } = parseArgs(process.argv);
  checkRemote();

  let dataSrc, swSrc, indexSrc;
  try {
    dataSrc = fs.readFileSync(DATA, 'utf8');
    swSrc = fs.readFileSync(SW, 'utf8');
    indexSrc = fs.readFileSync(INDEX, 'utf8');
  } catch (e) {
    console.error('ERROR: чтение файла: ' + e.message);
    process.exit(1);
  }

  let dataRes, swRes, indexRes;
  try {
    dataRes = bumpData(dataSrc, level, text, type);
    swRes = bumpSw(swSrc);
    indexRes = bumpHtmlTokens(indexSrc, swRes.newN);
  } catch (e) {
    console.error('ERROR: ' + e.message);
    process.exit(1);
  }

  fs.writeFileSync(DATA, dataRes.src);
  fs.writeFileSync(SW, swRes.src);
  fs.writeFileSync(INDEX, indexRes.src);

  console.log(`data.js:    ${dataRes.oldVer} → ${dataRes.newVer} (date ${todayIso()})`);
  console.log(`sw.js:      v${swRes.oldN} → v${swRes.newN}`);
  console.log(`index.html: ${indexRes.count} ?v= токенов → v${swRes.newN}`);
  console.log(`changelog: [${type}] ${text}`);
}

main();
