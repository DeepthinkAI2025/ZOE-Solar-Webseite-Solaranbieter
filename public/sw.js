/**
 * Enhanced Service Worker für ZOE Solar PWA
 * Implementiert Offline-Funktionalität, Caching-Strategien und Background Sync
 */

const CACHE_NAME = 'zoe-solar-v2.0.0';
const STATIC_CACHE = 'zoe-solar-static-v2.0.0';
const DYNAMIC_CACHE = 'zoe-solar-dynamic-v2.0.0';
const API_CACHE = 'zoe-solar-api-v2.0.0';
const IMAGE_CACHE = 'zoe-solar-images-v2.0.0';

// Cache-Strategien
const cacheStrategies = {
  // Core Assets - Cache First mit Network Fallback
  static: [
    '/',
    '/index.html',
    '/manifest.json',
    '/robots.txt',
    '/sitemap.xml',
    '/faq-sitemap.xml',
    '/_next/static/css/',
    '/_next/static/js/',
    '/fonts/poppins-',
    '/images/logo.png',
    '/images/favicon.ico'
  ],

  // API-Endpunkte - Network First mit Cache Fallback
  api: [
    '/api/faq-data',
    '/api/ai-content',
    '/api/regional-content',
    '/api/market-data',
    '/api/pricing'
  ],

  // Bilder - Stale While Revalidate
  images: [
    '/images/',
    'https://images.unsplash.com/photo-'
  ],

  // Dynamische Seiten - Network First mit Cache Fallback
  pages: [
    '/wissen/',
    '/leistungen/',
    '/photovoltaik/',
    '/agri-pv/',
    '/kontakt/',
    '/faq/'
  ]
};

// Installation - Cache statische Ressourcen
self.addEventListener('install', (event) => {
  console.log('🔧 Installing ZOE Solar Service Worker v2.0.0...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Caching static assets...');
        return cache.addAll(cacheStrategies.static);
      })
      .then(() => {
        console.log('✅ Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Static caching failed:', error);
      })
  );
});

// Activation - Cache Management
self.addEventListener('activate', (event) => {
  console.log('🚀 Activating ZOE Solar Service Worker...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Entferne alte Caches
            if (cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== API_CACHE &&
                cacheName !== IMAGE_CACHE &&
                cacheName.startsWith('zoe-solar-')) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch Handler - Intelligente Caching-Strategien
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API-Anfragen
  if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Statische Assets
  if (isStaticRequest(request)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Bilder
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Seiten
  if (isPageRequest(request)) {
    event.respondWith(handlePageRequest(request));
    return;
  }

  // Standard - Network First mit Cache Fallback
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background Sync für Offline-Aktionen
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);

  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }

  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }

  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('📬 Push message received');

  const options = {
    body: event.data ? event.data.text() : 'Neue Informationen von ZOE Solar',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Mehr erfahren',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Schließen',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ZOE Solar', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Notification clicked:', event.notification.data);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('https://zoe-solar.de')
    );
  }
});

// Request Handling Functions
async function handleAPIRequest(request) {
  try {
    // Network First für API-Anfragen
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache die Antwort
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('🌐 Network failed, trying cache for:', request.url);
    // Fallback zum Cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Generiere Offline-Antwort für API-Anfragen
    return generateOfflineAPIResponse(request);
  }
}

async function handleStaticRequest(request) {
  // Cache First für statische Assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('❌ Failed to load static asset:', request.url);
    return generateOfflineResponse();
  }
}

async function handleImageRequest(request) {
  try {
    // Stale While Revalidate für Bilder
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);

    const networkPromise = fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    });

    return cachedResponse || networkPromise;
  } catch (error) {
    console.log('🖼️ Image load failed, trying cache:', request.url);
    return caches.match(request) || generatePlaceholderImage();
  }
}

