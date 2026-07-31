// ============================================================
// app-core.js — Ядро приложения: хелперы, состояние, навигация,
// персонажи, импорт/экспорт, уведомления
// ============================================================

// ── Хелперы ─────────────────────────────────────────────────
/** Короткий алиас для document.getElementById */
function $(id) { return document.getElementById(id); }
/** Текущий персонаж */
function getCurrentChar() { return characters.find(function(c) { return c.id === currentId; }); }
/** Открыть/закрыть простую модалку по id */
function openModal(id) { var m = $(id); if (m) { m.classList.remove("closing"); m.classList.add("active"); } }
/** Дымка v5: закрытие с обратной анимацией ~240ms (класс .closing, см. style.css) */
function closeModal(id) {
  var m = $(id);
  if (!m || !m.classList.contains("active")) return;
  if (m.classList.contains("closing")) return;
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !m.classList.contains("modal")) { m.classList.remove("active"); return; }
  m.classList.add("closing");
  setTimeout(function () { m.classList.remove("active"); m.classList.remove("closing"); }, 240);
}
/** Debounce — откладывает вызов fn на delay мс после последнего вызова */
function debounce(fn, delay) {
  var timer;
  return function() {
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() { fn.apply(null, args); }, delay);
  };
}
/** Отложенное сохранение — не чаще одного раза в 300мс */
var saveToLocalDebounced = debounce(function() { saveToLocal(); }, 300);
/** BUGFIX-9: тегированный логгер для catch-блоков. Тихо в проде, видно при window.__DEBUG = true. */
window.__catchLog = function(tag, e) { if (window.__DEBUG) { try { console.warn('[' + tag + ']', e); } catch (_) {} } };
// SPELL_DATABASE — объединение встроенной базы (spells.js) и пользовательских добавлений из localStorage
// SPELLS_BASE определён в spells.js и загружается до app-core.js
var SPELL_DATABASE = (typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.slice() : [];
var CLASS_ICONS_MAP = { wizard:"🧙", druid:"🌿", bard:"🎵", cleric:"✝️", paladin:"🛡️", ranger:"🏹", sorcerer:"🔥", warlock:"👁️", both:"✨" };

// ── Мультикласс: миграция и синхронизация ──────────────────────
/** Мигрировать старый формат (char.class/level) → char.classes[] */
function migrateToMulticlass(char) {
  if (char.classes && char.classes.length > 0) return;
  char.classes = [];
  if (char.class) {
    char.classes.push({
      class: char.class,
      level: char.level || 1,
      subclass: char.subclass || "",
      hitDie: (typeof CLASS_HIT_DICE !== "undefined" ? CLASS_HIT_DICE[char.class] : 8) || 8
    });
  }
}

/** Синхронизировать char.class/level/subclass из char.classes[] (обратная совместимость) */
function syncClassFields(char) {
  if (!char.classes || !char.classes.length) return;
  char.class = char.classes[0].class;
  char.subclass = char.classes[0].subclass || "";
  char.level = char.classes.reduce(function(s, c) { return s + c.level; }, 0);
}

/** Проверить, является ли персонаж мультиклассовым */
function isMulticlass(char) {
  return char.classes && char.classes.length > 1;
}

/** Получить строковое описание класса: "Воин 5 / Плут 3" */
function getClassLabel(char) {
  if (!char.classes || char.classes.length <= 1) {
    return char.class || "";
  }
  return char.classes.map(function(c) { return c.class + " " + c.level; }).join(" / ");
}

/** Проверить выполнение требований для мультикласса */
function checkMulticlassPrereqs(char, targetClass) {
  if (typeof MULTICLASS_PREREQUISITES === "undefined") return { ok: true, missing: [] };
  // Проверяем требования выхода из текущего класса (основного)
  var missing = [];
  // Проверяем требования входа в новый класс
  var reqs = MULTICLASS_PREREQUISITES[targetClass];
  if (reqs) {
    Object.keys(reqs).forEach(function(stat) {
      var val = char.stats[stat] || 10;
      if (val < reqs[stat]) {
        var names = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
        missing.push((names[stat]||stat) + " " + val + " (нужно " + reqs[stat] + ")");
      }
    });
  }
  // Для Воина: альтернативное требование — dex ≥ 13 вместо str
  if (targetClass === "Воин" && missing.length > 0) {
    if ((char.stats.dex || 10) >= 13) missing = [];
  }
  // Проверяем требования выхода из текущего основного класса
  if (char.class) {
    var exitReqs = MULTICLASS_PREREQUISITES[char.class];
    if (exitReqs) {
      Object.keys(exitReqs).forEach(function(stat) {
        var val = char.stats[stat] || 10;
        if (val < exitReqs[stat]) {
          var names = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
          var msg = (names[stat]||stat) + " " + val + " (нужно " + exitReqs[stat] + " для выхода из " + char.class + ")";
          if (missing.indexOf(msg) === -1) missing.push(msg);
        }
      });
      // Воин — альтернативное требование для выхода тоже
      if (char.class === "Воин" && missing.length > 0) {
        var exitMissing = [];
        Object.keys(exitReqs).forEach(function(stat) {
          if (stat === "str" && (char.stats.dex || 10) >= 13) return;
          var val = char.stats[stat] || 10;
          if (val < exitReqs[stat]) exitMissing.push(stat);
        });
        if (exitMissing.length === 0) missing = missing.filter(function(m) { return m.indexOf("для выхода") === -1; });
      }
    }
  }
  return { ok: missing.length === 0, missing: missing };
}

// Стандартные веса предметов D&D 5e для автозаполнения
var ITEM_WEIGHTS = {
  // Оружие
  "кинжал":1,"нож":1,"дротик":0.25,"праща":0,"болт":0.075,"стрела":0.05,
  "короткий меч":2,"длинный меч":3,"рапира":2,"меч":3,"сабля":3,"тесак":2,
  "боевой топор":4,"топор":4,"секира":7,"алебарда":6,"глефа":6,"копьё":3,
  "пика":18,"трезубец":4,"боевой молот":2,"молот":10,"булава":4,"палица":4,
  "моргенштерн":4,"цеп":2,"боевой посох":4,"посох":4,"дубина":2,"жезл":1,
  "лук":2,"короткий лук":2,"длинный лук":2,"арбалет":5,"ручной арбалет":3,
  "тяжёлый арбалет":18,"духовая трубка":1,
  // Броня
  "стёганый доспех":8,"кожаный доспех":10,"проклёпанная кожа":13,
  "кольчужная рубаха":20,"чешуйчатый доспех":45,"кольчуга":55,
  "нагрудник":20,"полукираса":20,"латный доспех":65,
  "щит":6,"небольшой щит":6,
  // Зелья
  "зелье лечения":0.5,"зелье":0.5,"яд":0.5,"масло":1,
  // Приключенческое снаряжение
  "верёвка":10,"верёвка шёлковая":5,"факел":1,"фонарь":2,"масляный фонарь":2,
  "мешок":0.5,"рюкзак":5,"сундук":25,"мешочек":0.1,
  "отмычки":1,"инструменты взломщика":1,"воровской инструмент":1,
  "компонентный мешочек":2,"фокусировка":0,"аркан":0,"святой символ":1,
  "книга заклинаний":3,"гримуар":3,"свиток":0,"пергамент":0,
  "рация":1,"зеркало":0.5,"лупа":0,"подзорная труба":1,
  "паёк":2,"сухой паёк":2,"вода":5,"бурдюк":1,
};

function autoFillItemWeight() {
  const nameEl = $("new-item-name");
  const weightEl = $("new-item-weight");
  if (!nameEl || !weightEl) return;
  const name = nameEl.value.toLowerCase().trim();
  if (!name || parseFloat(weightEl.value) !== 0) return;
  for (const key in ITEM_WEIGHTS) {
    if (name.includes(key) || key.includes(name)) {
      weightEl.value = ITEM_WEIGHTS[key];
      weightEl.style.borderColor = "var(--accent-color)";
      setTimeout(function(){ weightEl.style.borderColor = ""; }, 1500);
      const hint = $("weight-hint");
      if (hint) { hint.textContent = "✓ автозаполнено"; setTimeout(function(){ hint.textContent=""; }, 2000); }
      return;
    }
  }
}
function setItemQty(n) {
  const el = $("new-item-qty");
  if (el) el.value = n;
}
var characters = [];
var currentId = null;
var currentSpellVersion = "all";
var currentSpellClass = "all";
var currentViewItem = null;
var currentFilterCategory = "all";
var diceHistory = [];
var currentRestType = null;
var hitDiceToSpend = 0;
var hpHistory = [];
var abilities = [
{key: "str", name: "Сила"}, {key: "dex", name: "Ловкость"}, {key: "con", name: "Телосложение"},
{key: "int", name: "Интеллект"}, {key: "wis", name: "Мудрость"}, {key: "cha", name: "Харизма"}
];

window.onload = function() {
try {
const saved = localStorage.getItem("dnd_chars");
const savedSpells = localStorage.getItem("dnd_spells");
const savedHpHistory = localStorage.getItem("dnd_hp_history");
if (saved) characters = JSON.parse(saved).map(migrateCharacter);
if (savedSpells) {
  // Пользовательские заклинания (добавленные через UI) — храним отдельно
  // и объединяем с базой, избегая дублей по id
  var userSpells = JSON.parse(savedSpells);
  var baseIds = new Set(SPELL_DATABASE.map(function(s) { return s.id; }));
  var extra = userSpells.filter(function(s) { return !baseIds.has(s.id); });
  // HB-1: бэкфилл легаси — до этой версии признака «своё» не было, а всё, что
  // пережило фильтр по baseIds, по определению создано пользователем.
  extra.forEach(function(s) { if (s) s.homebrew = true; });
  if (extra.length > 0) SPELL_DATABASE = SPELL_DATABASE.concat(extra);
  _backfillHomebrewFlag(characters, new Set(extra.map(function(s) { return s && s.id; })));
}
if (savedHpHistory) hpHistory = JSON.parse(savedHpHistory);
} catch(e) { console.error("Ошибка загрузки:", e); showToast("Ошибка загрузки данных!", "error"); }
initSaves();
initSkills();
initConditions();
initEffects();
// MENU-8: стартуем на встречающем экране (в разметке он единственный видимый,
// но showScreen ещё и расставляет классы body — от них зависят шапка и сайдбар).
showScreen("home");
renderWeaponPresets();
if (typeof renderDeityDatalist === "function") renderDeityDatalist();
updateVersionBlock(false);
initPersistentStorage();
// DATA-2: авто-снапшот в IndexedDB (app-backup.js), не чаще 1 раза в день
if (typeof initAutoBackup === "function") initAutoBackup();
// E24-0: если есть хоть один 2024-персонаж или дефолт-редакция = 2024 — подгружаем
// данные 2024 (fire-and-forget). Без загрузки 2024-персонаж всё равно рендерится
// (edData падает на фолбэк '2014'), но при бете держим данные наготове.
try {
  var _need24 = (typeof getEdition === "function" && getEdition() === "2024") ||
                (Array.isArray(characters) && characters.some(function(c){ return c && c.edition === "2024"; }));
  if (_need24 && typeof window !== "undefined" && typeof window.ensureEdition2024 === "function") {
    window.ensureEdition2024().catch(function(){ /* фолбэк '2014' в edData */ });
  }
} catch (e) {}
};

function saveToLocal() {
try {
localStorage.setItem("dnd_chars", JSON.stringify(characters));
// Сохраняем только заклинания добавленные пользователем (не из базы spells.js)
var baseIds = new Set((typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.map(function(s){return s.id;}) : []);
var userSpells = SPELL_DATABASE.filter(function(s){ return !baseIds.has(s.id); });
localStorage.setItem("dnd_spells", JSON.stringify(userSpells));
localStorage.setItem("dnd_hp_history", JSON.stringify(hpHistory));
} catch(e) { console.error("Ошибка сохранения:", e); showToast("Ошибка сохранения данных!", "error"); }
}

// DATA-1: persistent storage — просим браузер не вытеснять localStorage/IndexedDB
// при нехватке места на устройстве (иначе данные могут пропасть без ведома пользователя)
let storagePersisted = null; // null = API недоступен / ответ ещё не получен
function initPersistentStorage() {
try {
if (typeof navigator === "undefined" || !navigator.storage || !navigator.storage.persist) {
  if (window.AppLog) AppLog.info("storage", "persistent storage API недоступен");
  updateStorageStatus();
  return;
}
navigator.storage.persisted()
  .then(function(already) { return already || navigator.storage.persist(); })
  .then(function(granted) {
    storagePersisted = !!granted;
    if (window.AppLog) AppLog.info("storage", granted ? "хранилище защищено от вытеснения" : "браузер отказал в persistent storage", { persisted: !!granted });
    updateStorageStatus();
  })
  .catch(function(e) {
    if (window.AppLog) AppLog.warn("storage", "persist() ошибка: " + ((e && e.message) || e));
    updateStorageStatus();
  });
} catch(e) { console.error("Ошибка persistent storage:", e); }
}

function _formatStorageBytes(n) {
var mb = n / (1024 * 1024);
if (mb >= 1024) return (mb / 1024).toFixed(1) + " ГБ";
if (mb >= 100) return Math.round(mb) + " МБ";
if (mb >= 1) return mb.toFixed(1) + " МБ";
return Math.max(1, Math.round(n / 1024)) + " КБ";
}

function updateStorageStatus() {
var el = $("storage-status");
if (!el) return;
var parts = [];
if (storagePersisted === true) parts.push("🔒 защищено от вытеснения");
else if (storagePersisted === false) parts.push("⚠️ не защищено — браузер может стереть при нехватке места");
var done = function() {
  if (!parts.length) { el.hidden = true; return; }
  el.textContent = "Хранилище: " + parts.join(" · ");
  el.hidden = false;
};
if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(function(est) {
    if (est && est.usage != null && est.quota) {
      parts.push("занято " + _formatStorageBytes(est.usage) + " из " + _formatStorageBytes(est.quota));
    }
    done();
  }).catch(done);
} else {
  done();
}
}

// MENU-8: экранов три — встречающее меню, выбор персонажа и лист.
// Глубина нужна двум вещам: history-stack пушит слой только при движении
// ВПЕРЁД, а кнопка «←» возвращает туда, откуда пришли (см. _screenPrev).
var SCREEN_DEPTH = { home: 0, characters: 1, character: 2 };
// Откуда вошли на лист персонажа: "home" (через «Продолжить») или
// "characters" (через «Выбор персонажа»). Не персистится — в рамках сессии.
var _screenPrev = "home";

/**
 * Кнопка «←» в шапке. С листа персонажа возвращает туда, откуда на него
 * зашли; с экрана выбора персонажа — во встречающее меню.
 */
function headerBack() {
  var visible = document.querySelector('div[id^="screen-"]:not(.hidden)');
  if (visible && visible.id === "screen-character") {
    showScreen(_screenPrev === "characters" ? "characters" : "home");
  } else {
    showScreen("home");
  }
}

function showScreen(screenName) {
const homeScreen = $("screen-home");
const charactersScreen = $("screen-characters");
const characterScreen = $("screen-character");
const characterTabs = $("character-tabs");
const statusBar = $("status-bar");
const hamburger = $("nav-hamburger");
const headerBack = $("header-back");

// Запоминаем, откуда уходим на лист, — до переключения экранов.
if (screenName === "character") {
  var visible = document.querySelector('div[id^="screen-"]:not(.hidden)');
  if (visible && visible.id === "screen-characters") _screenPrev = "characters";
  else if (visible && visible.id === "screen-home") _screenPrev = "home";
}

if (homeScreen) homeScreen.classList.add("hidden");
if (charactersScreen) charactersScreen.classList.add("hidden");
if (characterScreen) characterScreen.classList.add("hidden");
if (characterTabs) characterTabs.classList.add("hidden");
if (statusBar) statusBar.classList.remove("visible");
if (hamburger) hamburger.classList.add("hidden");
if (headerBack) headerBack.classList.add("hidden");

// Маркер для CSS: без выбранного персонажа скрываем right-rail и табы
// в сайдбаре (они всё равно ничего не делают), оставляя переключатель темы.
document.body.classList.toggle("no-character", screenName !== "character");
// Встречающий экран занимает всё окно — на нём прячется и шапка.
document.body.classList.toggle("screen-home", screenName === "home");

if (screenName === "home" || screenName === "characters") {
if (screenName === "home" && homeScreen) homeScreen.classList.remove("hidden");
if (screenName === "characters") {
  if (charactersScreen) charactersScreen.classList.remove("hidden");
  if (headerBack) headerBack.classList.remove("hidden");
}
closeDrawer();
currentId = null;
// UI6-1: вне листа нет активного персонажа — возвращаем акцент к ручному
// выбору/золоту (иначе после удаления активного персонажа или выхода
// висел бы классовый цвет предыдущего).
if (typeof _refreshAccent === 'function') _refreshAccent();
updateHeaderTitle();
renderCharacterList();
updateStorageStatus();
// Нет активного персонажа — прячем плавающий чип активных эффектов.
if (typeof renderActiveEffectsFab === "function") renderActiveEffectsFab();
// Возврат к списку/меню всегда скроллит наверх (кнопка «←» и браузерный
// Back через history-stack оба приходят сюда).
try {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  if (charactersScreen) charactersScreen.scrollTop = 0;
} catch(e) { window.__catchLog && window.__catchLog('core:showScreen-scroll', e); }
} else {
if (characterScreen) characterScreen.classList.remove("hidden");
if (characterTabs) characterTabs.classList.remove("hidden");
if (hamburger) hamburger.classList.remove("hidden");
if (headerBack) headerBack.classList.remove("hidden");
updateHeaderTitle();
updateStatusBar();
}
}
function updateHeaderTitle() {
var avatarEl = $("header-avatar");
var subtitleEl = $("header-subtitle");
var AVATAR_FALLBACK_HTML = '<img class="header-avatar-fallback" src="assets/avatar-fallback.webp" alt="">';
if (!currentId) {
  // MENU-8: шапка вне листа видна только на экране выбора персонажа —
  // на встречающем она скрыта (body.screen-home), поэтому заголовок именно про выбор.
  $("header-title").textContent = "Выбор персонажа";
  if (avatarEl) avatarEl.innerHTML = AVATAR_FALLBACK_HTML;
  if (subtitleEl) subtitleEl.textContent = "";
  return;
}
var char = getCurrentChar();
if (char && char.name) {
  $("header-title").textContent = escapeHtml(char.name);
} else {
  $("header-title").textContent = "Мой Персонаж D&D 5e";
}
if (avatarEl) {
  if (char && char.avatar) {
    avatarEl.innerHTML = "<img src=\"" + char.avatar + "\" alt=\"\">";
  } else if (char && char.class) {
    avatarEl.innerHTML = getClassIcon(char.class);
  } else {
    avatarEl.innerHTML = AVATAR_FALLBACK_HTML;
  }
}
if (subtitleEl && char) {
  var parts = [];
  if (char.class) parts.push(char.class);
  if (char.race) parts.push(char.race);
  subtitleEl.textContent = parts.join(" · ");
} else if (subtitleEl) {
  subtitleEl.textContent = "";
}
}
function switchTab(tabName, btnEl) {
  if (window.AppLog) AppLog.action('nav', 'вкладка → ' + tabName);
  // UI-6: тактильная отдача при переключении вкладок
  try { if (navigator.vibrate) navigator.vibrate(10); } catch(e) { window.__catchLog && window.__catchLog('core:switchTab-vibrate', e); }
  document.querySelectorAll(".tab-content").forEach(function(tab) { tab.classList.remove("active"); });
  document.querySelectorAll(".tab-btn").forEach(function(btn) { btn.classList.remove("active"); });
  var tabElement = $("tab-" + tabName);
  if (tabElement) tabElement.classList.add("active");
  // Highlight tab btn
  var activeBtn = btnEl ? btnEl.closest(".tab-btn") : document.querySelector(".tab-btn[data-tab='" + tabName + "']");
  if (activeBtn) activeBtn.classList.add("active");
  // Highlight drawer item
  document.querySelectorAll(".drawer-item").forEach(function(el) { el.classList.remove("drawer-item-active"); });
  var drawerItem = document.querySelector(".drawer-item[data-drawer-tab='" + tabName + "']");
  if (drawerItem) drawerItem.classList.add("drawer-item-active");
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (tabElement) tabElement.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  } catch(e) { window.__catchLog && window.__catchLog('core:switchTab-scroll', e); }
  if (tabName === "party")   { openPartyTab(); }
  if (tabName === "battle")  { openBattleTab(); }
  if (tabName === "journal") { renderJournal(); }
  if (tabName === "notes")   { if (typeof renderNotes === "function") renderNotes(); }
  // FB-2: лист стал видимым → пересчитать line-clamp-детект состояний (scrollHeight теперь валиден)
  if (tabName === "sheet")   { if (typeof detectConditionOverflow === "function") setTimeout(detectConditionOverflow, 50); }
  // TOUR-1: авто-старт интерактивного тура при первом заходе на вкладку (sheet/прочее — no-op).
  if (typeof maybeStartTabTour === "function") maybeStartTabTour(tabName);
}

