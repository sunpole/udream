import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("service worker activates immediately and bypasses cache for version checks", async () => {
  const source = await readFile(new URL("../sw.js", import.meta.url), "utf8");

  assert.match(source, /self\.skipWaiting\(\)/);
  assert.match(source, /self\.clients\.claim\(\)/);
  assert.match(source, /VERSION_PATH/);
  assert.match(source, /cache:\s*"no-store"/);
  assert.match(source, /client\.navigate/);
});
