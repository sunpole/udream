import test from "node:test";
import assert from "node:assert/strict";

import {
  isUsableDatabase,
  loadFirstAvailableDatabase,
  parseDatabaseText,
} from "../src/data.js";

test("usable database is a non-empty array", () => {
  assert.equal(isUsableDatabase([{ id: 1 }]), true);
  assert.equal(isUsableDatabase([]), false);
  assert.equal(isUsableDatabase({}), false);
});

test("manual JSON parser returns records and file name", () => {
  const loaded = parseDatabaseText('[{"id":1}]', "dreams.json");
  assert.deepEqual(loaded.records, [{ id: 1 }]);
  assert.equal(loaded.name, "dreams.json");
});

test("manual JSON parser rejects empty arrays", () => {
  assert.throws(() => parseDatabaseText("[]", "empty.json"), /non-empty JSON array/);
});

test("automatic loader tries paths in order", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url === "missing.json") return { ok: false, json: async () => null };
    return { ok: true, json: async () => [{ id: 7 }] };
  };

  const loaded = await loadFirstAvailableDatabase({
    paths: ["missing.json", "data/active.json"],
    fetchImpl,
  });

  assert.deepEqual(calls, ["missing.json", "data/active.json"]);
  assert.deepEqual(loaded.records, [{ id: 7 }]);
  assert.equal(loaded.name, "active.json");
  assert.equal(loaded.source, "data/active.json");
});

test("automatic loader skips invalid and failed sources", async () => {
  const fetchImpl = async (url) => {
    if (url === "network.json") throw new Error("offline");
    return { ok: true, json: async () => [] };
  };

  const loaded = await loadFirstAvailableDatabase({
    paths: ["network.json", "empty.json"],
    fetchImpl,
  });

  assert.equal(loaded, null);
});
