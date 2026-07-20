// @ts-check

import { translate } from "./i18n.js";

/** @param {unknown} value */
export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

/** @param {unknown} value */
export function formatDescription(value) {
  const text = String(value ?? "");
  const pattern = /\b[A-Za-z0-9_]{1,4}\b/g;
  let html = "";
  let index = 0;
  for (const match of text.matchAll(pattern)) {
    const position = match.index ?? 0;
    html += escapeHtml(text.slice(index, position));
    html += `<span style="white-space:nowrap;">${escapeHtml(match[0])}</span>`;
    index = position + match[0].length;
  }
  return html + escapeHtml(text.slice(index));
}

/** @param {unknown} value */
export function renderSafeNotesHtml(value) {
  const text = String(value ?? "").replace(/\r\n?/g, "\n").trim();
  if (!text) return "";
  return text.split(/\n{2,}/).map((paragraph) =>
    `<p>${paragraph.split("\n").map(escapeHtml).join("<br>")}</p>`
  ).join("");
}

/** @param {{name: unknown, count: unknown, size: unknown, chars: unknown} | null} stats @param {unknown} language */
export function buildStatsHtml(stats, language) {
  if (!stats) return `<div>${escapeHtml(translate(language, "dbNotLoaded"))}</div>`;
  return [
    translate(language, "statsLine1", { name: stats.name }),
    translate(language, "statsLine2", { count: stats.count }),
    translate(language, "statsLine3", { size: stats.size }),
    translate(language, "statsLine4", { chars: stats.chars }),
  ].map((line) => `<div>${escapeHtml(line)}</div>`).join("");
}

/** @param {Array<{id: unknown, symbol: unknown}>} items @param {number} start @param {number} currentIndex */
export function buildBreadcrumbsHtml(items, start, currentIndex) {
  return items.map((item, index) =>
    `<span class="breadcrumb-item" data-id="${escapeHtml(item.id)}">${escapeHtml(item.symbol)}</span>${start + index !== currentIndex ? " → " : ""}`
  ).join("");
}

/** @param {Array<{day: unknown, entries: Array<{id: unknown, symbol: unknown, timestamp: unknown}>}>} groups */
export function buildFullHistoryHtml(groups) {
  return groups.map(({ day, entries }) => {
    const rows = entries.map((entry) => {
      const time = String(entry.timestamp ?? "").slice(11, 19);
      return `<div class="history-entry" data-id="${escapeHtml(entry.id)}">${escapeHtml(time)} — ${escapeHtml(entry.symbol)}</div>`;
    }).join("");
    return `<div class="history-day"><div class="history-day-title">${escapeHtml(day)}</div>${rows}</div>`;
  }).join("");
}

/** @param {Array<{id: unknown, symbol: unknown}>} records @param {unknown} title */
export function buildWordListHtml(records, title) {
  return `<div class="stats-header"><strong>${escapeHtml(title)}</strong><button class="eye-icon toggle-words-btn"><i class="fas fa-eye"></i></button></div>
    <div class="word-list words-list-content">${records.map((record) => `<div class="word-item" data-id="${escapeHtml(record.id)}">${escapeHtml(record.symbol)}</div>`).join("")}</div>`;
}

/** @param {Record<string, any>} record @param {unknown} language */
export function buildRecordCardHtml(record, language) {
  const aliases = Array.isArray(record.aliases) ? record.aliases : [];
  const tags = Array.isArray(record.tags) ? record.tags : [];
  const source = record.source ? `<i class="fas fa-book"></i> ${escapeHtml(record.source)}` : "";
  const date = record.date_added ? `📅 ${escapeHtml(record.date_added)}` : "";
  const aliasesHtml = aliases.length ? `<div class="aliases"><strong>🔗 ${escapeHtml(translate(language, "aliasesLabel"))}:</strong> ${aliases.map((alias) => `<span class="tag alias-tag" data-record-id="${escapeHtml(record.id)}">${escapeHtml(alias)}</span>`).join(" ")}</div>` : "";
  const tagsHtml = tags.length ? `<div class="tags"><strong>🏷️ ${escapeHtml(translate(language, "tagsLabel"))}:</strong> ${tags.map((tag) => `<span class="tag tag-filter" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</span>`).join(" ")}</div>` : "";
  const notes = renderSafeNotesHtml(record.notes);
  const notesHtml = notes ? `<div class="notes"><b>📝 ${escapeHtml(translate(language, "notesLabel"))}:</b><br>${notes}</div>` : "";
  return `<div class="symbol-name">${escapeHtml(record.symbol)}</div>
    <div class="meta">${source} ${date}</div>
    ${aliasesHtml}
    <div class="desc">${formatDescription(record.description)}</div>
    ${tagsHtml}
    ${notesHtml}
    <div class="share-buttons">
      <button class="share-btn share-text-btn"><i class="fas fa-share-alt"></i> ${escapeHtml(translate(language, "shareText"))}</button>
      <button class="share-btn share-image-btn"><i class="fas fa-image"></i> ${escapeHtml(translate(language, "shareImage"))}</button>
    </div>`;
}