async function handlePageRequest(request) {
  try {
    // Network First für Seiten
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('📄 Page load failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback zur Startseite
    return caches.match('/') || generateOfflinePage();
  }
}

// Helper Functions
function isAPIRequest(request) {
  return request.url.includes('/api/') ||
         request.headers.get('accept')?.includes('application/json');
}

function isStaticRequest(request) {
  return cacheStrategies.static.some(pattern => request.url.includes(pattern));
}

function isImageRequest(request) {
  return cacheStrategies.images.some(pattern => request.url.includes(pattern)) ||
         request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

function isPageRequest(request) {
  return cacheStrategies.pages.some(pattern => request.url.includes(pattern)) ||
         request.url.includes('/wissen/') ||
         request.url.includes('/leistungen/') ||
         request.url.includes('/photovoltaik/') ||
         request.url.includes('/agri-pv/') ||
         request.url.includes('/kontakt/') ||
         request.url.includes('/faq/');
}

// Offline Response Generators
function generateOfflineAPIResponse(request) {
  const offlineData = {
    error: 'Offline',
    message: 'Keine Netzwerkverbindung verfügbar',
    cachedData: true,
    timestamp: new Date().toISOString(),
    url: request.url
  };

  return new Response(JSON.stringify(offlineData), {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}

function generateOfflineResponse() {
  return new Response('Offline - Keine Verbindung verfügbar', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

function generatePlaceholderImage() {
  // SVG Placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#666">
        Bild nicht verfügbar (Offline)
      </text>
    </svg>
  `;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}

function generateOfflinePage() {
  const html = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - ZOE Solar</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
        .offline-container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .solar-icon { font-size: 60px; margin-bottom: 20px; }
        h1 { color: #2c3e50; margin-bottom: 20px; }
        p { color: #7f8c8d; line-height: 1.6; margin-bottom: 30px; }
        .button { background: #27ae60; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        .button:hover { background: #219a52; }
        .cached-pages { margin-top: 40px; text-align: left; }
        .cached-pages h3 { color: #2c3e50; margin-bottom: 15px; }
        .cached-pages ul { list-style: none; padding: 0; }
        .cached-pages li { margin: 10px 0; }
        .cached-pages a { color: #27ae60; text-decoration: none; padding: 10px; border: 1px solid #27ae60; border-radius: 5px; display: block; }
        .cached-pages a:hover { background: #27ae60; color: white; }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="solar-icon">☀️</div>
        <h1>Sie sind offline</h1>
        <p>Keine Sorge! Sie haben immer noch Zugriff auf wichtige Informationen von ZOE Solar. Wir haben einige Inhalte für Sie zwischengespeichert.</p>
        <button class="button" onclick="window.location.reload()">Erneut versuchen</button>

        <div class="cached-pages">
          <h3>Verfügbare Offline-Inhalte:</h3>
          <ul>
            <li><a href="/">Startseite</a></li>
            <li><a href="/wissen/faq">Häufige Fragen</a></li>
            <li><a href="/leistungen">Unsere Dienstleistungen</a></li>
            <li><a href="/photovoltaik">Photovoltaik Informationen</a></li>
            <li><a href="/kontakt">Kontakt</a></li>
          </ul>
        </div>

        <p style="margin-top: 40px; font-size: 14px; color: #95a5a6;">
          🔄 Die Seite wird automatisch aktualisiert, wenn die Verbindung wiederhergestellt ist.
        </p>
      </div>

      <script>
        // Periodisch versuchen, die Verbindung wiederherzustellen
        setInterval(() => {
          if (navigator.onLine) {
            window.location.reload();
          }
        }, 30000); // Alle 30 Sekunden

        // Online/Offline Status anzeigen
        window.addEventListener('online', () => {
          console.log('🌐 Verbindung wiederhergestellt');
          window.location.reload();
        });

        window.addEventListener('offline', () => {
          console.log('📱 Verbindung verloren');
        });
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
}

// Background Sync Functions
async function syncContactForm() {
  try {
    // Synchronisiere gespeicherte Kontaktformulare
    const formData = await getStoredContactForms();

    for (const form of formData) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data)
        });

        if (response.ok) {
          await removeStoredContactForm(form.id);
          console.log('✅ Contact form synced successfully');
        }
      } catch (error) {
        console.error('❌ Failed to sync contact form:', error);
      }
    }
  } catch (error) {
    console.error('❌ Contact form sync failed:', error);
  }
}

async function syncAnalytics() {
  try {
    // Synchronisiere gespeicherte Analytics-Daten
    const analyticsData = await getStoredAnalyticsData();

    for (const data of analyticsData) {
      try {
        const response = await fetch('/api/analytics/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data.events)
        });

        if (response.ok) {
          await removeStoredAnalyticsData(data.id);
          console.log('✅ Analytics data synced successfully');
        }
      } catch (error) {
        console.error('❌ Failed to sync analytics data:', error);
      }
    }
  } catch (error) {
    console.error('❌ Analytics sync failed:', error);
  }
}

async function syncContent() {
  try {
    // Synchronisiere Content-Updates
    const response = await fetch('/api/content/updates');
    if (response.ok) {
      const updates = await response.json();

      // Cache neue Inhalte
      const cache = await caches.open(DYNAMIC_CACHE);
      for (const update of updates) {
        await cache.add(update.url);
      }

      console.log('✅ Content synced successfully');
    }
  } catch (error) {
    console.error('❌ Content sync failed:', error);
  }
}

// IndexedDB Helper Functions
async function getStoredContactForms() {
  // Implementierung mit IndexedDB
  return [];
}

async function removeStoredContactForm(id) {
  // Implementierung mit IndexedDB
}

async function getStoredAnalyticsData() {
  // Implementierung mit IndexedDB
  return [];
}

async function removeStoredAnalyticsData(id) {
  // Implementierung mit IndexedDB
}

// Performance Monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cache Management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    updateCache(event.data.url);
  }
});

async function updateCache(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(url, response);
      console.log('✅ Cache updated for:', url);
    }
  } catch (error) {
    console.error('❌ Cache update failed:', url, error);
  }
}

console.log('🚀 ZOE Solar Service Worker v2.0.0 loaded successfully');