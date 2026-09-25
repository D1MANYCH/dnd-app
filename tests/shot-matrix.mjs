// UNI-0: матрица снимков для визуальной проверки дизайна.
// Dev-инструмент, как theme-audit-fixture.html: в index.html и sw.js не подключается.
// Состояние = фикстура с параметрами (+ вызов функций приложения внутри iframe) → PNG;
// длинные экраны режутся на тайлы высотой в окно (…__t1.png, …__t2.png).
//
//   node tests/shot-matrix.mjs --base http://localhost:3023 --out C:/tmp/shots
//        [--only <regex по id>] [--combos md,ml,dd] [--shard 1/4] [--list]
//
// combos: размер m 390×844 · d 1440×900 · t 820×1180, затем тема d тёмная · l светлая
// (светлая — с акцентом gold, как у нового пользователя).
// Фикстура делает localStorage.clear(), поэтому Chrome всегда со своим свежим профилем.

import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const argv = process.argv.slice(2);
const arg = (name, def) => {
  const i = argv.indexOf('--' + name);
  if (i < 0) return def;
  const v = argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
};
const BASE = String(arg('base', 'http://localhost:3017')).replace(/\/$/, '');
const OUT = String(arg('out', path.join(os.tmpdir(), 'dnd-shots')));
const ONLY = arg('only') ? new RegExp(arg('only')) : null;
const COMBOS = arg('combos') ? String(arg('combos')).split(',') : null;
const SHARD = String(arg('shard', '1/1')).split('/').map(Number);
const CHROME = String(arg('chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe'));
const SIZES = { m: [390, 844, true], d: [1440, 900, false], t: [820, 1180, true] };

const sleep = ms => new Promise(r => setTimeout(r, ms));

// eval — тело async-функции на странице фикстуры: w — окно приложения (iframe #f), sleep(ms).
const LONG = { long: true };
const E24 = `await w.applyBuild('wizard24-evoker'); await sleep(1500); w.showScreen('character'); await sleep(400);`;
const BLANK = `w.createNewCharacter(); await sleep(900); if (w.currentScreenName() !== 'character') w.showScreen('character'); await sleep(300);`;
const CAST = 'tab=battle&battle=3&castrepeat=1';
const st = (id, q, combos, extra) => Object.assign({ id, q, combos }, extra);
const form = (id, ev, extra) => Object.assign({ id, q: 'tab=sheet', combos: 'md ml dd', eval: ev }, extra);

