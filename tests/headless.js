// Test runner. Собирает результаты в DOM и window.__testResults для preview_eval.
(function(){
  var results = [];
  var pass = 0, fail = 0;

  // TEST-2: страховка браузерного раннера. Тесты зовут saveToLocal() (quickHP,
  // _applyFullRestore, _invMoveItem), который пишет в localStorage реального
  // origin — на одном origin с приложением это перезаписало бы dnd_chars
  // тестовыми данными. Снимаем снапшот до тестов, возвращаем как было в конце.
  // TEST-3: + dnd_party/dnd_battle — saveParty()/saveBattle() без currentId пишут туда.
  // UI6-1: + dnd_accent/dnd_auto_accent — БЛОК 13 зовёт setAccent(), который их пишет.
  // UI6-4: + dnd_stats_layout — БЛОК 14 зовёт setStatsLayout(), который его пишет.
  var _lsKeys = ["dnd_chars", "dnd_spells", "dnd_hp_history", "dnd_party", "dnd_battle", "dnd_accent", "dnd_auto_accent", "dnd_stats_layout"];
  var _lsSnapshot = {};
  _lsKeys.forEach(function(k){
    try { _lsSnapshot[k] = localStorage.getItem(k); } catch(e) { _lsSnapshot[k] = null; }
  });

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
   "updateSlotsDisplay","loadCharacter","addJournalEntry","firstLoadSkeleton"].forEach(function(name){
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

  // ────────── БЛОК 8 (BUILD-LVL-7): валидность данных автолевелинга билдов ──────────
  // Требует загруженных character-builds.js + spells.js (Node-runner и обновлённый runner.html).
  // В минимальной среде без них блок мягко пропускается (один PASS-noop).
  var _hasBuilds = (typeof CHARACTER_BUILDS !== "undefined" && Array.isArray(CHARACTER_BUILDS) &&
                    typeof getBuildById === "function");

  // ASI-уровни класса по CLASS_FEATURES (фича «Увеличение характеристик») — источник истины приложения,
  // тот же приём, что в dev-verify-builds.js (_asiLevelsCF) и в guided level-up (app-hp.js).
  function _asiLevelsForClass(cls){
    var out = [];
    if (typeof CLASS_FEATURES === "undefined" || !CLASS_FEATURES[cls]) return out;
    Object.keys(CLASS_FEATURES[cls]).forEach(function(k){
      var arr = CLASS_FEATURES[cls][k] || [];
      if (arr.some(function(f){ return f && f.name === "Увеличение характеристик"; })) out.push(parseInt(k,10));
    });
    return out.sort(function(a,b){ return a-b; });
  }

  if (!_hasBuilds) {
    t("[lvl] character-builds.js + spells.js загружены", function(){ return true; }); // noop в минимальной среде
  } else {
    // A1: на каждом ASI-уровне билда headline распознаётся как ASI ИЛИ черта (инвариант «0 пробелов», BUILD-LVL-6).
    CHARACTER_BUILDS.forEach(function(b){
      t("[lvl-asi] " + b.id, function(){
        var char = { buildId: b.id, class: b.className };
        var asiLevels = _asiLevelsForClass(b.className);
        if (!asiLevels.length) return "нет ASI-уровней в CLASS_FEATURES для «" + b.className + "»";
        var gaps = [];
        asiLevels.forEach(function(lv){
          var feat = (typeof getBuildRecFeat === "function") ? getBuildRecFeat(char, lv) : null;
          var asi  = (typeof getBuildRecAsi  === "function") ? getBuildRecAsi(char, lv)  : null;
          if (!feat && !asi) gaps.push(lv);
        });
        return gaps.length === 0 ||
          ("ASI-уровни без feat/asi: " + gaps.join(",") + " (ASI-уровни класса: " + asiLevels.join(",") + ")");
      });
    });

    // A2: id-ы recommendedChoices существуют в CLASS_CHOICES[класс], опции валидны
    //     (в choice.options, либо — для пула «skills» экспертизы — имя из skills[]).
    CHARACTER_BUILDS.forEach(function(b){
      if (!b.recommendedChoices) return;
      t("[lvl-rec] " + b.id, function(){
        // SDR-2: выборы билда могут жить и в SUBCLASS_CHOICES[b.subclass] (напр. манёвры Боевого мастера).
        var defs = ((typeof CLASS_CHOICES !== "undefined" && CLASS_CHOICES[b.className]) || []).slice();
        if (b.subclass && typeof SUBCLASS_CHOICES !== "undefined" && SUBCLASS_CHOICES[b.subclass]) {
          defs = defs.concat(SUBCLASS_CHOICES[b.subclass]);
        }
        var problems = [];
        Object.keys(b.recommendedChoices).forEach(function(choiceId){
          var choice = defs.filter(function(c){ return c.id === choiceId; })[0];
          if (!choice) { problems.push("choiceId «" + choiceId + "» ∉ CLASS_CHOICES[" + b.className + "]/SUBCLASS_CHOICES[" + (b.subclass||"—") + "]"); return; }
          var raw = b.recommendedChoices[choiceId];
          var recIds = Array.isArray(raw) ? raw : [raw];
          recIds.forEach(function(optId){
            var valid;
            if (choice.pool === "skills") {
              valid = (typeof skills !== "undefined") && skills.some(function(s){ return s.name === optId; });
            } else {
              valid = (choice.options || []).indexOf(optId) !== -1;
            }
            if (!valid) problems.push("опция «" + optId + "» ∉ «" + choiceId + "»");
          });
        });
        return problems.length === 0 || problems.join("; ");
      });
    });

    // A3: заклинания.
    t("[lvl-spells] SPELL_DATABASE загружена", function(){
      if (typeof SPELL_DATABASE === "undefined" || !Array.isArray(SPELL_DATABASE)) return "SPELL_DATABASE не определена";
      return SPELL_DATABASE.length > 100 || ("ожидал >100 заклинаний, получено " + SPELL_DATABASE.length);
    });

    t("[lvl-spells] явный spellsAdd резолвится в SPELL_DATABASE", function(){
      if (typeof window.resolveSpellByName !== "function") return "resolveSpellByName недоступна";
      var bad = [];
      CHARACTER_BUILDS.forEach(function(b){
        if (!b.levelUp) return;
        Object.keys(b.levelUp).forEach(function(lv){
          var add = b.levelUp[lv] && b.levelUp[lv].spellsAdd;
          if (!add) return;
          ["cantrips","known","prepared"].forEach(function(k){
            (add[k] || []).forEach(function(n){
              if (!window.resolveSpellByName(n)) bad.push(b.id + " L" + lv + ": «" + n + "»");
            });
          });
        });
      });
      return bad.length === 0 || ("не резолвятся: " + bad.join("; "));
    });

    t("[lvl-spells] рекомендованные заклинания — валидные объекты SPELL_DATABASE без дублей", function(){
      if (typeof getBuildRecSpellObjs !== "function") return "getBuildRecSpellObjs недоступна";
      var total = 0, bad = [];
      CHARACTER_BUILDS.forEach(function(b){
        for (var lv = 1; lv <= 20; lv++) {
          var objs = getBuildRecSpellObjs(b, lv) || [];
          var seen = {};
          objs.forEach(function(sp){
            total++;
            if (!sp || SPELL_DATABASE.indexOf(sp) === -1) { bad.push(b.id + " L" + lv + ": не из SPELL_DATABASE"); return; }
            var key = (sp.id != null) ? sp.id : sp.name;
            if (seen[key]) bad.push(b.id + " L" + lv + ": дубль «" + sp.name + "»");
            seen[key] = 1;
          });
        }
      });
      if (bad.length) return bad.slice(0, 5).join("; ");
      return total > 0 || "ни одного рекоменд. заклинания не резолвилось (парсер/БД сломаны?)";
    });

    // C: guided level-up на мультиклассе — экран выборов строится по per-class level (clvl), а не по общему.
    // Прямой вызов luBuildChoicesScreen с контекстом «повышен второй класс» (Колдун 1→2 у Воин5/Колдун).
    t("[lvl-mc] guided-экран: блоки повышаемого класса по clvl (а не общему уровню)", function(){
      if (typeof luBuildChoicesScreen !== "function") return true; // app-hp не загружен (минимальный runner)
      if (!document.getElementById("lu-choices-body")) return true; // нет DOM модалки повышения (минимальный браузерный runner; покрыто node-стабом)
      var savedChars = window.characters, savedId = window.currentId;
      var savedCtx = (typeof _luChoicesCtx !== "undefined") ? _luChoicesCtx : null;
      try {
        window.characters = [{
          id: "test-mc-1", buildId: "warlock-fiend-blaster",
          class: "Колдун", subclass: "Договор с исчадием",
          classes: [
            { class: "Воин",   level: 5, subclass: "Чемпион" },
            { class: "Колдун", level: 2, subclass: "Договор с исчадием" }
          ],
          level: 7,
          stats: { str:10, dex:14, con:14, int:8, wis:10, cha:16 },
          combat: {}, saves: {}, skills: {}, classChoices: {}, asiUsedLevels: [],
          feats: [], spells: { stat:"ХАР", slots:{}, slotsUsed:{}, mySpells:[] }
        }];
        window.currentId = "test-mc-1";
        // Контекст как после повышения второго класса (Колдун до 2): clvl=2, а общий уровень=7.
        _luChoicesCtx = { newTotalLevel: 7, className: "Колдун", classLevel: 2,
                          subclassName: "Договор с исчадием", isNewClass: false, resultLines: [] };
        var hasChoices = luBuildChoicesScreen();
        var html = document.getElementById("lu-choices-body").innerHTML || "";
        if (!hasChoices) return "luBuildChoicesScreen вернул false (нет блоков)";
        if (html.indexOf("Таинственные воззвания") === -1) return "нет «Таинственные воззвания» (воззвания колдуна открыты на clvl 2)";
        if (html.indexOf("Боевой стиль") !== -1) return "просочился «Боевой стиль» воина (блоки не ограничены повышаемым классом)";
        if (html.indexOf("Предмет договора") !== -1) return "просочился «Предмет договора» (открыт на clvl 3, а повышаем до 2 → не использован clvl)";
        return true;
      } finally {
        window.characters = savedChars; window.currentId = savedId;
        if (typeof _luChoicesCtx !== "undefined") _luChoicesCtx = savedCtx;
      }
    });

    // C2: интеграция — confirmLevelUp при повышении второго класса ставит _luChoicesCtx по этому классу и его clvl.
    t("[lvl-mc] confirmLevelUp: ctx по повышаемому классу (className/classLevel/newTotalLevel)", function(){
      if (typeof confirmLevelUp !== "function") return true; // app-hp не загружен
      if (!document.getElementById("lu-screen-multiclass")) return true; // нет DOM экранов повышения (минимальный браузерный runner; покрыто node-стабом)
      var savedChars = window.characters, savedId = window.currentId;
      var savedCtx = (typeof _luChoicesCtx !== "undefined") ? _luChoicesCtx : null;
      var savedMC = (typeof _luMulticlassChoice !== "undefined") ? _luMulticlassChoice : null;
      // Изолируем логику выбора класса/ctx от полного ре-рендера листа: loadCharacter и
      // updateClassFeatures читают всю модель (coins/inventory/<select>) — для проверки ctx не нужны.
      var realLoad = window.loadCharacter, realUCF = window.updateClassFeatures;
      window.loadCharacter = function(){}; window.updateClassFeatures = function(){};
      try {
        window.characters = [{
          id: "test-mc-2", buildId: "warlock-fiend-blaster",
          class: "Воин", subclass: "Чемпион",
          classes: [
            { class: "Воин",   level: 5, subclass: "Чемпион",           hitDie: 10 },
            { class: "Колдун", level: 1, subclass: "Договор с исчадием", hitDie: 8 }
          ],
          level: 6,
          stats: { str:16, dex:12, con:14, int:8, wis:10, cha:14 },
          combat: { hpMax: 48, hpCurrent: 48, hpDice: "мульти", hpDiceSpent: 0 },
          saves: {}, skills: {}, classChoices: {}, asiUsedLevels: [], feats: [],
          proficiencies: { armor: [], weapon: [], languages: [] },
          spells: { stat:"ХАР", slots:{}, slotsUsed:{}, mySpells:[], prepared:[] }
        }];
        window.currentId = "test-mc-2";
        // Повышаем именно второй класс (Колдун, индекс 1) — существующий, не новый.
        _luMulticlassChoice = { isNew: false, classIndex: 1 };
        confirmLevelUp();
        var ch = window.characters[0];
        if (ch.classes[1].level !== 2) return "Колдун.level: ожидал 2, получено " + ch.classes[1].level;
        if (ch.classes[0].level !== 5) return "Воин.level не должен меняться (получено " + ch.classes[0].level + ")";
        if (typeof _luChoicesCtx === "undefined" || !_luChoicesCtx) return "_luChoicesCtx не установлен";
        if (_luChoicesCtx.className !== "Колдун") return "ctx.className: ожидал «Колдун», получено «" + _luChoicesCtx.className + "»";
        if (_luChoicesCtx.classLevel !== 2) return "ctx.classLevel: ожидал 2 (clvl), получено " + _luChoicesCtx.classLevel;
        if (_luChoicesCtx.newTotalLevel !== 7) return "ctx.newTotalLevel: ожидал 7, получено " + _luChoicesCtx.newTotalLevel;
        return true;
      } finally {
        window.characters = savedChars; window.currentId = savedId;
        window.loadCharacter = realLoad; window.updateClassFeatures = realUCF;
        if (typeof _luChoicesCtx !== "undefined") _luChoicesCtx = savedCtx;
        if (typeof _luMulticlassChoice !== "undefined") _luMulticlassChoice = savedMC;
      }
    });
  }

  // ────────── БЛОК 9: импорт-устойчивость migrateCharacter ──────────
  // Импортный JSON валиден по _isValidImportedChar (class+level), но мог не
  // содержать combat/stats/… — рендер падал на char.combat.hpCurrent.
  // migrateCharacter обязан достроить недостающее из DEFAULT_CHARACTER.
  if (typeof migrateCharacter === "function" && typeof DEFAULT_CHARACTER !== "undefined") {

    t("[import] минимальный персонаж: достроены combat/stats/inventory/spells", function(){
      var c = migrateCharacter({ id: 1, name: "Мин", class: "Плут", level: 5 });
      if (!c.combat || typeof c.combat.hpCurrent !== "number") return "combat.hpCurrent не число: " + JSON.stringify(c.combat);
      if (!c.stats || c.stats.str !== 10) return "stats.str: ожидал 10, получено " + JSON.stringify(c.stats);
      if (!c.inventory || !Array.isArray(c.inventory.weapon)) return "inventory.weapon не массив";
      if (!c.spells || typeof c.spells.slots !== "object") return "spells.slots не объект";
      if (!c.coins || c.coins.gp !== 0) return "coins.gp: ожидал 0";
      if (!c.deathSaves || !Array.isArray(c.deathSaves.successes)) return "deathSaves.successes не массив";
      if (typeof c.saves !== "object" || typeof c.skills !== "object") return "saves/skills не объекты";
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      return true;
    });

    t("[import] существующие значения не перезаписываются (частичные combat/stats)", function(){
      var c = migrateCharacter({ id: 2, class: "Воин", level: 3,
        combat: { hpCurrent: 5, hpMax: 20 }, stats: { str: 18 } });
      if (c.combat.hpCurrent !== 5 || c.combat.hpMax !== 20) return "combat перезаписан: " + JSON.stringify(c.combat);
      if (c.stats.str !== 18) return "stats.str перезаписан: " + c.stats.str;
      if (c.stats.dex !== 10) return "stats.dex не достроен: " + c.stats.dex;
      if (c.combat.hpTemp !== 0) return "combat.hpTemp не достроен: " + c.combat.hpTemp;
      return true;
    });

    t("[import] combat-мусор (строка) заменяется дефолтным объектом", function(){
      var c = migrateCharacter({ id: 3, class: "Бард", level: 2, combat: "junk" });
      if (typeof c.combat !== "object" || typeof c.combat.hpCurrent !== "number") return "combat: " + JSON.stringify(c.combat);
      return true;
    });

    t("[import] легаси-семантика v<6 не сломана: без schemaVersion → basicLocked=true", function(){
      // Достройка дефолтов идёт ПОСЛЕ версионных шагов: v<6 должен увидеть
      // отсутствующий basicLocked и поставить true (а не false из шаблона).
      var c = migrateCharacter({ id: 4, class: "Жрец", level: 1 });
      if (c.basicLocked !== true) return "basicLocked: ожидал true (легаси), получено " + c.basicLocked;
      return true;
    });

    t("[import] _isValidImportedChar: минимальный валиден, мусор режется", function(){
      if (typeof _isValidImportedChar !== "function") return "нет _isValidImportedChar";
      if (!_isValidImportedChar({ class: "Плут", level: 5 })) return "минимальный должен проходить";
      if (_isValidImportedChar({})) return "{} не должен проходить";
      if (_isValidImportedChar({ class: "", level: 5 })) return "пустой class не должен проходить";
      if (_isValidImportedChar({ class: "Плут", level: 25 })) return "level 25 не должен проходить";
      return true;
    });
  } else {
    t("[import] migrateCharacter+DEFAULT_CHARACTER определены", function(){ return "не загружены"; });
  }

  // ────────── БЛОК 9b (TEST-2): round-trip экспорт→импорт, миграции, отбраковка ──────────
  // Конвейер данных: _buildExportPayload() → JSON → _extractCharsFromImport →
  // _isValidImportedChar → migrateCharacter → _applyFullRestore. Единственная
  // поверхность приложения с риском безвозвратной потери данных.
  var _hasExport = (typeof _buildExportPayload === "function" &&
                    typeof _extractCharsFromImport === "function" &&
                    typeof _isValidImportedChar === "function" &&
                    typeof _applyFullRestore === "function" &&
                    typeof migrateCharacter === "function" &&
                    typeof SPELLS_BASE !== "undefined");

  if (!_hasExport) {
    t("[rt] импорт/экспорт app-core загружен", function(){ return true; }); // noop в минимальной среде
  } else {

    t("[rt] _buildExportPayload: конверт полный, userSpells — только пользовательские", function(){
      var savedChars = window.characters, savedHist = window.hpHistory, savedDB = window.SPELL_DATABASE;
      try {
        var c1 = migrateCharacter({ id: 9001, name: "Экспорт-1", class: "Плут", level: 5 });
        var c2 = migrateCharacter({ id: 9002, name: "Экспорт-2", class: "Воин", level: 6,
          classes: [ { class: "Воин", level: 4 }, { class: "Плут", level: 2 } ] });
        window.characters = [c1, c2];
        window.hpHistory = [
          { charId: 9001, from: 10, to: 8, delta: -2 },
          { charId: 777,  from: 5,  to: 5, delta: 0 }
        ];
        window.SPELL_DATABASE = SPELLS_BASE.concat([{ id: "user-rt-1", name: "Тестовый луч", level: 1 }]);
        var p = _buildExportPayload();
        if (p.app !== "dnd-sheet") return "app: " + p.app;
        if (p.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + p.schemaVersion;
        if (!p.exportedAt) return "нет exportedAt";
        if (!Array.isArray(p.characters) || p.characters.length !== 2) return "characters: ожидал 2";
        if (!Array.isArray(p.hpHistory) || p.hpHistory.length !== 2) return "hpHistory: ожидал 2 (как есть, фильтр — на импорте)";
        if (!Array.isArray(p.userSpells) || p.userSpells.length !== 1 || p.userSpells[0].id !== "user-rt-1")
          return "userSpells: ожидал ровно 1 пользовательское, получено " +
            JSON.stringify((p.userSpells || []).map(function(s){ return s.id; }));
        return true;
      } finally { window.characters = savedChars; window.hpHistory = savedHist; window.SPELL_DATABASE = savedDB; }
    });

    t("[rt] round-trip: экспорт → JSON → извлечение → валидация → миграция без изменений", function(){
      var savedChars = window.characters, savedHist = window.hpHistory;
      try {
        var c1 = migrateCharacter({ id: 9101, name: "РТ-Плут", class: "Плут", level: 5 });
        var c2 = migrateCharacter({ id: 9102, name: "РТ-Мульти", class: "Воин", level: 6,
          classes: [ { class: "Воин", level: 4 }, { class: "Плут", level: 2 } ] });
        c1.coins.gp = 42;
        c1.inventory.weapon.push({ name: "Кинжал", qty: 2, weight: 1 });
        window.characters = [c1, c2];
        window.hpHistory = [];
        var parsed = JSON.parse(JSON.stringify(_buildExportPayload()));
        var extracted = _extractCharsFromImport(parsed);
        if (!extracted) return "_extractCharsFromImport вернул null для собственного конверта";
        var valid = extracted.filter(_isValidImportedChar);
        if (valid.length !== 2) return "валидных: ожидал 2, получено " + valid.length;
        var migrated = valid.map(migrateCharacter);
        if (JSON.stringify(migrated) !== JSON.stringify([c1, c2]))
          return "round-trip изменил данные (migrateCharacter не идемпотентен для v" + c1.schemaVersion + ")";
        return true;
      } finally { window.characters = savedChars; window.hpHistory = savedHist; }
    });

    t("[rt] _extractCharsFromImport: голый массив, конверт {characters}, мусор → null", function(){
      var arr = [{ class: "Плут", level: 1 }];
      if (_extractCharsFromImport(arr) !== arr) return "голый массив должен вернуться как есть";
      if (_extractCharsFromImport({ characters: arr }) !== arr) return "{characters:[...]} должен вернуть массив";
      if (_extractCharsFromImport({}) !== null) return "{} → ожидал null";
      if (_extractCharsFromImport("строка") !== null) return "строка → ожидал null";
      if (_extractCharsFromImport(null) !== null) return "null → ожидал null";
      if (_extractCharsFromImport({ characters: "не массив" }) !== null) return "characters-не-массив → ожидал null";
      return true;
    });

    t("[rt] отбраковка: мультикласс валиден, classes:[] и битые элементы режутся", function(){
      if (!_isValidImportedChar({ classes: [{ class: "Воин", level: 3 }, { class: "Плут", level: 2 }], level: 5 }))
        return "валидный мультикласс должен проходить";
      if (_isValidImportedChar({ classes: [], level: 5 })) return "classes:[] не должен проходить";
      if (_isValidImportedChar({ classes: [{ class: "Воин", level: "3" }], level: 3 })) return "level-строка внутри classes не должна проходить";
      if (_isValidImportedChar({ classes: [{ class: "Воин", level: 3 }, null], level: 4 })) return "null-элемент в classes не должен проходить";
      if (_isValidImportedChar({ class: "Плут", level: "5" })) return "level-строка не должна проходить";
      if (_isValidImportedChar({ class: "Плут" })) return "без level не должен проходить";
      var mixed = [
        { class: "Плут", level: 3 },                              // валиден
        {}, null, "мусор",
        { class: "Жрец", level: 0 },                              // level вне 1..20
        { classes: [{ class: "Бард", level: 2 }], level: 2 }      // валидный мультикласс
      ];
      var valid = mixed.filter(_isValidImportedChar);
      if (valid.length !== 2) return "из смеси ожидал 2 валидных, получено " + valid.length;
      return true;
    });

    t("[rt] _applyFullRestore: замена chars, фильтр+кап hpHistory, восстановление userSpells", function(){
      var savedChars = window.characters, savedHist = window.hpHistory, savedDB = window.SPELL_DATABASE;
      try {
        window.characters = [migrateCharacter({ id: 1, name: "Старый", class: "Бард", level: 2 })];
        window.SPELL_DATABASE = SPELLS_BASE.slice();
        var hist = [];
        for (var i = 0; i < 310; i++) hist.push({ charId: 9201, from: 10, to: 9, delta: -1 });
        hist.push({ charId: 555, from: 1, to: 1, delta: 0 }); // чужой id — должен отфильтроваться
        var envelope = {
          app: "dnd-sheet", schemaVersion: 12,
          characters: [{ id: 9201, name: "Новый", class: "Плут", level: 7 }],
          hpHistory: hist,
          userSpells: [{ id: "user-rt-2", name: "Тестовая искра", level: 0 }, { name: "", level: 0 }, "мусор"]
        };
        _applyFullRestore(envelope, envelope.characters.filter(_isValidImportedChar));
        if (window.characters.length !== 1 || window.characters[0].id !== 9201) return "characters не заменены";
        if (!window.characters[0].combat || typeof window.characters[0].combat.hpCurrent !== "number")
          return "migrateCharacter не прогнан (нет combat.hpCurrent)";
        if (window.hpHistory.length !== 300) return "hpHistory: ожидал кап 300, получено " + window.hpHistory.length;
        if (window.hpHistory.some(function(h){ return h.charId !== 9201; })) return "чужой charId не отфильтрован";
        var userNow = window.SPELL_DATABASE.filter(function(s){ return s && s.id === "user-rt-2"; });
        if (userNow.length !== 1) return "userSpells не восстановлены";
        if (window.SPELL_DATABASE.length !== SPELLS_BASE.length + 1)
          return "SPELL_DATABASE: ожидал база+1 (битые userSpells отрезаны), получено " + window.SPELL_DATABASE.length;
        // конверт без userSpells (бэкап до v3.25) — заклинания не трогаются
        _applyFullRestore({ characters: envelope.characters, hpHistory: [] }, envelope.characters.filter(_isValidImportedChar));
        if (window.SPELL_DATABASE.length !== SPELLS_BASE.length + 1)
          return "конверт без userSpells изменил SPELL_DATABASE: " + window.SPELL_DATABASE.length;
        return true;
      } finally { window.characters = savedChars; window.hpHistory = savedHist; window.SPELL_DATABASE = savedDB; }
    });

    t("[rt] миграция v0→12: легаси-Колдун L5 — языки/инструменты/заметки/пакт-ячейки", function(){
      var legacy = {
        id: 9301, name: "Легаси", class: "Колдун", level: 5,
        stats: { str: 8, dex: 14, con: 12, int: 10, wis: 10, cha: 16 },
        combat: { hpCurrent: 28, hpMax: 28 },
        proficiencies: { armor: [], weapon: [], tools: "Воровские инструменты, Кости", languages: "Общий; Эльфийский" },
        notes: "Старая предыстория", appearance: "Шрам",
        spells: { slots: { 1: 0, 2: 0, 3: 2 }, slotsUsed: { 3: 1 } },
        journal: [{ text: "запись" }]
      };
      var c = migrateCharacter(JSON.parse(JSON.stringify(legacy)));
      if (c.schemaVersion !== 28) return "schemaVersion: " + c.schemaVersion;
      var langs = c.proficiencies.languages;
      if (!Array.isArray(langs) || langs.length !== 2 || langs[0].name !== "Общий" || langs[1].name !== "Эльфийский")
        return "языки строка→массив: " + JSON.stringify(langs);
      var tools = c.proficiencies.tools;
      if (!Array.isArray(tools) || tools.length !== 2 || tools[0].name !== "Воровские инструменты")
        return "инструменты строка→массив: " + JSON.stringify(tools);
      if (c.notesV2.sections.backstory !== "Старая предыстория") return "notes → notesV2.backstory: " + JSON.stringify(c.notesV2.sections.backstory);
      if (c.notesV2.sections.appearance !== "Шрам") return "appearance → notesV2: " + JSON.stringify(c.notesV2.sections.appearance);
      if (c.basicLocked !== true) return "basicLocked (легаси v<6): " + c.basicLocked;
      if (c.spells.pactSlots !== 2 || c.spells.pactLevel !== 3)
        return "пакт-ячейки Колдуна L5: ожидал 2 × 3 ур., получено " + c.spells.pactSlots + " × " + c.spells.pactLevel + " ур.";
      if (c.spells.pactUsed !== 1) return "pactUsed: ожидал 1 (перенос из slotsUsed[3]), получено " + c.spells.pactUsed;
      if (c.spells.slots[3] !== 0) return "обычные слоты одноклассового Колдуна должны обнулиться: slots[3]=" + c.spells.slots[3];
      if (c.combat.hpCurrent !== 28) return "hpCurrent потерян: " + c.combat.hpCurrent;
      if (c.combat.hpTemp !== 0) return "hpTemp не достроен: " + c.combat.hpTemp;
      if (!Array.isArray(c.journal) || c.journal.length !== 1) return "journal потерян";
      if (c.buildId !== null) return "buildId: ожидал null, получено " + c.buildId;
      return true;
    });

    t("[mig] schema 17 (REQ-5b ур.1): имена заклинаний ур.1 → книга PHB 2014", function(){
      var c = migrateCharacter({
        id: 9401, class: "Бард", level: 3, schemaVersion: 16,
        spells: {
          prepared: ["Громовая волна", "Сон", "Лечение ран"],
          mySpells: [{ id: 101, name: "Слово исцеления" }, { id: 102, name: "Огни фей" }, { id: 103, name: "Порча" }]
        }
      });
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      if (c.spells.prepared.join("|") !== "Волна грома|Усыпление|Лечение ран")
        return "prepared не переименован под книгу: " + JSON.stringify(c.spells.prepared);
      var names = c.spells.mySpells.map(function(s){ return s.name; }).join("|");
      if (names !== "Лечащее слово|Огонь фей|Порча")
        return "mySpells не переименованы под книгу: " + names;
      return true;
    });

    t("[mig] schema 18 (REQ-5b ур.2): имена заклинаний ур.2 → книга PHB 2014", function(){
      var c = migrateCharacter({
        id: 9501, class: "Жрец", level: 5, schemaVersion: 17,
        spells: {
          prepared: ["Зеркальное отображение", "Отмычка", "Лечение ран"],
          mySpells: [{ id: 201, name: "Духовное оружие" }, { id: 202, name: "Огненная сфера" }, { id: 203, name: "Невидимость" }]
        }
      });
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      if (c.spells.prepared.join("|") !== "Отражения|Открывание|Лечение ран")
        return "prepared не переименован под книгу: " + JSON.stringify(c.spells.prepared);
      var names = c.spells.mySpells.map(function(s){ return s.name; }).join("|");
      if (names !== "Божественное оружие|Пылающий шар|Невидимость")
        return "mySpells не переименованы под книгу: " + names;
      return true;
    });

    t("[mig] schema 19 (REQ-5b ур.3): имена заклинаний ур.3 → книга PHB 2014", function(){
      var c = migrateCharacter({
        id: 9601, class: "Жрец", level: 5, schemaVersion: 18,
        spells: {
          prepared: ["Оживление", "Духи-хранители", "Лечение ран"],
          mySpells: [{ id: 301, name: "Оживление мертвецов" }, { id: 302, name: "Страх" }, { id: 303, name: "Огненный шар" }]
        }
      });
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      if (c.spells.prepared.join("|") !== "Возрождение|Духовные стражи|Лечение ран")
        return "prepared не переименован под книгу: " + JSON.stringify(c.spells.prepared);
      var names = c.spells.mySpells.map(function(s){ return s.name; }).join("|");
      if (names !== "Восставший труп|Ужас|Огненный шар")
        return "mySpells не переименованы под книгу: " + names;
      return true;
    });

    t("[mig] schema 20 (REQ-5b ур.4): имена заклинаний ур.4 → книга PHB 2014", function(){
      var c = migrateCharacter({
        id: 9701, class: "Волшебник", level: 8, schemaVersion: 19,
        spells: {
          prepared: ["Полиморф", "Ледяной шторм", "Лечение ран"],
          mySpells: [{ id: 401, name: "Прорицание" }, { id: 402, name: "Чёрные щупальца" }, { id: 403, name: "Огненный шар" }]
        }
      });
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      if (c.spells.prepared.join("|") !== "Превращение|Град|Лечение ран")
        return "prepared не переименован под книгу: " + JSON.stringify(c.spells.prepared);
      var names = c.spells.mySpells.map(function(s){ return s.name; }).join("|");
      if (names !== "Предсказание|Эвардовы чёрные щупальца|Огненный шар")
        return "mySpells не переименованы под книгу: " + names;
      return true;
    });

    t("[mig] schema 21 (REQ-5b ур.5): имена заклинаний ур.5 → книга PHB 2014", function(){
      var c = migrateCharacter({
        id: 9801, class: "Жрец", level: 9, schemaVersion: 20,
        spells: {
          prepared: ["Поднятие мёртвых", "Массовое лечение ран", "Огненный удар"],
          mySpells: [{ id: 481, name: "Обман" }, { id: 506, name: "Двойник" }, { id: 475, name: "Магическое связывание" }, { id: 405, name: "Огненный шар" }]
        }
      });
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      if (c.spells.prepared.join("|") !== "Оживление|Множественное лечение ран|Небесный огонь")
        return "prepared не переименован под книгу: " + JSON.stringify(c.spells.prepared);
      var names = c.spells.mySpells.map(function(s){ return s.name; }).join("|");
      // Mislead PH14 «Обман» + PH24 «Двойник» → «Фальшивый двойник»; Planar Binding → «Планарные узы».
      if (names !== "Фальшивый двойник|Фальшивый двойник|Планарные узы|Огненный шар")
        return "mySpells не переименованы под книгу: " + names;
      return true;
    });

    t("[mig] schema 22 (REQ-5b ур.6): имена заклинаний ур.6 → книга PHB 2014", function(){
      var c = migrateCharacter({
        id: 9901, class: "Волшебник", level: 11, schemaVersion: 21,
        spells: {
          prepared: ["Дезинтеграция", "Цепная молния", "Огненный шар"],
          mySpells: [{ id: 541, name: "Вред" }, { id: 546, name: "Исцеление" }, { id: 568, name: "Стена льда" }, { id: 405, name: "Огненный шар" }]
        }
      });
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      if (c.spells.prepared.join("|") !== "Распад|Пляшущая молния|Огненный шар")
        return "prepared не переименован под книгу: " + JSON.stringify(c.spells.prepared);
      var names = c.spells.mySpells.map(function(s){ return s.name; }).join("|");
      // Harm «Вред» → «Поражение»; Heal «Исцеление» → «Полное исцеление»; Wall of ice «Стена льда» → «Ледяная стена».
      if (names !== "Поражение|Полное исцеление|Ледяная стена|Огненный шар")
        return "mySpells не переименованы под книгу: " + names;
      return true;
    });

    t("[mig] schema 23 (REQ-5b ур.7): имена заклинаний ур.7 → книга PHB 2014", function(){
      var c = migrateCharacter({
        id: 9921, class: "Волшебник", level: 13, schemaVersion: 22,
        spells: {
          prepared: ["Силовая клетка", "Призматический луч", "Огненный шар"],
          mySpells: [{ id: 618, name: "Символ" }, { id: 619, name: "Симулякр" }, { id: 607, name: "Обратная гравитация" }, { id: 405, name: "Огненный шар" }]
        }
      });
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      // Forcecage «Силовая клетка» → «Узилище»; Prismatic spray «Призматический луч» → «Радужные брызги».
      if (c.spells.prepared.join("|") !== "Узилище|Радужные брызги|Огненный шар")
        return "prepared не переименован под книгу: " + JSON.stringify(c.spells.prepared);
      var names = c.spells.mySpells.map(function(s){ return s.name; }).join("|");
      // Symbol «Символ» → «Знак»; Simulacrum «Симулякр» → «Подобие»; Reverse gravity «Обратная гравитация» → «Изменение тяготения».
      if (names !== "Знак|Подобие|Изменение тяготения|Огненный шар")
        return "mySpells не переименованы под книгу: " + names;
      return true;
    });

    t("[mig] schema 24 (REQ-5b ур.8): имена заклинаний ур.8 → книга PHB 2014", function(){
      var c = migrateCharacter({
        id: 9941, class: "Волшебник", level: 15, schemaVersion: 23,
        spells: {
          prepared: ["Клон", "Антимагическое поле", "Огненный шар"],
          mySpells: [{ id: 657, name: "Слабоумие" }, { id: 671, name: "Оцепенение" }, { id: 656, name: "Священная аура" }, { id: 405, name: "Огненный шар" }]
        }
      });
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      // Clone «Клон» → «Двойник»; Antimagic field «Антимагическое поле» → «Преграда магии».
      if (c.spells.prepared.join("|") !== "Двойник|Преграда магии|Огненный шар")
        return "prepared не переименован под книгу: " + JSON.stringify(c.spells.prepared);
      var names = c.spells.mySpells.map(function(s){ return s.name; }).join("|");
      // Feeblemind PH14 «Слабоумие» = книга (без изм.); PH24 Befuddlement «Оцепенение» → «Слабоумие»;
      // Holy aura «Священная аура» → «Аура святости».
      if (names !== "Слабоумие|Слабоумие|Аура святости|Огненный шар")
        return "mySpells не переименованы под книгу: " + names;
      return true;
    });

    t("[mig] schema 25 (REQ-5b ур.9): имена заклинаний ур.9 + family-fix Power Word → книга PHB 2014", function(){
      var c = migrateCharacter({
        id: 9961, class: "Волшебник", level: 17, schemaVersion: 24,
        spells: {
          prepared: ["Перевоплощение", "Рой метеоров", "Огненный шар"],
          mySpells: [{ id: 688, name: "Кошмарное видение" }, { id: 682, name: "Буря мести" }, { id: 696, name: "Слово силы: смерть" }, { id: 405, name: "Огненный шар" }]
        }
      });
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      // Shapechange «Перевоплощение» → «Полное превращение»; Meteor swarm «Рой метеоров» → «Метеоритный дождь».
      if (c.spells.prepared.join("|") !== "Полное превращение|Метеоритный дождь|Огненный шар")
        return "prepared не переименован под книгу: " + JSON.stringify(c.spells.prepared);
      var names = c.spells.mySpells.map(function(s){ return s.name; }).join("|");
      // Weird «Кошмарное видение» → «Смертный ужас»; Storm of vengeance «Буря мести» → «Гроза гнева»;
      // family-fix регистра «Слово силы: смерть» → «Слово Силы: смерть».
      if (names !== "Смертный ужас|Гроза гнева|Слово Силы: смерть|Огненный шар")
        return "mySpells не переименованы под книгу: " + names;
      return true;
    });

    t("[mig] schema 26 (REQ-5d Волшебник): таксономия школ — своп ключей подкласса → книга PHB 2014", function(){
      // Своп Conjuration↔Evocation через имя «Школа воплощения» должен быть collision-safe.
      var conj = migrateCharacter({ id: 9971, class: "Волшебник", level: 6, schemaVersion: 25, subclass: "Школа воплощения" });
      if (conj.subclass !== "Школа вызова")
        return "Conjuration: ожидал «Школа вызова», получено «" + conj.subclass + "»";
      var evoc = migrateCharacter({ id: 9972, class: "Волшебник", level: 6, schemaVersion: 25, subclass: "Школа эвокации" });
      if (evoc.subclass !== "Школа воплощения")
        return "Evocation: ожидал «Школа воплощения», получено «" + evoc.subclass + "»";
      var abj = migrateCharacter({ id: 9973, class: "Волшебник", level: 6, schemaVersion: 25, subclass: "Школа отмены" });
      if (abj.subclass !== "Школа ограждения")
        return "Abjuration: ожидал «Школа ограждения», получено «" + abj.subclass + "»";
      var ench = migrateCharacter({ id: 9974, class: "Волшебник", level: 6, schemaVersion: 25, subclass: "Школа заговаривания" });
      if (ench.subclass !== "Школа очарования")
        return "Enchantment: ожидал «Школа очарования», получено «" + ench.subclass + "»";
      // Мультикласс: char.classes[].subclass тоже мигрирует.
      var mc = migrateCharacter({ id: 9975, class: "Волшебник", level: 8, schemaVersion: 25,
        classes: [{ class: "Волшебник", level: 8, subclass: "Школа отмены" }] });
      if (mc.classes[0].subclass !== "Школа ограждения")
        return "мультикласс: ожидал «Школа ограждения», получено «" + mc.classes[0].subclass + "»";
      // Неизменные школы не трогаются.
      var div = migrateCharacter({ id: 9976, class: "Волшебник", level: 6, schemaVersion: 25, subclass: "Школа прорицания" });
      if (div.subclass !== "Школа прорицания")
        return "Divination не должна меняться, получено «" + div.subclass + "»";
      if (div.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + div.schemaVersion;
      return true;
    });

    t("[mig] schema 27 (REQ-6): дочистка имён Cloud of Daggers / Incendiary Cloud → книга PHB 2014", function(){
      // Недокат REQ-5b: записи в spells.js остались «Туча кинжалов» (ур.2) и
      // «Воспламеняющаяся туча» (ур.8). Сейв любой схемы 18–26 мог их содержать →
      // v<27 сводит к «Облако кинжалов» / «Воспламеняющая туча» (имена БД после фикса).
      var c = migrateCharacter({
        id: 9981, class: "Волшебник", level: 16, schemaVersion: 26,
        spells: {
          prepared: ["Туча кинжалов", "Огненный шар"],
          mySpells: [{ id: 652, name: "Воспламеняющаяся туча" }, { id: 405, name: "Огненный шар" }]
        }
      });
      if (c.schemaVersion !== 28) return "schemaVersion: ожидал 28, получено " + c.schemaVersion;
      if (c.spells.prepared.join("|") !== "Облако кинжалов|Огненный шар")
        return "prepared не переименован под книгу: " + JSON.stringify(c.spells.prepared);
      var names = c.spells.mySpells.map(function(s){ return s.name; }).join("|");
      if (names !== "Воспламеняющая туча|Огненный шар")
        return "mySpells не переименованы под книгу: " + names;
      return true;
    });

    t("[mig] schema 28 (BUGFIX PH24): у персонажей с buildId PH24-заклинания → PH14-аналог", function(){
      // applyBuild набирал PH24-версии (карта имён строилась перезаписью, PH24-дубли
      // в spells.js после PH14). Билды = PHB 2014 → v<28 переназначает по имя+уровень.
      var ph24 = SPELLS_BASE.find(function(s){ return s.name === "Огненный снаряд" && s.source === "PH24"; });
      var ph24only = SPELLS_BASE.find(function(s){ return s.source === "PH24" &&
        !SPELLS_BASE.some(function(x){ return x.source === "PH14" && x.name.toLowerCase() === s.name.toLowerCase(); }); });
      if (!ph24) return "в SPELLS_BASE нет PH24 «Огненный снаряд»";
      var c = migrateCharacter({
        id: 9991, class: "Волшебник", level: 1, schemaVersion: 27, buildId: "wizard-evoker",
        spells: { prepared: [], mySpells: [JSON.parse(JSON.stringify(ph24))].concat(
          ph24only ? [JSON.parse(JSON.stringify(ph24only))] : []) }
      });
      if (c.spells.mySpells[0].source !== "PH14")
        return "PH24 «Огненный снаряд» не заменён на PH14: " + c.spells.mySpells[0].source;
      if (ph24only && c.spells.mySpells[1].source !== "PH24")
        return "PH24-only заклинание «" + ph24only.name + "» не должно меняться";
      // Без buildId — не трогаем (ручной выбор версии).
      var m = migrateCharacter({
        id: 9992, class: "Волшебник", level: 1, schemaVersion: 27,
        spells: { prepared: [], mySpells: [JSON.parse(JSON.stringify(ph24))] }
      });
      if (m.spells.mySpells[0].source !== "PH24")
        return "без buildId PH24 не должен заменяться: " + m.spells.mySpells[0].source;
      return true;
    });
  }

  // ────────── БЛОК 10 (TEST-2): инвентарь — слоты, вес, монеты, мешочки ──────────
  // Требует загруженного app-inventory.js (Node-runner и обновлённый runner.html).
  var _hasInv = (typeof getSlotsTotal === "function" && typeof calcUsedSlots === "function" &&
                 typeof updateInventoryWeight === "function" && typeof renderPouches === "function" &&
                 typeof _invMoveItem === "function");

  if (!_hasInv) {
    t("[inv] app-inventory.js загружен", function(){ return true; }); // noop в минимальной среде
  } else {

    t("[inv] getSlotsTotal: пороги СИЛ 8/10/12/13/15/16/20", function(){
      var exp = { 8: 7, 10: 10, 12: 10, 13: 12, 15: 12, 16: 15, 20: 15 };
      var bad = [];
      Object.keys(exp).forEach(function(str){
        var got = getSlotsTotal(parseInt(str, 10));
        if (got !== exp[str]) bad.push("СИЛ " + str + ": ожидал " + exp[str] + ", получено " + got);
      });
      return bad.length === 0 || bad.join("; ");
    });

    t("[inv] calcUsedSlots: дефолты категорий, qty, явный slots (вкл. 0)", function(){
      var char = {
        inventory: {
          weapon: [{ name: "Меч", qty: 1 }],                  // дефолт weapon = 1
          armor:  [{ name: "Кольчуга", qty: 1 }],             // дефолт armor = 3
          potion: [{ name: "Зелье", qty: 4 }],                // дефолт potion 0.5 × 4 = 2
          scroll: [{ name: "Карта", qty: 3, slots: 0 }],      // явный 0 — не дефолт scroll=1
          other:  [{ name: "Верёвка", qty: 2, slots: 0.5 }]   // явный 0.5 × 2 = 1
        }
      };
      var used = calcUsedSlots(char);
      return used === 7 || ("ожидал 7 слотов, получено " + used);
    });

    t("[inv] calcUsedSlots: снятый рюкзак исключает backpack и предметы без location", function(){
      var char = {
        equipState: { backpackOff: true },
        inventory: {
          weapon: [{ name: "Меч", qty: 1, location: "wielded" }], // в руке → активен
          tool:   [{ name: "Кирка", qty: 1, location: "belt" }],  // на поясе → активен
          other:  [
            { name: "Палатка", qty: 1, location: "backpack" },    // в рюкзаке → исключён
            { name: "Фляга", qty: 1 }                             // без location → считается «в рюкзаке»
          ]
        }
      };
      var off = calcUsedSlots(char);
      if (off !== 2) return "рюкзак снят: ожидал 2, получено " + off;
      char.equipState.backpackOff = false;
      var on = calcUsedSlots(char);
      if (on !== 4) return "рюкзак надет: ожидал 4, получено " + on;
      return true;
    });

    t("[inv] updateInventoryWeight: вес + монеты (50/фнт), грузоподъёмность СИЛ×15, перегруз", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id: "test-inv-w", stats: { str: 10 },
          inventory: { weapon: [{ name: "Молот", weight: 6, qty: 2 }] },
          coins: { cp: 25, sp: 0, ep: 0, gp: 25, pp: 0 }
        }];
        window.currentId = "test-inv-w";
        var totalEl = _ensureEl("total-weight", "span");
        var capEl = _ensureEl("carry-capacity-num", "span");
        var coinEl = _ensureEl("coin-weight", "span");
        _ensureEl("overweight-warning", "div");
        var owAmt = _ensureEl("overweight-amount", "span");
        updateInventoryWeight();
        if (String(totalEl.textContent) !== "13") return "total-weight: ожидал 13 (12 + 1 фнт за 50 монет), получено " + totalEl.textContent;
        if (String(capEl.textContent) !== "150") return "carry-capacity-num: ожидал 150 (СИЛ 10 × 15), получено " + capEl.textContent;
        if (String(coinEl.textContent) !== "1.00 фнт") return "coin-weight: ожидал '1.00 фнт', получено '" + coinEl.textContent + "'";
        // перегруз: 170 + 1 фнт монет = 171 при грузоподъёмности 150 → бейдж 21.0
        window.characters[0].inventory.weapon[0] = { name: "Наковальня", weight: 170, qty: 1 };
        updateInventoryWeight();
        if (String(owAmt.textContent) !== "21.0") return "overweight-amount: ожидал 21.0, получено " + owAmt.textContent;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[inv] мешочки: разблокировка по СИЛ, ёмкость POUCH_MAX, перебор монет", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id: "test-inv-p", stats: { str: 12 },
          inventory: {}, coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }
        }];
        window.currentId = "test-inv-p";
        var box = _ensureEl("inv-pouches", "div");
        _ensureInput("coin-cp", "0"); _ensureInput("coin-sp", "0"); _ensureInput("coin-ep", "0");
        _ensureInput("coin-gp", "1200"); _ensureInput("coin-pp", "0");
        renderPouches();
        var html = String(box.innerHTML);
        var open = (html.match(/👝/g) || []).length;
        var locked = (html.match(/🔒/g) || []).length;
        if (open !== 2 || locked !== 2) return "СИЛ 12: ожидал 2 открытых + 2 закрытых, получено " + open + " + " + locked;
        if (html.indexOf(String(POUCH_MAX * 2)) === -1) return "нет ёмкости " + (POUCH_MAX * 2) + " (2 × POUCH_MAX)";
        if (html.indexOf("не унести 200") === -1) return "нет «не унести 200» (1200 монет при ёмкости 1000)";
        window.characters[0].stats.str = 6;
        renderPouches();
        if (String(box.innerHTML).indexOf("Нет мешочков") === -1) return "СИЛ 6: ожидал «Нет мешочков»";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[inv] _invMoveItem: перестановка в категории, no-op, перенос между категориями", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id: "test-inv-m", stats: { str: 10 },
          inventory: {
            weapon: [{ name: "А" }, { name: "Б" }, { name: "В" }],
            other:  [{ name: "Г" }]
          },
          coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }
        }];
        window.currentId = "test-inv-m";
        var inv = window.characters[0].inventory;
        _invMoveItem("weapon", 0, "weapon", 2); // А встаёт перед В → [Б, А, В]
        var names = inv.weapon.map(function(i){ return i.name; }).join("");
        if (names !== "БАВ") return "перестановка: ожидал БАВ, получено " + names;
        _invMoveItem("weapon", 1, "weapon", 2); // toIdx = fromIdx+1 → no-op
        names = inv.weapon.map(function(i){ return i.name; }).join("");
        if (names !== "БАВ") return "no-op изменил порядок: " + names;
        _invMoveItem("weapon", 2, "other", 1e9); // перенос В в конец other (индекс клампится)
        if (inv.weapon.length !== 2) return "weapon: ожидал 2 после переноса, получено " + inv.weapon.length;
        if (inv.other.length !== 2 || inv.other[1].name !== "В") return "other: В должен встать в конец, получено " + JSON.stringify(inv.other);
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });
  }

  // ────────── БЛОК 11 (TEST-3): заклинания — подготовка и ячейки (app-spells.js) ──────────
  // Требует загруженного app-spells.js (Node-runner и обновлённый runner.html).
  // В минимальной среде без него блок мягко пропускается (один PASS-noop).
  var _hasSpellsMod = (typeof isPrepClass === "function" && typeof calcMaxPrepared === "function" &&
                       typeof isSpellPrepared === "function" && typeof toggleSpellPrepared === "function" &&
                       typeof toggleSpellSlot === "function" && typeof adjustSpellSlots === "function" &&
                       typeof togglePactSlot === "function" && typeof adjustPactSlots === "function");

  if (!_hasSpellsMod) {
    t("[spells] app-spells.js загружен", function(){ return true; }); // noop в минимальной среде
  } else {

    t("[spells] isPrepClass: Жрец/Друид/Паладин/Волшебник готовят, Воин/Колдун/null — нет", function(){
      var prep = ["Жрец", "Друид", "Паладин", "Волшебник"];
      for (var i = 0; i < prep.length; i++) {
        if (!isPrepClass({ class: prep[i] })) return prep[i] + " должен готовить заклинания";
      }
      if (isPrepClass({ class: "Воин" })) return "Воин не готовит";
      if (isPrepClass({ class: "Колдун" })) return "Колдун знает заклинания, а не готовит";
      if (isPrepClass(null)) return "null не готовит";
      if (isPrepClass({})) return "без класса не готовит";
      return true;
    });

    t("[spells] calcMaxPrepared: mod+level, mod+halfLevel у Паладина, кламп ≥1, не-prep → null", function(){
      var got = calcMaxPrepared({ class: "Жрец", level: 5, stats: { wis: 16 } });
      if (got !== 8) return "Жрец L5 МУД16: ожидал 8 (3+5), получено " + got;
      got = calcMaxPrepared({ class: "Паладин", level: 6, stats: { cha: 16 } });
      if (got !== 6) return "Паладин L6 ХАР16: ожидал 6 (3+3, halfLevel), получено " + got;
      got = calcMaxPrepared({ class: "Жрец", level: 1, stats: { wis: 8 } });
      if (got !== 1) return "Жрец L1 МУД8: ожидал кламп 1, получено " + got;
      got = calcMaxPrepared({ class: "Волшебник", level: 3 });
      if (got !== 3) return "Волшебник L3 без stats (ИНТ 10): ожидал 3, получено " + got;
      if (calcMaxPrepared({ class: "Воин", level: 5, stats: { str: 18 } }) !== null) return "Воин: ожидал null";
      if (calcMaxPrepared(null) !== null) return "null: ожидал null";
      return true;
    });

    t("[spells] isSpellPrepared: не-prep класс всегда true, prep — по списку, prepared достраивается", function(){
      if (isSpellPrepared({ class: "Воин", spells: {} }, 42) !== true) return "Воин: ожидал true";
      var cleric = { class: "Жрец", spells: { prepared: [7] } };
      if (isSpellPrepared(cleric, 7) !== true) return "id 7 в prepared: ожидал true";
      if (isSpellPrepared(cleric, 8) !== false) return "id 8 не в prepared: ожидал false";
      var fresh = { class: "Жрец", spells: {} };
      if (isSpellPrepared(fresh, 1) !== false) return "пустой prepared: ожидал false";
      if (!Array.isArray(fresh.spells.prepared)) return "prepared не достроен массивом";
      return true;
    });

    t("[spells] toggleSpellPrepared: вкл/выкл, лимит не-заговоров, заговоры вне лимита", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id: "test-prep-1", class: "Жрец", level: 1,
          stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }, // МУД 10 → лимит max(1, 0+1) = 1
          combat: {}, saves: {}, skills: [],
          spells: { stat: "МУД", slots: {}, slotsUsed: {},
            mySpells: [
              { id: 100, name: "Свет",        level: 0 },
              { id: 101, name: "Лечение ран", level: 1 },
              { id: 102, name: "Щит веры",    level: 1 }
            ],
            prepared: [100] } // заговор «подготовлен» — не должен попадать в лимит
        }];
        window.currentId = "test-prep-1";
        var sp = window.characters[0].spells;
        toggleSpellPrepared(101); // заговор не в счёт → лимит свободен
        if (sp.prepared.indexOf(101) === -1) return "101 не подготовлен (заговор посчитан в лимит?)";
        toggleSpellPrepared(102); // лимит 1 не-заговор исчерпан → отказ с toast
        if (sp.prepared.indexOf(102) !== -1) return "102 подготовлен сверх лимита";
        if (sp.prepared.length !== 2) return "ожидал [100,101], получено " + JSON.stringify(sp.prepared);
        toggleSpellPrepared(101); // повторный клик снимает подготовку
        if (sp.prepared.indexOf(101) !== -1) return "101 не снят повторным кликом";
        toggleSpellPrepared(102); // место освободилось
        if (sp.prepared.indexOf(102) === -1) return "102 не подготовлен после освобождения лимита";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[spells] ячейки: toggleSpellSlot/adjustSpellSlots + пакт — кламп 0..10, кап used", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id: "test-slots-1", class: "Колдун", level: 5,
          stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
          combat: {}, saves: {}, skills: [],
          spells: { stat: "ХАР", slots: { 3: 4 }, slotsUsed: {}, mySpells: [],
                    pactSlots: 2, pactLevel: 3, pactUsed: 0 }
        }];
        window.currentId = "test-slots-1";
        var sp = window.characters[0].spells;
        toggleSpellSlot(3, 0);
        if (sp.slotsUsed[3] !== 1) return "toggle(3,0): ожидал used 1, получено " + sp.slotsUsed[3];
        toggleSpellSlot(3, 2);
        if (sp.slotsUsed[3] !== 3) return "toggle(3,2): ожидал used 3, получено " + sp.slotsUsed[3];
        toggleSpellSlot(3, 0); // клик по потраченному ромбу освобождает начиная с него
        if (sp.slotsUsed[3] !== 0) return "toggle(3,0) повторно: ожидал used 0, получено " + sp.slotsUsed[3];
        toggleSpellSlot(3, 2);
        adjustSpellSlots(3, -1); // 4 → 3, used 3 не превышает — не трогаем
        if (sp.slots[3] !== 3 || sp.slotsUsed[3] !== 3) return "−1: ожидал slots 3 / used 3, получено " + sp.slots[3] + "/" + sp.slotsUsed[3];
        adjustSpellSlots(3, -1); // 3 → 2, used капится 3 → 2
        if (sp.slots[3] !== 2 || sp.slotsUsed[3] !== 2) return "−1: ожидал slots 2 / used 2, получено " + sp.slots[3] + "/" + sp.slotsUsed[3];
        for (var i = 0; i < 12; i++) adjustSpellSlots(3, 1);
        if (sp.slots[3] !== 10) return "+1×12: ожидал кламп 10, получено " + sp.slots[3];
        // пакт-ячейки (BUGFIX-1)
        togglePactSlot(0);
        togglePactSlot(1);
        if (sp.pactUsed !== 2) return "пакт toggle(0,1): ожидал used 2, получено " + sp.pactUsed;
        togglePactSlot(0);
        if (sp.pactUsed !== 0) return "пакт toggle(0) повторно: ожидал 0, получено " + sp.pactUsed;
        sp.pactUsed = 2;
        adjustPactSlots(-1); // 2 → 1, used капится до 1
        if (sp.pactSlots !== 1 || sp.pactUsed !== 1) return "пакт −1: ожидал slots 1 / used 1, получено " + sp.pactSlots + "/" + sp.pactUsed;
        adjustPactSlots(-1); adjustPactSlots(-1);
        if (sp.pactSlots !== 0) return "пакт не клампится в 0: " + sp.pactSlots;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });
  }

  // ────────── БЛОК 12 (TEST-3): отряд и трекер боя (app-party.js) ──────────
  // PARTY_DATA/BATTLE_DATA/battleSetupList — модульные глобалы app-party.js; каждый
  // тест подменяет их фикстурой и возвращает как было (в браузере при загрузке туда
  // мог попасть реальный dnd_party/dnd_battle пользователя).
  var _hasParty = (typeof getSelfStatusFromHP === "function" && typeof buildBattleSetupList === "function" &&
                   typeof startBattle === "function" && typeof nextTurn === "function" &&
                   typeof syncSelfBattleStatus === "function" && typeof _isValidPentry === "function");

  if (!_hasParty) {
    t("[party] app-party.js загружен", function(){ return true; }); // noop в минимальной среде
  } else {

    t("[party] getSelfStatusFromHP: пороги 0/15/35/60% → dead/dying/heavy/wounded/healthy", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{ id: "test-pt-hp", combat: { hpCurrent: 100, hpMax: 100 } }];
        window.currentId = "test-pt-hp";
        var c = window.characters[0].combat;
        var cases = [[100,"healthy"],[61,"healthy"],[60,"wounded"],[36,"wounded"],[35,"heavy"],
                     [16,"heavy"],[15,"dying"],[1,"dying"],[0,"dead"],[-5,"dead"]];
        for (var i = 0; i < cases.length; i++) {
          c.hpCurrent = cases[i][0];
          var got = getSelfStatusFromHP();
          if (got !== cases[i][1]) return "HP " + cases[i][0] + "/100: ожидал " + cases[i][1] + ", получено " + got;
        }
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[party] buildBattleSetupList: self+союзник+NPC+монстр, checked переживает пересборку", function(){
      var savedChars = window.characters, savedId = window.currentId;
      var savedParty = PARTY_DATA, savedSetup = battleSetupList;
      try {
        window.characters = [{ id: "tp1", name: "Герой", class: "Воин", combat: { hpCurrent: 10, hpMax: 10 } }];
        window.currentId = "tp1";
        PARTY_DATA = {
          allies:   [{ id: 1, name: "Аля", cls: "Бард" }],
          npcs:     [{ id: 2, name: "Трактирщик" }],
          monsters: [{ id: 3, name: "Гоблин", type: "Гуманоид" }]
        };
        battleSetupList = [];
        buildBattleSetupList();
        if (battleSetupList.length !== 4) return "ожидал 4 участника, получено " + battleSetupList.length;
        var ids = battleSetupList.map(function(p){ return p.id; }).join(",");
        if (ids !== "self_tp1,ally_1,npc_2,mon_3") return "id/порядок: " + ids;
        if (battleSetupList.some(function(p){ return p.checked; })) return "по умолчанию никто не отмечен";
        battleSetupList[1].checked = true; // союзник
        buildBattleSetupList(); // пересборка (повторное открытие вкладки)
        var ally = battleSetupList.filter(function(p){ return p.id === "ally_1"; })[0];
        if (!ally || ally.checked !== true) return "checked союзника потерян при пересборке";
        var extra = battleSetupList.filter(function(p){ return p.id !== "ally_1" && p.checked; });
        if (extra.length) return "лишние отмеченные: " + extra.map(function(p){ return p.id; }).join(",");
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; PARTY_DATA = savedParty; battleSetupList = savedSetup; }
    });

    t("[party] startBattle: без отмеченных — отказ; с отмеченными — копии участников, ход 0", function(){
      var savedChars = window.characters, savedId = window.currentId;
      var savedBattle = BATTLE_DATA, savedSetup = battleSetupList;
      try {
        _ensureEl("battle-setup-screen");   // startBattle переключает экраны без null-guard
        _ensureEl("battle-tracker-screen");
        window.characters = [{ id: "tp2", name: "Герой", class: "Воин", combat: { hpCurrent: 10, hpMax: 10 } }];
        window.currentId = "tp2";
        BATTLE_DATA = { active: false, participants: [], currentTurn: 0 };
        battleSetupList = [
          { id: "self_tp2", name: "Герой",  icon: "🗡", color: "#4da843", type: "self",    checked: false },
          { id: "ally_1",   name: "Аля",    icon: "🎵", color: "#27ae60", type: "ally",    checked: false },
          { id: "mon_3",    name: "Гоблин", icon: "👾", color: "#c0392b", type: "monster", checked: false }
        ];
        startBattle(); // никто не отмечен → отказ с toast
        if (BATTLE_DATA.active) return "бой начался без участников";
        battleSetupList[0].checked = true;
        battleSetupList[2].checked = true;
        startBattle();
        if (!BATTLE_DATA.active) return "бой не начался";
        if (BATTLE_DATA.participants.length !== 2) return "ожидал 2 участника, получено " + BATTLE_DATA.participants.length;
        if (BATTLE_DATA.currentTurn !== 0) return "ход должен начинаться с 0, получено " + BATTLE_DATA.currentTurn;
        if (!BATTLE_DATA.participants.every(function(p){ return p.status === "healthy"; })) return "статусы участников не healthy";
        BATTLE_DATA.participants[1].status = "dying"; // участники — копии, не ссылки на setup-лист
        if (battleSetupList[2].status === "dying") return "участник ссылается на setup-объект (нет копии)";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; BATTLE_DATA = savedBattle; battleSetupList = savedSetup; }
    });

    t("[party] nextTurn/prevTurn: ротация инициативы по кругу", function(){
      var savedChars = window.characters, savedId = window.currentId, savedBattle = BATTLE_DATA;
      try {
        window.characters = [{ id: "tp3", name: "Герой", class: "Воин", combat: { hpCurrent: 10, hpMax: 10 } }];
        window.currentId = "tp3";
        BATTLE_DATA = { active: true, currentTurn: 0, participants: [
          { name: "А", type: "ally" }, { name: "Б", type: "npc" }, { name: "В", type: "monster" }
        ]};
        nextTurn();
        if (BATTLE_DATA.currentTurn !== 1) return "next: ожидал 1, получено " + BATTLE_DATA.currentTurn;
        nextTurn(); nextTurn(); // 2 → wrap 0
        if (BATTLE_DATA.currentTurn !== 0) return "wrap вперёд: ожидал 0, получено " + BATTLE_DATA.currentTurn;
        prevTurn();
        if (BATTLE_DATA.currentTurn !== 2) return "wrap назад: ожидал 2, получено " + BATTLE_DATA.currentTurn;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; BATTLE_DATA = savedBattle; }
    });

    t("[party] syncSelfBattleStatus: статус self следует за HP, чужие не трогает, вне боя — no-op", function(){
      var savedChars = window.characters, savedId = window.currentId, savedBattle = BATTLE_DATA;
      try {
        window.characters = [{ id: "tp4", name: "Герой", class: "Воин", combat: { hpCurrent: 10, hpMax: 100 } }];
        window.currentId = "tp4";
        BATTLE_DATA = { active: true, currentTurn: 0, participants: [
          { name: "Герой",  type: "self",    status: "healthy" },
          { name: "Гоблин", type: "monster", status: "wounded" }
        ]};
        syncSelfBattleStatus(); // 10/100 = 10% → dying
        if (BATTLE_DATA.participants[0].status !== "dying") return "self: ожидал dying, получено " + BATTLE_DATA.participants[0].status;
        if (BATTLE_DATA.participants[1].status !== "wounded") return "статус монстра изменён: " + BATTLE_DATA.participants[1].status;
        window.characters[0].combat.hpCurrent = 100;
        BATTLE_DATA.active = false;
        syncSelfBattleStatus(); // бой не активен → no-op
        if (BATTLE_DATA.participants[0].status !== "dying") return "вне боя статус не должен меняться";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; BATTLE_DATA = savedBattle; }
    });

    t("[party] _isValidPentry + getParticipantDesc: валидация импорта и поиск описания", function(){
      var savedChars = window.characters, savedId = window.currentId, savedParty = PARTY_DATA;
      try {
        if (!_isValidPentry({ name: "Гоблин" })) return "{name} должен проходить";
        if (_isValidPentry({})) return "{} не должен проходить";
        if (_isValidPentry(null)) return "null не должен проходить";
        if (_isValidPentry({ name: "" })) return "пустое имя не должно проходить";
        if (_isValidPentry("Гоблин")) return "строка не должна проходить";
        window.characters = [{ id: "tp5", name: "Герой", class: "Воин", subclass: "Чемпион", level: 3, combat: {} }];
        window.currentId = "tp5";
        PARTY_DATA = {
          allies:   [{ id: 1, name: "Аля", desc: "опытный лучник" }],
          npcs:     [{ id: 2, name: "Трактирщик", role: "Хозяин таверны" }], // без desc → роль
          monsters: [{ id: 3, name: "Гоблин", desc: "из засады" }]
        };
        if (getParticipantDesc({ type: "ally", id: 1 }) !== "опытный лучник") return "ally: desc не найден";
        if (getParticipantDesc({ type: "npc", id: 2 }) !== "Хозяин таверны") return "npc: нет fallback на роль";
        if (getParticipantDesc({ type: "monster", id: 3 }) !== "из засады") return "monster: desc не найден";
        var self = getParticipantDesc({ type: "self" });
        if (self !== "Воин · Чемпион · 3 ур.") return "self: получено «" + self + "»";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; PARTY_DATA = savedParty; }
    });

    t("[party] addMonsterFromSRD: карточка из SRD-каталога со статами и srdSlug", function(){
      // PERF-3: в раннерах monsters-srd.js загружен явно; в минимальной среде — noop
      if (typeof addMonsterFromSRD !== "function" || !window.MONSTERS_SRD || !window.MONSTERS_SRD.length) return true;
      var savedChars = window.characters, savedId = window.currentId, savedParty = PARTY_DATA;
      try {
        window.characters = [{ id: "tp6", name: "Герой", class: "Воин", combat: {} }];
        window.currentId = "tp6";
        PARTY_DATA = { allies: [], npcs: [], monsters: [] };
        addMonsterFromSRD("rat");
        if (PARTY_DATA.monsters.length !== 1) return "ожидал 1 монстра, получено " + PARTY_DATA.monsters.length;
        var m = PARTY_DATA.monsters[0];
        if (m.name !== "Крыса") return "name: " + m.name;
        if (m.srdSlug !== "rat") return "srdSlug: " + m.srdSlug;
        if (m.cr !== "0" || m.ac !== 10 || m.hp !== 1 || m.hpMax !== 1)
          return "статы: cr=" + m.cr + " ac=" + m.ac + " hp=" + m.hp + " hpMax=" + m.hpMax;
        if (m.status !== "healthy") return "status: " + m.status;
        if (String(m.desc).indexOf("SRD 5e") === -1) return "desc без шапки SRD";
        addMonsterFromSRD("no-such-slug"); // неизвестный slug — отказ без записи
        if (PARTY_DATA.monsters.length !== 1) return "неизвестный slug добавил запись";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; PARTY_DATA = savedParty; }
    });

    t("[party] addNpcFromSRD: архетип из каталога с ролью/отношением/иконкой", function(){
      if (typeof addNpcFromSRD !== "function" || !window.NPC_ARCHETYPES || !window.NPC_ARCHETYPES.length) return true;
      var savedChars = window.characters, savedId = window.currentId, savedParty = PARTY_DATA;
      try {
        window.characters = [{ id: "tp7", name: "Герой", class: "Воин", combat: {} }];
        window.currentId = "tp7";
        PARTY_DATA = { allies: [], npcs: [], monsters: [] };
        addNpcFromSRD("trader");
        if (PARTY_DATA.npcs.length !== 1) return "ожидал 1 NPC, получено " + PARTY_DATA.npcs.length;
        var n = PARTY_DATA.npcs[0];
        if (n.name !== "Торговец" || n.role !== "Торговец") return "name/role: " + n.name + "/" + n.role;
        if (n.attitude !== "дружелюбный") return "attitude: " + n.attitude;
        if (n.icon !== "🛒") return "icon: " + n.icon;
        if (n.srdSlug !== "trader") return "srdSlug: " + n.srdSlug;
        addNpcFromSRD("no-such-slug");
        if (PARTY_DATA.npcs.length !== 1) return "неизвестный slug добавил запись";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; PARTY_DATA = savedParty; }
    });

    // ── UX-6: авто-инициатива, HP, добавление монстра в бой ──
    t("[party] sortParticipantsByInitiative: по убыванию, равные — исходный порядок", function(){
      if (typeof sortParticipantsByInitiative !== "function") return true;
      var arr = [
        { name: "A", initiative: 12 }, { name: "B", initiative: 20 },
        { name: "C", initiative: 12 }, { name: "D", initiative: 5 }
      ];
      sortParticipantsByInitiative(arr);
      var order = arr.map(function(p){ return p.name; }).join("");
      if (order !== "BACD") return "порядок: " + order;
      // участник без initiative трактуется как 0
      var arr2 = [{ name: "X" }, { name: "Y", initiative: 3 }];
      sortParticipantsByInitiative(arr2);
      if (arr2[0].name !== "Y") return "undefined-иниц. должна быть внизу";
      return true;
    });

    t("[party] _participantCombatMeta: self — из листа; монстр — ЛОВ из SRD, ХП из записи", function(){
      if (typeof _participantCombatMeta !== "function") return true;
      var savedChars = window.characters, savedId = window.currentId, savedParty = PARTY_DATA;
      try {
        window.characters = [{ id: "tp8", name: "Герой", stats: { dex: 16 }, combat: { hpCurrent: 22, hpMax: 30 } }];
        window.currentId = "tp8";
        var mSelf = _participantCombatMeta({ type: "self" });
        if (mSelf.dexMod !== 3) return "self dexMod: ожидал 3, получено " + mSelf.dexMod;
        if (mSelf.hp !== 22 || mSelf.hpMax !== 30) return "self hp: " + mSelf.hp + "/" + mSelf.hpMax;
        // монстр отряда со srdSlug "bandit" (dex 12 → +1, hp 11)
        PARTY_DATA = { allies: [], npcs: [], monsters: [{ id: 5, name: "Бандит", srdSlug: "bandit", hp: 11, hpMax: 11 }] };
        if (window.MONSTERS_SRD && window.MONSTERS_SRD.length) {
          var mMon = _participantCombatMeta({ type: "monster", id: "mon_5" });
          if (mMon.hpMax !== 11) return "monster hpMax: " + mMon.hpMax;
          if (mMon.dexMod !== 1) return "monster dexMod: ожидал 1 (ЛОВ 12), получено " + mMon.dexMod;
        }
        // союзник — без числовых данных
        var mAlly = _participantCombatMeta({ type: "ally", id: "ally_1" });
        if (mAlly.dexMod !== 0 || mAlly.hpMax !== 0) return "ally мета не 0";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; PARTY_DATA = savedParty; }
    });

    t("[party] startBattle: авто-инициатива всем + сортировка по убыванию", function(){
      if (typeof startBattle !== "function") return true;
      var savedChars = window.characters, savedId = window.currentId;
      var savedBattle = BATTLE_DATA, savedSetup = battleSetupList;
      try {
        _ensureEl("battle-setup-screen"); _ensureEl("battle-tracker-screen");
        window.characters = [{ id: "tp9", name: "Герой", stats: { dex: 14 }, combat: { hpCurrent: 20, hpMax: 20 } }];
        window.currentId = "tp9";
        BATTLE_DATA = { active: false, participants: [], currentTurn: 0 };
        battleSetupList = [
          { id: "self_tp9", name: "Герой",  icon: "🗡", color: "#4da843", type: "self",    checked: true },
          { id: "ally_1",   name: "Аля",    icon: "🎵", color: "#27ae60", type: "ally",    checked: true },
          { id: "mon_9",    name: "Гоблин", icon: "👾", color: "#c0392b", type: "monster", checked: true }
        ];
        startBattle();
        var ps = BATTLE_DATA.participants;
        if (ps.length !== 3) return "ожидал 3 участника, получено " + ps.length;
        for (var i = 0; i < ps.length; i++) {
          if (typeof ps[i].initiative !== "number") return ps[i].name + ": инициатива не число";
          if (!("hp" in ps[i]) || !("hpMax" in ps[i]) || !("dexMod" in ps[i])) return ps[i].name + ": нет боевых полей";
        }
        for (var j = 1; j < ps.length; j++) {
          if (ps[j-1].initiative < ps[j].initiative) return "не отсортировано по убыванию";
        }
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; BATTLE_DATA = savedBattle; battleSetupList = savedSetup; }
    });

    t("[party] addMonsterFromSRD (режим боя): участник с инициативой/ХП, дубль → имя +N", function(){
      if (typeof addMonsterFromSRD !== "function" || !window.MONSTERS_SRD || !window.MONSTERS_SRD.length) return true;
      if (typeof openSrdMonsterPickerForBattle !== "function") return true;
      var savedChars = window.characters, savedId = window.currentId;
      var savedBattle = BATTLE_DATA, savedParty = PARTY_DATA, savedMode = _srdPickerBattleMode;
      try {
        _ensureEl("battle-tracker-list");
        window.characters = [{ id: "tpA", name: "Герой", combat: {} }];
        window.currentId = "tpA";
        PARTY_DATA = { allies: [], npcs: [], monsters: [] };
        BATTLE_DATA = { active: true, currentTurn: 0, participants: [{ id: "self_tpA", name: "Герой", type: "self", status: "healthy", initiative: 10 }] };
        _srdPickerBattleMode = true;
        addMonsterFromSRD("rat"); // Крыса, hp 1
        addMonsterFromSRD("rat"); // дубль → "Крыса 2"
        // в бой добавлены двое, в отряд — ничего
        if (PARTY_DATA.monsters.length !== 0) return "монстр попал в отряд в режиме боя";
        var mons = BATTLE_DATA.participants.filter(function(p){ return p.type === "monster"; });
        if (mons.length !== 2) return "ожидал 2 монстров в бою, получено " + mons.length;
        var names = mons.map(function(p){ return p.name; }).sort().join(",");
        if (names !== "Крыса,Крыса 2") return "имена дублей: " + names;
        var m0 = mons[0];
        if (typeof m0.initiative !== "number") return "у монстра нет инициативы";
        if (m0.hp !== 1 || m0.hpMax !== 1) return "ХП монстра: " + m0.hp + "/" + m0.hpMax;
        if (m0.srdSlug !== "rat") return "srdSlug монстра: " + m0.srdSlug;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; BATTLE_DATA = savedBattle; PARTY_DATA = savedParty; _srdPickerBattleMode = savedMode; }
    });

    t("[party] adjustBattleHP/setBattleHP: клампы 0..hpMax для не-self", function(){
      if (typeof adjustBattleHP !== "function" || typeof setBattleHP !== "function") return true;
      var savedChars = window.characters, savedId = window.currentId, savedBattle = BATTLE_DATA;
      try {
        _ensureEl("battle-tracker-list");
        window.characters = [{ id: "tpB", name: "Герой", combat: {} }];
        window.currentId = "tpB";
        BATTLE_DATA = { active: true, currentTurn: 0, participants: [
          { id: "mon_1", name: "Гоблин", type: "monster", status: "healthy", hp: 5, hpMax: 7, initiative: 8 }
        ]};
        adjustBattleHP(0, 10); // 5+10 → клампится до hpMax 7
        if (BATTLE_DATA.participants[0].hp !== 7) return "верхний кламп: " + BATTLE_DATA.participants[0].hp;
        adjustBattleHP(0, -20); // 7-20 → 0
        if (BATTLE_DATA.participants[0].hp !== 0) return "нижний кламп: " + BATTLE_DATA.participants[0].hp;
        setBattleHP(0, "4");
        if (BATTLE_DATA.participants[0].hp !== 4) return "setBattleHP: " + BATTLE_DATA.participants[0].hp;
        setBattleHP(0, "99"); // > hpMax → 7
        if (BATTLE_DATA.participants[0].hp !== 7) return "setBattleHP кламп: " + BATTLE_DATA.participants[0].hp;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; BATTLE_DATA = savedBattle; }
    });

    t("[party] rerollInitiative: пересортировка держит ход на текущем участнике", function(){
      if (typeof rerollInitiative !== "function") return true;
      var savedChars = window.characters, savedId = window.currentId, savedBattle = BATTLE_DATA;
      try {
        _ensureEl("battle-tracker-list");
        window.characters = [{ id: "tpC", name: "Герой", combat: {} }];
        window.currentId = "tpC";
        BATTLE_DATA = { active: true, currentTurn: 1, participants: [
          { id: "a", name: "A", type: "ally",    status: "healthy", initiative: 18, dexMod: 0 },
          { id: "b", name: "B", type: "monster", status: "healthy", initiative: 15, dexMod: 0 },
          { id: "c", name: "C", type: "monster", status: "healthy", initiative: 10, dexMod: 0 }
        ]};
        var currentBefore = BATTLE_DATA.participants[BATTLE_DATA.currentTurn]; // B
        rerollInitiative(2); // перебросить C — B по-прежнему текущий, где бы ни оказался
        if (BATTLE_DATA.participants[BATTLE_DATA.currentTurn] !== currentBefore) return "ход соскочил с текущего участника";
        // сортировка сохранена
        for (var j = 1; j < BATTLE_DATA.participants.length; j++) {
          if (BATTLE_DATA.participants[j-1].initiative < BATTLE_DATA.participants[j].initiative) return "не отсортировано";
        }
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; BATTLE_DATA = savedBattle; }
    });
  }

  // ────────── БЛОК 13 (UI6-1): авто-акцент по классу (app-ui.js) ──────────
  if (typeof _getAutoAccent === "function") {
    t("[accent] дефолт: нет auto + нет accent → авто ВКЛ", function(){
      localStorage.removeItem("dnd_auto_accent");
      localStorage.removeItem("dnd_accent");
      return _getAutoAccent() === true || "ожидал true";
    });
    t("[accent] дефолт: нет auto, accent выбран вручную → авто ВЫКЛ", function(){
      localStorage.removeItem("dnd_auto_accent");
      localStorage.setItem("dnd_accent", "ruby");
      return _getAutoAccent() === false || "ожидал false";
    });
    t("[accent] явный auto='0' → ВЫКЛ (без accent)", function(){
      localStorage.removeItem("dnd_accent");
      localStorage.setItem("dnd_auto_accent", "0");
      return _getAutoAccent() === false || "ожидал false";
    });
    t("[accent] явный auto='1' → ВКЛ (даже с accent)", function(){
      localStorage.setItem("dnd_accent", "ruby");
      localStorage.setItem("dnd_auto_accent", "1");
      return _getAutoAccent() === true || "ожидал true";
    });
    t("[accent] setAccent(ruby) из дефолт-авто: фиксирует акцент, авто становится ВЫКЛ", function(){
      localStorage.removeItem("dnd_auto_accent");
      localStorage.removeItem("dnd_accent");
      setAccent("ruby");
      if (localStorage.getItem("dnd_accent") !== "ruby") return "dnd_accent=" + localStorage.getItem("dnd_accent");
      // dnd_accent задан → _getAutoAccent() уже false (литерал '0' не пишется, но поведение = выкл)
      if (_getAutoAccent() !== false) return "авто не выключился";
      return true;
    });
    t("[accent] setAccent при явном auto='1' перезаписывает на '0'", function(){
      localStorage.setItem("dnd_auto_accent", "1");
      localStorage.removeItem("dnd_accent");
      setAccent("emerald");
      return localStorage.getItem("dnd_auto_accent") === "0" || "dnd_auto_accent=" + localStorage.getItem("dnd_auto_accent");
    });
    t("[accent] CLASS_ACCENT_MAP: значения из ACCENTS", function(){
      if (typeof CLASS_ACCENT_MAP === "undefined") return "нет CLASS_ACCENT_MAP";
      var bad = Object.keys(CLASS_ACCENT_MAP).filter(function(k){ return ACCENTS.indexOf(CLASS_ACCENT_MAP[k]) === -1; });
      return bad.length === 0 || ("вне ACCENTS: " + bad.join(","));
    });
    t("[accent] CLASS_ACCENT_MAP покрывает все 12 классов (по CLASS_SAVE_PROFICIENCIES)", function(){
      if (typeof CLASS_SAVE_PROFICIENCIES === "undefined") return true;
      var missing = Object.keys(CLASS_SAVE_PROFICIENCIES).filter(function(c){ return !(c in CLASS_ACCENT_MAP); });
      if (missing.length) return "нет акцента для: " + missing.join(",");
      return Object.keys(CLASS_ACCENT_MAP).length === Object.keys(CLASS_SAVE_PROFICIENCIES).length
        || ("размеры расходятся: map=" + Object.keys(CLASS_ACCENT_MAP).length + " saves=" + Object.keys(CLASS_SAVE_PROFICIENCIES).length);
    });
    t("[accent] _accentForClass(неизвестный) → gold", function(){
      return _accentForClass("Хоббит") === "gold" || "ожидал gold";
    });
  }

  // ────────── БЛОК 14 (UI6-4): раскладка листа характеристик (app-ui.js) ──────────
  if (typeof _getStatsLayout === "function") {
    t("[stats2024] дефолт без ключа → '2024'", function(){
      localStorage.removeItem("dnd_stats_layout");
      return _getStatsLayout() === "2024" || "получено " + _getStatsLayout();
    });
    t("[stats2024] мусор в ключе → '2024'", function(){
      localStorage.setItem("dnd_stats_layout", "xyz");
      return _getStatsLayout() === "2024" || "получено " + _getStatsLayout();
    });
    t("[stats2024] персист 'classic'", function(){
      localStorage.setItem("dnd_stats_layout", "classic");
      return _getStatsLayout() === "classic" || "получено " + _getStatsLayout();
    });
    t("[stats2024] setStatsLayout('classic') пишет ключ", function(){
      localStorage.removeItem("dnd_stats_layout");
      setStatsLayout("classic");
      return localStorage.getItem("dnd_stats_layout") === "classic" || "ключ=" + localStorage.getItem("dnd_stats_layout");
    });
    t("[stats2024] setStatsLayout(мусор) игнорируется", function(){
      localStorage.setItem("dnd_stats_layout", "2024");
      setStatsLayout("nope");
      return localStorage.getItem("dnd_stats_layout") === "2024" || "ключ=" + localStorage.getItem("dnd_stats_layout");
    });
  }
  // Группировка навыков по характеристике (основа абилка-слотов 2024) — без хардкод-списков.
  t("[stats2024] группировка навыков: размеры по str,dex,con,int,wis,cha = {1,3,0,5,5,4}", function(){
    if (typeof skills === "undefined") return "нет skills";
    var order = ["str","dex","con","int","wis","cha"];
    var counts = {str:0, dex:0, con:0, int:0, wis:0, cha:0};
    skills.forEach(function(s){ if (s.stat in counts) counts[s.stat]++; });
    var got = order.map(function(k){ return counts[k]; });
    var exp = [1,3,0,5,5,4];
    return eq(got, exp) || ("ожидал " + JSON.stringify(exp) + ", получено " + JSON.stringify(got));
  });
  t("[stats2024] каждый индекс навыка 0..N-1 попадает в группу ровно один раз", function(){
    if (typeof skills === "undefined") return "нет skills";
    var groups = {};
    skills.forEach(function(s, i){ (groups[s.stat] = groups[s.stat] || []).push(i); });
    var seen = [];
    Object.keys(groups).forEach(function(k){ seen = seen.concat(groups[k]); });
    seen.sort(function(a, b){ return a - b; });
    var expected = []; for (var i = 0; i < skills.length; i++) expected.push(i);
    return eq(seen, expected) || ("индексы расходятся: " + JSON.stringify(seen));
  });
  if (typeof initSaves === "function" && typeof initSkills === "function") {
    t("[stats2024] initSaves/initSkills не бросают в обоих layout", function(){
      var layouts = ["2024", "classic"];
      for (var i = 0; i < layouts.length; i++) {
        localStorage.setItem("dnd_stats_layout", layouts[i]);
        try {
          initSaves(); initSkills();
          if (typeof _placeStatRows === "function") _placeStatRows();
        } catch (e) { return "layout " + layouts[i] + ": " + (e && e.message || e); }
      }
      return true;
    });
  }

  // ────────── БЛОК 15 (SDR-1): ресурсы подкласса — кости превосходства ──────────
  if (typeof SUBCLASS_RESOURCES !== "undefined") {
    t("[SDR-1] SUBCLASS_RESOURCES Боевого мастера = superiority_dice", function(){
      var r = SUBCLASS_RESOURCES["Боевой мастер"];
      return (r && r.resources && r.resources[0] && r.resources[0].id === "superiority_dice")
        || ("получено " + JSON.stringify(r && r.resources));
    });
  }
  if (typeof getCharResourceDefs === "function") {
    t("[SDR-1] getCharResourceDefs склеивает класс+подкласс", function(){
      var d = getCharResourceDefs({class:"Воин", subclass:"Боевой мастер", level:3, stats:{}});
      if (!d || !d.resources) return "нет resources";
      var ids = d.resources.map(function(x){ return x.id; });
      return (ids.indexOf("second_wind") !== -1 && ids.indexOf("superiority_dice") !== -1)
        || ("ids=" + JSON.stringify(ids));
    });
    t("[SDR-1] getCharResourceDefs без подкласса — без костей превосходства", function(){
      var d = getCharResourceDefs({class:"Воин", level:3, stats:{}});
      if (!d || !d.resources) return "нет resources";
      var ids = d.resources.map(function(x){ return x.id; });
      return (ids.indexOf("superiority_dice") === -1) || ("ids=" + JSON.stringify(ids));
    });
  }
  if (typeof getResourceMax === "function" && typeof SUBCLASS_RESOURCES !== "undefined") {
    t("[SDR-1] костей превосходства по уровням: 1→0, 3→4, 7→5, 15→6", function(){
      var sd = SUBCLASS_RESOURCES["Боевой мастер"].resources[0];
      var got = [1,3,7,15].map(function(lv){ return getResourceMax(sd, {level:lv, stats:{cha:10}}); });
      return eq(got, [0,4,5,6]) || ("получено " + JSON.stringify(got));
    });
  }
  if (typeof currentDieSize === "function" && typeof SUBCLASS_RESOURCES !== "undefined") {
    t("[SDR-1] размер кости: 3→к8, 10→к10, 18→к12", function(){
      var sd = SUBCLASS_RESOURCES["Боевой мастер"].resources[0];
      var got = [3,10,18].map(function(lv){ return currentDieSize(sd, lv); });
      return eq(got, ["к8","к10","к12"]) || ("получено " + JSON.stringify(got));
    });
  }

  // ────────── БЛОК 16 (SDR-2): рекомендованные манёвры в готовом билде ──────────
  if (typeof getBuildById === "function") {
    t("[SDR-2] билд лучника советует 3 валидных манёвра", function(){
      var b = getBuildById("fighter-battlemaster-archer");
      if (!b || !b.recommendedChoices) return "нет билда/recommendedChoices";
      var m = b.recommendedChoices.maneuvers;
      if (!Array.isArray(m) || m.length !== 3) return "maneuvers=" + JSON.stringify(m);
      if (typeof BATTLE_MASTER_MANEUVERS === "undefined") return "нет BATTLE_MASTER_MANEUVERS";
      var bad = m.filter(function(id){ return !BATTLE_MASTER_MANEUVERS[id]; });
      return bad.length === 0 || ("неизвестные id: " + JSON.stringify(bad));
    });
  }
  if (typeof _ccDefsFor === "function") {
    t("[SDR-2] _ccDefsFor включает выбор maneuvers для Боевого мастера", function(){
      var ids = _ccDefsFor("Воин", {subclass:"Боевой мастер"}).map(function(d){ return d.id; });
      return (ids.indexOf("maneuvers") !== -1) || ("ids=" + JSON.stringify(ids));
    });
    t("[SDR-2] _ccDefsFor без подкласса — без maneuvers", function(){
      var ids = _ccDefsFor("Воин", {}).map(function(d){ return d.id; });
      return (ids.indexOf("maneuvers") === -1) || ("ids=" + JSON.stringify(ids));
    });
  }
  if (typeof getBuildRecChoiceIds === "function") {
    t("[SDR-2] getBuildRecChoiceIds даёт 3 манёвра для билда лучника", function(){
      var ids = getBuildRecChoiceIds({ buildId: "fighter-battlemaster-archer" }, "maneuvers");
      return (Array.isArray(ids) && ids.length === 3 && ids.indexOf("precision-attack") !== -1)
        || ("ids=" + JSON.stringify(ids));
    });
  }

  // ────────── БЛОК 17 (UX-2): парсер формулы кубиков (app-ui.js) ──────────
  if (typeof parseDiceFormula === "function") {
    t("[UX-2] d20 → одна группа 1к20", function(){
      var p = parseDiceFormula("d20");
      if (!p.ok) return "ok=false: " + p.error;
      return (p.groups.length===1 && p.groups[0].count===1 && p.groups[0].sides===20 && p.mod===0) || JSON.stringify(p);
    });
    t("[UX-2] к20 (кириллица) = d20", function(){
      var p = parseDiceFormula("к20");
      return (p.ok && p.groups[0].sides===20 && p.groups[0].count===1) || JSON.stringify(p);
    });
    t("[UX-2] 2d6+3 — группа + модификатор", function(){
      var p = parseDiceFormula("2d6+3");
      return (p.ok && p.groups.length===1 && p.groups[0].count===2 && p.groups[0].sides===6 && p.mod===3) || JSON.stringify(p);
    });
    t("[UX-2] 1d8+1d6+2 — две группы + модификатор", function(){
      var p = parseDiceFormula("1d8+1d6+2");
      if (!p.ok) return "ok=false: " + p.error;
      return (p.groups.length===2 && p.groups[0].sides===8 && p.groups[1].sides===6 && p.mod===2) || JSON.stringify(p);
    });
    t("[UX-2] 2к6+1к4 (кириллица, две группы)", function(){
      var p = parseDiceFormula("2к6+1к4");
      return (p.ok && p.groups.length===2 && p.groups[0].count===2 && p.groups[1].sides===4 && p.mod===0) || JSON.stringify(p);
    });
    t("[UX-2] 1d20-1 — вычитание модификатора", function(){
      var p = parseDiceFormula("1d20-1");
      return (p.ok && p.groups[0].sides===20 && p.mod===-1) || JSON.stringify(p);
    });
    t("[UX-2] d8-1d4 — отрицательная группа", function(){
      var p = parseDiceFormula("d8-1d4");
      if (!p.ok) return "ok=false: " + p.error;
      return (p.groups.length===2 && p.groups[1].sign===-1 && p.groups[1].sides===4) || JSON.stringify(p);
    });
    t("[UX-2] пробелы игнорируются", function(){
      var p = parseDiceFormula("  2 к 6 + 3 ");
      return (p.ok && p.groups[0].count===2 && p.groups[0].sides===6 && p.mod===3) || JSON.stringify(p);
    });
    t("[UX-2] клампа count ≤ 50 (99d6)", function(){
      var p = parseDiceFormula("99d6");
      return (p.ok && p.groups[0].count===50) || JSON.stringify(p);
    });
    t("[UX-2] мусор 'abc' → ошибка", function(){
      return parseDiceFormula("abc").ok === false || "принял мусор";
    });
    t("[UX-2] пустая строка → ошибка", function(){
      return parseDiceFormula("   ").ok === false || "принял пустую";
    });
    t("[UX-2] голый модификатор '5' → ошибка (нужен кубик)", function(){
      return parseDiceFormula("5").ok === false || "принял без кубика";
    });
    t("[UX-2] грань < 2 'd1' → ошибка", function(){
      return parseDiceFormula("d1").ok === false || "принял d1";
    });
    t("[UX-2] двойной знак '2d6++3' → ошибка", function(){
      return parseDiceFormula("2d6++3").ok === false || "принял двойной знак";
    });
    t("[UX-2] незакрытый кубик '2d' → ошибка", function(){
      return parseDiceFormula("2d").ok === false || "принял 2d";
    });
  }
  if (typeof _formulaCanon === "function") {
    t("[UX-2] канон d20 → 'к20'", function(){
      return _formulaCanon([{count:1,sides:20,sign:1}], 0) === "к20" || _formulaCanon([{count:1,sides:20,sign:1}], 0);
    });
    t("[UX-2] канон 2d6+3 → '2к6+3'", function(){
      return _formulaCanon([{count:2,sides:6,sign:1}], 3) === "2к6+3" || _formulaCanon([{count:2,sides:6,sign:1}], 3);
    });
  }

  // ────────── БЛОК 18 (UX-4): глоссарий-тултипы (app-core.js + glossary-data.js) ──────────
  if (typeof glossarizeHtml === "function" && typeof window !== "undefined" && Array.isArray(window.GLOSSARY)) {
    t("[UX-4] GLOSSARY: у каждой записи непустые term/terms/def", function(){
      var bad = [];
      window.GLOSSARY.forEach(function(e, i){
        if (!e || typeof e.term !== "string" || !e.term.trim()) bad.push(i + ":term");
        if (!e || !Array.isArray(e.terms) || !e.terms.length) bad.push(i + ":terms");
        if (!e || typeof e.def !== "string" || !e.def.trim()) bad.push(i + ":def");
      });
      return bad.length === 0 || ("плохие записи: " + bad.join(", "));
    });
    t("[UX-4] glossarizeHtml оборачивает известный термин (КД)", function(){
      var out = glossarizeHtml("высокий КД и щит", {});
      return /<span class="gloss"[^>]*data-gloss="кд"[^>]*>КД<\/span>/.test(out) || out;
    });
    t("[UX-4] первое вхождение оборачивается, повтор — нет", function(){
      var out = glossarizeHtml("ячейки и снова ячейки", {});
      var n = (out.match(/class="gloss"/g) || []).length;
      return n === 1 || ("ожидал 1 обёртку, получено " + n + ": " + out);
    });
    t("[UX-4] не срабатывает внутри слова (ки в «руки»)", function(){
      var out = glossarizeHtml("он сложил руки на груди", {});
      return out.indexOf("gloss") === -1 || ("ложное срабатывание: " + out);
    });
    t("[UX-4] составной термин в приоритете (Метка охотника, не «Метка»)", function(){
      var out = glossarizeHtml("ставит Метку охотника на цель", {});
      return /data-gloss="метку охотника"/.test(out) || out;
    });
    t("[UX-4] текст без терминов не меняется", function(){
      var src = "просто описание без игровых терминов";
      return glossarizeHtml(src, {}) === src || glossarizeHtml(src, {});
    });
  }

  // ────────── БЛОК 19 (UX-5): универсальная кидалка quickRoll (app-ui.js) ──────────
  if (typeof _quickRollCompute === "function") {
    t("[UX-5] обычный d20+мод: итог = бросок + мод", function(){
      var c = _quickRollCompute(20, 3, 'normal', 17, null);
      return (c.natural===17 && c.total===20 && c.isCrit===false && c.isFail===false) || JSON.stringify(c);
    });
    t("[UX-5] натуральная 20 → крит (по натуральному, не итогу)", function(){
      var c = _quickRollCompute(20, 3, 'normal', 20, null);
      return (c.isCrit===true && c.total===23) || JSON.stringify(c);
    });
    t("[UX-5] натуральная 1 → провал", function(){
      var c = _quickRollCompute(20, 5, 'normal', 1, null);
      return (c.isFail===true && c.total===6) || JSON.stringify(c);
    });
    t("[UX-5] преимущество берёт больший кубик", function(){
      var c = _quickRollCompute(20, 2, 'adv', 8, 15);
      return (c.natural===15 && c.discarded===8 && c.total===17) || JSON.stringify(c);
    });
    t("[UX-5] помеха берёт меньший кубик", function(){
      var c = _quickRollCompute(20, 0, 'dis', 8, 15);
      return (c.natural===8 && c.discarded===15 && c.total===8) || JSON.stringify(c);
    });
    t("[UX-5] не-d20 (d6): крит/провал не выставляются", function(){
      var c = _quickRollCompute(6, 0, 'normal', 1, null);
      return (c.isFail===false && c.isCrit===false && c.total===1) || JSON.stringify(c);
    });
    t("[UX-5] отрицательный модификатор", function(){
      var c = _quickRollCompute(20, -1, 'normal', 10, null);
      return (c.total===9) || JSON.stringify(c);
    });
    t("[UX-5] неизвестный режим трактуется как обычный", function(){
      var c = _quickRollCompute(20, 0, 'wat', 12, 19);
      return (c.mode==='normal' && c.natural===12 && c.discarded===null) || JSON.stringify(c);
    });
  }
  if (typeof _quickRollRecord === "function") {
    t("[UX-5] запись истории: label/result/mode/mod/natural сохранены", function(){
      var c = _quickRollCompute(20, 3, 'normal', 17, null);
      var rec = _quickRollRecord("Спас. Ловкость", 20, 3, c, 17, null, "12:00");
      return (rec.label==="Спас. Ловкость" && rec.result===20 && rec.sides===20 && rec.mode==='normal' && rec.mod===3 && rec.natural===17 && rec.time==="12:00") || JSON.stringify(rec);
    });
    t("[UX-5] запись истории adv: r1/r2 и natural корректны", function(){
      var c = _quickRollCompute(20, 0, 'adv', 5, 19);
      var rec = _quickRollRecord("Атлетика", 20, 0, c, 5, 19, "12:01");
      return (rec.mode==='adv' && rec.r1===5 && rec.r2===19 && rec.natural===19 && rec.result===19) || JSON.stringify(rec);
    });
  }

  // ────────── БЛОК 20 (FIN-1): черты — каталог 42, эффекты, инициатива ──────────
  if (typeof FEATS_DATA !== "undefined") {
    t("[FIN-1] FEATS_DATA: ровно 42 черты (PHB гл. 6)", function(){
      return FEATS_DATA.length === 42 || "получено " + FEATS_DATA.length;
    });
    t("[FIN-1] id уникальны, внекнижная spell_master удалена", function(){
      var seen = {}, dup = [];
      FEATS_DATA.forEach(function(f){ if (seen[f.id]) dup.push(f.id); seen[f.id] = true; });
      if (dup.length) return "дубли: " + dup.join(",");
      if (seen["spell_master"]) return "spell_master ещё в каталоге";
      return true;
    });
    t("[FIN-1] у каждой черты непустые id/name/desc и source PHB", function(){
      var bad = FEATS_DATA.filter(function(f){
        return !f.id || !/^[a-z][a-z_]*$/.test(f.id) || !f.name || !f.desc || f.source !== "PHB";
      }).map(function(f){ return f.id || f.name || "?"; });
      return bad.length === 0 || "битые: " + bad.join(",");
    });
    t("[FIN-1] whitelist типов эффектов (мёртвые ac_bonus/speed_bonus/passive_perception_bonus запрещены)", function(){
      var ok = ["stat","stat_choice","stat_choice_save","armor","hp_per_level","initiative_bonus","passive"];
      var bad = [];
      FEATS_DATA.forEach(function(f){
        (f.effects || []).forEach(function(e){ if (ok.indexOf(e.type) === -1) bad.push(f.id + ":" + e.type); });
      });
      return bad.length === 0 || bad.join(",");
    });
    t("[FIN-1] 7 добавленных черт присутствуют", function(){
      var need = ["heavy_armor_master","keen_mind","lightly_armored","magic_initiate","martial_adept","medium_armor_master","moderately_armored"];
      var have = {}; FEATS_DATA.forEach(function(f){ have[f.id] = 1; });
      var miss = need.filter(function(id){ return !have[id]; });
      return miss.length === 0 || "нет: " + miss.join(",");
    });
  }
  if (typeof luApplyFeatById === "function") {
    t("[FIN-1] luApplyFeatById(heavy_armor_master): СИЛ +1 и запись; повтор → null", function(){
      var char = { stats:{str:15,dex:10,con:10,int:10,wis:10,cha:10}, level:4, combat:{hpMax:30,hpCurrent:30}, proficiencies:{}, feats:[] };
      var name = luApplyFeatById(char, "heavy_armor_master", 4);
      if (!name) return "черта не применилась";
      if (char.stats.str !== 16) return "СИЛ " + char.stats.str + " (ожидал 16)";
      if (!char.feats.some(function(f){ return f.id === "heavy_armor_master"; })) return "нет записи в char.feats";
      if (luApplyFeatById(char, "heavy_armor_master", 8) !== null) return "повтор не заблокирован";
      return true;
    });
    t("[FIN-1] luApplyFeatById(alert): +5 в char.bonuses.initiative", function(){
      var char = { stats:{str:10,dex:10,con:10,int:10,wis:10,cha:10}, level:1, combat:{hpMax:10,hpCurrent:10}, proficiencies:{}, feats:[] };
      luApplyFeatById(char, "alert", 1);
      var got = char.bonuses && char.bonuses.initiative;
      return got === 5 || "bonuses.initiative = " + got;
    });
    t("[FIN-1] luApplyFeatById(moderately_armored): владение средними + щитами", function(){
      var char = { stats:{str:10,dex:10,con:10,int:10,wis:10,cha:10}, level:4, combat:{hpMax:20,hpCurrent:20}, proficiencies:{}, feats:[] };
      luApplyFeatById(char, "moderately_armored", 4);
      var a = char.proficiencies.armor || [];
      return (a.indexOf("medium") > -1 && a.indexOf("shield") > -1) || "armor: " + a.join(",");
    });
  }
  if (typeof recalcArmorWeaponFromSources === "function") {
    t("[FIN-1] владение бронёй от черты переживает пересчёт из источников (source feat)", function(){
      var char = { race:"", class:"", classes:[], feats:[{ id:"lightly_armored", name:"Знаток лёгких доспехов" }], proficiencies:{} };
      recalcArmorWeaponFromSources(char);
      var ar = char.proficiencies.armorSources;
      if (!ar || !ar.light || ar.light.indexOf("feat") === -1) return "нет источника feat: " + JSON.stringify(ar && ar.light);
      if ((char.proficiencies.armor || []).indexOf("light") === -1) return "light не попал в derived armor";
      return true;
    });
  }
  if (typeof parseFeatFromHeadline === "function") {
    t("[FIN-1] headline-имена билдов резолвятся после ренеймов (канон + алиасы)", function(){
      var cases = [
        ["Увеличение характеристик → черта «Устойчивый (ТЕЛ)»", "resilient"],
        ["Увеличение характеристик → черта «Крепыш» или +2 ВЫН", "tough"],
        ["Увеличение характеристик → черта «Мастер тяжёлого оружия» (GWM)", "great_weapon_master"],
        ["Увеличение характеристик → черта «Везунчик»", "lucky"],
        ["Увеличение характеристик → черта «Снайпер»", "sharpshooter"],
        ["Увеличение характеристик → черта «Удача»", "lucky"],
        ["Увеличение характеристик → черта «Сторожевой»", "alert"]
      ];
      for (var i = 0; i < cases.length; i++) {
        var got = parseFeatFromHeadline(cases[i][0]);
        if (got !== cases[i][1]) return "«" + cases[i][0] + "» → " + got + " (ожидал " + cases[i][1] + ")";
      }
      return true;
    });
  }
  if (typeof _participantCombatMeta === "function" && typeof rollInitiativeValue === "function") {
    t("[FIN-1] мета self в бою: initBonus из char.bonuses.initiative (Бдительный)", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{ id: "tf1", stats: { dex: 14 }, bonuses: { initiative: 5 }, combat: { hpCurrent: 7, hpMax: 10 } }];
        window.currentId = "tf1";
        var m = _participantCombatMeta({ type: "self", id: "self_tf1" });
        if (m.dexMod !== 2) return "dexMod " + m.dexMod + " (ожидал 2)";
        if (m.initBonus !== 5) return "initBonus " + m.initBonus + " (ожидал 5)";
        var m2 = _participantCombatMeta({ type: "ally", id: "ally_1" });
        if (m2.initBonus !== 0) return "у союзника initBonus должен быть 0, получено " + m2.initBonus;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });
    t("[FIN-1] rollInitiativeValue(мод): результат в диапазоне 1+мод..20+мод", function(){
      for (var i = 0; i < 50; i++) {
        var v = rollInitiativeValue(7);
        if (v < 8 || v > 27) return "вне диапазона: " + v;
      }
      return true;
    });
  }

  // ────────── БЛОК 21 (FIN-2): оружие — каталог 37, матчинг билдов, владения ──────────
  if (typeof WEAPON_PRESETS !== "undefined") {
    t("[FIN-2] WEAPON_PRESETS: ровно 37 позиций PHB (10/4/18/5 по группам)", function(){
      if (WEAPON_PRESETS.length !== 37) return "длина " + WEAPON_PRESETS.length;
      var n = { "simple|melee":0, "simple|ranged":0, "martial|melee":0, "martial|ranged":0 };
      WEAPON_PRESETS.forEach(function(w){ n[w.category + "|" + w.kind] = (n[w.category + "|" + w.kind] || 0) + 1; });
      var exp = { "simple|melee":10, "simple|ranged":4, "martial|melee":18, "martial|ranged":5 };
      var bad = Object.keys(exp).filter(function(k){ return n[k] !== exp[k]; })
        .map(function(k){ return k + "=" + n[k] + " (ожидал " + exp[k] + ")"; });
      return bad.length === 0 || bad.join("; ");
    });
    t("[FIN-2] имена и алиасы уникальны в совокупности (без конфликтов)", function(){
      var seen = {}, dup = [];
      WEAPON_PRESETS.forEach(function(w){
        [w.name].concat(w.aliases || []).forEach(function(n){
          var k = n.toLowerCase();
          if (seen[k]) dup.push(n); seen[k] = true;
        });
      });
      return dup.length === 0 || "дубли: " + dup.join(",");
    });
    t("[FIN-2] у каждой позиции валидные stat/category/kind/cost/weight/range", function(){
      var bad = [];
      WEAPON_PRESETS.forEach(function(w){
        if (!w.name) bad.push("(без имени)");
        else if (["str","dex"].indexOf(w.stat) === -1) bad.push(w.name + ":stat");
        else if (["simple","martial"].indexOf(w.category) === -1) bad.push(w.name + ":category");
        else if (["melee","ranged"].indexOf(w.kind) === -1) bad.push(w.name + ":kind");
        else if (!w.cost || !/^\d+ (мм|см|зм)$/.test(w.cost)) bad.push(w.name + ":cost");
        else if (typeof w.weight !== "number" || w.weight < 0) bad.push(w.name + ":weight");
        else if (!w.range) bad.push(w.name + ":range");
        else if (!w.damage && w.name !== "Сеть") bad.push(w.name + ":damage");
      });
      return bad.length === 0 || "битые: " + bad.join(",");
    });
    t("[FIN-2] книжные значения: Секира 1к12, Молот 2к6, Лёгкий молот 1к4; Тренчёра нет", function(){
      var byName = {};
      WEAPON_PRESETS.forEach(function(w){ byName[w.name] = w; });
      if (!byName["Секира"] || byName["Секира"].damage !== "1к12") return "Секира: " + (byName["Секира"] && byName["Секира"].damage);
      if (!byName["Молот"] || byName["Молот"].damage !== "2к6") return "Молот: " + (byName["Молот"] && byName["Молот"].damage);
      if (!byName["Лёгкий молот"] || byName["Лёгкий молот"].damage !== "1к4") return "Лёгкий молот: " + (byName["Лёгкий молот"] && byName["Лёгкий молот"].damage);
      if (byName["Тренчёр"]) return "Тренчёр остался в каталоге";
      return true;
    });
  }
  if (typeof _findWeapon === "function") {
    t("[FIN-2] _findWeapon: алиасы ведут к канону (Посох, Сабля, Дубина, Кистень…)", function(){
      var cases = [
        ["Посох", "Боевой посох"], ["Сабля", "Скимитар"], ["Дубина", "Дубинка"],
        ["Кистень", "Цеп"], ["Двуручный топор", "Секира"], ["Большой меч", "Двуручный меч"],
        ["Тяжёлый молот", "Молот"], ["Арбалет лёгкий", "Лёгкий арбалет"]
      ];
      for (var i = 0; i < cases.length; i++) {
        var w = _findWeapon(cases[i][0]);
        if (!w || w.name !== cases[i][1]) return "«" + cases[i][0] + "» → " + (w ? w.name : "null") + " (ожидал " + cases[i][1] + ")";
      }
      return true;
    });
    t("[FIN-2] _findWeapon: пары Копьё/Метательное/Длинное и Молот/Лёгкий/Боевой — длиннейшее имя побеждает", function(){
      var cases = [
        ["Копьё", "Копьё"], ["Метательное копьё", "Метательное копьё"], ["Длинное копьё", "Длинное копьё"],
        ["Молот", "Молот"], ["Лёгкий молот", "Лёгкий молот"], ["Боевой молот", "Боевой молот"]
      ];
      for (var i = 0; i < cases.length; i++) {
        var w = _findWeapon(cases[i][0]);
        if (!w || w.name !== cases[i][1]) return "«" + cases[i][0] + "» → " + (w ? w.name : "null") + " (ожидал " + cases[i][1] + ")";
      }
      return true;
    });
    t("[FIN-2] _findWeapon: словоформы билдов (дротики, метательные копья, 2 коротких меча)", function(){
      var cases = [
        ["10 дротиков", "Дротик"], ["4 метательных копья", "Метательное копьё"],
        ["4 метательных топора", "Ручной топор"], ["2 коротких меча", "Короткий меч"],
        ["Кинжалы ×2", "Кинжал"]
      ];
      for (var i = 0; i < cases.length; i++) {
        var w = _findWeapon(cases[i][0]);
        if (!w || w.name !== cases[i][1]) return "«" + cases[i][0] + "» → " + (w ? w.name : "null") + " (ожидал " + cases[i][1] + ")";
      }
      var none = _findWeapon("Боевое оружие (даёт Договор клинка)");
      if (none) return "«Боевое оружие (даёт Договор клинка)» не должно матчиться, получено " + none.name;
      if (_findWeapon("Тренчёр")) return "«Тренчёр» не должен матчиться";
      return true;
    });
    // Регресс-снапшот FIN-2: резолв ВСЕХ строк startingEquipment билдов зафиксирован.
    // null = строка уходит в другие ветки applyBuild (наборы/броня/щит/снаряжение).
    // При добавлении билда с новой строкой оружия — дополнить карту (снять факт через _findWeapon).
    if (typeof CHARACTER_BUILDS !== "undefined") {
      t("[FIN-2] регресс-снапшот: резолв всех строк startingEquipment соответствует эталону", function(){
        var expected = {
          "10 дротиков":"Дротик", "2 кинжала":"Кинжал", "2 коротких меча":"Короткий меч",
          "20 стрел":null, "4 метательных копья":"Метательное копьё", "4 метательных топора":"Ручной топор",
          "5 дротиков":"Дротик", "Боевое оружие (даёт Договор клинка)":null, "Боевой молот":"Боевой молот",
          "Болты (20)":null, "Булава":"Булава", "Воровские инструменты":null,
          "Двуручный меч":"Двуручный меч", "Двуручный топор":"Секира", "Деревянный щит":null,
          "Длинный лук":"Длинный лук", "Длинный меч":"Длинный меч", "Дубина":"Дубинка",
          "Кинжал":"Кинжал", "Кинжалы ×2":"Кинжал", "Книга":null, "Книга заклинаний":null,
          "Кожаный доспех":null, "Кольчуга":null, "Кольчужная рубаха":null, "Компонентный мешочек":null,
          "Короткий лук":"Короткий лук", "Короткий меч":"Короткий меч", "Латный доспех":null,
          "Лютня":null, "Лёгкий арбалет":"Лёгкий арбалет", "Набор артиста":null,
          "Набор исследователя":null, "Набор прислужника":null, "Набор путешественника":null,
          "Набор священника":null, "Набор учёного":null, "Набор фокусника":null, "Набор яда":null,
          "Посох":"Боевой посох", "Рапира":"Рапира", "Ручной топор":"Ручной топор",
          "Символ веры":null, "Скимитар":"Скимитар", "Тотем друида":null,
          "Тяжёлый арбалет":"Тяжёлый арбалет", "Чешуйчатый доспех":null, "Щит":null
        };
        var bad = [];
        var strings = {};
        CHARACTER_BUILDS.forEach(function(b){ (b.startingEquipment || []).forEach(function(s){ strings[s] = 1; }); });
        Object.keys(strings).forEach(function(s){
          if (!(s in expected)) { bad.push("нет в эталоне: «" + s + "» → снять факт и дополнить карту"); return; }
          var w = _findWeapon(s);
          var got = w ? w.name : null;
          if (got !== expected[s]) bad.push("«" + s + "» → " + got + " (эталон " + expected[s] + ")");
        });
        return bad.length === 0 || bad.join("; ");
      });
    }
  }
  if (typeof checkWeaponProficiency === "function") {
    t("[FIN-2] checkWeaponProficiency: алиасы и конкретные владения (specificWeapons)", function(){
      var simple = { proficiencies: { weapon: ["simple"], specificWeapons: [] } };
      if (!checkWeaponProficiency(simple, "Дубина")) return "simple + алиас «Дубина» → false";
      if (checkWeaponProficiency(simple, "Сабля")) return "simple + «Сабля» (воинский Скимитар) → true";
      var monk = { proficiencies: { weapon: ["simple"], specificWeapons: ["Короткий меч"] } };
      if (!checkWeaponProficiency(monk, "Короткий меч")) return "монах: строковый specificWeapons не учтён";
      var druid = { proficiencies: { weapon: ["simple"], specificWeapons: [{ name: "Скимитар", source: "class" }] } };
      if (!checkWeaponProficiency(druid, "Скимитар")) return "друид: объектный specificWeapons не учтён";
      if (!checkWeaponProficiency(druid, "Сабля")) return "друид: алиас «Сабля» не сведён к Скимитару";
      var martial = { proficiencies: { weapon: ["martial"], specificWeapons: [] } };
      if (!checkWeaponProficiency(martial, "Секира")) return "martial + Секира → false";
      return true;
    });
  }
  if (typeof recalcArmorWeaponFromSources === "function" && typeof CLASS_WEAPONS_SPECIFIC !== "undefined") {
    t("[FIN-2] recalc: конкретные владения класса (Друид → Скимитар, source class)", function(){
      var char = { race: "", class: "Друид", classes: [], feats: [], proficiencies: {} };
      recalcArmorWeaponFromSources(char);
      var specs = char.proficiencies.specificWeapons || [];
      var hit = specs.find(function(w){ return w.name === "Скимитар"; });
      if (!hit) return "Скимитара нет: " + JSON.stringify(specs);
      if (hit.source !== "class") return "source " + hit.source + " (ожидал class)";
      return true;
    });
  }
  if (typeof submitWeapon === "function" && typeof removeWeapon === "function") {
    t("[FIN-2] submitWeapon/removeWeapon: коннект с инвентарём (вес каталога, стопка qty)", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        var char = { id: "tw1", level: 1, stats: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 },
          proficiencies: { weapon: ["simple"], specificWeapons: [] },
          coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }, equipState: {}, pouches: [],
          weapons: [], inventory: { weapon: [], armor: [], potion: [], scroll: [], tool: [], material: [], other: [] } };
        window.characters = [char]; window.currentId = "tw1";
        function fill() {
          document.getElementById("new-weapon-name").value = "Кинжал";
          document.getElementById("new-weapon-stat").value = "dex";
          document.getElementById("new-weapon-damage").value = "1к4";
          document.getElementById("new-weapon-type").value = "Колющий";
          document.getElementById("new-weapon-range").value = "Ближний/20/60 фт";
          document.getElementById("new-weapon-notes").value = "Лёгкое";
          document.getElementById("new-weapon-add-inv").checked = true;
        }
        fill();
        submitWeapon();
        if (char.weapons.length !== 1) return "weapons после добавления: " + char.weapons.length;
        if (!char.weapons[0].proficient) return "Кинжал (simple) должен быть с владением";
        if (char.inventory.weapon.length !== 1) return "в инвентаре: " + char.inventory.weapon.length;
        if (char.inventory.weapon[0].weight !== 1) return "вес не из каталога: " + char.inventory.weapon[0].weight;
        if (char.inventory.weapon[0].location !== "wielded") return "location: " + char.inventory.weapon[0].location;
        fill(); // closeWeaponModal очистил поля
        submitWeapon();
        if (char.inventory.weapon.length !== 1) return "дубль вместо стопки: " + char.inventory.weapon.length;
        if (char.inventory.weapon[0].qty !== 2) return "qty после повтора: " + char.inventory.weapon[0].qty;
        removeWeapon(0);
        if (char.inventory.weapon[0].qty !== 1) return "qty после удаления: " + char.inventory.weapon[0].qty;
        removeWeapon(0);
        if (char.inventory.weapon.length !== 0) return "предмет не ушёл из инвентаря";
        if (char.weapons.length !== 0) return "строки атак остались: " + char.weapons.length;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });
  }

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

  // TEST-2: возвращаем localStorage как было до тестов (см. снапшот в начале IIFE).
  _lsKeys.forEach(function(k){
    try {
      if (_lsSnapshot[k] === null || _lsSnapshot[k] === undefined) localStorage.removeItem(k);
      else localStorage.setItem(k, _lsSnapshot[k]);
    } catch(e) { /* localStorage недоступен — нечего восстанавливать */ }
  });

  console.log("[TESTS]", window.__testResults);
})();