function openDrawer() {
  var drawer = $("side-drawer");
  var overlay = $("drawer-overlay");
  if (drawer) drawer.classList.remove("hidden");
  if (overlay) overlay.classList.remove("hidden");
  // Sync char name
  var nameEl = $("char-name");
  var drawerName = $("drawer-char-name");
  if (nameEl && drawerName) drawerName.textContent = nameEl.value || "Персонаж";
  setTimeout(function() {
    if (drawer) drawer.classList.add("open");
    if (overlay) overlay.classList.add("open");
  }, 10);
}
function closeDrawer() {
  var drawer = $("side-drawer");
  var overlay = $("drawer-overlay");
  if (drawer) drawer.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
  setTimeout(function() {
    if (drawer) drawer.classList.add("hidden");
    if (overlay) overlay.classList.add("hidden");
  }, 300);
}

// Show hamburger when character is loaded
function showCharacterNav() {
  var hamburger = $("nav-hamburger");
  var tabs = $("character-tabs");
  var back = $("header-back");
  if (hamburger) hamburger.classList.remove("hidden");
  if (tabs) tabs.classList.remove("hidden");
  if (back) back.classList.remove("hidden");
}
function hideCharacterNav() {
  var hamburger = $("nav-hamburger");
  var tabs = $("character-tabs");
  var back = $("header-back");
  if (hamburger) hamburger.classList.add("hidden");
  if (tabs) tabs.classList.add("hidden");
  if (back) back.classList.add("hidden");
}

