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
  // ── Баффы (мост к EFFECTS_DATA — потребитель в CAST-1) ─────────────────────
  "Доспехи мага":    { effects: ["mage_armor"],   duration: { value: 8, unit: "hour" } },

  // ── Урон (потребитель в CAST-4) ─────────────────────────────────────────────
  "Огненный шар":    { damage: { formula: "8к6", upcast: "1к6", save: "dex", halfOnSave: true } },

  // ── Лечение и временные ХП (потребитель в CAST-3) ───────────────────────────
  "Лечение ран":     { heal: { formula: "1к8", upcast: "1к8", addSpellMod: true } },
  "Псевдожизнь":     { tempHp: { formula: "1к4+4", upcast: "5" }, duration: { value: 1, unit: "hour" } },

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

if (typeof window !== "undefined") {
  window.SPELL_EFFECTS = SPELL_EFFECTS;
  window.getSpellEffect = getSpellEffect;
  window.scaleFormula = scaleFormula;
  window.durationToRounds = durationToRounds;
}
