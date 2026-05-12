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
  console.log('Notificacion en segundo plano:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/ajui-calendario/logo.png',
    badge: '/ajui-calendario/logo.png',
    vibrate: [200, 100, 200],
    data: payload.data
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://grupoajui.github.io/ajui-calendario/')
  );
});
