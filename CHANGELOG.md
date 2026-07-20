# Changelog

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