// UI-6: Свайпы — горизонтальные жесты между вкладками + edge-swipe для drawer.
// Порядок вкладок в нижней панели: sheet → spells → inventory → battle.
(function() {
  var SWIPE_TABS = ["sheet", "spells", "inventory", "battle"];
  var TAB_THRESHOLD = 60;   // px по X для смены вкладки
  var Y_TOLERANCE   = 50;   // px по Y — иначе считаем вертикальным скроллом
  var EDGE_ZONE     = 24;   // px от правого края — зона активации drawer
  var DRAWER_THRESHOLD = 50;

  var startX = 0, startY = 0, startTarget = null, startTime = 0;

  function isInteractive(el) {
    if (!el) return false;
    var tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || tag === "button") return true;
    if (el.isContentEditable) return true;
    var node = el;
    while (node && node !== document.body) {
      if (node.classList) {
        if (node.classList.contains("fs-scale-slider")) return true;
        if (node.classList.contains("modal")) return true;
        if (node.classList.contains("side-drawer")) return true;
      }
      try {
        var cs = window.getComputedStyle(node);
        if ((cs.overflowX === "auto" || cs.overflowX === "scroll") && node.scrollWidth > node.clientWidth + 2) {
          return true;
        }
      } catch(e) { window.__catchLog && window.__catchLog('core:isScrollableX', e); }
      node = node.parentNode;
    }
    return false;
  }

  function currentActiveTab() {
    var btn = document.querySelector(".tab-btn.active");
    return btn ? btn.getAttribute("data-tab") : null;
  }

  document.addEventListener("touchstart", function(e) {
    if (!e.touches || e.touches.length !== 1) { startTarget = null; return; }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTarget = e.target;
    startTime = Date.now();
  }, { passive: true });

  document.addEventListener("touchend", function(e) {
    if (!startTarget) return;
    var endX = e.changedTouches[0].clientX;
    var endY = e.changedTouches[0].clientY;
    var dx = endX - startX;
    var dy = endY - startY;
    var dt = Date.now() - startTime;
    var target = startTarget;
    startTarget = null;

    var drawer = $("side-drawer");
    var charScreen = $("screen-character");
    if (!drawer || !charScreen || charScreen.classList.contains("hidden") || !currentId) return;
    if (Math.abs(dy) > Y_TOLERANCE) return;
    if (Math.abs(dx) < DRAWER_THRESHOLD) return;
    if (dt > 600) return;

    // 1) Edge-swipe от правого края → открыть drawer (свайп влево)
    var vw = window.innerWidth || document.documentElement.clientWidth;
    if (startX >= vw - EDGE_ZONE && dx < -DRAWER_THRESHOLD && !drawer.classList.contains("open")) {
      openDrawer();
      return;
    }
    // 2) Закрыть открытый drawer свайпом вправо
    if (drawer.classList.contains("open") && dx > DRAWER_THRESHOLD) {
      closeDrawer();
      return;
    }
    if (drawer.classList.contains("open")) return;

    // 3) Свайпы между вкладками — только когда касание стартовало внутри .tab-content
    if (isInteractive(target)) return;
    var inTabContent = target.closest && target.closest(".tab-content");
    if (!inTabContent) return;
    if (Math.abs(dx) < TAB_THRESHOLD) return;

    var current = currentActiveTab();
    var idx = SWIPE_TABS.indexOf(current);
    if (idx < 0) return;
    var nextIdx = dx < 0 ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= SWIPE_TABS.length) return;
    switchTab(SWIPE_TABS[nextIdx], null);
  }, { passive: true });
})();

