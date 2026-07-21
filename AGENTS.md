# AGENTS.md — UDREAM development rules

These rules apply to the entire repository.

## Start every task with current context

Before changing files, read:

1. `docs/PRODUCT_VISION.md`
2. `README.md`
3. `VERSION.md`
4. `ROADMAP.md`
5. `docs/PROJECT_STATE.md`
6. `docs/ARCHITECTURE.md`
7. `docs/FILE_MAP.md`
8. `docs/TRANSLATION_WORKFLOW.md` for any data, translation or AI-assisted task
9. `docs/NEWS_PUBLISHING.md`
10. `docs/CONTENT_AND_RIGHTS.md`
11. the latest commits, tags and open Pull Requests relevant to the task

Do not infer the current application from numbered folders under `_archive/`.

## Sources of truth

- `docs/PRODUCT_VISION.md` defines the product mission, final direction and non-destructive data principles.
- `docs/TRANSLATION_WORKFLOW.md` defines the target translation variants, duplicate policy and safe API-assisted workflow.
- `main` is the source for the currently published GitHub Pages site.
- Git tags and GitHub Releases are immutable restoration checkpoints.
- Root `index.html`, `script.js`, `manifest.json`, `version.json`, and `sw.js` are the current runtime.
- `data/divinity_code_ru.json` is the active database until a documented migration changes it.
- `versions/<release>/` directories are runnable snapshots and must remain stable.
- `_archive/` is historical material, not current runtime code.
- `ROADMAP.md` distinguishes completed work, the next approved phase and later backlog.

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
- Do not combine a data migration, interface redesign and architecture rewrite in one patch unless an approved plan proves they cannot be separated.

## uNews publication requirement

- User-visible changes, releases, fixes, documentation milestones, and meaningful repository changes require a factual Russian patchnote in `news/`.
- Follow `docs/NEWS_PUBLISHING.md` and the canonical rules in `sunpole/uNews`.
- Use `project: uDream` and `series: udream` in YAML.
- Every patchnote requires `type`, `project`, `series`, `title`, `version`, `repo_url` or `web_url`, and an existing safe image beside the Markdown file.
- Name patchnotes `YYYY-MM-DD-udream-short-title.md` using lowercase Latin characters and hyphens.
- Real Telegram publication is performed only by the uNews GitHub Actions workflow. Do not send directly from a local machine.
- Never describe planned work as completed. Build the patchnote from the actual diff and completed checks.
- Before merge, run `node scripts/validate-project.mjs`; when practical, also run the uNews dry-run against the patchnote.
- Merging a new valid file under `news/` into public `main` makes it eligible for automatic publication to `@uNewsLog`. State that consequence and the exact text/image before merging.

## Copyright and third-party content

- The MIT license applies to original uDream software code and original project documentation only.
- Do not claim ownership of source books, excerpts, dictionary interpretations, illustrations, or PDFs created by third parties.
- Do not describe third-party content as MIT-licensed unless documented permission proves that it is.
- Keep copyright and provenance statements aligned with `docs/CONTENT_AND_RIGHTS.md` and `THIRD_PARTY_NOTICES.md`.
- Do not add, remove, republish, or replace source PDFs or substantial book-derived content without explicit approval and a rights review.

## Database safety and variant preservation

- Treat database content changes separately from interface changes.
- Preserve record IDs unless a documented migration requires otherwise.
- Validate JSON syntax, array shape, required fields, record count, and duplicate IDs before commit.
- Do not silently replace source wording or biblical references.
- Record the source and transformation method for generated or translated data.
- Never overwrite one source database, translation or editorial variant with another.
- Keep every retained data variant identifiable by source, language, version/date and transformation history.
- A new translation must be stored as a new version; the previous translation remains recoverable.
- A future merged search must retain source provenance and must not destroy separate source datasets.
- Byte-identical files are one logical dataset, not independent translations.
- Do not delete `data/bd2.json`, `data/db.json`, reports or archived data until D1 proves the canonical file, records the migration and provides a rollback.
- The target is one canonical source dataset, one current Russian translation and up to two genuinely independent alternatives; do not manufacture variants when only one reliable translation exists.

## AI-assisted translation safety

- DeepSeek or another provider may generate only a separate candidate dataset.
- Never call a paid translation API from the public browser application or installed PWA.
- Never commit an API key, place it in browser JavaScript, JSON, logs, artifacts, screenshots or patchnotes.
- Use a local environment variable or GitHub encrypted secret.
- Record source hash, model, prompt-template version, parameters, output hash and review status for every run.
- A translation script must support checkpoints and must never modify the published database in place.
- AI output requires automatic validation and human review before any data release.

## Required checks

For relevant changes, run and report:

```bash
npm test
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

- Public releases use semantic tags such as `v23.8.0`.
- The historical UI label `v19` is legacy metadata. The maintained application currently uses `v23.8.0`; old tags and archived folders keep their original numbers.
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

After a release or major documentation patch, search all maintained documents for stale current-version labels and unresolved development-branch wording.

End each completed task with the files changed, checks run, results, and remaining risks.

## Next approved planning boundary

The next recommended project series is D1: data provenance and multi-dataset architecture.

D1 begins with documentation, inventory, validation design and migration planning. It must not change the active 4,086-record database or add a user-facing database selector until the architecture is separately reviewed and approved.

## uNews / тыНовости — обязательный план публикации

Этот публичный проект подключён к автоматической очереди [uNews](https://github.com/sunpole/uNews).

После каждого завершённого пользовательского изменения ИИ или программист должен:

1. Создать русский патчноут в `news/` и реальное изображение рядом.
2. Указать в YAML: `type`, `project`, безопасный латинский `series`, `title`, следующую `version`, точное UTC-время `queued_at`, `repo_url` или `web_url`, `image`.
3. Формат времени: `queued_at: YYYY-MM-DDTHH:MM:SSZ`.
4. Описывать только фактически выполненные изменения; не включать токены, ключи, приватные данные и локальные секреты.
5. Добавлять патчноут и изображение в ту же публичную ветку, что и завершённое изменение.
6. Не публиковать в Telegram вручную и не заходить для этого в uNews: бот сам проверяет публичные репозитории, выбирает новости в строгом FIFO-порядке и за один запуск публикует до 20 записей с паузой не менее 61 секунды.
7. При ошибке исправить самый ранний патчноут проекта: более новые версии этого проекта будут ждать, а остальные проекты продолжат публиковаться. После каждого успешного Telegram-поста uNews обязан зафиксировать checkpoint; если фиксация не удалась, текущий пакет останавливается.

Репозиторий: `sunpole/udream`.
Полная спецификация: https://github.com/sunpole/uNews/blob/main/UNEWS.md