#!/usr/bin/env node
// Генератор CHANGELOG.md из APP_CHANGELOG в data.js.
// Запуск: node tools/gen-changelog.js
// Идемпотентен: перезаписывает CHANGELOG.md целиком из единственного источника правды (data.js).
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data.js');
const OUT = path.join(ROOT, 'CHANGELOG.md');

// Снимаем APP_CHANGELOG / APP_VERSION из data.js через vm с лёгким DOM/браузер-шимом.
// data.js — не модуль (top-level const), поэтому дописываем хвост-захват в тот же scope.
function loadChangelog() {
  const src = fs.readFileSync(DATA, 'utf8');
  const capture = '\n;globalThis.__CL = (typeof APP_CHANGELOG!=="undefined")?APP_CHANGELOG:null;'
                + 'globalThis.__V = (typeof APP_VERSION!=="undefined")?APP_VERSION:null;';
  const winStub = new Proxy({}, { get: () => undefined, set: () => true });
  const sandbox = {
    window: winStub, globalThis: {}, document: winStub,
    navigator: { userAgent: '' }, localStorage: winStub, console,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(src + capture, sandbox, { filename: 'data.js' });
  if (!Array.isArray(sandbox.__CL)) {
    console.error('ERROR: APP_CHANGELOG не найден или не массив');
    process.exit(1);
  }
  return { changelog: sandbox.__CL, version: sandbox.__V };
}

const TYPE_EMOJI = { feat: '✨', fix: '🐛', chore: '🔧', refactor: '♻️', docs: '📝', perf: '⚡' };

// Чистим conventional-commit префикс: "feat(party): текст" → "текст".
function cleanText(t) {
  return String(t).replace(/^(feat|fix|chore|refactor|docs|style|test|perf)(\([^)]*\))?:\s*/i, '');
}

function render({ changelog, version }) {
  const lines = [];
  lines.push('# Изменения');
  lines.push('');
  lines.push('Полная история версий DnD-Листа. Сгенерировано автоматически из `data.js` — не редактировать вручную (правки затрутся при следующем релизе).');
  lines.push('');
  lines.push(`Актуальная версия — **v${version}**. В приложении: меню → «📜 История версий».`);
  lines.push('');
  lines.push('🎲 [Открыть приложение](https://d1manych.github.io/dnd-app/)');
  lines.push('');
  lines.push('---');
  lines.push('');
  for (const entry of changelog) {
    const v = entry.version || '?';
    const date = entry.date || '';
    lines.push(`<a id="v${v}"></a>`);
    lines.push(`## v${v}${date ? ' — ' + date : ''}`);
    lines.push('');
    const changes = Array.isArray(entry.changes) ? entry.changes : [];
    for (const c of changes) {
      const emoji = TYPE_EMOJI[(c.type || '').toLowerCase()] || '•';
      lines.push(`- ${emoji} ${cleanText(c.text)}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

// Основная функция — переиспользуется из bump-version.js
function generateChangelog() {
  const data = loadChangelog();
  fs.writeFileSync(OUT, render(data), 'utf8');
  return data;
}

// CLI-вход: при прямом запуске печатаем сводку. При require() — экспорт.
if (require.main === module) {
  const data = generateChangelog();
  console.log(`CHANGELOG.md: ${data.changelog.length} версий, актуальная v${data.version}`);
}

module.exports = { generateChangelog };