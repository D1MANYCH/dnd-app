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

if (typeof window !== "undefined") {
  window.SPELL_EFFECTS = SPELL_EFFECTS;
  window.getSpellEffect = getSpellEffect;
  window.scaleFormula = scaleFormula;
  window.durationToRounds = durationToRounds;
  window.flatFormulaTotal = flatFormulaTotal;
  window.damageFormulaFor = damageFormulaFor;
}
