# Version

## Current release checkpoint

`v23.7.0`

- Tag commit: `e32c7b6e9c1057a1fdbb2af68a1b1cf2947e7538`
- Published: 2026-07-20
- Purpose: establish the unified maintained-product line and preserve the verified search, alias and version UX release
- Release: https://github.com/sunpole/udream/releases/tag/v23.7.0
- Checks: 41/41 tests, project validator, JavaScript syntax, the unchanged 4,086-record database and browser verification passed
- Visual verification: two release-specific application screenshots and one GitHub Release screenshot are stored in `news/`
- Previous checkpoint: `v3.6.0`

## Current development line

No functional development version is currently assigned after `v23.7.0`.

Documentation update `23.7.1` records the published tag, exact release commit and restoration status. It does not change application code, PWA behavior or database records.

## Unified version line

Version `v23.7.0` begins the unified maintained-product line.

The repository previously used two separate counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.5.0`, `v3.6.0`;
- legacy UI iterations: numbered folders through `019` and the visible interface label `v19`.

The major number `23` deliberately separates the maintained application from both earlier counters. It is a product-version decision rather than an arithmetic sum.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers. New maintained releases continue from `v23.7.0` using semantic Git tags.
