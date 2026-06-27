// ============================================================
// app-core.js — Ядро приложения: хелперы, состояние, навигация,
// персонажи, импорт/экспорт, уведомления
// ============================================================

// ── Хелперы ─────────────────────────────────────────────────
/** Короткий алиас для document.getElementById */
function $(id) { return document.getElementById(id); }
/** Текущий персонаж */
function getCurrentChar() { return characters.find(function(c) { return c.id === currentId; }); }
/** Открыть/закрыть простую модалку по id */
function openModal(id) { var m = $(id); if (m) m.classList.add("active"); }
function closeModal(id) { var m = $(id); if (m) m.classList.remove("active"); }
/** Debounce — откладывает вызов fn на delay мс после последнего вызова */
function debounce(fn, delay) {
  var timer;
  return function() {
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() { fn.apply(null, args); }, delay);
  };
}
/** Отложенное сохранение — не чаще одного раза в 300мс */
var saveToLocalDebounced = debounce(function() { saveToLocal(); }, 300);
/** BUGFIX-9: тегированный логгер для catch-блоков. Тихо в проде, видно при window.__DEBUG = true. */
window.__catchLog = function(tag, e) { if (window.__DEBUG) { try { console.warn('[' + tag + ']', e); } catch (_) {} } };
// SPELL_DATABASE — объединение встроенной базы (spells.js) и пользовательских добавлений из localStorage
// SPELLS_BASE определён в spells.js и загружается до app-core.js
var SPELL_DATABASE = (typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.slice() : [];
var CLASS_ICONS_MAP = { wizard:"🧙", druid:"🌿", bard:"🎵", cleric:"✝️", paladin:"🛡️", ranger:"🏹", sorcerer:"🔥", warlock:"👁️", both:"✨" };

// ── Мультикласс: миграция и синхронизация ──────────────────────
/** Мигрировать старый формат (char.class/level) → char.classes[] */
function migrateToMulticlass(char) {
  if (char.classes && char.classes.length > 0) return;
  char.classes = [];
  if (char.class) {
    char.classes.push({
      class: char.class,
      level: char.level || 1,
      subclass: char.subclass || "",
      hitDie: (typeof CLASS_HIT_DICE !== "undefined" ? CLASS_HIT_DICE[char.class] : 8) || 8
    });
  }
}

/** Синхронизировать char.class/level/subclass из char.classes[] (обратная совместимость) */
function syncClassFields(char) {
  if (!char.classes || !char.classes.length) return;
  char.class = char.classes[0].class;
  char.subclass = char.classes[0].subclass || "";
  char.level = char.classes.reduce(function(s, c) { return s + c.level; }, 0);
}

/** Проверить, является ли персонаж мультиклассовым */
function isMulticlass(char) {
  return char.classes && char.classes.length > 1;
}

/** Получить строковое описание класса: "Воин 5 / Плут 3" */
function getClassLabel(char) {
  if (!char.classes || char.classes.length <= 1) {
    return char.class || "";
  }
  return char.classes.map(function(c) { return c.class + " " + c.level; }).join(" / ");
}

/** Рассчитать ячейки заклинаний для мультикласса (PHB p.164-165) */
function getMulticlassSpellSlots(char) {
  if (!char.classes || char.classes.length <= 1) {
    // Одноклассовый — используем стандартную таблицу
    var cn = char.class;
    var lv = char.level;
    if (typeof SPELL_SLOTS_BY_LEVEL !== "undefined" && SPELL_SLOTS_BY_LEVEL[cn] && SPELL_SLOTS_BY_LEVEL[cn][lv]) {
      return SPELL_SLOTS_BY_LEVEL[cn][lv].slice();
    }
    return [0,0,0,0,0,0,0,0,0,0];
  }
  // Мультикласс — рассчитываем caster level
  var casterLevel = 0;
  var hasPact = false;
  var pactLevel = 0;
  char.classes.forEach(function(entry) {
    var ct = (typeof CASTER_TYPE !== "undefined") ? CASTER_TYPE[entry.class] : "none";
    // Воин/Плут — 1/3 только если правильный подкласс
    if (ct === "third") {
      if (typeof THIRD_CASTER_SUBCLASSES !== "undefined" && THIRD_CASTER_SUBCLASSES.indexOf(entry.subclass) !== -1) {
        casterLevel += Math.floor(entry.level / 3);
      }
    } else if (ct === "full") {
      casterLevel += entry.level;
    } else if (ct === "half") {
      casterLevel += Math.floor(entry.level / 2);
    } else if (ct === "pact") {
      hasPact = true;
      pactLevel = entry.level;
    }
  });
  // Ячейки из таблицы мультикласса
  var slots = [0,0,0,0,0,0,0,0,0,0];
  if (casterLevel > 0 && typeof MULTICLASS_SPELL_SLOTS !== "undefined" && MULTICLASS_SPELL_SLOTS[casterLevel]) {
    slots = MULTICLASS_SPELL_SLOTS[casterLevel].slice();
  }
  // Ячейки пакта (Колдун) добавляются отдельно — они не объединяются
  // Их обрабатывает существующая система
  return slots;
}

/** Проверить выполнение требований для мультикласса */
function checkMulticlassPrereqs(char, targetClass) {
  if (typeof MULTICLASS_PREREQUISITES === "undefined") return { ok: true, missing: [] };
  // Проверяем требования выхода из текущего класса (основного)
  var missing = [];
  // Проверяем требования входа в новый класс
  var reqs = MULTICLASS_PREREQUISITES[targetClass];
  if (reqs) {
    Object.keys(reqs).forEach(function(stat) {
      var val = char.stats[stat] || 10;
      if (val < reqs[stat]) {
        var names = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
        missing.push((names[stat]||stat) + " " + val + " (нужно " + reqs[stat] + ")");
      }
    });
  }
  // Для Воина: альтернативное требование — dex ≥ 13 вместо str
  if (targetClass === "Воин" && missing.length > 0) {
    if ((char.stats.dex || 10) >= 13) missing = [];
  }
  // Проверяем требования выхода из текущего основного класса
  if (char.class) {
    var exitReqs = MULTICLASS_PREREQUISITES[char.class];
    if (exitReqs) {
      Object.keys(exitReqs).forEach(function(stat) {
        var val = char.stats[stat] || 10;
        if (val < exitReqs[stat]) {
          var names = {str:"СИЛ",dex:"ЛОВ",con:"ТЕЛ",int:"ИНТ",wis:"МУД",cha:"ХАР"};
          var msg = (names[stat]||stat) + " " + val + " (нужно " + exitReqs[stat] + " для выхода из " + char.class + ")";
          if (missing.indexOf(msg) === -1) missing.push(msg);
        }
      });
      // Воин — альтернативное требование для выхода тоже
      if (char.class === "Воин" && missing.length > 0) {
        var exitMissing = [];
        Object.keys(exitReqs).forEach(function(stat) {
          if (stat === "str" && (char.stats.dex || 10) >= 13) return;
          var val = char.stats[stat] || 10;
          if (val < exitReqs[stat]) exitMissing.push(stat);
        });
        if (exitMissing.length === 0) missing = missing.filter(function(m) { return m.indexOf("для выхода") === -1; });
      }
    }
  }
  return { ok: missing.length === 0, missing: missing };
}

// Стандартные веса предметов D&D 5e для автозаполнения
var ITEM_WEIGHTS = {
  // Оружие
  "кинжал":1,"нож":1,"дротик":0.25,"праща":0,"болт":0.075,"стрела":0.05,
  "короткий меч":2,"длинный меч":3,"рапира":2,"меч":3,"сабля":3,"тесак":2,
  "боевой топор":4,"топор":4,"секира":7,"алебарда":6,"глефа":6,"копьё":3,
  "пика":18,"трезубец":4,"боевой молот":2,"молот":10,"булава":4,"палица":4,
  "моргенштерн":4,"цеп":2,"боевой посох":4,"посох":4,"дубина":2,"жезл":1,
  "лук":2,"короткий лук":2,"длинный лук":2,"арбалет":5,"ручной арбалет":3,
  "тяжёлый арбалет":18,"духовая трубка":1,
  // Броня
  "стёганый доспех":8,"кожаный доспех":10,"проклёпанная кожа":13,
  "кольчужная рубаха":20,"чешуйчатый доспех":45,"кольчуга":55,
  "нагрудник":20,"полукираса":20,"латный доспех":65,
  "щит":6,"небольшой щит":6,
  // Зелья
  "зелье лечения":0.5,"зелье":0.5,"яд":0.5,"масло":1,
  // Приключенческое снаряжение
  "верёвка":10,"верёвка шёлковая":5,"факел":1,"фонарь":2,"масляный фонарь":2,
  "мешок":0.5,"рюкзак":5,"сундук":25,"мешочек":0.1,
  "отмычки":1,"инструменты взломщика":1,"воровской инструмент":1,
  "компонентный мешочек":2,"фокусировка":0,"аркан":0,"святой символ":1,
  "книга заклинаний":3,"гримуар":3,"свиток":0,"пергамент":0,
  "рация":1,"зеркало":0.5,"лупа":0,"подзорная труба":1,
  "паёк":2,"сухой паёк":2,"вода":5,"бурдюк":1,
};

function autoFillItemWeight() {
  const nameEl = $("new-item-name");
  const weightEl = $("new-item-weight");
  if (!nameEl || !weightEl) return;
  const name = nameEl.value.toLowerCase().trim();
  if (!name || parseFloat(weightEl.value) !== 0) return;
  for (const key in ITEM_WEIGHTS) {
    if (name.includes(key) || key.includes(name)) {
      weightEl.value = ITEM_WEIGHTS[key];
      weightEl.style.borderColor = "var(--accent-color)";
      setTimeout(function(){ weightEl.style.borderColor = ""; }, 1500);
      const hint = $("weight-hint");
      if (hint) { hint.textContent = "✓ автозаполнено"; setTimeout(function(){ hint.textContent=""; }, 2000); }
      return;
    }
  }
}
function setItemQty(n) {
  const el = $("new-item-qty");
  if (el) el.value = n;
}
var characters = [];
var currentId = null;
var currentSpellVersion = "all";
var currentSpellClass = "all";
var currentViewItem = null;
var currentFilterCategory = "all";
var diceHistory = [];
var currentRestType = null;
var hitDiceToSpend = 0;
var hpHistory = [];
var abilities = [
{key: "str", name: "Сила"}, {key: "dex", name: "Ловкость"}, {key: "con", name: "Телосложение"},
{key: "int", name: "Интеллект"}, {key: "wis", name: "Мудрость"}, {key: "cha", name: "Харизма"}
];
var skills = [
{name: "Акробатика", stat: "dex"}, {name: "Магия", stat: "int"}, {name: "Атлетика", stat: "str"},
{name: "Внимательность", stat: "wis"}, {name: "Выживание", stat: "wis"}, {name: "Выступление", stat: "cha"},
{name: "Запугивание", stat: "cha"}, {name: "История", stat: "int"}, {name: "Ловкость рук", stat: "dex"},
{name: "Медицина", stat: "wis"}, {name: "Обман", stat: "cha"}, {name: "Природа", stat: "int"},
{name: "Проницательность", stat: "wis"}, {name: "Анализ", stat: "int"}, {name: "Религия", stat: "int"},
{name: "Скрытность", stat: "dex"}, {name: "Убеждение", stat: "cha"}, {name: "Уход за животными", stat: "wis"}
];

// ============================================
// МИГРАЦИИ СХЕМЫ ПЕРСОНАЖА
// ============================================
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

window.onload = function() {
try {
const saved = localStorage.getItem("dnd_chars");
const savedSpells = localStorage.getItem("dnd_spells");
const savedHpHistory = localStorage.getItem("dnd_hp_history");
if (saved) characters = JSON.parse(saved).map(migrateCharacter);
if (savedSpells) {
  // Пользовательские заклинания (добавленные через UI) — храним отдельно
  // и объединяем с базой, избегая дублей по id
  var userSpells = JSON.parse(savedSpells);
  var baseIds = new Set(SPELL_DATABASE.map(function(s) { return s.id; }));
  var extra = userSpells.filter(function(s) { return !baseIds.has(s.id); });
  if (extra.length > 0) SPELL_DATABASE = SPELL_DATABASE.concat(extra);
}
if (savedHpHistory) hpHistory = JSON.parse(savedHpHistory);
} catch(e) { console.error("Ошибка загрузки:", e); showToast("Ошибка загрузки данных!", "error"); }
initSaves();
initSkills();
initConditions();
initEffects();
renderCharacterList();
renderWeaponPresets();
updateVersionBlock(false);
initPersistentStorage();
// DATA-2: авто-снапшот в IndexedDB (app-backup.js), не чаще 1 раза в день
if (typeof initAutoBackup === "function") initAutoBackup();
};

function saveToLocal() {
try {
localStorage.setItem("dnd_chars", JSON.stringify(characters));
// Сохраняем только заклинания добавленные пользователем (не из базы spells.js)
var baseIds = new Set((typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.map(function(s){return s.id;}) : []);
var userSpells = SPELL_DATABASE.filter(function(s){ return !baseIds.has(s.id); });
localStorage.setItem("dnd_spells", JSON.stringify(userSpells));
localStorage.setItem("dnd_hp_history", JSON.stringify(hpHistory));
} catch(e) { console.error("Ошибка сохранения:", e); showToast("Ошибка сохранения данных!", "error"); }
}

// DATA-1: persistent storage — просим браузер не вытеснять localStorage/IndexedDB
// при нехватке места на устройстве (иначе данные могут пропасть без ведома пользователя)
let storagePersisted = null; // null = API недоступен / ответ ещё не получен
function initPersistentStorage() {
try {
if (typeof navigator === "undefined" || !navigator.storage || !navigator.storage.persist) {
  if (window.AppLog) AppLog.info("storage", "persistent storage API недоступен");
  updateStorageStatus();
  return;
}
navigator.storage.persisted()
  .then(function(already) { return already || navigator.storage.persist(); })
  .then(function(granted) {
    storagePersisted = !!granted;
    if (window.AppLog) AppLog.info("storage", granted ? "хранилище защищено от вытеснения" : "браузер отказал в persistent storage", { persisted: !!granted });
    updateStorageStatus();
  })
  .catch(function(e) {
    if (window.AppLog) AppLog.warn("storage", "persist() ошибка: " + ((e && e.message) || e));
    updateStorageStatus();
  });
} catch(e) { console.error("Ошибка persistent storage:", e); }
}

function _formatStorageBytes(n) {
var mb = n / (1024 * 1024);
if (mb >= 1024) return (mb / 1024).toFixed(1) + " ГБ";
if (mb >= 100) return Math.round(mb) + " МБ";
if (mb >= 1) return mb.toFixed(1) + " МБ";
return Math.max(1, Math.round(n / 1024)) + " КБ";
}

function updateStorageStatus() {
var el = $("storage-status");
if (!el) return;
var parts = [];
if (storagePersisted === true) parts.push("🔒 защищено от вытеснения");
else if (storagePersisted === false) parts.push("⚠️ не защищено — браузер может стереть при нехватке места");
var done = function() {
  if (!parts.length) { el.hidden = true; return; }
  el.textContent = "Хранилище: " + parts.join(" · ");
  el.hidden = false;
};
if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(function(est) {
    if (est && est.usage != null && est.quota) {
      parts.push("занято " + _formatStorageBytes(est.usage) + " из " + _formatStorageBytes(est.quota));
    }
    done();
  }).catch(done);
} else {
  done();
}
}

function showScreen(screenName) {
const charactersScreen = $("screen-characters");
const characterScreen = $("screen-character");
const characterTabs = $("character-tabs");
const statusBar = $("status-bar");
const hamburger = $("nav-hamburger");
const headerBack = $("header-back");
if (charactersScreen) charactersScreen.classList.add("hidden");
if (characterScreen) characterScreen.classList.add("hidden");
if (characterTabs) characterTabs.classList.add("hidden");
if (statusBar) statusBar.classList.remove("visible");
if (hamburger) hamburger.classList.add("hidden");
if (headerBack) headerBack.classList.add("hidden");
// Маркер для CSS: на экране выбора персонажа скрываем right-rail и табы
// в сайдбаре (они без выбранного персонажа всё равно ничего не делают),
// оставляя в сайдбаре только переключатель темы.
document.body.classList.toggle("no-character", screenName === "characters");
if (screenName === "characters") {
if (charactersScreen) charactersScreen.classList.remove("hidden");
closeDrawer();
currentId = null;
// UI6-1: на экране профилей нет активного персонажа — возвращаем акцент
// к ручному выбору/золоту (иначе после удаления активного персонажа
// или выхода висел бы классовый цвет предыдущего).
if (typeof _refreshAccent === 'function') _refreshAccent();
updateHeaderTitle();
renderCharacterList();
updateStorageStatus();
// Возврат к списку персонажей всегда скроллит наверх (header-back и
// браузерный Back через history-stack оба зовут showScreen("characters")).
try {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  if (charactersScreen) charactersScreen.scrollTop = 0;
} catch(e) { window.__catchLog && window.__catchLog('core:showScreen-scroll', e); }
} else {
if (characterScreen) characterScreen.classList.remove("hidden");
if (characterTabs) characterTabs.classList.remove("hidden");
if (hamburger) hamburger.classList.remove("hidden");
if (headerBack) headerBack.classList.remove("hidden");
updateHeaderTitle();
updateStatusBar();
}
}
function updateHeaderTitle() {
var avatarEl = $("header-avatar");
var subtitleEl = $("header-subtitle");
var AVATAR_FALLBACK_HTML = '<img class="header-avatar-fallback" src="assets/avatar-fallback.webp" alt="">';
if (!currentId) {
  $("header-title").textContent = "Мой Персонаж D&D 5e";
  if (avatarEl) avatarEl.innerHTML = AVATAR_FALLBACK_HTML;
  if (subtitleEl) subtitleEl.textContent = "";
  return;
}
var char = getCurrentChar();
if (char && char.name) {
  $("header-title").textContent = escapeHtml(char.name);
} else {
  $("header-title").textContent = "Мой Персонаж D&D 5e";
}
if (avatarEl) {
  if (char && char.avatar) {
    avatarEl.innerHTML = "<img src=\"" + char.avatar + "\" alt=\"\">";
  } else if (char && char.class) {
    avatarEl.innerHTML = getClassIcon(char.class);
  } else {
    avatarEl.innerHTML = AVATAR_FALLBACK_HTML;
  }
}
if (subtitleEl && char) {
  var parts = [];
  if (char.class) parts.push(char.class);
  if (char.race) parts.push(char.race);
  subtitleEl.textContent = parts.join(" · ");
} else if (subtitleEl) {
  subtitleEl.textContent = "";
}
}
function switchTab(tabName, btnEl) {
  if (window.AppLog) AppLog.action('nav', 'вкладка → ' + tabName);
  // UI-6: тактильная отдача при переключении вкладок
  try { if (navigator.vibrate) navigator.vibrate(10); } catch(e) { window.__catchLog && window.__catchLog('core:switchTab-vibrate', e); }
  document.querySelectorAll(".tab-content").forEach(function(tab) { tab.classList.remove("active"); });
  document.querySelectorAll(".tab-btn").forEach(function(btn) { btn.classList.remove("active"); });
  var tabElement = $("tab-" + tabName);
  if (tabElement) tabElement.classList.add("active");
  // Highlight tab btn
  var activeBtn = btnEl ? btnEl.closest(".tab-btn") : document.querySelector(".tab-btn[data-tab='" + tabName + "']");
  if (activeBtn) activeBtn.classList.add("active");
  // Highlight drawer item
  document.querySelectorAll(".drawer-item").forEach(function(el) { el.classList.remove("drawer-item-active"); });
  var drawerItem = document.querySelector(".drawer-item[data-drawer-tab='" + tabName + "']");
  if (drawerItem) drawerItem.classList.add("drawer-item-active");
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (tabElement) tabElement.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  } catch(e) { window.__catchLog && window.__catchLog('core:switchTab-scroll', e); }
  if (tabName === "party")   { openPartyTab(); }
  if (tabName === "battle")  { openBattleTab(); }
  if (tabName === "journal") { renderJournal(); }
  if (tabName === "notes")   { if (typeof renderNotes === "function") renderNotes(); }
  // FB-2: лист стал видимым → пересчитать line-clamp-детект состояний (scrollHeight теперь валиден)
  if (tabName === "sheet")   { if (typeof detectConditionOverflow === "function") setTimeout(detectConditionOverflow, 50); }
  // TOUR-1: авто-старт интерактивного тура при первом заходе на вкладку (sheet/прочее — no-op).
  if (typeof maybeStartTabTour === "function") maybeStartTabTour(tabName);
}

