// ============================================================
// app-proficiencies.js — Владения: языки и инструменты (слоты выбора
// по источникам), владение доспехами и оружием, свои записи
// ============================================================

// ============================================
// ВЛАДЕНИЯ КАТЕГОРИЗОВАННЫЕ — ЯЗЫКИ (Фаза 1)
// ============================================
// STYLE-7c: пара «иконка + подпись». Иконка берётся лениво (dndIcoHtml в момент
// отрисовки): на верхнем уровне модуля icons.js ещё может быть не загружен.
var PROF_SOURCE_LABELS = {
  race:       ["user",   "Раса"],
  class:      ["combat", "Класс"],
  subclass:   ["grad",   "Подкласс"],
  background: ["scroll", "Предыст."],
  feat:       ["target", "Черта"],
  custom:     ["edit",   "Своё"]
};
function profSourceLabel(src) {
  var v = PROF_SOURCE_LABELS[src];
  return v ? dndIcoHtml(v[0], 12) + " " + v[1] : (src || "");
}
var LANG_CAT_TITLES = {
  standard: "Стандартные",
  exotic:   "Экзотические",
  secret:   "Тайные",
  custom:   "Свои"
};

function getLanguageChoiceSlots(char) {
  var out = [];
  if (char.race && typeof RACE_LANGUAGES !== "undefined" && RACE_LANGUAGES[char.race]) {
    var r = RACE_LANGUAGES[char.race];
    if (r.choice > 0) {
      var picks = (char.proficiencies.languageChoices.race) || [];
      var rem = r.choice - picks.length;
      if (rem > 0) out.push({ key:"race", label:"" + dndIcoHtml("user", 12) + " Раса", remaining:rem, total:r.choice });
    }
  }
  // Подклассы
  getCharClassPairs(char).forEach(function(p) {
    if (p.sub && typeof SUBCLASS_LANGUAGES !== "undefined" && SUBCLASS_LANGUAGES[p.cls] && SUBCLASS_LANGUAGES[p.cls][p.sub]) {
      var sd = SUBCLASS_LANGUAGES[p.cls][p.sub];
      if (sd.choice > 0) {
        var subKey = "subclass_" + p.cls + "_" + p.sub;
        var subPicks = (char.proficiencies.languageChoices[subKey]) || [];
        var rem = sd.choice - subPicks.length;
        if (rem > 0) out.push({ key:subKey, label:"" + dndIcoHtml("grad", 12) + " " + p.sub, remaining:rem, total:sd.choice });
      }
    }
  });
  if (char.background && typeof BACKGROUND_SKILLS !== "undefined" && BACKGROUND_SKILLS[char.background]) {
    var bg = BACKGROUND_SKILLS[char.background];
    if (bg.languages > 0) {
      var bgPicks = (char.proficiencies.languageChoices.background) || [];
      var rem = bg.languages - bgPicks.length;
      if (rem > 0) out.push({ key:"background", label:"" + dndIcoHtml("scroll", 12) + " Предыстория", remaining:rem, total:bg.languages });
    }
  }
  return out;
}

