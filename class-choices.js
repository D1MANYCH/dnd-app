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
  "great-weapon":{name:"Сражение большим оружием", desc:"Перебрасывайте 1 и 2 на кубике урона двуручным оружием (новый результат принимаете)."},
  "protection":  {name:"Оборона",         desc:"Реакция: помеха атакующему по союзнику в 5 фт. Требуется щит."},
  "two-weapon":  {name:"Сражение двумя оружиями", desc:"Добавляете мод. характеристики к урону второй атаки бонусным действием."}
};

// ── Метамагия чародея (PHB 2014, 8 опций) ──────────────────────
var SORCERER_METAMAGIC = {
  "careful":   {name:"Аккуратное заклинание",  desc:"Тратите 1 ед. чародейства: выбранные существа автоматически проходят спасбросок от вашего заклинания (число = мод. ХАР, мин 1)."},
  "distant":   {name:"Далёкое заклинание",    desc:"1 ед.: удваиваете дальность заклинания. Заклинания с дальностью «касание» получают дальность 30 фт."},
  "empowered": {name:"Усиленное заклинание",  desc:"1 ед.: перебрасываете до мод. ХАР кубиков урона заклинания (новый результат)."},
  "extended":  {name:"Продлённое заклинание", desc:"1 ед.: длительность заклинания (мин 1 минута) удваивается, до 24 часов."},
  "heightened":{name:"Непреодолимое заклинание", desc:"3 ед.: одна цель получает помеху на первый спасбросок против заклинания."},
  "quickened": {name:"Ускоренное заклинание", desc:"2 ед.: время сотворения заклинания (1 действие) становится бонусным действием."},
  "subtle":    {name:"Неуловимое заклинание", desc:"1 ед.: сотворяете заклинание без вербальных и соматических компонентов."},
  "twinned":   {name:"Удвоенное заклинание",  desc:"Ед. = уровень заклинания (мин 1): заклинание с одной целью нацеливается на ещё одну в дальности."}
};

// ── Предмет договора колдуна ───────────────────────────────────
var WARLOCK_PACT_BOONS = {
  "chain": {name:"Договор цепи",    desc:"Получаете заклинание Find Familiar. Фамильяр может принимать форму беса, квазита, псевдодракона или спрайта. Можете жертвовать своей атакой, чтобы фамильяр атаковал реакцией."},
  "blade": {name:"Договор клинка",  desc:"Призываете оружие договора в свободную руку (любое оружие ближнего боя). Считаетесь владеющим им. Можно превращать обычное оружие в оружие договора за ритуал 1 час."},
  "tome":  {name:"Договор гримуара",desc:"Получаете Книгу Теней с 3 заговорами на выбор из любого класса. Считаются заклинаниями колдуна, не занимают слот известных."}
};

