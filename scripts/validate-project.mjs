#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const EXPECTED_ACTIVE_RECORDS = 4086;
const SCREENSHOT_METADATA_VERSION = [23, 8, 6];

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
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    frontMatter[key] = value;
  }
  return frontMatter;
}

function parseVersion(value) {
  const match = String(value || "").match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return match.slice(1).map(Number);
}

function versionAtLeast(value, minimum) {
  const parsed = parseVersion(value);
  if (!parsed) return false;

  for (let index = 0; index < minimum.length; index += 1) {
    if (parsed[index] > minimum[index]) return true;
    if (parsed[index] < minimum[index]) return false;
  }
  return true;
}

function isPng(buffer) {
  return buffer.length >= 8
    && buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
}

function isJpeg(buffer) {
  return buffer.length >= 4
    && buffer[0] === 0xff
    && buffer[1] === 0xd8
    && buffer[buffer.length - 2] === 0xff
    && buffer[buffer.length - 1] === 0xd9;
}

async function validateRuntimeFiles() {
  const required = [
    ".nojekyll",
    "WORK_STATUS.md",
    "index.html",
    "script.js",
    "src/search.js",
    "src/version.js",
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
    "docs/AI_GITHUB_WORKFLOW.md",
    "docs/SCREENSHOT_AUTOMATION.md",
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

async function validateWorkStatus() {
  const source = await readFile(path.join(ROOT, "WORK_STATUS.md"), "utf8");

  const statusMatches = [...source.matchAll(
    /\| Состояние \| \*\*(READY|IN_PROGRESS|PAUSED|BLOCKED|COMPLETED)\*\*/g,
  )];

  if (statusMatches.length !== 1) {
    fail("WORK_STATUS.md must contain exactly one quick-signal status");
  }

  const status = statusMatches[0][1];
  const branchMatch = source.match(/\| Рабочая ветка \| `([^`]+)` \|/);
  const prMatch = source.match(/\| Открытый Pull Request \| ([^|]+) \|/);

  if (!branchMatch) fail("WORK_STATUS.md: working branch is missing");
  if (!prMatch) fail("WORK_STATUS.md: Pull Request field is missing");
  if (!source.includes("Следующий точный шаг")) {
    fail("WORK_STATUS.md: exact next step section is missing");
  }
  if (!source.includes("GitHub")) {
    fail("WORK_STATUS.md: GitHub source-of-truth rule is missing");
  }

  const branch = branchMatch[1].trim();
  const pullRequest = prMatch[1].trim();

  if (status === "READY") {
    if (branch !== "main") {
      fail("WORK_STATUS.md: READY status requires working branch main");
    }
    if (pullRequest !== "нет") {
      fail("WORK_STATUS.md: READY status requires no open Pull Request");
    }
  } else if (branch === "main") {
    fail(`WORK_STATUS.md: ${status} status requires a dedicated branch`);
  }

  if (["IN_PROGRESS", "PAUSED", "BLOCKED"].includes(status)) {
    for (const requiredText of [
      "Цель:",
      "Планируемые файлы:",
      "Критерии завершения:",
      "Последний проверенный commit:",
    ]) {
      if (!source.includes(requiredText)) {
        fail(`WORK_STATUS.md: ${requiredText} is required for ${status}`);
      }
    }
  }

  return status;
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

async function validatePatchnoteImage(name, frontMatter) {
  const imageName = frontMatter.image;
  if (
    path.basename(imageName) !== imageName
    || !/^[a-z0-9][a-z0-9.-]*\.(?:png|jpe?g)$/i.test(imageName)
  ) {
    fail(`${name}: image must be a safe PNG/JPEG filename`);
  }

  const imagePath = path.join(ROOT, "news", imageName);
  const image = await readFile(imagePath);
  const extension = path.extname(imageName).toLowerCase();

  if (extension === ".png" && !isPng(image)) {
    fail(`${name}: image has an invalid PNG signature`);
  }
  if ([".jpg", ".jpeg"].includes(extension) && !isJpeg(image)) {
    fail(`${name}: image has an invalid JPEG signature`);
  }
}

async function validatePatchnotes() {
  const newsDir = path.join(ROOT, "news");
  const names = (await readdir(newsDir)).filter((name) => name.endsWith(".md")).sort();
  if (names.length === 0) fail("news/: at least one patchnote is required");

  const namePattern = /^\d{4}-\d{2}-\d{2}-udream-[a-z0-9-]+\.md$/;
  const requiredFields = ["type", "project", "series", "title", "version", "image"];
  const screenshotFields = [
    "image_source",
    "image_target",
    "image_commit",
    "image_captured_at",
  ];
  const screenshotSources = new Set([
    "playwright",
    "manual-browser",
    "github-ui",
    "document-render",
  ]);
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

    const requiresScreenshotMetadata = versionAtLeast(
      frontMatter.version,
      SCREENSHOT_METADATA_VERSION,
    );

    if (requiresScreenshotMetadata) {
      await validatePatchnoteImage(name, frontMatter);

      for (const field of screenshotFields) {
        if (!frontMatter[field]) {
          fail(`${name}: missing required screenshot field ${field}`);
        }
      }
      if (!screenshotSources.has(frontMatter.image_source)) {
        fail(`${name}: unsupported image_source ${frontMatter.image_source}`);
      }
      if (!/^[a-f0-9]{7,40}$/i.test(frontMatter.image_commit)) {
        fail(`${name}: image_commit must be a Git commit SHA`);
      }
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(frontMatter.image_captured_at)) {
        fail(`${name}: image_captured_at must use YYYY-MM-DDTHH:MM:SSZ`);
      }
    } else {
      // Historical patchnotes remain immutable. Confirm their declared asset
      // still exists, but apply the stricter signature/provenance contract
      // only to patchnotes created under version 23.8.6 or newer.
      await requireFile(path.posix.join("news", frontMatter.image));
    }
  }
  return names.length;
}

async function main() {
  await validateRuntimeFiles();
  const workStatus = await validateWorkStatus();
  const recordCount = await validateDatabase();
  const patchnoteCount = await validatePatchnotes();
  console.log(`WORK_STATUS passed: ${workStatus}.`);
  console.log(`uDream validation passed: ${recordCount} records, ${patchnoteCount} patchnote(s).`);
}

main().catch((error) => {
  console.error(`Validation failed: ${error.message}`);
  process.exit(1);
});
