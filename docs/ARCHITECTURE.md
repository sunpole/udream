# Architecture

## Runtime model

UDREAM is a static browser application:

```text
GitHub Pages
    ↓
index.html
    ↓
script.js ──fetch──> data/divinity_code_ru.json
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

- application state and localization;
- JSON loading;
- search, autocomplete, tag, alphabet, color, and digit behavior;
- result-card rendering;
- history and breadcrumbs;
- theme and UI preferences in `localStorage`;
- sharing helpers;
- service-worker registration.

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
- Marked;
- html2canvas.

The core search remains repository-hosted, but some presentation and sharing features may degrade offline unless these external resources have already been cached by the browser.

## State and privacy

Preferences and browsing history are stored locally in the browser via `localStorage`. There is no project backend receiving this state. Sharing occurs only when the user invokes the share helpers and the browser supports the required API.

## Architectural constraints

- Keep GitHub Pages compatibility.
- Keep the app usable without a build step unless explicitly changed.
- Do not introduce server requirements for ordinary search.
- Separate content/database migrations from UI changes.
- Preserve old releases and runnable snapshots.
