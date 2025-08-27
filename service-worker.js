const CACHE_NAME = 'sgd-vnd-pwa-v1';
const FILES_TO_CACHE = [
'/',
'/index.html',
'/manifest.json',
'/icons/icon-192.png',
'/icons/icon-512.png',
'/icons/apple-touch-icon.png'
];


self.addEventListener('install', (evt) => {
evt.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
);
self.skipWaiting();
});


self.addEventListener('activate', (evt) => {
evt.waitUntil(
caches.keys().then((keyList) => Promise.all(
keyList.map((key) => {
if (key !== CACHE_NAME) return caches.delete(key);
})
))
);
self.clients.claim();
});


self.addEventListener('fetch', (evt) => {
// navigation requests -> try network first, fallback to cache
if (evt.request.mode === 'navigate' || (evt.request.method === 'GET' && evt.request.headers.get('accept').includes('text/html'))) {
evt.respondWith(
fetch(evt.request).catch(() => caches.match('/index.html'))
);
return;
}


// other requests -> cache-first
evt.respondWith(
caches.match(evt.request).then((resp) => resp || fetch(evt.request))
);
});