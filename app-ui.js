// ============================================================
// app-ui.js — Интерфейс: аватар, кубики, аккордеоны,
// ресурсы класса, ASI, журнал, спутники, черты, профили
// ============================================================

// ============================================
// UI-10. Skeleton-лоадеры + подсветка поиска
// ============================================

/** Заполняет контейнер мерцающими skeleton-плашками.
 *  variant: "list" (заклинания/инвентарь) | "card" (билды). */
function injectSkeletons(containerId, count, variant) {
  var c = document.getElementById(containerId);
  if (!c) return;
  var isCard = variant === "card";
  var rowCls = "skel-row" + (isCard ? " skel-card" : "");
  var row = '<div class="' + rowCls + '">' +
              '<div class="skel-line skel-line-title"></div>' +
              '<div class="skel-line skel-line-sub"></div>' +
              (isCard ? '<div class="skel-line skel-line-mini"></div>' : '') +
            '</div>';
  c.innerHTML = '<div class="skeleton-list" aria-hidden="true">' + row.repeat(count) + '</div>';
}

/** Показывает skeleton один раз за сессию для данного ключа, затем
 *  через delay вызывает renderFn (который рендерит реальный список).
 *  Возвращает true, если skeleton показан (вызывающий должен сделать return). */
function firstLoadSkeleton(key, containerId, count, variant, renderFn, delay) {
  if (!window._skelDone) window._skelDone = {};
  if (window._skelDone[key]) return false;
  window._skelDone[key] = true;
  injectSkeletons(containerId, count, variant);
  setTimeout(renderFn, delay || 300);
  return true;
}

/** Экранирует text и оборачивает вхождения query в <mark class="search-hl">.
 *  Регистронезависимо. Возвращает безопасный HTML. */
function highlightMatch(text, query) {
  var safe = escapeHtml(text == null ? "" : String(text));
  var q = (query == null ? "" : String(query)).trim();
  if (!q) return safe;
  var safeQ = escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var rx = new RegExp("(" + safeQ + ")", "ig");
  return safe.replace(rx, '<mark class="search-hl">$1</mark>');
}

// ============================================
// АВАТАР ПЕРСОНАЖА
// ============================================

/** Открыть модалку аватара для текущего персонажа */
function openAvatarModal(event) {
  if (event) event.stopPropagation();
  if (!currentId) return;
  const char = getCurrentChar();
  if (!char) return;
  // Показать текущий аватар в превью
  const preview = $("avatar-modal-preview");
  if (preview) {
    if (char.avatar) {
      preview.innerHTML = "<img src=\"" + char.avatar + "\" alt=\"Аватар\">";
    } else {
      preview.innerHTML = char.class ? ("<span class=\"avatar-modal-placeholder\">" + getClassIcon(char.class) + "</span>") : AVATAR_FALLBACK_IMG;
    }
  }
  const urlInput = $("avatar-url-input");
  if (urlInput) urlInput.value = "";
  openModal("avatar-modal");
}

function closeAvatarModal() { closeModal("avatar-modal"); }

/** Загрузить аватар с устройства — сжимаем до 400×400 через canvas */
function handleAvatarFile(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { showToast("Выберите файл изображения", "error"); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const MAX = 400;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      applyAvatar(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  // Сбросить input чтобы можно было выбрать тот же файл повторно
  input.value = "";
}

/** Сохранить аватар по URL */
function applyAvatarFromUrl() {
  const url = ($("avatar-url-input")?.value || "").trim();
  if (!url) { showToast("Введите ссылку на изображение", "warn"); return; }
  // Проверяем что ссылка похожа на картинку
  applyAvatar(url);
}

/** Применить аватар (base64 или URL) — сохранить и перерисовать */
function applyAvatar(src) {
  if (!currentId) return;
  const char = getCurrentChar();
  if (!char) return;
  char.avatar = src;
  char.updatedAt = Date.now();
  saveToLocal();
  // Обновить превью в модалке
  const preview = $("avatar-modal-preview");
  if (preview) preview.innerHTML = "<img src=\"" + src + "\" alt=\"Аватар\">";
  // Обновить аватар в шапке листа
  renderSheetAvatar();
  // Перерисовать карточку в списке
  renderCharacterList();
  showToast("Аватар сохранён", "success");
}

/** Удалить аватар */
function removeAvatar(event) {
  if (event) event.stopPropagation();
  if (!currentId) return;
  const char = getCurrentChar();
  if (!char) return;
  char.avatar = null;
  char.updatedAt = Date.now();
  saveToLocal();
  const preview = $("avatar-modal-preview");
  if (preview) preview.innerHTML = char.class ? ("<span class=\"avatar-modal-placeholder\">" + getClassIcon(char.class) + "</span>") : AVATAR_FALLBACK_IMG;
  renderSheetAvatar();
  renderCharacterList();
  showToast("Аватар удалён", "info");
}

/** HTML-помощник для placeholder-аватара (без билда/без класса) */
const AVATAR_FALLBACK_IMG = '<img class="avatar-modal-fallback" src="assets/avatar-fallback.webp" alt="">';

/** Обновить аватар в шапке листа персонажа */
function renderSheetAvatar() {
  const el = $("sheet-avatar");
  if (!el) return;
  const char = getCurrentChar();
  if (char && char.avatar) {
    el.innerHTML = "<img src=\"" + char.avatar + "\" alt=\"Аватар\" onclick=\"openAvatarModal(event)\">";
    el.classList.add("has-avatar");
  } else {
    const inner = (char && char.class) ? getClassIcon(char.class) : AVATAR_FALLBACK_IMG;
    el.innerHTML = "<button type=\"button\" class=\"avatar-icon-btn\" onclick=\"openAvatarModal(event)\" aria-label=\"Сменить аватар\">" + inner + "</button>";
    el.classList.remove("has-avatar");
  }
}

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
  // v3.17: запуск космо-арены (canvas#diceArenaBg) после того как модалка получила размер
  try {
    if (window.DiceArenaBg) {
      var arenaCv = document.getElementById('diceArenaBg');
      if (arenaCv) window.DiceArenaBg.start(arenaCv);
    }
  } catch (e) {}
}, 60);
}
function closeDiceModal() {
// v3.17: ставим RAF космо-арены на паузу — экономия CPU/батареи когда модалка закрыта
try { if (window.DiceArenaBg) window.DiceArenaBg.stop(); } catch (e) {}
// v3.18: закрываем поповеры если были открыты
try { closeDicePopovers(); } catch (e) {}
const modal = $("dice-modal");
if (modal) modal.classList.remove("active");
const display = $("dice-result-display");
if (display) display.classList.remove("crit-success", "crit-fail", "normal");
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
// v3.19: формула из основного input'а под сеткой (дубль popover-формулы для удобства)
function rollCustomFormulaFromMain() {
  var src = document.getElementById('dice-custom-input-main');
  var dst = document.getElementById('dice-custom-input');
  if (src && dst) { dst.value = src.value; }
  try { rollCustomFormula(); } catch (e) {}
}
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

// [DICE2-4] legacy DICE_3D / POLY_GEOM / FACE_ORIENTATIONS / diceFaceColor /
// drawDiceSVG / buildDiceMesh / _computePolyOrientations / getFinalOrientation
// удалены — рендер теперь полностью выполняется @3d-dice/dice-box через animateDice3d() ниже.

function drawDiceSVG() { /* DICE2-4: no-op (совместимость с app-combat.js/app-inventory.js) */ }


function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

// UI-11: count-up числа в элементе от from к to (ease-out cubic).
// reduced-motion / нечисловые / равные значения → мгновенная установка.
function animateCountUp(el, from, to, duration) {
  if (!el) return;
  from = Number(from); to = Number(to);
  if (!isFinite(from) || !isFinite(to)) { el.textContent = to; return; }
  if (from === to || prefersReducedMotion()) { el.textContent = to; return; }
  duration = duration || 400;
  if (el._countRaf) cancelAnimationFrame(el._countRaf);
  var t0 = performance.now();
  function tick(now) {
    var t = Math.min(1, (now - t0) / duration);
    var k = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * k);
    if (t < 1) { el._countRaf = requestAnimationFrame(tick); }
    else { el.textContent = to; el._countRaf = null; }
  }
  el._countRaf = requestAnimationFrame(tick);
}
window.animateCountUp = animateCountUp;

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

