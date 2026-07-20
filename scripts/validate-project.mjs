#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const EXPECTED_ACTIVE_RECORDS = 4086;

function fail(message) {
  throw new Error(message);
}

async function requireFile(relativePath) {
  await access(path.join(ROOT, relativePath));
}

async function readJson(relativePath) {
  const source = await readFile(path.join(ROOT, relativePath), "utf8");
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`${relativePath}: invalid JSON (${error.message})`);
  }
}

function parseFrontMatter(source, label) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) fail(`${label}: YAML front matter is missing`);

  const frontMatter = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("-")) continue;
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    frontMatter[key] = value;
  }
  return frontMatter;
}

async function validateRuntimeFiles() {
  const required = [
    ".nojekyll",
    "index.html",
    "script.js",
    "src/search.js",
    "src/data.js",
    "src/state.js",
    "src/history.js",
    "src/i18n.js",
    "src/presentation.js",
    "src/pwa.js",
    "src/storage.js",
    "package.json",
    "manifest.json",
    "sw.js",
    "favicon.svg",
    "icon-192.png",
    "icon-512.png",
    "apple-touch-icon.png",
    "preview.jpg",
    "versions/index.html",
    "versions/v3.0.0/index.html",
    "versions/v3.0.0/script.js",
    "versions/v3.0.0/manifest.json",
    "versions/v3.0.0/sw.js",
    "versions/v3.0.0/data/divinity_code_ru.json",
  ];
  await Promise.all(required.map(requireFile));
  await readJson("manifest.json");
  await readJson("versions/v3.0.0/manifest.json");
}

async function validateDatabase() {
  const records = await readJson("data/divinity_code_ru.json");
  if (!Array.isArray(records)) fail("Active database must be a JSON array");
  if (records.length !== EXPECTED_ACTIVE_RECORDS) {
    fail(`Active database count changed: expected ${EXPECTED_ACTIVE_RECORDS}, got ${records.length}`);
  }

  const ids = new Set();
  for (const [index, record] of records.entries()) {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      fail(`Record ${index}: expected an object`);
    }
    if (!Number.isInteger(record.id)) fail(`Record ${index}: id must be an integer`);
    if (ids.has(record.id)) fail(`Duplicate record id: ${record.id}`);
    ids.add(record.id);
    if (typeof record.symbol !== "string" || !record.symbol.trim()) {
      fail(`Record ${record.id}: symbol must be a non-empty string`);
    }
    if (!Array.isArray(record.aliases)) fail(`Record ${record.id}: aliases must be an array`);
    if (typeof record.description !== "string") fail(`Record ${record.id}: description must be a string`);
    if (typeof record.source !== "string") fail(`Record ${record.id}: source must be a string`);
    if (!Array.isArray(record.tags)) fail(`Record ${record.id}: tags must be an array`);
  }
  return records.length;
}

async function validatePatchnotes() {
  const newsDir = path.join(ROOT, "news");
  const names = (await readdir(newsDir)).filter((name) => name.endsWith(".md")).sort();
  if (names.length === 0) fail("news/: at least one patchnote is required");

  const namePattern = /^\d{4}-\d{2}-\d{2}-udream-[a-z0-9-]+\.md$/;
  const requiredFields = ["type", "project", "series", "title", "version", "image"];
  const secretRisk = /\b(?:TELEGRAM_BOT_TOKEN|BOT_TOKEN|DEEPSEEK_API_KEY)\b|\b\d{6,}:[A-Za-z0-9_-]{20,}\b/i;

  for (const name of names) {
    if (!namePattern.test(name)) fail(`${name}: invalid patchnote filename`);
    const source = await readFile(path.join(newsDir, name), "utf8");
    const frontMatter = parseFrontMatter(source, name);
    for (const field of requiredFields) {
      if (!frontMatter[field]) fail(`${name}: missing required field ${field}`);
    }
    if (frontMatter.project !== "uDream") fail(`${name}: project must be uDream`);
    if (frontMatter.series !== "udream") fail(`${name}: series must be udream`);
    if (!frontMatter.web_url && !frontMatter.repo_url) {
      fail(`${name}: web_url or repo_url is required`);
    }
    if (secretRisk.test(source)) fail(`${name}: secret-like text detected`);
    await requireFile(path.posix.join("news", frontMatter.image));
  }
  return names.length;
}

async function main() {
  await validateRuntimeFiles();
  const recordCount = await validateDatabase();
  const patchnoteCount = await validatePatchnotes();
  console.log(`uDream validation passed: ${recordCount} records, ${patchnoteCount} patchnote(s).`);
}

main().catch((error) => {
  console.error(`Validation failed: ${error.message}`);
  process.exit(1);
});
