#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const PDF_PATH = "_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf";
const EVIDENCE_JSON = "docs/second-book-evidence.json";
const EVIDENCE_MD = "docs/SECOND_BOOK_EVIDENCE.md";
const CONTRACT_MD = "docs/SECOND_BOOK_EXTRACTION_CONTRACT.md";

const EXPECTED = Object.freeze({
  bytes: 740193,
  rawSha256: "edb4127915bf720ee56c96612f825ea4e0ef2f5fc15192a56fb96e5c7ec4745a",
  gitBlobSha: "c1d4b038b1d7efbe50d7b2ba8de8040e686a1e18",
  pages: 55,
  substantialPages: 55,
  searchableRatio: 1,
  totalCharacters: 85103,
  totalWords: 12479,
  medianPageCharacters: 1520,
  lineCount: 1428,
  headingCandidates: 147,
  colonEntryCandidates: 260,
  technicalConclusion: "direct-text-extraction-viable",
  introducedCommit: "6204f8e202b4161c487055a83fe4e13f5e565292",
});

function fail(message) {
  throw new Error(message);
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    fail(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function readJson(relativePath) {
  const source = await readFile(path.join(ROOT, relativePath), "utf8");
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`${relativePath}: invalid JSON (${error.message})`);
  }
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function git(...args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function validateHistory(evidence) {
  const actualRows = git(
    "log",
    "--follow",
    "--date=iso-strict",
    "--format=%H%x09%aI%x09%s",
    "--",
    PDF_PATH,
  ).split(/\r?\n/).filter(Boolean);

  const actual = actualRows.map((row) => {
    const [commit, authoredAt, ...messageParts] = row.split("\t");
    return {
      commit,
      authored_at: authoredAt,
      message: messageParts.join("\t"),
    };
  });

  if (!Array.isArray(evidence.document.git_history)) {
    fail(`${EVIDENCE_JSON}: document.git_history must be an array`);
  }
  requireEqual(
    JSON.stringify(evidence.document.git_history),
    JSON.stringify(actual),
    "retained PDF Git history",
  );

  const oldest = actual.at(-1);
  requireEqual(oldest?.commit, EXPECTED.introducedCommit, "retained PDF introduction commit");
}

function validateEvidenceShape(evidence) {
  requireEqual(evidence.schema_version, 1, "evidence schema version");
  requireEqual(evidence.evidence_id, "second-book-retained-pdf-v1", "evidence id");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(evidence.generated_at || "")) {
    fail(`${EVIDENCE_JSON}: generated_at must be an exact UTC timestamp`);
  }
  if (!/^[0-9a-f]{40}$/.test(evidence.source_commit || "")) {
    fail(`${EVIDENCE_JSON}: source_commit must be a full commit SHA`);
  }

  requireEqual(evidence.document.path, PDF_PATH, "evidence PDF path");
  requireEqual(evidence.document.bytes, EXPECTED.bytes, "evidence PDF bytes");
  requireEqual(evidence.document.raw_sha256, EXPECTED.rawSha256, "evidence PDF SHA-256");
  requireEqual(evidence.document.git_blob_sha, EXPECTED.gitBlobSha, "evidence PDF Git blob SHA");
  requireEqual(
    evidence.document.retention_status,
    "retained-evidence-not-dataset",
    "evidence retention status",
  );
  requireEqual(evidence.document.metadata?.Pages, String(EXPECTED.pages), "PDF metadata page count");
  requireEqual(evidence.document.metadata?.Encrypted, "no", "PDF encryption status");
  requireEqual(evidence.document.metadata?.JavaScript, "no", "PDF JavaScript status");

  const text = evidence.text_layer || {};
  requireEqual(text.tool, "pdftotext -layout (poppler-utils)", "text-layer tool");
  requireEqual(text.page_count_from_text, EXPECTED.pages, "text-layer page count");
  requireEqual(text.pages_with_substantial_text, EXPECTED.substantialPages, "substantial page count");
  requireEqual(text.searchable_page_ratio, EXPECTED.searchableRatio, "searchable page ratio");
  requireEqual(text.total_characters, EXPECTED.totalCharacters, "text-layer character count");
  requireEqual(text.total_words, EXPECTED.totalWords, "text-layer word count");
  requireEqual(
    text.median_nonempty_page_characters,
    EXPECTED.medianPageCharacters,
    "median nonempty-page characters",
  );
  requireEqual(text.nonempty_page_count, EXPECTED.pages, "nonempty page count");
  requireEqual(text.line_count, EXPECTED.lineCount, "text-layer line count");
  requireEqual(text.heading_candidate_count, EXPECTED.headingCandidates, "heading candidate count");
  requireEqual(text.colon_entry_candidate_count, EXPECTED.colonEntryCandidates, "colon-entry candidate count");
  requireEqual(text.technical_conclusion, EXPECTED.technicalConclusion, "technical extraction conclusion");
  if (!Array.isArray(text.first_20_page_character_counts) || text.first_20_page_character_counts.length !== 20) {
    fail(`${EVIDENCE_JSON}: first_20_page_character_counts must contain 20 values`);
  }

  requireEqual(evidence.safety?.full_extracted_text_committed, false, "full extracted text safety flag");
  requireEqual(evidence.safety?.existing_data_modified, false, "existing data safety flag");
  requireEqual(evidence.safety?.runtime_modified, false, "runtime safety flag");
  requireEqual(evidence.safety?.registered_dataset_created, false, "dataset-registration safety flag");
}

async function validateFilesAgainstEvidence(evidence) {
  const pdf = await readFile(path.join(ROOT, PDF_PATH));
  requireEqual(pdf.length, EXPECTED.bytes, "actual PDF bytes");
  requireEqual(sha256(pdf), EXPECTED.rawSha256, "actual PDF SHA-256");
  requireEqual(git("hash-object", PDF_PATH), EXPECTED.gitBlobSha, "actual PDF Git blob SHA");

  const evidenceMd = await readFile(path.join(ROOT, EVIDENCE_MD), "utf8");
  for (const token of [
    EXPECTED.rawSha256,
    "55",
    "1.0",
    "direct-text-extraction-viable",
    "Наличие PDF не означает",
  ]) {
    if (!evidenceMd.includes(token)) fail(`${EVIDENCE_MD}: missing required token ${token}`);
  }

  const contract = await readFile(path.join(ROOT, CONTRACT_MD), "utf8");
  for (const token of [
    "immutable raw extraction",
    "second-book-en-YYYYMMDD-NNN",
    "local_id",
    "source_anchor",
    "provenance manifest",
    "ru-current-v1",
    "federated combined search",
    "public repository storage is not approved",
  ]) {
    if (!contract.includes(token)) fail(`${CONTRACT_MD}: missing required contract token ${token}`);
  }

  for (const forbiddenPath of [
    "artifacts/d1.4a/extracted.txt",
    "docs/second-book-extracted.txt",
    "data/second-book.json",
    "data/unlocking-your-dreams.json",
    ".github/workflows/analyze-second-book-d1.4a.yml",
  ]) {
    try {
      await access(path.join(ROOT, forbiddenPath));
      fail(`${forbiddenPath}: temporary or unapproved output must not exist`);
    } catch (error) {
      if (error?.message?.includes("must not exist")) throw error;
    }
  }

  validateHistory(evidence);
}

export async function validateSecondBookEvidence() {
  const evidence = await readJson(EVIDENCE_JSON);
  validateEvidenceShape(evidence);
  await validateFilesAgainstEvidence(evidence);
  return {
    pdf: PDF_PATH,
    bytes: EXPECTED.bytes,
    pages: EXPECTED.pages,
    searchableRatio: EXPECTED.searchableRatio,
    strategy: EXPECTED.technicalConclusion,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  validateSecondBookEvidence()
    .then((result) => {
      console.log(
        `Second-book evidence valid: ${result.pages} pages, ratio ${result.searchableRatio}, ${result.strategy}`,
      );
    })
    .catch((error) => {
      console.error(`Second-book evidence validation failed: ${error.message}`);
      process.exitCode = 1;
    });
}