const STATES = [
  // Вкладки листа
  st('tab-sheet', 'tab=sheet', 'md ml dd dl td', { long: true, maxTiles: 9 }),
  st('tab-spells', 'tab=spells', 'md ml dd dl td', LONG),
  st('tab-inventory', 'tab=inventory', 'md ml dd dl', LONG),
  st('tab-battle', 'tab=battle', 'md ml dd dl td', LONG),
  st('tab-notes', 'tab=notes', 'md ml dd', LONG),
  st('tab-party', 'tab=party', 'md ml dd', LONG),
  st('tab-journal', 'tab=journal', 'md ml dd', LONG),
  st('tab-progress', 'tab=progress', 'md ml dd', LONG),
  // Состояния вкладок
  st('sheet-hp0', 'tab=sheet&hp=0', 'md ml', { long: true, maxTiles: 3 }),
  st('sheet-abil', 'tab=sheet&abil=int,wis', 'md ml', { long: true, maxTiles: 3 }),
  st('battle-tracker', 'tab=battle&battle=3', 'md ml dd', LONG),
  st('battle-castrepeat', CAST, 'md ml', LONG),
  st('battle-castdebuff', 'tab=battle&modal=castdebuff', 'md ml'),
  st('battle-castdamage', 'tab=battle&modal=castdamage', 'md ml'),
  st('spells-cast', 'tab=spells&modal=cast', 'md ml'),
  st('spells-castvariant', 'tab=spells&modal=castvariant', 'md ml'),
  // Экраны-страницы
  st('screen-home', 'screen=home', 'md ml dd dl td'),
  st('screen-characters', 'screen=characters', 'md ml dd'),
  st('screen-settings', 'modal=settings', 'md ml dd', LONG),
  st('screen-levelup', 'modal=levelup', 'md ml dd', LONG),
  st('screen-rest', 'modal=rest', 'md ml dd', LONG),
  st('screen-rest-long', 'modal=rest&rest=long', 'md ml'),
  st('screen-magiccatalog', 'modal=magiccatalog', 'md ml dd'),
  st('screen-gearcatalog', 'modal=gearcatalog', 'md ml dd'),
  st('screen-hphistory', 'modal=hphistory', 'md ml dd'),
  st('screen-spellsearch', 'modal=spellsearch', 'md ml dd'),
  st('screen-itemref', 'modal=itemref', 'md ml dd', LONG),
  st('screen-data', 'modal=data', 'md ml dd'),
  st('screen-data-backup', 'modal=data&backup=1', 'md ml'),
  st('screen-help', 'modal=help', 'md ml dd', LONG),
  st('screen-help-2024', 'modal=help&helptab=edition2024', 'md ml', LONG),
  st('screen-builds', 'modal=builds', 'md ml dd', LONG),
  st('screen-buildguide', 'modal=buildguide', 'md ml dd', LONG),
  st('screen-buildplan', 'modal=buildplan', 'md ml dd', LONG),
  st('screen-about', 'modal=about', 'md ml dd'),
  st('screen-changelog', 'modal=about&ptab=changelog', 'md ml'),
  // Короткие формы — через их реальные открыватели
  form('form-dice', `w.openDiceModal();`),
  form('form-addspell', `w.switchTab('spells'); await sleep(300); w.openAddSpellForm();`),
  form('form-item', `w.switchTab('inventory'); await sleep(300); w.openItemModal('other');`),
  form('form-weapon', `w.switchTab('battle'); await sleep(300); w.openWeaponModal();`),
  form('form-avatar', `w.openAvatarModal();`),
  form('form-coinexchange', `w.switchTab('inventory'); await sleep(300); w.openCoinExchange();`),
  form('form-confirm', `w.showConfirmModal('Удалить заклинание?', '«Огненный шар» исчезнет из книги заклинаний.', function () {}, 'Удалить');`),
  form('form-addnpc', `w.switchTab('party'); await sleep(300); w.openAddNPCModal();`),
  form('form-addally', `w.switchTab('party'); await sleep(300); w.openAddAllyModal();`),
  form('form-addmonster', `w.switchTab('party'); await sleep(300); w.openAddMonsterModal();`),
  form('form-srdmonster', `w.switchTab('party'); await sleep(300); w.openSrdMonsterPicker(); await sleep(800);`),
  form('form-srdnpc', `w.switchTab('party'); await sleep(300); w.openSrdNpcPicker(); await sleep(800);`),
  form('form-addcompanion', `w.openAddCompanionModal();`),
  form('form-addjournal', `w.switchTab('journal'); await sleep(300); w.openAddJournalEntry();`),
  form('form-notesentry', `w.switchTab('notes'); await sleep(300); w.notesOpenEntryModal();`),
  form('form-asi', `w.openASIModal();`),
  form('form-classchoice', `let l = w.ccGetAllChoicesFor(w.getCurrentChar());
    if (!l.length) { await w.applyBuild('warlock24-fiend'); await sleep(1500); w.showScreen('character'); await sleep(400); l = w.ccGetAllChoicesFor(w.getCurrentChar()); }
    w.openClassChoiceModal(l[0].className, l[0].choice.id);`),
  form('form-concdetails', `w.openConcDetails();`, { q: CAST }),
  { id: 'form-welcome', raw: true, combos: 'md ml dd' },
  // Редакция 2024
  form('e24-sheet', E24, { long: true, maxTiles: 9 }),
  form('e24-spells', E24 + `w.switchTab('spells');`, LONG),
  form('e24-battle', E24 + `w.switchTab('battle');`, LONG),
  form('e24-levelup', E24 + `w.openLevelUpModal();`, LONG),
  form('e24-builds', E24 + `w.openBuildPicker();`, LONG),
  form('e24-settings', E24 + `w.openSettingsModal();`, LONG),
  // Пустой персонаж: мастер создания и пустые состояния
  form('blank-sheet', BLANK, { combos: 'md ml dd', long: true, maxTiles: 6 }),
  form('blank-spells', BLANK + `w.switchTab('spells');`, { combos: 'md ml' }),
  form('blank-inventory', BLANK + `w.switchTab('inventory');`, { combos: 'md ml' }),
  form('blank-notes', BLANK + `w.switchTab('notes');`, { combos: 'md ml' }),
  form('blank-party', BLANK + `w.switchTab('party');`, { combos: 'md ml' }),
  form('blank-journal', BLANK + `w.switchTab('journal');`, { combos: 'md ml' }),
  form('blank-battle', BLANK + `w.switchTab('battle');`, { combos: 'md ml' }),
  // Инфо-экраны и панели
  form('info-ability', `const el = w.document.querySelector('[onclick*="openAbilityInfo"]'); if (el) el.click(); else w.openAbilityInfo('str');`, LONG),
  form('info-feature', `w.switchTab('progress'); await sleep(500); const el = w.document.querySelector('[onclick*="openFeatureInfo"]'); if (!el) throw new Error('нет openFeatureInfo в разметке'); el.click();`, LONG),
  form('panel-drawer', `w.openDrawer();`, { combos: 'md ml' }),
  form('panel-quickroll', `w.diceHistory.unshift(w._quickRollRecord('Атака: Кинжал', 20, 5, { total: 19, mode: 'normal', natural: 14 }, 14, null, Date.now()));
    w.diceHistory.unshift(w._quickRollRecord('Урон: Огненный снаряд', 4, 1, { total: 4, mode: 'normal', natural: 3 }, 3, null, Date.now()));
    w.renderQuickRollStrip(); w.updateQuickRollStripVisibility();`),
  form('panel-effects', `w.toggleActiveEffectsPanel();`, { q: CAST }),
  form('panel-applog', `w.AppLog.togglePanel();`),
  form('panel-toast', `w.showToast('Лист заблокирован', 'info'); w.showToast('🔒 Лист заблокирован', 'warn'); w.showToast('Персонаж сохранён', 'success');`, { wait: 700 }),
];

