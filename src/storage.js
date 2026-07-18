// @ts-check

/**
 * @typedef {{
 *   getItem(key: string): string | null,
 *   setItem(key: string, value: string): void,
 *   removeItem(key: string): void
 * }} StorageLike
 */

/**
 * @param {Pick<StorageLike, "getItem">} storage
 * @param {string} key
 * @param {string} fallback
 * @returns {string}
 */
export function readString(storage, key, fallback) {
  try {
    return storage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

/**
 * @param {Pick<StorageLike, "getItem">} storage
 * @param {string} key
 * @param {boolean} fallback
 * @returns {boolean}
 */
export function readBoolean(storage, key, fallback = false) {
  try {
    const value = storage.getItem(key);
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * @template T
 * @param {Pick<StorageLike, "getItem">} storage
 * @param {string} key
 * @param {T} fallback
 * @returns {unknown | T}
 */
export function readJson(storage, key, fallback) {
  try {
    const value = storage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * @param {Pick<StorageLike, "setItem">} storage
 * @param {string} key
 * @param {string} value
 */
export function writeString(storage, key, value) {
  storage.setItem(key, value);
}

/**
 * @param {Pick<StorageLike, "setItem">} storage
 * @param {string} key
 * @param {boolean} value
 */
export function writeBoolean(storage, key, value) {
  storage.setItem(key, String(value));
}

/**
 * @param {Pick<StorageLike, "setItem">} storage
 * @param {string} key
 * @param {unknown} value
 */
export function writeJson(storage, key, value) {
  storage.setItem(key, JSON.stringify(value));
}

/**
 * @param {Pick<StorageLike, "removeItem">} storage
 * @param {string} key
 */
export function removeStoredValue(storage, key) {
  storage.removeItem(key);
}
