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

## Documentation and automation baseline

`v23.8.7`

- Status: repository-automation milestone; it does not create a new application build or move the `v23.8.0` tag
- Purpose: generate factual desktop/mobile screenshots from the exact branch commit in real Chromium before a patchnote can publish them
- Isolated package: `tools/screenshots/`
- Pinned version: `@playwright/test`, `playwright` and `playwright-core` `1.61.1`
- Permanent workflow: `.github/workflows/capture-screenshots.yml`
- Permissions: read-only `contents: read`; the permanent workflow cannot commit or push
- Scenarios: homepage desktop, `water` desktop/mobile and Russian alias `вода` mobile
- Evidence: PNG files, per-scenario entries, manifest and Playwright results are uploaded as GitHub Actions artifacts
- First successful full run: commit `34d2b13c2e0f16b597572701485df24a538609c8`, four of four scenarios passed
- Selected patchnote image: scenario `russian-alias-mobile`, source commit `d6cb082d8d1aa1990d26a9a5f72e6e61ae56fb47`, captured `2026-07-22T08:22:53Z`
- Validation: `scripts/validate-screenshot-tooling.mjs` checks package/lock, workflow permissions, scenarios, assertions, artifact cleanup and runtime isolation
- Previous documentation baseline: `v23.8.6`, PR #21, squash merge `58ebaea07ef488e0131bd9c3b5c359a191d6275e`
- Live handoff source: `WORK_STATUS.md`
- Unified execution protocol: `docs/AI_GITHUB_WORKFLOW.md`
- Screenshot contract and implementation: `docs/SCREENSHOT_AUTOMATION.md`
- Next approved series: D1, beginning with D1.1 provenance recovery
- Product source of truth: `docs/PRODUCT_VISION.md`
- Translation source of truth: `docs/TRANSLATION_WORKFLOW.md`
- Repository download: https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip

## Current development line

No functional application version is assigned after `v23.8.0`.

Documentation and automation updates `23.8.1` through `23.8.7` finalize the immutable release record, product/data baseline, translation safety, cross-device workflow, screenshot provenance and real Chromium artifact generation. They do not change application runtime, PWA behavior or database records.

## Unified version line

Version `v23.7.0` began the unified maintained-product line; `v23.8.0` is its next feature release.

The repository previously used two separate counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.5.0`, `v3.6.0`;
- legacy UI iterations: numbered folders through `019` and the visible interface label `v19`.

The product-version decision advanced the legacy visible line from `19` to `20` and combined it with the `3.7.0` development line, producing the unified version `23.7.0`. New maintained releases continue from that unified semantic version.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers.
