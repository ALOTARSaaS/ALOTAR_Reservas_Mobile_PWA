const CACHE_NAME = "alotar-booking-v2-5-reserve-pwa-v8";

const APP_SHELL = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
        )
      ),
      self.clients.claim()
    ])
  );
});

async function networkFirst_(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const fresh = await fetch(request, { cache: "no-store" });

    if (fresh && fresh.ok) {
      cache.put(request, fresh.clone()).catch(()=>{});
    }

    return fresh;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirst_(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const fresh = await fetch(request);
  if (fresh && fresh.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, fresh.clone()).catch(()=>{});
  }
  return fresh;
}

self.addEventListener("fetch", event => {
  const req = event.request;

  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Nunca interceptar ni cachear el backend de Apps Script.
  if (
    url.hostname.includes("script.google.com") ||
    url.hostname.includes("script.googleusercontent.com")
  ) {
    return;
  }

  // Navegaciones y archivos que cambian la lógica:
  // red primero, caché solo como respaldo offline.
  const isNavigation = req.mode === "navigate";
  const isCoreLogicFile =
    url.origin === self.location.origin &&
    (
      url.pathname.endsWith("/") ||
      url.pathname.endsWith("/index.html") ||
      url.pathname.endsWith("/config.js")
    );

  if (isNavigation || isCoreLogicFile) {
    event.respondWith(networkFirst_(req));
    return;
  }

  // Assets estáticos: caché primero.
  event.respondWith(cacheFirst_(req));
});
