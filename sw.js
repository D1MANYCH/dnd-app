// ============================================================
// sw.js — Service Worker для офлайн-работы D&D Sheet
// ============================================================

const CACHE_NAME = 'dnd-sheet-v270';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app-log.js',
  './bg-orbits.js',
  './dice-arena-bg.js',
  './data.js',
  './build-notes-data.js',
  './character-builds.js',
  './glossary-data.js',
  './spells.js',
  './app-core.js',
  './app-backup.js',
  './app-combat.js',
  './app-hp.js',
  './app-spells.js',
  './class-choices.js',
  './subclass-choices-data.js',
  './app-notes.js',
  './assets/schools/abjuration.webp',
  './assets/schools/conjuration.webp',
  './assets/schools/divination.webp',
  './assets/schools/enchantment.webp',
  './assets/schools/evocation.webp',
  './assets/schools/illusion.webp',
  './assets/schools/necromancy.webp',
  './assets/schools/transmutation.webp',
  './app-inventory.js',
  './magic-items.js',
  './gear-catalog.js',
  './app-party.js',
  './monsters-srd.js',
  './npc-srd.js',
  './app-ui.js',
  './app-desktop.js',
  './history-stack.js',
  './app-help.js',
  './app-pdf.js',
  './vendor/jspdf/jspdf.umd.min.js',
  './vendor/jspdf/roboto-base64.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
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
  './vendor/dice-box/assets/themes/default/specular.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Кешируем файлы...');
      // {cache:'reload'} обходит HTTP-кеш браузера: при бампе CACHE_NAME
      // в кеш SW попадают РЕАЛЬНО свежие файлы. Иначе addAll берёт
      // устаревшие копии из disk-cache и клиент не получает новый код
      // после релиза. Per-file .catch — один отсутствующий ассет не
      // должен срывать установку всего SW.
      return Promise.all(FILES_TO_CACHE.map((u) =>
        fetch(new Request(u, { cache: 'reload' }))
          .then((resp) => (resp && resp.ok) ? cache.put(u, resp) : null)
          .catch(() => null)
      ));
    })
  );
  // НЕ вызываем skipWaiting() — ждём команды от пользователя через модалку
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
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

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;

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
        return caches.match('./index.html');
      });
    })
  );
});
