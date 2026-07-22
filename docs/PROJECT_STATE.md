# Current project state

The current restoration checkpoint is release `v23.8.0` at commit `24dece593bea679485057d7551a2583f7f1f5acf`, published on 2026-07-20 after verification of the PWA update, cache migration, uncached version checks and installation flow. The previous checkpoint remains `v23.7.0`, while the independently runnable pre-cleanup fallback remains `v3.0.0`.

Automation update `23.8.7` adds isolated real-Chromium screenshot scenarios, read-only GitHub Actions artifacts and structural validation. It retains the unified GitHub workflow, cross-device handoff, product vision, non-destructive data rules, target translation model and safe DeepSeek-assisted workflow. It does not change application runtime, PWA behavior or database records.

## What UDREAM is

UDREAM is a public, static GitHub Pages application for searching Christian dream-symbol reference material. It has no backend, account system, database server or browser build step.

The current product mission and final direction are defined in `docs/PRODUCT_VISION.md`. Translation variants and API-assisted data preparation are governed by `docs/TRANSLATION_WORKFLOW.md`.

## GitHub-centered work status

Real GitHub facts have the highest priority: `main`, open Pull Requests, branches, commits, tags, Releases and Actions results.

`WORK_STATUS.md` is the live source for the current task, branch, actual progress, pause point and exact next action. `docs/AI_GITHUB_WORKFLOW.md` defines how another device, ChatGPT chat, Codex session or agent continues the same work without creating a competing implementation.

The cross-device baseline was established by PR #20, merge `639b2fc1309cd3e5c69236af98e14c26cc541523`, and finalized by commit `ac7dfe6b49567d29b0d994f04a3c9d315a7aaf5f`.

The unified workflow and mandatory screenshot provenance were added by PR #21, squash merge `58ebaea07ef488e0131bd9c3b5c359a191d6275e`, and finalized in `main` by commit `b7d2bcebbf57cf9d99d1503e54310a43966ff290`.

At automation baseline `23.8.7`:

- every task starts by checking GitHub facts and `WORK_STATUS.md`;
- an active task pushes its handoff before substantial implementation;
- a new chat cannot start a competing branch for the same goal;
- old chats, AI memory and unpushed notes are not sources of truth;
- connected agents perform routine GitHub work themselves when tools permit it;
- owner input is reserved for unavailable tools, physical-device checks, secrets and human judgment;
- new patchnotes require new real screenshot evidence and provenance metadata;
- real desktop/mobile screenshots can be generated from the exact commit through Playwright Chromium;
- the next approved series is D1, beginning with D1.1 provenance recovery;
- D1.1 must not modify the active 4,086-record database.

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

Release `v3.6.0` completed M5. Release `v23.7.0` added centralized version metadata, strict filters, relevance ranking, Enter submission and alias resolution. Release `v23.8.0` added the verified PWA update and installation flow and remains the current restoration checkpoint. Runtime tests, project validation, JavaScript syntax checks and version consistency are repeated by repository automation before publication.

Imported display values are escaped before DOM insertion, including quotes used inside `data-*` attributes. Notes are rendered as plain text with safe paragraphs and line breaks; raw HTML and Markdown from a manually selected JSON file are not interpreted.

The current root site and installed PWA were verified on Android during development of `v23.8.0`. The update path preserves local history, language and theme while moving clients away from stale cached versions.

## Screenshot automation

The screenshot system is isolated under `tools/screenshots/` and is not imported by the public site or PWA.

Verified implementation:

- dedicated package and lockfile;
- `@playwright/test`, `playwright` and `playwright-core` pinned to `1.61.1`;
- one Chromium worker;
- exact checkout served through a local HTTP server;
- JSON scenarios with an allowlist of actions and no arbitrary JavaScript;
- mandatory assertions before capture;
- deterministic storage clearing, blocked Service Worker registration and disabled animations;
- PNG signature, dimensions and minimum-size validation;
- per-scenario entries and a manifest containing commit, UTC time, URL, viewport, dimensions and byte size;
- read-only `.github/workflows/capture-screenshots.yml`;
- artifact upload before any image can be selected for `news/`;
- structural validation through `scripts/validate-screenshot-tooling.mjs`.

The first fully successful run used commit `34d2b13c2e0f16b597572701485df24a538609c8` and passed all four scenarios:

- homepage desktop;
- `water` ranking desktop;
- `water` ranking mobile;
- Russian alias `вода` opening the primary `water` card on mobile.

All four PNGs were visually inspected. The selected patchnote image was generated from commit `d6cb082d8d1aa1990d26a9a5f72e6e61ae56fb47` at `2026-07-22T08:22:53Z`; its provenance is stored in `tools/screenshots/v23.8.7-selected-image.json`.

