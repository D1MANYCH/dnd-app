// ============================================================
// app-spells.js — Управление заклинаниями: слоты, поиск,
// добавление/удаление, отображение заклинаний
// ============================================================

function renderSpellSlots() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const container = $("spell-slots-visual");
if (!container) return;
container.innerHTML = "";
var isSingleWarlock = char.class === "Колдун" && (!Array.isArray(char.classes) || char.classes.length <= 1);
// У одноклассового Колдуна обычные ячейки 1..9 пустые — рендерить их бессмысленно
if (!isSingleWarlock) {
  for(let i=1; i<=9; i++) {
    const total = char.spells.slots[i] || 0;
    const used = char.spells.slotsUsed[i] || 0;
    const free = total - used;
    const row = document.createElement("div");
    row.className = "spell-slot-row" + (total === 0 ? " spell-slot-empty" : "");
    var diamHtml = '<div class="ssl-diamonds">';
    if (total === 0) {
      diamHtml += '<span class="ssl-none">нет ячеек</span>';
    } else {
      // Дымка v5: свободные — слева (золотые), потраченные — справа (серые),
      // как в образце. Клик по свободной тратит одну (toggleSpellSlot с
      // index=used → used+1), по потраченной — возвращает одну (index=used-1).
      // Сама toggleSpellSlot не менялась (позиционная семантика, тесты БЛОК 26).
      for (let p = 0; p < total; p++) {
        var isFree = p < free;
        var clickIdx = isFree ? used : used - 1;
        diamHtml += '<div class="spell-diamond' + (isFree ? '' : ' used') + '" data-level="' + i + '" data-idx="' + p + '" title="' + (isFree ? 'Потратить ячейку' : 'Вернуть ячейку') + '" onclick="toggleSpellSlot(' + i + ',' + clickIdx + ')"></div>';
      }
    }
    diamHtml += '</div>';
    row.innerHTML =
      '<div class="ssl-label"><span class="ssl-lvl">' + i + '</span><span class="ssl-ur">ур.</span></div>' +
      diamHtml +
      '<div class="ssl-counter"><span class="ssl-free' + (free === 0 && total > 0 ? ' ssl-exhausted' : '') + '">' + free + '</span><span class="ssl-sep">/</span><span class="ssl-total">' + total + '</span></div>' +
      '<div class="ssl-controls"><button class="ssl-btn" onclick="adjustSpellSlots(' + i + ',-1)">−</button><button class="ssl-btn" onclick="adjustSpellSlots(' + i + ',1)">+</button></div>';
    container.appendChild(row);
  }
}
// BUGFIX-1: пакт-ячейки колдуна — отдельная строка (восст. на коротком отдыхе)
var pactTotal = char.spells.pactSlots || 0;
var pactLvl = char.spells.pactLevel || 0;
if (pactTotal > 0 && pactLvl > 0) {
  var pactUsed = char.spells.pactUsed || 0;
  var pactFree = pactTotal - pactUsed;
  var pactRow = document.createElement("div");
  pactRow.className = "spell-slot-row spell-slot-pact";
  var pDiams = '<div class="ssl-diamonds">';
  // Дымка v5: пакт-ячейки — та же схема «свободные слева», клик ±1
  for (var pj = 0; pj < pactTotal; pj++) {
    var pIsFree = pj < pactFree;
    var pClickIdx = pIsFree ? pactUsed : pactUsed - 1;
    pDiams += '<div class="spell-diamond' + (pIsFree ? '' : ' used') + '" title="' + (pIsFree ? 'Потратить ячейку' : 'Вернуть ячейку') + '" onclick="togglePactSlot(' + pClickIdx + ')"></div>';
  }
  pDiams += '</div>';
  pactRow.innerHTML =
    '<div class="ssl-label"><span class="ssl-lvl">' + pactLvl + '</span><span class="ssl-ur">ур.</span><span class="ssl-pact">ПАКТ</span></div>' +
    pDiams +
    '<div class="ssl-counter"><span class="ssl-free' + (pactFree === 0 ? ' ssl-exhausted' : '') + '">' + pactFree + '</span><span class="ssl-sep">/</span><span class="ssl-total">' + pactTotal + '</span></div>' +
    '<div class="ssl-controls"><button class="ssl-btn" onclick="adjustPactSlots(-1)">−</button><button class="ssl-btn" onclick="adjustPactSlots(1)">+</button></div>';
  container.appendChild(pactRow);
}
if (container.children.length === 0) {
  // На случай если у не-колдуна без обычных ячеек ничего нет, и у колдуна 0 пактов
  container.innerHTML = '<div class="spell-slot-row spell-slot-empty"><span class="ssl-none">нет ячеек</span></div>';
}
// Дымка v5: зеркало ячеек в правом rail на ПК
try { if (typeof window.refreshRailSlots === 'function') window.refreshRailSlots(); } catch (e) {}
}
function togglePactSlot(index) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
if (!char.spells.pactUsed) char.spells.pactUsed = 0;
if (index < char.spells.pactUsed) char.spells.pactUsed = index;
else char.spells.pactUsed = index + 1;
if (window.AppLog) AppLog.action("spells", "ячейки пакта: использовано " + char.spells.pactUsed + "/" + (char.spells.pactSlots || 0));
saveToLocal();
renderSpellSlots();
}
function adjustPactSlots(delta) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
var current = char.spells.pactSlots || 0;
var newValue = current + delta;
if (newValue < 0) newValue = 0;
if (newValue > 10) newValue = 10;
char.spells.pactSlots = newValue;
if ((char.spells.pactUsed || 0) > newValue) char.spells.pactUsed = newValue;
if (window.AppLog) AppLog.action("spells", "пакт-слотов → " + newValue);
saveToLocal();
renderSpellSlots();
}
function updateSpellSlots(level, value) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
char.spells.slots[level] = parseInt(value, 10) || 0;
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
if (window.AppLog) AppLog.action("spells", "ячейки " + level + " ур.: использовано " + char.spells.slotsUsed[level] + "/" + (char.spells.slots[level] || 0));
saveToLocal();
renderSpellSlots();
}
function adjustSpellSlots(level, delta) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const input = $('slots-' + level + '-total');
let current = input ? parseInt(input.value, 10) : (char.spells.slots[level] || 0);
if (isNaN(current)) current = char.spells.slots[level] || 0;
let newValue = current + delta;
if (newValue < 0) newValue = 0;
if (newValue > 10) newValue = 10;
char.spells.slots[level] = newValue;
if (char.spells.slotsUsed[level] > newValue) {
char.spells.slotsUsed[level] = newValue;
}
if (window.AppLog) AppLog.action("spells", "слотов " + level + " ур. → " + newValue);
saveToLocal();
renderSpellSlots();
}
function restoreAllSlots() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
for(let i=1; i<=9; i++) { char.spells.slotsUsed[i] = 0; }
if (char.spells.pactSlots) char.spells.pactUsed = 0;
if (window.AppLog) AppLog.action("spells", "все ячейки восстановлены");
saveToLocal();
renderSpellSlots();
showToast("Ячейки заклинаний восстановлены!", "success");
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
document.querySelectorAll("#spell-search-modal .class-filter-btn, #spell-search-modal .class-filter-all").forEach(function(btn) { btn.classList.remove("active"); });
var btnId = "btn-class-" + (cls === "all" ? "all" : cls);
var btn = $(btnId);
if (btn) btn.classList.add("active");
renderSpellSearch();
}
// BUILD-LVL: ключ класса заклинаний персонажа (ru→en). Для мультикласса — первый класс-заклинатель.
function _charSpellClassKey(char) {
  var ruToKey = { "Волшебник":"wizard", "Чародей":"sorcerer", "Колдун":"warlock", "Бард":"bard",
                  "Жрец":"cleric", "Паладин":"paladin", "Друид":"druid", "Следопыт":"ranger" };
  if (!char) return null;
  if (ruToKey[char.class]) return ruToKey[char.class];
  if (Array.isArray(char.classes)) {
    for (var i = 0; i < char.classes.length; i++) { if (ruToKey[char.classes[i].class]) return ruToKey[char.classes[i].class]; }
  }
  return null;
}
// BUILD-LVL: высший доступный уровень заклинаний персонажа (по ячейкам/пакту). 0 = некастер/нет ячеек.
function _charMaxCastableLevel(char) {
  if (!char || !char.spells) return 0;
  var m = 0;
  if (char.spells.slots) for (var i = 1; i <= 9; i++) { if ((char.spells.slots[i] || 0) > 0) m = i; }
  if ((char.spells.pactLevel || 0) > m) m = char.spells.pactLevel;
  return m;
}
function openSpellSearch() {
const modal = $("spell-search-modal");
if (modal) modal.classList.add("active");
safeSet("spell-search-input", "");
safeSet("spell-search-level", "");
// BUILD-LVL: по умолчанию сужаем поиск до класса персонажа (чужие классы скрыты до явного выбора).
var _char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
var _ownKey = _charSpellClassKey(_char);
if (_ownKey) { setSpellClass(_ownKey); }            // setSpellClass уже вызывает renderSpellSearch
else { currentSpellClass = "all"; renderSpellSearch(); }
markCharOwnClassFilter();
}
// Подсвечивает класс активного персонажа (зелёный) и остальные кастеры (приглушённый красный),
// чтобы новички сразу понимали, какие заклинания им доступны.
function markCharOwnClassFilter() {
  var legend = $("class-filter-legend");
  var btns = document.querySelectorAll('#spell-class-filter .class-filter-btn');
  btns.forEach(function(b){ b.classList.remove('cf-own','cf-foreign'); b.removeAttribute('data-tip'); });
  if (!legend) return;
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (!char || !char.class) {
    legend.innerHTML = '<span class="cf-legend-hint">💡 Выберите класс слева, чтобы увидеть только его заклинания</span>';
    return;
  }
  var ruToKey = { "Волшебник":"wizard", "Чародей":"sorcerer", "Колдун":"warlock", "Бард":"bard",
                  "Жрец":"cleric", "Паладин":"paladin", "Друид":"druid", "Следопыт":"ranger" };
  var ownKey = ruToKey[char.class] || null;
  btns.forEach(function(b){
    var k = b.getAttribute('data-class');
    if (ownKey && k === ownKey) {
      b.classList.add('cf-own');
      b.setAttribute('data-tip','Ваш класс');
    } else {
      b.classList.add('cf-foreign');
      b.setAttribute('data-tip','Другой класс — заклинания недоступны вашему персонажу');
    }
  });
  if (ownKey) {
    legend.innerHTML = '<span class="cf-legend-own">🟢 Ваш класс: ' + escapeHtml(char.class) + '</span>'
                     + '<span class="cf-legend-foreign">🔴 Чужие классы — заклинания нельзя выучить</span>';
  } else {
    legend.innerHTML = '<span class="cf-legend-hint">💡 Класс «' + escapeHtml(char.class) + '» не использует заклинания этих школ — фильтр для справки</span>';
  }
}
function closeSpellSearch() {
const modal = $("spell-search-modal");
if (modal) modal.classList.remove("active");
// BUILD-LVL-4: обновить чек-лист guided level-up, если он открыт
if (typeof luRefreshChoices === "function") luRefreshChoices();
}
// HB-2: справочники и лимиты формы «Добавить своё».
// Ключи классов — те же, что в SPELL_CLASS_RU (без "both": он не выбирается вручную,
// а проставляется автоматически, когда не отмечен ни один класс).
const NEW_SPELL_CLASS_KEYS = ["wizard", "sorcerer", "warlock", "cleric", "druid", "bard", "paladin", "ranger"];
// Порядок и написание — как в SCHOOL_ICON_SLUGS (app-core.js): по этим строкам
// резолвится иконка школы, любое расхождение молча даёт карточку без иконки.
const NEW_SPELL_SCHOOLS = ["ограждение", "воплощение", "вызов", "прорицание", "очарование", "иллюзия", "некромантия", "преобразование"];
// Капы длины: у книжных заклинаний максимум — имя 34, описание 431, «на больших» 124.
// Запас кратный, но конечный — вставленная простыня иначе уезжает в localStorage целиком.
const NEW_SPELL_NAME_MAX = 60;
const NEW_SPELL_DESC_MAX = 2000;
const NEW_SPELL_HIGHER_MAX = 500;

