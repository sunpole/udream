# UDREAM

UDREAM is a static Christian dream-symbol reference and search tool published on GitHub Pages. It replaces manual PDF searching with a mobile-friendly interface for symbols, aliases, descriptions, notes, tags, history, and alphabet navigation.

## Live site

- Current site: https://sunpole.github.io/udream/
- Saved versions: https://sunpole.github.io/udream/versions/
- Repository: https://github.com/sunpole/udream

## Current state

- Release checkpoint: `v3.0.0`
- Legacy interface label: `v19`
- Default branch: `main`
- Runtime: static HTML, CSS, and JavaScript; no backend or build step
- Active database: `data/divinity_code_ru.json`
- Hosting: GitHub Pages
- PWA files: `manifest.json` and `sw.js`

The `v3.0.0` release preserves the working site before the documentation and repository-ordering pass. The interface label `v19` is historical and is not the Git release number.

## Repository map

```text
udream/
├── index.html                   # current public app
├── script.js                    # current app logic
├── manifest.json                # current PWA metadata
├── sw.js                        # current service worker
├── data/
│   ├── divinity_code_ru.json    # active runtime database
│   ├── bd2.json                 # retained data variant
│   ├── db.json                  # retained data variant
│   └── report.txt               # database-generation report
├── versions/
│   ├── index.html               # version launcher
│   └── v3.0.0/                  # runnable frozen checkpoint
├── _archive/                    # historical versions and source files
├── docs/                        # project documentation
├── AGENTS.md                    # rules for future development work
├── VERSION.md
├── CHANGELOG.md
└── ROADMAP.md
```

The live site must not depend on `_archive/` except for deliberate reference downloads. Old experiments are retained for history and are not current application code.

## Local preview

From the repository root:

```bash
python3 -m http.server 8019
```

Open:

```text
http://localhost:8019/
```

Directly opening `index.html` as a local file is not a reliable test because browsers restrict `fetch()` and service workers on `file://` URLs.

## Documentation

- [Current project state](docs/PROJECT_STATE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database format](docs/DATABASE_FORMAT.md)
- [File map](docs/FILE_MAP.md)
- [Release and rollback](docs/RELEASE_AND_ROLLBACK.md)
- [Recovered historical context](docs/HISTORICAL_CONTEXT.md)
- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)

## Content note

UDREAM is a reference/search tool. Interpretations should be checked against the original source material and Scripture context; the application does not establish doctrine or replace pastoral discernment.

## License

MIT. See [LICENSE](LICENSE).
