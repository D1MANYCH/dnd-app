// ============================================================
// app-spells.js — Управление заклинаниями: слоты, поиск,
// добавление/удаление, отображение заклинаний
// ============================================================

function renderSpellSlots() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const container = $("spell-slots-visual");
if (!container) return;
container.innerHTML = "";
var isWarlock = char.class === "Колдун";
for(let i=1; i<=9; i++) {
const total = char.spells.slots[i] || 0;
const used = char.spells.slotsUsed[i] || 0;
const free = total - used;
const row = document.createElement("div");
row.className = "spell-slot-row" + (total === 0 ? " spell-slot-empty" : "");
var pactBadge = (isWarlock && total > 0) ? '<span class="ssl-pact">ПАКТ</span>' : '';
var diamHtml = '<div class="ssl-diamonds">';
if (total === 0) {
  diamHtml += '<span class="ssl-none">нет ячеек</span>';
} else {
  for(let j=0; j<total; j++) {
    var cls = j < used ? " used" : "";
    diamHtml += '<div class="spell-diamond' + cls + '" data-level="' + i + '" data-idx="' + j + '" onclick="toggleSpellSlot(' + i + ',' + j + ')"></div>';
  }
}
diamHtml += '</div>';
row.innerHTML =
  '<div class="ssl-label"><span class="ssl-lvl">' + i + '</span><span class="ssl-ur">ур.</span>' + pactBadge + '</div>' +
  diamHtml +
  '<div class="ssl-counter"><span class="ssl-free' + (free === 0 && total > 0 ? ' ssl-exhausted' : '') + '">' + free + '</span><span class="ssl-sep">/</span><span class="ssl-total">' + total + '</span></div>' +
  '<div class="ssl-controls"><button class="ssl-btn" onclick="adjustSpellSlots(' + i + ',-1)">−</button><button class="ssl-btn" onclick="adjustSpellSlots(' + i + ',1)">+</button></div>';
container.appendChild(row);
}
}
function updateSpellSlots(level, value) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
char.spells.slots[level] = parseInt(value) || 0;
if (char.spells.slotsUsed[level] > char.spells.slots[level]) {
char.spells.slotsUsed[level] = char.spells.slots[level];
}
saveToLocal();
renderSpellSlots();
}
function toggleSpellSlot(level, index) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
if (!char.spells.slotsUsed[level]) char.spells.slotsUsed[level] = 0;
if (index < char.spells.slotsUsed[level]) char.spells.slotsUsed[level] = index;
else char.spells.slotsUsed[level] = index + 1;
saveToLocal();
renderSpellSlots();
}
function adjustSpellSlots(level, delta) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const input = $('slots-' + level + '-total');
let current = input ? parseInt(input.value) : (char.spells.slots[level] || 0);
if (isNaN(current)) current = char.spells.slots[level] || 0;
let newValue = current + delta;
if (newValue < 0) newValue = 0;
if (newValue > 10) newValue = 10;
char.spells.slots[level] = newValue;
if (char.spells.slotsUsed[level] > newValue) {
char.spells.slotsUsed[level] = newValue;
}
saveToLocal();
renderSpellSlots();
}
function restoreAllSlots() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
for(let i=1; i<=9; i++) { char.spells.slotsUsed[i] = 0; }
saveToLocal();
renderSpellSlots();
showToast("Ячейки заклинаний восстановлены!", "success");
}
function setSpellVersion(version) {
currentSpellVersion = version;
document.querySelectorAll(".version-btn").forEach(function(btn) { btn.classList.remove("active"); });
if(version === "all") $("btn-ver-all")?.classList.add("active");
if(version === "PH14") $("btn-ver-ph14")?.classList.add("active");
if(version === "PH24") $("btn-ver-ph24")?.classList.add("active");
renderSpellSearch();
}
function setSpellClass(cls) {
currentSpellClass = cls;
document.querySelectorAll("#spell-search-modal .version-btn").forEach(function(btn) { btn.classList.remove("active"); });
var btnId = "btn-class-" + (cls === "all" ? "all" : cls);
var btn = $(btnId);
if (btn) btn.classList.add("active");
renderSpellSearch();
}
function openSpellSearch() {
const modal = $("spell-search-modal");
if (modal) modal.classList.add("active");
safeSet("spell-search-input", "");
safeSet("spell-search-level", "");
renderSpellSearch();
}
function closeSpellSearch() {
const modal = $("spell-search-modal");
if (modal) modal.classList.remove("active");
}
function openAddSpellForm() {
const modal = $("add-spell-modal");
if (modal) modal.classList.add("active");
safeSet("new-spell-name", "");
safeSet("new-spell-desc", "");
safeSet("new-spell-higher", "");
}
function closeAddSpellForm() {
const modal = $("add-spell-modal");
if (modal) modal.classList.remove("active");
}
function submitNewSpell() {
const name = $("new-spell-name")?.value?.trim() || "";
const desc = $("new-spell-desc")?.value?.trim() || "";
if (!name || !desc) { showToast("Название и описание обязательны!", "warn"); return; }
const newSpell = {
id: Date.now(),
name: name,
level: parseInt($("new-spell-level")?.value) || 0,
class: $("new-spell-class")?.value || "wizard",
source: $("new-spell-source")?.value || "PH14",
school: "воплощение",
time: $("new-spell-time")?.value || "1 действие",
range: $("new-spell-range")?.value || "60 фт",
components: $("new-spell-components")?.value || "V,S",
duration: $("new-spell-duration")?.value || "Мгновенно",
desc: desc,
higherLevel: $("new-spell-higher")?.value?.trim() || ""
};
SPELL_DATABASE.push(newSpell);
saveToLocal();
closeAddSpellForm();
showToast("Заклинание добавлено!", "success");
renderSpellSearch();
}
function renderSpellSearch() {
const search = ($("spell-search-input")?.value || "").toLowerCase();
const level = $("spell-search-level")?.value || "";
const container = $("spell-search-results");
if (!container) return;
const char = getCurrentChar();
let filtered = SPELL_DATABASE.filter(function(spell) {
const matchesSearch = spell.name.toLowerCase().includes(search);
const matchesLevel = level === "" || spell.level.toString() === level;
const matchesVersion = currentSpellVersion === "all" || spell.source === currentSpellVersion;
const spellClasses = Array.isArray(spell.classes) ? spell.classes : [spell.class || "both"];
const matchesClass = currentSpellClass === "all" || spellClasses.includes("both") || spellClasses.includes(currentSpellClass);
return matchesSearch && matchesLevel && matchesVersion && matchesClass;
});
container.innerHTML = "";
if (filtered.length === 0) {
container.innerHTML = '<p style="color:var(--text-muted); text-align:center;">Не найдено</p>';
return;
}

var countEl = $("spell-search-count");
if (countEl) countEl.textContent = "Найдено: " + filtered.length;

if (!search.trim() && level === "" && currentSpellVersion === "all" && currentSpellClass === "all") {
container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px 0;">🔍 Введите название или выберите класс/уровень</p>';
return;
}

var LIMIT = 80;
var shown = filtered.slice(0, LIMIT);
shown.forEach(function(spell) {
const isAdded = char?.spells?.mySpells && char.spells.mySpells.some(function(s) { return s.id === spell.id; });
const spellClassArr = Array.isArray(spell.classes) ? spell.classes : [spell.class || "both"];
const primaryClass = spellClassArr.length === 1 ? spellClassArr[0] : (spellClassArr.includes(currentSpellClass) ? currentSpellClass : spellClassArr[0]);
const classBadge = "class-" + (primaryClass || "both");
const classText = spellClassArr.length > 1 ? spellClassArr.map(function(c){return CLASS_ICONS_MAP[c]||"✨";}).join("") : (CLASS_ICONS_MAP[primaryClass] || "✨");
var div = document.createElement("div");
div.className = "spell-item" + (isAdded ? " spell-added" : "");
div.innerHTML = "<h4>" + escapeHtml(spell.name) + " <span class=\"source-badge source-" + spell.source.toLowerCase() + "\">" + escapeHtml(spell.source) + "</span> <span class=\"class-badge " + classBadge + "\">" + classText + "</span></h4><div class=\"spell-meta\"><span>" + (spell.level > 0 ? spell.level + " ур." : "Заговор") + "</span><span>" + escapeHtml(spell.time) + "</span><span>" + escapeHtml(spell.range) + "</span><span>" + escapeHtml(spell.components) + "</span></div><p>" + escapeHtml(spell.desc) + "</p>" + (spell.higherLevel ? "<p class=\"spell-higher\">" + escapeHtml(spell.higherLevel) + "</p>" : "") + "<button class=\"" + (isAdded ? "secondary" : "small") + "\" onclick=\"" + (isAdded ? "removeSpell(" + spell.id + ")" : "addSpell(" + spell.id + ")") + "\" style=\"margin-top:8px;\">" + (isAdded ? "Добавлено" : "+ Добавить") + "</button>";
container.appendChild(div);
});
if (filtered.length > LIMIT) {
var more = document.createElement("p");
more.style.cssText = "text-align:center;color:var(--text-muted);padding:12px 0;";
more.textContent = "Показано " + LIMIT + " из " + filtered.length + " — уточните поиск";
container.appendChild(more);
}
}
function addSpell(spellId) {
const char = getCurrentChar();
if (!char) return;
const spell = SPELL_DATABASE.find(function(s) { return s.id === spellId; });
if (!spell) return;
if (!char.spells.mySpells) char.spells.mySpells = [];
if (!char.spells.mySpells.some(function(s) { return s.id === spellId; })) {
char.spells.mySpells.push(spell);
saveToLocal();
renderSpellSearch();
renderMySpells();
}
}
function removeSpell(spellId) {
const char = getCurrentChar();
if (!char) return;
if (!char.spells.mySpells) return;
char.spells.mySpells = char.spells.mySpells.filter(function(s) { return s.id !== spellId; });
saveToLocal();
renderSpellSearch();
renderMySpells();
}
function toggleSpellCard(header) {
  var card = header.closest(".my-spell-item");
  if (!card) return;
  card.classList.toggle("expanded");
  var arrow = header.querySelector(".spell-card-arrow");
  if (arrow) arrow.textContent = card.classList.contains("expanded") ? "▼" : "▶";
}
function renderMySpells() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const container = $("my-spells-list");
if (!container) return;
renderPrepCounter();
if (!char.spells.mySpells || char.spells.mySpells.length === 0) {
container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 24px 0;">✨ Нет заклинаний — нажмите «Найти заклинание»</p>';
return;
}
const byLevel = {};
char.spells.mySpells.forEach(function(spell) {
const lvl = spell.level;
if (!byLevel[lvl]) byLevel[lvl] = [];
byLevel[lvl].push(spell);
});
container.innerHTML = "";
Object.keys(byLevel).sort(function(a,b){return a-b;}).forEach(function(level) {
const levelTitle = level == 0 ? "Заговоры" : level + " уровень";
const count = byLevel[level].length;
const groupDiv = document.createElement("div");
groupDiv.className = "spell-level-group";
groupDiv.innerHTML = '<div class="spell-group-header"><span class="spell-group-title">' + escapeHtml(levelTitle) + '</span><span class="spell-group-count">' + count + '</span></div>';
container.appendChild(groupDiv);
var ritualClasses = ["Волшебник", "Жрец", "Друид", "Бард"];
byLevel[level].forEach(function(spell) {
const spellClassArr2 = Array.isArray(spell.classes) ? spell.classes : [spell.class || "both"];
const classIcons = spellClassArr2.map(function(c){ return CLASS_ICONS_MAP[c] || "✨"; }).join(" ");
const sourceClass = "source-" + (spell.source || "ph14").toLowerCase();
const schoolName = spell.school || "";
var isRitual = !!(spell.time && spell.time.includes("(ритуал)"));
var canCastRitual = isRitual && ritualClasses.includes(char.class);
var metaParts = [];
if (spell.time) metaParts.push('<span>⚡ ' + escapeHtml(spell.time) + '</span>');
if (spell.range) metaParts.push('<span>📏 ' + escapeHtml(spell.range) + '</span>');
if (spell.components) metaParts.push('<span>' + escapeHtml(spell.components) + '</span>');
if (spell.duration) metaParts.push('<span>⏱ ' + escapeHtml(spell.duration) + '</span>');
var prepClass = isPrepClass(char);
var prepared = isSpellPrepared(char, spell.id);
var isCantrip = spell.level === 0;
var cardClass = "my-spell-item";
if (prepClass && !isCantrip && !prepared) cardClass += " spell-unprepared";
var card = document.createElement("div");
card.className = cardClass;
card.dataset.spellId = spell.id;
card.innerHTML =
  '<div class="spell-card-header" onclick="toggleSpellCard(this)">' +
    '<div class="spell-card-title">' +
      '<span class="spell-card-arrow">▶</span>' +
      '<span class="spell-card-name">' + escapeHtml(spell.name) + '</span>' +
      (isRitual ? '<span class="ritual-badge">🕐 Ритуал</span>' : '') +
    '</div>' +
    '<div class="spell-card-badges">' +
      '<span class="source-badge ' + sourceClass + '">' + escapeHtml(spell.source || "") + '</span>' +
      (schoolName ? '<span class="school-badge">' + escapeHtml(schoolName) + '</span>' : '') +
      '<span class="class-icons-row">' + classIcons + '</span>' +
    '</div>' +
  '</div>' +
  '<div class="spell-card-meta">' + metaParts.join("") + '</div>' +
  '<div class="spell-card-body">' +
    (spell.desc ? '<div class="spell-full-desc">' + escapeHtml(spell.desc) + '</div>' : '') +
    (spell.higherLevel ? '<div class="spell-higher">📈 На больших уровнях: ' + escapeHtml(spell.higherLevel) + '</div>' : '') +
    '<div class="spell-card-actions">' +
    (spell.duration && spell.duration.toLowerCase().includes('концентрац') ? '<button class="spell-conc-btn" onclick="setConcentration(this.dataset.name)" data-name="' + escapeHtml(spell.name) + '">🔮 Концентрация</button>' : '') +
    (canCastRitual ? '<button class="spell-ritual-btn" onclick="castRitual(\'' + escapeHtml(spell.name).replace(/'/g,"&#39;") + '\')">🕐 Ритуал</button>' : '') +
    (prepClass && !isCantrip ? '<button class="spell-prep-btn' + (prepared ? ' spell-prep-active' : '') + '" onclick="toggleSpellPrepared(' + spell.id + ')">' + (prepared ? '✅ Подготовлено' : '○ Подготовить') + '</button>' : '') +
    '<button class="spell-remove-btn" onclick="removeSpell(' + spell.id + ')">🗑 Удалить</button>' +
    '</div>' +
  '</div>';
groupDiv.appendChild(card);
});
});
}
// ── Подготовка заклинаний ────────────────────────────────────
function calcMaxPrepared(char) {
  if (!char || !char.class) return null;
  var prep = SPELL_PREP_CLASSES[char.class];
  if (!prep) return null;
  var statKey = prep.stat; // "wis", "cha", "int"
  var statVal = char.stats ? (char.stats[statKey] || 10) : 10;
  var mod = Math.floor((statVal - 10) / 2);
  var level = char.level || 1;
  var max;
  if (prep.formula === "mod+halfLevel") {
    max = mod + Math.floor(level / 2);
  } else {
    max = mod + level;
  }
  return Math.max(1, max);
}