function renderLanguages() {
  var box = $("languages-container");
  if (!box) return;
  if (!currentId) { box.innerHTML = ""; return; }
  var char = getCurrentChar();
  if (!char) { box.innerHTML = ""; return; }
  ensureLanguagesArray(char);
  recalcLanguagesFromSources(char);

  var groups = { standard:[], exotic:[], secret:[], custom:[] };
  char.proficiencies.languages.forEach(function(l) {
    var cat = l.category || "custom";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(l);
  });

  var html = "";
  ["standard","exotic","secret","custom"].forEach(function(cat) {
    var items = groups[cat] || [];
    if (cat === "custom" && items.length === 0) return;
    html += '<div class="prof-cat-group">';
    html += '<div class="prof-cat-title">' + LANG_CAT_TITLES[cat] + '</div>';
    if (items.length === 0) {
      html += '<div class="prof-empty">— нет —</div>';
    } else {
      html += '<div class="prof-chips">';
      items.forEach(function(l) {
        var info = findLangInCatalog(l.name);
        var title = info ? info.desc : "";
        var rmBtn = (l.source === "custom")
          ? '<button type="button" class="prof-chip-remove" aria-label="Убрать" onclick="removeCustomLanguage(\'' + escapeHtml(l.name) + '\')">×</button>'
          : '';
        html += '<span class="prof-chip" data-source="' + l.source + '" title="' + escapeHtml(title) + '">' +
          escapeHtml(l.name) +
          '<span class="prof-chip-src">' + profSourceLabel(l.source) + '</span>' +
          rmBtn + '</span>';
      });
      html += '</div>';
    }
    html += '</div>';
  });

  // Слоты выбора
  var pending = getLanguageChoiceSlots(char);
  var alreadyKnown = {};
  char.proficiencies.languages.forEach(function(l){ alreadyKnown[l.name] = true; });
  pending.forEach(function(slot) {
    html += '<div class="prof-cat-group prof-choice-pending">';
    html += '<div class="prof-cat-title">' + slot.label + ': выбери язык <span class="prof-cat-hint">(' + slot.remaining + ' из ' + slot.total + ')</span></div>';
    html += '<div class="prof-add-row">';
    html += '<select id="lang-choice-' + slot.key + '"><option value="">— выбрать —</option>';
    ["standard","exotic"].forEach(function(c) {
      html += '<optgroup label="' + LANG_CAT_TITLES[c] + '">';
      (LANGUAGE_CATALOG[c]||[]).forEach(function(l) {
        if (alreadyKnown[l.name]) return;
        html += '<option value="' + escapeHtml(l.name) + '">' + escapeHtml(l.name) + '</option>';
      });
      html += '</optgroup>';
    });
    html += '</select>';
    html += '<button onclick="addChoiceLanguage(\'' + slot.key + '\')">' + dndIcoHtml("plus", 13) + ' Добавить</button>';
    html += '</div></div>';
  });

  // Своё / из каталога
  html += '<div class="prof-cat-group">';
  html += '<div class="prof-cat-title">' + dndIcoHtml("plus", 13) + ' Добавить язык</div>';
  html += '<div class="prof-add-row">';
  html += '<select id="lang-custom-pick"><option value="">— из каталога —</option>';
  ["standard","exotic","secret"].forEach(function(c) {
    html += '<optgroup label="' + LANG_CAT_TITLES[c] + '">';
    (LANGUAGE_CATALOG[c]||[]).forEach(function(l) {
      html += '<option value="' + escapeHtml(l.name) + '">' + escapeHtml(l.name) + '</option>';
    });
    html += '</optgroup>';
  });
  html += '</select>';
  html += '<input type="text" id="lang-custom-name" placeholder="или свой вариант…">';
  html += '<button onclick="addCustomLanguage()">' + dndIcoHtml("plus", 13) + ' Добавить</button>';
  html += '</div></div>';

  box.innerHTML = html;
}

function addChoiceLanguage(key) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var sel = $("lang-choice-" + key);
  if (!sel || !sel.value) return;
  ensureLanguagesArray(char);
  if (!char.proficiencies.languageChoices[key]) char.proficiencies.languageChoices[key] = [];
  if (char.proficiencies.languageChoices[key].indexOf(sel.value) === -1) {
    char.proficiencies.languageChoices[key].push(sel.value);
  }
  renderLanguages();
  saveToLocal();
}

function addCustomLanguage() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  ensureLanguagesArray(char);
  var pick = $("lang-custom-pick");
  var name = $("lang-custom-name");
  var val = (name && name.value.trim()) || (pick && pick.value) || "";
  if (!val) return;
  var exists = char.proficiencies.languages.some(function(l){ return l.name === val; });
  if (exists) {
    if (typeof showToast === "function") showToast("Язык уже есть", "info");
    return;
  }
  var info = findLangInCatalog(val);
  char.proficiencies.languages.push({
    name: val,
    source: "custom",
    category: info ? info.category : "custom"
  });
  if (name) name.value = "";
  if (pick) pick.value = "";
  renderLanguages();
  saveToLocal();
}

function removeCustomLanguage(name) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  ensureLanguagesArray(char);
  char.proficiencies.languages = char.proficiencies.languages.filter(function(l) {
    return !(l.source === "custom" && l.name === name);
  });
  renderLanguages();
  saveToLocal();
}

// ============================================
// ВЛАДЕНИЯ КАТЕГОРИЗОВАННЫЕ — ИНСТРУМЕНТЫ (Фаза 2)
// ============================================
var TOOL_CAT_TITLES = {
  artisan:  "Ремесленные",
  gaming:   "Игровые наборы",
  musical:  "Музыкальные",
  vehicles: "Транспорт",
  other:    "Прочие",
  custom:   "Свои"
};

