// ============================================================
// sw.js — Service Worker для офлайн-работы D&D Sheet
// ============================================================

const CACHE_NAME = 'dnd-sheet-v614';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app-log.js',
  './icons.js',
  './bg-space.js',
  './dice-arena-bg.js',
  './data.js',
  './data-2024.js',
  './build-notes-data.js',
  './character-builds.js',
  './glossary-data.js',
  './spells.js',
  './spell-effects.js',
  './rules.js',
  './app-migrate.js',
  './app-builds.js',
  './app-core.js',
  './app-io.js',
  './app-backup.js',
  './app-sync.js',
  './app-combat.js',
  './app-conditions.js',
  './app-cast-effects.js',
  './app-proficiencies.js',
  './app-hp.js',
  './app-wildshape.js',
  './app-spells.js',
  './start-equip-2014.js',
  './class-choices.js',
  './subclass-choices-data.js',
  './app-notes.js',
  './notes-gen-data.js',
  './assets/schools/abjuration.webp',
  './assets/schools/conjuration.webp',
  './assets/schools/divination.webp',
  './assets/schools/enchantment.webp',
  './assets/schools/evocation.webp',
  './assets/schools/illusion.webp',
  './assets/schools/necromancy.webp',
  './assets/schools/transmutation.webp',
  './assets/abilities/cha.webp',
  './assets/abilities/constitution.webp',
  './assets/abilities/dex.webp',
  './assets/abilities/int.webp',
  './assets/abilities/str.webp',
  './assets/abilities/wis.webp',
  './assets/avatar-fallback.webp',
  './assets/bg-body.webp',
  './assets/classes/barbarian.webp',
  './assets/classes/bard.webp',
  './assets/classes/cleric.webp',
  './assets/classes/druid.webp',
  './assets/classes/fighter.webp',
  './assets/classes/monk.webp',
  './assets/classes/paladin.webp',
  './assets/classes/ranger.webp',
  './assets/classes/rogue.webp',
  './assets/classes/sorcerer.webp',
  './assets/classes/warlock.webp',
  './assets/classes/wizard.webp',
  './assets/conditions/blinded.webp',
  './assets/conditions/charmed.webp',
  './assets/conditions/deafened.webp',
  './assets/conditions/exhaustion_1.webp',
  './assets/conditions/exhaustion_2.webp',
  './assets/conditions/exhaustion_3.webp',
  './assets/conditions/exhaustion_4.webp',
  './assets/conditions/exhaustion_5.webp',
  './assets/conditions/exhaustion_6.webp',
  './assets/conditions/frightened.webp',
  './assets/conditions/grappled.webp',
  './assets/conditions/incapacitated.webp',
  './assets/conditions/invisible.webp',
  './assets/conditions/paralyzed.webp',
  './assets/conditions/petrified.webp',
  './assets/conditions/poisoned.webp',
  './assets/conditions/prone.webp',
  './assets/conditions/restrained.webp',
  './assets/conditions/stunned.webp',
  './assets/conditions/unconscious.webp',
  './assets/d20-fab.webp',
  './assets/textures/dice-tray.jpg',
  './app-inventory.js',
  './magic-items.js',
  './gear-catalog.js',
  './app-party.js',
  './monsters-srd.js',
  './npc-srd.js',
  './beast-forms.js',
  './app-dice.js',
  './app-settings.js',
  './app-ui.js',
  './app-home.js',
  './app-asi.js',
  './app-creator.js',
  './app-progress.js',
  './app-desktop.js',
  './history-stack.js',
  './app-help.js',
  './app-sheet2.js',
  './app-pdf.js',
  './vendor/jspdf/jspdf.umd.min.js',
  './vendor/jspdf/roboto-base64.js',
  './vendor/fonts/eb-garamond-cyrillic-400-normal.woff2',
  './vendor/fonts/eb-garamond-cyrillic-600-normal.woff2',
  './vendor/fonts/eb-garamond-cyrillic-700-normal.woff2',
  './vendor/fonts/eb-garamond-latin-400-normal.woff2',
  './vendor/fonts/eb-garamond-latin-600-normal.woff2',
  './vendor/fonts/eb-garamond-latin-700-normal.woff2',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/icon-96.png',
  // DICE2-1: @3d-dice/dice-box vendor (ES-модуль + воркеры + ассеты)
  './vendor/dice-box/dice-box.es.js',
  './vendor/dice-box/world.offscreen.js',
  './vendor/dice-box/world.onscreen.js',
  './vendor/dice-box/world.none.js',
  './vendor/dice-box/Dice.js',
  './vendor/dice-box/assets/ammo/ammo.wasm.wasm',
  './vendor/dice-box/assets/themes/default/theme.config.json',
  './vendor/dice-box/assets/themes/default/default.json',
  './vendor/dice-box/assets/themes/default/diffuse-dark.png',
  './vendor/dice-box/assets/themes/default/diffuse-light.png',
  './vendor/dice-box/assets/themes/default/normal.png',
  './vendor/dice-box/assets/themes/default/specular.jpg',
  // AUD-2 (W5): выбираемые темы костей (по умолчанию steel)
  './vendor/dice-box/assets/themes/steel/default.json',
  './vendor/dice-box/assets/themes/steel/diffuse-dark.png',
  './vendor/dice-box/assets/themes/steel/diffuse-light.png',
  './vendor/dice-box/assets/themes/steel/normal.png',
  './vendor/dice-box/assets/themes/steel/specular.jpg',
  './vendor/dice-box/assets/themes/steel/theme.config.json',
  './vendor/dice-box/assets/themes/rock/diffuse-dark.png',
  './vendor/dice-box/assets/themes/rock/diffuse-light.png',
  './vendor/dice-box/assets/themes/rock/normal.png',
  './vendor/dice-box/assets/themes/rock/smoothDice.json',
  './vendor/dice-box/assets/themes/rock/specularity.jpg',
  './vendor/dice-box/assets/themes/rock/theme.config.json',
  './vendor/dice-box/assets/themes/wooden/diffuse.jpg',
  './vendor/dice-box/assets/themes/wooden/normal.png',
  './vendor/dice-box/assets/themes/wooden/smoothDice.json',
  './vendor/dice-box/assets/themes/wooden/specularity.jpg',
  './vendor/dice-box/assets/themes/wooden/theme.config.json',
  './vendor/dice-box/assets/themes/smooth/diffuse-dark.png',
  './vendor/dice-box/assets/themes/smooth/diffuse-light.png',
  './vendor/dice-box/assets/themes/smooth/normal.png',
  './vendor/dice-box/assets/themes/smooth/smoothDice.json',
  './vendor/dice-box/assets/themes/smooth/theme.config.json'
];

