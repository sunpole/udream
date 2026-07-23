# Current project state

The current restoration checkpoint is release `v23.8.0` at commit `24dece593bea679485057d7551a2583f7f1f5acf`, published on 2026-07-20 after verification of the PWA update, cache migration, uncached version checks and installation flow. The previous checkpoint remains `v23.7.0`, while the independently runnable pre-cleanup fallback remains `v3.0.0`.

Documentation, provenance and registry baseline `23.8.9` completes D1.2. It adds stable dataset identities, a machine-readable registry, a permanent validator and a reversible future migration design. It does not change application runtime, PWA behavior, package metadata or any existing database record.

## What UDREAM is

UDREAM is a public, static GitHub Pages application for searching Christian dream-symbol reference material. It has no backend, account system, database server or browser build step.

The current product mission and final direction are defined in `docs/PRODUCT_VISION.md`. Dataset identities and canonical/retained roles are defined in `data/datasets.json` and `docs/DATASET_REGISTRY.md`. Translation variants and API-assisted data preparation are governed by `docs/TRANSLATION_WORKFLOW.md`.

## GitHub-centered work status

Real GitHub facts have the highest priority: `main`, open Pull Requests, branches, commits, tags, Releases and Actions results.

`WORK_STATUS.md` is the live source for the current task, branch, actual progress, pause point and exact next action. `docs/AI_GITHUB_WORKFLOW.md` defines how another device, ChatGPT chat, Codex session or agent continues the same work without creating a competing implementation.

The completed process baseline includes:

- cross-device handoff through `WORK_STATUS.md`;
- one task, one branch and one Pull Request;
- required factual uNews patchnotes and new real images;
- read-only Playwright Chromium screenshot artifacts;
- permanent provenance and dataset-registry validators;
- automatic GitHub Actions checks.

`ROADMAP.md` remains the long-term plan and this file remains the detailed verified state. Neither replaces the live handoff.

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

The maintained page is labelled `v23.8.0` in its title, header, menu and footer. The former `v19` label remains only in historical material. Release `v23.8.0` is the current immutable Git restoration checkpoint.

The new registry `data/datasets.json` is development/governance metadata. It is not loaded by the browser application or Service Worker.

## Verified capabilities in code

- strict search by symbol, aliases, description, tags, or all fields;
- relevance-ranked autocomplete and submitted results;
- desktop Enter, Return and mobile search submission;
- exact Russian-alias resolution to the owning primary card;
- alphabet and number/color navigation;
- tag cloud and tag filtering;
- back/forward history and breadcrumbs;
- persistent history in `localStorage`;
- safe recovery from malformed or partially written saved history;
- light/dark themes;
- Russian/English interface text;
- text-selection and scrollbar preferences;
- text and image sharing helpers;
- automatic JSON loading with manual-file fallback;
- PWA manifest and isolated service-worker registration;
- immediate Service Worker activation through `skipWaiting()` and `clients.claim()`;
- uncached checks through `version.json` and protected one-time reload when an update is detected;
- migration from older `udream-*` caches without affecting other projects on the same origin;
- install banner with system prompt support, manual instructions and standalone-app suppression.

Release `v3.6.0` completed M5. Release `v23.7.0` added centralized version metadata, strict filters, relevance ranking, Enter submission and alias resolution. Release `v23.8.0` added the verified PWA update and installation flow and remains the current restoration checkpoint.

Imported display values are escaped before DOM insertion. Notes are rendered as plain text with safe paragraphs and line breaks; raw HTML and Markdown from a manually selected JSON file are not interpreted.

The current root site and installed PWA were verified on Android during development of `v23.8.0`. D1.1 and D1.2 do not alter that runtime.

## Screenshot automation

The screenshot system is isolated under `tools/screenshots/` and is not imported by the public site or PWA.

Verified implementation includes:

- a dedicated package and lockfile;
- pinned Playwright/Chromium tooling;
- one-worker deterministic scenarios;
- local HTTP serving of the exact checkout;
- JSON scenarios with allowlisted actions and assertions;
- storage cleanup, blocked Service Worker registration and disabled animations;
- PNG validation and per-scenario provenance;
- read-only `.github/workflows/capture-screenshots.yml`;
- structural validation through `scripts/validate-screenshot-tooling.mjs`.

