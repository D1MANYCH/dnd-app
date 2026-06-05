/* ============================================================================
   app-log.js — FEAT-LOG: система логирования действий и их последствий.
   Кольцевой буфер + корреляционные ID для async-цепочек + авто-перехват
   (клики/console/ошибки) + persist последней сессии в localStorage + панель
   просмотра с экспортом. Vanilla, без зависимостей. Грузится ПЕРВЫМ, чтобы
   перехватить всё с самого старта.

   Публичный API (window.AppLog):
     AppLog.action(cat, msg, data?, id?)   — действие пользователя/системы
     AppLog.info / warn / error / debug(cat, msg, data?, id?)
     AppLog.newId(prefix?)                 — корреляц. ID для цепочки (напр. бросок)
     AppLog.entries()                      — копия буфера
     AppLog.exportText()                   — текст для копирования/выгрузки
     AppLog.openPanel() / closePanel()     — встроенная панель
     AppLog.clear()                        — очистить
   ========================================================================== */
(function () {
  'use strict';

  var MAX = 600;                 // размер кольцевого буфера в памяти
  var LS_KEY = 'dnd_app_log';    // ключ persist последней сессии
  var LS_MAX = 300;              // сколько хвостовых записей сохранять
  var RENDER_MAX = 400;          // сколько строк показывать в панели

  var sessionStart = Date.now();
  var seq = 0;
  var buffer = [];
  var listeners = [];
  var enabled = true;
  var idCounter = 0;

  function now() { return Date.now() - sessionStart; }

  function fmtTime(ms) {
    var totalS = Math.floor(ms / 1000);
    var m = Math.floor(totalS / 60);
    var s = totalS % 60;
    var msr = ms % 1000;
    var pad = msr < 10 ? '00' + msr : (msr < 100 ? '0' + msr : '' + msr);
    return (m > 0 ? m + ':' + (s < 10 ? '0' + s : s) : s) + '.' + pad + 's';
  }

  // Безопасная сериализация данных: обрезаем длинные строки, ссылки на DOM,
  // циклические структуры — чтобы лог не падал и не раздувался.
  function safeData(d) {
    if (d === undefined || d === null) return d;
    try {
      var seen = [];
      return JSON.parse(JSON.stringify(d, function (k, v) {
        if (typeof v === 'string' && v.length > 240) return v.slice(0, 240) + '…';
        if (typeof v === 'function') return '[fn]';
        if (v && typeof v === 'object') {
          if (typeof Element !== 'undefined' && v instanceof Element) {
            return '<' + v.tagName.toLowerCase() + (v.id ? '#' + v.id : '') + '>';
          }
          if (seen.indexOf(v) !== -1) return '[circular]';
          seen.push(v);
        }
        return v;
      }));
    } catch (e) {
      try { return String(d); } catch (_) { return '[unserializable]'; }
    }
  }

  function push(level, category, message, data, corrId) {
    if (!enabled) return null;
    var entry = {
      seq: ++seq,
      t: now(),
      level: level || 'info',
      cat: category || 'app',
      msg: (message === undefined ? '' : String(message)),
      data: safeData(data),
      id: corrId || null
    };
    buffer.push(entry);
    if (buffer.length > MAX) buffer.shift();
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](entry); } catch (e) {}
    }
    schedulePersist();
    return entry;
  }

  // ── persist в localStorage (debounced) ──
  var persistTimer = null;
  function schedulePersist() {
    if (persistTimer) return;
    persistTimer = setTimeout(function () {
      persistTimer = null;
      try {
        var payload = {
          savedAt: Date.now(),
          sessionStart: sessionStart,
          version: (typeof window !== 'undefined' && window.APP_VERSION) || '?',
          entries: buffer.slice(-LS_MAX)
        };
        localStorage.setItem(LS_KEY, JSON.stringify(payload));
      } catch (e) { /* quota/private mode — тихо игнорируем */ }
    }, 800);
  }

  function loadPrevious() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function newId(prefix) {
    idCounter += 1;
    return (prefix || 'op') + '-' + idCounter.toString(36);
  }

  // ── форматирование одной записи в текст ──
  function lineToText(e) {
    return '#' + e.seq + ' [' + fmtTime(e.t) + '] ' + e.level.toUpperCase() + ' ' + e.cat +
      (e.id ? ' {' + e.id + '}' : '') + ' — ' + e.msg +
      (e.data !== undefined && e.data !== null ? '  ' + jsonShort(e.data) : '');
  }
  function jsonShort(d) {
    try { return JSON.stringify(d); } catch (e) { return String(d); }
  }

  function exportText() {
    var header = '=== DnD App Log ===\n' +
      'version: v' + ((typeof window !== 'undefined' && window.APP_VERSION) || '?') + '\n' +
      'session: ' + new Date(sessionStart).toLocaleString() + '\n' +
      'entries: ' + buffer.length + '\n' +
      'url: ' + (typeof location !== 'undefined' ? location.href : '?') + '\n' +
      'ua: ' + (typeof navigator !== 'undefined' ? navigator.userAgent : '?') + '\n' +
      '====================\n';
    return header + buffer.map(lineToText).join('\n');
  }

  var AppLog = {
    action: function (cat, msg, data, id) { return push('action', cat, msg, data, id); },
    info:   function (cat, msg, data, id) { return push('info',   cat, msg, data, id); },
    warn:   function (cat, msg, data, id) { return push('warn',   cat, msg, data, id); },
    error:  function (cat, msg, data, id) { return push('error',  cat, msg, data, id); },
    debug:  function (cat, msg, data, id) { return push('debug',  cat, msg, data, id); },
    newId: newId,
    entries: function () { return buffer.slice(); },
    subscribe: function (fn) {
      listeners.push(fn);
      return function () { var i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); };
    },
    clear: function () {
      buffer.length = 0; seq = 0;
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
      for (var i = 0; i < listeners.length; i++) { try { listeners[i](null); } catch (e) {} }
      push('info', 'log', 'журнал очищен');
    },
    setEnabled: function (v) { enabled = !!v; },
    isEnabled: function () { return enabled; },
    fmtTime: fmtTime,
    lineToText: lineToText,
    exportText: exportText,
    loadPrevious: loadPrevious,
    openPanel: openPanel,
    closePanel: closePanel,
    togglePanel: function () { var p = document.getElementById('app-log-panel'); if (p && p.classList.contains('open')) closePanel(); else openPanel(); }
  };

  // ────────────────────────────────────────────────────────────────────────
  // АВТО-ПЕРЕХВАТ
  // ────────────────────────────────────────────────────────────────────────

  // console.* → лог (оригинал по-прежнему вызывается)
  try {
    ['log', 'info', 'warn', 'error', 'debug'].forEach(function (m) {
      var orig = (console && console[m]) ? console[m].bind(console) : function () {};
      console[m] = function () {
        try {
          var args = Array.prototype.slice.call(arguments);
          var msg = args.map(function (a) {
            if (typeof a === 'string') return a;
            try { return JSON.stringify(a); } catch (e) { return String(a); }
          }).join(' ');
          push(m === 'log' ? 'info' : (m === 'debug' ? 'debug' : m), 'console', msg);
        } catch (e) {}
        return orig.apply(console, arguments);
      };
    });
  } catch (e) {}

  // глобальные ошибки
  try {
    window.addEventListener('error', function (e) {
      push('error', 'window', (e.message || 'error') + ' @ ' +
        (e.filename ? e.filename.split('/').pop() : '?') + ':' + (e.lineno || '?'));
    });
    window.addEventListener('unhandledrejection', function (e) {
      var r = e.reason;
      push('error', 'promise', 'unhandledrejection: ' + ((r && r.message) || jsonShort(r)));
    });
  } catch (e) {}

  // клики по интерактивным элементам (capture-фаза — ДО обработчика,
  // чтобы дальше в логе шли последствия именно этого клика)
  try {
    document.addEventListener('click', function (e) {
      try {
        var el = e.target && e.target.closest &&
          e.target.closest('button, a, [onclick], .tab-btn, .drawer-item, [role="button"], input[type="checkbox"]');
        if (!el) return;
        var label = (el.getAttribute('aria-label') || el.textContent || el.value || el.id ||
          el.className || el.tagName || '').toString().trim().replace(/\s+/g, ' ').slice(0, 48);
        var oc = el.getAttribute && el.getAttribute('onclick');
        push('action', 'ui:click', label || el.tagName, oc ? { do: oc.slice(0, 90) } : undefined);
      } catch (err) {}
    }, true);
  } catch (e) {}

  // ────────────────────────────────────────────────────────────────────────
  // ПАНЕЛЬ ПРОСМОТРА
  // ────────────────────────────────────────────────────────────────────────
  var LEVEL_CLASS = { action: 'al-action', info: 'al-info', warn: 'al-warn', error: 'al-error', debug: 'al-debug' };
  var panelUnsub = null;
  var activeFilter = '';   // подстрока/категория фильтра
  var activeLevel = '';    // уровень фильтра ('' = все)

  function matchFilter(e) {
    if (activeLevel && e.level !== activeLevel) return false;
    if (!activeFilter) return true;
    var q = activeFilter.toLowerCase();
    return (e.cat && e.cat.toLowerCase().indexOf(q) !== -1) ||
           (e.msg && e.msg.toLowerCase().indexOf(q) !== -1) ||
           (e.id && e.id.toLowerCase().indexOf(q) !== -1);
  }

  function rowHtml(e) {
    var cls = LEVEL_CLASS[e.level] || 'al-info';
    var dataStr = (e.data !== undefined && e.data !== null) ? jsonShort(e.data) : '';
    return '<div class="al-row ' + cls + '">' +
      '<span class="al-seq">#' + e.seq + '</span>' +
      '<span class="al-time">' + fmtTime(e.t) + '</span>' +
      '<span class="al-cat">' + esc(e.cat) + '</span>' +
      (e.id ? '<span class="al-id">' + esc(e.id) + '</span>' : '') +
      '<span class="al-msg">' + esc(e.msg) + (dataStr ? ' <span class="al-data">' + esc(dataStr) + '</span>' : '') + '</span>' +
      '</div>';
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderAll() {
    var list = document.getElementById('app-log-list');
    if (!list) return;
    var rows = buffer.filter(matchFilter);
    if (rows.length > RENDER_MAX) rows = rows.slice(-RENDER_MAX);
    list.innerHTML = rows.map(rowHtml).join('') ||
      '<div class="al-empty">Нет записей под фильтр</div>';
    list.scrollTop = list.scrollHeight;
    var cnt = document.getElementById('app-log-count');
    if (cnt) cnt.textContent = buffer.length + (activeFilter || activeLevel ? ' (показано ' + rows.length + ')' : '');
  }

  function onNewEntry(entry) {
    var list = document.getElementById('app-log-list');
    if (!list) return;
    if (entry === null) { renderAll(); return; } // clear
    if (!matchFilter(entry)) return;
    var atBottom = (list.scrollHeight - list.scrollTop - list.clientHeight) < 40;
    var empty = list.querySelector('.al-empty');
    if (empty) list.innerHTML = '';
    list.insertAdjacentHTML('beforeend', rowHtml(entry));
    while (list.children.length > RENDER_MAX) list.removeChild(list.firstChild);
    if (atBottom) list.scrollTop = list.scrollHeight;
    var cnt = document.getElementById('app-log-count');
    if (cnt) cnt.textContent = buffer.length + (activeFilter || activeLevel ? ' (фильтр)' : '');
  }

  function openPanel() {
    var p = document.getElementById('app-log-panel');
    if (!p) return;
    p.classList.add('open');
    p.removeAttribute('hidden');
    renderAll();
    if (!panelUnsub) panelUnsub = AppLog.subscribe(onNewEntry);
  }

  function closePanel() {
    var p = document.getElementById('app-log-panel');
    if (p) p.classList.remove('open');
    if (panelUnsub) { panelUnsub(); panelUnsub = null; }
  }

  function copyAll() {
    var txt = exportText();
    var done = function (ok) {
      var btn = document.getElementById('app-log-copy');
      if (btn) { var o = btn.textContent; btn.textContent = ok ? '✓ Скопировано' : '✗ Ошибка'; setTimeout(function () { btn.textContent = o; }, 1500); }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { done(true); }, function () { fallbackCopy(txt, done); });
    } else { fallbackCopy(txt, done); }
  }
  function fallbackCopy(txt, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta); done(ok);
    } catch (e) { done(false); }
  }

  function downloadAll() {
    try {
      var blob = new Blob([exportText()], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'dnd-app-log-' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + '.txt';
      document.body.appendChild(a); a.click();
      setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    } catch (e) {}
  }

  function showPrevious() {
    var prev = loadPrevious();
    var list = document.getElementById('app-log-list');
    if (!list) return;
    if (!prev || !prev.entries || !prev.entries.length) {
      list.innerHTML = '<div class="al-empty">Прошлой сессии в localStorage нет</div>';
      return;
    }
    var hdr = '<div class="al-row al-info"><span class="al-msg">↓ Прошлая сессия (' +
      new Date(prev.savedAt).toLocaleString() + ', v' + (prev.version || '?') + ', ' + prev.entries.length + ' записей)</span></div>';
    list.innerHTML = hdr + prev.entries.map(rowHtml).join('');
  }

  // навешиваем кнопки панели после готовности DOM
  function wirePanelButtons() {
    var map = [
      ['app-log-close', closePanel],
      ['app-log-copy', copyAll],
      ['app-log-download', downloadAll],
      ['app-log-clear', function () { AppLog.clear(); renderAll(); }],
      ['app-log-prev', showPrevious]
    ];
    map.forEach(function (pair) {
      var b = document.getElementById(pair[0]);
      if (b && !b._alWired) { b._alWired = true; b.addEventListener('click', pair[1]); }
    });
    var f = document.getElementById('app-log-filter');
    if (f && !f._alWired) { f._alWired = true; f.addEventListener('input', function () { activeFilter = f.value || ''; renderAll(); }); }
    var lv = document.getElementById('app-log-level');
    if (lv && !lv._alWired) { lv._alWired = true; lv.addEventListener('change', function () { activeLevel = lv.value || ''; renderAll(); }); }
  }

  // горячая клавиша Ctrl+Shift+L — открыть/закрыть журнал
  try {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l' || e.code === 'KeyL')) {
        e.preventDefault();
        AppLog.togglePanel();
      }
    });
  } catch (e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wirePanelButtons);
  } else {
    wirePanelButtons();
  }

  window.AppLog = AppLog;

  // стартовая запись + восстановление флага «была прошлая сессия»
  push('info', 'session', 'старт сессии', { url: (typeof location !== 'undefined' ? location.pathname : '?'), proto: (typeof location !== 'undefined' ? location.protocol : '?') });
})();