// ── Таинственные воззвания (PHB 2014) ──────────────────────────
// req: {level?, pact?, spell?}
var WARLOCK_INVOCATIONS = {
  "agonizing-blast":   {name:"Мучительный взрыв",     desc:"Добавляете мод. ХАР к урону каждого луча Eldritch Blast.", req:{spell:"eldritch-blast"}},
  "armor-of-shadows":  {name:"Доспех теней",          desc:"Можете без затрат сотворять Mage Armor на себя."},
  "ascendant-step":    {name:"Восходящий шаг",        desc:"Можете без затрат сотворять Levitate на себя.", req:{level:9}},
  "beast-speech":      {name:"Животная речь",         desc:"Можете без затрат сотворять Speak with Animals."},
  "beguiling-influence":{name:"Обманчивое влияние",   desc:"Получаете владение навыками Обман и Убеждение."},
  "bewitching-whispers":{name:"Завораживающий шёпот", desc:"Один раз в длинный отдых сотворяете Compulsion ячейкой колдуна.", req:{level:7}},
  "book-of-ancient-secrets":{name:"Книга древних секретов",desc:"В Книгу Теней записываете два ритуальных заклинания 1-го уровня любого класса; можете находить и записывать новые ритуалы.", req:{pact:"tome"}},
  "chains-of-carceri": {name:"Цепи Карцери",          desc:"Можете неограниченно сотворять Hold Monster на исчадие, небожителя или элементаля без ячейки и материальных компонентов. На одно и то же существо — раз до окончания продолжительного отдыха.", req:{level:15, pact:"chain"}},
  "devils-sight":      {name:"Дьявольский взгляд",    desc:"Видите в обычной и магической темноте на 120 фт."},
  "dreadful-word":     {name:"Ужасающее слово",       desc:"Один раз в длинный отдых сотворяете Confusion ячейкой колдуна.", req:{level:7}},
  "eldritch-sight":    {name:"Таинственный взгляд",   desc:"Можете без затрат сотворять Detect Magic."},
  "eldritch-spear":    {name:"Мистическое копьё",     desc:"Дальность Eldritch Blast становится 300 фт.", req:{spell:"eldritch-blast"}},
  "eyes-of-the-rune-keeper":{name:"Глаза хранителя рун", desc:"Можете читать любую письменность."},
  "fiendish-vigor":    {name:"Мощь исчадия",          desc:"Можете без затрат сотворять False Life на себя (всегда минимум на 1 уровне)."},
  "gaze-of-two-minds": {name:"Взор двух умов",        desc:"Касанием к согласному гуманоиду — действием воспринимаете окружение его глазами 1 ход."},
  "lifedrinker":       {name:"Пьющий жизнь",          desc:"Попадание оружием договора наносит +мод. ХАР некротического урона (мин 1).", req:{level:12, pact:"blade"}},
  "mask-of-many-faces":{name:"Маска многих лиц",      desc:"Можете без затрат сотворять Disguise Self."},
  "master-of-myriad-forms":{name:"Мастер бесчисленных обликов",desc:"Можете без затрат сотворять Alter Self.", req:{level:15}},
  "minions-of-chaos":  {name:"Слуги хаоса",           desc:"Один раз в длинный отдых сотворяете Conjure Elemental ячейкой колдуна.", req:{level:9}},
  "mire-the-mind":     {name:"Трясина разума",        desc:"Один раз в длинный отдых сотворяете Slow ячейкой колдуна.", req:{level:5}},
  "misty-visions":     {name:"Туманные видения",      desc:"Можете без затрат сотворять Silent Image."},
  "one-with-shadows":  {name:"Один среди теней",      desc:"Действием становитесь невидимым в тусклом свете или темноте, пока не двинетесь и не атакуете.", req:{level:5}},
  "otherworldly-leap": {name:"Потусторонний прыжок",  desc:"Можете без затрат сотворять Jump на себя.", req:{level:9}},
  "repelling-blast":   {name:"Отталкивающий заряд",   desc:"При попадании Eldritch Blast отталкиваете цель на 10 фт по прямой.", req:{spell:"eldritch-blast"}},
  "sculptor-of-flesh": {name:"Скульптор плоти",       desc:"Один раз в длинный отдых сотворяете Polymorph ячейкой колдуна.", req:{level:7}},
  "sign-of-ill-omen":  {name:"Знак дурного предзнаменования", desc:"Один раз в длинный отдых сотворяете Bestow Curse ячейкой колдуна.", req:{level:5}},
  "thief-of-five-fates":{name:"Вор пяти судеб",       desc:"Один раз в длинный отдых сотворяете Bane ячейкой колдуна."},
  "thirsting-blade":   {name:"Жаждущий клинок",       desc:"Атакуете оружием договора дважды за действие Атака.", req:{level:5, pact:"blade"}},
  "visions-of-distant-realms":{name:"Видения далёких королевств", desc:"Можете без затрат сотворять Arcane Eye.", req:{level:15}},
  "voice-of-the-chain-master":{name:"Глас цепного мастера", desc:"Общаетесь с фамильяром и говорите через него на любом расстоянии на одном плане.", req:{pact:"chain"}},
  "whispers-of-the-grave":{name:"Могильный шёпот",    desc:"Можете без затрат сотворять Speak with Dead.", req:{level:9}},
  "witch-sight":       {name:"Ведьмачий взор",        desc:"Видите истинную форму существ в радиусе 30 фт.", req:{level:15}}
};

// ── Избранный враг (Следопыт) ──────────────────────────────────
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
  "monstrosities":{name:"Монстры",       desc:"То же — монстры."},
  "oozes":        {name:"Слизи",         desc:"То же — слизи."},
  "plants":       {name:"Растения",      desc:"То же — растения."},
  "undead":       {name:"Нежить",        desc:"То же — нежить."},
  "humanoids-2":  {name:"Гуманоиды (2 расы)", desc:"Выберите 2 расы гуманоидов (например, гоблиноиды и орки) — считаются как один избранный враг."}
};

// ── Исследователь природы — типы местности (Следопыт) ──────────
var FAVORED_TERRAINS = {
  "arctic":      {name:"Арктика",       desc:""},
  "coast":       {name:"Побережье",     desc:""},
  "desert":      {name:"Пустыня",       desc:""},
  "forest":      {name:"Лес",           desc:""},
  "grassland":   {name:"Луга",          desc:""},
  "mountain":    {name:"Горы",          desc:""},
  "swamp":       {name:"Болото",        desc:""},
  "underdark":   {name:"Подземье",      desc:""}
};

