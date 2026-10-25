// ============================================
// МАСТ: пошаговый мастер создания персонажа
// ============================================
// Экран поверх листа (как «Повышение уровня»): лист загружен под ним, и мастер
// пишет в персонажа через поля листа и их же обработчики — логику не дублируем.
// Текущий шаг хранится в char._wizStep (id шага): выход и возврат помнят место.
// Стартовый уровень — char._wizLevel; повышения до него — шаг «Уровни».

var CREATOR_STEPS = [
  { id: "base",       title: "Основа",          render: _crRenderBase, valid: _crValidBase, why: function() { return "впишите имя персонажа"; } },
  { id: "race",       title: "Раса",            render: _crRenderRace, valid: _crValidRace, why: function(c) { return c.race ? "выберите вариант расы" : "выберите расу"; } },
  { id: "class",      title: "Класс",           render: _crRenderClass, valid: _crValidClass, why: function(c) { return c.class ? "выберите подкласс" : "выберите класс"; } },
  { id: "background", title: "Предыстория",     render: _crRenderBg, valid: _crValidBg, why: function(c) { return c.background ? "распределите бонусы предыстории" : "выберите предысторию"; } },
  { id: "abilities",  title: "Характеристики",  render: _crRenderAbil, after: _crAfterAbil, valid: _crValidAbil, leave: _crLeaveAbil, why: function() { return "задайте значение каждой из шести характеристик"; } },
  { id: "choices",    title: "Выборы",          render: _crRenderChoices, after: _crAfterChoices, valid: _crValidChoices, why: function(c) { return "осталось пунктов: " + _crTodo(c).length + " — список выше"; } },
  { id: "levels",     title: "Уровни",          render: _crRenderLevels, after: _crAfterLevels, valid: _crValidLevels, skip: function(c) { return _crTargetLevel(c) <= 1; },
    why: function(c) { return (c.level || 1) < _crTargetLevel(c) ? "повысьте уровень до " + _crTargetLevel(c) + "-го" : "сделайте выборы этого уровня"; } },
  { id: "spells",     title: "Заклинания",      render: _crRenderSpells, valid: _crValidSpells, skip: function(c) { return !_crSpellRows(c).length && !_charMaxCastableLevel(c); },
    why: function(c) { return _crSpellRows(c).filter(function(r) { return r.have !== r.need; }).map(function(r) { return r.label.toLowerCase() + " " + r.have + " из " + r.need; }).join("; "); } },
  { id: "gear",       title: "Снаряжение",      render: _crRenderGear, after: creatorGearSync, valid: _crValidGear, why: function(c) { return "выдайте: " + _crGearTodo(c).map(function(r) { return r[0].replace(/<[^>]+>/g, "").toLowerCase(); }).join(", "); } },
  { id: "persona",    title: "Личность",        render: _crRenderPersona },
  { id: "summary",    title: "Итог",            render: _crRenderSummary }
];

var _crId = null;

function _crChar() {
  return _crId == null ? null : characters.find(function(c) { return c.id === _crId; }) || null;
}

function _crStepIndex(char) {
  for (var i = 0; i < CREATOR_STEPS.length; i++) if (CREATOR_STEPS[i].id === char._wizStep) return i;
  return 0;
}

/** Открыть персонажа: незавершённый мастер — на его шаге, иначе лист. */
function openCharOrCreator(id) {
  var char = characters.find(function(c) { return c.id === id; });
  if (char && char._wizStep) openCreator(id); else loadCharacter(id);
}

function openCreator(id) {
  if (_crId !== id) { _crRaceQuery = ""; _crHpMode = "avg"; }
  _crId = id;
  showScreen("creator");
  creatorRender();
  // Лист грузится под экраном: «creator» в SHEET_FLOW_SCREENS, экран не сменится
  loadCharacter(id);
  if (typeof maybeStartCreatorTour === "function") maybeStartCreatorTour();
}

function creatorRender() {
  var char = _crChar();
  var body = $("cr-body");
  if (!char || !body) return;
  var idx = _crStepIndex(char);
  var step = CREATOR_STEPS[idx];
  var dots = "";
  for (var i = 0; i < CREATOR_STEPS.length; i++) {
    dots += '<span class="cr-dot' + (i < idx ? " done" : i === idx ? " current" : "") + '" title="' + escapeHtml(CREATOR_STEPS[i].title) + '"></span>';
  }
  $("cr-progress").innerHTML = '<div class="cr-dots" aria-hidden="true">' + dots + '</div>' +
    '<div class="cr-step-label">Шаг ' + (idx + 1) + ' из ' + CREATOR_STEPS.length + ' · <b>' + escapeHtml(step.title) + '</b></div>';
  var frozen = char.basicLocked && idx <= _crLockIndex();
  _crUnmountPanels();
  body.innerHTML = frozen ? _crRenderFrozen() : step.render ? step.render(char) :
    '<p class="cr-hint">Этот шаг ещё в&nbsp;работе. Пока его можно заполнить на&nbsp;листе — ссылка внизу.</p>';
  _agHost = "ag-body";
  if (!frozen && step.after) step.after(char);
  $("cr-prev").style.visibility = idx > 0 ? "" : "hidden";
  $("cr-next").textContent = idx === CREATOR_STEPS.length - 1 ? "Персонаж готов" : "Далее";
  _crSyncNext();
}

/** Перерисовка снаружи (аватар, смена редакции) — только если мастер на экране. */
function creatorRefresh() {
  if (typeof currentScreenName === "function" && currentScreenName() === "creator") creatorRender();
}

function _crSyncNext() {
  var char = _crChar();
  var btn = $("cr-next");
  if (!char || !btn) return;
  var step = CREATOR_STEPS[_crStepIndex(char)];
  var frozen = char.basicLocked && _crStepIndex(char) <= _crLockIndex();
  btn.disabled = !frozen && !!(step.valid && !step.valid(char));
  var why = $("cr-why"), text = btn.disabled && step.why ? step.why(char) : "";
  if (why) why.textContent = text ? "Чтобы продолжить: " + text : "";
}

/** Мастер держит панели листа на шаге «Выборы» (снаряжение там не показываем). */
function creatorHostsPanels() {
  return typeof currentScreenName === "function" && currentScreenName() === "creator";
}

/** Есть ли место под заклинание по лимитам класса; иначе подсказка и отказ (addSpell в мастере). */
function creatorSpellRoom(char, sp) {
  var cap = _charMaxCastableLevel(char);
  if (sp.level > 0 && cap && sp.level > cap) { showToast("Заклинания " + sp.level + "-го круга пока недоступны — до " + cap + "-го", "warn"); return false; }
  var c = _crSpellRow(char, "cantrips");
  var room = sp.level > 0 ? _crListRoom(char) : !!(c && c.have < c.need);
  if (!room) showToast((sp.level > 0 ? "Заклинания" : "Заговоры") + " уже выбраны по лимиту класса — уберите одно, чтобы взять другое", "warn");
  return room;
}

function _crLockIndex() {
  for (var i = 0; i < CREATOR_STEPS.length; i++) if (CREATOR_STEPS[i].id === "abilities") return i;
  return -1;
}

function _crRenderFrozen() {
  return '<p class="cr-hint">Основа персонажа зафиксирована: имя, раса, класс, предыстория и&nbsp;характеристики больше не&nbsp;меняются. Чтобы исправить их, разблокируйте основу.</p>' +
    '<div class="list-row cr-row"><button type="button" class="hp-act" onclick="unlockBasicInfo()">Разблокировать основу →</button></div>';
}

function _crGo(delta) {
  var char = _crChar();
  if (!char) return;
  var idx = _crStepIndex(char) + delta;
  // пустые шаги (уровни на 1-м, заклинания у незаклинателя) проходим насквозь
  while (idx > 0 && idx < CREATOR_STEPS.length && CREATOR_STEPS[idx].skip && CREATOR_STEPS[idx].skip(char)) idx += delta;
  if (idx < 0) return;
  if (idx >= CREATOR_STEPS.length) { _crLeaveToSheet(); lockSheet(); return; }
  char._wizStep = CREATOR_STEPS[idx].id;
  saveToLocal();
  creatorRender();
  try { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); } catch (e) {}
}

