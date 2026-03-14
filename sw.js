// sw.js — Service Worker для офлайн-работы D&D Sheet
// Версию меняй при каждом обновлении файлов — это сбрасывает кэш
const CACHE_NAME = 'dnd-sheet-v1';

// Все файлы которые нужны для работы офлайн
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './app.js',
  './manifest.json'
];

// Установка: кэшируем все файлы
self.addEventListener('install', function(event) {
  console.log('[SW] Установка...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Кэшируем файлы');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Активация: удаляем старые кэши
self.addEventListener('activate', function(event) {
  console.log('[SW] Активация...');
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== CACHE_NAME) {
            console.log('[SW] Удаляем старый кэш:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Запросы: сначала кэш, потом сеть (offline-first)
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response; // Отдаём из кэша
      }
      return fetch(event.request); // Иначе — из сети
    })
  );
});
