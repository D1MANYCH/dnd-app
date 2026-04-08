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
function openModal(id) { var m = $(id); if (m) m.classList.add("active"); }
function closeModal(id) { var m = $(id); if (m) m.classList.remove("active"); }
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
// SPELL_DATABASE — объединение встроенной базы (spells.js) и пользовательских добавлений из localStorage
// SPELLS_BASE определён в spells.js и загружается до app.js
var SPELL_DATABASE = (typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.slice() : [];
var CLASS_ICONS_MAP = { wizard:"🧙", druid:"🌿", bard:"🎵", cleric:"✝️", paladin:"🛡️", ranger:"🏹", sorcerer:"🔥", warlock:"👁️", both:"✨" };

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
var skills = [
{name: "Акробатика", stat: "dex"}, {name: "Аркана", stat: "int"}, {name: "Атлетика", stat: "str"},
{name: "Внимательность", stat: "wis"}, {name: "Выживание", stat: "wis"}, {name: "Выступление", stat: "cha"},
{name: "Запугивание", stat: "cha"}, {name: "История", stat: "int"}, {name: "Ловкость рук", stat: "dex"},
{name: "Медицина", stat: "wis"}, {name: "Обман", stat: "cha"}, {name: "Природа", stat: "int"},
{name: "Проницательность", stat: "wis"}, {name: "Расследование", stat: "int"}, {name: "Религия", stat: "int"},
{name: "Скрытность", stat: "dex"}, {name: "Убеждение", stat: "cha"}, {name: "Уход за животными", stat: "wis"}
];

// ============================================
// МИГРАЦИИ СХЕМЫ ПЕРСОНАЖА
// ============================================
function migrateCharacter(char) {
  var v = char.schemaVersion || 0;
  if (v < 1) {
    if (char.alignment    === undefined) char.alignment    = "";
    if (char.size         === undefined) char.size         = "Средний";
    if (char.inspiration  === undefined) char.inspiration  = false;
    if (char.concentration=== undefined) char.concentration= null;
    if (!char.companions)                char.companions   = [];
    if (!char.feats)                     char.feats        = [];
    if (!char.asiUsedLevels)             char.asiUsedLevels= [];
    if (!char.journal)                   char.journal      = [];
    if (!char.party)                     char.party        = { allies:[], monsters:[], npcs:[] };
    if (!char.battle)                    char.battle       = { active:false, participants:[], currentTurn:0 };
    char.schemaVersion = 1;
  }
  if (v < 2) {
    if (char.avatar === undefined) char.avatar = null;
    char.schemaVersion = 2;
  }
  if (v < 3) {
    if (!char.expertiseSkills) char.expertiseSkills = [];
    char.schemaVersion = 3;
  }
  if (v < 4) {
    if (!char.spells) char.spells = {};
    if (!char.spells.prepared) char.spells.prepared = [];
    char.schemaVersion = 4;
  }
  return char;
}

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
  if (extra.length > 0) SPELL_DATABASE = SPELL_DATABASE.concat(extra);
}
if (savedHpHistory) hpHistory = JSON.parse(savedHpHistory);
} catch(e) { console.log("Ошибка загрузки:", e); showToast("Ошибка загрузки данных!", "error"); }
initSaves();
initSkills();
initConditions();
initEffects();
renderCharacterList();
renderWeaponPresets();
updateVersionBlock(false);
};

