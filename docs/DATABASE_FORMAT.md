# Database format

## Active file

```text
data/divinity_code_ru.json
```

At release `v23.8.0` it contains 4,086 records and remains the active published runtime database.

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

## Current data-file classification

Verified by D1.1 on 2026-07-22:

| Path | Classification | Runtime use |
|---|---|---|
| `data/divinity_code_ru.json` | Active mixed-language localized and augmented dataset with 4,086 records | Loaded by the application |
| `data/bd2.json` | English source serialization A with 4,086 records | Not used by the current runtime |
| `data/db.json` | English source serialization B; parsed JSON is identical to `bd2.json`, but raw bytes differ | Not used by the current runtime |
| `data/report.txt` | Historical generation and quality summary | Not used by the current runtime |

Corrected raw SHA-256 values:

```text
data/bd2.json               814c5d33444160e6f1ab20278f9356090ec0e9cc04943cd14ad99d9038be6e28
data/db.json                4e166959d318778be57557349a152c2b466ad9db14e5634f5e5df3c87ca2cdc0
data/divinity_code_ru.json  1def80216e238b0c2a8640aaf1b4e95dd0669d5944a67f4e7c4421fad55a6e64
data/report.txt              dec064b826ae20b1ded2f9bcbfeed7d1d4d1c94592ef9d0774e495689e59da1d
```

`bd2.json` and `db.json` share canonical JSON SHA-256:

```text
5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1
```

They contain the same ordered records and values, but their serialization/formatting produces different physical files.

The active dataset keeps `id`, `symbol`, `description`, `source` and `date_added` unchanged while modifying `aliases`, `notes` and `tags`. The exact generation and translation pipeline remains undocumented.

Full evidence, Git history, corrected earlier claims and the D1.2 recommendation are in `docs/DATA_PROVENANCE.md`.

## Target dataset model for D1

The planned logical model is:

| Logical role | Intended quantity | Notes |
|---|---:|---|
| Canonical source dataset | 1 | Original-language or closest retained source representation |
| Current Russian translation | 1 | Published, reviewed runtime version |
| Alternative Russian translation A | 0–1 | Independent candidate for comparison |
| Alternative Russian translation B | 0–1 | Second independent candidate only when quality justifies it |

Two semantically identical serializations are one logical dataset, not two translations. D1 must identify a canonical path and prepare a reversible migration before a redundant physical serialization is removed.

The project does not require two alternative translations at any cost. When only one reliable Russian translation exists, the correct product state is one source dataset plus one Russian translation.

## Dataset and translation preservation

The current single-file runtime is not permission to overwrite other sources or translation variants.

Every future dataset or translation variant must have documented metadata covering at least:

- stable dataset identifier;
- source work and source revision;
- language;
- translation/editorial variant;
- version or date;
- creation or acquisition method;
- transformation tool and rules;
- source commit or cryptographic hash;
- validation result;
- human-review status;
- relationship to any previous variant.

A new translation or corrected edition must be introduced as a new recoverable version. The prior version remains available until an explicit retention decision is documented.

A future merged search may combine results for users, but it must preserve the source identity of every record and must not destroy separate source datasets.

The planned D1 phase will define the dataset registry, provenance record and safe migration strategy before any user-facing source selector or merged database is implemented.

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

The API key itself is never stored in Git, JSON data, browser code, logs, reports or patchnotes. Full operational rules are in `docs/TRANSLATION_WORKFLOW.md`.

## Validation checklist

Before committing database changes:

```bash
jq empty data/divinity_code_ru.json
jq 'length' data/divinity_code_ru.json
jq 'map(.id) | length == (unique | length)' data/divinity_code_ru.json
jq 'all(.[]; (.id | type) == "number" and (.symbol | type) == "string" and (.aliases | type) == "array" and (.description | type) == "string" and (.source | type) == "string" and (.date_added | type) == "string" and (.tags | type) == "array" and (.notes | type) == "string")' data/divinity_code_ru.json
node scripts/validate-data-provenance.mjs
node scripts/validate-project.mjs
```

Record-count changes, ID changes, source changes and translation changes must be explained in the commit, changelog and matching data-migration document.

## Content constraints

- Preserve original source meaning and references.
- Distinguish source text, translation, editorial notes, aliases and generated tags.
- Do not invent biblical references or silently strengthen interpretations.
- Record the tool/script and source revision used for bulk transformations.
- Do not silently merge records from different books or editions.
- Do not delete retained source or translation variants as routine cleanup.
- Do not promote an AI-generated candidate without human review and a separate data release.
