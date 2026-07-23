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

## Completed: unified documentation baseline v23.8.4

- [x] Add one current product-vision document.
- [x] Distinguish product mission, verified current state, next phase and later backlog.
- [x] Synchronize maintained documentation with `v23.8.0`.
- [x] Record non-destructive preservation rules for source datasets and translation variants.
- [x] Mark the M1–M5 modularization plan as completed.
- [x] Update the architecture, file map, database contract, historical context and coding-agent rules.
- [x] Define the boundary of the next project series before implementation begins.
- [x] Record the desired source/current/alternative translation model.
- [x] Document safe DeepSeek API use without exposing the key in the static application.
- [x] Add direct download links and clearer current-state information to the repository README.

## Completed: cross-device work handoff v23.8.5

- [x] Add root `WORK_STATUS.md` as the live handoff between phone, Windows, macOS and GitHub agents.
- [x] Separate current task state from long-term roadmap, verified project state and immutable release checkpoints.
- [x] Define `READY`, `IN_PROGRESS`, `PAUSED`, `BLOCKED` and `COMPLETED` states.
- [x] Require planned work, actual work, branch, commit, checks, blockers and exact next action.
- [x] Require a pushed handoff before switching devices or pausing unfinished work.
- [x] Make every future agent read and update the handoff at task start, pause and completion.

## Completed: unified AI/GitHub workflow v23.8.6

- [x] Make real GitHub facts the highest-priority source of truth.
- [x] Define one protocol for any number of devices, chats and AI agents.
- [x] Require an early pushed `WORK_STATUS.md` lock before implementation.
- [x] Prevent a new chat from creating a competing branch for the same active goal.
- [x] Define which work the connected agent performs independently and when human input is required.
- [x] Require new screenshot provenance metadata in patchnotes.
- [x] Require a newly added PNG/JPEG in the same Pull Request instead of reusing an older image.
- [x] Add structural validation for `WORK_STATUS.md`.

See `docs/AI_GITHUB_WORKFLOW.md`.

## Completed: Playwright screenshots v23.8.7

- [x] Add isolated Playwright tooling outside the public runtime.
- [x] Pin Playwright package and lockfile versions.
- [x] Capture desktop and mobile screenshots from real Chromium.
- [x] Define reusable JSON scenarios and visible assertions.
- [x] Upload screenshots and provenance as workflow artifacts.
- [x] Keep the permanent workflow read-only.

See `docs/SCREENSHOT_AUTOMATION.md` and `tools/screenshots/README.md`.

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
- [x] Define migration and rollback before any functional implementation.
- [x] Add machine-readable `docs/two-book-architecture.json` and permanent validator.
- [x] Preserve existing data files, runtime, PWA, package metadata, saved versions and archive unchanged.

See `docs/TWO_BOOK_ARCHITECTURE.md`.

## Next approved work: second-book evidence and dataset preparation

Before any selector or combined-search implementation:

- [ ] archive exact source/edition evidence and known distribution statements for the second retained work;
- [ ] define a separate extraction task and immutable raw-output policy;
- [ ] create a new logical dataset ID only after actual extraction exists;
- [ ] validate schema, required fields, local IDs, record-count policy, hashes and source references;
- [ ] register the second dataset without replacing `ru-current-v1`;
- [ ] approve a separate functional phase for dataset switching only after data readiness.

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
