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
7. `docs/NEWS_PUBLISHING.md`
8. `docs/CONTENT_AND_RIGHTS.md`
9. the latest commits and tags relevant to the task

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

## uNews publication requirement

- User-visible changes, releases, fixes, documentation milestones, and meaningful repository changes require a factual Russian patchnote in `news/`.
- Follow `docs/NEWS_PUBLISHING.md` and the canonical rules in `sunpole/uNews`.
- Use `project: uDream` and `series: udream` in YAML.
- Every patchnote requires `type`, `project`, `series`, `title`, `version`, `repo_url` or `web_url`, and an existing safe image beside the Markdown file.
- Name patchnotes `YYYY-MM-DD-udream-short-title.md` using lowercase Latin characters and hyphens.
- Real Telegram publication is performed only by the uNews GitHub Actions workflow. Do not send directly from a local machine.
- Never describe planned work as completed. Build the patchnote from the actual diff and completed checks.
- Before merge, run `node scripts/validate-project.mjs`; when practical, also run the uNews dry-run against the patchnote.
- Merging a new valid file under `news/` into public `main` makes it eligible for automatic publication to `@uNewsLog`. State that consequence before merging.

## Copyright and third-party content

- The MIT license applies to original uDream software code and original project documentation only.
- Do not claim ownership of source books, excerpts, dictionary interpretations, illustrations, or PDFs created by third parties.
- Do not describe third-party content as MIT-licensed unless documented permission proves that it is.
- Keep copyright and provenance statements aligned with `docs/CONTENT_AND_RIGHTS.md` and `THIRD_PARTY_NOTICES.md`.
- Do not add, remove, republish, or replace source PDFs or substantial book-derived content without explicit approval and a rights review.

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
node scripts/validate-project.mjs
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
- Add a matching uNews patchnote for every release-worthy change.
- Document rollback steps in `docs/RELEASE_AND_ROLLBACK.md`.
- Never move an existing release tag to a different commit.

## Documentation standard

Keep documentation factual and distinguish:

- verified current behavior;
- historical information;
- planned work;
- assumptions that still require testing.

End each completed task with the files changed, checks run, results, and remaining risks.
