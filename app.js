// ============================================================
// app.js — Логика приложения D&D 5e Character Sheet
// Все функции, состояние, обработчики событий
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
let hpHistory = [];
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
// ============================================================
// МИГРАЦИИ СХЕМЫ ПЕРСОНАЖА
// Запускается при загрузке для каждого персонажа.
// Добавляет недостающие поля из новых версий без потери данных.
// Когда добавляешь новое поле в DEFAULT_CHARACTER — добавь его
// и сюда, в соответствующую миграцию (или создай новую).
// ============================================================
function migrateCharacter(char) {
  var v = char.schemaVersion || 0;

  // v0 → v1: поля companions, feats, asiUsedLevels, journal, party, battle, updatedAt
  if (v < 1) {
    if (!char.companions)    char.companions    = [];
    if (!char.feats)         char.feats         = [];
    if (!char.asiUsedLevels) char.asiUsedLevels = [];
    if (!char.journal)       char.journal       = [];
    if (!char.party)         char.party         = { allies:[], monsters:[], npcs:[] };
    if (!char.battle)        char.battle        = { active:false, participants:[], currentTurn:0 };
    if (!char.updatedAt)     char.updatedAt     = char.id || Date.now();
    // Вложенные поля combat
    if (!char.combat)        char.combat        = {};
    if (char.combat.hpDiceSpent  === undefined) char.combat.hpDiceSpent  = 0;
    if (char.combat.hpTemp       === undefined) char.combat.hpTemp       = 0;
    if (char.combat.armorId      === undefined) char.combat.armorId      = "none";
    if (char.combat.hasShield    === undefined) char.combat.hasShield    = false;
    // Вложенные поля proficiencies
    if (!char.proficiencies)         char.proficiencies         = {};
    if (!char.proficiencies.armor)   char.proficiencies.armor   = [];
    if (!char.proficiencies.weapon)  char.proficiencies.weapon  = [];
    if (char.proficiencies.tools     === undefined) char.proficiencies.tools     = "";
    if (char.proficiencies.languages === undefined) char.proficiencies.languages = "";
    // Вложенные поля spells
    if (!char.spells) char.spells = { slots:{}, slotsUsed:{}, mySpells:[], stat:"", dc:0, attack:0, mod:0 };
    if (!char.spells.mySpells)  char.spells.mySpells  = [];
    if (!char.spells.slots)     char.spells.slots     = {};
    if (!char.spells.slotsUsed) char.spells.slotsUsed = {};
    // Поля верхнего уровня
    if (char.conditions  === undefined) char.conditions  = [];
    if (char.effects     === undefined) char.effects     = [];
    if (char.saves       === undefined) char.saves       = {};
    if (char.skills      === undefined) char.skills      = {};
    if (char.coins       === undefined) char.coins       = { cp:0, sp:0, ep:0, gp:0, pp:0 };
    if (!char.deathSaves) char.deathSaves = { successes:[false,false,false], failures:[false,false,false] };
    if (!char.inventory)  char.inventory  = { weapon:[], armor:[], potion:[], scroll:[], tool:[], material:[], other:[] };
    if (!char.weapons)    char.weapons    = [];
    if (char.notes       === undefined) char.notes       = "";
    if (char.features    === undefined) char.features    = "";
    if (char.appearance  === undefined) char.appearance  = "";
    if (char.magicItems  === undefined) char.magicItems  = "";
    char.schemaVersion = 1;
  }

  // Место для будущих миграций:
  // if (v < 2) {
  //   char.newField = defaultValue;
  //   char.schemaVersion = 2;
  // }

  return char;
}

window.onload = function() {
try {
const saved = localStorage.getItem("dnd_chars");
const savedSpells = localStorage.getItem("dnd_spells");
const savedHpHistory = localStorage.getItem("dnd_hp_history");
if (saved) {
  characters = JSON.parse(saved);
  // Прогоняем миграции для каждого персонажа
  var migrated = false;
  characters = characters.map(function(char) {
    var before = char.schemaVersion || 0;
    var after  = migrateCharacter(char);
    if ((after.schemaVersion || 0) > before) migrated = true;
    return after;
  });
  // Если хоть один персонаж мигрировал — сразу сохраняем
  if (migrated) {
    try { localStorage.setItem("dnd_chars", JSON.stringify(characters)); } catch(e) {}
  }
}
if (savedSpells) SPELL_DATABASE = JSON.parse(savedSpells);
if (savedHpHistory) hpHistory = JSON.parse(savedHpHistory);
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
const grid = $("saves-grid");
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
const char = getCurrentChar();
if (!char) return;
const className = $("char-class")?.value || "";
if (!className) return;

// ── ИСПРАВЛЕНИЕ: сначала СНИМАЕМ все спасброски, затем ставим новые ──────
SAVES_DATA.forEach(function(save) {
  const checkbox = $("save-prof-" + save.key);
  if (checkbox) checkbox.checked = false;
  if (char.saves) char.saves[save.key] = false;
});

// Ставим спасброски нового класса
if (CLASS_SAVE_PROFICIENCIES[className]) {
  CLASS_SAVE_PROFICIENCIES[className].forEach(function(saveKey) {
    const checkbox = $("save-prof-" + saveKey);
    if (checkbox) { checkbox.checked = true; }
    if (char.saves) char.saves[saveKey] = true;
  });
}

// Авто-владения бронёй и оружием по классу
if (CLASS_ARMOR_PROFS && CLASS_ARMOR_PROFS[className]) {
  const profs = CLASS_ARMOR_PROFS[className];
  char.proficiencies.armor  = profs.armor  ? profs.armor.slice()  : [];
  char.proficiencies.weapon = profs.weapon ? profs.weapon.slice() : [];
  // Sync checkboxes
  ["light","medium","heavy","shield"].forEach(function(t) {
    safeSetChecked("armor-" + t, char.proficiencies.armor.includes(t));
  });
  ["simple","martial"].forEach(function(t) {
    safeSetChecked("weapon-" + t, char.proficiencies.weapon.includes(t));
  });
}

calcStats();
calculateAC();
}
function initSkills() {
const container = $("skills-container");
if (!container) return;
container.innerHTML = "";
skills.forEach(function(skill, index) {
const row = document.createElement("div");
row.className = "skill-row-compact";
row.innerHTML =
  '<input type="checkbox" id="skill-prof-' + index + '" class="skill-cb" onchange="calcStats(); updateSkillProfCount()">' +
  '<label for="skill-prof-' + index + '" class="skill-name-compact">' + escapeHtml(skill.name) + '</label>' +
  '<span class="skill-stat-compact">' + escapeHtml(skill.stat.toUpperCase().slice(0,3)) + '</span>' +
  '<span class="skill-bonus-compact" id="skill-bonus-' + index + '">+0</span>';
container.appendChild(row);
});
}
function updateSkillProfCount() {
const countEl = $("skills-prof-count");
if (!countEl) return;
var count = 0;
for (var i = 0; i < skills.length; i++) {
  var cb = $("skill-prof-" + i);
  if (cb && cb.checked) count++;
}
countEl.textContent = count > 0 ? count + " ✓" : "";
}
function updateClassFeatures() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const className = char.class;
const level = char.level;
const featuresSection = $("class-features-section");
const featuresGrid = $("features-grid");
const asiContainer = $("asi-container");
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
// ASI levels for class (Fighter gets more)
var classAsiLevels = (char.class === "Воин")   ? [4,6,8,12,14,16,19] :
                     (char.class === "Плут")    ? [4,8,10,12,16,19]   :
                     [4,8,12,16,19];
// Which levels have been earned so far
var earnedASI = classAsiLevels.filter(function(l) { return l <= level; });
// Which have already been spent
if (!char.asiUsedLevels) char.asiUsedLevels = [];
// Unused = earned but not yet spent
var unusedASI = earnedASI.filter(function(l) {
  return !char.asiUsedLevels.includes(l);
});

if (unusedASI.length > 0) {
  asiContainer.innerHTML =
    '<div class="asi-available-wrap">' +
    unusedASI.map(function(l) {
      return '<button class="asi-button asi-level-btn" onclick="openASIModalForLevel(' + l + ')">' +
        '<div class="asi-btn-left">' +
          '<span class="asi-btn-title">📈 Увеличение характеристик · ' + l + ' ур.</span>' +
          '<span class="asi-btn-hint">+2 к одной характеристике, +1+1 к двум или черта PHB</span>' +
        '</div>' +
        '<span class="asi-btn-arrow">›</span>' +
        '</button>';
    }).join("") +
    '</div>';
} else if (earnedASI.length > 0) {
  // All used — show greyed out summary
  asiContainer.innerHTML =
    '<div class="asi-all-used">✅ Все АСИ применены (ур. ' + earnedASI.join(", ") + ')</div>';
} else {
  asiContainer.innerHTML = "";
}
renderClassResources();
}
function initConditions() {
const grid = $("conditions-grid");
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
const char = getCurrentChar();
if (!char) return;
if (!char.conditions) char.conditions = [];
const index = char.conditions.indexOf(conditionId);
const conditionEl = $("condition-" + conditionId);
if (index > -1) {
char.conditions.splice(index, 1);
if (conditionEl) conditionEl.classList.remove("active");
} else {
char.conditions.push(conditionId);
if (conditionEl) conditionEl.classList.add("active");
}
updateConditionsCount();
updateStatusBar();
calculateAC();
saveToLocal();
}
function updateConditionsCount() {
if (!currentId) return;
const char = getCurrentChar();
const countEl = $("conditions-count");
if (!countEl) return;
const count = char.conditions ? char.conditions.length : 0;
countEl.textContent = count;
countEl.style.display = count > 0 ? "inline-block" : "none";
}
function loadConditions() {
if (!currentId) return;
const char = getCurrentChar();
if (!char || !char.conditions) return;
CONDITIONS.forEach(function(condition) {
const conditionEl = $("condition-" + condition.id);
if (char.conditions.includes(condition.id)) {
if (conditionEl) conditionEl.classList.add("active");
} else {
if (conditionEl) conditionEl.classList.remove("active");
}
});
updateConditionsCount();
updateStatusBar();
}
function initEffects() {
const grid = $("effects-grid");
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
const char = getCurrentChar();
if (!char) return;
if (!char.effects) char.effects = [];
const index = char.effects.indexOf(effectId);
const effectEl = $("effect-" + effectId);
if (index > -1) {
char.effects.splice(index, 1);
if (effectEl) effectEl.classList.remove("active");
} else {
char.effects.push(effectId);
if (effectEl) effectEl.classList.add("active");
}
updateEffectsCount();
updateStatusBar();
calculateAC();
saveToLocal();
}
function updateEffectsCount() {
if (!currentId) return;
const char = getCurrentChar();
const countEl = $("effects-count");
if (!countEl) return;
const count = char.effects ? char.effects.length : 0;
countEl.textContent = count;
countEl.style.display = count > 0 ? "inline-block" : "none";
}
function loadEffects() {
if (!currentId) return;
const char = getCurrentChar();
if (!char || !char.effects) return;
EFFECTS_DATA.forEach(function(effect) {
const effectEl = $("effect-" + effect.id);
if (char.effects.includes(effect.id)) {
if (effectEl) effectEl.classList.add("active");
} else {
if (effectEl) effectEl.classList.remove("active");
}
});
updateEffectsCount();
updateStatusBar();
}
// 🔧 ИСПРАВЛЕНИЕ: Защита от undefined в calculateAC()
function calculateAC() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const dexMod = getMod(char.stats.dex);
const conMod = getMod(char.stats.con);
const wisMod = getMod(char.stats.wis);