// UI-1: тема (Тёмная / Светлая / Системная)
var THEMES = ['dark', 'light', 'auto'];
function _getTheme() {
  try {
    var t = localStorage.getItem('dnd_theme');
    if (THEMES.indexOf(t) !== -1) return t;
  } catch (e) {}
  return 'dark';
}
function _isEffectiveLight(t) {
  if (t === 'light') return true;
  if (t === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches) return true;
  return false;
}
// Резолвит 'auto' в фактическое 'dark'/'light' через matchMedia.
// 'light'/'dark' возвращаются как есть.
function _resolveTheme(t) {
  if (t === 'light' || t === 'dark') return t;
  if (t === 'auto') return _isEffectiveLight('auto') ? 'light' : 'dark';
  return 'dark';
}
function _applyTheme(t) {
  // На <html> ставим резолвленную тему ('dark'/'light'), чтобы CSS-правила
  // [data-theme="dark"] / [data-theme="light"] всегда срабатывали корректно
  // независимо от того, как браузер интерпретирует prefers-color-scheme.
  // В localStorage (через setTheme) сохраняется исходный выбор пользователя.
  document.documentElement.setAttribute('data-theme', _resolveTheme(t));
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', _isEffectiveLight(t) ? '#eef2ef' : '#1a1a24');
  // Обновить тему кубиков (цвет акцента)
  if (typeof _diceBoxInstance !== 'undefined' && _diceBoxInstance) {
    try { _diceBoxInstance.updateConfig({ themeColor: _getDiceThemeColor() }); } catch(e) {}
  }
}
function setTheme(name) {
  if (THEMES.indexOf(name) === -1) return;
  try { localStorage.setItem('dnd_theme', name); } catch (e) {}
  _applyTheme(name);
  _syncThemeButtons();
}
function _syncThemeButtons() {
  var active = _getTheme();
  document.querySelectorAll('.theme-picker-btn').forEach(function(b) {
    b.classList.toggle('is-active', b.getAttribute('data-theme-btn') === active);
  });
}
document.addEventListener('DOMContentLoaded', _syncThemeButtons);

// UI-2: акцент (8 пресетов)
var ACCENTS = ['gold','emerald','ruby','amethyst','sapphire','copper','silver','graphite'];
function _getAccent() {
  try {
    var a = localStorage.getItem('dnd_accent');
    if (ACCENTS.indexOf(a) !== -1) return a;
  } catch (e) {}
  return 'gold';
}
function _applyAccent(name) {
  if (name === 'gold') document.documentElement.removeAttribute('data-accent');
  else document.documentElement.setAttribute('data-accent', name);
  if (typeof _diceBoxInstance !== 'undefined' && _diceBoxInstance) {
    try { _diceBoxInstance.updateConfig({ themeColor: _getDiceThemeColor() }); } catch(e) {}
  }
}
function setAccent(name) {
  if (ACCENTS.indexOf(name) === -1) return;
  try { localStorage.setItem('dnd_accent', name); } catch (e) {}
  // UI-3: ручной выбор чипа выключает авто-режим
  if (_getAutoAccent()) {
    try { localStorage.setItem('dnd_auto_accent', '0'); } catch (e) {}
    _syncAutoAccentToggle();
  }
  _applyAccent(name);
  _syncAccentButtons();
}
function _syncAccentButtons() {
  var auto = _getAutoAccent();
  var active = _getAccent();
  if (auto) {
    var ch = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
    if (ch && ch.class) active = _accentForClass(ch.class);
  }
  document.querySelectorAll('.accent-chip').forEach(function(b) {
    b.classList.toggle('is-active', b.getAttribute('data-accent-btn') === active);
    b.classList.toggle('is-disabled', auto);
    b.disabled = auto;
  });
}
document.addEventListener('DOMContentLoaded', _syncAccentButtons);

// UI-3: авто-акцент по классу активного персонажа
var CLASS_ACCENT_MAP = {
  "Варвар":     "ruby",
  "Бард":       "copper",
  "Воин":       "silver",
  "Волшебник":  "sapphire",
  "Друид":      "emerald",
  "Жрец":       "gold",
  "Колдун":     "amethyst",
  "Монах":      "copper",
  "Паладин":    "gold",
  "Плут":       "graphite",
  "Следопыт":   "emerald",
  "Чародей":    "ruby"
};
function _getAutoAccent() {
  try { return localStorage.getItem('dnd_auto_accent') === '1'; } catch (e) { return false; }
}
function _accentForClass(cls) {
  return CLASS_ACCENT_MAP[cls] || 'gold';
}
function _applyClassAccent(cls) {
  _applyAccent(_accentForClass(cls));
}
function _refreshAccent() {
  if (_getAutoAccent()) {
    var ch = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
    if (ch && ch.class) { _applyClassAccent(ch.class); _syncAccentButtons(); return; }
  }
  _applyAccent(_getAccent());
  _syncAccentButtons();
}
function setAutoAccent(on) {
  try { localStorage.setItem('dnd_auto_accent', on ? '1' : '0'); } catch (e) {}
  _syncAutoAccentToggle();
  _refreshAccent();
}
function _syncAutoAccentToggle() {
  var t = document.getElementById('auto-accent-toggle');
  if (t) t.checked = _getAutoAccent();
}
document.addEventListener('DOMContentLoaded', function() {
  _syncAutoAccentToggle();
  _refreshAccent();
});

// UI-4: плотность интерфейса (compact / standard / cozy)
var DENSITIES = ['compact','standard','cozy'];
// UI5-5: брейкпоинт «телефон» для авто-плотности (синхронен inline-FOUC в index.html)
var MOBILE_DENSITY_MQ = '(max-width: 640px)';
// Явный выбор пользователя или null, если плотность не задавалась
function _getStoredDensity() {
  try {
    var d = localStorage.getItem('dnd_density');
    if (DENSITIES.indexOf(d) !== -1) return d;
  } catch (e) {}
  return null;
}
// UI5-5: дефолт без явного выбора — compact на телефоне, иначе standard
function _getDefaultDensity() {
  try {
    if (window.matchMedia && window.matchMedia(MOBILE_DENSITY_MQ).matches) return 'compact';
  } catch (e) {}
  return 'standard';
}
// Эффективная плотность = явный выбор, иначе авто-дефолт по вьюпорту
function _getDensity() {
  return _getStoredDensity() || _getDefaultDensity();
}
function _applyDensity(name) {
  if (name === 'standard') document.documentElement.removeAttribute('data-density');
  else document.documentElement.setAttribute('data-density', name);
}
function setDensity(name) {
  if (DENSITIES.indexOf(name) === -1) return;
  try { localStorage.setItem('dnd_density', name); } catch (e) {}
  _applyDensity(name);
  _syncDensityButtons();
}
function _syncDensityButtons() {
  var active = _getDensity();
  document.querySelectorAll('.theme-picker-btn[data-density-btn]').forEach(function(b) {
    b.classList.toggle('is-active', b.getAttribute('data-density-btn') === active);
  });
}
// UI5-5: при смене ширины/повороте пересчитать авто-плотность — но только пока
// пользователь не задал её явно (его выбор всегда важнее вьюпорта).
function _onViewportDensityChange() {
  if (_getStoredDensity()) return;
  _applyDensity(_getDefaultDensity());
  _syncDensityButtons();
}
document.addEventListener('DOMContentLoaded', function() {
  _syncDensityButtons();
  try {
    if (window.matchMedia) {
      var mq = window.matchMedia(MOBILE_DENSITY_MQ);
      if (mq.addEventListener) mq.addEventListener('change', _onViewportDensityChange);
      else if (mq.addListener) mq.addListener(_onViewportDensityChange);
    }
  } catch (e) {}
});

// UI-5: масштаб шрифта (0.9..1.3, шаг 0.05)
var FS_SCALE_MIN = 0.9, FS_SCALE_MAX = 1.3, FS_SCALE_DEFAULT = 1.0;
function _getFontScale() {
  try {
    var v = parseFloat(localStorage.getItem('dnd_fs_scale'));
    if (isFinite(v) && v >= FS_SCALE_MIN && v <= FS_SCALE_MAX) return v;
  } catch (e) {}
  return FS_SCALE_DEFAULT;
}
function _applyFontScale(v) {
  // UI-5: zoom применяем к <body>, а не к <html>. На html zoom меняет
  // эффективную ширину вьюпорта (window/zoom) и сдвигает порог
  // десктопного sidebar (1200px) — меню «слетает» при 130%+узком окне.
  // На body zoom масштабирует контент, но медиа-запросы продолжают
  // считаться по реальной ширине окна → layout остаётся стабильным.
  var body = document.body;
  if (!body) return;
  if (v === FS_SCALE_DEFAULT) body.style.removeProperty('zoom');
  else body.style.zoom = String(v);
}
function setFontScale(v) {
  v = parseFloat(v);
  if (!isFinite(v)) return;
  // округляем до шага 0.05 и зажимаем в диапазоне
  v = Math.round(v * 20) / 20;
  if (v < FS_SCALE_MIN) v = FS_SCALE_MIN;
  if (v > FS_SCALE_MAX) v = FS_SCALE_MAX;
  try { localStorage.setItem('dnd_fs_scale', String(v)); } catch (e) {}
  _applyFontScale(v);
  _syncFontScaleUi();
}
function _syncFontScaleUi() {
  var v = _getFontScale();
  var slider = document.getElementById('fs-scale-slider');
  var label = document.getElementById('fs-scale-value');
  var pct = Math.round(v * 100);
  if (slider && parseInt(slider.value, 10) !== pct) slider.value = String(pct);
  if (label) label.textContent = pct + '%';
}
document.addEventListener('DOMContentLoaded', _syncFontScaleUi);

