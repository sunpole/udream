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

## Dataset registry, provenance and audit

| Path | Status |
|---|---|
| `data/datasets.json` | Machine-readable D1.2 registry; not loaded by browser runtime |
| `data/divinity_code_ru.json` | `ru-current-v1-runtime`; active dataset; 4,086 records |
| `data/bd2.json` | `source-divinity-code-en-bd2`; canonical retained source serialization |
| `data/db.json` | `source-divinity-code-en-db`; retained equivalent compatibility serialization |
| `data/report.txt` | `data-quality-report-v1`; historical generation/quality summary |
| `docs/DATA_PROVENANCE.md` | D1.1 file evidence, history, hashes and unknowns |
| `docs/DATASET_REGISTRY.md` | D1.2 identities, canonical selection, migration and rollback |
| `docs/DATA_QUALITY_AUDIT.md` | D1.3 rules, severity model, determinism and limitations |
| `reports/data-quality-audit.json` | Deterministic machine-readable D1.3 report |
| `reports/data-quality-audit.md` | Deterministic human-readable D1.3 report |
| `scripts/validate-data-provenance.mjs` | File-level provenance validator |
| `scripts/validate-dataset-registry.mjs` | Registry/file/role/policy/runtime-isolation validator |
| `scripts/audit-data-quality.mjs` | Read-only report generator and `--check` stale-report/structural gate |

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

D1.3 confirms both logical datasets have 4,086 unique ordered IDs and zero preserved-field differences. Reports contain 0 structural errors, 0 warnings and 5,022 overlapping human-review instances in five aggregated groups. These are candidates for review, not proven errors.

`data/bd2.json` and `data/db.json` are raw-distinct but parsed/canonical-JSON equal. `data/bd2.json` is the canonical maintained serialization by project-governance decision; historical originality is not claimed. `data/db.json` remains retained and unchanged.

No retained database or translation variant may be destructively replaced. Physical migration remains `planned-not-executed`.

## Planned translation tooling

No translation API client or batch script is part of the current runtime.

Future tooling may add:

| Planned area | Rule |
|---|---|
| local translation script | Must create a separate candidate dataset and support checkpoints |
| GitHub Actions translation workflow | Must use an encrypted secret and never expose the key in logs or artifacts |
| `.env.example` | May contain only an empty variable name, never a real key |
| translation manifests and reports | Must record source hash, model, prompt version, output hash and review status |

Such tooling belongs in a separate PR and must not be imported by the public browser application.

## Versioning, handoff and restoration

| Path or reference | Role |
|---|---|
| `WORK_STATUS.md` | Live cross-device task lock and exact next action |
| `docs/AI_GITHUB_WORKFLOW.md` | Binding device/chat/agent protocol |
| `VERSION.md` | Current release and documentation/data baseline |
| `version.json` | Deployed runtime version check |
| `versions/index.html` | User-facing saved-version launcher |
| `versions/v3.0.0/` | Independently runnable pre-cleanup fallback |
| Git tag `v3.0.0` | Exact immutable pre-cleanup source |
| Git tag `v3.6.0` | Exact immutable completed M5 source |
| Git tag `v23.7.0` | Previous unified-version restoration checkpoint |
| Git tag `v23.8.0` | Current functional restoration checkpoint at `24dece593bea679485057d7551a2583f7f1f5acf` |

`WORK_STATUS.md` is mutable current state. Tags and Releases are immutable restoration sources.

Direct stable download: `https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip`.

## Playwright screenshot tooling

These files are development/CI tooling only and are not imported by the site or PWA.

