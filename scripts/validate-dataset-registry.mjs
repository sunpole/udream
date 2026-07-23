#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const REGISTRY_PATH = "data/datasets.json";
const DOCUMENT_PATH = "docs/DATASET_REGISTRY.md";
const EXPECTED_SCHEMA_VERSION = 1;
const EXPECTED_RECORDS = 4_086;
const EXPECTED_LOGICAL_IDS = ["ru-current-v1", "source-divinity-code-en"];
const EXPECTED_PHYSICAL_IDS = [
  "ru-current-v1-runtime",
  "source-divinity-code-en-bd2",
  "source-divinity-code-en-db",
];
const EXPECTED_SUPPORTING_IDS = ["data-quality-report-v1"];
const ENGLISH_CANONICAL_SHA256 = "5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1";
const ACTIVE_CANONICAL_SHA256 = "c3682a50dec3303b7a100abefb27befd2dfd5d84e66d219252cf099b1a0fcd64";
const RUNTIME_FILES = [
  "index.html",
  "script.js",
  "package.json",
  "manifest.json",
  "version.json",
  "sw.js",
  "src/data.js",
  "src/history.js",
  "src/i18n.js",
  "src/presentation.js",
  "src/pwa.js",
  "src/search.js",
  "src/state.js",
  "src/storage.js",
  "src/version.js",
];

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

function requireObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} must be an object`);
  }
  return value;
}

function requireArray(value, label) {
  if (!Array.isArray(value)) fail(`${label} must be an array`);
  return value;
}

function requireString(value, label) {
  if (typeof value !== "string" || !value.trim()) fail(`${label} must be a non-empty string`);
  return value;
}

function requireInteger(value, label) {
  if (!Number.isInteger(value)) fail(`${label} must be an integer`);
  return value;
}

function requireBoolean(value, label) {
  if (typeof value !== "boolean") fail(`${label} must be a boolean`);
  return value;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) fail(`${label}: expected ${expected}, got ${actual}`);
}

function assertStringArray(value, label) {
  requireArray(value, label);
  if (!value.every((entry) => typeof entry === "string" && entry.trim())) {
    fail(`${label} must contain non-empty strings`);
  }
}

function assertUniqueIds(items, label) {
  const ids = items.map((item, index) => requireString(item.id, `${label}[${index}].id`));
  const unique = new Set(ids);
  if (unique.size !== ids.length) fail(`${label} contains duplicate ids`);
  return ids;
}

function assertExactIds(actualIds, expectedIds, label) {
  const actual = [...actualIds].sort();
  const expected = [...expectedIds].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label}: expected ${expected.join(", ")}, got ${actual.join(", ")}`);
  }
}

async function readJson(root, relativePath) {
  const raw = await readFile(path.join(root, relativePath));
  let parsed;
  try {
    parsed = JSON.parse(raw.toString("utf8"));
  } catch (error) {
    fail(`${relativePath}: invalid JSON (${error.message})`);
  }
  return { raw, parsed };
}

function validateRecordIds(records, label) {
  if (!Array.isArray(records)) fail(`${label}: expected a JSON array`);
  assertEqual(records.length, EXPECTED_RECORDS, `${label} record count`);
  const seen = new Set();
  records.forEach((record, index) => {
    requireObject(record, `${label}[${index}]`);
    requireInteger(record.id, `${label}[${index}].id`);
    if (seen.has(record.id)) fail(`${label}: duplicate id ${record.id}`);
    seen.add(record.id);
    assertEqual(record.id, index + 1, `${label} ordered id at index ${index}`);
  });
}

async function inspectPhysicalFile(root, entry) {
  requireObject(entry, `physical file ${entry?.id ?? "unknown"}`);
  requireString(entry.path, `${entry.id}.path`);
  const absolutePath = path.join(root, entry.path);
  const raw = await readFile(absolutePath);
  assertEqual(raw.length, requireInteger(entry.bytes, `${entry.id}.bytes`), `${entry.path} bytes`);
  assertEqual(sha256(raw), requireString(entry.raw_sha256, `${entry.id}.raw_sha256`), `${entry.path} raw SHA-256`);

  if (entry.format !== "json") fail(`${entry.id}.format must be json`);
  let parsed;
  try {
    parsed = JSON.parse(raw.toString("utf8"));
  } catch (error) {
    fail(`${entry.path}: invalid JSON (${error.message})`);
  }
  validateRecordIds(parsed, entry.path);
  assertEqual(entry.record_count, EXPECTED_RECORDS, `${entry.id}.record_count`);
  const canonical = sha256(Buffer.from(stableStringify(parsed), "utf8"));
  assertEqual(canonical, requireString(entry.canonical_json_sha256, `${entry.id}.canonical_json_sha256`), `${entry.path} canonical SHA-256`);
  return { entry, raw, parsed, canonical };
}