// UI4-glass: прозрачность (alpha 0.30..1.00) и размытие (blur 0..24px)
// поверхностей. Применяются как inline CSS-переменные на documentElement
// (--glass-alpha / --glass-blur), перебивают значения из :root в style.css.
var GLASS_A_MIN = 0.30, GLASS_A_MAX = 1.00, GLASS_A_DEFAULT = 0.72;
var GLASS_B_MIN = 0, GLASS_B_MAX = 24, GLASS_B_DEFAULT = 10;
function _getGlassAlpha() {
  try {
    var v = parseFloat(localStorage.getItem('dnd_glass_alpha'));
    if (isFinite(v) && v >= GLASS_A_MIN && v <= GLASS_A_MAX) return v;
  } catch (e) {}
  return GLASS_A_DEFAULT;
}
function _getGlassBlur() {
  try {
    var v = parseInt(localStorage.getItem('dnd_glass_blur'), 10);
    if (isFinite(v) && v >= GLASS_B_MIN && v <= GLASS_B_MAX) return v;
  } catch (e) {}
  return GLASS_B_DEFAULT;
}
function _applyGlassAlpha(v) { document.documentElement.style.setProperty('--glass-alpha', String(v)); }
function _applyGlassBlur(v) { document.documentElement.style.setProperty('--glass-blur', v + 'px'); }
function setGlassAlpha(v) {
  v = parseFloat(v);
  if (!isFinite(v)) return;
  v = Math.round(v * 100) / 100; // шаг 0.01 (слайдер в %)
  if (v < GLASS_A_MIN) v = GLASS_A_MIN;
  if (v > GLASS_A_MAX) v = GLASS_A_MAX;
  try { localStorage.setItem('dnd_glass_alpha', String(v)); } catch (e) {}
  _applyGlassAlpha(v);
  _syncGlassUi();
}
function setGlassBlur(v) {
  v = parseInt(v, 10);
  if (!isFinite(v)) return;
  if (v < GLASS_B_MIN) v = GLASS_B_MIN;
  if (v > GLASS_B_MAX) v = GLASS_B_MAX;
  try { localStorage.setItem('dnd_glass_blur', String(v)); } catch (e) {}
  _applyGlassBlur(v);
  _syncGlassUi();
}
function _syncGlassUi() {
  var a = _getGlassAlpha(), b = _getGlassBlur();
  var as = document.getElementById('glass-alpha-slider');
  var av = document.getElementById('glass-alpha-value');
  var bs = document.getElementById('glass-blur-slider');
  var bv = document.getElementById('glass-blur-value');
  var apct = Math.round(a * 100);
  if (as && parseInt(as.value, 10) !== apct) as.value = String(apct);
  if (av) av.textContent = apct + '%';
  if (bs && parseInt(bs.value, 10) !== b) bs.value = String(b);
  if (bv) bv.textContent = b + 'px';
}
document.addEventListener('DOMContentLoaded', function () {
  _applyGlassAlpha(_getGlassAlpha());
  _applyGlassBlur(_getGlassBlur());
  _syncGlassUi();
  // UI5-5: на время перетаскивания слайдеров «стекла» —
  //  (1) отключаем CSS-transition на всех поверхностях (класс на <html>): иначе смена
  //      --glass-alpha/--glass-blur ~60×/сек ре-триггерит background/backdrop-transition
  //      на десятках карточек → «погоня»/тряска (особенно непрозрачность);
  //  (2) паузим анимированный фон #bgCanvas, чтобы backdrop-filter не пересчитывался
  //      поверх движущегося фона (мерцание/тряска размытия).
  // Возобновляем по отпусканию/потере фокуса.
  var _glassStart = function () {
    document.documentElement.classList.add('glass-adjusting');
    if (window.__bgOrbits && __bgOrbits.pause) __bgOrbits.pause();
  };
  var _glassEnd = function () {
    document.documentElement.classList.remove('glass-adjusting');
    if (window.__bgOrbits && __bgOrbits.resume) __bgOrbits.resume();
  };
  ['glass-alpha-slider', 'glass-blur-slider'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('pointerdown', _glassStart);
    el.addEventListener('pointerup', _glassEnd);
    el.addEventListener('pointercancel', _glassEnd);
    el.addEventListener('blur', _glassEnd);
    el.addEventListener('touchstart', _glassStart, { passive: true });
    el.addEventListener('touchend', _glassEnd);
  });
});

function _initAppLinks() {
  var row = document.getElementById('app-links-row');
  if (!row) return;
  var links = [
    { id: 'app-link-tg',     url: (typeof APP_TELEGRAM_URL === 'string' ? APP_TELEGRAM_URL : '') },
    { id: 'app-link-donate', url: (typeof APP_DONATE_URL   === 'string' ? APP_DONATE_URL   : '') },
    { id: 'app-link-boosty', url: (typeof APP_BOOSTY_URL   === 'string' ? APP_BOOSTY_URL   : '') },
  ];
  var anyShown = false;
  for (var i = 0; i < links.length; i++) {
    var el = document.getElementById(links[i].id);
    if (!el) continue;
    var url = (links[i].url || '').trim();
    if (url) {
      el.href = url;
      el.style.display = '';
      anyShown = true;
    } else {
      el.style.display = 'none';
    }
  }
  row.style.display = anyShown ? '' : 'none';
}
document.addEventListener('DOMContentLoaded', _initAppLinks);

// UI-5: модалка настроек оформления (тема/акцент/плотность/масштаб шрифта)
function openSettingsModal() {
  var ov = document.getElementById('settings-modal-overlay');
  var md = document.getElementById('settings-modal');
  if (!ov || !md) return;
  ov.classList.remove('hidden');
  md.classList.remove('hidden');
  // Синхронизируем UI элементов внутри модалки перед показом
  try { _syncFontScaleUi(); } catch (e) {}
  try { _syncGlassUi(); } catch (e) {}
  try { _syncDensityButtons(); } catch (e) {}
  try { if (typeof _syncThemeButtons === 'function') _syncThemeButtons(); } catch (e) {}
  try { if (typeof _syncAccentButtons === 'function') _syncAccentButtons(); } catch (e) {}
  setTimeout(function() {
    ov.classList.add('open');
    md.classList.add('open');
  }, 10);
}
function closeSettingsModal() {
  var ov = document.getElementById('settings-modal-overlay');
  var md = document.getElementById('settings-modal');
  if (!ov || !md) return;
  ov.classList.remove('open');
  md.classList.remove('open');
  setTimeout(function() {
    ov.classList.add('hidden');
    md.classList.add('hidden');
  }, 200);
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var md = document.getElementById('settings-modal');
    if (md && !md.classList.contains('hidden')) closeSettingsModal();
  }
});

// Реакция на смену системной темы при data-theme="auto"
if (window.matchMedia) {
  try {
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', function() {
      if (_getTheme() === 'auto') _applyTheme('auto');
    });
  } catch(e) {}
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
      enableShadows: true,
      shadowTransparency: 0.7,
      lightIntensity: 1
    });
    await box.init();
    _diceBoxInstance = box;
    // FIX: после init() canvas может остаться 300×150 если контейнер ещё
    // не имел размера. resizeWorld() регистрирует resize listener — сами
    // триггерим его, чтобы внутренний WebGL-буфер выровнялся под container.
    try { window.dispatchEvent(new Event('resize')); } catch (e) {}
    try { console.log('[DiceBox] init OK', { buf: (box.canvas ? box.canvas.width + 'x' + box.canvas.height : 'none'), css: (box.canvas ? box.canvas.clientWidth + 'x' + box.canvas.clientHeight : 'none'), theme: _getDiceTheme() }); } catch (e) {}
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
    try { console.log('[DiceBox] бросок прерван новым (sides=' + prev.sides + ')'); } catch (e) {}
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
        console.warn('[DiceBox] roll timeout 10s (n=' + _diceBoxConsecutiveTimeouts + '); canvas сохранён, кость доедет');
        // Чистим возможные «улетевшие» кости из физики, чтобы они не висели в фоне
        // и не мешали следующему броску. Сам инстанс/canvas НЕ трогаем.
        try { if (_diceBoxInstance && typeof _diceBoxInstance.clear === 'function') _diceBoxInstance.clear(); } catch (e) {}
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
      try { console.log('[DiceBox] roll resolved', { sides: sides, qty: qty, v1: v1, v2: v2, diag: diag }); } catch (e) {}
      _applyDiceCritGlow(sides, v1, v2);
      callback(v1, v2);
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

