#!/usr/bin/env node
// CLI: node tools/check-theme.js [root] [--report | --update-baseline | --hook]
// THEME-2: zero-dep автопроверки тем (решение юзера: без Playwright/браузера).
//
// 4 чека, exit 1 при провале (кроме --hook — всегда exit 0, warn-only):
//   1. Синхрон light/auto — карты --токенов блоков :root[data-theme="light"] и
//      :root[data-theme="auto"] (внутри @media prefers-color-scheme: light) совпадают
//      в обе стороны, включая значения. Auto-блок — страховка: JS резолвит auto в
//      dark/light на <html> (index.html preload + app-ui.js _applyTheme), но CSS-дубль
//      обязан не дрейфовать (дрейф до THEME-2: 8 токенов --weapon-color…--highlight-color).
//   2. Паритет dark↔light — каждый light-токен существует в dark :root (иначе в тёмной
//      теме токен пуст); каждый dark-токен с цветовым литералом переопределён в light
//      (иначе тёмный цвет протекает в светлую). Минус документированные исключения.
//      Плюс паритет акцент-пресетов: каждый :root[data-accent=X] имеет light-пару
//      с тем же набором свойств.
//   3. WCAG-контраст — пары из tools/theme-contrast-pairs.json; var() резолвится
//      рекурсивно по карте темы, полупрозрачные слои композитятся на --bg-0
//      (flatten). Нерезолвимое (не-цвет, calc и т.п.) → skip с warning, не FAIL.
//      Пороги стартово мягкие там, где текущая палитра ниже цели — ужесточаются
//      в THEME-3/6 (цель обозначена полем target в JSON).
//   4. Ratchet хардкодов — счётчик цветовых литералов (hex/rgb/hsl, кроме url(...))
//      в правилах вне :root-токен-блоков + счётчик !important в правилах с
//      [data-theme=…]. База — tools/theme-baseline.json; FAIL только при РОСТЕ.
//      При снижении локально запускать --update-baseline (ratchet вниз).
//
// Режимы:
//   (default)          — CI/локально: все 4 чека.
//   --report           — группировка хардкодов по секциям style.css (рабочий
//                        список токенизации THEME-4/5), stdout, exit 0.
//   --update-baseline  — перезаписать tools/theme-baseline.json текущими счётчиками.
//   --hook             — PostToolUse: stdin JSON, реагирует только на style.css /
//                        theme-*.json / check-theme.js, итог в stderr, всегда exit 0.
//
// Парсер — минимум по образцу tools/css-usage-report.js (блоки ищутся по
// селекторам, НЕ по номерам строк). Статический анализ: --glass-alpha берётся
// дефолтный из :root (слайдер юзера в рантайме не учитывается — осознанно).
'use strict';

const fs = require('fs');
const path = require('path');

// ---------- Документированные исключения (менять осознанно, с комментарием) ----------

// Чек 1: токены, которым РАЗРЕШЕНО отличаться между light- и auto-блоками.
const SYNC_EXCEPTIONS = {
  // (пусто — после фикса дрейфа THEME-2 блоки идентичны)
};

// Чек 2: light-токены без пары в dark :root.
const PARITY_LIGHT_ONLY = {
  '--tour-dim': 'тёмная тема использует fallback var(--overlay) в .tour-mask/.tour-corner (style.css, секция тура)',
};

// Чек 2: dark-токены с цветовым литералом, осознанно НЕ переопределённые в light.
const PARITY_DARK_ONLY = {
  '--rec': 'BUILD-LVL-3: фиксированный цвет рекомендаций билда, тема-независим (коммент в :root)',
  '--rec-bg': 'BUILD-LVL-3: пара к --rec',
  // THEME-5: --poison-color/--disease-color получили light+auto-пары (плашки состояний читаемы на кремовом).
};

// ---------- CSS-парсер ----------

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, function (m) {
    return m.replace(/[^\n]/g, ' ');
  });
}

function buildLineIndex(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') starts.push(i + 1);
  }
  return function lineOf(offset) {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= offset) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };
}

