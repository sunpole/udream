# File map

## Current runtime

| Path | Role | Change risk |
|---|---|---:|
| `index.html` | Current page structure and styles | High |
| `script.js` | Current application orchestration and UI logic | High |
| `src/search.js` | Pure search and autocomplete matching | Medium |
| `src/data.js` | Database fallback loading and manual JSON parsing | Medium |
| `src/history.js` | Pure navigation, breadcrumbs and full-history operations | Medium |
| `src/state.js` | Initial state and persisted preference restoration | Medium |
| `src/storage.js` | Typed localStorage reads, writes and serialization | Medium |
| `tests/search.test.js` | Search regression tests | Low |
| `tests/data.test.js` | Database loader and fallback tests | Low |
| `tests/history.test.js` | Navigation, breadcrumbs and history regression tests | Low |
| `tests/state.test.js` | Initial-state regression tests | Low |
| `tests/storage.test.js` | localStorage serialization and fallback tests | Low |
| `package.json` | Dependency-free test command and ES-module mode | Low |
| `data/divinity_code_ru.json` | Active database | Critical |
| `manifest.json` | PWA metadata and icons | Medium |
| `sw.js` | Offline cache | High |
| `favicon.svg` | Browser/site icon | Low |
| `icon-192.png` | PWA icon | Low |
| `icon-512.png` | PWA icon | Low |
| `apple-touch-icon.png` | Apple home-screen icon | Low |
| `preview.jpg` | Social sharing preview | Low |
| `.nojekyll` | GitHub Pages behavior | Medium |

## Data and reports

| Path | Status |
|---|---|
| `data/divinity_code_ru.json` | Active runtime database |
| `data/bd2.json` | Retained variant; relationship requires documentation |
| `data/db.json` | Retained variant; relationship requires documentation |
| `data/report.txt` | Existing generation/quality summary |

## Versioning

| Path | Role |
|---|---|
| `versions/index.html` | User-facing version launcher |
| `versions/v3.0.0/` | Runnable copy of the stable release checkpoint |
| Git tag `v3.0.0` | Exact immutable pre-cleanup source |

The tag is the exact restoration source. The runnable directory has only path/scoping adaptations required to operate below `/versions/v3.0.0/`.

## News and automation

| Path | Role |
|---|---|
| `news/*.md` | Factual patchnotes discovered by uNews |
| `news/*.{jpg,png}` | Telegram visuals stored beside their patchnotes |
| `scripts/validate-project.mjs` | Repository, database and patchnote validation |
| `scripts/validate-patchnote-diff.mjs` | Requires a newly added patchnote in each Pull Request |
| `.github/workflows/validate.yml` | Automatic validation for pushes and Pull Requests |
| `.github/pull_request_template.md` | Review checklist including uNews publication impact |
| `.github/CODEOWNERS` | Default repository owner for review routing |

## Archive

| Path | Role |
|---|---|
| `_archive/legacy-versions/` | UI iterations `002–019` |
| `_archive/admin-versions/` | Admin prototypes `admin1–admin7` |
| `_archive/old-data/` | Older database files |
| `_archive/source-files/` | PDFs and historical screenshots |

Do not delete archived files as routine cleanup. Git history is valuable, but the archive also documents intermediate product decisions and may contain files that were never released separately.

## Project governance

| Path | Role |
|---|---|
| `AGENTS.md` | Binding instructions for future coding agents |
| `README.md` | Entry point and verified current overview |
| `VERSION.md` | Release and development version state |
| `CHANGELOG.md` | User/project-visible change history |
| `ROADMAP.md` | Priorities and unfinished work |
| `docs/PROJECT_STATE.md` | Detailed verified state and risks |
| `docs/ARCHITECTURE.md` | Runtime design |
| `docs/MODULARIZATION_PLAN.md` | Staged ES-module migration plan |
| `docs/DATABASE_FORMAT.md` | Data contract and checks |
| `docs/RELEASE_AND_ROLLBACK.md` | Safe release and recovery procedure |
| `docs/HISTORICAL_CONTEXT.md` | Recovered earlier project description |
| `docs/NEWS_PUBLISHING.md` | uNews and Telegram publication workflow |
| `docs/CONTENT_AND_RIGHTS.md` | Boundary between original code and third-party content |
| `THIRD_PARTY_NOTICES.md` | Public notice for source works and other third-party material |
| `CONTRIBUTING.md` | Contribution and Pull Request rules |
| `CITATION.cff` | GitHub citation metadata for the software project |
