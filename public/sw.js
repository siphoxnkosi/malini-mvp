const CACHE_NAME = 'malini-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app/app.js',
  '/app/router.js',
  '/app/state.js',
  '/app/mockApi.js',
  '/app/utils.js',
  '/app/views/login.js',
  '/app/views/dashboard.js',
  '/app/views/menu.js',
  '/app/views/modal.js',
  '/app/views/bill.js',
  '/app/views/payment.js',
  '/app/views/join.js',
  '/app/views/history.js',
  '/app/views/notFound.js',
  '/public/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/public/offline.html');
      })
    );
  } else if (STATIC_ASSETS.includes(new URL(event.request.url).pathname)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});