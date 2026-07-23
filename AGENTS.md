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
11. `data/datasets.json` and `docs/DATASET_REGISTRY.md` for identity, canonical-path or migration work
12. `docs/DATA_QUALITY_AUDIT.md` and `reports/data-quality-audit.md` for quality or content-review work
13. `docs/TRANSLATION_WORKFLOW.md` for translation or AI-assisted work
14. `docs/NEWS_PUBLISHING.md`
15. `docs/SCREENSHOT_AUTOMATION.md`
16. `docs/CONTENT_AND_RIGHTS.md`
17. relevant current commits, branches, PRs, Issues and Actions

Do not infer the current application from numbered folders under `_archive/`.

Before implementation, state verified status, active branch, open PR, last completed change, exact next action and prohibitions. GitHub facts must agree before files change.

## Sources of truth

Priority order:

1. Real GitHub facts: `main`, open PRs, branches, commits, tags, Releases and Actions.
2. `WORK_STATUS.md`: live active-task handoff.
3. Active Issue: detailed task specification.
4. Maintained documentation and executable validators.
5. Chat memory and local unpushed notes are never sources of truth.

Current sources:

- `docs/PRODUCT_VISION.md` — product mission and non-destructive principles.
- `docs/DATA_PROVENANCE.md` — verified file evidence and unknowns.
- `data/datasets.json` — machine-readable logical/physical dataset identities.
- `docs/DATASET_REGISTRY.md` — canonical selection, retention and migration policy.
- `docs/DATA_QUALITY_AUDIT.md` — audit rules, severities and limitations.
- `reports/data-quality-audit.json` / `.md` — current deterministic audit results.
- `docs/TRANSLATION_WORKFLOW.md` — translation and AI-assisted workflow.
- Root runtime files and `data/divinity_code_ru.json` — current published application.
- Git tags/Releases — immutable restoration checkpoints.
- `ROADMAP.md` — completed, next and later work.

If maintained documents disagree with executable code or GitHub facts, report and correct the conflict in the approved task.

## Current registered datasets

```text
source-divinity-code-en
  source-divinity-code-en-bd2 -> data/bd2.json
  source-divinity-code-en-db  -> data/db.json

ru-current-v1
  ru-current-v1-runtime       -> data/divinity_code_ru.json
```

`data/bd2.json` is the canonical maintained serialization by project-governance decision. This does not prove historical originality. `data/db.json` remains retained equivalent compatibility data.

```text
physical migration: planned-not-executed
remove_or_rename_approved: false
```

## Current quality baseline

D1.3 baseline `23.8.10` verifies:

- both logical datasets contain 4,086 unique ordered IDs;
- source/current IDs align;
- preserved fields have zero differences;
- structural errors: 0;
- warnings: 0;
- review instances: 5,022 in five aggregated groups.

Review instances are heuristic candidates, can overlap and are not proven errors. Never auto-fix them in an audit or documentation PR.

## Change discipline

- One task, one primary goal, one active branch and one PR.
- Use a dedicated branch for structural, data, PWA, automation or multi-file work.
- Preserve working code before risky work with an immutable checkpoint.
- Never delete or rewrite `_archive/`, source PDFs, screenshots, data variants, tags or releases as routine cleanup.
- Do not edit released snapshots except for separately documented security/path repairs.
- Keep the project static unless a backend/build system is explicitly approved.
- Never store secrets, access tokens, personal contact data or credentials.
- Separate data migration, content correction, UI work and architecture design.

## AI execution preference

When connected tools permit safe execution, perform GitHub work directly rather than sending routine commands to the owner.

The agent should independently:

- inspect GitHub facts and documentation;
- create/update the dedicated branch;
- update and push `WORK_STATUS.md` before substantial work;
- edit, commit, open PRs and inspect CI;
- prepare factual patchnotes and real evidence images;
- correct failures and complete the handoff.

Ask the owner only for unavailable physical-device checks, secure secret provisioning, content/translation judgment or unsupported actions. Never ask for an API key in chat.

## Cross-device handoff

- Set `WORK_STATUS.md` to `IN_PROGRESS` before implementation.
- Record start time, environment, branch, one goal, planned files and completion criteria.
- Push the handoff before substantial implementation.
- Update it after each saved stage that changes completed work, last commit, next action, blockers or prohibitions.
- Use `PAUSED` or `BLOCKED` before stopping unfinished work.
- Local notes and chat messages are not valid handoffs.
- After merge, return `main/WORK_STATUS.md` to `READY` and name the next approved task.
- Do not create a competing branch for the same goal.

## Real screenshot requirement

