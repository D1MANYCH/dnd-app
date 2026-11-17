// ============================================================
// app-wiki.js — «Справочник» (ВИКИ-1): экран #screen-wiki.
// Хаб разделов, общий поиск и ссылки на готовые каталоги. Работает и без
// персонажа. Разделы ВИКИ-2…4 (классы, расы, черты, правила) регистрируются
// через wikiRegister и сразу попадают в хаб и поиск.
// ============================================================

// Группы хаба в порядке показа.
var WIKI_GROUPS = [
  { id: "dnd", title: "Правила D&D" },
  { id: "cat", title: "Каталоги" },
  { id: "app", title: "Приложение" }
];

// Встроенные строки хаба. open — вызов существующего экрана.
var WIKI_BUILTIN = [
  { group: "dnd", title: "Что такое D&D", hint: "игра, роли, кубики", open: function () { openHelp("about"); } },
  { group: "dnd", title: "Планы бытия", hint: "космология мультивселенной", open: function () { openHelp("planes"); } },
  { group: "dnd", title: "Редакция 2024", hint: "чем отличается от 2014", open: function () { openHelp("edition2024"); } },
  { group: "cat", title: "Заклинания", hint: "класс · уровень · школа", open: function () { openSpellSearch(); } },
  { group: "cat", title: "Бестиарий", hint: "монстры и НИП", open: function () { openSrdMonsterPicker(); } },
  { group: "cat", title: "Вес и слоты", hint: "переносимый вес, ячейки", open: function () { openItemRef(); } },
  { group: "cat", title: "Шпаргалка мастера", hint: "состояния · бой · мир", open: function () { openDmRef(); } }
];

// Разделы справки приложения, которые уже стоят в группе «Правила D&D».
var WIKI_HELP_SKIP = { about: 1, planes: 1, edition2024: 1 };

// Разделы следующих фаз: { group, title, hint, open, search(q) → [{title, hint, open}], edition }.
var WIKI_SECTIONS = [];
var _wikiEdition = null;   // выбранная на экране редакция; null — как у персонажа
var _wikiActs = [];        // действия строк текущей отрисовки

function wikiRegister(sec) { WIKI_SECTIONS.push(sec); }

/** Редакция справочника: выбранная на экране, иначе персонажа, иначе 2014. */
function wikiEdition() {
  if (_wikiEdition) return _wikiEdition;
  var c = typeof getCurrentChar === "function" ? getCurrentChar() : null;
  return (c && c.edition) || "2014";
}

/** Таблицы выбранной редакции (для разделов ВИКИ-2…4). */
function wikiEdData() { return edData({ edition: wikiEdition() }); }

function setWikiEdition(ed) {
  _wikiEdition = ed;
  _wikiLoreEnsure(renderWiki);
}

function openWiki() {
  if (typeof _closeOpenModals === "function") _closeOpenModals();
  showScreen("wiki");
  var inp = document.getElementById("wiki-search");
  if (inp) inp.value = "";
  renderWiki();
}

function _wikiNorm(s) { return String(s || "").toLowerCase().replace(/ё/g, "е").replace(/\u00a0/g, " "); }

