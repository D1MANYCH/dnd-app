#!/usr/bin/env node
// CLI: node tools/bump-version.js <patch|minor|major> "<changelog text>" [--type chore|feat|fix]
// Синхронно бампает APP_VERSION + APP_VERSION_DATE + APP_CHANGELOG[0] в data.js
// и CACHE_NAME в sw.js. Без частичной записи: если что-то не парсится — exit 1.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data.js');
const SW = path.join(ROOT, 'sw.js');

const RU_MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

function usage() {
  console.log('Usage: node tools/bump-version.js <patch|minor|major> "<changelog text>" [--type chore|feat|fix]');
  console.log('');
  console.log('Bumps:');
  console.log('  data.js: APP_VERSION, APP_VERSION_DATE, APP_CHANGELOG[0] (prepend new, demote prior to badge:"old")');
  console.log('  sw.js:   CACHE_NAME (dnd-sheet-vN -> vN+1)');
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

function main() {
  const { level, text, type } = parseArgs(process.argv);

  let dataSrc, swSrc;
  try {
    dataSrc = fs.readFileSync(DATA, 'utf8');
    swSrc = fs.readFileSync(SW, 'utf8');
  } catch (e) {
    console.error('ERROR: чтение файла: ' + e.message);
    process.exit(1);
  }

  let dataRes, swRes;
  try {
    dataRes = bumpData(dataSrc, level, text, type);
    swRes = bumpSw(swSrc);
  } catch (e) {
    console.error('ERROR: ' + e.message);
    process.exit(1);
  }

  fs.writeFileSync(DATA, dataRes.src);
  fs.writeFileSync(SW, swRes.src);

  console.log(`data.js: ${dataRes.oldVer} → ${dataRes.newVer} (date ${todayIso()})`);
  console.log(`sw.js:   v${swRes.oldN} → v${swRes.newN}`);
  console.log(`changelog: [${type}] ${text}`);
}

main();
