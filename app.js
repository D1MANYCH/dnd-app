// ============================================================
// app.js — Логика приложения D&D 5e Character Sheet
// Все функции, состояние, обработчики событий
// ============================================================

// ── Хелперы ─────────────────────────────────────────────────
/** Короткий алиас для document.getElementById */
function $(id) { return document.getElementById(id); }
/** Текущий персонаж */
function getCurrentChar() { return characters.find(function(c) { return c.id === currentId; }); }
/** Открыть/закрыть простую модалку по id */
function openModal(id) { var m = $(id); if (m) m.classList.add("active"); }
function closeModal(id) { var m = $(id); if (m) m.classList.remove("active"); }
/** Debounce — откладывает вызов fn на delay мс после последнего вызова */
function debounce(fn, delay) {
  var timer;
  return function() {
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() { fn.apply(null, args); }, delay);
  };
}
/** Отложенное сохранение — не чаще одного раза в 300мс */
var saveToLocalDebounced = debounce(function() { saveToLocal(); }, 300);
// SPELL_DATABASE — объединение встроенной базы (spells.js) и пользовательских добавлений из localStorage
// SPELLS_BASE определён в spells.js и загружается до app.js
let SPELL_DATABASE = (typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.slice() : [];
const CLASS_ICONS_MAP = { wizard:"🧙", druid:"🌿", bard:"🎵", cleric:"✝️", paladin:"🛡️", ranger:"🏹", sorcerer:"🔥", warlock:"👁️", both:"✨" };

// Стандартные веса предметов D&D 5e для автозаполнения
const ITEM_WEIGHTS = {
  // Оружие
  "кинжал":1,"нож":1,"дротик":0.25,"праща":0,"болт":0.075,"стрела":0.05,
  "короткий меч":2,"длинный меч":3,"рапира":2,"меч":3,"сабля":3,"тесак":2,
  "боевой топор":4,"топор":4,"секира":7,"алебарда":6,"глефа":6,"копьё":3,
  "пика":18,"трезубец":4,"боевой молот":2,"молот":10,"булава":4,"палица":4,
  "моргенштерн":4,"цеп":2,"боевой посох":4,"посох":4,"дубина":2,"жезл":1,
  "лук":2,"короткий лук":2,"длинный лук":2,"арбалет":5,"ручной арбалет":3,
  "тяжёлый арбалет":18,"духовая трубка":1,
  // Броня
  "стёганый доспех":8,"кожаный доспех":10,"проклёпанная кожа":13,
  "кольчужная рубаха":20,"чешуйчатый доспех":45,"кольчуга":55,
  "нагрудник":20,"полукираса":20,"латный доспех":65,
  "щит":6,"небольшой щит":6,
  // Зелья
  "зелье лечения":0.5,"зелье":0.5,"яд":0.5,"масло":1,
  // Приключенческое снаряжение
  "верёвка":10,"верёвка шёлковая":5,"факел":1,"фонарь":2,"масляный фонарь":2,
  "мешок":0.5,"рюкзак":5,"сундук":25,"мешочек":0.1,
  "отмычки":1,"инструменты взломщика":1,"воровской инструмент":1,
  "компонентный мешочек":2,"фокусировка":0,"аркан":0,"святой символ":1,
  "книга заклинаний":3,"гримуар":3,"свиток":0,"пергамент":0,
  "рация":1,"зеркало":0.5,"лупа":0,"подзорная труба":1,
  "паёк":2,"сухой паёк":2,"вода":5,"бурдюк":1,
};

function autoFillItemWeight() {
  const nameEl = $("new-item-name");
  const weightEl = $("new-item-weight");
  if (!nameEl || !weightEl) return;
  const name = nameEl.value.toLowerCase().trim();
  if (!name || parseFloat(weightEl.value) !== 0) return;
  for (const key in ITEM_WEIGHTS) {
    if (name.includes(key) || key.includes(name)) {
      weightEl.value = ITEM_WEIGHTS[key];
      weightEl.style.borderColor = "var(--accent-color)";
      setTimeout(function(){ weightEl.style.borderColor = ""; }, 1500);
      const hint = $("weight-hint");
      if (hint) { hint.textContent = "✓ автозаполнено"; setTimeout(function(){ hint.textContent=""; }, 2000); }
      return;
    }
  }
}
function setItemQty(n) {
  const el = $("new-item-qty");
  if (el) el.value = n;
}
let characters = [];
let currentId = null;
let currentSpellVersion = "all";
let currentSpellClass = "all";
let currentViewItem = null;
let currentFilterCategory = "all";
let diceHistory = [];
let currentRestType = null;
let hitDiceToSpend = 0;
let hpHistory = [];
const abilities = [
{key: "str", name: "Сила"}, {key: "dex", name: "Ловкость"}, {key: "con", name: "Телосложение"},
{key: "int", name: "Интеллект"}, {key: "wis", name: "Мудрость"}, {key: "cha", name: "Харизма"}
];
const skills = [
{name: "Акробатика", stat: "dex"}, {name: "Аркана", stat: "int"}, {name: "Атлетика", stat: "str"},
{name: "Внимательность", stat: "wis"}, {name: "Выживание", stat: "wis"}, {name: "Выступление", stat: "cha"},
{name: "Запугивание", stat: "cha"}, {name: "История", stat: "int"}, {name: "Ловкость рук", stat: "dex"},
{name: "Медицина", stat: "wis"}, {name: "Обман", stat: "cha"}, {name: "Природа", stat: "int"},
{name: "Проницательность", stat: "wis"}, {name: "Расследование", stat: "int"}, {name: "Религия", stat: "int"},
{name: "Скрытность", stat: "dex"}, {name: "Убеждение", stat: "cha"}, {name: "Уход за животными", stat: "wis"}
];
// ============================================
// МИГРАЦИИ СХЕМЫ ПЕРСОНАЖА
// ============================================
function migrateCharacter(char) {
  var v = char.schemaVersion || 0;
  if (v < 1) {
    if (char.alignment    === undefined) char.alignment    = "";
    if (char.size         === undefined) char.size         = "Средний";
    if (char.inspiration  === undefined) char.inspiration  = false;
    if (char.concentration=== undefined) char.concentration= null;
    if (!char.companions)                char.companions   = [];
    if (!char.feats)                     char.feats        = [];
    if (!char.asiUsedLevels)             char.asiUsedLevels= [];
    if (!char.journal)                   char.journal      = [];
    if (!char.party)                     char.party        = { allies:[], monsters:[], npcs:[] };
    if (!char.battle)                    char.battle       = { active:false, participants:[], currentTurn:0 };
    char.schemaVersion = 1;
  }
  if (v < 2) {
    if (char.avatar === undefined) char.avatar = null;
    char.schemaVersion = 2;
  }
  if (v < 3) {
    if (!char.expertiseSkills) char.expertiseSkills = [];
    char.schemaVersion = 3;
  }
  if (v < 5) {
    if (!char.resistances) char.resistances = [];
    if (!char.immunities) char.immunities = [];
    if (!char.vulnerabilities) char.vulnerabilities = [];
    if (char.twoWeaponFighting === undefined) char.twoWeaponFighting = false;
    char.schemaVersion = 5;
  }
  return char;
}

// ============================================
// АВАТАР ПЕРСОНАЖА
// ============================================

/** Открыть модалку аватара для текущего персонажа */
function openAvatarModal(event) {
  if (event) event.stopPropagation();
  if (!currentId) return;
  const char = getCurrentChar();
  if (!char) return;
  // Показать текущий аватар в превью
  const preview = $("avatar-modal-preview");
  if (preview) {
    if (char.avatar) {
      preview.innerHTML = "<img src=\"" + char.avatar + "\" alt=\"Аватар\">";
    } else {
      preview.innerHTML = "<span class=\"avatar-modal-placeholder\">" + getClassIcon(char.class) + "</span>";
    }
  }
  const urlInput = $("avatar-url-input");
  if (urlInput) urlInput.value = "";
  openModal("avatar-modal");
}

function closeAvatarModal() { closeModal("avatar-modal"); }

/** Загрузить аватар с устройства — сжимаем до 400×400 через canvas */
function handleAvatarFile(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { showToast("Выберите файл изображения", "error"); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const MAX = 400;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      applyAvatar(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  // Сбросить input чтобы можно было выбрать тот же файл повторно
  input.value = "";
}

/** Сохранить аватар по URL */
function applyAvatarFromUrl() {
  const url = ($("avatar-url-input")?.value || "").trim();
  if (!url) { showToast("Введите ссылку на изображение", "warn"); return; }
  // Проверяем что ссылка похожа на картинку
  applyAvatar(url);
}

/** Применить аватар (base64 или URL) — сохранить и перерисовать */
function applyAvatar(src) {
  if (!currentId) return;
  const char = getCurrentChar();
  if (!char) return;
  char.avatar = src;
  char.updatedAt = Date.now();
  saveToLocal();
  // Обновить превью в модалке
  const preview = $("avatar-modal-preview");
  if (preview) preview.innerHTML = "<img src=\"" + src + "\" alt=\"Аватар\">";
  // Обновить аватар в шапке листа
  renderSheetAvatar();
  // Перерисовать карточку в списке
  renderCharacterList();
  showToast("Аватар сохранён", "success");
}

/** Удалить аватар */
function removeAvatar(event) {
  if (event) event.stopPropagation();
  if (!currentId) return;
  const char = getCurrentChar();
  if (!char) return;
  char.avatar = null;
  char.updatedAt = Date.now();
  saveToLocal();
  const preview = $("avatar-modal-preview");
  if (preview) preview.innerHTML = "<span class=\"avatar-modal-placeholder\">" + getClassIcon(char.class) + "</span>";
  renderSheetAvatar();
  renderCharacterList();
  showToast("Аватар удалён", "info");
}

/** Обновить аватар в шапке листа персонажа */
function renderSheetAvatar() {
  const el = $("sheet-avatar");
  if (!el) return;
  const char = getCurrentChar();
  if (char && char.avatar) {
    el.innerHTML = "<img src=\"" + char.avatar + "\" alt=\"Аватар\" onclick=\"openAvatarModal(event)\">";
    el.classList.add("has-avatar");
  } else {
    const icon = char ? getClassIcon(char.class) : "🎭";
    el.innerHTML = "<span onclick=\"openAvatarModal(event)\">" + icon + "</span>";
    el.classList.remove("has-avatar");
  }
}


window.onload = function() {
try {
const saved = localStorage.getItem("dnd_chars");
const savedSpells = localStorage.getItem("dnd_spells");
const savedHpHistory = localStorage.getItem("dnd_hp_history");
if (saved) characters = JSON.parse(saved).map(migrateCharacter);
if (savedSpells) {
  // Пользовательские заклинания (добавленные через UI) — храним отдельно
  // и объединяем с базой, избегая дублей по id
  var userSpells = JSON.parse(savedSpells);
  var baseIds = new Set(SPELL_DATABASE.map(function(s) { return s.id; }));
  var extra = userSpells.filter(function(s) { return !baseIds.has(s.id); });
  if (extra.length > 0) SPELL_DATABASE = SPELL_DATABASE.concat(extra);
}
if (savedHpHistory) hpHistory = JSON.parse(savedHpHistory);
} catch(e) { console.log("Ошибка загрузки:", e); }
initSaves();
initSkills();
initConditions();
initEffects();
renderCharacterList();
renderWeaponPresets();
};
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
// Список всех классов (мультикласс): [{class, level}]
var classList = [];
if (char.classes && char.classes.length > 0) {
  classList = char.classes.map(function(c){ return {cls:c.class, lvl:c.level||0}; });
} else {
  classList = [{cls:className, lvl:level}];
}
var isMulti = classList.length > 1;
classList.forEach(function(cEntry) {
  var cls = cEntry.cls, clsLvl = cEntry.lvl;
  if (!CLASS_FEATURES[cls]) return;
  var subName = (typeof ccGetSubclass === "function") ? ccGetSubclass(char, cls) : null;
  var subFeats = (subName && typeof SUBCLASS_FEATURES !== "undefined" && SUBCLASS_FEATURES[subName]) ? SUBCLASS_FEATURES[subName] : null;
  for (var l = 1; l <= clsLvl; l++) {
    var subAtLevel = subFeats && subFeats[l] ? subFeats[l] : null;
    var subNames = subAtLevel ? subAtLevel.map(function(f){return f.name;}) : [];
    var isNewLevel = (l === clsLvl && cls === className && l === level);
    if (CLASS_FEATURES[cls][l]) {
      CLASS_FEATURES[cls][l].forEach(function(feature) {
        if (subNames.indexOf(feature.name) !== -1) return;
        var featureDiv = document.createElement("div");
        featureDiv.className = "feature-item" + (isNewLevel ? " new" : "");
        var classTag = isMulti ? '<span class="subclass-badge">' + escapeHtml(cls) + '</span>' : '';
        featureDiv.innerHTML = "<span class=\"feature-level\">" + l + " ур.</span>" + classTag + "<div class=\"feature-name\">" + escapeHtml(feature.name) + "</div><div class=\"feature-desc\">" + escapeHtml(feature.desc) + "</div>";
        featuresGrid.appendChild(featureDiv);
      });
    }
    if (subAtLevel) {
      subAtLevel.forEach(function(feature) {
        var featureDiv = document.createElement("div");
        featureDiv.className = "feature-item subclass-feature" + (isNewLevel ? " new" : "");
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
if (typeof renderClassChoices === "function") renderClassChoices(char, asiContainer);
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
$("ac-total").textContent = ac;
$("ac-formula").textContent = formulaParts.join(" ");
$("combat-ac").value = ac;
const modifiersContainer = $("ac-modifiers");
modifiersContainer.innerHTML = "";
modifiers.forEach(function(mod) {
const modDiv = document.createElement("div");
modDiv.className = "ac-modifier-item" + (mod.type === "negative" ? " negative" : "");
modDiv.innerHTML = "<span>" + escapeHtml(mod.name) + "</span><span class=\"ac-modifier-value\">" + (mod.value >= 0 ? "+" : "") + mod.value + "</span>";
modifiersContainer.appendChild(modDiv);
});
$("status-ac").textContent = ac;
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
function saveToLocal() {
try {
localStorage.setItem("dnd_chars", JSON.stringify(characters));
// Сохраняем только заклинания добавленные пользователем (не из базы spells.js)
var baseIds = new Set((typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.map(function(s){return s.id;}) : []);
var userSpells = SPELL_DATABASE.filter(function(s){ return !baseIds.has(s.id); });
localStorage.setItem("dnd_spells", JSON.stringify(userSpells));
localStorage.setItem("dnd_hp_history", JSON.stringify(hpHistory));
} catch(e) { console.log("Ошибка сохранения:", e); }
}
function showScreen(screenName) {
const charactersScreen = $("screen-characters");
const characterScreen = $("screen-character");
const characterTabs = $("character-tabs");
const statusBar = $("status-bar");
const hamburger = $("nav-hamburger");
if (charactersScreen) charactersScreen.classList.add("hidden");
if (characterScreen) characterScreen.classList.add("hidden");
if (characterTabs) characterTabs.classList.add("hidden");
if (statusBar) statusBar.classList.remove("visible");
if (hamburger) hamburger.classList.add("hidden");
if (screenName === "characters") {
if (charactersScreen) charactersScreen.classList.remove("hidden");
closeDrawer();
currentId = null;
updateHeaderTitle();
renderCharacterList();
} else {
if (characterScreen) characterScreen.classList.remove("hidden");
if (characterTabs) characterTabs.classList.remove("hidden");
if (hamburger) hamburger.classList.remove("hidden");
updateHeaderTitle();
updateStatusBar();
}
}
function updateHeaderTitle() {
var avatarEl = $("header-avatar");
var subtitleEl = $("header-subtitle");
if (!currentId) {
  $("header-title").textContent = "Мой Персонаж D&D 5e";
  if (avatarEl) avatarEl.innerHTML = "🎭";
  if (subtitleEl) subtitleEl.textContent = "";
  return;
}
var char = getCurrentChar();
if (char && char.name) {
  $("header-title").textContent = escapeHtml(char.name);
} else {
  $("header-title").textContent = "Мой Персонаж D&D 5e";
}
if (avatarEl) {
  if (char && char.avatar) {
    avatarEl.innerHTML = "<img src=\"" + char.avatar + "\" alt=\"\">";
  } else {
    avatarEl.innerHTML = char ? getClassIcon(char.class) : "🎭";
  }
}
if (subtitleEl && char) {
  var parts = [];
  if (char.class) parts.push(char.class);
  if (char.race) parts.push(char.race);
  subtitleEl.textContent = parts.join(" · ");
} else if (subtitleEl) {
  subtitleEl.textContent = "";
}
}
function switchTab(tabName, btnEl) {
  document.querySelectorAll(".tab-content").forEach(function(tab) { tab.classList.remove("active"); });
  document.querySelectorAll(".tab-btn").forEach(function(btn) { btn.classList.remove("active"); });
  var tabElement = $("tab-" + tabName);
  if (tabElement) tabElement.classList.add("active");
  // Highlight tab btn
  var activeBtn = btnEl ? btnEl.closest(".tab-btn") : document.querySelector(".tab-btn[data-tab='" + tabName + "']");
  if (activeBtn) activeBtn.classList.add("active");
  // Highlight drawer item
  document.querySelectorAll(".drawer-item").forEach(function(el) { el.classList.remove("drawer-item-active"); });
  var drawerItem = document.querySelector(".drawer-item[data-drawer-tab='" + tabName + "']");
  if (drawerItem) drawerItem.classList.add("drawer-item-active");
  try { localStorage.setItem("dnd_last_tab", tabName); } catch(e) {}
  if (tabName === "party")   { openPartyTab(); }
  if (tabName === "battle")  { openBattleTab(); }
  if (tabName === "journal") { renderJournal(); }
}

function openDrawer() {
  var drawer = $("side-drawer");
  var overlay = $("drawer-overlay");
  if (drawer) drawer.classList.remove("hidden");
  if (overlay) overlay.classList.remove("hidden");
  // Sync char name
  var nameEl = $("char-name");
  var drawerName = $("drawer-char-name");
  if (nameEl && drawerName) drawerName.textContent = nameEl.value || "Персонаж";
  setTimeout(function() {
    if (drawer) drawer.classList.add("open");
    if (overlay) overlay.classList.add("open");
  }, 10);
}
function closeDrawer() {
  var drawer = $("side-drawer");
  var overlay = $("drawer-overlay");
  if (drawer) drawer.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
  setTimeout(function() {
    if (drawer) drawer.classList.add("hidden");
    if (overlay) overlay.classList.add("hidden");
  }, 300);
}

// Show hamburger when character is loaded
function showCharacterNav() {
  var hamburger = $("nav-hamburger");
  var tabs = $("character-tabs");
  if (hamburger) hamburger.classList.remove("hidden");
  if (tabs) tabs.classList.remove("hidden");
}
function hideCharacterNav() {
  var hamburger = $("nav-hamburger");
  var tabs = $("character-tabs");
  if (hamburger) hamburger.classList.add("hidden");
  if (tabs) tabs.classList.add("hidden");
}

// Swipe to open drawer (only when character screen is active)
(function() {
  var touchStartX = 0;
  var touchStartY = 0;
  document.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    var drawer = $("side-drawer");
    var charScreen = $("screen-character");
    // Only work when character screen is visible and a character is loaded
    if (!drawer || !charScreen || charScreen.classList.contains("hidden") || !currentId) return;
    if (dx < -60 && Math.abs(dy) < 80 && !drawer.classList.contains("open")) {
      openDrawer();
    }
    if (dx > 60 && Math.abs(dy) < 80 && drawer.classList.contains("open")) {
      closeDrawer();
    }
  }, { passive: true });
})();
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
const COIN_RATES = { cp: 0.01, sp: 0.1, ep: 0.5, gp: 1, pp: 10 };
const COIN_NAMES = { cp: "ММ", sp: "СМ", ep: "ЭМ", gp: "ЗМ", pp: "ПМ" };

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
  // Подкласс ещё не открыт — показываем плашку и блокируем выбор
  subclassSelect.appendChild(new Option("🔒 Откроется на " + unlockLevel + " уровне", ""));
  subclassSelect.disabled = true;
  subclassSelect.classList.add("subclass-locked");
  // Если у персонажа уже был сохранён подкласс, очищаем
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

// Восстанавливаем сохранённое значение, если оно валидно
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
function createNewCharacter() {
// Глубокое копирование дефолтного шаблона — безопасно, без мутации оригинала
const newChar = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
newChar.id = Date.now();
newChar.schemaVersion = (typeof SCHEMA_VERSION !== 'undefined') ? SCHEMA_VERSION : 2;
// Инициализируем ячейки заклинаний
for (let i = 1; i <= 9; i++) {
  newChar.spells.slots[i] = 0;
  newChar.spells.slotsUsed[i] = 0;
}
characters.push(newChar);
saveToLocal();
loadCharacter(newChar.id);
}
function getClassColor(cls) {
const colors = {
  "Варвар": "#c0392b", "Бард": "#8e44ad", "Жрец": "#f39c12",
  "Друид": "#27ae60", "Воин": "#2980b9", "Монах": "#16a085",
  "Паладин": "#d4ac0d", "Следопыт": "#1e8449", "Плут": "#6c3483",
  "Чародей": "#e74c3c", "Колдун": "#4a235a", "Волшебник": "#1a5276"
};
return colors[cls] || "#c9a227";
}
function getClassIcon(cls) {
const icons = {
  "Варвар": "🪓", "Бард": "🎵", "Жрец": "✝️",
  "Друид": "🌿", "Воин": "⚔️", "Монах": "👊",
  "Паладин": "🛡️", "Следопыт": "🏹", "Плут": "🗡️",
  "Чародей": "🔥", "Колдун": "👁️", "Волшебник": "✨"
};
return icons[cls] || "🎭";
}
function formatTimeAgo(ts) {
if (!ts) return "";
const diff = Date.now() - ts;
const m = Math.floor(diff / 60000);
const h = Math.floor(diff / 3600000);
const d = Math.floor(diff / 86400000);
if (m < 1) return "только что";
if (m < 60) return m + " мин. назад";
if (h < 24) return h + " ч. назад";
if (d < 7) return d + " д. назад";
return new Date(ts).toLocaleDateString("ru-RU", {day:"numeric", month:"short"});
}
var charSearchQuery = "";
var charSortMode = "updated";
function setCharSort(mode) {
charSortMode = mode;
document.querySelectorAll(".sort-btn").forEach(function(b) { b.classList.remove("active"); });
var btn = $("sort-btn-" + mode);
if (btn) btn.classList.add("active");
renderCharacterList();
}
function setCharSearch(val) {
charSearchQuery = val.toLowerCase().trim();
renderCharacterList();
}
function duplicateCharacter(id, event) {
event.stopPropagation();
const orig = characters.find(function(c) { return c.id === id; });
if (!orig) return;
const copy = JSON.parse(JSON.stringify(orig));
copy.id = Date.now();
copy.name = (orig.name || "Без имени") + " (копия)";
copy.updatedAt = Date.now();
characters.push(copy);
saveToLocal();
renderCharacterList();
}
function exportOneCharacter(id, event) {
event.stopPropagation();
var char = characters.find(function(c) { return c.id === id; });
if (!char) return;
var data = JSON.stringify({ characters: [char], spells: [] }, null, 2);
var blob = new Blob([data], { type: "application/json" });
var a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = (char.name || "персонаж").replace(/[^a-zA-Zа-яА-Я0-9]/g, "_") + ".json";
a.click();
}
function updateCharCounter() {
var el = $("char-count");
if (!el) return;
var total = characters.length;
var filtered2 = characters.filter(function(c) {
  if (!charSearchQuery) return true;
  return (c.name || "").toLowerCase().includes(charSearchQuery) ||
         (c.class || "").toLowerCase().includes(charSearchQuery) ||
         (c.race || "").toLowerCase().includes(charSearchQuery);
});
if (charSearchQuery && filtered2.length !== total) {
  el.textContent = filtered2.length + " из " + total;
} else {
  el.textContent = total > 0 ? total + " шт." : "";
}
}
var dragSrcId = null;
function onDragStart(e, id) { dragSrcId = id; e.dataTransfer.effectAllowed = "move"; }
function onDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }
function onDrop(e, targetId) {
e.preventDefault();
if (dragSrcId === targetId) return;
var srcIdx = characters.findIndex(function(c) { return c.id === dragSrcId; });
var tgtIdx = characters.findIndex(function(c) { return c.id === targetId; });
if (srcIdx < 0 || tgtIdx < 0) return;
var moved = characters.splice(srcIdx, 1)[0];
characters.splice(tgtIdx, 0, moved);
saveToLocal();
renderCharacterList();
}
function renderCharacterList() {
const list = $("character-list");
if (!list) return;
list.innerHTML = "";
updateCharCounter();
var filtered = characters.filter(function(c) {
  if (!charSearchQuery) return true;
  return (c.name || "").toLowerCase().includes(charSearchQuery) ||
         (c.class || "").toLowerCase().includes(charSearchQuery) ||
         (c.race || "").toLowerCase().includes(charSearchQuery);
});
filtered = filtered.slice().sort(function(a, b) {
  if (charSortMode === "name") return (a.name || "").localeCompare(b.name || "", "ru");
  if (charSortMode === "level") return (b.level || 1) - (a.level || 1);
  if (charSortMode === "class") return (a.class || "").localeCompare(b.class || "", "ru");
  return (b.updatedAt || b.id) - (a.updatedAt || a.id);
});
if (filtered.length === 0) {
  list.innerHTML = characters.length === 0
    ? "<div class=\"empty-list\">📭 Список пуст. Создайте персонажа!</div>"
    : "<div class=\"empty-list\">🔍 Ничего не найдено</div>";
  return;
}
filtered.forEach(function(char) {
const div = document.createElement("div");
div.className = "char-card";
div.draggable = true;
div.addEventListener("dragstart", function(e) { onDragStart(e, char.id); div.style.opacity="0.5"; });
div.addEventListener("dragend", function() { div.style.opacity="1"; });
div.addEventListener("dragover", onDragOver);
div.addEventListener("drop", function(e) { onDrop(e, char.id); });
div.onclick = function() { loadCharacter(char.id); };
const conditionsCount = (char.conditions ? char.conditions.length : 0) + (char.effects ? char.effects.length : 0);
const hpCurrent = char.combat.hpCurrent || 0;
const hpMax = char.combat.hpMax || 0;
const hpPercent = hpMax > 0 ? Math.min(100, Math.round((hpCurrent / hpMax) * 100)) : 100;
const hpColor = hpPercent > 60 ? "#4da843" : hpPercent > 30 ? "#e67e22" : "#e74c3c";
const classColor = getClassColor(char.class);
const classIcon = getClassIcon(char.class);
const timeAgo = char.updatedAt ? "<span class=\"char-time-ago\">" + formatTimeAgo(char.updatedAt) + "</span>" : "";
div.style.borderLeftColor = classColor;
div.innerHTML = "<div class=\"char-card-header\">" +
  (char.avatar
    ? "<div class=\"char-card-class-icon char-card-avatar\" style=\"background:" + classColor + "22;\"><img src=\"" + char.avatar + "\" alt=\"\"></div>"
    : "<div class=\"char-card-class-icon\" style=\"background:" + classColor + "22;\">" + classIcon + "</div>") +
  "<div class=\"char-card-title\">" +
    "<h4 class=\"char-card-name\">" + escapeHtml(char.name || "Без имени") + "</h4>" +
    "<div class=\"char-card-sub\">" + escapeHtml(char.class || "Класс не указан") + (char.race ? " · " + escapeHtml(char.race) : "") + (char.subclass ? " · " + escapeHtml(char.subclass) : "") + "</div>" +
  "</div>" +
  "<div class=\"char-card-actions\">" +
    "<button class=\"char-copy-btn\" onclick=\"exportOneCharacter(" + char.id + ", event)\" title=\"Экспорт\">↓</button>" +
    "<button class=\"char-copy-btn\" onclick=\"duplicateCharacter(" + char.id + ", event)\" title=\"Дублировать\">⧉</button>" +
    "<button class=\"char-delete-btn\" onclick=\"event.stopPropagation(); deleteCharacter(" + char.id + ")\">✕</button>" +
  "</div>" +
"</div>" +
"<div class=\"char-card-stats\">" +
  "<span class=\"char-stat-badge\">⭐ " + (char.level || 1) + " ур.</span>" +
  "<span class=\"char-stat-badge-hp\" style=\"color:" + hpColor + "; border-color:" + hpColor + "55; background:" + hpColor + "18;\">❤️ " + hpCurrent + "/" + hpMax + "</span>" +
  "<span class=\"char-stat-badge\">🛡️ " + (char.combat.ac || 10) + "</span>" +
  (conditionsCount > 0 ? "<span class=\"char-stat-badge\" style=\"background:var(--condition-active);border-color:var(--condition-border);\">⚠️ " + conditionsCount + "</span>" : "") +
  (char.alignment ? "<span class=\"char-alignment\">" + escapeHtml(char.alignment) + "</span>" : "") +
  timeAgo +
"</div>";
list.appendChild(div);
});
}
function deleteCharacter(id) {
var char = characters.find(function(c) { return c.id === id; });
var name = char ? (char.name || "этого персонажа") : "этого персонажа";
showConfirmModal(
  "Удалить персонажа?",
  "«" + name + "» будет удалён без возможности восстановления.",
  function() {
    characters = characters.filter(function(c) { return c.id !== id; });
    saveToLocal();
    renderCharacterList();
  }
);
}
function showConfirmModal(title, text, onConfirm) {
var modal = $("confirm-modal");
var titleEl = $("confirm-modal-title");
var textEl = $("confirm-modal-text");
var confirmBtn = $("confirm-modal-ok");
var cancelBtn = $("confirm-modal-cancel");
if (!modal) return;
titleEl.textContent = title;
textEl.textContent = text;
modal.classList.add("active");
var newConfirm = confirmBtn.cloneNode(true);
confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
var newCancel = cancelBtn.cloneNode(true);
cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
$("confirm-modal-ok").addEventListener("click", function() {
  modal.classList.remove("active");
  onConfirm();
});
$("confirm-modal-cancel").addEventListener("click", function() {
  modal.classList.remove("active");
});
modal.addEventListener("click", function(e) {
  if (e.target === modal) modal.classList.remove("active");
}, { once: true });
}
function safeSet(id, value) {
const el = $(id);
if (el) el.value = value;
}
function safeSetChecked(id, checked) {
const el = $(id);
if (el) el.checked = checked;
}
// ============================================
// 🔧 ИСПРАВЛЕНИЕ: Подкласс сохраняется + hpCurrent как число
// ============================================
function loadCharacter(id) {
currentId = id;
const char = characters.find(function(c) { return c.id === id; });
if (!char) return;

// Load per-character party data
if (char.party) {
  PARTY_DATA = char.party;
  if (!PARTY_DATA.allies)   PARTY_DATA.allies   = [];
  if (!PARTY_DATA.monsters) PARTY_DATA.monsters = [];
  if (!PARTY_DATA.npcs)     PARTY_DATA.npcs     = [];
} else {
  PARTY_DATA = { allies: [], monsters: [], npcs: [] };
}

// Load per-character battle data
if (char.battle) {
  BATTLE_DATA = char.battle;
} else {
  BATTLE_DATA = { active: false, participants: [], currentTurn: 0 };
}
const savedSubclass = char.subclass || "";
safeSet("char-name", char.name);
safeSet("char-level", char.level);
safeSet("char-exp", char.exp || 0);
safeSet("char-class", char.class);
updateSubclassOptions();
safeSet("char-subclass", savedSubclass);
safeSet("char-race", char.race);
safeSet("char-background", char.background || "");
safeSet("char-alignment", char.alignment || "");
safeSet("char-size", char.size || "Средний");
safeSet("char-speed", char.speed || "30 фт");
safeSet("val-str", char.stats.str);
safeSet("val-dex", char.stats.dex);
safeSet("val-con", char.stats.con);
safeSet("val-int", char.stats.int);
safeSet("val-wis", char.stats.wis);
safeSet("val-cha", char.stats.cha);
safeSet("combat-ac", char.combat.ac);
safeSet("hp-max", char.combat.hpMax);
safeSet("hp-current", char.combat.hpCurrent);
safeSet("hp-temp", char.combat.hpTemp);
safeSet("hp-dice", char.combat.hpDice);
safeSet("hp-dice-spent", char.combat.hpDiceSpent || 0);
safeSet("combat-speed", char.combat.speed || "30 фт");
safeSet("tool-proficiencies", char.proficiencies.tools || "");
safeSet("languages", char.proficiencies.languages || "");
// Если у персонажа есть предыстория, но инструменты/языки не заполнены — применить данные предыстории
if (char.background && (!char.proficiencies.tools || !char.proficiencies.languages)) {
  setTimeout(onBackgroundChange, 0);
}
safeSet("coin-cp", char.coins.cp);
safeSet("coin-sp", char.coins.sp);
safeSet("coin-ep", char.coins.ep);
safeSet("coin-gp", char.coins.gp);
safeSet("coin-pp", char.coins.pp);
safeSet("char-notes", char.notes || "");
safeSet("char-features", char.features || "");
safeSet("char-appearance", char.appearance || "");
safeSet("magic-items", char.magicItems || "");
safeSet("spell-stat", char.spells.stat || "");
// Sync spell stat button highlight
const _statVal = char.spells.stat || "";
["int","wis","cha"].forEach(function(s){ var b=$("sc-btn-"+s); if(b) b.classList.remove("active"); });
if(_statVal==="ИНТ" && $("sc-btn-int")) $("sc-btn-int").classList.add("active");
if(_statVal==="МУД" && $("sc-btn-wis")) $("sc-btn-wis").classList.add("active");
if(_statVal==="ХАР" && $("sc-btn-cha")) $("sc-btn-cha").classList.add("active");
safeSetChecked("armor-light", false);
safeSetChecked("armor-medium", false);
safeSetChecked("armor-heavy", false);
safeSetChecked("armor-shield", false);
safeSetChecked("weapon-simple", false);
safeSetChecked("weapon-martial", false);
if(char.proficiencies.armor) {
char.proficiencies.armor.forEach(function(p) {
safeSetChecked("armor-" + p, true);
});
}
if(char.proficiencies.weapon) {
char.proficiencies.weapon.forEach(function(p) {
safeSetChecked("weapon-" + p, true);
});
}
if(char.saves) {
Object.keys(char.saves).forEach(function(key) {
safeSetChecked("save-prof-" + key, char.saves[key]);
});
}
if(char.skills) {
Object.keys(char.skills).forEach(function(key) {
safeSetChecked("skill-prof-" + key, char.skills[key]);
});
}
calcStats();
loadExpertise();
calcCoinWeight();
calcSpellStats();
recalculateHP();
loadConditions();
loadEffects();
updateClassFeatures();
renderClassResources();
// Restore armor select
var armorId = char.combat.armorId || "none";
safeSet("char-armor", armorId);
safeSetChecked("char-shield", char.combat.hasShield || false);
if (armorId !== "custom") { setTimeout(onArmorChange, 0); }
calculateAC();
// Restore HP max manual field
var hpMaxEl = $("hp-max-manual");
if (hpMaxEl) hpMaxEl.value = char.combat.hpMax || "";
// Show race bonuses + расовые доп. выборы
setTimeout(function() { onRaceChange(); renderRaceExtras(); }, 0);
// Обновить состояние селектора подкласса (с учётом текущего уровня)
setTimeout(updateSubclassOptions, 0);
// Применить блокировку основной информации (мастер создания)
setTimeout(applyBasicLockUI, 0);
renderWeapons();
updateAllStatDisplays();
renderSpellSlots();
renderMySpells();
renderInventory();
updateCoinTotal();
updateSlotsDisplay();
updateStatusBar();
updateConcentrationDisplay();
updateHPDisplay();
loadDeathSaves();
renderCompanions();
renderJournal();
renderTakenFeats();
renderResistances();
// Re-render party and battle with character-specific data
renderMyChar();
renderAllies();
renderNPCs();
renderMonsters();
renderSheetAvatar();
showScreen("character");
var lastTab = "";
try { lastTab = localStorage.getItem("dnd_last_tab") || "sheet"; } catch(e) { lastTab = "sheet"; }
var tabEl = $("tab-" + lastTab);
if (!tabEl) lastTab = "sheet";
document.querySelectorAll(".tab-content").forEach(function(t) { t.classList.remove("active"); });
document.querySelectorAll(".tab-btn").forEach(function(b) { b.classList.remove("active"); });
var activeTabEl = $("tab-" + lastTab);
if (activeTabEl) activeTabEl.classList.add("active");
document.querySelectorAll(".tab-btn").forEach(function(b) {
  if (b.getAttribute("onclick") && b.getAttribute("onclick").includes("'" + lastTab + "'")) b.classList.add("active");
});
if (lastTab === "party")  setTimeout(openPartyTab, 0);
if (lastTab === "battle") setTimeout(openBattleTab, 0);
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
  renderRaceExtras();
}

// ============================================
// РАСОВЫЕ ДОП. ВЫБОРЫ — Человек (черта), Полуэльф (+1+1)
// ============================================
// Сколько расовых черт даёт раса (PHB 2014)
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

  // ── Человек: 1 расовая черта ──────────────────────────────
  var featAllowance = RACE_BONUS_FEATS[race] || 0;
  if (featAllowance > 0) {
    if (!Array.isArray(char.raceFeats)) char.raceFeats = [];
    var taken = char.raceFeats.length;
    var remaining = featAllowance - taken;
    html += '<div class="race-extras-title">🎯 Расовая черта (' + race + ')</div>';
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

  // ── Полуэльф: +1 к двум характеристикам (кроме ХАР) ───────
  if (race === "Полуэльф") {
    if (!Array.isArray(char.raceStatChoice)) char.raceStatChoice = [];
    var statNames = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД"};
    var chosen = char.raceStatChoice;
    html += '<div class="race-extras-title">📊 Полуэльф: +1 к двум характеристикам (кроме ХАР)</div>';
    html += '<div class="race-extras-row">';
    Object.keys(statNames).forEach(function(k) {
      var sel = chosen.indexOf(k) !== -1;
      html += '<span class="race-extras-stat-pick' + (sel ? " selected" : "") +
        '" onclick="toggleHalfElfStat(\'' + k + '\')">' + statNames[k] + '</span>';
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

// ── Полуэльф: переключить характеристику для +1 ────────────
function toggleHalfElfStat(key) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  if (!Array.isArray(char.raceStatChoice)) char.raceStatChoice = [];
  var idx = char.raceStatChoice.indexOf(key);
  if (idx !== -1) {
    // Снять выбор: откатить +1
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
  updateStatDisplay(key);
  saveToLocal();
  calcStats();
  renderRaceExtras();
}

// ── Человек: открыть модалку выбора расовой черты ──────────
function openRaceFeatModal() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  asiSelectedStats = [];
  asiFeatSelected = null;
  asiCurrentLevel = "race"; // спец-маркер
  var modal = $("asi-modal");
  if (!modal) { showToast("Ошибка: модалка не найдена", "error"); return; }
  // Принудительно режим «черта»
  var featRadio = modal.querySelector('input[value="feat"]');
  if (featRadio) featRadio.checked = true;
  var title = modal.querySelector("h4");
  if (title) title.textContent = "🎯 Расовая черта · " + (char.race || "");
  buildASIStatGrid(char);
  updateASIPreview();
  modal.classList.add("active");
}

// ============================================
// МАСТЕР СОЗДАНИЯ ПЕРСОНАЖА — фиксация основы
// ============================================
// Поля основы, которые блокируются после фиксации
var BASIC_FIELD_IDS = ["char-name", "char-class", "char-subclass", "char-race", "char-background", "char-level"];

function applyBasicLockUI() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var banner = $("creation-wizard-banner");
  var lockedBar = $("basic-locked-bar");
  var locked = !!char.basicLocked;

  // Найти контейнеры (col), оборачивающие основные поля, для визуального dimming
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
      renderTakenFeats();
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
char.combat.hpCurrent = Math.min(parseInt(char.combat.hpCurrent) + hpHealed, parseInt(char.combat.hpMax));
char.combat.hpDiceSpent = (char.combat.hpDiceSpent || 0) + hitDiceToSpend;
// FIX: Warlock recovers spell slots on short rest
if (char.class === "Колдун" && char.spells && char.spells.slots) {
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
var warlockStr = (char.class === "Колдун") ? "<p>🔮 Ячейки пакта восстановлены</p>" : "";
resultDetails = "<div class='rest-comparison'><div class='before'>ХП: " + oldHp + "</div><div class='arrow'>→</div><div class='after'>ХП: " + char.combat.hpCurrent + "</div></div><p>🎲 Потрачено костей: " + hitDiceToSpend + rollStr + "</p><p>❤️ Восстановлено ХП: " + hpHealed + "</p><p>📊 Доступно костей: " + (char.level - char.combat.hpDiceSpent) + "/" + char.level + "</p>" + warlockStr;
} else if (currentRestType === "long") {
const maxHp = parseInt(char.combat.hpMax);
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
function openLevelUpModal() {
if (!currentId) { showToast("Сначала выберите персонажа!", "warn"); return; }
const char = getCurrentChar();
if (!char) return;
const currentLevel = char.level || 1;
if (currentLevel >= 20) { showToast("Максимальный уровень достигнут!", "warn"); return; }
const newLevel = currentLevel + 1;
const conMod = getMod(char.stats.con);
const className = char.class;
const hitDie = CLASS_HIT_DICE[className] || 8;
const currentMaxHP = calculateMaxHP(currentLevel, conMod, hitDie);
const newMaxHP = calculateMaxHP(newLevel, conMod, hitDie);
const hpGain = newMaxHP - currentMaxHP;
const profOld = getProficiencyBonus(currentLevel);
const profNew = getProficiencyBonus(newLevel);
$("lu-from-level").textContent = currentLevel;
$("lu-to-level").textContent = newLevel;
$("lu-hp-from").textContent = currentMaxHP;
$("lu-hp-to").textContent = newMaxHP;
$("lu-hp-gain").textContent = "+" + hpGain;
$("lu-hit-die").textContent = "1к" + hitDie;
$("lu-dice-count").textContent = newLevel + " шт.";
$("lu-prof-old").textContent = "+" + profOld;
if (profNew !== profOld) {
$("lu-prof-arrow").style.display = "inline";
$("lu-prof-new").style.display = "inline";
$("lu-prof-new").textContent = "+" + profNew;
} else {
$("lu-prof-arrow").style.display = "none";
$("lu-prof-new").style.display = "none";
}
const slotsCard = $("lu-slots-card");
const slotsInfo = $("lu-slots-info");
if (SPELL_SLOTS_BY_LEVEL[className] && SPELL_SLOTS_BY_LEVEL[className][newLevel]) {
const newSlots = SPELL_SLOTS_BY_LEVEL[className][newLevel];
const oldSlots = SPELL_SLOTS_BY_LEVEL[className][currentLevel] || [];
let slotParts = [];
for (let i = 1; i <= 9; i++) {
const n = newSlots[i] || 0;
const o = oldSlots[i] || 0;
if (n > 0) slotParts.push((n > o ? "<b>+" + (n-o) + "</b> " : "") + i + "ур.: " + n);
}
if (slotParts.length > 0) {
slotsCard.style.display = "";
slotsInfo.innerHTML = slotParts.join("  •  ");
} else { slotsCard.style.display = "none"; }
} else { slotsCard.style.display = "none"; }
const featuresContainer = $("lu-features-container");
featuresContainer.innerHTML = "";
if (CLASS_FEATURES[className] && CLASS_FEATURES[className][newLevel]) {
CLASS_FEATURES[className][newLevel].forEach(function(f) {
const div = document.createElement("div");
div.className = "lu-feature-item";
div.innerHTML = "<div class=\"lu-feature-name\">" + escapeHtml(f.name) + "</div><div class=\"lu-feature-desc\">" + escapeHtml(f.desc) + "</div>";
featuresContainer.appendChild(div);
});
}
$("lu-screen-preview").style.display = "";
$("lu-screen-result").style.display = "none";
const modal = $("levelup-modal");
if (modal) modal.classList.add("active");
}
function closeLevelUpModal() {
const modal = $("levelup-modal");
if (modal) modal.classList.remove("active");
}
function confirmLevelUp() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const oldLevel = char.level || 1;
const oldMaxHP = parseInt(char.combat.hpMax);
const oldProf = getProficiencyBonus(oldLevel);
char.level = oldLevel + 1;
const conMod = getMod(char.stats.con);
const className = char.class;
const hitDie = CLASS_HIT_DICE[className] || 8;
const newMaxHP = calculateMaxHP(char.level, conMod, hitDie);
const hpGain = newMaxHP - oldMaxHP;
const newProf = getProficiencyBonus(char.level);
char.combat.hpMax = newMaxHP;
char.combat.hpCurrent = Math.min(char.combat.hpCurrent + hpGain, newMaxHP);
char.combat.hpDice = "1к" + hitDie;
char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };
if (SPELL_SLOTS_BY_LEVEL[className] && SPELL_SLOTS_BY_LEVEL[className][char.level]) {
const slots = SPELL_SLOTS_BY_LEVEL[className][char.level];
for (let i = 1; i <= 9; i++) {
char.spells.slots[i] = slots[i] || 0;
char.spells.slotsUsed[i] = 0;
}
}
saveToLocal();
loadCharacter(currentId);
updateClassFeatures();
renderClassResources();
renderSpellSlots();
$("lu-screen-preview").style.display = "none";
$("lu-screen-result").style.display = "";
$("lu-result-title").textContent = "Уровень " + char.level + " достигнут!";
addJournalEntry("levelup", "Достигнут " + char.level + " уровень!", "ХП: " + oldMaxHP + " → " + newMaxHP + " · Бонус мастерства: +" + newProf);
renderJournal();
let resultLines = ["❤️ ХП: " + oldMaxHP + " → " + newMaxHP + " (+" + hpGain + ")", "🎲 Костей хитов: " + char.level];
if (newProf !== oldProf) resultLines.push("⚡ Бонус мастерства: +" + oldProf + " → +" + newProf);
if (CLASS_FEATURES[className] && CLASS_FEATURES[className][char.level]) {
const names = CLASS_FEATURES[className][char.level].map(function(f) { return f.name; });
resultLines.push("✨ Новые умения: " + names.join(", "));
}
$("lu-result-body").innerHTML = resultLines.map(function(l) {
return "<div class=\"lu-result-line\">" + escapeHtml(l) + "</div>";
}).join("");
}
function openDiceModal() {
const modal = $("dice-modal");
if (modal) modal.classList.add("active");
drawDiceSVG(20);
var numEl = $("dice-svg-num");
if (numEl) numEl.textContent = "?";
}
function closeDiceModal() {
const modal = $("dice-modal");
if (modal) modal.classList.remove("active");
const display = $("dice-result-display");
if (display) display.classList.remove("crit-success", "crit-fail", "normal");
}
function rollDice(sides, mode) {
const r1 = Math.floor(Math.random() * sides) + 1;
const r2 = (mode === 'adv' || mode === 'dis') ? Math.floor(Math.random() * sides) + 1 : null;
let result, resultLabel;
if (mode === 'adv') {
  result = Math.max(r1, r2);
  resultLabel = "Преимущество: " + r1 + " и " + r2;
} else if (mode === 'dis') {
  result = Math.min(r1, r2);
  resultLabel = "Помеха: " + r1 + " и " + r2;
} else {
  result = r1;
  resultLabel = "d" + sides;
}
const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// 3D dice animation
animateDice3d(sides, result, function() {
  var resultBig = $("dice-result-big");
  var resultInfo = $("dice-result-info");
  var resultBox = $("dice3d-result");
  if (resultBig) resultBig.textContent = result;
  if (resultBox) {
    resultBox.classList.remove("crit-success","crit-fail","normal");
    if (sides === 20 && result === 20) {
      resultBox.classList.add("crit-success");
      if (resultInfo) resultInfo.textContent = "🎉 КРИТИЧЕСКИЙ УСПЕХ!";
      createParticles();
    } else if (sides === 20 && result === 1) {
      resultBox.classList.add("crit-fail");
      if (resultInfo) resultInfo.textContent = "💀 КРИТИЧЕСКИЙ ПРОВАЛ!";
    } else {
      resultBox.classList.add("normal");
      if (resultInfo) resultInfo.textContent = resultLabel + " · " + timestamp;
    }
    resultBox.classList.add("pop");
    setTimeout(function(){ if(resultBox) resultBox.classList.remove("pop"); }, 400);
  }
});
diceHistory.unshift({ sides: sides, result: result, mode: mode || 'normal', time: timestamp, r1: r1, r2: r2 });
if (diceHistory.length > 10) diceHistory.pop();
renderDiceHistory();
}

// SVG paths for each die type
var DICE_SVG = {
  4:   { path: "M60,8 L108,100 L12,100 Z", // triangle
         color: "#c0392b", glow: "#e74c3c", numY: 75 },
  6:   { path: "M18,18 L102,18 L102,102 L18,102 Z", // square
         color: "#2980b9", glow: "#3498db", numY: 62 },
  8:   { path: "M60,6 L108,60 L60,114 L12,60 Z", // diamond
         color: "#27ae60", glow: "#2ecc71", numY: 62 },
  10:  { path: "M60,10 L100,45 L85,100 L35,100 L20,45 Z", // pentagon-diamond
         color: "#8e44ad", glow: "#9b59b6", numY: 65 },
  12:  { path: "M60,8 L100,32 L108,76 L76,108 L44,108 L12,76 L20,32 Z", // heptagon
         color: "#e67e22", glow: "#f39c12", numY: 64 },
  20:  { path: "M60,6 L106,28 L114,78 L80,114 L40,114 L6,78 L14,28 Z", // octagon-ish
         color: "#c9a040", glow: "#f1c40f", numY: 64 },
  100: { path: "M60,8 A52,52 0 1,1 59.9,8 Z", // circle
         color: "#16a085", glow: "#1abc9c", numY: 64 }
};

function drawDiceSVG(sides) {
  var svgEl = $("dice-svg");
  var shape = $("dice-svg-shape");
  var numEl = $("dice-svg-num");
  var typeEl = $("dice-svg-type");
  if (!svgEl || !shape) return;
  var d = DICE_SVG[sides] || DICE_SVG[20];
  // Set glow color
  svgEl.style.setProperty("--dice-glow", d.glow);
  // Draw shape
  if (sides === 100) {
    // Full circle via element
    shape.innerHTML = '<circle cx="60" cy="60" r="52" fill="' + d.color + '" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>';
  } else {
    shape.innerHTML = '<path d="' + d.path + '" fill="' + d.color + '" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linejoin="round"/>';
  }
  if (numEl) { numEl.setAttribute("y", d.numY || 64); }
  if (typeEl) typeEl.textContent = "d" + sides;
}

function animateDice3d(sides, result, callback) {
  var svgContainer = document.querySelector(".dsvg-container");
  var numEl = $("dice-svg-num");
  if (!svgContainer) { callback(); return; }
  drawDiceSVG(sides);
  // Show rolling numbers
  var numEl = $("dice-svg-num");
  var rollInterval = setInterval(function() {
    if (numEl) numEl.textContent = Math.floor(Math.random() * sides) + 1;
  }, 60);
  // Shake animation
  svgContainer.classList.remove("dsvg-shake");
  void svgContainer.offsetWidth;
  svgContainer.classList.add("dsvg-shake");
  setTimeout(function() {
    clearInterval(rollInterval);
    svgContainer.classList.remove("dsvg-shake");
    if (numEl) numEl.textContent = result;
    // Land animation
    svgContainer.classList.add("dsvg-land");
    setTimeout(function() {
      svgContainer.classList.remove("dsvg-land");
      callback();
    }, 350);
  }, 700);
}

function rollCustomFormula() {
const input = $("dice-custom-input");
if (!input) return;
const formula = input.value.trim().toLowerCase().replace(/к/g,"d").replace(/\s/g,"");
if (!formula) return;
// Parse NdX+M or NdX-M or just NdX
const match = formula.match(/^(\d+)d(\d+)([+-]\d+)?$/);
if (!match) { 
  const display = $("dice-result-display");
  const resultInfo = $("dice-result-info");
  if (display) { display.classList.remove("crit-success","crit-fail","normal"); display.classList.add("normal"); }
  if (resultInfo) resultInfo.textContent = "Неверный формат (пример: 2к6+3)";
  return; 
}
const count = Math.min(parseInt(match[1]) || 1, 20);
const sides = Math.min(parseInt(match[2]) || 6, 100);
const bonus = parseInt(match[3] || "0");
let rolls = [], total = 0;
for (let i = 0; i < count; i++) { const r = Math.floor(Math.random() * sides)+1; rolls.push(r); total += r; }
total += bonus;
total = Math.max(1, total);
const timestamp = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
const display = $("dice-result-display");
const resultBig = $("dice-result-big");
const resultInfo = $("dice-result-info");
if (!display||!resultBig||!resultInfo) return;
display.classList.remove("crit-success","crit-fail","normal"); void display.offsetWidth;
display.classList.add("normal");
resultBig.textContent = total;
const rollStr = rolls.join("+") + (bonus !== 0 ? (bonus>0?"+":"")+bonus : "");
resultInfo.textContent = formula.replace(/d/g,"к") + " = " + rollStr + (count>1||bonus!==0?" = "+total:"");
diceHistory.unshift({ sides: sides, result: total, mode: "custom", formula: formula.replace(/d/g,"к"), time: timestamp });
if (diceHistory.length > 10) diceHistory.pop();
renderDiceHistory();
}
function renderDiceHistory() {
const container = $("dice-history");
if (!container) return;
container.innerHTML = "";
diceHistory.forEach(function(record) {
const div = document.createElement("div");
div.className = "dice-history-item";
if (record.sides === 20) {
if (record.result === 20) div.classList.add("crit-success");
else if (record.result === 1) div.classList.add("crit-fail");
}
const modeTag = record.mode === 'adv' ? ' ▲' : record.mode === 'dis' ? ' ▼' : '';
const label = record.mode === 'custom' ? (record.formula || "custom") : ("d" + record.sides + modeTag);
div.innerHTML = "<span>" + label + " (" + record.time + ")</span><span>" + record.result + "</span>";
container.appendChild(div);
});
}
function createParticles() {
const display = $("dice-result-display");
if (!display) return;
for (let i = 0; i < 20; i++) {
const particle = document.createElement("div");
particle.className = "particle";
particle.style.left = (Math.random() * 100) + "%";
particle.style.top = (Math.random() * 100) + "%";
particle.style.animationDelay = (Math.random() * 0.5) + "s";
display.appendChild(particle);
setTimeout(() => particle.remove(), 1000);
}
}
function filterInventory(category, btn) {
currentFilterCategory = category;
document.querySelectorAll(".inventory-filters button").forEach(function(b) { b.classList.remove("active"); });
if (btn) btn.classList.add("active");
renderInventory();
}
// ── Slot system ──
// OSR slot system: все предметы занимают слоты
// weapon: 1h=1, 2h=2 | armor=3 | potion=1/2 | scroll=1 | tool/other=1
const ITEM_SLOTS = { weapon:1, armor:3, potion:0.5, scroll:1, tool:1, material:1, other:1 };
const BELT_LABELS = { weapon1:"Оружие 1", weapon2:"Оружие 2", rope:"Верёвка", shield:"Щит" };
const POUCH_STR_REQ = [8, 12, 16, 18]; // СИЛ для каждого мешочка
const POUCH_MAX = 500; // монет в мешочке

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
    (char.inventory[cat] || []).forEach(function(item) {
      // Custom slots override takes priority
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
const div = document.createElement("div");
div.className = "inv-item";
div.dataset.category = data.category;
div.dataset.index = data.index;
div.innerHTML =
  '<div class="inv-item-main" onclick="toggleInvItem(this)">' +
    '<div class="inv-item-icon">' + icon + '</div>' +
    '<div class="inv-item-info">' +
      '<div class="inv-item-name">' + escapeHtml(item.name) + '</div>' +
      '<div class="inv-item-meta">' +
        '<span class="inv-meta-tag">' + (item.qty || 1) + ' шт.</span>' +
        '<span class="inv-meta-tag">⚖️ ' + totalWeight + ' фнт</span>' +
        '<span class="inv-meta-tag inv-cat-tag">' + catName + '</span>' +
        '<span class="inv-meta-tag inv-slot-tag">' + slotsLabel + '</span>' +
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
if (descEl) descEl.value = item.desc || "";
} else {
if (titleEl) titleEl.textContent = "Добавить предмет";
if (nameEl) nameEl.value = "";
if (qtyEl) qtyEl.value = 1;
if (weightEl) weightEl.value = 0;
const slotsInpNew = $("new-item-slots");
if (slotsInpNew) slotsInpNew.value = "";
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
// Two-Weapon Fighting
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
function renderSpellSlots() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const container = $("spell-slots-visual");
if (!container) return;
container.innerHTML = "";
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
  for(let j=0; j<total; j++) {
    var cls = j < used ? " used" : "";
    diamHtml += '<div class="spell-diamond' + cls + '" data-level="' + i + '" data-idx="' + j + '" onclick="toggleSpellSlot(' + i + ',' + j + ')"></div>';
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
function updateSpellSlots(level, value) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
char.spells.slots[level] = parseInt(value) || 0;
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
saveToLocal();
renderSpellSlots();
}
function adjustSpellSlots(level, delta) {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
const input = $('slots-' + level + '-total');
let current = input ? parseInt(input.value) : (char.spells.slots[level] || 0);
if (isNaN(current)) current = char.spells.slots[level] || 0;
let newValue = current + delta;
if (newValue < 0) newValue = 0;
if (newValue > 10) newValue = 10;
char.spells.slots[level] = newValue;
if (char.spells.slotsUsed[level] > newValue) {
char.spells.slotsUsed[level] = newValue;
}
saveToLocal();
renderSpellSlots();
}
function restoreAllSlots() {
if (!currentId) return;
const char = getCurrentChar();
if (!char) return;
for(let i=1; i<=9; i++) { char.spells.slotsUsed[i] = 0; }
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
document.querySelectorAll("#spell-search-modal .version-btn").forEach(function(btn) { btn.classList.remove("active"); });
var btnId = "btn-class-" + (cls === "all" ? "all" : cls);
var btn = $(btnId);
if (btn) btn.classList.add("active");
renderSpellSearch();
}
function openSpellSearch() {
const modal = $("spell-search-modal");
if (modal) modal.classList.add("active");
safeSet("spell-search-input", "");
safeSet("spell-search-level", "");
renderSpellSearch();
}
function closeSpellSearch() {
const modal = $("spell-search-modal");
if (modal) modal.classList.remove("active");
}
function openAddSpellForm() {
const modal = $("add-spell-modal");
if (modal) modal.classList.add("active");
safeSet("new-spell-name", "");
safeSet("new-spell-desc", "");
safeSet("new-spell-higher", "");
}
function closeAddSpellForm() {
const modal = $("add-spell-modal");
if (modal) modal.classList.remove("active");
}
function submitNewSpell() {
const name = $("new-spell-name")?.value?.trim() || "";
const desc = $("new-spell-desc")?.value?.trim() || "";
if (!name || !desc) { showToast("Название и описание обязательны!", "warn"); return; }
const newSpell = {
id: Date.now(),
name: name,
level: parseInt($("new-spell-level")?.value) || 0,
class: $("new-spell-class")?.value || "wizard",
source: $("new-spell-source")?.value || "PH14",
school: "воплощение",
time: $("new-spell-time")?.value || "1 действие",
range: $("new-spell-range")?.value || "60 фт",
components: $("new-spell-components")?.value || "V,S",
duration: $("new-spell-duration")?.value || "Мгновенно",
desc: desc,
higherLevel: $("new-spell-higher")?.value?.trim() || ""
};
SPELL_DATABASE.push(newSpell);
saveToLocal();
closeAddSpellForm();
showToast("Заклинание добавлено!", "success");
renderSpellSearch();
}
function renderSpellSearch() {
const search = ($("spell-search-input")?.value || "").toLowerCase();
const level = $("spell-search-level")?.value || "";
const container = $("spell-search-results");
if (!container) return;
const char = getCurrentChar();
let filtered = SPELL_DATABASE.filter(function(spell) {
const matchesSearch = spell.name.toLowerCase().includes(search);
const matchesLevel = level === "" || spell.level.toString() === level;
const matchesVersion = currentSpellVersion === "all" || spell.source === currentSpellVersion;
const spellClasses = Array.isArray(spell.classes) ? spell.classes : [spell.class || "both"];
const matchesClass = currentSpellClass === "all" || spellClasses.includes("both") || spellClasses.includes(currentSpellClass);
return matchesSearch && matchesLevel && matchesVersion && matchesClass;
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
const classText = spellClassArr.length > 1 ? spellClassArr.map(function(c){return CLASS_ICONS_MAP[c]||"✨";}).join("") : (CLASS_ICONS_MAP[primaryClass] || "✨");
var div = document.createElement("div");
div.className = "spell-item" + (isAdded ? " spell-added" : "");
div.innerHTML = "<h4>" + escapeHtml(spell.name) + " <span class=\"source-badge source-" + spell.source.toLowerCase() + "\">" + escapeHtml(spell.source) + "</span> <span class=\"class-badge " + classBadge + "\">" + classText + "</span></h4><div class=\"spell-meta\"><span>" + (spell.level > 0 ? spell.level + " ур." : "Заговор") + "</span><span>" + escapeHtml(spell.time) + "</span><span>" + escapeHtml(spell.range) + "</span><span>" + escapeHtml(spell.components) + "</span></div><p>" + escapeHtml(spell.desc) + "</p>" + (spell.higherLevel ? "<p class=\"spell-higher\">" + escapeHtml(spell.higherLevel) + "</p>" : "") + "<button class=\"" + (isAdded ? "secondary" : "small") + "\" onclick=\"" + (isAdded ? "removeSpell(" + spell.id + ")" : "addSpell(" + spell.id + ")") + "\" style=\"margin-top:8px;\">" + (isAdded ? "Добавлено" : "+ Добавить") + "</button>";
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
saveToLocal();
renderSpellSearch();
renderMySpells();
}
}
function removeSpell(spellId) {
const char = getCurrentChar();
if (!char) return;
char.spells.mySpells = char.spells.mySpells.filter(function(s) { return s.id !== spellId; });
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
if (!char.spells.mySpells || char.spells.mySpells.length === 0) {
container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 24px 0;">✨ Нет заклинаний — нажмите «Найти заклинание»</p>';
return;
}
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
byLevel[level].forEach(function(spell) {
const spellClassArr2 = Array.isArray(spell.classes) ? spell.classes : [spell.class || "both"];
const classIcons = spellClassArr2.map(function(c){ return CLASS_ICONS_MAP[c] || "✨"; }).join(" ");
const sourceClass = "source-" + (spell.source || "ph14").toLowerCase();
const schoolName = spell.school || "";
var metaParts = [];
if (spell.time) metaParts.push('<span>⚡ ' + escapeHtml(spell.time) + '</span>');
if (spell.range) metaParts.push('<span>📏 ' + escapeHtml(spell.range) + '</span>');
if (spell.components) metaParts.push('<span>' + escapeHtml(spell.components) + '</span>');
if (spell.duration) metaParts.push('<span>⏱ ' + escapeHtml(spell.duration) + '</span>');
var card = document.createElement("div");
card.className = "my-spell-item";
card.dataset.spellId = spell.id;
card.innerHTML =
  '<div class="spell-card-header" onclick="toggleSpellCard(this)">' +
    '<div class="spell-card-title">' +
      '<span class="spell-card-arrow">▶</span>' +
      '<span class="spell-card-name">' + escapeHtml(spell.name) + '</span>' +
    '</div>' +
    '<div class="spell-card-badges">' +
      '<span class="source-badge ' + sourceClass + '">' + escapeHtml(spell.source || "") + '</span>' +
      (schoolName ? '<span class="school-badge">' + escapeHtml(schoolName) + '</span>' : '') +
      '<span class="class-icons-row">' + classIcons + '</span>' +
    '</div>' +
  '</div>' +
  '<div class="spell-card-meta">' + metaParts.join("") + '</div>' +
  '<div class="spell-card-body">' +
    (spell.desc ? '<div class="spell-full-desc">' + escapeHtml(spell.desc) + '</div>' : '') +
    (spell.higherLevel ? '<div class="spell-higher">📈 На больших уровнях: ' + escapeHtml(spell.higherLevel) + '</div>' : '') +
    '<div class="spell-card-actions">' +
    (spell.duration && spell.duration.toLowerCase().includes('концентрац') ? '<button class="spell-conc-btn" onclick="setConcentration(this.dataset.name)" data-name="' + escapeHtml(spell.name) + '">🔮 Концентрация</button>' : '') +
    '<button class="spell-remove-btn" onclick="removeSpell(' + spell.id + ')">🗑 Удалить</button>' +
    '</div>' +
  '</div>';
groupDiv.appendChild(card);
});
});
}
function exportData() {
const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(characters));
const downloadAnchorNode = document.createElement("a");
downloadAnchorNode.setAttribute("href", dataStr);
downloadAnchorNode.setAttribute("download", "dnd_backup_" + new Date().toISOString().slice(0,10) + ".json");
document.body.appendChild(downloadAnchorNode);
downloadAnchorNode.click();
downloadAnchorNode.remove();
}
function importData(input) {
const file = input?.files?.[0];
if (!file) return;
const reader = new FileReader();
reader.onload = function(e) {
try {
const imported = JSON.parse(e.target.result);
if (Array.isArray(imported)) {
characters = imported;
saveToLocal();
renderCharacterList();
showToast("Данные загружены!", "success");
} else {
showToast("Ошибка: неверный формат файла", "error");
}
} catch (err) {
showToast("Ошибка чтения файла", "error");
}
};
reader.readAsText(file);
}
function exportSpells() {
const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SPELL_DATABASE));
const downloadAnchorNode = document.createElement("a");
downloadAnchorNode.setAttribute("href", dataStr);
downloadAnchorNode.setAttribute("download", "dnd_spells_" + new Date().toISOString().slice(0,10) + ".json");
document.body.appendChild(downloadAnchorNode);
downloadAnchorNode.click();
downloadAnchorNode.remove();
}
function importSpells(input) {
const file = input?.files?.[0];
if (!file) return;
const reader = new FileReader();
reader.onload = function(e) {
try {
const imported = JSON.parse(e.target.result);
if (Array.isArray(imported)) {
SPELL_DATABASE = imported;
saveToLocal();
showToast("Заклинаний загружено: " + imported.length, "success");
} else {
showToast("Ошибка: неверный формат файла", "error");
}
} catch (err) {
showToast("Ошибка чтения файла", "error");
}
};
reader.readAsText(file);
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

// ============================================================
// УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ (замена alert)
// type: 'success' | 'error' | 'warn' | 'info'
// ============================================================
function showToast(msg, type) {
  var container = $("hp-toast-container");
  if (!container) return;
  var t = type || "info";
  var toast = document.createElement("div");
  toast.className = "hp-toast app-toast app-toast-" + t;
  var icons = { success:"✅", error:"❌", info:"ℹ️", warn:"⚠️" };
  toast.innerHTML = "<span style='margin-right:6px'>" + (icons[t] || "ℹ️") + "</span><span>" + escapeHtml(String(msg)) + "</span>";
  container.appendChild(toast);
  toast._fadeTimer   = setTimeout(function() { toast.classList.add("hp-toast-fade"); }, 2200);
  toast._removeTimer = setTimeout(function() { if (toast.parentNode) toast.remove(); }, 2700);
}

function openHPHistory() {
const modal = $("hp-history-modal");
if (!modal) return;
const list = $("hp-history-list");
if (!list) return;
if (hpHistory.length === 0) {
list.innerHTML = "<div class=\"hph-empty\">История пуста</div>";
} else {
list.innerHTML = hpHistory.map(function(e) {
const cls = e.delta > 0 ? "hph-heal" : "hph-dmg";
const sign = e.delta > 0 ? "+" : "";
return "<div class=\"hph-row\">" +
"<span class=\"hph-time\">" + e.time + "</span>" +
"<span class=\"hph-source\">" + escapeHtml(e.source) + "</span>" +
"<span class=\"hph-nums\">" + e.from + " → " + e.to + "</span>" +
"<span class=\"hph-delta " + cls + "\">" + sign + e.delta + "</span>" +
"</div>";
}).join("");
}
modal.classList.add("active");
}

function closeHPHistory() {
const modal = $("hp-history-modal");
if (modal) modal.classList.remove("active");
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

// ============================================
// АСИ — Улучшение характеристик
// ============================================
// openASIModal и closeASIModal определены ниже

// ============================================================
// Регистрация Service Worker + автообнаружение обновлений
// ============================================================
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', function() {
    // Проверяем, было ли обновление после перезагрузки
    checkWhatsNew();
    navigator.serviceWorker.register('./sw.js')
      .then(function(reg) {
        console.log('[PWA] SW зарегистрирован:', reg.scope);
        if (reg.waiting) {
          showUpdateModal(reg.waiting);
          updateVersionBlock(true, reg.waiting);
        } else {
          updateVersionBlock(false);
        }
        reg.addEventListener('updatefound', function() {
          var newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', function() {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateModal(newWorker);
              updateVersionBlock(true, newWorker);
            }
          });
        });
      })
      .catch(function(err) {
        console.log('[PWA] SW ошибка:', err);
        updateVersionBlock(false);
      });
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (!refreshing) { refreshing = true; window.location.reload(); }
    });
  });
} else {
  window.addEventListener('load', function() { updateVersionBlock(false); });
}

// ── Окно "Установить обновление" (до установки — без changelog) ──
function showUpdateModal(worker) {
  if ($('sw-update-modal')) return;
  var ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '?';
  // Сохраняем текущую версию перед обновлением
  try { localStorage.setItem('dnd_pre_update_version', ver); } catch(e) {}
  var modal = document.createElement('div');
  modal.id = 'sw-update-modal';
  modal.innerHTML =
    '<div class="sw-update-box">' +
      '<div class="sw-update-header">' +
        '<div class="sw-update-icon">🎲</div>' +
        '<div class="sw-update-title">Доступно обновление!</div>' +
        '<div class="sw-update-version">Текущая версия: v' + escapeHtml(ver) + '</div>' +
      '</div>' +
      '<div class="sw-update-safe">🔒 <b>Персонажи и данные сохранятся</b> — обновление меняет только код приложения, данные хранятся отдельно в браузере</div>' +
      '<div class="sw-update-btns"><button id="sw-update-later">Позже</button><button id="sw-update-now">⚡ Установить обновление</button></div>' +
    '</div>';
  document.body.appendChild(modal);
  requestAnimationFrame(function() { modal.classList.add('sw-update-visible'); });
  $('sw-update-now').addEventListener('click', function() {
    $('sw-update-now').textContent = '⏳ Обновляем...';
    $('sw-update-now').disabled = true;
    $('sw-update-later').disabled = true;
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
  $('sw-update-later').addEventListener('click', function() {
    modal.classList.remove('sw-update-visible');
    setTimeout(function() { if (modal.parentNode) modal.remove(); }, 300);
  });
}

// ── Окно "Что нового" (после установки и перезагрузки — с changelog) ──
function checkWhatsNew() {
  try {
    var prevVer = localStorage.getItem('dnd_pre_update_version');
    if (!prevVer) return;
    var curVer = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : null;
    if (!curVer || prevVer === curVer) return;
    // Версия изменилась — показываем что нового
    localStorage.removeItem('dnd_pre_update_version');
    showWhatsNewModal(prevVer, curVer);
  } catch(e) {}
}

function showWhatsNewModal(prevVer, newVer) {
  if ($('sw-update-modal')) return;
  var latest = (typeof APP_CHANGELOG !== 'undefined' && APP_CHANGELOG.length > 0) ? APP_CHANGELOG[0] : null;
  var typeIcon  = { feat:'✨', fix:'🐛', improve:'⚡', data:'📦' };
  var typeColor = { feat:'#4da843', fix:'#e74c3c', improve:'#5b9bd5', data:'#d4a843' };
  var changesList = latest ? latest.changes.map(function(c) {
    return '<div class="sw-change-item"><span class="sw-change-icon" style="color:' + (typeColor[c.type] || '#9a9ab0') + '">' + (typeIcon[c.type] || '•') + '</span><span class="sw-change-text">' + escapeHtml(c.text) + '</span></div>';
  }).join('') : '<div class="sw-change-item">Улучшения и исправления</div>';
  var modal = document.createElement('div');
  modal.id = 'sw-update-modal';
  modal.innerHTML =
    '<div class="sw-update-box">' +
      '<div class="sw-update-header">' +
        '<div class="sw-update-icon">🎉</div>' +
        '<div class="sw-update-title">Обновлено!</div>' +
        '<div class="sw-update-version">v' + escapeHtml(prevVer) + ' → v' + escapeHtml(newVer) + (latest ? ' · ' + escapeHtml(latest.date) : '') + '</div>' +
      '</div>' +
      '<div class="sw-update-changes"><div class="sw-changes-title">📋 Что нового (' + (latest ? latest.changes.length : 0) + '):</div>' + changesList + '</div>' +
      '<div class="sw-update-safe">🔒 <b>Все данные сохранены</b> — ваши персонажи и заклинания на месте</div>' +
      '<div class="sw-update-btns"><button id="sw-update-now" style="flex:1">👍 Отлично!</button></div>' +
    '</div>';
  document.body.appendChild(modal);
  requestAnimationFrame(function() { modal.classList.add('sw-update-visible'); });
  $('sw-update-now').addEventListener('click', function() {
    modal.classList.remove('sw-update-visible');
    setTimeout(function() { if (modal.parentNode) modal.remove(); }, 300);
  });
}

// ============================================================
// ⚔️ ОТРЯД — Соратники, NPC, Монстры
// ============================================================

var PARTY_DATA = { allies: [], monsters: [], npcs: [] };
var BATTLE_DATA = { active: false, participants: [], currentTurn: 0 };

var CONDITION_STATUSES = [
  { value: "healthy", label: "💚 Здоров" },
  { value: "wounded", label: "💛 Ранен" },
  { value: "heavy",   label: "🟠 Тяжело ранен" },
  { value: "dying",   label: "❤️ При смерти" },
  { value: "dead",    label: "💀 Мёртв" }
];

var MONSTER_TYPE_ICONS = {
  "Зверь":      "🐺",
  "Нежить":     "💀",
  "Демон":      "😈",
  "Дракон":     "🐉",
  "Гуманоид":   "🗡️",
  "Конструкт":  "🤖",
  "Фея":        "🧚",
  "Исчадие":    "👿",
  "Великан":    "🗿",
  "Аберрация":  "🦑",
  "Элементаль": "⚡",
  "Растение":   "🌿",
  "Монстр":     "👾"
};

function getMonsterTypeIcon(type) { return MONSTER_TYPE_ICONS[type] || "👾"; }

(function initParty() {
  // Global fallback load — per-character data is loaded in loadCharacter()
  try {
    var saved = localStorage.getItem("dnd_party");
    if (saved) {
      var parsed = JSON.parse(saved);
      if (!parsed.allies)   parsed.allies   = [];
      if (!parsed.monsters) parsed.monsters = [];
      if (!parsed.npcs)     parsed.npcs     = [];
      PARTY_DATA = parsed;
    }
  } catch(e) {}
  try {
    var savedBattle = localStorage.getItem("dnd_battle");
    if (savedBattle) BATTLE_DATA = JSON.parse(savedBattle);
  } catch(e) {}
})();

function saveParty() {
  if (!currentId) { try { localStorage.setItem("dnd_party", JSON.stringify(PARTY_DATA)); } catch(e) {} return; }
  var char = getCurrentChar();
  if (char) { char.party = PARTY_DATA; saveToLocal(); }
}
function saveBattle() {
  if (!currentId) { try { localStorage.setItem("dnd_battle", JSON.stringify(BATTLE_DATA)); } catch(e) {} return; }
  var char = getCurrentChar();
  if (char) { char.battle = BATTLE_DATA; saveToLocal(); }
}

// ─── helpers ─────────────────────────────────────────────────
function getMonsterIcon(type) { return getMonsterTypeIcon(type); }
function getFactionColor(type) {
  if (type === "self")    return "#4da843";
  if (type === "ally")    return "#27ae60";
  if (type === "npc")     return "#d4ac0d";
  return "#c0392b";
}
function getFactionLabel(type) {
  if (type === "self")    return "я";
  if (type === "ally")    return "союзник";
  if (type === "npc")     return "персонаж";
  return "враг";
}
function getStatusColor(status) {
  var map = { healthy:"#4da843", wounded:"#d4a843", heavy:"#e67e22", dying:"#e74c3c", dead:"#7f8c8d" };
  return map[status] || "#4da843";
}

// ─── PARTY TAB ────────────────────────────────────────────────
function openPartyTab() {
  renderMyChar();
  renderAllies();
  renderNPCs();
  renderMonsters();
}

// ─── MY CHAR ─────────────────────────────────────────────────
function renderMyChar() {
  var container = $("my-char-card");
  if (!container) return;
  var char = getCurrentChar();
  if (!char) {
    container.innerHTML = "<div class='party-empty'>Откройте персонажа из списка профилей</div>";
    return;
  }
  var icon  = getClassIcon(char.class);
  var color = getClassColor(char.class);
  var hpCurrent = char.combat ? (char.combat.hpCurrent || 0) : 0;
  var hpMax     = char.combat ? (char.combat.hpMax || 0) : 0;
  var hpPct     = hpMax > 0 ? Math.min(100, Math.round(hpCurrent / hpMax * 100)) : 100;
  var hpColor   = hpPct > 60 ? "#4da843" : hpPct > 30 ? "#e67e22" : "#e74c3c";
  var conds     = (char.conditions && char.conditions.length) ? "⚠️ " + char.conditions.length + " статус" : "";
  container.innerHTML =
    '<div class="pcard pcard-self">' +
      '<div class="pcard-icon" style="background:' + color + '22;color:' + color + '">' + icon + '</div>' +
      '<div class="pcard-body">' +
        '<div class="pcard-name">' + escapeHtml(char.name || "Мой персонаж") + '<span class="pcard-self-badge">я</span></div>' +
        '<div class="pcard-sub">' + escapeHtml((char.class||"") + (char.subclass ? " · "+char.subclass : "") + " · " + (char.level||1) + " ур.") + '</div>' +
        '<div class="pcard-badges">' +
          '<span class="pcard-badge" style="color:' + hpColor + ';border-color:' + hpColor + '55;background:' + hpColor + '18">❤️ ' + hpCurrent + '/' + hpMax + '</span>' +
          '<span class="pcard-badge">🛡️ ' + (char.combat ? (char.combat.ac||10) : 10) + '</span>' +
          (conds ? '<span class="pcard-badge pcard-badge-warn">' + conds + '</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
}

// ─── ALLIES ──────────────────────────────────────────────────
function renderAllies() {
  var list    = $("allies-list");
  var countEl = $("allies-count");
  if (!list) return;
  if (countEl) countEl.textContent = PARTY_DATA.allies.length > 0 ? PARTY_DATA.allies.length : "";
  if (PARTY_DATA.allies.length === 0) { list.innerHTML = "<div class='party-empty'>📭 Нет соратников. Добавьте первого!</div>"; return; }
  list.innerHTML = PARTY_DATA.allies.map(function(a, i) {
    var icon  = getClassIcon(a.cls);
    var color = getClassColor(a.cls);
    return '<div class="pcard">' +
      '<div class="pcard-icon" style="background:' + color + '22;color:' + color + '">' + icon + '</div>' +
      '<div class="pcard-body">' +
        '<div class="pcard-name">' + escapeHtml(a.name) + '</div>' +
        '<div class="pcard-sub">' + escapeHtml(a.cls || "Класс не указан") + '</div>' +
        (a.desc ? '<div class="pcard-desc">' + escapeHtml(a.desc) + '</div>' : '') +
        '<div class="pcard-status-row"><select class="pcard-status-sel" onchange="setAllyStatus(' + i + ',this.value)" onclick="event.stopPropagation()">' +
        CONDITION_STATUSES.map(function(s) { return '<option value="' + s.value + '"' + (s.value === (a.status||"healthy") ? " selected" : "") + '>' + s.label + '</option>'; }).join("") +
        '</select></div>' +
      '</div>' +
      '<div class="pcard-actions">' +
        '<button class="pcard-edit-btn" onclick="openEditAllyModal(' + i + ')" title="Редактировать">✏️</button>' +
        '<button class="pcard-del-btn"  onclick="deleteAlly(' + i + ')" title="Удалить">✕</button>' +
      '</div>' +
    '</div>';
  }).join("");
}

// ─── PARTY ENTITY MODAL (unified for ally / npc / monster) ───
var _PENT = {
  ally:    { modal:"add-ally-modal",    title:"ally-modal-title",    idx:"ally-edit-index",
             fields: [{id:"ally-name-inp",key:"name"},{id:"ally-class-sel",key:"cls"},{id:"ally-desc-inp",key:"desc"}],
             list: function() { return PARTY_DATA.allies; },
             render: function() { renderAllies(); },
             addLabel:"🧑‍🤝‍🧑 Добавить соратника", editLabel:"✏️ Редактировать соратника",
             delMsg: "Удалить соратника?", delKey:"name" },
  npc:     { modal:"add-npc-modal",     title:"npc-modal-title",     idx:"npc-edit-index",
             fields: [{id:"npc-name-inp",key:"name"},{id:"npc-role-inp",key:"role",default:"Персонаж"},{id:"npc-desc-inp",key:"desc"}],
             list: function() { if (!PARTY_DATA.npcs) PARTY_DATA.npcs = []; return PARTY_DATA.npcs; },
             render: function() { renderNPCs(); },
             addLabel:"🧑 Добавить персонажа", editLabel:"✏️ Редактировать персонажа",
             delMsg: "Удалить персонажа?", delKey:"name" },
  monster: { modal:"add-monster-modal", title:"monster-modal-title", idx:"monster-edit-index",
             fields: [{id:"monster-name-inp",key:"name"},{id:"monster-type-sel",key:"type",default:"Монстр"},{id:"monster-desc-inp",key:"desc"}],
             list: function() { return PARTY_DATA.monsters; },
             render: function() { renderMonsters(); },
             addLabel:"👹 Добавить монстра", editLabel:"✏️ Редактировать монстра",
             delMsg: "Удалить монстра?", delKey:"name" }
};
function _pentOpen(type, i) {
  var cfg = _PENT[type]; if (!cfg) return;
  var isEdit = (i !== undefined && i >= 0);
  $(cfg.title).textContent = isEdit ? cfg.editLabel : cfg.addLabel;
  $(cfg.idx).value = isEdit ? i : "-1";
  var item = isEdit ? cfg.list()[i] : null;
  cfg.fields.forEach(function(f) { $(f.id).value = item ? (item[f.key] || "") : ""; });
  openModal(cfg.modal);
}
function _pentClose(type) { closeModal(_PENT[type].modal); }
function _pentSave(type) {
  var cfg = _PENT[type];
  var nameField = cfg.fields[0];
  var name = $(nameField.id).value.trim();
  if (!name) { showToast("Введите имя", "warn"); return; }
  var list = cfg.list();
  var idx = parseInt($(cfg.idx).value);
  var data = { id: idx >= 0 ? (list[idx].id || Date.now()) : Date.now(), status: idx >= 0 ? (list[idx].status || "healthy") : "healthy" };
  cfg.fields.forEach(function(f) { data[f.key] = $(f.id).value.trim() || (f.default || ""); });
  if (!data.name) data.name = name;
  if (idx >= 0) list[idx] = data; else list.push(data);
  saveParty(); cfg.render(); _pentClose(type);
}
function _pentDelete(type, i) {
  var cfg = _PENT[type];
  var name = cfg.list()[i] ? cfg.list()[i][cfg.delKey] : "запись";
  showConfirmModal(cfg.delMsg, "«"+name+"» будет удалён.", function() { cfg.list().splice(i,1); saveParty(); cfg.render(); });
}
function _pentStatus(type, i, val) { _PENT[type].list()[i].status = val; saveParty(); }
function _pentExport(type) {
  var a = document.createElement("a");
  a.href = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_PENT[type].list(), null, 2));
  a.download = type + "_" + new Date().toISOString().slice(0,10) + ".json"; a.click();
}
function _pentImport(type, input) {
  var file = input.files[0]; if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try { var d = JSON.parse(e.target.result);
      if (Array.isArray(d)) { PARTY_DATA[type === "ally" ? "allies" : type+"s"] = d; saveParty(); _PENT[type].render(); }
      else showToast("Неверный формат файла", "error");
    } catch(err) { showToast("Ошибка загрузки", "error"); }
  };
  reader.readAsText(file); input.value = "";
}
// Обёртки — сохраняем старые имена чтобы не менять index.html
function openAddAllyModal()        { _pentOpen("ally"); }
function openEditAllyModal(i)      { _pentOpen("ally", i); }
function closeAddAllyModal()       { _pentClose("ally"); }
function saveAlly()                { _pentSave("ally"); }
function deleteAlly(i)             { _pentDelete("ally", i); }
function setAllyStatus(i, val)     { _pentStatus("ally", i, val); }
function exportAllies()            { _pentExport("ally"); }
function importAllies(input)       { _pentImport("ally", input); }

function openAddNPCModal()         { _pentOpen("npc"); }
function openEditNPCModal(i)       { _pentOpen("npc", i); }
function closeAddNPCModal()        { _pentClose("npc"); }
function saveNPC()                 { _pentSave("npc"); }
function deleteNPC(i)              { _pentDelete("npc", i); }
function setNPCStatus(i, val)      { _pentStatus("npc", i, val); }
function exportNPCs()              { _pentExport("npc"); }
function importNPCs(input)         { _pentImport("npc", input); }

function openAddMonsterModal()     { _pentOpen("monster"); }
function openEditMonsterModal(i)   { _pentOpen("monster", i); }
function closeAddMonsterModal()    { _pentClose("monster"); }
function saveMonster()             { _pentSave("monster"); }
function deleteMonster(i)          { _pentDelete("monster", i); }
function setMonsterStatus(i, val)  { _pentStatus("monster", i, val); }
function exportMonsters()          { _pentExport("monster"); }
function importMonsters(input)     { _pentImport("monster", input); }


// ─── NPCs ────────────────────────────────────────────────────
function renderNPCs() {
  var list    = $("npcs-list");
  var countEl = $("npcs-count");
  if (!list) return;
  if (countEl) countEl.textContent = (PARTY_DATA.npcs && PARTY_DATA.npcs.length > 0) ? PARTY_DATA.npcs.length : "";
  if (!PARTY_DATA.npcs || PARTY_DATA.npcs.length === 0) { list.innerHTML = "<div class='party-empty'>📭 Нет персонажей</div>"; return; }
  list.innerHTML = PARTY_DATA.npcs.map(function(n, i) {
    return '<div class="pcard pcard-npc">' +
      '<div class="pcard-icon pcard-icon-npc">🧑</div>' +
      '<div class="pcard-body">' +
        '<div class="pcard-name">' + escapeHtml(n.name) + '</div>' +
        '<div class="pcard-sub">' + escapeHtml(n.role || "Персонаж") + '</div>' +
        (n.desc ? '<div class="pcard-desc">' + escapeHtml(n.desc) + '</div>' : '') +
        '<div class="pcard-status-row"><select class="pcard-status-sel" onchange="setNPCStatus(' + i + ',this.value)" onclick="event.stopPropagation()">' +
        CONDITION_STATUSES.map(function(s) { return '<option value="' + s.value + '"' + (s.value === (n.status||"healthy") ? " selected" : "") + '>' + s.label + '</option>'; }).join("") +
        '</select></div>' +
      '</div>' +
      '<div class="pcard-actions">' +
        '<button class="pcard-edit-btn" onclick="openEditNPCModal(' + i + ')" title="Редактировать">✏️</button>' +
        '<button class="pcard-del-btn"  onclick="deleteNPC(' + i + ')" title="Удалить">✕</button>' +
      '</div>' +
    '</div>';
  }).join("");
}




// ─── MONSTERS ─────────────────────────────────────────────────
function renderMonsters() {
  var list    = $("monsters-list");
  var countEl = $("monsters-count");
  if (!list) return;
  if (countEl) countEl.textContent = PARTY_DATA.monsters.length > 0 ? PARTY_DATA.monsters.length : "";
  if (PARTY_DATA.monsters.length === 0) { list.innerHTML = "<div class='party-empty'>📭 Нет монстров. Добавьте врага!</div>"; return; }
  list.innerHTML = PARTY_DATA.monsters.map(function(m, i) {
    var typeIcon = getMonsterTypeIcon(m.type);
    return '<div class="pcard pcard-monster">' +
      '<div class="pcard-icon pcard-icon-monster">' + typeIcon + '</div>' +
      '<div class="pcard-body">' +
        '<div class="pcard-name">' + escapeHtml(m.name) + '</div>' +
        '<div class="pcard-sub"><span class="pcard-type-badge">' + typeIcon + " " + escapeHtml(m.type || "Монстр") + '</span></div>' +
        (m.desc ? '<div class="pcard-desc">' + escapeHtml(m.desc) + '</div>' : '') +
        '<div class="pcard-status-row"><select class="pcard-status-sel" onchange="setMonsterStatus(' + i + ',this.value)" onclick="event.stopPropagation()">' +
        CONDITION_STATUSES.map(function(s) { return '<option value="' + s.value + '"' + (s.value === (m.status||"healthy") ? " selected" : "") + '>' + s.label + '</option>'; }).join("") +
        '</select></div>' +
      '</div>' +
      '<div class="pcard-actions">' +
        '<button class="pcard-edit-btn" onclick="openEditMonsterModal(' + i + ')" title="Редактировать">✏️</button>' +
        '<button class="pcard-del-btn"  onclick="deleteMonster(' + i + ')" title="Удалить">✕</button>' +
      '</div>' +
    '</div>';
  }).join("");
}




// ─── BATTLE TAB ──────────────────────────────────────────────
var battleSetupList = [];
var battleDragSrcIdx = null;
var battleSectionOpen = { self: true, ally: true, npc: true, monster: true };

function openBattleTab() {
  if (BATTLE_DATA.active) {
    $("battle-setup-screen").classList.add("hidden");
    $("battle-tracker-screen").classList.remove("hidden");
    renderBattleTracker();
  } else {
    $("battle-setup-screen").classList.remove("hidden");
    $("battle-tracker-screen").classList.add("hidden");
    buildBattleSetupList();
    renderBattleSetup();
  }
}

function buildBattleSetupList() {
  var prevChecked = {};
  battleSetupList.forEach(function(p) { prevChecked[p.id] = p.checked; });
  battleSetupList = [];
  var char = getCurrentChar();
  if (char) {
    battleSetupList.push({ id: "self_" + char.id, name: char.name || "Мой персонаж", icon: getClassIcon(char.class), color: "#4da843", type: "self", checked: prevChecked["self_" + char.id] === true });
  }
  PARTY_DATA.allies.forEach(function(a) {
    battleSetupList.push({ id: "ally_" + a.id, name: a.name, icon: getClassIcon(a.cls), color: "#27ae60", type: "ally", checked: prevChecked["ally_" + a.id] === true });
  });
  if (PARTY_DATA.npcs) PARTY_DATA.npcs.forEach(function(n) {
    battleSetupList.push({ id: "npc_" + n.id, name: n.name, icon: "🧑", color: "#d4ac0d", type: "npc", checked: prevChecked["npc_" + n.id] === true });
  });
  PARTY_DATA.monsters.forEach(function(m) {
    battleSetupList.push({ id: "mon_" + m.id, name: m.name, icon: getMonsterIcon(m.type), color: "#c0392b", type: "monster", checked: prevChecked["mon_" + m.id] === true });
  });
}

var battleSearchQuery = "";
function setBattleSearch(val) { battleSearchQuery = val.toLowerCase().trim(); renderBattleSetup(); }
function toggleBattleSection(type) {
  battleSectionOpen[type] = !battleSectionOpen[type];
  renderBattleSetup();
}

function renderBattleSetup() {
  var container = $("battle-setup-list");
  if (!container) return;
  if (battleSetupList.length === 0) {
    container.innerHTML = "<div class='party-empty'>Добавьте участников во вкладке Отряд</div>";
    return;
  }
  var sections = [
    { type: "self",    label: "🟢 Я",          color: "#4da843" },
    { type: "ally",    label: "🟢 Союзники",   color: "#27ae60" },
    { type: "npc",     label: "🟡 Персонажи",  color: "#d4ac0d" },
    { type: "monster", label: "🔴 Враги",      color: "#c0392b" }
  ];
  var q = battleSearchQuery;
  container.innerHTML = sections.map(function(sec) {
    var items = battleSetupList.filter(function(p, i) {
      return p.type === sec.type && (!q || p.name.toLowerCase().includes(q));
    });
    if (items.length === 0) return "";
    var open = battleSectionOpen[sec.type];
    var checkedCount = items.filter(function(p) { return p.checked; }).length;
    var rows = open ? items.map(function(p) {
      var gi = battleSetupList.indexOf(p);
      return '<div class="battle-setup-row' + (p.checked ? " battle-row-checked" : "") + '" id="brow_' + gi + '">' +
        '<label class="battle-check-wrap" onclick="event.stopPropagation()">' +
          '<input type="checkbox" class="battle-checkbox"' + (p.checked ? " checked" : "") + ' onchange="toggleBattleCheck(' + gi + ',this.checked)">' +
        "</label>" +
        '<div class="battle-setup-icon" style="background:' + p.color + '22;color:' + p.color + '">' + p.icon + "</div>" +
        '<div class="battle-setup-name">' + escapeHtml(p.name) + "</div>" +
      "</div>";
    }).join("") : "";
    return '<div class="battle-section">' +
      '<div class="battle-section-title" style="color:' + sec.color + '" onclick="toggleBattleSection(\'' + sec.type + '\')">' +
        '<span class="battle-section-arrow">' + (open ? "▾" : "▸") + "</span>" +
        sec.label + ' <span class="battle-section-count">(' + items.length + (checkedCount > 0 ? ", выбрано: " + checkedCount : "") + ")</span>" +
      "</div>" +
      rows +
    "</div>";
  }).join("");
}

function toggleBattleCheck(i, val) {
  if (battleSetupList[i]) battleSetupList[i].checked = val;
  renderBattleSetup();
}

function battleDragStart(e, i) { battleDragSrcIdx = i; e.dataTransfer.effectAllowed = "move"; }
function battleDragOver(e) { e.preventDefault(); }
function battleDrop(e, i) {
  e.preventDefault();
  if (battleDragSrcIdx === null || battleDragSrcIdx === i) return;
  var moved = battleSetupList.splice(battleDragSrcIdx, 1)[0];
  battleSetupList.splice(i, 0, moved);
  battleDragSrcIdx = null;
  renderBattleSetup();
}
function battleDragEnd() { battleDragSrcIdx = null; }

function startBattle() {
  var selected = battleSetupList.filter(function(p) { return p.checked; });
  if (selected.length === 0) { showToast("Выберите участников боя", "warn"); return; }
  BATTLE_DATA = { active: true, participants: selected.map(function(p) { return Object.assign({}, p, { status: "healthy" }); }), currentTurn: 0 };
  saveBattle();
  $("battle-setup-screen").classList.add("hidden");
  $("battle-tracker-screen").classList.remove("hidden");
  renderBattleTracker();
}

function getParticipantDesc(p) {
  // Look up description from party data by type and id
  if (p.type === "ally") {
    var a = PARTY_DATA.allies.find(function(x) { return x.id === p.id || x.name === p.name; });
    return a ? a.desc : "";
  }
  if (p.type === "npc") {
    var n = PARTY_DATA.npcs && PARTY_DATA.npcs.find(function(x) { return x.id === p.id || x.name === p.name; });
    return n ? (n.desc || n.role || "") : "";
  }
  if (p.type === "monster") {
    var m = PARTY_DATA.monsters.find(function(x) { return x.id === p.id || x.name === p.name; });
    return m ? m.desc : "";
  }
  if (p.type === "self") {
    var char = getCurrentChar();
    return char ? (char.class || "") + (char.subclass ? " · " + char.subclass : "") + " · " + (char.level||1) + " ур." : "";
  }
  return "";
}

function showTrackerInfo(i) {
  var p = BATTLE_DATA.participants[i];
  if (!p) return;
  var desc = getParticipantDesc(p);
  var fcolor = getFactionColor(p.type);
  var modal = $("tracker-info-modal");
  if (!modal) {
    // create on fly
    modal = document.createElement("div");
    modal.id = "tracker-info-modal";
    modal.className = "confirm-modal-overlay";
    modal.innerHTML =
      '<div class="confirm-modal-box tracker-info-box">' +
        '<div class="tracker-info-icon" id="tinfo-icon"></div>' +
        '<div class="tracker-info-name" id="tinfo-name"></div>' +
        '<div class="tracker-info-type" id="tinfo-type"></div>' +
        '<div class="tracker-info-desc" id="tinfo-desc"></div>' +
        '<div class="confirm-modal-btns" style="margin-top:16px">' +
          '<button class="confirm-btn-ok" onclick="$(\'tracker-info-modal\').classList.remove(\'active\')">Закрыть</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function(e) { if (e.target === modal) modal.classList.remove("active"); });
  }
  $("tinfo-icon").textContent = p.icon || "🎭";
  $("tinfo-name").textContent = p.name || "?";
  $("tinfo-type").style.color = fcolor;
  $("tinfo-type").textContent = getFactionLabel(p.type).toUpperCase();
  var descEl = $("tinfo-desc");
  descEl.textContent = desc || "Нет описания.";
  descEl.style.display = desc ? "block" : "none";
  modal.classList.add("active");
}


// Авто-статус для "я" по % ХП
function getSelfStatusFromHP() {
  var char = getCurrentChar();
  if (!char) return "healthy";
  var hp  = char.combat.hpCurrent || 0;
  var max = char.combat.hpMax    || 1;
  if (max <= 0) return "healthy";
  var pct = Math.round(hp / max * 100);
  if (pct <= 0)  return "dead";
  if (pct <= 15) return "dying";
  if (pct <= 35) return "heavy";
  if (pct <= 60) return "wounded";
  return "healthy";
}

function syncSelfBattleStatus() {
  if (!BATTLE_DATA.active) return;
  var newStatus = getSelfStatusFromHP();
  var changed = false;
  BATTLE_DATA.participants.forEach(function(p) {
    if (p.type === "self") { p.status = newStatus; changed = true; }
  });
  if (changed) { saveBattle(); renderBattleTracker(); }
}

function renderBattleTracker() {
  var list = $("battle-tracker-list");
  var turnInfo = $("battle-turn-info");
  if (!list) return;
  // sync self HP status before render
  var selfStatus = getSelfStatusFromHP();
  BATTLE_DATA.participants.forEach(function(p) {
    if (p.type === "self") p.status = selfStatus;
  });
  var current = BATTLE_DATA.participants[BATTLE_DATA.currentTurn];
  if (turnInfo && current) turnInfo.textContent = "Ход " + (BATTLE_DATA.currentTurn + 1) + ": " + (current.name || "?");
  list.innerHTML = BATTLE_DATA.participants.map(function(p, i) {
    var isCurrent = i === BATTLE_DATA.currentTurn;
    var fcolor = getFactionColor(p.type);
    var isSelf  = p.type === "self";
    var desc    = getParticipantDesc(p);
    // For self — status driven by HP, select is read-only display
    var statusLabel = CONDITION_STATUSES.find(function(s) { return s.value === (p.status || "healthy"); });
    var statusText  = statusLabel ? statusLabel.label : "💚 Здоров";
    var opts = CONDITION_STATUSES.map(function(s) {
      return '<option value="' + s.value + '"' + (s.value === (p.status || "healthy") ? " selected" : "") + ">" + s.label + "</option>";
    }).join("");
    return '<div class="tracker-row' + (isCurrent ? " tracker-row-active" : "") + (isSelf ? " tracker-row-self" : "") + '" style="border-left:3px solid ' + fcolor + '">' +
      '<div class="tracker-num" style="color:' + fcolor + '">' + (i + 1) + "</div>" +
      '<div class="tracker-icon" style="background:' + fcolor + '22;color:' + fcolor + '">' + (p.icon || "🎭") + "</div>" +
      '<div class="tracker-name">' +
        '<span class="tracker-name-text">' + escapeHtml(p.name || "?") + '</span>' +
      "</div>" +
      (desc ? '<button class="tracker-info-btn" onclick="showTrackerInfo(' + i + ')" title="Описание">!</button>' : '') +
      (isSelf
        ? '<span class="tracker-self-status">' + statusText + '</span>'
        : '<select class="party-status-sel tracker-status" onchange="setBattleStatus(' + i + ',this.value)">' + opts + "</select>"
      ) +
    "</div>";
  }).join("");
}


function setBattleStatus(i, val) { BATTLE_DATA.participants[i].status = val; saveBattle(); renderBattleTracker(); }
function nextTurn() { BATTLE_DATA.currentTurn = (BATTLE_DATA.currentTurn + 1) % BATTLE_DATA.participants.length; saveBattle(); renderBattleTracker(); }
function prevTurn() { BATTLE_DATA.currentTurn = (BATTLE_DATA.currentTurn - 1 + BATTLE_DATA.participants.length) % BATTLE_DATA.participants.length; saveBattle(); renderBattleTracker(); }
function endBattle() {
  BATTLE_DATA = { active: false, participants: [], currentTurn: 0 };
  saveBattle();
  $("battle-setup-screen").classList.remove("hidden");
  $("battle-tracker-screen").classList.add("hidden");
  buildBattleSetupList();
  renderBattleSetup();
}

// ============================================================
// АККОРДЕОН — сворачиваемые секции
// ============================================================
function toggleAccordion(btn) {
  var body = btn.nextElementSibling;
  if (!body) return;
  var isOpen = btn.getAttribute("aria-expanded") === "true";
  var arrow = btn.querySelector(".accordion-arrow");
  if (isOpen) {
    body.style.display = "none";
    btn.setAttribute("aria-expanded", "false");
    if (arrow) arrow.textContent = "▸";
  } else {
    body.style.display = "";
    btn.setAttribute("aria-expanded", "true");
    if (arrow) arrow.textContent = "▾";
  }
}

// ============================================================
// КЛАССОВЫЕ РЕСУРСЫ — трекер + АСИ
// ============================================================

// Инициализация resources в персонаже если отсутствуют
function initCharResources(char) {
  if (!char.resources) char.resources = {};
}

// Вычислить максимум ресурса по уровню и характеристикам
function getResourceMax(res, char) {
  var level = char.level || 1;
  var raw = res.maxByLevel ? (res.maxByLevel[level] !== undefined ? res.maxByLevel[level] : 0) : 0;
  if (raw === "level")       return level;
  if (raw === "cha")         return Math.max(1, getMod(char.stats.cha));
  if (raw === "cha_plus1")   return Math.max(1, getMod(char.stats.cha) + 1);
  if (raw === "level5")      return level * 5;  // Наложение рук — пул ХП
  if (raw === 99)            return 99; // Безлимит (Ярость 20 ур.)
  return parseInt(raw) || 0;
}

// Получить текущий размер кости ресурса (dieSizeByLevel)
function getResourceDieSize(res, char) {
  if (!res.dieSizeByLevel) return "";
  var level = char.level || 1;
  var die = "";
  var keys = Object.keys(res.dieSizeByLevel).map(Number).sort(function(a,b){return a-b;});
  for (var i = 0; i < keys.length; i++) {
    if (level >= keys[i]) die = res.dieSizeByLevel[keys[i]];
  }
  return die;
}

// Рендер блока ресурсов
function renderClassResources() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);

  var section = $("class-resources-section");
  var grid = $("class-resources-grid");
  if (!section || !grid) return;

  var cls = char.class || "";
  var data = (typeof CLASS_RESOURCES !== "undefined") && CLASS_RESOURCES[cls];

  // Merge subclass resources
  var subclass = char.subclass || "";
  var subData = (typeof SUBCLASS_RESOURCES !== "undefined") && subclass && SUBCLASS_RESOURCES[subclass];
  var allResources = [];
  var allPassive = null;
  if (data && data.resources) allResources = allResources.concat(data.resources);
  if (data && data.passive) allPassive = data.passive;
  if (subData && subData.resources) allResources = allResources.concat(subData.resources);
  if (subData && subData.passive) allPassive = allPassive || subData.passive;

  if (allResources.length === 0 && !allPassive) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  grid.innerHTML = "";

  // Passive subclass spells (domain/oath/patron)
  if (allPassive && allPassive.subclassSpells) {
    var ss = allPassive.subclassSpells;
    var charLevel = char.level || 1;
    var levels = Object.keys(ss.byLevel).map(Number).sort(function(a,b){return a-b;});
    var rows = "";
    levels.forEach(function(lvl) {
      var unlocked = charLevel >= lvl;
      var spells = ss.byLevel[lvl].map(escapeHtml).join(", ");
      rows += '<div class="subclass-spells-row' + (unlocked ? '' : ' locked') + '">' +
        '<span class="subclass-spells-lvl">' + lvl + ' ур.</span>' +
        '<span class="subclass-spells-list">' + spells + '</span>' +
        '</div>';
    });
    var spEl = document.createElement("div");
    spEl.className = "resource-passive-card";
    spEl.innerHTML = '<div class="resource-passive-title">' + (ss.icon || '📖') + ' ' + escapeHtml(ss.label) + '</div>' +
      '<div class="subclass-spells-body">' + rows + '</div>';
    grid.appendChild(spEl);
  }

  // Passive notes card
  if (allPassive && allPassive.notes) {
    var notesEl = document.createElement("div");
    notesEl.className = "resource-passive-card";
    notesEl.innerHTML = '<div class="resource-passive-title">📖 Пассивные умения ' + escapeHtml(cls) + '</div>' +
      '<pre class="resource-passive-text">' + escapeHtml(allPassive.notes) + '</pre>';
    grid.appendChild(notesEl);
  }

  // Resource cards
  allResources.forEach(function(res) {
    var max = getResourceMax(res, char);
    if (max === 0) return; // не доступно на этом уровне

    var used = char.resources[res.id] || 0;
    if (used > max) { used = max; char.resources[res.id] = used; }
    var remaining = max - used;

    var card = document.createElement("div");
    card.className = "resource-card";
    card.style.setProperty("--res-color", res.color || "#c9a227");

    var isPool = res.isPool; // Наложение рук — пул ХП а не заряды

    // Build pips (max 20, beyond that just show number)
    var pipsHtml = "";
    if (!isPool && max <= 20) {
      pipsHtml = '<div class="resource-pips">';
      for (var p = 0; p < max; p++) {
        pipsHtml += '<div class="resource-pip' + (p < remaining ? ' full' : '') + '" onclick="toggleResourcePip(\'' + res.id + '\',' + p + ')"></div>';
      }
      pipsHtml += '</div>';
    }

    var restLabel = res.restoreOn === "short" ? "☕ Кор." : res.restoreOn === "long" || res.restoreOn === "long_once" ? "🛏️ Длин." : res.restoreOn === "turn" ? "🔄 Каждый ход" : "–";

    var dieSize = getResourceDieSize(res, char);
    card.innerHTML =
      '<div class="resource-header">' +
        '<span class="resource-icon">' + res.icon + '</span>' +
        '<span class="resource-name">' + escapeHtml(res.name) + (dieSize ? ' <span class="resource-die-size">(' + escapeHtml(dieSize) + ')</span>' : '') + '</span>' +
        '<span class="resource-restore-badge">' + restLabel + '</span>' +
      '</div>' +
      (isPool
        ? '<div class="resource-pool-row">' +
            '<div class="resource-pool-val" id="res-pool-' + res.id + '">' + (max - used) + ' / ' + max + '</div>' +
            '<div class="resource-pool-btns">' +
              '<button class="res-btn" onclick="spendResource(\'' + res.id + '\',1)">−1</button>' +
              '<button class="res-btn" onclick="spendResource(\'' + res.id + '\',-1)">+1</button>' +
            '</div>' +
          '</div>'
        : '<div class="resource-counter-row">' +
            '<button class="res-btn res-btn-use" onclick="spendResource(\'' + res.id + '\',1)" ' + (remaining <= 0 ? 'disabled' : '') + '>Использовать</button>' +
            '<span class="resource-count" id="res-count-' + res.id + '">' + remaining + ' / ' + (max === 99 ? '∞' : max) + '</span>' +
            '<button class="res-btn res-btn-reset" onclick="resetResource(\'' + res.id + '\')">Сброс</button>' +
          '</div>'
      ) +
      pipsHtml +
      '<div class="resource-desc">' + escapeHtml(res.desc) + '</div>';

    grid.appendChild(card);
  });
}

