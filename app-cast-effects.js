// ============================================================
// app-cast-effects.js — Активные эффекты заклинаний: откат применённого,
// концентрация, панель активных эффектов и тик длительностей
// ============================================================

// CAST-3: откат «телесных» следов экземпляра каста. «Подмога» (hpMaxBonus) —
// минус бонус максимума; текущие ХП поджимаются к новому максимуму, но иначе
// не уменьшаются (RAW). Врем. ХП гаснут, только если пользователь не
// перезаписал их бо́льшим значением (tempHpApplied = грант заклинания).
// Возвращает true, если ХП-поля менялись (вызывающий обновляет экран).
function _revertCastInstanceBody(char, inst) {
  if (!char || !char.combat || !inst) return false;
  var touched = false;
  if (inst.hpMaxBonus) {
    char.combat.hpMax = Math.max(1, (parseInt(char.combat.hpMax, 10) || 0) - inst.hpMaxBonus);
    var cur = parseInt(char.combat.hpCurrent, 10) || 0;
    if (cur > char.combat.hpMax) char.combat.hpCurrent = char.combat.hpMax;
    touched = true;
  }
  if (inst.tempHpApplied != null) {
    var tmp = parseInt(char.combat.hpTemp, 10) || 0;
    if (tmp > 0 && tmp <= inst.tempHpApplied) { char.combat.hpTemp = 0; touched = true; }
  }
  return touched;
}

// CAST-1: снять эффекты, повешенные кастом заклинания spellName (конец/смена
// концентрации, ручное снятие). Рефкаунт: карточка уходит из char.effects, только
// если её не держит другой живой экземпляр activeSpellEffects. Возвращает true,
// если что-то сняли (вызывающий решает, перерендеривать ли).
function removeCastEffectsForSpell(char, spellName, reason) {
  if (!char || !char.activeSpellEffects || !char.activeSpellEffects.length) return false;
  var gone = char.activeSpellEffects.filter(function(i) { return i.spellName === spellName; });
  if (!gone.length) return false;
  char.activeSpellEffects = char.activeSpellEffects.filter(function(i) { return i.spellName !== spellName; });
  var held = {};
  char.activeSpellEffects.forEach(function(i) {
    (i.effectIds || []).forEach(function(id) { held[id] = true; });
  });
  var bodyTouched = false, hadSummon = false;
  gone.forEach(function(i) {
    if (_revertCastInstanceBody(char, i)) bodyTouched = true; // CAST-3: врем. ХП / hpMax
    if (i.summon) hadSummon = true; // CAST-5: призыв
    (i.effectIds || []).forEach(function(id) {
      if (held[id]) return;
      var idx = char.effects ? char.effects.indexOf(id) : -1;
      if (idx > -1) char.effects.splice(idx, 1);
    });
  });
  if (window.AppLog) AppLog.action("combat", "эффекты «" + spellName + "» сняты (" + (reason || "снятие") + ")");
  // CAST-5: призванное существо исчезает по правилам, но спутника из списка
  // не удаляем автоматически — игрок вычёркивает сам (мог договориться с ДМ).
  if (hadSummon && typeof showToast === "function") {
    showToast("✨ «" + spellName + "»: призванное существо исчезает — спутника удалите вручную", "info");
  }
  calculateAC();
  updateEffectsCount();
  updateStatusBar();
  if (typeof renderEffectsGrid === "function") renderEffectsGrid();
  if (typeof updateSpellActiveBadges === "function") updateSpellActiveBadges(); // CAST-6
  if (typeof renderBattleCastPanels === "function") renderBattleCastPanels(); // CAST-9: полоса повторов
  // CAST-10: чипы дебаффов на участниках снимаются вместе с экземпляром каста
  if (typeof removeBattleDebuffsForSpell === "function") removeBattleDebuffsForSpell(spellName);
  if (bodyTouched && typeof updateHPDisplay === "function") updateHPDisplay();
  saveToLocal();
  return true;
}

