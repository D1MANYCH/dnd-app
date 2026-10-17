// PLAY-3б: стартовое снаряжение 2014 — классы (PHB гл.3, выборы «а/б/в»), предыстории
// (PHB гл.4, SCAG, VRGR) и начальное богатство по классу (PHB стр.143, вместо снаряжения
// класса И предыстории). Строки предметов раскладывает placeStartingItem (app-builds.js) —
// имена должны матчиться WEAPON_PRESETS / ARMOR_PRESETS / GEAR_PACKS / её словарю.
// Элемент списка — строка или {pick:вид}: simple, simpleMelee, martial, martialMelee —
// оружие из WEAPON_PRESETS; instrument, artisan, gaming — инструмент из TOOL_CATALOG.
// opts — варианты одного выбора, каждый — список элементов; note — пометка у варианта.

var CLASS_START_EQUIP_2014 = {
  "Варвар": { gold: [2, 4, 10], choices: [
      [["Секира"], [{pick:"martialMelee"}]],
      [["Ручной топор", "Ручной топор"], [{pick:"simple"}]]
    ], fixed: ["Набор путешественника", "Метательное копьё", "Метательное копьё", "Метательное копьё", "Метательное копьё"] },
  "Бард": { gold: [5, 4, 10], choices: [
      [["Рапира"], ["Длинный меч"], [{pick:"simple"}]],
      [["Набор дипломата"], ["Набор артиста"]],
      [["Лютня"], [{pick:"instrument"}]]
    ], fixed: ["Кожаный доспех", "Кинжал"] },
  "Жрец": { gold: [5, 4, 10], choices: [
      [["Булава"], {items:["Боевой молот"], note:"если владеете"}],
      [["Чешуйчатый доспех"], ["Кожаный доспех"], {items:["Кольчуга"], note:"если владеете"}],
      [["Лёгкий арбалет", "Болты (20)"], [{pick:"simple"}]],
      [["Набор священника"], ["Набор путешественника"]]
    ], fixed: ["Щит", "Священный символ"] },
  "Друид": { gold: [2, 4, 10], choices: [
      [["Деревянный щит"], [{pick:"simple"}]],
      [["Скимитар"], [{pick:"simpleMelee"}]]
    ], fixed: ["Кожаный доспех", "Набор путешественника", "Друидическая фокусировка"] },
  "Воин": { gold: [5, 4, 10], choices: [
      [["Кольчуга"], ["Кожаный доспех", "Длинный лук", "Стрелы (20)"]],
      [[{pick:"martial"}, "Щит"], [{pick:"martial"}, {pick:"martial"}]],
      [["Лёгкий арбалет", "Болты (20)"], ["Ручной топор", "Ручной топор"]],
      [["Набор исследователя подземелий"], ["Набор путешественника"]]
    ], fixed: [] },
  "Монах": { gold: [5, 4, 1], choices: [
      [["Короткий меч"], [{pick:"simple"}]],
      [["Набор исследователя подземелий"], ["Набор путешественника"]]
    ], fixed: ["10 дротиков"] },
  "Паладин": { gold: [5, 4, 10], choices: [
      [[{pick:"martial"}, "Щит"], [{pick:"martial"}, {pick:"martial"}]],
      [["Метательное копьё", "Метательное копьё", "Метательное копьё", "Метательное копьё", "Метательное копьё"], [{pick:"simpleMelee"}]],
      [["Набор священника"], ["Набор путешественника"]]
    ], fixed: ["Кольчуга", "Священный символ"] },
  "Следопыт": { gold: [5, 4, 10], choices: [
      [["Чешуйчатый доспех"], ["Кожаный доспех"]],
      [["Короткий меч", "Короткий меч"], [{pick:"simpleMelee"}, {pick:"simpleMelee"}]],
      [["Набор исследователя подземелий"], ["Набор путешественника"]]
    ], fixed: ["Длинный лук", "Колчан", "Стрелы (20)"] },
  "Плут": { gold: [4, 4, 10], choices: [
      [["Рапира"], ["Короткий меч"]],
      [["Короткий лук", "Колчан", "Стрелы (20)"], ["Короткий меч"]],
      [["Набор взломщика"], ["Набор исследователя подземелий"], ["Набор путешественника"]]
    ], fixed: ["Кожаный доспех", "Кинжал", "Кинжал", "Воровские инструменты"] },
  "Чародей": { gold: [3, 4, 10], choices: [
      [["Лёгкий арбалет", "Болты (20)"], [{pick:"simple"}]],
      [["Мешочек с компонентами"], ["Магическая фокусировка"]],
      [["Набор исследователя подземелий"], ["Набор путешественника"]]
    ], fixed: ["Кинжал", "Кинжал"] },
  "Колдун": { gold: [4, 4, 10], choices: [
      [["Лёгкий арбалет", "Болты (20)"], [{pick:"simple"}]],
      [["Мешочек с компонентами"], ["Магическая фокусировка"]],
      [["Набор учёного"], ["Набор исследователя подземелий"]]
    ], fixed: ["Кожаный доспех", {pick:"simple"}, "Кинжал", "Кинжал"] },
  "Волшебник": { gold: [4, 4, 10], choices: [
      [["Боевой посох"], ["Кинжал"]],
      [["Мешочек с компонентами"], ["Магическая фокусировка"]],
      [["Набор учёного"], ["Набор путешественника"]]
    ], fixed: ["Книга заклинаний"] }
};

