// FIN-5: каталог обычного снаряжения PHB 2014 гл.5 «Снаряжение». Грузится ЛЕНИВО
// через window.ensureGearCatalog() (см. инлайн-загрузчик в index.html) — не входит
// в стартовый бандл. Используется пикером в модалке инвентаря (app-inventory.js).
//
// Схема записи:
//   { id, name, cat, cost, weight, slots, desc }
//   id:     уникальная строка (латиница-kebab)
//   cat:    ключ ITEM_ICONS (data.js): weapon|armor|potion|scroll|tool|material|other
//   cost:   строка с ценой по книге ("2 зм" / "5 см" / "1 мм")
//   weight: число, фунты (0 — пренебрежимо мал)
//   slots:  сколько слотов рюкзака занимает 1 шт. (мелочь — 0, ёмкости/крупное — 1+)
//   desc:   краткое описание (RU), 1 предложение
//
// Имена/цены/веса — по переводу PHantom 2014. Наборы снаряжения (packs) — отдельно
// в GEAR_PACKS (data.js), разворачиваются addPackToInventory(). Транспорт/ездовые
// и безделушки d100 добавляются в этот файл в фазе FIN-9.
window.GEAR_CATALOG = [
  // ── Боеприпасы ────────────────────────────────────────────────────────────
  { id:"arrows",             name:"Стрелы (20)",              cat:"other",    cost:"1 зм",   weight:1,    slots:0, desc:"Боеприпасы для лука. Колчан вмещает 20." },
  { id:"bolts",              name:"Болты (20)",               cat:"other",    cost:"1 зм",   weight:1.5,  slots:0, desc:"Боеприпасы для арбалета." },
  { id:"bullets",           name:"Пули для пращи (20)",      cat:"other",    cost:"4 мм",   weight:1.5,  slots:0, desc:"Свинцовые пули для пращи." },
  { id:"needles",           name:"Иглы (50)",                cat:"other",    cost:"1 зм",   weight:1,    slots:0, desc:"Боеприпасы для духовой трубки." },
  // ── Фокусировки и компоненты ──────────────────────────────────────────────
  { id:"component-pouch",    name:"Мешочек с компонентами",   cat:"material", cost:"25 зм",  weight:2,    slots:1, desc:"Материальные компоненты заклинаний без указанной цены." },
  { id:"arcane-crystal",     name:"Хрустальная фокусировка",  cat:"material", cost:"10 зм",  weight:1,    slots:0, desc:"Магическая фокусировка мага, колдуна или чародея." },
  { id:"orb-focus",          name:"Держава",                  cat:"material", cost:"20 зм",  weight:3,    slots:1, desc:"Магическая фокусировка (сфера-держава)." },
  { id:"wand-focus",         name:"Волшебная палочка (фокус)",cat:"material", cost:"10 зм",  weight:1,    slots:0, desc:"Магическая фокусировка заклинателя." },
  { id:"druidic-focus",      name:"Друидическая фокусировка", cat:"material", cost:"1 зм",   weight:0,    slots:0, desc:"Омела, тотем или тисовый жезл друида." },
  { id:"holy-symbol",        name:"Священный символ",         cat:"material", cost:"5 зм",   weight:1,    slots:0, desc:"Амулет, эмблема или реликварий — фокусировка жреца/паладина." },
  // ── Ёмкости ───────────────────────────────────────────────────────────────
  { id:"backpack",           name:"Рюкзак",                   cat:"other",    cost:"2 зм",   weight:5,    slots:1, desc:"Вмещает 30 фнт (1 кубофут)." },
  { id:"chest",              name:"Сундук",                   cat:"other",    cost:"5 зм",   weight:25,   slots:2, desc:"Вмещает 300 фнт (12 кубофутов)." },
  { id:"flask",              name:"Фляга",                    cat:"other",    cost:"2 мм",   weight:1,    slots:0, desc:"Вмещает 1 пинту жидкости." },
  { id:"iron-pot",           name:"Котелок железный",         cat:"other",    cost:"2 зм",   weight:10,   slots:1, desc:"Вмещает 1 галлон. Готовка на костре." },
  { id:"pouch",              name:"Мешочек (поясной)",        cat:"other",    cost:"5 см",   weight:1,    slots:0, desc:"Вмещает 6 фнт (0.2 кубофута)." },
  { id:"sack",               name:"Мешок",                    cat:"other",    cost:"1 мм",   weight:0.5,  slots:0, desc:"Вмещает 30 фнт (1 кубофут)." },
  { id:"vial",               name:"Флакон",                   cat:"other",    cost:"1 зм",   weight:0,    slots:0, desc:"Вмещает 4 унции жидкости." },
  { id:"waterskin",          name:"Бурдюк",                   cat:"other",    cost:"2 см",   weight:5,    slots:0, desc:"Вмещает 4 пинты воды (полный — 5 фнт)." },
  // ── Свет и огонь ──────────────────────────────────────────────────────────
  { id:"candle",             name:"Свеча",                    cat:"other",    cost:"1 мм",   weight:0,    slots:0, desc:"Свет 1.5 м, горит 1 час." },
  { id:"torch",              name:"Факел",                    cat:"other",    cost:"1 мм",   weight:1,    slots:0, desc:"Свет 6 м, горит 1 час; 1 огнём в ближнем бою." },
  { id:"tinderbox",          name:"Трутница",                 cat:"other",    cost:"5 см",   weight:1,    slots:0, desc:"Огниво, кремень и трут. Розжиг за действие." },
  { id:"hooded-lantern",     name:"Фонарь закрытый",          cat:"other",    cost:"5 зм",   weight:2,    slots:1, desc:"Свет 9 м; можно приглушить до 1.5 м. Масло 6 часов." },
  { id:"oil-flask",          name:"Масло (фляга)",            cat:"other",    cost:"1 см",   weight:1,    slots:0, desc:"Фонарю на 6 часов; метнуть — 5 огнём." },
  // ── Верёвки, лазание, преграды ────────────────────────────────────────────
  { id:"hemp-rope",          name:"Верёвка пеньковая (15 м)", cat:"other",    cost:"1 зм",   weight:10,   slots:1, desc:"50 футов. КД 11, 2 ХП, чтобы разорвать." },
  { id:"grappling-hook",     name:"Крюк-кошка",               cat:"other",    cost:"2 зм",   weight:4,    slots:0, desc:"Зацепиться верёвкой за уступ." },
  { id:"piton",              name:"Колышек железный",         cat:"other",    cost:"5 мм",   weight:0.25, slots:0, desc:"Забить в трещину, чтобы закрепить верёвку." },
  { id:"iron-spikes",        name:"Шипы железные (10)",       cat:"other",    cost:"1 зм",   weight:5,    slots:0, desc:"Заклинить дверь или закрепить верёвку." },
  { id:"pole",               name:"Шест (3 м)",               cat:"other",    cost:"5 мм",   weight:7,    slots:0, desc:"10 футов. Прощупать пол на ловушки." },
  // ── Провизия и лагерь ─────────────────────────────────────────────────────
  { id:"rations",            name:"Рацион (1 день)",          cat:"other",    cost:"5 см",   weight:2,    slots:0, desc:"Сухие пайки на день пути." },
  { id:"bedroll",            name:"Спальный мешок",           cat:"other",    cost:"1 зм",   weight:7,    slots:0, desc:"Спальное место в походе." },
  { id:"blanket",            name:"Одеяло",                   cat:"other",    cost:"5 см",   weight:3,    slots:0, desc:"Тёплое шерстяное одеяло." },
  { id:"tent",               name:"Палатка",                  cat:"other",    cost:"2 зм",   weight:20,   slots:2, desc:"Двухместная переносная палатка." },
  // ── Взлом и хитрости ──────────────────────────────────────────────────────
  { id:"crowbar",            name:"Лом",                      cat:"tool",     cost:"2 зм",   weight:5,    slots:1, desc:"Преимущество на СИЛ там, где помогает рычаг." },
  { id:"hammer",             name:"Молоток",                  cat:"tool",     cost:"1 зм",   weight:3,    slots:0, desc:"Забить колышек, шип." },
  { id:"lock",               name:"Замок",                    cat:"other",    cost:"10 зм",  weight:1,    slots:0, desc:"Открыть без ключа — воровские инструменты СЛ 15." },
  { id:"manacles",           name:"Наручники",                cat:"other",    cost:"2 зм",   weight:6,    slots:1, desc:"Сковать существо. Побег — Ловкость СЛ 20." },
  { id:"chain",              name:"Цепь (3 м)",               cat:"other",    cost:"5 зм",   weight:10,   slots:1, desc:"10 футов. КД 19, 10 ХП." },
  { id:"caltrops",           name:"Калтропы (мешок)",         cat:"other",    cost:"1 зм",   weight:2,    slots:0, desc:"Рассыпать 1.5×1.5 м: 1 колющий, скорость 0." },
  { id:"ball-bearings",      name:"Шарики (мешок 1000)",      cat:"other",    cost:"1 зм",   weight:2,    slots:0, desc:"Рассыпать 3×3 м: Ловкость СЛ 10 или падение." },
  // ── Метательные склянки ───────────────────────────────────────────────────
  { id:"acid-flask",         name:"Кислота (флакон)",         cat:"other",    cost:"25 зм",  weight:1,    slots:0, desc:"Метнуть как импровизированное оружие: 2к6 кислотой." },
  { id:"holy-water",         name:"Святая вода (флакон)",     cat:"other",    cost:"25 зм",  weight:1,    slots:0, desc:"Метнуть: 2к6 излучением по нежити/исчадию." },
  // ── Письмо и знания ───────────────────────────────────────────────────────
  { id:"ink",                name:"Чернильница",              cat:"other",    cost:"10 зм",  weight:0,    slots:0, desc:"Флакон чернил (1 унция)." },
  { id:"ink-pen",            name:"Перо для письма",          cat:"other",    cost:"2 мм",   weight:0,    slots:0, desc:"Гусиное перо." },
  { id:"parchment",          name:"Пергамент (10 листов)",    cat:"other",    cost:"1 см",   weight:0,    slots:0, desc:"Чистые листы для письма." },
  { id:"scroll-case",        name:"Футляр для свитков",       cat:"other",    cost:"1 зм",   weight:1,    slots:0, desc:"Хранит свитки и карты." },
  { id:"book",               name:"Книга",                    cat:"other",    cost:"25 зм",  weight:5,    slots:1, desc:"Том знаний, стихов или записей." },
  { id:"spellbook",          name:"Книга заклинаний",         cat:"other",    cost:"50 зм",  weight:3,    slots:1, desc:"100 пустых страниц. Источник магии волшебника." },
  // ── Инструменты и наборы ──────────────────────────────────────────────────
  { id:"climbers-kit",       name:"Альпинистский набор",      cat:"tool",     cost:"25 зм",  weight:12,   slots:1, desc:"Крючья, зажимы, ремни — закрепиться на месте." },
  { id:"healers-kit",        name:"Набор целителя",           cat:"tool",     cost:"5 зм",   weight:3,    slots:1, desc:"10 применений. Стабилизировать умирающего без проверки." },
  { id:"sledgehammer",       name:"Молот кузнечный",          cat:"tool",     cost:"2 зм",   weight:10,   slots:1, desc:"Тяжёлый двуручный молот." },
  { id:"shovel",             name:"Лопата",                   cat:"tool",     cost:"2 зм",   weight:5,    slots:1, desc:"Копать землю." },
  { id:"merchant-scale",     name:"Весы торговца",            cat:"tool",     cost:"5 зм",   weight:3,    slots:1, desc:"Взвесить монеты и мелкий товар." },
  // ── Прочее полезное ───────────────────────────────────────────────────────
  { id:"hunting-trap",       name:"Охотничий силок",          cat:"other",    cost:"5 зм",   weight:25,   slots:2, desc:"Захлопывается: 1к4 колющий, скорость 0." },
  { id:"whetstone",          name:"Точильный камень",         cat:"other",    cost:"1 мм",   weight:1,    slots:0, desc:"Заточить лезвие." },
  // ── Зелья-расходники ──────────────────────────────────────────────────────
  { id:"antitoxin",          name:"Противоядие (флакон)",     cat:"potion",   cost:"50 зм",  weight:0,    slots:0, desc:"Выпить: преимущество на спасброски от яда 1 час." },
  { id:"basic-poison",       name:"Яд простой (флакон)",      cat:"potion",   cost:"100 зм", weight:0,    slots:0, desc:"Нанести на оружие: +1к4 яд, спас ТЕЛ СЛ 10 (действует 1 мин)." }
];
