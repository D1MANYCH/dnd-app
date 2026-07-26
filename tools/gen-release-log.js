#!/usr/bin/env node
// Генератор docs/RELEASES.md — подробный технический лог релизов.
// Запуск: node tools/gen-release-log.js
//
// Источники (оба — уже существующие, ничего вести руками не нужно):
//   1. APP_CHANGELOG в data.js — короткий пользовательский текст версии;
//   2. git-история — коммиты релиза, изменённые файлы, ссылка на полный дифф.
//
// Границы релиза = коммиты с сабжектом "vX.Y.Z: ..." (или просто "vX.Y.Z" у старых).
// Всё, что лежит между предыдущим релизным коммитом и текущим включительно, считается
// вошедшим в релиз. Идемпотентен: перезаписывает docs/RELEASES.md целиком.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadChangelog } = require('./gen-changelog.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'RELEASES.md');
const REPO = 'https://github.com/D1MANYCH/dnd-app';
const SHA_LEN = 8;
const MAX_FILES = 40; // длиннее списка — сворачиваем в «и ещё N файлов»

// Сабжект релизного коммита: "v3.58.17: fix(...): текст" или голое "v1.6.0".
const RELEASE_RE = /^v(\d+\.\d+\.\d+)(?::\s*(.*))?$/;

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, maxBuffer: 256 * 1024 * 1024 }).toString('utf8');
}

// Вся история одним проходом: коммит + его numstat. --no-renames, чтобы пути были
// чистыми (переименование показывается как удаление + добавление).
function readHistory() {
  const raw = git(['log', '--reverse', '--topo-order', '--no-renames', '--numstat',
                   '--format=%x01%H%x09%at%x09%s']);
  const commits = [];
  let cur = null;
  for (const line of raw.split('\n')) {
    if (line.charCodeAt(0) === 1) {
      const [sha, at, ...rest] = line.slice(1).split('\t');
      cur = { sha: sha, at: +at, subject: rest.join('\t'), files: [] };
      commits.push(cur);
      continue;
    }
    if (!line || !cur) continue;
    const m = line.split('\t');
    if (m.length < 3) continue;
    cur.files.push({ add: m[0] === '-' ? 0 : +m[0], del: m[1] === '-' ? 0 : +m[1], file: m[2] });
  }
  return commits;
}

// Изменения рабочего дерева относительно коммита — для ещё не закоммиченного релиза.
// git diff не видит новые файлы, пока они untracked, поэтому добавляем их отдельно:
// в релизный коммит они войдут, и запись должна их показывать.
function diffAgainst(sha) {
  const raw = git(['diff', '--numstat', '--no-renames', sha]);
  const files = [];
  for (const line of raw.split('\n')) {
    if (!line) continue;
    const m = line.split('\t');
    if (m.length < 3) continue;
    files.push({ add: m[0] === '-' ? 0 : +m[0], del: m[1] === '-' ? 0 : +m[1], file: m[2] });
  }
  for (const f of git(['ls-files', '--others', '--exclude-standard']).split('\n')) {
    if (!f) continue;
    let add = 0;
    try {
      const buf = fs.readFileSync(path.join(ROOT, f));
      if (!buf.includes(0)) add = buf.toString('utf8').split('\n').length - 1; // бинарник — 0 строк
    } catch (e) { continue; }
    files.push({ add: add, del: 0, file: f });
  }
  return files;
}

// Группировка истории по релизным коммитам.
// Повторный релизный коммит с уже выпущенной версией (было один раз на v1.9.0)
// не создаёт вторую запись, а дописывается в существующую.
function groupReleases(commits) {
  const releases = [];
  const byVersion = new Map();
  let buf = [];
  let prevSha = null;

  for (const c of commits) {
    buf.push(c);
    const m = RELEASE_RE.exec(c.subject);
    if (!m) continue;
    const version = m[1];
    const existing = byVersion.get(version);
    if (existing) {
      existing.commits = existing.commits.concat(buf);
      existing.sha = c.sha;
    } else {
      const rel = { version: version, sha: c.sha, prevSha: prevSha, commits: buf, at: c.at };
      releases.push(rel);
      byVersion.set(version, rel);
    }
    prevSha = c.sha;
    buf = [];
  }
  return { releases: releases, byVersion: byVersion, tail: buf, lastSha: prevSha };
}

