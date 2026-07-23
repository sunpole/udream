# uDream data-quality audit

Audit baseline: `23.8.10`
Registry baseline: `23.8.9`
Structural gate: **PASS**

This report is generated deterministically by `scripts/audit-data-quality.mjs`. It does not modify data and does not treat heuristic findings as proven content errors.

## Scope

- Logical datasets audited: 2
- Source/current record count: 4086 / 4086
- Ordered ID range expected: 1–4086
- Existing source/current files are read-only inputs.

## Severity model

| Severity | Meaning | CI behavior |
|---|---|---|
| `error` | Structural or identity contract violation | Fails audit gate |
| `warning` | Likely formatting/data hygiene problem | Reported; requires review |
| `review` | Ambiguity or content question not safely auto-fixable | Human/source review |
| `info` | Observation or statistics | Informational |

## Summary

| Severity | Finding instances | Finding groups |
|---|---:|---:|
| error | 0 | 0 |
| warning | 0 | 0 |
| review | 5022 | 5 |
| info | 0 | 0 |

## Dataset metrics

| Dataset | Path | Records | Ordered IDs | Unique IDs | No aliases | No tags |
|---|---|---:|---|---|---:|---:|
| `source-divinity-code-en` | `data/bd2.json` | 4086 | yes | yes | 2482 | 153 |
| `ru-current-v1` | `data/divinity_code_ru.json` | 4086 | yes | yes | 2 | 0 |

## Source/current comparison

- IDs aligned: **yes**
- Preserved-field differences: `{"id":0,"symbol":0,"description":0,"source":0,"date_added":0}`
- Allowed changed-field differences: `{"aliases":4083,"notes":4086,"tags":4086}`

## Findings

| Severity | Rule | Dataset | Count | Sample IDs |
|---|---|---|---:|---|
| review | `alias_collision_across_records` | `ru-current-v1` | 854 | 3, 4, 5, 8, 10, 13, 14, 19, 23, 24, 25, 26, 27, 28, 35, 36, 37, 38, 39, 40 |
| review | `alias_matches_other_primary_symbol` | `ru-current-v1` | 1145 | 2, 3, 5, 8, 10, 12, 13, 14, 19, 23, 24, 25, 26, 27, 28, 32, 35, 36, 37, 38 |
| review | `alias_collision_across_records` | `source-divinity-code-en` | 693 | 3, 4, 5, 8, 10, 13, 14, 23, 24, 25, 26, 27, 28, 35, 36, 37, 38, 39, 40, 52 |
| review | `alias_matches_other_primary_symbol` | `source-divinity-code-en` | 1145 | 2, 3, 5, 8, 10, 12, 13, 14, 19, 23, 24, 25, 26, 27, 28, 32, 35, 36, 37, 38 |
| review | `notes_empty` | `source-divinity-code-en` | 1185 | 47, 59, 72, 116, 320, 408, 447, 448, 449, 477, 553, 576, 585, 590, 857, 858, 886, 909, 924, 945 |

### review: alias_collision_across_records

A normalized alias points to more than one record and may be intentionally shared or ambiguous.

Dataset/comparison: `ru-current-v1`. Count: **854**. Sample IDs: 3, 4, 5, 8, 10, 13, 14, 19, 23, 24, 25, 26, 27, 28, 35, 36, 37, 38, 39, 40.

Details: `{"sample_keys":["black man","first nations peoples","foreigner","native/s","birth","under","underwater","seed","snake","boat"]}`

### review: alias_matches_other_primary_symbol

An alias matches another record's normalized primary symbol and requires routing review.

Dataset/comparison: `ru-current-v1`. Count: **1145**. Sample IDs: 2, 3, 5, 8, 10, 12, 13, 14, 19, 23, 24, 25, 26, 27, 28, 32, 35, 36, 37, 38.

Details: `{"sample_keys":["bigfoot","black man","first nations peoples","foreigner","native/s","under","underwater","seed","snake","boat"]}`

### review: alias_collision_across_records

A normalized alias points to more than one record and may be intentionally shared or ambiguous.

Dataset/comparison: `source-divinity-code-en`. Count: **693**. Sample IDs: 3, 4, 5, 8, 10, 13, 14, 23, 24, 25, 26, 27, 28, 35, 36, 37, 38, 39, 40, 52.

Details: `{"sample_keys":["black man","first nations peoples","foreigner","native/s","birth","under","underwater","seed","snake","boat"]}`

### review: alias_matches_other_primary_symbol

An alias matches another record's normalized primary symbol and requires routing review.

Dataset/comparison: `source-divinity-code-en`. Count: **1145**. Sample IDs: 2, 3, 5, 8, 10, 12, 13, 14, 19, 23, 24, 25, 26, 27, 28, 32, 35, 36, 37, 38.

Details: `{"sample_keys":["bigfoot","black man","first nations peoples","foreigner","native/s","under","underwater","seed","snake","boat"]}`

### review: notes_empty

notes is empty or whitespace-only.

Dataset/comparison: `source-divinity-code-en`. Count: **1185**. Sample IDs: 47, 59, 72, 116, 320, 408, 447, 448, 449, 477, 553, 576, 585, 590, 857, 858, 886, 909, 924, 945.

## Important limitations

- Heuristic warnings and review findings are not proven semantic errors.
- The exact historical translation pipeline and complete human-review record remain unknown.
- Cross-reference-like and biblical-reference-like text is counted but not automatically validated against source books.
- The audit does not decide theological correctness, preferred wording or final translation quality.
- No finding is corrected by this script; fixes require separate reviewed data patches.

## Reproduce

```bash
node scripts/audit-data-quality.mjs
node scripts/audit-data-quality.mjs --check
```

Content corrections must be handled in later separate reviewed data patches. This audit never rewrites the source or current dataset.

