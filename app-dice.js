// ============================================================
// app-dice.js — Броски кубиков: модалка и история, quickRoll с листа,
// 3D/2D-анимация (@3d-dice/dice-box), парсер формулы 2к6+3
// ============================================================

function openDiceModal() {
const modal = $("dice-modal");
if (modal) {
  modal.classList.remove("hidden");
  modal.style.display = "";
  modal.classList.add("active");
}
// v3.19: обновить бейдж количества записей в истории
try { _updateDiceHistoryBadge(); } catch (e) {}
// FB-7: подсказка про file:// — 3D-движок dice-box (ES-модуль) не грузится по файловому протоколу
try { var _fh = document.getElementById('dice-file-hint'); if (_fh) _fh.hidden = (location.protocol !== 'file:'); } catch (e) {}
// FIX: DiceBox canvas сохраняет внутренний буфер 300×150 (default) если init
// произошёл до того как контейнер получил реальный размер.
// resizeWorld() лишь регистрирует window.resize listener — он сам не ресайзит.
// Триггерим resize event после показа модалки чтобы сцена подстроилась.
setTimeout(function() {
  try { window.dispatchEvent(new Event('resize')); } catch (e) {}
  // v3.17: подготовка космо-арены (canvas#diceArenaBg) после того как модалка получила размер.
  // PERF: раньше RAF арены крутился всё время, пока открыта модалка, хотя оверлей
  // броска скрыт (opacity 0) — кадры рисовались в никуда. Теперь здесь только
  // размер + один статичный кадр, а цикл поднимает showDiceRollOverlay().
  try {
    if (window.DiceArenaBg) {
      var arenaCv = document.getElementById('diceArenaBg');
      if (arenaCv) { window.DiceArenaBg.start(arenaCv); window.DiceArenaBg.stop(); }
      // UX-3: применить сохранённый вариант фона арены
      try { if (DiceArenaBg.setVariant) DiceArenaBg.setVariant(_getDiceBg()); if (DiceArenaBg.stop) DiceArenaBg.stop(); } catch (e) {}
    }
  } catch (e) {}
  // PERF: прогреваем DiceBox заранее — первая инициализация (Babylon + физика +
  // загрузка темы) занимает сотни миллисекунд и раньше приходилась ровно на кадры
  // появления оверлея, отчего вход в бросок шёл рывками.
  try { _initDiceBox(); } catch (e) {}
}, 60);
// UX-5: пока модалка открыта — лента последних бросков прячется (избыточна).
try { updateQuickRollStripVisibility(); } catch (e) {}
}
function closeDiceModal() {
// v3.17: ставим RAF космо-арены на паузу — экономия CPU/батареи когда модалка закрыта
try { if (window.DiceArenaBg) window.DiceArenaBg.stop(); } catch (e) {}
// v3.18: закрываем поповеры если были открыты
try { closeDicePopovers(); } catch (e) {}
const modal = $("dice-modal");
if (modal) modal.classList.remove("active", "dice-rolling");
const display = $("dice-result-display");
if (display) display.classList.remove("crit-success", "crit-fail", "normal");
// UX-5: модалка закрыта — показать ленту последних бросков на листе.
try { updateQuickRollStripVisibility(); } catch (e) {}
}

// UX-3: арена скрыта — видны только кнопки (телефон и ПК). Бросок открывает
// полноэкранный оверлей с 3D-анимацией поверх размытого фона; тап по нему закрывает.
function _diceModalActive() {
  try {
    var m = document.getElementById('dice-modal');
    return !!(m && m.classList.contains('active'));
  } catch (e) { return false; }
}
function showDiceRollOverlay() {
  if (!_diceModalActive()) return;
  var m = document.getElementById('dice-modal');
  if (!m) return;
  if (m.classList.contains('dice-rolling')) return;
  m.classList.add('dice-rolling');
  // Цикл арены поднимаем только на время самого броска (см. openDiceModal).
  try {
    if (window.DiceArenaBg) {
      var cv = document.getElementById('diceArenaBg');
      if (cv) window.DiceArenaBg.start(cv);
    }
  } catch (e) {}
}
function hideDiceRollOverlay() {
  var m = document.getElementById('dice-modal');
  if (m) m.classList.remove('dice-rolling');
  try { if (window.DiceArenaBg) window.DiceArenaBg.stop(); } catch (e) {}
}