function creatorNext() {
  if ($("cr-next").disabled) return;
  var char = _crChar();
  var step = char && CREATOR_STEPS[_crStepIndex(char)];
  if (step && step.leave && !(char.basicLocked && _crStepIndex(char) <= _crLockIndex()) && step.leave(char) === false) return;
  _crGo(1);
}
function creatorPrev() { _crGo(-1); }

/** «← Выйти»: шаг уже сохранён, черновик без имени вычистит _purgeDraftChars. */
function creatorExit() { screenBack(); }

/** «Заполнить вручную» и конец мастера: дальше — обычный лист. */
function creatorManual() { _crLeaveToSheet(); }

function _crLeaveToSheet() {
  var char = _crChar();
  if (!char) return;
  var lvl = char._wizLevel;
  delete char._wizStep;
  delete char._wizLevel;
  saveToLocal();
  // Ушли на лист до шага «Уровни» — стартовый уровень ставится полем листа, как при ручном создании
  if (lvl > (char.level || 1)) _crSetField("char-level", String(lvl), true);
  showScreen("character");
  if (typeof maybeStartSheetTour === "function") maybeStartSheetTour();
}

/** Записать значение в поле листа и вызвать его обработчики. */
function _crSetField(id, value, withChange) {
  var el = $(id);
  if (!el) return;
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  if (withChange) el.dispatchEvent(new Event("change", { bubbles: true }));
}

// ── Шаг 1: основа ───────────────────────────────

function _crValidBase(char) {
  var lvl = char._wizLevel == null ? 1 : char._wizLevel;
  return !!(char.name && char.name.trim() && char.name !== DEFAULT_CHARACTER.name) && lvl >= 1 && lvl <= 20;
}

function _crSeg(label, items, cur, onclick, disabledFn) {
  var html = '<div class="theme-picker-row list-row cr-row"><span class="theme-picker-label">' + label + '</span>' +
    '<div class="theme-picker-btns seg-group" role="radiogroup" aria-label="' + label + '">';
  items.forEach(function(it) {
    var on = it[0] === cur;
    var dis = disabledFn && disabledFn(it[0]);
    html += '<button type="button" class="theme-picker-btn seg' + (on ? " active" : "") + '" role="radio" aria-checked="' + on + '"' +
      (dis ? ' disabled title="Редакцию можно сменить, пока не выбраны класс, раса и предыстория"' : "") +
      ' onclick="' + onclick + '(\'' + it[0] + '\')">' + it[1] + '</button>';
  });
  return html + '</div></div>';
}

function _crRenderBase(char) {
  var ed = char.edition === "2024" ? "2024" : "2014";
  var busy = typeof _cwEditionBusy === "function" && _cwEditionBusy(char);
  var name = char.name === DEFAULT_CHARACTER.name ? "" : (char.name || "");
  var av = safeImageSrc(char.avatar);
  var avHtml = av ? '<img src="' + escapeHtml(av) + '" alt="Портрет">' : '<img src="assets/avatar-fallback.webp" alt="">';
  return '' +
    _crSeg("Редакция правил", [["2014", "2014"], ["2024", "2024"]], ed, "creatorSetEdition",
      function(v) { return busy && v !== ed; }) +
    '<div class="cr-field"><label for="cr-name">Имя</label><div class="name-input-row">' +
      '<input type="text" id="cr-name" class="field" maxlength="60" placeholder="Как зовут героя?" value="' + escapeHtml(name) + '" oninput="creatorSetName(this.value)">' +
      '<button type="button" class="icon-btn name-roll-btn" onclick="creatorRollName()" title="Случайное имя" aria-label="Сгенерировать случайное имя"><span data-ico="dice">🎲</span></button>' +
    '</div></div>' +
    _crSeg("Пол", [["", "Не&nbsp;указан"], ["м", "Мужской"], ["ж", "Женский"]], char.gender || "", "creatorSetGender") +
    '<div class="list-row cr-row cr-avatar-row"><span class="cr-avatar">' + avHtml + '</span>' +
      '<button type="button" class="hp-act" onclick="openAvatarModal(event)">' + (av ? "Сменить портрет" : "Выбрать портрет") + ' →</button></div>' +
    '<div class="cr-field"><label for="cr-level">Стартовый уровень</label>' +
      '<input type="number" id="cr-level" class="field cr-level" min="1" max="20" inputmode="numeric" value="' + (char._wizLevel == null ? 1 : char._wizLevel) + '" oninput="creatorSetLevel(this.value)">' +
      '<div class="cr-hint">Герой создаётся на&nbsp;1-м уровне, затем мастер проведёт повышения до&nbsp;выбранного.</div></div>';
}

function creatorSetEdition(ed) {
  var char = _crChar();
  if (!char || typeof setDraftEdition !== "function") return;
  setDraftEdition(ed);
  creatorRender();
}

function creatorSetName(v) {
  _crSetField("char-name", v);
  _crSyncNext();
}

function creatorRollName() {
  if (typeof rollRandomName !== "function") return;
  rollRandomName();
  var inp = $("cr-name"), src = $("char-name");
  if (inp && src) inp.value = src.value;
  _crSyncNext();
}

function creatorSetGender(g) {
  _crSetField("char-gender", g, true);
  creatorRender();
}

function creatorSetLevel(v) {
  var char = _crChar();
  if (!char) return;
  var n = parseInt(v, 10);
  char._wizLevel = isNaN(n) ? 0 : n;
  if (n >= 1 && n <= 20) saveToLocal();
  _crSyncNext();
}

// ── Карточки выбора ─────────────────────────────

var _CR_STAT_SHORT = { str: "СИЛ", dex: "ЛОВ", con: "ТЕЛ", int: "ИНТ", wis: "МУД", cha: "ХАР" };

/** Карточка: значение уходит через data-v, чтобы кавычки в названиях не ломали onclick. */
function _crCard(value, name, meta, desc, onclick, cls) {
  return '<button type="button" class="cr-card' + (cls ? " " + cls : "") + '" data-v="' + escapeHtml(value) + '" onclick="' + onclick + '(this.dataset.v)">' +
    '<span class="cr-card-name">' + escapeHtml(name) + '</span>' +
    (meta ? '<span class="cr-card-meta">' + meta + '</span>' : "") +
    (desc ? '<span class="cr-card-desc">' + escapeHtml(desc) + '</span>' : "") +
    '</button>';
}

function _crSelectOptions(id) {
  var sel = $(id);
  var out = [];
  if (!sel) return out;
  Array.prototype.forEach.call(sel.options, function(o) {
    if (!o.value) return;
    var g = o.parentNode && o.parentNode.tagName === "OPTGROUP" ? o.parentNode.label : "";
    out.push({ value: o.value, text: o.textContent, group: g.replace(/^[^A-Za-zА-Яа-яЁё]+/, "") });
  });
  return out;
}

// ── Шаг 2: раса ─────────────────────────────────

var _crRaceQuery = "";

function _crRaceData(char, race) {
  var tbl = edData(char).RACE_DATA || {};
  return tbl[race] || null;
}

function _crSpeciesSingles(data) {
  return (data && Array.isArray(data.choices) ? data.choices : []).filter(function(ch) { return ch.type === "single"; });
}

function _crValidRace(char) {
  if (!char.race) return false;
  if (char.edition !== "2024") return true;
  var picks = char.speciesChoices || {};
  return _crSpeciesSingles(_crRaceData(char, char.race)).every(function(ch) { return !!picks[ch.id]; });
}

function _crRaceMeta(char, data) {
  if (!data) return "";
  var parts = [];
  Object.keys(data.stats || {}).forEach(function(k) {
    var v = data.stats[k];
    parts.push((v > 0 ? "+" : "") + v + "&nbsp;" + _CR_STAT_SHORT[k]);
  });
  if (Array.isArray(data.size)) parts.push(data.size.join("/"));
  else if (data.size && data.size !== "Средний") parts.push(escapeHtml(data.size));
  if (data.speed) parts.push(data.speed + "&nbsp;фт");
  if (data.darkvision) parts.push("тёмное зрение " + data.darkvision + "&nbsp;фт");
  return parts.join(" · ");
}

function _crRaceDesc(data) {
  if (!data) return "";
  if (Array.isArray(data.traits)) return data.traits.map(function(t) { return t.name; }).join(" · ");
  return data.traits || "";
}

