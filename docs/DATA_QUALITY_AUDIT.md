# Data-quality audit

## Scope

D1.3 audits the registered uDream datasets without modifying them.

Read-only inputs:

```text
data/datasets.json
data/bd2.json
data/db.json
data/divinity_code_ru.json
data/report.txt
```

The audit uses the canonical physical serialization of each registered logical dataset:

```text
source-divinity-code-en -> data/bd2.json
ru-current-v1           -> data/divinity_code_ru.json
```

`data/db.json` remains protected by provenance and registry validation as an equivalent retained serialization. The quality audit does not count it as a third logical dataset.

## Outputs

```text
reports/data-quality-audit.json
reports/data-quality-audit.md
```

Both files are generated deterministically by:

```bash
node scripts/audit-data-quality.mjs
```

CI verifies that committed reports are current:

```bash
node scripts/audit-data-quality.mjs --check
```

The script never writes to `data/`, runtime, PWA, saved versions or archives.

## Severity model

| Severity | Meaning | Automatic action |
|---|---|---|
| `error` | Structural or registered-identity contract violation | Fails the audit gate and CI |
| `warning` | Likely formatting or data-hygiene problem | Report only; requires review before correction |
| `review` | Ambiguity or content question that cannot be resolved safely by a heuristic | Human/source review |
| `info` | Statistics and observations | Informational |

A warning or review finding is not proof that the content is wrong. The audit reports candidates; it does not rewrite them.

## Structural checks

The audit verifies for each logical dataset:

- JSON root is an array;
- record count is 4,086;
- IDs are integers, unique and ordered from 1 through 4,086;
- required fields exist with expected types;
- `symbol`, `description`, `source`, `date_added` and `notes` are strings;
- `aliases` and `tags` are arrays of strings;
- date values use a valid `YYYY-MM-DD` calendar date;
- exact raw and canonical hashes are recorded in the report;
- source/current IDs align;
- registered preserved fields remain equal between source and current datasets.

Any structural or preserved-field mismatch is an `error`.

## Data-hygiene checks

The audit detects and aggregates:

- empty or whitespace-only required text;
- leading/trailing whitespace;
- empty array items;
- duplicate normalized aliases or tags inside one record;
- Unicode replacement characters;
- unexpected control characters;
- HTML-like markup in imported data;
- unusually long text values;
- invalid dates.

These checks use `warning` or `review` because automatic correction may change meaning.

## Identity and ambiguity checks

The audit reports:

- duplicate normalized primary symbols across records;
- normalized aliases shared by multiple records;
- aliases that match another record's primary symbol;
- aliases equal to their own primary symbol;
- records with identical content except for ID.

Such cases may be intentional redirects, synonyms or source-book structure. They require human/source review and are never auto-merged.

## Source/current comparison

The registered preserved fields are:

```text
id
symbol
description
source
date_added
```

Differences in those fields are structural `error` findings.

The expected transformable fields are:

```text
aliases
notes
tags
```

Their difference counts are reported as metrics, not automatically classified as errors.

## Statistics

For each dataset the report includes:

- path, physical ID, byte size and hashes;
- record count and ID range;
- number of records without aliases or tags;
- non-empty field counts;
- source and date distributions;
- counts of cross-reference-like and biblical-reference-like text;
- number of distinct normalized symbols and aliases.

These statistics help plan later human review without changing the data.

## Determinism

The report intentionally omits a generation timestamp. It is derived only from:

- registered inputs;
- audit version and rules;
- deterministic sorting and sampling.

Repeated runs on the same commit must produce byte-identical JSON and Markdown reports. `--check` fails when committed reports are missing or stale.

## Limitations

The audit cannot automatically determine:

- theological correctness;
- preferred Russian wording;
- whether a shared alias is intentional;
- whether two similar interpretations should be merged;
- whether a biblical reference is semantically correct;
- the exact historical translation pipeline;
- the completeness of previous human review.

Cross-reference-like and biblical-reference-like strings are counted but not validated against the source PDFs in D1.3.

## Correction workflow

D1.3 does not correct findings.

Any later fix must:

1. identify the exact finding and source evidence;
2. use a separate branch and data Pull Request;
3. preserve old file hashes and rollback;
4. update the relevant dataset version/identity when content changes materially;
5. run provenance, registry, audit and project validation;
6. receive human content review;
7. publish a factual data patchnote.

## Required commands

```bash
npm test
node scripts/validate-data-provenance.mjs
node scripts/validate-dataset-registry.mjs
node scripts/audit-data-quality.mjs --check
node scripts/validate-project.mjs
```

The source files remain untouched throughout the audit.