function spendResource(id, delta) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  var cls = char.class || "";
  var data = CLASS_RESOURCES && CLASS_RESOURCES[cls];
  if (!data) return;
  var res = data.resources.find(function(r) { return r.id === id; });
  if (!res) return;
  var max = getResourceMax(res, char);
  var used = char.resources[id] || 0;
  used = Math.min(max, Math.max(0, used + delta));
  char.resources[id] = used;
  if (navigator.vibrate) navigator.vibrate(8);
  saveToLocal();
  renderClassResources();
}

function resetResource(id) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  char.resources[id] = 0;
  saveToLocal();
  renderClassResources();
}

function toggleResourcePip(id, pipIdx) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  var cls = char.class || "";
  var data = CLASS_RESOURCES && CLASS_RESOURCES[cls];
  if (!data) return;
  var res = data.resources.find(function(r) { return r.id === id; });
  if (!res) return;
  var max = getResourceMax(res, char);
  var used = char.resources[id] || 0;
  var remaining = max - used;
  // pip 0..remaining-1 = full, click to use; remaining..max-1 = empty, click to restore
  if (pipIdx < remaining) {
    used = Math.min(max, used + (remaining - pipIdx));
  } else {
    used = Math.max(0, pipIdx);
  }
  char.resources[id] = used;
  if (navigator.vibrate) navigator.vibrate(8);
  saveToLocal();
  renderClassResources();
}

