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
| Документационный/data baseline | `23.8.9` — D1.2 dataset registry завершён |
| Последнее завершённое изменение | PR #27, squash merge `3cb0403016b56a8d5e6fedd9b6367f383ec4a6ba` |
| Закрытая задача | Issue #26 — D1.2 completed |
| Следующая утверждённая задача | D1.3 — non-destructive data-quality audit design |

## Завершённый этап D1.2

- создан machine-readable registry `data/datasets.json`;
- зарегистрированы logical dataset IDs `source-divinity-code-en` и `ru-current-v1`;
- зарегистрированы physical file IDs для обеих английских сериализаций и активной русской базы;
- `data/bd2.json` выбран canonical maintained serialization как project-governance decision;
- выбор canonical path не выдаётся за доказательство исторического оригинала;
- `data/db.json` сохранён как retained equivalent compatibility serialization;
- создан `docs/DATASET_REGISTRY.md` с identity, reference audit, migration и rollback;
- создан permanent validator `scripts/validate-dataset-registry.mjs`;
- GitHub Actions проверяет registry, реальные hashes, canonical JSON, 4 086 ordered IDs, policy и runtime isolation;
- factual uNews patchnote `23.8.9` и новый реальный Chromium document-render сохранены;
- существующие data-файлы, runtime, PWA, package metadata, `versions/` и `_archive/` не изменены.

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

Начать D1.3 только в новой отдельной ветке после чтения Issue/ROADMAP и обновления этого файла до `IN_PROGRESS`.

D1.3 должна спроектировать и выполнить неразрушающий аудит качества всех 4 086 записей: автоматические проверки, severity levels, machine-readable и human-readable reports. Она может находить и описывать проблемы, но не должна молча исправлять или перезаписывать данные.

## Главные запреты

- не удалять, не переименовывать и не изменять текущие data-файлы без отдельной обратимой миграции;
- не менять стабильные IDs или тексты в audit-патче;
- не начинать пользовательский selector баз;
- не запускать D1.4 или D1.5 раньше завершения D1.3;
- не выдавать неизвестный translation pipeline за доказанный факт.

## Источник истины

Реальные GitHub-факты — `main`, открытые Pull Request, commits, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.