// Возвращает плоский список правил { selector, body, start, media }.
// В @media/@supports/@keyframes заходит рекурсивно (media — контекст prefers-color-scheme,
// шаги @keyframes попадают в счётчик хардкодов как обычные правила).
function parseCss(css) {
  const rules = [];
  let i = 0;
  const n = css.length;

  function skipString(quote) {
    i++;
    while (i < n && css[i] !== quote && css[i] !== '\n') {
      if (css[i] === '\\') i++;
      i++;
    }
    if (i < n) i++;
  }

  function readBlock() { // css[i] === '{'; возвращает содержимое, выходит за парной '}'
    const open = i;
    let depth = 0;
    while (i < n) {
      const c = css[i];
      if (c === '"' || c === "'") { skipString(c); continue; }
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) { i++; return css.slice(open + 1, i - 1); }
      }
      i++;
    }
    return css.slice(open + 1);
  }

  function parseLevel(media) {
    while (i < n) {
      while (i < n && /\s/.test(css[i])) i++;
      if (i >= n) return;
      if (css[i] === '}') { i++; return; }

      const start = i;
      let prelude = '';
      while (i < n && css[i] !== '{' && css[i] !== ';' && css[i] !== '}') {
        if (css[i] === '"' || css[i] === "'") {
          const from = i;
          skipString(css[i]);
          prelude += css.slice(from, i);
          continue;
        }
        prelude += css[i];
        i++;
      }
      if (i >= n) return;
      if (css[i] === ';') { i++; continue; }
      if (css[i] === '}') continue;
      prelude = prelude.trim();

      if (prelude[0] === '@') {
        const atName = (prelude.match(/^@([a-zA-Z-]+)/) || [, ''])[1].toLowerCase();
        if (/^(media|supports|container|layer)$/.test(atName) || /keyframes$/.test(atName)) {
          i++;
          parseLevel(atName === 'media' ? prelude : media);
        } else {
          readBlock(); // @font-face, @page — деклараций тем нет
        }
      } else {
        const body = readBlock();
        rules.push({ selector: prelude.replace(/\s+/g, ' '), body: body, start: start, media: media || '' });
      }
    }
  }

  parseLevel('');
  return rules;
}

