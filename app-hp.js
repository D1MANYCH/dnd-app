// ============================================================
// app-hp.js — Система ХП: отдых, level up, death saves,
// отображение и управление ХП, кости хитов
// ============================================================

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
if (list) list.innerHTML = "<li>Потратьте кости хитов для восстановления ХП</li><li>Восстанавливаются некоторые классовые умения</li><li>Заклинания НЕ восстанавливаются (кроме Колдуна)</li>";
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
char.combat.hpCurrent = Math.min((parseInt(char.combat.hpCurrent) || 0) + hpHealed, parseInt(char.combat.hpMax) || 0);
char.combat.hpDiceSpent = (char.combat.hpDiceSpent || 0) + hitDiceToSpend;
// FIX: Warlock recovers spell slots on short rest
var _isWarlock = (char.class === "Колдун") || (char.classes && char.classes.some(function(c){return c.class === "Колдун";}));
if (_isWarlock && char.spells && char.spells.slots) {
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
var warlockStr = _isWarlock ? "<p>🔮 Ячейки пакта восстановлены</p>" : "";
resultDetails = "<div class='rest-comparison'><div class='before'>ХП: " + oldHp + "</div><div class='arrow'>→</div><div class='after'>ХП: " + char.combat.hpCurrent + "</div></div><p>🎲 Потрачено костей: " + hitDiceToSpend + rollStr + "</p><p>❤️ Восстановлено ХП: " + hpHealed + "</p><p>📊 Доступно костей: " + (char.level - char.combat.hpDiceSpent) + "/" + char.level + "</p>" + warlockStr;
} else if (currentRestType === "long") {
const maxHp = parseInt(char.combat.hpMax) || 0;
char.combat.hpCurrent = maxHp;
for(let i=1; i<=9; i++) { if (char.spells.slots[i]) char.spells.slotsUsed[i] = 0; }
const hitDiceToRestore = Math.floor(char.level / 2);
char.combat.hpDiceSpent = Math.max(0, (char.combat.hpDiceSpent || 0) - hitDiceToRestore);
// PHB: длинный отдых снижает истощение на 1 уровень, остальные состояния не снимаются автоматически
var exhaustionReduced = false;
if (char.conditions && char.conditions.length > 0) {
  var exhLevels = ["exhaustion_6","exhaustion_5","exhaustion_4","exhaustion_3","exhaustion_2","exhaustion_1"];
  for (var ei = 0; ei < exhLevels.length; ei++) {
    var exhIdx = char.conditions.indexOf(exhLevels[ei]);
    if (exhIdx !== -1) {
      char.conditions.splice(exhIdx, 1);
      // Понижаем на 1 уровень (если было 3, ставим 2)
      var exhNum = parseInt(exhLevels[ei].split("_")[1]);
      if (exhNum > 1) {
        char.conditions.push("exhaustion_" + (exhNum - 1));
      }
      exhaustionReduced = true;
      break;
    }
  }
}
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
var exhaustionNote = exhaustionReduced ? "<p>😫 Истощение снижено на 1 уровень</p>" : "";
resultDetails = "<div class='rest-comparison'><div class='before'>ХП: " + oldHp + "</div><div class='arrow'>→</div><div class='after'>ХП: " + maxHp + "</div></div><p>✨ Ячейки заклинаний: восстановлены</p><p>🎲 Кости хитов: восстановлено " + hitDiceToRestore + "</p><p>📊 Доступно костей: " + (char.level - char.combat.hpDiceSpent) + "/" + char.level + "</p>" + exhaustionNote;
}
saveToLocal();
loadCharacter(currentId);
showRestResult(resultTitle, resultDetails);
}
// ── Мультикласс: переменная для выбранного класса при level-up ──
var _luMulticlassChoice = null; // {class, subclass, hitDie, isNew}