function _crRenderRaceList(char) {
  var q = _crRaceQuery.trim().toLowerCase();
  var html = "", group = null;
  _crSelectOptions("char-race").forEach(function(o) {
    var data = _crRaceData(char, o.value);
    if (q && (o.value + " " + o.group + " " + _crRaceDesc(data)).toLowerCase().indexOf(q) === -1) return;
    if (o.group !== group) {
      if (group !== null) html += '</div>';
      group = o.group;
      html += (group ? '<div class="cr-group-title">' + escapeHtml(group) + '</div>' : "") + '<div class="cr-cards">';
    }
    html += _crCard(o.value, o.value, _crRaceMeta(char, data), _crRaceDesc(data), "creatorPickRace",
      o.value === char.race ? "selected" : "");
  });
  if (group !== null) html += '</div>';
  return html || '<p class="cr-hint">Ничего не&nbsp;найдено.</p>';
}

function _crRenderRace(char) {
  var is24 = char.edition === "2024";
  var html = '<p class="cr-hint">' + (is24 ? "Вид даёт размер, скорость и&nbsp;особенности. Характеристики в&nbsp;2024 растут от&nbsp;предыстории." :
    "Раса даёт бонусы к&nbsp;характеристикам, скорость и&nbsp;особенности. Подрасы — отдельные карточки в&nbsp;группе.") + '</p>';
  var data = char.race ? _crRaceData(char, char.race) : null;
  if (data) {
    html += '<div class="cr-picked"><div class="cr-picked-title">' + escapeHtml(char.race) + '</div>' +
      '<div class="cr-card-meta">' + _crRaceMeta(char, data) + '</div>';
    if (Array.isArray(data.traits)) {
      data.traits.forEach(function(t) { html += '<p class="cr-picked-text"><b>' + escapeHtml(t.name) + '.</b> ' + escapeHtml(t.desc) + '</p>'; });
    } else if (data.traits) html += '<p class="cr-picked-text">' + escapeHtml(data.traits) + '</p>';
    html += '</div>';
    var picks = char.speciesChoices || {};
    _crSpeciesSingles(is24 ? data : null).forEach(function(ch) {
      html += '<div class="cr-group-title">' + escapeHtml(ch.name) + '</div><div class="cr-cards">';
      (ch.options || []).forEach(function(op) {
        html += _crCard(ch.id + "|" + op.id, op.name, "", op.desc || "", "creatorPickSpeciesOpt",
          picks[ch.id] === op.id ? "selected" : "");
      });
      html += '</div>';
    });
    var rest = [];
    if (typeof RACE_STAT_PICKS !== "undefined" && RACE_STAT_PICKS[char.race] && !is24) rest.push("+1 к&nbsp;двум характеристикам");
    if (typeof RACE_SKILL_PICKS !== "undefined" && RACE_SKILL_PICKS[char.race] && !is24) rest.push("навыки");
    var rl = edData(char).RACE_LANGUAGES && edData(char).RACE_LANGUAGES[char.race];
    if (rl && rl.choice > 0) rest.push("языки");
    if (rest.length) html += '<p class="cr-hint">Остальные выборы расы (' + rest.join(", ") + ') — на&nbsp;шаге «Выборы».</p>';
  }
  html += '<div class="cr-field"><label for="cr-race-q">Поиск</label>' +
    '<input type="search" id="cr-race-q" class="field" placeholder="' + (is24 ? "Название вида" : "Название расы или книги") + '" value="' + escapeHtml(_crRaceQuery) + '" oninput="creatorRaceSearch(this.value)"></div>' +
    '<div id="cr-race-list">' + _crRenderRaceList(char) + '</div>';
  return html;
}

function creatorRaceSearch(v) {
  var char = _crChar();
  _crRaceQuery = v || "";
  var box = $("cr-race-list");
  if (char && box) box.innerHTML = _crRenderRaceList(char);
}

function creatorPickRace(v) {
  var char = _crChar();
  if (!char || char.race === v) return;
  _crSetField("char-race", v, true);
  creatorRender();
}

function creatorPickSpeciesOpt(v) {
  var p = String(v).split("|");
  if (typeof toggleSpeciesChoice === "function") toggleSpeciesChoice(p[0], p[1]);
  creatorRender();
}

// ── Шаг 3: класс ────────────────────────────────

var _CR_CLASS_BLURB = {
  "Варвар": "Свирепый воин: ярость даёт урон и стойкость.",
  "Бард": "Маг-вдохновитель: поддержка союзников, навыки и заклинания.",
  "Воин": "Мастер оружия и доспехов, больше всех атак.",
  "Волшебник": "Учёный маг с самым широким выбором заклинаний.",
  "Друид": "Хранитель природы: стихийная магия и дикий облик.",
  "Жрец": "Проводник божества: лечение, защита и божественная магия.",
  "Колдун": "Маг по договору с покровителем: мистический заряд и воззвания.",
  "Монах": "Боец без доспехов: удары руками, ци и подвижность.",
  "Паладин": "Святой воин в доспехах: божественная кара, лечение и ауры.",
  "Плут": "Ловкач и мастер навыков: скрытая атака и хитрые действия.",
  "Следопыт": "Охотник и разведчик: оружие, выживание и магия природы.",
  "Чародей": "Маг с врождённой силой: меньше заклинаний, зато метамагия."
};

function _crClassMeta(char, cls) {
  var ed = edData(char);
  var hd = ed.CLASS_HIT_DICE && ed.CLASS_HIT_DICE[cls];
  var sv = (ed.CLASS_SAVE_PROFICIENCIES || CLASS_SAVE_PROFICIENCIES)[cls] || [];
  var parts = [];
  if (hd) parts.push("кость хитов к" + hd);
  if (sv.length) parts.push("спасброски " + sv.map(function(k) { return _CR_STAT_SHORT[k]; }).join(", "));
  return parts.join(" · ");
}

/** Подкласс выбирается здесь, только если лист открыл его на 1 уровне. */
function _crSubclassOpen() {
  var sel = $("char-subclass");
  return !!(sel && !sel.disabled);
}

function _crValidClass(char) {
  if (!char.class) return false;
  return !_crSubclassOpen() || !!char.subclass;
}

function _crBuildsFor(char) {
  var ed = char.edition === "2024" ? "2024" : "2014";
  return (window.CHARACTER_BUILDS || []).filter(function(b) {
    return b.className === char.class && (b.edition || "2014") === ed;
  });
}

function _crRenderClass(char) {
  var html = '<p class="cr-hint">Класс задаёт хиты, владения, спасброски и&nbsp;то, чем герой занят в&nbsp;бою.</p><div class="cr-cards">';
  _crSelectOptions("char-class").forEach(function(o) {
    html += _crCard(o.value, o.value, _crClassMeta(char, o.value), _CR_CLASS_BLURB[o.value] || "", "creatorPickClass",
      o.value === char.class ? "selected" : "");
  });
  html += '</div>';
  if (!char.class) return html;

  html += '<div class="list-row cr-row"><button type="button" class="hp-act" onclick="openClassPlan()">План класса 1–20 →</button></div>';

  var rec = typeof getBuildRecSubclass === "function" ? getBuildRecSubclass(char) : null;
  var unlock = edData(char).SUBCLASS_LEVEL[char.class] || 3;
  html += '<div class="cr-group-title">Подкласс</div>';
  if (_crSubclassOpen()) {
    html += '<div class="cr-cards">';
    _crSelectOptions("char-subclass").forEach(function(o) {
      var cls = (o.value === char.subclass ? "selected" : "") + (o.value === rec ? " is-rec" : "");
      html += _crCard(o.value, o.value, o.value === rec ? '<span class="cr-rec">совет билда</span>' : "", "", "creatorPickSubclass", cls);
    });
    html += '</div>';
  } else {
    var lvl = char._wizLevel || 1;
    html += '<p class="cr-hint">Подкласс открывается на&nbsp;' + unlock + '&nbsp;уровне' +
      (lvl >= unlock ? " — мастер предложит его на&nbsp;шаге «Уровни»" : "") +
      (rec ? '. Совет билда: <b>' + escapeHtml(rec) + '</b>' : "") + '.</p>';
  }

  html += '<div class="cr-group-title">Готовый билд</div>';
  if (!window.CHARACTER_BUILDS) {
    if (typeof _withBuilds === "function") _withBuilds(creatorRefresh);
    return html + '<p class="cr-hint">Загружаю билды…</p>';
  }
  var builds = _crBuildsFor(char);
  if (!builds.length) return html + '<p class="cr-hint">Для этого класса билдов пока нет.</p>';
  html += '<p class="cr-hint">Билд необязателен: он подскажет подкласс, характеристики, черты и&nbsp;заклинания на&nbsp;следующих шагах.</p><div class="cr-cards">';
  builds.forEach(function(b) {
    var meta = [b.subclass, b.race, b.background].filter(Boolean).map(escapeHtml).join(" · ");
    html += _crCard(b.id, b.title, meta, b.summary || "", "creatorPickBuild", char.buildId === b.id ? "selected" : "");
  });
  return html + '</div>';
}