// Разделы справки приложения прямо из разметки #screen-help.
function _wikiHelpTabs() {
  var out = [];
  document.querySelectorAll("#screen-help .help-tab").forEach(function (b) {
    var m = (b.getAttribute("onclick") || "").match(/switchHelpSection\('(\w+)'/);
    if (!m) return;
    var c = b.cloneNode(true);
    c.querySelectorAll("[data-ico]").forEach(function (x) { x.remove(); });
    var label = c.textContent.replace(/\u00a0/g, " ").trim();
    out.push({ key: m[1], title: label });
  });
  return out;
}

// Блоки справки, где встречается запрос: заголовок или текст.
function _wikiHelpHits(q) {
  var out = [];
  var tabs = {};
  _wikiHelpTabs().forEach(function (t) { tabs[t.key] = t.title; });
  document.querySelectorAll("#screen-help .help-section").forEach(function (sec) {
    var key = sec.id.replace(/^help-/, "");
    sec.querySelectorAll(".help-block").forEach(function (blk) {
      var tEl = blk.querySelector(".help-block-title");
      var title = tEl ? tEl.textContent.trim() : "";
      if (_wikiNorm(blk.textContent).indexOf(q) < 0) return;
      out.push({ title: title || tabs[key] || "Справка", hint: "Справка · " + (tabs[key] || key), open: function () {
        openHelp(key);
        setTimeout(function () { if (blk.scrollIntoView) blk.scrollIntoView({ block: "start" }); }, 60);
      } });
    });
  });
  return out;
}

// ВИКИ-6: из раздела справки — в нужную статью справочника.
// Развитие → страница класса персонажа, Бой → состояния, остальные → хаб.
function wikiUpdateHelpLink(section) {
  var row = document.getElementById("help-wiki-row");
  if (!row) return;
  var label = "Справочник", act = "openWiki()";
  if (section === "progress") {
    var c = typeof getCurrentChar === "function" ? getCurrentChar() : null;
    var pairs = c && typeof getCharClassPairs === "function" ? getCharClassPairs(c) : [];
    var cls = pairs.length ? pairs[0].cls : "";
    if (cls && _wikiClassNames().indexOf(cls) >= 0) {
      label = "Класс «" + cls + "» в справочнике";
      act = "openWikiClass(" + JSON.stringify(cls).replace(/"/g, "&quot;") + ")";
    } else { label = "Классы в справочнике"; act = "openWikiClasses()"; }
  } else if (section === "battle") {
    label = "Состояния в справочнике"; act = "openWikiLore('cond')";
  } else if (!{ about: 1, start: 1, sheet: 1, spells: 1, inventory: 1, notes: 1, party: 1, journal: 1 }[section]) {
    row.innerHTML = ""; return;
  }
  row.innerHTML = '<button type="button" class="tab-help-btn tab-help-btn--text" onclick="' + act + '">' + escapeHtml(label) + '</button>';
}
function openWikiLore(kind) { _wikiLoreOpen(kind); }

function _wikiRow(item) {
  var i = _wikiActs.push(item.open) - 1;
  return '<li class="home-menu-row"><button type="button" class="home-menu-item list-row" onclick="_wikiGo(' + i + ')">' +
    '<span class="home-bullet" aria-hidden="true"></span>' +
    '<span class="home-menu-label">' + escapeHtml(item.title) + '</span>' +
    (item.hint ? '<span class="home-menu-hint">' + escapeHtml(item.hint) + '</span>' : '') +
    '</button></li>';
}

function _wikiGo(i) { var f = _wikiActs[i]; if (f) f(); }

function _wikiHubItems() {
  var items = WIKI_SECTIONS.concat(WIKI_BUILTIN);
  _wikiHelpTabs().forEach(function (t) {
    if (WIKI_HELP_SKIP[t.key]) return;
    items.push({ group: "app", title: t.title, open: function () { openHelp(t.key); } });
  });
  return items;
}

function renderWiki() {
  var body = document.getElementById("wiki-body");
  if (!body) return;
  _wikiActs = [];
  var edRow = document.getElementById("wiki-edition-row");
  if (edRow) {
    edRow.hidden = !WIKI_SECTIONS.some(function (s) { return s.edition; });
    var ed = wikiEdition();
    edRow.querySelectorAll("[data-ed]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-ed") === ed); });
  }
  var inp = document.getElementById("wiki-search");
  var q = _wikiNorm(inp ? inp.value : "").trim();
  var items = _wikiHubItems();
  var html = "";
  if (!q) {
    WIKI_GROUPS.forEach(function (g) {
      var rows = items.filter(function (it) { return it.group === g.id; });
      if (!rows.length) return;
      html += '<h3 class="books-group-title">' + escapeHtml(g.title) + '</h3><ul class="home-menu-list">' + rows.map(_wikiRow).join("") + '</ul>';
    });
  } else {
    var hits = items.filter(function (it) { return _wikiNorm(it.title + " " + (it.hint || "")).indexOf(q) >= 0; });
    WIKI_SECTIONS.forEach(function (s) { if (typeof s.search === "function") hits = hits.concat(s.search(q) || []); });
    hits = hits.concat(_wikiHelpHits(q)).slice(0, 60);
    html = hits.length
      ? '<ul class="home-menu-list">' + hits.map(_wikiRow).join("") + '</ul>'
      : '<p class="home-menu-hint">Ничего не нашлось.</p>';
  }
  body.innerHTML = html;
}

// ============================================================
// ВИКИ-2 — классы: список и страница класса (экран #screen-wikiclass).
// Таблицы берутся через wikiEdData(); книги не скрываются, у каждой записи
// стоит пометка источника.
// ============================================================
var _wikiClass = null;     // имя открытого класса; null — список классов
var _wikiClassActs = [];

var WIKI_STAT_RU = { str: "СИЛ", dex: "ЛОВ", con: "ТЕЛ", int: "ИНТ", wis: "МДР", cha: "ХАР" };
var WIKI_ARMOR_RU = { light: "лёгкие доспехи", medium: "средние доспехи", heavy: "тяжёлые доспехи", shield: "щиты" };
var WIKI_WEAPON_RU = { simple: "простое оружие", martial: "воинское оружие" };