function openDrawer() {
  var drawer = $("side-drawer");
  var overlay = $("drawer-overlay");
  if (drawer) drawer.classList.remove("hidden");
  if (overlay) overlay.classList.remove("hidden");
  // Sync char name
  var nameEl = $("char-name");
  var drawerName = $("drawer-char-name");
  if (nameEl && drawerName) drawerName.textContent = nameEl.value || "Персонаж";
  setTimeout(function() {
    if (drawer) drawer.classList.add("open");
    if (overlay) overlay.classList.add("open");
  }, 10);
}
function closeDrawer() {
  var drawer = $("side-drawer");
  var overlay = $("drawer-overlay");
  if (drawer) drawer.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
  setTimeout(function() {
    if (drawer) drawer.classList.add("hidden");
    if (overlay) overlay.classList.add("hidden");
  }, 300);
}

// Show hamburger when character is loaded
function showCharacterNav() {
  var hamburger = $("nav-hamburger");
  var tabs = $("character-tabs");
  var back = $("header-back");
  if (hamburger) hamburger.classList.remove("hidden");
  if (tabs) tabs.classList.remove("hidden");
  if (back) back.classList.remove("hidden");
}
function hideCharacterNav() {
  var hamburger = $("nav-hamburger");
  var tabs = $("character-tabs");
  var back = $("header-back");
  if (hamburger) hamburger.classList.add("hidden");
  if (tabs) tabs.classList.add("hidden");
  if (back) back.classList.add("hidden");
}

