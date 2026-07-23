# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит живую текущую задачу и точный следующий шаг.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — начат D1.4 two-book product architecture |
| Начато | `2026-07-23 09:32 Europe/Berlin` |
| Среда | `ChatGPT + GitHub connector + GitHub Actions` |
| Рабочая ветка | `docs/d1.4-two-book-architecture-v23.8.11` |
| Открытый Pull Request | ещё не открыт |
| Issue | `#30` — D1.4 two-book product architecture |
| Стабильный функциональный релиз | `v23.8.0` |
| Текущий baseline | `23.8.10` — D1.3 data-quality audit завершён |
| Последний подтверждённый main перед стартом | `5b584ab131ca64a0a1e73b2f86bdc4b3b09945b2` |
| Активная база | `ru-current-v1`, 4 086 записей; менять запрещено |

Цель: спроектировать проверяемую architecture-only модель двух книг: source-work/document identity, separate/federated/comparison modes, provenance, global record identity, dataset-aware URLs/history/sharing, validation/loading/cache/fallback и staged implementation без изменения runtime или существующих данных.

Последний проверенный commit: `5b584ab131ca64a0a1e73b2f86bdc4b3b09945b2` — D1.3 завершён, main READY, Issue #30 создан.

## Доказанная исходная точка

- current source/current datasets относятся только к `DivinityCode`;
- audit source distribution: `DivinityCode` у всех 4 086 source/current records;
- в runtime-меню присутствуют две PDF-книги;
- Divinity Code PDF path: `_archive/source-files/The_Divinity_Code_to_Understanding_Your_Dreams_and_Visions_PDF_Room.pdf`, Git blob `12ac4bd8ba4c2c1766bf62c1ee7c6df1e89e36d9`;
- second PDF path: `_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf`, Git blob `c1d4b038b1d7efbe50d7b2ba8de8040e686a1e18`;
- maintained notice identifies the second work as `Unlocking Your Dreams / related student material`;
- separate verified logical dataset for the second book does not exist;
- presence of PDF is not evidence of extracted/validated data;
- original external URLs, exact permissions and full edition metadata remain unknown.

## Планируемые файлы

Планируемые файлы:

- `data/source-works.json` — source-work/document evidence registry;
- `data/two-book-architecture.json` — machine-readable future architecture contract;
- `docs/TWO_BOOK_ARCHITECTURE.md` — complete D1.4 decision record;
- `scripts/validate-two-book-architecture.mjs` — permanent validator;
- `.github/workflows/validate.yml`;
- `README.md`;
- `VERSION.md`;
- `CHANGELOG.md`;
- `ROADMAP.md`;
- `docs/PRODUCT_VISION.md`;
- `docs/PROJECT_STATE.md`;
- `docs/ARCHITECTURE.md`;
- `docs/FILE_MAP.md`;
- `docs/DATABASE_FORMAT.md`;
- `docs/TRANSLATION_WORKFLOW.md`;
- `AGENTS.md`;
- `WORK_STATUS.md`;
- factual patchnote `23.8.11` и новое real document image.

## Критерии завершения

- source works/documents имеют stable IDs and evidence status;
- second work зарегистрирован как document-only, не как готовый dataset;
- current datasets связаны только с Divinity Code;
- global identity uses `(dataset_id, record_id)`;
- separate switching, federated combined search и explicit relation-based comparison defined;
- card/result provenance contract defined;
- URLs, history, sharing and deep links are dataset-aware;
- activation validation, cache namespace and stable fallback defined;
- staged phases separate extraction, translation, data readiness and functional selector;
- runtime/data/PWA/package/saved-version/archive files absent from diff;
- validator and GitHub Actions green;
- factual patchnote and new real image match D1.4;
- PR merged, Issue #30 closed, main returned to READY.

## Следующий точный шаг

Создать machine-readable source-work registry и future architecture contract using only proven GitHub evidence. Затем добавить validator и human architecture document.

## Главные запреты

- не менять существующие data files or record contents;
- не извлекать second-book dataset;
- не менять runtime, PWA, package metadata, `versions/` or `_archive/`;
- не добавлять user-facing selector;
- не считать PDF готовым dataset;
- не equate numeric IDs across books;
- не начинать API translation/extraction;
- не заявлять unknown authors, editions, URLs or licenses as proven facts;
- не объединять PR при красных or unfinished checks.

## Источник истины

Real GitHub facts — `main`, current branch, commits, PR, Actions and Issues — have priority over AI memory, old chats and unpushed local changes.
