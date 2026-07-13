var CACHE = "ajui-v3";
var URLS = ["/ajui-calendario/","/ajui-calendario/index.html","/ajui-calendario/manifest.json","/ajui-calendario/icon-192.png","/ajui-calendario/icon-512.png"];

self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(URLS);}));
  self.skipWaiting();
});

self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});

self.addEventListener("fetch",function(e){
  e.respondWith(fetch(e.request).catch(function(){return caches.match(e.request);}));
});

// ═══ WEB PUSH NATIVO ═══
self.addEventListener("push",function(e){
  var data = {title:"AJUI",body:"Tienes un nuevo aviso"};
  try{
    var payload = e.data ? e.data.json() : {};
    data.title = payload.title || data.title;
    data.body = payload.body || data.body;
  }catch(err){
    try{ data.body = e.data ? e.data.text() : data.body; }catch(e2){}
  }
  e.waitUntil(
    self.registration.showNotification(data.title,{
      body: data.body,
      icon: "/ajui-calendario/icon-192.png",
      badge: "/ajui-calendario/icon-192.png",
      vibrate: [200,100,200],
      tag: "ajui-notif",
      renotify: true,
      data: {url:"https://grupoajui.github.io/ajui-calendario/"}
    })
  );
});

self.addEventListener("notificationclick",function(e){
  e.notification.close();
  e.waitUntil(clients.openWindow("https://grupoajui.github.io/ajui-calendario/"));
});
