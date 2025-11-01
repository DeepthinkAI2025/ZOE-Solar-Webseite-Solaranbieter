/**
 * Mobile Service Worker für ZOE Solar
 *
 * Optimiert die Mobile Experience mit:
 * - Offline-Caching für kritische Ressourcen
 * - Schnelle Ladezeiten auf mobilen Netzwerken
 * - Core Web Vitals Optimierung
 */

const CACHE_NAME = 'zoe-solar-mobile-v1';
const STATIC_CACHE_NAME = 'zoe-solar-static-v1';
const DYNAMIC_CACHE_NAME = 'zoe-solar-dynamic-v1';

// Kritische Ressourcen für Mobile sofort cachen
const CRITICAL_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/_next/static/css/app.css',
  '/fonts/poppins-v20-latin-regular.woff2',
  '/fonts/poppins-v20-latin-600.woff2',
  '/images/logo-mobile.svg',
];

// Statische Assets die länger gecacht werden
const STATIC_ASSETS = [
  '/images/hero-solar.webp',
  '/images/solar-panel-mobile.webp',
  '/images/team-mobile.webp',
  '/css/critical.css',
];

// API Endpunkte die kurz gecacht werden
const API_CACHE_PATTERNS = [
  /^\/api\/.*$/,
];

// Cache-Strategien für verschiedene Ressourcen-Typen
const CACHE_STRATEGIES = {
  // Critical: Cache First mit Network Fallback
  critical: (request) => caches.match(request).then(response => {
    return response || fetch(request).then(fetchResponse => {
      if (fetchResponse.ok) {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, fetchResponse.clone());
        });
      }
      return fetchResponse;
    });
  }),

  // Static: Cache First für Assets
  static: (request) => caches.match(request).then(response => {
    return response || fetch(request).then(fetchResponse => {
      if (fetchResponse.ok) {
        caches.open(STATIC_CACHE_NAME).then(cache => {
          cache.put(request, fetchResponse.clone());
        });
      }
      return fetchResponse;
    });
  }),

  // API: Network First mit Cache Fallback
  api: (request) => fetch(request).then(response => {
    if (response.ok) {
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        cache.put(request, response.clone());
      });
    }
    return response;
  }).catch(() => {
    return caches.match(request);
  }),

  // Default: Network First
  default: (request) => fetch(request).catch(() => {
    return caches.match(request);
  }),
};

// Service Worker Installation
self.addEventListener('install', (event) => {
  console.log('📱 Mobile Service Worker installing...');

  event.waitUntil(
    Promise.all([
      // Critical Assets sofort cachen
      caches.open(CACHE_NAME).then(cache => {
        console.log('🚀 Caching critical assets...');
        return cache.addAll(CRITICAL_ASSETS);
      }),

      // Statische Assets vor-cachen
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('📦 Pre-caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
    ]).then(() => {
      console.log('✅ Mobile Service Worker installed');
      return self.skipWaiting();
    })
  );
});

// Service Worker Activation
self.addEventListener('activate', (event) => {
  console.log('🔄 Mobile Service Worker activating...');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Alte Caches löschen
          if (cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Mobile Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch Event Handling
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Nur HTTP/HTTPS Anfragen behandeln
  if (!request.url.startsWith('http')) {
    return;
  }

  // Passende Cache-Strategie wählen
  let strategy;

  if (CRITICAL_ASSETS.includes(url.pathname)) {
    strategy = CACHE_STRATEGIES.critical;
  } else if (url.pathname.startsWith('/images/') ||
             url.pathname.endsWith('.webp') ||
             url.pathname.endsWith('.jpg') ||
             url.pathname.endsWith('.png')) {
    strategy = CACHE_STRATEGIES.static;
  } else if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    strategy = CACHE_STRATEGIES.api;
  } else {
    strategy = CACHE_STRATEGIES.default;
  }

  event.respondWith(strategy(request));
});

// Background Sync für Offline-Aktionen
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Push Notifications für Mobile (optional)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/icon-192x192.png',
      badge: '/images/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
      },
      actions: [
        {
          action: 'open',
          title: 'Öffnen'
        },
        {
          action: 'close',
          title: 'Schließen'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Helper Functions
async function syncContactForm() {
  // Gespeicherte Kontaktformular-Daten senden
  const formData = await caches.match('contact-form-data');

  if (formData) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: await formData.text(),
      });

      if (response.ok) {
        await caches.delete('contact-form-data');
        console.log('✅ Contact form synced successfully');
      }
    } catch (error) {
      console.log('❌ Contact form sync failed:', error);
    }
  }
}

// Cache Management für Performance
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentTime = Date.now();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const responseTime = new Date(dateHeader).getTime();
          const age = currentTime - responseTime;

          // Alte API Responses löschen (älter als 15 Minuten)
          if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url)) &&
              age > 15 * 60 * 1000) {
            await cache.delete(request);
          }
        }
      }
    }
  }
}

// Regelmäßiges Cache Cleanup
setInterval(cleanupOldCaches, 30 * 60 * 1000); // Alle 30 Minuten

// Performance Monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_METRICS') {
    getPerformanceMetrics().then(metrics => {
      event.ports[0].postMessage({ type: 'METRICS', data: metrics });
    });
  }
});

async function getPerformanceMetrics() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  let totalEntries = 0;

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    totalEntries += requests.length;

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const size = response.headers.get('content-length');
        if (size) {
          totalSize += parseInt(size);
        }
      }
    }
  }

  return {
    cacheNames,
    totalEntries,
    totalSize,
    averageEntrySize: totalEntries > 0 ? Math.round(totalSize / totalEntries) : 0,
  };
}