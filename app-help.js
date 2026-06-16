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
    '<div class="tour-ring" id="tour-ring"></div>' +
    '<div id="tour-coach" class="tour-coach" role="dialog" aria-modal="true" aria-live="polite">' +
      '<button type="button" class="tour-x" id="tour-x" aria-label="Пропустить тур">&times;</button>' +
      '<div class="tour-coach-title" id="tour-coach-title"></div>' +
      '<div class="tour-coach-text" id="tour-coach-text"></div>' +
      '<div class="tour-coach-foot">' +
        '<span class="tour-count" id="tour-count"></span>' +
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
    startSheetTour();
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
  notes:     { flag: HELP_FLAG_NOTES_SEEN,     build: _buildNotesSteps }
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
    setHelpFlag(entry.flag, '1');
    startTour(entry.build(), tab);
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
function _showTourStep() {
  if (!_tour) return;
  var step = _tour.steps[_tour.i];
  var titleEl = document.getElementById('tour-coach-title');
  var textEl = document.getElementById('tour-coach-text');
  var countEl = document.getElementById('tour-count');
  var prevBtn = document.getElementById('tour-prev');
  var nextBtn = document.getElementById('tour-next');
  if (titleEl) titleEl.textContent = step.title || '';
  if (textEl) {
    var body = step.text || '';
    // novice → добавляем пояснение терминов (если у шага оно есть).
    if (getHelpFlag(HELP_FLAG_LEVEL) === 'novice' && step.novice) {
      body += (body ? '\n\n' : '') + step.novice;
    }
    textEl.textContent = body;
  }
  if (countEl) countEl.textContent = (_tour.i + 1) + ' / ' + _tour.steps.length;
  if (prevBtn) prevBtn.disabled = (_tour.i === 0);
  if (nextBtn) nextBtn.textContent = (_tour.i === _tour.steps.length - 1) ? 'Готово' : 'Далее';
  _layoutTour();
}

/** Задать прямоугольник элементу (px), отрицательные размеры → 0. */
function _setBox(el, left, top, width, height) {
  if (!el) return;
  el.style.left = Math.round(left) + 'px';
  el.style.top = Math.round(top) + 'px';
  el.style.width = Math.max(0, Math.round(width)) + 'px';
  el.style.height = Math.max(0, Math.round(height)) + 'px';
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
    el.scrollIntoView({ block: 'center', inline: 'nearest' });
    var r = el.getBoundingClientRect();
    var p = _tourPad;
    var hT = Math.max(0, r.top - p), hL = Math.max(0, r.left - p);
    var hR = Math.min(vw, r.right + p), hB = Math.min(vh, r.bottom + p);
    // 4 панели образуют рамку, оставляя целевой rect незакрытым (подсвеченным).
    _setBox(mTop, 0, 0, vw, hT);
    _setBox(mBottom, 0, hB, vw, vh - hB);
    _setBox(mLeft, 0, hT, hL, hB - hT);
    _setBox(mRight, hR, hT, vw - hR, hB - hT);
    ring.style.display = 'block';
    _setBox(ring, hL, hT, hR - hL, hB - hT);
    coach.classList.remove('tour-coach-centered');
    coach.style.display = 'block';
    var cw = coach.offsetWidth, ch = coach.offsetHeight;
    var top;
    if (r.bottom + margin + ch <= vh) top = r.bottom + margin;        // под целью
    else if (r.top - margin - ch >= 0) top = r.top - margin - ch;     // над целью
    else top = (vh - ch) / 2;                                         // не влезает — по центру вертикали
    var left = r.left + r.width / 2 - cw / 2;
    left = Math.max(margin, Math.min(left, vw - cw - margin));
    top = Math.max(margin, Math.min(top, vh - ch - margin));
    coach.style.top = top + 'px';
    coach.style.left = left + 'px';
  } else {
    // Нет цели → одна панель на весь экран + карточка по центру.
    _setBox(mTop, 0, 0, vw, vh);
    _setBox(mRight, 0, 0, 0, 0);
    _setBox(mBottom, 0, 0, 0, 0);
    _setBox(mLeft, 0, 0, 0, 0);
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
      target: function () {
        return _tourWide()
          ? document.querySelector('.side-drawer .drawer-nav')
          : document.querySelector('.tab-nav');
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
      requireTarget: true,
      target: function () { return document.querySelector('#basic-locked-bar .tab-help-btn'); },
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
