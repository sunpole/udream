# Current project state

Verified against `main` at commit `94c14db5321edea3036d896b727790db5f6aec27` and release `v3.0.0`.

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
- light/dark themes;
- Russian/English interface text;
- text-selection and scrollbar preferences;
- text and image sharing helpers;
- automatic JSON loading with manual-file fallback;
- PWA manifest and service-worker registration.

These are code-level findings. They do not replace a current browser and offline regression test.

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

## Safe restoration point

Release `v3.0.0` and its tag preserve the exact pre-cleanup source. The runnable copy under `versions/v3.0.0/` contains path-only adaptations so it can operate from a version subdirectory without depending on the future root database.
