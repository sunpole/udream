import test from "node:test";
import assert from "node:assert/strict";

import {
  appendFullHistory,
  appendNavigationHistory,
  getBreadcrumbWindow,
  groupFullHistoryByDay,
  moveNavigationHistory,
  normalizeFullHistory,
} from "../src/history.js";

const water = { id: 1, symbol: "water" };
const mouse = { id: 2, symbol: "mouse/mice" };
const fire = { id: 3, symbol: "fire" };

test("navigation appends entries and discards an abandoned forward branch", () => {
  let navigation = appendNavigationHistory([], -1, water);
  navigation = appendNavigationHistory(navigation.stack, navigation.index, mouse);

  const back = moveNavigationHistory(navigation.stack, navigation.index, -1);
  assert.equal(back.index, 0);
  assert.deepEqual(back.entry, water);

  const branched = appendNavigationHistory(navigation.stack, back.index, fire);
  assert.deepEqual(branched.stack, [water, fire]);
  assert.equal(branched.index, 1);
});

test("navigation respects both boundaries", () => {
  const stack = [water, mouse];
  assert.deepEqual(moveNavigationHistory(stack, 0, -1), { index: 0, entry: null });
  assert.deepEqual(moveNavigationHistory(stack, 1, 1), { index: 1, entry: null });
});

test("breadcrumbs expose at most the latest ten entries through the index", () => {
  const stack = Array.from({ length: 14 }, (_, index) => ({
    id: index + 1,
    symbol: `symbol-${index + 1}`,
  }));

  const window = getBreadcrumbWindow(stack, 12);
  assert.equal(window.start, 3);
  assert.equal(window.items.length, 10);
  assert.equal(window.items.at(-1).id, 13);
});

test("full history serializes timestamps and groups newest entries first", () => {
  let history = appendFullHistory([], water, "2026-07-18T10:00:00.000Z");
  history = appendFullHistory(history, mouse, "2026-07-19T11:00:00.000Z");
  history = appendFullHistory(history, fire, "2026-07-19T12:00:00.000Z");

  const groups = groupFullHistoryByDay(history);
  assert.equal(groups[0].day, "2026-07-19");
  assert.deepEqual(groups[0].entries.map((entry) => entry.id), [3, 2]);
  assert.equal(groups[1].day, "2026-07-18");
});

test("malformed restored history is ignored without throwing", () => {
  const valid = { id: 1, symbol: "water", timestamp: "2026-07-19T10:00:00.000Z" };
  assert.deepEqual(normalizeFullHistory([valid, null, { id: "bad" }]), [valid]);
  assert.deepEqual(normalizeFullHistory({}), []);
  assert.deepEqual(normalizeFullHistory(null), []);
});
