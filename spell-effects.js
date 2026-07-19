// ============================================================
// spell-effects.js — механика применения заклинаний (план CAST)
// Кураторская таблица «имя заклинания → дескриптор» + чистые хелперы.
// Ключ — точное name из spells.js: дубли PH14/PH24 покрываются одним
// ключом, редкие расхождения редакций — через bySource.
//
// Схема дескриптора (все поля опциональны):
//   effects:  ["effect_id", ...] — id карточек EFFECTS_DATA (data.js);
//             при касте вешаются в char.effects (CAST-1)
//   damage:   { formula:"8к6", upcast:"1к6", upcastEvery:2 — апкаст за КАЖДЫЕ
//               N уровней ячейки (по умолчанию 1), save:"dex"|"con"|"wis"|...,
//               halfOnSave:true, cantripTiers:{5:"2к10",11:"3к10",17:"4к10"},
//               attack:true — каст сначала кидает d20 + бонус атаки заклинаний
//               (CAST-7: нат. 1 — промах без урона, нат. 20 — кубы урона ×2),
//               addSpellMod:true — + мод. заклинательной характеристики к урону,
//               volley:true — мультилучевое: один бросок атаки на весь залп }
//   repeat:   { ...та же схема, что damage, + hint:"когда повторяется",
//               icon:"⚔️", label:"по попаданию" }
//             — CAST-9a: заклинание бьёт КАЖДЫЙ раунд (бонусным действием или
//             зоной). Каст создаёт экземпляр-трекер {repeat:true, repeatFormula},
//             повторный бросок игрок делает кнопкой в шапке трекера боя
//             (полоса повторов, app-party.js). Формула считается тем же
//             damageFormulaFor — схема полей совпадает с damage.
//             CAST-11: у «кар» (Гневная/Громовая/Палящая…) и залповых урон
//             срабатывает НЕ повтором, а на первом попадании оружием — icon и
//             label переопределяют «🔁 …· повтор» на «⚔️ …· по попаданию».
//             ВАЖНО: ветка repeat требует duration — без неё экземпляр-трекер
//             не создаётся (_ensureCastInstance) и кнопки не будет
//   debuff:   { id:"bane", name:"Порча", icon:"💀", color:"#8e44ad",
//               save:"cha", attack:true, hint:"что делает с целью",
//               targets:3, targetsUpcast:1 — +N целей за уровень ячейки выше
//               базового } — CAST-10: эффект вешается НЕ на себя, а на УЧАСТНИКА
//             трекера боя (чип в его строке, p.debuffs в BATTLE_DATA). Каст
//             открывает пикер целей (offerCastDebuffToBattle, app-party.js);
//             снятие — по концентрации/раундам вместе с экземпляром каста или
//             вручную кликом по чипу. Вне боя ветка молчит (как урон в CAST-4)
//   heal:     { formula:"1к8", upcast:"1к8", addSpellMod:true }
//   tempHp:   { formula:"1к4+4", upcast:"5" } — врем. ХП (не стакаются, берём max)
//   hpMaxBonus: { base:5, perUpcast:5 } — «Подмога»: +hpMax и +hpCurrent
//   summon:   { companionType:"familiar"|"mount"|"summoned"|"beast"|"other",
//               picker:"familiarForms" | srdSlug:"air-elemental" | prefill:{name,hp,ac,attack,desc},
//               byLevel:{ 5:{...} } — оверрайды полей префилла по уровню
//               ячейки (берётся старший ключ ≤ уровня каста) }
//   duration: { value:8, unit:"round"|"minute"|"hour"|"day"|"untilLongRest"|"instant"|"special" }
//   variants: { label:"Тип урона", options:[{id:"fire", name:"Огонь", hint:"…"}] }
//             — CAST-8a: заклинание с выбором при накладывании. Мини-чузер
//             открывается ПОСЛЕ выбора ячейки (ячейка уже потрачена, отмена
//             = применить без варианта); выбор пишется в экземпляр
//             (inst.variantId/variantName) и виден в бейдже карточки,
//             сетке эффектов и подписи броска урона. name — КОРОТКОЕ (бейдж
//             карточки не переносится, white-space:nowrap), механику варианта
//             несёт необязательный hint (виден только в чузере)
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
  "Огонь фей":                 { effects: ["faerie_fire"],        duration: { value: 1,  unit: "minute" },
                                 debuff: { id: "faerie_fire", name: "Огонь фей", icon: "🌟", color: "#2980b9",
                                   save: "dex", targets: 6,
                                   hint: "Атаки по цели с преимуществом, невидимость не помогает (куб 20 фт)" } },
  "Защита от добра и зла":     { effects: ["protection_evil"],    duration: { value: 10, unit: "minute" } },
  "Бесследное передвижение":   { effects: ["pass_without_trace"], duration: { value: 1,  unit: "hour" } },
  "Отражения":                 { effects: ["mirror_image"],       duration: { value: 1,  unit: "minute" } },
  "Метка охотника":            { effects: ["hunters_mark"],       duration: { value: 1,  unit: "hour" },
                                 debuff: { id: "hunters_mark", name: "Метка", icon: "🏹", color: "#16a085",
                                   hint: "+1к6 урона от ваших атак по цели; при её смерти метку переносят бонусным действием" } },
  "Божественное благоволение": { effects: ["divine_favor"],       duration: { value: 1,  unit: "minute" } },
  "Сглаз":                     { effects: ["hex"],                duration: { value: 1,  unit: "hour" },
                                 debuff: { id: "hex", name: "Сглаз", icon: "👁️", color: "#9b59b6",
                                   hint: "+1к6 некротического от ваших атак; помеха на проверки выбранной характеристики" } },
  // CAST-8a: варианты — формулировки сверены с desc карточек EFFECTS_DATA
  "Проклятие":                 { effects: ["bestow_curse"],       duration: { value: 1,  unit: "minute" },
                                 variants: { label: "Эффект проклятия", options: [
                                   { id: "save",   name: "Помеха на хар-ку", hint: "Помеха на броски выбранной характеристики" },
                                   { id: "attack", name: "Помеха на атаки",  hint: "Цель с помехой атакует вас" },
                                   { id: "action", name: "Трата действия",   hint: "В начале хода спасбросок МУД, иначе действие потеряно" },
                                   { id: "damage", name: "+1к8 некроза",     hint: "Ваши атаки по цели наносят +1к8 некротического" } ] },
                                 debuff: { id: "bestow_curse", name: "Проклятие", icon: "🩸", color: "#a93226",
                                   save: "wis", hint: "Выбранное проклятие держится, пока идёт концентрация" } },
  "Порча":                     { effects: ["bane"],               duration: { value: 1,  unit: "minute" },
                                 debuff: { id: "bane", name: "Порча", icon: "💀", color: "#8e44ad",
                                   save: "cha", targets: 3, targetsUpcast: 1,
                                   hint: "Цель вычитает 1к4 из бросков атаки и спасбросков" } },
  "Замедление":                { effects: ["slow"],               duration: { value: 1,  unit: "minute" },
                                 debuff: { id: "slow", name: "Замедление", icon: "🐢", color: "#117864",
                                   save: "wis", targets: 6,
                                   hint: "Скорость вдвое, −2 к КД и спасброскам ЛОВ, одно действие в ход; спасбросок в конце хода" } },
  // Добивка CAST-6. Ловушка перевода: Spider Climb = заклинание «Паук»
  // (карточка «Паучье лазание»). Длительности совпадают в обеих редакциях;
  // расхождение «Дубовой коры» (PH24 без концентрации) снимается само —
  // флаг concentration берётся из duration-текста записи spells.js.
  "Щит веры":                  { effects: ["shield_of_faith"],    duration: { value: 10, unit: "minute" } },
  "Невидимость":               { effects: ["invisibility"],       duration: { value: 1,  unit: "hour" } },
  "Высшая невидимость":        { effects: ["greater_invisibility"], duration: { value: 1, unit: "minute" } },
  "Полёт":                     { effects: ["fly_spell"],          duration: { value: 10, unit: "minute" } },
  "Каменная кожа":             { effects: ["stoneskin"],          duration: { value: 1,  unit: "hour" } },
  "Защита от энергии":         { effects: ["protection_energy"],  duration: { value: 1,  unit: "hour" },
                                 variants: { label: "Тип урона", options: [
                                   { id: "acid",      name: "Кислота" },
                                   { id: "cold",      name: "Холод" },
                                   { id: "fire",      name: "Огонь" },
                                   { id: "lightning", name: "Молния" },
                                   { id: "thunder",   name: "Гром" } ] } },
  "Дубовая кора":              { effects: ["barkskin"],           duration: { value: 1,  unit: "hour" } },
  "Свобода перемещения":       { effects: ["freedom_movement"],   duration: { value: 1,  unit: "hour" } },
  "Защита от смерти":          { effects: ["death_ward"],         duration: { value: 8,  unit: "hour" } },
  "Огненный щит":              { effects: ["fire_shield"],        duration: { value: 10, unit: "minute" },
                                 variants: { label: "Облик щита", options: [
                                   { id: "warm", name: "Тёплый",   hint: "Сопротивление холоду, атакующий в ближнем бою получает 2к8 огнём" },
                                   { id: "cold", name: "Холодный", hint: "Сопротивление огню, атакующий в ближнем бою получает 2к8 холодом" } ] } },
  "Паук":                      { effects: ["spider_climb"],       duration: { value: 1,  unit: "hour" } },
  "Тёмное зрение":             { effects: ["darkvision_spell"],   duration: { value: 8,  unit: "hour" } },
  "Видение невидимого":        { effects: ["see_invisibility"],   duration: { value: 1,  unit: "hour" } },
  "Скороход":                  { effects: ["longstrider"],        duration: { value: 1,  unit: "hour" } },
  "Поспешное отступление":     { effects: ["expeditious_retreat"], duration: { value: 10, unit: "minute" } },
  "Защита от яда":             { effects: ["protection_poison"],  duration: { value: 1,  unit: "hour" } },
  "Подводное дыхание":         { effects: ["water_breathing"],    duration: { value: 24, unit: "hour" } },
  "Хождение по воде":          { effects: ["water_walk"],         duration: { value: 1,  unit: "hour" } },
  "Газообразная форма":        { effects: ["gaseous_form"],       duration: { value: 1,  unit: "hour" } },
  "Увеличение/уменьшение":     { effects: ["enlarge_reduce"],     duration: { value: 1,  unit: "minute" },
                                 variants: { label: "Режим", options: [
                                   { id: "enlarge", name: "Увеличение", hint: "+1к4 к урону оружием, преимущество на проверки и спасброски СИЛ" },
                                   { id: "reduce",  name: "Уменьшение", hint: "−1к4 к урону оружием, помеха на проверки и спасброски СИЛ" } ] } },

  // ── Чистые дебаффы на цель (CAST-10) ────────────────────────────────────────
  // Заклинания, у которых на СЕБЯ вешать нечего: весь эффект живёт на участнике
  // боя (чип в строке трекера). Карточки EFFECTS_DATA у них нет — ветка effects
  // отсутствует, экземпляр-трекер создаёт сам _applyCastDebuff по duration.
  // Ловушка перевода: Blindness/Deafness = «Глухота/слепота» (глухота ПЕРВАЯ!),
  // Hold Person = «Удержание личности», Ray of Enfeeblement = «Луч слабости»
  // (в PH24 сохранился, статы те же).
  "Луч слабости": { debuff: { id: "ray_enfeeblement", name: "Слабость", icon: "🦴", color: "#6c7a89",
                      attack: true,
                      hint: "Рукопашные атаки цели с СИЛ наносят половину урона; спасбросок ТЕЛ в конце её хода" },
                    duration: { value: 1, unit: "minute" } },
  // Выбор «ослепить или оглушить» — вариант каста (CAST-8a): имя варианта
  // уходит в чип вместо name дескриптора
  "Глухота/слепота": { debuff: { id: "blind_deaf", name: "Слепота", icon: "🙈", color: "#c0611b",
                         save: "con", targets: 1, targetsUpcast: 1,
                         hint: "Цель слепа или глуха; спасбросок ТЕЛ в конце каждого её хода" },
                       variants: { label: "Что накладываем", options: [
                         { id: "blind", name: "Слепота", hint: "Цель ослеплена: атаки по ней с преимуществом, её атаки с помехой" },
                         { id: "deaf",  name: "Глухота", hint: "Цель оглохла: не слышит и проваливает проверки на слух" } ] },
                       duration: { value: 1, unit: "minute" } },
  "Удержание личности": { debuff: { id: "hold_person", name: "Паралич", icon: "🧊", color: "#2471a3",
                            save: "wis", targets: 1, targetsUpcast: 1,
                            hint: "Гуманоид парализован (атаки в упор — крит); спасбросок МУД в конце каждого его хода" },
                          duration: { value: 1, unit: "minute" } },
  // Добивка CAST-11
  "Паутина":  { debuff: { id: "web", name: "Паутина", icon: "🕸️", color: "#7f8c8d",
                  save: "dex", targets: 6,
                  hint: "Цель схвачена; действием проходит проверку СИЛ, чтобы вырваться. Зона труднопроходима, вспыхивает на 2к4 огня" },
                duration: { value: 1, unit: "hour" } },
  "Смятение": { debuff: { id: "confusion", name: "Смятение", icon: "🌀", color: "#af7ac5",
                  save: "wis", targets: 6,
                  hint: "В начале хода бросок к10: случайное движение, бездействие или атака случайной цели; спасбросок в конце каждого хода" },
                duration: { value: 1, unit: "minute" } },
  // Иллюзия сама бьёт каждый ход — чип на цели плюс кнопка повтора
  "Воображаемая сила": { debuff: { id: "phantasmal_force", name: "Иллюзия", icon: "👻", color: "#8e6fb5",
                           save: "int",
                           hint: "Цель считает иллюзию реальной и получает 1к6 психического в начале каждого своего хода" },
                         repeat: { formula: "1к6", hint: "начало хода цели, поверившей в иллюзию" },
                         duration: { value: 1, unit: "minute" } },
  // Редакции разошлись механикой отбора целей: PH14 — пул хитов без испытания,
  // PH24 — испытание МУД. Дескриптор PH14 идёт через bySource без save
  "Усыпление": { debuff: { id: "sleep", name: "Сон", icon: "💤", color: "#5b6fa8",
                   save: "wis", targets: 6,
                   hint: "Провал — недееспособна, повторный провал — засыпает. Урон будит; спасбросок в конце своих ходов" },
                 duration: { value: 1, unit: "minute" },
                 bySource: { PH14: { debuff: { id: "sleep", name: "Сон", icon: "💤", color: "#5b6fa8", targets: 6,
                   hint: "Пул 5к8 хитов (+2к8 за уровень ячейки выше 1-го): засыпают существа с наименьшими текущими хитами, без испытания" } } } },
  // PH14 — рукопашная атака заклинанием и отравление без урона; PH24 добавил
  // 11к8 по испытанию ТЕЛ (bySource заменяет ветки ЦЕЛИКОМ — debuff повторён)
  "Заражение": { debuff: { id: "contagion", name: "Отравление", icon: "🦠", color: "#5f8a3f",
                   attack: true,
                   hint: "Цель отравлена; в конце каждого своего хода спасбросок ТЕЛ — три успеха снимают, три провала дают болезнь на 7 дней" },
                 duration: { value: 7, unit: "day" },
                 bySource: { PH24: {
                   damage: { formula: "11к8", save: "con" },
                   debuff: { id: "contagion", name: "Отравление", icon: "🦠", color: "#5f8a3f",
                     save: "con",
                     hint: "Провал — 11к8 некротического и отравление, помеха на испытания выбранной характеристики; три успеха снимают, три провала закрепляют на 7 дней" } } } },

  // ── Урон (потребитель _applyCastDamage, CAST-4) ─────────────────────────────
  // Формулы сверены с desc/higherLevel spells.js обеих редакций; расхождения
  // PH24 — через bySource. Заговоры растут по уровню ПЕРСОНАЖА (cantripTiers
  // 5/11/17, damageFormulaFor), ячейка не участвует. save — характеристика
  // спасброска ЦЕЛИ (тост с СЛ заклинателя); halfOnSave — половина урона при
  // успехе, без флага успех отменяет урон целиком. attack (CAST-7) — сначала
  // d20 + бонус атаки заклинаний; сверено с desc spells.js: «Ядовитые брызги»
  // атака только в PH24 (bySource-оверрайд заменяет damage ЦЕЛИКОМ — флаг
  // повторяется в оверрайдах). Мультилучевые («Мистический заряд», «Палящий
  // луч») бросаются суммой всех лучей одним броском — volley: один бросок
  // атаки на весь залп (упрощение, фиксируется тостом).

  // Заговоры
  "Огненный снаряд":   { damage: { formula: "1к10", cantripTiers: { 5: "2к10", 11: "3к10", 17: "4к10" }, attack: true } },
  "Луч холода":        { damage: { formula: "1к8",  cantripTiers: { 5: "2к8",  11: "3к8",  17: "4к8" }, attack: true } },
  "Электрошок":        { damage: { formula: "1к8",  cantripTiers: { 5: "2к8",  11: "3к8",  17: "4к8" }, attack: true } },
  "Мистический заряд": { damage: { formula: "1к10", cantripTiers: { 5: "2к10", 11: "3к10", 17: "4к10" }, attack: true, volley: true } },
  "Священное пламя":   { damage: { formula: "1к8",  cantripTiers: { 5: "2к8",  11: "3к8",  17: "4к8" }, save: "dex" } },
  // PH24: стало атакой вместо испытания ТЕЛ (кубы те же)
  "Ядовитые брызги":   { damage: { formula: "1к12", cantripTiers: { 5: "2к12", 11: "3к12", 17: "4к12" }, save: "con" },
                         bySource: { PH24: { damage: { formula: "1к12", cantripTiers: { 5: "2к12", 11: "3к12", 17: "4к12" }, attack: true } } } },
  "Злая насмешка":     { damage: { formula: "1к4",  cantripTiers: { 5: "2к4",  11: "3к4",  17: "4к4" }, save: "wis" },
                         bySource: { PH24: { damage: { formula: "1к6", cantripTiers: { 5: "2к6", 11: "3к6", 17: "4к6" }, save: "wis" } } } },
  "Леденящее прикосновение": { damage: { formula: "1к8", cantripTiers: { 5: "2к8", 11: "3к8", 17: "4к8" }, attack: true },
                         bySource: { PH24: { damage: { formula: "1к10", cantripTiers: { 5: "2к10", 11: "3к10", 17: "4к10" }, attack: true } } } },
  // Добивка CAST-8b
  "Брызги кислоты":    { damage: { formula: "1к6",  cantripTiers: { 5: "2к6",  11: "3к6",  17: "4к6" }, save: "dex" } },
  "Терновый кнут":     { damage: { formula: "1к6",  cantripTiers: { 5: "2к6",  11: "3к6",  17: "4к6" }, attack: true } },
  "Сотворение пламени": { damage: { formula: "1к8", cantripTiers: { 5: "2к8",  11: "3к8",  17: "4к8" }, attack: true } },
  // Добивка CAST-11 — оба заговора только в PH24 (в таблице одним ключом:
  // записи PH14 нет, bySource не нужен). У «Чародейского взрыва» выпавшая 8
  // добавляет ещё к8 (до мод. заклинательной хар-ки раз) — формулой не
  // выражается, игрок докидывает вручную.
  "Звёздная искра":    { damage: { formula: "1к8", cantripTiers: { 5: "2к8", 11: "3к8", 17: "4к8" }, attack: true } },
  "Чародейский взрыв": { damage: { formula: "1к8", cantripTiers: { 5: "2к8", 11: "3к8", 17: "4к8" }, attack: true },
                         variants: { label: "Тип урона", options: [
                           { id: "acid",      name: "Кислота" },
                           { id: "cold",      name: "Холод" },
                           { id: "fire",      name: "Огонь" },
                           { id: "lightning", name: "Молния" },
                           { id: "poison",    name: "Яд" },
                           { id: "psychic",   name: "Психика" },
                           { id: "thunder",   name: "Гром" } ] } },

  // 1 уровень
  "Волшебная стрела":    { damage: { formula: "3к4+3", upcast: "1к4+1" } },
  "Огненные ладони":     { damage: { formula: "3к6",  upcast: "1к6",  save: "dex", halfOnSave: true } },
  "Волна грома":         { damage: { formula: "2к8",  upcast: "1к8",  save: "con", halfOnSave: true } },
  "Направленный снаряд": { damage: { formula: "4к6",  upcast: "1к6" } },
  "Луч болезни":         { damage: { formula: "2к8",  upcast: "1к8", attack: true } },
  "Нанесение ран":       { damage: { formula: "3к10", upcast: "1к10", attack: true },
                           bySource: { PH24: { damage: { formula: "2к10", upcast: "1к10", attack: true } } } },
  "Адское возмездие":    { damage: { formula: "2к10", upcast: "1к10", save: "dex", halfOnSave: true } },
  "Диссонирующий шёпот": { damage: { formula: "3к6",  upcast: "1к6",  save: "wis", halfOnSave: true } },
  // CAST-9a: начальное попадание — атака; повтор бонусным действием бьёт
  // автоматически (без броска атаки) и НЕ растёт от ячейки — «повторный
  // остаётся 1к12» в higherLevel обеих редакций
  "Ведьмин снаряд":      { damage: { formula: "1к12", upcast: "1к12", attack: true },
                           repeat: { formula: "1к12", hint: "бонусное действие, автоматически" },
                           duration: { value: 1, unit: "minute" },
                           bySource: { PH24: { damage: { formula: "2к12", upcast: "1к12", attack: true } } } },
  // CAST-8: тип урона выбирается при накладывании — вариант уходит в подпись броска
  "Цветной шарик":       { damage: { formula: "3к8", upcast: "1к8", attack: true },
                           variants: { label: "Тип урона", options: [
                             { id: "acid",      name: "Кислота" },
                             { id: "cold",      name: "Холод" },
                             { id: "fire",      name: "Огонь" },
                             { id: "lightning", name: "Молния" },
                             { id: "poison",    name: "Яд" },
                             { id: "thunder",   name: "Гром" } ] } },
  "Руки Хадара":         { damage: { formula: "2к6", upcast: "1к6", save: "str", halfOnSave: true } },
  // CAST-11. Тип урона «Хаотичного снаряда» определяет выпавший к8 (таблица в
  // desc), поэтому вариантов каста нет — игрок читает кубы в арене.
  "Хаотичный снаряд":    { damage: { formula: "2к8+1к6", upcast: "1к6", attack: true } },

  // 2 уровень
  "Палящий луч":     { damage: { formula: "6к6",  upcast: "2к6", attack: true, volley: true } }, // 3 луча по 2к6, апкаст = +1 луч
  "Дребезги":        { damage: { formula: "3к8",  upcast: "1к8",  save: "con", halfOnSave: true } },
  "Лунный луч":      { damage: { formula: "2к10", upcast: "1к10", save: "con", halfOnSave: true } },
  "Облако кинжалов": { damage: { formula: "4к4",  upcast: "2к4" } },
  // Добивка CAST-8b; CAST-9a добавил повторный тик бонусным действием
  "Раскалённый металл": { damage: { formula: "2к8", upcast: "1к8" },
                          repeat: { formula: "2к8", upcast: "1к8", hint: "бонусное действие, повторный нагрев" },
                          duration: { value: 1, unit: "minute" } },
  "Пылающий шар":       { damage: { formula: "2к6", upcast: "1к6", save: "dex", halfOnSave: true },
                          repeat: { formula: "2к6", upcast: "1к6", save: "dex", halfOnSave: true,
                                    hint: "бонусное действие: двинуть сферу в существо" },
                          duration: { value: 1, unit: "minute" } },
  // CAST-9a: 4к4 сразу + 2к4 в конце следующего хода цели — раньше сросшимся
  // «4к4+2к4» одним броском, теперь второй тик отдельной кнопкой повтора
  "Мельфова кислотная стрела": { damage: { formula: "4к4", upcast: "1к4", attack: true },
                          repeat: { formula: "2к4", upcast: "1к4", hint: "конец следующего хода цели" },
                          duration: { value: 1, unit: "round" } },
  // CAST-9a. Ловушка перевода: Spiritual Weapon = «Божественное оружие»
  // (не «Духовное»!). Апкаст за КАЖДЫЕ ДВА уровня выше 2-го (upcastEvery),
  // урон включает мод. заклинательной характеристики (addSpellMod).
  // PH14 без концентрации, PH24 с ней — берётся из duration-текста spells.js.
  "Божественное оружие": { damage: { formula: "1к8", upcast: "1к8", upcastEvery: 2, attack: true, addSpellMod: true },
                          repeat: { formula: "1к8", upcast: "1к8", upcastEvery: 2, attack: true, addSpellMod: true,
                                    hint: "бонусное действие: переместить и атаковать" },
                          duration: { value: 1, unit: "minute" } },
  // CAST-11: клинок-конструкт — каст сразу даёт атаку, дальше атака каждый ход.
  // «Горящий клинок» растёт за КАЖДЫЕ ДВА уровня выше 2-го (upcastEvery): 4-й
  // круг — 4к6, 6-й — 5к6, 8-й — 6к6.
  "Горящий клинок": { damage: { formula: "3к6", upcast: "1к6", upcastEvery: 2, attack: true },
                      repeat: { formula: "3к6", upcast: "1к6", upcastEvery: 2, attack: true,
                                hint: "действие: новая рукопашная атака заклинанием огненным клинком" },
                      duration: { value: 10, unit: "minute" } },
  // «Теневой клинок» (PH24) — рост по ячейке СДВИНУТ на уровень (3–4: 3к8,
  // 5–6: 4к8, 7+: 5к8), шаг upcastEvery от базового 2-го круга так не ложится:
  // ячейка 3 дала бы floor(1/2)=0. Ставим базовые кубы, апкаст игрок держит сам.
  "Теневой клинок": { damage: { formula: "2к8", attack: true },
                      repeat: { formula: "2к8", attack: true,
                                hint: "атака теневым клинком (преимущество, если цель в тусклом свете или тьме)" },
                      duration: { value: 1, unit: "minute" } },

  // 3 уровень
  "Огненный шар":          { damage: { formula: "8к6",  upcast: "1к6",  save: "dex", halfOnSave: true } },
  "Молния":                { damage: { formula: "8к6",  upcast: "1к6",  save: "dex", halfOnSave: true } },
  "Призыв молнии":         { damage: { formula: "3к10", upcast: "1к10", save: "dex", halfOnSave: true } }, // 4к10 под открытым небом — не моделируем
  "Прикосновение вампира": { damage: { formula: "3к6",  upcast: "1к6", attack: true } },
  // Урон зоны при входе/начале хода — бросаем на одну цель за раз (CAST-8b).
  // CAST-9a: зона живёт раундами — повтор кнопкой на каждое существо в ней
  "Духовные стражи": { damage: { formula: "3к8", upcast: "1к8", save: "wis", halfOnSave: true },
                       repeat: { formula: "3к8", upcast: "1к8", save: "wis", halfOnSave: true,
                                 hint: "вход в зону или начало хода в ней" },
                       duration: { value: 10, unit: "minute" } },
  // CAST-11
  "Призыв заграждения": { damage: { formula: "3к8", upcast: "1к8", save: "dex", halfOnSave: true } },
  // Взрыв руны при активации; сохранённое внутрь заклинание — вручную
  "Охранные руны":      { damage: { formula: "5к8", save: "dex", halfOnSave: true } },

  // 4 уровень
  "Град":     { damage: { formula: "2к8+4к6", upcast: "1к8", save: "dex", halfOnSave: true } },
  "Усыхание": { damage: { formula: "8к8",     upcast: "1к8", save: "con", halfOnSave: true } },
  // CAST-11: провалившие испытание получают вдогонку 5к4 в конце своего
  // следующего хода — второй тик отдельной кнопкой (как у Мельфовой стрелы)
  "Кислотная сфера": { damage: { formula: "10к4", upcast: "2к4", save: "dex", halfOnSave: true },
                       repeat: { formula: "5к4", hint: "конец следующего хода цели, провалившей испытание" },
                       duration: { value: 1, unit: "round" } },
  "Огненная стена":      { damage: { formula: "5к8",  upcast: "1к8",  save: "dex", halfOnSave: true },
                           repeat: { formula: "5к8", upcast: "1к8", save: "dex", halfOnSave: true,
                                     hint: "вход в стену или начало хода у горячей стороны" },
                           duration: { value: 1, unit: "minute" } },
  "Воображаемый убийца": { damage: { formula: "4к10", upcast: "1к10", save: "wis", halfOnSave: true } },

  // 5 уровень
  "Конус холода": { damage: { formula: "8к8", upcast: "1к8", save: "con", halfOnSave: true } },
  // Апкаст «Небесного огня» усиливает огонь ИЛИ излучение на выбор — один куб за уровень
  "Небесный огонь": { damage: { formula: "4к6+4к6", upcast: "1к6", save: "dex", halfOnSave: true } },
  "Облако смерти":  { damage: { formula: "5к8",     upcast: "1к8", save: "con", halfOnSave: true },
                      repeat: { formula: "5к8", upcast: "1к8", save: "con", halfOnSave: true,
                                hint: "начало хода существа в облаке" },
                      duration: { value: 10, unit: "minute" } },
  // CAST-11
  "Призыв залпа":          { damage: { formula: "8к8", save: "dex", halfOnSave: true } },
  // 5к6 гром + 5к6 излучение/некроз одним взрывом (выбор типа — на игроке)
  "Разрушительная волна":  { damage: { formula: "5к6+5к6", save: "con", halfOnSave: true } },
  // «Длань Бигби»: моделируем Сжатый кулак (единственный режим с уроном);
  // ГОЧА bySource — оверрайд заменяет ветку ЦЕЛИКОМ, damage и repeat
  // приходится повторять оба (PH24 усилил кулак 4к8 → 5к8)
  "Длань Бигби": { damage: { formula: "4к8", upcast: "2к8", attack: true },
                   repeat: { formula: "4к8", upcast: "2к8", attack: true,
                             hint: "бонусное действие: Сжатый кулак — рукопашная атака заклинанием" },
                   duration: { value: 1, unit: "minute" },
                   bySource: { PH24: {
                     damage: { formula: "5к8", upcast: "2к8", attack: true },
                     repeat: { formula: "5к8", upcast: "2к8", attack: true,
                               hint: "бонусное действие: Сжатый кулак — рукопашная атака заклинанием" } } } },

  // 6 уровень
  "Круг смерти":     { damage: { formula: "8к6",  upcast: "2к6", save: "con", halfOnSave: true } },
  // Успешное испытание отменяет урон целиком — halfOnSave нет
  "Распад":          { damage: { formula: "10к6+40", upcast: "3к6+10", save: "dex" } },
  "Солнечный луч":   { damage: { formula: "6к8",  save: "con", halfOnSave: true } }, // 6 круг, апкаста нет
  "Пляшущая молния": { damage: { formula: "10к8", save: "dex", halfOnSave: true } }, // апкаст = +1 цель, формула та же
  "Поражение":       { damage: { formula: "14к6", save: "con", halfOnSave: true } },
  // CAST-11
  "Отилюков ледяной шар": { damage: { formula: "10к6", upcast: "1к6", save: "con", halfOnSave: true } },
  // Урон только тем, в чьём пространстве вырастает стена; дальше она просто стоит
  "Ледяная стена":        { damage: { formula: "10к6", upcast: "2к6", save: "dex", halfOnSave: true },
                            duration: { value: 10, unit: "minute" } },

  // 7 уровень
  "Перст смерти":  { damage: { formula: "7к8+30", save: "con", halfOnSave: true } },
  "Огненная буря": { damage: { formula: "7к10",   save: "dex", halfOnSave: true } },
  // CAST-11. Цвет луча каждой цели определяет к8 (таблица в desc) — вариантов
  // каста нет: 10к6 верны для лучей 1–5, лучи 6–8 урона не наносят вовсе
  "Радужные брызги": { damage: { formula: "10к6", save: "dex", halfOnSave: true } },
  // Парящий меч-конструкт: каст даёт атаку, дальше атака бонусным действием
  "Меч Морденкайнена": { damage: { formula: "3к10", attack: true },
                         repeat: { formula: "3к10", attack: true,
                                   hint: "бонусное действие: переместить меч и атаковать" },
                         duration: { value: 1, unit: "minute" } },
  "Дуговой клинок": { damage: { formula: "4к12", attack: true, addSpellMod: true },
                      repeat: { formula: "4к12", attack: true, addSpellMod: true,
                                hint: "бонусное действие: переместить меч на 30 фт и атаковать" },
                      duration: { value: 1, unit: "minute" } },

  // 8 уровень (CAST-11)
  "Солнечный ожог": { damage: { formula: "12к6", save: "con", halfOnSave: true } },
  "Цунами":         { damage: { formula: "6к10", save: "str", halfOnSave: true },
                      duration: { value: 6, unit: "round" } },
  // PH24 переработал в «Помутнение разума» с уроном; в PH14 урона нет — там
  // работает только чип дебаффа (см. секцию дебаффов)
  "Слабоумие": { debuff: { id: "feeblemind", name: "Слабоумие", icon: "🫥", color: "#5d6d7e",
                   save: "int",
                   hint: "PH14: ИНТ и ХАР цели становятся 1, она не колдует и не говорит внятно. PH24: не может колдовать и совершать действие Магия" },
                 duration: { value: 1, unit: "hour" },
                 bySource: { PH24: { damage: { formula: "10к12", save: "int" } } } },

  // 9 уровень
  "Метеоритный дождь": { damage: { formula: "20к6+20к6", save: "dex", halfOnSave: true } }, // огонь + дробящий одного взрыва
  // CAST-11: в PH14 «Слово Силы: смерть» урона не наносит вовсе (мгновенная
  // смерть при ХП ≤100), в PH24 добавили 12к12 по целям с ХП больше 100
  "Слово Силы: смерть": { bySource: { PH24: { damage: { formula: "12к12" } } } },

  // ── Кары и райдеры оружия (CAST-11) ─────────────────────────────────────────
  // «Кара» (smite) и её родня бьют НЕ в момент каста, а на ближайшем попадании
  // оружием — поэтому ветки damage у них нет вовсе: каст только заводит
  // экземпляр-трекер, а урон игрок кидает кнопкой в полосе трекера боя, когда
  // реально попал. Слова кнопки и подписи броска переопределены (icon/label):
  // «⚔️ Гневная кара · по попаданию» вместо «🔁 … · повтор».
  // Упрощение: кнопка живёт до конца длительности, хотя по правилам кара
  // тратится первым же попаданием — лишний тик снимает сам игрок (конец
  // концентрации) или истечение раундов.
  "Гневная кара":     { repeat: { formula: "1к6", upcast: "1к6", icon: "⚔️", label: "по попаданию",
                          hint: "следующее попадание: +1к6 психического (PH24 — некротического); испытание МУД или цель испугана" },
                        duration: { value: 1, unit: "minute" } },
  "Громовая кара":    { repeat: { formula: "2к6", upcast: "1к6", icon: "⚔️", label: "по попаданию",
                          hint: "следующее попадание: +2к6 звуком; испытание СИЛ или отбрасывание на 10 фт и ничком" },
                        duration: { value: 1, unit: "minute" } },
  "Палящая кара":     { repeat: { formula: "1к6", upcast: "1к6", icon: "⚔️", label: "по попаданию",
                          hint: "следующее попадание: +1к6 огнём, цель горит — ещё 1к6 в начале каждого её хода" },
                        duration: { value: 1, unit: "minute" } },
  "Клеймящая кара":   { repeat: { formula: "2к6", upcast: "1к6", icon: "⚔️", label: "по попаданию",
                          hint: "следующее попадание: +2к6 излучением; цель светится и не может стать невидимой" },
                        duration: { value: 1, unit: "minute" } },
  "Ослепляющая кара": { repeat: { formula: "3к8", upcast: "1к8", icon: "⚔️", label: "по попаданию",
                          hint: "следующее попадание: +3к8 излучением; испытание ТЕЛ или цель ослеплена" },
                        duration: { value: 1, unit: "minute" } },
  "Оглушающая кара":  { repeat: { formula: "4к6", upcast: "1к6", icon: "⚔️", label: "по попаданию",
                          hint: "следующее попадание: +4к6 психического; испытание МУД или помеха на атаки и без реакций" },
                        duration: { value: 1, unit: "minute" } },
  "Изгоняющая кара":  { repeat: { formula: "5к10", icon: "⚔️", label: "по попаданию",
                          hint: "следующее попадание: +5к10 силовым; при ХП цели ≤50 — изгнание на родной план" },
                        duration: { value: 1, unit: "minute" } },
  "Опутывающий удар": { repeat: { formula: "1к6", upcast: "1к6", icon: "⚔️", label: "по попаданию",
                          hint: "следующее попадание опутывает лозами: испытание СИЛ или захват, 1к6 колющего в начале каждого хода цели" },
                        duration: { value: 1, unit: "minute" } },
  "Поглощение стихий": { repeat: { formula: "1к6", upcast: "1к6", icon: "⚔️", label: "по попаданию",
                          hint: "первая рукопашная атака до конца следующего хода: +1к6 поглощённым типом урона" },
                        duration: { value: 1, unit: "round" } },
  // Дальнобойные райдеры — своя иконка
  "Град шипов":       { repeat: { formula: "1к10", upcast: "1к10", save: "dex", halfOnSave: true,
                          icon: "🏹", label: "по попаданию",
                          hint: "следующее попадание дальнобойным: цель и все в 5 фт — 1к10 колющего (максимум 6к10)" },
                        duration: { value: 1, unit: "minute" } },
  "Молниевая стрела": { repeat: { formula: "4к8", upcast: "1к8", icon: "🏹", label: "по попаданию",
                          hint: "следующее попадание дальнобойным: 4к8 электричеством вместо обычного (половина при промахе); все в 10 фт — 2к8, испытание ЛОВ вдвое" },
                        duration: { value: 1, unit: "minute" } },
  // Ауры и зачарования оружия: доп. кубы на КАЖДОМ попадании, пока держится
  "Мантия крестоносца": { repeat: { formula: "1к4", icon: "⚔️", label: "по попаданию",
                            hint: "каждое попадание оружием — ваше или союзника в ауре 30 фт: +1к4 излучением" },
                          duration: { value: 1, unit: "minute" } },
  // Апкаст «Стихийного оружия» — за каждые два уровня выше 3-го (5–6: 2к4,
  // 7+: 3к4). Ячейка 9 круга даст на куб больше книжного — предел таблицы,
  // такой апкаст этого заклинания встречается разве что теоретически.
  "Стихийное оружие": { repeat: { formula: "1к4", upcast: "1к4", upcastEvery: 2, icon: "⚔️", label: "по попаданию",
                          hint: "каждое попадание зачарованным оружием: +1к4 выбранным типом (ячейка 5–6: +2 и 2к4, 7+: +3 и 3к4)" },
                        variants: { label: "Тип урона", options: [
                          { id: "acid",      name: "Кислота" },
                          { id: "cold",      name: "Холод" },
                          { id: "fire",      name: "Огонь" },
                          { id: "lightning", name: "Молния" },
                          { id: "thunder",   name: "Гром" } ] },
                        duration: { value: 1, unit: "hour" } },
  "Источник лунного света": { repeat: { formula: "2к6", icon: "⚔️", label: "по попаданию",
                                hint: "каждое попадание рукопашной атакой, пока горит свет: +2к6 излучением" },
                              duration: { value: 10, unit: "minute" } },
  "Корона звёзд": { repeat: { formula: "4к12", attack: true, icon: "⭐", label: "сфера",
                      hint: "бонусное действие: запустить одну из семи сфер (апкаст +2 сферы); заклинание кончится на последней" },
                    duration: { value: 1, unit: "hour" } },

  // ── Зоны с повторным тиком (CAST-11) ────────────────────────────────────────
  // Урона в момент каста нет — зона бьёт тех, кто в неё вошёл или начал в ней
  // ход. Ветка repeat, кнопка в трекере боя: игрок жмёт её на каждое существо,
  // попавшее под зону в этом раунде.
  "Завеса стрел":   { repeat: { formula: "1к6", save: "dex", icon: "🏹", label: "выстрел",
                        hint: "существо впервые за ход вошло в зону 30 фт или закончило там ход — взлетает один боеприпас" },
                      duration: { value: 8, unit: "hour" } },
  "Шипы":           { repeat: { formula: "2к4",
                        hint: "за каждые 5 фт передвижения существа по зоне радиусом 20 фт" },
                      duration: { value: 10, unit: "minute" } },
  "Голод Хадара":   { repeat: { formula: "2к6", upcast: "1к6",
                        hint: "начало хода в зоне — 2к6 холодом без испытания; конец хода — испытание ЛОВ или 2к6 кислотой" },
                      duration: { value: 1, unit: "minute" } },
  "Стена ветров":   { repeat: { formula: "3к8",
                        hint: "существо проходит сквозь стену 50×15 фт" },
                      duration: { value: 1, unit: "minute" } },
  "Эвардовы чёрные щупальца": { repeat: { formula: "3к6", save: "dex",
                        hint: "вход в зону 20×20 или начало хода там: испытание ЛОВ или 3к6 дробящего и захват; схваченные — ещё 3к6 в начале своего хода" },
                      duration: { value: 1, unit: "minute" } },
  "Нашествие насекомых": { repeat: { formula: "4к10", upcast: "1к10", save: "con", halfOnSave: true,
                        hint: "вход в сферу 20 фт или начало хода там" },
                      duration: { value: 10, unit: "minute" } },
  "Стена клинков":  { repeat: { formula: "6к10", save: "dex", halfOnSave: true,
                        hint: "вход в стену или начало хода в ней" },
                      duration: { value: 10, unit: "minute" } },
  "Терновая стена": { repeat: { formula: "7к8", upcast: "1к8", save: "dex", halfOnSave: true,
                        hint: "прохождение сквозь стену 60×10×5 фт" },
                      duration: { value: 10, unit: "minute" } },
  "Запрет":         { repeat: { formula: "5к10",
                        hint: "начало хода существа выбранного типа в зоне — 5к10 излучением или некрозом" },
                      duration: { value: 24, unit: "hour" } },
  // Накопление +1к6 за раунд без взрыва (до 20к6) не моделируем — в подсказке
  "Замедленный огненный шар": { repeat: { formula: "12к6", upcast: "1к6", save: "dex", halfOnSave: true,
                        hint: "взрыв в конце вашего хода; за каждый раунд без взрыва урон +1к6, максимум 20к6" },
                      duration: { value: 1, unit: "minute" } },
  "Воспламеняющая туча": { repeat: { formula: "10к8", save: "dex", halfOnSave: true,
                        hint: "вход в сферу 20 фт или начало хода внутри; облако дрейфует на 10 фт за раунд" },
                      duration: { value: 10, unit: "minute" } },
  "Смертный ужас":  { repeat: { formula: "4к10", save: "wis",
                        hint: "начало хода существа, провалившего испытание МУД (сфера 30 фт)" },
                      duration: { value: 1, unit: "minute" } },

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
  // CAST-11: у сторожевого пса в PHB нет статблока (его нельзя атаковать) —
  // hp/ac не задаём, модалка оставит свои дефолты. PH24 сменил укус с броска
  // атаки на испытание ЛОВ и тип урона на силовое поле
  "Верный пёс Морденкайнена": { summon: { companionType: "summoned", prefill: {
      name: "Верный пёс", attack: "Укус: бонус атаки заклинаниями, 5 фт. Попадание: 4к8 колющего",
      desc: "Невидимый сторожевой пёс. Громко лает (слышен на 300 фт), когда Маленькое или большее существо подходит на 30 фт к охраняемой точке без пароля. Кусает врага в 5 фт от себя. Исчезает через 8 часов, при уходе дальше 100 фт от точки призыва или когда вы отойдёте на 100 фт." } },
    duration: { value: 8, unit: "hour" },
    bySource: { PH24: { summon: { companionType: "summoned", prefill: {
        name: "Верный пёс", attack: "Укус: испытание ЛОВ (СЛ заклинаний), 5 фт. Провал: 4к8 силовым полем",
        desc: "Невидимый сторожевой пёс. Громко лает (слышен на 300 фт), когда Маленькое или большее существо подходит на 30 фт к охраняемой точке без пароля. Кусает врага в 5 фт от себя. Исчезает через 8 часов или при уходе дальше 100 фт от точки призыва." } } } } },
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

  // ── Хвост CAST-11: осознанно НЕ покрыто (23 заклинания с кубами в desc) ──────
  // План CAST закрыт на этом; ключи ниже не добавлены не по недосмотру, а
  // потому что их кубы не ложатся ни на одну ветку applyCastEffects. Если
  // однажды появится новая ветка — вот готовый список кандидатов.
  //
  // 1) Кубы уходят в ЧУЖОЙ бросок (нет ветки «модификатор броска оружия или
  //    другого существа»): Дубинка (кость урона оружия 1к8→2к6), Меткий удар
  //    (PH24 +1к6/2к6/3к6 к атаке оружием), Защита от оружия (PH24 −1к4 к
  //    атакам по вам), Сопротивление (+1к4 к испытанию / PH24 −1к4 урона),
  //    Указание (+1к4 к проверке), Смена обличья (натуральное оружие 1к6).
  // 2) Кубы задают ПУЛ ХИТОВ, а не урон: Сверкающие брызги (6к10). Родственное
  //    «Усыпление» покрыто чипом дебаффа, его пул PH14 описан в hint.
  // 3) Случайная ТАБЛИЦА вместо формулы: Причуды Натэйра (к4), Мерцание
  //    (к20 / PH24 1к6 на уход в Эфир), Реинкарнация (к100 — новый вид),
  //    Гроза гнева (свой эффект на каждый раунд бури).
  // 4) Повторное ЛЕЧЕНИЕ каждый ход: Аура живучести (2к6). Ветка repeat кидает
  //    только урон и предлагает его целям боя — лечение через неё уйдёт не туда.
  // 5) Прибавка к МАКСИМУМУ ХП броском: Пир героев (+2к10). hpMaxBonus плоский
  //    ({base, perUpcast}) — бросок пришлось бы хранить в экземпляре.
  // 6) Урон ВНЕ боевого цикла или по условию, которого приложение не знает:
  //    Власть над водами (2к8 в водовороте), Переносящая дверь (4к6 при
  //    неудачной телепортации), Вещий сон (3к6 кошмаром), Связь с иным миром
  //    (6к6 за провал проверки ИНТ), Обет (5к10 за сутки невыполнения),
  //    Воскрешение (−4 к броскам к20), Власть над погодой (1к4×10 минут на
  //    смену погоды), Исполнение желаний (2к4 суток ослабления), Остановка
  //    времени (1к4+1 дополнительных ходов).
  // 7) Много целей со СВОИМИ статблоками: Оживление вещей (1к4+4 / 2к6+2 /
  //    2к10+2 у десяти предметов разом) — модалка спутника рассчитана на одного.
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
// CAST-9a: every — апкаст «за каждые N уровней» («Божественное оружие»: +1к8 за
// каждые 2 уровня выше 2-го, ячейка 5 ур. → один шаг, не три). По умолчанию 1.
function scaleFormula(base, upcastPer, baseLevel, castLevel, every) {
  var out = String(base || "");
  if (!upcastPer || !baseLevel || !castLevel || castLevel <= baseLevel) return out;
  var step = (every && every > 1) ? Math.floor(every) : 1;
  var times = Math.floor((castLevel - baseLevel) / step);
  var add = String(upcastPer);
  if (add[0] !== "+" && add[0] !== "-") add = "+" + add;
  for (var i = 0; i < times; i++) out += add;
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
// апкаст ячейкой через scaleFormula (upcastEvery — шаг апкаста, CAST-9a).
// Схема repeat совпадает с damage — повторный тик считается этой же функцией.
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
  return scaleFormula(dmg.formula, dmg.upcast, spellLevel, castLevel, dmg.upcastEvery);
}

