// @ts-check

import { APP_VERSION } from "./version.js";

const DEFAULT_SCRIPT_URL = "/udream/sw.js";
const DEFAULT_VERSION_URL = "/udream/version.json";
const BANNER_ID = "udreamInstallBanner";

const bannerMessages = {
  ru: {
    title: "Установите UDREAM на телефон",
    text: "Приложение открывается с главного экрана и продолжает работать без постоянного поиска сайта.",
    install: "Установить",
    help: "Как установить",
    close: "Закрыть до перезагрузки страницы",
    manual: "Если системное окно не появилось: откройте меню браузера и выберите «Добавить на главный экран» или «Установить приложение».",
  },
  en: {
    title: "Install UDREAM on your phone",
    text: "Open it from the home screen and keep the dictionary available without searching for the site again.",
    install: "Install",
    help: "How to install",
    close: "Close until the page is reloaded",
    manual: "If no system prompt appears, open the browser menu and choose “Add to Home screen” or “Install app”.",
  },
};

function getLanguage(windowRef) {
  try {
    return windowRef?.localStorage?.getItem("clientLang") === "en" ? "en" : "ru";
  } catch {
    return "ru";
  }
}

function isStandalone(windowRef) {
  return Boolean(
    windowRef?.matchMedia?.("(display-mode: standalone)")?.matches ||
      windowRef?.navigator?.standalone,
  );
}

function removeUpdateMarker(windowRef) {
  try {
    const url = new URL(windowRef.location.href);
    if (!url.searchParams.has("udream-updated")) return;
    url.searchParams.delete("udream-updated");
    windowRef.history?.replaceState?.({}, "", url.href);
  } catch {
    // A malformed or unavailable URL must not block application startup.
  }
}

function injectBannerStyles(documentRef) {
  if (documentRef.getElementById("udreamPwaStyles")) return;
  const style = documentRef.createElement("style");
  style.id = "udreamPwaStyles";
  style.textContent = `
    #${BANNER_ID}[hidden] { display: none !important; }
    body.udream-install-banner-visible { padding-bottom: calc(var(--footer-height, 24px) + 176px); }
    .udream-install-banner {
      position: fixed;
      left: 10px;
      right: 10px;
      bottom: calc(var(--footer-height, 24px) + 8px);
      z-index: 190;
      max-width: 720px;
      margin: 0 auto;
      padding: 14px 42px 12px 14px;
      border: 1px solid var(--border-card, #ddd);
      border-radius: 22px;
      background: var(--bg-card, #fff);
      color: var(--text-body, #222);
      box-shadow: 0 12px 34px rgba(0, 0, 0, 0.22);
      user-select: none;
    }
    .udream-install-banner__title { display: block; margin-bottom: 4px; font-size: 0.95rem; }
    .udream-install-banner__text { display: block; font-size: 0.72rem; line-height: 1.35; opacity: 0.9; }
    .udream-install-banner__actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .udream-install-banner__button {
      border: 0;
      border-radius: 999px;
      padding: 8px 14px;
      background: var(--bg-active, #8c745c);
      color: var(--text-active, #fff);
      font: inherit;
      font-size: 0.74rem;
      font-weight: 600;
      cursor: pointer;
    }
    .udream-install-banner__button--secondary {
      border: 1px solid var(--border-card, #ddd);
      background: var(--bg-element, #eee);
      color: var(--text-element, #222);
    }
    .udream-install-banner__close {
      position: absolute;
      top: 7px;
      right: 8px;
      width: 28px;
      height: 28px;
      border: 0;
      border-radius: 50%;
      background: var(--bg-element, #eee);
      color: var(--text-body, #222);
      font-size: 1.15rem;
      line-height: 1;
      cursor: pointer;
    }
    .udream-install-banner__help { margin-top: 8px; font-size: 0.68rem; line-height: 1.35; opacity: 0.85; }
    @media (min-width: 700px) {
      body.udream-install-banner-visible { padding-bottom: calc(var(--footer-height, 24px) + 142px); }
    }
  `;
  documentRef.head?.append?.(style);
}

function createInstallBanner(documentRef) {
  const banner = documentRef.createElement("section");
  banner.id = BANNER_ID;
  banner.className = "udream-install-banner";
  banner.hidden = true;
  banner.setAttribute("role", "region");
  banner.innerHTML = `
    <button type="button" class="udream-install-banner__close" data-pwa-close aria-label="Закрыть">&times;</button>
    <strong class="udream-install-banner__title" data-pwa-title></strong>
    <span class="udream-install-banner__text" data-pwa-text></span>
    <div class="udream-install-banner__actions">
      <button type="button" class="udream-install-banner__button" data-pwa-install></button>
      <button type="button" class="udream-install-banner__button udream-install-banner__button--secondary" data-pwa-help></button>
    </div>
    <div class="udream-install-banner__help" data-pwa-manual hidden></div>
  `;
  documentRef.body?.append?.(banner);
  return banner;
}

function applyBannerLanguage(banner, language) {
  const messages = bannerMessages[language] ?? bannerMessages.ru;
  const setText = (selector, value) => {
    const element = banner.querySelector(selector);
    if (element) element.textContent = value;
  };
  setText("[data-pwa-title]", messages.title);
  setText("[data-pwa-text]", messages.text);
  setText("[data-pwa-install]", messages.install);
  setText("[data-pwa-help]", messages.help);
  setText("[data-pwa-manual]", messages.manual);
  const closeButton = banner.querySelector("[data-pwa-close]");
  closeButton?.setAttribute?.("aria-label", messages.close);
  closeButton?.setAttribute?.("title", messages.close);
}

