# Version

## Current release checkpoint

`v3.6.0`

- Tag commit: `02555f3b0dcc4983cdf6d9e564a1ad68e570d887`
- Published: 2026-07-20
- Purpose: preserve the verified working state after M1–M5 of the native ES-module migration
- Release: https://github.com/sunpole/udream/releases/tag/v3.6.0
- Checks: 37/37 tests, project validator, JavaScript syntax, the 4,086-record database, PWA installation and offline launch verification passed
- Previous checkpoint: `v3.5.0`

## Current development line

`v23.7.0`

- Branch: `feat/search-ux-v23.7.0`
- Status: verified release candidate; it becomes a restoration checkpoint only after merge, tag and GitHub Release
- Scope: unified visible version, Enter submission, strict field filters, relevance ranking, Russian-alias resolution and stable search-filter layout
- Checks: 41/41 tests, project validator, JavaScript syntax and the unchanged 4,086-record database passed
- Visual verification: two release-specific screenshots are stored beside the patchnote in `news/`

## Unified version line

Version `v23.7.0` intentionally begins the unified maintained-product line.

The repository previously used two separate counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.5.0`, `v3.6.0`;
- legacy UI iterations: numbered folders through `019` and the visible interface label `v19`.

The major number `23` deliberately separates the maintained application from both earlier counters. It is a product-version decision rather than an arithmetic sum.

Historical tags, releases, archived folders and runnable snapshots keep their original numbers. New maintained releases continue from `v23.7.0` using semantic Git tags.
