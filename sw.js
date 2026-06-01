var CACHE_NAME = 'ajui-v3';
var URLS_TO_CACHE = [
  '/ajui-calendario/',
  '/ajui-calendario/index.html',
  '/ajui-calendario/logo.png',
  '/ajui-calendario/manifest.json'
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE).catch(function(){});
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
          .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Siempre red primero, cache como fallback
  e.respondWith(
    fetch(e.request).then(function(response) {
      // Cachear respuestas válidas
      if(response && response.status === 200 && response.type === 'basic') {
        var responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, responseClone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
