#!/usr/bin/env node
// CLI: node tools/css-usage-report.js [root]
// OPT-6: отчёт по мёртвому CSS — ТОЛЬКО отчёт (docs/css-usage-report.md), БЕЗ автоправок.
//
// Логика:
//   1. Парс style.css (комментарии вырезаются с сохранением offset'ов; @media/@supports —
//      рекурсивно, @keyframes/@font-face — отдельно/пропуск).
//   2. Из каждого селектора извлекаются .классы и #id. Токены внутри функциональных
//      псевдоклассов (:not/:is/...) и атрибутных селекторов НЕ считаются обязательными:
//      их «мёртвость» не убивает селектор, но попадает в общую таблицу классов.
//   3. Использование ищется по index.html + всем корневым *.js. Классы часто строятся
//      конкатенацией строк ("app-toast-" + t), поэтому помимо точного совпадения ищутся
//      prefix-фрагменты ("app-toast-"), suffix-фрагменты ("-low") и числовые хвосты
//      ('tab' + i → tab2). Такие совпадения = «подозрительные», не мёртвые.
//   4. Вердикты: live (точное совпадение или непроверяемый селектор без классов/id),
//      suspect (только фрагмент — возможна конкатенация), dead (не найден нигде).
//      Правило «полностью мёртвое», если мертвы ВСЕ селекторы его списка.
//
// Отчёт детерминирован (без timestamp) — повторный запуск даёт идентичный файл.
// Sanity: заведомо живые селекторы обязаны быть live, иначе exit 1 (защита от регресса парсера).
'use strict';

const fs = require('fs');
const path = require('path');

// План OPT-6 предлагал в sanity ещё .card-v2, но он оказался реально мёртвым
// (0 вхождений в index.html/корневые js, включая конкатенации) — заменён на char-card.
const SANITY_LIVE = ['btn', 'field', 'bp-card', 'char-card'];

// ---------- CSS-парсер ----------

// Комментарии → пробелы той же длины (offset'ы и номера строк не съезжают)
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

// Возвращает { rules: [{selector,start,end}], keyframes: [{name,start,end}] }
function parseCss(css) {
  const rules = [];
  const keyframes = [];
  let i = 0;
  const n = css.length;

  // css[i] === quote. CSS bad-string: незакрытая кавычка обрывается переводом строки
  // (иначе апостроф в мусорном тексте — см. аномалии — съедает пол-файла)
  function skipString(quote) {
    i++;
    while (i < n && css[i] !== quote && css[i] !== '\n') {
      if (css[i] === '\\') i++;
      i++;
    }
    if (i < n) i++;
  }

  function skipBlock() { // css[i] === '{', выходит за парной '}'
    let depth = 0;
    while (i < n) {
      const c = css[i];
      if (c === '"' || c === "'") { skipString(c); continue; }
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) { i++; return; }
      }
      i++;
    }
  }

  function parseLevel() {
    while (i < n) {
      while (i < n && /\s/.test(css[i])) i++;
      if (i >= n) return;
      if (css[i] === '}') { i++; return; } // конец объемлющего @-блока

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
      if (css[i] === ';') { i++; continue; }     // @import/@charset/@layer a,b;
      if (css[i] === '}') continue;              // мусорная '}' — отдаст управление выше
      prelude = prelude.trim();

      if (prelude[0] === '@') {
        const atName = (prelude.match(/^@([a-zA-Z-]+)/) || [, ''])[1].toLowerCase();
        if (/^(media|supports|container|layer)$/.test(atName)) {
          i++; // внутрь блока — обычные правила
          parseLevel();
        } else if (/keyframes$/.test(atName)) {
          const name = prelude.replace(/^@[a-zA-Z-]+\s*/, '').trim();
          skipBlock();
          keyframes.push({ name: name, start: start, end: i });
        } else {
          skipBlock(); // @font-face, @page и пр. — селекторов нет
        }
      } else {
        skipBlock();
        rules.push({ selector: prelude.replace(/\s+/g, ' '), start: start, end: i });
      }
    }
  }

  parseLevel();
  return { rules: rules, keyframes: keyframes };
}