function getToolChoiceSlots(char) {
  var out = [];
  // Раса
  if (char.race && typeof RACE_TOOLS !== "undefined" && RACE_TOOLS[char.race]) {
    var r = RACE_TOOLS[char.race];
    (r.choices || []).forEach(function(slot, idx) {
      var key = "race_" + idx;
      var picks = (char.proficiencies.toolChoices[key]) || [];
      var rem = (slot.count || 1) - picks.length;
      if (rem > 0) out.push({
        key: key, label: "" + dndIcoHtml("user", 12) + " " + (slot.label || "Раса"),
        from: slot.from, options: slot.options,
        remaining: rem, total: slot.count || 1
      });
    });
  }
  // Класс и подкласс
  getCharClassPairs(char).forEach(function(p) {
    var cn = p.cls;
    if (typeof CLASS_TOOLS !== "undefined" && CLASS_TOOLS[cn]) {
      var c = CLASS_TOOLS[cn];
      (c.choices || []).forEach(function(slot, idx) {
        var key = "class_" + cn + "_" + idx;
        var picks = (char.proficiencies.toolChoices[key]) || [];
        var rem = (slot.count || 1) - picks.length;
        if (rem > 0) out.push({
          key: key, label: "" + dndIcoHtml("combat", 12) + " " + cn + ": " + (slot.label || ""),
          from: slot.from, options: slot.options,
          remaining: rem, total: slot.count || 1
        });
      });
    }
    if (p.sub && typeof SUBCLASS_TOOLS !== "undefined" && SUBCLASS_TOOLS[cn] && SUBCLASS_TOOLS[cn][p.sub]) {
      var sc = SUBCLASS_TOOLS[cn][p.sub];
      (sc.choices || []).forEach(function(slot, idx) {
        var key = "subclass_" + cn + "_" + p.sub + "_" + idx;
        var picks = (char.proficiencies.toolChoices[key]) || [];
        var rem = (slot.count || 1) - picks.length;
        if (rem > 0) out.push({
          key: key, label: "" + dndIcoHtml("grad", 12) + " " + p.sub + ": " + (slot.label || ""),
          from: slot.from, options: slot.options,
          remaining: rem, total: slot.count || 1
        });
      });
    }
  });
  // Предыстория
  if (char.background && typeof BACKGROUND_SKILLS !== "undefined" && BACKGROUND_SKILLS[char.background]) {
    var bg = BACKGROUND_SKILLS[char.background];
    var entries = (!Array.isArray(bg) && bg.tools) || [];
    entries.forEach(function(entry, idx) {
      var parsed = parseBackgroundToolEntry(entry);
      if (parsed.type === "slot") {
        var key = "bg_" + idx;
        var picks = (char.proficiencies.toolChoices[key]) || [];
        var rem = (parsed.count || 1) - picks.length;
        if (rem > 0) out.push({
          key: key, label: "" + dndIcoHtml("scroll", 12) + " Предыстория: " + entry,
          from: parsed.from, remaining: rem, total: parsed.count || 1
        });
      }
    });
  }
  return out;
}

function buildToolOptionsHtml(slot, alreadyKnown) {
  var html = "";
  var fromList = Array.isArray(slot.from) ? slot.from : [slot.from];
  if (slot.options && slot.options.length) {
    slot.options.forEach(function(name) {
      if (alreadyKnown[name]) return;
      html += '<option value="' + escapeHtml(name) + '">' + escapeHtml(name) + '</option>';
    });
  } else {
    fromList.forEach(function(cat) {
      html += '<optgroup label="' + (TOOL_CAT_TITLES[cat] || cat) + '">';
      (TOOL_CATALOG[cat] || []).forEach(function(t) {
        if (alreadyKnown[t.name]) return;
        html += '<option value="' + escapeHtml(t.name) + '">' + escapeHtml(t.name) + '</option>';
      });
      html += '</optgroup>';
    });
  }
  return html;
}