function isPrepClass(char) {
  return !!(char && char.class && SPELL_PREP_CLASSES[char.class]);
}

function isSpellPrepared(char, spellId) {
  if (!isPrepClass(char)) return true; // для не-prep классов все заклинания "подготовлены"
  if (!char.spells.prepared) char.spells.prepared = [];
  return char.spells.prepared.includes(spellId);
}

function toggleSpellPrepared(spellId) {
  const char = getCurrentChar();
  if (!char) return;
  if (!char.spells.prepared) char.spells.prepared = [];
  var idx = char.spells.prepared.indexOf(spellId);
  if (idx >= 0) {
    char.spells.prepared.splice(idx, 1);
  } else {
    var max = calcMaxPrepared(char);
    var nonCantripPrepared = char.spells.prepared.filter(function(id) {
      var sp = char.spells.mySpells.find(function(s){ return s.id === id; });
      return sp && sp.level > 0;
    }).length;
    if (max !== null && nonCantripPrepared >= max) {
      showToast("Достигнут лимит подготовленных заклинаний (" + max + ")", "warn");
      return;
    }
    char.spells.prepared.push(spellId);
  }
  saveToLocal();
  renderMySpells();
  renderPrepCounter();
}

function renderPrepCounter() {
  const char = getCurrentChar();
  const el = $("prep-counter");
  if (!el) return;
  if (!char || !isPrepClass(char)) {
    el.style.display = "none";
    return;
  }
  if (!char.spells.prepared) char.spells.prepared = [];
  var max = calcMaxPrepared(char);
  // Считаем только не-заговоры
  var prepCount = char.spells.prepared.filter(function(id) {
    var sp = char.spells.mySpells ? char.spells.mySpells.find(function(s){ return s.id === id; }) : null;
    return sp && sp.level > 0;
  }).length;
  var statName = { wis: "МУД", cha: "ХАР", int: "ИНТ" }[SPELL_PREP_CLASSES[char.class].stat] || "";
  el.style.display = "";
  el.innerHTML = '<span class="prep-icon">📋</span><span class="prep-label">Подготовлено:</span><span class="prep-count' + (prepCount >= max ? " prep-full" : "") + '">' + prepCount + '</span><span class="prep-sep">/</span><span class="prep-max">' + max + '</span><span class="prep-hint">(' + statName + ' + ур.)</span>';
}

