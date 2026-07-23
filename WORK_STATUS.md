# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит живую текущую задачу и точный следующий шаг.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — начат architecture-only этап D1.4 |
| Рабочая ветка | `docs/two-book-architecture-d1.4` |
| Открытый Pull Request | ещё не открыт |
| Стабильный функциональный релиз | `v23.8.0` |
| Документационный/data baseline | `23.8.10` — D1.3 завершён |
| Актуальный `main` при старте | `d6c7a070ecd6aec19b7841644cfdb80ac9f82de1` |
| Активная задача | Issue #30 — спроектировать архитектуру двух книг без изменения runtime |
| Следующая утверждённая задача после D1.4 | определить отдельную functional/data phase только после завершения архитектуры |

## Текущая точка продолжения

Статус: `IN_PROGRESS`

Начато: `2026-07-23 Europe/Berlin`

Среда: `ChatGPT + GitHub connector + GitHub Actions`

Ветка: `docs/two-book-architecture-d1.4`

Issue: `#30` — `https://github.com/sunpole/udream/issues/30`

Цель: создать проверяемую архитектуру работы uDream с двумя исходными книгами до любой реализации selector, combined search, side-by-side comparison или второй базы.

## Планируемые файлы

- `docs/TWO_BOOK_ARCHITECTURE.md`;
- при необходимости machine-readable architecture registry under `data/` или `docs/`, но без изменения существующих data files;
- постоянный validator архитектурного реестра, если registry добавляется;
- `README.md`;
- `ROADMAP.md`;
- `VERSION.md`;
- `CHANGELOG.md`;
- `docs/PROJECT_STATE.md`;
- `docs/ARCHITECTURE.md`;
- `docs/FILE_MAP.md`;
- `docs/DATASET_REGISTRY.md`;
- `AGENTS.md`;
- `WORK_STATUS.md`;
- factual uNews patchnote и новый real PNG/JPEG.

## Критерии завершения

- source works и documents имеют stable IDs и evidence status;
- current dataset и future second-book dataset разделены;
- global identity использует `(dataset_id, record_id)`;
- separate switching, federated combined search и side-by-side comparison сравнены и сведены в staged recommendation;
- visible provenance, URLs, history, sharing, cache/fallback и relation-map contracts определены;
- migration/rollback описаны до implementation;
- validators и GitHub Actions проходят;
- data/runtime/PWA/package metadata/`versions/`/`_archive/` отсутствуют в diff;
- factual patchnote и новое реальное изображение добавлены;
- PR объединён после полного diff review;
- Issue #30 закрыт completed;
- `main/WORK_STATUS.md` возвращён в `READY`.

## Последний проверенный commit

`d6c7a070ecd6aec19b7841644cfdb80ac9f82de1` — D1.3 завершён и `main` готов к D1.4.

## Следующий точный шаг

Прочитать поддерживаемые architecture/data документы и зарегистрированные datasets, затем подготовить `docs/TWO_BOOK_ARCHITECTURE.md` и, только если это повышает проверяемость, machine-readable architecture registry с validator.

## Главные запреты

- не менять существующие data files;
- не извлекать и не генерировать вторую базу;
- не менять runtime, PWA, Service Worker, package metadata, `versions/` или `_archive/`;
- не добавлять user-facing selector;
- не считать наличие PDF готовым dataset;
- не назначать одинаковые IDs между книгами без evidence;
- не начинать D1.5 DeepSeek translation experiment;
- не добавлять API keys;
- не заявлять source URLs или permissions, которых нет в GitHub.

## Источник истины

Реальные GitHub-факты — `main`, текущая ветка, commits, Pull Request, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.