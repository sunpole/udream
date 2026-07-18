// @ts-check

export const DEFAULT_DATABASE_PATHS = [
  "/udream/data/divinity_code_ru.json",
  "data/divinity_code_ru.json",
  "../data/divinity_code_ru.json",
];

/**
 * @typedef {Object} LoadedDatabase
 * @property {unknown[]} records
 * @property {string} name
 * @property {string} source
 */

/**
 * Preserve the current runtime contract: a database is usable when it is a
 * non-empty JSON array. Detailed record validation remains a repository check.
 *
 * @param {unknown} value
 * @returns {value is unknown[]}
 */
export function isUsableDatabase(value) {
  return Array.isArray(value) && value.length > 0;
}

/**
 * @param {string} source
 * @param {string} name
 * @returns {LoadedDatabase}
 */
export function parseDatabaseText(source, name) {
  const records = JSON.parse(source);
  if (!isUsableDatabase(records)) {
    throw new Error("Database must be a non-empty JSON array");
  }
  return { records, name, source: name };
}

/**
 * Try paths in order and return the first usable database.
 *
 * @param {{
 *   paths?: string[],
 *   fetchImpl?: typeof fetch
 * }=} options
 * @returns {Promise<LoadedDatabase | null>}
 */
export async function loadFirstAvailableDatabase(options = {}) {
  const paths = options.paths || DEFAULT_DATABASE_PATHS;
  const fetchImpl = options.fetchImpl || globalThis.fetch;

  for (const source of paths) {
    try {
      const response = await fetchImpl(source);
      if (!response.ok) continue;

      const records = await response.json();
      if (!isUsableDatabase(records)) continue;

      return {
        records,
        name: source.split("/").pop() || "database.json",
        source,
      };
    } catch {
      // Preserve the existing fallback behavior and try the next path.
    }
  }

  return null;
}
