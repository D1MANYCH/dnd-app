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

// TOUR (фаза TOUR-1+): по флагу «тур вкладки пройден» на каждую вкладку,
// кроме листа/списка (у тех — dnd_help_sheet_seen / dnd_help_seen).
var HELP_FLAG_SPELLS_SEEN    = 'dnd_help_spells_seen';
var HELP_FLAG_INVENTORY_SEEN = 'dnd_help_inventory_seen';
var HELP_FLAG_BATTLE_SEEN    = 'dnd_help_battle_seen';
var HELP_FLAG_NOTES_SEEN     = 'dnd_help_notes_seen';
var HELP_FLAG_PARTY_SEEN     = 'dnd_help_party_seen';
var HELP_FLAG_JOURNAL_SEEN   = 'dnd_help_journal_seen';
// Все флаги онбординга — «Показать обучение заново» чистит их разом, чтобы
// весь онбординг повторился по мере захода на вкладки.
var TOUR_ALL_FLAGS = [
  HELP_FLAG_SEEN, HELP_FLAG_SHEET_SEEN,
  HELP_FLAG_SPELLS_SEEN, HELP_FLAG_INVENTORY_SEEN, HELP_FLAG_BATTLE_SEEN,
  HELP_FLAG_NOTES_SEEN, HELP_FLAG_PARTY_SEEN, HELP_FLAG_JOURNAL_SEEN
];

