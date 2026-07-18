import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAutocompleteHtml,
  buildBreadcrumbsHtml,
  buildRecordCardHtml,
  buildShareFileName,
  buildShareImageHtml,
  buildStatsHtml,
  buildTagCloudHtml,
  buildWordListHtml,
  escapeHtml,
  formatDescription,
  renderSafeNotesHtml,
} from "../src/presentation.js";

const hostileRecord = {
  id: '3" onmouseover="alert(1)',
  symbol: '<img src=x onerror="alert(1)">',
  aliases: ['safe', '" onclick="alert(2)'],
  description: "A & B < C",
  source: '<script>alert(3)</script>',
  date_added: '2026-01-01" onmouseover="x',
  tags: ["animals", "'><svg/onload=alert(4)>"],
  notes: '<script>alert(5)</script> [click](javascript:alert(6))',
};

test("HTML escaping covers text and both attribute quote types", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
});

test("record cards render hostile imported JSON as inert text", () => {
  const html = buildRecordCardHtml(hostileRecord, "en");

  assert.doesNotMatch(html, /<script[\s>]|<svg[\s/>]|<img[\s/>]/i);
  assert.doesNotMatch(html, /data-(?:symbol|tag)="[^"]*"\s+on/i);
  assert.match(html, /&lt;script&gt;alert\(5\)&lt;\/script&gt;/);
  assert.match(html, /data-symbol="&quot; onclick=&quot;alert\(2\)"/);
});

test("notes preserve paragraphs and line breaks without interpreting Markdown or HTML", () => {
  const html = renderSafeNotesHtml("first\nsecond\n\n<b>third</b>");

  assert.equal(html, "<p>first<br>second</p><p>&lt;b&gt;third&lt;/b&gt;</p>");
});

test("short-word formatting escapes source text before adding controlled spans", () => {
  const html = formatDescription("A & B < test");

  assert.match(html, /A<\/span> &amp; <span/);
  assert.match(html, /&lt;/);
  assert.doesNotMatch(html, /&<span/);
});

test("all list, attribute and stats builders escape imported values", () => {
  const listRecord = [{ id: '1" onclick="x', symbol: "<bad>" }];
  const joined = [
    buildWordListHtml(listRecord, "<title>"),
    buildAutocompleteHtml(listRecord),
    buildBreadcrumbsHtml(listRecord, 0, 0),
    buildTagCloudHtml([{ tag: '" onmouseover="x', count: "<2>" }], "alpha"),
    buildStatsHtml({ name: '<db onload="x">', count: 1, size: "1 KB", chars: 2 }, "en"),
  ].join("\n");

  assert.doesNotMatch(joined, /<bad>|<title>|data-(?:id|tag)="[^"]*"\s+on/i);
  assert.match(joined, /&lt;bad&gt;/);
  assert.match(joined, /&quot; onclick=&quot;x/);
});

test("share-image builder uses the same safe presentation boundary", () => {
  const html = buildShareImageHtml(hostileRecord, "ru");

  assert.doesNotMatch(html, /<script[\s>]|<svg[\s/>]|<img[\s/>]/i);
  assert.match(html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);
  assert.match(html, /&lt;script&gt;alert\(5\)&lt;\/script&gt;/);
});

test("shared image file names cannot contain path or control characters", () => {
  assert.equal(buildShareFileName('../Mouse:\\bad?\u0000'), "..-Mouse--bad--.jpg");
  assert.equal(buildShareFileName(""), "symbol.jpg");
});