// CAST-3: полная очистка эффектов кастов — длинный отдых (app-hp.js confirmRest)
// зовёт её ВМЕСТО голого обнуления: реверт hpMax «Подмоги» обязан пройти ДО
// сброса hpCurrent = maxHp. Карточки экземпляров уходят из char.effects,
// концентрация гаснет. Без перерендеров — вызывающий обновляет экран сам
// (confirmRest делает loadCharacter).
function clearAllCastEffects(char) {
  if (!char) return;
  (char.activeSpellEffects || []).forEach(function(inst) {
    _revertCastInstanceBody(char, inst);
    (inst.effectIds || []).forEach(function(id) {
      var idx = char.effects ? char.effects.indexOf(id) : -1;
      if (idx > -1) char.effects.splice(idx, 1);
    });
  });
  char.activeSpellEffects = [];
  char.concentration = null;
  char.concentrationData = null;
  // CAST-10: чипы дебаффов живут в BATTLE_DATA, не в персонаже — снимаем явно
  if (typeof clearAllBattleDebuffs === "function") clearAllBattleDebuffs();
}

// CAST-2: экспирация эффектов каста по юнитам длительности — короткий отдых
// (1 час) снимает units ['round','minute'], часовые и дольше переживают
// («Доспехи мага» 8 ч корректно). Снятие карточек — через
// removeCastEffectsForSpell (рефкаунт); концентрация истёкшего заклинания
// гаснет. Возвращает имена снятых заклинаний (для сводки отдыха).
function expireCastEffectsByUnits(char, units, reason) {
  if (!char || !char.activeSpellEffects || !char.activeSpellEffects.length) return [];
  var expired = char.activeSpellEffects.filter(function(inst) {
    return units.indexOf(inst.unit) !== -1;
  });
  var names = [];
  expired.forEach(function(inst) {
    if (!removeCastEffectsForSpell(char, inst.spellName, reason || "экспирация")) return;
    names.push(inst.spellName);
    if (char.concentration === inst.spellName) {
      char.concentration = null;
      char.concentrationData = null;
      if (typeof updateConcentrationDisplay === "function") updateConcentrationDisplay();
    }
  });
  return names;
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
// Если другое заклинание — прервать старое (CAST-1: вместе с его эффектами)
if (char.concentration && char.concentration !== spellName) {
  showToast("🔮 Концентрация на «" + char.concentration + "» прервана", "warn");
  removeCastEffectsForSpell(char, char.concentration, "смена концентрации");
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
if (window.AppLog) AppLog.action("combat", spellName ? "концентрация: " + spellName : "концентрация снята");
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
if (window.AppLog && name) AppLog.action("combat", "концентрация на «" + name + "» завершена");
char.concentration = null;
if (name) removeCastEffectsForSpell(char, name, "конец концентрации"); // CAST-1
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
// CAST-9b: чип остатка концентрации в шапке трекера боя — обновляем здесь,
// чтобы он ловил любую смену концентрации (постановка, конец, прерывание).
if (typeof renderBattleCastPanels === "function") renderBattleCastPanels();
renderActiveEffectsFab(); // плавающий чип активных эффектов (ловит загрузку/смену концентрации)
}

// ── Плавающий чип активных эффектов заклинаний ──────────────────
// Виден на всех вкладках, пока в char.activeSpellEffects есть эффекты; тап
// раскрывает список со снятием (✕) и кнопками хода. Механику переиспользует:
// tickCastEffectsRound (тик длительностей), removeCastEffectsForSpell /
// endConcentration (снятие). Рендер дёргается там же, где updateSpellActiveBadges
// (каст/снятие/тик) и updateConcentrationDisplay (загрузка/концентрация).
function _aefRemainingLabel(inst) {
  // Раундовые/минутные заклинания имеют roundsLeft; часовые+ (roundsLeft==null)
  // показываем по unit/value — они не тикают кнопкой хода, снимаются ✕/отдыхом.
  if (inst.roundsLeft != null) return "⏳ " + inst.roundsLeft + " рд";
  switch (inst.unit) {
    case "hour": return (inst.value || "") + " ч";
    case "day": return (inst.value || "") + " дн";
    case "minute": return (inst.value || "") + " мин";
    case "round": return (inst.value || "") + " рд";
    case "untilLongRest": return "до отдыха";
    case "instant": return "мгновенно";
    case "special": return "особая";
    default: return "—";
  }
}
function _aefRowHtml(inst) {
  var esc = (typeof escapeHtml === "function") ? escapeHtml : function(s){ return s; };
  var name = esc(inst.spellName || "");
  var conc = inst.concentration ? '<span class="aef-row-conc" title="Концентрация">🔮</span> ' : '';
  var variant = inst.variantName ? ' <span class="aef-row-variant">· ' + esc(inst.variantName) + '</span>' : '';
  // Снятие по data-атрибуту (this.dataset.spell) — имя не попадает в JS-строку
  // onclick, поэтому спецсимволы («Слово Силы: смерть» и т.п.) не ломают кнопку.
  return '<div class="aef-row">' +
    '<span class="aef-row-name">' + conc + name + variant + '</span>' +
    '<span class="aef-row-time">' + esc(_aefRemainingLabel(inst)) + '</span>' +
    '<button class="aef-row-x" type="button" data-spell="' + esc(inst.spellName || "") +
      '" onclick="removeActiveEffect(this.dataset.spell)" title="Снять эффект" aria-label="Снять эффект">✕</button>' +
  '</div>';
}
function renderActiveEffectsFab() {
  var fab = document.getElementById("active-effects-fab");
  var panel = document.getElementById("active-effects-panel");
  if (!fab || !panel) return;
  var char = (typeof currentId !== "undefined" && currentId && typeof getCurrentChar === "function") ? getCurrentChar() : null;
  var list = (char && Array.isArray(char.activeSpellEffects)) ? char.activeSpellEffects : [];
  if (!list.length) {
    fab.setAttribute("hidden", "");
    panel.setAttribute("hidden", "");
    panel.classList.remove("aef-open");
    fab.setAttribute("aria-expanded", "false");
    _aefBindOutside(false);
    return;
  }
  fab.removeAttribute("hidden");
  var cnt = fab.querySelector(".aef-fab-count");
  if (cnt) cnt.textContent = list.length;
  var body = panel.querySelector(".aef-list");
  if (body) body.innerHTML = list.map(_aefRowHtml).join("");
}
function toggleActiveEffectsPanel() {
  var fab = document.getElementById("active-effects-fab");
  var panel = document.getElementById("active-effects-panel");
  if (!panel) return;
  var willOpen = panel.hasAttribute("hidden");
  if (willOpen) {
    renderActiveEffectsFab(); // свежий список на открытии
    panel.removeAttribute("hidden");
    panel.classList.add("aef-open");
    if (fab) fab.setAttribute("aria-expanded", "true");
    _aefBindOutside(true);
  } else {
    panel.setAttribute("hidden", "");
    panel.classList.remove("aef-open");
    if (fab) fab.setAttribute("aria-expanded", "false");
    _aefBindOutside(false);
  }
}
var _aefOutsideHandler = null;
function _aefBindOutside(on) {
  if (on) {
    if (_aefOutsideHandler) return;
    _aefOutsideHandler = function(e) {
      var panel = document.getElementById("active-effects-panel");
      var fab = document.getElementById("active-effects-fab");
      if (!panel) return;
      if (panel.contains(e.target) || (fab && fab.contains(e.target))) return;
      panel.setAttribute("hidden", "");
      panel.classList.remove("aef-open");
      if (fab) fab.setAttribute("aria-expanded", "false");
      _aefBindOutside(false);
    };
    // Отложенная привязка — иначе тот же клик, что открыл панель, тут же закроет.
    setTimeout(function() { document.addEventListener("click", _aefOutsideHandler); }, 0);
  } else if (_aefOutsideHandler) {
    document.removeEventListener("click", _aefOutsideHandler);
    _aefOutsideHandler = null;
  }
}
function advanceActiveEffects(count) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !char.activeSpellEffects) return;
  var hasTicking = char.activeSpellEffects.some(function(i) { return i.roundsLeft != null; });
  if (!hasTicking) {
    showToast("⏳ Нет эффектов с раундовой длительностью", "info");
    return;
  }
  // tickCastEffectsRound сам снимет истёкшие, обновит бейджи/сетку/чип и сохранит.
  if (typeof tickCastEffectsRound === "function") tickCastEffectsRound(count);
}
function removeActiveEffect(spellName) {
  if (!currentId || !spellName) return;
  var char = getCurrentChar();
  if (!char || !char.activeSpellEffects) return;
  var inst = char.activeSpellEffects.find(function(i) { return i.spellName === spellName; });
  if (!inst) return;
  // Концентрационный эффект снимаем через endConcentration — иначе char.concentration
  // останется висеть (removeCastEffectsForSpell его не чистит). Обе ветки в итоге
  // зовут renderActiveEffectsFab (через updateSpellActiveBadges/updateConcentrationDisplay).
  if (inst.concentration && char.concentration === spellName) {
    endConcentration();
  } else {
    removeCastEffectsForSpell(char, spellName, "снято вручную");
    showToast("✨ «" + spellName + "» снято", "info");
  }
}