// ── Если выбрана конкретная броня из пресетов ─────────────────────────────
const armorId = char.combat && char.combat.armorId;
const hasShieldSelected = char.combat && char.combat.hasShield;
if (armorId && armorId !== "none" && armorId !== "custom" && typeof ARMOR_PRESETS !== "undefined") {
  const preset = ARMOR_PRESETS.find(function(a) { return a.id === armorId; });
  if (preset) {
    const dexBonus = preset.dexCap >= 99 ? dexMod : Math.min(dexMod, preset.dexCap);
    let ac = preset.baseAC + dexBonus;
    let formulaParts = [preset.name + " (" + preset.baseAC + ")"];
    if (dexBonus !== 0) formulaParts.push((dexBonus > 0 ? "+" : "") + dexBonus + " (ЛОВ)");
    let modifiers = [];
    if (hasShieldSelected) { ac += 2; formulaParts.push("+2 (щит)"); modifiers.push({name:"Щит",value:2,type:"active"}); }
    // Apply magic effects on top
    if (char.effects) {
      char.effects.forEach(function(effectId) {
        const effect = EFFECTS_DATA.find(function(e) { return e.id === effectId; });
        if (effect && effect.acBonus && !["mage_armor","monk_unarmored","barbarian_unarmored"].includes(effectId)) {
          ac += effect.acBonus;
          formulaParts.push((effect.acBonus > 0 ? "+" : "") + effect.acBonus + " (" + effect.name + ")");
          modifiers.push({name: effect.name, value: effect.acBonus, type: effect.acBonus > 0 ? "active" : "negative"});
        }
      });
    }
    const acTotalEl = $("ac-total");
    const acFormulaEl = $("ac-formula");
    const combatAcEl = $("combat-ac");
    const acModsEl = $("ac-modifiers");
    if (acTotalEl) acTotalEl.textContent = ac;
    if (acFormulaEl) acFormulaEl.textContent = formulaParts.join(" ");
    if (combatAcEl) combatAcEl.value = ac;
    if (acModsEl) {
      acModsEl.innerHTML = modifiers.map(function(mod) {
        return "<div class=\"ac-modifier-item" + (mod.type === "negative" ? " negative" : "") + "\"><span>" + escapeHtml(mod.name) + "</span><span class=\"ac-modifier-value\">" + (mod.value >= 0 ? "+" : "") + mod.value + "</span></div>";
      }).join("");
    }
    $("status-ac").textContent = ac;
    char.combat.ac = ac;
    return;
  }
}

// ── Режим "вручную" или без брони — старая логика ────────────────────────
let ac = 10;
let formulaParts = ["10 (база)"];
let modifiers = [];
const hasMageArmor = char.effects && char.effects.includes('mage_armor');
const hasMonkUnarmored = char.effects && char.effects.includes('monk_unarmored');
const hasBarbarianUnarmored = char.effects && char.effects.includes('barbarian_unarmored');
const isBarbarian = char.class === "Варвар";
const isMonk = char.class === "Монах";
const hasArmorProf = char.proficiencies && char.proficiencies.armor && Array.isArray(char.proficiencies.armor);
const hasLightArmor = hasArmorProf && char.proficiencies.armor.includes('light');
const hasMediumArmor = hasArmorProf && char.proficiencies.armor.includes('medium');
const hasHeavyArmor = hasArmorProf && char.proficiencies.armor.includes('heavy');
const hasShield = (hasArmorProf && char.proficiencies.armor.includes('shield')) || hasShieldSelected;
if (hasBarbarianUnarmored || (isBarbarian && !hasLightArmor && !hasMediumArmor && !hasHeavyArmor)) {
ac = 10 + dexMod + conMod;
formulaParts = ["10 (база)", "+" + dexMod + " (ЛОВ)", "+" + conMod + " (ТЕЛ)"];
modifiers.push({name: "Без доспехов варвара", value: ac - 10, type: "active"});
}
else if (hasMonkUnarmored || (isMonk && !hasLightArmor && !hasMediumArmor && !hasHeavyArmor)) {
ac = 10 + dexMod + wisMod;
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
$("ac-total").textContent = ac;
$("ac-formula").textContent = formulaParts.join(" ");
$("combat-ac").value = ac;
const modifiersContainer = $("ac-modifiers");
modifiersContainer.innerHTML = "";
modifiers.forEach(function(mod) {
const modDiv = document.createElement("div");
modDiv.className = "ac-modifier-item" + (mod.type === "negative" ? " negative" : "");
modDiv.innerHTML = "<span>" + escapeHtml(mod.name) + "</span><span class=\"ac-modifier-value\">" + (mod.value >= 0 ? "+" : "") + mod.value + "</span>";
modifiersContainer.appendChild(modDiv);
});
$("status-ac").textContent = ac;
char.combat.ac = ac;
}
function updateStatusBar() {
const statusBar = $("status-bar");
if (!currentId) {
if (statusBar) statusBar.classList.remove("visible");
return;
}
const char = getCurrentChar();
if (!char) return;
if (statusBar) statusBar.classList.add("visible");
$("status-level").textContent = char.level || 1;
const hpCurrent = char.combat.hpCurrent || 0;
const hpMax = char.combat.hpMax || 10;
$("status-hp-current").textContent = hpCurrent;
$("status-hp-max").textContent = hpMax;
// Динамический цвет ХП
const hpPercent = hpMax > 0 ? Math.round((hpCurrent / hpMax) * 100) : 100;
const statusHpEl = document.querySelector(".status-hp");
if (statusHpEl) {
  statusHpEl.classList.remove("hp-critical", "hp-low", "hp-ok");
  if (hpPercent <= 25) statusHpEl.classList.add("hp-critical");
  else if (hpPercent <= 50) statusHpEl.classList.add("hp-low");
  else statusHpEl.classList.add("hp-ok");
}
const conditionsContainer = $("status-conditions");
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
localStorage.setItem("dnd_hp_history", JSON.stringify(hpHistory));
} catch(e) { console.log("Ошибка сохранения:", e); }
}
function showScreen(screenName) {
const charactersScreen = $("screen-characters");
const characterScreen = $("screen-character");
const characterTabs = $("character-tabs");
const statusBar = $("status-bar");
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
$("header-title").textContent = "🎭 Мой Персонаж D&D 5e";
return;
}
const char = getCurrentChar();
if (char && char.name) {
$("header-title").textContent = "🎭 " + escapeHtml(char.name);
} else {
$("header-title").textContent = "🎭 Мой Персонаж D&D 5e";
}
}
function switchTab(tabName, btnEl) {
document.querySelectorAll(".tab-content").forEach(function(tab) { tab.classList.remove("active"); });
document.querySelectorAll(".tab-btn").forEach(function(btn) { btn.classList.remove("active"); });
var tabElement = $("tab-" + tabName);
if (tabElement) tabElement.classList.add("active");
var activeBtn = btnEl ? btnEl.closest(".tab-btn") : null;
if (activeBtn) activeBtn.classList.add("active");
try { localStorage.setItem("dnd_last_tab", tabName); } catch(e) {}
if (tabName === "party")  { openPartyTab(); }
if (tabName === "battle") { openBattleTab(); }
if (tabName === "journal") { renderJournal(); }
}
function updateStatDisplay(stat) {
  var inp = $("val-" + stat);
  var disp = $("val-display-" + stat);
  if (inp && disp) disp.textContent = inp.value || "10";
}
function updateAllStatDisplays() {
  ["str","dex","con","int","wis","cha"].forEach(updateStatDisplay);
}

function adjustStat(stat, delta) {
const input = $("val-" + stat);
if (!input) return;
let value = parseInt(input.value) || 10;
value += delta;
if (value < 1) value = 1;
if (value > 30) value = 30;
input.value = value;
updateStatDisplay(stat);
// Haptic feedback on mobile
if (navigator.vibrate) navigator.vibrate(delta > 0 ? 15 : 8);
if (stat === "str" || stat === "con") {
calcStats();
recalculateHP();
} else {
calcStats();
}
calculateAC();
}
function adjustCoin(coinType, delta) {
const input = $("coin-" + coinType);
if (!input) return;
let value = parseInt(input.value) || 0;
value += delta;
if (value < 0) value = 0;
input.value = value;
updateChar();
}
function updateSubclassOptions() {
const classSelect = $("char-class");
const subclassSelect = $("char-subclass");
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
const level1HP = hitDie + conMod;
const avgPerLevel = Math.floor(hitDie / 2) + 1;
const additionalHP = (level - 1) * (avgPerLevel + conMod);
return level1HP + additionalHP;
}
function recalculateHP() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const levelEl = $("char-level");
const conEl = $("val-con");
const classEl = $("char-class");
const hpMaxEl = $("hp-max");
const hpDiceEl = $("hp-dice");
const hpDiceAvailableEl = $("hp-dice-available");
if (!levelEl || !conEl || !classEl) return;
const level = parseInt(levelEl.value) || 1;
const conMod = getMod(parseInt(conEl.value) || 10);
const className = classEl.value;
const hitDie = CLASS_HIT_DICE[className] || 8;
const newMaxHP = calculateMaxHP(level, conMod, hitDie);
if (hpMaxEl) hpMaxEl.value = newMaxHP;
// Also update the visible manual field (only if not actively editing it)
const hpMaxManualEl = $("hp-max-manual");
if (hpMaxManualEl && document.activeElement !== hpMaxManualEl) hpMaxManualEl.value = newMaxHP;
if (hpDiceEl) hpDiceEl.value = "1к" + hitDie;
if (hpDiceAvailableEl) hpDiceAvailableEl.value = (level - (char.combat.hpDiceSpent || 0)) + "/" + level;
char.combat.hpMax = newMaxHP;
char.combat.hpDice = "1к" + hitDie;
if (char.combat.hpCurrent > newMaxHP) {
char.combat.hpCurrent = newMaxHP;
safeSet("hp-current", newMaxHP);
}
saveToLocal();
updateStatusBar();
updateHPDisplay();
}
function createNewCharacter() {
// Глубокое копирование дефолтного шаблона — безопасно, без мутации оригинала
const newChar = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
newChar.id = Date.now();
newChar.schemaVersion = (typeof SCHEMA_VERSION !== 'undefined') ? SCHEMA_VERSION : 1;
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
  "<div class=\"char-card-class-icon\" style=\"background:" + classColor + "22;\">" + classIcon + "</div>" +
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
if (!modal) return;
titleEl.textContent = title;
textEl.textContent = text;
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
function updateChar() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
char.name = $("char-name")?.value || "";
char.level = parseInt($("char-level")?.value) || 1;
char.exp = parseInt($("char-exp")?.value) || 0;
char.class = $("char-class")?.value || "";
char.subclass = $("char-subclass")?.value || "";
char.race = $("char-race")?.value || "";
char.background = $("char-background")?.value || "";
char.alignment = $("char-alignment")?.value || "";
char.size = $("char-size")?.value || "Средний";
char.speed = $("char-speed")?.value || "30 фт";
char.combat.ac = parseInt($("combat-ac")?.value) || 10;
char.combat.armorId   = $("char-armor")?.value || "none";
char.combat.hasShield = $("char-shield")?.checked || false;
char.combat.hpCurrent = parseInt($("hp-current")?.value) || 0;
char.combat.hpTemp = parseInt($("hp-temp")?.value) || 0;
char.combat.hpDiceSpent = parseInt($("hp-dice-spent")?.value) || 0;
char.combat.speed = $("combat-speed")?.value || "30 фт";
char.proficiencies.tools = $("tool-proficiencies")?.value || "";
char.proficiencies.languages = $("languages")?.value || "";
char.coins.cp = parseInt($("coin-cp")?.value) || 0;
char.coins.sp = parseInt($("coin-sp")?.value) || 0;
char.coins.ep = parseInt($("coin-ep")?.value) || 0;
char.coins.gp = parseInt($("coin-gp")?.value) || 0;
char.coins.pp = parseInt($("coin-pp")?.value) || 0;
calcCoinWeight();
char.notes = $("char-notes")?.value || "";
char.features = $("char-features")?.value || "";
char.appearance = $("char-appearance")?.value || "";
char.magicItems = $("magic-items")?.value || "";
char.spells.stat = $("spell-stat")?.value || "";
for(let i=1; i<=9; i++) {
if(char.spells.slots[i] !== undefined) {
const slotInput = $("slots-" + i + "-total");
if(slotInput) char.spells.slots[i] = parseInt(slotInput.value) || 0;
}
}
calcSpellStats();
const char2 = getCurrentChar();
if (char2) char2.updatedAt = Date.now();
saveToLocalDebounced();
updateHeaderTitle();
updateStatusBar();
updateHPDisplay();
}
function toggleProficiency(type, value, checkbox) {
if (!currentId) return;
const char = getCurrentChar();
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
const char = getCurrentChar();
if (!char) return;
const level = parseInt($("char-level")?.value) || 1;
const proficiencyBonus = getProficiencyBonus(level);
const profBonusEl = $("proficiency-bonus");
if (profBonusEl) profBonusEl.innerText = "+" + proficiencyBonus;
const stats = ["str", "dex", "con", "int", "wis", "cha"];
stats.forEach(function(s) {
const val = parseInt($("val-" + s)?.value) || 10;
char.stats[s] = val;
const mod = getMod(val);
const modEl = $("mod-" + s);
if (modEl) modEl.innerText = formatMod(mod);
});
const dexMod = getMod(char.stats.dex);
const initEl = $("combat-init");
if (initEl) initEl.value = formatMod(dexMod);
SAVES_DATA.forEach(function(save) {
const checkbox = $("save-prof-" + save.key);
const item = $("save-item-" + save.key);
if(checkbox) {
let bonus = getMod(char.stats[save.key]);
if(checkbox.checked) bonus += proficiencyBonus;
const bonusEl = $("save-bonus-" + save.key);
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
const checkbox = $("skill-prof-" + index);
if(checkbox) {
let bonus = getMod(char.stats[skill.stat]);
if(checkbox.checked) bonus += proficiencyBonus;
const bonusEl = $("skill-bonus-" + index);
if (bonusEl) bonusEl.innerText = formatMod(bonus);
char.skills[index] = checkbox.checked;
}
});
const wisMod = getMod(char.stats.wis);
const perceptionCheckbox = $("skill-prof-3");
let passivePerception = 10 + wisMod;
if(perceptionCheckbox && perceptionCheckbox.checked) passivePerception += proficiencyBonus;
const passiveEl = $("passive-perception");
if (passiveEl) passiveEl.innerText = passivePerception;
calcSpellStats();
// Обновляем updatedAt при любом изменении характеристик
const charForUpdate = getCurrentChar();
if (charForUpdate) { charForUpdate.updatedAt = Date.now(); }
saveToLocal();
}
function calcSpellStats() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const level = parseInt($("char-level")?.value) || 1;
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

// ============================================
// РАСА: отображение бонусов
// ============================================
function onRaceChange() {
  var raceEl = $("char-race");
  var displayEl = $("race-bonus-display");
  if (!raceEl || !displayEl) return;
  var race = raceEl.value;
  var data = (typeof RACE_DATA !== "undefined") && RACE_DATA[race];
  if (!data) { displayEl.style.display = "none"; return; }
  var statNames = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
  var bonuses = Object.keys(data.stats).map(function(k) {
    var v = data.stats[k];
    return '<span class="race-bonus-badge">' + (v > 0 ? "+" : "") + v + " " + statNames[k] + '</span>';
  }).join("");
  var speedBadge = data.speed !== 30
    ? '<span class="race-bonus-badge race-speed">' + data.speed + ' фт</span>'
    : '<span class="race-bonus-badge race-speed">30 фт</span>';
  displayEl.innerHTML =
    '<span class="race-bonus-label">⚡ ' + escapeHtml(race) + ':</span>' + bonuses + speedBadge +
    '<span class="race-bonus-traits">' + escapeHtml(data.traits) + '</span>';
  displayEl.style.display = "flex";

  // Обновляем ОБА поля скорости
  var speedVal = data.speed + " фт";
  var charSpeedEl  = $("char-speed");
  var combatSpeedEl = $("combat-speed");
  if (charSpeedEl)   charSpeedEl.value  = speedVal;
  if (combatSpeedEl) combatSpeedEl.value = speedVal;

  if (currentId) {
    var char = getCurrentChar();
    if (char) {
      char.speed        = speedVal;
      char.combat.speed = speedVal;
      saveToLocal();
    }
  }
}

// ============================================
// ПРЕДЫСТОРИЯ: авто-навыки
// ============================================
function onBackgroundChange() {
  if (!currentId) return;
  var bgEl = $("char-background");
  if (!bgEl) return;
  var bg = bgEl.value;
  var skillList = (typeof BACKGROUND_SKILLS !== "undefined") && BACKGROUND_SKILLS[bg];
  if (!skillList) return;
  // Match by exact skill name from the skills[] array
  skillList.forEach(function(skillName) {
    var idx = skills.findIndex(function(s) { return s.name === skillName; });
    if (idx !== -1) {
      var cb = $("skill-prof-" + idx);
      if (cb && !cb.checked) { cb.checked = true; }
    }
  });
  calcStats();
  updateSkillProfCount();
}

// ============================================
// БРОНЯ: авто-расчёт КД по выбору брони
// ============================================
function onArmorChange() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var armorId = $("char-armor")?.value || "none";
  var hasShield = $("char-shield")?.checked || false;
  char.combat.armorId  = armorId;
  char.combat.hasShield = hasShield;
  if (armorId === "custom") return; // manual mode - don't recalc
  var preset = (typeof ARMOR_PRESETS !== "undefined") && ARMOR_PRESETS.find(function(a) { return a.id === armorId; });
  if (!preset) { calculateAC(); return; }
  var dexMod = getMod(char.stats.dex);
  var dexBonus = preset.dexCap >= 99 ? dexMod : Math.min(dexMod, preset.dexCap);
  var ac = preset.baseAC + dexBonus + (hasShield ? 2 : 0);
  // Apply armor type proficiency flags for legacy calculateAC
  char.proficiencies.armor = char.proficiencies.armor || [];
  ["light","medium","heavy","shield"].forEach(function(t) { safeSetChecked("armor-"+t, false); });
  if (preset.type !== "none") {
    if (!char.proficiencies.armor.includes(preset.type)) char.proficiencies.armor.push(preset.type);
    safeSetChecked("armor-"+preset.type, true);
  }
  if (hasShield) {
    if (!char.proficiencies.armor.includes("shield")) char.proficiencies.armor.push("shield");
    safeSetChecked("armor-shield", true);
  }
  var acEl = $("combat-ac");
  if (acEl) acEl.value = ac;
  char.combat.ac = ac;
  $("ac-total").textContent = ac;
  $("ac-formula").textContent = preset.name + ": " + preset.baseAC + (dexBonus !== 0 ? (dexBonus > 0 ? " +" : " ") + dexBonus + " (ЛОВ)" : "") + (hasShield ? " +2 (щит)" : "");
  $("status-ac").textContent = ac;
  saveToLocal();
  updateStatusBar();
}

