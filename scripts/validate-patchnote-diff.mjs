#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const baseSha = process.env.BASE_SHA;
if (!baseSha) {
  console.log("BASE_SHA is not set; Pull Request patchnote check skipped.");
  process.exit(0);
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const REPAIR_TYPES = new Set([
  "unpublished-invalid-image",
  "unpublished-image-upgrade",
]);
const SCREENSHOT_SOURCES = new Set([
  "playwright",
  "manual-browser",
  "github-ui",
  "document-render",
]);
const CRC_TABLE = buildCrcTable();

function fail(message) {
  console.error(`Validation failed: ${message}`);
  process.exit(1);
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

function validatePng(buffer, label) {
  if (buffer.length < 8 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(`${label}: invalid PNG signature`);
  }

  let offset = 8;
  let chunkIndex = 0;
  let width = null;
  let height = null;
  let sawIdat = false;
  let sawIend = false;

  while (offset < buffer.length) {
    if (offset + 12 > buffer.length) {
      throw new Error(`${label}: truncated PNG chunk header`);
    }
    const length = buffer.readUInt32BE(offset);
    const typeStart = offset + 4;
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const crcOffset = dataEnd;
    const nextOffset = crcOffset + 4;
    if (nextOffset > buffer.length) {
      throw new Error(`${label}: truncated PNG chunk`);
    }

    const type = buffer.subarray(typeStart, dataStart).toString("ascii");
    if (!/^[A-Za-z]{4}$/.test(type)) {
      throw new Error(`${label}: invalid PNG chunk type`);
    }
    const storedCrc = buffer.readUInt32BE(crcOffset);
    const actualCrc = crc32(buffer.subarray(typeStart, dataEnd));
    if (storedCrc !== actualCrc) {
      throw new Error(`${label}: PNG CRC mismatch in ${type} chunk`);
    }

    if (chunkIndex === 0 && type !== "IHDR") {
      throw new Error(`${label}: PNG first chunk must be IHDR`);
    }
    if (type === "IHDR") {
      if (chunkIndex !== 0 || length !== 13) {
        throw new Error(`${label}: invalid PNG IHDR`);
      }
      width = buffer.readUInt32BE(dataStart);
      height = buffer.readUInt32BE(dataStart + 4);
      if (width < 1 || height < 1 || width > 20_000 || height > 20_000) {
        throw new Error(`${label}: invalid PNG dimensions ${width}x${height}`);
      }
      if (Math.max(width / height, height / width) > 20) {
        throw new Error(`${label}: PNG aspect ratio exceeds 20:1`);
      }
    } else if (type === "IDAT") {
      sawIdat = true;
    } else if (type === "IEND") {
      if (length !== 0 || nextOffset !== buffer.length) {
        throw new Error(`${label}: invalid PNG IEND`);
      }
      sawIend = true;
    }

    offset = nextOffset;
    chunkIndex += 1;
    if (sawIend) break;
  }

  if (width === null || height === null || !sawIdat || !sawIend) {
    throw new Error(`${label}: incomplete PNG structure`);
  }
  return { width, height };
}

function validateImage(buffer, imageName, label) {
  if (buffer.length < 10_000) {
    throw new Error(`${label}: screenshot is unexpectedly small (${buffer.length} bytes)`);
  }
  const extension = path.extname(imageName).toLowerCase();
  if (extension === ".png") return validatePng(buffer, label);
  if ([".jpg", ".jpeg"].includes(extension)) {
    if (
      buffer.length < 4
      || buffer[0] !== 0xff
      || buffer[1] !== 0xd8
      || buffer[buffer.length - 2] !== 0xff
      || buffer[buffer.length - 1] !== 0xd9
    ) {
      throw new Error(`${label}: invalid JPEG signature`);
    }
    return {};
  }
  throw new Error(`${label}: unsupported image extension ${extension}`);
}

function imageError(buffer, imageName, label) {
  try {
    validateImage(buffer, imageName, label);
    return null;
  } catch (error) {
    return error.message;
  }
}

function commitExists(commit) {
  try {
    execFileSync("git", ["cat-file", "-e", `${commit}^{commit}`], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function readGitFile(commit, filePath, encoding = null) {
  try {
    return execFileSync("git", ["show", `${commit}:${filePath}`], {
      encoding: encoding || undefined,
      maxBuffer: 25 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    fail(`${filePath}: cannot read the base-branch file at ${commit}`);
  }
}

const output = execFileSync(
  "git",
  ["diff", "--name-status", baseSha, "HEAD"],
  { encoding: "utf8" },
);
const changes = output
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [status, ...paths] = line.split(/\s+/);
    return { status, paths };
  });

if (changes.length === 0) {
  console.log("No Pull Request changes detected.");
  process.exit(0);
}

const addedPaths = new Set(
  changes.filter(({ status }) => status === "A").map(({ paths }) => paths[0]).filter(Boolean),
);
const modifiedPaths = new Set(
  changes.filter(({ status }) => status === "M").map(({ paths }) => paths[0]).filter(Boolean),
);
const patchnotePattern = /^news\/\d{4}-\d{2}-\d{2}-udream-[a-z0-9-]+\.md$/;
const addedPatchnotes = [...addedPaths].filter((filePath) => patchnotePattern.test(filePath));
const modifiedPatchnotes = [...modifiedPaths].filter((filePath) => patchnotePattern.test(filePath));

if (addedPatchnotes.length > 0 && modifiedPatchnotes.length > 0) {
  fail("a Pull Request must not mix new patchnotes with unpublished patchnote repairs");
}
if (addedPatchnotes.length === 0 && modifiedPatchnotes.length === 0) {
  fail("this Pull Request must add a patchnote or explicitly repair unpublished patchnotes");
}

const mode = addedPatchnotes.length > 0 ? "new" : "repair";
const patchnotePaths = mode === "new" ? addedPatchnotes : modifiedPatchnotes;
const records = patchnotePaths.map((patchnotePath) => {
  const source = readFileSync(patchnotePath, "utf8");
  const current = parseFrontMatter(source, patchnotePath);
  const base = mode === "repair"
    ? parseFrontMatter(
      readGitFile(baseSha, patchnotePath, "utf8"),
      `${patchnotePath} at ${baseSha}`,
    )
    : null;
  return { patchnotePath, current, base };
});

const baseImageUse = new Map();
for (const record of records) {
  if (!record.base?.image) continue;
  baseImageUse.set(record.base.image, (baseImageUse.get(record.base.image) || 0) + 1);
}

const currentImageNames = new Set();
for (const { patchnotePath, current, base } of records) {
  for (const field of [
    "image",
    "image_source",
    "image_target",
    "image_commit",
    "image_captured_at",
  ]) {
    if (!current[field]) fail(`${patchnotePath}: missing required screenshot field ${field}`);
  }
  if (!SCREENSHOT_SOURCES.has(current.image_source)) {
    fail(`${patchnotePath}: unsupported image_source ${current.image_source}`);
  }
  if (!/^[a-f0-9]{7,40}$/i.test(current.image_commit)) {
    fail(`${patchnotePath}: image_commit must be a Git commit SHA`);
  }
  if (!commitExists(current.image_commit)) {
    fail(`${patchnotePath}: image_commit ${current.image_commit} does not exist`);
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(current.image_captured_at)) {
    fail(`${patchnotePath}: image_captured_at must use YYYY-MM-DDTHH:MM:SSZ`);
  }

  const imageName = current.image;
  if (
    path.basename(imageName) !== imageName
    || !/^[a-z0-9][a-z0-9.-]*\.(?:png|jpe?g)$/i.test(imageName)
  ) {
    fail(`${patchnotePath}: image must be a safe PNG/JPEG filename`);
  }
  if (currentImageNames.has(imageName)) {
    fail(`${patchnotePath}: repaired/new image ${imageName} is reused by another patchnote`);
  }
  currentImageNames.add(imageName);

  const imagePath = path.posix.join("news", imageName);
  if (mode === "new") {
    if (current.publication_repair) {
      fail(`${patchnotePath}: a new patchnote cannot use publication_repair`);
    }
    if (!addedPaths.has(imagePath)) {
      fail(`${patchnotePath}: ${imagePath} must be a new file in the same Pull Request`);
    }
  } else {
    if (!REPAIR_TYPES.has(current.publication_repair)) {
      fail(`${patchnotePath}: unsupported publication_repair ${current.publication_repair}`);
    }
    if (!current.publication_repair_reason) {
      fail(`${patchnotePath}: publication_repair_reason is required`);
    }
    for (const stableField of ["project", "series", "version", "queued_at"]) {
      if (base[stableField] !== current[stableField]) {
        fail(`${patchnotePath}: repair must not change FIFO field ${stableField}`);
      }
    }
    if (!addedPaths.has(imagePath) && !modifiedPaths.has(imagePath)) {
      fail(`${patchnotePath}: repaired image ${imagePath} must be added or modified in the same Pull Request`);
    }

    const baseImagePath = path.posix.join("news", base.image);
    const baseImage = readGitFile(baseSha, baseImagePath);
    const baseInvalidReason = imageError(baseImage, base.image, `${patchnotePath} base image`);

    if (current.publication_repair === "unpublished-invalid-image") {
      if (!baseInvalidReason) {
        fail(`${patchnotePath}: base image is valid; invalid-image repair cannot be used`);
      }
    } else {
      if (base.image === current.image) {
        fail(`${patchnotePath}: image-upgrade must use a new dedicated image filename`);
      }
      if (!addedPaths.has(imagePath)) {
        fail(`${patchnotePath}: image-upgrade requires a newly added image file`);
      }
      if ((baseImageUse.get(base.image) || 0) < 2) {
        fail(`${patchnotePath}: base image was not shared within this repair batch`);
      }
    }
  }

  const image = readFileSync(imagePath);
  try {
    validateImage(image, imageName, imagePath);
  } catch (error) {
    fail(error.message);
  }
}

console.log(
  `Pull Request patchnote evidence passed: ${records.length} ${mode} item(s), `
  + `${currentImageNames.size} unique validated image(s).`,
);
