# Changelog

## Documentation and registry update v23.8.9 — 2026-07-23

- Added `data/datasets.json` as the machine-readable D1.2 registry for logical datasets, physical files, hashes, roles and policies.
- Defined logical dataset IDs `source-divinity-code-en` and `ru-current-v1`.
- Defined stable physical IDs for `data/bd2.json`, `data/db.json` and `data/divinity_code_ru.json`.
- Selected `data/bd2.json` as the canonical maintained English serialization through a project-governance decision while explicitly not claiming historical originality.
- Retained `data/db.json` as an equivalent compatibility serialization of the same logical English dataset.
- Added `docs/DATASET_REGISTRY.md` with reference-audit, identity, future migration and rollback rules.
- Added `scripts/validate-dataset-registry.mjs` to verify the registry against real bytes, hashes, canonical JSON, 4,086 ordered IDs, roles, policies and runtime isolation.
- Required the new registry validator and syntax check in GitHub Actions.
- Recorded the physical migration as `planned-not-executed`; no existing data file was removed, renamed or changed.
- Synchronized README, product vision, roadmap, version, project state, database contract, translation workflow, file map and agent rules.
- Kept application runtime, PWA, Service Worker, package metadata, saved versions, archives and all existing database records unchanged.

## Documentation and provenance update v23.8.8 — 2026-07-22

- Added `docs/DATA_PROVENANCE.md` as the permanent D1.1 evidence record for all maintained files under `data/`.
- Corrected the earlier statement that `data/bd2.json` and `data/db.json` were byte-for-byte duplicates: their raw bytes and SHA-256 values differ, while parsed JSON and canonical JSON are identical.
- Verified that both English serializations contain the same 4,086 records, order, IDs, fields and values and therefore represent one logical dataset.
- Recorded exact raw and canonical hashes, file sizes, schema, ordered IDs, Git introduction commits and current runtime relationships.
- Verified that `data/divinity_code_ru.json` preserves `id`, `symbol`, `description`, `source` and `date_added`, while `aliases`, `notes` and `tags` differ by the documented counts.
- Explicitly separated proven facts, reasonable inferences and unknown generation/translation details.
- Added `scripts/validate-data-provenance.mjs` and connected it to the project validator to lock hashes, schema, semantic equality and field-difference counts.
- Added a new document-render PNG and factual uNews patchnote for the D1.1 milestone.
- Kept all maintained data files, application runtime, PWA, package metadata, saved versions and archives unchanged.

## Automation update v23.8.7 — 2026-07-22

- Added an isolated Playwright package under `tools/screenshots/` without changing the public runtime or root package dependencies.
- Pinned `@playwright/test`, `playwright` and `playwright-core` to `1.61.1` through a dedicated lockfile.
- Added a read-only GitHub Actions workflow that installs Chromium, starts the exact checkout through a local HTTP server and uploads screenshot artifacts.
- Added a JSON-driven scenario runner that supports only allowlisted actions and requires assertions before capture.
- Added deterministic storage clearing, blocked Service Worker registration, disabled animations and used one Chromium worker.
- Added per-scenario provenance entries and a manifest containing commit, UTC time, URL, viewport, PNG dimensions and byte size.
- Preserved successful manifest entries across Playwright retries.
- Added desktop and mobile scenarios for startup, `water` ranking and Russian alias `вода` opening the primary `water` card.
- Completed a four-of-four successful Chromium run and visually reviewed every generated PNG.
- Added the selected new Playwright PNG and its exact provenance for the matching uNews patchnote.
- Added structural validation for package/lock consistency, read-only workflow permissions, scenario assertions, safe artifact cleanup and runtime isolation.
- Kept application runtime, PWA, Service Worker, release tag and all 4,086 active database records unchanged.

## Documentation update v23.8.6 — 2026-07-22

