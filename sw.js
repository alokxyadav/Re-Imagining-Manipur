// Re-Imagining Manipur — service worker
// Caches the app shell so the guide still opens (read-only, last-seen data) without a connection.
// Bump CACHE_NAME on any deploy that changes cached files, so old caches get cleared.
const CACHE_NAME = 'rim-cache-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for same-origin navigations/files (so content updates show up when online),
// falling back to the cached copy when the network fails. Cross-origin requests (fonts, the
// QR library) are left to the browser's own HTTP cache — we don't intercept them here.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
  );
});
