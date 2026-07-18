// ============================================================
// spell-effects.js — механика применения заклинаний (план CAST)
// Кураторская таблица «имя заклинания → дескриптор» + чистые хелперы.
// Ключ — точное name из spells.js: дубли PH14/PH24 покрываются одним
// ключом, редкие расхождения редакций — через bySource.
//
// Схема дескриптора (все поля опциональны):
//   effects:  ["effect_id", ...] — id карточек EFFECTS_DATA (data.js);
//             при касте вешаются в char.effects (CAST-1)
//   damage:   { formula:"8к6", upcast:"1к6", save:"dex"|"con"|"wis"|...,
//               halfOnSave:true, cantripTiers:{5:"2к10",11:"3к10",17:"4к10"} }
//   heal:     { formula:"1к8", upcast:"1к8", addSpellMod:true }
//   tempHp:   { formula:"1к4+4", upcast:"5" } — врем. ХП (не стакаются, берём max)
//   hpMaxBonus: { base:5, perUpcast:5 } — «Подмога»: +hpMax и +hpCurrent
//   summon:   { companionType:"familiar"|"mount"|"summoned"|"beast"|"other",
//               picker:"familiarForms" | srdSlug:"air-elemental" | prefill:{name,hp,ac,attack,desc},
//               byLevel:{ 5:{...} } — оверрайды полей префилла по уровню
//               ячейки (берётся старший ключ ≤ уровня каста) }
//   duration: { value:8, unit:"round"|"minute"|"hour"|"day"|"untilLongRest"|"instant"|"special" }
//   bySource: { PH24: {...} } — точечный оверрайд полей для одной редакции
//
// Формулы — в нотации parseDiceFormula (app-ui.js): «8к6», «1к4+4».
// Апкаст — конкатенация «+upcast» за каждый уровень ячейки выше базового
// (scaleFormula); результат остаётся валидной формулой.
// ============================================================

