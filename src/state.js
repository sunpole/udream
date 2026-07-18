// @ts-check

import { normalizeFullHistory } from "./history.js";
import { readBoolean, readJson, readString } from "./storage.js";

/**
 * @typedef {{ getItem(key: string): string | null }} StorageReader
 */

/**
 * Build the initial browser state without owning later UI mutations.
 * Persistence updates remain in script.js until the dedicated M3 step.
 *
 * @param {StorageReader} storage
 */
export function createInitialState(storage) {
  return {
    db: [],
    currentMode: "symbol",
    theme: readString(storage, "clientTheme", "light"),
    lang: readString(storage, "clientLang", "ru"),
    historyStack: [],
    historyIndex: -1,
    lastDisplayedRecord: null,
    dbLoaded: false,
    currentDbName: "divinity_code_ru.json",
    fullHistory: normalizeFullHistory(readJson(storage, "fullHistory", [])),
    showLatin: readBoolean(storage, "showLatin"),
    showCyrillic: readBoolean(storage, "showCyrillic"),
    showDigits: readBoolean(storage, "showDigits"),
    showBreadcrumbs: readBoolean(storage, "showBreadcrumbs", true),
    showTagsCloud: readBoolean(storage, "showTagsCloud"),
    showHistoryBlock: readBoolean(storage, "showHistoryBlock"),
    allowSelection: readBoolean(storage, "allowSelection"),
    wideScrollbar: readBoolean(storage, "wideScrollbar"),
    tagSortMode: readString(storage, "tagSortMode", "alpha"),
    instructionVisible: true,
  };
}