function renderTools() {
  var box = $("tools-container");
  if (!box) return;
  if (!currentId) { box.innerHTML = ""; return; }
  var char = getCurrentChar();
  if (!char) { box.innerHTML = ""; return; }
  ensureToolsArray(char);
  recalcToolsFromSources(char);

  var groups = { artisan:[], gaming:[], musical:[], vehicles:[], other:[], custom:[] };
  char.proficiencies.tools.forEach(function(t) {
    var cat = t.category || "custom";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(t);
  });

  var html = "";
  ["artisan","gaming","musical","vehicles","other","custom"].forEach(function(cat) {
    var items = groups[cat] || [];
    if (items.length === 0) return;
    html += '<div class="prof-cat-group">';
    html += '<div class="prof-cat-title">' + TOOL_CAT_TITLES[cat] + '</div>';
    html += '<div class="prof-chips">';
    items.forEach(function(t) {
      var info = findToolInCatalog(t.name);
      var title = info ? info.desc : "";
      var rmBtn = (t.source === "custom")
        ? '<button type="button" class="prof-chip-remove" aria-label="Убрать" onclick="removeCustomTool(\'' + escapeHtml(t.name).replace(/'/g,"\\'") + '\')">×</button>'
        : '';
      html += '<span class="prof-chip" data-source="' + t.source + '" title="' + escapeHtml(title) + '">' +
        escapeHtml(t.name) +
        '<span class="prof-chip-src">' + profSourceLabel(t.source) + '</span>' +
        rmBtn + '</span>';
    });
    html += '</div></div>';
  });

  // Слоты выбора
  var pending = getToolChoiceSlots(char);
  var alreadyKnown = {};
  char.proficiencies.tools.forEach(function(t){ alreadyKnown[t.name] = true; });
  pending.forEach(function(slot) {
    html += '<div class="prof-cat-group prof-choice-pending">';
    html += '<div class="prof-cat-title">' + slot.label + ' <span class="prof-cat-hint">(' + slot.remaining + ' из ' + slot.total + ')</span></div>';
    html += '<div class="prof-add-row">';
    html += '<select id="tool-choice-' + slot.key + '"><option value="">— выбрать —</option>';
    html += buildToolOptionsHtml(slot, alreadyKnown);
    html += '</select>';
    html += '<button onclick="addChoiceTool(\'' + slot.key + '\')">' + dndIcoHtml("plus", 13) + ' Добавить</button>';
    html += '</div></div>';
  });

  // Свой / из каталога
  html += '<div class="prof-cat-group">';
  html += '<div class="prof-cat-title">' + dndIcoHtml("plus", 13) + ' Добавить инструмент</div>';
  html += '<div class="prof-add-row">';
  html += '<select id="tool-custom-pick"><option value="">— из каталога —</option>';
  ["artisan","gaming","musical","vehicles","other"].forEach(function(c) {
    html += '<optgroup label="' + TOOL_CAT_TITLES[c] + '">';
    (TOOL_CATALOG[c]||[]).forEach(function(t) {
      html += '<option value="' + escapeHtml(t.name) + '">' + escapeHtml(t.name) + '</option>';
    });
    html += '</optgroup>';
  });
  html += '</select>';
  html += '<input type="text" id="tool-custom-name" placeholder="или свой вариант…">';
  html += '<button onclick="addCustomTool()">' + dndIcoHtml("plus", 13) + ' Добавить</button>';
  html += '</div></div>';

  box.innerHTML = html;
}

function addChoiceTool(slotKey) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  var sel = $("tool-choice-" + slotKey);
  if (!sel || !sel.value) return;
  ensureToolsArray(char);
  if (!char.proficiencies.toolChoices[slotKey]) char.proficiencies.toolChoices[slotKey] = [];
  if (char.proficiencies.toolChoices[slotKey].indexOf(sel.value) === -1) {
    char.proficiencies.toolChoices[slotKey].push(sel.value);
  }
  renderTools();
  saveToLocal();
}

function addCustomTool() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  ensureToolsArray(char);
  var pick = $("tool-custom-pick");
  var name = $("tool-custom-name");
  var val = (name && name.value.trim()) || (pick && pick.value) || "";
  if (!val) return;
  var exists = char.proficiencies.tools.some(function(t){ return t.name === val; });
  if (exists) {
    if (typeof showToast === "function") showToast("Инструмент уже есть", "info");
    return;
  }
  var info = findToolInCatalog(val);
  char.proficiencies.tools.push({
    name: val,
    source: "custom",
    category: info ? info.category : "custom"
  });
  if (name) name.value = "";
  if (pick) pick.value = "";
  renderTools();
  saveToLocal();
}

