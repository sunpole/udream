const CACHE_NAME = 'udream-v3.2.0-m1';
const urlsToCache = [
  '/udream/',
  '/udream/index.html',
  '/udream/script.js',
  '/udream/src/search.js',
  '/udream/manifest.json',
  '/udream/favicon.svg',
  '/udream/icon-192.png',
  '/udream/icon-512.png',
  '/udream/apple-touch-icon.png',
  '/udream/data/divinity_code_ru.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});
