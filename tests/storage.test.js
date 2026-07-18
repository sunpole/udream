import test from "node:test";
import assert from "node:assert/strict";

import {
  readBoolean,
  readJson,
  readString,
  removeStoredValue,
  writeBoolean,
  writeJson,
  writeString,
} from "../src/storage.js";

function memoryStorage(values = {}) {
  const data = new Map(Object.entries(values));
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    value(key) {
      return data.get(key);
    },
  };
}

test("string and boolean settings restore with explicit defaults", () => {
  const storage = memoryStorage({
    clientTheme: "dark",
    showLatin: "true",
    showBreadcrumbs: "false",
  });

  assert.equal(readString(storage, "clientTheme", "light"), "dark");
  assert.equal(readString(storage, "missing", "ru"), "ru");
  assert.equal(readBoolean(storage, "showLatin"), true);
  assert.equal(readBoolean(storage, "showBreadcrumbs", true), false);
  assert.equal(readBoolean(storage, "missing", true), true);
});

test("invalid JSON and unavailable storage return safe defaults", () => {
  const storage = memoryStorage({ fullHistory: "{broken" });
  assert.deepEqual(readJson(storage, "fullHistory", []), []);

  const blockedStorage = {
    getItem() {
      throw new Error("blocked");
    },
  };
  assert.equal(readString(blockedStorage, "clientLang", "ru"), "ru");
  assert.equal(readBoolean(blockedStorage, "showLatin"), false);
  assert.deepEqual(readJson(blockedStorage, "fullHistory", []), []);
});

test("settings and JSON use the browser-compatible serialization format", () => {
  const storage = memoryStorage();

  writeString(storage, "clientLang", "en");
  writeBoolean(storage, "showLatin", true);
  writeJson(storage, "fullHistory", [{ id: 4 }]);

  assert.equal(storage.value("clientLang"), "en");
  assert.equal(storage.value("showLatin"), "true");
  assert.equal(storage.value("fullHistory"), '[{"id":4}]');

  removeStoredValue(storage, "fullHistory");
  assert.equal(storage.getItem("fullHistory"), null);
});
