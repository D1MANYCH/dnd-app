// Node-обёртка для tests/headless.js. Запуск: node tests/headless-node.js
// Грузит те же скрипты что runner.html в sandbox с DOM-шимом.
// TEST-1: добавлены app-core.js / app-combat.js / app-hp.js + DOM-шим ($, qs, qsa, localStorage)
// для тестов applyDamage (quickHP) и calcStats.
// TEST-2: добавлен app-inventory.js — тесты слотов/веса/монет/мешочков (БЛОК 10).
// TEST-3: добавлены app-spells.js + app-party.js (+ monsters-srd/npc-srd явно, т.к. в проде
// они лениво через ensureBestiary, PERF-3) — тесты подготовки заклинаний и трекера боя (БЛОКИ 11–12).
// FIN-12: добавлены app-log.js (первым, как в index.html — перехватывает console),
// app-notes.js, history-stack.js, app-backup.js + history-шим ДО загрузки (history-stack
// на загрузке зовёт history.pushState). Тесты — БЛОК 30 (AppLog / history-stack / notesV2 /
// backup-smoke / quickRoll-edge / party-id). ВАЖНО: раннер синхронный (process.exit вызывается
// до слива микротасков/таймеров), поэтому асинхронные проверки невозможны — backup покрыт
// smoke'ом (константы/наличие/чистые хелперы + thenable без sync-throw на ветке «нет indexedDB»);
// in-memory indexedDB-фейк намеренно НЕ добавлен (его результат нечем дождаться в sync-раннере).
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const files = [
  'app-log.js',              // FIN-12: window.AppLog — грузится ПЕРВЫМ (как в index.html), перехватывает console (БЛОК 30)
  'data.js',
  'gear-catalog.js',         // FIN-5: window.GEAR_CATALOG — в проде лениво (ensureGearCatalog), в тестах явно (БЛОК 24)
  'magic-items.js',          // FIN-8: window.MAGIC_ITEMS — в проде лениво (ensureMagicItems), в тестах явно (БЛОК 27, проверка charges)
  'character-builds.js',     // BUILD-LVL-7: CHARACTER_BUILDS/getBuildById для тестов данных levelUp
  'glossary-data.js',        // UX-4: window.GLOSSARY для тестов glossarizeHtml (БЛОК 18)
  'spells.js',               // BUILD-LVL-7: SPELLS_BASE → app-core строит SPELL_DATABASE (резолв заклинаний билдов)
  'class-choices.js',
  'subclass-choices-data.js',
  'app-core.js',
  'app-combat.js',
  'app-hp.js',
  'app-inventory.js',        // TEST-2: getSlotsTotal/calcUsedSlots/updateInventoryWeight/renderPouches/_invMoveItem (БЛОК 10)
  'monsters-srd.js',         // TEST-3: в проде лениво (ensureBestiary, PERF-3) — в тестах явно ДО app-party
  'npc-srd.js',              // TEST-3: то же
  'app-spells.js',           // TEST-3: подготовка заклинаний + ячейки/пакт (БЛОК 11)
  'app-party.js',            // TEST-3: отряд и трекер боя (БЛОК 12)
  'app-ui.js',               // UI6-1: настройки оформления — _getAutoAccent/CLASS_ACCENT_MAP/setAccent (БЛОК 13); позже layout/edition (БЛОК 14)
  'app-notes.js',            // FIN-12: notesV2 — _mdToHtml/_notesReorderPinned/notesSaveEntryModal/notesExport* (БЛОК 30)
  'history-stack.js',        // FIN-12: pushHistoryLayer/syncCloseLayer/getHistoryLayers (нужен history-шим ниже) (БЛОК 30)
  'app-backup.js',           // FIN-12: авто-бэкап IndexedDB — smoke: константы/наличие/чистые хелперы (БЛОК 30)
  'tests/fixtures.js',
  'tests/headless.js',
];