// Список селекторов через запятую (запятые внутри скобок :is(.a,.b) не разделяют)
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

// Извлечение токенов: { all: {classes,ids}, required: {classes,ids} }
function extractTokens(selector) {
  const noAttr = selector.replace(/\[[^\]]*\]/g, ' '); // [data-x="y"] — не классы
  function grab(s) {
    const classes = [], ids = [];
    const re = /([.#])(-?[A-Za-z_][A-Za-z0-9_-]*)/g;
    let m;
    while ((m = re.exec(s)) !== null) {
      (m[1] === '.' ? classes : ids).push(m[2]);
    }
    return { classes: classes, ids: ids };
  }
  // required: без аргументов функциональных псевдоклассов (:not(.x) не обязывает .x существовать)
  let req = noAttr;
  for (let pass = 0; pass < 10; pass++) {
    const next = req.replace(/:[a-zA-Z-]+\([^()]*\)/g, ' ');
    if (next === req) break;
    req = next;
  }
  return { all: grab(noAttr), required: grab(req) };
}

// ---------- Источники использования ----------

// Наборы токенов из index.html + корневых *.js:
//   exact  — целые токены [A-Za-z0-9_-]+
//   prefix — токены с висячим дефисом в конце ("app-toast-")
//   suffix — токены с дефисом в начале ("-low")
function collectSourceTokens(root) {
  const files = fs.readdirSync(root)
    .filter(function (f) { return /\.js$/.test(f); })
    .sort();
  files.unshift('index.html');

  const exact = new Set(), prefix = new Set(), suffix = new Set();
  files.forEach(function (f) {
    const text = fs.readFileSync(path.join(root, f), 'utf8');
    const re = /[A-Za-z0-9_-]+/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const t = m[0];
      exact.add(t);
      if (t.length >= 3 && t[t.length - 1] === '-') prefix.add(t);
      if (t.length >= 3 && t[0] === '-') suffix.add(t);
    }
  });
  return { files: files, exact: exact, prefix: prefix, suffix: suffix };
}

// Вердикт по одному имени класса/id: {verdict: 'live'|'suspect'|'dead', how}
function makeClassifier(tokens) {
  const cache = new Map();
  return function classify(name) {
    if (cache.has(name)) return cache.get(name);
    let res;
    if (tokens.exact.has(name)) {
      res = { verdict: 'live', how: 'точное совпадение' };
    } else {
      res = null;
      const parts = name.split('-');
      for (let k = parts.length - 1; k >= 1 && !res; k--) {
        const pre = parts.slice(0, k).join('-') + '-';
        if (pre.length >= 3 && tokens.prefix.has(pre)) {
          res = { verdict: 'suspect', how: 'prefix `' + pre + '`' };
        }
      }
      for (let k = 1; k < parts.length && !res; k++) {
        const suf = '-' + parts.slice(k).join('-');
        if (suf.length >= 3 && tokens.suffix.has(suf)) {
          res = { verdict: 'suspect', how: 'suffix `' + suf + '`' };
        }
      }
      if (!res) {
        const num = name.match(/^(.*?[A-Za-z_-])(\d+)$/); // 'tab' + i → tab2
        if (num && tokens.exact.has(num[1])) {
          res = { verdict: 'suspect', how: 'числовой хвост от `' + num[1] + '`' };
        }
      }
      if (!res) res = { verdict: 'dead', how: 'не найден' };
    }
    cache.set(name, res);
    return res;
  };
}

// ---------- Отчёт ----------

function mdEscape(s) {
  return s.replace(/\|/g, '\\|');
}