// Скрытый CSV-инпут — источник истины по выбранным классам: он переживает
// перерисовку чипов, читается из submitNewSpell без обхода DOM и виден тестам.
function _parseSpellClassList(raw) {
  return String(raw || "").split(",").map(function(s) { return s.trim(); })
    .filter(function(k, i, arr) { return NEW_SPELL_CLASS_KEYS.indexOf(k) !== -1 && arr.indexOf(k) === i; });
}
function _syncNewSpellClassChips(list) {
  var chips = document.querySelectorAll("#new-spell-class-chips .filter-chip");
  if (!chips || !chips.forEach) return;
  chips.forEach(function(b) {
    b.classList.toggle("active", list.indexOf(b.getAttribute("data-class")) !== -1);
  });
}
function toggleNewSpellClass(key) {
  var hidden = $("new-spell-classes");
  if (!hidden || NEW_SPELL_CLASS_KEYS.indexOf(key) === -1) return;
  var list = _parseSpellClassList(hidden.value);
  var i = list.indexOf(key);
  if (i === -1) list.push(key); else list.splice(i, 1);
  hidden.value = list.join(",");
  _syncNewSpellClassChips(list);
}
function openAddSpellForm() {
const modal = $("add-spell-modal");
if (modal) modal.classList.add("active");
// HB-2: форма выросла с 3 полей до 12 — сбрасываем все. Раньше чистились только
// имя/описание/«на больших», и прошлый черновик (уровень, школа, время, дистанция)
// молча уезжал в следующее заклинание.
safeSet("new-spell-edit-id", "");
safeSet("new-spell-name", "");
safeSet("new-spell-level", "0");
safeSet("new-spell-school", "воплощение");
safeSet("new-spell-source", "PH14");
safeSet("new-spell-classes", "");
safeSet("new-spell-time", "1 действие");
safeSet("new-spell-range", "60 фт");
safeSet("new-spell-components", "V,S");
safeSet("new-spell-duration", "Мгновенно");
safeSet("new-spell-desc", "");
safeSet("new-spell-higher", "");
_syncNewSpellClassChips([]);
}
function closeAddSpellForm() {
const modal = $("add-spell-modal");
if (modal) modal.classList.remove("active");
}
function submitNewSpell() {
const name = $("new-spell-name")?.value?.trim() || "";
const desc = $("new-spell-desc")?.value?.trim() || "";
const higher = $("new-spell-higher")?.value?.trim() || "";
if (!name || !desc) { showToast("Название и описание обязательны!", "warn"); return; }
// HB-2: капы длины. maxlength на инпуте не спасает — в textarea его нет, а вставка
// через DevTools/импорт вообще минует разметку.
if (name.length > NEW_SPELL_NAME_MAX) { showToast("Название длиннее " + NEW_SPELL_NAME_MAX + " символов", "warn"); return; }
if (desc.length > NEW_SPELL_DESC_MAX) { showToast("Описание длиннее " + NEW_SPELL_DESC_MAX + " символов", "warn"); return; }
if (higher.length > NEW_SPELL_HIGHER_MAX) { showToast("«На больших уровнях» длиннее " + NEW_SPELL_HIGHER_MAX + " символов", "warn"); return; }
// Ни один класс не отмечен → "both": заклинание видно под любым фильтром,
// как книжные без привязки. Блокировать сохранение из-за этого не за что.
var classes = _parseSpellClassList($("new-spell-classes")?.value);
if (!classes.length) classes = ["both"];
var school = $("new-spell-school")?.value || "";
if (NEW_SPELL_SCHOOLS.indexOf(school) === -1) school = "воплощение";
// Date.now() один на миллисекунду: два быстрых сохранения подряд (или сохранение
// поверх импортированного хомбрю) дали бы одинаковый id, а addSpell/removeSpell/
// isSpellPrepared резолвят заклинание строго по нему — второе стало бы призраком.
var id = Date.now();
while (SPELL_DATABASE.some(function(s) { return s && s.id === id; })) id++;
// Совпадение имени не ломает базу (резолв по id), но в поиске записи неразличимы,
// а resolveSpellEffect (HB-4) уведёт каст по хомбрю-ветке — предупреждаем.
var isDupName = SPELL_DATABASE.some(function(s) {
  return s && s.name && s.name.toLowerCase() === name.toLowerCase();
});
const newSpell = {
id: id,
name: name,
level: parseInt($("new-spell-level")?.value, 10) || 0,
// classes — то, что читают renderSpellSearch/renderMySpells; class остаётся
// для легаси-веток, которые ещё берут одиночное поле.
classes: classes,
class: classes[0],
source: $("new-spell-source")?.value || "PH14",
// HB-1: признак «своё» — отдельное булево. source остаётся PH14/PH24 (редакция,
// под которую написан хомбрю): на нём висят matchesVersion, sourceRu и
// source.toLowerCase() в рендерах.
homebrew: true,
school: school,
time: $("new-spell-time")?.value || "1 действие",
range: $("new-spell-range")?.value || "60 фт",
components: $("new-spell-components")?.value || "V,S",
duration: $("new-spell-duration")?.value || "Мгновенно",
desc: desc,
higherLevel: higher
};
SPELL_DATABASE.push(newSpell);
if (window.AppLog) AppLog.action("spells", "своё заклинание создано: " + newSpell.name, { level: newSpell.level, school: newSpell.school, classes: classes.join(",") });
saveToLocal();
closeAddSpellForm();
if (isDupName) showToast("Добавлено, но заклинание с таким именем уже есть", "warn");
else showToast("Заклинание добавлено!", "success");
renderSpellSearch();
}
function renderSpellSearch() {
const search = ($("spell-search-input")?.value || "").toLowerCase();
const level = $("spell-search-level")?.value || "";
const container = $("spell-search-results");
if (!container) return;
if (firstLoadSkeleton("spell", "spell-search-results", 6, "list", renderSpellSearch)) return;
const char = getCurrentChar();
// BUILD-LVL: по умолчанию (без явно выбранного уровня) прячем заклинания выше доступного персонажу уровня.
const maxCastable = _charMaxCastableLevel(char);
let filtered = SPELL_DATABASE.filter(function(spell) {
const matchesSearch = spell.name.toLowerCase().includes(search);
const matchesLevel = level === "" || spell.level.toString() === level;
const matchesVersion = currentSpellVersion === "all" || spell.source === currentSpellVersion;
const spellClasses = Array.isArray(spell.classes) ? spell.classes : [spell.class || "both"];
const matchesClass = currentSpellClass === "all" || spellClasses.includes("both") || spellClasses.includes(currentSpellClass);
const matchesCap = !(level === "" && maxCastable > 0 && spell.level > maxCastable);
return matchesSearch && matchesLevel && matchesVersion && matchesClass && matchesCap;
});
container.innerHTML = "";
if (filtered.length === 0) {
container.innerHTML = '<p style="color:var(--text-muted); text-align:center;">Не найдено</p>';
return;
}

var countEl = $("spell-search-count");
if (countEl) countEl.textContent = "Найдено: " + filtered.length;

if (!search.trim() && level === "" && currentSpellVersion === "all" && currentSpellClass === "all") {
container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px 0;">🔍 Введите название или выберите класс/уровень</p>';
return;
}

var LIMIT = 80;
var shown = filtered.slice(0, LIMIT);
shown.forEach(function(spell) {
const isAdded = char?.spells?.mySpells && char.spells.mySpells.some(function(s) { return s.id === spell.id; });
const spellClassArr = Array.isArray(spell.classes) ? spell.classes : [spell.class || "both"];
const primaryClass = spellClassArr.length === 1 ? spellClassArr[0] : (spellClassArr.includes(currentSpellClass) ? currentSpellClass : spellClassArr[0]);
const classBadge = "class-" + (primaryClass || "both");
const classText = spellClassArr.length > 1 ? spellClassArr.map(function(c){return getSpellClassIcon(c);}).join("") : getSpellClassIcon(primaryClass);
// HB-1: source может отсутствовать у импортированной записи — без фолбэка
// toLowerCase() роняет весь рендер поиска.
const srcRaw = spell.source || "PH14";
const hbBadge = spell.homebrew ? " <span class=\"source-badge hb-badge\" title=\"Ваше заклинание\">🏠 Своё</span>" : "";
var div = document.createElement("div");
div.className = "spell-item" + (isAdded ? " spell-added" : "");
div.innerHTML = "<h4>" + highlightMatch(spell.name, search) + " <span class=\"source-badge source-" + srcRaw.toLowerCase() + "\">" + escapeHtml(srcRaw) + "</span>" + hbBadge + " <span class=\"class-badge " + classBadge + "\">" + classText + "</span></h4><div class=\"spell-meta\"><span>" + (spell.level > 0 ? spell.level + " ур." : "Заговор") + "</span><span>" + escapeHtml(spell.time) + "</span><span>" + escapeHtml(spell.range) + "</span><span>" + escapeHtml(spell.components) + "</span></div><p>" + escapeHtml(spell.desc) + "</p>" + (spell.higherLevel ? "<p class=\"spell-higher\">" + escapeHtml(spell.higherLevel) + "</p>" : "") + "<button class=\"" + (isAdded ? "secondary" : "small") + "\" onclick=\"" + (isAdded ? "removeSpell(" + spell.id + ")" : "addSpell(" + spell.id + ")") + "\" style=\"margin-top:8px;\">" + (isAdded ? "Добавлено" : "+ Добавить") + "</button>";
container.appendChild(div);
});
if (filtered.length > LIMIT) {
var more = document.createElement("p");
more.style.cssText = "text-align:center;color:var(--text-muted);padding:12px 0;";
more.textContent = "Показано " + LIMIT + " из " + filtered.length + " — уточните поиск";
container.appendChild(more);
}
}
function addSpell(spellId) {
const char = getCurrentChar();
if (!char) return;
const spell = SPELL_DATABASE.find(function(s) { return s.id === spellId; });
if (!spell) return;
if (!char.spells.mySpells) char.spells.mySpells = [];
if (!char.spells.mySpells.some(function(s) { return s.id === spellId; })) {
char.spells.mySpells.push(spell);
if (window.AppLog) AppLog.action("spells", "заклинание добавлено: " + spell.name, { id: spell.id, level: spell.level });
saveToLocal();
renderSpellSearch();
renderMySpells();
}
}
function removeSpell(spellId) {
const char = getCurrentChar();
if (!char) return;
if (!char.spells.mySpells) return;
var _rm = char.spells.mySpells.find(function(s) { return s.id === spellId; });
char.spells.mySpells = char.spells.mySpells.filter(function(s) { return s.id !== spellId; });
if (window.AppLog) AppLog.action("spells", "заклинание удалено" + (_rm ? ": " + _rm.name : ""), { id: spellId });
saveToLocal();
renderSpellSearch();
renderMySpells();
}
function toggleSpellCard(header) {
  var card = header.closest(".my-spell-item");
  if (!card) return;
  card.classList.toggle("expanded");
  var arrow = header.querySelector(".spell-card-arrow");
  if (arrow) arrow.textContent = card.classList.contains("expanded") ? "▼" : "▶";
}
function renderMySpells() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const container = $("my-spells-list");
if (!container) return;
renderPrepCounter();
if (!char.spells.mySpells || char.spells.mySpells.length === 0) {
container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 24px 0;">✨ Нет заклинаний — нажмите «Найти заклинание»</p>';
return;
}
// CAST-6: живые экземпляры каста по имени заклинания — бейдж «Активно · ⏳N рд»
var activeCast = {};
(char.activeSpellEffects || []).forEach(function(inst) { activeCast[inst.spellName] = inst; });
const byLevel = {};
char.spells.mySpells.forEach(function(spell) {
const lvl = spell.level;
if (!byLevel[lvl]) byLevel[lvl] = [];
byLevel[lvl].push(spell);
});
container.innerHTML = "";
Object.keys(byLevel).sort(function(a,b){return a-b;}).forEach(function(level) {
const levelTitle = level == 0 ? "Заговоры" : level + " уровень";
const count = byLevel[level].length;
const groupDiv = document.createElement("div");
groupDiv.className = "spell-level-group";
groupDiv.innerHTML = '<div class="spell-group-header"><span class="spell-group-title">' + escapeHtml(levelTitle) + '</span><span class="spell-group-count">' + count + '</span></div>';
container.appendChild(groupDiv);
var ritualClasses = ["Волшебник", "Жрец", "Друид", "Бард"];
byLevel[level].forEach(function(spell, _idx) {
const spellClassArr2 = Array.isArray(spell.classes) ? spell.classes : [spell.class || "both"];
// Больше 4 классов не влезают на телефоне и вытесняют название — первые 3 + счётчик «+N».
// Полный список имён — в строке таксономии раскрытой карточки.
var classIcons;
if (spellClassArr2.length > 4) {
  classIcons = spellClassArr2.slice(0, 3).map(function(c){ return getSpellClassIcon(c); }).join("") +
    '<span class="class-icons-more">+' + (spellClassArr2.length - 3) + '</span>';
} else {
  classIcons = spellClassArr2.map(function(c){ return getSpellClassIcon(c); }).join("");
}
const srcRaw = spell.source || "PH14"; // HB-1: у импортированной записи source может отсутствовать
const sourceClass = "source-" + srcRaw.toLowerCase();
const schoolName = spell.school || "";
// Подписи для новичков: школа/классы/источник текстом в раскрытой карточке.
var classNamesRu = spellClassArr2.map(function(c){
  return (typeof SPELL_CLASS_RU !== "undefined" && SPELL_CLASS_RU[c]) || c;
}).join(", ");
var schoolRu = schoolName ? schoolName.charAt(0).toUpperCase() + schoolName.slice(1) : "";
var sourceRu = srcRaw === "PH14" ? "Книга игрока 2014" : (srcRaw === "PH24" ? "Книга игрока 2024" : srcRaw);
var taxonomyLine = '<div class="spell-card-taxonomy">' +
  (schoolRu ? '<span>🎓 Школа: <b>' + escapeHtml(schoolRu) + '</b></span>' : '') +
  '<span>🧙 Классы: <b>' + escapeHtml(classNamesRu) + '</b></span>' +
  (sourceRu ? '<span>📖 <b>' + escapeHtml(sourceRu) + '</b></span>' : '') +
  '</div>';
var isRitual = !!(spell.time && spell.time.includes("(ритуал)"));
var canCastRitual = isRitual && ritualClasses.includes(char.class);
var isFamiliarSpell = /фамильяр/i.test(spell.name || "");
var metaParts = [];
if (spell.time) metaParts.push('<span>⚡ ' + escapeHtml(spell.time) + '</span>');
if (spell.range) metaParts.push('<span>📏 ' + escapeHtml(spell.range) + '</span>');
if (spell.components) metaParts.push('<span>' + escapeHtml(spell.components) + '</span>');
if (spell.duration) metaParts.push('<span>⏱ ' + escapeHtml(spell.duration) + '</span>');
var prepClass = isPrepClass(char);
var prepared = isSpellPrepared(char, spell.id);
var isCantrip = spell.level === 0;
var cardClass = "my-spell-item";
if (prepClass && !isCantrip && !prepared) cardClass += " spell-unprepared";
var card = document.createElement("div");
card.className = cardClass + " rise";
card.style.setProperty("--i", Math.min(_idx, 10)); // Дымка v5: stagger-появление
card.dataset.spellId = spell.id;
card.dataset.spellName = spell.name; // CAST-6: ключ для updateSpellActiveBadges
card.innerHTML =
  '<div class="spell-card-header" onclick="toggleSpellCard(this)">' +
    '<div class="spell-card-title">' +
      '<span class="spell-card-arrow">▶</span>' +
      '<span class="spell-card-name">' + escapeHtml(spell.name) + '</span>' +
      (isRitual ? '<span class="ritual-badge" title="Ритуал">🕐<span class="ritual-badge-text"> Ритуал</span></span>' : '') +
      (activeCast[spell.name] ? _spellActiveBadgeHtml(activeCast[spell.name]) : '') +
    '</div>' +
    '<div class="spell-card-badges">' +
      '<span class="source-badge ' + sourceClass + '">' + escapeHtml(srcRaw) + '</span>' +
      (spell.homebrew ? '<span class="source-badge hb-badge" title="Ваше заклинание">🏠 Своё</span>' : '') +
      (schoolName ? '<span class="school-badge school-' + getSchoolSlug(schoolName) + '">' + getSchoolIcon(schoolName) + '<span class="school-badge-text">' + escapeHtml(schoolName) + '</span></span>' : '') +
      '<span class="class-icons-row">' + classIcons + '</span>' +
    '</div>' +
  '</div>' +
  '<div class="spell-card-meta">' + metaParts.join("") + '</div>' +
  '<div class="spell-card-body">' +
    taxonomyLine +
    (spell.desc ? '<div class="spell-full-desc">' + escapeHtml(spell.desc) + '</div>' : '') +
    (spell.higherLevel ? '<div class="spell-higher">📈 На больших уровнях: ' + escapeHtml(spell.higherLevel) + '</div>' : '') +
    '<div class="spell-card-actions">' +
    '<button class="spell-cast-btn" onclick="castSpell(' + spell.id + ')">✨ Использовать</button>' +
    (spell.duration && spell.duration.toLowerCase().includes('концентрац') ? '<button class="spell-conc-btn" onclick="setConcentration(this.dataset.name)" data-name="' + escapeHtml(spell.name) + '">🔮 Концентрация</button>' : '') +
    (canCastRitual ? '<button class="spell-ritual-btn" onclick="castRitual(\'' + escapeHtml(spell.name).replace(/'/g,"&#39;") + '\')">🕐 Ритуал</button>' : '') +
    (prepClass && !isCantrip ? '<button class="spell-prep-btn' + (prepared ? ' spell-prep-active' : '') + '" onclick="toggleSpellPrepared(' + spell.id + ')">' + (prepared ? '✅ Подготовлено' : '○ Подготовить') + '</button>' : '') +
    (isFamiliarSpell ? '<button class="spell-summon-btn" onclick="summonFamiliar()">🐾 Призвать фамильяра</button>' : '') +
    '<button class="spell-remove-btn" onclick="removeSpell(' + spell.id + ')">🗑 Удалить</button>' +
    '</div>' +
  '</div>';
groupDiv.appendChild(card);
});
});
}
// CAST-6: бейдж «Активно · ⏳N рд» в заголовке карточки заклинания с живым
// экземпляром каста (char.activeSpellEffects). Полный рендер списка ставит
// бейджи сам (activeCast в renderMySpells); точечные изменения — каст, снятие,
// тик раундов — обновляет updateSpellActiveBadges НА МЕСТЕ, не перерисовывая
// список (раскрытая карточка не схлопывается под пальцами).
// CAST-8a: выбранный вариант каста (inst.variantName) — между «Активно» и остатком.
function _spellActiveBadgeText(inst) {
  return "✨ Активно" + (inst.variantName ? " · " + inst.variantName : "") +
    (inst.roundsLeft != null ? " · ⏳" + inst.roundsLeft + " рд" : "");
}
function _spellActiveBadgeHtml(inst) {
  return '<span class="spell-active-badge">' + escapeHtml(_spellActiveBadgeText(inst)) + '</span>';
}
function updateSpellActiveBadges() {
  var container = $("my-spells-list");
  if (!container || typeof container.querySelectorAll !== "function") return;
  var char = (typeof currentId !== "undefined" && currentId) ? getCurrentChar() : null;
  var activeCast = {};
  ((char && char.activeSpellEffects) || []).forEach(function(inst) { activeCast[inst.spellName] = inst; });
  Array.prototype.forEach.call(container.querySelectorAll(".my-spell-item"), function(card) {
    var inst = activeCast[card.dataset ? card.dataset.spellName : null];
    var badge = card.querySelector(".spell-active-badge");
    if (!inst) { if (badge) badge.remove(); return; }
    if (badge) { badge.textContent = _spellActiveBadgeText(inst); return; }
    var title = card.querySelector(".spell-card-title");
    if (title) title.insertAdjacentHTML("beforeend", _spellActiveBadgeHtml(inst));
  });
}
// ── Подготовка заклинаний ────────────────────────────────────
function calcMaxPrepared(char) {
  if (!char || !char.class) return null;
  var prep = SPELL_PREP_CLASSES[char.class];
  if (!prep) return null;
  var statKey = prep.stat; // "wis", "cha", "int"
  var statVal = char.stats ? (char.stats[statKey] || 10) : 10;
  var mod = Math.floor((statVal - 10) / 2);
  var level = char.level || 1;
  var max;
  if (prep.formula === "mod+halfLevel") {
    max = mod + Math.floor(level / 2);
  } else {
    max = mod + level;
  }
  return Math.max(1, max);
}