function _wikiClassNames() {
  var ed = wikiEdData();
  var is24 = wikiEdition() === "2024";
  return Object.keys(ed.CLASS_HIT_DICE || {}).filter(function (c) {
    return ed.CLASS_FEATURES[c] && !(is24 && typeof CLASS_SOURCE !== "undefined" && CLASS_SOURCE[c]);
  });
}

function _wikiClassSource(cls) {
  var code = (typeof CLASS_SOURCE !== "undefined" && CLASS_SOURCE[cls]) || (wikiEdition() === "2024" ? "PH24" : "PHB");
  var l = SOURCE_LABELS[code];
  return l ? l.short : code;
}

function _wikiProfList(p) {
  if (!p) return "";
  var out = [];
  (p.armor || []).forEach(function (k) { out.push(WIKI_ARMOR_RU[k] || k); });
  (p.weapon || []).forEach(function (k) { out.push(WIKI_WEAPON_RU[k] || k); });
  (p.specific || []).forEach(function (k) { out.push(k); });
  return out.join(", ");
}

function _wikiToolsText(t) {
  if (!t) return "";
  var out = (t.fixed || []).slice();
  (t.choices || []).forEach(function (c) { out.push(c.label); });
  return out.join(", ");
}

function openWikiClasses() {
  _wikiClass = null;
  showScreen("wikiclass");
  _wikiLoreEnsure(renderWikiClass);
}

function openWikiClass(cls) {
  _wikiClass = cls;
  showScreen("wikiclass");
  _wikiLoreEnsure(function () {
    renderWikiClass();
    var st = document.getElementById("screen-wikiclass");
    if (st) st.scrollTop = 0;
  });
}

function wikiClassBack() {
  if (_wikiClass) { _wikiClass = null; renderWikiClass(); } else screenBack();
}

function setWikiClassEdition(ed) {
  _wikiEdition = ed;
  _wikiLoreEnsure(function () {
    if (_wikiClass && _wikiClassNames().indexOf(_wikiClass) < 0) _wikiClass = null;
    renderWikiClass();
  });
}

function _wikiCRow(label, hint, act) {
  var i = _wikiClassActs.push(act) - 1;
  return '<li class="home-menu-row"><button type="button" class="home-menu-item list-row" onclick="_wikiCGo(' + i + ')">' +
    '<span class="home-bullet" aria-hidden="true"></span>' +
    '<span class="home-menu-label">' + escapeHtml(label) + '</span>' +
    (hint ? '<span class="home-menu-hint">' + escapeHtml(hint) + '</span>' : '') + '</button></li>';
}

function _wikiCGo(i) { var f = _wikiClassActs[i]; if (f) f(); }

function _wikiFact(label, text) {
  if (!text) return "";
  return '<li class="home-menu-row"><div class="home-menu-item list-row"><span class="home-bullet" aria-hidden="true"></span>' +
    '<span class="home-menu-label">' + escapeHtml(label) + '</span><span class="home-menu-hint">' + escapeHtml(text) + '</span></div></li>';
}

/** Умения по уровням: { уровень: [умения] } → строки; нажатие открывает «Об умении». */
function _wikiFeatureRows(table, cls, sub, ed) {
  var html = "";
  Object.keys(table || {}).map(Number).sort(function (a, b) { return a - b; }).forEach(function (lv) {
    (table[lv] || []).forEach(function (f) {
      if (!f || !f.name) return;
      html += _wikiCRow(f.name, lv + " ур.", function () { openFeatureInfo(cls, sub || "", lv, f.name, ed); });
    });
  });
  return html;
}

