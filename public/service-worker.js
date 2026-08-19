/* eslint-disable no-restricted-globals */

// Service Worker for Daily Todo App PWA
const CACHE_NAME = 'daily-todo-v2';
const RUNTIME_CACHE = 'daily-todo-runtime';

// ... (PRECACHE_URLS remain mostly the same, but ensuring no stale assets)
// Assets to cache on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/static/css/main.css',
    '/static/js/main.js',
    '/manifest.json',
    '/favicon.ico.png',
    '/logo192.png',
    '/logo512.png'
];

// ... (install and activate events remain same)

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Handle navigation requests (HTML) - NETWORK FIRST
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone and cache the response
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // If network fails (offline), try cache
                    return caches.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            // Fallback to cached index.html
                            return caches.match('/index.html');
                        });
                })
        );
        return;
    }

    // Handle static assets (CSS, JS, images)
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Not in cache, fetch from network
                return fetch(request).then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Clone and cache the response
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });

                    return response;
                });
            })
            .catch(() => {
                // Network failed and not in cache
                console.log('[Service Worker] Fetch failed for:', request.url);
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