- Made real GitHub state the highest-priority source of truth for all devices, chats and AI agents.
- Added `docs/AI_GITHUB_WORKFLOW.md` with one start, pause, completion and conflict-recovery protocol.
- Required an early pushed `WORK_STATUS.md` lock before implementation and prohibited competing branches for the same active goal.
- Recorded that connected agents should perform routine GitHub work themselves and involve the owner only for unavailable tools, secrets, physical-device checks or human judgment.
- Added `docs/SCREENSHOT_AUTOMATION.md` and defined Playwright Chromium as the preferred source of real screenshots.
- Required every new patchnote to add a new PNG/JPEG in the same Pull Request with `image_source`, `image_target`, `image_commit` and `image_captured_at`.
- Strengthened `scripts/validate-project.mjs`, `scripts/validate-patchnote-diff.mjs`, the Pull Request template and agent rules.
- Corrected stale cross-device references from PR #18 to PR #20 and commit `ac7dfe6b`.
- Kept application runtime, PWA behavior, release tag and all 4,086 active database records unchanged.
- Scheduled isolated Playwright implementation as documentation/automation patch `23.8.7` before D1.1.

## Documentation update v23.8.5 — 2026-07-21

- Added root `WORK_STATUS.md` as the single live handoff for development across phone, Windows, macOS and GitHub agents.
- Defined explicit `READY`, `IN_PROGRESS`, `PAUSED`, `BLOCKED` and `COMPLETED` states.
- Required every task to record what was planned, what was actually done, the active branch, last verified commit, checks, pause point and exact next action.
- Recorded that local notes, chat history and unpushed commits are not valid cross-device handoffs.
- Updated `AGENTS.md` so every agent reads and updates the handoff before implementation, at pauses and after completion.
- Exposed the handoff from README and mapped it separately from roadmap, project state and immutable release checkpoints.
- Recorded the current project signal as `READY`: no unfinished task or open Pull Request; the next approved task is D1.1 provenance recovery.
- Kept application runtime, PWA behavior, release tag and all 4,086 active database records unchanged.

## Documentation update v23.8.4 — 2026-07-21

- Added `docs/TRANSLATION_WORKFLOW.md` with the target source/current/alternative translation model.
- Recorded that byte-identical files are one logical dataset, not separate translation variants.
- Defined the preferred future set as one canonical source database, one current Russian translation and up to two genuinely independent alternatives.
- Allowed a smaller final set when only one reliable Russian translation can be produced.
- Documented safe DeepSeek-assisted translation through local tooling or GitHub encrypted secrets without exposing the API key in the browser application.
- Required every AI-assisted run to create a separate candidate dataset with source hash, model, prompt version, output hash, validation and human-review status.
- Refreshed the repository README with current badges, installation guidance, a direct `v23.8.0` ZIP download and clearer D1 status.
- Synchronized product vision, roadmap, database contract, file map, agent rules and version baseline.
- Kept application runtime, PWA behavior, package metadata and all 4,086 active database records unchanged.

## Documentation update v23.8.3 — 2026-07-21

- Added `docs/PRODUCT_VISION.md` as the single current source for the product mission, final direction and next-stage boundary.
- Recorded non-destructive preservation rules for source databases, editions and translation variants.
- Defined D1 — data provenance and multi-dataset architecture — as the next approved series, beginning with research and design rather than data modification.
- Synchronized `AGENTS.md`, README, roadmap, project state, architecture, file map, database contract, historical context and completed modularization plan.
- Corrected remaining maintained-document references from `v23.7.0` to the current application release `v23.8.0` where they described current state.
- Added current citation metadata for release `v23.8.0`.
- Kept application runtime, PWA behavior, package metadata and all 4,086 active database records unchanged.

## Documentation update v23.8.2 — 2026-07-21

- Recorded published release `v23.8.0` as the current restoration checkpoint across README, version, roadmap, project-state and rollback documentation.
- Recorded exact release commit `24dece593bea679485057d7551a2583f7f1f5acf` and the immutable `v23.8.0` tag.
- Replaced stale development-branch and pre-merge wording with the completed release state.
- Kept application code, PWA behavior, package metadata and all 4,086 active database records unchanged.

