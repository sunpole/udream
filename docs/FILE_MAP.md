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
| `tests/*.test.js` | Dependency-free regression tests | Low |
| `package.json` | Application version, test command and ES-module mode | Low |
| `data/divinity_code_ru.json` | Active published database | Critical |
| `manifest.json` | PWA identity, scope, metadata and icons | Medium |
| `sw.js` | Offline cache, immediate activation and runtime fetch strategy | High |
| `favicon.svg`, `icon-*.png`, `apple-touch-icon.png` | Browser and PWA icons | Low |
| `preview.jpg` | Social sharing preview | Low |
| `.nojekyll` | GitHub Pages behavior | Medium |

## Dataset registry and data evidence

| Path | Status |
|---|---|
| `data/datasets.json` | Machine-readable D1.2 registry; not loaded by the browser runtime |
| `data/divinity_code_ru.json` | Physical ID `ru-current-v1-runtime`; active mixed-language localized and augmented runtime dataset; 4,086 records |
| `data/bd2.json` | Physical ID `source-divinity-code-en-bd2`; canonical retained serialization of logical dataset `source-divinity-code-en` |
| `data/db.json` | Physical ID `source-divinity-code-en-db`; retained equivalent compatibility serialization of the same logical dataset |
| `data/report.txt` | Supporting ID `data-quality-report-v1`; historical generation/quality summary |
| `docs/DATA_PROVENANCE.md` | D1.1 evidence: hashes, Git history, comparisons, corrections, inferences and unknowns |
| `docs/DATASET_REGISTRY.md` | D1.2 identity, canonical selection, reference-audit, migration and rollback rules |
| `scripts/validate-data-provenance.mjs` | Permanent byte/hash/schema/canonical-identity and field-difference validator |
| `scripts/validate-dataset-registry.mjs` | Permanent registry/file/role/policy/runtime-isolation validator |

Logical dataset IDs:

```text
source-divinity-code-en
ru-current-v1
```

Physical file IDs:

```text
source-divinity-code-en-bd2
source-divinity-code-en-db
ru-current-v1-runtime
```

`data/bd2.json` and `data/db.json` are raw-distinct but parsed/canonical-JSON equal. D1.2 selects `data/bd2.json` as the canonical maintained physical serialization through a project-governance decision. This does not prove historical originality. `data/db.json` remains retained and unchanged.

No retained database or translation variant may be destructively replaced. The target logical topology is one canonical source dataset, one current localized dataset and up to two independent alternative Russian translations. Equivalent serializations are one logical source dataset, not separate variants.

## Planned translation tooling

No translation API client or batch script is part of the current runtime.

Future D1 tooling may add:

| Planned area | Rule |
|---|---|
| local translation script | Must create a separate candidate dataset and support checkpoints |
| GitHub Actions translation workflow | Must use an encrypted secret and never expose the key in logs or artifacts |
| `.env.example` | May contain only an empty variable name, never a real key |
| translation manifests and reports | Must record source hash, model, prompt version, output hash and review status |

Any such tooling belongs under a separate implementation PR and must not be imported by the public browser application.

## Versioning, handoff and restoration

| Path or reference | Role |
|---|---|
| `WORK_STATUS.md` | Live cross-device and cross-chat task lock: active branch, actual progress, pause point and exact next action |
| `docs/AI_GITHUB_WORKFLOW.md` | Binding priority order and execution protocol for devices, chats and AI agents |
| `VERSION.md` | Current release and documentation/provenance/registry baseline |
| `version.json` | Deployed runtime version check |
| `versions/index.html` | User-facing saved-version launcher |
| `versions/v3.0.0/` | Independently runnable pre-cleanup fallback |
| Git tag `v3.0.0` | Exact immutable pre-cleanup source |
| Git tag `v3.6.0` | Exact immutable completed M5 source |
| Git tag `v23.7.0` | Previous unified-version restoration checkpoint |
| Git tag `v23.8.0` | Current immutable functional restoration checkpoint at `24dece593bea679485057d7551a2583f7f1f5acf` |

`WORK_STATUS.md` is intentionally mutable and records current work. Git tags and Releases are immutable restoration sources. These roles must not be confused.

The direct stable source download is `https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip`.

## Playwright screenshot tooling

These files are development and CI tooling only. They are not imported by the public site, PWA or Service Worker.