// Сбросить ресурсы по типу отдыха
function resetResourcesByRest(restType) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  initCharResources(char);
  var cls = char.class || "";
  var allRes = [];
  var data = CLASS_RESOURCES && CLASS_RESOURCES[cls];
  if (data && data.resources) allRes = allRes.concat(data.resources);
  var subclass = char.subclass || "";
  var subData = (typeof SUBCLASS_RESOURCES !== "undefined") && subclass && SUBCLASS_RESOURCES[subclass];
  if (subData && subData.resources) allRes = allRes.concat(subData.resources);
  if (allRes.length === 0) return;
  allRes.forEach(function(res) {
    if (restType === "long") {
      char.resources[res.id] = 0;
    } else if (restType === "short" && (res.restoreOn === "short")) {
      char.resources[res.id] = 0;
    }
  });
  saveToLocal();
  renderClassResources();
}

// ============================================================
// АСИ — модалка выбора характеристик
// ============================================================
var asiSelectedStats = [];
var asiPendingPoints = 0; // сколько осталось распределить

var asiCurrentLevel = null; // уровень для которого применяется АСИ

function openASIModalForLevel(level) {
  asiCurrentLevel = level;
  openASIModal();
}

function openASIModal() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  asiSelectedStats = [];
  asiFeatSelected = null;
  var modal = $("asi-modal");
  if (!modal) { showToast("Ошибка: АСИ модалка не найдена", "error"); return; }

  // Reset radio to plus2
  var r = modal.querySelector('input[value="plus2"]');
  if (r) r.checked = true;

  // Show level info in title if level is set
  var title = modal.querySelector("h4");
  if (title) {
    title.textContent = asiCurrentLevel
      ? "📈 Увеличение характеристик · " + asiCurrentLevel + " ур."
      : "📈 Увеличение характеристик";
  }

  buildASIStatGrid(char);
  updateASIPreview();
  modal.classList.add("active");
}

