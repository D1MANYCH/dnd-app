#!/usr/bin/env node
// PostToolUse hook: правка sw.js без бампа CACHE_NAME блокируется (exit 2).
// Условие — сравнение с версией в HEAD: если CACHE_NAME уже отличается,
// значит бамп сделан и правка проходит. Без git/HEAD — блокируем как раньше.
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const RE_CACHE = /CACHE_NAME\s*=\s*['"]([^'"]+)['"]/;

function readStdin() {
  return new Promise((resolve) => {
    let buf = '';
    if (process.stdin.isTTY) return resolve('');
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (d) => (buf += d));
    process.stdin.on('end', () => resolve(buf));
    process.stdin.on('error', () => resolve(buf));
  });
}

function cacheNameOf(text) {
  const m = String(text || '').match(RE_CACHE);
  return m ? m[1] : null;
}

function headCacheName() {
  const res = spawnSync('git', ['-C', ROOT, 'show', 'HEAD:sw.js'], {
    encoding: 'utf8',
    timeout: 10000,
    maxBuffer: 4 * 1024 * 1024,
  });
  if (res.error || res.status !== 0) return null;
  return cacheNameOf(res.stdout);
}

(async () => {
  const raw = await readStdin();
  let payload = {};
  try { payload = raw ? JSON.parse(raw) : {}; } catch { payload = {}; }
  const fp = payload && payload.tool_input && payload.tool_input.file_path;
  if (!fp || !/sw\.js$/i.test(String(fp).replace(/\\/g, '/'))) process.exit(0);
  if (!fs.existsSync(fp)) process.exit(0);

  const now = cacheNameOf(fs.readFileSync(fp, 'utf8'));
  const head = headCacheName();

  if (head && now && head !== now) process.exit(0);

  console.error(
    'sw.js: CACHE_NAME не бампнут (текущий=' + (now || '?') +
    (head ? ', в HEAD=' + head : ', HEAD недоступен') + '). Бампнуть: /bump patch "<changelog>"'
  );
  process.exit(2);
})();