| Path | Role |
|---|---|
| `tools/screenshots/package.json` | Private isolated package, capture scripts and pinned Playwright dependency |
| `tools/screenshots/package-lock.json` | Exact lock for screenshot tooling |
| `tools/screenshots/playwright.config.mjs` | One-worker Chromium configuration and local HTTP server |
| `tools/screenshots/prepare-artifacts.mjs` | Guarded artifact cleanup |
| `tools/screenshots/capture.spec.mjs` | Allowlisted scenario runner, assertions, PNG capture and manifest generation |
| `tools/screenshots/scenarios/*.json` | Factual desktop/mobile startup, search and alias scenarios |
| `tools/screenshots/README.md` | Local and GitHub Actions usage guide |
| `tools/screenshots/v23.8.7-selected-image.json` | Exact provenance of the approved screenshot |
| `.github/workflows/capture-screenshots.yml` | Permanent read-only Chromium capture and artifact workflow |
| `scripts/validate-screenshot-tooling.mjs` | Package, workflow, scenario and runtime-isolation validation |
| `.gitignore` | Excludes browser dependencies, reports and generated artifacts |

Generated artifacts are stored under `artifacts/screenshots/` and are never committed automatically.

## News, screenshot evidence and automation

| Path | Role |
|---|---|
| `news/*.md` | Factual patchnotes discovered by uNews |
| `news/*.{jpg,png}` | New real Telegram visuals stored beside their patchnotes |
| `docs/SCREENSHOT_AUTOMATION.md` | Real-screenshot definition, Playwright workflow and review contract |
| `scripts/validate-project.mjs` | Repository, handoff, screenshot tooling, provenance, active database, patchnote and image validation |
| `scripts/validate-dataset-registry.mjs` | D1.2 registry validation required by CI |
| `scripts/validate-patchnote-diff.mjs` | Requires a new patchnote and newly added screenshot evidence in each Pull Request |
| `.github/workflows/validate.yml` | Automatic tests, project validation, registry validation, PR patchnote enforcement and syntax checks |
| `.github/workflows/publish-v23.8.0.yml` | Immutable one-release workflow for tag and GitHub Release publication |
| `.github/pull_request_template.md` | Review checklist including handoff and screenshot provenance |
| `.github/CODEOWNERS` | Default repository owner for review routing |

## Archive

| Path | Role |
|---|---|
| `_archive/legacy-versions/` | UI iterations `002–019` |
| `_archive/admin-versions/` | Admin prototypes `admin1–admin7` |
| `_archive/old-data/` | Older database files and variants, including historical `db_v2` paths |
| `_archive/source-files/` | PDFs and historical screenshots |

Do not delete archived files as routine cleanup. Git history is valuable, but the archive also documents intermediate product decisions and may contain files that were never released separately.

## Project governance and documentation

| Path | Role |
|---|---|
| `WORK_STATUS.md` | Mandatory start/pause/completion record for continuing work across devices, chats and agents |
| `docs/AI_GITHUB_WORKFLOW.md` | Unified GitHub-centered operating protocol and conflict recovery |
| `AGENTS.md` | Binding instructions for future coding agents |
| `README.md` | Entry point, current overview, installation, screenshots and stable download links |
| `docs/PRODUCT_VISION.md` | Current mission, final product direction and data-preservation rules |
| `docs/TRANSLATION_WORKFLOW.md` | Target translation variants and safe AI-assisted workflow |
| `docs/DATA_PROVENANCE.md` | Verified D1.1 provenance, hashes, Git history and corrected dataset classification |
| `docs/DATASET_REGISTRY.md` | Verified D1.2 logical/physical identities and migration policy |
| `docs/SCREENSHOT_AUTOMATION.md` | Real screenshot and implemented Playwright workflow contract |
| `VERSION.md` | Release and baseline state |
| `CHANGELOG.md` | User/project-visible change history |
| `ROADMAP.md` | Completed work, next approved phase and later backlog |
| `docs/PROJECT_STATE.md` | Detailed verified state and risks |
| `docs/ARCHITECTURE.md` | Runtime design |
| `docs/MODULARIZATION_PLAN.md` | Completed staged ES-module migration plan |
| `docs/DATABASE_FORMAT.md` | Current data contract, registry classification and checks |
| `docs/RELEASE_AND_ROLLBACK.md` | Safe release and recovery procedure |
| `docs/HISTORICAL_CONTEXT.md` | Earlier project description and relationship to current docs |
| `docs/NEWS_PUBLISHING.md` | uNews, Telegram and screenshot-provenance workflow |
| `docs/CONTENT_AND_RIGHTS.md` | Boundary between original code and third-party content |
| `THIRD_PARTY_NOTICES.md` | Public notice for source works and other third-party material |
| `CONTRIBUTING.md` | Contribution and Pull Request rules |
| `CITATION.cff` | GitHub citation metadata for the software project |
