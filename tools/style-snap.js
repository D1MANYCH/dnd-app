#!/usr/bin/env node
// Снимок вычисленных стилей по вкладкам × ширинам × темам (эталон для РД-Ф).
//   node tools/style-snap.js snap <out.json> [--query "rd=1"]
//   node tools/style-snap.js diff <a.json> <b.json> [--limit 40]
// Поднимает свой статический сервер и headless Chrome; Chrome убивается по PID.
'use strict';
var fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process'), http = require('http');

var ROOT = path.resolve(__dirname, '..');
var PORT = 3031, CDP_PORT = 9333;
var WIDTHS = [375, 1440];
var THEMES = ['dark', 'light'];
var TABS = ['sheet', 'stats', 'progress', 'spells', 'inventory', 'battle', 'notes', 'party', 'journal'];
var CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(function (p) { return fs.existsSync(p); })[0];

function arg(name, def) { var i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : def; }
function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function getJSON(url) {
  return new Promise(function (res, rej) {
    http.get(url, function (r) { var s = ''; r.on('data', function (d) { s += d; }); r.on('end', function () { try { res(JSON.parse(s)); } catch (e) { rej(e); } }); }).on('error', rej);
  });
}

// Выполняется в странице: ключ элемента — путь от ближайшего id по tag.class, без состояний
function collect() {
  var PROPS = ['display', 'position', 'color', 'background-color', 'background-image', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
    'letter-spacing', 'text-transform', 'text-align', 'padding', 'margin', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-radius',
    'box-shadow', 'outline', 'opacity', 'gap', 'grid-template-columns', 'flex-direction', 'justify-content', 'align-items', 'width', 'height', 'top', 'left', 'z-index', 'fill', 'stroke'];
  var SKIP = /^(active|rd-off|open|show|visible|is-[a-z-]+|drawer-item-active)$/;
  function seg(el) {
    var c = [].slice.call(el.classList).filter(function (x) { return !SKIP.test(x); }).sort().join('.');
    return el.tagName.toLowerCase() + (c ? '.' + c : '');
  }
  var out = {}, seen = {};
  var all = document.body.querySelectorAll('*');
  for (var i = 0; i < all.length; i++) {
    var el = all[i];
    if (el.closest('script,style,template,svg defs')) continue;
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    var cs = getComputedStyle(el);
    if (cs.visibility === 'hidden') continue;
    var parts = [], n = el;
    while (n && n !== document.body) {
      if (n.id && !/\d{6,}/.test(n.id)) { parts.unshift('#' + n.id); break; }
      parts.unshift(seg(n));
      n = n.parentElement;
    }
    var key = parts.join(' > ');
    seen[key] = (seen[key] || 0) + 1;
    if (seen[key] > 1) key += ' [' + seen[key] + ']';
    var v = {};
    for (var j = 0; j < PROPS.length; j++) {
      var p = PROPS[j], x = cs.getPropertyValue(p);
      if (p === 'width' || p === 'height') x = String(Math.round(p === 'width' ? r.width : r.height));
      if (p === 'opacity') x = String(Math.round(parseFloat(x) * 100) / 100);
      v[p] = x;
    }
    out[key] = v;
  }
  return out;
}