function renderWikiClass() {
  var body = document.getElementById("wikiclass-body");
  if (!body) return;
  _wikiClassActs = [];
  var ed = wikiEdition(), d = wikiEdData();
  var h = document.getElementById("wikiclass-title");
  var row = document.getElementById("wikiclass-edition-row");
  if (row) row.querySelectorAll("[data-ed]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-ed") === ed); });
  var html = "";
  if (!_wikiClass) {
    if (h) h.textContent = "Классы";
    html = '<ul class="home-menu-list">' + _wikiClassNames().map(function (c) {
      var subs = (d.SUBCLASSES[c] || []).length;
      return _wikiCRow(c, "к" + d.CLASS_HIT_DICE[c] + " · " + _wikiClassSource(c) + " · подклассов: " + subs, function () { openWikiClass(c); });
    }).join("") + '</ul>';
    body.innerHTML = html;
    return;
  }
  var cls = _wikiClass;
  if (h) h.textContent = cls;
  var saves = (CLASS_SAVE_PROFICIENCIES[cls] || []).map(function (s) { return WIKI_STAT_RU[s]; }).join(", ");
  var armor = d.CLASS_ARMOR_PROFS[cls] || {};
  var weapon = _wikiProfList({ weapon: armor.weapon, specific: d.CLASS_WEAPONS_SPECIFIC[cls] });
  var skills = d.CLASS_SKILL_OPTIONS[cls] || [];
  var nSk = (typeof CLASS_SKILL_COUNT !== "undefined" && CLASS_SKILL_COUNT[cls]) || 2;
  var skText = skills.length ? ("выберите " + nSk + ": " + skills.join(", ")) : "";
  var pre = d.MULTICLASS_PREREQUISITES[cls] || {};
  var preText = Object.keys(pre).map(function (k) { return WIKI_STAT_RU[k] + " " + pre[k]; }).join(", ");
  if (cls === "Воин") preText += " или ЛОВ 13";
  var mc = d.MULTICLASS_PROFICIENCIES[cls];
  var mcText = mc ? _wikiProfList(mc) : "";
  if (mc && mc.skills) mcText += (mcText ? ", " : "") + "навыков: " + mc.skills;
  var mcTools = mc ? _wikiToolsText(mc.tools) : "";
  if (mcTools) mcText += (mcText ? ", " : "") + mcTools;
  var res = ((d.CLASS_RESOURCES[cls] || {}).resources || []).map(function (r) { return r.name; }).join(", ");
  html += '<ul class="home-menu-list">' +
    _wikiFact("Источник", _wikiClassSource(cls)) +
    _wikiFact("Кость хитов", "к" + d.CLASS_HIT_DICE[cls]) +
    _wikiFact("Спасброски", saves) +
    _wikiFact("Доспехи", (armor.armor || []).map(function (k) { return WIKI_ARMOR_RU[k]; }).join(", ") || "нет") +
    _wikiFact("Оружие", weapon || "нет") +
    _wikiFact("Инструменты", _wikiToolsText((typeof CLASS_TOOLS !== "undefined" ? CLASS_TOOLS : {})[cls]) || "нет") +
    _wikiFact("Навыки", skText) +
    _wikiFact("Ресурсы", res) +
    _wikiFact("Мультикласс: требования", preText) +
    _wikiFact("Мультикласс: владения", mcText || "нет") +
    '</ul>';
  html += '<h3 class="books-group-title">Умения по уровням</h3><ul class="home-menu-list">' +
    _wikiFeatureRows(d.CLASS_FEATURES[cls], cls, "", ed) + '</ul>';
  var subs = d.SUBCLASSES[cls] || [];
  if (subs.length) {
    html += '<h3 class="books-group-title">Подклассы</h3>';
    subs.forEach(function (s) {
      var src = typeof subclassSourceShort === "function" ? subclassSourceShort(s, { edition: ed }) : "";
      var tbl = d.SUBCLASS_FEATURES[s];
      html += '<details class="wiki-sub"><summary class="home-menu-item list-row"><span class="home-bullet" aria-hidden="true"></span>' +
        '<span class="home-menu-label">' + escapeHtml(s) + '</span>' +
        (src ? '<span class="home-menu-hint">' + escapeHtml(src) + '</span>' : '') + '</summary>' +
        '<ul class="home-menu-list">' + (tbl ? _wikiFeatureRows(tbl, cls, s, ed) : '<li class="home-menu-hint">Умения не внесены.</li>') + '</ul></details>';
    });
  }
  body.innerHTML = html;
}

wikiRegister({
  group: "dnd", title: "Классы", hint: "умения, подклассы, владения", edition: true,
  open: openWikiClasses,
  search: function (q) {
    var d = wikiEdData(), out = [];
    _wikiClassNames().forEach(function (c) {
      if (_wikiNorm(c).indexOf(q) >= 0) out.push({ title: c, hint: "Классы", open: function () { openWikiClass(c); } });
      (d.SUBCLASSES[c] || []).forEach(function (s) {
        if (_wikiNorm(s).indexOf(q) >= 0) out.push({ title: s, hint: "Подкласс · " + c, open: function () { openWikiClass(c); } });
      });
      if (q.length < 3) return;
      var seen = {};
      Object.keys(d.CLASS_FEATURES[c] || {}).forEach(function (lv) {
        (d.CLASS_FEATURES[c][lv] || []).forEach(function (f) {
          if (f && f.name && !seen[f.name] && _wikiNorm(f.name).indexOf(q) >= 0) {
            seen[f.name] = 1;
            out.push({ title: f.name, hint: c + " · " + lv + " ур.", open: function () { openFeatureInfo(c, "", +lv, f.name, wikiEdition()); } });
          }
        });
      });
    });
    return out;
  }
});

