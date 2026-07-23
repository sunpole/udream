# Version

## Current release checkpoint

`v23.8.0`

- Tag commit: `24dece593bea679485057d7551a2583f7f1f5acf`
- Published: 2026-07-20
- Purpose: preserve the verified PWA update, cache migration and installation flow release
- Release: https://github.com/sunpole/udream/releases/tag/v23.8.0
- Verification: the immutable tag resolves to the exact functional merge commit; the release workflow re-runs tests, project validation, syntax checks and version consistency before publication
- Runtime version sources: `package.json`, `src/version.js` and `version.json` all contain `23.8.0`
- Database: the active 4,086-record JSON database is unchanged
- Previous checkpoint: `v23.7.0`

## Documentation, provenance and registry baseline

`v23.8.9`

- Status: D1.2 dataset-registry milestone; it does not create a new application build or move the `v23.8.0` tag
- Purpose: establish stable logical/physical dataset identities, canonical-retained roles and an unexecuted reversible migration plan
- Machine-readable registry: `data/datasets.json`, schema version 1
- Registry document: `docs/DATASET_REGISTRY.md`
- Registry validator: `scripts/validate-dataset-registry.mjs`, required by `.github/workflows/validate.yml`
- Source logical dataset ID: `source-divinity-code-en`
- Current localized dataset ID: `ru-current-v1`
- Canonical physical serialization: `source-divinity-code-en-bd2` at `data/bd2.json`
- Retained compatibility serialization: `source-divinity-code-en-db` at `data/db.json`
- Active runtime physical file: `ru-current-v1-runtime` at `data/divinity_code_ru.json`
- Canonical choice type: project-governance decision; it does not prove the historical original or authoritative source edition
- Migration status: `planned-not-executed`; no file removal, rename or runtime switch is approved
- Active dataset: 4,086 records, SHA-256 `1def80216e238b0c2a8640aaf1b4e95dd0669d5944a67f4e7c4421fad55a6e64`
- English serialization A: SHA-256 `814c5d33444160e6f1ab20278f9356090ec0e9cc04943cd14ad99d9038be6e28`
- English serialization B: SHA-256 `4e166959d318778be57557349a152c2b466ad9db14e5634f5e5df3c87ca2cdc0`
- Shared canonical English JSON SHA-256: `5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1`
- Previous provenance baseline: `v23.8.8`, D1.1 completed by PR #25
- Live handoff source: `WORK_STATUS.md`
- Next approved task after D1.2 merge: D1.3 data-quality audit design
- Repository download: https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip

## Current development line

No functional application version is assigned after `v23.8.0`.

Documentation, provenance and automation updates `23.8.1` through `23.8.9` finalize the immutable release record, product/data baseline, translation safety, cross-device workflow, screenshot provenance, verified data provenance and dataset-registry governance. They do not change application runtime, PWA behavior or existing database records.

## Unified version line

Version `v23.7.0` began the unified maintained-product line; `v23.8.0` is its next feature release.

The repository previously used two separate counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.5.0`, `v3.6.0`;
- legacy UI iterations: numbered folders through `019` and the visible interface label `v19`.

The product-version decision advanced the legacy visible line from `19` to `20` and combined it with the `3.7.0` development line, producing the unified version `23.7.0`. New maintained releases continue from that unified semantic version.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers.
