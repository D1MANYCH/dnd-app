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

  group("Таблицы данных");

  t("Таблица навыков загружена, Внимательность на индексе 3", function() {
    if (typeof skills === "undefined") return "нет таблицы skills (не загружен data.js)";
    if (skills.length !== 18) return "навыков в таблице: " + skills.length + ", ожидал 18";
    if (skills[3].name !== "Внимательность") return "индекс 3 — " + skills[3].name + " (на него завязана пассивная внимательность)";
    if (skills[3].stat !== "wis") return "Внимательность должна считаться от МУД, а не от " + skills[3].stat;
    return true;
  });
}

if (typeof window !== "undefined") window.rulesCases = rulesCases;