function createNewCharacter() {
// Глубокое копирование дефолтного шаблона — безопасно, без мутации оригинала
const newChar = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
newChar.id = Date.now();
newChar.schemaVersion = (typeof SCHEMA_VERSION !== 'undefined') ? SCHEMA_VERSION : 2;
// E24-0: новый персонаж наследует редакцию по умолчанию с тумблера главной.
// getEdition() возвращает '2024' только если тумблер реально переключён (доступно
// лишь при dnd_e24_beta='1'); иначе всегда '2014'.
newChar.edition = (typeof getEdition === 'function') ? getEdition() : '2014';
// Инициализируем ячейки заклинаний
for (let i = 1; i <= 9; i++) {
  newChar.spells.slots[i] = 0;
  newChar.spells.slotsUsed[i] = 0;
}
characters.push(newChar);
saveToLocal();
loadCharacter(newChar.id);
}
function getClassColor(cls) {
const colors = {
  "Варвар": "#c0392b", "Бард": "#8e44ad", "Жрец": "#f39c12",
  "Друид": "#27ae60", "Воин": "#2980b9", "Монах": "#16a085",
  "Паладин": "#d4ac0d", "Следопыт": "#1e8449", "Плут": "#6c3483",
  "Чародей": "#e74c3c", "Колдун": "#4a235a", "Волшебник": "#1a5276"
};
return colors[cls] || "#c9a227";
}
const CLASS_ICON_SLUGS = {
  "Варвар": "barbarian", "Бард": "bard", "Жрец": "cleric",
  "Друид": "druid", "Воин": "fighter", "Монах": "monk",
  "Паладин": "paladin", "Следопыт": "ranger", "Плут": "rogue",
  "Чародей": "sorcerer", "Колдун": "warlock", "Волшебник": "wizard"
};
function getClassIcon(cls) {
  const slug = CLASS_ICON_SLUGS[cls];
  if (!slug) return '<img class="class-icon-fallback-img" src="assets/avatar-fallback.webp" alt="" aria-hidden="true">';
  return '<img class="class-icon-svg" src="assets/classes/' + slug + '.webp" alt="" aria-hidden="true">';
}
// 'con' переименован в 'constitution.png' — Windows резервирует CON как имя DOS-устройства.
const ABILITY_ICON_FILES = {str:'str', dex:'dex', con:'constitution', int:'int', wis:'wis', cha:'cha'};
function getAbilityIcon(key) {
  var file = ABILITY_ICON_FILES[key];
  if (!file) return '';
  return '<img class="ability-icon-svg" src="assets/abilities/' + file + '.webp" alt="" aria-hidden="true">';
}
// Состояния: id → имя PNG-файла в assets/conditions/. У истощения 6 разных иконок по уровню.
const CONDITION_ICON_SLUGS = {
  blinded:'blinded', charmed:'charmed', deafened:'deafened', frightened:'frightened',
  grappled:'grappled', incapacitated:'incapacitated', invisible:'invisible',
  paralyzed:'paralyzed', petrified:'petrified', poisoned:'poisoned', prone:'prone',
  restrained:'restrained', stunned:'stunned', unconscious:'unconscious',
  exhaustion_1:'exhaustion_1', exhaustion_2:'exhaustion_2', exhaustion_3:'exhaustion_3',
  exhaustion_4:'exhaustion_4', exhaustion_5:'exhaustion_5', exhaustion_6:'exhaustion_6',
  exhaustion:'exhaustion_1'
};
function getConditionIcon(id) {
  var slug = CONDITION_ICON_SLUGS[id];
  if (!slug) return '';
  return '<img class="condition-icon-svg" src="assets/conditions/' + slug + '.webp" alt="" aria-hidden="true">';
}
// Дымка v5: компактная линейная SVG-иконка состояния (чипы/бейджи/трекер боя).
// Карточки состояний на листе оставляют крупные webp-иллюстрации (getConditionIcon).
const DYMKA_CONDITION_META = {
  blinded:       { ico: 'eyeOff', color: 'var(--text-dim)' },
  charmed:       { ico: 'charm',  color: 'var(--charm)' },
  deafened:      { ico: 'x',      color: 'var(--text-dim)' },
  frightened:    { ico: 'ghost',  color: 'var(--magic)' },
  grappled:      { ico: 'lock',   color: 'var(--danger)' },
  incapacitated: { ico: 'alert',  color: 'var(--danger)' },
  invisible:     { ico: 'dashed', color: 'var(--text-mute)' },
  paralyzed:     { ico: 'zapOff', color: 'var(--divin)' },
  petrified:     { ico: 'shield', color: 'var(--text-mute)' },
  poisoned:      { ico: 'flask',  color: 'var(--necro)' },
  prone:         { ico: 'fall',   color: 'var(--danger)' },
  restrained:    { ico: 'lock',   color: 'var(--necro)' },
  stunned:       { ico: 'dizzy',  color: 'var(--magic)' },
  unconscious:   { ico: 'moon',   color: 'var(--text-mute)' },
  exhaustion:    { ico: 'drop',   color: 'var(--danger)' }
};
function getConditionChipIcon(id, size) {
  var key = String(id || '').indexOf('exhaustion') === 0 ? 'exhaustion' : id;
  var meta = DYMKA_CONDITION_META[key];
  if (!meta || typeof dndIcon !== 'function') return getConditionIcon(id);
  return '<span class="cond-ico" style="color:' + meta.color + '">' + dndIcon(meta.ico, size || 15) + '</span>';
}
// Иконка класса для бейджа в заклинании: ключ CLASS_ICONS_MAP → PNG в assets/classes/
// "both" не имеет файла → fallback на emoji-звезду.
const SPELL_CLASS_ICON_SLUGS = {
  wizard: 'wizard', druid: 'druid', bard: 'bard', cleric: 'cleric',
  paladin: 'paladin', ranger: 'ranger', sorcerer: 'sorcerer', warlock: 'warlock'
};
// Русские имена классов для подписей к иконкам заклинаний (тултипы, строка в карточке).
const SPELL_CLASS_RU = {
  wizard: 'Волшебник', druid: 'Друид', bard: 'Бард', cleric: 'Жрец',
  paladin: 'Паладин', ranger: 'Следопыт', sorcerer: 'Чародей', warlock: 'Колдун',
  both: 'Все классы'
};
function getSpellClassIcon(key) {
  var ru = SPELL_CLASS_RU[key] || '';
  var slug = SPELL_CLASS_ICON_SLUGS[key];
  if (!slug) return '<span class="spell-class-emoji"' + (ru ? ' title="' + ru + '"' : '') + ' aria-hidden="true">' + (CLASS_ICONS_MAP[key] || '✨') + '</span>';
  return '<img class="spell-class-icon" src="assets/classes/' + slug + '.webp?v=2" title="' + ru + '" alt="' + ru + '">';
}
// Школы магии: RU → slug файла в assets/schools/*.webp
const SCHOOL_ICON_SLUGS = {
  "ограждение": "abjuration",
  "воплощение": "evocation",
  "вызов": "conjuration",
  "прорицание": "divination",
  "очарование": "enchantment",
  "иллюзия": "illusion",
  "некромантия": "necromancy",
  "преобразование": "transmutation"
};
function getSchoolSlug(school) {
  if (!school) return '';
  return SCHOOL_ICON_SLUGS[String(school).toLowerCase().trim()] || '';
}
function getSchoolIcon(school) {
  var slug = getSchoolSlug(school);
  if (!slug) return '';
  var ru = String(school).trim();
  ru = ru.charAt(0).toUpperCase() + ru.slice(1);
  // Дымка v5: линейная SVG-иконка школы, тонированная цветом из SCHOOL_META
  var meta = (typeof SCHOOL_META !== 'undefined') ? SCHOOL_META[ru] : null;
  if (meta && typeof dndIcon === 'function') {
    return '<span class="school-icon-svg" style="color:' + meta.color + '" title="Школа: ' + ru + '">' + dndIcon(meta.ico, 16) + '</span>';
  }
  return '<img class="school-icon-svg" src="assets/schools/' + slug + '.webp?v=6" title="Школа: ' + ru + '" alt="' + ru + '">';
}
// Удаляет ведущий emoji (и пробел) из имени состояния — для отображения рядом с SVG-иконкой
function stripLeadingEmoji(name) {
  if (!name) return '';
  return String(name).replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}\uFE0F\u200D]+\s*/u, '');
}
function formatTimeAgo(ts) {
if (!ts) return "";
const diff = Date.now() - ts;
const m = Math.floor(diff / 60000);
const h = Math.floor(diff / 3600000);
const d = Math.floor(diff / 86400000);
if (m < 1) return "только что";
if (m < 60) return m + " мин. назад";
if (h < 24) return h + " ч. назад";
if (d < 7) return d + " д. назад";
return new Date(ts).toLocaleDateString("ru-RU", {day:"numeric", month:"short"});
}
var charSearchQuery = "";
var charSortMode = "updated";
function setCharSort(mode) {
charSortMode = mode;
document.querySelectorAll(".sort-btn").forEach(function(b) { b.classList.remove("active"); });
var btn = $("sort-btn-" + mode);
if (btn) btn.classList.add("active");
renderCharacterList();
}
function setCharSearch(val) {
charSearchQuery = val.toLowerCase().trim();
renderCharacterList();
}
function duplicateCharacter(id, event) {
event.stopPropagation();
const orig = characters.find(function(c) { return c.id === id; });
if (!orig) return;
const copy = JSON.parse(JSON.stringify(orig));
copy.id = Date.now();
copy.name = (orig.name || "Без имени") + " (копия)";
copy.updatedAt = Date.now();
characters.push(copy);
saveToLocal();
renderCharacterList();
}
function exportOneCharacter(id, event) {
event.stopPropagation();
var char = characters.find(function(c) { return c.id === id; });
if (!char) return;
// FEAT-1 доработка: срез HP-истории именно этого персонажа.
var charHp = (typeof hpHistory !== 'undefined' && Array.isArray(hpHistory))
  ? hpHistory.filter(function(h) { return h && h.charId === id; })
  : [];
// HB-7: хомбрю-заклинания этого персонажа в конверт — иначе при импорте в чистый
// профиль их не видно в поиске (в mySpells копия едет, но глобальная база пуста).
var charSpells = _collectCharUserSpells(char);
var data = JSON.stringify({
  app: "dnd-sheet",
  appVersion: (typeof APP_VERSION !== 'undefined') ? APP_VERSION : "",
  schemaVersion: (typeof SCHEMA_VERSION !== 'undefined') ? SCHEMA_VERSION : (char.schemaVersion || 0),
  exportedAt: new Date().toISOString(),
  characters: [char],
  hpHistory: charHp,
  userSpells: charSpells
}, null, 2);
var blob = new Blob([data], { type: "application/json" });
var a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = (char.name || "персонаж").replace(/[^a-zA-Zа-яА-Я0-9]/g, "_") + ".json";
a.click();
}
function updateCharCounter() {
var el = $("char-count");
if (!el) return;
var total = characters.length;
var filtered2 = characters.filter(function(c) {
  if (!charSearchQuery) return true;
  return (c.name || "").toLowerCase().includes(charSearchQuery) ||
         (c.class || "").toLowerCase().includes(charSearchQuery) ||
         (c.race || "").toLowerCase().includes(charSearchQuery);
});
if (charSearchQuery && filtered2.length !== total) {
  el.textContent = filtered2.length + " из " + total;
} else {
  el.textContent = total > 0 ? total + " шт." : "";
}
}
var dragSrcId = null;
function onDragStart(e, id) { dragSrcId = id; e.dataTransfer.effectAllowed = "move"; }
function onDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }
function onDrop(e, targetId) {
e.preventDefault();
if (dragSrcId === targetId) return;
var srcIdx = characters.findIndex(function(c) { return c.id === dragSrcId; });
var tgtIdx = characters.findIndex(function(c) { return c.id === targetId; });
if (srcIdx < 0 || tgtIdx < 0) return;
var moved = characters.splice(srcIdx, 1)[0];
characters.splice(tgtIdx, 0, moved);
saveToLocal();
renderCharacterList();
}
function renderCharacterList() {
// MENU-2: плашка героя живёт над списком и обязана обновляться вместе с ним.
// Вызов стоит ПЕРВОЙ строкой намеренно: ниже два ранних return (нет контейнера
// и пустая выборка), а плашке рисоваться нужно и в этих случаях.
// От лишних перерисовок (например, на каждый символ в поиске) защищает
// сигнатура внутри самой renderHomeHero.
if (typeof renderHomeHero === "function") renderHomeHero();
const list = $("character-list");
if (!list) return;
list.innerHTML = "";
updateCharCounter();
var filtered = characters.filter(function(c) {
  if (!charSearchQuery) return true;
  return (c.name || "").toLowerCase().includes(charSearchQuery) ||
         (c.class || "").toLowerCase().includes(charSearchQuery) ||
         (c.race || "").toLowerCase().includes(charSearchQuery);
});
filtered = filtered.slice().sort(function(a, b) {
  if (charSortMode === "name") return (a.name || "").localeCompare(b.name || "", "ru");
  if (charSortMode === "level") return (b.level || 1) - (a.level || 1);
  if (charSortMode === "class") return (a.class || "").localeCompare(b.class || "", "ru");
  return (b.updatedAt || b.id) - (a.updatedAt || a.id);
});
if (filtered.length === 0) {
  list.innerHTML = characters.length === 0
    ? "<div class=\"empty-list\">" + dndIcoHtml("inbox", 22) + " Список пуст. Создайте персонажа!</div>"
    : "<div class=\"empty-list\">" + dndIcoHtml("search", 22) + " Ничего не найдено</div>";
  return;
}
filtered.forEach(function(char, _idx) {
const div = document.createElement("div");
div.className = "char-card rise";
div.style.setProperty("--i", Math.min(_idx, 10)); // Дымка v5: stagger-появление (кап 10)
div.draggable = true;
div.addEventListener("dragstart", function(e) { onDragStart(e, char.id); div.style.opacity="0.5"; });
div.addEventListener("dragend", function() { div.style.opacity="1"; });
div.addEventListener("dragover", onDragOver);
div.addEventListener("drop", function(e) { onDrop(e, char.id); });
div.onclick = function() { loadCharacter(char.id); };
const conditionsCount = (char.conditions ? char.conditions.length : 0) + (char.effects ? char.effects.length : 0);
const hpCurrent = char.combat.hpCurrent || 0;
const hpMax = char.combat.hpMax || 0;
const hpPercent = hpMax > 0 ? Math.min(100, Math.round((hpCurrent / hpMax) * 100)) : 100;
const hpColor = hpPercent > 60 ? "#4da843" : hpPercent > 30 ? "#e67e22" : "#e74c3c";
const classColor = getClassColor(char.class);
const classIcon = getClassIcon(char.class);
const timeAgo = char.updatedAt ? "<span class=\"char-time-ago\">" + formatTimeAgo(char.updatedAt) + "</span>" : "";
div.style.borderLeftColor = classColor;
div.innerHTML = "<div class=\"char-card-header\">" +
  (char.avatar
    ? "<div class=\"char-card-class-icon char-card-avatar\" style=\"background:" + classColor + "22;\"><img src=\"" + char.avatar + "\" alt=\"\"></div>"
    : "<div class=\"char-card-class-icon\" style=\"background:" + classColor + "22;\">" + classIcon + "</div>") +
  "<div class=\"char-card-title\">" +
    "<h4 class=\"char-card-name\">" + escapeHtml(char.name || "Без имени") + "</h4>" +
    "<div class=\"char-card-sub\">" + escapeHtml((char.classes && char.classes.length > 1 ? getClassLabel(char) : char.class) || "Класс не указан") + (char.race ? " · " + escapeHtml(char.race) : "") + (char.subclass && (!char.classes || char.classes.length <= 1) ? " · " + escapeHtml(char.subclass) : "") + "</div>" +
    (char.background ? "<div class=\"char-card-bg\">" + dndIcoHtml("scroll", 12) + " " + escapeHtml(char.background) + "</div>" : "") +
  "</div>" +
"</div>" +
"<div class=\"char-card-stats\">" +
  "<span class=\"char-stat-badge\">" + dndIcoHtml("star", 12) + " " + (char.level || 1) + " ур.</span>" +
  (char.edition === "2024" ? "<span class=\"char-stat-badge char-edition-tag\" title=\"Редакция правил 2024\">2024</span>" : "") +
  "<span class=\"char-stat-badge-hp\" style=\"color:" + hpColor + "; border-color:" + hpColor + "55; background:" + hpColor + "18;\">" + dndIcoHtml("heart", 12) + " " + hpCurrent + "/" + hpMax + "</span>" +
  "<span class=\"char-stat-badge\">" + dndIcoHtml("shield", 12) + " " + (char.combat.ac || 10) + "</span>" +
  (conditionsCount > 0 ? "<span class=\"char-stat-badge\" style=\"background:var(--condition-active);border-color:var(--condition-border);\">" + dndIcoHtml("alert", 12) + " " + conditionsCount + "</span>" : "") +
  "<span class=\"char-alignment" + (char.alignment ? "" : " char-alignment-empty") + "\">" + escapeHtml(char.alignment || "Мировоззрение не выбрано") + "</span>" +
  timeAgo +
"</div>" +
"<div class=\"char-card-actions\">" +
  "<button class=\"char-copy-btn\" onclick=\"exportOneCharacter(" + char.id + ", event)\" title=\"Экспорт JSON\">↓</button>" +
  "<button class=\"char-copy-btn\" onclick=\"exportCharacterPDF(" + char.id + ", event)\" title=\"Экспорт PDF\">" + dndIcoHtml("file", 14) + "</button>" +
  "<button class=\"char-copy-btn\" onclick=\"duplicateCharacter(" + char.id + ", event)\" title=\"Дублировать\">⧉</button>" +
  "<button class=\"char-delete-btn\" onclick=\"event.stopPropagation(); deleteCharacter(" + char.id + ")\">✕</button>" +
"</div>";
list.appendChild(div);
});
}
function deleteCharacter(id) {
var char = characters.find(function(c) { return c.id === id; });
var name = char ? (char.name || "этого персонажа") : "этого персонажа";
showConfirmModal(
  "Удалить персонажа?",
  "«" + name + "» будет удалён без возможности восстановления.",
  function() {
    characters = characters.filter(function(c) { return c.id !== id; });
    saveToLocal();
    renderCharacterList();
  }
);
}
function showConfirmModal(title, text, onConfirm, confirmLabel, opts) {
var modal = $("confirm-modal");
var titleEl = $("confirm-modal-title");
var textEl = $("confirm-modal-text");
var confirmBtn = $("confirm-modal-ok");
var cancelBtn = $("confirm-modal-cancel");
if (!modal || !confirmBtn || !cancelBtn) return;
if (titleEl) titleEl.textContent = title;
if (textEl) textEl.textContent = text;
// Модалка общая с удалениями: по умолчанию деструктивный «🗑️ Удалить».
// Иконку и стиль OK-кнопки сбрасываем на каждый показ, чтобы не-деструктивные
// вызовы (4-й арг confirmLabel + opts.danger/icon, напр. FB-1 «Разблокировать»)
// не «протекали» в последующие.
var iconEl = modal.querySelector(".confirm-modal-icon");
if (iconEl) iconEl.innerHTML = dndIcoHtml((opts && opts.icon) || "trash", 28);
modal.classList.add("active");
var newConfirm = confirmBtn.cloneNode(true);
newConfirm.textContent = confirmLabel || "Удалить";
newConfirm.classList.toggle("confirm-btn-ok--safe", !!(opts && opts.danger === false));
confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
var newCancel = cancelBtn.cloneNode(true);
cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
$("confirm-modal-ok").addEventListener("click", function() {
  modal.classList.remove("active");
  onConfirm();
});
$("confirm-modal-cancel").addEventListener("click", function() {
  modal.classList.remove("active");
});
modal.addEventListener("click", function(e) {
  if (e.target === modal) modal.classList.remove("active");
}, { once: true });
}
function safeSet(id, value) {
const el = $(id);
if (el) el.value = value;
}
function safeSetChecked(id, checked) {
const el = $(id);
if (el) el.checked = checked;
}

