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

## Documentation, provenance and automation baseline

`v23.8.8`

- Status: D1.1 data-provenance milestone; it does not create a new application build or move the `v23.8.0` tag
- Purpose: recover and lock the verified file-level provenance of the current data files without modifying any database record
- Provenance source: `docs/DATA_PROVENANCE.md`
- Permanent validator: `scripts/validate-data-provenance.mjs`, integrated into `scripts/validate-project.mjs`
- Active dataset: `data/divinity_code_ru.json`, 4,086 records, SHA-256 `1def80216e238b0c2a8640aaf1b4e95dd0669d5944a67f4e7c4421fad55a6e64`
- English serialization A: `data/bd2.json`, SHA-256 `814c5d33444160e6f1ab20278f9356090ec0e9cc04943cd14ad99d9038be6e28`
- English serialization B: `data/db.json`, SHA-256 `4e166959d318778be57557349a152c2b466ad9db14e5634f5e5df3c87ca2cdc0`
- Canonical English JSON SHA-256: `5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1`
- Corrected classification: `bd2.json` and `db.json` are byte-different but parsed/canonical-JSON equal, so they are two serializations of one logical source dataset
- Active-dataset comparison: ordered IDs and `symbol`, `description`, `source`, `date_added` are preserved; `aliases` differ in 4,083 records and `notes`/`tags` differ in all 4,086
- Historical report: `data/report.txt`, SHA-256 `dec064b826ae20b1ded2f9bcbfeed7d1d4d1c94592ef9d0774e495689e59da1d`
- Unknown boundary: the exact generation/translation script, prompt, provider sequence and human-review record are not proven
- Previous documentation and automation baseline: `v23.8.7`, PR #22, squash merge `464b61cf7df8f27ba14bb9a4cf5ed50c8479cef8`
- Screenshot implementation remains: `tools/screenshots/` and read-only `.github/workflows/capture-screenshots.yml`
- Live handoff source: `WORK_STATUS.md`
- Unified execution protocol: `docs/AI_GITHUB_WORKFLOW.md`
- Translation source of truth: `docs/TRANSLATION_WORKFLOW.md`
- Next approved task after D1.1 merge: D1.2 dataset registry, canonical-path decision and reversible equivalent-serialization migration design
- Repository download: https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip

## Current development line

No functional application version is assigned after `v23.8.0`.

Documentation, provenance and automation updates `23.8.1` through `23.8.8` finalize the immutable release record, product/data baseline, translation safety, cross-device workflow, screenshot provenance, real Chromium artifacts and verified data provenance. They do not change application runtime, PWA behavior or database records.

## Unified version line

Version `v23.7.0` began the unified maintained-product line; `v23.8.0` is its next feature release.

The repository previously used two separate counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.5.0`, `v3.6.0`;
- legacy UI iterations: numbered folders through `019` and the visible interface label `v19`.

The product-version decision advanced the legacy visible line from `19` to `20` and combined it with the `3.7.0` development line, producing the unified version `23.7.0`. New maintained releases continue from that unified semantic version.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers.
