// ============================================================
// app-settings.js — Оформление и настройки: тема и акцент, редакция,
// раскладка статов, плотность, масштаб шрифта, стекло, фон, модалка настроек
// ============================================================

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
  if (meta) meta.setAttribute('content', _isEffectiveLight(t) ? '#eceff5' : '#050a14');
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
  // UI6-1: авто-акцент по классу включён по умолчанию. Явный выбор сохраняем:
  // '1' → вкл, '0' → выкл. Если ключа нет — авто ON только когда пользователь
  // не выбирал акцент вручную (dnd_accent отсутствует); иначе уважаем его выбор.
  try {
    var v = localStorage.getItem('dnd_auto_accent');
    if (v === '1') return true;
    if (v === '0') return false;
    return localStorage.getItem('dnd_accent') === null;
  } catch (e) { return false; }
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

// UI6-3 / E24-0: переключатель редакции правил на главной = редакция ПО УМОЛЧАНИЮ
// для новых персонажей (createNewCharacter читает getEdition()), не глобальный
// режим приложения. Каждый персонаж хранит свою char.edition.
//
// Гейт публичности (E24-0…E24-13): пока механика 2024 не достроена, выбор 2024
// доступен только с dev-флагом localStorage.dnd_e24_beta='1'. Без флага кнопка
// 2024 остаётся заглушкой «в разработке» (тост, редакция не меняется). Публичное
// открытие — E24-14 (снятие гейта, major bump v4.0.0).
function _e24BetaEnabled() {
  try { return localStorage.getItem('dnd_e24_beta') === '1'; } catch (e) { return false; }
}
function getEdition() {
  try {
    var e = localStorage.getItem('dnd_edition');
    // '2024' как дефолт уважаем только при активной бете (иначе — залипший флаг
    // не должен молча создавать 2024-персонажей у обычного пользователя).
    if (e === '2024') return _e24BetaEnabled() ? '2024' : '2014';
    if (e === '2014') return '2014';
  } catch (e) {}
  return '2014';
}
function setEdition(ed) {
  if (ed === '2024' && !_e24BetaEnabled()) {
    // Бета выключена — 2024 ещё «в разработке»: тост, активной остаётся 2014.
    if (typeof showToast === 'function') showToast('Редакция 2024 — в разработке', 'info');
    return;
  }
  var val = (ed === '2024') ? '2024' : '2014';
  try { localStorage.setItem('dnd_edition', val); } catch (e) {}
  _syncEditionButtons();
  if (typeof showToast === 'function') {
    showToast('Редакция по умолчанию: ' + val, 'success');
  }
}
function _syncEditionButtons() {
  var ed = getEdition();
  var beta = _e24BetaEnabled();
  var b14 = document.getElementById('edition-btn-2014');
  var b24 = document.getElementById('edition-btn-2024');
  if (b14) b14.classList.toggle('active', ed === '2014');
  if (b24) {
    b24.classList.toggle('active', ed === '2024');
    // При активной бете кнопка 2024 становится полноценно выбираемой: снимаем
    // визуальную заглушку и aria-disabled, прячем тег «в разработке».
    b24.classList.toggle('is-soon', !beta);
    if (beta) b24.removeAttribute('aria-disabled');
    else b24.setAttribute('aria-disabled', 'true');
    var soonTag = b24.querySelector('.home-edition-soon-tag');
    if (soonTag) soonTag.style.display = beta ? 'none' : '';
  }
}
document.addEventListener('DOMContentLoaded', _syncEditionButtons);

