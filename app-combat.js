// ============================================================
// app-combat.js — Боевая система: характеристики, спасброски,
// навыки, КД, условия, эффекты, монеты
// ============================================================

// ============================================
// ПОПАП ВЫБОРА РЕЖИМА БРОСКА (Преимущество / Помеха)
// ============================================
function showRollModePopup(callback) {
  var existing = document.getElementById("roll-mode-popup-overlay");
  if (existing) existing.remove();
  var overlay = document.createElement("div");
  overlay.id = "roll-mode-popup-overlay";
  overlay.className = "roll-mode-overlay";
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  var popup = document.createElement("div");
  popup.className = "roll-mode-popup";
  popup.innerHTML =
    '<div class="roll-mode-title">Режим броска</div>' +
    '<button class="roll-mode-btn roll-mode-normal" data-mode="normal">🎲 Обычный</button>' +
    '<button class="roll-mode-btn roll-mode-adv" data-mode="adv">⬆️ Преимущество</button>' +
    '<button class="roll-mode-btn roll-mode-dis" data-mode="dis">⬇️ Помеха</button>';
  popup.querySelectorAll(".roll-mode-btn").forEach(function(btn) {
    btn.onclick = function() {
      overlay.remove();
      callback(btn.getAttribute("data-mode"));
    };
  });
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

// Бросок d20 с поддержкой adv/dis, возвращает {roll, r1, r2, mode, isCrit, isFail}
function rollD20WithMode(mode) {
  var r1 = Math.floor(Math.random() * 20) + 1;
  var r2 = (mode === 'adv' || mode === 'dis') ? Math.floor(Math.random() * 20) + 1 : null;
  var roll;
  if (mode === 'adv') {
    roll = Math.max(r1, r2);
  } else if (mode === 'dis') {
    roll = Math.min(r1, r2);
  } else {
    roll = r1;
  }
  return { roll: roll, r1: r1, r2: r2, mode: mode || 'normal', isCrit: roll === 20, isFail: roll === 1 };
}

// Форматирование строки броска с зачёркнутым отброшенным
function formatRollMode(d, bonus) {
  var total = d.roll + bonus;
  var rollStr = "";
  if (d.mode === 'adv') {
    var kept = d.roll, discarded = (d.roll === d.r1) ? d.r2 : d.r1;
    rollStr = kept + " (~~" + discarded + "~~)";
  } else if (d.mode === 'dis') {
    var kept = d.roll, discarded = (d.roll === d.r1) ? d.r2 : d.r1;
    rollStr = kept + " (~~" + discarded + "~~)";
  } else {
    rollStr = "" + d.roll;
  }
  return rollStr;
}

function formatRollModeLabel(d) {
  if (d.mode === 'adv') return ' с преимуществом';
  if (d.mode === 'dis') return ' с помехой';
  return '';
}

// Показать/скрыть два кубика при преимуществе/помехе
function showDualDice(d) {
  var dualDisplay = $("dice-dual-display");
  var keptEl = $("dice-dual-kept");
  var discEl = $("dice-dual-discarded");
  if (!dualDisplay) return;
  if (d.mode === 'adv' || d.mode === 'dis') {
    var kept = d.roll;
    var discarded = (d.roll === d.r1) ? d.r2 : d.r1;
    if (keptEl) keptEl.textContent = kept;
    if (discEl) discEl.textContent = discarded;
    dualDisplay.style.display = "flex";
    dualDisplay.className = "dice-dual-display " + (d.mode === 'adv' ? 'dice-dual-adv' : 'dice-dual-dis');
  } else {
    dualDisplay.style.display = "none";
  }
}

// Строка для dice-result-info: показывает оба кубика при adv/dis
function formatDiceInfoStr(d) {
  if (d.mode === 'adv') {
    var kept = d.roll, disc = (d.roll === d.r1) ? d.r2 : d.r1;
    return 'к20: [' + d.r1 + ', ' + d.r2 + '] → ' + kept;
  }
  if (d.mode === 'dis') {
    var kept = d.roll, disc = (d.roll === d.r1) ? d.r2 : d.r1;
    return 'к20: [' + d.r1 + ', ' + d.r2 + '] → ' + kept;
  }
  return 'к20=' + d.roll;
}

// ── Бросок спасброска ──
function rollSavingThrow(saveKey) {
  var char = getCurrentChar();
  if (!char) return;
  var save = SAVES_DATA.find(function(s) { return s.key === saveKey; });
  if (!save) return;
  showRollModePopup(function(mode) {
    var statMod = getMod(char.stats[saveKey]);
    var profBonus = getProficiencyBonus(parseInt($("char-level")?.value) || 1);
    var checkbox = $("save-prof-" + saveKey);
    var bonus = statMod + (checkbox && checkbox.checked ? profBonus : 0);
    var d = rollD20WithMode(mode);
    var total = d.roll + bonus;
    var modeLabel = formatRollModeLabel(d);
    var rollInfo = formatRollMode(d, bonus);
    var msg = save.icon + " Спасбросок " + save.name + modeLabel + ": " + rollInfo + " + " + bonus + " = " + total;
    if (d.isCrit) msg = "🎉 КРИТ! Спасбросок " + save.name + ": " + d.roll + " + " + bonus + " = " + total;
    if (d.isFail) msg = "💀 ПРОВАЛ! Спасбросок " + save.name + ": " + d.roll;
    showToast(msg, d.isCrit ? "success" : d.isFail ? "error" : "info");
    openDiceModal();
    var resultBig = $("dice-result-big");
    var resultInfo = $("dice-result-info");
    var resultBox = $("dice3d-result");
    if (resultBig) resultBig.textContent = total;
    if (resultInfo) resultInfo.textContent = save.name + " · спасбросок" + modeLabel + " · " + formatDiceInfoStr(d);
    if (resultBox) resultBox.className = "dice3d-result" + (d.isCrit ? " crit-success" : d.isFail ? " crit-fail" : " normal");
    drawDiceSVG(20);
    showDualDice(d);
    var numEl = $("dice-svg-num");
    if (numEl) numEl.textContent = total;
    if (d.isCrit) createParticles();
    diceHistory.unshift({ sides:20, result:total, mode:d.mode, time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), r1:d.r1, r2:d.r2, label: save.name + " спас" });
    if (diceHistory.length > 10) diceHistory.pop();
    renderDiceHistory();
  });
}

