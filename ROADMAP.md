# Roadmap

## Completed foundation

- [x] Publish the static site on GitHub Pages.
- [x] Provide search, aliases, tags, alphabet navigation, history, themes, and RU/EN interface text.
- [x] Add PWA metadata and a service worker.
- [x] Preserve historical app and admin iterations under `_archive/`.
- [x] Create the `v3.0.0` restoration checkpoint.
- [x] Establish project documentation and development rules.
- [x] Add a launcher for runnable saved versions.
- [x] Perform a mobile regression check of the current site and saved version launcher.
- [x] Add uNews patchnote rules and GitHub Actions validation.
- [x] Separate the MIT-licensed software from third-party content in public documentation.

## Completed: modularization without a build step

- [x] Define and complete the staged ES-module migration plan M1–M5.
- [x] Extract search/autocomplete matching and add regression tests.
- [x] Extract data loading and initial application state.
- [x] Extract history and local settings.
- [x] Extract presentation and localization with safe imported-data rendering.
- [x] Isolate PWA registration and complete Android offline verification.

See `docs/MODULARIZATION_PLAN.md`.

## Completed: search and version UX

- [x] Replace the historical visible `v19` label with the unified `v23.7.0` application line.
- [x] Submit search through Enter, Return and mobile search actions.
- [x] Rank exact and primary symbol matches before redirect and distant matches.
- [x] Resolve Russian aliases to their owning primary cards.
- [x] Make all five search filters strict to their declared fields.
- [x] Keep search filters above the expanding autocomplete list.
- [x] Add release-specific screenshots for the uNews publication.

## Completed: PWA update and installation v23.8.0

- [x] Activate a new Service Worker immediately through `skipWaiting()` and `clients.claim()`.
- [x] Add uncached runtime-version checks through `version.json`.
- [x] Reload once safely when the deployed version differs from the running version.
- [x] Remove only old `udream-*` caches and preserve unrelated origin caches.
- [x] Use network-first with offline fallback for HTML, JavaScript, manifest and JSON.
- [x] Add a visible install banner with system prompt support and manual instructions.
- [x] Hide the install banner in the standalone PWA.
- [x] Create the immutable `v23.8.0` tag on the exact functional merge commit.
- [x] Add a GitHub Release and documented rollback path.

## Completed: unified documentation and work process v23.8.4–v23.8.7

- [x] Add a current product vision and non-destructive data/translation rules.
- [x] Document safe DeepSeek-assisted translation without exposing keys in the public application.
- [x] Add `WORK_STATUS.md` and a GitHub-first cross-device handoff protocol.
- [x] Make real GitHub facts the highest-priority source of truth.
- [x] Add isolated Playwright Chromium screenshot tooling and provenance.
- [x] Require a new real image for every new uNews patchnote.

See `docs/PRODUCT_VISION.md`, `docs/AI_GITHUB_WORKFLOW.md` and `docs/SCREENSHOT_AUTOMATION.md`.

## Completed: D1.1 data provenance v23.8.8

- [x] Recover retained Git history of maintained data files.
- [x] Record bytes, raw/canonical hashes, schema and ordered IDs.
- [x] Separate proven facts, inferences and unknowns.
- [x] Prove that `bd2.json` and `db.json` are byte-different but canonical-JSON equal.
- [x] Add permanent provenance validation.
- [x] Keep data, runtime, PWA, saved versions and archives unchanged.

See `docs/DATA_PROVENANCE.md`.

## Completed: D1.2 dataset registry v23.8.9

- [x] Add machine-readable `data/datasets.json`.
- [x] Define stable logical and physical dataset IDs.
- [x] Select `data/bd2.json` as canonical maintained serialization by governance decision.
- [x] Retain `data/db.json` as equivalent compatibility serialization.
- [x] Add registry documentation and validator.
- [x] Keep physical migration `planned-not-executed`.

See `data/datasets.json` and `docs/DATASET_REGISTRY.md`.

## Completed: D1.3 data-quality audit v23.8.10

- [x] Define error, warning, review and info severities.
- [x] Add deterministic structural and hygiene checks.
- [x] Confirm 4,086 unique ordered and aligned IDs.
- [x] Confirm zero differences in preserved fields.
- [x] Generate deterministic machine and human reports.
- [x] Record 0 structural errors, 0 warnings and 5,022 overlapping human-review instances.
- [x] Keep the audit read-only and preserve all runtime/data files.

See `docs/DATA_QUALITY_AUDIT.md` and `reports/data-quality-audit.md`.

## Completed: D1.4 two-book product architecture v23.8.11