// UI6-4: раскладка листа характеристик.
//  '2024'    — спасброски/навыки внутри карточек характеристик (вид по умолчанию);
//  'classic' — классическая сетка 6/3 + отдельные аккордеоны спасбросков/навыков.
// Layout-only: схема персонажа и контракт ID не меняются. Один дом для каждой
// строки — initSaves/initSkills рендерят в контейнер по текущему layout
// (_statsRowTarget), при переключении _placeStatRows переносит готовые DOM-узлы
// (состояние чекбоксов/бонусов едет с узлами → reload не нужен).
var STATS_LAYOUTS = ['2024', 'classic'];
function _getStatsLayout() {
  try {
    var v = localStorage.getItem('dnd_stats_layout');
    if (STATS_LAYOUTS.indexOf(v) !== -1) return v;
  } catch (e) {}
  return '2024';
}
function _applyStatsLayout(name) {
  // Атрибут выставляется всегда (оба режима имеют свои правила в CSS).
  document.documentElement.setAttribute('data-stats-layout', name);
}
// UI-fix: на телефоне (≤767px) вид 2024 делает карточки компактными в 2 колонки,
// а спасброски/навыки выносит в отдельные сворачиваемые секции (legacy-аккордеоны) —
// внутри узкой карточки им не хватает места. На ПК 2024 оставляет их в карточке.
var STATS_NARROW_MQ = '(max-width: 767px)';
function _isNarrowStats() {
  try { return window.matchMedia && window.matchMedia(STATS_NARROW_MQ).matches; }
  catch (e) { return false; }
}
// Карточки 2024 держат строки внутри только на «широком» 2024; иначе — в legacy.
function _statsInCards() { return _getStatsLayout() === '2024' && !_isNarrowStats(); }
// Контейнер-дом для строки спасброска/навыка в текущем layout.
//  kind='save', key=ключ характеристики (str…cha);
//  kind='skill', key=характеристика навыка (skills[i].stat).
function _statsRowTarget(kind, key) {
  if (kind === 'save') {
    if (_statsInCards()) {
      var sslot = document.getElementById('abil-save-slot-' + key);
      if (sslot) return sslot;
    }
    return document.getElementById('saves-grid');
  }
  if (kind === 'skill') {
    if (_statsInCards()) {
      var kslot = document.getElementById('abil-skills-slot-' + key);
      if (kslot) return kslot;
    }
    return document.getElementById('skills-container');
  }
  return null;
}
// Перенос строк при пересечении брейкпоинта «телефон» (2024: карточки ↔ legacy-аккордеоны).
(function _watchStatsNarrow() {
  try {
    var mq = window.matchMedia(STATS_NARROW_MQ);
    var handler = function () { if (typeof _placeStatRows === 'function') _placeStatRows(); };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
  } catch (e) {}
})();
// Перенос уже отрисованных строк в дом текущего layout (без перерисовки → состояние сохраняется).
function _placeStatRows() {
  if (typeof SAVES_DATA !== 'undefined' && SAVES_DATA && SAVES_DATA.forEach) {
    SAVES_DATA.forEach(function(save) {
      var node = document.getElementById('save-item-' + save.key);
      var target = _statsRowTarget('save', save.key);
      if (node && target && node.parentNode !== target) target.appendChild(node);
    });
  }
  if (typeof skills !== 'undefined' && skills && skills.forEach) {
    skills.forEach(function(skill, i) {
      var node = document.getElementById('skill-row-' + i);
      var target = _statsRowTarget('skill', skill.stat);
      if (node && target && node.parentNode !== target) target.appendChild(node);
    });
  }
}
function setStatsLayout(name) {
  if (STATS_LAYOUTS.indexOf(name) === -1) return;
  try { localStorage.setItem('dnd_stats_layout', name); } catch (e) {}
  _applyStatsLayout(name);
  _placeStatRows();
  _syncStatsLayoutButtons();
}
function _syncStatsLayoutButtons() {
  var active = _getStatsLayout();
  document.querySelectorAll('.theme-picker-btn[data-stats-layout-btn]').forEach(function(b) {
    b.classList.toggle('is-active', b.getAttribute('data-stats-layout-btn') === active);
  });
}
document.addEventListener('DOMContentLoaded', function() {
  _applyStatsLayout(_getStatsLayout());
  _syncStatsLayoutButtons();
});