// ── Бросок проверки навыка ──
function rollSkillCheck(skillIndex) {
  var char = getCurrentChar();
  if (!char) return;
  var skill = skills[skillIndex];
  if (!skill) return;
  showRollModePopup(function(mode) {
    var bonusEl = $("skill-bonus-" + skillIndex);
    var bonus = bonusEl ? parseInt(bonusEl.innerText) : 0;
    if (isNaN(bonus)) bonus = 0;
    var d = rollD20WithMode(mode);
    var total = d.roll + bonus;
    var modeLabel = formatRollModeLabel(d);
    var rollInfo = formatRollMode(d, bonus);
    var msg = "🎯 " + skill.name + modeLabel + ": " + rollInfo + " + " + bonus + " = " + total;
    if (d.isCrit) msg = "🎉 КРИТ! " + skill.name + ": " + d.roll + " + " + bonus + " = " + total;
    if (d.isFail) msg = "💀 ПРОВАЛ! " + skill.name + ": " + d.roll;
    showToast(msg, d.isCrit ? "success" : d.isFail ? "error" : "info");
    openDiceModal();
    var resultBig = $("dice-result-big");
    var resultInfo = $("dice-result-info");
    var resultBox = $("dice3d-result");
    if (resultBig) resultBig.textContent = total;
    if (resultInfo) resultInfo.textContent = skill.name + " · проверка" + modeLabel + " · " + formatDiceInfoStr(d);
    if (resultBox) resultBox.className = "dice3d-result" + (d.isCrit ? " crit-success" : d.isFail ? " crit-fail" : " normal");
    drawDiceSVG(20);
    showDualDice(d);
    var numEl = $("dice-svg-num");
    if (numEl) numEl.textContent = total;
    if (d.isCrit) createParticles();
    diceHistory.unshift({ sides:20, result:total, mode:d.mode, time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), r1:d.r1, r2:d.r2, label: skill.name });
    if (diceHistory.length > 10) diceHistory.pop();
    renderDiceHistory();
  });
}

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
<div class="save-bonus save-bonus-clickable" id="save-bonus-${save.key}" onclick="rollSavingThrow('${save.key}')" title="Бросить спасбросок">+0</div>
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
  '<span class="skill-expertise-btn" id="skill-exp-' + index + '" title="Экспертиза (×2 бонус)" onclick="toggleExpertise(' + index + ')">E</span>' +
  '<label for="skill-prof-' + index + '" class="skill-name-compact">' + escapeHtml(skill.name) + '</label>' +
  '<span class="skill-stat-compact">' + escapeHtml(skill.stat.toUpperCase().slice(0,3)) + '</span>' +
  '<span class="skill-bonus-compact skill-bonus-clickable" id="skill-bonus-' + index + '" onclick="rollSkillCheck(' + index + ')" title="Бросить проверку навыка">+0</span>';