function onManualAC() {
  // When user types КД manually, switch armor select to "custom"
  var armorEl = $("char-armor");
  if (armorEl && armorEl.value !== "custom") armorEl.value = "custom";
  updateChar();
}

function onManualMaxHP() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var val = parseInt($("hp-max-manual")?.value) || 0;
  if (val < 1) return;
  char.combat.hpMax = val;
  // also sync hidden field
  safeSet("hp-max", val);
  if (char.combat.hpCurrent > val) {
    char.combat.hpCurrent = val;
    safeSet("hp-current", val);
  }
  saveToLocal();
  updateHPDisplay();
}


function calcCoinWeight() {
const cp = parseInt($("coin-cp")?.value) || 0;
const sp = parseInt($("coin-sp")?.value) || 0;
const ep = parseInt($("coin-ep")?.value) || 0;
const gp = parseInt($("coin-gp")?.value) || 0;
const pp = parseInt($("coin-pp")?.value) || 0;
const totalCoins = cp + sp + ep + gp + pp;
const weight = (totalCoins / 50).toFixed(2);
const coinWeightEl = $("coin-weight");
if (coinWeightEl) coinWeightEl.innerText = "Вес монет: " + weight + " фнт";
updateInventoryWeight();
}
function openRestModal() {
if (!currentId) { showToast("Сначала выберите персонажа!", "warn"); return; }
const modal = $("rest-modal");
if (modal) modal.classList.add("active");
showRestMain();
}
function closeRestModal() {
const modal = $("rest-modal");
if (modal) modal.classList.remove("active");
currentRestType = null;
hitDiceToSpend = 0;
}
function showRestMain() {
const main = $("rest-main-screen");
const info = $("rest-info-screen");
const result = $("rest-result-screen");
if (main) main.classList.remove("hidden");
if (info) info.classList.add("hidden");
if (result) result.classList.add("hidden");
}
function showShortRestInfo() {
currentRestType = "short";
const main = $("rest-main-screen");
const info = $("rest-info-screen");
const result = $("rest-result-screen");
const title = $("rest-info-title");
const list = $("rest-info-list");
const hitDiceSection = $("hit-dice-section");
const confirmBtn = $("confirm-rest-btn");
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
const main = $("rest-main-screen");
const info = $("rest-info-screen");
const result = $("rest-result-screen");
const title = $("rest-info-title");
const list = $("rest-info-list");
const hitDiceSection = $("hit-dice-section");
const confirmBtn = $("confirm-rest-btn");
if (main) main.classList.add("hidden");
if (info) info.classList.remove("hidden");
if (result) result.classList.add("hidden");
if (title) title.textContent = "🛏️ Долгий отдых (8 часов)";
if (list) list.innerHTML = "<li>Восстанавливаются ВСЕ ХП</li><li>Восстанавливаются ВСЕ ячейки заклинаний</li><li>Восстанавливаются кости хитов (до половины уровня)</li><li>Сбрасываются потраченные кости хитов</li><li>Восстанавливаются все классовые умения</li><li>✅ Снимаются большинство условий</li>";
if (hitDiceSection) hitDiceSection.classList.add("hidden");
if (confirmBtn) confirmBtn.textContent = "Долгий отдых";
}
function showRestResult(title, details) {
const main = $("rest-main-screen");
const info = $("rest-info-screen");
const result = $("rest-result-screen");
const resultTitle = $("rest-result-title");
const resultDetails = $("rest-result-details");
if (main) main.classList.add("hidden");
if (info) info.classList.add("hidden");
if (result) result.classList.remove("hidden");
if (resultTitle) resultTitle.textContent = title;
if (resultDetails) resultDetails.innerHTML = details;
}
function adjustHitDice(delta) {
const char = getCurrentChar();
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
const char = getCurrentChar();
if (!char) return;
const maxHitDice = char.level || 1;
const availableHitDice = maxHitDice - (char.combat.hpDiceSpent || 0);
const hitDiceMatch = char.combat.hpDice.match(/(\d+)[кK](\d+)/);
const hitDiceValue = hitDiceMatch ? parseInt(hitDiceMatch[2]) : 8;
const avgHeal = Math.floor(hitDiceValue / 2) + 1;
const conMod = getMod(char.stats.con);
const totalHeal = hitDiceToSpend * (avgHeal + conMod);
const availableEl = $("hit-dice-available-rest");
const healEl = $("hit-dice-heal");
if (availableEl) availableEl.textContent = availableHitDice;
if (healEl) healEl.textContent = totalHeal;
}
function confirmRest() {
if (!currentId || !currentRestType) return;
const char = getCurrentChar();
if (!char) return;
let resultTitle = "";
let resultDetails = "";
const oldHp = parseInt(char.combat.hpCurrent);
if (currentRestType === "short") {
var _hitDie = parseInt(char.combat.hpDice.match(/(\d+)[кK](\d+)/)?.[2] || 8);
var _conMod = getMod(char.stats.con);
// FIX: roll each die individually instead of using average
var hpHealed = 0;
var rollLog = [];
for (var _i = 0; _i < hitDiceToSpend; _i++) {
  var _roll = Math.floor(Math.random() * _hitDie) + 1;
  var _total = Math.max(1, _roll + _conMod);
  hpHealed += _total;
  rollLog.push(_roll + ((_conMod >= 0 ? "+" : "") + _conMod) + "=" + _total);
}
hpHealed = Math.max(0, hpHealed);
char.combat.hpCurrent = Math.min(parseInt(char.combat.hpCurrent) + hpHealed, parseInt(char.combat.hpMax));
char.combat.hpDiceSpent = (char.combat.hpDiceSpent || 0) + hitDiceToSpend;
// FIX: Warlock recovers spell slots on short rest
if (char.class === "Колдун" && char.spells && char.spells.slots) {
  for (var _si = 1; _si <= 9; _si++) {
    if (char.spells.slots[_si]) char.spells.slotsUsed[_si] = 0;
  }
}
if (hpHealed > 0) {
  addHPHistory(oldHp, char.combat.hpCurrent, hpHealed, "Короткий отдых");
  showHPToast(hpHealed);
}
resetResourcesByRest("short");
resultTitle = "✅ Короткий отдых завершён!";
var rollStr = rollLog.length > 0 ? " (" + rollLog.join(", ") + ")" : "";
var warlockStr = (char.class === "Колдун") ? "<p>🔮 Ячейки пакта восстановлены</p>" : "";
resultDetails = "<div class='rest-comparison'><div class='before'>ХП: " + oldHp + "</div><div class='arrow'>→</div><div class='after'>ХП: " + char.combat.hpCurrent + "</div></div><p>🎲 Потрачено костей: " + hitDiceToSpend + rollStr + "</p><p>❤️ Восстановлено ХП: " + hpHealed + "</p><p>📊 Доступно костей: " + (char.level - char.combat.hpDiceSpent) + "/" + char.level + "</p>" + warlockStr;
} else if (currentRestType === "long") {
const maxHp = parseInt(char.combat.hpMax);
char.combat.hpCurrent = maxHp;
for(let i=1; i<=9; i++) { if (char.spells.slots[i]) char.spells.slotsUsed[i] = 0; }
const hitDiceToRestore = Math.floor(char.level / 2);
char.combat.hpDiceSpent = Math.max(0, (char.combat.hpDiceSpent || 0) - hitDiceToRestore);
char.conditions = [];
char.effects = [];
char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };
resetResourcesByRest("long");
loadConditions();
loadEffects();
addHPHistory(oldHp, maxHp, maxHp - oldHp, "Долгий отдых");
if (maxHp - oldHp > 0) showHPToast(maxHp - oldHp);
resultTitle = "✅ Долгий отдых завершён!";
addJournalEntry("rest", "Долгий отдых — новая сессия", "Уровень " + (char.level||1) + " · ХП: " + oldHp + " → " + maxHp + " · Ячейки и ресурсы восстановлены");
renderJournal();
resultDetails = "<div class='rest-comparison'><div class='before'>ХП: " + oldHp + "</div><div class='arrow'>→</div><div class='after'>ХП: " + maxHp + "</div></div><p>✨ Ячейки заклинаний: восстановлены</p><p>🎲 Кости хитов: восстановлено " + hitDiceToRestore + "</p><p>📊 Доступно костей: " + (char.level - char.combat.hpDiceSpent) + "/" + char.level + "</p><p>⚠️ Условия и эффекты: сняты</p>";
}
saveToLocal();
loadCharacter(currentId);
showRestResult(resultTitle, resultDetails);
}
function openLevelUpModal() {
if (!currentId) { showToast("Сначала выберите персонажа!", "warn"); return; }
const char = getCurrentChar();
if (!char) return;
const currentLevel = char.level || 1;
if (currentLevel >= 20) { showToast("Максимальный уровень достигнут!", "warn"); return; }
const newLevel = currentLevel + 1;
const conMod = getMod(char.stats.con);
const className = char.class;
const hitDie = CLASS_HIT_DICE[className] || 8;
const currentMaxHP = calculateMaxHP(currentLevel, conMod, hitDie);
const newMaxHP = calculateMaxHP(newLevel, conMod, hitDie);
const hpGain = newMaxHP - currentMaxHP;
const profOld = getProficiencyBonus(currentLevel);
const profNew = getProficiencyBonus(newLevel);
$("lu-from-level").textContent = currentLevel;
$("lu-to-level").textContent = newLevel;
$("lu-hp-from").textContent = currentMaxHP;
$("lu-hp-to").textContent = newMaxHP;
$("lu-hp-gain").textContent = "+" + hpGain;
$("lu-hit-die").textContent = "1к" + hitDie;
$("lu-dice-count").textContent = newLevel + " шт.";
$("lu-prof-old").textContent = "+" + profOld;
if (profNew !== profOld) {
$("lu-prof-arrow").style.display = "inline";
$("lu-prof-new").style.display = "inline";
$("lu-prof-new").textContent = "+" + profNew;
} else {
$("lu-prof-arrow").style.display = "none";
$("lu-prof-new").style.display = "none";
}
const slotsCard = $("lu-slots-card");
const slotsInfo = $("lu-slots-info");
if (SPELL_SLOTS_BY_LEVEL[className] && SPELL_SLOTS_BY_LEVEL[className][newLevel]) {
const newSlots = SPELL_SLOTS_BY_LEVEL[className][newLevel];
const oldSlots = SPELL_SLOTS_BY_LEVEL[className][currentLevel] || [];
let slotParts = [];
for (let i = 1; i <= 9; i++) {
const n = newSlots[i] || 0;
const o = oldSlots[i] || 0;
if (n > 0) slotParts.push((n > o ? "<b>+" + (n-o) + "</b> " : "") + i + "ур.: " + n);
}
if (slotParts.length > 0) {
slotsCard.style.display = "";
slotsInfo.innerHTML = slotParts.join("  •  ");
} else { slotsCard.style.display = "none"; }
} else { slotsCard.style.display = "none"; }
const featuresContainer = $("lu-features-container");
featuresContainer.innerHTML = "";
if (CLASS_FEATURES[className] && CLASS_FEATURES[className][newLevel]) {
CLASS_FEATURES[className][newLevel].forEach(function(f) {
const div = document.createElement("div");
div.className = "lu-feature-item";
div.innerHTML = "<div class=\"lu-feature-name\">" + escapeHtml(f.name) + "</div><div class=\"lu-feature-desc\">" + escapeHtml(f.desc) + "</div>";
featuresContainer.appendChild(div);
});
}
$("lu-screen-preview").style.display = "";
$("lu-screen-result").style.display = "none";
const modal = $("levelup-modal");
if (modal) modal.classList.add("active");
}
function closeLevelUpModal() {
const modal = $("levelup-modal");
if (modal) modal.classList.remove("active");
}
function confirmLevelUp() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const oldLevel = char.level || 1;
const oldMaxHP = parseInt(char.combat.hpMax);
const oldProf = getProficiencyBonus(oldLevel);
char.level = oldLevel + 1;
const conMod = getMod(char.stats.con);
const className = char.class;
const hitDie = CLASS_HIT_DICE[className] || 8;
const newMaxHP = calculateMaxHP(char.level, conMod, hitDie);
const hpGain = newMaxHP - oldMaxHP;
const newProf = getProficiencyBonus(char.level);
char.combat.hpMax = newMaxHP;
char.combat.hpCurrent = Math.min(char.combat.hpCurrent + hpGain, newMaxHP);
char.combat.hpDice = "1к" + hitDie;
char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };
if (SPELL_SLOTS_BY_LEVEL[className] && SPELL_SLOTS_BY_LEVEL[className][char.level]) {
const slots = SPELL_SLOTS_BY_LEVEL[className][char.level];
for (let i = 1; i <= 9; i++) {
char.spells.slots[i] = slots[i] || 0;
char.spells.slotsUsed[i] = 0;
}
}
saveToLocal();
loadCharacter(currentId);
updateClassFeatures();
renderClassResources();
renderSpellSlots();
$("lu-screen-preview").style.display = "none";
$("lu-screen-result").style.display = "";
$("lu-result-title").textContent = "Уровень " + char.level + " достигнут!";
addJournalEntry("levelup", "Достигнут " + char.level + " уровень!", "ХП: " + oldMaxHP + " → " + newMaxHP + " · Бонус мастерства: +" + newProf);
renderJournal();
let resultLines = ["❤️ ХП: " + oldMaxHP + " → " + newMaxHP + " (+" + hpGain + ")", "🎲 Костей хитов: " + char.level];
if (newProf !== oldProf) resultLines.push("⚡ Бонус мастерства: +" + oldProf + " → +" + newProf);
if (CLASS_FEATURES[className] && CLASS_FEATURES[className][char.level]) {
const names = CLASS_FEATURES[className][char.level].map(function(f) { return f.name; });
resultLines.push("✨ Новые умения: " + names.join(", "));
}
$("lu-result-body").innerHTML = resultLines.map(function(l) {
return "<div class=\"lu-result-line\">" + escapeHtml(l) + "</div>";
}).join("");
}
function openDiceModal() {
const modal = $("dice-modal");
if (modal) modal.classList.add("active");
}
function closeDiceModal() {
const modal = $("dice-modal");
if (modal) modal.classList.remove("active");
const display = $("dice-result-display");
if (display) display.classList.remove("crit-success", "crit-fail", "normal");
}
function rollDice(sides, mode) {
// mode: undefined=normal, 'adv'=advantage, 'dis'=disadvantage
const r1 = Math.floor(Math.random() * sides) + 1;
const r2 = (mode === 'adv' || mode === 'dis') ? Math.floor(Math.random() * sides) + 1 : null;
let result, resultLabel;
if (mode === 'adv') {
  result = Math.max(r1, r2);
  resultLabel = "Преимущество: " + r1 + " и " + r2 + " → ";
} else if (mode === 'dis') {
  result = Math.min(r1, r2);
  resultLabel = "Помеха: " + r1 + " и " + r2 + " → ";
} else {
  result = r1;
  resultLabel = null;
}
const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
const display = $("dice-result-display");
const resultBig = $("dice-result-big");
const resultInfo = $("dice-result-info");
if (!display || !resultBig || !resultInfo) return;
display.classList.remove("crit-success", "crit-fail", "normal");
void display.offsetWidth;
if (sides === 20) {
if (result === 20) {
display.classList.add("crit-success");
resultInfo.textContent = (resultLabel || "") + "🎉 КРИТИЧЕСКИЙ УСПЕХ! 🎉";
createParticles();
} else if (result === 1) {
display.classList.add("crit-fail");
resultInfo.textContent = (resultLabel || "") + "💀 КРИТИЧЕСКИЙ ПРОВАЛ! 💀";
} else {
display.classList.add("normal");
resultInfo.textContent = (resultLabel ? resultLabel.slice(0,-3) : "Бросок d" + sides + " в " + timestamp);
}
} else {
display.classList.add("normal");
resultInfo.textContent = (resultLabel ? resultLabel.slice(0,-3) : "Бросок d" + sides + " в " + timestamp);
}
resultBig.textContent = result;
diceHistory.unshift({ sides: sides, result: result, mode: mode || 'normal', time: timestamp, r1: r1, r2: r2 });
if (diceHistory.length > 10) diceHistory.pop();
renderDiceHistory();
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
const count = Math.min(parseInt(match[1]) || 1, 20);
const sides = Math.min(parseInt(match[2]) || 6, 100);
const bonus = parseInt(match[3] || "0");
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
function filterInventory(category, btn) {
currentFilterCategory = category;
document.querySelectorAll(".inventory-filters button").forEach(function(b) { b.classList.remove("active"); });
if (btn) btn.classList.add("active");
renderInventory();
}
function renderInventory() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const container = $("inventory-list");
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
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const item = char.inventory[category] && char.inventory[category][index];
const name = item ? item.name : "предмет";
showConfirmModal(
  "Удалить предмет?",
  "«" + name + "» будет удалён без возможности восстановления.",
  function() {
    const c = characters.find(function(ch) { return ch.id === currentId; });
    if (!c) return;
    c.inventory[category].splice(index, 1);
    saveToLocal();
    renderInventory();
  }
);
}
function updateInventoryWeight() {
if (!currentId) return;
const char = getCurrentChar();
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
const totalWeightEl = $("total-weight");
const carryCapacityEl = $("carry-capacity");
const overweightWarningEl = $("overweight-warning");
const overweightAmountEl = $("overweight-amount");
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
const char = getCurrentChar();
if (!char) return;
if (!category) category = currentFilterCategory !== "all" ? currentFilterCategory : "weapon";
safeSet("item-category", category);
safeSet("item-slot-index", slotIndex);
safeSet("new-item-category", category);
const titleEl = $("item-modal-title");
const nameEl = $("new-item-name");
const qtyEl = $("new-item-qty");
const weightEl = $("new-item-weight");
const descEl = $("new-item-desc");
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
const modal = $("item-modal");
if (modal) modal.classList.add("active");
}
function closeItemModal() {
const modal = $("item-modal");
if (modal) modal.classList.remove("active");
}
function submitItem() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const category = $("new-item-category")?.value || document.getElementById("item-category")?.value || "weapon";
const slotIndex = parseInt($("item-slot-index")?.value) || -1;
const name = $("new-item-name")?.value?.trim() || "";
if (!name) { showToast("Введите название!", "warn"); return; }
const newItem = {
name: name,
qty: parseInt($("new-item-qty")?.value) || 1,
weight: parseFloat($("new-item-weight")?.value) || 0,
desc: $("new-item-desc")?.value || ""
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
const char = getCurrentChar();
if (!char) return;
const item = char.inventory[category][index];
currentViewItem = { category: category, index: index };
const iconEl = $("view-item-icon");
const nameEl = $("view-item-name");
const qtyEl = $("view-item-qty");
const weightEl = $("view-item-weight");
const totalWeightEl = $("view-item-total-weight");
const categoryEl = $("view-item-category");
const descEl = $("view-item-desc");
if (iconEl) iconEl.textContent = ITEM_ICONS[category];
if (nameEl) nameEl.textContent = item.name || "Без названия";
if (qtyEl) qtyEl.textContent = (item.qty || 1) + " шт.";
if (weightEl) weightEl.textContent = (item.weight || 0) + " фнт";
if (totalWeightEl) totalWeightEl.textContent = ((item.weight || 0) * (item.qty || 1)).toFixed(1) + " фнт";
if (categoryEl) categoryEl.textContent = CATEGORY_NAMES[category];
if (descEl) descEl.textContent = item.desc || "Нет описания";
const modal = $("item-view-modal");
if (modal) modal.classList.add("active");
}
function closeItemView() {
const modal = $("item-view-modal");
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
const char = getCurrentChar();
if (!char) return;
const item = char.inventory[currentViewItem.category] && char.inventory[currentViewItem.category][currentViewItem.index];
const name = item ? item.name : "предмет";
const capturedItem = { category: currentViewItem.category, index: currentViewItem.index };
closeItemView();
showConfirmModal(
  "Удалить предмет?",
  "«" + name + "» будет удалён без возможности восстановления.",
  function() {
    const c = characters.find(function(ch) { return ch.id === currentId; });
    if (!c) return;
    c.inventory[capturedItem.category].splice(capturedItem.index, 1);
    saveToLocal();
    renderInventory();
  }
);
}
function renderWeaponPresets() {
const container = $("weapon-presets-list");
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
const char = getCurrentChar();
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
const modal = $("weapon-modal");
if (modal) modal.classList.add("active");
}
function closeWeaponModal() {
const modal = $("weapon-modal");
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
const char = getCurrentChar();
if (!char) return;
const name = $("new-weapon-name")?.value?.trim() || "";
if (!name) { showToast("Введите название!", "warn"); return; }
const stat = $("new-weapon-stat")?.value || "str";
const statName = stat === "str" ? "СИЛ" : "ЛОВ";
if (!char.weapons) char.weapons = [];
char.weapons.push({
name: name,
stat: stat,
statName: statName,
bonus: $("new-weapon-bonus")?.value || "",
damage: $("new-weapon-damage")?.value || "",
type: $("new-weapon-type")?.value || "",
range: $("new-weapon-range")?.value || "",
notes: $("new-weapon-notes")?.value || ""
});
saveToLocal();
closeWeaponModal();
renderWeapons();
}
function renderWeapons() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const container = $("weapons-list");
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
const char = getCurrentChar();
if (!char) return;
char.weapons.splice(index, 1);
saveToLocal();
renderWeapons();
}
function renderSpellSlots() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const container = $("spell-slots-visual");
if (!container) return;
container.innerHTML = "";
for(let i=1; i<=9; i++) {
const total = char.spells.slots[i] || 0;
const group = document.createElement("div");
group.className = "spell-slot-group";
group.innerHTML = "<h4>" + i + " ур.</h4><div class=\"spell-diamonds\" id=\"slots-diamonds-" + i + "\"></div><div class=\"spell-slot-controls\"><div class=\"spell-slot-input\"><input type=\"number\" id=\"slots-" + i + "-total\" value=\"" + total + "\" min=\"0\" max=\"10\" oninput=\"updateSpellSlots(" + i + ", this.value)\"></div><div class=\"spell-slot-btn-row\"><button class=\"spell-slot-btn\" onclick=\"adjustSpellSlots(" + i + ", -1)\">−</button><button class=\"spell-slot-btn\" onclick=\"adjustSpellSlots(" + i + ", 1)\">+</button></div></div>";
container.appendChild(group);
const diamondsContainer = $("slots-diamonds-" + i);
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
if(cls === "all") $("btn-class-all")?.classList.add("active");
if(cls === "wizard") $("btn-class-wizard")?.classList.add("active");
if(cls === "druid") $("btn-class-druid")?.classList.add("active");
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
char.spells.mySpells = char.spells.mySpells.filter(function(s) { return s.id !== spellId; });
saveToLocal();
renderSpellSearch();
renderMySpells();
}
function renderMySpells() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const container = $("my-spells-list");
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