// UI-6: Свайпы — горизонтальные жесты между вкладками + edge-swipe для drawer.
// Порядок вкладок в нижней панели: sheet → spells → inventory → battle.
(function() {
  var SWIPE_TABS = ["sheet", "spells", "inventory", "battle"];
  var TAB_THRESHOLD = 60;   // px по X для смены вкладки
  var Y_TOLERANCE   = 50;   // px по Y — иначе считаем вертикальным скроллом
  var EDGE_ZONE     = 24;   // px от правого края — зона активации drawer
  var DRAWER_THRESHOLD = 50;

  var startX = 0, startY = 0, startTarget = null, startTime = 0;

  function isInteractive(el) {
    if (!el) return false;
    var tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || tag === "button") return true;
    if (el.isContentEditable) return true;
    var node = el;
    while (node && node !== document.body) {
      if (node.classList) {
        if (node.classList.contains("fs-scale-slider")) return true;
        if (node.classList.contains("modal")) return true;
        if (node.classList.contains("side-drawer")) return true;
      }
      try {
        var cs = window.getComputedStyle(node);
        if ((cs.overflowX === "auto" || cs.overflowX === "scroll") && node.scrollWidth > node.clientWidth + 2) {
          return true;
        }
      } catch(e) { window.__catchLog && window.__catchLog('core:isScrollableX', e); }
      node = node.parentNode;
    }
    return false;
  }

  function currentActiveTab() {
    var btn = document.querySelector(".tab-btn.active");
    return btn ? btn.getAttribute("data-tab") : null;
  }

  document.addEventListener("touchstart", function(e) {
    if (!e.touches || e.touches.length !== 1) { startTarget = null; return; }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTarget = e.target;
    startTime = Date.now();
  }, { passive: true });

  document.addEventListener("touchend", function(e) {
    if (!startTarget) return;
    var endX = e.changedTouches[0].clientX;
    var endY = e.changedTouches[0].clientY;
    var dx = endX - startX;
    var dy = endY - startY;
    var dt = Date.now() - startTime;
    var target = startTarget;
    startTarget = null;

    var drawer = $("side-drawer");
    var charScreen = $("screen-character");
    if (!drawer || !charScreen || charScreen.classList.contains("hidden") || !currentId) return;
    if (Math.abs(dy) > Y_TOLERANCE) return;
    if (Math.abs(dx) < DRAWER_THRESHOLD) return;
    if (dt > 600) return;

    // 1) Edge-swipe от правого края → открыть drawer (свайп влево)
    var vw = window.innerWidth || document.documentElement.clientWidth;
    if (startX >= vw - EDGE_ZONE && dx < -DRAWER_THRESHOLD && !drawer.classList.contains("open")) {
      openDrawer();
      return;
    }
    // 2) Закрыть открытый drawer свайпом вправо
    if (drawer.classList.contains("open") && dx > DRAWER_THRESHOLD) {
      closeDrawer();
      return;
    }
    if (drawer.classList.contains("open")) return;

    // 3) Свайпы между вкладками — только когда касание стартовало внутри .tab-content
    if (isInteractive(target)) return;
    var inTabContent = target.closest && target.closest(".tab-content");
    if (!inTabContent) return;
    if (Math.abs(dx) < TAB_THRESHOLD) return;

    var current = currentActiveTab();
    var idx = SWIPE_TABS.indexOf(current);
    if (idx < 0) return;
    var nextIdx = dx < 0 ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= SWIPE_TABS.length) return;
    switchTab(SWIPE_TABS[nextIdx], null);
  }, { passive: true });
})();

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
  openModal("build-picker-modal");
  setTimeout(function(){ var el = $("bp-search"); if (el) el.focus(); }, 50);
}