function isPrepClass(char) {
  return !!(char && char.class && SPELL_PREP_CLASSES[char.class]);
}

function isSpellPrepared(char, spellId) {
  if (!isPrepClass(char)) return true; // для не-prep классов все заклинания "подготовлены"
  if (!char.spells.prepared) char.spells.prepared = [];
  return char.spells.prepared.includes(spellId);
}

function toggleSpellPrepared(spellId) {
  const char = getCurrentChar();
  if (!char) return;
  if (!char.spells.prepared) char.spells.prepared = [];
  var idx = char.spells.prepared.indexOf(spellId);
  if (idx >= 0) {
    char.spells.prepared.splice(idx, 1);
  } else {
    var max = calcMaxPrepared(char);
    var nonCantripPrepared = char.spells.prepared.filter(function(id) {
      var sp = char.spells.mySpells.find(function(s){ return s.id === id; });
      return sp && sp.level > 0;
    }).length;
    if (max !== null && nonCantripPrepared >= max) {
      if (window.AppLog) AppLog.warn("spells", "лимит подготовленных заклинаний (" + max + ")");
      showToast("Достигнут лимит подготовленных заклинаний (" + max + ")", "warn");
      return;
    }
    char.spells.prepared.push(spellId);
  }
  if (window.AppLog) {
    var _sp = char.spells.mySpells && char.spells.mySpells.find(function(s){ return s.id === spellId; });
    AppLog.action("spells", (idx >= 0 ? "подготовка снята: " : "подготовлено: ") + (_sp ? _sp.name : spellId));
  }
  saveToLocal();
  renderMySpells();
  renderPrepCounter();
}

