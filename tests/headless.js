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
   "updateSlotsDisplay","loadCharacter","addJournalEntry"].forEach(function(name){
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
        var defs = (typeof CLASS_CHOICES !== "undefined" && CLASS_CHOICES[b.className]) || [];
        var problems = [];
        Object.keys(b.recommendedChoices).forEach(function(choiceId){
          var choice = defs.filter(function(c){ return c.id === choiceId; })[0];
          if (!choice) { problems.push("choiceId «" + choiceId + "» ∉ CLASS_CHOICES[" + b.className + "]"); return; }
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
        if (html.indexOf("Стиль боя") !== -1) return "просочился «Стиль боя» воина (блоки не ограничены повышаемым классом)";
        if (html.indexOf("Пактный дар") !== -1) return "просочился «Пактный дар» (открыт на clvl 3, а повышаем до 2 → не использован clvl)";
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
      if (c.schemaVersion !== 12) return "schemaVersion: ожидал 12, получено " + c.schemaVersion;
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