// Предыстории: items — всегда, choices — как у классов, gp — золото в кошеле, sp — серебро.
// Разновидности (variantOf) без своей записи берут снаряжение базовой.
var BG_START_EQUIP_2014 = {
  "Прислужник": { choices: [[["Молитвенник"], ["Молитвенное колесо"]]],
    items: ["Священный символ", "Палочки благовоний (5)", "Облачение", "Обычная одежда", "Поясной кошель"], gp: 15 },
  "Шарлатан": { choices: [[["Флаконы с цветной жидкостью (10)"], ["Шулерские кости"], ["Крапленая колода карт"], ["Перстень несуществующего герцога"]]],
    items: ["Отличная одежда", "Набор для грима", "Поясной кошель"], gp: 15 },
  "Преступник": { items: ["Лом", "Тёмная обычная одежда с капюшоном", "Поясной кошель"], gp: 15 },
  "Артист": { choices: [[[{pick:"instrument"}]]],
    items: ["Подарок поклонника", "Костюм", "Поясной кошель"], gp: 15 },
  "Гладиатор": { choices: [[["Трезубец"], ["Сеть"]]],
    items: ["Подарок поклонника", "Костюм", "Поясной кошель"], gp: 15 },
  "Народный герой": { choices: [[[{pick:"artisan"}]]],
    items: ["Лопата", "Железный котелок", "Обычная одежда", "Поясной кошель"], gp: 10 },
  "Гильдейский ремесленник": { choices: [[[{pick:"artisan"}]]],
    items: ["Рекомендательное письмо гильдии", "Дорожная одежда", "Поясной кошель"], gp: 15 },
  "Гильдейский купец": { choices: [[[{pick:"artisan"}], ["Мул", "Телега"]]],
    items: ["Рекомендательное письмо гильдии", "Дорожная одежда", "Поясной кошель"], gp: 15 },
  "Отшельник": { items: ["Футляр для свитков с записями", "Зимнее одеяло", "Обычная одежда", "Набор травника"], gp: 5 },
  "Дворянин": { items: ["Отличная одежда", "Кольцо-печатка", "Свиток с родословной", "Кошель"], gp: 25 },
  "Чужеземец": { items: ["Посох", "Охотничий капкан", "Трофей с убитого животного", "Дорожная одежда", "Поясной кошель"], gp: 10 },
  "Мудрец": { items: ["Бутылочка чернил", "Перо", "Маленький нож", "Письмо от погибшего коллеги", "Обычная одежда", "Поясной кошель"], gp: 10 },
  "Моряк": { items: ["Дубинка", "Шёлковая верёвка (15 м)", "Талисман на удачу", "Обычная одежда", "Поясной кошель"], gp: 10 },
  "Солдат": { choices: [[["Костяные игральные кости"], ["Колода карт"]]],
    items: ["Знак отличия", "Трофей с павшего врага", "Обычная одежда", "Поясной кошель"], gp: 10 },
  "Беспризорник": { items: ["Маленький нож", "Карта родного города", "Ручная мышь", "Память о родителях", "Обычная одежда", "Поясной кошель"], gp: 10 },
  // SCAG
  "Городской стражник": { items: ["Форма подразделения", "Рог", "Кандалы", "Поясной кошель"], gp: 10 },
  "Клановый ремесленник": { choices: [[[{pick:"artisan"}]]],
    items: ["Резец для клейма мастера", "Дорожная одежда", "Самоцвет (10 зм)", "Поясной кошель"], gp: 5 },
  "Учёный-затворник": { items: ["Мантия учёного", "Письменный набор", "Книга по предмету изучения (взята на время)", "Поясной кошель"], gp: 10 },
  "Придворный": { items: ["Отличная одежда", "Поясной кошель"], gp: 5 },
  "Представитель фракции": { items: ["Значок или эмблема фракции", "Копия основного текста фракции", "Обычная одежда", "Поясной кошель"], gp: 15 },
  "Дальний путешественник": { choices: [[[{pick:"instrument"}], [{pick:"gaming"}]]],
    items: ["Дорожная одежда", "Грубые карты родных мест", "Небольшое украшение (10 зм)", "Поясной кошель"], gp: 5 },
  "Наследник": { choices: [[[{pick:"instrument"}], [{pick:"gaming"}]]],
    items: ["Наследство", "Дорожная одежда", "Поясной кошель"], gp: 15 },
  "Рыцарь ордена": { items: ["Дорожная одежда", "Печатка, знамя или печать ордена", "Поясной кошель"], gp: 10 },
  "Ветеран наёмник": { choices: [[[{pick:"gaming"}]]],
    items: ["Форма отряда", "Знак отличия", "Поясной кошель"], gp: 10 },
  "Городской охотник за головами": { items: ["Одежда по роду занятий", "Поясной кошель"], gp: 20 },
  "Утгардтский соплеменник": { items: ["Охотничий капкан", "Тотемный знак", "Дорожная одежда", "Поясной кошель"], gp: 10 },
  "Дворянин Глубоководья": { items: ["Отличная одежда", "Кольцо-печатка или брошь", "Свиток с родословной", "Бурдюк с вином", "Поясной кошель"], gp: 20 },
  // VRGR
  "Преследуемый": { items: ["Набор охотника на чудовищ", "Безделушка", "Обычная одежда"], sp: 1 }
};