function creatorPickClass(v) {
  var char = _crChar();
  if (!char || char.class === v) return;
  _crSetField("char-class", v, true);
  // билд другого класса больше не подсказывает
  var b = char.buildId && window.getBuildById && window.getBuildById(char.buildId);
  if (b && b.className !== v && typeof _setCharBuildId === "function") _setCharBuildId(char, null);
  creatorRender();
}

function creatorPickSubclass(v) {
  var char = _crChar();
  if (!char) return;
  _crSetField("char-subclass", char.subclass === v ? "" : v, true);
  creatorRender();
}

function creatorPickBuild(id) {
  var char = _crChar();
  if (!char || typeof _setCharBuildId !== "function") return;
  _setCharBuildId(char, char.buildId === id ? null : id);
  if (typeof updateSubclassRecHint === "function") updateSubclassRecHint();
  creatorRender();
}

// ── Шаг 4: предыстория ──────────────────────────

function _crBgDef(char, bg) {
  return typeof getBackgroundDef === "function" ? getBackgroundDef(char, bg) : null;
}

function _crFeatName(char, id) {
  var d = id && typeof getFeatDef === "function" ? getFeatDef(char, id) : null;
  return d ? d.name : "";
}

function _crValidBg(char) {
  if (!char.background) return false;
  if (char.edition !== "2024") return true;
  var def = _crBgDef(char);
  if (!def) return false;
  if (def.custom && (def.abilities.length < 3 || !def.featId)) return false;
  return (def.abilities || []).length !== 3 || validateBgStatChoice(def, char.bgStatChoice).complete;
}

function _crBgMeta(char, name) {
  if (name === CUSTOM_BACKGROUND_KEY) return char.edition === "2024" ? "три характеристики, два навыка и&nbsp;черта на&nbsp;выбор" : "умение любой предыстории, два навыка на&nbsp;выбор";
  var d = _crBgDef(char, name);
  if (!d) return "";
  var parts = [];
  if (d.abilities && d.abilities.length) parts.push(d.abilities.map(function(k) { return _CR_STAT_SHORT[k]; }).join("/"));
  if (d.featId) parts.push("черта: " + escapeHtml(_crFeatName(char, d.featId) + (d.featOpt ? " (" + d.featOpt + ")" : "")));
  if (d.skills && d.skills.length) parts.push(escapeHtml(d.skills.join(", ")));
  if (d.skillChoice) parts.push("навыки на&nbsp;выбор");
  return parts.join(" · ");
}

function _crRenderBg(char) {
  var is24 = char.edition === "2024";
  var html = '<p class="cr-hint">' + (is24 ? "Предыстория даёт +2/+1 к&nbsp;характеристикам, черту происхождения, навыки и&nbsp;снаряжение." :
    "Предыстория даёт навыки, инструменты, языки и&nbsp;особое умение.") + '</p>';
  var def = char.background ? _crBgDef(char) : null;
  if (def) {
    html += '<div class="cr-picked"><div class="cr-picked-title">' + escapeHtml(def.custom ? "Своя предыстория" : char.background) + '</div>' +
      '<div class="cr-card-meta">' + _crBgMeta(char, char.background) + '</div>';
    if (def.feature && def.feature.name) html += '<p class="cr-picked-text"><b>' + escapeHtml(def.feature.name) + '.</b> ' + escapeHtml(def.feature.desc || "") + '</p>';
    html += '</div>';
    if (is24) html += _crRenderBgStats(char, def);
    if (!is24 || def.custom || def.skillChoice) html += '<p class="cr-hint">Навыки, инструменты и&nbsp;языки на&nbsp;выбор — на&nbsp;шаге «Выборы».</p>';
  }
  html += '<div class="cr-cards">';
  _crSelectOptions("char-background").forEach(function(o) {
    var title = o.value === CUSTOM_BACKGROUND_KEY ? "Своя предыстория" : o.value;
    html += _crCard(o.value, title, _crBgMeta(char, o.value), "", "creatorPickBg", o.value === char.background ? "selected" : "");
  });
  return html + '</div>';
}

/** 2024: три характеристики «своей» предыстории, распределение +2/+1 и черта происхождения. */
function _crRenderBgStats(char, def) {
  var html = "";
  if (def.custom) {
    html += '<div class="cr-group-title">Характеристики своей предыстории (' + def.abilities.length + '/3)</div><div class="race-extras-row cr-chips">';
    AG_KEYS.forEach(function(k) {
      html += _crChip(k, _CR_STAT_SHORT[k], def.abilities.indexOf(k) !== -1, "creatorBgCustomStat");
    });
    html += '</div>';
  }
  if (def.abilities.length === 3) {
    var bsc = char.bgStatChoice || { mode: "2+1", alloc: {} };
    var alloc = bsc.alloc || {};
    html += '<div class="cr-group-title">Прибавки к&nbsp;характеристикам</div><div class="race-extras-row cr-chips">' +
      _crChip("2+1", "+2 / +1", bsc.mode !== "1+1+1", "creatorBgStatMode") +
      _crChip("1+1+1", "+1 / +1 / +1", bsc.mode === "1+1+1", "creatorBgStatMode") + '</div>';
    if (bsc.mode !== "1+1+1") {
      html += '<div class="race-extras-row cr-chips">';
      def.abilities.forEach(function(k) {
        html += _crChip(k, _CR_STAT_SHORT[k] + (alloc[k] ? " +" + alloc[k] : ""), !!alloc[k], "creatorBgStat");
      });
      html += '</div><p class="cr-hint">Первая выбранная получает +2, вторая — +1.</p>';
    }
  }
  html += '<div class="cr-group-title">Черта происхождения</div>';
  if (def.custom) {
    html += '<div class="cr-cards">';
    (edData(char).FEATS_DATA || []).filter(function(f) { return f.category === "origin"; }).forEach(function(f) {
      html += _crCard(f.id, f.name, "", f.desc || "", "creatorBgCustomFeat", def.featId === f.id ? "selected" : "");
    });
    html += '</div>';
  } else {
    html += '<p class="cr-hint"><b>' + escapeHtml(_crFeatName(char, def.featId) + (def.featOpt ? " (" + def.featOpt + ")" : "")) +
      '</b> — выдаётся вместе с&nbsp;предысторией после шага «Характеристики».</p>';
  }
  return html;
}

function _crChip(value, label, on, onclick) {
  return '<button type="button" class="race-extras-stat-pick' + (on ? " selected" : "") + '" data-v="' + escapeHtml(value) + '" onclick="' + onclick + '(this.dataset.v)">' + label + '</button>';
}

function creatorPickBg(v) {
  var char = _crChar();
  if (!char || char.background === v) return;
  _crSetField("char-background", v, true);
  creatorRender();
}

function creatorBgStatMode(m) { if (typeof setBgStatMode === "function") setBgStatMode(m); creatorRender(); }
function creatorBgStat(k) { if (typeof toggleBgStat === "function") toggleBgStat(k); creatorRender(); }
function creatorBgCustomStat(k) { if (typeof toggleBgCustom === "function") toggleBgCustom("abilities", k); creatorRender(); }
function creatorBgCustomFeat(id) { if (typeof toggleBgCustom === "function") toggleBgCustom("featId", id); creatorRender(); }

