#!/usr/bin/env node
// CLI: node tools/check-invariant.js [root]
// Проверка инварианта релиза (TOOL-3, второй шаг CI):
//   APP_VERSION ↔ APP_CHANGELOG[0].version ↔ CACHE_NAME (dnd-sheet-vN)
//   ↔ все ?v= токены js/css в index.html ↔ CHANGELOG.md (первый ## vX.Y.Z)
// Регэкспы — те же, что в tools/bump-version.js (источник логики).
// Exit 0 — инвариант цел; exit 1 — нумерованный список расхождений.
'use strict';

const fs = require('fs');
const path = require('path');

function checkInvariant(root) {
  const problems = [];
  const summary = [];

  function read(name) {
    try {
      return fs.readFileSync(path.join(root, name), 'utf8');
    } catch (e) {
      problems.push('не читается ' + name + ': ' + e.message);
      return null;
    }
  }

  const dataSrc = read('data.js');
  const swSrc = read('sw.js');
  const indexSrc = read('index.html');
  const mdSrc = read('CHANGELOG.md');
  if (problems.length) return { ok: false, problems, summary };

  // 1. data.js: APP_VERSION (SemVer)
  const appVersion = (dataSrc.match(/const\s+APP_VERSION\s*=\s*"([^"]+)"/) || [])[1];
  if (!appVersion) {
    problems.push('data.js: не найден APP_VERSION');
  } else if (!/^\d+\.\d+\.\d+$/.test(appVersion)) {
    problems.push('data.js: APP_VERSION не SemVer: ' + appVersion);
  }

  // 2. data.js: APP_CHANGELOG[0].version — первый блок до "}," (как в bump-version.js)
  let clogVersion = null;
  const cm = dataSrc.match(/const\s+APP_CHANGELOG\s*=\s*\[/);
  if (!cm) {
    problems.push('data.js: не найден APP_CHANGELOG');
  } else {
    const after = dataSrc.slice(cm.index + cm[0].length);
    const firstObjEnd = after.indexOf('},');
    const firstBlock = firstObjEnd === -1 ? '' : after.slice(0, firstObjEnd + 2);
    clogVersion = (firstBlock.match(/version\s*:\s*"([^"]+)"/) || [])[1];
    if (!clogVersion) problems.push('data.js: не найден version в первом блоке APP_CHANGELOG');
  }
  if (appVersion && clogVersion && appVersion !== clogVersion) {
    problems.push('APP_VERSION (' + appVersion + ') != APP_CHANGELOG[0].version (' + clogVersion + ')');
  }

  // 3. sw.js: CACHE_NAME = dnd-sheet-vN
  const cacheN = (swSrc.match(/CACHE_NAME\s*=\s*['"]dnd-sheet-v(\d+)['"]/) || [])[1];
  if (!cacheN) problems.push('sw.js: не найден CACHE_NAME=dnd-sheet-vN');

  // 4. index.html: каждый js/css ?v= токен === v<N>; webp/png не трогаются — у них свой цикл
  const tokenRe = /([^"'\s>]*\.(?:js|css))\?v=([^"'\s>]+)/g;
  let tokenCount = 0;
  const badTokens = [];
  let tm;
  while ((tm = tokenRe.exec(indexSrc)) !== null) {
    tokenCount++;
    if (cacheN && tm[2] !== 'v' + cacheN) badTokens.push(tm[1] + '?v=' + tm[2]);
  }
  if (tokenCount === 0) {
    problems.push('index.html: не найдено ни одного js/css ?v= токена');
  } else if (badTokens.length) {
    problems.push('index.html: ' + badTokens.length + ' из ' + tokenCount +
      ' ?v= токенов != v' + cacheN + ': ' + badTokens.join(', '));
  }

  // 5. CHANGELOG.md: первый заголовок ## vX.Y.Z === APP_VERSION
  const mdVer = (mdSrc.match(/^## v(\d+\.\d+\.\d+)/m) || [])[1];
  if (!mdVer) {
    problems.push('CHANGELOG.md: не найден первый заголовок ## vX.Y.Z');
  } else if (appVersion && mdVer !== appVersion) {
    problems.push('CHANGELOG.md: первый заголовок (v' + mdVer + ') != APP_VERSION (' + appVersion + ')');
  }

  summary.push('APP_VERSION ' + (appVersion || '?'),
    'APP_CHANGELOG[0] ' + (clogVersion || '?'),
    'CACHE dnd-sheet-v' + (cacheN || '?'),
    tokenCount + ' ?v= токенов',
    'CHANGELOG.md v' + (mdVer || '?'));
  return { ok: problems.length === 0, problems, summary };
}

if (require.main === module) {
  const root = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..');
  const res = checkInvariant(root);
  if (res.ok) {
    console.log('[invariant] OK — ' + res.summary.join(' · '));
  } else {
    console.error('[invariant] FAIL:');
    res.problems.forEach(function (p, i) { console.error('  ' + (i + 1) + '. ' + p); });
    process.exit(1);
  }
}

module.exports = { checkInvariant };
