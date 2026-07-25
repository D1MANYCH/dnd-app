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
