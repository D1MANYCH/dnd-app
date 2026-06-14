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
