# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — начат D1.4a second-book evidence and extraction contract |
| Рабочая ветка | `docs/second-book-evidence-d1.4a` |
| Открытый Pull Request | ещё не открыт |
| Стабильный функциональный релиз | `v23.8.0` |
| Текущий baseline | `23.8.11`; следующий документационный кандидат будет определён после фактического diff |
| Актуальный `main` при старте | `20325ee0c3d60dbc90b88060dc26b201b6376e6f` |
| Активная задача | Issue #32 — D1.4a second-book evidence and extraction contract |
| Следующий точный шаг | собрать read-only identity, metadata и Git-history evidence для второго PDF, затем создать первый доказательный документ |

## Цель

Подготовить проверяемую доказательную базу и безопасный extraction contract для второй сохранённой книги до создания нового logical dataset и до любой реализации selector, combined search или comparison UI.

## Планировалось

- проверить exact path, bytes, SHA-256 и PDF metadata второго сохранённого документа;
- восстановить Git history появления и переименований файла;
- проверить существующие упоминания названия, автора, edition и происхождения;
- разделить сведения на доказанные факты, разумные выводы и неизвестное;
- определить immutable raw-extraction output;
- определить provenance manifest contract;
- определить schema, local-ID и source-reference policy;
- определить validation gates перед регистрацией нового dataset;
- определить retention и rollback;
- не создавать и не изменять данные на этом этапе.

## Планируемые постоянные файлы

- `WORK_STATUS.md`;
- новый документ evidence/extraction contract под `docs/`;
- при необходимости machine-readable contract под `docs/`;
- при необходимости permanent validator под `scripts/`;
- синхронизация `ROADMAP.md`, `VERSION.md` и связанных документов;
- factual uNews patchnote и новое реальное изображение перед PR.

## Критерии завершения

- доказательства и неизвестное разделены честно;
- second-book PDF identity и retained history зафиксированы;
- extraction output и manifest contracts определены;
- protected paths отсутствуют в diff;
- существующие data files не изменены;
- runtime, PWA, package metadata, `versions/` и `_archive/` не изменены;
- validators и GitHub Actions зелёные;
- PR объединён только после полного diff review;
- Issue #32 закрыт completed;
- `main/WORK_STATUS.md` возвращён в READY.

## Что уже сделано

- D1.4 завершён PR #31, squash merge `897f89a325c9997f9046455a6df7336e82d2c7d8`;
- Issue #30 закрыт completed;
- создан Issue #32 с точными границами D1.4a;
- создана отдельная ветка `docs/second-book-evidence-d1.4a` от актуального `main`;
- ранний handoff сохранён до начала исследования.

## Следующий точный шаг

Read-only проверить `_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf`: exact bytes, SHA-256, PDF metadata, Git history и все maintained references. Затем создать первый доказательный черновик без изменения PDF, данных или runtime.

## Главные запреты

- не изменять существующие `data/` файлы;
- не изменять или удалять PDF и `_archive/`;
- не создавать registered second-book dataset без фактического extraction output;
- не добавлять selector, combined search или comparison UI;
- не назначать одинаковые numeric IDs между книгами;
- не менять runtime, PWA, Service Worker, package metadata или `versions/`;
- не запускать AI-assisted translation;
- не добавлять API keys;
- не заявлять source URL, edition или permissions без сохранённого evidence.

## Источник истины

Реальные GitHub-факты — `main`, текущая ветка, commits, Pull Request, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.