var _START_PICK_LABELS = { simple: "простое оружие", simpleMelee: "простое рукопашное оружие", martial: "воинское оружие",
  martialMelee: "воинское рукопашное оружие", instrument: "музыкальный инструмент", artisan: "инструменты ремесленника", gaming: "игровой набор" };

function _startPickOptions(kind) {
  if (kind === "instrument" || kind === "artisan" || kind === "gaming") {
    var key = kind === "instrument" ? "musical" : kind;
    return ((typeof TOOL_CATALOG !== "undefined" && TOOL_CATALOG[key]) || []).map(function(t) { return t.name; });
  }
  return (typeof WEAPON_PRESETS === "undefined" ? [] : WEAPON_PRESETS).filter(function(w) {
    if (kind.indexOf("martial") === 0 ? w.category !== "martial" : w.category !== "simple") return false;
    return !/Melee$/.test(kind) || w.kind === "melee";
  }).map(function(w) { return w.name; });
}

function _startOpt(o) { return Array.isArray(o) ? { items: o } : o; }

function _startClassDef(char) {
  var cls = (char.classes && char.classes[0] && char.classes[0].class) || char.class;
  return cls && CLASS_START_EQUIP_2014[cls] ? { cls: cls, def: CLASS_START_EQUIP_2014[cls] } : null;
}

