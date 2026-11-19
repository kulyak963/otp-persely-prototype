// Keeps the app working offline and shows push notifications.
const NAME = 'otp-demo-v36';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png', './splash-logo-green.png', './splash-light-1320x2868.png', './three.min.js'];

self.addEventListener('install', e => { e.waitUntil(caches.open(NAME).then(c => c.addAll(FILES)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== NAME).map(n => caches.delete(n)))).then(() => self.clients.claim())); });

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(NAME).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});

// A push arrived from the server: show it on the phone.
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'OTP demo', {
    body: d.body || '',
    icon: 'icon-180.png',
    badge: 'icon-180.png',
    tag: d.tag || undefined,
    data: { url: d.url || './' }
  }));
});

// The user tapped the notification: open the app on the right screen.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) {
      if ('focus' in c) { if ('navigate' in c) c.navigate(url).catch(() => {}); return c.focus(); }
    }
    return clients.openWindow(url);
  }));
});
