var CACHE = "ajui-v4";
var URLS = ["/ajui-calendario/","/ajui-calendario/index.html","/ajui-calendario/manifest.json"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(URLS);}));
  self.skipWaiting();
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function(e){
  e.respondWith(fetch(e.request).catch(function(){return caches.match(e.request);}));
});

self.addEventListener("push", function(e) {
  console.log("[SW] Push recibido", e);
  
  var title = "AJUI";
  var body = "Tienes un nuevo aviso";
  var icon = "/ajui-calendario/icon-192.png";

  if (e.data) {
    try {
      var data = e.data.json();
      title = data.title || title;
      body = data.body || body;
      icon = data.icon || icon;
    } catch(err) {
      try {
        var text = e.data.text();
        if (text) body = text;
      } catch(e2) {}
    }
  }

  e.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      badge: "/ajui-calendario/icon-192.png",
      vibrate: [200, 100, 200],
      tag: "ajui-" + Date.now(),
      data: { url: "https://grupoajui.github.io/ajui-calendario/" }
    })
  );
});

self.addEventListener("notificationclick", function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow("https://grupoajui.github.io/ajui-calendario/"));
});
