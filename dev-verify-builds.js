// dev-verify-builds.js — DEV-инструмент верификации автозаполнения applyBuild.
// НЕ подключать в index.html (это диагностика). Использовать так:
//   В консоли (или через preview_eval):
//     await fetch("dev-verify-builds.js").then(r=>r.text()).then(eval);
//     verifyAllBuilds();           // таблица всех 36 билдов
//     verifyBuild("wizard-evoker"); // одиночный билд с разбором падений
//
// Карта проверок отражает что ДОЛЖЕН делать applyBuild() для любого билда:
// meta (name/class/race/bg/align/subclass), stats, saves(=2), skills(>0), HP=hitDie+conMod,
// AC>=10, spells.stat (по классу→ИНТ/МУД/ХАР), slots[1]>=1, mySpells, proficiencies, inventory, backstory.

(function(){
  var SPELL_CASTERS = ["Волшебник","Жрец","Друид","Бард","Паладин","Следопыт","Чародей","Колдун"];
  var EXPECTED_SPELL_STAT = {
    "Волшебник":"ИНТ","Жрец":"МУД","Друид":"МУД","Бард":"ХАР",
    "Паладин":"ХАР","Следопыт":"МУД","Чародей":"ХАР","Колдун":"ХАР"
  };
  // Классы, где владение бронёй НЕ обязательно (PHB): волшебник/чародей/колдун без любой брони,
  // монах не использует броню как основу AC.
  var NO_ARMOR_REQUIRED = { "Волшебник":1,"Чародей":1,"Колдун":1,"Монах":1 };
  // Hit dice по PHB (CLASS_HIT_DICE не доступен через window — хардкод).
  var CLASS_HD = {
    "Варвар":12, "Воин":10, "Паладин":10, "Следопыт":10,
    "Бард":8, "Жрец":8, "Друид":8, "Монах":8, "Плут":8, "Колдун":8,
    "Волшебник":6, "Чародей":6
  };
  // Классы, у которых заклинания/слоты появляются только с 2-го уровня — на 1 ур. slots[1]=0 норма.
  var SPELLS_FROM_LVL_2 = { "Паладин":1, "Следопыт":1 };

  function _check(name, ok, value, expected) {
    return { field: name, ok: !!ok, value: value, expected: expected };
  }

  function verifyBuild(buildId) {
    if (typeof applyBuild !== "function") return { buildId: buildId, error: "applyBuild not defined" };
    var b = window.getBuildById && window.getBuildById(buildId);
    if (!b) return { buildId: buildId, error: "build not found" };
    applyBuild(buildId);
    var ch = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
    if (!ch) return { buildId: buildId, error: "no current char after applyBuild" };

    var checks = [];

    // === META ===
    checks.push(_check("name", ch.name === b.title, ch.name, b.title));
    checks.push(_check("class", ch.class === b.className, ch.class, b.className));
    checks.push(_check("race (non-empty)", !!ch.race, ch.race, "(non-empty)"));
    var raceSel = document.getElementById("char-race");
    var raceOpts = raceSel ? Array.prototype.map.call(raceSel.options, function(o){ return o.value; }) : [];
    checks.push(_check("race in <select> options", raceOpts.indexOf(ch.race) >= 0, ch.race, "matches option"));
    checks.push(_check("background (non-empty)", !!ch.background, ch.background, "(non-empty)"));
    checks.push(_check("alignment (non-empty)", !!ch.alignment, ch.alignment, "(non-empty)"));
    if (b.subclass) {
      checks.push(_check("subclass", ch.subclass === b.subclass, ch.subclass, b.subclass));
    }

    // === STATS ===
    var expectedStats = b.stats || {};
    Object.keys(expectedStats).forEach(function(k){
      checks.push(_check("stats." + k, ch.stats[k] === expectedStats[k], ch.stats[k], expectedStats[k]));
    });

    // === SAVES (ровно 2 true по классу) ===
    var trueSaves = Object.keys(ch.saves||{}).filter(function(k){ return ch.saves[k]; });
    checks.push(_check("saves count == 2", trueSaves.length === 2, trueSaves.length + " (" + trueSaves.join(",") + ")", 2));

    // === SKILLS (>0) ===
    var trueSkills = Object.keys(ch.skills||{}).filter(function(k){ return ch.skills[k]; });
    checks.push(_check("skills count >0", trueSkills.length > 0, trueSkills.length, ">0"));

    // === HP / AC ===
    var hd = CLASS_HD[b.className] || 8;
    var conMod = Math.floor(((ch.stats.con||10)-10)/2);
    checks.push(_check("hpMax == hd + conMod", ch.combat.hpMax === hd + conMod, ch.combat.hpMax, hd + conMod));
    checks.push(_check("hpCurrent == hpMax", ch.combat.hpCurrent === ch.combat.hpMax, ch.combat.hpCurrent, ch.combat.hpMax));
    checks.push(_check("ac >= 10", ch.combat.ac >= 10, ch.combat.ac, ">=10"));

    // === SPELLS (только для caster-классов) ===
    if (SPELL_CASTERS.indexOf(b.className) >= 0) {
      var expStat = EXPECTED_SPELL_STAT[b.className];
      checks.push(_check("spells.stat", ch.spells.stat === expStat, ch.spells.stat, expStat));
      var selVal = document.getElementById("spell-stat") ? document.getElementById("spell-stat").value : "";
      checks.push(_check("<select spell-stat> sync", selVal === expStat, selVal, expStat));
      var dc = document.getElementById("spell-dc") ? document.getElementById("spell-dc").value : "";
      checks.push(_check("spell-dc computed", !!dc && dc !== "0" && dc !== "8", dc, ">8"));
      var atk = document.getElementById("spell-attack") ? document.getElementById("spell-attack").value : "";
      checks.push(_check("spell-attack computed", !!atk && atk !== "+0", atk, "non-zero"));
      var slot1 = (ch.spells.slots && ch.spells.slots[1]) || 0;
      // Паладин/Следопыт получают первые слоты только с 2 ур (PHB) — допускается 0.
      if (SPELLS_FROM_LVL_2[b.className]) {
        checks.push(_check("slots[1] (lvl 2+ class)", true, slot1, "0 ok @lvl 1"));
      } else {
        checks.push(_check("slots[1] >= 1", slot1 >= 1, slot1, ">=1"));
      }
      if (b.startingSpells) {
        var expectedSpells = (b.startingSpells.cantrips||[]).length + (b.startingSpells.known||[]).length;
        var totalSpells = (ch.spells.mySpells||[]).length;
        checks.push(_check("mySpells count", totalSpells === expectedSpells, totalSpells, expectedSpells));
      }
    }

    // === PROFICIENCIES ===
    var armorCount = (ch.proficiencies.armor||[]).length;
    if (NO_ARMOR_REQUIRED[b.className]) {
      checks.push(_check("armor profs (опц.)", true, armorCount, "0+"));
    } else {
      checks.push(_check("armor profs >0", armorCount > 0, armorCount, ">0"));
    }
    var weaponCount = (ch.proficiencies.weapon||[]).length + (ch.proficiencies.specificWeapons||[]).length;
    checks.push(_check("weapon profs >0", weaponCount > 0, weaponCount, ">0"));
    var langCount = (ch.proficiencies.languages||[]).length
      + ((ch.proficiencies.languageChoices && ch.proficiencies.languageChoices.race)||[]).length
      + ((ch.proficiencies.languageChoices && ch.proficiencies.languageChoices.background)||[]).length;
    checks.push(_check("languages >=1", langCount >= 1, langCount, ">=1"));

    // === INVENTORY ===
    var invCount = 0;
    ['weapon','armor','potion','scroll','tool','material','other'].forEach(function(k){
      invCount += (ch.inventory[k]||[]).length;
    });
    checks.push(_check("inventory items >0", invCount > 0, invCount, ">0"));

    // === BACKSTORY / NOTES ===
    // Хранится в notesV2.sections.backstory (BUILD-FIX-4), а не в ch.backstory.
    var bs = (ch.notesV2 && ch.notesV2.sections && ch.notesV2.sections.backstory) || ch.backstory || "";
    checks.push(_check("notesV2.backstory non-empty", !!bs.length, bs.length + " chars", ">0"));
    var entriesCount = (ch.notesV2 && ch.notesV2.entries||[]).length;
    checks.push(_check("notesV2.entries >=1", entriesCount >= 1, entriesCount, ">=1"));

    // BUILD-NOTES-5: каждая категория вариантов >=3 (appearance/personality/ideals/bonds/flaws/hooks/backstories).
    var variantKeys = ["appearance","personality","ideals","bonds","flaws","hooks","backstories"];
    var bn = b.notes || (window.BUILD_NOTES && window.normalizeBuildNotes && window.normalizeBuildNotes(window.BUILD_NOTES[buildId]));
    if (bn) {
      variantKeys.forEach(function(vk){
        var arr = bn[vk] || [];
        checks.push(_check("notes." + vk + " >=3", arr.length >= 3, arr.length, ">=3"));
      });
      // BUILD-NOTES-6.6: минимальная длина варианта.
      // 5 текстовых полей >=120 симв., backstories >=400 симв., hooks без проверки длины.
      var LEN_MIN = { appearance:120, personality:120, ideals:120, bonds:120, flaws:120, backstories:400 };
      Object.keys(LEN_MIN).forEach(function(vk){
        var arr = bn[vk] || [];
        var min = LEN_MIN[vk];
        var shortIdx = [];
        arr.forEach(function(s, i){
          var len = (typeof s === "string") ? s.length : 0;
          if (len < min) shortIdx.push("#" + i + "(" + len + ")");
        });
        checks.push(_check(
          "notes." + vk + " len>=" + min,
          shortIdx.length === 0,
          shortIdx.length ? shortIdx.join(",") : "all >=" + min,
          "all >=" + min
        ));
      });
    } else {
      checks.push(_check("notes object exists", false, "(missing)", "object"));
    }

    var failed = checks.filter(function(c){ return !c.ok; });
    return {
      buildId: buildId,
      title: b.title,
      className: b.className,
      subclass: b.subclass || "(opens at 2+)",
      passed: checks.length - failed.length,
      total: checks.length,
      failed: failed
    };
  }

  function verifyAllBuilds() {
    var ids = (window.CHARACTER_BUILDS || []).map(function(b){ return b.id; });
    var results = ids.map(verifyBuild);
    var ok = results.filter(function(r){ return !r.error && (r.failed||[]).length === 0; });
    var withErr = results.filter(function(r){ return !!r.error; });
    var withFail = results.filter(function(r){ return !r.error && (r.failed||[]).length > 0; });
    var summary = {
      total: results.length,
      fullPass: ok.length,
      withFailures: withFail.length,
      withErrors: withErr.length
    };
    // Compact fail-table for быстрого взгляда
    var failTable = withFail.map(function(r){
      return {
        id: r.buildId,
        cls: r.className,
        sub: r.subclass,
        score: r.passed + "/" + r.total,
        firstFails: r.failed.slice(0, 3).map(function(f){
          return f.field + ": " + JSON.stringify(f.value) + " ≠ " + JSON.stringify(f.expected);
        })
      };
    });
    return { summary: summary, failTable: failTable, errors: withErr, fullResults: results };
  }

  window.verifyBuild = verifyBuild;
  window.verifyAllBuilds = verifyAllBuilds;
  console.log("[dev-verify-builds] loaded. Try: verifyAllBuilds() or verifyBuild('wizard-evoker')");
})();
