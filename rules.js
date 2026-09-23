// ============================================================
// rules.js — Чистые расчёты правил D&D 5e: без DOM, без сохранения,
// без бросков. Всё, что зависит только от аргументов и таблиц данных.
// Покрыто проверками: tests/rules-cases.js (браузер — tests.html, node — tests/headless.js)
// ============================================================

// ── Характеристики и мастерство ─────────────────────────────
function getProficiencyBonus(level) {
if (level >= 17) return 6;
if (level >= 13) return 5;
if (level >= 9) return 4;
if (level >= 5) return 3;
return 2;
}
function getMod(val) { return Math.floor((val - 10) / 2); }
function formatMod(val) { return val >= 0 ? "+" + val : "" + val; }

// 🔧 ИСПРАВЛЕНИЕ: Правильный расчёт ХП по правилам D&D 5e
function calculateMaxHP(level, conMod, hitDie) {
if (level < 1) return 0;
const level1HP = hitDie + conMod;
const avgPerLevel = Math.floor(hitDie / 2) + 1;
const additionalHP = (level - 1) * (avgPerLevel + conMod);
return level1HP + additionalHP;
}

// AUD-4: классы для расчёта ХП и костей — char.classes, иначе legacy char.class/level
function _hpClassEntries(char) {
  var ed = (typeof edData === "function") ? edData(char) : null;
  var list = (char.classes && char.classes.length) ? char.classes
    : [{ class: char.class, level: char.level || 1, hitDie: ((char.combat && char.combat.hpDice) || "").match(/[кK](\d+)/)?.[1] }];
  return list.map(function(c) {
    var die = (ed && ed.CLASS_HIT_DICE && ed.CLASS_HIT_DICE[c.class]) || parseInt(c.hitDie, 10) || 8;
    return { class: c.class, level: parseInt(c.level, 10) || 0, subclass: c.subclass || "", hitDie: die };
  });
}

// AUD-4 (R2, R10, R11): авто-база максимума ХП без бонусов черт и кастов.
// PHB стр.15/163: первый класс — полная кость на 1 уровне, дальше среднее + ТЕЛ
// по кости каждого класса. Холмовой дварф: +1 за уровень (PHB стр.20).
// «Драконья устойчивость»: +1 за уровень чародея (PHB стр.102).
function rulesMaxHPBase(char, conMod) {
  var entries = _hpClassEntries(char);
  var total = 0, level = 0;
  entries.forEach(function(c, i) {
    if (c.level < 1) return;
    level += c.level;
    total += (i === 0) ? calculateMaxHP(c.level, conMod, c.hitDie) : c.level * (Math.floor(c.hitDie / 2) + 1 + conMod);
    if (c.class === "Чародей" && c.subclass === "Драконья кровь") total += c.level;
  });
  if (char.race === "Холмовой дварф") total += level;
  return total;
}

// AUD-4 (R12): пул костей хитов по размеру {10:1, 6:2} (PHB стр.163)
function rulesHitDicePool(char) {
  var pool = {};
  _hpClassEntries(char).forEach(function(c) {
    if (c.level > 0) pool[c.hitDie] = (pool[c.hitDie] || 0) + c.level;
  });
  return pool;
}

function _hdSizesDesc(pool) {
  return Object.keys(pool).map(Number).sort(function(a, b) { return b - a; });
}

// Потраченные кости по размеру. Нет разбивки или она расходится с hpDiceSpent
// (старые сохранения) — раскладываем общее число, начиная с крупных костей.
function rulesHitDiceSpentBy(char) {
  var pool = rulesHitDicePool(char);
  var by = char.combat.hpDiceSpentBy;
  var total = Math.max(0, parseInt(char.combat.hpDiceSpent, 10) || 0);
  var out = {}, sum = 0;
  if (by && typeof by === "object") {
    _hdSizesDesc(pool).forEach(function(d) {
      var n = Math.min(pool[d], Math.max(0, parseInt(by[d], 10) || 0));
      if (n) { out[d] = n; sum += n; }
    });
  }
  if (sum !== total) {
    out = {}; sum = 0;
    _hdSizesDesc(pool).forEach(function(d) {
      var n = Math.min(pool[d], total - sum);
      if (n > 0) { out[d] = n; sum += n; }
    });
  }
  char.combat.hpDiceSpentBy = out;
  char.combat.hpDiceSpent = sum;
  return out;
}

// Подпись пула: «1к8» для одного класса, «1к10 + 2к6» для мультикласса
function rulesHitDiceLabel(char) {
  var pool = rulesHitDicePool(char);
  var sizes = _hdSizesDesc(pool);
  if (sizes.length <= 1) return "1к" + (sizes[0] || 8);
  return sizes.map(function(d) { return pool[d] + "к" + d; }).join(" + ");
}

// Какие кости тратятся следующими (крупные первыми), не больше доступных
function rulesPickHitDice(char, count) {
  var pool = rulesHitDicePool(char);
  var by = rulesHitDiceSpentBy(char);
  var picked = [];
  _hdSizesDesc(pool).forEach(function(d) {
    var left = pool[d] - (by[d] || 0);
    while (left > 0 && picked.length < count) { picked.push(d); left--; }
  });
  return picked;
}

// AUD-4 (L19): одна формула кости хитов — бросок + ТЕЛ, не меньше 0 (PHB стр.186)
function rulesHitDieHeal(roll, conMod) {
  return Math.max(0, roll + conMod);
}

// Тратит кости: rolls[i] — бросок кости dice[i] (из rulesPickHitDice).
// Мутирует ХП и потраченные кости, возвращает сводку.
function rulesSpendHitDice(char, dice, rolls) {
  var conMod = getMod(char.stats.con);
  var by = rulesHitDiceSpentBy(char);
  var hpBefore = parseInt(char.combat.hpCurrent, 10) || 0;
  var hpHealed = 0, rollLog = [];
  dice.forEach(function(d, i) {
    var r = rolls[i] || 0;
    var t = rulesHitDieHeal(r, conMod);
    hpHealed += t;
    rollLog.push(r + ((conMod >= 0 ? "+" : "") + conMod) + "=" + t);
    by[d] = (by[d] || 0) + 1;
  });
  char.combat.hpDiceSpentBy = by;
  char.combat.hpDiceSpent = (char.combat.hpDiceSpent || 0) + dice.length;
  char.combat.hpCurrent = Math.min(hpBefore + hpHealed, parseInt(char.combat.hpMax, 10) || 0);
  return { hpBefore: hpBefore, hpAfter: char.combat.hpCurrent, hpHealed: char.combat.hpCurrent - hpBefore, rollLog: rollLog, conMod: conMod };
}

// ── Классы и мультикласс ────────────────────────────────────
// Мультикласс живёт в char.classes[]; char.class и char.level — legacy-поля,
// где class всегда ПЕРВЫЙ класс, а level — СУММА уровней всех классов.
// Умения, подклассы и заряды зависят от уровня класса, а не от суммарного.

/** Уровень конкретного класса персонажа (0, если класса нет) */
function charClassLevel(char, className) {
  if (!char || !className) return 0;
  if (char.classes && char.classes.length > 0) {
    var entry = char.classes.find(function(c) { return c && c.class === className; });
    return entry ? (entry.level || 0) : 0;
  }
  return char.class === className ? (char.level || 0) : 0;
}

/** Есть ли у персонажа такой класс — без оглядки на его уровень */
function charHasClass(char, className) {
  if (!char || !className) return false;
  if (char.classes && char.classes.length > 0) {
    return char.classes.some(function(c) { return c && c.class === className; });
  }
  return char.class === className;
}

/** Уровень класса с оглядкой на legacy-вызов: у одноклассового переданный
 *  level и есть уровень класса (так зовут тесты и старый код листа). */
function charClassLevelOr(char, className, level) {
  if (!char) return 0;
  if (char.classes && char.classes.length > 0) return charClassLevel(char, className);
  if (char.class !== className) return 0;
  return level || char.level || 0;
}

/** Заработанные АСИ по каждому классу: [{cls, level}].
 *  Расписание ASI_LEVELS отсчитывается от уровня КЛАССА (PHB, «Мультиклассирование»). */
function charAsiSlots(char) {
  var out = [];
  if (!char) return out;
  getCharClassPairs(char).forEach(function(p) {
    var lvl = charClassLevel(char, p.cls);
    var sched = edData(char).ASI_LEVELS[p.cls] || edData(char).ASI_LEVELS["default"] || [];
    sched.forEach(function(l) {
      if (l <= lvl) out.push({ cls: p.cls, level: l });
    });
  });
  return out;
}

/** E24-8: уровни эпического дара (2024, 19 ур.) — фича «Эпический дар» в таблице класса.
 *  Отдельно от charAsiSlots: ASI_LEVELS 19 не содержит, а выбор на этом уровне такой же. */
function charEpicSlots(char) {
  var out = [];
  if (!char) return out;
  var CF = edData(char).CLASS_FEATURES;
  getCharClassPairs(char).forEach(function(p) {
    var lvl = charClassLevel(char, p.cls);
    var tbl = CF[p.cls];
    if (!tbl) return;
    for (var l = 1; l <= lvl; l++) {
      if (Array.isArray(tbl[l]) && tbl[l].some(function(f){ return f && f.name === "Эпический дар"; })) {
        out.push({ cls: p.cls, level: l });
      }
    }
  });
  return out;
}

