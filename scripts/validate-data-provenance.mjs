#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const EXPECTED_FIELDS = [
  "aliases",
  "date_added",
  "description",
  "id",
  "notes",
  "source",
  "symbol",
  "tags",
];

const EXPECTED_FILES = {
  bd2: {
    path: "data/bd2.json",
    bytes: 2_141_655,
    sha256: "814c5d33444160e6f1ab20278f9356090ec0e9cc04943cd14ad99d9038be6e28",
    canonicalSha256: "5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1",
  },
  db: {
    path: "data/db.json",
    bytes: 2_204_553,
    sha256: "4e166959d318778be57557349a152c2b466ad9db14e5634f5e5df3c87ca2cdc0",
    canonicalSha256: "5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1",
  },
  ru: {
    path: "data/divinity_code_ru.json",
    bytes: 4_688_773,
    sha256: "1def80216e238b0c2a8640aaf1b4e95dd0669d5944a67f4e7c4421fad55a6e64",
    canonicalSha256: "c3682a50dec3303b7a100abefb27befd2dfd5d84e66d219252cf099b1a0fcd64",
  },
};

const EXPECTED_REPORT = {
  path: "data/report.txt",
  bytes: 2_963,
  sha256: "dec064b826ae20b1ded2f9bcbfeed7d1d4d1c94592ef9d0774e495689e59da1d",
};

const EXPECTED_RECORDS = 4_086;
const EXPECTED_RU_FIELD_DIFFERENCES = {
  aliases: 4_083,
  date_added: 0,
  description: 0,
  id: 0,
  notes: 4_086,
  source: 0,
  symbol: 0,
  tags: 4_086,
};

function fail(message) {
  throw new Error(message);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function validateRecord(record, index, label) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    fail(`${label}: record ${index} must be an object`);
  }
  const fields = Object.keys(record).sort();
  if (JSON.stringify(fields) !== JSON.stringify(EXPECTED_FIELDS)) {
    fail(`${label}: record ${record.id ?? index} has unexpected fields ${fields.join(", ")}`);
  }
  if (!Number.isInteger(record.id)) fail(`${label}: record ${index} id must be an integer`);
  if (typeof record.symbol !== "string" || !record.symbol.trim()) fail(`${label}: record ${record.id} symbol must be non-empty`);
  if (!Array.isArray(record.aliases) || !record.aliases.every((value) => typeof value === "string")) {
    fail(`${label}: record ${record.id} aliases must be strings`);
  }
  if (typeof record.description !== "string") fail(`${label}: record ${record.id} description must be a string`);
  if (typeof record.source !== "string") fail(`${label}: record ${record.id} source must be a string`);
  if (typeof record.date_added !== "string") fail(`${label}: record ${record.id} date_added must be a string`);
  if (!Array.isArray(record.tags) || !record.tags.every((value) => typeof value === "string")) {
    fail(`${label}: record ${record.id} tags must be strings`);
  }
  if (typeof record.notes !== "string") fail(`${label}: record ${record.id} notes must be a string`);
}

async function inspectJson(root, name, expected) {
  const absolutePath = path.join(root, expected.path);
  const raw = await readFile(absolutePath);
  if (raw.length !== expected.bytes) {
    fail(`${expected.path}: expected ${expected.bytes} bytes, got ${raw.length}`);
  }
  const digest = sha256(raw);
  if (digest !== expected.sha256) {
    fail(`${expected.path}: SHA-256 changed from ${expected.sha256} to ${digest}`);
  }

  let records;
  try {
    records = JSON.parse(raw.toString("utf8"));
  } catch (error) {
    fail(`${expected.path}: invalid JSON (${error.message})`);
  }
  if (!Array.isArray(records) || records.length !== EXPECTED_RECORDS) {
    fail(`${expected.path}: expected ${EXPECTED_RECORDS} records`);
  }

  const ids = new Set();
  records.forEach((record, index) => {
    validateRecord(record, index, expected.path);
    if (ids.has(record.id)) fail(`${expected.path}: duplicate id ${record.id}`);
    ids.add(record.id);
    if (record.id !== index + 1) {
      fail(`${expected.path}: expected ordered id ${index + 1}, got ${record.id}`);
    }
  });

  const canonicalDigest = sha256(Buffer.from(stableStringify(records), "utf8"));
  if (canonicalDigest !== expected.canonicalSha256) {
    fail(`${expected.path}: canonical JSON SHA-256 changed from ${expected.canonicalSha256} to ${canonicalDigest}`);
  }

  return { name, path: expected.path, records, bytes: raw.length, sha256: digest, canonicalSha256: canonicalDigest };
}