// ── Шаг 5: характеристики ───────────────────────
// Тот же генератор, что окно «Способ генерации» (app-asi.js), только в теле мастера.
// «Далее» записывает значения и фиксирует основу — как кнопка на листе.

var _crAgFor = null;

function _crRenderAbil() {
  return '<p class="cr-hint">После этого шага основа персонажа фиксируется: дальше — выборы расы, класса и&nbsp;предыстории.</p><div id="cr-ag"></div>';
}

function _crAfterAbil(char) {
  if (_crAgFor !== char.id || !_ag) { _agInit(char); _crAgFor = char.id; }
  _agHost = "cr-ag";
  _agRender();
}

function _crValidAbil() {
  return !!(_ag && _crAgFor === _crId && _agReady());
}

function _crLeaveAbil(char) {
  if (!_agCommit(char)) return false;
  _crAgFor = null;
  lockBasicInfo();
  if (!char.basicLocked) {
    var msg = $("cw-validation");
    showToast(msg && msg.textContent ? msg.textContent : "Основа не\u00a0заполнена", "warn");
    return false;
  }
  return true;
}

// ── Шаг 6: выборы ───────────────────────────────
// Панели выборов листа переезжают в тело мастера и возвращаются на лист при уходе
// с шага: их обработчики ищут узлы по id, поэтому работают где угодно.
// Что осталось — _creationTodo; снаряжение выдаёт шаг «Снаряжение» (МАСТ-6).

var _CR_HOSTED = [
  ["race-extras-panel", "Раса", "renderRaceExtras"],
  ["class-skills-panel", "Класс", "renderClassSkills"],
  ["bg-extras-panel", "Предыстория", "renderBackgroundExtras"],
  ["tools-container", "Инструменты", "renderTools"],
  ["languages-container", "Языки", "renderLanguages"]
];
var _CR_LATER = /^(Стартовое снаряжение|Снаряжение предыстории)/;

function _crTodo(char) {
  return _creationTodo(char).filter(function(r) { return !_CR_LATER.test(r[2]); });
}

function _crValidChoices(char) { return !_crTodo(char).length; }

function _crRenderChoices() {
  var html = '<p class="cr-hint">Выборы расы, класса и&nbsp;предыстории. «Далее» откроется, когда список «Осталось выбрать» опустеет.</p><div id="cr-todo"></div>';
  _CR_HOSTED.forEach(function(h) {
    html += '<div class="cr-host" data-cr-host="' + h[0] + '"><div class="cr-group-title">' + h[1] + '</div></div>';
  });
  return html + '<div id="cr-wm"></div><div id="cr-cc"></div>';
}

function _crAfterChoices() {
  _CR_HOSTED.forEach(function(h) {
    var el = $(h[0]), host = document.querySelector('[data-cr-host="' + h[0] + '"]');
    if (!el || !host) return;
    _crMount(el, host);
    if (typeof window[h[2]] === "function") window[h[2]]();
  });
  creatorChoicesSync();
}

/** Перенести узел листа в мастер; его место на листе держит скрытый маркер. */
function _crMount(el, host) {
  if (!el._crSlot) {
    var slot = document.createElement("span");
    slot.hidden = true;
    el.parentNode.insertBefore(slot, el);
    el._crSlot = slot;
  }
  host.appendChild(el);
}

/** Вернуть панели на лист — перед перерисовкой мастера и при смене экрана. */
function _crUnmountPanels() {
  _CR_HOSTED.map(function(h) { return h[0]; }).concat(["lu-choices-body"]).forEach(function(id) {
    var el = $(id);
    if (!el || !el._crSlot) return;
    el._crSlot.parentNode.insertBefore(el, el._crSlot);
    el._crSlot.remove();
    el._crSlot = null;
    // экран выборов «Повышения» открыт только на время шага «Уровни»
    if (id === "lu-choices-body" && $("lu-screen-choices")) $("lu-screen-choices").style.display = "none";
  });
}

/** Список, мастерство и классовые выборы шага; зовётся из renderCreationTodo после любой правки. */
function creatorChoicesSync() {
  var char = _crChar(), box = $("cr-todo");
  if (!char || !box || char.id !== currentId) return;
  var rows = _crTodo(char);
  box.innerHTML = '<div class="pg-grp">' + (rows.length ? "Осталось выбрать" : "Всё выбрано") + '</div>' +
    (rows.length ? '<div class="hp-rows">' + rows.map(function(r) { return _pgAttn(r[0], "Выбрать →", _crTodoGo(r[1])); }).join("") + '</div>' : "");
  _CR_HOSTED.forEach(function(h) {
    var el = $(h[0]), host = el && el.parentNode;
    if (host && host.hasAttribute && host.hasAttribute("data-cr-host")) host.style.display = el.style.display === "none" ? "none" : "";
  });
  $("cr-wm").innerHTML = _crRenderMastery(char);
  $("cr-cc").innerHTML = _crRenderClassChoices(char);
  _crSyncNext();
}

