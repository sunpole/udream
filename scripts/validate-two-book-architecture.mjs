#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const SOURCE_WORKS_PATH = "data/source-works.json";
const ARCHITECTURE_PATH = "data/two-book-architecture.json";
const DATASETS_PATH = "data/datasets.json";
const AUDIT_REPORT_PATH = "reports/data-quality-audit.json";
const DOCUMENT_PATH = "docs/TWO_BOOK_ARCHITECTURE.md";
const EXPECTED_BASELINE = "23.8.11";
const EXPECTED_FUNCTIONAL_RELEASE = "v23.8.0";
const EXPECTED_RECORDS = 4_086;
const EXPECTED_SOURCE_WORK_IDS = [
  "divinity-code",
  "unlocking-your-dreams-student-material",
];
const EXPECTED_DOCUMENT_IDS = [
  "divinity-code-retained-pdf",
  "unlocking-your-dream-student-material-retained-pdf",
];
const EXPECTED_MODES = ["single", "switch", "combined", "compare"];

function fail(message) {
  throw new Error(message);
}

function requireObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${label} must be an object`);
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

function requireBoolean(value, label) {
  if (typeof value !== "boolean") fail(`${label} must be a boolean`);
  return value;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) fail(`${label}: expected ${expected}, got ${actual}`);
}

function assertUniqueIds(items, label) {
  const ids = items.map((item, index) => requireString(item.id, `${label}[${index}].id`));
  if (new Set(ids).size !== ids.length) fail(`${label} contains duplicate IDs`);
  return ids;
}

function assertExactSet(actual, expected, label) {
  const a = [...actual].sort();
  const e = [...expected].sort();
  if (JSON.stringify(a) !== JSON.stringify(e)) {
    fail(`${label}: expected ${e.join(", ")}, got ${a.join(", ")}`);
  }
}

async function readJson(root, relativePath) {
  const source = await readFile(path.join(root, relativePath), "utf8");
  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`${relativePath}: invalid JSON (${error.message})`);
  }
}

function gitBlobSha1(buffer) {
  return createHash("sha1")
    .update(Buffer.from(`blob ${buffer.length}\0`, "utf8"))
    .update(buffer)
    .digest("hex");
}

async function validateSourceWorks(root, datasets, audit) {
  const registry = requireObject(await readJson(root, SOURCE_WORKS_PATH), SOURCE_WORKS_PATH);
  assertEqual(registry.schema_version, 1, "source works schema version");
  assertEqual(registry.registry_id, "udream-source-works", "source works registry ID");
  assertEqual(registry.baseline, EXPECTED_BASELINE, "source works baseline");
  assertEqual(registry.functional_release, EXPECTED_FUNCTIONAL_RELEASE, "source works functional release");

  const works = requireArray(registry.source_works, "source_works");
  assertExactSet(assertUniqueIds(works, "source_works"), EXPECTED_SOURCE_WORK_IDS, "source work IDs");
  const worksById = new Map(works.map((entry) => [entry.id, entry]));

  const documents = requireArray(registry.source_documents, "source_documents");
  assertExactSet(assertUniqueIds(documents, "source_documents"), EXPECTED_DOCUMENT_IDS, "source document IDs");
  const docsById = new Map(documents.map((entry) => [entry.id, entry]));

  for (const work of works) {
    requireString(work.display_title, `${work.id}.display_title`);
    requireString(work.title_status, `${work.id}.title_status`);
    requireArray(work.authors, `${work.id}.authors`);
    requireString(work.authors_status, `${work.id}.authors_status`);
    requireString(work.edition_status, `${work.id}.edition_status`);
    requireString(work.external_source_url_status, `${work.id}.external_source_url_status`);
    requireString(work.distribution_statement_status, `${work.id}.distribution_statement_status`);
    requireString(work.content_license_status, `${work.id}.content_license_status`);
    requireString(work.evidence_status, `${work.id}.evidence_status`);
    for (const documentId of requireArray(work.document_ids, `${work.id}.document_ids`)) {
      const document = docsById.get(documentId);
      if (!document) fail(`${work.id}: missing document ${documentId}`);
      assertEqual(document.source_work_id, work.id, `${documentId}.source_work_id`);
    }
  }

  for (const document of documents) {
    requireString(document.source_work_id, `${document.id}.source_work_id`);
    if (!worksById.has(document.source_work_id)) fail(`${document.id}: unknown source work ${document.source_work_id}`);
    const filePath = requireString(document.path, `${document.id}.path`);
    assertEqual(document.format, "pdf", `${document.id}.format`);
    requireString(document.repository_role, `${document.id}.repository_role`);
    requireBoolean(document.runtime_linked, `${document.id}.runtime_linked`);
    requireString(document.extraction_status, `${document.id}.extraction_status`);
    requireString(document.rights_status, `${document.id}.rights_status`);
    const buffer = await readFile(path.join(root, filePath));
    assertEqual(gitBlobSha1(buffer), document.git_blob_sha1, `${filePath} Git blob SHA-1`);
    if (!buffer.subarray(0, 5).equals(Buffer.from("%PDF-", "ascii"))) fail(`${filePath}: invalid PDF signature`);
  }

  const divinity = requireObject(worksById.get("divinity-code"), "divinity-code");
  assertEqual(divinity.evidence_status, "document-and-registered-datasets", "divinity evidence status");
  assertExactSet(divinity.logical_dataset_ids, ["source-divinity-code-en", "ru-current-v1"], "divinity dataset IDs");

  const second = requireObject(
    worksById.get("unlocking-your-dreams-student-material"),
    "unlocking-your-dreams-student-material",
  );
  assertEqual(second.evidence_status, "retained-document-only", "second work evidence status");
  assertEqual(second.dataset_status, "not-extracted-not-validated-not-registered", "second work dataset status");
  assertEqual(second.logical_dataset_ids.length, 0, "second work logical dataset count");

  const currentFacts = requireObject(registry.current_facts, "current_facts");
  assertEqual(currentFacts.runtime_dataset_id, "ru-current-v1", "current runtime dataset");
  assertEqual(currentFacts.runtime_source_work_id, "divinity-code", "current runtime source work");
  assertEqual(currentFacts.registered_second_book_dataset_exists, false, "second dataset existence");
  assertEqual(currentFacts.two_source_documents_are_linked_from_runtime_menu, true, "runtime menu PDF links");
  assertEqual(currentFacts.source_field_distribution["source-divinity-code-en"].DivinityCode, EXPECTED_RECORDS, "source distribution count");
  assertEqual(currentFacts.source_field_distribution["ru-current-v1"].DivinityCode, EXPECTED_RECORDS, "current distribution count");

  const logicalIds = datasets.logical_datasets.map((entry) => entry.id);
  assertExactSet(logicalIds, ["source-divinity-code-en", "ru-current-v1"], "current dataset registry IDs");
  const auditById = new Map(audit.datasets.map((entry) => [entry.dataset_id, entry]));
  for (const datasetId of logicalIds) {
    const audited = auditById.get(datasetId);
    if (!audited) fail(`Audit report is missing ${datasetId}`);
    assertEqual(audited.record_count, EXPECTED_RECORDS, `${datasetId} audit record count`);
    assertEqual(audited.source_distribution.DivinityCode, EXPECTED_RECORDS, `${datasetId} audit source distribution`);
  }

  return registry;
}

function validateArchitectureContract(contract, sourceWorks) {
  requireObject(contract, ARCHITECTURE_PATH);
  assertEqual(contract.schema_version, 1, "architecture schema version");
  assertEqual(contract.architecture_id, "udream-two-book-architecture", "architecture ID");
  assertEqual(contract.baseline, EXPECTED_BASELINE, "architecture baseline");
  assertEqual(contract.status, "approved-architecture-not-implemented", "architecture status");
  assertEqual(contract.functional_release, EXPECTED_FUNCTIONAL_RELEASE, "architecture functional release");
  assertEqual(contract.source_work_registry, SOURCE_WORKS_PATH, "architecture source-work registry path");
  assertEqual(contract.dataset_registry, DATASETS_PATH, "architecture dataset registry path");

  const runtime = requireObject(contract.current_runtime, "current_runtime");
  assertEqual(runtime.mode, "single-dataset", "current runtime mode");
  assertEqual(runtime.dataset_id, "ru-current-v1", "current runtime dataset ID");
  assertEqual(runtime.source_work_id, "divinity-code", "current runtime source work ID");
  assertEqual(runtime.stable_fallback_dataset_id, "ru-current-v1", "stable fallback dataset ID");

  const identity = requireObject(contract.global_record_identity, "global_record_identity");
  assertExactSet(identity.components, ["dataset_id", "record_id"], "global identity components");
  assertEqual(identity.canonical_string_format, "dataset_id:record_id", "identity string format");
  assertEqual(identity.numeric_ids_are_local_to_dataset, true, "local numeric ID rule");
  assertEqual(identity.same_numeric_id_across_datasets_implies_same_record, false, "cross-dataset numeric ID rule");

  const modes = requireArray(contract.future_modes, "future_modes");
  assertExactSet(assertUniqueIds(modes, "future_modes"), EXPECTED_MODES, "future mode IDs");
  const modesById = new Map(modes.map((entry) => [entry.id, entry]));
  assertEqual(modesById.get("single").status, "current", "single mode status");
  assertEqual(modesById.get("switch").requires_registered_dataset, true, "switch registration gate");
  assertEqual(modesById.get("combined").physical_merge_forbidden, true, "combined physical merge rule");
  assertEqual(modesById.get("compare").numeric_id_matching_forbidden, true, "compare numeric ID rule");

  const provenance = requireObject(contract.result_provenance_contract, "result_provenance_contract");
  assertExactSet(
    provenance.required_fields,
    ["source_work_id", "dataset_id", "record_id", "dataset_label", "language_or_variant", "source_reference_status"],
    "required provenance fields",
  );
  assertExactSet(
    provenance.must_be_visible_on,
    ["search-result", "record-card", "shared-link-preview", "comparison-panel"],
    "provenance surfaces",
  );

  const navigation = requireObject(contract.navigation_contract, "navigation_contract");
  const queryKeys = Object.keys(requireObject(navigation.url_query_parameters, "url_query_parameters"));
  assertExactSet(queryKeys, ["mode", "dataset", "record", "compare_dataset", "compare_record", "q"], "URL query parameters");
  for (const field of ["mode", "dataset_id", "record_id", "label", "visited_at"]) {
    if (!navigation.history_entry_required_fields.includes(field)) fail(`history contract is missing ${field}`);
  }
  for (const field of ["mode", "dataset_id", "record_id", "canonical_url"]) {
    if (!navigation.share_payload_required_fields.includes(field)) fail(`share contract is missing ${field}`);
  }

  const activation = requireObject(contract.dataset_activation_contract, "dataset_activation_contract");
  if (activation.preconditions.length < 8) fail("dataset activation preconditions are incomplete");
  if (activation.activation_sequence.length < 6) fail("dataset activation sequence is incomplete");
  if (!activation.failure_behavior.includes("return to ru-current-v1")) fail("activation failure must return to stable fallback");

  const cache = requireObject(contract.cache_contract, "cache_contract");
  assertEqual(cache.ownership_prefix, "udream-", "cache ownership prefix");
  assertEqual(cache.clear_unrelated_origin_caches, false, "unrelated cache clearing rule");
  assertEqual(cache.clear_other_udream_dataset_caches_automatically, false, "other dataset cache clearing rule");
  assertEqual(cache.staging_and_active_caches_are_separate, true, "staging/active cache separation");

  const combined = requireObject(contract.combined_search_contract, "combined_search_contract");
  assertEqual(combined.index_model, "one-index-per-dataset", "combined index model");
  assertEqual(combined.result_identity, "dataset_id:record_id", "combined result identity");
  assertEqual(combined.source_labels_required, true, "combined source label requirement");
  if (!combined.deduplication.includes("do-not-collapse")) fail("combined results must not collapse without reviewed relations");

  const comparison = requireObject(contract.comparison_contract, "comparison_contract");
  assertEqual(comparison.relation_map_status, "planned-not-created", "relation map status");
  assertEqual(comparison.numeric_id_autolinking_forbidden, true, "relation numeric ID rule");
  assertEqual(comparison.default_visibility, "only-reviewed-relations", "relation default visibility");
  assertExactSet(
    comparison.allowed_relation_types,
    ["equivalent", "related", "contrast", "redirect", "ambiguous"],
    "relation types",
  );

  const second = requireObject(contract.second_book_readiness, "second_book_readiness");
  assertEqual(second.source_work_id, "unlocking-your-dreams-student-material", "second-book source ID");
  assertEqual(second.current_status, "retained-document-only", "second-book readiness status");
  assertEqual(second.registered_dataset_exists, false, "second-book registered dataset existence");
  if (second.required_before_dataset_registration.length < 8) fail("second-book readiness gate is incomplete");

  const phases = requireArray(contract.implementation_phases, "implementation_phases");
  assertExactSet(assertUniqueIds(phases, "implementation_phases"), ["D1.4", "D1.5", "D1.6", "D2.1", "D2.2"], "implementation phase IDs");
  const phasesById = new Map(phases.map((entry) => [entry.id, entry]));
  assertEqual(phasesById.get("D1.4").runtime_change, false, "D1.4 runtime boundary");
  assertEqual(phasesById.get("D1.5").status, "next", "D1.5 next status");
  assertEqual(phasesById.get("D1.6").runtime_change, false, "D1.6 runtime boundary");
  assertEqual(phasesById.get("D2.1").runtime_change, true, "D2.1 runtime boundary");
  assertEqual(phasesById.get("D2.2").runtime_change, true, "D2.2 runtime boundary");

  const hard = requireObject(contract.hard_boundaries, "hard_boundaries");
  for (const [key, value] of Object.entries(hard)) {
    assertEqual(requireBoolean(value, `hard_boundaries.${key}`), false, `hard boundary ${key}`);
  }

  const secondWork = sourceWorks.source_works.find((entry) => entry.id === second.source_work_id);
  if (!secondWork) fail("second-book architecture references an unregistered source work");
  assertEqual(secondWork.logical_dataset_ids.length, 0, "second work dataset count");
}

async function validateArchitectureDocument(root) {
  const source = await readFile(path.join(root, DOCUMENT_PATH), "utf8");
  const required = [
    "divinity-code",
    "unlocking-your-dreams-student-material",
    "retained-document-only",
    "dataset_id:record_id",
    "Federated combined search",
    "Side-by-side comparison",
    "Source location not yet verified",
    "planned-not-executed",
    "D1.5",
    "D1.6",
    "D2.1",
    "D2.2",
  ];
  for (const text of required) {
    if (!source.includes(text)) fail(`${DOCUMENT_PATH}: missing required architecture decision ${text}`);
  }
}

export async function validateTwoBookArchitecture(root = process.cwd()) {
  const datasets = requireObject(await readJson(root, DATASETS_PATH), DATASETS_PATH);
  const audit = requireObject(await readJson(root, AUDIT_REPORT_PATH), AUDIT_REPORT_PATH);
  const sourceWorks = await validateSourceWorks(root, datasets, audit);
  const architecture = await readJson(root, ARCHITECTURE_PATH);
  validateArchitectureContract(architecture, sourceWorks);
  await validateArchitectureDocument(root);
  return {
    sourceWorks: sourceWorks.source_works.length,
    sourceDocuments: sourceWorks.source_documents.length,
    registeredSecondBookDataset: sourceWorks.current_facts.registered_second_book_dataset_exists,
    modes: architecture.future_modes.length,
    nextPhase: architecture.implementation_phases.find((entry) => entry.status === "next").id,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  validateTwoBookArchitecture()
    .then((result) => {
      console.log(
        `Two-book architecture passed: ${result.sourceWorks} source work(s), `
        + `${result.sourceDocuments} retained document(s), ${result.modes} mode(s), `
        + `second-book dataset registered=${result.registeredSecondBookDataset}, next=${result.nextPhase}.`,
      );
    })
    .catch((error) => {
      console.error(`Two-book architecture validation failed: ${error.message}`);
      process.exit(1);
    });
}
