# Changelog

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
