# Current project state

The current restoration checkpoint is release `v3.5.0` at commit `b0ff02d4248f5dcf56137377f510c12c316e4b85`, published on 2026-07-19 after verification of M1–M4. The previous pre-cleanup checkpoint remains `v3.0.0` at commit `94c14db5321edea3036d896b727790db5f6aec27`.

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

The page is labelled `v19` in its title and header. This is a legacy interface iteration. The current Git restoration checkpoint is `v3.5.0`.

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

Release `v3.5.0` contains the completed M1–M4 native ES-module migration. Search, data loading, initial state, navigation history, local storage, localization and pure presentation builders have dependency-free regression tests. The next development line is `v3.6.0-dev` for M5; no M5 runtime changes have been committed yet.

Imported display values are escaped before DOM insertion, including quotes used inside `data-*` attributes. Notes are rendered as plain text with safe paragraphs and line breaks; raw HTML and Markdown from a manually selected JSON file are not interpreted.

The current root site was locally verified on an Android phone through Ubuntu in UserLAnd after M4. Database loading, search, cards, history, themes, language controls, the version launcher and the runnable `v3.0.0` snapshot were reported working. PWA installation and a deliberate offline reload remain separate M5 tests.

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
- External CDN dependencies remain for fonts, icons and image capture; note rendering no longer requires Marked.
- Accessibility has not been formally audited.
- Bundled source-PDF distribution status should be confirmed.
- Automatic uNews publication should be observed for the first uDream patchnote before treating the integration as fully proven end to end.

## Safe restoration point

Release `v3.5.0` and its tag preserve the exact verified M4 source at `b0ff02d4248f5dcf56137377f510c12c316e4b85`. The independently runnable fallback remains `versions/v3.0.0/`; no separate runnable `v3.5.0` snapshot was created.
