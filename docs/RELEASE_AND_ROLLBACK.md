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

The pre-cleanup checkpoint is:

```text
v3.0.0
94c14db5321edea3036d896b727790db5f6aec27
```

## Add a runnable saved version

A directory under `versions/<tag>/` should include:

- runtime HTML and JavaScript;
- active data required by that version;
- manifest, service worker, and icons when PWA behavior is retained;
- relative paths appropriate to the snapshot directory.

Path-only changes needed for subdirectory execution must be documented. Do not backport later features into a released snapshot.

## Validate before publication

```bash
jq empty data/divinity_code_ru.json
python3 -m http.server 8019
```

Check the current root and every newly added snapshot. Verify database fetches, search, icons, PDFs, manifests, service workers, and browser console errors.

## Rollback options

### Fast source rollback

Create a new branch from the stable tag and open a pull request to restore the required files. Do not force-move `main` and do not delete later history.

### Emergency GitHub Pages restoration

Restore the root runtime files from tag `v3.0.0` in a new commit, then verify Pages. This preserves a visible audit trail.

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