function _startBgDef(char) {
  var name = char.background, d = BG_START_EQUIP_2014[name];
  if (!d && typeof BACKGROUND_SKILLS !== "undefined" && BACKGROUND_SKILLS[name] && BACKGROUND_SKILLS[name].variantOf) {
    d = BG_START_EQUIP_2014[BACKGROUND_SKILLS[name].variantOf];
  }
  if (!d && name === "Сыщик") d = BG_START_EQUIP_2014["Городской стражник"];
  return d || null;
}

// Выборы живут до выдачи, в памяти: { charId, class:{ci:oi}, bg:{ci:oi}, picks:{"class.ci.oi.ii": имя} }.
var _startSel = { charId: null, "class": {}, bg: {}, picks: {} };
function _startState() {
  if (_startSel.charId !== currentId) _startSel = { charId: currentId, "class": {}, bg: {}, picks: {} };
  return _startSel;
}

function setStartEquipOpt(scope, ci, oi) {
  _startState()[scope][ci] = oi;
  _rerenderStartEquip(scope);
}

function setStartEquipPick(key, value) {
  _startState().picks[key] = value;
}

function _rerenderStartEquip(scope) {
  if (scope === "class") { if (typeof renderClassSkills === "function") renderClassSkills(); }
  else if (typeof renderBackgroundExtras === "function") renderBackgroundExtras();
}

function _startItemLabel(it) {
  return typeof it === "string" ? it : (_START_PICK_LABELS[it.pick] || it.pick) + " на\u00a0выбор";
}

function _startChoicesHtml(scope, choices) {
  var st = _startState(), html = "";
  (choices || []).forEach(function(opts, ci) {
    var sel = st[scope][ci] || 0;
    html += '<div class="race-extras-row">';
    if (opts.length > 1) {
      opts.forEach(function(raw, oi) {
        var o = _startOpt(raw);
        html += '<button type="button" class="race-extras-stat-pick' + (oi === sel ? " selected" : "") +
          '" onclick="setStartEquipOpt(\'' + scope + '\',' + ci + ',' + oi + ')">' + "абв".charAt(oi) + ') ' +
          escapeHtml(o.items.map(_startItemLabel).join(", ") + (o.note ? " (" + o.note + ")" : "")) + '</button>';
      });
    }
    _startOpt(opts[sel]).items.forEach(function(it, ii) {
      if (typeof it === "string") { if (opts.length === 1) html += '<span class="race-extras-hint">' + escapeHtml(it) + '</span>'; return; }
      var key = scope + "." + ci + "." + sel + "." + ii;
      var list = _startPickOptions(it.pick);
      if (!st.picks[key]) st.picks[key] = list[0] || "";
      html += '<select class="field flat-field" aria-label="' + escapeHtml(_START_PICK_LABELS[it.pick] || "") +
        '" onchange="setStartEquipPick(\'' + key + '\', this.value)">' + list.map(function(n) {
          return '<option' + (n === st.picks[key] ? " selected" : "") + '>' + escapeHtml(n) + '</option>';
        }).join("") + '</select>';
    });
    html += '</div>';
  });
  return html;
}

// Итоговый список выдачи: строки для placeStartingItem и инструменты ({tool:имя}).
function _startResolve(scope, choices, fixed) {
  var st = _startState(), out = [];
  function push(it, key) {
    if (typeof it === "string") { out.push(it); return; }
    var v = st.picks[key] || _startPickOptions(it.pick)[0];
    if (!v) return;
    out.push(/^(instrument|artisan|gaming)$/.test(it.pick) ? { tool: v } : v);
  }
  (choices || []).forEach(function(opts, ci) {
    var sel = st[scope][ci] || 0;
    _startOpt(opts[sel]).items.forEach(function(it, ii) { push(it, scope + "." + ci + "." + sel + "." + ii); });
  });
  (fixed || []).forEach(function(it, fi) { push(it, scope + ".f." + fi); });
  return out;
}

