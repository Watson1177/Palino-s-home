self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open('v1').then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