function removeCustomTool(name) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  ensureToolsArray(char);
  char.proficiencies.tools = char.proficiencies.tools.filter(function(t) {
    return !(t.source === "custom" && t.name === name);
  });
  renderTools();
  saveToLocal();
}

// ============================================
// ВЛАДЕНИЯ КАТЕГОРИЗОВАННЫЕ — ДОСПЕХИ И ОРУЖИЕ (Фаза 3b)
// ============================================
var ARMOR_TYPE_LABELS  = { light:"Лёгкие", medium:"Средние", heavy:"Тяжёлые", shield:"Щиты" };
var WEAPON_TYPE_LABELS = { simple:"Простое", martial:"Воинское" };

function renderArmorProf() {
  var box = $("armor-prof-container");
  if (!box) return;
  if (!currentId) { box.innerHTML = ""; return; }
  var char = getCurrentChar();
  if (!char) { box.innerHTML = ""; return; }
  recalcArmorWeaponFromSources(char);
  var ar = char.proficiencies.armorSources || {};
  var _anyArmor = ["light","medium","heavy","shield"].some(function(t){ return (ar[t]||[]).length > 0; });

  var html = '';
  if (!_anyArmor) {
    html += '<div class="prof-empty-hint">' + dndIcoHtml("ban", 14) + ' Нет владения никакой бронёй</div>';
  }
  html += '<div class="prof-cat-group"><div class="prof-chips">';
  ["light","medium","heavy","shield"].forEach(function(t) {
    var srcs = ar[t] || [];
    if (srcs.length === 0) {
      html += '<span class="prof-chip" data-source="empty" style="opacity:0.4">' + ARMOR_TYPE_LABELS[t] + '</span>';
    } else {
      // Главный source — первый по приоритету (race > class > subclass > feat > custom)
      var primary = srcs[0];
      var srcBadges = srcs.map(function(s){ return profSourceLabel(s); }).join(" ");
      var rmBtn = (srcs.indexOf("custom") !== -1)
        ? '<button type="button" class="prof-chip-remove" aria-label="Убрать" onclick="removeCustomArmorType(\'' + t + '\')">×</button>'
        : '';
      html += '<span class="prof-chip" data-source="' + primary + '">' +
        ARMOR_TYPE_LABELS[t] +
        '<span class="prof-chip-src">' + srcBadges + '</span>' +
        rmBtn + '</span>';
    }
  });
  html += '</div></div>';

  // Добавить тип брони вручную
  var allTypes = ["light","medium","heavy","shield"];
  var available = allTypes.filter(function(t){ return (ar[t] || []).indexOf("custom") === -1; });
  if (available.length > 0) {
    html += '<div class="prof-cat-group"><div class="prof-cat-title">' + dndIcoHtml("plus", 13) + ' Добавить тип</div><div class="prof-add-row">';
    html += '<select id="armor-custom-pick"><option value="">— выбрать —</option>';
    available.forEach(function(t) {
      html += '<option value="' + t + '">' + ARMOR_TYPE_LABELS[t] + '</option>';
    });
    html += '</select>';
    html += '<button onclick="addCustomArmorType()">' + dndIcoHtml("plus", 13) + ' Добавить</button>';
    html += '</div></div>';
  }
  box.innerHTML = html;
}