function closeASIModal() {
  var modal = $("asi-modal");
  if (modal) modal.classList.remove("active");
  asiSelectedStats = [];
  asiFeatSelected = null;
  asiCurrentLevel = null;
}

function buildASIStatGrid(char) {
  var grid = $("asi-stat-grid");
  if (!grid) return;
  var statNames = {str:"Сила",dex:"Ловкость",con:"Телосложение",int:"Интеллект",wis:"Мудрость",cha:"Харизма"};
  var statIcons = {str:"💪",dex:"🏃",con:"❤️",int:"🧠",wis:"👁️",cha:"🎭"};
  grid.innerHTML = Object.keys(statNames).map(function(k) {
    var val = char.stats[k] || 10;
    var mod = getMod(val);
    return '<div class="asi-stat-item" id="asi-stat-' + k + '" onclick="toggleASIStat(\'' + k + '\')">' +
      '<span class="asi-stat-icon">' + statIcons[k] + '</span>' +
      '<span class="asi-stat-name">' + statNames[k] + '</span>' +
      '<span class="asi-stat-cur">' + val + ' (' + formatMod(mod) + ')</span>' +
      '<span class="asi-stat-delta" id="asi-delta-' + k + '"></span>' +
    '</div>';
  }).join("");
}

function getASIMode() {
  var r = document.querySelector('input[name="asi-mode"]:checked');
  return r ? r.value : "plus2";
}