/** Прочитать флаг онбординга (строка или null). */
function getHelpFlag(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
/** Записать флаг онбординга. */
function setHelpFlag(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}

/** Показать нужный шаг приветствия (1 / 2) и прокрутить вверх.
 *  Дымка v5: шаги — «марка + фичи» → «С чего начнём?» (были novice/known). */
function welcomeGoStep(which) {
  ['1', '2'].forEach(function (s) {
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

/** «Продолжить» на шаге 1: уровень novice (подсказки с пояснениями) + шаг 2. */
function welcomeContinue() {
  if (!getHelpFlag(HELP_FLAG_LEVEL)) setHelpFlag(HELP_FLAG_LEVEL, 'novice');
  welcomeGoStep(2);
}

/** «Я опытный — пропустить»: уровень known, приветствие закрывается. */
function welcomeSkipExperienced() {
  setHelpFlag(HELP_FLAG_LEVEL, 'known');
  welcomeFinish('skip');
}

/** Кнопка «Назад» на шаге 2 → вернуться к марке приложения. */
function welcomeBack() { welcomeGoStep(1); }

/**
 * Завершить приветствие выбранным действием. Любой выход помечает dnd_help_seen,
 * чтобы приветствие больше не всплывало автоматически.
 * @param {'tour'|'help'|'build'|'create'|'import'|'skip'} action
 */
function welcomeFinish(action) {
  setHelpFlag(HELP_FLAG_SEEN, '1');
  closeWelcome();
  switch (action) {
    case 'tour':
      // Тур по контексту: открыт персонаж → тур листа (цели тура главной
      // на экране листа скрыты, и тур вырождался в пару пустых карточек);
      // иначе — тур главного экрана.
      if (window.currentId && typeof startSheetTour === 'function') startSheetTour();
      else if (typeof startListTour === 'function') startListTour();
      else openHelp('start');
      break;
    case 'help':
      openHelp('about');
      break;
    case 'build':
      if (typeof openBuildPicker === 'function') openBuildPicker();
      break;
    case 'create':
      if (typeof createNewCharacter === 'function') createNewCharacter();
      break;
    case 'import': {
      var f = document.getElementById('import-char-file');
      if (f) f.click();
      break;
    }
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
    TOUR_ALL_FLAGS.forEach(function (k) { localStorage.removeItem(k); });
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

// ============================================================
// HELP-4 — Движок интерактивного тура (подсветка реальных кнопок).
// Оверлей #tour-overlay (затемнение) + коучмарк #tour-coach
// (заголовок/текст/счётчик/Назад/Далее·Готово/×). Подсветка цели — spotlight
// через box-shadow-«дырку»; коучмарк позиционируется у цели с клампом по
// вьюпорту; цель без позиции → центрированная карточка. scrollIntoView,
// пропуск отсутствующих целей (на этапе сборки шагов), выбор селектора по
// ширине окна, Esc = пропуск, ←/→ = навигация, уважение prefers-reduced-motion.
// DOM создаётся лениво из JS (в index.html ничего не добавляем).
// ============================================================
var _tour = null;       // активный тур: { steps:[], i:Number, name:String }
var _tourPad = 6;       // отступ подсветки вокруг цели, px
var _tourRafId = 0;     // throttle репозиции на resize/scroll
var _tourFontsHooked = false; // один раз навешиваем re-layout на document.fonts.ready

/** Широкая раскладка (≥1024): виден right-rail и статический сайдбар, нижний
 *  tab-nav и status-bar скрыты. От этого зависит, какую цель подсвечивать. */
function _tourWide() { return window.innerWidth >= 1024; }

/** Лениво создать DOM тура (оверлей + коучмарк) и навесить обработчики кнопок. */
function _ensureTourDom() {
  if (document.getElementById('tour-overlay')) return;
  var ov = document.createElement('div');
  ov.id = 'tour-overlay';
  ov.className = 'tour-overlay';
  // Затемнение — 4 сплошных панели вокруг цели (надёжнее, чем box-shadow 9999px:
  // огромный spread не рендерится на части GPU/при зуме браузера). Дырку
  // (целевой rect) ничто не закрывает → цель видна, клики блокирует сам overlay.
  ov.innerHTML =
    '<div class="tour-mask" id="tour-mask-top"></div>' +
    '<div class="tour-mask" id="tour-mask-right"></div>' +
    '<div class="tour-mask" id="tour-mask-bottom"></div>' +
    '<div class="tour-mask" id="tour-mask-left"></div>' +
    // THEME-1: угловые заплатки — скругляют прямоугольный вырез 4 панелей
    '<div class="tour-corner" id="tour-corner-tl"></div>' +
    '<div class="tour-corner" id="tour-corner-tr"></div>' +
    '<div class="tour-corner" id="tour-corner-bl"></div>' +
    '<div class="tour-corner" id="tour-corner-br"></div>' +
    '<div class="tour-ring" id="tour-ring"></div>' +
    '<div id="tour-coach" class="tour-coach" role="dialog" aria-modal="true" aria-live="polite">' +
      '<button type="button" class="tour-x" id="tour-x" aria-label="Пропустить тур">&times;</button>' +
      // Дымка v5: шапка «ШАГ N ИЗ M» + точки-прогресс вместо текстового счётчика
      '<div class="tour-coach-step" id="tour-step-label" aria-live="polite"></div>' +
      '<div class="tour-coach-title" id="tour-coach-title"></div>' +
      '<div class="tour-coach-text" id="tour-coach-text"></div>' +
      '<div class="tour-coach-foot">' +
        '<div class="tc-dots" id="tour-dots" aria-hidden="true"></div>' +
        '<div class="tour-nav">' +
          '<button type="button" class="tour-btn tour-prev" id="tour-prev">Назад</button>' +
          '<button type="button" class="tour-btn tour-next" id="tour-next">Далее</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(ov);
  document.getElementById('tour-x').addEventListener('click', function () { endTour(true); });
  document.getElementById('tour-prev').addEventListener('click', tourPrev);
  document.getElementById('tour-next').addEventListener('click', tourNext);
}

/** Разрешить цель шага в элемент (или null). target — функция или селектор;
 *  цель с нулевым размером (скрыта) считается отсутствующей. */
function _resolveTarget(step) {
  if (!step || !step.target) return null;
  var el = null;
  try {
    el = (typeof step.target === 'function') ? step.target() : document.querySelector(step.target);
  } catch (e) { el = null; }
  if (!el) return null;
  var r = el.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return null;
  return el;
}

/** Первый видимый (ненулевой rect) элемент из списка селекторов — для целей
 *  с фолбэками по раскладке (например: статичный сайдбар ≥1200 → нижние табы
 *  <1024 → hamburger на 1024–1199, где и то и другое display:none). */
function _tourFirstVisible(selectors) {
  for (var i = 0; i < selectors.length; i++) {
    var el = null;
    try { el = document.querySelector(selectors[i]); } catch (e) { el = null; }
    if (!el) continue;
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

/** Открыта ли какая-либо модалка (.modal.active): гайд билда, приветствие,
 *  пикеры и т.п. Авто-тур поверх открытой модалки выглядит сломанным —
 *  подсветка остаётся за окном, карточка тура конфликтует с ним (так «слетал»
 *  тур листа при создании по билду: гайд авто-открывается через 250мс,
 *  а тур стартовал через 450мс прямо поверх него). */
function _tourModalOpen() {
  return !!document.querySelector('.modal.active');
}

/** Дождаться закрытия всех модалок и вызвать cb (проверка каждые 600мс,
 *  до ~2 минут). Если модалку так и не закрыли — тур молча не стартует;
 *  флаг seen при этом не ставится, авто-старт повторится в следующий раз. */
function _tourStartWhenClear(cb) {
  var tries = 0;
  (function poll() {
    if (_tour) return;
    if (!_tourModalOpen()) { cb(); return; }
    if (++tries > 200) return;
    setTimeout(poll, 600);
  })();
}

/** Запустить тур из набора шагов. Шаги с requireTarget без видимой цели
 *  отсеиваются на старте (счётчик остаётся корректным, без скачков). */
function startTour(steps, name) {
  if (!steps || !steps.length) return;
  steps = steps.filter(function (s) { return !s.requireTarget || !!_resolveTarget(s); });
  if (!steps.length) return;
  _ensureTourDom();
  _tour = { steps: steps, i: 0, name: name || '' };
  var ov = document.getElementById('tour-overlay');
  if (ov) ov.classList.add('active');
  _bindTourGlobal();
  _showTourStep();
}

/** Тур по экрану списка персонажей (без открытого персонажа). */
function startListTour() { startTour(_buildListSteps(), 'list'); }

/** Тур по листу персонажа. Помечаем dnd_help_sheet_seen сразу — повторный
 *  авто-старт при следующих loadCharacter не сработает. */
function startSheetTour() {
  setHelpFlag(HELP_FLAG_SHEET_SEEN, '1');
  startTour(_buildSheetSteps(), 'sheet');
}

/** Авто-старт тура по листу при первом открытии персонажа (хук в loadCharacter). */
function maybeStartSheetTour() {
  if (getHelpFlag(HELP_FLAG_SHEET_SEEN)) return;
  if (_tour) return;
  var w = document.getElementById('welcome-modal');
  if (w && w.classList.contains('active')) return;  // открыто приветствие — не мешаем
  // Даём листу и right-rail устаканиться после loadCharacter→switchTab.
  setTimeout(function () {
    if (_tour || getHelpFlag(HELP_FLAG_SHEET_SEEN)) return;
    // Открыт гайд билда/другая модалка → ждём её закрытия, не стартуем поверх.
    _tourStartWhenClear(function () {
      if (_tour || getHelpFlag(HELP_FLAG_SHEET_SEEN)) return;
      if (!window.currentId) return; // пока ждали — вернулись к списку персонажей
      startSheetTour();
    });
  }, 450);
}

/** Перезапустить тур из help-центра по текущему экрану. */
function restartTour() {
  closeHelp();
  if (window.currentId) startSheetTour();
  else startListTour();
}

// ── TOUR-1+: туры по вкладкам (кроме листа и списка) ─────────
// Реестр вкладок: tab → { flag, build }. Лист и список в реестр НЕ входят
// (их туры — startSheetTour / startListTour). Наборы шагов добавляются
// по фазам TOUR-2..6; движок (startTour/_layoutTour/…) уже готов из HELP-4.
var TOUR_TABS = {
  spells:    { flag: HELP_FLAG_SPELLS_SEEN,    build: _buildSpellsSteps },
  inventory: { flag: HELP_FLAG_INVENTORY_SEEN, build: _buildInventorySteps },
  battle:    { flag: HELP_FLAG_BATTLE_SEEN,    build: _buildBattleSteps },
  notes:     { flag: HELP_FLAG_NOTES_SEEN,     build: _buildNotesSteps },
  party:     { flag: HELP_FLAG_PARTY_SEEN,     build: _buildPartySteps },
  journal:   { flag: HELP_FLAG_JOURNAL_SEEN,   build: _buildJournalSteps }
};

/** Ручной запуск тура вкладки из help-центра: открыть вкладку → флаг → старт. */
function startTabTour(tab) {
  var entry = TOUR_TABS[tab];
  if (!entry) return;
  closeHelp();
  if (typeof switchTab === 'function') switchTab(tab);
  setHelpFlag(entry.flag, '1');
  startTour(entry.build(), tab);
}

/** Авто-старт тура при первом заходе на вкладку (хук в switchTab).
 *  Гард: вкладка есть в реестре, флаг не стоит, нет активного тура, не открыто
 *  приветствие; затем небольшая задержка (дать вкладке/right-rail устаканиться)
 *  и повторный гард. Флаг ставится при старте — двойного старта нет. */
function maybeStartTabTour(tab) {
  var entry = TOUR_TABS[tab];
  if (!entry) return;
  if (getHelpFlag(entry.flag)) return;
  if (_tour) return;
  var w = document.getElementById('welcome-modal');
  if (w && w.classList.contains('active')) return;
  setTimeout(function () {
    if (_tour || getHelpFlag(entry.flag)) return;
    var w2 = document.getElementById('welcome-modal');
    if (w2 && w2.classList.contains('active')) return;
    // Открыта модалка (пикер, гайд и т.п.) → ждём закрытия, не стартуем поверх.
    _tourStartWhenClear(function () {
      if (_tour || getHelpFlag(entry.flag)) return;
      var tabEl = document.getElementById('tab-' + tab);
      if (!tabEl || !tabEl.classList.contains('active')) return; // вкладку сменили, пока ждали
      setHelpFlag(entry.flag, '1');
      startTour(entry.build(), tab);
    });
  }, 350);
}

function tourNext() {
  if (!_tour) return;
  if (_tour.i >= _tour.steps.length - 1) { endTour(true); return; }
  _tour.i++; _showTourStep();
}
function tourPrev() {
  if (!_tour || _tour.i <= 0) return;
  _tour.i--; _showTourStep();
}

/** Завершить тур (× / Esc / «Готово»). Для тура по листу фиксируем флаг. */
function endTour(markSeen) {
  var ov = document.getElementById('tour-overlay');
  if (ov) ov.classList.remove('active');
  if (_tour && _tour.name === 'sheet' && markSeen) setHelpFlag(HELP_FLAG_SHEET_SEEN, '1');
  _tour = null;
  _unbindTourGlobal();
}

/** Отрисовать текущий шаг: текст/счётчик/кнопки + геометрия. */
var _tourFlightT = 0; // таймер снятия класса «перелёта» (transition координат)
function _showTourStep() {
  if (!_tour) return;
  var step = _tour.steps[_tour.i];
  var titleEl = document.getElementById('tour-coach-title');
  var textEl = document.getElementById('tour-coach-text');
  var stepEl = document.getElementById('tour-step-label');
  var dotsEl = document.getElementById('tour-dots');
  var prevBtn = document.getElementById('tour-prev');
  var nextBtn = document.getElementById('tour-next');
  // Дымка v5: контент коуча меняется fade-ом ~140ms (CSS transition opacity)
  if (titleEl) titleEl.style.opacity = '0';
  if (textEl) textEl.style.opacity = '0';
  if (titleEl) titleEl.textContent = step.title || '';
  if (textEl) {
    var body = step.text || '';
    // novice → добавляем пояснение терминов (если у шага оно есть).
    if (getHelpFlag(HELP_FLAG_LEVEL) === 'novice' && step.novice) {
      body += (body ? '\n\n' : '') + step.novice;
    }
    textEl.textContent = body;
  }
  requestAnimationFrame(function () {
    if (titleEl) titleEl.style.opacity = '1';
    if (textEl) textEl.style.opacity = '1';
  });
  if (stepEl) stepEl.textContent = 'Шаг ' + (_tour.i + 1) + ' из ' + _tour.steps.length;
  if (dotsEl) {
    var dots = '';
    for (var di = 0; di < _tour.steps.length; di++) {
      dots += '<span class="tc-dot' + (di === _tour.i ? ' on' : '') + '"></span>';
    }
    dotsEl.innerHTML = dots;
  }
  if (prevBtn) prevBtn.disabled = (_tour.i === 0);
  if (nextBtn) nextBtn.textContent = (_tour.i === _tour.steps.length - 1) ? 'Готово' : 'Далее';
  // Дымка v5: «перелёт» ring/масок/коуча к новой цели — CSS transition координат
  // включается только на время смены шага (класс tour-flight), чтобы reflow при
  // скролле/resize оставался мгновенным (без погони подсветки за пальцем).
  var ov = document.getElementById('tour-overlay');
  if (ov) {
    ov.classList.add('tour-flight');
    clearTimeout(_tourFlightT);
    _tourFlightT = setTimeout(function () { ov.classList.remove('tour-flight'); }, 500);
  }
  _layoutTour();
  // Защита от позднего рефлоу: подсветка считается по rect цели в момент показа,
  // но layout может «доехать» уже после (поздняя загрузка шрифта, асинхронный
  // ре-рендер right-rail/списка, смена ширины скролл-контейнера). На части машин
  // это оставляло кольцо/маски смещёнными от цели («кольцо вокруг пустоты»). Re-layout
  // идемпотентен: если layout стабилен — это no-op, иначе подсветка пере-снапится к цели.
  requestAnimationFrame(function () { if (_tour) _layoutTour(); });
  setTimeout(function () { if (_tour) _layoutTour(); }, 90);
  if (document.fonts && document.fonts.ready && !_tourFontsHooked) {
    _tourFontsHooked = true;
    document.fonts.ready.then(function () { if (_tour) _layoutTour(); });
  }
}

/** Задать прямоугольник элементу (px), отрицательные размеры → 0.
 *  THEME-1: без собственного округления — края считает _computeTourBoxes со
 *  снапом к device-пикселям. Прежние floor/ceil разводили панели врозь, и их
 *  приходилось перекрывать на ±1px; на светлой теме два слоя полупрозрачного
 *  затемнения в месте перехлёста давали тёмные швы-«полоски». */
function _setBox(el, left, top, width, height) {
  if (!el) return;
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  el.style.width = Math.max(0, width) + 'px';
  el.style.height = Math.max(0, height) + 'px';
}

/** THEME-1: чистая геометрия прожектора (без DOM — тестируется в headless).
 *  Панели стыкуются впритык по ОБЩИМ краям дырки — ни перехлёста (двойное
 *  затемнение = тёмные швы на светлой теме), ни зазора: каждый край снапится
 *  к device-пикселям (k/dpr) и ложится ровно на физический пиксель, поэтому
 *  антиалиасной «светящейся линии» между панелями не возникает (DPR 1/1.25/1.5/2).
 *  corners — 4 угловые заплатки скругления выреза (radial-gradient в CSS);
 *  null там, где заплатка не нужна: дырка обрезана краем вьюпорта (край не от
 *  цели, а от клампа) или радиус выродился на крошечной цели. */
function _computeTourBoxes(vw, vh, rect, pad, dpr) {
  var d = dpr > 0 ? dpr : 1;
  function snap(v) { return Math.round(v * d) / d; }
  var clipT = rect.top - pad < 0, clipL = rect.left - pad < 0;
  var clipR = rect.right + pad > vw, clipB = rect.bottom + pad > vh;
  var T = snap(Math.max(0, rect.top - pad));
  var L = snap(Math.max(0, rect.left - pad));
  var R = snap(Math.min(vw, rect.right + pad));
  var B = snap(Math.min(vh, rect.bottom + pad));
  if (R < L) R = L;
  if (B < T) B = T;
  // Радиус скругления выреза = радиусу .tour-ring (14px), на маленькой цели
  // ужимается до полуразмера дырки; совсем мелкий (<3px) не рисуем.
  var rad = Math.floor(Math.min(14, (R - L) / 2, (B - T) / 2));
  if (rad < 3) rad = 0;
  function corner(x, y, hidden) {
    return (rad > 0 && !hidden) ? { left: x, top: y, width: rad, height: rad } : null;
  }
  return {
    hole: { left: L, top: T, right: R, bottom: B },
    radius: rad,
    masks: {
      top:    { left: 0, top: 0, width: vw, height: T },
      bottom: { left: 0, top: B, width: vw, height: Math.max(0, vh - B) },
      left:   { left: 0, top: T, width: L, height: B - T },
      right:  { left: R, top: T, width: Math.max(0, vw - R), height: B - T }
    },
    corners: {
      tl: corner(L, T, clipT || clipL),
      tr: corner(R - rad, T, clipT || clipR),
      bl: corner(L, B - rad, clipB || clipL),
      br: corner(R - rad, B - rad, clipB || clipR)
    }
  };
}

/** Разложить 4 угловые заплатки по расчёту _computeTourBoxes (boxes = null → скрыть все). */
function _layoutTourCorners(boxes) {
  var ids = { tl: 'tour-corner-tl', tr: 'tour-corner-tr', bl: 'tour-corner-bl', br: 'tour-corner-br' };
  for (var k in ids) {
    var el = document.getElementById(ids[k]);
    if (!el) continue;
    var box = boxes && boxes.corners[k];
    if (box) {
      el.style.display = 'block';
      el.style.setProperty('--tc-r', boxes.radius + 'px');
      _setBox(el, box.left, box.top, box.width, box.height);
    } else {
      el.style.display = 'none';
    }
  }
}

/** Позиционировать панели затемнения, кольцо и коучмарк под цель текущего шага. */
function _layoutTour() {
  if (!_tour) return;
  var coach = document.getElementById('tour-coach');
  var ring = document.getElementById('tour-ring');
  var mTop = document.getElementById('tour-mask-top');
  var mRight = document.getElementById('tour-mask-right');
  var mBottom = document.getElementById('tour-mask-bottom');
  var mLeft = document.getElementById('tour-mask-left');
  if (!coach || !ring || !mTop || !mRight || !mBottom || !mLeft) return;
  var el = _resolveTarget(_tour.steps[_tour.i]);
  var vw = window.innerWidth, vh = window.innerHeight, margin = 12;
  if (el) {
    // Размер коуча нужен до прокрутки → показываем карточку заранее
    // (при display:none offsetWidth/Height нулевые).
    coach.classList.remove('tour-coach-centered');
    coach.style.display = 'block';
    var cw = coach.offsetWidth, ch = coach.offsetHeight;
    el.scrollIntoView({ block: 'center', inline: 'nearest' });
    var r = el.getBoundingClientRect();
    // block:'center' центрует одну цель; если цель+коуч влезают в экран вместе,
    // но под отцентрованной целью коучу не хватает места (высокая карточка,
    // напр. «Кошель» на телефоне) — докручиваем окно, освобождая место снизу.
    // Идемпотентно: конечная позиция скролла одна и та же при повторном layout.
    var need = r.height + margin + ch;
    if (need <= vh - 2 * margin) {
      if (r.bottom + margin + ch > vh - margin) {
        window.scrollBy(0, r.top - (vh - need) / 2);
        r = el.getBoundingClientRect();
      }
      if (r.bottom + margin + ch > vh - margin && r.top - margin - ch < margin) {
        // Снизу упёрлись в конец документа (цель — последняя карточка вкладки):
        // освобождаем место над целью, коуч встанет сверху.
        window.scrollBy(0, r.top - ((vh - need) / 2 + ch + margin));
        r = el.getBoundingClientRect();
      }
    }
    // 4 панели образуют рамку, оставляя целевой rect незакрытым (подсвеченным).
    // THEME-1: панели стыкуются впритык по общим снап-краям (см. _computeTourBoxes),
    // скругление выреза дают 4 угловые заплатки .tour-corner.
    var boxes = _computeTourBoxes(vw, vh, r, _tourPad, window.devicePixelRatio || 1);
    var hT = boxes.hole.top, hL = boxes.hole.left, hR = boxes.hole.right, hB = boxes.hole.bottom;
    _setBox(mTop, boxes.masks.top.left, boxes.masks.top.top, boxes.masks.top.width, boxes.masks.top.height);
    _setBox(mBottom, boxes.masks.bottom.left, boxes.masks.bottom.top, boxes.masks.bottom.width, boxes.masks.bottom.height);
    _setBox(mLeft, boxes.masks.left.left, boxes.masks.left.top, boxes.masks.left.width, boxes.masks.left.height);
    _setBox(mRight, boxes.masks.right.left, boxes.masks.right.top, boxes.masks.right.width, boxes.masks.right.height);
    _layoutTourCorners(boxes);
    ring.style.display = 'block';
    // Радиус кольца следует за радиусом выреза (на мелких целях он ужимается).
    ring.style.borderRadius = boxes.radius + 'px';
    _setBox(ring, hL, hT, hR - hL, hB - hT);
    // Порядок размещения: под целью → над → справа → слева → к низу вьюпорта.
    // Вертикальный центр не используется: цель выше экрана (сайдбар на ПК,
    // крупная карточка ячеек) отцентрована scrollIntoView, и центрированный
    // коуч ложился ровно на подсветку.
    var top, left;
    // Условия «влезает» учитывают margin с обеих сторон — иначе кламп по краю
    // вьюпорта задвигал карточку обратно на подсветку (полоска-пересечение).
    if (r.bottom + margin + ch <= vh - margin) {                      // под целью
      top = r.bottom + margin;
      left = r.left + r.width / 2 - cw / 2;
    } else if (r.top - margin - ch >= margin) {                       // над целью
      top = r.top - margin - ch;
      left = r.left + r.width / 2 - cw / 2;
    } else if (r.right + margin + cw <= vw - margin) {                // справа от цели
      left = r.right + margin;
      top = r.top + r.height / 2 - ch / 2;
    } else if (r.left - margin - cw >= margin) {                      // слева от цели
      left = r.left - margin - cw;
      top = r.top + r.height / 2 - ch / 2;
    } else {                                                          // цель ~весь экран
      top = vh - ch - margin;
      left = r.left + r.width / 2 - cw / 2;
    }
    left = Math.max(margin, Math.min(left, vw - cw - margin));
    top = Math.max(margin, Math.min(top, vh - ch - margin));
    coach.style.top = top + 'px';
    coach.style.left = left + 'px';
    // Страховка: если фактический rect карточки шире/выше замера (замер успел
    // разойтись с рендером — поздний шрифт, транзишен, нулевой offsetWidth в
    // момент показа), докручиваем координаты по реальным размерам. В обычном
    // состоянии условие ложно (кламп выше уже удержал карточку в экране).
    var cr = coach.getBoundingClientRect();
    if (left + cr.width > vw - margin) {
      coach.style.left = Math.max(margin, vw - cr.width - margin) + 'px';
    }
    if (top + cr.height > vh - margin) {
      coach.style.top = Math.max(margin, vh - cr.height - margin) + 'px';
    }
  } else {
    // Нет цели → одна панель на весь экран + карточка по центру.
    _setBox(mTop, 0, 0, vw, vh);
    _setBox(mRight, 0, 0, 0, 0);
    _setBox(mBottom, 0, 0, 0, 0);
    _setBox(mLeft, 0, 0, 0, 0);
    _layoutTourCorners(null);
    ring.style.display = 'none';
    coach.classList.add('tour-coach-centered');
    coach.style.display = 'block';
    coach.style.top = '';
    coach.style.left = '';
  }
}

function _onTourKey(ev) {
  if (!_tour) return;
  if (ev.key === 'Escape') { ev.preventDefault(); endTour(true); }
  else if (ev.key === 'ArrowRight') { ev.preventDefault(); tourNext(); }
  else if (ev.key === 'ArrowLeft') { ev.preventDefault(); tourPrev(); }
}
function _onTourReflow() {
  if (!_tour || _tourRafId) return;
  _tourRafId = requestAnimationFrame(function () { _tourRafId = 0; _layoutTour(); });
}
function _bindTourGlobal() {
  document.addEventListener('keydown', _onTourKey, true);
  window.addEventListener('resize', _onTourReflow);
  window.addEventListener('scroll', _onTourReflow, true);
}
function _unbindTourGlobal() {
  document.removeEventListener('keydown', _onTourKey, true);
  window.removeEventListener('resize', _onTourReflow);
  window.removeEventListener('scroll', _onTourReflow, true);
}

// ── Наборы шагов ────────────────────────────────────────────
// requireTarget:true → шаг с обязательной целью (отсеивается, если её нет).
// novice → доп. пояснение терминов для уровня «первый раз в D&D».

/** Тур по экрану списка персонажей. */
function _buildListSteps() {
  return [
    {
      title: '🧭 Тур по приложению',
      text: 'Коротко покажем, что где на главном экране. Закрыть тур — крестиком или клавишей Esc; листать — кнопками «Назад»/«Далее» или стрелками ←/→.'
    },
    {
      requireTarget: true,
      target: function () { return document.querySelector('.home-actions-primary button'); },
      title: '➕ Новый персонаж',
      text: 'Создаёт пустой лист с нуля: класс, расу, характеристики и снаряжение выбираете сами.'
    },
    {
      requireTarget: true,
      target: function () {
        var b = document.querySelectorAll('.home-actions-primary button');
        return b.length > 1 ? b[1] : null;
      },
      title: '📘 По готовому билду',
      text: 'Готовый персонаж из набора PHB — удобно для быстрого старта или как пример. Уровень и снаряжение уже заполнены.'
    },
    {
      requireTarget: true,
      target: function () { return document.querySelector('.home-utils button'); },
      title: '💾 Копии и импорт',
      text: 'Скачать резервную копию всех персонажей или загрузить ранее сохранённый файл. Данные хранятся только в этом браузере — делайте копии.'
    },
    {
      requireTarget: true,
      target: function () { return document.getElementById('app-version-settings'); },
      title: '⚙️ Настройки',
      text: 'Тема, цвет акцента, плотность и размер шрифта. Здесь же — «Показать обучение заново», если захотите повторить тур.'
    },
    {
      title: '❓ Справка всегда рядом',
      text: 'Кнопка «❓ Справка» есть в боковом меню и в каждом разделе листа — открывает подсказки по текущему экрану. Готово!'
    }
  ];
}

/** Тур по листу открытого персонажа. */
function _buildSheetSteps() {
  return [
    {
      title: '📋 Лист персонажа',
      text: 'Это лист открытого персонажа. Покажем основные элементы интерфейса. Кнопка «←» в шапке вернёт к списку персонажей.'
    },
    {
      requireTarget: true,
      // ≥1200 — статичный сайдбар; <1024 — нижний tab-nav; 1024–1199 оба
      // display:none (drawer закрыт) — подсвечиваем hamburger, который его открывает.
      target: function () {
        return _tourFirstVisible(['.side-drawer .drawer-nav', '.tab-nav', '#nav-hamburger']);
      },
      title: '🧭 Разделы персонажа',
      text: 'Переключение разделов: Лист, Заклинания, Инвентарь, Бой, Записи, Мир, Журнал.'
    },
    {
      requireTarget: true,
      target: function () {
        return _tourWide()
          ? document.getElementById('rr-btn-d20')
          : document.querySelector('.tab-dice-fab');
      },
      title: '🎲 Броски кубиков',
      text: 'Открывает окно бросков: d20, урон, проверки — с преимуществом и помехой.',
      novice: 'd20 — двадцатигранный кубик, основной в D&D: бросок + модификатор сравнивают со сложностью, которую назначает мастер.'
    },
    {
      requireTarget: true,
      target: function () {
        return _tourWide()
          ? document.querySelector('.rr-hp')
          : document.querySelector('.status-bar');
      },
      title: '❤️ Хиты и защита',
      text: 'Текущие хиты, класс доспеха и уровень всегда на виду; отсюда быстро применяется урон и лечение.',
      novice: 'Хиты (HP) — запас здоровья: на нуле персонаж при смерти. КД (AC) — класс доспеха: чем выше, тем труднее по персонажу попасть.'
    },
    {
      // Без requireTarget: на свежем персонаже #basic-locked-bar скрыт
      // (основа не зафиксирована) и шаг молча выпадал. Фолбэк — «❓ Справка»
      // в сайдбаре (виден на ≥1200); совсем без цели — центрированная карточка.
      target: function () {
        return _tourFirstVisible([
          '#basic-locked-bar .tab-help-btn',
          '.side-drawer .drawer-item[onclick*="openHelp"]'
        ]);
      },
      title: '❓ Справка по разделу',
      text: 'Кнопка «❓ Справка» есть в каждом разделе — открывает подсказки именно по текущему экрану.'
    },
    {
      title: '✅ Готово',
      text: 'Это всё. Подробности — в «❓ Справке» (боковое меню и каждый раздел), повторить обучение можно в «⚙️ Настройки → Показать обучение заново».'
    }
  ];
}

/** Тур по вкладке «Заклинания». */
function _buildSpellsSteps() {
  return [
    {
      title: '✨ Заклинания',
      text: 'Раздел заклинаний: характеристика заклинателя, ячейки и список ваших заклинаний. Листать — «Назад»/«Далее» или стрелками ←/→, закрыть — крестиком или Esc.'
    },
    {
      requireTarget: true,
      target: function () { return document.querySelector('#tab-spells .sc-stat-selector'); },
      title: '🎯 Характеристика заклинателя',
      text: 'Выберите характеристику — Интеллект, Мудрость или Харизму (зависит от класса). От неё считаются СЛ спасброска и бонус атаки заклинаниями.',
      novice: 'СЛ спасброска — насколько трудно цели сопротивляться вашему заклинанию (чем выше, тем лучше). Бонус атаки прибавляется к броску, когда заклинание бьёт прямой атакой.'
    },
    {
      requireTarget: true,
      target: function () {
        var h = document.querySelector('#tab-spells .spell-slots-header');
        return h ? h.closest('.card') : null;
      },
      title: '💎 Ячейки заклинаний',
      text: 'Ромбы по уровням — ваши ячейки. Нажатие отмечает потраченную; счётчик показывает свободные/всего. «🛏️ Длинный отдых» восстанавливает все ячейки.',
      novice: 'Ячейка (слот) — «заряд» для заклинания: чтобы его наложить, тратится ячейка нужного уровня. Восстанавливаются на длинном отдыхе.'
    },
    {
      requireTarget: true,
      target: function () { return document.querySelector('#tab-spells .spell-action-btns'); },
      title: '📖 Мои заклинания',
      text: '«🔍 Найти заклинание» — добавить из встроенной базы с фильтрами по классу и уровню. «✏️ Добавить своё» — вписать собственное заклинание вручную.'
    },
    {
      title: '✅ Готово',
      text: 'Это раздел заклинаний. Повторить тур — кнопкой «🧭 Пройти тур по разделу» в «❓ Справке» этой вкладки.'
    }
  ];
}

/** Тур по вкладке «Инвентарь». */
function _buildInventorySteps() {
  return [
    {
      title: '🎒 Инвентарь',
      text: 'Раздел инвентаря: переноска, рюкзак с предметами и кошель. Листать — «Назад»/«Далее» или стрелками ←/→, закрыть — крестиком или Esc.'
    },
    {
      requireTarget: true,
      target: function () { return document.querySelector('#tab-inventory .inv-slots-card'); },
      title: '⚖️ Слоты и переноска',
      text: 'Сколько вы несёте: «занято / всего» слотов и полоса заполнения. При превышении предела появляется «⚠️ Перегруз».',
      novice: 'Чтобы не считать точный вес каждой вещи, приложение использует слоты: оружие — 1, броня — 3, зелье — ½ и т.д. Всего слотов зависит от Силы.'
    },
    {
      requireTarget: true,
      target: function () {
        var h = document.querySelector('#tab-inventory .inv-backpack-header');
        return h ? h.closest('.card') : null;
      },
      title: '🎒 Рюкзак',
      text: '«+ Добавить» — внести предмет вручную или из базы. «🎒 Надет/Снят» временно снимает рюкзак: вещи внутри не занимают слотов и недоступны. Кнопки-фильтры ниже показывают только нужный тип — оружие, броню, зелья и т.д.'
    },
    {
      requireTarget: true,
      target: function () {
        var h = document.querySelector('#tab-inventory .inv-coins-header');
        return h ? h.closest('.card') : null;
      },
      title: '💰 Кошель',
      text: 'Монеты по достоинствам: медь, серебро, электрум, золото, платина. «Итого» сводит всё к золоту, а «⇄ Разменять» меняет монеты одного вида на другой.',
      novice: 'Курс обмена: 10 медных = 1 серебряная, 10 серебряных = 1 золотая, 10 золотых = 1 платиновая (электрум — ½ золотого).'
    },
    {
      title: '✅ Готово',
      text: 'Это раздел инвентаря. Повторить тур — кнопкой «🧭 Пройти тур по разделу» в «❓ Справке» этой вкладки.'
    }
  ];
}

/** Тур по вкладке «Бой». */
function _buildBattleSteps() {
  return [
    {
      title: '⚔️ Бой',
      text: 'Раздел боя: выбор участников, запуск боя и трекер инициативы по ходам. Листать — «Назад»/«Далее» или стрелками ←/→, закрыть — крестиком или Esc.'
    },
    {
      requireTarget: true,
      target: function () { return document.querySelector('#battle-setup-screen .card'); },
      title: '👥 Выбор участников',
      text: 'Отметьте, кто участвует в бою: ваш персонаж, соратники, NPC и монстры из раздела «Мир». Поиск по имени вверху помогает быстро найти нужного в длинном списке.'
    },
    {
      requireTarget: true,
      target: function () { return document.querySelector('#battle-setup-screen .battle-start-btn'); },
      title: '▶ Начать бой',
      text: 'Запускает бой: приложение бросит инициативу за всех участников и выстроит очередь ходов.',
      novice: 'Инициатива — бросок d20 + ловкость в начале боя: определяет, кто ходит первым. Чем выше результат, тем раньше очередь.'
    },
    {
      title: '🎯 Трекер инициативы',
      text: 'После старта здесь появится очередь ходов: текущий участник подсвечен, кнопками «◀ Назад» / «Следующий ▶» переключаются ходы и раунды, «✕ Завершить» закрывает бой.',
      novice: 'Раунд — один полный круг, когда все участники сходили по разу (примерно 6 секунд игрового времени). Ход — действия одного участника внутри раунда.'
    },
    {
      title: '✅ Готово',
      text: 'Это раздел боя. Повторить тур — кнопкой «🧭 Пройти тур по разделу» в «❓ Справке» этой вкладки.'
    }
  ];
}

/** Тур по вкладке «Записи». */
function _buildNotesSteps() {
  return [
    {
      title: '📝 Записи',
      text: 'Раздел записей: всё о персонаже и мире в одном месте — предыстория, NPC, квесты, локации, сессии и свободные заметки. Листать — «Назад»/«Далее» или стрелками ←/→, закрыть — крестиком или Esc.'
    },
    {
      requireTarget: true,
      target: function () { return document.querySelector('#tab-notes .notes-header'); },
      title: '🔧 Шапка раздела',
      text: '«🔍 Поиск» ищет сразу по всем записям. «+ Запись» добавляет новую запись в текущий раздел. «🎲 всё» перегенерирует текстовые поля персонажа из вариантов билда. «⋯» — экспорт/импорт (.md, .json) и печать/PDF.'
    },
    {
      requireTarget: true,
      // Узкий экран — виден select (на всю ширину), десктоп — пилюли (fit-content).
      // Контейнер #notes-subtabs тянется на всю ширину, потому целимся внутрь,
      // чтобы кольцо обводило сам контрол, а не пустоту справа.
      target: function () {
        var box = document.getElementById('notes-subtabs');
        if (!box) return null;
        var sel = box.querySelector('.notes-subtabs-select');
        if (sel && sel.offsetParent !== null) return sel;
        return box.querySelector('.notes-subtabs-pills') || box;
      },
      title: '🗂️ Разделы',
      text: '«Предыстория» собирает текстовые поля о персонаже: внешность, личность, идеалы, связи, слабости, черты, магпредметы. Остальные вкладки — отдельные записи: NPC, Квесты, Локации, Сессии, Зацепки и Свободно.'
    },
    {
      title: '✅ Готово',
      text: 'Это раздел записей. Повторить тур — кнопкой «🧭 Пройти тур по разделу» в «❓ Справке» этой вкладки.'
    }
  ];
}

/** Тур по вкладке «Мир» (party). */
function _buildPartySteps() {
  return [
    {
      title: '🌍 Мир',
      text: 'Раздел «Мир»: все, кто окружает вашего персонажа — соратники, NPC и монстры, плюс быстрый переход в бой. Листать — «Назад»/«Далее» или стрелками ←/→, закрыть — крестиком или Esc.'
    },
    {
      requireTarget: true,
      // Цель — сама карточка персонажа (.pcard), а не секция с заголовком:
      // на широком десктопе секция-контейнер разрежена (контент слева), и
      // кольцо вокруг неё смотрится пустой рамкой (урок TOUR-4). Pcard плотнее.
      target: function () {
        var c = document.getElementById('my-char-card');
        return (c && c.querySelector('.pcard')) || c;
      },
      title: '🎭 Мой персонаж',
      text: 'Карточка вашего активного персонажа: класс, уровень, текущие ХП, КД и статусы. Данные подтягиваются с листа автоматически — здесь их видно рядом с остальным отрядом.',
      novice: '❤️ — текущие/максимальные хиты, 🛡️ — класс доспеха (насколько трудно по вам попасть). Меняются на вкладке «Бой» и на листе; тут только сводка.'
    },
    {
      requireTarget: true,
      // Цель — компактный блок кнопок (fit-content), а не полноширинная карточка:
      // на десктопе пустая карточка соратников разрежена, кольцо вокруг неё —
      // пустая рамка (урок TOUR-4); кнопки же всегда плотные. Фолбэк — карточка.
      target: function () {
        var l = document.getElementById('allies-list');
        var card = l ? l.closest('.party-section-card') : null;
        return (card && card.querySelector('.party-section-actions')) || card;
      },
      title: '🧑‍🤝‍🧑 Соратники и NPC',
      text: 'Соратник — союзник под вашим контролем; «Персонажи» — это NPC мира (торговцы, квестодатели). «＋ Добавить» создаёт запись вручную, «↓ / ↑» — выгрузка и загрузка списка (.json). У блока «Персонажи» ниже есть ещё «📚 Архетипы» — готовые роли.'
    },
    {
      requireTarget: true,
      // Кнопки блока «Монстры» (плотный fit-content), не полноширинная карточка.
      target: function () {
        var l = document.getElementById('monsters-list');
        var card = l ? l.closest('.party-section-card') : null;
        return (card && card.querySelector('.party-section-actions')) || card;
      },
      title: '👹 Монстры и враги',
      text: 'Два пути завести врага. Убили монстра и попросили у мастера разбор (КД, хиты, особенности) — впишите его вручную через «＋ Добавить». А типового монстра проще взять готовым: «📚 Из SRD» подставит карточку из бестиария — КД, хиты, CR уже заполнены.',
      novice: 'CR (уровень опасности) показывает, насколько монстр силён относительно группы: чем выше, тем опаснее бой.'
    },
    {
      requireTarget: true,
      target: function () { return document.querySelector('#tab-party .battle-start-btn'); },
      title: '⚔️ Перейти к бою',
      text: 'Открывает вкладку «Бой», где можно отметить участников из этого списка и запустить пошаговый трекер инициативы.'
    },
    {
      title: '✅ Готово',
      text: 'Это раздел «Мир». Повторить тур — кнопкой «🧭 Пройти тур по разделу» в «❓ Справке» этой вкладки.'
    }
  ];
}

/** Тур по вкладке «Журнал». */
function _buildJournalSteps() {
  return [
    {
      title: '📖 Журнал',
      text: 'Журнал — дневник приключения: хронология того, что происходило с персонажем и в игре. Листать — «Назад»/«Далее» или стрелками ←/→, закрыть — крестиком или Esc.'
    },
    {
      requireTarget: true,
      // Цель — сама кнопка «＋ Событие» (fit-content), а не полноширинная шапка:
      // .journal-header-row — space-between (заголовок слева, кнопка справа), и на
      // широком экране кольцо вокруг неё обводит пустой зазор посередине (урок TOUR-4/5).
      target: function () { return document.querySelector('#tab-journal .journal-add-btn'); },
      title: '📝 Запись события',
      text: '«＋ Событие» добавляет запись вручную. В окне можно выбрать тип помимо фильтров ниже: ⚔️ бой, 📖 сюжет/НПС, 💎 добыча, 💀 смерть или 📝 заметка — что случилось на сессии, важное решение, к чему вернуться позже.',
      novice: 'Многое журнал пишет сам: повышение уровня, отдых, изменения характеристик и новые черты появляются здесь автоматически — руками добавляют только свои события.'
    },
    {
      requireTarget: true,
      // Кнопки фильтра (fit-content), а не полноширинная полоса: 6 узких кнопок
      // прижаты влево, кольцо вокруг всей полосы обвело бы пустоту справа на
      // десктопе (урок TOUR-4/5). CSS .journal-filter-row сжат до контента.
      target: function () { return document.querySelector('#tab-journal .journal-filter-row'); },
      title: '🔎 Фильтры',
      text: 'Кнопки оставляют в списке только нужный тип записей: 📈 повышения уровня, 🛏️ отдых, ⚡ изменения статов, 🎯 черты или 📝 заметки. «Все» снимает фильтр — там же видны добавленные вручную события без своей кнопки (бой, сюжет, добыча, смерть).'
    },
    {
      title: '✅ Готово',
      text: 'Это раздел «Журнал». Повторить тур — кнопкой «🧭 Пройти тур по разделу» в «❓ Справке» этой вкладки.'
    }
  ];
}
