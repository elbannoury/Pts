// sw.js
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // هذا الكود ضروري ليعمل التطبيق، حتى لو كان يعيد الطلب كما هو
  e.respondWith(fetch(e.request));
});
