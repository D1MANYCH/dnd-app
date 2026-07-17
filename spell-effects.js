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
//   summon:   { companionType:"familiar"|"mount"|"summoned"|...,
//               picker:"familiarForms" | srdSlug:"..." | prefill:{...} }
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

  // ── Урон (потребитель в CAST-4) ─────────────────────────────────────────────
  "Огненный шар":    { damage: { formula: "8к6", upcast: "1к6", save: "dex", halfOnSave: true } },

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

  // ── Призывы (потребитель в CAST-1/CAST-5) ───────────────────────────────────
  "Поиск фамильяра": { summon: { companionType: "familiar", picker: "familiarForms" } }
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

if (typeof window !== "undefined") {
  window.SPELL_EFFECTS = SPELL_EFFECTS;
  window.getSpellEffect = getSpellEffect;
  window.scaleFormula = scaleFormula;
  window.durationToRounds = durationToRounds;
  window.flatFormulaTotal = flatFormulaTotal;
}
