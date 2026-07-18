# Changelog

## Unreleased — v3.2.0

- Added the staged native ES-module plan in `docs/MODULARIZATION_PLAN.md`.
- Extracted pure search and autocomplete matching into `src/search.js` without changing their behavior.
- Added dependency-free Node.js regression tests and CI execution.
- Switched the main entry script to `type="module"` and added the new module to the PWA cache.
- Kept the database, interface markup, archived versions and saved v3.0.0 runtime unchanged.

## Unreleased — v3.1.1

- Synchronized `AGENTS.md` and `docs/NEWS_PUBLISHING.md` with the verified uNews v0.3.4 FIFO queue.
- Documented four-hour polling, 61-second Telegram spacing, immediate checkpoints, isolated project errors, health state and automatic alerts.

## Unreleased — v3.1.0

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
