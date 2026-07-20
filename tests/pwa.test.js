import test from "node:test";
import assert from "node:assert/strict";

import { registerServiceWorkerOnLoad } from "../src/pwa.js";

function createWindowRef() {
  let loadHandler = null;

  return {
    addEventListener(type, handler) {
      if (type === "load") {
        loadHandler = handler;
      }
    },
    dispatchLoad() {
      loadHandler?.();
    },
  };
}

test("returns false when service workers are unavailable", () => {
  const result = registerServiceWorkerOnLoad({
    windowRef: {},
    navigatorRef: {},
    logger: null,
  });

  assert.equal(result, false);
});

test("registers the service worker after window load", async () => {
  const windowRef = createWindowRef();
  const registeredUrls = [];

  const navigatorRef = {
    serviceWorker: {
      async register(url) {
        registeredUrls.push(url);
        return { scope: "/udream/" };
      },
    },
  };

  const result = registerServiceWorkerOnLoad({
    windowRef,
    navigatorRef,
    logger: null,
  });

  assert.equal(result, true);
  assert.deepEqual(registeredUrls, []);

  windowRef.dispatchLoad();
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(registeredUrls, ["/udream/sw.js"]);
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