// CAST-7: формула критического урона — правило 5e «кубы ×2, модификаторы как
// есть»: «3к4+3» → «6к4+3», «8к6» → «16к6». Работает текстово по нотации
// дескрипторов («NкM», «к» или латинская «d»); плоские слагаемые не трогает.
function critFormula(formula) {
  return String(formula == null ? "" : formula).replace(/(\d*)([кКdD])(\d+)/g, function(_, cnt, k, sides) {
    var n = cnt === "" ? 1 : parseInt(cnt, 10);
    return (n * 2) + "к" + sides;
  });
}

// CAST-10: сколько целей можно отметить чипом. targets — база (по умолчанию 1),
// targetsUpcast — сколько ЕЩЁ целей даёт каждый уровень ячейки выше базового
// («Порча»: 3 цели, +1 за уровень). Заговор/каст без ячейки (castLevel == null)
// и ячейка не выше базовой — база без изменений.
function debuffTargetCount(dbf, spellLevel, castLevel) {
  if (!dbf) return 0;
  var base = dbf.targets != null ? dbf.targets : 1;
  if (!dbf.targetsUpcast || !spellLevel || !castLevel || castLevel <= spellLevel) return base;
  return base + (castLevel - spellLevel) * dbf.targetsUpcast;
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
  window.critFormula = critFormula;
  window.debuffTargetCount = debuffTargetCount;
}