function _startPlace(char, list) {
  if (!char.inventory) char.inventory = { weapon:[], armor:[], potion:[], scroll:[], tool:[], material:[], other:[] };
  if (!Array.isArray(char.weapons)) char.weapons = [];
  if (!char.combat) char.combat = {};
  var hadArmor = char.combat.armorId && char.combat.armorId !== "none";
  list.forEach(function(it) {
    if (it && it.tool) {
      char.inventory.tool.push({ name: it.tool, qty: 1, weight: 0, location: "backpack", desc: "" });
      return;
    }
    placeStartingItem(char, it);
    if (!hadArmor) {
      var a = _findArmorPreset(it);
      if (a) { char.combat.armorId = a.id; hadArmor = true; }
    }
    if (/щит/i.test(it) && !char.combat.hasShield) { char.combat.hasShield = true; char.combat.shieldItem = "Щит"; }
  });
}

function _startAfterGive(char, label, list) {
  saveToLocal();
  if (typeof renderInventory === "function") renderInventory();
  if (typeof updateInventoryWeight === "function") updateInventoryWeight();
  if (typeof renderWeapons === "function") renderWeapons();
  if ($("char-shield")) $("char-shield").checked = !!char.combat.hasShield;
  if (typeof renderArmorSelect === "function") renderArmorSelect(char);
  if (typeof calculateAC === "function") calculateAC();
  safeSet("coin-gp", (char.coins && char.coins.gp) || 0);
  safeSet("coin-sp", (char.coins && char.coins.sp) || 0);
  if (typeof calcCoinWeight === "function") calcCoinWeight();
  showToast(label + ": " + list.map(function(it) { return it && it.tool ? it.tool : it; }).join(", "), "success");
  if (typeof renderClassSkills === "function") renderClassSkills();
  if (typeof renderBackgroundExtras === "function") renderBackgroundExtras();
}

function giveClassEquipment14() {
  if (!currentId || sheetLockGuard()) return;
  var char = getCurrentChar(), cd = char && _startClassDef(char);
  if (!cd || char.classEquipGiven) return;
  var list = _startResolve("class", cd.def.choices, cd.def.fixed);
  _startPlace(char, list);
  char.classEquipGiven = true;
  _startAfterGive(char, "Снаряжение класса", list);
}

function giveBackgroundEquipment14() {
  if (!currentId || sheetLockGuard()) return;
  var char = getCurrentChar(), d = char && _startBgDef(char);
  if (!d || char.bgEquipGiven) return;
  var list = _startResolve("bg", d.choices, d.items);
  _startPlace(char, list);
  if (!char.coins) char.coins = { cp:0, sp:0, ep:0, gp:0, pp:0 };
  char.coins.gp = (char.coins.gp || 0) + (d.gp || 0);
  char.coins.sp = (char.coins.sp || 0) + (d.sp || 0);
  char.bgEquipGiven = true;
  _startAfterGive(char, "Снаряжение предыстории", list.concat(d.gp ? [d.gp + " зм"] : [], d.sp ? [d.sp + " см"] : []));
}

// PHB стр.143: золото по классу вместо снаряжения класса и предыстории.
function giveStartingGold14() {
  if (!currentId || sheetLockGuard()) return;
  var char = getCurrentChar(), cd = char && _startClassDef(char);
  if (!cd || char.classEquipGiven || char.bgEquipGiven) return;
  var g = cd.def.gold;
  var formula = g[0] + "к" + g[1] + (g[2] > 1 ? " × " + g[2] : "");
  // DS-5б: шторка вместо confirm(), кнопка называет последствие
  showConfirmModal("Золото вместо снаряжения",
    "Снаряжение класса и\u00a0предыстории выдано не\u00a0будет, вместо него — " + formula + "\u00a0зм.",
    function() { _rollStartingGold14(char, g, formula); }, "Бросить " + formula + "\u00a0зм", { danger: false, icon: "coins" });
}
function _rollStartingGold14(char, g, formula) {
  if (getCurrentChar() !== char || char.classEquipGiven || char.bgEquipGiven) return;
  var rolls = [], sum = 0;
  for (var i = 0; i < g[0]; i++) { var r = 1 + Math.floor(Math.random() * g[1]); rolls.push(r); sum += r; }
  var gp = sum * g[2];
  if (!char.coins) char.coins = { cp:0, sp:0, ep:0, gp:0, pp:0 };
  char.coins.gp = (char.coins.gp || 0) + gp;
  char.classEquipGiven = true;
  char.bgEquipGiven = true;
  saveToLocal();
  safeSet("coin-gp", char.coins.gp);
  if (typeof calcCoinWeight === "function") calcCoinWeight();
  showToast("Начальное золото: " + formula + " = [" + rolls.join(", ") + "]" + (g[2] > 1 ? " × " + g[2] : "") + " = " + gp + " зм", "success");
  if (typeof renderClassSkills === "function") renderClassSkills();
  if (typeof renderBackgroundExtras === "function") renderBackgroundExtras();
}

