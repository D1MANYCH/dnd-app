// ============================================================
// КЛАССОВЫЕ ВЫБОРЫ — Стили боя, Метамагия, Воззвания, Экспертиза и т.д.
// PHB 2014 (D&D 5e)
// ============================================================
// Хранение в char.classChoices[className][choiceId] = string | string[]
// Подключается ПОСЛЕ data.js, до app-combat.js (но используется в updateClassFeatures)
// ============================================================

// ── Стили боя (Воин/Паладин/Следопыт) ──────────────────────────
var FIGHTING_STYLES = {
  "archery":     {name:"Стрельба",        desc:"+2 к броскам атаки дальнобойным оружием."},
  "defense":     {name:"Защита",          desc:"+1 КД, пока вы носите доспех."},
  "dueling":     {name:"Дуэлянт",         desc:"+2 к урону одноручным оружием, если в другой руке нет оружия."},
  "great-weapon":{name:"Двуручный бой",   desc:"Перебрасывайте 1 и 2 на кубике урона двуручным оружием (новый результат принимаете)."},
  "protection":  {name:"Защитник",        desc:"Реакция: помеха атакующему по союзнику в 5 фт. Требуется щит."},
  "two-weapon":  {name:"Двуоружный бой",  desc:"Добавляете мод. характеристики к урону второй атаки бонусным действием."}
};

// ── Метамагия чародея (PHB 2014, 8 опций) ──────────────────────
var SORCERER_METAMAGIC = {
  "careful":   {name:"Бережное заклинание",   desc:"Тратите 1 оч. чародея: выбранные существа автоматически проходят спасбросок от вашего заклинания (число = мод. ХАР, мин 1)."},
  "distant":   {name:"Дальнобойное заклинание", desc:"1 оч.: удваиваете дальность заклинания. Заклинания с дальностью «касание» получают дальность 30 фт."},
  "empowered": {name:"Усиленное заклинание",  desc:"1 оч.: перебрасываете до мод. ХАР кубиков урона заклинания (новый результат)."},
  "extended":  {name:"Продлённое заклинание", desc:"1 оч.: длительность заклинания (мин 1 минута) удваивается, до 24 часов."},
  "heightened":{name:"Возвышенное заклинание", desc:"3 оч.: одна цель получает помеху на первый спасбросок против заклинания."},
  "quickened": {name:"Ускоренное заклинание", desc:"2 оч.: время сотворения заклинания (1 действие) становится бонусным действием."},
  "subtle":    {name:"Незримое заклинание",   desc:"1 оч.: сотворяете заклинание без вербальных и соматических компонентов."},
  "twinned":   {name:"Сдвоенное заклинание",  desc:"Оч. = уровень заклинания (мин 1): заклинание с одной целью нацеливается на ещё одну в дальности."}
};

// ── Пактный дар колдуна ────────────────────────────────────────
var WARLOCK_PACT_BOONS = {
  "chain": {name:"Пакт Цепи",     desc:"Получаете заклинание Find Familiar. Фамильяр может принимать форму квазита, псевдодракона, спрайта или империума. Можете жертвовать своей атакой, чтобы фамильяр атаковал реакцией."},
  "blade": {name:"Пакт Клинка",   desc:"Призываете пактовое оружие в свободную руку (любое оружие ближнего боя). Считаетесь владеющим им. Можно превращать обычное оружие в пактовое за ритуал 1 час."},
  "tome":  {name:"Пакт Фолианта", desc:"Получаете Книгу Теней с 3 заговорами на выбор из любого класса. Считаются заклинаниями колдуна, не занимают слот известных."}
};

