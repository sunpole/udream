# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **READY** — незавершённой активной задачи нет |
| Рабочая ветка | `main` |
| Открытый Pull Request | нет |
| Стабильный функциональный релиз | `v23.8.0` |
| Документационный/extraction baseline | `23.8.12` — D1.4a завершён |
| Последнее завершённое изменение | PR #33, squash merge `24cf1cf13dce580dbf628b05a3c160e1c716fd54` |
| Закрытая задача | Issue #32 — D1.4a completed |
| Следующая утверждённая задача | Issue #34 — D1.4b private/non-public raw-extraction pilot |

## Завершённый этап D1.4a

- проверен PDF `_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf`;
- зафиксированы размер `740193` bytes, SHA-256 `edb4127915bf720ee56c96612f825ea4e0ef2f5fc15192a56fb96e5c7ec4745a`, Git blob и Git history;
- подтверждены 55 страниц и существенный извлекаемый текст на всех 55 страницах;
- searchable ratio: `1.0`;
- технические метрики: 85 103 символа, 12 479 слов, median 1 520 символов на непустой странице;
- технический вывод: `direct-text-extraction-viable`;
- созданы `docs/SECOND_BOOK_EVIDENCE.md`, `docs/second-book-evidence.json` и `docs/SECOND_BOOK_EXTRACTION_CONTRACT.md`;
- создан permanent validator `scripts/validate-second-book-evidence.mjs`;
- validator подключён к GitHub Actions;
- factual uNews patchnote `23.8.12` и новый real Chromium PNG сохранены;
- временные analysis/capture workflows удалены;
- полный извлечённый текст книги не сохранён в репозитории;
- существующие `data/`, PDF, runtime, PWA, Service Worker, package metadata, `versions/` и `_archive/` не изменены;
- GitHub Actions run №145 прошёл полностью;
- PR #33 объединён, Issue #32 закрыт completed.

## Доказанный вывод

Вторая сохранённая книга технически подходит для прямого page-aware extraction. Это не означает, что готова новая база: semantic record boundaries, aliases, source references, права публикации и человеческая проверка остаются отдельными gates.

## Следующий точный шаг

Начать Issue #34 только в новой отдельной ветке после обновления этого файла до `IN_PROGRESS`.

D1.4b должна выполнить private/non-public immutable raw-extraction pilot:

- один UTF-8 файл на физическую страницу;
- manifest с source hash, tool version, page hashes и aggregate hash;
- небольшой reviewed segmentation sample из начала, середины и конца;
- direct extraction как default;
- limited OCR только для явно отмеченных областей;
- без регистрации logical dataset и без изменения `ru-current-v1`.

## Главные запреты

- не коммитить полный извлечённый текст книги в публичный репозиторий;
- не изменять существующие `data/` файлы, PDF или `_archive/`;
- не создавать registered second-book dataset без immutable extraction output и review;
- не добавлять selector, combined search или comparison UI;
- не назначать одинаковые numeric IDs между книгами;
- не менять runtime, PWA, Service Worker, package metadata или `versions/`;
- не запускать AI-assisted translation;
- не добавлять API keys или секреты;
- не заявлять source URL, edition или permissions без сохранённого evidence.

## Источник истины

Реальные GitHub-факты — `main`, открытые Pull Request, commits, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.
