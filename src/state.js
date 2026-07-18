// @ts-check

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
    theme: storage.getItem("clientTheme") || "light",
    lang: storage.getItem("clientLang") || "ru",
    historyStack: [],
    historyIndex: -1,
    lastDisplayedRecord: null,
    dbLoaded: false,
    currentDbName: "divinity_code_ru.json",
    fullHistory: JSON.parse(storage.getItem("fullHistory") || "[]"),
    showLatin: storage.getItem("showLatin") === "true",
    showCyrillic: storage.getItem("showCyrillic") === "true",
    showDigits: storage.getItem("showDigits") === "true",
    showBreadcrumbs: storage.getItem("showBreadcrumbs") !== "false",
    showTagsCloud: storage.getItem("showTagsCloud") === "true",
    showHistoryBlock: storage.getItem("showHistoryBlock") === "true",
    allowSelection: storage.getItem("allowSelection") === "true",
    wideScrollbar: storage.getItem("wideScrollbar") === "true",
    tagSortMode: storage.getItem("tagSortMode") || "alpha",
    instructionVisible: true,
  };
}
