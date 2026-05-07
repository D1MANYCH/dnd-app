#!/usr/bin/env node
// archive-old.js — переносит файлы старше N дней из --src в --dst.
// Usage: node tools/archive-old.js --src <dir> --dst <dir> --days <N> [--ext .jsonl] [--dry-run]

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const out = { dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--src') out.src = argv[++i];
    else if (a === '--dst') out.dst = argv[++i];
    else if (a === '--days') out.days = Number(argv[++i]);
    else if (a === '--ext') out.ext = argv[++i];
    else { console.error('Unknown arg:', a); process.exit(2); }
  }
  if (!out.src || !out.dst || !Number.isFinite(out.days)) {
    console.error('Usage: node tools/archive-old.js --src <dir> --dst <dir> --days <N> [--ext .jsonl] [--dry-run]');
    process.exit(2);
  }
  return out;
}

function moveFile(from, to) {
  try {
    fs.renameSync(from, to);
  } catch (e) {
    if (e.code === 'EXDEV') {
      fs.copyFileSync(from, to);
      fs.unlinkSync(from);
    } else throw e;
  }
}

function fmtBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1024 / 1024).toFixed(1) + ' MB';
}

const args = parseArgs(process.argv);
const cutoff = Date.now() - args.days * 86400_000;

if (!fs.existsSync(args.src)) {
  console.error('[archive] src does not exist:', args.src);
  process.exit(1);
}

const entries = fs.readdirSync(args.src, { withFileTypes: true });
const matches = [];
for (const e of entries) {
  if (!e.isFile()) continue;
  if (args.ext && !e.name.endsWith(args.ext)) continue;
  const full = path.join(args.src, e.name);
  const st = fs.statSync(full);
  if (st.mtimeMs < cutoff) matches.push({ full, name: e.name, size: st.size });
}

if (matches.length === 0) {
  console.log('[archive] nothing to archive in', args.src);
  process.exit(0);
}

const totalSize = matches.reduce((s, m) => s + m.size, 0);

if (args.dryRun) {
  console.log(`[archive] DRY-RUN ${matches.length} files (${fmtBytes(totalSize)}) from ${args.src}`);
  for (const m of matches) console.log('  -', m.name, fmtBytes(m.size));
  process.exit(0);
}

if (!fs.existsSync(args.dst)) fs.mkdirSync(args.dst, { recursive: true });

let moved = 0;
for (const m of matches) {
  const to = path.join(args.dst, m.name);
  moveFile(m.full, to);
  moved++;
}

console.log(`[archive] moved ${moved} files (${fmtBytes(totalSize)}) → ${args.dst}`);
