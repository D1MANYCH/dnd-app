#!/usr/bin/env node
// ТЕХ-1: verifyAllBuilds() в headless Chrome — для CI и локально.
//   node tools/verify-builds-ci.js
// Поднимает свой статический сервер и headless Chrome (как tools/style-snap.js), грузит index.html,
// подключает dev-verify-builds.js и печатает билды с падениями. Код выхода 1, если хоть один билд не прошёл.
// Chrome убивается по PID.
'use strict';
var fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process'), http = require('http');

var ROOT = path.resolve(__dirname, '..');
var PORT = 3032, CDP_PORT = 9334;
var CHROME = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(function (p) { return p && fs.existsSync(p); })[0];

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function getJSON(url) {
  return new Promise(function (res, rej) {
    http.get(url, function (r) { var s = ''; r.on('data', function (d) { s += d; }); r.on('end', function () { try { res(JSON.parse(s)); } catch (e) { rej(e); } }); }).on('error', rej);
  });
}

async function main() {
  if (!CHROME) throw new Error('Chrome не найден (задайте CHROME_PATH)');
  var MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.wasm': 'application/wasm' };
  var srv = http.createServer(function (q, r) {
    var p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (p.endsWith(path.sep)) p = path.join(p, 'index.html');
    fs.readFile(p, function (e, d) { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(d); });
  }).listen(PORT);
  var prof = fs.mkdtempSync(path.join(os.tmpdir(), 'vb-'));
  var chrome = cp.spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + prof, '--no-first-run',
    '--no-sandbox', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  try {
    var targets;
    for (var t = 0; t < 75; t++) { await sleep(200); try { targets = await getJSON('http://127.0.0.1:' + CDP_PORT + '/json/list'); break; } catch (e) {} }
    if (!targets) throw new Error('Chrome не ответил по CDP');
    var page = targets.filter(function (x) { return x.type === 'page'; })[0];
    var ws = new WebSocket(page.webSocketDebuggerUrl), id = 0, pending = {};
    await new Promise(function (r) { ws.onopen = r; });
    ws.onmessage = function (m) { var d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } };
    function send(method, params) { return new Promise(function (r) { var i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method: method, params: params || {} })); }); }
    async function ev(expr) {
      var d = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (d.result && d.result.exceptionDetails) throw new Error(expr.slice(0, 60) + ': ' + JSON.stringify(d.result.exceptionDetails).slice(0, 400));
      return d.result && d.result.result && d.result.result.value;
    }
    await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Network.setBypassServiceWorker', { bypass: true }); await send('Page.enable'); await send('Runtime.enable');
    await send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/' });
    for (var w = 0; w < 60; w++) { await sleep(250); if (await ev("typeof applyBuild==='function'&&typeof ensureBuilds==='function'")) break; }
    await ev("new Promise(function(ok,no){var s=document.createElement('script');s.src='dev-verify-builds.js';s.onload=function(){ok(1)};s.onerror=no;document.body.appendChild(s)})");
    var res = await ev("Promise.resolve(verifyAllBuilds()).then(function(r){return {summary:r.summary,failTable:r.failTable,errors:r.errors.map(function(e){return {id:e.buildId,error:String(e.error)}})}})");
    ws.close();
    var s = res.summary;
    console.log('билды: ' + s.fullPass + '/' + s.total + ' без падений; с падениями ' + s.withFailures + ', с ошибками ' + s.withErrors);
    res.failTable.forEach(function (f) { console.log('  ✗ ' + f.id + ' (' + f.score + '): ' + f.firstFails.join('; ')); });
    res.errors.forEach(function (e) { console.log('  ! ' + e.id + ': ' + e.error); });
    return s.total > 0 && s.fullPass === s.total ? 0 : 1;
  } finally {
    try { process.kill(chrome.pid); } catch (e) {}
    srv.close();
  }
}

main().then(function (code) { process.exit(code); }, function (e) { console.error(e); process.exit(1); });
