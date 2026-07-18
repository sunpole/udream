# AGENTS.md — UDREAM development rules

These rules apply to the entire repository.

## Start every task with current context

Before changing files, read:

1. `README.md`
2. `VERSION.md`
3. `ROADMAP.md`
4. `docs/PROJECT_STATE.md`
5. `docs/ARCHITECTURE.md`
6. `docs/FILE_MAP.md`
7. the latest commits and tags relevant to the task

Do not infer the current application from numbered folders under `_archive/`.

## Sources of truth

- `main` is the source for the currently published GitHub Pages site.
- Git tags and GitHub Releases are immutable restoration checkpoints.
- Root `index.html`, `script.js`, `manifest.json`, and `sw.js` are the current runtime.
- `data/divinity_code_ru.json` is the active database until a documented migration changes it.
- `versions/<release>/` directories are runnable snapshots and must remain stable.
- `_archive/` is historical material, not current runtime code.

If documents disagree with executable code, report the conflict before editing and update the documents as part of the approved task.

## Change discipline

- One task should have one primary goal.
- Use a dedicated branch for structural, data, PWA, or multi-file changes.
- Preserve the working site before risky work with a tag/release.
- Do not delete or rewrite `_archive/`, source PDFs, screenshots, data variants, tags, or releases without explicit approval.
- Do not edit a released snapshot except for a separately documented path/security repair.
- Keep the project static unless a backend or build system is explicitly approved.
- Prefer relative URLs inside version snapshots so each snapshot remains independently runnable.
- Never place secrets, access tokens, private contact data, or credentials in the repository.

## Database safety

- Treat database content changes separately from interface changes.
- Preserve record IDs unless a documented migration requires otherwise.
- Validate JSON syntax, array shape, required fields, record count, and duplicate IDs before commit.
- Do not silently replace source wording or biblical references.
- Record the source and transformation method for generated or translated data.

## Required checks

For relevant changes, run and report:

```bash
jq empty data/divinity_code_ru.json
jq 'length' data/divinity_code_ru.json
python3 -m http.server 8019
```

Then verify:

- current root page loads;
- active database loads without manual upload;
- search returns a result;
- saved-version launcher opens;
- saved snapshot loads its own database;
- manifest, icons, service worker, PDFs, and external assets do not return 404;
- mobile layout remains usable;
- no unrelated files changed.

Do not claim a browser, PWA, offline, or mobile check was completed unless it was actually performed.

## Versioning and releases

- Public releases use semantic tags such as `v3.0.0`.
- The historical UI label `v19` is legacy metadata, not the Git release sequence.
- Update `VERSION.md` and `CHANGELOG.md` for release-worthy changes.
- Document rollback steps in `docs/RELEASE_AND_ROLLBACK.md`.
- Never move an existing release tag to a different commit.

## Documentation standard

Keep documentation factual and distinguish:

- verified current behavior;
- historical information;
- planned work;
- assumptions that still require testing.

End each completed task with the files changed, checks run, results, and remaining risks.
