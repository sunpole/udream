// @ts-check

/**
 * @typedef {Object} DreamRecord
 * @property {number} id
 * @property {string} symbol
 * @property {string[]=} aliases
 * @property {string=} description
 * @property {string[]=} tags
 */

/**
 * @param {string | undefined} value
 * @returns {string}
 */
function normalized(value) {
  return (value || "").toLowerCase();
}

/**
 * @param {string[] | undefined} values
 * @param {string} query
 * @param {"startsWith" | "includes"} operation
 * @returns {boolean}
 */
function arrayMatches(values, query, operation) {
  return Array.isArray(values)
    && values.some((value) => normalized(value)[operation](query));
}

/**
 * Autocomplete intentionally uses prefix matching to preserve the current UI.
 *
 * @param {DreamRecord} item
 * @param {string} query
 * @param {string} mode
 * @returns {boolean}
 */
export function matchesAutocomplete(item, query, mode) {
  const q = normalized(query);

  if (mode === "symbol") {
    return normalized(item.symbol).startsWith(q)
      || arrayMatches(item.aliases, q, "startsWith");
  }
  if (mode === "aliases") return arrayMatches(item.aliases, q, "startsWith");
  if (mode === "desc") return normalized(item.description).startsWith(q);
  if (mode === "tags") return arrayMatches(item.tags, q, "startsWith");
  if (mode === "all") {
    return normalized(item.symbol).startsWith(q)
      || arrayMatches(item.aliases, q, "startsWith")
      || normalized(item.description).startsWith(q)
      || arrayMatches(item.tags, q, "startsWith");
  }

  return false;
}

/**
 * Submitted search intentionally uses substring matching to preserve the current UI.
 *
 * @param {DreamRecord} item
 * @param {string} query
 * @param {string} mode
 * @returns {boolean}
 */
export function matchesSearch(item, query, mode) {
  const q = normalized(query);

  if (mode === "symbol") {
    return normalized(item.symbol).includes(q)
      || arrayMatches(item.aliases, q, "includes");
  }
  if (mode === "aliases") return arrayMatches(item.aliases, q, "includes");
  if (mode === "desc") return normalized(item.description).includes(q);
  if (mode === "tags") return arrayMatches(item.tags, q, "includes");

  return normalized(item.symbol).includes(q)
    || arrayMatches(item.aliases, q, "includes")
    || normalized(item.description).includes(q)
    || arrayMatches(item.tags, q, "includes");
}
