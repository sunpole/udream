# udream

Christian dream-symbol dictionary for GitHub Pages.

The project is a static browser app: no server, no login, no database engine. It loads a JSON dictionary, lets the user search symbols, aliases, descriptions, notes, and tags, and shows the result as readable cards.

## Live Site

GitHub Pages:

https://sunpole.github.io/udream/

## Current Structure

```text
udream/
├── index.html          # current public app
├── script.js           # app logic and JSON loading
├── manifest.json       # PWA metadata
├── data/
│   └── bd2.json        # current dictionary database
├── _archive/           # old experiments and source/reference files
├── .nojekyll           # disables Jekyll processing on GitHub Pages
├── LICENSE
└── README.md
```

## Database

The live database is:

```text
data/bd2.json
```

Each record uses this shape:

```json
{
  "id": 1,
  "symbol": "example",
  "aliases": [],
  "description": "...",
  "source": "DivinityCode",
  "date_added": "2026-05-24",
  "tags": [],
  "notes": "..."
}
```

The app currently auto-loads `data/bd2.json`. Older database files were moved to `_archive/old-data/`.

## Features

- Search by symbol, aliases, description, tags, or all fields.
- Autocomplete while typing.
- Tag cloud and tag filtering.
- Alphabet browsing.
- History and breadcrumbs.
- Share/export card helpers.
- Works as a static GitHub Pages site.

## Archive

Old UI experiments, admin prototypes, screenshots, PDFs, and previous database files are kept in `_archive/` so the live site root stays clean.

```text
_archive/
├── legacy-versions/    # old numbered app versions
├── admin-versions/     # old admin prototypes
├── old-data/           # previous JSON databases
└── source-files/       # PDFs and screenshots
```

These files are not required for the public app to run.

## Local Preview

From the repository folder:

```bash
python -m http.server 8019
```

Then open:

```text
http://localhost:8019/
```

## Notes

The dictionary content is intended as a reference/search tool. Interpretations should be handled carefully and checked against the original source and Scripture context.

## License

MIT. See `LICENSE`.