function openLevelUpModal() {
if (!currentId) { showToast("Сначала выберите персонажа!", "warn"); return; }
const char = getCurrentChar();
if (!char) return;
migrateToMulticlass(char);
const totalLevel = char.level || 1;
if (totalLevel >= 20) { showToast("Максимальный уровень достигнут!", "warn"); return; }

_luMulticlassChoice = null;
$("lu-screen-result").style.display = "none";

// Если персонаж уже мультиклассовый ИЛИ у него есть класс — показываем экран выбора
if (char.classes && char.classes.length > 0 && char.class) {
  _showMulticlassScreen(char);
} else {
  // Нет класса — прямо к стандартному preview
  _showLevelUpPreview(char, char.class, CLASS_HIT_DICE[char.class] || 8, false);
}

const modal = $("levelup-modal");
if (modal) modal.classList.add("active");
}

function _showMulticlassScreen(char) {
  var mcScreen = $("lu-screen-multiclass");
  $("lu-screen-preview").style.display = "none";
  mcScreen.style.display = "";

  // Отображаем текущие классы как кнопки
  var container = $("lu-mc-current-classes");
  container.innerHTML = "";
  char.classes.forEach(function(entry, idx) {
    var btn = document.createElement("button");
    btn.className = "lu-mc-class-btn";
    var maxClassLevel = 20 - (char.level - entry.level);
    btn.innerHTML = "<span class='lu-mc-class-name'>" + escapeHtml(entry.class) +
      (entry.subclass ? " (" + escapeHtml(entry.subclass) + ")" : "") +
      "</span><span class='lu-mc-class-level'>ур. " + entry.level +
      " → " + (entry.level + 1) + "</span>";
    if (entry.level >= 20) {
      btn.disabled = true;
      btn.title = "Максимальный уровень класса";
    }
    btn.onclick = function() {
      _luMulticlassChoice = { class: entry.class, subclass: entry.subclass, hitDie: entry.hitDie || CLASS_HIT_DICE[entry.class] || 8, isNew: false, classIndex: idx };
      _showLevelUpPreview(char, entry.class, entry.hitDie || CLASS_HIT_DICE[entry.class] || 8, false, entry);
    };
    container.appendChild(btn);
  });

  // Сброс блока нового класса
  $("lu-mc-new-class").style.display = "none";
  var sel = $("lu-mc-class-select");
  sel.innerHTML = '<option value="">—</option>';
  var allClasses = ["Варвар","Бард","Воин","Волшебник","Друид","Жрец","Колдун","Монах","Паладин","Плут","Следопыт","Чародей"];
  var existingClasses = char.classes.map(function(c) { return c.class; });
  allClasses.forEach(function(cls) {
    if (existingClasses.indexOf(cls) === -1) {
      var opt = document.createElement("option");
      opt.value = cls;
      opt.textContent = cls;
      sel.appendChild(opt);
    }
  });
}

function openMulticlassNewClass() {
  $("lu-mc-new-class").style.display = "";
  $("lu-mc-class-select").value = "";
  $("lu-mc-prereq-warn").style.display = "none";
  $("lu-mc-subclass-row").style.display = "none";
  $("lu-mc-confirm-new").disabled = true;
}

// Обработчик выбора нового класса в мультиклассе
document.addEventListener("DOMContentLoaded", function() {
  var sel = $("lu-mc-class-select");
  if (sel) sel.addEventListener("change", function() {
    var cls = this.value;
    var char = getCurrentChar();
    if (!char || !cls) {
      $("lu-mc-confirm-new").disabled = true;
      $("lu-mc-prereq-warn").style.display = "none";
      $("lu-mc-subclass-row").style.display = "none";
      return;
    }
    // Проверка пререквизитов
    var check = checkMulticlassPrereqs(char, cls);
    var warnEl = $("lu-mc-prereq-warn");
    if (!check.ok) {
      warnEl.style.display = "";
      warnEl.innerHTML = "⚠️ Не выполнены требования: " + check.missing.join(", ");
      $("lu-mc-confirm-new").disabled = true;
    } else {
      warnEl.style.display = "none";
      $("lu-mc-confirm-new").disabled = false;
    }
    // Подклассы (подкласс выбирается на 1 уровне только у некоторых классов: Жрец, Чародей, Колдун)
    var subRow = $("lu-mc-subclass-row");
    var subSel = $("lu-mc-subclass-select");
    var earlySubclassClasses = ["Жрец", "Чародей", "Колдун"];
    if (earlySubclassClasses.indexOf(cls) !== -1 && typeof SUBCLASSES !== "undefined" && SUBCLASSES[cls]) {
      subRow.style.display = "";
      subSel.innerHTML = '<option value="">—</option>';
      SUBCLASSES[cls].forEach(function(sc) {
        var o = document.createElement("option");
        o.value = sc; o.textContent = sc;
        subSel.appendChild(o);
      });
    } else {
      subRow.style.display = "none";
      subSel.innerHTML = '<option value="">—</option>';
    }
  });
});

