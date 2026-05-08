// ============================================================
// app-party.js — Система группы и трекер боя: союзники,
// NPC, монстры, инициатива, раунды
// ============================================================

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
  var existing = (idx >= 0 && idx < list.length) ? list[idx] : null;
  var data = { id: existing ? (existing.id || Date.now()) : Date.now(), status: existing ? (existing.status || "healthy") : "healthy" };
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

