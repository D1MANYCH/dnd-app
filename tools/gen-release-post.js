#!/usr/bin/env node
// Скелет краткого поста-анонса релиза для канала.
// Запуск: node tools/gen-release-post.js [версия] [--out <slug>]
//   без аргументов        — пост по актуальной версии в stdout;
//   3.58.17               — по конкретной версии;
//   --out rest-fixes      — дополнительно сохранить в docs/marketing/posts/NN-rest-fixes.txt
//                           (номер NN — следующий свободный).
//
// Тело поста = текст из APP_CHANGELOG (он уже короткий и по факту), блок ссылок —
// три уровня: короткий changelog, подробный лог, полный патч. Текст можно править
// руками перед публикацией; тон — как в changelog, без рекламных вступлений.
'use strict';

const fs = require('fs');
const path = require('path');
const { loadChangelog } = require('./gen-changelog.js');
const { releaseInfo, REPO } = require('./gen-release-log.js');

const ROOT = path.join(__dirname, '..');
const POSTS = path.join(ROOT, 'docs', 'marketing', 'posts');
const APP_URL = 'd1manych.github.io/dnd-app';
const TG_URL = 't.me/DnDSocialru';

function parseArgs(argv) {
  const args = argv.slice(2);
  let out = null;
  const oi = args.indexOf('--out');
  if (oi !== -1) {
    out = args[oi + 1];
    if (!out) { console.error('ERROR: --out требует slug (латиницей, через дефис)'); process.exit(1); }
    args.splice(oi, 2);
  }
  return { version: args[0] || null, out: out };
}

function cleanText(t) {
  return String(t).replace(/^(feat|fix|chore|refactor|docs|style|test|perf)(\([^)]*\))?:\s*/i, '');
}

// Ссылки без https:// — в TG так короче и не даёт лишнего превью.
function bare(url) { return url.replace(/^https?:\/\//, ''); }

function build(entry, info) {
  const anchor = 'v' + entry.version;
  const lines = [];
  lines.push(`📦 DnD-Лист v${entry.version} · ${entry.date || ''}`.trim());
  lines.push('');
  for (const c of (entry.changes || [])) {
    lines.push(cleanText(c.text));
    lines.push('');
  }
  lines.push(`📋 Changelog: ${bare(REPO)}/blob/main/CHANGELOG.md#${anchor}`);
  lines.push(`🔍 Подробно: ${bare(REPO)}/blob/main/docs/RELEASES.md#${anchor}`);
  lines.push(`🧩 Патч: ${bare(info.patch)}`);
  lines.push(`🎲 ${APP_URL}`);
  lines.push(`💬 ${TG_URL}`);
  return lines.join('\n') + '\n';
}

function nextPostNumber() {
  let max = 0;
  for (const f of fs.readdirSync(POSTS)) {
    const m = /^(\d+)-/.exec(f);
    if (m) max = Math.max(max, +m[1]);
  }
  return String(max + 1);
}

function main() {
  const { version, out } = parseArgs(process.argv);
  const { changelog } = loadChangelog();
  const entry = version
    ? changelog.find(e => e.version === version)
    : changelog[0];
  if (!entry) {
    console.error('ERROR: версия ' + version + ' не найдена в APP_CHANGELOG');
    process.exit(1);
  }

  const info = releaseInfo(entry.version);
  const post = build(entry, info);

  if (!info.released) {
    console.error('WARN: релизного коммита v' + entry.version + ' ещё нет — ссылка на патч указывает на диапазон «последний релиз → main». После коммита и пуша перегенерируйте пост.');
  }

  process.stdout.write(post);

  if (out) {
    if (!fs.existsSync(POSTS)) { console.error('ERROR: нет каталога ' + POSTS); process.exit(1); }
    const file = path.join(POSTS, nextPostNumber() + '-' + out + '.txt');
    if (fs.existsSync(file)) { console.error('ERROR: файл уже есть: ' + file); process.exit(1); }
    fs.writeFileSync(file, post, 'utf8');
    console.error('\n→ сохранено: docs/marketing/posts/' + path.basename(file));
  }
}

main();
