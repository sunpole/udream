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

Verified on 2026-07-20:

| Path | Classification | Runtime use |
|---|---|---|
| `data/divinity_code_ru.json` | Active translated and augmented database with 4,086 records | Loaded by the application |
| `data/bd2.json` | Retained English reference dataset with 4,086 records | Not used by the current runtime |
| `data/db.json` | Exact byte-for-byte duplicate of `data/bd2.json` | Not used by the current runtime |
| `data/report.txt` | Historical generation and quality summary | Not used by the current runtime |

At the time of the audit, `data/bd2.json` and `data/db.json` had the same size and SHA-256 hash:

```text
4e166959d318778be57557349a152c2b466ad9db14e5634f5e5df3c87ca2cdc0
```

Git history shows that `bd2.json` existed before the later addition of `db.json`. The exact generation and translation pipeline that produced `divinity_code_ru.json` remains undocumented, so the retained files must not yet be deleted or rewritten.

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
- validation result;
- relationship to any previous variant.

A new translation or corrected edition must be introduced as a new recoverable version. The prior version remains available until an explicit retention decision is documented.

A future merged search may combine results for users, but it must preserve the source identity of every record and must not destroy separate source datasets.

The planned D1 phase will define the dataset registry, provenance record and safe migration strategy before any user-facing source selector or merged database is implemented.

## Validation checklist

Before committing database changes:

```bash
jq empty data/divinity_code_ru.json
jq 'length' data/divinity_code_ru.json
jq 'map(.id) | length == (unique | length)' data/divinity_code_ru.json
jq 'all(.[]; (.id | type) == "number" and (.symbol | type) == "string" and (.aliases | type) == "array" and (.description | type) == "string" and (.source | type) == "string" and (.date_added | type) == "string" and (.tags | type) == "array" and (.notes | type) == "string")' data/divinity_code_ru.json
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
