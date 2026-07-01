// AppealMate service worker — NETWORK-FIRST so code updates always reach users
// automatically. Online visitors get the freshest HTML/JS every load; the cache
// is only a fallback for offline. This removes the "bump the cache + tell users
// to hard-refresh" problem that a cache-first worker causes.
//
// How updates propagate with zero user action:
//  - Browsers re-check this sw.js on navigation, so a new deploy is picked up.
//  - skipWaiting() + clients.claim() make the new worker take control at once.
//  - Network-first fetch then serves the just-deployed assets immediately.
const CACHE = 'appealmate-v5';
const CORE = ['/', '/index.html', '/styles.css', '/app.js', '/templates.js', '/chatbot.js', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png'];
const NET_TIMEOUT = 4000; // ms before falling back to cache on a stalled network

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first with a timeout, cache fallback for offline. Fresh cache copy is
// stored on every successful fetch so the offline fallback stays current.
function networkFirst(request) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (res) => { if (!settled) { settled = true; resolve(res); } };

    const timer = setTimeout(() => {
      caches.match(request).then((cached) => { if (cached) done(cached); });
    }, NET_TIMEOUT);

    fetch(request)
      .then((res) => {
        clearTimeout(timer);
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
        done(res);
      })
      .catch(() => {
        clearTimeout(timer);
        caches.match(request).then((cached) => done(cached || caches.match('/index.html')));
      });
  });
}

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Never touch payment/function calls or cross-origin (Stripe, fonts, CDNs).
  if (url.pathname.startsWith('/.netlify/') || url.origin !== location.origin) return;
  e.respondWith(networkFirst(request));
});