var BP_ROLE_ICONS = { DPS:"⚔️", Tank:"🛡️", Support:"✨", Control:"🌀", Utility:"🧰" };
var BP_DIFF_LABELS = { 1:"новичку", 2:"среднее", 3:"сложное" };

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
    var roleIcon = BP_ROLE_ICONS[b.role] || "";
    var clsIcon = getClassIcon(b.className);
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
          '<div class="bp-pitch">🎯 ' + escapeHtml(_g.pitch) + '</div>' +
          (_bullets ? '<ul class="bp-bullets">' + _bullets + '</ul>' : '') +
        '</div>';
    }
    return (
      '<div class="bp-card" tabindex="0" role="button" aria-label="' + escapeHtml(b.title) + '" onclick="applyBuild(\'' + b.id + '\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();applyBuild(\'' + b.id + '\')}">' +
        '<div class="bp-card-head">' +
          '<span class="bp-card-class-icon" style="background:' + clsColor + '22;color:' + clsColor + '">' + clsIcon + '</span>' +
          '<span class="bp-card-title">' + highlightMatch(b.title, q) + '</span>' +
          '<span class="bp-role-badge bp-role-' + escapeHtml(b.role || "") + '">' + roleIcon + ' ' + escapeHtml(b.role || "") + '</span>' +
        '</div>' +
        '<div class="bp-card-sub">' + highlightMatch(b.className, q) + (b.subclass ? ' · ' + highlightMatch(b.subclass, q) : '') + '</div>' +
        '<div class="bp-card-summary">' + highlightMatch(b.summary || "", q) + '</div>' +
        guideHtml +
        '<div class="bp-card-meta">' +
          '<span class="bp-diff bp-diff-' + d + '" title="Сложность: ' + (BP_DIFF_LABELS[d]||"") + '">' + diff + '</span>' +
          '<span class="bp-race">🧬 ' + escapeHtml(b.race || "") + '</span>' +
          '<span class="bp-bg">📜 ' + escapeHtml(b.background || "") + '</span>' +
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

// BUILD-6: ESC + focus trap for build picker
(function(){
  document.addEventListener("keydown", function(ev){
    if (ev.key !== "Escape") return;
    var m = document.getElementById("build-picker-modal");
    if (m && m.classList.contains("active")) {
      closeModal("build-picker-modal");
    }
  });
})();

// PERF-2: build-notes-data.js (~530 КБ) грузится лениво — гарантируем заметки ДО
// создания персонажа; если загрузка упала, билд применяется с базовыми текстами.
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
  // Алиасы названий предысторий: контент билдов использует PHB-имена ("Солдат"),
  // а BACKGROUND_SKILLS — старый перевод ("Воин").
  var _bgAliases = {
    "Послушник":"Прислужник", "Шарлатан":"Преступник", "Дикарь":"Чужеземец",
    "Бродяга":"Чужеземец", "Гильд-артист":"Гильдейский ремесленник"
  };
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
    var _bestPreset = null, _bestLen = 0;
    ARMOR_PRESETS.forEach(function(p){
      if (p.id === "none") return;
      var pn = p.name.toLowerCase();
      for (var ei = 0; ei < _eqLow.length; ei++) {
        if (_eqLow[ei].indexOf(pn) >= 0 && pn.length > _bestLen) {
          _bestPreset = p; _bestLen = pn.length;
        }
      }
    });
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
        if (_sp && _sp.name) _spellByName[_sp.name.toLowerCase().trim()] = _sp;
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
      var _PACKS = {
      "набор путешественника": [
        ["Рюкзак", 1, 5, 1, "worn", "Основная сумка. Носится на спине."],
        ["Спальный мешок", 1, 7, 0, "outside", "Приторочен снаружи рюкзака."],
        ["Котелок", 1, 1, 0, "backpack", "Для готовки на костре."],
        ["Трутница", 1, 1, 0, "backpack", "Огниво и трут."],
        ["Факел", 10, 1, 0, "backpack", "Свет 6 м на 1 час."],
        ["Рацион (1 день)", 10, 2, 0, "backpack", "Сухие пайки на день пути."],
        ["Бурдюк (вода)", 1, 5, 0, "belt", "На ремне. Вмещает 4 л воды."],
        ["Верёвка пеньковая (15 м)", 1, 10, 0, "outside", "В петле на рюкзаке."]
      ],
      "набор исследователя": [
        ["Рюкзак", 1, 5, 1, "worn", "Основная сумка."],
        ["Лом", 1, 5, 0, "backpack", "Преимущество на проверки СИЛ при взломе."],
        ["Молоток", 1, 3, 0, "backpack", "Забить колышек."],
        ["Колышки железные", 10, 0.25, 0, "backpack", "Закрепить дверь, верёвку."],
        ["Факел", 10, 1, 0, "backpack", "Свет 6 м на 1 час."],
        ["Трутница", 1, 1, 0, "backpack", "Огниво и трут."],
        ["Рацион (1 день)", 10, 2, 0, "backpack", "Сухие пайки."],
        ["Бурдюк (вода)", 1, 5, 0, "belt", "4 л воды."],
        ["Верёвка пеньковая (15 м)", 1, 10, 0, "outside", "В петле на рюкзаке."]
      ],
      "набор учёного": [
        ["Рюкзак", 1, 5, 1, "worn", "Сумка для книг."],
        ["Книга знаний", 1, 5, 0, "backpack", "Том по теме предыстории."],
        ["Чернильница", 1, 0, 0, "backpack", "Чернила для письма."],
        ["Перо", 1, 0, 0, "backpack", "Гусиное перо."],
        ["Пергамент", 10, 0, 0, "backpack", "Чистые листы."],
        ["Мешочек с песком", 1, 0, 0, "backpack", "Сушит чернила."],
        ["Маленький нож", 1, 0.5, 0, "belt", "На поясе. Заточить перо."]
      ],
      "набор священника": [
        ["Рюкзак", 1, 5, 1, "worn", "Сумка для утвари."],
        ["Одеяло", 1, 3, 0, "backpack", "Тёплое."],
        ["Свеча", 10, 0, 0, "backpack", "Свет 1.5 м на 1 час."],
        ["Трутница", 1, 1, 0, "backpack", "Огниво и трут."],
        ["Кружка для подаяний", 1, 0, 0, "backpack", "Жестяная."],
        ["Палочки благовоний", 2, 0, 0, "backpack", "Для обрядов."],
        ["Облачение", 1, 4, 0, "backpack", "Парадное священное."],
        ["Одеяние", 1, 4, 0, "backpack", "Повседневное."],
        ["Рацион (1 день)", 2, 2, 0, "backpack", "Скромные пайки."],
        ["Бурдюк (вода)", 1, 5, 0, "belt", "4 л."]
      ],
      "набор артиста": [
        ["Рюкзак", 1, 5, 1, "worn", "Сумка для реквизита."],
        ["Спальный мешок", 1, 7, 0, "outside", "Приторочен снаружи."],
        ["Костюм", 2, 4, 0, "backpack", "Сценический наряд."],
        ["Свеча", 5, 0, 0, "backpack", "Освещение."],
        ["Рацион (1 день)", 5, 2, 0, "backpack", "Пайки."],
        ["Бурдюк (вода)", 1, 5, 0, "belt", "4 л."],
        ["Набор для грима", 1, 3, 0, "backpack", "Маски, краски, парики."]
      ],
      "набор подземелий": [
        ["Рюкзак", 1, 5, 1, "worn", "Основная сумка."],
        ["Лом", 1, 5, 0, "backpack", "СИЛ-проверки взлома."],
        ["Молоток", 1, 3, 0, "backpack", ""],
        ["Колышки железные", 10, 0.25, 0, "backpack", ""],
        ["Факел", 10, 1, 0, "backpack", "Свет 6 м, 1 час."],
        ["Трутница", 1, 1, 0, "backpack", ""],
        ["Рацион (1 день)", 10, 2, 0, "backpack", ""],
        ["Бурдюк (вода)", 1, 5, 0, "belt", ""],
        ["Верёвка пеньковая (15 м)", 1, 10, 0, "outside", "В петле."]
      ],
      "набор дипломата": [
        ["Сундук", 1, 25, 0, "stored", "В лагере. Запирающийся."],
        ["Футляры для свитков", 2, 1, 0, "stored", "В сундуке."],
        ["Тёплое одеяло", 1, 3, 0, "stored", "В сундуке."],
        ["Парадная одежда", 1, 6, 0, "stored", "В сундуке."],
        ["Чернильница", 1, 0, 0, "stored", "В сундуке."],
        ["Перо", 1, 0, 0, "stored", "В сундуке."],
        ["Пергамент", 5, 0, 0, "stored", "В сундуке."],
        ["Духи", 1, 0, 0, "stored", "В сундуке."],
        ["Воск", 1, 0, 0, "stored", "В сундуке. Для печати."]
      ],
      "набор взломщика": [
        ["Рюкзак", 1, 5, 1, "worn", "Основная сумка."],
        ["Шарики", 1000, 2, 0, "backpack", "Раскатать на полу — Ловкость для прохода."],
        ["Колокольчик", 1, 0, 0, "backpack", ""],
        ["Свеча", 5, 0, 0, "backpack", ""],
        ["Лом", 1, 5, 0, "backpack", ""],
        ["Молоток", 1, 3, 0, "backpack", ""],
        ["Колышки железные", 10, 0.25, 0, "backpack", ""],
        ["Капюшонный фонарь", 1, 2, 0, "belt", "На ремне. Свет 9 м, 6 часов."],
        ["Масло (фляга)", 2, 1, 0, "backpack", "Для фонаря/поджога."],
        ["Рацион (1 день)", 5, 2, 0, "backpack", ""],
        ["Трутница", 1, 1, 0, "backpack", ""],
        ["Бурдюк (вода)", 1, 5, 0, "belt", ""]
      ]
    };
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
    // Расширенный каталог оружия для билдов (PHB), включая то, чего нет в WEAPON_PRESETS.
    var _EXTRA_WEAPONS = [
      {name:"Двуручный топор", stat:"str", bonus:"+3", damage:"1к12", type:"Режущий", range:"Ближний", notes:"Двуручное, тяжёлое"},
      {name:"Двуручный меч",   stat:"str", bonus:"+3", damage:"2к6",  type:"Режущий", range:"Ближний", notes:"Двуручное, тяжёлое"},
      {name:"Метательный топор",stat:"str",bonus:"+3", damage:"1к6",  type:"Режущий", range:"Ближний/20/60 фт", notes:"Лёгкое, метательное"},
      {name:"Тяжёлый арбалет", stat:"dex", bonus:"+3", damage:"1к10", type:"Колющий", range:"100/400 фт", notes:"Двуручное, тяжёлое, перезарядка"},
      {name:"Лёгкий арбалет",  stat:"dex", bonus:"+3", damage:"1к8",  type:"Колющий", range:"80/320 фт", notes:"Двуручное, дальнобойное, перезарядка"},
      {name:"Ручной арбалет",  stat:"dex", bonus:"+3", damage:"1к6",  type:"Колющий", range:"30/120 фт", notes:"Лёгкое, перезарядка"},
      {name:"Алебарда",        stat:"str", bonus:"+3", damage:"1к10", type:"Режущий", range:"Ближний", notes:"Двуручное, тяжёлое, досягаемость"},
      {name:"Глефа",           stat:"str", bonus:"+3", damage:"1к10", type:"Режущий", range:"Ближний", notes:"Двуручное, тяжёлое, досягаемость"},
      {name:"Боевой посох",    stat:"str", bonus:"+3", damage:"1к6",  type:"Дробящий", range:"Ближний", notes:"Универсальное (1к8)"},
      {name:"Посох",           stat:"str", bonus:"+3", damage:"1к6",  type:"Дробящий", range:"Ближний", notes:"Универсальное (1к8)"},
      {name:"Серп",            stat:"str", bonus:"+3", damage:"1к4",  type:"Режущий", range:"Ближний", notes:"Лёгкое"},
      {name:"Праща",           stat:"dex", bonus:"+3", damage:"1к4",  type:"Дробящий", range:"30/120 фт", notes:"Боеприпасы"},
      {name:"Дубина",          stat:"str", bonus:"+3", damage:"1к4",  type:"Дробящий", range:"Ближний", notes:"Лёгкое"},
      {name:"Палица",          stat:"str", bonus:"+3", damage:"1к8",  type:"Дробящий", range:"Ближний", notes:""},
      {name:"Тяжёлый молот",   stat:"str", bonus:"+3", damage:"2к6",  type:"Дробящий", range:"Ближний", notes:"Двуручное, тяжёлое"},
      {name:"Метательное копьё",stat:"str",bonus:"+3", damage:"1к6",  type:"Колющий", range:"30/120 фт", notes:"Метательное"},
      {name:"Молот",           stat:"str", bonus:"+3", damage:"1к4",  type:"Дробящий", range:"20/60 фт", notes:"Лёгкое, метательное"},
      {name:"Кистень",         stat:"str", bonus:"+3", damage:"1к8",  type:"Дробящий", range:"Ближний", notes:""},
      {name:"Цеп",             stat:"str", bonus:"+3", damage:"1к8",  type:"Дробящий", range:"Ближний", notes:""},
      {name:"Тренчёр",         stat:"str", bonus:"+3", damage:"1к8",  type:"Колющий", range:"Ближний", notes:""},
      {name:"Сабля",           stat:"dex", bonus:"+3", damage:"1к6",  type:"Режущий", range:"Ближний", notes:"Лёгкое, фехтовальное"}
    ];
    // Сравнение со словоформами: берём 5-символьные стеммы каждого слова
    var _stemSet = function(s){
      var arr = String(s).toLowerCase().replace(/[()]/g," ").split(/\s+/);
      var set = {};
      arr.forEach(function(w){ if (w.length >= 4) set[w.substring(0, Math.min(5,w.length))] = 1; });
      return set;
    };
    var _matchByStems = function(presetName, inputName){
      var p = _stemSet(presetName), i = _stemSet(inputName);
      var pk = Object.keys(p);
      if (!pk.length) return false;
      // все стеммы пресета должны присутствовать во входе
      for (var k = 0; k < pk.length; k++) if (!i[pk[k]]) return false;
      return true;
    };
    var _findWeapon = function(name){
      var lo = name.toLowerCase();
      var pools = [];
      if (typeof WEAPON_PRESETS !== "undefined") pools.push(WEAPON_PRESETS);
      pools.push(_EXTRA_WEAPONS);
      // 1. подстрока
      for (var pi = 0; pi < pools.length; pi++) {
        var best = null, bestLen = 0;
        pools[pi].forEach(function(w){
          var pn = w.name.toLowerCase();
          if (lo.indexOf(pn) >= 0 && pn.length > bestLen) { best = w; bestLen = pn.length; }
        });
        if (best) return best;
      }
      // 2. стемминг
      for (var pj = 0; pj < pools.length; pj++) {
        var best2 = null, bestLen2 = 0;
        pools[pj].forEach(function(w){
          if (_matchByStems(w.name, lo) && w.name.length > bestLen2) { best2 = w; bestLen2 = w.name.length; }
        });
        if (best2) return best2;
      }
      return null;
    };
    var _findArmor = function(name){
      if (typeof ARMOR_PRESETS === "undefined") return null;
      var lo = name.toLowerCase();
      var best = null, bestLen = 0;
      ARMOR_PRESETS.forEach(function(p){
        if (p.id === "none") return;
        var pn = p.name.toLowerCase();
        if (lo.indexOf(pn) >= 0 && pn.length > bestLen) { best = p; bestLen = pn.length; }
      });
      return best;
    };
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
  closeModal("build-picker-modal");
  loadCharacter(newChar.id);
  if (typeof showToast === "function") showToast("Билд применён: " + b.title, "success");
  // BUILD-DESC-3: открыть модалку с гайдом по билду сразу после применения.
  if (b.guide) setTimeout(function(){ openBuildGuide(b.id); }, 250);
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
  if (titleEl) titleEl.textContent = "📘 Гайд: " + (b.title || b.className || "");
  function _list(arr, cls, mark) {
    if (!Array.isArray(arr) || !arr.length) return "";
    return '<ul class="bg-list ' + cls + '">' +
      arr.map(function(x){ return '<li><span class="bg-mark">' + mark + '</span> ' + escapeHtml(x) + '</li>'; }).join("") +
      '</ul>';
  }
  var html = "";
  html += '<div class="bg-meta"><span class="bg-cls">' + escapeHtml(b.className || "") + (b.subclass ? ' · ' + escapeHtml(b.subclass) : '') + '</span>';
  if (b.role) html += '<span class="bg-role">' + escapeHtml(b.role) + '</span>';
  html += '</div>';
  if (g.pitch) html += '<div class="bg-pitch">🎯 ' + escapeHtml(g.pitch) + '</div>';
  if (g.playstyle) html += '<section class="bg-section"><h3>⚔️ Стиль игры</h3><p>' + escapeHtml(g.playstyle) + '</p></section>';
  if (Array.isArray(g.strengths) && g.strengths.length) html += '<section class="bg-section"><h3>✅ Сильные стороны</h3>' + _list(g.strengths, "bg-pros", "✓") + '</section>';
  if (Array.isArray(g.weaknesses) && g.weaknesses.length) html += '<section class="bg-section"><h3>⚠️ Слабости</h3>' + _list(g.weaknesses, "bg-cons", "✗") + '</section>';
  if (g.synergy) html += '<section class="bg-section"><h3>🤝 Синергия в партии</h3><p>' + escapeHtml(g.synergy) + '</p></section>';
  if (Array.isArray(g.tips) && g.tips.length) html += '<section class="bg-section"><h3>💡 Советы по игре</h3>' + _list(g.tips, "bg-tips", "•") + '</section>';
  // План развития 1–20 из b.levelUp — полный список по возрастанию уровней.
  if (b.levelUp) {
    var lvLines = [];
    Object.keys(b.levelUp)
      .map(function(k){ return parseInt(k, 10); })
      .filter(function(n){ return !isNaN(n); })
      .sort(function(a, b){ return a - b; })
      .forEach(function(lv){
        var s = b.levelUp[lv];
        if (s && s.headline) lvLines.push('<li><strong>' + lv + ' ур.:</strong> ' + escapeHtml(s.headline) + (s.why ? ' <span class="bg-why">— ' + escapeHtml(s.why) + '</span>' : '') + '</li>');
      });
    if (lvLines.length) html += '<section class="bg-section"><h3>📈 План развития (1–20)</h3><ul class="bg-list bg-levels">' + lvLines.join("") + '</ul></section>';
  }
  if (bodyEl) bodyEl.innerHTML = html;
  openModal("build-guide-modal");
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
  var ALIAS = {
    // тяжёлое оружие
    "великое оружие":"great_weapon_master", "мастер тяжелого оружия":"great_weapon_master",
    // живучесть
    "крепыш":"tough", "крепкий":"tough", "жесткий":"tough", "стойкий":"resilient",
    // удача
    "везунчик":"lucky", "удачливый":"lucky", "счастливчик":"lucky", "удача":"lucky",
    // стрельба
    "меткий стрелок":"sharpshooter", "снайпер":"sharpshooter",
    // инициатива/защита
    "сторожевой":"alert", "бдительный":"alert", "внимательный":"observant",
    "щитарь":"shield_master", "мастер щита":"shield_master",
    // кастеры
    "боевой маг":"war_caster", "заклинатель боя":"war_caster", "боевой кастер":"war_caster", "военная подготовка":"war_caster",
    "родство со стихией":"elemental_adept", "адепт стихий":"elemental_adept",
    // прочее
    "мобильный":"mobile", "двойное владение":"dual_wielder"
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
    for (var i = 0; i < SPELL_DATABASE.length; i++) {
      var sp = SPELL_DATABASE[i];
      if (!sp || !sp.name) continue;
      var nm = sp.name.toLowerCase().trim();
      if (nm === key || nm === alt || (aliased && nm === aliased)) return sp;
    }
    return null;
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
  if (titleEl) titleEl.textContent = "📈 План развития: " + (b.title || b.className || "");
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
      (b.subclass ? ' · ' + escapeHtml(b.subclass) : '') +
      (b.role ? ' · ' + escapeHtml(b.role) : '') +
      (curLevel ? ' · текущий уровень: ' + curLevel : '') + '</div>' +
      rows.join("");
  }
  openModal("build-plan-modal");
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
  if (titleEl) titleEl.textContent = "📈 План класса: " + ch.class;
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
    var meta = escapeHtml(ch.class) +
      (ch.subclass ? ' · ' + escapeHtml(ch.subclass)
                   : ' · подкласс не выбран (фичи архетипа появятся после выбора)') +
      ' · текущий уровень: ' + curLevel;
    bodyEl.innerHTML = '<div class="bp-plan-meta">' + meta + '</div>' + rows.join("");
  }
  openModal("build-plan-modal");
  if (bodyEl) {
    setTimeout(function(){
      var el = bodyEl.querySelector(".bp-plan-row.current");
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "center" });
    }, 60);
  }
}

