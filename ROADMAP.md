# Roadmap

## Completed foundation

- [x] Publish the static site on GitHub Pages.
- [x] Provide search, aliases, tags, alphabet navigation, history, themes, and RU/EN interface text.
- [x] Add PWA metadata and a service worker.
- [x] Preserve historical app and admin iterations under `_archive/`.
- [x] Create the `v3.0.0` restoration checkpoint.
- [x] Establish project documentation and development rules.
- [x] Add a launcher for runnable saved versions.
- [x] Perform a mobile regression check of the current site and saved version launcher.
- [x] Add uNews patchnote rules and GitHub Actions validation.
- [x] Separate the MIT-licensed software from third-party content in public documentation.

## Active: modularization without a build step

- [x] Define the staged ES-module migration plan.
- [x] M1: extract pure search/autocomplete matching and add regression tests.
- [x] M2: extract data loading and initial application state.
- [x] M3: extract history and local settings.
- [x] M4: extract presentation and localization with safe imported-data rendering.
- [ ] M5: isolate PWA registration and complete Android offline verification.

See `docs/MODULARIZATION_PLAN.md`.

## Next: verification and consistency

- [ ] Test PWA installation and offline reload on Android.
- [ ] Decide which of `bd2.json`, `db.json`, and `divinity_code_ru.json` are authoritative, derived, or archival.
- [ ] Document the database generation/translation pipeline.
- [ ] Validate all 4,086 active records, duplicate IDs, cross-references, and suspicious entries.
- [ ] Archive the original source URLs and exact open-distribution statements for bundled PDFs.
- [ ] Confirm the first automatic uDream publication appears correctly in `@uNewsLog`.

## Product completion

- [ ] Define the intended relationship between the two source books.
- [ ] Decide whether users switch databases or search a merged database.
- [ ] Restore or redesign the administration workflow outside the public runtime.
- [ ] Add automated smoke checks for JSON, asset paths, and page startup.
- [ ] Review accessibility: keyboard navigation, contrast, focus, screen readers, and text selection.
- [ ] Review privacy and sharing behavior.

## Later options

- [ ] Consider moving inline CSS from `index.html` only if it materially improves maintainability.
- [ ] Consider a build pipeline only when static-file maintenance becomes a real blocker.
- [ ] Consider additional languages only after the source and translation workflow is documented.

The roadmap is intentionally conservative: preserve the working static site and avoid introducing a framework or backend without a demonstrated need.
