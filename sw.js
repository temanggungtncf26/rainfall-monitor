/* ========================================
   Service Worker — Monitoring Curah Hujan
   Cache First + Background Sync Strategy
   ======================================== */

const CACHE_NAME = 'curah-hujan-v1.0.0';
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxg976pJIOMNg4rHa-snZZbjBuW9xEHlAR2hlKUa6vqBDgZKIY6o0-0iFyYsKj1LhSb/exec';
const SYNC_TAG = 'sync-curah-hujan-queue';

// Aset statis yang di-cache saat install
const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  // CDN libraries — di-cache saat pertama kali diakses (runtime cache)
];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ===== FETCH EVENT (Cache First with Network Fallback) =====
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Jangan intercept request POST ke GAS (biarkan app.js yang handle offline queue)
  if (event.request.method === 'POST') {
    return;
  }

  // Untuk GAS URL (GET — load data), gunakan Network First dengan Cache Fallback
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(
      fetch(event.request.clone())
        .then((response) => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return response;
        })
        .catch(() => {
          console.log('[SW] Network failed, serving GAS from cache');
          return caches.match(event.request);
        })
    );
    return;
  }

  // Untuk aset CDN & statis: Cache First
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Segarkan cache di background (stale-while-revalidate)
        const networkFetch = fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
          }
          return response;
        }).catch(() => {});
        return cached;
      }

      // Tidak ada di cache, ambil dari network lalu simpan
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return response;
      }).catch(() => {
        // Fallback untuk halaman HTML
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ===== BACKGROUND SYNC EVENT =====
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  if (event.tag === SYNC_TAG) {
    event.waitUntil(processSyncQueue());
  }
});

// ===== PROCESS SYNC QUEUE =====
async function processSyncQueue() {
  const clients = await self.clients.matchAll();
  
  // Notify semua tab bahwa sync sedang berjalan
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_STARTED' });
  });

  // Baca queue dari IndexedDB-style via client message
  // Queue sebenarnya disimpan di localStorage (diakses lewat client message)
  clients.forEach(client => {
    client.postMessage({ type: 'PROCESS_QUEUE' });
  });
}

// ===== MESSAGE FROM CLIENT =====
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_VERSION') {
    event.source.postMessage({ type: 'CACHE_VERSION_RESPONSE', version: CACHE_NAME });
  }
});
