// ПРОП-1: property-тесты. Генератор случайных персонажей на сидированном ГПСЧ
// (mulberry32) — прогон воспроизводим: при провале в сообщении сид и номер случая.
// Каждое свойство — {desc, fn}; fn возвращает true или строку с причиной.
// Гоняет headless.js (БЛОК «prop»), в node и в runner.html одинаково.

window.PROP_CASES = (function(){
  var N = 200;

  function rng(seed) {
    var s = seed >>> 0;
    return function() {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function int(r, lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function short(x) { var s = JSON.stringify(x); return s.length > 400 ? s.slice(0, 400) + "…" : s; }

  var RACES = ["", "Человек", "Холмовой дварф", "Эльф", "Людоящер", "Локсодон", "Тортл"];

  // Случайный персонаж: 1–3 класса, сумма уровней 1–20, характеристики 3–20,
  // доспех/щит, иногда истощение. ХП, кости и ячейки — через сами правила.
  function genChar(r) {
    var classes = Object.keys(CLASS_HIT_DICE);
    var n = r() < 0.7 ? 1 : int(r, 2, 3);
    var left = int(r, n, 20), total = left, entries = [];
    for (var i = 0; i < n; i++) {
      var lv = (i === n - 1) ? left : int(r, 1, left - (n - i - 1));
      left -= lv;
      var cls;
      do { cls = pick(r, classes); } while (entries.some(function(e) { return e.class === cls; }));
      var subs = SUBCLASSES[cls] || [];
      entries.push({ class: cls, level: lv, subclass: (subs.length && r() < 0.7) ? pick(r, subs) : "" });
    }
    var c = clone(DEFAULT_CHARACTER);
    c.id = int(r, 1, 1e9);
    c.name = "Проп " + c.id;
    c.edition = r() < 0.8 ? "2014" : "2024";
    if (c.edition === "2024") entries.forEach(function(e) { e.subclass = ""; });
    c.class = entries[0].class;
    c.subclass = entries[0].subclass;
    c.level = total;
    c.classes = (n > 1 || r() < 0.5) ? entries : [];
    c.race = pick(r, RACES);
    ["str", "dex", "con", "int", "wis", "cha"].forEach(function(k) { c.stats[k] = int(r, 3, 20); });
    c.combat.hpMax = Math.max(1, rulesMaxHPBase(c, getMod(c.stats.con)));
    c.combat.hpDice = rulesHitDiceLabel(c);
    c.combat.armorId = pick(r, ARMOR_PRESETS).id;
    c.combat.hasShield = r() < 0.3;
    if (r() < 0.15) c.conditions.push("exhaustion_" + int(r, 1, 5));
    c.combat.hpCurrent = int(r, 0, rulesEffectiveHpMax(c));
    c.combat.hpTemp = r() < 0.3 ? int(r, 1, 10) : 0;
    rulesApplySpellSlots(c);
    return c;
  }

  // «Старое сохранение»: случайная версия схемы и выброшенные поля
  function genLegacy(r) {
    var c = genChar(r);
    c.schemaVersion = int(r, 0, SCHEMA_VERSION - 1);
    Object.keys(c).forEach(function(k) {
      if (k !== "class" && k !== "level" && k !== "name" && k !== "schemaVersion" && r() < 0.2) delete c[k];
    });
    return c;
  }

  function levelSum(c) {
    return (c.classes && c.classes.length) ? c.classes.reduce(function(s, e) { return s + e.level; }, 0) : c.level;
  }

  // Инварианты ХП, отметок смерти и костей хитов после любого шага
  function hpInvariant(c) {
    var cb = c.combat, max = rulesEffectiveHpMax(c);
    if (!(cb.hpCurrent >= 0 && cb.hpCurrent <= max)) return "hpCurrent " + cb.hpCurrent + " вне 0…" + max;
    if (!((cb.hpTemp || 0) >= 0)) return "hpTemp " + cb.hpTemp;
    var ds = c.deathSaves;
    if (!ds || ds.successes.length !== 3 || ds.failures.length !== 3) return "deathSaves не по 3 отметки";
    if (cb.hpCurrent > 0) {
      if ((c.conditions || []).indexOf("unconscious") !== -1) return "ХП > 0, но «без сознания»";
      if (ds.successes.concat(ds.failures).some(Boolean)) return "ХП > 0, но есть отметки спасбросков";
    }
    var spent = cb.hpDiceSpent || 0, by = cb.hpDiceSpentBy || {}, pool = rulesHitDicePool(c);
    if (spent < 0 || spent > levelSum(c)) return "hpDiceSpent " + spent + " вне 0…" + levelSum(c);
    var sum = 0;
    for (var d in by) {
      if (by[d] > (pool[d] || 0)) return "потрачено к" + d + ": " + by[d] + " > пула " + (pool[d] || 0);
      sum += by[d];
    }
    if (sum !== spent) return "сумма hpDiceSpentBy " + sum + " ≠ hpDiceSpent " + spent;
    return true;
  }

  function slotsInvariant(c) {
    var sp = c.spells;
    for (var i = 1; i <= 9; i++) {
      var m = sp.slots[i], u = sp.slotsUsed[i];
      if (!(m >= 0) || m !== Math.floor(m)) return "slots[" + i + "] = " + m;
      if (!(u >= 0 && u <= m)) return "slotsUsed[" + i + "] = " + u + " при максимуме " + m;
    }
    if (!(sp.pactUsed >= 0 && sp.pactUsed <= sp.pactSlots)) return "pactUsed " + sp.pactUsed + " при pactSlots " + sp.pactSlots;
    return true;
  }

  // Прогон свойства: N случаев, первый провал — с сидом, номером и персонажем
  function forAll(seed, gen, check) {
    var r = rng(seed);
    for (var i = 0; i < N; i++) {
      var x = gen(r), before = short(x), res;
      try { res = check(x, r); } catch (e) { res = "EXC: " + (e && e.message || e); }
      if (res !== true) return "сид " + seed + ", случай " + i + ": " + res + " · вход: " + before;
    }
    return true;
  }

  var HP_OPS = ["damage", "damage", "heal", "deathSave", "shortRest", "longRest"];

  return [
    { desc: "миграция идемпотентна: повторный migrateCharacter ничего не меняет", fn: function() {
      return forAll(101, genLegacy, function(x) {
        var m1 = migrateCharacter(clone(x));
        if (m1.schemaVersion !== SCHEMA_VERSION) return "schemaVersion " + m1.schemaVersion;
        var m2 = migrateCharacter(clone(m1));
        return JSON.stringify(m1) === JSON.stringify(m2) || "второй прогон изменил персонажа";
      });
    }},
    { desc: "миграция достраивает все поля DEFAULT_CHARACTER с верным типом", fn: function() {
      return forAll(102, genLegacy, function(x) {
        var m = migrateCharacter(clone(x));
        for (var k in DEFAULT_CHARACTER) {
          var d = DEFAULT_CHARACTER[k];
          if (m[k] === undefined) return "нет поля " + k;
          if (Array.isArray(d) !== Array.isArray(m[k])) return "поле " + k + ": массив ≠ массив";
          if (d && typeof d === "object" && !Array.isArray(d) && (!m[k] || typeof m[k] !== "object")) return "поле " + k + " не объект";
        }
        return true;
      });
    }},
    { desc: "экспорт → импорт персонажа возвращает того же персонажа", fn: function() {
      return forAll(103, function(r) {
        var c = migrateCharacter(genChar(r));
        var k = int(r, 0, 6);
        for (var i = 0; i < k; i++) {
          var s = clone(pick(r, SPELLS_BASE));
          if (r() < 0.3) s.prepared = true;
          c.spells.mySpells.push(s);
        }
        return _sanitizeImportedChar(c);
      }, function(a) {
        var env = JSON.parse(_buildCharEnvelope(a));
        var list = _extractCharsFromImport(env);
        if (!list || list.length !== 1 || !_isValidImportedChar(list[0])) return "конверт не прошёл проверку импорта";
        var b = _sanitizeImportedChar(migrateCharacter(clone(list[0])));
        return JSON.stringify(a) === JSON.stringify(b) || "различие после круга: " + short(b);
      });
    }},
    { desc: "ХП, отметки смерти и кости хитов держат инварианты на цепочке урона, лечения и отдыхов", fn: function() {
      return forAll(104, genChar, function(c, r) {
        var log = [];
        for (var step = 0; step < 30; step++) {
          var op = pick(r, HP_OPS);
          if (op === "damage") { var d = int(r, 0, 40), cr = r() < 0.2; log.push("урон " + d + (cr ? " крит" : "")); rulesApplyDamage(c, d, { crit: cr }); }
          else if (op === "heal") { var h = int(r, 1, 30); log.push("лечение " + h); rulesSetHp(c, c.combat.hpCurrent + h); }
          else if (op === "deathSave") { var ro = int(r, 1, 20); log.push("спасбросок " + ro); rulesDeathSave(c, ro); }
          else if (op === "shortRest") {
            var nd = int(r, 0, 4), rolls = [];
            for (var j = 0; j < nd; j++) rolls.push(int(r, 1, 12));
            log.push("короткий отдых " + nd); rulesShortRest(c, { rolls: rolls });
          }
          else { log.push("продолжительный отдых"); rulesLongRest(c); }
          var inv = hpInvariant(c);
          if (inv !== true) return inv + " · шаги: " + log.join(", ");
        }
        return true;
      });
    }},
    { desc: "ячейки: целые, потрачено ≤ максимума, повторный пересчёт ничего не меняет, продолжительный отдых всё возвращает", fn: function() {
      return forAll(105, genChar, function(c, r) {
        var inv = slotsInvariant(c);
        if (inv !== true) return inv;
        for (var i = 1; i <= 9; i++) c.spells.slotsUsed[i] = int(r, 0, (c.spells.slots[i] || 0) + 2);
        c.spells.pactUsed = int(r, 0, (c.spells.pactSlots || 0) + 2);
        rulesApplySpellSlots(c);
        inv = slotsInvariant(c);
        if (inv !== true) return "после пересчёта: " + inv;
        var snap = JSON.stringify(c.spells);
        rulesApplySpellSlots(c);
        if (JSON.stringify(c.spells) !== snap) return "второй пересчёт изменил ячейки";
        c.combat.hpCurrent = Math.max(1, c.combat.hpCurrent);
        rulesLongRest(c);
        for (i = 1; i <= 9; i++) if (c.spells.slotsUsed[i]) return "после отдыха slotsUsed[" + i + "] = " + c.spells.slotsUsed[i];
        return !c.spells.pactUsed || "после отдыха pactUsed = " + c.spells.pactUsed;
      });
    }},
    { desc: "кости хитов: ручной выбор не тратит больше пула, продолжительный отдых возвращает по правилу", fn: function() {
      return forAll(106, genChar, function(c, r) {
        for (var k = 0; k < 4; k++) {
          var dice = [], n = int(r, 0, 25);
          for (var j = 0; j < n; j++) dice.push(pick(r, [6, 8, 10, 12]));
          rulesShortRest(c, { dice: dice, rolls: dice.map(function(d) { return int(r, 1, d); }) });
          var inv = hpInvariant(c);
          if (inv !== true) return "короткий отдых №" + (k + 1) + ": " + inv;
        }
        var before = c.combat.hpDiceSpent;
        c.combat.hpCurrent = Math.max(1, c.combat.hpCurrent);
        var res = rulesLongRest(c);
        var want = c.edition === "2024" ? before : Math.min(before, Math.max(1, Math.floor(c.level / 2)));
        if (res.hitDiceRestored !== want) return "вернулось " + res.hitDiceRestored + ", ожидалось " + want;
        return hpInvariant(c);
      });
    }},
    { desc: "КД: целое 0…40; тяжёлый доспех не зависит от ЛОВ; обычный щит даёт ровно +2", fn: function() {
      return forAll(107, genChar, function(c, r) {
        var a = rulesAC(c).ac;
        if (!(a >= 0 && a <= 40) || a !== Math.floor(a)) return "КД " + a;
        var preset = ARMOR_PRESETS.find(function(p) { return p.id === c.combat.armorId; });
        var natural = ["Людоящер", "Локсодон", "Тортл"].indexOf(c.race) !== -1;
        if (preset && preset.type === "heavy" && !natural) {
          var c2 = clone(c); c2.stats.dex = int(r, 3, 20);
          var a2 = rulesAC(c2).ac;
          if (a2 !== a) return "тяжёлый доспех: ЛОВ " + c.stats.dex + "→" + c2.stats.dex + " сменила КД " + a + "→" + a2;
        }
        if (preset && preset.id !== "none") {
          var on = clone(c), off = clone(c);
          on.combat.hasShield = true; off.combat.hasShield = false;
          var diff = rulesAC(on).ac - rulesAC(off).ac;
          if (diff !== 2) return "щит дал " + diff + " (доспех " + preset.id + ", раса «" + c.race + "»)";
        }
        return true;
      });
    }}
  ];
})();