function saveToLocal() {
try {
localStorage.setItem("dnd_chars", JSON.stringify(characters));
// Сохраняем только заклинания добавленные пользователем (не из базы spells.js)
var baseIds = new Set((typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.map(function(s){return s.id;}) : []);
var userSpells = SPELL_DATABASE.filter(function(s){ return !baseIds.has(s.id); });
localStorage.setItem("dnd_spells", JSON.stringify(userSpells));
localStorage.setItem("dnd_hp_history", JSON.stringify(hpHistory));
} catch(e) { console.log("Ошибка сохранения:", e); showToast("Ошибка сохранения данных!", "error"); }
}
function showScreen(screenName) {
const charactersScreen = $("screen-characters");
const characterScreen = $("screen-character");
const characterTabs = $("character-tabs");
const statusBar = $("status-bar");
const hamburger = $("nav-hamburger");
if (charactersScreen) charactersScreen.classList.add("hidden");
if (characterScreen) characterScreen.classList.add("hidden");
if (characterTabs) characterTabs.classList.add("hidden");
if (statusBar) statusBar.classList.remove("visible");
if (hamburger) hamburger.classList.add("hidden");
if (screenName === "characters") {
if (charactersScreen) charactersScreen.classList.remove("hidden");
closeDrawer();
currentId = null;
updateHeaderTitle();
renderCharacterList();
} else {
if (characterScreen) characterScreen.classList.remove("hidden");
if (characterTabs) characterTabs.classList.remove("hidden");
if (hamburger) hamburger.classList.remove("hidden");
updateHeaderTitle();
updateStatusBar();
}
}
function updateHeaderTitle() {
var avatarEl = $("header-avatar");
var subtitleEl = $("header-subtitle");
if (!currentId) {
  $("header-title").textContent = "Мой Персонаж D&D 5e";
  if (avatarEl) avatarEl.innerHTML = "🎭";
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
  } else {
    avatarEl.innerHTML = char ? getClassIcon(char.class) : "🎭";
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
  try { localStorage.setItem("dnd_last_tab", tabName); } catch(e) {}
  if (tabName === "party")   { openPartyTab(); }
  if (tabName === "battle")  { openBattleTab(); }
  if (tabName === "journal") { renderJournal(); }
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
  if (hamburger) hamburger.classList.remove("hidden");
  if (tabs) tabs.classList.remove("hidden");
}
function hideCharacterNav() {
  var hamburger = $("nav-hamburger");
  var tabs = $("character-tabs");
  if (hamburger) hamburger.classList.add("hidden");
  if (tabs) tabs.classList.add("hidden");
}

// Swipe to open drawer (only when character screen is active)
(function() {
  var touchStartX = 0;
  var touchStartY = 0;
  document.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    var drawer = $("side-drawer");
    var charScreen = $("screen-character");
    // Only work when character screen is visible and a character is loaded
    if (!drawer || !charScreen || charScreen.classList.contains("hidden") || !currentId) return;
    if (dx < -60 && Math.abs(dy) < 80 && !drawer.classList.contains("open")) {
      openDrawer();
    }
    if (dx > 60 && Math.abs(dy) < 80 && drawer.classList.contains("open")) {
      closeDrawer();
    }
  }, { passive: true });
})();