// ── Таинственные воззвания (PHB 2014) ──────────────────────────
// req: {level?, pact?, spell?}
var WARLOCK_INVOCATIONS = {
  "agonizing-blast":   {name:"Болезненная вспышка",   desc:"Добавляете мод. ХАР к урону каждого луча Eldritch Blast.", req:{spell:"eldritch-blast"}},
  "armor-of-shadows":  {name:"Доспех теней",          desc:"Можете без затрат сотворять Mage Armor на себя."},
  "ascendant-step":    {name:"Шаг вознесения",        desc:"Можете без затрат сотворять Levitate на себя.", req:{level:9}},
  "beast-speech":      {name:"Речь зверя",            desc:"Можете без затрат сотворять Speak with Animals."},
  "beguiling-influence":{name:"Чарующее влияние",     desc:"Получаете владение навыками Обман и Убеждение."},
  "bewitching-whispers":{name:"Завораживающий шёпот", desc:"Один раз в длинный отдых сотворяете Compulsion ячейкой колдуна.", req:{level:7}},
  "book-of-ancient-secrets":{name:"Книга древних тайн",desc:"В Книгу Теней записываете два ритуальных заклинания 1-го уровня любого класса; можете находить и записывать новые ритуалы.", req:{pact:"tome"}},
  "chains-of-carceri": {name:"Цепи Кокитуса",         desc:"Один раз в длинный отдых сотворяете Hold Monster на исчадие/небожителя/элементаль без ячейки.", req:{level:15, pact:"chain"}},
  "devils-sight":      {name:"Зрение дьявола",        desc:"Видите в обычной и магической темноте на 120 фт."},
  "dreadful-word":     {name:"Слово ужаса",           desc:"Один раз в длинный отдых сотворяете Confusion ячейкой колдуна.", req:{level:7}},
  "eldritch-sight":    {name:"Тайное зрение",         desc:"Можете без затрат сотворять Detect Magic."},
  "eldritch-spear":    {name:"Тайное копьё",          desc:"Дальность Eldritch Blast становится 300 фт.", req:{spell:"eldritch-blast"}},
  "eyes-of-the-rune-keeper":{name:"Глаза хранителя рун", desc:"Можете читать любую письменность."},
  "fiendish-vigor":    {name:"Дьявольская мощь",      desc:"Можете без затрат сотворять False Life на себя (всегда минимум на 1 уровне)."},
  "gaze-of-two-minds": {name:"Взор двух разумов",     desc:"Касанием к согласному гуманоиду — действием воспринимаете окружение его глазами 1 ход."},
  "lifedrinker":       {name:"Питающийся жизнью",     desc:"Попадание пактовым оружием наносит +мод. ХАР некротического урона (мин 1).", req:{level:12, pact:"blade"}},
  "mask-of-many-faces":{name:"Маска многих лиц",      desc:"Можете без затрат сотворять Disguise Self."},
  "master-of-myriad-forms":{name:"Мастер мириад форм",desc:"Можете без затрат сотворять Alter Self.", req:{level:15}},
  "minions-of-chaos":  {name:"Прислужники хаоса",     desc:"Один раз в длинный отдых сотворяете Conjure Elemental ячейкой колдуна.", req:{level:9}},
  "mire-the-mind":     {name:"Затуманивание разума",  desc:"Один раз в длинный отдых сотворяете Slow ячейкой колдуна.", req:{level:5}},
  "misty-visions":     {name:"Туманные видения",      desc:"Можете без затрат сотворять Silent Image."},
  "one-with-shadows":  {name:"Един с тенями",         desc:"Действием становитесь невидимым в тусклом свете или темноте, пока не двинетесь и не атакуете.", req:{level:5}},
  "otherworldly-leap": {name:"Потусторонний прыжок",  desc:"Можете без затрат сотворять Jump на себя."},
  "repelling-blast":   {name:"Отталкивающий взрыв",   desc:"При попадании Eldritch Blast отталкиваете цель на 10 фт по прямой.", req:{spell:"eldritch-blast"}},
  "sculptor-of-flesh": {name:"Ваятель плоти",         desc:"Один раз в длинный отдых сотворяете Polymorph ячейкой колдуна.", req:{level:7}},
  "sign-of-ill-omen":  {name:"Знак злого предзнаменования", desc:"Один раз в длинный отдых сотворяете Bestow Curse ячейкой колдуна.", req:{level:5}},
  "thief-of-five-fates":{name:"Похититель судеб",     desc:"Один раз в длинный отдых сотворяете Bane ячейкой колдуна."},
  "thirsting-blade":   {name:"Жаждущий клинок",       desc:"Атакуете пактовым оружием дважды за действие Атака.", req:{level:5, pact:"blade"}},
  "visions-of-distant-realms":{name:"Видения дальних краёв", desc:"Можете без затрат сотворять Arcane Eye.", req:{level:15}},
  "voice-of-the-chain-master":{name:"Голос мастера цепи", desc:"Общаетесь с фамильяром и говорите через него на любом расстоянии на одном плане.", req:{pact:"chain"}},
  "whispers-of-the-grave":{name:"Шёпот могилы",       desc:"Можете без затрат сотворять Speak with Dead.", req:{level:9}},
  "witch-sight":       {name:"Ведьмино зрение",       desc:"Видите истинную форму существ в радиусе 30 фт.", req:{level:15}}
};