const OPTIONAL_RE = /^\.\/(assets|icons|vendor\/dice-box\/assets\/themes)\//;
const PRECACHE_PARALLEL = 6;
const PRECACHE_RETRY_MS = [1000, 3000];
const PRECACHE_IDLE_MS = 20000;

// Зависшее соединение не падает само: без таймаута установка стояла бы минутами.
// Счётчик простоя сбрасывается на каждом куске данных, поэтому медленная сеть
// не считается обрывом.
function storeWithRetry(cache, u, attempt) {
  const ctrl = new AbortController();
  let timer;
  function touch() {
    clearTimeout(timer);
    timer = setTimeout(() => ctrl.abort(), PRECACHE_IDLE_MS);
  }
  touch();
  return fetch(new Request(u, { cache: 'reload', signal: ctrl.signal }))
    .then((resp) => {
      if (!resp || !resp.ok) throw new Error('[SW] не скачан ' + u);
      touch();
      const reader = resp.clone().body.getReader();
      const watch = () => reader.read().then((part) => {
        if (part.done) return;
        touch();
        return watch();
      });
      return watch().then(() => cache.put(u, resp));
    })
    .then(() => clearTimeout(timer))
    .catch((err) => {
      clearTimeout(timer);
      if (attempt >= PRECACHE_RETRY_MS.length) throw err;
      return new Promise((resolve) => setTimeout(resolve, PRECACHE_RETRY_MS[attempt]))
        .then(() => storeWithRetry(cache, u, attempt + 1));
    });
}

