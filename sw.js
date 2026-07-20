const APP_VERSION = "23.8.0";
const CACHE_PREFIX = "udream-";
const CACHE_NAME = `${CACHE_PREFIX}v${APP_VERSION}-runtime`;
const VERSION_PATH = "/udream/version.json";
const FALLBACK_PAGE = "/udream/index.html";

const APP_SHELL = [
  "/udream/",
  FALLBACK_PAGE,
  "/udream/script.js",
  "/udream/src/search.js",
  "/udream/src/version.js",
  "/udream/src/data.js",
  "/udream/src/history.js",
  "/udream/src/i18n.js",
  "/udream/src/presentation.js",
  "/udream/src/pwa.js",
  "/udream/src/state.js",
  "/udream/src/storage.js",
  "/udream/manifest.json",
  "/udream/favicon.svg",
  "/udream/icon-192.png",
  "/udream/icon-512.png",
  "/udream/apple-touch-icon.png",
  "/udream/data/divinity_code_ru.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const staleKeys = keys.filter(
        (key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME,
      );
      await Promise.all(staleKeys.map((key) => caches.delete(key)));
      await self.clients.claim();

      if (staleKeys.length === 0) return;
      const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      await Promise.all(
        windowClients.map(async (client) => {
          try {
            const url = new URL(client.url);
            if (url.origin !== self.location.origin || !url.pathname.startsWith("/udream/")) {
              return;
            }
            url.searchParams.set("udream-updated", APP_VERSION);
            await client.navigate(url.href);
          } catch {
            // A client can disappear while the new worker is taking control.
          }
        }),
      );
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

async function putSuccessfulResponse(request, response) {
  if (!response || !response.ok || request.method !== "GET") return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request, { cache: "no-store" });
    return await putSuccessfulResponse(request, response);
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      const fallback = await caches.match(FALLBACK_PAGE);
      if (fallback) return fallback;
    }
    throw new Error(`UDREAM resource unavailable: ${request.url}`);
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  return putSuccessfulResponse(request, response);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname === VERSION_PATH) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  const networkFirstDestinations = new Set(["document", "script", "style", "manifest"]);
  if (
    request.mode === "navigate" ||
    networkFirstDestinations.has(request.destination) ||
    url.pathname.endsWith(".json")
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});