// ── Любимый враг (Следопыт) ────────────────────────────────────
var FAVORED_ENEMIES = {
  "aberrations":  {name:"Аберрации",     desc:"Преимущество на проверки Выживания при выслеживании и проверки Истории об этом типе."},
  "beasts":       {name:"Звери",         desc:"То же — звери."},
  "celestials":   {name:"Небожители",    desc:"То же — небожители."},
  "constructs":   {name:"Конструкты",    desc:"То же — конструкты."},
  "dragons":      {name:"Драконы",       desc:"То же — драконы."},
  "elementals":   {name:"Элементали",    desc:"То же — элементали."},
  "fey":          {name:"Феи",           desc:"То же — феи."},
  "fiends":       {name:"Исчадия",       desc:"То же — исчадия."},
  "giants":       {name:"Великаны",      desc:"То же — великаны."},
  "monstrosities":{name:"Чудовища",      desc:"То же — чудовища."},
  "oozes":        {name:"Слизи",         desc:"То же — слизи."},
  "plants":       {name:"Растения",      desc:"То же — растения."},
  "undead":       {name:"Нежить",        desc:"То же — нежить."},
  "humanoids-2":  {name:"Гуманоиды (2 расы)", desc:"Выберите 2 расы гуманоидов (например, гоблиноиды и орки) — считаются как один любимый враг."}
};

// ── Натуралист — типы местности (Следопыт) ─────────────────────
var FAVORED_TERRAINS = {
  "arctic":      {name:"Арктика",       desc:""},
  "coast":       {name:"Берег",         desc:""},
  "desert":      {name:"Пустыня",       desc:""},
  "forest":      {name:"Лес",           desc:""},
  "grassland":   {name:"Луга",          desc:""},
  "mountain":    {name:"Горы",          desc:""},
  "swamp":       {name:"Болото",        desc:""},
  "underdark":   {name:"Подземье",      desc:""}
};