function confirmMulticlassNewClass() {
  var cls = $("lu-mc-class-select").value;
  if (!cls) return;
  var char = getCurrentChar();
  if (!char) return;
  var subclass = $("lu-mc-subclass-select") ? $("lu-mc-subclass-select").value : "";
  var hitDie = CLASS_HIT_DICE[cls] || 8;
  _luMulticlassChoice = { class: cls, subclass: subclass, hitDie: hitDie, isNew: true };
  _showLevelUpPreview(char, cls, hitDie, true, null);
}

function _showLevelUpPreview(char, className, hitDie, isNewClass, classEntry) {
  $("lu-screen-multiclass").style.display = "none";
  $("lu-screen-preview").style.display = "";

  var totalLevel = char.level || 1;
  var newTotalLevel = totalLevel + 1;
  var classLevel = isNewClass ? 1 : (classEntry ? classEntry.level + 1 : totalLevel + 1);

  var conMod = getMod(char.stats.con);
  // HP gain for multiclass: hit die average + CON mod (not calculateMaxHP which assumes single class)
  var hpGain;
  if (isMulticlass(char) || isNewClass) {
    // Мультикласс: средний бросок кости хитов + мод.ТЕЛ
    hpGain = Math.floor(hitDie / 2) + 1 + conMod;
    if (hpGain < 1) hpGain = 1;
  } else {
    var currentMaxHP = calculateMaxHP(totalLevel, conMod, hitDie);
    var newMaxHP = calculateMaxHP(newTotalLevel, conMod, hitDie);
    hpGain = newMaxHP - currentMaxHP;
  }
  var currentHP = parseInt(char.combat.hpMax) || 0;
  var newHP = currentHP + hpGain;

  var profOld = getProficiencyBonus(totalLevel);
  var profNew = getProficiencyBonus(newTotalLevel);

  $("lu-from-level").textContent = totalLevel;
  $("lu-to-level").textContent = newTotalLevel;
  $("lu-hp-from").textContent = currentHP;
  $("lu-hp-to").textContent = newHP;
  $("lu-hp-gain").textContent = "+" + hpGain;
  $("lu-hit-die").textContent = "1к" + hitDie;
  $("lu-dice-count").textContent = newTotalLevel + " шт.";
  $("lu-prof-old").textContent = "+" + profOld;
  if (profNew !== profOld) {
    $("lu-prof-arrow").style.display = "inline";
    $("lu-prof-new").style.display = "inline";
    $("lu-prof-new").textContent = "+" + profNew;
  } else {
    $("lu-prof-arrow").style.display = "none";
    $("lu-prof-new").style.display = "none";
  }

  // Ячейки заклинаний
  var slotsCard = $("lu-slots-card");
  var slotsInfo = $("lu-slots-info");
  if (!isNewClass && !isMulticlass(char)) {
    // Одноклассовый — стандартная логика
    if (SPELL_SLOTS_BY_LEVEL[className] && SPELL_SLOTS_BY_LEVEL[className][newTotalLevel]) {
      var newSlots = SPELL_SLOTS_BY_LEVEL[className][newTotalLevel];
      var oldSlots = SPELL_SLOTS_BY_LEVEL[className][totalLevel] || [];
      var slotParts = [];
      for (var i = 1; i <= 9; i++) {
        var n = newSlots[i] || 0;
        var o = oldSlots[i] || 0;
        if (n > 0) slotParts.push((n > o ? "<b>+" + (n-o) + "</b> " : "") + i + "ур.: " + n);
      }
      if (slotParts.length > 0) {
        slotsCard.style.display = "";
        slotsInfo.innerHTML = slotParts.join("  •  ");
      } else { slotsCard.style.display = "none"; }
    } else { slotsCard.style.display = "none"; }
  } else {
    // Мультикласс — пересчитываем
    var tempClasses = char.classes.map(function(c) { return {class:c.class, level:c.level, subclass:c.subclass}; });
    if (isNewClass) {
      tempClasses.push({class: _luMulticlassChoice.class, level: 1, subclass: _luMulticlassChoice.subclass || ""});
    } else if (_luMulticlassChoice) {
      tempClasses = tempClasses.map(function(c, i) {
        if (i === _luMulticlassChoice.classIndex) return {class:c.class, level:c.level+1, subclass:c.subclass};
        return c;
      });
    }
    var tempChar = {classes: tempClasses, class: char.class, level: newTotalLevel};
    var newSlotsMC = getMulticlassSpellSlots(tempChar);
    var oldSlotsMC = getMulticlassSpellSlots(char);
    var slotPartsMC = [];
    for (var j = 1; j <= 9; j++) {
      var nv = newSlotsMC[j] || 0;
      var ov = oldSlotsMC[j] || 0;
      if (nv > 0) slotPartsMC.push((nv > ov ? "<b>+" + (nv-ov) + "</b> " : "") + j + "ур.: " + nv);
    }
    if (slotPartsMC.length > 0) {
      slotsCard.style.display = "";
      slotsInfo.innerHTML = slotPartsMC.join("  •  ");
    } else { slotsCard.style.display = "none"; }
  }

  // Фичи
  var featuresContainer = $("lu-features-container");
  featuresContainer.innerHTML = "";
  if (CLASS_FEATURES[className] && CLASS_FEATURES[className][classLevel]) {
    CLASS_FEATURES[className][classLevel].forEach(function(f) {
      var div = document.createElement("div");
      div.className = "lu-feature-item";
      div.innerHTML = "<div class=\"lu-feature-name\">" + escapeHtml(f.name) + "</div><div class=\"lu-feature-desc\">" + escapeHtml(f.desc) + "</div>";
      featuresContainer.appendChild(div);
    });
  }
  // Фичи подкласса
  var subName = isNewClass ? (_luMulticlassChoice ? _luMulticlassChoice.subclass : "") : (classEntry ? classEntry.subclass : char.subclass);
  if (subName && typeof SUBCLASS_FEATURES !== "undefined" && SUBCLASS_FEATURES[subName] && SUBCLASS_FEATURES[subName][classLevel]) {
    SUBCLASS_FEATURES[subName][classLevel].forEach(function(f) {
      var div = document.createElement("div");
      div.className = "lu-feature-item lu-feature-subclass";
      div.innerHTML = "<span class='subclass-badge'>" + escapeHtml(subName) + "</span><div class=\"lu-feature-name\">" + escapeHtml(f.name) + "</div><div class=\"lu-feature-desc\">" + escapeHtml(f.desc) + "</div>";
      featuresContainer.appendChild(div);
    });
  }

  // Если мультикласс-новый — показать какие владения получает
  if (isNewClass && typeof MULTICLASS_PROFICIENCIES !== "undefined" && MULTICLASS_PROFICIENCIES[className]) {
    var profs = MULTICLASS_PROFICIENCIES[className];
    var profParts = [];
    if (profs.armor && profs.armor.length) profParts.push("Броня: " + profs.armor.join(", "));
    if (profs.weapons && profs.weapons.length) profParts.push("Оружие: " + profs.weapons.join(", "));
    if (profs.skills) profParts.push("Навыки: " + profs.skills + " на выбор");
    if (profParts.length > 0) {
      var profDiv = document.createElement("div");
      profDiv.className = "lu-feature-item lu-feature-profs";
      profDiv.innerHTML = "<div class=\"lu-feature-name\">🛡️ Новые владения (мультикласс)</div><div class=\"lu-feature-desc\">" + escapeHtml(profParts.join(" · ")) + "</div>";
      featuresContainer.appendChild(profDiv);
    }
  }
}
function closeLevelUpModal() {
const modal = $("levelup-modal");
if (modal) modal.classList.remove("active");
}
function confirmLevelUp() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
migrateToMulticlass(char);
const oldLevel = char.level || 1;
if (oldLevel >= 20) { showToast("Максимальный уровень!", "info"); closeLevelUpModal(); return; }
const oldMaxHP = parseInt(char.combat.hpMax) || 0;
const oldProf = getProficiencyBonus(oldLevel);
const conMod = getMod(char.stats.con);

