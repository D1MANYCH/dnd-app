// ============================================================
// LVL-2/6 · Вкладка «Развитие» (#tab-progress) и экран «Об умении»
// (#screen-featureinfo)
//
// Сборка В2+ из мокапа tests/style-progress-mockups.html: класс — строка с
// раскрытием, поэтому высота не растёт с уровнем. Ни одной коробки:
// строки, действия и ромб раскрытия переиспользуют рецепт «Здоровье и Бой»
// (.hp-row* / .hp-act / .disc-diamond, v3.83.0), своего тут только шапка,
// метки секций и строка умения.
//
// Экран отвечает на жалобу подписчика: уровень КЛАССА и уровень ПЕРСОНАЖА
// разведены и подписаны словами, статус подкласса сказан прямо («архетип
// с 3 ур.»), а не выводится из суммарного уровня.
// ============================================================

// Аргумент inline-обработчика: сначала экранируем для JS, потом для HTML —
// парсер декодирует &#039; до разбора кода, и апостроф в имени умения иначе
// закрыл бы строку.
function _pgArg(s) {
  return escapeHtml(String(s === null || s === undefined ? "" : s).replace(/\\/g, "\\\\").replace(/'/g, "\\'"));
}

/** Классы персонажа единым списком: [{cls, level, sub, die, idx}] */
function _pgClassList(char) {
  var out = [];
  if (!char) return out;
  var die = function(cls, own) {
    return own || edData(char).CLASS_HIT_DICE[cls] || 8;
  };
  if (char.classes && char.classes.length) {
    char.classes.forEach(function(c, i) {
      if (!c || !c.class) return;
      out.push({ cls: c.class, level: c.level || 0, sub: c.subclass || "", die: die(c.class, c.hitDie), idx: i });
    });
  } else if (char.class) {
    out.push({ cls: char.class, level: char.level || 1, sub: char.subclass || "", die: die(char.class), idx: 0 });
  }
  return out;
}

// ── Кирпичи строк ───────────────────────────────────────────
function _pgDisc(name, meta, body, open, opts) {
  opts = opts || {};
  // mute приглушает только ИМЯ строки. Знак трогать нельзя: пустой ромб по
  // легенде (Справка → «Условные знаки») значит «продолжения нет», а строка
  // здесь как раз раскрывается.
  return '<div class="hp-row' + (open ? " is-open" : "") + '"' + (opts.attr || "") + ' onclick="hpToggleRow(this)">' +
    '<span class="disc-diamond"></span>' +
    '<span class="hp-row-name' + (opts.mute ? " pg-name--mute" : "") + '">' + name + '</span>' +
    (meta ? '<span class="hp-row-meta' + (opts.warn ? " pg-meta--warn" : "") + '">' + meta + '</span>' : "") +
    '</div><div class="hp-row-body' + (open ? " is-open" : "") + '">' + body + '</div>';
}

function _pgStatic(name, meta) {
  return '<div class="hp-row hp-row--static"><span class="hp-row-name">' + name + '</span>' +
    (meta ? '<span class="hp-row-meta">' + meta + '</span>' : "") + '</div>';
}

/** Строка «что осталось сделать»: текст слева, текстовое действие справа */
function _pgAttn(text, act, onclick) {
  return '<div class="hp-row hp-row--static"><span class="pg-attn-n">' + text + '</span>' +
    '<button type="button" class="hp-act pg-attn-act" onclick="' + onclick + '">' + act + '</button></div>';
}

function _pgFeat(cls, sub, level, name, isNew) {
  return '<div class="pg-feat' + (isNew ? " pg-feat--new" : "") + '" onclick="openFeatureInfo(\'' +
    _pgArg(cls) + '\', \'' + _pgArg(sub) + '\', ' + level + ', \'' + _pgArg(name) + '\')">' +
    '<span class="pg-feat-lv">' + level + ' ур.</span>' +
    '<span class="pg-feat-n">' + escapeHtml(name) + (sub ? ' <u>· ' + escapeHtml(sub) + '</u>' : "") + '</span></div>';
}

function _pgActRow(html) { return '<div class="pg-body-acts">' + html + '</div>'; }

// ── Шапка ───────────────────────────────────────────────────
// LVL-3: внутренность шапки нужна и разделу на листе — там обёртка .pg-head
// стоит в разметке (#cd-head), поэтому сборка разведена на две функции.
function _pgHeadInner(char, list) {
  var label = list.length
    ? list.map(function(e) { return escapeHtml(e.cls) + (list.length > 1 ? " " + e.level : ""); }).join(' <i>/</i> ')
    : "Класс не выбран";
  var lvl = char.level || 1;
  var prof = (typeof getProficiencyBonus === "function") ? getProficiencyBonus(lvl) : 2;
  var meta = lvl + ' уровень <span class="hp-dot">·</span> мастерство <b>+' + prof + "</b>";
  var dice = list.map(function(e) { return e.level + "к" + e.die; }).join(" + ");
  if (dice) meta += ' <span class="hp-dot">·</span> ' + dice;
  return '<div class="pg-head-cls">' + label + '</div>' +
    '<div class="pg-head-meta">' + meta + '</div>';
}

function _pgHead(char, list) {
  return '<div class="pg-head">' + _pgHeadInner(char, list) + '</div>';
}

// Раскрытие для новичка: главное различие всего раздела — уровень персонажа
// против уровня класса (PHB 2014, «Мультиклассирование», стр. 163–164).
function _pgAboutRow() {
  var body =
    "<p><b>Уровень персонажа</b> — сумма уровней всех классов. От него считается бонус мастерства, " +
    "и он один на все классы.</p>" +
    "<p><b>Уровень класса</b> — сколько уровней взято именно в этом классе. От него зависят умения, " +
    "заряды и уровень, на котором открывается подкласс.</p>" +
    "<p>Кость хитов у каждого класса своя, поэтому хиты растут той костью, чей класс вы повышаете. " +
    "Прибавка — среднее по кости (у к10 это 6) плюс модификатор Телосложения; кидать кубик " +
    "не обязательно, среднее по книге законно.</p>" +
    _pgActRow('<button type="button" class="hp-act" onclick="openHelp(\'progress\')">Подробно в справке →</button>');
  return _pgDisc("Что это значит", "", body, false, { mute: true });
}

// LVL-4: бонус мастерства — величина, которую мультикласс путает чаще всего:
// он считается от уровня ПЕРСОНАЖА и второй раз за второй класс не даётся.
function _pgProfRow(char) {
  var lvl = char.level || 1;
  var prof = (typeof getProficiencyBonus === "function") ? getProficiencyBonus(lvl) : 2;
  var next = 0, at = 0, steps = [5, 9, 13, 17];
  for (var i = 0; i < steps.length; i++) {
    if (lvl < steps[i]) { at = steps[i]; next = prof + 1; break; }
  }
  var body =
    "<p>Один на все классы и растёт по уровню персонажа: +2 на 1–4, +3 на 5–8, +4 на 9–12, " +
    "+5 на 13–16, +6 на 17–20. Взяв второй класс, второй бонус мастерства вы не получаете.</p>" +
    "<p>Прибавляется к броскам, которыми персонаж владеет: атаки, спасброски классов, навыки " +
    "и инструменты. При компетентности он удваивается.</p>" +
    (at ? "<p>Следующий рост — на " + at + " уровне персонажа, до +" + next + ".</p>" : "");
  return _pgDisc("Бонус мастерства", "<b>+" + prof + "</b>", body, false, { mute: true });
}

// LVL-4: расписание АСИ у каждого класса своё и считается по уровню КЛАССА —
// именно здесь мультикласс обещает лишние увеличения, если считать по сумме.
function _pgAsiRow(char, list) {
  if (!list.length) return "";
  var table = edData(char).ASI_LEVELS;
  if (!table) return "";
  var lines = list.map(function(e) {
    var sched = table[e.cls] || table["default"] || [];
    var got = sched.filter(function(l) { return e.level >= l; }).length;
    return "<p><b>" + escapeHtml(e.cls) + "</b> — " + sched.join(", ") +
      " уровни класса; заработано " + got + " из " + sched.length + ".</p>";
  }).join("");
  var earned = (typeof charAsiSlots === "function") ? charAsiSlots(char).length : 0;
  var used = 0;
  var map = (char.asiUsed && typeof char.asiUsed === "object" && !Array.isArray(char.asiUsed)) ? char.asiUsed : {};
  Object.keys(map).forEach(function(k) { if (Array.isArray(map[k])) used += map[k].length; });
  var body =
    "<p>Каждое увеличение — это +2 к одной характеристике, +1 к двум разным либо черта вместо " +
    "прибавки. Выше 20 характеристику поднять нельзя.</p>" + lines +
    "<p>Уровни считаются по классу, а не по сумме: Воин 3 / Плут 2 увеличения «на 4 уровне» не получает.</p>";
  var meta = earned ? "<b>" + Math.min(used, earned) + "</b> <i>/ " + earned + "</i> использовано" : "пока нет";
  return _pgDisc("Увеличение характеристик", meta, body, false, { mute: true });
}

// Строка опыта — только при char.exp > 0: партии на вехах порогов не ведут.
function _pgXpRow(char) {
  var exp = parseInt(char.exp, 10) || 0;
  if (exp <= 0 || typeof charXpNext !== "function") return "";
  if (typeof _getTrackXpOn === "function" && !_getTrackXpOn()) return "";
  var x = charXpNext(char);
  if (!x.level) return _pgStatic("Опыт", "<b>" + exp + "</b> <i>· порогов больше нет</i>");
  var meta = "<b>" + x.have + '</b> <i>/ ' + x.need + '</i> <span class="hp-dot">·</span> ' +
    (x.canLevel ? '<span class="pg-meta--warn">можно повысить</span>' : "до " + x.level + " уровня " + x.left);
  return _pgStatic("Опыт", meta);
}

// Ячейки заклинаний. Самое непонятное место мультикласса: уровни классов
// складываются в общий пул (PHB стр. 164), а не дают по своей строке таблицы.
function _pgSlotRows(char) {
  if (typeof charCasterLevel !== "function") return "";
  var cl = charCasterLevel(char);
  if (!cl.casters.length) return "";
  var out = "";
  // Общий пул — только когда «Использование заклинаний» у двух и более классов;
  // пакт-магия Колдуна в этот счёт не входит (PHB стр. 164).
  var casting = cl.casters.filter(function(c) { return c.type !== "pact"; });
  var multi = casting.length > 1;
  var slots = (casting.length && typeof getMulticlassSpellSlots === "function") ? getMulticlassSpellSlots(char) : [];
  var parts = [];
  for (var i = 1; i < slots.length; i++) {
    if (slots[i] > 0) parts.push(i + " круг — <b>" + slots[i] + "</b>");
  }
  // Ячеек нет вовсе (Паладин 1) или весь колдовской ресурс — пакт-магия:
  // строки «Ячейки заклинаний» тогда не должно быть, у Колдуна своя ниже.
  if (parts.length) {
    // Подпись: при одном заклинателе — его класс и его уровень; производное
    // «N ур.» из общего пула тут показывать нельзя, такого числа у книги нет.
    var meta = multi
      ? "как заклинатель " + cl.level + " ур."
      : escapeHtml(casting[0].cls) + " " + casting[0].level + " ур.";
    var body = "<p>" + parts.join(' <span class="hp-dot">·</span> ') + "</p>";
    if (multi) {
      body += "<p>Уровни всех классов-заклинателей складываются в один общий пул ячеек: полные заклинатели " +
        "целиком, паладин и следопыт — половиной, мистический рыцарь и мистический ловкач — третью.</p>" +
        "<p>Заклинания при этом готовятся раздельно, каждым классом по своему уровню. Ячейка общая — " +
        "потратить её можно на любое подготовленное заклинание.</p>";
    }
    out += _pgDisc("Ячейки заклинаний", meta, body, false, { attr: ' data-pg-row="slots"' });
  }
  if (cl.pact) {
    out += _pgDisc("Ячейки договора", escapeHtml(cl.pact.cls) + " " + cl.pact.level + " ур.",
      "<p>Ячейки договора Колдуна не смешиваются с общим пулом и восстанавливаются на коротком отдыхе. " +
      "Приложение считает их отдельно — они живут на вкладке «Заклинания».</p>", false, { mute: true });
  }
  return out;
}

// ── «Осталось выбрать» ──────────────────────────────────────
// Секции нет вовсе, когда выбирать нечего — ноль пустых состояний.
function _pgAttention(char) {
  var rows = [];
  var earned = (typeof charAsiSlots === "function") ? charAsiSlots(char) : [];
  var used = (char.asiUsed && typeof char.asiUsed === "object" && !Array.isArray(char.asiUsed)) ? char.asiUsed : {};
  earned.forEach(function(slot) {
    var u = used[slot.cls];
    if (Array.isArray(u) && u.indexOf(slot.level) !== -1) return;
    rows.push(_pgAttn("Увеличение характеристик <u>· " + escapeHtml(slot.cls) + " " + slot.level + " ур.</u>",
      "Выбрать →", "openASIModalForLevel(" + slot.level + ", '" + _pgArg(slot.cls) + "')"));
  });
  // E24-8: эпический дар 19 ур. (2024) — тот же пикер, ASI_LEVELS его не содержит
  var epic = (typeof charEpicSlots === "function") ? charEpicSlots(char) : [];
  epic.forEach(function(slot) {
    var ue = used[slot.cls];
    if (Array.isArray(ue) && ue.indexOf(slot.level) !== -1) return;
    rows.push(_pgAttn("Эпический дар <u>· " + escapeHtml(slot.cls) + " " + slot.level + " ур.</u>",
      "Выбрать →", "openASIModalForLevel(" + slot.level + ", '" + _pgArg(slot.cls) + "')"));
  });
  var pending = (typeof charSubclassPending === "function") ? charSubclassPending(char) : [];
  pending.forEach(function(p) {
    rows.push(_pgAttn("Подкласс <u>· " + escapeHtml(p.cls) + " " + p.at + " ур.</u>",
      "Выбрать →", "pgFocusSubclass('" + _pgArg(p.cls) + "')"));
  });
  if (typeof ccGetAllChoicesFor === "function") {
    ccGetAllChoicesFor(char).forEach(function(it) {
      if (it.isComplete || !it.choice) return;
      rows.push(_pgAttn(escapeHtml(it.choice.name || it.choice.id) +
        " <u>· " + escapeHtml(it.className) + " " + it.classLevel + " ур.</u>",
        "Выбрать →", "openClassChoiceModal('" + _pgArg(it.className) + "', '" + _pgArg(it.choice.id) + "')"));
    });
  }
  if (!rows.length) return "";
  return '<div class="pg-grp" data-pg-grp="attn">Осталось выбрать</div><div class="hp-rows">' + rows.join("") + "</div>";
}

// ── «Классы» ────────────────────────────────────────────────
/** Класс, выросший последним, — по снимку отката, а не по памяти раскрытия
 *  (память раскрытого состояния в проекте отвергнута на DISC). */
function _pgGrownLast(char, list) {
  var snap = char._prevLevelSnapshot;
  if (!snap) return list.length === 1 ? list[0].cls : "";
  var before = {};
  ((snap.classes && snap.classes.length) ? snap.classes : (snap.class ? [{ class: snap.class, level: snap.level }] : []))
    .forEach(function(c) { if (c && c.class) before[c.class] = c.level || 0; });
  var grown = "";
  list.forEach(function(e) {
    if (e.level > (before[e.cls] || 0)) grown = e.cls;
  });
  return grown;
}

function _pgClassRow(char, e, open) {
  var at = edData(char).SUBCLASS_LEVEL[e.cls] || 0;
  var meta = e.level + " ур.", warn = false;
  if (e.sub) {
    meta += ' <span class="hp-dot">·</span> ' + escapeHtml(e.sub);
  } else if (at && e.level >= at) {
    meta += ' <span class="hp-dot">·</span> подкласс не выбран';
    warn = true;
  } else if (at) {
    meta += ' <span class="hp-dot">·</span> подкласс с ' + at + " ур.";
  }

  var body = "";
  var cf = edData(char).CLASS_FEATURES[e.cls] || null;
  var sf = e.sub ? edData(char).SUBCLASS_FEATURES[e.sub] : null;
  for (var l = 1; l <= e.level; l++) {
    var isNew = (l === e.level);
    if (cf && cf[l]) cf[l].forEach(function(f) { body += _pgFeat(e.cls, "", l, f.name, isNew); });
    if (sf && sf[l]) sf[l].forEach(function(f) { body += _pgFeat(e.cls, e.sub, l, f.name, isNew); });
  }
  if (!body) body = '<p class="hp-row-hint">Умений этого класса в справочнике пока нет.</p>';

  if (!e.sub && at) {
    if (e.level >= at) {
      var opts = '<option value="">Выберите подкласс</option>';
      var all = edData(char).SUBCLASSES[e.cls] || [];
      all.forEach(function(s) {
        if (!subclassInBooks(s, char)) return;
        var src = (typeof subclassSourceShort === "function") ? subclassSourceShort(s, char) : "";
        opts += '<option value="' + escapeHtml(s) + '">' + escapeHtml(src ? s + " · " + src : s) + "</option>";
      });
      body += '<select class="field flat-field pg-sub-select" onchange="pgSetSubclass(' + e.idx + ', this.value)">' +
        opts + "</select>";
    } else {
      body += '<p class="hp-row-hint">Подкласс выбирается на ' + at + " уровне класса — сейчас взято " + e.level +
        ". Суммарный уровень персонажа (" + (char.level || 0) + ") на это не влияет.</p>";
    }
  }
  body += _pgActRow('<button type="button" class="hp-act" onclick="openClassPlan(\'' + _pgArg(e.cls) + '\')">План класса 1–20 →</button>');

  return _pgDisc(escapeHtml(e.cls), meta, body, open, { warn: warn, attr: ' data-pg-cls="' + escapeHtml(e.cls) + '"' });
}

function _pgClasses(char, list) {
  var rows;
  if (!list.length) {
    rows = _pgStatic("Класс не выбран", "выберите класс на листе");
  } else {
    var grown = _pgGrownLast(char, list);
    rows = list.map(function(e) {
      return _pgClassRow(char, e, list.length === 1 || e.cls === grown);
    }).join("");
  }
  return '<div class="pg-grp" data-pg-grp="classes">Классы</div><div class="hp-rows">' + rows + "</div>";
}

// ── «Дальше» ────────────────────────────────────────────────
// Что даст следующий уровень — ДО нажатия «Повысить»: сейчас это видно только
// начав повышение и увидев превью.
function _pgNext(char, list) {
  if (!list.length) return "";
  var total = char.level || 0;
  if (total >= 20) return "";
  var conMod = (typeof getMod === "function" && char.stats) ? getMod(char.stats.con) : 0;
  var rows = "";

  list.forEach(function(e) {
    if (e.level >= 20) return;
    var nl = e.level + 1;
    var names = [], body = "";
    var cf = edData(char).CLASS_FEATURES[e.cls] || null;
    var sf = e.sub ? edData(char).SUBCLASS_FEATURES[e.sub] : null;
    var add = function(f) {
      names.push(f.name);
      body += "<p><b>" + escapeHtml(f.name) + "</b> — " + escapeHtml(f.desc || "") + "</p>";
    };
    if (cf && cf[nl]) cf[nl].forEach(add);
    if (sf && sf[nl]) sf[nl].forEach(add);
    // Умение подкласса стоит в таблице класса своим именем («Архетип плута»),
    // поэтому вторым чипом его не дублируем — только поясняем в раскрытии.
    var at = edData(char).SUBCLASS_LEVEL[e.cls] || 0;
    if (at === nl && !e.sub) {
      body += "<p>На этом уровне класса впервые выбирается подкласс.</p>";
    }
    var profNow = (typeof getProficiencyBonus === "function") ? getProficiencyBonus(total) : 2;
    var profNext = (typeof getProficiencyBonus === "function") ? getProficiencyBonus(total + 1) : 2;
    if (profNext > profNow) {
      names.push("мастерство +" + profNext);
      body += "<p><b>Бонус мастерства</b> — вырастет до +" + profNext + ": он считается от уровня персонажа и общий для всех классов.</p>";
    }
    var avg = Math.floor(e.die / 2) + 1;
    body += '<p class="hp-row-hint">Хиты: +1к' + e.die + " (в среднем " + avg + ") + модификатор ТЕЛ (" +
      (conMod >= 0 ? "+" : "") + conMod + "). Приложение прибавляет среднее — по книге это законный вариант, " +
      "кубик кидать не обязательно.</p>";
    rows += _pgDisc(escapeHtml(e.cls) + " " + nl, names.length ? escapeHtml(names.join(", ")) : "без новых умений", body, false);
  });

  if (typeof checkMulticlassPrereqs === "function") {
    var ok = _pgAvailableClasses(char, list);
    var nbody = ok.length
      ? "<p>Требования выполнены: " + escapeHtml(ok.join(", ")) + ".</p>"
      : '<p class="hp-row-hint">Ни один класс сейчас недоступен: для входа нужна характеристика 13 и выше ' +
        "(PHB, «Мультиклассирование»).</p>";
    nbody += "<p>Новый класс начинается с 1 уровня класса: умения 1-го уровня, владения по укороченному списку " +
      "мультикласса и своя кость хитов.</p>";
    nbody += _pgActRow('<button type="button" class="hp-act" onclick="pgAddClass()">Добавить класс (мультикласс) →</button>');
    rows += _pgDisc("Новый класс (мультикласс)",ok.length ? "доступно " + ok.length : "требования не выполнены", nbody, false, { mute: true });
  }

  return rows ? '<div class="pg-grp" data-pg-grp="next">Дальше</div><div class="hp-rows">' + rows + "</div>" : "";
}

/** Классы, доступные для взятия: ещё не взятые и с выполненными требованиями
 *  (PHB, «Мультиклассирование» — характеристика 13 на вход и на выход). */
function _pgAvailableClasses(char, list) {
  var out = [];
  if (typeof checkMulticlassPrereqs !== "function") return out;
  var have = (list || []).map(function(e) { return e.cls; });
  ["Варвар", "Бард", "Воин", "Волшебник", "Друид", "Жрец", "Колдун", "Монах", "Паладин", "Плут", "Следопыт", "Чародей"]
    .forEach(function(c) {
      if (have.indexOf(c) !== -1) return;
      var chk = checkMulticlassPrereqs(char, c);
      if (chk && chk.ok) out.push(c);
    });
  return out;
}

function _pgActions(char, list) {
  var acts = '<button type="button" class="hp-act" onclick="pgLevelUp()">Повысить уровень →</button>';
  // LVL-7: раньше единственный вход в мультикласс был спрятан в свёрнутой
  // строке «Новый класс» внизу — подписчик его попросту не нашёл.
  // Кнопка видна всегда: при невыполненных требованиях окно само скажет, чего не хватает.
  if (list && list.length && (char.level || 0) < 20) {
    acts += '<button type="button" class="hp-act" onclick="pgAddClass()">Добавить класс (мультикласс) →</button>';
  }
  if ((char.level || 0) > 1 && char._prevLevelSnapshot) {
    acts += '<button type="button" class="hp-act" onclick="pgLevelDown()">Откатить →</button>';
  }
  if (char.buildId) {
    acts += '<button type="button" class="hp-act" onclick="openBuildPlan()">План билда 1–20 →</button>';
  }
  return '<div class="pg-acts">' + acts + "</div>";
}

// ── Сборка и открытие ───────────────────────────────────────
function _pgBuild(char) {
  var list = _pgClassList(char);
  var top = _pgXpRow(char) + _pgAboutRow() + _pgProfRow(char) + _pgAsiRow(char, list) + _pgSlotRows(char);
  return _pgHead(char, list) +
    '<div class="hp-rows">' + top + "</div>" +
    _pgAttention(char) +
    _pgClasses(char, list) +
    _pgNext(char, list) +
    _pgActions(char, list);
}

/** Наполнить вкладку. Зовётся из switchTab при каждом заходе — тап по кнопке
 *  вкладки идёт мимо openProgress(), поэтому сборка живёт здесь. */
function openProgressTab() {
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  if (!char) return;
  if (typeof migrateToMulticlass === "function") migrateToMulticlass(char);
  var body = $("pg-body");
  if (body) body.innerHTML = _pgBuild(char);
}

/** Вход «Развитие →» с листа и из строк-сводок. Тур стартует сам —
 *  через maybeStartTabTour() в конце switchTab. */
function openProgress() {
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  if (!char) {
    if (typeof showToast === "function") showToast("Сначала выберите персонажа", "warn");
    return;
  }
  if (typeof _closeOpenModals === "function") _closeOpenModals();
  if (typeof switchTab === "function") switchTab("progress", null);
}

/** Открыта ли вкладка «Развитие» прямо сейчас. */
function pgTabActive() {
  var tab = $("tab-progress");
  return !!(tab && tab.classList.contains("active"));
}

/** Перерисовать, если вкладка открыта. Зовётся из updateClassFeatures() — она
 *  идёт следом за повышением уровня, откатом, АСИ и классовыми выборами. */
function pgRefresh() {
  if (!pgTabActive()) return;
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  var body = $("pg-body");
  if (char && body) body.innerHTML = _pgBuild(char);
}

// ── Действия экрана ─────────────────────────────────────────
function pgSetSubclass(idx, name) {
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  if (!char || !name || !char.classes || !char.classes[idx]) return;
  char.classes[idx].subclass = name;
  if (typeof syncClassFields === "function") syncClassFields(char);
  if (typeof saveToLocal === "function") saveToLocal();
  if (typeof loadCharacter === "function" && currentId) loadCharacter(currentId);
  if (typeof updateClassFeatures === "function") updateClassFeatures();
  if (typeof showToast === "function") showToast("Подкласс: " + name, "success");
  openProgress();
}

/** Из строки «Осталось выбрать» — раскрыть класс и подвести к выбору подкласса.
 *  LVL-3: та же строка есть на листе, поэтому вкладка сначала открывается. */
function pgFocusSubclass(cls) {
  if (!pgTabActive()) openProgress();
  var body = $("pg-body");
  if (!body) return;
  var row = body.querySelector('.hp-row[data-pg-cls="' + cls + '"]');
  if (!row) return;
  if (typeof hpSetRowOpen === "function") hpSetRowOpen(row, true);
  if (row.scrollIntoView) row.scrollIntoView({ block: "center" });
  var sel = row.nextElementSibling ? row.nextElementSibling.querySelector(".pg-sub-select") : null;
  if (sel && sel.focus) sel.focus();
}

// Повышение и откат общие с листом и заканчиваются на нём: confirmLevelUp зовёт
// loadCharacter, а та переключает вкладку на «Лист». Пришедшего с «Развития»
// возвращаем назад.
var _pgFromProgress = false;

function pgLevelUp() {
  _pgFromProgress = true;
  if (typeof openLevelUpModal === "function") openLevelUpModal();
}

function pgLevelDown() {
  _pgFromProgress = true;
  if (typeof openLevelDownConfirm === "function") openLevelDownConfirm();
}

/** Зовётся из closeLevelUpModal() — конец и повышения, и отката */
function pgAfterLevelModal() {
  if (!_pgFromProgress) return;
  _pgFromProgress = false;
  if (pgTabActive()) {
    pgRefresh();
    return;
  }
  openProgress();
}

/** «Добавить класс →» — сразу к блоку нового класса в модалке повышения */
function pgAddClass() {
  // FB-1: до фиксации основы — раскладка классов сразу, без пошагового повышения
  var _c = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  if (_c && !_c.basicLocked) { openMcLayout(); return; }
  if (typeof openLevelUpModal !== "function") return;
  _pgFromProgress = true;
  openLevelUpModal();
  if (typeof openMulticlassNewClass === "function") openMulticlassNewClass();
}

// ── LVL-3 · Раздел «Класс и развитие» на листе ──────────────
// Сводка и «Осталось выбрать» — те же кирпичи, что на экране: список умений
// с листа уехал, здесь остаются только сводка, ресурсы (рендерит app-ui.js),
// невыбранное ИМЕНЕМ и текстовые действия.
function renderClassDev() {
  var head = $("cd-head");
  if (!head) return;
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  if (!char) return;
  if (typeof migrateToMulticlass === "function") migrateToMulticlass(char);
  var list = _pgClassList(char);
  head.innerHTML = _pgHeadInner(char, list);
  var attn = $("cd-attn");
  if (attn) attn.innerHTML = _pgAttention(char);
  // LVL-4: то же объяснение, что на экране, но короче — новичку хватает его,
  // не уходя с листа; за подробностями строка ведёт в справку.
  var about = $("cd-about");
  if (about) about.innerHTML = _pgSheetAboutRow(char, list);
  syncClassFieldUI(char);
}

/** Раскрытие «что это значит» в разделе листа: три величины, которые
 *  мультикласс путает чаще всего, — уровень, бонус мастерства, кость хитов. */
function _pgSheetAboutRow(char, list) {
  var lvl = char.level || 1;
  var prof = (typeof getProficiencyBonus === "function") ? getProficiencyBonus(lvl) : 2;
  var multi = list.length > 1;
  var body =
    "<p><b>Уровень персонажа</b> — " + lvl + ", это сумма уровней всех классов. От него считается " +
    "бонус мастерства <b>+" + prof + "</b>, один на все классы.</p>" +
    "<p><b>Уровень класса</b> — сколько уровней взято в этом классе. От него зависят умения, " +
    "заряды и уровень, на котором открывается подкласс" +
    (multi ? ": " + list.map(function(e) { return escapeHtml(e.cls) + " " + e.level; }).join(", ") : "") + ".</p>" +
    "<p>Кость хитов у каждого класса своя, поэтому хиты растут костью того класса, чей уровень вы повышаете.</p>" +
    _pgActRow('<button type="button" class="hp-act" onclick="openProgress()">Развитие →</button>' +
      '<button type="button" class="hp-act" onclick="openHelp(\'progress\')">Подробно в справке →</button>');
  return _pgDisc("Что это значит", "", body, false, { mute: true });
}

/** Подкласс по каждому классу строками: выбранный, ожидающий выбора и ещё
 *  не открытый по уровню класса. */
function _pgSubclassRows(list) {
  var out = "";
  var _ed = edData((typeof getCurrentChar === "function") ? getCurrentChar() : null);  // E24-7
  list.forEach(function(e) {
    var at = _ed.SUBCLASS_LEVEL[e.cls] || 3;
    var val, act, go;
    if (e.sub) {
      val = e.sub; act = "Развитие →"; go = "openProgress()";
    } else if (e.level >= at) {
      val = "не выбран"; act = "Выбрать →"; go = "pgFocusSubclass('" + _pgArg(e.cls) + "')";
    } else {
      val = "с " + at + " уровня класса"; act = ""; go = "openProgress()";
    }
    out += '<div class="cd-class-mc" onclick="' + go + '">' +
      "<span>" + escapeHtml(e.cls) + " — " + escapeHtml(val) + "</span>" +
      (act ? '<span class="cd-class-mc-act">' + act + "</span>" : "") +
      "</div>";
  });
  return out;
}

/** Поля «Класс», «Уровень» и «Подкласс» на листе: каждое умеет только первый
 *  класс (а уровень — и вовсе сумма), поэтому у мультикласса они прячутся, и на
 *  их месте встают строки со всеми классами и входом в «Развитие».
 *  Сами поля остаются в разметке — их значения читают updateChar() и calcStats(),
 *  поэтому скрывать можно только через display, но не disabled. */
function syncClassFieldUI(char) {
  var sel = $("char-class"), mc = $("char-class-mc"), lbl = $("char-class-mc-label");
  if (!sel || !mc) return;
  var multi = !!(char && char.classes && char.classes.length > 1);
  sel.style.display = multi ? "none" : "";
  mc.style.display = multi ? "" : "none";
  var addBtn = $("char-add-class");
  if (addBtn) {
    var open = !!(char && !char.basicLocked);
    addBtn.style.display = (char && char.class && (open || (char.level || 1) < 20)) ? "" : "none";
    addBtn.textContent = (multi && open) ? "Классы и уровни (мультикласс) →" : multi ? "+ Ещё класс (мультикласс) →" : "+ Второй класс (мультикласс) →";
  }
  if (multi && lbl && typeof getClassLabel === "function") lbl.textContent = getClassLabel(char);
  var pgMob = $("char-progress-mob");
  if (pgMob) {
    pgMob.style.display = (char && char.class && char.basicLocked) ? "" : "none";
    if (char && char.class) pgMob.textContent = "Развитие · " + (multi ? getClassLabel(char) : char.class + " " + (char.level || 1)) + " →";
  }

  var list = multi ? _pgClassList(char) : [];

  var lvlInp = $("char-level"), lvlMc = $("char-level-mc");
  if (lvlInp && lvlMc) {
    lvlInp.style.display = multi ? "none" : "";
    lvlMc.style.display = multi ? "" : "none";
    if (multi) {
      lvlMc.innerHTML = '<span class="cd-level-mc-val">' + (char.level || 1) + "</span>" +
        '<span class="cd-level-mc-hint">сумма классов</span>';
    }
  }

  var subSel = $("char-subclass"), subRec = $("char-subclass-rec"), subMc = $("char-subclass-mc");
  if (subSel && subMc) {
    subSel.style.display = multi ? "none" : "";
    subMc.style.display = multi ? "" : "none";
    if (multi) {
      if (subRec) subRec.style.display = "none";
      subMc.innerHTML = _pgSubclassRows(list);
    }
  }
}

// ── Экран «Об умении» ───────────────────────────────────────
function openFeatureInfo(cls, sub, level, name) {
  var found = null, src = "";
  var _ed = edData((typeof getCurrentChar === "function") ? getCurrentChar() : null);  // E24-7
  var pick = function(table, label) {
    if (found || !table || !table[level]) return;
    table[level].forEach(function(f) {
      if (!found && f.name === name) { found = f; src = label; }
    });
  };
  if (sub) pick(_ed.SUBCLASS_FEATURES[sub], sub);
  pick(_ed.CLASS_FEATURES[cls], cls);
  if (!found) {
    if (typeof showToast === "function") showToast("Нет описания этого умения", "warn");
    return;
  }
  var title = $("fi-title-h");
  if (title) title.textContent = found.name;
  var srcLabel = escapeHtml(src) + " <span class=\"hp-dot\">·</span> " + level + " ур.";
  if (sub && src === sub && typeof subclassSourceShort === "function") {
    var s = subclassSourceShort(sub, (typeof getCurrentChar === "function") ? getCurrentChar() : null);
    if (s) srcLabel += ' <span class="hp-dot">·</span> ' + escapeHtml(s);
  }
  // LVL-4: описание проходит через глоссарий — термины становятся нажимаемыми
  // с поповером, а найденные в тексте объясняются ещё и блоком ниже, чтобы
  // новичку не нужно было догадываться, что слово можно нажать.
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  var ed = (char && char.edition === "2024") ? "2024" : "2014";
  var descEsc = escapeHtml(found.desc || "");
  var descHtml = descEsc;
  if (typeof glossarizeHtml === "function") {
    try { descHtml = glossarizeHtml(descEsc, {}, ed); } catch (e) { descHtml = descEsc; }
  }
  var html = '<p class="ai-mine">' + srcLabel + "</p>" +
    '<p class="ai-lead">' + descHtml + "</p>" + _fiRuleNotes(found.desc || "", ed);
  var body = $("fi-body");
  if (body) body.innerHTML = html;
  if (typeof _glossBindOnce === "function") _glossBindOnce();
  showScreen("featureinfo");
}

/** Блок «По правилам»: до трёх терминов глоссария, встреченных в описании
 *  умения, с их определениями. Термин ищется по границе слова — «ки» внутри
 *  «броски» сработать не должен. */
function _fiRuleNotes(desc, ed) {
  var list = (typeof window !== "undefined" && Array.isArray(window.GLOSSARY)) ? window.GLOSSARY.slice() : [];
  if (ed === "2024" && typeof window !== "undefined" && Array.isArray(window.GLOSSARY_2024)) {
    list = window.GLOSSARY_2024.concat(list);
  }
  if (!list.length || !desc) return "";
  var text = String(desc).toLowerCase();
  var hits = [], seen = {};
  list.forEach(function(entry) {
    if (hits.length >= 3 || !entry || !entry.terms || seen[entry.term]) return;
    var found = entry.terms.some(function(form) {
      var f = String(form).toLowerCase();
      var at = text.indexOf(f);
      while (at !== -1) {
        var before = at === 0 ? " " : text.charAt(at - 1);
        var after = text.charAt(at + f.length) || " ";
        if (!/[а-яёa-z0-9]/.test(before) && !/[а-яёa-z0-9]/.test(after)) return true;
        at = text.indexOf(f, at + 1);
      }
      return false;
    });
    if (found) { seen[entry.term] = true; hits.push(entry); }
  });
  if (!hits.length) return "";
  return '<div class="ai-block"><div class="ai-block-title">По правилам ' + ed + "</div>" +
    hits.map(function(e) {
      return "<p><b>" + escapeHtml(e.term) + "</b> — " + escapeHtml(e.def) + "</p>";
    }).join("") + "</div>";
}

// ── FB-1 · Раскладка классов до фиксации основы (#screen-mclayout) ──
// Игрок создаёт персонажа сразу нужного уровня: «Воин 3 / Плут 2» задаётся
// одним экраном, без пошагового повышения. Хиты, кости, ячейки и владения
// выводятся из char.classes, поэтому экран пишет раскладку и зовёт те же
// пересчёты, что и лист. Требование 13 — предупреждение, не запрет (NPC,
// домашние правила); после фиксации основы остаётся обычное повышение.
var ML_CLASSES = ["Варвар", "Бард", "Воин", "Волшебник", "Друид", "Жрец", "Колдун", "Монах", "Паладин", "Плут", "Следопыт", "Чародей"];
var _ml = null; // [{ cls, level, sub }]

function _mlTotal(rows) {
  return rows.reduce(function(s, r) { return s + (r.cls ? r.level : 0); }, 0);
}

/** Чего не хватает классу раскладки по требованиям мультикласса (PHB стр. 163) */
function _mlMissing(char, cls) {
  var probe = { stats: char.stats, edition: char.edition, classes: [], class: "" };
  var chk = checkMulticlassPrereqs(probe, cls);
  return chk.ok ? [] : chk.missing;
}

function openMcLayout() {
  var char = getCurrentChar();
  if (!char) return;
  if (char.basicLocked) { pgAddClass(); return; }
  migrateToMulticlass(char);
  _ml = _pgClassList(char).map(function(e) { return { cls: e.cls, level: e.level || 1, sub: e.sub }; });
  if (!_ml.length) _ml.push({ cls: "", level: 1, sub: "" });
  if (_ml.length === 1) _ml.push({ cls: "", level: 1, sub: "" });
  _mlRender();
  showScreen("mclayout");
}

function mlSetClass(i, v) {
  if (!_ml || !_ml[i]) return;
  _ml[i].cls = v;
  _ml[i].sub = "";
  if (v && _mlTotal(_ml) > 20) _ml[i].level = Math.max(1, _ml[i].level - (_mlTotal(_ml) - 20));
  _mlRender();
}

function mlLevel(i, d) {
  if (!_ml || !_ml[i]) return;
  var nv = _ml[i].level + d;
  if (nv < 1 || nv > 20) return;
  if (d > 0 && _ml[i].cls && _mlTotal(_ml) >= 20) return;
  _ml[i].level = nv;
  _mlRender();
}

function mlSetSub(i, v) {
  if (!_ml || !_ml[i]) return;
  _ml[i].sub = v;
}

function mlAdd() {
  if (!_ml || _ml.length >= ML_CLASSES.length) return;
  _ml.push({ cls: "", level: 1, sub: "" });
  _mlRender();
}

function mlRemove(i) {
  if (!_ml || _ml.length <= 1) return;
  _ml.splice(i, 1);
  _mlRender();
}

function _mlRender() {
  var char = getCurrentChar();
  var body = $("ml-body");
  if (!char || !_ml || !body) return;
  var ed = edData(char);
  var total = _mlTotal(_ml);
  var filled = _ml.filter(function(r) { return r.cls; });
  var html = '<p class="ag-lead">Уровни всех классов складываются в уровень персонажа — не больше 20. ' +
    "Первый класс в списке — начальный: он даёт спасброски и полные владения, остальные — владения по укороченному списку мультикласса.</p>" +
    '<p class="ag-left">Уровень персонажа: ' + total + " из 20</p>";

  _ml.forEach(function(r, i) {
    var taken = _ml.map(function(x, j) { return j === i ? "" : x.cls; });
    var opts = '<option value="">Выберите класс</option>';
    ML_CLASSES.forEach(function(c) {
      if (taken.indexOf(c) !== -1) return;
      opts += '<option value="' + c + '"' + (r.cls === c ? " selected" : "") + ">" + c + "</option>";
    });
    var canUp = r.level < 20 && (!r.cls || total < 20);
    html += '<div class="ml-row">' +
      '<select class="field flat-field ml-cls" onchange="mlSetClass(' + i + ',this.value)">' + opts + "</select>" +
      '<span class="ag-ctl">' +
        '<button type="button" class="stat-btn-sm" onclick="mlLevel(' + i + ',-1)"' + (r.level <= 1 ? " disabled" : "") + ' aria-label="Уменьшить уровень">−</button>' +
        '<span class="ag-val">' + r.level + "</span>" +
        '<button type="button" class="stat-btn-sm" onclick="mlLevel(' + i + ',1)"' + (canUp ? "" : " disabled") + ' aria-label="Увеличить уровень">+</button>' +
      "</span>" +
      (_ml.length > 1 ? '<button type="button" class="hp-act ml-del" onclick="mlRemove(' + i + ')" aria-label="Убрать класс">Убрать</button>' : "<span></span>");
    if (r.cls) {
      var at = ed.SUBCLASS_LEVEL[r.cls] || 0;
      var subs = ed.SUBCLASSES[r.cls] || [];
      if (at && r.level >= at && subs.length) {
        var so = '<option value="">Подкласс — выбрать позже</option>';
        subs.forEach(function(s) {
          // DOP-3: подкласс вне книг скрыт (уже выбранный остаётся), у остальных — метка источника.
          if (!subclassInBooks(s, char) && r.sub !== s) return;
          var src = subclassSourceShort(s, char);
          so += '<option value="' + escapeHtml(s) + '"' + (r.sub === s ? " selected" : "") + ">" + escapeHtml(src ? s + " · " + src : s) + "</option>";
        });
        html += '<select class="field flat-field ml-sub" onchange="mlSetSub(' + i + ',this.value)">' + so + "</select>";
      } else if (at) {
        html += '<span class="ag-note ml-sub">Подкласс — с ' + at + " уровня класса</span>";
      }
      var miss = filled.length > 1 ? _mlMissing(char, r.cls) : [];
      if (miss.length) {
        html += '<span class="ag-note ml-sub ml-warn">Требования мультикласса не выполнены: ' + escapeHtml(miss.join(", ")) + "</span>";
      }
    }
    html += "</div>";
  });

  if (_ml.length < ML_CLASSES.length && total < 20) {
    html += '<div class="ag-foot"><button type="button" class="hp-act" onclick="mlAdd()">+ Ещё класс →</button></div>';
  }
  html += '<p class="ag-note">Хиты считаются по среднему: полная кость первого класса на 1 уровне, дальше среднее по кости каждого класса плюс модификатор Телосложения. ' +
    "Требования мультикласса (характеристика 13) здесь только подсказка — для NPC и домашних правил. " +
    "Увеличения характеристик, умения на выбор и заклинания выбираются после применения — во вкладке «Развитие» в «Осталось выбрать».</p>";

  var why = !filled.length ? "Выберите хотя бы один класс" : "";
  html += '<div class="ag-foot"><button type="button" class="lu-btn-confirm" onclick="mlApply()"' + (why ? " disabled" : "") + ">Применить</button>" +
    (why ? '<span class="ag-note">' + why + "</span>" : "") + "</div>";
  body.innerHTML = html;
}

// АУД4-3 (C5): отметки АСИ убранных классов и уровней выше нового не остаются
// (навыки убранного класса снимает _classSkillSync при фиксации основы)
function _mlPruneAsi(char, rows) {
  if (!char.asiUsed || typeof char.asiUsed !== "object" || Array.isArray(char.asiUsed)) return;
  var lvlOf = {};
  rows.forEach(function(r) { lvlOf[r.cls] = r.level; });
  Object.keys(char.asiUsed).forEach(function(c) {
    if (!Array.isArray(char.asiUsed[c])) return;
    char.asiUsed[c] = char.asiUsed[c].filter(function(l) { return typeof l !== "number" || (lvlOf[c] && l <= lvlOf[c]); });
    if (!lvlOf[c] && !char.asiUsed[c].length) delete char.asiUsed[c];
  });
}

function mlApply() {
  var char = getCurrentChar();
  if (!char || !_ml || char.basicLocked) return;
  var ed = edData(char);
  var rows = _ml.filter(function(r) { return r.cls; });
  if (!rows.length || _mlTotal(rows) > 20) return;
  var firstChanged = char.class !== rows[0].cls;
  char.classes = rows.map(function(r) {
    var at = ed.SUBCLASS_LEVEL[r.cls] || 0;
    return { class: r.cls, level: r.level, subclass: (at && r.level >= at) ? (r.sub || "") : "", hitDie: ed.CLASS_HIT_DICE[r.cls] || 8 };
  });
  syncClassFields(char);
  _mlPruneAsi(char, rows);
  // Раскладка задаётся целиком — снимок пошагового отката к ней не относится
  delete char._prevLevelSnapshot;
  if (typeof recalcArmorWeaponFromSources === "function") recalcArmorWeaponFromSources(char);
  if (typeof recalcToolsFromSources === "function") recalcToolsFromSources(char);
  char.combat.hpDiceSpent = 0;
  delete char.combat.hpDiceSpentBy;
  rulesApplySpellSlots(char);
  saveToLocal();
  screenBack();
  loadCharacter(currentId);
  if (firstChanged && typeof autoSelectProficiencies === "function") autoSelectProficiencies();
  recalculateHP(true);
  char = getCurrentChar();
  char.combat.hpCurrent = char.combat.hpMax;
  safeSet("hp-current", char.combat.hpMax);
  if (typeof updateHPDisplay === "function") updateHPDisplay();
  if (typeof renderSpellSlots === "function") renderSpellSlots();
  if (typeof updateClassFeatures === "function") updateClassFeatures();
  if (typeof renderClassResources === "function") renderClassResources();
  if (typeof calculateAC === "function") calculateAC();
  if (typeof updateLockButtonState === "function") updateLockButtonState();
  saveToLocal();
  var label = getClassLabel(char) || char.class;
  if (window.AppLog) AppLog.action("character", "раскладка классов: " + label + " (ур. " + char.level + ")");
  showToast("Классы: " + label + " · " + char.level + " ур.", "success");
  _ml = null;
}