// ============================================
// 🔧 ИСПРАВЛЕНИЕ: Подкласс сохраняется + hpCurrent как число
// ============================================
function loadCharacter(id) {
if (window.AppLog) AppLog.action('character', 'загрузка персонажа', { id: id });
// BUGFIX-8: чистим pending-таймеры из других модулей, чтобы они не «дострелили»
// в контексте нового персонажа (notes-поиск, индикатор сохранения, ритуал).
try {
  if (typeof window !== 'undefined') {
    if (window._notesSearchTimer) { clearTimeout(window._notesSearchTimer); window._notesSearchTimer = null; }
    if (window._notesSaveTimer)   { clearTimeout(window._notesSaveTimer);   window._notesSaveTimer   = null; }
    if (window._ritualTimer) {
      clearInterval(window._ritualTimer);
      window._ritualTimer = null;
      var _rit = (typeof document !== 'undefined') ? document.getElementById('status-ritual') : null;
      if (_rit && _rit.classList) _rit.classList.add('hidden');
    }
  }
} catch (e) { if (typeof console !== 'undefined') console.error('[loadCharacter] clear-timers:', e); }
currentId = id;
const char = characters.find(function(c) { return c.id === id; });
if (!char) return;
// UI6-1: акцент следует за классом загружаемого персонажа (авто-режим).
// Раньше переключение персонажей оставляло акцент от предыдущего —
// _refreshAccent звался только onchange класса и на DOMContentLoaded.
if (typeof _refreshAccent === 'function') _refreshAccent();

// Load per-character party data
if (char.party) {
  PARTY_DATA = char.party;
  if (!PARTY_DATA.allies)   PARTY_DATA.allies   = [];
  if (!PARTY_DATA.monsters) PARTY_DATA.monsters = [];
  if (!PARTY_DATA.npcs)     PARTY_DATA.npcs     = [];
} else {
  PARTY_DATA = { allies: [], monsters: [], npcs: [] };
}

// Load per-character battle data
if (char.battle) {
  BATTLE_DATA = char.battle;
  // CAST-2: сохранения до появления счётчика раундов
  if (BATTLE_DATA.round == null) BATTLE_DATA.round = 1;
} else {
  BATTLE_DATA = { active: false, participants: [], currentTurn: 0, round: 1 };
}
// Миграция к мультиклассу
migrateToMulticlass(char);
const savedSubclass = char.subclass || "";
safeSet("char-name", char.name);
safeSet("char-level", char.level);
safeSet("char-exp", char.exp || 0);
safeSet("char-class", char.class);
updateSubclassOptions();
safeSet("char-subclass", savedSubclass);
safeSet("char-race", char.race);
safeSet("char-background", char.background || "");
if (typeof renderBuildBadge === "function") renderBuildBadge();
if (typeof renderEditionBadge === "function") renderEditionBadge();
safeSet("char-alignment", char.alignment || "");
safeSet("char-deity", char.deity || "");
safeSet("char-size", char.size || "Средний");
safeSet("char-speed", char.speed || "30 фт");
safeSet("val-str", char.stats.str);
safeSet("val-dex", char.stats.dex);
safeSet("val-con", char.stats.con);
safeSet("val-int", char.stats.int);
safeSet("val-wis", char.stats.wis);
safeSet("val-cha", char.stats.cha);
safeSet("combat-ac", char.combat.ac);
safeSet("hp-max", char.combat.hpMax);
safeSet("hp-current", char.combat.hpCurrent);
safeSet("hp-temp", char.combat.hpTemp);
safeSet("hp-dice", char.combat.hpDice);
safeSet("hp-dice-spent", char.combat.hpDiceSpent || 0);
safeSet("combat-speed", char.combat.speed || "30 фт");
// Языки и инструменты рендерятся через renderLanguages()/renderTools() ниже
safeSet("coin-cp", char.coins.cp);
safeSet("coin-sp", char.coins.sp);
safeSet("coin-ep", char.coins.ep);
safeSet("coin-gp", char.coins.gp);
safeSet("coin-pp", char.coins.pp);
safeSet("spell-stat", char.spells.stat || "");
// Sync spell stat button highlight
const _statVal = char.spells.stat || "";
["int","wis","cha"].forEach(function(s){ var b=$("sc-btn-"+s); if(b) b.classList.remove("active"); });
if(_statVal==="ИНТ" && $("sc-btn-int")) $("sc-btn-int").classList.add("active");
if(_statVal==="МУД" && $("sc-btn-wis")) $("sc-btn-wis").classList.add("active");
if(_statVal==="ХАР" && $("sc-btn-cha")) $("sc-btn-cha").classList.add("active");
// Доспехи и оружие рендерятся через renderArmorProf()/renderWeaponProf() ниже
if(char.saves) {
Object.keys(char.saves).forEach(function(key) {
safeSetChecked("save-prof-" + key, char.saves[key]);
});
}
if(char.skills) {
Object.keys(char.skills).forEach(function(key) {
safeSetChecked("skill-prof-" + key, char.skills[key]);
});
}
calcStats();
loadExpertise();
// Рендер языков и инструментов (категории + источники)
if (typeof renderLanguages === "function") renderLanguages();
if (typeof renderTools === "function") renderTools();
if (typeof renderArmorProf === "function") renderArmorProf();
if (typeof renderWeaponProf === "function") renderWeaponProf();
calcCoinWeight();
calcSpellStats();
recalculateHP();
loadConditions();
loadEffects();
updateClassFeatures();
renderClassResources();
// Restore armor select
var armorId = char.combat.armorId || "none";
safeSet("char-armor", armorId);
safeSetChecked("char-shield", char.combat.hasShield || false);
if (armorId !== "custom") { setTimeout(onArmorChange, 0); }
calculateAC();
// Restore HP max manual field
var hpMaxEl = $("hp-max-manual");
if (hpMaxEl) hpMaxEl.value = char.combat.hpMax || "";
// Show race bonuses + расовые доп. выборы
setTimeout(function() {
  onRaceChange();
  if (typeof renderRaceExtras === "function") renderRaceExtras();
  if (typeof renderBackgroundFeature === "function") renderBackgroundFeature(); // FIN-4: умение предыстории
}, 0);
// Обновить состояние селектора подкласса (с учётом текущего уровня)
setTimeout(updateSubclassOptions, 0);
// Применить блокировку основной информации (мастер создания)
setTimeout(function() { if (typeof applyBasicLockUI === "function") applyBasicLockUI(); }, 0);
renderWeapons();
updateAllStatDisplays();
renderSpellSlots();
renderMySpells();
renderInventory();
updateCoinTotal();
updateSlotsDisplay();
updateStatusBar();
updateConcentrationDisplay();
updateHPDisplay();
loadDeathSaves();
renderCompanions();
renderJournal();
renderTakenFeats();
renderResistances();
// Re-render party and battle with character-specific data
renderMyChar();
renderAllies();
renderNPCs();
renderMonsters();
renderSheetAvatar();
if (typeof updateLevelDownVisibility === 'function') updateLevelDownVisibility();
showScreen("character");
// Вход в персонажа всегда открывает «Лист персонажа». switchTab()
// централизованно сбрасывает .active у tab-content, кнопок нижнего
// таб-бара И пунктов сайдбара/drawer (.drawer-item-active), плюс
// скроллит наверх. Раньше тут была ручная копия логики, которая не
// трогала .drawer-item → на desktop/tablet сайдбар подсвечивал прошлую
// вкладку (напр. «Заклинания»), хотя контент показывал лист персонажа.
try { localStorage.removeItem("dnd_last_tab"); } catch(e) { window.__catchLog && window.__catchLog('core:loadCharacter-clearLastTab', e); }
switchTab("sheet");
// HELP-4: первый вход в любого персонажа запускает тур по листу (если ещё не пройден).
if (typeof maybeStartSheetTour === 'function') maybeStartSheetTour();
}


