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

## Documentation, data and extraction baseline

`v23.8.12`

- Status: D1.4a second-book evidence and extraction-contract milestone; no new application build and no movement of the `v23.8.0` tag
- Purpose: prove whether the retained second-book PDF has an extractable text layer and define a non-destructive path to a separate dataset
- Evidence document: `docs/SECOND_BOOK_EVIDENCE.md`
- Machine-readable evidence: `docs/second-book-evidence.json`
- Extraction contract: `docs/SECOND_BOOK_EXTRACTION_CONTRACT.md`
- Validator: `scripts/validate-second-book-evidence.mjs`
- CI command: `node scripts/validate-second-book-evidence.mjs`
- Retained document: `_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf`
- Exact bytes: `740193`
- SHA-256: `edb4127915bf720ee56c96612f825ea4e0ef2f5fc15192a56fb96e5c7ec4745a`
- PDF pages: `55`
- Pages with substantial direct text: `55`
- Searchable-page ratio: `1.0`
- Extracted text metrics: `85103` characters, `12479` words
- Technical conclusion: `direct-text-extraction-viable`
- Important limitation: text-layer viability does not prove correct semantic record boundaries or publication rights
- Second-book status: retained evidence, not a registered logical dataset
- Current default dataset: `ru-current-v1`
- Existing data/runtime policy: unchanged; no selector, combined-search UI or second dataset is added by this milestone
- Next practical phase: private or non-public immutable raw-extraction pilot with page files, manifest and reviewed segmentation sample
- Previous baselines: D1.1 `23.8.8`, D1.2 `23.8.9`, D1.3 `23.8.10`, D1.4 `23.8.11`
- Live handoff source: `WORK_STATUS.md`
- Repository download: https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip

## Current development line

No functional application version is assigned after `v23.8.0`.

Documentation, provenance, registry, audit, architecture and extraction-safety updates `23.8.1` through `23.8.12` do not change application runtime, PWA behavior or existing database records.

A second-book dataset may be registered only after immutable raw extraction, provenance manifest, schema validation, source references, rights review and human review exist. User-facing switching or combined search remains a separate future functional release.

## Unified version line

Version `v23.7.0` began the unified maintained-product line; `v23.8.0` is its next feature release.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers. Existing release tags are immutable.
