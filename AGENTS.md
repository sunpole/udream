# AGENTS.md — UDREAM development rules

These rules apply to the entire repository.

## Start every task with current context

Before changing files, read:

1. `WORK_STATUS.md`
2. `docs/AI_GITHUB_WORKFLOW.md`
3. `docs/PRODUCT_VISION.md`
4. `README.md`
5. `VERSION.md`
6. `ROADMAP.md`
7. `docs/PROJECT_STATE.md`
8. `docs/ARCHITECTURE.md`
9. `docs/FILE_MAP.md`
10. `docs/DATA_PROVENANCE.md` for any data task
11. `data/datasets.json` and `docs/DATASET_REGISTRY.md` for dataset identity, canonical-path or migration work
12. `docs/TRANSLATION_WORKFLOW.md` for any translation or AI-assisted task
13. `docs/NEWS_PUBLISHING.md`
14. `docs/SCREENSHOT_AUTOMATION.md`
15. `docs/CONTENT_AND_RIGHTS.md`
16. the latest commits, tags, branches, open Pull Requests and Issues relevant to the task

Do not infer the current application from numbered folders under `_archive/`.

Before implementation, state the verified current status, active branch, open PR, last completed change, exact next action and current prohibitions. Do not change files until these facts agree with GitHub.

## Sources of truth

- Real GitHub facts — `main`, open Pull Requests, branches, commits, tags, Releases and Actions results — have the highest priority.
- `WORK_STATUS.md` is the live cross-device handoff: active task, branch, actual progress, pause point and exact next action.
- `docs/AI_GITHUB_WORKFLOW.md` defines how devices, chats and agents cooperate without conflicting branches.
- An active GitHub Issue stores the detailed task specification; it does not replace live handoff state.
- `docs/PRODUCT_VISION.md` defines the product mission, final direction and non-destructive data principles.
- `docs/DATA_PROVENANCE.md` defines verified current file evidence, Git history, inferences and unknowns.
- `data/datasets.json` is the machine-readable source for current logical dataset IDs, physical file IDs, roles, hashes and policies.
- `docs/DATASET_REGISTRY.md` defines the approved canonical selection, retained compatibility serialization and future rollback design.
- `docs/TRANSLATION_WORKFLOW.md` defines target translation variants and safe API-assisted workflow.
- `main` is the source for the currently published GitHub Pages site.
- Git tags and GitHub Releases are immutable restoration checkpoints.
- Root `index.html`, `script.js`, `manifest.json`, `version.json`, and `sw.js` are the current runtime.
- `data/divinity_code_ru.json` / `ru-current-v1` is the active database until a documented functional migration changes it.
- `versions/<release>/` directories are runnable snapshots and must remain stable.
- `_archive/` is historical material, not current runtime code.
- `ROADMAP.md` distinguishes completed work, the next approved phase and later backlog.
- Old chat messages, AI memory and unpushed local notes are never sources of truth.

If documents disagree with executable code or GitHub facts, report the conflict before editing and update the documents as part of the approved task.

## Current registered datasets

Logical dataset IDs:

```text
source-divinity-code-en
ru-current-v1
```

Physical file IDs:

```text
source-divinity-code-en-bd2  -> data/bd2.json
source-divinity-code-en-db   -> data/db.json
ru-current-v1-runtime        -> data/divinity_code_ru.json
```

D1.2 selects `data/bd2.json` as the canonical maintained physical serialization through a project-governance decision. This does not prove that it is the historical original or authoritative external edition.

`data/db.json` remains a retained equivalent compatibility serialization. Physical migration status is `planned-not-executed`; deletion, rename or runtime switching is not approved.

## Change discipline

- One task should have one primary goal.
- Use a dedicated branch for structural, data, PWA, automation or multi-file changes.
- Preserve the working site before risky work with a tag/release.
- Do not delete or rewrite `_archive/`, source PDFs, screenshots, data variants, tags or releases without explicit approval.
- Do not edit a released snapshot except for a separately documented path/security repair.
- Keep the project static unless a backend or build system is explicitly approved.
- Prefer relative URLs inside version snapshots so each snapshot remains independently runnable.
- Never place secrets, access tokens, private contact data or credentials in the repository.
- Do not combine a data migration, interface redesign and architecture rewrite in one patch unless an approved plan proves they cannot be separated.

## AI execution preference

When connected tools permit safe execution, the agent should perform the GitHub work itself rather than send routine commands to the owner.

The agent should independently:

- inspect repository facts and documentation;
- create and update the dedicated branch;
- update `WORK_STATUS.md` before implementation;
- edit files, create commits and open Pull Requests;
- run or inspect available validation and GitHub Actions;
- prepare patchnotes and real screenshot evidence;
- correct failures and complete the handoff.