container.appendChild(row);
});
}
function toggleExpertise(index) {
var char = getCurrentChar();
if (!char) return;
if (!char.expertiseSkills) char.expertiseSkills = [];
var profCb = $("skill-prof-" + index);
if (!profCb || !profCb.checked) {
  showToast("Сначала отметьте владение навыком", "error");
  return;
}
var pos = char.expertiseSkills.indexOf(index);
if (pos === -1) {
  char.expertiseSkills.push(index);
} else {
  char.expertiseSkills.splice(pos, 1);
}
calcStats();
saveToLocal();
}
function loadExpertise() {
var char = getCurrentChar();
if (!char || !char.expertiseSkills) return;
for (var i = 0; i < skills.length; i++) {
  var btn = $("skill-exp-" + i);
  if (btn) {
    if (char.expertiseSkills.indexOf(i) !== -1) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  }
}
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
if (typeof migrateToMulticlass === "function") migrateToMulticlass(char);
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

// Список (класс, уровень, подкласс) для рендеринга — поддержка мультикласса
var classList = (char.classes && char.classes.length > 0)
  ? char.classes
  : [{class: className, level: level, subclass: char.subclass || ""}];

classList.forEach(function(entry) {
  var cls = entry.class;
  var clsLevel = entry.level;
  var subName = entry.subclass || "";
  var clsFeats = CLASS_FEATURES[cls];
  if (!clsFeats) return;
  var subFeats = (typeof SUBCLASS_FEATURES !== "undefined" && subName) ? SUBCLASS_FEATURES[subName] : null;

  // Заголовок класса (только если мультикласс)
  if (classList.length > 1) {
    var header = document.createElement("div");
    header.className = "feature-class-header";
    header.innerHTML = "<span class='feature-class-name'>⚔️ " + escapeHtml(cls) + " " + clsLevel + "</span>" +
      (subName ? "<span class='subclass-badge'>" + escapeHtml(subName) + "</span>" : "");
    featuresGrid.appendChild(header);
  }

  for (var l = 1; l <= clsLevel; l++) {
    if (clsFeats[l]) {
      clsFeats[l].forEach(function(feature) {
        var featureDiv = document.createElement("div");
        featureDiv.className = "feature-item" + (l === clsLevel ? " new" : "");
        featureDiv.innerHTML = "<span class=\"feature-level\">" + l + " ур.</span><div class=\"feature-name\">" + escapeHtml(feature.name) + "</div><div class=\"feature-desc\">" + escapeHtml(feature.desc) + "</div>";
        featuresGrid.appendChild(featureDiv);
      });
    }
    if (subFeats && subFeats[l]) {
      subFeats[l].forEach(function(feature) {
        var featureDiv = document.createElement("div");
        featureDiv.className = "feature-item subclass-feature" + (l === clsLevel ? " new" : "");
        featureDiv.innerHTML = "<span class=\"feature-level\">" + l + " ур.</span><span class=\"subclass-badge\">" + escapeHtml(subName) + "</span><div class=\"feature-name\">" + escapeHtml(feature.name) + "</div><div class=\"feature-desc\">" + escapeHtml(feature.desc) + "</div>";
        featuresGrid.appendChild(featureDiv);
      });
    }
  }
});
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
// ============================================
// СОПРОТИВЛЕНИЯ / ИММУНИТЕТЫ / УЯЗВИМОСТИ
// ============================================
function renderResistances() {
  var container = $("resistances-container");
  if (!container) return;
  var char = getCurrentChar();
  if (!char) { container.innerHTML = ""; return; }
  if (!char.resistances) char.resistances = [];
  if (!char.immunities) char.immunities = [];
  if (!char.vulnerabilities) char.vulnerabilities = [];

  var categories = [
    { key: "resistances", title: "Сопротивление", sub: "½", cssClass: "res", icon: "🛡" },
    { key: "immunities", title: "Иммунитет", sub: "0", cssClass: "imm", icon: "🚫" },
    { key: "vulnerabilities", title: "Уязвимость", sub: "×2", cssClass: "vul", icon: "⚠️" }
  ];

  var html = '<div class="resistances-section">';

  // Три категории — бейджи + кнопки добавления для каждой
  categories.forEach(function(cat) {
    var items = char[cat.key] || [];
    html += '<div class="res-row res-row-' + cat.cssClass + '">' +
      '<div class="res-row-label">' + cat.icon + ' ' + cat.title + ' <span class="res-row-mult">' + cat.sub + '</span></div>' +
      '<div class="res-row-content">';
    items.forEach(function(dtype, i) {
      html += '<span class="res-tag res-tag-' + cat.cssClass + '">' +
        escapeHtml(dtype) +
        '<span class="res-tag-x" onclick="removeResistance(\'' + cat.key + '\',' + i + ')">✕</span>' +
        '</span>';
    });
    html += '</div></div>';
  });

  // Добавление — одна строка: dropdown + 3 маленькие кнопки
  html += '<div class="res-add">' +
    '<select id="resistance-type-select" class="res-add-select">';
  DAMAGE_TYPES.forEach(function(dt) {
    html += '<option value="' + dt + '">' + dt + '</option>';
  });
  html += '</select>' +
    '<span class="res-add-label">→</span>' +
    '<button class="res-add-btn res-add-btn-res" onclick="addResistance(\'resistances\')" title="Сопротивление (½ урона)">½</button>' +
    '<button class="res-add-btn res-add-btn-imm" onclick="addResistance(\'immunities\')" title="Иммунитет (0 урона)">0</button>' +
    '<button class="res-add-btn res-add-btn-vul" onclick="addResistance(\'vulnerabilities\')" title="Уязвимость (×2 урона)">×2</button>' +
    '</div>';

  html += '</div>';
  container.innerHTML = html;
}

function addResistance(category) {
  var char = getCurrentChar();
  if (!char) return;
  var sel = $("resistance-type-select");
  if (!sel) return;
  var dtype = sel.value;
  if (!char[category]) char[category] = [];
  if (char[category].indexOf(dtype) !== -1) {
    showToast(dtype + " уже добавлен", "error");
    return;
  }
  // Remove from other categories if present
  ["resistances", "immunities", "vulnerabilities"].forEach(function(cat) {
    if (cat !== category && char[cat]) {
      var idx = char[cat].indexOf(dtype);
      if (idx !== -1) char[cat].splice(idx, 1);
    }
  });
  char[category].push(dtype);
  saveToLocal();
  renderResistances();
  showToast(dtype + " добавлен", "success");
}

function removeResistance(category, index) {
  var char = getCurrentChar();
  if (!char || !char[category]) return;
  char[category].splice(index, 1);
  saveToLocal();
  renderResistances();
}

// Применить сопротивление/иммунитет/уязвимость к урону
function applyDamageResistance(damage, damageType) {
  var char = getCurrentChar();
  if (!char) return damage;
  if (char.immunities && char.immunities.indexOf(damageType) !== -1) return 0;
  if (char.resistances && char.resistances.indexOf(damageType) !== -1) return Math.floor(damage / 2);
  if (char.vulnerabilities && char.vulnerabilities.indexOf(damageType) !== -1) return damage * 2;
  return damage;
}

function initConditions() {
const grid = $("conditions-grid");
if (!grid) return;
grid.innerHTML = "";
// Базовые состояния (не истощение)
var baseConditions = CONDITIONS.filter(function(c) { return c.id.indexOf("exhaustion_") === -1; });
baseConditions.forEach(function(condition) {
  const item = document.createElement("div");
  item.className = "condition-item" + (condition.type ? " " + condition.type : "");
  item.id = "condition-" + condition.id;
  item.onclick = function() { toggleCondition(condition.id); };
  item.innerHTML = "<div class=\"condition-name\">" + escapeHtml(condition.name) + "</div><div class=\"condition-desc\">" + escapeHtml(condition.desc) + "</div>";
  grid.appendChild(item);
});
// Блок истощения отдельно
var exhBlock = document.createElement("div");
exhBlock.className = "exhaustion-block";
exhBlock.innerHTML =
  '<div class="exhaustion-header">' +
    '<span class="exhaustion-title">😫 Истощение</span>' +
    '<div class="exhaustion-controls">' +
      '<button class="exhaustion-btn" onclick="adjustExhaustion(-1)">−</button>' +
      '<span class="exhaustion-level" id="exhaustion-level">0</span>' +
      '<button class="exhaustion-btn" onclick="adjustExhaustion(1)">+</button>' +
    '</div>' +
  '</div>' +
  '<div class="exhaustion-desc" id="exhaustion-desc"></div>';
grid.appendChild(exhBlock);
}
function getExhaustionLevel(char) {
if (!char || !char.conditions) return 0;
for (var i = 6; i >= 1; i--) {
  if (char.conditions.indexOf("exhaustion_" + i) !== -1) return i;
}
return 0;
}
function adjustExhaustion(delta) {
if (!currentId) return;
var char = getCurrentChar();
if (!char) return;
if (!char.conditions) char.conditions = [];
var current = getExhaustionLevel(char);
var next = Math.max(0, Math.min(6, current + delta));
// Убираем все уровни истощения
for (var i = 1; i <= 6; i++) {
  var idx = char.conditions.indexOf("exhaustion_" + i);
  if (idx !== -1) char.conditions.splice(idx, 1);
}
// Ставим новый уровень
if (next > 0) char.conditions.push("exhaustion_" + next);
updateExhaustionDisplay();
updateConditionsCount();
updateStatusBar();
loadConditions();
saveToLocal();
}
function updateExhaustionDisplay() {
var char = getCurrentChar();
var lvl = char ? getExhaustionLevel(char) : 0;
var levelEl = $("exhaustion-level");
var descEl = $("exhaustion-desc");
if (levelEl) {
  levelEl.textContent = lvl;
  levelEl.className = "exhaustion-level" + (lvl > 0 ? " active" : "") + (lvl >= 5 ? " critical" : "");
}
if (descEl) {
  if (lvl === 0) descEl.textContent = "";
  else {
    var exhCond = CONDITIONS.find(function(c) { return c.id === "exhaustion_" + lvl; });
    descEl.textContent = exhCond ? exhCond.desc.replace(/\n/g, " · ").replace(/• /g, "") : "";
  }
}
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
  // Пропускаем истощение — оно отображается отдельным блоком
  if (condition.id.indexOf("exhaustion_") !== -1) return;
  const conditionEl = $("condition-" + condition.id);
  if (char.conditions.includes(condition.id)) {
    if (conditionEl) conditionEl.classList.add("active");
  } else {
    if (conditionEl) conditionEl.classList.remove("active");
  }
});
updateExhaustionDisplay();
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
// Счётчик состояний — кнопка в статус-баре
var totalConditions = (char.conditions ? char.conditions.length : 0) + (char.effects ? char.effects.length : 0);
var condBtn = $("status-conditions-btn");
var condCount = $("conditions-btn-count");
if (condBtn) {
  if (totalConditions > 0) {
    condBtn.classList.remove("hidden");
    if (condCount) condCount.textContent = totalConditions;
  } else {
    condBtn.classList.add("hidden");
  }
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
  const levelEl = $("char-level");
  const level = Math.max(1, parseInt(levelEl && levelEl.value, 10) || 1);
  const unlockLevel = (typeof SUBCLASS_LEVEL !== "undefined" && SUBCLASS_LEVEL[selectedClass]) || 3;

  subclassSelect.innerHTML = "";
  subclassSelect.classList.remove("subclass-locked");

  if (!selectedClass || !SUBCLASSES[selectedClass]) {
    subclassSelect.appendChild(new Option("Сначала выберите класс", ""));
    subclassSelect.disabled = true;
    return;
  }

  if (level < unlockLevel) {
    subclassSelect.appendChild(new Option("🔒 Откроется на " + unlockLevel + " уровне", ""));
    subclassSelect.disabled = true;
    subclassSelect.classList.add("subclass-locked");
    if (currentId) {
      var ch = getCurrentChar();
      if (ch && ch.subclass) {
        ch.subclass = "";
        saveToLocal();
      }
    }
    return;
  }

  subclassSelect.disabled = false;
  subclassSelect.appendChild(new Option("Выберите подкласс", ""));
  SUBCLASSES[selectedClass].forEach(function(subclass) {
    subclassSelect.appendChild(new Option(subclass, subclass));
  });

  if (currentId) {
    var char = getCurrentChar();
    if (char && char.subclass && SUBCLASSES[selectedClass].indexOf(char.subclass) !== -1) {
      subclassSelect.value = char.subclass;
    }
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
// Синхронизируем char.classes[0] с UI (только если не мультикласс)
if (typeof migrateToMulticlass === "function") migrateToMulticlass(char);
if (!char.classes || char.classes.length === 0) {
  char.classes = [{class: char.class, level: char.level, subclass: char.subclass, hitDie: (typeof CLASS_HIT_DICE !== "undefined" ? CLASS_HIT_DICE[char.class] : 8) || 8}];
} else if (char.classes.length === 1) {
  // Одноклассовый — обновляем primary class из UI
  char.classes[0].class = char.class;
  char.classes[0].subclass = char.subclass;
  char.classes[0].level = char.level;
  char.classes[0].hitDie = (typeof CLASS_HIT_DICE !== "undefined" ? CLASS_HIT_DICE[char.class] : 8) || 8;
} else {
  // Мультикласс — обновляем только подкласс primary (класс и уровень управляются level-up UI)
  char.classes[0].class = char.class;
  char.classes[0].subclass = char.subclass;
  // Принудительная синхронизация level из суммы
  if (typeof syncClassFields === "function") syncClassFields(char);
}
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
var initBonus = dexMod;
if (char.class === "Бард" && level >= 2) initBonus += Math.floor(proficiencyBonus / 2);
const initEl = $("combat-init");
if (initEl) initEl.value = formatMod(initBonus);
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
var isJackOfAllTrades = (char.class === "Бард" && level >= 2);
var halfProf = Math.floor(proficiencyBonus / 2);
if (!char.expertiseSkills) char.expertiseSkills = [];
skills.forEach(function(skill, index) {
const checkbox = $("skill-prof-" + index);
const expBtn = $("skill-exp-" + index);
if(checkbox) {
let bonus = getMod(char.stats[skill.stat]);
var hasExpertise = char.expertiseSkills.indexOf(index) !== -1;
if(checkbox.checked) {
  if (hasExpertise) {
    bonus += proficiencyBonus * 2;
  } else {
    bonus += proficiencyBonus;
  }
} else {
  if (hasExpertise) {
    char.expertiseSkills.splice(char.expertiseSkills.indexOf(index), 1);
    hasExpertise = false;
  }
  if (isJackOfAllTrades) bonus += halfProf;
}
const bonusEl = $("skill-bonus-" + index);
if (bonusEl) bonusEl.innerText = formatMod(bonus);
char.skills[index] = checkbox.checked;
if (expBtn) {
  if (hasExpertise) { expBtn.classList.add("active"); } else { expBtn.classList.remove("active"); }
}
}
});
var wisMod = getMod(char.stats.wis);
var perceptionCheckbox = $("skill-prof-3");
var perceptionExpertise = char.expertiseSkills.indexOf(3) !== -1;
let passivePerception = 10 + wisMod;
if(perceptionCheckbox && perceptionCheckbox.checked) {
  passivePerception += perceptionExpertise ? proficiencyBonus * 2 : proficiencyBonus;
} else if (isJackOfAllTrades) {
  passivePerception += halfProf;
}
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
  if (typeof renderRaceExtras === "function") renderRaceExtras();
}

// ============================================
// РАСОВЫЕ ДОП. ВЫБОРЫ — Человек (черта), Полуэльф (+1+1)
// ============================================
var RACE_BONUS_FEATS = { "Человек": 1 };

function renderRaceExtras() {
  var panel = $("race-extras-panel");
  if (!panel) return;
  if (!currentId) { panel.style.display = "none"; return; }
  var char = getCurrentChar();
  if (!char) { panel.style.display = "none"; return; }
  // Расовые выборы открываются только после фиксации основы
  if (!char.basicLocked) { panel.style.display = "none"; panel.innerHTML = ""; return; }
  var race = char.race || ($("char-race") && $("char-race").value) || "";
  var html = "";

  // Человек: 1 расовая черта
  var featAllowance = RACE_BONUS_FEATS[race] || 0;
  if (featAllowance > 0) {
    if (!Array.isArray(char.raceFeats)) char.raceFeats = [];
    var taken = char.raceFeats.length;
    var remaining = featAllowance - taken;
    html += '<div class="race-extras-title">🎯 Расовая черта (' + escapeHtml(race) + ')</div>';
    var takenList = char.raceFeats.map(function(f, i) {
      return '<span class="race-bonus-badge">' + escapeHtml(f.name) +
        ' <span style="cursor:pointer;margin-left:4px;" onclick="removeRaceFeat(' + i + ')" title="Убрать">✕</span></span>';
    }).join("");
    html += '<div class="race-extras-row">' + takenList +
      (remaining > 0
        ? '<button class="race-extras-btn" onclick="openRaceFeatModal()">+ Выбрать черту</button>'
        : '<span class="race-extras-btn done">✅ Черта получена</span>') +
      '</div>';
  }

  // Полуэльф: +1 к двум характеристикам (кроме ХАР)
  if (race === "Полуэльф") {
    if (!Array.isArray(char.raceStatChoice)) char.raceStatChoice = [];
    var halfElfStats = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД"};
    var chosen = char.raceStatChoice;
    html += '<div class="race-extras-title">📊 Полуэльф: +1 к двум характеристикам (кроме ХАР)</div>';
    html += '<div class="race-extras-row">';
    Object.keys(halfElfStats).forEach(function(k) {
      var sel = chosen.indexOf(k) !== -1;
      html += '<span class="race-extras-stat-pick' + (sel ? " selected" : "") +
        '" onclick="toggleHalfElfStat(\'' + k + '\')">' + halfElfStats[k] + '</span>';
    });
    html += '<span style="margin-left:auto;color:rgba(255,255,255,0.55);font-size:0.85em;">' +
      'Выбрано: ' + chosen.length + '/2</span>';
    html += '</div>';
  }

  if (html) {
    panel.innerHTML = html;
    panel.style.display = "flex";
  } else {
    panel.style.display = "none";
    panel.innerHTML = "";
  }
}

function toggleHalfElfStat(key) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  if (!Array.isArray(char.raceStatChoice)) char.raceStatChoice = [];
  var idx = char.raceStatChoice.indexOf(key);
  if (idx !== -1) {
    char.raceStatChoice.splice(idx, 1);
    char.stats[key] = Math.max(1, (char.stats[key] || 10) - 1);
  } else {
    if (char.raceStatChoice.length >= 2) {
      showToast("Уже выбрано 2 характеристики. Снимите одну.", "warning");
      return;
    }
    char.raceStatChoice.push(key);
    char.stats[key] = Math.min(20, (char.stats[key] || 10) + 1);
  }
  safeSet("val-" + key, char.stats[key]);
  if (typeof updateStatDisplay === "function") updateStatDisplay(key);
  saveToLocal();
  calcStats();
  renderRaceExtras();
}