// ============================================
// СПАСБРОСКИ СМЕРТИ — ID синхронизированы с index.html
// ds-s0, ds-s1, ds-s2 — успехи
// ds-f0, ds-f1, ds-f2 — провалы
// ============================================
function loadDeathSaves() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
if (!char.deathSaves) {
char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };
}
for (let i = 0; i < 3; i++) {
const sEl = $("ds-s" + i);
const fEl = $("ds-f" + i);
if (sEl) {
sEl.classList.toggle("ds-filled-s", !!char.deathSaves.successes[i]);
const si = sEl.querySelector(".ds-icon");
if (si) si.textContent = char.deathSaves.successes[i] ? "✓" : "";
}
if (fEl) {
fEl.classList.toggle("ds-filled-f", !!char.deathSaves.failures[i]);
const fi = fEl.querySelector(".ds-icon");
if (fi) fi.textContent = char.deathSaves.failures[i] ? "✕" : "";
}
}
// Обновить статус
const successes = char.deathSaves.successes.filter(Boolean).length;
const failures = char.deathSaves.failures.filter(Boolean).length;
const statusEl = $("ds-status");
if (statusEl) {
statusEl.className = "ds-status";
if (successes >= 3) {
statusEl.textContent = "✅ Стабилизирован";
statusEl.classList.add("ds-stable");
} else if (failures >= 3) {
statusEl.textContent = "💀 Персонаж погиб";
statusEl.classList.add("ds-dead");
} else {
statusEl.textContent = "⚠️ При смерти (" + successes + "/3 успехов, " + failures + "/3 провалов)";
}
}
}

