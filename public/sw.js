const CACHE_STATIC = 'gymtracker-static-v1'
const CACHE_DYNAMIC = 'gymtracker-dynamic-v1'
const CACHE_API = 'gymtracker-api-v1'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/styles/global.css',
  '/styles/variables.css'
]

// ─── INSTALL ───────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      console.log('[SW] Precacheando assets estáticos')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// ─── ACTIVATE ──────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const validCaches = [CACHE_STATIC, CACHE_DYNAMIC, CACHE_API]
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !validCaches.includes(key))
          .map((key) => {
            console.log('[SW] Eliminando caché viejo:', key)
            return caches.delete(key)
          })
      )
    ).then(() => self.clients.claim())
  )
})

// ─── FETCH ─────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar extensiones de Chrome y non-GET
  if (!url.protocol.startsWith('http')) return
  if (request.method !== 'GET') return

  // 1. API calls — Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, CACHE_API))
    return
  }

  // 2. Imágenes y assets estáticos — Cache First
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf)$/) ||
    url.pathname.startsWith('/images/')
  ) {
    event.respondWith(cacheFirst(request, CACHE_STATIC))
    return
  }

  // 3. JS y CSS — Stale While Revalidate
  if (url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_DYNAMIC))
    return
  }

  // 4. Navegación (HTML) — Network First con fallback offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline.html'))
    )
    return
  }

  // 5. Todo lo demás — Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request, CACHE_DYNAMIC))
})

// ─── ESTRATEGIAS ───────────────────────────────────────────

// Cache First: sirve desde caché, si no existe va a la red
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('Asset no disponible offline', { status: 503 })
  }
}

// Network First: intenta red, si falla usa caché
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    return new Response(
      JSON.stringify({ error: 'Sin conexión', offline: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Stale While Revalidate: sirve caché inmediatamente y actualiza en segundo plano
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone())
    return response
  }).catch(() => null)

  return cached || fetchPromise
}

// ─── BACKGROUND SYNC ───────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending') {
    console.log('[SW] Background Sync disparado')
    event.waitUntil(syncPendingData())
  }
})

async function syncPendingData() {
  // El syncManager del cliente maneja la lógica real
  // El SW solo notifica a todos los clientes abiertos
  const clients = await self.clients.matchAll()
  clients.forEach((client) => {
    client.postMessage({ type: 'SYNC_PENDING' })
  })
}

// ─── PUSH NOTIFICATIONS ────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || 'GymTracker'
  const options = {
    body: data.body || 'Tienes una notificación nueva',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.url ? { url: data.url } : {},
    actions: data.actions || []
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/dashboard'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const existing = clientList.find((c) => c.url.includes(url) && 'focus' in c)
      if (existing) return existing.focus()
      return clients.openWindow(url)
    })
  )
})