const READY = `(() => { const f = document.getElementById('f'); const w = f && f.contentWindow;
  return !!(w && w.characters && w.characters.length && typeof w.showScreen === 'function'); })()`;
const KILL_GL = `(() => { window.requestAnimationFrame = () => 0;
  document.querySelectorAll('canvas').forEach(c => {
    try { const gl = c.getContext('webgl2') || c.getContext('webgl'); const x = gl && gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); } catch (e) {}
    c.style.display = 'none';
  }); return true; })()`;
// Что реально на экране в момент снимка — в лог: экран и открытые окна с top,height
// их коробки (окно за пределами вьюпорта видно по top без просмотра PNG).
const WHERE = `(() => { const f = document.getElementById('f'); const w = f && f.contentWindow;
  if (!w || !w.document) return '-';
  const scr = w.currentScreenName ? w.currentScreenName() : '?';
  const m = [...w.document.querySelectorAll('.modal.active, .confirm-modal-overlay.active, .notes-modal-overlay.active')]
    .map(e => { const r = (e.querySelector('.modal-content, .confirm-modal-box') || e).getBoundingClientRect();
      return e.id + '@' + Math.round(r.top) + ',' + Math.round(r.height); });
  return scr + (m.length ? ' ' + m.join(' ') : ''); })()`;
// Прокручиваемый контейнер: окно iframe или самый «длинный» блок с overflow auto/scroll.
const PICK = `(() => { const w = document.getElementById('f').contentWindow, d = w.document;
  let best = d.scrollingElement, extra = best.scrollHeight - best.clientHeight;
  d.querySelectorAll('body *').forEach(el => {
    if (el.clientHeight < 200) return;
    const oy = w.getComputedStyle(el).overflowY;
    if (oy !== 'auto' && oy !== 'scroll') return;
    const e = el.scrollHeight - el.clientHeight;
    if (e > extra + 40) { best = el; extra = e; }
  });
  w.__shotScroller = best; return { extra, ch: best.clientHeight }; })()`;

let ws, seq = 0;
const pending = new Map();
const waiters = [];

function send(method, params, timeout = 30000) {
  return new Promise((res, rej) => {
    const id = ++seq;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params: params || {} }));
    setTimeout(() => { if (pending.has(id)) { pending.delete(id); rej(new Error(method + ': таймаут')); } }, timeout);
  });
}
function once(method, timeout) {
  return new Promise((res, rej) => {
    const w = { method, res };
    waiters.push(w);
    setTimeout(() => { const i = waiters.indexOf(w); if (i >= 0) { waiters.splice(i, 1); rej(new Error(method + ': не дождались')); } }, timeout);
  });
}
async function evaluate(expr) {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) {
    const ex = r.exceptionDetails.exception;
    throw new Error(String((ex && ex.description) || r.exceptionDetails.text || 'ошибка eval').split('\n')[0]);
  }
  return r.result && r.result.value;
}
async function navigate(url) {
  const loaded = once('Page.loadEventFired', 30000);
  await send('Page.navigate', { url });
  await loaded;
}
async function capture(file) {
  const r = await send('Page.captureScreenshot', { format: 'png' }, 25000);
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
}

