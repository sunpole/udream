# uDream Playwright screenshot tools

This directory is an isolated development and CI tool. It is not imported by the public website, PWA, `script.js`, `src/` or `sw.js`.

## Purpose

The tool opens the exact repository checkout in real Chromium, validates the expected visible state and only then writes PNG screenshots and a machine-readable manifest.

The default scenarios cover:

- desktop homepage startup;
- desktop `water` autocomplete ranking;
- mobile `water` autocomplete ranking;
- mobile Russian alias `вода` opening the primary Water card.

## Requirements

- Node.js 22 or newer;
- Python 3 for the local static HTTP server;
- Playwright Chromium and its operating-system dependencies.

Install dependencies from this directory:

```bash
npm ci
npx playwright install --with-deps chromium
```

Run all scenarios:

```bash
npm run capture
```

Run selected scenarios:

```bash
SCREENSHOT_SCENARIOS=search-water-mobile,russian-alias-mobile npm run capture
```

Use an already running site:

```bash
UDREAM_BASE_URL=http://127.0.0.1:8019/ npm run capture
```

By default, Playwright starts the repository root through:

```bash
python3 -m http.server 8019 --bind 127.0.0.1
```

## Output

Generated files are stored outside this package:

```text
artifacts/screenshots/
├── images/*.png
├── manifest.json
├── playwright-results.json
└── test-results/
```

The manifest records:

- exact Git commit;
- Playwright version;
- scenario ID and title;
- page URL;
- UTC capture time;
- requested viewport;
- actual PNG dimensions and byte size;
- output file path.

`artifacts/` and local browser dependencies are ignored by Git.

## Scenario format

Each file under `scenarios/` is one JSON object:

```json
{
  "id": "example-mobile",
  "title": "Example mobile capture",
  "path": "/",
  "viewport": {
    "width": 390,
    "height": 844
  },
  "actions": [
    {
      "type": "fill",
      "selector": "#searchInput",
      "value": "water"
    },
    {
      "type": "assertVisible",
      "selector": ".autocomplete-list.show"
    }
  ],
  "screenshot": {
    "fullPage": false
  }
}
```

Supported actions are deliberately limited:

- `waitFor`;
- `fill`;
- `press`;
- `click`;
- `clickIfVisible`;
- `scrollIntoView`;
- `waitForTimeout` up to 2 seconds;
- `assertVisible`;
- `assertText`;
- `assertFirstText`;
- `assertCountAtLeast`.

Arbitrary JavaScript from scenario JSON is not executed. Every scenario must contain at least one assertion before capture.

## Deterministic behavior

The runner:

- uses one worker;
- uses a fresh browser context;
- clears local and session storage before page code runs;
- blocks Service Worker registration to avoid stale caches;
- uses light mode and Russian locale;
- disables animations and transitions;
- waits for page fonts and two animation frames;
- closes the install banner when it is visible;
- validates PNG signature, dimensions and minimum file size.

This captures the website UI, not the PWA update lifecycle. Service Worker, installed-PWA and offline migration checks remain separate tests.

## GitHub Actions

`.github/workflows/capture-screenshots.yml` installs the pinned dependencies, installs Chromium through the official Playwright command, runs all requested scenarios and uploads `artifacts/screenshots/` as an artifact.

The workflow has read-only repository permissions. It never commits a screenshot automatically. A reviewed artifact may later be copied into `news/` through a separate, explicit branch change.

## Adding a patchnote image

1. Generate the artifact from the exact branch commit.
2. Inspect the PNG and `manifest.json`.
3. Add the selected PNG to `news/` in the same Pull Request as the patchnote.
4. Fill `image_source: playwright`, `image_target`, `image_commit` and `image_captured_at` from the manifest.
5. Run repository and patchnote validation.

See `docs/SCREENSHOT_AUTOMATION.md` and `docs/NEWS_PUBLISHING.md`.
