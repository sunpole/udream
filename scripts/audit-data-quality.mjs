#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const REGISTRY_PATH = "data/datasets.json";
const JSON_REPORT_PATH = "reports/data-quality-audit.json";
const MARKDOWN_REPORT_PATH = "reports/data-quality-audit.md";
const AUDIT_VERSION = "23.8.10";
const REGISTRY_BASELINE = "23.8.9";
const EXPECTED_RECORDS = 4_086;
const SAMPLE_LIMIT = 20;
const REQUIRED_FIELDS = {
  id: "number",
  symbol: "string",
  aliases: "array",
  description: "string",
  source: "string",
  date_added: "string",
  tags: "array",
  notes: "string",
};
const TEXT_FIELDS = ["symbol", "description", "source", "date_added", "notes"];
const PRESERVED_FIELDS = ["id", "symbol", "description", "source", "date_added"];
const CHANGED_FIELDS = ["aliases", "notes", "tags"];
const SEVERITY_ORDER = new Map([
  ["error", 0],
  ["warning", 1],
  ["review", 2],
  ["info", 3],
]);
const CONTROL_CHARACTER_RE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const HTML_LIKE_RE = /<\/?[a-z][^>]*>/i;
const CROSS_REFERENCE_RE = /\b(?:see|refer(?:ence)?|см\.?|смотри|смотрите)\b/i;
const BIBLE_REFERENCE_RE = /\b(?:[1-3]\s*)?[A-Za-zА-Яа-яЁё]{2,}\.?\s+\d{1,3}:\d{1,3}(?:[-–]\d{1,3})?\b/u;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function fail(message) {
  throw new Error(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("ru-RU");
}

function valueType(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function isValidDate(value) {
  if (!DATE_RE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function increment(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function sortedObjectFromMap(map) {
  return Object.fromEntries([...map.entries()].sort(([a], [b]) => String(a).localeCompare(String(b), "en")));
}

function uniqueSortedNumbers(values) {
  return [...new Set(values)].sort((a, b) => a - b);
}

function sample(values) {
  return uniqueSortedNumbers(values).slice(0, SAMPLE_LIMIT);
}

function createCollector(datasetId) {
  const buckets = new Map();

  function record(severity, ruleId, recordId, message) {
    if (!SEVERITY_ORDER.has(severity)) fail(`Unknown severity: ${severity}`);
    const key = `${severity}\u0000${ruleId}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        severity,
        rule_id: ruleId,
        dataset_id: datasetId,
        count: 0,
        sample_ids: [],
        message,
      });
    }
    const finding = buckets.get(key);
    finding.count += 1;
    if (Number.isInteger(recordId) && finding.sample_ids.length < SAMPLE_LIMIT) {
      finding.sample_ids.push(recordId);
    }
  }

  function recordGroup(severity, ruleId, count, recordIds, message, details = undefined) {
    if (!count) return;
    const key = `${severity}\u0000${ruleId}`;
    const finding = {
      severity,
      rule_id: ruleId,
      dataset_id: datasetId,
      count,
      sample_ids: sample(recordIds),
      message,
    };
    if (details !== undefined) finding.details = details;
    buckets.set(key, finding);
  }

  function findings() {
    return [...buckets.values()].sort((a, b) => {
      return SEVERITY_ORDER.get(a.severity) - SEVERITY_ORDER.get(b.severity)
        || a.rule_id.localeCompare(b.rule_id, "en")
        || a.dataset_id.localeCompare(b.dataset_id, "en");
    });
  }

  return { record, recordGroup, findings };
}

async function readJson(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath));
  let parsed;
  try {
    parsed = JSON.parse(raw.toString("utf8"));
  } catch (error) {
    fail(`${relativePath}: invalid JSON (${error.message})`);
  }
  return { raw, parsed };
}

function inspectString(record, field, collector, metrics) {
  const value = record[field];
  if (typeof value !== "string") return;
  if (value !== value.trim()) collector.record("warning", `${field}_outer_whitespace`, record.id, `${field} has leading or trailing whitespace.`);
  if (!value.trim()) {
    const severity = field === "symbol" ? "error" : field === "description" || field === "source" ? "warning" : "review";
    collector.record(severity, `${field}_empty`, record.id, `${field} is empty or whitespace-only.`);
  }
  if (value.includes("\ufffd")) collector.record("warning", `${field}_replacement_character`, record.id, `${field} contains Unicode replacement characters.`);
  if (CONTROL_CHARACTER_RE.test(value)) collector.record("warning", `${field}_control_character`, record.id, `${field} contains unexpected control characters.`);
  if (HTML_LIKE_RE.test(value)) collector.record("review", `${field}_html_like`, record.id, `${field} contains HTML-like markup and requires source review.`);
  if (value.length > 10_000) collector.record("review", `${field}_very_long`, record.id, `${field} is unusually long (>10,000 characters).`);
  if (CROSS_REFERENCE_RE.test(value)) metrics.cross_reference_like_records.add(record.id);
  if (BIBLE_REFERENCE_RE.test(value)) metrics.bible_reference_like_records.add(record.id);
}

function inspectStringArray(record, field, collector, metrics) {
  const value = record[field];
  if (!Array.isArray(value)) return;
  const normalized = new Map();
  for (const [index, item] of value.entries()) {
    if (typeof item !== "string") {
      collector.record("error", `${field}_non_string_item`, record.id, `${field} contains a non-string item.`);
      continue;
    }
    if (!item.trim()) collector.record("warning", `${field}_empty_item`, record.id, `${field} contains an empty item.`);
    if (item !== item.trim()) collector.record("warning", `${field}_item_outer_whitespace`, record.id, `${field} contains an item with outer whitespace.`);
    if (item.includes("\ufffd")) collector.record("warning", `${field}_replacement_character`, record.id, `${field} contains Unicode replacement characters.`);
    if (CONTROL_CHARACTER_RE.test(item)) collector.record("warning", `${field}_control_character`, record.id, `${field} contains unexpected control characters.`);
    if (HTML_LIKE_RE.test(item)) collector.record("review", `${field}_html_like`, record.id, `${field} contains HTML-like markup.`);
    const key = normalizeText(item);
    if (key) {
      if (normalized.has(key)) collector.record("warning", `${field}_duplicate_inside_record`, record.id, `${field} contains duplicate normalized values.`);
      else normalized.set(key, index);
    }
  }
  if (field === "aliases" && value.length === 0) metrics.records_without_aliases += 1;
  if (field === "tags" && value.length === 0) metrics.records_without_tags += 1;
}

function inspectDataset(datasetId, physicalId, relativePath, raw, records) {
  const collector = createCollector(datasetId);
  const metrics = {
    record_count: Array.isArray(records) ? records.length : 0,
    ordered_ids: true,
    unique_ids: true,
    id_min: null,
    id_max: null,
    records_without_aliases: 0,
    records_without_tags: 0,
    cross_reference_like_records: new Set(),
    bible_reference_like_records: new Set(),
    source_distribution: new Map(),
    date_distribution: new Map(),
    field_non_empty_counts: Object.fromEntries(Object.keys(REQUIRED_FIELDS).map((field) => [field, 0])),
  };

  if (!Array.isArray(records)) {
    collector.recordGroup("error", "dataset_not_array", 1, [], "Dataset root is not an array.");
    return { collector, metrics, symbolIndex: new Map(), aliasIndex: new Map(), signatureIndex: new Map() };
  }

  if (records.length !== EXPECTED_RECORDS) {
    collector.recordGroup("error", "record_count_mismatch", 1, [], `Expected ${EXPECTED_RECORDS} records, found ${records.length}.`, {
      expected: EXPECTED_RECORDS,
      actual: records.length,
    });
  }

  const seenIds = new Set();
  const symbolIndex = new Map();
  const aliasIndex = new Map();
  const signatureIndex = new Map();
  const ids = [];

  for (const [index, record] of records.entries()) {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      collector.record("error", "record_not_object", index + 1, "Record is not an object.");
      metrics.ordered_ids = false;
      continue;
    }

    const id = record.id;
    if (!Number.isInteger(id)) {
      collector.record("error", "id_not_integer", index + 1, "Record ID is not an integer.");
      metrics.ordered_ids = false;
    } else {
      ids.push(id);
      if (seenIds.has(id)) {
        collector.record("error", "id_duplicate", id, "Record ID is duplicated.");
        metrics.unique_ids = false;
      }
      seenIds.add(id);
      if (id !== index + 1) {
        collector.record("error", "id_not_ordered", id, "Record ID does not match its one-based array position.");
        metrics.ordered_ids = false;
      }
    }

    for (const [field, expectedType] of Object.entries(REQUIRED_FIELDS)) {
      const actualType = valueType(record[field]);
      if (actualType !== expectedType) {
        collector.record("error", `${field}_wrong_type`, Number.isInteger(id) ? id : index + 1, `${field} must be ${expectedType}, found ${actualType}.`);
      } else if (
        (typeof record[field] === "string" && record[field].trim())
        || (Array.isArray(record[field]) && record[field].length)
        || field === "id"
      ) {
        metrics.field_non_empty_counts[field] += 1;
      }
    }

    for (const field of TEXT_FIELDS) inspectString(record, field, collector, metrics);
    inspectStringArray(record, "aliases", collector, metrics);
    inspectStringArray(record, "tags", collector, metrics);

    if (typeof record.date_added === "string") {
      if (!isValidDate(record.date_added)) collector.record("warning", "date_added_invalid", id, "date_added is not a valid YYYY-MM-DD calendar date.");
      else increment(metrics.date_distribution, record.date_added);
    }
    if (typeof record.source === "string") increment(metrics.source_distribution, record.source.trim() || "<empty>");

    if (typeof record.symbol === "string") {
      const symbolKey = normalizeText(record.symbol);
      if (symbolKey) {
        if (!symbolIndex.has(symbolKey)) symbolIndex.set(symbolKey, []);
        symbolIndex.get(symbolKey).push(id);
      }
    }

    if (Array.isArray(record.aliases)) {
      const symbolKey = normalizeText(record.symbol);
      for (const alias of record.aliases) {
        if (typeof alias !== "string") continue;
        const aliasKey = normalizeText(alias);
        if (!aliasKey) continue;
        if (!aliasIndex.has(aliasKey)) aliasIndex.set(aliasKey, []);
        aliasIndex.get(aliasKey).push(id);
        if (aliasKey === symbolKey) collector.record("review", "alias_equals_primary_symbol", id, "An alias normalizes to the primary symbol.");
      }
    }

    const signature = sha256(Buffer.from(stableStringify({
      symbol: record.symbol,
      aliases: record.aliases,
      description: record.description,
      source: record.source,
      date_added: record.date_added,
      tags: record.tags,
      notes: record.notes,
    }), "utf8"));
    if (!signatureIndex.has(signature)) signatureIndex.set(signature, []);
    signatureIndex.get(signature).push(id);
  }

  if (ids.length) {
    metrics.id_min = Math.min(...ids);
    metrics.id_max = Math.max(...ids);
  }

  const duplicateSymbols = [...symbolIndex.entries()].filter(([, recordIds]) => new Set(recordIds).size > 1);
  collector.recordGroup(
    "review",
    "duplicate_normalized_symbol_across_records",
    duplicateSymbols.length,
    duplicateSymbols.flatMap(([, recordIds]) => recordIds),
    "Multiple records share the same normalized primary symbol and require content/source review.",
    { sample_keys: duplicateSymbols.slice(0, 10).map(([key]) => key) },
  );

  const aliasCollisions = [...aliasIndex.entries()].filter(([, recordIds]) => new Set(recordIds).size > 1);
  collector.recordGroup(
    "review",
    "alias_collision_across_records",
    aliasCollisions.length,
    aliasCollisions.flatMap(([, recordIds]) => recordIds),
    "A normalized alias points to more than one record and may be intentionally shared or ambiguous.",
    { sample_keys: aliasCollisions.slice(0, 10).map(([key]) => key) },
  );

  const symbolAliasCollisions = [];
  for (const [key, aliasIds] of aliasIndex.entries()) {
    const symbolIds = symbolIndex.get(key) || [];
    const combined = new Set([...aliasIds, ...symbolIds]);
    if (symbolIds.length && combined.size > 1) symbolAliasCollisions.push([key, [...combined]]);
  }
  collector.recordGroup(
    "review",
    "alias_matches_other_primary_symbol",
    symbolAliasCollisions.length,
    symbolAliasCollisions.flatMap(([, recordIds]) => recordIds),
    "An alias matches another record's normalized primary symbol and requires routing review.",
    { sample_keys: symbolAliasCollisions.slice(0, 10).map(([key]) => key) },
  );

  const duplicateContentGroups = [...signatureIndex.values()].filter((recordIds) => new Set(recordIds).size > 1);
  collector.recordGroup(
    "review",
    "duplicate_record_content_except_id",
    duplicateContentGroups.length,
    duplicateContentGroups.flat(),
    "Multiple records have identical content except for ID and may be intentional redirects or duplicates.",
  );

  const normalizedMetrics = {
    dataset_id: datasetId,
    physical_file_id: physicalId,
    path: relativePath,
    bytes: raw.length,
    raw_sha256: sha256(raw),
    canonical_json_sha256: sha256(Buffer.from(stableStringify(records), "utf8")),
    record_count: metrics.record_count,
    ordered_ids: metrics.ordered_ids,
    unique_ids: metrics.unique_ids,
    id_min: metrics.id_min,
    id_max: metrics.id_max,
    records_without_aliases: metrics.records_without_aliases,
    records_without_tags: metrics.records_without_tags,
    records_with_cross_reference_like_text: metrics.cross_reference_like_records.size,
    records_with_bible_reference_like_text: metrics.bible_reference_like_records.size,
    field_non_empty_counts: metrics.field_non_empty_counts,
    source_distribution: sortedObjectFromMap(metrics.source_distribution),
    date_distribution: sortedObjectFromMap(metrics.date_distribution),
    normalized_primary_symbol_count: symbolIndex.size,
    normalized_alias_count: aliasIndex.size,
  };

  return { collector, metrics: normalizedMetrics, symbolIndex, aliasIndex, signatureIndex };
}

function compareDatasets(sourceDatasetId, sourceRecords, currentDatasetId, currentRecords) {
  const collector = createCollector(`${sourceDatasetId}->${currentDatasetId}`);
  const metrics = {
    source_dataset_id: sourceDatasetId,
    current_dataset_id: currentDatasetId,
    source_record_count: Array.isArray(sourceRecords) ? sourceRecords.length : 0,
    current_record_count: Array.isArray(currentRecords) ? currentRecords.length : 0,
    ids_aligned: true,
    preserved_field_difference_counts: Object.fromEntries(PRESERVED_FIELDS.map((field) => [field, 0])),
    changed_field_difference_counts: Object.fromEntries(CHANGED_FIELDS.map((field) => [field, 0])),
  };

  if (!Array.isArray(sourceRecords) || !Array.isArray(currentRecords)) {
    collector.recordGroup("error", "comparison_dataset_not_array", 1, [], "Source/current comparison requires JSON arrays.");
    return { metrics, findings: collector.findings() };
  }

  if (sourceRecords.length !== currentRecords.length) {
    collector.recordGroup("error", "comparison_record_count_mismatch", 1, [], "Source and current datasets have different record counts.", {
      source: sourceRecords.length,
      current: currentRecords.length,
    });
    metrics.ids_aligned = false;
  }

  const maxLength = Math.max(sourceRecords.length, currentRecords.length);
  for (let index = 0; index < maxLength; index += 1) {
    const source = sourceRecords[index];
    const current = currentRecords[index];
    const sampleId = Number.isInteger(current?.id) ? current.id : Number.isInteger(source?.id) ? source.id : index + 1;
    if (!source || !current || source.id !== current.id) {
      collector.record("error", "comparison_id_alignment", sampleId, "Source/current records are missing or have different IDs at the same position.");
      metrics.ids_aligned = false;
      continue;
    }
    for (const field of PRESERVED_FIELDS) {
      if (stableStringify(source[field]) !== stableStringify(current[field])) {
        metrics.preserved_field_difference_counts[field] += 1;
        collector.record("error", `preserved_field_changed_${field}`, current.id, `Preserved field ${field} differs between source and current datasets.`);
      }
    }
    for (const field of CHANGED_FIELDS) {
      if (stableStringify(source[field]) !== stableStringify(current[field])) {
        metrics.changed_field_difference_counts[field] += 1;
      }
    }
  }

  return { metrics, findings: collector.findings() };
}

function summarizeFindings(findings) {
  const bySeverity = new Map([...SEVERITY_ORDER.keys()].map((severity) => [severity, 0]));
  const groupsBySeverity = new Map([...SEVERITY_ORDER.keys()].map((severity) => [severity, 0]));
  const byRule = new Map();
  for (const finding of findings) {
    increment(bySeverity, finding.severity, finding.count);
    increment(groupsBySeverity, finding.severity, 1);
    increment(byRule, finding.rule_id, finding.count);
  }
  return {
    finding_instances_by_severity: Object.fromEntries(bySeverity),
    finding_groups_by_severity: Object.fromEntries(groupsBySeverity),
    finding_instances_by_rule: sortedObjectFromMap(byRule),
    structural_gate: (bySeverity.get("error") || 0) === 0 ? "pass" : "fail",
  };
}

function buildMarkdown(report) {
  const lines = [];
  lines.push("# uDream data-quality audit", "");
  lines.push(`Audit baseline: \`${report.audit_version}\``);
  lines.push(`Registry baseline: \`${report.registry_baseline}\``);
  lines.push(`Structural gate: **${report.summary.structural_gate.toUpperCase()}**`, "");
  lines.push("This report is generated deterministically by `scripts/audit-data-quality.mjs`. It does not modify data and does not treat heuristic findings as proven content errors.", "");

  lines.push("## Scope", "");
  lines.push(`- Logical datasets audited: ${report.datasets.length}`);
  lines.push(`- Source/current record count: ${report.comparison.source_record_count} / ${report.comparison.current_record_count}`);
  lines.push(`- Ordered ID range expected: 1–${EXPECTED_RECORDS}`);
  lines.push("- Existing source/current files are read-only inputs.", "");

  lines.push("## Severity model", "");
  lines.push("| Severity | Meaning | CI behavior |", "|---|---|---|");
  lines.push("| `error` | Structural or identity contract violation | Fails audit gate |");
  lines.push("| `warning` | Likely formatting/data hygiene problem | Reported; requires review |");
  lines.push("| `review` | Ambiguity or content question not safely auto-fixable | Human/source review |");
  lines.push("| `info` | Observation or statistics | Informational |", "");

  lines.push("## Summary", "");
  lines.push("| Severity | Finding instances | Finding groups |", "|---|---:|---:|");
  for (const severity of ["error", "warning", "review", "info"]) {
    lines.push(`| ${severity} | ${report.summary.finding_instances_by_severity[severity]} | ${report.summary.finding_groups_by_severity[severity]} |`);
  }
  lines.push("");

  lines.push("## Dataset metrics", "");
  lines.push("| Dataset | Path | Records | Ordered IDs | Unique IDs | No aliases | No tags |", "|---|---|---:|---|---|---:|---:|");
  for (const dataset of report.datasets) {
    lines.push(`| \`${dataset.dataset_id}\` | \`${dataset.path}\` | ${dataset.record_count} | ${dataset.ordered_ids ? "yes" : "no"} | ${dataset.unique_ids ? "yes" : "no"} | ${dataset.records_without_aliases} | ${dataset.records_without_tags} |`);
  }
  lines.push("");

  lines.push("## Source/current comparison", "");
  lines.push(`- IDs aligned: **${report.comparison.ids_aligned ? "yes" : "no"}**`);
  lines.push(`- Preserved-field differences: \`${JSON.stringify(report.comparison.preserved_field_difference_counts)}\``);
  lines.push(`- Allowed changed-field differences: \`${JSON.stringify(report.comparison.changed_field_difference_counts)}\``, "");

  lines.push("## Findings", "");
  if (!report.findings.length) {
    lines.push("No findings.", "");
  } else {
    lines.push("| Severity | Rule | Dataset | Count | Sample IDs |", "|---|---|---|---:|---|");
    for (const finding of report.findings) {
      const samples = finding.sample_ids.length ? finding.sample_ids.join(", ") : "—";
      lines.push(`| ${finding.severity} | \`${finding.rule_id}\` | \`${finding.dataset_id}\` | ${finding.count} | ${samples} |`);
    }
    lines.push("");
    for (const finding of report.findings) {
      lines.push(`### ${finding.severity}: ${finding.rule_id}`, "");
      lines.push(finding.message, "");
      lines.push(`Dataset/comparison: \`${finding.dataset_id}\`. Count: **${finding.count}**. Sample IDs: ${finding.sample_ids.length ? finding.sample_ids.join(", ") : "none"}.`, "");
      if (finding.details) lines.push(`Details: \`${JSON.stringify(finding.details)}\``, "");
    }
  }

  lines.push("## Important limitations", "");
  for (const limitation of report.limitations) lines.push(`- ${limitation}`);
  lines.push("");

  lines.push("## Reproduce", "", "```bash", "node scripts/audit-data-quality.mjs", "node scripts/audit-data-quality.mjs --check", "```", "");
  lines.push("Content corrections must be handled in later separate reviewed data patches. This audit never rewrites the source or current dataset.", "");
  return `${lines.join("\n")}\n`;
}

async function generateReport() {
  const { raw: registryRaw, parsed: registry } = await readJson(REGISTRY_PATH);
  if (!registry || !Array.isArray(registry.logical_datasets) || !Array.isArray(registry.physical_files)) {
    fail("Dataset registry shape is invalid");
  }

  const physicalById = new Map(registry.physical_files.map((entry) => [entry.id, entry]));
  const logicalById = new Map(registry.logical_datasets.map((entry) => [entry.id, entry]));
  const datasetIds = ["source-divinity-code-en", "ru-current-v1"];
  const inspected = [];
  const recordsByDataset = new Map();

  for (const datasetId of datasetIds) {
    const logical = logicalById.get(datasetId);
    if (!logical) fail(`Registry is missing logical dataset ${datasetId}`);
    const physical = physicalById.get(logical.canonical_physical_file_id);
    if (!physical) fail(`Registry is missing canonical physical file for ${datasetId}`);
    const { raw, parsed } = await readJson(physical.path);
    const result = inspectDataset(datasetId, physical.id, physical.path, raw, parsed);
    inspected.push({ ...result.metrics, findings: result.collector.findings() });
    recordsByDataset.set(datasetId, parsed);
  }

  const comparisonResult = compareDatasets(
    "source-divinity-code-en",
    recordsByDataset.get("source-divinity-code-en"),
    "ru-current-v1",
    recordsByDataset.get("ru-current-v1"),
  );

  const findings = [
    ...inspected.flatMap((dataset) => dataset.findings),
    ...comparisonResult.findings,
  ].sort((a, b) => {
    return SEVERITY_ORDER.get(a.severity) - SEVERITY_ORDER.get(b.severity)
      || a.dataset_id.localeCompare(b.dataset_id, "en")
      || a.rule_id.localeCompare(b.rule_id, "en");
  });

  const datasets = inspected.map(({ findings: _findings, ...metrics }) => metrics);
  const report = {
    schema_version: 1,
    audit_version: AUDIT_VERSION,
    registry_baseline: REGISTRY_BASELINE,
    registry_path: REGISTRY_PATH,
    registry_raw_sha256: sha256(registryRaw),
    deterministic: true,
    mutation_policy: "read-only",
    datasets,
    comparison: comparisonResult.metrics,
    findings,
    summary: summarizeFindings(findings),
    limitations: [
      "Heuristic warnings and review findings are not proven semantic errors.",
      "The exact historical translation pipeline and complete human-review record remain unknown.",
      "Cross-reference-like and biblical-reference-like text is counted but not automatically validated against source books.",
      "The audit does not decide theological correctness, preferred wording or final translation quality.",
      "No finding is corrected by this script; fixes require separate reviewed data patches.",
    ],
  };

  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = buildMarkdown(report);
  return { report, json, markdown };
}

async function checkReport(expected, relativePath) {
  let actual;
  try {
    actual = await readFile(path.join(ROOT, relativePath), "utf8");
  } catch (error) {
    fail(`${relativePath} is missing (${error.message})`);
  }
  if (actual !== expected) fail(`${relativePath} is stale; run node scripts/audit-data-quality.mjs`);
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const { report, json, markdown } = await generateReport();

  if (report.summary.structural_gate !== "pass") {
    fail(`Structural audit gate failed with ${report.summary.finding_instances_by_severity.error} error finding instance(s)`);
  }

  if (checkOnly) {
    await checkReport(json, JSON_REPORT_PATH);
    await checkReport(markdown, MARKDOWN_REPORT_PATH);
    console.log(
      `Data-quality audit reports are current: ${report.datasets.length} datasets, `
      + `${report.datasets[0].record_count} source records, `
      + `${report.summary.finding_instances_by_severity.warning} warning, `
      + `${report.summary.finding_instances_by_severity.review} review instance(s).`,
    );
    return;
  }

  await mkdir(path.join(ROOT, "reports"), { recursive: true });
  await writeFile(path.join(ROOT, JSON_REPORT_PATH), json, "utf8");
  await writeFile(path.join(ROOT, MARKDOWN_REPORT_PATH), markdown, "utf8");
  console.log(
    `Generated ${JSON_REPORT_PATH} and ${MARKDOWN_REPORT_PATH}: `
    + `${report.summary.finding_instances_by_severity.error} error, `
    + `${report.summary.finding_instances_by_severity.warning} warning, `
    + `${report.summary.finding_instances_by_severity.review} review instance(s).`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`Data-quality audit failed: ${error.message}`);
    process.exit(1);
  });
}