function splitSelectors(sel) {
  const parts = [];
  let depth = 0, cur = '';
  for (let k = 0; k < sel.length; k++) {
    const c = sel[k];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    if (c === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; }
    else cur += c;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

// Декларации из тела правила: [{prop, value}] (';' внутри скобок — data:uri — не режет)
function parseDecls(body) {
  const decls = [];
  let depth = 0, cur = '';
  function push(s) {
    s = s.trim();
    if (!s) return;
    const k = s.indexOf(':');
    if (k < 0) return;
    decls.push({ prop: s.slice(0, k).trim(), value: s.slice(k + 1).trim().replace(/\s+/g, ' ') });
  }
  for (let k = 0; k < body.length; k++) {
    const c = body[k];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    if (c === ';' && depth === 0) { push(cur); cur = ''; }
    else cur += c;
  }
  push(cur);
  return decls;
}

// «Токен-блок» — каждый селектор списка вида :root[attr]*… (без потомков)
function isTokenBlockSelector(selector) {
  return splitSelectors(selector).every(function (s) {
    return /^:root(\[[^\]]*\])*$/.test(s);
  });
}

// ---------- Сбор карт токенов ----------

function collectThemeMaps(rules) {
  const dark = new Map(), light = new Map(), auto = new Map();
  const darkAccents = new Map(), lightAccents = new Map(); // name → Map(prop→value)
  rules.forEach(function (r) {
    if (!isTokenBlockSelector(r.selector)) return;
    const sel = r.selector;
    const isLightMedia = /prefers-color-scheme:\s*light/.test(r.media);
    let target = null;
    let mAcc;
    if (sel === ':root' && !r.media) target = dark;
    else if (sel === ':root[data-theme="light"]' && !r.media) target = light;
    else if (sel === ':root[data-theme="auto"]' && isLightMedia) target = auto;
    else if ((mAcc = sel.match(/^:root\[data-accent="([a-z]+)"\]$/)) && !r.media) {
      if (!darkAccents.has(mAcc[1])) darkAccents.set(mAcc[1], new Map());
      target = darkAccents.get(mAcc[1]);
    } else if ((mAcc = sel.match(/^:root\[data-theme="light"\]\[data-accent="([a-z]+)"\]$/)) && !r.media) {
      if (!lightAccents.has(mAcc[1])) lightAccents.set(mAcc[1], new Map());
      target = lightAccents.get(mAcc[1]);
    }
    if (!target) return; // density-блоки и пр. — не темы
    parseDecls(r.body).forEach(function (d) {
      if (d.prop.slice(0, 2) === '--') target.set(d.prop, d.value);
    });
  });
  return { dark: dark, light: light, auto: auto, darkAccents: darkAccents, lightAccents: lightAccents };
}

// ---------- Цвета / контраст ----------

// Рекурсивная подстановка var(--x[, fallback]); null = нерезолвимо
function substVars(value, map, depthLeft) {
  let out = '', i = 0;
  const n = value.length;
  while (i < n) {
    const idx = value.indexOf('var(', i);
    if (idx === -1) { out += value.slice(i); break; }
    out += value.slice(i, idx);
    let d = 0, j = idx + 3;
    for (; j < n; j++) {
      if (value[j] === '(') d++;
      else if (value[j] === ')') { d--; if (!d) break; }
    }
    if (d !== 0) return null;
    const inner = value.slice(idx + 4, j);
    let dd = 0, cut = -1;
    for (let k = 0; k < inner.length; k++) {
      if (inner[k] === '(') dd++;
      else if (inner[k] === ')') dd--;
      else if (inner[k] === ',' && !dd) { cut = k; break; }
    }
    const name = (cut === -1 ? inner : inner.slice(0, cut)).trim();
    const fb = cut === -1 ? null : inner.slice(cut + 1).trim();
    let rep = null;
    if (map.has(name)) rep = map.get(name);
    else if (fb !== null) rep = fb;
    if (rep === null || depthLeft <= 0) return null;
    const sub = substVars(rep, map, depthLeft - 1);
    if (sub === null) return null;
    out += sub;
    i = j + 1;
  }
  return out;
}

// → [r,g,b,a] или null
function parseColor(str) {
  if (!str) return null;
  str = str.trim().toLowerCase();
  if (str === 'transparent') return [0, 0, 0, 0];
  if (str === 'white') return [255, 255, 255, 1];
  if (str === 'black') return [0, 0, 0, 1];
  let m = str.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    const h = m[1];
    if (h.length === 3 || h.length === 4) {
      const r = parseInt(h[0] + h[0], 16), g = parseInt(h[1] + h[1], 16), b = parseInt(h[2] + h[2], 16);
      const a = h.length === 4 ? parseInt(h[3] + h[3], 16) / 255 : 1;
      return [r, g, b, a];
    }
    if (h.length === 6 || h.length === 8) {
      const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
      const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return [r, g, b, a];
    }
    return null;
  }
  m = str.match(/^rgba?\(([^)]*)\)$/);
  if (m) {
    const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(function (p) { return parseFloat(p); });
    if (parts.length < 3 || parts.some(isNaN)) return null;
    return [parts[0], parts[1], parts[2], parts.length >= 4 ? parts[3] : 1];
  }
  return null; // hsl/gradient/calc — статически не считаем
}

// fg (с альфой) поверх непрозрачного bg → непрозрачный цвет
function flatten(fg, bg) {
  const a = fg[3];
  return [
    fg[0] * a + bg[0] * (1 - a),
    fg[1] * a + bg[1] * (1 - a),
    fg[2] * a + bg[2] * (1 - a),
    1
  ];
}

