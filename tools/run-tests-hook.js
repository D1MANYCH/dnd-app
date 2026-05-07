#!/usr/bin/env node
// PostToolUse hook: после Edit/Write/MultiEdit в продуктовый *.js прогоняет
// node tests/headless-node.js и печатает компактный итог в stderr.
// Warn-режим: всегда exit 0, не блокирует промежуточные состояния.
'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

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

function shouldRun(filePath) {
  if (!filePath) return false;
  const norm = String(filePath).replace(/\\/g, '/');
  if (!/\.js$/i.test(norm)) return false;
  if (/(^|\/)tests\//i.test(norm)) return false;
  if (/(^|\/)vendor\//i.test(norm)) return false;
  if (/(^|\/)assets\//i.test(norm)) return false;
  if (/tools\/run-tests-hook\.js$/i.test(norm)) return false;
  return true;
}

(async () => {
  const raw = await readStdin();
  let payload = {};
  try { payload = raw ? JSON.parse(raw) : {}; } catch { payload = {}; }
  const fp = payload && payload.tool_input && payload.tool_input.file_path;
  if (!shouldRun(fp)) process.exit(0);

  const res = spawnSync(process.execPath, ['tests/headless-node.js'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 30000,
    maxBuffer: 16 * 1024 * 1024,
  });

  if (res.error) {
    console.error('[tests] ERROR: ' + res.error.message);
    process.exit(0);
  }
  const out = (res.stdout || '') + '\n' + (res.stderr || '');
  const m = out.match(/Итого:\s*(\d+)\s*OK\s*\/\s*(\d+)\s*FAIL\s*из\s*(\d+)/);
  if (!m) {
    console.error('[tests] ERROR: не удалось распарсить вывод (exit=' + res.status + ')');
    process.exit(0);
  }
  const pass = +m[1], fail = +m[2], total = +m[3];
  if (fail === 0) {
    console.error('[tests] PASS ' + pass + '/' + total);
  } else {
    const f = out.match(/desc:\s*'([^']+)',\s*ok:\s*false/);
    const desc = f ? f[1] : '?';
    console.error('[tests] FAIL: ' + desc + ' (' + fail + '/' + total + ')');
  }
  process.exit(0);
})();