function buildReport(root) {
  const cssRaw = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const css = stripComments(cssRaw);
  const lineOf = buildLineIndex(css);
  const parsed = parseCss(css);
  const tokens = collectSourceTokens(root);
  const classify = makeClassifier(tokens);

  // census: имя → { kind, rules: Set<index>, lines: [], verdict, how }
  const census = new Map();
  function note(name, kind, ruleIdx, line) {
    const key = kind + name;
    let rec = census.get(key);
    if (!rec) {
      const c = classify(name);
      rec = { name: name, kind: kind, rules: new Set(), lines: [], verdict: c.verdict, how: c.how };
      census.set(key, rec);
    }
    if (!rec.rules.has(ruleIdx)) {
      rec.rules.add(ruleIdx);
      if (rec.lines.length < 5) rec.lines.push(line);
    }
  }

  let selTotal = 0, selLive = 0, selSuspect = 0, selDead = 0;
  const deadRules = [];     // полностью мёртвые
  const partialRules = [];  // часть селекторов мертва
  const anomalies = [];     // «селектор» содержит */ — хвост битого комментария

  parsed.rules.forEach(function (rule, idx) {
    const line = lineOf(rule.start);
    if (rule.selector.indexOf('*/') !== -1) {
      // Внутри /* … */ встретился */ в тексте — по спецификации комментарий закрылся
      // раньше, хвост стал мусорным CSS, браузер теряет следующее правило. В статистику
      // не включаем — чинить комментарий в style.css и перезапускать отчёт.
      anomalies.push({ line: line, selector: rule.selector });
      return;
    }
    const sels = splitSelectors(rule.selector);
    const deadSels = [], suspectSels = [];
    sels.forEach(function (sel) {
      selTotal++;
      const tk = extractTokens(sel);
      tk.all.classes.forEach(function (c) { note(c, '.', idx, line); });
      tk.all.ids.forEach(function (c) { note(c, '#', idx, line); });
      const reqNames = tk.required.classes.concat(tk.required.ids);
      let verdict = 'live'; // селектор без классов/id (body, :root, *) непроверяем → live
      for (let k = 0; k < reqNames.length; k++) {
        const v = classify(reqNames[k]).verdict;
        if (v === 'dead') { verdict = 'dead'; break; }
        if (v === 'suspect') verdict = 'suspect';
      }
      if (verdict === 'dead') { selDead++; deadSels.push(sel); }
      else if (verdict === 'suspect') { selSuspect++; suspectSels.push(sel); }
      else selLive++;
    });
    if (deadSels.length === sels.length && sels.length > 0) {
      deadRules.push({ line: line, endLine: lineOf(rule.end - 1), selector: rule.selector, bytes: rule.end - rule.start });
    } else if (deadSels.length > 0) {
      partialRules.push({ line: line, selector: rule.selector, dead: deadSels });
    }
  });

  // @keyframes: имя используется, если встречается как токен в style.css чаще 1 раза
  // (своё объявление) либо в html/js (style.animation из кода)
  const deadKeyframes = [];
  parsed.keyframes.forEach(function (kf) {
    const re = new RegExp('(^|[^\\w-])' + kf.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^\\w-])', 'g');
    let cssHits = 0, m;
    while ((m = re.exec(css)) !== null) cssHits++;
    if (cssHits <= 1 && !tokens.exact.has(kf.name)) {
      deadKeyframes.push({ name: kf.name, line: lineOf(kf.start), bytes: kf.end - kf.start });
    }
  });

  // Сводные счётчики по классам/id
  const all = Array.from(census.values());
  function pick(kind, verdict) {
    return all.filter(function (r) { return r.kind === kind && r.verdict === verdict; })
      .sort(function (a, b) { return a.name < b.name ? -1 : 1; });
  }
  const stats = {
    classes: { total: all.filter(function (r) { return r.kind === '.'; }).length, dead: pick('.', 'dead'), suspect: pick('.', 'suspect') },
    ids: { total: all.filter(function (r) { return r.kind === '#'; }).length, dead: pick('#', 'dead'), suspect: pick('#', 'suspect') }
  };

  // Sanity: заведомо живые классы обязаны быть live
  const sanityFails = SANITY_LIVE.filter(function (name) {
    return classify(name).verdict !== 'live';
  });

  const deadBytes = deadRules.reduce(function (s, r) { return s + r.bytes; }, 0);

  // ---------- Markdown ----------
  const L = [];
  L.push('# Отчёт по использованию CSS (OPT-6)');
  L.push('');
  L.push('Генератор: `node tools/css-usage-report.js`. Только диагностика — правки вручную в OPT-7.');
  L.push('');
  L.push('Источник: `style.css` (' + cssRaw.length + ' байт, ' + lineOf(css.length - 1) + ' строк). ' +
    'Использование искалось по: ' + tokens.files.map(function (f) { return '`' + f + '`'; }).join(', ') + '.');
  L.push('');
  L.push('## Сводка');
  L.push('');
  L.push('| Метрика | Всего | Живых | Подозрительных | Мёртвых |');
  L.push('|---|---|---|---|---|');
  L.push('| Селекторы | ' + selTotal + ' | ' + selLive + ' | ' + selSuspect + ' | ' + selDead + ' |');
  L.push('| Классы | ' + stats.classes.total + ' | ' + (stats.classes.total - stats.classes.dead.length - stats.classes.suspect.length) + ' | ' + stats.classes.suspect.length + ' | ' + stats.classes.dead.length + ' |');
  L.push('| ID | ' + stats.ids.total + ' | ' + (stats.ids.total - stats.ids.dead.length - stats.ids.suspect.length) + ' | ' + stats.ids.suspect.length + ' | ' + stats.ids.dead.length + ' |');
  L.push('');
  L.push('Правил всего: ' + parsed.rules.length + ' · полностью мёртвых: ' + deadRules.length +
    ' (~' + deadBytes + ' байт) · частично мёртвых: ' + partialRules.length +
    ' · @keyframes без использования: ' + deadKeyframes.length + ' из ' + parsed.keyframes.length +
    ' · аномалий парсинга: ' + anomalies.length + '.');
  L.push('');
  L.push('Sanity (`' + SANITY_LIVE.join('`, `') + '`): ' +
    (sanityFails.length ? '**FAIL — ' + sanityFails.join(', ') + '**' : 'OK, все живые') + '.');
  L.push('');
  L.push('Терминология: **мёртвый** — имя не найдено ни целиком, ни фрагментом; ' +
    '**подозрительный** — найден только фрагмент (возможна сборка конкатенацией) — проверять вручную. ' +
    'Совпадение имени класса со словом в JS/changelog даёт ложно-живой — отчёт намеренно ошибается в сторону «живой».');

  function classTable(rows, withHow) {
    const out = [];
    out.push(withHow
      ? '| Имя | Правил | Строки style.css | Найдено как |'
      : '| Имя | Правил | Строки style.css |');
    out.push(withHow ? '|---|---|---|---|' : '|---|---|---|');
    rows.forEach(function (r) {
      const lines = r.lines.join(', ') + (r.rules.size > r.lines.length ? ', …' : '');
      out.push('| `' + r.kind + r.name + '` | ' + r.rules.size + ' | ' + lines +
        (withHow ? ' | ' + r.how + ' |' : ' |'));
    });
    return out;
  }

  L.push('');
  L.push('## Мёртвые классы (' + stats.classes.dead.length + ')');
  L.push('');
  if (stats.classes.dead.length) L.push.apply(L, classTable(stats.classes.dead, false));
  else L.push('Нет.');

  L.push('');
  L.push('## Мёртвые ID (' + stats.ids.dead.length + ')');
  L.push('');
  if (stats.ids.dead.length) L.push.apply(L, classTable(stats.ids.dead, false));
  else L.push('Нет.');

  L.push('');
  L.push('## Подозрительные (возможна конкатенация — проверять вручную) (' +
    (stats.classes.suspect.length + stats.ids.suspect.length) + ')');
  L.push('');
  if (stats.classes.suspect.length + stats.ids.suspect.length) {
    L.push.apply(L, classTable(stats.classes.suspect.concat(stats.ids.suspect), true));
  } else L.push('Нет.');

  L.push('');
  L.push('## Полностью мёртвые правила (' + deadRules.length + ', ~' + deadBytes + ' байт)');
  L.push('');
  L.push('Все селекторы правила мертвы — кандидаты на удаление целиком.');
  L.push('');
  if (deadRules.length) {
    L.push('| Строки | Байт | Селектор |');
    L.push('|---|---|---|');
    deadRules.forEach(function (r) {
      const sel = r.selector.length > 100 ? r.selector.slice(0, 97) + '…' : r.selector;
      L.push('| ' + r.line + '–' + r.endLine + ' | ' + r.bytes + ' | `' + mdEscape(sel) + '` |');
    });
  } else L.push('Нет.');

  L.push('');
  L.push('## Частично мёртвые правила (' + partialRules.length + ')');
  L.push('');
  L.push('Мёртвые селекторы можно убрать из списка, остальное правило живое.');
  L.push('');
  if (partialRules.length) {
    L.push('| Строка | Мёртвые селекторы | Полный список |');
    L.push('|---|---|---|');
    partialRules.forEach(function (r) {
      const sel = r.selector.length > 80 ? r.selector.slice(0, 77) + '…' : r.selector;
      L.push('| ' + r.line + ' | `' + mdEscape(r.dead.join(', ')) + '` | `' + mdEscape(sel) + '` |');
    });
  } else L.push('Нет.');

  L.push('');
  L.push('## Аномалии парсинга (' + anomalies.length + ')');
  L.push('');
  L.push('«Селектор» содержит `*/` — внутри комментария встретился текст `*/`, по спецификации ' +
    'CSS комментарий закрылся раньше времени. Хвост стал мусорным CSS, и браузер при ' +
    'error-recovery **теряет следующее реальное правило**. Чинить текст комментария в style.css ' +
    '(убрать `*/` из прозы) и перезапускать отчёт — классы внутри аномалий не учтены в статистике.');
  L.push('');
  if (anomalies.length) {
    L.push('| Строка | Фрагмент |');
    L.push('|---|---|');
    anomalies.forEach(function (a) {
      const sel = a.selector.length > 120 ? a.selector.slice(0, 117) + '…' : a.selector;
      L.push('| ' + a.line + ' | `' + mdEscape(sel) + '` |');
    });
  } else L.push('Нет.');

  L.push('');
  L.push('## Неиспользуемые @keyframes (' + deadKeyframes.length + ')');
  L.push('');
  if (deadKeyframes.length) {
    L.push('| Имя | Строка | Байт |');
    L.push('|---|---|---|');
    deadKeyframes.forEach(function (k) {
      L.push('| `' + k.name + '` | ' + k.line + ' | ' + k.bytes + ' |');
    });
  } else L.push('Нет.');
  L.push('');

  return {
    md: L.join('\n'),
    sanityFails: sanityFails,
    summary: 'селекторов ' + selTotal + ' (живых ' + selLive + ', подозрительных ' + selSuspect + ', мёртвых ' + selDead + ')' +
      ' · классов ' + stats.classes.total + ' (мёртвых ' + stats.classes.dead.length + ')' +
      ' · id ' + stats.ids.total + ' (мёртвых ' + stats.ids.dead.length + ')' +
      ' · полностью мёртвых правил ' + deadRules.length + ' (~' + (deadBytes / 1024).toFixed(1) + ' КБ)' +
      ' · keyframes без использования ' + deadKeyframes.length +
      (anomalies.length ? ' · АНОМАЛИЙ ' + anomalies.length + ' (битые комментарии — см. отчёт)' : '')
  };
}

if (require.main === module) {
  const root = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..');
  const res = buildReport(root);
  const outPath = path.join(root, 'docs', 'css-usage-report.md');
  fs.writeFileSync(outPath, res.md, 'utf8');
  if (res.sanityFails.length) {
    console.error('[css-report] FAIL sanity: заведомо живые классы попали не в live: ' + res.sanityFails.join(', '));
    console.error('[css-report] отчёт всё же записан: ' + outPath);
    process.exit(1);
  }
  console.log('[css-report] OK — ' + res.summary);
  console.log('[css-report] отчёт: ' + outPath);
}

module.exports = { buildReport };
