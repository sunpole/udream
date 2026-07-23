# Dataset registry

## Scope

This document records the D1.2 dataset identity and retention decision for uDream. The machine-readable source is `data/datasets.json`; the permanent validator is `scripts/validate-dataset-registry.mjs`.

D1.2 is a registry and migration-design milestone. It does **not** delete, rename or rewrite any current data file, record, ID, runtime file, PWA file, saved version or archive.

The verified evidence source remains `docs/DATA_PROVENANCE.md`.

## Approved logical datasets

| Logical dataset ID | Role | Language | Current status | Records | Canonical JSON SHA-256 |
|---|---|---|---|---:|---|
| `source-divinity-code-en` | source dataset | English | retained source | 4,086 | `5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1` |
| `ru-current-v1` | localized and augmented dataset | Russian / mixed-language | current published runtime | 4,086 | `c3682a50dec3303b7a100abefb27befd2dfd5d84e66d219252cf099b1a0fcd64` |

The English logical dataset exists once even though two physical JSON serializations are retained. The physical copies are not separate editions or translations.

`ru-current-v1` is derived from the same ordered source IDs, but the exact generation/translation pipeline remains unknown. It preserves `id`, `symbol`, `description`, `source` and `date_added`; it changes `aliases`, `notes` and `tags` by the counts recorded in `docs/DATA_PROVENANCE.md`.

## Approved physical file IDs

| Physical file ID | Path | Logical dataset | Role | Status | Raw SHA-256 |
|---|---|---|---|---|---|
| `source-divinity-code-en-bd2` | `data/bd2.json` | `source-divinity-code-en` | canonical serialization | canonical retained | `814c5d33444160e6f1ab20278f9356090ec0e9cc04943cd14ad99d9038be6e28` |
| `source-divinity-code-en-db` | `data/db.json` | `source-divinity-code-en` | compatibility serialization | retained equivalent | `4e166959d318778be57557349a152c2b466ad9db14e5634f5e5df3c87ca2cdc0` |
| `ru-current-v1-runtime` | `data/divinity_code_ru.json` | `ru-current-v1` | active runtime | runtime current | `1def80216e238b0c2a8640aaf1b4e95dd0669d5944a67f4e7c4421fad55a6e64` |

Supporting evidence is registered separately:

| Supporting file ID | Path | Role | Raw SHA-256 |
|---|---|---|---|
| `data-quality-report-v1` | `data/report.txt` | historical generation and quality summary | `dec064b826ae20b1ded2f9bcbfeed7d1d4d1c94592ef9d0774e495689e59da1d` |

## Canonical physical selection

D1.2 selects `source-divinity-code-en-bd2` / `data/bd2.json` as the maintained canonical physical serialization of `source-divinity-code-en`.

This is a **project-governance decision** based on the retained evidence:

1. the maintained `data/bd2.json` path appears before `data/db.json` in the retained Git history;
2. the two files have identical parsed and canonical JSON;
3. `data/bd2.json` is the smaller physical serialization;
4. the current runtime depends on neither English physical file.

This decision **does not prove** that `data/bd2.json` is the historical original, authoritative source edition or first file outside the retained repository history. The original download URL, exact source edition and pre-Git transformation remain unknown.

`data/db.json` remains in place as `source-divinity-code-en-db`, a retained equivalent compatibility serialization. D1.2 does not approve its deletion or rename.

## Reference audit

Current runtime contract:

```text
active runtime path: data/divinity_code_ru.json
English source paths: non-runtime
runtime uses English serializations: false
```

The application loader and Service Worker continue to use only `data/divinity_code_ru.json`. The registry validator rejects references to `data/bd2.json`, `data/db.json`, `data/db_v2.json` or `_archive/old-data/db_v2.json` from current runtime files.

Maintained documentation and validators may mention the English paths because they describe provenance, identity, retention and migration. Historical names retained by the audit are:

```text
data/db_v2.json
_archive/old-data/db_v2.json
```

The Git history proves path introduction and reorganization points, but it does not prove the original external source edition.

## Identity rules

A logical dataset is defined by content identity and provenance, not by file count.

- Raw SHA-256 identifies an exact physical serialization.
- Canonical JSON SHA-256 identifies parsed JSON content after insignificant formatting and object-key order are normalized.
- Two files with different raw hashes but the same canonical hash can be physical serializations of one logical dataset.
- A translation, editorial variant or independently changed content receives a new logical dataset ID.
- A future translation must never overwrite `ru-current-v1`.
- Stable IDs and source relationships must remain explicit.

## Translation topology

The approved target remains:

1. one canonical source logical dataset;
2. one current published Russian dataset;
3. up to two genuinely independent alternative Russian translations;
4. fewer alternatives when only one reliable translation can be produced.

A future candidate must receive a new dataset ID and record source hash, provider/model, prompt-template version, parameters, output hash, validation result and human-review status. DeepSeek or another provider can produce a candidate only; it cannot replace the current dataset automatically.

## Migration plan

Registry status:

```text
planned-not-executed
remove_or_rename_approved: false
```

D1.2 designs, but does not execute, a future equivalent-serialization migration.

### Preconditions for a future migration

1. verify all maintained, archived and external workflow references to `data/bd2.json`, `data/db.json` and historical `db_v2` names;
2. use a separate migration branch and Pull Request;
3. preserve both raw hashes and the shared canonical hash in permanent documentation;
4. create an immutable restoration checkpoint before changing any physical path;
5. prove that runtime, tooling and external automation do not depend on `data/db.json`;
6. define the retained archive or compatibility location before removal from the maintained data root.

### Future migration steps

1. update approved references to the canonical path in a dedicated migration patch;
2. move or retain the compatibility serialization according to the approved compatibility decision;
3. keep `data/divinity_code_ru.json` as the active runtime unless a separate functional data release changes it;
4. run provenance, registry, project and application regression checks;
5. verify GitHub Pages and saved versions;
6. publish a factual data-migration patchnote.

### Rollback

1. restore `data/db.json` from the pre-migration commit or tag;
2. restore changed references to their previous paths;
3. re-run `validate-data-provenance.mjs`, `validate-dataset-registry.mjs`, `validate-project.mjs` and the application tests;
4. confirm that the runtime still uses `data/divinity_code_ru.json`;
5. record the rollback result in the change history.

No physical migration is performed in D1.2.

## Machine-readable source

`data/datasets.json` is the authoritative registry for current logical and physical identities. It records:

- stable logical and physical IDs;
- paths and roles;
- language and status;
- bytes, raw hashes and canonical hashes;
- record count and ordered ID range;
- source relationships;
- canonical selection and its limitation;
- reference-audit facts;
- migration and rollback policy;
- translation-variant policy.

## Permanent validation

Run:

```bash
node scripts/validate-data-provenance.mjs
node scripts/validate-dataset-registry.mjs
node scripts/validate-project.mjs
```

The registry validator checks the real files rather than trusting the registry text. It verifies schema, unique IDs, exact hashes and sizes, record count, ordered IDs, canonical identity, current runtime isolation, canonical/retained roles, migration policy and synchronization of this document.

Any intentional future change to a registered file or identity requires a separate reviewed migration/data patch that updates the registry, provenance documentation, validators, changelog and rollback record together.