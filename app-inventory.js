// ============================================================
// app-inventory.js — Инвентарь: предметы, сумки, оружие,
// пресеты, вес снаряжения
// ============================================================

function filterInventory(category, btn) {
currentFilterCategory = category;
document.querySelectorAll(".inventory-filters button").forEach(function(b) { b.classList.remove("active"); });
if (btn) btn.classList.add("active");
renderInventory();
}
// ── Slot system ──
// OSR slot system: все предметы занимают слоты
// weapon: 1h=1, 2h=2 | armor=3 | potion=1/2 | scroll=1 | tool/other=1
var ITEM_SLOTS = { weapon:1, armor:3, potion:0.5, scroll:1, tool:1, material:1, other:1 };
// BUILD-FIX-9 (rev3): местоположение предмета. Влияет на UX-тег и на расчёт слотов
// при «снятом» рюкзаке (только location:"backpack" выпадают из подсчёта/доступа).
var LOCATION_META = {
  backpack: { icon:"🎒", label:"в рюкзаке" },
  worn:     { icon:"🧥", label:"на теле" },
  wielded:  { icon:"✋", label:"в руке" },
  belt:     { icon:"🪪", label:"на поясе" },
  outside:  { icon:"🪢", label:"снаружи рюкзака" },
  stored:   { icon:"📦", label:"в лагере" }
};
function _isBackpackOff(char) {
  return !!(char && char.equipState && char.equipState.backpackOff);
}
function _isItemActive(char, item) {
  // Предмет «активен» (доступен/занимает слот) если рюкзак надет ИЛИ предмет НЕ из рюкзака.
  if (!_isBackpackOff(char)) return true;
  return (item && item.location && item.location !== "backpack");
}
function toggleBackpackOff() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  if (!char.equipState) char.equipState = { backpackOff: false };
  char.equipState.backpackOff = !char.equipState.backpackOff;
  if (window.AppLog) AppLog.action("inventory", char.equipState.backpackOff ? "рюкзак снят" : "рюкзак надет");
  saveToLocal();
  renderInventory();
}
var BELT_LABELS = { weapon1:"Оружие 1", weapon2:"Оружие 2", rope:"Верёвка", shield:"Щит" };
var POUCH_STR_REQ = [8, 12, 16, 18]; // СИЛ для каждого мешочка
var POUCH_MAX = 500; // монет в мешочке

function getSlotsTotal(str) {
  // Base 10 slots + 1 per 2 STR above 10, min 6
  var base = 10;
  if (str >= 16) base = 15;
  else if (str >= 13) base = 12;
  else if (str >= 10) base = 10;
  else base = 7;
  return base;
}

function calcUsedSlots(char) {
  var used = 0;
  Object.keys(char.inventory).forEach(function(cat) {
    if (!Array.isArray(char.inventory[cat])) return;
    (char.inventory[cat] || []).forEach(function(item) {
      // BUILD-FIX-9 (rev3): если рюкзак снят, вещи в нём не занимают слотов.
      if (!_isItemActive(char, item)) return;
      var slotsEach = (item.slots !== undefined && item.slots !== null && item.slots !== "")
        ? parseFloat(item.slots)
        : (ITEM_SLOTS[cat] !== undefined ? ITEM_SLOTS[cat] : 1);
      used += slotsEach * (item.qty || 1);
    });
  });
  return used;
}

function updateSlotsDisplay() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var str = char.stats.str || 10;
  var total = getSlotsTotal(str);
  var used = calcUsedSlots(char);
  var usedEl = $("inv-slots-used");
  var totalEl = $("inv-slots-total");
  var hintEl = $("inv-slots-str-hint");
  var fillEl = $("weight-fill");
  var owEl = $("overweight-warning");
  var owAmt = $("overweight-amount");
  if (usedEl) usedEl.textContent = used % 1 === 0 ? used : used.toFixed(1);
  if (totalEl) totalEl.textContent = total;
  if (hintEl) hintEl.textContent = "СИЛ: " + str;
  if (fillEl) {
    var pct = Math.min(100, (used / total) * 100);
    fillEl.style.width = pct + "%";
    fillEl.className = "inv-weight-fill" + (used > total ? " overweight" : used > total * 0.75 ? " warning" : "");
  }
  if (owEl) {
    if (used > total) {
      owEl.style.display = "flex";
      if (owAmt) owAmt.textContent = (used - total).toFixed(1);
    } else {
      owEl.style.display = "none";
    }
  }
  // update item slot tags
  if (usedEl) usedEl.className = "inv-slots-used" + (used > total ? " inv-slots-over" : "");
  renderPouches();
  updateAttuneCount();
  }





function renderPouches() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var str = char.stats.str || 10;
  var container = $("inv-pouches");
  if (!container) return;
  var totalCoins = (parseInt($("coin-cp")?.value, 10)||0) +
    (parseInt($("coin-sp")?.value, 10)||0) +
    (parseInt($("coin-ep")?.value, 10)||0) +
    (parseInt($("coin-gp")?.value, 10)||0) +
    (parseInt($("coin-pp")?.value, 10)||0);
  var html = '<div class="inv-pouches-row">';
  POUCH_STR_REQ.forEach(function(req, i) {
    var unlocked = str >= req;
    var pct = unlocked ? Math.min(100, (totalCoins / (POUCH_MAX * (i+1))) * 100) : 0;
    html += '<div class="inv-pouch' + (unlocked ? "" : " inv-pouch-locked") + '">';
    html += '<div class="inv-pouch-icon">' + (unlocked ? "👝" : "🔒") + '</div>';
    html += '<div class="inv-pouch-req">СИЛ ' + req + '+</div>';
    if (unlocked) {
      html += '<div class="inv-pouch-cap">' + (POUCH_MAX * (i+1)) + ' мон.</div>';
    }
    html += '</div>';
  });
  html += '</div>';
  // capacity hint
  var availPouches = POUCH_STR_REQ.filter(function(r){ return str >= r; }).length;
  var maxCoins = availPouches * POUCH_MAX;
  html += '<div class="inv-pouches-hint">';
  if (availPouches > 0) {
    html += '🎒 ' + availPouches + ' мешочк' + (availPouches===1?"а":availPouches<5?"а":"ов") + ' · до <strong>' + maxCoins + '</strong> монет';
    if (totalCoins > maxCoins) html += ' · <span style="color:var(--danger-color)">⚠️ не унести ' + (totalCoins - maxCoins) + ' монет</span>';
  } else {
    html += '⚠️ Нет мешочков — нужна СИЛ 8+';
  }
  html += '</div>';
  container.innerHTML = html;
}

