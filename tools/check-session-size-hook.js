#!/usr/bin/env node
// Stop hook: предупреждение о разросшейся сессии.
// Цена запроса линейна размеру контекста, а контекст растёт с каждым вызовом —
// сессия на 800 запросов стоит вчетверо дороже четырёх сессий по 200.
// Ничего не блокирует (всегда exit 0), печатает одну строку на пороге.
// Заглушить: DND_NO_STOP_HINT=1 или DND_NO_SESSION_HINT=1.
'use strict';

const fs = require('fs');

const WARN_REQ = 120;   // мягкий порог: пора планировать /carry
const HARD_REQ = 150;   // жёсткий: резать сессию
const WARN_CTX = 150000;
const HARD_CTX = 200000;

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

(async () => {
  const raw = await readStdin();
  if (process.env.DND_NO_STOP_HINT || process.env.DND_NO_SESSION_HINT) process.exit(0);

  let input = {};
  try { input = JSON.parse(raw || '{}'); } catch (e) { process.exit(0); }
  const p = input.transcript_path;
  if (!p || !fs.existsSync(p)) process.exit(0);

  let text = '';
  try { text = fs.readFileSync(p, 'utf8'); } catch (e) { process.exit(0); }

  // Считаем только основную сессию: строки сабагентов (isSidechain) в том же
  // файле, но их контекст живёт отдельно и на цену главной сессии не влияет.
  const lines = text.split(String.fromCharCode(10));
  let req = 0, ctx = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.indexOf('"cache_read_input_tokens"') === -1) continue;
    if (l.indexOf('"isSidechain":true') !== -1) continue;
    req++;
  }
  for (let i = lines.length - 1; i >= 0 && !ctx; i--) {
    const l = lines[i];
    if (l.indexOf('"cache_read_input_tokens"') === -1) continue;
    if (l.indexOf('"isSidechain":true') !== -1) continue;
    try {
      const u = JSON.parse(l).message.usage;
      ctx = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
    } catch (e) { /* строка не разобралась — берём предыдущую */ }
  }

  const hard = req >= HARD_REQ || ctx >= HARD_CTX;
  const warn = req >= WARN_REQ || ctx >= WARN_CTX;
  if (!warn) process.exit(0);

  const size = req + ' запросов, контекст ' + Math.round(ctx / 1000) + 'k';
  const msg = hard
    ? '⛔ Сессия разрослась: ' + size + '. Закрыть: /carry → /clear. Дальше каждый вызов дорожает.'
    : '⚠ Сессия: ' + size + '. Подходит порог ' + HARD_REQ + ' запросов — планируй /carry и /clear.';

  process.stdout.write(JSON.stringify({ systemMessage: msg }) + '\n');
  console.error(msg);
  process.exit(0);
})();
