# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **READY** — незавершённой активной задачи нет |
| Рабочая ветка | `main` |
| Открытый Pull Request | нет |
| Стабильный функциональный релиз | `v23.8.0` |
| Документационный/architecture baseline | `23.8.11` — D1.4 two-book architecture завершён |
| Последнее завершённое изменение | PR #31, squash merge `897f89a325c9997f9046455a6df7336e82d2c7d8` |
| Закрытая задача | Issue #30 — D1.4 completed |
| Следующая утверждённая работа | second-book evidence and dataset preparation |

## Завершённый этап D1.4

- создан `docs/TWO_BOOK_ARCHITECTURE.md`;
- создан machine-readable `docs/two-book-architecture.json`;
- добавлен permanent `scripts/validate-two-book-architecture.mjs`;
- GitHub Actions run №129 завершён успешно;
- текущий default остаётся `ru-current-v1`;
- второй сохранённый PDF классифицирован как retained evidence, но не готовый dataset;
- global identity определена как `(dataset_id, record_id)`;
- separate dataset switching выбран первым будущим functional mode;
- combined search определён как federated по отдельным indexes без destructive JSON merge;
- side-by-side comparison требует explicit reviewed relation map;
- определены visible provenance, dataset-aware URLs/history/sharing, atomic activation, cache isolation, fallback и rollback;
- factual uNews patchnote `23.8.11` и новый real PNG сохранены;
- существующие data files, runtime, PWA, package metadata, `versions/` и `_archive/` не изменены;
- Issue #30 закрыт как completed.

## Следующий точный шаг

Следующую работу начинать только в новой отдельной ветке после создания Issue и обновления этого файла до `IN_PROGRESS`.

Цель следующего этапа — подготовить доказательства и безопасный extraction contract для второй книги до создания logical dataset:

1. зафиксировать точную identity/edition второй сохранённой работы настолько, насколько позволяют файлы и Git history;
2. отделить доказанные сведения, разумные выводы и неизвестное;
3. определить immutable raw-extraction output и provenance manifest;
4. определить schema, local ID policy, source references, hashes и validation gates;
5. не создавать registered dataset до появления фактического extraction output;
6. не менять `ru-current-v1`, runtime, PWA или существующие data files;
7. не реализовывать selector, combined search или comparison UI на этом этапе.

## Главные запреты

- не менять и не удалять существующие data files;
- не считать наличие PDF готовым dataset;
- не выполнять destructive merge книг;
- не назначать одинаковые numeric IDs между книгами без evidence;
- не менять runtime, PWA, Service Worker, package metadata, `versions/` или `_archive/`;
- не начинать user-facing selector до готовности и регистрации второй базы;
- не запускать AI-assisted translation experiment до отдельного утверждённого этапа;
- не добавлять API keys или секреты.

## Источник истины

Реальные GitHub-факты — `main`, открытые Pull Request, commits, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.
