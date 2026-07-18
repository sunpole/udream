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

## Current variants

The repository also contains:

```text
data/bd2.json
data/db.json
```

Each currently has 4,086 records, but the byte content differs. They must not be treated as interchangeable until their provenance and transformation differences are documented.

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
