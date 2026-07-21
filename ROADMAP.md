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

## Completed: modularization without a build step

- [x] Define and complete the staged ES-module migration plan M1–M5.
- [x] Extract search/autocomplete matching and add regression tests.
- [x] Extract data loading and initial application state.
- [x] Extract history and local settings.
- [x] Extract presentation and localization with safe imported-data rendering.
- [x] Isolate PWA registration and complete Android offline verification.

See `docs/MODULARIZATION_PLAN.md`.

## Completed: search and version UX

- [x] Replace the historical visible `v19` label with the unified `v23.7.0` application line.
- [x] Submit search through Enter, Return and mobile search actions.
- [x] Rank exact and primary symbol matches before redirect and distant matches.
- [x] Resolve Russian aliases to their owning primary cards.
- [x] Make all five search filters strict to their declared fields.
- [x] Keep search filters above the expanding autocomplete panel.
- [x] Add release-specific screenshots for the uNews publication.

## Completed: PWA update and installation v23.8.0

- [x] Activate a new Service Worker immediately through `skipWaiting()` and `clients.claim()`.
- [x] Add uncached runtime-version checks through `version.json`.
- [x] Reload once safely when the deployed version differs from the running version.
- [x] Remove only old `udream-*` caches and preserve unrelated origin caches.
- [x] Use network-first with offline fallback for HTML, JavaScript, manifest and JSON.
- [x] Add a visible install banner with system prompt and manual instructions.
- [x] Hide the install banner in the standalone PWA.
- [x] Create the immutable `v23.8.0` tag on the exact functional merge commit.
- [x] Add a GitHub Release and documented rollback path.

## Completed: unified documentation baseline v23.8.4

- [x] Add one current product-vision document.
- [x] Distinguish product mission, verified current state, next phase and later backlog.
- [x] Synchronize maintained documentation with `v23.8.0`.
- [x] Record non-destructive preservation rules for source datasets and translation variants.
- [x] Mark the M1–M5 modularization plan as completed.
- [x] Update the architecture, file map, database contract, historical context and coding-agent rules.
- [x] Define the boundary of the next project series before implementation begins.
- [x] Record the desired source/current/alternative translation model.
- [x] Document safe DeepSeek API use without exposing the key in the static application.
- [x] Add direct download links and clearer current-state information to the repository README.

## Next approved series: D1 — data provenance and multi-dataset architecture

D1 starts as research, validation design and migration planning. It must not change the active 4,086-record runtime database in its first stage.

### D1.1 — provenance recovery

- [ ] Recover the known generation and translation history of `data/divinity_code_ru.json` from Git history, reports, scripts and retained source files.
- [ ] Record what is proven, what is inferred and what remains unknown.
- [ ] Create a source/provenance record for every retained current data file.
- [ ] Reconfirm the hash equality and history of `data/bd2.json` and `data/db.json`.

### D1.2 — dataset registry and duplicate decision

- [ ] Define stable dataset identifiers, source work, language, edition/translation version and transformation metadata.
- [ ] Define how original data, translation, aliases, tags and editorial notes remain distinguishable.
- [ ] Design the target set: one canonical source dataset, one current Russian translation and up to two independent alternative Russian translations.
- [ ] Explicitly allow a smaller set when only one reliable Russian translation exists.
- [ ] Decide which exact duplicate is canonical and prepare a reversible migration before removing the redundant physical copy.
- [ ] Define retention and rollback rules so a new translation never overwrites the previous one.

### D1.3 — data-quality audit design

- [ ] Define automated checks for all 4,086 active records, duplicate IDs, empty fields, cross-references and suspicious entries.
- [ ] Classify checks that can be automatic versus checks requiring human/source review.
- [ ] Produce a report format without changing published content.

### D1.4 — two-book product architecture

- [ ] Define the intended relationship between the two source books.
- [ ] Compare separate-database switching, combined search and side-by-side comparison.
- [ ] Require visible provenance for every result in any future combined mode.
- [ ] Approve a migration plan before implementing a user-facing selector or merged index.

### D1.5 — AI-assisted translation experiment

- [ ] Design a resumable translation script that never modifies the active database in place.
- [ ] Use DeepSeek only as an optional candidate generator, not as an automatic source of truth.
- [ ] Keep the API key only in a local environment variable or GitHub encrypted secret.
- [ ] Record source hash, model, prompt version, parameters, output hash and validation report for every run.
- [ ] Create a separate candidate dataset and diff report.
- [ ] Require human review before any candidate can become a published data release.

See `docs/TRANSLATION_WORKFLOW.md`.

## Rights and provenance completion

- [ ] Archive the original source URLs, access dates and exact open-distribution statements for bundled PDFs.
- [ ] Review the retained PDF set against `docs/CONTENT_AND_RIGHTS.md` and `THIRD_PARTY_NOTICES.md`.

## Product completion after D1

- [ ] Restore or redesign the administration workflow outside the public runtime.
- [ ] Add automated browser smoke checks for JSON, asset paths, startup and key search flow.
- [ ] Review accessibility: keyboard navigation, contrast, focus, screen readers and text selection.
- [ ] Review privacy, local history and sharing behavior.
- [ ] Confirm automatic uDream publications and operational recovery in `@uNewsLog`.

## Later options

- [ ] Consider moving inline CSS from `index.html` only if it materially improves maintainability.
- [ ] Consider a build pipeline only when static-file maintenance becomes a real blocker.
- [ ] Consider additional languages only after the source and translation workflow is documented.
- [ ] Consider TypeScript only when JSDoc and `@ts-check` no longer provide sufficient protection.

The roadmap is intentionally conservative: preserve the working static site, current data and restoration points while advancing one clearly bounded series at a time.