function createNewCharacter() {
// Глубокое копирование дефолтного шаблона — безопасно, без мутации оригинала
const newChar = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
newChar.id = Date.now();
newChar.schemaVersion = (typeof SCHEMA_VERSION !== 'undefined') ? SCHEMA_VERSION : 2;
// Инициализируем ячейки заклинаний
for (let i = 1; i <= 9; i++) {
  newChar.spells.slots[i] = 0;
  newChar.spells.slotsUsed[i] = 0;
}
characters.push(newChar);
saveToLocal();
loadCharacter(newChar.id);
}
function getClassColor(cls) {
const colors = {
  "Варвар": "#c0392b", "Бард": "#8e44ad", "Жрец": "#f39c12",
  "Друид": "#27ae60", "Воин": "#2980b9", "Монах": "#16a085",
  "Паладин": "#d4ac0d", "Следопыт": "#1e8449", "Плут": "#6c3483",
  "Чародей": "#e74c3c", "Колдун": "#4a235a", "Волшебник": "#1a5276"
};
return colors[cls] || "#c9a227";
}
const CLASS_ICON_SLUGS = {
  "Варвар": "barbarian", "Бард": "bard", "Жрец": "cleric",
  "Друид": "druid", "Воин": "fighter", "Монах": "monk",
  "Паладин": "paladin", "Следопыт": "ranger", "Плут": "rogue",
  "Чародей": "sorcerer", "Колдун": "warlock", "Волшебник": "wizard"
};
function getClassIcon(cls) {
  const slug = CLASS_ICON_SLUGS[cls];
  if (!slug) return '<img class="class-icon-fallback-img" src="assets/avatar-fallback.webp" alt="" aria-hidden="true">';
  return '<img class="class-icon-svg" src="assets/classes/' + slug + '.webp" alt="" aria-hidden="true">';
}
// 'con' переименован в 'constitution.png' — Windows резервирует CON как имя DOS-устройства.
const ABILITY_ICON_FILES = {str:'str', dex:'dex', con:'constitution', int:'int', wis:'wis', cha:'cha'};
function getAbilityIcon(key) {
  var file = ABILITY_ICON_FILES[key];
  if (!file) return '';
  return '<img class="ability-icon-svg" src="assets/abilities/' + file + '.webp" alt="" aria-hidden="true">';
}
// Состояния: id → имя PNG-файла в assets/conditions/. У истощения 6 разных иконок по уровню.
const CONDITION_ICON_SLUGS = {
  blinded:'blinded', charmed:'charmed', deafened:'deafened', frightened:'frightened',
  grappled:'grappled', incapacitated:'incapacitated', invisible:'invisible',
  paralyzed:'paralyzed', petrified:'petrified', poisoned:'poisoned', prone:'prone',
  restrained:'restrained', stunned:'stunned', unconscious:'unconscious',
  exhaustion_1:'exhaustion_1', exhaustion_2:'exhaustion_2', exhaustion_3:'exhaustion_3',
  exhaustion_4:'exhaustion_4', exhaustion_5:'exhaustion_5', exhaustion_6:'exhaustion_6',
  exhaustion:'exhaustion_1'
};
function getConditionIcon(id) {
  var slug = CONDITION_ICON_SLUGS[id];
  if (!slug) return '';
  return '<img class="condition-icon-svg" src="assets/conditions/' + slug + '.webp" alt="" aria-hidden="true">';
}
// Временные эффекты: иконок нет в репозитории (папка assets/effects/ удалена
// после OPT-5 — все ассеты перешли на WebP, для эффектов спрайты так и не
// были подготовлены). Возвращаем пустую строку, чтобы не плодить 404 в
// консоли. Если когда-нибудь добавим — переключить на .webp.
function getEffectIcon(id) {
  return '';
}
// Иконка класса для бейджа в заклинании: ключ CLASS_ICONS_MAP → PNG в assets/classes/
// "both" не имеет файла → fallback на emoji-звезду.
const SPELL_CLASS_ICON_SLUGS = {
  wizard: 'wizard', druid: 'druid', bard: 'bard', cleric: 'cleric',
  paladin: 'paladin', ranger: 'ranger', sorcerer: 'sorcerer', warlock: 'warlock'
};
function getSpellClassIcon(key) {
  var slug = SPELL_CLASS_ICON_SLUGS[key];
  if (!slug) return '<span class="spell-class-emoji" aria-hidden="true">' + (CLASS_ICONS_MAP[key] || '✨') + '</span>';
  return '<img class="spell-class-icon" src="assets/classes/' + slug + '.webp?v=2" alt="" aria-hidden="true">';
}
// Школы магии: RU → slug файла в assets/schools/*.webp
const SCHOOL_ICON_SLUGS = {
  "ограждение": "abjuration",
  "воплощение": "evocation",
  "вызов": "conjuration",
  "прорицание": "divination",
  "очарование": "enchantment",
  "иллюзия": "illusion",
  "некромантия": "necromancy",
  "преобразование": "transmutation"
};
function getSchoolSlug(school) {
  if (!school) return '';
  return SCHOOL_ICON_SLUGS[String(school).toLowerCase().trim()] || '';
}
function getSchoolIcon(school) {
  var slug = getSchoolSlug(school);
  if (!slug) return '';
  return '<img class="school-icon-svg" src="assets/schools/' + slug + '.webp?v=6" alt="" aria-hidden="true">';
}
// Удаляет ведущий emoji (и пробел) из имени состояния — для отображения рядом с SVG-иконкой
function stripLeadingEmoji(name) {
  if (!name) return '';
  return String(name).replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}\uFE0F\u200D]+\s*/u, '');
}
function formatTimeAgo(ts) {
if (!ts) return "";
const diff = Date.now() - ts;
const m = Math.floor(diff / 60000);
const h = Math.floor(diff / 3600000);
const d = Math.floor(diff / 86400000);
if (m < 1) return "только что";
if (m < 60) return m + " мин. назад";
if (h < 24) return h + " ч. назад";
if (d < 7) return d + " д. назад";
return new Date(ts).toLocaleDateString("ru-RU", {day:"numeric", month:"short"});
}
var charSearchQuery = "";
var charSortMode = "updated";
function setCharSort(mode) {
charSortMode = mode;
document.querySelectorAll(".sort-btn").forEach(function(b) { b.classList.remove("active"); });
var btn = $("sort-btn-" + mode);
if (btn) btn.classList.add("active");
renderCharacterList();
}
function setCharSearch(val) {
charSearchQuery = val.toLowerCase().trim();
renderCharacterList();
}
function duplicateCharacter(id, event) {
event.stopPropagation();
const orig = characters.find(function(c) { return c.id === id; });
if (!orig) return;
const copy = JSON.parse(JSON.stringify(orig));
copy.id = Date.now();
copy.name = (orig.name || "Без имени") + " (копия)";
copy.updatedAt = Date.now();
characters.push(copy);
saveToLocal();
renderCharacterList();
}
function exportOneCharacter(id, event) {
event.stopPropagation();
var char = characters.find(function(c) { return c.id === id; });
if (!char) return;
// FEAT-1 доработка: срез HP-истории именно этого персонажа.
var charHp = (typeof hpHistory !== 'undefined' && Array.isArray(hpHistory))
  ? hpHistory.filter(function(h) { return h && h.charId === id; })
  : [];
var data = JSON.stringify({
  app: "dnd-sheet",
  appVersion: (typeof APP_VERSION !== 'undefined') ? APP_VERSION : "",
  schemaVersion: (typeof SCHEMA_VERSION !== 'undefined') ? SCHEMA_VERSION : (char.schemaVersion || 0),
  exportedAt: new Date().toISOString(),
  characters: [char],
  hpHistory: charHp
}, null, 2);
var blob = new Blob([data], { type: "application/json" });
var a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = (char.name || "персонаж").replace(/[^a-zA-Zа-яА-Я0-9]/g, "_") + ".json";
a.click();
}
function updateCharCounter() {
var el = $("char-count");
if (!el) return;
var total = characters.length;
var filtered2 = characters.filter(function(c) {
  if (!charSearchQuery) return true;
  return (c.name || "").toLowerCase().includes(charSearchQuery) ||
         (c.class || "").toLowerCase().includes(charSearchQuery) ||
         (c.race || "").toLowerCase().includes(charSearchQuery);
});
if (charSearchQuery && filtered2.length !== total) {
  el.textContent = filtered2.length + " из " + total;
} else {
  el.textContent = total > 0 ? total + " шт." : "";
}
}
var dragSrcId = null;
function onDragStart(e, id) { dragSrcId = id; e.dataTransfer.effectAllowed = "move"; }
function onDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }
function onDrop(e, targetId) {
e.preventDefault();
if (dragSrcId === targetId) return;
var srcIdx = characters.findIndex(function(c) { return c.id === dragSrcId; });
var tgtIdx = characters.findIndex(function(c) { return c.id === targetId; });
if (srcIdx < 0 || tgtIdx < 0) return;
var moved = characters.splice(srcIdx, 1)[0];
characters.splice(tgtIdx, 0, moved);
saveToLocal();
renderCharacterList();
}
function renderCharacterList() {
const list = $("character-list");
if (!list) return;
list.innerHTML = "";
updateCharCounter();
var filtered = characters.filter(function(c) {
  if (!charSearchQuery) return true;
  return (c.name || "").toLowerCase().includes(charSearchQuery) ||
         (c.class || "").toLowerCase().includes(charSearchQuery) ||
         (c.race || "").toLowerCase().includes(charSearchQuery);
});
filtered = filtered.slice().sort(function(a, b) {
  if (charSortMode === "name") return (a.name || "").localeCompare(b.name || "", "ru");
  if (charSortMode === "level") return (b.level || 1) - (a.level || 1);
  if (charSortMode === "class") return (a.class || "").localeCompare(b.class || "", "ru");
  return (b.updatedAt || b.id) - (a.updatedAt || a.id);
});
if (filtered.length === 0) {
  list.innerHTML = characters.length === 0
    ? "<div class=\"empty-list\">📭 Список пуст. Создайте персонажа!</div>"
    : "<div class=\"empty-list\">🔍 Ничего не найдено</div>";
  return;
}
filtered.forEach(function(char) {
const div = document.createElement("div");
div.className = "char-card";
div.draggable = true;
div.addEventListener("dragstart", function(e) { onDragStart(e, char.id); div.style.opacity="0.5"; });
div.addEventListener("dragend", function() { div.style.opacity="1"; });
div.addEventListener("dragover", onDragOver);
div.addEventListener("drop", function(e) { onDrop(e, char.id); });
div.onclick = function() { loadCharacter(char.id); };
const conditionsCount = (char.conditions ? char.conditions.length : 0) + (char.effects ? char.effects.length : 0);
const hpCurrent = char.combat.hpCurrent || 0;
const hpMax = char.combat.hpMax || 0;
const hpPercent = hpMax > 0 ? Math.min(100, Math.round((hpCurrent / hpMax) * 100)) : 100;
const hpColor = hpPercent > 60 ? "#4da843" : hpPercent > 30 ? "#e67e22" : "#e74c3c";
const classColor = getClassColor(char.class);
const classIcon = getClassIcon(char.class);
const timeAgo = char.updatedAt ? "<span class=\"char-time-ago\">" + formatTimeAgo(char.updatedAt) + "</span>" : "";
div.style.borderLeftColor = classColor;
div.innerHTML = "<div class=\"char-card-header\">" +
  (char.avatar
    ? "<div class=\"char-card-class-icon char-card-avatar\" style=\"background:" + classColor + "22;\"><img src=\"" + char.avatar + "\" alt=\"\"></div>"
    : "<div class=\"char-card-class-icon\" style=\"background:" + classColor + "22;\">" + classIcon + "</div>") +
  "<div class=\"char-card-title\">" +
    "<h4 class=\"char-card-name\">" + escapeHtml(char.name || "Без имени") + "</h4>" +
    "<div class=\"char-card-sub\">" + escapeHtml((char.classes && char.classes.length > 1 ? getClassLabel(char) : char.class) || "Класс не указан") + (char.race ? " · " + escapeHtml(char.race) : "") + (char.subclass && (!char.classes || char.classes.length <= 1) ? " · " + escapeHtml(char.subclass) : "") + "</div>" +
    (char.background ? "<div class=\"char-card-bg\">📜 " + escapeHtml(char.background) + "</div>" : "") +
  "</div>" +
"</div>" +
"<div class=\"char-card-stats\">" +
  "<span class=\"char-stat-badge\">⭐ " + (char.level || 1) + " ур.</span>" +
  "<span class=\"char-stat-badge-hp\" style=\"color:" + hpColor + "; border-color:" + hpColor + "55; background:" + hpColor + "18;\">❤️ " + hpCurrent + "/" + hpMax + "</span>" +
  "<span class=\"char-stat-badge\">🛡️ " + (char.combat.ac || 10) + "</span>" +
  (conditionsCount > 0 ? "<span class=\"char-stat-badge\" style=\"background:var(--condition-active);border-color:var(--condition-border);\">⚠️ " + conditionsCount + "</span>" : "") +
  "<span class=\"char-alignment" + (char.alignment ? "" : " char-alignment-empty") + "\">" + escapeHtml(char.alignment || "Мировоззрение не выбрано") + "</span>" +
  timeAgo +
"</div>" +
"<div class=\"char-card-actions\">" +
  "<button class=\"char-copy-btn\" onclick=\"exportOneCharacter(" + char.id + ", event)\" title=\"Экспорт JSON\">↓</button>" +
  "<button class=\"char-copy-btn\" onclick=\"exportCharacterPDF(" + char.id + ", event)\" title=\"Экспорт PDF\">📄</button>" +
  "<button class=\"char-copy-btn\" onclick=\"duplicateCharacter(" + char.id + ", event)\" title=\"Дублировать\">⧉</button>" +
  "<button class=\"char-delete-btn\" onclick=\"event.stopPropagation(); deleteCharacter(" + char.id + ")\">✕</button>" +
"</div>";
list.appendChild(div);
});
}
function deleteCharacter(id) {
var char = characters.find(function(c) { return c.id === id; });
var name = char ? (char.name || "этого персонажа") : "этого персонажа";
showConfirmModal(
  "Удалить персонажа?",
  "«" + name + "» будет удалён без возможности восстановления.",
  function() {
    characters = characters.filter(function(c) { return c.id !== id; });
    saveToLocal();
    renderCharacterList();
  }
);
}
function showConfirmModal(title, text, onConfirm, confirmLabel, opts) {
var modal = $("confirm-modal");
var titleEl = $("confirm-modal-title");
var textEl = $("confirm-modal-text");
var confirmBtn = $("confirm-modal-ok");
var cancelBtn = $("confirm-modal-cancel");
if (!modal || !confirmBtn || !cancelBtn) return;
if (titleEl) titleEl.textContent = title;
if (textEl) textEl.textContent = text;
// Модалка общая с удалениями: по умолчанию деструктивный «🗑️ Удалить».
// Иконку и стиль OK-кнопки сбрасываем на каждый показ, чтобы не-деструктивные
// вызовы (4-й арг confirmLabel + opts.danger/icon, напр. FB-1 «Разблокировать»)
// не «протекали» в последующие.
var iconEl = modal.querySelector(".confirm-modal-icon");
if (iconEl) iconEl.textContent = (opts && opts.icon) || "🗑️";
modal.classList.add("active");
var newConfirm = confirmBtn.cloneNode(true);
newConfirm.textContent = confirmLabel || "Удалить";
newConfirm.classList.toggle("confirm-btn-ok--safe", !!(opts && opts.danger === false));
confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
var newCancel = cancelBtn.cloneNode(true);
cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
$("confirm-modal-ok").addEventListener("click", function() {
  modal.classList.remove("active");
  onConfirm();
});
$("confirm-modal-cancel").addEventListener("click", function() {
  modal.classList.remove("active");
});
modal.addEventListener("click", function(e) {
  if (e.target === modal) modal.classList.remove("active");
}, { once: true });
}
function safeSet(id, value) {
const el = $(id);
if (el) el.value = value;
}
function safeSetChecked(id, checked) {
const el = $(id);
if (el) el.checked = checked;
}