// ============================================================
// CLASS_CHOICES — описание всех выборов
// ============================================================
// type: "single" | "multi" | "freeform"
// getCount(classLevel) — для multi: сколько всего нужно выбрать
// minLevel — на каком уровне класса появляется
// optionsKey — ссылка на словарь опций
// pool: "skills" — особый пул (навыки) для экспертизы
// ============================================================
var CLASS_CHOICES = {
  "Воин": [
    {id:"fighting-style", name:"Стиль боя", icon:"⚔️", minLevel:1, type:"single",
     options:["archery","defense","dueling","great-weapon","protection","two-weapon"],
     optionsDict:FIGHTING_STYLES,
     desc:"Выберите боевой стиль."}
  ],
  "Паладин": [
    {id:"fighting-style", name:"Стиль боя", icon:"⚔️", minLevel:2, type:"single",
     options:["defense","dueling","great-weapon","protection"],
     optionsDict:FIGHTING_STYLES,
     desc:"Выберите боевой стиль."}
  ],
  "Следопыт": [
    {id:"fighting-style", name:"Стиль боя", icon:"⚔️", minLevel:2, type:"single",
     options:["archery","defense","dueling","two-weapon"],
     optionsDict:FIGHTING_STYLES,
     desc:"Выберите боевой стиль."},
    {id:"favored-enemy", name:"Любимый враг", icon:"🎯", minLevel:1, type:"multi",
     options:Object.keys(FAVORED_ENEMIES), optionsDict:FAVORED_ENEMIES,
     getCount:function(lvl){ return lvl>=14 ? 4 : (lvl>=6 ? 3 : 2); },
     desc:"Выберите тип любимых врагов. Расширяется на 6 и 14 уровнях."},
    {id:"natural-explorer", name:"Натуралист", icon:"🌲", minLevel:1, type:"multi",
     options:Object.keys(FAVORED_TERRAINS), optionsDict:FAVORED_TERRAINS,
     getCount:function(lvl){ return lvl>=10 ? 3 : (lvl>=6 ? 2 : 1); },
     desc:"Выберите любимую местность. Расширяется на 6 и 10 уровнях."}
  ],
  "Чародей": [
    {id:"metamagic", name:"Метамагия", icon:"✨", minLevel:3, type:"multi",
     options:Object.keys(SORCERER_METAMAGIC), optionsDict:SORCERER_METAMAGIC,
     getCount:function(lvl){ return lvl>=17 ? 4 : (lvl>=10 ? 3 : 2); },
     desc:"Выберите варианты метамагии. На 10 и 17 уровнях открываются новые слоты."}
  ],
  "Колдун": [
    {id:"pact-boon", name:"Пактный дар", icon:"🕯️", minLevel:3, type:"single",
     options:Object.keys(WARLOCK_PACT_BOONS), optionsDict:WARLOCK_PACT_BOONS,
     desc:"Выберите пактный дар своего покровителя."},
    {id:"invocations", name:"Таинственные воззвания", icon:"👁️", minLevel:2, type:"multi",
     options:Object.keys(WARLOCK_INVOCATIONS), optionsDict:WARLOCK_INVOCATIONS,
     getCount:function(lvl){
       // PHB 2014: 2/-/2/-/3/-/4/-/5/-/-/6/-/-/7/-/-/8/-/8
       if (lvl>=18) return 8;
       if (lvl>=15) return 7;
       if (lvl>=12) return 6;
       if (lvl>=9)  return 5;
       if (lvl>=7)  return 4;
       if (lvl>=5)  return 3;
       if (lvl>=2)  return 2;
       return 0;
     },
     desc:"Выберите воззвания. Некоторые требуют уровня или пактного дара.",
     filterByReq:true}
  ],
  "Бард": [
    {id:"expertise", name:"Экспертиза", icon:"🎓", minLevel:3, type:"multi", pool:"skills",
     getCount:function(lvl){ return lvl>=10 ? 4 : 2; },
     desc:"Удвойте бонус мастерства для выбранных навыков (уровни 3 и 10, по 2 навыка)."},
    {id:"magical-secrets", name:"Магические секреты", icon:"📜", minLevel:10, type:"freeform",
     getCount:function(lvl){ return lvl>=18 ? 6 : (lvl>=14 ? 4 : 2); },
     desc:"Запишите выбранные заклинания любого класса (уровни 10/14/18, по 2 заклинания)."}
  ],
  "Плут": [
    {id:"expertise", name:"Экспертиза", icon:"🎓", minLevel:1, type:"multi", pool:"skills",
     getCount:function(lvl){ return lvl>=6 ? 4 : 2; },
     desc:"Удвойте бонус мастерства для выбранных навыков (уровни 1 и 6, по 2)."}
  ]
};

// ============================================================
// ХЕЛПЕРЫ
// ============================================================
function ccGetChar() {
  if (typeof getCurrentChar === "function") return getCurrentChar();
  return null;
}

function ccGetClassLevel(char, className) {
  if (char.classes && char.classes.length > 0) {
    var entry = char.classes.find(function(c) { return c.class === className; });
    return entry ? entry.level : 0;
  }
  return char.class === className ? (char.level || 0) : 0;
}

function ccGetActiveClasses(char) {
  if (char.classes && char.classes.length > 0) {
    return char.classes.map(function(c) { return c.class; });
  }
  return char.class ? [char.class] : [];
}

function ccGetStored(char, className, choiceId) {
  if (!char.classChoices) return null;
  if (!char.classChoices[className]) return null;
  return char.classChoices[className][choiceId];
}

function ccSetStored(char, className, choiceId, value) {
  if (!char.classChoices) char.classChoices = {};
  if (!char.classChoices[className]) char.classChoices[className] = {};
  char.classChoices[className][choiceId] = value;
}

function ccCount(choice, classLevel) {
  if (typeof choice.getCount === "function") return choice.getCount(classLevel);
  return 1;
}

// Возвращает массив доступных опций (с фильтром по уровню/пакту/заклинаниям)
function ccAvailableOptions(choice, char, className) {
  var ids = choice.options ? choice.options.slice() : [];
  if (!choice.filterByReq) return ids;
  var classLevel = ccGetClassLevel(char, className);
  return ids.filter(function(id) {
    var opt = choice.optionsDict[id];
    if (!opt || !opt.req) return true;
    if (opt.req.level && classLevel < opt.req.level) return false;
    if (opt.req.pact) {
      var pact = ccGetStored(char, className, "pact-boon");
      if (pact !== opt.req.pact) return false;
    }
    if (opt.req.spell) {
      // Проверка простая — наличие заклинания в mySpells по id (не строго)
      // Если нет данных — пропускаем
    }
    return true;
  });
}

