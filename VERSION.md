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

## Documentation, provenance, registry and audit baseline

`v23.8.10`

- Status: D1.3 non-destructive data-quality audit milestone; it does not create a new application build or move the `v23.8.0` tag
- Purpose: define deterministic audit rules, inspect all registered source/current records and preserve the results without modifying data
- Audit specification: `docs/DATA_QUALITY_AUDIT.md`
- Audit script: `scripts/audit-data-quality.mjs`
- Machine report: `reports/data-quality-audit.json`
- Human report: `reports/data-quality-audit.md`
- CI command: `node scripts/audit-data-quality.mjs --check`
- Logical datasets audited: `source-divinity-code-en`, `ru-current-v1`
- Records audited: 4,086 in each logical dataset
- ID result: unique, ordered and aligned from 1 through 4,086
- Preserved-field differences: 0 for `id`, `symbol`, `description`, `source` and `date_added`
- Expected changed-field differences: aliases 4,083; notes 4,086; tags 4,086
- Structural gate: pass
- Structural error instances: 0
- Warning instances: 0
- Human-review instances: 5,022 in five aggregated finding groups
- Important limitation: review counts are heuristic candidates, not 5,022 proven content errors; one record may appear in multiple groups
- Data mutation policy: read-only; no finding is corrected by the audit
- Registry baseline: `v23.8.9`, D1.2 completed by PR #27
- Source logical dataset ID: `source-divinity-code-en`
- Current localized dataset ID: `ru-current-v1`
- Canonical physical serialization: `source-divinity-code-en-bd2` at `data/bd2.json`
- Retained compatibility serialization: `source-divinity-code-en-db` at `data/db.json`
- Active runtime physical file: `ru-current-v1-runtime` at `data/divinity_code_ru.json`
- Migration status: `planned-not-executed`; no file removal, rename or runtime switch is approved
- Active dataset SHA-256: `1def80216e238b0c2a8640aaf1b4e95dd0669d5944a67f4e7c4421fad55a6e64`
- Shared canonical English JSON SHA-256: `5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1`
- Live handoff source: `WORK_STATUS.md`
- Next approved task after D1.3 merge: D1.4 two-book product architecture
- Repository download: https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip

## Current development line

No functional application version is assigned after `v23.8.0`.

Documentation, provenance and automation updates `23.8.1` through `23.8.10` finalize the immutable release record, product/data baseline, translation safety, cross-device workflow, screenshot provenance, verified data provenance, dataset-registry governance and deterministic data-quality reporting. They do not change application runtime, PWA behavior or existing database records.

## Unified version line

Version `v23.7.0` began the unified maintained-product line; `v23.8.0` is its next feature release.

The repository previously used two separate counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.5.0`, `v3.6.0`;
- legacy UI iterations: numbered folders through `019` and the visible interface label `v19`.

The product-version decision advanced the legacy visible line from `19` to `20` and combined it with the `3.7.0` development line, producing the unified version `23.7.0`. New maintained releases continue from that unified semantic version.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers.