Ask the owner only for decisions requiring human judgment, access to an unavailable physical device, secure secret provisioning, translation/content review or an action unavailable to connected tools. Never ask the owner to paste an API key into chat.

## Cross-device handoff discipline

- Before implementation, update `WORK_STATUS.md` with status `IN_PROGRESS`, start time, environment, branch, one goal, planned files and completion criteria.
- Push the handoff before substantial implementation so another chat can see the lock.
- At meaningful checkpoints, record what is actually complete, the last verified commit and the exact next action.
- After every substantial saved stage that changes completed work, the last verified commit, the exact next action, blockers or prohibitions, update and push `WORK_STATUS.md` before continuing.
- Before switching devices or stopping unfinished work, set status to `PAUSED` or `BLOCKED`, commit the handoff and push it to GitHub.
- A local note, chat message or unpushed commit is not a valid handoff.
- When finishing, record planned versus actual work, changed files, checks, PR/merge, risks and the next approved task.
- After merge, return the file to `READY` and record the latest completed PR/commit.
- Do not start unrelated work while `WORK_STATUS.md` describes an unresolved `IN_PROGRESS`, `PAUSED` or `BLOCKED` task unless the owner explicitly closes or supersedes it.
- If `WORK_STATUS.md` conflicts with open PRs or commits, GitHub facts win and the file must be corrected immediately.
- Do not create a competing branch for the same goal from another chat.

## Real screenshot requirement

- Every new uNews patchnote must add a new real PNG/JPEG in the same Pull Request.
- Never reuse an existing image from an earlier patchnote.
- User-visible changes should be captured from the exact branch/commit in a real browser, preferably the implemented Playwright Chromium workflow.
- Documentation-only changes may use a real GitHub UI or exact document-render screenshot.
- AI-generated artwork is not proof of a real code, UI, release or documentation change.
- New patchnotes must include `image_source`, `image_target`, `image_commit` and `image_captured_at`.
- Validate that the screenshot visibly proves the claim before merge.
- Never expose secrets, cookies, private data or local home paths in screenshots.
- Follow `docs/SCREENSHOT_AUTOMATION.md` and `tools/screenshots/README.md`.

For Playwright evidence:

- use `.github/workflows/capture-screenshots.yml` or the isolated local package;
- inspect the uploaded artifact and `manifest.json`;
- visually inspect the selected PNG;
- copy only an approved PNG into `news/` through an explicit branch change;
- take `image_commit` and `image_captured_at` from matching provenance;
- never make the permanent capture workflow writable.

## uNews publication requirement

- User-visible changes, releases, fixes, documentation milestones and meaningful repository changes require a factual Russian patchnote in `news/`.
- Follow `docs/NEWS_PUBLISHING.md` and the canonical rules in `sunpole/uNews`.
- Use `project: uDream` and `series: udream` in YAML.
- Every patchnote requires `type`, `project`, `series`, `title`, next `version`, exact UTC `queued_at`, `repo_url` or `web_url`, `image` and required screenshot provenance fields.
- Name patchnotes `YYYY-MM-DD-udream-short-title.md` using lowercase Latin characters and hyphens.
- Real Telegram publication is performed only by the uNews GitHub Actions workflow. Do not send directly from a local machine.
- Never describe planned work as completed. Build the patchnote from the actual diff and completed checks.
- Before merge, run `node scripts/validate-project.mjs`, all specialized validators and, when practical, the uNews dry-run.
- Merging a new valid file under `news/` into public `main` makes it eligible for automatic publication to `@uNewsLog`. State the exact text and image before merging.

## Copyright and third-party content

- The MIT license applies to original uDream software code and original project documentation only.
- Do not claim ownership of source books, excerpts, dictionary interpretations, illustrations or PDFs created by third parties.
- Do not describe third-party content as MIT-licensed unless documented permission proves that it is.
- Keep copyright and provenance statements aligned with `docs/CONTENT_AND_RIGHTS.md` and `THIRD_PARTY_NOTICES.md`.
- Do not add, remove, republish or replace source PDFs or substantial book-derived content without explicit approval and a rights review.

## Database safety and variant preservation

- Treat database content changes separately from interface changes.
- Preserve record IDs unless a documented migration requires otherwise.
- Validate JSON syntax, array shape, required fields, record count and duplicate IDs before commit.
- Do not silently replace source wording or biblical references.
- Record source and transformation method for generated or translated data.
- Never overwrite one source database, translation or editorial variant with another.
- Keep every retained data variant identifiable by logical dataset ID, physical file ID, source, language, version/date and transformation history.
- A new translation must receive a new dataset ID and file; the previous translation remains recoverable.
- A future merged search must retain source provenance and must not destroy separate source datasets.
- Raw-distinct files with identical canonical JSON are one logical dataset, not independent translations.
- Do not delete or rename `data/bd2.json`, `data/db.json`, reports or archived data while migration status is `planned-not-executed`.
- The target is one canonical source dataset, one current Russian/localized dataset and up to two genuinely independent alternatives; do not manufacture variants when only one reliable translation exists.
- A future selector must validate the complete target dataset, reload consistently, support safe cache clearing and automatically fall back to the stable dataset on failure.