## Documentation update v23.8.1 — 2026-07-20

- Added an idempotent release workflow for the already merged `v23.8.0` functional source.
- Re-ran tests, project validation, syntax checks and version consistency before release publication.
- Created or verified the immutable `v23.8.0` tag on exact commit `24dece593bea679485057d7551a2583f7f1f5acf`.
- Added release-specific publication material without changing application code or database records.

## v23.8.0 — 2026-07-20

- Fixed clients remaining on a stale website or installed-PWA version after a new GitHub Pages deployment.
- Activated updated Service Workers immediately through `skipWaiting()` and `clients.claim()`.
- Added independent `version.json` checks requested with `cache: no-store`.
- Added a protected one-time reload when the deployed version differs from the running version.
- Removed only old `udream-*` caches while leaving unrelated origin caches untouched.
- Used network-first with offline fallback for HTML, JavaScript, manifest and JSON requests.
- Added a visible PWA installation banner with system prompt support and manual instructions.
- Hid the installation banner in standalone mode and made its close button last only for the current loaded page.
- Synchronized static labels, social metadata, Apple PWA naming, `package.json`, `src/version.js` and `version.json` at `23.8.0`.
- Kept the active 4,086-record database unchanged.

## Documentation update v23.7.1 — 2026-07-20

- Recorded published release `v23.7.0` as the current restoration checkpoint.
- Recorded exact release commit `e32c7b6e9c1057a1fdbb2af68a1b1cf2947e7538`.
- Confirmed that the Git tag, GitHub Release target and merged `main` commit are identical.
- Replaced release-candidate wording with the completed release state.
- Added a real screenshot of the GitHub Release page for the matching uNews documentation patchnote.
- Kept application code, PWA behavior and all 4,086 active database records unchanged.

## v23.7.0 — 2026-07-20

- Replaced the historical visible `v19` label with the unified application version `v23.7.0`.
- Centralized the runtime version in `src/version.js`.
- Added form-based search submission for desktop Enter, Return and mobile search actions.
- Made all five search filters strict to their declared fields and selected all-fields mode by default.
- Added relevance ranking so exact and primary-symbol matches appear before distant or redirect matches.
- Made exact Russian aliases open their owning primary record.
- Fixed alias chips so they no longer search for a nonexistent standalone symbol.
- Moved search filters above the expanding autocomplete list.
- Added release-specific Telegram screenshots instead of reusing an unrelated image.
- Increased the dependency-free regression suite from 37 to 41 tests.
- Kept all 4,086 active database records unchanged.

## Documentation update v3.6.2 — 2026-07-20

- Classified all current files under `data/` from runtime references, hashes and Git history.
- Confirmed `data/divinity_code_ru.json` as the active runtime database.
- At that time described `data/bd2.json` and `data/db.json` as byte-for-byte identical; D1.1 update `v23.8.8` later corrected this to raw-distinct but parsed/canonical-JSON-identical serializations of one logical dataset.
- Classified `data/report.txt` as a historical generation and quality summary.
- Kept all databases and historical files unchanged while the exact generation and translation pipeline remains undocumented.

## v3.6.0 — 2026-07-20

- Isolated service-worker registration in `src/pwa.js` without changing application behavior.
- Added three PWA registration tests; the full regression suite now contains 37 tests.
- Updated the offline cache to `udream-v3.6.0-m5` and included the new PWA module.
- Added the PWA module and tests to repository validation and GitHub Actions syntax checks.
- Verified PWA installation, offline reload and installed-app launch on Android without the local server or internet.
- Kept the interface, active 4,086-record database, archived material and runnable `v3.0.0` snapshot unchanged.

## Documentation update v3.5.1 — 2026-07-19

- Recorded release `v3.5.0` as the current verified restoration checkpoint across project documentation.
- Documented the exact release commit, completed checks, rollback path, M5 boundary and matching uNews documentation patchnote.

## v3.5.0 — 2026-07-19

