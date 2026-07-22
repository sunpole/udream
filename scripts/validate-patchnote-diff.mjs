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

function fail(message) {
  console.error(`Validation failed: ${message}`);
  process.exit(1);
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

function commitExists(commit) {
  try {
    execFileSync("git", ["cat-file", "-e", `${commit}^{commit}`], {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
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
  changes
    .filter(({ status }) => status === "A")
    .map(({ paths }) => paths[0])
    .filter(Boolean),
);

const addedPatchnotes = [...addedPaths].filter((filePath) => (
  /^news\/\d{4}-\d{2}-\d{2}-udream-[a-z0-9-]+\.md$/.test(filePath)
));

if (addedPatchnotes.length === 0) {
  fail("this Pull Request changes the project but adds no new uDream patchnote in news/");
}

const screenshotSources = new Set([
  "playwright",
  "manual-browser",
  "github-ui",
  "document-render",
]);

for (const patchnotePath of addedPatchnotes) {
  const source = readFileSync(patchnotePath, "utf8");
  const frontMatter = parseFrontMatter(source, patchnotePath);

  for (const field of [
    "image",
    "image_source",
    "image_target",
    "image_commit",
    "image_captured_at",
  ]) {
    if (!frontMatter[field]) {
      fail(`${patchnotePath}: missing required screenshot field ${field}`);
    }
  }

  if (!screenshotSources.has(frontMatter.image_source)) {
    fail(
      `${patchnotePath}: image_source must be one of `
      + [...screenshotSources].join(", "),
    );
  }

  if (!/^[a-f0-9]{7,40}$/i.test(frontMatter.image_commit)) {
    fail(`${patchnotePath}: image_commit must be a Git commit SHA`);
  }

  if (!commitExists(frontMatter.image_commit)) {
    fail(
      `${patchnotePath}: image_commit ${frontMatter.image_commit} `
      + "does not exist in the checked-out Git history",
    );
  }

  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(
      frontMatter.image_captured_at,
    )
  ) {
    fail(
      `${patchnotePath}: image_captured_at must use `
      + "YYYY-MM-DDTHH:MM:SSZ",
    );
  }

  const imageName = frontMatter.image;
  if (
    path.basename(imageName) !== imageName
    || !/^[a-z0-9][a-z0-9.-]*\.(?:png|jpe?g)$/i.test(imageName)
  ) {
    fail(
      `${patchnotePath}: image must be a safe PNG/JPEG filename `
      + "stored beside the patchnote",
    );
  }

  const imagePath = path.posix.join("news", imageName);
  if (!addedPaths.has(imagePath)) {
    fail(
      `${patchnotePath}: ${imagePath} must be a new file added `
      + "in the same Pull Request; existing images cannot be reused",
    );
  }

  const image = readFileSync(imagePath);
  if (image.length < 10_000) {
    fail(`${imagePath}: screenshot is unexpectedly small`);
  }

  const extension = path.extname(imageName).toLowerCase();
  if (extension === ".png" && !isPng(image)) {
    fail(`${imagePath}: invalid PNG signature`);
  }
  if ([".jpg", ".jpeg"].includes(extension) && !isJpeg(image)) {
    fail(`${imagePath}: invalid JPEG signature`);
  }
}

console.log(
  `Pull Request patchnote and screenshot evidence passed: ${addedPatchnotes.join(", ")}`,
);