/** Классы, доросшие до выбора подкласса, у которых он не выбран: [{cls, at}] */
function charSubclassPending(char) {
  var out = [];
  if (!char) return out;
  getCharClassPairs(char).forEach(function(p) {
    var at = edData(char).SUBCLASS_LEVEL[p.cls];
    if (!at || p.sub) return;
    if (charClassLevel(char, p.cls) >= at) out.push({ cls: p.cls, at: at });
  });
  return out;
}

/** Порог опыта до следующего уровня (PHB 2014, гл. 1) → {level, need, have, canLevel}.
 *  Показывать строку опыта или нет — решает UI по char.exp, здесь расчёт чистый. */
function charXpNext(char) {
  var have = (char && char.exp) || 0;
  var next = ((char && char.level) || 1) + 1;
  if (typeof XP_THRESHOLDS === "undefined" || next > 20) {
    return { level: null, need: 0, have: have, left: 0, canLevel: false };
  }
  var need = XP_THRESHOLDS[next] || 0;
  return { level: next, need: need, have: have, left: Math.max(0, need - have), canLevel: have >= need };
}

// ── Навыки, спасброски, инициатива ──────────────────────────
function rulesJackOfAllTrades(char, level) {
  return charClassLevelOr(char, "Бард", level) >= 2;
}

/** Подкласс конкретного класса персонажа ("" — нет) */
function charClassSubclass(char, className) {
  if (!char || !className) return "";
  if (char.classes && char.classes.length > 0) {
    var entry = char.classes.find(function(c) { return c && c.class === className; });
    return (entry && entry.subclass) || "";
  }
  return char.class === className ? (char.subclass || "") : "";
}

function rulesHasFeat(char, featId) {
  return !!(char && Array.isArray(char.feats) && char.feats.some(function(f) { return f && (f.id === featId || f === featId); }));
}

/** AUD-8: выбран ли боевой стиль у любого класса (classChoices[класс]["fighting-style"]) */
function rulesHasFightingStyle(char, styleId) {
  if (!char) return false;
  // 2024: боевой стиль — черта «f24-style_<id>» (PHB 2024 гл.5)
  if (rulesHasFeat(char, "f24-style_" + styleId)) return true;
  if (!char.classChoices) return false;
  return Object.keys(char.classChoices).some(function(cls) {
    var cc = char.classChoices[cls];
    return !!(cc && cc["fighting-style"] === styleId && charHasClass(char, cls));
  });
}

/** AUD-8 (R10): «Драконья устойчивость» чародея «Драконья кровь» (PHB 2014 стр.102) */
function rulesHasDraconicResilience(char) {
  return !!char && char.edition !== "2024" && charClassLevel(char, "Чародей") >= 1 && charClassSubclass(char, "Чародей") === "Драконья кровь";
}

/** AUD-8 (R15): «Выдающийся атлет» Чемпиона 7 ур. (PHB 2014 стр.73) */
function rulesRemarkableAthlete(char) {
  return !!char && char.edition !== "2024" && charClassLevel(char, "Воин") >= 7 && charClassSubclass(char, "Воин") === "Чемпион";
}

/** AUD-8 (R15, L33): бонус к проверке без владения — пол-БМ «Мастера на все руки» или
 *  пол-БМ вверх «Выдающегося атлета» для СИЛ/ЛОВ/ТЕЛ; не складываются, берётся больший. */
function rulesUntrainedCheckBonus(char, level, stat) {
  var pb = getProficiencyBonus(level || (char && char.level) || 1);
  var b = rulesJackOfAllTrades(char, level) ? Math.floor(pb / 2) : 0;
  if ((stat === "str" || stat === "dex" || stat === "con") && rulesRemarkableAthlete(char)) b = Math.max(b, Math.ceil(pb / 2));
  return b;
}

function rulesHasExpertise(char, skillIndex) {
  return !!(char && Array.isArray(char.expertiseSkills) && char.expertiseSkills.indexOf(skillIndex) !== -1);
}

// Единый расчёт инициативы для листа и трекера боя: ЛОВ + пол-БМ Барда с 2 ур.
// + надбавки от черт (char.bonuses.initiative, напр. «Бдительный» +5).
function getInitiativeMod(char, level) {
  if (!char) return 0;
  var lvl = level || char.level || 1;
  var mod = char.stats ? getMod(char.stats.dex) : 0;
  // Пол-БМ Барда: порог 2 — по уровню Барда, сам БМ — по суммарному уровню (PHB)
  // AUD-8 (R15): у Чемпиона 7 ур. — пол-БМ вверх («Выдающийся атлет»), не складывается
  mod += rulesUntrainedCheckBonus(char, lvl, "dex");
  if (char.bonuses && char.bonuses.initiative) mod += char.bonuses.initiative;
  // E24-3: «Бдительный» 2024 — БМ к инициативе (char.bonuses.initiativeProf)
  if (char.bonuses && char.bonuses.initiativeProf) mod += getProficiencyBonus(lvl);
  return mod;
}

function rulesSaveBonus(char, key, level, isProficient) {
  var bonus = getMod(char.stats[key]);
  if (isProficient) bonus += getProficiencyBonus(level);
  return bonus;
}

function rulesSkillBonus(char, skillIndex, level, isProficient) {
  var list = (typeof skills !== "undefined") ? skills : [];
  var skill = list[skillIndex];
  if (!skill) return 0;
  var pb = getProficiencyBonus(level);
  var bonus = getMod(char.stats[skill.stat]);
  if (isProficient) {
    bonus += rulesHasExpertise(char, skillIndex) ? pb * 2 : pb;
  } else {
    bonus += rulesUntrainedCheckBonus(char, level, skill.stat);
  }
  return bonus;
}

// AUD-8 (R13): черта «Внимательный» (2014) — +5 к пассивной Внимательности (PHB стр.168)
function rulesPassivePerception(char, level, isProficient) {
  return 10 + rulesSkillBonus(char, 3, level, isProficient) + (char && char.edition !== "2024" && rulesHasFeat(char, "observant") ? 5 : 0);
}

function rulesSpellStats(char, level) {
  var stat = (char && char.spells && char.spells.stat) || "";
  var statMod = 0;
  if (stat === "ИНТ") statMod = getMod(char.stats.int);
  else if (stat === "МУД") statMod = getMod(char.stats.wis);
  else if (stat === "ХАР") statMod = getMod(char.stats.cha);
  var pb = getProficiencyBonus(level);
  return { stat: stat, mod: statMod, dc: 8 + pb + statMod, attack: pb + statMod };
}

// AUD-5 (R17): у мультикласса своя заклинательная характеристика у каждого класса
// (PHB стр. 164). Мистики (воин/плут) берут список и ИНТ волшебника.
var CLASS_SPELL_STAT = {
  "Волшебник": "ИНТ", "Жрец": "МУД", "Друид": "МУД", "Бард": "ХАР", "Паладин": "ХАР",
  "Следопыт": "МУД", "Чародей": "ХАР", "Колдун": "ХАР", "Воин": "ИНТ", "Плут": "ИНТ"
};
var CLASS_SPELL_LIST_KEY = {
  "Волшебник": "wizard", "Жрец": "cleric", "Друид": "druid", "Бард": "bard", "Паладин": "paladin",
  "Следопыт": "ranger", "Чародей": "sorcerer", "Колдун": "warlock", "Воин": "wizard", "Плут": "wizard"
};
function _spellStatMod(char, stat) {
  if (stat === "ИНТ") return getMod(char.stats.int);
  if (stat === "МУД") return getMod(char.stats.wis);
  if (stat === "ХАР") return getMod(char.stats.cha);
  return 0;
}
/** Строки {cls, stat, mod, dc, attack} по классам-заклинателям персонажа; со spell —
 *  только классы, в чьём списке оно есть (spell.classes без массива — все). */
function rulesSpellStatsByClass(char, level, spell) {
  var out = [];
  if (!char || !char.stats) return out;
  var pb = getProficiencyBonus(level || char.level || 1);
  var spellCls = (spell && Array.isArray(spell.classes)) ? spell.classes : null;
  charCasterLevel(char).casters.forEach(function(c) {
    var stat = CLASS_SPELL_STAT[c.cls];
    if (!stat) return;
    if (spellCls && spellCls.indexOf(CLASS_SPELL_LIST_KEY[c.cls]) === -1 && spellCls.indexOf("both") === -1) return;
    var mod = _spellStatMod(char, stat);
    out.push({ cls: c.cls, stat: stat, mod: mod, dc: 8 + pb + mod, attack: pb + mod });
  });
  return out;
}

