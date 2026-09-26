// ============================================================
// sw.js — Service Worker для офлайн-работы D&D Sheet
// ============================================================

const CACHE_NAME = 'dnd-sheet-v402';

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
  './app-combat.js',
  './app-conditions.js',
  './app-cast-effects.js',
  './app-proficiencies.js',
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
  './app-dice.js',
  './app-settings.js',
  './app-ui.js',
  './app-home.js',
  './app-asi.js',
  './app-progress.js',
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
      return Promise.all(FILES_TO_CACHE.map((u) =>
        fetch(new Request(u, { cache: 'reload' }))
          .then((resp) => {
            if (!resp || !resp.ok) throw new Error('[SW] не скачан ' + u);
            return cache.put(u, resp);
          })
          .catch((err) => { if (OPTIONAL_RE.test(u)) return null; throw err; })
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
        // AUD-2 (W3): index.html — только для навигации, не вместо JS/картинок
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