function createNewCharacter() {
// Глубокое копирование дефолтного шаблона — безопасно, без мутации оригинала
const newChar = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
newChar.id = Date.now();
newChar.schemaVersion = (typeof SCHEMA_VERSION !== 'undefined') ? SCHEMA_VERSION : 2;
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
function getClassIcon(cls) {
const icons = {
  "Варвар": "🪓", "Бард": "🎵", "Жрец": "✝️",
  "Друид": "🌿", "Воин": "⚔️", "Монах": "👊",
  "Паладин": "🛡️", "Следопыт": "🏹", "Плут": "🗡️",
  "Чародей": "🔥", "Колдун": "👁️", "Волшебник": "✨"
};
return icons[cls] || "🎭";
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
var data = JSON.stringify({ characters: [char], spells: [] }, null, 2);
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
    ? "<div class=\"empty-list\">📭 Список пуст. Создайте персонажа!</div>"
    : "<div class=\"empty-list\">🔍 Ничего не найдено</div>";
  return;
}
filtered.forEach(function(char) {
const div = document.createElement("div");
div.className = "char-card";
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
    "<div class=\"char-card-sub\">" + escapeHtml(char.class || "Класс не указан") + (char.race ? " · " + escapeHtml(char.race) : "") + (char.subclass ? " · " + escapeHtml(char.subclass) : "") + "</div>" +
  "</div>" +
  "<div class=\"char-card-actions\">" +
    "<button class=\"char-copy-btn\" onclick=\"exportOneCharacter(" + char.id + ", event)\" title=\"Экспорт\">↓</button>" +
    "<button class=\"char-copy-btn\" onclick=\"duplicateCharacter(" + char.id + ", event)\" title=\"Дублировать\">⧉</button>" +
    "<button class=\"char-delete-btn\" onclick=\"event.stopPropagation(); deleteCharacter(" + char.id + ")\">✕</button>" +
  "</div>" +
"</div>" +
"<div class=\"char-card-stats\">" +
  "<span class=\"char-stat-badge\">⭐ " + (char.level || 1) + " ур.</span>" +
  "<span class=\"char-stat-badge-hp\" style=\"color:" + hpColor + "; border-color:" + hpColor + "55; background:" + hpColor + "18;\">❤️ " + hpCurrent + "/" + hpMax + "</span>" +
  "<span class=\"char-stat-badge\">🛡️ " + (char.combat.ac || 10) + "</span>" +
  (conditionsCount > 0 ? "<span class=\"char-stat-badge\" style=\"background:var(--condition-active);border-color:var(--condition-border);\">⚠️ " + conditionsCount + "</span>" : "") +
  (char.alignment ? "<span class=\"char-alignment\">" + escapeHtml(char.alignment) + "</span>" : "") +
  timeAgo +
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
function showConfirmModal(title, text, onConfirm) {
var modal = $("confirm-modal");
var titleEl = $("confirm-modal-title");
var textEl = $("confirm-modal-text");
var confirmBtn = $("confirm-modal-ok");
var cancelBtn = $("confirm-modal-cancel");
if (!modal || !confirmBtn || !cancelBtn) return;
if (titleEl) titleEl.textContent = title;
if (textEl) textEl.textContent = text;
modal.classList.add("active");
var newConfirm = confirmBtn.cloneNode(true);
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
currentId = id;
const char = characters.find(function(c) { return c.id === id; });
if (!char) return;

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
} else {
  BATTLE_DATA = { active: false, participants: [], currentTurn: 0 };
}
const savedSubclass = char.subclass || "";
safeSet("char-name", char.name);
safeSet("char-level", char.level);
safeSet("char-exp", char.exp || 0);
safeSet("char-class", char.class);
updateSubclassOptions();
safeSet("char-subclass", savedSubclass);
safeSet("char-race", char.race);
safeSet("char-background", char.background || "");
safeSet("char-alignment", char.alignment || "");
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
safeSet("tool-proficiencies", char.proficiencies.tools || "");
safeSet("languages", char.proficiencies.languages || "");
safeSet("coin-cp", char.coins.cp);
safeSet("coin-sp", char.coins.sp);
safeSet("coin-ep", char.coins.ep);
safeSet("coin-gp", char.coins.gp);
safeSet("coin-pp", char.coins.pp);
safeSet("char-notes", char.notes || "");
safeSet("char-features", char.features || "");
safeSet("char-appearance", char.appearance || "");
safeSet("magic-items", char.magicItems || "");
safeSet("spell-stat", char.spells.stat || "");
// Sync spell stat button highlight
const _statVal = char.spells.stat || "";
["int","wis","cha"].forEach(function(s){ var b=$("sc-btn-"+s); if(b) b.classList.remove("active"); });
if(_statVal==="ИНТ" && $("sc-btn-int")) $("sc-btn-int").classList.add("active");
if(_statVal==="МУД" && $("sc-btn-wis")) $("sc-btn-wis").classList.add("active");
if(_statVal==="ХАР" && $("sc-btn-cha")) $("sc-btn-cha").classList.add("active");
safeSetChecked("armor-light", false);
safeSetChecked("armor-medium", false);
safeSetChecked("armor-heavy", false);
safeSetChecked("armor-shield", false);
safeSetChecked("weapon-simple", false);
safeSetChecked("weapon-martial", false);
if(char.proficiencies.armor) {
char.proficiencies.armor.forEach(function(p) {
safeSetChecked("armor-" + p, true);
});
}
if(char.proficiencies.weapon) {
char.proficiencies.weapon.forEach(function(p) {
safeSetChecked("weapon-" + p, true);
});
}
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
// Автозаполнение инструментов/языков от предыстории если пусто
if (char.background && typeof BACKGROUND_SKILLS !== "undefined" && BACKGROUND_SKILLS[char.background]) {
  var bgData = BACKGROUND_SKILLS[char.background];
  if (!Array.isArray(bgData)) {
    var toolsEl = $("tool-proficiencies");
    var langEl = $("languages");
    if (toolsEl && !toolsEl.value.trim() && bgData.tools && bgData.tools.length > 0) {
      toolsEl.value = bgData.tools.join(", ");
      if (char.proficiencies) char.proficiencies.tools = toolsEl.value;
    }
    if (langEl && !langEl.value.trim() && bgData.languages > 0) {
      langEl.value = bgData.languages + " доп. язык" + (bgData.languages > 1 ? "а" : "");
      if (char.proficiencies) char.proficiencies.languages = langEl.value;
    }
  }
}
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
// Show race bonuses
setTimeout(onRaceChange, 0);
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
// Re-render party and battle with character-specific data
renderMyChar();
renderAllies();
renderNPCs();
renderMonsters();
renderSheetAvatar();
showScreen("character");
var lastTab = "";
try { lastTab = localStorage.getItem("dnd_last_tab") || "sheet"; } catch(e) { lastTab = "sheet"; }
var tabEl = $("tab-" + lastTab);
if (!tabEl) lastTab = "sheet";
document.querySelectorAll(".tab-content").forEach(function(t) { t.classList.remove("active"); });
document.querySelectorAll(".tab-btn").forEach(function(b) { b.classList.remove("active"); });
var activeTabEl = $("tab-" + lastTab);
if (activeTabEl) activeTabEl.classList.add("active");
document.querySelectorAll(".tab-btn").forEach(function(b) {
  if (b.getAttribute("onclick") && b.getAttribute("onclick").includes("'" + lastTab + "'")) b.classList.add("active");
});
if (lastTab === "party")  setTimeout(openPartyTab, 0);
if (lastTab === "battle") setTimeout(openBattleTab, 0);
}

function exportData() {
const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(characters));
const downloadAnchorNode = document.createElement("a");
downloadAnchorNode.setAttribute("href", dataStr);
downloadAnchorNode.setAttribute("download", "dnd_backup_" + new Date().toISOString().slice(0,10) + ".json");
document.body.appendChild(downloadAnchorNode);
downloadAnchorNode.click();
downloadAnchorNode.remove();
}
function importData(input) {
const file = input?.files?.[0];
if (!file) return;
const reader = new FileReader();
reader.onload = function(e) {
try {
const imported = JSON.parse(e.target.result);
if (Array.isArray(imported)) {
characters = imported;
saveToLocal();
renderCharacterList();
showToast("Данные загружены!", "success");
} else {
showToast("Ошибка: неверный формат файла", "error");
}
} catch (err) {
showToast("Ошибка чтения файла", "error");
}
};
reader.readAsText(file);
}
function exportSpells() {
const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SPELL_DATABASE));
const downloadAnchorNode = document.createElement("a");
downloadAnchorNode.setAttribute("href", dataStr);
downloadAnchorNode.setAttribute("download", "dnd_spells_" + new Date().toISOString().slice(0,10) + ".json");
document.body.appendChild(downloadAnchorNode);
downloadAnchorNode.click();
downloadAnchorNode.remove();
}
function importSpells(input) {
const file = input?.files?.[0];
if (!file) return;
const reader = new FileReader();
reader.onload = function(e) {
try {
const imported = JSON.parse(e.target.result);
if (Array.isArray(imported)) {
SPELL_DATABASE = imported;
saveToLocal();
showToast("Заклинаний загружено: " + imported.length, "success");
} else {
showToast("Ошибка: неверный формат файла", "error");
}
} catch (err) {
showToast("Ошибка чтения файла", "error");
}
};
reader.readAsText(file);
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
if (hpHistory.length === 0) {
list.innerHTML = "<div class=\"hph-empty\">История пуста</div>";
} else {
list.innerHTML = hpHistory.map(function(e) {
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