// ── Оружие ──────────────────────────────────────────────────
// AUD-8 (L10, L21): модификаторы атаки и урона оружия. Фехтовальное — лучшая из
// СИЛ и ЛОВ (PHB стр.147), магический бонус (+1…+3) — и к атаке, и к урону (DMG).
function rulesWeaponMods(char, weapon, level) {
  var stats = (char && char.stats) || {};
  var statKey = (weapon && weapon.stat) || "str";
  if (weapon && String(weapon.notes || "").toLowerCase().indexOf("фехтовальн") !== -1) {
    statKey = getMod(stats.dex || 10) > getMod(stats.str || 10) ? "dex" : "str";
  }
  var statMod = getMod(stats[statKey] || 10);
  var magic = parseInt(weapon && weapon.magicBonus, 10) || 0;
  var pb = getProficiencyBonus(level || (char && char.level) || 1);
  return { statKey: statKey, statMod: statMod, magic: magic,
    attack: statMod + (weapon && weapon.proficient ? pb : 0) + magic,
    damageMod: statMod + magic };
}

// AUD-8 (L20): модификатор урона атаки второй рукой — без стиля «Бой двумя оружиями»
// положительный модификатор не добавляется, отрицательный остаётся (PHB стр.195).
function rulesOffhandDamageMod(statMod, hasStyle) {
  return hasStyle ? statMod : Math.min(0, statMod);
}

// ── Броня ───────────────────────────────────────────────────
// FIN-3: чистый расчёт помех брони по книге PHB 2014.
// slowed — СИЛ ниже strReq доспеха → скорость −10 фт (только тяжёлые с «Сил 13/15»).
// stealthDisadv — помеха на проверки Ловкости (Скрытность). char.combat.speed
// НЕ трогаем: помеха ситуативна, показываем предупреждением, а не автоправкой.
function armorPenalties(char, preset) {
  if (!preset || preset.id === "none" || preset.id === "custom") {
    return { slowed: false, stealthDisadv: false };
  }
  var strScore = (char && char.stats && typeof char.stats.str === "number") ? char.stats.str : 10;
  var slowed = !!(preset.strReq && strScore < preset.strReq);
  // AUD-8: дварфа тяжёлый доспех не замедляет (PHB 2014 стр.20)
  if (slowed && char && char.edition !== "2024" && String(char.race || "").toLowerCase().indexOf("дварф") !== -1) slowed = false;
  return { slowed: slowed, stealthDisadv: !!preset.stealthDisadv };
}

// Режимы: "preset" — доспех из ARMOR_PRESETS, "manual" — КД введён вручную,
// "unarmored" — без доспехов (варвар/монах/доспех мага/база 10+ЛОВ).
function rulesAC(char) {
  var dexMod = getMod(char.stats.dex);
  var conMod = getMod(char.stats.con);
  var wisMod = getMod(char.stats.wis);
  var armorId = char.combat && char.combat.armorId;
  var hasShieldSelected = char.combat && char.combat.hasShield;

  if (armorId && armorId !== "none" && armorId !== "custom" && typeof ARMOR_PRESETS !== "undefined") {
    var preset = ARMOR_PRESETS.find(function(a) { return a.id === armorId; });
    if (preset) {
      // AUD-8 (R1): тяжёлый доспех не учитывает ЛОВ совсем — ни плюс, ни минус (PHB стр.145)
      var dexBonus = preset.type === "heavy" ? 0 : (preset.dexCap >= 99 ? dexMod : Math.min(dexMod, preset.dexCap));
      var pAc = preset.baseAC + dexBonus;
      var pFormula = [preset.name + " (" + preset.baseAC + ")"];
      if (dexBonus !== 0) pFormula.push((dexBonus > 0 ? "+" : "") + dexBonus + " (ЛОВ)");
      var pMods = [];
      if (hasShieldSelected) { pAc += 2; pFormula.push("+2 (щит)"); pMods.push({name:"Щит",value:2,type:"active"}); }
      // AUD-8 (R9): боевой стиль «Защита» — +1 КД в доспехе (PHB стр.72)
      if (rulesHasFightingStyle(char, "defense")) { pAc += 1; pFormula.push("+1 (Защита)"); pMods.push({name:"Защита",value:1,type:"active"}); }
      // Apply magic effects on top
      if (char.effects) {
        char.effects.forEach(function(effectId) {
          var effect = EFFECTS_DATA.find(function(e) { return e.id === effectId; });
          if (effect && effect.acBonus && !["mage_armor","monk_unarmored","barbarian_unarmored"].includes(effectId)) {
            pAc += effect.acBonus;
            pFormula.push((effect.acBonus > 0 ? "+" : "") + effect.acBonus + " (" + effect.name + ")");
            pMods.push({name: effect.name, value: effect.acBonus, type: effect.acBonus > 0 ? "active" : "negative"});
          }
        });
      }
      // FIN-3: бейджи помех брони (Скрытность / скорость по СИЛ) — не влияют на КД,
      // информируют игрока. Тип "note" рендерится с иконкой ⚠️ без числа.
      var pen = armorPenalties(char, preset);
      if (pen.stealthDisadv) pMods.push({name:"Помеха на Скрытность", type:"note"});
      if (pen.slowed) pMods.push({name:"СИЛ < " + preset.strReq + ": скорость −10 фт", type:"note"});
      return { mode: "preset", ac: pAc, formula: pFormula, modifiers: pMods };
    }
  }

  // ── Режим "вручную" — пользователь ввёл КД сам, не пересчитываем ──────────
  if (armorId === "custom") {
    var manualAc = (char.combat && typeof char.combat.ac === "number") ? char.combat.ac : 10;
    return { mode: "manual", ac: manualAc, formula: ["Вручную: " + manualAc], modifiers: [] };
  }

  // ── Без брони (armorId === "none"): КД 10+ЛОВ, плюс «без доспехов» спец-фичи
  var ac = 10;
  var formulaParts = ["10 (база)"];
  var modifiers = [];
  var hasMageArmor = char.effects && char.effects.includes('mage_armor');
  var hasMonkUnarmored = char.effects && char.effects.includes('monk_unarmored');
  var hasBarbarianUnarmored = char.effects && char.effects.includes('barbarian_unarmored');
  // PHB 2014 стр. 164: «Защиту без доспехов» нельзя получить второй раз от другого
  // класса — работает версия того класса, который дал её ПЕРВЫМ (порядок в classes[]).
  var udClass = "";
  if (char.classes && char.classes.length) {
    for (var udI = 0; udI < char.classes.length; udI++) {
      var udName = char.classes[udI] && char.classes[udI].class;
      if (udName === "Варвар" || udName === "Монах") { udClass = udName; break; }
    }
  } else if (char.class === "Варвар" || char.class === "Монах") {
    udClass = char.class;
  }
  var isBarbarian = udClass === "Варвар";
  // Варвар щит разрешает явно (стр. 48), монаху щит отключает умение целиком (стр. 77).
  var isMonk = udClass === "Монах" && !hasShieldSelected;
  if (hasMonkUnarmored && hasShieldSelected) hasMonkUnarmored = false;
  // AUD-8 (R10, R16): способы расчёта КД не складываются — берём лучший из доступных
  // (PHB стр.14). «Драконья устойчивость» чародея: 13 + ЛОВ (стр.102).
  var sgn = function(v) { return (v >= 0 ? "+" : "") + v; };
  var ways = [{ ac: 10 + dexMod, formula: ["Без брони — КД 10", sgn(dexMod) + " (ЛОВ)"], mod: null }];
  if (hasBarbarianUnarmored || isBarbarian) {
    ways.push({ ac: 10 + dexMod + conMod, formula: ["10 (база)", sgn(dexMod) + " (ЛОВ)", sgn(conMod) + " (ТЕЛ)"], mod: "Без доспехов варвара" });
  }
  if (hasMonkUnarmored || isMonk) {
    ways.push({ ac: 10 + dexMod + wisMod, formula: ["10 (база)", sgn(dexMod) + " (ЛОВ)", sgn(wisMod) + " (МУД)"], mod: "Без доспехов монаха" });
  }
  if (rulesHasDraconicResilience(char)) {
    ways.push({ ac: 13 + dexMod, formula: ["13 (драконья чешуя)", sgn(dexMod) + " (ЛОВ)"], mod: "Драконья устойчивость" });
  }
  if (hasMageArmor) {
    ways.push({ ac: 13 + dexMod, formula: ["13 (магия)", sgn(dexMod) + " (ЛОВ)"], mod: "Доспех мага" });
  }
  var best = ways[0];
  ways.forEach(function(w) { if (w.ac > best.ac) best = w; });
  ac = best.ac;
  formulaParts = best.formula;
  if (best.mod) modifiers.push({name: best.mod, value: ac - 10, type: "active"});
  if (hasShieldSelected) {
    ac += 2;
    formulaParts.push("+2 (щит)");
    modifiers.push({name: "Щит", value: 2, type: "active"});
  }
  if (char.effects) {
    char.effects.forEach(function(effectId) {
      var effect = EFFECTS_DATA.find(function(e) { return e.id === effectId; });
      // CAST-1: базово-формульные эффекты (13+ЛОВ и т.п.) уже учтены веткой выше —
      // без исключения mage_armor давал 13+ЛОВ+3 (двойной учёт, как в бронной ветке)
      if (effect && effect.acBonus && !["mage_armor","monk_unarmored","barbarian_unarmored"].includes(effectId)) {
        ac += effect.acBonus;
        if (effect.acBonus > 0) {
          formulaParts.push("+" + effect.acBonus + " (" + effect.name + ")");
          modifiers.push({name: effect.name, value: effect.acBonus, type: "active"});
        } else {
          formulaParts.push(effect.acBonus + " (" + effect.name + ")");
          modifiers.push({name: effect.name, value: effect.acBonus, type: "negative"});
        }
      }
    });
  }
  return { mode: "unarmored", ac: ac, formula: formulaParts, modifiers: modifiers };
}

