// ============================================================
// app-pdf.js — FEAT-3: экспорт листа персонажа в PDF
// Использует jsPDF (vendor/jspdf/jspdf.umd.min.js) + Roboto-Regular
// (vendor/jspdf/roboto-base64.js → window.__ROBOTO_REGULAR_BASE64).
// ============================================================

// VFS изолирован per-document → шрифт регистрируем заново для каждого doc
function _pdfEnsureFont(doc) {
  var b64 = window.__ROBOTO_REGULAR_BASE64;
  if (!b64) {
    if (window.__catchLog) window.__catchLog('pdf:font-missing', new Error('__ROBOTO_REGULAR_BASE64 not loaded'));
    return;
  }
  doc.addFileToVFS('Roboto-Regular.ttf', b64);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.setFont('Roboto', 'normal');
}

function _pdfNewDoc() {
  var lib = window.jspdf || window;
  var Ctor = (lib && lib.jsPDF) ? lib.jsPDF : (window.jsPDF || null);
  if (!Ctor) throw new Error('jsPDF не загружен');
  var doc = new Ctor({ unit: 'mm', format: 'a4', compress: true });
  _pdfEnsureFont(doc);
  return doc;
}

function _hexToRgb(hex) {
  var m = String(hex || '').match(/^#?([0-9a-f]{6})$/i);
  if (!m) return { r: 100, g: 100, b: 100 };
  var n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

// Image (URL/data-URL/webp/png) → PNG data-URL через canvas. addImage не принимает webp.
function _pdfImgToDataUrl(src, maxSize) {
  return new Promise(function(resolve) {
    if (!src) return resolve(null);
    var img = new Image();
    img.onload = function() {
      try {
        var c = document.createElement('canvas');
        var max = maxSize || 256;
        var scale = Math.min(max / img.width, max / img.height, 1);
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/png'));
      } catch (e) {
        if (window.__catchLog) window.__catchLog('pdf:img-canvas', e);
        resolve(null);
      }
    };
    img.onerror = function() { resolve(null); };
    try { img.src = src; } catch (e) { resolve(null); }
  });
}

// Маппинг русских названий школ → имя файла assets/schools/{file}.webp
var _PDF_SCHOOL_FILE = {
  'Ограждение':     'abjuration',
  'Призывание':     'conjuration',
  'Призыв':         'conjuration',
  'Прорицание':     'divination',
  'Очарование':     'enchantment',
  'Заговаривание':  'enchantment',
  'Воплощение':     'evocation',
  'Эвокация':       'evocation',
  'Иллюзия':        'illusion',
  'Некромантия':    'necromancy',
  'Преобразование': 'transmutation'
};

function _pdfLoadSchoolIcons(schoolsUsed) {
  window.__pdfSchoolIcons = window.__pdfSchoolIcons || {};
  var promises = [];
  schoolsUsed.forEach(function(s) {
    if (Object.prototype.hasOwnProperty.call(window.__pdfSchoolIcons, s)) return;
    var file = _PDF_SCHOOL_FILE[s];
    if (!file) { window.__pdfSchoolIcons[s] = null; return; }
    var p = _pdfImgToDataUrl('assets/schools/' + file + '.webp', 96).then(function(url) {
      window.__pdfSchoolIcons[s] = url;
    });
    promises.push(p);
  });
  return Promise.all(promises);
}

// Декоративная двойная рамка + 4 уголка на каждой странице
function _pdfDecoBorder(doc, accentRgb) {
  var w = doc.internal.pageSize.getWidth();
  var h = doc.internal.pageSize.getHeight();
  var acc = accentRgb || { r: 180, g: 150, b: 100 };

  doc.setDrawColor(acc.r, acc.g, acc.b);
  doc.setLineWidth(0.35);
  doc.rect(7, 7, w - 14, h - 14);
  doc.setLineWidth(0.15);
  doc.rect(9, 9, w - 18, h - 18);

  // Уголки L-формы во всех 4 углах
  var cl = 7;
  doc.setLineWidth(0.55);
  doc.line(5,     5,     5 + cl, 5);     doc.line(5,     5,     5,     5 + cl);
  doc.line(w - 5, 5,     w - 5 - cl, 5); doc.line(w - 5, 5,     w - 5, 5 + cl);
  doc.line(5,     h - 5, 5 + cl, h - 5); doc.line(5,     h - 5, 5,     h - 5 - cl);
  doc.line(w - 5, h - 5, w - 5 - cl, h - 5); doc.line(w - 5, h - 5, w - 5, h - 5 - cl);

  // Маленькие декоративные ромбики между уголками по верху и низу
  doc.setFillColor(acc.r, acc.g, acc.b);
  var midTop = [w / 2 - 6, w / 2, w / 2 + 6];
  midTop.forEach(function(x) {
    doc.triangle(x - 1.2, 7, x + 1.2, 7, x, 9.4, 'F');
  });
  var midBot = [w / 2 - 6, w / 2, w / 2 + 6];
  midBot.forEach(function(x) {
    doc.triangle(x - 1.2, h - 7, x + 1.2, h - 7, x, h - 9.4, 'F');
  });

  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
}

function _pdfSafeName(s) {
  return String(s || 'персонаж').replace(/[^a-zA-Zа-яА-Я0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'персонаж';
}

function _pdfFormatMod(v) { return v >= 0 ? '+' + v : '' + v; }

// Линия-разделитель
function _pdfRule(doc, y) {
  doc.setDrawColor(180);
  doc.setLineWidth(0.2);
  doc.line(15, y, 195, y);
  doc.setDrawColor(0);
}

// Заголовок секции: тёмная полоса с белым текстом
function _pdfSection(doc, y, title) {
  doc.setFillColor(40, 50, 70);
  doc.rect(15, y, 180, 6, 'F');
  doc.setTextColor(255);
  doc.setFontSize(10);
  doc.text(String(title || '').toUpperCase(), 17, y + 4.2);
  doc.setTextColor(0);
  return y + 9;
}

// Перенос страницы при необходимости (footer на h-11, рамка на h-7 → запас 16)
function _pdfNeed(doc, y, lines) {
  var pageH = doc.internal.pageSize.getHeight();
  if (y + (lines || 6) > pageH - 16) {
    doc.addPage();
    return 20;
  }
  return y;
}

// Многострочный текст с обёрткой по ширине
function _pdfMultiline(doc, y, text, opts) {
  opts = opts || {};
  var x = opts.x || 17;
  var size = opts.size || 9;
  var maxW = opts.maxW || 178;
  var lineH = opts.lineH || 4.4;
  if (text === undefined || text === null) text = '';
  doc.setFontSize(size);
  var lines = doc.splitTextToSize(String(text), maxW);
  for (var i = 0; i < lines.length; i++) {
    y = _pdfNeed(doc, y, lineH + 1);
    doc.text(lines[i], x, y);
    y += lineH;
  }
  return y;
}

// Подвал + декоративная рамка на каждой странице
function _pdfFooter(doc, charName, classRgb) {
  var pages = doc.internal.getNumberOfPages();
  var ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '';
  var now = new Date();
  var dd = String(now.getDate()).padStart(2, '0');
  var mm = String(now.getMonth() + 1).padStart(2, '0');
  var yyyy = now.getFullYear();
  var stamp = dd + '.' + mm + '.' + yyyy;
  var pageW = doc.internal.pageSize.getWidth();
  var pageH = doc.internal.pageSize.getHeight();
  for (var i = 1; i <= pages; i++) {
    doc.setPage(i);
    _pdfDecoBorder(doc, classRgb);
    doc.setFontSize(7);
    doc.setTextColor(120);
    var left = 'D&D Sheet v' + ver + ' · ' + stamp;
    var right = 'Стр. ' + i + ' / ' + pages;
    doc.text(left, 15, pageH - 11);
    doc.text(right, pageW - 15, pageH - 11, { align: 'right' });
    if (charName) {
      doc.setFontSize(7);
      doc.text(String(charName), pageW / 2, pageH - 11, { align: 'center' });
    }
    doc.setTextColor(0);
  }
}

// ─── Сборщики секций ─────────────────────────────────────────

async function _pdfHeader(doc, char, classRgb) {
  // ── Цветная полоса в классовом цвете (18мм высоты) ─────────────
  var pageW = doc.internal.pageSize.getWidth();
  doc.setFillColor(classRgb.r, classRgb.g, classRgb.b);
  doc.rect(11, 11, pageW - 22, 22, 'F');

  // ── Круг под аватар/буква класса ───────────────────────────────
  var cx = 25, cy = 22, r = 9;
  doc.setFillColor(255);
  doc.circle(cx, cy, r, 'F');
  doc.setDrawColor(255);
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, r);

  var avatarUrl = char.avatar ? await _pdfImgToDataUrl(char.avatar, 200) : null;
  if (avatarUrl) {
    // jsPDF не маскирует по кругу — вписываем PNG в квадрат внутри круга
    var d = r * 2 - 1;
    try { doc.addImage(avatarUrl, 'PNG', cx - d / 2, cy - d / 2, d, d); }
    catch (e) { avatarUrl = null; }
  }
  if (!avatarUrl) {
    // Буква класса в классовом цвете
    var letter = ((char.class || '?') + '').charAt(0).toUpperCase();
    doc.setTextColor(classRgb.r, classRgb.g, classRgb.b);
    doc.setFontSize(18);
    doc.text(letter, cx, cy + 2.5, { align: 'center' });
  }

  // ── Имя крупно на полосе ───────────────────────────────────────
  doc.setTextColor(255);
  doc.setFontSize(17);
  doc.text(String(char.name || 'Без имени'), cx + r + 4, cy - 1);

  // Сабтайтл белым полупрозрачным (через 220-tint)
  var clsLine;
  if (char.classes && char.classes.length > 1 && typeof getClassLabel === 'function') {
    clsLine = getClassLabel(char);
  } else {
    clsLine = char.class || '';
    if (char.subclass) clsLine += (clsLine ? ' (' + char.subclass + ')' : char.subclass);
  }
  var sub = [];
  if (clsLine) sub.push(clsLine);
  if (char.race) sub.push(char.race);
  if (char.background) sub.push(char.background);
  if (char.alignment) sub.push(char.alignment);
  doc.setFontSize(9.5);
  doc.setTextColor(240);
  if (sub.length) doc.text(sub.join(' · '), cx + r + 4, cy + 5);

  doc.setTextColor(0);

  // ── Под полосой: метрики уровня/опыта/размера ──────────────────
  var y = 38;
  doc.setFontSize(9);
  var stats = [];
  stats.push('Уровень: ' + (char.level || 1));
  if (char.exp) stats.push('Опыт: ' + char.exp);
  if (char.size) stats.push('Размер: ' + char.size);
  if (char.speed) stats.push('Скорость: ' + char.speed);
  doc.text(stats.join('   '), 15, y);
  y += 3;
  _pdfRule(doc, y);
  return y + 4;
}

function _pdfStatsAndCombat(doc, y, char) {
  y = _pdfSection(doc, y, 'Характеристики и бой');

  var stats = char.stats || {};
  var combat = char.combat || {};
  var profBonus = (typeof getProficiencyBonus === 'function') ? getProficiencyBonus(char.level || 1) : 2;

  var statRows = [
    ['СИЛ', stats.str || 10],
    ['ЛОВ', stats.dex || 10],
    ['ТЕЛ', stats.con || 10],
    ['ИНТ', stats.int || 10],
    ['МУД', stats.wis || 10],
    ['ХАР', stats.cha || 10]
  ];

  doc.setFontSize(9);
  // Левая колонка — стат-блоки 30×18мм
  var x0 = 17;
  var y0 = y;
  for (var i = 0; i < 6; i++) {
    var col = i % 3;
    var row = Math.floor(i / 3);
    var bx = x0 + col * 32;
    var by = y0 + row * 19;
    doc.setDrawColor(150);
    doc.setLineWidth(0.3);
    doc.rect(bx, by, 28, 16);
    doc.setFontSize(8);
    doc.setTextColor(90);
    doc.text(statRows[i][0], bx + 14, by + 4, { align: 'center' });
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text(String(statRows[i][1]), bx + 14, by + 10, { align: 'center' });
    var mod = Math.floor((statRows[i][1] - 10) / 2);
    doc.setFontSize(9);
    doc.text(_pdfFormatMod(mod), bx + 14, by + 14.5, { align: 'center' });
  }

  // Правая колонка — боевой блок
  var rx = 115;
  var ry = y0;
  doc.setDrawColor(150);
  doc.rect(rx, ry, 80, 38);
  doc.setFontSize(9);
  var combatRows = [
    'КД: ' + (combat.ac || 10),
    'Хиты: ' + (combat.hpCurrent || 0) + ' / ' + (combat.hpMax || 0) + (combat.hpTemp ? ' (+' + combat.hpTemp + ' врем.)' : ''),
    'Кости хитов: ' + (combat.hpDice || '—') + (combat.hpDiceSpent ? ' (исп. ' + combat.hpDiceSpent + ')' : ''),
    'Инициатива: ' + _pdfFormatMod(combat.init || Math.floor(((stats.dex || 10) - 10) / 2)),
    'Скорость: ' + (combat.speed || char.speed || '—'),
    'Бонус мастерства: ' + _pdfFormatMod(profBonus),
    'Вдохновение: ' + (char.inspiration ? 'да' : 'нет')
  ];
  for (var j = 0; j < combatRows.length; j++) {
    doc.text(combatRows[j], rx + 3, ry + 6 + j * 4.6);
  }

  y = y0 + 41;

  // Доп. строки: концентрация, состояния
  if (char.concentration && char.concentration.name) {
    y = _pdfNeed(doc, y, 5);
    doc.setFontSize(9);
    doc.setTextColor(120, 60, 0);
    doc.text('⚡ Концентрация: ' + char.concentration.name, 17, y);
    doc.setTextColor(0);
    y += 5;
  }
  if (char.conditions && char.conditions.length) {
    y = _pdfNeed(doc, y, 5);
    var condNames = char.conditions.map(function(c) {
      if (typeof c === 'string') return c;
      return (c.name || c.id || '').replace(/[^\sа-яА-ЯёЁa-zA-Z0-9-]/g, '').trim();
    }).filter(Boolean);
    if (condNames.length) y = _pdfMultiline(doc, y, 'Состояния: ' + condNames.join(', '), { size: 9 });
  }
  if (char.effects && char.effects.length) {
    var effNames = char.effects.map(function(e) {
      if (typeof e === 'string') return e;
      return (e.name || e.id || '').replace(/[^\sа-яА-ЯёЁa-zA-Z0-9-]/g, '').trim();
    }).filter(Boolean);
    if (effNames.length) y = _pdfMultiline(doc, y, 'Эффекты: ' + effNames.join(', '), { size: 9 });
  }

  var resistList = [];
  if (char.resistances && char.resistances.length) resistList.push('Сопротивления: ' + char.resistances.join(', '));
  if (char.immunities && char.immunities.length) resistList.push('Иммунитеты: ' + char.immunities.join(', '));
  if (char.vulnerabilities && char.vulnerabilities.length) resistList.push('Уязвимости: ' + char.vulnerabilities.join(', '));
  if (resistList.length) y = _pdfMultiline(doc, y, resistList.join(' | '), { size: 9 });

  return y + 2;
}

function _pdfSaves(doc, y, char) {
  y = _pdfSection(doc, y, 'Спасброски');
  var stats = char.stats || {};
  var saves = char.saves || {};
  var profBonus = (typeof getProficiencyBonus === 'function') ? getProficiencyBonus(char.level || 1) : 2;
  var rows = [
    ['Сила',          'str'],
    ['Ловкость',      'dex'],
    ['Телосложение',  'con'],
    ['Интеллект',     'int'],
    ['Мудрость',      'wis'],
    ['Харизма',       'cha']
  ];
  doc.setFontSize(9);
  for (var i = 0; i < 6; i++) {
    var col = i % 2;
    var row = Math.floor(i / 2);
    var bx = 17 + col * 90;
    var by = y + row * 5.2;
    var k = rows[i][1];
    var prof = !!saves[k];
    var mod = Math.floor(((stats[k] || 10) - 10) / 2) + (prof ? profBonus : 0);
    doc.text((prof ? '☑' : '☐') + ' ' + rows[i][0] + '  ' + _pdfFormatMod(mod), bx, by);
  }
  return y + 5.2 * 3 + 2;
}

function _pdfSkills(doc, y, char) {
  y = _pdfSection(doc, y, 'Навыки');
  var skillList = (typeof skills !== 'undefined' && Array.isArray(skills)) ? skills : [];
  if (!skillList.length) return y;
  var stats = char.stats || {};
  var profBonus = (typeof getProficiencyBonus === 'function') ? getProficiencyBonus(char.level || 1) : 2;
  var expert = char.expertiseSkills || [];
  var marks = char.skills || {};
  doc.setFontSize(8.5);
  var perCol = Math.ceil(skillList.length / 2);
  for (var i = 0; i < skillList.length; i++) {
    var col = Math.floor(i / perCol);
    var row = i % perCol;
    var bx = 17 + col * 90;
    var by = y + row * 4.6;
    var sk = skillList[i];
    var prof = !!marks[i];
    var hasExp = expert.indexOf(i) !== -1;
    var statKey = (sk.stat || 'str').toLowerCase();
    var mod = Math.floor(((stats[statKey] || 10) - 10) / 2);
    if (hasExp) mod += profBonus * 2;
    else if (prof) mod += profBonus;
    var marker = hasExp ? '★' : (prof ? '☑' : '☐');
    doc.text(marker + ' ' + sk.name + ' (' + statKey.toUpperCase() + ') ' + _pdfFormatMod(mod), bx, by);
  }
  return y + perCol * 4.6 + 2;
}

function _pdfAttacks(doc, y, char) {
  var weapons = char.weapons || [];
  if (!weapons.length) return y;
  y = _pdfSection(doc, y, 'Атаки и оружие');
  var stats = char.stats || {};
  var profBonus = (typeof getProficiencyBonus === 'function') ? getProficiencyBonus(char.level || 1) : 2;
  doc.setFontSize(9);

  // шапка таблицы
  doc.setFillColor(230, 234, 240);
  doc.rect(17, y, 178, 5, 'F');
  doc.text('Оружие', 19, y + 3.6);
  doc.text('Атака', 110, y + 3.6);
  doc.text('Урон', 135, y + 3.6);
  doc.text('Хар.', 175, y + 3.6);
  y += 5.5;

  for (var i = 0; i < weapons.length; i++) {
    var w = weapons[i];
    y = _pdfNeed(doc, y, 5);
    var statKey = (w.stat || 'str').toLowerCase();
    var statMod = Math.floor(((stats[statKey] || 10) - 10) / 2);
    var atk = statMod + (w.proficient ? profBonus : 0);
    doc.text(String(w.name || '—'), 19, y);
    doc.text(_pdfFormatMod(atk), 110, y);
    var dmgStr = (w.damage || '—') + (statMod ? ' ' + _pdfFormatMod(statMod) : '');
    doc.text(dmgStr, 135, y);
    doc.text((w.statName || statKey.toUpperCase().slice(0, 3)) + (w.proficient ? ' ✓' : ''), 175, y);
    y += 4.8;
  }
  return y + 1;
}

function _pdfSpells(doc, y, char) {
  var spells = char.spells || {};
  var mySpells = spells.mySpells || [];
  var hasSlots = spells.slots && Object.keys(spells.slots).some(function(k) { return (spells.slots[k] || 0) > 0; });
  if (!mySpells.length && !hasSlots) return y;

  y = _pdfSection(doc, y, 'Заклинания');
  doc.setFontSize(9);

  // ── Легенда школ магии: иконки только тех школ, что есть у персонажа ───
  var schoolsUsed = [];
  var seen = {};
  for (var si = 0; si < mySpells.length; si++) {
    var sch = mySpells[si].school;
    if (sch && !seen[sch]) { seen[sch] = 1; schoolsUsed.push(sch); }
  }
  var icons = window.__pdfSchoolIcons || {};
  var schoolsWithIcon = schoolsUsed.filter(function(s) { return icons[s]; });
  if (schoolsWithIcon.length) {
    y = _pdfNeed(doc, y, 7);
    var lx = 17;
    var lblW = 178;
    var slot = Math.min(40, Math.max(28, Math.floor(lblW / Math.max(1, schoolsWithIcon.length))));
    schoolsWithIcon.forEach(function(s, i) {
      var x = lx + i * slot;
      try { doc.addImage(icons[s], 'PNG', x, y - 3.5, 4.2, 4.2); } catch (e) {}
      doc.setFontSize(8.2);
      doc.setTextColor(70);
      doc.text(s, x + 5, y);
      doc.setTextColor(0);
    });
    y += 4;
  }

  if (spells.stat || spells.dc || spells.attack) {
    var meta = [];
    if (spells.stat) meta.push('Характеристика: ' + String(spells.stat).toUpperCase());
    if (spells.dc) meta.push('КЗ: ' + spells.dc);
    if (spells.attack) meta.push('Атака: ' + _pdfFormatMod(spells.attack));
    if (typeof spells.mod === 'number') meta.push('Модификатор: ' + _pdfFormatMod(spells.mod));
    y = _pdfMultiline(doc, y, meta.join('   '), { size: 9 });
  }

  // Ячейки
  if (spells.slots) {
    var slotLines = [];
    for (var lvl = 1; lvl <= 9; lvl++) {
      var max = spells.slots[lvl] || 0;
      if (!max) continue;
      var used = (spells.slotsUsed && spells.slotsUsed[lvl]) || 0;
      var avail = Math.max(0, max - used);
      slotLines.push('Ур. ' + lvl + ': ' + avail + '/' + max);
    }
    if (spells.slots.pact || (typeof char.pactLevel === 'number' && char.pactSlots)) {
      var pMax = char.pactSlots || spells.slots.pact || 0;
      var pUsed = char.pactUsed || 0;
      var pLvl = char.pactLevel || '';
      if (pMax) slotLines.push('Пакт (ур.' + pLvl + '): ' + Math.max(0, pMax - pUsed) + '/' + pMax);
    }
    if (slotLines.length) {
      y = _pdfNeed(doc, y, 5);
      doc.text('Ячейки: ' + slotLines.join('   '), 17, y);
      y += 5;
    }
  }

  // Группируем по уровню
  if (mySpells.length) {
    var byLevel = {};
    for (var i = 0; i < mySpells.length; i++) {
      var sp = mySpells[i];
      var l = (typeof sp.level === 'number') ? sp.level : 0;
      if (!byLevel[l]) byLevel[l] = [];
      byLevel[l].push(sp);
    }
    var prepared = spells.prepared || [];
    var levels = Object.keys(byLevel).sort(function(a, b) { return Number(a) - Number(b); });
    for (var li = 0; li < levels.length; li++) {
      var l = Number(levels[li]);
      var label = l === 0 ? 'Заговоры' : 'Уровень ' + l;
      y = _pdfNeed(doc, y, 5);
      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.text(label + ':', 17, y);
      doc.setTextColor(0);
      y += 4;
      var names = byLevel[l].map(function(sp) {
        var pref = (l > 0 && prepared.indexOf(sp.name) !== -1) ? '● ' : '○ ';
        var school = sp.school ? ' [' + sp.school + ']' : '';
        return pref + (sp.name || '—') + school;
      });
      y = _pdfMultiline(doc, y, names.join('   '), { size: 9, x: 19, maxW: 176 });
      y += 0.5;
    }
  }
  return y + 1;
}

function _pdfInventory(doc, y, char) {
  var inv = char.inventory || {};
  var coins = char.coins || {};
  var hasAny = ['weapon', 'armor', 'potion', 'scroll', 'tool', 'material', 'other'].some(function(k) {
    return Array.isArray(inv[k]) && inv[k].length;
  });
  var hasCoins = Object.keys(coins).some(function(k) { return coins[k]; });
  if (!hasAny && !hasCoins) return y;

  y = _pdfSection(doc, y, 'Инвентарь');
  doc.setFontSize(9);

  if (hasCoins) {
    var coinParts = [];
    if (coins.pp) coinParts.push(coins.pp + ' пп');
    if (coins.gp) coinParts.push(coins.gp + ' зм');
    if (coins.ep) coinParts.push(coins.ep + ' эм');
    if (coins.sp) coinParts.push(coins.sp + ' см');
    if (coins.cp) coinParts.push(coins.cp + ' мм');
    if (coinParts.length) {
      y = _pdfNeed(doc, y, 5);
      doc.text('Монеты: ' + coinParts.join(' · '), 17, y);
      y += 5;
    }
  }

  var labels = {
    weapon:   'Оружие',
    armor:    'Доспехи',
    potion:   'Зелья',
    scroll:   'Свитки',
    tool:     'Инструменты',
    material: 'Материалы',
    other:    'Прочее'
  };
  ['weapon','armor','potion','scroll','tool','material','other'].forEach(function(k) {
    var arr = inv[k] || [];
    if (!arr.length) return;
    var names = arr.map(function(it) {
      if (!it) return '';
      var nm = it.name || '—';
      var qty = it.qty && it.qty > 1 ? ' ×' + it.qty : '';
      return nm + qty;
    }).filter(Boolean);
    y = _pdfNeed(doc, y, 5);
    doc.setTextColor(60);
    doc.text(labels[k] + ':', 17, y);
    doc.setTextColor(0);
    y += 4;
    y = _pdfMultiline(doc, y, names.join(', '), { size: 9, x: 19, maxW: 176 });
    y += 0.5;
  });
  return y + 1;
}

function _pdfNotes(doc, y, char) {
  var sections = (char.notesV2 && char.notesV2.sections) || {};
  var labels = {
    backstory:   'Предыстория',
    personality: 'Личность',
    ideals:      'Идеалы',
    bonds:       'Привязанности',
    flaws:       'Слабости',
    appearance:  'Внешность',
    features:    'Особенности',
    magicItems:  'Магические предметы'
  };
  var any = Object.keys(labels).some(function(k) { return sections[k] && sections[k].trim(); });
  // legacy-поля
  any = any || (char.notes && char.notes.trim()) || (char.features && char.features.trim()) ||
        (char.appearance && char.appearance.trim()) || (char.magicItems && char.magicItems.trim());
  if (!any) return y;

  y = _pdfSection(doc, y, 'Заметки и описание');
  doc.setFontSize(9);

  var order = ['backstory','personality','ideals','bonds','flaws','appearance','features','magicItems'];
  for (var i = 0; i < order.length; i++) {
    var k = order[i];
    var txt = (sections[k] && sections[k].trim()) || '';
    // fallback на легаси-поля верхнего уровня
    if (!txt) {
      if (k === 'appearance' && char.appearance) txt = char.appearance;
      else if (k === 'features' && char.features) txt = char.features;
      else if (k === 'magicItems' && char.magicItems) txt = char.magicItems;
      else if (k === 'backstory' && char.notes && !any) txt = char.notes;
    }
    if (!txt || !txt.trim()) continue;
    y = _pdfNeed(doc, y, 6);
    doc.setTextColor(60);
    doc.setFontSize(9);
    doc.text(labels[k] + ':', 17, y);
    doc.setTextColor(0);
    y += 4;
    y = _pdfMultiline(doc, y, txt.trim(), { size: 9, x: 19, maxW: 176, lineH: 4.2 });
    y += 1;
  }
  // Старые свободные заметки в char.notes если notesV2 нет
  if ((!sections.backstory || !sections.backstory.trim()) && char.notes && char.notes.trim()) {
    y = _pdfNeed(doc, y, 6);
    doc.setTextColor(60);
    doc.text('Заметки:', 17, y);
    doc.setTextColor(0);
    y += 4;
    y = _pdfMultiline(doc, y, char.notes.trim(), { size: 9, x: 19, maxW: 176, lineH: 4.2 });
  }
  return y;
}

// ─── Точка входа ─────────────────────────────────────────────

async function exportCharacterPDF(id, event) {
  if (event && event.stopPropagation) event.stopPropagation();
  try {
    var char = (typeof characters !== 'undefined') ? characters.find(function(c) { return c.id === id; }) : null;
    if (!char) {
      if (typeof showToast === 'function') showToast('Персонаж не найден', 'error');
      return;
    }

    // Pre-load: иконки школ магии для тех школ, что есть в книге заклинаний персонажа
    var mySpells = (char.spells && char.spells.mySpells) || [];
    var schoolsUsed = [];
    var seen = {};
    for (var i = 0; i < mySpells.length; i++) {
      var sch = mySpells[i].school;
      if (sch && !seen[sch]) { seen[sch] = 1; schoolsUsed.push(sch); }
    }
    if (schoolsUsed.length) {
      try { await _pdfLoadSchoolIcons(schoolsUsed); }
      catch (e) { if (window.__catchLog) window.__catchLog('pdf:schools', e); }
    }

    var classRgb = _hexToRgb((typeof getClassColor === 'function') ? getClassColor(char.class) : '#888');

    var doc = _pdfNewDoc();

    var y = await _pdfHeader(doc, char, classRgb);
    y = _pdfStatsAndCombat(doc, y, char);
    y = _pdfSaves(doc, y, char);
    y = _pdfSkills(doc, y, char);
    y = _pdfAttacks(doc, y, char);
    y = _pdfSpells(doc, y, char);
    y = _pdfInventory(doc, y, char);
    y = _pdfNotes(doc, y, char);

    _pdfFooter(doc, char.name || '', classRgb);

    var ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '';
    var fname = _pdfSafeName(char.name) + (ver ? '_v' + ver : '') + '.pdf';
    doc.save(fname);
    if (typeof showToast === 'function') showToast('📄 PDF готов', 'success');
  } catch (e) {
    if (window.__catchLog) window.__catchLog('pdf:export', e);
    if (typeof showToast === 'function') showToast('Ошибка PDF: ' + (e && e.message ? e.message : e), 'error');
    else if (typeof console !== 'undefined') console.error('[pdf]', e);
  }
}

// Экспонируем глобально (vanilla, без сборщика)
window.exportCharacterPDF = exportCharacterPDF;
