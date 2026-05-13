// AJUI Notifications - carga independiente, no bloquea la app
(function() {
  'use strict';

  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyCZekNrg93E09kTuVQnLQcBxsEQDLy3Ldc",
    authDomain: "ajui-calendario.firebaseapp.com",
    projectId: "ajui-calendario",
    storageBucket: "ajui-calendario.firebasestorage.app",
    messagingSenderId: "808553109781",
    appId: "1:808553109781:web:c3e7b65a8836964bdc711c"
  };

  var VAPID_KEY = "BIBLdxo-FnNO95qPv62XDk04f2SltItcgLVh5Nah3jYPIIp9p2e9T_br-68MXDbrp9vEr7-auupXEjuxrdtjuOg";
  var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBpoVUzkJI3ujx-2MPb3QhMSLGIQINHAkuH_KXWwPJIwEslrPY0Xq9L4eMY-xBkKGj/exec";

  function log(msg) { console.log('[AJUI Notif]', msg); }

  // Cargar Firebase SDK dinámicamente
  function cargarSDK(url, callback) {
    var script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    script.onerror = function() { log('Error cargando ' + url); };
    document.head.appendChild(script);
  }

  function iniciar() {
    log('Iniciando...');
    try {
      if (typeof firebase === 'undefined') { log('Firebase no disponible'); return; }
      
      // Evitar doble inicialización
      var app;
      try { app = firebase.app(); } 
      catch(e) { app = firebase.initializeApp(FIREBASE_CONFIG); }
      
      var messaging = firebase.messaging();
      log('Messaging OK');

      // Escuchar mensajes en primer plano
      messaging.onMessage(function(payload) {
        log('Mensaje recibido: ' + JSON.stringify(payload.notification));
        if (window.guardarNotificacion) {
          window.guardarNotificacion(
            payload.notification.title,
            payload.notification.body
          );
        }
        if (window.mostrarToast) {
          window.mostrarToast('🔔 ' + payload.notification.title);
        }
      });

      // Restaurar token si existe
      var tokenGuardado = localStorage.getItem('ajui_fcm_token');
      if (tokenGuardado) {
        window.fcmToken = tokenGuardado;
        log('Token restaurado');
        if (window.actualizarBadge) window.actualizarBadge();
      }

      // Exponer función para pedir permiso
      window.activarNotificacionesFirebase = function(nombre) {
        if (!nombre) { nombre = prompt('Tu nombre (Luis, Juan o Pedro):'); }
        if (!nombre || !nombre.trim()) return;
        nombre = nombre.trim();

        Notification.requestPermission().then(function(permission) {
          if (permission !== 'granted') {
            if (window.mostrarToast) window.mostrarToast('Permiso denegado');
            return;
          }
          navigator.serviceWorker.getRegistration('firebase-messaging-sw.js')
            .then(function(reg) {
              return messaging.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
            })
            .then(function(token) {
              window.fcmToken = token;
              localStorage.setItem('ajui_fcm_token', token);
              localStorage.setItem('ajui_fcm_nombre', nombre);
              // Guardar en Sheets
              fetch(SCRIPT_URL + '?accion=guardarToken&nombre=' + encodeURIComponent(nombre) + '&token=' + encodeURIComponent(token), { mode: 'no-cors' });
              if (window.mostrarToast) window.mostrarToast('Notificaciones activadas para ' + nombre);
              if (window.actualizarBadge) window.actualizarBadge();
              log('Token guardado para ' + nombre);
            })
            .catch(function(e) { 
              log('Error token: ' + e.message);
              if (window.mostrarToast) window.mostrarToast('Error: usa Chrome o Edge');
            });
        });
      };

      log('Listo');
    } catch(e) {
      log('Error: ' + e.message);
    }
  }

  // Registrar SW de Firebase y luego cargar SDKs
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('firebase-messaging-sw.js')
      .then(function(reg) {
        log('SW registrado');
        cargarSDK('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js', function() {
          cargarSDK('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js', iniciar);
        });
      })
      .catch(function(e) { log('SW error: ' + e.message); });
  }

})();