// ============================================================
// ВИКИ-3 — расы, предыстории, черты (экран #screen-wikilore).
// Один экран на три раздела: список → страница записи.
// ============================================================
var _wikiLoreKind = null;  // "race" | "bg" | "feat"
var _wikiLoreKey = null;   // ключ открытой записи; null — список
var _wikiLoreActs = [];

var WIKI_LORE_TITLES = { race: "Расы", bg: "Предыстории", feat: "Черты", cond: "Состояния", gloss: "Глоссарий", abil: "Характеристики", opt: "Классовые опции" };
var WIKI_FEAT_CAT = { origin: "происхождение", general: "общая", style: "боевой стиль", epic: "эпический дар" };

function _wikiSrcLabel(code) {
  var l = typeof SOURCE_LABELS !== "undefined" ? SOURCE_LABELS[code] : null;
  return l ? l.short : code;
}

function _wikiLoreList() {
  var d = wikiEdData();
  if (_wikiLoreKind === "cond") return (d.CONDITIONS || []).map(function (c) { return _wikiCondName(c); });
  if (_wikiLoreKind === "gloss") return _wikiGlossMap().order;
  if (_wikiLoreKind === "abil") return Object.keys(WIKI_STAT_RU).map(function (k) { return WIKI_ABIL_NAMES[k]; });
  if (_wikiLoreKind === "opt") return WIKI_OPT_GROUPS.map(function (g) { return g.title; });
  if (_wikiLoreKind === "race") return Object.keys(d.RACE_DATA || {});
  if (_wikiLoreKind === "bg") return Object.keys(d.BACKGROUND_SKILLS || {});
  return (d.FEATS_DATA || []).map(function (f) { return f.name; });
}

function _wikiFeatByName(d, name) {
  var arr = d.FEATS_DATA || [];
  for (var i = 0; i < arr.length; i++) if (arr[i].name === name) return arr[i];
  return null;
}

// 2024-таблицы лежат в ленивом data-2024.js: без загрузки edData вернёт 2014.
function _wikiLoreEnsure(cb) {
  if (wikiEdition() === "2024" && typeof ensureEdition2024 === "function" && !window.__edition2024Loaded) {
    ensureEdition2024().then(cb, cb);
  } else cb();
}

function _wikiLoreOpen(kind, key) {
  _wikiLoreKind = kind;
  _wikiLoreKey = key || null;
  showScreen("wikilore");
  _wikiLoreEnsure(function () {
    renderWikiLore();
    var st = document.getElementById("screen-wikilore");
    if (st) st.scrollTop = 0;
  });
}

function openWikiRaces() { _wikiLoreOpen("race"); }
function openWikiBackgrounds() { _wikiLoreOpen("bg"); }
function openWikiFeats() { _wikiLoreOpen("feat"); }

function wikiLoreBack() {
  if (_wikiLoreKey) { _wikiLoreKey = null; renderWikiLore(); } else screenBack();
}

function setWikiLoreEdition(ed) {
  _wikiEdition = ed;
  _wikiLoreEnsure(function () {
    if (_wikiLoreKey && _wikiLoreList().indexOf(_wikiLoreKey) < 0) _wikiLoreKey = null;
    renderWikiLore();
  });
}

function _wikiLRow(label, hint, act) {
  var i = _wikiLoreActs.push(act) - 1;
  return '<li class="home-menu-row"><button type="button" class="home-menu-item list-row" onclick="_wikiLGo(' + i + ')">' +
    '<span class="home-bullet" aria-hidden="true"></span>' +
    '<span class="home-menu-label">' + escapeHtml(label) + '</span>' +
    (hint ? '<span class="home-menu-hint">' + escapeHtml(hint) + '</span>' : '') + '</button></li>';
}

function _wikiLGo(i) { var f = _wikiLoreActs[i]; if (f) f(); }

function _wikiStatsText(st) {
  return Object.keys(st || {}).map(function (k) { return WIKI_STAT_RU[k] + " +" + st[k]; }).join(", ");
}

// Абзац записи: заголовок и текст с подсказками глоссария.
function _wikiPara(title, text) {
  if (!text) return "";
  var t = escapeHtml(text);
  if (typeof glossarizeHtml === "function") t = glossarizeHtml(t);
  return '<li class="home-menu-row"><div class="home-menu-item list-row"><span class="home-bullet" aria-hidden="true"></span>' +
    '<span class="home-menu-label">' + escapeHtml(title) + '</span></div>' +
    '<p class="home-menu-hint">' + t + '</p></li>';
}

