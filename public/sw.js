// AppealMate service worker — offline shell + fast loads.
// Bump CACHE when you change core assets.
const CACHE = 'appealmate-v3';
const CORE = ['/', '/index.html', '/styles.css', '/app.js', '/templates.js', '/chatbot.js', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Never cache the payment/function calls or cross-origin (Stripe, fonts, CDNs)
  if (url.pathname.startsWith('/.netlify/') || url.origin !== location.origin) return;
  // Cache-first for our own static assets, network fallback.
  e.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});
