import test from "node:test";
import assert from "node:assert/strict";

import { matchesAutocomplete, matchesSearch } from "../src/search.js";

const water = {
  id: 1,
  symbol: "Water",
  aliases: ["Clear Water", "Вода"],
  description: "The Holy Spirit and cleansing",
  tags: ["elements", "spiritual"],
};

test("autocomplete uses case-insensitive prefix matching", () => {
  assert.equal(matchesAutocomplete(water, "wat", "symbol"), true);
  assert.equal(matchesAutocomplete(water, "clear", "symbol"), true);
  assert.equal(matchesAutocomplete(water, "ater", "symbol"), false);
});

test("submitted search uses substring matching", () => {
  assert.equal(matchesSearch(water, "ater", "symbol"), true);
  assert.equal(matchesSearch(water, "lear wat", "aliases"), true);
});

test("description and tag modes remain isolated", () => {
  assert.equal(matchesSearch(water, "spirit", "desc"), true);
  assert.equal(matchesSearch(water, "spirit", "tags"), true);
  assert.equal(matchesSearch(water, "cleansing", "tags"), false);
});

test("all mode searches every supported field", () => {
  assert.equal(matchesSearch(water, "вода", "all"), true);
  assert.equal(matchesSearch(water, "holy", "all"), true);
  assert.equal(matchesAutocomplete(water, "elem", "all"), true);
});

test("missing optional fields do not throw", () => {
  const minimal = { id: 2, symbol: "Stone" };
  assert.equal(matchesSearch(minimal, "stone", "symbol"), true);
  assert.equal(matchesSearch(minimal, "anything", "all"), false);
  assert.equal(matchesAutocomplete(minimal, "anything", "aliases"), false);
});

test("unknown autocomplete mode does not match", () => {
  assert.equal(matchesAutocomplete(water, "water", "unknown"), false);
});