function _wikiRaceSource(r) {
  return r.source ? _wikiSrcLabel(r.source) : (wikiEdition() === "2024" ? "PHB 2024" : "PHB");
}

function _wikiMeters(ft) {
  var m = Math.round(ft * 0.3 * 10) / 10;
  return String(m).replace(".", ",") + " м (" + ft + " фт)";
}

function _wikiRacePage(d, key) {
  var r = d.RACE_DATA[key] || {};
  var html = '<ul class="home-menu-list">' +
    _wikiFact("Источник", _wikiRaceSource(r)) +
    _wikiFact("Размер", Array.isArray(r.size) ? r.size.join(" или ") : r.size) +
    _wikiFact("Скорость", r.speed ? _wikiMeters(r.speed) : "") +
    _wikiFact("Тёмное зрение", r.darkvision ? _wikiMeters(r.darkvision) : "") +
    _wikiFact("Характеристики", _wikiStatsText(r.stats));
  if (typeof r.traits === "string") html += _wikiPara("Особенности", r.traits);
  else (r.traits || []).forEach(function (t) { html += _wikiPara(t.name, t.desc); });
  html += '</ul>';
  (r.choices || []).forEach(function (c) {
    var opts = c.options || [];
    if (!opts.length) return;
    html += '<h3 class="books-group-title">' + escapeHtml(c.label || c.name || "Выбор") + '</h3><ul class="home-menu-list">';
    opts.forEach(function (o) {
      html += typeof o === "string" ? _wikiFact(o, "") : _wikiPara(o.name || o.label || "", o.desc);
    });
    html += '</ul>';
  });
  return html;
}

function _wikiBgPage(d, key) {
  var b = d.BACKGROUND_SKILLS[key] || {};
  var is24 = wikiEdition() === "2024";
  var html = '<ul class="home-menu-list">' +
    _wikiFact("Источник", is24 ? "PHB 2024" : "PHB") +
    _wikiFact("Навыки", (b.skills || []).join(", ")) +
    _wikiFact("Инструменты", (b.tools || []).join(", ") || "нет");
  if (is24) {
    html += _wikiFact("Характеристики", (b.abilities || []).map(function (k) { return WIKI_STAT_RU[k]; }).join(", ") + " (+2/+1 или +1/+1/+1)");
    var ft = null;
    (d.FEATS_DATA || []).forEach(function (f) { if (f.id === b.featId) ft = f; });
    if (ft) html += _wikiLRow(ft.name + (b.featOpt ? " (" + b.featOpt + ")" : ""), "черта", function () { _wikiLoreOpen("feat", ft.name); });
    html += _wikiPara("Описание", b.desc);
  } else {
    html += _wikiFact("Языки", b.languages ? "на выбор: " + b.languages : "нет");
    if (b.feature) html += _wikiPara(b.feature.name, b.feature.desc);
  }
  return html + '</ul>';
}

function _wikiFeatPage(d, key) {
  var f = _wikiFeatByName(d, key) || {};
  return '<ul class="home-menu-list">' +
    _wikiFact("Источник", _wikiSrcLabel(f.source || (wikiEdition() === "2024" ? "PHB24" : "PHB"))) +
    _wikiFact("Вид", WIKI_FEAT_CAT[f.category] || "") +
    _wikiFact("Требование", f.prereq) +
    _wikiFact("Минимальный уровень", f.minLevel ? String(f.minLevel) : "") +
    _wikiFact("Повторный выбор", f.repeatable ? "можно" : "") +
    _wikiPara("Описание", f.desc) + '</ul>';
}

