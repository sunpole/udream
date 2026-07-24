#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const ARCH_PATH = "docs/two-book-architecture.json";
const DATASET_REGISTRY_PATH = "data/datasets.json";
const DOC_PATH = "docs/TWO_BOOK_ARCHITECTURE.md";

function fail(message) {
  throw new Error(message);
}

async function readJson(relativePath) {
  const source = await readFile(path.join(ROOT, relativePath), "utf8");
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`${relativePath}: invalid JSON (${error.message})`);
  }
}

function requireUniqueIds(items, label) {
  const ids = new Set();
  for (const item of items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      fail(`${label}: every entry must be an object`);
    }
    if (typeof item.id !== "string" || !item.id.trim()) {
      fail(`${label}: every entry needs a non-empty id`);
    }
    if (ids.has(item.id)) fail(`${label}: duplicate id ${item.id}`);
    ids.add(item.id);
  }
  return ids;
}

async function main() {
  const architecture = await readJson(ARCH_PATH);
  const datasets = await readJson(DATASET_REGISTRY_PATH);
  const document = await readFile(path.join(ROOT, DOC_PATH), "utf8");

  if (architecture.schema_version !== 1) fail("architecture schema_version must be 1");
  if (architecture.status !== "architecture-only") fail("D1.4 status must remain architecture-only");
  if (architecture.functional_release !== "v23.8.0") fail("functional release changed unexpectedly");
  if (architecture.default_dataset_id !== "ru-current-v1") fail("stable default must remain ru-current-v1");

  const workIds = requireUniqueIds(architecture.source_works, "source_works");
  const documentIds = requireUniqueIds(architecture.documents, "documents");
  const modeIds = requireUniqueIds(architecture.modes, "modes");
  const stageIds = requireUniqueIds(architecture.stages, "stages");

  for (const required of ["work-divinity-code", "work-unlocking-your-dreams"]) {
    if (!workIds.has(required)) fail(`missing source work ${required}`);
  }
  for (const required of ["document-divinity-code-pdf", "document-unlocking-your-dreams-student-material-pdf"]) {
    if (!documentIds.has(required)) fail(`missing retained document ${required}`);
  }
  for (const required of ["separate", "combined", "comparison"]) {
    if (!modeIds.has(required)) fail(`missing product mode ${required}`);
  }
  if (!stageIds.has("D1.4")) fail("missing D1.4 stage");

  const registeredDatasetIds = new Set(datasets.logical_datasets.map((item) => item.id));
  if (!registeredDatasetIds.has("ru-current-v1")) fail("dataset registry lacks ru-current-v1");
  if (!registeredDatasetIds.has("source-divinity-code-en")) fail("dataset registry lacks source-divinity-code-en");

  const currentContract = architecture.dataset_contracts.find((item) => item.dataset_id === "ru-current-v1");
  if (!currentContract || currentContract.activation !== "active-default") {
    fail("ru-current-v1 must remain active-default");
  }
  const futureContract = architecture.dataset_contracts.find(
    (item) => item.dataset_id === "future-unlocking-your-dreams-source",
  );
  if (!futureContract || futureContract.status !== "reserved-id-not-created") {
    fail("future second-book dataset must remain reserved-id-not-created");
  }

  const identity = architecture.identity_contract?.global_record_key;
  if (JSON.stringify(identity) !== JSON.stringify(["dataset_id", "record_id"])) {
    fail("global identity must be dataset_id + record_id");
  }
  if (architecture.identity_contract.cross_dataset_numeric_id_equivalence !== false) {
    fail("cross-dataset numeric ID equivalence must be false");
  }

  const combined = architecture.modes.find((item) => item.id === "combined");
  if (!combined || combined.destructive_json_merge !== false) {
    fail("combined mode must forbid destructive JSON merge");
  }
  const comparison = architecture.modes.find((item) => item.id === "comparison");
  if (!comparison || comparison.numeric_id_matching !== false) {
    fail("comparison mode must forbid numeric-ID matching");
  }

  if (architecture.fallback_contract?.stable_dataset_id !== "ru-current-v1") {
    fail("fallback dataset must remain ru-current-v1");
  }
  if (architecture.cache_contract?.unrelated_origin_caches_must_not_be_deleted !== true) {
    fail("unrelated origin caches must be protected");
  }
  if (architecture.relation_map_contract?.human_review_required !== true) {
    fail("relation map must require human review");
  }

  for (const entry of architecture.documents) {
    if (!workIds.has(entry.source_work_id)) fail(`document ${entry.id}: unknown source work`);
    await access(path.join(ROOT, entry.path));
  }

  const prohibited = new Set(architecture.prohibitions || []);
  for (const required of [
    "do-not-treat-retained-pdf-as-ready-dataset",
    "do-not-assume-cross-book-id-equivalence",
    "do-not-destructively-merge-source-json",
    "do-not-change-runtime-in-d1.4",
    "do-not-change-existing-data-files-in-d1.4",
    "do-not-add-api-keys",
  ]) {
    if (!prohibited.has(required)) fail(`missing prohibition ${required}`);
  }

  for (const requiredText of [
    "(dataset_id, record_id)",
    "Federated combined search",
    "Side-by-side comparison",
    "ru-current-v1",
    "Presence of a PDF is not evidence",
  ]) {
    if (!document.includes(requiredText)) fail(`${DOC_PATH}: missing ${requiredText}`);
  }

  console.log(
    `Two-book architecture passed: ${workIds.size} source works, ${documentIds.size} documents, `
      + `${modeIds.size} modes, stable fallback ${architecture.fallback_contract.stable_dataset_id}.`,
  );
}

main().catch((error) => {
  console.error(`Two-book architecture validation failed: ${error.message}`);
  process.exit(1);
});
