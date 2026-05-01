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
  }





function renderPouches() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var str = char.stats.str || 10;
  var container = $("inv-pouches");
  if (!container) return;
  var totalCoins = (parseInt($("coin-cp")?.value)||0) +
    (parseInt($("coin-sp")?.value)||0) +
    (parseInt($("coin-ep")?.value)||0) +
    (parseInt($("coin-gp")?.value)||0) +
    (parseInt($("coin-pp")?.value)||0);
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
allItems.forEach(function(data) {
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
var _stowed = (_isBackpackOff(char) && _locKey === "backpack");
const div = document.createElement("div");
div.className = "inv-item" + (_stowed ? " inv-item-stowed" : "");
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
      '</div>' +
    '</div>' +
    '<span class="inv-item-arrow">▶</span>' +
  '</div>' +
  '<div class="inv-item-body">' +
    (item.desc ? '<div class="inv-item-desc">' + escapeHtml(item.desc) + '</div>' : '') +
    '<div class="inv-item-actions">' +
      '<button class="inv-edit-btn" onclick="event.stopPropagation(); editItemDirect(\'' + data.category + '\',' + data.index + ')">✏️ Изменить</button>' +
      '<button class="inv-del-btn" onclick="event.stopPropagation(); deleteItemDirect(\'' + data.category + '\',' + data.index + ')">🗑 Удалить</button>' +
    '</div>' +
  '</div>';
container.appendChild(div);
});
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
// Coin weight
const cwEl = $("coin-weight");
if (cwEl) cwEl.textContent = coinWeight.toFixed(2) + " фнт";
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
const _slotRaw = $("item-slot-index")?.value; const slotIndex = (_slotRaw !== undefined && _slotRaw !== "" && _slotRaw !== null) ? parseInt(_slotRaw) : -1;
const name = $("new-item-name")?.value?.trim() || "";
if (!name) { showToast("Введите название!", "warn"); return; }
const newItem = {
name: name,
qty: parseInt($("new-item-qty")?.value) || 1,
weight: parseFloat($("new-item-weight")?.value) || 0,
slots: $("new-item-slots")?.value !== "" ? parseFloat($("new-item-slots")?.value) : undefined,
location: $("new-item-location")?.value || undefined,
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
function checkWeaponProficiency(char, weaponName) {
if (!char || !char.proficiencies || !char.proficiencies.weapon) return false;
var profs = char.proficiencies.weapon;
if (profs.indexOf("martial") !== -1) return true;
if (profs.indexOf("simple") !== -1) {
  var preset = WEAPON_PRESETS.find(function(p) { return p.name === weaponName; });
  if (preset && preset.category === "simple") return true;
  if (!preset) return true;
}
var preset = WEAPON_PRESETS.find(function(p) { return p.name === weaponName; });
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
if (!char.weapons) char.weapons = [];
var proficient = checkWeaponProficiency(char, name);
char.weapons.push({
name: name,
stat: stat,
statName: statName,
bonus: $("new-weapon-bonus")?.value || "",
damage: $("new-weapon-damage")?.value || "",
type: $("new-weapon-type")?.value || "",
range: $("new-weapon-range")?.value || "",
notes: $("new-weapon-notes")?.value || "",
proficient: proficient
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
// Auto-detect proficiency if not set
if (weapon.proficient === undefined) {
  weapon.proficient = checkWeaponProficiency(char, weapon.name);
}
// Calculate attack bonus for display
var statKey = weapon.stat || "str";
var statVal = char.stats[statKey] || 10;
var statMod = getMod(statVal);
var profBonus = getProficiencyBonus(parseInt($("char-level")?.value) || 1);
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
    var profBonus = getProficiencyBonus(parseInt($("char-level")?.value) || 1);
    var attackBonus = statMod + (weapon.proficient ? profBonus : 0);
    var d = rollD20WithMode(mode);
    var total = d.roll + attackBonus;
    var modeLabel = formatRollModeLabel(d);
    // Attack roll — same as normal
    var msg = "⚔️ Бонусная атака " + escapeHtml(weapon.name) + modeLabel + ": к20=" + d.roll + " + " + attackBonus + " = " + total;
    if (d.isCrit) msg = "🎉 КРИТ! Бонусная атака " + escapeHtml(weapon.name) + ": " + d.roll + " + " + attackBonus + " = " + total;
    if (d.isFail) msg = "💀 ПРОМАХ! Бонусная атака " + escapeHtml(weapon.name) + ": " + d.roll;
    showToast(msg, d.isCrit ? "success" : d.isFail ? "error" : "info");
    openDiceModal();
    var resultBig = $("dice-result-big");
    var resultInfo = $("dice-result-info");
    var resultBox = $("dice3d-result");
    if (resultBig) resultBig.textContent = total;
    if (resultInfo) resultInfo.textContent = escapeHtml(weapon.name) + " · бонусная атака" + modeLabel + " · " + formatDiceInfoStr(d);
    if (resultBox) resultBox.className = "dice3d-result" + (d.isCrit ? " crit-success" : d.isFail ? " crit-fail" : " normal");
    drawDiceSVG(20);
    showDualDice(d);
    var numEl = $("dice-svg-num");
    if (numEl) numEl.textContent = total;
    if (d.isCrit) createParticles();
    diceHistory.unshift({ sides:20, result:total, mode:d.mode, time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), r1:d.r1, r2:d.r2, label: weapon.name + " бонус.атака" });
    if (diceHistory.length > 10) diceHistory.pop();
    renderDiceHistory();
    // Auto-roll damage
    rollTWFDamage(index);
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
    var num = parseInt(match[1]);
    var sides = parseInt(match[2]);
    var mod = match[3] ? parseInt(match[3]) : 0;
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
  var profBonus = getProficiencyBonus(parseInt($("char-level")?.value) || 1);
  var attackBonus = statMod + (weapon.proficient ? profBonus : 0);
  var d = rollD20WithMode(mode);
  var total = d.roll + attackBonus;
  var modeLabel = formatRollModeLabel(d);
  var rollInfo = formatRollMode(d, attackBonus);
  var msg = "⚔️ " + escapeHtml(weapon.name) + modeLabel + ": " + rollInfo + " + " + attackBonus + " = " + total;
  if (d.isCrit) msg = "🎉 КРИТИЧЕСКОЕ ПОПАДАНИЕ! " + escapeHtml(weapon.name) + ": " + d.roll + " + " + attackBonus + " = " + total;
  if (d.isFail) msg = "💀 ПРОМАХ! " + escapeHtml(weapon.name) + ": " + d.roll;
  showToast(msg, d.isCrit ? "success" : d.isFail ? "error" : "info");
  openDiceModal();
  var resultBig = $("dice-result-big");
  var resultInfo = $("dice-result-info");
  var resultBox = $("dice3d-result");
  if (resultBig) resultBig.textContent = total;
  if (resultInfo) resultInfo.textContent = escapeHtml(weapon.name) + " · атака" + modeLabel + " · " + formatDiceInfoStr(d);
  if (resultBox) resultBox.className = "dice3d-result" + (d.isCrit ? " crit-success" : d.isFail ? " crit-fail" : " normal");
  drawDiceSVG(20);
  var numEl = $("dice-svg-num");
  if (numEl) numEl.textContent = total;
  if (d.isCrit) createParticles();
  diceHistory.unshift({ sides:20, result:total, mode:d.mode, time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), r1:d.r1, r2:d.r2, label: weapon.name + " атака" });
  if (diceHistory.length > 10) diceHistory.pop();
  renderDiceHistory();
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
  const num = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const mod = match[3] ? parseInt(match[3]) : 0;
  const rolls = [];
  for (var i = 0; i < num; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
  total = rolls.reduce(function(a,b){return a+b;}, 0) + mod + statMod;
  rollStr = "[" + rolls.join("+") + "]" + (mod ? (mod>0?"+":"")+mod : "") + (statMod ? (statMod>0?"+":"")+statMod : "");
} else {
  total = statMod;
  rollStr = "+" + statMod;
}
showToast("🗡️ " + escapeHtml(weapon.name) + " урон: " + rollStr + " = " + total, "info");
openDiceModal();
var resultBig = $("dice-result-big");
var resultInfo = $("dice-result-info");
var resultBox = $("dice3d-result");
if (resultBig) resultBig.textContent = total;
if (resultInfo) resultInfo.textContent = escapeHtml(weapon.name) + " · урон · " + (match ? match[1]+"d"+match[2] : "?");
if (resultBox) resultBox.className = "dice3d-result normal";
var sides = match ? parseInt(match[2]) : 6;
drawDiceSVG(sides);
var numEl = $("dice-svg-num");
if (numEl) numEl.textContent = total;
diceHistory.unshift({ sides:sides, result:total, mode:"normal", time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), r1:total, r2:null, label: weapon.name + " урон" });
if (diceHistory.length > 10) diceHistory.pop();
renderDiceHistory();
}
function removeWeapon(index) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
char.weapons.splice(index, 1);
saveToLocal();
renderWeapons();
}
