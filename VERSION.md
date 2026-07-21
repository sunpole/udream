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

## Documentation baseline

`v23.8.5`

- Status: documentation-only milestone; it does not create a new application build or move the `v23.8.0` tag
- Purpose: add `WORK_STATUS.md` as the mandatory cross-device handoff for planned work, actual progress, pause points, completion evidence and the exact next action
- Current handoff status: `READY` — no unfinished active task or open Pull Request
- Last completed major work: PR #18, documentation baseline `23.8.4`
- Next approved series: D1 — data provenance and multi-dataset architecture
- Next exact task: D1.1 provenance recovery without changing the active 4,086-record database
- Product source of truth: `docs/PRODUCT_VISION.md`
- Translation source of truth: `docs/TRANSLATION_WORKFLOW.md`
- Cross-device work source of truth: `WORK_STATUS.md`
- Repository download: https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip

## Current development line

No functional development version is assigned after `v23.8.0`.

Documentation updates `23.8.1` through `23.8.5` finalize the immutable release record, establish the product/data baseline and add a durable cross-device work handoff. They do not change application runtime, PWA behavior or database records.

## Unified version line

Version `v23.7.0` began the unified maintained-product line; `v23.8.0` is its next feature release.

The repository previously used two separate counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.5.0`, `v3.6.0`;
- legacy UI iterations: numbered folders through `019` and the visible interface label `v19`.

The product-version decision advanced the legacy visible line from `19` to `20` and combined it with the `3.7.0` development line, producing the unified version `23.7.0`. New maintained releases continue from that unified semantic version.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers.
