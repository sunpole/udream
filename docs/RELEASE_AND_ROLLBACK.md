# Release and rollback

## Principles

- Never move an existing release tag.
- Preserve the working commit before structural or data changes.
- Keep `main` deployable.
- Verify GitHub Pages after merge.
- A runnable snapshot complements a tag; it does not replace the exact tagged source.

## Create a release checkpoint

1. Confirm the exact `main` commit.
2. Confirm the site works at that commit.
3. Create a semantic tag and GitHub Release targeting the exact SHA.
4. Record the tag, SHA, date, purpose, and limitations in `VERSION.md` and `CHANGELOG.md`.
5. Do not retarget the tag later.

The current verified checkpoint is:

```text
v23.8.0
24dece593bea679485057d7551a2583f7f1f5acf
```

The previous checkpoint is `v23.7.0`. The independently runnable pre-cleanup fallback remains `versions/v3.0.0/`.

## Add a runnable saved version

A directory under `versions/<tag>/` should include:

- runtime HTML and JavaScript;
- active data required by that version;
- manifest, service worker, and icons when PWA behavior is retained;
- relative paths appropriate to the snapshot directory.

Path-only changes needed for subdirectory execution must be documented. Do not backport later features into a released snapshot.

No separate runnable snapshot was added for `v23.8.0`; the immutable Git tag is the exact source checkpoint.

## Validate before publication

```bash
npm test
node scripts/validate-project.mjs
jq empty data/divinity_code_ru.json
python3 -m http.server 8019
```

Check the current root and every newly added snapshot. Verify database fetches, search, icons, PDFs, manifests, service workers, browser console errors, runtime-version consistency and installed-PWA update behavior.

For `v23.8.0`, the release workflow checks the exact target SHA, runs tests and validation, verifies `package.json`, `src/version.js` and `version.json`, and creates or verifies the immutable tag before creating the GitHub Release.

## Rollback options

### Fast source rollback

Create a new branch from the stable tag and open a pull request to restore the required files. Do not force-move `main` and do not delete later history.

### Emergency GitHub Pages restoration

Restore the root runtime files from tag `v23.8.0` in a new commit, then verify Pages. This preserves a visible audit trail. If the failure is specific to the PWA update and installation flow, use the previous checkpoint `v23.7.0`. If the failure originates in the earlier modularization, the older `v3.6.0` and `v3.0.0` checkpoints remain available.

### User access during repair

Keep the runnable saved version available:

```text
https://sunpole.github.io/udream/versions/v3.0.0/
```

## Post-release record

After every release, record:

- tag and exact SHA;
- live URL checked;
- checks actually run;
- known limitations;
- rollback target;
- whether the saved-version launcher was updated.