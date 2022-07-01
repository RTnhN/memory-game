self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('memory-store').then((cache) => cache.addAll([
      '/index.html',
      '/favicon.ico',
      '/icon-192.png',
      '/icon-512.png',
      '/static',
      '/static/css/main.2dca16bc.css',
      '/static/js/main.95c8d6ee.js',
      '/apple-touch-icon.png',
      '/manifest.json',
      '/safari-pinned-tab.svg'
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});