async function validateSupportingFile(root, entry) {
  requireObject(entry, `supporting file ${entry?.id ?? "unknown"}`);
  requireString(entry.path, `${entry.id}.path`);
  const raw = await readFile(path.join(root, entry.path));
  assertEqual(raw.length, requireInteger(entry.bytes, `${entry.id}.bytes`), `${entry.path} bytes`);
  assertEqual(sha256(raw), requireString(entry.raw_sha256, `${entry.id}.raw_sha256`), `${entry.path} raw SHA-256`);
}

function validateLogicalDatasets(registry, physicalById) {
  const logical = requireArray(registry.logical_datasets, "logical_datasets");
  assertExactIds(assertUniqueIds(logical, "logical_datasets"), EXPECTED_LOGICAL_IDS, "logical dataset ids");
  const logicalById = new Map(logical.map((entry) => [entry.id, entry]));

  const source = requireObject(logicalById.get("source-divinity-code-en"), "source-divinity-code-en");
  assertEqual(source.kind, "source", "source-divinity-code-en.kind");
  assertEqual(source.language, "en", "source-divinity-code-en.language");
  assertEqual(source.status, "retained-source", "source-divinity-code-en.status");
  assertEqual(source.record_count, EXPECTED_RECORDS, "source-divinity-code-en.record_count");
  assertEqual(source.canonical_json_sha256, ENGLISH_CANONICAL_SHA256, "source-divinity-code-en canonical hash");
  assertEqual(source.canonical_physical_file_id, "source-divinity-code-en-bd2", "source canonical physical id");
  assertStringArray(source.physical_file_ids, "source-divinity-code-en.physical_file_ids");
  assertExactIds(source.physical_file_ids, ["source-divinity-code-en-bd2", "source-divinity-code-en-db"], "source physical file ids");

  const current = requireObject(logicalById.get("ru-current-v1"), "ru-current-v1");
  assertEqual(current.kind, "localized-augmented", "ru-current-v1.kind");
  assertEqual(current.language, "ru", "ru-current-v1.language");
  assertEqual(current.status, "runtime-current", "ru-current-v1.status");
  assertEqual(current.source_dataset_id, "source-divinity-code-en", "ru-current-v1.source_dataset_id");
  assertEqual(current.record_count, EXPECTED_RECORDS, "ru-current-v1.record_count");
  assertEqual(current.canonical_json_sha256, ACTIVE_CANONICAL_SHA256, "ru-current-v1 canonical hash");
  assertEqual(current.canonical_physical_file_id, "ru-current-v1-runtime", "ru-current-v1 canonical physical id");
  assertExactIds(current.physical_file_ids, ["ru-current-v1-runtime"], "ru-current-v1 physical file ids");
  assertExactIds(current.preserved_fields, ["id", "symbol", "description", "source", "date_added"], "ru-current-v1 preserved fields");
  assertExactIds(current.changed_fields, ["aliases", "notes", "tags"], "ru-current-v1 changed fields");
  assertEqual(current.transformation_pipeline_status, "unknown", "ru-current-v1 pipeline status");
  assertEqual(current.human_review_status, "unknown", "ru-current-v1 human review status");

  for (const dataset of logical) {
    const range = requireArray(dataset.ordered_id_range, `${dataset.id}.ordered_id_range`);
    if (range.length !== 2 || range[0] !== 1 || range[1] !== EXPECTED_RECORDS) {
      fail(`${dataset.id}.ordered_id_range must be [1, ${EXPECTED_RECORDS}]`);
    }
    for (const physicalId of dataset.physical_file_ids) {
      const physical = physicalById.get(physicalId);
      if (!physical) fail(`${dataset.id}: missing physical file ${physicalId}`);
      assertEqual(physical.logical_dataset_id, dataset.id, `${physicalId}.logical_dataset_id`);
    }
  }

  return logicalById;
}