// Докачка: имя кеша меняется с каждой версией, поэтому файл из прерванной
// установки той же версии брать можно. Сбой обязательного файла останавливает
// очередь, уже скачанное остаётся до следующей попытки.
function precacheAll(cache) {
  const total = FILES_TO_CACHE.length;
  const skipped = [];
  let next = 0, done = 0, percent = -1, failed = null;
  function report() {
    const p = Math.floor(done * 100 / total);
    if (p === percent) return;
    percent = p;
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      list.forEach((client) => client.postMessage({ type: 'PRECACHE_PROGRESS', percent: p }));
    });
  }
  function worker() {
    if (failed || next >= total) return Promise.resolve();
    const u = FILES_TO_CACHE[next++];
    return cache.match(u)
      .then((hit) => hit || storeWithRetry(cache, u, 0))
      .catch((err) => { if (OPTIONAL_RE.test(u)) skipped.push(u); else failed = err; })
      .then(() => { done++; report(); return worker(); });
  }
  const workers = [];
  for (let i = 0; i < PRECACHE_PARALLEL; i++) workers.push(worker());
  return Promise.all(workers).then(() => {
    if (failed) throw failed;
    // Необязательные файлы из обрыва связи — ещё одна попытка, когда очередь прошла
    return Promise.all(skipped.map((u) =>
      storeWithRetry(cache, u, PRECACHE_RETRY_MS.length).catch(() => null)));
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Кешируем файлы...');
      // {cache:'reload'} обходит HTTP-кеш браузера: при бампе CACHE_NAME
      // в кеш SW попадают РЕАЛЬНО свежие файлы. Иначе addAll берёт
      // устаревшие копии из disk-cache и клиент не получает новый код
      // после релиза. AUD-2 (W4): код обязателен — недокачанный файл срывает
      // установку, прежний SW и его полный кеш остаются. Картинки и темы
      // костей необязательны — их сбой установку не срывает.
      return precacheAll(cache);
    })
  );
  // НЕ вызываем skipWaiting() — ждём команды от пользователя через модалку
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          // AUD-2 (W7): только свои кеши — на origin живут и другие PWA
          if (key !== CACHE_NAME && key.indexOf('dnd-sheet-') === 0) {
            console.log('[SW] Удаляем старый кеш:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Получаем команду "Установить" от пользователя
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// SHARE-2: share_target из manifest — файл из «Поделиться» (Telegram и др.)
// кладём в отдельный кеш и открываем приложение с ?share=1; забирает app-io.js.
const SHARE_CACHE = 'dnd-share-inbox';
function receiveSharedFile(request) {
  return request.formData().then((form) => {
    const file = form.get('file');
    if (!file || typeof file.text !== 'function') return null;
    return file.text().then((text) => caches.open(SHARE_CACHE).then((cache) =>
      cache.put('./share-inbox', new Response(text, { headers: { 'Content-Type': 'application/json' } }))));
  }).catch(() => null).then(() => Response.redirect('./index.html?share=1', 303));
}

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;
  if (/^https:\/\/([a-z0-9-]+\.)*(googleapis\.com|google\.com)\//.test(url)) return;
  if (event.request.method === 'POST' && new URL(url).pathname.endsWith('/share-target')) {
    event.respondWith(receiveSharedFile(event.request));
    return;
  }

  event.respondWith(
    // ignoreSearch: запросы идут с ?v=vN-токенами (index.html), а ключи прекеша —
    // без query. Без этого версионные запросы мимо прекеша → офлайн-cold-start
    // отдавал бы index.html вместо JS/CSS. Свежесть обеспечивает бамп CACHE_NAME
    // (activate чистит старый кеш, install прекеширует свежие копии cache:'reload').
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      if (response) return response;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // AUD-2 (W3): index.html — только для навигации, не вместо JS/картинок
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