function openRaceFeatModal() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  if (typeof asiSelectedStats !== "undefined") asiSelectedStats = [];
  asiFeatSelected = null;
  asiCurrentLevel = "race";
  var modal = $("asi-modal");
  if (!modal) { showToast("Ошибка: модалка не найдена", "error"); return; }
  var featRadio = modal.querySelector('input[value="feat"]');
  if (featRadio) featRadio.checked = true;
  var title = modal.querySelector("h4");
  if (title) title.textContent = "🎯 Расовая черта · " + (char.race || "");
  if (typeof buildASIStatGrid === "function") buildASIStatGrid(char);
  if (typeof updateASIPreview === "function") updateASIPreview();
  modal.classList.add("active");
}

function removeRaceFeat(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !Array.isArray(char.raceFeats)) return;
  var rf = char.raceFeats[i];
  if (!rf) return;
  var name = rf.name;
  showConfirmModal("Убрать расовую черту?",
    "«" + name + "» будет убрана. Бонусы к характеристикам НЕ откатятся.",
    function() {
      char.raceFeats.splice(i, 1);
      if (Array.isArray(char.feats)) {
        char.feats = char.feats.filter(function(f) { return !(f.racial && f.name === name); });
      }
      saveToLocal();
      renderRaceExtras();
      if (typeof renderTakenFeats === "function") renderTakenFeats();
    }
  );
}

