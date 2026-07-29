# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — выполняется D1.4a second-book evidence and extraction contract |
| Рабочая ветка | `docs/second-book-evidence-d1.4a` |
| Открытый Pull Request | `#33` — `https://github.com/sunpole/udream/pull/33` |
| Стабильный функциональный релиз | `v23.8.0` |
| Текущий baseline | `23.8.11`; следующий документационный baseline будет определён по фактическому результату D1.4a |
| Актуальный `main` при старте | `20325ee0c3d60dbc90b88060dc26b201b6376e6f` |
| Активная задача | Issue #32 — D1.4a second-book evidence and extraction contract |
| Следующий точный шаг | получить проверяемые PDF-метрики, сохранить постоянный evidence/contract, удалить временный workflow и довести PR #33 до зелёного merge |

Цель: доказать техническую извлекаемость второй сохранённой книги и определить безопасный путь к отдельной базе без изменения текущего runtime, PWA и существующих данных.

Начато: 2026-07-24 Europe/Berlin.

Среда: ChatGPT + GitHub connector + GitHub Actions.

Ветка: `docs/second-book-evidence-d1.4a`.

## Планируемые файлы:

- `WORK_STATUS.md`;
- `docs/SECOND_BOOK_EVIDENCE.md`;
- `docs/second-book-evidence.json`;
- `docs/SECOND_BOOK_EXTRACTION_CONTRACT.md`;
- `scripts/validate-second-book-evidence.mjs`;
- `.github/workflows/validate.yml`;
- `README.md`, `ROADMAP.md`, `VERSION.md`, `CHANGELOG.md` и связанные документы;
- factual uNews patchnote и новое реальное изображение;
- временный `.github/workflows/analyze-second-book-d1.4a.yml`, который обязан удалить себя до итогового merge.

## Критерии завершения:

- exact path, bytes, SHA-256, PDF metadata и Git history второй книги зафиксированы;
- качество текстового слоя измерено воспроизводимо;
- решение direct extraction / hybrid OCR / OCR-first основано на фактах;
- immutable raw-extraction output и provenance manifest contract определены;
- schema, local-ID и source-reference policy определены;
- новый logical dataset не регистрируется до появления фактического extraction output;
- существующие `data/`, PDF, runtime, PWA, package metadata, `versions/` и `_archive/` не изменены;
- временный workflow удалён из итогового diff;
- validators и GitHub Actions зелёные;
- PR #33 объединён только после полного diff review;
- Issue #32 закрыт completed;
- `main/WORK_STATUS.md` возвращён в READY.

## Что уже сделано

- D1.4 завершён PR #31, squash merge `897f89a325c9997f9046455a6df7336e82d2c7d8`;
- Issue #30 закрыт completed;
- создан Issue #32 с уточнённой продуктовой целью;
- создана отдельная ветка `docs/second-book-evidence-d1.4a`;
- открыт draft PR #33;
- добавлен временный read-only workflow анализа PDF;
- обнаружена и исправляется ошибка формата handoff, из-за которой validator не видел обязательное поле `Цель:`.

## Последний проверенный commit:

`28884bd36e3b83f65d46064e668314d60f6ed137` — текущий head PR #33 до исправления handoff.

## Следующий точный шаг

Обновить временный workflow так, чтобы он воспроизводимо вычислил PDF identity и extractability metrics, сохранил только безопасные метаданные и числовые результаты в постоянный evidence JSON/Markdown, удалил себя и запушил результат в существующую ветку. После этого добавить постоянный validator и завершить документацию.

## Главные запреты

- не изменять существующие `data/` файлы;
- не изменять или удалять исходный PDF и `_archive/`;
- не сохранять полный извлечённый текст книги в репозитории или artifacts итогового PR;
- не создавать registered second-book dataset без фактического immutable extraction output;
- не добавлять selector, combined search или comparison UI;
- не назначать одинаковые numeric IDs между книгами;
- не менять runtime, PWA, Service Worker, package metadata или `versions/`;
- не запускать AI-assisted translation;
- не добавлять API keys;
- не заявлять source URL, edition или permissions без сохранённого evidence.

## Источник истины

Реальные GitHub-факты — `main`, текущая ветка, commits, Pull Request, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.
