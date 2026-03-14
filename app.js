// ============================================================
// app.js — Логика приложения D&D 5e Character Sheet
// Все функции, состояние, обработчики событий
// ============================================================

let SPELL_DATABASE = [];
let characters = [];
let currentId = null;
let currentSpellVersion = "all";
let currentSpellClass = "all";
let currentViewItem = null;
let currentFilterCategory = "all";
let diceHistory = [];
let currentRestType = null;
let hitDiceToSpend = 0;
const abilities = [
{key: "str", name: "Сила"}, {key: "dex", name: "Ловкость"}, {key: "con", name: "Телосложение"},
{key: "int", name: "Интеллект"}, {key: "wis", name: "Мудрость"}, {key: "cha", name: "Харизма"}
];
const skills = [
{name: "Акробатика", stat: "dex"}, {name: "Аркана", stat: "int"}, {name: "Атлетика", stat: "str"},
{name: "Внимательность", stat: "wis"}, {name: "Выживание", stat: "wis"}, {name: "Выступление", stat: "cha"},
{name: "Запугивание", stat: "cha"}, {name: "История", stat: "int"}, {name: "Ловкость рук", stat: "dex"},
{name: "Медицина", stat: "wis"}, {name: "Обман", stat: "cha"}, {name: "Природа", stat: "int"},
{name: "Проницательность", stat: "wis"}, {name: "Расследование", stat: "int"}, {name: "Религия", stat: "int"},
{name: "Скрытность", stat: "dex"}, {name: "Убеждение", stat: "cha"}, {name: "Уход за животными", stat: "wis"}
];
// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================
window.onload = function() {
try {
const saved = localStorage.getItem("dnd_chars");
const savedSpells = localStorage.getItem("dnd_spells");
if (saved) characters = JSON.parse(saved);
if (savedSpells) SPELL_DATABASE = JSON.parse(savedSpells);
} catch(e) { console.log("Ошибка загрузки:", e); }
initSaves();
initSkills();
initConditions();
initEffects();
renderCharacterList();
renderWeaponPresets();
};
// ============================================
// УЛУЧШЕННЫЕ СПАСБРОСКИ
// ============================================
function initSaves() {
const grid = document.getElementById("saves-grid");
if (!grid) return;
grid.innerHTML = "";
SAVES_DATA.forEach(function(save, index) {
const item = document.createElement("div");
item.className = "save-item";
item.id = "save-item-" + save.key;
item.innerHTML = `
<div class="save-header">
<span class="save-icon">${escapeHtml(save.icon)}</span>
<span class="save-name">${escapeHtml(save.name)}</span>
</div>
<div class="save-value">
<div class="save-bonus" id="save-bonus-${save.key}">+0</div>
<div class="save-proficiency">
<input type="checkbox" id="save-prof-${save.key}" onchange="calcStats()">
<label for="save-prof-${save.key}">Владение</label>
</div>
</div>
<div class="save-desc">${escapeHtml(save.desc)}</div>
`;
grid.appendChild(item);
});
}
function autoSelectProficiencies() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const className = document.getElementById("char-class")?.value || "";
if (!className || !CLASS_SAVE_PROFICIENCIES[className]) return;
const saves = CLASS_SAVE_PROFICIENCIES[className];
saves.forEach(function(saveKey) {
const checkbox = document.getElementById("save-prof-" + saveKey);
if (checkbox && !checkbox.checked) {
checkbox.checked = true;
}
});
calcStats();
}
function initSkills() {
const container = document.getElementById("skills-container");
if (!container) return;
container.innerHTML = "";
skills.forEach(function(skill, index) {
const row = document.createElement("div");
row.className = "skill-row";
row.innerHTML = "<div class=\"checkbox-wrapper\"><input type=\"checkbox\" id=\"skill-prof-" + index + "\" onchange=\"calcStats()\"><label for=\"skill-prof-" + index + "\" style=\"margin:0; cursor:pointer;\">" + escapeHtml(skill.name) + "</label></div><div class=\"bonus-display\" id=\"skill-bonus-" + index + "\">+0</div>";
container.appendChild(row);
});
}
function updateClassFeatures() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const className = char.class;
const level = char.level;
const featuresSection = document.getElementById("class-features-section");
const featuresGrid = document.getElementById("features-grid");
const asiContainer = document.getElementById("asi-container");
if (!className || !CLASS_FEATURES[className]) {
featuresSection.style.display = "none";
return;
}
featuresSection.style.display = "block";
featuresGrid.innerHTML = "";
for (let l = 1; l <= level; l++) {
if (CLASS_FEATURES[className][l]) {
CLASS_FEATURES[className][l].forEach(function(feature) {
const featureDiv = document.createElement("div");
featureDiv.className = "feature-item" + (l === level ? " new" : "");
featureDiv.innerHTML = "<span class=\"feature-level\">" + l + " ур.</span><div class=\"feature-name\">" + escapeHtml(feature.name) + "</div><div class=\"feature-desc\">" + escapeHtml(feature.desc) + "</div>";
featuresGrid.appendChild(featureDiv);
});
}
}
const asiLevels = [4, 8, 12, 16, 19];
const availableASI = asiLevels.filter(function(l) { return l <= level; });
if (availableASI.length > 0) {
asiContainer.innerHTML = "<button class=\"asi-button\" onclick=\"openASIModal()\">📈 Увеличение характеристик (доступно: " + availableASI.length + ")</button>";
} else {
asiContainer.innerHTML = "";
}
}
function initConditions() {
const grid = document.getElementById("conditions-grid");
if (!grid) return;
grid.innerHTML = "";
CONDITIONS.forEach(function(condition) {
const item = document.createElement("div");
item.className = "condition-item" + (condition.type ? " " + condition.type : "");
item.id = "condition-" + condition.id;
item.onclick = function() { toggleCondition(condition.id); };
item.innerHTML = "<div class=\"condition-name\">" + escapeHtml(condition.name) + "</div><div class=\"condition-desc\">" + escapeHtml(condition.desc) + "</div>";
grid.appendChild(item);
});
}
function toggleCondition(conditionId) {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
if (!char.conditions) char.conditions = [];
const index = char.conditions.indexOf(conditionId);
const conditionEl = document.getElementById("condition-" + conditionId);
if (index > -1) {
char.conditions.splice(index, 1);
conditionEl.classList.remove("active");
} else {
char.conditions.push(conditionId);
conditionEl.classList.add("active");
}
updateConditionsCount();
updateStatusBar();
calculateAC();
saveToLocal();
}
function updateConditionsCount() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
const countEl = document.getElementById("conditions-count");
if (!countEl) return;
const count = char.conditions ? char.conditions.length : 0;
countEl.textContent = count;
countEl.style.display = count > 0 ? "inline-block" : "none";
}
function loadConditions() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char || !char.conditions) return;
CONDITIONS.forEach(function(condition) {
const conditionEl = document.getElementById("condition-" + condition.id);
if (char.conditions.includes(condition.id)) {
conditionEl.classList.add("active");
} else {
conditionEl.classList.remove("active");
}
});
updateConditionsCount();
updateStatusBar();
}
function initEffects() {
const grid = document.getElementById("effects-grid");
if (!grid) return;
grid.innerHTML = "";
EFFECTS_DATA.forEach(function(effect) {
const item = document.createElement("div");
item.className = "effect-item" + (effect.type ? " " + effect.type : "");
item.id = "effect-" + effect.id;
item.onclick = function() { toggleEffect(effect.id); };
item.innerHTML = "<div class=\"effect-name\">" + escapeHtml(effect.name) + "</div><div class=\"effect-desc\">" + escapeHtml(effect.desc) + "</div><div class=\"effect-duration\">" + escapeHtml(effect.duration) + "</div><span class=\"effect-type " + effect.type + "\">" + (effect.type === 'buff' ? '✨ Бафф' : '💀 Дебафф') + "</span>";
grid.appendChild(item);
});
}
function toggleEffect(effectId) {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
if (!char.effects) char.effects = [];
const index = char.effects.indexOf(effectId);
const effectEl = document.getElementById("effect-" + effectId);
if (index > -1) {
char.effects.splice(index, 1);
effectEl.classList.remove("active");
} else {
char.effects.push(effectId);
effectEl.classList.add("active");
}
updateEffectsCount();
updateStatusBar();
calculateAC();
saveToLocal();
}
function updateEffectsCount() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
const countEl = document.getElementById("effects-count");
if (!countEl) return;
const count = char.effects ? char.effects.length : 0;
countEl.textContent = count;
countEl.style.display = count > 0 ? "inline-block" : "none";
}
function loadEffects() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char || !char.effects) return;
EFFECTS_DATA.forEach(function(effect) {
const effectEl = document.getElementById("effect-" + effect.id);
if (char.effects.includes(effect.id)) {
effectEl.classList.add("active");
} else {
effectEl.classList.remove("active");
}
});
updateEffectsCount();
updateStatusBar();
}
// 🔧 ИСПРАВЛЕНИЕ: Защита от undefined в calculateAC()
function calculateAC() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const dexMod = getMod(char.stats.dex);
const conMod = getMod(char.stats.con);
const wisMod = getMod(char.stats.wis);
let ac = 10;
let formulaParts = ["10 (база)"];
let modifiers = [];
const hasMageArmor = char.effects && char.effects.includes('mage_armor');
const hasMonkUnarmored = char.effects && char.effects.includes('monk_unarmored');
const hasBarbarianUnarmored = char.effects && char.effects.includes('barbarian_unarmored');
const isBarbarian = char.class === "Варвар";
const isMonk = char.class === "Монах";
// 🔧 Защита от undefined для char.proficiencies.armor
const hasArmorProf = char.proficiencies && char.proficiencies.armor && Array.isArray(char.proficiencies.armor);
const hasLightArmor = hasArmorProf && char.proficiencies.armor.includes('light');
const hasMediumArmor = hasArmorProf && char.proficiencies.armor.includes('medium');
const hasHeavyArmor = hasArmorProf && char.proficiencies.armor.includes('heavy');
const hasShield = hasArmorProf && char.proficiencies.armor.includes('shield');
// 🔧 ИСПРАВЛЕНИЕ: Приоритет расчёта КД
if (hasBarbarianUnarmored || (isBarbarian && !hasLightArmor && !hasMediumArmor && !hasHeavyArmor)) {
ac = 10 + dexMod + conMod;
formulaParts = ["10 (база)", "+" + dexMod + " (ЛОВ)", "+" + conMod + " (ТЕЛ)"];
modifiers.push({name: "Без доспехов варвара", value: ac - 10, type: "active"});
}
else if (hasMonkUnarmored || (isMonk && !hasLightArmor && !hasMediumArmor && !hasHeavyArmor)) {
ac = 10 + dexMod + wisMod;
// 🔧 ИСПРАВЛЕНИЕ: Исправлена опечатка в формуле КД монаха (добавлена скобка)
formulaParts = ["10 (база)", "+" + dexMod + " (ЛОВ)", "+" + wisMod + " (МУД)"];
modifiers.push({name: "Без доспехов монаха", value: ac - 10, type: "active"});
}
else if (hasMageArmor) {
ac = 13 + dexMod;
formulaParts = ["13 (магия)", "+" + dexMod + " (ЛОВ)"];
modifiers.push({name: "Доспех мага", value: 3, type: "active"});
}
else if (hasLightArmor) {
ac = 11 + dexMod;
formulaParts = ["11 (лёгкая)", "+" + dexMod + " (ЛОВ)"];
modifiers.push({name: "Лёгкая броня", value: 1, type: "active"});
}
else if (hasMediumArmor) {
const dexBonus = Math.min(dexMod, 2);
ac = 12 + dexBonus;
formulaParts = ["12 (средняя)", "+" + dexBonus + " (ЛОВ, макс +2)"];
modifiers.push({name: "Средняя броня", value: 2, type: "active"});
}
else if (hasHeavyArmor) {
ac = 16;
formulaParts = ["16 (тяжёлая)"];
modifiers.push({name: "Тяжёлая броня", value: 6, type: "active"});
}
if (hasShield) {
ac += 2;
formulaParts.push("+2 (щит)");
modifiers.push({name: "Щит", value: 2, type: "active"});
}
if (char.effects) {
char.effects.forEach(function(effectId) {
const effect = EFFECTS_DATA.find(function(e) { return e.id === effectId; });
if (effect && effect.acBonus) {
ac += effect.acBonus;
if (effect.acBonus > 0) {
formulaParts.push("+" + effect.acBonus + " (" + effect.name + ")");
modifiers.push({name: effect.name, value: effect.acBonus, type: "active"});
} else {
formulaParts.push(effect.acBonus + " (" + effect.name + ")");
modifiers.push({name: effect.name, value: effect.acBonus, type: "negative"});
}
}
});
}
document.getElementById("ac-total").textContent = ac;
document.getElementById("ac-formula").textContent = formulaParts.join(" ");
document.getElementById("combat-ac").value = ac;
const modifiersContainer = document.getElementById("ac-modifiers");
modifiersContainer.innerHTML = "";
modifiers.forEach(function(mod) {
const modDiv = document.createElement("div");
modDiv.className = "ac-modifier-item" + (mod.type === "negative" ? " negative" : "");
modDiv.innerHTML = "<span>" + escapeHtml(mod.name) + "</span><span class=\"ac-modifier-value\">" + (mod.value >= 0 ? "+" : "") + mod.value + "</span>";
modifiersContainer.appendChild(modDiv);
});
document.getElementById("status-ac").textContent = ac;
char.combat.ac = ac;
}
function updateStatusBar() {
if (!currentId) {
document.getElementById("status-bar").classList.remove("visible");
return;
}
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
document.getElementById("status-bar").classList.add("visible");
document.getElementById("status-level").textContent = char.level || 1;
document.getElementById("status-hp-current").textContent = char.combat.hpCurrent || 0;
document.getElementById("status-hp-max").textContent = char.combat.hpMax || 10;
const conditionsContainer = document.getElementById("status-conditions");
conditionsContainer.innerHTML = "";
if (char.conditions && char.conditions.length > 0) {
char.conditions.forEach(function(condId) {
const condition = CONDITIONS.find(function(c) { return c.id === condId; });
if (condition) {
const badge = document.createElement("span");
badge.className = "condition-badge" + (condition.type ? " " + condition.type : "");
badge.textContent = condition.name.split(' ')[1] || condition.name;
conditionsContainer.appendChild(badge);
}
});
}
if (char.effects && char.effects.length > 0) {
char.effects.forEach(function(effectId) {
const effect = EFFECTS_DATA.find(function(e) { return e.id === effectId; });
if (effect) {
const badge = document.createElement("span");
badge.className = "condition-badge" + (effect.type ? " " + effect.type : "");
badge.textContent = effect.name.split(' ')[1] || effect.name;
conditionsContainer.appendChild(badge);
}
});
}
}
function getProficiencyBonus(level) {
if (level >= 17) return 6;
if (level >= 13) return 5;
if (level >= 9) return 4;
if (level >= 5) return 3;
return 2;
}
function getMod(val) { return Math.floor((val - 10) / 2); }
function formatMod(val) { return val >= 0 ? "+" + val : "" + val; }
function saveToLocal() {
try {
localStorage.setItem("dnd_chars", JSON.stringify(characters));
localStorage.setItem("dnd_spells", JSON.stringify(SPELL_DATABASE));
} catch(e) { console.log("Ошибка сохранения:", e); }
}
function showScreen(screenName) {
const charactersScreen = document.getElementById("screen-characters");
const characterScreen = document.getElementById("screen-character");
const characterTabs = document.getElementById("character-tabs");
const statusBar = document.getElementById("status-bar");
if (charactersScreen) charactersScreen.classList.add("hidden");
if (characterScreen) characterScreen.classList.add("hidden");
if (characterTabs) characterTabs.classList.add("hidden");
if (statusBar) statusBar.classList.remove("visible");
if (screenName === "characters") {
if (charactersScreen) charactersScreen.classList.remove("hidden");
currentId = null;
renderCharacterList();
} else {
if (characterScreen) characterScreen.classList.remove("hidden");
if (characterTabs) characterTabs.classList.remove("hidden");
updateHeaderTitle();
updateStatusBar();
}
}
function updateHeaderTitle() {
if (!currentId) {
document.getElementById("header-title").textContent = "🎭 Мой Персонаж D&D 5e";
return;
}
const char = characters.find(function(c) { return c.id === currentId; });
if (char && char.name) {
document.getElementById("header-title").textContent = "🎭 " + escapeHtml(char.name);
} else {
document.getElementById("header-title").textContent = "🎭 Мой Персонаж D&D 5e";
}
}
function switchTab(tabName, btnEl) {
document.querySelectorAll(".tab-content").forEach(function(tab) { tab.classList.remove("active"); });
document.querySelectorAll(".tab-btn").forEach(function(btn) { btn.classList.remove("active"); });
var tabElement = document.getElementById("tab-" + tabName);
if (tabElement) tabElement.classList.add("active");
var activeBtn = btnEl ? btnEl.closest(".tab-btn") : null;
if (activeBtn) activeBtn.classList.add("active");
}
function adjustStat(stat, delta) {
const input = document.getElementById("val-" + stat);
if (!input) return;
let value = parseInt(input.value) || 10;
value += delta;
if (value < 1) value = 1;
if (value > 30) value = 30;
input.value = value;
if (stat === "str" || stat === "con") {
calcStats();
recalculateHP();
} else {
calcStats();
}
calculateAC();
}
function adjustCoin(coinType, delta) {
const input = document.getElementById("coin-" + coinType);
if (!input) return;
let value = parseInt(input.value) || 0;
value += delta;
if (value < 0) value = 0;
input.value = value;
updateChar();
}
function updateSubclassOptions() {
const classSelect = document.getElementById("char-class");
const subclassSelect = document.getElementById("char-subclass");
if (!classSelect || !subclassSelect) return;
const selectedClass = classSelect.value;
subclassSelect.innerHTML = "<option value=\"\">Выберите подкласс</option>";
if (selectedClass && SUBCLASSES[selectedClass]) {
SUBCLASSES[selectedClass].forEach(function(subclass) {
const option = document.createElement("option");
option.value = subclass;
option.textContent = subclass;
subclassSelect.appendChild(option);
});
}
}
// 🔧 ИСПРАВЛЕНИЕ: Правильный расчёт ХП по правилам D&D 5e
function calculateMaxHP(level, conMod, hitDie) {
if (level < 1) return 0;
// Уровень 1: максимум кости хитов + мод ТЕЛ
const level1HP = hitDie + conMod;
// Уровни 2+: среднее значение кости (округлённое вверх) + мод ТЕЛ за каждый уровень
const avgPerLevel = Math.floor(hitDie / 2) + 1;
const additionalHP = (level - 1) * (avgPerLevel + conMod);
return level1HP + additionalHP;
}
function recalculateHP() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const levelEl = document.getElementById("char-level");
const conEl = document.getElementById("val-con");
const classEl = document.getElementById("char-class");
const hpMaxEl = document.getElementById("hp-max");
const hpDiceEl = document.getElementById("hp-dice");
const hpDiceAvailableEl = document.getElementById("hp-dice-available");
if (!levelEl || !conEl || !classEl) return;
const level = parseInt(levelEl.value) || 1;
const conMod = getMod(parseInt(conEl.value) || 10);
const className = classEl.value;
const hitDie = CLASS_HIT_DICE[className] || 8;
const newMaxHP = calculateMaxHP(level, conMod, hitDie);
if (hpMaxEl) hpMaxEl.value = newMaxHP;
if (hpDiceEl) hpDiceEl.value = "1к" + hitDie;
if (hpDiceAvailableEl) hpDiceAvailableEl.value = (level - (char.combat.hpDiceSpent || 0)) + "/" + level;
char.combat.hpMax = newMaxHP;
char.combat.hpDice = "1к" + hitDie;
// 🔧 Если текущие ХП больше нового максимума, ограничиваем
if (char.combat.hpCurrent > newMaxHP) {
char.combat.hpCurrent = newMaxHP;
safeSet("hp-current", newMaxHP);
}
saveToLocal();
updateStatusBar();
}
function createNewCharacter() {
const newChar = {
id: Date.now(),
name: "Новый Герой",
level: 1,
exp: 0,
class: "",
subclass: "",
race: "",
background: "",
alignment: "",
size: "Средний",
speed: "30 фт",
stats: { str:10, dex:10, con:10, int:10, wis:10, cha:10 },
combat: { ac:10, hpMax:10, hpCurrent:10, hpTemp:0, hpDice:"1к8", hpDiceSpent:0, init:0, speed:"30 фт" },
conditions: [],
effects: [],
saves: {},
skills: {},
proficiencies: { armor: [], weapon: [], tools: "", languages: "" },
weapons: [],
inventory: { weapon: [], armor: [], potion: [], scroll: [], tool: [], material: [], other: [] },
coins: { cp:0, sp:0, ep:0, gp:0, pp:0 },
spells: { slots: {}, slotsUsed: {}, mySpells: [], stat: "", dc: 0, attack: 0, mod: 0 },
notes: "",
features: "",
appearance: "",
magicItems: ""
};
for(let i=1; i<=9; i++) {
newChar.spells.slots[i] = 0;
newChar.spells.slotsUsed[i] = 0;
}
characters.push(newChar);
saveToLocal();
loadCharacter(newChar.id);
}
function renderCharacterList() {
const list = document.getElementById("character-list");
if (!list) return;
list.innerHTML = "";
if (characters.length === 0) {
list.innerHTML = "<div class=\"empty-list\">📭 Список пуст. Создайте персонажа!</div>";
return;
}
characters.forEach(function(char) {
const div = document.createElement("div");
div.className = "char-card";
div.onclick = function() { loadCharacter(char.id); };
const conditionsCount = (char.conditions ? char.conditions.length : 0) + (char.effects ? char.effects.length : 0);
div.innerHTML = "<div class=\"char-card-header\"><h4 class=\"char-card-name\">" + escapeHtml(char.name || "Без имени") + "</h4><button class=\"char-delete-btn\" onclick=\"event.stopPropagation(); deleteCharacter(" + char.id + ")\">🗑️</button></div><div class=\"char-card-info\"><span>⚔️ " + escapeHtml(char.class || "Класс не указан") + "</span><span>🧝 " + escapeHtml(char.race || "Раса не указана") + "</span></div><div class=\"char-card-stats\"><span class=\"char-stat-badge\">⭐ Ур. " + (char.level || 1) + "</span><span class=\"char-stat-badge\">❤️ " + (char.combat.hpCurrent || 0) + "/" + (char.combat.hpMax || 0) + " ХП</span><span class=\"char-stat-badge\">🛡️ КД " + (char.combat.ac || 10) + "</span>" + (conditionsCount > 0 ? "<span class=\"char-stat-badge\" style=\"background: var(--condition-active); border-color: var(--condition-border);\">⚠️ " + conditionsCount + "</span>" : "") + "</div>";
list.appendChild(div);
});
}
function deleteCharacter(id) {
if (confirm("⚠️ Удалить персонажа?")) {
characters = characters.filter(function(c) { return c.id !== id; });
saveToLocal();
renderCharacterList();
}
}
function safeSet(id, value) {
const el = document.getElementById(id);
if (el) el.value = value;
}
function safeSetChecked(id, checked) {
const el = document.getElementById(id);
if (el) el.checked = checked;
}
// ============================================
// 🔧 ИСПРАВЛЕНИЕ: Подкласс сохраняется + hpCurrent как число
// ============================================
function loadCharacter(id) {
currentId = id;
const char = characters.find(function(c) { return c.id === id; });
if (!char) return;
// 🔧 СОХРАНЯЕМ ПОДКЛАСС ПЕРЕД updateSubclassOptions
const savedSubclass = char.subclass || "";
safeSet("char-name", char.name);
safeSet("char-level", char.level);
safeSet("char-exp", char.exp || 0);
safeSet("char-class", char.class);
updateSubclassOptions(); // Сначала создаём опции
// 🔧 ВОССТАНАВЛИВАЕМ ПОДКЛАСС ПОСЛЕ создания опций
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
calcCoinWeight();
calcSpellStats();
recalculateHP();
loadConditions();
loadEffects();
updateClassFeatures();
calculateAC();
renderWeapons();
renderSpellSlots();
renderMySpells();
renderInventory();
showScreen("character");
}
function updateChar() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
char.name = document.getElementById("char-name")?.value || "";
char.level = parseInt(document.getElementById("char-level")?.value) || 1;
char.exp = parseInt(document.getElementById("char-exp")?.value) || 0;
char.class = document.getElementById("char-class")?.value || "";
char.subclass = document.getElementById("char-subclass")?.value || "";
char.race = document.getElementById("char-race")?.value || "";
char.background = document.getElementById("char-background")?.value || "";
char.alignment = document.getElementById("char-alignment")?.value || "";
char.size = document.getElementById("char-size")?.value || "Средний";
char.speed = document.getElementById("char-speed")?.value || "30 фт";
char.combat.ac = parseInt(document.getElementById("combat-ac")?.value) || 10;
// 🔧 ИСПРАВЛЕНИЕ: hpCurrent теперь сохраняется как число (parseInt)
char.combat.hpCurrent = parseInt(document.getElementById("hp-current")?.value) || 0;
char.combat.hpTemp = parseInt(document.getElementById("hp-temp")?.value) || 0;
char.combat.hpDiceSpent = parseInt(document.getElementById("hp-dice-spent")?.value) || 0;
char.combat.speed = document.getElementById("combat-speed")?.value || "30 фт";
char.proficiencies.tools = document.getElementById("tool-proficiencies")?.value || "";
char.proficiencies.languages = document.getElementById("languages")?.value || "";
char.coins.cp = parseInt(document.getElementById("coin-cp")?.value) || 0;
char.coins.sp = parseInt(document.getElementById("coin-sp")?.value) || 0;
char.coins.ep = parseInt(document.getElementById("coin-ep")?.value) || 0;
char.coins.gp = parseInt(document.getElementById("coin-gp")?.value) || 0;
char.coins.pp = parseInt(document.getElementById("coin-pp")?.value) || 0;
calcCoinWeight();
char.notes = document.getElementById("char-notes")?.value || "";
char.features = document.getElementById("char-features")?.value || "";
char.appearance = document.getElementById("char-appearance")?.value || "";
char.magicItems = document.getElementById("magic-items")?.value || "";
char.spells.stat = document.getElementById("spell-stat")?.value || "";
for(let i=1; i<=9; i++) {
if(char.spells.slots[i] !== undefined) {
const slotInput = document.getElementById("slots-" + i + "-total");
if(slotInput) char.spells.slots[i] = parseInt(slotInput.value) || 0;
}
}
calcSpellStats();
saveToLocal();
updateHeaderTitle();
updateStatusBar();
}
function toggleProficiency(type, value, checkbox) {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
if (type === "armor") {
if (!char.proficiencies.armor) char.proficiencies.armor = [];
if (checkbox.checked) {
if (!char.proficiencies.armor.includes(value)) char.proficiencies.armor.push(value);
} else {
const index = char.proficiencies.armor.indexOf(value);
if (index > -1) char.proficiencies.armor.splice(index, 1);
}
} else if (type === "weapon") {
if (!char.proficiencies.weapon) char.proficiencies.weapon = [];
if (checkbox.checked) {
if (!char.proficiencies.weapon.includes(value)) char.proficiencies.weapon.push(value);
} else {
const index = char.proficiencies.weapon.indexOf(value);
if (index > -1) char.proficiencies.weapon.splice(index, 1);
}
}
saveToLocal();
}
function calcStats() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const level = parseInt(document.getElementById("char-level")?.value) || 1;
const proficiencyBonus = getProficiencyBonus(level);
const profBonusEl = document.getElementById("proficiency-bonus");
if (profBonusEl) profBonusEl.innerText = "+" + proficiencyBonus;
const stats = ["str", "dex", "con", "int", "wis", "cha"];
stats.forEach(function(s) {
const val = parseInt(document.getElementById("val-" + s)?.value) || 10;
char.stats[s] = val;
const mod = getMod(val);
const modEl = document.getElementById("mod-" + s);
if (modEl) modEl.innerText = formatMod(mod);
});
const dexMod = getMod(char.stats.dex);
const initEl = document.getElementById("combat-init");
if (initEl) initEl.value = formatMod(dexMod);
SAVES_DATA.forEach(function(save) {
const checkbox = document.getElementById("save-prof-" + save.key);
const item = document.getElementById("save-item-" + save.key);
if(checkbox) {
let bonus = getMod(char.stats[save.key]);
if(checkbox.checked) bonus += proficiencyBonus;
const bonusEl = document.getElementById("save-bonus-" + save.key);
if (bonusEl) bonusEl.innerText = formatMod(bonus);
char.saves[save.key] = checkbox.checked;
}
if (item) {
if (checkbox && checkbox.checked) {
item.classList.add("proficient");
} else {
item.classList.remove("proficient");
}
}
});
skills.forEach(function(skill, index) {
const checkbox = document.getElementById("skill-prof-" + index);
if(checkbox) {
let bonus = getMod(char.stats[skill.stat]);
if(checkbox.checked) bonus += proficiencyBonus;
const bonusEl = document.getElementById("skill-bonus-" + index);
if (bonusEl) bonusEl.innerText = formatMod(bonus);
char.skills[index] = checkbox.checked;
}
});
const wisMod = getMod(char.stats.wis);
const perceptionCheckbox = document.getElementById("skill-prof-3");
let passivePerception = 10 + wisMod;
if(perceptionCheckbox && perceptionCheckbox.checked) passivePerception += proficiencyBonus;
const passiveEl = document.getElementById("passive-perception");
if (passiveEl) passiveEl.innerText = passivePerception;
calcSpellStats();
saveToLocal();
}
function calcSpellStats() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const level = parseInt(document.getElementById("char-level")?.value) || 1;
const proficiencyBonus = getProficiencyBonus(level);
let statMod = 0;
const stat = char.spells.stat || "";
if (stat === "ИНТ") statMod = getMod(char.stats.int);
else if (stat === "МУД") statMod = getMod(char.stats.wis);
else if (stat === "ХАР") statMod = getMod(char.stats.cha);
const dc = 8 + proficiencyBonus + statMod;
const attack = proficiencyBonus + statMod;
safeSet("spell-dc", dc);
safeSet("spell-attack", formatMod(attack));
safeSet("spell-mod", formatMod(statMod));
char.spells.dc = dc;
char.spells.attack = attack;
char.spells.mod = statMod;
saveToLocal();
}
function calcCoinWeight() {
const cp = parseInt(document.getElementById("coin-cp")?.value) || 0;
const sp = parseInt(document.getElementById("coin-sp")?.value) || 0;
const ep = parseInt(document.getElementById("coin-ep")?.value) || 0;
const gp = parseInt(document.getElementById("coin-gp")?.value) || 0;
const pp = parseInt(document.getElementById("coin-pp")?.value) || 0;
const totalCoins = cp + sp + ep + gp + pp;
const weight = (totalCoins / 50).toFixed(2);
const coinWeightEl = document.getElementById("coin-weight");
if (coinWeightEl) coinWeightEl.innerText = "Вес монет: " + weight + " фнт";
updateInventoryWeight();
}
function openRestModal() {
if (!currentId) { alert("Сначала выберите персонажа!"); return; }
const modal = document.getElementById("rest-modal");
if (modal) modal.classList.add("active");
showRestMain();
}
function closeRestModal() {
const modal = document.getElementById("rest-modal");
if (modal) modal.classList.remove("active");
currentRestType = null;
hitDiceToSpend = 0;
}
function showRestMain() {
const main = document.getElementById("rest-main-screen");
const info = document.getElementById("rest-info-screen");
const result = document.getElementById("rest-result-screen");
if (main) main.classList.remove("hidden");
if (info) info.classList.add("hidden");
if (result) result.classList.add("hidden");
}
function showShortRestInfo() {
currentRestType = "short";
const main = document.getElementById("rest-main-screen");
const info = document.getElementById("rest-info-screen");
const result = document.getElementById("rest-result-screen");
const title = document.getElementById("rest-info-title");
const list = document.getElementById("rest-info-list");
const hitDiceSection = document.getElementById("hit-dice-section");
const confirmBtn = document.getElementById("confirm-rest-btn");
if (main) main.classList.add("hidden");
if (info) info.classList.remove("hidden");
if (result) result.classList.add("hidden");
if (title) title.textContent = "☕ Короткий отдых (1 час)";
if (list) list.innerHTML = "<li>Потратьте кости хитов для восстановления ХП</li><li>Восстанавливаются некоторые классовые умения</li><li>Заклинания НЕ восстанавливаются (кроме Колдуна)</li><li>⚠️ Некоторые условия снимаются</li>";
if (hitDiceSection) hitDiceSection.classList.remove("hidden");
if (confirmBtn) confirmBtn.textContent = "Короткий отдых";
updateHitDiceInfo();
}
function showLongRestInfo() {
currentRestType = "long";
const main = document.getElementById("rest-main-screen");
const info = document.getElementById("rest-info-screen");
const result = document.getElementById("rest-result-screen");
const title = document.getElementById("rest-info-title");
const list = document.getElementById("rest-info-list");
const hitDiceSection = document.getElementById("hit-dice-section");
const confirmBtn = document.getElementById("confirm-rest-btn");
if (main) main.classList.add("hidden");
if (info) info.classList.remove("hidden");
if (result) result.classList.add("hidden");
if (title) title.textContent = "🛏️ Долгий отдых (8 часов)";
if (list) list.innerHTML = "<li>Восстанавливаются ВСЕ ХП</li><li>Восстанавливаются ВСЕ ячейки заклинаний</li><li>Восстанавливаются кости хитов (до половины уровня)</li><li>Сбрасываются потраченные кости хитов</li><li>Восстанавливаются все классовые умения</li><li>✅ Снимаются большинство условий</li>";
if (hitDiceSection) hitDiceSection.classList.add("hidden");
if (confirmBtn) confirmBtn.textContent = "Долгий отдых";
}
function showRestResult(title, details) {
const main = document.getElementById("rest-main-screen");
const info = document.getElementById("rest-info-screen");
const result = document.getElementById("rest-result-screen");
const resultTitle = document.getElementById("rest-result-title");
const resultDetails = document.getElementById("rest-result-details");
if (main) main.classList.add("hidden");
if (info) info.classList.add("hidden");
if (result) result.classList.remove("hidden");
if (resultTitle) resultTitle.textContent = title;
if (resultDetails) resultDetails.innerHTML = details;
}
function adjustHitDice(delta) {
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const maxHitDice = char.level || 1;
const availableHitDice = maxHitDice - (char.combat.hpDiceSpent || 0);
hitDiceToSpend += delta;
if (hitDiceToSpend < 0) hitDiceToSpend = 0;
if (hitDiceToSpend > availableHitDice) hitDiceToSpend = availableHitDice;
safeSet("hit-dice-to-spend", hitDiceToSpend);
updateHitDiceInfo();
}
function updateHitDiceInfo() {
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const maxHitDice = char.level || 1;
const availableHitDice = maxHitDice - (char.combat.hpDiceSpent || 0);
const hitDiceMatch = char.combat.hpDice.match(/(\d+)[кK](\d+)/);
const hitDiceValue = hitDiceMatch ? parseInt(hitDiceMatch[2]) : 8;
const avgHeal = Math.floor(hitDiceValue / 2) + 1;
const conMod = getMod(char.stats.con);
const totalHeal = hitDiceToSpend * (avgHeal + conMod);
const availableEl = document.getElementById("hit-dice-available-rest");
const healEl = document.getElementById("hit-dice-heal");
if (availableEl) availableEl.textContent = availableHitDice;
if (healEl) healEl.textContent = totalHeal;
}
function confirmRest() {
if (!currentId || !currentRestType) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
let resultTitle = "";
let resultDetails = "";
const oldHp = parseInt(char.combat.hpCurrent);
if (currentRestType === "short") {
var _hitDie = parseInt(char.combat.hpDice.match(/(\d+)[кK](\d+)/)?.[2] || 8);
var _conMod = getMod(char.stats.con);
const hpHealed = hitDiceToSpend > 0 ? hitDiceToSpend * (Math.floor(_hitDie / 2) + 1 + _conMod) : 0;
char.combat.hpCurrent = Math.min(parseInt(char.combat.hpCurrent) + hpHealed, parseInt(char.combat.hpMax));
char.combat.hpDiceSpent = (char.combat.hpDiceSpent || 0) + hitDiceToSpend;
resultTitle = "✅ Короткий отдых завершён!";
resultDetails = "<div class='rest-comparison'><div class='before'>ХП: " + oldHp + "</div><div class='arrow'>→</div><div class='after'>ХП: " + char.combat.hpCurrent + "</div></div><p>🎲 Потрачено костей: " + hitDiceToSpend + "</p><p>❤️ Восстановлено ХП: " + hpHealed + "</p><p>📊 Доступно костей: " + (char.level - char.combat.hpDiceSpent) + "/" + char.level + "</p>";
} else if (currentRestType === "long") {
const maxHp = parseInt(char.combat.hpMax);
char.combat.hpCurrent = maxHp;
for(let i=1; i<=9; i++) { if (char.spells.slots[i]) char.spells.slotsUsed[i] = 0; }
const hitDiceToRestore = Math.floor(char.level / 2);
char.combat.hpDiceSpent = Math.max(0, (char.combat.hpDiceSpent || 0) - hitDiceToRestore);
char.conditions = [];
char.effects = [];
loadConditions();
loadEffects();
resultTitle = "✅ Долгий отдых завершён!";
resultDetails = "<div class='rest-comparison'><div class='before'>ХП: " + oldHp + "</div><div class='arrow'>→</div><div class='after'>ХП: " + maxHp + "</div></div><p>✨ Ячейки заклинаний: восстановлены</p><p>🎲 Кости хитов: восстановлено " + hitDiceToRestore + "</p><p>📊 Доступно костей: " + (char.level - char.combat.hpDiceSpent) + "/" + char.level + "</p><p>⚠️ Условия и эффекты: сняты</p>";
}
saveToLocal();
loadCharacter(currentId);
showRestResult(resultTitle, resultDetails);
}
function openLevelUpModal() {
if (!currentId) { alert("Сначала выберите персонажа!"); return; }
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const currentLevel = char.level || 1;
if (currentLevel >= 20) { alert("Максимальный уровень достигнут!"); return; }
const conMod = getMod(char.stats.con);
const className = char.class;
const hitDie = CLASS_HIT_DICE[className] || 8;
const currentMaxHP = calculateMaxHP(currentLevel, conMod, hitDie);
const newMaxHP = calculateMaxHP(currentLevel + 1, conMod, hitDie);
const hpGain = newMaxHP - currentMaxHP;
const newFeaturesContainer = document.getElementById("new-features-container");
newFeaturesContainer.innerHTML = "";
if (CLASS_FEATURES[className] && CLASS_FEATURES[className][currentLevel + 1]) {
const features = CLASS_FEATURES[className][currentLevel + 1];
features.forEach(function(f) {
const div = document.createElement("div");
div.className = "feature-item new";
div.innerHTML = "<span class=\"feature-level\">" + (currentLevel + 1) + " ур.</span><div class=\"feature-name\">" + escapeHtml(f.name) + "</div><div class=\"feature-desc\">" + escapeHtml(f.desc) + "</div>";
newFeaturesContainer.appendChild(div);
});
}
safeSet("current-level-display", currentLevel + " → " + (currentLevel + 1));
safeSet("hp-before", currentMaxHP);
safeSet("hp-after", newMaxHP + " (+" + hpGain + ")");
safeSet("dice-before", currentLevel);
safeSet("dice-after", (currentLevel + 1));
const modal = document.getElementById("levelup-modal");
if (modal) modal.classList.add("active");
}
function closeLevelUpModal() {
const modal = document.getElementById("levelup-modal");
if (modal) modal.classList.remove("active");
}
function confirmLevelUp() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const oldLevel = char.level || 1;
const oldMaxHP = parseInt(char.combat.hpMax);
char.level = oldLevel + 1;
const conMod = getMod(char.stats.con);
const className = char.class;
const hitDie = CLASS_HIT_DICE[className] || 8;
const newMaxHP = calculateMaxHP(char.level, conMod, hitDie);
const hpGain = newMaxHP - oldMaxHP;
char.combat.hpMax = newMaxHP;
char.combat.hpDice = "1к" + hitDie;
char.combat.hpCurrent = newMaxHP;
if (SPELL_SLOTS_BY_LEVEL[className] && SPELL_SLOTS_BY_LEVEL[className][char.level]) {
const slots = SPELL_SLOTS_BY_LEVEL[className][char.level];
for(let i=1; i<=9; i++) {
char.spells.slots[i] = slots[i] || 0;
char.spells.slotsUsed[i] = 0;
}
}
saveToLocal();
closeLevelUpModal();
loadCharacter(currentId);
updateClassFeatures();
renderSpellSlots();
alert("🎉 Уровень повышен!\n📊 Новый уровень: " + char.level + "\n❤️ ХП: " + oldMaxHP + " → " + newMaxHP + " (+" + hpGain + ")\n🎲 Костей хитов: " + oldLevel + " → " + char.level);
}
function openDiceModal() {
const modal = document.getElementById("dice-modal");
if (modal) modal.classList.add("active");
}
function closeDiceModal() {
const modal = document.getElementById("dice-modal");
if (modal) modal.classList.remove("active");
const display = document.getElementById("dice-result-display");
if (display) display.classList.remove("crit-success", "crit-fail", "normal");
}
function rollDice(sides) {
const result = Math.floor(Math.random() * sides) + 1;
const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
const display = document.getElementById("dice-result-display");
const resultBig = document.getElementById("dice-result-big");
const resultInfo = document.getElementById("dice-result-info");
if (!display || !resultBig || !resultInfo) return;
display.classList.remove("crit-success", "crit-fail", "normal");
void display.offsetWidth;
if (sides === 20) {
if (result === 20) {
display.classList.add("crit-success");
resultInfo.textContent = "🎉 КРИТИЧЕСКИЙ УСПЕХ! 🎉";
createParticles();
} else if (result === 1) {
display.classList.add("crit-fail");
resultInfo.textContent = "💀 КРИТИЧЕСКИЙ ПРОВАЛ! 💀";
} else {
display.classList.add("normal");
resultInfo.textContent = "Бросок d" + sides + " в " + timestamp;
}
} else {
display.classList.add("normal");
resultInfo.textContent = "Бросок d" + sides + " в " + timestamp;
}
resultBig.textContent = result;
diceHistory.unshift({ sides: sides, result: result, time: timestamp });
if (diceHistory.length > 10) diceHistory.pop();
renderDiceHistory();
}
function renderDiceHistory() {
const container = document.getElementById("dice-history");
if (!container) return;
container.innerHTML = "";
diceHistory.forEach(function(record) {
const div = document.createElement("div");
div.className = "dice-history-item";
if (record.sides === 20) {
if (record.result === 20) div.classList.add("crit-success");
else if (record.result === 1) div.classList.add("crit-fail");
}
div.innerHTML = "<span>d" + record.sides + " (" + record.time + ")</span><span>" + record.result + "</span>";
container.appendChild(div);
});
}
function createParticles() {
const display = document.getElementById("dice-result-display");
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
function filterInventory(category, btn) {
currentFilterCategory = category;
document.querySelectorAll(".inventory-filters button").forEach(function(b) { b.classList.remove("active"); });
if (btn) btn.classList.add("active");
renderInventory();
}
function renderInventory() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const container = document.getElementById("inventory-list");
if (!container) return;
container.innerHTML = "";
let allItems = [];
Object.keys(char.inventory).forEach(function(category) {
(char.inventory[category] || []).forEach(function(item, index) {
allItems.push({ category: category, index: index, item: item });
});
});
if (currentFilterCategory !== "all") {
allItems = allItems.filter(function(i) { return i.category === currentFilterCategory; });
}
if (allItems.length === 0) {
container.innerHTML = "<div class=\"inventory-empty\">📭 Нет предметов" + (currentFilterCategory !== "all" ? " в этой категории" : "") + "</div>";
return;
}
allItems.forEach(function(data) {
const item = data.item;
const icon = ITEM_ICONS[data.category];
const totalWeight = (item.weight * (item.qty || 1)).toFixed(1);
const div = document.createElement("div");
div.className = "inventory-item";
div.onclick = function() { viewItem(data.category, data.index); };
div.innerHTML = "<div class=\"inventory-item-icon\">" + icon + "</div><div class=\"inventory-item-details\"><div class=\"inventory-item-name\">" + escapeHtml(item.name) + "</div><div class=\"inventory-item-meta\"><span>📦 " + (item.qty || 1) + " шт.</span><span>⚖️ " + totalWeight + " фнт</span><span>📋 " + CATEGORY_NAMES[data.category] + "</span></div></div><div class=\"inventory-item-actions\"><button class=\"info\" onclick=\"event.stopPropagation(); editItemDirect('" + data.category + "', " + data.index + ")\">✏️</button><button class=\"danger\" onclick=\"event.stopPropagation(); deleteItemDirect('" + data.category + "', " + data.index + ")\">🗑️</button></div>";
container.appendChild(div);
});
updateInventoryWeight();
}
function editItemDirect(category, index) { openItemModal(category, index); }
function deleteItemDirect(category, index) {
if (!confirm("Удалить предмет?")) return;
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
char.inventory[category].splice(index, 1);
saveToLocal();
renderInventory();
}
function updateInventoryWeight() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
let totalWeight = 0;
Object.keys(char.inventory).forEach(function(category) {
(char.inventory[category] || []).forEach(function(item) {
totalWeight += (item.weight || 0) * (item.qty || 1);
});
});
const cp = parseInt(char.coins.cp) || 0;
const sp = parseInt(char.coins.sp) || 0;
const ep = parseInt(char.coins.ep) || 0;
const gp = parseInt(char.coins.gp) || 0;
const pp = parseInt(char.coins.pp) || 0;
const coinWeight = (cp + sp + ep + gp + pp) / 50;
totalWeight += coinWeight;
totalWeight = totalWeight.toFixed(1);
const totalWeightEl = document.getElementById("total-weight");
const carryCapacityEl = document.getElementById("carry-capacity");
const overweightWarningEl = document.getElementById("overweight-warning");
const overweightAmountEl = document.getElementById("overweight-amount");
if (totalWeightEl) totalWeightEl.textContent = totalWeight + " фнт";
const strMod = char.stats.str || 10;
const carryCapacity = strMod * 15;
if (carryCapacityEl) carryCapacityEl.textContent = "Грузоподъёмность: " + carryCapacity + " фнт";
if (totalWeightEl && overweightWarningEl && overweightAmountEl) {
if (totalWeight > carryCapacity) {
totalWeightEl.classList.add("overweight");
overweightWarningEl.classList.add("visible");
const overweightAmount = (totalWeight - carryCapacity).toFixed(1);
overweightAmountEl.textContent = overweightAmount;
} else {
totalWeightEl.classList.remove("overweight");
overweightWarningEl.classList.remove("visible");
}
}
}
function openItemModal(category, slotIndex) {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
if (!category) category = currentFilterCategory !== "all" ? currentFilterCategory : "weapon";
safeSet("item-category", category);
safeSet("item-slot-index", slotIndex);
safeSet("new-item-category", category);
const titleEl = document.getElementById("item-modal-title");
const nameEl = document.getElementById("new-item-name");
const qtyEl = document.getElementById("new-item-qty");
const weightEl = document.getElementById("new-item-weight");
const descEl = document.getElementById("new-item-desc");
if (slotIndex >= 0 && char.inventory[category] && char.inventory[category][slotIndex]) {
const item = char.inventory[category][slotIndex];
if (titleEl) titleEl.textContent = "Редактировать предмет";
if (nameEl) nameEl.value = item.name || "";
if (qtyEl) qtyEl.value = item.qty || 1;
if (weightEl) weightEl.value = item.weight || 0;
if (descEl) descEl.value = item.desc || "";
} else {
if (titleEl) titleEl.textContent = "Добавить предмет";
if (nameEl) nameEl.value = "";
if (qtyEl) qtyEl.value = 1;
if (weightEl) weightEl.value = 0;
if (descEl) descEl.value = "";
}
const modal = document.getElementById("item-modal");
if (modal) modal.classList.add("active");
}
function closeItemModal() {
const modal = document.getElementById("item-modal");
if (modal) modal.classList.remove("active");
}
function submitItem() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const category = document.getElementById("new-item-category")?.value || document.getElementById("item-category")?.value || "weapon";
const slotIndex = parseInt(document.getElementById("item-slot-index")?.value) || -1;
const name = document.getElementById("new-item-name")?.value?.trim() || "";
if (!name) { alert("Введите название!"); return; }
const newItem = {
name: name,
qty: parseInt(document.getElementById("new-item-qty")?.value) || 1,
weight: parseFloat(document.getElementById("new-item-weight")?.value) || 0,
desc: document.getElementById("new-item-desc")?.value || ""
};
if (!char.inventory[category]) char.inventory[category] = [];
if (slotIndex >= 0 && char.inventory[category][slotIndex]) {
char.inventory[category][slotIndex] = newItem;
} else {
char.inventory[category].push(newItem);
}
saveToLocal();
closeItemModal();
renderInventory();
}
function viewItem(category, index) {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const item = char.inventory[category][index];
currentViewItem = { category: category, index: index };
const iconEl = document.getElementById("view-item-icon");
const nameEl = document.getElementById("view-item-name");
const qtyEl = document.getElementById("view-item-qty");
const weightEl = document.getElementById("view-item-weight");
const totalWeightEl = document.getElementById("view-item-total-weight");
const categoryEl = document.getElementById("view-item-category");
const descEl = document.getElementById("view-item-desc");
if (iconEl) iconEl.textContent = ITEM_ICONS[category];
if (nameEl) nameEl.textContent = item.name || "Без названия";
if (qtyEl) qtyEl.textContent = (item.qty || 1) + " шт.";
if (weightEl) weightEl.textContent = (item.weight || 0) + " фнт";
if (totalWeightEl) totalWeightEl.textContent = ((item.weight || 0) * (item.qty || 1)).toFixed(1) + " фнт";
if (categoryEl) categoryEl.textContent = CATEGORY_NAMES[category];
if (descEl) descEl.textContent = item.desc || "Нет описания";
const modal = document.getElementById("item-view-modal");
if (modal) modal.classList.add("active");
}
function closeItemView() {
const modal = document.getElementById("item-view-modal");
if (modal) modal.classList.remove("active");
currentViewItem = null;
}
function editItemFromView() {
if (!currentViewItem) return;
closeItemView();
openItemModal(currentViewItem.category, currentViewItem.index);
}
function deleteItemFromView() {
if (!currentViewItem || !currentId) return;
if (!confirm("Удалить предмет?")) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
char.inventory[currentViewItem.category].splice(currentViewItem.index, 1);
saveToLocal();
closeItemView();
renderInventory();
}
function renderWeaponPresets() {
const container = document.getElementById("weapon-presets-list");
if (!container) return;
container.innerHTML = "";
WEAPON_PRESETS.forEach(function(preset) {
const btn = document.createElement("button");
btn.className = "weapon-preset-btn";
btn.innerHTML = "<b>" + escapeHtml(preset.name) + "</b><br>" + escapeHtml(preset.damage) + " " + escapeHtml(preset.type);
btn.onclick = function() { fillWeaponPreset(preset); };
container.appendChild(btn);
});
}
function fillWeaponPreset(preset) {
safeSet("new-weapon-name", preset.name);
safeSet("new-weapon-stat", preset.stat);
safeSet("new-weapon-damage", preset.damage);
safeSet("new-weapon-type", preset.type);
safeSet("new-weapon-range", preset.range);
safeSet("new-weapon-notes", preset.notes);
if (currentId) {
const char = characters.find(function(c) { return c.id === currentId; });
if (char) {
const proficiencyBonus = getProficiencyBonus(char.level);
let statMod = 0;
if (preset.stat === "str") statMod = getMod(char.stats.str);
else if (preset.stat === "dex") statMod = getMod(char.stats.dex);
safeSet("new-weapon-bonus", "+" + (proficiencyBonus + statMod));
}
}
}
function openWeaponModal() {
const modal = document.getElementById("weapon-modal");
if (modal) modal.classList.add("active");
}
function closeWeaponModal() {
const modal = document.getElementById("weapon-modal");
if (modal) modal.classList.remove("active");
safeSet("new-weapon-name", "");
safeSet("new-weapon-bonus", "");
safeSet("new-weapon-damage", "");
safeSet("new-weapon-type", "");
safeSet("new-weapon-range", "");
safeSet("new-weapon-notes", "");
}
function submitWeapon() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const name = document.getElementById("new-weapon-name")?.value?.trim() || "";
if (!name) { alert("Введите название!"); return; }
const stat = document.getElementById("new-weapon-stat")?.value || "str";
const statName = stat === "str" ? "СИЛ" : "ЛОВ";
if (!char.weapons) char.weapons = [];
char.weapons.push({
name: name,
stat: stat,
statName: statName,
bonus: document.getElementById("new-weapon-bonus")?.value || "",
damage: document.getElementById("new-weapon-damage")?.value || "",
type: document.getElementById("new-weapon-type")?.value || "",
range: document.getElementById("new-weapon-range")?.value || "",
notes: document.getElementById("new-weapon-notes")?.value || ""
});
saveToLocal();
closeWeaponModal();
renderWeapons();
}
function renderWeapons() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const container = document.getElementById("weapons-list");
if (!container) return;
if (!char.weapons || char.weapons.length === 0) {
container.innerHTML = '<p style="color:var(--text-muted); text-align:center;">Нет оружия</p>';
return;
}
container.innerHTML = "";
char.weapons.forEach(function(weapon, index) {
const div = document.createElement("div");
div.className = "weapon-row";
div.innerHTML = "<h4>" + escapeHtml(weapon.name) + " <button class=\"danger small\" onclick=\"removeWeapon(" + index + ")\">✕</button></h4><div class=\"weapon-stats\"><span>📊 " + escapeHtml(weapon.statName) + "</span><span>⚔️ " + escapeHtml(weapon.bonus || "-") + "</span><span>🗡️ " + escapeHtml(weapon.damage || "-") + "</span><span>" + escapeHtml(weapon.type || "") + "</span><span>📏 " + escapeHtml(weapon.range || "") + "</span></div>" + (weapon.notes ? "<p style=\"font-size:0.75em; color:var(--text-muted); margin-top:5px;\">" + escapeHtml(weapon.notes) + "</p>" : "");
container.appendChild(div);
});
}
function removeWeapon(index) {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
char.weapons.splice(index, 1);
saveToLocal();
renderWeapons();
}
function renderSpellSlots() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const container = document.getElementById("spell-slots-visual");
if (!container) return;
container.innerHTML = "";
for(let i=1; i<=9; i++) {
const total = char.spells.slots[i] || 0;
const group = document.createElement("div");
group.className = "spell-slot-group";
group.innerHTML = "<h4>" + i + " ур.</h4><div class=\"spell-diamonds\" id=\"slots-diamonds-" + i + "\"></div><div class=\"spell-slot-controls\"><div class=\"spell-slot-input\"><input type=\"number\" id=\"slots-" + i + "-total\" value=\"" + total + "\" min=\"0\" max=\"10\" oninput=\"updateSpellSlots(" + i + ", this.value)\"></div><div class=\"spell-slot-btn-row\"><button class=\"spell-slot-btn\" onclick=\"adjustSpellSlots(" + i + ", -1)\">−</button><button class=\"spell-slot-btn\" onclick=\"adjustSpellSlots(" + i + ", 1)\">+</button></div></div>";
container.appendChild(group);
const diamondsContainer = document.getElementById("slots-diamonds-" + i);
if (diamondsContainer) {
for(let j=0; j<total; j++) {
const diamond = document.createElement("div");
diamond.className = "spell-diamond" + (j < (char.spells.slotsUsed[i] || 0) ? " used" : "");
diamond.onclick = function() { toggleSpellSlot(i, j); };
diamondsContainer.appendChild(diamond);
}
if (total === 0) diamondsContainer.innerHTML = "<span style=\"font-size:0.7em; color:var(--text-muted);\">Нет ячеек</span>";
}
}
}
function updateSpellSlots(level, value) {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
char.spells.slots[level] = parseInt(value) || 0;
// 🔧 ИСПРАВЛЕНИЕ: Использованные ячейки не могут превышать общее количество
if (char.spells.slotsUsed[level] > char.spells.slots[level]) {
char.spells.slotsUsed[level] = char.spells.slots[level];
}
saveToLocal();
renderSpellSlots();
}
function toggleSpellSlot(level, index) {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
if (!char.spells.slotsUsed[level]) char.spells.slotsUsed[level] = 0;
if (index < char.spells.slotsUsed[level]) char.spells.slotsUsed[level] = index;
else char.spells.slotsUsed[level] = index + 1;
saveToLocal();
renderSpellSlots();
}
function adjustSpellSlots(level, delta) {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const input = document.getElementById('slots-' + level + '-total');
let current = input ? parseInt(input.value) : (char.spells.slots[level] || 0);
if (isNaN(current)) current = char.spells.slots[level] || 0;
let newValue = current + delta;
if (newValue < 0) newValue = 0;
if (newValue > 10) newValue = 10;
char.spells.slots[level] = newValue;
// 🔧 ИСПРАВЛЕНИЕ: Синхронизация использованных ячеек
if (char.spells.slotsUsed[level] > newValue) {
char.spells.slotsUsed[level] = newValue;
}
saveToLocal();
renderSpellSlots();
}
function setSpellVersion(version) {
currentSpellVersion = version;
document.querySelectorAll(".version-btn").forEach(function(btn) { btn.classList.remove("active"); });
if(version === "all") document.getElementById("btn-ver-all")?.classList.add("active");
if(version === "PH14") document.getElementById("btn-ver-ph14")?.classList.add("active");
if(version === "PH24") document.getElementById("btn-ver-ph24")?.classList.add("active");
renderSpellSearch();
}
function setSpellClass(cls) {
currentSpellClass = cls;
document.querySelectorAll("#spell-search-modal .version-btn").forEach(function(btn) { btn.classList.remove("active"); });
if(cls === "all") document.getElementById("btn-class-all")?.classList.add("active");
if(cls === "wizard") document.getElementById("btn-class-wizard")?.classList.add("active");
if(cls === "druid") document.getElementById("btn-class-druid")?.classList.add("active");
renderSpellSearch();
}
function openSpellSearch() {
const modal = document.getElementById("spell-search-modal");
if (modal) modal.classList.add("active");
safeSet("spell-search-input", "");
safeSet("spell-search-level", "");
renderSpellSearch();
}
function closeSpellSearch() {
const modal = document.getElementById("spell-search-modal");
if (modal) modal.classList.remove("active");
}
function openAddSpellForm() {
const modal = document.getElementById("add-spell-modal");
if (modal) modal.classList.add("active");
safeSet("new-spell-name", "");
safeSet("new-spell-desc", "");
safeSet("new-spell-higher", "");
}
function closeAddSpellForm() {
const modal = document.getElementById("add-spell-modal");
if (modal) modal.classList.remove("active");
}
function submitNewSpell() {
const name = document.getElementById("new-spell-name")?.value?.trim() || "";
const desc = document.getElementById("new-spell-desc")?.value?.trim() || "";
if (!name || !desc) { alert("Название и описание обязательны!"); return; }
const newSpell = {
id: Date.now(),
name: name,
level: parseInt(document.getElementById("new-spell-level")?.value) || 0,
class: document.getElementById("new-spell-class")?.value || "wizard",
source: document.getElementById("new-spell-source")?.value || "PH14",
school: "воплощение",
time: document.getElementById("new-spell-time")?.value || "1 действие",
range: document.getElementById("new-spell-range")?.value || "60 фт",
components: document.getElementById("new-spell-components")?.value || "V,S",
duration: document.getElementById("new-spell-duration")?.value || "Мгновенно",
desc: desc,
higherLevel: document.getElementById("new-spell-higher")?.value?.trim() || ""
};
SPELL_DATABASE.push(newSpell);
saveToLocal();
closeAddSpellForm();
alert("Добавлено!");
renderSpellSearch();
}
function renderSpellSearch() {
const search = (document.getElementById("spell-search-input")?.value || "").toLowerCase();
const level = document.getElementById("spell-search-level")?.value || "";
const container = document.getElementById("spell-search-results");
if (!container) return;
const char = characters.find(function(c) { return c.id === currentId; });
let filtered = SPELL_DATABASE.filter(function(spell) {
const matchesSearch = spell.name.toLowerCase().includes(search);
const matchesLevel = level === "" || spell.level.toString() === level;
const matchesVersion = currentSpellVersion === "all" || spell.source === currentSpellVersion;
const matchesClass = currentSpellClass === "all" || spell.class === "both" || spell.class === currentSpellClass;
return matchesSearch && matchesLevel && matchesVersion && matchesClass;
});
container.innerHTML = "";
if (filtered.length === 0) {
container.innerHTML = '<p style="color:var(--text-muted); text-align:center;">Не найдено</p>';
return;
}
filtered.forEach(function(spell) {
const isAdded = char?.spells?.mySpells && char.spells.mySpells.some(function(s) { return s.id === spell.id; });
const classBadge = spell.class === "wizard" ? "class-wizard" : spell.class === "druid" ? "class-druid" : "class-both";
const classText = spell.class === "wizard" ? "🧙" : spell.class === "druid" ? "🌿" : "🧙";
const div = document.createElement("div");
div.className = "spell-item" + (isAdded ? " spell-added" : "");
div.innerHTML = "<h4>" + escapeHtml(spell.name) + " <span class=\"source-badge source-" + spell.source.toLowerCase() + "\">" + escapeHtml(spell.source) + "</span> <span class=\"class-badge " + classBadge + "\">" + classText + "</span></h4><div class=\"spell-meta\"><span>" + (spell.level > 0 ? spell.level + " ур." : "Заговор") + "</span><span>" + escapeHtml(spell.time) + "</span><span>" + escapeHtml(spell.range) + "</span><span>" + escapeHtml(spell.components) + "</span></div><p>" + escapeHtml(spell.desc) + "</p>" + (spell.higherLevel ? "<p class=\"spell-higher\">" + escapeHtml(spell.higherLevel) + "</p>" : "") + "<button class=\"" + (isAdded ? "secondary" : "small") + "\" onclick=\"" + (isAdded ? "removeSpell(" + spell.id + ")" : "addSpell(" + spell.id + ")") + "\" style=\"margin-top:8px;\">" + (isAdded ? "Добавлено" : "+ Добавить") + "</button>";
container.appendChild(div);
});
}
function addSpell(spellId) {
const char = characters.find(function(c) { return c.id === currentId; });
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
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
char.spells.mySpells = char.spells.mySpells.filter(function(s) { return s.id !== spellId; });
saveToLocal();
renderSpellSearch();
renderMySpells();
}
function renderMySpells() {
if (!currentId) return;
const char = characters.find(function(c) { return c.id === currentId; });
if (!char) return;
const container = document.getElementById("my-spells-list");
if (!container) return;
if (!char.spells.mySpells || char.spells.mySpells.length === 0) {
container.innerHTML = '<p style="color:var(--text-muted); text-align:center;">Нет заклинаний</p>';
return;
}
const byLevel = {};
char.spells.mySpells.forEach(function(spell) {
const lvl = spell.level;
if (!byLevel[lvl]) byLevel[lvl] = [];
byLevel[lvl].push(spell);
});
container.innerHTML = "";
Object.keys(byLevel).sort().forEach(function(level) {
const levelTitle = level == 0 ? "Заговоры" : level + " уровень";
const groupDiv = document.createElement("div");
groupDiv.innerHTML = '<h4 style="margin:15px 0 10px 0; color:var(--accent-color);">' + escapeHtml(levelTitle) + "</h4>";
container.appendChild(groupDiv);
byLevel[level].forEach(function(spell) {
const classBadge = spell.class === "wizard" ? "class-wizard" : spell.class === "druid" ? "class-druid" : "class-both";
const classText = spell.class === "wizard" ? "🧙" : spell.class === "druid" ? "🌿" : "🧙";
const div = document.createElement("div");
div.className = "my-spell-item";
div.innerHTML = "<div class=\"spell-info\"><div class=\"spell-name\">" + escapeHtml(spell.name) + " <span class=\"source-badge source-" + spell.source.toLowerCase() + "\">" + escapeHtml(spell.source) + "</span> <span class=\"class-badge " + classBadge + "\">" + classText + "</span></div><div class=\"spell-level\">" + escapeHtml(spell.time) + " | " + escapeHtml(spell.range) + "</div><div class=\"spell-full-desc\">" + escapeHtml(spell.desc) + "</div>" + (spell.higherLevel ? "<div class=\"spell-higher\">" + escapeHtml(spell.higherLevel) + "</div>" : "") + "</div><button class=\"danger small\" onclick=\"removeSpell(" + spell.id + ")\" style=\"margin-left:10px; width:auto;\">X</button>";
container.appendChild(div);
});
});
}
// 🔧 ИСПРАВЛЕНИЕ: Добавлен префикс "data:" для экспорта
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
alert("Загружено!");
} else {
alert("Ошибка формата");
}
} catch (err) {
alert("Ошибка чтения");
}
};
reader.readAsText(file);
}
// 🔧 ИСПРАВЛЕНИЕ: Добавлен префикс "data:" для экспорта заклинаний
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
alert("Заклинаний: " + imported.length);
} else {
alert("Ошибка формата");
}
} catch (err) {
alert("Ошибка чтения");
}
};
reader.readAsText(file);

// ============================================================
// Регистрация Service Worker для PWA (офлайн-режим)
// ============================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js')
      .then(function(reg) { console.log('[PWA] Service Worker зарегистрирован:', reg.scope); })
      .catch(function(err) { console.log('[PWA] Ошибка регистрации SW:', err); });
  });
}
