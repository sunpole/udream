# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **COMPLETED** — D1.4a реализован в ветке; остаются финальная зелёная проверка и merge |
| Рабочая ветка | `docs/second-book-evidence-d1.4a` |
| Открытый Pull Request | `#33` — `https://github.com/sunpole/udream/pull/33` |
| Стабильный функциональный релиз | `v23.8.0` |
| Документационный/extraction baseline | кандидат `23.8.12` |
| Актуальный `main` при старте | `20325ee0c3d60dbc90b88060dc26b201b6376e6f` |
| Активная задача | Issue #32 — D1.4a second-book evidence and extraction contract |
| Следующая утверждённая работа после merge | D1.4b — private/non-public raw-extraction pilot |

## Завершено фактически

- проверен PDF `_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf`;
- зафиксированы размер `740193` bytes, SHA-256 `edb4127915bf720ee56c96612f825ea4e0ef2f5fc15192a56fb96e5c7ec4745a`, Git blob и Git history;
- подтверждены 55 страниц и существенный извлекаемый текст на всех 55 страницах;
- searchable ratio: `1.0`;
- технические метрики: 85 103 символа, 12 479 слов, median 1 520 символов на непустой странице;
- технический вывод: `direct-text-extraction-viable`;
- создан `docs/SECOND_BOOK_EVIDENCE.md`;
- создан machine-readable `docs/second-book-evidence.json`;
- создан `docs/SECOND_BOOK_EXTRACTION_CONTRACT.md`;
- создан permanent validator `scripts/validate-second-book-evidence.mjs`;
- validator подключён к GitHub Actions и syntax checks;
- создан factual uNews patchnote `23.8.12`;
- создан новый real Chromium PNG exact GitHub evidence page;
- временные analysis/capture workflows удалены из итогового diff;
- полный извлечённый текст книги не сохранён в репозитории;
- существующие `data/`, PDF, runtime, PWA, Service Worker, package metadata, `versions/` и `_archive/` не изменены.

## Доказанный вывод

Вторая сохранённая книга технически подходит для прямого page-aware extraction. Это не означает, что база уже готова: semantic record boundaries, aliases, source references, права публикации и человеческая проверка остаются отдельными gates.

## Следующий точный шаг

1. дождаться нового полного `Validate uDream` на финальном head PR #33;
2. проверить полный changed-file list и отсутствие protected-path изменений;
3. перевести PR #33 из draft в ready;
4. объединить squash merge только после зелёных checks;
5. закрыть Issue #32 completed;
6. вернуть `main/WORK_STATUS.md` в `READY`;
7. начать D1.4b только через отдельный Issue и новую ветку.

## Следующая фаза D1.4b

D1.4b должна создать private/non-public immutable raw-extraction pilot:

- один UTF-8 файл на физическую страницу;
- manifest с source hash, tool version, page hashes и aggregate hash;
- небольшой reviewed segmentation sample из начала, середины и конца;
- direct extraction как default;
- limited OCR только для явно отмеченных областей;
- без регистрации logical dataset и без изменения `ru-current-v1`.

## Главные запреты

- не изменять существующие `data/` файлы;
- не изменять или удалять исходный PDF и `_archive/`;
- не сохранять полный извлечённый текст книги в публичном репозитории до rights review;
- не создавать registered second-book dataset без immutable extraction output и review;
- не добавлять selector, combined search или comparison UI;
- не назначать одинаковые numeric IDs между книгами;
- не менять runtime, PWA, Service Worker, package metadata или `versions/`;
- не запускать AI-assisted translation;
- не добавлять API keys;
- не заявлять source URL, edition или permissions без сохранённого evidence.

## Последний проверенный commit

`ac9a44526017e3e9c3aed4bdd23962d11804a96f` — ветка содержит evidence, contract, validator, patchnote и новый real PNG; one-time workflows удалены.

## Источник истины

Реальные GitHub-факты — `main`, текущая ветка, commits, Pull Request, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.