function toggleDeathSave(type, index) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
if (!char.deathSaves) {
char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };
}
if (type === "success") {
char.deathSaves.successes[index] = !char.deathSaves.successes[index];
} else {
char.deathSaves.failures[index] = !char.deathSaves.failures[index];
}
saveToLocal();
loadDeathSaves();
}

function resetDeathSaves() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };
saveToLocal();
loadDeathSaves();
}

// ============================================
// ОТОБРАЖЕНИЕ ХП — полная синхронизация с index.html
// ============================================
function updateHPDisplay() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const hpCurrent = char.combat.hpCurrent || 0;
const hpMax = char.combat.hpMax || 10;
const hpTemp = char.combat.hpTemp || 0;

// Скрытые поля
safeSet("hp-current", hpCurrent);
safeSet("hp-max", hpMax);
safeSet("hp-temp", hpTemp);

// Видимые элементы отображения ХП
const dispCurrent = $("hp-display-current");
const dispMax = $("hp-max-manual");
if (dispCurrent) {
dispCurrent.textContent = hpCurrent;
dispCurrent.className = "hp-big-num";
const pct = hpMax > 0 ? (hpCurrent / hpMax) * 100 : 0;
if (hpCurrent <= 0) dispCurrent.classList.add("hp-zero");
else if (pct <= 25) dispCurrent.classList.add("hp-low");
else if (pct <= 50) dispCurrent.classList.add("hp-medium");
}
if (dispMax && document.activeElement !== dispMax) dispMax.value = hpMax;

// Полоска ХП
const hpBar = $("hp-bar");
if (hpBar) {
const pct = hpMax > 0 ? Math.max(0, Math.min(100, (hpCurrent / hpMax) * 100)) : 0;
hpBar.style.width = pct + "%";
hpBar.className = "hp-bar";
if (pct === 0) hpBar.classList.add("hp-bar-empty");
else if (pct <= 25) hpBar.classList.add("hp-bar-low");
else if (pct <= 50) hpBar.classList.add("hp-bar-medium");
}

// Кость хитов в быстром блоке
const hdTypeDisplay = $("hd-type-display");
const hdAvailDisplay = $("hd-avail-display");
if (hdTypeDisplay) hdTypeDisplay.textContent = char.combat.hpDice || "—";
const spent = char.combat.hpDiceSpent || 0;
const total = char.level || 1;
const avail = total - spent;
if (hdAvailDisplay) hdAvailDisplay.textContent = avail + "/" + total;
renderHitDiceIcons(avail, total);
// Кнопка броска кости — заблокировать если 0 ХП или нет костей
const rollHdBtn = $("roll-hd-btn");
if (rollHdBtn) rollHdBtn.disabled = hpCurrent <= 0 || avail <= 0;

// Секция спасбросков смерти — показываем только при HP = 0
const deathSavesSection = $("death-saves-section");
if (deathSavesSection) {
deathSavesSection.style.display = hpCurrent <= 0 ? "block" : "none";
}

updateStatusBar();
syncSelfBattleStatus();
}

// ============================================
// БЫСТРОЕ ИЗМЕНЕНИЕ ХП
// ============================================
function quickHP(delta, source) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const hpTemp = char.combat.hpTemp || 0;
const hpBefore = char.combat.hpCurrent || 0;
let hpCurrent = hpBefore;
if (delta < 0 && hpTemp > 0) {
const dmg = Math.abs(delta);
if (dmg <= hpTemp) {
char.combat.hpTemp = hpTemp - dmg;
} else {
char.combat.hpTemp = 0;
hpCurrent -= (dmg - hpTemp);
}
} else {
hpCurrent += delta;
}
hpCurrent = Math.max(0, Math.min(hpCurrent, char.combat.hpMax));
const actualDelta = hpCurrent - hpBefore;
char.combat.hpCurrent = hpCurrent;
// FIX: reset death saves when healed from 0 HP
if (hpBefore <= 0 && hpCurrent > 0 && delta > 0) {
  char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };
  loadDeathSaves && loadDeathSaves();
}
safeSet("hp-current", hpCurrent);
safeSet("hp-temp", char.combat.hpTemp);
if (actualDelta !== 0) {
addHPHistory(hpBefore, hpCurrent, actualDelta, source || (delta < 0 ? "Урон" : "Лечение"));
showHPToast(actualDelta);
}
saveToLocal();
updateHPDisplay();
}

function addHPHistory(from, to, delta, source) {
const now = new Date();
const time = now.getHours().toString().padStart(2,"0") + ":" + now.getMinutes().toString().padStart(2,"0");
hpHistory.unshift({ from: from, to: to, delta: delta, source: source, time: time });
if (hpHistory.length > 30) hpHistory.pop();
}

function showHPToast(delta, customMsg) {
var container = $("hp-toast-container");
if (!container) return;
var existing = container.querySelector(".hp-toast");
if (existing) { clearTimeout(existing._fadeTimer); clearTimeout(existing._removeTimer); existing.remove(); }
var toast = document.createElement("div");
if (customMsg !== undefined) {
  toast.className = "hp-toast hp-toast-heal";
  toast.innerHTML = "<span style='font-size:14px;font-weight:700;'>" + customMsg + "</span>";
  container.appendChild(toast);
  toast._fadeTimer = setTimeout(function() { toast.classList.add("hp-toast-fade"); }, 2500);
  toast._removeTimer = setTimeout(function() { if (toast.parentNode) toast.remove(); }, 3000);
  return;
}
var sign = delta > 0 ? "+" : "";
var label = delta > 0 ? "Восстановлено" : "Получено урона";
toast.className = "hp-toast " + (delta > 0 ? "hp-toast-heal" : "hp-toast-dmg");
toast.innerHTML = "<span style='font-size:20px;font-weight:900;'>" + sign + delta + " ХП</span><span style='font-size:12px;opacity:0.75;margin-left:8px;'>" + label + "</span>";
container.appendChild(toast);
toast._fadeTimer = setTimeout(function() { toast.classList.add("hp-toast-fade"); }, 1800);
toast._removeTimer = setTimeout(function() { if (toast.parentNode) toast.remove(); }, 2300);
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

function applyCustomHP(mode) {
const input = $("hp-custom-input");
const val = parseInt(input?.value) || 0;
if (val <= 0) return;
if (mode === "dmg") quickHP(-val, "Урон");
else quickHP(val, "Лечение");
if (input) input.value = "";
}

function applyHealInput() {
const input = $("hp-heal-input");
const val = parseInt(input?.value) || 0;
if (val <= 0) return;
quickHP(val, "Лечение");
if (input) input.value = "";
}

function setHPInput(inputId, val) {
const input = $(inputId);
if (input) input.value = val;
}

function saveTempHP() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
char.combat.hpTemp = parseInt($("hp-temp")?.value) || 0;
saveToLocal();
updateHPDisplay();
}

// ============================================
// БРОСОК КОСТИ ХИТОВ (быстрый)
// ============================================
function rollHitDieQuick() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const spent = char.combat.hpDiceSpent || 0;
const total = char.level || 1;
const resultEl = $("hd-result");
if (spent >= total) {
if (resultEl) { resultEl.textContent = "Нет костей!"; }
return;
}
const match = (char.combat.hpDice || "1к8").match(/(\d+)[кK](\d+)/);
const sides = match ? parseInt(match[2]) : 8;
const roll = Math.floor(Math.random() * sides) + 1;
const conMod = getMod(char.stats.con);
const heal = Math.max(1, roll + conMod);
char.combat.hpCurrent = Math.min(char.combat.hpCurrent + heal, char.combat.hpMax);
char.combat.hpDiceSpent = spent + 1;
saveToLocal();
updateHPDisplay();
if (resultEl) {
const conStr = conMod === 0 ? "" : (conMod > 0 ? " +" + conMod : " " + conMod);
resultEl.textContent = roll + conStr + " = +" + heal + " ХП";
const hpBefore = char.combat.hpCurrent - heal;
addHPHistory(hpBefore < 0 ? 0 : hpBefore, char.combat.hpCurrent, heal, "Кость хитов (" + roll + conStr + ")");
showHPToast(heal);
}
}

