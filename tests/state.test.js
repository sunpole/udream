import test from "node:test";
import assert from "node:assert/strict";

import { createInitialState } from "../src/state.js";

function storageFrom(values = {}) {
  return {
    getItem(key) {
      return Object.hasOwn(values, key) ? values[key] : null;
    },
  };
}

test("initial state keeps current defaults", () => {
  const state = createInitialState(storageFrom());

  assert.deepEqual(state.db, []);
  assert.equal(state.currentMode, "all");
  assert.equal(state.theme, "light");
  assert.equal(state.lang, "ru");
  assert.equal(state.currentDbName, "divinity_code_ru.json");
  assert.equal(state.showBreadcrumbs, true);
  assert.equal(state.showLatin, false);
  assert.deepEqual(state.fullHistory, []);
});

test("initial state restores persisted preferences", () => {
  const state = createInitialState(storageFrom({
    clientTheme: "dark",
    clientLang: "en",
    fullHistory: '[{"id":4,"symbol":"Water","timestamp":"2026-07-19T10:00:00.000Z"}]',
    showLatin: "true",
    showCyrillic: "true",
    showDigits: "true",
    showBreadcrumbs: "false",
    showTagsCloud: "true",
    showHistoryBlock: "true",
    allowSelection: "true",
    wideScrollbar: "true",
    tagSortMode: "frequency",
  }));

  assert.equal(state.theme, "dark");
  assert.equal(state.lang, "en");
  assert.equal(state.showBreadcrumbs, false);
  assert.equal(state.showLatin, true);
  assert.equal(state.tagSortMode, "frequency");
  assert.deepEqual(state.fullHistory, [{
    id: 4,
    symbol: "Water",
    timestamp: "2026-07-19T10:00:00.000Z",
  }]);
});

test("invalid stored history no longer prevents application startup", () => {
  const state = createInitialState(storageFrom({
    fullHistory: "{broken",
  }));

  assert.deepEqual(state.fullHistory, []);
});

test("unsupported stored language falls back to Russian", () => {
  const state = createInitialState(storageFrom({ clientLang: "<script>" }));

  assert.equal(state.lang, "ru");
});