function renderWikiLore() {
  var body = document.getElementById("wikilore-body");
  if (!body) return;
  _wikiLoreActs = [];
  var kind = _wikiLoreKind, ed = wikiEdition(), d = wikiEdData();
  var h = document.getElementById("wikilore-title");
  var row = document.getElementById("wikilore-edition-row");
  if (row) row.querySelectorAll("[data-ed]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-ed") === ed); });
  if (_wikiLoreKey) {
    if (h) h.textContent = _wikiLoreKey;
    body.innerHTML = kind === "race" ? _wikiRacePage(d, _wikiLoreKey)
      : kind === "bg" ? _wikiBgPage(d, _wikiLoreKey)
      : kind === "cond" ? _wikiCondPage(d, _wikiLoreKey)
      : kind === "gloss" ? _wikiGlossPage(_wikiLoreKey)
      : kind === "abil" ? _wikiAbilPage(_wikiLoreKey)
      : kind === "opt" ? _wikiOptPage(_wikiLoreKey) : _wikiFeatPage(d, _wikiLoreKey);
    return;
  }
  if (h) h.textContent = WIKI_LORE_TITLES[kind] || "Справочник";
  var names = _wikiLoreList();
  if (kind === "feat") names = names.slice().sort(function (a, b) { return a.localeCompare(b, "ru"); });
  body.innerHTML = '<ul class="home-menu-list">' + names.map(function (n) {
    var hint = "", f;
    if (kind === "opt") hint = _wikiOptGroup(n).hint;
    else if (kind === "race") { var r = d.RACE_DATA[n] || {}; hint = [_wikiRaceSource(r), _wikiStatsText(r.stats)].filter(Boolean).join(" · "); }
    else if (kind === "bg") hint = ((d.BACKGROUND_SKILLS[n] || {}).skills || []).join(", ");
    else if (kind === "feat") { f = _wikiFeatByName(d, n) || {}; hint = [WIKI_FEAT_CAT[f.category], f.prereq].filter(Boolean).join(" · ") || _wikiSrcLabel(f.source || "PHB"); }
    return _wikiLRow(n, hint, function () {
      _wikiLoreKey = n;
      renderWikiLore();
      var st = document.getElementById("screen-wikilore");
      if (st) st.scrollTop = 0;
    });
  }).join("") + '</ul>';
}

function _wikiLoreSearch(kind, label) {
  return function (q) {
    var saved = _wikiLoreKind;
    _wikiLoreKind = kind;
    var out = _wikiLoreList().filter(function (n) { return _wikiNorm(n).indexOf(q) >= 0; }).map(function (n) {
      return { title: n, hint: label, open: function () { _wikiLoreOpen(kind, n); } };
    });
    _wikiLoreKind = saved;
    return out;
  };
}

// ============================================================
// ВИКИ-4 — правила: состояния, глоссарий, характеристики, классовые опции.
// Те же экран и список, что у ВИКИ-3 (kind = cond | gloss | abil | opt).
// ============================================================
var WIKI_ABIL_NAMES = { str: "Сила", dex: "Ловкость", con: "Телосложение", int: "Интеллект", wis: "Мудрость", cha: "Харизма" };

function _wikiCondName(c) { return String(c.name || "").replace(/^[^A-Za-zА-Яа-яЁё]+/, ""); }

// Абзац с переносами строк (маркеры «•» в описаниях состояний).
function _wikiParaBr(title, text) {
  if (!text) return "";
  var t = escapeHtml(text);
  if (typeof glossarizeHtml === "function") t = glossarizeHtml(t, null, wikiEdition());
  t = t.replace(/\n/g, "<br>");
  return '<li class="home-menu-row"><div class="home-menu-item list-row"><span class="home-bullet" aria-hidden="true"></span>' +
    '<span class="home-menu-label">' + escapeHtml(title) + '</span></div>' +
    '<p class="home-menu-hint">' + t + '</p></li>';
}

function _wikiCondPage(d, key) {
  var out = "";
  (d.CONDITIONS || []).forEach(function (c) { if (_wikiCondName(c) === key) out = _wikiParaBr("Эффекты", c.desc); });
  return '<ul class="home-menu-list">' + out + '</ul>';
}

// Глоссарий: 2024 дополняет 2014 записями с тем же термином.
function _wikiGlossMap() {
  var map = {}, order = [];
  function add(arr) {
    (arr || []).forEach(function (g) {
      if (!g || !g.term) return;
      if (!map[g.term]) order.push(g.term);
      map[g.term] = g;
    });
  }
  add(window.GLOSSARY);
  if (wikiEdition() === "2024") add(window.GLOSSARY_2024);
  order.sort(function (a, b) { return a.localeCompare(b, "ru"); });
  return { map: map, order: order };
}

function _wikiGlossPage(key) {
  var g = _wikiGlossMap().map[key] || {};
  var forms = (g.terms || []).filter(function (t) { return t !== key; });
  return '<ul class="home-menu-list">' + _wikiFact("Формы", forms.slice(0, 6).join(", ")) + _wikiPara("Определение", g.def) + '</ul>';
}

function _wikiAbilPage(name) {
  var key = "";
  Object.keys(WIKI_ABIL_NAMES).forEach(function (k) { if (WIKI_ABIL_NAMES[k] === name) key = k; });
  var a = (typeof ABILITY_INFO !== "undefined" && ABILITY_INFO[key]) || {};
  return '<ul class="home-menu-list">' + _wikiFact("Сокращение", WIKI_STAT_RU[key]) +
    _wikiPara("Суть", a.lead) + _wikiPara("Проверки", a.checks) + _wikiPara("Спасбросок", a.save) + _wikiPara("Применение", a.uses) + '</ul>';
}