function luminance(c) {
  function f(v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
}

function contrast(c1, c2) {
  const l1 = luminance(c1), l2 = luminance(c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Токен → непрозрачный цвет с учётом var(); throw при нерезолвимости
function colorOf(map, token) {
  const raw = map.has(token) ? map.get(token) : token; // можно и литерал напрямую
  const substituted = substVars(raw, map, 20);
  if (substituted === null) throw new Error(token + ': не резолвится var()');
  const c = parseColor(substituted);
  if (c === null) throw new Error(token + ': не цвет (' + substituted.slice(0, 40) + ')');
  return c;
}

// ---------- Чек 1: синхрон light/auto ----------

function checkSync(maps, out) {
  const errors = [];
  maps.light.forEach(function (v, k) {
    if (SYNC_EXCEPTIONS[k]) return;
    if (!maps.auto.has(k)) errors.push(k + ': есть в light-блоке, НЕТ в auto-блоке');
    else if (maps.auto.get(k) !== v) errors.push(k + ': light=`' + v + '` != auto=`' + maps.auto.get(k) + '`');
  });
  maps.auto.forEach(function (v, k) {
    if (SYNC_EXCEPTIONS[k]) return;
    if (!maps.light.has(k)) errors.push(k + ': есть в auto-блоке, НЕТ в light-блоке');
  });
  out.result('синхрон light/auto', errors, maps.light.size + ' light-токенов ↔ ' + maps.auto.size + ' auto-токенов');
  return errors.length === 0;
}

// ---------- Чек 2: паритет dark↔light + акцент-пресеты ----------

const COLOR_LITERAL_RE = /#[0-9a-f]{3,8}\b|(?:rgba?|hsla?)\(/i;

function checkParity(maps, out) {
  const errors = [];
  maps.light.forEach(function (v, k) {
    if (PARITY_LIGHT_ONLY[k]) return;
    if (!maps.dark.has(k)) errors.push(k + ': есть в light, НЕТ в dark :root (в тёмной теме токен пуст)');
  });
  maps.dark.forEach(function (v, k) {
    if (PARITY_DARK_ONLY[k]) return;
    if (!COLOR_LITERAL_RE.test(v)) return; // не-цвет (радиусы/шрифты/алиасы var()) — тема-независим
    if (!maps.light.has(k)) errors.push(k + ': цветовой dark-токен НЕ переопределён в light (тёмный цвет протечёт в светлую)');
  });
  // Акцент-пресеты: у каждого тёмного — светлая пара с тем же набором свойств
  maps.darkAccents.forEach(function (dm, name) {
    const lm = maps.lightAccents.get(name);
    if (!lm) { errors.push('акцент "' + name + '": нет light-пресета :root[data-theme="light"][data-accent]'); return; }
    dm.forEach(function (_, prop) {
      if (!lm.has(prop)) errors.push('акцент "' + name + '": ' + prop + ' есть в dark-пресете, нет в light');
    });
    lm.forEach(function (_, prop) {
      if (!dm.has(prop)) errors.push('акцент "' + name + '": ' + prop + ' есть в light-пресете, нет в dark');
    });
  });
  maps.lightAccents.forEach(function (_, name) {
    if (!maps.darkAccents.has(name)) errors.push('акцент "' + name + '": light-пресет без dark-пары');
  });
  out.result('паритет dark↔light', errors,
    maps.dark.size + ' dark-токенов, ' + maps.light.size + ' light, акцентов ' + maps.darkAccents.size + '+default');
  return errors.length === 0;
}

// ---------- Чек 3: WCAG-контраст ----------

function themeResolvedMap(maps, theme, accentMap) {
  const m = new Map(maps.dark);
  if (theme === 'light') maps.light.forEach(function (v, k) { m.set(k, v); });
  if (accentMap) accentMap.forEach(function (v, k) { m.set(k, v); });
  return m;
}

function pairMin(pair, theme) {
  if (theme === 'light' && typeof pair.minLight === 'number') return pair.minLight;
  if (theme === 'dark' && typeof pair.minDark === 'number') return pair.minDark;
  return pair.min;
}

function checkContrast(maps, pairsCfg, out) {
  const errors = [], warnings = [];
  let checked = 0;

  function evalOne(map, fgToken, bgStack, label, min) {
    let ratio;
    try {
      let bg = colorOf(map, '--bg-0');
      bg = [bg[0], bg[1], bg[2], 1];
      (bgStack || []).forEach(function (tok) { bg = flatten(colorOf(map, tok), bg); });
      const fg = flatten(colorOf(map, fgToken), bg);
      ratio = contrast(fg, bg);
    } catch (e) {
      warnings.push(label + ': SKIP — ' + e.message);
      return;
    }
    checked++;
    if (ratio < min) {
      errors.push(label + ': ' + ratio.toFixed(2) + ' < ' + min);
    }
  }

  (pairsCfg.pairs || []).forEach(function (p) {
    const themes = p.themes || ['dark', 'light'];
    themes.forEach(function (theme) {
      const map = themeResolvedMap(maps, theme);
      const label = theme + ': ' + p.fg + ' на ' + (p.bg && p.bg.length ? p.bg.join('→') : '--bg-0');
      evalOne(map, p.fg, p.bg, label, pairMin(p, theme));
    });
  });

  if (pairsCfg.accents) {
    const cfg = pairsCfg.accents;
    const names = ['gold'].concat(Array.from(maps.darkAccents.keys()));
    names.forEach(function (name) {
      ['dark', 'light'].forEach(function (theme) {
        const accMap = name === 'gold' ? null
          : (theme === 'dark' ? maps.darkAccents.get(name) : maps.lightAccents.get(name));
        if (name !== 'gold' && !accMap) return; // отсутствие пары ловит чек 2
        const map = themeResolvedMap(maps, theme, accMap);
        let min = pairMin(cfg, theme);
        const ov = cfg.overrides && cfg.overrides[theme + ':' + name];
        if (typeof ov === 'number') min = ov;
        evalOne(map, cfg.fg, [cfg.bg], theme + '/' + name + ': ' + cfg.fg + ' на ' + cfg.bg, min);
      });
    });
  }

  out.result('WCAG-контраст', errors, checked + ' пар проверено' +
    (warnings.length ? ', ' + warnings.length + ' skip' : ''));
  warnings.forEach(function (w) { out.warn(w); });
  return errors.length === 0;
}

// ---------- Чек 4: ratchet хардкодов ----------

const COLOR_COUNT_RE = /#[0-9a-f]{3,8}\b|(?:rgba?|hsla?)\(/gi;

function stripUrls(body) {
  return body.replace(/url\(\s*(?:"[^"]*"|'[^']*'|[^)]*)\s*\)/gi, 'url()');
}

function countHardcodes(rules, lineOf) {
  let colors = 0, lightImportant = 0;
  const hits = []; // для --report: {line, selector, colors, important}
  rules.forEach(function (r) {
    const tokenBlock = isTokenBlockSelector(r.selector);
    const body = stripUrls(r.body);
    let c = 0;
    if (!tokenBlock) {
      const m = body.match(COLOR_COUNT_RE);
      c = m ? m.length : 0;
      colors += c;
    }
    let imp = 0;
    if (/\[data-theme=/.test(r.selector)) {
      const mi = body.match(/!important/g);
      imp = mi ? mi.length : 0;
      lightImportant += imp;
    }
    if (c || imp) hits.push({ line: lineOf(r.start), selector: r.selector, colors: c, important: imp });
  });
  return { colors: colors, lightImportant: lightImportant, hits: hits };
}

function checkRatchet(counts, baselinePath, out) {
  let base;
  try {
    base = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  } catch (e) {
    out.result('ratchet хардкодов', ['нет базы ' + path.basename(baselinePath) + ' — запустить node tools/check-theme.js --update-baseline'], '');
    return false;
  }
  const errors = [];
  if (counts.colors > base.hardcodedColors) {
    errors.push('цветовых литералов вне :root-блоков стало БОЛЬШЕ: ' + counts.colors + ' > база ' + base.hardcodedColors +
      ' (новые цвета — через var(--токен); если осознанно, --update-baseline)');
  }
  if (counts.lightImportant > base.lightImportant) {
    errors.push('!important в [data-theme=…]-правилах стало БОЛЬШЕ: ' + counts.lightImportant + ' > база ' + base.lightImportant);
  }
  const note = 'цветов ' + counts.colors + '/' + base.hardcodedColors +
    ', light-!important ' + counts.lightImportant + '/' + base.lightImportant;
  const canLower = counts.colors < base.hardcodedColors || counts.lightImportant < base.lightImportant;
  out.result('ratchet хардкодов', errors, note + (canLower && !errors.length ? ' — можно опустить базу (--update-baseline)' : ''));
  return errors.length === 0;
}

// ---------- --report: группировка хардкодов по секциям ----------

function collectSections(rawCss) {
  // Баннеры вида /* ===== Название ===== */ или /* ==========\n Название …
  const sections = [];
  const re = /\/\*[\s\S]*?\*\//g;
  let m, line = 1, prevEnd = 0;
  while ((m = re.exec(rawCss)) !== null) {
    for (let k = prevEnd; k < m.index; k++) if (rawCss[k] === '\n') line++;
    prevEnd = m.index;
    const text = m[0];
    if (!/^\/\*\s*={5,}|^\/\*\s*-{5,}|^\/\* =/.test(text) && text.indexOf('=====') === -1) continue;
    const name = text.split('\n').map(function (l) {
      return l.replace(/\/\*|\*\/|=|-/g, ' ').trim();
    }).filter(Boolean)[0];
    if (name) sections.push({ line: line, name: name });
  }
  return function sectionOf(ln) {
    let cur = '(до первой секции)';
    for (let k = 0; k < sections.length; k++) {
      if (sections[k].line <= ln) cur = sections[k].name; else break;
    }
    return cur;
  };
}

function printReport(counts, rawCss) {
  const sectionOf = collectSections(rawCss);
  const groups = new Map();
  counts.hits.forEach(function (h) {
    if (!h.colors && !h.important) return;
    const sec = sectionOf(h.line);
    if (!groups.has(sec)) groups.set(sec, { colors: 0, important: 0, rules: [] });
    const g = groups.get(sec);
    g.colors += h.colors;
    g.important += h.important;
    g.rules.push(h);
  });
  const sorted = Array.from(groups.entries()).sort(function (a, b) {
    return (b[1].colors + b[1].important) - (a[1].colors + a[1].important);
  });
  console.log('# Хардкоды по секциям style.css (рабочий список THEME-4/5)');
  console.log('# Всего: ' + counts.colors + ' цветовых литералов вне :root-блоков, ' +
    counts.lightImportant + ' !important в [data-theme=…]-правилах');
  console.log('');
  sorted.forEach(function (e) {
    console.log('## ' + e[0] + ' — цветов ' + e[1].colors + ', !important ' + e[1].important);
    e[1].rules.forEach(function (r) {
      const sel = r.selector.length > 90 ? r.selector.slice(0, 87) + '…' : r.selector;
      console.log('  :' + r.line + '  ' + sel +
        (r.colors ? '  [цветов ' + r.colors + ']' : '') +
        (r.important ? '  [!important ' + r.important + ']' : ''));
    });
    console.log('');
  });
}

// ---------- Запуск ----------

function makeOut(prefix, toStderr) {
  const log = toStderr ? console.error : console.log;
  return {
    lines: [],
    result: function (name, errors, note) {
      if (errors.length === 0) {
        log(prefix + ' OK  ' + name + (note ? ' — ' + note : ''));
      } else {
        log(prefix + ' FAIL ' + name + ' (' + errors.length + '):');
        errors.slice(0, 20).forEach(function (e) { log(prefix + '   - ' + e); });
        if (errors.length > 20) log(prefix + '   … и ещё ' + (errors.length - 20));
      }
    },
    warn: function (msg) { log(prefix + ' warn: ' + msg); }
  };
}

function runChecks(root, opts) {
  const out = makeOut('[theme]', !!opts.stderr);
  const rawCss = fs.readFileSync(path.join(root, 'style.css'), 'utf8').replace(/\r\n/g, '\n');
  const css = stripComments(rawCss);
  const lineOf = buildLineIndex(css);
  const rules = parseCss(css);
  const maps = collectThemeMaps(rules);

  if (maps.dark.size === 0 || maps.light.size === 0 || maps.auto.size === 0) {
    out.result('sanity', ['не найден один из токен-блоков: dark=' + maps.dark.size +
      ' light=' + maps.light.size + ' auto=' + maps.auto.size + ' (сломан парсер или селекторы?)'], '');
    return false;
  }

  const counts = countHardcodes(rules, lineOf);

  if (opts.report) {
    printReport(counts, rawCss);
    return true;
  }

  const baselinePath = path.join(root, 'tools', 'theme-baseline.json');
  if (opts.updateBaseline) {
    const json = {
      comment: 'Ratchet THEME-2: базовые счётчики хардкодов style.css. CI падает только при РОСТЕ. Обновлять при снижении: node tools/check-theme.js --update-baseline',
      hardcodedColors: counts.colors,
      lightImportant: counts.lightImportant
    };
    fs.writeFileSync(baselinePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log('[theme] база обновлена: цветов ' + counts.colors + ', light-!important ' + counts.lightImportant);
    return true;
  }

  let pairsCfg = { pairs: [] };
  const pairsPath = path.join(root, 'tools', 'theme-contrast-pairs.json');
  try {
    pairsCfg = JSON.parse(fs.readFileSync(pairsPath, 'utf8'));
  } catch (e) {
    out.warn('tools/theme-contrast-pairs.json не прочитан (' + e.message + ') — контраст пропущен');
  }

  const ok1 = checkSync(maps, out);
  const ok2 = checkParity(maps, out);
  const ok3 = checkContrast(maps, pairsCfg, out);
  const ok4 = checkRatchet(counts, baselinePath, out);
  return ok1 && ok2 && ok3 && ok4;
}

function readStdin() {
  return new Promise(function (resolve) {
    let buf = '';
    if (process.stdin.isTTY) return resolve('');
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (d) { buf += d; });
    process.stdin.on('end', function () { resolve(buf); });
    process.stdin.on('error', function () { resolve(buf); });
  });
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const flags = args.filter(function (a) { return a.slice(0, 2) === '--'; });
  const rest = args.filter(function (a) { return a.slice(0, 2) !== '--'; });
  const root = rest[0] ? path.resolve(rest[0]) : path.join(__dirname, '..');

  if (flags.indexOf('--hook') !== -1) {
    // PostToolUse: warn-only, НИКОГДА не блокирует (решение плана THEME — hook навсегда warn)
    readStdin().then(function (raw) {
      let fp = '';
      try { fp = JSON.parse(raw).tool_input.file_path || ''; } catch (e) {}
      const norm = String(fp).replace(/\\/g, '/');
      if (!/(^|\/)style\.css$|tools\/theme-(contrast-pairs|baseline)\.json$|tools\/check-theme\.js$/i.test(norm)) {
        process.exit(0);
      }
      let ok = false;
      try { ok = runChecks(root, { stderr: true }); }
      catch (e) { console.error('[theme] ERROR: ' + e.message); }
      if (!ok) console.error('[theme] WARN: чекер тем красный (warn-only; CI заблокирует push)');
      process.exit(0);
    });
  } else {
    let ok = false;
    try {
      ok = runChecks(root, {
        report: flags.indexOf('--report') !== -1,
        updateBaseline: flags.indexOf('--update-baseline') !== -1
      });
    } catch (e) {
      console.error('[theme] ERROR: ' + (e && e.stack || e));
    }
    process.exit(ok ? 0 : 1);
  }
}

module.exports = { parseCss: parseCss, collectThemeMaps: collectThemeMaps, substVars: substVars, parseColor: parseColor, flatten: flatten, contrast: contrast };
