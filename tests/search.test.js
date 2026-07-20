import test from "node:test";
import assert from "node:assert/strict";

import {
  findDirectSearchResult,
  matchesAutocomplete,
  matchesSearch,
  rankAutocompleteResults,
  rankSearchResults,
} from "../src/search.js";

const water = {
  id: 1,
  symbol: "Water",
  aliases: ["Clear Water", "Вода"],
  description: "The Holy Spirit and cleansing",
  tags: ["elements", "spiritual"],
};

const waterHot = {
  id: 2,
  symbol: "Water (hot)",
  aliases: [],
  description: "Heat",
  tags: ["water"],
};

const waterfall = {
  id: 3,
  symbol: "Waterfall",
  aliases: [],
  description: "Flow",
  tags: ["water"],
};

const aqua = {
  id: 4,
  symbol: "Aqua",
  aliases: ["Water", "Вода"],
  description: 'As aqua is Latin for "water," see Water.',
  tags: ["colors"],
};

test("autocomplete uses strict case-insensitive prefix matching", () => {
  assert.equal(matchesAutocomplete(water, "wat", "symbol"), true);
  assert.equal(matchesAutocomplete(water, "clear", "symbol"), false);
  assert.equal(matchesAutocomplete(water, "clear", "aliases"), true);
  assert.equal(matchesAutocomplete(water, "вода", "all"), true);
  assert.equal(matchesAutocomplete(water, "ater", "all"), false);
});

test("submitted search uses substring matching", () => {
  assert.equal(matchesSearch(water, "ater", "symbol"), true);
  assert.equal(matchesSearch(water, "lear wat", "aliases"), true);
});

test("filter modes search only their declared fields", () => {
  assert.equal(matchesSearch(water, "вода", "symbol"), false);
  assert.equal(matchesSearch(water, "вода", "aliases"), true);
  assert.equal(matchesSearch(water, "cleansing", "desc"), true);
  assert.equal(matchesSearch(water, "spiritual", "tags"), true);
  assert.equal(matchesSearch(water, "cleansing", "tags"), false);
});

test("all mode searches every supported field", () => {
  assert.equal(matchesSearch(water, "вода", "all"), true);
  assert.equal(matchesSearch(water, "holy", "all"), true);
  assert.equal(matchesAutocomplete(water, "elem", "all"), true);
});

test("search ranking keeps the closest symbol names before alias-only matches", () => {
  const records = [aqua, waterfall, waterHot, water];

  assert.deepEqual(
    rankSearchResults(records, "water", "all").map((item) => item.symbol),
    ["Water", "Water (hot)", "Waterfall", "Aqua"],
  );

  assert.deepEqual(
    rankAutocompleteResults(records, "water", "all").map((item) => item.symbol),
    ["Water", "Water (hot)", "Waterfall", "Aqua"],
  );
});

test("an exact Russian alias prefers the primary card over a short redirect", () => {
  const records = rankSearchResults([aqua, water], "вода", "all");

  assert.deepEqual(
    records.map((item) => item.symbol),
    ["Water", "Aqua"],
  );

  assert.equal(findDirectSearchResult(records, "вода", "all"), water);
});

test("an exact symbol with related matches keeps the ranked result list", () => {
  const records = rankSearchResults(
    [aqua, waterfall, waterHot, water],
    "water",
    "all",
  );

  assert.equal(findDirectSearchResult(records, "water", "all"), null);
});

test("missing optional fields and unknown modes remain safe", () => {
  const minimal = { id: 5, symbol: "Stone" };

  assert.equal(matchesSearch(minimal, "stone", "symbol"), true);
  assert.equal(matchesSearch(minimal, "anything", "all"), false);
  assert.equal(matchesAutocomplete(minimal, "anything", "aliases"), false);
  assert.equal(matchesAutocomplete(water, "water", "unknown"), false);
  assert.equal(matchesSearch(water, "water", "unknown"), false);
});
