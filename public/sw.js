// PWA Service Worker for Namo Jinanam / Sanmati Sunil Sanskar Abhiyan
// Version tag updated on every deployment to ensure clean cache invalidation
const CACHE_NAME = 'namo-jinanam-v2.0.0';

// 1. Install Event: Skip waiting immediately so new code activates without waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. Activate Event: Claim all clients immediately & purge old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Purging old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients for immediate update');
      return self.clients.claim();
    })
  );
});

// 3. Fetch Event: Network-First for HTML/Pages, Stale-While-Revalidate for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET, API routes, Server Actions, and external Supabase requests
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api') ||
    url.hostname.includes('supabase') ||
    url.searchParams.has('_rsc')
  ) {
    return;
  }

  // Strategy A: HTML Page Navigation -> Network-First (always get latest deployment)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          // If offline, return cached page
          return caches.match(request).then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // Strategy B: Static Assets (JS, CSS, Images, Fonts) -> Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
