// Firebase Cloud Messaging service worker — receives background push
// messages and displays the system notification. Foreground messages go to
// onMessage() in the client; this SW handles app-closed / tab-hidden case.
//
// Loaded explicitly with scope /firebase-cloud-messaging-push-scope to avoid
// colliding with the next-pwa service worker at /sw.js (scope /).
//
// Firebase config keys here are public (NEXT_PUBLIC_*); the SW file is
// static so we can't read env vars at request time. If the practice ever
// migrates to a different Firebase project, update these values + redeploy.

importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA4JOIinSOyH8vacQD1pxLckbR5hgFxqA4",
  authDomain: "heart-house-patient-app.firebaseapp.com",
  projectId: "heart-house-patient-app",
  storageBucket: "heart-house-patient-app.firebasestorage.app",
  messagingSenderId: "587602938671",
  appId: "1:587602938671:web:2b9d37458a352db369efda"
});

const messaging = firebase.messaging();

// Customize background notification rendering. FCM data-only messages land
// here too; if you want a notification, include `notification` in the
// payload from the server.
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Heart House";
  const options = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/icon-192.png",
    badge: "/icon-192.png",
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
