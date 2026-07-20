import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  APP_TITLE,
  APP_VERSION,
  APP_VERSION_LABEL,
} from "../src/version.js";

test("runtime version is consistent across visible and PWA files", () => {
  const indexHtml = fs.readFileSync("index.html", "utf8");
  const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const publishedVersion = JSON.parse(fs.readFileSync("version.json", "utf8"));
  const serviceWorker = fs.readFileSync("sw.js", "utf8");
  const shortVersion = APP_VERSION.split(".").slice(0, 2).join(".");

  assert.equal(packageJson.version, APP_VERSION);
  assert.equal(publishedVersion.version, APP_VERSION);
  assert.ok(indexHtml.includes("data-app-version"));
  assert.ok(indexHtml.includes('type="module" src="script.js"'));
  assert.ok(manifest.name.includes(APP_VERSION_LABEL));
  assert.ok(manifest.short_name.includes(shortVersion));
  assert.ok(serviceWorker.includes(`APP_VERSION = "${APP_VERSION}"`));
  assert.ok(serviceWorker.includes("/udream/src/version.js"));
  assert.equal(APP_TITLE, `UDREAM — христианский сонник ${APP_VERSION_LABEL}`);
});

test("search is submitted through a form for desktop and mobile Enter", () => {
  const indexHtml = fs.readFileSync("index.html", "utf8");
  const script = fs.readFileSync("script.js", "utf8");

  assert.match(indexHtml, /<form id="searchForm" class="search-field">/);

  assert.ok(
    indexHtml.indexOf('id="searchOptions"')
      < indexHtml.indexOf('id="searchForm"'),
    "search filters must remain above the expanding autocomplete field",
  );

  assert.match(indexHtml, /enterkeyhint="search"/);
  assert.match(indexHtml, /type="submit" id="searchBtn"/);
  assert.match(script, /searchForm\.addEventListener\("submit"/);
});