// Группы классовых опций. dict(ed) → { id: {name, desc, req?} }.
function _wikiOptDict(name2014, name2024) {
  var is24 = wikiEdition() === "2024";
  var v = is24 && window[name2024] ? window[name2024] : window[name2014];
  return v || {};
}
var WIKI_OPT_GROUPS = [
  { title: "Боевые стили", hint: "воин, паладин, следопыт", dict: function () { return _wikiOptDict("FIGHTING_STYLES", "FIGHTING_STYLES_2024"); } },
  { title: "Таинственные воззвания", hint: "колдун", dict: function () { return _wikiOptDict("WARLOCK_INVOCATIONS", "WARLOCK_INVOCATIONS_2024"); } },
  { title: "Метамагия", hint: "чародей", dict: function () { return _wikiOptDict("SORCERER_METAMAGIC", "SORCERER_METAMAGIC_2024"); } },
  { title: "Манёвры", hint: "боевой мастер", dict: function () { return _wikiOptDict("BATTLE_MASTER_MANEUVERS", "BATTLE_MASTER_MANEUVERS_2024"); } },
  { title: "Дары договора", hint: "колдун", dict: function () { return _wikiOptDict("WARLOCK_PACT_BOONS", "WARLOCK_PACT_BOONS_2024"); } }
];

function _wikiOptGroup(title) {
  for (var i = 0; i < WIKI_OPT_GROUPS.length; i++) if (WIKI_OPT_GROUPS[i].title === title) return WIKI_OPT_GROUPS[i];
  return WIKI_OPT_GROUPS[0];
}

function _wikiOptReq(r) {
  if (!r) return "";
  var p = [];
  if (r.level) p.push(r.level + " ур.");
  var pacts = { chain: "цепи", blade: "клинка", tome: "гримуара" };
  if (r.pact) p.push("договор " + (pacts[r.pact] || r.pact));
  if (r.spell) p.push("заклинание " + (r.spell === "eldritch-blast" ? "Мистический заряд" : r.spell));
  return p.join(", ");
}

function _wikiOptPage(title) {
  var dict = _wikiOptGroup(title).dict(), html = '<ul class="home-menu-list">';
  Object.keys(dict).forEach(function (k) {
    var o = dict[k], req = _wikiOptReq(o.req);
    html += _wikiPara(o.name + (req ? " (" + req + ")" : ""), o.desc);
  });
  return html + '</ul>';
}

wikiRegister({ group: "dnd", title: "Состояния", hint: "ослеплённый, испуганный, истощение", edition: true,
  open: function () { _wikiLoreOpen("cond"); }, search: _wikiLoreSearch("cond", "Состояния") });
wikiRegister({ group: "dnd", title: "Глоссарий", hint: "игровые термины", edition: true,
  open: function () { _wikiLoreOpen("gloss"); }, search: _wikiLoreSearch("gloss", "Глоссарий") });
wikiRegister({ group: "dnd", title: "Характеристики", hint: "шесть характеристик и их применение", edition: true,
  open: function () { _wikiLoreOpen("abil"); }, search: _wikiLoreSearch("abil", "Характеристики") });
wikiRegister({ group: "dnd", title: "Классовые опции", hint: "стили боя, воззвания, метамагия, манёвры", edition: true,
  open: function () { _wikiLoreOpen("opt"); },
  search: function (q) {
    var out = [];
    WIKI_OPT_GROUPS.forEach(function (g) {
      var dict = g.dict();
      if (_wikiNorm(g.title).indexOf(q) >= 0) out.push({ title: g.title, hint: "Классовые опции", open: function () { _wikiLoreOpen("opt", g.title); } });
      Object.keys(dict).forEach(function (k) {
        if (_wikiNorm(dict[k].name).indexOf(q) >= 0) out.push({ title: dict[k].name, hint: g.title, open: function () { _wikiLoreOpen("opt", g.title); } });
      });
    });
    return out;
  } });

wikiRegister({ group: "dnd", title: "Расы", hint: "особенности, скорость, прибавки", edition: true,
  open: openWikiRaces, search: _wikiLoreSearch("race", "Расы") });
wikiRegister({ group: "dnd", title: "Предыстории", hint: "навыки, умение, снаряжение", edition: true,
  open: openWikiBackgrounds, search: _wikiLoreSearch("bg", "Предыстории") });
wikiRegister({ group: "dnd", title: "Черты", hint: "требования и эффекты", edition: true,
  open: openWikiFeats, search: _wikiLoreSearch("feat", "Черты") });