| Path | Role |
|---|---|
| `tools/screenshots/package.json` | Isolated package and pinned Playwright dependency |
| `tools/screenshots/package-lock.json` | Exact screenshot-tooling lock |
| `tools/screenshots/playwright.config.mjs` | Chromium configuration and local HTTP server |
| `tools/screenshots/prepare-artifacts.mjs` | Guarded artifact cleanup |
| `tools/screenshots/capture.spec.mjs` | Allowlisted scenario runner, assertions and manifest generation |
| `tools/screenshots/scenarios/*.json` | Factual desktop/mobile scenarios |
| `tools/screenshots/README.md` | Local and Actions usage guide |
| `.github/workflows/capture-screenshots.yml` | Permanent read-only capture workflow |
| `scripts/validate-screenshot-tooling.mjs` | Package/workflow/scenario/runtime-isolation validation |
| `.gitignore` | Excludes dependencies, reports and generated artifacts |

Generated browser artifacts are stored under `artifacts/screenshots/` and are never committed automatically.

## News, screenshot evidence and automation

| Path | Role |
|---|---|
| `news/*.md` | Factual patchnotes discovered by uNews |
| `news/*.{jpg,png}` | New real Telegram visuals beside patchnotes |
| `docs/SCREENSHOT_AUTOMATION.md` | Screenshot evidence contract |
| `scripts/validate-project.mjs` | Repository, handoff, active data, screenshot, provenance and patchnote validation |
| `scripts/validate-dataset-registry.mjs` | D1.2 registry validation required by CI |
| `scripts/audit-data-quality.mjs` | D1.3 report freshness and structural audit gate |
| `scripts/validate-patchnote-diff.mjs` | Requires new patchnote and image in each PR |
| `.github/workflows/validate.yml` | Tests, project/registry/audit validation, patchnote enforcement and syntax checks |
| `.github/workflows/publish-v23.8.0.yml` | Immutable release workflow |
| `.github/pull_request_template.md` | Review checklist |
| `.github/CODEOWNERS` | Review routing |

## Archive

| Path | Role |
|---|---|
| `_archive/legacy-versions/` | UI iterations `002–019` |
| `_archive/admin-versions/` | Admin prototypes `admin1–admin7` |
| `_archive/old-data/` | Older database variants and historical paths |
| `_archive/source-files/` | PDFs and historical screenshots |

Do not delete archived files as routine cleanup.

## Project governance and documentation

| Path | Role |
|---|---|
| `WORK_STATUS.md` | Mandatory start/pause/completion handoff |
| `docs/AI_GITHUB_WORKFLOW.md` | Unified GitHub-centered protocol |
| `AGENTS.md` | Binding agent instructions |
| `README.md` | Entry point, installation, state and downloads |
| `docs/PRODUCT_VISION.md` | Mission and data-preservation rules |
| `docs/TRANSLATION_WORKFLOW.md` | Translation variants and safe AI-assisted workflow |
| `docs/DATA_PROVENANCE.md` | D1.1 provenance evidence |
| `docs/DATASET_REGISTRY.md` | D1.2 logical/physical identities and migration policy |
| `docs/DATA_QUALITY_AUDIT.md` | D1.3 quality-audit contract |
| `reports/data-quality-audit.md` | Current readable audit results |
| `docs/SCREENSHOT_AUTOMATION.md` | Playwright evidence contract |
| `VERSION.md` | Release and baseline state |
| `CHANGELOG.md` | Change history |
| `ROADMAP.md` | Completed work, next phase and backlog |
| `docs/PROJECT_STATE.md` | Verified state and risks |
| `docs/ARCHITECTURE.md` | Runtime design |
| `docs/MODULARIZATION_PLAN.md` | Completed ES-module migration |
| `docs/DATABASE_FORMAT.md` | Data contract and registered identities |
| `docs/RELEASE_AND_ROLLBACK.md` | Release/recovery procedure |
| `docs/HISTORICAL_CONTEXT.md` | Historical relationship to current docs |
| `docs/NEWS_PUBLISHING.md` | uNews and image provenance workflow |
| `docs/CONTENT_AND_RIGHTS.md` | Original/third-party boundary |
| `THIRD_PARTY_NOTICES.md` | Third-party material notice |
| `CONTRIBUTING.md` | Contribution rules |
| `CITATION.cff` | Citation metadata |
