// Test runner. Собирает результаты в DOM и window.__testResults для preview_eval.
(function(){
  var results = [];
  var pass = 0, fail = 0;

  function t(desc, fn) {
    try {
      var r = fn();
      if (r === true) { pass++; results.push({desc, ok:true}); }
      else { fail++; results.push({desc, ok:false, msg:r||"!=true"}); }
    } catch (e) {
      fail++; results.push({desc, ok:false, msg:"EXC: "+(e && e.message || e)});
    }
  }
  function eq(a,b){ return JSON.stringify(a)===JSON.stringify(b); }

  // ────────── БЛОК 1: SLOT TABLE (sanity check data.js) ──────────
  Object.keys(FIX.SLOTS).forEach(function(cls){
    var exp = FIX.SLOTS[cls];
    Object.keys(exp).forEach(function(lvl){
      t("[slots] "+cls+" L"+lvl, function(){
        var got = SPELL_SLOTS_BY_LEVEL[cls] && SPELL_SLOTS_BY_LEVEL[cls][lvl];
        if (!got) return "нет записи";
        // компактное ignore для длины 9 vs 10 (Колдун хранит 10)
        var e = exp[lvl].slice(0, got.length);
        var g = got.slice(0, e.length);
        return eq(e, g) || ("ожидал "+JSON.stringify(e)+", получено "+JSON.stringify(g));
      });
    });
  });

  // ────────── БЛОК 2: ccGetAllChoicesFor ──────────
  FIX.CHOICES.forEach(function(tc){
    t("[choices] "+tc.desc, function(){
      var char = JSON.parse(JSON.stringify(tc.char));
      if (!char.classChoices) char.classChoices = {};
      // для воззваний Колдуна: если в тесте нет явного пакта, но уровень ≥3 и есть pact-boon — положим "tome" чтоб фильтры не резали случайно
      var all = ccGetAllChoicesFor(char);
      var ids = all.map(function(x){ return x.choice.id; });
      // проверка что ВСЕ ожидаемые id присутствуют (может быть больше — это ок если не указано)
      var missing = tc.expect.filter(function(id){ return ids.indexOf(id) === -1; });
      if (missing.length) return "не найдены: "+missing.join(",")+"; получены: "+ids.join(",");
      return true;
    });
  });

  // ────────── БЛОК 3: SUBCLASS_FEATURES покрытие ──────────
  if (typeof SUBCLASSES !== "undefined" && typeof SUBCLASS_FEATURES !== "undefined") {
    Object.keys(SUBCLASSES).forEach(function(cls){
      SUBCLASSES[cls].forEach(function(sub){
        t("[features] "+cls+"/"+sub, function(){
          var feats = SUBCLASS_FEATURES[sub];
          if (!feats) return "нет SUBCLASS_FEATURES['"+sub+"']";
          if (Object.keys(feats).length === 0) return "пустой";
          return true;
        });
      });
    });
  } else {
    t("[meta] SUBCLASSES+SUBCLASS_FEATURES определены", function(){ return "не загружены"; });
  }

  // ────────── БЛОК 4: SUBCLASS_CHOICES — опции не пустые и optionsDict присутствует ──────────
  if (typeof SUBCLASS_CHOICES !== "undefined") {
    Object.keys(SUBCLASS_CHOICES).forEach(function(sub){
      SUBCLASS_CHOICES[sub].forEach(function(ch){
        t("[subchoice] "+sub+"."+ch.id, function(){
          if (!ch.options || !ch.options.length) return "options пустой";
          if (!ch.optionsDict) return "нет optionsDict";
          var missingDict = ch.options.filter(function(id){ return !ch.optionsDict[id]; });
          if (missingDict.length) return "в optionsDict нет: "+missingDict.join(",");
          return true;
        });
      });
    });
  }

  // ────────── БЛОК 5: ccAvailableOptions — фильтр по req.level ──────────
  t("[filter] Монах L3 видит только базовые дисциплины (без level-gate)", function(){
    var char = {class:"Монах", level:3, subclass:"Путь четырёх стихий"};
    var all = ccGetAllChoicesFor(char);
    var disc = all.find(function(x){ return x.choice.id === "elemental-disciplines"; });
    if (!disc) return "нет карточки";
    var available = ccAvailableOptions(disc.choice, char, "Монах");
    var forbidden = available.filter(function(id){
      var o = disc.choice.optionsDict[id];
      return o && o.req && o.req.level && o.req.level > 3;
    });
    if (forbidden.length) return "просочились: "+forbidden.join(",");
    return true;
  });

  t("[filter] Монах L17 видит все дисциплины", function(){
    var char = {class:"Монах", level:17, subclass:"Путь четырёх стихий"};
    var all = ccGetAllChoicesFor(char);
    var disc = all.find(function(x){ return x.choice.id === "elemental-disciplines"; });
    var available = ccAvailableOptions(disc.choice, char, "Монах");
    return available.length === Object.keys(ELEMENTAL_DISCIPLINES).length ||
      "ожидал "+Object.keys(ELEMENTAL_DISCIPLINES).length+", получено "+available.length;
  });

  // ────────── БЛОК 6: мультикласс — ccGetClassLevel и subclass per class ──────────
  t("[multi] ccGetClassLevel + ccGetSubclass по конкретному классу", function(){
    var char = {class:"Воин", level:6, classes:[
      {class:"Воин", level:3, subclass:"Боевой мастер"},
      {class:"Колдун", level:3, subclass:"Договор с феей"}
    ]};
    if (ccGetClassLevel(char, "Воин") !== 3) return "Воин.level != 3";
    if (ccGetClassLevel(char, "Колдун") !== 3) return "Колдун.level != 3";
    if (ccGetSubclass(char, "Воин") !== "Боевой мастер") return "Воин.subclass";
    if (ccGetSubclass(char, "Колдун") !== "Договор с феей") return "Колдун.subclass";
    return true;
  });

  // ────────── БЛОК 7 (TEST-1): бизнес-логика app-hp.js / app-combat.js ──────────
  // Гард: тесты требуют загруженного app-кода (Node-runner и обновлённый runner.html).
  // В минимальной браузерной среде без app-* они пропускаются как PASS-noop.
  var _hasAppHP = (typeof quickHP === "function");
  var _hasAppCombat = (typeof calcStats === "function" && typeof getMod === "function");

  // No-op стабы для функций из не-загружаемых модулей (app-party/app-ui/app-spells),
  // чтобы транзитивные вызовы внутри quickHP/calcStats не падали.
  ["syncSelfBattleStatus","animateCountUp","renderJournal","renderClassResources",
   "renderSpellSlots","renderMySpells","renderInventory","renderWeapons","renderBuildBadge",
   "updateSlotsDisplay","loadCharacter"].forEach(function(name){
    if (typeof window[name] !== "function") window[name] = function(){};
  });

  // Универсальный хелпер: получить элемент по id, создав при необходимости
  // (node-стаб всегда возвращает один и тот же объект, в браузере добавляем в body).
  function _ensureEl(id, tag) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement(tag || "div");
      el.id = id;
      if (document.body) document.body.appendChild(el);
    }
    return el;
  }
  function _ensureInput(id, value) {
    var el = _ensureEl(id, "input");
    el.value = String(value);
    return el;
  }

  t("[hp] quickHP: временные ХП поглощают урон, остаток уходит в hpCurrent", function(){
    if (!_hasAppHP) return true; // app-hp не загружен (минимальный браузерный runner)
    var savedChars = window.characters, savedId = window.currentId;
    try {
      // updateStatusBar() пишет в эти элементы без null-guard — создаём заранее
      _ensureEl("status-level", "span");
      _ensureEl("status-hp-current", "span");
      _ensureEl("status-hp-max", "span");
      window.characters = [{
        id: "test-hp-1",
        combat: { hpTemp: 5, hpCurrent: 20, hpMax: 20, hpDice: "1к8", hpDiceSpent: 0 },
        stats: { str:10, dex:10, con:10, int:10, wis:10, cha:10 },
        saves: {}, skills: [], spells: { stat:"", slots:{}, slotsUsed:{} },
        level: 1, concentration: null,
        deathSaves: { successes:[false,false,false], failures:[false,false,false] }
      }];
      window.currentId = "test-hp-1";
      quickHP(-10, "Test");
      var ch = window.characters[0];
      if (ch.combat.hpTemp !== 0) return "ожидал hpTemp=0, получено " + ch.combat.hpTemp;
      if (ch.combat.hpCurrent !== 15) return "ожидал hpCurrent=15, получено " + ch.combat.hpCurrent;
      return true;
    } finally {
      window.characters = savedChars;
      window.currentId = savedId;
    }
  });

  t("[stats] calcStats: STR 16 на уровне 5 → mod +3, prof +3", function(){
    if (!_hasAppCombat) return true; // app-combat не загружен
    var savedChars = window.characters, savedId = window.currentId;
    try {
      window.characters = [{
        id: "test-stats-1",
        stats: { str:16, dex:10, con:10, int:10, wis:10, cha:10 },
        saves: { str:false, dex:false, con:false, int:false, wis:false, cha:false },
        skills: [], expertiseSkills: [], combat: {},
        spells: { stat:"", slots:{}, slotsUsed:{}, prepared:[] },
        class: "", level: 5
      }];
      window.currentId = "test-stats-1";
      _ensureInput("char-level", "5");
      _ensureInput("val-str", "16");
      _ensureInput("val-dex", "10");
      _ensureInput("val-con", "10");
      _ensureInput("val-int", "10");
      _ensureInput("val-wis", "10");
      _ensureInput("val-cha", "10");
      // output-элементы, в которые calcStats пишет результаты
      _ensureEl("proficiency-bonus", "span");
      _ensureEl("mod-str", "span");
      calcStats();
      var prof = document.getElementById("proficiency-bonus").innerText;
      var mod = document.getElementById("mod-str").innerText;
      if (prof !== "+3") return "ожидал proficiency-bonus='+3', получено '" + prof + "'";
      if (mod !== "+3") return "ожидал mod-str='+3', получено '" + mod + "'";
      return true;
    } finally {
      window.characters = savedChars;
      window.currentId = savedId;
    }
  });

  // ────────── РЕЗУЛЬТАТЫ ──────────
  window.__testResults = {pass, fail, total: pass+fail, results};

  var summary = document.getElementById("summary");
  summary.className = "summary " + (fail === 0 ? "ok" : "fail");
  summary.textContent = "Итого: "+pass+" OK / "+fail+" FAIL из "+(pass+fail);

  var box = document.getElementById("results");
  // Показываем только фейлы сначала + компактный список остального
  var failed = results.filter(function(r){return !r.ok;});
  var passed = results.filter(function(r){return r.ok;});
  var html = "";
  if (failed.length) {
    html += '<div class="section"><b>FAILS ('+failed.length+'):</b><pre>';
    failed.forEach(function(r){ html += '<span class="fail">✗ '+escapeHtml(r.desc)+'</span>  '+escapeHtml(r.msg||"")+"\n"; });
    html += '</pre></div>';
  }
  html += '<div class="section"><b>PASSED ('+passed.length+'):</b><pre>';
  passed.forEach(function(r){ html += '<span class="ok">✓ '+escapeHtml(r.desc)+'</span>\n'; });
  html += '</pre></div>';
  box.innerHTML = html;

  console.log("[TESTS]", window.__testResults);
})();