The permanent workflow has only `contents: read` and never commits or pushes screenshots. A reviewed artifact enters `news/` only through an explicit branch change and Pull Request.

This UI screenshot runner blocks Service Worker registration to prevent stale caches from changing a visual result. It does not replace separate PWA installation, offline or update-migration checks.

## Download and installation

The public README provides:

- the live GitHub Pages application;
- browser/PWA installation guidance;
- direct download of the exact stable `v23.8.0` source ZIP;
- the immutable GitHub Release;
- the saved-version launcher and Telegram development news;
- a direct link to `WORK_STATUS.md` before development continues on another device;
- direct access to the screenshot artifact workflow and local Playwright instructions.

No APK is published. The user-facing application is installed directly from the browser as a PWA.

## Development news and screenshot evidence

User-visible changes are documented in `news/`. The public uNews repository automatically discovers new uDream patchnotes after they reach `main`, validates them and publishes previously unseen entries to `@uNewsLog` through GitHub Actions.

For patchnotes version `23.8.6` and newer:

- a new PNG/JPEG must be added in the same Pull Request;
- an older image cannot be reused;
- the patchnote records `image_source`, `image_target`, `image_commit` and `image_captured_at`;
- the preferred user-interface evidence is a real Chromium screenshot;
- documentation-only changes may use a real GitHub UI or exact document-render screenshot;
- the image must be reviewed before merge.

The contract and implemented tooling are documented in `docs/SCREENSHOT_AUTOMATION.md`. uDream stores no Telegram credentials. The publication contract is documented in `docs/NEWS_PUBLISHING.md`.

## Data

The current data-file classification was verified on 2026-07-20:

- `data/divinity_code_ru.json` is the active translated and augmented runtime database with 4,086 records;
- `data/bd2.json` is a retained English reference dataset with 4,086 records;
- `data/db.json` is an exact byte-for-byte duplicate of `data/bd2.json`;
- `data/report.txt` is a historical generation and quality summary.

Only `data/divinity_code_ru.json` is referenced by the current application, Service Worker, validation script and state tests. The other files are not part of the current runtime.

The intended D1 target is one canonical source dataset, one current published Russian translation and up to two independent alternative Russian translations. Exact duplicates do not count as separate variants. When only one reliable Russian translation exists, the smaller set is preferred over artificial duplication.

The exact generation and translation pipeline for `data/divinity_code_ru.json` is still undocumented. No retained data file, source edition or translation variant may be deleted or overwritten until the D1 provenance and multi-dataset architecture is designed and approved.

DeepSeek is only a possible candidate-generation tool. No API client or key is part of the current browser runtime. Any future experiment must create a separate recoverable candidate dataset and use a local environment variable or GitHub encrypted secret.

A future database selector must not be implemented until D1 defines stable dataset identities, provenance and migration. Before release it must validate the complete selected dataset, reload the application consistently, provide safe cache clearing and automatically fall back to the stable database when a selected variant fails.

## Documentation status

The maintained documentation set now covers:

- GitHub-centered multi-chat and multi-device execution;
- cross-device task start, pause, completion and continuation;
- product mission and final direction;
- verified current runtime and risks;
- architecture and file ownership;
- active data contract and retained variants;
- target translation topology and duplicate policy;
- safe AI-assisted translation workflow;
- implemented real Chromium screenshot evidence and artifacts;
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

- Database provenance and transformation steps are not fully documented.
- The canonical source file and reversible duplicate-removal plan are not yet approved.
- Alternative Russian translations do not yet exist as reviewed datasets.
- The relationship between the two source books is not yet implemented as a user-selectable data architecture.
- The administration workflow is archived rather than part of the maintained runtime.
- External CDN dependencies remain for fonts, icons and image capture; note rendering no longer requires Marked.
- Accessibility has not been formally audited.
- Bundled source-PDF URLs and exact distribution statements still require archival evidence.
- Screenshot scenarios cover selected critical flows, not every asset or accessibility behavior.
- Privacy and sharing behavior require a final documented review.

These are tracked as future work in `ROADMAP.md`; they are not hidden defects in the `v23.8.0` release.

## Next approved work

D1.1 — data provenance recovery.

D1 begins with research, inventory, validation design and migration planning. Its first stage must not change the active 4,086-record JSON database or add a user-facing database selector.

## Safe restoration point

Release `v23.8.0` and its tag preserve the exact verified functional source at `24dece593bea679485057d7551a2583f7f1f5acf`. Release `v23.7.0` remains the previous unified-version checkpoint. The independently runnable fallback remains `versions/v3.0.0/`; no separate runnable `v23.8.0` snapshot was created.
