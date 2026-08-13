// ============================================================
// LVL-2 · Экран «Развитие» (#screen-progress) и «Об умении» (#screen-featureinfo)
//
// Сборка В2+ из мокапа tests/style-progress-mockups.html: класс — строка с
// раскрытием, поэтому высота экрана не растёт с уровнем. Ни одной коробки:
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
    return own || ((typeof CLASS_HIT_DICE !== "undefined" && CLASS_HIT_DICE[cls]) || 8);
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
  return '<div class="hp-row' + (open ? " is-open" : "") + '"' + (opts.attr || "") + ' onclick="hpToggleRow(this)">' +
    '<span class="disc-diamond' + (opts.mute ? " disc-diamond--plain" : "") + '"></span>' +
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
  var table = (typeof ASI_LEVELS !== "undefined") ? ASI_LEVELS : null;
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
  var at = (typeof SUBCLASS_LEVEL !== "undefined") ? SUBCLASS_LEVEL[e.cls] : 0;
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
  var cf = (typeof CLASS_FEATURES !== "undefined") ? CLASS_FEATURES[e.cls] : null;
  var sf = (typeof SUBCLASS_FEATURES !== "undefined" && e.sub) ? SUBCLASS_FEATURES[e.sub] : null;
  for (var l = 1; l <= e.level; l++) {
    var isNew = (l === e.level);
    if (cf && cf[l]) cf[l].forEach(function(f) { body += _pgFeat(e.cls, "", l, f.name, isNew); });
    if (sf && sf[l]) sf[l].forEach(function(f) { body += _pgFeat(e.cls, e.sub, l, f.name, isNew); });
  }
  if (!body) body = '<p class="hp-row-hint">Умений этого класса в справочнике пока нет.</p>';

  if (!e.sub && at) {
    if (e.level >= at) {
      var opts = '<option value="">Выберите подкласс</option>';
      var all = (typeof SUBCLASSES !== "undefined" && SUBCLASSES[e.cls]) ? SUBCLASSES[e.cls] : [];
      all.forEach(function(s) {
        var src = (typeof subclassSourceShort === "function") ? subclassSourceShort(s) : "";
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
    var cf = (typeof CLASS_FEATURES !== "undefined") ? CLASS_FEATURES[e.cls] : null;
    var sf = (typeof SUBCLASS_FEATURES !== "undefined" && e.sub) ? SUBCLASS_FEATURES[e.sub] : null;
    var add = function(f) {
      names.push(f.name);
      body += "<p><b>" + escapeHtml(f.name) + "</b> — " + escapeHtml(f.desc || "") + "</p>";
    };
    if (cf && cf[nl]) cf[nl].forEach(add);
    if (sf && sf[nl]) sf[nl].forEach(add);
    // Умение подкласса стоит в таблице класса своим именем («Архетип плута»),
    // поэтому вторым чипом его не дублируем — только поясняем в раскрытии.
    var at = (typeof SUBCLASS_LEVEL !== "undefined") ? SUBCLASS_LEVEL[e.cls] : 0;
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
    var have = list.map(function(e) { return e.cls; });
    var ok = [];
    ["Варвар", "Бард", "Воин", "Волшебник", "Друид", "Жрец", "Колдун", "Монах", "Паладин", "Плут", "Следопыт", "Чародей"]
      .forEach(function(c) {
        if (have.indexOf(c) !== -1) return;
        var chk = checkMulticlassPrereqs(char, c);
        if (chk && chk.ok) ok.push(c);
      });
    var nbody = ok.length
      ? "<p>Требования выполнены: " + escapeHtml(ok.join(", ")) + ".</p>"
      : '<p class="hp-row-hint">Ни один класс сейчас недоступен: для входа нужна характеристика 13 и выше ' +
        "(PHB, «Мультиклассирование»).</p>";
    nbody += "<p>Новый класс начинается с 1 уровня класса: умения 1-го уровня, владения по укороченному списку " +
      "мультикласса и своя кость хитов.</p>";
    nbody += _pgActRow('<button type="button" class="hp-act" onclick="pgAddClass()">Добавить класс →</button>');
    rows += _pgDisc("Новый класс", ok.length ? "доступно " + ok.length : "требования не выполнены", nbody, false, { mute: true });
  }

  return rows ? '<div class="pg-grp" data-pg-grp="next">Дальше</div><div class="hp-rows">' + rows + "</div>" : "";
}

function _pgActions(char) {
  var acts = '<button type="button" class="hp-act" onclick="pgLevelUp()">Повысить уровень →</button>';
  if (char._prevLevelSnapshot) {
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
    _pgActions(char);
}

function openProgress() {
  var char = (typeof getCurrentChar === "function") ? getCurrentChar() : null;
  if (!char) {
    if (typeof showToast === "function") showToast("Сначала выберите персонажа", "warn");
    return;
  }
  if (typeof migrateToMulticlass === "function") migrateToMulticlass(char);
  var body = $("pg-body");
  if (body) body.innerHTML = _pgBuild(char);
  if (typeof _closeOpenModals === "function") _closeOpenModals();
  showScreen("progress");
  // LVL-4: тур по экрану — при первом заходе, по флагу dnd_help_progress_seen.
  // Сам ждёт закрытия модалок и проверяет, что экран всё ещё открыт.
  if (typeof maybeStartProgressTour === "function") maybeStartProgressTour();
}

/** Перерисовать, если экран открыт. Зовётся из updateClassFeatures() — она
 *  идёт следом за повышением уровня, откатом, АСИ и классовыми выборами. */
function pgRefresh() {
  var screen = $("screen-progress");
  if (!screen || screen.classList.contains("hidden")) return;
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
 *  LVL-3: та же строка есть на листе, поэтому экран сначала открывается. */
function pgFocusSubclass(cls) {
  var screen = $("screen-progress");
  if (!screen || screen.classList.contains("hidden")) openProgress();
  var body = $("pg-body");
  if (!body) return;
  var row = body.querySelector('.hp-row[data-pg-cls="' + cls + '"]');
  if (!row) return;
  if (typeof hpSetRowOpen === "function") hpSetRowOpen(row, true);
  if (row.scrollIntoView) row.scrollIntoView({ block: "center" });
  var sel = row.nextElementSibling ? row.nextElementSibling.querySelector(".pg-sub-select") : null;
  if (sel && sel.focus) sel.focus();
}

// Повышение и откат общие с листом и заканчиваются на нём (loadCharacter
// возвращает экран персонажа). Пришедшего сюда с «Развития» возвращаем назад.
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
  if (typeof currentScreenName === "function" && currentScreenName() === "progress") {
    pgRefresh();
    return;
  }
  openProgress();
}

/** «Добавить класс →» — сразу к блоку нового класса в модалке повышения */
function pgAddClass() {
  if (typeof openLevelUpModal !== "function") return;
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

/** Поле «Класс» на листе: у мультикласса <select> умеет только первый класс,
 *  поэтому вместо него встаёт строка со всеми классами и входом в «Развитие».
 *  Сам select остаётся в разметке — его значение читает updateChar(). */
function syncClassFieldUI(char) {
  var sel = $("char-class"), mc = $("char-class-mc"), lbl = $("char-class-mc-label");
  if (!sel || !mc) return;
  var multi = !!(char && char.classes && char.classes.length > 1);
  sel.style.display = multi ? "none" : "";
  mc.style.display = multi ? "" : "none";
  if (multi && lbl && typeof getClassLabel === "function") lbl.textContent = getClassLabel(char);
}

// ── Экран «Об умении» ───────────────────────────────────────
function openFeatureInfo(cls, sub, level, name) {
  var found = null, src = "";
  var pick = function(table, label) {
    if (found || !table || !table[level]) return;
    table[level].forEach(function(f) {
      if (!found && f.name === name) { found = f; src = label; }
    });
  };
  if (sub && typeof SUBCLASS_FEATURES !== "undefined") pick(SUBCLASS_FEATURES[sub], sub);
  if (typeof CLASS_FEATURES !== "undefined") pick(CLASS_FEATURES[cls], cls);
  if (!found) {
    if (typeof showToast === "function") showToast("Нет описания этого умения", "warn");
    return;
  }
  var title = $("fi-title-h");
  if (title) title.textContent = found.name;
  var srcLabel = escapeHtml(src) + " <span class=\"hp-dot\">·</span> " + level + " ур.";
  if (sub && src === sub && typeof subclassSourceShort === "function") {
    var s = subclassSourceShort(sub);
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