// Суммарный diffstat группы: файл, изменённый в нескольких коммитах, складывается.
function aggregate(files) {
  const map = new Map();
  let add = 0, del = 0;
  for (const f of files) {
    const prev = map.get(f.file) || { add: 0, del: 0 };
    prev.add += f.add; prev.del += f.del;
    map.set(f.file, prev);
    add += f.add; del += f.del;
  }
  const list = Array.from(map, ([file, s]) => ({ file: file, add: s.add, del: s.del }));
  list.sort((a, b) => (b.add + b.del) - (a.add + a.del) || a.file.localeCompare(b.file));
  return { list: list, add: add, del: del };
}

const TYPE_EMOJI = { feat: '✨', fix: '🐛', chore: '🔧', refactor: '♻️', docs: '📝', perf: '⚡' };

function cleanText(t) {
  return String(t).replace(/^(feat|fix|chore|refactor|docs|style|test|perf)(\([^)]*\))?:\s*/i, '');
}

function short(sha) { return sha.slice(0, SHA_LEN); }

function fmtDateFromTs(at) {
  const RU = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
              'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const d = new Date(at * 1000);
  return `${d.getDate()} ${RU[d.getMonth()]} ${d.getFullYear()}`;
}

// Ссылка на полный дифф релиза: compare предыдущего релиза с этим.
// У самого первого релиза сравнивать не с чем — даём ссылку на сам коммит.
function patchLink(rel) {
  if (rel.pending) {
    return rel.prevSha ? `${REPO}/compare/${short(rel.prevSha)}...main` : `${REPO}/commits/main`;
  }
  return rel.prevSha
    ? `${REPO}/compare/${short(rel.prevSha)}...${short(rel.sha)}`
    : `${REPO}/commit/${short(rel.sha)}`;
}

function renderRelease(lines, entry, rel) {
  const version = entry ? entry.version : rel.version;
  const date = (entry && entry.date) || (rel && fmtDateFromTs(rel.at)) || '';
  lines.push(`<a id="v${version}"></a>`);
  lines.push(`## v${version}${date ? ' — ' + date : ''}`);
  lines.push('');

  const changes = (entry && Array.isArray(entry.changes)) ? entry.changes : [];
  for (const c of changes) {
    lines.push(`${TYPE_EMOJI[(c.type || '').toLowerCase()] || '•'} ${cleanText(c.text)}`);
    lines.push('');
  }

  if (!rel) {
    lines.push('_Релизного коммита нет в истории репозитория — патч недоступен._');
    lines.push('');
    return;
  }

  const stat = aggregate(rel.commits.reduce((acc, c) => acc.concat(c.files), rel.extraFiles || []));
  const fileWord = stat.list.length === 1 ? 'файл' : (stat.list.length < 5 ? 'файла' : 'файлов');
  lines.push(`🔍 [Полный патч](${patchLink(rel)}) · ${stat.list.length} ${fileWord}, +${stat.add} −${stat.del}`);
  lines.push('');

  if (rel.commits.length) {
    lines.push('<details><summary>Коммиты и файлы</summary>');
    lines.push('');
    lines.push(`**Коммиты (${rel.commits.length}):**`);
    lines.push('');
    for (const c of rel.commits) {
      lines.push(`- [\`${short(c.sha)}\`](${REPO}/commit/${short(c.sha)}) ${c.subject}`);
    }
  } else {
    lines.push('<details><summary>Файлы</summary>');
    lines.push('');
    lines.push('_Список собран при подготовке релиза, по рабочему дереву. Уточняется при следующей генерации._');
  }
  lines.push('');

  if (stat.list.length) {
    lines.push(`**Файлы (${stat.list.length}):**`);
    lines.push('');
    for (const f of stat.list.slice(0, MAX_FILES)) {
      lines.push(`- \`${f.file}\` +${f.add} −${f.del}`);
    }
    if (stat.list.length > MAX_FILES) {
      lines.push(`- …и ещё ${stat.list.length - MAX_FILES} файлов — см. полный патч`);
    }
    lines.push('');
  }
  lines.push('</details>');
  lines.push('');
}

