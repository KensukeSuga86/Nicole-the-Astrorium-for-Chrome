/* Nicole the Astrorium — GitHub Pages PWA service worker */
const CACHE = 'nicole-astrorium-v1.1.0-pages-1';
const CORE = [
  './','./index.html','./presenter.html','./projector.html',
  './manifest.webmanifest','./icon-192.png','./icon-512.png',
  './art-image-store.js','./media-library.js','./location-favorites.js','./db-bridge.js',
  './database/db-bundle.js','./assets/art-data.js','./places-offline.js',
  './database-bootstrap.js','./bootstrap-presenter.js','./bootstrap-projector.js',
  './presenter-app.js','./projector-app.js','./engine.js','./renderer-adapter.js',
  './scene-state.js','./data-fallback.js','./constellation-art.js'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(hit => hit || fetch(event.request).then(resp => {
      if (resp && resp.ok) {
        const copy = resp.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