// v3.18: поповеры в шапке модалки — настройки и история бросков
function toggleDicePopover(which) {
  var settings = document.getElementById('dice-popover-settings');
  var history = document.getElementById('dice-popover-history');
  var sBtn = document.getElementById('dice-settings-btn');
  var hBtn = document.getElementById('dice-history-btn');
  if (!settings || !history) return;
  if (which === 'settings') {
    var wasOpen = !settings.hasAttribute('hidden');
    settings.hidden = wasOpen;
    history.hidden = true;
    if (sBtn) sBtn.classList.toggle('is-active', !wasOpen);
    if (hBtn) hBtn.classList.remove('is-active');
  } else if (which === 'history') {
    var wasOpen = !history.hasAttribute('hidden');
    history.hidden = wasOpen;
    settings.hidden = true;
    if (hBtn) hBtn.classList.toggle('is-active', !wasOpen);
    if (sBtn) sBtn.classList.remove('is-active');
    if (!wasOpen && typeof renderDiceHistory === 'function') {
      try { renderDiceHistory(); } catch (e) {}
    }
  }
}
function closeDicePopovers() {
  var s = document.getElementById('dice-popover-settings');
  var h = document.getElementById('dice-popover-history');
  if (s) s.hidden = true;
  if (h) h.hidden = true;
  var sBtn = document.getElementById('dice-settings-btn');
  var hBtn = document.getElementById('dice-history-btn');
  if (sBtn) sBtn.classList.remove('is-active');
  if (hBtn) hBtn.classList.remove('is-active');
}
function clearDiceHistory() {
  if (typeof confirm === 'function' && !confirm('Очистить историю бросков?')) return;
  try {
    if (Array.isArray(window.diceHistory)) window.diceHistory.length = 0;
    else if (typeof diceHistory !== 'undefined' && Array.isArray(diceHistory)) diceHistory.length = 0;
  } catch (e) {}
  try { if (typeof renderDiceHistory === 'function') renderDiceHistory(); } catch (e) {}
  try { _updateDiceHistoryBadge(); } catch (e) {}
}
// v3.19: сброс отображённого результата (кнопка «Сброс» в шапке)
function resetDiceResult() {
  var resultBig = document.getElementById('dice-result-big');
  var resultInfo = document.getElementById('dice-result-info');
  var resultBox = document.getElementById('dice3d-result');
  var dual = document.getElementById('dice-dual-display');
  if (resultBig) resultBig.textContent = '—';
  if (resultInfo) resultInfo.textContent = 'Выберите кубик';
  if (resultBox) resultBox.classList.remove('crit-success', 'crit-fail', 'normal', 'pop');
  if (dual) dual.style.display = 'none';
  try { if (window.DiceArenaBg) window.DiceArenaBg.pulse(); } catch (e) {}
}
// v3.19: счётчик-бейдж на иконке истории
function _updateDiceHistoryBadge() {
  var badge = document.getElementById('dice-history-badge');
  if (!badge) return;
  var n = 0;
  try { n = (Array.isArray(window.diceHistory) ? window.diceHistory : (typeof diceHistory !== 'undefined' ? diceHistory : [])).length; } catch (e) {}
  if (n > 0) {
    badge.textContent = n > 99 ? '99+' : String(n);
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
}
// UX-2: формула из основного input'а под сеткой — тонкая обёртка над общим обработчиком.
function rollCustomFormulaFromMain() {
  try { _rollFormulaFrom('dice-custom-input-main'); } catch (e) {}
}
// UX-2: быстрые вставки токенов формулы (чипы под полем) в активное/основное поле.
function diceInsertToken(token, targetId) {
  var el = document.getElementById(targetId || 'dice-custom-input-main');
  if (!el) return;
  el.value = (el.value || '') + token;
  try { el.focus(); } catch (e) {}
}
function diceFormulaBackspace(targetId) {
  var el = document.getElementById(targetId || 'dice-custom-input-main');
  if (!el) return;
  el.value = (el.value || '').slice(0, -1);
  try { el.focus(); } catch (e) {}
}
window.diceInsertToken = diceInsertToken;
window.diceFormulaBackspace = diceFormulaBackspace;
// Клик вне поповера закрывает его (кроме клика по tool-кнопкам, которые сами тогглят)
document.addEventListener('click', function(ev) {
  var modal = document.getElementById('dice-modal');
  if (!modal || !modal.classList.contains('active')) return;
  var popoverOpen = !document.getElementById('dice-popover-settings')?.hasAttribute('hidden')
                 || !document.getElementById('dice-popover-history')?.hasAttribute('hidden');
  if (!popoverOpen) return;
  var t = ev.target;
  if (t.closest && (t.closest('.dice-popover') || t.closest('.dice-tool-btn'))) return;
  closeDicePopovers();
}, true);
function setDiceMode(btn, mode) {
  window.__diceSelectedMode = mode;
  var seg = btn && btn.parentElement;
  if (seg) seg.querySelectorAll(".dice-mode-seg-btn").forEach(function(b){ b.classList.remove("active"); });
  if (btn) btn.classList.add("active");
}
function rollDiceWithSelectedMode(sides) {
  var mode = window.__diceSelectedMode || 'normal';
  rollDice(sides, mode === 'normal' ? undefined : mode);
}
function rollDice(sides, mode) {
var _logId = (window.AppLog ? AppLog.newId('roll') : null);
if (window.AppLog) AppLog.action('dice', 'бросок d' + sides + (mode ? ' (' + mode + ')' : '') + ' — старт', { sides: sides, mode: mode || 'normal' }, _logId);
// DICEFIX-2: мгновенная индикация старта. Первый бросок инициализирует DiceBox ~2с,
// без плейсхолдера клик выглядит «не сработавшим» и провоцирует повторный.
var _rbStart = $("dice-result-big");
if (_rbStart) _rbStart.textContent = "…";
var _riStart = $("dice-result-info");
if (_riStart) _riStart.textContent = "Бросок d" + sides + "…";
var _rxStart = $("dice3d-result");
if (_rxStart) _rxStart.classList.remove("crit-success", "crit-fail");
let r1 = Math.floor(Math.random() * sides) + 1;
let r2 = (mode === 'adv' || mode === 'dis') ? Math.floor(Math.random() * sides) + 1 : null;
let result, resultLabel;
if (mode === 'adv') {
  result = Math.max(r1, r2);
  resultLabel = "Преимущество: " + r1 + " и " + r2;
} else if (mode === 'dis') {
  result = Math.min(r1, r2);
  resultLabel = "Помеха: " + r1 + " и " + r2;
} else {
  result = r1;
  resultLabel = "d" + sides;
}
const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// 3D dice animation (DICE2-3: @3d-dice/dice-box, 2d20 для adv/dis).
// callback получает (v1, v2) — реальные значения из физики. Для adv/dis
// синхронизируем оба кубика с тем, что видит пользователь на столе.
var qty = (mode === 'adv' || mode === 'dis') ? 2 : 1;
animateDice3d(sides, result, function(v1, v2) {
  if (typeof v1 === 'number' && !isNaN(v1)) {
    if (mode === 'adv') {
      r1 = v1;
      r2 = (typeof v2 === 'number' && !isNaN(v2)) ? v2 : r2;
      result = Math.max(r1, r2);
      resultLabel = "Преимущество: " + r1 + " и " + r2;
    } else if (mode === 'dis') {
      r1 = v1;
      r2 = (typeof v2 === 'number' && !isNaN(v2)) ? v2 : r2;
      result = Math.min(r1, r2);
      resultLabel = "Помеха: " + r1 + " и " + r2;
    } else {
      result = v1;
      r1 = v1;
      resultLabel = "d" + sides;
    }
  }
  var resultBig = $("dice-result-big");
  var resultInfo = $("dice-result-info");
  var resultBox = $("dice3d-result");
  // Show dual dice for adv/dis
  if (typeof showDualDice === 'function') {
    showDualDice({ mode: mode || 'normal', roll: result, r1: r1, r2: r2 });
  }
  if (resultBig) resultBig.textContent = result;
  if (window.AppLog) AppLog.action('dice', 'результат d' + sides + ' показан: ' + result, { result: result, r1: r1, r2: r2, mode: mode || 'normal' }, _logId);
  if (resultBox) {
    resultBox.classList.remove("crit-success","crit-fail","normal");
    if (sides === 20 && result === 20) {
      resultBox.classList.add("crit-success");
      if (resultInfo) resultInfo.textContent = "🎉 КРИТИЧЕСКИЙ УСПЕХ!";
      createParticles();
    } else if (sides === 20 && result === 1) {
      resultBox.classList.add("crit-fail");
      if (resultInfo) resultInfo.textContent = "💀 КРИТИЧЕСКИЙ ПРОВАЛ!";
    } else {
      resultBox.classList.add("normal");
      // v3.19: «Кубик: d20» (или с badge mode), компактнее старого «d20 · 13:46»
      if (resultInfo) {
        var modeLabel = mode === 'adv' ? ' ▲' : (mode === 'dis' ? ' ▼' : '');
        var coreLabel = mode === 'adv'
          ? 'Преим.: ' + r1 + ' и ' + r2
          : (mode === 'dis' ? 'Помеха: ' + r1 + ' и ' + r2 : 'Кубик: d' + sides + modeLabel);
        resultInfo.textContent = coreLabel;
      }
    }
    resultBox.classList.add("pop");
    setTimeout(function(){ if(resultBox) resultBox.classList.remove("pop"); }, 400);
  }
  diceHistory.unshift({ sides: sides, result: result, mode: mode || 'normal', time: timestamp, r1: r1, r2: r2 });
  if (diceHistory.length > 10) diceHistory.pop();
  renderDiceHistory();
  try { _updateDiceHistoryBadge(); } catch (e) {}
}, { qty: qty });
}

// ============================================================
// UX-5: универсальная «кидалка» с листа (характеристики, спасброски,
// навыки) — d20(+мод) поверх animateDice3d + общий diceHistory с подписью.
// Чистые помощники (_quickRoll*) тестируются в headless без DOM.
// ============================================================
// Натуральный бросок с учётом режима + итог с модификатором.
// adv/dis: берём больший/меньший из r1/r2; крит/провал — по НАТУРАЛЬНОМУ d20.
function _quickRollCompute(sides, mod, mode, r1, r2) {
  sides = sides || 20; mod = mod || 0;
  var natural, discarded = null;
  if ((mode === 'adv' || mode === 'dis') && typeof r2 === 'number' && !isNaN(r2)) {
    natural = (mode === 'adv') ? Math.max(r1, r2) : Math.min(r1, r2);
    discarded = (natural === r1) ? r2 : r1;
  } else {
    natural = r1;
  }
  return {
    natural: natural,
    total: natural + mod,
    discarded: discarded,
    isCrit: sides === 20 && natural === 20,
    isFail: sides === 20 && natural === 1,
    mode: (mode === 'adv' || mode === 'dis') ? mode : 'normal'
  };
}
// Подпись модификатора: «+3» / «−1» / '' (со «шпациями» для читаемости).
function _quickRollModStr(mod) {
  if (!mod) return '';
  return mod > 0 ? ' + ' + mod : ' − ' + Math.abs(mod);
}
// Запись для общего diceHistory (renderDiceHistory покажет label вместо «d20»).
function _quickRollRecord(label, sides, mod, comp, r1, r2, time) {
  return {
    sides: sides, result: comp.total, mode: comp.mode, time: time,
    r1: r1, r2: r2, label: label, mod: mod, natural: comp.natural
  };
}
// Текст для #dice-result-info: «Ловкость · 17 + 3 = 20» (+ откинутый при adv/dis).
function _quickRollInfoText(label, comp, mod) {
  var modeTag = comp.mode === 'adv' ? ' ▲' : comp.mode === 'dis' ? ' ▼' : '';
  var rollPart = (comp.discarded != null) ? (comp.natural + ' (' + comp.discarded + ')') : String(comp.natural);
  var tail = (mod || comp.discarded != null) ? ' = ' + comp.total : '';
  return label + modeTag + ' · ' + rollPart + _quickRollModStr(mod) + tail;
}
// Текст тоста с эмодзи крита/провала.
function _quickRollToastText(label, comp, mod) {
  var modeTag = comp.mode === 'adv' ? ' ▲' : comp.mode === 'dis' ? ' ▼' : '';
  if (comp.isCrit) return '🎉 КРИТ! ' + label + ': ' + comp.natural + _quickRollModStr(mod) + ' = ' + comp.total;
  if (comp.isFail) return '💀 ПРОВАЛ! ' + label + ': ' + comp.natural + _quickRollModStr(mod) + ' = ' + comp.total;
  var rollPart = (comp.discarded != null) ? (comp.natural + ' (' + comp.discarded + ')') : String(comp.natural);
  return '🎲 ' + label + modeTag + ': ' + rollPart + _quickRollModStr(mod) + ' = ' + comp.total;
}
window._quickRollCompute = _quickRollCompute;
window._quickRollRecord = _quickRollRecord;

// UX-5: лента последних бросков вне модалки. _qrsDismissed — пользователь скрыл
// её крестиком (сбрасывается на новом quickRoll). Объявлено до quickRoll (var-hoist).
var _qrsDismissed = false;

// Универсальный быстрый бросок d20(+мод): открывает арену, кидает 3D, пишет
// в общий diceHistory с подписью, показывает тост. opts: {label, sides=20, mod=0, mode}.
function quickRoll(opts) {
  opts = opts || {};
  var sides = opts.sides || 20;
  var mod = opts.mod || 0;
  var mode = (opts.mode === 'adv' || opts.mode === 'dis') ? opts.mode : 'normal';
  var label = opts.label || ('d' + sides);
  var openArena = opts.openArena !== false;
  if (openArena) { try { openDiceModal(); } catch (e) {} }
  _qrsDismissed = false;
  var r1 = Math.floor(Math.random() * sides) + 1;
  var r2 = (mode === 'adv' || mode === 'dis') ? Math.floor(Math.random() * sides) + 1 : null;
  var pre = _quickRollCompute(sides, mod, mode, r1, r2);
  var qty = (mode === 'adv' || mode === 'dis') ? 2 : 1;
  var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  var _logId = (window.AppLog ? AppLog.newId('roll') : null);
  if (window.AppLog) AppLog.action('dice', label + ' — старт (d' + sides + (mod ? (mod > 0 ? '+' : '') + mod : '') + ', ' + mode + ')', { sides: sides, mod: mod, mode: mode }, _logId);
  var _rb = $("dice-result-big"); if (_rb) _rb.textContent = '…';
  var _ri = $("dice-result-info"); if (_ri) _ri.textContent = 'Бросок ' + label + '…';
  var _rx = $("dice3d-result"); if (_rx) _rx.classList.remove('crit-success', 'crit-fail');
  animateDice3d(sides, pre.natural, function(v1, v2) {
    var rr1 = r1, rr2 = r2;
    if (typeof v1 === 'number' && !isNaN(v1)) {
      rr1 = v1;
      if ((mode === 'adv' || mode === 'dis') && typeof v2 === 'number' && !isNaN(v2)) rr2 = v2;
    }
    var comp = _quickRollCompute(sides, mod, mode, rr1, rr2);
    var resultBig = $("dice-result-big");
    var resultInfo = $("dice-result-info");
    var resultBox = $("dice3d-result");
    if (resultBig) resultBig.textContent = comp.total;
    if (resultBox) {
      resultBox.classList.remove('crit-success', 'crit-fail', 'normal');
      resultBox.classList.add(comp.isCrit ? 'crit-success' : comp.isFail ? 'crit-fail' : 'normal', 'pop');
      setTimeout(function() { if (resultBox) resultBox.classList.remove('pop'); }, 400);
    }
    if (resultInfo) resultInfo.textContent = _quickRollInfoText(label, comp, mod);
    if (comp.isCrit) { try { createParticles(); } catch (e) {} }
    if (typeof showDualDice === 'function') {
      try { showDualDice({ mode: mode, roll: comp.natural, r1: rr1, r2: rr2 }); } catch (e) {}
    }
    try { showToast(_quickRollToastText(label, comp, mod), comp.isCrit ? 'success' : comp.isFail ? 'error' : 'info'); } catch (e) {}
    diceHistory.unshift(_quickRollRecord(label, sides, mod, comp, rr1, rr2, time));
    if (diceHistory.length > 10) diceHistory.pop();
    try { renderDiceHistory(); } catch (e) {}
    try { _updateDiceHistoryBadge(); } catch (e) {}
    try { renderQuickRollStrip(); } catch (e) {}
    if (window.AppLog) AppLog.action('dice', label + ' = ' + comp.total + (comp.isCrit ? ' (крит)' : comp.isFail ? ' (провал)' : ''), { total: comp.total, natural: comp.natural }, _logId);
    // FIN-7: колбэк с готовым результатом (после записи в историю). Изолирован
    // в try/catch — ошибка потребителя (напр. спасбросок концентрации) не должна
    // ронять отрисовку броска.
    if (typeof opts.onResult === 'function') { try { opts.onResult(comp); } catch (e) {} }
  }, { qty: qty });
}
window.quickRoll = quickRoll;

// UX-5: рендер чипов ленты из общего diceHistory (последние 4 броска).
function renderQuickRollStrip() {
  var list = document.getElementById('qrs-list');
  if (!list) return;
  var hist = (Array.isArray(window.diceHistory) ? window.diceHistory : (typeof diceHistory !== 'undefined' ? diceHistory : []));
  var items = hist.slice(0, 4);
  if (!items.length) { list.innerHTML = ''; return; }
  list.innerHTML = items.map(function(r) {
    var modeTag = r.mode === 'adv' ? '▲' : r.mode === 'dis' ? '▼' : '';
    var lbl = r.label ? r.label : (r.mode === 'custom' ? (r.formula || 'формула') : ('d' + r.sides));
    var critCls = '';
    if (r.sides === 20 && r.mode !== 'custom') {
      var nat = (typeof r.natural === 'number') ? r.natural : (r.result - (r.mod || 0));
      if (nat === 20) critCls = ' qrs-crit';
      else if (nat === 1) critCls = ' qrs-fail';
    }
    return '<button type="button" class="qrs-chip' + critCls + '" onclick="openDiceRollHistory()" title="Открыть историю бросков">' +
             '<span class="qrs-chip-label">' + escapeHtml(lbl) + (modeTag ? ' ' + modeTag : '') + '</span>' +
             '<span class="qrs-chip-val">' + escapeHtml(String(r.result)) + '</span>' +
           '</button>';
  }).join('');
}
// Показ/скрытие ленты: видна только когда модалка закрыта, есть история и не скрыта вручную.
function updateQuickRollStripVisibility() {
  var strip = document.getElementById('quick-roll-strip');
  if (!strip) return;
  var hist = (Array.isArray(window.diceHistory) ? window.diceHistory : (typeof diceHistory !== 'undefined' ? diceHistory : []));
  var show = !_diceModalActive() && !_qrsDismissed && hist.length > 0;
  if (show) {
    renderQuickRollStrip();
    strip.hidden = false;
    void strip.offsetWidth; // форс reflow → CSS-переход opacity 0→1 (надёжнее rAF в фоне)
    strip.classList.add('qrs-visible');
  } else {
    strip.classList.remove('qrs-visible');
    setTimeout(function() { if (strip && !strip.classList.contains('qrs-visible')) strip.hidden = true; }, 260);
  }
}
function dismissQuickRollStrip() {
  _qrsDismissed = true;
  updateQuickRollStripVisibility();
}
// Тап по чипу ленты — открыть модалку и поповер истории.
function openDiceRollHistory() {
  try { openDiceModal(); } catch (e) {}
  try { toggleDicePopover('history'); } catch (e) {}
}
window.renderQuickRollStrip = renderQuickRollStrip;
window.updateQuickRollStripVisibility = updateQuickRollStripVisibility;
window.dismissQuickRollStrip = dismissQuickRollStrip;
window.openDiceRollHistory = openDiceRollHistory;

// [DICE2-4] legacy DICE_3D / POLY_GEOM / FACE_ORIENTATIONS / diceFaceColor /
// drawDiceSVG / buildDiceMesh / _computePolyOrientations / getFinalOrientation
// удалены — рендер теперь полностью выполняется @3d-dice/dice-box через animateDice3d() ниже.

function drawDiceSVG() { /* DICE2-4: no-op (совместимость с app-combat.js/app-inventory.js) */ }

// ============================================================
// DICE2-2: интеграция @3d-dice/dice-box (WebGL 3D-кубики)
// ============================================================
// Инициализация DiceBox ленивая (при первом броске), чтобы не грузить
// Babylon+Ammo на старте приложения. Экземпляр хранится в _diceBoxInstance.
var _diceBoxInstance = null;
var _diceBoxInitPromise = null;
// Счётчик подряд идущих soft-таймаутов. Сбрасывается на успешном резолве roll().
// Инстанс DiceBox убиваем только после 3-х подряд — иначе можно случайно
// прибить живой box на медленном броске и оставить пустой стол.
var _diceBoxConsecutiveTimeouts = 0;
// DICEFIX-1: текущий незавершённый 3D-бросок ({done, sides, result, callback, timer}).
// Библиотека не умеет параллельные roll() — roll() внутри делает clear() и стирает
// коллекцию предыдущего броска, его завершение уже никогда не репортится. Поэтому
// в полёте максимум один бросок: новый мгновенно финализирует старый.
var _dice3dActiveRoll = null;

function _waitDiceBoxModule() {
  if (typeof window.DiceBox === 'function') return Promise.resolve();
  return new Promise(function(resolve) {
    var onReady = function() {
      window.removeEventListener('dicebox:ready', onReady);
      resolve();
    };
    window.addEventListener('dicebox:ready', onReady);
    // На случай если событие уже отстрелило до подписки
    if (typeof window.DiceBox === 'function') {
      window.removeEventListener('dicebox:ready', onReady);
      resolve();
    }
  });
}

// DICE2-5: тема кубиков. Приоритет: пользовательский diceColor (localStorage) →
// --accent → fallback. Изменение цвета применяется к новым броскам сразу.
function _getAccentColor() {
  try {
    var custom = localStorage.getItem('diceColor');
    if (custom && /^#[0-9a-f]{6}$/i.test(custom)) return custom;
  } catch (e) {}
  try {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    if (v && /^#[0-9a-f]{3,8}$/i.test(v)) return v;
  } catch (e) {}
  return '#d4a843';
}

var DICE_THEMES = ['steel','rock','wooden','smooth'];
var DICE_THEME_COLORS = {
  steel: '#c0c5ca',
  rock: '#b7aca1',
  wooden: '#b78a55',
  smooth: '#3a6ea5'
};
function _getDiceTheme() {
  try {
    var t = localStorage.getItem('diceTheme');
    if (t && DICE_THEMES.indexOf(t) !== -1) return t;
  } catch (e) {}
  return 'steel';
}
function _getDiceThemeColor() {
  return DICE_THEME_COLORS[_getDiceTheme()] || '#c0c5ca';
}
function setDiceTheme(name) {
  if (DICE_THEMES.indexOf(name) === -1) return;
  try { localStorage.setItem('diceTheme', name); } catch (e) {}
  _syncDiceThemeButtons();
  if (_diceBoxInstance) _diceBoxInstance.updateConfig({ theme: name, themeColor: DICE_THEME_COLORS[name] });
}
function _syncDiceThemeButtons() {
  var active = _getDiceTheme();
  document.querySelectorAll('.dice-theme-btn').forEach(function(b) {
    b.classList.toggle('is-active', b.getAttribute('data-dice-theme') === active);
  });
}
document.addEventListener('DOMContentLoaded', _syncDiceThemeButtons);

// UX-3: вариант фона арены (cosmos/aurora/starfield), персист рядом с diceTheme.
var DICE_BGS = ['cosmos', 'aurora', 'starfield'];
function _getDiceBg() {
  try {
    var b = localStorage.getItem('diceBg');
    if (b && DICE_BGS.indexOf(b) !== -1) return b;
  } catch (e) {}
  return 'cosmos';
}
function setDiceBg(name) {
  if (DICE_BGS.indexOf(name) === -1) return;
  try { localStorage.setItem('diceBg', name); } catch (e) {}
  _syncDiceBgButtons();
  try { if (window.DiceArenaBg && DiceArenaBg.setVariant) DiceArenaBg.setVariant(name); } catch (e) {}
}
function _syncDiceBgButtons() {
  var active = _getDiceBg();
  document.querySelectorAll('.dice-bg-btn').forEach(function(b) {
    b.classList.toggle('is-active', b.getAttribute('data-dice-bg') === active);
  });
}
document.addEventListener('DOMContentLoaded', _syncDiceBgButtons);

// FIN-11: диагностические логи дайса шумели в консоли прода. Прячем за флаг —
// window.DND_DEBUG или localStorage 'dnd_debug_dice'==='1' (для отладки бросков).
function _diceDbg() {
  try { return !!window.DND_DEBUG || localStorage.getItem('dnd_debug_dice') === '1'; }
  catch (e) { return false; }
}

function _initDiceBox() {
  if (_diceBoxInstance) {
    // Recovery: если canvas DiceBox был удалён из DOM (напр. прошлый 2D-fallback
    // когда-то делал innerHTML='') — инстанс мёртв, onRollComplete не сработает.
    // Сбрасываем и пересоздаём, иначе все 3D-броски залипают в 2D навсегда.
    var _cv = _diceBoxInstance.canvas;
    var _cont = document.getElementById('dsvg-container');
    if (_cv && _cont && _cv.isConnected && _cont.contains(_cv)) {
      return Promise.resolve(_diceBoxInstance);
    }
    _diceBoxInstance = null;
    _diceBoxInitPromise = null;
  }
  if (_diceBoxInitPromise) return _diceBoxInitPromise;

  _diceBoxInitPromise = (async function() {
    await _waitDiceBoxModule();
    // assetPath строим от каталога приложения — корректно работает и в корне домена,
    // и в подпапке (GitHub Pages). В dice-box путь собирается как origin+assetPath.
    var basePath = location.pathname.replace(/[^/]*$/, '');
    // PERF: на слабой машине тени — самая дорогая часть кадра WebGL (второй проход
    // сцены в shadow map). Тариф берём у арены (DiceArenaBg.isLowFx): слабое железо
    // определяется до первого броска, адаптивная деградация — после.
    var _lowFx = false;
    try { _lowFx = !!(window.DiceArenaBg && DiceArenaBg.isLowFx && DiceArenaBg.isLowFx()); } catch (e) {}
    var box = new window.DiceBox({
      container: '#dsvg-container',
      assetPath: basePath + 'vendor/dice-box/assets/',
      origin: location.origin,
      theme: _getDiceTheme(),
      themeColor: _getDiceThemeColor(),
      scale: 16,
      // FB-7: физика в ОСНОВНОМ потоке (не OffscreenCanvas-воркер). Дефолтный
      // offscreen-воркер на части окружений (напр. GitHub Pages) не рапортует
      // оседание костей → onRollComplete не зовётся → таймаут 10с на КАЖДЫЙ бросок
      // (видно в логах прода). onscreen-режим (world.onscreen.js) надёжнее.
      offscreen: false,
      enableShadows: !_lowFx,
      shadowTransparency: 0.7,
      lightIntensity: 1
    });
    await box.init();
    _diceBoxInstance = box;
    // FIX: после init() canvas может остаться 300×150 если контейнер ещё
    // не имел размера. resizeWorld() регистрирует resize listener — сами
    // триггерим его, чтобы внутренний WebGL-буфер выровнялся под container.
    try { window.dispatchEvent(new Event('resize')); } catch (e) {}
    // Если контейнер в момент init всё ещё свёрнут (модалка/оверлей в CSS-переходе)
    // — буфер остаётся 0×0 и кость будет невидима. Повторяем ресайз после
    // завершения переходов (~320мс), когда размеры уже настоящие.
    try {
      if (box.canvas && (box.canvas.width === 0 || box.canvas.height === 0)) {
        setTimeout(function () {
          try {
            if (box.canvas && (box.canvas.width === 0 || box.canvas.height === 0)) {
              window.dispatchEvent(new Event('resize'));
              if (typeof box.resize === 'function') box.resize();
            }
          } catch (e) {}
        }, 320);
      }
    } catch (e) {}
    try { if (_diceDbg()) console.log('[DiceBox] init OK', { buf: (box.canvas ? box.canvas.width + 'x' + box.canvas.height : 'none'), css: (box.canvas ? box.canvas.clientWidth + 'x' + box.canvas.clientHeight : 'none'), theme: _getDiceTheme() }); } catch (e) {}
    // Обработчик потери WebGL-контекста: типичная причина «после N бросков 3D
    // ломается» — драйвер/браузер дропают контекст. Помечаем инстанс на
    // пересоздание, следующий _initDiceBox() поднимет чистый.
    try {
      if (box.canvas && !box.canvas.__lossHandlerAttached) {
        box.canvas.__lossHandlerAttached = true;
        box.canvas.addEventListener('webglcontextlost', function(e) {
          try { e.preventDefault(); } catch(_){}
          console.warn('[DiceBox] WebGL context lost — пересоздаём инстанс');
          try { if (box.canvas && box.canvas.parentNode) box.canvas.parentNode.removeChild(box.canvas); } catch(_){}
          _diceBoxInstance = null;
          _diceBoxInitPromise = null;
        }, { once: true });
      }
    } catch (e) {}
    return box;
  })().catch(function(err) {
    console.error('[DiceBox] Ошибка инициализации:', err);
    _diceBoxInitPromise = null;
    throw err;
  });
  return _diceBoxInitPromise;
}

// DICE2-3: callback принимает (actualValue, actualValue2) — второе значение не-undefined
// только при qty=2 (adv/dis). UI синхронизирует оба числа с физикой.
// dice-box поддерживает d4/d6/d8/d10/d12/d20/d100. В notation указываем qty×sides.
//
// FALLBACK-СТРАТЕГИЯ:
// 1. Если prefers-reduced-motion → callback() мгновенно
// 2. Если window.DiceBox недоступен (file:// без HTTP-сервера) или init() упал →
//    animateDice2d() — SVG-анимация подбрасывания. Это РЕАЛЬНЫЙ fallback (3D нет).
// 3. Если 3D-инстанс есть, но физика подвисла >8с (типично: потерянный WebGL-контекст
//    или зависший Babylon worker после нескольких бросков) → НЕ показываем плоский
//    2D-кубик (визуально хуже + сбивает с толку «было 3D — стало плоско»). Просто
//    отдаём precomputed-результат в UI и форсим пересоздание DiceBox к следующему
//    броску — так деградация не накапливается.
function animateDice3d(sides, result, callback, opts) {
  var qty = (opts && opts.qty) ? opts.qty : 1;
  var reduced = prefersReducedMotion();
  // UX-3: открыть полноэкранный оверлей с броском (телефон и ПК)
  try { showDiceRollOverlay(); } catch (e) {}
  // v3.17: импульс космо-арены (shockwave + ускорение орбит на 1с)
  try { if (window.DiceArenaBg) window.DiceArenaBg.pulse(); } catch (e) {}
  if (reduced) {
    setTimeout(function() { callback(); }, 30);
    return;
  }
  // Если 3D-модуль вообще не загружен (file:// без HTTP-сервера) — сразу 2D-fallback
  if (typeof window.DiceBox !== 'function') {
    animateDice2d(sides, result, callback, opts);
    return;
  }
  // DICEFIX-1: interrupt-семантика. Новый бросок, пока предыдущий ещё катится,
  // мгновенно финализирует его precomputed-результатом (callback без аргументов —
  // rollDice() оставит свои r1/r2). Ждать смысла нет: roll() библиотеки всё равно
  // сотрёт и кость, и коллекцию предыдущего, результата от физики уже не будет.
  if (_dice3dActiveRoll && !_dice3dActiveRoll.done) {
    var prev = _dice3dActiveRoll;
    prev.done = true;
    clearTimeout(prev.timer);
    try { if (_diceDbg()) console.log('[DiceBox] бросок прерван новым (sides=' + prev.sides + ')'); } catch (e) {}
    _applyDiceCritGlow(prev.sides, prev.result);
    try { prev.callback(); } catch (e) {}
  }
  var roll = { done: false, sides: sides, result: result, callback: callback, timer: null };
  _dice3dActiveRoll = roll;
  // soft-таймаут: физика обычно укладывается в 3-5с, но иногда d20 катится до 9-10с
  // (отскоки от стенок, баланс на ребре). НЕ показываем 2D-кубик и НЕ удаляем canvas:
  // кость может ещё доехать сама и появится на столе. Просто отдаём precomputed-
  // результат в UI и считаем подряд идущие таймауты — только после 3-х подряд
  // действительно убиваем инстанс (значит box реально мёртв: зомби-worker и т.п.).
  roll.timer = setTimeout(function() {
    if (roll.done) return;
    roll.done = true;
    // clear()/пересоздание — только если бросок всё ещё текущий: иначе можно стереть
    // кость уже катящегося следующего броска и получить каскад таймаутов.
    if (_dice3dActiveRoll === roll) {
      _dice3dActiveRoll = null;
      _diceBoxConsecutiveTimeouts++;
      if (_diceBoxConsecutiveTimeouts >= 3) {
        console.warn('[DiceBox] 3 таймаута подряд — пересоздаём инстанс');
        _diceBoxConsecutiveTimeouts = 0;
        try {
          var oldCv = _diceBoxInstance && _diceBoxInstance.canvas;
          if (oldCv && oldCv.parentNode) oldCv.parentNode.removeChild(oldCv);
        } catch (e) {}
        _diceBoxInstance = null;
        _diceBoxInitPromise = null;
      } else {
        // Буфер WebGL 0×0 = сцена создана при свёрнутом контейнере или после потери
        // контекста: кость гарантированно невидима, «доедет» ей некуда. Ждать
        // 3 таймаута бессмысленно — пересоздаём инстанс сразу (жалоба «кубика нет»).
        var _deadBuf = false;
        try {
          var _bc = _diceBoxInstance && _diceBoxInstance.canvas;
          _deadBuf = !!(_bc && (_bc.width === 0 || _bc.height === 0));
        } catch (e) {}
        if (_deadBuf) {
          console.warn('[DiceBox] roll timeout 10s + буфер 0×0 — пересоздаём инстанс');
          _diceBoxConsecutiveTimeouts = 0;
          try {
            var _oldCv = _diceBoxInstance && _diceBoxInstance.canvas;
            if (_oldCv && _oldCv.parentNode) _oldCv.parentNode.removeChild(_oldCv);
          } catch (e) {}
          _diceBoxInstance = null;
          _diceBoxInitPromise = null;
        } else {
          console.warn('[DiceBox] roll timeout 10s (n=' + _diceBoxConsecutiveTimeouts + '); canvas сохранён, кость доедет');
          // Чистим возможные «улетевшие» кости из физики, чтобы они не висели в фоне
          // и не мешали следующему броску. Сам инстанс/canvas НЕ трогаем.
          try { if (_diceBoxInstance && typeof _diceBoxInstance.clear === 'function') _diceBoxInstance.clear(); } catch (e) {}
        }
      }
    }
    // UI всё равно получает результат: precomputed `result` для одиночного броска,
    // для adv/dis пробрасываем undefined — rollDice() оставит свои r1/r2.
    // 3D-only (решение юзера — без 2D-фолбэка). Таймаут: отдаём результат в UI,
    // кость может ещё доехать сама; инстанс пересоздаётся выше при 3 таймаутах подряд.
    console.warn('[DiceBox] roll timeout 10s (sides=' + sides + ') — результат без 3D-кости');
    _applyDiceCritGlow(sides, result);
    try { callback(); } catch (e) {}
  }, 10000);
  _initDiceBox().then(function(box) {
    // Бросок прервали, пока DiceBox инициализировался — кость не спавним вообще.
    // Раньше тут была гонка «два куба»: clear() нового броска успевал отработать
    // до асинхронного спавна кости старого, и обе оказывались на столе.
    if (roll.done) return;
    // Убираем 2D-SVG от прошлого fallback и сбрасываем inline-стили контейнера,
    // которые мог выставить animateDice2d (display:flex/gap), затем показываем canvas.
    var cont = document.getElementById('dsvg-container');
    if (cont) {
      cont.querySelectorAll('.dice2d-svg').forEach(function(el){ el.remove(); });
      cont.style.display = '';
      cont.style.gap = '';
      cont.style.justifyContent = '';
      cont.style.alignItems = '';
    }
    if (typeof box.show === 'function') { try { box.show(); } catch(e) {} }
    // Страховка от 0×0-буфера WebGL: если init случился при ещё не раскрытой модалке,
    // кость отрисуется в нулевой фреймбуфер = невидима. Форсим ресайз под контейнер.
    try {
      if (box.canvas && (box.canvas.width === 0 || box.canvas.height === 0)) {
        window.dispatchEvent(new Event('resize'));
        if (typeof box.resize === 'function') { try { box.resize(); } catch (e) {} }
        // Ресайз мог не примениться (оверлей ещё в transition) — добиваем после него.
        setTimeout(function () {
          try {
            if (box.canvas && (box.canvas.width === 0 || box.canvas.height === 0)) {
              window.dispatchEvent(new Event('resize'));
              if (typeof box.resize === 'function') box.resize();
            }
          } catch (e) {}
        }, 320);
      }
    } catch (e) {}
    // DICEFIX-1: промис roll() резолвится результатами ИМЕННО этого броска
    // ([{value, sides, ...}]) — в отличие от box.onRollComplete, который
    // перезаписывался каждым новым броском и терял ранние. Явный clear() перед
    // roll() не нужен — roll() чистит стол сам. Промис прерванного броска не
    // резолвится никогда (коллекцию стёр clear() следующего) — guard по roll.done.
    // Синхронный throw из roll() (тема ещё не загружена) уходит во внешний
    // .catch → animateDice2d.
    box.roll([{ qty: qty, sides: sides }], { theme: _getDiceTheme(), themeColor: _getDiceThemeColor() }).then(function(rolls) {
      if (roll.done) return;
      roll.done = true;
      clearTimeout(roll.timer);
      if (_dice3dActiveRoll === roll) _dice3dActiveRoll = null;
      _diceBoxConsecutiveTimeouts = 0;
      var v1, v2;
      try {
        v1 = rolls && rolls[0] ? rolls[0].value : undefined;
        v2 = rolls && rolls[1] ? rolls[1].value : undefined;
      } catch (e) { v1 = undefined; v2 = undefined; }
      // 3D-only: поведение НЕ меняем (никакого 2D-фолбэка) — только диагностика.
      // Если кость пропала, этот лог покажет значение, размеры canvas (буфер vs CSS),
      // подключён ли он к DOM и не потерян ли WebGL-контекст — чтобы починить точечно.
      var diag = {};
      try {
        var cnv = box.canvas;
        if (cnv) {
          diag.buf = cnv.width + 'x' + cnv.height;
          diag.css = cnv.clientWidth + 'x' + cnv.clientHeight;
          diag.connected = cnv.isConnected;
          var gl = cnv.getContext('webgl2') || cnv.getContext('webgl');
          diag.contextLost = gl ? gl.isContextLost() : 'no-gl';
        } else { diag.canvas = 'none'; }
      } catch (e) { diag.err = e.message; }
      try { if (_diceDbg()) console.log('[DiceBox] roll resolved', { sides: sides, qty: qty, v1: v1, v2: v2, diag: diag }); } catch (e) {}
      _applyDiceCritGlow(sides, v1, v2);
      callback(v1, v2);
    }).catch(function(err) {
      // Промис roll() может отвалиться внутри библиотеки (тема не догрузилась,
      // потерянный контекст — в проде видели «Cannot read properties of undefined
      // (reading 'setValue')»). Без этой ветки бросок висел до 10-секундного
      // таймаута, а наверх уходил unhandled rejection с тостом ошибки.
      if (roll.done) return;
      roll.done = true;
      clearTimeout(roll.timer);
      if (_dice3dActiveRoll === roll) _dice3dActiveRoll = null;
      console.warn('[DiceBox] roll rejected — отдаём precomputed:', err && err.message ? err.message : err);
      // Инстанс после такой ошибки считаем мёртвым: следующий бросок поднимет чистый.
      try {
        var _cv2 = _diceBoxInstance && _diceBoxInstance.canvas;
        if (_cv2 && _cv2.parentNode) _cv2.parentNode.removeChild(_cv2);
      } catch (e) {}
      _diceBoxInstance = null;
      _diceBoxInitPromise = null;
      _applyDiceCritGlow(sides, result);
      try { callback(); } catch (e) {}
    });
  }).catch(function() {
    if (roll.done) return;
    roll.done = true;
    clearTimeout(roll.timer);
    if (_dice3dActiveRoll === roll) _dice3dActiveRoll = null;
    animateDice2d(sides, result, callback, opts);
  });
}

// 2D-fallback анимация подбрасывания через SVG (без WebAssembly).
// Работает в любом контексте — file://, HTTP, PWA-standalone.
// Кубик представлен как многоугольник: d4=треугольник, d6=квадрат, d8=октагон,
// d10=декагон, d12=додекагон, d20=шестиугольник (символично), d100=октагон.
function animateDice2d(sides, result, callback, opts) {
  var qty = (opts && opts.qty) ? opts.qty : 1;
  // UX-3: открыть полноэкранный оверлей и для 2D-fallback (телефон и ПК)
  try { showDiceRollOverlay(); } catch (e) {}
  // v3.17: импульс космо-арены и для 2D-fallback — единое UX
  try { if (window.DiceArenaBg) window.DiceArenaBg.pulse(); } catch (e) {}
  var container = document.getElementById('dsvg-container');
  if (!container) { try { callback(); } catch(e){} return; }
  // ВАЖНО: не делать innerHTML='' — это удалит WebGL-canvas DiceBox из DOM,
  // после чего все последующие 3D-броски залипают в 2D навсегда.
  // Удаляем только прежние 2D-SVG, а canvas DiceBox прячем через hide().
  Array.prototype.slice.call(container.children).forEach(function(ch) {
    if (ch.tagName && ch.tagName.toLowerCase() === 'canvas') return;
    container.removeChild(ch);
  });
  if (_diceBoxInstance && typeof _diceBoxInstance.hide === 'function') {
    try { _diceBoxInstance.hide(); } catch(e) {}
  }

  // Второй бросок если qty=2 (для adv/dis)
  var result2 = (qty === 2) ? Math.floor(Math.random() * sides) + 1 : null;

  var SHAPES = { 4: 3, 6: 4, 8: 8, 10: 10, 12: 12, 20: 6, 100: 8 };
  var n = SHAPES[sides] || 6;

  var NS = 'http://www.w3.org/2000/svg';
  function buildDie(label) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '-55 -55 110 110');
    svg.setAttribute('class', 'dice2d-svg');
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'dice2d-g');
    var radius = 44;
    var pts = [];
    for (var i = 0; i < n; i++) {
      var ang = (i * 2 * Math.PI / n) - Math.PI / 2;
      pts.push((radius * Math.cos(ang)).toFixed(1) + ',' + (radius * Math.sin(ang)).toFixed(1));
    }
    var poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('fill', 'url(#dice2d-grad)');
    poly.setAttribute('stroke', '#1a1410');
    poly.setAttribute('stroke-width', '3');
    poly.setAttribute('stroke-linejoin', 'round');
    g.appendChild(poly);
    var text = document.createElementNS(NS, 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('y', '3');
    text.setAttribute('font-size', '34');
    text.setAttribute('font-weight', '800');
    text.setAttribute('fill', '#1a1410');
    text.setAttribute('class', 'dice2d-text');
    text.textContent = String(label);
    g.appendChild(text);

    // Градиент через <defs>
    var defs = document.createElementNS(NS, 'defs');
    var grad = document.createElementNS(NS, 'linearGradient');
    grad.setAttribute('id', 'dice2d-grad');
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
    var s1 = document.createElementNS(NS, 'stop');
    s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#f4d484');
    var s2 = document.createElementNS(NS, 'stop');
    s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#c79941');
    grad.appendChild(s1); grad.appendChild(s2);
    defs.appendChild(grad);
    svg.appendChild(defs);
    svg.appendChild(g);
    return svg;
  }

  // Для adv/dis рисуем два кубика рядом
  if (qty === 2) {
    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    var d1 = buildDie(result);
    var d2 = buildDie(result2);
    d1.style.flex = '1';
    d2.style.flex = '1';
    container.appendChild(d1);
    container.appendChild(d2);
  } else {
    container.style.display = '';
    container.appendChild(buildDie(result));
  }

  // Запускаем анимацию через requestAnimationFrame
  var duration = 900;
  var t0 = performance.now();
  var gs = container.querySelectorAll('.dice2d-g');
  function tick(now) {
    var t = Math.min(1, (now - t0) / duration);
    // ease-out cubic
    var k = 1 - Math.pow(1 - t, 3);
    var rot = k * 720;            // 2 полных оборота
    var scale = 0.4 + k * 0.6;    // 0.4 → 1.0
    var opacity = Math.min(1, t * 3);
    gs.forEach(function(g) {
      g.setAttribute('transform', 'rotate(' + rot.toFixed(1) + ') scale(' + scale.toFixed(2) + ')');
      g.style.opacity = opacity;
    });
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      _applyDiceCritGlow(sides, result, result2);
      try { callback(result, result2); } catch(e) {}
    }
  }
  requestAnimationFrame(tick);
}
window.animateDice2d = animateDice2d;

