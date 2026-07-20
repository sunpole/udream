// @ts-check

export function registerServiceWorkerOnLoad({
  windowRef = globalThis.window,
  navigatorRef = globalThis.navigator,
  logger = globalThis.console,
  scriptUrl = "/udream/sw.js",
} = {}) {
  if (!windowRef || !navigatorRef || !("serviceWorker" in navigatorRef)) {
    return false;
  }

  windowRef.addEventListener("load", () => {
    navigatorRef.serviceWorker
      .register(scriptUrl)
      .then((registration) => {
        logger?.log?.(
          "Service Worker registered with scope:",
          registration.scope,
        );
      })
      .catch((error) => {
        logger?.log?.("Service Worker registration failed:", error);
      });
  });

  return true;
}
