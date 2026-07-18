# File map

## Current runtime

| Path | Role | Change risk |
|---|---|---:|
| `index.html` | Current page structure and styles | High |
| `script.js` | Current application logic | High |
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
| `docs/DATABASE_FORMAT.md` | Data contract and checks |
| `docs/RELEASE_AND_ROLLBACK.md` | Safe release and recovery procedure |
| `docs/HISTORICAL_CONTEXT.md` | Recovered earlier project description |