// DICE2-5: кратковременный glow контейнера кубиков на крит. d20.
function _applyDiceCritGlow(sides, v1, v2) {
  if (sides !== 20) return;
  var el = document.getElementById('dsvg-container');
  if (!el) return;
  el.classList.remove('crit-success', 'crit-fail');
  var hasCrit = (v1 === 20) || (v2 === 20);
  var hasFail = (v1 === 1)  || (v2 === 1);
  if (!hasCrit && !hasFail) return;
  void el.offsetWidth;
  el.classList.add(hasCrit ? 'crit-success' : 'crit-fail');
  setTimeout(function() { el.classList.remove('crit-success', 'crit-fail'); }, 1400);
}

// ============================================================
// UX-2: надёжный парсер формулы кубиков.
// Грамматика: последовательность термов со знаком ±, где терм =
//   NdX | dX (=1dX) | целое-модификатор. Несколько кубиковых групп
//   складываются. Нормализация: к→d, нижний регистр, без пробелов.
// Клампы: count 1..50, грань ≥2 (до 1000). Итог ≥1 — на стадии подсчёта.
// Возврат: { ok:true, groups:[{count,sides,sign}], mod } | { ok:false, error }
// ============================================================
function parseDiceFormula(raw) {
  var s = String(raw == null ? '' : raw).toLowerCase().replace(/к/g, 'd').replace(/\s+/g, '');
  if (!s) return { ok: false, error: 'Введите формулу (пример: 2к6+3)' };
  if (!/^[0-9d+\-]+$/.test(s)) return { ok: false, error: 'Неверный формат (пример: 2к6+3)' };
  if (s[0] !== '+' && s[0] !== '-') s = '+' + s;
  var termRe = /([+-])([^+-]*)/g;
  var m, idx = 0, groups = [], mod = 0, hasDice = false;
  while ((m = termRe.exec(s)) !== null) {
    if (m.index !== idx) return { ok: false, error: 'Неверный формат (пример: 2к6+3)' };
    idx = termRe.lastIndex;
    var sign = m[1] === '-' ? -1 : 1;
    var body = m[2];
    if (body === '') return { ok: false, error: 'Неверный формат (пример: 2к6+3)' };
    var dm = body.match(/^(\d*)d(\d*)$/);
    if (dm) {
      var count = dm[1] === '' ? 1 : parseInt(dm[1], 10);
      var sides = dm[2] === '' ? 0 : parseInt(dm[2], 10);
      if (!sides || sides < 2) return { ok: false, error: 'Грань кубика ≥ 2 (пример: к6, к20)' };
      count = Math.max(1, Math.min(count, 50));
      sides = Math.min(sides, 1000);
      groups.push({ count: count, sides: sides, sign: sign });
      hasDice = true;
    } else if (/^\d+$/.test(body)) {
      mod += sign * parseInt(body, 10);
    } else {
      return { ok: false, error: 'Неверный формат (пример: 2к6+3)' };
    }
  }
  if (idx !== s.length) return { ok: false, error: 'Неверный формат (пример: 2к6+3)' };
  if (!hasDice) return { ok: false, error: 'Нужен хотя бы один кубик (пример: к20+3)' };
  return { ok: true, groups: groups, mod: mod };
}
window.parseDiceFormula = parseDiceFormula;

