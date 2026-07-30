#!/usr/bin/env node
// Stop hook: напоминание о незакоммиченных правках в конце хода.
// Ничего не коммитит и не блокирует (всегда exit 0) — только печатает одну строку.
// Заглушить: DND_NO_STOP_HINT=1.
'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MAX_NAMES = 5;

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

function changedFiles() {
  const res = spawnSync('git', ['-C', ROOT, 'status', '--porcelain'], {
    encoding: 'utf8',
    timeout: 10000,
    maxBuffer: 4 * 1024 * 1024,
  });
  if (res.error || res.status !== 0) return null;
  return String(res.stdout || '')
    .split('\n')
    .map((l) => l.slice(3).trim())
    .filter(Boolean);
}

function branch() {
  const res = spawnSync('git', ['-C', ROOT, 'rev-parse', '--abbrev-ref', 'HEAD'], {
    encoding: 'utf8',
    timeout: 10000,
  });
  if (res.error || res.status !== 0) return null;
  return String(res.stdout || '').trim();
}

(async () => {
  await readStdin();
  if (process.env.DND_NO_STOP_HINT) process.exit(0);

  const files = changedFiles();
  if (!files || !files.length) process.exit(0);

  const shown = files.slice(0, MAX_NAMES).join(', ');
  const tail = files.length > MAX_NAMES ? ' и ещё ' + (files.length - MAX_NAMES) : '';
  const br = branch();

  const msg =
    '⚠ Незакоммичено: ' + files.length + ' — ' + shown + tail +
    (br ? ' (ветка ' + br + ')' : '') +
    '. Выпустить: /ship "<changelog>"';

  process.stdout.write(JSON.stringify({ systemMessage: msg }) + '\n');
  console.error(msg);
  process.exit(0);
})();