function toggleASIStat(statKey) {
  var mode = getASIMode();
  var maxPicks = mode === "plus2" ? 1 : 2;

  var idx = asiSelectedStats.indexOf(statKey);
  if (idx > -1) {
    asiSelectedStats.splice(idx, 1);
  } else {
    if (asiSelectedStats.length >= maxPicks) {
      asiSelectedStats.shift(); // remove oldest
    }
    asiSelectedStats.push(statKey);
  }
  updateASIPreview();
}

function updateASIPreview() {
  var mode = getASIMode();
  var preview = $("asi-preview");
  var applyBtn = $("asi-apply-btn");
  var statGrid = $("asi-stat-grid");
  var featListEl = $("asi-feat-list");

  // ── Режим: выбор черты ───────────────────────────────────
  if (mode === "feat") {
    if (statGrid) statGrid.style.display = "none";
    if (featListEl) { featListEl.style.display = "block"; buildFeatList(); }
    if (preview) {
      if (asiFeatSelected) {
        var feat = typeof FEATS_DATA !== "undefined" && FEATS_DATA.find(function(f) { return f.id === asiFeatSelected; });
        preview.textContent = "✅ Черта: " + (feat ? feat.name : asiFeatSelected);
        preview.className = "asi-preview ready";
      } else {
        preview.textContent = "Выберите черту из списка";
        preview.className = "asi-preview";
      }
    }
    if (applyBtn) applyBtn.disabled = !asiFeatSelected;
    return;
  }

  // ── Режим: характеристики ────────────────────────────────
  if (statGrid) statGrid.style.display = "";
  if (featListEl) featListEl.style.display = "none";
  asiFeatSelected = null;

  var maxPicks = mode === "plus2" ? 1 : 2;
  var bonus = mode === "plus2" ? 2 : 1;

  if (statGrid) {
    statGrid.querySelectorAll(".asi-stat-item").forEach(function(el) {
      el.classList.remove("selected");
      var deltaEl = $("asi-delta-" + el.id.replace("asi-stat-",""));
      if (deltaEl) deltaEl.textContent = "";
    });
    asiSelectedStats.forEach(function(k) {
      var el = $("asi-stat-" + k);
      if (el) el.classList.add("selected");
      var deltaEl = $("asi-delta-" + k);
      if (deltaEl) deltaEl.textContent = "+" + bonus;
    });
  }

  if (preview) {
    if (asiSelectedStats.length === 0) {
      preview.textContent = "Выберите характеристику";
      preview.className = "asi-preview";
    } else if (asiSelectedStats.length < maxPicks && mode === "plus1each") {
      preview.textContent = "Выберите ещё одну характеристику";
      preview.className = "asi-preview";
    } else {
      var char = getCurrentChar();
      var abbr = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
      preview.textContent = "✅ " + asiSelectedStats.map(function(k) {
        return abbr[k] + ": " + char.stats[k] + " → " + (char.stats[k] + bonus);
      }).join("   ");
      preview.className = "asi-preview ready";
    }
  }

  var ready = (mode === "plus2" && asiSelectedStats.length === 1) ||
              (mode === "plus1each" && asiSelectedStats.length === 2);
  if (applyBtn) applyBtn.disabled = !ready;
}