const SPELL_EFFECTS = {
  // ── Баффы/дебаффы (мост к EFFECTS_DATA — потребитель applyCastEffects, CAST-1) ──
  // Ловушки перевода (ключ = имя ЗАКЛИНАНИЯ из spells.js, карточка может зваться иначе):
  // Bane = «Порча» (id bane, карточка «Злосчастье»), Hex = «Сглаз» (id hex, карточка
  // «Порча (Колдун)»), Mirror Image = «Отражения», Divine Favor = «Божественное
  // благоволение» (карточка «Священное воодушевление»), Bestow Curse = «Проклятие»,
  // Pass Without Trace = «Бесследное передвижение».
  "Доспехи мага":              { effects: ["mage_armor"],         duration: { value: 8,  unit: "hour" } },
  "Щит":                       { effects: ["shield_spell"],       duration: { value: 1,  unit: "round" } },
  "Ускорение":                 { effects: ["haste"],              duration: { value: 1,  unit: "minute" } },
  "Размытый образ":            { effects: ["blur"],               duration: { value: 1,  unit: "minute" } },
  "Убежище":                   { effects: ["sanctuary"],          duration: { value: 1,  unit: "minute" } },
  "Благословение":             { effects: ["bless"],              duration: { value: 1,  unit: "minute" } },
  "Героизм":                   { effects: ["heroism"],            duration: { value: 1,  unit: "minute" } },
  "Огонь фей":                 { effects: ["faerie_fire"],        duration: { value: 1,  unit: "minute" } },
  "Защита от добра и зла":     { effects: ["protection_evil"],    duration: { value: 10, unit: "minute" } },
  "Бесследное передвижение":   { effects: ["pass_without_trace"], duration: { value: 1,  unit: "hour" } },
  "Отражения":                 { effects: ["mirror_image"],       duration: { value: 1,  unit: "minute" } },
  "Метка охотника":            { effects: ["hunters_mark"],       duration: { value: 1,  unit: "hour" } },
  "Божественное благоволение": { effects: ["divine_favor"],       duration: { value: 1,  unit: "minute" } },
  "Сглаз":                     { effects: ["hex"],                duration: { value: 1,  unit: "hour" } },
  "Проклятие":                 { effects: ["bestow_curse"],       duration: { value: 1,  unit: "minute" } },
  "Порча":                     { effects: ["bane"],               duration: { value: 1,  unit: "minute" } },
  "Замедление":                { effects: ["slow"],               duration: { value: 1,  unit: "minute" } },
  // Добивка CAST-6. Ловушка перевода: Spider Climb = заклинание «Паук»
  // (карточка «Паучье лазание»). Длительности совпадают в обеих редакциях;
  // расхождение «Дубовой коры» (PH24 без концентрации) снимается само —
  // флаг concentration берётся из duration-текста записи spells.js.
  "Щит веры":                  { effects: ["shield_of_faith"],    duration: { value: 10, unit: "minute" } },
  "Невидимость":               { effects: ["invisibility"],       duration: { value: 1,  unit: "hour" } },
  "Высшая невидимость":        { effects: ["greater_invisibility"], duration: { value: 1, unit: "minute" } },
  "Полёт":                     { effects: ["fly_spell"],          duration: { value: 10, unit: "minute" } },
  "Каменная кожа":             { effects: ["stoneskin"],          duration: { value: 1,  unit: "hour" } },
  "Защита от энергии":         { effects: ["protection_energy"],  duration: { value: 1,  unit: "hour" } },
  "Дубовая кора":              { effects: ["barkskin"],           duration: { value: 1,  unit: "hour" } },
  "Свобода перемещения":       { effects: ["freedom_movement"],   duration: { value: 1,  unit: "hour" } },
  "Защита от смерти":          { effects: ["death_ward"],         duration: { value: 8,  unit: "hour" } },
  "Огненный щит":              { effects: ["fire_shield"],        duration: { value: 10, unit: "minute" } },
  "Паук":                      { effects: ["spider_climb"],       duration: { value: 1,  unit: "hour" } },
  "Тёмное зрение":             { effects: ["darkvision_spell"],   duration: { value: 8,  unit: "hour" } },
  "Видение невидимого":        { effects: ["see_invisibility"],   duration: { value: 1,  unit: "hour" } },
  "Скороход":                  { effects: ["longstrider"],        duration: { value: 1,  unit: "hour" } },
  "Поспешное отступление":     { effects: ["expeditious_retreat"], duration: { value: 10, unit: "minute" } },
  "Защита от яда":             { effects: ["protection_poison"],  duration: { value: 1,  unit: "hour" } },
  "Подводное дыхание":         { effects: ["water_breathing"],    duration: { value: 24, unit: "hour" } },
  "Хождение по воде":          { effects: ["water_walk"],         duration: { value: 1,  unit: "hour" } },
  "Газообразная форма":        { effects: ["gaseous_form"],       duration: { value: 1,  unit: "hour" } },
  "Увеличение/уменьшение":     { effects: ["enlarge_reduce"],     duration: { value: 1,  unit: "minute" } },

  // ── Урон (потребитель _applyCastDamage, CAST-4) ─────────────────────────────
  // Формулы сверены с desc/higherLevel spells.js обеих редакций; расхождения
  // PH24 — через bySource. Заговоры растут по уровню ПЕРСОНАЖА (cantripTiers
  // 5/11/17, damageFormulaFor), ячейка не участвует. save — характеристика
  // спасброска ЦЕЛИ (тост с СЛ заклинателя); halfOnSave — половина урона при
  // успехе, без флага успех отменяет урон целиком. Мультилучевые («Мистический
  // заряд», «Палящий луч») бросаются суммой всех лучей одним броском.

  // Заговоры
  "Огненный снаряд":   { damage: { formula: "1к10", cantripTiers: { 5: "2к10", 11: "3к10", 17: "4к10" } } },
  "Луч холода":        { damage: { formula: "1к8",  cantripTiers: { 5: "2к8",  11: "3к8",  17: "4к8" } } },
  "Электрошок":        { damage: { formula: "1к8",  cantripTiers: { 5: "2к8",  11: "3к8",  17: "4к8" } } },
  "Мистический заряд": { damage: { formula: "1к10", cantripTiers: { 5: "2к10", 11: "3к10", 17: "4к10" } } },
  "Священное пламя":   { damage: { formula: "1к8",  cantripTiers: { 5: "2к8",  11: "3к8",  17: "4к8" }, save: "dex" } },
  // PH24: стало атакой вместо испытания ТЕЛ (кубы те же)
  "Ядовитые брызги":   { damage: { formula: "1к12", cantripTiers: { 5: "2к12", 11: "3к12", 17: "4к12" }, save: "con" },
                         bySource: { PH24: { damage: { formula: "1к12", cantripTiers: { 5: "2к12", 11: "3к12", 17: "4к12" } } } } },
  "Злая насмешка":     { damage: { formula: "1к4",  cantripTiers: { 5: "2к4",  11: "3к4",  17: "4к4" }, save: "wis" },
                         bySource: { PH24: { damage: { formula: "1к6", cantripTiers: { 5: "2к6", 11: "3к6", 17: "4к6" }, save: "wis" } } } },
  "Леденящее прикосновение": { damage: { formula: "1к8", cantripTiers: { 5: "2к8", 11: "3к8", 17: "4к8" } },
                         bySource: { PH24: { damage: { formula: "1к10", cantripTiers: { 5: "2к10", 11: "3к10", 17: "4к10" } } } } },

  // 1 уровень
  "Волшебная стрела":    { damage: { formula: "3к4+3", upcast: "1к4+1" } },
  "Огненные ладони":     { damage: { formula: "3к6",  upcast: "1к6",  save: "dex", halfOnSave: true } },
  "Волна грома":         { damage: { formula: "2к8",  upcast: "1к8",  save: "con", halfOnSave: true } },
  "Направленный снаряд": { damage: { formula: "4к6",  upcast: "1к6" } },
  "Луч болезни":         { damage: { formula: "2к8",  upcast: "1к8" } },
  "Нанесение ран":       { damage: { formula: "3к10", upcast: "1к10" },
                           bySource: { PH24: { damage: { formula: "2к10", upcast: "1к10" } } } },
  "Адское возмездие":    { damage: { formula: "2к10", upcast: "1к10", save: "dex", halfOnSave: true } },
  "Диссонирующий шёпот": { damage: { formula: "3к6",  upcast: "1к6",  save: "wis", halfOnSave: true } },
  // Начальное попадание; повторный тик бонусным действием (1к12) не бросаем
  "Ведьмин снаряд":      { damage: { formula: "1к12", upcast: "1к12" },
                           bySource: { PH24: { damage: { formula: "2к12", upcast: "1к12" } } } },

  // 2 уровень
  "Палящий луч":     { damage: { formula: "6к6",  upcast: "2к6" } }, // 3 луча по 2к6, апкаст = +1 луч
  "Дребезги":        { damage: { formula: "3к8",  upcast: "1к8",  save: "con", halfOnSave: true } },
  "Лунный луч":      { damage: { formula: "2к10", upcast: "1к10", save: "con", halfOnSave: true } },
  "Облако кинжалов": { damage: { formula: "4к4",  upcast: "2к4" } },

  // 3 уровень
  "Огненный шар":          { damage: { formula: "8к6",  upcast: "1к6",  save: "dex", halfOnSave: true } },
  "Молния":                { damage: { formula: "8к6",  upcast: "1к6",  save: "dex", halfOnSave: true } },
  "Призыв молнии":         { damage: { formula: "3к10", upcast: "1к10", save: "dex", halfOnSave: true } }, // 4к10 под открытым небом — не моделируем
  "Прикосновение вампира": { damage: { formula: "3к6",  upcast: "1к6" } },

  // 4 уровень
  "Град":     { damage: { formula: "2к8+4к6", upcast: "1к8", save: "dex", halfOnSave: true } },
  "Усыхание": { damage: { formula: "8к8",     upcast: "1к8", save: "con", halfOnSave: true } },

  // 5 уровень
  "Конус холода": { damage: { formula: "8к8", upcast: "1к8", save: "con", halfOnSave: true } },

  // 6 уровень
  "Круг смерти":     { damage: { formula: "8к6",  upcast: "2к6", save: "con", halfOnSave: true } },
  "Пляшущая молния": { damage: { formula: "10к8", save: "dex", halfOnSave: true } }, // апкаст = +1 цель, формула та же
  "Поражение":       { damage: { formula: "14к6", save: "con", halfOnSave: true } },

  // 7 уровень
  "Перст смерти":  { damage: { formula: "7к8+30", save: "con", halfOnSave: true } },
  "Огненная буря": { damage: { formula: "7к10",   save: "dex", halfOnSave: true } },

  // 9 уровень
  "Метеоритный дождь": { damage: { formula: "20к6+20к6", save: "dex", halfOnSave: true } }, // огонь + дробящий одного взрыва

  // ── Лечение и временные ХП (CAST-3) ─────────────────────────────────────────
  // Формулы сверены с desc/higherLevel spells.js обеих редакций; расхождения
  // PH24 (базовые кубы удвоены у «слов»/«Лечения ран», 5к8 у Множественного) —
  // через bySource. Плоские формулы без кубиков («70», «5») применяются без
  // броска (flatFormulaTotal ниже).
  "Лечение ран":     { heal: { formula: "1к8", upcast: "1к8", addSpellMod: true },
                       bySource: { PH24: { heal: { formula: "2к8", upcast: "2к8", addSpellMod: true } } } },
  "Лечащее слово":   { heal: { formula: "1к4", upcast: "1к4", addSpellMod: true },
                       bySource: { PH24: { heal: { formula: "2к4", upcast: "2к4", addSpellMod: true } } } },
  "Молебен лечения": { heal: { formula: "2к8", upcast: "1к8", addSpellMod: true } },
  "Множественное лечащее слово": { heal: { formula: "1к4", upcast: "1к4", addSpellMod: true },
                       bySource: { PH24: { heal: { formula: "2к4", upcast: "1к4", addSpellMod: true } } } },
  "Множественное лечение ран":   { heal: { formula: "3к8", upcast: "1к8", addSpellMod: true },
                       bySource: { PH24: { heal: { formula: "5к8", upcast: "1к8", addSpellMod: true } } } },
  "Полное исцеление": { heal: { formula: "70", upcast: "10" } },
  "Регенерация":      { heal: { formula: "4к8+15" } },
  "Псевдожизнь":     { tempHp: { formula: "1к4+4", upcast: "5" }, duration: { value: 1, unit: "hour" },
                       bySource: { PH24: { tempHp: { formula: "2к4+4", upcast: "5" } } } },
  "Доспех Агатиса":  { tempHp: { formula: "5", upcast: "5" }, duration: { value: 1, unit: "hour" } },
  "Подмога":         { hpMaxBonus: { base: 5, perUpcast: 5 }, duration: { value: 8, unit: "hour" } },

  // ── Призывы (потребитель _applyCastSummon, CAST-5) ──────────────────────────
  // Каст открывает модалку спутника, предзаполненную buildCompanionPrefill:
  // picker — пикер форм фамильяра, srdSlug — карточка SRD-бестиария (лениво,
  // ensureBestiary у вызывающего), prefill — статичные поля (поверх SRD),
  // byLevel — оверрайды по уровню ячейки. Призыв с duration получает
  // экземпляр-трекер {summon:true}: конец/смена концентрации — тост «существо
  // исчезает», сам спутник из списка НЕ удаляется (вычёркивает игрок).
  // PH24 переработал «Призыв …» в бестелесных духов/эманации без статблока
  // существа — там bySource обнуляет summon (мост молчит).
  "Поиск фамильяра": { summon: { companionType: "familiar", picker: "familiarForms" } },
  "Невидимый слуга": { summon: { companionType: "other", prefill: {
      name: "Невидимый слуга", hp: 1, ac: 10, attack: "",
      desc: "Незримая бесформенная сила (СИЛ 2). Выполняет простые задачи по команде: носит, чистит, подаёт. Не может атаковать. Исчезает при 0 ХП или через час." } },
    duration: { value: 1, unit: "hour" } },
  // PH14: статы боевого коня (MM); PH24: статблок «Потусторонний скакун» —
  // КД 10+N, ХП 5+10×N, урон 1к8+N от уровня ячейки N, полёт с ячейки 4+
  "Поиск скакуна": { summon: { companionType: "mount", prefill: {
      name: "Боевой конь", hp: 19, ac: 11, attack: "Копыта: +4, 5 фт. Попадание: 9 (2к6+2) дробящего",
      desc: "Дух в облике скакуна (боевой конь; можно выбрать пони, верблюда, лося или мастифа — статы в Бестиарии). Тип — небожитель, фея или исчадие на ваш выбор; телепатическая связь в 1 миле. Скорость 60 фт. При гибели исчезает — можно призвать вновь." } },
    bySource: { PH24: { summon: { companionType: "mount", prefill: {
        name: "Потусторонний скакун", hp: 25, ac: 12, attack: "Потусторонний удар: мод. атаки заклинаниями, 1к8+2 излучением/психической/некротической энергией",
        desc: "Большой небожитель, фея или исчадие (на ваш выбор). Скорость 60 фт. Делит вашу инициативу; телепатия с вами в 1 милю. Связь жизни: ваше лечение заклинанием 1+ уровня лечит и скакуна в 5 фт. Бонусное действие 1/отдых по типу: испуг (исчадие), телепорт 60 фт (фея), лечение 2к8+ур. (небожитель). Повторный каст заменяет скакуна." },
      byLevel: {
        3: { hp: 35, ac: 13, attack: "Потусторонний удар: мод. атаки заклинаниями, 1к8+3 излучением/психической/некротической энергией" },
        4: { hp: 45, ac: 14, attack: "Потусторонний удар: мод. атаки заклинаниями, 1к8+4 излучением/психической/некротической энергией",
             desc: "Большой небожитель, фея или исчадие (на ваш выбор). Скорость 60 фт, полёт 60 фт. Делит вашу инициативу; телепатия с вами в 1 милю. Связь жизни: ваше лечение заклинанием 1+ уровня лечит и скакуна в 5 фт. Бонусное действие 1/отдых по типу: испуг (исчадие), телепорт 60 фт (фея), лечение 2к8+ур. (небожитель). Повторный каст заменяет скакуна." },
        5: { hp: 55, ac: 15, attack: "Потусторонний удар: мод. атаки заклинаниями, 1к8+5 излучением/психической/некротической энергией",
             desc: "Большой небожитель, фея или исчадие (на ваш выбор). Скорость 60 фт, полёт 60 фт. Делит вашу инициативу; телепатия с вами в 1 милю. Связь жизни: ваше лечение заклинанием 1+ уровня лечит и скакуна в 5 фт. Бонусное действие 1/отдых по типу: испуг (исчадие), телепорт 60 фт (фея), лечение 2к8+ур. (небожитель). Повторный каст заменяет скакуна." }
      } } } } },
  "Призрачный скакун": { summon: { companionType: "mount", prefill: {
      name: "Призрачный скакун", hp: 13, ac: 10, attack: "",
      desc: "Полупрозрачный конеподобный скакун (статы ездовой лошади). Скорость 100 фт; труднопроходимая местность не замедляет. Исчезает при получении любого урона или по окончании часа." } },
    duration: { value: 1, unit: "hour" } },
  "Восставший труп": { summon: { companionType: "summoned", srdSlug: "skeleton" } },
  "Призыв животных":  { summon: { companionType: "beast", srdSlug: "wolf",
      prefill: { name: "Волк ×8" },
      byLevel: { 5: { name: "Волк ×16" }, 7: { name: "Волк ×24" }, 9: { name: "Волк ×32" } } },
    duration: { value: 1, unit: "hour" },
    bySource: { PH24: { summon: null } } },
  "Призыв лесных обитателей": { summon: { companionType: "summoned", srdSlug: "satyr",
      prefill: { name: "Сатир ×4" },
      byLevel: { 6: { name: "Сатир ×8" }, 8: { name: "Сатир ×12" } } },
    duration: { value: 1, unit: "hour" },
    bySource: { PH24: { summon: null } } },
  "Призыв малых элементалей": { summon: { companionType: "summoned", prefill: {
      name: "Малые элементали (ПО до 2)",
      desc: "Выберите элементалей суммарным ПО до 2: один ПО 2, два ПО 1, четыре ПО 1/2 или восемь ПО 1/4 — статблоки в Бестиарии. Дружественны и подчиняются командам." } },
    duration: { value: 1, unit: "hour" },
    bySource: { PH24: { summon: null } } },
  "Призыв элементаля": { summon: { companionType: "summoned", srdSlug: "air-elemental" },
    duration: { value: 1, unit: "hour" },
    bySource: { PH24: { summon: null } } },
  "Призыв феи": { summon: { companionType: "summoned", prefill: {
      name: "Фея (ПО до 6)",
      desc: "Выберите фею с ПО не выше 6 — статблок в Бестиарии. При потере концентрации призванная фея может стать враждебной." } },
    duration: { value: 1, unit: "hour" },
    bySource: { PH24: { summon: null } } },
  "Призыв небожителя": { summon: { companionType: "summoned", prefill: {
      name: "Небожитель (ПО до 4)",
      desc: "Выберите небожителя с ПО не выше 4 — статблок в Бестиарии. Дружественен вам и союзникам." },
      byLevel: { 9: { name: "Небожитель (ПО до 5)" } } },
    duration: { value: 1, unit: "hour" },
    bySource: { PH24: { summon: null } } }
};