function render(changelog, version, grouped) {
  const lines = [];
  lines.push('# Подробный лог релизов');
  lines.push('');
  lines.push('Что именно вошло в каждую версию: коммиты, изменённые файлы со счётчиком строк и ссылка на полный дифф на GitHub.');
  lines.push('Сгенерировано автоматически из `data.js` + git-истории (`node tools/gen-release-log.js`) — не редактировать вручную.');
  lines.push('');
  lines.push(`Актуальная версия — **v${version}**.`);
  lines.push('');
  lines.push('📋 [Короткий changelog](../CHANGELOG.md) — то же самое человеческим языком, без технических подробностей.');
  lines.push('🎲 [Открыть приложение](https://d1manych.github.io/dnd-app/)');
  lines.push('');
  lines.push('---');
  lines.push('');

  // Хвост после последнего релизного коммита без bump версии — отдельным блоком сверху.
  const pendingVersion = changelog.length ? changelog[0].version : null;
  const pendingRel = pendingVersion && !grouped.byVersion.has(pendingVersion)
    ? { version: pendingVersion, sha: null, prevSha: grouped.lastSha, commits: grouped.tail,
        at: Math.floor(Date.now() / 1000), pending: true,
        extraFiles: grouped.lastSha ? diffAgainst(grouped.lastSha) : [] }
    : null;
  if (pendingRel) renderRelease(lines, changelog[0], pendingRel);
  else if (grouped.tail.length) {
    lines.push('<a id="unreleased"></a>');
    lines.push('## Не выпущено');
    lines.push('');
    lines.push(`Коммиты после последнего релиза (`
      + `[дифф](${REPO}/compare/${short(grouped.lastSha)}...main)):`);
    lines.push('');
    for (const c of grouped.tail) {
      lines.push(`- [\`${short(c.sha)}\`](${REPO}/commit/${short(c.sha)}) ${c.subject}`);
    }
    lines.push('');
  }

  for (const entry of changelog) {
    if (pendingRel && entry.version === pendingRel.version) continue;
    renderRelease(lines, entry, grouped.byVersion.get(entry.version) || null);
  }

  return lines.join('\n');
}

function generateReleaseLog() {
  const { changelog, version } = loadChangelog();
  const grouped = groupReleases(readHistory());
  fs.writeFileSync(OUT, render(changelog, version, grouped), 'utf8');
  const matched = changelog.filter(e => grouped.byVersion.has(e.version)).length;
  return { total: changelog.length, matched: matched, version: version };
}

// Данные одного релиза для внешних потребителей (tools/gen-release-post.js).
// Если версия ещё не выпущена — patch указывает на диапазон «последний релиз → main».
function releaseInfo(version) {
  const grouped = groupReleases(readHistory());
  const rel = grouped.byVersion.get(version);
  if (!rel) {
    return {
      version: version, released: false,
      patch: grouped.lastSha ? `${REPO}/compare/${short(grouped.lastSha)}...main` : `${REPO}/commits/main`,
      commits: grouped.tail.map(c => ({ sha: short(c.sha), subject: c.subject })),
      stat: aggregate(grouped.tail.reduce((a, c) => a.concat(c.files),
                      grouped.lastSha ? diffAgainst(grouped.lastSha) : [])),
    };
  }
  return {
    version: version, released: true, sha: short(rel.sha),
    patch: patchLink(rel),
    commits: rel.commits.map(c => ({ sha: short(c.sha), subject: c.subject })),
    stat: aggregate(rel.commits.reduce((a, c) => a.concat(c.files), [])),
  };
}

if (require.main === module) {
  let res;
  try {
    res = generateReleaseLog();
  } catch (e) {
    console.error('ERROR: ' + (e.message || e));
    process.exit(1);
  }
  console.log(`docs/RELEASES.md: ${res.total} версий, из них с патчем ${res.matched}, актуальная v${res.version}`);
}

module.exports = { generateReleaseLog, releaseInfo, REPO };