// ============================================
// 🔧 ИСПРАВЛЕНИЕ: Подкласс сохраняется + hpCurrent как число
// ============================================
function loadCharacter(id) {
if (window.AppLog) AppLog.action('character', 'загрузка персонажа', { id: id });
// BUGFIX-8: чистим pending-таймеры из других модулей, чтобы они не «дострелили»
// в контексте нового персонажа (notes-поиск, индикатор сохранения, ритуал).
try {
  if (typeof window !== 'undefined') {
    if (window._notesSearchTimer) { clearTimeout(window._notesSearchTimer); window._notesSearchTimer = null; }
    if (window._notesSaveTimer)   { clearTimeout(window._notesSaveTimer);   window._notesSaveTimer   = null; }
    if (window._ritualTimer) {
      clearInterval(window._ritualTimer);
      window._ritualTimer = null;
      var _rit = (typeof document !== 'undefined') ? document.getElementById('status-ritual') : null;
      if (_rit && _rit.classList) _rit.classList.add('hidden');
    }
  }
} catch (e) { if (typeof console !== 'undefined') console.error('[loadCharacter] clear-timers:', e); }
currentId = id;
const char = characters.find(function(c) { return c.id === id; });
if (!char) return;
// UI6-1: акцент следует за классом загружаемого персонажа (авто-режим).
// Раньше переключение персонажей оставляло акцент от предыдущего —
// _refreshAccent звался только onchange класса и на DOMContentLoaded.
if (typeof _refreshAccent === 'function') _refreshAccent();

// Load per-character party data
if (char.party) {
  PARTY_DATA = char.party;
  if (!PARTY_DATA.allies)   PARTY_DATA.allies   = [];
  if (!PARTY_DATA.monsters) PARTY_DATA.monsters = [];
  if (!PARTY_DATA.npcs)     PARTY_DATA.npcs     = [];
} else {
  PARTY_DATA = { allies: [], monsters: [], npcs: [] };
}

// Load per-character battle data
if (char.battle) {
  BATTLE_DATA = char.battle;
} else {
  BATTLE_DATA = { active: false, participants: [], currentTurn: 0 };
}
// Миграция к мультиклассу
migrateToMulticlass(char);
const savedSubclass = char.subclass || "";
safeSet("char-name", char.name);
safeSet("char-level", char.level);
safeSet("char-exp", char.exp || 0);
safeSet("char-class", char.class);
updateSubclassOptions();
safeSet("char-subclass", savedSubclass);
safeSet("char-race", char.race);
safeSet("char-background", char.background || "");
if (typeof renderBuildBadge === "function") renderBuildBadge();
safeSet("char-alignment", char.alignment || "");
safeSet("char-size", char.size || "Средний");
safeSet("char-speed", char.speed || "30 фт");
safeSet("val-str", char.stats.str);
safeSet("val-dex", char.stats.dex);
safeSet("val-con", char.stats.con);
safeSet("val-int", char.stats.int);
safeSet("val-wis", char.stats.wis);
safeSet("val-cha", char.stats.cha);
safeSet("combat-ac", char.combat.ac);
safeSet("hp-max", char.combat.hpMax);
safeSet("hp-current", char.combat.hpCurrent);
safeSet("hp-temp", char.combat.hpTemp);
safeSet("hp-dice", char.combat.hpDice);
safeSet("hp-dice-spent", char.combat.hpDiceSpent || 0);
safeSet("combat-speed", char.combat.speed || "30 фт");
// Языки и инструменты рендерятся через renderLanguages()/renderTools() ниже
safeSet("coin-cp", char.coins.cp);
safeSet("coin-sp", char.coins.sp);
safeSet("coin-ep", char.coins.ep);
safeSet("coin-gp", char.coins.gp);
safeSet("coin-pp", char.coins.pp);
safeSet("char-notes", char.notes || "");
safeSet("char-features", char.features || "");
safeSet("char-appearance", char.appearance || "");
safeSet("magic-items", char.magicItems || "");
safeSet("spell-stat", char.spells.stat || "");
// Sync spell stat button highlight
const _statVal = char.spells.stat || "";
["int","wis","cha"].forEach(function(s){ var b=$("sc-btn-"+s); if(b) b.classList.remove("active"); });
if(_statVal==="ИНТ" && $("sc-btn-int")) $("sc-btn-int").classList.add("active");
if(_statVal==="МУД" && $("sc-btn-wis")) $("sc-btn-wis").classList.add("active");
if(_statVal==="ХАР" && $("sc-btn-cha")) $("sc-btn-cha").classList.add("active");
// Доспехи и оружие рендерятся через renderArmorProf()/renderWeaponProf() ниже
if(char.saves) {
Object.keys(char.saves).forEach(function(key) {
safeSetChecked("save-prof-" + key, char.saves[key]);
});
}
if(char.skills) {
Object.keys(char.skills).forEach(function(key) {
safeSetChecked("skill-prof-" + key, char.skills[key]);
});
}
calcStats();
loadExpertise();
// Рендер языков и инструментов (категории + источники)
if (typeof renderLanguages === "function") renderLanguages();
if (typeof renderTools === "function") renderTools();
if (typeof renderArmorProf === "function") renderArmorProf();
if (typeof renderWeaponProf === "function") renderWeaponProf();
calcCoinWeight();
calcSpellStats();
recalculateHP();
loadConditions();
loadEffects();
updateClassFeatures();
renderClassResources();
// Restore armor select
var armorId = char.combat.armorId || "none";
safeSet("char-armor", armorId);
safeSetChecked("char-shield", char.combat.hasShield || false);
if (armorId !== "custom") { setTimeout(onArmorChange, 0); }
calculateAC();
// Restore HP max manual field
var hpMaxEl = $("hp-max-manual");
if (hpMaxEl) hpMaxEl.value = char.combat.hpMax || "";
// Show race bonuses + расовые доп. выборы
setTimeout(function() {
  onRaceChange();
  if (typeof renderRaceExtras === "function") renderRaceExtras();
}, 0);
// Обновить состояние селектора подкласса (с учётом текущего уровня)
setTimeout(updateSubclassOptions, 0);
// Применить блокировку основной информации (мастер создания)
setTimeout(function() { if (typeof applyBasicLockUI === "function") applyBasicLockUI(); }, 0);
renderWeapons();
updateAllStatDisplays();
renderSpellSlots();
renderMySpells();
renderInventory();
updateCoinTotal();
updateSlotsDisplay();
updateStatusBar();
updateConcentrationDisplay();
updateHPDisplay();
loadDeathSaves();
renderCompanions();
renderJournal();
renderTakenFeats();
renderResistances();
// Re-render party and battle with character-specific data
renderMyChar();
renderAllies();
renderNPCs();
renderMonsters();
renderSheetAvatar();
if (typeof updateLevelDownVisibility === 'function') updateLevelDownVisibility();
showScreen("character");
// Вход в персонажа всегда открывает «Лист персонажа». switchTab()
// централизованно сбрасывает .active у tab-content, кнопок нижнего
// таб-бара И пунктов сайдбара/drawer (.drawer-item-active), плюс
// скроллит наверх. Раньше тут была ручная копия логики, которая не
// трогала .drawer-item → на desktop/tablet сайдбар подсвечивал прошлую
// вкладку (напр. «Заклинания»), хотя контент показывал лист персонажа.
try { localStorage.removeItem("dnd_last_tab"); } catch(e) { window.__catchLog && window.__catchLog('core:loadCharacter-clearLastTab', e); }
switchTab("sheet");
// HELP-4: первый вход в любого персонажа запускает тур по листу (если ещё не пройден).
if (typeof maybeStartSheetTour === 'function') maybeStartSheetTour();
}

