#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import process from "node:process";

const baseSha = process.env.BASE_SHA;
if (!baseSha) {
  console.log("BASE_SHA is not set; Pull Request patchnote check skipped.");
  process.exit(0);
}

const output = execFileSync("git", ["diff", "--name-status", baseSha, "HEAD"], {
  encoding: "utf8",
});

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

const addedPatchnotes = changes
  .filter(({ status, paths }) => status === "A" && /^news\/\d{4}-\d{2}-\d{2}-udream-[a-z0-9-]+\.md$/.test(paths[0] || ""))
  .map(({ paths }) => paths[0]);

if (addedPatchnotes.length === 0) {
  console.error("Validation failed: this Pull Request changes the project but adds no new uDream patchnote in news/.");
  process.exit(1);
}

console.log(`Pull Request patchnote requirement passed: ${addedPatchnotes.join(", ")}`);