function renderInventory() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const container = $("inventory-list");
if (!container) return;
if (firstLoadSkeleton("inv", "inventory-list", 5, "list", renderInventory)) return;
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
updateInventoryWeight();
updateSlotsDisplay();
return;
}
allItems.forEach(function(data, _idx) {
const item = data.item;
const icon = ITEM_ICONS[data.category];
const totalWeight = (item.weight * (item.qty || 1)).toFixed(1);
const catName = CATEGORY_NAMES[data.category];
var _slotsEach = (item.slots !== undefined && item.slots !== null && item.slots !== "")
  ? parseFloat(item.slots)
  : (ITEM_SLOTS[data.category] !== undefined ? ITEM_SLOTS[data.category] : 1);
var itemSlots = _slotsEach * (item.qty || 1);
var slotsLabel = itemSlots % 1 !== 0 ? itemSlots.toFixed(1) + " сл." : itemSlots + " сл.";
// BUILD-FIX-9 (rev3): тег местоположения и приглушение если рюкзак снят и предмет в нём
var _locKey = item.location || "";
var _locMeta = LOCATION_META[_locKey];
var _locTagHtml = _locMeta ? '<span class="inv-meta-tag inv-loc-tag" title="' + _locMeta.label + '">' + _locMeta.icon + " " + _locMeta.label + '</span>' : '';
// FIN-6: бейдж настройки для магпредметов (attunable) — «⚙ настроен» / «⚙ не настроен»
var _attuneTagHtml = item.attunable
  ? '<span class="inv-meta-tag inv-attune-tag' + (item.attuned ? ' on' : '') + '" title="Настройка магического предмета">⚙ ' + (item.attuned ? 'настроен' : 'не настроен') + '</span>'
  : '';
var _attuneBtnHtml = item.attunable
  ? '<button class="inv-attune-btn' + (item.attuned ? ' attuned' : '') + '" onclick="event.stopPropagation(); toggleAttuned(\'' + data.category + '\',' + data.index + ')">⚙ ' + (item.attuned ? 'Снять настройку' : 'Настроить') + '</button>'
  : '';
// FIN-8: заряды предмета — бейдж «⚡ N/M» в мете + счётчик с кнопками ± в actions
var _maxCh = parseInt(item.maxCharges, 10) || 0;
var _curCh = _maxCh > 0 ? Math.max(0, Math.min(_maxCh, parseInt(item.charges, 10) || 0)) : 0;
var _chargesTagHtml = _maxCh > 0
  ? '<span class="inv-meta-tag inv-charges-tag' + (_curCh === 0 ? ' empty' : '') + '" title="Заряды' + (item.recharge === "none" ? " — не восстанавливаются" : " — восстанавливаются на длинном отдыхе") + '">⚡ ' + _curCh + '/' + _maxCh + '</span>'
  : '';
var _chargesCtrlHtml = _maxCh > 0
  ? '<span class="inv-charges-ctrl">' +
      '<button class="inv-charge-btn" onclick="event.stopPropagation(); adjustItemCharges(\'' + data.category + '\',' + data.index + ',-1)"' + (_curCh <= 0 ? ' disabled' : '') + '>−</button>' +
      '<span class="inv-charges-label">⚡ ' + _curCh + '/' + _maxCh + '</span>' +
      '<button class="inv-charge-btn" onclick="event.stopPropagation(); adjustItemCharges(\'' + data.category + '\',' + data.index + ',1)"' + (_curCh >= _maxCh ? ' disabled' : '') + '>+</button>' +
    '</span>'
  : '';
var _stowed = (_isBackpackOff(char) && _locKey === "backpack");
const div = document.createElement("div");
div.className = "inv-item rise" + (_stowed ? " inv-item-stowed" : "");
div.style.setProperty("--i", Math.min(_idx, 10)); // Дымка v5: stagger-появление
if (_stowed) div.style.opacity = "0.45";
div.dataset.category = data.category;
div.dataset.index = data.index;
div.innerHTML =
  '<div class="inv-item-main" onclick="toggleInvItem(this)">' +
    '<div class="inv-item-icon">' + icon + '</div>' +
    '<div class="inv-item-info">' +
      '<div class="inv-item-name">' + escapeHtml(item.name) + (_stowed ? ' <span style="color:var(--muted);font-size:11px;">(в снятом рюкзаке)</span>' : '') + '</div>' +
      '<div class="inv-item-meta">' +
        '<span class="inv-meta-tag">' + (item.qty || 1) + ' шт.</span>' +
        '<span class="inv-meta-tag">⚖️ ' + totalWeight + ' фнт</span>' +
        '<span class="inv-meta-tag inv-cat-tag">' + catName + '</span>' +
        '<span class="inv-meta-tag inv-slot-tag">' + slotsLabel + '</span>' +
        _locTagHtml +
        _attuneTagHtml +
        _chargesTagHtml +
      '</div>' +
    '</div>' +
    '<span class="inv-drag-handle" title="Перетащите, чтобы переместить предмет">⠿</span>' +
    '<span class="inv-item-arrow">▶</span>' +
  '</div>' +
  '<div class="inv-item-body">' +
    (item.desc ? '<div class="inv-item-desc">' + escapeHtml(item.desc) + '</div>' : '') +
    '<div class="inv-item-actions">' +
      _chargesCtrlHtml +
      _attuneBtnHtml +
      '<button class="inv-edit-btn" onclick="event.stopPropagation(); editItemDirect(\'' + data.category + '\',' + data.index + ')">✏️ Изменить</button>' +
      '<button class="inv-del-btn" onclick="event.stopPropagation(); deleteItemDirect(\'' + data.category + '\',' + data.index + ')">🗑 Удалить</button>' +
    '</div>' +
  '</div>';
div.setAttribute("draggable", "true");
div.classList.add("inv-draggable");
(function(cat, idx, el) {
  el.addEventListener("dragstart", function(ev) { invDragStart(ev, cat, idx); });
  el.addEventListener("dragover", function(ev) { invDragOver(ev, cat, idx); });
  el.addEventListener("dragleave", function(ev) { invDragLeave(ev, el); });
  el.addEventListener("drop", function(ev) { invDrop(ev); });
  el.addEventListener("dragend", function(ev) { invDragEnd(); });
  el.addEventListener("touchstart", function(ev) { invTouchStart(ev, cat, idx, el); }, { passive: true });
})(data.category, data.index, div);
container.appendChild(div);
});
_invDndInit();
updateInventoryWeight();
updateSlotsDisplay();
// BUILD-FIX-9 (rev3): синхронизируем кнопку «Снять/Надет рюкзак»
var _btn = document.getElementById("inv-backpack-toggle");
if (_btn) {
  var _off = _isBackpackOff(char);
  _btn.textContent = _off ? "🎒 Снят" : "🎒 Надет";
  _btn.style.background = _off ? "var(--danger,#c0392b)" : "transparent";
  _btn.style.color = _off ? "#fff" : "var(--text)";
}
}
function toggleInvItem(mainEl) {
const item = mainEl.closest(".inv-item");
if (!item) return;
item.classList.toggle("expanded");
const arrow = mainEl.querySelector(".inv-item-arrow");
if (arrow) arrow.textContent = item.classList.contains("expanded") ? "▼" : "▶";
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
    if (window.AppLog) AppLog.action("inventory", "предмет удалён: " + name, { cat: category });
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
const cp = parseInt(char.coins.cp, 10) || 0;
const sp = parseInt(char.coins.sp, 10) || 0;
const ep = parseInt(char.coins.ep, 10) || 0;
const gp = parseInt(char.coins.gp, 10) || 0;
const pp = parseInt(char.coins.pp, 10) || 0;
const coinWeight = (cp + sp + ep + gp + pp) / 50;
totalWeight += coinWeight;
totalWeight = parseFloat(totalWeight.toFixed(1));
const strMod = char.stats.str || 10;
const carryCapacity = strMod * 15;
// Update weight display
const totalWeightEl = $("total-weight");
if (totalWeightEl) totalWeightEl.textContent = totalWeight;
const capNumEl = $("carry-capacity-num");
if (capNumEl) capNumEl.textContent = carryCapacity;
// Legacy element for compatibility
const carryCapacityEl = $("carry-capacity");
if (carryCapacityEl) carryCapacityEl.textContent = "Грузоподъёмность: " + carryCapacity + " фнт";
// Progress bar
const fillEl = $("weight-fill");
if (fillEl) {
  const pct = Math.min(100, (totalWeight / carryCapacity) * 100);
  fillEl.style.width = pct + "%";
  fillEl.className = "inv-weight-fill" + (totalWeight > carryCapacity ? " overweight" : totalWeight > carryCapacity * 0.75 ? " warning" : "");
}
// Overweight badge
const owEl = $("overweight-warning");
const owAmtEl = $("overweight-amount");
if (owEl) {
  if (totalWeight > carryCapacity) {
    owEl.style.display = "flex";
    if (owAmtEl) owAmtEl.textContent = (totalWeight - carryCapacity).toFixed(1);
  } else {
    owEl.style.display = "none";
  }
}
// Coin weight — подпись «Вес:» обязательна: без неё число читается как сумма
const cwEl = $("coin-weight");
if (cwEl) cwEl.textContent = "Вес: " + coinWeight.toFixed(2) + " фнт";
}
// FIN-6: настройка магпредметов (лимит 3). countAttuned — чистая (без DOM/currentId).
function countAttuned(char) {
  if (!char || !char.inventory) return 0;
  var n = 0;
  Object.keys(char.inventory).forEach(function(cat) {
    if (!Array.isArray(char.inventory[cat])) return;
    char.inventory[cat].forEach(function(it) { if (it && it.attuned) n++; });
  });
  return n;
}
// Есть ли у персонажа хоть один attunable-предмет (для показа счётчика/подсказок).
function _hasAttunable(char) {
  if (!char || !char.inventory) return false;
  return Object.keys(char.inventory).some(function(cat) {
    return Array.isArray(char.inventory[cat]) && char.inventory[cat].some(function(it){ return it && it.attunable; });
  });
}
// Переключить настройку предмета. 4-ю НЕ блокируем — только красный тост (правило-напоминание).
function toggleAttuned(category, index) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var item = char.inventory[category] && char.inventory[category][index];
  if (!item || !item.attunable) return;
  if (!item.attuned) {
    item.attuned = true;
    var n = countAttuned(char);
    if (n > 3) showToast("⚠ Лимит настройки 3 превышен (" + n + "/3)", "error");
    else showToast("⚙ Настроен: " + item.name + " (" + n + "/3)", "success");
  } else {
    item.attuned = false;
    showToast("⚙ Настройка снята: " + item.name, "info");
  }
  if (window.AppLog) AppLog.action("inventory", (item.attuned ? "настроен: " : "снята настройка: ") + item.name);
  saveToLocal();
  renderInventory();
}
// Обновить счётчик «⚙ N/3» в шапке вкладки (скрыт, если нет attunable-предметов и настроек).
function updateAttuneCount() {
  var el = document.getElementById("inv-attune-count");
  if (!el) return;
  var char = currentId ? getCurrentChar() : null;
  var n = char ? countAttuned(char) : 0;
  if (!char || (n === 0 && !_hasAttunable(char))) { el.style.display = "none"; return; }
  el.style.display = "";
  el.textContent = "⚙ " + n + "/3";
  el.classList.toggle("over", n > 3);
}
// FIN-8: изменить заряды предмета на delta (кламп 0..maxCharges). Не трогает qty.
function adjustItemCharges(category, index, delta) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var item = char.inventory[category] && char.inventory[category][index];
  if (!item) return;
  var max = parseInt(item.maxCharges, 10) || 0;
  if (max <= 0) return;
  var cur = Math.max(0, Math.min(max, parseInt(item.charges, 10) || 0));
  var next = Math.max(0, Math.min(max, cur + delta));
  if (next === cur) return;
  item.charges = next;
  if (window.AppLog) AppLog.action("inventory", "заряды: " + item.name + " " + next + "/" + max);
  saveToLocal();
  renderInventory();
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
const slotsInpEdit = $("new-item-slots");
if (slotsInpEdit) slotsInpEdit.value = (item.slots !== undefined && item.slots !== null) ? item.slots : "";
const locInpEdit = $("new-item-location");
if (locInpEdit) locInpEdit.value = item.location || "";
const attuneInpEdit = $("new-item-attune");
if (attuneInpEdit) attuneInpEdit.checked = !!item.attunable;
// FIN-8: заряды
var _chMaxEd = parseInt(item.maxCharges, 10) || 0;
const chInpEd = $("new-item-charges");
if (chInpEd) chInpEd.value = _chMaxEd > 0 ? (parseInt(item.charges, 10) || 0) : "";
const chMaxInpEd = $("new-item-maxcharges");
if (chMaxInpEd) chMaxInpEd.value = _chMaxEd > 0 ? _chMaxEd : "";
const rechInpEd = $("new-item-recharge");
if (rechInpEd) rechInpEd.value = item.recharge === "none" ? "none" : "dawn";
if (descEl) descEl.value = item.desc || "";
} else {
if (titleEl) titleEl.textContent = "Добавить предмет";
if (nameEl) nameEl.value = "";
if (qtyEl) qtyEl.value = 1;
if (weightEl) weightEl.value = 0;
const slotsInpNew = $("new-item-slots");
if (slotsInpNew) slotsInpNew.value = "";
const locInpNew = $("new-item-location");
if (locInpNew) locInpNew.value = "";
const attuneInpNew = $("new-item-attune");
if (attuneInpNew) attuneInpNew.checked = false;
// FIN-8: заряды — сброс
const chInpNew = $("new-item-charges");
if (chInpNew) chInpNew.value = "";
const chMaxInpNew = $("new-item-maxcharges");
if (chMaxInpNew) chMaxInpNew.value = "";
const rechInpNew = $("new-item-recharge");
if (rechInpNew) rechInpNew.value = "dawn";
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
const origCategory = document.getElementById("item-category")?.value || category;
const _slotRaw = $("item-slot-index")?.value; const slotIndex = (_slotRaw !== undefined && _slotRaw !== "" && _slotRaw !== null) ? parseInt(_slotRaw, 10) : -1;
const name = $("new-item-name")?.value?.trim() || "";
if (!name) { showToast("Введите название!", "warn"); return; }
const newItem = {
name: name,
qty: parseInt($("new-item-qty")?.value, 10) || 1,
weight: parseFloat($("new-item-weight")?.value) || 0,
slots: $("new-item-slots")?.value !== "" ? parseFloat($("new-item-slots")?.value) : undefined,
location: $("new-item-location")?.value || undefined,
desc: $("new-item-desc")?.value || ""
};
// FIN-6: настройка магпредмета. Чекбокс = attunable; состояние attuned сохраняем
// из старой записи при редактировании (снятие attunable гасит и attuned).
var _prevItem = (slotIndex >= 0 && char.inventory[origCategory]) ? char.inventory[origCategory][slotIndex] : null;
if ($("new-item-attune")?.checked) {
newItem.attunable = true;
if (_prevItem && _prevItem.attuned) newItem.attuned = true;
}
// FIN-8: заряды. maxCharges>0 включает механику; charges клампится 0..max
// (пусто → полный запас). recharge "none" отключает восстановление на отдыхе.
var _maxChIn = parseInt($("new-item-maxcharges")?.value, 10) || 0;
if (_maxChIn > 0) {
newItem.maxCharges = _maxChIn;
var _curRaw = $("new-item-charges")?.value;
var _curChIn = (_curRaw !== undefined && _curRaw !== "" && _curRaw !== null) ? (parseInt(_curRaw, 10) || 0) : _maxChIn;
newItem.charges = Math.max(0, Math.min(_maxChIn, _curChIn));
newItem.recharge = ($("new-item-recharge")?.value === "none") ? "none" : "dawn";
}
var _isEdit = !!(slotIndex >= 0 && char.inventory[origCategory] && char.inventory[origCategory][slotIndex]);
if (!char.inventory[category]) char.inventory[category] = [];
if (slotIndex >= 0 && char.inventory[origCategory] && char.inventory[origCategory][slotIndex]) {
// Редактирование существующего предмета
if (origCategory === category) {
// Категория не менялась — заменяем на месте
char.inventory[category][slotIndex] = newItem;
} else {
// Категория изменилась — удаляем из старой, добавляем в новую
// (раньше предмет дублировался: оставался в старой + копия в новой)
char.inventory[origCategory].splice(slotIndex, 1);
char.inventory[category].push(newItem);
}
} else {
char.inventory[category].push(newItem);
}
if (window.AppLog) AppLog.action("inventory", (_isEdit ? "предмет изменён: " : "предмет добавлен: ") + name, { cat: category, qty: newItem.qty });
saveToLocal();
closeItemModal();
renderInventory();
}

