# Architecture

## Runtime model

UDREAM is a static browser application:

```text
GitHub Pages
    ↓
index.html
    ↓
script.js ──import──> src/search.js
    ├─import──> src/data.js ──fetch──> data/divinity_code_ru.json
    ├─import──> src/history.js
    ├─import──> src/i18n.js
    ├─import──> src/presentation.js
     ├─import──> src/pwa.js ──register──> sw.js
    ├─import──> src/storage.js
    └─import──> src/state.js
    ↓
DOM + localStorage + Web Share APIs
```

There is no server-side application code. GitHub Pages serves files; the browser performs all search, filtering, rendering, preferences, and history management.

## Current components

### `index.html`

- page structure and inline CSS;
- current/legacy label `v19`;
- menu, search controls, history controls, result area, alphabet rows, tags, and footer;
- external CDN dependencies;
- links to reference PDFs;
- loads `script.js`.

### `script.js`

- application orchestration and mutable UI state;
- JSON loading;
- autocomplete UI, tag, alphabet, color, and digit behavior;
- DOM event binding for prebuilt presentation fragments;
- history and breadcrumb DOM rendering;
- theme and UI preference DOM effects;
- sharing helpers;

### `src/search.js`

- pure search and autocomplete matching functions;
- preserves prefix matching for autocomplete and substring matching for submitted search;
- uses JSDoc and `// @ts-check` without a TypeScript build step;
- is covered by dependency-free Node.js regression tests.

### `src/data.js`

- owns ordered database path fallback and manual JSON parsing;
- preserves the runtime contract of a non-empty JSON array;
- returns records plus source metadata without touching the DOM.

### `src/state.js`

- creates the initial application state from defaults and the storage module;
- normalizes restored full-history data before the UI starts;
- does not own later UI mutations, which remain in `script.js` until M4;
- can be tested without a browser.

### `src/history.js`

- owns pure navigation-stack and breadcrumb-window operations;
- appends and normalizes persistent history entries;
- groups full history by day without touching the DOM;
- preserves navigation branch truncation and back/forward boundaries.

### `src/storage.js`

- owns string, boolean and JSON reads from browser storage;
- owns browser-compatible serialization and removal;
- returns documented defaults when storage is unavailable or JSON is malformed;
- contains no application UI or database logic.

### `src/i18n.js`

- owns the complete RU/EN interface dictionary, language normalization and reviewed instruction HTML;
- falls back to Russian for missing or corrupted stored language values;
- marks the single translation that intentionally contains trusted line-break HTML.

### `src/pwa.js`

- owns service-worker registration after the browser `load` event;
- safely does nothing when service workers are unavailable;
- reports registration success or failure without blocking application startup;
- is covered by dependency-free Node.js regression tests.

### `src/presentation.js`

- owns pure HTML builders for records, lists, history, breadcrumbs, tags, autocomplete, statistics and sharing;
- escapes text and attribute values from imported JSON, including both quote types;
- renders notes as safe plain text with paragraphs and line breaks instead of interpreting raw HTML or Markdown;
- contains no DOM queries, event listeners, browser storage or search logic.

The staged migration plan is documented in `docs/MODULARIZATION_PLAN.md`.

### `data/divinity_code_ru.json`

The active runtime database. It is loaded client-side and kept in browser memory for searching.

### `manifest.json`

PWA identity, start URL, theme colors, and install icons.

### `sw.js`

Caches the application shell and active database. Cache names must change when cached runtime assets change, otherwise installed clients may keep stale files.

### `versions/`

Contains the saved-version launcher and runnable snapshots. Each snapshot should use relative paths, its own active database, its own manifest, and a scoped service worker.

### `_archive/`

Historical/reference storage. The current application must not import scripts or databases from archived numbered versions.

## Repository automation

GitHub Actions runs `scripts/validate-project.mjs` for Pull Requests and pushes to `main`. The check validates runtime assets, manifests, the 4,086-record active database, unique IDs, required record types, and uNews patchnote images. Pull Requests also run `scripts/validate-patchnote-diff.mjs` and must add a new factual file under `news/`.

The uNews publisher is intentionally external to the website runtime. Its scheduled workflow lives in `sunpole/uNews`, scans public repositories owned by `sunpole`, discovers `sunpole/udream/news/*.md`, and publishes previously unseen valid patchnotes to Telegram. Telegram credentials are never required by the uDream site or repository checks.

## External dependencies

Loaded from CDNs at runtime:

- Google Fonts (`Inter`);
- Font Awesome;
- html2canvas.

The core search and note rendering remain repository-hosted, but fonts, icons and image-sharing presentation may degrade offline unless the remaining external resources have already been cached by the browser.

## State and privacy

Preferences and browsing history are stored locally in the browser via `localStorage`. There is no project backend receiving this state. Sharing occurs only when the user invokes the share helpers and the browser supports the required API.

## Architectural constraints

- Keep GitHub Pages compatibility.
- Keep the app usable without a build step unless explicitly changed.
- Do not introduce server requirements for ordinary search.
- Separate content/database migrations from UI changes.
- Preserve old releases and runnable snapshots.
