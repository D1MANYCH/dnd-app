// Node-обёртка для tests/headless.js. Запуск: node tests/headless-node.js
// Грузит те же скрипты что runner.html в sandbox с минимальным DOM-шимом.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const files = [
  'data.js',
  'class-choices.js',
  'subclass-choices-data.js',
  'tests/fixtures.js',
  'tests/headless.js',
];

// DOM-шим: ровно то, что трогает headless.js (getElementById для summary/results).
const stubEl = () => ({ className: '', textContent: '', innerHTML: '', set set(_v){} });
const summary = stubEl();
const results = stubEl();
const document = {
  getElementById: (id) => (id === 'summary' ? summary : id === 'results' ? results : stubEl()),
  createElement: () => stubEl(),
};

const sandbox = {
  console,
  document,
  JSON, Object, Array, Math, Date, String, Number, Boolean, RegExp, Error,
  parseInt, parseFloat, isNaN, isFinite,
  setTimeout, clearTimeout, setInterval, clearInterval,
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
sandbox.escapeHtml = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
sandbox.getCurrentChar = () => sandbox.__testChar || null;
sandbox.currentId = 'test';

vm.createContext(sandbox);

for (const rel of files) {
  const abs = path.join(root, rel);
  const src = fs.readFileSync(abs, 'utf8');
  try {
    vm.runInContext(src, sandbox, { filename: rel });
  } catch (e) {
    console.error(`[load] ${rel}: ${e.message}`);
    process.exit(2);
  }
}

const r = sandbox.__testResults || { pass: 0, fail: 0, total: 0, results: [] };
const failed = (r.results || []).filter((x) => !x.ok);
if (failed.length) {
  console.log(`\nFAILS (${failed.length}):`);
  for (const f of failed) console.log(`  ✗ ${f.desc}  ${f.msg || ''}`);
}
console.log(`\nИтого: ${r.pass} OK / ${r.fail} FAIL из ${r.total}`);
process.exit(r.fail === 0 ? 0 : 1);