// ── Хелперы (чистые, тестируются в headless БЛОК 34) ──────────────────────────

// Дескриптор по имени заклинания с учётом редакции (source: "PH14"/"PH24").
// bySource-оверрайд мержится поверх базовых полей, база не мутируется.
function getSpellEffect(name, source) {
  var base = SPELL_EFFECTS[name];
  if (!base) return null;
  var over = source && base.bySource ? base.bySource[source] : null;
  if (!over) return base;
  var merged = {};
  Object.keys(base).forEach(function(k) { if (k !== "bySource") merged[k] = base[k]; });
  Object.keys(over).forEach(function(k) { merged[k] = over[k]; });
  return merged;
}

// Формула с апкастом: +upcastPer за каждый уровень ячейки выше базового.
// scaleFormula("8к6","1к6",3,5) → "8к6+1к6+1к6". castLevel == null (заговор,
// без ячейки) или ≤ baseLevel → база без изменений.
function scaleFormula(base, upcastPer, baseLevel, castLevel) {
  var out = String(base || "");
  if (!upcastPer || !baseLevel || !castLevel || castLevel <= baseLevel) return out;
  var add = String(upcastPer);
  if (add[0] !== "+" && add[0] !== "-") add = "+" + add;
  for (var i = 0; i < castLevel - baseLevel; i++) out += add;
  return out;
}