// UX-2: канонизованная подпись формулы (для плейсхолдера и истории), кириллица.
function _formulaCanon(groups, mod) {
  var out = '';
  groups.forEach(function(g, i) {
    var sign = g.sign < 0 ? '−' : (i === 0 ? '' : '+');
    out += sign + (g.count > 1 ? g.count : '') + 'к' + g.sides;
  });
  if (mod) out += (mod < 0 ? '−' : '+') + Math.abs(mod);
  return out;
}

// UX-2: подсчёт суммы по группам + модификатор, разбивка в #dice-result-info.
// rollsByGroup — массив массивов выпавших значений (по группе). Возвращает {total}.
function _renderFormulaResult(groups, rollsByGroup, mod) {
  var total = 0, parts = [], multi = (groups.length > 1) || (mod !== 0);
  groups.forEach(function(g, i) {
    var rolls = rollsByGroup[i];
    var sum = rolls.reduce(function(a, b){ return a + b; }, 0);
    if (g.count > 1) multi = true;
    total += g.sign * sum;
    var prefix = (i === 0) ? (g.sign < 0 ? '−' : '') : (g.sign < 0 ? ' − ' : ' + ');
    var dieLabel = (g.count > 1 ? g.count : '') + 'к' + g.sides;
    parts.push(prefix + dieLabel + ': ' + rolls.join('+'));
  });
  if (mod !== 0) parts.push((mod < 0 ? ' − ' : ' + ') + Math.abs(mod));
  total += mod;
  total = Math.max(1, total);
  var resultBig = $("dice-result-big");
  var resultInfo = $("dice-result-info");
  var resultBox = $("dice3d-result");
  if (resultBig) resultBig.textContent = total;
  if (resultInfo) resultInfo.textContent = parts.join('') + (multi ? ' = ' + total : '');
  if (resultBox) {
    resultBox.classList.remove('crit-success', 'crit-fail');
    resultBox.classList.add('normal', 'pop');
    setTimeout(function(){ if (resultBox) resultBox.classList.remove('pop'); }, 400);
  }
  return { total: total };
}