// UI-fix: сворачивание секции «Характеристики». Атрибут data-stats-collapsed на <html>;
// по умолчанию развёрнуто. Состояние в localStorage (dnd_stats_collapsed).
function _getStatsCollapsed() {
  try { return localStorage.getItem('dnd_stats_collapsed') === '1'; } catch (e) { return false; }
}
function _applyStatsCollapsed(on) {
  document.documentElement.setAttribute('data-stats-collapsed', on ? '1' : '0');
  var btn = document.getElementById('stats-collapse-btn');
  if (btn) btn.setAttribute('aria-expanded', on ? 'false' : 'true');
}
function toggleStatsCollapsed() {
  var on = !_getStatsCollapsed();
  try { localStorage.setItem('dnd_stats_collapsed', on ? '1' : '0'); } catch (e) {}
  _applyStatsCollapsed(on);
}
document.addEventListener('DOMContentLoaded', function() {
  _applyStatsCollapsed(_getStatsCollapsed());
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
var GLASS_A_MIN = 0.30, GLASS_A_MAX = 1.00, GLASS_A_DEFAULT = 0.66; /* THEME-3: 0.60→0.66, синхронно с --glass-alpha в style.css */
var GLASS_B_MIN = 0, GLASS_B_MAX = 24, GLASS_B_DEFAULT = 18;
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
    if (window.__spaceBg && __spaceBg.pause) __spaceBg.pause();
  };
  var _glassEnd = function () {
    document.documentElement.classList.remove('glass-adjusting');
    if (window.__spaceBg && __spaceBg.resume) __spaceBg.resume();
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

// Дымка v5: космос-фон (bg-space.js) на #bgCanvas.
// Режим «Космос на фоне»: off / calm / lively (ключ dnd_space_mode, дефолт lively).
// При смене темы/режима — destroy() и повторный init (следим за data-theme на <html>).
// prefers-reduced-motion → модуль рисует один статичный кадр (motion: false).
var SPACE_MODES = ['off', 'calm', 'lively'];
var _spaceDestroy = null;
function _getSpaceMode() {
  try {
    var m = localStorage.getItem('dnd_space_mode');
    if (SPACE_MODES.indexOf(m) !== -1) return m;
  } catch (e) {}
  return 'lively';
}
function _applySpaceBg() {
  var canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  if (_spaceDestroy) { try { _spaceDestroy(); } catch (e) {} _spaceDestroy = null; }
  var mode = _getSpaceMode();
  // «Выкл» полностью убирает канвас (не рисуем и не держим последний кадр)
  canvas.style.display = mode === 'off' ? 'none' : '';
  if (mode === 'off' || typeof window.initSpaceBg !== 'function') return;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  _spaceDestroy = window.initSpaceBg(canvas, {
    theme: _resolveTheme(_getTheme()),
    mode: mode,
    motion: !reduced
  });
}
function setSpaceMode(m) {
  if (SPACE_MODES.indexOf(m) === -1) return;
  try { localStorage.setItem('dnd_space_mode', m); } catch (e) {}
  _applySpaceBg();
  _syncSpaceButtons();
}
function _syncSpaceButtons() {
  var active = _getSpaceMode();
  document.querySelectorAll('[data-space-btn]').forEach(function (b) {
    b.classList.toggle('is-active', b.getAttribute('data-space-btn') === active);
  });
}
// Пауза/возобновление без пересоздания сцены (используется слайдерами «стекла»)
window.__spaceBg = {
  pause: function () { if (_spaceDestroy && _spaceDestroy.pause) _spaceDestroy.pause(); },
  resume: function () { if (_spaceDestroy && _spaceDestroy.resume) _spaceDestroy.resume(); },
  refresh: _applySpaceBg
};
document.addEventListener('DOMContentLoaded', function () {
  _applySpaceBg();
  _syncSpaceButtons();
  // Тема резолвится в data-theme на <html> (включая auto) — пересоздаём сцену под палитру
  try {
    new MutationObserver(function () { _applySpaceBg(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}
  try {
    var rm = matchMedia('(prefers-reduced-motion: reduce)');
    var onRm = function () { _applySpaceBg(); };
    if (rm.addEventListener) rm.addEventListener('change', onRm);
    else if (rm.addListener) rm.addListener(onRm);
  } catch (e) {}
});

// Дымка v5: подстановка линейных SVG-иконок (icons.js) в статическую разметку.
// <span data-ico="sheet" data-ico-size="20" data-ico-color="var(--danger)">📋</span>
// Эмодзи внутри — фолбэк, если icons.js не загрузился.
function _applyDymkaIcons(root) {
  if (typeof dndIcon !== 'function') return;
  (root || document).querySelectorAll('[data-ico]').forEach(function (el) {
    var svg = dndIcon(el.getAttribute('data-ico'), parseInt(el.getAttribute('data-ico-size'), 10) || 18);
    if (!svg) return;
    el.innerHTML = svg;
    el.classList.add('dico');
    var c = el.getAttribute('data-ico-color');
    if (c) el.style.color = c;
  });
}
document.addEventListener('DOMContentLoaded', function () { _applyDymkaIcons(); });

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
  try { if (typeof _syncSpaceButtons === 'function') _syncSpaceButtons(); } catch (e) {}
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

