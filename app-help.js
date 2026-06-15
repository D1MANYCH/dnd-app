// ============================================================
// app-help.js — Обучение, справка и контекстные подсказки.
// HELP-1: статичная табовая модалка #help-modal (зеркало item-ref-modal /
//          openItemRef из app-ui.js). Разделы переключаются через .hidden.
// Сюда же в следующих фазах HELP лягут контекстные «?», приветствие
// и движок интерактивного тура.
// ============================================================

/** Открыть help-центр на нужном разделе (по умолчанию «С чего начать»). */
function openHelp(section) {
  var modal = document.getElementById("help-modal");
  if (modal) modal.classList.add("active");
  switchHelpSection(section || 'start', null);
}

/** Закрыть help-центр. */
function closeHelp() {
  var modal = document.getElementById("help-modal");
  if (modal) modal.classList.remove("active");
}

/**
 * Переключить раздел справки.
 * @param {string} section ключ раздела (about/start/sheet/spells/inventory/
 *                         battle/party/notes/journal/dice/data)
 * @param {HTMLElement|null} btnEl кнопка-таб, по которой кликнули (если есть)
 */
function switchHelpSection(section, btnEl) {
  document.querySelectorAll("#help-modal .help-section").forEach(function(el) {
    el.classList.add("hidden");
  });
  document.querySelectorAll("#help-modal .help-tab").forEach(function(b) {
    b.classList.remove("active");
  });
  var sec = document.getElementById("help-" + section);
  // Фолбэк: неизвестный раздел → «С чего начать»
  if (!sec) { section = 'start'; sec = document.getElementById("help-start"); }
  if (sec) sec.classList.remove("hidden");
  if (btnEl) btnEl.classList.add("active");
  else {
    var btn = document.querySelector("#help-modal .help-tab[onclick*=\"'" + section + "'\"]");
    if (btn) btn.classList.add("active");
  }
  // Прокрутка тела к началу при смене раздела
  var body = document.querySelector("#help-modal .help-body");
  if (body) body.scrollTop = 0;
}

// ============================================================
// HELP-3 — Приветствие первого запуска + выбор уровня знакомства.
// Флаги в localStorage (паттерн dnd_*):
//   dnd_help_seen       — приветствие пройдено/пропущено (показываем 1 раз);
//   dnd_help_sheet_seen — тур по листу пройден (используется в HELP-4);
//   dnd_help_level      — 'novice' | 'known' (выбор на приветственном экране).
// ============================================================
var HELP_FLAG_SEEN = 'dnd_help_seen';
var HELP_FLAG_SHEET_SEEN = 'dnd_help_sheet_seen';
var HELP_FLAG_LEVEL = 'dnd_help_level';

/** Прочитать флаг онбординга (строка или null). */
function getHelpFlag(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
/** Записать флаг онбординга. */
function setHelpFlag(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

/** Показать нужный шаг приветствия (1 / 'novice' / 'known') и прокрутить вверх. */
function welcomeGoStep(which) {
  ['1', 'novice', 'known'].forEach(function (s) {
    var el = document.getElementById('welcome-step-' + s);
    if (el) el.classList.toggle('hidden', s !== String(which));
  });
  var content = document.querySelector('#welcome-modal .welcome-content');
  if (content) content.scrollTop = 0;
}

/** Открыть приветствие с первого шага. */
function showWelcome() {
  welcomeGoStep(1);
  var modal = document.getElementById('welcome-modal');
  if (modal) modal.classList.add('active');
}

/** Закрыть модалку приветствия (без побочных действий). */
function closeWelcome() {
  var modal = document.getElementById('welcome-modal');
  if (modal) modal.classList.remove('active');
}

/** Выбор уровня знакомства → запись флага + переход на соответствующий шаг 2. */
function welcomeChooseLevel(level) {
  if (level !== 'novice' && level !== 'known') level = 'known';
  setHelpFlag(HELP_FLAG_LEVEL, level);
  welcomeGoStep(level);
}

/** Кнопка «Назад» на шаге 2 → вернуться к выбору уровня. */
function welcomeBack() { welcomeGoStep(1); }

/**
 * Завершить приветствие выбранным действием. Любой выход помечает dnd_help_seen,
 * чтобы приветствие больше не всплывало автоматически.
 * @param {'tour'|'help'|'create'|'skip'} action
 */
function welcomeFinish(action) {
  setHelpFlag(HELP_FLAG_SEEN, '1');
  closeWelcome();
  switch (action) {
    case 'tour':
      // Движок интерактивного тура — HELP-4. До его появления мягкий фолбэк в справку.
      if (typeof startListTour === 'function') startListTour();
      else openHelp('start');
      break;
    case 'help':
      openHelp('about');
      break;
    case 'create':
      if (typeof createNewCharacter === 'function') createNewCharacter();
      break;
    case 'skip':
    default:
      break;
  }
}

/** Крестик/Esc на приветствии = «Пропустить» (флаг ставим, ничего не запускаем). */
function dismissWelcome() { welcomeFinish('skip'); }

/** First-run: показать приветствие, если оно ещё не пройдено. */
function maybeShowWelcome() {
  if (!getHelpFlag(HELP_FLAG_SEEN)) showWelcome();
}

/** «Показать обучение заново» (настройки/справка) — сброс флагов + приветствие. */
function restartOnboarding() {
  try {
    localStorage.removeItem(HELP_FLAG_SEEN);
    localStorage.removeItem(HELP_FLAG_SHEET_SEEN);
  } catch (e) {}
  if (typeof closeSettingsModal === 'function') closeSettingsModal();
  showWelcome();
}

// Esc на открытом приветствии = пропуск (паттерн как у build-picker в app-core.js).
document.addEventListener('keydown', function (ev) {
  if (ev.key !== 'Escape') return;
  var modal = document.getElementById('welcome-modal');
  if (modal && modal.classList.contains('active')) dismissWelcome();
});

// Boot-хук: addEventListener('load') регистрируется ПОСЛЕ window.onload в app-core.js
// (app-help.js грузится позже), поэтому renderCharacterList() уже отработал к этому моменту.
window.addEventListener('load', maybeShowWelcome);