// REQ-4b: пикер магических предметов из каталога (magic-items.js, грузится лениво).
// Тип предмета каталога → категория инвентаря.
var MAGIC_TYPE_TO_CATEGORY = {
  weapon:"weapon", armor:"armor", shield:"armor", potion:"potion", scroll:"scroll",
  ring:"other", rod:"other", staff:"other", wand:"other", wondrous:"other"
};
var MAGIC_RARITY_ORDER = { common:0, uncommon:1, rare:2, very_rare:3, legendary:4, artifact:5 };

function openMagicCatalog() {
  if (typeof showToast === "function") showToast("Загружаем каталог…", "info");
  var ensure = (typeof window.ensureMagicItems === "function") ? window.ensureMagicItems() : Promise.resolve();
  ensure.then(function () {
    var modal = document.getElementById("magic-catalog-modal");
    if (modal) modal.classList.add("active");
    var s = document.getElementById("magic-catalog-search"); if (s) s.value = "";
    var t = document.getElementById("magic-catalog-type"); if (t) t.value = "";
    var r = document.getElementById("magic-catalog-rarity"); if (r) r.value = "";
    renderMagicCatalog();
    if (s) s.focus();
  }).catch(function (e) {
    if (window.__catchLog) window.__catchLog("magic-catalog:load", e);
    if (typeof showToast === "function") showToast("Не удалось загрузить каталог: " + (e && e.message ? e.message : e), "error");
  });
}
function closeMagicCatalog() {
  var modal = document.getElementById("magic-catalog-modal");
  if (modal) modal.classList.remove("active");
}
function renderMagicCatalog() {
  var items = window.MAGIC_ITEMS || [];
  var q = ((document.getElementById("magic-catalog-search") || {}).value || "").toLowerCase().trim();
  var ft = (document.getElementById("magic-catalog-type") || {}).value || "";
  var fr = (document.getElementById("magic-catalog-rarity") || {}).value || "";
  var R = window.MAGIC_ITEM_RARITY || {}, T = window.MAGIC_ITEM_TYPE || {};
  var filtered = items.filter(function (it) {
    if (ft && it.type !== ft) return false;
    if (fr && it.rarity !== fr) return false;
    if (q && it.name.toLowerCase().indexOf(q) === -1 && (it.nameEn || "").toLowerCase().indexOf(q) === -1) return false;
    return true;
  });
  filtered.sort(function (a, b) {
    var ra = MAGIC_RARITY_ORDER[a.rarity] || 0, rb = MAGIC_RARITY_ORDER[b.rarity] || 0;
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name, "ru");
  });
  var countEl = document.getElementById("magic-catalog-count");
  if (countEl) countEl.textContent = "Найдено: " + filtered.length + " из " + items.length;
  var listEl = document.getElementById("magic-catalog-list");
  if (!listEl) return;
  if (!filtered.length) { listEl.innerHTML = '<div class="magic-catalog-empty">Ничего не найдено</div>'; return; }
  listEl.innerHTML = filtered.map(function (it) {
    var attune = it.attune ? ' · ⚙ настройка' : '';
    return '<button type="button" class="magic-catalog-item" onclick="fillFromMagicItem(\'' + it.id + '\')">' +
      '<div class="mci-top"><span class="mci-name">' + escapeHtml(it.name) + '</span>' +
      '<span class="mci-rarity rarity-' + it.rarity + '">' + escapeHtml(R[it.rarity] || it.rarity) + '</span></div>' +
      '<div class="mci-meta">' + escapeHtml(T[it.type] || it.type) + attune + ' · ' + escapeHtml(it.nameEn || '') + '</div>' +
      '<div class="mci-desc">' + escapeHtml(it.desc || '') + '</div>' +
      '</button>';
  }).join("");
}
function fillFromMagicItem(id) {
  var items = window.MAGIC_ITEMS || [];
  var it = null;
  for (var i = 0; i < items.length; i++) { if (items[i].id === id) { it = items[i]; break; } }
  if (!it) return;
  var R = window.MAGIC_ITEM_RARITY || {};
  var nameEl = document.getElementById("new-item-name");
  var wEl = document.getElementById("new-item-weight");
  var dEl = document.getElementById("new-item-desc");
  var cEl = document.getElementById("new-item-category");
  if (nameEl) nameEl.value = it.name;
  if (wEl) wEl.value = (typeof it.weight === "number") ? it.weight : 0;
  if (cEl) cEl.value = MAGIC_TYPE_TO_CATEGORY[it.type] || "other";
  // FIN-6: перенос флага настройки из каталога в чекбокс модалки
  var aEl = document.getElementById("new-item-attune");
  if (aEl) aEl.checked = !!it.attune;
  // FIN-8: перенос зарядов из каталога (палочки/посохи/жезлы) — полный запас
  var _catCh = parseInt(it.charges, 10) || 0;
  var chEl = document.getElementById("new-item-charges");
  var chMaxEl = document.getElementById("new-item-maxcharges");
  var rechEl = document.getElementById("new-item-recharge");
  if (chEl) chEl.value = _catCh > 0 ? _catCh : "";
  if (chMaxEl) chMaxEl.value = _catCh > 0 ? _catCh : "";
  if (rechEl) rechEl.value = (it.recharge === "none") ? "none" : "dawn";
  if (dEl) {
    var meta = (R[it.rarity] || it.rarity) + (it.attune ? ", требует настройки" : "");
    dEl.value = (it.desc || "") + "\n(" + meta + ". " + (it.nameEn || "") + ")";
  }
  closeMagicCatalog();
  if (typeof showToast === "function") showToast("Выбрано: " + it.name + " — проверьте и сохраните", "success");
}

