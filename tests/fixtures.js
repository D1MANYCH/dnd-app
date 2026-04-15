// Эталонные ожидания для тестов — PHB 2014.
// Держим компактно: только ключевые инварианты, не дублируем всю таблицу.

window.FIX = (function(){

  // Ожидаемые ячейки: Колдун (пакт) — строго, прочие — выборочно на ключевых уровнях
  var SLOTS = {
    "Колдун": {
      1:[0,1,0,0,0,0,0,0,0,0], 2:[0,2,0,0,0,0,0,0,0,0], 3:[0,0,2,0,0,0,0,0,0,0],
      5:[0,0,0,2,0,0,0,0,0,0], 7:[0,0,0,0,2,0,0,0,0,0], 9:[0,0,0,0,0,2,0,0,0,0],
      10:[0,0,0,0,0,2,0,0,0,0], 11:[0,0,0,0,0,3,0,0,0,0], 17:[0,0,0,0,0,4,0,0,0,0]
    },
    "Волшебник": {
      1:[0,2,0,0,0,0,0,0,0],  5:[0,4,3,2,0,0,0,0,0], 20:[0,4,3,3,3,3,2,2,1,1]
    },
    "Чародей": { 1:[0,2,0,0,0,0,0,0,0], 5:[0,4,3,2,0,0,0,0,0] },
    "Жрец":    { 1:[0,2,0,0,0,0,0,0,0], 5:[0,4,3,2,0,0,0,0,0] },
    "Друид":   { 1:[0,2,0,0,0,0,0,0,0], 5:[0,4,3,2,0,0,0,0,0] },
    "Бард":    { 1:[0,2,0,0,0,0,0,0,0], 5:[0,4,3,2,0,0,0,0,0] },
    "Паладин": { 1:[0,0,0,0,0,0,0,0,0], 2:[0,2,0,0,0,0,0,0,0], 5:[0,4,2,0,0,0,0,0,0], 20:[0,4,3,3,3,2,0,0,0] },
    "Следопыт":{ 1:[0,0,0,0,0,0,0,0,0], 2:[0,2,0,0,0,0,0,0,0], 5:[0,4,2,0,0,0,0,0,0] }
  };

  // Ожидаемые id выборов из ccGetAllChoicesFor на конкретных (класс, уровень, [подкласс])
  // Формат: {desc, char:{class, level, subclass?, classChoices?}, expect:[id,...]}
  var CHOICES = [
    { desc:"Воин L1 → fighting-style", char:{class:"Воин", level:1}, expect:["fighting-style"] },
    { desc:"Воин+Боевой мастер L3 → fighting-style + maneuvers",
      char:{class:"Воин", level:3, subclass:"Боевой мастер"}, expect:["fighting-style","maneuvers"] },
    { desc:"Воин+Чемпион L10 → fighting-style + additional-fighting-style",
      char:{class:"Воин", level:10, subclass:"Чемпион"}, expect:["fighting-style","additional-fighting-style"] },
    { desc:"Колдун L2 → invocations", char:{class:"Колдун", level:2}, expect:["invocations"] },
    { desc:"Колдун L3 → pact-boon + invocations", char:{class:"Колдун", level:3}, expect:["pact-boon","invocations"] },
    { desc:"Колдун L10 (с покровителем) → pact-boon + invocations",
      char:{class:"Колдун", level:10, subclass:"Договор с феей"}, expect:["pact-boon","invocations"] },
    { desc:"Чародей L3 → metamagic", char:{class:"Чародей", level:3}, expect:["metamagic"] },
    { desc:"Бард L3 → expertise", char:{class:"Бард", level:3}, expect:["expertise"] },
    { desc:"Бард L10 → expertise + magical-secrets", char:{class:"Бард", level:10}, expect:["expertise","magical-secrets"] },
    { desc:"Плут L1 → expertise", char:{class:"Плут", level:1}, expect:["expertise"] },
    { desc:"Следопыт L1 → favored-enemy + natural-explorer (fs с L2)",
      char:{class:"Следопыт", level:1}, expect:["favored-enemy","natural-explorer"] },
    { desc:"Следопыт L2 → + fighting-style",
      char:{class:"Следопыт", level:2}, expect:["favored-enemy","natural-explorer","fighting-style"] },
    { desc:"Варвар+Тотем L3 → totem-spirit",
      char:{class:"Варвар", level:3, subclass:"Путь воина-тотема"}, expect:["totem-spirit"] },
    { desc:"Варвар+Тотем L14 → totem-spirit+aspect+attunement",
      char:{class:"Варвар", level:14, subclass:"Путь воина-тотема"}, expect:["totem-spirit","aspect-of-the-beast","totemic-attunement"] },
    { desc:"Чародей+Драконья кровь L1 → metamagic(пусто L1) + draconic-ancestry",
      char:{class:"Чародей", level:1, subclass:"Драконья кровь"}, expect:["draconic-ancestry"] },
    { desc:"Монах+4 стихии L3 → elemental-disciplines",
      char:{class:"Монах", level:3, subclass:"Путь четырёх стихий"}, expect:["elemental-disciplines"] },
    { desc:"Охотник L15 → все 4 выбора",
      char:{class:"Следопыт", level:15, subclass:"Охотник"},
      expect:["fighting-style","favored-enemy","natural-explorer","hunters-prey","defensive-tactics","multiattack","superior-hunters-defense"] },
    { desc:"Мультикласс Воин3/Колдун3 (Боевой мастер + Договор с феей)",
      char:{class:"Воин", level:6, classes:[
        {class:"Воин", level:3, subclass:"Боевой мастер"},
        {class:"Колдун", level:3, subclass:"Договор с феей"}
      ]},
      expect:["fighting-style","maneuvers","pact-boon","invocations"] }
  ];

  // Инварианты SUBCLASS_FEATURES: для каждого подкласса из SUBCLASSES должны быть фичи
  var SUBCLASS_COVERAGE = true; // проверяем пересечение в рантайме

  return {SLOTS, CHOICES, SUBCLASS_COVERAGE};
})();
