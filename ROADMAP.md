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
- [x] Keep search filters above the expanding autocomplete panel.
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
- [x] Record the current signal as `READY`: no unfinished task or open Pull Request.

## Completed: unified AI/GitHub workflow v23.8.6

- [x] Make real GitHub facts the highest-priority source of truth.
- [x] Define one protocol for any number of devices, chats and AI agents.
- [x] Require an early pushed `WORK_STATUS.md` lock before implementation.
- [x] Prevent a new chat from creating a competing branch for the same active goal.
- [x] Define which work the connected agent performs independently and when human input is required.
- [x] Require new screenshot provenance metadata in patchnotes.
- [x] Require a newly added PNG/JPEG in the same Pull Request instead of reusing an older image.
- [x] Add structural validation for `WORK_STATUS.md`.
- [x] Synchronize stale cross-device documentation references.

See `docs/AI_GITHUB_WORKFLOW.md`.

## Completed: Playwright screenshots v23.8.7

- [x] Add isolated Playwright tooling outside the public runtime.
- [x] Pin Playwright package and lockfile versions.
- [x] Start the exact branch checkout through a local HTTP server in GitHub Actions.
- [x] Capture desktop and mobile screenshots from real Chromium.
- [x] Define reusable JSON scenarios for page startup, search ranking and Russian alias behavior.
- [x] Allow only explicit safe actions instead of arbitrary scenario JavaScript.
- [x] Require visible assertions before every capture.
- [x] Upload screenshots, per-scenario provenance, manifest and test results as workflow artifacts.
- [x] Keep the permanent workflow read-only and prohibit automatic commits.
- [x] Preserve successful manifest entries across Playwright retries.
- [x] Validate package/lock, workflow permissions, scenario coverage, artifact cleanup and runtime isolation.
- [x] Complete a four-of-four successful Chromium run.
- [x] Visually inspect all generated PNGs before selecting the uNews image.
- [x] Document local and GitHub Actions invocation.

See `docs/SCREENSHOT_AUTOMATION.md` and `tools/screenshots/README.md`.

## Completed: D1.1 data provenance v23.8.8

- [x] Recover the retained Git history of `data/divinity_code_ru.json`, `data/bd2.json`, `data/db.json` and `data/report.txt`.
- [x] Record exact bytes, raw SHA-256, canonical JSON SHA-256, schema and ordered ID coverage.
- [x] Separate proven facts, reasonable inferences and unknowns in `docs/DATA_PROVENANCE.md`.
- [x] Correct the earlier byte-duplicate claim for `bd2.json` and `db.json`.
- [x] Prove that `bd2.json` and `db.json` are byte-different but parsed/canonical-JSON equal.
- [x] Record that the active dataset preserves IDs and core source fields while changing `aliases`, `notes` and `tags`.
- [x] Invalidate the earlier intermediate metric that inspected nonexistent field `note` instead of `notes`.
- [x] Add `scripts/validate-data-provenance.mjs` and integrate it into project validation.
- [x] Keep all current data files, runtime, PWA, saved versions and archives unchanged.

See `docs/DATA_PROVENANCE.md`.

## Completed: D1.2 dataset registry v23.8.9

- [x] Add machine-readable `data/datasets.json` with schema version 1.
- [x] Define stable logical dataset IDs `source-divinity-code-en` and `ru-current-v1`.
- [x] Define stable physical file IDs for both English serializations and the active runtime file.
- [x] Select `data/bd2.json` as the canonical maintained physical serialization through a project-governance decision.
- [x] State explicitly that the canonical choice does not prove the historical original or authoritative source edition.
- [x] Retain `data/db.json` as an equivalent compatibility serialization.
- [x] Record bytes, raw hashes, canonical hashes, record counts, roles, statuses and source relationships.
- [x] Add `docs/DATASET_REGISTRY.md` with identity, reference-audit, migration and rollback rules.
- [x] Add `scripts/validate-dataset-registry.mjs` and require it in GitHub Actions.
- [x] Preserve all existing data files, runtime, PWA, package metadata, saved versions and archives unchanged.
- [x] Keep the physical migration in status `planned-not-executed`.

