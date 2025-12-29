const CACHE_NAME = 'pitsiky-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  // أضف هنا جميع الملفات التي تريد تخزينها مؤقتًا
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم فتح الذاكرة المؤقتة');
        return cache.addAll(urlsToCache);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('جاري حذف الذاكرة المؤقتة القديمة:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// اعتراض الطلبات
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد الملف في الذاكرة المؤقتة، قم بإرجاعه
        if (response) {
          return response;
        }
        
        // وإلا قم بتنزيله من الشبكة
        return fetch(event.request)
          .then(response => {
            // تحقق من أن الاستجابة صالحة
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // استنسخ الاستجابة
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});