// ── Ячейки заклинаний ───────────────────────────────────────
/** Уровень заклинателя (PHB стр. 164): полные классы входят целиком, паладин и
 *  следопыт — половиной, мистический рыцарь и ловкач — третью. Пакт-магия
 *  Колдуна в общий пул не входит и возвращается отдельным полем.
 *  ВАЖНО: `level` осмыслен, только когда «Использование заклинаний» есть у ДВУХ
 *  и более классов — у одноклассового паладина 5 ур. он даёт 2, а по книге такой
 *  персонаж считается по таблице своего класса. Кому нужен признак «считать по
 *  общему пулу» — смотреть casters без типа "pact", а не level.
 *  LVL-2: расчёт вынут из getMulticlassSpellSlots — его же читает строка
 *  «Ячейки заклинаний» на экране «Развитие». */
function charCasterLevel(char) {
  var out = { level: 0, casters: [], pact: null };
  if (!char) return out;
  var list = (char.classes && char.classes.length)
    ? char.classes
    : (char.class ? [{ class: char.class, level: char.level || 0, subclass: char.subclass || "" }] : []);
  list.forEach(function(entry) {
    if (!entry || !entry.class) return;
    var ct = edData(char).CASTER_TYPE[entry.class] || "none";
    var lv = entry.level || 0;
    if (ct === "third") {
      // Воин и Плут — заклинатели только с подклассом мистика.
      if (typeof THIRD_CASTER_SUBCLASSES === "undefined" ||
          THIRD_CASTER_SUBCLASSES.indexOf(entry.subclass) === -1) return;
      out.level += Math.floor(lv / 3);
    } else if (ct === "full") {
      out.level += lv;
    } else if (ct === "half") {
      // AUD-5: 2014 — «Использование заклинаний» у паладина/следопыта со 2 уровня,
      // половина вниз (PHB стр. 164); 2024 — с 1 уровня, половина вверх (PH24 стр. 43).
      if (char.edition === "2024") {
        out.level += Math.ceil(lv / 2);
      } else {
        if (lv < 2) return;
        out.level += Math.floor(lv / 2);
      }
    } else if (ct === "pact") {
      out.pact = { cls: entry.class, level: lv };
      out.casters.push({ cls: entry.class, level: lv, sub: entry.subclass || "", type: ct });
      return;
    } else {
      return;
    }
    out.casters.push({ cls: entry.class, level: lv, sub: entry.subclass || "", type: ct });
  });
  return out;
}

/** Ячейки ОДНОГО класса по его уровню: обычная таблица класса, а у мистического
 *  рыцаря и мистического ловкача — своя (PHB стр. 75 и 98), её в
 *  SPELL_SLOTS_BY_LEVEL нет. Возвращает копию строки или null. */
function classSpellSlotRow(cls, sub, level, char) {
  if (!cls || !level) return null;
  if (edData(char).SPELL_SLOTS_BY_LEVEL[cls] && edData(char).SPELL_SLOTS_BY_LEVEL[cls][level]) {
    return edData(char).SPELL_SLOTS_BY_LEVEL[cls][level].slice();
  }
  if (typeof THIRD_CASTER_SUBCLASSES !== "undefined" && typeof THIRD_CASTER_SLOTS !== "undefined" &&
      THIRD_CASTER_SUBCLASSES.indexOf(sub) !== -1 && THIRD_CASTER_SLOTS[level]) {
    return THIRD_CASTER_SLOTS[level].slice();
  }
  return null;
}

/** Рассчитать ячейки заклинаний для мультикласса (PHB p.164-165) */
function getMulticlassSpellSlots(char) {
  if (!char.classes || char.classes.length <= 1) {
    // Одноклассовый — своя таблица класса (у мистиков — таблица подкласса)
    var only = (char.classes && char.classes[0]) ? char.classes[0] : { class: char.class, level: char.level, subclass: char.subclass };
    var row = classSpellSlotRow(only.class, only.subclass || "", only.level || char.level, char);
    return row || [0,0,0,0,0,0,0,0,0,0];
  }
  var cl = charCasterLevel(char);
  // PHB стр. 164: общий пул считается, только если «Использование заклинаний»
  // есть у ДВУХ и более классов. Если класс-заклинатель один — работает его
  // собственная таблица: у Паладина 5 / Воина 3 это 4 ячейки 1 круга и 2 второго,
  // а не 3 ячейки заклинателя 2 уровня, как считалось раньше (вердикт dnd-rules).
  var casting = cl.casters.filter(function(c) { return c.type !== "pact"; });
  if (casting.length === 1) {
    var one = casting[0];
    var row = classSpellSlotRow(one.cls, one.sub || "", one.level, char);
    if (row) return row;
  }
  // Мультикласс — caster level считает charCasterLevel (там же правило третей)
  var casterLevel = cl.level;
  // Ячейки из таблицы мультикласса
  var slots = [0,0,0,0,0,0,0,0,0,0];
  if (casterLevel > 0 && typeof MULTICLASS_SPELL_SLOTS !== "undefined" && MULTICLASS_SPELL_SLOTS[casterLevel]) {
    slots = MULTICLASS_SPELL_SLOTS[casterLevel].slice();
  }
  // Ячейки пакта (Колдун) добавляются отдельно — они не объединяются
  // Их обрабатывает существующая система
  return slots;
}

/** AUD-5 (L4, L18): максимум ячеек и пакт-ячеек по классам персонажа. Потраченные
 *  не обнуляются — только обрезаются до нового максимума. Колдун — всегда в пакт. */
function rulesApplySpellSlots(char) {
  if (!char) return;
  if (!char.spells) char.spells = {};
  var sp = char.spells;
  if (!sp.slots) sp.slots = {};
  if (!sp.slotsUsed) sp.slotsUsed = {};
  var cl = charCasterLevel(char);
  var hasCasting = cl.casters.some(function(c) { return c.type !== "pact"; });
  var row = hasCasting ? getMulticlassSpellSlots(char) : [];
  for (var i = 1; i <= 9; i++) {
    sp.slots[i] = row[i] || 0;
    sp.slotsUsed[i] = Math.min(sp.slotsUsed[i] || 0, sp.slots[i]);
  }
  var pact = { cnt: 0, lvl: 0 };
  var table = edData(char).SPELL_SLOTS_BY_LEVEL["Колдун"];
  if (cl.pact && table && table[cl.pact.level]) pact = resolvePactSlots(table[cl.pact.level]);
  sp.pactSlots = pact.cnt;
  sp.pactLevel = pact.lvl;
  sp.pactUsed = Math.min(sp.pactUsed || 0, pact.cnt);
}

// BUGFIX-1: пакт-ячейки Колдуна — последняя непустая колонка строки таблицы
// SPELL_SLOTS_BY_LEVEL["Колдун"] → {cnt, lvl}
function resolvePactSlots(row) {
  var cnt = 0, lvl = 0;
  if (row) for (var k = 1; k < row.length; k++) if (row[k] > 0) { cnt = row[k]; lvl = k; }
  return { cnt: cnt, lvl: lvl };
}

// ── Отдых ───────────────────────────────────────────────────
// FIN-8: заряды предметов на длинном отдыхе — полное восстановление (упрощение
// против «1к6+N» книги). Восстанавливает предметы всех категорий инвентаря с
// maxCharges>0 и recharge!=="none", если заряды не полны. Возвращает число предметов.
function restoreItemCharges(char) {
  if (!char || !char.inventory) return 0;
  var restored = 0;
  Object.keys(char.inventory).forEach(function(cat) {
    if (!Array.isArray(char.inventory[cat])) return;
    char.inventory[cat].forEach(function(it) {
      if (!it) return;
      var max = parseInt(it.maxCharges, 10) || 0;
      if (max <= 0 || it.recharge === "none") return;
      var cur = parseInt(it.charges, 10) || 0;
      if (cur < max) { it.charges = max; restored++; }
    });
  });
  return restored;
}

// Грань кости хитов из char.combat.hpDice ("1к8" → 8, "мульти" → 8)
function rulesHitDieSides(char) {
  return parseInt(char.combat.hpDice.match(/(\d+)[кK](\d+)/)?.[2] || 8, 10);
}