// ============================================
// МАСТЕР СОЗДАНИЯ ПЕРСОНАЖА — фиксация основы
// ============================================
var BASIC_FIELD_IDS = ["char-name", "char-class", "char-subclass", "char-race", "char-background", "char-level"];

function applyBasicLockUI() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var banner = $("creation-wizard-banner");
  var lockedBar = $("basic-locked-bar");
  var locked = !!char.basicLocked;

  BASIC_FIELD_IDS.forEach(function(id) {
    var el = $(id);
    if (!el) return;
    el.disabled = locked;
    var col = el.closest(".col") || el.closest(".sheet-small-field") || el.parentElement;
    if (col) col.classList.toggle("basic-field-locked", locked);
  });

  if (banner) banner.style.display = locked ? "none" : "flex";
  if (lockedBar) lockedBar.style.display = locked ? "flex" : "none";

  if (!locked) updateLockButtonState();
}

function updateLockButtonState() {
  var btn = $("cw-lock-btn");
  var msg = $("cw-validation");
  if (!btn) return;
  var name  = ($("char-name") && $("char-name").value || "").trim();
  var cls   = ($("char-class") && $("char-class").value || "").trim();
  var race  = ($("char-race") && $("char-race").value || "").trim();
  var bg    = ($("char-background") && $("char-background").value || "").trim();
  var levelVal = parseInt(($("char-level") && $("char-level").value), 10);

  var missing = [];
  if (!name) missing.push("имя");
  if (!cls)  missing.push("класс");
  if (!race) missing.push("раса");
  if (!bg)   missing.push("предыстория");
  if (!(levelVal >= 1 && levelVal <= 20)) missing.push("уровень");

  // Подкласс обязателен только если уже открыт по уровню
  if (cls && typeof SUBCLASS_LEVEL !== "undefined") {
    var unlock = SUBCLASS_LEVEL[cls] || 3;
    if (levelVal >= unlock) {
      var sub = ($("char-subclass") && $("char-subclass").value || "").trim();
      if (!sub) missing.push("подкласс");
    }
  }

  btn.disabled = missing.length > 0;
  if (msg) msg.textContent = missing.length > 0 ? "⚠ Не заполнено: " + missing.join(", ") : "";
}

