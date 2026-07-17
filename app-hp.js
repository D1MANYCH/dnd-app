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
const hitDiceValue = hitDiceMatch ? parseInt(hitDiceMatch[2], 10) : 8;
const avgHeal = Math.floor(hitDiceValue / 2) + 1;
const conMod = getMod(char.stats.con);
const totalHeal = hitDiceToSpend * (avgHeal + conMod);
const availableEl = $("hit-dice-available-rest");
const healEl = $("hit-dice-heal");
if (availableEl) availableEl.textContent = availableHitDice;
if (healEl) healEl.textContent = totalHeal;
}
// FIN-8: заряды предметов на длинном отдыхе — полное восстановление (упрощение
// против «1к6+N» книги). Восстанавливает предметы всех категорий инвентаря с
// maxCharges>0 и recharge!=="none", если заряды не полны. Возвращает число предметов.
function restoreItemCharges(char) {
  if (!char || !char.inventory) return 0;
  var restored = 0;
  Object.keys(char.inventory).forEach(function(cat) {
    if (!Array.isArray(char.inventory[cat])) return;
    char.inventory[cat].forEach(function(it) {
      if (!it) return;
      var max = parseInt(it.maxCharges, 10) || 0;
      if (max <= 0 || it.recharge === "none") return;
      var cur = parseInt(it.charges, 10) || 0;
      if (cur < max) { it.charges = max; restored++; }
    });
  });
  return restored;
}
function confirmRest() {
if (!currentId || !currentRestType) return;
const char = getCurrentChar();
if (!char) return;
let resultTitle = "";
let resultDetails = "";
const oldHp = parseInt(char.combat.hpCurrent, 10);
if (currentRestType === "short") {
var _hitDie = parseInt(char.combat.hpDice.match(/(\d+)[кK](\d+)/)?.[2] || 8, 10);
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
char.combat.hpCurrent = Math.min((parseInt(char.combat.hpCurrent, 10) || 0) + hpHealed, parseInt(char.combat.hpMax, 10) || 0);
char.combat.hpDiceSpent = (char.combat.hpDiceSpent || 0) + hitDiceToSpend;
// FIX: Warlock recovers spell slots on short rest
var _isWarlock = (char.class === "Колдун") || (char.classes && char.classes.some(function(c){return c.class === "Колдун";}));
if (_isWarlock && char.spells) {
  if (char.spells.slots) {
    for (var _si = 1; _si <= 9; _si++) {
      if (char.spells.slots[_si]) char.spells.slotsUsed[_si] = 0;
    }
  }
  // BUGFIX-1: пакт-ячейки восстанавливаются на коротком отдыхе
  if (char.spells.pactSlots) char.spells.pactUsed = 0;
}
if (hpHealed > 0) {
  addHPHistory(oldHp, char.combat.hpCurrent, hpHealed, "Короткий отдых");
  showHPToast(hpHealed);
}
resetResourcesByRest("short");
// CAST-2: короткий отдых (1 час) — раундовые/минутные эффекты кастов истекают,
// часовые и дольше переживают
var _castExpired = (typeof expireCastEffectsByUnits === "function")
  ? expireCastEffectsByUnits(char, ["round", "minute"], "короткий отдых") : [];
resultTitle = "✅ Короткий отдых завершён!";
if (window.AppLog) AppLog.action("hp", "короткий отдых: костей " + hitDiceToSpend + ", +" + hpHealed + " ХП" + (_isWarlock ? ", пакт восстановлен" : "") + (_castExpired.length ? ", истекло эффектов: " + _castExpired.length : ""));
var rollStr = rollLog.length > 0 ? " (" + rollLog.join(", ") + ")" : "";
var warlockStr = _isWarlock ? "<p>🔮 Ячейки пакта восстановлены</p>" : "";
var castExpiredStr = _castExpired.length ? "<p>⏳ Истекли эффекты: " + _castExpired.join(", ") + "</p>" : "";
resultDetails = "<div class='rest-comparison'><div class='before'>ХП: " + oldHp + "</div><div class='arrow'>→</div><div class='after'>ХП: " + char.combat.hpCurrent + "</div></div><p>🎲 Потрачено костей: " + hitDiceToSpend + rollStr + "</p><p>❤️ Восстановлено ХП: " + hpHealed + "</p><p>📊 Доступно костей: " + (char.level - char.combat.hpDiceSpent) + "/" + char.level + "</p>" + warlockStr + castExpiredStr;
} else if (currentRestType === "long") {
const maxHp = parseInt(char.combat.hpMax, 10) || 0;
char.combat.hpCurrent = maxHp;
for(let i=1; i<=9; i++) { if (char.spells.slots[i]) char.spells.slotsUsed[i] = 0; }
if (char.spells.pactSlots) char.spells.pactUsed = 0;
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
      var exhNum = parseInt(exhLevels[ei].split("_")[1], 10);
      if (exhNum > 1) {
        char.conditions.push("exhaustion_" + (exhNum - 1));
      }
      exhaustionReduced = true;
      break;
    }
  }
}
char.effects = [];
// CAST-1: длинный отдых снимает все эффекты кастов и обрывает концентрацию
char.activeSpellEffects = [];
char.concentration = null;
char.concentrationData = null;
char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };
resetResourcesByRest("long");
// FIN-8: восстановить заряды предметов (палочки/посохи/жезлы)
var chargesRestored = restoreItemCharges(char);
loadConditions();
loadEffects();
addHPHistory(oldHp, maxHp, maxHp - oldHp, "Долгий отдых");
if (maxHp - oldHp > 0) showHPToast(maxHp - oldHp);
resultTitle = "✅ Долгий отдых завершён!";
if (window.AppLog) AppLog.action("hp", "длинный отдых: ХП " + oldHp + " → " + maxHp + (exhaustionReduced ? ", истощение −1" : "") + (chargesRestored ? ", заряды: " + chargesRestored : ""));
addJournalEntry("rest", "Долгий отдых — новая сессия", "Уровень " + (char.level||1) + " · ХП: " + oldHp + " → " + maxHp + " · Ячейки и ресурсы восстановлены");
renderJournal();
var exhaustionNote = exhaustionReduced ? "<p>😫 Истощение снижено на 1 уровень</p>" : "";
var chargesNote = chargesRestored ? "<p>⚡ Заряды предметов восстановлены: " + chargesRestored + "</p>" : "";
resultDetails = "<div class='rest-comparison'><div class='before'>ХП: " + oldHp + "</div><div class='arrow'>→</div><div class='after'>ХП: " + maxHp + "</div></div><p>✨ Ячейки заклинаний: восстановлены</p><p>🎲 Кости хитов: восстановлено " + hitDiceToRestore + "</p><p>📊 Доступно костей: " + (char.level - char.combat.hpDiceSpent) + "/" + char.level + "</p>" + exhaustionNote + chargesNote;
}
saveToLocal();
loadCharacter(currentId);
showRestResult(resultTitle, resultDetails);
}
// ── Мультикласс: переменная для выбранного класса при level-up ──
var _luMulticlassChoice = null; // {class, subclass, hitDie, isNew}
var _luChoicesCtx = null; // BUILD-LVL-4: контекст guided level-up (для экрана результата после выборов)

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
  var currentHP = parseInt(char.combat.hpMax, 10) || 0;
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

  // Баннер рекомендации билда
  var hintEl = $("lu-build-hint");
  var buildRec = null;
  if (hintEl) {
    if (char.buildId && typeof window.getBuildRecommendationForLevel === "function") {
      buildRec = window.getBuildRecommendationForLevel(char.buildId, newTotalLevel);
      var build = window.getBuildById ? window.getBuildById(char.buildId) : null;
      if (buildRec) {
        var buildTitle = build ? build.title : "";
        // BUILD-LVL-2: следующий шаг (newTotalLevel+1) + ссылка на полный план 1–20.
        var nextRec = window.getBuildRecommendationForLevel(char.buildId, newTotalLevel + 1);
        var nextHtml = (nextRec && nextRec.headline)
          ? "<div class='lu-build-hint-next'>↪ Дальше (" + (newTotalLevel + 1) + " ур.): " + escapeHtml(nextRec.headline) + "</div>"
          : "";
        hintEl.innerHTML = "<div class='lu-build-hint-label'>💡 Рекомендация билда" + (buildTitle ? " «" + escapeHtml(buildTitle) + "»" : "") + "</div>" +
          "<div class='lu-build-hint-headline'>" + escapeHtml(buildRec.headline) + "</div>" +
          "<div class='lu-build-hint-why'>" + escapeHtml(buildRec.why) + "</div>" +
          nextHtml +
          "<button type='button' class='lu-build-hint-plan' onclick=\"openBuildPlan('" + char.buildId + "')\">📈 весь план 1–20</button>";
        hintEl.style.display = "";
      } else {
        hintEl.style.display = "none";
        hintEl.innerHTML = "";
      }
    } else {
      hintEl.style.display = "none";
      hintEl.innerHTML = "";
    }
  }

  // Фичи
  var featuresContainer = $("lu-features-container");
  featuresContainer.innerHTML = "";
  if (CLASS_FEATURES[className] && CLASS_FEATURES[className][classLevel]) {
    CLASS_FEATURES[className][classLevel].forEach(function(f) {
      var div = document.createElement("div");
      div.className = "lu-feature-item";
      if (buildRec && buildRec.headline && buildRec.headline.toLowerCase().indexOf(f.name.toLowerCase()) !== -1) {
        div.className += " recommended";
      }
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
// UI-9: снимок состояния перед мутацией — для одношагового отката
try {
  var _snap = JSON.parse(JSON.stringify(char));
  delete _snap._prevLevelSnapshot; // не вкладываем снимок в снимок
  _snap._snapshotAt = Date.now();
  char._prevLevelSnapshot = _snap;
} catch(e) { console.error("[UI-9] snapshot failed:", e); }
const oldMaxHP = parseInt(char.combat.hpMax, 10) || 0;
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
function _resolvePact(row) {
  var cnt = 0, lvl = 0;
  if (row) for (var k = 1; k < row.length; k++) if (row[k] > 0) { cnt = row[k]; lvl = k; }
  return { cnt: cnt, lvl: lvl };
}
char.spells.pactSlots = 0;
char.spells.pactLevel = 0;
char.spells.pactUsed = 0;
if (isMulticlass(char)) {
  var mcSlots = getMulticlassSpellSlots(char);
  for (var i = 1; i <= 9; i++) {
    char.spells.slots[i] = mcSlots[i] || 0;
    char.spells.slotsUsed[i] = 0;
  }
  // BUGFIX-1: пакт-ячейки Колдуна хранятся отдельно (PHB p.165, восст. на коротком отдыхе)
  var warlockEntry = char.classes.find(function(c) { return c.class === "Колдун"; });
  if (warlockEntry && SPELL_SLOTS_BY_LEVEL["Колдун"] && SPELL_SLOTS_BY_LEVEL["Колдун"][warlockEntry.level]) {
    var pact = _resolvePact(SPELL_SLOTS_BY_LEVEL["Колдун"][warlockEntry.level]);
    char.spells.pactSlots = pact.cnt;
    char.spells.pactLevel = pact.lvl;
  }
} else {
  // Одноклассовый Колдун: всё в пакт-ячейках, обычные слоты пустые
  if (className === "Колдун" && SPELL_SLOTS_BY_LEVEL["Колдун"] && SPELL_SLOTS_BY_LEVEL["Колдун"][newTotalLevel]) {
    var pactSingle = _resolvePact(SPELL_SLOTS_BY_LEVEL["Колдун"][newTotalLevel]);
    char.spells.pactSlots = pactSingle.cnt;
    char.spells.pactLevel = pactSingle.lvl;
    for (var jw = 1; jw <= 9; jw++) {
      char.spells.slots[jw] = 0;
      char.spells.slotsUsed[jw] = 0;
    }
  } else if (SPELL_SLOTS_BY_LEVEL[className] && SPELL_SLOTS_BY_LEVEL[className][newTotalLevel]) {
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
var classLabel = isMulticlass(char) ? getClassLabel(char) : className;
if (window.AppLog) AppLog.action("character", "уровень → " + newTotalLevel + " (" + classLabel + ")", { hp: oldMaxHP + "→" + newMaxHP, prof: newProf });
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

// BUILD-LVL-4: сохраняем контекст и решаем — показать экран выборов или сразу результат.
_luChoicesCtx = {
  newTotalLevel: newTotalLevel, className: className, classLevel: classLevel,
  subclassName: subclassName, isNewClass: isNewClass, resultLines: resultLines,
  resultTitle: classLabel + " · Уровень " + newTotalLevel + "!"
};
_luMulticlassChoice = null;
updateLevelDownVisibility();

$("lu-screen-multiclass").style.display = "none";
$("lu-screen-preview").style.display = "none";
var _luHasChoices = luBuildChoicesScreen();
if (_luHasChoices) {
  $("lu-screen-choices").style.display = "";
  $("lu-screen-result").style.display = "none";
} else {
  _luShowResult();
}
}

// BUILD-LVL-4: финальный экран результата повышения (из _luChoicesCtx).
function _luShowResult() {
  var ctx = _luChoicesCtx || { resultLines: [], resultTitle: "Уровень повышен!" };
  var lines = (ctx.resultLines || []).slice();
  // BUILD-LVL-4: подкласс мог быть выбран во время guided-шага → добавить его фичи в итог.
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  if (char && char.subclass && !ctx.subclassName && ctx.classLevel &&
      typeof SUBCLASS_FEATURES !== "undefined" && SUBCLASS_FEATURES[char.subclass] &&
      SUBCLASS_FEATURES[char.subclass][ctx.classLevel]) {
    var sn = SUBCLASS_FEATURES[char.subclass][ctx.classLevel].map(function(f){ return f.name; });
    lines.push("🔮 " + char.subclass + ": " + sn.join(", "));
  }
  $("lu-screen-choices").style.display = "none";
  $("lu-screen-multiclass").style.display = "none";
  $("lu-screen-preview").style.display = "none";
  $("lu-screen-result").style.display = "";
  if ($("lu-result-title")) $("lu-result-title").textContent = ctx.resultTitle;
  if ($("lu-result-body")) {
    $("lu-result-body").innerHTML = lines.map(function(l) {
      return "<div class=\"lu-result-line\">" + l + "</div>";
    }).join("");
  }
}

// BUILD-LVL-4: завершить экран выборов → показать результат.
function luFinishChoices() {
  var char = getCurrentChar();
  if (char) { saveToLocal(); loadCharacter(currentId); if (typeof updateClassFeatures === "function") updateClassFeatures(); }
  _luShowResult();
}

// BUILD-LVL-4: перерисовать экран выборов (вызывается из под-пикеров после применения).
function luRefreshChoices() {
  var screen = $("lu-screen-choices");
  if (!screen || screen.style.display === "none") return;
  luBuildChoicesScreen();
}

// BUILD-LVL-4: инлайн-установка подкласса с экрана выборов.
function luSetSubclass(name) {
  var char = getCurrentChar();
  if (!char || !_luChoicesCtx) return;
  char.subclass = name;
  if (Array.isArray(char.classes) && char.classes.length) {
    var idx = 0;
    for (var i = 0; i < char.classes.length; i++) { if (char.classes[i].class === _luChoicesCtx.className) { idx = i; break; } }
    char.classes[idx].subclass = name;
  }
  saveToLocal();
  loadCharacter(currentId);
  if (typeof updateClassFeatures === "function") updateClassFeatures();
  if (typeof showToast === "function") showToast("Подкласс: " + name, "success");
  luBuildChoicesScreen();
}

// BUILD-LVL-4: применить черту по id (эффекты + запись), без модалки. Возвращает имя или null.
function luApplyFeatById(char, featId, level) {
  if (typeof FEATS_DATA === "undefined") return null;
  var feat = FEATS_DATA.find(function(f){ return f.id === featId; });
  if (!feat) return null;
  if (!char.feats) char.feats = [];
  if (char.feats.some(function(f){ return f.id === featId; })) return null; // уже взята
  (feat.effects || []).forEach(function(eff){
    if (eff.type === "stat") {
      char.stats[eff.key] = Math.min(20, (char.stats[eff.key] || 10) + eff.value);
    } else if (eff.type === "stat_choice" || eff.type === "stat_choice_save") {
      var picked = eff.keys.find(function(k){ return (char.stats[k] || 10) < 20; });
      if (picked) {
        char.stats[picked] = Math.min(20, (char.stats[picked] || 10) + eff.value);
        if (eff.type === "stat_choice_save") { if (!char.saves) char.saves = {}; char.saves[picked] = true; }
      }
    } else if (eff.type === "armor") {
      if (!char.proficiencies.armor) char.proficiencies.armor = [];
      if (char.proficiencies.armor.indexOf(eff.value) === -1) char.proficiencies.armor.push(eff.value);
    } else if (eff.type === "hp_per_level") {
      var bonus = eff.value * (char.level || 1);
      char.combat.hpMax = (char.combat.hpMax || 10) + bonus;
      char.combat.hpCurrent = Math.min(char.combat.hpCurrent + bonus, char.combat.hpMax);
    } else if (eff.type === "initiative_bonus") {
      if (!char.bonuses) char.bonuses = {};
      char.bonuses.initiative = (char.bonuses.initiative || 0) + eff.value;
    }
  });
  char.feats.push({ id: feat.id, name: feat.name, level: level });
  return feat.name;
}

// BUILD-LVL-4: применить ASI из плана билда (asi:{str:2} или {str:1,con:1}). Возвращает описание или null.
function luApplyAsi(char, asi) {
  if (!asi || typeof asi !== "object") return null;
  var names = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
  var parts = [];
  Object.keys(asi).forEach(function(k){
    if (!names[k]) return;
    var inc = asi[k] || 0;
    var before = char.stats[k] || 10;
    char.stats[k] = Math.min(20, before + inc);
    if (char.stats[k] !== before) parts.push(names[k] + " +" + (char.stats[k] - before));
  });
  return parts.length ? parts.join(", ") : null;
}

// SDR-2: объединённый список выборов класса и подкласса для уровень-апа.
// Манёвры Боевого мастера и подобные живут в SUBCLASS_CHOICES[char.subclass];
// хранилище выбора в обоих случаях по имени класса (cn) — как в ccGetStored/ccSetStored.
function _ccDefsFor(cn, char) {
  var defs = [];
  if (typeof CLASS_CHOICES !== "undefined" && CLASS_CHOICES[cn]) defs = defs.concat(CLASS_CHOICES[cn]);
  if (char && char.subclass && typeof SUBCLASS_CHOICES !== "undefined" && SUBCLASS_CHOICES[char.subclass]) {
    defs = defs.concat(SUBCLASS_CHOICES[char.subclass]);
  }
  return defs;
}

// BUILD-LVL-4: применить ВСЕ рекомендации билда для текущего уровня разом.
function luApplyAllRecommendations() {
  var char = getCurrentChar();
  var ctx = _luChoicesCtx;
  if (!char || !ctx) return;
  var b = (char.buildId && window.getBuildById) ? window.getBuildById(char.buildId) : null;
  if (!b) { if (typeof showToast === "function") showToast("Нет билда — нечего применять", "warn"); return; }
  var cn = ctx.className, clvl = ctx.classLevel, newLevel = ctx.newTotalLevel;
  var rec = (b.levelUp && b.levelUp[newLevel]) ? b.levelUp[newLevel] : null;
  var applied = [];

  // 1) Подкласс
  var subMinLevel = null;
  if (typeof SUBCLASSES !== "undefined" && SUBCLASSES[cn] && typeof SUBCLASS_FEATURES !== "undefined") {
    SUBCLASSES[cn].forEach(function(s){
      if (SUBCLASS_FEATURES[s]) {
        var mn = Math.min.apply(null, Object.keys(SUBCLASS_FEATURES[s]).map(Number));
        if (subMinLevel === null || mn < subMinLevel) subMinLevel = mn;
      }
    });
  }
  if (subMinLevel === clvl && !char.subclass && b.subclass) {
    char.subclass = b.subclass;
    if (Array.isArray(char.classes) && char.classes.length) {
      var idx = 0;
      for (var i = 0; i < char.classes.length; i++) { if (char.classes[i].class === cn) { idx = i; break; } }
      char.classes[idx].subclass = b.subclass;
    }
    applied.push("подкласс: " + b.subclass);
  }

  // 2) ASI / черта
  var isAsiLevel = (typeof CLASS_FEATURES !== "undefined" && CLASS_FEATURES[cn] && CLASS_FEATURES[cn][clvl]) &&
    CLASS_FEATURES[cn][clvl].some(function(f){ return f && f.name === "Увеличение характеристик"; });
  if (isAsiLevel) {
    var asiDone = Array.isArray(char.asiUsedLevels) && char.asiUsedLevels.indexOf(newLevel) >= 0;
    if (!asiDone && rec) {
      var did = null;
      // приоритет: явный feat → явный asi → парсинг headline (feat → asi)
      var featId = rec.feat || (typeof parseFeatFromHeadline === "function" ? parseFeatFromHeadline(rec.headline) : null);
      var asiObj = rec.asi || (typeof parseAsiFromHeadline === "function" ? parseAsiFromHeadline(rec.headline) : null);
      if (featId) { var fn = luApplyFeatById(char, featId, newLevel); if (fn) did = "черта «" + fn + "»"; }
      else if (asiObj) { var ad = luApplyAsi(char, asiObj); if (ad) did = "характеристики (" + ad + ")"; }
      if (did) {
        if (!char.asiUsedLevels) char.asiUsedLevels = [];
        if (char.asiUsedLevels.indexOf(newLevel) < 0) char.asiUsedLevels.push(newLevel);
        applied.push(did);
      }
    }
  }

  // 3) Классовые/подклассовые выборы, рекомендованные билдом и открытые на этом уровне (single + multi)
  // SDR-2: помимо CLASS_CHOICES учитываем SUBCLASS_CHOICES[char.subclass] (манёвры Боевого мастера и т.п.).
  if (b.recommendedChoices) {
    _ccDefsFor(cn, char).forEach(function(cc){
      if (cc.minLevel !== clvl) return;
      var recIds = getBuildRecChoiceIds(char, cc.id);
      if (!recIds.length) return;
      var stored = char.classChoices && char.classChoices[cn] && char.classChoices[cn][cc.id];
      if (cc.type === "single") {
        if (stored) return;
        var recId = recIds[0];
        if (typeof ccSetStored === "function") ccSetStored(char, cn, cc.id, recId);
        else { char.classChoices = char.classChoices || {}; char.classChoices[cn] = char.classChoices[cn] || {}; char.classChoices[cn][cc.id] = recId; }
        var nm = (cc.optionsDict && cc.optionsDict[recId]) ? cc.optionsDict[recId].name : recId;
        applied.push(cc.name + ": " + nm);
      } else if (cc.type === "multi") {
        var count = (typeof ccCount === "function") ? ccCount(cc, clvl) : recIds.length;
        var arr = Array.isArray(stored) ? stored.slice() : [];
        if (arr.length >= count) return;
        // фильтр доступности (уровень/пакт/req); для skills-пула годятся любые навыки
        var avail = (cc.pool !== "skills" && typeof ccAvailableOptions === "function") ? ccAvailableOptions(cc, char, cn) : null;
        var addedNames = [];
        recIds.forEach(function(rid){
          if (arr.length >= count || arr.indexOf(rid) !== -1) return;
          if (avail && avail.indexOf(rid) === -1) return;
          arr.push(rid);
          addedNames.push((cc.optionsDict && cc.optionsDict[rid]) ? cc.optionsDict[rid].name : rid);
        });
        if (!addedNames.length) return;
        if (typeof ccSetStored === "function") ccSetStored(char, cn, cc.id, arr);
        else { char.classChoices = char.classChoices || {}; char.classChoices[cn] = char.classChoices[cn] || {}; char.classChoices[cn][cc.id] = arr; }
        applied.push(cc.name + ": " + addedNames.join(", "));
      }
    });
  }

  // 4) Заклинания из плана (явный spellsAdd или парсинг headline — через getBuildRecSpellObjs)
  if (typeof getBuildRecSpellObjs === "function") {
    var recSpellObjs = getBuildRecSpellObjs(b, newLevel);
    if (recSpellObjs.length) {
      if (!char.spells) char.spells = {};
      if (!Array.isArray(char.spells.mySpells)) char.spells.mySpells = [];
      var addedSpells = [];
      recSpellObjs.forEach(function(sp){
        if (!char.spells.mySpells.some(function(x){ return x.id === sp.id || x.name === sp.name; })) {
          char.spells.mySpells.push(sp);
          addedSpells.push(sp.name);
        }
      });
      if (addedSpells.length) applied.push("заклинания: " + addedSpells.join(", "));
    }
  }

  if (!applied.length) {
    if (typeof showToast === "function") showToast("Рекомендации уже применены или нечего применять", "info");
    return;
  }
  saveToLocal();
  loadCharacter(currentId);
  if (typeof calcStats === "function") calcStats();
  if (typeof recalculateHP === "function") recalculateHP();
  if (typeof calculateAC === "function") calculateAC();
  if (typeof updateClassFeatures === "function") updateClassFeatures();
  if (typeof renderSpellSlots === "function") renderSpellSlots();
  addJournalEntry("levelup", "Авто-применены рекомендации билда (ур. " + newLevel + ")", applied.join(" · "));
  if (typeof renderJournal === "function") renderJournal();
  if (typeof showToast === "function") showToast("✅ Применено: " + applied.join(", "), "success");
  luBuildChoicesScreen();
}

// BUILD-LVL-4: построить экран выборов нового уровня. Возвращает true, если есть что выбирать.
function luBuildChoicesScreen() {
  var char = getCurrentChar();
  var ctx = _luChoicesCtx;
  var body = $("lu-choices-body");
  if (!char || !ctx || !body) return false;
  var b = (char.buildId && window.getBuildById) ? window.getBuildById(char.buildId) : null;
  var cn = ctx.className, clvl = ctx.classLevel, newLevel = ctx.newTotalLevel;
  var blocks = [];
  function recBadge(text) { return '<span class="rec-badge">💡 ' + escapeHtml(text) + '</span>'; }

  // 1) ВЫБОР ПОДКЛАССА — если открывается на этом уровне класса.
  var subMinLevel = null;
  if (typeof SUBCLASSES !== "undefined" && SUBCLASSES[cn] && typeof SUBCLASS_FEATURES !== "undefined") {
    SUBCLASSES[cn].forEach(function(s){
      if (SUBCLASS_FEATURES[s]) {
        var mn = Math.min.apply(null, Object.keys(SUBCLASS_FEATURES[s]).map(Number));
        if (subMinLevel === null || mn < subMinLevel) subMinLevel = mn;
      }
    });
  }
  if (subMinLevel === clvl && !char.subclass) {
    var recSub = b ? b.subclass : null;
    var optsHtml = SUBCLASSES[cn].map(function(s){
      var isRec = (s === recSub);
      return '<button class="lu-choice-opt' + (isRec ? ' is-rec' : '') + '" onclick="luSetSubclass(\'' + s.replace(/'/g,"\\'") + '\')">' +
        escapeHtml(s) + (isRec ? ' ' + recBadge('совет') : '') + '</button>';
    }).join("");
    blocks.push('<div class="lu-choice-block"><div class="lu-choice-title">🔮 Выбор подкласса</div>' +
      (recSub ? '<div class="lu-choice-sub">Билд советует: <b style="color:var(--rec)">' + escapeHtml(recSub) + '</b></div>' : '') +
      '<div class="lu-choice-opts">' + optsHtml + '</div></div>');
  } else if (char.subclass && subMinLevel === clvl) {
    blocks.push('<div class="lu-choice-block done"><div class="lu-choice-title">🔮 Подкласс: ' + escapeHtml(char.subclass) + ' ✓</div></div>');
  }

  // 2) ASI / ЧЕРТА — если на этом уровне класса есть «Увеличение характеристик».
  var isAsiLevel = (typeof CLASS_FEATURES !== "undefined" && CLASS_FEATURES[cn] && CLASS_FEATURES[cn][clvl]) &&
    CLASS_FEATURES[cn][clvl].some(function(f){ return f && f.name === "Увеличение характеристик"; });
  if (isAsiLevel) {
    var asiDone = Array.isArray(char.asiUsedLevels) && char.asiUsedLevels.indexOf(newLevel) >= 0;
    var recAsi = (b && b.levelUp && b.levelUp[newLevel]) ? b.levelUp[newLevel] : null;
    blocks.push('<div class="lu-choice-block' + (asiDone ? ' done' : '') + '">' +
      '<div class="lu-choice-title">📈 Увеличение характеристик или черта' + (asiDone ? ' ✓' : '') + '</div>' +
      (recAsi && recAsi.headline ? '<div class="lu-choice-sub">' + recBadge('Совет') + ' ' + escapeHtml(recAsi.headline) + '</div>' : '') +
      (asiDone ? '' : '<button class="lu-choice-launch" onclick="openASIModalForLevel(' + newLevel + ')">Выбрать →</button>') +
      '</div>');
  }

  // 3) КЛАССОВЫЕ/ПОДКЛАССОВЫЕ ВЫБОРЫ, открывающиеся на этом уровне (стиль боя, манёвры и т.п.).
  if (_ccDefsFor(cn, char).length) {                       // SDR-2: + SUBCLASS_CHOICES[char.subclass]
    _ccDefsFor(cn, char).forEach(function(cc){
      if (cc.minLevel !== clvl) return;
      var stored = char.classChoices && char.classChoices[cn] && char.classChoices[cn][cc.id];
      var ccN = (typeof ccCount === "function") ? ccCount(cc, clvl) : 1;
      var has = cc.type === "single" ? !!stored : (Array.isArray(stored) && stored.length >= ccN);
      var recIds = (b && typeof getBuildRecChoiceIds === "function") ? getBuildRecChoiceIds(char, cc.id) : [];
      var recNm = recIds.length ? recIds.map(function(rid){ return (cc.optionsDict && cc.optionsDict[rid]) ? cc.optionsDict[rid].name : rid; }).join(", ") : null;
      blocks.push('<div class="lu-choice-block' + (has ? ' done' : '') + '">' +
        '<div class="lu-choice-title">' + (cc.icon || "⚡") + " " + escapeHtml(cc.name) + (has ? ' ✓' : '') + '</div>' +
        (recNm ? '<div class="lu-choice-sub">' + recBadge(recNm) + '</div>' : '') +
        (has ? '' : '<button class="lu-choice-launch" onclick="openClassChoiceModal(\'' + cn.replace(/'/g,"\\'") + '\',\'' + cc.id + '\')">Выбрать →</button>') +
        '</div>');
    });
  }

  // 4) ЗАКЛИНАНИЯ — если класс-заклинатель. Два пути:
  //    (1) рекомендации билда + кнопка их добавить; (2) добавить самому → вкладка «Заклинания».
  var SPELL_CASTERS = ["Волшебник","Жрец","Друид","Бард","Паладин","Следопыт","Чародей","Колдун"];
  if (SPELL_CASTERS.indexOf(cn) >= 0) {
    var recSpellObjs = (b && typeof getBuildRecSpellObjs === "function") ? getBuildRecSpellObjs(b, newLevel) : [];
    var mySp = (char.spells && Array.isArray(char.spells.mySpells)) ? char.spells.mySpells : [];
    var spParts = ['<div class="lu-choice-title">✨ Заклинания</div>'];
    if (recSpellObjs.length) {
      var allAdded = recSpellObjs.every(function(sp){ return mySp.some(function(x){ return x.id === sp.id || x.name === sp.name; }); });
      spParts.push('<div class="lu-choice-sub">' + recBadge('Советуют') + ' ' + escapeHtml(recSpellObjs.map(function(s){ return s.name; }).join(", ")) + '</div>');
      spParts.push('<button class="lu-choice-launch"' + (allAdded ? ' disabled' : '') + ' onclick="luAddRecommendedSpells()">' +
        (allAdded ? '✓ Рекомендованные добавлены' : '✨ Добавить рекомендованные') + '</button>');
    } else {
      spParts.push('<div class="lu-choice-sub">Билд не указывает конкретные заклинания этого уровня.</div>');
    }
    spParts.push('<button class="lu-choice-alt" onclick="luGoToSpellsTab()">Добавить самому — вкладка «Заклинания» →</button>');
    blocks.push('<div class="lu-choice-block">' + spParts.join("") + '</div>');
  }

  // BUILD-LVL-4: кнопка «применить рекомендации билда разом» — если есть билд и незакрытые рек-выборы.
  var hasOpenRec = false;
  if (b) {
    var asiOpen = (typeof CLASS_FEATURES !== "undefined" && CLASS_FEATURES[cn] && CLASS_FEATURES[cn][clvl] &&
      CLASS_FEATURES[cn][clvl].some(function(f){ return f && f.name === "Увеличение характеристик"; })) &&
      !(Array.isArray(char.asiUsedLevels) && char.asiUsedLevels.indexOf(newLevel) >= 0) &&
      !!(b.levelUp && b.levelUp[newLevel] && (b.levelUp[newLevel].feat || b.levelUp[newLevel].asi ||
         (typeof parseAsiFromHeadline === "function" && parseAsiFromHeadline(b.levelUp[newLevel].headline)) ||
         (typeof parseFeatFromHeadline === "function" && parseFeatFromHeadline(b.levelUp[newLevel].headline))));
    var subOpen = (subMinLevel === clvl && !char.subclass && !!b.subclass);
    var ccOpen = false;
    if (b.recommendedChoices) {                            // SDR-2: + SUBCLASS_CHOICES[char.subclass]
      ccOpen = _ccDefsFor(cn, char).some(function(cc){
        if (cc.minLevel !== clvl) return false;
        var recIds = getBuildRecChoiceIds(char, cc.id);
        if (!recIds.length) return false;
        var st = char.classChoices && char.classChoices[cn] && char.classChoices[cn][cc.id];
        if (cc.type === "single") return !st;
        if (cc.type === "multi") {
          var cnt = (typeof ccCount === "function") ? ccCount(cc, clvl) : recIds.length;
          var arr = Array.isArray(st) ? st : [];
          return arr.length < cnt;
        }
        return false;
      });
    }
    var spOpen = false;
    if (typeof getBuildRecSpellObjs === "function") {
      var _recSp = getBuildRecSpellObjs(b, newLevel);
      var _mine = (char.spells && Array.isArray(char.spells.mySpells)) ? char.spells.mySpells : [];
      spOpen = _recSp.some(function(sp){ return !_mine.some(function(x){ return x.id === sp.id || x.name === sp.name; }); });
    }
    hasOpenRec = asiOpen || subOpen || ccOpen || spOpen;
  }
  var applyAllHtml = hasOpenRec
    ? '<button class="lu-apply-all-btn" onclick="luApplyAllRecommendations()">✨ Применить рекомендации билда разом</button>'
    : "";

  body.innerHTML = applyAllHtml + blocks.join("");
  return blocks.length > 0;
}

// BUILD-LVL: добавить рекомендованные билдом заклинания текущего уровня в лист (по кнопке, без авто-закрепления).
function luAddRecommendedSpells() {
  var char = getCurrentChar();
  var ctx = _luChoicesCtx;
  if (!char || !ctx) return;
  var b = (char.buildId && window.getBuildById) ? window.getBuildById(char.buildId) : null;
  var objs = (b && typeof getBuildRecSpellObjs === "function") ? getBuildRecSpellObjs(b, ctx.newTotalLevel) : [];
  if (!objs.length) return;
  if (!char.spells) char.spells = {};
  if (!Array.isArray(char.spells.mySpells)) char.spells.mySpells = [];
  var added = [];
  objs.forEach(function(sp){
    if (!char.spells.mySpells.some(function(x){ return x.id === sp.id || x.name === sp.name; })) {
      char.spells.mySpells.push(sp);
      added.push(sp.name);
    }
  });
  if (added.length) {
    saveToLocal();
    if (typeof renderMySpells === "function") renderMySpells();
    if (typeof renderPrepCounter === "function") renderPrepCounter();
    if (typeof showToast === "function") showToast("Добавлены заклинания: " + added.join(", "), "success");
  } else if (typeof showToast === "function") {
    showToast("Эти заклинания уже добавлены", "info");
  }
  luBuildChoicesScreen();
}

// BUILD-LVL: закрыть окно повышения и перейти на вкладку «Заклинания» с открытым поиском (отфильтрован по классу/уровню).
function luGoToSpellsTab() {
  if (typeof closeLevelUpModal === "function") closeLevelUpModal();
  if (typeof switchTab === "function") switchTab("spells", null);
  if (typeof openSpellSearch === "function") openSpellSearch();
}

// ============================================
// UI-9: Откат последнего повышения уровня (одношаговый undo)
// ============================================
function updateLevelDownVisibility() {
  var btn = $("level-down-btn");
  if (!btn) return;
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  var canRollback = !!(char && char.level > 1 && char._prevLevelSnapshot);
  btn.style.display = canRollback ? "" : "none";
}

function openLevelDownConfirm() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !char._prevLevelSnapshot) {
    showToast("Нет снимка для отката", "warn");
    return;
  }
  var snap = char._prevLevelSnapshot;
  var oldLvl = snap.level || 1;
  var curLvl = char.level || oldLvl;
  var oldMax = (snap.combat && parseInt(snap.combat.hpMax, 10)) || 0;
  var curMax = (char.combat && parseInt(char.combat.hpMax, 10)) || 0;
  // Список того, что будет утеряно
  var lostLines = [];
  lostLines.push("Уровень: " + curLvl + " → " + oldLvl);
  if (curMax !== oldMax) lostLines.push("ХП макс: " + curMax + " → " + oldMax);
  // Фичи класса на текущем classLevel
  try {
    var cn = char.class;
    var clvl = char.level;
    if (Array.isArray(char.classes) && char.classes.length > 0) {
      // берём последний изменившийся класс (тот, где level из snapshot отличается)
      var diffEntry = null;
      var snapClasses = Array.isArray(snap.classes) ? snap.classes : [];
      for (var i = 0; i < char.classes.length; i++) {
        var prev = snapClasses[i] && snapClasses[i].level;
        if ((prev || 0) < char.classes[i].level) { diffEntry = char.classes[i]; break; }
      }
      if (!diffEntry && char.classes.length > snapClasses.length) {
        diffEntry = char.classes[char.classes.length - 1]; // новый мультикласс
      }
      if (diffEntry) { cn = diffEntry.class; clvl = diffEntry.level; }
    }
    if (typeof CLASS_FEATURES !== "undefined" && CLASS_FEATURES[cn] && CLASS_FEATURES[cn][clvl]) {
      var names = CLASS_FEATURES[cn][clvl].map(function(f){ return f.name; });
      if (names.length) lostLines.push("Умения " + cn + " " + clvl + " ур.: " + names.join(", "));
    }
  } catch(e) { console.error("[UI-9] features diff failed:", e); }
  var text = "Будет утеряно:\n• " + lostLines.join("\n• ");
  showConfirmModal("Откатить последнее повышение?", text, function() {
    confirmLevelDown();
  });
}

function confirmLevelDown() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !char._prevLevelSnapshot) {
    showToast("Нет снимка для отката", "warn");
    return;
  }
  var snap = char._prevLevelSnapshot;
  // Восстанавливаем все поля из снимка
  var idx = characters.findIndex(function(c){ return c.id === currentId; });
  if (idx === -1) return;
  // Сохраняем id и schemaVersion (защита от downgrade)
  var preservedSchema = Math.max(snap.schemaVersion || 0, char.schemaVersion || 0);
  var restored = JSON.parse(JSON.stringify(snap));
  restored.id = char.id;
  restored.schemaVersion = preservedSchema;
  delete restored._prevLevelSnapshot;
  delete restored._snapshotAt;
  characters[idx] = restored;
  saveToLocal();
  loadCharacter(currentId);
  updateClassFeatures();
  renderClassResources();
  renderSpellSlots();
  if (window.AppLog) AppLog.action("character", "откат уровня: " + (char.level||1) + " → " + (restored.level||1));
  addJournalEntry("levelup", "Откат уровня: " + (char.level||1) + " → " + (restored.level||1),
    "Состояние возвращено к снимку перед последним повышением");
  renderJournal();
  showToast("Уровень откатан: " + (char.level||1) + " → " + (restored.level||1), "success");
  closeLevelUpModal();
  updateLevelDownVisibility();
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
if (window.AppLog) AppLog.action("hp", "отметка спасброска смерти: " + (type === "success" ? "успех" : "провал") + " #" + (index + 1));
saveToLocal();
loadDeathSaves();
}

function resetDeathSaves() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };
if (window.AppLog) AppLog.action("hp", "спасброски смерти сброшены");
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
// Дымка v5: ghost-след идёт к тому же значению медленнее (transition 900ms
// с задержкой 250ms в CSS) — при уроне остаётся красный «хвост», при лечении
// прячется под основной полосой.
const hpGhost = $("hp-bar-ghost");
if (hpGhost) hpGhost.style.width = pct + "%";
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

// FIN-7: чистые параметры спасброска концентрации (PHB стр.203–204).
// СЛ = max(10, урон/2 округл. вниз); модификатор = ТЕЛ-мод (+ мастерство при
// владении спасом ТЕЛ); черта «Боевой маг» (war_caster) даёт преимущество.
// Выделено в window-функцию для юнит-тестов (БЛОК 26).
function concSaveParams(char, dmg) {
  char = char || {};
  var stats = char.stats || {};
  var mod = (typeof getMod === "function") ? getMod(stats.con) : 0;
  if (char.saves && char.saves.con && typeof getProficiencyBonus === "function") {
    mod += getProficiencyBonus(char.level || 1);
  }
  var mode = "normal";
  if (Array.isArray(char.feats) && char.feats.some(function(f){ return f && f.id === "war_caster"; })) {
    mode = "adv";
  }
  return { dc: Math.max(10, Math.floor((Math.abs(dmg) || 0) / 2)), mod: mod, mode: mode };
}
window.concSaveParams = concSaveParams;

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
// FIN-7: спасбросок концентрации при уроне (PHB: СЛ = max(10, урон/2)).
// 0 ХП — авто-срыв без броска (оставлено). Иначе — модалка подтверждения →
// настоящий 3D-бросок через quickRoll с колбэком onResult (без скрытого Math.random).
if (delta < 0 && char.concentration) {
  var _concDmg = Math.abs(delta);
  if (hpCurrent <= 0) {
    endConcentration();
    showToast("💔 Концентрация потеряна — 0 ХП!", "error");
  } else if (typeof showConfirmModal === "function" && typeof quickRoll === "function") {
    var _cp = concSaveParams(char, _concDmg);
    var _concSpell = char.concentration;
    if (window.AppLog) AppLog.action("combat", "урон " + _concDmg + " → спасбросок концентрации «" + _concSpell + "» СЛ " + _cp.dc);
    showConfirmModal(
      "Концентрация под угрозой",
      "«" + _concSpell + "»: спасбросок ТЕЛ, СЛ " + _cp.dc + (_cp.mode === "adv" ? " (с преимуществом)" : ""),
      function() {
        quickRoll({
          label: "Концентрация СЛ " + _cp.dc,
          sides: 20,
          mod: _cp.mod,
          mode: _cp.mode,
          onResult: function(comp) {
            if (comp.total < _cp.dc) {
              endConcentration();
              showToast("💔 Концентрация «" + _concSpell + "» потеряна! " + comp.total + " < СЛ " + _cp.dc, "error");
            } else {
              showToast("🔮 Концентрация удержана! " + comp.total + " ≥ СЛ " + _cp.dc, "success");
            }
          }
        });
      },
      "🎲 Бросить спасбросок",
      { danger: false, icon: "🔮" }
    );
  }
}
saveToLocal();
updateHPDisplay();
// UI-11: pulse-ring на полосе + count-up числа ХП при фактическом изменении
if (actualDelta !== 0) {
  var hpWrap = document.querySelector(".hp-bar-wrap");
  if (hpWrap) {
    var pulseCls = actualDelta < 0 ? "hp-hit-dmg" : "hp-hit-heal";
    hpWrap.classList.remove("hp-hit-dmg", "hp-hit-heal");
    void hpWrap.offsetWidth; // рестарт анимации
    hpWrap.classList.add(pulseCls);
    setTimeout(function() { hpWrap.classList.remove(pulseCls); }, 550);
  }
  if (typeof animateCountUp === "function") {
    animateCountUp($("hp-display-current"), hpBefore, hpCurrent, 400);
  }
}
}

function addHPHistory(from, to, delta, source) {
if (window.AppLog) AppLog.action("hp", (delta > 0 ? "+" : "") + delta + " ХП (" + (source || "?") + "): " + from + " → " + to);
const now = new Date();
const time = now.getHours().toString().padStart(2,"0") + ":" + now.getMinutes().toString().padStart(2,"0");
// FEAT-1 доработка: привязка записи к персонажу — чтобы HP-историю можно
// было выгрузить/восстановить в составе конкретного персонажа.
hpHistory.unshift({ from: from, to: to, delta: delta, source: source, time: time,
  charId: (typeof currentId !== 'undefined' ? currentId : null) });
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
const val = parseInt(input?.value, 10) || 0;
if (val <= 0) return;
if (mode === "dmg") quickHP(-val, "Урон");
else quickHP(val, "Лечение");
if (input) input.value = "";
}

function applyHealInput() {
const input = $("hp-heal-input");
const val = parseInt(input?.value, 10) || 0;
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
char.combat.hpTemp = parseInt($("hp-temp")?.value, 10) || 0;
if (window.AppLog) AppLog.action("hp", "временные ХП: " + char.combat.hpTemp);
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
const sides = match ? parseInt(match[2], 10) : 8;
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
if (window.AppLog) AppLog.action("hp", "бросок спасброска смерти: " + msg, { roll: roll });
if (resultEl) {
resultEl.textContent = msg;
resultEl.className = "ds-roll-result " + (isSuccess ? "ds-result-ok" : "ds-result-fail");
}
saveToLocal();
loadDeathSaves();
}