/** @param {Record<string, any>} record @param {unknown} language */
export function buildShareText(record, language) {
  const aliases = Array.isArray(record.aliases) ? record.aliases.join(", ") : "";
  const tags = Array.isArray(record.tags) ? record.tags.join(", ") : "";
  return [
    `${translate(language, "shareSymbol")}: ${String(record.symbol ?? "")}`,
    `${translate(language, "shareSource")}: ${String(record.source ?? "-")}`,
    `${translate(language, "shareDate")}: ${String(record.date_added ?? "-")}`,
    `${translate(language, "shareDescription")}: ${String(record.description ?? "")}`,
    aliases ? `${translate(language, "aliasesLabel")}: ${aliases}` : "",
    tags ? `${translate(language, "tagsLabel")}: ${tags}` : "",
    record.notes ? `${translate(language, "notesLabel")}: ${String(record.notes)}` : "",
  ].filter(Boolean).join("\n");
}

/** @param {Record<string, any>} record @param {unknown} language */
export function buildShareImageHtml(record, language) {
  const aliases = Array.isArray(record.aliases) ? record.aliases : [];
  const tags = Array.isArray(record.tags) ? record.tags : [];
  return `<h1 style="font-size:24px;margin-bottom:10px">${escapeHtml(record.symbol)}</h1>
    <p style="font-size:14px;color:#666">${record.source ? `${escapeHtml(translate(language, "shareSource"))}: ${escapeHtml(record.source)}` : ""} ${record.date_added ? `📅 ${escapeHtml(record.date_added)}` : ""}</p>
    <div style="font-size:16px;margin:10px 0;white-space:pre-wrap">${escapeHtml(record.description)}</div>
    ${aliases.length ? `<p><b>${escapeHtml(translate(language, "aliasesLabel"))}:</b> ${aliases.map(escapeHtml).join(", ")}</p>` : ""}
    ${tags.length ? `<p><b>${escapeHtml(translate(language, "tagsLabel"))}:</b> ${tags.map(escapeHtml).join(", ")}</p>` : ""}
    ${record.notes ? `<div style="font-size:14px;border-top:1px solid #ccc;margin-top:10px;padding-top:10px">${renderSafeNotesHtml(record.notes)}</div>` : ""}`;
}

/** @param {unknown} symbol */
export function buildShareFileName(symbol) {
  const base = String(symbol ?? "symbol")
    .replace(/[\\/:*?"<>|\u0000-\u001F]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  return `${base || "symbol"}.jpg`;
}

/** @param {Array<{id: unknown, symbol: unknown}>} records */
export function buildAutocompleteHtml(records) {
  return records.map((record) => `<div class="autocomplete-item" data-id="${escapeHtml(record.id)}">${escapeHtml(record.symbol)}</div>`).join("");
}

/** @param {Array<{tag: unknown, count: unknown}>} tags @param {string} sortMode */
export function buildTagCloudHtml(tags, sortMode) {
  const icon = sortMode === "alpha" ? "🔤" : "🔢";
  return `<button class="tag-sort-btn" id="toggleTagSortBtn">${icon}</button>` + tags.map(({ tag, count }) => `<span class="tag tag-cloud-item" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)} (${escapeHtml(count)})</span>`).join(" ");
}