// Определяем какой класс повышаем
var choice = _luMulticlassChoice;
var className, hitDie, classLevel, isNewClass, subclassName;

if (choice && choice.isNew) {
  // Добавляем новый класс
  className = choice.class;
  hitDie = choice.hitDie;
  subclassName = choice.subclass || "";
  isNewClass = true;
  char.classes.push({ class: className, level: 1, subclass: subclassName, hitDie: hitDie });
  classLevel = 1;
  // Добавляем владения от мультикласса
  if (typeof MULTICLASS_PROFICIENCIES !== "undefined" && MULTICLASS_PROFICIENCIES[className]) {
    var profs = MULTICLASS_PROFICIENCIES[className];
    if (!char.proficiencies) char.proficiencies = { armor:[], weapon:[], tools:"", languages:"" };
    if (profs.armor) profs.armor.forEach(function(a) {
      var key = a.toLowerCase();
      if (char.proficiencies.armor.indexOf(key) === -1) char.proficiencies.armor.push(key);
    });
  }
} else if (choice && !choice.isNew && typeof choice.classIndex === "number") {
  // Повышаем существующий класс
  var entry = char.classes[choice.classIndex];
  className = entry.class;
  hitDie = entry.hitDie || CLASS_HIT_DICE[className] || 8;
  subclassName = entry.subclass || "";
  entry.level += 1;
  classLevel = entry.level;
  isNewClass = false;
} else {
  // Одноклассовый (без мультикласса)
  className = char.class;
  hitDie = CLASS_HIT_DICE[className] || 8;
  subclassName = char.subclass || "";
  isNewClass = false;
  if (char.classes.length > 0) {
    char.classes[0].level = (char.classes[0].level || oldLevel) + 1;
    classLevel = char.classes[0].level;
  } else {
    classLevel = oldLevel + 1;
  }
}