// Короткий отдых: броски приходят готовыми (opts.rolls), Math.random здесь нет.
// Мутирует char (ХП, потраченные кости, ячейки Колдуна), возвращает сводку для рендера.
function rulesShortRest(char, opts) {
  opts = opts || {};
  var rolls = opts.rolls || [];
  var spent = (opts.hitDiceSpent != null) ? opts.hitDiceSpent : rolls.length;
  // PHB стр.186: запас костей хитов равен уровню, потраченные возвращает только
  // продолжительный отдых — потратить больше, чем осталось, нельзя. В UI предел держит
  // adjustHitDice, здесь тот же предел на уровне правил: лишние броски не считаются.
  var dice = rulesPickHitDice(char, Math.max(0, spent));
  spent = dice.length;
  if (rolls.length > spent) rolls = rolls.slice(0, spent);
  var _sp = rulesSpendHitDice(char, dice, rolls);
  var conMod = _sp.conMod, hpBefore = _sp.hpBefore, hpHealed = _sp.hpHealed, rollLog = _sp.rollLog;
  // FIX: Warlock recovers spell slots on short rest
  var isWarlock = (char.class === "Колдун") || (char.classes && char.classes.some(function(c){return c.class === "Колдун";}));
  var isMulticlassChar = !!(char.classes && char.classes.length > 1);
  if (isWarlock && char.spells) {
    // У мультикласса slots — ячейки полного заклинателя, короткий отдых их не трогает (PHB стр.164)
    if (char.spells.slots && !isMulticlassChar) {
      for (var _si = 1; _si <= 9; _si++) {
        if (char.spells.slots[_si]) char.spells.slotsUsed[_si] = 0;
      }
    }
    // BUGFIX-1: пакт-ячейки восстанавливаются на коротком отдыхе
    if (char.spells.pactSlots) char.spells.pactUsed = 0;
  }
  return {
    hpBefore: hpBefore, hpAfter: char.combat.hpCurrent, hpHealed: hpHealed,
    rollLog: rollLog, conMod: conMod, hitDiceSpent: spent, isWarlock: !!isWarlock
  };
}

// PHB стр.186: «у персонажа должен быть хотя бы 1 хит в начале отдыха, чтобы получить
// от него преимущества». Оговорка стоит в разделе «Продолжительный отдых» — короткого
// она не касается (там требований к стартовым ХП нет), поэтому гейт только здесь.
// Возвращает причину отказа строкой либо null, если отдых допустим.
function rulesLongRestBlockReason(char) {
  var hp = parseInt(char && char.combat ? char.combat.hpCurrent : 0, 10) || 0;
  if (hp < 1) return "На 0 хитов длинный отдых не даёт преимуществ: нужен хотя бы 1 хит в начале отдыха (PHB стр. 186)";
  return null;
}

// Длинный отдых: ХП до максимума, временные ХП гаснут (PHB стр.198), ячейки и половина
// костей хитов, истощение −1, ручные карточки эффектов и спасброски от смерти, заряды предметов.
// Эффекты кастов снимает вызывающий (clearAllCastEffects) — СТРОГО до этой функции,
// иначе реверт hpMax «Подмоги» пройдёт после hpCurrent = maxHp.
// На 0 хитов отдых не проходит: возвращается {blocked:true}, персонаж не мутируется.
// opts.foodAndDrink === false — персонаж не ел и не пил: всё остальное отдых даёт,
// но истощение не снижается (PHB стр.291). По умолчанию считаем, что ел и пил.
function rulesLongRest(char, opts) {
  opts = opts || {};
  var foodAndDrink = (opts.foodAndDrink !== false);
  var blockReason = rulesLongRestBlockReason(char);
  if (blockReason) {
    var hpNow = parseInt(char.combat.hpCurrent, 10) || 0;
    return {
      blocked: true, reason: blockReason,
      hpBefore: hpNow, hpAfter: hpNow, hitDiceRestored: 0,
      exhaustionReduced: false, exhaustionHeld: false, chargesRestored: 0
    };
  }
  var hpBefore = parseInt(char.combat.hpCurrent, 10);
  var maxHp = parseInt(char.combat.hpMax, 10) || 0;
  char.combat.hpCurrent = maxHp;
  char.combat.hpTemp = 0;
  for (var i = 1; i <= 9; i++) { if (char.spells.slots[i]) char.spells.slotsUsed[i] = 0; }
  if (char.spells.pactSlots) char.spells.pactUsed = 0;
  // PHB стр.186: восстанавливается половина костей, но не меньше одной и не больше потраченных
  var _by = rulesHitDiceSpentBy(char);
  var hitDiceSpentBefore = char.combat.hpDiceSpent || 0;
  var hitDiceRestored = Math.min(hitDiceSpentBefore, Math.max(1, Math.floor((char.level || 1) / 2)));
  // AUD-4: у мультикласса возвращаются сначала крупные кости
  var _left = hitDiceRestored;
  _hdSizesDesc(_by).forEach(function(d) { var n = Math.min(_by[d], _left); _by[d] -= n; _left -= n; if (!_by[d]) delete _by[d]; });
  char.combat.hpDiceSpentBy = _by;
  char.combat.hpDiceSpent = Math.max(0, hitDiceSpentBefore - hitDiceRestored);
  // PHB стр.291: продолжительный отдых снижает степень истощения на 1 — но только если
  // существо «что-нибудь съест и выпьет». Остальные состояния не снимаются автоматически.
  var exhaustionReduced = false;
  var exhaustionHeld = false;
  if (char.conditions && char.conditions.length > 0) {
    var exhLevels = ["exhaustion_6","exhaustion_5","exhaustion_4","exhaustion_3","exhaustion_2","exhaustion_1"];
    for (var ei = 0; ei < exhLevels.length; ei++) {
      var exhIdx = char.conditions.indexOf(exhLevels[ei]);
      if (exhIdx !== -1) {
        if (!foodAndDrink) { exhaustionHeld = true; break; }
        char.conditions.splice(exhIdx, 1);
        // Понижаем на 1 уровень (если было 3, ставим 2)
        var exhNum = parseInt(exhLevels[ei].split("_")[1], 10);
        if (exhNum > 1) {
          char.conditions.push("exhaustion_" + (exhNum - 1));
        }
        exhaustionReduced = true;
        break;
      }
    }
  }
  char.effects = [];
  char.deathSaves = { successes: [false, false, false], failures: [false, false, false] };
  // AUD-6: истощение 4+ (2014) держит максимум ХП вдвое ниже
  char.combat.hpCurrent = Math.min(char.combat.hpCurrent, rulesEffectiveHpMax(char));
  // FIN-8: восстановить заряды предметов (палочки/посохи/жезлы)
  var chargesRestored = restoreItemCharges(char);
  return {
    blocked: false, reason: null,
    hpBefore: hpBefore, hpAfter: char.combat.hpCurrent, hitDiceRestored: hitDiceRestored,
    exhaustionReduced: exhaustionReduced, exhaustionHeld: exhaustionHeld,
    chargesRestored: chargesRestored
  };
}