// FIN-5: пикер обычного снаряжения (gear-catalog.js, грузится лениво) + наборы PHB.
// Наборы (GEAR_PACKS) живут в data.js — доступны сразу, без ленивой загрузки.
var GEAR_CAT_LABELS = { other:"Прочее", tool:"Инструмент", material:"Материал/фокус", potion:"Зелье", weapon:"Оружие", armor:"Броня", scroll:"Свиток", mount:"Ездовое", vehicle:"Транспорт" };
// FIN-9: mount/vehicle нет в ITEM_ICONS — свои иконки для пикера (в инвентарь падают как «Прочее»).
var GEAR_EXTRA_ICONS = { mount:"🐴", vehicle:"🛞" };
// 7 канонических наборов PHB — короткое имя для чипа → точный ключ GEAR_PACKS.
// (ключ "набор исследователя" в UI не показываем — это дубль "набор подземелий";
//  он остаётся в GEAR_PACKS для матчинга startingEquipment старых билдов.)
var GEAR_PACK_DISPLAY = [
  { key:"набор путешественника", name:"Путешественника" },
  { key:"набор подземелий",      name:"Исследователя подземелий" },
  { key:"набор учёного",         name:"Учёного" },
  { key:"набор священника",      name:"Священника" },
  { key:"набор артиста",         name:"Артиста" },
  { key:"набор дипломата",       name:"Дипломата" },
  { key:"набор взломщика",       name:"Взломщика" }
];

function openGearCatalog() {
  if (typeof showToast === "function") showToast("Загружаем каталог…", "info");
  var ensure = (typeof window.ensureGearCatalog === "function") ? window.ensureGearCatalog() : Promise.resolve();
  ensure.then(function () {
    var modal = document.getElementById("gear-catalog-modal");
    if (modal) modal.classList.add("active");
    var s = document.getElementById("gear-catalog-search"); if (s) s.value = "";
    var c = document.getElementById("gear-catalog-cat"); if (c) c.value = "";
    renderGearPacks();
    renderGearCatalog();
    if (s) s.focus();
  }).catch(function (e) {
    if (window.__catchLog) window.__catchLog("gear-catalog:load", e);
    if (typeof showToast === "function") showToast("Не удалось загрузить каталог: " + (e && e.message ? e.message : e), "error");
  });
}
function closeGearCatalog() {
  var modal = document.getElementById("gear-catalog-modal");
  if (modal) modal.classList.remove("active");
}
function renderGearPacks() {
  var el = document.getElementById("gear-packs-list");
  if (!el) return;
  var PACKS = window.GEAR_PACKS || {};
  el.innerHTML = GEAR_PACK_DISPLAY.filter(function (p) { return PACKS[p.key]; }).map(function (p) {
    var n = PACKS[p.key].length;
    return '<button type="button" class="gear-pack-btn" onclick="addPackToInventory(\'' + p.key + '\')">🎒 ' +
      escapeHtml(p.name) + ' <span style="opacity:.6">(' + n + ')</span></button>';
  }).join("");
}
function renderGearCatalog() {
  var items = window.GEAR_CATALOG || [];
  var q = ((document.getElementById("gear-catalog-search") || {}).value || "").toLowerCase().trim();
  var fc = (document.getElementById("gear-catalog-cat") || {}).value || "";
  var filtered = items.filter(function (it) {
    if (fc && it.cat !== fc) return false;
    if (q && it.name.toLowerCase().indexOf(q) === -1 && (it.desc || "").toLowerCase().indexOf(q) === -1) return false;
    return true;
  });
  filtered.sort(function (a, b) { return a.name.localeCompare(b.name, "ru"); });
  var countEl = document.getElementById("gear-catalog-count");
  if (countEl) countEl.textContent = "Найдено: " + filtered.length + " из " + items.length;
  var listEl = document.getElementById("gear-catalog-list");
  if (!listEl) return;
  if (!filtered.length) { listEl.innerHTML = '<div class="magic-catalog-empty">Ничего не найдено</div>'; return; }
  listEl.innerHTML = filtered.map(function (it) {
    var icon = (typeof ITEM_ICONS !== "undefined" && ITEM_ICONS[it.cat]) ? ITEM_ICONS[it.cat]
             : (GEAR_EXTRA_ICONS[it.cat] || "🎒");
    // FIN-9: вес показываем только если он есть (скакуны/транспорт — weight:0, вес/скорость в desc).
    var costLine = escapeHtml(it.cost || '') + (it.weight ? ' · ' + it.weight + ' фнт' : '');
    return '<button type="button" class="magic-catalog-item" onclick="fillFromGearItem(\'' + it.id + '\')">' +
      '<div class="mci-top"><span class="mci-name">' + icon + ' ' + escapeHtml(it.name) + '</span>' +
      '<span class="gci-cat">' + escapeHtml(GEAR_CAT_LABELS[it.cat] || it.cat) + '</span></div>' +
      '<div class="gci-cost">' + costLine + '</div>' +
      '<div class="mci-desc">' + escapeHtml(it.desc || '') + '</div>' +
      '</button>';
  }).join("");
}
function fillFromGearItem(id) {
  var items = window.GEAR_CATALOG || [];
  var it = null;
  for (var i = 0; i < items.length; i++) { if (items[i].id === id) { it = items[i]; break; } }
  if (!it) return;
  var nameEl = document.getElementById("new-item-name");
  var wEl = document.getElementById("new-item-weight");
  var sEl = document.getElementById("new-item-slots");
  var cEl = document.getElementById("new-item-category");
  var dEl = document.getElementById("new-item-desc");
  var locEl = document.getElementById("new-item-location");
  if (nameEl) nameEl.value = it.name;
  if (wEl) wEl.value = (typeof it.weight === "number") ? it.weight : 0;
  if (sEl && typeof it.slots === "number") sEl.value = it.slots;
  if (cEl) cEl.value = (typeof ITEM_ICONS !== "undefined" && ITEM_ICONS[it.cat]) ? it.cat : "other";
  // FIN-9: mount/vehicle предзаполняют «Где лежит» = снаружи рюкзака; прочее — сброс.
  if (locEl) locEl.value = it.location || "";
  if (dEl) dEl.value = (it.desc || "") + (it.cost ? "\n(Цена: " + it.cost + ")" : "");
  closeGearCatalog();
  if (typeof showToast === "function") showToast("Выбрано: " + it.name + " — проверьте и сохраните", "success");
}
// Развернуть набор GEAR_PACKS в char.inventory.other (6-элементная структура записи).
function addPackToInventory(key) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var PACKS = window.GEAR_PACKS || {};
  var pack = PACKS[key];
  if (!pack || !pack.length) { if (typeof showToast === "function") showToast("Набор не найден", "warn"); return; }
  if (!char.inventory.other) char.inventory.other = [];
  pack.forEach(function (p) {
    char.inventory.other.push({ name: p[0], qty: p[1], weight: p[2], slots: p[3], location: p[4], desc: p[5] });
  });
  var disp = key;
  for (var i = 0; i < GEAR_PACK_DISPLAY.length; i++) { if (GEAR_PACK_DISPLAY[i].key === key) { disp = GEAR_PACK_DISPLAY[i].name; break; } }
  if (window.AppLog) AppLog.action("inventory", "набор добавлен: " + key, { items: pack.length });
  saveToLocal();
  renderInventory();
  if (typeof showToast === "function") showToast("Набор «" + disp + "» добавлен (" + pack.length + " предм.)", "success");
}