function renderPrepCounter() {
  const char = getCurrentChar();
  const el = $("prep-counter");
  if (!el) return;
  if (!char || !isPrepClass(char)) {
    el.style.display = "none";
    return;
  }
  if (!char.spells.prepared) char.spells.prepared = [];
  var max = calcMaxPrepared(char);
  // Считаем только не-заговоры
  var prepCount = char.spells.prepared.filter(function(id) {
    var sp = char.spells.mySpells ? char.spells.mySpells.find(function(s){ return s.id === id; }) : null;
    return sp && sp.level > 0;
  }).length;
  var prep = SPELL_PREP_CLASSES[char.class];
  var statName = { wis: "МУД", cha: "ХАР", int: "ИНТ" }[prep.stat] || "";
  // PHB 2014: жрец/друид/волшебник готовят «мод + уровень», паладин — «мод + ½ уровня».
  var lvlLabel = prep.formula === "mod+halfLevel" ? "½ ур." : "ур.";
  el.style.display = "";
  el.innerHTML = '<span class="prep-icon">📋</span><span class="prep-label">Подготовлено:</span><span class="prep-count' + (prepCount >= max ? " prep-full" : "") + '">' + prepCount + '</span><span class="prep-sep">/</span><span class="prep-max">' + max + '</span><span class="prep-hint">(' + statName + ' + ' + lvlLabel + ')</span>';
}

