// ============================================================
// app-party.js — Система группы и трекер боя: союзники,
// NPC, монстры, инициатива, раунды
// ============================================================

// ============================================================
// ⚔️ ОТРЯД — Соратники, NPC, Монстры
// ============================================================

var PARTY_DATA = { allies: [], monsters: [], npcs: [] };
var BATTLE_DATA = { active: false, participants: [], currentTurn: 0, round: 1 };

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
  } catch(e) { window.__catchLog && window.__catchLog('party:load', e); }
  try {
    var savedBattle = localStorage.getItem("dnd_battle");
    if (savedBattle) BATTLE_DATA = JSON.parse(savedBattle);
    // CAST-2: сохранения до появления счётчика раундов
    if (BATTLE_DATA.round == null) BATTLE_DATA.round = 1;
  } catch(e) { window.__catchLog && window.__catchLog('party:loadBattle', e); }
})();

function saveParty() {
  if (!currentId) { try { localStorage.setItem("dnd_party", JSON.stringify(PARTY_DATA)); } catch(e) { window.__catchLog && window.__catchLog('party:saveNoChar', e); } return; }
  var char = getCurrentChar();
  if (char) { char.party = PARTY_DATA; saveToLocal(); }
}
function saveBattle() {
  if (!currentId) { try { localStorage.setItem("dnd_battle", JSON.stringify(BATTLE_DATA)); } catch(e) { window.__catchLog && window.__catchLog('party:saveBattleNoChar', e); } return; }
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
  // FEAT-4 расширение: NPC получает location/attitude
  npc:     { modal:"add-npc-modal",     title:"npc-modal-title",     idx:"npc-edit-index",
             fields: [
               {id:"npc-name-inp",     key:"name"},
               {id:"npc-role-inp",     key:"role",     default:"Персонаж"},
               {id:"npc-location-inp", key:"location"},
               {id:"npc-attitude-sel", key:"attitude", default:"нейтральный"},
               {id:"npc-desc-inp",     key:"desc"}
             ],
             list: function() { if (!PARTY_DATA.npcs) PARTY_DATA.npcs = []; return PARTY_DATA.npcs; },
             render: function() { renderNPCs(); },
             addLabel:"🧑 Добавить персонажа", editLabel:"✏️ Редактировать персонажа",
             delMsg: "Удалить персонажа?", delKey:"name" },
  // FEAT-4 расширение: монстр получает cr/ac/hp/tactics/edition
  monster: { modal:"add-monster-modal", title:"monster-modal-title", idx:"monster-edit-index",
             fields: [
               {id:"monster-name-inp",    key:"name"},
               {id:"monster-type-sel",    key:"type", default:"Монстр"},
               {id:"monster-cr-inp",      key:"cr"},
               {id:"monster-ac-inp",      key:"ac"},
               {id:"monster-hp-inp",      key:"hp"},
               {id:"monster-edition-sel", key:"edition"},
               {id:"monster-tactics-inp", key:"tactics"},
               {id:"monster-desc-inp",    key:"desc"}
             ],
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
  var idx = parseInt($(cfg.idx).value, 10);
  var existing = (idx >= 0 && idx < list.length) ? list[idx] : null;
  var data = { id: existing ? (existing.id || Date.now()) : Date.now(), status: existing ? (existing.status || "healthy") : "healthy" };
  // FEAT-4: сохранить расширенные «скрытые» поля при редактировании (icon/srdSlug/xp/...) — _PENT.fields их не охватывает
  if (existing) {
    ['xp','size','hpMax','hpDice','speed','srdSlug','icon'].forEach(function(k) {
      if (existing[k] !== undefined) data[k] = existing[k];
    });
  }
  cfg.fields.forEach(function(f) {
    var v = ($(f.id).value || "").trim();
    if (!v && f.default) v = f.default;
    if (v) data[f.key] = v;
  });
  if (!data.name) data.name = name;
  if (idx >= 0) list[idx] = data; else list.push(data);
  if (window.AppLog) AppLog.action("party", ({ ally: "союзник", npc: "NPC", monster: "монстр" }[type] || type) + (idx >= 0 ? " изменён: " : " добавлен: ") + data.name);
  saveParty(); cfg.render(); _pentClose(type);
}
function _pentDelete(type, i) {
  var cfg = _PENT[type];
  var name = cfg.list()[i] ? cfg.list()[i][cfg.delKey] : "запись";
  showConfirmModal(cfg.delMsg, "«"+name+"» будет удалён.", function() {
    cfg.list().splice(i,1);
    if (window.AppLog) AppLog.action("party", "удалён " + type + ": " + name);
    saveParty(); cfg.render();
  });
}
function _pentStatus(type, i, val) {
  _PENT[type].list()[i].status = val;
  if (window.AppLog) AppLog.action("party", "статус " + (_PENT[type].list()[i].name || type) + " → " + val);
  saveParty();
}
function _pentExport(type) {
  if (window.AppLog) AppLog.action("party", "экспорт " + type + " (" + _PENT[type].list().length + ")");
  var a = document.createElement("a");
  a.href = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_PENT[type].list(), null, 2));
  a.download = type + "_" + new Date().toISOString().slice(0,10) + ".json"; a.click();
}
// BUGFIX-3: валидация party-импорта (имя обязательно, размер файла лимитирован)
function _isValidPentry(e) {
  return e && typeof e === 'object' && typeof e.name === 'string' && e.name.length > 0;
}
function _pentImport(type, input) {
  var file = input.files[0]; if (!file) return;
  var MAX = (typeof IMPORT_MAX_BYTES !== 'undefined') ? IMPORT_MAX_BYTES : 10 * 1024 * 1024;
  if (file.size > MAX) {
    showToast("Файл слишком большой (макс. " + Math.round(MAX/1024/1024) + " МБ)", "error");
    input.value = "";
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var d;
    try { d = JSON.parse(e.target.result); }
    catch(err) { showToast("Файл повреждён или это не JSON", "error"); input.value = ""; return; }
    if (!Array.isArray(d)) { showToast("Неверный формат: ожидался массив", "error"); input.value = ""; return; }
    var valid = d.filter(_isValidPentry);
    var skipped = d.length - valid.length;
    if (valid.length === 0) { showToast("В файле нет валидных записей", "error"); input.value = ""; return; }
    PARTY_DATA[type === "ally" ? "allies" : type+"s"] = valid;
    if (window.AppLog) AppLog.action("party", "импорт " + type + ": " + valid.length + (skipped > 0 ? " (пропущено " + skipped + ")" : ""));
    saveParty();
    _PENT[type].render();
    showToast("Загружено: " + valid.length + (skipped > 0 ? " (пропущено " + skipped + ")" : ""), "success");
  };
  reader.onerror = function() { showToast("Ошибка чтения файла", "error"); input.value = ""; };
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
// Цвет бейджа отношения для NPC
function _npcAttColor(att) {
  if (att === "дружелюбный") return "#27ae60";
  if (att === "враждебный")  return "#c0392b";
  if (att === "неизв.")      return "#7f8c8d";
  return "#d4ac0d"; // нейтральный по умолчанию
}
function renderNPCs() {
  var list    = $("npcs-list");
  var countEl = $("npcs-count");
  if (!list) return;
  if (countEl) countEl.textContent = (PARTY_DATA.npcs && PARTY_DATA.npcs.length > 0) ? PARTY_DATA.npcs.length : "";
  if (!PARTY_DATA.npcs || PARTY_DATA.npcs.length === 0) { list.innerHTML = "<div class='party-empty'>📭 Нет персонажей</div>"; return; }
  list.innerHTML = PARTY_DATA.npcs.map(function(n, i) {
    // FEAT-4: бэйджи локации и отношения
    var subBadges = "";
    var att = n.attitude || "";
    if (n.location || att) {
      var attC = _npcAttColor(att);
      var parts = [];
      if (n.location) parts.push('<span class="pcard-npc-badge">📍 ' + escapeHtml(n.location) + '</span>');
      if (att) parts.push('<span class="pcard-npc-badge" style="color:' + attC + ';border-color:' + attC + '55">' + escapeHtml(att) + '</span>');
      subBadges = '<div class="pcard-npc-badges">' + parts.join("") + '</div>';
    }
    var icon = n.icon || "🧑";
    return '<div class="pcard pcard-npc">' +
      '<div class="pcard-icon pcard-icon-npc">' + icon + '</div>' +
      '<div class="pcard-body">' +
        '<div class="pcard-name">' + escapeHtml(n.name) + '</div>' +
        '<div class="pcard-sub">' + escapeHtml(n.role || "Персонаж") + '</div>' +
        subBadges +
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
    // FEAT-4: бэйджи SRD-карточки (CR / КД / ХП / редакция), показываем только заполненные
    var srdBadges = "";
    var parts = [];
    if (m.cr)      parts.push('<span class="pcard-srd-badge">CR ' + escapeHtml(String(m.cr)) + '</span>');
    if (m.ac)      parts.push('<span class="pcard-srd-badge">🛡️ ' + escapeHtml(String(m.ac)) + '</span>');
    if (m.hp)      parts.push('<span class="pcard-srd-badge">❤️ ' + escapeHtml(String(m.hp)) + '</span>');
    if (m.edition) parts.push('<span class="pcard-srd-badge pcard-srd-badge-ed">' + escapeHtml(String(m.edition)) + '</span>');
    if (parts.length) srdBadges = '<div class="pcard-srd-badges">' + parts.join("") + '</div>';
    // FEAT-4: тактика отдельным блоком (если есть)
    var tacticsBlock = "";
    if (m.tactics) tacticsBlock = '<div class="pcard-tactics">⚔️ ' + escapeHtml(m.tactics).replace(/\n/g, "<br>") + '</div>';
    // FEAT-4: multi-line desc (SRD-карточка) — рендерим с pre-line + max-height
    var descBlock = "";
    if (m.desc) {
      var safe = escapeHtml(m.desc).replace(/\n/g, "<br>");
      var isSrd = !!m.srdSlug;
      descBlock = '<div class="pcard-desc' + (isSrd ? ' pcard-desc-srd' : '') + '">' + safe + '</div>';
    }
    return '<div class="pcard pcard-monster">' +
      '<div class="pcard-icon pcard-icon-monster">' + typeIcon + '</div>' +
      '<div class="pcard-body">' +
        '<div class="pcard-name">' + escapeHtml(m.name) + '</div>' +
        '<div class="pcard-sub"><span class="pcard-type-badge">' + typeIcon + " " + escapeHtml(m.type || "Монстр") + '</span></div>' +
        srdBadges +
        tacticsBlock +
        descBlock +
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

// ─── FEAT-4: SRD MONSTER PICKER ──────────────────────────────
var _srdPickerState = { q: "", cr: "", edition: "" };

// PERF-3: monsters-srd.js/npc-srd.js грузятся лениво (ensureBestiary в index.html) —
// гарантируем данные ДО открытия пикера; при ошибке загрузки guard ядра покажет toast.
// UX-6: _srdPickerBattleMode — открыт ли пикер «в бой» (добавляет участника в
// BATTLE_DATA) или «в отряд» (добавляет в PARTY_DATA.monsters, старое поведение).
var _srdPickerBattleMode = false;
function _openSrdMonsterPickerLazy() {
  if (!window.MONSTERS_SRD && typeof window.ensureBestiary === "function") {
    return window.ensureBestiary().catch(function (e) {
      if (window.__catchLog) window.__catchLog("bestiary:lazy-load", e);
      if (typeof showToast === "function") showToast("Бестиарий не загрузился — проверьте сеть", "warn");
    }).then(function () { return _openSrdMonsterPickerCore(); });
  }
  return _openSrdMonsterPickerCore();
}
// Пикер «в отряд» (кнопка на вкладке Отряд).
function openSrdMonsterPicker() { _srdPickerBattleMode = false; return _openSrdMonsterPickerLazy(); }
// UX-6: пикер «в бой» (кнопка на трекере) — добавляет монстра прямо в стычку.
function openSrdMonsterPickerForBattle() {
  if (!BATTLE_DATA.active) { showToast("Сначала начните бой", "warn"); return; }
  _srdPickerBattleMode = true;
  return _openSrdMonsterPickerLazy();
}
function _openSrdMonsterPickerCore() {
  if (!window.MONSTERS_SRD || !window.MONSTERS_SRD.length) {
    showToast("SRD-бестиарий не загружен", "error");
    return;
  }
  _srdPickerState.q = "";
  _srdPickerState.cr = "";
  _srdPickerState.edition = "";
  var inp = $("srd-monster-search"); if (inp) inp.value = "";
  var sel = $("srd-monster-cr");
  if (sel) {
    if (sel.options.length <= 1) {
      var crs = window.srdAllCRs();
      crs.forEach(function(cr) {
        var opt = document.createElement("option");
        opt.value = cr; opt.textContent = "CR " + cr;
        sel.appendChild(opt);
      });
    }
    sel.value = "";
  }
  // Фильтр редакции (один раз на сессию). Включаем PHB'24 даже если пуст —
  // фильтр покажет «Нет монстров» с подсказкой, что раздел в разработке.
  var edSel = $("srd-monster-edition");
  if (edSel && edSel.options.length <= 1) {
    ["PHB'14", "PHB'24"].forEach(function(ed) {
      var opt = document.createElement("option");
      opt.value = ed; opt.textContent = ed;
      edSel.appendChild(opt);
    });
    edSel.value = "";
  }
  renderSrdMonsterPicker();
  openModal("srd-monster-modal");
}

function closeSrdMonsterPicker() { _srdPickerBattleMode = false; closeModal("srd-monster-modal"); }

function setSrdMonsterSearch(val)  { _srdPickerState.q = (val || "").toLowerCase().trim(); renderSrdMonsterPicker(); }
function setSrdMonsterCr(val)      { _srdPickerState.cr = val || ""; renderSrdMonsterPicker(); }
function setSrdMonsterEdition(val) { _srdPickerState.edition = val || ""; renderSrdMonsterPicker(); }

function renderSrdMonsterPicker() {
  var box = $("srd-monster-results"); if (!box) return;
  if (!window.MONSTERS_SRD) return; // PERF-3: данные ещё не загружены
  var q = _srdPickerState.q, cr = _srdPickerState.cr, ed = _srdPickerState.edition;
  var list = window.MONSTERS_SRD.filter(function(m) {
    if (cr && m.cr !== cr) return false;
    if (ed && (m.edition || "") !== ed) return false;
    if (q) {
      var hay = (m.name + " " + (m.nameEn||"") + " " + (m.type||"")).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
  list.sort(function(a, b) {
    var d = window.srdCrNum(a.cr) - window.srdCrNum(b.cr);
    return d !== 0 ? d : a.name.localeCompare(b.name, "ru");
  });
  var countEl = $("srd-monster-count");
  if (countEl) countEl.textContent = "Найдено: " + list.length;
  if (list.length === 0) {
    if (ed === "PHB'24") box.innerHTML = '<div class="party-empty">⏳ Раздел PHB\'24 пока пуст — будет наполнен в следующем релизе</div>';
    else box.innerHTML = '<div class="party-empty">Нет монстров под фильтр</div>';
    return;
  }
  box.innerHTML = list.map(function(m) {
    var icon = getMonsterTypeIcon(m.type);
    return '<div class="srd-mon-row" onclick="addMonsterFromSRD(\'' + m.slug + '\', event)">' +
      '<div class="srd-mon-icon">' + icon + '</div>' +
      '<div class="srd-mon-body">' +
        '<div class="srd-mon-name">' + escapeHtml(m.name) + ' <span class="srd-mon-en">' + escapeHtml(m.nameEn || "") + '</span></div>' +
        '<div class="srd-mon-meta">' +
          '<span class="srd-mon-badge">CR ' + escapeHtml(m.cr) + '</span>' +
          '<span class="srd-mon-badge">🛡️ ' + m.ac + '</span>' +
          '<span class="srd-mon-badge">❤️ ' + m.hp + '</span>' +
          '<span class="srd-mon-badge">' + escapeHtml(m.size) + ' · ' + escapeHtml(m.type) + '</span>' +
          (m.edition ? '<span class="srd-mon-badge srd-mon-badge-ed">' + escapeHtml(m.edition) + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<button class="srd-mon-add" onclick="addMonsterFromSRD(\'' + m.slug + '\', event)" title="Добавить">＋ Добавить</button>' +
    '</div>';
  }).join("");
}

function addMonsterFromSRD(slug, event) {
  if (event && event.stopPropagation) event.stopPropagation();
  var m = window.srdMonsterBySlug(slug);
  if (!m) { showToast("Монстр не найден", "error"); return; }
  // UX-6: режим боя — добавляем монстра прямо в идущую стычку, модалка остаётся
  // открытой (можно добавить несколько подряд), в отряд не пишем.
  if (_srdPickerBattleMode && BATTLE_DATA.active) {
    _addSrdMonsterToBattle(m);
    return;
  }
  var desc = window.srdMonsterToDesc(m);
  var entry = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: m.name, type: m.type, desc: desc,
    status: "healthy",
    cr: m.cr, xp: m.xp, size: m.size,
    ac: m.ac, hp: m.hp, hpMax: m.hp, hpDice: m.hpDice, speed: m.speed,
    edition: m.edition || "",
    srdSlug: m.slug
  };
  while (PARTY_DATA.monsters.some(function(x) { return x.id === entry.id; })) {
    entry.id = Date.now() + Math.floor(Math.random() * 10000);
  }
  PARTY_DATA.monsters.push(entry);
  if (window.AppLog) AppLog.action("party", "из SRD добавлен монстр: " + m.name, { slug: m.slug, cr: m.cr });
  saveParty();
  renderMonsters();
  showToast(m.name + " добавлен(а) в монстров", "success");
}

// ─── FEAT-4: NPC ARCHETYPE PICKER ────────────────────────────
var _npcPickerState = { q: "", att: "" };

// PERF-3: та же ленивая обёртка, что у openSrdMonsterPicker.
function openSrdNpcPicker() {
  if (!window.NPC_ARCHETYPES && typeof window.ensureBestiary === "function") {
    return window.ensureBestiary().catch(function (e) {
      if (window.__catchLog) window.__catchLog("bestiary:lazy-load", e);
      if (typeof showToast === "function") showToast("Бестиарий не загрузился — проверьте сеть", "warn");
    }).then(function () { return _openSrdNpcPickerCore(); });
  }
  return _openSrdNpcPickerCore();
}
function _openSrdNpcPickerCore() {
  if (!window.NPC_ARCHETYPES || !window.NPC_ARCHETYPES.length) {
    showToast("NPC-архетипы не загружены", "error");
    return;
  }
  _npcPickerState.q = "";
  _npcPickerState.att = "";
  var inp = $("srd-npc-search"); if (inp) inp.value = "";
  var sel = $("srd-npc-att");
  if (sel && sel.options.length <= 1) {
    window.npcArchAttitudes().forEach(function(a) {
      var opt = document.createElement("option");
      opt.value = a; opt.textContent = a;
      sel.appendChild(opt);
    });
  }
  if (sel) sel.value = "";
  renderSrdNpcPicker();
  openModal("srd-npc-modal");
}

function closeSrdNpcPicker() { closeModal("srd-npc-modal"); }

function setSrdNpcSearch(val) { _npcPickerState.q = (val || "").toLowerCase().trim(); renderSrdNpcPicker(); }
function setSrdNpcAtt(val)    { _npcPickerState.att = val || ""; renderSrdNpcPicker(); }

function renderSrdNpcPicker() {
  var box = $("srd-npc-results"); if (!box) return;
  if (!window.NPC_ARCHETYPES) return; // PERF-3: данные ещё не загружены
  var q = _npcPickerState.q, att = _npcPickerState.att;
  var list = window.NPC_ARCHETYPES.filter(function(a) {
    if (att && (a.attitude || "") !== att) return false;
    if (q) {
      var hay = (a.name + " " + (a.role||"") + " " + (a.location||"")).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
  list.sort(function(a, b) { return a.name.localeCompare(b.name, "ru"); });
  var countEl = $("srd-npc-count");
  if (countEl) countEl.textContent = "Найдено: " + list.length;
  if (list.length === 0) { box.innerHTML = '<div class="party-empty">Нет архетипов под фильтр</div>'; return; }
  box.innerHTML = list.map(function(a) {
    var attC = _npcAttColor(a.attitude || "");
    return '<div class="srd-mon-row" onclick="addNpcFromSRD(\'' + a.slug + '\', event)">' +
      '<div class="srd-mon-icon">' + (a.icon || "🧑") + '</div>' +
      '<div class="srd-mon-body">' +
        '<div class="srd-mon-name">' + escapeHtml(a.name) + '</div>' +
        '<div class="srd-mon-meta">' +
          '<span class="srd-mon-badge">📍 ' + escapeHtml(a.location || "—") + '</span>' +
          '<span class="srd-mon-badge" style="color:' + attC + ';border-color:' + attC + '55">' + escapeHtml(a.attitude || "—") + '</span>' +
        '</div>' +
      '</div>' +
      '<button class="srd-mon-add" onclick="addNpcFromSRD(\'' + a.slug + '\', event)" title="Добавить">＋ Добавить</button>' +
    '</div>';
  }).join("");
}

function addNpcFromSRD(slug, event) {
  if (event && event.stopPropagation) event.stopPropagation();
  var a = window.npcArchBySlug(slug);
  if (!a) { showToast("Архетип не найден", "error"); return; }
  if (!PARTY_DATA.npcs) PARTY_DATA.npcs = [];
  var entry = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: a.name, role: a.role, desc: a.desc || "",
    location: a.location || "", attitude: a.attitude || "нейтральный",
    icon: a.icon || "🧑",
    srdSlug: a.slug, status: "healthy"
  };
  while (PARTY_DATA.npcs.some(function(x) { return x.id === entry.id; })) {
    entry.id = Date.now() + Math.floor(Math.random() * 10000);
  }
  PARTY_DATA.npcs.push(entry);
  if (window.AppLog) AppLog.action("party", "из SRD добавлен NPC: " + a.name, { slug: a.slug });
  saveParty();
  renderNPCs();
  showToast(a.name + " добавлен", "success");
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

// ── UX-6: авто-инициатива, HP и мета участника боя ──────────────
// Один d20 + модификатор (мод Ловкости; для self ещё + бонус черт, FIN-1).
// Отделён от сортировки, чтобы sort тестировался чисто.
function rollInitiativeValue(dexMod) {
  return Math.floor(Math.random() * 20) + 1 + (dexMod || 0);
}
// Сортировка участников по инициативе (по убыванию). Стабильная (Array.sort в
// современных движках стабилен) — при равенстве сохраняется исходный порядок.
function sortParticipantsByInitiative(arr) {
  if (!Array.isArray(arr)) return arr;
  arr.sort(function(a, b) { return (b.initiative || 0) - (a.initiative || 0); });
  return arr;
}
// Найти запись отряда по id участника вида "mon_<id>" (для HP/Ловкости монстра).
function _findPartyMonster(pid) {
  if (!pid || String(pid).indexOf("mon_") !== 0) return null;
  var raw = String(pid).slice(4);
  return PARTY_DATA.monsters.filter(function(m) { return String(m.id) === raw; })[0] || null;
}
// Мета боя участника: мод Ловкости (для инициативы) + текущие/макс ХП.
// self — из листа персонажа (initBonus — бонус инициативы от черт, напр. «Бдительный» +5);
// монстр — ХП из записи отряда, Ловкость из SRD по srdSlug;
// союзник/NPC — без числовых ХП/Ловкости (0).
function _participantCombatMeta(p) {
  var dexMod = 0, hp = 0, hpMax = 0, initBonus = 0;
  if (!p) return { dexMod: dexMod, hp: hp, hpMax: hpMax, initBonus: initBonus };
  if (p.type === "self") {
    var char = getCurrentChar();
    if (char) {
      if (char.stats) dexMod = getMod(char.stats.dex);
      if (char.bonuses && char.bonuses.initiative) initBonus = char.bonuses.initiative; // FIN-1
      if (char.combat) { hp = char.combat.hpCurrent || 0; hpMax = char.combat.hpMax || 0; }
    }
  } else if (p.type === "monster") {
    var raw = _findPartyMonster(p.id);
    if (raw) {
      hpMax = parseInt(raw.hpMax != null ? raw.hpMax : raw.hp, 10) || 0;
      hp = hpMax;
      if (raw.srdSlug && typeof window.srdMonsterBySlug === "function") {
        var srd = window.srdMonsterBySlug(raw.srdSlug);
        if (srd && srd.stats) dexMod = getMod(srd.stats.dex);
      }
    }
  }
  return { dexMod: dexMod, hp: hp, hpMax: hpMax, initBonus: initBonus };
}
// Копия setup-участника, обогащённая боевыми полями (статус/инициатива/ХП).
function _makeBattleParticipant(p) {
  var meta = _participantCombatMeta(p);
  return Object.assign({}, p, {
    status: "healthy",
    dexMod: meta.dexMod,
    initBonus: meta.initBonus,
    hp: meta.hp,
    hpMax: meta.hpMax,
    initiative: rollInitiativeValue(meta.dexMod + meta.initBonus)
  });
}
// ХП участника для рендера: self — живьём из листа (меняется и на вкладке ХП),
// иначе — снимок p.hp/p.hpMax.
function _battleParticipantHP(p) {
  if (p && p.type === "self") {
    var char = getCurrentChar();
    if (char && char.combat) return { hp: char.combat.hpCurrent || 0, hpMax: char.combat.hpMax || 0 };
    return { hp: 0, hpMax: 0 };
  }
  return { hp: (p && p.hp != null) ? p.hp : 0, hpMax: (p && p.hpMax != null) ? p.hpMax : 0 };
}
// UX-6: добавить SRD-монстра прямо в бой (уникальное имя при дублях, авто-инициатива).
function _addSrdMonsterToBattle(m) {
  var dexMod = (m.stats ? getMod(m.stats.dex) : 0);
  var hpMax = parseInt(m.hp, 10) || 0;
  var dup = BATTLE_DATA.participants.filter(function(p) { return p.baseName === m.name; }).length;
  var name = dup > 0 ? m.name + " " + (dup + 1) : m.name;
  var part = {
    id: "monb_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    baseName: m.name,
    name: name,
    icon: getMonsterTypeIcon(m.type),
    color: "#c0392b",
    type: "monster",
    status: "healthy",
    dexMod: dexMod,
    hp: hpMax,
    hpMax: hpMax,
    initiative: rollInitiativeValue(dexMod),
    srdSlug: m.slug,
    desc: (typeof window.srdMonsterToDesc === "function") ? window.srdMonsterToDesc(m) : ""
  };
  var currentP = BATTLE_DATA.participants[BATTLE_DATA.currentTurn];
  BATTLE_DATA.participants.push(part);
  sortParticipantsByInitiative(BATTLE_DATA.participants);
  if (currentP) { var ci = BATTLE_DATA.participants.indexOf(currentP); if (ci >= 0) BATTLE_DATA.currentTurn = ci; }
  if (window.AppLog) AppLog.action("battle", "в бой добавлен монстр: " + name + " (иниц. " + part.initiative + ")");
  saveBattle();
  renderBattleTracker();
  showToast(name + " добавлен(а) в бой", "success");
}

function startBattle() {
  var selected = battleSetupList.filter(function(p) { return p.checked; });
  if (selected.length === 0) { showToast("Выберите участников боя", "warn"); return; }
  var participants = selected.map(_makeBattleParticipant);
  sortParticipantsByInitiative(participants);
  BATTLE_DATA = { active: true, participants: participants, currentTurn: 0, round: 1 };
  if (window.AppLog) AppLog.action("battle", "бой начат: участников " + selected.length + " (авто-инициатива)");
  saveBattle();
  $("battle-setup-screen").classList.add("hidden");
  $("battle-tracker-screen").classList.remove("hidden");
  renderBattleTracker();
}

function getParticipantDesc(p) {
  // UX-6: у участника, добавленного прямо в бой (монстр из SRD), описание лежит на нём
  if (p && p.desc) return p.desc;
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
  $("tinfo-icon").innerHTML = p.icon || "🎭";
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
  // CAST-2: бейдж номера раунда в шапке трекера
  var roundEl = $("battle-round-badge");
  if (roundEl) roundEl.textContent = "Раунд " + (BATTLE_DATA.round || 1);
  renderBattleCastPanels(); // CAST-9: повторные тики + остаток концентрации
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
    // UX-6: строка инициативы (число редактируется, ⟳ — переброс d20+ЛОВ)
    var initVal = (p.initiative != null) ? p.initiative : 0;
    var initBlock = '<div class="tracker-init" title="Инициатива">' +
      '<input type="number" class="tracker-init-inp" value="' + initVal + '" onchange="setBattleInitiative(' + i + ',this.value)" aria-label="Инициатива">' +
      '<button type="button" class="tracker-init-roll" onclick="rerollInitiative(' + i + ')" title="Перебросить инициативу (d20+ЛОВ)">⟳</button>' +
    '</div>';
    // UX-6: инлайн-ХП (−/+ и тек/макс). Контейнер рендерим всегда (пустым для
    // союзников/NPC без чисел) — фикс. ширина держит статус выровненным по колонке.
    var hp = _battleParticipantHP(p);
    var showHP = isSelf || p.type === "monster" || hp.hpMax > 0;
    var hpBlock = '<div class="tracker-hp' + (showHP ? '' : ' tracker-hp-empty') + '">' +
      (showHP
        ? '<span class="tracker-hp-heart">❤️</span>' +
          '<button type="button" class="tracker-hp-btn tracker-hp-minus" onclick="adjustBattleHP(' + i + ',-1)" title="−1 ХП">−</button>' +
          '<input type="number" class="tracker-hp-cur" value="' + hp.hp + '" onchange="setBattleHP(' + i + ',this.value)" aria-label="Текущие ХП">' +
          '<span class="tracker-hp-sep">/</span>' +
          '<input type="number" class="tracker-hp-max" value="' + hp.hpMax + '"' + (isSelf ? ' readonly title="Макс. ХП — на вкладке ХП"' : ' onchange="setBattleHPMax(' + i + ',this.value)" aria-label="Макс. ХП"') + '>' +
          '<button type="button" class="tracker-hp-btn tracker-hp-plus" onclick="adjustBattleHP(' + i + ',1)" title="+1 ХП">+</button>'
        : '') +
    '</div>';
    // Кнопки-действия по фиксированным слотам: info / d20 / remove. Отсутствующие
    // (нет описания; self не удаляется) заменяются пустым слотом → колонки ровные.
    var infoSlot = desc
      ? '<button type="button" class="tracker-info-btn" onclick="showTrackerInfo(' + i + ')" title="Описание">!</button>'
      : '<span class="tracker-slot"></span>';
    var removeSlot = isSelf
      ? '<span class="tracker-slot"></span>'
      : '<button type="button" class="tracker-remove-btn" onclick="removeBattleParticipant(' + i + ')" title="Убрать из боя">✕</button>';
    return '<div class="tracker-row' + (isCurrent ? " tracker-row-active" : "") + (isSelf ? " tracker-row-self" : "") + '" style="border-left:3px solid ' + fcolor + '">' +
      '<div class="tracker-main">' +
        '<div class="tracker-num" style="color:' + fcolor + '">' + (i + 1) + "</div>" +
        initBlock +
        '<div class="tracker-icon" style="background:' + fcolor + '22;color:' + fcolor + '">' + (p.icon || "🎭") + "</div>" +
        '<div class="tracker-name">' +
          '<span class="tracker-name-text">' + escapeHtml(p.name || "?") + '</span>' +
          _battleCondDots(p) +
        "</div>" +
        '<div class="tracker-actions">' +
          infoSlot +
          '<button type="button" class="tracker-roll-btn" onclick="battleRollD20(' + i + ')" title="Бросить d20 (в общую историю)">🎲</button>' +
          removeSlot +
        '</div>' +
      '</div>' +
      '<div class="tracker-sub">' +
        hpBlock +
        (isSelf
          ? '<span class="tracker-self-status">' + statusText + '</span>'
          : '<select class="party-status-sel tracker-status" onchange="setBattleStatus(' + i + ',this.value)">' + opts + "</select>"
        ) +
      '</div>' +
      // CAST-10: чипы дебаффов — отдельной строкой под ХП/статусом. В .tracker-name
      // им места нет: там overflow:hidden и имя с многоточием, чип его съедал бы
      // (та же ловушка, что у чипа концентрации в шапке, CAST-9b). Строки нет
      // вовсе, пока на участнике ничего не висит.
      _battleDebuffChips(p, i) +
    "</div>";
  }).join("");
}

// ── CAST-9: панели шапки трекера, зависящие от состояния кастов ──────────────
// 9a — полоса повторных тиков урона (заклинание бьёт каждый раунд: «Ведьмин
// снаряд» бонусным действием, зоны вроде «Духовных стражей»); 9b — чип остатка
// концентрации рядом с «Раунд N».
// Обновляются ТОЧЕЧНО, отдельно от renderBattleTracker: перерисовка списка
// участников сбрасывает фокус и ввод в полях ХП/инициативы, а концентрация
// меняется и вне боевого цикла (та же причина, что у бейджа заклинания в CAST-6).
function renderBattleCastPanels() {
  var strip = $("battle-repeat-strip");
  var concEl = $("battle-conc-badge");
  if (!strip && !concEl) return;
  var char = (typeof getCurrentChar === "function" && currentId) ? getCurrentChar() : null;
  var insts = (char && char.activeSpellEffects) || [];
  var inBattle = !!BATTLE_DATA.active;
  if (strip) {
    var reps = inBattle ? insts.filter(function(i) { return i.repeat; }) : [];
    strip.innerHTML = reps.map(function(i) {
      var d = (typeof getSpellEffect === "function") ? getSpellEffect(i.spellName, i.source) : null;
      var hint = (d && d.repeat && d.repeat.hint) || "Повторный урон";
      // CAST-11: «кары» и залповые бьют не повтором, а по попаданию — дескриптор
      // может переопределить иконку кнопки (repeat.icon), по умолчанию 🔁.
      var rIcon = (d && d.repeat && d.repeat.icon) || "🔁";
      return '<button type="button" class="battle-repeat-btn" onclick="castRepeatDamage(' + i.id + ')"' +
        ' title="' + escapeHtml(i.spellName + " — " + hint) + '">' +
        escapeHtml(rIcon) + ' ' + escapeHtml(i.spellName) +
        (i.repeatFormula ? ' <span class="brb-formula">' + escapeHtml(i.repeatFormula) + '</span>' : '') +
      '</button>';
    }).join("");
    strip.classList.toggle("hidden", !reps.length);
  }
  if (concEl) {
    var name = char && char.concentration;
    if (!name || !inBattle) {
      concEl.classList.add("hidden");
      concEl.textContent = "";
    } else {
      // Остаток берём у экземпляра каста; часовые и без экземпляра (концентрация
      // поставлена кнопкой на карточке) показываются одним именем, без ⏳.
      var ci = insts.find(function(x) { return x.spellName === name && x.roundsLeft != null; });
      concEl.classList.remove("hidden");
      concEl.textContent = "🔮 " + name + (ci ? " · ⏳" + ci.roundsLeft + " рд" : "");
      concEl.title = "Концентрация: " + name + (ci ? " — осталось " + ci.roundsLeft + " раундов" : "") + ". Нажмите для деталей";
    }
  }
}

// Дымка v5: мини-иконки активных состояний рядом с именем (.cond-dot).
// Для «себя» — состояния с листа; у остальных участников списка состояний нет.
function _battleCondDots(p) {
  if (!p || p.type !== "self" || typeof getConditionChipIcon !== "function") return "";
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  if (!char || !char.conditions || !char.conditions.length) return "";
  var names = {};
  // E24-1: имена состояний по редакции персонажа (у 2024 набор тот же по id).
  var _cs = (typeof edData === "function") ? edData(char).CONDITIONS : (typeof CONDITIONS !== "undefined" ? CONDITIONS : []);
  _cs.forEach(function(c) { names[c.id] = stripLeadingEmoji(c.name); });
  return '<span class="tracker-cond-dots">' + char.conditions.slice(0, 6).map(function(id) {
    var meta = (typeof DYMKA_CONDITION_META !== "undefined") ? DYMKA_CONDITION_META[String(id).indexOf("exhaustion") === 0 ? "exhaustion" : id] : null;
    return '<span class="cond-dot" style="--sc:' + (meta ? meta.color : "var(--accent)") + '" title="' + escapeHtml(names[id] || id) + '">' + getConditionChipIcon(id, 13) + '</span>';
  }).join('') + '</span>';
}

// ── UX-6: действия в строке трекера (ХП / инициатива / броски / удаление) ──
function adjustBattleHP(i, delta) {
  var p = BATTLE_DATA.participants[i];
  if (!p) return;
  if (p.type === "self") {
    if (typeof quickHP === "function") quickHP(delta, "Бой");
    syncSelfBattleStatus();
  } else {
    p.hp = Math.max(0, (p.hp || 0) + delta);
    if (p.hpMax > 0) p.hp = Math.min(p.hp, p.hpMax);
    saveBattle();
  }
  renderBattleTracker();
}
function setBattleHP(i, val) {
  var p = BATTLE_DATA.participants[i];
  if (!p) return;
  var n = parseInt(val, 10);
  if (isNaN(n)) n = 0;
  if (n < 0) n = 0;
  if (p.type === "self") {
    var char = getCurrentChar();
    if (char && char.combat) {
      if (n > (char.combat.hpMax || n)) n = char.combat.hpMax;
      var delta = n - (char.combat.hpCurrent || 0);
      if (delta !== 0 && typeof quickHP === "function") quickHP(delta, "Бой");
      syncSelfBattleStatus();
    }
  } else {
    if (p.hpMax > 0 && n > p.hpMax) n = p.hpMax;
    p.hp = n;
    saveBattle();
  }
  renderBattleTracker();
}
function setBattleHPMax(i, val) {
  var p = BATTLE_DATA.participants[i];
  if (!p || p.type === "self") { renderBattleTracker(); return; } // макс «я» — с листа
  var n = parseInt(val, 10);
  if (isNaN(n) || n < 0) n = 0;
  p.hpMax = n;
  if (n > 0 && p.hp > n) p.hp = n;
  saveBattle();
  renderBattleTracker();
}
// Ручная правка инициативы: пересортировать, но оставить ход на текущем участнике.
function setBattleInitiative(i, val) {
  var p = BATTLE_DATA.participants[i];
  if (!p) return;
  var n = parseInt(val, 10);
  if (isNaN(n)) n = 0;
  p.initiative = n;
  var currentP = BATTLE_DATA.participants[BATTLE_DATA.currentTurn];
  sortParticipantsByInitiative(BATTLE_DATA.participants);
  if (currentP) { var ci = BATTLE_DATA.participants.indexOf(currentP); if (ci >= 0) BATTLE_DATA.currentTurn = ci; }
  saveBattle();
  renderBattleTracker();
}
function rerollInitiative(i) {
  var p = BATTLE_DATA.participants[i];
  if (!p) return;
  p.initiative = rollInitiativeValue((p.dexMod || 0) + (p.initBonus || 0)); // FIN-1: + бонус черт (Бдительный)
  var currentP = BATTLE_DATA.participants[BATTLE_DATA.currentTurn];
  sortParticipantsByInitiative(BATTLE_DATA.participants);
  if (currentP) { var ci = BATTLE_DATA.participants.indexOf(currentP); if (ci >= 0) BATTLE_DATA.currentTurn = ci; }
  if (window.AppLog) AppLog.action("battle", "инициатива " + (p.name || "?") + " → " + p.initiative);
  saveBattle();
  renderBattleTracker();
}
// Быстрый d20 из строки — реальный 3D-бросок + запись в общую историю (UX-5 quickRoll).
function battleRollD20(i) {
  var p = BATTLE_DATA.participants[i];
  if (!p) return;
  if (typeof quickRoll === "function") quickRoll({ label: p.name || "Бросок", sides: 20, mod: 0 });
}
function removeBattleParticipant(i) {
  var p = BATTLE_DATA.participants[i];
  if (!p) return;
  if (p.type === "self") { showToast("Себя нельзя убрать из боя", "warn"); return; }
  var currentP = BATTLE_DATA.participants[BATTLE_DATA.currentTurn];
  BATTLE_DATA.participants.splice(i, 1);
  if (window.AppLog) AppLog.action("battle", "убран из боя: " + (p.name || "?"));
  if (BATTLE_DATA.participants.length === 0) { endBattle(); return; }
  // Ход остаётся на текущем участнике (если это был он — на следующего по кругу).
  var ci = (currentP && currentP !== p) ? BATTLE_DATA.participants.indexOf(currentP) : -1;
  BATTLE_DATA.currentTurn = ci >= 0 ? ci : (i % BATTLE_DATA.participants.length);
  saveBattle();
  renderBattleTracker();
}


function setBattleStatus(i, val) {
  BATTLE_DATA.participants[i].status = val;
  if (window.AppLog) AppLog.action("battle", "статус " + (BATTLE_DATA.participants[i].name || "?") + " → " + val);
  saveBattle(); renderBattleTracker();
}

// ── CAST-7b: применение урона каста к цели трекера боя ──────────────────────
// Пороги статуса по % ХП — те же, что getSelfStatusFromHP (единая шкала).
function _battleStatusFromHp(hp, hpMax) {
  if (!hpMax || hpMax <= 0) return null;
  var pct = Math.round((hp / hpMax) * 100);
  if (pct <= 0)  return "dead";
  if (pct <= 15) return "dying";
  if (pct <= 35) return "heavy";
  if (pct <= 60) return "wounded";
  return "healthy";
}

// Экран выбора цели после броска урона (вызывается из _applyCastDamage,
// app-spells.js). Вне активного боя или без подходящих участников — бросок
// остаётся информационным (тихо выходим). Кандидаты — все не-«я» участники с
// полоской ХП (монстры/союзники/NPC с hpMax). При halfOnSave показываем
// переключатель «полный/половина» — выбранная величина применяется к цели.
var _castDamagePending = null;
function offerCastDamageToBattle(spellName, total, opts) {
  opts = opts || {};
  if (!BATTLE_DATA.active) return;
  var targets = BATTLE_DATA.participants
    .map(function(p, i) { return { p: p, i: i }; })
    .filter(function(x) { return x.p.type !== "self" && (x.p.type === "monster" || (x.p.hpMax || 0) > 0); });
  if (!targets.length) return;
  _castDamagePending = {
    spellName: spellName,
    full: Math.max(0, parseInt(total, 10) || 0),
    half: !!opts.half,
    useHalf: false
  };
  _renderCastDamageModal(targets);
}

function _castDamageAmount() {
  if (!_castDamagePending) return 0;
  return _castDamagePending.useHalf ? Math.floor(_castDamagePending.full / 2) : _castDamagePending.full;
}

function _renderCastDamageModal(targets) {
  var modal = $("cast-damage-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "cast-damage-modal";
    modal.className = "confirm-modal-overlay";
    modal.innerHTML =
      '<div class="confirm-modal-box cast-damage-box">' +
        '<div class="confirm-modal-icon">💥</div>' +
        '<h4 id="cast-damage-title"></h4>' +
        '<div id="cast-damage-half-row" class="cast-damage-half-row"></div>' +
        '<div id="cast-damage-targets" class="cast-damage-targets"></div>' +
        '<div class="confirm-modal-btns" style="margin-top:14px">' +
          '<button class="confirm-btn-cancel" onclick="closeCastDamageModal()">Не применять</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function(e) { if (e.target === modal) closeCastDamageModal(); });
  }
  var pend = _castDamagePending;
  $("cast-damage-title").textContent = "«" + (pend.spellName || "Заклинание") + "»: кому нанести урон?";
  // Переключатель полный/половина — только при halfOnSave
  var halfRow = $("cast-damage-half-row");
  if (pend.half) {
    var fullN = pend.full, halfN = Math.floor(pend.full / 2);
    halfRow.style.display = "flex";
    halfRow.innerHTML =
      '<button type="button" class="cast-damage-amt' + (!pend.useHalf ? " active" : "") + '" onclick="setCastDamageHalf(false)">Провал спас.: ' + fullN + '</button>' +
      '<button type="button" class="cast-damage-amt' + (pend.useHalf ? " active" : "") + '" onclick="setCastDamageHalf(true)">Успех (½): ' + halfN + '</button>';
  } else {
    halfRow.style.display = "none";
    halfRow.innerHTML = "";
  }
  var amount = _castDamageAmount();
  var box = $("cast-damage-targets");
  box.innerHTML = targets.map(function(x) {
    var p = x.p;
    var hp = _battleParticipantHP(p);
    var after = Math.max(0, (hp.hp || 0) - amount);
    var fcolor = getFactionColor(p.type);
    return '<button type="button" class="cast-damage-target" onclick="applyCastDamageToTarget(' + x.i + ')">' +
      '<span class="cdt-icon" style="background:' + fcolor + '22;color:' + fcolor + '">' + (p.icon || "🎭") + '</span>' +
      '<span class="cdt-name">' + escapeHtml(p.name || "?") + '</span>' +
      '<span class="cdt-hp">' + (hp.hp || 0) + ' → <b>' + after + '</b> / ' + (hp.hpMax || 0) + '</span>' +
    '</button>';
  }).join("");
  modal.classList.add("active");
}

function setCastDamageHalf(useHalf) {
  if (!_castDamagePending) return;
  _castDamagePending.useHalf = !!useHalf;
  var targets = BATTLE_DATA.participants
    .map(function(p, i) { return { p: p, i: i }; })
    .filter(function(x) { return x.p.type !== "self" && (x.p.type === "monster" || (x.p.hpMax || 0) > 0); });
  _renderCastDamageModal(targets);
}

function applyCastDamageToTarget(i) {
  var p = BATTLE_DATA.participants[i];
  if (!p || !_castDamagePending) { closeCastDamageModal(); return; }
  var amount = _castDamageAmount();
  var before = (p.hp != null) ? p.hp : 0;
  p.hp = Math.max(0, before - amount);
  var st = _battleStatusFromHp(p.hp, p.hpMax);
  if (st) p.status = st;
  var name = _castDamagePending.spellName;
  if (window.AppLog) AppLog.action("battle", "«" + name + "»: −" + amount + " ХП " + (p.name || "?") +
    " (" + before + "→" + p.hp + ")" + (p.hp <= 0 ? " — повержен(а)" : ""));
  showToast("💥 " + (p.name || "Цель") + ": −" + amount + " ХП" + (p.hp <= 0 ? " (повержен!)" : " → " + p.hp + " ХП"),
    p.hp <= 0 ? "success" : "info");
  closeCastDamageModal();
  saveBattle();
  renderBattleTracker();
}

function closeCastDamageModal() {
  var modal = $("cast-damage-modal");
  if (modal) modal.classList.remove("active");
  _castDamagePending = null;
}

// ── CAST-10: дебаффы чипом на участнике трекера ─────────────────────────────
// Слой «эффект на цели»: до CAST-10 каст мог повесить карточку EFFECTS_DATA
// только на СЕБЯ, поэтому «кто под Порчой» игрок держал в голове. Теперь
// участник боя получает p.debuffs — массив чипов; таймер и связь с
// концентрацией живут в экземпляре каста (char.activeSpellEffects), чип держит
// только castId и читает остаток ⏳ живьём. Так тик раундов, конец концентрации
// и отдых снимают чипы сами, без второго таймера.
// p.debuffs уезжает в localStorage вместе с BATTLE_DATA (saveBattle) — схему
// персонажа не трогаем, старые бои просто приходят без поля.
var _castDebuffPending = null;
var _SAVE_LABELS_BATTLE = { str: "СИЛ", dex: "ЛОВ", con: "ТЕЛ", int: "ИНТ", wis: "МУД", cha: "ХАР" };

// Кандидаты — все участники, кроме «я» (дебафф на себя бессмысленен, а карточка
// на листе для этого уже есть). ХП не требуем: пометить можно и союзника/NPC
// без полоски.
function _castDebuffTargets() {
  return BATTLE_DATA.participants
    .map(function(p, i) { return { p: p, i: i }; })
    .filter(function(x) { return x.p.type !== "self"; });
}

function offerCastDebuffToBattle(spellName, dbf, opts) {
  opts = opts || {};
  if (!BATTLE_DATA.active || !dbf) return;
  var targets = _castDebuffTargets();
  if (!targets.length) return;
  _castDebuffPending = {
    spellName: spellName,
    dbf: dbf,
    castId: opts.castId != null ? opts.castId : null,
    variantName: opts.variantName || null,
    max: Math.max(1, parseInt(opts.maxTargets, 10) || 1),
    chosen: []
  };
  _renderCastDebuffModal(targets);
}

function _renderCastDebuffModal(targets) {
  var modal = $("cast-debuff-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "cast-debuff-modal";
    modal.className = "confirm-modal-overlay";
    modal.innerHTML =
      '<div class="confirm-modal-box cast-debuff-box">' +
        '<div class="confirm-modal-icon">🎯</div>' +
        '<h4 id="cast-debuff-title"></h4>' +
        '<div id="cast-debuff-hint" class="cast-debuff-hint"></div>' +
        '<div id="cast-debuff-targets" class="cast-debuff-targets"></div>' +
        '<div class="confirm-modal-btns" style="margin-top:14px">' +
          '<button class="confirm-btn-cancel" onclick="closeCastDebuffModal()">Не отмечать</button>' +
          '<button class="confirm-btn-ok" id="cast-debuff-apply" onclick="applyCastDebuffTargets()"></button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", function(e) { if (e.target === modal) closeCastDebuffModal(); });
  }
  var pend = _castDebuffPending;
  var single = pend.max === 1;
  $("cast-debuff-title").textContent = "«" + pend.spellName + "»: на кого повесить?";
  var hintEl = $("cast-debuff-hint");
  var saveNote = pend.dbf.save
    ? "Спасбросок " + (_SAVE_LABELS_BATTLE[pend.dbf.save] || String(pend.dbf.save).toUpperCase()) +
      " — отмечайте только провалившихся. "
    : "";
  hintEl.textContent = saveNote + (pend.dbf.hint || "") +
    (single ? "" : " · Целей: до " + pend.max);
  // Одна цель — клик применяет сразу (как пикер урона CAST-7b); несколько —
  // отмечаем переключением и подтверждаем кнопкой.
  var box = $("cast-debuff-targets");
  box.innerHTML = targets.map(function(x) {
    var p = x.p;
    var on = pend.chosen.indexOf(x.i) !== -1;
    var fcolor = getFactionColor(p.type);
    var has = (p.debuffs || []).some(function(db) { return db.spellName === pend.spellName; });
    return '<button type="button" class="cast-debuff-target' + (on ? " chosen" : "") + '"' +
      ' onclick="' + (single ? "pickCastDebuffTarget(" : "toggleCastDebuffTarget(") + x.i + ')">' +
      '<span class="cdb-icon" style="background:' + fcolor + '22;color:' + fcolor + '">' + (p.icon || "🎭") + '</span>' +
      '<span class="cdb-name">' + escapeHtml(p.name || "?") + '</span>' +
      (has ? '<span class="cdb-note">уже отмечен</span>' : '') +
      (single ? '' : '<span class="cdb-mark">' + (on ? "✓" : "") + '</span>') +
    '</button>';
  }).join("");
  var applyBtn = $("cast-debuff-apply");
  if (applyBtn) {
    applyBtn.style.display = single ? "none" : "";
    applyBtn.textContent = "Отметить (" + pend.chosen.length + "/" + pend.max + ")";
    applyBtn.disabled = !pend.chosen.length;
  }
  modal.classList.add("active");
}

function toggleCastDebuffTarget(i) {
  var pend = _castDebuffPending;
  if (!pend) return;
  var at = pend.chosen.indexOf(i);
  if (at !== -1) pend.chosen.splice(at, 1);
  else if (pend.chosen.length < pend.max) pend.chosen.push(i);
  else { showToast("Целей уже " + pend.max + " — снимите отметку с другой", "warn"); return; }
  _renderCastDebuffModal(_castDebuffTargets());
}

function pickCastDebuffTarget(i) {
  var pend = _castDebuffPending;
  if (!pend) return;
  pend.chosen = [i];
  applyCastDebuffTargets();
}

// Чип с одним и тем же заклинанием не дублируется: повторная отметка той же
// цели обновляет запись (новый castId — свежий таймер).
function applyCastDebuffTargets() {
  var pend = _castDebuffPending;
  if (!pend || !pend.chosen.length) { closeCastDebuffModal(); return; }
  var names = [];
  pend.chosen.forEach(function(i) {
    var p = BATTLE_DATA.participants[i];
    if (!p) return;
    if (!p.debuffs) p.debuffs = [];
    p.debuffs = p.debuffs.filter(function(db) { return db.spellName !== pend.spellName; });
    p.debuffs.push({
      id: pend.dbf.id || pend.spellName,
      spellName: pend.spellName,
      name: pend.dbf.name || pend.spellName,
      icon: pend.dbf.icon || "✨",
      color: pend.dbf.color || null,
      hint: pend.dbf.hint || "",
      castId: pend.castId,
      variantName: pend.variantName || null
    });
    names.push(p.name || "?");
  });
  if (window.AppLog) AppLog.action("battle", "«" + pend.spellName + "» наложено: " + names.join(", "));
  showToast("🎯 «" + pend.spellName + "» → " + names.join(", "), "success");
  closeCastDebuffModal();
  saveBattle();
  renderBattleTracker();
}

function closeCastDebuffModal() {
  var modal = $("cast-debuff-modal");
  if (modal) modal.classList.remove("active");
  _castDebuffPending = null;
}

// Чипы дебаффов в строке участника. Остаток ⏳ берём у экземпляра каста по
// castId (единственный источник таймера); если персонажа переключили и
// экземпляра нет — чип живёт дальше, но без остатка. Клик снимает чип вручную.
function _battleDebuffChips(p, pi) {
  if (!p || !p.debuffs || !p.debuffs.length) return "";
  var char = (typeof getCurrentChar === "function" && currentId) ? getCurrentChar() : null;
  var insts = (char && char.activeSpellEffects) || [];
  return '<div class="tracker-debuffs">' + p.debuffs.map(function(db, k) {
    var inst = insts.find(function(x) { return db.castId != null && String(x.id) === String(db.castId); });
    var left = (inst && inst.roundsLeft != null) ? " ⏳" + inst.roundsLeft : "";
    var label = db.variantName || db.name || db.spellName;
    var title = db.spellName + (db.hint ? " — " + db.hint : "") + " · нажмите, чтобы снять";
    return '<button type="button" class="debuff-chip"' +
      (db.color ? ' style="--dbc:' + db.color + '"' : '') +
      ' onclick="removeBattleDebuff(' + pi + ',' + k + ')" title="' + escapeHtml(title) + '">' +
      (db.icon || "✨") + " " + escapeHtml(label) + left +
    '</button>';
  }).join("") + '</div>';
}

function removeBattleDebuff(pi, k) {
  var p = BATTLE_DATA.participants[pi];
  if (!p || !p.debuffs || !p.debuffs[k]) return;
  var db = p.debuffs.splice(k, 1)[0];
  if (window.AppLog) AppLog.action("battle", "«" + db.spellName + "» снято с " + (p.name || "?"));
  showToast("✖ «" + db.spellName + "» снято с " + (p.name || "цели"), "info");
  saveBattle();
  renderBattleTracker();
}

// Зовётся из removeCastEffectsForSpell (app-combat.js): конец/смена
// концентрации, истечение раунда, ручное снятие карточки — чипы уходят вместе
// с экземпляром. Возвращает true, если что-то сняли.
function removeBattleDebuffsForSpell(spellName) {
  if (!BATTLE_DATA || !BATTLE_DATA.participants || !BATTLE_DATA.participants.length) return false;
  var touched = false;
  BATTLE_DATA.participants.forEach(function(p) {
    if (!p.debuffs || !p.debuffs.length) return;
    var kept = p.debuffs.filter(function(db) { return db.spellName !== spellName; });
    if (kept.length === p.debuffs.length) return;
    p.debuffs = kept;
    touched = true;
  });
  if (touched) { saveBattle(); renderBattleTracker(); }
  return touched;
}

// Длинный отдых (clearAllCastEffects, app-combat.js) — снимаем всё разом.
function clearAllBattleDebuffs() {
  if (!BATTLE_DATA || !BATTLE_DATA.participants) return;
  BATTLE_DATA.participants.forEach(function(p) { if (p.debuffs) p.debuffs = []; });
  saveBattle();
}
function _logTurn() {
  if (!window.AppLog) return;
  var p = BATTLE_DATA.participants[BATTLE_DATA.currentTurn];
  AppLog.action("battle", "ход → " + ((p && p.name) || "?") + " (" + (BATTLE_DATA.currentTurn + 1) + "/" + BATTLE_DATA.participants.length + ")");
}
function nextTurn() {
  BATTLE_DATA.currentTurn = (BATTLE_DATA.currentTurn + 1) % BATTLE_DATA.participants.length;
  // CAST-2: wrap по кругу инициативы = новый раунд → тик длительностей кастов
  if (BATTLE_DATA.currentTurn === 0) {
    BATTLE_DATA.round = (BATTLE_DATA.round || 1) + 1;
    if (window.AppLog) AppLog.action("battle", "раунд " + BATTLE_DATA.round);
    tickCastEffectsRound();
  }
  _logTurn(); saveBattle(); renderBattleTracker();
}
function prevTurn() {
  // CAST-2: шаг назад через границу раунда откатывает счётчик (не ниже 1),
  // но истёкшие эффекты не оживляет и roundsLeft не возвращает
  if (BATTLE_DATA.currentTurn === 0) BATTLE_DATA.round = Math.max(1, (BATTLE_DATA.round || 1) - 1);
  BATTLE_DATA.currentTurn = (BATTLE_DATA.currentTurn - 1 + BATTLE_DATA.participants.length) % BATTLE_DATA.participants.length;
  _logTurn(); saveBattle(); renderBattleTracker();
}
// CAST-2: тик на смене раунда — декремент roundsLeft эффектов каста текущего
// персонажа; на нуле — экспирация (карточки снимает removeCastEffectsForSpell
// с рефкаунтом, концентрация истёкшего заклинания гаснет). Часовые и дольше
// (roundsLeft == null) не тикают — истекают на отдыхе или вручную.
function tickCastEffectsRound() {
  var char = (typeof getCurrentChar === "function" && currentId) ? getCurrentChar() : null;
  if (!char || !char.activeSpellEffects || !char.activeSpellEffects.length) return;
  var expired = [];
  var ticked = false;
  char.activeSpellEffects.forEach(function(inst) {
    if (inst.roundsLeft == null) return;
    ticked = true;
    inst.roundsLeft -= 1;
    if (inst.roundsLeft <= 0) expired.push(inst);
  });
  if (!ticked) return;
  expired.forEach(function(inst) {
    removeCastEffectsForSpell(char, inst.spellName, "длительность истекла");
    if (char.concentration === inst.spellName) {
      char.concentration = null;
      char.concentrationData = null;
      if (typeof updateConcentrationDisplay === "function") updateConcentrationDisplay();
    }
    showToast("⏳ «" + inst.spellName + "» — эффект истёк", "info");
  });
  if (!expired.length && typeof renderEffectsGrid === "function") renderEffectsGrid();
  if (typeof updateSpellActiveBadges === "function") updateSpellActiveBadges(); // CAST-6: остаток ⏳ на карточках
  saveToLocal();
}
function endBattle() {
  if (window.AppLog) AppLog.action("battle", "бой завершён");
  BATTLE_DATA = { active: false, participants: [], currentTurn: 0, round: 1 };
  saveBattle();
  $("battle-setup-screen").classList.remove("hidden");
  $("battle-tracker-screen").classList.add("hidden");
  buildBattleSetupList();
  renderBattleSetup();
}