function renderHitDiceIcons(avail, total) {
const row = $("hd-dice-row");
if (!row) return;
row.innerHTML = "";
const show = Math.min(total, 20);
for (let i = 0; i < show; i++) {
const d = document.createElement("div");
d.className = "hd-die-icon" + (i < avail ? " hd-die-avail" : " hd-die-spent");
d.textContent = i < avail ? "◆" : "◇";
row.appendChild(d);
}
}

function rollDeathSave() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const roll = Math.floor(Math.random() * 20) + 1;
const resultEl = $("ds-roll-result");
let msg = "";
let isSuccess = false;
if (roll === 20) {
char.combat.hpCurrent = 1;
saveToLocal();
updateHPDisplay();
msg = "20 — стабилизирован! (+1 ХП)";
isSuccess = true;
} else if (roll === 1) {
// 2 провала
for (let i = 0; i < 3; i++) {
if (!char.deathSaves.failures[i]) { char.deathSaves.failures[i] = true; break; }
}
for (let i = 0; i < 3; i++) {
if (!char.deathSaves.failures[i]) { char.deathSaves.failures[i] = true; break; }
}
msg = "1 — 2 провала!";
} else if (roll >= 10) {
for (let i = 0; i < 3; i++) {
if (!char.deathSaves.successes[i]) { char.deathSaves.successes[i] = true; break; }
}
msg = roll + " — успех!";
isSuccess = true;
} else {
for (let i = 0; i < 3; i++) {
if (!char.deathSaves.failures[i]) { char.deathSaves.failures[i] = true; break; }
}
msg = roll + " — провал!";
}
if (resultEl) {
resultEl.textContent = msg;
resultEl.className = "ds-roll-result " + (isSuccess ? "ds-result-ok" : "ds-result-fail");
}
saveToLocal();
loadDeathSaves();
}

// ============================================
// АСИ — Улучшение характеристик
// ============================================
// openASIModal и closeASIModal определены ниже

// ============================================================
// Регистрация Service Worker + автообнаружение обновлений
// ============================================================
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js')
      .then(function(reg) {
        console.log('[PWA] SW зарегистрирован:', reg.scope);
        if (reg.waiting) { showUpdateModal(reg.waiting); }
        reg.addEventListener('updatefound', function() {
          var newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', function() {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateModal(newWorker);
            }
          });
        });
      })
      .catch(function(err) { console.log('[PWA] SW ошибка:', err); });
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (!refreshing) { refreshing = true; window.location.reload(); }
    });
  });
}

function showUpdateModal(worker) {
  if ($('sw-update-modal')) return;
  var latest  = (typeof APP_CHANGELOG !== 'undefined' && APP_CHANGELOG.length > 0) ? APP_CHANGELOG[0] : null;
  var version = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : (latest ? latest.version : '?');
  var typeIcon  = { feat:'✨', fix:'🐛', improve:'⚡', data:'📦' };
  var typeColor = { feat:'#4da843', fix:'#e74c3c', improve:'#5b9bd5', data:'#d4a843' };
  var changesList = latest ? latest.changes.map(function(c) {
    return '<div class="sw-change-item"><span class="sw-change-icon" style="color:' + (typeColor[c.type] || '#9a9ab0') + '">' + (typeIcon[c.type] || '•') + '</span><span class="sw-change-text">' + escapeHtml(c.text) + '</span></div>';
  }).join('') : '<div class="sw-change-item">Улучшения и исправления</div>';
  var modal = document.createElement('div');
  modal.id = 'sw-update-modal';
  modal.innerHTML =
    '<div class="sw-update-box">' +
      '<div class="sw-update-header"><div class="sw-update-icon">🎲</div><div class="sw-update-title">Доступно обновление!</div><div class="sw-update-version">v' + escapeHtml(String(version)) + (latest ? ' · ' + escapeHtml(latest.date) : '') + '</div></div>' +
      '<div class="sw-update-changes"><div class="sw-changes-title">📋 Что нового:</div>' + changesList + '</div>' +
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

// ============================================================
// ⚔️ ОТРЯД — Соратники, NPC, Монстры
// ============================================================

var PARTY_DATA = { allies: [], monsters: [], npcs: [] };
var BATTLE_DATA = { active: false, participants: [], currentTurn: 0 };

var CONDITION_STATUSES = [
  { value: "healthy", label: "💚 Здоров" },
  { value: "wounded", label: "💛 Ранен" },
  { value: "heavy",   label: "🟠 Тяжело ранен" },
  { value: "dying",   label: "❤️ При смерти" },
  { value: "dead",    label: "💀 Мёртв" }
];

var MONSTER_TYPE_ICONS = {
  "Зверь":      "🐺",
  "Нежить":     "💀",
  "Демон":      "😈",
  "Дракон":     "🐉",
  "Гуманоид":   "🗡️",
  "Конструкт":  "🤖",
  "Фея":        "🧚",
  "Исчадие":    "👿",
  "Великан":    "🗿",
  "Аберрация":  "🦑",
  "Элементаль": "⚡",
  "Растение":   "🌿",
  "Монстр":     "👾"
};

function getMonsterTypeIcon(type) { return MONSTER_TYPE_ICONS[type] || "👾"; }

(function initParty() {
  // Global fallback load — per-character data is loaded in loadCharacter()
  try {
    var saved = localStorage.getItem("dnd_party");
    if (saved) {
      var parsed = JSON.parse(saved);
      if (!parsed.allies)   parsed.allies   = [];
      if (!parsed.monsters) parsed.monsters = [];
      if (!parsed.npcs)     parsed.npcs     = [];
      PARTY_DATA = parsed;
    }
  } catch(e) {}
  try {
    var savedBattle = localStorage.getItem("dnd_battle");
    if (savedBattle) BATTLE_DATA = JSON.parse(savedBattle);
  } catch(e) {}
})();

function saveParty() {
  if (!currentId) { try { localStorage.setItem("dnd_party", JSON.stringify(PARTY_DATA)); } catch(e) {} return; }
  var char = getCurrentChar();
  if (char) { char.party = PARTY_DATA; saveToLocal(); }
}
function saveBattle() {
  if (!currentId) { try { localStorage.setItem("dnd_battle", JSON.stringify(BATTLE_DATA)); } catch(e) {} return; }
  var char = getCurrentChar();
  if (char) { char.battle = BATTLE_DATA; saveToLocal(); }
}

// ─── helpers ─────────────────────────────────────────────────
function getMonsterIcon(type) { return getMonsterTypeIcon(type); }
function getFactionColor(type) {
  if (type === "self")    return "#4da843";
  if (type === "ally")    return "#27ae60";
  if (type === "npc")     return "#d4ac0d";
  return "#c0392b";
}
function getFactionLabel(type) {
  if (type === "self")    return "я";
  if (type === "ally")    return "союзник";
  if (type === "npc")     return "персонаж";
  return "враг";
}
function getStatusColor(status) {
  var map = { healthy:"#4da843", wounded:"#d4a843", heavy:"#e67e22", dying:"#e74c3c", dead:"#7f8c8d" };
  return map[status] || "#4da843";
}

// ─── PARTY TAB ────────────────────────────────────────────────
function openPartyTab() {
  renderMyChar();
  renderAllies();
  renderNPCs();
  renderMonsters();
}

// ─── MY CHAR ─────────────────────────────────────────────────
function renderMyChar() {
  var container = $("my-char-card");
  if (!container) return;
  var char = getCurrentChar();
  if (!char) {
    container.innerHTML = "<div class='party-empty'>Откройте персонажа из списка профилей</div>";
    return;
  }
  var icon  = getClassIcon(char.class);
  var color = getClassColor(char.class);
  var hpCurrent = char.combat ? (char.combat.hpCurrent || 0) : 0;
  var hpMax     = char.combat ? (char.combat.hpMax || 0) : 0;
  var hpPct     = hpMax > 0 ? Math.min(100, Math.round(hpCurrent / hpMax * 100)) : 100;
  var hpColor   = hpPct > 60 ? "#4da843" : hpPct > 30 ? "#e67e22" : "#e74c3c";
  var conds     = (char.conditions && char.conditions.length) ? "⚠️ " + char.conditions.length + " статус" : "";
  container.innerHTML =
    '<div class="pcard pcard-self">' +
      '<div class="pcard-icon" style="background:' + color + '22;color:' + color + '">' + icon + '</div>' +
      '<div class="pcard-body">' +
        '<div class="pcard-name">' + escapeHtml(char.name || "Мой персонаж") + '<span class="pcard-self-badge">я</span></div>' +
        '<div class="pcard-sub">' + escapeHtml((char.class||"") + (char.subclass ? " · "+char.subclass : "") + " · " + (char.level||1) + " ур.") + '</div>' +
        '<div class="pcard-badges">' +
          '<span class="pcard-badge" style="color:' + hpColor + ';border-color:' + hpColor + '55;background:' + hpColor + '18">❤️ ' + hpCurrent + '/' + hpMax + '</span>' +
          '<span class="pcard-badge">🛡️ ' + (char.combat ? (char.combat.ac||10) : 10) + '</span>' +
          (conds ? '<span class="pcard-badge pcard-badge-warn">' + conds + '</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
}

// ─── ALLIES ──────────────────────────────────────────────────
function renderAllies() {
  var list    = $("allies-list");
  var countEl = $("allies-count");
  if (!list) return;
  if (countEl) countEl.textContent = PARTY_DATA.allies.length > 0 ? PARTY_DATA.allies.length : "";
  if (PARTY_DATA.allies.length === 0) { list.innerHTML = "<div class='party-empty'>📭 Нет соратников. Добавьте первого!</div>"; return; }
  list.innerHTML = PARTY_DATA.allies.map(function(a, i) {
    var icon  = getClassIcon(a.cls);
    var color = getClassColor(a.cls);
    return '<div class="pcard">' +
      '<div class="pcard-icon" style="background:' + color + '22;color:' + color + '">' + icon + '</div>' +
      '<div class="pcard-body">' +
        '<div class="pcard-name">' + escapeHtml(a.name) + '</div>' +
        '<div class="pcard-sub">' + escapeHtml(a.cls || "Класс не указан") + '</div>' +
        (a.desc ? '<div class="pcard-desc">' + escapeHtml(a.desc) + '</div>' : '') +
        '<div class="pcard-status-row"><select class="pcard-status-sel" onchange="setAllyStatus(' + i + ',this.value)" onclick="event.stopPropagation()">' +
        CONDITION_STATUSES.map(function(s) { return '<option value="' + s.value + '"' + (s.value === (a.status||"healthy") ? " selected" : "") + '>' + s.label + '</option>'; }).join("") +
        '</select></div>' +
      '</div>' +
      '<div class="pcard-actions">' +
        '<button class="pcard-edit-btn" onclick="openEditAllyModal(' + i + ')" title="Редактировать">✏️</button>' +
        '<button class="pcard-del-btn"  onclick="deleteAlly(' + i + ')" title="Удалить">✕</button>' +
      '</div>' +
    '</div>';
  }).join("");
}

// ─── PARTY ENTITY MODAL (unified for ally / npc / monster) ───
var _PENT = {
  ally:    { modal:"add-ally-modal",    title:"ally-modal-title",    idx:"ally-edit-index",
             fields: [{id:"ally-name-inp",key:"name"},{id:"ally-class-sel",key:"cls"},{id:"ally-desc-inp",key:"desc"}],
             list: function() { return PARTY_DATA.allies; },
             render: function() { renderAllies(); },
             addLabel:"🧑‍🤝‍🧑 Добавить соратника", editLabel:"✏️ Редактировать соратника",
             delMsg: "Удалить соратника?", delKey:"name" },
  npc:     { modal:"add-npc-modal",     title:"npc-modal-title",     idx:"npc-edit-index",
             fields: [{id:"npc-name-inp",key:"name"},{id:"npc-role-inp",key:"role",default:"Персонаж"},{id:"npc-desc-inp",key:"desc"}],
             list: function() { if (!PARTY_DATA.npcs) PARTY_DATA.npcs = []; return PARTY_DATA.npcs; },
             render: function() { renderNPCs(); },
             addLabel:"🧑 Добавить персонажа", editLabel:"✏️ Редактировать персонажа",
             delMsg: "Удалить персонажа?", delKey:"name" },
  monster: { modal:"add-monster-modal", title:"monster-modal-title", idx:"monster-edit-index",
             fields: [{id:"monster-name-inp",key:"name"},{id:"monster-type-sel",key:"type",default:"Монстр"},{id:"monster-desc-inp",key:"desc"}],
             list: function() { return PARTY_DATA.monsters; },
             render: function() { renderMonsters(); },
             addLabel:"👹 Добавить монстра", editLabel:"✏️ Редактировать монстра",
             delMsg: "Удалить монстра?", delKey:"name" }
};
function _pentOpen(type, i) {
  var cfg = _PENT[type]; if (!cfg) return;
  var isEdit = (i !== undefined && i >= 0);
  $(cfg.title).textContent = isEdit ? cfg.editLabel : cfg.addLabel;
  $(cfg.idx).value = isEdit ? i : "-1";
  var item = isEdit ? cfg.list()[i] : null;
  cfg.fields.forEach(function(f) { $(f.id).value = item ? (item[f.key] || "") : ""; });
  openModal(cfg.modal);
}
function _pentClose(type) { closeModal(_PENT[type].modal); }
function _pentSave(type) {
  var cfg = _PENT[type];
  var nameField = cfg.fields[0];
  var name = $(nameField.id).value.trim();
  if (!name) { showToast("Введите имя", "warn"); return; }
  var list = cfg.list();
  var idx = parseInt($(cfg.idx).value);
  var data = { id: idx >= 0 ? (list[idx].id || Date.now()) : Date.now(), status: idx >= 0 ? (list[idx].status || "healthy") : "healthy" };
  cfg.fields.forEach(function(f) { data[f.key] = $(f.id).value.trim() || (f.default || ""); });
  if (!data.name) data.name = name;
  if (idx >= 0) list[idx] = data; else list.push(data);
  saveParty(); cfg.render(); _pentClose(type);
}
function _pentDelete(type, i) {
  var cfg = _PENT[type];
  var name = cfg.list()[i] ? cfg.list()[i][cfg.delKey] : "запись";
  showConfirmModal(cfg.delMsg, "«"+name+"» будет удалён.", function() { cfg.list().splice(i,1); saveParty(); cfg.render(); });
}
function _pentStatus(type, i, val) { _PENT[type].list()[i].status = val; saveParty(); }
function _pentExport(type) {
  var a = document.createElement("a");
  a.href = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_PENT[type].list(), null, 2));
  a.download = type + "_" + new Date().toISOString().slice(0,10) + ".json"; a.click();
}
function _pentImport(type, input) {
  var file = input.files[0]; if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try { var d = JSON.parse(e.target.result);
      if (Array.isArray(d)) { PARTY_DATA[type === "ally" ? "allies" : type+"s"] = d; saveParty(); _PENT[type].render(); }
      else showToast("Неверный формат файла", "error");
    } catch(err) { showToast("Ошибка загрузки", "error"); }
  };
  reader.readAsText(file); input.value = "";
}
// Обёртки — сохраняем старые имена чтобы не менять index.html
function openAddAllyModal()        { _pentOpen("ally"); }
function openEditAllyModal(i)      { _pentOpen("ally", i); }
function closeAddAllyModal()       { _pentClose("ally"); }
function saveAlly()                { _pentSave("ally"); }
function deleteAlly(i)             { _pentDelete("ally", i); }
function setAllyStatus(i, val)     { _pentStatus("ally", i, val); }
function exportAllies()            { _pentExport("ally"); }
function importAllies(input)       { _pentImport("ally", input); }

