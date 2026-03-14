// ============================================================
// sw.js — Service Worker для офлайн-работы D&D Sheet
// Кешируем все файлы при первой загрузке,
// после этого приложение работает без интернета
// ============================================================

const CACHE_NAME = 'dnd-sheet-v1';

// Все файлы, которые нужно закешировать
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './app.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

// Установка: кешируем все файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Кешируем файлы...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Активация: удаляем старые кеши
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

// Запросы: сначала кеш, потом сеть (офлайн-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Есть в кеше — отдаём
      }
      // Нет в кеше — пробуем сеть
      return fetch(event.request).then((networkResponse) => {
        // Кешируем новый ответ
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Сети нет и в кеше нет — возвращаем главную страницу
        return caches.match('./index.html');
      });
    })
  );
});
