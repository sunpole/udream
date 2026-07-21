# File map

## Current runtime

| Path | Role | Change risk |
|---|---|---:|
| `index.html` | Current page structure, inline styles and static metadata | High |
| `script.js` | Current application orchestration and UI logic | High |
| `src/search.js` | Strict search matching, relevance ranking and alias resolution | Medium |
| `src/version.js` | Central runtime application version, labels and title | Low |
| `src/data.js` | Database fallback loading and manual JSON parsing | Medium |
| `src/history.js` | Pure navigation, breadcrumbs and full-history operations | Medium |
| `src/i18n.js` | RU/EN dictionary, language normalization and reviewed instructions | Medium |
| `src/presentation.js` | Safe pure HTML builders for imported records and UI lists | High |
| `src/pwa.js` | Service Worker registration, update checks and installation flow | High |
| `src/state.js` | Initial state and persisted preference restoration | Medium |
| `src/storage.js` | Typed localStorage reads, writes and serialization | Medium |
| `version.json` | Uncached deployed-version signal used by the PWA update flow | Low |
| `tests/search.test.js` | Search ranking, filter and alias regression tests | Low |
| `tests/runtime.test.js` | Visible version and form-submission contract tests | Low |
| `tests/data.test.js` | Database loader and fallback tests | Low |
| `tests/history.test.js` | Navigation, breadcrumbs and history regression tests | Low |
| `tests/i18n.test.js` | Language fallback, translation and instruction-claim tests | Low |
| `tests/presentation.test.js` | HTML escaping and hostile imported-data regression tests | Low |
| `tests/pwa.test.js` | Service Worker, update, install and failure-handling tests | Low |
| `tests/state.test.js` | Initial-state regression tests | Low |
| `tests/storage.test.js` | localStorage serialization and fallback tests | Low |
| `package.json` | Application version, dependency-free test command and ES-module mode | Low |
| `data/divinity_code_ru.json` | Active published database | Critical |
| `manifest.json` | PWA identity, scope, metadata and icons | Medium |
| `sw.js` | Offline cache, immediate activation and runtime fetch strategy | High |
| `favicon.svg` | Browser/site icon | Low |
| `icon-192.png` | PWA icon | Low |
| `icon-512.png` | PWA icon | Low |
| `apple-touch-icon.png` | Apple home-screen icon | Low |
| `preview.jpg` | Social sharing preview | Low |
| `.nojekyll` | GitHub Pages behavior | Medium |

## Data and reports

| Path | Status |
|---|---|
| `data/divinity_code_ru.json` | Active translated and augmented runtime database with 4,086 records |
| `data/bd2.json` | Retained English reference dataset; not used by current runtime |
| `data/db.json` | Exact duplicate of `data/bd2.json`; retained pending D1 provenance documentation |
| `data/report.txt` | Historical generation/quality summary; not used by current runtime |

No retained database or translation variant may be destructively replaced. The future D1 phase must assign stable dataset identity, source, language, version and transformation history before any migration or selector is implemented.

The target logical topology is one canonical source dataset, one current Russian translation and up to two independent alternative Russian translations. Exact duplicates are not separate variants. See `docs/TRANSLATION_WORKFLOW.md`.

## Planned translation tooling

No translation API client or batch script is part of the current runtime.

Future D1 tooling may add:

| Planned area | Rule |
|---|---|
| local translation script | Must create a separate candidate dataset and support checkpoints |
| GitHub Actions translation workflow | Must use an encrypted secret and never expose the key in logs or artifacts |
| `.env.example` | May contain only an empty variable name, never a real key |
| translation manifests and reports | Must record source hash, model, prompt version, output hash and review status |

Any such tooling belongs under a separate D1 implementation PR and must not be imported by the public browser application.

## Versioning, handoff and restoration

| Path or reference | Role |
|---|---|
| `WORK_STATUS.md` | Live cross-device task handoff: active branch, actual progress, pause point and exact next action |
| `VERSION.md` | Current release and development state |
| `version.json` | Deployed runtime version check |
| `versions/index.html` | User-facing saved-version launcher |
| `versions/v3.0.0/` | Independently runnable pre-cleanup fallback |
| Git tag `v3.0.0` | Exact immutable pre-cleanup source |
| Git tag `v3.6.0` | Exact immutable completed M5 source |
| Git tag `v23.7.0` | Previous unified-version restoration checkpoint |
| Git tag `v23.8.0` | Current immutable functional restoration checkpoint at `24dece593bea679485057d7551a2583f7f1f5acf` |

`WORK_STATUS.md` is intentionally mutable and records current work. Git tags and Releases are immutable restoration sources. These roles must not be confused.

The runnable `v3.0.0` directory contains only path and scope adaptations needed to operate under `/versions/v3.0.0/`.

The direct stable source download is `https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip`.

## News and automation

| Path | Role |
|---|---|
| `news/*.md` | Factual patchnotes discovered by uNews |
| `news/*.{jpg,png}` | Telegram visuals stored beside their patchnotes |
| `scripts/validate-project.mjs` | Repository, database and patchnote validation |
| `scripts/validate-patchnote-diff.mjs` | Requires a newly added patchnote in each Pull Request |
| `.github/workflows/validate.yml` | Automatic validation for pushes and Pull Requests |
| `.github/workflows/publish-v23.8.0.yml` | Immutable one-release workflow for tag and GitHub Release publication |
| `.github/pull_request_template.md` | Review checklist including uNews publication impact |
| `.github/CODEOWNERS` | Default repository owner for review routing |

## Archive

| Path | Role |
|---|---|
| `_archive/legacy-versions/` | UI iterations `002–019` |
| `_archive/admin-versions/` | Admin prototypes `admin1–admin7` |
| `_archive/old-data/` | Older database files and variants |
| `_archive/source-files/` | PDFs and historical screenshots |

Do not delete archived files as routine cleanup. Git history is valuable, but the archive also documents intermediate product decisions and may contain files that were never released separately.

## Project governance and documentation

| Path | Role |
|---|---|
| `WORK_STATUS.md` | Mandatory start/pause/completion record for continuing work across devices and agents |
| `AGENTS.md` | Binding instructions for future coding agents |
| `README.md` | Entry point, current overview, installation and stable download links |
| `docs/PRODUCT_VISION.md` | Current mission, final product direction and data-preservation rules |
| `docs/TRANSLATION_WORKFLOW.md` | Target translation variants, duplicate policy and safe DeepSeek-assisted workflow |
| `VERSION.md` | Release and development version state |
| `CHANGELOG.md` | User/project-visible change history |
| `ROADMAP.md` | Completed work, next approved phase and later backlog |
| `docs/PROJECT_STATE.md` | Detailed verified state and risks |
| `docs/ARCHITECTURE.md` | Runtime design |
| `docs/MODULARIZATION_PLAN.md` | Completed staged ES-module migration plan |
| `docs/DATABASE_FORMAT.md` | Current data contract, classification and checks |
| `docs/RELEASE_AND_ROLLBACK.md` | Safe release and recovery procedure |
| `docs/HISTORICAL_CONTEXT.md` | Recovered earlier project description and its relationship to current docs |
| `docs/NEWS_PUBLISHING.md` | uNews and Telegram publication workflow |
| `docs/CONTENT_AND_RIGHTS.md` | Boundary between original code and third-party content |
| `THIRD_PARTY_NOTICES.md` | Public notice for source works and other third-party material |
| `CONTRIBUTING.md` | Contribution and Pull Request rules |
| `CITATION.cff` | GitHub citation metadata for the software project |