// ── DOM-шим ────────────────────────────────────────────────
// makeStub: stub-элемент, проглатывает любые DOM-операции без падения.
function makeStub() {
  const el = {
    id: '',
    value: '',
    checked: false,
    disabled: false,
    textContent: '',
    innerText: '',
    innerHTML: '',
    className: '',
    tagName: 'DIV',
    dataset: {},
    children: [],
    childNodes: [],
    parentNode: null,
    offsetWidth: 0,
    scrollTop: 0,
    scrollWidth: 0,
    clientWidth: 0,
    isContentEditable: false,
  };
  // UI6-1: style — методы setProperty/removeProperty/getPropertyValue как no-op'ы
  // (реальные render-функции app-ui.js зовут card.style.setProperty(...)).
  el.style = new Proxy({}, {
    get: (t, k) => {
      if (k === 'setProperty' || k === 'removeProperty') return function(){};
      if (k === 'getPropertyValue') return function(){ return ''; };
      return '';
    },
    set: () => true,
  });
  el.classList = {
    _set: new Set(),
    add(...c) { c.forEach(x => this._set.add(x)); },
    remove(...c) { c.forEach(x => this._set.delete(x)); },
    toggle(c, force) {
      if (typeof force === 'boolean') { force ? this._set.add(c) : this._set.delete(c); return force; }
      if (this._set.has(c)) { this._set.delete(c); return false; }
      this._set.add(c); return true;
    },
    contains(c) { return this._set.has(c); },
  };
  el.addEventListener = () => {};
  el.removeEventListener = () => {};
  el.appendChild = (c) => c;
  el.removeChild = () => {};
  el.remove = () => {};
  el.insertBefore = () => {};
  el.replaceChild = () => {};
  el.querySelector = () => null;
  el.querySelectorAll = () => [];
  el.getAttribute = () => null;
  el.setAttribute = () => {};
  el.removeAttribute = () => {};
  el.hasAttribute = () => false;
  el.focus = () => {};
  el.blur = () => {};
  el.click = () => {};
  el.cloneNode = () => makeStub();
  el.getBoundingClientRect = () => ({ top:0, left:0, right:0, bottom:0, width:0, height:0 });
  return el;
}

// localStorage — в памяти
const _ls = new Map();
const localStorage = {
  getItem(k) { return _ls.has(k) ? _ls.get(k) : null; },
  setItem(k, v) { _ls.set(k, String(v)); },
  removeItem(k) { _ls.delete(k); },
  clear() { _ls.clear(); },
  key(i) { return Array.from(_ls.keys())[i] || null; },
  get length() { return _ls.size; },
};

// document — getElementById кеширует стабы по id (важно для тестов: один и тот же id = один и тот же объект)
const _elements = new Map();
const summary = (() => { const s = makeStub(); s.id = 'summary'; _elements.set('summary', s); return s; })();
const results = (() => { const s = makeStub(); s.id = 'results'; _elements.set('results', s); return s; })();

const document = {
  // BUILD-LVL-7: character-builds.js validateBuildOptions() читает readyState — "loading"
  // откладывает его на DOMContentLoaded (no-op в node), избегая обращения к sel.options стаба.
  readyState: 'loading',
  getElementById(id) {
    if (!_elements.has(id)) {
      const s = makeStub();
      s.id = id;
      _elements.set(id, s);
    }
    return _elements.get(id);
  },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  createElement(tag) {
    const s = makeStub();
    s.tagName = (tag || 'div').toUpperCase();
    return s;
  },
  createTextNode(t) { const s = makeStub(); s.textContent = String(t); return s; },
  addEventListener() {},
  removeEventListener() {},
  body: makeStub(),
  documentElement: makeStub(),
  activeElement: null,
};

const navigator = { vibrate: () => {}, userAgent: 'node-headless', clipboard: { writeText: () => Promise.resolve() } };
// FIN-12: history-шим. history-stack.js на загрузке зовёт history.pushState (в try/catch),
// а syncCloseLayer — history.go(-n). Фейк с записью вызовов позволяет проверить, что
// pushLayer→pushState и syncCloseLayer→go(-n) реально срабатывают (БЛОК 30).
const history = {
  _pushCount: 0,
  _lastGo: null,
  length: 1,
  state: null,
  pushState(s) { this.state = s; this._pushCount++; },
  replaceState(s) { this.state = s; },
  go(n) { this._lastGo = n; },
  back() { this._lastGo = -1; },
  forward() { this._lastGo = 1; },
};
// UI6-1: performance.now() нужен реальному animateCountUp (app-ui.js) — раньше был стабом.
const performance = { now: () => Date.now() };
const getComputedStyle = () => ({ overflowX: '', overflowY: '', getPropertyValue: () => '' });