function openAddNPCModal()         { _pentOpen("npc"); }
function openEditNPCModal(i)       { _pentOpen("npc", i); }
function closeAddNPCModal()        { _pentClose("npc"); }
function saveNPC()                 { _pentSave("npc"); }
function deleteNPC(i)              { _pentDelete("npc", i); }
function setNPCStatus(i, val)      { _pentStatus("npc", i, val); }
function exportNPCs()              { _pentExport("npc"); }
function importNPCs(input)         { _pentImport("npc", input); }

function openAddMonsterModal()     { _pentOpen("monster"); }
function openEditMonsterModal(i)   { _pentOpen("monster", i); }
function closeAddMonsterModal()    { _pentClose("monster"); }
function saveMonster()             { _pentSave("monster"); }
function deleteMonster(i)          { _pentDelete("monster", i); }
function setMonsterStatus(i, val)  { _pentStatus("monster", i, val); }
function exportMonsters()          { _pentExport("monster"); }
function importMonsters(input)     { _pentImport("monster", input); }


// ─── NPCs ────────────────────────────────────────────────────
function renderNPCs() {
  var list    = $("npcs-list");
  var countEl = $("npcs-count");
  if (!list) return;
  if (countEl) countEl.textContent = (PARTY_DATA.npcs && PARTY_DATA.npcs.length > 0) ? PARTY_DATA.npcs.length : "";
  if (!PARTY_DATA.npcs || PARTY_DATA.npcs.length === 0) { list.innerHTML = "<div class='party-empty'>📭 Нет персонажей</div>"; return; }
  list.innerHTML = PARTY_DATA.npcs.map(function(n, i) {
    return '<div class="pcard pcard-npc">' +
      '<div class="pcard-icon pcard-icon-npc">🧑</div>' +
      '<div class="pcard-body">' +
        '<div class="pcard-name">' + escapeHtml(n.name) + '</div>' +
        '<div class="pcard-sub">' + escapeHtml(n.role || "Персонаж") + '</div>' +
        (n.desc ? '<div class="pcard-desc">' + escapeHtml(n.desc) + '</div>' : '') +
        '<div class="pcard-status-row"><select class="pcard-status-sel" onchange="setNPCStatus(' + i + ',this.value)" onclick="event.stopPropagation()">' +
        CONDITION_STATUSES.map(function(s) { return '<option value="' + s.value + '"' + (s.value === (n.status||"healthy") ? " selected" : "") + '>' + s.label + '</option>'; }).join("") +
        '</select></div>' +
      '</div>' +
      '<div class="pcard-actions">' +
        '<button class="pcard-edit-btn" onclick="openEditNPCModal(' + i + ')" title="Редактировать">✏️</button>' +
        '<button class="pcard-del-btn"  onclick="deleteNPC(' + i + ')" title="Удалить">✕</button>' +
      '</div>' +
    '</div>';
  }).join("");
}




// ─── MONSTERS ─────────────────────────────────────────────────
function renderMonsters() {
  var list    = $("monsters-list");
  var countEl = $("monsters-count");
  if (!list) return;
  if (countEl) countEl.textContent = PARTY_DATA.monsters.length > 0 ? PARTY_DATA.monsters.length : "";
  if (PARTY_DATA.monsters.length === 0) { list.innerHTML = "<div class='party-empty'>📭 Нет монстров. Добавьте врага!</div>"; return; }
  list.innerHTML = PARTY_DATA.monsters.map(function(m, i) {
    var typeIcon = getMonsterTypeIcon(m.type);
    return '<div class="pcard pcard-monster">' +
      '<div class="pcard-icon pcard-icon-monster">' + typeIcon + '</div>' +
      '<div class="pcard-body">' +
        '<div class="pcard-name">' + escapeHtml(m.name) + '</div>' +
        '<div class="pcard-sub"><span class="pcard-type-badge">' + typeIcon + " " + escapeHtml(m.type || "Монстр") + '</span></div>' +
        (m.desc ? '<div class="pcard-desc">' + escapeHtml(m.desc) + '</div>' : '') +
        '<div class="pcard-status-row"><select class="pcard-status-sel" onchange="setMonsterStatus(' + i + ',this.value)" onclick="event.stopPropagation()">' +
        CONDITION_STATUSES.map(function(s) { return '<option value="' + s.value + '"' + (s.value === (m.status||"healthy") ? " selected" : "") + '>' + s.label + '</option>'; }).join("") +
        '</select></div>' +
      '</div>' +
      '<div class="pcard-actions">' +
        '<button class="pcard-edit-btn" onclick="openEditMonsterModal(' + i + ')" title="Редактировать">✏️</button>' +
        '<button class="pcard-del-btn"  onclick="deleteMonster(' + i + ')" title="Удалить">✕</button>' +
      '</div>' +
    '</div>';
  }).join("");
}




// ─── BATTLE TAB ──────────────────────────────────────────────
var battleSetupList = [];
var battleDragSrcIdx = null;
var battleSectionOpen = { self: true, ally: true, npc: true, monster: true };

function openBattleTab() {
  if (BATTLE_DATA.active) {
    $("battle-setup-screen").classList.add("hidden");
    $("battle-tracker-screen").classList.remove("hidden");
    renderBattleTracker();
  } else {
    $("battle-setup-screen").classList.remove("hidden");
    $("battle-tracker-screen").classList.add("hidden");
    buildBattleSetupList();
    renderBattleSetup();
  }
}

function buildBattleSetupList() {
  var prevChecked = {};
  battleSetupList.forEach(function(p) { prevChecked[p.id] = p.checked; });
  battleSetupList = [];
  var char = getCurrentChar();
  if (char) {
    battleSetupList.push({ id: "self_" + char.id, name: char.name || "Мой персонаж", icon: getClassIcon(char.class), color: "#4da843", type: "self", checked: prevChecked["self_" + char.id] === true });
  }
  PARTY_DATA.allies.forEach(function(a) {
    battleSetupList.push({ id: "ally_" + a.id, name: a.name, icon: getClassIcon(a.cls), color: "#27ae60", type: "ally", checked: prevChecked["ally_" + a.id] === true });
  });
  if (PARTY_DATA.npcs) PARTY_DATA.npcs.forEach(function(n) {
    battleSetupList.push({ id: "npc_" + n.id, name: n.name, icon: "🧑", color: "#d4ac0d", type: "npc", checked: prevChecked["npc_" + n.id] === true });
  });
  PARTY_DATA.monsters.forEach(function(m) {
    battleSetupList.push({ id: "mon_" + m.id, name: m.name, icon: getMonsterIcon(m.type), color: "#c0392b", type: "monster", checked: prevChecked["mon_" + m.id] === true });
  });
}

var battleSearchQuery = "";
function setBattleSearch(val) { battleSearchQuery = val.toLowerCase().trim(); renderBattleSetup(); }
function toggleBattleSection(type) {
  battleSectionOpen[type] = !battleSectionOpen[type];
  renderBattleSetup();
}

function renderBattleSetup() {
  var container = $("battle-setup-list");
  if (!container) return;
  if (battleSetupList.length === 0) {
    container.innerHTML = "<div class='party-empty'>Добавьте участников во вкладке Отряд</div>";
    return;
  }
  var sections = [
    { type: "self",    label: "🟢 Я",          color: "#4da843" },
    { type: "ally",    label: "🟢 Союзники",   color: "#27ae60" },
    { type: "npc",     label: "🟡 Персонажи",  color: "#d4ac0d" },
    { type: "monster", label: "🔴 Враги",      color: "#c0392b" }
  ];
  var q = battleSearchQuery;
  container.innerHTML = sections.map(function(sec) {
    var items = battleSetupList.filter(function(p, i) {
      return p.type === sec.type && (!q || p.name.toLowerCase().includes(q));
    });
    if (items.length === 0) return "";
    var open = battleSectionOpen[sec.type];
    var checkedCount = items.filter(function(p) { return p.checked; }).length;
    var rows = open ? items.map(function(p) {
      var gi = battleSetupList.indexOf(p);
      return '<div class="battle-setup-row' + (p.checked ? " battle-row-checked" : "") + '" id="brow_' + gi + '">' +
        '<label class="battle-check-wrap" onclick="event.stopPropagation()">' +
          '<input type="checkbox" class="battle-checkbox"' + (p.checked ? " checked" : "") + ' onchange="toggleBattleCheck(' + gi + ',this.checked)">' +
        "</label>" +
        '<div class="battle-setup-icon" style="background:' + p.color + '22;color:' + p.color + '">' + p.icon + "</div>" +
        '<div class="battle-setup-name">' + escapeHtml(p.name) + "</div>" +
      "</div>";
    }).join("") : "";
    return '<div class="battle-section">' +
      '<div class="battle-section-title" style="color:' + sec.color + '" onclick="toggleBattleSection(\'' + sec.type + '\')">' +
        '<span class="battle-section-arrow">' + (open ? "▾" : "▸") + "</span>" +
        sec.label + ' <span class="battle-section-count">(' + items.length + (checkedCount > 0 ? ", выбрано: " + checkedCount : "") + ")</span>" +
      "</div>" +
      rows +
    "</div>";
  }).join("");
}