function lockBasicInfo() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  updateLockButtonState();
  var btn = $("cw-lock-btn");
  if (btn && btn.disabled) return;
  char.basicLocked = true;
  saveToLocal();
  applyBasicLockUI();
  renderRaceExtras();
  showToast("🔒 Основа персонажа зафиксирована. Теперь можно настраивать детали.", "success");
}

function unlockBasicInfo() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  showConfirmModal(
    "Разблокировать основу?",
    "Имя, класс, подкласс, раса, предыстория и уровень снова станут редактируемыми. Делайте это только если действительно нужно изменить базовую информацию.",
    function() {
      char.basicLocked = false;
      saveToLocal();
      applyBasicLockUI();
      renderRaceExtras();
      showToast("🔓 Основа разблокирована", "info");
    }
  );
}

// ============================================
// ПРЕДЫСТОРИЯ: авто-навыки
// ============================================
function onBackgroundChange() {
  if (!currentId) return;
  var char = getCurrentChar();
  var bgEl = $("char-background");
  if (!bgEl || !char) return;
  var bg = bgEl.value;
  var bgData = (typeof BACKGROUND_SKILLS !== "undefined") && BACKGROUND_SKILLS[bg];
  if (!bgData) return;
  // Support both old format (array) and new format (object)
  var skillList = Array.isArray(bgData) ? bgData : (bgData.skills || []);
  skillList.forEach(function(skillName) {
    var idx = skills.findIndex(function(s) { return s.name === skillName; });
    if (idx !== -1) {
      var cb = $("skill-prof-" + idx);
      if (cb && !cb.checked) { cb.checked = true; }
    }
  });
  // Инструменты и языки от предыстории
  if (!Array.isArray(bgData) && bgData.tools && bgData.tools.length > 0) {
    var toolsEl = $("tool-proficiencies");
    if (toolsEl) {
      var existing = toolsEl.value.trim();
      var newTools = bgData.tools.join(", ");
      if (existing && existing.indexOf(newTools) === -1) {
        toolsEl.value = existing + ", " + newTools;
      } else if (!existing) {
        toolsEl.value = newTools;
      }
      if (char.proficiencies) char.proficiencies.tools = toolsEl.value;
    }
  }
  if (!Array.isArray(bgData) && bgData.languages > 0) {
    var langEl = $("languages");
    if (langEl) {
      var existing = langEl.value.trim();
      var langNote = bgData.languages + " доп. язык" + (bgData.languages > 1 ? "а" : "");
      if (existing && existing.indexOf(langNote) === -1) {
        langEl.value = existing ? existing + ", " + langNote : langNote;
      } else if (!existing) {
        langEl.value = langNote;
      }
      if (char.proficiencies) char.proficiencies.languages = langEl.value;
    }
  }
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

// ── Попап активных состояний ──
function toggleConditionsPopup() {
  var overlay = $("conditions-popup-overlay");
  var popup = $("conditions-popup");
  if (!overlay || !popup) return;
  if (popup.classList.contains("hidden")) {
    renderConditionsPopup();
    overlay.classList.remove("hidden");
    popup.classList.remove("hidden");
  } else {
    closeConditionsPopup();
  }
}
function closeConditionsPopup() {
  var overlay = $("conditions-popup-overlay");
  var popup = $("conditions-popup");
  if (overlay) overlay.classList.add("hidden");
  if (popup) popup.classList.add("hidden");
}
function renderConditionsPopup() {
  var list = $("conditions-popup-list");
  if (!list) return;
  list.innerHTML = "";
  var char = getCurrentChar();
  if (!char) return;
  var hasConditions = char.conditions && char.conditions.length > 0;
  var hasEffects = char.effects && char.effects.length > 0;
  if (!hasConditions && !hasEffects) {
    list.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:12px;">Нет активных состояний</div>';
    return;
  }
  // Собираем данные
  var baseConditions = [];
  var exhLevel = 0;
  if (hasConditions) {
    char.conditions.forEach(function(condId) {
      if (condId.indexOf("exhaustion_") !== -1) {
        var lvl = parseInt(condId.split("_")[1]);
        if (lvl > exhLevel) exhLevel = lvl;
      } else {
        var c = CONDITIONS.find(function(x) { return x.id === condId; });
        if (c) baseConditions.push(c);
      }
    });
  }
  var buffs = [], debuffs = [];
  if (hasEffects) {
    char.effects.forEach(function(effectId) {
      var e = EFFECTS_DATA.find(function(x) { return x.id === effectId; });
      if (e) { if (e.type === "buff") buffs.push(e); else debuffs.push(e); }
    });
  }
  // Группа: Состояния
  if (baseConditions.length > 0 || exhLevel > 0) {
    var group = document.createElement("div");
    group.className = "popup-group";
    group.innerHTML = '<div class="popup-group-label">⚠️ Состояния</div>';
    var badges = document.createElement("div");
    badges.className = "popup-group-badges";
    baseConditions.forEach(function(c) {
      var badge = document.createElement("span");
      badge.className = "condition-badge";
      badge.textContent = c.name;
      badges.appendChild(badge);
    });
    if (exhLevel > 0) {
      var exhBadge = document.createElement("span");
      exhBadge.className = "condition-badge exhaustion";
      exhBadge.textContent = "😫 Истощение " + exhLevel + (exhLevel >= 6 ? " — смерть" : "/6");
      badges.appendChild(exhBadge);
    }
    group.appendChild(badges);
    list.appendChild(group);
  }
  // Группа: Баффы
  if (buffs.length > 0) {
    var bGroup = document.createElement("div");
    bGroup.className = "popup-group";
    bGroup.innerHTML = '<div class="popup-group-label buff">✨ Баффы</div>';
    var bBadges = document.createElement("div");
    bBadges.className = "popup-group-badges";
    buffs.forEach(function(e) {
      var badge = document.createElement("span");
      badge.className = "condition-badge buff";
      badge.innerHTML = escapeHtml(e.name.split(' ').slice(1).join(' ') || e.name) + '<span class="badge-duration">' + escapeHtml(e.duration) + '</span>';
      bBadges.appendChild(badge);
    });
    bGroup.appendChild(bBadges);
    list.appendChild(bGroup);
  }
  // Группа: Дебаффы
  if (debuffs.length > 0) {
    var dGroup = document.createElement("div");
    dGroup.className = "popup-group";
    dGroup.innerHTML = '<div class="popup-group-label debuff">💀 Дебаффы</div>';
    var dBadges = document.createElement("div");
    dBadges.className = "popup-group-badges";
    debuffs.forEach(function(e) {
      var badge = document.createElement("span");
      badge.className = "condition-badge debuff";
      badge.innerHTML = escapeHtml(e.name.split(' ').slice(1).join(' ') || e.name) + '<span class="badge-duration">' + escapeHtml(e.duration) + '</span>';
      dBadges.appendChild(badge);
    });
    dGroup.appendChild(dBadges);
    list.appendChild(dGroup);
  }
}
