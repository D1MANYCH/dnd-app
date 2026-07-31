// ============================================================
// app-conditions.js — Сопротивления, иммунитеты и уязвимости,
// состояния и истощение, эффекты персонажа
// ============================================================

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
    { key: "resistances", title: "Сопротивление", sub: "½", cssClass: "res", icon: "" + dndIcoHtml("shield", 13) + "" },
    { key: "immunities", title: "Иммунитет", sub: "0", cssClass: "imm", icon: "" + dndIcoHtml("ban", 13) + "" },
    { key: "vulnerabilities", title: "Уязвимость", sub: "×2", cssClass: "vul", icon: "" + dndIcoHtml("alert", 13) + "" }
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
        '<button type="button" class="res-tag-x" aria-label="Убрать" onclick="removeResistance(\'' + cat.key + '\',' + i + ')">✕</button>' +
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

var _condFilter = { q: "", activeOnly: false };
function _condMatches(cond, q) {
  if (!q) return true;
  q = q.toLowerCase();
  return (cond.name || "").toLowerCase().indexOf(q) !== -1 || (cond.desc || "").toLowerCase().indexOf(q) !== -1;
}
function setConditionsSearch(v) { _condFilter.q = v || ""; renderConditionsGrid(); }
function toggleConditionsActiveOnly() {
  _condFilter.activeOnly = !_condFilter.activeOnly;
  var btn = $("conditions-active-only");
  if (btn) btn.classList.toggle("active", _condFilter.activeOnly);
  renderConditionsGrid();
}
function renderConditionsGrid() {
  const grid = $("conditions-grid");
  if (!grid) return;
  const char = currentId ? getCurrentChar() : null;
  const activeSet = (char && char.conditions) ? char.conditions : [];
  grid.innerHTML = "";
  // E24-1: набор состояний по редакции персонажа (2024 переписал эффекты); фолбэк 2014.
  var condSet = (typeof edData === "function") ? edData(char).CONDITIONS : CONDITIONS;
  var baseConditions = condSet.filter(function(c) { return c.id.indexOf("exhaustion_") === -1; });
  // активные сначала
  baseConditions = baseConditions.slice().sort(function(a, b) {
    var aa = activeSet.indexOf(a.id) !== -1 ? 0 : 1;
    var bb = activeSet.indexOf(b.id) !== -1 ? 0 : 1;
    if (aa !== bb) return aa - bb;
    return stripLeadingEmoji(a.name).localeCompare(stripLeadingEmoji(b.name), 'ru');
  });
  var any = false;
  baseConditions.forEach(function(condition) {
    var isActive = activeSet.indexOf(condition.id) !== -1;
    if (_condFilter.activeOnly && !isActive) return;
    if (!_condMatches(condition, _condFilter.q)) return;
    any = true;
    const item = document.createElement("div");
    item.className = "condition-item" + (condition.type ? " " + condition.type : "") + (isActive ? " active" : "");
    item.id = "condition-" + condition.id;
    item.onclick = function() { toggleCondition(condition.id); };
    item.innerHTML = getConditionIcon(condition.id) + "<div class=\"condition-name\"><span>" + escapeHtml(stripLeadingEmoji(condition.name)) + "</span></div><div class=\"condition-desc\">" + escapeHtml(condition.desc) + "</div><button type=\"button\" class=\"condition-expand\" onclick=\"toggleConditionDesc(event,this)\">Подробнее</button>";
    grid.appendChild(item);
  });
  // FB-2: «Подробнее» только у карточек с реально обрезанным (line-clamp) описанием.
  // scrollHeight требует, чтобы секция была не display:none — детект повторяется
  // при switchTab('sheet') и при раскрытии аккордеона (off-screen карточки меряются нормально).
  // setTimeout, а не rAF: rAF приостанавливается в фоновой вкладке → детект бы не сработал.
  setTimeout(detectConditionOverflow, 50);
  if (!any) {
    var empty = document.createElement("div");
    empty.className = "filter-empty";
    empty.textContent = "Ничего не найдено";
    grid.appendChild(empty);
  }
}
// FB-2: раскрыть/свернуть длинное описание (stopPropagation — клик по карточке = toggleCondition)
function toggleConditionDesc(e, btn) {
  if (e) e.stopPropagation();
  var item = btn.closest(".condition-item");
  if (!item) return;
  var expanded = item.classList.toggle("expanded");
  btn.textContent = expanded ? "Свернуть" : "Подробнее";
}
// FB-2: помечаем .has-more карточки, чьё описание реально обрезано line-clamp.
// Add-only + пропуск раскрытых (clamp снят → мерить нельзя). scrollHeight валиден и для
// off-screen карточек — важно лишь чтобы секция была не display:none (видимая вкладка + открытый аккордеон).
function detectConditionOverflow() {
  var grid = document.getElementById("conditions-grid");
  if (!grid) return;
  grid.querySelectorAll(".condition-item").forEach(function(it) {
    if (it.classList.contains("expanded")) return;
    var d = it.querySelector(".condition-desc");
    if (d && d.scrollHeight - d.clientHeight > 2) it.classList.add("has-more");
  });
}
function initConditions() {
const grid = $("conditions-grid");
if (!grid) return;
// Панель фильтров (один раз, перед grid)
var host = grid.parentNode;
if (host && !$("conditions-filter-bar")) {
  var bar = document.createElement("div");
  bar.id = "conditions-filter-bar";
  bar.className = "filter-bar";
  bar.innerHTML =
    '<input type="text" class="filter-search" id="conditions-search" placeholder="🔍 Поиск состояния…" oninput="setConditionsSearch(this.value)">' +
    '<button type="button" class="filter-chip" id="conditions-active-only" onclick="toggleConditionsActiveOnly()">Только активные</button>';
  host.insertBefore(bar, grid);
}
renderConditionsGrid();
// Блок истощения — рядом с grid, чтобы перерендер grid его не стирал
if (host && !host.querySelector('.exhaustion-block')) {
  var exhBlock = document.createElement("div");
  exhBlock.className = "exhaustion-block";
  exhBlock.innerHTML =
    '<div class="exhaustion-header">' +
      '<span class="exhaustion-title">' + getConditionIcon('exhaustion') + '<span>Истощение</span></span>' +
      '<div class="exhaustion-controls">' +
        '<button class="exhaustion-btn" onclick="adjustExhaustion(-1)">−</button>' +
        '<span class="exhaustion-level" id="exhaustion-level">0</span>' +
        '<button class="exhaustion-btn" onclick="adjustExhaustion(1)">+</button>' +
      '</div>' +
    '</div>' +
    '<div class="exhaustion-desc" id="exhaustion-desc"></div>';
  host.appendChild(exhBlock);
}
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
if (window.AppLog && next !== current) AppLog.action("combat", "истощение: " + current + " → " + next);
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
var titleImg = document.querySelector('.exhaustion-title .condition-icon-svg');
if (titleImg) titleImg.src = 'assets/conditions/exhaustion_' + (lvl > 0 ? lvl : 1) + '.webp';
if (descEl) {
  if (lvl === 0) descEl.textContent = "";
  else {
    // E24-1: описание степени истощения — из набора состояний редакции персонажа.
    var _cs = (typeof edData === "function") ? edData(char).CONDITIONS : CONDITIONS;
    var exhCond = _cs.find(function(c) { return c.id === "exhaustion_" + lvl; });
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
if (window.AppLog) AppLog.action("combat", "состояние " + conditionId + (index > -1 ? ": снято" : ": добавлено"));
updateConditionsCount();
updateStatusBar();
calculateAC();
saveToLocal();
if (typeof renderConditionsGrid === "function") renderConditionsGrid();
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
if (typeof renderConditionsGrid === "function") renderConditionsGrid();
updateExhaustionDisplay();
updateConditionsCount();
updateStatusBar();
}
var _fxFilter = { q: "", type: "all", activeOnly: false };
var EFFECT_CATEGORY_LABELS = {
  armor: '🛡️ Броня и КД',
  spell: '✨ Заклинания',
  class: '⚡ Классовые умения',
  other: '✨ Прочее'
};
function _fxMatches(fx, q) {
  if (!q) return true;
  q = q.toLowerCase();
  return (fx.name || "").toLowerCase().indexOf(q) !== -1 || (fx.desc || "").toLowerCase().indexOf(q) !== -1;
}
function setEffectsSearch(v) { _fxFilter.q = v || ""; renderEffectsGrid(); }
function setEffectsType(t) {
  _fxFilter.type = t;
  ["all","buff","debuff"].forEach(function(k){
    var el = $("effects-type-" + k);
    if (el) el.classList.toggle("active", k === t);
  });
  renderEffectsGrid();
}
function toggleEffectsActiveOnly() {
  _fxFilter.activeOnly = !_fxFilter.activeOnly;
  var btn = $("effects-active-only");
  if (btn) btn.classList.toggle("active", _fxFilter.activeOnly);
  renderEffectsGrid();
}
function renderEffectsGrid() {
  const grid = $("effects-grid");
  if (!grid) return;
  const char = currentId ? getCurrentChar() : null;
  const activeSet = (char && char.effects) ? char.effects : [];
  // CAST-1: карточкам с живым экземпляром каста показываем остаток в раундах
  // (тикать начнёт трекер боя в CAST-2; часовые длительности не тикают — без остатка)
  // CAST-8a: выбранный при касте вариант («Огонь», «Тёплый щит», …) — той же строкой
  var _castLeft = {}, _castVar = {};
  if (char && char.activeSpellEffects) {
    char.activeSpellEffects.forEach(function(inst) {
      (inst.effectIds || []).forEach(function(id) {
        if (inst.roundsLeft != null) _castLeft[id] = inst.roundsLeft;
        if (inst.variantName) _castVar[id] = inst.variantName;
      });
    });
  }
  grid.innerHTML = "";
  // Сгруппировать
  var groups = { armor: [], spell: [], class: [], other: [] };
  EFFECTS_DATA.forEach(function(fx) {
    if (_fxFilter.type === 'buff' && fx.type !== 'buff') return;
    if (_fxFilter.type === 'debuff' && fx.type !== 'debuff') return;
    if (!_fxMatches(fx, _fxFilter.q)) return;
    var isActive = activeSet.indexOf(fx.id) !== -1;
    if (_fxFilter.activeOnly && !isActive) return;
    var cat = groups[fx.category] ? fx.category : 'other';
    groups[cat].push(fx);
  });
  // Внутри группы: активные сначала, дальше по имени
  Object.keys(groups).forEach(function(cat) {
    groups[cat].sort(function(a, b) {
      var aa = activeSet.indexOf(a.id) !== -1 ? 0 : 1;
      var bb = activeSet.indexOf(b.id) !== -1 ? 0 : 1;
      if (aa !== bb) return aa - bb;
      return stripLeadingEmoji(a.name).localeCompare(stripLeadingEmoji(b.name), 'ru');
    });
  });
  var any = false;
  ['armor','spell','class','other'].forEach(function(cat) {
    var list = groups[cat];
    if (!list.length) return;
    any = true;
    var header = document.createElement("div");
    header.className = "effects-group-header";
    header.textContent = EFFECT_CATEGORY_LABELS[cat] + ' · ' + list.length;
    grid.appendChild(header);
    list.forEach(function(effect) {
      var isActive = activeSet.indexOf(effect.id) !== -1;
      var item = document.createElement("div");
      item.className = "effect-item" + (effect.type ? " " + effect.type : "") + (isActive ? " active" : "");
      item.id = "effect-" + effect.id;
      item.onclick = function() { toggleEffect(effect.id); };
      var durText = effect.duration;
      if (isActive && _castVar[effect.id]) durText += " · " + dndIcoHtml("sparkle", 12) + " " + _castVar[effect.id];
      if (isActive && _castLeft[effect.id] != null) durText += " · ⏳ осталось " + _castLeft[effect.id] + " рд";
      item.innerHTML =
        "<div class=\"effect-name\">" + escapeHtml(effect.name) + "</div>" +
        "<div class=\"effect-desc\">" + escapeHtml(effect.desc) + "</div>" +
        "<div class=\"effect-duration\">" + escapeHtml(durText) + "</div>" +
        "<span class=\"effect-type " + effect.type + "\">" + (effect.type === 'buff' ? '' + dndIcoHtml("sparkle", 12) + ' Бафф' : '' + dndIcoHtml("skull", 12) + ' Дебафф') + "</span>";
      grid.appendChild(item);
    });
  });
  if (!any) {
    var empty = document.createElement("div");
    empty.className = "filter-empty";
    empty.textContent = "Ничего не найдено";
    grid.appendChild(empty);
  }
}
function initEffects() {
  const grid = $("effects-grid");
  if (!grid) return;
  var host = grid.parentNode;
  if (host && !$("effects-filter-bar")) {
    var bar = document.createElement("div");
    bar.id = "effects-filter-bar";
    bar.className = "filter-bar";
    bar.innerHTML =
      '<input type="text" class="filter-search" id="effects-search" placeholder="🔍 Поиск эффекта…" oninput="setEffectsSearch(this.value)">' +
      '<div class="filter-chip-group">' +
        '<button type="button" class="filter-chip active" id="effects-type-all" onclick="setEffectsType(\'all\')">Все</button>' +
        '<button type="button" class="filter-chip" id="effects-type-buff" onclick="setEffectsType(\'buff\')">' + dndIcoHtml("sparkle", 13) + ' Баффы</button>' +
        '<button type="button" class="filter-chip" id="effects-type-debuff" onclick="setEffectsType(\'debuff\')">' + dndIcoHtml("skull", 13) + ' Дебаффы</button>' +
      '</div>' +
      '<button type="button" class="filter-chip" id="effects-active-only" onclick="toggleEffectsActiveOnly()">Только активные</button>';
    host.insertBefore(bar, grid);
  }
  renderEffectsGrid();
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
// CAST-1: ручное снятие карточки убирает и экземпляры каста, которые её держат
// (двусторонняя синхронизация с applyCastEffects)
if (char.activeSpellEffects && char.activeSpellEffects.length) {
  char.activeSpellEffects = char.activeSpellEffects.filter(function(inst) {
    return (inst.effectIds || []).indexOf(effectId) === -1;
  });
}
if (effectEl) effectEl.classList.remove("active");
} else {
char.effects.push(effectId);
if (effectEl) effectEl.classList.add("active");
}
if (window.AppLog) AppLog.action("combat", "эффект " + effectId + (index > -1 ? ": снят" : ": добавлен"));
updateEffectsCount();
updateStatusBar();
calculateAC();
saveToLocal();
if (typeof renderEffectsGrid === "function") renderEffectsGrid();
if (typeof updateSpellActiveBadges === "function") updateSpellActiveBadges(); // CAST-6: ручное снятие убрало экземпляры
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
if (typeof renderEffectsGrid === "function") renderEffectsGrid();
updateEffectsCount();
updateStatusBar();
}