function rollCustomFormula() {
const input = $("dice-custom-input");
if (!input) return;
const formula = input.value.trim().toLowerCase().replace(/к/g,"d").replace(/\s/g,"");
if (!formula) return;
// Parse NdX+M or NdX-M or just NdX
const match = formula.match(/^(\d+)d(\d+)([+-]\d+)?$/);
if (!match) { 
  const display = $("dice-result-display");
  const resultInfo = $("dice-result-info");
  if (display) { display.classList.remove("crit-success","crit-fail","normal"); display.classList.add("normal"); }
  if (resultInfo) resultInfo.textContent = "Неверный формат (пример: 2к6+3)";
  return; 
}
const count = Math.min(parseInt(match[1], 10) || 1, 20);
const sides = Math.min(parseInt(match[2], 10) || 6, 100);
const bonus = parseInt(match[3] || "0", 10);
let rolls = [], total = 0;
for (let i = 0; i < count; i++) { const r = Math.floor(Math.random() * sides)+1; rolls.push(r); total += r; }
total += bonus;
total = Math.max(1, total);
const timestamp = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
const display = $("dice-result-display");
const resultBig = $("dice-result-big");
const resultInfo = $("dice-result-info");
if (!display||!resultBig||!resultInfo) return;
display.classList.remove("crit-success","crit-fail","normal"); void display.offsetWidth;
display.classList.add("normal");
resultBig.textContent = total;
const rollStr = rolls.join("+") + (bonus !== 0 ? (bonus>0?"+":"")+bonus : "");
resultInfo.textContent = formula.replace(/d/g,"к") + " = " + rollStr + (count>1||bonus!==0?" = "+total:"");
diceHistory.unshift({ sides: sides, result: total, mode: "custom", formula: formula.replace(/d/g,"к"), time: timestamp });
if (diceHistory.length > 10) diceHistory.pop();
renderDiceHistory();
try { _updateDiceHistoryBadge(); } catch (e) {}
// v3.19: пульс фона + обновить подпись «Кубик: <формула>»
try { if (window.DiceArenaBg) window.DiceArenaBg.pulse(); } catch (e) {}
try {
  var ri = document.getElementById('dice-result-info');
  if (ri) ri.textContent = 'Формула: ' + formula.replace(/d/g,"к");
} catch (e) {}
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
const label = record.mode === 'custom' ? (record.formula || "custom") : ("d" + record.sides + modeTag);
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

// ============================================
// АСИ — Улучшение характеристик
// ============================================
// openASIModal и closeASIModal определены ниже

// ============================================================
// BUGFIX-5: глобальный onerror-toast для uncaught ошибок
// Чтобы пользователь увидел сбой сразу, а не «приложение зависло».
// Лог в console.error остаётся для DevTools, toast — для UX.
// ============================================================
(function() {
  var _lastErrAt = 0;
  function _reportError(label, detail) {
    var now = Date.now();
    if (now - _lastErrAt < 1500) return; // throttle: не спамить toast при каскаде
    _lastErrAt = now;
    if (typeof showToast === 'function') {
      showToast("⚠️ Ошибка: " + (detail || label || 'неизвестно'), "error");
    }
  }
  window.addEventListener('error', function(e) {
    var msg = (e && e.message) ? String(e.message) : '';
    if (e && e.error) console.error('[uncaught]', e.error);
    else if (msg) console.error('[uncaught]', msg);
    _reportError('Uncaught', msg.slice(0, 80));
  });
  window.addEventListener('unhandledrejection', function(e) {
    var reason = e && e.reason;
    var msg = reason && reason.message ? reason.message : String(reason || '');
    console.error('[unhandled-rejection]', reason);
    _reportError('Promise rejection', msg.slice(0, 80));
  });
})();

// ============================================================
// Регистрация Service Worker + автообнаружение обновлений
// ============================================================
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', function() {
    checkWhatsNew();
    navigator.serviceWorker.register('./sw.js')
      .then(function(reg) {
        if (reg.waiting) {
          showUpdateModal(reg.waiting);
          updateVersionBlock(true, reg.waiting);
        } else {
          updateVersionBlock(false);
        }
        reg.addEventListener('updatefound', function() {
          var newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', function() {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateModal(newWorker);
              updateVersionBlock(true, newWorker);
            }
          });
        });
      })
      .catch(function(err) {
        console.error('[PWA] SW ошибка:', err);
        updateVersionBlock(false);
      });
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (!refreshing) { refreshing = true; window.location.reload(); }
    });
  });
} else {
  window.addEventListener('load', function() { updateVersionBlock(false); });
}

// ── Окно "Установить обновление" (до установки — без changelog) ──
function showUpdateModal(worker) {
  if ($('sw-update-modal')) return;
  var ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '?';
  try { localStorage.setItem('dnd_pre_update_version', ver); } catch(e) {}
  var modal = document.createElement('div');
  modal.id = 'sw-update-modal';
  modal.innerHTML =
    '<div class="sw-update-box">' +
      '<div class="sw-update-header">' +
        '<div class="sw-update-icon">🎲</div>' +
        '<div class="sw-update-title">Доступно обновление!</div>' +
        '<div class="sw-update-version">Текущая версия: v' + escapeHtml(ver) + '</div>' +
      '</div>' +
      '<div class="sw-update-safe">🔒 <b>Персонажи и данные сохранятся</b> — обновление меняет только код приложения, данные хранятся отдельно в браузере</div>' +
      '<div class="sw-update-btns"><button id="sw-update-later">Позже</button><button id="sw-update-now">⚡ Установить обновление</button></div>' +
    '</div>';
  document.body.appendChild(modal);
  requestAnimationFrame(function() { modal.classList.add('sw-update-visible'); });
  $('sw-update-now').addEventListener('click', function() {
    $('sw-update-now').textContent = '⏳ Обновляем...';
    $('sw-update-now').disabled = true;
    $('sw-update-later').disabled = true;
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
  $('sw-update-later').addEventListener('click', function() {
    modal.classList.remove('sw-update-visible');
    setTimeout(function() { if (modal.parentNode) modal.remove(); }, 300);
  });
}

// ── Проверка "Что нового" после перезагрузки ──
function checkWhatsNew() {
  try {
    var prevVer = localStorage.getItem('dnd_pre_update_version');
    if (!prevVer) return;
    var curVer = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : null;
    if (!curVer || prevVer === curVer) return;
    localStorage.removeItem('dnd_pre_update_version');
    showWhatsNewModal(prevVer, curVer);
  } catch(e) {}
}

// ── Окно "Что нового" (после установки — с changelog) ──
function showWhatsNewModal(prevVer, newVer) {
  if ($('sw-update-modal')) return;
  var latest = (typeof APP_CHANGELOG !== 'undefined' && APP_CHANGELOG.length > 0) ? APP_CHANGELOG[0] : null;
  var typeIcon  = { feat:'✨', fix:'🐛', improve:'⚡', data:'📦' };
  var typeColor = { feat:'#4da843', fix:'#e74c3c', improve:'#5b9bd5', data:'#d4a843' };
  var changesList = latest ? latest.changes.map(function(c) {
    return '<div class="sw-change-item"><span class="sw-change-icon" style="color:' + (typeColor[c.type] || '#9a9ab0') + '">' + (typeIcon[c.type] || '•') + '</span><span class="sw-change-text">' + escapeHtml(c.text) + '</span></div>';
  }).join('') : '<div class="sw-change-item">Улучшения и исправления</div>';
  var modal = document.createElement('div');
  modal.id = 'sw-update-modal';
  modal.innerHTML =
    '<div class="sw-update-box">' +
      '<div class="sw-update-header">' +
        '<div class="sw-update-icon">🎉</div>' +
        '<div class="sw-update-title">Обновлено!</div>' +
        '<div class="sw-update-version">v' + escapeHtml(prevVer) + ' → v' + escapeHtml(newVer) + (latest ? ' · ' + escapeHtml(latest.date) : '') + '</div>' +
      '</div>' +
      '<div class="sw-update-changes"><div class="sw-changes-title">📋 Что нового (' + (latest ? latest.changes.length : 0) + '):</div>' + changesList + '</div>' +
      '<div class="sw-update-safe">🔒 <b>Все данные сохранены</b> — ваши персонажи и заклинания на месте</div>' +
      '<div class="sw-update-btns"><button id="sw-update-now" style="flex:1">👍 Отлично!</button></div>' +
    '</div>';
  document.body.appendChild(modal);
  requestAnimationFrame(function() { modal.classList.add('sw-update-visible'); });
  $('sw-update-now').addEventListener('click', function() {
    modal.classList.remove('sw-update-visible');
    setTimeout(function() { if (modal.parentNode) modal.remove(); }, 300);
  });
}


// ============================================================
// АККОРДЕОН — сворачиваемые секции
// ============================================================
function toggleAccordion(btn) {
  var body = btn.nextElementSibling;
  if (!body) return;
  var isOpen = btn.getAttribute("aria-expanded") === "true";
  // UI5-6: шеврон ▸ поворачивается через CSS от [aria-expanded] (см. .accordion-arrow в style.css),
  // JS больше не свопает символ — только переключает aria-expanded.
  if (isOpen) {
    body.style.display = "none";
    btn.setAttribute("aria-expanded", "false");
  } else {
    body.style.display = "";
    btn.setAttribute("aria-expanded", "true");
    // FB-2: line-clamp-детект состояний требует видимой секции (scrollHeight) —
    // повторяем при раскрытии любого аккордеона (дёшево, no-op если состояний нет).
    if (typeof detectConditionOverflow === "function") setTimeout(detectConditionOverflow, 50);
  }
}

// ============================================================
// КЛАССОВЫЕ РЕСУРСЫ — трекер + АСИ
// ============================================================

// Инициализация resources в персонаже если отсутствуют
function initCharResources(char) {
  if (!char.resources) char.resources = {};
}

// Вычислить максимум ресурса по уровню и характеристикам
function getResourceMax(res, char) {
  var level = char.level || 1;
  var raw = res.maxByLevel ? (res.maxByLevel[level] !== undefined ? res.maxByLevel[level] : 0) : 0;
  if (raw === "level")       return level;
  if (raw === "cha")         return Math.max(1, getMod(char.stats.cha));
  if (raw === "cha_plus1")   return Math.max(1, getMod(char.stats.cha) + 1);
  if (raw === "level5")      return level * 5;  // Наложение рук — пул ХП
  if (raw === 99)            return 99; // Безлимит (Ярость 20 ур.)
  return parseInt(raw, 10) || 0;
}

// Рендер блока ресурсов
function renderClassResources() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);

  var section = $("class-resources-section");
  var grid = $("class-resources-grid");
  if (!section || !grid) return;

  var cls = char.class || "";
  var data = (typeof CLASS_RESOURCES !== "undefined") && CLASS_RESOURCES[cls];

  if (!data || !data.resources || data.resources.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  grid.innerHTML = "";

  // Passive notes card
  if (data.passive && data.passive.notes) {
    var notesEl = document.createElement("div");
    notesEl.className = "resource-passive-card";
    notesEl.innerHTML = '<div class="resource-passive-title">📖 Пассивные умения ' + escapeHtml(cls) + '</div>' +
      '<pre class="resource-passive-text">' + escapeHtml(data.passive.notes) + '</pre>';
    grid.appendChild(notesEl);
  }

  // Resource cards
  data.resources.forEach(function(res) {
    var max = getResourceMax(res, char);
    if (max === 0) return; // не доступно на этом уровне

    var used = char.resources[res.id] || 0;
    if (used > max) { used = max; char.resources[res.id] = used; }
    var remaining = max - used;

    var card = document.createElement("div");
    card.className = "resource-card";
    card.style.setProperty("--res-color", res.color || "#c9a227");

    var isPool = res.isPool; // Наложение рук — пул ХП а не заряды

    // Build pips (max 20, beyond that just show number)
    var pipsHtml = "";
    if (!isPool && max <= 20) {
      pipsHtml = '<div class="resource-pips">';
      for (var p = 0; p < max; p++) {
        pipsHtml += '<div class="resource-pip' + (p < remaining ? ' full' : '') + '" onclick="toggleResourcePip(\'' + res.id + '\',' + p + ')"></div>';
      }
      pipsHtml += '</div>';
    }

    var restLabel = res.restoreOn === "short" ? "☕ Кор." : res.restoreOn === "long" || res.restoreOn === "long_once" ? "🛏️ Длин." : res.restoreOn === "turn" ? "🔄 Каждый ход" : "–";

    card.innerHTML =
      '<div class="resource-header">' +
        '<span class="resource-icon">' + res.icon + '</span>' +
        '<span class="resource-name">' + escapeHtml(res.name) + '</span>' +
        '<span class="resource-restore-badge">' + restLabel + '</span>' +
      '</div>' +
      (isPool
        ? '<div class="resource-pool-row">' +
            '<div class="resource-pool-val" id="res-pool-' + res.id + '">' + (max - used) + ' / ' + max + '</div>' +
            '<div class="resource-pool-btns">' +
              '<button class="res-btn" onclick="spendResource(\'' + res.id + '\',1)">−1</button>' +
              '<button class="res-btn" onclick="spendResource(\'' + res.id + '\',-1)">+1</button>' +
            '</div>' +
          '</div>'
        : '<div class="resource-counter-row">' +
            '<button class="res-btn res-btn-use" onclick="spendResource(\'' + res.id + '\',1)" ' + (remaining <= 0 ? 'disabled' : '') + '>Использовать</button>' +
            '<span class="resource-count" id="res-count-' + res.id + '">' + remaining + ' / ' + (max === 99 ? '∞' : max) + '</span>' +
            '<button class="res-btn res-btn-reset" onclick="resetResource(\'' + res.id + '\')">Сброс</button>' +
          '</div>'
      ) +
      pipsHtml +
      '<div class="resource-desc">' + escapeHtml(res.desc) + '</div>';

    grid.appendChild(card);
  });
}

function spendResource(id, delta) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  var cls = char.class || "";
  var data = CLASS_RESOURCES && CLASS_RESOURCES[cls];
  if (!data) return;
  var res = data.resources.find(function(r) { return r.id === id; });
  if (!res) return;
  var max = getResourceMax(res, char);
  var used = char.resources[id] || 0;
  used = Math.min(max, Math.max(0, used + delta));
  char.resources[id] = used;
  if (navigator.vibrate) navigator.vibrate(8);
  saveToLocal();
  renderClassResources();
}

