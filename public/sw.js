// Service Worker for The Gift Gallery PWA
const CACHE_NAME = 'tgg-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/tgg_logo.png',
  '/tgg_logo.webp',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/assets/images/tgg_hero_curated_gifting_1790253103850.webp',
  '/assets/images/tgg_snack_chocolate_basket_1790253121230.webp',
  '/assets/images/tgg_jewelry_makeup_hamper_1790253148071.webp',
  '/assets/images/tgg_luxury_watch_perfume_box_1790253135569.webp',
  '/assets/images/tgg_personalized_gift_set_1790253160626.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip chrome-extension or external APIs
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version, but revalidate in background for html/js
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
