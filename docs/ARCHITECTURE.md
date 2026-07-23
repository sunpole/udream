# Architecture

## Runtime model

UDREAM is a static browser application:

```text
GitHub Pages
    ↓
index.html
    ↓
script.js ──import──> src/search.js
    ├─import──> src/version.js
    ├─import──> src/data.js ──fetch──> data/divinity_code_ru.json
    ├─import──> src/history.js
    ├─import──> src/i18n.js
    ├─import──> src/presentation.js
    ├─import──> src/pwa.js ──register──> sw.js
    │                         └─check──> version.json
    ├─import──> src/storage.js
    └─import──> src/state.js
    ↓
DOM + localStorage + Web Share APIs
```

There is no server-side application code. GitHub Pages serves files; the browser performs search, rendering, preferences, history, update checks and installation UI.

The following are repository tooling, not runtime dependencies:

```text
data/datasets.json
reports/data-quality-audit.json
reports/data-quality-audit.md
scripts/validate-data-provenance.mjs
scripts/validate-dataset-registry.mjs
scripts/audit-data-quality.mjs
```

## Current components

### Runtime

- `index.html` — page structure, inline CSS, controls, install host and footer.
- `script.js` — application orchestration and DOM events.
- `src/version.js` — runtime version, visible labels and title.
- `src/search.js` — strict search, relevance and alias resolution.
- `src/data.js` — active database loading/manual JSON parsing.
- `src/state.js` — initial state and restored preferences.
- `src/history.js` — navigation, breadcrumbs and history grouping.
- `src/storage.js` — typed browser-storage operations.
- `src/i18n.js` — RU/EN interface dictionary.
- `src/presentation.js` — escaped pure HTML builders.
- `src/pwa.js` — Service Worker registration, update and installation flow.
- `version.json` — uncached deployed-version signal.
- `manifest.json` — PWA identity and icons.
- `sw.js` — application shell/active database cache and update strategy.

### Active data

`data/divinity_code_ru.json` is physical file `ru-current-v1-runtime` and the only active runtime dataset. Its 4,086 records remain published until a separate approved functional data release changes the contract.

### Registry metadata

`data/datasets.json` defines logical/physical IDs, roles, hashes, canonical choice, source relationships, migration policy and translation policy. It cannot switch the active runtime database.

### Audit reports

`reports/data-quality-audit.json` and `.md` are deterministic outputs generated from registered canonical source/current datasets. They are not loaded by the browser or cached by the Service Worker.

`scripts/audit-data-quality.mjs` supports generation and `--check`. The audit writes reports only and never modifies `data/` inputs.

### Saved versions and archive

- `versions/` contains runnable snapshots with independent relative paths and scoped PWA files.
- `_archive/` contains historical/reference material and is not imported by current runtime.

## Dataset identity boundary

```text
source-divinity-code-en
  ├─ source-divinity-code-en-bd2 -> data/bd2.json (canonical retained)
  └─ source-divinity-code-en-db  -> data/db.json  (retained equivalent)

ru-current-v1
  └─ ru-current-v1-runtime       -> data/divinity_code_ru.json (runtime current)
```

The canonical English choice is a project-governance decision and does not prove historical originality.

```text
physical migration: planned-not-executed
remove_or_rename_approved: false
```

A future selector or combined search requires separate architecture and a functional release. Registry/audit tooling does not authorize runtime switching.

## Quality-audit boundary

D1.3 verifies:

```text
records per logical dataset: 4086
ordered/unique/aligned IDs: true
preserved-field differences: 0
structural errors: 0
warnings: 0
review instances: 5022 in five groups
structural gate: pass
```

Review instances may overlap and are not proven content errors. The audit cannot decide theological correctness, preferred wording, source intent or whether shared aliases are intentional. Corrections require separate evidence-based data PRs.

## Repository automation

GitHub Actions runs:

- dependency-free application regression tests;
- project/runtime/data/handoff/screenshot/patchnote validation;
- D1.1 provenance validation;
- D1.2 registry validation;
- D1.3 report freshness and structural gate;
- PR patchnote/new-image enforcement;
- JavaScript syntax checks.

The `v23.8.0` release workflow separately verifies exact SHA and runtime-version consistency.

uNews is external to runtime. It discovers valid `news/*.md` from public `main` and publishes through its own Actions workflow. Telegram credentials are not stored in uDream.

## Screenshot tooling

Playwright tooling under `tools/screenshots/` is isolated from runtime. The permanent capture workflow is read-only. Documentation/audit patchnotes may use an exact GitHub document/report page captured by a self-removing one-time workflow.

## External dependencies

Runtime CDN dependencies:

- Google Fonts (`Inter`);
- Font Awesome;
- html2canvas.

Core search and safe note rendering are repository-hosted. Fonts/icons/image sharing may degrade offline when not already cached by the browser.

## State and privacy

Preferences/history use localStorage. There is no project backend receiving them. Sharing occurs only when the user invokes browser share helpers.

## Architectural constraints

- Keep GitHub Pages compatibility.
- Keep the app usable without a build step unless explicitly changed.
- Do not introduce a server for ordinary search.
- Separate data migration, content correction, UI and architecture work.
- Preserve releases, runnable snapshots, sources and translation variants.
- Keep registry and audit tooling outside runtime until a functional architecture explicitly requires otherwise.
- Do not delete/rename retained physical data while migration is `planned-not-executed`.
- D1.4 must define two-book provenance, modes, history/deep links, validation/cache/fallback and rollback before selector implementation.