var _ritualTimer = null;
var _ritualEndTime = 0;
function castRitual(spellName) {
// Если уже идёт ритуал — отменить старый
if (_ritualTimer) cancelRitual(true);
_ritualEndTime = Date.now() + 10 * 60 * 1000; // 10 минут
var nameEl = $("status-ritual-name");
var timerEl = $("status-ritual-timer");
var container = $("status-ritual");
if (nameEl) nameEl.textContent = spellName;
if (timerEl) timerEl.textContent = "10:00";
if (container) container.classList.remove("hidden");
showToast("🕐 Ритуал: " + spellName + " — 10 минут", "info");
_ritualTimer = setInterval(function() {
  var left = _ritualEndTime - Date.now();
  if (left <= 0) {
    clearInterval(_ritualTimer);
    _ritualTimer = null;
    if (container) container.classList.add("hidden");
    showToast("✅ Ритуал «" + spellName + "» завершён!", "success");
    return;
  }
  var min = Math.floor(left / 60000);
  var sec = Math.floor((left % 60000) / 1000);
  if (timerEl) timerEl.textContent = min + ":" + (sec < 10 ? "0" : "") + sec;
}, 1000);
}
function cancelRitual(silent) {
if (_ritualTimer) {
  clearInterval(_ritualTimer);
  _ritualTimer = null;
}
var container = $("status-ritual");
if (container) container.classList.add("hidden");
if (!silent) showToast("🕐 Ритуал отменён", "warn");
}