- Every new uNews patchnote must add a new real PNG/JPEG in the same PR.
- Never reuse an earlier patchnote image.
- UI changes should use the exact branch/commit in real Chromium when possible.
- Documentation/audit milestones may use an exact GitHub document/report page.
- Patchnotes require `image_source`, `image_target`, `image_commit` and `image_captured_at`.
- Validate that the image proves the claim and contains no secrets/private data.
- Permanent capture workflows remain read-only; one-time writable workflows must remove themselves after committing the approved image.

## uNews publication

- Meaningful changes require a factual Russian patchnote under `news/`.
- Use `project: uDream`, `series: udream`, next version and exact UTC `queued_at`.
- Describe only completed diff and checks.
- Never publish Telegram manually; uNews handles FIFO publication.
- Before merge, state the exact patchnote image and short Telegram text.
- Run project/specialized validators and patchnote-diff validation.

## Database safety

- Treat database content changes separately from UI/documentation changes.
- Preserve IDs unless an approved migration says otherwise.
- Never overwrite one source, translation or editorial variant with another.
- Every variant needs stable logical/physical IDs, source, language, version/date, hashes and transformation history.
- Raw-distinct files with identical canonical JSON are one logical dataset, not separate translations.
- Do not delete/rename `data/bd2.json`, `data/db.json`, reports or archives while migration is `planned-not-executed`.
- A future selector must validate datasets, reload consistently, clear only safe cache scope and fall back automatically.

A future physical migration must:

- use a separate branch/PR;
- create an immutable checkpoint first;
- preserve raw/canonical hashes;
- prove all references;
- include exact rollback;
- keep current runtime unchanged unless a separate functional release changes it.

## Audit safety

- `scripts/audit-data-quality.mjs` is read-only with respect to data.
- `reports/data-quality-audit.json` and `.md` must be deterministic and current.
- `error` findings fail the structural gate.
- `warning` and `review` findings require human/source evaluation and are not auto-fixes.
- Do not correct audit findings in the same PR that defines or runs the audit.
- Content correction requires exact evidence, a separate data PR, updated identity/version when needed, rollback and human review.

## AI-assisted translation safety

- DeepSeek or another provider may create only a separate candidate dataset.
- Never call paid translation APIs from the public site/PWA.
- Never commit an API key or expose it in code, JSON, logs, artifacts, screenshots or patchnotes.
- Use a local environment variable or GitHub encrypted secret.
- Record source ID/hash, candidate ID, model, prompt version, parameters, output hash and review status.
- Scripts must be resumable and must not modify the published dataset in place.
- AI output requires automatic validation and human review before any data release.

## Required checks

For relevant work:

```bash
npm test
jq empty data/divinity_code_ru.json
jq 'length' data/divinity_code_ru.json
node scripts/validate-data-provenance.mjs
node scripts/validate-dataset-registry.mjs
node scripts/audit-data-quality.mjs --check
node scripts/validate-project.mjs
```

For screenshot/UI work also use the isolated Playwright tooling and inspect artifacts visually.

Do not claim browser, PWA, offline, mobile or screenshot verification unless actually performed.

## Versioning

- Functional release remains `v23.8.0` until application behavior changes through a release.
- Documentation/provenance/registry/audit baselines may advance without changing runtime version.
- Update `VERSION.md`, `CHANGELOG.md`, `ROADMAP.md`, relevant docs and uNews patchnote together.
- Never move an existing release tag.

## Documentation standard

Clearly distinguish:

- verified current behavior;
- historical information;
- planned work;
- governance decisions;
- heuristic audit findings;
- assumptions and unknowns.

End every completed task with changed files, checks, results, risks and updated handoff.

## Next approved planning boundary

D1.1 provenance, D1.2 registry and D1.3 data-quality audit are complete at baseline `23.8.10`.

Next: **D1.4 two-book product architecture**. It is architecture-only unless a separate functional implementation phase is approved. It must define source identity, provenance display, switching/combined/side-by-side options, history/deep-link behavior, validation, cache handling and stable fallback.

D1.5 AI-assisted translation must not begin before D1.4 is completed and recorded.

## uNews / тыНовости

Этот публичный проект подключён к автоматической очереди [uNews](https://github.com/sunpole/uNews).

После завершённого изменения:

1. создать русский патчноут и новое реальное изображение;
2. заполнить обязательный YAML и screenshot provenance;
3. использовать точное UTC-время;
4. не включать секреты и приватные данные;
5. добавить материалы в ту же публичную ветку;
6. не публиковать Telegram вручную;
7. при ошибке исправлять самый ранний неопубликованный патчноут.

Репозиторий: `sunpole/udream`.
Полная спецификация: https://github.com/sunpole/uNews/blob/main/UNEWS.md
