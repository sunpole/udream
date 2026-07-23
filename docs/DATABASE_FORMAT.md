# Database format

## Active runtime file

```text
data/divinity_code_ru.json
```

At release `v23.8.0` it contains 4,086 records and remains the only active published runtime database.

The D1.2 registry file `data/datasets.json` is governance metadata. It is not a searchable record database and is not loaded by the browser application or Service Worker.

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

The maintained application does not interpret record notes as Markdown or raw HTML. Imported display values are escaped before DOM insertion.

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
| `physical_files` | Exact JSON serializations, paths, hashes, roles and statuses |
| `supporting_files` | Retained reports/evidence that are not record datasets |
| `canonical_selection` | Current project-governance choice and its limitation |
| `reference_audit` | Runtime and historical path classification |
| `migration_plan` | Future reversible migration design; not execution |
| `translation_variant_policy` | Non-destructive source/current/alternative translation rules |

Every logical dataset entry records at least:

- stable dataset ID;
- role/kind;
- source work and language;
- status;
- record count and ordered ID range;
- canonical JSON SHA-256;
- canonical physical file ID;
- all retained physical file IDs;
- source relationship or unknown transformation status when relevant.

Every physical JSON file entry records at least:

- stable physical file ID;
- logical dataset ID;
- path and format;
- role and status;
- exact byte count;
- raw SHA-256;
- canonical JSON SHA-256;
- record count;
- retained introduction commit.

## Current registered identities

### Logical datasets

| ID | Classification | Runtime use |
|---|---|---|
| `source-divinity-code-en` | One English source logical dataset | Not used by current runtime |
| `ru-current-v1` | Current mixed-language localized and augmented dataset | Loaded by the application |

### Physical files

| Physical ID | Path | Classification | Runtime use |
|---|---|---|---|
| `source-divinity-code-en-bd2` | `data/bd2.json` | canonical retained English serialization | no |
| `source-divinity-code-en-db` | `data/db.json` | retained equivalent compatibility serialization | no |
| `ru-current-v1-runtime` | `data/divinity_code_ru.json` | active runtime serialization | yes |
| `data-quality-report-v1` | `data/report.txt` | historical supporting report | no |

Corrected raw SHA-256 values:

```text
data/bd2.json               814c5d33444160e6f1ab20278f9356090ec0e9cc04943cd14ad99d9038be6e28
data/db.json                4e166959d318778be57557349a152c2b466ad9db14e5634f5e5df3c87ca2cdc0
data/divinity_code_ru.json  1def80216e238b0c2a8640aaf1b4e95dd0669d5944a67f4e7c4421fad55a6e64
data/report.txt              dec064b826ae20b1ded2f9bcbfeed7d1d4d1c94592ef9d0774e495689e59da1d
```

`data/bd2.json` and `data/db.json` share canonical JSON SHA-256:

```text
5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1
```

They contain the same ordered records and values but use different physical serialization/formatting. They are one logical dataset, not two translations.

The active dataset canonical JSON SHA-256 is:

```text
c3682a50dec3303b7a100abefb27befd2dfd5d84e66d219252cf099b1a0fcd64
```

It keeps `id`, `symbol`, `description`, `source` and `date_added` unchanged while modifying `aliases`, `notes` and `tags`. The exact generation and translation pipeline remains unknown.

Full file-level evidence is in `docs/DATA_PROVENANCE.md`. Stable identity, canonical selection and rollback policy are in `docs/DATASET_REGISTRY.md`.

## Canonical physical decision

D1.2 selects `data/bd2.json` / `source-divinity-code-en-bd2` as the maintained canonical physical serialization.

This is a project-governance decision based on retained Git order, identical canonical content, smaller physical size and absence of runtime dependency. It does not prove historical originality or a particular external source edition.

`data/db.json` remains retained and unchanged. Migration status is:

```text
planned-not-executed
remove_or_rename_approved: false
```

Any later physical migration must be a separate reversible patch with an immutable checkpoint and rollback.

## Target dataset model

| Logical role | Intended quantity | Notes |
|---|---:|---|
| Canonical source dataset | 1 | Original-language or closest retained source representation |
| Current Russian translation | 1 | Published runtime version |
| Alternative Russian translation A | 0–1 | Independent candidate for comparison |
| Alternative Russian translation B | 0–1 | Second independent candidate only when quality justifies it |

Two semantically identical serializations are one logical dataset, not two translations. The project does not require two alternative translations at any cost. When only one reliable Russian translation exists, the correct product state is one source dataset plus one Russian translation.

## Dataset and translation preservation

The current single-file runtime is not permission to overwrite other sources or translation variants.

A new translation or corrected edition must be introduced as a new recoverable logical dataset and physical file. The prior version remains available until an explicit retention decision is documented.

A future merged search may combine results for users, but it must preserve the source identity of every record and must not destroy separate source datasets.

## AI-assisted candidate datasets

An API-generated translation is stored as a separate candidate dataset. It must never overwrite `data/divinity_code_ru.json` in place.

For every AI-assisted run, record:

- exact input dataset and hash;
- fields submitted for translation;
- provider and model identifier;
- prompt-template version;
- date and relevant parameters;
- checkpoint/resume state;
- raw-output location when retained;
- normalized candidate hash;
- automatic validation report;
- human-review status.

The API key itself is never stored in Git, JSON data, browser code, logs, reports or patchnotes. Full rules are in `docs/TRANSLATION_WORKFLOW.md`.

## Validation checklist

For the current protected baseline:

```bash
jq empty data/divinity_code_ru.json
jq 'length' data/divinity_code_ru.json
jq 'map(.id) | length == (unique | length)' data/divinity_code_ru.json
node scripts/validate-data-provenance.mjs
node scripts/validate-dataset-registry.mjs
node scripts/validate-project.mjs
```

The registry validator checks real file bytes and content rather than trusting registry text. It verifies exact paths, sizes, raw/canonical hashes, record counts, ordered IDs, semantic identity, roles, policies and runtime isolation.

Record-count changes, ID changes, source changes, translation changes or registry identity changes must be explained in the commit, changelog and matching migration/data document.

## Content constraints

- Preserve original source meaning and references.
- Distinguish source text, translation, editorial notes, aliases and generated tags.
- Do not invent biblical references or silently strengthen interpretations.
- Record the tool/script and source revision used for bulk transformations.
- Do not silently merge records from different books or editions.
- Do not delete retained source or translation variants as routine cleanup.
- Do not promote an AI-generated candidate without human review and a separate data release.
