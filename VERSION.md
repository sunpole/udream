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

`v23.8.6`

- Status: documentation and repository-governance milestone; it does not create a new application build or move the `v23.8.0` tag
- Purpose: make GitHub the unambiguous source of truth for any number of chats, devices and AI agents
- Live handoff source: `WORK_STATUS.md`
- Unified execution protocol: `docs/AI_GITHUB_WORKFLOW.md`
- Real screenshot contract: `docs/SCREENSHOT_AUTOMATION.md`
- Pull Request policy: every new patchnote adds a new real PNG/JPEG and screenshot provenance metadata
- Validation: `scripts/validate-project.mjs` checks handoff structure and new screenshot metadata; `scripts/validate-patchnote-diff.mjs` requires the new image in the same Pull Request
- Previous documentation baseline: `v23.8.5`, PR #20, merge `639b2fc1309cd3e5c69236af98e14c26cc541523`
- Final cross-device status before this task: commit `ac7dfe6b49567d29b0d994f04a3c9d315a7aaf5f`
- Next approved operational patch: `23.8.7` — Playwright screenshot capture and workflow artifacts
- Next approved product/data series after `23.8.7`: D1, beginning with D1.1 provenance recovery
- Product source of truth: `docs/PRODUCT_VISION.md`
- Translation source of truth: `docs/TRANSLATION_WORKFLOW.md`
- Repository download: https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip

## Current development line

No functional application version is assigned after `v23.8.0`.

Documentation updates `23.8.1` through `23.8.6` finalize the immutable release record, product/data baseline, translation safety, cross-device handoff and unified AI/GitHub workflow. They do not change application runtime, PWA behavior or database records.

## Unified version line

Version `v23.7.0` began the unified maintained-product line; `v23.8.0` is its next feature release.

The repository previously used two separate counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.5.0`, `v3.6.0`;
- legacy UI iterations: numbered folders through `019` and the visible interface label `v19`.

The product-version decision advanced the legacy visible line from `19` to `20` and combined it with the `3.7.0` development line, producing the unified version `23.7.0`. New maintained releases continue from that unified semantic version.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers.