// ── Инфузии изобретателя (TCoE) ───────────────────────────────
var ARTIFICER_INFUSIONS = {
  "enhanced-arcane-focus": {name:"Улучшенная магическая фокусировка", desc:"Жезл, посох или палочка, настройка. +1 к атакам заклинаниями (+2 с 10 ур. изобретателя), атаки заклинаниями игнорируют укрытие на половину."},
  "enhanced-defense":      {name:"Улучшенная защита",      desc:"Доспех или щит. +1 КД (+2 с 10 ур. изобретателя)."},
  "enhanced-weapon":       {name:"Улучшенное оружие",      desc:"Простое или воинское оружие. +1 к атаке и урону (+2 с 10 ур. изобретателя)."},
  "homunculus-servant":    {name:"Слуга-гомункул",         desc:"Камень от 100 зм становится сердцем Крошечного конструкта, ходит после вас. КД 13, хиты 1 + мод.ИНТ + уровень изобретателя, скорость 6 м (20 фт), полёт 9 м (30 фт). Силовой удар: дальняя атака 9 м, 1к4 + БМ силовым полем. Реакция: через него можно сотворить заклинание с дальностью «касание» в 36 м (120 фт)."},
  "mind-sharpener":        {name:"Усилитель разума",       desc:"Доспех или ряса, 4 заряда (1к4 на рассвете). Провалив спасбросок концентрации, реакцией тратите заряд и преуспеваете."},
  "armor-of-magical-strength":{name:"Доспех магической силы", desc:"Доспех, настройка, 6 зарядов (1к6 на рассвете). Заряд: +мод.ИНТ изобретателя к проверке или спасброску СИЛ; реакцией — не быть сбитым с ног."},
  "repeating-shot":        {name:"Повторный выстрел",      desc:"Оружие со свойством «боеприпас», настройка. +1 к атаке и урону, игнорирует перезарядку, создаёт боеприпас сам, если заряженного нет."},
  "returning-weapon":      {name:"Возвращающееся оружие",  desc:"Метательное оружие. +1 к атаке и урону, после дальнобойной атаки возвращается в руку."},
  "boots-of-the-winding-path":{name:"Сапоги извилистого пути", desc:"Сапоги, настройка. Бонусным действием телепорт на 4,5 м (15 фт) в видимое незанятое место, где вы были в этот ход.", req:{level:6}},
  "radiant-weapon":        {name:"Излучающее свет оружие", desc:"Простое или воинское оружие, настройка. +1 к атаке и урону; бонусным действием свет 9+9 м. 4 заряда (1к4 на рассвете): реакцией на попадание слепит атакующего до конца его следующего хода, спасбросок ТЕЛ.", req:{level:6}},
  "repulsion-shield":      {name:"Отталкивающий щит",      desc:"Щит, настройка. +1 КД. 4 заряда (1к4 на рассвете): реакцией на попадание рукопашной атакой отталкиваете атакующего на 4,5 м (15 фт).", req:{level:6}},
  "resistant-armor":       {name:"Доспех сопротивления",   desc:"Доспех, настройка. Сопротивление одному типу урона на выбор при вложении: звук, излучение, кислота, некротическая энергия, огонь, психическая энергия, силовое поле, холод, электричество или яд.", req:{level:6}},
  "spell-refueling-ring":  {name:"Кольцо восстановления заклинаний", desc:"Кольцо, настройка. Действием восстанавливает одну потраченную ячейку до 3 круга, 1 раз до рассвета.", req:{level:6}},
  "helm-of-awareness":     {name:"Шлем осведомлённости",   desc:"Шлем, настройка. Преимущество на инициативу, нельзя застать врасплох, пока вы дееспособны.", req:{level:10}},
  "arcane-propulsion-armor":{name:"Движимый магией доспех", desc:"Доспех, настройка. Скорость +1,5 м (5 фт). Рукавицы — простое магическое оружие, 1к8 силовым полем, метание 6/18 м (20/60 фт) с возвратом. Не снимается против воли, заменяет отсутствующие конечности.", req:{level:14}}
};
// Копия магического предмета: инфузию можно учить несколько раз, поэтому каждый предмет —
// отдельная опция. [id, название, уровень изобретателя, настройка]
var ARTIFICER_REPLICA_ITEMS = [
  ["alchemy-jug","Алхимический сосуд",2,false], ["bag-of-holding","Сумка хранения",2,false],
  ["cap-of-water-breathing","Шапка подводного дыхания",2,false], ["goggles-of-night","Ночные очки",2,false],
  ["rope-of-climbing","Верёвка лазания",2,false], ["sending-stones","Камни послания",2,false],
  ["wand-of-magic-detection","Волшебная палочка обнаружения магии",2,false], ["wand-of-secrets","Волшебная палочка секретов",2,false],
  ["boots-of-elvenkind","Эльфийские сапоги",6,false], ["cloak-of-elvenkind","Эльфийский плащ",6,true],
  ["cloak-of-the-manta-ray","Плащ ската",6,false], ["eyes-of-charming","Очки очарования",6,true],
  ["gloves-of-thievery","Перчатки воровства",6,false], ["lantern-of-revealing","Фонарь обнаружения",6,false],
  ["pipes-of-haunting","Свирель ужаса",6,false], ["ring-of-water-walking","Кольцо хождения по воде",6,false],
  ["boots-of-striding","Сапоги ходьбы и прыжков",10,true], ["boots-of-the-winterlands","Заполярные сапоги",10,true],
  ["bracers-of-archery","Наручи стрельбы из лука",10,true], ["brooch-of-shielding","Брошь защиты",10,true],
  ["cloak-of-protection","Плащ защиты",10,true], ["eyes-of-the-eagle","Очки орлиного зрения",10,true],
  ["gauntlets-of-ogre-power","Рукавицы силы огра",10,true], ["gloves-of-missile-snaring","Перчатки ловли снарядов",10,true],
  ["gloves-of-swimming","Перчатки плавания и лазания",10,true], ["hat-of-disguise","Шапка маскировки",10,true],
  ["headband-of-intellect","Повязка интеллекта",10,true], ["helm-of-telepathy","Шлем телепатии",10,true],
  ["medallion-of-thoughts","Медальон мыслей",10,true], ["necklace-of-adaptation","Ожерелье адаптации",10,true],
  ["periapt-of-wound-closure","Медальон затягивающихся ран",10,true], ["pipes-of-the-sewers","Свирель канализации",10,true],
  ["quiver-of-ehlonna","Колчан Элонны",10,false], ["ring-of-jumping","Кольцо прыжков",10,true],
  ["ring-of-mind-shielding","Кольцо защиты разума",10,true], ["slippers-of-spider-climbing","Туфли паука",10,true],
  ["winged-boots","Крылатые сапоги",10,true],
  ["amulet-of-health","Амулет здоровья",14,true], ["belt-of-hill-giant-strength","Пояс силы холмовых великанов",14,true],
  ["boots-of-levitation","Сапоги левитации",14,true], ["boots-of-speed","Сапоги скорости",14,true],
  ["bracers-of-defense","Наручи защиты",14,true], ["cloak-of-the-bat","Плащ летучей мыши",14,true],
  ["dimensional-shackles","Оковы измерений",14,false], ["gem-of-seeing","Камень зрения",14,true],
  ["horn-of-blasting","Рог взрыва",14,false], ["ring-of-free-action","Кольцо свободных действий",14,true],
  ["ring-of-protection","Кольцо защиты",14,true], ["ring-of-the-ram","Кольцо тарана",14,true]
];
["1", "2", "3"].forEach(function(n) {
  ARTIFICER_INFUSIONS["replicate-common-" + n] = {name:"Копия: обычный магический предмет (" + n + ")", desc:"Копия обычного магического предмета, кроме зелий и свитков."};
});
ARTIFICER_REPLICA_ITEMS.forEach(function(r) {
  var def = {name:"Копия: " + r[1], desc:"Копия магического предмета. " + (r[3] ? "Нужна настройка." : "Настройка не нужна.")};
  if (r[2] > 2) def.req = {level:r[2]};
  ARTIFICER_INFUSIONS["replicate-" + r[0]] = def;
});

