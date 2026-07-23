# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **COMPLETED** — D1.2 реализован и проверен; PR №27 готовится к финальному merge |
| Рабочая ветка | `docs/d1.2-dataset-registry-v23.8.9` |
| Открытый Pull Request | `#27` — `https://github.com/sunpole/udream/pull/27` |
| Issue | `#26` — D1.2 dataset registry |
| Стабильный функциональный релиз | `v23.8.0` |
| Документационный/data baseline | кандидат `23.8.9` |
| Последний проверенный branch head | `f43d750a69929f894651c00ec067fb4c3b2e509c` |
| Проверка GitHub Actions | `Validate uDream` run `29985622461` — success |
| Следующая утверждённая задача после merge | D1.3 — non-destructive data-quality audit design |

## Цель

Создать проверяемый машинно-читаемый реестр логических наборов и физических файлов, назначить стабильные IDs, выбрать `data/bd2.json` канонической физической копией английского логического набора, сохранить `data/db.json` как retained/compatibility serialization и документировать обратимый будущий план миграции без удаления, переименования или изменения существующих файлов данных.

## Выполнено фактически

- создан `data/datasets.json`, schema version 1;
- logical dataset IDs: `source-divinity-code-en`, `ru-current-v1`;
- physical file IDs: `source-divinity-code-en-bd2`, `source-divinity-code-en-db`, `ru-current-v1-runtime`;
- `data/bd2.json` выбран canonical maintained serialization как project-governance decision;
- явно записано, что этот выбор не доказывает исторический оригинал или authoritative source edition;
- `data/db.json` сохранён как retained equivalent compatibility serialization;
- создан `docs/DATASET_REGISTRY.md` с identity, reference audit, migration и rollback;
- создан permanent validator `scripts/validate-dataset-registry.mjs`;
- GitHub Actions обязательно запускает новый validator и syntax check;
- README, VERSION, CHANGELOG, ROADMAP, PRODUCT_VISION, PROJECT_STATE, ARCHITECTURE, FILE_MAP, DATABASE_FORMAT, TRANSLATION_WORKFLOW и AGENTS синхронизированы;
- создан factual uNews patchnote `23.8.9`;
- создан новый реальный Chromium document-render exact GitHub page `docs/DATASET_REGISTRY.md`;
- screenshot metadata указывает на source commit `80dde35b412a8de0462f0f612fdeb0eb85e6e5ca` и UTC capture `2026-07-23T06:36:11Z`;
- одноразовый capture workflow удалён после сохранения изображения;
- существующие файлы данных, runtime, PWA, Service Worker, package metadata, `versions/` и `_archive/` не изменены.

## Проверки

На branch head `f43d750a69929f894651c00ec067fb4c3b2e509c` GitHub Actions успешно выполнил:

- regression tests;
- project/data/handoff/screenshot/patchnote validator;
- D1.2 dataset registry validator;
- обязательную проверку нового patchnote и нового изображения;
- JavaScript syntax checks.

Итоговый changed-file list не содержит:

```text
data/bd2.json
data/db.json
data/divinity_code_ru.json
data/report.txt
index.html
script.js
src/
sw.js
manifest.json
version.json
package.json
versions/
_archive/
```

Новый `data/datasets.json` является registry metadata и не загружается runtime.

## Контрольные решения

```text
source-divinity-code-en
  canonical physical: data/bd2.json
  retained equivalent: data/db.json

ru-current-v1
  active runtime: data/divinity_code_ru.json

physical migration: planned-not-executed
remove_or_rename_approved: false
```

## Планируемые файлы

План D1.2 выполнен в пределах:

- registry и validators;
- документация и GitHub Actions validation;
- WORK_STATUS, changelog и roadmap;
- factual patchnote и новое реальное изображение.

Незапланированных runtime/data-content изменений нет.

## Критерии завершения

- stable logical and physical IDs созданы;
- canonical/retained/runtime roles зафиксированы;
- реестр сверяется с реальными bytes, hashes, canonical JSON и 4 086 ordered IDs;
- future migration и rollback документированы, но не выполнены;
- current translation нельзя перезаписать будущим candidate dataset;
- protected files не изменены;
- CI зелёный;
- patchnote и image относятся к D1.2;
- после squash merge Issue №26 закрывается и `main/WORK_STATUS.md` возвращается в `READY`.

## Следующий точный шаг

Перевести PR №27 из draft в ready, дождаться зелёной проверки на финальном head, проверить diff ещё раз и выполнить squash merge. Затем закрыть Issue №26 и записать на `main` состояние `READY` для D1.3.

## Запреты до merge

- не менять существующие data-файлы или runtime;
- не выполнять физическую migration;
- не начинать D1.3 до завершения PR №27;
- не объединять PR при красной или незавершённой проверке.

## Источник истины

Реальные GitHub-факты — `main`, текущая ветка, commits, Pull Request, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.