// Синхронизируем поля
syncClassFields(char);
var newTotalLevel = char.level;

// HP gain
var hpGain;
if (isMulticlass(char) || isNewClass) {
  hpGain = Math.floor(hitDie / 2) + 1 + conMod;
  if (hpGain < 1) hpGain = 1;
} else {
  var newMaxHPCalc = calculateMaxHP(newTotalLevel, conMod, hitDie);
  hpGain = newMaxHPCalc - oldMaxHP;
}
var newMaxHP = oldMaxHP + hpGain;
var newProf = getProficiencyBonus(newTotalLevel);

char.combat.hpMax = newMaxHP;
char.combat.hpCurrent = Math.min(char.combat.hpCurrent + hpGain, newMaxHP);
char.combat.hpDice = isMulticlass(char) ? "мульти" : "1к" + hitDie;
char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };

// Ячейки заклинаний
if (isMulticlass(char)) {
  var mcSlots = getMulticlassSpellSlots(char);
  for (var i = 1; i <= 9; i++) {
    char.spells.slots[i] = mcSlots[i] || 0;
    char.spells.slotsUsed[i] = 0;
  }
  // Ячейки пакта Колдуна (если есть) — обрабатываются отдельно через SPELL_SLOTS_BY_LEVEL["Колдун"]
  var warlockEntry = char.classes.find(function(c) { return c.class === "Колдун"; });
  if (warlockEntry && SPELL_SLOTS_BY_LEVEL["Колдун"] && SPELL_SLOTS_BY_LEVEL["Колдун"][warlockEntry.level]) {
    // Пакт-ячейки хранятся в отдельном месте или добавляются поверх
    // Для простоты: если Колдун — единственный заклинатель, используем его таблицу
    // Иначе пакт-ячейки добавляются к мультикласс-таблице (по RAW они отдельные)
    // TODO: отдельное отображение пакт-ячеек
  }
} else {
  if (SPELL_SLOTS_BY_LEVEL[className] && SPELL_SLOTS_BY_LEVEL[className][newTotalLevel]) {
    var slots = SPELL_SLOTS_BY_LEVEL[className][newTotalLevel];
    for (var j = 1; j <= 9; j++) {
      char.spells.slots[j] = slots[j] || 0;
      char.spells.slotsUsed[j] = 0;
    }
  }
}

