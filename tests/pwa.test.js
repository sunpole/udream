import test from "node:test";
import assert from "node:assert/strict";

import {
  fetchPublishedVersion,
  registerServiceWorkerOnLoad,
} from "../src/pwa.js";

function createWindowRef() {
  let loadHandler = null;
  const reloads = [];

  return {
    location: {
      href: "https://sunpole.github.io/udream/",
      reload() {
        reloads.push(true);
      },
    },
    sessionStorage: {
      values: new Map(),
      getItem(key) {
        return this.values.get(key) ?? null;
      },
      setItem(key, value) {
        this.values.set(key, value);
      },
    },
    addEventListener(type, handler) {
      if (type === "load") loadHandler = handler;
    },
    dispatchLoad() {
      loadHandler?.();
    },
    reloads,
  };
}

test("returns false when service workers are unavailable", () => {
  const result = registerServiceWorkerOnLoad({
    windowRef: {},
    navigatorRef: {},
    documentRef: null,
    logger: null,
  });

  assert.equal(result, false);
});

test("registers the service worker after window load without HTTP cache", async () => {
  const windowRef = createWindowRef();
  const registered = [];

  const navigatorRef = {
    serviceWorker: {
      async register(url, options) {
        registered.push({ url, options });
        return { scope: "/udream/" };
      },
    },
  };

  const result = registerServiceWorkerOnLoad({
    windowRef,
    navigatorRef,
    documentRef: null,
    fetchRef: null,
    logger: null,
  });

  assert.equal(result, true);
  assert.deepEqual(registered, []);

  windowRef.dispatchLoad();
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(registered, [
    {
      url: "/udream/sw.js",
      options: { updateViaCache: "none" },
    },
  ]);
});

test("registration failure does not break the application", async () => {
  const windowRef = createWindowRef();
  const messages = [];
  const failure = new Error("registration blocked");

  const navigatorRef = {
    serviceWorker: {
      async register() {
        throw failure;
      },
    },
  };

  registerServiceWorkerOnLoad({
    windowRef,
    navigatorRef,
    documentRef: null,
    fetchRef: null,
    logger: {
      log(...args) {
        messages.push(args);
      },
    },
  });

  windowRef.dispatchLoad();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(messages[0][0], "Service Worker registration failed:");
  assert.equal(messages[0][1], failure);
});

test("published version is fetched with a cache-busting request", async () => {
  const requests = [];
  const version = await fetchPublishedVersion({
    versionUrl: "/udream/version.json",
    async fetchRef(url, options) {
      requests.push({ url, options });
      return {
        ok: true,
        async json() {
          return { version: "23.8.0" };
        },
      };
    },
  });

  assert.equal(version, "23.8.0");
  assert.match(requests[0].url, /^\/udream\/version\.json\?t=\d+$/);
  assert.equal(requests[0].options.cache, "no-store");
});