function _crTodoGo(go) {
  return go.replace("switchTab('battle'); creationTodoGo('weapons-list')", "_crGoTo('cr-wm')").replace(/creationTodoGo\(/g, "_crGoTo(");
}

function _crGoTo(id) {
  var el = $(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

/** 2024: мастерство — виды оружия, которыми персонаж владеет; оружие в сумке не нужно. */
function _crRenderMastery(char) {
  var limit = typeof getWeaponMasteryLimit === "function" ? getWeaponMasteryLimit(char) : 0;
  if (!limit) return "";
  var cur = char.weaponMastery || [];
  var html = '<div class="cr-group-title">Мастерство оружия (' + cur.length + '/' + limit + ')</div><div class="race-extras-row cr-chips">';
  _weaponCatalog(char).forEach(function(p) {
    if (!p.mastery24 || !canMasterWeapon(char, p) || !checkWeaponProficiency(char, p.name)) return;
    html += _crChip(p.name, escapeHtml(p.name), cur.indexOf(p.name) !== -1, "creatorToggleMastery");
  });
  return html + '</div>';
}

function creatorToggleMastery(name) {
  var char = _crChar();
  if (!char) return;
  if (!Array.isArray(char.weaponMastery)) char.weaponMastery = [];
  var i = char.weaponMastery.indexOf(name);
  if (i !== -1) char.weaponMastery.splice(i, 1);
  else if (weaponMasteryPending(char) > 0) char.weaponMastery.push(name);
  else { showToast("Мастерство оружия: не больше " + getWeaponMasteryLimit(char), "warn"); return; }
  saveToLocal();
  if (typeof renderWeapons === "function") renderWeapons();
  creatorChoicesSync();
}

function _crRenderClassChoices(char) {
  if (typeof ccGetAllChoicesFor !== "function") return "";
  var items = ccGetAllChoicesFor(char).filter(function(it) { return it.choice; });
  if (!items.length) return "";
  return '<div class="cr-group-title">Классовые выборы</div><div class="hp-rows">' + items.map(function(it) {
    var go = "openClassChoiceModal('" + _pgArg(it.className) + "', '" + _pgArg(it.choice.id) + "')";
    return _pgAttn(escapeHtml(it.choice.name || it.choice.id) + (it.isComplete ? " <u>· выбрано</u>" : ""), it.isComplete ? "Изменить →" : "Выбрать →", go);
  }).join("") + '</div>';
}

// ── Шаг 7: уровни ───────────────────────────────
// Повышения до стартового уровня — тот же confirmLevelUp, что у «Повысить» на листе,
// по одному уровню; выборы уровня — экран выборов повышения (luBuildChoicesScreen),
// он переезжает в мастер. Заклинания уровня — шаг «Заклинания» (МАСТ-6).

var _crHpMode = "avg";
var _crLuResult = null; // { id, level, lines } — итог последнего повышения

function _crTargetLevel(char) { return Math.max(1, Math.min(20, char._wizLevel || 1)); }

function _crLevelPending() {
  return document.querySelectorAll("#cr-lu .lu-choice-block:not(.done):not(.lu-choice-spells)").length;
}

function _crValidLevels(char) {
  return (char.level || 1) >= _crTargetLevel(char) && !_crLevelPending();
}

function _crRenderLevels(char) {
  if (_crTargetLevel(char) <= 1) return '<p class="cr-hint">Стартовый уровень — 1-й: повышений нет.</p>';
  return '<p class="cr-hint">Герой собран на&nbsp;1-м уровне. Дальше — повышения по&nbsp;одному, как кнопкой «Повысить» на&nbsp;листе, с&nbsp;выборами каждого уровня. Заклинания — на&nbsp;следующем шаге.</p>' +
    _crSeg("Хиты за уровень", [["avg", "Среднее"], ["roll", "Бросок"]], _crHpMode, "creatorHpMode") +
    '<div class="cr-group-title" id="cr-lu-title"></div><div id="cr-lu-result"></div><div id="cr-lu"></div>' +
    '<div class="list-row cr-row"><button type="button" class="hp-act" id="cr-lu-up" onclick="creatorLevelUp()"></button></div>';
}

function _crAfterLevels(char) {
  var lvl = char.level || 1;
  if (_crTargetLevel(char) <= 1) return;
  if (lvl > 1) {
    // после перезагрузки контекста повышения нет — собираем по текущему уровню
    if (!_luChoicesCtx || _luChoicesCtx.newTotalLevel !== lvl || _luChoicesCtx.className !== char.class) {
      _luChoicesCtx = { newTotalLevel: lvl, className: char.class, classLevel: lvl, subclassName: char.subclass || "", resultLines: [] };
    }
    $("lu-screen-choices").style.display = "";
    _crMount($("lu-choices-body"), $("cr-lu"));
    luBuildChoicesScreen();
  }
  creatorLevelsSync();
}

/** Заголовок, итог повышения и кнопка шага; зовётся и из luBuildChoicesScreen после выборов. */
function creatorLevelsSync() {
  var char = _crChar(), btn = $("cr-lu-up");
  if (!char || !btn || char.id !== currentId) return;
  var target = _crTargetLevel(char), lvl = char.level || 1, left = _crLevelPending();
  $("cr-lu-title").textContent = lvl >= target ? "Уровень " + lvl + " — стартовый уровень достигнут" : "Уровень " + lvl + " из " + target;
  var res = _crLuResult && _crLuResult.id === char.id && _crLuResult.level === lvl ? _crLuResult.lines : [];
  $("cr-lu-result").innerHTML = res.map(function(l) { return '<div class="lu-result-line">' + l + '</div>'; }).join("");
  btn.style.display = lvl < target ? "" : "none";
  btn.disabled = left > 0;
  btn.textContent = left ? "Сначала выборы этого уровня" : "Повысить до " + (lvl + 1) + " уровня →";
  _crSyncNext();
}

function creatorHpMode(m) { _crHpMode = m === "roll" ? "roll" : "avg"; creatorRender(); }

function creatorLevelUp() {
  var char = _crChar();
  if (!char || char.id !== currentId || (char.level || 1) >= _crTargetLevel(char) || _crLevelPending()) return;
  _luMulticlassChoice = null;
  confirmLevelUp();
  char = _crChar();
  var lines = (_luChoicesCtx && _luChoicesCtx.resultLines || []).slice();
  if (_crHpMode === "roll") lines[0] = _crRollLevelHp(char, _luChoicesCtx ? _luChoicesCtx.hpFrom : null);
  _crLuResult = { id: char.id, level: char.level, lines: lines };
  creatorRender();
}

/** Бросок кости хитов вместо среднего: разница уходит в ручной максимум (как правка ХП на листе). */
function _crRollLevelHp(char, hpFrom) {
  var die = edData(char).CLASS_HIT_DICE[char.class] || 8;
  var roll = Math.floor(Math.random() * die) + 1;
  var avg = Math.floor(die / 2) + 1;
  var manual = parseInt(char.combat.hpMaxManual, 10);
  char.combat.hpMaxManual = (manual > 0 ? manual : rulesMaxHPBase(char, getMod(char.stats.con))) + roll - avg;
  recalculateHP();
  return dndIcoHtml("heart", 13) + " ХП: " + (hpFrom != null ? hpFrom + " → " : "") + char.combat.hpMax + " (бросок к" + die + ": " + roll + ", среднее было бы " + avg + ")";
}

// ── Шаг 8: заклинания ───────────────────────────
// Лимиты — те же функции, что у счётчика вкладки «Заклинания», на уровне после шага «Уровни».
// Добавление — экран поиска заклинаний (openSpellSearch), подготовка — toggleSpellPrepared.
// Заклинания от вида, черт и подкласса (grantedBy, заклинания подкласса) в лимиты не входят.

/** Строки лимитов: [{ id, label, have, need }]; пусто — классу на этом уровне выбирать нечего. */
function _crSpellRows(char) {
  var own = ((char.spells && char.spells.mySpells) || []).filter(function(s) { return s && !s.grantedBy; });
  var rows = [];
  var cMax = calcMaxCantrips(char);
  if (cMax) rows.push({ id: "cantrips", label: "Заговоры", have: own.filter(function(s) { return !(s.level > 0); }).length, need: cMax });
  var kMax = calcMaxKnownSpells(char);
  if (kMax) rows.push({ id: "known", label: "Известные заклинания", have: _knownSpellCount(char), need: kMax });
  if (char.class === "Волшебник") {
    var sub = _subclassSpellNames(char);
    rows.push({ id: "book", label: "Книга заклинаний", need: 6 + 2 * ((char.level || 1) - 1),
      have: own.filter(function(s) { return s.level > 0 && !sub[s.name]; }).length });
  }
  var pMax = calcMaxPrepared(char);
  if (pMax) rows.push({ id: "prepared", label: "Подготовленные", have: _preparedCount(char), need: pMax });
  return rows;
}

function _crSpellRow(char, id) {
  return _crSpellRows(char).filter(function(r) { return r.id === id; })[0] || null;
}

function _crValidSpells(char) {
  return _crSpellRows(char).every(function(r) { return r.have === r.need; });
}

/** Есть ли место ещё для одного заклинания 1+ круга в списке (известные, книга или список подготовки). */
function _crListRoom(char) {
  var r = _crSpellRow(char, "known") || _crSpellRow(char, "book");
  if (r) return r.have < r.need;
  var p = _crSpellRow(char, "prepared");
  if (!p) return true;
  var n = (char.spells.mySpells || []).filter(function(s) { return spellNeedsPrep(char, s); }).length;
  return n < p.need;
}

/** Заклинания билда до текущего уровня: стартовые + советы повышений 2…N. */
function _crBuildSpells(char) {
  var b = char.buildId && window.getBuildById ? window.getBuildById(char.buildId) : null;
  if (!b) return [];
  var out = [], seen = {};
  function push(sp) { if (sp && sp.id != null && !seen[sp.id]) { seen[sp.id] = 1; out.push(sp); } }
  var ss = b.startingSpells || {};
  ["cantrips", "known", "prepared"].forEach(function(k) {
    (ss[k] || []).forEach(function(n) { push(typeof n === "object" ? n : window.resolveSpellByName && window.resolveSpellByName(n, b.edition)); });
  });
  for (var lv = 2; lv <= (char.level || 1); lv++) getBuildRecSpellObjs(b, lv).forEach(push);
  var cap = _charMaxCastableLevel(char);
  return out.filter(function(sp) { return !(sp.level > cap); });
}

function _crHasSpell(char, sp) {
  return (char.spells.mySpells || []).some(function(x) { return x.id === sp.id || x.name === sp.name; });
}

function _crRenderSpells(char) {
  var rows = _crSpellRows(char), cap = _charMaxCastableLevel(char), lvl = char.level || 1;
  if (!rows.length && !cap) {
    return '<p class="cr-hint">На&nbsp;' + lvl + '-м уровне у&nbsp;класса «' + escapeHtml(char.class || "") + '» своих заклинаний нет — шаг можно пропустить. Заклинания от&nbsp;вида и&nbsp;черт уже на&nbsp;листе.</p>';
  }
  var html = '<p class="cr-hint">Заклинания по&nbsp;таблице класса на&nbsp;' + lvl + '-м уровне' + (cap ? ', доступны круги до&nbsp;' + cap + '-го' : '') +
    '. Заклинания от&nbsp;вида, черт и&nbsp;подкласса в&nbsp;счёт не&nbsp;идут.</p>';
  if (rows.length) {
    html += '<div class="pg-grp">' + (_crValidSpells(char) ? "Всё выбрано" : "Осталось выбрать") + '</div><div class="hp-rows">' + rows.map(function(r) {
      var full = r.have >= r.need, over = r.have > r.need;
      var go = over || r.id === "prepared" ? "_crGoTo('cr-sp-list')" : "creatorOpenSpells()";
      return _pgAttn(escapeHtml(r.label) + ' <u>· ' + r.have + '/' + r.need + (over ? " · лишних " + (r.have - r.need) : full ? " ✓" : "") + '</u>', over ? "Убрать ↓" : full ? "Изменить →" : r.id === "prepared" ? "Отметить ↓" : "Выбрать →", go);
    }).join("") + '</div>';
  }
  var rec = _crBuildSpells(char), recLeft = rec.filter(function(sp) { return !_crHasSpell(char, sp); });
  if (rec.length) {
    html += '<div class="cr-group-title">Советы билда</div><p class="cr-hint">' + escapeHtml(rec.map(function(s) { return s.name; }).join(", ")) + '</p>' +
      '<div class="list-row cr-row"><button type="button" class="btn btn-primary cr-rec-btn" onclick="creatorAddBuildSpells()"' + (recLeft.length ? "" : " disabled") + '>' +
      (recLeft.length ? "Взять советы билда (" + recLeft.length + ")" : "Советы билда добавлены") + '</button></div>';
  }
  html += '<div class="list-row cr-row"><button type="button" class="btn btn-secondary cr-rec-btn" onclick="creatorOpenSpells()">Выбрать из&nbsp;списка класса →</button></div>';
  return html + _crRenderMySpells(char);
}

/** Выбранные заклинания по кругам; у готовящих классов чип — переключатель подготовки. */
function _crRenderMySpells(char) {
  var my = (char.spells.mySpells || []).filter(function(s) { return s && !s.grantedBy; });
  if (!my.length) return "";
  var byLvl = {};
  my.forEach(function(s) { var l = s.level || 0; (byLvl[l] = byLvl[l] || []).push(s); });
  var html = '<div id="cr-sp-list"><div class="pg-grp">Вы выбрали</div>', over = _crSpellRows(char).some(function(r) { return r.have > r.need; });
  if (over) html += '<p class="cr-hint">Выбрано больше, чем позволяет класс: уберите лишние.</p>';
  Object.keys(byLvl).sort(function(a, b) { return a - b; }).forEach(function(l) {
    html += '<div class="cr-group-title">' + (l === "0" ? "Заговоры" : l + "-й круг") + '</div><div class="hp-rows">';
    byLvl[l].forEach(function(s) {
      var id = escapeHtml(String(s.id)), prep = spellNeedsPrep(char, s), on = prep && isSpellPrepared(char, s.id);
      var meta = [s.school, s.time, s.range].filter(Boolean).map(escapeHtml).join(" · ");
      html += '<div class="list-row cr-sp-row"><div class="cr-sp-main"><span class="cr-sp-name">' + escapeHtml(s.name) + '</span>' +
        (meta ? '<span class="cr-sp-meta">' + meta + '</span>' : "") + '</div>' +
        (prep ? '<button type="button" class="hp-act' + (on ? " cr-sp-on" : "") + '" data-v="' + id + '" onclick="creatorToggleSpellPrep(this.dataset.v)">' + (on ? "◆ Подготовлено" : "◇ Подготовить") + '</button>' : "") +
        '<button type="button" class="hp-act cr-sp-del" aria-label="Убрать ' + escapeHtml(s.name) + '" data-v="' + id + '" onclick="creatorRemoveSpell(this.dataset.v)">Убрать</button></div>';
    });
    html += '</div>';
  });
  return html + '</div>';
}

function creatorRemoveSpell(id) {
  var char = _crChar();
  if (!char || char.id !== currentId) return;
  var sp = (char.spells.mySpells || []).filter(function(s) { return String(s.id) === id; })[0];
  if (!sp) return;
  removeSpell(sp.id);
  creatorRender();
}

function creatorOpenSpells() {
  if (typeof openSpellSearch === "function") openSpellSearch();
}

function creatorToggleSpellPrep(id) {
  var char = _crChar();
  if (!char || char.id !== currentId) return;
  var sp = (char.spells.mySpells || []).filter(function(s) { return String(s.id) === id; })[0];
  if (!sp) return;
  toggleSpellPrepared(sp.id);
  creatorRender();
}

/** Добавить советы билда в пределах лимитов; заклинания с подготовкой — сразу подготовленными, пока есть место. */
function creatorAddBuildSpells() {
  var char = _crChar();
  if (!char || char.id !== currentId) return;
  if (!Array.isArray(char.spells.mySpells)) char.spells.mySpells = [];
  if (!Array.isArray(char.spells.prepared)) char.spells.prepared = [];
  var added = [];
  _crBuildSpells(char).forEach(function(sp) {
    if (_crHasSpell(char, sp)) return;
    var c = _crSpellRow(char, "cantrips");
    if (sp.level > 0 ? !_crListRoom(char) : !c || c.have >= c.need) return;
    char.spells.mySpells.push(sp);
    added.push(sp.name);
    var p = _crSpellRow(char, "prepared");
    if (spellNeedsPrep(char, sp) && p && p.have < p.need && char.spells.prepared.indexOf(sp.id) === -1) char.spells.prepared.push(sp.id);
  });
  saveToLocal();
  if (typeof renderMySpells === "function") renderMySpells();
  if (typeof renderPrepCounter === "function") renderPrepCounter();
  showToast(added.length ? "Добавлены заклинания: " + added.join(", ") : "Места под советы билда нет — лимиты заполнены", added.length ? "success" : "info");
  creatorRender();
}

// ── Шаг 9: снаряжение ───────────────────────────
// Блоки выдачи — те же, что на листе (start-equip-2014.js, предыстория 2024 — giveBackgroundEquipment);
// после выдачи лист перерисовывает панели, а renderCreationTodo зовёт creatorGearSync.

function _crGearTodo(char) {
  return _creationTodo(char).filter(function(r) { return _CR_LATER.test(r[2]); });
}

function _crValidGear(char) { return !_crGearTodo(char).length; }

function _crRenderGear() {
  return '<p class="cr-hint">Набор класса и&nbsp;предыстории или&nbsp;золото вместо них. Выданное сразу попадает в&nbsp;«Сумку» и&nbsp;оружие на&nbsp;«Бою», доспех — в&nbsp;КД.</p>' +
    '<div id="cr-gear-todo"></div><div id="cr-gear" class="race-extras-panel" style="display:flex"></div>';
}

/** Блоки выдачи и «Осталось выдать»; зовётся из renderCreationTodo после любой выдачи. */
function creatorGearSync() {
  var char = _crChar(), box = $("cr-gear");
  if (!char || !box || char.id !== currentId) return;
  var html = char.edition === "2024"
    ? (typeof renderClassEquip24 === "function" ? renderClassEquip24(char) : "") + _crBgEquip24(char)
    : (typeof renderClassEquip14 === "function" ? renderClassEquip14(char) : "") + (typeof renderBgEquip14 === "function" ? renderBgEquip14(char) : "");
  box.innerHTML = html || '<span class="race-extras-hint">Стартового снаряжения для&nbsp;этого класса и&nbsp;предыстории нет — вещи добавляются в&nbsp;«Сумке».</span>';
  var left = _crGearTodo(char);
  $("cr-gear-todo").innerHTML = '<div class="pg-grp">' + (left.length ? "Осталось выдать" : "Всё выдано") + '</div>' +
    (left.length ? '<div class="hp-rows">' + left.map(function(r) { return _pgAttn(r[0], "Ниже ↓", "_crGoTo('cr-gear')"); }).join("") + '</div>' : "");
  _crSyncNext();
}

/** 2024: снаряжение предыстории — вариант А (набор + зм) или Б (только зм), как в панели предыстории. */
function _crBgEquip24(char) {
  var def = typeof getBackgroundDef === "function" ? getBackgroundDef(char) : null;
  if (!def || !def.equipment || def.custom) return "";
  var eq = def.equipment;
  var html = '<div class="race-extras-title">' + dndIcoHtml("box", 14) + ' Снаряжение предыстории: ' + escapeHtml(char.background) + '</div><div class="race-extras-row">';
  if (char.bgEquipGiven) return html + '<span class="btn btn-text btn-sm race-extras-btn done">' + dndIcoHtml("check", 13) + ' Снаряжение выдано</span></div>';
  var listA = (eq.a || []).map(function(it) { return it.name + ((it.qty || 1) > 1 ? " ×" + it.qty : ""); }).concat(eq.aGold ? [eq.aGold + " зм"] : []).join(", ");
  return html + '<button class="btn btn-text btn-sm race-extras-btn" onclick="giveBackgroundEquipment(\'a\')">Вариант А: ' + escapeHtml(listA) + '</button>' +
    '<button class="btn btn-text btn-sm race-extras-btn" onclick="giveBackgroundEquipment(\'b\')">Вариант Б: ' + (eq.bGold || 50) + ' зм</button></div>';
}

// ── Шаг 10: личность ────────────────────────────
// Мировоззрение и божество — поля листа; тексты — notesV2.sections, как во вкладке «Предыстория».
// Генератор — notesGenerate (без билда) или варианты билда (notesRegenerateAll).

var _CR_PERSONA = [
  ["personality", "Черты характера", 3], ["ideals", "Идеалы", 2], ["bonds", "Привязанности", 2],
  ["flaws", "Слабости", 2], ["appearance", "Внешность", 3], ["backstory", "Предыстория", 6]
];

function _crRenderPersona(char) {
  var secs = (char.notesV2 && char.notesV2.sections) || {};
  var html = '<p class="cr-hint">Шаг необязательный: всё правится позже на&nbsp;листе и&nbsp;во&nbsp;вкладке «Предыстория». Генератор подберёт тексты по&nbsp;расе, классу и&nbsp;предыстории.</p>' +
    '<div class="cr-group-title">Мировоззрение</div><div class="race-extras-row cr-chips">' +
    _crSelectOptions("char-alignment").map(function(o) { return _crChip(o.value, escapeHtml(o.text), char.alignment === o.value, "creatorSetAlign"); }).join("") + '</div>' +
    '<div class="cr-field"><label for="cr-deity">Божество</label>' +
      '<input type="text" id="cr-deity" class="field" list="deity-datalist" autocomplete="off" placeholder="Необязательно — например, Мистра" value="' + escapeHtml(char.deity || "") + '" oninput="creatorSetDeity(this.value)"></div>' +
    '<div class="list-row cr-row"><button type="button" class="hp-act" onclick="creatorPersonaGen()">' + dndIcoHtml("dice", 14) + ' Сгенерировать тексты →</button></div>';
  _CR_PERSONA.forEach(function(p) {
    var more = _getSectionVariants(char, p[0]).length > 1;
    html += '<div class="cr-field"><div class="cr-field-head"><label for="cr-ps-' + p[0] + '">' + p[1] + '</label>' +
      (more ? '<button type="button" class="hp-act" onclick="creatorPersonaVariant(\'' + p[0] + '\')">Другой вариант</button>' : "") + '</div>' +
      '<textarea id="cr-ps-' + p[0] + '" class="field" rows="' + p[2] + '" data-section="' + p[0] + '" oninput="notesUpdateSection(this)">' + escapeHtml(secs[p[0]] || "") + '</textarea></div>';
  });
  return html;
}

function creatorSetAlign(v) {
  var char = _crChar();
  if (!char) return;
  _crSetField("char-alignment", char.alignment === v ? "" : v, true);
  creatorRender();
}

function creatorSetDeity(v) { _crSetField("char-deity", v); }

function creatorPersonaGen() {
  var char = _crChar();
  if (!char || char.id !== currentId) return;
  // без билда генератор асинхронный — мастер перерисует хук creatorRefresh в notesGenerate
  if (_notesHasBuildVariants(char)) { notesRegenerateAll(); creatorRender(); } else notesGenerate();
}

function creatorPersonaVariant(key) {
  var char = _crChar();
  if (!char || char.id !== currentId) return;
  var arr = _getSectionVariants(char, key);
  if (!arr.length) return;
  var secs = char.notesV2.sections = char.notesV2.sections || {};
  var cur = secs[key] || "";
  var pool = arr.filter(function(v) { return v !== cur; });
  if (!pool.length) pool = arr;
  function put(text) {
    secs[key] = text;
    saveToLocal();
    var ta = $("cr-ps-" + key);
    if (ta) ta.value = text;
  }
  put(pool[Math.floor(Math.random() * pool.length)]);
  if (cur.trim() && arr.indexOf(cur) === -1) showToast("Текст заменён вариантом", "info", { label: "Вернуть", onClick: function() { if (_crChar() === char) put(cur); } });
}

// ── Шаг 11: итог ────────────────────────────────
// Сводка и что осталось; «Персонаж готов» — тот же lockSheet, что кнопка на листе.

function _crRenderSummary(char) {
  var row = function(k, v) { return '<div class="hp-row list-row hp-row--static cr-sum-row"><span class="cr-sum-k">' + k + '</span><span class="cr-sum-v">' + (v || "—") + '</span></div>'; };
  var stats = ["str", "dex", "con", "int", "wis", "cha"].map(function(k) {
    var v = char.stats[k], m = getMod(v);
    return _CR_STAT_SHORT[k] + "&nbsp;" + v + "&nbsp;(" + (m >= 0 ? "+" : "−") + Math.abs(m) + ")";
  }).join(" · ");
  var spells = ((char.spells && char.spells.mySpells) || []).length;
  var inv = char.inventory || {}, items = 0;
  Object.keys(inv).forEach(function(k) { if (Array.isArray(inv[k])) items += inv[k].length; });
  var html = '<div class="cr-picked"><div class="cr-picked-title">' + escapeHtml(char.name || "") + '</div>' +
    '<p class="cr-picked-text">' + escapeHtml([char.race, char.class + (char.subclass ? " (" + char.subclass + ")" : ""), (char.level || 1) + "-й уровень"].filter(Boolean).join(" · ")) + '</p></div>' +
    '<div class="hp-rows">' +
      row("Редакция", char.edition === "2024" ? "2024" : "2014") +
      row("Предыстория", escapeHtml(char.background || "")) +
      row("Мировоззрение", escapeHtml(char.alignment || "")) +
      row("Хиты · КД", (char.combat.hpMax || 0) + " · " + (char.combat.ac || 10)) +
      row("Характеристики", stats) +
      row("Заклинания · вещи", spells + " · " + items) +
    '</div>';
  var left = _crSummaryTodo(char);
  html += '<div class="pg-grp">' + (left.length ? "Осталось" : "Всё заполнено") + '</div>';
  if (left.length) html += '<div class="hp-rows">' + left.map(function(r) { return _pgAttn(escapeHtml(r[0]), "К&nbsp;шагу →", "_crGoStep('" + r[1] + "')"); }).join("") + '</div>';
  return html + '<p class="cr-hint">«Персонаж готов» зафиксирует лист, как одноимённая кнопка на&nbsp;листе: характеристики, владения, заклинания и&nbsp;черты откроются при&nbsp;повышении уровня или&nbsp;по&nbsp;кнопке «Изменить».</p>';
}

/** Что не заполнено: [текст, id шага]. */
function _crSummaryTodo(char) {
  var out = _creationTodo(char).map(function(r) { return [r[2], _CR_LATER.test(r[2]) ? "gear" : "choices"]; });
  if (!_crValidLevels(char)) out.push(["Повышения до " + _crTargetLevel(char) + "-го уровня", "levels"]);
  if (!_crValidSpells(char)) out.push(["Заклинания по лимитам класса", "spells"]);
  var secs = (char.notesV2 && char.notesV2.sections) || {};
  var empty = _CR_PERSONA.filter(function(p) { return !(secs[p[0]] || "").trim(); }).map(function(p) { return p[1].toLowerCase(); });
  if (!char.alignment) empty.unshift("мировоззрение");
  if (empty.length) out.push(["Личность (необязательно): " + empty.join(", "), "persona"]);
  return out;
}

function _crGoStep(id) {
  var char = _crChar();
  if (!char) return;
  char._wizStep = id;
  saveToLocal();
  creatorRender();
  try { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); } catch (e) {}
}
