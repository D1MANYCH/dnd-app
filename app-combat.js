// ============================================================
// app-combat.js — Боевая система: характеристики, спасброски,
// навыки, КД, условия, эффекты, монеты
// ============================================================

// ============================================
// ПОПАП ВЫБОРА РЕЖИМА БРОСКА (Преимущество / Помеха)
// ============================================
// hint — rulesConditionRollMods(): помеха/автопровал/штраф от состояний и истощения (AUD-6)
function showRollModePopup(callback, hint) {
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
    '<button class="roll-mode-btn roll-mode-normal" data-mode="normal">' + dndIcoHtml("dice", 14) + ' Обычный</button>' +
    '<button class="roll-mode-btn roll-mode-adv" data-mode="adv">' + dndIcoHtml("arrowUp", 14) + ' Преимущество</button>' +
    '<button class="roll-mode-btn roll-mode-dis' + (hint && hint.dis.length ? ' roll-mode-suggested' : '') + '" data-mode="dis">' + dndIcoHtml("arrowDown", 14) + ' Помеха</button>';
  var note = rollHintText(hint);
  if (note) popup.insertAdjacentHTML("beforeend", '<div class="roll-mode-note">' + escapeHtml(note) + '</div>');
  popup.querySelectorAll(".roll-mode-btn").forEach(function(btn) {
    btn.onclick = function() {
      overlay.remove();
      callback(btn.getAttribute("data-mode"));
    };
  });
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

// Подпись подсказки: «Помеха: отравлен, истощение 3 · Автопровал: парализован · −4 истощение»
function rollHintText(hint) {
  if (!hint) return "";
  var char = getCurrentChar();
  var names = function(ids) { return ids.map(function(id) { return conditionShortName(char, id); }).join(", "); };
  var parts = [];
  if (hint.autoFail.length) parts.push("Автопровал: " + names(hint.autoFail));
  if (hint.dis.length) parts.push("Помеха: " + names(hint.dis));
  if (hint.penalty) parts.push(hint.penalty + " к броску: истощение");
  return parts.join(" · ");
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

// ── Бросок спасброска (UX-5: через quickRoll — реальный 3D + общая история) ──
function rollSavingThrow(saveKey) {
  var char = getCurrentChar();
  if (!char) return;
  var save = SAVES_DATA.find(function(s) { return s.key === saveKey; });
  if (!save) return;
  var hint = rulesConditionRollMods(char, "save", saveKey);
  showRollModePopup(function(mode) {
    var statMod = getMod(char.stats[saveKey]);
    var profBonus = getProficiencyBonus(parseInt($("char-level")?.value, 10) || 1);
    var checkbox = $("save-prof-" + saveKey);
    var bonus = statMod + (checkbox && checkbox.checked ? profBonus : 0) + hint.penalty;
    quickRoll({ label: "Спас. " + save.name, sides: 20, mod: bonus, mode: mode });
  }, hint);
}

// ── Бросок проверки характеристики (UI6-4: клик по крупному модификатору карточки) ──
function rollAbilityCheck(abilKey) {
  var char = getCurrentChar();
  if (!char) return;
  var abil = abilities.find(function(a) { return a.key === abilKey; });
  if (!abil) return;
  var hint = rulesConditionRollMods(char, "check");
  showRollModePopup(function(mode) {
    // AUD-8 (L33): «Мастер на все руки» / «Выдающийся атлет» — к проверкам без владения
    var bonus = getMod(char.stats[abilKey]) + rulesUntrainedCheckBonus(char, char.level || 1, abilKey) + hint.penalty;
    quickRoll({ label: "Проверка " + abil.name, sides: 20, mod: bonus, mode: mode });
  }, hint);
}

// ── Бросок проверки навыка ──
function rollSkillCheck(skillIndex) {
  var char = getCurrentChar();
  if (!char) return;
  var skill = skills[skillIndex];
  if (!skill) return;
  var hint = rulesConditionRollMods(char, "check");
  // AUD-8 (L34): доспех с помехой Скрытности — подсказка в окне режима броска
  if (skill && skill.name === "Скрытность" && rulesArmorStealthDisadv(char)) hint.dis.push("armor_stealth");
  showRollModePopup(function(mode) {
    var bonusEl = $("skill-bonus-" + skillIndex);
    var bonus = bonusEl ? parseInt(bonusEl.innerText, 10) : 0;
    if (isNaN(bonus)) bonus = 0;
    quickRoll({ label: skill.name, sides: 20, mod: bonus + hint.penalty, mode: mode });
  }, hint);
}

// ============================================
// УЛУЧШЕННЫЕ СПАСБРОСКИ
// ============================================
function initSaves() {
// UI6-4: строка спасброска живёт в карточке характеристики (layout 2024, слот
// #abil-save-slot-{key}) либо в legacy-сетке #saves-grid (classic). Рендерим в дом
// текущего layout через _statsRowTarget; id'шники сохранены, поэтому calcStats /
// loadCharacter / applyBuild находят чекбоксы по id независимо от размещения.
// .save-label-2024 виден только в режиме 2024 (компактная строка без шапки/описания).
SAVES_DATA.forEach(function(save) {
  const ex = document.getElementById("save-item-" + save.key);
  if (ex && ex.remove) ex.remove();
});
const legacyGrid = $("saves-grid");
if (legacyGrid) legacyGrid.innerHTML = "";
SAVES_DATA.forEach(function(save, index) {
const item = document.createElement("div");
item.className = "save-item";
item.id = "save-item-" + save.key;
item.innerHTML = `
<span class="save-label-2024">Спасбросок</span>
<div class="save-header">
<span class="save-icon">${getAbilityIcon(save.key) || escapeHtml(save.icon)}</span>
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
const target = (typeof _statsRowTarget === "function" ? _statsRowTarget("save", save.key) : null) || legacyGrid;
if (target) target.appendChild(item);
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

calcStats();
// Сброс выбора инструментов от старого класса (имя класса в ключе)
if (char.proficiencies && char.proficiencies.toolChoices) {
  Object.keys(char.proficiencies.toolChoices).forEach(function(k) {
    if (k.indexOf("class_") === 0) delete char.proficiencies.toolChoices[k];
  });
}
if (typeof renderLanguages === "function") renderLanguages();
if (typeof renderTools === "function") renderTools();
if (typeof renderArmorProf === "function") renderArmorProf();
if (typeof renderWeaponProf === "function") renderWeaponProf();
calculateAC();
}
function initSkills() {
// UI6-4: навык группируется по своей характеристике внутри карточки (layout 2024,
// слот #abil-skills-slot-{stat}) либо живёт в общем списке #skills-container (classic).
// id="skill-row-N" нужен _placeStatRows() для переноса узла при смене layout.
skills.forEach(function(skill, index) {
  const ex = document.getElementById("skill-row-" + index);
  if (ex && ex.remove) ex.remove();
});
const legacyContainer = $("skills-container");
if (legacyContainer) legacyContainer.innerHTML = "";
skills.forEach(function(skill, index) {
const row = document.createElement("div");
row.className = "skill-row-compact";
row.id = "skill-row-" + index;
row.innerHTML =
  '<input type="checkbox" id="skill-prof-' + index + '" class="skill-cb" onchange="calcStats(); updateSkillProfCount()">' +
  '<label for="skill-prof-' + index + '" class="skill-name-compact">' + escapeHtml(skill.name) + '</label>' +
  '<span class="skill-stat-compact">' + escapeHtml(skill.stat.toUpperCase().slice(0,3)) + '</span>' +
  '<button type="button" class="skill-expertise-btn" id="skill-exp-' + index + '" title="Компетентность (×2 бонус)" onclick="toggleExpertise(' + index + ')">E</button>' +
  '<button type="button" class="skill-bonus-compact skill-bonus-clickable" id="skill-bonus-' + index + '" onclick="rollSkillCheck(' + index + ')" title="Бросить проверку навыка">+0</button>';
const target = (typeof _statsRowTarget === "function" ? _statsRowTarget("skill", skill.stat) : null) || legacyContainer;
if (target) target.appendChild(row);
});
}
// STYLE-8a2: строка характеристики в реестре раскрывает свои навыки и отметку
// владения спасброском. Состояние только в DOM (класс is-open) — в схему
// персонажа не пишется, это вид, а не данные.
function toggleAbilOpen(key) {
var card = document.getElementById("stat-block-" + key);
if (!card) return;
var open = !card.classList.contains("is-open");
card.classList.toggle("is-open", open);
var head = card.querySelector(".abil-card-head");
if (head) head.setAttribute("aria-expanded", open ? "true" : "false");
}
// DISC-2: экран описания характеристики. Текст — ABILITY_INFO (PHB 2014,
// «Использование характеристик»), числа — у текущего персонажа; без персонажа
// экран всё равно открывается, просто без строки со значением.
function openAbilityInfo(key) {
  var info = (typeof ABILITY_INFO !== "undefined") ? ABILITY_INFO[key] : null;
  var abil = abilities.find(function(a) { return a.key === key; });
  if (!info || !abil) return;
  var char = getCurrentChar();
  var title = $("ai-title-h");
  if (title) title.textContent = abil.name;
  var own = skills.filter(function(s) { return s.stat === key; })
                  .map(function(s) { return s.name; });
  var html = '<p class="ai-lead">' + info.lead + "</p>";
  if (char) {
    var score = char.stats[key];
    var mod = getMod(score);
    html += '<p class="ai-mine">' + (char.name || "Персонаж") + " — " + score +
            " · модификатор " + (mod >= 0 ? "+" : "") + mod + "</p>";
  }
  html += '<div class="ai-block"><div class="ai-block-title">Проверки</div><p>' + info.checks + "</p>" +
          '<p class="ai-formula">Проверка — d20 + модификатор характеристики; при владении навыком прибавляется бонус мастерства, при компетентности — удвоенный.</p></div>';
  html += '<div class="ai-block"><div class="ai-block-title">Навыки</div><p>' +
          (own.length ? own.join(" · ") : "Навыков нет — эта характеристика пассивна.") + "</p></div>";
  html += '<div class="ai-block"><div class="ai-block-title">Спасбросок</div><p>' + info.save + "</p></div>";
  html += '<div class="ai-block"><div class="ai-block-title">За что ещё отвечает</div><p>' + info.uses + "</p></div>";
  var body = $("ai-body");
  if (body) body.innerHTML = html;
  showScreen("abilityinfo");
}

function toggleExpertise(index) {
if (sheetLockGuard()) return;
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
// LVL-2: экран «Развитие» перерисовывается тем же сигналом, что список умений
// на листе — эта функция идёт следом за повышением, откатом, АСИ и выборами.
if (typeof pgRefresh === "function") pgRefresh();
// LVL-3: список умений, кнопки АСИ и карточки классовых выборов уехали с листа
// на экран «Развитие» — здесь остались сводка раздела «Класс и развитие»,
// строки ресурсов (лист + вкладка «Бой») и невыбранное именем.
if (typeof renderClassDev === "function") renderClassDev();
renderClassResources();
}
// 🔧 ИСПРАВЛЕНИЕ: Защита от undefined в calculateAC()
function calculateAC() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const acRes = rulesAC(char);
const ac = acRes.ac;
const formulaParts = acRes.formula;
const modifiers = acRes.modifiers;

// ── Если выбрана конкретная броня из пресетов ─────────────────────────────
if (acRes.mode === "preset") {
    const acTotalEl = $("ac-total");
    const acFormulaEl = $("ac-formula");
    const combatAcEl = $("combat-ac");
    const acModsEl = $("ac-modifiers");
    if (acTotalEl) acTotalEl.textContent = ac;
    if (acFormulaEl) acFormulaEl.textContent = formulaParts.join(" ");
    if (combatAcEl) combatAcEl.value = ac;
    if (acModsEl) {
      acModsEl.innerHTML = modifiers.map(function(mod) {
        if (mod.type === "note") {
          return "<div class=\"ac-modifier-item note\"><span>" + escapeHtml(mod.name) + "</span><span class=\"ac-modifier-value\">" + dndIcoHtml("alert", 12) + "</span></div>";
        }
        return "<div class=\"ac-modifier-item" + (mod.type === "negative" ? " negative" : "") + "\"><span>" + escapeHtml(mod.name) + "</span><span class=\"ac-modifier-value\">" + (mod.value >= 0 ? "+" : "") + mod.value + "</span></div>";
      }).join("");
    }
    $("status-ac").textContent = ac;
    char.combat.ac = ac;
    if (typeof updateHPSummary === "function") updateHPSummary();
    return;
}

// ── Режим "вручную" — пользователь ввёл КД сам, не пересчитываем ──────────
if (acRes.mode === "manual") {
  var _ct = $("ac-total"); if (_ct) _ct.textContent = ac;
  var _cf = $("ac-formula"); if (_cf) _cf.textContent = formulaParts.join(" ");
  var _ci = $("combat-ac"); if (_ci) _ci.value = ac;
  var _cs = $("status-ac"); if (_cs) _cs.textContent = ac;
  if (typeof updateHPSummary === "function") updateHPSummary();
  return;
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
if (typeof updateHPSummary === "function") updateHPSummary();
char.combat.ac = ac;
}

function toggleInspiration() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
char.inspiration = !char.inspiration;
if (window.AppLog) AppLog.action("combat", char.inspiration ? "вдохновение получено" : "вдохновение использовано");
saveToLocal();
updateStatusBar();
showToast(char.inspiration ? "✨ Вдохновение получено!" : "✨ Вдохновение использовано", char.inspiration ? "success" : "info");
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
// Right-rail (десктоп) — синхронизация баджей состояний
if (typeof window.refreshConditionsRightRail === 'function') {
  window.refreshConditionsRightRail();
}
// Вдохновение
const inspiEl = $("status-inspiration");
if (inspiEl) inspiEl.classList.toggle("active", !!char.inspiration);
// UI6-4: зеркало вдохновения — мини-карточка в листе 2024
const inspCard2024 = $("insp-card-2024");
if (inspCard2024) inspCard2024.classList.toggle("active", !!char.inspiration);
// E24-1: в редакции 2024 «Вдохновение» → «Героическое вдохновение» + правило переброса к20.
updateInspirationLabels(char);
}
// E24-1: подписи/тултипы вдохновения зависят от редакции персонажа.
// 2024 — «Героическое вдохновение»: потратить = перебросить любой кубик (берётся новый результат).
// 2014 — «Вдохновение»: потратить = преимущество на один бросок к20.
function updateInspirationLabels(char) {
  var isE24 = !!(char && char.edition === "2024");
  var name = isE24 ? "Героическое вдохновение" : "Вдохновение";
  var tip = isE24
    ? "Героическое вдохновение — потратьте, чтобы перебросить любой кубик; берётся новый результат"
    : "Вдохновение — потратьте, чтобы получить преимущество на один бросок к20";
  var chip = $("status-inspiration");
  if (chip) chip.title = tip;
  var card = $("insp-card-2024");
  if (card) {
    card.title = tip + " — нажмите, чтобы переключить";
    var lbl = card.querySelector(".abil-mini-label");
    if (lbl) lbl.innerHTML = dndIcoHtml("sparkle", 14) + " " + escapeHtml(name);
  }
  var rr = document.getElementById("rr-insp-mini");
  if (rr) rr.title = name + " (клик — переключить)";
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
if (sheetLockGuard()) return;
const input = $("val-" + stat);
if (!input) return;
let value = parseInt(input.value, 10) || 10;
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
let value = parseInt(input.value, 10) || 0;
value += delta;
if (value < 0) value = 0;
input.value = value;
updateChar();
updateCoinTotal();
}
function updateCoinTotal() {
// Авто-конвертация всех монет в золото убрана намеренно: в игре монеты
// не разменять мгновенно (медь в глуши, требование платины и т.п.).
// Кошель показывает только курс обмена (статичная справка + модалка размена).
renderPouches();
}

// Coin rates in CP
var COIN_RATES = { cp: 1, sp: 10, ep: 50, gp: 100, pp: 1000 };
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
  var amt = parseInt($("exch-amount")?.value, 10) || 0;
  var preview = $("exch-preview");
  var availEl = $("exch-from-avail");
  if (!from || !to || !preview) return;
  // Show available
  var avail = parseInt($("coin-" + from)?.value, 10) || 0;
  if (availEl) availEl.textContent = avail;
  if (from === to) { preview.textContent = "Выберите разные монеты"; preview.className = "coin-exch-preview coin-exch-preview-warn"; return; }
  if (amt <= 0) { preview.textContent = "Введите количество"; preview.className = "coin-exch-preview"; return; }
  var ex = coinExchangeCalc(from, to, amt);
  if (avail < amt) {
    preview.textContent = "⚠️ Недостаточно " + COIN_NAMES[from] + " (есть " + avail + ")";
    preview.className = "coin-exch-preview coin-exch-preview-error";
  } else if (ex.result <= 0) {
    preview.textContent = "Меньше одной " + COIN_NAMES[to];
    preview.className = "coin-exch-preview coin-exch-preview-warn";
  } else if (ex.leftover > 0) {
    preview.textContent = amt + " " + COIN_NAMES[from] + " → " + ex.result + " " + COIN_NAMES[to] + " + " + ex.leftover + " " + COIN_NAMES[from] + " сдача";
    preview.className = "coin-exch-preview coin-exch-preview-warn";
  } else {
    preview.textContent = amt + " " + COIN_NAMES[from] + " → " + ex.result + " " + COIN_NAMES[to];
    preview.className = "coin-exch-preview coin-exch-preview-ok";
  }
}
// AUD-8 (L28): размен считается в медных — целыми, без плавающей точки
function coinExchangeCalc(from, to, amt) {
  var valueCp = amt * COIN_RATES[from];
  var result = Math.floor(valueCp / COIN_RATES[to]);
  return { result: result, leftover: Math.floor((valueCp - result * COIN_RATES[to]) / COIN_RATES[from]) };
}
function confirmExchange() {
  var from = $("exch-from")?.value;
  var to = $("exch-to")?.value;
  var amt = parseInt($("exch-amount")?.value, 10) || 0;
  if (!from || !to || from === to || amt <= 0) { showToast("Проверьте параметры обмена", "warn"); return; }
  var avail = parseInt($("coin-" + from)?.value, 10) || 0;
  if (avail < amt) { showToast("Недостаточно " + COIN_NAMES[from], "error"); return; }
  var ex = coinExchangeCalc(from, to, amt);
  var result = ex.result;
  if (result <= 0) { showToast("Нельзя обменять — результат 0", "warn"); return; }
  var leftoverAmt = ex.leftover;
  var fromEl = $("coin-" + from);
  var toEl = $("coin-" + to);
  fromEl.value = avail - amt + leftoverAmt;
  toEl.value = (parseInt(toEl.value, 10) || 0) + result;
  updateChar();
  updateCoinTotal();
  var msg = amt + " " + COIN_NAMES[from] + " → " + result + " " + COIN_NAMES[to];
  if (leftoverAmt > 0) msg += " (сдача: " + leftoverAmt + " " + COIN_NAMES[from] + ")";
  if (window.AppLog) AppLog.action("inventory", "обмен монет: " + msg);
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
  var _uch = currentId ? getCurrentChar() : null;
  var _ed = edData(_uch);  // E24-7: классовые таблицы по редакции персонажа
  const unlockLevel = _ed.SUBCLASS_LEVEL[selectedClass] || 3;

  subclassSelect.innerHTML = "";
  subclassSelect.classList.remove("subclass-locked");

  if (!selectedClass || !_ed.SUBCLASSES[selectedClass]) {
    subclassSelect.appendChild(new Option("Сначала выберите класс", ""));
    subclassSelect.disabled = true;
    updateSubclassRecHint();
    return;
  }

  if (level < unlockLevel) {
    // BUILD-FIX-8: подкласс сохраняется в char.subclass (баннер при level-up на 2/3 ур.).
    // Раньше этот блок очищал ch.subclass="" — из-за этого билды теряли подкласс на 1 ур.
    subclassSelect.appendChild(new Option("🔒 Откроется на " + unlockLevel + " уровне", ""));
    subclassSelect.disabled = true;
    subclassSelect.classList.add("subclass-locked");
    updateSubclassRecHint();
    return;
  }

  subclassSelect.disabled = false;
  subclassSelect.appendChild(new Option("Выберите подкласс", ""));
  _ed.SUBCLASSES[selectedClass].forEach(function(subclass) {
    // SUB-0: приписка источника в подписи опции (значение = чистое имя подкласса).
    var src = (typeof subclassSourceShort === "function") ? subclassSourceShort(subclass, _uch) : "";
    var opt = new Option(src ? subclass + " · " + src : subclass, subclass);
    var full = (typeof subclassSourceFull === "function") ? subclassSourceFull(subclass) : "";
    if (full) opt.title = full;
    subclassSelect.appendChild(opt);
  });

  if (currentId) {
    var char = getCurrentChar();
    if (char && char.subclass && _ed.SUBCLASSES[selectedClass].indexOf(char.subclass) !== -1) {
      subclassSelect.value = char.subclass;
    }
  }
  updateSubclassRecHint();
}

// BUILD-LVL-6: хинт рекомендованного подкласса билда у <select id=char-subclass>.
// Показывает «💡 совет билда: <подкласс>» (+ «✓ выбран», если уже выбран). Работает и при
// заблокированном дропдауне (подкласс ещё не открыт по уровню) — игрок видит цель заранее.
function updateSubclassRecHint() {
  var el = $("char-subclass-rec");
  if (!el) return;
  var char = currentId ? getCurrentChar() : null;
  var rec = (char && typeof getBuildRecSubclass === "function") ? getBuildRecSubclass(char) : null;
  if (!rec) { el.style.display = "none"; el.innerHTML = ""; return; }
  var sel = $("char-subclass");
  var cur = (sel && !sel.disabled && sel.value || "").trim();
  var matched = cur && cur === rec;
  var safe = (typeof escapeHtml === "function") ? escapeHtml(rec) : rec;
  el.innerHTML = '<span class="rec-badge">' + dndIcoHtml("bulb", 12) + ' совет билда</span> <span class="rec-text">' + safe + '</span>' +
    (matched ? ' <span class="subclass-rec-ok">✓ выбран</span>' : '');
  el.style.display = "";
}
// Бонусы максимума от черт («Крепкий» — +2 за уровень): сумма за один уровень
function featHpPerLevel(char) {
var sum = 0;
(char.feats || []).forEach(function(f) {
  var def = (typeof getFeatDef === "function") ? getFeatDef(char, f.id) : null;
  (def && def.effects || []).forEach(function(eff) { if (eff.type === "hp_per_level") sum += eff.value; });
});
return sum;
}
// AUD-4 (R3): resetManual — кнопка «Пересчитать» сбрасывает ручной максимум
function recalculateHP(resetManual) {
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
const level = parseInt(levelEl.value, 10) || 1;
const conMod = getMod(parseInt(conEl.value, 10) || 10);
const className = classEl.value;
if (resetManual === true) char.combat.hpMaxManual = null;
// AUD-4 (R2): одноклассовый — класс и уровень из формы, мультикласс — char.classes
var hpSrc = (char.classes && char.classes.length > 1) ? char : { classes: [{ class: className, level: level, subclass: char.subclass }], race: char.race, edition: char.edition, combat: char.combat };
// CAST-3: живые бонусы максимума от кастов («Подмога») — поверх авто-расчёта,
// иначе перезагрузка/переключение персонажа молча съедает бонус, а реверт
// при экспирации уводит hpMax НИЖЕ базы. Инвариант: hpMax = авто-база + бонусы.
var castHpBonus = 0;
(char.activeSpellEffects || []).forEach(function(i) { if (i.hpMaxBonus) castHpBonus += i.hpMaxBonus; });
// E24-5: бонусы черт к максимуму («Крепкий» — +2 за уровень) — тоже поверх авто-базы,
// иначе любой пересчёт (смена ТЕЛ, уровень, выдача черты происхождения) стирал их.
var featHpBonus = featHpPerLevel(char) * level;
var manualBase = parseInt(char.combat.hpMaxManual, 10);
var hpBase = manualBase > 0 ? manualBase : rulesMaxHPBase(hpSrc, conMod);
const newMaxHP = hpBase + castHpBonus + featHpBonus;
if (hpMaxEl) hpMaxEl.value = newMaxHP;
// Also update the visible manual field (only if not actively editing it)
const hpMaxManualEl = $("hp-max-manual");
if (hpMaxManualEl && document.activeElement !== hpMaxManualEl) hpMaxManualEl.value = newMaxHP;
var hdLabel = rulesHitDiceLabel(hpSrc);
rulesHitDiceSpentBy(hpSrc);
if (hpDiceEl) hpDiceEl.value = hdLabel;
if (hpDiceAvailableEl) hpDiceAvailableEl.value = (level - (char.combat.hpDiceSpent || 0)) + "/" + level;
char.combat.hpMax = newMaxHP;
char.combat.hpDice = hdLabel;
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
char.level = parseInt($("char-level")?.value, 10) || 1;
char.exp = parseInt($("char-exp")?.value, 10) || 0;
char.class = $("char-class")?.value || "";
// BUILD-FIX-8: при locked-дропдауне (level<unlockLevel) value="" — НЕ затираем сохранённый подкласс.
var _scEl = $("char-subclass");
if (_scEl && !_scEl.disabled) char.subclass = _scEl.value || "";
// Синхронизируем char.classes[0] с UI (только если не мультикласс)
if (typeof migrateToMulticlass === "function") migrateToMulticlass(char);
if (!char.classes || char.classes.length === 0) {
  char.classes = [{class: char.class, level: char.level, subclass: char.subclass, hitDie: edData(char).CLASS_HIT_DICE[char.class] || 8}];
} else if (char.classes.length === 1) {
  // Одноклассовый — обновляем primary class из UI
  char.classes[0].class = char.class;
  char.classes[0].subclass = char.subclass;
  char.classes[0].level = char.level;
  char.classes[0].hitDie = edData(char).CLASS_HIT_DICE[char.class] || 8;
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
char.deity = $("char-deity")?.value || "";
char.size = $("char-size")?.value || "Средний";
char.speed = $("char-speed")?.value || "30 фт";
char.combat.ac = parseInt($("combat-ac")?.value, 10) || 10;
char.combat.armorId   = $("char-armor")?.value || "none";
char.combat.hasShield = $("char-shield")?.checked || false;
char.combat.hpCurrent = parseInt($("hp-current")?.value, 10) || 0;
char.combat.hpTemp = Math.max(0, parseInt($("hp-temp")?.value, 10) || 0);
char.combat.speed = $("combat-speed")?.value || "30 фт";
// Языки и инструменты управляются через renderLanguages/renderTools — не переопределяем
char.coins.cp = parseInt($("coin-cp")?.value, 10) || 0;
char.coins.sp = parseInt($("coin-sp")?.value, 10) || 0;
char.coins.ep = parseInt($("coin-ep")?.value, 10) || 0;
char.coins.gp = parseInt($("coin-gp")?.value, 10) || 0;
char.coins.pp = parseInt($("coin-pp")?.value, 10) || 0;
calcCoinWeight();
// Заметки/особенности/внешность/магпредметы живут в notesV2.sections
// (управляются notesUpdateSection в app-notes.js) — здесь не дублируются.
const spellStatVal = $("spell-stat")?.value || "";
if (spellStatVal) char.spells.stat = spellStatVal;
for(let i=1; i<=9; i++) {
if(char.spells.slots[i] !== undefined) {
const slotInput = $("slots-" + i + "-total");
if(slotInput) char.spells.slots[i] = parseInt(slotInput.value, 10) || 0;
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
const level = parseInt($("char-level")?.value, 10) || 1;
const proficiencyBonus = getProficiencyBonus(level);
const profBonusEl = $("proficiency-bonus");
if (profBonusEl) profBonusEl.innerText = "+" + proficiencyBonus;
// UI6-4: зеркало бонуса мастерства — мини-карточка в листе 2024
const profBonusEl2024 = $("proficiency-bonus-2024");
if (profBonusEl2024) profBonusEl2024.innerText = "+" + proficiencyBonus;
const stats = ["str", "dex", "con", "int", "wis", "cha"];
stats.forEach(function(s) {
const val = parseInt($("val-" + s)?.value, 10) || 10;
char.stats[s] = val;
const mod = getMod(val);
const modEl = $("mod-" + s);
if (modEl) modEl.innerText = formatMod(mod);
});
var initBonus = getInitiativeMod(char, level);
const initEl = $("combat-init");
if (initEl) initEl.value = formatMod(initBonus);
SAVES_DATA.forEach(function(save) {
const checkbox = $("save-prof-" + save.key);
const item = $("save-item-" + save.key);
if(checkbox) {
let bonus = rulesSaveBonus(char, save.key, level, checkbox.checked);
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
if (!char.expertiseSkills) char.expertiseSkills = [];
skills.forEach(function(skill, index) {
const checkbox = $("skill-prof-" + index);
const expBtn = $("skill-exp-" + index);
if(checkbox) {
var hasExpertise = rulesHasExpertise(char, index);
if (!checkbox.checked && hasExpertise) {
  char.expertiseSkills.splice(char.expertiseSkills.indexOf(index), 1);
  hasExpertise = false;
}
let bonus = rulesSkillBonus(char, index, level, checkbox.checked);
const bonusEl = $("skill-bonus-" + index);
if (bonusEl) bonusEl.innerText = formatMod(bonus);
char.skills[index] = checkbox.checked;
if (expBtn) {
  if (hasExpertise) { expBtn.classList.add("active"); } else { expBtn.classList.remove("active"); }
}
}
});
var perceptionCheckbox = $("skill-prof-3");
let passivePerception = rulesPassivePerception(char, level, !!(perceptionCheckbox && perceptionCheckbox.checked));
const passiveEl = $("passive-perception");
if (passiveEl) passiveEl.innerText = passivePerception;
// UI6-4: зеркало пассивной внимательности — футер карточки МУД в листе 2024
const passiveEl2024 = $("passive-perception-2024");
if (passiveEl2024) passiveEl2024.innerText = passivePerception;
calcSpellStats();
// Обновляем updatedAt при любом изменении характеристик
const charForUpdate = getCurrentChar();
if (charForUpdate) { charForUpdate.updatedAt = Date.now(); }
saveToLocal();
}
function setSpellStat(stat) {
if (sheetLockGuard()) return;
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
const level = parseInt($("char-level")?.value, 10) || 1;
// BUILD-FIX-7: миграция старых en-lowercase значений в ru-uppercase.
// Покрывает сейвы, созданные до фикса applyBuild, плюс случайные несоответствия.
const _statMigrate = { "int":"ИНТ", "wis":"МУД", "cha":"ХАР" };
if (char.spells && _statMigrate[char.spells.stat]) {
char.spells.stat = _statMigrate[char.spells.stat];
const _sel = $("spell-stat"); if (_sel) _sel.value = char.spells.stat;
}
const stat = char.spells.stat || "";
const spellStats = rulesSpellStats(char, level);
const statMod = spellStats.mod;
const dc = spellStats.dc;
const attack = spellStats.attack;
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
// AUD-5 (R17): у мультикласса — СЛ и атака по каждому классу-заклинателю
var byClsEl = $("spell-stats-by-class");
if (byClsEl) {
  var byCls = (isMulticlass(char) && typeof rulesSpellStatsByClass === "function") ? rulesSpellStatsByClass(char, level) : [];
  byClsEl.style.display = byCls.length > 1 ? "" : "none";
  byClsEl.textContent = byCls.length > 1 ? byCls.map(function(r) { return r.cls + " (" + r.stat + "): СЛ " + r.dc + " · атака " + formatMod(r.attack); }).join("  ·  ") : "";
}
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
  var _rch = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  var _rtbl = (typeof edData === "function") ? edData(_rch).RACE_DATA : ((typeof RACE_DATA !== "undefined") ? RACE_DATA : {});
  var data = _rtbl[race];
  var is24 = !!(_rch && _rch.edition === "2024");
  var raceChanged = false;

  // === Применяем расовые бонусы к характеристикам ===
  // Делаем это только когда раса реально сменилась (или при миграции
  // старого персонажа без поля appliedRace). На обычной загрузке
  // appliedRace === race, поэтому бонусы не применяются повторно.
  if (currentId) {
    var charApply = getCurrentChar();
    if (charApply) {
      var appliedRace = charApply.appliedRace;
      if (appliedRace !== race) {
        raceChanged = true;
        // 1) Откатываем ранее применённые расовые бонусы
        var prev = charApply.appliedRaceBonus || {};
        Object.keys(prev).forEach(function(k) {
          charApply.stats[k] = Math.max(1, (charApply.stats[k] || 10) - prev[k]);
        });
        // 2) Если меняем расу с Полуэльфа — откатываем его +1/+1 выбор
        if (RACE_STAT_PICKS[appliedRace] && Array.isArray(charApply.raceStatChoice) && charApply.raceStatChoice.length) {
          charApply.raceStatChoice.forEach(function(k) {
            charApply.stats[k] = Math.max(1, (charApply.stats[k] || 10) - 1);
          });
          charApply.raceStatChoice = [];
        }
        // 3) Применяем бонусы новой расы
        var applied = {};
        if (data && data.stats) {
          Object.keys(data.stats).forEach(function(k) {
            var v = data.stats[k];
            charApply.stats[k] = Math.max(1, Math.min(30, (charApply.stats[k] || 10) + v));
            applied[k] = v;
          });
        }
        charApply.appliedRaceBonus = applied;
        charApply.appliedRace = race;
        // 4) Синхронизируем поля ввода и дисплеи модификаторов
        ["str","dex","con","int","wis","cha"].forEach(function(k) {
          safeSet("val-" + k, charApply.stats[k]);
          if (typeof updateStatDisplay === "function") updateStatDisplay(k);
        });
        if (typeof calcStats === "function") calcStats();
        if (typeof recalculateHP === "function") recalculateHP();
        if (typeof calculateAC === "function") calculateAC();
      }
    }
  }
  // === /применение расовых бонусов ===

  if (!data) { displayEl.style.display = "none"; return; }
  var eff = is24 ? _speciesEffective(_rch, data) : data;
  if (is24) {
    displayEl.innerHTML = _renderSpeciesBar(race, data, eff);
  } else {
  var statNames = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
  var bonuses = Object.keys(data.stats || {}).map(function(k) {
    var v = data.stats[k];
    return '<span class="race-bonus-badge">' + (v > 0 ? "+" : "") + v + " " + statNames[k] + '</span>';
  }).join("");
  var speedBadge = data.speed !== 30
    ? '<span class="race-bonus-badge race-speed">' + data.speed + ' фт</span>'
    : '<span class="race-bonus-badge race-speed">30 фт</span>';
  displayEl.innerHTML =
    '<span class="race-bonus-label">' + dndIcoHtml("zap", 12) + ' ' + escapeHtml(race) + ':</span>' + bonuses + speedBadge +
    '<span class="race-bonus-traits">' + escapeHtml(data.traits) + '</span>';
  }
  displayEl.style.display = "flex";

  // Обновляем ОБА поля скорости
  var speedVal = eff.speed + " фт";
  var charSpeedEl  = $("char-speed");
  var combatSpeedEl = $("combat-speed");
  if (charSpeedEl)   charSpeedEl.value  = speedVal;
  if (combatSpeedEl) combatSpeedEl.value = speedVal;

  if (currentId) {
    var char = getCurrentChar();
    if (char) {
      char.speed        = speedVal;
      char.combat.speed = speedVal;
      // E24-4: фиксированный размер вида (у аасимара/человека/тифлинга выбор — не трогаем)
      if (is24 && typeof data.size === "string") {
        char.size = data.size;
        safeSet("char-size", data.size);
      }
      if (raceChanged) {
        if (is24) char.speciesChoices = {};
        // Очистить расовый выбор языков и инструментов — раса сменилась
        if (char.proficiencies && char.proficiencies.languageChoices) {
          char.proficiencies.languageChoices.race = [];
        }
        if (char.proficiencies && char.proficiencies.toolChoices) {
          Object.keys(char.proficiencies.toolChoices).forEach(function(k) {
            if (k.indexOf("race_") === 0) delete char.proficiencies.toolChoices[k];
          });
        }
        // заклинания прежнего вида снимаем сразу, не дожидаясь фиксации основы
        if (is24) syncSpeciesSpells(char);
      }
      saveToLocal();
    }
  }
  if (typeof renderRaceExtras === "function") renderRaceExtras();
  if (typeof renderLanguages === "function") renderLanguages();
  if (typeof renderTools === "function") renderTools();
  if (typeof renderArmorProf === "function") renderArmorProf();
  if (typeof renderWeaponProf === "function") renderWeaponProf();
  if (typeof calculateAC === "function") calculateAC();
}

// ============================================
// E24-4: ВИДЫ 2024 — селект, панель, выборы, заклинания вида
// ============================================
var _raceSelect2014Html = null;

// Селект расы: для 2024-персонажа — 10 видов из edData(char).RACE_DATA, для 2014 —
// исходная разметка index.html (кэшируется при первом вызове).
function populateRaceSelect(char) {
  var sel = $("char-race");
  if (!sel) return;
  if (_raceSelect2014Html === null) _raceSelect2014Html = sel.innerHTML;
  var is24 = !!(char && char.edition === "2024" && typeof edData === "function");
  if (!is24) {
    if (sel.dataset.edition === "2024") { sel.innerHTML = _raceSelect2014Html; delete sel.dataset.edition; }
    return;
  }
  var tbl = edData(char).RACE_DATA || {};
  var html = '<option value="">Выберите вид</option>';
  Object.keys(tbl).forEach(function(name) {
    var d = tbl[name];
    var hint = [];
    if (Array.isArray(d.size)) hint.push(d.size.join("/"));
    else if (d.size && d.size !== "Средний") hint.push(d.size);
    if (d.speed && d.speed !== 30) hint.push(d.speed + " фт");
    html += '<option value="' + escapeHtml(name) + '">' + escapeHtml(name) + (hint.length ? " (" + escapeHtml(hint.join(", ")) + ")" : "") + '</option>';
  });
  sel.innerHTML = html;
  sel.dataset.edition = "2024";
}

// Скорость и тёмное зрение вида с учётом выбранной опции (лесной эльф 35 фт, дроу 120 фт).
function _speciesEffective(char, data) {
  var out = { speed: data.speed, darkvision: data.darkvision || 0 };
  var picks = (char && char.speciesChoices) || {};
  (data.choices || []).forEach(function(ch) {
    if (ch.type !== "single") return;
    var opt = (ch.options || []).find(function(o) { return o.id === picks[ch.id]; });
    if (!opt) return;
    if (opt.speed) out.speed = opt.speed;
    if (opt.darkvision) out.darkvision = opt.darkvision;
  });
  return out;
}

function _renderSpeciesBar(race, data, eff) {
  var sizeTxt = Array.isArray(data.size) ? data.size.join(" или ") : (data.size || "Средний");
  var badges = '<span class="race-bonus-badge">' + escapeHtml(sizeTxt) + '</span>' +
    '<span class="race-bonus-badge race-speed">' + eff.speed + ' фт</span>' +
    (eff.darkvision ? '<span class="race-bonus-badge race-speed">Тёмное зрение ' + eff.darkvision + ' фт</span>' : '');
  var traits = (data.traits || []).map(function(t) {
    return '<div class="race-trait-row"><span class="race-trait-name">' + escapeHtml(t.name) + '</span> — ' + escapeHtml(t.desc) + '</div>';
  }).join("");
  return '<span class="race-bonus-label">' + dndIcoHtml("zap", 12) + ' ' + escapeHtml(race) + ':</span>' + badges +
    '<div class="race-bonus-traits">' + traits + '</div>';
}

var SPECIES_STAT_SHORT = { int: "ИНТ", wis: "МУД", cha: "ХАР" };

function _speciesChoiceOptions(ch) {
  if (ch.type === "stat") {
    return (ch.keys || []).map(function(k) { return { id: k, name: SPECIES_STAT_SHORT[k] || k }; });
  }
  return ch.options || [];
}

function toggleSpeciesChoice(choiceId, optId) {
  if (!currentId) return;
  if (sheetLockGuard()) return;
  var char = getCurrentChar();
  if (!char) return;
  if (!char.speciesChoices) char.speciesChoices = {};
  char.speciesChoices[choiceId] = (char.speciesChoices[choiceId] === optId) ? "" : optId;
  saveToLocal();
  // onRaceChange пересчитает скорость/тёмное зрение и вызовет renderRaceExtras → syncSpeciesSpells
  onRaceChange();
}

// Заклинания вида (базовые + от выбранной опции) в гримуаре: добавляются копией записи
// PH24 с меткой grantedBy, снимаются при смене вида/опции, растут с уровнем (minLevel).
function syncSpeciesSpells(char) {
  if (!char || char.edition !== "2024" || typeof edData !== "function" || typeof SPELL_DATABASE === "undefined") return false;
  if (!char.spells) return false;
  if (!Array.isArray(char.spells.mySpells)) char.spells.mySpells = [];
  var data = edData(char).RACE_DATA[char.race];
  var want = [];
  if (data) {
    var picks = char.speciesChoices || {};
    var lists = [data.spells || []];
    (data.choices || []).forEach(function(ch) {
      var opt = (ch.options || []).find(function(o) { return o.id === picks[ch.id]; });
      if (opt && opt.spells) lists.push(opt.spells);
    });
    lists.forEach(function(arr) {
      arr.forEach(function(sp) {
        if ((sp.minLevel || 1) <= (char.level || 1)) want.push(sp.name);
      });
    });
  }
  var label = "Вид · " + (char.race || "");
  var changed = false;
  var before = char.spells.mySpells.length;
  char.spells.mySpells = char.spells.mySpells.filter(function(s) {
    return !s.grantedBy || (s.grantedBy === label && want.indexOf(s.name) !== -1);
  });
  if (char.spells.mySpells.length !== before) changed = true;
  want.forEach(function(name) {
    if (char.spells.mySpells.some(function(s) { return s.name === name; })) return;
    var src = SPELL_DATABASE.find(function(s) { return s.name === name && s.source === "PH24"; }) ||
              SPELL_DATABASE.find(function(s) { return s.name === name; });
    if (!src) return;
    var copy = Object.assign({}, src, { grantedBy: label });
    char.spells.mySpells.push(copy);
    changed = true;
  });
  if (changed) {
    if (typeof saveToLocal === "function") saveToLocal();
    if (typeof renderMySpells === "function") renderMySpells();
  }
  return changed;
}

// ============================================
// FEAT-2: генератор случайных имён по расе
// ============================================
function rollRandomName() {
  var nameEl = $("char-name");
  if (!nameEl) return;
  var raceEl = $("char-race");
  var race = (raceEl && raceEl.value) || "";
  var group = (typeof RACE_NAME_GROUP !== "undefined" && RACE_NAME_GROUP[race]) || "human";
  var pools = (typeof RACE_NAME_POOLS !== "undefined") && RACE_NAME_POOLS[group];
  if (!pools || !pools.first || !pools.first.length) return;
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function build() {
    var n = pick(pools.first);
    if (pools.last && pools.last.length) n += " " + pick(pools.last);
    return n;
  }
  var prev = nameEl.value.trim();
  var name = build();
  // Не повторять предыдущее имя при повторном клике (если пул позволяет)
  var guard = 0;
  while (name === prev && guard < 12) { name = build(); guard++; }
  nameEl.value = name;
  if (typeof updateChar === "function") updateChar();
  if (typeof updateLockButtonState === "function") updateLockButtonState();
  if (typeof showToast === "function") showToast("🎲 " + name, "success");
}

// ============================================
// РАСОВЫЕ ДОП. ВЫБОРЫ — Человек (вариант): черта и +1+1, Полуэльф (+1+1)
// ============================================
var RACE_BONUS_FEATS = { "Человек (вариант)": 1 };
var RACE_BONUS_FEATS_2024 = { "Человек": 1 };
var RACE_STAT_PICKS = {
  "Полуэльф": ["str","dex","con","int","wis"],
  "Человек (вариант)": ["str","dex","con","int","wis","cha"]
};

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

  // Человек (вариант), в 2024 — человек: 1 расовая черта
  var featAllowance = (char.edition === "2024" ? RACE_BONUS_FEATS_2024 : RACE_BONUS_FEATS)[race] || 0;
  if (featAllowance > 0) {
    if (!Array.isArray(char.raceFeats)) char.raceFeats = [];
    var taken = char.raceFeats.length;
    var remaining = featAllowance - taken;
    html += '<div class="race-extras-title">' + dndIcoHtml("target", 14) + ' Расовая черта (' + escapeHtml(race) + ')</div>';
    var takenList = char.raceFeats.map(function(f, i) {
      return '<span class="race-bonus-badge">' + escapeHtml(f.name) +
        ' <button type="button" class="race-bonus-x" onclick="removeRaceFeat(' + i + ')" title="Убрать" aria-label="Убрать">✕</button></span>';
    }).join("");
    html += '<div class="race-extras-row">' + takenList +
      (remaining > 0
        ? '<button class="race-extras-btn" onclick="openRaceFeatModal()">+ Выбрать черту</button>'
        : '<span class="race-extras-btn done">' + dndIcoHtml("check", 13) + ' Черта получена</span>') +
      '</div>';
  }

  // Полуэльф: +1 к двум характеристикам (кроме ХАР); Человек (вариант): +1 к двум любым
  if (RACE_STAT_PICKS[race] && char.edition !== "2024") {
    if (!Array.isArray(char.raceStatChoice)) char.raceStatChoice = [];
    var statLabels = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
    var chosen = char.raceStatChoice;
    html += '<div class="race-extras-title">' + dndIcoHtml("trend", 14) + ' ' + escapeHtml(race) + ': +1 к двум характеристикам' + (race === "Полуэльф" ? ' (кроме ХАР)' : '') + '</div>';
    html += '<div class="race-extras-row">';
    RACE_STAT_PICKS[race].forEach(function(k) {
      var sel = chosen.indexOf(k) !== -1;
      html += '<span class="race-extras-stat-pick' + (sel ? " selected" : "") +
        '" onclick="toggleHalfElfStat(\'' + k + '\')">' + statLabels[k] + '</span>';
    });
    html += '<span style="margin-left:auto;color:rgba(255,255,255,0.55);font-size:0.85em;">' +
      'Выбрано: ' + chosen.length + '/2</span>';
    html += '</div>';
  }

  // E24-4: видовые выборы 2024 (родословная, происхождение, характеристика заклинаний)
  if (char.edition === "2024" && typeof edData === "function") {
    var sp = edData(char).RACE_DATA[race];
    if (sp && Array.isArray(sp.choices)) {
      if (!char.speciesChoices) char.speciesChoices = {};
      sp.choices.forEach(function(ch) {
        var cur = char.speciesChoices[ch.id] || "";
        var opts = _speciesChoiceOptions(ch);
        html += '<div class="race-extras-title">' + dndIcoHtml("target", 14) + ' ' + escapeHtml(ch.name) + '</div>';
        html += '<div class="race-extras-row">';
        opts.forEach(function(o) {
          html += '<span class="race-extras-stat-pick' + (cur === o.id ? " selected" : "") +
            '" onclick="toggleSpeciesChoice(\'' + ch.id + '\',\'' + o.id + '\')">' + escapeHtml(o.name) + '</span>';
        });
        html += '</div>';
        var curOpt = opts.find(function(o) { return o.id === cur; });
        if (curOpt && curOpt.desc) html += '<div class="race-trait-row">' + escapeHtml(curOpt.desc) + '</div>';
      });
    }
    syncSpeciesSpells(char);
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
  if (title) title.innerHTML = dndIcoHtml("target", 16) + escapeHtml(" Расовая черта · " + (char.race || ""));
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
  applySheetLockUI();
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
  var _ed = edData(currentId ? getCurrentChar() : null);  // E24-7: классовые таблицы по редакции персонажа
  if (cls) {
    var unlock = _ed.SUBCLASS_LEVEL[cls] || 3;
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
  renderBackgroundExtras();
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
      renderBackgroundExtras();
      showToast("🔓 Основа разблокирована", "info");
    },
    "Разблокировать",
    { danger: false, icon: "lock" }
  );
}

// ============================================
// ЗАМОК ЛИСТА (ЗАМОК-1): всё, что меняется только при создании или повышении
// уровня, закрыто, пока char.sheetLocked. Настройка dnd_sheet_lock выключает
// механизм целиком; замок листа требует зафиксированной основы.
// ============================================
var SHEET_LOCK_FIELD_IDS = ["val-str", "val-dex", "val-con", "val-int", "val-wis", "val-cha", "hp-max-manual", "combat-speed", "char-size"];

function isSheetLocked(char) {
  if (typeof _getSheetLock === "function" && !_getSheetLock()) return false;
  if (!char) char = getCurrentChar();
  return !!(char && char.basicLocked && char.sheetLocked);
}

function sheetLockGuard() {
  if (!isSheetLocked()) return false;
  showToast("🔒 Лист зафиксирован — нажмите «Изменить», чтобы редактировать", "info");
  return true;
}

function applySheetLockUI() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var enabled = typeof _getSheetLock !== "function" || _getSheetLock();
  var locked = isSheetLocked(char);
  ["tab-sheet", "tab-spells", "tab-notes", "tab-inventory", "tab-battle", "weapon-modal"].forEach(function(id) {
    var tab = $(id);
    if (tab) tab.classList.toggle("sheet-locked", locked);
  });
  SHEET_LOCK_FIELD_IDS.forEach(function(id) {
    var el = $(id);
    if (el) el.disabled = locked;
  });
  document.querySelectorAll('input[id^="save-prof-"], input[id^="skill-prof-"]').forEach(function(cb) {
    cb.disabled = locked;
  });
  var text = $("basic-locked-text");
  if (text) text.textContent = locked ? "Лист зафиксирован" : "Основа персонажа зафиксирована";
  var readyBtn = $("sheet-lock-btn");
  var editBtn = $("sheet-unlock-btn");
  var basicBtn = $("basic-unlock-btn");
  if (readyBtn) readyBtn.style.display = (enabled && char.basicLocked && !locked) ? "" : "none";
  if (editBtn) editBtn.style.display = locked ? "" : "none";
  if (basicBtn) basicBtn.style.display = locked ? "none" : "";
}

function lockSheet() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !char.basicLocked) return;
  char.sheetLocked = true;
  saveToLocal();
  applySheetLockUI();
  showToast("🔒 Лист зафиксирован. Характеристики, владения, заклинания и черты откроются при повышении уровня или по кнопке «Изменить».", "success");
}

function unlockSheet() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  showConfirmModal(
    "Открыть лист для правок?",
    "Характеристики, спасброски, навыки, владения, максимум хитов, скорость и размер, заклинательная характеристика, удаление заклинаний и черт, правка предметов снова станут доступны. Когда закончите — нажмите «Персонаж готов».",
    function() {
      char.sheetLocked = false;
      saveToLocal();
      applySheetLockUI();
      showToast("🔓 Лист открыт для правок", "info");
    },
    "Открыть",
    { danger: false, icon: "lock" }
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
  // Сброс выбора языков от предыстории при смене
  if (char.proficiencies && char.proficiencies.languageChoices) {
    char.proficiencies.languageChoices.background = [];
  }
  // E24-5: смена предыстории 2024 откатывает распределённые от неё характеристики,
  // «своя» предыстория получает пустой черновик (характеристики/навыки/черта выбираются на панели)
  if (char.edition === "2024") {
    _bgRevertStatChoice(char);
    if (bg === CUSTOM_BACKGROUND_KEY && !char.bgCustom) char.bgCustom = { abilities: [], skills: [], featId: "", tool: "" };
  }
  var bgData = (typeof getBackgroundDef === "function") ? getBackgroundDef(char, bg)
    : ((typeof BACKGROUND_SKILLS !== "undefined") && BACKGROUND_SKILLS[bg]);
  if (!bgData) { if (typeof renderLanguages === "function") renderLanguages(); renderBackgroundFeature(); renderBackgroundExtras(); return; }
  // Support both old format (array) and new format (object)
  var skillList = Array.isArray(bgData) ? bgData : (bgData.skills || []);
  _bgCheckSkills(skillList);
  // Сброс выбора инструментов от предыстории при смене
  if (char.proficiencies && char.proficiencies.toolChoices) {
    Object.keys(char.proficiencies.toolChoices).forEach(function(k) {
      if (k.indexOf("bg_") === 0) delete char.proficiencies.toolChoices[k];
    });
  }
  // Инструменты/языки от предыстории — через categorized UI (recalc*FromSources)
  calcStats();
  updateSkillProfCount();
  if (typeof renderLanguages === "function") renderLanguages();
  if (typeof renderTools === "function") renderTools();
  if (typeof renderArmorProf === "function") renderArmorProf();
  if (typeof renderWeaponProf === "function") renderWeaponProf();
  renderBackgroundFeature();
  renderBackgroundExtras();
}

// Отметить навыки предыстории (чекбоксы листа). Общий для 2014/2024/«своей».
function _bgCheckSkills(skillList) {
  (skillList || []).forEach(function(skillName) {
    var idx = skills.findIndex(function(s) { return s.name === skillName; });
    if (idx !== -1) {
      var cb = $("skill-prof-" + idx);
      if (cb && !cb.checked) { cb.checked = true; }
    }
  });
}

// FIN-4: панель «умение предыстории» под селектом (образец — race-bonus-display).
// Читает BACKGROUND_SKILLS[bg].feature; вызывается из onBackgroundChange и loadCharacter.
function renderBackgroundFeature() {
  var el = $("background-feature-display");
  if (!el) return;
  var bgEl = $("char-background");
  var bg = bgEl ? bgEl.value : "";
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  var data = (typeof getBackgroundDef === "function") ? getBackgroundDef(char, bg)
    : ((typeof BACKGROUND_SKILLS !== "undefined") && BACKGROUND_SKILLS[bg]);
  // E24-5: у предыстории 2024 нет умения — строка показывает характеристики, черту и снаряжение
  if (char && char.edition === "2024") {
    if (!data) { el.style.display = "none"; el.innerHTML = ""; return; }
    var parts = [];
    if (data.custom) parts.push("своя: 3 характеристики, 2 навыка и черта происхождения на выбор");
    else {
      parts.push((data.abilities || []).map(_bgStatShort).join(" · "));
      var fdef = (typeof getFeatDef === "function") ? getFeatDef(char, data.featId) : null;
      if (fdef) parts.push("черта: " + fdef.name + (data.featOpt ? " (" + data.featOpt + ")" : ""));
      if (data.desc) parts.push(data.desc);
    }
    el.innerHTML =
      '<span class="bg-feature-label">' + dndIcoHtml("scroll", 13) + ' ' + escapeHtml(bg) + '</span>' +
      '<span class="bg-feature-text">' + escapeHtml(parts.join(" · ")) + '</span>';
    el.style.display = "flex";
    return;
  }
  var feat = data && data.feature;
  if (!feat || !feat.name) { el.style.display = "none"; el.innerHTML = ""; return; }
  el.innerHTML =
    '<span class="bg-feature-label">' + dndIcoHtml("scroll", 13) + ' ' + escapeHtml(feat.name) + '</span>' +
    '<span class="bg-feature-text">' + escapeHtml(feat.desc || "") + '</span>';
  el.style.display = "flex";
}

// ============================================
// E24-5: ПРЕДЫСТОРИИ 2024 — селект, характеристики, черта происхождения,
// стартовое снаряжение, «своя» предыстория
// ============================================
var _bgSelect2014Html = null;
var _BG_STAT_SHORT = { str:"СИЛ", dex:"ЛОВ", con:"ТЕЛ", int:"ИНТ", wis:"МУД", cha:"ХАР" };
function _bgStatShort(k) { return _BG_STAT_SHORT[k] || k; }

// Селект предыстории: 2024 — 16 предысторий edData + «Своя»; 2014 — исходная разметка.
function populateBackgroundSelect(char) {
  var sel = $("char-background");
  if (!sel) return;
  if (_bgSelect2014Html === null) _bgSelect2014Html = sel.innerHTML;
  var is24 = !!(char && char.edition === "2024" && typeof edData === "function");
  if (!is24) {
    if (sel.dataset.edition === "2024") { sel.innerHTML = _bgSelect2014Html; delete sel.dataset.edition; }
    return;
  }
  var tbl = edData(char).BACKGROUND_SKILLS || {};
  var html = '<option value="">Выберите предысторию</option>';
  Object.keys(tbl).forEach(function(name) {
    var d = tbl[name];
    var hint = (d.abilities || []).map(_bgStatShort).join("/");
    html += '<option value="' + escapeHtml(name) + '">' + escapeHtml(name) + (hint ? " (" + hint + ")" : "") + '</option>';
  });
  html += '<option value="' + CUSTOM_BACKGROUND_KEY + '">Своя предыстория</option>';
  sel.innerHTML = html;
  sel.dataset.edition = "2024";
}

// Откат бонусов от предыстории из char.stats (смена предыстории, смена режима, снятие выбора).
function _bgRevertStatChoice(char) {
  if (!char.bgStatChoice || typeof char.bgStatChoice !== "object") char.bgStatChoice = { mode: "2+1", alloc: {} };
  var alloc = char.bgStatChoice.alloc || {};
  Object.keys(alloc).forEach(function(k) {
    char.stats[k] = Math.max(1, (char.stats[k] || 10) - alloc[k]);
    safeSet("val-" + k, char.stats[k]);
    if (typeof updateStatDisplay === "function") updateStatDisplay(k);
  });
  char.bgStatChoice.alloc = {};
}

function _bgApplyStat(char, k, v) {
  char.bgStatChoice.alloc[k] = v;
  char.stats[k] = Math.min(20, (char.stats[k] || 10) + v);
  safeSet("val-" + k, char.stats[k]);
  if (typeof updateStatDisplay === "function") updateStatDisplay(k);
}

// Переключение режима +2/+1 ↔ +1+1+1. В режиме 1+1+1 все три характеристики
// получают +1 сразу — выбирать нечего.
function setBgStatMode(mode) {
  if (!currentId || sheetLockGuard()) return;
  var char = getCurrentChar();
  var def = char && getBackgroundDef(char);
  if (!def) return;
  _bgRevertStatChoice(char);
  char.bgStatChoice.mode = mode;
  if (mode === "1+1+1" && (def.abilities || []).length === 3) def.abilities.forEach(function(k) { _bgApplyStat(char, k, 1); });
  _bgAfterStats(char);
}

// Клик по характеристике в режиме 2+1: пусто → +2 (если свободно) иначе +1; занято → снять.
function toggleBgStat(k) {
  if (!currentId || sheetLockGuard()) return;
  var char = getCurrentChar();
  var def = char && getBackgroundDef(char);
  if (!def || (def.abilities || []).indexOf(k) === -1) return;
  if (!char.bgStatChoice || typeof char.bgStatChoice !== "object") char.bgStatChoice = { mode: "2+1", alloc: {} };
  if (char.bgStatChoice.mode !== "2+1") return;
  var alloc = char.bgStatChoice.alloc;
  if (alloc[k]) {
    char.stats[k] = Math.max(1, (char.stats[k] || 10) - alloc[k]);
    safeSet("val-" + k, char.stats[k]);
    if (typeof updateStatDisplay === "function") updateStatDisplay(k);
    delete alloc[k];
  } else {
    var has2 = Object.keys(alloc).some(function(x) { return alloc[x] === 2; });
    var has1 = Object.keys(alloc).some(function(x) { return alloc[x] === 1; });
    if (has2 && has1) { showToast("Уже распределено +2 и +1. Снимите одно.", "warning"); return; }
    _bgApplyStat(char, k, has2 ? 1 : 2);
  }
  _bgAfterStats(char);
}

function _bgAfterStats(char) {
  saveToLocal();
  calcStats();
  if (typeof recalculateHP === "function") recalculateHP();
  if (typeof calculateAC === "function") calculateAC();
  renderBackgroundExtras();
}

// Откат эффектов черты происхождения при её замене (origin-черты 2024:
// Бдительный — БМ к инициативе, Крепкий — +2 ХП/уровень; остальные пассивны).
function _bgRevertFeatEffects(char, def) {
  (def && def.effects || []).forEach(function(eff) {
    if (eff.type === "hp_per_level") {
      var bonus = eff.value * (char.level || 1);
      char.combat.hpMax = Math.max(1, (char.combat.hpMax || 10) - bonus);
      char.combat.hpCurrent = Math.min(char.combat.hpCurrent, char.combat.hpMax);
    } else if (eff.type === "initiative_prof") {
      if (char.bonuses) char.bonuses.initiativeProf = false;
    } else if (eff.type === "initiative_bonus") {
      if (char.bonuses) char.bonuses.initiative = (char.bonuses.initiative || 0) - eff.value;
    } else if (eff.type === "armor" || eff.type === "weapon") {
      var list = char.proficiencies && char.proficiencies[eff.type];
      if (Array.isArray(list)) { var i = list.indexOf(eff.value); if (i !== -1) list.splice(i, 1); }
    }
  });
}

// Черта происхождения выдаётся автоматически после фиксации основы и следует за
// предысторией: смена предыстории (или выбор черты у «своей») заменяет её.
// Запись в char.feats помечена origin:true — removeFeat её не трогает.
function syncOriginFeat(char) {
  if (!char || char.edition !== "2024" || !char.basicLocked) return;
  if (!Array.isArray(char.feats)) char.feats = [];
  var def = getBackgroundDef(char);
  var wantId = def ? (def.featId || "") : "";
  var wantOpt = def ? (def.featOpt || "") : "";
  var idx = -1;
  for (var i = 0; i < char.feats.length; i++) if (char.feats[i].origin) { idx = i; break; }
  var cur = idx !== -1 ? char.feats[idx] : null;
  if (cur && cur.id === wantId && (cur.opt || "") === wantOpt) return;
  if (cur) {
    _bgRevertFeatEffects(char, (typeof getFeatDef === "function") ? getFeatDef(char, cur.id) : null);
    char.feats.splice(idx, 1);
  }
  if (wantId && typeof luApplyFeatById === "function") {
    var name = luApplyFeatById(char, wantId, "предыстория");
    if (name) {
      var rec = char.feats[char.feats.length - 1];
      rec.origin = true;
      if (wantOpt) { rec.opt = wantOpt; rec.name = name + " (" + wantOpt + ")"; }
    }
  }
  saveToLocal();
  if (typeof renderTakenFeats === "function") renderTakenFeats();
  if (typeof recalculateHP === "function") recalculateHP();
  if (typeof updateHPDisplay === "function") updateHPDisplay();
}

// «Своя» предыстория: 3 характеристики, 2 навыка, черта происхождения.
function toggleBgCustom(field, value) {
  if (!currentId || sheetLockGuard()) return;
  var char = getCurrentChar();
  if (!char || char.background !== CUSTOM_BACKGROUND_KEY) return;
  if (!char.bgCustom) char.bgCustom = { abilities: [], skills: [], featId: "", tool: "" };
  var c = char.bgCustom;
  if (field === "featId") {
    c.featId = (c.featId === value) ? "" : value;
  } else {
    var limit = field === "abilities" ? 3 : 2;
    if (!Array.isArray(c[field])) c[field] = [];
    var pos = c[field].indexOf(value);
    if (pos !== -1) {
      c[field].splice(pos, 1);
      if (field === "abilities") _bgRevertStatChoice(char);
      if (field === "skills") {
        var si = skills.findIndex(function(s) { return s.name === value; });
        var cb = si !== -1 && $("skill-prof-" + si);
        if (cb) cb.checked = false;
      }
    } else {
      if (c[field].length >= limit) { showToast("Уже выбрано " + limit + ". Снимите одно.", "warning"); return; }
      c[field].push(value);
      if (field === "skills") _bgCheckSkills([value]);
    }
    if (field === "abilities" && char.bgStatChoice && char.bgStatChoice.mode === "1+1+1") {
      _bgRevertStatChoice(char);
      if (c.abilities.length === 3) c.abilities.forEach(function(k) { _bgApplyStat(char, k, 1); });
    }
  }
  saveToLocal();
  calcStats();
  if (typeof updateSkillProfCount === "function") updateSkillProfCount();
  renderBackgroundExtras();
}

// Стартовое снаряжение предыстории: вариант А — предметы + монеты, Б — 50 зм. Один раз.
function giveBackgroundEquipment(variant) {
  if (!currentId || sheetLockGuard()) return;
  var char = getCurrentChar();
  var def = char && getBackgroundDef(char);
  if (!def || char.bgEquipGiven) return;
  var eq = def.equipment || {};
  if (!char.coins) char.coins = { cp:0, sp:0, ep:0, gp:0, pp:0 };
  if (!char.inventory) char.inventory = { weapon:[], armor:[], potion:[], scroll:[], tool:[], material:[], other:[] };
  var given = [];
  if (variant === "a") {
    (eq.a || []).forEach(function(it) {
      var w = (typeof WEAPON_PRESETS !== "undefined") && WEAPON_PRESETS.find(function(x) { return x.name === it.name; });
      if (w) {
        char.inventory.weapon.push({ name: w.name, qty: it.qty || 1, weight: 0, location: "belt",
          desc: (w.damage ? w.damage + " " + w.type + ". " : "") + (w.notes || "") });
      } else {
        var g = (typeof window !== "undefined" && Array.isArray(window.GEAR_CATALOG))
          ? window.GEAR_CATALOG.find(function(x) { return x.name === it.name; }) : null;
        var cat = (g && char.inventory[g.cat]) ? g.cat : "other";
        char.inventory[cat].push({ name: it.name, qty: it.qty || 1, weight: g ? (g.weight || 0) : 0,
          slots: g ? g.slots : undefined, location: "backpack", desc: g ? (g.desc || "") : "" });
      }
      given.push(it.name + ((it.qty || 1) > 1 ? " ×" + it.qty : ""));
    });
    char.coins.gp = (char.coins.gp || 0) + (eq.aGold || 0);
    if (eq.aGold) given.push(eq.aGold + " зм");
  } else {
    char.coins.gp = (char.coins.gp || 0) + (eq.bGold || 50);
    given.push((eq.bGold || 50) + " зм");
  }
  char.bgEquipGiven = true;
  saveToLocal();
  if (typeof renderInventory === "function") renderInventory();
  if (typeof updateInventoryWeight === "function") updateInventoryWeight();
  safeSet("coin-gp", char.coins.gp);
  if (typeof calcCoinWeight === "function") calcCoinWeight();
  showToast("Снаряжение предыстории: " + given.join(", "), "success");
  renderBackgroundExtras();
}

// Панель предыстории 2024 под селектом: показывается после фиксации основы
// (как видовые выборы), правки — пока лист не зафиксирован.
function renderBackgroundExtras() {
  var panel = $("bg-extras-panel");
  if (!panel) return;
  var char = currentId ? getCurrentChar() : null;
  if (!char || char.edition !== "2024" || !char.basicLocked) { panel.style.display = "none"; panel.innerHTML = ""; return; }
  var def = getBackgroundDef(char);
  if (!def) { panel.style.display = "none"; panel.innerHTML = ""; return; }
  syncOriginFeat(char);
  if (!char.bgStatChoice || typeof char.bgStatChoice !== "object") char.bgStatChoice = { mode: "2+1", alloc: {} };
  var locked = isSheetLocked(char);
  var html = "";

  if (def.custom) {
    var c = char.bgCustom || { abilities: [], skills: [], featId: "" };
    html += '<div class="race-extras-title">' + dndIcoHtml("trend", 14) + ' Характеристики своей предыстории (3)</div><div class="race-extras-row">';
    Object.keys(_BG_STAT_SHORT).forEach(function(k) {
      html += '<span class="race-extras-stat-pick' + (c.abilities.indexOf(k) !== -1 ? " selected" : "") +
        '" onclick="toggleBgCustom(\'abilities\',\'' + k + '\')">' + _BG_STAT_SHORT[k] + '</span>';
    });
    html += '</div>';
    html += '<div class="race-extras-title">' + dndIcoHtml("check", 14) + ' Навыки (2)</div><div class="race-extras-row">';
    skills.forEach(function(sk) {
      html += '<span class="race-extras-stat-pick' + (c.skills.indexOf(sk.name) !== -1 ? " selected" : "") +
        '" onclick="toggleBgCustom(\'skills\',\'' + escapeHtml(sk.name) + '\')">' + escapeHtml(sk.name) + '</span>';
    });
    html += '</div>';
    html += '<div class="race-extras-title">' + dndIcoHtml("target", 14) + ' Черта происхождения</div><div class="race-extras-row">';
    (edData(char).FEATS_DATA || []).filter(function(f) { return f.category === "origin"; }).forEach(function(f) {
      html += '<span class="race-extras-stat-pick' + (c.featId === f.id ? " selected" : "") +
        '" onclick="toggleBgCustom(\'featId\',\'' + f.id + '\')">' + escapeHtml(f.name) + '</span>';
    });
    html += '</div>';
  }

  var abilities = def.abilities || [];
  if (abilities.length === 3) {
    var mode = char.bgStatChoice.mode;
    var alloc = char.bgStatChoice.alloc || {};
    var v = (typeof validateBgStatChoice === "function") ? validateBgStatChoice(def, char.bgStatChoice) : { complete: true };
    html += '<div class="race-extras-title">' + dndIcoHtml("trend", 14) + ' Характеристики от предыстории</div>';
    html += '<div class="race-extras-row">' +
      '<span class="race-extras-stat-pick' + (mode === "2+1" ? " selected" : "") + '" onclick="setBgStatMode(\'2+1\')">+2 / +1</span>' +
      '<span class="race-extras-stat-pick' + (mode === "1+1+1" ? " selected" : "") + '" onclick="setBgStatMode(\'1+1+1\')">+1 / +1 / +1</span>' +
      '</div>';
    html += '<div class="race-extras-row">';
    abilities.forEach(function(k) {
      html += '<span class="race-extras-stat-pick' + (alloc[k] ? " selected" : "") +
        '" onclick="toggleBgStat(\'' + k + '\')">' + _bgStatShort(k) + (alloc[k] ? " +" + alloc[k] : "") + '</span>';
    });
    html += '<span style="margin-left:auto;color:rgba(255,255,255,0.55);font-size:0.85em;">' +
      (v.complete ? dndIcoHtml("check", 13) + " распределено" : "не распределено") + '</span></div>';
  }

  var of = (char.feats || []).find(function(f) { return f.origin; });
  html += '<div class="race-extras-title">' + dndIcoHtml("target", 14) + ' Черта происхождения</div><div class="race-extras-row">' +
    (of ? '<span class="race-extras-btn done">' + dndIcoHtml("check", 13) + ' ' + escapeHtml(of.name) + '</span>'
        : '<span style="color:rgba(255,255,255,0.55);font-size:0.85em;">не выбрана</span>') + '</div>';

  if (def.equipment && !def.custom) {
    var eq = def.equipment;
    html += '<div class="race-extras-title">' + dndIcoHtml("box", 14) + ' Стартовое снаряжение</div><div class="race-extras-row">';
    if (char.bgEquipGiven) {
      html += '<span class="race-extras-btn done">' + dndIcoHtml("check", 13) + ' Снаряжение выдано</span>';
    } else if (!locked) {
      var listA = (eq.a || []).map(function(it) { return it.name + ((it.qty || 1) > 1 ? " ×" + it.qty : ""); }).join(", ");
      html += '<button class="race-extras-btn" onclick="giveBackgroundEquipment(\'a\')" title="' + escapeHtml(listA) + '">Вариант А: набор + ' + (eq.aGold || 0) + ' зм</button>' +
        '<button class="race-extras-btn" onclick="giveBackgroundEquipment(\'b\')">Вариант Б: ' + (eq.bGold || 50) + ' зм</button>';
    }
    html += '</div>';
  }

  panel.innerHTML = html;
  panel.style.display = html ? "flex" : "none";
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
  if (armorId === "custom") { saveToLocal(); return; } // manual mode - don't recalc
  // FIN-3: единый расчёт КД + бейджи помех делает calculateAC (не дублируем формулу).
  calculateAC();
  var preset = (typeof ARMOR_PRESETS !== "undefined") && ARMOR_PRESETS.find(function(a) { return a.id === armorId; });
  if (preset && typeof armorPenalties === "function" && typeof showToast === "function") {
    var pen = armorPenalties(char, preset);
    var warns = [];
    if (pen.slowed) warns.push("СИЛ < " + preset.strReq + " → скорость −10 фт");
    if (pen.stealthDisadv) warns.push("помеха на Скрытность");
    if (warns.length) showToast("⚠️ " + preset.name + ": " + warns.join(", "), "warn");
  }
  // AUD-8 (L34): щит занимает руку — двуручное оружие в руках с ним не держится (PHB стр.147)
  if (hasShield && typeof showToast === "function") {
    var inHand = ((char.inventory && char.inventory.weapon) || []).filter(function(it) { return it && it.location === "wielded"; }).map(function(it) { return it.name; });
    var twoH = (char.weapons || []).find(function(w) { return w && inHand.indexOf(w.name) !== -1 && String(w.notes || "").toLowerCase().indexOf("двуручн") !== -1; });
    if (twoH) showToast("⚠️ Щит и двуручное оружие (" + twoH.name + ") вместе не держатся — уберите одно из рук", "warn");
  }
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
  if (sheetLockGuard()) return;
  var char = getCurrentChar();
  if (!char) return;
  var val = parseInt($("hp-max-manual")?.value, 10) || 0;
  if (val < 1) return;
  // AUD-4 (R3): ручная база переживает загрузку; бонусы черт и кастов остаются поверх
  var castB = 0;
  (char.activeSpellEffects || []).forEach(function(i) { if (i.hpMaxBonus) castB += i.hpMaxBonus; });
  char.combat.hpMaxManual = Math.max(1, val - castB - featHpPerLevel(char) * (char.level || 1));
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
const cp = parseInt($("coin-cp")?.value, 10) || 0;
const sp = parseInt($("coin-sp")?.value, 10) || 0;
const ep = parseInt($("coin-ep")?.value, 10) || 0;
const gp = parseInt($("coin-gp")?.value, 10) || 0;
const pp = parseInt($("coin-pp")?.value, 10) || 0;
const totalCoins = cp + sp + ep + gp + pp;
const weight = (totalCoins / 50).toFixed(2);
const coinWeightEl = $("coin-weight");
if (coinWeightEl) coinWeightEl.innerText = "Вес монет: " + weight + " фнт";
updateInventoryWeight();
}

// ── Попап активных состояний ──
function getActiveConditionsForRender() {
  var out = { baseConditions: [], exhLevel: 0, buffs: [], debuffs: [] };
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char) return out;
  if (char.conditions && typeof CONDITIONS !== 'undefined') {
    // E24-1: резолвим состояния по редакции персонажа (фолбэк 2014).
    var _cs = (typeof edData === 'function') ? edData(char).CONDITIONS : CONDITIONS;
    char.conditions.forEach(function(condId) {
      if (condId.indexOf('exhaustion_') !== -1) {
        var lvl = parseInt(condId.split('_')[1], 10);
        if (lvl > out.exhLevel) out.exhLevel = lvl;
      } else {
        var c = _cs.find(function(x) { return x.id === condId; });
        if (c) out.baseConditions.push(c);
      }
    });
  }
  if (char.effects && typeof EFFECTS_DATA !== 'undefined') {
    char.effects.forEach(function(effectId) {
      var e = EFFECTS_DATA.find(function(x) { return x.id === effectId; });
      if (!e) return;
      if (e.type === 'buff') out.buffs.push(e);
      else out.debuffs.push(e);
    });
  }
  return out;
}
window.getActiveConditionsForRender = getActiveConditionsForRender;

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
  var data = getActiveConditionsForRender();
  var baseConditions = data.baseConditions;
  var exhLevel = data.exhLevel;
  var buffs = data.buffs;
  var debuffs = data.debuffs;
  if (!baseConditions.length && !exhLevel && !buffs.length && !debuffs.length) {
    list.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:12px;">Нет активных состояний</div>';
    return;
  }
  // Группа: Состояния
  if (baseConditions.length > 0 || exhLevel > 0) {
    var group = document.createElement("div");
    group.className = "popup-group";
    group.innerHTML = '<div class="popup-group-label">' + dndIcoHtml("alert", 13) + ' Состояния</div>';
    var badges = document.createElement("div");
    badges.className = "popup-group-badges";
    baseConditions.forEach(function(c) {
      var badge = document.createElement("span");
      badge.className = "condition-badge cond-chip on";
      if (DYMKA_CONDITION_META[c.id]) badge.style.setProperty("--sc", DYMKA_CONDITION_META[c.id].color);
      badge.innerHTML = getConditionChipIcon(c.id) + '<span>' + escapeHtml(stripLeadingEmoji(c.name)) + '</span>';
      badges.appendChild(badge);
    });
    if (exhLevel > 0) {
      var exhBadge = document.createElement("span");
      exhBadge.className = "condition-badge exhaustion cond-chip on";
      exhBadge.style.setProperty("--sc", "var(--danger)");
      exhBadge.innerHTML = getConditionChipIcon('exhaustion_' + exhLevel) + '<span>Истощение ' + exhLevel + (exhLevel >= 6 ? ' — смерть' : '/6') + '</span>';
      badges.appendChild(exhBadge);
    }
    group.appendChild(badges);
    list.appendChild(group);
  }
  // Группа: Баффы
  if (buffs.length > 0) {
    var bGroup = document.createElement("div");
    bGroup.className = "popup-group";
    bGroup.innerHTML = '<div class="popup-group-label buff">' + dndIcoHtml("sparkle", 13) + ' Баффы</div>';
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
    dGroup.innerHTML = '<div class="popup-group-label debuff">' + dndIcoHtml("skull", 13) + ' Дебаффы</div>';
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