// ── Использование заклинания (трата ячейки из карточки) ─────
// Варианты ячеек для каста: обычные уровней spell.level..9 со свободными
// + пакт-ячейки колдуна (их уровень не ниже уровня заклинания).
function _castableSlotOptions(char, spell) {
  var opts = [];
  if (!char || !char.spells || !spell) return opts;
  var minLvl = Math.max(1, spell.level || 0);
  for (var i = minLvl; i <= 9; i++) {
    var free = (char.spells.slots[i] || 0) - (char.spells.slotsUsed[i] || 0);
    if (free > 0) opts.push({ type: "slot", level: i, free: free });
  }
  var pactFree = (char.spells.pactSlots || 0) - (char.spells.pactUsed || 0);
  var pactLvl = char.spells.pactLevel || 0;
  if (pactFree > 0 && pactLvl >= minLvl) opts.push({ type: "pact", level: pactLvl, free: pactFree });
  return opts;
}

function castSpell(spellId) {
  const char = getCurrentChar();
  if (!char) return;
  var spell = (char.spells.mySpells || []).find(function(s){ return s.id === spellId; });
  if (!spell) return;
  // Заговоры кастуются без ячеек
  if ((spell.level || 0) === 0) { _finishCast(char, spell, null); return; }
  if (isPrepClass(char) && !isSpellPrepared(char, spell.id)) {
    showToast("«" + spell.name + "» не подготовлено — сначала нажмите «Подготовить»", "warn");
    return;
  }
  var opts = _castableSlotOptions(char, spell);
  if (opts.length === 0) {
    showToast("Нет свободных ячеек " + spell.level + " уровня и выше", "warn");
    return;
  }
  // Единственный вариант — тратим сразу; несколько (апкаст/пакт) — выбор уровня
  if (opts.length === 1) { _castSpellWithSlot(spellId, opts[0].type, opts[0].level); return; }
  openCastChooser(spell, opts);
}

function _castSpellWithSlot(spellId, slotType, level) {
  const char = getCurrentChar();
  if (!char) return;
  var spell = (char.spells.mySpells || []).find(function(s){ return s.id === spellId; });
  if (!spell) return;
  if (slotType === "pact") {
    if ((char.spells.pactSlots || 0) - (char.spells.pactUsed || 0) <= 0) {
      showToast("Нет свободных пакт-ячеек", "warn"); return;
    }
    char.spells.pactUsed = (char.spells.pactUsed || 0) + 1;
  } else {
    if ((char.spells.slots[level] || 0) - (char.spells.slotsUsed[level] || 0) <= 0) {
      showToast("Нет свободных ячеек " + level + " уровня", "warn"); return;
    }
    char.spells.slotsUsed[level] = (char.spells.slotsUsed[level] || 0) + 1;
  }
  closeCastChooser();
  saveToLocal();
  renderSpellSlots();
  _finishCast(char, spell, { type: slotType, level: level });
}

function _finishCast(char, spell, slot) {
  var note;
  if (slot) {
    var freeLeft = slot.type === "pact"
      ? (char.spells.pactSlots || 0) - (char.spells.pactUsed || 0)
      : (char.spells.slots[slot.level] || 0) - (char.spells.slotsUsed[slot.level] || 0);
    note = " — " + (slot.type === "pact" ? "пакт-ячейка" : "ячейка") + " " + slot.level + " ур. (осталось " + freeLeft + ")";
  } else {
    note = " (заговор, без ячейки)";
  }
  if (window.AppLog) AppLog.action("spells", "заклинание использовано: " + spell.name + note);
  showToast("✨ «" + spell.name + "»" + note, "success");
  // Заклинание с концентрацией сразу ставит концентрацию (повторный каст того же — не трогаем).
  // Порядок критичен (CAST-1): setConcentration снимет эффекты старого заклинания,
  // applyCastEffects после — добавит новые.
  if (spell.duration && spell.duration.toLowerCase().includes("концентрац") &&
      typeof setConcentration === "function" && char.concentration !== spell.name) {
    setConcentration(spell.name);
  }
  applyCastEffects(char, spell, slot);
}

// CAST-1: мост от каста к механике — дескриптор из SPELL_EFFECTS (spell-effects.js).
// Ветка effects: карточки идут в char.effects (идемпотентно — ручной toggleEffect
// мог включить их раньше), экземпляр-трекер — в char.activeSpellEffects; повторный
// каст того же заклинания заменяет свой экземпляр (refresh таймера, без дублей).
// CAST-3: ветки heal (бросок → quickHP), tempHp (правило max), hpMaxBonus («Подмога»).
// CAST-4: ветка damage — 3D-бросок формулы урона (заговоры по тирам уровня персонажа).
// CAST-5: ветка summon — модалка спутника с предзаполнением (_applyCastSummon).
// CAST-10: ветка debuff — эффект вешается на УЧАСТНИКА трекера боя (чип), а не
// на себя: пикер целей в app-party.js.
// CAST-9a: ветка repeat — заклинание бьёт каждый раунд: экземпляр помечается
// {repeat, repeatFormula}, повтор игрок кидает кнопкой в шапке трекера боя.
// CAST-8a: дескриптор с variants сперва спрашивает вариант (openCastVariantChooser)
// и возвращается сюда с выбором. variant === undefined — «ещё не спрашивали»,
// null — спросили и отменили (применяем без варианта).
function applyCastEffects(char, spell, slot, variant) {
  var d = (typeof getSpellEffect === "function") ? getSpellEffect(spell.name, spell.source) : null;
  if (!d) return;
  if (d.variants && variant === undefined) { openCastVariantChooser(spell, slot, d); return; }
  _castInstanceThisCast = null; // CAST-10: см. _ensureCastInstance
  var vExtra = variant ? { variantId: variant.id, variantName: variant.name } : null;
  if (d.effects && d.effects.length) {
    if (!char.effects) char.effects = [];
    var names = [];
    d.effects.forEach(function(id) {
      if (char.effects.indexOf(id) === -1) char.effects.push(id);
      var card = (typeof EFFECTS_DATA !== "undefined") &&
        EFFECTS_DATA.find(function(e) { return e.id === id; });
      names.push(card ? card.name : id);
    });
    _replaceCastInstance(char, spell, d, slot, vExtra);
    var vNote = variant ? " · " + variant.name : "";
    if (window.AppLog) AppLog.action("spells", "эффект от каста: " + spell.name + " → " + names.join(", ") + vNote);
    showToast("✨ Эффект: " + names.join(", ") + vNote, "info");
    if (typeof calculateAC === "function") calculateAC();
    if (typeof updateEffectsCount === "function") updateEffectsCount();
    if (typeof updateStatusBar === "function") updateStatusBar();
    if (typeof renderEffectsGrid === "function") renderEffectsGrid();
    saveToLocal();
  }
  if (d.damage) _applyCastDamage(char, spell, d, slot, variant);
  if (d.repeat) _startCastRepeat(char, spell, d, slot, variant);
  if (d.debuff) _applyCastDebuff(char, spell, d, slot, variant);
  if (d.heal) _applyCastHeal(char, spell, d, slot);
  if (d.tempHp) _applyCastTempHp(char, spell, d, slot);
  if (d.hpMaxBonus) _applyCastHpMaxBonus(char, spell, d, slot);
  if (d.summon) _applyCastSummon(char, spell, d, slot);
}

