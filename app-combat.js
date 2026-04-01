// ============================================================
// app-combat.js — Боевая система: характеристики, спасброски,
// навыки, КД, условия, эффекты, монеты
// ============================================================

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
// Update concentration display
updateConcentrationDisplay();
var _acTotalEl = $("ac-total"); if (_acTotalEl) _acTotalEl.textContent = ac;
var _acFormulaEl = $("ac-formula"); if (_acFormulaEl) _acFormulaEl.textContent = formulaParts.join(" ");
var _combatAcEl = $("combat-ac"); if (_combatAcEl) _combatAcEl.value = ac;
const modifiersContainer = $("ac-modifiers");
if (modifiersContainer) {
modifiersContainer.innerHTML = "";
modifiers.forEach(function(mod) {
const modDiv = document.createElement("div");
modDiv.className = "ac-modifier-item" + (mod.type === "negative" ? " negative" : "");
modDiv.innerHTML = "<span>" + escapeHtml(mod.name) + "</span><span class=\"ac-modifier-value\">" + (mod.value >= 0 ? "+" : "") + mod.value + "</span>";
modifiersContainer.appendChild(modDiv);
});
}
var _statusAcEl = $("status-ac"); if (_statusAcEl) _statusAcEl.textContent = ac;
char.combat.ac = ac;
}

function toggleInspiration() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
char.inspiration = !char.inspiration;
saveToLocal();
updateStatusBar();
showToast(char.inspiration ? "✨ Вдохновение получено!" : "✨ Вдохновение использовано", char.inspiration ? "success" : "info");
}

function setConcentration(btnOrName) {
var spellName = (btnOrName && typeof btnOrName === 'object') ? (btnOrName.dataset && btnOrName.dataset.name) : btnOrName;
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
// Если уже концентрируемся на этом же заклинании — открыть окно деталей
if (char.concentration && char.concentration === spellName) {
  openConcDetails();
  return;
}
// Если другое заклинание — прервать старое
if (char.concentration && char.concentration !== spellName) {
  showToast("🔮 Концентрация на «" + char.concentration + "» прервана", "warn");
}
// Найти данные заклинания
var spellData = null;
if (spellName && typeof SPELL_DATABASE !== 'undefined') {
  spellData = SPELL_DATABASE.find(function(s) { return s.name === spellName; });
}
if (!spellData && currentId) {
  var c = getCurrentChar();
  if (c && c.spells && c.spells.mySpells) {
    spellData = c.spells.mySpells.find(function(s) { return s.name === spellName; });
  }
}
char.concentration = spellName || null;
char.concentrationData = spellData ? { duration: spellData.duration, desc: spellData.desc } : null;
saveToLocal();
updateConcentrationDisplay();
if (spellName) showToast("🔮 Концентрация: " + spellName, "info");
}

function openConcDetails() {
if (!currentId) return;
const char = getCurrentChar();
if (!char || !char.concentration) {
  return;
}
var modal = $("conc-details-modal");
if (!modal) {
  return;
}
var nameEl = $("conc-details-name");
var durEl = $("conc-detail-duration");
var descEl = $("conc-detail-desc");
var descRow = $("conc-detail-desc-row");
if (nameEl) nameEl.textContent = char.concentration;
if (durEl) durEl.textContent = (char.concentrationData && char.concentrationData.duration) || "—";
if (descEl && char.concentrationData && char.concentrationData.desc) {
  descEl.textContent = char.concentrationData.desc;
  if (descRow) descRow.style.display = "flex";
} else {
  if (descRow) descRow.style.display = "none";
}
modal.classList.add("active");
modal.classList.remove("hidden");
}

function closeConcDetails() {
var modal = $("conc-details-modal");
if (modal) {
  modal.classList.remove("active");
  modal.classList.add("hidden");
}
}

function endConcentration() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const name = char.concentration;
char.concentration = null;
saveToLocal();
updateConcentrationDisplay();
if (name) showToast("🔮 Концентрация на «" + name + "» завершена", "info");
}

function updateConcentrationDisplay() {
if (!currentId) return;
const char = getCurrentChar();
// Update spell tab block
const block = $("concentration-block");
const nameEl = $("conc-name");
if (block) {
  if (char && char.concentration) {
    block.classList.add("active");
    if (nameEl) nameEl.textContent = char.concentration;
  } else {
    block.classList.remove("active");
    if (nameEl) nameEl.textContent = "—";
  }
}
// Update status bar indicator
const statusConc = $("status-concentration");
const statusConcName = $("status-conc-name");
if (statusConc) {
  if (char && char.concentration) {
    statusConc.classList.remove("hidden");
    if (statusConcName) statusConcName.textContent = char.concentration;
  } else {
    statusConc.classList.add("hidden");
  }
}
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
if (!conditionsContainer) return;
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
// Вдохновение
const inspiEl = $("status-inspiration");
if (inspiEl) inspiEl.classList.toggle("active", !!char.inspiration);
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
if (stat === "str") {
  updateSlotsDisplay();
}
}
function adjustCoin(coinType, delta) {
const input = $("coin-" + coinType);
if (!input) return;
let value = parseInt(input.value) || 0;
value += delta;
if (value < 0) value = 0;
input.value = value;
updateChar();
updateCoinTotal();
}
function updateCoinTotal() {
const cp = parseInt($("coin-cp")?.value) || 0;
const sp = parseInt($("coin-sp")?.value) || 0;
const ep = parseInt($("coin-ep")?.value) || 0;
const gp = parseInt($("coin-gp")?.value) || 0;
const pp = parseInt($("coin-pp")?.value) || 0;
const total = cp * 0.01 + sp * 0.1 + ep * 0.5 + gp * 1 + pp * 10;
const el = $("coin-total-gp");
if (el) el.textContent = Number.isInteger(total) ? total : total.toFixed(2);
renderPouches();
}