// Длительность в раундах для тикающего трекера (CAST-2): раунд = 6 сек,
// 1 минута = 10 раундов. Час и дольше по-раундно не тикают (истекают на
// отдыхе или вручную) → null.
function durationToRounds(dur) {
  if (!dur || dur.value == null) return null;
  if (dur.unit === "round")  return dur.value;
  if (dur.unit === "minute") return dur.value * 10;
  return null;
}

// CAST-4: формула урона по типу заклинания. Заговор (есть cantripTiers) растёт
// по уровню ПЕРСОНАЖА — берётся старший достигнутый тир (5/11/17), ячейка не
// участвует (castLevel у заговора null — обязаны переживать). Уровневое —
// апкаст ячейкой через scaleFormula.
function damageFormulaFor(dmg, spellLevel, castLevel, charLevel) {
  if (!dmg || !dmg.formula) return "";
  if (dmg.cantripTiers) {
    var lvl = charLevel || 1, best = String(dmg.formula);
    Object.keys(dmg.cantripTiers)
      .map(function(k) { return parseInt(k, 10); })
      .sort(function(a, b) { return a - b; })
      .forEach(function(t) { if (lvl >= t) best = String(dmg.cantripTiers[t]); });
    return best;
  }
  return scaleFormula(dmg.formula, dmg.upcast, spellLevel, castLevel);
}

