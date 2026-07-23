# Data provenance

## Scope

This document records the verified D1.1 provenance baseline for the current files under `data/`.

It is a documentation and validation milestone. It does **not** change, rename, delete or rewrite any database, record, ID, runtime file, PWA file, saved version or archive.

Evidence was regenerated on 2026-07-22 from the full Git history and the exact bytes in branch `docs/data-provenance-d1.1` after it was synchronized with `main` commit `acc91a1162521a35fcdd3d3cfbc11811f2988508`. The audit confirmed that the four maintained data files do not differ from `main`.

## Corrected conclusion

The earlier documentation statement that `data/bd2.json` and `data/db.json` were exact byte-for-byte duplicates was incorrect.

The corrected result is:

- the two files have different byte sizes and different raw SHA-256 values;
- their parsed JSON and canonical JSON are identical;
- all 4,086 records, record order, IDs, fields and values are equal;
- they are therefore **different serializations of one logical English dataset**, not two independent datasets or translations.

The active `data/divinity_code_ru.json` preserves the same 4,086 ordered IDs. Compared with either English serialization, only `aliases`, `notes` and `tags` differ. The fields `id`, `symbol`, `description`, `source` and `date_added` are unchanged.

The exact generation and translation pipeline remains unknown. No retained current script, prompt, model manifest or complete human-review record proves the full transformation from the English dataset to `data/divinity_code_ru.json`.

## Current file inventory

| Path | Logical role | Bytes | Raw SHA-256 | Records |
|---|---|---:|---|---:|
| `data/bd2.json` | English source serialization A; canonical-path candidate for D1.2 | 2,141,655 | `814c5d33444160e6f1ab20278f9356090ec0e9cc04943cd14ad99d9038be6e28` | 4,086 |
| `data/db.json` | English source serialization B; semantically identical retained copy | 2,204,553 | `4e166959d318778be57557349a152c2b466ad9db14e5634f5e5df3c87ca2cdc0` | 4,086 |
| `data/divinity_code_ru.json` | Active mixed-language localized and augmented runtime dataset | 4,688,773 | `1def80216e238b0c2a8640aaf1b4e95dd0669d5944a67f4e7c4421fad55a6e64` | 4,086 |
| `data/report.txt` | Historical generation/quality summary; not runtime data | 2,963 | `dec064b826ae20b1ded2f9bcbfeed7d1d4d1c94592ef9d0774e495689e59da1d` | — |

Neither JSON file has a UTF-8 BOM.

## Canonical JSON identity

Raw file hashes answer whether the physical files are identical. Canonical JSON hashes answer whether the parsed data is identical after object keys and insignificant formatting are normalized.

| Path | Canonical JSON bytes | Canonical SHA-256 |
|---|---:|---|
| `data/bd2.json` | 1,777,825 | `5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1` |
| `data/db.json` | 1,777,825 | `5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1` |
| `data/divinity_code_ru.json` | 4,148,207 | `c3682a50dec3303b7a100abefb27befd2dfd5d84e66d219252cf099b1a0fcd64` |

Therefore:

```text
bd2 raw SHA-256 != db raw SHA-256
bd2 parsed JSON == db parsed JSON
bd2 canonical SHA-256 == db canonical SHA-256
```

This is serialization redundancy, not content divergence.

## Verified record schema

All three JSON files contain exactly 4,086 objects. Every object contains the same eight fields:

```text
id
symbol
aliases
description
source
date_added
tags
notes
```

Verified types:

| Field | Type |
|---|---|
| `id` | integer |
| `symbol` | string |
| `aliases` | array of strings |
| `description` | string |
| `source` | string |
| `date_added` | string |
| `tags` | array of strings |
| `notes` | string |

The IDs are unique, ordered and cover `1–4086` in every file.

## English serializations compared

`data/bd2.json` and `data/db.json` have:

- 4,086 shared IDs;
- zero IDs unique to either file;
- equal record order;
- zero differing records;
- zero differences for every field;
- different raw bytes and hashes because their JSON serialization differs.

Field difference counts:

| Field | Different records |
|---|---:|
| `id` | 0 |
| `symbol` | 0 |
| `aliases` | 0 |
| `description` | 0 |
| `source` | 0 |
| `date_added` | 0 |
| `tags` | 0 |
| `notes` | 0 |

## Active runtime dataset compared with the English dataset

The comparison is identical whether the English side is `bd2.json` or `db.json`, because those two files parse to the same data.

| Field | Different records out of 4,086 |
|---|---:|
| `id` | 0 |
| `symbol` | 0 |
| `description` | 0 |
| `source` | 0 |
| `date_added` | 0 |
| `aliases` | 4,083 |
| `notes` | 4,086 |
| `tags` | 4,086 |

The active file is therefore not a complete translation of every field. It is a mixed-language localized/augmented variant that keeps the source symbols, descriptions, source labels and dates while changing aliases, notes and tags.

Aggregate character evidence:

| Dataset | Cyrillic characters | Latin characters | `[GOOGLE]` markers | `[MYMEMORY]` markers |
|---|---:|---:|---:|---:|
| English logical dataset | 0 | 931,326 | 0 | 0 |
| Active runtime dataset | 796,924 | 1,023,365 | 4,086 | 2,932 |

