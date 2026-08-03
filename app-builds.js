// ============================================================
// app-builds.js — Готовые билды: пикер и бейджи, применение (applyBuild),
// гайд с глоссарием-тултипами, рекомендации по уровням, планы билда и класса
// ============================================================

// ── BUILD-2: Build picker ─────────────────────────────────────────────────────
function openBuildPicker() {
  var sel = $("bp-class-filter");
  if (sel && sel.options.length <= 1) {
    var classes = [];
    (window.CHARACTER_BUILDS || []).forEach(function(b){
      if (classes.indexOf(b.className) === -1) classes.push(b.className);
    });
    classes.sort();
    classes.forEach(function(c){
      var o = document.createElement("option");
      o.value = c; o.textContent = c;
      sel.appendChild(o);
    });
  }
  var s = $("bp-search"); if (s) s.value = "";
  renderBuildPicker();
  // STYLE-8M-2b: пикер — экран. Фокус в поиск даём после перехода (300 мс),
  // иначе браузер доскроллит уезжающий экран к полю.
  if (typeof _closeOpenModals === "function") _closeOpenModals();
  if (typeof showScreen === "function") showScreen("builds");
  setTimeout(function(){ var el = $("bp-search"); if (el) el.focus(); }, 320);
}

var BP_ROLE_ICONS = { DPS:"⚔️", Tank:"🛡️", Support:"✨", Control:"🌀", Utility:"🧰" };
var BP_DIFF_LABELS = { 1:"новичку", 2:"среднее", 3:"сложное" };
// UX-4: расшифровка точек сложности для легенды в гайде билда.
var BP_DIFF_DESC = {
  1: "простое управление, почти нет ресурсов для учёта",
  2: "есть ресурсы и тайминги, но без сложных комбинаций",
  3: "много ресурсов и решений в каждый ход"
};

