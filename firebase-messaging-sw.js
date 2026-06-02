importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCZekNrg93E09kTuVQnLQcBxsEQDLy3Ldc",
  authDomain: "ajui-calendario.firebaseapp.com",
  projectId: "ajui-calendario",
  storageBucket: "ajui-calendario.firebasestorage.app",
  messagingSenderId: "808553109781",
  appId: "1:808553109781:web:c3e7b65a8836964bdc711c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification ? payload.notification.title : (payload.data ? payload.data.title : 'AJUI');
  const body = payload.notification ? payload.notification.body : (payload.data ? payload.data.body : '');
  
  return self.registration.showNotification(title, {
    body: body,
    icon: '/ajui-calendario/icon-192.png',
    badge: '/ajui-calendario/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'ajui-notif',
    renotify: true,
    data: { url: 'https://grupoajui.github.io/ajui-calendario/' }
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://grupoajui.github.io/ajui-calendario/')
  );
});