// CAST-3: универсальный бросок формулы «2к6+3» — ядро, извлечённое из
// _rollFormulaFrom, доступно другим модулям (лечение/урон кастов).
// Запускает настоящий 3D-бросок основной группы через animateDice3d, на колбэке
// сверяет основную группу с физикой (для ≤2 кубиков) и показывает разбивку.
// opts: { label — подпись в истории/ленте/инфо, openArena — открыть арену кубов,
// onResult(res{total}) — колбэк после записи в историю (изолирован try/catch) }.
// Возвращает результат parseDiceFormula ({ok:false,error} — вызывающий решает,
// что показать). Interrupt-семантику гонок бросков разруливает animateDice3d.
function rollFormula(formula, opts) {
  opts = opts || {};
  var parsed = parseDiceFormula(formula);
  if (!parsed.ok) {
    if (window.AppLog) AppLog.action('dice', 'формула отклонена: ' + parsed.error);
    return parsed;
  }
  if (opts.openArena) { try { openDiceModal(); } catch (e) {} }
  var label = opts.label || null;
  var groups = parsed.groups, mod = parsed.mod;
  var canon = _formulaCanon(groups, mod);
  // Пре-расчёт всех групп (математика — авторитетна; 3D для одной группы — визуал).
  var rollsByGroup = groups.map(function(g) {
    var arr = [];
    for (var i = 0; i < g.count; i++) arr.push(Math.floor(Math.random() * g.sides) + 1);
    return arr;
  });
  // Основная группа для 3D — с наибольшим числом кубиков (тай-брейк: первая).
  var primaryIdx = 0;
  for (var gi = 1; gi < groups.length; gi++) {
    if (groups[gi].count > groups[primaryIdx].count) primaryIdx = gi;
  }
  var primary = groups[primaryIdx];
  var precompPrimarySum = rollsByGroup[primaryIdx].reduce(function(a, b){ return a + b; }, 0);
  var timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  var resultBig = $("dice-result-big");
  var resultInfo = $("dice-result-info");
  if (resultBig) resultBig.textContent = '…';
  if (resultInfo) resultInfo.textContent = 'Бросок ' + (label ? label + ' · ' : '') + canon + '…';
  if (window.AppLog) AppLog.action('dice', 'формула ' + canon + (label ? ' (' + label + ')' : '') + ' — старт', { sides: primary.sides });

  animateDice3d(primary.sides, precompPrimarySum, function(v1, v2) {
    // Сверка основной группы с физикой, где это возможно: 1 кубик → v1, 2 → v1,v2.
    if (primary.count === 1 && typeof v1 === 'number' && !isNaN(v1)) {
      rollsByGroup[primaryIdx] = [v1];
    } else if (primary.count === 2 && typeof v1 === 'number' && !isNaN(v1) && typeof v2 === 'number' && !isNaN(v2)) {
      rollsByGroup[primaryIdx] = [v1, v2];
    }
    var res = _renderFormulaResult(groups, rollsByGroup, mod);
    if (label) {
      var ri = $("dice-result-info");
      if (ri) ri.textContent = label + ' · ' + ri.textContent;
    }
    diceHistory.unshift({ sides: primary.sides, result: res.total, mode: 'custom', formula: canon, label: label || undefined, time: timestamp });
    if (diceHistory.length > 10) diceHistory.pop();
    renderDiceHistory();
    try { _updateDiceHistoryBadge(); } catch (e) {}
    if (window.AppLog) AppLog.action('dice', 'формула ' + canon + ' = ' + res.total + (label ? ' (' + label + ')' : ''), { total: res.total });
    if (typeof opts.onResult === 'function') { try { opts.onResult(res); } catch (e) {} }
  }, { qty: Math.min(primary.count, 10) });
  return parsed;
}
window.rollFormula = rollFormula;