function resetResource(id) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  char.resources[id] = 0;
  saveToLocal();
  renderClassResources();
}

function toggleResourcePip(id, pipIdx) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  var cls = char.class || "";
  var data = CLASS_RESOURCES && CLASS_RESOURCES[cls];
  if (!data) return;
  var res = data.resources.find(function(r) { return r.id === id; });
  if (!res) return;
  var max = getResourceMax(res, char);
  var used = char.resources[id] || 0;
  var remaining = max - used;
  // pip 0..remaining-1 = full, click to use; remaining..max-1 = empty, click to restore
  if (pipIdx < remaining) {
    used = Math.min(max, used + (remaining - pipIdx));
  } else {
    used = Math.max(0, pipIdx);
  }
  char.resources[id] = used;
  if (navigator.vibrate) navigator.vibrate(8);
  saveToLocal();
  renderClassResources();
}

// Сбросить ресурсы по типу отдыха
function resetResourcesByRest(restType) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  var cls = char.class || "";
  var data = CLASS_RESOURCES && CLASS_RESOURCES[cls];
  if (!data || !data.resources) return;
  data.resources.forEach(function(res) {
    if (restType === "long") {
      char.resources[res.id] = 0;
    } else if (restType === "short" && (res.restoreOn === "short")) {
      char.resources[res.id] = 0;
    }
  });
  saveToLocal();
  renderClassResources();
}

// ============================================================
// АСИ — модалка выбора характеристик
// ============================================================
var asiSelectedStats = [];
var asiPendingPoints = 0; // сколько осталось распределить

var asiCurrentLevel = null; // уровень для которого применяется АСИ

function openASIModalForLevel(level) {
  asiCurrentLevel = level;
  openASIModal();
}

function openASIModal() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  asiSelectedStats = [];
  asiFeatSelected = null;
  var modal = $("asi-modal");
  if (!modal) { showToast("Ошибка: АСИ модалка не найдена", "error"); return; }

  // Reset radio to plus2
  var r = modal.querySelector('input[value="plus2"]');
  if (r) r.checked = true;

  // Show level info in title if level is set
  var title = modal.querySelector("h4");
  if (title) {
    title.textContent = asiCurrentLevel
      ? "📈 Увеличение характеристик · " + asiCurrentLevel + " ур."
      : "📈 Увеличение характеристик";
  }

  // BUILD-LVL-3: подсказка билда для этого ASI-уровня (использует levelUp[level] — без новых данных).
  var asiHint = $("asi-build-hint");
  if (asiHint) {
    var rec = (typeof getBuildLevelRec === "function") ? getBuildLevelRec(char, asiCurrentLevel) : null;
    if (rec && rec.headline) {
      asiHint.innerHTML = '<span class="rec-badge">💡 Совет билда</span> <span class="rec-text">' + escapeHtml(rec.headline) + '</span>' +
        (rec.why ? ' <span class="rec-why">— ' + escapeHtml(rec.why) + '</span>' : '');
      asiHint.style.display = "";
    } else {
      asiHint.style.display = "none";
      asiHint.innerHTML = "";
    }
  }

  buildASIStatGrid(char);
  updateASIPreview();
  modal.classList.add("active");
}

function closeASIModal() {
  var modal = $("asi-modal");
  if (modal) modal.classList.remove("active");
  asiSelectedStats = [];
  asiFeatSelected = null;
  asiCurrentLevel = null;
  // BUILD-LVL-4: обновить чек-лист guided level-up, если он открыт
  if (typeof luRefreshChoices === "function") luRefreshChoices();
}

function buildASIStatGrid(char) {
  var grid = $("asi-stat-grid");
  if (!grid) return;
  var statNames = {str:"Сила",dex:"Ловкость",con:"Телосложение",int:"Интеллект",wis:"Мудрость",cha:"Харизма"};
  var statIcons = {str:"💪",dex:"🏃",con:"❤️",int:"🧠",wis:"👁️",cha:"🎭"};
  // BUILD-LVL-6: статы, рекомендованные билдом на этом ASI-уровне (подсветка как у черт).
  var recAsi = (typeof getBuildRecAsi === "function" && char) ? getBuildRecAsi(char, asiCurrentLevel) : null;
  grid.innerHTML = Object.keys(statNames).map(function(k) {
    var val = char.stats[k] || 10;
    var mod = getMod(val);
    var isRec = !!(recAsi && recAsi[k]);
    return '<div class="asi-stat-item' + (isRec ? " is-rec" : "") + '" id="asi-stat-' + k + '" onclick="toggleASIStat(\'' + k + '\')">' +
      (isRec ? '<span class="asi-stat-rec" title="Совет билда: +' + recAsi[k] + '">💡</span>' : '') +
      '<span class="asi-stat-icon">' + (getAbilityIcon(k) || statIcons[k]) + '</span>' +
      '<span class="asi-stat-name">' + statNames[k] + '</span>' +
      '<span class="asi-stat-cur">' + val + ' (' + formatMod(mod) + ')</span>' +
      '<span class="asi-stat-delta" id="asi-delta-' + k + '"></span>' +
    '</div>';
  }).join("");
}

function getASIMode() {
  var r = document.querySelector('input[name="asi-mode"]:checked');
  return r ? r.value : "plus2";
}

function toggleASIStat(statKey) {
  var mode = getASIMode();
  var maxPicks = mode === "plus2" ? 1 : 2;

  var idx = asiSelectedStats.indexOf(statKey);
  if (idx > -1) {
    asiSelectedStats.splice(idx, 1);
  } else {
    if (asiSelectedStats.length >= maxPicks) {
      asiSelectedStats.shift(); // remove oldest
    }
    asiSelectedStats.push(statKey);
  }
  updateASIPreview();
}

