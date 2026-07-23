#!/usr/bin/env node

import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { validateDataProvenance } from "./validate-data-provenance.mjs";
import { validateScreenshotTooling } from "./validate-screenshot-tooling.mjs";

const ROOT = process.cwd();
const EXPECTED_ACTIVE_RECORDS = 4086;
const SCREENSHOT_METADATA_VERSION = [23, 8, 6];
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const REPAIR_TYPES = new Set([
  "unpublished-invalid-image",
  "unpublished-image-upgrade",
]);
const CRC_TABLE = buildCrcTable();

function fail(message) {
  throw new Error(message);
}

function buildCrcTable() {
  const table = new Uint32Array(256);
  for (let value = 0; value < 256; value += 1) {
    let crc = value;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[value] = crc >>> 0;
  }
  return table;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
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

function isJpeg(buffer) {
  return buffer.length >= 4
    && buffer[0] === 0xff
    && buffer[1] === 0xd8
    && buffer[buffer.length - 2] === 0xff
    && buffer[buffer.length - 1] === 0xd9;
}

function validatePng(buffer, label) {
  if (buffer.length < 8 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail(`${label}: invalid PNG signature`);
  }

  let offset = 8;
  let chunkIndex = 0;
  let width = null;
  let height = null;
  let sawIdat = false;
  let sawIend = false;

  while (offset < buffer.length) {
    if (offset + 12 > buffer.length) fail(`${label}: truncated PNG chunk header`);
    const length = buffer.readUInt32BE(offset);
    const typeStart = offset + 4;
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const crcOffset = dataEnd;
    const nextOffset = crcOffset + 4;
    if (nextOffset > buffer.length) fail(`${label}: truncated PNG chunk`);

    const type = buffer.subarray(typeStart, dataStart).toString("ascii");
    if (!/^[A-Za-z]{4}$/.test(type)) fail(`${label}: invalid PNG chunk type`);
    const storedCrc = buffer.readUInt32BE(crcOffset);
    const actualCrc = crc32(buffer.subarray(typeStart, dataEnd));
    if (storedCrc !== actualCrc) fail(`${label}: PNG CRC mismatch in ${type} chunk`);

    if (chunkIndex === 0 && type !== "IHDR") fail(`${label}: PNG first chunk must be IHDR`);
    if (type === "IHDR") {
      if (chunkIndex !== 0 || length !== 13) fail(`${label}: invalid PNG IHDR`);
      width = buffer.readUInt32BE(dataStart);
      height = buffer.readUInt32BE(dataStart + 4);
      if (width < 1 || height < 1 || width > 20_000 || height > 20_000) {
        fail(`${label}: invalid PNG dimensions ${width}x${height}`);
      }
      if (Math.max(width / height, height / width) > 20) {
        fail(`${label}: PNG aspect ratio exceeds 20:1`);
      }
    } else if (type === "IDAT") {
      sawIdat = true;
    } else if (type === "IEND") {
      if (length !== 0 || nextOffset !== buffer.length) fail(`${label}: invalid PNG IEND`);
      sawIend = true;
    }

    offset = nextOffset;
    chunkIndex += 1;
    if (sawIend) break;
  }

  if (width === null || height === null || !sawIdat || !sawIend) {
    fail(`${label}: incomplete PNG structure`);
  }
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
    "docs/DATA_PROVENANCE.md",
    "docs/SCREENSHOT_AUTOMATION.md",
    "scripts/validate-data-provenance.mjs",
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
  if (!source.includes("Следующий точный шаг")) fail("WORK_STATUS.md: exact next step section is missing");
  if (!source.includes("GitHub")) fail("WORK_STATUS.md: GitHub source-of-truth rule is missing");

  const branch = branchMatch[1].trim();
  const pullRequest = prMatch[1].trim();
  if (status === "READY") {
    if (branch !== "main") fail("WORK_STATUS.md: READY status requires working branch main");
    if (pullRequest !== "нет") fail("WORK_STATUS.md: READY status requires no open Pull Request");
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
      if (!source.includes(requiredText)) fail(`WORK_STATUS.md: ${requiredText} is required for ${status}`);
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
    if (!record || typeof record !== "object" || Array.isArray(record)) fail(`Record ${index}: expected an object`);
    if (!Number.isInteger(record.id)) fail(`Record ${index}: id must be an integer`);
    if (ids.has(record.id)) fail(`Duplicate record id: ${record.id}`);
    ids.add(record.id);
    if (typeof record.symbol !== "string" || !record.symbol.trim()) fail(`Record ${record.id}: symbol must be a non-empty string`);
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

  const image = await readFile(path.join(ROOT, "news", imageName));
  if (image.length < 10_000) fail(`${name}: screenshot is unexpectedly small`);
  const extension = path.extname(imageName).toLowerCase();
  if (extension === ".png") validatePng(image, name);
  else if ([".jpg", ".jpeg"].includes(extension)) {
    if (!isJpeg(image)) fail(`${name}: image has an invalid JPEG signature`);
  } else {
    fail(`${name}: unsupported image extension ${extension}`);
  }
}

async function validatePatchnotes() {
  const newsDir = path.join(ROOT, "news");
  const names = (await readdir(newsDir)).filter((name) => name.endsWith(".md")).sort();
  if (names.length === 0) fail("news/: at least one patchnote is required");

  const namePattern = /^\d{4}-\d{2}-\d{2}-udream-[a-z0-9-]+\.md$/;
  const requiredFields = ["type", "project", "series", "title", "version", "image"];
  const screenshotFields = ["image_source", "image_target", "image_commit", "image_captured_at"];
  const screenshotSources = new Set(["playwright", "manual-browser", "github-ui", "document-render"]);
  const secretRisk = /\b(?:TELEGRAM_BOT_TOKEN|BOT_TOKEN|DEEPSEEK_API_KEY)\b|\b\d{6,}:[A-Za-z0-9_-]{20,}\b/i;
  const repairedImages = new Set();

  for (const name of names) {
    if (!namePattern.test(name)) fail(`${name}: invalid patchnote filename`);
    const source = await readFile(path.join(newsDir, name), "utf8");
    const frontMatter = parseFrontMatter(source, name);
    for (const field of requiredFields) {
      if (!frontMatter[field]) fail(`${name}: missing required field ${field}`);
    }
    if (frontMatter.project !== "uDream") fail(`${name}: project must be uDream`);
    if (frontMatter.series !== "udream") fail(`${name}: series must be udream`);
    if (!frontMatter.web_url && !frontMatter.repo_url) fail(`${name}: web_url or repo_url is required`);
    if (secretRisk.test(source)) fail(`${name}: secret-like text detected`);

    const repairType = frontMatter.publication_repair || null;
    if (repairType && !REPAIR_TYPES.has(repairType)) {
      fail(`${name}: unsupported publication_repair ${repairType}`);
    }
    if (repairType) {
      if (!frontMatter.publication_repair_reason) fail(`${name}: publication_repair_reason is required`);
      if (repairedImages.has(frontMatter.image)) fail(`${name}: repaired image ${frontMatter.image} is reused`);
      repairedImages.add(frontMatter.image);
    }

    const requiresScreenshotMetadata = Boolean(repairType) || versionAtLeast(
      frontMatter.version,
      SCREENSHOT_METADATA_VERSION,
    );
    if (requiresScreenshotMetadata) {
      await validatePatchnoteImage(name, frontMatter);
      for (const field of screenshotFields) {
        if (!frontMatter[field]) fail(`${name}: missing required screenshot field ${field}`);
      }
      if (!screenshotSources.has(frontMatter.image_source)) fail(`${name}: unsupported image_source ${frontMatter.image_source}`);
      if (!/^[a-f0-9]{7,40}$/i.test(frontMatter.image_commit)) fail(`${name}: image_commit must be a Git commit SHA`);
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(frontMatter.image_captured_at)) {
        fail(`${name}: image_captured_at must use YYYY-MM-DDTHH:MM:SSZ`);
      }
    } else {
      await requireFile(path.posix.join("news", frontMatter.image));
    }
  }
  return { patchnotes: names.length, repairs: repairedImages.size };
}

async function main() {
  await validateRuntimeFiles();
  const workStatus = await validateWorkStatus();
  const screenshotTooling = await validateScreenshotTooling(ROOT);
  const dataProvenance = await validateDataProvenance(ROOT);
  const recordCount = await validateDatabase();
  const patchnoteResult = await validatePatchnotes();
  console.log(`WORK_STATUS passed: ${workStatus}.`);
  console.log(
    `Screenshot tooling passed: ${screenshotTooling.scenarios} scenario(s), `
    + `${screenshotTooling.desktop} desktop, ${screenshotTooling.mobile} mobile, `
    + `Playwright ${screenshotTooling.playwrightVersion}.`,
  );
  console.log(
    `Data provenance passed: ${dataProvenance.records} records, `
    + `${dataProvenance.sourceSerializations} source serializations, `
    + `active SHA-256 ${dataProvenance.activeSha256}.`,
  );
  console.log(
    `uDream validation passed: ${recordCount} records, `
    + `${patchnoteResult.patchnotes} patchnote(s), ${patchnoteResult.repairs} repaired image(s).`,
  );
}

main().catch((error) => {
  console.error(`Validation failed: ${error.message}`);
  process.exit(1);
});
