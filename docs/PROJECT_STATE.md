# Current project state

The current restoration checkpoint is release `v3.6.0` at commit `02555f3b0dcc4983cdf6d9e564a1ad68e570d887`, published on 2026-07-20 after verification of M1–M5. The previous checkpoint remains `v3.5.0`, while the independently runnable pre-cleanup fallback remains `v3.0.0`.

## What UDREAM is

UDREAM is a public, static GitHub Pages application for searching Christian dream-symbol reference material. It has no backend, account system, database server, package manager, or build step.

## Published runtime

The current site is served from the repository root:

```text
index.html
script.js
src/version.js
manifest.json
sw.js
data/divinity_code_ru.json
```

The maintained page is labelled `v23.7.0` in its title, header, menu and footer. The former `v19` label remains only in historical material. The current immutable Git restoration checkpoint remains `v3.6.0` until `v23.7.0` is merged, tagged and released.

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
- PWA manifest and isolated service-worker registration.

Release `v3.6.0` completes M5 and remains the current restoration checkpoint. Development line `v23.7.0` adds centralized version metadata, strict filters, relevance ranking, Enter submission and alias resolution. Search, runtime versioning, data, state, history, storage, localization, presentation and PWA registration now have 41 dependency-free regression tests.

Imported display values are escaped before DOM insertion, including quotes used inside `data-*` attributes. Notes are rendered as plain text with safe paragraphs and line breaks; raw HTML and Markdown from a manually selected JSON file are not interpreted.

The current root site was verified on Android through Ubuntu in UserLAnd. PWA installation, offline reload and launching the installed application without the local server or internet were confirmed during M5.

## Development news

User-visible changes are documented in `news/`. The public uNews repository automatically discovers new uDream patchnotes after they reach `main`, validates them, and publishes previously unseen entries to `@uNewsLog` through GitHub Actions.

uDream stores no Telegram credentials. The publication contract is documented in `docs/NEWS_PUBLISHING.md`.

## Data

The current data-file classification was verified on 2026-07-20:

- `data/divinity_code_ru.json` is the active translated and augmented runtime database with 4,086 records;
- `data/bd2.json` is a retained English reference dataset with 4,086 records;
- `data/db.json` is an exact byte-for-byte duplicate of `data/bd2.json`;
- `data/report.txt` is a historical generation and quality summary.

Only `data/divinity_code_ru.json` is referenced by the current application, Service Worker, validation script and state tests. The other files are not part of the current runtime.

The exact generation and translation pipeline for `data/divinity_code_ru.json` is still undocumented. No retained data file should be deleted or rewritten until that pipeline is recovered or replaced by a documented process.

## Historical material

The repository retains:

- UI iterations `002` through `019` in `_archive/legacy-versions/`;
- admin prototypes `admin1` through `admin7` in `_archive/admin-versions/`;
- old databases in `_archive/old-data/`;
- PDFs and screenshots in `_archive/source-files/`.

Historical files are deliberately preserved and are not the source of truth for the current site.

## Known risks and unfinished work

- Database provenance and transformation steps are not fully documented.
- The administration workflow is archived rather than part of the maintained runtime.
- Development line `v23.7.0` is not an immutable restoration checkpoint until its merge commit is tagged and released.
- External CDN dependencies remain for fonts, icons and image capture; note rendering no longer requires Marked.
- Accessibility has not been formally audited.
- Bundled source-PDF distribution status should be confirmed.
- Automatic uNews publication should be observed for the first uDream patchnote before treating the integration as fully proven end to end.

## Safe restoration point

Release `v3.6.0` and its tag preserve the exact verified M5 source at `02555f3b0dcc4983cdf6d9e564a1ad68e570d887`. The independently runnable fallback remains `versions/v3.0.0/`; no separate runnable `v3.6.0` snapshot was created.