// Coin rates in GP
var COIN_RATES = { cp: 0.01, sp: 0.1, ep: 0.5, gp: 1, pp: 10 };
var COIN_NAMES = { cp: "ММ", sp: "СМ", ep: "ЭМ", gp: "ЗМ", pp: "ПМ" };

function openCoinExchange() {
  previewExchange();
  var modal = $("coin-exchange-modal");
  if (modal) modal.classList.add("active");
}
function closeCoinExchange() {
  var modal = $("coin-exchange-modal");
  if (modal) modal.classList.remove("active");
}
function previewExchange() {
  var from = $("exch-from")?.value;
  var to = $("exch-to")?.value;
  var amt = parseInt($("exch-amount")?.value) || 0;
  var preview = $("exch-preview");
  var availEl = $("exch-from-avail");
  if (!from || !to || !preview) return;
  // Show available
  var avail = parseInt($("coin-" + from)?.value) || 0;
  if (availEl) availEl.textContent = avail;
  if (from === to) { preview.textContent = "Выберите разные монеты"; preview.className = "coin-exch-preview coin-exch-preview-warn"; return; }
  if (amt <= 0) { preview.textContent = "Введите количество"; preview.className = "coin-exch-preview"; return; }
  // Calculate
  var valueInGP = amt * COIN_RATES[from];
  var result = valueInGP / COIN_RATES[to];
  if (!Number.isInteger(result) && Math.round(result) !== result) {
    // Check if it divides evenly
    var rounded = Math.floor(result);
    var leftover = valueInGP - rounded * COIN_RATES[to];
    var leftoverCoin = Math.round(leftover / COIN_RATES[from]);
    if (leftoverCoin > 0) {
      preview.textContent = amt + " " + COIN_NAMES[from] + " → " + rounded + " " + COIN_NAMES[to] + " + " + leftoverCoin + " " + COIN_NAMES[from] + " сдача";
    } else {
      preview.textContent = amt + " " + COIN_NAMES[from] + " → " + result.toFixed(2) + " " + COIN_NAMES[to] + " (нецелое, округлится до " + rounded + ")";
    }
    preview.className = "coin-exch-preview coin-exch-preview-warn";
  } else {
    if (avail < amt) {
      preview.textContent = "⚠️ Недостаточно " + COIN_NAMES[from] + " (есть " + avail + ")";
      preview.className = "coin-exch-preview coin-exch-preview-error";
    } else {
      preview.textContent = amt + " " + COIN_NAMES[from] + " → " + Math.round(result) + " " + COIN_NAMES[to];
      preview.className = "coin-exch-preview coin-exch-preview-ok";
    }
  }
}
function confirmExchange() {
  var from = $("exch-from")?.value;
  var to = $("exch-to")?.value;
  var amt = parseInt($("exch-amount")?.value) || 0;
  if (!from || !to || from === to || amt <= 0) { showToast("Проверьте параметры обмена", "warn"); return; }
  var avail = parseInt($("coin-" + from)?.value) || 0;
  if (avail < amt) { showToast("Недостаточно " + COIN_NAMES[from], "error"); return; }
  var valueInGP = amt * COIN_RATES[from];
  var result = Math.floor(valueInGP / COIN_RATES[to]);
  if (result <= 0) { showToast("Нельзя обменять — результат 0", "warn"); return; }
  // Leftover back
  var usedGP = result * COIN_RATES[to];
  var leftoverGP = valueInGP - usedGP;
  var leftoverAmt = Math.round(leftoverGP / COIN_RATES[from]);
  var fromEl = $("coin-" + from);
  var toEl = $("coin-" + to);
  fromEl.value = avail - amt + leftoverAmt;
  toEl.value = (parseInt(toEl.value) || 0) + result;
  updateChar();
  updateCoinTotal();
  var msg = amt + " " + COIN_NAMES[from] + " → " + result + " " + COIN_NAMES[to];
  if (leftoverAmt > 0) msg += " (сдача: " + leftoverAmt + " " + COIN_NAMES[from] + ")";
  showToast(msg, "success");
  closeCoinExchange();
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
const spellStatVal = $("spell-stat")?.value || "";
if (spellStatVal) char.spells.stat = spellStatVal;
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
function setSpellStat(stat) {
const char = getCurrentChar();
if (!char) return;
char.spells.stat = stat;
// sync hidden select if needed
const sel = $("spell-stat");
if (sel) sel.value = stat;
saveToLocal();
calcSpellStats();
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
// Update visual displays
var modEl = $("spell-mod-display");
var dcEl = $("spell-dc-display");
var atkEl = $("spell-attack-display");
if (modEl) modEl.textContent = stat ? formatMod(statMod) : "—";
if (dcEl) dcEl.textContent = stat ? dc : "—";
if (atkEl) atkEl.textContent = stat ? formatMod(attack) : "—";
// Highlight active stat button
["int","wis","cha"].forEach(function(s) {
  var btn = $("sc-btn-" + s);
  if (btn) btn.classList.remove("active");
});
if (stat === "ИНТ" && $("sc-btn-int")) $("sc-btn-int").classList.add("active");
if (stat === "МУД" && $("sc-btn-wis")) $("sc-btn-wis").classList.add("active");
if (stat === "ХАР" && $("sc-btn-cha")) $("sc-btn-cha").classList.add("active");
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