// CAST-8a: мини-чузер варианта каста («Защита от энергии» — тип урона, «Огненный
// щит» — тёплый/холодный, «Увеличение/уменьшение» — режим, «Проклятие» — эффект,
// «Цветной шарик» — тип урона). Открывается ПОСЛЕ выбора ячейки: она уже
// потрачена, поэтому отмена не отменяет каст, а применяет его без варианта
// (pickCastVariant(-1)). Модалка строится на лету (паттерн _renderCastDamageModal,
// app-party.js) — index.html не трогаем.
var _castVariantPending = null;
function openCastVariantChooser(spell, slot, d) {
  _castVariantPending = { spell: spell, slot: slot, options: d.variants.options || [] };
  var modal = $("cast-variant-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "cast-variant-modal";
    modal.className = "confirm-modal-overlay";
    modal.innerHTML =
      '<div class="confirm-modal-box cast-variant-box">' +
        '<div class="confirm-modal-icon">✨</div>' +
        '<h4 id="cast-variant-title"></h4>' +
        '<div id="cast-variant-hint" class="cast-variant-hint"></div>' +
        '<div id="cast-variant-options" class="cast-variant-options"></div>' +
        '<div class="confirm-modal-btns" style="margin-top:14px">' +
          '<button class="confirm-btn-cancel" onclick="pickCastVariant(-1)">Без выбора</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function(e) { if (e.target === modal) pickCastVariant(-1); });
  }
  var title = $("cast-variant-title");
  if (title) title.textContent = "«" + spell.name + "»";
  var hint = $("cast-variant-hint");
  if (hint) hint.textContent = d.variants.label || "Выберите вариант";
  var box = $("cast-variant-options");
  if (box) {
    // name — короткое (уходит в бейдж карточки), hint — механика варианта
    box.innerHTML = _castVariantPending.options.map(function(o, i) {
      return '<button type="button" class="cast-variant-option" onclick="pickCastVariant(' + i + ')">' +
        '<span class="cvo-name">' + escapeHtml(o.name) + '</span>' +
        (o.hint ? '<span class="cvo-hint">' + escapeHtml(o.hint) + '</span>' : '') +
        '</button>';
    }).join("");
  }
  modal.classList.add("active");
}

// i < 0 — «Без выбора»/клик мимо: каст применяется без варианта (ячейка потрачена).
function pickCastVariant(i) {
  var pend = _castVariantPending;
  closeCastVariantChooser();
  if (!pend) return;
  var char = getCurrentChar();
  if (!char) return;
  var variant = (i >= 0 && pend.options[i]) ? pend.options[i] : null;
  applyCastEffects(char, pend.spell, pend.slot, variant);
}

function closeCastVariantChooser() {
  var modal = $("cast-variant-modal");
  if (modal) modal.classList.remove("active");
  _castVariantPending = null;
}

// CAST-5: призывы — модалка спутника с предзаполнением из дескриптора
// (picker → пикер форм фамильяра, srdSlug → SRD-бестиарий с ленивой загрузкой,
// prefill/byLevel → статичные поля с оверрайдом по уровню ячейки, см.
// buildCompanionPrefill в spell-effects.js). Призыв с duration получает
// экземпляр-трекер {summon:true}: конец/смена концентрации и экспирация
// покажут «существо исчезает» (removeCastEffectsForSpell), сам спутник из
// списка НЕ удаляется — вычёркивает игрок.
function _applyCastSummon(char, spell, d, slot) {
  if (d.duration) {
    _replaceCastInstance(char, spell, d, slot, { summon: true });
    saveToLocal();
  }
  if (d.summon.picker === "familiarForms") {
    if (typeof summonFamiliar === "function") summonFamiliar();
    return;
  }
  var open = function() {
    if (typeof buildCompanionPrefill !== "function" ||
        typeof openPrefilledCompanionModal !== "function") return;
    var prefill = buildCompanionPrefill(d.summon, slot ? slot.level : (spell.level || 0));
    openPrefilledCompanionModal(prefill, "✨ Призыв: " + spell.name);
    if (window.AppLog) AppLog.action("spells", "призыв от каста: " + spell.name +
      (prefill && prefill.name ? " → " + prefill.name : ""));
  };
  // PERF-3: SRD-бестиарий ленивый — гарантируем данные до построения префилла
  // (паттерн openSrdMonsterPicker, app-party.js).
  if (d.summon.srdSlug && !window.MONSTERS_SRD && typeof window.ensureBestiary === "function") {
    window.ensureBestiary().catch(function(e) {
      if (window.__catchLog) window.__catchLog("cast:summon-bestiary", e);
      if (typeof showToast === "function") showToast("Бестиарий не загрузился — проверьте сеть", "warn");
    }).then(open);
    return;
  }
  open();
}

// CAST-10: id экземпляра — время каста, но строго растущее: на id завязаны
// кнопка повтора (CAST-9a) и чип дебаффа на участнике боя, а два каста в одну
// миллисекунду дали бы одинаковый Date.now() и чип прошлого каста прилип бы к
// новому экземпляру.
var _lastCastInstanceId = 0;
function _nextCastInstanceId() {
  _lastCastInstanceId = Math.max(Date.now(), _lastCastInstanceId + 1);
  return _lastCastInstanceId;
}

// Экземпляр-трекер каста в char.activeSpellEffects: повторный каст того же
// заклинания заменяет свой экземпляр (refresh таймера, без дублей). extra —
// доп. поля экземпляра (tempHpApplied, hpMaxBonus). Возвращает экземпляр.
function _replaceCastInstance(char, spell, d, slot, extra) {
  if (!char.activeSpellEffects) char.activeSpellEffects = [];
  char.activeSpellEffects = char.activeSpellEffects.filter(function(inst) {
    return inst.spellName !== spell.name;
  });
  var inst = {
    id: _nextCastInstanceId(),
    spellName: spell.name,
    source: spell.source || null,
    effectIds: (d.effects || []).slice(),
    slotLevel: slot ? slot.level : null,
    concentration: !!(spell.duration && spell.duration.toLowerCase().includes("концентрац")),
    unit: d.duration ? d.duration.unit : null,
    value: d.duration ? d.duration.value : null,
    roundsLeft: (typeof durationToRounds === "function") ? durationToRounds(d.duration) : null
  };
  if (extra) Object.keys(extra).forEach(function(k) { inst[k] = extra[k]; });
  char.activeSpellEffects.push(inst);
  _castInstanceThisCast = inst;
  updateSpellActiveBadges(); // CAST-6: бейдж «Активно» на карточке заклинания
  return inst;
}

// CAST-10: экземпляр, созданный ТЕКУЩИМ проходом applyCastEffects (сбрасывается
// в его начале, ветки идут синхронно одна за другой). Ветки repeat/debuff
// дописывают поля в общий экземпляр каста, но искать его по имени нельзя:
// у дескриптора без effects/heal своего экземпляра в этом проходе ещё нет, и
// поиск находил бы экземпляр ПРОШЛОГО каста — таймер не обновлялся бы, а чип
// дебаффа прилипал к мёртвому id.
var _castInstanceThisCast = null;
function _ensureCastInstance(char, spell, d, slot, extra) {
  if (_castInstanceThisCast) {
    if (extra) Object.keys(extra).forEach(function(k) { _castInstanceThisCast[k] = extra[k]; });
    return _castInstanceThisCast;
  }
  if (!d.duration) return null; // без длительности трекать нечего
  return _replaceCastInstance(char, spell, d, slot, extra);
}

// CAST-4: урон — формула по типу заклинания (заговор: тиры 5/11/17 по уровню
// персонажа, слот null; уровневое: апкаст ячейкой), 3D-бросок в арене с
// подписью уровня ячейки. При save — тост «спасбросок цели, СЛ заклинателя».
// CAST-7a: attack — сначала d20 + бонус атаки заклинаний (quickRoll): нат. 1 —
// промах, урон не бросается; нат. 20 — кубы урона ×2 (critFormula); volley —
// один бросок атаки на весь залп (упрощение, фиксируется тостом, крит удваивает
// весь залп). CAST-7b: итог броска урона предлагается целям трекера боя
// (offerCastDamageToBattle, app-party.js) — вне боя бросок информационный.
// Экземпляр-трекер не создаётся (урон мгновенный).
// CAST-8a: variant (тип урона «Цветного шарика») уходит в подпись броска.
var _SAVE_LABELS = { str: "СИЛ", dex: "ЛОВ", con: "ТЕЛ", int: "ИНТ", wis: "МУД", cha: "ХАР" };
function _applyCastDamage(char, spell, d, slot, variant) {
  var castLevel = slot ? slot.level : null;
  var formula = (typeof damageFormulaFor === "function")
    ? damageFormulaFor(d.damage, spell.level || 0, castLevel, char.level || 1) : "";
  _rollCastDamage(char, {
    spellName: spell.name, dmg: d.damage, formula: formula, castLevel: castLevel,
    variantName: variant ? variant.name : null
  });
}