The marker counts are verified facts about the current bytes. They suggest automated translation or augmentation was involved, but they do not by themselves prove the exact service sequence, prompt, parameters, fallback rules or human review.

## Git history recovered

### English source line

1. Commit `4dd87e0b5c1f5d3e38f7c6b84285d91f0db09a89`, 2026-05-25 00:06:12 +03:00, added `data/db_v2.json` through an upload commit.
2. Commit `15da7fd0422405d9ecdd27db8edc7b30cb6016a5`, 2026-05-25 00:25:42 +03:00, reorganized the repository, renamed the maintained file to `data/bd2.json` and retained an archived `db_v2.json` path.
3. Commit `a885544bbf7943e5943f14e78a6581f236ad97e5`, 2026-05-25 00:30:11 +03:00, added `data/db.json` from the archived data line.

The history proves that the maintained `bd2.json` path existed before `data/db.json`. It does not prove which filename was intended as the final canonical public name.

### Active runtime line

Commit `0d1bd292dc00b3c17a6e5736049882486bafe56f`, 2026-05-27 19:37:17 +03:00, added `data/divinity_code_ru.json` through an upload commit.

No earlier commits in the retained history show its generation in incremental steps.

### Historical report

Commit `a885544bbf7943e5943f14e78a6581f236ad97e5` added `data/report.txt`.

The report confirms a 4,086-record dataset and contains section, letter, tag and suspicious-entry summaries. It is useful historical quality evidence, but it does not identify the exact file hash it analyzed and does not document the translation pipeline that later produced the active runtime file.

## Proven facts

- `data/divinity_code_ru.json` is the only current runtime database.
- All three JSON files contain 4,086 records with ordered unique IDs `1–4086`.
- `bd2.json` and `db.json` are byte-different.
- `bd2.json` and `db.json` are parsed-JSON and canonical-JSON equal.
- The active dataset preserves `id`, `symbol`, `description`, `source` and `date_added` from the English logical dataset.
- The active dataset differs in `aliases`, `notes` and `tags` with the counts recorded above.
- The active dataset contains Cyrillic content and explicit `[GOOGLE]` / `[MYMEMORY]` markers.
- The D1.1 branch does not change any maintained data file relative to `main`.
- The Git commits listed above are the retained introduction/reorganization points for the current paths.

## Reasonable inferences, not yet final decisions

- `data/divinity_code_ru.json` was derived from the same ordered 4,086-record English logical dataset because its IDs, order and five core fields match exactly.
- Automated translation or augmentation likely contributed to `aliases`, `notes` and `tags` because of the marker strings and the scale of field changes.
- `data/bd2.json` is the stronger canonical-path candidate for D1.2 because it was established in the maintained `data/` structure before `data/db.json` and has the same canonical content with fewer raw bytes.
- `data/db.json` is likely a later retained serialization/copy of the same logical source dataset, not a separate edition or translation.

These points remain inferences until D1.2 approves dataset identifiers and a reversible migration plan.

## Unknown or unproven

- the original download URL and exact source edition that produced `db_v2.json`;
- the complete script that generated or normalized the English dataset;
- why the two equivalent JSON serializations have different formatting/bytes;
- the exact translation service order and fallback logic;
- the exact prompts, parameters and model/version identifiers;
- whether every translated/augmented field received human review;
- the precise meaning of every `[GOOGLE]` and `[MYMEMORY]` marker;
- whether `data/report.txt` describes the current `bd2.json`, the later `db.json` serialization or another transient build with the same logical records;
- the final canonical dataset ID and filename;
- whether a future publication should translate the currently unchanged `symbol` and `description` fields.

## Corrected earlier diagnostics

Two earlier intermediate conclusions must not be cited:

1. The statement that `bd2.json` and `db.json` were byte-for-byte equal was false. They are semantically equal but byte-different.
2. A previous “closeness” calculation inspected a nonexistent singular field `note`. The real schema uses `notes`; that metric was invalid.

The permanent validator uses the actual schema dynamically and locks the corrected hashes and field-difference counts.

## D1.2 recommendation

D1.2 should define one logical source dataset entry and retain both physical paths until an approved migration:

```text
suggested logical id: source-divinity-code-en
canonical-path candidate: data/bd2.json
retained equivalent serialization: data/db.json
active localized dataset candidate id: ru-current-v1
```

Before removing or renaming anything, D1.2 must:

1. search all maintained and archived references to both paths;
2. record the canonical dataset ID, source edition and language;
3. preserve both current raw hashes and the shared canonical hash;
4. create a reversible migration and rollback record;
5. update runtime/cache references only in a separately approved patch;
6. preserve the old physical file in Git history and, when required, the archive;
7. run the full provenance validator and application regression suite.

No deletion, rename, selector or runtime migration is approved by D1.1.

## Permanent validation

Run:

```bash
node scripts/validate-data-provenance.mjs
node scripts/validate-project.mjs
```

The validator checks:

- exact byte sizes and SHA-256 values;
- canonical JSON hashes;
- record count, schema, types, ordered IDs and uniqueness;
- semantic equality of the two English serializations;
- exact field-difference counts for the active localized dataset;
- `data/report.txt` size and hash;
- synchronization of this document with the verified baseline.

Any intentional future data change must update this document and validator in a separately reviewed data/migration patch.
