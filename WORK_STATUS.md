# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **COMPLETED** — D1.4 реализован в ветке; ожидаются Pull Request и проверки |
| Рабочая ветка | `docs/two-book-architecture-d1.4` |
| Открытый Pull Request | ещё не открыт |
| Стабильный функциональный релиз | `v23.8.0` |
| Документационный/architecture baseline | кандидат `23.8.11` |
| Актуальный `main` при старте | `d6c7a070ecd6aec19b7841644cfdb80ac9f82de1` |
| Активная задача | Issue #30 — D1.4 two-book product architecture |
| Следующая точная задача | открыть PR, дождаться зелёных Actions, проверить diff и объединить |

## Завершено фактически

- создан `docs/TWO_BOOK_ARCHITECTURE.md`;
- создан machine-readable `docs/two-book-architecture.json`;
- добавлен permanent `scripts/validate-two-book-architecture.mjs`;
- validator включён в GitHub Actions и syntax checks;
- текущий default зафиксирован как `ru-current-v1`;
- второй PDF зафиксирован как retained evidence, но не готовый dataset;
- global identity определена как `(dataset_id, record_id)`;
- separate switching выбран первым будущим functional mode;
- combined search определён как federated по отдельным indexes без destructive JSON merge;
- side-by-side comparison требует explicit reviewed relation map;
- определены visible provenance, dataset-aware URLs/history/sharing, atomic activation, cache isolation, fallback и rollback;
- обновлены `ROADMAP.md` и `VERSION.md`;
- создан factual patchnote `23.8.11` и новый real PNG exact architecture evidence;
- существующие data files, runtime, PWA, package metadata, `versions/` и `_archive/` не изменены.

## Планируемые и фактические файлы

Фактически изменены или добавлены:

- `.github/workflows/validate.yml`;
- `ROADMAP.md`;
- `VERSION.md`;
- `WORK_STATUS.md`;
- `docs/TWO_BOOK_ARCHITECTURE.md`;
- `docs/two-book-architecture.json`;
- `scripts/validate-two-book-architecture.mjs`;
- `news/2026-07-23-udream-v23-8-11-two-book-architecture.md`;
- `news/2026-07-23-udream-v23-8-11-two-book-architecture.png`.

## Критерии завершения перед merge

- GitHub Actions полностью зелёные;
- architecture validator проходит;
- patchnote/new-image validation проходит;
- diff не содержит `data/`, runtime, PWA, package metadata, `versions/` или `_archive/`;
- PR переведён в ready и объединён squash merge;
- Issue #30 закрыт completed;
- `main/WORK_STATUS.md` возвращён в `READY`;
- следующая approved phase названа явно.

## Последний проверенный commit

Последний сохранённый этап до этого handoff содержит architecture docs, machine registry, validator, roadmap/version updates, patchnote и real PNG. Точный финальный head будет зафиксирован GitHub в Pull Request.

## Следующий точный шаг

Открыть Pull Request из `docs/two-book-architecture-d1.4` в `main`, проверить GitHub Actions и полный changed-files список. Не объединять при любой красной или незавершённой проверке.

## Главные запреты

- не менять существующие data files;
- не извлекать и не генерировать вторую базу;
- не менять runtime, PWA, Service Worker, package metadata, `versions/` или `_archive/`;
- не добавлять user-facing selector;
- не считать наличие PDF готовым dataset;
- не назначать одинаковые IDs между книгами без evidence;
- не начинать DeepSeek translation experiment;
- не добавлять API keys.

## Источник истины

Реальные GitHub-факты — `main`, текущая ветка, commits, Pull Request, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.