// applyASI определена ниже (обрабатывает и стат-режим и черты)

// showHPToast already supports customMsg (patched in place above)

// ============================================================
// ВЕРСИЯ ПРИЛОЖЕНИЯ
// ============================================================
(function() {
  var el = $("app-version-badge");
  if (el && typeof APP_VERSION !== "undefined") {
    el.textContent = "v" + APP_VERSION + " (" + APP_VERSION_DATE + ")";
  }
})();

// ============================================================
// ЖУРНАЛ ПЕРСОНАЖА — история изменений
// ============================================================

function getJournal(char) {
  if (!char.journal) char.journal = [];
  return char.journal;
}

function addJournalEntry(type, text, details) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var journal = getJournal(char);
  var now = new Date();
  var dateStr = now.toLocaleDateString("ru-RU", { day:"numeric", month:"short", year:"numeric" });
  var timeStr = now.toLocaleTimeString("ru-RU", { hour:"2-digit", minute:"2-digit" });
  journal.unshift({
    id: Date.now(),
    type: type,        // levelup | rest | stat | feat | note | combat | story | loot | death
    text: text,
    details: details || "",
    date: dateStr,
    time: timeStr,
    level: char.level || 1
  });
  if (journal.length > 200) journal.pop();
  saveToLocal();
}