function updateASIPreview() {
  var mode = getASIMode();
  var preview = $("asi-preview");
  var applyBtn = $("asi-apply-btn");
  var statGrid = $("asi-stat-grid");
  var featListEl = $("asi-feat-list");

  // ── Режим: выбор черты ───────────────────────────────────
  if (mode === "feat") {
    if (statGrid) statGrid.style.display = "none";
    if (featListEl) { featListEl.style.display = "block"; buildFeatList(); }
    if (preview) {
      if (asiFeatSelected) {
        var feat = typeof FEATS_DATA !== "undefined" && FEATS_DATA.find(function(f) { return f.id === asiFeatSelected; });
        preview.textContent = "✅ Черта: " + (feat ? feat.name : asiFeatSelected);
        preview.className = "asi-preview ready";
      } else {
        preview.textContent = "Выберите черту из списка";
        preview.className = "asi-preview";
      }
    }
    if (applyBtn) applyBtn.disabled = !asiFeatSelected;
    return;
  }

  // ── Режим: характеристики ────────────────────────────────
  if (statGrid) statGrid.style.display = "";
  if (featListEl) featListEl.style.display = "none";
  asiFeatSelected = null;

  var maxPicks = mode === "plus2" ? 1 : 2;
  var bonus = mode === "plus2" ? 2 : 1;

  if (statGrid) {
    statGrid.querySelectorAll(".asi-stat-item").forEach(function(el) {
      el.classList.remove("selected");
      var deltaEl = $("asi-delta-" + el.id.replace("asi-stat-",""));
      if (deltaEl) deltaEl.textContent = "";
    });
    asiSelectedStats.forEach(function(k) {
      var el = $("asi-stat-" + k);
      if (el) el.classList.add("selected");
      var deltaEl = $("asi-delta-" + k);
      if (deltaEl) deltaEl.textContent = "+" + bonus;
    });
  }

  if (preview) {
    if (asiSelectedStats.length === 0) {
      preview.textContent = "Выберите характеристику";
      preview.className = "asi-preview";
    } else if (asiSelectedStats.length < maxPicks && mode === "plus1each") {
      preview.textContent = "Выберите ещё одну характеристику";
      preview.className = "asi-preview";
    } else {
      var char = getCurrentChar();
      var abbr = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
      preview.textContent = "✅ " + asiSelectedStats.map(function(k) {
        return abbr[k] + ": " + char.stats[k] + " → " + (char.stats[k] + bonus);
      }).join("   ");
      preview.className = "asi-preview ready";
    }
  }

  var ready = (mode === "plus2" && asiSelectedStats.length === 1) ||
              (mode === "plus1each" && asiSelectedStats.length === 2);
  if (applyBtn) applyBtn.disabled = !ready;
}

// applyASI определена ниже (обрабатывает и стат-режим и черты)

// showHPToast already supports customMsg (patched in place above)

// ============================================================
// ВЕРСИЯ ПРИЛОЖЕНИЯ
// ============================================================
(function() {
  var el = $("app-version-badge");
  if (el && typeof APP_VERSION !== "undefined") {
    el.textContent = "v" + APP_VERSION + " (" + APP_VERSION_DATE + ")";
  }
})();

// ============================================================
// ЖУРНАЛ ПЕРСОНАЖА — история изменений
// ============================================================

function getJournal(char) {
  if (!char.journal) char.journal = [];
  return char.journal;
}

function addJournalEntry(type, text, details) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var journal = getJournal(char);
  var now = new Date();
  var dateStr = now.toLocaleDateString("ru-RU", { day:"numeric", month:"short", year:"numeric" });
  var timeStr = now.toLocaleTimeString("ru-RU", { hour:"2-digit", minute:"2-digit" });
  journal.unshift({
    id: Date.now(),
    type: type,        // levelup | rest | stat | feat | note | combat | story | loot | death
    text: text,
    details: details || "",
    date: dateStr,
    time: timeStr,
    level: char.level || 1
  });
  if (journal.length > 200) journal.pop();
  saveToLocal();
}

var journalFilter = "all";
function filterJournal(type, btn) {
  journalFilter = type;
  document.querySelectorAll(".jfilter-btn").forEach(function(b) { b.classList.remove("active"); });
  if (btn) btn.classList.add("active");
  renderJournal();
}

function renderJournal() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var list = $("journal-list");
  if (!list) return;
  var journal = getJournal(char);
  var filtered = journalFilter === "all" ? journal : journal.filter(function(e) { return e.type === journalFilter; });

  if (filtered.length === 0) {
    list.innerHTML = '<div class="journal-empty">📭 Нет записей' + (journalFilter !== "all" ? " в этой категории" : "") + '</div>';
    return;
  }

  var typeIcons = { levelup:"📈", rest:"🛏️", stat:"⚡", feat:"🎯", note:"📝", combat:"⚔️", story:"📖", loot:"💎", death:"💀" };
  var typeColors = { levelup:"#4da843", rest:"#5b9bd5", stat:"#d4a843", feat:"#9b59b6", note:"#9a9ab0", combat:"#e74c3c", story:"#d4ac0d", loot:"#f39c12", death:"#7f8c8d" };

  list.innerHTML = filtered.map(function(entry) {
    var icon = typeIcons[entry.type] || "📝";
    var color = typeColors[entry.type] || "#9a9ab0";
    return '<div class="journal-entry" style="border-left-color:' + color + '">' +
      '<div class="journal-entry-header">' +
        '<span class="journal-icon">' + icon + '</span>' +
        '<span class="journal-text">' + escapeHtml(entry.text) + '</span>' +
        '<button class="journal-del-btn" onclick="deleteJournalEntry(' + entry.id + ')">✕</button>' +
      '</div>' +
      (entry.details ? '<div class="journal-details">' + escapeHtml(entry.details) + '</div>' : '') +
      '<div class="journal-meta">' + escapeHtml(entry.date) + ' ' + escapeHtml(entry.time) + ' · ' + (entry.level || 1) + ' ур.</div>' +
    '</div>';
  }).join("");
}

function deleteJournalEntry(id) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !char.journal) return;
  char.journal = char.journal.filter(function(e) { return e.id !== id; });
  saveToLocal();
  renderJournal();
}

function openAddJournalEntry() {
  $("add-journal-modal")?.classList.add("active");
  $("journal-entry-text").value = "";
}
function closeAddJournalEntry() {
  $("add-journal-modal")?.classList.remove("active");
}
function saveJournalEntry() {
  var type = $("journal-entry-type")?.value || "note";
  var text = $("journal-entry-text")?.value.trim() || "";
  if (!text) { showToast("Введите описание события", "warn"); return; }
  var typeNames = { note:"Заметка", combat:"Бой", story:"Сюжет", loot:"Добыча", death:"Смерть" };
  addJournalEntry(type, typeNames[type] + ": " + text);
  closeAddJournalEntry();
  renderJournal();
}

// ============================================================
// ПРИХВОСТНИ / КОМПАНЬОНЫ
// ============================================================
var COMPANION_TYPE_ICONS = {
  familiar:"🦅", mount:"🐴", summoned:"✨", beast:"🐺", construct:"🤖", other:"🐾"
};
var COMPANION_TYPE_NAMES = {
  familiar:"Фамильяр", mount:"Скакун", summoned:"Призванный", beast:"Зверь", construct:"Конструкт", other:"Прочее"
};

function getCompanions(char) {
  if (!char.companions) char.companions = [];
  return char.companions;
}

function renderCompanions() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var companions = getCompanions(char);

  // Update counts
  var countEl = $("companions-count");
  if (countEl) countEl.textContent = companions.length > 0 ? companions.length : "";

  // Render in both sheet and world tab
  ["companions-list-sheet", "companions-list-world"].forEach(function(elId) {
    var list = $(elId);
    if (!list) return;
    if (companions.length === 0) {
      list.innerHTML = '<div class="party-empty">📭 Нет прихвостней</div>';
      return;
    }
    list.innerHTML = companions.map(function(c, i) {
      var icon = COMPANION_TYPE_ICONS[c.type] || "🐾";
      var hpPct = c.hpMax > 0 ? Math.round((c.hpCurrent / c.hpMax) * 100) : 100;
      var hpColor = hpPct > 60 ? "#4da843" : hpPct > 30 ? "#e67e22" : "#e74c3c";
      return '<div class="pcard pcard-companion">' +
        '<div class="pcard-icon" style="background:rgba(155,89,182,0.15);color:#9b59b6">' + icon + '</div>' +
        '<div class="pcard-body">' +
          '<div class="pcard-name">' + escapeHtml(c.name) + '</div>' +
          '<div class="pcard-sub">' + escapeHtml(COMPANION_TYPE_NAMES[c.type] || c.type) + ' · КД ' + (c.ac || 10) + '</div>' +
          (c.attack ? '<div class="pcard-desc">⚔️ ' + escapeHtml(c.attack) + '</div>' : '') +
          '<div class="companion-hp-row">' +
            '<span style="color:' + hpColor + ';font-size:0.8em;font-weight:700;">❤️ ' + c.hpCurrent + '/' + c.hpMax + '</span>' +
            '<button class="res-btn" style="padding:2px 8px;font-size:0.72em" onclick="companionHP(' + i + ',-1)">-1</button>' +
            '<button class="res-btn" style="padding:2px 8px;font-size:0.72em" onclick="companionHP(' + i + ',1)">+1</button>' +
          '</div>' +
        '</div>' +
        '<div class="pcard-actions">' +
          '<button class="pcard-edit-btn" onclick="openEditCompanionModal(' + i + ')">✏️</button>' +
          '<button class="pcard-del-btn" onclick="deleteCompanion(' + i + ')">✕</button>' +
        '</div>' +
      '</div>';
    }).join("");
  });
}

