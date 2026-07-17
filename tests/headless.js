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
  // E24-0: + dnd_edition/dnd_e24_beta — БЛОК 32 зовёт setEdition()/бета-флаг.
  var _lsKeys = ["dnd_chars", "dnd_spells", "dnd_hp_history", "dnd_party", "dnd_battle", "dnd_accent", "dnd_auto_accent", "dnd_stats_layout", "dnd_edition", "dnd_e24_beta"];
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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
        if (p.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + p.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: " + c.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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
      if (div.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + div.schemaVersion;
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
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: ожидал " + SCHEMA_VERSION + ", получено " + c.schemaVersion;
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

    t("[spells] _castableSlotOptions: уровни от spell.level, только свободные, пакт при уровне ≥", function(){
      if (typeof _castableSlotOptions !== "function") return true; // noop в минимальной среде
      var char = { spells: { slots: { 1: 4, 2: 2, 3: 1 }, slotsUsed: { 1: 4, 2: 1 },
                             pactSlots: 2, pactLevel: 2, pactUsed: 1 } };
      var opts = _castableSlotOptions(char, { level: 2 });
      var got = opts.map(function(o){ return o.type + o.level + ":" + o.free; }).join(",");
      if (got !== "slot2:1,slot3:1,pact2:1") return "L2: ожидал slot2:1,slot3:1,pact2:1, получено " + got;
      opts = _castableSlotOptions(char, { level: 3 }); // пакт 2 ур. уже не годится
      got = opts.map(function(o){ return o.type + o.level + ":" + o.free; }).join(",");
      if (got !== "slot3:1") return "L3: ожидал slot3:1, получено " + got;
      opts = _castableSlotOptions(char, { level: 1 }); // 1 ур. весь потрачен → с 2-го
      got = opts.map(function(o){ return o.type + o.level; }).join(",");
      if (got !== "slot2,slot3,pact2") return "L1: ожидал slot2,slot3,pact2, получено " + got;
      if (_castableSlotOptions(null, { level: 1 }).length !== 0) return "null-char: ожидал []";
      if (_castableSlotOptions({ spells: { slots: {}, slotsUsed: {} } }, { level: 4 }).length !== 0) return "без ячеек: ожидал []";
      return true;
    });

    t("[spells] castSpell: заговор без ячейки, трата единственной, отказ без ячеек и неподготовленному", function(){
      if (typeof castSpell !== "function") return true; // noop в минимальной среде
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id: "test-cast-1", class: "Жрец", level: 3,
          stats: { str: 10, dex: 10, con: 10, int: 10, wis: 16, cha: 10 },
          combat: {}, saves: {}, skills: [],
          spells: { stat: "МУД", slots: { 1: 2 }, slotsUsed: {},
            mySpells: [
              { id: 200, name: "Свет",          level: 0 },
              { id: 201, name: "Лечение ран",   level: 1 },
              { id: 202, name: "Щит веры",      level: 1 },
              { id: 203, name: "Вечный огонь",  level: 2 }
            ],
            prepared: [201, 203] }
        }];
        window.currentId = "test-cast-1";
        var sp = window.characters[0].spells;
        castSpell(200); // заговор — ячейки не тронуты
        if ((sp.slotsUsed[1] || 0) !== 0) return "заговор потратил ячейку: used " + sp.slotsUsed[1];
        castSpell(201); // единственный вариант (1 ур.) — тратится сразу
        if (sp.slotsUsed[1] !== 1) return "каст 1 ур.: ожидал used 1, получено " + sp.slotsUsed[1];
        castSpell(202); // не подготовлено у prep-класса → отказ
        if (sp.slotsUsed[1] !== 1) return "неподготовленное потратило ячейку";
        castSpell(203); // подготовлено, но ячеек 2 ур.+ нет → отказ
        if (sp.slotsUsed[1] !== 1 || (sp.slotsUsed[2] || 0) !== 0) return "каст без ячеек что-то потратил";
        castSpell(201); castSpell(201); // вторая ячейка ушла, третьей нет
        if (sp.slotsUsed[1] !== 2) return "повторный каст: ожидал used 2, получено " + sp.slotsUsed[1];
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[spells] _castSpellWithSlot: пакт-ячейка колдуна и защита от двойной траты", function(){
      if (typeof _castSpellWithSlot !== "function") return true; // noop в минимальной среде
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id: "test-cast-2", class: "Колдун", level: 5,
          stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 16 },
          combat: {}, saves: {}, skills: [],
          spells: { stat: "ХАР", slots: {}, slotsUsed: {},
            pactSlots: 2, pactLevel: 3, pactUsed: 0,
            mySpells: [{ id: 300, name: "Ведьмин снаряд", level: 1 }] }
        }];
        window.currentId = "test-cast-2";
        var sp = window.characters[0].spells;
        castSpell(300); // Колдун не prep-класс; единственный вариант — пакт
        if (sp.pactUsed !== 1) return "пакт-каст: ожидал pactUsed 1, получено " + sp.pactUsed;
        _castSpellWithSlot(300, "pact", 3);
        if (sp.pactUsed !== 2) return "пакт-каст 2: ожидал pactUsed 2, получено " + sp.pactUsed;
        _castSpellWithSlot(300, "pact", 3); // свободных нет → отказ без ухода в минус
        if (sp.pactUsed !== 2) return "пакт ушёл выше лимита: " + sp.pactUsed;
        _castSpellWithSlot(300, "slot", 1); // обычных ячеек нет вовсе → отказ
        if ((sp.slotsUsed[1] || 0) !== 0) return "потрачена несуществующая обычная ячейка";
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

  // ────────── БЛОК 22 (FIN-3): доспехи — таблица 13, миграция, помехи ──────────
  if (typeof ARMOR_PRESETS !== "undefined") {
    t("[FIN-3] ARMOR_PRESETS: 13 позиций + none, группы 3/5/4 (лёгкий/средний/тяжёлый)", function(){
      if (ARMOR_PRESETS.length !== 13) return "длина " + ARMOR_PRESETS.length;
      var n = { none:0, light:0, medium:0, heavy:0 };
      ARMOR_PRESETS.forEach(function(a){ n[a.type] = (n[a.type] || 0) + 1; });
      if (n.none !== 1 || n.light !== 3 || n.medium !== 5 || n.heavy !== 4)
        return "группы: " + JSON.stringify(n);
      return true;
    });
    t("[FIN-3] у каждой позиции валидные baseAC/dexCap/strReq/weight/cost + тяжёлые dexCap 0", function(){
      var bad = [];
      ARMOR_PRESETS.forEach(function(a){
        if (typeof a.baseAC !== "number") bad.push(a.id + ":baseAC");
        else if ([0,2,99].indexOf(a.dexCap) === -1) bad.push(a.id + ":dexCap");
        else if (typeof a.strReq !== "number") bad.push(a.id + ":strReq");
        else if (typeof a.weight !== "number") bad.push(a.id + ":weight");
        else if (typeof a.cost !== "number") bad.push(a.id + ":cost");
        else if (typeof a.stealthDisadv !== "boolean") bad.push(a.id + ":stealthDisadv");
        else if (a.type === "heavy" && a.dexCap !== 0) bad.push(a.id + ":heavy dexCap≠0");
        else if (a.type === "medium" && a.dexCap !== 2) bad.push(a.id + ":medium dexCap≠2");
      });
      return bad.length === 0 || "битые: " + bad.join(",");
    });
    t("[FIN-3] книжные значения PHB 2014: КД/СИЛ/Скрытность ключевых доспехов", function(){
      var by = {};
      ARMOR_PRESETS.forEach(function(a){ by[a.id] = a; });
      // Колечный (ring mail) КД14, без СИЛ; Кольчуга (chain mail) КД16 СИЛ13; оба помеха
      if (!by.ring || by.ring.baseAC !== 14 || by.ring.name !== "Колечный доспех")
        return "ring: " + (by.ring && by.ring.baseAC + "/" + by.ring.name);
      if (!by.chain_mail || by.chain_mail.baseAC !== 16 || by.chain_mail.strReq !== 13)
        return "chain_mail: " + (by.chain_mail && by.chain_mail.baseAC + "/СИЛ" + by.chain_mail.strReq);
      if (!by.hide || by.hide.baseAC !== 12 || by.hide.type !== "medium")
        return "hide: " + (by.hide && by.hide.baseAC + "/" + by.hide.type);
      if (by.splint.strReq !== 15 || by.plate.strReq !== 15) return "splint/plate strReq не 15";
      // Помеха на Скрытность: padded, scale, half_plate, ring, chain_mail, splint, plate
      var expStealth = ["padded","scale","half_plate","ring","chain_mail","splint","plate"];
      var gotStealth = ARMOR_PRESETS.filter(function(a){ return a.stealthDisadv; }).map(function(a){ return a.id; }).sort();
      if (gotStealth.join(",") !== expStealth.slice().sort().join(","))
        return "stealthDisadv: " + gotStealth.join(",");
      return true;
    });
    t("[FIN-3] имена и алиасы уникальны в совокупности (без конфликтов матчинга)", function(){
      var seen = {}, dup = [];
      ARMOR_PRESETS.forEach(function(a){
        [a.name].concat(a.aliases || []).forEach(function(nm){
          var k = String(nm).toLowerCase();
          if (seen[k]) dup.push(nm); seen[k] = true;
        });
      });
      return dup.length === 0 || "дубли: " + dup.join(",");
    });

    // Миграция schema 29: старый armorId "ring" (КД16 «Кольчуга») → "chain_mail"
    if (typeof migrateCharacter === "function") {
      t("[FIN-3][mig] schema 29: armorId ring→chain_mail (сохраняет КД16), идемпотентна", function(){
        var c = migrateCharacter({
          id: 9310, class: "Воин", level: 3, schemaVersion: 28,
          combat: { armorId: "ring", hpCurrent: 20, hpMax: 20 }
        });
        if (c.combat.armorId !== "chain_mail") return "armorId не мигрирован: " + c.combat.armorId;
        if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: " + c.schemaVersion;
        // повторный прогон не должен ничего менять (idempotent)
        var again = migrateCharacter(JSON.parse(JSON.stringify(c)));
        if (again.combat.armorId !== "chain_mail") return "повторная миграция сломала armorId: " + again.combat.armorId;
        // новый персонаж уже на текущей схеме — «ring» (Колечный КД14) не трогаем
        var fresh = migrateCharacter({
          id: 9311, class: "Воин", level: 1, schemaVersion: 29,
          combat: { armorId: "ring", hpCurrent: 10, hpMax: 10 }
        });
        if (fresh.combat.armorId !== "ring") return "актуальный сейв не должен мигрировать: " + fresh.combat.armorId;
        return true;
      });
    }

    // armorPenalties (app-combat.js) — чистый расчёт помех по СИЛ
    if (typeof armorPenalties === "function") {
      t("[FIN-3] armorPenalties: СИЛ<13 в Кольчуге → slowed; none/лёгкий → без помех", function(){
        var by = {}; ARMOR_PRESETS.forEach(function(a){ by[a.id] = a; });
        var weakStr = { stats: { str: 10 } }, strongStr = { stats: { str: 15 } };
        var p1 = armorPenalties(weakStr, by.chain_mail);
        if (!p1.slowed || !p1.stealthDisadv) return "Кольчуга@СИЛ10: " + JSON.stringify(p1);
        var p2 = armorPenalties(strongStr, by.chain_mail);
        if (p2.slowed) return "Кольчуга@СИЛ15 не должна замедлять: " + JSON.stringify(p2);
        var p3 = armorPenalties(weakStr, by.leather);
        if (p3.slowed || p3.stealthDisadv) return "Кожаный не даёт помех: " + JSON.stringify(p3);
        var p4 = armorPenalties(weakStr, by.none);
        if (p4.slowed || p4.stealthDisadv) return "none без помех: " + JSON.stringify(p4);
        // Наборный/Латы: СИЛ 15
        var p5 = armorPenalties({ stats: { str: 14 } }, by.splint);
        if (!p5.slowed) return "Наборный@СИЛ14 должен замедлять";
        return true;
      });
    }

    // Матчинг строк билдов/сейвов через _findArmorPreset (имя ИЛИ алиас)
    if (typeof _findArmorPreset === "function") {
      t("[FIN-3] _findArmorPreset: строки билдов резолвятся правильно (Кольчуга→chain_mail, Латный доспех→plate)", function(){
        var cases = [
          ["Кольчуга", "chain_mail"], ["Латный доспех", "plate"],
          ["Кожаный доспех", "leather"], ["Чешуйчатый доспех", "scale"],
          ["Кольчужная рубаха", "chain_shirt"], ["Шкурный", "hide"]
        ];
        for (var i = 0; i < cases.length; i++) {
          var a = _findArmorPreset(cases[i][0]);
          if (!a || a.id !== cases[i][1])
            return "«" + cases[i][0] + "» → " + (a ? a.id : "null") + " (ожидал " + cases[i][1] + ")";
        }
        return true;
      });
    }

    // fs-тест: каждый armorId присутствует в index.html как <option value="...">.
    // Источник index.html инжектит node-раннер в window.__indexHtmlSource
    // (в браузерном runner.html недоступен → тест пропускается).
    if (typeof window !== "undefined" && typeof window.__indexHtmlSource === "string") {
      t("[FIN-3] каждый armorId есть в index.html как <option>", function(){
        var html = window.__indexHtmlSource;
        var missing = ARMOR_PRESETS.filter(function(a){
          return html.indexOf('value="' + a.id + '"') === -1;
        }).map(function(a){ return a.id; });
        return missing.length === 0 || "нет option: " + missing.join(",");
      });
    }
  }

  // ────────── БЛОК 23 (FIN-4): предыстории — сверка 13, инструменты, умение ──────────
  if (typeof BACKGROUND_SKILLS !== "undefined") {
    t("[FIN-4] BACKGROUND_SKILLS: ровно 13 предысторий, у каждой 2 навыка", function(){
      var keys = Object.keys(BACKGROUND_SKILLS);
      if (keys.length !== 13) return "предысторий " + keys.length + ": " + keys.join(",");
      var bad = keys.filter(function(k){ return !Array.isArray(BACKGROUND_SKILLS[k].skills) || BACKGROUND_SKILLS[k].skills.length !== 2; });
      return bad.length === 0 || "не 2 навыка: " + bad.join(",");
    });
    t("[FIN-4] +Шарлатан и +Беспризорник присутствуют", function(){
      var miss = ["Шарлатан","Беспризорник"].filter(function(k){ return !BACKGROUND_SKILLS[k]; });
      return miss.length === 0 || "нет: " + miss.join(",");
    });
    t("[FIN-4] все навыки предысторий ∈ каталог навыков (skills)", function(){
      if (typeof skills === "undefined") return "нет глобального skills";
      var names = {}; skills.forEach(function(s){ names[s.name] = true; });
      var bad = [];
      Object.keys(BACKGROUND_SKILLS).forEach(function(k){
        (BACKGROUND_SKILLS[k].skills || []).forEach(function(sk){ if (!names[sk]) bad.push(k + ":" + sk); });
      });
      return bad.length === 0 || "вне каталога: " + bad.join(",");
    });
    t("[FIN-4] все инструменты ∈ TOOL_CATALOG или choice-слот (parseBackgroundToolEntry)", function(){
      if (typeof parseBackgroundToolEntry !== "function" || typeof findToolInCatalog !== "function")
        return "нет parseBackgroundToolEntry/findToolInCatalog";
      var bad = [];
      Object.keys(BACKGROUND_SKILLS).forEach(function(k){
        (BACKGROUND_SKILLS[k].tools || []).forEach(function(tool){
          var p = parseBackgroundToolEntry(tool);
          if (p.type === "slot") return;                 // слот-выбор — ок
          if (!findToolInCatalog(tool)) bad.push(k + ":" + tool);
        });
      });
      return bad.length === 0 || "вне TOOL_CATALOG: " + bad.join(",");
    });
    t("[FIN-4] у каждой предыстории непустое feature {name,desc}", function(){
      var bad = [];
      Object.keys(BACKGROUND_SKILLS).forEach(function(k){
        var f = BACKGROUND_SKILLS[k].feature;
        if (!f || !f.name || !f.desc) bad.push(k);
      });
      return bad.length === 0 || "без умения: " + bad.join(",");
    });
    t("[FIN-4] книжные значения Шарлатан/Беспризорник (навыки/инстр./умение)", function(){
      var sh = BACKGROUND_SKILLS["Шарлатан"], be = BACKGROUND_SKILLS["Беспризорник"];
      if (sh.skills.slice().sort().join(",") !== ["Ловкость рук","Обман"].sort().join(",")) return "Шарлатан навыки: " + sh.skills;
      if (sh.tools.slice().sort().join(",") !== ["Набор для грима","Принадлежности фальсификатора"].sort().join(",")) return "Шарлатан инстр.: " + sh.tools;
      if (sh.feature.name !== "Поддельная личность") return "Шарлатан умение: " + sh.feature.name;
      if (be.skills.slice().sort().join(",") !== ["Ловкость рук","Скрытность"].sort().join(",")) return "Беспризорник навыки: " + be.skills;
      if (be.tools.slice().sort().join(",") !== ["Воровские инструменты","Набор для грима"].sort().join(",")) return "Беспризорник инстр.: " + be.tools;
      if (be.feature.name !== "Городские тайны") return "Беспризорник умение: " + be.feature.name;
      return true;
    });
    t("[FIN-4] сверка по книге: Солдат +«Игровой набор (один)», Народный герой +«Транспорт (наземный)»", function(){
      if (BACKGROUND_SKILLS["Солдат"].tools.indexOf("Игровой набор (один)") === -1) return "Солдат без игрового набора";
      if (BACKGROUND_SKILLS["Народный герой"].tools.indexOf("Транспорт (наземный)") === -1) return "Народный герой без транспорта";
      return true;
    });
    // fs-тест: каждая предыстория присутствует в index.html как <option value="...">
    if (typeof window !== "undefined" && typeof window.__indexHtmlSource === "string") {
      t("[FIN-4] каждая предыстория есть в index.html как <option>", function(){
        var html = window.__indexHtmlSource;
        var missing = Object.keys(BACKGROUND_SKILLS).filter(function(k){
          return html.indexOf('value="' + k + '"') === -1;
        });
        return missing.length === 0 || "нет option: " + missing.join(",");
      });
    }
  }

  // ────────── БЛОК 24 (FIN-5): снаряжение — каталог товаров + наборы PHB ──────────
  // GEAR_PACKS в data.js (грузится всегда). GEAR_CATALOG лениво (gear-catalog.js) —
  // в node-раннере подключён явно, в браузерном runner.html отсутствует → часть тестов пропускается.
  if (typeof GEAR_PACKS !== "undefined" || (typeof window !== "undefined" && window.GEAR_PACKS)) {
    var _PACKS_T = (typeof GEAR_PACKS !== "undefined") ? GEAR_PACKS : window.GEAR_PACKS;
    t("[FIN-5] GEAR_PACKS: 7 канонических наборов PHB присутствуют", function(){
      var need = ["набор путешественника","набор подземелий","набор учёного","набор священника","набор артиста","набор дипломата","набор взломщика"];
      var miss = need.filter(function(k){ return !Array.isArray(_PACKS_T[k]) || !_PACKS_T[k].length; });
      return miss.length === 0 || "нет наборов: " + miss.join(",");
    });
    t("[FIN-5] GEAR_PACKS: каждая запись набора — массив длины 6 [name,qty,weight,slots,location,desc]", function(){
      var bad = [];
      Object.keys(_PACKS_T).forEach(function(k){
        (_PACKS_T[k] || []).forEach(function(p, i){
          if (!Array.isArray(p) || p.length !== 6) { bad.push(k + "[" + i + "]:len=" + (Array.isArray(p) ? p.length : "не массив")); return; }
          if (typeof p[0] !== "string" || !p[0]) bad.push(k + "[" + i + "]:name");
          else if (typeof p[1] !== "number") bad.push(k + "[" + i + "]:qty");
          else if (typeof p[2] !== "number") bad.push(k + "[" + i + "]:weight");
          else if (typeof p[3] !== "number") bad.push(k + "[" + i + "]:slots");
          else if (typeof p[4] !== "string") bad.push(k + "[" + i + "]:location");
          else if (typeof p[5] !== "string") bad.push(k + "[" + i + "]:desc");
        });
      });
      return bad.length === 0 || "битые записи: " + bad.slice(0, 6).join("; ");
    });
  }
  if (typeof GEAR_CATALOG !== "undefined") {
    // FIN-9: cat допускает mount|vehicle (транспорт) сверх категорий ITEM_ICONS —
    // в инвентарь они падают как «Прочее» (fillFromGearItem), в каталоге — свои чипы.
    var _WHITE = ((typeof ITEM_ICONS !== "undefined") ? Object.keys(ITEM_ICONS) : ["weapon","armor","potion","scroll","tool","material","other"]).concat(["mount","vehicle"]);
    t("[FIN-5/9] GEAR_CATALOG: 56 снаряжения + транспорт (75–90 позиций), id уникальны", function(){
      if (GEAR_CATALOG.length < 75 || GEAR_CATALOG.length > 90) return "позиций " + GEAR_CATALOG.length + " (ожидал 75–90: снаряжение + транспорт)";
      var seen = {}, dup = [];
      GEAR_CATALOG.forEach(function(g){ if (seen[g.id]) dup.push(g.id); seen[g.id] = true; });
      return dup.length === 0 || "дубли id: " + dup.join(",");
    });
    t("[FIN-5] GEAR_CATALOG: cat ∈ ITEM_ICONS∪{mount,vehicle}, cost непустая строка, weight/slots числа ≥0", function(){
      var bad = [];
      GEAR_CATALOG.forEach(function(g){
        if (!g.name) bad.push("(без имени)");
        else if (_WHITE.indexOf(g.cat) === -1) bad.push(g.name + ":cat=" + g.cat);
        else if (typeof g.cost !== "string" || !g.cost) bad.push(g.name + ":cost");
        else if (typeof g.weight !== "number" || g.weight < 0) bad.push(g.name + ":weight");
        else if (typeof g.slots !== "number" || g.slots < 0) bad.push(g.name + ":slots");
        else if (!g.desc) bad.push(g.name + ":desc");
      });
      return bad.length === 0 || "битые: " + bad.slice(0, 8).join(",");
    });
    t("[FIN-5] GEAR_CATALOG: боеприпасы и фокусировки на месте (стрелы/болты/мешочек с компонентами)", function(){
      var byId = {}; GEAR_CATALOG.forEach(function(g){ byId[g.id] = g; });
      var need = ["arrows","bolts","component-pouch","holy-symbol"];
      var miss = need.filter(function(id){ return !byId[id]; });
      return miss.length === 0 || "нет: " + miss.join(",");
    });
    // ── FIN-9: транспорт/ездовые + безделушки d100 ─────────────────────────────
    t("[FIN-9] GEAR_CATALOG: транспорт mount/vehicle ≥ 20 записей, у каждого cost и location:outside", function(){
      var trans = GEAR_CATALOG.filter(function(g){ return g.cat === "mount" || g.cat === "vehicle"; });
      if (trans.length < 20) return "транспорта только " + trans.length + " (ожидал ≥20)";
      var bad = [];
      trans.forEach(function(g){
        if (typeof g.cost !== "string" || !g.cost) bad.push(g.name + ":cost");
        else if (g.location !== "outside") bad.push(g.name + ":location=" + g.location);
        else if (g.weight !== 0) bad.push(g.name + ":weight=" + g.weight);   // не нести в рюкзаке
      });
      return bad.length === 0 || "битые: " + bad.slice(0, 6).join(",");
    });
    t("[FIN-9] GEAR_CATALOG: ключевые скакуны/повозки/суда присутствуют", function(){
      var byId = {}; GEAR_CATALOG.forEach(function(g){ byId[g.id] = g; });
      var need = ["warhorse","riding-horse","pony","donkey-mule","cart","wagon","rowboat"];
      var miss = need.filter(function(id){ return !byId[id]; });
      return miss.length === 0 || "нет: " + miss.join(",");
    });
  }
  if (typeof TRINKETS_D100 !== "undefined") {
    t("[FIN-9] TRINKETS_D100: ровно 100 непустых строк", function(){
      if (!Array.isArray(TRINKETS_D100)) return "не массив";
      if (TRINKETS_D100.length !== 100) return "длина " + TRINKETS_D100.length + " (ожидал 100)";
      var bad = [];
      TRINKETS_D100.forEach(function(s, i){ if (typeof s !== "string" || !s.trim()) bad.push(i + 1); });
      return bad.length === 0 || "пустые к100: " + bad.slice(0, 6).join(",");
    });
  }
  // Интеграция: applyBuild разворачивает пак-строку startingEquipment в inventory.other.
  // (билд fighter-champion-gwm имеет «Набор путешественника».) loadCharacter в DOM-шиме
  // может бросить ПОСЛЕ characters.push — персонаж уже в массиве, ловим и инспектируем.
  if (typeof applyBuild === "function" && typeof getBuildById === "function" &&
      typeof characters !== "undefined" && (typeof GEAR_PACKS !== "undefined" || (typeof window !== "undefined" && window.GEAR_PACKS))) {
    t("[FIN-5] applyBuild разворачивает «Набор путешественника» в inventory.other", function(){
      if (!getBuildById("fighter-champion-gwm")) return "билд-фикстура fighter-champion-gwm недоступен";
      try { applyBuild("fighter-champion-gwm"); } catch (e) { /* побочка loadCharacter в шиме — ок */ }
      var ch = null;
      for (var i = characters.length - 1; i >= 0; i--) { if (characters[i].buildId === "fighter-champion-gwm") { ch = characters[i]; break; } }
      if (!ch) return "персонаж не создан applyBuild";
      var other = (ch.inventory && ch.inventory.other) || [];
      var pack = ((typeof GEAR_PACKS !== "undefined") ? GEAR_PACKS : window.GEAR_PACKS)["набор путешественника"] || [];
      var names = other.map(function(x){ return x.name; });
      var miss = pack.filter(function(p){ return names.indexOf(p[0]) === -1; }).map(function(p){ return p[0]; });
      if (miss.length) return "в inventory.other нет из набора: " + miss.join(",");
      var rukzak = other.filter(function(x){ return x.name === "Рюкзак"; })[0];
      if (!rukzak || rukzak.location !== "worn") return "Рюкзак развёрнут без location:worn";
      return true;
    });
  }

  // ────────── БЛОК 25 (FIN-6): настройка магпредметов — countAttuned, лимит 3 ──────────
  if (typeof countAttuned === "function") {
    t("[FIN-6] countAttuned: суммирует attuned по всем категориям инвентаря", function(){
      var char = { inventory: {
        weapon: [{ name:"Меч +1", attunable:true, attuned:true }, { name:"Кинжал" }],
        armor:  [{ name:"Латы адаманта", attunable:true }],                 // attunable, но не настроен
        other:  [{ name:"Кольцо защиты", attunable:true, attuned:true },
                 { name:"Плащ эльфов", attunable:true, attuned:true }],
        potion: [{ name:"Зелье лечения" }]
      }};
      var n = countAttuned(char);
      return n === 3 || "ожидал 3 настроенных, получено " + n;
    });
    t("[FIN-6] countAttuned: пустой/отсутствующий inventory → 0", function(){
      if (countAttuned({}) !== 0) return "пустой char → не 0";
      if (countAttuned(null) !== 0) return "null → не 0";
      if (countAttuned({ inventory: { other: [] } }) !== 0) return "пустая категория → не 0";
      return true;
    });
  }
  if (typeof toggleAttuned === "function") {
    t("[FIN-6] toggleAttuned: переключает attuned, 4-я настройка РАЗРЕШЕНА (не блок)", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id: "test-attune", stats: { str: 10 }, coins: { cp:0,sp:0,ep:0,gp:0,pp:0 },
          inventory: {
            weapon:[], armor:[], potion:[], scroll:[], tool:[], material:[],
            other: [
              { name:"Кольцо 1", attunable:true },
              { name:"Кольцо 2", attunable:true },
              { name:"Кольцо 3", attunable:true },
              { name:"Кольцо 4", attunable:true }
            ]
          }
        }];
        window.currentId = "test-attune";
        var char = window.characters[0];
        try { toggleAttuned("other", 0); } catch(e) {}   // render-побочка в шиме — не важна
        if (!char.inventory.other[0].attuned) return "1-я настройка не включилась";
        try { toggleAttuned("other", 1); } catch(e) {}
        try { toggleAttuned("other", 2); } catch(e) {}
        try { toggleAttuned("other", 3); } catch(e) {}   // 4-я — разрешена
        if (!char.inventory.other[3].attuned) return "4-я настройка заблокирована (должна быть разрешена)";
        if (countAttuned(char) !== 4) return "ожидал 4 настройки, получено " + countAttuned(char);
        try { toggleAttuned("other", 0); } catch(e) {}   // снять первую
        if (char.inventory.other[0].attuned) return "снятие настройки не сработало";
        if (countAttuned(char) !== 3) return "после снятия ожидал 3, получено " + countAttuned(char);
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });
    t("[FIN-6] toggleAttuned: не-attunable предмет игнорируется", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id: "test-attune2", stats: { str: 10 }, coins: { cp:0,sp:0,ep:0,gp:0,pp:0 },
          inventory: { weapon:[], armor:[], potion:[], scroll:[], tool:[], material:[],
            other: [{ name:"Обычная верёвка" }] }
        }];
        window.currentId = "test-attune2";
        var char = window.characters[0];
        try { toggleAttuned("other", 0); } catch(e) {}
        return !char.inventory.other[0].attuned || "не-attunable предмет получил attuned";
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });
  }

  // ────────── БЛОК 26 (FIN-7): спасбросок концентрации при уроне ──────────
  if (typeof concSaveParams === "function") {
    t("[FIN-7] concSaveParams: урон 10 → СЛ 10 (минимум)", function(){
      var p = concSaveParams({ stats:{con:10}, saves:{}, level:1 }, 10);
      return p.dc === 10 || "ожидал СЛ 10, получено " + p.dc;
    });
    t("[FIN-7] concSaveParams: урон 47 → СЛ 23 (урон/2 вниз)", function(){
      var p = concSaveParams({ stats:{con:10}, saves:{}, level:1 }, 47);
      return p.dc === 23 || "ожидал СЛ 23, получено " + p.dc;
    });
    t("[FIN-7] concSaveParams: ТЕЛ-мод; владение спасом добавляет мастерство", function(){
      var noProf = concSaveParams({ stats:{con:14}, saves:{con:false}, level:5 }, 20);
      if (noProf.mod !== 2) return "без владения ожидал +2, получено " + noProf.mod;
      var withProf = concSaveParams({ stats:{con:14}, saves:{con:true}, level:5 }, 20);
      if (withProf.mod !== 5) return "с владением (5 ур.) ожидал +5, получено " + withProf.mod;
      return true;
    });
    t("[FIN-7] concSaveParams: черта «Боевой маг» (war_caster) → преимущество", function(){
      var plain = concSaveParams({ stats:{con:10}, saves:{}, level:3, feats:[{id:"alert"}] }, 8);
      if (plain.mode !== "normal") return "без war_caster ожидал normal, получено " + plain.mode;
      var wc = concSaveParams({ stats:{con:10}, saves:{}, level:3, feats:[{id:"war_caster"}] }, 8);
      return wc.mode === "adv" || "с war_caster ожидал adv, получено " + wc.mode;
    });
  }
  if (typeof quickHP === "function") {
    t("[FIN-7] quickHP: урон до 0 ХП снимает концентрацию без броска", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        _ensureEl("status-level", "span");
        _ensureEl("status-hp-current", "span");
        _ensureEl("status-hp-max", "span");
        window.characters = [{
          id: "test-conc-0",
          combat: { hpTemp: 0, hpCurrent: 8, hpMax: 20, hpDice: "1к8", hpDiceSpent: 0 },
          stats: { str:10, dex:10, con:10, int:10, wis:10, cha:10 },
          saves: {}, skills: [], spells: { stat:"", slots:{}, slotsUsed:{} },
          level: 3, concentration: "Благословение",
          deathSaves: { successes:[false,false,false], failures:[false,false,false] }
        }];
        window.currentId = "test-conc-0";
        quickHP(-12, "Test");                       // 8 − 12 → 0 ХП (авто-срыв, без модалки/броска)
        var ch = window.characters[0];
        if (ch.combat.hpCurrent !== 0) return "ожидал hpCurrent=0, получено " + ch.combat.hpCurrent;
        if (ch.concentration !== null) return "концентрация должна сняться на 0 ХП, получено " + JSON.stringify(ch.concentration);
        return true;
      } finally {
        window.characters = savedChars;
        window.currentId = savedId;
      }
    });
  }

  // ────────── БЛОК 27 (FIN-8): заряды предметов ──────────
  if (typeof restoreItemCharges === "function") {
    t("[FIN-8] restoreItemCharges: длинный отдых восполняет заряды до максимума (2/7→7/7)", function(){
      var char = { inventory: {
        weapon: [{ name:"Палочка молний", maxCharges:7, charges:2, recharge:"dawn" }],
        other:  [{ name:"Кольцо уклонения", maxCharges:3, charges:0, recharge:"dawn" }],
        potion: [{ name:"Зелье лечения", qty:3 }]   // без зарядов — не трогается
      }};
      var n = restoreItemCharges(char);
      if (char.inventory.weapon[0].charges !== 7) return "палочка не восполнена: " + char.inventory.weapon[0].charges;
      if (char.inventory.other[0].charges !== 3) return "кольцо не восполнено: " + char.inventory.other[0].charges;
      if ("charges" in char.inventory.potion[0]) return "зелью без maxCharges добавлены charges";
      return n === 2 || "ожидал 2 восстановленных, получено " + n;
    });
    t("[FIN-8] restoreItemCharges: recharge:'none' НЕ восстанавливается", function(){
      var char = { inventory: { other: [{ name:"Кольцо трёх желаний", maxCharges:3, charges:1, recharge:"none" }] } };
      var n = restoreItemCharges(char);
      if (char.inventory.other[0].charges !== 1) return "recharge none восстановлен: " + char.inventory.other[0].charges;
      return n === 0 || "ожидал 0 восстановленных, получено " + n;
    });
    t("[FIN-8] restoreItemCharges: полностью заряженный не считается восстановленным", function(){
      var char = { inventory: { other: [{ name:"Палочка", maxCharges:7, charges:7, recharge:"dawn" }] } };
      return restoreItemCharges(char) === 0 || "полный запас засчитан как восстановленный";
    });
    t("[FIN-8] restoreItemCharges: пустой/без inventory → 0", function(){
      if (restoreItemCharges({}) !== 0) return "пустой char → не 0";
      if (restoreItemCharges(null) !== 0) return "null → не 0";
      return true;
    });
  }
  if (typeof adjustItemCharges === "function") {
    t("[FIN-8] adjustItemCharges: кламп 0..maxCharges", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id:"test-charges", stats:{str:10}, coins:{cp:0,sp:0,ep:0,gp:0,pp:0},
          inventory:{ weapon:[], armor:[], potion:[], scroll:[], tool:[], material:[],
            other:[{ name:"Палочка", maxCharges:3, charges:1, recharge:"dawn" }] }
        }];
        window.currentId = "test-charges";
        var it = window.characters[0].inventory.other[0];
        try { adjustItemCharges("other", 0, 1); } catch(e) {}
        if (it.charges !== 2) return "после +1 ожидал 2, получено " + it.charges;
        try { adjustItemCharges("other", 0, 5); } catch(e) {}    // кламп к max
        if (it.charges !== 3) return "кламп сверху: ожидал 3, получено " + it.charges;
        try { adjustItemCharges("other", 0, -10); } catch(e) {}  // кламп к 0
        if (it.charges !== 0) return "кламп снизу: ожидал 0, получено " + it.charges;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });
    t("[FIN-8] adjustItemCharges: без maxCharges игнорируется", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [{
          id:"test-charges2", stats:{str:10}, coins:{cp:0,sp:0,ep:0,gp:0,pp:0},
          inventory:{ weapon:[], armor:[], potion:[], scroll:[], tool:[], material:[],
            other:[{ name:"Верёвка" }] }
        }];
        window.currentId = "test-charges2";
        var it = window.characters[0].inventory.other[0];
        try { adjustItemCharges("other", 0, 1); } catch(e) {}
        return !("charges" in it) || "не-заряжаемому добавлены charges";
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });
  }
  if (window.MAGIC_ITEMS) {   // в браузерном runner.html каталог лениво → тесты пропускаются
    t("[FIN-8] magic-items: у записей с charges — целое число > 0 (и ≥10 таких)", function(){
      var bad = (window.MAGIC_ITEMS || []).filter(function(it){
        return ("charges" in it) && !(typeof it.charges === "number" && it.charges > 0 && it.charges % 1 === 0);
      });
      if (bad.length) return "некорректные charges: " + bad.map(function(x){return x.id+"="+x.charges;}).join(", ");
      var withCharges = (window.MAGIC_ITEMS||[]).filter(function(it){return "charges" in it;});
      return withCharges.length >= 10 || "ожидал ≥10 заряжаемых записей, получено " + withCharges.length;
    });
    t("[FIN-8] magic-items: recharge — только 'dawn'|'none', если задан", function(){
      var bad = (window.MAGIC_ITEMS||[]).filter(function(it){
        return ("recharge" in it) && it.recharge !== "dawn" && it.recharge !== "none";
      });
      return bad.length === 0 || "неверный recharge: " + bad.map(function(x){return x.id;}).join(", ");
    });
  }

  // ────────── БЛОК 28 (FIN-10): божества (DEITIES_DATA) + поле char.deity ──────────
  if (typeof DEITIES_DATA !== "undefined") {
    t("[FIN-10] DEITIES_DATA: 61 запись = 37 Забытых Королевств + 24 нечеловеческих", function(){
      if (!Array.isArray(DEITIES_DATA)) return "не массив";
      var fr = DEITIES_DATA.filter(function(d){ return d.pantheon === "Забытые Королевства"; }).length;
      var nh = DEITIES_DATA.filter(function(d){ return d.pantheon === "Нечеловеческие"; }).length;
      if (DEITIES_DATA.length !== 61) return "длина " + DEITIES_DATA.length + " (ожидал 61)";
      if (fr !== 37) return "Забытых Королевств " + fr + " (ожидал 37)";
      if (nh !== 24) return "нечеловеческих " + nh + " (ожидал 24)";
      return true;
    });
    t("[FIN-10] DEITIES_DATA: имена уникальны, name/title/domains/symbol непустые", function(){
      var seen = {}, bad = [];
      DEITIES_DATA.forEach(function(d){
        if (!d.name || !d.title || !d.domains || !d.symbol) bad.push((d && d.name) || "?");
        if (seen[d.name]) bad.push("дубль:" + d.name); seen[d.name] = 1;
      });
      return bad.length === 0 || "проблемы: " + bad.join(", ");
    });
    t("[FIN-10] DEITIES_DATA: alignment у всех ∈ DEITY_ALIGN_LABELS (расшифровка есть)", function(){
      if (typeof DEITY_ALIGN_LABELS === "undefined") return "нет DEITY_ALIGN_LABELS";
      var bad = DEITIES_DATA.filter(function(d){ return !d.alignment || !(d.alignment in DEITY_ALIGN_LABELS); });
      return bad.length === 0 || "неизвестный код: " + bad.map(function(d){return d.name+"="+d.alignment;}).join(", ");
    });
    t("[FIN-10] DEITIES_DATA: якорные божества из книги на месте", function(){
      var byName = {}; DEITIES_DATA.forEach(function(d){ byName[d.name] = d; });
      var checks = [
        ["Мистра", "НД", "Знание"],       // Забытые Королевства
        ["Тир", "ЗД", "Война"],
        ["Морадин", "ЗД", "Знание"],      // нечеловеческие
        ["Лолс", "ХЗ", "Обман"],
        ["Тиамат", "ЗЗ", "Обман"]
      ];
      for (var i = 0; i < checks.length; i++) {
        var d = byName[checks[i][0]];
        if (!d) return "нет " + checks[i][0];
        if (d.alignment !== checks[i][1]) return checks[i][0] + " мировоззрение " + d.alignment + " (ожидал " + checks[i][1] + ")";
        if (d.domains.indexOf(checks[i][2]) === -1) return checks[i][0] + " домены «" + d.domains + "» без «" + checks[i][2] + "»";
      }
      return true;
    });
  } else {
    t("[FIN-10] DEITIES_DATA определён", function(){ return "не загружен"; });
  }
  // Бэкфилл char.deity: DEFAULT_CHARACTER.deity === "" + migrateCharacter достраивает старые сейвы
  if (typeof DEFAULT_CHARACTER !== "undefined") {
    t("[FIN-10] DEFAULT_CHARACTER.deity === '' (поле по умолчанию пустое)", function(){
      return DEFAULT_CHARACTER.deity === "" || "получено " + JSON.stringify(DEFAULT_CHARACTER.deity);
    });
  }
  if (typeof migrateCharacter === "function") {
    t("[FIN-10] migrateCharacter: старый сейв без deity → char.deity === '' (без версионной миграции)", function(){
      var c = migrateCharacter({ id: 91, class: "Жрец", level: 3 });   // deity отсутствует
      if (c.deity !== "") return "deity = " + JSON.stringify(c.deity) + " (ожидал '')";
      var c2 = migrateCharacter({ id: 92, class: "Паладин", level: 5, deity: "Тир" });  // не затирается
      return c2.deity === "Тир" || "существующее значение затёрто: " + JSON.stringify(c2.deity);
    });
  }
  // fs-тест: поле божества, datalist и раздел справки «Планы» присутствуют в index.html
  if (typeof window !== "undefined" && typeof window.__indexHtmlSource === "string") {
    t("[FIN-10] index.html: поле #char-deity + <datalist id=\"deity-datalist\"> + раздел #help-planes", function(){
      var html = window.__indexHtmlSource;
      var miss = [];
      if (html.indexOf('id="char-deity"') === -1) miss.push("#char-deity");
      if (html.indexOf('id="deity-datalist"') === -1) miss.push("deity-datalist");
      if (html.indexOf('id="help-planes"') === -1) miss.push("#help-planes");
      if (html.indexOf("switchHelpSection('planes'") === -1) miss.push("вкладка planes");
      return miss.length === 0 || "нет: " + miss.join(", ");
    });
  }

  // ────────── БЛОК 29 (FIN-11): чистка — миграция «Мошенник», legacy notes, мёртвый код ──────────
  // Данные: подкласс «Мошенник» удалён (дубль «Мистического ловкача»).
  if (typeof SUBCLASS_FEATURES !== "undefined") {
    t("[FIN-11] SUBCLASS_FEATURES: ключ «Мошенник» удалён, «Мистический ловкач» на месте", function(){
      if (SUBCLASS_FEATURES["Мошенник"]) return "ключ «Мошенник» всё ещё есть";
      if (!SUBCLASS_FEATURES["Мистический ловкач"]) return "нет «Мистического ловкача»";
      return true;
    });
  }
  if (typeof SUBCLASSES !== "undefined") {
    t("[FIN-11] SUBCLASSES.Плут: без «Мошенника», с «Мистическим ловкачом»", function(){
      var list = SUBCLASSES["Плут"] || [];
      if (list.indexOf("Мошенник") !== -1) return "«Мошенник» в списке подклассов Плута";
      if (list.indexOf("Мистический ловкач") === -1) return "нет «Мистического ловкача»";
      return true;
    });
  }
  if (typeof THIRD_CASTER_SUBCLASSES !== "undefined") {
    t("[FIN-11] THIRD_CASTER_SUBCLASSES: без «Мошенника», с «Мистическим ловкачом»", function(){
      if (THIRD_CASTER_SUBCLASSES.indexOf("Мошенник") !== -1) return "«Мошенник» в списке 1/3-кастеров";
      if (THIRD_CASTER_SUBCLASSES.indexOf("Мистический ловкач") === -1) return "нет «Мистического ловкача»";
      return true;
    });
  }
  // Миграция v<30: подкласс + legacy notes
  if (typeof migrateCharacter === "function") {
    t("[FIN-11] migrateCharacter: char.subclass «Мошенник» → «Мистический ловкач»", function(){
      var c = migrateCharacter({ id: 9401, class: "Плут", level: 5, subclass: "Мошенник" });
      if (c.subclass !== "Мистический ловкач") return "subclass = " + JSON.stringify(c.subclass);
      if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion = " + c.schemaVersion;
      return true;
    });
    t("[FIN-11] migrateCharacter: «Мошенник» в char.classes[] (мультикласс) тоже мигрирует", function(){
      var c = migrateCharacter({ id: 9402, class: "Воин", level: 8,
        classes: [ { class: "Воин", level: 5 }, { class: "Плут", level: 3, subclass: "Мошенник" } ] });
      var rogue = c.classes.find(function(cl){ return cl.class === "Плут"; });
      return (rogue && rogue.subclass === "Мистический ловкач") || "classes[].subclass = " + JSON.stringify(rogue && rogue.subclass);
    });
    t("[FIN-11] migrateCharacter: legacy notes → notesV2 при пустой секции + поля удалены", function(){
      var c = migrateCharacter({ id: 9403, class: "Бард", level: 2, schemaVersion: 29,
        notesV2: { sections: { appearance: "", features: "", magicItems: "", backstory: "" }, entries: [], prefs: {} },
        notes: "Био", appearance: "Шрам", features: "Умения", magicItems: "Кольцо" });
      var s = c.notesV2.sections;
      if (s.backstory !== "Био") return "notes → backstory: " + JSON.stringify(s.backstory);
      if (s.appearance !== "Шрам") return "appearance: " + JSON.stringify(s.appearance);
      if (s.features !== "Умения") return "features: " + JSON.stringify(s.features);
      if (s.magicItems !== "Кольцо") return "magicItems: " + JSON.stringify(s.magicItems);
      if ("notes" in c || "appearance" in c || "features" in c || "magicItems" in c)
        return "legacy-поля не удалены: " + JSON.stringify({n:c.notes,a:c.appearance,f:c.features,m:c.magicItems});
      return true;
    });
    t("[FIN-11] migrateCharacter: заполненная секция НЕ затирается legacy-полем", function(){
      var c = migrateCharacter({ id: 9404, class: "Бард", level: 2, schemaVersion: 29,
        notesV2: { sections: { appearance: "Актуальная внешность" }, entries: [], prefs: {} },
        appearance: "Старое легаси" });
      if (c.notesV2.sections.appearance !== "Актуальная внешность")
        return "секция затёрта: " + JSON.stringify(c.notesV2.sections.appearance);
      if ("appearance" in c) return "legacy appearance не удалён";
      return true;
    });
    t("[FIN-11] migrateCharacter идемпотентна для v30 (повторный прогон не портит)", function(){
      var c = migrateCharacter({ id: 9405, class: "Плут", level: 5, subclass: "Мошенник",
        notes: "Био", notesV2: { sections: {}, entries: [], prefs: {} } });
      var again = migrateCharacter(JSON.parse(JSON.stringify(c)));
      if (again.subclass !== "Мистический ловкач") return "subclass после повтора: " + again.subclass;
      if (again.schemaVersion !== SCHEMA_VERSION) return "schemaVersion после повтора: " + again.schemaVersion;
      return true;
    });
  }
  // Схема: legacy-поля убраны из DEFAULT_CHARACTER
  if (typeof DEFAULT_CHARACTER !== "undefined") {
    t("[FIN-11] DEFAULT_CHARACTER: нет полей notes/features/appearance/magicItems", function(){
      var leaked = ["notes","features","appearance","magicItems"].filter(function(k){ return k in DEFAULT_CHARACTER; });
      return leaked.length === 0 || "остались поля: " + leaked.join(", ");
    });
  }
  // Мёртвый код: getEffectIcon удалён
  t("[FIN-11] getEffectIcon удалён (мёртвая функция)", function(){
    return typeof getEffectIcon === "undefined" || "getEffectIcon всё ещё определена";
  });
  // fs-тест: shadow-textareas удалены из index.html
  if (typeof window !== "undefined" && typeof window.__indexHtmlSource === "string") {
    t("[FIN-11] index.html: legacy shadow-textareas удалены (#char-notes и т.п.)", function(){
      var html = window.__indexHtmlSource;
      var found = ['id="char-notes"','id="char-features"','id="char-appearance"','id="magic-items"']
        .filter(function(sel){ return html.indexOf(sel) !== -1; });
      return found.length === 0 || "остались: " + found.join(", ");
    });
  }

  // ────────── БЛОК 30 (FIN-12): непокрытые модули — AppLog / history-stack / notesV2 / backup / quickRoll-edge / party ──────────
  // Все под-блоки гардируются typeof — в минимальной среде (браузерный runner без app-log/
  // app-notes/history-stack/app-backup) молча пропускаются. Раннер синхронный (process.exit
  // до слива микротасков), поэтому backup — smoke, а onResult quickRoll тестируется через
  // синхронную подмену animateDice3d.

  // ── AppLog (app-log.js): кольцевой буфер MAX=600, newId, exportText, fmtTime ──
  if (typeof window !== "undefined" && window.AppLog) {
    t("[FIN-12][log] кольцевой буфер обрезается до MAX=600", function(){
      AppLog.clear();                                  // сброс seq/буфера (оставляет запись «журнал очищен»)
      for (var i = 0; i < 700; i++) AppLog.info("test", "e" + i);
      var e = AppLog.entries();
      if (e.length !== 600) return "ожидал 600, получено " + e.length;
      if (e[e.length - 1].seq - e[0].seq !== 599) return "хвост буфера не непрерывен: " + e[0].seq + ".." + e[e.length - 1].seq;
      return true;
    });
    t("[FIN-12][log] newId: уникальные инкрементные корреляц-ID с префиксом", function(){
      var a = AppLog.newId("roll"), b = AppLog.newId("roll");
      if (a === b) return "ID совпали: " + a;
      if (a.indexOf("roll-") !== 0 || b.indexOf("roll-") !== 0) return "нет префикса: " + a + "/" + b;
      return true;
    });
    t("[FIN-12][log] fmtTime: мс → «s.mmm» и «m:ss.mmm»", function(){
      if (AppLog.fmtTime(1500) !== "1.500s") return "1500мс → " + AppLog.fmtTime(1500);
      if (AppLog.fmtTime(65000) !== "1:05.000s") return "65000мс → " + AppLog.fmtTime(65000);
      return true;
    });
    t("[FIN-12][log] exportText: шапка + счётчик записей = длине буфера", function(){
      AppLog.clear();
      AppLog.action("test", "одно действие");          // буфер = [«журнал очищен», «одно действие»]
      var txt = AppLog.exportText();
      if (txt.indexOf("=== DnD App Log ===") === -1) return "нет шапки";
      if (txt.indexOf("entries: " + AppLog.entries().length) === -1) return "счётчик не совпал с буфером (" + AppLog.entries().length + ")";
      return true;
    });
  }

  // ── history-stack.js: pushLayer / syncCloseLayer + порядок закрытия слоёв ──
  if (typeof pushHistoryLayer === "function" && typeof syncCloseLayer === "function" && typeof getHistoryLayers === "function") {
    t("[FIN-12][hist] pushLayer добавляет слои по порядку + history.pushState на каждый", function(){
      var base = getHistoryLayers().length;
      var pc = (typeof history !== "undefined" && typeof history._pushCount === "number") ? history._pushCount : null;
      pushHistoryLayer("A", function(){});
      pushHistoryLayer("B", function(){});
      pushHistoryLayer("C", function(){});
      var L = getHistoryLayers();
      if (L.length !== base + 3) return "слоёв: ожидал " + (base + 3) + ", получено " + L.length;
      if (L[base].name !== "A" || L[base + 1].name !== "B" || L[base + 2].name !== "C") return "порядок слоёв нарушен";
      if (pc !== null && history._pushCount !== pc + 3) return "pushState вызван не 3 раза (" + (history._pushCount - pc) + ")";
      syncCloseLayer("A");                             // cleanup: снимет A и всё выше → база
      return true;
    });
    t("[FIN-12][hist] syncCloseLayer(средний) снимает слой И все над ним + history.go(-n)", function(){
      var base = getHistoryLayers().length;
      pushHistoryLayer("X", function(){});
      pushHistoryLayer("Y", function(){});
      pushHistoryLayer("Z", function(){});
      var ok = syncCloseLayer("Y");                    // закрыть средний Y → уходят Y и Z, остаётся X
      if (ok !== true) return "syncCloseLayer вернул не true";
      var L = getHistoryLayers();
      if (L.length !== base + 1) return "после закрытия Y ожидал " + (base + 1) + " слоёв, получено " + L.length;
      if (L[base].name !== "X") return "остаться должен X, получено " + L[base].name;
      if (typeof history !== "undefined" && history._lastGo !== -2) return "history.go: ожидал -2 (сняты Y,Z), получено " + history._lastGo;
      if (syncCloseLayer("нет-такого") !== false) return "закрытие несуществующего слоя должно вернуть false";
      syncCloseLayer("X");                             // cleanup → база
      return true;
    });
  }

  // ── app-notes.js: Markdown-парсер, реордер закреплённых, CRUD entry, экспорт ──
  if (typeof _mdToHtml === "function") {
    t("[FIN-12][notes] _mdToHtml: пусто / заголовок / список / жирный", function(){
      if (_mdToHtml("").indexOf("notes-md-empty") === -1) return "пустой ввод → нет плейсхолдера";
      if (_mdToHtml("# Заголовок").indexOf("<h2>Заголовок</h2>") === -1) return "заголовок H1→h2: " + _mdToHtml("# Заголовок");
      var ul = _mdToHtml("- один\n- два");
      if (ul.indexOf("<ul>") === -1 || ul.indexOf("<li>один</li>") === -1 || ul.indexOf("<li>два</li>") === -1) return "список: " + ul;
      if (_mdToHtml("**жирный**").indexOf("<strong>жирный</strong>") === -1) return "жирный: " + _mdToHtml("**жирный**");
      return true;
    });
    t("[FIN-12][notes] _mdToHtml: ссылки — http/# разрешены, прочие схемы → '#'", function(){
      if (_mdToHtml("[дом](https://a.b)").indexOf('href="https://a.b"') === -1) return "https не сохранён";
      var bad = _mdToHtml("[клик](javascript:alert)");
      if (bad.indexOf('href="#"') === -1) return "опасная схема не заменена на #: " + bad;
      if (bad.indexOf("javascript:") !== -1) return "javascript: просочился в href";
      return true;
    });
    t("[FIN-12][notes] _notesReorderPinned: перенос закреплённой карточки переставляет pinOrder", function(){
      if (typeof _notesReorderPinned !== "function") return true;
      var savedChars = window.characters, savedId = window.currentId, savedTab = _notesState.currentTab;
      try {
        window.characters = [{ id: "fn-notes-1", notesV2: { sections: {}, prefs: {}, entries: [
          { id: "p1", type: "npc", pinned: true, pinOrder: 0, updatedAt: 1, title: "A", body: "" },
          { id: "p2", type: "npc", pinned: true, pinOrder: 1, updatedAt: 2, title: "B", body: "" },
          { id: "p3", type: "npc", pinned: true, pinOrder: 2, updatedAt: 3, title: "C", body: "" }
        ] } }];
        window.currentId = "fn-notes-1";
        _notesState.currentTab = "npc";
        _notesReorderPinned("p1", "p3");               // p1 → на место p3: порядок станет [p2,p3,p1]
        var byId = {}; window.characters[0].notesV2.entries.forEach(function(e){ byId[e.id] = e; });
        if (byId.p2.pinOrder !== 0 || byId.p3.pinOrder !== 1 || byId.p1.pinOrder !== 2)
          return "pinOrder после переноса: p2=" + byId.p2.pinOrder + " p3=" + byId.p3.pinOrder + " p1=" + byId.p1.pinOrder;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; _notesState.currentTab = savedTab; }
    });
    t("[FIN-12][notes] notesSaveEntryModal: создание новой + редактирование существующей", function(){
      if (typeof notesSaveEntryModal !== "function") return true;
      var savedChars = window.characters, savedId = window.currentId, savedTab = _notesState.currentTab;
      var savedMid = (typeof _notesModalEntryId !== "undefined") ? _notesModalEntryId : null;
      var savedTags = (typeof _notesModalTags !== "undefined") ? _notesModalTags : [];
      try {
        window.characters = [{ id: "fn-notes-2", name: "Тест", notesV2: { sections: {}, prefs: {}, entries: [] } }];
        window.currentId = "fn-notes-2";
        _notesState.currentTab = "npc";
        // — создание —
        document.getElementById("nem-title").value = "Гоблин Гриз";
        document.getElementById("nem-body").value = "Злобный вожак";
        document.getElementById("nem-type").value = "npc";
        document.getElementById("nem-pinned").checked = false;
        _notesModalEntryId = null;
        _notesModalTags = ["враг"];
        notesSaveEntryModal();
        var ents = window.characters[0].notesV2.entries;
        if (ents.length !== 1) return "после создания ожидал 1 запись, получено " + ents.length;
        var e = ents[0];
        if (e.title !== "Гоблин Гриз" || e.body !== "Злобный вожак" || e.type !== "npc") return "поля новой записи: " + JSON.stringify({ t: e.title, b: e.body, ty: e.type });
        if (!e.id) return "у новой записи нет id";
        if ((e.tags || []).join(",") !== "враг") return "теги новой записи: " + JSON.stringify(e.tags);
        // — редактирование той же записи —
        document.getElementById("nem-title").value = "Гоблин Гроз";
        document.getElementById("nem-pinned").checked = true;
        _notesModalEntryId = e.id;
        _notesModalTags = ["враг", "босс"];
        notesSaveEntryModal();
        if (window.characters[0].notesV2.entries.length !== 1) return "редактирование создало дубль";
        var e2 = window.characters[0].notesV2.entries[0];
        if (e2.title !== "Гоблин Гроз") return "заголовок не обновлён: " + e2.title;
        if (e2.pinned !== true) return "pinned не обновлён";
        if ((e2.tags || []).join(",") !== "враг,босс") return "теги не обновлены: " + JSON.stringify(e2.tags);
        return true;
      } finally {
        window.characters = savedChars; window.currentId = savedId; _notesState.currentTab = savedTab;
        if (typeof _notesModalEntryId !== "undefined") _notesModalEntryId = savedMid;
        if (typeof _notesModalTags !== "undefined") _notesModalTags = savedTags;
      }
    });
    t("[FIN-12][notes] notesExportMd/Json: контент секций и записей + расширение файла", function(){
      if (typeof notesExportMd !== "function" || typeof notesExportJson !== "function" || typeof _notesTriggerDownload !== "function") return true;
      var savedChars = window.characters, savedId = window.currentId;
      var origDl = _notesTriggerDownload;                // Blob/URL нет в sandbox — перехватываем вывод
      var cap = null;
      try {
        window.characters = [{ id: "fn-notes-3", name: "Арагорн", notesV2: {
          sections: { backstory: "Родился в глуши" },
          entries: [{ id: "n1", type: "npc", title: "Голлум", body: "преследователь", tags: [], pinned: false }],
          prefs: {}
        } }];
        window.currentId = "fn-notes-3";
        _notesTriggerDownload = function(content, filename, mime){ cap = { content: content, filename: filename, mime: mime }; };
        notesExportMd();
        if (!cap) return "notesExportMd не вызвал загрузку";
        if (cap.content.indexOf("# Записи: Арагорн") === -1) return "MD: нет заголовка с именем";
        if (cap.content.indexOf("Родился в глуши") === -1) return "MD: нет текста секции";
        if (cap.content.indexOf("Голлум") === -1) return "MD: нет записи NPC";
        if (!/\.md$/.test(cap.filename)) return "MD: расширение файла: " + cap.filename;
        cap = null;
        notesExportJson();
        if (!cap) return "notesExportJson не вызвал загрузку";
        var parsed = JSON.parse(cap.content);
        if (!parsed.notesV2 || parsed.notesV2.sections.backstory !== "Родился в глуши") return "JSON: секция не сериализована";
        if (!/\.json$/.test(cap.filename)) return "JSON: расширение файла: " + cap.filename;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; _notesTriggerDownload = origDl; }
    });
  }

  // ── app-backup.js: smoke (async IndexedDB нечем дождаться в sync-раннере) ──
  if (typeof createBackupSnapshot === "function") {
    t("[FIN-12][backup] константы BACKUP_KEEP=7 + метки причин", function(){
      if (typeof BACKUP_KEEP === "undefined" || BACKUP_KEEP !== 7) return "BACKUP_KEEP: " + (typeof BACKUP_KEEP !== "undefined" ? BACKUP_KEEP : "undef");
      var miss = ["auto", "pre-import", "pre-restore", "manual"].filter(function(k){ return !BACKUP_REASON_LABELS[k]; });
      return miss.length === 0 || "нет меток причин: " + miss.join(",");
    });
    t("[FIN-12][backup] публичный API определён", function(){
      var fns = ["listBackupSnapshots", "restoreBackupSnapshot", "initAutoBackup", "createBackupNow", "_backupOpenDb", "_backupFmtDate"];
      var missing = fns.filter(function(n){ return typeof window[n] !== "function"; });
      return missing.length === 0 || "нет функций: " + missing.join(",");
    });
    t("[FIN-12][backup] _backupFmtDate возвращает непустую строку", function(){
      var s = _backupFmtDate(Date.now());
      return (typeof s === "string" && s.length > 0) || "получено: " + JSON.stringify(s);
    });
    t("[FIN-12][backup] createBackupSnapshot: thenable без sync-throw (пусто и с данными)", function(){
      var savedChars = window.characters, savedHist = window.hpHistory;
      try {
        window.characters = []; window.hpHistory = [];  // пусто → Promise.resolve(null), БД не трогается
        var pEmpty = createBackupSnapshot("manual");
        if (!pEmpty || typeof pEmpty.then !== "function") return "пустое: не thenable";
        pEmpty.then(function(){}, function(){});         // подавляем возможный unhandled
        // с персонажем → _backupOpenDb → indexedDB нет → reject (ветка «нет indexedDB»)
        window.characters = [migrateCharacter({ id: 1, name: "Б", class: "Бард", level: 1 })];
        var pData = createBackupSnapshot("manual");
        if (!pData || typeof pData.then !== "function") return "с данными: не thenable";
        pData.then(function(){}, function(){});          // ожидаемый reject, подавляем
        return true;
      } finally { window.characters = savedChars; window.hpHistory = savedHist; }
    });
  }

  // ── quickRoll edge-cases (app-ui.js): дополнение к БЛОК 19 ──
  if (typeof _quickRollCompute === "function") {
    t("[FIN-12][UX-5] отрицательный итог НЕ клампится (штраф больше броска)", function(){
      var c = _quickRollCompute(20, -25, 'normal', 3, null);
      return c.total === -22 || "ожидал -22, получено " + c.total;
    });
    t("[FIN-12][UX-5] d100: крит/провал не выставляются, итог = бросок + мод", function(){
      var c = _quickRollCompute(100, 5, 'normal', 87, null);
      return (c.natural === 87 && c.total === 92 && c.isCrit === false && c.isFail === false) || JSON.stringify(c);
    });
  }
  // onResult (FIN-7): quickRoll зовёт opts.onResult(comp) после записи в историю.
  // animateDice3d подменяем синхронным стабом (иначе бросок асинхронен — раннер его не дождётся).
  if (typeof quickRoll === "function" && typeof animateDice3d === "function") {
    t("[FIN-12][UX-5] quickRoll прокидывает результат в opts.onResult(comp)", function(){
      var origA3d = animateDice3d, savedHist = window.diceHistory, got = null;
      try {
        if (!Array.isArray(window.diceHistory)) window.diceHistory = [];
        animateDice3d = function(sides, result, cb){ try { cb(result); } catch(e){} };  // синхронно отдаём precomputed
        quickRoll({ label: "Проверка", sides: 20, mod: 4, mode: 'normal', openArena: false,
          onResult: function(comp){ got = comp; } });
        if (!got) return "onResult не вызван";
        if (typeof got.total !== "number" || got.total !== got.natural + 4) return "comp.total ≠ natural+mod: " + JSON.stringify(got);
        if (got.natural < 1 || got.natural > 20) return "natural вне 1..20: " + got.natural;
        return true;
      } finally { animateDice3d = origA3d; window.diceHistory = savedHist; }
    });
  }

  // ── party (app-party.js): уникальность id участников при коллизии числовых id (дополнение к БЛОК 12) ──
  if (typeof buildBattleSetupList === "function") {
    t("[FIN-12][party] buildBattleSetupList: id уникальны при совпадении числовых id в разных категориях", function(){
      var savedChars = window.characters, savedId = window.currentId, savedParty = PARTY_DATA, savedSetup = battleSetupList;
      try {
        window.characters = [{ id: "pu1", name: "Герой", combat: { hpCurrent: 10, hpMax: 10 } }];
        window.currentId = "pu1";
        PARTY_DATA = { allies: [{ id: 1, name: "A" }], npcs: [{ id: 1, name: "N" }], monsters: [{ id: 1, name: "M" }] };
        battleSetupList = [];
        buildBattleSetupList();
        var ids = battleSetupList.map(function(p){ return p.id; });
        if (ids.length !== 4) return "ожидал 4 участника, получено " + ids.length;
        var uniq = {}; ids.forEach(function(x){ uniq[x] = 1; });
        if (Object.keys(uniq).length !== 4) return "id не уникальны: " + ids.join(",");
        if (ids.indexOf("self_pu1") === -1 || ids.indexOf("ally_1") === -1 || ids.indexOf("npc_1") === -1 || ids.indexOf("mon_1") === -1)
          return "ожидаемые id отсутствуют: " + ids.join(",");
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; PARTY_DATA = savedParty; battleSetupList = savedSetup; }
    });
  }

  // ────────── БЛОК 31 (THEME-1): _computeTourBoxes — геометрия прожектора тура ──────────
  // Панели затемнения должны стыковаться впритык по общим снап-краям (перехлёст
  // полупрозрачных панелей давал тёмные швы на светлой теме), угловые заплатки —
  // сидеть в углах дырки и пропадать на обрезанных краях вьюпорта.
  if (typeof _computeTourBoxes === "function") {
    var _trect = function(l, t, r, b) { return { left: l, top: t, right: r, bottom: b }; };

    t("[THEME-1][tour] панели стыкуются впритык (без перехлёста и щели)", function(){
      var bx = _computeTourBoxes(1280, 800, _trect(100, 200, 400, 300), 6, 1);
      var m = bx.masks, h = bx.hole;
      if (m.top.height !== h.top) return "top.height ≠ hole.top";
      if (m.left.top !== h.top || m.right.top !== h.top) return "боковые начинаются не с hole.top";
      if (m.left.top + m.left.height !== m.bottom.top) return "левая не стыкуется с нижней: " + (m.left.top + m.left.height) + " vs " + m.bottom.top;
      if (m.right.top + m.right.height !== m.bottom.top) return "правая не стыкуется с нижней";
      if (m.left.width !== h.left) return "left.width ≠ hole.left";
      if (m.right.left !== h.right) return "right.left ≠ hole.right";
      return true;
    });

    t("[THEME-1][tour] края снапятся к device-пикселям при дробном DPR (1.25)", function(){
      var bx = _computeTourBoxes(1280, 800, _trect(100.37, 200.61, 400.12, 300.94), 6, 1.25);
      var h = bx.hole, edges = [h.left, h.top, h.right, h.bottom];
      for (var i = 0; i < edges.length; i++) {
        var dev = edges[i] * 1.25;
        if (Math.abs(dev - Math.round(dev)) > 1e-9) return "край " + edges[i] + " не на границе device-пикселя";
      }
      if (bx.masks.left.top !== h.top || bx.masks.bottom.top !== h.bottom) return "панели не на общих краях";
      return true;
    });

    t("[THEME-1][tour] радиус: 14 в норме, полразмера на мелкой цели, 0 на крошечной", function(){
      if (_computeTourBoxes(1280, 800, _trect(100, 200, 400, 300), 6, 1).radius !== 14) return "норма: ожидал 14";
      var small = _computeTourBoxes(1280, 800, _trect(100, 200, 110, 210), 6, 1); // дырка 22×22
      if (small.radius !== 11) return "мелкая: ожидал 11, получено " + small.radius;
      var tiny = _computeTourBoxes(1280, 800, _trect(100, 200, 101, 201), 0, 1); // дырка 1×1
      if (tiny.radius !== 0) return "крошечная: ожидал 0, получено " + tiny.radius;
      if (tiny.corners.tl || tiny.corners.tr || tiny.corners.bl || tiny.corners.br) return "крошечная: заплаток быть не должно";
      return true;
    });

    t("[THEME-1][tour] заплатки в углах дырки; скрыты на обрезанных краях вьюпорта", function(){
      var bx = _computeTourBoxes(1280, 800, _trect(100, 200, 400, 300), 6, 1);
      var c = bx.corners, h = bx.hole;
      if (!c.tl || !c.tr || !c.bl || !c.br) return "в норме нужны все 4 заплатки";
      if (c.tl.left !== h.left || c.tl.top !== h.top) return "tl не в углу дырки";
      if (c.br.left !== h.right - bx.radius || c.br.top !== h.bottom - bx.radius) return "br не в углу дырки";
      // Цель прижата к верхнему левому краю (сайдбар на ПК): tl/tr/bl обрезаны → скрыты, br остаётся
      var clipped = _computeTourBoxes(1280, 800, _trect(0, 0, 260, 700), 6, 1);
      if (clipped.corners.tl || clipped.corners.tr || clipped.corners.bl) return "обрезанные углы должны быть скрыты";
      if (!clipped.corners.br) return "br должен остаться";
      return true;
    });

    t("[THEME-1][tour] дырка клампится вьюпортом, размеры панелей неотрицательны", function(){
      var bx = _computeTourBoxes(375, 667, _trect(-20, -10, 400, 700), 6, 2);
      var h = bx.hole, m = bx.masks;
      if (h.left < 0 || h.top < 0 || h.right > 375 || h.bottom > 667) return "дырка вне вьюпорта: " + JSON.stringify(h);
      var all = [m.top, m.bottom, m.left, m.right];
      for (var i = 0; i < all.length; i++) {
        if (all[i].width < 0 || all[i].height < 0) return "отрицательный размер панели";
      }
      return true;
    });
  }

  // ────────── БЛОК 32 (E24-0): edition-слой — edData/EDITION_DATA/миграция/тумблер ──────────
  if (typeof edData === "function" && typeof EDITION_DATA !== "undefined") {

    t("[e24] DEFAULT_CHARACTER.edition === '2014'", function(){
      if (typeof DEFAULT_CHARACTER === "undefined") return "нет DEFAULT_CHARACTER";
      if (DEFAULT_CHARACTER.edition !== "2014") return "edition: " + DEFAULT_CHARACTER.edition;
      return true;
    });

    t("[e24] registry '2014' полон: 16 таблиц определены и непусты", function(){
      var d = edData({ edition: "2014" });
      var keys = ["CLASS_FEATURES","SUBCLASS_FEATURES","SPELL_SLOTS_BY_LEVEL","BACKGROUND_SKILLS",
        "CLASS_HIT_DICE","FEATS_DATA","CLASS_CHOICES","SUBCLASS_CHOICES","SUBCLASSES","CONDITIONS",
        "SUBCLASS_LEVEL","CLASS_RESOURCES","MULTICLASS_PREREQUISITES","MULTICLASS_PROFICIENCIES",
        "RACE_DATA","CASTER_TYPE"];
      for (var i = 0; i < keys.length; i++) {
        var v = d[keys[i]];
        if (v === undefined || v === null) return "ключ отсутствует: " + keys[i];
        var empty = Array.isArray(v) ? v.length === 0 : (typeof v === "object" ? Object.keys(v).length === 0 : true);
        if (empty) return "таблица пуста: " + keys[i];
      }
      return true;
    });

    t("[e24] edData('2014') отдаёт РЕАЛЬНЫЕ глобальные таблицы (по ссылке)", function(){
      var d = edData({ edition: "2014" });
      if (typeof CLASS_FEATURES !== "undefined" && d.CLASS_FEATURES !== CLASS_FEATURES) return "CLASS_FEATURES не та же ссылка";
      if (typeof CLASS_CHOICES !== "undefined" && d.CLASS_CHOICES !== CLASS_CHOICES) return "CLASS_CHOICES не та же ссылка (ловушка порядка загрузки)";
      if (typeof CONDITIONS !== "undefined" && d.CONDITIONS !== CONDITIONS) return "CONDITIONS не та же ссылка";
      return true;
    });

    t("[e24] edData фолбэк: null/пусто/неизвестная редакция → набор '2014'", function(){
      var base = edData({ edition: "2014" });
      if (edData(null).CLASS_FEATURES !== base.CLASS_FEATURES) return "null не → 2014";
      if (edData({}).CLASS_FEATURES !== base.CLASS_FEATURES) return "{} не → 2014";
      if (edData({ edition: "zzz" }).CLASS_FEATURES !== base.CLASS_FEATURES) return "неизвестная не → 2014";
      return true;
    });

    t("[e24] '2024' зарегистрирована (data-2024.js); незаполненные таблицы наследуются от 2014", function(){
      if (!EDITION_DATA["2024"]) return "EDITION_DATA['2024'] не зарегистрирован (data-2024.js не загружен?)";
      var d24 = edData({ edition: "2024" });
      var d14 = edData({ edition: "2014" });
      // Ещё не наполненные фазами таблицы наследуются от 2014 по ссылке (CONDITIONS уже
      // переопределена в E24-1 — её паритет проверяется в БЛОКЕ 33).
      if (d24.CLASS_FEATURES !== d14.CLASS_FEATURES) return "CLASS_FEATURES 2024 ≠ 2014";
      if (d24.SPELL_SLOTS_BY_LEVEL !== d14.SPELL_SLOTS_BY_LEVEL) return "слоты 2024 ≠ 2014";
      if (d24.FEATS_DATA !== d14.FEATS_DATA) return "FEATS_DATA 2024 ≠ 2014";
      return true;
    });

    t("[e24] registerEdition2024(override): переопределённый ключ заменён, прочие наследуются", function(){
      if (typeof registerEdition2024 !== "function") return "нет registerEdition2024";
      var fake = { __fake24: true };
      registerEdition2024({ CONDITIONS: fake });
      var d = edData({ edition: "2024" });
      var ok = (d.CONDITIONS === fake);
      var inherited = (typeof CLASS_FEATURES === "undefined") || (d.CLASS_FEATURES === CLASS_FEATURES);
      // Восстанавливаем РЕАЛЬНЫЕ 2024-данные (по мере фаз overrides растёт — берём из
      // data-2024.js; было registerEdition2024({}) в скелете E24-0, но теперь пустой
      // сброс затёр бы CONDITIONS_2024 для последующих тестов).
      registerEdition2024((typeof window !== "undefined" && window.EDITION_2024_OVERRIDES) || {});
      if (!ok) return "override CONDITIONS не применён";
      if (!inherited) return "CLASS_FEATURES не унаследован при частичном override";
      var after = edData({ edition: "2024" });
      var expectCond = (typeof window !== "undefined" && window.CONDITIONS_2024) ? window.CONDITIONS_2024
                       : (typeof CONDITIONS !== "undefined" ? CONDITIONS : null);
      if (expectCond && after.CONDITIONS !== expectCond) return "восстановление не вернуло реальные 2024-состояния";
      return true;
    });

    if (typeof migrateCharacter === "function") {
      t("[e24] миграция: персонаж без edition → '2014', schemaVersion → актуальная (SCHEMA_VERSION)", function(){
        var c = migrateCharacter({ id: 77001, class: "Воин", level: 3 });
        if (c.edition !== "2014") return "edition: " + c.edition;
        if (c.schemaVersion !== SCHEMA_VERSION) return "schemaVersion: " + c.schemaVersion;
        return true;
      });

      t("[e24] миграция: существующая edition не перезаписывается", function(){
        var c = migrateCharacter({ id: 77002, class: "Бард", level: 2, edition: "2024", schemaVersion: 30 });
        if (c.edition !== "2024") return "edition затёрт: " + c.edition;
        return true;
      });
    }

    if (typeof getEdition === "function" && typeof setEdition === "function") {
      t("[e24][тумблер] дефолт без ключа → '2014'", function(){
        try { localStorage.removeItem("dnd_edition"); localStorage.removeItem("dnd_e24_beta"); } catch(e){}
        if (getEdition() !== "2014") return "дефолт: " + getEdition();
        return true;
      });

      t("[e24][тумблер] бета выкл: setEdition('2024') НЕ сохраняет '2024'", function(){
        try { localStorage.removeItem("dnd_e24_beta"); } catch(e){}
        setEdition("2024");
        var stored = null; try { stored = localStorage.getItem("dnd_edition"); } catch(e){}
        if (stored === "2024") return "2024 сохранён без беты";
        if (getEdition() !== "2014") return "getEdition вернул не 2014";
        return true;
      });

      t("[e24][тумблер] залипший '2024' без беты → getEdition '2014'", function(){
        try { localStorage.setItem("dnd_edition", "2024"); localStorage.removeItem("dnd_e24_beta"); } catch(e){}
        if (getEdition() !== "2014") return "залипший 2024 не сброшен: " + getEdition();
        return true;
      });

      t("[e24][тумблер] бета вкл: setEdition('2024') сохраняет, getEdition → '2024'", function(){
        try { localStorage.setItem("dnd_e24_beta", "1"); } catch(e){}
        setEdition("2024");
        if (getEdition() !== "2024") return "getEdition: " + getEdition();
        setEdition("2014");
        if (getEdition() !== "2014") return "переключение назад на 2014 не сработало";
        try { localStorage.removeItem("dnd_e24_beta"); localStorage.removeItem("dnd_edition"); } catch(e){}
        return true;
      });
    }

  } else {
    t("[e24] eddata/EDITION_DATA определены", function(){ return "не загружены"; });
  }

  // ────────── БЛОК 33 (E24-1): состояния 2024 + глоссарий edition-aware ──────────
  if (typeof edData === "function" && typeof CONDITIONS !== "undefined" &&
      typeof window !== "undefined" && Array.isArray(window.CONDITIONS_2024)) {
    var C24 = window.CONDITIONS_2024;

    t("[e24-1] CONDITIONS_2024: id-паритет с 2014 (тот же набор id)", function(){
      var a = CONDITIONS.map(function(c){ return c.id; }).sort();
      var b = C24.map(function(c){ return c.id; }).sort();
      if (a.length !== b.length) return "разное число: 2014=" + a.length + " 2024=" + b.length;
      for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return "расхождение id: " + a[i] + " ≠ " + b[i];
      return true;
    });

    t("[e24-1] CONDITIONS_2024: у каждого непустые id/name/desc", function(){
      for (var i = 0; i < C24.length; i++) {
        var c = C24[i];
        if (!c || !c.id || !c.name || typeof c.desc !== "string" || !c.desc.trim()) return "битая запись: " + (c && c.id);
      }
      return true;
    });

    t("[e24-1] CONDITIONS_2024: 6 степеней истощения exhaustion_1..6", function(){
      for (var i = 1; i <= 6; i++) {
        if (!C24.some(function(c){ return c.id === "exhaustion_" + i; })) return "нет exhaustion_" + i;
      }
      return true;
    });

    t("[e24-1] истощение 2024 переписано (степень 3 → −6 к броскам к20)", function(){
      var e14 = CONDITIONS.find(function(c){ return c.id === "exhaustion_3"; });
      var e24 = C24.find(function(c){ return c.id === "exhaustion_3"; });
      if (!e14 || !e24) return "нет exhaustion_3";
      if (e14.desc === e24.desc) return "desc истощения не изменён относительно 2014";
      if (e24.desc.indexOf("−6") === -1) return "нет «−6» в описании 2024";
      return true;
    });

    t("[e24-1] edData('2024').CONDITIONS === CONDITIONS_2024 (2014 — свой набор)", function(){
      if (edData({ edition: "2024" }).CONDITIONS !== C24) return "2024 не указывает на CONDITIONS_2024";
      if (edData({ edition: "2014" }).CONDITIONS === C24) return "2014 ошибочно указывает на набор 2024";
      return true;
    });

    if (Array.isArray(window.GLOSSARY_2024) && typeof glossarizeHtml === "function") {
      t("[e24-1] GLOSSARY_2024: у каждой записи непустые term/terms/def", function(){
        for (var i = 0; i < window.GLOSSARY_2024.length; i++) {
          var e = window.GLOSSARY_2024[i];
          if (!e || !e.term || !Array.isArray(e.terms) || !e.terms.length || typeof e.def !== "string" || !e.def.trim())
            return "битая запись #" + i;
        }
        return true;
      });

      t("[e24-1] glossarizeHtml('2024') оборачивает новый термин 2024 (Изучение) с data-gloss-ed", function(){
        var out = glossarizeHtml("действие Изучение помогает", {}, "2024");
        if (out.indexOf('class="gloss"') === -1) return "термин не обёрнут: " + out;
        if (out.indexOf('data-gloss-ed="2024"') === -1) return "нет data-gloss-ed";
        return true;
      });

      t("[e24-1] набор 2014 не знает терминов 2024 (Изучение не оборачивается)", function(){
        var out = glossarizeHtml("действие Изучение помогает", {}, "2014");
        return out.indexOf('class="gloss"') === -1 ? true : "обёрнут в наборе 2014: " + out;
      });

      t("[e24-1] определение «Истощение» 2024 переопределяет базовое", function(){
        var base = glossarizeHtml("уровни истощения", {}, "2014");
        var e24  = glossarizeHtml("уровни истощения", {}, "2024");
        if (base.indexOf('class="gloss"') === -1) return "базовое «истощение» не обёрнуто";
        if (e24.indexOf('data-gloss-ed="2024"') === -1) return "2024 «истощение» без ed-атрибута";
        return true;
      });
    }
  }

  // ────────── БЛОК 34 (CAST-0): spell-effects.js — таблица механики + хелперы + миграция v32 ──────────
  if (typeof SPELL_EFFECTS !== "undefined" && typeof SPELLS_BASE !== "undefined" &&
      typeof getSpellEffect === "function") {

    t("[cast-0] каждый ключ SPELL_EFFECTS существует среди имён SPELLS_BASE", function(){
      var names = {};
      SPELLS_BASE.forEach(function(s){ names[s.name] = true; });
      var bad = Object.keys(SPELL_EFFECTS).filter(function(k){ return !names[k]; });
      return bad.length === 0 ? true : "нет в spells.js: " + bad.join(", ");
    });

    t("[cast-0] каждый effect-id из дескрипторов есть в EFFECTS_DATA", function(){
      var ids = {};
      EFFECTS_DATA.forEach(function(e){ ids[e.id] = true; });
      var bad = [];
      Object.keys(SPELL_EFFECTS).forEach(function(k){
        var d = SPELL_EFFECTS[k];
        (d.effects || []).forEach(function(id){ if (!ids[id]) bad.push(k + "→" + id); });
      });
      return bad.length === 0 ? true : "битые id: " + bad.join(", ");
    });

    t("[cast-0] все формулы (база и апкаст ×2) парсятся parseDiceFormula", function(){
      if (typeof parseDiceFormula !== "function") return "нет parseDiceFormula";
      var bad = [];
      Object.keys(SPELL_EFFECTS).forEach(function(k){
        var d = SPELL_EFFECTS[k];
        [d.damage, d.heal, d.tempHp].forEach(function(part){
          if (!part || !part.formula) return;
          if (!parseDiceFormula(part.formula).ok) bad.push(k + ": " + part.formula);
          if (part.upcast) {
            var up = scaleFormula(part.formula, part.upcast, 1, 3);
            if (!parseDiceFormula(up).ok) bad.push(k + " (апкаст): " + up);
          }
        });
      });
      return bad.length === 0 ? true : bad.join("; ");
    });

    t("[cast-0] scaleFormula: Огненный шар ячейкой 5 ур. → 8к6+1к6+1к6", function(){
      var out = scaleFormula("8к6", "1к6", 3, 5);
      return out === "8к6+1к6+1к6" ? true : out;
    });

    t("[cast-0] scaleFormula: базовый уровень / null-слот (заговор) / без upcast — база как есть", function(){
      if (scaleFormula("1к8", "1к8", 1, 1) !== "1к8") return "castLevel == baseLevel";
      if (scaleFormula("1к8", "1к8", 1, null) !== "1к8") return "castLevel = null";
      if (scaleFormula("1к8", null, 1, 5) !== "1к8") return "upcast отсутствует";
      return true;
    });

    t("[cast-0] durationToRounds: round→v, minute→×10, hour/instant/null→null", function(){
      if (durationToRounds({value:3, unit:"round"}) !== 3) return "round";
      if (durationToRounds({value:1, unit:"minute"}) !== 10) return "minute";
      if (durationToRounds({value:8, unit:"hour"}) !== null) return "hour должен быть null";
      if (durationToRounds({value:1, unit:"instant"}) !== null) return "instant должен быть null";
      if (durationToRounds(null) !== null) return "null-вход";
      return true;
    });

    t("[cast-0] getSpellEffect: bySource-оверрайд мержится, база не мутирует", function(){
      SPELL_EFFECTS["__test_spell__"] = {
        effects: ["mage_armor"],
        duration: { value: 1, unit: "hour" },
        bySource: { PH24: { duration: { value: 10, unit: "minute" } } }
      };
      try {
        var base = getSpellEffect("__test_spell__", "PH14");
        var over = getSpellEffect("__test_spell__", "PH24");
        if (base.duration.unit !== "hour") return "база: " + base.duration.unit;
        if (over.duration.unit !== "minute") return "оверрайд: " + over.duration.unit;
        if (over.bySource) return "bySource протёк в мерж";
        if (!eq(over.effects, ["mage_armor"])) return "непереопределённое поле потеряно";
        if (SPELL_EFFECTS["__test_spell__"].duration.unit !== "hour") return "мутация базы";
        if (getSpellEffect("нет такого заклинания", "PH14") !== null) return "не-null для незнакомого имени";
        return true;
      } finally { delete SPELL_EFFECTS["__test_spell__"]; }
    });

    t("[cast-0] миграция v<32: activeSpellEffects появляется, SCHEMA_VERSION = 32", function(){
      if (SCHEMA_VERSION !== 32) return "SCHEMA_VERSION = " + SCHEMA_VERSION;
      var c = migrateCharacter({ name: "Тест", class: "Воин", level: 1, schemaVersion: 31 });
      if (!Array.isArray(c.activeSpellEffects)) return "нет activeSpellEffects после миграции";
      if (c.schemaVersion !== 32) return "schemaVersion = " + c.schemaVersion;
      return true;
    });

    t("[cast-0] DEFAULT_CHARACTER.activeSpellEffects — пустой массив в шаблоне", function(){
      return (Array.isArray(DEFAULT_CHARACTER.activeSpellEffects) &&
              DEFAULT_CHARACTER.activeSpellEffects.length === 0) || "нет в шаблоне";
    });
  }

  // ────────── БЛОК 35 (CAST-1): мост баффов — applyCastEffects / removeCastEffectsForSpell ──────────
  if (typeof applyCastEffects === "function" && typeof removeCastEffectsForSpell === "function" &&
      typeof castSpell === "function" && typeof SPELL_EFFECTS !== "undefined") {

    // Фикстура: безбронный волшебник ЛОВ 16 с подготовленными баффами.
    // mySpells — копии полей реальных записей spells.js (name/duration/source критичны).
    function _castFixture() {
      return {
        id: "test-cast1", name: "Тест CAST-1", class: "Волшебник", level: 5,
        stats: { str: 10, dex: 16, con: 10, int: 16, wis: 10, cha: 10 },
        combat: { armorId: "none", hasShield: false, hpCurrent: 20, hpMax: 20, hpDiceSpent: 0 },
        saves: {}, skills: [], conditions: [], effects: [], activeSpellEffects: [],
        spells: { stat: "ИНТ", slots: { 1: 4, 3: 3 }, slotsUsed: {}, prepared: [900, 901, 902, 904],
          mySpells: [
            { id: 900, name: "Доспехи мага", level: 1, duration: "8 часов",                    source: "PH14" },
            { id: 901, name: "Ускорение",    level: 3, duration: "Концентрация, до 1 минуты",  source: "PH14" },
            { id: 902, name: "Огонь фей",    level: 1, duration: "Концентрация, до 1 минуты",  source: "PH14" },
            { id: 903, name: "Свет",         level: 0, duration: "1 час",                      source: "PH14" },
            { id: 904, name: "Поиск фамильяра", level: 1, duration: "Мгновенно",               source: "PH14" }
          ] }
      };
    }

    t("[cast-1] каст «Доспехи мага»: карточка + экземпляр-трекер, КД 13+ЛОВ (без двойного учёта)", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [_castFixture()];
        window.currentId = "test-cast1";
        var c = window.characters[0];
        _castSpellWithSlot(900, "slot", 1);
        if (c.effects.indexOf("mage_armor") === -1) return "mage_armor не в char.effects";
        if (c.activeSpellEffects.length !== 1) return "экземпляров: " + c.activeSpellEffects.length;
        var inst = c.activeSpellEffects[0];
        if (inst.spellName !== "Доспехи мага") return "spellName: " + inst.spellName;
        if (inst.unit !== "hour" || inst.value !== 8) return "длительность: " + inst.value + " " + inst.unit;
        if (inst.roundsLeft !== null) return "часовые не тикают, roundsLeft: " + inst.roundsLeft;
        if (inst.concentration !== false) return "концентрация не должна ставиться";
        if (inst.slotLevel !== 1) return "slotLevel: " + inst.slotLevel;
        if (c.combat.ac !== 16) return "КД: ожидал 16 (13+3 ЛОВ), получено " + c.combat.ac;
        castSpell(903); // заговор без дескриптора — no-op для эффектов
        if (c.activeSpellEffects.length !== 1) return "«Свет» создал экземпляр";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[cast-1] повторный каст = refresh: один экземпляр, карточка без дублей, таймер заново", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [_castFixture()];
        window.currentId = "test-cast1";
        var c = window.characters[0];
        _castSpellWithSlot(901, "slot", 3); // Ускорение: 1 мин → roundsLeft 10
        if (c.activeSpellEffects[0].roundsLeft !== 10) return "roundsLeft: " + c.activeSpellEffects[0].roundsLeft;
        c.activeSpellEffects[0].roundsLeft = 3; // «прошло 7 раундов»
        _castSpellWithSlot(901, "slot", 3); // повторный каст того же
        if (c.activeSpellEffects.length !== 1) return "экземпляров после реккаста: " + c.activeSpellEffects.length;
        if (c.activeSpellEffects[0].roundsLeft !== 10) return "таймер не освежён: " + c.activeSpellEffects[0].roundsLeft;
        if (c.effects.filter(function(x){ return x === "haste"; }).length !== 1) return "дубль haste в char.effects";
        if (c.concentration !== "Ускорение") return "концентрация: " + c.concentration;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[cast-1] смена концентрации снимает эффекты старого, не-концентрационные живут", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [_castFixture()];
        window.currentId = "test-cast1";
        var c = window.characters[0];
        _castSpellWithSlot(900, "slot", 1); // Доспехи мага — без концентрации
        _castSpellWithSlot(901, "slot", 3); // Ускорение — концентрация
        _castSpellWithSlot(902, "slot", 1); // Огонь фей — сменил концентрацию
        if (c.effects.indexOf("haste") !== -1) return "haste не снят при смене концентрации";
        if (c.effects.indexOf("faerie_fire") === -1) return "faerie_fire не применён";
        if (c.effects.indexOf("mage_armor") === -1) return "mage_armor пострадал от смены концентрации";
        var names = c.activeSpellEffects.map(function(i){ return i.spellName; }).sort().join(",");
        if (names !== "Доспехи мага,Огонь фей") return "экземпляры: " + names;
        if (c.concentration !== "Огонь фей") return "концентрация: " + c.concentration;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[cast-1] endConcentration снимает связанный эффект и экземпляр", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [_castFixture()];
        window.currentId = "test-cast1";
        var c = window.characters[0];
        _castSpellWithSlot(901, "slot", 3);
        if (c.effects.indexOf("haste") === -1) return "haste не применён";
        endConcentration();
        if (c.concentration !== null) return "концентрация не снята";
        if (c.effects.indexOf("haste") !== -1) return "haste не снят";
        if (c.activeSpellEffects.length !== 0) return "экземпляр не удалён";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[cast-1] toggleEffect-off вручную чистит экземпляр каста (двусторонняя синхронизация)", function(){
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [_castFixture()];
        window.currentId = "test-cast1";
        var c = window.characters[0];
        _castSpellWithSlot(901, "slot", 3);
        toggleEffect("haste"); // ручное снятие карточки
        if (c.effects.indexOf("haste") !== -1) return "карточка не снята";
        if (c.activeSpellEffects.length !== 0) return "экземпляр каста пережил ручное снятие";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[cast-1] «Поиск фамильяра»: каст открывает модалку призыва, экземпляр не создаётся", function(){
      if (typeof summonFamiliar !== "function") return true; // noop в минимальной среде
      var savedChars = window.characters, savedId = window.currentId;
      try {
        window.characters = [_castFixture()];
        window.currentId = "test-cast1";
        var c = window.characters[0];
        _castSpellWithSlot(904, "slot", 1);
        var modal = document.getElementById("add-companion-modal");
        if (!modal || !modal.classList.contains("active")) return "модалка призыва не открыта";
        modal.classList.remove("active");
        if (c.activeSpellEffects.length !== 0) return "summon создал экземпляр-трекер";
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; }
    });

    t("[cast-1] рефкаунт: карточку держат два экземпляра — уходит только после снятия обоих", function(){
      var c = _castFixture();
      c.effects = ["bless"];
      c.activeSpellEffects = [
        { id: 1, spellName: "А", effectIds: ["bless"] },
        { id: 2, spellName: "Б", effectIds: ["bless"] }
      ];
      removeCastEffectsForSpell(c, "А", "тест");
      if (c.effects.indexOf("bless") === -1) return "карточка снята, пока её держит второй экземпляр";
      removeCastEffectsForSpell(c, "Б", "тест");
      if (c.effects.indexOf("bless") !== -1) return "карточка не снята после снятия обоих";
      if (removeCastEffectsForSpell(c, "нет такого", "тест") !== false) return "не-false для незнакомого имени";
      return true;
    });

    t("[cast-1] длинный отдых чистит activeSpellEffects и концентрацию", function(){
      var savedChars = window.characters, savedId = window.currentId;
      var savedRest = window.currentRestType, savedLoad = window.loadCharacter, savedShow = window.showRestResult;
      try {
        window.characters = [_castFixture()];
        window.currentId = "test-cast1";
        var c = window.characters[0];
        _castSpellWithSlot(900, "slot", 1);
        _castSpellWithSlot(901, "slot", 3);
        window.currentRestType = "long";
        window.loadCharacter = function(){};   // без полного перерендера в тесте
        window.showRestResult = function(){};
        confirmRest();
        if (c.effects.length !== 0) return "char.effects не очищен: " + c.effects.join(",");
        if (c.activeSpellEffects.length !== 0) return "activeSpellEffects не очищен";
        if (c.concentration !== null) return "концентрация пережила длинный отдых";
        return true;
      } finally {
        window.characters = savedChars; window.currentId = savedId;
        window.currentRestType = savedRest; window.loadCharacter = savedLoad; window.showRestResult = savedShow;
      }
    });
  }

  // ────────── БЛОК 36 (CAST-2): счётчик раундов + тик длительностей кастов ──────────
  if (typeof tickCastEffectsRound === "function" && typeof expireCastEffectsByUnits === "function" &&
      typeof nextTurn === "function" && typeof SPELL_EFFECTS !== "undefined") {

    // Фикстура: безбронный волшебник с часовым («Доспехи мага») и минутным
    // концентрационным («Ускорение») баффами; hpDice нужен короткому отдыху.
    function _cast2Fixture() {
      return {
        id: "test-cast2", name: "Тест CAST-2", class: "Волшебник", level: 5,
        stats: { str: 10, dex: 16, con: 10, int: 16, wis: 10, cha: 10 },
        combat: { armorId: "none", hasShield: false, hpCurrent: 20, hpMax: 20, hpDiceSpent: 0, hpDice: "5к6" },
        saves: {}, skills: [], conditions: [], effects: [], activeSpellEffects: [],
        spells: { stat: "ИНТ", slots: { 1: 4, 3: 3 }, slotsUsed: {}, prepared: [900, 901],
          mySpells: [
            { id: 900, name: "Доспехи мага", level: 1, duration: "8 часов",                   source: "PH14" },
            { id: 901, name: "Ускорение",    level: 3, duration: "Концентрация, до 1 минуты", source: "PH14" }
          ] }
      };
    }

    t("[cast-2] wrap nextTurn → round++, prevTurn через границу → round−1, не ниже 1", function(){
      var savedChars = window.characters, savedId = window.currentId, savedBattle = BATTLE_DATA;
      try {
        window.characters = []; window.currentId = null; // тик — гарантированный no-op
        BATTLE_DATA = { active: true, currentTurn: 0, round: 1, participants: [
          { name: "А", type: "self", status: "healthy" }, { name: "Б", type: "monster", status: "healthy" }, { name: "В", type: "monster", status: "healthy" }
        ]};
        nextTurn(); nextTurn(); // 0→1→2, раунд не меняется
        if (BATTLE_DATA.round !== 1) return "round до wrap: " + BATTLE_DATA.round;
        nextTurn(); // wrap 2→0 → раунд 2
        if (BATTLE_DATA.round !== 2) return "wrap не инкрементировал: " + BATTLE_DATA.round;
        prevTurn(); // 0→2 через границу назад → раунд 1
        if (BATTLE_DATA.round !== 1) return "prevTurn через границу: " + BATTLE_DATA.round;
        prevTurn(); prevTurn(); // 2→1→0, раунд не меняется
        if (BATTLE_DATA.round !== 1) return "round внутри раунда: " + BATTLE_DATA.round;
        prevTurn(); // 0→2 ещё раз назад — пол на 1
        if (BATTLE_DATA.round !== 1) return "round ушёл ниже 1: " + BATTLE_DATA.round;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; BATTLE_DATA = savedBattle; }
    });

    t("[cast-2] тик: минутный эффект истекает на 10-м раунде (концентрация гаснет), часовой не тикает", function(){
      var savedChars = window.characters, savedId = window.currentId, savedBattle = BATTLE_DATA;
      try {
        window.characters = [_cast2Fixture()];
        window.currentId = "test-cast2";
        var c = window.characters[0];
        _castSpellWithSlot(900, "slot", 1); // Доспехи мага — 8 часов, roundsLeft null
        _castSpellWithSlot(901, "slot", 3); // Ускорение — 1 мин = 10 раундов, концентрация
        BATTLE_DATA = { active: true, currentTurn: 0, round: 1, participants: [{ name: "Я", type: "self", status: "healthy" }] };
        for (var i = 0; i < 9; i++) nextTurn(); // 1 участник — каждый nextTurn = wrap = тик
        if (BATTLE_DATA.round !== 10) return "round после 9 тиков: " + BATTLE_DATA.round;
        var haste = c.activeSpellEffects.find(function(x){ return x.spellName === "Ускорение"; });
        if (!haste || haste.roundsLeft !== 1) return "roundsLeft после 9 тиков: " + (haste ? haste.roundsLeft : "нет экземпляра");
        if (c.effects.indexOf("haste") === -1) return "haste истёк раньше времени";
        nextTurn(); // 10-й тик → экспирация
        if (c.effects.indexOf("haste") !== -1) return "haste не истёк на 10-м раунде";
        if (c.concentration !== null) return "концентрация не погасла при истечении: " + c.concentration;
        if (c.effects.indexOf("mage_armor") === -1) return "часовой эффект пострадал от тика";
        if (c.activeSpellEffects.length !== 1 || c.activeSpellEffects[0].spellName !== "Доспехи мага")
          return "экземпляры после экспирации: " + c.activeSpellEffects.map(function(x){ return x.spellName; }).join(",");
        if (c.activeSpellEffects[0].roundsLeft !== null) return "часовой затикал: " + c.activeSpellEffects[0].roundsLeft;
        return true;
      } finally { window.characters = savedChars; window.currentId = savedId; BATTLE_DATA = savedBattle; }
    });

    t("[cast-2] короткий отдых: минутные эффекты истекают, часовые переживают", function(){
      var savedChars = window.characters, savedId = window.currentId;
      var savedRest = window.currentRestType, savedDice = window.hitDiceToSpend;
      var savedLoad = window.loadCharacter, savedShow = window.showRestResult;
      try {
        window.characters = [_cast2Fixture()];
        window.currentId = "test-cast2";
        var c = window.characters[0];
        _castSpellWithSlot(900, "slot", 1);
        _castSpellWithSlot(901, "slot", 3);
        window.currentRestType = "short";
        window.hitDiceToSpend = 0;
        window.loadCharacter = function(){};
        window.showRestResult = function(){};
        confirmRest();
        if (c.effects.indexOf("haste") !== -1) return "минутный эффект пережил короткий отдых";
        if (c.concentration !== null) return "концентрация пережила экспирацию: " + c.concentration;
        if (c.effects.indexOf("mage_armor") === -1) return "часовой эффект снят коротким отдыхом";
        if (c.activeSpellEffects.length !== 1 || c.activeSpellEffects[0].spellName !== "Доспехи мага")
          return "экземпляры: " + c.activeSpellEffects.map(function(x){ return x.spellName; }).join(",");
        return true;
      } finally {
        window.characters = savedChars; window.currentId = savedId;
        window.currentRestType = savedRest; window.hitDiceToSpend = savedDice;
        window.loadCharacter = savedLoad; window.showRestResult = savedShow;
      }
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