// ── Sandbox ────────────────────────────────────────────────
const sandbox = {
  console,
  document,
  navigator,
  history,
  localStorage,
  getComputedStyle,
  performance,
  JSON, Object, Array, Math, Date, String, Number, Boolean, RegExp, Error,
  parseInt, parseFloat, isNaN, isFinite, Set, Map, Proxy, Symbol, Promise,
  setTimeout, clearTimeout, setInterval, clearInterval,
  URL: typeof URL !== 'undefined' ? URL : undefined,
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
// UI6-1: app-ui.js вешает top-level window.addEventListener (error/unhandledrejection/load)
// и проверяет window.matchMedia (за guard'ом → undefined ок). Шимим no-op'ы на window(===sandbox).
sandbox.addEventListener = function(){};
sandbox.removeEventListener = function(){};
sandbox.dispatchEvent = function(){ return true; };
sandbox.requestAnimationFrame = function(){ return 0; };
sandbox.cancelAnimationFrame = function(){};
// Шим-копия escapeHtml на случай если data.js не успеет (страховка от старой версии)
sandbox.escapeHtml = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// BUILD-LVL-7: Option-конструктор для updateSubclassOptions (new Option(text,value)) в confirmLevelUp.
sandbox.Option = function Option(text, value) { this.text = text; this.value = value; this.label = text; this.selected = false; };

// Заглушки для функций из не-загружаемых модулей (app-ui / app-notes / etc.),
// чтобы вызовы изнутри updateHPDisplay / loadCharacter / confirmRest не падали.
// TEST-3: app-spells.js и app-party.js теперь загружаются — их декларации
// (renderSpellSlots, renderMySpells, syncSelfBattleStatus, …) перекрывают эти стабы.
const externalStubs = [
  'syncSelfBattleStatus',        // app-party.js
  'animateCountUp',              // app-ui.js
  'renderJournal',               // app-ui.js
  'renderClassResources',        // app-ui.js
  'firstLoadSkeleton',           // app-ui.js — скелетон первого рендера; undefined (falsy) → рендер идёт сразу
  'renderSpellSlots',            // app-spells.js
  'renderMySpells',              // app-spells.js
  'renderInventory',             // app-inventory.js
  'renderWeapons',               // app-inventory.js
  'renderBuildBadge',            // app-ui.js
  'updateConcentrationDisplay',  // если потребуется — определена в app-combat.js, но безопасно стабить
  'updateSlotsDisplay',          // app-spells.js
  'loadCharacter',               // app-core.js имеет, но во избежание побочки в тестах не используем
  'addJournalEntry',             // app-notes.js — нужна для confirmLevelUp в тесте мультикласс-гайда (BUILD-LVL-7)
];
externalStubs.forEach(name => { if (!(name in sandbox)) sandbox[name] = function(){}; });

// FIN-3: исходник index.html для fs-тестов (сверка option'ов брони и т.п.);
// в браузерном runner.html этого поля нет → соответствующие тесты пропускаются.
try { sandbox.__indexHtmlSource = fs.readFileSync(path.join(root, 'index.html'), 'utf8'); } catch (e) { /* нет файла — тест пропустится */ }

vm.createContext(sandbox);

for (const rel of files) {
  const abs = path.join(root, rel);
  const src = fs.readFileSync(abs, 'utf8');
  try {
    vm.runInContext(src, sandbox, { filename: rel });
  } catch (e) {
    console.error(`[load] ${rel}: ${e.message}\n${e.stack}`);
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
// total === 0 — тесты не выполнились (пустой __testResults) → красный, не ложно-зелёный CI
process.exit(r.fail === 0 && r.total > 0 ? 0 : 1);