// ============================================================
// УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ (замена alert)
// type: 'success' | 'error' | 'warn' | 'info'
// ============================================================
function showToast(msg, type) {
  var container = $("hp-toast-container");
  if (!container) return;
  var t = type || "info";
  var toast = document.createElement("div");
  toast.className = "hp-toast app-toast app-toast-" + t;
  var icons = { success:"✅", error:"❌", info:"ℹ️", warn:"⚠️" };
  toast.innerHTML = "<span style='margin-right:6px'>" + (icons[t] || "ℹ️") + "</span><span>" + escapeHtml(String(msg)) + "</span>";
  container.appendChild(toast);
  toast._fadeTimer   = setTimeout(function() { toast.classList.add("hp-toast-fade"); }, 2200);
  toast._removeTimer = setTimeout(function() { if (toast.parentNode) toast.remove(); }, 2700);
}

function openHPHistory() {
const modal = $("hp-history-modal");
if (!modal) return;
const list = $("hp-history-list");
if (!list) return;
// История только текущего персонажа. Унаследованные записи без charId
// (созданы до v3.15.3) показываем как общие — их немного и они быстро
// вытесняются (глобальный лимит лога — 30).
var rows = hpHistory.filter(function(e) {
  return e && (e.charId === currentId || e.charId == null);
});
if (rows.length === 0) {
list.innerHTML = "<div class=\"hph-empty\">История пуста</div>";
} else {
list.innerHTML = rows.map(function(e) {
const cls = e.delta > 0 ? "hph-heal" : "hph-dmg";
const sign = e.delta > 0 ? "+" : "";
return "<div class=\"hph-row\">" +
"<span class=\"hph-time\">" + e.time + "</span>" +
"<span class=\"hph-source\">" + escapeHtml(e.source) + "</span>" +
"<span class=\"hph-nums\">" + e.from + " → " + e.to + "</span>" +
"<span class=\"hph-delta " + cls + "\">" + sign + e.delta + "</span>" +
"</div>";
}).join("");
}
modal.classList.add("active");
}

