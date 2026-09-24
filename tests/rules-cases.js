// Кейсы для rules.js. Формат общий с tests/headless.js: функция возвращает
// true (ок) либо строку с описанием расхождения. Эталон цифр — книги D&D 5e 2014.
// Раннер — tests.html в корне (грузит data.js + rules.js + этот файл).

function rulesCases(t, group) {

  // Персонаж-заготовка: минимум полей, которых хватает чистым расчётам.
  function fixture(over) {
    var c = {
      name: "Тест", class: "", subclass: "", level: 1, race: "", background: "",
      stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      combat: { armorId: "none", hasShield: false, hpCurrent: 10, hpMax: 10, hpTemp: 0, hpDiceSpent: 0, hpDice: "1к8" },
      saves: {}, skills: [], expertiseSkills: [], conditions: [], effects: [], activeSpellEffects: [],
      feats: [], proficiencies: {}, inventory: {}, resources: {},
      spells: { stat: "", slots: {}, slotsUsed: {}, pactSlots: 0, pactLevel: 0, pactUsed: 0 },
      deathSaves: { successes: [false, false, false], failures: [false, false, false] }
    };
    if (over) Object.keys(over).forEach(function(k) { c[k] = over[k]; });
    return c;
  }

  group("Характеристики и бонус мастерства");

  t("Модификатор характеристики: 10 → 0, 8 → −1, 20 → +5, 7 → −2", function() {
    var pairs = [[10, 0], [8, -1], [20, 5], [7, -2], [1, -5], [30, 10]];
    for (var i = 0; i < pairs.length; i++) {
      var got = getMod(pairs[i][0]);
      if (got !== pairs[i][1]) return "getMod(" + pairs[i][0] + ") = " + got + ", ожидал " + pairs[i][1];
    }
    return true;
  });

  t("Знак модификатора: +3 / +0 / −1", function() {
    if (formatMod(3) !== "+3") return "formatMod(3) = " + formatMod(3);
    if (formatMod(0) !== "+0") return "formatMod(0) = " + formatMod(0);
    if (formatMod(-1) !== "-1") return "formatMod(-1) = " + formatMod(-1);
    return true;
  });

  t("Бонус мастерства по уровням: границы 5 / 9 / 13 / 17", function() {
    var table = { 1: 2, 4: 2, 5: 3, 8: 3, 9: 4, 12: 4, 13: 5, 16: 5, 17: 6, 20: 6 };
    var lv = Object.keys(table);
    for (var i = 0; i < lv.length; i++) {
      var got = getProficiencyBonus(parseInt(lv[i], 10));
      if (got !== table[lv[i]]) return "уровень " + lv[i] + ": получено +" + got + ", ожидал +" + table[lv[i]];
    }
    return true;
  });

  t("Максимум ХП: 1 ур. d10 при ТЕЛ +2 → 12, 5 ур. → 44", function() {
    if (calculateMaxHP(1, 2, 10) !== 12) return "1 ур.: " + calculateMaxHP(1, 2, 10);
    if (calculateMaxHP(5, 2, 10) !== 44) return "5 ур.: " + calculateMaxHP(5, 2, 10) + ", ожидал 44 (12 + 4×8)";
    if (calculateMaxHP(0, 2, 10) !== 0) return "0 ур. должен давать 0: " + calculateMaxHP(0, 2, 10);
    return true;
  });

  group("Экспертиза и Мастер на все руки");

  t("Экспертиза Плута: Скрытность ЛОВ 18 на 5 ур. — +10, без экспертизы +7", function() {
    var c = fixture({ class: "Плут", level: 5, stats: { str: 10, dex: 18, con: 10, int: 10, wis: 10, cha: 10 },
                      expertiseSkills: [15] });
    if (rulesSkillBonus(c, 15, 5, true) !== 10) return "Скрытность с экспертизой: " + rulesSkillBonus(c, 15, 5, true) + ", ожидал +10 (4 + 3×2)";
    if (rulesSkillBonus(c, 0, 5, true) !== 7) return "Акробатика без экспертизы: " + rulesSkillBonus(c, 0, 5, true) + ", ожидал +7 (4 + 3)";
    return true;
  });

  t("Экспертиза без владения навыком не удваивает бонус", function() {
    var c = fixture({ class: "Плут", level: 5, stats: { str: 10, dex: 18, con: 10, int: 10, wis: 10, cha: 10 },
                      expertiseSkills: [15] });
    if (rulesSkillBonus(c, 15, 5, false) !== 4) return "получено " + rulesSkillBonus(c, 15, 5, false) + ", ожидал +4 (только ЛОВ, мастерства нет)";
    return true;
  });

  t("Экспертиза Барда: Убеждение ХАР 18 на 3 ур. — +8", function() {
    var c = fixture({ class: "Бард", level: 3, stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 18 },
                      expertiseSkills: [16] });
    if (rulesSkillBonus(c, 16, 3, true) !== 8) return "получено " + rulesSkillBonus(c, 16, 3, true) + ", ожидал +8 (4 + 2×2)";
    return true;
  });

  // Баг v3.43.9: Плуту Компетентность давалась с 3 ур. вместо 1-го.
  t("Уровни Компетентности: Плут с 1 ур. (2 → 4 навыка с 6), Бард с 3 ур. (2 → 4 с 10)", function() {
    if (typeof CLASS_CHOICES === "undefined") return "нет таблицы CLASS_CHOICES (не загружен class-choices.js)";
    function exp(cls) {
      return (CLASS_CHOICES[cls] || []).filter(function(ch) { return ch.id === "expertise"; })[0];
    }
    var rogue = exp("Плут"), bard = exp("Бард");
    if (!rogue) return "у Плута нет выбора «Компетентность»";
    if (!bard) return "у Барда нет выбора «Компетентность»";
    if (rogue.minLevel !== 1) return "Плут получает Компетентность с " + rogue.minLevel + " ур., по книге — с 1-го";
    if (rogue.getCount(1) !== 2 || rogue.getCount(5) !== 2) return "Плут 1–5 ур.: навыков " + rogue.getCount(1) + "/" + rogue.getCount(5) + ", ожидал 2";
    if (rogue.getCount(6) !== 4) return "Плут 6 ур.: " + rogue.getCount(6) + ", ожидал 4";
    if (bard.minLevel !== 3) return "Бард получает Компетентность с " + bard.minLevel + " ур., по книге — с 3-го";
    if (bard.getCount(3) !== 2 || bard.getCount(9) !== 2) return "Бард 3–9 ур.: навыков " + bard.getCount(3) + "/" + bard.getCount(9) + ", ожидал 2";
    if (bard.getCount(10) !== 4) return "Бард 10 ур.: " + bard.getCount(10) + ", ожидал 4";
    return true;
  });

  t("Мастер на все руки: только Бард и только с 2 ур.", function() {
    if (rulesJackOfAllTrades(fixture({ class: "Бард" }), 1) !== false) return "Бард 1 ур. не должен иметь фичу";
    if (rulesJackOfAllTrades(fixture({ class: "Бард" }), 2) !== true) return "Бард 2 ур. должен иметь фичу";
    if (rulesJackOfAllTrades(fixture({ class: "Плут" }), 5) !== false) return "фича досталась Плуту";
    if (rulesJackOfAllTrades(null, 5) !== false) return "падение на пустом персонаже";
    return true;
  });

  t("Мастер на все руки: половина БМ в непрофильные навыки (2 ур. +1, 9 ур. +2)", function() {
    var b2 = fixture({ class: "Бард", level: 2 });
    if (rulesSkillBonus(b2, 2, 2, false) !== 1) return "Бард 2 ур., Атлетика СИЛ 10: " + rulesSkillBonus(b2, 2, 2, false) + ", ожидал +1";
    var b9 = fixture({ class: "Бард", level: 9 });
    if (rulesSkillBonus(b9, 2, 9, false) !== 2) return "Бард 9 ур. (БМ +4): " + rulesSkillBonus(b9, 2, 9, false) + ", ожидал +2";
    var b1 = fixture({ class: "Бард", level: 1 });
    if (rulesSkillBonus(b1, 2, 1, false) !== 0) return "Бард 1 ур.: " + rulesSkillBonus(b1, 2, 1, false) + ", ожидал 0";
    return true;
  });

  t("Мастер на все руки не складывается с владением и экспертизой", function() {
    var b = fixture({ class: "Бард", level: 5, expertiseSkills: [16] });
    if (rulesSkillBonus(b, 2, 5, true) !== 3) return "профильный навык: " + rulesSkillBonus(b, 2, 5, true) + ", ожидал +3 (полный БМ, без половины сверху)";
    if (rulesSkillBonus(b, 16, 5, true) !== 6) return "навык с экспертизой: " + rulesSkillBonus(b, 16, 5, true) + ", ожидал +6 (3×2, без половины сверху)";
    return true;
  });

  t("Пассивная внимательность: Бард 3 ур. без владения — 11, экспертиза при МУД 14 на 5 ур. — 18", function() {
    if (rulesPassivePerception(fixture({ class: "Бард", level: 3 }), 3, false) !== 11)
      return "Бард 3 ур. (10 + половина БМ): " + rulesPassivePerception(fixture({ class: "Бард", level: 3 }), 3, false);
    var exp = fixture({ level: 5, stats: { str: 10, dex: 10, con: 10, int: 10, wis: 14, cha: 10 }, expertiseSkills: [3] });
    if (rulesPassivePerception(exp, 5, true) !== 18) return "экспертиза Внимательности: " + rulesPassivePerception(exp, 5, true) + ", ожидал 18 (10 + 2 + 3×2)";
    return true;
  });

  group("Инициатива и заклинательские характеристики");

  t("Инициатива: ЛОВ, пол-БМ Барда со 2 ур., надбавка черты", function() {
    var c = fixture({ level: 5, stats: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 } });
    if (getInitiativeMod(c, 5) !== 3) return "ЛОВ 16 без класса: " + getInitiativeMod(c, 5) + ", ожидал +3";
    c.class = "Бард";
    if (getInitiativeMod(c, 1) !== 3) return "Бард 1 ур. не должен получать пол-БМ: " + getInitiativeMod(c, 1);
    if (getInitiativeMod(c, 5) !== 4) return "Бард 5 ур.: " + getInitiativeMod(c, 5) + ", ожидал +4 (3 + 1)";
    c.bonuses = { initiative: 5 };
    if (getInitiativeMod(c, 5) !== 9) return "Бард 5 ур. с «Бдительным»: " + getInitiativeMod(c, 5) + ", ожидал +9";
    return true;
  });

  t("СЛ спасброска и бонус атаки заклинаниями: ИНТ 18, 5 ур. → СЛ 15, атака +7", function() {
    var c = fixture({ level: 5, stats: { str: 10, dex: 10, con: 10, int: 18, wis: 10, cha: 10 } });
    c.spells.stat = "ИНТ";
    var s = rulesSpellStats(c, 5);
    if (s.mod !== 4) return "модификатор: " + s.mod;
    if (s.dc !== 15) return "СЛ: " + s.dc + ", ожидал 15 (8 + 3 + 4)";
    if (s.attack !== 7) return "атака: " + s.attack + ", ожидал +7 (3 + 4)";
    return true;
  });

  group("Ячейки заклинаний и кости хитов");

  t("Пакт-ячейки Колдуна 5 ур. — 2 ячейки 3 круга", function() {
    if (typeof SPELL_SLOTS_BY_LEVEL === "undefined") return "нет таблицы SPELL_SLOTS_BY_LEVEL (не загружен data.js)";
    var pact = resolvePactSlots(SPELL_SLOTS_BY_LEVEL["Колдун"][5]);
    if (pact.cnt !== 2 || pact.lvl !== 3) return "получено " + pact.cnt + " × " + pact.lvl + " круг";
    return true;
  });

  t("Пакт-ячейки Колдуна по всей таблице уровней 1–20", function() {
    if (typeof SPELL_SLOTS_BY_LEVEL === "undefined") return "нет таблицы SPELL_SLOTS_BY_LEVEL (не загружен data.js)";
    // уровень персонажа → [сколько ячеек, какого круга]
    var book = {
      1: [1, 1], 2: [2, 1], 3: [2, 2], 4: [2, 2], 5: [2, 3], 6: [2, 3], 7: [2, 4], 8: [2, 4],
      9: [2, 5], 10: [2, 5], 11: [3, 5], 12: [3, 5], 13: [3, 5], 14: [3, 5], 15: [3, 5], 16: [3, 5],
      17: [4, 5], 18: [4, 5], 19: [4, 5], 20: [4, 5]
    };
    var lv = Object.keys(book);
    for (var i = 0; i < lv.length; i++) {
      var got = resolvePactSlots(SPELL_SLOTS_BY_LEVEL["Колдун"][lv[i]]);
      var exp = book[lv[i]];
      if (got.cnt !== exp[0] || got.lvl !== exp[1]) {
        return lv[i] + " ур.: " + got.cnt + " × " + got.lvl + " круг, ожидал " + exp[0] + " × " + exp[1];
      }
    }
    if (resolvePactSlots(undefined).cnt !== 0) return "пустая строка таблицы должна давать 0 ячеек";
    return true;
  });

  t("Мультикласс: Колдун 3 / Волшебник 3 — обычные ячейки по 3-му уровню заклинателя", function() {
    var slots = getMulticlassSpellSlots({ level: 6, classes: [
      { class: "Колдун", level: 3, subclass: "" }, { class: "Волшебник", level: 3, subclass: "" }
    ]});
    if (slots[1] !== 4 || slots[2] !== 2) return "получено 1 кр.: " + slots[1] + ", 2 кр.: " + slots[2] + " — ожидал 4 и 2 (пакт Колдуна считается отдельно)";
    if (slots[3] !== 0) return "ячейки 3 круга не должны появляться на 6 общем уровне: " + slots[3];
    return true;
  });

  t("Мультикласс: половинные и 1/3-заклинатели (Паладин 2 / Мистический рыцарь 3 → 3 ячейки 1 круга)", function() {
    var half = getMulticlassSpellSlots({ level: 5, classes: [
      { class: "Паладин", level: 2, subclass: "" }, { class: "Воин", level: 3, subclass: "Мистический рыцарь" }
    ]});
    if (half[1] !== 3) return "Паладин 2 + Мист. рыцарь 3 (уровень заклинателя 2): 1 кр. " + half[1] + ", ожидал 3";
    var none = getMulticlassSpellSlots({ level: 9, classes: [
      { class: "Воин", level: 6, subclass: "Чемпион" }, { class: "Плут", level: 3, subclass: "Вор" }
    ]});
    for (var i = 1; i <= 9; i++) if (none[i]) return "не-заклинателям выдана ячейка " + i + " круга: " + none[i];
    return true;
  });

  t("Грань кости хитов: «5к8» → 8, «1к12» → 12, «мульти» → 8", function() {
    if (rulesHitDieSides({ combat: { hpDice: "5к8" } }) !== 8) return "5к8 → " + rulesHitDieSides({ combat: { hpDice: "5к8" } });
    if (rulesHitDieSides({ combat: { hpDice: "1к12" } }) !== 12) return "1к12 → " + rulesHitDieSides({ combat: { hpDice: "1к12" } });
    if (rulesHitDieSides({ combat: { hpDice: "мульти" } }) !== 8) return "мульти должен падать на 8";
    return true;
  });

  group("Класс доспеха");

  // Ни один из 599 node-тестов КД не покрывает — здесь единственная страховка
  // после выноса расчёта из calculateAC в rulesAC.
  function acOf(over) { return rulesAC(fixture(over)); }

  t("Без брони: КД 10 + ЛОВ, со щитом +2", function() {
    var stats = { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 };
    var bare = acOf({ stats: stats, combat: { armorId: "none", hasShield: false } });
    if (bare.mode !== "unarmored") return "режим: " + bare.mode;
    if (bare.ac !== 13) return "ЛОВ 16 без брони: " + bare.ac + ", ожидал 13";
    var shielded = acOf({ stats: stats, combat: { armorId: "none", hasShield: true } });
    if (shielded.ac !== 15) return "со щитом: " + shielded.ac + ", ожидал 15";
    return true;
  });

  t("Без доспехов варвара: 10 + ЛОВ + ТЕЛ", function() {
    var r = acOf({ class: "Варвар", stats: { str: 16, dex: 14, con: 16, int: 10, wis: 10, cha: 10 },
                   combat: { armorId: "none", hasShield: false } });
    if (r.ac !== 15) return "ЛОВ 14 / ТЕЛ 16: " + r.ac + ", ожидал 15 (10 + 2 + 3)";
    return true;
  });

  t("Без доспехов монаха: 10 + ЛОВ + МУД", function() {
    var r = acOf({ class: "Монах", stats: { str: 10, dex: 16, con: 10, int: 10, wis: 14, cha: 10 },
                   combat: { armorId: "none", hasShield: false } });
    if (r.ac !== 15) return "ЛОВ 16 / МУД 14: " + r.ac + ", ожидал 15 (10 + 3 + 2)";
    return true;
  });

  t("Доспех мага: 13 + ЛОВ, без двойного учёта бонуса эффекта", function() {
    var r = acOf({ class: "Волшебник", stats: { str: 10, dex: 14, con: 10, int: 16, wis: 10, cha: 10 },
                   combat: { armorId: "none", hasShield: false }, effects: ["mage_armor"] });
    if (r.ac === 18) return "бонус +3 приплюсовался поверх формулы 13 + ЛОВ (двойной учёт)";
    if (r.ac !== 15) return "ЛОВ 14 с Доспехом мага: " + r.ac + ", ожидал 15 (13 + 2)";
    return true;
  });

  t("Тяжёлая броня игнорирует Ловкость: кольчуга 16, со щитом 18", function() {
    var stats = { str: 16, dex: 18, con: 10, int: 10, wis: 10, cha: 10 };
    var r = acOf({ stats: stats, combat: { armorId: "chain_mail", hasShield: false } });
    if (r.mode !== "preset") return "режим: " + r.mode;
    if (r.ac !== 16) return "кольчуга при ЛОВ 18: " + r.ac + ", ожидал 16 (предел ЛОВ 0)";
    var withShield = acOf({ stats: stats, combat: { armorId: "chain_mail", hasShield: true } });
    if (withShield.ac !== 18) return "кольчуга + щит: " + withShield.ac + ", ожидал 18";
    return true;
  });

  t("Средняя броня: предел Ловкости +2 (полулаты при ЛОВ 18 → 17)", function() {
    var r = acOf({ stats: { str: 10, dex: 18, con: 10, int: 10, wis: 10, cha: 10 },
                   combat: { armorId: "half_plate", hasShield: false } });
    if (r.ac !== 17) return "получено " + r.ac + ", ожидал 17 (15 + мин(4, 2))";
    return true;
  });

  t("Лёгкая броня: полный модификатор Ловкости (кожаный при ЛОВ 16 → 14)", function() {
    var r = acOf({ stats: { str: 10, dex: 16, con: 10, int: 10, wis: 10, cha: 10 },
                   combat: { armorId: "leather", hasShield: false } });
    if (r.ac !== 14) return "получено " + r.ac + ", ожидал 14 (11 + 3)";
    return true;
  });

  t("Режим «вручную»: КД берётся как есть и не пересчитывается", function() {
    var r = acOf({ stats: { str: 10, dex: 18, con: 10, int: 10, wis: 10, cha: 10 },
                   combat: { armorId: "custom", hasShield: true, ac: 21 } });
    if (r.mode !== "manual") return "режим: " + r.mode;
    if (r.ac !== 21) return "получено " + r.ac + ", ожидал 21 (ЛОВ и щит не добавляются)";
    return true;
  });

  t("Помехи брони: кольчуга при СИЛ 10 — Скрытность и скорость, кираса — чисто", function() {
    var weak = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    var notes = acOf({ stats: weak, combat: { armorId: "chain_mail", hasShield: false } })
      .modifiers.filter(function(m) { return m.type === "note"; }).map(function(m) { return m.name; });
    if (notes.length !== 2) return "кольчуга при СИЛ 10 дала заметок: " + notes.length + " (" + notes.join(" / ") + ")";
    if (!/Скрытность/.test(notes.join(" "))) return "нет помехи на Скрытность: " + notes.join(" / ");
    if (!/13/.test(notes.join(" "))) return "нет предупреждения о СИЛ 13: " + notes.join(" / ");
    var clean = acOf({ stats: weak, combat: { armorId: "breastplate", hasShield: false } })
      .modifiers.filter(function(m) { return m.type === "note"; });
    if (clean.length !== 0) return "кираса не даёт помех, а вернула: " + clean.length;
    return true;
  });

  t("Эффекты поверх брони: «Щит» +5, «Замедление» −2", function() {
    var stats = { str: 16, dex: 16, con: 10, int: 10, wis: 10, cha: 10 };
    var shielded = acOf({ stats: stats, combat: { armorId: "chain_mail", hasShield: false }, effects: ["shield_spell"] });
    if (shielded.ac !== 21) return "кольчуга + «Щит»: " + shielded.ac + ", ожидал 21 (16 + 5)";
    var slowed = acOf({ stats: stats, combat: { armorId: "none", hasShield: false }, effects: ["slow"] });
    if (slowed.ac !== 11) return "без брони + «Замедление»: " + slowed.ac + ", ожидал 11 (10 + 3 − 2)";
    return true;
  });

  // LVL-1 + вердикт dnd-rules. ЛОВ 16 (+3), ТЕЛ 14 (+2), МУД 14 (+2).
  // Стат-блок общий: обе безбронные защиты дают одинаковые 15, поэтому кейсы
  // различают их по формуле (ТЕЛ или МУД), а не только по числу.
  function acUd(classes, shield) {
    var c = fixture({
      class: classes[0].class, level: 0, classes: classes,
      stats: { str: 10, dex: 16, con: 14, int: 10, wis: 14, cha: 10 },
      combat: { armorId: "none", hasShield: !!shield }
    });
    classes.forEach(function(e) { c.level += e.level; });
    return rulesAC(c);
  }
  function acHas(res, part) { return res.formula.join(" ").indexOf(part) !== -1; }

  t("Безбронная защита работает, даже если класс не первый (PHB 164)", function() {
    var barb = acUd([{ class: "Воин", level: 1 }, { class: "Варвар", level: 4 }], false);
    if (barb.ac !== 15 || !acHas(barb, "(ТЕЛ)")) return "Воин 1 / Варвар 4: " + barb.ac + " [" + barb.formula.join(" ") + "]";
    var monk = acUd([{ class: "Плут", level: 2 }, { class: "Монах", level: 2 }], false);
    if (monk.ac !== 15 || !acHas(monk, "(МУД)")) return "Плут 2 / Монах 2: " + monk.ac + " [" + monk.formula.join(" ") + "]";
    return true;
  });

  t("Монаху щит отключает безбронную защиту, варвару — нет (PHB 77 / 48)", function() {
    var monkShield = acUd([{ class: "Монах", level: 5 }], true);
    if (acHas(monkShield, "(МУД)")) return "монах со щитом сохранил МУД: [" + monkShield.formula.join(" ") + "]";
    if (monkShield.ac !== 15) return "монах со щитом: " + monkShield.ac + ", ожидал 15 (10 + ЛОВ 3 + щит 2)";
    var monkBare = acUd([{ class: "Монах", level: 5 }], false);
    if (monkBare.ac !== 15 || !acHas(monkBare, "(МУД)")) return "монах без щита: " + monkBare.ac;
    var barbShield = acUd([{ class: "Варвар", level: 5 }], true);
    if (barbShield.ac !== 17 || !acHas(barbShield, "(ТЕЛ)")) return "варвар со щитом: " + barbShield.ac + ", ожидал 17";
    return true;
  });

  t("Варвар + Монах: действует умение класса, взятого первым (PHB 164)", function() {
    var monkFirst = acUd([{ class: "Монах", level: 1 }, { class: "Варвар", level: 1 }], false);
    if (!acHas(monkFirst, "(МУД)")) return "монах первым, а посчитано: [" + monkFirst.formula.join(" ") + "]";
    var barbFirst = acUd([{ class: "Варвар", level: 1 }, { class: "Монах", level: 1 }], false);
    if (!acHas(barbFirst, "(ТЕЛ)")) return "варвар первым, а посчитано: [" + barbFirst.formula.join(" ") + "]";
    return true;
  });

  group("Концентрация");

  t("СЛ спасброска концентрации: половина урона, но не ниже 10", function() {
    var c = fixture({ level: 5 });
    var pairs = [[1, 10], [9, 10], [19, 10], [20, 10], [21, 10], [22, 11], [30, 15], [41, 20], [0, 10]];
    for (var i = 0; i < pairs.length; i++) {
      var dc = concSaveParams(c, pairs[i][0]).dc;
      if (dc !== pairs[i][1]) return "урон " + pairs[i][0] + ": СЛ " + dc + ", ожидал " + pairs[i][1];
    }
    return true;
  });

  t("Спасбросок ТЕЛ: модификатор Телосложения, с владением — плюс бонус мастерства", function() {
    var stats = { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 };
    var plain = concSaveParams(fixture({ level: 5, stats: stats }), 10);
    if (plain.mod !== 2) return "без владения при ТЕЛ 14: " + plain.mod + ", ожидал +2";
    var prof = concSaveParams(fixture({ level: 5, stats: stats, saves: { con: true } }), 10);
    if (prof.mod !== 5) return "с владением на 5 ур.: " + prof.mod + ", ожидал +5 (2 + 3)";
    var weak = concSaveParams(fixture({ level: 1, stats: { str: 10, dex: 10, con: 7, int: 10, wis: 10, cha: 10 } }), 10);
    if (weak.mod !== -2) return "ТЕЛ 7: " + weak.mod + ", ожидал −2";
    return true;
  });

  t("Черта «Боевой маг» даёт преимущество, обычный персонаж бросает ровно", function() {
    if (concSaveParams(fixture({ level: 5 }), 10).mode !== "normal") return "без черты режим не «normal»";
    var wc = concSaveParams(fixture({ level: 5, feats: [{ id: "war_caster" }] }), 10);
    if (wc.mode !== "adv") return "с «Боевым магом» режим: " + wc.mode + ", ожидал adv";
    var other = concSaveParams(fixture({ level: 5, feats: [{ id: "alert" }] }), 10);
    if (other.mode !== "normal") return "посторонняя черта дала режим: " + other.mode;
    return true;
  });

  t("Спасбросок концентрации не падает на мусорном уроне (пустой персонаж, отрицательный урон)", function() {
    if (concSaveParams(null, 10).dc !== 10) return "пустой персонаж: " + JSON.stringify(concSaveParams(null, 10));
    if (concSaveParams(fixture(), -30).dc !== 15) return "урон −30 (по модулю 30): " + concSaveParams(fixture(), -30).dc + ", ожидал 15";
    return true;
  });

  group("Отдых");

  // Фикстура отдыха: уровень 5, ТЕЛ 14 (+2), кость хитов к10, ХП 12/44.
  function restChar(over) {
    var base = {
      level: 5, stats: { str: 10, dex: 10, con: 14, int: 10, wis: 10, cha: 10 },
      combat: { armorId: "none", hasShield: false, hpCurrent: 12, hpMax: 44, hpTemp: 0, hpDiceSpent: 0, hpDice: "1к10" }
    };
    if (over) Object.keys(over).forEach(function(k) { base[k] = over[k]; });
    return fixture(base);
  }

  // PHB стр.186: «у персонажа должен быть хотя бы 1 хит в начале отдыха, чтобы получить
  // от него преимущества» — оговорка раздела «Продолжительный отдых».
  t("Стартовое условие длинного отдыха: 0 хитов запрещает, 1 хит разрешает", function() {
    var dead = restChar({ combat: { armorId: "none", hasShield: false, hpCurrent: 0, hpMax: 44, hpTemp: 0, hpDiceSpent: 0, hpDice: "1к10" } });
    if (!rulesLongRestBlockReason(dead)) return "0 хитов: отдых разрешён, ожидал отказ";
    var alive = restChar({ combat: { armorId: "none", hasShield: false, hpCurrent: 1, hpMax: 44, hpTemp: 0, hpDiceSpent: 0, hpDice: "1к10" } });
    if (rulesLongRestBlockReason(alive)) return "1 хит: отказ «" + rulesLongRestBlockReason(alive) + "», ожидал разрешение";
    return true;
  });

  t("Длинный отдых на 0 хитов не даёт преимуществ и ничего не меняет", function() {
    var c = restChar({ conditions: ["exhaustion_3"], effects: ["mage_armor"],
      deathSaves: { successes: [true, false, false], failures: [true, true, false] },
      combat: { armorId: "none", hasShield: false, hpCurrent: 0, hpMax: 44, hpTemp: 0, hpDiceSpent: 4, hpDice: "1к10" },
      spells: { stat: "ИНТ", slots: { 1: 4, 2: 3 }, slotsUsed: { 1: 4, 2: 3 }, pactSlots: 2, pactLevel: 3, pactUsed: 2 } });
    var r = rulesLongRest(c);
    if (r.blocked !== true) return "сводка не помечена blocked: " + JSON.stringify(r);
    if (!r.reason) return "нет причины отказа в сводке";
    if (c.combat.hpCurrent !== 0) return "ХП поднялись без отдыха: " + c.combat.hpCurrent;
    if (c.combat.hpDiceSpent !== 4) return "кости хитов вернулись: потрачено " + c.combat.hpDiceSpent + ", ожидал 4";
    if (r.hitDiceRestored !== 0) return "сводка вернула кости: " + r.hitDiceRestored;
    if (c.spells.slotsUsed[1] !== 4 || c.spells.pactUsed !== 2) return "ячейки восстановились: " + JSON.stringify(c.spells.slotsUsed) + " пакт " + c.spells.pactUsed;
    if (c.conditions.indexOf("exhaustion_3") === -1) return "истощение понижено: " + c.conditions.join(",");
    if (c.effects.length !== 1) return "карточки эффектов сняты: " + c.effects.join(",");
    if (!c.deathSaves.failures[0] || !c.deathSaves.failures[1]) return "спасброски от смерти сброшены заблокированным отдыхом";
    return true;
  });

  // Обратная сторона того же правила: у короткого отдыха (PHB стр.186) требований
  // к стартовым ХП нет, кости хитов на 0 хитов тратятся штатно.
  t("Короткий отдых на 0 хитов книгой не запрещён: кости хитов лечат", function() {
    var c = restChar({ combat: { armorId: "none", hasShield: false, hpCurrent: 0, hpMax: 44, hpTemp: 0, hpDiceSpent: 0, hpDice: "1к10" } });
    var r = rulesShortRest(c, { rolls: [6] });
    if (r.hpHealed !== 8) return "лечение: " + r.hpHealed + ", ожидал 8 (6+2)";
    if (c.combat.hpCurrent !== 8) return "ХП: " + c.combat.hpCurrent + ", ожидал 8";
    return true;
  });

  t("Короткий отдых: каждая кость лечит бросок + ТЕЛ, кости уходят в потраченные", function() {
    var c = restChar();
    var r = rulesShortRest(c, { rolls: [3, 8] });
    if (r.hpHealed !== 15) return "лечение: " + r.hpHealed + ", ожидал 15 (3+2 и 8+2)";
    if (c.combat.hpCurrent !== 27) return "ХП: " + c.combat.hpCurrent + ", ожидал 27";
    if (c.combat.hpDiceSpent !== 2) return "потрачено костей: " + c.combat.hpDiceSpent + ", ожидал 2";
    if (r.rollLog.join(" ") !== "3+2=5 8+2=10") return "лог бросков: " + r.rollLog.join(" ");
    return true;
  });

  t("Короткий отдых: лечение не выше максимума ХП", function() {
    var c = restChar({ combat: { armorId: "none", hasShield: false, hpCurrent: 40, hpMax: 44, hpTemp: 0, hpDiceSpent: 0, hpDice: "1к10" } });
    rulesShortRest(c, { rolls: [10, 10] });
    if (c.combat.hpCurrent !== 44) return "получено " + c.combat.hpCurrent + ", ожидал 44";
    return true;
  });

  // PHB стр.186: за кость восстанавливается «бросок + ТЕЛ», минимум 0 — отрицательное
  // Телосложение не отнимает ХП, но и не гарантирует 1 ХП за кость.
  t("Короткий отдых при отрицательном ТЕЛ: кость даёт минимум 0, а не 1", function() {
    var c = restChar({ stats: { str: 10, dex: 10, con: 6, int: 10, wis: 10, cha: 10 },
                       combat: { armorId: "none", hasShield: false, hpCurrent: 5, hpMax: 30, hpTemp: 0, hpDiceSpent: 0, hpDice: "1к8" } });
    var r = rulesShortRest(c, { rolls: [1, 2] });
    if (r.hpHealed !== 0) return "лечение: " + r.hpHealed + ", ожидал 0 (1−2 и 2−2 не дают ХП)";
    if (c.combat.hpCurrent !== 5) return "ХП изменились: " + c.combat.hpCurrent;
    var r2 = rulesShortRest(c, { rolls: [5] });
    if (r2.hpHealed !== 3) return "бросок 5 при ТЕЛ −2: " + r2.hpHealed + ", ожидал 3";
    return true;
  });

  // PHB стр.186: запас костей хитов равен уровню, потраченные возвращает только
  // продолжительный отдых — потратить больше, чем осталось, нельзя.
  t("Короткий отдых: нельзя потратить костей больше, чем осталось в запасе", function() {
    var c = restChar({ combat: { armorId: "none", hasShield: false, hpCurrent: 12, hpMax: 44, hpTemp: 0, hpDiceSpent: 3, hpDice: "1к10" } });
    var r = rulesShortRest(c, { hitDiceSpent: 4, rolls: [5, 5, 5, 5] });
    if (r.hitDiceSpent !== 2) return "потрачено по сводке: " + r.hitDiceSpent + ", ожидал 2 (осталось 5−3)";
    if (r.hpHealed !== 14) return "лечение: " + r.hpHealed + ", ожидал 14 (только 2 кости по 5+2)";
    if (c.combat.hpDiceSpent !== 5) return "потрачено костей: " + c.combat.hpDiceSpent + ", ожидал 5 (не больше уровня)";
    var empty = restChar({ combat: { armorId: "none", hasShield: false, hpCurrent: 12, hpMax: 44, hpTemp: 0, hpDiceSpent: 5, hpDice: "1к10" } });
    var re = rulesShortRest(empty, { rolls: [8] });
    if (re.hpHealed !== 0 || re.hitDiceSpent !== 0) return "пустой запас лечит: " + re.hpHealed + " ХП за " + re.hitDiceSpent + " костей";
    if (empty.combat.hpDiceSpent !== 5) return "потраченные выросли сверх уровня: " + empty.combat.hpDiceSpent;
    return true;
  });

  t("Короткий отдых: Колдун восстанавливает пакт-ячейки, Волшебник — ничего", function() {
    var w = restChar({ class: "Колдун",
      spells: { stat: "ХАР", slots: {}, slotsUsed: {}, pactSlots: 2, pactLevel: 3, pactUsed: 2 } });
    var r = rulesShortRest(w, { rolls: [] });
    if (r.isWarlock !== true) return "Колдун не распознан";
    if (w.spells.pactUsed !== 0) return "пакт: использовано " + w.spells.pactUsed + ", ожидал 0";
    var wiz = restChar({ class: "Волшебник",
      spells: { stat: "ИНТ", slots: { 1: 4, 2: 3, 3: 2 }, slotsUsed: { 1: 4, 2: 1, 3: 2 }, pactSlots: 0, pactLevel: 0, pactUsed: 0 } });
    rulesShortRest(wiz, { rolls: [] });
    if (wiz.spells.slotsUsed[1] !== 4 || wiz.spells.slotsUsed[3] !== 2) return "ячейки Волшебника восстановились: " + JSON.stringify(wiz.spells.slotsUsed);
    return true;
  });

  // PHB стр.164: у мультикласса обычные ячейки общие, коротким отдыхом не восстанавливаются —
  // возвращается только пакт Колдуна.
  t("Короткий отдых мультикласса Колдун 3 / Волшебник 3: пакт вернулся, обычные ячейки нет", function() {
    var c = restChar({ class: "Колдун", level: 6,
      classes: [{ class: "Колдун", level: 3, subclass: "" }, { class: "Волшебник", level: 3, subclass: "" }],
      spells: { stat: "ХАР", slots: { 1: 4, 2: 2 }, slotsUsed: { 1: 3, 2: 2 }, pactSlots: 2, pactLevel: 2, pactUsed: 2 } });
    rulesShortRest(c, { rolls: [] });
    if (c.spells.pactUsed !== 0) return "пакт не восстановлен: " + c.spells.pactUsed;
    if (c.spells.slotsUsed[1] !== 3 || c.spells.slotsUsed[2] !== 2)
      return "обычные ячейки восстановились коротким отдыхом: " + JSON.stringify(c.spells.slotsUsed);
    return true;
  });

  t("Длинный отдых: ХП до максимума, временные ХП гаснут, ячейки и пакт полны", function() {
    var c = restChar({ combat: { armorId: "none", hasShield: false, hpCurrent: 4, hpMax: 44, hpTemp: 9, hpDiceSpent: 5, hpDice: "1к10" },
      spells: { stat: "ИНТ", slots: { 1: 4, 2: 3 }, slotsUsed: { 1: 4, 2: 3 }, pactSlots: 2, pactLevel: 3, pactUsed: 2 } });
    var r = rulesLongRest(c);
    if (c.combat.hpCurrent !== 44) return "ХП: " + c.combat.hpCurrent;
    if (c.combat.hpTemp !== 0) return "временные ХП пережили длинный отдых: " + c.combat.hpTemp;
    if (c.spells.slotsUsed[1] !== 0 || c.spells.slotsUsed[2] !== 0) return "ячейки: " + JSON.stringify(c.spells.slotsUsed);
    if (c.spells.pactUsed !== 0) return "пакт: " + c.spells.pactUsed;
    if (r.hpBefore !== 4 || r.hpAfter !== 44) return "сводка: " + r.hpBefore + " → " + r.hpAfter;
    return true;
  });

  // PHB стр.186: возвращается половина костей хитов, минимум одна, но не больше потраченных.
  t("Длинный отдых: костей хитов — половина уровня, минимум одна, не больше потраченных", function() {
    var c5 = restChar({ combat: { armorId: "none", hasShield: false, hpCurrent: 4, hpMax: 44, hpTemp: 0, hpDiceSpent: 5, hpDice: "1к10" } });
    var r5 = rulesLongRest(c5);
    if (r5.hitDiceRestored !== 2) return "5 ур., потрачено 5: восстановлено " + r5.hitDiceRestored + ", ожидал 2";
    if (c5.combat.hpDiceSpent !== 3) return "осталось потраченных: " + c5.combat.hpDiceSpent + ", ожидал 3";
    var c1 = restChar({ level: 1, combat: { armorId: "none", hasShield: false, hpCurrent: 1, hpMax: 10, hpTemp: 0, hpDiceSpent: 1, hpDice: "1к8" } });
    var r1 = rulesLongRest(c1);
    if (r1.hitDiceRestored !== 1) return "1 ур.: восстановлено " + r1.hitDiceRestored + ", ожидал 1 (минимум одна кость)";
    if (c1.combat.hpDiceSpent !== 0) return "1 ур.: осталось потраченных " + c1.combat.hpDiceSpent;
    var fresh = restChar({ combat: { armorId: "none", hasShield: false, hpCurrent: 44, hpMax: 44, hpTemp: 0, hpDiceSpent: 0, hpDice: "1к10" } });
    var rf = rulesLongRest(fresh);
    if (rf.hitDiceRestored !== 0) return "непотраченные кости: восстановлено " + rf.hitDiceRestored + ", ожидал 0";
    if (fresh.combat.hpDiceSpent !== 0) return "потраченные ушли в минус: " + fresh.combat.hpDiceSpent;
    return true;
  });

  // AUD-13 (E1, E5): в 2024 длинный отдых возвращает все кости и снимает истощение без еды
  t("[AUD-13 E1, E5] длинный отдых 2024: все кости хитов, истощение без условия «ел и пил»", function() {
    var c = restChar({ edition: "2024", conditions: ["exhaustion_2"],
      combat: { armorId: "none", hasShield: false, hpCurrent: 4, hpMax: 44, hpTemp: 0, hpDiceSpent: 5, hpDice: "1к10" } });
    var r = rulesLongRest(c, { foodAndDrink: false });
    if (r.hitDiceRestored !== 5 || c.combat.hpDiceSpent !== 0) return "кости: " + r.hitDiceRestored + ", осталось " + c.combat.hpDiceSpent;
    if (!r.exhaustionReduced || c.conditions.indexOf("exhaustion_1") === -1) return "истощение: " + JSON.stringify(c.conditions);
    var c14 = restChar({ conditions: ["exhaustion_2"] });
    var r14 = rulesLongRest(c14, { foodAndDrink: false });
    return (r14.exhaustionHeld && c14.conditions.indexOf("exhaustion_2") !== -1) || "2014 без еды снизил истощение";
  });

  // AUD-13 (E4, E13): «Боевой заклинатель» 2024 и потолок СЛ 30
  t("[AUD-13 E4, E13] концентрация: черта f24-war_caster, СЛ не выше 30 в 2024", function() {
    var p = concSaveParams({ edition: "2024", stats: { con: 10 }, saves: {}, level: 5, feats: [{ id: "f24-war_caster" }] }, 100);
    if (p.mode !== "adv") return "нет преимущества от f24-war_caster";
    if (p.dc !== 30) return "СЛ 2024: " + p.dc;
    var p14 = concSaveParams({ stats: { con: 10 }, saves: {}, level: 5 }, 100);
    return p14.dc === 50 || "СЛ 2014: " + p14.dc;
  });

  // AUD-13 (E18): «Мастер на все руки» 2024 — только навыки, к инициативе не идёт
  t("[AUD-13 E18] инициатива барда 2024 без пол-БМ", function() {
    var a = getInitiativeMod({ stats: { dex: 14 }, class: "Бард" }, 9);
    var b = getInitiativeMod({ edition: "2024", stats: { dex: 14 }, class: "Бард" }, 9);
    if (a !== 4 || b !== 2) return "бард: 2014 " + a + ", 2024 " + b;
    var ch = getInitiativeMod({ edition: "2024", stats: { dex: 14 }, class: "Воин", subclass: "Чемпион" }, 9);
    return ch === 2 || "Чемпион 2024: " + ch;
  });

  t("Длинный отдых: истощение −1 уровень, прочие состояния остаются", function() {
    var c3 = restChar({ conditions: ["exhaustion_3", "poisoned"] });
    var r3 = rulesLongRest(c3);
    if (r3.exhaustionReduced !== true) return "истощение не понижено";
    if (c3.conditions.indexOf("exhaustion_2") === -1) return "истощение 3 → 2 не сработало: " + c3.conditions.join(",");
    if (c3.conditions.indexOf("poisoned") === -1) return "отравление снято длинным отдыхом";
    var c1 = restChar({ conditions: ["exhaustion_1"] });
    rulesLongRest(c1);
    if (c1.conditions.length !== 0) return "истощение 1 не снято: " + c1.conditions.join(",");
    var clean = restChar();
    if (rulesLongRest(clean).exhaustionReduced !== false) return "истощения не было, а флаг поднят";
    return true;
  });

  // PHB стр.291: «Продолжительный отдых снижает степень истощения на 1, при условии,
  // что существо что-нибудь съест и выпьет».
  t("Длинный отдых без еды и питья: истощение остаётся, остальное восстанавливается", function() {
    var c = restChar({ conditions: ["exhaustion_3"],
      combat: { armorId: "none", hasShield: false, hpCurrent: 4, hpMax: 44, hpTemp: 0, hpDiceSpent: 5, hpDice: "1к10" },
      spells: { stat: "ИНТ", slots: { 1: 4, 2: 3 }, slotsUsed: { 1: 4, 2: 3 }, pactSlots: 0, pactLevel: 0, pactUsed: 0 } });
    var r = rulesLongRest(c, { foodAndDrink: false });
    if (r.exhaustionReduced !== false) return "истощение понижено без еды и питья";
    if (r.exhaustionHeld !== true) return "нет флага exhaustionHeld: " + JSON.stringify(r);
    if (c.conditions.indexOf("exhaustion_3") === -1) return "степень истощения изменилась: " + c.conditions.join(",");
    if (c.combat.hpCurrent !== 44) return "ХП не восстановились: " + c.combat.hpCurrent;
    if (c.spells.slotsUsed[1] !== 0) return "ячейки не восстановились: " + JSON.stringify(c.spells.slotsUsed);
    if (r.hitDiceRestored !== 2) return "кости хитов: " + r.hitDiceRestored + ", ожидал 2";
    // Тот же персонаж после еды и питья: степень падает
    var r2 = rulesLongRest(c, { foodAndDrink: true });
    if (r2.exhaustionReduced !== true || c.conditions.indexOf("exhaustion_2") === -1)
      return "с едой и питьём истощение не понижено: " + c.conditions.join(",");
    if (r2.exhaustionHeld !== false) return "флаг exhaustionHeld держится при еде";
    // Умолчание (аргумента нет) = персонаж ел и пил
    var d = restChar({ conditions: ["exhaustion_1"] });
    if (rulesLongRest(d).exhaustionReduced !== true) return "без opts истощение не понижено";
    return true;
  });

  t("Длинный отдых: эффекты, спасброски от смерти и заряды предметов", function() {
    var c = restChar({ effects: ["mage_armor"],
      deathSaves: { successes: [true, true, false], failures: [true, false, false] },
      inventory: { magic: [
        { name: "Палочка", charges: 1, maxCharges: 7, recharge: "dawn" },
        { name: "Одноразовая", charges: 0, maxCharges: 3, recharge: "none" },
        { name: "Полная", charges: 3, maxCharges: 3, recharge: "dawn" }
      ]}});
    var r = rulesLongRest(c);
    if (c.effects.length !== 0) return "карточки эффектов не сняты: " + c.effects.join(",");
    if (c.deathSaves.successes.some(Boolean) || c.deathSaves.failures.some(Boolean)) return "спасброски от смерти не сброшены";
    if (r.chargesRestored !== 1) return "восстановлено предметов: " + r.chargesRestored + ", ожидал 1 (только неполная палочка)";
    if (c.inventory.magic[0].charges !== 7) return "палочка: " + c.inventory.magic[0].charges + ", ожидал 7";
    if (c.inventory.magic[1].charges !== 0) return "предмет с recharge «none» долит: " + c.inventory.magic[1].charges;
    return true;
  });

  group("Владения от предыстории");

  t("Преступник: воровские инструменты фиксированы, игровой набор — выбор игрока", function() {
    var c = fixture({ background: "Преступник", proficiencies: { toolChoices: { bg_1: ["Набор для игры в кости"] } } });
    recalcToolsFromSources(c);
    var names = c.proficiencies.tools.map(function(t) { return t.name; });
    if (names.indexOf("Воровские инструменты") === -1) return "нет воровских инструментов: " + names.join(", ");
    if (names.indexOf("Набор для игры в кости") === -1) return "выбранный игровой набор потерян: " + names.join(", ");
    var srcs = c.proficiencies.tools.map(function(t) { return t.source; }).join(",");
    if (srcs !== "background,background") return "источники: " + srcs + ", ожидал background у обоих";
    var empty = fixture({ background: "Преступник", proficiencies: {} });
    recalcToolsFromSources(empty);
    if (empty.proficiencies.tools.length !== 1) return "без выбора игрока должен остаться 1 инструмент, получено " + empty.proficiencies.tools.length;
    return true;
  });

  t("Гильдейский ремесленник: слот на один ремесленный инструмент, лишний выбор отбрасывается", function() {
    var c = fixture({ background: "Гильдейский ремесленник", proficiencies: {
      tools: [{ name: "Свои клещи", source: "custom", category: "custom" }],
      toolChoices: { bg_0: ["Ювелирные инструменты", "Плотницкие инструменты"] } } });
    recalcToolsFromSources(c);
    var names = c.proficiencies.tools.map(function(t) { return t.name; });
    if (names.indexOf("Плотницкие инструменты") !== -1) return "взято больше одного ремесленного: " + names.join(", ");
    if (names.indexOf("Ювелирные инструменты") === -1) return "первый выбор потерян: " + names.join(", ");
    if (names.indexOf("Свои клещи") === -1) return "свой инструмент стёрт пересчётом: " + names.join(", ");
    var jeweler = c.proficiencies.tools.filter(function(t) { return t.name === "Ювелирные инструменты"; })[0];
    if (jeweler.category !== "artisan") return "категория из каталога: " + jeweler.category + ", ожидал artisan";
    return true;
  });

  t("Мудрец: два языка от предыстории, третий выбор игнорируется", function() {
    var c = fixture({ background: "Мудрец", proficiencies: { languageChoices: { background: ["Эльфийский", "Дварфский", "Орочий"] } } });
    recalcLanguagesFromSources(c);
    var names = c.proficiencies.languages.map(function(l) { return l.name; });
    if (names.length !== 2) return "языков: " + names.length + " (" + names.join(", ") + "), ожидал 2";
    if (names.indexOf("Орочий") !== -1) return "взят третий язык сверх лимита: " + names.join(", ");
    if (c.proficiencies.languages[0].source !== "background") return "источник: " + c.proficiencies.languages[0].source;
    if (c.proficiencies.languages[0].category !== "standard") return "категория из каталога: " + c.proficiencies.languages[0].category;
    return true;
  });

  t("Солдат языков не даёт, язык расы остаётся с источником «раса»", function() {
    var c = fixture({ background: "Солдат", race: "Человек",
      proficiencies: { languageChoices: { background: ["Орочий"] } } });
    recalcLanguagesFromSources(c);
    var bg = c.proficiencies.languages.filter(function(l) { return l.source === "background"; });
    if (bg.length !== 0) return "предыстория без языков выдала: " + bg.map(function(l) { return l.name; }).join(", ");
    var common = c.proficiencies.languages.filter(function(l) { return l.name === "Общий"; })[0];
    if (!common) return "потерян Общий от расы: " + c.proficiencies.languages.map(function(l) { return l.name; }).join(", ");
    if (common.source !== "race") return "источник Общего: " + common.source;
    return true;
  });

  t("Все 13 предысторий: по 2 навыка из таблицы навыков, фиксированные инструменты — из каталога", function() {
    if (typeof BACKGROUND_SKILLS === "undefined") return "нет таблицы BACKGROUND_SKILLS (не загружен data.js)";
    var keys = Object.keys(BACKGROUND_SKILLS);
    if (keys.length !== 13) return "предысторий: " + keys.length + ", ожидал 13";
    for (var i = 0; i < keys.length; i++) {
      var bg = BACKGROUND_SKILLS[keys[i]];
      var list = bg.skills || [];
      if (list.length !== 2) return keys[i] + ": навыков " + list.length + ", ожидал 2";
      for (var j = 0; j < list.length; j++) {
        var found = false;
        for (var k = 0; k < skills.length; k++) if (skills[k].name === list[j]) found = true;
        if (!found) return keys[i] + ": навык «" + list[j] + "» не найден в таблице навыков";
      }
      var tools = bg.tools || [];
      for (var m = 0; m < tools.length; m++) {
        var parsed = parseBackgroundToolEntry(tools[m]);
        if (parsed.type === "fixed" && !findToolInCatalog(parsed.name)) {
          return keys[i] + ": инструмент «" + parsed.name + "» не найден в каталоге инструментов";
        }
      }
    }
    return true;
  });

  t("Разбор строк инструментов предыстории: слоты категорий и фиксированные названия", function() {
    var slots = { "Ремесленный инструмент (один)": "artisan", "Музыкальный инструмент (один)": "musical", "Игровой набор (один)": "gaming" };
    var names = Object.keys(slots);
    for (var i = 0; i < names.length; i++) {
      var p = parseBackgroundToolEntry(names[i]);
      if (p.type !== "slot" || p.from !== slots[names[i]] || p.count !== 1) {
        return "«" + names[i] + "» → " + JSON.stringify(p);
      }
    }
    var fixed = parseBackgroundToolEntry("Воровские инструменты");
    if (fixed.type !== "fixed" || fixed.name !== "Воровские инструменты") return "фиксированный инструмент разобран как " + JSON.stringify(fixed);
    return true;
  });

  group("Мультикласс: уровень класса против суммарного");

  // Персонаж-мультикласс: char.level — СУММА, char.class — первый класс.
  // Именно так их хранит приложение (syncClassFields).
  function mcFixture(list, over) {
    var total = 0;
    list.forEach(function(e){ total += e.level; });
    var c = fixture({ class: list[0].class, subclass: list[0].subclass || "", level: total, classes: list });
    if (over) Object.keys(over).forEach(function(k){ c[k] = over[k]; });
    return c;
  }

  t("charClassLevel: Плут 2 / Монах 2 — суммарный 4, но у каждого класса свои 2", function() {
    var c = mcFixture([{class:"Плут", level:2}, {class:"Монах", level:2}]);
    if (c.level !== 4) return "суммарный уровень " + c.level + ", ожидал 4";
    if (charClassLevel(c, "Плут") !== 2) return "уровень плута " + charClassLevel(c, "Плут");
    if (charClassLevel(c, "Монах") !== 2) return "уровень монаха " + charClassLevel(c, "Монах");
    if (charClassLevel(c, "Воин") !== 0) return "чужой класс дал уровень " + charClassLevel(c, "Воин");
    return true;
  });

  t("charClassLevel: одноклассовый без classes[] считается по legacy-полям", function() {
    var c = fixture({ class: "Воин", level: 7 });
    if (charClassLevel(c, "Воин") !== 7) return "уровень воина " + charClassLevel(c, "Воин");
    if (charClassLevel(c, "Плут") !== 0) return "чужой класс дал уровень";
    if (charClassLevel(null, "Воин") !== 0) return "падение на пустом персонаже";
    return true;
  });

  t("charSubclassPending: Плут 2 / Монах 2 — подкласс ещё НЕ пора выбирать", function() {
    var c = mcFixture([{class:"Плут", level:2}, {class:"Монах", level:2}]);
    var p = charSubclassPending(c);
    if (p.length !== 0) return "предложено выбрать подкласс раньше срока: " + JSON.stringify(p);
    return true;
  });

  t("charSubclassPending: Плут 3 / Монах 2 — пора только плуту", function() {
    var c = mcFixture([{class:"Плут", level:3}, {class:"Монах", level:2}]);
    var p = charSubclassPending(c);
    if (p.length !== 1) return "ожидал один класс, получил " + JSON.stringify(p);
    if (p[0].cls !== "Плут" || p[0].at !== 3) return "не тот класс/уровень: " + JSON.stringify(p[0]);
    return true;
  });

  t("charSubclassPending: выбранный подкласс больше не просит выбора", function() {
    var c = mcFixture([{class:"Плут", level:3, subclass:"Вор"}, {class:"Монах", level:2}]);
    if (charSubclassPending(c).length !== 0) return "просит выбрать при уже выбранном подклассе";
    return true;
  });

  t("charAsiSlots: расписание считается от уровня КЛАССА, а не от суммарного", function() {
    // Воин 3 / Плут 2 = суммарный 5. Ни один класс не дорос до своего АСИ (4).
    var a = charAsiSlots(mcFixture([{class:"Воин", level:3}, {class:"Плут", level:2}]));
    if (a.length !== 0) return "АСИ выдано раньше срока: " + JSON.stringify(a);
    // Воин 1 / Варвар 4 = суммарный 5. Варвар дорос до своего 4-го — один слот.
    var b = charAsiSlots(mcFixture([{class:"Воин", level:1}, {class:"Варвар", level:4}]));
    if (b.length !== 1) return "ожидал один слот, получил " + JSON.stringify(b);
    if (b[0].cls !== "Варвар" || b[0].level !== 4) return "не тот слот: " + JSON.stringify(b[0]);
    return true;
  });

  t("charAsiSlots: у Воина расширенное расписание 4, 6, 8", function() {
    var a = charAsiSlots(fixture({ class: "Воин", level: 8 }));
    if (a.map(function(s){ return s.level; }).join() !== "4,6,8") return "слоты: " + JSON.stringify(a);
    return true;
  });

  t("Мастер на все руки и инициатива работают, когда Бард НЕ первый класс", function() {
    var c = mcFixture([{class:"Воин", level:3}, {class:"Бард", level:2}], { stats: {str:10,dex:14,con:10,int:10,wis:10,cha:10} });
    if (rulesJackOfAllTrades(c, c.level) !== true) return "JoaT не сработал у Воин 3 / Бард 2";
    // ЛОВ 14 → +2, суммарный 5 ур. → БМ +3, половина → +1
    if (getInitiativeMod(c, c.level) !== 3) return "инициатива " + getInitiativeMod(c, c.level) + ", ожидал +3";
    var d = mcFixture([{class:"Воин", level:4}, {class:"Бард", level:1}], { stats: {str:10,dex:14,con:10,int:10,wis:10,cha:10} });
    if (rulesJackOfAllTrades(d, d.level) !== false) return "JoaT достался Барду 1 уровня";
    return true;
  });

  t("Безбронная защита срабатывает, когда Варвар/Монах не первый класс", function() {
    var stats = { str:10, dex:14, con:14, int:10, wis:14, cha:10 };
    var barb = mcFixture([{class:"Воин", level:1}, {class:"Варвар", level:4}], { stats: stats });
    if (rulesAC(barb).ac !== 14) return "Варвар вторым классом: КД " + rulesAC(barb).ac + ", ожидал 14 (10+ЛОВ2+ТЕЛ2)";
    var monk = mcFixture([{class:"Плут", level:2}, {class:"Монах", level:2}], { stats: stats });
    if (rulesAC(monk).ac !== 14) return "Монах вторым классом: КД " + rulesAC(monk).ac + ", ожидал 14 (10+ЛОВ2+МУД2)";
    return true;
  });

  t("charCasterLevel: уровни заклинателей складываются в общий пул (PHB стр. 164)", function() {
    var a = charCasterLevel(mcFixture([{class:"Волшебник", level:3}, {class:"Жрец", level:2}]));
    if (a.level !== 5) return "Волшебник 3 / Жрец 2: уровень заклинателя " + a.level + ", ожидал 5";
    var b = charCasterLevel(mcFixture([{class:"Паладин", level:3}, {class:"Воин", level:3}]));
    if (b.level !== 1) return "Паладин 3 (половина) / Воин 3 без мистика: " + b.level + ", ожидал 1";
    var c = charCasterLevel(mcFixture([{class:"Воин", level:6, subclass:"Мистический рыцарь"}, {class:"Плут", level:3}]));
    if (c.level !== 2) return "Мистический рыцарь 6 (треть): " + c.level + ", ожидал 2";
    var d = charCasterLevel(mcFixture([{class:"Варвар", level:5}, {class:"Монах", level:3}]));
    if (d.level !== 0 || d.casters.length !== 0) return "не-заклинатели дали пул: " + JSON.stringify(d);
    return true;
  });

  t("charCasterLevel: пакт-магия Колдуна считается отдельно от общего пула", function() {
    var c = charCasterLevel(mcFixture([{class:"Колдун", level:3}, {class:"Бард", level:2}]));
    if (c.level !== 2) return "общий пул " + c.level + ", ожидал 2 (только бард)";
    if (!c.pact || c.pact.cls !== "Колдун" || c.pact.level !== 3) return "пакт: " + JSON.stringify(c.pact);
    return true;
  });

  t("Ячейки: один класс-заклинатель среди нескольких считается по своей таблице", function() {
    // PHB стр. 164: общий пул — только когда «Использование заклинаний» у двух
    // и более классов. У Паладина 5 / Воина 3 (Чемпион) заклинатель один.
    var c = mcFixture([{class:"Паладин", level:5}, {class:"Воин", level:3, subclass:"Чемпион"}]);
    var s = getMulticlassSpellSlots(c);
    var want = SPELL_SLOTS_BY_LEVEL["Паладин"][5];
    if (s.slice(1, 4).join() !== want.slice(1, 4).join()) {
      return "ячейки " + s.slice(1,4).join() + ", по таблице паладина " + want.slice(1,4).join();
    }
    return true;
  });

  t("Ячейки: мистический рыцарь считается по своей таблице (PHB стр. 75)", function() {
    // Уровни НЕ кратные трём как раз и расходятся с общим пулом: на 7 ур. воина
    // таблица подкласса даёт 4 и 2, а пул по уровню заклинателя 2 — только 3.
    var c = mcFixture([{class:"Воин", level:7, subclass:"Мистический рыцарь"}, {class:"Плут", level:3}]);
    var s = getMulticlassSpellSlots(c);
    if (s[1] !== 4 || s[2] !== 2) return "Воин 7 (МР): " + s.slice(1,4).join() + ", по книге 4,2";
    // Одноклассовый мистический ловкач раньше не получал ячеек вовсе.
    var t2 = getMulticlassSpellSlots(mcFixture([{class:"Плут", level:5, subclass:"Мистический ловкач"}]));
    if (t2[1] !== 3) return "Плут 5 (МЛ): " + JSON.stringify(t2) + ", по книге 3 ячейки 1 круга";
    // Воин без подкласса-заклинателя ячеек не получает.
    var t3 = getMulticlassSpellSlots(mcFixture([{class:"Воин", level:7, subclass:"Чемпион"}]));
    for (var i = 1; i <= 9; i++) if (t3[i]) return "Чемпион получил ячейки: " + JSON.stringify(t3);
    return true;
  });

  t("Таблица THIRD_CASTER_SLOTS: 18 строк 3–20, максимум 4 круга с 19 ур.", function() {
    if (typeof THIRD_CASTER_SLOTS === "undefined") return "нет таблицы THIRD_CASTER_SLOTS";
    var keys = Object.keys(THIRD_CASTER_SLOTS).map(Number).sort(function(a,b){ return a - b; });
    if (keys[0] !== 3 || keys[keys.length-1] !== 20 || keys.length !== 18) return "уровни: " + keys.join(",");
    if ((THIRD_CASTER_SLOTS[3][1]) !== 2) return "3 ур.: " + JSON.stringify(THIRD_CASTER_SLOTS[3]);
    if ((THIRD_CASTER_SLOTS[13][3]) !== 2) return "13 ур. (3 круг): " + JSON.stringify(THIRD_CASTER_SLOTS[13]);
    if ((THIRD_CASTER_SLOTS[18][4] || 0) !== 0) return "4 круг раньше 19 ур.: " + JSON.stringify(THIRD_CASTER_SLOTS[18]);
    if ((THIRD_CASTER_SLOTS[19][4]) !== 1) return "19 ур. (4 круг): " + JSON.stringify(THIRD_CASTER_SLOTS[19]);
    return true;
  });

  t("Ячейки: два заклинателя дают общий пул по сумме (Волшебник 3 / Жрец 2)", function() {
    var c = mcFixture([{class:"Волшебник", level:3}, {class:"Жрец", level:2}]);
    var s = getMulticlassSpellSlots(c);
    if (s[1] !== 4 || s[2] !== 3 || s[3] !== 2) return "ячейки " + s.slice(1,4).join() + ", ожидал 4,3,2";
    return true;
  });

  t("Ячейки: Колдун в общий пул не входит (Колдун 3 / Бард 2)", function() {
    var c = mcFixture([{class:"Колдун", level:3}, {class:"Бард", level:2}]);
    var s = getMulticlassSpellSlots(c);
    var want = SPELL_SLOTS_BY_LEVEL["Бард"][2];
    if (s.slice(1, 4).join() !== want.slice(1, 4).join()) {
      return "ячейки " + s.slice(1,4).join() + ", по таблице барда 2 ур. " + want.slice(1,4).join();
    }
    return true;
  });

  t("Ячейки: у Колдуна с не-заклинателем общего пула нет вовсе", function() {
    // Пакт-магия — отдельный ресурс (PHB стр. 164): в общий пул Колдун не входит,
    // а классов с «Использованием заклинаний» тут нет ни одного.
    var c = mcFixture([{class:"Колдун", level:3}, {class:"Варвар", level:2}]);
    var s = getMulticlassSpellSlots(c);
    for (var i = 1; i <= 9; i++) if (s[i]) return "появились обычные ячейки: " + JSON.stringify(s);
    var cl = charCasterLevel(c);
    if (!cl.pact || cl.pact.level !== 3) return "пакт потерялся: " + JSON.stringify(cl.pact);
    return true;
  });

  group("Пороги опыта");

  t("charXpNext: пороги PHB 2014 и остаток до следующего уровня", function() {
    var a = charXpNext({ level: 4, exp: 2700 });
    if (a.level !== 5 || a.need !== 6500) return "с 4 ур.: " + JSON.stringify(a);
    if (a.left !== 3800) return "остаток " + a.left + ", ожидал 3800";
    if (a.canLevel !== false) return "2700 опыта не хватает на 5 ур., но canLevel=true";
    var b = charXpNext({ level: 4, exp: 6500 });
    if (b.canLevel !== true) return "6500 опыта хватает на 5 ур., но canLevel=false";
    if (b.left !== 0) return "остаток при достигнутом пороге: " + b.left;
    return true;
  });

  t("charXpNext: на 20 уровне следующего порога нет", function() {
    var a = charXpNext({ level: 20, exp: 999999 });
    if (a.level !== null || a.canLevel !== false) return JSON.stringify(a);
    return true;
  });

  t("Таблица порогов: 20 уровней, строго возрастает, 5 ур. = 6500", function() {
    if (typeof XP_THRESHOLDS === "undefined") return "нет таблицы XP_THRESHOLDS";
    var keys = Object.keys(XP_THRESHOLDS).map(Number).sort(function(a,b){ return a - b; });
    if (keys.length !== 20) return "уровней в таблице: " + keys.length;
    if (XP_THRESHOLDS[1] !== 0) return "1 уровень должен требовать 0 опыта";
    if (XP_THRESHOLDS[5] !== 6500) return "5 уровень: " + XP_THRESHOLDS[5] + ", по книге 6500";
    if (XP_THRESHOLDS[20] !== 355000) return "20 уровень: " + XP_THRESHOLDS[20] + ", по книге 355000";
    for (var i = 1; i < keys.length; i++) {
      if (XP_THRESHOLDS[keys[i]] <= XP_THRESHOLDS[keys[i-1]]) return "порог " + keys[i] + " не больше предыдущего";
    }
    return true;
  });

  group("Таблицы данных");

  t("Таблица навыков загружена, Внимательность на индексе 3", function() {
    if (typeof skills === "undefined") return "нет таблицы skills (не загружен data.js)";
    if (skills.length !== 18) return "навыков в таблице: " + skills.length + ", ожидал 18";
    if (skills[3].name !== "Внимательность") return "индекс 3 — " + skills[3].name + " (на него завязана пассивная внимательность)";
    if (skills[3].stat !== "wis") return "Внимательность должна считаться от МУД, а не от " + skills[3].stat;
    return true;
  });

  group("Хиты и кости хитов (AUD-4)");

  t("[R2] Воин 1 / Волшебник 1, ТЕЛ 10 → 10 + 4 = 14 (кость каждого класса)", function() {
    var c = fixture({ class: "Воин", level: 2, classes: [{ class: "Воин", level: 1 }, { class: "Волшебник", level: 1 }] });
    var hp = rulesMaxHPBase(c, 0);
    return hp === 14 ? true : "получено " + hp + ", ожидал 14";
  });

  t("[R2] Волшебник 1 / Воин 1: первый класс даёт полную к6 → 6 + 6 = 12", function() {
    var c = fixture({ class: "Волшебник", level: 2, classes: [{ class: "Волшебник", level: 1 }, { class: "Воин", level: 1 }] });
    var hp = rulesMaxHPBase(c, 0);
    return hp === 12 ? true : "получено " + hp + ", ожидал 12";
  });

  t("[R11] Холмовой дварф воин 3, ТЕЛ +2: 12 + 2×8 + 3 = 31", function() {
    var c = fixture({ class: "Воин", level: 3, race: "Холмовой дварф", classes: [{ class: "Воин", level: 3 }] });
    var hp = rulesMaxHPBase(c, 2);
    return hp === 31 ? true : "получено " + hp + ", ожидал 31";
  });

  t("[R10] Драконья кровь: воин 1 / чародей 2 → +2 ХП только за уровни чародея", function() {
    var base = fixture({ class: "Воин", level: 3, classes: [{ class: "Воин", level: 1 }, { class: "Чародей", level: 2, subclass: "" }] });
    var drac = fixture({ class: "Воин", level: 3, classes: [{ class: "Воин", level: 1 }, { class: "Чародей", level: 2, subclass: "Драконья кровь" }] });
    var d = rulesMaxHPBase(drac, 0) - rulesMaxHPBase(base, 0);
    return d === 2 ? true : "разница " + d + ", ожидал 2";
  });

  t("[R12] пул мультикласса по размерам: Воин 1 / Волшебник 2 → {10:1, 6:2}, «1к10 + 2к6»", function() {
    var c = fixture({ class: "Воин", level: 3, classes: [{ class: "Воин", level: 1 }, { class: "Волшебник", level: 2 }] });
    var pool = rulesHitDicePool(c);
    if (pool[10] !== 1 || pool[6] !== 2) return "пул " + JSON.stringify(pool);
    var lbl = rulesHitDiceLabel(c);
    return lbl === "1к10 + 2к6" ? true : "подпись «" + lbl + "»";
  });

  t("[R12] короткий отдых тратит сначала к10, потом к6; длинный возвращает крупные первыми", function() {
    var c = fixture({ class: "Воин", level: 3, classes: [{ class: "Воин", level: 1 }, { class: "Волшебник", level: 2 }] });
    c.combat.hpCurrent = 1; c.combat.hpMax = 30;
    if (rulesPickHitDice(c, 3).join(",") !== "10,6,6") return "порядок " + rulesPickHitDice(c, 3).join(",");
    rulesShortRest(c, { hitDiceSpent: 2, rolls: [5, 3] });
    if (c.combat.hpDiceSpentBy[10] !== 1 || c.combat.hpDiceSpentBy[6] !== 1) return "потрачено " + JSON.stringify(c.combat.hpDiceSpentBy);
    if (rulesPickHitDice(c, 5).join(",") !== "6") return "осталось " + rulesPickHitDice(c, 5).join(",");
    rulesLongRest(c);
    if (c.combat.hpDiceSpent !== 1 || c.combat.hpDiceSpentBy[10] || c.combat.hpDiceSpentBy[6] !== 1) return "после длинного " + JSON.stringify(c.combat.hpDiceSpentBy);
    return true;
  });

  t("[R12] старое сохранение: hpDiceSpent 2 без разбивки раскладывается с крупных", function() {
    var c = fixture({ class: "Воин", level: 3, classes: [{ class: "Воин", level: 1 }, { class: "Волшебник", level: 2 }] });
    c.combat.hpDiceSpent = 2;
    var by = rulesHitDiceSpentBy(c);
    return (by[10] === 1 && by[6] === 1) ? true : JSON.stringify(by);
  });

  t("[L19] кость хитов: бросок + ТЕЛ, минимум 0; hpBefore до потолка, лечение — реальное", function() {
    if (rulesHitDieHeal(1, -3) !== 0) return "1−3 → " + rulesHitDieHeal(1, -3);
    var c = fixture({ class: "Воин", level: 2 });
    c.stats.con = 14; c.combat.hpCurrent = 18; c.combat.hpMax = 20;
    var r = rulesSpendHitDice(c, [10], [6]);
    if (r.hpBefore !== 18) return "hpBefore " + r.hpBefore;
    if (r.hpHealed !== 2) return "лечение " + r.hpHealed + ", ожидал 2 (упор в максимум)";
    return c.combat.hpCurrent === 20 ? true : "ХП " + c.combat.hpCurrent;
  });

  group("AUD-6: 0 ХП, смерть и состояния");

  function dying(over) {
    var c = fixture(over);
    c.combat.hpCurrent = 0; c.combat.hpMax = 20;
    return c;
  }

  t("[L2] падение до 0: «без сознания», отметки чистые; остаток ≥ максимума — мгновенная смерть", function() {
    var c = fixture(); c.combat.hpCurrent = 5; c.combat.hpMax = 20;
    var r = rulesApplyDamage(c, 10);
    if (!r.droppedToZero || c.combat.hpCurrent !== 0) return "не упал до 0";
    if (c.conditions.indexOf("unconscious") === -1) return "нет «без сознания»";
    if (r.instantDeath || rulesIsDead(c)) return "ложная мгновенная смерть";
    var d = fixture(); d.combat.hpCurrent = 5; d.combat.hpMax = 20;
    var r2 = rulesApplyDamage(d, 25);
    if (!r2.instantDeath || !rulesIsDead(d)) return "5 ХП, урон 25, максимум 20 — должна быть смерть";
    var e = fixture(); e.combat.hpCurrent = 5; e.combat.hpMax = 20;
    if (rulesApplyDamage(e, 24).instantDeath) return "остаток 19 < 20 — смерти быть не должно";
    return true;
  });

  t("[L2] урон на 0 ХП: провал, крит — два, ≥ максимума — смерть; временные ХП поглощают", function() {
    var c = dying();
    var r = rulesApplyDamage(c, 3);
    if (r.failuresAdded !== 1 || _dsCount(c.deathSaves.failures) !== 1) return "обычный урон: провалов " + _dsCount(c.deathSaves.failures);
    rulesApplyDamage(c, 3, { crit: true });
    if (_dsCount(c.deathSaves.failures) !== 3 || !rulesIsDead(c)) return "крит должен добавить два провала и убить";
    var d = dying();
    if (!rulesApplyDamage(d, 20).instantDeath) return "урон 20 при максимуме 20 на 0 ХП — смерть";
    var t0 = dying(); t0.combat.hpTemp = 5;
    if (rulesApplyDamage(t0, 4).failuresAdded !== 0) return "урон ушёл во временные ХП, провала быть не должно";
    return true;
  });

  t("[L2] стабилизированный при уроне снова начинает бросать", function() {
    var c = dying({ deathSaves: { successes: [true, true, true], failures: [true, false, false] } });
    var r = rulesApplyDamage(c, 1);
    if (!r.wasStable) return "не отмечено снятие стабилизации";
    if (_dsCount(c.deathSaves.successes) !== 0 || _dsCount(c.deathSaves.failures) !== 1) return "отметки " + JSON.stringify(c.deathSaves);
    return true;
  });

  t("[L5] сопротивление, иммунитет, уязвимость по типу; окаменение — половина любого урона", function() {
    var c = fixture({ resistances: ["Огненный"], immunities: ["Яд"], vulnerabilities: ["Холод"] });
    if (rulesDamageAfterDefenses(c, 11, "Огненный") !== 5) return "сопротивление";
    if (rulesDamageAfterDefenses(c, 11, "Яд") !== 0) return "иммунитет";
    if (rulesDamageAfterDefenses(c, 11, "Холод") !== 22) return "уязвимость";
    if (rulesDamageAfterDefenses(c, 11, "") !== 11) return "без типа";
    var p = fixture({ conditions: ["petrified"] });
    if (rulesDamageAfterDefenses(p, 11, "") !== 5) return "окаменение без типа";
    var pv = fixture({ conditions: ["petrified"], vulnerabilities: ["Холод"] });
    if (rulesDamageAfterDefenses(pv, 23, "Холод") !== 22) return "окаменение + уязвимость: сначала ½ (11), затем ×2 = 22, получено " + rulesDamageAfterDefenses(pv, 23, "Холод");
    return true;
  });

  t("[L17, L36] спасбросок от смерти: 20 — 1 ХП и сброс; блок при ХП > 0, смерти, стабилизации", function() {
    var c = dying({ deathSaves: { successes: [true, false, false], failures: [true, true, false] }, conditions: ["unconscious"] });
    var r = rulesDeathSave(c, 20);
    if (r.outcome !== "revive" || c.combat.hpCurrent !== 1) return "нат. 20 не поднял";
    if (_dsCount(c.deathSaves.successes) || _dsCount(c.deathSaves.failures)) return "отметки не сброшены";
    if (c.conditions.indexOf("unconscious") !== -1) return "«без сознания» не снято";
    if (!rulesDeathSave(c, 5).blocked) return "бросок при 1 ХП не заблокирован";
    var d = dying({ deathSaves: { successes: [false, false, false], failures: [true, true, true] } });
    if (!rulesDeathSave(d, 15).blocked) return "бросок мёртвого не заблокирован";
    var s = dying({ deathSaves: { successes: [true, true, true], failures: [false, false, false] } });
    if (!rulesDeathSave(s, 15).blocked) return "бросок стабилизированного не заблокирован";
    var f = dying();
    rulesDeathSave(f, 1);
    return _dsCount(f.deathSaves.failures) === 2 ? true : "нат. 1 — два провала";
  });

  t("[L16] состояния: помеха, автопровал, штраф 2024; истощение 4 — ½ максимума, 6 — смерть", function() {
    var c = fixture({ conditions: ["poisoned", "restrained", "exhaustion_3"] });
    var a = rulesConditionRollMods(c, "attack");
    if (a.dis.join(",") !== "poisoned,restrained,exhaustion_3") return "атака: " + a.dis.join(",");
    if (rulesConditionRollMods(c, "save", "dex").dis.join(",") !== "restrained,exhaustion_3") return "спас ЛОВ";
    if (rulesConditionRollMods(fixture({ conditions: ["exhaustion_1"] }), "save", "wis").dis.length) return "истощение 1 не даёт помехи на спасброски";
    var u = fixture({ conditions: ["unconscious"] });
    if (rulesConditionRollMods(u, "save", "str").autoFail.join(",") !== "unconscious") return "автопровал СИЛ";
    if (rulesConditionRollMods(u, "save", "con").autoFail.length) return "автопровал ТЕЛ лишний";
    var e24 = fixture({ edition: "2024", conditions: ["exhaustion_2"] });
    var m = rulesConditionRollMods(e24, "check");
    if (m.penalty !== -4 || m.dis.length) return "2024: штраф " + m.penalty;
    var h = fixture({ conditions: ["exhaustion_4"] }); h.combat.hpMax = 21;
    if (rulesEffectiveHpMax(h) !== 10) return "½ максимума: " + rulesEffectiveHpMax(h);
    h.edition = "2024";
    if (rulesEffectiveHpMax(h) !== 21) return "2024 не режет максимум";
    if (!rulesIsDead(fixture({ conditions: ["exhaustion_6"] }))) return "истощение 6 — смерть";
    return true;
  });

  t("[L16] скорость: схвачен — 0, истощение 2 — ½, 5 — 0, 2024 — −5 фт за степень", function() {
    if (rulesEffectiveSpeed(fixture({ conditions: ["grappled"] }), 30).speed !== 0) return "схвачен";
    if (rulesEffectiveSpeed(fixture({ conditions: ["exhaustion_2"] }), 30).speed !== 15) return "истощение 2";
    if (rulesEffectiveSpeed(fixture({ conditions: ["exhaustion_5"] }), 30).speed !== 0) return "истощение 5";
    if (rulesEffectiveSpeed(fixture({ edition: "2024", conditions: ["exhaustion_3"] }), 30).speed !== 15) return "2024";
    if (rulesEffectiveSpeed(fixture({ conditions: ["stunned"] }), 30).speed !== 0) return "ошеломлён 2014 — 0";
    if (rulesEffectiveSpeed(fixture({ edition: "2024", conditions: ["stunned"] }), 30).speed !== 30) return "ошеломлён 2024 двигается";
    return rulesEffectiveSpeed(fixture(), 30).speed === 30 ? true : "без состояний";
  });

  t("[L16] длинный отдых при истощении 5 → 4: ХП не выше половины максимума", function() {
    var c = fixture({ conditions: ["exhaustion_5"] }); c.combat.hpCurrent = 3; c.combat.hpMax = 20;
    rulesLongRest(c);
    return c.combat.hpCurrent === 10 ? true : "ХП " + c.combat.hpCurrent;
  });

  // ── AUD-8: КД и бой ──
  t("[R1] латы при ЛОВ 8 — КД 18, отрицательная ЛОВ не учитывается", function() {
    var c = fixture({ stats: { str: 15, dex: 8, con: 10, int: 10, wis: 10, cha: 10 } });
    c.combat.armorId = "plate";
    return rulesAC(c).ac === 18 ? true : "КД " + rulesAC(c).ac;
  });

  t("[R9] стиль «Защита» +1 в доспехе, без доспеха — нет", function() {
    var c = fixture({ class: "Воин", classChoices: { "Воин": { "fighting-style": "defense" } } });
    c.combat.armorId = "chain_mail";
    if (rulesAC(c).ac !== 17) return "в кольчуге " + rulesAC(c).ac;
    c.combat.armorId = "none";
    if (rulesAC(c).ac !== 10) return "без доспеха " + rulesAC(c).ac;
    var g = fixture({ edition: "2024", class: "Воин", feats: [{ id: "f24-style_defense" }] });
    g.combat.armorId = "chain_mail";
    return rulesAC(g).ac === 17 ? true : "2024: " + rulesAC(g).ac;
  });

  t("[R10/R16] драконья устойчивость 13+ЛОВ; способы КД не складываются — лучший", function() {
    var c = fixture({ class: "Чародей", subclass: "Драконья кровь", stats: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 } });
    if (rulesAC(c).ac !== 15) return "драконья " + rulesAC(c).ac;
    c.effects = ["mage_armor"];
    if (rulesAC(c).ac !== 15) return "с доспехом мага " + rulesAC(c).ac;
    var m = fixture({ class: "Монах", stats: { str: 10, dex: 14, con: 10, int: 10, wis: 10, cha: 10 }, effects: ["mage_armor"] });
    return rulesAC(m).ac === 15 ? true : "монах МУД 10 + доспех мага: " + rulesAC(m).ac + ", ожидал 15";
  });

  t("[R13] «Внимательный» +5 к пассивной Внимательности (2014)", function() {
    var c = fixture({ feats: [{ id: "observant" }] });
    return rulesPassivePerception(c, 1, false) === 15 ? true : "пассивная " + rulesPassivePerception(c, 1, false);
  });

  t("[R15/L33] «Выдающийся атлет»: ⌈БМ/2⌉ к СИЛ/ЛОВ/ТЕЛ без владения, не к ИНТ", function() {
    var c = fixture({ class: "Воин", subclass: "Чемпион", level: 7 });
    if (rulesSkillBonus(c, 2, 7, false) !== 2) return "Атлетика " + rulesSkillBonus(c, 2, 7, false);
    if (rulesSkillBonus(c, 5, 7, false) !== 0) return "Магия (ИНТ) " + rulesSkillBonus(c, 5, 7, false);
    if (getInitiativeMod(c, 7) !== 2) return "инициатива " + getInitiativeMod(c, 7);
    return rulesUntrainedCheckBonus(c, 7, "con") === 2 ? true : "проверка ТЕЛ";
  });

  t("[L10/L21] оружие: фехтовальное берёт лучшую из СИЛ/ЛОВ, магический бонус к атаке и урону", function() {
    var c = fixture({ stats: { str: 16, dex: 12, con: 10, int: 10, wis: 10, cha: 10 } });
    var w = rulesWeaponMods(c, { stat: "dex", notes: "Фехтовальное", proficient: true, magicBonus: 1 }, 1);
    if (w.statKey !== "str") return "характеристика " + w.statKey;
    return (w.attack === 6 && w.damageMod === 4) ? true : "атака " + w.attack + ", урон " + w.damageMod;
  });

  t("[L20] вторая рука без стиля: отрицательный модификатор остаётся", function() {
    if (rulesOffhandDamageMod(3, false) !== 0) return "+3 без стиля";
    if (rulesOffhandDamageMod(-1, false) !== -1) return "−1 без стиля";
    return rulesOffhandDamageMod(3, true) === 3 ? true : "+3 со стилем";
  });

  t("[L34] тяжёлый доспех при СИЛ ниже требования — скорость −10 фт, помеха Скрытности", function() {
    var c = fixture({ stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 } });
    c.combat.armorId = "plate";
    if (rulesEffectiveSpeed(c, 30).speed !== 20) return "скорость " + rulesEffectiveSpeed(c, 30).speed;
    if (!rulesArmorStealthDisadv(c)) return "нет помехи Скрытности";
    var d = fixture({ race: "Холмовой дварф" }); d.combat.armorId = "plate";
    if (rulesEffectiveSpeed(d, 25).speed !== 25) return "дварф замедлен: " + rulesEffectiveSpeed(d, 25).speed;
    c.stats.str = 15;
    return rulesEffectiveSpeed(c, 30).speed === 30 ? true : "СИЛ 15: " + rulesEffectiveSpeed(c, 30).speed;
  });

  t("[R15] Бард 2 / Чемпион 7: бонусы не складываются — берётся больший", function() {
    var c = fixture({ class: "Воин", level: 9, classes: [{ class: "Воин", level: 7, subclass: "Чемпион" }, { class: "Бард", level: 2, subclass: "" }] });
    if (rulesSkillBonus(c, 2, 9, false) !== 2) return "Атлетика " + rulesSkillBonus(c, 2, 9, false) + ", ожидал 2 (⌈4/2⌉)";
    return rulesSkillBonus(c, 5, 9, false) === 2 ? true : "Магия " + rulesSkillBonus(c, 5, 9, false) + ", ожидал 2 (⌊4/2⌋)";
  });
}

if (typeof window !== "undefined") window.rulesCases = rulesCases;