Documentation-only milestones may use an exact GitHub UI or document-render screenshot when the image truthfully proves the documented change.

## Data and dataset registry

D1.1 established the corrected file-level provenance. D1.2 now assigns stable identities without changing any existing file.

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

D1.2 selects `data/bd2.json` as the maintained canonical physical serialization through a project-governance decision. This does not prove that it is the historical original or authoritative source edition. `data/db.json` remains in place as a retained equivalent compatibility serialization.

The active dataset contains 4,086 ordered IDs and preserves `symbol`, `description`, `source` and `date_added`; it differs from the English logical dataset in `aliases`, `notes` and `tags`. The exact generation and translation pipeline remains unproven.

Permanent sources:

- `docs/DATA_PROVENANCE.md` — evidence, hashes, history, corrections and unknowns;
- `data/datasets.json` — machine-readable identity and policy registry;
- `docs/DATASET_REGISTRY.md` — canonical decision, retention and rollback;
- `scripts/validate-data-provenance.mjs` — file-level provenance validation;
- `scripts/validate-dataset-registry.mjs` — registry/file/policy validation.

The physical migration status is `planned-not-executed`. No deletion, rename, runtime switch or selector is approved by D1.2.

The intended target remains one canonical source dataset, one current localized dataset and up to two independent alternative Russian translations. Equivalent serializations do not count as separate variants. When only one reliable Russian translation exists, the smaller set is preferred over artificial duplication.

DeepSeek remains only a possible candidate-generation tool. No API client or key is part of the browser runtime. Any future experiment must create a separate recoverable candidate dataset and require validation plus human review.

## Documentation status

The maintained documentation set now covers:

- GitHub-centered multi-chat and multi-device execution;
- product mission and final direction;
- verified current runtime and risks;
- architecture and file ownership;
- active data contract and file-level provenance;
- stable logical and physical dataset identity;
- canonical/retained serialization roles;
- target translation topology and safe AI-assisted workflow;
- implemented real Chromium screenshot evidence;
- completed M1–M5 modularization;
- versioning, releases, download and rollback;
- uNews publication;
- rights and third-party materials;
- next approved series and later backlog.

The sources of truth are listed in `AGENTS.md` and mapped in `docs/FILE_MAP.md`.

## Historical material

The repository retains:

- UI iterations `002` through `019` in `_archive/legacy-versions/`;
- admin prototypes `admin1` through `admin7` in `_archive/admin-versions/`;
- old databases in `_archive/old-data/`;
- PDFs and screenshots in `_archive/source-files/`.

Historical files are deliberately preserved and are not the source of truth for the current site.

## Known risks and unfinished work

- The exact generation and translation pipeline is still not proven.
- The original external source URL and exact source edition remain unknown.
- D1.2 designs but does not execute the equivalent-serialization migration.
- Alternative Russian translations do not yet exist as reviewed datasets.
- The full quality audit of all 4,086 active records is not yet complete.
- The relationship between the two source books is not yet implemented as a user-selectable architecture.
- The administration workflow is archived rather than part of the maintained runtime.
- External CDN dependencies remain for fonts, icons and image capture.
- Accessibility has not been formally audited.
- Bundled source-PDF URLs and exact distribution statements still require archival evidence.
- Privacy and sharing behavior require a final documented review.

These are tracked as future work in `ROADMAP.md`; they are not hidden defects in the `v23.8.0` release.

## Next approved work

D1.3 — non-destructive data-quality audit design and reporting.

D1.3 may inspect and report problems but must not silently rewrite the current source or localized datasets. Content corrections require later separate reviewed data patches.

No user-facing database selector, physical data migration or AI-generated replacement is approved by D1.2.

## Safe restoration point

Release `v23.8.0` and its tag preserve the exact verified functional source at `24dece593bea679485057d7551a2583f7f1f5acf`. Release `v23.7.0` remains the previous unified-version checkpoint. The independently runnable fallback remains `versions/v3.0.0/`; no separate runnable `v23.8.0` snapshot was created.
