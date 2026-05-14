// AJUI Service Worker - Network First (siempre carga version mas reciente)
var CACHE_NAME = 'ajui-v' + Date.now();

self.addEventListener('install', function(e) {
  self.skipWaiting();
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
  // Para el index.html y archivos JS/CSS: siempre red primero
  if(e.request.url.includes('index.html') || 
     e.request.url.includes('.js') || 
     e.request.url.includes('.css') ||
     e.request.url.includes('grupoajui.github.io')) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match(e.request);
      })
    );
  } else {
    e.respondWith(fetch(e.request));
  }
});