saveToLocal();
loadCharacter(currentId);
updateClassFeatures();
renderClassResources();
renderSpellSlots();
$("lu-screen-preview").style.display = "none";
$("lu-screen-multiclass").style.display = "none";
$("lu-screen-result").style.display = "";

var classLabel = isMulticlass(char) ? getClassLabel(char) : className;
$("lu-result-title").textContent = classLabel + " · Уровень " + newTotalLevel + "!";
addJournalEntry("levelup", "Достигнут " + newTotalLevel + " уровень! (" + classLabel + ")", "ХП: " + oldMaxHP + " → " + newMaxHP + " · Бонус мастерства: +" + newProf);
renderJournal();

var resultLines = ["❤️ ХП: " + oldMaxHP + " → " + newMaxHP + " (+" + hpGain + ")", "🎲 Костей хитов: " + newTotalLevel];
if (isMulticlass(char)) resultLines.push("📋 " + getClassLabel(char));
if (newProf !== oldProf) resultLines.push("⚡ Бонус мастерства: +" + oldProf + " → +" + newProf);
if (CLASS_FEATURES[className] && CLASS_FEATURES[className][classLevel]) {
  var names = CLASS_FEATURES[className][classLevel].map(function(f) { return f.name; });
  resultLines.push("✨ Новые умения: " + names.join(", "));
}
if (subclassName && typeof SUBCLASS_FEATURES !== "undefined" && SUBCLASS_FEATURES[subclassName] && SUBCLASS_FEATURES[subclassName][classLevel]) {
  var subNames = SUBCLASS_FEATURES[subclassName][classLevel].map(function(f) { return f.name; });
  resultLines.push("🔮 " + subclassName + ": " + subNames.join(", "));
}
if (isNewClass) resultLines.push("🆕 Новый класс: " + className);

$("lu-result-body").innerHTML = resultLines.map(function(l) {
  return "<div class=\"lu-result-line\">" + l + "</div>";
}).join("");

_luMulticlassChoice = null;
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
// Спасбросок концентрации при уроне (PHB: DC = max(10, урон/2))
if (delta < 0 && char.concentration) {
  var absDmg = Math.abs(delta);
  if (hpCurrent <= 0) {
    endConcentration();
    showToast("💔 Концентрация потеряна — 0 ХП!", "error");
  } else {
    var concDC = Math.max(10, Math.floor(absDmg / 2));
    var conSaveMod = getMod(char.stats.con);
    var profBonus = getProficiencyBonus(char.level || 1);
    if (char.saves && char.saves.con) conSaveMod += profBonus;
    var concRoll = Math.floor(Math.random() * 20) + 1;
    var concTotal = concRoll + conSaveMod;
    var concSuccess = concTotal >= concDC;
    if (concSuccess) {
      showToast("🔮 Концентрация: спасбросок ТЕЛ " + concRoll + "+" + conSaveMod + "=" + concTotal + " vs DC " + concDC + " — Успех!", "success");
    } else {
      endConcentration();
      showToast("💔 Концентрация потеряна! ТЕЛ " + concRoll + "+" + conSaveMod + "=" + concTotal + " vs DC " + concDC + " — Провал", "error");
    }
  }
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