// FIN-9: бросок по таблице безделушек PHB (к100) → предмет в инвентарь «Прочее».
// Кнопка «🎲 Безделушка (к100)» на карточке персонажа. TRINKETS_D100 лежит в
// gear-catalog.js (ленивый) — грузим через ensureGearCatalog. 3D-куб не гоняем.
function rollTrinket() {
  if (!currentId) { if (typeof showToast === "function") showToast("Сначала создайте или выберите персонажа", "warn"); return; }
  var ensure = (typeof window.ensureGearCatalog === "function") ? window.ensureGearCatalog() : Promise.resolve();
  ensure.then(function () {
    var list = window.TRINKETS_D100 || [];
    if (!list.length) { if (typeof showToast === "function") showToast("Таблица безделушек недоступна", "error"); return; }
    var char = getCurrentChar();
    if (!char) return;
    var roll = Math.floor(Math.random() * 100);   // 0..99 → результат «01»…«100»
    var nn = roll + 1;
    var nnStr = (nn < 10 ? "0" : "") + nn;
    var text = list[roll];
    if (!char.inventory) char.inventory = {};
    if (!char.inventory.other) char.inventory.other = [];
    char.inventory.other.push({ name: text, qty: 1, weight: 0, slots: 0, location: "", desc: "🎲 Безделушка (к100: " + nnStr + ")" });
    if (window.AppLog) AppLog.action("inventory", "безделушка (к100: " + nnStr + ")", { text: text });
    saveToLocal();
    if (typeof renderInventory === "function") renderInventory();
    if (typeof showToast === "function") showToast("🎲 Безделушка: " + text, "success");
  }).catch(function (e) {
    if (window.__catchLog) window.__catchLog("trinket:load", e);
    if (typeof showToast === "function") showToast("Не удалось загрузить каталог: " + (e && e.message ? e.message : e), "error");
  });
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
    if (window.AppLog) AppLog.action("inventory", "предмет удалён: " + name, { cat: capturedItem.category });
    saveToLocal();
    renderInventory();
  }
);
}
// HB-5: каталог оружия = книжные пресеты + своё оружие персонажа (char.customWeapons).
// Слияние строго НА ЧТЕНИИ: WEAPON_PRESETS остаётся константой на 37 позиций (её длину
// держит тест FIN-2), а хомбрю живёт в персонаже и уезжает вместе с ним в экспорт.
// Книжные идут ПЕРВЫМИ — своё оружие с именем книжного не перехватывает матчинг.
// Признак «своё» проставляется на месте: элемент char.customWeapons по определению
// пользовательский (тот же приём, что _backfillHomebrewFlag у заклинаний, HB-1).
function _weaponCatalog(char) {
var base = (typeof WEAPON_PRESETS !== "undefined") ? WEAPON_PRESETS : [];
if (!char || !Array.isArray(char.customWeapons) || !char.customWeapons.length) return base;
// Безымянные записи (мусор из чужого импорта) отсекаем — рендер и матчинг идут по name
var hb = char.customWeapons.filter(function(w) { return w && w.name; });
if (!hb.length) return base;
hb.forEach(function(w) { if (!w.homebrew) w.homebrew = true; });
return base.concat(hb);
}
// FIN-2: пикер оружия — 37 позиций PHB с поиском и чипами
// «Простое/Воинское · Ближнее/Дальнобойное»; показывает урон/свойства/цену/вес.
// HB-5: + группа «Мои» (своё оружие персонажа), чип показывается только когда оно есть.
var _weaponPickFilter = { cat: null, kind: null, src: null, q: "" };
function renderWeaponPresets() {
const container = $("weapon-presets-list");
if (!container) return;
container.innerHTML = "";
var q = (_weaponPickFilter.q || "").toLowerCase();
var shown = 0;
// FIN-2: бейдж владения текущего персонажа прямо в карточке пикера
var _pickChar = currentId ? getCurrentChar() : null;
var catalog = _weaponCatalog(_pickChar);
// HB-5: чип «Мои» без своего оружия ведёт в заведомо пустой список — прячем его
// и снимаем залипший фильтр (иначе после удаления последнего хомбрю в HB-6
// пикер остался бы пустым без единого способа это починить).
var hasHb = catalog.some(function(p) { return p && p.homebrew; });
if (!hasHb) _weaponPickFilter.src = null;
var hbChip = $("weapon-filter-hb"), hbSep = $("weapon-filter-hb-sep");
if (hbChip) hbChip.classList.toggle("hidden", !hasHb);
if (hbSep) hbSep.classList.toggle("hidden", !hasHb);
catalog.forEach(function(preset) {
if (_weaponPickFilter.src === "hb" && !preset.homebrew) return;
if (_weaponPickFilter.cat && preset.category !== _weaponPickFilter.cat) return;
if (_weaponPickFilter.kind && preset.kind !== _weaponPickFilter.kind) return;
if (q) {
  var hay = preset.name.toLowerCase();
  (preset.aliases || []).forEach(function(a) { hay += " " + a.toLowerCase(); });
  if (hay.indexOf(q) < 0) return;
}
const btn = document.createElement("button");
btn.className = "weapon-preset-btn";
var tag = (preset.category === "martial" ? "Воинское" : "Простое") + " · " + (preset.kind === "ranged" ? "Дальнобойное" : "Ближнее");
var profBadge = "";
if (_pickChar) {
  profBadge = checkWeaponProficiency(_pickChar, preset.name)
    ? ' <span class="wp-prof yes">✓ владение</span>'
    : ' <span class="wp-prof no">без владения</span>';
}
var hbBadge = preset.homebrew ? ' <span class="wp-hb">🏠 Своё</span>' : "";
btn.innerHTML = "<b>" + escapeHtml(preset.name) + "</b> <span class=\"wp-tag\">" + tag + "</span>" + hbBadge + profBadge + "<br>" +
  escapeHtml(preset.damage ? preset.damage + " " + (preset.type || "") : "—") +
  (preset.notes ? " · " + escapeHtml(preset.notes) : "") + "<br>" +
  "<span class=\"wp-meta\">" + escapeHtml(preset.cost || "—") + " · " + (preset.weight ? preset.weight + " фнт." : "—") + " · " + escapeHtml(preset.range || "") + "</span>";
btn.onclick = function() {
  fillWeaponPreset(preset);
  container.querySelectorAll(".weapon-preset-btn.selected").forEach(function(b) { b.classList.remove("selected"); });
  btn.classList.add("selected");
};
container.appendChild(btn);
shown++;
});
if (!shown) container.innerHTML = '<p class="weapon-presets-empty">Ничего не найдено</p>';
}
function filterWeaponPresets() {
_weaponPickFilter.q = ($("weapon-search-inp")?.value || "").trim().toLowerCase();
renderWeaponPresets();
}
function toggleWeaponFilter(group, val) {
_weaponPickFilter[group] = _weaponPickFilter[group] === val ? null : val;
document.querySelectorAll("#weapon-filter-chips .wf-chip").forEach(function(b) {
  b.classList.toggle("active", _weaponPickFilter[b.dataset.fgroup] === b.dataset.fval);
});
renderWeaponPresets();
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
// FIN-2: бонус мастерства только при владении — как считает список оружия
var prof = checkWeaponProficiency(char, preset.name);
var atk = statMod + (prof ? proficiencyBonus : 0);
safeSet("new-weapon-bonus", (atk >= 0 ? "+" : "") + atk);
}
}
}
function openWeaponModal() {
const modal = $("weapon-modal");
if (modal) modal.classList.add("active");
// FIN-2: сброс поиска/чипов при каждом открытии
_weaponPickFilter = { cat: null, kind: null, src: null, q: "" };
safeSet("weapon-search-inp", "");
document.querySelectorAll("#weapon-filter-chips .wf-chip").forEach(function(b) { b.classList.remove("active"); });
renderWeaponPresets();
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
var addInv = $("new-weapon-add-inv");
if (addInv) addInv.checked = true;
}
// FIN-2: пресет по имени ИЛИ алиасу — старые сейвы хранят дореформенные имена
// («Большой меч», «Сабля», «Дубина», «Посох», «Арбалет лёгкий»…).
// HB-5: второй аргумент — персонаж, чьё своё оружие тоже участвует в матчинге.
// Без него (внешние вызовы) резолвим только по книжному каталогу, как раньше.
function _weaponPresetByName(weaponName, char) {
var lo = String(weaponName || "").toLowerCase();
return _weaponCatalog(char).find(function(p) {
  if (p.name.toLowerCase() === lo) return true;
  return Array.isArray(p.aliases) && p.aliases.some(function(a) { return a.toLowerCase() === lo; });
});
}
function checkWeaponProficiency(char, weaponName) {
if (!char || !char.proficiencies || !char.proficiencies.weapon) return false;
var profs = char.proficiencies.weapon;
// HB-5: своё оружие резолвится в пресет с категорией — до этого оно проваливалось
// в ветку «неизвестное» ниже, и владение простым объявляло владением что угодно.
var preset = _weaponPresetByName(weaponName, char);
if (profs.indexOf("martial") !== -1) return true;
// FIN-2: конкретные владения (раса/класс/custom) — скимитар друида, короткий меч
// монаха, эльфийские мечи/луки; сверяем и с алиасами пресета. Элементы массива
// бывают строками (applyBuild до пересчёта) и объектами {name} (после recalc).
var names = [String(weaponName || "").toLowerCase()];
if (preset) {
  names.push(preset.name.toLowerCase());
  (preset.aliases || []).forEach(function(a) { names.push(a.toLowerCase()); });
}
var specs = char.proficiencies.specificWeapons || [];
var specHit = specs.some(function(s) {
  var n = (typeof s === "string") ? s : (s && s.name) || "";
  return names.indexOf(String(n).toLowerCase()) !== -1;
});
if (specHit) return true;
if (profs.indexOf("simple") !== -1) {
  if (preset && preset.category === "simple") return true;
  if (!preset) return true;
}
if (preset && profs.indexOf(preset.category) !== -1) return true;
return false;
}
function submitWeapon() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const name = $("new-weapon-name")?.value?.trim() || "";
if (!name) { showToast("Введите название!", "warn"); return; }
const stat = $("new-weapon-stat")?.value || "str";
const statName = stat === "str" ? "СИЛ" : "ЛОВ";
const damage = $("new-weapon-damage")?.value || "";
const type = $("new-weapon-type")?.value || "";
const range = $("new-weapon-range")?.value || "";
const notes = $("new-weapon-notes")?.value || "";
if (!char.weapons) char.weapons = [];
var proficient = checkWeaponProficiency(char, name);
char.weapons.push({
name: name,
stat: stat,
statName: statName,
bonus: $("new-weapon-bonus")?.value || "",
damage: damage,
type: type,
range: range,
notes: notes,
proficient: proficient
});
// FIN-2: коннект с инвентарём — оружие сразу появляется во вкладке Инвентарь
// (вес из каталога; повтор имени складывается в стопку qty)
var addInvEl = $("new-weapon-add-inv");
var addInv = addInvEl ? !!addInvEl.checked : true;
if (addInv) {
  if (!char.inventory) char.inventory = { weapon:[], armor:[], potion:[], scroll:[], tool:[], material:[], other:[] };
  if (!Array.isArray(char.inventory.weapon)) char.inventory.weapon = [];
  var invList = char.inventory.weapon;
  var existing = invList.find(function(it) { return it && it.name === name; });
  if (existing) {
    existing.qty = (parseInt(existing.qty, 10) || 1) + 1;
  } else {
    var preset = _weaponPresetByName(name, char);   // HB-5: вес своего оружия тоже из каталога
    invList.push({
      name: name, qty: 1,
      weight: preset ? (preset.weight || 0) : 0,
      location: invList.length === 0 ? "wielded" : "belt",
      desc: (damage ? damage + (type ? " " + type : "") + ". " : "") + (range ? "Дистанция: " + range + ". " : "") + (notes || "")
    });
  }
  if (typeof renderInventory === "function") renderInventory();
}
if (window.AppLog) AppLog.action("inventory", "оружие добавлено: " + name + (proficient ? "" : " (без владения)") + (addInv ? " (+инвентарь)" : ""));
showToast("⚔️ " + escapeHtml(name) + " — добавлено" + (addInv ? " (и в инвентарь)" : ""), "success");
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
// Auto-detect proficiency if not set
if (weapon.proficient === undefined) {
  weapon.proficient = checkWeaponProficiency(char, weapon.name);
}
// Calculate attack bonus for display
var statKey = weapon.stat || "str";
var statVal = char.stats[statKey] || 10;
var statMod = getMod(statVal);
var profBonus = getProficiencyBonus(parseInt($("char-level")?.value, 10) || 1);
var attackBonus = statMod + (weapon.proficient ? profBonus : 0);
var attackStr = (attackBonus >= 0 ? "+" : "") + attackBonus;
var profTag = weapon.proficient ? '' : ' <span class="weapon-no-prof">без влад.</span>';
div.innerHTML =
  '<div class="weapon-row-top">' +
    '<div class="weapon-info">' +
      '<span class="weapon-name">' + escapeHtml(weapon.name) + profTag + '</span>' +
      '<span class="weapon-meta">' + escapeHtml(weapon.damage || "—") + ' · ' + escapeHtml(weapon.statName || "") + ' ' + attackStr + '</span>' +
    '</div>' +
    '<button class="weapon-delete-btn" onclick="removeWeapon(' + index + ')">✕</button>' +
  '</div>' +
  '<div class="weapon-roll-row">' +
    '<button class="weapon-roll-btn weapon-roll-atk" onclick="rollWeaponAttack(' + index + ')">🎲 Атака</button>' +
    '<button class="weapon-roll-btn weapon-roll-dmg" onclick="rollWeaponDamage(' + index + ')">🗡️ Урон</button>' +
  '</div>' +
  (weapon.notes ? '<div class="weapon-notes">' + escapeHtml(weapon.notes) + '</div>' : '');
