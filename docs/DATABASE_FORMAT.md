# Database format

## Active file

```text
data/divinity_code_ru.json
```

At the `v3.0.0` checkpoint it contains 4,086 records.

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
| `notes` | string | Additional notes, potentially rendered as Markdown |

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

## Validation checklist

Before committing database changes:

```bash
jq empty data/divinity_code_ru.json
jq 'length' data/divinity_code_ru.json
jq 'map(.id) | length == (unique | length)' data/divinity_code_ru.json
jq 'all(.[]; (.id | type) == "number" and (.symbol | type) == "string" and (.aliases | type) == "array" and (.description | type) == "string" and (.source | type) == "string" and (.date_added | type) == "string" and (.tags | type) == "array" and (.notes | type) == "string")' data/divinity_code_ru.json
```

Record-count changes and ID changes must be explained in the commit and changelog.

## Content constraints

- Preserve original source meaning and references.
- Distinguish source text, translation, editorial notes, and generated tags.
- Do not invent biblical references or silently strengthen interpretations.
- Record the tool/script and source revision used for bulk transformations.