// ============================================================
// CLASS_CHOICES — описание всех выборов
// ============================================================
// type: "single" | "multi" | "freeform"
// getCount(classLevel) — для multi: сколько всего нужно выбрать
// minLevel — на каком уровне класса появляется
// optionsKey — ссылка на словарь опций
// pool: "skills" — особый пул (навыки) для экспертизы
// ============================================================
// PLAY5-3 (PT-504): заклинания волшебника из книги персонажа — опции Мастерства
// заклинателя и Фирменных заклинаний. excludeChoice — занятое соседним выбором.
function ccWizardBookSpells(char, lvl, actionOnly, excludeChoice) {
  var stored = excludeChoice ? ccGetStored(char, "Волшебник", excludeChoice) : null;
  var seen = {};
  return ((char.spells && char.spells.mySpells) || []).filter(function(s) {
    if (!s || s.grantedBy || s.level !== lvl || s.name === stored || seen[s.name]) return false;
    if (Array.isArray(s.classes) && s.classes.indexOf("wizard") === -1 && s.classes.indexOf("both") === -1) return false;
    if (actionOnly && !/^\s*(1\s+)?действи/i.test(s.time || "")) return false;
    seen[s.name] = true;
    return true;
  }).map(function(s) { return s.name; });
}

var CLASS_CHOICES = {
  "Воин": [
    {id:"fighting-style", name:"Боевой стиль", icon:"⚔️", minLevel:1, type:"single",
     options:["archery","defense","dueling","great-weapon","protection","two-weapon"],
     optionsDict:FIGHTING_STYLES,
     desc:"Выберите боевой стиль."}
  ],
  "Паладин": [
    {id:"fighting-style", name:"Боевой стиль", icon:"⚔️", minLevel:2, type:"single",
     options:["defense","dueling","great-weapon","protection"],
     optionsDict:FIGHTING_STYLES,
     desc:"Выберите боевой стиль."}
  ],
  "Следопыт": [
    {id:"fighting-style", name:"Боевой стиль", icon:"⚔️", minLevel:2, type:"single",
     options:["archery","defense","dueling","two-weapon"],
     optionsDict:FIGHTING_STYLES,
     desc:"Выберите боевой стиль."},
    {id:"favored-enemy", name:"Избранный враг", icon:"🎯", minLevel:1, type:"multi",
     options:Object.keys(FAVORED_ENEMIES), optionsDict:FAVORED_ENEMIES,
     getCount:function(lvl){ return lvl>=14 ? 3 : (lvl>=6 ? 2 : 1); },
     desc:"Выберите тип избранных врагов. Расширяется на 6 и 14 уровнях."},
    {id:"natural-explorer", name:"Исследователь природы", icon:"🌲", minLevel:1, type:"multi",
     options:Object.keys(FAVORED_TERRAINS), optionsDict:FAVORED_TERRAINS,
     getCount:function(lvl){ return lvl>=10 ? 3 : (lvl>=6 ? 2 : 1); },
     desc:"Выберите известную местность. Расширяется на 6 и 10 уровнях."}
  ],
  "Волшебник": [
    {id:"spell-mastery-1", name:"Мастерство заклинателя: 1 уровень", icon:"📖", minLevel:18, type:"single", options:[], optionsDict:{},
     optionsFn:function(char){ return ccWizardBookSpells(char, 1); },
     desc:"Заклинание 1 уровня из книги: пока подготовлено, на своём уровне без ячейки. Замена — 8 часов изучения."},
    {id:"spell-mastery-2", name:"Мастерство заклинателя: 2 уровень", icon:"📖", minLevel:18, type:"single", options:[], optionsDict:{},
     optionsFn:function(char){ return ccWizardBookSpells(char, 2); },
     desc:"Заклинание 2 уровня из книги: пока подготовлено, на своём уровне без ячейки. Замена — 8 часов изучения."},
    {id:"signature-1", name:"Фирменное заклинание 1", icon:"📖", minLevel:20, type:"single", options:[], optionsDict:{},
     optionsFn:function(char){ return ccWizardBookSpells(char, 3, false, "signature-2"); },
     desc:"Заклинание 3 уровня из книги. Всегда подготовлено, раз до короткого или длинного отдыха 3 уровнем без ячейки."},
    {id:"signature-2", name:"Фирменное заклинание 2", icon:"📖", minLevel:20, type:"single", options:[], optionsDict:{},
     optionsFn:function(char){ return ccWizardBookSpells(char, 3, false, "signature-1"); },
     desc:"Заклинание 3 уровня из книги. Всегда подготовлено, раз до короткого или длинного отдыха 3 уровнем без ячейки."}
  ],
  "Чародей": [
    {id:"metamagic", name:"Метамагия", icon:"✨", minLevel:3, type:"multi",
     options:Object.keys(SORCERER_METAMAGIC), optionsDict:SORCERER_METAMAGIC,
     getCount:function(lvl){ return lvl>=17 ? 4 : (lvl>=10 ? 3 : 2); },
     desc:"Выберите варианты метамагии. На 10 и 17 уровнях открываются новые слоты."}
  ],
  "Колдун": [
    {id:"pact-boon", name:"Предмет договора", icon:"🕯️", minLevel:3, type:"single",
     options:Object.keys(WARLOCK_PACT_BOONS), optionsDict:WARLOCK_PACT_BOONS,
     desc:"Выберите предмет договора своего покровителя."},
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
     desc:"Выберите воззвания. Некоторые требуют уровня или предмета договора.",
     filterByReq:true}
  ],
  "Бард": [
    {id:"expertise", name:"Компетентность", icon:"🎓", minLevel:3, type:"multi", pool:"skills",
     getCount:function(lvl){ return lvl>=10 ? 4 : 2; },
     desc:"Удвойте бонус мастерства для выбранных навыков (уровни 3 и 10, по 2 навыка)."},
    {id:"magical-secrets", name:"Тайны магии", icon:"📜", minLevel:10, type:"freeform",
     getCount:function(lvl){ return lvl>=18 ? 6 : (lvl>=14 ? 4 : 2); },
     desc:"Запишите выбранные заклинания любого класса (уровни 10/14/18, по 2 заклинания)."}
  ],
  "Изобретатель": [
    {id:"infusions", name:"Известные инфузии", icon:"🔧", minLevel:2, type:"multi",
     options:Object.keys(ARTIFICER_INFUSIONS), optionsDict:ARTIFICER_INFUSIONS,
     getCount:function(lvl){ return lvl>=18 ? 12 : (lvl>=14 ? 10 : (lvl>=10 ? 8 : (lvl>=6 ? 6 : 4))); },
     desc:"Выберите инфузии. Новые открываются на 6, 10, 14 и 18 уровнях.",
     filterByReq:true}
  ],
  "Плут": [
    {id:"expertise", name:"Компетентность", icon:"🎓", minLevel:1, type:"multi", pool:"skills",
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
  if (typeof charClassLevel === "function") return charClassLevel(char, className);
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

// E24-8: таблицы выборов по редакции персонажа (CLASS_CHOICES/SUBCLASS_CHOICES
// у 2024-персонажа приходят из data-2024.js через edData); без edData — глобалы.
function ccTables(char) {
  var ed = (typeof edData === "function") ? edData(char) : null;
  return {
    CC: (ed && ed.CLASS_CHOICES) || CLASS_CHOICES,
    SC: (ed && ed.SUBCLASS_CHOICES) || ((typeof SUBCLASS_CHOICES !== "undefined") ? SUBCLASS_CHOICES : null)
  };
}

// Находит определение выбора в CLASS_CHOICES[className] или SUBCLASS_CHOICES[subclass]
function ccFindChoice(char, className, choiceId) {
  var T = ccTables(char);
  var defs = T.CC[className];
  if (defs) {
    var c = defs.find(function(x){ return x.id === choiceId; });
    if (c) return c;
  }
  if (T.SC && char && char.classes) {
    for (var i = 0; i < char.classes.length; i++) {
      if (char.classes[i].class === className) {
        var sub = char.classes[i].subclass;
        if (sub && T.SC[sub]) {
          var c2 = T.SC[sub].find(function(x){ return x.id === choiceId; });
          if (c2) return c2;
        }
        break;
      }
    }
  }
  if (T.SC && char && char.subclass && T.SC[char.subclass]) {
    var c3 = T.SC[char.subclass].find(function(x){ return x.id === choiceId; });
    if (c3) return c3;
  }
  return null;
}

// Получить подкласс для заданного класса персонажа
function ccGetSubclass(char, className) {
  if (char && char.classes) {
    for (var i = 0; i < char.classes.length; i++) {
      if (char.classes[i].class === className) return char.classes[i].subclass || "";
    }
  }
  return char.subclass || "";
}

function ccCount(choice, classLevel) {
  if (typeof choice.getCount === "function") return choice.getCount(classLevel);
  return 1;
}

// Возвращает массив доступных опций (с фильтром по уровню/пакту/заклинаниям)
function ccAvailableOptions(choice, char, className) {
  if (choice.optionsFn) return choice.optionsFn(char);
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
    if (opt.req.subclass) {
      var sub = ccGetSubclass(char, className);
      var reqSub = opt.req.subclass;
      if (Array.isArray(reqSub)) { if (reqSub.indexOf(sub) === -1) return false; }
      else if (sub !== reqSub) return false;
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
  var T = ccTables(char);
  active.forEach(function(cls) {
    var defs = T.CC[cls];
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

  // Subclass choices (SUBCLASS_CHOICES keyed by subclass name)
  if (T.SC) {
    active.forEach(function(cls) {
      var subclass = "";
      if (char.classes && Array.isArray(char.classes)) {
        for (var i = 0; i < char.classes.length; i++) {
          if (char.classes[i].class === cls) { subclass = char.classes[i].subclass || ""; break; }
        }
      } else {
        subclass = char.subclass || "";
      }
      if (!subclass) return;
      var defs = T.SC[subclass];
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
        result.push({className:cls, subclass:subclass, choice:choice, classLevel:classLevel, count:count, current:current, isComplete:isComplete});
      });
    });
  }

  return result;
}

// ============================================================
// РЕНДЕР — карточки выборов (вставляются в asi-container)
// ============================================================
function renderClassChoices(char, container) {
  if (!container) return;
  var items = ccGetAllChoicesFor(char);
  if (items.length === 0) return;

  var useAccordion = items.length > 4;
  var groups = {};
  var groupOrder = [];
  var SC = ccTables(char).SC;
  items.forEach(function(it){
    var sub = ccGetSubclass(char, it.className);
    var isSubChoice = SC && sub && SC[sub] &&
      SC[sub].some(function(x){ return x.id === it.choice.id; });
    var key = isSubChoice ? (it.className + " — " + sub) : it.className;
    if (!groups[key]) { groups[key] = []; groupOrder.push(key); }
    groups[key].push(it);
  });

  function renderCard(it){
    var c = it.choice;
    var cls = it.className;
    var statusBadge, statusClass, summary;
    if (it.isComplete) {
      statusClass = "cc-card cc-complete";
      if (c.type === "single") {
        var optName = c.optionsDict && c.optionsDict[it.current] ? c.optionsDict[it.current].name : it.current;
        summary = "✅ " + escapeHtml(optName);
      } else {
        var arr = Array.isArray(it.current) ? it.current : [];
        var names = arr.map(function(id){ return (c.optionsDict && c.optionsDict[id]) ? c.optionsDict[id].name : id; });
        summary = "✅ " + escapeHtml(names.join(", "));
      }
      statusBadge = '<span class="cc-badge cc-badge-done">' + it.count + "/" + it.count + "</span>";
    } else {
      statusClass = "cc-card cc-pending";
      var have = (c.type === "single") ? (it.current ? 1 : 0) : (Array.isArray(it.current) ? it.current.length : 0);
      summary = '<span class="cc-hint">' + escapeHtml(c.desc || "") + "</span>";
      // BUILD-LVL-3/5: показать рекомендацию билда прямо на невыбранной карточке (single + multi).
      var recIds = (typeof getBuildRecChoiceIds === "function") ? getBuildRecChoiceIds(char, c.id) : [];
      if (recIds.length) {
        var recNames = recIds.map(function(rid){
          return (c.optionsDict && c.optionsDict[rid]) ? c.optionsDict[rid].name : rid;
        });
        summary += ' <span class="rec-badge">💡 ' + escapeHtml(recNames.join(", ")) + '</span>';
      }
      statusBadge = '<span class="cc-badge cc-badge-todo">' + have + "/" + it.count + "</span>";
    }
    var classLabel = (!useAccordion && ccGetActiveClasses(char).length > 1)
      ? ' <span class="cc-class-tag">' + escapeHtml(cls) + "</span>" : "";
    return '<button class="' + statusClass + '" onclick="openClassChoiceModal(\'' + cls + '\',\'' + c.id + '\')">' +
        '<div class="cc-card-left">' +
          '<div class="cc-card-title">' + escapeHtml(c.name) + classLabel + statusBadge + '</div>' +
          '<div class="cc-card-summary">' + summary + '</div>' +
        '</div>' +
        '<span class="cc-card-arrow">›</span>' +
      '</button>';
  }

  var html = '<div class="class-choices-wrap">';
  if (useAccordion) {
    groupOrder.forEach(function(key){
      var g = groups[key];
      var doneN = g.filter(function(x){ return x.isComplete; }).length;
      html += '<details class="cc-group" open>' +
        '<summary class="cc-group-head">' + escapeHtml(key) +
        ' <span class="cc-badge cc-badge-' + (doneN===g.length?'done':'todo') + '">' + doneN + '/' + g.length + '</span></summary>' +
        '<div class="cc-group-body">';
      g.forEach(function(it){ html += renderCard(it); });
      html += '</div></details>';
    });
    html += '</div>';
    container.insertAdjacentHTML("beforeend", html);
    return;
  }

  items.forEach(function(it) {
    html += renderCard(it);
  });
  html += '</div>';
  container.insertAdjacentHTML("beforeend", html);
}

// ============================================================
// МОДАЛ ВЫБОРА
// ============================================================
var ccModalState = { className:null, choiceId:null, selection:null };

function openClassChoiceModal(className, choiceId) {
  var char = ccGetChar();
  if (!char) return;
  var choice = ccFindChoice(char, className, choiceId);
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
  // BUILD-LVL-4: обновить чек-лист guided level-up, если он открыт
  if (typeof luRefreshChoices === "function") luRefreshChoices();
}

function buildClassChoiceModal(char, choice, className, classLevel) {
  var modal = document.getElementById("class-choice-modal");
  if (!modal) return;

  var count = ccCount(choice, classLevel);
  var titleEl = modal.querySelector(".cc-modal-title");
  var descEl  = modal.querySelector(".cc-modal-desc");
  var bodyEl  = modal.querySelector(".cc-modal-body");
  var counterEl = modal.querySelector(".cc-modal-counter");

  // PT-006: выбор подкласса подписан подклассом («Приёмы · Боевой мастер»)
  var T = ccTables(char);
  var own = (T.CC[className] || []).indexOf(choice) !== -1;
  // PLAY2-5 (PT-083): подкласс — по таблице, где лежит выбор; в мастере повышения он ещё может быть не записан
  var subOf = own ? "" : (Object.keys(T.SC || {}).filter(function(k) { return (T.SC[k] || []).indexOf(choice) !== -1; })[0] || ccGetSubclass(char, className));
  if (titleEl) titleEl.textContent = choice.name + " · " + (subOf || className);
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
    // СОЗД-5: компетентность — только из навыков, которыми персонаж владеет (PHB 2014)
    var ccSel = Array.isArray(ccModalState.selection) ? ccModalState.selection : [];
    optionIds = (typeof skills !== "undefined" ? skills.filter(function(s, si) {
      return (char.skills && char.skills[si]) || ccSel.indexOf(s.name) !== -1;
    }).map(function(s) { return s.name; }) : []);
    // PLAY3-3: плут может взять компетентность в воровских инструментах (PHB 2014/2024)
    if (className === "Плут") optionIds.push("Воровские инструменты");
  }

  // BUILD-LVL-3/5: рекомендация билда — баннер сверху + подсветка опции(й). single + multi.
  var recOptIds = (typeof getBuildRecChoiceIds === "function") ? getBuildRecChoiceIds(char, choice.id) : [];
  var levelRec = (typeof getBuildLevelRec === "function") ? getBuildLevelRec(char, choice.minLevel) : null;
  var recBannerHtml = "";
  if (recOptIds.length || (levelRec && levelRec.headline)) {
    var recNames = recOptIds.map(function(rid){
      return (choice.optionsDict && choice.optionsDict[rid]) ? choice.optionsDict[rid].name : rid;
    });
    recBannerHtml = '<div class="rec-banner"><span class="rec-badge">💡 Совет билда</span> ' +
      (recNames.length ? '<b class="rec-text">' + escapeHtml(recNames.join(", ")) + '</b> ' : '') +
      (levelRec && (levelRec.why || levelRec.headline) ? '<span class="rec-why">' + escapeHtml(levelRec.why || levelRec.headline) + '</span>' : '') +
      '</div>';
  }

  // PT-044: изученные ранее (сохранённые) опции помечены отдельно от новых
  var stored = ccGetStored(char, className, choice.id);
  var known = (choice.type === "multi" && Array.isArray(stored)) ? stored : [];
  var bodyHtml = '<div class="cc-options-list" role="' + (choice.type === "single" ? "radiogroup" : "group") + '" aria-label="' + escapeHtml(choice.name) + '">';
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
    var isRec = (recOptIds.indexOf(id) !== -1);
    var mark = !selected ? "" : (known.indexOf(id) !== -1 ? "изучено ранее" : (known.length ? "новое" : ""));
    var reqText = "";
    if (opt.req) {
      var bits = [];
      if (opt.req.level) bits.push("ур." + opt.req.level);
      if (opt.req.pact)  bits.push(WARLOCK_PACT_BOONS[opt.req.pact] ? WARLOCK_PACT_BOONS[opt.req.pact].name : opt.req.pact);
      if (opt.req.text)  bits.push(opt.req.text);
      if (bits.length) reqText = '<span class="cc-opt-req">' + bits.join(" · ") + "</span>";
    }
    bodyHtml +=
      '<div class="cc-opt' + (selected ? " selected" : "") + (isRec ? " is-rec" : "") + '" role="' + (choice.type === "single" ? "radio" : "checkbox") + '" aria-checked="' + selected + '" tabindex="0" data-opt="' + escapeHtml(id) + '" onkeydown="ccOptKey(event)" onclick="ccToggleOption(\'' + id.replace(/'/g,"\\'") + '\')">' +
        '<div class="cc-opt-head"><span class="cc-opt-name">' + escapeHtml(opt.name) + '</span>' + (isRec ? ' <span class="rec-badge">💡 совет</span>' : '') + (mark ? ' <span class="cc-opt-req">' + mark + '</span>' : '') + reqText + '</div>' +
        (opt.desc ? '<div class="cc-opt-desc">' + escapeHtml(opt.desc) + '</div>' : "") +
      '</div>';
  });
  if (choice.pool === "skills" && !optionIds.length) bodyHtml += '<div class="cc-opt-desc">Сначала отметьте владение навыками — компетентность выбирается из них.</div>';
  bodyHtml += '</div>';
  bodyEl.innerHTML = recBannerHtml + bodyHtml;

  if (counterEl) {
    if (choice.type === "single") {
      counterEl.textContent = "Выберите 1 вариант";
    } else {
      var have = (ccModalState.selection || []).length;
      // PLAY3-3: изученное на прошлых уровнях не считается новым выбором
      var prevSel = ccGetStored(char, className, choice.id);
      var prevN = Array.isArray(prevSel) ? prevSel.filter(function(x) { return (ccModalState.selection || []).indexOf(x) !== -1; }).length : 0;
      counterEl.textContent = prevN ? ("Новых " + (have - prevN) + " из " + (count - prevN) + " · изучено ранее: " + prevN) : ("Выбрано " + have + " из " + count);
    }
  }
  ccUpdateModalApplyBtn();
}

function ccToggleOption(id) {
  var char = ccGetChar();
  if (!char) return;
  var className = ccModalState.className;
  var choiceId  = ccModalState.choiceId;
  var choice = ccFindChoice(char, className, choiceId);
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
  // PLAY2-8 (PT-094): после перерисовки фокус остаётся на том же варианте
  var opts = document.querySelectorAll("#class-choice-modal .cc-opt[data-opt]");
  for (var i = 0; i < opts.length; i++) if (opts[i].getAttribute("data-opt") === id) { opts[i].focus(); break; }
}

function ccOptKey(e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  e.currentTarget.click();
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
  var choice = ccFindChoice(char, ccModalState.className, ccModalState.choiceId);
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
  var choice = ccFindChoice(char, className, choiceId);
  if (!choice) return;

  var value;
  if (choice.type === "single") {
    value = ccModalState.selection;
  } else if (choice.type === "multi") {
    value = (ccModalState.selection || []).slice();
  } else if (choice.type === "freeform") {
    value = (ccModalState.selection || []).filter(function(s) { return s && s.trim() !== ""; });
  }

  // PLAY2-5 (PT-085): выбор-навык (Ученик войны 2024) ставит владение, прежний снимает
  // PLAY3-6а: выбор нескольких навыков (Доп. владение Коллегии знаний 2024)
  if (choice.skillGrant && choice.type === "multi" && typeof _raceSkillSet === "function") {
    var prevArr = ccGetStored(char, className, choiceId) || [];
    var clash = value.filter(function(n) {
      if (prevArr.indexOf(n) >= 0) return false;
      var si = skills.findIndex(function(s) { return s.name === n; });
      return si !== -1 && char.skills && char.skills[si];
    });
    if (clash.length) {
      if (typeof showToast === "function") showToast("Навык уже есть: " + clash.join(", ") + " — выберите другой.", "warning");
      return;
    }
    prevArr.forEach(function(n) { if (value.indexOf(n) < 0) _raceSkillSet(char, n, false); });
    value.forEach(function(n) { if (prevArr.indexOf(n) < 0) _raceSkillSet(char, n, true); });
    if (typeof updateSkillProfCount === "function") updateSkillProfCount();
  } else if (choice.skillGrant && typeof _raceSkillSet === "function") {
    var prevSk = ccGetStored(char, className, choiceId);
    if (value !== prevSk) {
      var siNew = skills.findIndex(function(s) { return s.name === value; });
      if (siNew !== -1 && char.skills && char.skills[siNew]) {
        if (typeof showToast === "function") showToast("Этот навык уже есть — выберите другой.", "warning");
        return;
      }
      if (prevSk) _raceSkillSet(char, prevSk, false);
      _raceSkillSet(char, value, true);
      if (typeof updateSkillProfCount === "function") updateSkillProfCount();
    }
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
  if (typeof showToast === "function") showToast("Выбор сохранён: " + choice.name, "success");
  closeClassChoiceModal();
  if (typeof updateClassFeatures === "function") updateClassFeatures();
  if (typeof calcStats === "function") calcStats();
  if (typeof scheduleCreationTodo === "function") scheduleCreationTodo();
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
  window.ccFindChoice = ccFindChoice;
  window.ccGetSubclass = ccGetSubclass;
}