// ── 0 ХП, спасброски от смерти, состояния (AUD-6, PHB стр.197, 290–292) ──
function rulesExhaustionLevel(char) {
  var c = (char && char.conditions) || [];
  for (var i = 6; i >= 1; i--) { if (c.indexOf("exhaustion_" + i) !== -1) return i; }
  return 0;
}
// Максимум ХП с учётом истощения 4+ (2014: вдвое; в 2024 истощение максимум не трогает)
function rulesEffectiveHpMax(char) {
  var max = parseInt(char && char.combat ? char.combat.hpMax : 0, 10) || 10;
  if (char && char.edition !== "2024" && rulesExhaustionLevel(char) >= 4) return Math.max(1, Math.floor(max / 2));
  return max;
}
function _dsReset(char) { char.deathSaves = { successes: [false, false, false], failures: [false, false, false] }; }
function _dsCount(arr) { return (arr || []).filter(Boolean).length; }
function _dsFill(arr, n) { for (var i = 0; i < 3 && n > 0; i++) { if (!arr[i]) { arr[i] = true; n--; } } }
function _condAdd(char, id) { if (!char.conditions) char.conditions = []; if (char.conditions.indexOf(id) === -1) char.conditions.push(id); }
function _condRemove(char, id) { var i = char.conditions ? char.conditions.indexOf(id) : -1; if (i !== -1) char.conditions.splice(i, 1); }
// Погиб: три провала (в т.ч. мгновенная смерть) или истощение 6
function rulesIsDead(char) {
  var ds = char && char.deathSaves;
  return !!(ds && _dsCount(ds.failures) >= 3) || rulesExhaustionLevel(char) >= 6;
}
function rulesIsStable(char) {
  var ds = char && char.deathSaves;
  return !!(ds && _dsCount(ds.successes) >= 3) && !rulesIsDead(char);
}
// Вернулся с 0 ХП: отметки сбрасываются, «без сознания» от 0 ХП снимается
function rulesRegainFromZero(char) {
  _dsReset(char);
  _condRemove(char, "unconscious");
}
// Сопротивление/иммунитет/уязвимость по типу; окаменение — сопротивление всему урону.
// Порядок: сначала сопротивление (вниз), затем уязвимость (PHB 2014 стр.197, PHB 2024 стр.26)
function rulesDamageAfterDefenses(char, dmg, type) {
  dmg = Math.max(0, dmg || 0);
  if (type && char.immunities && char.immunities.indexOf(type) !== -1) return 0;
  var resist = !!(type && char.resistances && char.resistances.indexOf(type) !== -1) ||
    !!(char.conditions && char.conditions.indexOf("petrified") !== -1);
  if (resist) dmg = Math.floor(dmg / 2);
  if (type && char.vulnerabilities && char.vulnerabilities.indexOf(type) !== -1) dmg *= 2;
  return dmg;
}
// Урон: сначала временные ХП, затем хиты. Падение до 0 — «без сознания» или мгновенная
// смерть (остаток ≥ максимума ХП). Урон на 0 ХП — провал спасброска (крит — два),
// урон ≥ максимума — смерть; стабилизированный снова начинает бросать.
function rulesApplyDamage(char, dmg, opts) {
  opts = opts || {};
  var c = char.combat;
  var hpBefore = c.hpCurrent || 0;
  var rest = Math.max(0, dmg || 0);
  var temp = c.hpTemp || 0;
  if (temp > 0) { var abs = Math.min(temp, rest); c.hpTemp = temp - abs; rest -= abs; }
  var r = { hpBefore: hpBefore, hpAfter: hpBefore, toHp: rest, droppedToZero: false, instantDeath: false, failuresAdded: 0, wasStable: false, dead: false };
  if (!char.deathSaves) _dsReset(char);
  if (rest <= 0) return r;
  var max = rulesEffectiveHpMax(char);
  if (hpBefore > 0) {
    c.hpCurrent = Math.max(0, hpBefore - rest);
    r.hpAfter = c.hpCurrent;
    if (c.hpCurrent === 0) {
      r.droppedToZero = true;
      _dsReset(char);
      if (rest - hpBefore >= max) { r.instantDeath = true; _dsFill(char.deathSaves.failures, 3); }
      else _condAdd(char, "unconscious");
    }
    r.dead = rulesIsDead(char);
    return r;
  }
  if (rulesIsDead(char)) { r.dead = true; return r; }
  if (rest >= max) {
    r.instantDeath = true;
    _dsFill(char.deathSaves.failures, 3);
  } else {
    if (_dsCount(char.deathSaves.successes) >= 3) { r.wasStable = true; _dsReset(char); }
    var before = _dsCount(char.deathSaves.failures);
    _dsFill(char.deathSaves.failures, opts.crit ? 2 : 1);
    r.failuresAdded = _dsCount(char.deathSaves.failures) - before;
    _condAdd(char, "unconscious");
  }
  r.dead = rulesIsDead(char);
  return r;
}
function rulesDeathSaveBlockReason(char) {
  if ((char.combat.hpCurrent || 0) > 0) return "Хитов больше 0 — спасбросок от смерти не нужен";
  if (rulesIsDead(char)) return "Персонаж погиб";
  if (rulesIsStable(char)) return "Персонаж стабилизирован";
  return null;
}
// Спасбросок от смерти по выпавшему к20: 20 — 1 хит и сброс отметок, 1 — два провала
function rulesDeathSave(char, roll) {
  if (!char.deathSaves) _dsReset(char);
  var blocked = rulesDeathSaveBlockReason(char);
  if (blocked) return { blocked: blocked, outcome: null };
  var ds = char.deathSaves, outcome;
  if (roll === 20) {
    char.combat.hpCurrent = 1;
    rulesRegainFromZero(char);
    outcome = "revive";
  } else if (roll === 1) { _dsFill(ds.failures, 2); outcome = "fail2"; }
  else if (roll >= 10) { _dsFill(ds.successes, 1); outcome = "success"; }
  else { _dsFill(ds.failures, 1); outcome = "fail"; }
  return { blocked: null, outcome: outcome, stable: rulesIsStable(char), dead: rulesIsDead(char) };
}
// Состояния, которые делают недееспособным и срывают концентрацию (PHB стр.203)
var CONC_BREAK_CONDITIONS = ["incapacitated", "paralyzed", "petrified", "stunned", "unconscious"];
// Что состояния и истощение делают с броском к20: kind — "attack" | "check" | "save",
// ability — ключ характеристики спасброска. dis / autoFail — id состояний-причин,
// penalty — штраф истощения 2024 (−2 за степень к любому к20).
function rulesConditionRollMods(char, kind, ability) {
  var c = (char && char.conditions) || [];
  var has = function(id) { return c.indexOf(id) !== -1; };
  var out = { dis: [], autoFail: [], penalty: 0 };
  var addIf = function(list, ids) { ids.forEach(function(id) { if (has(id)) list.push(id); }); };
  if (kind === "attack") addIf(out.dis, ["blinded", "frightened", "poisoned", "prone", "restrained"]);
  if (kind === "check") addIf(out.dis, ["frightened", "poisoned"]);
  if (kind === "save" && ability === "dex") addIf(out.dis, ["restrained"]);
  if (kind === "save" && (ability === "str" || ability === "dex")) addIf(out.autoFail, ["paralyzed", "petrified", "stunned", "unconscious"]);
  var exh = rulesExhaustionLevel(char);
  if (exh > 0) {
    if (char.edition === "2024") out.penalty = -2 * exh;
    else if (kind === "check" || exh >= 3) out.dis.push("exhaustion_" + exh);
  }
  return out;
}
// Скорость с учётом состояний и истощения: base — число футов; reasons — id причин
function rulesEffectiveSpeed(char, base) {
  var c = (char && char.conditions) || [];
  var reasons = [];
  // ошеломлённый 2024 двигаться может (PHB 2024 стр.356)
  var zero = ["grappled", "restrained", "paralyzed", "petrified", "unconscious"];
  if (!char || char.edition !== "2024") zero.push("stunned");
  zero.forEach(function(id) { if (c.indexOf(id) !== -1) reasons.push(id); });
  var exh = rulesExhaustionLevel(char);
  if (reasons.length) return { speed: 0, reasons: reasons };
  // AUD-8 (L34): тяжёлый доспех при СИЛ ниже требования — скорость −10 фт (PHB стр.144)
  var pre = [];
  var armorId = char && char.combat && char.combat.armorId;
  var preset = (armorId && typeof ARMOR_PRESETS !== "undefined") ? ARMOR_PRESETS.find(function(a) { return a.id === armorId; }) : null;
  if (preset && armorPenalties(char, preset).slowed) { base = Math.max(0, base - 10); pre.push("armor_heavy"); }
  if (exh > 0 && char.edition === "2024") return { speed: Math.max(0, base - 5 * exh), reasons: pre.concat(["exhaustion_" + exh]) };
  if (exh >= 5) return { speed: 0, reasons: ["exhaustion_" + exh] };
  if (exh >= 2) return { speed: Math.floor(base / 2), reasons: pre.concat(["exhaustion_" + exh]) };
  return { speed: base, reasons: pre };
}

// AUD-8 (L34): помеха на Скрытность от доспеха (PHB стр.144)
function rulesArmorStealthDisadv(char) {
  var armorId = char && char.combat && char.combat.armorId;
  if (!armorId || typeof ARMOR_PRESETS === "undefined") return false;
  var preset = ARMOR_PRESETS.find(function(a) { return a.id === armorId; });
  return !!(preset && armorPenalties(char, preset).stealthDisadv);
}

// ── Черты: требования и выбор характеристики (AUD-7, PHB стр. 165) ──
// Невыполненное требование черты (строка prereq) или null. Незнакомая формулировка не блокирует.
function rulesFeatPrereqMissing(char, feat) {
  var pr = feat && feat.prereq;
  if (!pr || !char) return null;
  var st = char.stats || {};
  var abil = {"Сила":"str","Ловкость":"dex","Телосложение":"con","Интеллект":"int","Мудрость":"wis","Харизма":"cha",
    "СИЛ":"str","ЛОВ":"dex","ТЕЛ":"con","ИНТ":"int","МУД":"wis","ХАР":"cha"};
  var m = pr.match(/^(.+?)\s+(\d+)\+?$/);
  if (m) {
    var keys = m[1].split(/\s+или\s+/).map(function(w) { return abil[w.trim()]; });
    if (keys.every(Boolean)) {
      var need = parseInt(m[2], 10);
      return keys.some(function(k) { return (st[k] || 10) >= need; }) ? null : pr;
    }
  }
  var armor = {"лёгкими":"light","средними":"medium","тяжёлыми":"heavy"};
  var am = pr.match(/^Владение (\S+) доспехами$/);
  if (am && armor[am[1]]) {
    var have = (char.proficiencies && char.proficiencies.armor) || [];
    return have.indexOf(armor[am[1]]) !== -1 ? null : pr;
  }
  if (/накладывать заклинания/.test(pr)) {
    var cl = charCasterLevel(char);
    return (cl.level > 0 || cl.pact) ? null : pr;
  }
  return null;
}
// Эффект черты с выбором характеристики (stat_choice / stat_choice_save) или null
function rulesFeatStatChoice(feat) {
  var effs = (feat && feat.effects) || [];
  for (var i = 0; i < effs.length; i++) {
    if (effs[i] && (effs[i].type === "stat_choice" || effs[i].type === "stat_choice_save")) return effs[i];
  }
  return null;
}
// Какие характеристики можно выбрать: ниже потолка; для «Устойчивого» — без владения спасброском
function rulesFeatStatOptions(char, eff) {
  if (!eff) return [];
  var cap = eff.max || 20;
  return (eff.keys || []).filter(function(k) {
    if (((char.stats || {})[k] || 10) >= cap) return false;
    if (eff.type === "stat_choice_save" && char.saves && char.saves[k]) return false;
    return true;
  });
}