function companionHP(i, delta) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var companions = getCompanions(char);
  if (!companions[i]) return;
  companions[i].hpCurrent = Math.max(0, Math.min(companions[i].hpMax, (companions[i].hpCurrent || 0) + delta));
  if (navigator.vibrate) navigator.vibrate(8);
  saveToLocal();
  renderCompanions();
}

// Однократно наполняет <select> формами фамильяра из таблицы FAMILIAR_FORMS
function buildFamiliarFormOptions() {
  var sel = $("companion-familiar-form-sel");
  if (!sel || sel.dataset.built === "1" || typeof FAMILIAR_FORMS === "undefined") return;
  var html = '<option value="">— своя форма —</option>';
  FAMILIAR_FORMS.forEach(function(f) {
    html += '<option value="' + f.id + '">' + (f.icon ? f.icon + ' ' : '') + escapeHtml(f.name) + '</option>';
  });
  sel.innerHTML = html;
  sel.dataset.built = "1";
}

// Показывает пикер формы только для типа «Фамильяр»
function onCompanionTypeChange() {
  var row = $("companion-familiar-row");
  if (!row) return;
  var isFamiliar = ($("companion-type-sel")?.value === "familiar");
  row.style.display = isFamiliar ? "" : "none";
}

// Автозаполнение статов из выбранной формы фамильяра
function applyFamiliarForm() {
  var sel = $("companion-familiar-form-sel");
  if (!sel || !sel.value || typeof familiarFormById === "undefined") return;
  var f = familiarFormById(sel.value);
  if (!f) return;
  $("companion-name-inp").value = f.name;
  $("companion-hp-inp").value = f.hp;
  $("companion-ac-inp").value = f.ac;
  $("companion-attack-inp").value = f.attack === "—" ? "" : f.attack;
  $("companion-desc-inp").value = f.desc;
}

function openAddCompanionModal(presetType) {
  buildFamiliarFormOptions();
  $("companion-modal-title").textContent = "🐾 Добавить прихвостня";
  $("companion-edit-index").value = "-1";
  $("companion-name-inp").value = "";
  $("companion-type-sel").value = presetType || "familiar";
  $("companion-hp-inp").value = "10";
  $("companion-ac-inp").value = "10";
  $("companion-attack-inp").value = "";
  $("companion-desc-inp").value = "";
  var fs = $("companion-familiar-form-sel"); if (fs) fs.value = "";
  onCompanionTypeChange();
  $("add-companion-modal")?.classList.add("active");
}

// Призыв фамильяра из карточки заклинания «Поиск фамильяра»
function summonFamiliar() {
  if (!currentId) { showToast("Сначала выберите персонажа", "warn"); return; }
  openAddCompanionModal("familiar");
  $("companion-modal-title").textContent = "🐾 Призвать фамильяра";
}
function openEditCompanionModal(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var c = getCompanions(char)[i];
  if (!c) return;
  buildFamiliarFormOptions();
  $("companion-modal-title").textContent = "✏️ Редактировать прихвостня";
  $("companion-edit-index").value = i;
  $("companion-name-inp").value = c.name || "";
  $("companion-type-sel").value = c.type || "other";
  $("companion-hp-inp").value = c.hpMax || 10;
  $("companion-ac-inp").value = c.ac || 10;
  $("companion-attack-inp").value = c.attack || "";
  $("companion-desc-inp").value = c.desc || "";
  var fs = $("companion-familiar-form-sel"); if (fs) fs.value = "";
  onCompanionTypeChange();
  $("add-companion-modal")?.classList.add("active");
}
function closeAddCompanionModal() {
  $("add-companion-modal")?.classList.remove("active");
}
function saveCompanion() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var name = $("companion-name-inp")?.value.trim() || "";
  if (!name) { showToast("Введите имя", "warn"); return; }
  var idx = parseInt($("companion-edit-index").value, 10);
  var companions = getCompanions(char);
  var hpMax = parseInt($("companion-hp-inp")?.value, 10) || 10;
  var data = {
    id: idx >= 0 ? (companions[idx].id || Date.now()) : Date.now(),
    name: name,
    type: $("companion-type-sel")?.value || "other",
    hpMax: hpMax,
    hpCurrent: idx >= 0 ? companions[idx].hpCurrent : hpMax,
    ac: parseInt($("companion-ac-inp")?.value, 10) || 10,
    attack: $("companion-attack-inp")?.value.trim() || "",
    desc: $("companion-desc-inp")?.value.trim() || "",
    status: "healthy"
  };
  if (idx >= 0) companions[idx] = data; else companions.push(data);
  saveToLocal();
  renderCompanions();
  closeAddCompanionModal();
}
function deleteCompanion(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var name = char.companions[i] ? char.companions[i].name : "прихвостня";
  showConfirmModal("Удалить прихвостня?", "«" + name + "» будет удалён.", function() {
    char.companions.splice(i, 1);
    saveToLocal();
    renderCompanions();
  });
}

// asiFeatSelected и feat-режим обрабатываются в updateASIPreview ниже
var asiFeatSelected = null;

function buildFeatList() {
  var el = $("asi-feat-list");
  if (!el || typeof FEATS_DATA === "undefined") return;
  if (!currentId) return;
  var char = getCurrentChar();
  var takenFeats = char ? (char.feats || []) : [];
  // BUILD-LVL-3: id черты, рекомендованной билдом для текущего ASI-уровня.
  var recFeatId = (typeof getBuildRecFeat === "function" && char) ? getBuildRecFeat(char, asiCurrentLevel) : null;

  el.innerHTML = '<div class="feat-search-wrap"><input type="text" class="feat-search-inp" placeholder="🔍 Поиск черты..." oninput="filterFeatList(this.value)"></div>' +
    '<div class="feat-list" id="feat-list-items">' +
    FEATS_DATA.map(function(feat) {
      var taken = takenFeats.some(function(f) { return f.id === feat.id; });
      var selected = asiFeatSelected === feat.id;
      var isRec = recFeatId && feat.id === recFeatId;
      return '<div class="feat-item' + (selected ? " selected" : "") + (taken ? " taken" : "") + (isRec ? " is-rec" : "") + '" onclick="selectFeat(\'' + feat.id + '\')" data-name="' + escapeHtml(feat.name.toLowerCase()) + '">' +
        '<div class="feat-item-header">' +
          '<span class="feat-item-name">' + escapeHtml(feat.name) + '</span>' +
          (isRec ? '<span class="rec-badge">💡 совет билда</span>' : '') +
          (feat.prereq ? '<span class="feat-prereq">' + escapeHtml(feat.prereq) + '</span>' : '') +
          (taken ? '<span class="feat-taken-badge">Уже взята</span>' : '') +
        '</div>' +
        '<div class="feat-item-desc">' + escapeHtml(feat.desc) + '</div>' +
      '</div>';
    }).join("") +
    '</div>';
}

function filterFeatList(query) {
  var q = query.toLowerCase();
  document.querySelectorAll("#feat-list-items .feat-item").forEach(function(el) {
    var name = el.dataset.name || "";
    el.style.display = name.includes(q) ? "" : "none";
  });
}

function selectFeat(id) {
  asiFeatSelected = asiFeatSelected === id ? null : id;
  buildFeatList();
  var preview = $("asi-preview");
  var applyBtn = $("asi-apply-btn");
  if (asiFeatSelected) {
    var feat = FEATS_DATA.find(function(f) { return f.id === asiFeatSelected; });
    if (!feat) return;
    if (preview) { preview.textContent = "✅ Черта: " + feat.name; preview.className = "asi-preview ready"; }
    if (applyBtn) applyBtn.disabled = false;
  } else {
    if (preview) { preview.textContent = "Выберите черту"; preview.className = "asi-preview"; }
    if (applyBtn) applyBtn.disabled = true;
  }
}

