# Current project state

The restoration checkpoint was verified at commit `94c14db5321edea3036d896b727790db5f6aec27` and release `v3.0.0`. Repository-ordering work was merged to `main` at commit `50bb686217ef97b5cf96759e7e7f222a311f93f8`.

## What UDREAM is

UDREAM is a public, static GitHub Pages application for searching Christian dream-symbol reference material. It has no backend, account system, database server, package manager, or build step.

## Published runtime

The current site is served from the repository root:

```text
index.html
script.js
manifest.json
sw.js
data/divinity_code_ru.json
```

The page is labelled `v19` in its title and header. This is a legacy interface iteration. The current Git restoration checkpoint is `v3.0.0`.

## Verified capabilities in code

- search by symbol, aliases, description, tags, or all fields;
- autocomplete;
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
- PWA manifest and service-worker registration.

The active development line has completed M3 of the native ES-module migration: search, data loading, initial state, navigation history and local storage now have dependency-free regression tests. DOM presentation and localization remain in `script.js` for M4.

The current site, search for `Water` and `Mouse`, result cards, menu, version launcher, and runnable `v3.0.0` snapshot were visually checked on a Samsung Galaxy A57 5G after the repository-ordering merge. PWA installation and a deliberate offline reload remain separate tests.

## Development news

User-visible changes are documented in `news/`. The public uNews repository automatically discovers new uDream patchnotes after they reach `main`, validates them, and publishes previously unseen entries to `@uNewsLog` through GitHub Actions.

uDream stores no Telegram credentials. The publication contract is documented in `docs/NEWS_PUBLISHING.md`.

## Data

All three root data files contain 4,086 records but have different hashes:

```text
data/bd2.json
data/db.json
data/divinity_code_ru.json
```

The application currently loads `data/divinity_code_ru.json`. The purpose and generation relationship of the other two variants is not yet fully documented.

## Historical material

The repository retains:

- UI iterations `002` through `019` in `_archive/legacy-versions/`;
- admin prototypes `admin1` through `admin7` in `_archive/admin-versions/`;
- old databases in `_archive/old-data/`;
- PDFs and screenshots in `_archive/source-files/`.

Historical files are deliberately preserved and are not the source of truth for the current site.

## Known risks and unfinished work

- Database provenance and transformation steps are not fully documented.
- The three current data variants require classification.
- The administration workflow is archived rather than part of the maintained runtime.
- PWA/offline behavior needs device-level verification after the cache alignment.
- The current UI still uses the historical `v19` label.
- External CDN dependencies are required for fonts, icons, Markdown rendering, and image capture.
- Accessibility has not been formally audited.
- Bundled source-PDF distribution status should be confirmed.
- Automatic uNews publication should be observed for the first uDream patchnote before treating the integration as fully proven end to end.

## Safe restoration point

Release `v3.0.0` and its tag preserve the exact pre-cleanup source. The runnable copy under `versions/v3.0.0/` contains path-only adaptations so it can operate from a version subdirectory without depending on the future root database.