// ── Концентрация ────────────────────────────────────────────
// FIN-7: чистые параметры спасброска концентрации (PHB стр.203–204).
// СЛ = max(10, урон/2 округл. вниз); модификатор = ТЕЛ-мод (+ мастерство при
// владении спасом ТЕЛ); черта «Боевой маг» (war_caster) даёт преимущество.
// Выделено в window-функцию для юнит-тестов (БЛОК 26).
function concSaveParams(char, dmg) {
  char = char || {};
  var stats = char.stats || {};
  var mod = (typeof getMod === "function") ? getMod(stats.con) : 0;
  if (char.saves && char.saves.con && typeof getProficiencyBonus === "function") {
    mod += getProficiencyBonus(char.level || 1);
  }
  var mode = "normal";
  if (Array.isArray(char.feats) && char.feats.some(function(f){ return f && f.id === "war_caster"; })) {
    mode = "adv";
  }
  return { dc: Math.max(10, Math.floor((Math.abs(dmg) || 0) / 2)), mod: mod, mode: mode };
}
window.concSaveParams = concSaveParams;

// ── Владения из источников (раса / класс / подкласс / предыстория / черты) ──
// Возвращает массив [{cls, sub}] для всех классов персонажа (с учётом мультикласса)
function getCharClassPairs(char) {
  var out = [];
  if (char.classes && char.classes.length) {
    char.classes.forEach(function(c) {
      if (c && c.class) out.push({ cls: c.class, sub: c.subclass || "" });
    });
  } else if (char.class) {
    out.push({ cls: char.class, sub: char.subclass || "" });
  }
  return out;
}

function findLangInCatalog(name) {
  if (typeof LANGUAGE_CATALOG === "undefined") return null;
  var cats = ["standard","exotic","secret"];
  for (var i = 0; i < cats.length; i++) {
    var arr = LANGUAGE_CATALOG[cats[i]] || [];
    for (var j = 0; j < arr.length; j++) {
      if (arr[j].name === name) return { category: cats[i], desc: arr[j].desc };
    }
  }
  return null;
}

function ensureLanguagesArray(char) {
  if (!char.proficiencies) char.proficiencies = { armor:[], weapon:[], tools:"", languages:[], languageChoices:{} };
  if (typeof char.proficiencies.languages === "string") {
    var s = char.proficiencies.languages.trim();
    var arr = [];
    if (s) s.split(/[,;\n]/).forEach(function(x){
      var n = x.trim();
      if (n) arr.push({ name: n, source: "custom", category: "custom" });
    });
    char.proficiencies.languages = arr;
  }
  if (!Array.isArray(char.proficiencies.languages)) char.proficiencies.languages = [];
  if (!char.proficiencies.languageChoices) char.proficiencies.languageChoices = {};
}

// Перестроить языки из источников race/class/background, сохранив custom
function recalcLanguagesFromSources(char) {
  ensureLanguagesArray(char);
  var custom = char.proficiencies.languages.filter(function(l){ return l.source === "custom"; });
  var result = [];
  var seen = {};
  function add(name, source) {
    if (!name || seen[name]) return;
    seen[name] = true;
    var info = findLangInCatalog(name);
    result.push({ name: name, source: source, category: info ? info.category : "custom" });
  }
  // Раса
  var _raceLangs = (typeof edData === "function") ? edData(char).RACE_LANGUAGES : (typeof RACE_LANGUAGES !== "undefined" ? RACE_LANGUAGES : null);
  if (char.race && _raceLangs && _raceLangs[char.race]) {
    var r = _raceLangs[char.race];
    (r.fixed || []).forEach(function(n){ add(n, "race"); });
    var rPicks = (char.proficiencies.languageChoices.race) || [];
    rPicks.slice(0, r.choice || 0).forEach(function(n){ add(n, "race"); });
  }
  // Класс(ы) — учитываем мультикласс
  var classPairs = getCharClassPairs(char);
  classPairs.forEach(function(p){
    if (typeof CLASS_LANGUAGES !== "undefined" && CLASS_LANGUAGES[p.cls]) {
      (CLASS_LANGUAGES[p.cls].fixed || []).forEach(function(n){ add(n, "class"); });
    }
    // Подкласс
    if (p.sub && edData(char).SUBCLASS_LANGUAGES[p.cls] && edData(char).SUBCLASS_LANGUAGES[p.cls][p.sub]) {
      var sd = edData(char).SUBCLASS_LANGUAGES[p.cls][p.sub];
      (sd.fixed || []).forEach(function(n){ add(n, "subclass"); });
      var subKey = "subclass_" + p.cls + "_" + p.sub;
      var subPicks = (char.proficiencies.languageChoices[subKey]) || [];
      subPicks.slice(0, sd.choice || 0).forEach(function(n){ add(n, "subclass"); });
    }
  });
  // Предыстория
  var bg = getBackgroundDef(char); // E24-5: по редакции (2024 — override / «Своя»)
  if (bg) {
    var bgPicks = (char.proficiencies.languageChoices.background) || [];
    bgPicks.slice(0, bg.languages || 0).forEach(function(n){ add(n, "background"); });
  }
  // Custom — добавляем последними
  custom.forEach(function(l){
    if (!seen[l.name]) {
      seen[l.name] = true;
      result.push({ name: l.name, source: "custom", category: l.category || "custom" });
    }
  });
  char.proficiencies.languages = result;
}

function findToolInCatalog(name) {
  if (typeof TOOL_CATALOG === "undefined") return null;
  var cats = ["artisan","gaming","musical","vehicles","other"];
  for (var i = 0; i < cats.length; i++) {
    var arr = TOOL_CATALOG[cats[i]] || [];
    for (var j = 0; j < arr.length; j++) {
      if (arr[j].name === name) return { category: cats[i], desc: arr[j].desc };
    }
  }
  return null;
}

function ensureToolsArray(char) {
  if (!char.proficiencies) char.proficiencies = { armor:[], weapon:[], tools:[], toolChoices:{}, languages:[], languageChoices:{} };
  if (typeof char.proficiencies.tools === "string") {
    var s = char.proficiencies.tools.trim();
    var arr = [];
    if (s) s.split(/[,;\n]/).forEach(function(x){
      var n = x.trim();
      if (n) arr.push({ name: n, source: "custom", category: "custom" });
    });
    char.proficiencies.tools = arr;
  }
  if (!Array.isArray(char.proficiencies.tools)) char.proficiencies.tools = [];
  if (!char.proficiencies.toolChoices) char.proficiencies.toolChoices = {};
}

// ── E24-5: предыстория по редакции ──────────────────────────
// Запись предыстории персонажа: 2014 — BACKGROUND_SKILLS, 2024 — override из
// edData (16 предысторий с abilities/featId/equipment). «Своя» предыстория 2024
// (стр. 36) собирается из char.bgCustom в ту же форму, чтобы потребители
// (навыки, инструменты, языки, панель) не различали её.
var CUSTOM_BACKGROUND_KEY = "Своя";
function getBackgroundDef(char, bgName) {
  if (!char) return null;
  var bg = (bgName !== undefined) ? bgName : char.background;
  if (!bg) return null;
  if (char.edition === "2024" && bg === CUSTOM_BACKGROUND_KEY) {
    var c = char.bgCustom || {};
    return { skills: Array.isArray(c.skills) ? c.skills : [], tools: c.tool ? [c.tool] : [], languages: 0,
      abilities: Array.isArray(c.abilities) ? c.abilities : [], featId: c.featId || "", custom: true };
  }
  var tbl = (typeof edData === "function") ? edData(char).BACKGROUND_SKILLS
    : (typeof BACKGROUND_SKILLS !== "undefined" ? BACKGROUND_SKILLS : null);
  return (tbl && tbl[bg]) || null;
}

// Валидатор распределения характеристик от предыстории 2024 (стр. 36):
// режим "2+1" — +2 одной и +1 другой, "1+1+1" — по +1 всем трём; только из
// abilities предыстории, сумма ровно +3. Пустое alloc — «не распределено» (ok,
// complete: false). Возвращает { ok, complete, error }.
function validateBgStatChoice(bgDef, choice) {
  var abilities = (bgDef && Array.isArray(bgDef.abilities)) ? bgDef.abilities : [];
  var mode = (choice && choice.mode) || "2+1";
  var alloc = (choice && choice.alloc) || {};
  var keys = Object.keys(alloc).filter(function(k){ return alloc[k]; });
  if (mode !== "2+1" && mode !== "1+1+1") return { ok:false, complete:false, error:"режим " + mode };
  if (!keys.length) return { ok:true, complete:false, error:"" };
  var outside = keys.filter(function(k){ return abilities.indexOf(k) === -1; });
  if (outside.length) return { ok:false, complete:false, error:"вне предыстории: " + outside.join(",") };
  var sum = keys.reduce(function(a,k){ return a + alloc[k]; }, 0);
  var vals = keys.map(function(k){ return alloc[k]; }).sort().join("");
  if (mode === "2+1") {
    if (vals !== "2" && vals !== "1" && vals !== "12") return { ok:false, complete:false, error:"2+1: неверные значения" };
    return { ok:true, complete: sum === 3 && keys.length === 2, error:"" };
  }
  if (keys.length > 3 || vals.replace(/1/g,"").length) return { ok:false, complete:false, error:"1+1+1: неверные значения" };
  return { ok:true, complete: sum === 3, error:"" };
}

