// @ts-check

/**
 * @typedef {{ id: number, symbol: string }} NavigationEntry
 * @typedef {{ id: number, symbol: string, timestamp: string }} FullHistoryEntry
 */

/**
 * Add a viewed record after the current navigation position and discard the
 * forward branch, matching ordinary browser-history behavior.
 *
 * @param {NavigationEntry[]} stack
 * @param {number} index
 * @param {{ id: number, symbol: string }} record
 */
export function appendNavigationHistory(stack, index, record) {
  const nextStack = stack.slice(0, index + 1);
  nextStack.push({ symbol: record.symbol, id: record.id });
  return { stack: nextStack, index: nextStack.length - 1 };
}

/**
 * @param {NavigationEntry[]} stack
 * @param {number} index
 * @param {-1 | 1} direction
 */
export function moveNavigationHistory(stack, index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= stack.length) {
    return { index, entry: null };
  }
  return { index: nextIndex, entry: stack[nextIndex] };
}

/**
 * @param {NavigationEntry[]} stack
 * @param {number} index
 * @param {number=} limit
 */
export function getBreadcrumbWindow(stack, index, limit = 10) {
  const start = Math.max(0, index - Math.max(1, limit) + 1);
  return {
    start,
    items: stack.slice(start, index + 1),
  };
}

/**
 * @param {FullHistoryEntry[]} history
 * @param {{ id: number, symbol: string }} record
 * @param {string=} timestamp
 * @returns {FullHistoryEntry[]}
 */
export function appendFullHistory(history, record, timestamp = new Date().toISOString()) {
  return [
    ...history,
    { symbol: record.symbol, id: record.id, timestamp },
  ];
}

/**
 * Ignore malformed or partially written local history instead of preventing
 * the whole application from starting.
 *
 * @param {unknown} value
 * @returns {FullHistoryEntry[]}
 */
export function normalizeFullHistory(value) {
  if (!Array.isArray(value)) return [];

  return value.filter((entry) => (
    entry !== null
    && typeof entry === "object"
    && typeof entry.id === "number"
    && Number.isFinite(entry.id)
    && typeof entry.symbol === "string"
    && typeof entry.timestamp === "string"
    && !Number.isNaN(Date.parse(entry.timestamp))
  ));
}

/**
 * @param {FullHistoryEntry[]} history
 * @returns {{ day: string, entries: FullHistoryEntry[] }[]}
 */
export function groupFullHistoryByDay(history) {
  /** @type {Map<string, FullHistoryEntry[]>} */
  const groups = new Map();

  history.slice().reverse().forEach((entry) => {
    const day = entry.timestamp.slice(0, 10);
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)?.push(entry);
  });

  return Array.from(groups, ([day, entries]) => ({ day, entries }));
}
