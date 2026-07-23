# Version

## Current release checkpoint

`v23.8.0`

- Tag commit: `24dece593bea679485057d7551a2583f7f1f5acf`
- Published: 2026-07-20
- Purpose: preserve the verified PWA update, cache migration and installation flow release
- Release: https://github.com/sunpole/udream/releases/tag/v23.8.0
- Runtime version sources: `package.json`, `src/version.js` and `version.json` all contain `23.8.0`
- Active database: 4,086 records, unchanged
- Previous checkpoint: `v23.7.0`

## Documentation, data and architecture baseline

`v23.8.11`

- Status: D1.4 two-book architecture milestone; no new application build and no movement of the `v23.8.0` tag
- Purpose: define safe multi-book identity, provenance, modes, routing, validation, caching, fallback and rollback before implementation
- Human architecture: `docs/TWO_BOOK_ARCHITECTURE.md`
- Machine-readable architecture: `docs/two-book-architecture.json`
- Validator: `scripts/validate-two-book-architecture.mjs`
- CI command: `node scripts/validate-two-book-architecture.mjs`
- Current default dataset: `ru-current-v1`
- Current source dataset: `source-divinity-code-en`
- Second source work status: retained PDF evidence only; no registered second-book dataset exists
- Global record identity: `(dataset_id, record_id)`
- Recommended order: separate mode, then federated combined search, then reviewed side-by-side comparison
- Combined search rule: independent indexes and provenance-preserving result federation; no destructive JSON merge
- Comparison rule: explicit reviewed relation map; no numeric-ID equivalence across books
- Stable fallback: `ru-current-v1`
- Runtime/data policy: existing data files, runtime, PWA, package metadata, saved versions and archive remain unchanged
- Previous baselines: D1.1 `23.8.8`, D1.2 `23.8.9`, D1.3 `23.8.10`
- Live handoff source: `WORK_STATUS.md`
- Repository download: https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip

## Current development line

No functional application version is assigned after `v23.8.0`.

Documentation, provenance, registry, audit and architecture updates `23.8.1` through `23.8.11` do not change application runtime, PWA behavior or existing database records.

The next implementation phase must be approved separately. A second-book dataset must first be extracted, validated, registered and reviewed before selector, combined search or comparison UI work begins.

## Unified version line

Version `v23.7.0` began the unified maintained-product line; `v23.8.0` is its next feature release.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers. Existing release tags are immutable.