async function openFixture(s, theme) {
  const q = s.q + '&theme=' + theme + (theme === 'light' ? '&accent=gold' : '') + '&_=' + Date.now();
  await navigate(BASE + '/tests/theme-audit-fixture.html?' + q);
  const t0 = Date.now();
  for (;;) {
    let ok = false;
    try { ok = await evaluate(READY); } catch (e) {}
    if (ok) break;
    if (Date.now() - t0 > 20000) throw new Error('фикстура не поднялась');
    await sleep(300);
  }
  await sleep(3500); // фикстура сама выставляет экран, модалку и прокрутку
  if (s.eval) {
    await evaluate(`(async () => { const w = document.getElementById('f').contentWindow;
      const sleep = ms => new Promise(r => setTimeout(r, ms)); ${s.eval}; return true; })()`);
  }
  await sleep(s.wait || 2500); // каскад rise
}
// Первый запуск без фикстуры: чистый origin → приветствие.
async function openRaw(theme) {
  await send('Storage.clearDataForOrigin', { origin: BASE, storageTypes: 'all' });
  await navigate(BASE + '/index.html?_=' + Date.now());
  await evaluate(`localStorage.clear(); localStorage.setItem('dnd_theme', '${theme}');` +
    (theme === 'light' ? ` localStorage.setItem('dnd_accent', 'gold'); localStorage.setItem('dnd_auto_accent', '0');` : '') + ' true');
  await navigate(BASE + '/index.html?_=' + Date.now());
  await sleep(3500);
  await evaluate(KILL_GL);
  await sleep(400);
}
async function captureTiles(name, max) {
  const m = await evaluate(PICK);
  const step = Math.max(200, m.ch - 80);
  let n = 0;
  for (let y = step; y < m.extra + step && n < max - 1; y += step) {
    await evaluate(`(() => { document.getElementById('f').contentWindow.__shotScroller.scrollTop = ${Math.min(y, m.extra)}; return true; })()`);
    await sleep(450);
    n++;
    await capture(path.join(OUT, `${name}__t${n}.png`));
  }
  return n;
}

const jobs = [];
for (const s of STATES) {
  if (ONLY && !ONLY.test(s.id)) continue;
  for (const c of s.combos.split(' ')) if (!COMBOS || COMBOS.includes(c)) jobs.push([s, c]);
}
const mine = jobs.filter((_, i) => i % SHARD[1] === SHARD[0] - 1);
if (arg('list')) {
  mine.forEach(([s, c]) => console.log(s.id, c));
  console.log(mine.length + ' снимков');
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });
const logFile = fs.createWriteStream(path.join(OUT, `_log-${SHARD[0]}of${SHARD[1]}.txt`), { flags: 'a' });
const line = t => { console.log(t); logFile.write(t + '\n'); };

const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'shot-prof-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', '--mute-audio', '--remote-debugging-port=0', '--user-data-dir=' + prof, 'about:blank'],
  { stdio: 'ignore' });
const portFile = path.join(prof, 'DevToolsActivePort');
let port = '';
for (let i = 0; i < 150 && !port; i++) {
  await sleep(150);
  try { port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim(); } catch (e) {}
}
if (!port) { line('ERR Chrome не отдал порт отладки'); process.exit(1); }
const targets = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) p.rej(new Error(m.error.message)); else p.res(m.result);
  } else if (m.method) {
    for (let i = waiters.length - 1; i >= 0; i--) {
      if (waiters[i].method === m.method) { waiters[i].res(m.params); waiters.splice(i, 1); }
    }
  }
};
await send('Page.enable');
// Прогрев: в свежем профиле Service Worker ставится при первом заходе и перезагружает
// страницу при захвате клиентов — без прогрева первый снимок потока ловил главную.
await navigate(BASE + '/index.html?_=' + Date.now());
await sleep(5000);

for (const [s, c] of mine) {
  const [W, H, mobile] = SIZES[c[0]];
  const theme = c[1] === 'l' ? 'light' : 'dark';
  const name = `${s.id}__${W}x${H}__${theme}`;
  try {
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile });
    await send('Emulation.setTouchEmulationEnabled', mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
    if (s.raw) await openRaw(theme); else await openFixture(s, theme);
    const where = await evaluate(WHERE).catch(() => '?');
    await capture(path.join(OUT, name + '.png'));
    const tiles = s.long ? await captureTiles(name, s.maxTiles || 6) : 0;
    line(`ok  ${name}${tiles ? ' +' + tiles : ''} [${where}]`);
  } catch (e) {
    line(`ERR ${name} ${e.message}`);
  }
}

try { ws.close(); } catch (e) {}
try { execSync('taskkill /PID ' + chrome.pid + ' /T /F', { stdio: 'ignore' }); } catch (e) { chrome.kill(); }
await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {}
logFile.end();
