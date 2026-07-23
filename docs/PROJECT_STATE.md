# Current project state

The current restoration checkpoint is release `v23.8.0` at commit `24dece593bea679485057d7551a2583f7f1f5acf`, published on 2026-07-20 after verification of the PWA update, cache migration, uncached version checks and installation flow. The previous checkpoint remains `v23.7.0`, while the independently runnable pre-cleanup fallback remains `v3.0.0`.

Documentation, provenance, registry and audit baseline `23.8.10` completes D1.3. It adds deterministic read-only quality reports and a permanent audit command without changing application runtime, PWA behavior, package metadata or any existing database record.

## What UDREAM is

UDREAM is a public, static GitHub Pages application for searching Christian dream-symbol reference material. It has no backend, account system, database server or browser build step.

The product mission is defined in `docs/PRODUCT_VISION.md`. Dataset identities and canonical/retained roles are defined in `data/datasets.json` and `docs/DATASET_REGISTRY.md`. Translation variants are governed by `docs/TRANSLATION_WORKFLOW.md`. Audit rules and factual reports are in `docs/DATA_QUALITY_AUDIT.md` and `reports/`.

## GitHub-centered work status

Real GitHub facts have the highest priority: `main`, open Pull Requests, branches, commits, tags, Releases and Actions results.

`WORK_STATUS.md` is the live source for the current task, branch, actual progress, pause point and exact next action. `docs/AI_GITHUB_WORKFLOW.md` defines how another device, ChatGPT chat, Codex session or agent continues the same work without creating a competing implementation.

The completed process baseline includes:

- cross-device handoff through `WORK_STATUS.md`;
- one task, one branch and one Pull Request;
- factual uNews patchnotes and new real images;
- read-only Playwright Chromium screenshot artifacts;
- permanent provenance, registry and data-quality checks;
- automatic GitHub Actions validation.

## Published runtime

The current site is served from the repository root:

```text
index.html
script.js
src/version.js
version.json
manifest.json
sw.js
data/divinity_code_ru.json
```

The maintained page is labelled `v23.8.0`. Release `v23.8.0` is the current immutable Git restoration checkpoint.

`data/datasets.json` and `reports/` are development/governance artifacts. They are not loaded by the browser application or Service Worker.

## Verified capabilities in code

- strict search by symbol, aliases, description, tags, or all fields;
- relevance-ranked autocomplete and submitted results;
- desktop Enter, Return and mobile search submission;
- exact Russian-alias resolution to the owning primary card;
- alphabet and number/color navigation;
- tag cloud and tag filtering;
- back/forward history and breadcrumbs;
- persistent history in `localStorage`;
- safe recovery from malformed saved history;
- light/dark themes;
- Russian/English interface text;
- text-selection and scrollbar preferences;
- text and image sharing helpers;
- automatic JSON loading with manual-file fallback;
- PWA manifest and isolated service-worker registration;
- immediate Service Worker activation;
- uncached deployed-version checks and protected one-time reload;
- migration from older `udream-*` caches without affecting other projects;
- installation banner and standalone-mode suppression.

The current root site and installed PWA were verified on Android during development of `v23.8.0`. D1.1–D1.3 do not alter that runtime.

## Data and dataset registry

### Logical datasets

| Logical dataset ID | Role | Status |
|---|---|---|
| `source-divinity-code-en` | English source logical dataset | retained source |
| `ru-current-v1` | localized and augmented current dataset | runtime current |

### Physical files

| Physical file ID | Path | Role | Status |
|---|---|---|---|
| `source-divinity-code-en-bd2` | `data/bd2.json` | canonical serialization | canonical retained |
| `source-divinity-code-en-db` | `data/db.json` | compatibility serialization | retained equivalent |
| `ru-current-v1-runtime` | `data/divinity_code_ru.json` | active runtime | runtime current |

`data/bd2.json` and `data/db.json` have different raw bytes and SHA-256 values but identical parsed and canonical JSON. They represent one logical English dataset, not two translations.

D1.2 selects `data/bd2.json` as the maintained canonical physical serialization through a project-governance decision. This does not prove historical originality. `data/db.json` remains a retained equivalent compatibility serialization.

The physical migration status remains `planned-not-executed`. No deletion, rename, runtime switch or selector is approved.

## D1.3 quality-audit results

D1.3 audits the canonical source dataset and current runtime dataset with a deterministic, read-only script.

Permanent sources:

- `docs/DATA_QUALITY_AUDIT.md` — rules, severity model and limitations;
- `scripts/audit-data-quality.mjs` — report generator and `--check` validator;
- `reports/data-quality-audit.json` — machine-readable facts;
- `reports/data-quality-audit.md` — human-readable report.

Verified structural facts:

- both logical datasets contain 4,086 records;
- IDs are unique, ordered and aligned from 1 through 4,086;
- preserved-field differences are 0 for `id`, `symbol`, `description`, `source` and `date_added`;
- expected changed-field counts are aliases 4,083, notes 4,086 and tags 4,086;
- structural gate: pass;
- structural errors: 0;
- warnings: 0.

The audit reports 5,022 human-review instances in five aggregated groups:

- source alias collisions: 693;
- current alias collisions: 854;
- source alias-to-primary matches: 1,145;
- current alias-to-primary matches: 1,145;
- empty source notes: 1,185.

These are not 5,022 proven errors. Findings can overlap, shared aliases may be intentional, and empty source notes may reflect source structure. The audit never changes data.

## Documentation status

The maintained documentation covers:

- GitHub-centered multi-chat and multi-device execution;
- product mission and final direction;
- verified runtime and risks;
- architecture and file ownership;
- file-level provenance;
- stable logical and physical dataset identity;
- canonical/retained serialization roles;
- deterministic audit rules and reports;
- target translation topology and safe AI-assisted workflow;
- real Chromium screenshot evidence;
- completed M1–M5 modularization;
- versioning, releases, download and rollback;
- uNews publication;
- rights and third-party materials;
- next approved work and later backlog.

## Historical material

The repository retains:

- UI iterations `002` through `019` in `_archive/legacy-versions/`;
- admin prototypes `admin1` through `admin7` in `_archive/admin-versions/`;
- old databases in `_archive/old-data/`;
- PDFs and screenshots in `_archive/source-files/`.

Historical files are preserved and are not the source of truth for the current site.

## Known risks and unfinished work

- The exact generation and translation pipeline remains unproven.
- The original external source URL and exact source edition remain unknown.
- The equivalent-serialization migration is designed but not executed.
- Audit review findings have not received full human/source review.
- Alternative Russian translations do not yet exist as reviewed datasets.
- The relationship between the two source books is not yet implemented as a user-selectable architecture.
- The administration workflow is archived rather than maintained runtime.
- External CDN dependencies remain.
- Accessibility has not been formally audited.
- Bundled source-PDF URLs and exact distribution statements still require archival evidence.
- Privacy and sharing behavior require final review.

These are tracked in `ROADMAP.md`; they are not hidden defects in `v23.8.0`.

## Next approved work

D1.4 — two-book product architecture.

D1.4 is architecture-only unless a separate functional implementation phase is approved. It must define source identity, user-visible provenance, switching/combined/side-by-side options, history and deep-link behavior, validation, cache handling and stable fallback before any selector is implemented.

No physical data migration, user-facing selector or AI-generated replacement is approved by D1.3.

## Safe restoration point

Release `v23.8.0` and its tag preserve the exact verified functional source at `24dece593bea679485057d7551a2583f7f1f5acf`. Release `v23.7.0` remains the previous unified-version checkpoint. The independently runnable fallback remains `versions/v3.0.0/`.