See `data/datasets.json` and `docs/DATASET_REGISTRY.md`.

## Completed: D1.3 data-quality audit v23.8.10

- [x] Define a four-level severity model: error, warning, review and info.
- [x] Add structural checks for arrays, required fields, types, dates, unique/ordered IDs and registered record counts.
- [x] Add data-hygiene and ambiguity checks for whitespace, empty values, duplicate aliases/tags, control characters, HTML-like content and normalized collisions.
- [x] Compare `source-divinity-code-en` with `ru-current-v1` without changing either dataset.
- [x] Confirm 4,086 unique ordered IDs and exact source/current alignment.
- [x] Confirm zero differences in preserved fields `id`, `symbol`, `description`, `source` and `date_added`.
- [x] Record expected changed-field counts: aliases 4,083; notes 4,086; tags 4,086.
- [x] Generate deterministic machine-readable and human-readable reports.
- [x] Add permanent `scripts/audit-data-quality.mjs` with write and `--check` modes.
- [x] Require report freshness and a passing structural gate in GitHub Actions.
- [x] Record 0 structural errors, 0 warnings and 5,022 human-review instances in five aggregated groups.
- [x] State explicitly that heuristic review counts are not proven content errors and are not auto-fixed.
- [x] Preserve all existing data files, runtime, PWA, package metadata, saved versions and archives unchanged.

See `docs/DATA_QUALITY_AUDIT.md` and `reports/data-quality-audit.md`.

## Next approved work: D1.4 — two-book product architecture

- [ ] Identify and register the second source book/dataset as far as retained evidence allows.
- [ ] Define the intended relationship between the two source books.
- [ ] Compare separate-database switching, combined search and side-by-side comparison.
- [ ] Define user-visible provenance for every result in every future mode.
- [ ] Define validation, reload, cache-clearing and automatic fallback contracts before any selector implementation.
- [ ] Decide how history, sharing and deep links preserve dataset identity.
- [ ] Approve a migration and rollback plan before implementing a user-facing selector or merged index.
- [ ] Keep D1.4 architecture-only unless a separate functional implementation phase is approved.

## D1.5 — AI-assisted translation experiment

- [ ] Design a resumable translation script that never modifies the active database in place.
- [ ] Use DeepSeek only as an optional candidate generator, not as an automatic source of truth.
- [ ] Keep the API key only in a local environment variable or GitHub encrypted secret.
- [ ] Record source hash, model, prompt version, parameters, output hash and validation report for every run.
- [ ] Create a separate candidate dataset and diff report.
- [ ] Require human review before any candidate can become a published data release.

See `docs/TRANSLATION_WORKFLOW.md`.

## Rights and provenance completion

- [ ] Archive the original source URLs, access dates and exact open-distribution statements for bundled PDFs.
- [ ] Review the retained PDF set against `docs/CONTENT_AND_RIGHTS.md` and `THIRD_PARTY_NOTICES.md`.

## Product completion after D1

- [ ] Restore or redesign the administration workflow outside the public runtime.
- [ ] Add broader automated browser smoke checks for asset paths, startup and critical flows beyond the current screenshot scenarios.
- [ ] Review accessibility: keyboard navigation, contrast, focus, screen readers and text selection.
- [ ] Review privacy, local history and sharing behavior.
- [x] Confirm automatic uDream publications and operational recovery in `@uNewsLog`.

## Later options

- [ ] Consider moving inline CSS from `index.html` only if it materially improves maintainability.
- [ ] Consider a build pipeline only when static-file maintenance becomes a real blocker.
- [ ] Consider additional languages only after the source and translation workflow is documented.
- [ ] Consider TypeScript only when JSDoc and `@ts-check` no longer provide sufficient protection.

The roadmap is intentionally conservative: preserve the working static site, current data and restoration points while advancing one clearly bounded series at a time.