function applyASI() {
  var mode = getASIMode();
  if (mode !== "feat") {
    // stat mode
    if (!currentId || asiSelectedStats.length === 0) return;
    var char = getCurrentChar();
    if (!char) return;
    var bonus = mode === "plus2" ? 2 : 1;
    var statNames2 = {str:"Сила",dex:"Ловкость",con:"Телосложение",int:"Интеллект",wis:"Мудрость",cha:"Харизма"};
    asiSelectedStats.forEach(function(k) {
      char.stats[k] = Math.min(20, (char.stats[k] || 10) + bonus);
      safeSet("val-" + k, char.stats[k]);
      updateStatDisplay(k);
    });
    var msg = "📈 АСИ (ур." + (asiCurrentLevel||"?") + "): " + asiSelectedStats.map(function(k) { return statNames2[k] + " +" + bonus; }).join(", ");
    // Mark ASI level as used
    if (asiCurrentLevel) {
      if (!char.asiUsedLevels) char.asiUsedLevels = [];
      if (!char.asiUsedLevels.includes(asiCurrentLevel)) char.asiUsedLevels.push(asiCurrentLevel);
    }
    asiCurrentLevel = null;
    addJournalEntry("stat", msg);
    saveToLocal(); calcStats(); recalculateHP(); calculateAC();
    closeASIModal();
    updateClassFeatures();
    showHPToast(0, msg);
    renderJournal();
    return;
  }

  if (!asiFeatSelected || !currentId) return;
  var char = getCurrentChar();
  if (!char) return;

  var feat = FEATS_DATA.find(function(f) { return f.id === asiFeatSelected; });
  if (!feat) return;

  if (!char.feats) char.feats = [];

  // Apply effects
  var statNames = {str:"Сила",dex:"Ловкость",con:"Телосложение",int:"Интеллект",wis:"Мудрость",cha:"Харизма"};
  var appliedDesc = [];

  (feat.effects || []).forEach(function(eff) {
    if (eff.type === "stat") {
      char.stats[eff.key] = Math.min(20, (char.stats[eff.key] || 10) + eff.value);
      safeSet("val-" + eff.key, char.stats[eff.key]);
      updateStatDisplay(eff.key);
      appliedDesc.push("+" + eff.value + " " + statNames[eff.key]);
    }
    else if (eff.type === "stat_choice" || eff.type === "stat_choice_save") {
      // Pick first available stat that isn't at 20
      var picked = eff.keys.find(function(k) { return (char.stats[k] || 10) < 20; });
      if (picked) {
        char.stats[picked] = Math.min(20, (char.stats[picked] || 10) + eff.value);
        safeSet("val-" + picked, char.stats[picked]);
        updateStatDisplay(picked);
        appliedDesc.push("+" + eff.value + " " + statNames[picked]);
        if (eff.type === "stat_choice_save") {
          if (!char.saves) char.saves = {};
          char.saves[picked] = true;
          safeSetChecked("save-prof-" + picked, true);
        }
      }
    }
    else if (eff.type === "armor") {
      if (!char.proficiencies.armor) char.proficiencies.armor = [];
      if (!char.proficiencies.armor.includes(eff.value)) {
        char.proficiencies.armor.push(eff.value);
        safeSetChecked("armor-" + eff.value, true);
        appliedDesc.push("Владение: " + eff.value);
      }
    }
    else if (eff.type === "hp_per_level") {
      // Крепкий — +2 ХП за уровень ретроактивно
      var bonus = eff.value * (char.level || 1);
      char.combat.hpMax = (char.combat.hpMax || 10) + bonus;
      char.combat.hpCurrent = Math.min(char.combat.hpCurrent + bonus, char.combat.hpMax);
      appliedDesc.push("+" + bonus + " ХП (×" + (char.level||1) + " ур.)");
    }
    else if (eff.type === "initiative_bonus") {
      if (!char.bonuses) char.bonuses = {};
      char.bonuses.initiative = (char.bonuses.initiative || 0) + eff.value;
      appliedDesc.push("+" + eff.value + " к Инициативе");
    }
  });

  // Record feat — расовая черта помечается отдельно
  var isRaceFeat = (asiCurrentLevel === "race");
  var featRecord = { id: feat.id, name: feat.name, level: char.level };
  if (isRaceFeat) {
    featRecord.racial = true;
    featRecord.level = "раса";
    if (!Array.isArray(char.raceFeats)) char.raceFeats = [];
    char.raceFeats.push({ id: feat.id, name: feat.name });
  }
  char.feats.push(featRecord);

  saveToLocal();
  calcStats();
  recalculateHP();
  calculateAC();
  updateHPDisplay();

  // Journal entry
  addJournalEntry("feat", "Черта: " + feat.name, appliedDesc.length > 0 ? "Применено: " + appliedDesc.join(", ") : feat.desc.slice(0, 80));

  // Расовые черты НЕ занимают слот ASI
  if (asiCurrentLevel && !isRaceFeat) {
    if (!char.asiUsedLevels) char.asiUsedLevels = [];
    if (!char.asiUsedLevels.includes(asiCurrentLevel)) char.asiUsedLevels.push(asiCurrentLevel);
  }
  asiCurrentLevel = null;
  closeASIModal();
  asiFeatSelected = null;
  showHPToast(0, "🎯 Черта «" + feat.name + "» получена!" + (appliedDesc.length ? " " + appliedDesc.join(", ") : ""));
  renderJournal();
  renderTakenFeats();
  if (typeof renderRaceExtras === "function") renderRaceExtras();
  updateClassFeatures();
}


// ============================================================
// ЭКРАН ПРОФИЛЕЙ — вкладки и чейнджлог
// ============================================================
function switchProfilesTab(tab, btn) {
  document.querySelectorAll(".ptab-btn").forEach(function(b) { b.classList.remove("active"); });
  document.querySelectorAll(".ptab-content").forEach(function(c) { c.style.display = "none"; });
  if (btn) btn.classList.add("active");
  var el = $("ptab-" + tab);
  if (el) el.style.display = "";
  if (tab === "changelog") renderChangelog();
}

function renderChangelog() {
  var list = $("changelog-list");
  if (!list || typeof APP_CHANGELOG === "undefined") return;

  var typeIcon  = { feat:"✨", fix:"🐛", improve:"⚡" };
  var typeLabel = { feat:"Новое", fix:"Исправлено", improve:"Улучшено" };
  var typeColor = { feat:"#4da843", fix:"#e74c3c", improve:"#5b9bd5" };
  var badgeHtml = { new:'<span class="cl-badge cl-badge-new">НОВОЕ</span>' };

  list.innerHTML = APP_CHANGELOG.map(function(ver, idx) {
    var items = ver.changes.map(function(c) {
      var icon  = typeIcon[c.type]  || "•";
      var color = typeColor[c.type] || "#9a9ab0";
      return '<div class="cl-item"><span class="cl-item-icon" style="color:' + color + '">' + icon + '</span><span class="cl-item-text">' + escapeHtml(c.text) + '</span></div>';
    }).join("");

    var isLatest = idx === 0;
    return '<div class="cl-version' + (isLatest ? " cl-version-latest" : "") + '">' +
      '<div class="cl-version-header">' +
        '<span class="cl-version-num">v' + escapeHtml(ver.version) + '</span>' +
        (isLatest ? '<span class="cl-badge cl-badge-new">Текущая</span>' : '') +
        '<span class="cl-version-date">' + escapeHtml(ver.date) + '</span>' +
      '</div>' +
      '<div class="cl-items">' + items + '</div>' +
    '</div>';
  }).join("");
}

// Рендерим при старте
(function() {
  var versionBadge = $("app-version-badge");
  if (versionBadge && typeof APP_VERSION !== "undefined") {
    versionBadge.textContent = "v" + APP_VERSION;
  }
  renderChangelog();
})();

// ============================================================
// ОТОБРАЖЕНИЕ ВЗЯТЫХ ЧЕРТ
// ============================================================
function renderTakenFeats() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;

  var section = $("taken-feats-section");
  var list    = $("taken-feats-list");
  var count   = $("taken-feats-count");
  if (!section || !list) return;

  var feats = char.feats || [];
  if (feats.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  if (count) count.textContent = feats.length;

  list.innerHTML = feats.map(function(f, i) {
    // Find feat data for description
    var data = typeof FEATS_DATA !== "undefined"
      ? FEATS_DATA.find(function(d) { return d.id === f.id; })
      : null;
    var desc = data ? data.desc : "";
    var lvlBadge = f.level ? '<span class="feat-taken-lvl">ур. ' + f.level + '</span>' : "";
    return '<div class="feat-taken-card">' +
      '<div class="feat-taken-row">' +
        '<span class="feat-taken-icon">🎯</span>' +
        '<span class="feat-taken-name">' + escapeHtml(f.name || f.id) + '</span>' +
        lvlBadge +
        '<button class="feat-taken-del" onclick="removeFeat(' + i + ')" title="Убрать черту">✕</button>' +
      '</div>' +
      (desc ? '<div class="feat-taken-desc">' + escapeHtml(desc) + '</div>' : '') +
    '</div>';
  }).join("");
}

function removeFeat(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !char.feats) return;
  var name = char.feats[i] ? char.feats[i].name : "черту";
  showConfirmModal("Убрать черту?",
    "«" + name + "» будет удалена из списка. Бонусы к характеристикам НЕ откатятся.",
    function() {
      char.feats.splice(i, 1);
      saveToLocal();
      renderTakenFeats();
    }
  );
}

// ── Item Reference Modal ──
function openItemRef(tab) {
  var modal = $("item-ref-modal");
  if (modal) modal.classList.add("active");
  switchItemRef(tab || 'weight', null);
}
function closeItemRef() {
  var modal = $("item-ref-modal");
  if (modal) modal.classList.remove("active");
}
function switchItemRef(tab, btnEl) {
  [$("item-ref-weight"), $("item-ref-slots")].forEach(function(el) {
    if (el) el.classList.add("hidden");
  });
  document.querySelectorAll(".item-ref-tab").forEach(function(b) { b.classList.remove("active"); });
  var section = $("item-ref-" + tab);
  if (section) section.classList.remove("hidden");
  if (btnEl) btnEl.classList.add("active");
  else {
    var btn = document.querySelector(".item-ref-tab[onclick*=\"'" + tab + "'\"]");
    if (btn) btn.classList.add("active");
  }
}