// CAST-3: сумма «плоской» формулы без кубиков — «70+10+10» → 90, «5» → 5.
// Формулы с кубиками (и любой мусор) → null: их бросает rollFormula.
// Нужна плоскому лечению/врем. ХП («Полное исцеление», «Доспех Агатиса»).
function flatFormulaTotal(formula) {
  var s = String(formula == null ? "" : formula).replace(/\s+/g, "");
  if (!s || !/^[0-9+\-]+$/.test(s)) return null;
  if (s[0] !== "+" && s[0] !== "-") s = "+" + s;
  var re = /([+-])(\d+)/g, m, idx = 0, total = 0;
  while ((m = re.exec(s)) !== null) {
    if (m.index !== idx) return null;
    idx = re.lastIndex;
    total += (m[1] === "-" ? -1 : 1) * parseInt(m[2], 10);
  }
  return idx === s.length ? total : null;
}

// CAST-5: префилл модалки спутника из дескриптора summon. Источники по
// порядку наложения: srdSlug (карточка SRD-бестиария — данные должны быть уже
// загружены, ленивую загрузку делает вызывающий) → статичный prefill (поверх
// SRD) → byLevel (оверрайд по уровню ячейки, берётся старший ключ ≤ castLevel;
// castLevel ниже младшего ключа — база без изменений). Возвращает
// {type, name?, hp?, ac?, attack?, desc?}; незаполненные поля оставляют
// дефолты модалки. Для picker-призывов не вызывается (свой путь).
function buildCompanionPrefill(summon, castLevel) {
  if (!summon) return null;
  var out = { type: summon.companionType || "summoned" };
  if (summon.srdSlug && typeof window !== "undefined" &&
      typeof window.srdMonsterBySlug === "function") {
    var m = window.srdMonsterBySlug(summon.srdSlug);
    if (m) {
      out.name = m.name;
      out.hp = m.hp;
      out.ac = m.ac;
      if (m.actions && m.actions.length) out.attack = m.actions[0].name + ": " + m.actions[0].desc;
      if (typeof window.srdMonsterToDesc === "function") out.desc = window.srdMonsterToDesc(m);
    }
  }
  if (summon.prefill) {
    Object.keys(summon.prefill).forEach(function(k) { out[k] = summon.prefill[k]; });
  }
  if (summon.byLevel && castLevel != null) {
    var best = null;
    Object.keys(summon.byLevel)
      .map(function(k) { return parseInt(k, 10); })
      .sort(function(a, b) { return a - b; })
      .forEach(function(lv) { if (castLevel >= lv) best = lv; });
    if (best != null) {
      var over = summon.byLevel[best];
      Object.keys(over).forEach(function(k) { out[k] = over[k]; });
    }
  }
  return out;
}

if (typeof window !== "undefined") {
  window.SPELL_EFFECTS = SPELL_EFFECTS;
  window.buildCompanionPrefill = buildCompanionPrefill;
  window.getSpellEffect = getSpellEffect;
  window.scaleFormula = scaleFormula;
  window.durationToRounds = durationToRounds;
  window.flatFormulaTotal = flatFormulaTotal;
  window.damageFormulaFor = damageFormulaFor;
}