// CAST-9a: общий путь броска урона — начальный тик (_applyCastDamage) и
// повторный (castRepeatDamage) отличаются только формулой, подписью и
// дескриптором (damage / repeat), схема полей у них одна.
// CAST-9a: addSpellMod — модификатор заклинательной характеристики в урон
// («Божественное оружие»); дописывается в формулу ДО critFormula, поэтому крит
// удваивает кубы, а модификатор оставляет как есть (правило 5e).
function _rollCastDamage(char, o) {
  var formula = o.formula;
  if (!formula || typeof rollFormula !== "function") return;
  var dmg = o.dmg || {};
  if (dmg.addSpellMod) {
    var sm = castStatMod(char);
    if (sm) formula += (sm > 0 ? "+" + sm : String(sm));
  }
  if (dmg.save) {
    var saveName = _SAVE_LABELS[dmg.save] || String(dmg.save).toUpperCase();
    var dc = char.spells && char.spells.dc;
    var saveNote = "спасбросок " + saveName + (dc ? ", СЛ " + dc : "") +
      (dmg.halfOnSave ? " — половина урона при успехе" : " — при успехе урона нет");
    showToast("🎯 " + saveNote.charAt(0).toUpperCase() + saveNote.slice(1), "info");
    if (window.AppLog) AppLog.action("spells", "«" + o.spellName + "»: " + saveNote);
  }
  // CAST-11: у «кар» и залповых заклинаний повторный тик — не «повтор», а первое
  // попадание оружием / выстрел сферой. Дескриптор repeat может переопределить
  // иконку и слово подписи (icon/label); по умолчанию — «🔁 … · повтор».
  var icon = o.isRepeat ? (dmg.icon || "🔁") : "💥";
  var rollDamage = function(crit) {
    var f = (crit && typeof critFormula === "function") ? critFormula(formula) : formula;
    rollFormula(f, {
      label: icon + " " + o.spellName + (o.castLevel ? " · " + o.castLevel + " ур." : "") +
        (o.variantName ? " · " + o.variantName : "") +
        (o.isRepeat ? " · " + (dmg.label || "повтор") : "") + (crit ? " · КРИТ ×2" : ""),
      openArena: true,
      onResult: function(res) {
        if (typeof offerCastDamageToBattle === "function")
          offerCastDamageToBattle(o.spellName, res.total, { half: !!(dmg.save && dmg.halfOnSave) });
      }
    });
  };
  if (dmg.attack && typeof quickRoll === "function") {
    if (dmg.volley) showToast("🏹 Мультилучевое: один бросок атаки на весь залп (упрощение)", "info");
    quickRoll({
      label: "🎯 Атака: " + o.spellName,
      sides: 20,
      mod: castSpellAttackMod(char),
      onResult: function(comp) {
        if (comp.isFail) {
          showToast("💨 Натуральная 1 — промах, урон не бросается", "warn");
          if (window.AppLog) AppLog.action("spells", "«" + o.spellName + "»: промах (натуральная 1)");
          return;
        }
        // Пауза, чтобы итог атаки успел показаться до старта броска урона
        // (interrupt-семантика animateDice3d мгновенно затёрла бы его).
        setTimeout(function() { rollDamage(comp.isCrit); }, 1100);
      }
    });
    return;
  }
  rollDamage(false);
}

// CAST-9a: заклинание с повторным тиком («Ведьмин снаряд» бонусным действием,
// зоны вроде «Духовных стражей») получает экземпляр-трекер с готовой формулой
// повтора — она посчитана по ячейке и редакции на момент каста и переживает
// перезагрузку. Если экземпляр уже создан веткой effects — дописываем поля в
// него, чтобы не плодить дубли.
function _startCastRepeat(char, spell, d, slot, variant) {
  var castLevel = slot ? slot.level : null;
  var formula = (typeof damageFormulaFor === "function")
    ? damageFormulaFor(d.repeat, spell.level || 0, castLevel, char.level || 1) : d.repeat.formula;
  var extra = { repeat: true, repeatFormula: formula };
  if (variant) { extra.variantId = variant.id; extra.variantName = variant.name; }
  _ensureCastInstance(char, spell, d, slot, extra);
  saveToLocal();
  if (typeof renderBattleCastPanels === "function") renderBattleCastPanels();
}

// CAST-9a: повторный тик по кнопке в шапке трекера боя. Формула — из экземпляра
// (repeatFormula); у экземпляров, созданных до CAST-9, её нет — падаем на базовую
// формулу дескриптора без апкаста.
function castRepeatDamage(instId) {
  var char = getCurrentChar();
  if (!char) return;
  var inst = (char.activeSpellEffects || []).find(function(i) { return String(i.id) === String(instId); });
  if (!inst || !inst.repeat) return;
  var d = (typeof getSpellEffect === "function") ? getSpellEffect(inst.spellName, inst.source) : null;
  if (!d || !d.repeat) return;
  if (window.AppLog) AppLog.action("spells", "повторный урон: " + inst.spellName);
  _rollCastDamage(char, {
    spellName: inst.spellName, dmg: d.repeat,
    formula: inst.repeatFormula || d.repeat.formula,
    castLevel: inst.slotLevel, variantName: inst.variantName, isRepeat: true
  });
}

// CAST-10: дебафф на цель — весь эффект живёт НЕ на листе, а на участнике
// трекера боя (чип в его строке, p.debuffs в BATTLE_DATA). Экземпляр каста
// у персонажа всё равно нужен: он несёт таймер и связь с концентрацией, по нему
// чип показывает остаток ⏳ и снимается сам (removeCastEffectsForSpell →
// removeBattleDebuffsForSpell). Метка дописывается в экземпляр ТЕКУЩЕГО каста
// (_ensureCastInstance) — дублей не плодим, таймер освежается реккастом.
// Реккаст снимает чипы прошлого каста: _replaceCastInstance меняет экземпляр
// молча, без removeCastEffectsForSpell, — старые чипы осиротели бы.
// Вне боя (или без целей) пикер молчит, как урон в CAST-4: каст уже отчитался
// своим тостом, а помечать в трекере некого.
function _applyCastDebuff(char, spell, d, slot, variant) {
  if (typeof removeBattleDebuffsForSpell === "function") removeBattleDebuffsForSpell(spell.name);
  var dExtra = { debuff: true };
  if (variant) { dExtra.variantId = variant.id; dExtra.variantName = variant.name; }
  var inst = _ensureCastInstance(char, spell, d, slot, dExtra);
  saveToLocal();
  if (typeof offerCastDebuffToBattle !== "function") return;
  var open = function() {
    offerCastDebuffToBattle(spell.name, d.debuff, {
      castId: inst ? inst.id : null,
      maxTargets: (typeof debuffTargetCount === "function")
        ? debuffTargetCount(d.debuff, spell.level || 0, slot ? slot.level : null) : 1,
      variantName: variant ? variant.name : (inst && inst.variantName) || null
    });
  };
  // «Луч слабости» — дальнобойная атака заклинанием: сначала d20, при
  // натуральной 1 цель не помечается вовсе. Экземпляр и концентрацию при
  // промахе НЕ трогаем (заклинание кончилось — игрок снимает концентрацию сам),
  // как и урон в CAST-7a. Пауза 1100 мс — иначе модалка накроет итог броска.
  if (d.debuff.attack && typeof quickRoll === "function") {
    quickRoll({
      label: "🎯 Атака: " + spell.name,
      sides: 20,
      mod: castSpellAttackMod(char),
      onResult: function(comp) {
        if (comp.isFail) {
          showToast("💨 Натуральная 1 — промах, цель не помечена", "warn");
          if (window.AppLog) AppLog.action("spells", "«" + spell.name + "»: промах (натуральная 1)");
          return;
        }
        setTimeout(open, 1100);
      }
    });
    return;
  }
  open();
}