function closeHPHistory() {
const modal = $("hp-history-modal");
if (modal) modal.classList.remove("active");
}

// ── Блок статуса версии ──
function updateVersionBlock(hasUpdate, worker) {
  if (hasUpdate && worker) window._swUpdateWorker = worker;
  if (!hasUpdate && window._swUpdateWorker) { hasUpdate = true; worker = window._swUpdateWorker; }
  var row = $('app-version-row');
  var badge = $('app-version-badge');
  var status = $('app-version-status');
  var ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '?';
  if (!row || !badge || !status) return;
  badge.textContent = 'v' + ver;
  if (hasUpdate) {
    row.classList.add('has-update');
    var latest = (typeof APP_CHANGELOG !== 'undefined' && APP_CHANGELOG.length > 0) ? APP_CHANGELOG[0] : null;
    var count = latest ? latest.changes.length : 0;
    status.innerHTML = 'Доступно обновление' + (count ? ' (' + count + ' изменений)' : '') + ' <button class="app-version-update-btn" id="version-install-btn">Установить</button>';
    var btn = $('version-install-btn');
    if (btn && worker) {
      btn.addEventListener('click', function() {
        btn.textContent = 'Обновляем...';
        btn.disabled = true;
        worker.postMessage({ type: 'SKIP_WAITING' });
      });
    }
  } else {
    row.classList.remove('has-update');
    status.innerHTML = '<span class="version-ok">Актуальная версия ✓</span>';
  }
}