Any future physical migration must:

- use a separate branch and PR;
- create an immutable restoration checkpoint first;
- preserve old raw and canonical hashes in documentation;
- prove runtime/tooling references;
- include exact rollback steps;
- keep the active runtime unchanged unless a separate functional release explicitly changes it.

## AI-assisted translation safety

- DeepSeek or another provider may generate only a separate candidate dataset.
- Never call a paid translation API from the public browser application or installed PWA.
- Never commit an API key or place it in browser JavaScript, JSON, logs, artifacts, screenshots or patchnotes.
- Use a local environment variable or GitHub encrypted secret.
- Record source dataset ID/hash, candidate dataset ID, model, prompt-template version, parameters, output hash and review status for every run.
- A translation script must support checkpoints and must never modify the published database in place.
- AI output requires automatic validation and human review before any data release.

## Required checks

For relevant changes, run and report:

```bash
npm test
jq empty data/divinity_code_ru.json
jq 'length' data/divinity_code_ru.json
node scripts/validate-data-provenance.mjs
node scripts/validate-dataset-registry.mjs
node scripts/validate-project.mjs
python3 -m http.server 8019
```

For screenshot-tooling or user-visible UI changes also verify:

```bash
node scripts/validate-screenshot-tooling.mjs
cd tools/screenshots
npm ci
npx playwright install --with-deps chromium
npm run capture
```

Then verify:

- current root page loads;
- active database loads without manual upload;
- search returns a result;
- saved-version launcher opens;
- saved snapshot loads its own database;
- manifest, icons, service worker, PDFs and external assets do not return 404;
- mobile layout remains usable;
- screenshot artifact contains expected scenarios and manifest when applicable;
- no unrelated files changed.

Do not claim a browser, PWA, offline, mobile or screenshot check was completed unless it was actually performed.

## Versioning and releases

- Public releases use semantic tags such as `v23.8.0`.
- The historical UI label `v19` is legacy metadata. The maintained application currently uses `v23.8.0`.
- Documentation/provenance/registry baselines may advance without changing the functional application version.
- Update `VERSION.md` and `CHANGELOG.md` for release-worthy or baseline changes.
- Add a matching uNews patchnote for every meaningful change.
- Document rollback steps in `docs/RELEASE_AND_ROLLBACK.md` or the task-specific migration document.
- Never move an existing release tag to a different commit.

## Documentation standard

Keep documentation factual and distinguish:

- verified current behavior;
- historical information;
- planned work;
- governance decisions;
- assumptions that still require testing.

After a release or major documentation patch, search maintained documents for stale current-version labels, old SHAs and unresolved development-branch wording.

End each completed task with files changed, checks run, results, remaining risks and an updated `WORK_STATUS.md` handoff.

## Next approved planning boundary

D1.1 provenance and D1.2 dataset registry are complete at documentation/data baseline `23.8.9`.

The next approved task is D1.3: design and run a non-destructive data-quality audit for all 4,086 records. It may report issues but must not silently rewrite source or localized content.

D1.4 two-book product architecture and D1.5 AI-assisted translation experiment must not begin before D1.3 is completed and recorded.

## uNews / тыНовости — обязательный план публикации

Этот публичный проект подключён к автоматической очереди [uNews](https://github.com/sunpole/uNews).

После каждого завершённого пользовательского изменения ИИ или программист должен:

1. Создать русский патчноут в `news/` и новое реальное изображение рядом.
2. Указать в YAML: `type`, `project`, безопасный латинский `series`, `title`, следующую `version`, точное UTC-время `queued_at`, `repo_url` или `web_url`, `image`, а также screenshot provenance.
3. Формат времени: `queued_at: YYYY-MM-DDTHH:MM:SSZ`.
4. Описывать только фактически выполненные изменения; не включать токены, ключи, приватные данные и локальные секреты.
5. Добавлять патчноут и изображение в ту же публичную ветку, что и завершённое изменение.
6. Не публиковать в Telegram вручную: uNews сам проверяет публичные репозитории, выбирает новости в FIFO-порядке и публикует с паузой не менее 61 секунды.
7. При ошибке исправить самый ранний патчноут проекта; после каждого успешного Telegram-поста uNews обязан зафиксировать checkpoint.

Репозиторий: `sunpole/udream`.
Полная спецификация: https://github.com/sunpole/uNews/blob/main/UNEWS.md
