# Version

## Current release checkpoint

`v3.5.0`

- Tag commit: `b0ff02d4248f5dcf56137377f510c12c316e4b85`
- Published: 2026-07-19
- Purpose: preserve the verified working state after M1–M4 of the native ES-module migration
- Release: https://github.com/sunpole/udream/releases/tag/v3.5.0
- Checks: 34/34 tests, project validator, JavaScript syntax, the 4,086-record database and local Android browser verification passed
- Known limitation: PWA installation and deliberate offline reload remain for M5
- Previous checkpoint: `v3.0.0`

## Current development line

`v3.6.0-dev`

M5 implementation is complete on the development branch: service-worker registration is isolated in `src/pwa.js`, 37 tests pass, and PWA installation plus offline launch were verified on Android without the local server or internet. Publication through Pull Request and release `v3.6.0` remain.

## Version systems

The repository previously used two different counters:

- Git releases: `v1.0.0`, `v2.0.0`, `v3.0.0`, `v3.5.0`;
- legacy UI iterations: numbered folders through `019` and an interface label `v19`.

Future public releases use semantic Git tags. Historical UI numbers remain historical references only.