// DATA-2: построение конверта полного бэкапа — общая точка для exportData()
// и снапшотов app-backup.js. userSpells — только пользовательские заклинания
// (не из базы spells.js), как в saveToLocal().
function _buildExportPayload() {
  var baseIds = new Set((typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.map(function(s){ return s.id; }) : []);
  var userSpells = (typeof SPELL_DATABASE !== 'undefined' && Array.isArray(SPELL_DATABASE))
    ? SPELL_DATABASE.filter(function(s){ return !baseIds.has(s.id); }) : [];
  return {
    app: "dnd-sheet",
    appVersion: (typeof APP_VERSION !== 'undefined') ? APP_VERSION : "",
    schemaVersion: (typeof SCHEMA_VERSION !== 'undefined') ? SCHEMA_VERSION : 0,
    exportedAt: new Date().toISOString(),
    characters: characters,
    hpHistory: (typeof hpHistory !== 'undefined' && Array.isArray(hpHistory)) ? hpHistory : [],
    userSpells: userSpells
  };
}
function exportData() {
// FEAT-1 доработка: полный бэкап — конверт со всеми персонажами И всей
// HP-историей (importData принимает и голый массив, и конверт).
const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_buildExportPayload()));
const downloadAnchorNode = document.createElement("a");
downloadAnchorNode.setAttribute("href", dataStr);
downloadAnchorNode.setAttribute("download", "dnd_backup_" + new Date().toISOString().slice(0,10) + ".json");
document.body.appendChild(downloadAnchorNode);
downloadAnchorNode.click();
downloadAnchorNode.remove();
}
// BUGFIX-3: валидация импорта
var IMPORT_MAX_BYTES = 10 * 1024 * 1024; // 10 МБ — защита от случайного OOM
function _isValidImportedChar(c) {
  if (!c || typeof c !== 'object') return false;
  // Допускаем как одноклассовых (class:string), так и мультикласс (classes:array)
  var hasClass = (typeof c.class === 'string' && c.class) ||
                 (Array.isArray(c.classes) && c.classes.length > 0 &&
                  c.classes.every(function(e){ return e && typeof e.class === 'string' && typeof e.level === 'number'; }));
  var lvl = (typeof c.level === 'number' && c.level >= 1 && c.level <= 20);
  return hasClass && lvl;
}
function _isValidImportedSpell(s) {
  if (!s || typeof s !== 'object') return false;
  return typeof s.name === 'string' && s.name &&
         typeof s.level === 'number' && s.level >= 0 && s.level <= 9;
}
// FEAT-1: схема-толерантный разбор импорта. Принимает голый массив
// [char,...] (полные бэкапы из exportData) либо обёртку
// { characters:[...], spells?:[...] } (из exportOneCharacter). Иначе null.
function _extractCharsFromImport(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.characters)) return parsed.characters;
  return null;
}
// DATA-2: применение полного бэкапа (конверт exportData / снапшот app-backup.js).
// Заменяет персонажей, HP-историю и пользовательские заклинания. Конверты без
// userSpells (бэкапы до v3.25) текущие заклинания не трогают.
function _applyFullRestore(imported, validChars) {
  characters = validChars.map(migrateCharacter);
  // FEAT-1 доработка: «Заменить всё» сохраняет id персонажей, поэтому
  // HP-историю из конверта восстанавливаем как есть (только для импортируемых).
  if (imported && Array.isArray(imported.hpHistory)) {
    var _ids = {};
    characters.forEach(function(c){ _ids[c.id] = true; });
    hpHistory = imported.hpHistory.filter(function(h){ return h && _ids[h.charId]; }).slice(0, 300);
  }
  if (imported && Array.isArray(imported.userSpells)) {
    var validSpells = imported.userSpells.filter(_isValidImportedSpell);
    SPELL_DATABASE = ((typeof SPELLS_BASE !== 'undefined') ? SPELLS_BASE.slice() : []).concat(validSpells);
  }
  saveToLocal();
  renderCharacterList();
}
function importData(input) {
const file = input?.files?.[0];
if (!file) return;
if (file.size > IMPORT_MAX_BYTES) {
  showToast("Файл слишком большой (макс. " + Math.round(IMPORT_MAX_BYTES/1024/1024) + " МБ)", "error");
  input.value = "";
  return;
}
const reader = new FileReader();
reader.onload = function(e) {
let imported;
try {
  imported = JSON.parse(e.target.result);
} catch (err) {
  showToast("Файл повреждён или это не JSON", "error");
  input.value = "";
  return;
}
var importedChars = _extractCharsFromImport(imported);
if (!importedChars) {
  showToast("Неверный формат: ожидался массив или { characters: [...] }", "error");
  input.value = "";
  return;
}
var valid = importedChars.filter(_isValidImportedChar);
var skipped = importedChars.length - valid.length;
if (valid.length === 0) {
  showToast("В файле нет валидных персонажей", "error");
  input.value = "";
  return;
}
var msg = "Загрузить " + valid.length + " персонаж(а/ей)? Все текущие будут заменены.";
if (skipped > 0) msg += " Пропущено повреждённых: " + skipped + ".";
showConfirmModal("Импорт персонажей", msg, function() {
  // DATA-2: страховочный снапшот текущего состояния перед заменой всего.
  // Конверт строится синхронно внутри вызова — фиксирует состояние ДО замены.
  if (typeof createBackupSnapshot === "function") {
    try { createBackupSnapshot("pre-import").catch(function(){}); }
    catch(e) { window.__catchLog && window.__catchLog('core:pre-import-backup', e); }
  }
  _applyFullRestore(imported, valid);
  showToast("Загружено: " + characters.length + (skipped > 0 ? " (пропущено " + skipped + ")" : ""), "success");
});
input.value = "";
};
reader.onerror = function() { showToast("Ошибка чтения файла", "error"); input.value = ""; };
reader.readAsText(file);
}
// FEAT-1: не разрушающий импорт персонажа(ей). Добавляет в текущий список,
// не затрагивая существующих. Свежие id (защита от коллизий) + миграция схемы.
function importOneCharacter(input) {
const file = input?.files?.[0];
if (!file) return;
if (file.size > IMPORT_MAX_BYTES) {
  showToast("Файл слишком большой (макс. " + Math.round(IMPORT_MAX_BYTES/1024/1024) + " МБ)", "error");
  input.value = "";
  return;
}
const reader = new FileReader();
reader.onload = function(e) {
let parsed;
try {
  parsed = JSON.parse(e.target.result);
} catch (err) {
  showToast("Файл повреждён или это не JSON", "error");
  input.value = "";
  return;
}
var importedChars = _extractCharsFromImport(parsed);
if (!importedChars) {
  showToast("Неверный формат: ожидался массив или { characters: [...] }", "error");
  input.value = "";
  return;
}
var valid = importedChars.filter(_isValidImportedChar);
var skipped = importedChars.length - valid.length;
if (valid.length === 0) {
  showToast("В файле нет валидных персонажей", "error");
  input.value = "";
  return;
}
var msg = "Добавить " + valid.length + " персонаж(а/ей) в список? Текущие не будут затронуты.";
if (skipped > 0) msg += " Пропущено повреждённых: " + skipped + ".";
showConfirmModal("Импорт персонажа", msg, function() {
  var nextId = Date.now();
  var idMap = {};
  valid.forEach(function(c) {
    var oldId = c.id;
    var nc = migrateCharacter(JSON.parse(JSON.stringify(c)));
    while (characters.some(function(x) { return x.id === nextId; })) nextId++;
    nc.id = nextId++;
    nc.updatedAt = Date.now();
    idMap[oldId] = nc.id;
    characters.push(nc);
  });
  // FEAT-1 доработка: восстановить HP-историю импортированных персонажей,
  // перепривязав записи на новые id (защита от коллизий не ломает связь).
  var addedHp = 0;
  if (parsed && Array.isArray(parsed.hpHistory)) {
    parsed.hpHistory.forEach(function(h) {
      if (!h || typeof h !== 'object') return;
      var mapped = idMap.hasOwnProperty(h.charId) ? idMap[h.charId] : null;
      if (mapped == null && valid.length === 1) mapped = idMap[valid[0].id];
      if (mapped == null) return;
      hpHistory.push({ from: h.from, to: h.to, delta: h.delta, source: h.source, time: h.time, charId: mapped });
      addedHp++;
    });
    if (addedHp && hpHistory.length > 300) hpHistory = hpHistory.slice(0, 300);
  }
  saveToLocal();
  renderCharacterList();
  showToast("Добавлено: " + valid.length + (skipped > 0 ? " (пропущено " + skipped + ")" : "") +
            (addedHp ? " · HP-история: " + addedHp : ""), "success");
});
input.value = "";
};
reader.onerror = function() { showToast("Ошибка чтения файла", "error"); input.value = ""; };
reader.readAsText(file);
}
function exportSpells() {
const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SPELL_DATABASE));
const downloadAnchorNode = document.createElement("a");
downloadAnchorNode.setAttribute("href", dataStr);
downloadAnchorNode.setAttribute("download", "dnd_spells_" + new Date().toISOString().slice(0,10) + ".json");
document.body.appendChild(downloadAnchorNode);
downloadAnchorNode.click();
downloadAnchorNode.remove();
}
function importSpells(input) {
const file = input?.files?.[0];
if (!file) return;
if (file.size > IMPORT_MAX_BYTES) {
  showToast("Файл слишком большой (макс. " + Math.round(IMPORT_MAX_BYTES/1024/1024) + " МБ)", "error");
  input.value = "";
  return;
}
const reader = new FileReader();
reader.onload = function(e) {
let imported;
try {
  imported = JSON.parse(e.target.result);
} catch (err) {
  showToast("Файл повреждён или это не JSON", "error");
  input.value = "";
  return;
}
if (!Array.isArray(imported)) {
  showToast("Неверный формат: ожидался массив заклинаний", "error");
  input.value = "";
  return;
}
var validSpells = imported.filter(_isValidImportedSpell);
var skippedSpells = imported.length - validSpells.length;
if (validSpells.length === 0) {
  showToast("В файле нет валидных заклинаний", "error");
  input.value = "";
  return;
}
var msgSp = "Загрузить " + validSpells.length + " заклинаний? Текущая база будет заменена.";
if (skippedSpells > 0) msgSp += " Пропущено повреждённых: " + skippedSpells + ".";
showConfirmModal("Импорт заклинаний", msgSp, function() {
  SPELL_DATABASE = validSpells;
  saveToLocal();
  showToast("Загружено: " + validSpells.length + (skippedSpells > 0 ? " (пропущено " + skippedSpells + ")" : ""), "success");
});
input.value = "";
};
reader.onerror = function() { showToast("Ошибка чтения файла", "error"); input.value = ""; };
reader.readAsText(file);
}


