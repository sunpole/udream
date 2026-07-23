# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит живую текущую задачу и точный следующий шаг.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — D1.2 registry core создан; продолжается синхронизация документации и проверок |
| Начато | `2026-07-23 08:10 Europe/Berlin` |
| Среда | `ChatGPT + GitHub connector + GitHub Actions` |
| Рабочая ветка | `docs/d1.2-dataset-registry-v23.8.9` |
| Открытый Pull Request | ещё не открыт |
| Issue | `#26` — D1.2 dataset registry |
| Стабильный функциональный релиз | `v23.8.0` |
| Текущий baseline | `23.8.8` — D1.1 завершён |
| Последний подтверждённый main перед стартом | `d4e24511a551e7b9a17b07579f8a9f3276bb0de0` |
| Активная база | `data/divinity_code_ru.json`, 4 086 записей; менять запрещено |

Цель: создать проверяемый машинно-читаемый реестр логических наборов и физических файлов, назначить стабильные IDs, выбрать `data/bd2.json` канонической физической копией английского логического набора, сохранить `data/db.json` как retained/compatibility serialization и документировать обратимый будущий план миграции без удаления, переименования или изменения существующих файлов данных.

Последний проверенный commit: `15b09f76677c05d6b49067104c43f39fb97714d0` — добавлены registry, постоянный validator, документ D1.2 и обязательный CI-шаг.

## Что уже сделано фактически

- создан `data/datasets.json` со schema version 1;
- утверждены logical dataset IDs `source-divinity-code-en` и `ru-current-v1`;
- утверждены physical file IDs для `data/bd2.json`, `data/db.json` и `data/divinity_code_ru.json`;
- `data/bd2.json` выбран canonical physical serialization как project-governance decision;
- `data/db.json` сохранён как retained equivalent compatibility serialization;
- создан `docs/DATASET_REGISTRY.md` с identity, reference-audit, migration и rollback правилами;
- создан `scripts/validate-dataset-registry.mjs`, который сверяет registry с реальными файлами, hashes, canonical identity, ordered IDs, runtime isolation и policy;
- `.github/workflows/validate.yml` запускает registry-validator и проверяет его JavaScript syntax;
- существующие файлы данных, runtime, PWA, package metadata, `versions/` и `_archive/` не изменялись.

## Доказанная исходная точка

- `data/bd2.json` и `data/db.json` имеют разные raw bytes и raw SHA-256;
- parsed JSON и canonical JSON полностью идентичны;
- оба файла представляют один логический английский набор из 4 086 записей;
- `data/divinity_code_ru.json` — отдельный активный локализованный/дополненный набор с теми же ordered IDs;
- точный исторический pipeline перевода остаётся неизвестным;
- D1.1 завершён PR №25 и зафиксирован в `docs/DATA_PROVENANCE.md`.

## Планируемые файлы

Планируемые файлы:

- `data/datasets.json`;
- `docs/DATASET_REGISTRY.md`;
- `scripts/validate-dataset-registry.mjs`;
- `.github/workflows/validate.yml`;
- `README.md`;
- `ROADMAP.md`;
- `VERSION.md`;
- `CHANGELOG.md`;
- `docs/PROJECT_STATE.md`;
- `docs/FILE_MAP.md`;
- `docs/DATABASE_FORMAT.md`;
- `docs/TRANSLATION_WORKFLOW.md`;
- `AGENTS.md`;
- `WORK_STATUS.md`;
- новый патчноут `23.8.9` и новое реальное документальное изображение.

## Критерии завершения

Критерии завершения:

- реестр имеет стабильные logical dataset IDs и physical file IDs;
- реестр фиксирует язык, роль, статус, path, bytes, raw/canonical hashes, record count и связи;
- английский logical dataset представлен ровно один раз;
- `data/bd2.json` назначен canonical physical serialization как управленческое решение, а не как доказанный исторический оригинал;
- `data/db.json` сохранён как retained/compatibility serialization;
- активный русский набор зарегистрирован отдельно и остаётся runtime current;
- будущие альтернативные переводы не могут перезаписывать текущий набор;
- документирован обратимый будущий migration/rollback plan без выполнения миграции;
- validator сверяет реестр с реальными файлами, hashes, canonical identity и provenance baseline;
- существующие `data/bd2.json`, `data/db.json`, `data/divinity_code_ru.json`, `data/report.txt` не изменены;
- runtime, PWA, package metadata, `versions/` и `_archive/` не изменены;
- tests и GitHub Actions зелёные;
- новый патчноут и новое реальное изображение относятся именно к D1.2;
- PR объединён после полного просмотра diff, Issue №26 закрыт, `main/WORK_STATUS.md` возвращён в `READY`.

## Следующий точный шаг

Синхронизировать README, roadmap, version, project-state, file-map, database-format, translation rules и AGENTS с реестром 23.8.9; затем создать factual patchnote и новое реальное document-render изображение.

## Главные запреты

- не удалять, не переименовывать и не изменять четыре существующих файла `data/`;
- не менять IDs, тексты или порядок 4 086 записей;
- не менять runtime, PWA, Service Worker, package metadata, `versions/` или `_archive/`;
- не добавлять пользовательский переключатель баз;
- не начинать D1.3, D1.4 или D1.5;
- не называть выбор `bd2.json` доказанным историческим оригиналом;
- не выполнять фактическую миграцию или удаление compatibility copy в D1.2;
- не создавать параллельную ветку для D1.2;
- не объединять PR при красных или незавершённых проверках.

## Источник истины

Реальные GitHub-факты — `main`, текущая ветка, commits, Pull Request, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.