// CAST-7a: бонус атаки заклинаниями — всегда живой расчёт (мастерство + мод
// заклинательной характеристики), как в calcSpellStats (app-combat.js), но без
// чтения DOM: char.spells.attack мог не пересчитаться с прошлого уровня.
function castSpellAttackMod(char) {
  var prof = (typeof getProficiencyBonus === "function") ? getProficiencyBonus(char.level || 1) : 0;
  return prof + castStatMod(char);
}

// CAST-3: модификатор заклинательной характеристики (char.spells.stat — «ИНТ»/«МУД»/«ХАР»).
function castStatMod(char) {
  if (!char || !char.stats || !char.spells) return 0;
  var stat = char.spells.stat || "";
  if (stat === "ИНТ") return getMod(char.stats.int);
  if (stat === "МУД") return getMod(char.stats.wis);
  if (stat === "ХАР") return getMod(char.stats.cha);
  return 0;
}

// CAST-3: лечение — формула с апкастом (+ мод заклинательной характеристики),
// 3D-бросок в арене, итог уходит в quickHP (кап по hpMax и история — внутри
// него). Плоские формулы без кубиков («Полное исцеление» 70+10/ур.)
// применяются сразу, без броска. Экземпляр-трекер не создаётся (мгновенно).
function _applyCastHeal(char, spell, d, slot) {
  var castLevel = slot ? slot.level : (spell.level || 0);
  var formula = scaleFormula(d.heal.formula, d.heal.upcast, spell.level || 0, castLevel);
  var mod = d.heal.addSpellMod ? castStatMod(char) : 0;
  var flat = (typeof flatFormulaTotal === "function") ? flatFormulaTotal(formula) : null;
  if (flat != null) {
    if (typeof quickHP === "function") quickHP(Math.max(0, flat + mod), spell.name);
    return;
  }
  if (typeof rollFormula !== "function") return;
  if (mod) formula += (mod > 0 ? "+" + mod : String(mod));
  rollFormula(formula, {
    label: "💚 " + spell.name,
    openArena: true,
    onResult: function(res) {
      if (typeof quickHP === "function") quickHP(res.total, spell.name);
    }
  });
}

// CAST-3: временные ХП — бросок формулы (плоские — сразу), итог в applyCastTempHp.
function _applyCastTempHp(char, spell, d, slot) {
  var castLevel = slot ? slot.level : (spell.level || 0);
  var formula = scaleFormula(d.tempHp.formula, d.tempHp.upcast, spell.level || 0, castLevel);
  var flat = (typeof flatFormulaTotal === "function") ? flatFormulaTotal(formula) : null;
  if (flat != null) { applyCastTempHp(char, spell, d, slot, flat); return; }
  if (typeof rollFormula !== "function") return;
  rollFormula(formula, {
    label: "🛡 " + spell.name,
    openArena: true,
    onResult: function(res) { applyCastTempHp(char, spell, d, slot, res.total); }
  });
}

// Правило 5e: временные ХП не стакаются — остаётся большее из текущих и новых.
// В экземпляр пишется tempHpApplied = грант ЗАКЛИНАНИЯ (не итог): экспирация
// обнулит hpTemp, только если текущее значение не больше гранта (пользователь
// не перезаписал бо́льшим из другого источника) — см. _revertCastInstanceBody.
function applyCastTempHp(char, spell, d, slot, rolled) {
  var cur = parseInt(char.combat.hpTemp, 10) || 0;
  char.combat.hpTemp = Math.max(cur, rolled);
  _replaceCastInstance(char, spell, d, slot, { tempHpApplied: rolled });
  if (window.AppLog) AppLog.action("spells", "врем. ХП от «" + spell.name + "»: " + rolled + (cur > rolled ? " (оставлены прежние " + cur + ")" : ""));
  showToast(cur > rolled ? ("🛡 Прежние врем. ХП больше (" + cur + ") — оставлены") : ("🛡 Временные ХП: " + rolled), "info");
  if (typeof updateHPDisplay === "function") updateHPDisplay();
  saveToLocal();
}

// CAST-3: «Подмога» — +N к максимуму И текущим ХП без броска (N = base +
// perUpcast за каждый уровень ячейки выше базового). Повторный каст не
// стакается: бонус старого экземпляра откатывается перед новым. Реверт при
// экспирации/снятии/длинном отдыхе — _revertCastInstanceBody (app-combat.js).
function _applyCastHpMaxBonus(char, spell, d, slot) {
  var castLevel = slot ? slot.level : (spell.level || 0);
  var over = Math.max(0, castLevel - (spell.level || 0));
  var bonus = (d.hpMaxBonus.base || 0) + (d.hpMaxBonus.perUpcast || 0) * over;
  if (typeof _revertCastInstanceBody === "function") {
    (char.activeSpellEffects || []).forEach(function(inst) {
      if (inst.spellName === spell.name) _revertCastInstanceBody(char, inst);
    });
  }
  var before = parseInt(char.combat.hpCurrent, 10) || 0;
  char.combat.hpMax = (parseInt(char.combat.hpMax, 10) || 0) + bonus;
  char.combat.hpCurrent = before + bonus;
  _replaceCastInstance(char, spell, d, slot, { hpMaxBonus: bonus });
  if (typeof addHPHistory === "function") addHPHistory(before, char.combat.hpCurrent, bonus, spell.name);
  if (window.AppLog) AppLog.action("spells", "«" + spell.name + "»: +" + bonus + " к hpMax и hpCurrent");
  showToast("💪 +" + bonus + " к максимуму и текущим ХП («" + spell.name + "»)", "success");
  if (typeof updateHPDisplay === "function") updateHPDisplay();
  saveToLocal();
}

function openCastChooser(spell, opts) {
  var modal = $("cast-spell-modal");
  var box = $("cast-spell-options");
  if (!modal || !box) return;
  var title = $("cast-spell-title");
  if (title) title.textContent = spell.name;
  var hint = $("cast-spell-hint");
  if (hint) hint.textContent = (spell.level > 0 ? spell.level + " уровень. " : "") +
    (spell.higherLevel ? spell.higherLevel : "Выберите, какую ячейку потратить.");
  box.innerHTML = "";
  opts.forEach(function(o) {
    var b = document.createElement("button");
    b.className = "cast-slot-option";
    b.innerHTML = '<span class="cso-lvl">' + o.level + ' ур.' + (o.type === "pact" ? ' · ПАКТ' : '') + '</span>' +
      '<span class="cso-free">свободно: ' + o.free + '</span>';
    b.onclick = function(){ _castSpellWithSlot(spell.id, o.type, o.level); };
    box.appendChild(b);
  });
  modal.classList.add("active");
}

function closeCastChooser() {
  var modal = $("cast-spell-modal");
  if (modal) modal.classList.remove("active");
}

var _ritualTimer = null;
var _ritualEndTime = 0;
// BUGFIX-8: экспонируем на window для clear-all в loadCharacter().
if (typeof window !== 'undefined') window._ritualTimer = null;
function castRitual(spellName) {
// Если уже идёт ритуал — отменить старый
if (_ritualTimer) cancelRitual(true);
_ritualEndTime = Date.now() + 10 * 60 * 1000; // 10 минут
var nameEl = $("status-ritual-name");
var timerEl = $("status-ritual-timer");
var container = $("status-ritual");
if (nameEl) nameEl.textContent = spellName;
if (timerEl) timerEl.textContent = "10:00";
if (container) container.classList.remove("hidden");
if (window.AppLog) AppLog.action("spells", "ритуал начат: " + spellName);
showToast("🕐 Ритуал: " + spellName + " — 10 минут", "info");
_ritualTimer = setInterval(function() {
  var left = _ritualEndTime - Date.now();
  if (left <= 0) {
    clearInterval(_ritualTimer);
    _ritualTimer = null;
    if (typeof window !== 'undefined') window._ritualTimer = null;
    if (container) container.classList.add("hidden");
    if (window.AppLog) AppLog.info("spells", "ритуал завершён: " + spellName);
    showToast("✅ Ритуал «" + spellName + "» завершён!", "success");
    return;
  }
  var min = Math.floor(left / 60000);
  var sec = Math.floor((left % 60000) / 1000);
  if (timerEl) timerEl.textContent = min + ":" + (sec < 10 ? "0" : "") + sec;
}, 1000);
if (typeof window !== 'undefined') window._ritualTimer = _ritualTimer;
}
function cancelRitual(silent) {
if (_ritualTimer) {
  clearInterval(_ritualTimer);
  _ritualTimer = null;
  if (typeof window !== 'undefined') window._ritualTimer = null;
}
var container = $("status-ritual");
if (container) container.classList.add("hidden");
if (!silent && window.AppLog) AppLog.action("spells", "ритуал отменён");
if (!silent) showToast("🕐 Ритуал отменён", "warn");
}
