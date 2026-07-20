// @ts-check

/**
 * @typedef {Object} DreamRecord
 * @property {number} id
 * @property {string} symbol
 * @property {string[]=} aliases
 * @property {string=} description
 * @property {string[]=} tags
 */

/** @param {unknown} value */
export function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("ru-RU")
    .trim();
}

/**
 * @param {unknown} value
 * @param {string} query
 */
function relationScore(value, query) {
  const text = normalizeSearchText(value);
  if (!text || !query) return Number.POSITIVE_INFINITY;
  if (text === query) return 0;
  if (text.startsWith(query)) return 1;
  if (text.includes(query)) return 2;
  return Number.POSITIVE_INFINITY;
}

/**
 * @param {unknown} values
 * @param {string} query
 */
function arrayRelationScore(values, query) {
  if (!Array.isArray(values)) return Number.POSITIVE_INFINITY;
  return Math.min(...values.map((value) => relationScore(value, query)));
}

/**
 * @param {number} relation
 * @param {[number, number, number]} weights
 */
function weightedScore(relation, weights) {
  if (!Number.isFinite(relation)) return Number.POSITIVE_INFINITY;
  return weights[relation];
}

/**
 * Prefer a primary dictionary card over parenthetical variants and short
 * cross-reference records such as "Aqua ... see Water".
 *
 * @param {DreamRecord} item
 */
function canonicalAliasPenalty(item) {
  const symbol = String(item.symbol ?? "").trim();
  const description = String(item.description ?? "").trim();

  let penalty = 0;

  if (/[()[\]{}]/.test(symbol)) penalty += 20;
  if (symbol.split(/\s+/).filter(Boolean).length > 1) penalty += 10;

  const looksLikeShortReference =
    description.length > 0
    && description.length <= 180
    && /(?:^|[\s,;:])(?:see|см\.)\s/iu.test(description);

  if (looksLikeShortReference) penalty += 100;

  return penalty;
}

/**
 * @param {number} score
 * @param {number} penalty
 */
function addFinitePenalty(score, penalty) {
  return Number.isFinite(score) ? score + penalty : score;
}

/**
 * Strictly checks only fields selected by the current filter.
 *
 * @param {DreamRecord} item
 * @param {string} query
 * @param {string} mode
 * @param {"startsWith" | "includes"} operation
 */
function fieldMatches(item, query, mode, operation) {
  const q = normalizeSearchText(query);
  if (!q) return false;

  const textMatches = (value) => {
    const text = normalizeSearchText(value);
    return Boolean(text) && text[operation](q);
  };

  const arrayMatches = (values) =>
    Array.isArray(values) && values.some(textMatches);

  if (mode === "symbol") return textMatches(item.symbol);
  if (mode === "aliases") return arrayMatches(item.aliases);
  if (mode === "desc") return textMatches(item.description);
  if (mode === "tags") return arrayMatches(item.tags);

  if (mode === "all") {
    return textMatches(item.symbol)
      || arrayMatches(item.aliases)
      || textMatches(item.description)
      || arrayMatches(item.tags);
  }

  return false;
}

/** @param {DreamRecord} item @param {string} query @param {string} mode */
export function matchesAutocomplete(item, query, mode) {
  return fieldMatches(item, query, mode, "startsWith");
}

/** @param {DreamRecord} item @param {string} query @param {string} mode */
export function matchesSearch(item, query, mode) {
  return fieldMatches(item, query, mode, "includes");
}

/**
 * Lower score means a closer match.
 * In all-fields mode, symbol proximity has priority over aliases.
 *
 * @param {DreamRecord} item
 * @param {string} query
 * @param {string} mode
 */
export function getSearchScore(item, query, mode) {
  const q = normalizeSearchText(query);
  if (!q) return Number.POSITIVE_INFINITY;

  const symbol = relationScore(item.symbol, q);
  const aliases = arrayRelationScore(item.aliases, q);
  const description = relationScore(item.description, q);
  const tags = arrayRelationScore(item.tags, q);
  const aliasPenalty = canonicalAliasPenalty(item);

  if (mode === "symbol") return weightedScore(symbol, [0, 10, 20]);

  if (mode === "aliases") {
    return addFinitePenalty(
      weightedScore(aliases, [0, 10, 20]),
      aliasPenalty,
    );
  }

  if (mode === "desc") return weightedScore(description, [0, 10, 20]);
  if (mode === "tags") return weightedScore(tags, [0, 10, 20]);

  if (mode === "all") {
    return Math.min(
      weightedScore(symbol, [0, 10, 20]),
      addFinitePenalty(
        weightedScore(aliases, [30, 40, 50]),
        aliasPenalty,
      ),
      weightedScore(tags, [60, 70, 80]),
      weightedScore(description, [90, 100, 110]),
    );
  }

  return Number.POSITIVE_INFINITY;
}

/**
 * @param {DreamRecord[]} records
 * @param {string} query
 * @param {string} mode
 * @param {boolean} autocomplete
 */
function rankRecords(records, query, mode, autocomplete) {
  const predicate = autocomplete ? matchesAutocomplete : matchesSearch;

  return records
    .map((record, index) => ({
      record,
      index,
      score: getSearchScore(record, query, mode),
    }))
    .filter(({ record, score }) =>
      Number.isFinite(score) && predicate(record, query, mode)
    )
    .sort((left, right) =>
      left.score - right.score
      || normalizeSearchText(left.record.symbol).localeCompare(
        normalizeSearchText(right.record.symbol),
        "ru",
      )
      || left.index - right.index
    )
    .map(({ record }) => record);
}

/** @param {DreamRecord[]} records @param {string} query @param {string} mode */
export function rankAutocompleteResults(records, query, mode) {
  return rankRecords(records, query, mode, true);
}

/** @param {DreamRecord[]} records @param {string} query @param {string} mode */
export function rankSearchResults(records, query, mode) {
  return rankRecords(records, query, mode, false);
}

/**
 * One result opens directly.
 * An exact alias also opens its owning card when no exact symbol exists.
 * An exact symbol with additional related matches keeps the ranked list visible.
 *
 * @param {DreamRecord[]} records
 * @param {string} query
 * @param {string} mode
 */
export function findDirectSearchResult(records, query, mode) {
  if (records.length === 1) return records[0];

  const q = normalizeSearchText(query);

  if (mode === "symbol" || mode === "all") {
    const exactSymbol = records.find(
      (record) => normalizeSearchText(record.symbol) === q
    );

    if (exactSymbol) return null;
  }

  if (mode === "aliases" || mode === "all") {
    return records.find((record) =>
      Array.isArray(record.aliases)
      && record.aliases.some((alias) => normalizeSearchText(alias) === q)
    ) ?? null;
  }

  return null;
}