// UX-2: общий обработчик «своей формулы» — оба инпута (main и поповер) зовут его.
// CAST-3: стал обёрткой над rollFormula; на себе — только показ ошибки парсинга.
function _rollFormulaFrom(inputId) {
  var input = document.getElementById(inputId) || document.getElementById('dice-custom-input');
  if (!input) return;
  var parsed = rollFormula(input.value);
  if (parsed && !parsed.ok) {
    var resultBig = $("dice-result-big");
    var resultInfo = $("dice-result-info");
    if (resultInfo) resultInfo.textContent = parsed.error;
    if (resultBig) resultBig.textContent = '—';
  }
}

// UX-2: поповер-инпут «своя формула» — тот же общий обработчик.
function rollCustomFormula() {
  try { _rollFormulaFrom('dice-custom-input'); } catch (e) {}
}
function renderDiceHistory() {
const container = $("dice-history");
if (!container) return;
container.innerHTML = "";
diceHistory.forEach(function(record) {
const div = document.createElement("div");
div.className = "dice-history-item";
if (record.sides === 20) {
if (record.result === 20) div.classList.add("crit-success");
else if (record.result === 1) div.classList.add("crit-fail");
}
const modeTag = record.mode === 'adv' ? ' ▲' : record.mode === 'dis' ? ' ▼' : '';
// UX-5: для бросков с листа (quickRoll) показываем подпись («Спас. Ловкость»),
// иначе — формулу (custom) или «dN».
var label;
if (record.label) label = escapeHtml(record.label) + modeTag;
else if (record.mode === 'custom') label = record.formula || "custom";
else label = "d" + record.sides + modeTag;
div.innerHTML = "<span>" + label + " (" + record.time + ")</span><span>" + record.result + "</span>";
container.appendChild(div);
});
}
function createParticles() {
const display = $("dice-result-display");
if (!display) return;
for (let i = 0; i < 20; i++) {
const particle = document.createElement("div");
particle.className = "particle";
particle.style.left = (Math.random() * 100) + "%";
particle.style.top = (Math.random() * 100) + "%";
particle.style.animationDelay = (Math.random() * 0.5) + "s";
display.appendChild(particle);
setTimeout(() => particle.remove(), 1000);
}
}

