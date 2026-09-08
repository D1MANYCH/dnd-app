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

// $/Mtok, Opus 5 — чтобы печатать цену сессии, а не только её размер.
// Запись в кеш тарифицируется по TTL: 5m — 1.25 базового входа, 1h — 2.
const PRICE = { in: 5, out: 25, read: 0.5, write5m: 6.25, write1h: 10 };

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
  let req = 0, ctx = 0, cost = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.indexOf('"cache_read_input_tokens"') === -1) continue;
    if (l.indexOf('"isSidechain":true') !== -1) continue;
    req++;
    // Размер сессии — это ещё не её цена: запись в кеш даёт треть счёта при
    // доле в токенах меньше процента. Считаем деньги, а не токены.
    try {
      const u = JSON.parse(l).message.usage;
      const cc = u.cache_creation || {};
      const w1h = cc.ephemeral_1h_input_tokens || 0;
      const w5m = cc.ephemeral_5m_input_tokens || 0;
      const wRest = Math.max(0, (u.cache_creation_input_tokens || 0) - w1h - w5m);
      cost += ((u.cache_read_input_tokens || 0) * PRICE.read +
        (u.input_tokens || 0) * PRICE.in +
        (u.output_tokens || 0) * PRICE.out +
        w1h * PRICE.write1h + (w5m + wRest) * PRICE.write5m) / 1e6;
    } catch (e) { /* строка не разобралась — цену по ней не считаем */ }
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

  const size = req + ' запросов, контекст ' + Math.round(ctx / 1000) + 'k' +
    (cost >= 0.5 ? ', ≈$' + cost.toFixed(2) + ' по тарифам API' : '');
  const msg = hard
    ? '⛔ Сессия разрослась: ' + size + '. Закрыть: /carry → /clear. Дальше каждый вызов дорожает.'
    : '⚠ Сессия: ' + size + '. Подходит порог ' + HARD_REQ + ' запросов — планируй /carry и /clear.';

  process.stdout.write(JSON.stringify({ systemMessage: msg }) + '\n');
  console.error(msg);
  process.exit(0);
})();