function _startDone(text) {
  return '<div class="race-extras-row"><span class="race-extras-btn done">' + dndIcoHtml("check", 13) + ' ' + text + '</span></div>';
}

// Блок в панели навыков класса (2014, после фиксации основы).
function renderClassEquip14(char) {
  if (!char || char.edition === "2024" || !char.basicLocked) return "";
  var cd = _startClassDef(char);
  if (!cd) return "";
  var html = '<div class="race-extras-title">' + dndIcoHtml("box", 14) + ' Стартовое снаряжение: ' + escapeHtml(cd.cls) + '</div>';
  if (char.classEquipGiven) return html + _startDone("Снаряжение класса выдано");
  if (isSheetLocked(char)) return "";
  html += _startChoicesHtml("class", cd.def.choices);
  var fixed = (cd.def.fixed || []).filter(function(it) { return typeof it === "string"; });
  var fixedPicks = (cd.def.fixed || []).filter(function(it) { return typeof it !== "string"; });
  if (fixed.length) html += '<div class="race-extras-hint">А\u00a0также: ' + escapeHtml(fixed.join(", ")) + '</div>';
  if (fixedPicks.length) {
    var st = _startState();
    html += '<div class="race-extras-row">';
    cd.def.fixed.forEach(function(it, fi) {
      if (typeof it === "string") return;
      var key = "class.f." + fi, list = _startPickOptions(it.pick);
      if (!st.picks[key]) st.picks[key] = list[0] || "";
      html += '<select class="field flat-field" aria-label="' + escapeHtml(_START_PICK_LABELS[it.pick] || "") +
        '" onchange="setStartEquipPick(\'' + key + '\', this.value)">' + list.map(function(n) {
          return '<option' + (n === st.picks[key] ? " selected" : "") + '>' + escapeHtml(n) + '</option>';
        }).join("") + '</select>';
    });
    html += '</div>';
  }
  var g = cd.def.gold;
  html += '<div class="race-extras-row"><button class="race-extras-btn" onclick="giveClassEquipment14()">Выдать снаряжение</button>';
  if (!char.bgEquipGiven) html += '<button class="race-extras-btn" onclick="giveStartingGold14()" title="Вместо снаряжения класса и\u00a0предыстории (PHB, стр.\u00a0143)">Вместо снаряжения — ' +
    g[0] + 'к' + g[1] + (g[2] > 1 ? ' × ' + g[2] : '') + ' зм</button>';
  return html + '</div>';
}

// Блок в панели предыстории (2014, после фиксации основы).
function renderBgEquip14(char) {
  if (!char || char.edition === "2024" || !char.basicLocked) return "";
  var d = _startBgDef(char);
  if (!d) return "";
  var html = '<div class="race-extras-title">' + dndIcoHtml("box", 14) + ' Снаряжение предыстории</div>';
  if (char.bgEquipGiven) return html + _startDone(char.classEquipGiven ? "Снаряжение предыстории выдано" : "Выдано");
  if (isSheetLocked(char)) return "";
  html += _startChoicesHtml("bg", d.choices);
  var money = [d.gp ? d.gp + " зм" : "", d.sp ? d.sp + " см" : ""].filter(Boolean);
  html += '<div class="race-extras-hint">' + escapeHtml(d.items.concat(money).join(", ")) + '</div>';
  return html + '<div class="race-extras-row"><button class="race-extras-btn" onclick="giveBackgroundEquipment14()">Выдать снаряжение</button></div>';
}