container.appendChild(div);
});
// Two-Weapon Fighting: если 2+ лёгких оружия — показать бонусную атаку
var lightWeapons = [];
char.weapons.forEach(function(w, i) {
  if (isLightWeapon(w)) lightWeapons.push(i);
});
if (lightWeapons.length >= 2) {
  var twfDiv = document.createElement("div");
  twfDiv.className = "twf-section";
  var twfChecked = char.twoWeaponFighting ? ' checked' : '';
  twfDiv.innerHTML =
    '<div class="twf-header">' +
      '<span class="twf-title">⚔️ Бой двумя оружиями</span>' +
      '<label class="twf-style-label">' +
        '<input type="checkbox" id="twf-style-toggle"' + twfChecked + ' onchange="toggleTWFStyle()">' +
        ' Стиль боя' +
      '</label>' +
    '</div>' +
    '<div class="twf-info">Бонусное действие: атака вторым лёгким оружием' +
      (char.twoWeaponFighting ? '' : ' (без мод. характеристики к урону)') +
    '</div>' +
    '<div class="twf-buttons">' +
      '<button class="weapon-roll-btn weapon-roll-twf" onclick="rollTWFAttack(' + lightWeapons[1] + ')">🗡️ Бонусная атака: ' + escapeHtml(char.weapons[lightWeapons[1]].name) + '</button>' +
    '</div>';
  container.appendChild(twfDiv);
}
}

function isLightWeapon(weapon) {
  if (!weapon || !weapon.notes) return false;
  return weapon.notes.toLowerCase().indexOf("лёгкое") !== -1 || weapon.notes.toLowerCase().indexOf("легкое") !== -1;
}

function toggleTWFStyle() {
  var char = getCurrentChar();
  if (!char) return;
  char.twoWeaponFighting = !char.twoWeaponFighting;
  saveToLocal();
  renderWeapons();
}