// ============================================================
// УНИВЕРСАЛЬНЫЕ TOAST-УВЕДОМЛЕНИЯ (замена alert)
// type: 'success' | 'error' | 'warn' | 'info'
// ============================================================
function showToast(msg, type) {
  var container = $("hp-toast-container");
  if (!container) return;
  var t = type || "info";
  var toast = document.createElement("div");
  toast.className = "hp-toast app-toast app-toast-" + t;
  var icons = { success:"✅", error:"❌", info:"ℹ️", warn:"⚠️" };
  toast.innerHTML = "<span style='margin-right:6px'>" + (icons[t] || "ℹ️") + "</span><span>" + escapeHtml(String(msg)) + "</span>";
  container.appendChild(toast);
  toast._fadeTimer   = setTimeout(function() { toast.classList.add("hp-toast-fade"); }, 2200);
  toast._removeTimer = setTimeout(function() { if (toast.parentNode) toast.remove(); }, 2700);
}

function openHPHistory() {
const modal = $("hp-history-modal");
if (!modal) return;
const list = $("hp-history-list");
if (!list) return;
// История только текущего персонажа. Унаследованные записи без charId
// (созданы до v3.15.3) показываем как общие — их немного и они быстро
// вытесняются (глобальный лимит лога — 30).
var rows = hpHistory.filter(function(e) {
  return e && (e.charId === currentId || e.charId == null);
});
if (rows.length === 0) {
list.innerHTML = "<div class=\"hph-empty\">История пуста</div>";
} else {
list.innerHTML = rows.map(function(e) {
const cls = e.delta > 0 ? "hph-heal" : "hph-dmg";
const sign = e.delta > 0 ? "+" : "";
return "<div class=\"hph-row\">" +
"<span class=\"hph-time\">" + e.time + "</span>" +
"<span class=\"hph-source\">" + escapeHtml(e.source) + "</span>" +
"<span class=\"hph-nums\">" + e.from + " → " + e.to + "</span>" +
"<span class=\"hph-delta " + cls + "\">" + sign + e.delta + "</span>" +
"</div>";
}).join("");
}
modal.classList.add("active");
}

function closeHPHistory() {
const modal = $("hp-history-modal");
if (modal) modal.classList.remove("active");
}

// ── Блок статуса версии ──
function updateVersionBlock(hasUpdate, worker) {
  if (hasUpdate && worker) window._swUpdateWorker = worker;
  if (!hasUpdate && window._swUpdateWorker) { hasUpdate = true; worker = window._swUpdateWorker; }
  var row = $('app-version-row');
  var badge = $('app-version-badge');
  var status = $('app-version-status');
  var ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '?';
  if (!row || !badge || !status) return;
  badge.textContent = 'v' + ver;
  if (hasUpdate) {
    row.classList.add('has-update');
    var latest = (typeof APP_CHANGELOG !== 'undefined' && APP_CHANGELOG.length > 0) ? APP_CHANGELOG[0] : null;
    var count = latest ? latest.changes.length : 0;
    status.innerHTML = 'Доступно обновление' + (count ? ' (' + count + ' изменений)' : '') + ' <button class="app-version-update-btn" id="version-install-btn">Установить</button>';
    var btn = $('version-install-btn');
    if (btn && worker) {
      btn.addEventListener('click', function() {
        btn.textContent = 'Обновляем...';
        btn.disabled = true;
        worker.postMessage({ type: 'SKIP_WAITING' });
      });
    }
  } else {
    row.classList.remove('has-update');
    status.innerHTML = '<span class="version-ok">Актуальная версия ✓</span>';
  }
}

