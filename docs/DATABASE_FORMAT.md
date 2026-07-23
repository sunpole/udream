# Database format

## Active runtime file

```text
data/divinity_code_ru.json
```

At release `v23.8.0` it contains 4,086 records and remains the only active published runtime database.

`data/datasets.json` is governance metadata. `reports/` contains deterministic audit outputs. Neither is loaded by the browser application or Service Worker.

## Record schema

```json
{
  "id": 1,
  "symbol": "example",
  "aliases": [],
  "description": "...",
  "source": "DivinityCode",
  "date_added": "2026-05-24",
  "tags": [],
  "notes": "..."
}
```

| Field | Type | Purpose |
|---|---|---|
| `id` | number | Stable record identifier |
| `symbol` | string | Main searchable symbol/name |
| `aliases` | array of strings | Alternative names and cross-search terms |
| `description` | string | Interpretation text and references |
| `source` | string | Source identifier |
| `date_added` | string | Date in `YYYY-MM-DD` form |
| `tags` | array of strings | Filtering and category terms |
| `notes` | string | Additional plain-text notes rendered with safe paragraphs and line breaks |

The application does not interpret notes as Markdown or raw HTML. Imported display values are escaped before DOM insertion.

## Dataset registry schema

Machine-readable registry:

```text
data/datasets.json
```

Registry schema version: `1`.

Top-level sections:

| Field | Purpose |
|---|---|
| `logical_datasets` | Stable logical identities independent of physical file count |
| `physical_files` | Exact serializations, paths, hashes, roles and statuses |
| `supporting_files` | Retained reports/evidence that are not record datasets |
| `canonical_selection` | Current project-governance choice and limitation |
| `reference_audit` | Runtime and historical path classification |
| `migration_plan` | Future reversible migration design; not execution |
| `translation_variant_policy` | Non-destructive translation rules |

Each logical dataset records ID, role, language, status, record count, ordered ID range, canonical hash, physical files and source relationship. Each physical file records ID, path, role, status, bytes, raw/canonical hashes, record count and introduction commit.

## Current registered identities

### Logical datasets

| ID | Classification | Runtime use |
|---|---|---|
| `source-divinity-code-en` | One English source logical dataset | no |
| `ru-current-v1` | Current mixed-language localized and augmented dataset | yes |

### Physical files

| Physical ID | Path | Classification | Runtime use |
|---|---|---|---|
| `source-divinity-code-en-bd2` | `data/bd2.json` | canonical retained English serialization | no |
| `source-divinity-code-en-db` | `data/db.json` | retained equivalent compatibility serialization | no |
| `ru-current-v1-runtime` | `data/divinity_code_ru.json` | active runtime serialization | yes |
| `data-quality-report-v1` | `data/report.txt` | historical supporting report | no |

Raw SHA-256 values:

```text
data/bd2.json               814c5d33444160e6f1ab20278f9356090ec0e9cc04943cd14ad99d9038be6e28
data/db.json                4e166959d318778be57557349a152c2b466ad9db14e5634f5e5df3c87ca2cdc0
data/divinity_code_ru.json  1def80216e238b0c2a8640aaf1b4e95dd0669d5944a67f4e7c4421fad55a6e64
data/report.txt              dec064b826ae20b1ded2f9bcbfeed7d1d4d1c94592ef9d0774e495689e59da1d
```

The English files share canonical JSON SHA-256:

```text
5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1
```

They are one logical dataset, not two translations. The active dataset canonical JSON SHA-256 is:

```text
c3682a50dec3303b7a100abefb27befd2dfd5d84e66d219252cf099b1a0fcd64
```

The active dataset keeps `id`, `symbol`, `description`, `source` and `date_added`; `aliases`, `notes` and `tags` differ. The historical transformation pipeline remains unknown.

## Canonical physical decision

D1.2 selects `data/bd2.json` / `source-divinity-code-en-bd2` as the maintained canonical physical serialization through a project-governance decision.

This does not prove historical originality or a particular external edition. `data/db.json` remains retained and unchanged.

```text
planned-not-executed
remove_or_rename_approved: false
```

Any later physical migration requires a separate reversible patch, immutable checkpoint and rollback.

## D1.3 audit contract

Read-only audit inputs are the registered canonical source and current datasets. Outputs:

```text
reports/data-quality-audit.json
reports/data-quality-audit.md
```

The permanent command is:

```bash
node scripts/audit-data-quality.mjs
node scripts/audit-data-quality.mjs --check
```

Audit report schema version: `1`. The report records:

- audit and registry baselines;
- exact dataset paths, physical IDs, bytes and hashes;
- record count, ordered/unique ID status and range;
- field population, source/date distributions and selected text statistics;
- source/current alignment and difference counts;
- aggregated findings with severity, rule ID, count and sample IDs;
- structural gate and limitations.

Severity meanings:

| Severity | Meaning |
|---|---|
| `error` | Structural or registered-identity violation; fails CI |
| `warning` | Likely hygiene issue requiring review |
| `review` | Ambiguity/content candidate not safe to auto-fix |
| `info` | Statistics/observation |

Current verified result:

```text
records per logical dataset: 4086
ordered/unique/aligned IDs: true
preserved-field differences: 0
changed fields: aliases 4083, notes 4086, tags 4086
structural errors: 0
warnings: 0
review instances: 5022 in 5 groups
structural gate: pass
```

Review instances can overlap and do not equal proven errors. Shared aliases and empty source notes may be intentional. The audit never modifies data.

Full rules are in `docs/DATA_QUALITY_AUDIT.md`; factual results are in `reports/data-quality-audit.md`.

## Target dataset model

| Logical role | Intended quantity | Notes |
|---|---:|---|
| Canonical source dataset | 1 | Original-language or closest retained source representation |
| Current Russian/localized dataset | 1 | Published runtime version |
| Alternative Russian translation A | 0–1 | Independent candidate |
| Alternative Russian translation B | 0–1 | Second candidate only when quality justifies it |

Equivalent serializations are one logical dataset. A new translation or corrected edition must use a new recoverable logical dataset and physical file; the prior version remains available.

## AI-assisted candidate datasets

An API-generated translation must be a separate candidate and must never overwrite `data/divinity_code_ru.json`.

For every run, record source ID/hash, fields, provider/model, prompt version, parameters, checkpoint state, candidate hash, validation and human-review status. API keys never enter Git, JSON, browser code, logs, reports or patchnotes.

## Validation checklist

```bash
jq empty data/divinity_code_ru.json
jq 'length' data/divinity_code_ru.json
jq 'map(.id) | length == (unique | length)' data/divinity_code_ru.json
node scripts/validate-data-provenance.mjs
node scripts/validate-dataset-registry.mjs
node scripts/audit-data-quality.mjs --check
node scripts/validate-project.mjs
```

Record-count, ID, source, translation, registry or audit-contract changes require a separate reviewed patch with changelog and rollback documentation.

## Content constraints

- Preserve source meaning and references.
- Distinguish source text, translation, editorial notes, aliases and generated tags.
- Do not invent biblical references or silently strengthen interpretations.
- Record tools and source revisions for bulk transformations.
- Do not silently merge records from different books or editions.
- Do not delete retained source/translation variants as routine cleanup.
- Do not promote an AI-generated candidate without human review and a separate data release.
- Do not fix D1.3 findings in the audit PR itself.