function validateCanonicalDecision(registry, physicalById) {
  const selection = requireObject(registry.canonical_selection, "canonical_selection");
  assertEqual(selection.logical_dataset_id, "source-divinity-code-en", "canonical_selection.logical_dataset_id");
  assertEqual(selection.selected_physical_file_id, "source-divinity-code-en-bd2", "canonical_selection.selected_physical_file_id");
  assertEqual(selection.decision_type, "project-governance", "canonical_selection.decision_type");
  assertStringArray(selection.basis, "canonical_selection.basis");
  if (selection.basis.length < 4) fail("canonical_selection.basis must contain at least four facts");
  const disclaimer = requireString(selection.not_claimed, "canonical_selection.not_claimed");
  if (!disclaimer.includes("does not prove")) fail("canonical_selection.not_claimed must state the historical limitation");

  const canonical = physicalById.get(selection.selected_physical_file_id);
  assertEqual(canonical.path, "data/bd2.json", "canonical selected path");
  assertEqual(canonical.role, "canonical-serialization", "bd2 role");
  assertEqual(canonical.status, "canonical-retained", "bd2 status");

  const retained = physicalById.get("source-divinity-code-en-db");
  assertEqual(retained.path, "data/db.json", "retained path");
  assertEqual(retained.role, "compatibility-serialization", "db role");
  assertEqual(retained.status, "retained-equivalent", "db status");
}

function validatePolicies(registry) {
  const audit = requireObject(registry.reference_audit, "reference_audit");
  assertEqual(audit.runtime_active_path, "data/divinity_code_ru.json", "reference_audit.runtime_active_path");
  assertExactIds(audit.non_runtime_source_paths, ["data/bd2.json", "data/db.json"], "reference_audit.non_runtime_source_paths");
  assertExactIds(audit.historical_names, ["data/db_v2.json", "_archive/old-data/db_v2.json"], "reference_audit.historical_names");
  assertEqual(requireBoolean(audit.runtime_uses_english_serializations, "reference_audit.runtime_uses_english_serializations"), false, "runtime English serialization use");

  const migration = requireObject(registry.migration_plan, "migration_plan");
  assertEqual(migration.status, "planned-not-executed", "migration_plan.status");
  assertEqual(requireBoolean(migration.remove_or_rename_approved, "migration_plan.remove_or_rename_approved"), false, "migration removal approval");
  assertStringArray(migration.preconditions, "migration_plan.preconditions");
  assertStringArray(migration.future_steps, "migration_plan.future_steps");
  assertStringArray(migration.rollback, "migration_plan.rollback");
  if (migration.rollback.length < 3) fail("migration_plan.rollback must be explicit");

  const policy = requireObject(registry.translation_variant_policy, "translation_variant_policy");
  assertEqual(policy.current_dataset_id, "ru-current-v1", "translation_variant_policy.current_dataset_id");
  assertEqual(policy.target_source_dataset_count, 1, "target source dataset count");
  assertEqual(policy.target_current_russian_count, 1, "target current Russian count");
  assertEqual(policy.maximum_independent_alternative_russian_count, 2, "maximum alternative Russian count");
  assertEqual(requireBoolean(policy.allow_fewer_when_quality_requires, "allow_fewer_when_quality_requires"), true, "allow fewer variants");
  assertEqual(requireBoolean(policy.overwrite_current_translation, "overwrite_current_translation"), false, "overwrite policy");
  assertEqual(requireBoolean(policy.candidate_requires_new_dataset_id, "candidate_requires_new_dataset_id"), true, "candidate id policy");
  assertEqual(requireBoolean(policy.candidate_requires_source_hash_model_prompt_validation_and_human_review, "candidate requirements"), true, "candidate review policy");
}

async function validateRuntimeReferences(root) {
  const forbidden = ["data/bd2.json", "data/db.json", "data/db_v2.json", "_archive/old-data/db_v2.json"];
  let activeMentions = 0;
  for (const relativePath of RUNTIME_FILES) {
    const source = await readFile(path.join(root, relativePath), "utf8");
    for (const value of forbidden) {
      if (source.includes(value)) fail(`${relativePath}: runtime must not reference non-runtime dataset path ${value}`);
    }
    if (source.includes("data/divinity_code_ru.json")) activeMentions += 1;
  }
  if (activeMentions < 2) fail("runtime must retain explicit active-dataset references in its loader/cache contract");
}