var journalFilter = "all";
function filterJournal(type, btn) {
  journalFilter = type;
  document.querySelectorAll(".jfilter-btn").forEach(function(b) { b.classList.remove("active"); });
  if (btn) btn.classList.add("active");
  renderJournal();
}

function renderJournal() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var list = $("journal-list");
  if (!list) return;
  var journal = getJournal(char);
  var filtered = journalFilter === "all" ? journal : journal.filter(function(e) { return e.type === journalFilter; });

  if (filtered.length === 0) {
    list.innerHTML = '<div class="journal-empty">📭 Нет записей' + (journalFilter !== "all" ? " в этой категории" : "") + '</div>';
    return;
  }

  var typeIcons = { levelup:"📈", rest:"🛏️", stat:"⚡", feat:"🎯", note:"📝", combat:"⚔️", story:"📖", loot:"💎", death:"💀" };
  var typeColors = { levelup:"#4da843", rest:"#5b9bd5", stat:"#d4a843", feat:"#9b59b6", note:"#9a9ab0", combat:"#e74c3c", story:"#d4ac0d", loot:"#f39c12", death:"#7f8c8d" };

  list.innerHTML = filtered.map(function(entry) {
    var icon = typeIcons[entry.type] || "📝";
    var color = typeColors[entry.type] || "#9a9ab0";
    return '<div class="journal-entry" style="border-left-color:' + color + '">' +
      '<div class="journal-entry-header">' +
        '<span class="journal-icon">' + icon + '</span>' +
        '<span class="journal-text">' + escapeHtml(entry.text) + '</span>' +
        '<button class="journal-del-btn" onclick="deleteJournalEntry(' + entry.id + ')">✕</button>' +
      '</div>' +
      (entry.details ? '<div class="journal-details">' + escapeHtml(entry.details) + '</div>' : '') +
      '<div class="journal-meta">' + escapeHtml(entry.date) + ' ' + escapeHtml(entry.time) + ' · ' + (entry.level || 1) + ' ур.</div>' +
    '</div>';
  }).join("");
}

function deleteJournalEntry(id) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !char.journal) return;
  char.journal = char.journal.filter(function(e) { return e.id !== id; });
  saveToLocal();
  renderJournal();
}

function openAddJournalEntry() {
  $("add-journal-modal")?.classList.add("active");
  $("journal-entry-text").value = "";
}
function closeAddJournalEntry() {
  $("add-journal-modal")?.classList.remove("active");
}
function saveJournalEntry() {
  var type = $("journal-entry-type")?.value || "note";
  var text = $("journal-entry-text")?.value.trim() || "";
  if (!text) { showToast("Введите описание события", "warn"); return; }
  var typeNames = { note:"Заметка", combat:"Бой", story:"Сюжет", loot:"Добыча", death:"Смерть" };
  addJournalEntry(type, typeNames[type] + ": " + text);
  closeAddJournalEntry();
  renderJournal();
}

// ============================================================
// ПРИХВОСТНИ / КОМПАНЬОНЫ
// ============================================================
var COMPANION_TYPE_ICONS = {
  familiar:"🦅", mount:"🐴", summoned:"✨", beast:"🐺", construct:"🤖", other:"🐾"
};
var COMPANION_TYPE_NAMES = {
  familiar:"Фамильяр", mount:"Скакун", summoned:"Призванный", beast:"Зверь", construct:"Конструкт", other:"Прочее"
};

function getCompanions(char) {
  if (!char.companions) char.companions = [];
  return char.companions;
}

