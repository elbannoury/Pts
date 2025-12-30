// إصدار التطبيق
const CACHE_VERSION = 'pitsiky-v1.0.1';
const CACHE_NAME = `pitsiky-cache-${CACHE_VERSION}`;

// الملفات التي سيتم تخزينها مؤقتاً
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/pdc.html',
  '/crt.html',
  '/chkt.html',
  '/shpng.html',
  '/usrrvw.html',
  '/antr.html',
  '/manifest.json',
  '/images/ptk.png',
  '/gif/fst.gif',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap'
];

// تركيب Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Install completed');
        return self.skipWaiting();
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // حذف الذاكرات المؤقتة القديمة
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activation completed');
      return self.clients.claim();
    })
  );
});

// اعتراض طلبات الشبكة
self.addEventListener('fetch', (event) => {
  // تجاهل الطلبات غير GET
  if (event.request.method !== 'GET') return;
  
  // تجاهل طلبات من مصادر مختلفة
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // إذا وجدنا نسخة مخبأة، نرجعها
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // محاولة جلب من الشبكة
        return fetch(event.request)
          .then((networkResponse) => {
            // إذا كان الطلب ناجحاً، نخزن في الذاكرة المؤقتة
            if (event.request.url.startsWith('http') && networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // إذا فشل الاتصال، نرجع صفحة عدم الاتصال
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // للصور، نرجع صورة بديلة
            if (event.request.destination === 'image') {
              return new Response(
                '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" font-family="Arial" font-size="10" text-anchor="middle" fill="#666">No Image</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            
            // رسالة خطأ عامة
            return new Response('لا يوجد اتصال بالإنترنت', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// استقبال الرسائل من الصفحة الرئيسية
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// تحديث المحتوى في الخلفية (Background Sync)
self.addEventListener('sync', (event) => {
  if (event.tag === 'update-products') {
    console.log('[Service Worker] Background sync: update-products');
    event.waitUntil(updateProducts());
  }
});

// تحديث قائمة المنتجات في الخلفية
async function updateProducts() {
  try {
    console.log('[Service Worker] Updating products in background...');
    
    // هنا يمكنك إضافة منطق تحديث المنتجات
    // مثلاً: جلب بيانات جديدة من API
    
    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] Background sync failed:', error);
    return Promise.reject(error);
  }
}

// دفع الإشعارات
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }
  
  const options = {
    body: data.body || 'تحديث جديد من PITSIKY',
    icon: 'images/ptk.png',
    badge: 'images/ptk.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'PITSIKY', options)
  );
});

// النقر على الإشعارات
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