function compareFieldDifferences(left, right) {
  const counts = Object.fromEntries(EXPECTED_FIELDS.map((field) => [field, 0]));
  for (let index = 0; index < EXPECTED_RECORDS; index += 1) {
    for (const field of EXPECTED_FIELDS) {
      if (stableStringify(left[index][field]) !== stableStringify(right[index][field])) {
        counts[field] += 1;
      }
    }
  }
  return counts;
}

async function validateProvenanceDocument(root) {
  const source = await readFile(path.join(root, "docs/DATA_PROVENANCE.md"), "utf8");
  const requiredFacts = [
    EXPECTED_FILES.bd2.sha256,
    EXPECTED_FILES.db.sha256,
    EXPECTED_FILES.ru.sha256,
    EXPECTED_REPORT.sha256,
    EXPECTED_FILES.bd2.canonicalSha256,
    "parsed JSON and canonical JSON are identical",
    "different serializations",
    "aliases`, `notes` and `tags",
    "exact generation and translation pipeline remains unknown",
  ];
  for (const fact of requiredFacts) {
    if (!source.includes(fact)) fail(`docs/DATA_PROVENANCE.md: missing required fact ${fact}`);
  }
}

export async function validateDataProvenance(root = process.cwd()) {
  const [bd2, db, ru] = await Promise.all([
    inspectJson(root, "bd2", EXPECTED_FILES.bd2),
    inspectJson(root, "db", EXPECTED_FILES.db),
    inspectJson(root, "ru", EXPECTED_FILES.ru),
  ]);

  const reportRaw = await readFile(path.join(root, EXPECTED_REPORT.path));
  if (reportRaw.length !== EXPECTED_REPORT.bytes) {
    fail(`${EXPECTED_REPORT.path}: expected ${EXPECTED_REPORT.bytes} bytes, got ${reportRaw.length}`);
  }
  const reportDigest = sha256(reportRaw);
  if (reportDigest !== EXPECTED_REPORT.sha256) {
    fail(`${EXPECTED_REPORT.path}: SHA-256 changed from ${EXPECTED_REPORT.sha256} to ${reportDigest}`);
  }

  if (bd2.sha256 === db.sha256) fail("bd2.json and db.json must remain byte-distinct at the D1.1 baseline");
  if (stableStringify(bd2.records) !== stableStringify(db.records)) {
    fail("bd2.json and db.json must remain semantically identical at the D1.1 baseline");
  }

  const bd2RuDifferences = compareFieldDifferences(bd2.records, ru.records);
  const dbRuDifferences = compareFieldDifferences(db.records, ru.records);
  if (JSON.stringify(bd2RuDifferences) !== JSON.stringify(EXPECTED_RU_FIELD_DIFFERENCES)) {
    fail(`bd2.json → divinity_code_ru.json differences changed: ${JSON.stringify(bd2RuDifferences)}`);
  }
  if (JSON.stringify(dbRuDifferences) !== JSON.stringify(EXPECTED_RU_FIELD_DIFFERENCES)) {
    fail(`db.json → divinity_code_ru.json differences changed: ${JSON.stringify(dbRuDifferences)}`);
  }

  await validateProvenanceDocument(root);

  return {
    records: EXPECTED_RECORDS,
    sourceCanonicalSha256: bd2.canonicalSha256,
    activeSha256: ru.sha256,
    sourceSerializations: 2,
    ruFieldDifferences: dbRuDifferences,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  validateDataProvenance()
    .then((result) => {
      console.log(
        `Data provenance passed: ${result.records} records, `
        + `${result.sourceSerializations} source serializations, active SHA-256 ${result.activeSha256}.`,
      );
    })
    .catch((error) => {
      console.error(`Data provenance validation failed: ${error.message}`);
      process.exit(1);
    });
}