function renderCompanions() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var companions = getCompanions(char);

  // Update counts
  var countEl = $("companions-count");
  if (countEl) countEl.textContent = companions.length > 0 ? companions.length : "";

  // Render in both sheet and world tab
  ["companions-list-sheet", "companions-list-world"].forEach(function(elId) {
    var list = $(elId);
    if (!list) return;
    if (companions.length === 0) {
      list.innerHTML = '<div class="party-empty">📭 Нет прихвостней</div>';
      return;
    }
    list.innerHTML = companions.map(function(c, i) {
      var icon = COMPANION_TYPE_ICONS[c.type] || "🐾";
      var hpPct = c.hpMax > 0 ? Math.round((c.hpCurrent / c.hpMax) * 100) : 100;
      var hpColor = hpPct > 60 ? "#4da843" : hpPct > 30 ? "#e67e22" : "#e74c3c";
      return '<div class="pcard pcard-companion">' +
        '<div class="pcard-icon" style="background:rgba(155,89,182,0.15);color:#9b59b6">' + icon + '</div>' +
        '<div class="pcard-body">' +
          '<div class="pcard-name">' + escapeHtml(c.name) + '</div>' +
          '<div class="pcard-sub">' + escapeHtml(COMPANION_TYPE_NAMES[c.type] || c.type) + ' · КД ' + (c.ac || 10) + '</div>' +
          (c.attack ? '<div class="pcard-desc">⚔️ ' + escapeHtml(c.attack) + '</div>' : '') +
          '<div class="companion-hp-row">' +
            '<span style="color:' + hpColor + ';font-size:0.8em;font-weight:700;">❤️ ' + c.hpCurrent + '/' + c.hpMax + '</span>' +
            '<button class="res-btn" style="padding:2px 8px;font-size:0.72em" onclick="companionHP(' + i + ',-1)">-1</button>' +
            '<button class="res-btn" style="padding:2px 8px;font-size:0.72em" onclick="companionHP(' + i + ',1)">+1</button>' +
          '</div>' +
        '</div>' +
        '<div class="pcard-actions">' +
          '<button class="pcard-edit-btn" onclick="openEditCompanionModal(' + i + ')">✏️</button>' +
          '<button class="pcard-del-btn" onclick="deleteCompanion(' + i + ')">✕</button>' +
        '</div>' +
      '</div>';
    }).join("");
  });
}

function companionHP(i, delta) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var companions = getCompanions(char);
  if (!companions[i]) return;
  companions[i].hpCurrent = Math.max(0, Math.min(companions[i].hpMax, (companions[i].hpCurrent || 0) + delta));
  if (navigator.vibrate) navigator.vibrate(8);
  saveToLocal();
  renderCompanions();
}

function openAddCompanionModal() {
  $("companion-modal-title").textContent = "🐾 Добавить прихвостня";
  $("companion-edit-index").value = "-1";
  $("companion-name-inp").value = "";
  $("companion-type-sel").value = "familiar";
  $("companion-hp-inp").value = "10";
  $("companion-ac-inp").value = "10";
  $("companion-attack-inp").value = "";
  $("companion-desc-inp").value = "";
  $("add-companion-modal")?.classList.add("active");
}
function openEditCompanionModal(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var c = getCompanions(char)[i];
  if (!c) return;
  $("companion-modal-title").textContent = "✏️ Редактировать прихвостня";
  $("companion-edit-index").value = i;
  $("companion-name-inp").value = c.name || "";
  $("companion-type-sel").value = c.type || "other";
  $("companion-hp-inp").value = c.hpMax || 10;
  $("companion-ac-inp").value = c.ac || 10;
  $("companion-attack-inp").value = c.attack || "";
  $("companion-desc-inp").value = c.desc || "";
  $("add-companion-modal")?.classList.add("active");
}
function closeAddCompanionModal() {
  $("add-companion-modal")?.classList.remove("active");
}
function saveCompanion() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var name = $("companion-name-inp")?.value.trim() || "";
  if (!name) { showToast("Введите имя", "warn"); return; }
  var idx = parseInt($("companion-edit-index").value);
  var companions = getCompanions(char);
  var hpMax = parseInt($("companion-hp-inp")?.value) || 10;
  var data = {
    id: idx >= 0 ? (companions[idx].id || Date.now()) : Date.now(),
    name: name,
    type: $("companion-type-sel")?.value || "other",
    hpMax: hpMax,
    hpCurrent: idx >= 0 ? companions[idx].hpCurrent : hpMax,
    ac: parseInt($("companion-ac-inp")?.value) || 10,
    attack: $("companion-attack-inp")?.value.trim() || "",
    desc: $("companion-desc-inp")?.value.trim() || "",
    status: "healthy"
  };
  if (idx >= 0) companions[idx] = data; else companions.push(data);
  saveToLocal();
  renderCompanions();
  closeAddCompanionModal();
}
function deleteCompanion(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var name = char.companions[i] ? char.companions[i].name : "прихвостня";
  showConfirmModal("Удалить прихвостня?", "«" + name + "» будет удалён.", function() {
    char.companions.splice(i, 1);
    saveToLocal();
    renderCompanions();
  });
}

// asiFeatSelected и feat-режим обрабатываются в updateASIPreview ниже
var asiFeatSelected = null;

function buildFeatList() {
  var el = $("asi-feat-list");
  if (!el || typeof FEATS_DATA === "undefined") return;
  if (!currentId) return;
  var char = getCurrentChar();
  var takenFeats = char ? (char.feats || []) : [];

  el.innerHTML = '<div class="feat-search-wrap"><input type="text" class="feat-search-inp" placeholder="🔍 Поиск черты..." oninput="filterFeatList(this.value)"></div>' +
    '<div class="feat-list" id="feat-list-items">' +
    FEATS_DATA.map(function(feat) {
      var taken = takenFeats.some(function(f) { return f.id === feat.id; });
      var selected = asiFeatSelected === feat.id;
      return '<div class="feat-item' + (selected ? " selected" : "") + (taken ? " taken" : "") + '" onclick="selectFeat(\'' + feat.id + '\')" data-name="' + escapeHtml(feat.name.toLowerCase()) + '">' +
        '<div class="feat-item-header">' +
          '<span class="feat-item-name">' + escapeHtml(feat.name) + '</span>' +
          (feat.prereq ? '<span class="feat-prereq">' + escapeHtml(feat.prereq) + '</span>' : '') +
          (taken ? '<span class="feat-taken-badge">Уже взята</span>' : '') +
        '</div>' +
        '<div class="feat-item-desc">' + escapeHtml(feat.desc) + '</div>' +
      '</div>';
    }).join("") +
    '</div>';
}

function filterFeatList(query) {
  var q = query.toLowerCase();
  document.querySelectorAll("#feat-list-items .feat-item").forEach(function(el) {
    var name = el.dataset.name || "";
    el.style.display = name.includes(q) ? "" : "none";
  });
}

function selectFeat(id) {
  asiFeatSelected = asiFeatSelected === id ? null : id;
  buildFeatList();
  var preview = $("asi-preview");
  var applyBtn = $("asi-apply-btn");
  if (asiFeatSelected) {
    var feat = FEATS_DATA.find(function(f) { return f.id === asiFeatSelected; });
    if (preview) { preview.textContent = "✅ Черта: " + feat.name; preview.className = "asi-preview ready"; }
    if (applyBtn) applyBtn.disabled = false;
  } else {
    if (preview) { preview.textContent = "Выберите черту"; preview.className = "asi-preview"; }
    if (applyBtn) applyBtn.disabled = true;
  }
}

function applyASI() {
  var mode = getASIMode();
  if (mode !== "feat") {
    // stat mode
    if (!currentId || asiSelectedStats.length === 0) return;
    var char = getCurrentChar();
    if (!char) return;
    var bonus = mode === "plus2" ? 2 : 1;
    var statNames2 = {str:"Сила",dex:"Ловкость",con:"Телосложение",int:"Интеллект",wis:"Мудрость",cha:"Харизма"};
    asiSelectedStats.forEach(function(k) {
      char.stats[k] = Math.min(20, (char.stats[k] || 10) + bonus);
      safeSet("val-" + k, char.stats[k]);
      updateStatDisplay(k);
    });
    var msg = "📈 АСИ (ур." + (asiCurrentLevel||"?") + "): " + asiSelectedStats.map(function(k) { return statNames2[k] + " +" + bonus; }).join(", ");
    // Mark ASI level as used
    if (asiCurrentLevel) {
      if (!char.asiUsedLevels) char.asiUsedLevels = [];
      if (!char.asiUsedLevels.includes(asiCurrentLevel)) char.asiUsedLevels.push(asiCurrentLevel);
    }
    asiCurrentLevel = null;
    addJournalEntry("stat", msg);
    saveToLocal(); calcStats(); recalculateHP(); calculateAC();
    closeASIModal();
    updateClassFeatures();
    showHPToast(0, msg);
    renderJournal();
    return;
  }

  if (!asiFeatSelected || !currentId) return;
  var char = getCurrentChar();
  if (!char) return;

  var feat = FEATS_DATA.find(function(f) { return f.id === asiFeatSelected; });
  if (!feat) return;

  if (!char.feats) char.feats = [];

  // Apply effects
  var statNames = {str:"Сила",dex:"Ловкость",con:"Телосложение",int:"Интеллект",wis:"Мудрость",cha:"Харизма"};
  var appliedDesc = [];

  (feat.effects || []).forEach(function(eff) {
    if (eff.type === "stat") {
      char.stats[eff.key] = Math.min(20, (char.stats[eff.key] || 10) + eff.value);
      safeSet("val-" + eff.key, char.stats[eff.key]);
      updateStatDisplay(eff.key);
      appliedDesc.push("+" + eff.value + " " + statNames[eff.key]);
    }
    else if (eff.type === "stat_choice" || eff.type === "stat_choice_save") {
      // Pick first available stat that isn't at 20
      var picked = eff.keys.find(function(k) { return (char.stats[k] || 10) < 20; });
      if (picked) {
        char.stats[picked] = Math.min(20, (char.stats[picked] || 10) + eff.value);
        safeSet("val-" + picked, char.stats[picked]);
        updateStatDisplay(picked);
        appliedDesc.push("+" + eff.value + " " + statNames[picked]);
        if (eff.type === "stat_choice_save") {
          if (!char.saves) char.saves = {};
          char.saves[picked] = true;
          safeSetChecked("save-prof-" + picked, true);
        }
      }
    }
    else if (eff.type === "armor") {
      if (!char.proficiencies.armor) char.proficiencies.armor = [];
      if (!char.proficiencies.armor.includes(eff.value)) {
        char.proficiencies.armor.push(eff.value);
        safeSetChecked("armor-" + eff.value, true);
        appliedDesc.push("Владение: " + eff.value);
      }
    }
    else if (eff.type === "hp_per_level") {
      // Крепкий — +2 ХП за уровень ретроактивно
      var bonus = eff.value * (char.level || 1);
      char.combat.hpMax = (char.combat.hpMax || 10) + bonus;
      char.combat.hpCurrent = Math.min(char.combat.hpCurrent + bonus, char.combat.hpMax);
      appliedDesc.push("+" + bonus + " ХП (×" + (char.level||1) + " ур.)");
    }
    else if (eff.type === "initiative_bonus") {
      if (!char.bonuses) char.bonuses = {};
      char.bonuses.initiative = (char.bonuses.initiative || 0) + eff.value;
      appliedDesc.push("+" + eff.value + " к Инициативе");
    }
  });

  // Record feat
  var isRaceFeat = (asiCurrentLevel === "race");
  var featRecord = { id: feat.id, name: feat.name, level: char.level };
  if (isRaceFeat) {
    featRecord.racial = true;
    featRecord.level = "раса";
    if (!Array.isArray(char.raceFeats)) char.raceFeats = [];
    char.raceFeats.push({ id: feat.id, name: feat.name });
  }
  char.feats.push(featRecord);

  saveToLocal();
  calcStats();
  recalculateHP();
  calculateAC();
  updateHPDisplay();

  // Journal entry
  addJournalEntry("feat", "Черта: " + feat.name, appliedDesc.length > 0 ? "Применено: " + appliedDesc.join(", ") : feat.desc.slice(0, 80));

  // Mark ASI level as used BEFORE closeASIModal (which resets asiCurrentLevel)
  // Расовые черты НЕ занимают слот ASI
  if (asiCurrentLevel && !isRaceFeat) {
    if (!char.asiUsedLevels) char.asiUsedLevels = [];
    if (!char.asiUsedLevels.includes(asiCurrentLevel)) char.asiUsedLevels.push(asiCurrentLevel);
  }
  asiCurrentLevel = null;
  closeASIModal();
  asiFeatSelected = null;
  showHPToast(0, "🎯 Черта «" + feat.name + "» получена!" + (appliedDesc.length ? " " + appliedDesc.join(", ") : ""));
  renderJournal();
  renderTakenFeats();
  renderRaceExtras();
  updateClassFeatures();
}


// ============================================================
// ЭКРАН ПРОФИЛЕЙ — вкладки и чейнджлог
// ============================================================
function switchProfilesTab(tab, btn) {
  document.querySelectorAll(".ptab-btn").forEach(function(b) { b.classList.remove("active"); });
  document.querySelectorAll(".ptab-content").forEach(function(c) { c.style.display = "none"; });
  if (btn) btn.classList.add("active");
  var el = $("ptab-" + tab);
  if (el) el.style.display = "";
  if (tab === "changelog") renderChangelog();
}

function renderChangelog() {
  var list = $("changelog-list");
  if (!list || typeof APP_CHANGELOG === "undefined") return;

  var typeIcon  = { feat:"✨", fix:"🐛", improve:"⚡" };
  var typeLabel = { feat:"Новое", fix:"Исправлено", improve:"Улучшено" };
  var typeColor = { feat:"#4da843", fix:"#e74c3c", improve:"#5b9bd5" };
  var badgeHtml = { new:'<span class="cl-badge cl-badge-new">НОВОЕ</span>' };

  list.innerHTML = APP_CHANGELOG.map(function(ver, idx) {
    var items = ver.changes.map(function(c) {
      var icon  = typeIcon[c.type]  || "•";
      var color = typeColor[c.type] || "#9a9ab0";
      return '<div class="cl-item"><span class="cl-item-icon" style="color:' + color + '">' + icon + '</span><span class="cl-item-text">' + escapeHtml(c.text) + '</span></div>';
    }).join("");

    var isLatest = idx === 0;
    return '<div class="cl-version' + (isLatest ? " cl-version-latest" : "") + '">' +
      '<div class="cl-version-header">' +
        '<span class="cl-version-num">v' + escapeHtml(ver.version) + '</span>' +
        (isLatest ? '<span class="cl-badge cl-badge-new">Текущая</span>' : '') +
        '<span class="cl-version-date">' + escapeHtml(ver.date) + '</span>' +
      '</div>' +
      '<div class="cl-items">' + items + '</div>' +
    '</div>';
  }).join("");
}

// Рендерим при старте
(function() {
  var versionBadge = $("app-version-badge");
  if (versionBadge && typeof APP_VERSION !== "undefined") {
    versionBadge.textContent = "v" + APP_VERSION;
  }
  renderChangelog();
})();

// ============================================================
// ОТОБРАЖЕНИЕ ВЗЯТЫХ ЧЕРТ
// ============================================================
function renderTakenFeats() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;

  var section = $("taken-feats-section");
  var list    = $("taken-feats-list");
  var count   = $("taken-feats-count");
  if (!section || !list) return;

  var feats = char.feats || [];
  if (feats.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  if (count) count.textContent = feats.length;

  list.innerHTML = feats.map(function(f, i) {
    // Find feat data for description
    var data = typeof FEATS_DATA !== "undefined"
      ? FEATS_DATA.find(function(d) { return d.id === f.id; })
      : null;
    var desc = data ? data.desc : "";
    var lvlBadge = f.level ? '<span class="feat-taken-lvl">ур. ' + f.level + '</span>' : "";
    return '<div class="feat-taken-card">' +
      '<div class="feat-taken-row">' +
        '<span class="feat-taken-icon">🎯</span>' +
        '<span class="feat-taken-name">' + escapeHtml(f.name || f.id) + '</span>' +
        lvlBadge +
        '<button class="feat-taken-del" onclick="removeFeat(' + i + ')" title="Убрать черту">✕</button>' +
      '</div>' +
      (desc ? '<div class="feat-taken-desc">' + escapeHtml(desc) + '</div>' : '') +
    '</div>';
  }).join("");
}

function removeFeat(i) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char || !char.feats) return;
  var name = char.feats[i] ? char.feats[i].name : "черту";
  showConfirmModal("Убрать черту?",
    "«" + name + "» будет удалена из списка. Бонусы к характеристикам НЕ откатятся.",
    function() {
      char.feats.splice(i, 1);
      saveToLocal();
      renderTakenFeats();
    }
  );
}

// ── Item Reference Modal ──
function openItemRef(tab) {
  var modal = $("item-ref-modal");
  if (modal) modal.classList.add("active");
  switchItemRef(tab || 'weight', null);
}
function closeItemRef() {
  var modal = $("item-ref-modal");
  if (modal) modal.classList.remove("active");
}
function switchItemRef(tab, btnEl) {
  [$("item-ref-weight"), $("item-ref-slots")].forEach(function(el) {
    if (el) el.classList.add("hidden");
  });
  document.querySelectorAll(".item-ref-tab").forEach(function(b) { b.classList.remove("active"); });
  var section = $("item-ref-" + tab);
  if (section) section.classList.remove("hidden");
  if (btnEl) btnEl.classList.add("active");
  else {
    var btn = document.querySelector(".item-ref-tab[onclick*=\"'" + tab + "'\"]");
    if (btn) btn.classList.add("active");
  }
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
