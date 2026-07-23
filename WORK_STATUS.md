# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит живую текущую задачу и точный следующий шаг.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **READY** — незавершённой активной задачи нет |
| Рабочая ветка | `main` |
| Открытый Pull Request | нет |
| Стабильный функциональный релиз | `v23.8.0` |
| Документационный/data baseline | `23.8.10` — D1.3 data-quality audit завершён |
| Последнее завершённое изменение | PR #29, squash merge `d4c100c8f3430bdfe57d294f3c81217efb5a4186` |
| Закрытая задача | Issue #28 — D1.3 completed |
| Следующая утверждённая задача | D1.4 — two-book product architecture |

## Завершённый этап D1.3

- создан permanent read-only `scripts/audit-data-quality.mjs`;
- созданы deterministic reports `reports/data-quality-audit.json` и `reports/data-quality-audit.md`;
- GitHub Actions проверяет report freshness и structural gate;
- проверены logical datasets `source-divinity-code-en` и `ru-current-v1`;
- подтверждены 4 086 unique ordered IDs `1–4086` в каждом наборе;
- source/current IDs полностью aligned;
- preserved fields `id`, `symbol`, `description`, `source`, `date_added` имеют 0 differences;
- expected changed fields: aliases 4 083, notes 4 086, tags 4 086;
- structural gate: PASS;
- structural errors: 0;
- warnings: 0;
- human-review instances: 5 022 в пяти aggregated groups;
- 5 022 — пересекающиеся кандидаты на source/human review, а не доказанные ошибки;
- factual uNews patchnote `23.8.10` и новое real Chromium report image сохранены;
- существующие data files, runtime, PWA, package metadata, `versions/` и `_archive/` не изменены.

## Текущие зарегистрированные данные

```text
source-divinity-code-en
  canonical physical: data/bd2.json
  retained equivalent: data/db.json

ru-current-v1
  active runtime: data/divinity_code_ru.json

physical migration: planned-not-executed
remove_or_rename_approved: false
```

## Следующий точный шаг

Начать D1.4 только в новой отдельной ветке после создания/чтения Issue и обновления этого файла до `IN_PROGRESS`.

D1.4 должна быть architecture-only и определить:

- identity и provenance второй исходной книги;
- separate switching, combined search и side-by-side modes;
- visible source/dataset/translation provenance;
- dataset-aware history, sharing и deep links;
- validation, reload, cache-clearing и stable fallback contracts;
- migration и rollback до любой user-facing реализации.

## Главные запреты

- не менять и не удалять существующие data files;
- не исправлять audit findings без отдельного evidence-based data PR;
- не выполнять physical migration;
- не реализовывать selector в architecture-only D1.4;
- не начинать D1.5 AI-assisted translation до завершения D1.4;
- не выдавать heuristic findings или неизвестный translation pipeline за доказанный факт.

## Источник истины

Реальные GitHub-факты — `main`, открытые Pull Request, commits, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.