function rollTWFAttack(index) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var weapon = char.weapons[index];
  if (!weapon) return;
  showRollModePopup(function(mode) {
    var statKey = weapon.stat || "str";
    var statVal = char.stats[statKey] || 10;
    var statMod = getMod(statVal);
    var profBonus = getProficiencyBonus(parseInt($("char-level")?.value, 10) || 1);
    var attackBonus = statMod + (weapon.proficient ? profBonus : 0);
    var d = rollD20WithMode(mode);
    openDiceModal();
    var qty = (mode === 'adv' || mode === 'dis') ? 2 : 1;
    animateDice3d(20, d.roll, function(v1, v2) {
      if (typeof v1 === 'number' && !isNaN(v1)) {
        if (mode === 'adv' || mode === 'dis') {
          d.r1 = v1;
          d.r2 = (typeof v2 === 'number' && !isNaN(v2)) ? v2 : d.r2;
          d.roll = (mode === 'adv') ? Math.max(d.r1, d.r2) : Math.min(d.r1, d.r2);
        } else {
          d.roll = v1; d.r1 = v1;
        }
        d.isCrit = (d.roll === 20); d.isFail = (d.roll === 1);
      }
      var total = d.roll + attackBonus;
      var modeLabel = formatRollModeLabel(d);
      var msg = "⚔️ Бонусная атака " + escapeHtml(weapon.name) + modeLabel + ": к20=" + d.roll + " + " + attackBonus + " = " + total;
      if (d.isCrit) msg = "🎉 КРИТ! Бонусная атака " + escapeHtml(weapon.name) + ": " + d.roll + " + " + attackBonus + " = " + total;
      if (d.isFail) msg = "💀 ПРОМАХ! Бонусная атака " + escapeHtml(weapon.name) + ": " + d.roll;
      showToast(msg, d.isCrit ? "success" : d.isFail ? "error" : "info");
      var resultBig = $("dice-result-big");
      var resultInfo = $("dice-result-info");
      var resultBox = $("dice3d-result");
      if (resultBig) resultBig.textContent = total;
      if (resultInfo) resultInfo.textContent = escapeHtml(weapon.name) + " · бонусная атака" + modeLabel + " · " + formatDiceInfoStr(d);
      if (resultBox) resultBox.className = "dice3d-result" + (d.isCrit ? " crit-success" : d.isFail ? " crit-fail" : " normal");
      showDualDice(d);
      if (d.isCrit) createParticles();
      diceHistory.unshift({ sides:20, result:total, mode:d.mode, time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), r1:d.r1, r2:d.r2, label: weapon.name + " бонус.атака" });
      if (diceHistory.length > 10) diceHistory.pop();
      renderDiceHistory();
      rollTWFDamage(index);
    }, { qty: qty });
  });
}

function rollTWFDamage(index) {
  var char = getCurrentChar();
  if (!char) return;
  var weapon = char.weapons[index];
  if (!weapon || !weapon.damage) return;
  var statKey = weapon.stat || "str";
  var statVal = char.stats[statKey] || 10;
  var statMod = getMod(statVal);
  var addMod = char.twoWeaponFighting ? statMod : 0; // Without style — no stat mod to damage
  var dmg = weapon.damage.toLowerCase().replace(/к/g, "d").replace(/\s/g, "");
  var match = dmg.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  var total = 0;
  var rollStr = "";
  if (match) {
    var num = parseInt(match[1], 10);
    var sides = parseInt(match[2], 10);
    var mod = match[3] ? parseInt(match[3], 10) : 0;
    var rolls = [];
    for (var i = 0; i < num; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
    total = rolls.reduce(function(a,b){return a+b;}, 0) + mod + addMod;
    rollStr = "[" + rolls.join("+") + "]" + (mod ? (mod>0?"+":"")+mod : "") + (addMod ? (addMod>0?"+":"")+addMod : "");
  } else {
    total = addMod;
    rollStr = addMod ? "+" + addMod : "0";
  }
  var styleNote = char.twoWeaponFighting ? "" : " (без мод.)";
  showToast("🗡️ " + escapeHtml(weapon.name) + " бонусный урон" + styleNote + ": " + rollStr + " = " + total, "info");
}

function rollWeaponAttack(index) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const weapon = char.weapons[index];
if (!weapon) return;
showRollModePopup(function(mode) {
  var statKey = weapon.stat || "str";
  var statVal = char.stats[statKey] || 10;
  var statMod = getMod(statVal);
  var profBonus = getProficiencyBonus(parseInt($("char-level")?.value, 10) || 1);
  var attackBonus = statMod + (weapon.proficient ? profBonus : 0);
  var d = rollD20WithMode(mode);
  openDiceModal();
  var qty = (mode === 'adv' || mode === 'dis') ? 2 : 1;
  animateDice3d(20, d.roll, function(v1, v2) {
    if (typeof v1 === 'number' && !isNaN(v1)) {
      if (mode === 'adv' || mode === 'dis') {
        d.r1 = v1;
        d.r2 = (typeof v2 === 'number' && !isNaN(v2)) ? v2 : d.r2;
        d.roll = (mode === 'adv') ? Math.max(d.r1, d.r2) : Math.min(d.r1, d.r2);
      } else {
        d.roll = v1; d.r1 = v1;
      }
      d.isCrit = (d.roll === 20); d.isFail = (d.roll === 1);
    }
    var total = d.roll + attackBonus;
    var modeLabel = formatRollModeLabel(d);
    var rollInfo = formatRollMode(d, attackBonus);
    var msg = "⚔️ " + escapeHtml(weapon.name) + modeLabel + ": " + rollInfo + " + " + attackBonus + " = " + total;
    if (d.isCrit) msg = "🎉 КРИТИЧЕСКОЕ ПОПАДАНИЕ! " + escapeHtml(weapon.name) + ": " + d.roll + " + " + attackBonus + " = " + total;
    if (d.isFail) msg = "💀 ПРОМАХ! " + escapeHtml(weapon.name) + ": " + d.roll;
    if (window.AppLog) AppLog.action("combat", "атака «" + weapon.name + "»: " + total + (d.isCrit ? " (крит)" : d.isFail ? " (промах)" : ""), { roll: d.roll, bonus: attackBonus, mode: d.mode });
    showToast(msg, d.isCrit ? "success" : d.isFail ? "error" : "info");
    var resultBig = $("dice-result-big");
    var resultInfo = $("dice-result-info");
    var resultBox = $("dice3d-result");
    if (resultBig) resultBig.textContent = total;
    if (resultInfo) resultInfo.textContent = escapeHtml(weapon.name) + " · атака" + modeLabel + " · " + formatDiceInfoStr(d);
    if (resultBox) resultBox.className = "dice3d-result" + (d.isCrit ? " crit-success" : d.isFail ? " crit-fail" : " normal");
    showDualDice(d);
    if (d.isCrit) createParticles();
    diceHistory.unshift({ sides:20, result:total, mode:d.mode, time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), r1:d.r1, r2:d.r2, label: weapon.name + " атака" });
    if (diceHistory.length > 10) diceHistory.pop();
    renderDiceHistory();
  }, { qty: qty });
});
}

function rollWeaponDamage(index) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const weapon = char.weapons[index];
if (!weapon || !weapon.damage) return;
const statKey = weapon.stat || "str";
const statVal = char.stats[statKey] || 10;
const statMod = getMod(statVal);
// Parse damage formula e.g. "1к8+3", "2к6", "1к4"
const dmg = weapon.damage.toLowerCase().replace(/к/g, "d").replace(/\s/g, "");
const match = dmg.match(/^(\d+)d(\d+)([+-]\d+)?$/);
let total = 0;
let rollStr = "";
if (match) {
  const num = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const mod = match[3] ? parseInt(match[3], 10) : 0;
  const rolls = [];
  for (var i = 0; i < num; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
  total = rolls.reduce(function(a,b){return a+b;}, 0) + mod + statMod;
  rollStr = "[" + rolls.join("+") + "]" + (mod ? (mod>0?"+":"")+mod : "") + (statMod ? (statMod>0?"+":"")+statMod : "");
} else if (/^\d+$/.test(dmg)) {
  // FIN-2: фиксированный урон без кости (Духовая трубка: «1»)
  total = parseInt(dmg, 10) + statMod;
  rollStr = dmg + (statMod ? (statMod > 0 ? "+" : "") + statMod : "");
} else {
  total = statMod;
  rollStr = "+" + statMod;
}
if (window.AppLog) AppLog.action("combat", "урон «" + weapon.name + "»: " + total, { formula: weapon.damage, detail: rollStr });
showToast("🗡️ " + escapeHtml(weapon.name) + " урон: " + rollStr + " = " + total, "info");
openDiceModal();
var resultBig = $("dice-result-big");
var resultInfo = $("dice-result-info");
var resultBox = $("dice3d-result");
if (resultBig) resultBig.textContent = total;
if (resultInfo) resultInfo.textContent = escapeHtml(weapon.name) + " · урон · " + (match ? match[1]+"d"+match[2] : "?");
if (resultBox) resultBox.className = "dice3d-result normal";
var sides = match ? parseInt(match[2], 10) : 6;
var qty = match ? Math.max(1, Math.min(parseInt(match[1], 10) || 1, 8)) : 1;
animateDice3d(sides, total, function() {}, { qty: qty });
diceHistory.unshift({ sides:sides, result:total, mode:"normal", time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), r1:total, r2:null, label: weapon.name + " урон" });
if (diceHistory.length > 10) diceHistory.pop();
renderDiceHistory();
}
function removeWeapon(index) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
var _w = char.weapons[index];
char.weapons.splice(index, 1);
// FIN-2: коннект с инвентарём — стопка предмета уменьшается синхронно
var invNote = "";
if (_w && _w.name && char.inventory && Array.isArray(char.inventory.weapon)) {
  var ii = char.inventory.weapon.findIndex(function(it) { return it && it.name === _w.name; });
  if (ii >= 0) {
    var item = char.inventory.weapon[ii];
    var q = parseInt(item.qty, 10) || 1;
    if (q > 1) item.qty = q - 1;
    else char.inventory.weapon.splice(ii, 1);
    invNote = " (и из инвентаря)";
    if (typeof renderInventory === "function") renderInventory();
  }
}
if (window.AppLog) AppLog.action("inventory", "оружие удалено" + (_w && _w.name ? ": " + _w.name : "") + invNote);
if (_w && _w.name) showToast("🗑️ " + escapeHtml(_w.name) + " — убрано" + invNote, "info");
saveToLocal();
renderWeapons();
}