export function setupInstallBanner({
  windowRef = globalThis.window,
  documentRef = globalThis.document,
  logger = globalThis.console,
} = {}) {
  if (!windowRef || !documentRef?.body || !documentRef?.createElement) {
    return false;
  }

  removeUpdateMarker(windowRef);
  injectBannerStyles(documentRef);

  const banner = documentRef.getElementById(BANNER_ID) ?? createInstallBanner(documentRef);
  const installButton = banner.querySelector("[data-pwa-install]");
  const helpButton = banner.querySelector("[data-pwa-help]");
  const closeButton = banner.querySelector("[data-pwa-close]");
  const manual = banner.querySelector("[data-pwa-manual]");
  let deferredPrompt = null;
  let closedForCurrentPage = false;

  const refreshLanguage = () => applyBannerLanguage(banner, getLanguage(windowRef));
  const hide = () => {
    banner.hidden = true;
    documentRef.body.classList?.remove?.("udream-install-banner-visible");
  };
  const show = () => {
    if (closedForCurrentPage || isStandalone(windowRef)) {
      hide();
      return;
    }
    refreshLanguage();
    banner.hidden = false;
    documentRef.body.classList?.add?.("udream-install-banner-visible");
  };

  closeButton?.addEventListener?.("click", () => {
    closedForCurrentPage = true;
    hide();
  });

  helpButton?.addEventListener?.("click", () => {
    if (manual) manual.hidden = !manual.hidden;
  });

  installButton?.addEventListener?.("click", async () => {
    if (!deferredPrompt) {
      if (manual) manual.hidden = false;
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (choice?.outcome === "accepted") hide();
      else show();
    } catch (error) {
      logger?.log?.("PWA installation prompt failed:", error);
      if (manual) manual.hidden = false;
    }
  });

  windowRef.addEventListener?.("beforeinstallprompt", (event) => {
    event.preventDefault?.();
    deferredPrompt = event;
    show();
  });

  windowRef.addEventListener?.("appinstalled", () => {
    deferredPrompt = null;
    hide();
  });

  documentRef.getElementById?.("langToggle")?.addEventListener?.("click", () => {
    windowRef.setTimeout?.(refreshLanguage, 0);
  });

  show();
  return true;
}

export async function fetchPublishedVersion({
  fetchRef = globalThis.fetch,
  versionUrl = DEFAULT_VERSION_URL,
} = {}) {
  if (typeof fetchRef !== "function") return null;
  const separator = versionUrl.includes("?") ? "&" : "?";
  const response = await fetchRef(`${versionUrl}${separator}t=${Date.now()}`, {
    cache: "no-store",
    headers: { "cache-control": "no-cache" },
  });
  if (!response.ok) throw new Error(`Version request failed: ${response.status}`);
  const payload = await response.json();
  return typeof payload?.version === "string" ? payload.version : null;
}

function activateWaitingWorker(registration) {
  registration?.waiting?.postMessage?.({ type: "SKIP_WAITING" });
}

function watchRegistration(registration, navigatorRef) {
  activateWaitingWorker(registration);
  registration?.addEventListener?.("updatefound", () => {
    const worker = registration.installing;
    worker?.addEventListener?.("statechange", () => {
      if (worker.state === "installed" && navigatorRef.serviceWorker.controller) {
        activateWaitingWorker(registration);
      }
    });
  });
}

function requestOneReload(windowRef, version) {
  const key = `udream-version-reload-${version}`;
  try {
    if (windowRef.sessionStorage?.getItem(key)) return false;
    windowRef.sessionStorage?.setItem(key, "1");
  } catch {
    // Reload protection remains best-effort when storage is unavailable.
  }
  windowRef.location?.reload?.();
  return true;
}

export function registerServiceWorkerOnLoad({
  windowRef = globalThis.window,
  navigatorRef = globalThis.navigator,
  documentRef = globalThis.document,
  fetchRef = globalThis.fetch,
  logger = globalThis.console,
  scriptUrl = DEFAULT_SCRIPT_URL,
  versionUrl = DEFAULT_VERSION_URL,
} = {}) {
  setupInstallBanner({ windowRef, documentRef, logger });

  if (!windowRef || !navigatorRef || !("serviceWorker" in navigatorRef)) {
    return false;
  }

  let controllerReloadStarted = false;
  navigatorRef.serviceWorker.addEventListener?.("controllerchange", () => {
    if (controllerReloadStarted) return;
    controllerReloadStarted = true;
    windowRef.location?.reload?.();
  });

  windowRef.addEventListener("load", async () => {
    try {
      const registration = await navigatorRef.serviceWorker.register(scriptUrl, {
        updateViaCache: "none",
      });
      logger?.log?.("Service Worker registered with scope:", registration.scope);
      watchRegistration(registration, navigatorRef);
      await registration.update?.();

      try {
        const publishedVersion = await fetchPublishedVersion({ fetchRef, versionUrl });
        if (publishedVersion && publishedVersion !== APP_VERSION) {
          logger?.log?.(
            `UDREAM update required: local ${APP_VERSION}, published ${publishedVersion}`,
          );
          await registration.update?.();
          activateWaitingWorker(registration);
          requestOneReload(windowRef, publishedVersion);
        }
      } catch (error) {
        logger?.log?.("UDREAM version check failed:", error);
      }
    } catch (error) {
      logger?.log?.("Service Worker registration failed:", error);
    }
  });

  return true;
}
