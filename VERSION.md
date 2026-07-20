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

`v23.8.0`

- Branch: `feat/pwa-update-install-v23.8.0`
- Status: implementation and regression tests prepared; browser and installed-PWA verification are required before merge
- Scope: forced PWA update activation, uncached version checks, migration from old uDream caches and a persistent installation banner
- Banner close behavior: the small cross hides it only for the current loaded page; reloading the page shows it again
- Database: the active 4,086-record JSON database is unchanged

## Unified version line

Version `v23.7.0` begins the unified maintained-product line.

The repository previously used two separate counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.5.0`, `v3.6.0`;
- legacy UI iterations: numbered folders through `019` and the visible interface label `v19`.

The product-version decision advanced the legacy visible line from `19` to `20` and combined it with the `3.7.0` development line, producing the unified version `23.7.0`. New maintained releases continue from that unified semantic version.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers.