// ── UI-8: Drag-n-drop инвентаря ──────────────────────────────
// Перетаскивание предметов между слотами/категориями.
// Desktop: HTML5 DnD. Touch: long-press 300ms активация.
// Плейсхолдер-линия «куда упадёт», подсветка цели, Escape — отмена.
var _invDrag = null;     // { cat, idx } — что тащим
var _invDropPos = null;  // { cat, idx, before } | { btn }
var _invTouch = null;    // состояние тач-жеста
var _invDndReady = false;

function _invDndInit() {
  if (_invDndReady) return;
  _invDndReady = true;
  var fc = document.querySelector(".inventory-filters");
  if (fc) {
    fc.addEventListener("dragover", function(ev) {
      if (!_invDrag) return;
      var b = ev.target.closest("button");
      if (!b) return;
      ev.preventDefault();
      _invClearIndicators();
      b.classList.add("inv-cat-target");
      _invDropPos = { btn: b };
    });
    fc.addEventListener("dragleave", function(ev) {
      var b = ev.target.closest("button");
      if (b) b.classList.remove("inv-cat-target");
    });
    fc.addEventListener("drop", function(ev) {
      if (!_invDrag) return;
      ev.preventDefault();
      _invCommitDrop({ cat: _invDrag.cat, idx: _invDrag.idx });
    });
  }
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && (_invDrag || _invTouch)) _invCancelDrag();
  });
}

function _invClearIndicators() {
  document.querySelectorAll(".inv-drop-before,.inv-drop-after").forEach(function(el) {
    el.classList.remove("inv-drop-before", "inv-drop-after");
  });
  document.querySelectorAll(".inventory-filters button.inv-cat-target").forEach(function(b) {
    b.classList.remove("inv-cat-target");
  });
}

function _invSetIndicator(itemEl, before) {
  _invClearIndicators();
  itemEl.classList.add(before ? "inv-drop-before" : "inv-drop-after");
}

function _invCleanup() {
  _invClearIndicators();
  document.querySelectorAll(".inv-item.inv-dragging").forEach(function(el) {
    el.classList.remove("inv-dragging");
  });
}

function _invCancelDrag() {
  _invDrag = null;
  _invDropPos = null;
  if (_invTouch && _invTouch.timer) clearTimeout(_invTouch.timer);
  _invTouch = null;
  _invCleanup();
}

function _invMoveItem(fromCat, fromIdx, toCat, toIdx) {
  var char = getCurrentChar();
  if (!char || !char.inventory) return;
  var src = char.inventory[fromCat];
  if (!src || !src[fromIdx]) return;
  if (fromCat === toCat && (toIdx === fromIdx || toIdx === fromIdx + 1)) return; // no-op
  var moved = src.splice(fromIdx, 1)[0];
  if (!char.inventory[toCat]) char.inventory[toCat] = [];
  if (fromCat === toCat && fromIdx < toIdx) toIdx--;
  if (toIdx < 0) toIdx = 0;
  if (toIdx > char.inventory[toCat].length) toIdx = char.inventory[toCat].length;
  char.inventory[toCat].splice(toIdx, 0, moved);
  if (window.AppLog) AppLog.action("inventory", "предмет перемещён: " + ((moved && moved.name) || "?"), { from: fromCat + ":" + fromIdx, to: toCat + ":" + toIdx });
  saveToLocal();
  renderInventory();
}

function _invCommitDrop(src) {
  var d = _invDropPos;
  _invDrag = null;
  _invDropPos = null;
  _invCleanup();
  if (!d || !src) return;
  if (d.btn) {
    var oc = d.btn.getAttribute("onclick") || "";
    var m = oc.match(/filterInventory\('([^']+)'/);
    if (!m || m[1] === "all") return;
    _invMoveItem(src.cat, src.idx, m[1], 1e9);
    return;
  }
  // Дроп на предмет — только перестановка в пределах своей категории.
  // Смена категории — исключительно через кнопки фильтра (явное действие).
  if (d.cat !== src.cat) return;
  var toIdx = d.before ? d.idx : d.idx + 1;
  _invMoveItem(src.cat, src.idx, d.cat, toIdx);
}

// ── Desktop HTML5 DnD ──
function invDragStart(ev, cat, idx) {
  _invDrag = { cat: cat, idx: idx };
  if (ev.dataTransfer) {
    ev.dataTransfer.effectAllowed = "move";
    try { ev.dataTransfer.setData("text/plain", cat + ":" + idx); } catch (e) { window.__catchLog && window.__catchLog('inv:drag-setData', e); }
  }
  var el = ev.currentTarget;
  if (el && el.classList) el.classList.add("inv-dragging");
}

function invDragOver(ev, cat, idx) {
  if (!_invDrag) return;
  ev.preventDefault();
  if (cat !== _invDrag.cat) {
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = "none";
    _invClearIndicators();
    _invDropPos = null;
    return;
  }
  if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
  var el = ev.currentTarget;
  var rect = el.getBoundingClientRect();
  var before = (ev.clientY - rect.top) < rect.height / 2;
  _invSetIndicator(el, before);
  _invDropPos = { cat: cat, idx: idx, before: before };
}

function invDragLeave(ev, el) {
  if (el && el.classList) el.classList.remove("inv-drop-before", "inv-drop-after");
}

function invDrop(ev) {
  ev.preventDefault();
  if (!_invDrag) return;
  _invCommitDrop({ cat: _invDrag.cat, idx: _invDrag.idx });
}

function invDragEnd() {
  _invDrag = null;
  _invDropPos = null;
  _invCleanup();
}

// ── Touch: long-press 300ms ──
function invTouchStart(ev, cat, idx, el) {
  if (ev.target && ev.target.closest("button")) return; // не мешаем кнопкам
  var t = ev.touches[0];
  _invTouch = { cat: cat, idx: idx, el: el, startX: t.clientX, startY: t.clientY, active: false, timer: null };
  _invTouch.timer = setTimeout(function() {
    if (!_invTouch) return;
    _invTouch.active = true;
    _invDrag = { cat: cat, idx: idx };
    el.classList.add("inv-dragging");
    if (navigator.vibrate) navigator.vibrate(15);
  }, 300);
  el.addEventListener("touchmove", invTouchMove, { passive: false });
  el.addEventListener("touchend", invTouchEnd);
  el.addEventListener("touchcancel", invTouchEnd);
}

function invTouchMove(ev) {
  if (!_invTouch) return;
  var t = ev.touches[0];
  if (!_invTouch.active) {
    if (Math.abs(t.clientX - _invTouch.startX) > 10 || Math.abs(t.clientY - _invTouch.startY) > 10) {
      clearTimeout(_invTouch.timer);
      var el0 = _invTouch.el;
      _invTouch = null;
      el0.removeEventListener("touchmove", invTouchMove);
    }
    return;
  }
  ev.preventDefault(); // жест наш — блокируем скролл
  var under = document.elementFromPoint(t.clientX, t.clientY);
  if (!under) return;
  var btn = under.closest(".inventory-filters button");
  if (btn) {
    _invClearIndicators();
    btn.classList.add("inv-cat-target");
    _invDropPos = { btn: btn };
    return;
  }
  var item = under.closest(".inv-item");
  if (item && item.dataset && item.dataset.category !== undefined) {
    if (item.dataset.category !== _invTouch.cat) { _invClearIndicators(); _invDropPos = null; return; }
    var rect = item.getBoundingClientRect();
    var before = (t.clientY - rect.top) < rect.height / 2;
    _invSetIndicator(item, before);
    _invDropPos = { cat: item.dataset.category, idx: parseInt(item.dataset.index, 10), before: before };
  }
}

function invTouchEnd() {
  if (!_invTouch) return;
  clearTimeout(_invTouch.timer);
  var wasActive = _invTouch.active;
  var src = { cat: _invTouch.cat, idx: _invTouch.idx };
  var el = _invTouch.el;
  el.removeEventListener("touchmove", invTouchMove);
  el.removeEventListener("touchend", invTouchEnd);
  el.removeEventListener("touchcancel", invTouchEnd);
  _invTouch = null;
  if (wasActive) _invCommitDrop(src);
}
