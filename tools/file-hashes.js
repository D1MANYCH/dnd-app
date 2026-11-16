#!/usr/bin/env node
// CLI: node tools/file-hashes.js [--write] [root]
// ОБН-1: хэши файлов прекеша для дельта-обновления. Блок FILE_HASHES в sw.js —
// «путь из FILES_TO_CACHE → первые 20 hex-знаков SHA-256». Service Worker при
// установке сверяет по ним файлы прежнего кеша и качает только изменённые.
// Хэш считается по содержимому с LF: рабочая копия на Windows лежит в CRLF,
// а в git и на GitHub Pages — LF.
// Без флага — сверка (exit 1 при расхождении), --write — перезаписать блок.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HASH_LEN = 20;
const LIST_RE = /FILES_TO_CACHE\s*=\s*\[([\s\S]*?)\]\s*;/;
const BLOCK_RE = /\/\/ Хэши файлов прекеша[^\n]*\r?\nconst FILE_HASHES = \{[\s\S]*?\r?\n\};/;
const PAIR_RE = /^\s*'([^']+)'\s*:\s*'([0-9a-f]+)'/;

function parseList(swSrc) {
  const fm = swSrc.match(LIST_RE);
  if (!fm) throw new Error('sw.js: не найден массив FILES_TO_CACHE');
  const list = [];
  const strRe = /["']([^"']+)["']/g;
  const body = fm[1].replace(/\/\/[^\n]*/g, '');
  let sm;
  while ((sm = strRe.exec(body)) !== null) list.push(sm[1]);
  return list;
}

function diskPath(key) {
  return key.replace(/^\.\//, '') || 'index.html';
}

function hashFile(root, key) {
  let buf = fs.readFileSync(path.join(root, diskPath(key)));
  if (buf.subarray(0, 8000).indexOf(0) === -1) {
    buf = Buffer.from(buf.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
  }
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, HASH_LEN);
}

function computeHashes(root, swSrc) {
  const out = {};
  parseList(swSrc).forEach(function (key) { out[key] = hashFile(root, key); });
  return out;
}

function readHashes(swSrc) {
  const bm = swSrc.match(BLOCK_RE);
  if (!bm) return null;
  const out = {};
  bm[0].split('\n').forEach(function (line) {
    const pm = line.match(PAIR_RE);
    if (pm) out[pm[1]] = pm[2];
  });
  return out;
}

function renderBlock(hashes, eol) {
  const keys = Object.keys(hashes);
  return ['// Хэши файлов прекеша — пишет tools/file-hashes.js (через /bump), руками не править.',
    'const FILE_HASHES = {']
    .concat(keys.map(function (k, i) {
      return "  '" + k + "': '" + hashes[k] + "'" + (i < keys.length - 1 ? ',' : '');
    }))
    .concat(['};'])
    .join(eol);
}

function applyHashes(root, swSrc) {
  const eol = swSrc.indexOf('\r\n') !== -1 ? '\r\n' : '\n';
  const block = renderBlock(computeHashes(root, swSrc), eol);
  if (BLOCK_RE.test(swSrc)) return swSrc.replace(BLOCK_RE, function () { return block; });
  const fm = swSrc.match(LIST_RE);
  const at = fm.index + fm[0].length;
  return swSrc.slice(0, at) + eol + eol + block + swSrc.slice(at);
}

function writeHashes(root) {
  const file = path.join(root, 'sw.js');
  const src = fs.readFileSync(file, 'utf8');
  const out = applyHashes(root, src);
  if (out !== src) fs.writeFileSync(file, out);
  return { count: Object.keys(readHashes(out)).length, changed: out !== src };
}

function diffHashes(root, swSrc) {
  const have = readHashes(swSrc);
  if (!have) return ['sw.js: не найден блок FILE_HASHES'];
  const want = computeHashes(root, swSrc);
  const stale = [], missing = [];
  Object.keys(want).forEach(function (k) {
    if (!(k in have)) missing.push(k);
    else if (have[k] !== want[k]) stale.push(k);
  });
  const extra = Object.keys(have).filter(function (k) { return !(k in want); });
  const problems = [];
  if (stale.length) problems.push('sw.js: хэш в FILE_HASHES не совпадает с файлом (' + stale.length + '): ' + stale.join(', '));
  if (missing.length) problems.push('sw.js: в FILE_HASHES нет путей из FILES_TO_CACHE (' + missing.length + '): ' + missing.join(', '));
  if (extra.length) problems.push('sw.js: в FILE_HASHES лишние пути (' + extra.length + '): ' + extra.join(', '));
  return problems;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const write = args.indexOf('--write') !== -1;
  const rootArg = args.filter(function (a) { return a !== '--write'; })[0];
  const root = rootArg ? path.resolve(rootArg) : path.join(__dirname, '..');
  try {
    if (write) {
      const res = writeHashes(root);
      console.log('[hashes] ' + res.count + ' файлов, sw.js ' + (res.changed ? 'обновлён' : 'без изменений'));
    } else {
      const problems = diffHashes(root, fs.readFileSync(path.join(root, 'sw.js'), 'utf8'));
      if (problems.length) {
        console.error('[hashes] FAIL:');
        problems.forEach(function (p, i) { console.error('  ' + (i + 1) + '. ' + p); });
        console.error('Обновить: node tools/file-hashes.js --write');
        process.exit(1);
      }
      console.log('[hashes] OK');
    }
  } catch (e) {
    console.error('ERROR: ' + e.message);
    process.exit(1);
  }
}

module.exports = { HASH_LEN, parseList, computeHashes, readHashes, applyHashes, writeHashes, diffHashes };