- Extracted the RU/EN dictionary, language normalization and reviewed instruction content into `src/i18n.js`.
- Extracted pure card, list, history, tag, autocomplete, sharing and statistics HTML builders into `src/presentation.js`.
- Published the verified release checkpoint at commit `b0ff02d4248f5dcf56137377f510c12c316e4b85` after 34 passing tests and local Android browser verification; PWA installation and offline reload remain for M5.
- Escaped text and attribute values from manually imported JSON, including both quote types, before DOM insertion.
- Replaced raw Markdown/HTML note rendering with safe plain-text paragraphs and removed the unused Marked CDN dependency.
- Corrected help text so it no longer promises verified offline behavior or translation of dictionary records.
- Added localization, presentation and hostile-input regression tests; the suite now contains 34 tests.
- Added the M4 modules to the PWA cache, runtime validator and CI syntax checks.
- Kept the active 4,086-record database, saved `v3.0.0` runtime and archived files unchanged.

## Development milestone v3.4.0 — included in v3.5.0

- Extracted pure navigation, breadcrumb-window and full-history operations into `src/history.js`.
- Extracted typed localStorage reads, writes, JSON serialization and removal into `src/storage.js`.
- Made invalid or partially written saved history fall back safely instead of blocking application startup.
- Added regression tests for navigation branches, boundaries, breadcrumb limits, history grouping and storage serialization.
- Added the M3 modules to the PWA cache and CI syntax checks.
- Kept the active 4,086-record database, search behavior, interface and saved versions unchanged.

## Development milestone v3.3.0 — included in v3.5.0

- Extracted automatic database fallback loading and manual JSON parsing into `src/data.js`.
- Extracted initial application defaults and persisted preference restoration into `src/state.js`.
- Added regression tests for data loading, invalid/empty databases and browser-state defaults.
- Added both modules to the PWA cache and CI syntax checks.
- Kept the active 4,086-record database, search behavior, interface and saved versions unchanged.

## Development milestone v3.2.0 — included in v3.5.0

- Added the staged native ES-module plan in `docs/MODULARIZATION_PLAN.md`.
- Extracted pure search and autocomplete matching into `src/search.js` without changing their behavior.
- Added dependency-free Node.js regression tests and CI execution.
- Switched the main entry script to `type="module"` and added the new module to the PWA cache.
- Kept the database, interface markup, archived versions and saved v3.0.0 runtime unchanged.

## Development milestone v3.1.1 — included in v3.5.0

- Synchronized `AGENTS.md` and `docs/NEWS_PUBLISHING.md` with the verified uNews v0.3.4 FIFO queue.
- Documented four-hour polling, 61-second Telegram spacing, immediate checkpoints, isolated project errors, health state and automatic alerts.

## Development milestone v3.1.0 — included in v3.5.0

- Added repository-wide development rules in `AGENTS.md`.
- Added current-state, architecture, database, file-map, history, and rollback documentation.
- Added a saved-version launcher at `versions/`.
- Added a runnable `v3.0.0` snapshot with its own database and PWA paths.
- Added a versions link to the current site menu.
- Aligned the current service-worker database cache with `data/divinity_code_ru.json`.
- Corrected README references that previously named `data/bd2.json` as the active database.
- Redesigned the public README with project links, badges, screenshot, status, structure and rights notice.
- Added explicit separation between original MIT-licensed software and third-party book-derived content.
- Added `THIRD_PARTY_NOTICES.md`, contribution guidance and citation metadata.
- Added the uNews patchnote workflow and the first uDream patchnote under `news/`.
- Added GitHub Actions validation for runtime files, JSON data, record IDs and patchnote assets.
- Added CODEOWNERS and a Pull Request checklist.

## v3.0.0 — 2026-07-18

- Created a stable checkpoint of the working site at commit `94c14db5321edea3036d896b727790db5f6aec27`.
- No application files changed for this release.

## v2.0.0 — 2026-05-24

- Preserved the pre-work state before later Codex-assisted development.

## v1.0.0 — 2026-05-23

- Preserved the preliminary design series, including the version `005` demo.