// Является ли строка из BACKGROUND_SKILLS.tools слотом-выбором
function parseBackgroundToolEntry(entry) {
  // "Ремесленный инструмент (один)" → slot: artisan x1
  // "Музыкальный инструмент (один)" → slot: musical x1
  // "Игровой набор (один)"           → slot: gaming x1
  if (/Ремесленн.*\(один\)/i.test(entry)) return { type:"slot", from:"artisan", count:1 };
  if (/Музыкальн.*\(один\)/i.test(entry)) return { type:"slot", from:"musical", count:1 };
  if (/Игров.*набор.*\(один\)/i.test(entry)) return { type:"slot", from:"gaming", count:1 };
  return { type:"fixed", name: entry };
}

function recalcToolsFromSources(char) {
  ensureToolsArray(char);
  var custom = char.proficiencies.tools.filter(function(t){ return t.source === "custom"; });
  var result = [];
  var seen = {};
  function add(name, source) {
    if (!name || seen[name]) return;
    seen[name] = true;
    var info = findToolInCatalog(name);
    result.push({ name: name, source: source, category: info ? info.category : "custom" });
  }
  // Раса
  if (char.race && typeof RACE_TOOLS !== "undefined" && RACE_TOOLS[char.race]) {
    var r = RACE_TOOLS[char.race];
    (r.fixed || []).forEach(function(n){ add(n, "race"); });
    (r.choices || []).forEach(function(slot, idx) {
      var key = "race_" + idx;
      var picks = (char.proficiencies.toolChoices[key]) || [];
      picks.slice(0, slot.count || 1).forEach(function(n){ add(n, "race"); });
    });
  }
  // Классы и подклассы; второй и следующие классы — по таблице мультикласса (AUD-7)
  getCharClassPairs(char).forEach(function(p, pi) {
    var cn = p.cls;
    var c = pi > 0 ? (edData(char).MULTICLASS_PROFICIENCIES[cn] || {}).tools
      : (typeof CLASS_TOOLS !== "undefined" ? CLASS_TOOLS[cn] : null);
    if (c) {
      (c.fixed || []).forEach(function(n){ add(n, "class"); });
      (c.choices || []).forEach(function(slot, idx) {
        var key = "class_" + cn + "_" + idx;
        var picks = (char.proficiencies.toolChoices[key]) || [];
        picks.slice(0, slot.count || 1).forEach(function(n){ add(n, "class"); });
      });
    }
    // Подкласс
    if (p.sub && edData(char).SUBCLASS_TOOLS[cn] && edData(char).SUBCLASS_TOOLS[cn][p.sub]) {
      var sc = edData(char).SUBCLASS_TOOLS[cn][p.sub];
      (sc.fixed || []).forEach(function(n){ add(n, "subclass"); });
      (sc.choices || []).forEach(function(slot, idx) {
        var key = "subclass_" + cn + "_" + p.sub + "_" + idx;
        var picks = (char.proficiencies.toolChoices[key]) || [];
        picks.slice(0, slot.count || 1).forEach(function(n){ add(n, "subclass"); });
      });
    }
  });
  // Предыстория
  var bg = getBackgroundDef(char); // E24-5: по редакции
  if (bg) {
    var entries = (!Array.isArray(bg) && bg.tools) || [];
    entries.forEach(function(entry, idx) {
      var parsed = parseBackgroundToolEntry(entry);
      if (parsed.type === "fixed") {
        add(parsed.name, "background");
      } else {
        var key = "bg_" + idx;
        var picks = (char.proficiencies.toolChoices[key]) || [];
        picks.slice(0, parsed.count || 1).forEach(function(n){ add(n, "background"); });
      }
    });
  }
  // Custom
  custom.forEach(function(t){
    if (!seen[t.name]) {
      seen[t.name] = true;
      result.push({ name: t.name, source: "custom", category: t.category || "custom" });
    }
  });
  char.proficiencies.tools = result;
}

function ensureArmorWeaponFields(char) {
  if (!char.proficiencies) char.proficiencies = {};
  var p = char.proficiencies;
  if (!Array.isArray(p.armor))           p.armor = [];
  if (!Array.isArray(p.weapon))          p.weapon = [];
  if (!Array.isArray(p.armorCustom))     p.armorCustom = [];
  if (!Array.isArray(p.weaponCustom))    p.weaponCustom = [];
  if (!Array.isArray(p.specificWeapons)) p.specificWeapons = [];
  if (!p.armorSources)                   p.armorSources = {};
  if (!p.weaponSources)                  p.weaponSources = {};
}

// Пересчёт типов брони/оружия и конкретных оружий из всех источников
function recalcArmorWeaponFromSources(char) {
  ensureArmorWeaponFields(char);
  var p = char.proficiencies;
  var ar = { light:[], medium:[], heavy:[], shield:[] };
  var wp = { simple:[], martial:[] };

  function addArmor(t, src) { if (ar[t] && ar[t].indexOf(src) === -1) ar[t].push(src); }
  function addWeapon(t, src){ if (wp[t] && wp[t].indexOf(src) === -1) wp[t].push(src); }

  // Раса
  if (char.race && typeof RACE_ARMOR !== "undefined" && RACE_ARMOR[char.race]) {
    var r = RACE_ARMOR[char.race];
    (r.armor  || []).forEach(function(t){ addArmor(t,  "race"); });
    (r.weapon || []).forEach(function(t){ addWeapon(t, "race"); });
  }
  // Класс(ы) и подкласс(ы)
  // AUD-7 (R5): второй и следующие классы дают только владения из таблицы мультикласса
  getCharClassPairs(char).forEach(function(pair, pi) {
    var ca = pi > 0 ? edData(char).MULTICLASS_PROFICIENCIES[pair.cls] : edData(char).CLASS_ARMOR_PROFS[pair.cls];
    if (ca) {
      (ca.armor  || []).forEach(function(t){ addArmor(t,  "class"); });
      (ca.weapon || []).forEach(function(t){ addWeapon(t, "class"); });
    }
    if (pair.sub && edData(char).SUBCLASS_ARMOR[pair.cls] && edData(char).SUBCLASS_ARMOR[pair.cls][pair.sub]) {
      var sa = edData(char).SUBCLASS_ARMOR[pair.cls][pair.sub];
      (sa.armor  || []).forEach(function(t){ addArmor(t,  "subclass"); });
      (sa.weapon || []).forEach(function(t){ addWeapon(t, "subclass"); });
    }
  });
  // Черты (FIN-1): effects type:"armor" — Знаток лёгких/средних/тяжёлых доспехов.
  // Без этого владение от черты стиралось бы при каждом пересчёте из источников.
  // E24-3: справочник по редакции (2024 — FEATS_2024) с фолбэком на 2014; type:"weapon" —
  // «Владение воинским оружием» 2024.
  if (Array.isArray(char.feats) && typeof FEATS_DATA !== "undefined") {
    var featDefs = (typeof edData === "function") ? edData(char).FEATS_DATA : FEATS_DATA;
    char.feats.forEach(function(f) {
      var def = f && featDefs.find(function(d){ return d.id === f.id; });
      if (!def && featDefs !== FEATS_DATA) def = f && FEATS_DATA.find(function(d){ return d.id === f.id; });
      ((def && def.effects) || []).forEach(function(eff) {
        if (eff.type === "armor") addArmor(eff.value, "feat");
        else if (eff.type === "weapon") addWeapon(eff.value, "feat");
      });
    });
  }
  // Custom
  (p.armorCustom  || []).forEach(function(t){ addArmor(t,  "custom"); });
  (p.weaponCustom || []).forEach(function(t){ addWeapon(t, "custom"); });

  p.armorSources  = ar;
  p.weaponSources = wp;
  p.armor  = Object.keys(ar).filter(function(k){ return ar[k].length > 0; });
  p.weapon = Object.keys(wp).filter(function(k){ return wp[k].length > 0; });

  // Конкретные оружия
  var specs = [];
  var seen = {};
  function addSpec(name, source) {
    if (!name || seen[name]) return;
    seen[name] = true;
    specs.push({ name: name, source: source });
  }
  if (char.race && typeof RACE_WEAPONS_SPECIFIC !== "undefined" && RACE_WEAPONS_SPECIFIC[char.race]) {
    RACE_WEAPONS_SPECIFIC[char.race].forEach(function(n){ addSpec(n, "race"); });
  }
  // FIN-2: конкретные владения классов (скимитар друида, короткий меч монаха…)
  getCharClassPairs(char).forEach(function(pair, pi) {
    var list = pi > 0 ? (edData(char).MULTICLASS_PROFICIENCIES[pair.cls] || {}).specific
      : edData(char).CLASS_WEAPONS_SPECIFIC[pair.cls];
    (list || []).forEach(function(n){ addSpec(n, "class"); });
  });
  // Custom specifics — сохранены в самом массиве
  (p.specificWeapons || []).forEach(function(w){
    if (w && w.source === "custom") addSpec(w.name, "custom");
  });
  p.specificWeapons = specs;
}