function toggleBattleCheck(i, val) {
  if (battleSetupList[i]) battleSetupList[i].checked = val;
  renderBattleSetup();
}

function battleDragStart(e, i) { battleDragSrcIdx = i; e.dataTransfer.effectAllowed = "move"; }
function battleDragOver(e) { e.preventDefault(); }
function battleDrop(e, i) {
  e.preventDefault();
  if (battleDragSrcIdx === null || battleDragSrcIdx === i) return;
  var moved = battleSetupList.splice(battleDragSrcIdx, 1)[0];
  battleSetupList.splice(i, 0, moved);
  battleDragSrcIdx = null;
  renderBattleSetup();
}
function battleDragEnd() { battleDragSrcIdx = null; }

function startBattle() {
  var selected = battleSetupList.filter(function(p) { return p.checked; });
  if (selected.length === 0) { showToast("Выберите участников боя", "warn"); return; }
  BATTLE_DATA = { active: true, participants: selected.map(function(p) { return Object.assign({}, p, { status: "healthy" }); }), currentTurn: 0 };
  saveBattle();
  $("battle-setup-screen").classList.add("hidden");
  $("battle-tracker-screen").classList.remove("hidden");
  renderBattleTracker();
}

function getParticipantDesc(p) {
  // Look up description from party data by type and id
  if (p.type === "ally") {
    var a = PARTY_DATA.allies.find(function(x) { return x.id === p.id || x.name === p.name; });
    return a ? a.desc : "";
  }
  if (p.type === "npc") {
    var n = PARTY_DATA.npcs && PARTY_DATA.npcs.find(function(x) { return x.id === p.id || x.name === p.name; });
    return n ? (n.desc || n.role || "") : "";
  }
  if (p.type === "monster") {
    var m = PARTY_DATA.monsters.find(function(x) { return x.id === p.id || x.name === p.name; });
    return m ? m.desc : "";
  }
  if (p.type === "self") {
    var char = getCurrentChar();
    return char ? (char.class || "") + (char.subclass ? " · " + char.subclass : "") + " · " + (char.level||1) + " ур." : "";
  }
  return "";
}

function showTrackerInfo(i) {
  var p = BATTLE_DATA.participants[i];
  if (!p) return;
  var desc = getParticipantDesc(p);
  var fcolor = getFactionColor(p.type);
  var modal = $("tracker-info-modal");
  if (!modal) {
    // create on fly
    modal = document.createElement("div");
    modal.id = "tracker-info-modal";
    modal.className = "confirm-modal-overlay";
    modal.innerHTML =
      '<div class="confirm-modal-box tracker-info-box">' +
        '<div class="tracker-info-icon" id="tinfo-icon"></div>' +
        '<div class="tracker-info-name" id="tinfo-name"></div>' +
        '<div class="tracker-info-type" id="tinfo-type"></div>' +
        '<div class="tracker-info-desc" id="tinfo-desc"></div>' +
        '<div class="confirm-modal-btns" style="margin-top:16px">' +
          '<button class="confirm-btn-ok" onclick="$(\'tracker-info-modal\').classList.remove(\'active\')">Закрыть</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function(e) { if (e.target === modal) modal.classList.remove("active"); });
  }
  $("tinfo-icon").textContent = p.icon || "🎭";
  $("tinfo-name").textContent = p.name || "?";
  $("tinfo-type").style.color = fcolor;
  $("tinfo-type").textContent = getFactionLabel(p.type).toUpperCase();
  var descEl = $("tinfo-desc");
  descEl.textContent = desc || "Нет описания.";
  descEl.style.display = desc ? "block" : "none";
  modal.classList.add("active");
}


// Авто-статус для "я" по % ХП
function getSelfStatusFromHP() {
  var char = getCurrentChar();
  if (!char) return "healthy";
  var hp  = char.combat.hpCurrent || 0;
  var max = char.combat.hpMax    || 1;
  if (max <= 0) return "healthy";
  var pct = Math.round(hp / max * 100);
  if (pct <= 0)  return "dead";
  if (pct <= 15) return "dying";
  if (pct <= 35) return "heavy";
  if (pct <= 60) return "wounded";
  return "healthy";
}

function syncSelfBattleStatus() {
  if (!BATTLE_DATA.active) return;
  var newStatus = getSelfStatusFromHP();
  var changed = false;
  BATTLE_DATA.participants.forEach(function(p) {
    if (p.type === "self") { p.status = newStatus; changed = true; }
  });
  if (changed) { saveBattle(); renderBattleTracker(); }
}

function renderBattleTracker() {
  var list = $("battle-tracker-list");
  var turnInfo = $("battle-turn-info");
  if (!list) return;
  // sync self HP status before render
  var selfStatus = getSelfStatusFromHP();
  BATTLE_DATA.participants.forEach(function(p) {
    if (p.type === "self") p.status = selfStatus;
  });
  var current = BATTLE_DATA.participants[BATTLE_DATA.currentTurn];
  if (turnInfo && current) turnInfo.textContent = "Ход " + (BATTLE_DATA.currentTurn + 1) + ": " + (current.name || "?");
  list.innerHTML = BATTLE_DATA.participants.map(function(p, i) {
    var isCurrent = i === BATTLE_DATA.currentTurn;
    var fcolor = getFactionColor(p.type);
    var isSelf  = p.type === "self";
    var desc    = getParticipantDesc(p);
    // For self — status driven by HP, select is read-only display
    var statusLabel = CONDITION_STATUSES.find(function(s) { return s.value === (p.status || "healthy"); });
    var statusText  = statusLabel ? statusLabel.label : "💚 Здоров";
    var opts = CONDITION_STATUSES.map(function(s) {
      return '<option value="' + s.value + '"' + (s.value === (p.status || "healthy") ? " selected" : "") + ">" + s.label + "</option>";
    }).join("");
    return '<div class="tracker-row' + (isCurrent ? " tracker-row-active" : "") + (isSelf ? " tracker-row-self" : "") + '" style="border-left:3px solid ' + fcolor + '">' +
      '<div class="tracker-num" style="color:' + fcolor + '">' + (i + 1) + "</div>" +
      '<div class="tracker-icon" style="background:' + fcolor + '22;color:' + fcolor + '">' + (p.icon || "🎭") + "</div>" +
      '<div class="tracker-name">' +
        '<span class="tracker-name-text">' + escapeHtml(p.name || "?") + '</span>' +
      "</div>" +
      (desc ? '<button class="tracker-info-btn" onclick="showTrackerInfo(' + i + ')" title="Описание">!</button>' : '') +
      (isSelf
        ? '<span class="tracker-self-status">' + statusText + '</span>'
        : '<select class="party-status-sel tracker-status" onchange="setBattleStatus(' + i + ',this.value)">' + opts + "</select>"
      ) +
    "</div>";
  }).join("");
}


function setBattleStatus(i, val) { BATTLE_DATA.participants[i].status = val; saveBattle(); renderBattleTracker(); }
function nextTurn() { BATTLE_DATA.currentTurn = (BATTLE_DATA.currentTurn + 1) % BATTLE_DATA.participants.length; saveBattle(); renderBattleTracker(); }
function prevTurn() { BATTLE_DATA.currentTurn = (BATTLE_DATA.currentTurn - 1 + BATTLE_DATA.participants.length) % BATTLE_DATA.participants.length; saveBattle(); renderBattleTracker(); }
function endBattle() {
  BATTLE_DATA = { active: false, participants: [], currentTurn: 0 };
  saveBattle();
  $("battle-setup-screen").classList.remove("hidden");
  $("battle-tracker-screen").classList.add("hidden");
  buildBattleSetupList();
  renderBattleSetup();
}

// ============================================================
// АККОРДЕОН — сворачиваемые секции
// ============================================================
function toggleAccordion(btn) {
  var body = btn.nextElementSibling;
  if (!body) return;
  var isOpen = btn.getAttribute("aria-expanded") === "true";
  var arrow = btn.querySelector(".accordion-arrow");
  if (isOpen) {
    body.style.display = "none";
    btn.setAttribute("aria-expanded", "false");
    if (arrow) arrow.textContent = "▸";
  } else {
    body.style.display = "";
    btn.setAttribute("aria-expanded", "true");
    if (arrow) arrow.textContent = "▾";
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
  return parseInt(raw) || 0;
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
}

function buildASIStatGrid(char) {
  var grid = $("asi-stat-grid");
  if (!grid) return;
  var statNames = {str:"Сила",dex:"Ловкость",con:"Телосложение",int:"Интеллект",wis:"Мудрость",cha:"Харизма"};
  var statIcons = {str:"💪",dex:"🏃",con:"❤️",int:"🧠",wis:"👁️",cha:"🎭"};
  grid.innerHTML = Object.keys(statNames).map(function(k) {
    var val = char.stats[k] || 10;
    var mod = getMod(val);
    return '<div class="asi-stat-item" id="asi-stat-' + k + '" onclick="toggleASIStat(\'' + k + '\')">' +
      '<span class="asi-stat-icon">' + statIcons[k] + '</span>' +
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

function openAddCompanionModal() {
  $("companion-modal-title").textContent = "🐾 Добавить прихвостня";
  $("companion-edit-index").value = "-1";
  $("companion-name-inp").value = "";
  $("companion-type-sel").value = "familiar";
  $("companion-hp-inp").value = "10";
  $("companion-ac-inp").value = "10";
  $("companion-attack-inp").value = "";
  $("companion-desc-inp").value = "";
  $("add-companion-modal")?.classList.add("active");
}
function openEditCompanionModal(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var c = getCompanions(char)[i];
  if (!c) return;
  $("companion-modal-title").textContent = "✏️ Редактировать прихвостня";
  $("companion-edit-index").value = i;
  $("companion-name-inp").value = c.name || "";
  $("companion-type-sel").value = c.type || "other";
  $("companion-hp-inp").value = c.hpMax || 10;
  $("companion-ac-inp").value = c.ac || 10;
  $("companion-attack-inp").value = c.attack || "";
  $("companion-desc-inp").value = c.desc || "";
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
  var idx = parseInt($("companion-edit-index").value);
  var companions = getCompanions(char);
  var hpMax = parseInt($("companion-hp-inp")?.value) || 10;
  var data = {
    id: idx >= 0 ? (companions[idx].id || Date.now()) : Date.now(),
    name: name,
    type: $("companion-type-sel")?.value || "other",
    hpMax: hpMax,
    hpCurrent: idx >= 0 ? companions[idx].hpCurrent : hpMax,
    ac: parseInt($("companion-ac-inp")?.value) || 10,
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

  el.innerHTML = '<div class="feat-search-wrap"><input type="text" class="feat-search-inp" placeholder="🔍 Поиск черты..." oninput="filterFeatList(this.value)"></div>' +
    '<div class="feat-list" id="feat-list-items">' +
    FEATS_DATA.map(function(feat) {
      var taken = takenFeats.some(function(f) { return f.id === feat.id; });
      var selected = asiFeatSelected === feat.id;
      return '<div class="feat-item' + (selected ? " selected" : "") + (taken ? " taken" : "") + '" onclick="selectFeat(\'' + feat.id + '\')" data-name="' + escapeHtml(feat.name.toLowerCase()) + '">' +
        '<div class="feat-item-header">' +
          '<span class="feat-item-name">' + escapeHtml(feat.name) + '</span>' +
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

  // Record feat
  char.feats.push({ id: feat.id, name: feat.name, level: char.level });

  saveToLocal();
  calcStats();
  recalculateHP();
  calculateAC();
  updateHPDisplay();

  // Journal entry
  addJournalEntry("feat", "Черта: " + feat.name, appliedDesc.length > 0 ? "Применено: " + appliedDesc.join(", ") : feat.desc.slice(0, 80));

  // Mark ASI level as used BEFORE closeASIModal (which resets asiCurrentLevel)
  if (asiCurrentLevel) {
    if (!char.asiUsedLevels) char.asiUsedLevels = [];
    if (!char.asiUsedLevels.includes(asiCurrentLevel)) char.asiUsedLevels.push(asiCurrentLevel);
  }
  asiCurrentLevel = null;
  closeASIModal();
  asiFeatSelected = null;
  showHPToast(0, "🎯 Черта «" + feat.name + "» получена!" + (appliedDesc.length ? " " + appliedDesc.join(", ") : ""));
  renderJournal();
  renderTakenFeats();
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