function renderBuildPicker() {
  var list = $("bp-list");
  if (!list) return;
  if (firstLoadSkeleton("build", "bp-list", 6, "card", renderBuildPicker)) return;
  var filter = ($("bp-class-filter") && $("bp-class-filter").value) || "";
  var roleFilter = ($("bp-role-filter") && $("bp-role-filter").value) || "";
  var searchInp = $("bp-search");
  var q = (searchInp && searchInp.value || "").trim().toLowerCase();
  var builds = (window.CHARACTER_BUILDS || []).filter(function(b){
    if (filter && b.className !== filter) return false;
    if (roleFilter && b.role !== roleFilter) return false;
    if (q) {
      var hay = ((b.title||"") + " " + (b.className||"") + " " + (b.subclass||"") + " " + (b.race||"") + " " + (b.summary||"")).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
  if (!builds.length) {
    list.innerHTML = '<div class="bp-empty">Ничего не найдено. Попробуйте другой фильтр или поиск.</div>';
    return;
  }
  list.innerHTML = builds.map(function(b){
    var d = b.difficulty || 1;
    var diff = "●".repeat(d) + "○".repeat(3 - d);
    var clsColor = getClassColor(b.className);
    // BUILD-DESC-2: мини-гайд под summary — pitch + 2 strengths + 1 weakness.
    var guideHtml = "";
    if (b.guide && b.guide.pitch) {
      var _g = b.guide;
      var _str = Array.isArray(_g.strengths) ? _g.strengths.slice(0, 2) : [];
      var _wk = Array.isArray(_g.weaknesses) ? _g.weaknesses.slice(0, 1) : [];
      var _bullets = "";
      _str.forEach(function(s){ _bullets += '<li class="bp-pro">✓ ' + escapeHtml(s) + '</li>'; });
      _wk.forEach(function(w){ _bullets += '<li class="bp-con">✗ ' + escapeHtml(w) + '</li>'; });
      guideHtml =
        '<div class="bp-card-guide">' +
          '<div class="bp-pitch">' + dndIcoHtml("target", 13) + ' ' + escapeHtml(_g.pitch) + '</div>' +
          (_bullets ? '<ul class="bp-bullets">' + _bullets + '</ul>' : '') +
        '</div>';
    }
    return (
      // STYLE-8M-2b: строка меню, а не карточка. Класс кодирует ромб — цвет
      // отдаём строке переменной, как renderCharacterList на экране выбора.
      '<div class="bp-card" tabindex="0" role="button" style="--home-accent:' + clsColor + '" aria-label="' + escapeHtml(b.title) + '" onclick="applyBuild(\'' + b.id + '\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();applyBuild(\'' + b.id + '\')}">' +
        '<div class="bp-card-head">' +
          '<span class="bp-card-title">' + highlightMatch(b.title, q) + '</span>' +
          '<span class="bp-role-badge bp-role-' + escapeHtml(b.role || "") + '">' + escapeHtml(b.role || "") + '</span>' +
        '</div>' +
        '<div class="bp-card-sub">' + highlightMatch(b.className, q) + (b.subclass ? ' · ' + highlightMatch(b.subclass, q) : '') + '</div>' +
        '<div class="bp-card-summary">' + highlightMatch(b.summary || "", q) + '</div>' +
        guideHtml +
        '<div class="bp-card-meta">' +
          '<span class="bp-diff bp-diff-' + d + '" title="Сложность: ' + (BP_DIFF_LABELS[d]||"") + '">' + diff + '</span>' +
          '<span class="bp-race">' + dndIcoHtml("user", 12) + ' ' + escapeHtml(b.race || "") + '</span>' +
          '<span class="bp-bg">' + dndIcoHtml("scroll", 12) + ' ' + escapeHtml(b.background || "") + '</span>' +
        '</div>' +
      '</div>'
    );
  }).join("");
}

// BUILD-6: badge on character screen
function renderBuildBadge() {
  var wrap = $("char-build-badge-wrap");
  var badge = $("char-build-badge");
  if (!wrap || !badge) return;
  var char = getCurrentChar();
  if (!char || !char.buildId) { wrap.style.display = "none"; return; }
  var b = window.getBuildById && window.getBuildById(char.buildId);
  if (!b) { wrap.style.display = "none"; return; }
  var roleIcon = BP_ROLE_ICONS[b.role] || "📘";
  // BUILD-DESC-3: badge — кнопка, открывает гайд. Подсказываем «📖 нажми для гайда».
  badge.textContent = roleIcon + " Билд: " + b.title + (b.guide ? "  📖" : "");
  badge.title = (b.guide ? "Открыть гайд: " : "") + (b.summary || "") + (b.role ? "  [" + b.role + "]" : "");
  wrap.style.display = "";
}

// E24-0: мелкий бейдж редакции в шапке листа. Показывается ТОЛЬКО для 2024 —
// 2014 это дефолт (у 100% текущих персонажей), бейдж «2014» был бы шумом. До
// публичного открытия (E24-14) 2024 доступна лишь в бете, так что бейдж видят
// только бета-тестеры — это и есть нужный маркер нестандартной редакции.
function renderEditionBadge() {
  var badge = $("char-edition-badge");
  if (!badge) return;
  var char = (typeof getCurrentChar === 'function') ? getCurrentChar() : null;
  if (char && char.edition === '2024') {
    badge.textContent = "2024";
    badge.style.display = "";
  } else {
    badge.style.display = "none";
  }
}

function unlinkBuild() {
  var char = getCurrentChar();
  if (!char || !char.buildId) return;
  if (!confirm("Отвязать билд от персонажа? Рекомендации при повышении уровня больше не будут показываться.")) return;
  char.buildId = null;
  char.updatedAt = Date.now();
  saveToLocal();
  renderBuildBadge();
  if (typeof showToast === "function") showToast("Билд отвязан", "success");
}

// BUILD-6: Escape в пикере — STYLE-8M-2b: пикер стал экраном, клавишу ловит
// общий обработчик экранов-страниц (app-core.js), свой больше не нужен.

// PERF-2: build-notes-data.js (~530 КБ) грузится лениво — гарантируем заметки ДО
// создания персонажа; если загрузка упала, билд применяется с базовыми текстами.
// ── FIN-2: матчинг оружия по единому каталогу WEAPON_PRESETS (data.js) ───────
// Раньше жил в closure applyBuild + скрытый пул _EXTRA_WEAPONS; теперь модульный
// уровень (нужен node-тестам), один пул, имя И aliases проходят один алгоритм:
// пасс 1 — подстрока, пасс 2 — стеммы; из совпавших побеждает длиннейшее имя.
// Сравнение со словоформами: берём 5-символьные стеммы каждого слова
function _stemSet(s){
  var arr = String(s).toLowerCase().replace(/[()]/g," ").split(/\s+/);
  var set = {};
  arr.forEach(function(w){ if (w.length >= 4) set[w.substring(0, Math.min(5,w.length))] = 1; });
  return set;
}
function _matchByStems(presetName, inputName){
  var p = _stemSet(presetName), i = _stemSet(inputName);
  var pk = Object.keys(p);
  if (!pk.length) return false;
  // все стеммы пресета должны присутствовать во входе
  for (var k = 0; k < pk.length; k++) if (!i[pk[k]]) return false;
  return true;
}
function _weaponMatchNames(w){
  return [w.name].concat(Array.isArray(w.aliases) ? w.aliases : []);
}
function _findWeapon(name){
  if (typeof WEAPON_PRESETS === "undefined") return null;
  var lo = String(name).toLowerCase();
  // 1. подстрока
  var best = null, bestLen = 0;
  WEAPON_PRESETS.forEach(function(w){
    _weaponMatchNames(w).forEach(function(cand){
      var pn = cand.toLowerCase();
      if (lo.indexOf(pn) >= 0 && pn.length > bestLen) { best = w; bestLen = pn.length; }
    });
  });
  if (best) return best;
  // 2. стемминг
  var best2 = null, bestLen2 = 0;
  WEAPON_PRESETS.forEach(function(w){
    _weaponMatchNames(w).forEach(function(cand){
      if (_matchByStems(cand, lo) && cand.length > bestLen2) { best2 = w; bestLen2 = cand.length; }
    });
  });
  return best2;
}
// FIN-3: поиск пресета брони по тексту (имя ИЛИ алиас, подстрока, длиннейшее
// совпадение). Используется и авто-экипом билда (combat.armorId), и раскладкой
// в инвентарь. Модульный уровень — нужен node-тестам. «Латы» матчатся строке
// «Латный доспех» билдов через алиас (имя «латы» не подстрока «латного»).
function _findArmorPreset(text) {
  if (typeof ARMOR_PRESETS === "undefined") return null;
  var lo = String(text || "").toLowerCase();
  var best = null, bestLen = 0;
  ARMOR_PRESETS.forEach(function(p){
    if (p.id === "none") return;
    [p.name].concat(Array.isArray(p.aliases) ? p.aliases : []).forEach(function(cand){
      var pn = String(cand).toLowerCase();
      if (pn && lo.indexOf(pn) >= 0 && pn.length > bestLen) { best = p; bestLen = pn.length; }
    });
  });
  return best;
}

function applyBuild(buildId) {
  if (!window.BUILD_NOTES && typeof window.ensureBuildNotes === "function") {
    return window.ensureBuildNotes().catch(function (e) {
      if (window.__catchLog) window.__catchLog("build-notes:lazy-load", e);
      if (typeof showToast === "function") showToast("Заметки билда не загрузились — применены базовые", "warn");
    }).then(function () { return _applyBuildCore(buildId); });
  }
  return _applyBuildCore(buildId);
}
function _applyBuildCore(buildId) {
  var b = window.getBuildById && window.getBuildById(buildId);
  if (!b) { if (typeof showToast === "function") showToast("Билд не найден", "warn"); return; }
  var newChar = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
  newChar.id = Date.now();
  newChar.schemaVersion = (typeof SCHEMA_VERSION !== 'undefined') ? SCHEMA_VERSION : 11;
  newChar.edition = '2014';  // E24-0: 36 готовых билдов — контент PHB 2014, редакция явно (не с тумблера)
  newChar.buildId = b.id;
  newChar.name = b.title || newChar.name;
  newChar.class = b.className || "";
  newChar.subclass = b.subclass || "";
  newChar.race = b.race || "";
  newChar.background = b.background || "";
  if (b.stats) {
    newChar.stats = Object.assign({str:10,dex:10,con:10,int:10,wis:10,cha:10}, b.stats);
  }
  for (var i = 1; i <= 9; i++) {
    newChar.spells.slots[i] = 0;
    newChar.spells.slotsUsed[i] = 0;
  }
  // BUILD-FIX-1: спасброски класса. Явно заполняем все 6 ключей,
  // иначе чекбоксы предыдущего чара в DOM могут "протекать" через onchange.
  newChar.saves = { str:false, dex:false, con:false, int:false, wis:false, cha:false };
  if (typeof CLASS_SAVE_PROFICIENCIES !== "undefined" && CLASS_SAVE_PROFICIENCIES[b.className]) {
    CLASS_SAVE_PROFICIENCIES[b.className].forEach(function(k){ newChar.saves[k] = true; });
  }
  // BUILD-FIX-1: навыки из предыстории + b.skills (индексы по массиву skills).
  // Явно заполняем все индексы, чтобы старые чекбоксы не сливались.
  newChar.skills = {};
  for (var _si = 0; _si < skills.length; _si++) newChar.skills[_si] = false;
  var _skillIdxByName = function(name){
    for (var si = 0; si < skills.length; si++) if (skills[si].name === name) return si;
    return -1;
  };
  // Алиасы названий предысторий (старые переводы билдов → ключи BACKGROUND_SKILLS
  // и опции <select>). Таблица одна на всё приложение — BACKGROUND_ALIASES в data.js;
  // её же читает валидатор BUILD-FIX-6 в character-builds.js.
  var _bgAliases = (typeof BACKGROUND_ALIASES !== "undefined") ? BACKGROUND_ALIASES : {};
  var _bgKey = _bgAliases[b.background] || b.background;
  var _bgEntry = (typeof BACKGROUND_SKILLS !== "undefined") ? BACKGROUND_SKILLS[_bgKey] : null;
  if (_bgEntry && Array.isArray(_bgEntry.skills)) {
    _bgEntry.skills.forEach(function(n){ var si = _skillIdxByName(n); if (si >= 0) newChar.skills[si] = true; });
  }
  if (Array.isArray(b.skills)) {
    b.skills.forEach(function(n){ var si = _skillIdxByName(n); if (si >= 0) newChar.skills[si] = true; });
  }
  // BUILD-FIX-5: мировоззрение по умолчанию точно совпадает с опцией <select>
  newChar.alignment = b.alignment || "Истинно-нейтральное";
  // BUILD-FIX-5: при использовании пакета стартового снаряжения PHB монеты — карманные.
  // Раньше выдавали средний 4d4×10 (Class A) — это для альтернативного «купи сам».
  var _bGold = (b.startingMoney && typeof b.startingMoney.gp === "number") ? b.startingMoney.gp : 10;
  newChar.coins = { cp:0, sp:0, ep:0, gp:_bGold, pp:0 };
  // BUILD-FIX-1: HP на 1 уровне = max(hitDie) + conMod, AC = 10 + dexMod (база, calculateAC уточнит)
  var _conMod = Math.floor(((newChar.stats.con || 10) - 10) / 2);
  var _dexMod = Math.floor(((newChar.stats.dex || 10) - 10) / 2);
  var _hd = (typeof CLASS_HIT_DICE !== "undefined" && CLASS_HIT_DICE[b.className]) || 8;
  newChar.combat.hpMax = _hd + _conMod;
  newChar.combat.hpCurrent = newChar.combat.hpMax;
  newChar.combat.hpDice = "1к" + _hd;
  newChar.combat.hpDiceSpent = 0;
  newChar.combat.ac = 10 + _dexMod;
  // BUILD-FIX-2: владения брони/оружия класса + раса + подкласс
  newChar.proficiencies = { armor:[], weapon:[], armorCustom:[], weaponCustom:[], specificWeapons:[], armorSources:{}, weaponSources:{}, tools:[], toolChoices:{}, languages:[], languageChoices:{} };
  var _addProf = function(arr, val, src){
    if (!val) return;
    if (arr.indexOf(val) === -1) arr.push(val);
  };
  var _ca = (typeof CLASS_ARMOR_PROFS !== "undefined") && CLASS_ARMOR_PROFS[b.className];
  if (_ca) {
    (_ca.armor||[]).forEach(function(t){ _addProf(newChar.proficiencies.armor, t); });
    (_ca.weapon||[]).forEach(function(t){ _addProf(newChar.proficiencies.weapon, t); });
  }
  var _ra = (typeof RACE_ARMOR !== "undefined") && RACE_ARMOR[b.race];
  if (_ra) {
    (_ra.armor||[]).forEach(function(t){ _addProf(newChar.proficiencies.armor, t); });
    (_ra.weapon||[]).forEach(function(t){ _addProf(newChar.proficiencies.weapon, t); });
  }
  var _rw = (typeof RACE_WEAPONS_SPECIFIC !== "undefined") && RACE_WEAPONS_SPECIFIC[b.race];
  if (Array.isArray(_rw)) _rw.forEach(function(w){ _addProf(newChar.proficiencies.specificWeapons, w); });
  // FIN-2: конкретные владения класса (recalcArmorWeaponFromSources пересоберёт их же)
  var _cw = (typeof CLASS_WEAPONS_SPECIFIC !== "undefined") && CLASS_WEAPONS_SPECIFIC[b.className];
  if (Array.isArray(_cw)) _cw.forEach(function(w){ _addProf(newChar.proficiencies.specificWeapons, w); });
  var _sa = (typeof SUBCLASS_ARMOR !== "undefined") && SUBCLASS_ARMOR[b.className] && SUBCLASS_ARMOR[b.className][b.subclass];
  if (_sa) {
    (_sa.armor||[]).forEach(function(t){ _addProf(newChar.proficiencies.armor, t); });
    (_sa.weapon||[]).forEach(function(t){ _addProf(newChar.proficiencies.weapon, t); });
  }
  // BUILD-FIX-2: канонический ключ предыстории — чтобы recalc*FromSources видели её
  newChar.background = _bgKey;
  // BUILD-FIX-2: языки — заполняем languageChoices, recalcLanguagesFromSources соберёт массив
  var _stdLangs = ["Общий","Дварфский","Эльфийский","Великаний","Гномий","Гоблинский","Орочий","Полуросликов"];
  var _knownLangs = {};
  var _rl = (typeof RACE_LANGUAGES !== "undefined") && RACE_LANGUAGES[b.race];
  if (_rl) (_rl.fixed||[]).forEach(function(n){ _knownLangs[n] = true; });
  var _cl = (typeof CLASS_LANGUAGES !== "undefined") && CLASS_LANGUAGES[b.className];
  if (_cl) (_cl.fixed||[]).forEach(function(n){ _knownLangs[n] = true; });
  var _pickLangs = function(count){
    var picks = [];
    for (var i = 0; i < _stdLangs.length && picks.length < count; i++) {
      if (!_knownLangs[_stdLangs[i]]) { picks.push(_stdLangs[i]); _knownLangs[_stdLangs[i]] = true; }
    }
    return picks;
  };
  if (_rl && _rl.choice) newChar.proficiencies.languageChoices.race = _pickLangs(_rl.choice);
  var _bgLangs = (_bgEntry && typeof _bgEntry.languages === "number") ? _bgEntry.languages : 0;
  if (_bgLangs > 0) newChar.proficiencies.languageChoices.background = _pickLangs(_bgLangs);
  // BUILD-FIX-2: инструменты — заполняем toolChoices по слотам
  var TC = (typeof TOOL_CATALOG !== "undefined") ? TOOL_CATALOG : {};
  var _firstFrom = function(from){
    var froms = Array.isArray(from) ? from : [from];
    for (var i = 0; i < froms.length; i++) {
      var arr = TC[froms[i]] || [];
      if (arr.length) return arr[0].name;
    }
    return "";
  };
  // Предыстория: слоты-выборы → автозаполнение, фиксы recalc сам подхватит
  if (_bgEntry && Array.isArray(_bgEntry.tools) && typeof parseBackgroundToolEntry === "function") {
    _bgEntry.tools.forEach(function(entry, idx){
      var parsed = parseBackgroundToolEntry(entry);
      if (parsed.type === "slot") {
        var picks = [];
        for (var k = 0; k < (parsed.count||1); k++) {
          var name = _firstFrom(parsed.from);
          if (name && picks.indexOf(name) === -1) picks.push(name);
        }
        newChar.proficiencies.toolChoices["bg_" + idx] = picks;
      }
    });
  }
  // Класс: choices → автозаполнение
  var _ct = (typeof CLASS_TOOLS !== "undefined") && CLASS_TOOLS[b.className];
  if (_ct) {
    (_ct.choices||[]).forEach(function(ch, idx){
      var pool = [];
      var froms = Array.isArray(ch.from) ? ch.from : [ch.from];
      froms.forEach(function(f){ if (TC[f]) pool = pool.concat(TC[f]); });
      if (Array.isArray(ch.options)) pool = pool.filter(function(p){ return ch.options.indexOf(p.name) >= 0; });
      var picks = [];
      for (var k = 0; k < (ch.count||1) && k < pool.length; k++) {
        if (picks.indexOf(pool[k].name) === -1) picks.push(pool[k].name);
      }
      newChar.proficiencies.toolChoices["class_" + b.className + "_" + idx] = picks;
    });
  }
  // Раса: choices → автозаполнение
  var _rt = (typeof RACE_TOOLS !== "undefined") && RACE_TOOLS[b.race];
  if (_rt) {
    (_rt.choices||[]).forEach(function(ch, idx){
      var picks = [];
      if (Array.isArray(ch.options) && ch.options.length) {
        picks.push(ch.options[0]);
      } else {
        var n = _firstFrom(ch.from);
        if (n) picks.push(n);
      }
      newChar.proficiencies.toolChoices["race_" + idx] = picks;
    });
  }
  // BUILD-FIX-5: гарантируем все ячейки инвентаря
  ['weapon','armor','potion','scroll','tool','material','other'].forEach(function(k){
    if (!Array.isArray(newChar.inventory[k])) newChar.inventory[k] = [];
  });
  newChar.inventory.other.push({ name:"Обычная одежда", qty:1, weight:3, slots:1, location:"worn", desc:"Повседневный комплект (PHB)." });
  if (!Array.isArray(newChar.weapons)) newChar.weapons = [];
  // BUILD-FIX-5: авто-экип брони и щита из startingEquipment
  if (Array.isArray(b.startingEquipment) && typeof ARMOR_PRESETS !== "undefined") {
    var _eqLow = b.startingEquipment.map(function(s){ return String(s||"").toLowerCase(); });
    // FIN-3: единый матчер имён+алиасов (см. _findArmorPreset). Первая строка
    // снаряжения с распознанной бронёй выигрывает — у билдов ровно одна броня.
    var _bestPreset = null;
    for (var _ai = 0; _ai < b.startingEquipment.length && !_bestPreset; _ai++) {
      _bestPreset = _findArmorPreset(b.startingEquipment[_ai]);
    }
    if (_bestPreset) {
      newChar.combat.armorId = _bestPreset.id;
      var _dexBonus = _bestPreset.dexCap >= 99 ? _dexMod : Math.min(_dexMod, _bestPreset.dexCap);
      newChar.combat.ac = _bestPreset.baseAC + _dexBonus;
    }
    var _hasShield = _eqLow.some(function(s){ return s.indexOf("щит") >= 0; });
    if (_hasShield) {
      newChar.combat.hasShield = true;
      newChar.combat.ac = (newChar.combat.ac || 10) + 2;
    }
  }
  // BUILD-FIX-7: характеристика заклинаний по классу (PHB) — ru-uppercase,
  // как ожидают <select id="spell-stat">, calcSpellStats() и подсветка sc-btn-*.
  // Ранее BUILD-FIX-3 писал en-lowercase ("int"/"wis"/"cha") — select и atk/DC оставались пустыми.
  var _spellAbilityByClass = {
    "Волшебник":"ИНТ","Жрец":"МУД","Друид":"МУД","Бард":"ХАР",
    "Паладин":"ХАР","Следопыт":"МУД","Чародей":"ХАР","Колдун":"ХАР"
  };
  var _spellAb = _spellAbilityByClass[b.className] || "";
  if (_spellAb) newChar.spells.stat = _spellAb;
  // BUILD-FIX-3: ячейки заклинаний 1-го уровня (включая пактовые слоты колдуна)
  if (typeof SPELL_SLOTS_BY_LEVEL !== "undefined" && SPELL_SLOTS_BY_LEVEL[b.className]) {
    var _slotsRow = SPELL_SLOTS_BY_LEVEL[b.className][1] || [];
    for (var _li = 1; _li <= 9; _li++) {
      newChar.spells.slots[_li] = _slotsRow[_li] || 0;
      newChar.spells.slotsUsed[_li] = 0;
    }
  }
  if (b.startingSpells) {
    // BUILD-FIX-12: mySpells хранит ОБЪЕКТЫ заклинаний, не строки. Имена из билда
    // ищем в SPELL_DATABASE (case-insens), при промахе — лог + skip (иначе
    // renderMySpells даёт «UNDEFINED УРОВЕНЬ» из-за spell.level=undefined).
    var _spellByName = {};
    if (typeof SPELL_DATABASE !== "undefined" && Array.isArray(SPELL_DATABASE)) {
      for (var _si = 0; _si < SPELL_DATABASE.length; _si++) {
        var _sp = SPELL_DATABASE[_si];
        if (!_sp || !_sp.name) continue;
        var _snk = _sp.name.toLowerCase().trim();
        // Билды = PHB 2014: при дубле имени (PH14+PH24 версии в БД) в карту идёт PH14,
        // иначе «последний побеждает» отдавал билдам PH24-версии заклинаний.
        if (!_spellByName[_snk] || (_sp.source === "PH14" && _spellByName[_snk].source !== "PH14")) {
          _spellByName[_snk] = _sp;
        }
      }
    }
    // Карта алиасов: PHB-имя из билда → имя в SPELL_DATABASE.
    // Билды используют названия из dnd.su/PHB14, БД использует другие переводы.
    var _SPELL_ALIASES = {
      // REQ-5b (партия 1, заговоры): SPELL_DATABASE переименована в имена книги
      // PHB 2014 (PHantom). dnd.su-имена из билдов, что РАСХОДЯТСЯ с книгой, и
      // старые Fantom-имена (на случай легаси-данных) → имя книги в БД.
      "рука мага": "волшебная рука",   // Mage Hand: dnd.su «Рука мага» → книга «Волшебная рука»
      "насмешка": "злая насмешка",     // Vicious Mockery: dnd.su «Насмешка» → книга «Злая насмешка»
      "выработка": "искусство друидов",// Druidcraft: билд «Выработка» → книга «Искусство друидов»
      "шиллела": "дубинка",            // Shillelagh (транслит) → книга «Дубинка»
      // старые Fantom-имена заговоров → имена книги (резолвинг легаси)
      "огненный болт": "огненный снаряд",
      "луч мороза": "луч холода",
      "руководство": "указание",
      "священный огонь": "священное пламя",
      "дубина": "дубинка",
      "дружелюбие": "дружба",
      "друидический знак": "искусство друидов",
      "злобная насмешка": "злая насмешка",
      "защита клинком": "защита от оружия",
      "знаменательное послание": "сообщение",
      "истинный удар": "меткий удар",
      "кислота брызгами": "брызги кислоты",
      "могильный холод": "леденящее прикосновение",
      "пламя": "сотворение пламени",
      "пляшущие огни": "пляшущие огоньки",
      "поддержка умирающего": "уход за умирающим",
      "потрясение": "электрошок",
      "престидижитация": "фокусы",
      "терновый бич": "терновый кнут",
      "яд-брызги": "ядовитые брызги",
      // ——— REQ-5b партия 2 (ур.1): SPELL_DATABASE переименована в имена книги PHB 2014.
      // dnd.su = книга почти везде → резолвятся напрямую; здесь только расходящиеся
      // dnd.su/альт-имена → имя книги в БД.
      "сонливость": "усыпление",
      "удар грома": "волна грома", "снаряд-громовержец": "волна грома",
      "ложная жизнь": "псевдожизнь", "направляющий снаряд": "направленный снаряд",
      // Трек 3 QA: недокат REQ-5b — старые dnd.su-имена из билдов → имя книги в БД.
      "указующая стрела": "направленный снаряд",        // Guiding Bolt
      "приручение животных": "дружба с животными",       // Animal Friendship
      "божественная благосклонность": "божественное благоволение", // Divine Favor
      "добряника": "чудо-ягоды", "иллюзорные письмена": "невидимое письмо",
      "парящий диск тензера": "тензеров парящий диск", "намасливание": "скольжение",
      "цветной поток": "сверкающие брызги",
      "стрелы грома": "громовая кара",
      "смех таши": "жуткий смех таши",
      "охотничья метка": "метка охотника",
      "истинное видение": "истинное зрение",
      // старые Fantom-имена ур.1 (в массивах билдов / легаси-данных) → имя книги в БД.
      "адская расплата": "адское возмездие", "беззвучное изображение": "безмолвный образ",
      "божественная милость": "божественное благоволение", "броня агатиса": "доспех агатиса",
      "ведьмин болт": "ведьмин снаряд", "громовая волна": "волна грома", "яростная кара": "гневная кара",
      "защита от зла и добра": "защита от добра и зла", "слово исцеления": "лечащее слово",
      "направляющий болт": "направленный снаряд", "иллюзорный текст": "невидимое письмо",
      "обнаружение яда и болезни": "обнаружение болезней и яда", "обнаружение зла и добра": "обнаружение добра и зла",
      "огненные руки": "огненные ладони", "огни фей": "огонь фей", "очищение еды и питья": "очищение пищи и питья",
      "мягкое падение": "падение пёрышком", "ускоренное отступление": "поспешное отступление", "команда": "приказ",
      "мнимая жизнь": "псевдожизнь", "цветная россыпь": "сверкающие брызги", "сигнализация": "сигнал тревоги",
      "смазка": "скольжение", "длинный шаг": "скороход", "создать или уничтожить воду": "сотворение или уничтожение воды",
      "сон": "усыпление", "хроматическая сфера": "цветной шарик", "незримый слуга": "невидимый слуга",
      "жгучая кара": "палящая кара", "плавающий диск тенсера": "тензеров парящий диск", "живительная ягода": "чудо-ягоды",
      // SPELL-AUDIT-5: имена dnd.su (ур.8–9) → каноничные имена SPELL_DATABASE.
      // (ур.7 «радужные брызги»/«узилище» СНЯТЫ в REQ-5b п.8 — стали реальными именами БД,
      // резолвятся напрямую; легаси «призматический поток» репойнтнут на новое имя.)
      // REQ-5b п.10 (ур.9): Shapechange «Перевоплощение» → книжн. «Полное превращение»
      // (реальное имя БД) → «полное превращение» СНЯТ; легаси «перевоплощение»/«преображение» → новое.
      "призматический поток": "радужные брызги",
      "перевоплощение": "полное превращение", "преображение": "полное превращение",
      "помутнение разума": "слабоумие",
      // ——— REQ-5b партия 3 (ур.2): SPELL_DATABASE = имена книги PHB 2014. dnd.su = книга
      // почти везде → резолвятся напрямую; здесь старые Fantom-имена → имя книги в БД + dnd.su 2024-альты.
      "венец безумия": "корона безумия", "волшебное оружие": "магическое оружие", "говорящие уста": "волшебные уста",
      "гонец-животное": "почтовое животное", "духовное оружие": "божественное оружие", "жгучий луч": "палящий луч",
      "завораживание": "речь златоуста", "защитная связь": "охраняющая связь", "зеркальное отображение": "отражения",
      "зона правды": "область истины", "изменить облик": "смена обличья", "кислотная стрела мельфа": "мельфова кислотная стрела",
      "кора дерева": "дубовая кора", "магическая аура нистула": "нистулова ложная аура", "магический замок": "волшебный замок",
      "молитва об исцелении": "молебен лечения", "обнаружение невидимости": "видение невидимого", "огненная сфера": "пылающий шар",
      "огненный клинок": "горящий клинок", "определение животных или растений": "поиск животных или растений",
      "определение животных и растений": "поиск животных или растений", "определение предмета": "поиск предмета",
      "отмычка": "открывание", "паучье лазанье": "паук", "передвижение без следов": "бесследное передвижение",
      "покой": "нетленные останки", "помощь": "подмога", "предзнаменование": "гадание", "призрачная сила": "воображаемая сила",
      "размытие": "размытый образ", "раскалить металл": "раскалённый металл", "рост шипов": "шипы",
      "слепота/глухота": "глухота/слепота", "темнота": "тьма", "туча кинжалов": "облако кинжалов",
      "усиление способности": "улучшение характеристики", "успокоение эмоций": "умиротворение",
      "сияющая кара": "клеймящая кара", "дубовая кожа": "дубовая кора", "волшебная аура нистула": "нистулова ложная аура",
      "поиск объекта": "поиск предмета", "стук": "открывание", "обретение скакуна": "поиск скакуна",
      // ——— REQ-5b партия 4 (ур.3): SPELL_DATABASE = имена книги PHB 2014. Для ур.3
      // книга = dnd.su почти везде; здесь старые Fantom-имена → имя книги в БД (легаси/массивы билдов).
      "аура жизненности": "аура живучести", "большое изображение": "образ",
      "вампирское касание": "прикосновение вампира", "вонючее облако": "зловонное облако",
      "групповое слово исцеления": "множественное лечащее слово", "духи-хранители": "духовные стражи",
      "дыхание под водой": "подводное дыхание", "залп вызова": "призыв заграждения",
      "защита от стихии": "защита от энергии", "крохотная хижина леомунда": "леомундова хижина",
      "наложение проклятия": "проклятие", "необнаружение": "необнаружимость",
      // «оживление»→«возрождение» снят в партии 6 (ур.5): «Оживление» теперь
      // реальное имя БД (Raise Dead, бывш. «Поднятие мёртвых») — резолвится напрямую.
      "оживление мертвецов": "восставший труп",
      "ослепляющий удар": "ослепляющая кара", "охранный знак": "охранные руны",
      "притвориться мёртвым": "притворная смерть", "рассеять магию": "рассеивание магии",
      "снятие проклятия": "снятие проклятья", "создание еды и воды": "сотворение пищи и воды",
      "стена ветра": "стена ветров", "страх": "ужас",
      "элементальное оружие": "стихийное оружие", "ясновидение": "подсматривание",
      // ——— REQ-5b партия 5 (ур.4): SPELL_DATABASE = имена книги PHB 2014. Для ур.4 книга = dnd.su
      // почти везде → dnd.su-имена резолвятся напрямую. Здесь старые Fantom/PH24-имена (массивы билдов /
      // легаси-сохранёнки) → имя книги в БД.
      "аура чистоты": "аура очищения", "ледяной шторм": "град", "ледяная буря": "град",
      "определение существа": "поиск существа", "ошеломляющий удар": "оглушающая кара",
      "прорицание": "предсказание", "свобода передвижения": "свобода перемещения",
      "врата измерений": "переносящая дверь", "пространственная дверь": "переносящая дверь",
      "галлюцинаторная местность": "мираж", "галлюцинаторный рельеф": "мираж",
      "личное убежище морденкайнена": "кабинет морденкайнена", "личное убежище": "кабинет морденкайнена",
      "призрак-убийца": "воображаемый убийца", "фантомный убийца": "воображаемый убийца",
      "тайный сундук леомунда": "леомундов потайной сундук", "тайный сундук": "леомундов потайной сундук",
      "управление водой": "власть над водами", "власть над водой": "власть над водами",
      "упругая сфера отилюка": "отилюков упругий шар", "упругая сфера": "отилюков упругий шар",
      "формование камня": "изменение формы камня", "преобразование камня": "изменение формы камня",
      "верный пёс": "верный пёс морденкайнена", "иссыхание": "усыхание",
      "улучшенная невидимость": "высшая невидимость", "страж смерти": "защита от смерти",
      "замешательство": "смятение", "полиморф": "превращение",
      "призыв существ леса": "призыв лесных обитателей", "хватающая лоза": "цепкая лоза",
      "чёрные щупальца эварда": "эвардовы чёрные щупальца", "чёрные щупальца": "эвардовы чёрные щупальца",
      // ——— REQ-5b партия 6 (ур.5): SPELL_DATABASE = имена книги PHB 2014 (глоссарий
      // стр.314–320). Старые Fantom/PH24-имена (массивы билдов / легаси) → имя книги в БД.
      "болезнь": "заражение", "изгоняющий удар": "изгоняющая кара", "кисть бигби": "длань бигби",
      "контакт с иным планом": "связь с иным миром", "массовое лечение ран": "множественное лечение ран",
      "оживление предметов": "оживление вещей", "оболочка против жизни": "преграда жизни",
      "огненный удар": "небесный огонь", "поднятие мёртвых": "оживление", "пробуждение": "пробуждение разума",
      "рассеять добро и зло": "рассеивание добра и зла", "созидание": "сотворение",
      "стена камня": "каменная стена", "стена силы": "силовая стена",
      "телепатическая связь рарыса": "ментальная связь рэри", "легенды и предания": "знание легенд",
      "личина": "притворство", "магическое связывание": "планарные узы", "обман": "фальшивый двойник",
      "освящение": "святилище", "прогулка по деревьям": "древесный путь", "стремительный колчан": "быстрый колчан",
      "знание преданий": "знание легенд", "привязка к плану": "планарные узы",
      "проход сквозь стену": "создание прохода",
      // ——— REQ-5b партия 7 (ур.6): SPELL_DATABASE = имена книги PHB 2014 (глоссарий
      // стр.314–320). Старые Fantom/dnd.su-имена (массивы билдов / легаси) → имя книги в БД.
      "воздушная прогулка": "хождение по ветру", "вред": "поражение", "дезинтеграция": "распад",
      "дурной глаз": "разящее око", "исцеление": "полное исцеление",
      "ледяная сфера отилюка": "отилюков ледяной шар", "ледяная сфера оттилюка": "отилюков ледяной шар",
      "магический сосуд": "волшебный сосуд", "массовое внушение": "множественное внушение",
      "мгновенный вызов дравмия": "дромиджево появление", "непредвиденный случай": "предосторожность",
      "неудержимый танец отто": "неудержимая пляска отто", "охрана и защита": "стражи",
      "перемещение через растения": "путешествие через растения", "плоть в камень": "окаменение",
      "программируемая иллюзия": "заданная иллюзия", "сдвинуть землю": "движение почвы",
      "искривление земли": "движение почвы",
      "слово призыва": "слово возврата", "создание нежити": "сотворение нежити",
      "союзник с иного плана": "планарный союзник", "стена льда": "ледяная стена",
      "стена шипов": "терновая стена", "цепная молния": "пляшущая молния",
      "шар неуязвимости": "сфера неуязвимости",
      // ——— REQ-5b партия 8 (ур.7): SPELL_DATABASE = имена книги PHB 2014 (глоссарий
      // стр.314–320). Книга часто РАСХОДИТСЯ со старыми Fantom-именами → старые имена
      // (массивы билдов / легаси-сохранёнки) → имя книги в БД.
      "обратная гравитация": "изменение тяготения", "призматический луч": "радужные брызги",
      "проекция образа": "проекция", "роскошный особняк морденкайнена": "великолепный особняк морденкайнена",
      "великолепный особняк": "великолепный особняк морденкайнена", "секвестр": "изоляция",
      "силовая клетка": "узилище", "символ": "знак", "симулякр": "подобие",
      "слово богов": "божественное слово", "смена плана": "уход в иной мир",
      // ——— REQ-5b партия 9 (ур.8): SPELL_DATABASE = имена книги PHB 2014 (глоссарий
      // стр.314–320). Книга расходится со старыми Fantom-именами → старые имена (массивы
      // билдов / легаси-сохранёнки) → имя книги в БД. NB: «двойник» СНЯТ выше (Clone «Клон»
      // → книжн. «Двойник» — реальное имя БД); PH24 Befuddlement «Оцепенение» сведён к
      // книжн. «Слабоумие» (= PH14), «помутнение разума» репойнтнут на «слабоумие».
      "антимагическое поле": "преграда магии", "блокировка разума": "сокрытие разума",
      "клон": "двойник", "огненное облако": "воспламеняющаяся туча",
      "полуплан": "демиплан", "речистость": "находчивость",
      "священная аура": "аура святости", "солнечная вспышка": "солнечный ожог",
      "формы животных": "превращение в животных", "оцепенение": "слабоумие",
      // ——— REQ-5b партия 10 (ур.9, последняя): SPELL_DATABASE = имена книги PHB 2014
      // (глоссарий стр.314–320). Старые Fantom/dnd.su-имена (массивы билдов / легаси) →
      // имя книги в БД. Shapechange «Перевоплощение» → «Полное превращение» — выше.
      // Power Word: case-fix «Слово силы:» → «Слово Силы:» резолвится регистронезависимо
      // (ключи lowercase) → отдельные алиасы не нужны.
      "астральная проекция": "проекция в астрал", "буря мести": "гроза гнева", "буря мщения": "гроза гнева",
      "заключение": "заточение", "кошмарное видение": "смертный ужас",
      "массовое исцеление": "множественное полное исцеление",
      "призматическая стена": "радужная стена", "рой метеоров": "метеоритный дождь"
    };
    function _resolveSpell(n) {
      if (!n) return null;
      if (typeof n === "object") return n; // уже объект
      var key = String(n).toLowerCase().trim();
      // Нормализация: ё↔е, убрать «(ритуал)»/«(концентрация)» суффиксы.
      var alt = key.replace(/ё/g, "е").replace(/\s*\([^)]*\)\s*$/, "").trim();
      var aliased = _SPELL_ALIASES[key] || _SPELL_ALIASES[alt];
      return _spellByName[key] || _spellByName[alt] || (aliased && _spellByName[aliased]) || null;
    }
    var _missing = [];
    function _pushResolved(arr) {
      if (!Array.isArray(arr)) return;
      arr.forEach(function(n){
        var sp = _resolveSpell(n);
        if (sp) {
          if (!newChar.spells.mySpells.some(function(x){ return x.id === sp.id; })) {
            newChar.spells.mySpells.push(sp);
          }
        } else if (typeof n === "string") {
          _missing.push(n);
        }
      });
    }
    _pushResolved(b.startingSpells.cantrips);
    _pushResolved(b.startingSpells.known);
    // BUILD-FIX-13: канонизируем имена prepared под SPELL_DATABASE (как mySpells),
    // иначе отметка «подготовлено» не привязывается к объекту заклинания
    // (например prepared "Сонливость" не совпадал с mySpells "Сон").
    var _canonName = function(n){ var sp = _resolveSpell(n); return (sp && sp.name) ? sp.name : n; };
    if (Array.isArray(b.startingSpells.prepared)) {
      b.startingSpells.prepared.forEach(function(n){
        var cn = _canonName(n);
        if (newChar.spells.prepared.indexOf(cn) === -1) newChar.spells.prepared.push(cn);
      });
    }
    // BUILD-FIX-3/13: для подготовленных классов (волшебник/жрец/друид/паладин) —
    // если в билде не указан prepared, авто-подготавливаем известные заклинания.
    // Заговоры в prepared не нужны — они всегда подготовлены. Имена канонизируем.
    var _preparedCasters = { "Волшебник":1, "Жрец":1, "Друид":1, "Паладин":1 };
    if (_preparedCasters[b.className] &&
        (!Array.isArray(b.startingSpells.prepared) || b.startingSpells.prepared.length === 0) &&
        Array.isArray(b.startingSpells.known)) {
      b.startingSpells.known.forEach(function(n){
        var cn = _canonName(n);
        if (newChar.spells.prepared.indexOf(cn) === -1) newChar.spells.prepared.push(cn);
      });
    }
    if (_missing.length) {
      console.warn("[BUILD-FIX-12] " + b.id + ": заклинания не найдены в SPELL_DATABASE:", _missing);
    }
  }
  // BUILD-FIX-5: умная категоризация startingEquipment
  if (Array.isArray(b.startingEquipment)) {
    // Развёрнутые описания наборов снаряжения PHB
    // BUILD-FIX-9 (rev3): формат [name, qty, weight, slots, location, desc].
      // location: backpack/worn/wielded/belt/outside/stored. Сам рюкзак — worn (на спине).
      // При снятии рюкзака (toggleBackpackOff) предметы с location:"backpack" выпадают
      // из расчёта слотов и помечаются (в снятом рюкзаке).
      // FIN-5: наборы вынесены в data.js (window.GEAR_PACKS) — нужны и пикеру снаряжения.
      // Ключи-строки не менять: по ним lowercase-подстрочный матч ниже.
      var _PACKS = (typeof GEAR_PACKS !== "undefined") ? GEAR_PACKS : (window.GEAR_PACKS || {});
    // Описания и веса для частых одиночных предметов и боеприпасов
    // BUILD-FIX-9 (rev): добавлено поле slots — сколько слотов рюкзака занимает 1 шт.
    var _GEAR_DB = {
      "болты": { cat:"other", weight:1.5, qty:20, slots:0, desc:"Боеприпасы для арбалета." },
      "стрелы": { cat:"other", weight:1, qty:20, slots:0, desc:"Боеприпасы для лука." },
      "иглы": { cat:"other", weight:1, qty:20, slots:0, desc:"Боеприпасы для духовой трубки." },
      "колчан": { cat:"other", weight:1, slots:0, desc:"Хранит до 20 стрел." },
      "сумка с компонентами": { cat:"material", weight:2, slots:1, desc:"Материальные компоненты для заклинаний." },
      "мешочек с компонентами": { cat:"material", weight:2, slots:1, desc:"Материальные компоненты для заклинаний." },
      "компонентный мешочек": { cat:"material", weight:2, slots:1, desc:"Материальные компоненты для заклинаний." },
      "компонентная сумка": { cat:"material", weight:2, slots:1, desc:"Материальные компоненты для заклинаний." },
      "магическая фокусировка": { cat:"material", weight:2, slots:1, desc:"Заменяет компоненты без указанной цены." },
      "фокусировка": { cat:"material", weight:2, slots:1, desc:"Магическая фокусировка для класса." },
      "книга заклинаний": { cat:"other", weight:3, slots:1, desc:"6 заклинаний 1 уровня. Источник магии волшебника." },
      "священный символ": { cat:"material", weight:1, slots:0, desc:"Фокусировка жреца/паладина." },
      "друидическая фокусировка": { cat:"material", weight:1, slots:0, desc:"Омела, тотем, посох — фокусировка друида." },
      "лютня": { cat:"tool", weight:2, slots:1, desc:"Музыкальный инструмент барда." },
      "флейта": { cat:"tool", weight:1, slots:0, desc:"Музыкальный инструмент." },
      "лира": { cat:"tool", weight:2, slots:1, desc:"Музыкальный инструмент." },
      "воровские инструменты": { cat:"tool", weight:1, slots:1, desc:"Отмычки, щупы. Для замков и ловушек." },
      "набор травника": { cat:"tool", weight:3, slots:1, desc:"Изготовление зелий и противоядий." },
      "набор для грима": { cat:"tool", weight:3, slots:1, desc:"Краски, парики, маски." },
      "ремесленный инструмент": { cat:"tool", weight:5, slots:1, desc:"Инструменты ремесленника." },
      "молитвенник": { cat:"other", weight:5, slots:1, desc:"Сборник молитв." },
      "пергамент": { cat:"other", weight:0, slots:0, desc:"Чистые листы." },
      "чернила": { cat:"other", weight:0, slots:0, desc:"Флакон чернил." },
      "свеча": { cat:"other", weight:0, slots:0, desc:"Свет 1.5 м на 1 час." },
      "факел": { cat:"other", weight:1, slots:0, desc:"Свет 6 м на 1 час." },
      "верёвка": { cat:"other", weight:10, slots:1, desc:"Пеньковая 15 м." },
      "бурдюк": { cat:"other", weight:5, slots:1, desc:"4 л воды." },
      "лом": { cat:"tool", weight:5, slots:1, desc:"Преимущество на СИЛ при взломе." },
      "сеть": { cat:"weapon-special", weight:3, slots:1, desc:"Опутывает врага. Бросок 5/15 фт." },
      "лошадь": { cat:"other", weight:0, slots:0, desc:"Скакун." },
      "седло": { cat:"other", weight:25, slots:2, desc:"Верховое седло." }
    };
    // Парсер количества из имени: "Болты (20)" / "4 метательных топора"
    var _parseQty = function(nm){
      var m = nm.match(/\((\d+)\)/);
      if (m) return parseInt(m[1], 10);
      m = nm.match(/^(\d+)\s+/);
      if (m) return parseInt(m[1], 10);
      return 1;
    };
    var _findArmor = _findArmorPreset; // FIN-3: единый матчер имён+алиасов
    b.startingEquipment.forEach(function(rawName){
      var name = String(rawName || "").trim();
      if (!name) return;
      var lo = name.toLowerCase();
      // 1. Наборы PHB — BUILD-FIX-9 (rev): разворачиваем в детальный список,
      // НО мелочь (свечи/факелы/рационы пачкой/чернила/перо/пергамент/колышки/масло…)
      // получает slots:0 — не «съедает» рюкзак. Контейнеры/крупное — slots:1+.
      var packKey = null;
      Object.keys(_PACKS).forEach(function(k){ if (lo.indexOf(k) >= 0) packKey = k; });
      if (packKey) {
        _PACKS[packKey].forEach(function(p){
          newChar.inventory.other.push({ name:p[0], qty:p[1], weight:p[2], slots:p[3], location:p[4], desc:p[5] });
        });
        return;
      }
      // 2. Оружие — основное (1-е) идёт в руку, остальное на поясе
      var w = _findWeapon(name);
      if (w) {
        var prof = (typeof checkWeaponProficiency === "function") ? checkWeaponProficiency(newChar, w.name) : true;
        newChar.weapons.push({
          name: w.name, stat: w.stat, statName: w.stat === "str" ? "СИЛ" : "ЛОВ",
          bonus: w.bonus, damage: w.damage, type: w.type, range: w.range, notes: w.notes, proficient: prof
        });
        var _wLoc = (newChar.inventory.weapon.length === 0) ? "wielded" : "belt";
        newChar.inventory.weapon.push({
          name: w.name, qty: 1, weight: 0, location: _wLoc,
          desc: (w.damage ? w.damage + " " + w.type + ". " : "") + (w.range ? "Дистанция: " + w.range + ". " : "") + (w.notes || "")
        });
        return;
      }
      // 3. Броня — надета на тело
      var a = _findArmor(name);
      if (a) {
        newChar.inventory.armor.push({
          name: a.name, qty: 1, weight: 0, location: "worn",
          desc: "База КД " + a.baseAC + (a.dexCap < 99 ? ", макс. ЛОВ +" + a.dexCap : ", полный ЛОВ") + ". Тип: " + a.type + "."
        });
        return;
      }
      // 4. Щит — в руке
      if (lo.indexOf("щит") >= 0) {
        newChar.inventory.armor.push({ name:"Щит", qty:1, weight:6, location:"wielded", desc:"+2 КД. Требует одну руку." });
        return;
      }
      // 5. Известное снаряжение из каталога
      var gearHit = null;
      Object.keys(_GEAR_DB).forEach(function(k){ if (lo.indexOf(k) >= 0 && (!gearHit || k.length > gearHit.length)) gearHit = k; });
      if (gearHit) {
        var g = _GEAR_DB[gearHit];
        var qty = _parseQty(name) || g.qty || 1;
        var cat = g.cat === "weapon-special" ? "weapon" : g.cat;
        var _gSlots = (g.slots !== undefined) ? g.slots : ((g.weight || 0) <= 1 ? 0 : undefined);
        // BUILD-FIX-9 (rev3): location по типу — фокусировки/символы/инструменты на поясе,
        // боеприпасы/книги/мелочь в рюкзаке.
        var _gLoc = g.loc || (
          (cat === "material" || /символ|фокусировка|воровские|инструмент|лютня|флейта|лира/.test(gearHit)) ? "belt" :
          (cat === "tool") ? "backpack" :
          "backpack"
        );
        newChar.inventory[cat].push({ name: name.replace(/\s*\(\d+\)/, ""), qty: qty, weight: g.weight || 0, slots: _gSlots, location: _gLoc, desc: g.desc || "" });
        return;
      }
      // 6. Прочее — пачка (qty>1) → slots:0, в рюкзаке.
      var qty2 = _parseQty(name);
      newChar.inventory.other.push({ name: name.replace(/^\d+\s+/, "").replace(/\s*\(\d+\)/, ""), qty: qty2, weight: 0, slots: (qty2 > 1 ? 0 : undefined), location: "backpack", desc: "" });
    });
  }
  // BUILD-FIX-5: заметки персонажа из предыстории (внешность/личность/идеалы/связи/слабости).
  var _BG_NOTES = {
    "Воин":       { personality:"Прямой, дисциплинированный, доверяет товарищам по оружию.", ideals:"Долг. Каждый солдат обязан исполнить свой долг.", bonds:"Я бы умер за людей, с которыми служил.", flaws:"Слепо подчиняюсь приказам, даже сомнительным." },
    "Солдат":     { personality:"Прямой, дисциплинированный, доверяет товарищам по оружию.", ideals:"Долг. Каждый солдат обязан исполнить свой долг.", bonds:"Я бы умер за людей, с которыми служил.", flaws:"Слепо подчиняюсь приказам, даже сомнительным." },
    "Преступник": { personality:"Всегда продумываю запасной план на случай провала.", ideals:"Свобода. Цепи — это для других.", bonds:"Я в долгу перед тем, кто помог мне сменить путь.", flaws:"Когда удобно — обманываю даже близких." },
    "Шарлатан":   { personality:"У меня всегда заготовлена правдоподобная легенда.", ideals:"Независимость. Никто не указывает мне путь.", bonds:"Жертвы моих обманов однажды найдут меня.", flaws:"Не могу удержаться, чтобы не воспользоваться доверчивым." },
    "Беспризорник":{ personality:"Держусь настороже и подмечаю каждый закоулок.", ideals:"Общность. Мы должны заботиться друг о друге — больше некому.", bonds:"Я выжил на улице благодаря другому такому же — теперь мой черёд помогать.", flaws:"Беру нужное молча: это не воровство, если мне это нужнее." },
    "Послушник":  { personality:"Тихая молитва — мой ответ на любую тревогу.", ideals:"Вера. Боги ведут меня даже там, где я не вижу пути.", bonds:"Мой храм — то, ради чего я пошёл в мир.", flaws:"Не доверяю никому вне своей веры." },
    "Прислужник": { personality:"Тихая молитва — мой ответ на любую тревогу.", ideals:"Вера. Боги ведут меня даже там, где я не вижу пути.", bonds:"Мой храм — то, ради чего я пошёл в мир.", flaws:"Не доверяю никому вне своей веры." },
    "Аколит":     { personality:"Цитирую священные тексты в любых разговорах.", ideals:"Вера. Я орудие воли своего божества.", bonds:"Я бы умер, чтобы вернуть утраченную реликвию своего храма.", flaws:"Слишком сильно полагаюсь на догмы." },
    "Дворянин":   { personality:"Привык, что слово моего имени открывает двери.", ideals:"Благородство. Высокое положение — высокая ответственность.", bonds:"Семья — то, ради чего стоит идти на любые жертвы.", flaws:"Не выношу несправедливого обращения с собой." },
    "Благородный":{ personality:"Привык, что слово моего имени открывает двери.", ideals:"Благородство. Высокое положение — высокая ответственность.", bonds:"Семья — то, ради чего стоит идти на любые жертвы.", flaws:"Не выношу несправедливого обращения с собой." },
    "Артист":     { personality:"Каждое появление — небольшое представление.", ideals:"Красота. Когда я выступаю, я возвышаю мир.", bonds:"Кто-то однажды дал мне шанс выступить — я в долгу.", flaws:"Падок на лесть и аплодисменты." },
    "Дикарь":     { personality:"Чувствую себя свободно только под открытым небом.", ideals:"Природа. Цивилизация портит душу.", bonds:"Племя/клан — мой настоящий дом.", flaws:"С трудом выношу запах и шум городов." },
    "Чужеземец":  { personality:"Чувствую себя свободно только под открытым небом.", ideals:"Природа. Цивилизация портит душу.", bonds:"Племя/клан — мой настоящий дом.", flaws:"С трудом выношу запах и шум городов." },
    "Мудрец":     { personality:"Я всегда могу что-то процитировать по теме.", ideals:"Знание. Понять мир — высшая цель.", bonds:"Моя библиотека — то, что я защищаю превыше всего.", flaws:"Готов рисковать жизнью ради редкой книги." },
    "Отшельник":  { personality:"Молчаливый, наблюдательный, выбираю слова.", ideals:"Просветление. Уединение открыло мне истину.", bonds:"Моё открытие должно изменить мир.", flaws:"Прежде сделаю — потом подумаю о социальных последствиях." },
    "Герой народа":{personality:"Простые люди — мои настоящие друзья.", ideals:"Справедливость. Тираны не должны властвовать.", bonds:"Я защищаю тех, кто не может защитить себя.", flaws:"Не доверяю аристократам и магам." },
    "Бродяга":    { personality:"Привык спать под открытым небом и довольствоваться малым.", ideals:"Свобода. Никаких корней — никаких цепей.", bonds:"Один человек когда-то был ко мне добр — за это я готов на всё.", flaws:"Беру чужое легче, чем нужно." },
    "Гильд-артист":{personality:"Я мастер своего дела и горжусь этим.", ideals:"Сообщество. Гильдия — моя семья.", bonds:"Мастерская/инструмент — символ всей моей жизни.", flaws:"Всё измеряю в монетах и контрактах." },
    "Подмастерье":{ personality:"Я мастер своего дела и горжусь этим.", ideals:"Сообщество. Гильдия — моя семья.", bonds:"Мастерская/инструмент — символ всей моей жизни.", flaws:"Всё измеряю в монетах и контрактах." },
    "Моряк":      { personality:"Сыплю морскими байками и солёными шутками.", ideals:"Свобода. Открытое море — настоящая жизнь.", bonds:"Команда корабля — моя истинная семья.", flaws:"Авторитеты на суше меня раздражают." },
    "Матрос":     { personality:"Сыплю морскими байками и солёными шутками.", ideals:"Свобода. Открытое море — настоящая жизнь.", bonds:"Команда корабля — моя истинная семья.", flaws:"Авторитеты на суше меня раздражают." },
    "Торговец":   { personality:"Всегда оцениваю собеседника как потенциального клиента.", ideals:"Честная сделка — основа любого общества.", bonds:"Торговая марка моей семьи — то, ради чего стоит сражаться.", flaws:"Не отказываю себе в выгодной возможности." }
  };
  if (!newChar.notesV2) newChar.notesV2 = { sections:{appearance:"",personality:"",backstory:"",features:"",magicItems:"",bonds:"",flaws:"",ideals:""}, entries:[], prefs:{lastSection:'backstory',lastFilter:'all'} };
  var _bgNoteKey = _bgAliases[b.background] || b.background;
  var _bgNote = _BG_NOTES[_bgNoteKey] || _BG_NOTES[b.background] || null;
  // BUILD-FIX-11 / BUILD-NOTES-1: персонализированные заметки билда. Поля — массивы вариантов.
  var _bn = (b.notes && typeof b.notes === "object") ? (window.normalizeBuildNotes ? window.normalizeBuildNotes(b.notes) : b.notes) : null;
  var _NS = newChar.notesV2.sections;
  var _seed = newChar.id || "";
  function _pick(arr) { return (window.pickBuildVariant ? window.pickBuildVariant(arr, _seed) : (Array.isArray(arr) && arr.length ? arr[0] : "")); }
  // Сохраняем все варианты на персонажа — для UI «🎲 вариант» (BUILD-NOTES-2).
  if (_bn) {
    newChar.notesV2.variants = {
      appearance: _bn.appearance || [],
      personality: _bn.personality || [],
      ideals: _bn.ideals || [],
      bonds: _bn.bonds || [],
      flaws: _bn.flaws || [],
      hooks: _bn.hooks || [],
      backstories: _bn.backstories || []
    };
  }
  if (!_NS.appearance) _NS.appearance = (_bn && _pick(_bn.appearance))
      || ((b.race ? b.race + ". " : "") + "Выглядит как опытный «" + (b.title || b.className || "искатель приключений") + "». Заполни внешность под свой образ.");
  if (!_NS.personality) _NS.personality = (_bn && _pick(_bn.personality)) || (_bgNote && _bgNote.personality) || "Опиши характер своего персонажа: что движет, как держится в обществе, как реагирует на угрозу.";
  if (!_NS.ideals)      _NS.ideals      = (_bn && _pick(_bn.ideals))      || (_bgNote && _bgNote.ideals)      || "Чему служит твой персонаж — долгу, свободе, знанию, вере?";
  if (!_NS.bonds)       _NS.bonds       = (_bn && _pick(_bn.bonds))       || (_bgNote && _bgNote.bonds)       || "Что или кого твой персонаж готов защищать ценой жизни?";
  if (!_NS.flaws)       _NS.flaws       = (_bn && _pick(_bn.flaws))       || (_bgNote && _bgNote.flaws)       || "Какая слабость или порок может однажды его погубить?";
  // BUILD-FIX-4: стартовая заметка из b.summary + краткий план первых уровней.
  if (!newChar.notesV2) newChar.notesV2 = { sections:{appearance:"",personality:"",backstory:"",features:"",magicItems:"",bonds:"",flaws:"",ideals:""}, entries:[], prefs:{lastSection:'backstory',lastFilter:'all'} };
  var _bsLines = [];
  _bsLines.push("# " + (b.title || ""));
  if (b.role || b.difficulty) {
    var _diff = b.difficulty ? (" · сложность " + b.difficulty + "/3") : "";
    _bsLines.push("_" + (b.role || "") + _diff + "_");
  }
  if (b.summary) _bsLines.push("\n" + b.summary);
  if (b.levelUp) {
    _bsLines.push("\n## План развития (1–5)");
    [1,2,3,4,5].forEach(function(lv){
      var step = b.levelUp[lv];
      if (step && step.headline) _bsLines.push("- **" + lv + ":** " + step.headline + (step.why ? " — " + step.why : ""));
    });
  }
  // BUILD-FIX-11: сюжетные крючки в backstory.
  if (_bn && Array.isArray(_bn.hooks) && _bn.hooks.length) {
    _bsLines.push("\n## Сюжетные крючки");
    _bn.hooks.forEach(function(h){ if (h) _bsLines.push("- " + h); });
  }
  var _bs = _bsLines.join("\n");
  if (!newChar.notesV2.sections.backstory) newChar.notesV2.sections.backstory = _bs;
  newChar.notesV2.prefs = newChar.notesV2.prefs || { lastSection:'backstory', lastFilter:'all' };
  newChar.notesV2.entries = newChar.notesV2.entries || [];
  newChar.notesV2.entries.push({
    id: "build-" + b.id + "-" + Date.now(),
    type: "free",
    title: "Билд применён: " + (b.title || ""),
    body: (b.summary || "") + (b.role ? "\n\nРоль: " + b.role : ""),
    tags: ["билд", b.className || ""].filter(Boolean),
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  // BUILD-LVL-3/5: авто-применить рекомендованные выборы 1-го уровня
  // (стиль боя воина — single; экспертиза плута — multi, до getCount навыков).
  if (b.recommendedChoices && typeof CLASS_CHOICES !== "undefined" && CLASS_CHOICES[b.className]) {
    newChar.classChoices = newChar.classChoices || {};
    newChar.classChoices[b.className] = newChar.classChoices[b.className] || {};
    CLASS_CHOICES[b.className].forEach(function(cc){
      if (cc.minLevel > 1) return;
      var rec = b.recommendedChoices[cc.id];
      if (!rec) return;
      if (cc.type === "single") {
        newChar.classChoices[b.className][cc.id] = Array.isArray(rec) ? rec[0] : rec;
      } else if (cc.type === "multi") {
        var recArr = Array.isArray(rec) ? rec.slice() : [rec];
        var count = (typeof ccCount === "function") ? ccCount(cc, 1) : recArr.length;
        newChar.classChoices[b.className][cc.id] = recArr.slice(0, count);
      }
    });
  }
  newChar.updatedAt = Date.now();
  characters.push(newChar);
  saveToLocal();
  // Пикер закрывать не нужно: loadCharacter сам уводит на экран листа.
  loadCharacter(newChar.id);
  if (typeof showToast === "function") showToast("Билд применён: " + b.title, "success");
  // BUILD-DESC-3: открыть модалку с гайдом по билду сразу после применения.
  if (b.guide) setTimeout(function(){ openBuildGuide(b.id); }, 250);
}

// ── UX-4: глоссарий-тултипы ──────────────────────────────────────────────────
// Оборачиваем известные игровые термины в гайдах билдов в <span class="gloss">
// с поповером-расшифровкой (паттерн поповеров дайс-модала, без библиотек).
// Данные — window.GLOSSARY (glossary-data.js). Совпадение по границам слов:
// термин не сработает внутри слова. Только первое вхождение в гайде подсвечивается.
// E24-1: индекс глоссария строится ПО РЕДАКЦИИ. Кэш на редакцию: набор '2014' —
// только window.GLOSSARY; '2024' — GLOSSARY + window.GLOSSARY_2024 (последний
// переопределяет базу по нормализованному ключу термина). Вызов без edition даёт
// '2014' — прежнее поведение гайдов билдов не меняется.
var _GLOSS_CACHE = {}, _glossActiveEl = null;
function _glossNorm(s) { return String(s == null ? "" : s).toLowerCase().replace(/ё/g, "е").trim(); }
function _reEscape(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function _glossEd(edition) { return (edition === "2024") ? "2024" : "2014"; }
function _glossBuild(edition) {
  var map = {}, terms = [];
  function ingest(entries, override) {
    if (!Array.isArray(entries)) return;
    entries.forEach(function(e) {
      if (!e || typeof e.def !== "string" || !Array.isArray(e.terms)) return;
      e.terms.forEach(function(term) {
        var key = _glossNorm(term);
        if (!key) return;
        if (override || !map[key]) map[key] = e; // 2024-запись перекрывает базовую
        terms.push(term);
      });
    });
  }
  if (typeof window !== "undefined") {
    ingest(window.GLOSSARY, false);
    if (edition === "2024") ingest(window.GLOSSARY_2024, true);
  }
  if (!terms.length) return { re: false, map: map };
  // Длиннее — раньше: составные термины («Метка охотника») имеют приоритет над частями.
  terms.sort(function(a, b) { return b.length - a.length; });
  var L = "A-Za-zА-Яа-яЁё0-9_";
  return { re: new RegExp("(^|[^" + L + "])(" + terms.map(_reEscape).join("|") + ")(?![" + L + "])", "gi"), map: map };
}
function _glossIndex(edition) {
  edition = _glossEd(edition);
  if (!_GLOSS_CACHE[edition]) _GLOSS_CACHE[edition] = _glossBuild(edition);
  return _GLOSS_CACHE[edition];
}
// Принимает УЖЕ экранированный HTML; seen — объект {key:true} для подсветки только
// первого вхождения каждого термина в пределах одного гайда. edition (по умолч. '2014')
// выбирает набор терминов; на не-2014 к span добавляется data-gloss-ed для поповера.
function glossarizeHtml(escaped, seen, edition) {
  edition = _glossEd(edition);
  var idx = _glossIndex(edition);
  if (!idx.re || !escaped) return escaped || "";
  var edAttr = (edition === "2024") ? ' data-gloss-ed="2024"' : "";
  return String(escaped).replace(idx.re, function(_m, lead, term) {
    var key = _glossNorm(term);
    var entry = idx.map[key];
    if (!entry) return _m;
    if (seen) { if (seen[key]) return lead + term; seen[key] = true; }
    return lead + '<span class="gloss" tabindex="0" role="button" aria-label="Термин: ' + term +
      '" data-gloss="' + key + '"' + edAttr + '>' + term + '</span>';
  });
}
function _glossPopoverEl() {
  var el = document.getElementById("gloss-popover");
  if (!el) {
    el = document.createElement("div");
    el.id = "gloss-popover";
    el.className = "gloss-popover";
    el.setAttribute("role", "tooltip");
    el.hidden = true;
    document.body.appendChild(el);
  }
  return el;
}
function hideGlossPopover() {
  var pop = document.getElementById("gloss-popover");
  if (pop) pop.hidden = true;
  if (_glossActiveEl) { _glossActiveEl.classList.remove("is-active"); _glossActiveEl = null; }
}
function showGlossPopover(span) {
  var key = span.getAttribute("data-gloss");
  var idx = _glossIndex(span.getAttribute("data-gloss-ed"));
  var entry = idx.map && idx.map[key];
  if (!entry) return;
  var pop = _glossPopoverEl();
  pop.innerHTML = '<span class="gloss-term">' + escapeHtml(entry.term || "") +
    '</span><span class="gloss-def">' + escapeHtml(entry.def || "") + '</span>';
  pop.hidden = false;
  var r = span.getBoundingClientRect();
  var pw = pop.offsetWidth, ph = pop.offsetHeight;
  var left = Math.min(Math.max(8, r.left), Math.max(8, window.innerWidth - pw - 8));
  var top = r.bottom + 8;
  if (top + ph > window.innerHeight - 8) top = r.top - ph - 8; // не влезает снизу — показываем сверху
  pop.style.left = left + "px";
  pop.style.top = Math.max(8, top) + "px";
  _glossActiveEl = span;
  span.classList.add("is-active");
}
function _glossBindOnce() {
  if (window.__glossBound) return;
  window.__glossBound = true;
  document.addEventListener("click", function(ev) {
    var t = ev.target;
    var span = t && t.closest && t.closest(".gloss");
    if (span) {
      ev.stopPropagation();
      if (_glossActiveEl === span) hideGlossPopover();
      else { hideGlossPopover(); showGlossPopover(span); }
      return;
    }
    if (t && t.closest && t.closest("#gloss-popover")) return;
    hideGlossPopover();
  }, true);
  document.addEventListener("keydown", function(ev) {
    if (ev.key === "Escape") { hideGlossPopover(); return; }
    if (ev.key === "Enter" || ev.key === " ") {
      var a = document.activeElement;
      if (a && a.classList && a.classList.contains("gloss")) {
        ev.preventDefault();
        if (_glossActiveEl === a) hideGlossPopover();
        else { hideGlossPopover(); showGlossPopover(a); }
      }
    }
  });
  window.addEventListener("resize", hideGlossPopover);
}

// BUILD-DESC-3: модалка с полным гайдом по билду.
// Вызов: openBuildGuide() — для текущего персонажа; openBuildGuide(buildId) — по id.
function openBuildGuide(buildId) {
  var b = null;
  if (buildId) {
    b = window.getBuildById && window.getBuildById(buildId);
  } else {
    var ch = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
    if (ch && ch.buildId) b = window.getBuildById && window.getBuildById(ch.buildId);
  }
  if (!b || !b.guide) {
    if (typeof showToast === "function") showToast("У этого билда нет гайда", "warn");
    return;
  }
  var g = b.guide;
  var titleEl = document.getElementById("bg-title-h");
  var bodyEl = document.getElementById("bg-body");
  // STYLE-8M-2b: заголовок страницы — свой ромб .page-title::before, иконка
  // рядом с ним была бы вторым маркером.
  if (titleEl) titleEl.textContent = "Гайд: " + (b.title || b.className || "");
  // UX-4: gx() = экранирование + обёртка терминов глоссария. seen — первое вхождение
  // термина в гайде подсвечивается, повторы остаются простым текстом (без шума).
  var seen = {};
  var _bgEd = (b && b.edition) || "2014"; // E24-1: гайд 2024-билда возьмёт набор терминов 2024
  function gx(s) { return glossarizeHtml(escapeHtml(s == null ? "" : s), seen, _bgEd); }
  function _list(arr, cls, mark) {
    if (!Array.isArray(arr) || !arr.length) return "";
    return '<ul class="bg-list ' + cls + '">' +
      arr.map(function(x){ return '<li><span class="bg-mark">' + mark + '</span> ' + gx(x) + '</li>'; }).join("") +
      '</ul>';
  }
  var html = "";
  html += '<div class="bg-meta"><span class="bg-cls">' + escapeHtml(b.className || "") + (b.subclass ? ' · ' + escapeHtml(b.subclass) : '') + '</span>';
  if (b.role) html += '<span class="bg-role">' + escapeHtml(b.role) + '</span>';
  html += '</div>';
  // UX-4: легенда сложности — расшифровка точек из карточки билда.
  var _diff = b.difficulty || 1;
  var _dots = "●".repeat(_diff) + "○".repeat(3 - _diff);
  html += '<div class="bg-diff-legend"><span class="bg-diff-dots bg-diff-' + _diff + '">' + _dots + '</span> Сложность: <b>' +
    escapeHtml(BP_DIFF_LABELS[_diff] || "") + '</b> — ' + escapeHtml(BP_DIFF_DESC[_diff] || "") + '</div>';
  if (g.pitch) html += '<div class="bg-pitch">' + dndIcoHtml("target", 13) + ' ' + gx(g.pitch) + '</div>';
  // UX-4: шкала живучести d6→d12 с подсветкой кости хитов класса.
  var _hd = (typeof CLASS_HIT_DICE !== "undefined" && CLASS_HIT_DICE[b.className]) || 0;
  if (_hd) {
    var _HD_DESC = {
      6:  "Самая малая кость хитов — мало здоровья, держись подальше от ближнего боя.",
      8:  "Кость хитов ниже среднего — здоровья немного, береги дистанцию.",
      10: "Крепкая кость хитов — уверенно держишь первый ряд.",
      12: "Самая большая кость хитов — максимум здоровья, ты танк партии."
    };
    var _scale = [6, 8, 10, 12].map(function(d){
      return '<span class="bg-hp-chip' + (d === _hd ? " is-active" : "") + '">d' + d + '</span>';
    }).join('<span class="bg-hp-arrow">›</span>');
    html += '<section class="bg-section bg-legend"><h3>' + dndIcoHtml("heart", 14) + ' Живучесть</h3>' +
      '<div class="bg-hpscale" role="img" aria-label="Кость хитов d' + _hd + ' из шкалы d6–d12">' + _scale + '</div>' +
      '<div class="bg-hp-ends"><span>хрупкий</span><span>живучий</span></div>' +
      '<p class="bg-legend-note">' + gx(_HD_DESC[_hd] || ("Кость хитов d" + _hd + ".")) + '</p></section>';
  }
  if (g.playstyle) html += '<section class="bg-section"><h3>' + dndIcoHtml("combat", 14) + ' Стиль игры</h3><p>' + gx(g.playstyle) + '</p></section>';
  if (Array.isArray(g.strengths) && g.strengths.length) html += '<section class="bg-section"><h3>' + dndIcoHtml("check", 14) + ' Сильные стороны</h3>' + _list(g.strengths, "bg-pros", "✓") + '</section>';
  if (Array.isArray(g.weaknesses) && g.weaknesses.length) html += '<section class="bg-section"><h3>' + dndIcoHtml("alert", 14) + ' Слабости</h3>' + _list(g.weaknesses, "bg-cons", "✗") + '</section>';
  if (g.synergy) html += '<section class="bg-section"><h3>' + dndIcoHtml("users", 14) + ' Синергия в партии</h3><p>' + gx(g.synergy) + '</p></section>';
  if (Array.isArray(g.tips) && g.tips.length) html += '<section class="bg-section"><h3>' + dndIcoHtml("bulb", 14) + ' Советы по игре</h3>' + _list(g.tips, "bg-tips", "•") + '</section>';
  // План развития 1–20 из b.levelUp — полный список по возрастанию уровней.
  if (b.levelUp) {
    var lvLines = [];
    Object.keys(b.levelUp)
      .map(function(k){ return parseInt(k, 10); })
      .filter(function(n){ return !isNaN(n); })
      .sort(function(a, b){ return a - b; })
      .forEach(function(lv){
        var s = b.levelUp[lv];
        if (s && s.headline) lvLines.push('<li><strong>' + lv + ' ур.:</strong> ' + gx(s.headline) + (s.why ? ' <span class="bg-why">— ' + gx(s.why) + '</span>' : '') + '</li>');
      });
    if (lvLines.length) html += '<section class="bg-section"><h3>' + dndIcoHtml("trend", 14) + ' План развития (1–20)</h3><ul class="bg-list bg-levels">' + lvLines.join("") + '</ul></section>';
  }
  if (bodyEl) bodyEl.innerHTML = html;
  hideGlossPopover();
  _glossBindOnce();
  // STYLE-8M-2b: гайд — экран. Вход бывает сразу после применения билда из
  // пикера, поэтому висящие модалки закрываем.
  if (typeof _closeOpenModals === "function") _closeOpenModals();
  if (typeof showScreen === "function") showScreen("buildguide");
}

// BUILD-LVL-3: рекомендации билда в точках выбора (для баннеров/подсветки).
// getBuildLevelRec — шаг плана на уровне; getBuildRecChoiceOption — рекоменд. опция классового выбора;
// getBuildRecFeat — id рекомендованной черты на ASI-уровне.
function getBuildLevelRec(char, level) {
  if (!char || !char.buildId || !level) return null;
  var b = window.getBuildById && window.getBuildById(char.buildId);
  return (b && b.levelUp && b.levelUp[level]) ? b.levelUp[level] : null;
}
function getBuildRecChoiceOption(char, choiceId) {
  if (!char || !char.buildId || !choiceId) return null;
  var b = window.getBuildById && window.getBuildById(char.buildId);
  return (b && b.recommendedChoices && b.recommendedChoices[choiceId]) || null;
}
// BUILD-LVL-5: нормализованный список рекомендованных optionId(ов).
// single-выбор хранится строкой ("great-weapon"), multi — массивом (["twinned","quickened"]).
// Всегда возвращает массив (порядок = приоритет билда).
function getBuildRecChoiceIds(char, choiceId) {
  var raw = getBuildRecChoiceOption(char, choiceId);
  if (!raw) return [];
  return Array.isArray(raw) ? raw.slice() : [raw];
}
function getBuildRecFeat(char, level) {
  var rec = getBuildLevelRec(char, level);
  if (!rec) return null;
  if (rec.feat) return rec.feat;
  // Фолбэк: распарсить feat из headline («ASI → черта «X»»).
  return parseFeatFromHeadline(rec.headline);
}
// BUILD-LVL-6: рекомендованный ASI на уровне (подсветка кнопок-статов в ASI-модалке).
// Приоритет: явный rec.asi → парсинг headline (тот же приём, что в apply-all). → { str:2 } | { str:1, con:1 } | null.
// Headline с «черт» → null (это feat-рекомендация, не stat-ASI; подсветка идёт по feat-списку).
function getBuildRecAsi(char, level) {
  var rec = getBuildLevelRec(char, level);
  if (!rec) return null;
  if (rec.asi) return rec.asi;
  return parseAsiFromHeadline(rec.headline);
}
// BUILD-LVL-6: рекомендованный подкласс билда (хинт у <select id=char-subclass> в ручном редакторе).
function getBuildRecSubclass(char) {
  if (!char || !char.buildId) return null;
  var b = window.getBuildById && window.getBuildById(char.buildId);
  return (b && b.subclass) || null;
}

// BUILD-LVL-4: парсер ASI из headline плана. «ASI → +2 СИЛ» → {str:2}; «+1 СИЛ +1 ТЕЛ» → {str:1,con:1}.
// СИЛ=str, ЛОВ=dex, ТЕЛ/ВЫН=con, ИНТ=int, МУД=wis, ХАР=cha.
function parseAsiFromHeadline(headline) {
  if (!headline || typeof headline !== "string") return null;
  if (/черт/i.test(headline)) return null; // это feat, не stat-ASI
  var MAP = { "СИЛ":"str", "ЛОВ":"dex", "ТЕЛ":"con", "ВЫН":"con", "ИНТ":"int", "МУД":"wis", "ХАР":"cha" };
  var re = /\+(\d)\s*(СИЛ|ЛОВ|ТЕЛ|ВЫН|ИНТ|МУД|ХАР)/gi, m, out = {}, found = false;
  while ((m = re.exec(headline))) {
    var k = MAP[m[2].toUpperCase()];
    if (k) { out[k] = (out[k] || 0) + parseInt(m[1], 10); found = true; }
  }
  return found ? out : null;
}

// BUILD-LVL-4: карта name→id черт (из FEATS_DATA) + парсер feat из headline («черта «Имя»»).
var _FEAT_NAME_TO_ID = null;
function _buildFeatNameMap() {
  if (_FEAT_NAME_TO_ID) return _FEAT_NAME_TO_ID;
  _FEAT_NAME_TO_ID = {};
  if (typeof FEATS_DATA !== "undefined" && Array.isArray(FEATS_DATA)) {
    FEATS_DATA.forEach(function(f){ if (f && f.name) _FEAT_NAME_TO_ID[f.name.toLowerCase().replace(/ё/g,"е").trim()] = f.id; });
  }
  // Алиасы headline-имён билдов → каноничные имена FEATS_DATA (только уверенные совпадения).
  // FIN-1: черты переименованы по книге (гл. 6 PHB) — старые канон-имена оставлены алиасами,
  // чтобы headline-тексты билдов и старые упоминания продолжали резолвиться.
  // Внимание: канон побеждает алиас, поэтому «стойкий» теперь durable (книжное имя),
  // а прежний resilient («Стойкий» до аудита) стал «Устойчивый» — headlines билдов обновлены.
  var ALIAS = {
    // тяжёлое оружие
    "великое оружие":"great_weapon_master", "мастер тяжелого оружия":"great_weapon_master",
    // живучесть
    "крепыш":"tough", "жесткий":"tough",
    "живучий":"durable",
    // удача
    "везунчик":"lucky", "удачливый":"lucky", "счастливчик":"lucky", "удача":"lucky",
    // стрельба
    "меткий стрелок":"sharpshooter", "снайпер":"sharpshooter",
    // инициатива/защита
    "сторожевой":"alert", "бдительность":"alert",
    "наблюдательный":"observant",
    "щитарь":"shield_master", "мастер щита":"shield_master",
    // кастеры
    "боевой маг":"war_caster", "заклинатель боя":"war_caster", "боевой кастер":"war_caster", "военная подготовка":"war_caster",
    "родство со стихией":"elemental_adept", "адепт стихий":"elemental_adept",
    "меткий заклинатель":"spell_sniper",
    // доспехи/оружие
    "тяжелые доспехи":"heavily_armored", "двойное владение":"dual_wielder",
    "мастер арбалета":"crossbow_expert",
    // прочее (старые имена до FIN-1)
    "мобильный":"mobile", "актер":"actor", "атлет":"athlete",
    "конный боец":"mounted_combatant", "вдохновляющий лидер":"inspiring_leader",
    "таверный буян":"tavern_brawler", "целитель":"healer",
    "атакующий":"charger", "защитный поединщик":"defensive_duelist",
    "опытный":"skilled", "скрытный":"skulker", "лингвист":"linguist"
  };
  Object.keys(ALIAS).forEach(function(k){ if (!_FEAT_NAME_TO_ID[k]) _FEAT_NAME_TO_ID[k] = ALIAS[k]; });
  return _FEAT_NAME_TO_ID;
}
function parseFeatFromHeadline(headline) {
  if (!headline || typeof headline !== "string") return null;
  if (/\bGWM\b/i.test(headline)) return "great_weapon_master";
  var m = headline.match(/черт[аы]?\s*[«"]([^»"]+)[»"]/i);
  if (!m) return null;
  var map = _buildFeatNameMap();
  // нормализация: ё→е, убрать парентетику «(ТЕЛ)», убрать хвост после «/» или «или».
  var name = m[1].toLowerCase().replace(/ё/g,"е")
    .replace(/\s*\([^)]*\)/g,"")
    .replace(/\s*(?:\/|\bили\b).*$/,"")
    .trim();
  return map[name] || null;
}

// BUILD-LVL-5: парсер рекомендованных заклинаний из headline плана.
// «Заклинания N ур. — X, Y + Z/W (или V)» → ["X","Y","Z","W","V"]. Имена резолвятся через resolveSpellByName.
// Гейт: строка должна быть заклинательной (тег «Заклинания…»/«Арканум…») и иметь список после тире «—»/«–».
function parseSpellsFromHeadline(headline) {
  if (!headline || typeof headline !== "string") return [];
  // Гейт: только строки-тиры заклинаний/арканума («Заклинания N ур.» / «Арканум N ур.»),
  // чтобы не ловить фичи подкласса со словом «заклинания» («…— Создание скульптуры заклинания»).
  if (!/(Заклинани[ея]|Арканум)\s*\d+\s*ур\.?/i.test(headline)) return [];
  var m = headline.match(/[—–]\s*(.+)$/);
  if (!m) return [];
  var seg = m[1].trim()
    .replace(/\s+и\s+(?:пр|т\.?\s*п|т\.?\s*д|прочее)\.?\s*$/i, "") // хвост «и пр./и т.п./и прочее»
    .replace(/\(\s*или\s+([^)]*)\)/gi, " или $1")                  // «(или X)» → альтернатива
    .replace(/\([^)]*\)/g, " ")                                    // прочие скобки-аннотации «(Лес)»/«(ТЕЛ)» → убрать
    .replace(/[«»"]/g, " ");                                       // кавычки → пробел
  // Разделители: , + / · и слово «или» (с пробелами — \b в JS не работает для кириллицы).
  // НЕ делим по « и » — может быть внутри имени («зла и добра»).
  var parts = seg.split(/\s*[,+\/·]\s*|\s+или\s+/i);
  var names = [];
  parts.forEach(function(p){
    p = p.replace(/\s+/g, " ").trim().replace(/[.\s]+$/, "").trim();
    if (p.length > 2 && !/^(пр|т\.?\s*п|т\.?\s*д|прочее)\.?$/i.test(p)) names.push(p);
  });
  return names;
}

// BUILD-LVL-4: общий резолвер имён заклинаний (PHB-имя билда → объект SPELL_DATABASE).
// Те же алиасы, что и в applyBuild — для авто-применения рекомендованных заклинаний при level-up.
window.resolveSpellByName = (function(){
  var ALIASES = {
    // REQ-5b: заговоры теперь книжные имена в БД → резолвятся напрямую; здесь
    // оставлены dnd.su-альты, что РАСХОДЯТСЯ с книгой, и ур.1+ (будущие партии).
    "сонливость": "усыпление", "рука мага": "волшебная рука",
    "удар грома": "волна грома", "снаряд-громовержец": "волна грома", "стрелы грома": "громовая кара",
    "выработка": "искусство друидов", "смех таши": "жуткий смех таши",
    "насмешка": "злая насмешка",
    "охотничья метка": "метка охотника",
    "шиллела": "дубинка", "ложная жизнь": "псевдожизнь",
    // BUILD-LVL-5: имена заклинаний из планов билдов (headline) → каноничные имена SPELL_DATABASE.
    "призыв молний": "призыв молнии", "стена огня": "огненная стена",
    "массовое лечение": "множественное лечение ран",  // REQ-5b п.6: Mass Cure Wounds = книжное «Множественное лечение ран»
    "рой метеоров": "метеоритный дождь", "конусный холод": "конус холода",  // REQ-5b п.10: Meteor swarm = книжн. «Метеоритный дождь» (реальное имя БД)
    "истинный полиморф": "истинное превращение", "миражный аркан": "таинственный мираж",
    "пламенный удар": "небесный огонь",  // REQ-5b п.6: Flame Strike = книжное «Небесный огонь»
    "огненный шторм": "огненная буря", "буря мщения": "гроза гнева", "буря мести": "гроза гнева",  // REQ-5b п.10: Storm of vengeance = книжн. «Гроза гнева»
    "доминирование зверя": "подчинение зверя", "доминирование личности": "подчинение личности",
    "антимагия": "преграда магии", "спайк-грейв": "шипы",
    // REQ-5b (партия 1): БД = имена книги PHB 2014. Старые Fantom-имена заговоров
    // (могут встречаться в headline/флейворе билдов) → имя книги в БД.
    "друидический знак": "искусство друидов", "защита клинком": "защита от оружия",
    "злобная насмешка": "злая насмешка", "знаменательное послание": "сообщение",
    "истинный удар": "меткий удар", "кислота брызгами": "брызги кислоты",
    "могильный холод": "леденящее прикосновение", "пламя": "сотворение пламени",
    "пляшущие огни": "пляшущие огоньки", "поддержка умирающего": "уход за умирающим",
    "потрясение": "электрошок", "престидижитация": "фокусы", "терновый бич": "терновый кнут",
    "яд-брызги": "ядовитые брызги", "огненный болт": "огненный снаряд",
    "луч мороза": "луч холода", "руководство": "указание", "наставление": "указание",
    "священный огонь": "священное пламя", "дубина": "дубинка", "дружелюбие": "дружба",
    "звездный светлячок": "звёздная искра", "чародейский выброс": "чародейский взрыв",
    // REQ-5b (партия 2, ур.1): SPELL_DATABASE = имена книги PHB 2014. dnd.su = книга
    // почти везде → резолвятся напрямую. Здесь — расходящиеся dnd.su/альт-имена и
    // старые Fantom-имена (в массивах билдов / легаси) → имя книги в БД; плюс PH24.
    "добряника": "чудо-ягоды", "иллюзорные письмена": "невидимое письмо",
    "направляющий снаряд": "направленный снаряд", "парящий диск тензера": "тензеров парящий диск",
    "намасливание": "скольжение", "цветной поток": "сверкающие брызги",
    "снаряд хаоса": "хаотичный снаряд",
    // Трек 3 QA: недокат REQ-5b — dnd.su-имена из билдов/легаси-сейвов → имя книги в БД.
    "указующая стрела": "направленный снаряд", "приручение животных": "дружба с животными",
    "божественная благосклонность": "божественное благоволение",
    "адская расплата": "адское возмездие", "беззвучное изображение": "безмолвный образ",
    "божественная милость": "божественное благоволение", "броня агатиса": "доспех агатиса",
    "ведьмин болт": "ведьмин снаряд", "громовая волна": "волна грома", "яростная кара": "гневная кара",
    "защита от зла и добра": "защита от добра и зла", "слово исцеления": "лечащее слово",
    "направляющий болт": "направленный снаряд", "иллюзорный текст": "невидимое письмо",
    "обнаружение яда и болезни": "обнаружение болезней и яда", "обнаружение зла и добра": "обнаружение добра и зла",
    "огненные руки": "огненные ладони", "огни фей": "огонь фей", "очищение еды и питья": "очищение пищи и питья",
    "мягкое падение": "падение пёрышком", "ускоренное отступление": "поспешное отступление", "команда": "приказ",
    "мнимая жизнь": "псевдожизнь", "цветная россыпь": "сверкающие брызги", "сигнализация": "сигнал тревоги",
    "смазка": "скольжение", "длинный шаг": "скороход", "создать или уничтожить воду": "сотворение или уничтожение воды",
    "сон": "усыпление", "хроматическая сфера": "цветной шарик", "незримый слуга": "невидимый слуга",
    "жгучая кара": "палящая кара", "плавающий диск тенсера": "тензеров парящий диск", "живительная ягода": "чудо-ягоды",
    // REQ-5b (партия 3, ур.2): SPELL_DATABASE = имена книги PHB 2014. Для ур.2 dnd.su
    // = книга почти везде → dnd.su-имена резолвятся напрямую. Здесь — старые Fantom-имена
    // (в массивах билдов / легаси-сохранёнках) → имя книги в БД; плюс dnd.su 2024-альты ≠ книги.
    "венец безумия": "корона безумия", "волшебное оружие": "магическое оружие", "говорящие уста": "волшебные уста",
    "гонец-животное": "почтовое животное", "духовное оружие": "божественное оружие", "жгучий луч": "палящий луч",
    "завораживание": "речь златоуста", "защитная связь": "охраняющая связь", "зеркальное отображение": "отражения",
    "зона правды": "область истины", "изменить облик": "смена обличья", "кислотная стрела мельфа": "мельфова кислотная стрела",
    "кора дерева": "дубовая кора", "магическая аура нистула": "нистулова ложная аура", "магический замок": "волшебный замок",
    "молитва об исцелении": "молебен лечения", "обнаружение невидимости": "видение невидимого", "огненная сфера": "пылающий шар",
    "огненный клинок": "горящий клинок", "определение животных или растений": "поиск животных или растений",
    "определение животных и растений": "поиск животных или растений", "определение предмета": "поиск предмета",
    "отмычка": "открывание", "паучье лазанье": "паук", "передвижение без следов": "бесследное передвижение",
    "покой": "нетленные останки", "помощь": "подмога", "предзнаменование": "гадание", "призрачная сила": "воображаемая сила",
    "размытие": "размытый образ", "раскалить металл": "раскалённый металл", "рост шипов": "шипы",
    "слепота/глухота": "глухота/слепота", "темнота": "тьма", "туча кинжалов": "облако кинжалов",
    "усиление способности": "улучшение характеристики", "успокоение эмоций": "умиротворение",
    // dnd.su 2024-альты (ур.2, ≠ книга PHB 2014) → имя книги в БД.
    "сияющая кара": "клеймящая кара", "дубовая кожа": "дубовая кора", "волшебная аура нистула": "нистулова ложная аура",
    "поиск объекта": "поиск предмета", "стук": "открывание", "обретение скакуна": "поиск скакуна",
    "вихрь искривления": "вихревой прыжок", "натайрово озорство": "причуды натэйра",
    // SPELL-AUDIT-3: имена dnd.su (ур.3–4) → каноничные имена SPELL_DATABASE.
    // #310/#360 переименованы «Ледяная буря»→«Метель» (Sleet Storm). REQ-5b п.5: Ice Storm
    // переименован в книжное «Град» → «град» резолвится напрямую; легаси «Ледяной шторм»/«Ледяная буря» → «Град».
    "ледяная буря": "град", "ледяной шторм": "град",
    // REQ-5b п.5: Phantasmal Killer переименован «Призрак-убийца»/«Фантомный убийца» → книжное «Воображаемый убийца».
    "призрачный убийца": "воображаемый убийца", "призрак-убийца": "воображаемый убийца", "фантомный убийца": "воображаемый убийца",
    // SPELL-AUDIT-4: имена dnd.su (ур.5–6) → каноничные имена SPELL_DATABASE.
    // #467/#510 «Истинное видение» (дубли True Seeing ур.5) удалены → имя резолвится в «Истинное зрение» (ур.6).
    // REQ-5b п.6: «фальшивый двойник»→«обман» СНЯТ — Mislead теперь книжное имя БД «Фальшивый двойник» (резолвится напрямую).
    "истинное видение": "истинное зрение",
    // REQ-5b п.7 (ур.6): Otiluke's Freezing Sphere → книжн. «Отилюков ледяной шар»
    // (легаси dnd.su «отилюка» / старое БД «оттилюка» обе спеллинги → новое имя).
    "ледяная сфера отилюка": "отилюков ледяной шар",
    // SPELL-AUDIT-5: имена dnd.su (ур.8–9, PH14/PH24) → каноничные имена SPELL_DATABASE.
    // Shapechange «Полное превращение»/2024 «Преображение» = #691/#707 (наш «Перевоплощение»).
    // Befuddlement «Помутнение разума» = #671: PH24-«Оцепенение» сведён к книжн. «Слабоумие»
    // (REQ-5b п.9, ур.8 = PH14) → «помутнение разума»/«оцепенение» репойнтнуты на «слабоумие».
    // REQ-5b п.8 (ур.7): Prismatic Spray «Радужные брызги» (#610/#632) и Forcecage «Узилище»
    // (#617/#637) стали реальными именами БД → резолвятся напрямую; «призматический поток» → новое имя.
    // REQ-5b п.10 (ур.9): Shapechange «Перевоплощение» → книжн. «Полное превращение» (#691/#707)
    // — реальное имя БД → «полное превращение» СНЯТ; легаси «перевоплощение»/«преображение» → новое.
    "призматический поток": "радужные брызги",
    "перевоплощение": "полное превращение", "преображение": "полное превращение",
    "помутнение разума": "слабоумие",
    // SPELL-AUDIT-6: коллизия «Порча» разрешена по канону dnd.su (обе ред.): Bane=«Порча» (id99/id136),
    // Hex=«Сглаз» (id161). Старое имя PH24-Bane «Злой рок» → «Порча» (миграция сохранённых).
    // REQ-5b п.5: Divination переименован в книжное «Предсказание» (=dnd.su) → резолвится напрямую; легаси «Прорицание» → «Предсказание».
    "злой рок": "порча", "прорицание": "предсказание",
    // BUILD-LVL: флейвор-имена из headline билдов, однозначно сопоставимые с реальным заклинанием БД.
    // (Остальные нерезолвящиеся имена — выдуманные/без аналога — покрыты фолбэком на guided-экране.)
    "финал-палец": "перст смерти", "искривление земли": "движение почвы",  // REQ-5b п.7: Move Earth → книжн. «Движение почвы»
    "истинное пророчество": "истинное зрение",
    // REQ-5b (партия 4, ур.3): SPELL_DATABASE = имена книги PHB 2014. Для ур.3 dnd.su = книга
    // почти везде → dnd.su-имена резолвятся напрямую. Здесь старые Fantom-имена (массивы билдов /
    // легаси-сохранёнки) → имя книги в БД. Раньше «возрождение»→«реинкарнация» и «духовные стражи»→
    // «духи-хранители» — оба сняты (теперь «Возрождение»=Revivify и «Духовные стражи» — реальные имена БД).
    "аура жизненности": "аура живучести", "большое изображение": "образ",
    "вампирское касание": "прикосновение вампира", "вонючее облако": "зловонное облако",
    "групповое слово исцеления": "множественное лечащее слово", "духи-хранители": "духовные стражи",
    "дыхание под водой": "подводное дыхание", "залп вызова": "призыв заграждения",
    "защита от стихии": "защита от энергии", "крохотная хижина леомунда": "леомундова хижина",
    "наложение проклятия": "проклятие", "необнаружение": "необнаружимость",
    // «оживление»→«возрождение» снят (REQ-5b п.6): «Оживление» = Raise Dead (реальное имя БД).
    "оживление мертвецов": "восставший труп",
    "ослепляющий удар": "ослепляющая кара", "охранный знак": "охранные руны",
    "притвориться мёртвым": "притворная смерть", "рассеять магию": "рассеивание магии",
    "снятие проклятия": "снятие проклятья", "создание еды и воды": "сотворение пищи и воды",
    "стена ветра": "стена ветров", "страх": "ужас",
    "элементальное оружие": "стихийное оружие", "ясновидение": "подсматривание",
    // REQ-5b (партия 5, ур.4): SPELL_DATABASE = имена книги PHB 2014. Старые Fantom/PH24-имена
    // (массивы билдов / легаси-сохранёнки) → имя книги в БД. Конфликтные («Ледяной шторм»→«Град»,
    // «Призрак-убийца»/«Фантомный убийца»→«Воображаемый убийца», «Прорицание»→«Предсказание») — выше.
    "аура чистоты": "аура очищения", "определение существа": "поиск существа",
    "ошеломляющий удар": "оглушающая кара", "свобода передвижения": "свобода перемещения",
    "врата измерений": "переносящая дверь", "пространственная дверь": "переносящая дверь",
    "галлюцинаторная местность": "мираж", "галлюцинаторный рельеф": "мираж",
    "личное убежище морденкайнена": "кабинет морденкайнена", "личное убежище": "кабинет морденкайнена",
    "тайный сундук леомунда": "леомундов потайной сундук", "тайный сундук": "леомундов потайной сундук",
    "управление водой": "власть над водами", "власть над водой": "власть над водами",
    "упругая сфера отилюка": "отилюков упругий шар", "упругая сфера": "отилюков упругий шар",
    "формование камня": "изменение формы камня", "преобразование камня": "изменение формы камня",
    "верный пёс": "верный пёс морденкайнена", "иссыхание": "усыхание",
    "улучшенная невидимость": "высшая невидимость", "страж смерти": "защита от смерти",
    "замешательство": "смятение", "полиморф": "превращение",
    "призыв существ леса": "призыв лесных обитателей", "хватающая лоза": "цепкая лоза",
    "чёрные щупальца эварда": "эвардовы чёрные щупальца", "чёрные щупальца": "эвардовы чёрные щупальца",
    // REQ-5b (партия 6, ур.5): SPELL_DATABASE = имена книги PHB 2014 (глоссарий стр.314–320).
    // Старые Fantom/PH24-имена (массивы билдов / легаси-сохранёнки) → имя книги в БД.
    // Конфликтные сняты выше: «оживление»→Raise Dead напрямую, «фальшивый двойник»→Mislead напрямую,
    // «массовое лечение»/«пламенный удар» репойнтнуты на «множественное лечение ран»/«небесный огонь».
    "болезнь": "заражение", "изгоняющий удар": "изгоняющая кара", "кисть бигби": "длань бигби",
    "контакт с иным планом": "связь с иным миром", "массовое лечение ран": "множественное лечение ран",
    "оживление предметов": "оживление вещей", "оболочка против жизни": "преграда жизни",
    "огненный удар": "небесный огонь", "поднятие мёртвых": "оживление", "пробуждение": "пробуждение разума",
    "рассеять добро и зло": "рассеивание добра и зла", "созидание": "сотворение",
    "стена камня": "каменная стена", "стена силы": "силовая стена",
    "телепатическая связь рарыса": "ментальная связь рэри", "легенды и предания": "знание легенд",
    "личина": "притворство", "магическое связывание": "планарные узы", "обман": "фальшивый двойник",
    "освящение": "святилище", "прогулка по деревьям": "древесный путь", "стремительный колчан": "быстрый колчан",
    "знание преданий": "знание легенд", "привязка к плану": "планарные узы",
    "проход сквозь стену": "создание прохода",
    // REQ-5b (партия 7, ур.6): SPELL_DATABASE = имена книги PHB 2014 (глоссарий стр.314–320).
    // Для ур.6 книга часто РАСХОДИТСЯ со старыми Fantom-именами → старые имена (массивы билдов /
    // легаси-сохранёнки) → имя книги в БД. «ледяная сфера отилюка»/«искривление земли» — выше.
    "воздушная прогулка": "хождение по ветру", "вред": "поражение", "дезинтеграция": "распад",
    "дурной глаз": "разящее око", "исцеление": "полное исцеление", "ледяная сфера оттилюка": "отилюков ледяной шар",
    "магический сосуд": "волшебный сосуд", "массовое внушение": "множественное внушение",
    "мгновенный вызов дравмия": "дромиджево появление", "непредвиденный случай": "предосторожность",
    "неудержимый танец отто": "неудержимая пляска отто", "охрана и защита": "стражи",
    "перемещение через растения": "путешествие через растения", "плоть в камень": "окаменение",
    "программируемая иллюзия": "заданная иллюзия", "сдвинуть землю": "движение почвы",
    "слово призыва": "слово возврата", "создание нежити": "сотворение нежити",
    "союзник с иного плана": "планарный союзник", "стена льда": "ледяная стена",
    "стена шипов": "терновая стена", "цепная молния": "пляшущая молния",
    "шар неуязвимости": "сфера неуязвимости",
    // REQ-5b (партия 8, ур.7): SPELL_DATABASE = имена книги PHB 2014 (глоссарий стр.314–320).
    // Книга часто РАСХОДИТСЯ со старыми Fantom/PH24-именами → старые имена (массивы билдов /
    // легаси-сохранёнки) → имя книги в БД. «радужные брызги»/«узилище» сняты выше (прямые имена).
    "обратная гравитация": "изменение тяготения", "призматический луч": "радужные брызги",
    "проекция образа": "проекция", "роскошный особняк морденкайнена": "великолепный особняк морденкайнена",
    "великолепный особняк": "великолепный особняк морденкайнена", "секвестр": "изоляция",
    "силовая клетка": "узилище", "символ": "знак", "симулякр": "подобие",
    "слово богов": "божественное слово", "смена плана": "уход в иной мир",
    // REQ-5b (партия 9, ур.8): SPELL_DATABASE = имена книги PHB 2014 (глоссарий стр.314–320).
    // Книга расходится со старыми Fantom-именами → старые имена (массивы билдов / легаси) →
    // имя книги в БД. «двойник»→«фальшивый двойник» СНЯТ выше (Clone «Клон» → книжн. «Двойник»);
    // PH24 Befuddlement «Оцепенение» сведён к книжн. «Слабоумие» (= PH14).
    "антимагическое поле": "преграда магии", "блокировка разума": "сокрытие разума",
    "клон": "двойник", "огненное облако": "воспламеняющаяся туча",
    "полуплан": "демиплан", "речистость": "находчивость",
    "священная аура": "аура святости", "солнечная вспышка": "солнечный ожог",
    "формы животных": "превращение в животных", "оцепенение": "слабоумие",
    // REQ-5b (партия 10, ур.9, последняя): SPELL_DATABASE = имена книги PHB 2014
    // (глоссарий стр.314–320). Старые Fantom/dnd.su-имена (массивы билдов / легаси) →
    // имя книги в БД. Shapechange/Storm of vengeance/Meteor swarm репойнтнуты выше
    // («перевоплощение»/«буря мести»/«рой метеоров»). Power Word case-fix «Слово силы:» →
    // «Слово Силы:» резолвится регистронезависимо (ключи lowercase) → алиасы не нужны.
    "астральная проекция": "проекция в астрал", "заключение": "заточение",
    "кошмарное видение": "смертный ужас", "массовое исцеление": "множественное полное исцеление",
    "призматическая стена": "радужная стена"
  };
  return function(n){
    if (!n) return null;
    if (typeof n === "object") return n;
    if (typeof SPELL_DATABASE === "undefined" || !Array.isArray(SPELL_DATABASE)) return null;
    var key = String(n).toLowerCase().trim();
    var alt = key.replace(/ё/g, "е").replace(/\s*\([^)]*\)\s*$/, "").trim();
    var aliased = ALIASES[key] || ALIASES[alt];
    // Билды/level-up = PHB 2014: при дубле имени (PH14+PH24 версии в БД) отдаём PH14;
    // PH24-версию — только если PH14-аналога нет вовсе.
    var found = null;
    for (var i = 0; i < SPELL_DATABASE.length; i++) {
      var sp = SPELL_DATABASE[i];
      if (!sp || !sp.name) continue;
      var nm = sp.name.toLowerCase().trim();
      if (nm === key || nm === alt || (aliased && nm === aliased)) {
        if (sp.source === "PH14") return sp;
        if (!found) found = sp;
      }
    }
    return found;
  };
})();

// BUILD-LVL-5: рекомендованные заклинания билда на уровень → массив объектов SPELL_DATABASE (без дублей).
// Приоритет: явный levelUp[lv].spellsAdd → парсинг headline. Нерезолвящиеся имена отбрасываются (показ = применение).
function getBuildRecSpellObjs(b, level) {
  if (!b || !b.levelUp || !b.levelUp[level]) return [];
  var lu = b.levelUp[level];
  var names = [];
  if (lu.spellsAdd) {
    ["cantrips", "known", "prepared"].forEach(function(k){ (lu.spellsAdd[k] || []).forEach(function(n){ names.push(n); }); });
  } else if (typeof parseSpellsFromHeadline === "function") {
    names = parseSpellsFromHeadline(lu.headline);
  }
  var out = [], seen = {};
  names.forEach(function(n){
    var sp = (typeof window.resolveSpellByName === "function") ? window.resolveSpellByName(n) : null;
    var key = sp && (sp.id || sp.name);
    if (sp && key && !seen[key]) { seen[key] = 1; out.push(sp); }
  });
  return out;
}

// BUILD-LVL-2: модалка плана развития 1–20 с подсветкой текущего уровня.
// openBuildPlan() — для текущего персонажа; openBuildPlan(buildId) — по id билда.
function openBuildPlan(buildId) {
  var ch = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  var b = null;
  if (buildId) b = window.getBuildById && window.getBuildById(buildId);
  else if (ch && ch.buildId) b = window.getBuildById && window.getBuildById(ch.buildId);
  if (!b || !b.levelUp) {
    if (typeof showToast === "function") showToast("У этого билда нет плана развития", "warn");
    return;
  }
  // Текущий уровень подсвечиваем только если план открыт для билда текущего персонажа.
  var curLevel = (ch && ch.buildId === b.id) ? (ch.level || 1) : 0;
  var titleEl = document.getElementById("bp-plan-title-h");
  if (titleEl) titleEl.textContent = "План развития: " + (b.title || b.className || "");
  var rows = [];
  for (var lv = 1; lv <= 20; lv++) {
    var s = b.levelUp[lv];
    if (!s || !s.headline) continue;
    var cls = "bp-plan-row", tag = "";
    if (curLevel) {
      if (lv === curLevel) { cls += " current"; tag = '<span class="bp-plan-tag">ты здесь</span>'; }
      else if (lv === curLevel + 1) { cls += " next"; tag = '<span class="bp-plan-tag next">дальше</span>'; }
      else if (lv < curLevel) { cls += " past"; }
    }
    rows.push('<div class="' + cls + '"><div class="bp-plan-lv">' + lv + '</div><div class="bp-plan-txt">' +
      '<div class="bp-plan-head">' + escapeHtml(s.headline) + tag + '</div>' +
      (s.why ? '<div class="bp-plan-why">' + escapeHtml(s.why) + '</div>' : '') +
      '</div></div>');
  }
  var bodyEl = document.getElementById("bp-plan-body");
  if (bodyEl) {
    bodyEl.innerHTML =
      '<div class="bp-plan-meta">' + escapeHtml(b.className || "") +
      (b.subclass ? ' · ' + escapeHtml(b.subclass) + (typeof subclassSourceShort === "function" && subclassSourceShort(b.subclass) ? ' (' + escapeHtml(subclassSourceShort(b.subclass)) + ')' : '') : '') +
      (b.role ? ' · ' + escapeHtml(b.role) : '') +
      (curLevel ? ' · текущий уровень: ' + curLevel : '') + '</div>' +
      rows.join("");
  }
  // Вход бывает из окна повышения уровня — модалку закрываем (см. openHelp).
  if (typeof _closeOpenModals === "function") _closeOpenModals();
  if (typeof showScreen === "function") showScreen("buildplan");
  if (curLevel && bodyEl) {
    setTimeout(function(){
      var el = bodyEl.querySelector(".bp-plan-row.current");
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "center" });
    }, 60);
  }
}

// REQ-3: общий план класса 1–20 для ЛЮБОГО персонажа (не только из билда).
// Данные — CLASS_FEATURES + SUBCLASS_FEATURES (data.js), те же, что в level-up.
// openBuildPlan показывает нарратив билда; этот — официальные фичи класса/подкласса.
function openClassPlan() {
  var ch = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  if (!ch || !ch.class) {
    if (typeof showToast === "function") showToast("Сначала выберите класс", "warn");
    return;
  }
  if (typeof CLASS_FEATURES === "undefined" || !CLASS_FEATURES[ch.class]) {
    if (typeof showToast === "function") showToast("Нет данных по этому классу", "warn");
    return;
  }
  var cls = CLASS_FEATURES[ch.class];
  var sub = (ch.subclass && typeof SUBCLASS_FEATURES !== "undefined") ? SUBCLASS_FEATURES[ch.subclass] : null;
  var curLevel = ch.level || 1;
  var titleEl = document.getElementById("bp-plan-title-h");
  if (titleEl) titleEl.textContent = "План класса: " + ch.class;
  var rows = [];
  for (var lv = 1; lv <= 20; lv++) {
    var feats = [];
    if (Array.isArray(cls[lv])) feats = feats.concat(cls[lv]);
    if (sub && Array.isArray(sub[lv])) feats = feats.concat(sub[lv]);
    if (!feats.length) continue;
    var rowCls = "bp-plan-row", tag = "";
    if (lv === curLevel) { rowCls += " current"; tag = '<span class="bp-plan-tag">ты здесь</span>'; }
    else if (lv === curLevel + 1) { rowCls += " next"; tag = '<span class="bp-plan-tag next">дальше</span>'; }
    else if (lv < curLevel) { rowCls += " past"; }
    var inner = feats.map(function(f, i){
      return '<div class="bp-plan-head">' + escapeHtml(f.name || "") + (i === 0 ? tag : "") + '</div>' +
             (f.desc ? '<div class="bp-plan-why">' + escapeHtml(f.desc) + '</div>' : '');
    }).join("");
    rows.push('<div class="' + rowCls + '"><div class="bp-plan-lv">' + lv + '</div><div class="bp-plan-txt">' + inner + '</div></div>');
  }
  var bodyEl = document.getElementById("bp-plan-body");
  if (bodyEl) {
    var subSrc = (ch.subclass && typeof subclassSourceShort === "function") ? subclassSourceShort(ch.subclass) : "";
    var meta = escapeHtml(ch.class) +
      (ch.subclass ? ' · ' + escapeHtml(ch.subclass) + (subSrc ? ' (' + escapeHtml(subSrc) + ')' : '')
                   : ' · подкласс не выбран (фичи архетипа появятся после выбора)') +
      ' · текущий уровень: ' + curLevel;
    bodyEl.innerHTML = '<div class="bp-plan-meta">' + meta + '</div>' + rows.join("");
  }
  if (typeof _closeOpenModals === "function") _closeOpenModals();
  if (typeof showScreen === "function") showScreen("buildplan");
  if (bodyEl) {
    setTimeout(function(){
      var el = bodyEl.querySelector(".bp-plan-row.current");
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "center" });
    }, 60);
  }
}

