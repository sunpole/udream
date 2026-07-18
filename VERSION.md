# Version

## Current release checkpoint

`v3.0.0`

- Tag commit: `94c14db5321edea3036d896b727790db5f6aec27`
- Published: 2026-07-18
- Purpose: preserve the working GitHub Pages site before repository cleanup and documentation
- Release: https://github.com/sunpole/udream/releases/tag/v3.0.0

## Current development line

`v3.3.0-dev`

This line completes M2 of the staged native ES-module migration. Database fallback loading and manual JSON parsing now live in `src/data.js`; initial browser state restoration lives in `src/state.js`. The database format, search behavior, interface and static GitHub Pages/PWA runtime remain unchanged.

## Version systems

The repository previously used two different counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`;
- legacy UI iterations: numbered folders through `019` and an interface label `v19`.

Future public releases use semantic Git tags. Historical UI numbers remain historical references only.