async function validateRegistryDocument(root, registry) {
  const source = await readFile(path.join(root, DOCUMENT_PATH), "utf8");
  const required = [
    "source-divinity-code-en",
    "ru-current-v1",
    "source-divinity-code-en-bd2",
    "source-divinity-code-en-db",
    ENGLISH_CANONICAL_SHA256,
    "project-governance decision",
    "does not prove",
    "planned-not-executed",
    "data/bd2.json",
    "data/db.json",
    "data/divinity_code_ru.json",
  ];
  for (const value of required) {
    if (!source.includes(value)) fail(`${DOCUMENT_PATH}: missing required registry fact ${value}`);
  }
  if (!source.includes(registry.provenance_document)) {
    fail(`${DOCUMENT_PATH}: must link ${registry.provenance_document}`);
  }
}

export async function validateDatasetRegistry(root = process.cwd()) {
  const { parsed: registry } = await readJson(root, REGISTRY_PATH);
  requireObject(registry, REGISTRY_PATH);
  assertEqual(registry.schema_version, EXPECTED_SCHEMA_VERSION, "registry schema_version");
  assertEqual(registry.registry_id, "udream-datasets", "registry_id");
  assertEqual(registry.baseline, "23.8.9", "registry baseline");
  assertEqual(registry.functional_release, "v23.8.0", "registry functional release");
  assertEqual(registry.provenance_document, "docs/DATA_PROVENANCE.md", "registry provenance document");

  const physicalFiles = requireArray(registry.physical_files, "physical_files");
  assertExactIds(assertUniqueIds(physicalFiles, "physical_files"), EXPECTED_PHYSICAL_IDS, "physical file ids");
  const physicalById = new Map(physicalFiles.map((entry) => [entry.id, entry]));
  const inspected = await Promise.all(physicalFiles.map((entry) => inspectPhysicalFile(root, entry)));

  const supportingFiles = requireArray(registry.supporting_files, "supporting_files");
  assertExactIds(assertUniqueIds(supportingFiles, "supporting_files"), EXPECTED_SUPPORTING_IDS, "supporting file ids");
  await Promise.all(supportingFiles.map((entry) => validateSupportingFile(root, entry)));

  validateLogicalDatasets(registry, physicalById);
  validateCanonicalDecision(registry, physicalById);
  validatePolicies(registry);

  const sourceA = inspected.find((item) => item.entry.id === "source-divinity-code-en-bd2");
  const sourceB = inspected.find((item) => item.entry.id === "source-divinity-code-en-db");
  const active = inspected.find((item) => item.entry.id === "ru-current-v1-runtime");
  assertEqual(sourceA.canonical, ENGLISH_CANONICAL_SHA256, "source A canonical identity");
  assertEqual(sourceB.canonical, ENGLISH_CANONICAL_SHA256, "source B canonical identity");
  if (stableStringify(sourceA.parsed) !== stableStringify(sourceB.parsed)) {
    fail("English physical serializations no longer represent one logical dataset");
  }
  if (sourceA.entry.raw_sha256 === sourceB.entry.raw_sha256) {
    fail("English physical serializations must remain raw-distinct at the D1.2 baseline");
  }
  if (active.canonical === ENGLISH_CANONICAL_SHA256) {
    fail("Current localized dataset must remain a distinct logical dataset");
  }

  await validateRuntimeReferences(root);
  await validateRegistryDocument(root, registry);

  return {
    logicalDatasets: registry.logical_datasets.length,
    physicalFiles: registry.physical_files.length,
    canonicalSourcePath: physicalById.get("source-divinity-code-en-bd2").path,
    retainedEquivalentPath: physicalById.get("source-divinity-code-en-db").path,
    activePath: physicalById.get("ru-current-v1-runtime").path,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  validateDatasetRegistry()
    .then((result) => {
      console.log(
        `Dataset registry passed: ${result.logicalDatasets} logical dataset(s), `
        + `${result.physicalFiles} physical file(s), canonical source ${result.canonicalSourcePath}.`,
      );
    })
    .catch((error) => {
      console.error(`Dataset registry validation failed: ${error.message}`);
      process.exit(1);
    });
}
