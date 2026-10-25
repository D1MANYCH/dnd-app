// ============================================
// МАСТ: пошаговый мастер создания персонажа
// ============================================
// Экран поверх листа (как «Повышение уровня»): лист загружен под ним, и мастер
// пишет в персонажа через поля листа и их же обработчики — логику не дублируем.
// Текущий шаг хранится в char._wizStep (id шага): выход и возврат помнят место.
// Стартовый уровень — char._wizLevel; повышения до него — шаг «Уровни».

var CREATOR_STEPS = [
  { id: "base",       title: "Основа",          render: _crRenderBase, valid: _crValidBase },
  { id: "race",       title: "Раса",            render: _crRenderRace, valid: _crValidRace },
  { id: "class",      title: "Класс",           render: _crRenderClass, valid: _crValidClass },
  { id: "background", title: "Предыстория",     render: _crRenderBg, valid: _crValidBg },
  { id: "abilities",  title: "Характеристики",  render: _crRenderAbil, after: _crAfterAbil, valid: _crValidAbil, leave: _crLeaveAbil },
  { id: "choices",    title: "Выборы",          render: _crRenderChoices, after: _crAfterChoices, valid: _crValidChoices },
  { id: "levels",     title: "Уровни",          render: _crRenderLevels, after: _crAfterLevels, valid: _crValidLevels },
  { id: "spells",     title: "Заклинания" },
  { id: "gear",       title: "Снаряжение" },
  { id: "persona",    title: "Личность" },
  { id: "summary",    title: "Итог" }
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
  $("cr-next").textContent = idx === CREATOR_STEPS.length - 1 ? "Готово" : "Далее";
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
  if (idx < 0) return;
  if (idx >= CREATOR_STEPS.length) { _crLeaveToSheet(); return; }
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