- [x] Register stable source-work and retained-document identities as architecture metadata.
- [x] Keep the second PDF classified as retained evidence, not a ready dataset.
- [x] Define global record identity as `(dataset_id, record_id)`.
- [x] Compare separate switching, federated combined search and side-by-side comparison.
- [x] Recommend staged implementation: separate mode first, combined mode second, reviewed comparison third.
- [x] Require visible source-work, dataset, translation/variant and source-reference provenance.
- [x] Define dataset-aware URL, history, sharing and legacy-link migration contracts.
- [x] Define validation, atomic activation, cache isolation and automatic fallback to `ru-current-v1`.
- [x] Define an explicit reviewed relation-map contract without numeric-ID assumptions.
- [x] Add machine-readable architecture metadata and permanent validation.
- [x] Preserve existing data files, runtime, PWA, package metadata, saved versions and archive unchanged.

See `docs/TWO_BOOK_ARCHITECTURE.md`.

## Completed: D1.4a second-book evidence and extraction contract v23.8.12

- [x] Verify the retained PDF path, bytes, SHA-256, Git blob and Git history.
- [x] Record PDF metadata and confirm 55 pages.
- [x] Measure the direct text layer without committing the extracted book text.
- [x] Confirm that all 55 pages contain substantial extractable text.
- [x] Record a searchable-page ratio of `1.0`, 85,103 characters and 12,479 words.
- [x] Classify the technical strategy as `direct-text-extraction-viable`.
- [x] State that extractability does not prove semantic record boundaries, source rights or dataset readiness.
- [x] Define immutable raw extraction, page-level provenance, local-ID, source-reference, validation, review, retention and rollback contracts.
- [x] Add permanent machine-readable evidence and a validator locked to the exact retained PDF.
- [x] Remove the one-time diagnostic workflow and keep full extracted text out of the repository.
- [x] Keep existing data files, runtime, PWA, package metadata, saved versions and archive unchanged.

See `docs/SECOND_BOOK_EVIDENCE.md`, `docs/second-book-evidence.json` and `docs/SECOND_BOOK_EXTRACTION_CONTRACT.md`.

## Next approved work: D1.4b private raw-extraction pilot

The next bounded phase must not publish a second dataset yet.

- [ ] Create a private or otherwise non-public immutable extraction run with one UTF-8 file per PDF page.
- [ ] Generate the required manifest with source hash, tool version, page hashes, metrics and aggregate hash.
- [ ] Preserve the exact 55-page boundary and stop when the source hash differs.
- [ ] Use direct extraction as default and limited OCR only for explicitly flagged regions.
- [ ] Produce a small reviewed segmentation sample from the beginning, middle and end of the book.
- [ ] Define candidate record boundaries, page references and stable source anchors from evidence.
- [ ] Keep full extracted text outside the public repository until rights/publication evidence is reviewed.
- [ ] Do not register a logical dataset until schema, review and rights gates pass.
- [ ] Keep `ru-current-v1` as the unchanged default and stable fallback.

## Later data phases

- [ ] Create and validate the full second-book candidate dataset with its own local IDs.
- [ ] Register the second logical dataset in a separate data Pull Request.
- [ ] Implement separate dataset selection in a functional release only after data readiness.
- [ ] Add federated combined search over separate indexes without destructive JSON merging.
- [ ] Add reviewed side-by-side comparison and explicit relation maps.
- [ ] Show matching, additional, unique and possibly contradictory material without automatic harmonization.

## D1.5 — AI-assisted translation experiment

- [ ] Design a resumable translation script that never modifies the active database in place.
- [ ] Use DeepSeek only as an optional candidate generator, not as an automatic source of truth.
- [ ] Keep the API key only in a local environment variable or GitHub encrypted secret.
- [ ] Record source hash, model, prompt version, parameters, output hash and validation report for every run.
- [ ] Create a separate candidate dataset and diff report.
- [ ] Require human review before any candidate can become a published data release.

See `docs/TRANSLATION_WORKFLOW.md`.

## Product completion after D1

- [ ] Restore or redesign the administration workflow outside the public runtime.
- [ ] Add broader automated browser smoke checks.
- [ ] Review accessibility.
- [ ] Review privacy, local history and sharing behavior.
- [x] Confirm automatic uDream publications and operational recovery in `@uNewsLog`.

## Later options

- [ ] Consider moving inline CSS only if maintainability requires it.
- [ ] Consider a build pipeline only when static-file maintenance becomes a blocker.
- [ ] Consider additional languages only after source and translation workflow is documented.
- [ ] Consider TypeScript only when JSDoc and `@ts-check` no longer provide sufficient protection.

The roadmap remains conservative: preserve the working static site, current data and restoration points while advancing one bounded series at a time.