async function snap(outFile, query) {
  var MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.wasm': 'application/wasm' };
  var srv = http.createServer(function (q, r) {
    var p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (p.endsWith(path.sep)) p = path.join(p, 'index.html');
    fs.readFile(p, function (e, d) { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(d); });
  }).listen(PORT);
  var prof = fs.mkdtempSync(path.join(os.tmpdir(), 'style-snap-'));
  var chrome = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + prof, '--no-first-run',
    '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', 'about:blank'], { stdio: 'ignore' });
  try {
    var targets;
    for (var t = 0; t < 50; t++) { await sleep(200); try { targets = await getJSON('http://127.0.0.1:' + CDP_PORT + '/json/list'); break; } catch (e) {} }
    var page = targets.filter(function (x) { return x.type === 'page'; })[0];
    var ws = new WebSocket(page.webSocketDebuggerUrl), id = 0, pending = {};
    await new Promise(function (r) { ws.onopen = r; });
    ws.onmessage = function (m) { var d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } };
    function send(method, params) { return new Promise(function (r) { var i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method: method, params: params || {} })); }); }
    async function ev(expr) {
      var d = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (d.result && d.result.exceptionDetails) throw new Error(expr.slice(0, 60) + ': ' + JSON.stringify(d.result.exceptionDetails).slice(0, 300));
      return d.result && d.result.result && d.result.result.value;
    }
    await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Network.setBypassServiceWorker', { bypass: true }); await send('Page.enable'); await send('Runtime.enable');
    var base = 'http://127.0.0.1:' + PORT + '/' + (query ? '?' + query : '');
    async function go(url) { await send('Page.navigate', { url: url }); await sleep(2500); }
    await go(base);
    // Персонаж-эталон: волшебник по билду, все тосты и туры погашены
    await ev("['seen','sheet_seen','spells_seen','inventory_seen','battle_seen','notes_seen','party_seen','journal_seen','progress_seen'].forEach(function(k){localStorage.setItem('dnd_help_'+k,'1')});localStorage.setItem('dnd_help_level','known');(async function(){if(!characters.length){await applyBuild('wizard-evoker');}return characters.length})()");
    await sleep(1500);
    var result = {};
    for (var ti = 0; ti < THEMES.length; ti++) {
      await ev("localStorage.setItem('dnd_theme','" + THEMES[ti] + "')");
      for (var wi = 0; wi < WIDTHS.length; wi++) {
        var w = WIDTHS[wi];
        await send('Emulation.setDeviceMetricsOverride', { width: w, height: w < 768 ? 812 : 900, deviceScaleFactor: 1, mobile: w < 768 });
        await go(base);
        await ev("typeof homeContinue==='function'&&homeContinue();1"); await sleep(800);
        for (var k = 0; k < TABS.length; k++) {
          await ev("document.querySelectorAll('.modal.active,.modal-overlay.active').forEach(function(m){m.classList.remove('active')});switchTab('" + TABS[k] + "',null);window.scrollTo(0,0);1");
          await sleep(500);
          result[THEMES[ti] + '/' + w + '/' + TABS[k]] = await ev('(' + collect.toString() + ')()');
        }
      }
    }
    fs.writeFileSync(outFile, JSON.stringify(result));
    var n = 0; Object.keys(result).forEach(function (s) { n += Object.keys(result[s]).length; });
    console.log('снимок: ' + Object.keys(result).length + ' состояний, ' + n + ' элементов → ' + outFile);
    ws.close();
  } finally {
    try { process.kill(chrome.pid); } catch (e) {}
    srv.close();
  }
}

function diff(a, b, limit) {
  var A = JSON.parse(fs.readFileSync(a, 'utf8')), B = JSON.parse(fs.readFileSync(b, 'utf8'));
  var total = { gone: 0, added: 0, changed: 0 }, byProp = {}, lines = [];
  Object.keys(A).forEach(function (st) {
    var x = A[st], y = B[st] || {};
    Object.keys(x).forEach(function (k) {
      if (!y[k]) { total.gone++; lines.push(st + '  − ' + k); return; }
      Object.keys(x[k]).forEach(function (p) {
        if (x[k][p] !== y[k][p]) { total.changed++; byProp[p] = (byProp[p] || 0) + 1; lines.push(st + '  ~ ' + k + ' { ' + p + ': ' + x[k][p] + ' → ' + y[k][p] + ' }'); }
      });
    });
    Object.keys(y).forEach(function (k) { if (!x[k]) { total.added++; lines.push(st + '  + ' + k); } });
  });
  console.log('исчезло ' + total.gone + ', появилось ' + total.added + ', изменённых свойств ' + total.changed);
  console.log('по свойствам: ' + JSON.stringify(byProp));
  lines.slice(0, limit).forEach(function (l) { console.log(l); });
  if (lines.length > limit) console.log('… ещё ' + (lines.length - limit));
}

var cmd = process.argv[2];
if (cmd === 'snap') snap(process.argv[3], arg('--query', '')).catch(function (e) { console.error(e); process.exit(1); });
else if (cmd === 'diff') diff(process.argv[3], process.argv[4], +arg('--limit', 40));
else console.log('usage: snap <out> [--query rd=1] | diff <a> <b> [--limit N]');