// Возвращает массив всех выборов для активных классов персонажа
// Каждый элемент: {className, choice, classLevel, count, current, isComplete}
function ccGetAllChoicesFor(char) {
  var result = [];
  var active = ccGetActiveClasses(char);
  active.forEach(function(cls) {
    var defs = CLASS_CHOICES[cls];
    if (!defs) return;
    var classLevel = ccGetClassLevel(char, cls);
    defs.forEach(function(choice) {
      if (classLevel < choice.minLevel) return;
      var count = ccCount(choice, classLevel);
      var current = ccGetStored(char, cls, choice.id);
      var isComplete = false;
      if (choice.type === "single") {
        isComplete = !!current;
      } else if (choice.type === "multi") {
        var arr = Array.isArray(current) ? current : [];
        isComplete = arr.length >= count;
      } else if (choice.type === "freeform") {
        var arr2 = Array.isArray(current) ? current : (current ? [current] : []);
        isComplete = arr2.length >= count;
      }
      result.push({className:cls, choice:choice, classLevel:classLevel, count:count, current:current, isComplete:isComplete});
    });
  });
  return result;
}

// ============================================================
// РЕНДЕР — карточки выборов (вставляются в asi-container)
// ============================================================
function renderClassChoices(char, container) {
  if (!container) return;
  var items = ccGetAllChoicesFor(char);
  if (items.length === 0) return;

  var html = '<div class="class-choices-wrap">';
  items.forEach(function(it) {
    var c = it.choice;
    var cls = it.className;
    var statusBadge, statusClass, summary;

    if (it.isComplete) {
      statusClass = "cc-card cc-complete";
      if (c.type === "single") {
        var optName = c.optionsDict[it.current] ? c.optionsDict[it.current].name : it.current;
        summary = "✅ " + escapeHtml(optName);
      } else {
        var arr = Array.isArray(it.current) ? it.current : [];
        var names = arr.map(function(id) {
          if (c.optionsDict && c.optionsDict[id]) return c.optionsDict[id].name;
          return id;
        });
        summary = "✅ " + escapeHtml(names.join(", "));
      }
      statusBadge = '<span class="cc-badge cc-badge-done">' + it.count + "/" + it.count + "</span>";
    } else {
      statusClass = "cc-card cc-pending";
      var have = 0;
      if (c.type === "single") have = it.current ? 1 : 0;
      else have = (Array.isArray(it.current) ? it.current.length : 0);
      summary = '<span class="cc-hint">' + escapeHtml(c.desc) + "</span>";
      statusBadge = '<span class="cc-badge cc-badge-todo">' + have + "/" + it.count + "</span>";
    }

    var classLabel = (ccGetActiveClasses(char).length > 1)
      ? ' <span class="cc-class-tag">' + escapeHtml(cls) + "</span>"
      : "";

    html +=
      '<button class="' + statusClass + '" onclick="openClassChoiceModal(\'' + cls + '\',\'' + c.id + '\')">' +
        '<div class="cc-card-left">' +
          '<div class="cc-card-title">' + (c.icon || "⚡") + " " + escapeHtml(c.name) + classLabel + statusBadge + '</div>' +
          '<div class="cc-card-summary">' + summary + '</div>' +
        '</div>' +
        '<span class="cc-card-arrow">›</span>' +
      '</button>';
  });
  html += '</div>';

  // Дописываем к существующему содержимому asi-container
  container.insertAdjacentHTML("beforeend", html);
}

// ============================================================
// МОДАЛ ВЫБОРА
// ============================================================
var ccModalState = { className:null, choiceId:null, selection:null };

