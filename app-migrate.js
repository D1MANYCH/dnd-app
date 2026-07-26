// ============================================================
// app-migrate.js — Миграции схемы персонажа: migrateCharacter
// (schemaVersion 0 → SCHEMA) и бэкфилл признака «своё» у заклинаний
// ============================================================

function migrateCharacter(char) {
  var v = char.schemaVersion || 0;
  if (v < 1) {
    if (char.alignment    === undefined) char.alignment    = "";
    if (char.size         === undefined) char.size         = "Средний";
    if (char.inspiration  === undefined) char.inspiration  = false;
    if (char.concentration=== undefined) char.concentration= null;
    if (!char.companions)                char.companions   = [];
    if (!char.feats)                     char.feats        = [];
    if (!char.asiUsedLevels)             char.asiUsedLevels= [];
    if (!char.journal)                   char.journal      = [];
    if (!char.party)                     char.party        = { allies:[], monsters:[], npcs:[] };
    if (!char.battle)                    char.battle       = { active:false, participants:[], currentTurn:0 };
    char.schemaVersion = 1;
  }
  if (v < 2) {
    if (char.avatar === undefined) char.avatar = null;
    char.schemaVersion = 2;
  }
  if (v < 3) {
    if (!char.expertiseSkills) char.expertiseSkills = [];
    char.schemaVersion = 3;
  }
  if (v < 4) {
    if (!char.spells) char.spells = {};
    if (!char.spells.prepared) char.spells.prepared = [];
    char.schemaVersion = 4;
  }
  if (v < 5) {
    if (!char.resistances) char.resistances = [];
    if (!char.immunities) char.immunities = [];
    if (!char.vulnerabilities) char.vulnerabilities = [];
    if (char.twoWeaponFighting === undefined) char.twoWeaponFighting = false;
    char.schemaVersion = 5;
  }
  if (v < 6) {
    // Существующие персонажи считаются уже созданными — основа зафиксирована.
    // Новые персонажи (createNewCharacter) явно ставят basicLocked = false.
    if (char.basicLocked === undefined) char.basicLocked = true;
    if (!Array.isArray(char.raceFeats)) char.raceFeats = [];
    if (!Array.isArray(char.raceStatChoice)) char.raceStatChoice = [];
    char.schemaVersion = 6;
  }
  if (v < 7) {
    // Языки: строка → массив объектов {name, source, category}
    if (!char.proficiencies) char.proficiencies = { armor:[], weapon:[], tools:"", languages:[], languageChoices:{} };
    var oldLang = char.proficiencies.languages;
    if (typeof oldLang === "string") {
      var arr = [];
      if (oldLang.trim()) {
        oldLang.split(/[,;\n]/).forEach(function(s) {
          var name = s.trim();
          if (name) arr.push({ name: name, source: "custom", category: "custom" });
        });
      }
      char.proficiencies.languages = arr;
    } else if (!Array.isArray(oldLang)) {
      char.proficiencies.languages = [];
    }
    if (!char.proficiencies.languageChoices) char.proficiencies.languageChoices = {};
    char.schemaVersion = 7;
  }
  if (v < 8) {
    // Инструменты: строка → массив объектов {name, source, category}
    if (!char.proficiencies) char.proficiencies = { armor:[], weapon:[], tools:[], toolChoices:{}, languages:[], languageChoices:{} };
    var oldTools = char.proficiencies.tools;
    if (typeof oldTools === "string") {
      var arr = [];
      if (oldTools.trim()) {
        oldTools.split(/[,;\n]/).forEach(function(s) {
          var name = s.trim();
          if (name) arr.push({ name: name, source: "custom", category: "custom" });
        });
      }
      char.proficiencies.tools = arr;
    } else if (!Array.isArray(oldTools)) {
      char.proficiencies.tools = [];
    }
    if (!char.proficiencies.toolChoices) char.proficiencies.toolChoices = {};
    char.schemaVersion = 8;
  }
  if (v < 9) {
    // Доспехи/оружие: добавляем поля для источников и custom-набора
    if (!char.proficiencies) char.proficiencies = {};
    if (!Array.isArray(char.proficiencies.armor))  char.proficiencies.armor  = [];
    if (!Array.isArray(char.proficiencies.weapon)) char.proficiencies.weapon = [];
    // Существующие владения считаем custom — позже recalc их объединит с авто-источниками
    if (!Array.isArray(char.proficiencies.armorCustom))  char.proficiencies.armorCustom  = char.proficiencies.armor.slice();
    if (!Array.isArray(char.proficiencies.weaponCustom)) char.proficiencies.weaponCustom = char.proficiencies.weapon.slice();
    if (!Array.isArray(char.proficiencies.specificWeapons)) char.proficiencies.specificWeapons = [];
    if (!char.proficiencies.armorSources)  char.proficiencies.armorSources  = {};
    if (!char.proficiencies.weaponSources) char.proficiencies.weaponSources = {};
    char.schemaVersion = 9;
  }
  if (v < 10) {
    // notesV2: типизированный «дневник игрока». Перенос старых полей в sections.
    if (!char.notesV2 || typeof char.notesV2 !== 'object') {
      char.notesV2 = {
        sections: {
          appearance: "", personality: "", backstory: "",
          features: "", magicItems: "", bonds: "", flaws: "", ideals: ""
        },
        entries: [],
        prefs: { lastSection: 'backstory', lastFilter: 'all' }
      };
    } else {
      if (!char.notesV2.sections) char.notesV2.sections = {};
      var _S = char.notesV2.sections;
      ['appearance','personality','backstory','features','magicItems','bonds','flaws','ideals'].forEach(function(k){
        if (typeof _S[k] !== 'string') _S[k] = "";
      });
      if (!Array.isArray(char.notesV2.entries)) char.notesV2.entries = [];
      if (!char.notesV2.prefs) char.notesV2.prefs = { lastSection: 'backstory', lastFilter: 'all' };
    }
    // Перенос legacy-строк (double-write до N5: старые поля оставляем)
    var sec = char.notesV2.sections;
    if (typeof char.appearance === 'string' && char.appearance && !sec.appearance) sec.appearance = char.appearance;
    if (typeof char.features   === 'string' && char.features   && !sec.features)   sec.features   = char.features;
    if (typeof char.notes      === 'string' && char.notes      && !sec.backstory)  sec.backstory  = char.notes;
    if (typeof char.magicItems === 'string' && char.magicItems && !sec.magicItems) sec.magicItems = char.magicItems;
    char.schemaVersion = 10;
  }
  if (v < 11) {
    // BUILD-1: готовые билды персонажей. Существующие чары не привязаны.
    if (typeof char.buildId === 'undefined') char.buildId = null;
    char.schemaVersion = 11;
  }
  if (v < 12) {
    // BUGFIX-1: пакт-ячейки колдуна — отдельный счётчик (PHB p.165).
    // У одноклассового Колдуна ячейки лежали в char.spells.slots[1..9] и были
    // визуально неотличимы от обычных. У мультикласса с Колдуном — терялись.
    if (!char.spells) char.spells = {};
    char.spells.pactSlots = 0;
    char.spells.pactLevel = 0;
    char.spells.pactUsed = 0;
    var _wLvl = 0;
    if (Array.isArray(char.classes) && char.classes.length > 0) {
      var _w = char.classes.find(function(c){ return c.class === "Колдун"; });
      if (_w) _wLvl = _w.level || 0;
    } else if (char.class === "Колдун") {
      _wLvl = char.level || 0;
    }
    if (_wLvl > 0 && typeof SPELL_SLOTS_BY_LEVEL !== "undefined" && SPELL_SLOTS_BY_LEVEL["Колдун"] && SPELL_SLOTS_BY_LEVEL["Колдун"][_wLvl]) {
      var _row = SPELL_SLOTS_BY_LEVEL["Колдун"][_wLvl];
      var _cnt = 0, _lvl = 0;
      for (var _i = 1; _i < _row.length; _i++) {
        if (_row[_i] > 0) { _cnt = _row[_i]; _lvl = _i; }
      }
      char.spells.pactSlots = _cnt;
      char.spells.pactLevel = _lvl;
      // У одноклассового Колдуна старые слоты дублировали пакт — переносим used и чистим
      var _isSingle = !Array.isArray(char.classes) || char.classes.length <= 1;
      if (_isSingle && char.class === "Колдун") {
        var _used = (char.spells.slotsUsed && char.spells.slotsUsed[_lvl]) || 0;
        char.spells.pactUsed = Math.min(_used, _cnt);
        if (!char.spells.slots) char.spells.slots = {};
        if (!char.spells.slotsUsed) char.spells.slotsUsed = {};
        for (var _j = 1; _j <= 9; _j++) {
          char.spells.slots[_j] = 0;
          char.spells.slotsUsed[_j] = 0;
        }
      }
    }
    char.schemaVersion = 12;
  }
  if (v < 13) {
    // REQ-5: переименования по dnd.su — раса «Дварф»→«Дворф», язык «Дварфский»→«Дворфийский».
    if (char.race) char.race = char.race.replace(/Дварф/g, "Дворф").replace(/дварф/g, "дворф");
    var _renameLang13 = function(arr){
      if (!Array.isArray(arr)) return;
      for (var _li = 0; _li < arr.length; _li++) if (arr[_li] === "Дварфский") arr[_li] = "Дворфийский";
    };
    if (char.proficiencies) {
      _renameLang13(char.proficiencies.languages);
      if (char.proficiencies.languageChoices) {
        Object.keys(char.proficiencies.languageChoices).forEach(function(k){ _renameLang13(char.proficiencies.languageChoices[k]); });
      }
    }
    char.schemaVersion = 13;
  }
  if (v < 14) {
    // REQ-5: предыстории по dnd.su + слияние дублей.
    var _bgRename14 = {
      "Воин":"Солдат", "Благородный":"Дворянин", "Герой народа":"Народный герой",
      "Матрос":"Моряк", "Торговец":"Гильдейский ремесленник", "Подмастерье":"Гильдейский ремесленник",
      "Аколит":"Прислужник", "Преступник/Шпион":"Преступник", "Бродяга":"Чужеземец"
    };
    if (char.background && _bgRename14[char.background]) char.background = _bgRename14[char.background];
    char.schemaVersion = 14;
  }
  if (v < 15) {
    // REQ-5a′: эталон → книги «2014 PHantom». Откат REQ-5a (schema 13):
    // раса «Дворф»→«Дварф», язык «Дворфийский»→«Дварфский» (книга, стр. 17/124).
    if (char.race) char.race = char.race.replace(/Дворф/g, "Дварф").replace(/дворф/g, "дварф");
    // языки хранятся объектами {name,...} (schema 7), но защищаемся и от строк
    var _renameLang15 = function(arr){
      if (!Array.isArray(arr)) return;
      for (var _li = 0; _li < arr.length; _li++) {
        var _el = arr[_li];
        if (_el === "Дворфийский") arr[_li] = "Дварфский";
        else if (_el && _el.name === "Дворфийский") _el.name = "Дварфский";
      }
    };
    if (char.proficiencies) {
      _renameLang15(char.proficiencies.languages);
      if (char.proficiencies.languageChoices) {
        Object.keys(char.proficiencies.languageChoices).forEach(function(k){ _renameLang15(char.proficiencies.languageChoices[k]); });
      }
    }
    char.schemaVersion = 15;
  }
  if (v < 16) {
    // REQ-5b (партия 1, заговоры): SPELL_DATABASE переименована в имена книги
    // PHB 2014 (PHantom). Чиним привязку по значению в сохранёнках:
    // prepared — массив строк, mySpells — объекты с .name (id не менялся).
    var _spellRename16 = {
      "Дружелюбие": "Дружба",
      "Друидический знак": "Искусство друидов",
      "Дубина": "Дубинка",
      "Защита клинком": "Защита от оружия",
      "Злобная насмешка": "Злая насмешка",
      "Знаменательное послание": "Сообщение",
      "Истинный удар": "Меткий удар",
      "Кислота брызгами": "Брызги кислоты",
      "Луч мороза": "Луч холода",
      "Могильный холод": "Леденящее прикосновение",
      "Огненный болт": "Огненный снаряд",
      "Пламя": "Сотворение пламени",
      "Пляшущие огни": "Пляшущие огоньки",
      "Поддержка умирающего": "Уход за умирающим",
      "Потрясение": "Электрошок",
      "Престидижитация": "Фокусы",
      "Руководство": "Указание",
      "Священный огонь": "Священное пламя",
      "Терновый бич": "Терновый кнут",
      "Яд-брызги": "Ядовитые брызги"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename16[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename16[sp.name]) sp.name = _spellRename16[sp.name];
        });
      }
    }
    char.schemaVersion = 16;
  }
  if (v < 17) {
    // REQ-5b (партия 2, ур.1): SPELL_DATABASE переименована в имена книги
    // PHB 2014 (PHantom). Чиним привязку по значению (как schema 16 для заговоров):
    // prepared — массив строк, mySpells — объекты с .name (id не менялся).
    var _spellRename17 = {
      "Адская расплата": "Адское возмездие",
      "Беззвучное изображение": "Безмолвный образ",
      "Божественная милость": "Божественное благоволение",
      "Броня Агатиса": "Доспех Агатиса",
      "Ведьмин болт": "Ведьмин снаряд",
      "Громовая волна": "Волна грома",
      "Яростная кара": "Гневная кара",
      "Защита от зла и добра": "Защита от добра и зла",
      "Слово исцеления": "Лечащее слово",
      "Направляющий болт": "Направленный снаряд",
      "Иллюзорный текст": "Невидимое письмо",
      "Обнаружение яда и болезни": "Обнаружение болезней и яда",
      "Обнаружение зла и добра": "Обнаружение добра и зла",
      "Огненные руки": "Огненные ладони",
      "Огни фей": "Огонь фей",
      "Очищение еды и питья": "Очищение пищи и питья",
      "Мягкое падение": "Падение пёрышком",
      "Ускоренное отступление": "Поспешное отступление",
      "Команда": "Приказ",
      "Мнимая жизнь": "Псевдожизнь",
      "Цветная россыпь": "Сверкающие брызги",
      "Сигнализация": "Сигнал тревоги",
      "Смазка": "Скольжение",
      "Длинный шаг": "Скороход",
      "Создать или уничтожить воду": "Сотворение или уничтожение воды",
      "Сон": "Усыпление",
      "Хроматическая сфера": "Цветной шарик",
      "Незримый слуга": "Невидимый слуга",
      "Жгучая кара": "Палящая кара",
      "Плавающий диск Тенсера": "Тензеров парящий диск",
      "Живительная ягода": "Чудо-ягоды"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename17[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename17[sp.name]) sp.name = _spellRename17[sp.name];
        });
      }
    }
    char.schemaVersion = 17;
  }
  if (v < 18) {
    // REQ-5b (партия 3, ур.2): SPELL_DATABASE переименована в имена книги
    // PHB 2014 (PHantom). Чиним привязку по значению (как schema 16/17):
    // prepared — массив строк, mySpells — объекты с .name (id не менялся).
    var _spellRename18 = {
      "Венец безумия": "Корона безумия",
      "Волшебное оружие": "Магическое оружие",
      "Говорящие уста": "Волшебные уста",
      "Гонец-животное": "Почтовое животное",
      "Духовное оружие": "Божественное оружие",
      "Жгучий луч": "Палящий луч",
      "Завораживание": "Речь златоуста",
      "Защитная связь": "Охраняющая связь",
      "Зеркальное отображение": "Отражения",
      "Зона правды": "Область истины",
      "Изменить облик": "Смена обличья",
      "Кислотная стрела Мельфа": "Мельфова кислотная стрела",
      "Кора дерева": "Дубовая кора",
      "Магическая аура Нистула": "Нистулова ложная аура",
      "Магический замок": "Волшебный замок",
      "Молитва об исцелении": "Молебен лечения",
      "Обнаружение невидимости": "Видение невидимого",
      "Огненная сфера": "Пылающий шар",
      "Огненный клинок": "Горящий клинок",
      "Определение животных или растений": "Поиск животных или растений",
      "Определение животных и растений": "Поиск животных или растений",
      "Определение предмета": "Поиск предмета",
      "Отмычка": "Открывание",
      "Паучье лазанье": "Паук",
      "Передвижение без следов": "Бесследное передвижение",
      "Покой": "Нетленные останки",
      "Помощь": "Подмога",
      "Предзнаменование": "Гадание",
      "Призрачная сила": "Воображаемая сила",
      "Размытие": "Размытый образ",
      "Раскалить металл": "Раскалённый металл",
      "Рост шипов": "Шипы",
      "Слепота/Глухота": "Глухота/слепота",
      "Темнота": "Тьма",
      "Туча кинжалов": "Облако кинжалов",
      "Увеличение/Уменьшение": "Увеличение/уменьшение",
      "Усиление способности": "Улучшение характеристики",
      "Успокоение эмоций": "Умиротворение"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename18[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename18[sp.name]) sp.name = _spellRename18[sp.name];
        });
      }
    }
    char.schemaVersion = 18;
  }
  if (v < 19) {
    // REQ-5b (партия 4, ур.3): SPELL_DATABASE переименована в имена книги
    // PHB 2014 (PHantom). Чиним привязку по значению (как schema 16/17/18):
    // prepared — массив строк, mySpells — объекты с .name (id не менялся).
    // NB: «Оживление» (ур.3) = Revivify → «Возрождение» (книжное Raise Dead «Оживление» — ур.5, не затронут).
    var _spellRename19 = {
      "Аура жизненности": "Аура живучести",
      "Большое изображение": "Образ",
      "Вампирское касание": "Прикосновение вампира",
      "Вонючее облако": "Зловонное облако",
      "Групповое слово исцеления": "Множественное лечащее слово",
      "Духи-хранители": "Духовные стражи",
      "Дыхание под водой": "Подводное дыхание",
      "Залп вызова": "Призыв заграждения",
      "Защита от стихии": "Защита от энергии",
      "Крохотная хижина Леомунда": "Леомундова хижина",
      "Наложение проклятия": "Проклятие",
      "Необнаружение": "Необнаружимость",
      "Оживление": "Возрождение",
      "Оживление мертвецов": "Восставший труп",
      "Ослепляющий удар": "Ослепляющая кара",
      "Охранный знак": "Охранные руны",
      "Притвориться мёртвым": "Притворная смерть",
      "Рассеять магию": "Рассеивание магии",
      "Снятие проклятия": "Снятие проклятья",
      "Создание еды и воды": "Сотворение пищи и воды",
      "Стена ветра": "Стена ветров",
      "Страх": "Ужас",
      "Элементальное оружие": "Стихийное оружие",
      "Ясновидение": "Подсматривание"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename19[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename19[sp.name]) sp.name = _spellRename19[sp.name];
        });
      }
    }
    char.schemaVersion = 19;
  }
  if (v < 20) {
    // REQ-5b (партия 5, ур.4): SPELL_DATABASE переименована в имена книги
    // PHB 2014 (PHantom). Чиним привязку по значению (как schema 16–19):
    // prepared — массив строк, mySpells — объекты с .name (id не менялся).
    // NB: «Прорицание» (Divination) → «Предсказание»; книжное «Оживление» (Raise Dead)
    // не затронуто; «Превращение» (Polymorph) — PH24 «Полиморф» сведён к PH14-имени книги.
    var _spellRename20 = {
      "Аура чистоты": "Аура очищения",
      "Ледяной шторм": "Град",
      "Определение существа": "Поиск существа",
      "Ошеломляющий удар": "Оглушающая кара",
      "Прорицание": "Предсказание",
      "Свобода передвижения": "Свобода перемещения",
      "Врата измерений": "Переносящая дверь",
      "Пространственная дверь": "Переносящая дверь",
      "Галлюцинаторная местность": "Мираж",
      "Галлюцинаторный рельеф": "Мираж",
      "Личное убежище Морденкайнена": "Кабинет Морденкайнена",
      "Личное убежище": "Кабинет Морденкайнена",
      "Призрак-убийца": "Воображаемый убийца",
      "Фантомный убийца": "Воображаемый убийца",
      "Тайный сундук Леомунда": "Леомундов потайной сундук",
      "Тайный сундук": "Леомундов потайной сундук",
      "Управление водой": "Власть над водами",
      "Власть над водой": "Власть над водами",
      "Упругая сфера Отилюка": "Отилюков упругий шар",
      "Упругая сфера": "Отилюков упругий шар",
      "Формование камня": "Изменение формы камня",
      "Преобразование камня": "Изменение формы камня",
      "Чёрные щупальца Эварда": "Эвардовы чёрные щупальца",
      "Чёрные щупальца": "Эвардовы чёрные щупальца",
      "Верный пёс": "Верный пёс Морденкайнена",
      "Иссыхание": "Усыхание",
      "Улучшенная невидимость": "Высшая невидимость",
      "Страж смерти": "Защита от смерти",
      "Замешательство": "Смятение",
      "Полиморф": "Превращение",
      "Призыв существ леса": "Призыв лесных обитателей",
      "Хватающая лоза": "Цепкая лоза"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename20[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename20[sp.name]) sp.name = _spellRename20[sp.name];
        });
      }
    }
    char.schemaVersion = 20;
  }
  if (v < 21) {
    // REQ-5b (партия 6, ур.5): SPELL_DATABASE переименована в имена книги
    // PHB 2014 (PHantom, англо-русский глоссарий стр.314–320). Чиним привязку
    // по значению (как schema 16–20): prepared — массив строк, mySpells —
    // объекты с .name (id не менялся). NB: Raise Dead «Поднятие мёртвых» →
    // книжное «Оживление» (бывшее имя Revivify, ставшего «Возрождение» в schema 19);
    // Mislead PH14 «Обман» и PH24 «Двойник» → книжное «Фальшивый двойник»
    // («Двойник» — книжное имя Clone, в БД это «Клон», ур.8 — не затронут).
    var _spellRename21 = {
      "Болезнь": "Заражение",
      "Изгоняющий удар": "Изгоняющая кара",
      "Кисть Бигби": "Длань Бигби",
      "Контакт с иным планом": "Связь с иным миром",
      "Массовое лечение ран": "Множественное лечение ран",
      "Оживление предметов": "Оживление вещей",
      "Оболочка против жизни": "Преграда жизни",
      "Огненный удар": "Небесный огонь",
      "Поднятие мёртвых": "Оживление",
      "Пробуждение": "Пробуждение разума",
      "Рассеять добро и зло": "Рассеивание добра и зла",
      "Созидание": "Сотворение",
      "Стена камня": "Каменная стена",
      "Стена силы": "Силовая стена",
      "Телепатическая связь Рарыса": "Ментальная связь Рэри",
      "Легенды и предания": "Знание легенд",
      "Личина": "Притворство",
      "Магическое связывание": "Планарные узы",
      "Обман": "Фальшивый двойник",
      "Освящение": "Святилище",
      "Прогулка по деревьям": "Древесный путь",
      "Стремительный колчан": "Быстрый колчан",
      "Двойник": "Фальшивый двойник",
      "Знание преданий": "Знание легенд",
      "Привязка к плану": "Планарные узы",
      "Проход сквозь стену": "Создание прохода"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename21[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename21[sp.name]) sp.name = _spellRename21[sp.name];
        });
      }
    }
    char.schemaVersion = 21;
  }
  if (v < 22) {
    // REQ-5b (партия 7, ур.6): SPELL_DATABASE переименована в имена книги
    // PHB 2014 (PHantom, англо-русский глоссарий стр.314–320). Чиним привязку
    // по значению (как schema 16–21): prepared — массив строк, mySpells —
    // объекты с .name (id не менялся). Для ур.6 книга часто РАСХОДИТСЯ со
    // старыми Fantom-именами (Disintegrate «Дезинтеграция» → «Распад»,
    // Chain lightning «Цепная молния» → «Пляшущая молния», Heal «Исцеление»
    // → «Полное исцеление» и т.д.).
    var _spellRename22 = {
      "Воздушная прогулка": "Хождение по ветру",
      "Вред": "Поражение",
      "Дезинтеграция": "Распад",
      "Дурной глаз": "Разящее око",
      "Исцеление": "Полное исцеление",
      "Ледяная сфера Оттилюка": "Отилюков ледяной шар",
      "Магический сосуд": "Волшебный сосуд",
      "Массовое внушение": "Множественное внушение",
      "Мгновенный вызов Дравмия": "Дромиджево появление",
      "Непредвиденный случай": "Предосторожность",
      "Неудержимый танец Отто": "Неудержимая пляска Отто",
      "Охрана и защита": "Стражи",
      "Перемещение через растения": "Путешествие через растения",
      "Плоть в камень": "Окаменение",
      "Программируемая иллюзия": "Заданная иллюзия",
      "Сдвинуть землю": "Движение почвы",
      "Слово призыва": "Слово возврата",
      "Создание нежити": "Сотворение нежити",
      "Союзник с иного плана": "Планарный союзник",
      "Стена льда": "Ледяная стена",
      "Стена шипов": "Терновая стена",
      "Цепная молния": "Пляшущая молния",
      "Шар неуязвимости": "Сфера неуязвимости"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename22[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename22[sp.name]) sp.name = _spellRename22[sp.name];
        });
      }
    }
    char.schemaVersion = 22;
  }
  if (v < 23) {
    // REQ-5b (партия 8, ур.7): SPELL_DATABASE переименована в имена книги
    // PHB 2014 (PHantom, англо-русский глоссарий стр.314–320). Чиним привязку
    // по значению (как schema 16–22): prepared — массив строк, mySpells —
    // объекты с .name (id не менялся). Для ур.7 книга часто РАСХОДИТСЯ со
    // старыми Fantom-именами (Reverse gravity «Обратная гравитация» →
    // «Изменение тяготения», Prismatic spray «Призматический луч» →
    // «Радужные брызги», Forcecage «Силовая клетка» → «Узилище», Symbol
    // «Символ» → «Знак», Simulacrum «Симулякр» → «Подобие» и т.д.).
    var _spellRename23 = {
      "Обратная гравитация": "Изменение тяготения",
      "Призматический луч": "Радужные брызги",
      "Проекция образа": "Проекция",
      "Роскошный особняк Морденкайнена": "Великолепный особняк Морденкайнена",
      "Великолепный особняк": "Великолепный особняк Морденкайнена",
      "Секвестр": "Изоляция",
      "Силовая клетка": "Узилище",
      "Символ": "Знак",
      "Симулякр": "Подобие",
      "Слово богов": "Божественное слово",
      "Смена плана": "Уход в иной мир"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename23[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename23[sp.name]) sp.name = _spellRename23[sp.name];
        });
      }
    }
    char.schemaVersion = 23;
  }
  if (v < 24) {
    // REQ-5b (партия 9, ур.8): SPELL_DATABASE переименована в имена книги
    // PHB 2014 (PHantom, англо-русский глоссарий стр.314–320). Чиним привязку
    // по значению (как schema 16–23): prepared — массив строк, mySpells —
    // объекты с .name (id не менялся). Для ур.8 книга расходится со старыми
    // Fantom-именами (Antimagic field «Антимагическое поле» → «Преграда магии»,
    // Mind blank «Блокировка разума» → «Сокрытие разума», Clone «Клон» →
    // «Двойник», Sunburst «Солнечная вспышка» → «Солнечный ожог» и т.д.).
    // PH24 Befuddlement «Оцепенение» (переработанный Feeblemind) сведён к
    // книжн. «Слабоумие» (= PH14). Плюс case-fix Antipathy/sympathy.
    var _spellRename24 = {
      "Антимагическое поле": "Преграда магии",
      "Антипатия/Симпатия": "Антипатия/симпатия",
      "Блокировка разума": "Сокрытие разума",
      "Клон": "Двойник",
      "Огненное облако": "Воспламеняющая туча", // REQ-6: финальное книжное имя (правка ниже в v<27)
      "Оцепенение": "Слабоумие",
      "Полуплан": "Демиплан",
      "Речистость": "Находчивость",
      "Священная аура": "Аура святости",
      "Солнечная вспышка": "Солнечный ожог",
      "Формы животных": "Превращение в животных"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename24[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename24[sp.name]) sp.name = _spellRename24[sp.name];
        });
      }
    }
    char.schemaVersion = 24;
  }
  if (v < 25) {
    // REQ-5b (партия 10, ур.9, ПОСЛЕДНЯЯ): SPELL_DATABASE переименована в имена книги
    // PHB 2014 (PHantom, англо-русский глоссарий стр.314–320). Чиним привязку
    // по значению (как schema 16–24): prepared — массив строк, mySpells —
    // объекты с .name (id не менялся). Для ур.9 книга расходится со старыми
    // Fantom-именами (Storm of vengeance «Буря мести» → «Гроза гнева», Weird
    // «Кошмарное видение» → «Смертный ужас», Shapechange «Перевоплощение» →
    // «Полное превращение», Prismatic wall «Призматическая стена» → «Радужная
    // стена», Meteor swarm «Рой метеоров» → «Метеоритный дождь» и т.д.). Плюс
    // family-fix регистра у всей семьи Power Word: «Слово силы:» → «Слово Силы:».
    var _spellRename25 = {
      "Астральная проекция": "Проекция в астрал",
      "Буря мести": "Гроза гнева",
      "Заключение": "Заточение",
      "Кошмарное видение": "Смертный ужас",
      "Массовое исцеление": "Множественное полное исцеление",
      "Перевоплощение": "Полное превращение",
      "Призматическая стена": "Радужная стена",
      "Рой метеоров": "Метеоритный дождь",
      "Слово силы: укрепление": "Слово Силы: укрепление",
      "Слово силы: оглушение": "Слово Силы: оглушение",
      "Слово силы: исцеление": "Слово Силы: исцеление",
      "Слово силы: смерть": "Слово Силы: смерть"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename25[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename25[sp.name]) sp.name = _spellRename25[sp.name];
        });
      }
    }
    char.schemaVersion = 25;
  }
  if (v < 26) {
    // REQ-5d (партия 8, Волшебник): таксономия имён 8 школ магии сведена к
    // книге PHB 2014 (стр.115). App-ключи подклассов были легаси и расходились
    // со spells.js (там school-поле уже книжное: воплощение=Evocation,
    // вызов=Conjuration, ограждение=Abjuration, очарование=Enchantment). Своп
    // ключей подкласса (хранятся в char.subclass / char.classes[].subclass):
    //   «Школа воплощения» (был Conjuration) → «Школа вызова»
    //   «Школа эвокации»   (был Evocation)   → «Школа воплощения»
    //   «Школа отмены»      (Abjuration)      → «Школа ограждения»
    //   «Школа заговаривания»(Enchantment)    → «Школа очарования»
    // Карта применяется по точному значению (атомарно) → своп воплощение↔вызова
    // безопасен без коллизии. Иллюзия/Некромантия/Преобразование/Прорицание — без изм.
    var _subRename26 = {
      "Школа воплощения":   "Школа вызова",
      "Школа эвокации":     "Школа воплощения",
      "Школа отмены":       "Школа ограждения",
      "Школа заговаривания":"Школа очарования"
    };
    if (typeof char.subclass === "string" && _subRename26[char.subclass]) {
      char.subclass = _subRename26[char.subclass];
    }
    if (Array.isArray(char.classes)) {
      char.classes.forEach(function(cl){
        if (cl && typeof cl.subclass === "string" && _subRename26[cl.subclass]) {
          cl.subclass = _subRename26[cl.subclass];
        }
      });
    }
    char.schemaVersion = 26;
  }
  if (v < 27) {
    // REQ-6 (дочистка флагов REQ-5b): два заклинания остались в spells.js под
    // старыми именами — миграция была добавлена в REQ-5b, но саму запись в БД не
    // переименовали (недокат). Сводим к книге PHB 2014: Cloud of Daggers
    // «Туча кинжалов» → «Облако кинжалов» (ур.2, недокат партии 3; v<18 уже
    // целил в «Облако кинжалов», но имя БД было «Туча кинжалов» → сирота для
    // сейвов schema 18–26) и Incendiary Cloud «Воспламеняющаяся туча» →
    // «Воспламеняющая туча» (ур.8, недокат партии 9 — лишний «-ся»). Чиним
    // привязку по значению: prepared — строки, mySpells — объекты с .name.
    var _spellRename27 = {
      "Туча кинжалов": "Облако кинжалов",
      "Воспламеняющаяся туча": "Воспламеняющая туча"
    };
    if (char.spells) {
      if (Array.isArray(char.spells.prepared)) {
        char.spells.prepared = char.spells.prepared.map(function(n){
          return _spellRename27[n] || n;
        });
      }
      if (Array.isArray(char.spells.mySpells)) {
        char.spells.mySpells.forEach(function(sp){
          if (sp && _spellRename27[sp.name]) sp.name = _spellRename27[sp.name];
        });
      }
    }
    char.schemaVersion = 27;
  }
  if (v < 28) {
    // BUGFIX: применение билда набирало PH24-версии заклинаний — карта имён в
    // applyBuild строилась перезаписью, а PH24-дубли идут в spells.js после PH14
    // («последний побеждает»). Билды = PHB 2014 → у персонажей, созданных из
    // билда (buildId), заменяем PH24-заклинания на PH14-аналог (имя+уровень).
    // PH24-версии без PH14-аналога и персонажей без buildId не трогаем —
    // вручную добавленные PH24-заклинания могут быть осознанным выбором.
    if (char.buildId && char.spells && Array.isArray(char.spells.mySpells) &&
        typeof SPELL_DATABASE !== "undefined" && Array.isArray(SPELL_DATABASE)) {
      var _ph14ByName28 = {};
      SPELL_DATABASE.forEach(function(sp){
        if (sp && sp.name && sp.source === "PH14") {
          _ph14ByName28[sp.name.toLowerCase().trim() + "|" + sp.level] = sp;
        }
      });
      char.spells.mySpells = char.spells.mySpells.map(function(sp){
        if (!sp || !sp.name || sp.source !== "PH24") return sp;
        return _ph14ByName28[sp.name.toLowerCase().trim() + "|" + sp.level] || sp;
      });
    }
    char.schemaVersion = 28;
  }
  if (v < 29) {
    // FIN-3: таблица доспехов сведена к PHB 2014. Раньше id "ring" ошибочно
    // назывался «Кольчуга» с КД16 — это была кольчуга (chain mail). Теперь
    // "ring" = Колечный доспех (ring mail, КД14), а Кольчуга КД16 переехала в
    // новый id "chain_mail". Старые сейвы с armorId "ring" имели КД16 →
    // мигрируем на "chain_mail", чтобы КД не просел до 14. Пересчёт char.combat.ac
    // делает onArmorChange при загрузке листа (loadCharacter).
    if (char.combat && char.combat.armorId === "ring") {
      char.combat.armorId = "chain_mail";
    }
    char.schemaVersion = 29;
  }
  if (v < 30) {
    // FIN-11 (чистка): два изменения одной миграцией.
    // 1) Подкласс Плута «Мошенник» — внекнижный дубль «Мистического ловкача»
    //    (SUBCLASS_FEATURES совпадали по смыслу). Удалён из данных → сводим
    //    сейвы к книжному имени по точному значению (прецедент v<26). Хранится
    //    в char.subclass и char.classes[].subclass (мультикласс).
    if (char.subclass === "Мошенник") char.subclass = "Мистический ловкач";
    if (Array.isArray(char.classes)) {
      char.classes.forEach(function(cl){
        if (cl && cl.subclass === "Мошенник") cl.subclass = "Мистический ловкач";
      });
    }
    // 2) Legacy-поля заметок (char.notes/features/appearance/magicItems) убраны
    //    из схемы — единственный источник истины теперь notesV2.sections.
    //    Double-write прекращён (updateChar/notesUpdateSection/shadow-textareas).
    //    Защитный перенос в секцию ТОЛЬКО если она пуста (повтор логики v<10),
    //    затем поля удаляются. Идемпотентно: у прошедших сейвов секции уже
    //    заполнены → перенос no-op, поля просто исчезают.
    if (char.notesV2 && char.notesV2.sections) {
      var _sec30 = char.notesV2.sections;
      if (typeof char.appearance === 'string' && char.appearance && !_sec30.appearance) _sec30.appearance = char.appearance;
      if (typeof char.features   === 'string' && char.features   && !_sec30.features)   _sec30.features   = char.features;
      if (typeof char.magicItems === 'string' && char.magicItems && !_sec30.magicItems) _sec30.magicItems = char.magicItems;
      if (typeof char.notes      === 'string' && char.notes      && !_sec30.backstory)  _sec30.backstory  = char.notes;
    }
    delete char.notes;
    delete char.features;
    delete char.appearance;
    delete char.magicItems;
    char.schemaVersion = 30;
  }
  if (v < 31) {
    // E24-0: редакция правил стала свойством персонажа. Все существующие
    // персонажи создавались по правилам 2014 → проставляем явно. Тумблер
    // редакции на главной влияет только на НОВЫХ персонажей (createNewCharacter).
    if (!char.edition) char.edition = '2014';
    char.schemaVersion = 31;
  }
  if (v < 32) {
    // CAST-0: активные экземпляры эффектов заклинаний (длительность, связь
    // с концентрацией). char.effects остаётся массивом строк-id — метадата
    // живёт отдельно, семантика .includes() по всему коду не меняется.
    if (!Array.isArray(char.activeSpellEffects)) char.activeSpellEffects = [];
    char.schemaVersion = 32;
  }
  if (v < 33) {
    // HB-5: своё оружие хранится В ПЕРСОНАЖЕ — так экспорт/импорт/бэкапы/дубликат
    // получают его даром (characters сериализуется целиком). Слияние с книжным
    // каталогом идёт строго на чтении (_weaponCatalog), константа не мутируется.
    if (!Array.isArray(char.customWeapons)) char.customWeapons = [];
    char.schemaVersion = 33;
  }
  // Импорт-устойчивость: _isValidImportedChar проверяет только class+level,
  // поэтому валидный для импорта JSON может не содержать обязательных объектов
  // (combat, stats, …) — рендер падал на char.combat.hpCurrent. Достраиваем
  // недостающее из DEFAULT_CHARACTER: отсутствующие поля целиком, у объектных
  // полей — недостающие под-ключи. Существующие значения не трогаем. Блок
  // намеренно ПОСЛЕ версионных шагов: v<6 различает легаси-персонажей по
  // отсутствию basicLocked (true), дефолт шаблона (false) сломал бы это.
  if (typeof DEFAULT_CHARACTER !== 'undefined' && char && typeof char === 'object') {
    Object.keys(DEFAULT_CHARACTER).forEach(function(k) {
      var def = DEFAULT_CHARACTER[k];
      if (char[k] === undefined) {
        char[k] = JSON.parse(JSON.stringify(def));
        return;
      }
      if (!def || typeof def !== 'object' || Array.isArray(def)) return;
      if (!char[k] || typeof char[k] !== 'object' || Array.isArray(char[k])) char[k] = {};
      Object.keys(def).forEach(function(sub) {
        if (char[k][sub] === undefined) char[k][sub] = JSON.parse(JSON.stringify(def[sub]));
      });
    });
  }
  return char;
}

// HB-1: разнос признака «своё» по спискам персонажей. char.spells.mySpells держит
// КОПИИ объектов, а не ссылки на SPELL_DATABASE — JSON-раунд-трип через dnd_chars
// рвёт связь, поставленную в addSpell. Без этого прохода бейдж «🏠 Своё» есть в
// поиске и пропадает в списке персонажа, где на него и смотрят.
// Идемпотентно и без схемы: гоняется на каждой загрузке, id хомбрю берутся из
// SPELL_DATABASE (то, что не совпало с базой книг).
function _backfillHomebrewFlag(chars, hbIds) {
  if (!Array.isArray(chars) || !hbIds || !hbIds.size) return;
  chars.forEach(function(c) {
    var list = c && c.spells && c.spells.mySpells;
    if (!Array.isArray(list)) return;
    list.forEach(function(s) { if (s && hbIds.has(s.id)) s.homebrew = true; });
  });
}
