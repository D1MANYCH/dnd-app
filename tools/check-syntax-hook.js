#!/usr/bin/env node
// PostToolUse hook: после Edit/Write/MultiEdit в *.js прогоняет node --check
// и блокирует (exit 2) файл с синтаксической ошибкой.
// vendor/ пропускается — чужой вендоренный код, чинить его не нам.
'use strict';

const fs = require('fs');
const { spawnSync } = require('child_process');

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
  if (/(^|\/)vendor\//i.test(norm)) return false;
  return fs.existsSync(filePath);
}

(async () => {
  const raw = await readStdin();
  let payload = {};
  try { payload = raw ? JSON.parse(raw) : {}; } catch { payload = {}; }
  const fp = payload && payload.tool_input && payload.tool_input.file_path;
  if (!shouldRun(fp)) process.exit(0);

  const res = spawnSync(process.execPath, ['--check', fp], {
    encoding: 'utf8',
    timeout: 15000,
    maxBuffer: 4 * 1024 * 1024,
  });

  if (res.error) {
    console.error('[syntax] ERROR: ' + res.error.message);
    process.exit(0);
  }
  if (res.status === 0) process.exit(0);

  const out = (res.stderr || res.stdout || '').trim();
  const lines = out.split(/\r?\n/).filter((l) => l && !/^\s*at\s/.test(l));
  console.error('[syntax] СИНТАКСИЧЕСКАЯ ОШИБКА в ' + fp);
  console.error(lines.slice(0, 8).join('\n'));
  process.exit(2);
})();