function openClassChoiceModal(className, choiceId) {
  var char = ccGetChar();
  if (!char) return;
  var defs = CLASS_CHOICES[className];
  if (!defs) return;
  var choice = defs.find(function(c) { return c.id === choiceId; });
  if (!choice) return;
  var classLevel = ccGetClassLevel(char, className);
  if (classLevel < choice.minLevel) return;

  ccModalState.className = className;
  ccModalState.choiceId = choiceId;

  var current = ccGetStored(char, className, choiceId);
  if (choice.type === "single") {
    ccModalState.selection = current || null;
  } else if (choice.type === "multi") {
    ccModalState.selection = Array.isArray(current) ? current.slice() : [];
  } else if (choice.type === "freeform") {
    ccModalState.selection = Array.isArray(current) ? current.slice() : (current ? [current] : []);
  }

  buildClassChoiceModal(char, choice, className, classLevel);

  var modal = document.getElementById("class-choice-modal");
  if (modal) modal.classList.add("active");
}

function closeClassChoiceModal() {
  var modal = document.getElementById("class-choice-modal");
  if (modal) modal.classList.remove("active");
  ccModalState.className = null;
  ccModalState.choiceId = null;
  ccModalState.selection = null;
}

function buildClassChoiceModal(char, choice, className, classLevel) {
  var modal = document.getElementById("class-choice-modal");
  if (!modal) return;

  var count = ccCount(choice, classLevel);
  var titleEl = modal.querySelector(".cc-modal-title");
  var descEl  = modal.querySelector(".cc-modal-desc");
  var bodyEl  = modal.querySelector(".cc-modal-body");
  var counterEl = modal.querySelector(".cc-modal-counter");

  if (titleEl) titleEl.textContent = (choice.icon || "⚡") + " " + choice.name + " · " + className;
  if (descEl)  descEl.textContent  = choice.desc || "";

  // ── Тип: freeform ────────────────────────────────────────
  if (choice.type === "freeform") {
    var lines = ccModalState.selection || [];
    while (lines.length < count) lines.push("");
    var html = '<div class="cc-freeform-list">';
    for (var i = 0; i < count; i++) {
      html += '<input class="cc-freeform-input" type="text" placeholder="Запись ' + (i+1) + '" ' +
              'value="' + escapeHtml(lines[i] || "") + '" ' +
              'oninput="ccUpdateFreeform(' + i + ', this.value)">';
    }
    html += '</div>';
    bodyEl.innerHTML = html;
    if (counterEl) counterEl.textContent = "Слотов: " + count;
    ccModalState.selection = lines;
    ccUpdateModalApplyBtn();
    return;
  }

  // ── Опции (single / multi) ───────────────────────────────
  var optionIds = ccAvailableOptions(choice, char, className);
  // Для скилл-пула (экспертиза)
  if (choice.pool === "skills") {
    optionIds = (typeof skills !== "undefined" ? skills.map(function(s) { return s.name; }) : []);
  }

  var bodyHtml = '<div class="cc-options-list">';
  optionIds.forEach(function(id) {
    var opt;
    if (choice.pool === "skills") {
      opt = {name:id, desc:""};
    } else {
      opt = (choice.optionsDict && choice.optionsDict[id]) ? choice.optionsDict[id] : {name:id, desc:""};
    }
    var selected = false;
    if (choice.type === "single") {
      selected = ccModalState.selection === id;
    } else {
      selected = (ccModalState.selection || []).indexOf(id) !== -1;
    }
    var reqText = "";
    if (opt.req) {
      var bits = [];
      if (opt.req.level) bits.push("ур." + opt.req.level);
      if (opt.req.pact)  bits.push("Пакт " + (WARLOCK_PACT_BOONS[opt.req.pact] ? WARLOCK_PACT_BOONS[opt.req.pact].name : opt.req.pact));
      if (bits.length) reqText = '<span class="cc-opt-req">' + bits.join(" · ") + "</span>";
    }
    bodyHtml +=
      '<div class="cc-opt' + (selected ? " selected" : "") + '" onclick="ccToggleOption(\'' + id.replace(/'/g,"\\'") + '\')">' +
        '<div class="cc-opt-head"><span class="cc-opt-name">' + escapeHtml(opt.name) + '</span>' + reqText + '</div>' +
        (opt.desc ? '<div class="cc-opt-desc">' + escapeHtml(opt.desc) + '</div>' : "") +
      '</div>';
  });
  bodyHtml += '</div>';
  bodyEl.innerHTML = bodyHtml;

  if (counterEl) {
    if (choice.type === "single") {
      counterEl.textContent = "Выберите 1 вариант";
    } else {
      var have = (ccModalState.selection || []).length;
      counterEl.textContent = "Выбрано " + have + " из " + count;
    }
  }
  ccUpdateModalApplyBtn();
}

function ccToggleOption(id) {
  var char = ccGetChar();
  if (!char) return;
  var className = ccModalState.className;
  var choiceId  = ccModalState.choiceId;
  var defs = CLASS_CHOICES[className];
  if (!defs) return;
  var choice = defs.find(function(c) { return c.id === choiceId; });
  if (!choice) return;
  var classLevel = ccGetClassLevel(char, className);
  var count = ccCount(choice, classLevel);

  if (choice.type === "single") {
    ccModalState.selection = id;
  } else {
    var arr = ccModalState.selection || [];
    var idx = arr.indexOf(id);
    if (idx !== -1) {
      arr.splice(idx, 1);
    } else {
      if (arr.length >= count) {
        if (typeof showToast === "function") showToast("Достигнут лимит: " + count, "error");
        return;
      }
      arr.push(id);
    }
    ccModalState.selection = arr;
  }
  buildClassChoiceModal(char, choice, className, classLevel);
}

function ccUpdateFreeform(index, value) {
  if (!ccModalState.selection) ccModalState.selection = [];
  ccModalState.selection[index] = value;
  ccUpdateModalApplyBtn();
}

function ccUpdateModalApplyBtn() {
  var btn = document.getElementById("cc-modal-apply");
  if (!btn) return;
  var char = ccGetChar();
  if (!char) { btn.disabled = true; return; }
  var defs = CLASS_CHOICES[ccModalState.className];
  if (!defs) { btn.disabled = true; return; }
  var choice = defs.find(function(c) { return c.id === ccModalState.choiceId; });
  if (!choice) { btn.disabled = true; return; }
  var classLevel = ccGetClassLevel(char, ccModalState.className);
  var count = ccCount(choice, classLevel);

  if (choice.type === "single") {
    btn.disabled = !ccModalState.selection;
  } else if (choice.type === "multi") {
    btn.disabled = !ccModalState.selection || ccModalState.selection.length === 0;
  } else if (choice.type === "freeform") {
    var nonEmpty = (ccModalState.selection || []).filter(function(s) { return s && s.trim() !== ""; });
    btn.disabled = nonEmpty.length === 0;
  }
}

function applyClassChoice() {
  var char = ccGetChar();
  if (!char) return;
  var className = ccModalState.className;
  var choiceId  = ccModalState.choiceId;
  if (!className || !choiceId) return;
  var defs = CLASS_CHOICES[className];
  if (!defs) return;
  var choice = defs.find(function(c) { return c.id === choiceId; });
  if (!choice) return;

  var value;
  if (choice.type === "single") {
    value = ccModalState.selection;
  } else if (choice.type === "multi") {
    value = (ccModalState.selection || []).slice();
  } else if (choice.type === "freeform") {
    value = (ccModalState.selection || []).filter(function(s) { return s && s.trim() !== ""; });
  }

  ccSetStored(char, className, choiceId, value);

  if (typeof addJournalEntry === "function") {
    var label = choice.name + " (" + className + ")";
    var details;
    if (choice.type === "single") {
      var od = choice.optionsDict && choice.optionsDict[value] ? choice.optionsDict[value].name : value;
      details = od;
    } else {
      details = (Array.isArray(value) ? value : []).map(function(id) {
        if (choice.optionsDict && choice.optionsDict[id]) return choice.optionsDict[id].name;
        return id;
      }).join(", ");
    }
    addJournalEntry("feat", label, details);
  }

  if (typeof saveToLocal === "function") saveToLocal();
  if (typeof showToast === "function") showToast(choice.name + " сохранён", "success");
  closeClassChoiceModal();
  if (typeof updateClassFeatures === "function") updateClassFeatures();
  if (typeof calcStats === "function") calcStats();
}

// ============================================================
// Экспортируем глобально (на случай если файл загружается как модуль)
// ============================================================
if (typeof window !== "undefined") {
  window.CLASS_CHOICES = CLASS_CHOICES;
  window.renderClassChoices = renderClassChoices;
  window.openClassChoiceModal = openClassChoiceModal;
  window.closeClassChoiceModal = closeClassChoiceModal;
  window.applyClassChoice = applyClassChoice;
  window.ccToggleOption = ccToggleOption;
  window.ccUpdateFreeform = ccUpdateFreeform;
}