function renderWeaponProf() {
  var box = $("weapon-prof-container");
  if (!box) return;
  if (!currentId) { box.innerHTML = ""; return; }
  var char = getCurrentChar();
  if (!char) { box.innerHTML = ""; return; }
  recalcArmorWeaponFromSources(char);
  var wp = char.proficiencies.weaponSources || {};

  // Категории
  var html = '<div class="prof-cat-group"><div class="prof-cat-title">Категории</div><div class="prof-chips">';
  ["simple","martial"].forEach(function(t) {
    var srcs = wp[t] || [];
    if (srcs.length === 0) {
      html += '<span class="prof-chip" data-source="empty" style="opacity:0.4">' + WEAPON_TYPE_LABELS[t] + '</span>';
    } else {
      var primary = srcs[0];
      var srcBadges = srcs.map(function(s){ return profSourceLabel(s); }).join(" ");
      var rmBtn = (srcs.indexOf("custom") !== -1)
        ? '<button type="button" class="prof-chip-remove" aria-label="Убрать" onclick="removeCustomWeaponType(\'' + t + '\')">×</button>'
        : '';
      html += '<span class="prof-chip" data-source="' + primary + '">' +
        WEAPON_TYPE_LABELS[t] +
        '<span class="prof-chip-src">' + srcBadges + '</span>' +
        rmBtn + '</span>';
    }
  });
  html += '</div></div>';

  // Конкретные оружия
  var specs = char.proficiencies.specificWeapons || [];
  if (specs.length > 0) {
    html += '<div class="prof-cat-group"><div class="prof-cat-title">Конкретные оружия</div><div class="prof-chips">';
    specs.forEach(function(w) {
      var rmBtn = (w.source === "custom")
        ? '<button type="button" class="prof-chip-remove" aria-label="Убрать" onclick="removeCustomSpecificWeapon(\'' + escapeHtml(w.name).replace(/'/g,"\\'") + '\')">×</button>'
        : '';
      html += '<span class="prof-chip" data-source="' + w.source + '">' +
        escapeHtml(w.name) +
        '<span class="prof-chip-src">' + profSourceLabel(w.source) + '</span>' +
        rmBtn + '</span>';
    });
    html += '</div></div>';
  }

  // Добавить категорию вручную
  var allTypes = ["simple","martial"];
  var available = allTypes.filter(function(t){ return (wp[t] || []).indexOf("custom") === -1; });
  html += '<div class="prof-cat-group"><div class="prof-cat-title">➕ Добавить</div><div class="prof-add-row">';
  if (available.length > 0) {
    html += '<select id="weapon-custom-pick"><option value="">— тип —</option>';
    available.forEach(function(t) {
      html += '<option value="' + t + '">' + WEAPON_TYPE_LABELS[t] + '</option>';
    });
    html += '</select>';
    html += '<button onclick="addCustomWeaponType()">➕ Тип</button>';
  }
  html += '<input type="text" id="weapon-spec-name" placeholder="конкретное оружие…">';
  html += '<button onclick="addCustomSpecificWeapon()">➕ Оружие</button>';
  html += '</div></div>';

  box.innerHTML = html;
}

function addCustomArmorType() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  ensureArmorWeaponFields(char);
  var sel = $("armor-custom-pick");
  if (!sel || !sel.value) return;
  if (char.proficiencies.armorCustom.indexOf(sel.value) === -1) {
    char.proficiencies.armorCustom.push(sel.value);
  }
  renderArmorProf();
  if (typeof calculateAC === "function") calculateAC();
  saveToLocal();
}

function removeCustomArmorType(type) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  ensureArmorWeaponFields(char);
  char.proficiencies.armorCustom = char.proficiencies.armorCustom.filter(function(t){ return t !== type; });
  renderArmorProf();
  if (typeof calculateAC === "function") calculateAC();
  saveToLocal();
}

function addCustomWeaponType() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  ensureArmorWeaponFields(char);
  var sel = $("weapon-custom-pick");
  if (!sel || !sel.value) return;
  if (char.proficiencies.weaponCustom.indexOf(sel.value) === -1) {
    char.proficiencies.weaponCustom.push(sel.value);
  }
  renderWeaponProf();
  saveToLocal();
}

function removeCustomWeaponType(type) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  ensureArmorWeaponFields(char);
  char.proficiencies.weaponCustom = char.proficiencies.weaponCustom.filter(function(t){ return t !== type; });
  renderWeaponProf();
  saveToLocal();
}

function addCustomSpecificWeapon() {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  ensureArmorWeaponFields(char);
  var inp = $("weapon-spec-name");
  if (!inp) return;
  var val = inp.value.trim();
  if (!val) return;
  var exists = (char.proficiencies.specificWeapons || []).some(function(w){ return w.name === val; });
  if (exists) {
    if (typeof showToast === "function") showToast("Оружие уже есть", "info");
    return;
  }
  char.proficiencies.specificWeapons.push({ name: val, source: "custom" });
  inp.value = "";
  renderWeaponProf();
  saveToLocal();
}

function removeCustomSpecificWeapon(name) {
  if (!currentId) return;
  var char = getCurrentChar();
  if (!char) return;
  ensureArmorWeaponFields(char);
  char.proficiencies.specificWeapons = (char.proficiencies.specificWeapons || []).filter(function(w) {
    return !(w.source === "custom" && w.name === name);
  });
  renderWeaponProf();
  saveToLocal();
}

