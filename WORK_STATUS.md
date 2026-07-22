# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит живую текущую задачу и точку продолжения.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — PR #24 с ремонтом публикационных изображений проходит финальную проверку |
| Рабочая ветка | `fix/pending-publication-images-v23.8.1-v23.8.5` |
| Открытый Pull Request | `#24` — `https://github.com/sunpole/udream/pull/24` |
| Стабильный релиз | `v23.8.0` |
| Документационный и automation baseline | `v23.8.7` |
| Уже опубликовано | `uDream 23.8.0`, Telegram message `54`, `https://t.me/uNewsLog/54` |
| Сохранённая работа | D1.1 branch commit `9527dff75971d86a634ab437618d26cc03c3c87a` |
| Активная задача | объединить PR #24, затем завершить uNews `0.3.7`, dry-run и Telegram FIFO |

## Текущая точка продолжения

Статус: `IN_PROGRESS`

Начато: `2026-07-22 Europe/Berlin`

Устройство/среда: `ChatGPT + GitHub connector + GitHub Actions + Playwright Chromium`

Ветка: `fix/pending-publication-images-v23.8.1-v23.8.5`

Pull Request: `https://github.com/sunpole/udream/pull/24`

Цель: устранить все известные технические и содержательные дефекты неопубликованных изображений `23.8.1–23.8.5`, не меняя FIFO-идентичность патчноутов, runtime, PWA, базу, сохранённые версии или архив.

Планируемые файлы:

- пять существующих неопубликованных патчноутов `23.8.1–23.8.5`;
- пять отдельных реальных GitHub UI PNG в `news/`;
- Playwright provenance manifest `tools/screenshots/v23.8.1-v23.8.5-publication-repairs.json`;
- `scripts/validate-patchnote-diff.mjs`;
- `scripts/validate-project.mjs`;
- `docs/NEWS_PUBLISHING.md`;
- `WORK_STATUS.md`.

Критерии завершения:

- пять изображений уникальны и относятся к конкретным патчам;
- каждый PNG проходит сигнатуру, PNG chunk CRC, декодирование и размерные проверки;
- GitHub UI-страница на снимке соответствует историческому commit своего этапа;
- FIFO-поля патчноутов не изменены;
- runtime, PWA, package metadata, `data/`, `versions/` и `_archive/` отсутствуют в diff;
- PR #24 объединён после зелёных Actions;
- uNews `0.3.7` dry-run сообщает 0 image errors;
- Telegram публикует оставшиеся записи с отдельным checkpoint после каждого поста;
- `health.json` завершает запуск со status success и `last_error: null`;
- Issue uNews №3 закрыт;
- D1.1 возвращён в `IN_PROGRESS` в существующей ветке.

Уже сделано:

- `uDream 23.8.0` опубликован как Telegram message `54`; ключ и `published_at` сохранены, дубль исключён;
- uNews CRC-аудит доказал повреждение общего PNG `23.8.1/23.8.2` в chunk `PLTE`;
- доказано, что `23.8.3–23.8.5` использовали технически исправное, но нерелевантное общее изображение;
- созданы пять уникальных Playwright Chromium-снимков публичных исторических GitHub-страниц;
- manifest хранит пять exact URLs, commits, assertions, UTC-времён, размеров `1440×1000` и byte size;
- пять патчноутов синхронизированы с manifest без изменения `project`, `series`, `version` и `queued_at`;
- добавлены repair markers `unpublished-invalid-image` и `unpublished-image-upgrade`;
- PR-validator проверяет пакетный repair, FIFO-поля, уникальность файлов, PNG CRC и исторические commits;
- project-validator постоянно проверяет repaired images, CRC и provenance;
- все временные capture, render, diagnostic и cleanup workflow удалены commit `aa9acba743dbdb1a9c5207769c407fa74ee40cfb`;
- PR #24 открыт на head `1056af845a0b664d8972bbfae7dd6d0c60bd773d`;
- `Validate uDream` run `29914377019` завершён успешно;
- `Capture uDream screenshots` run `29914377000` завершён успешно;
- diff PR #24 не содержит runtime, PWA, package metadata, активную базу, `versions/` или `_archive/`;
- D1.1 остаётся сохранённым на паузе и не изменяется.

Последний проверенный commit:

- uDream `main`: `e21bc8b2288591dcfdc6ad2e3d9a2524bd47b0f6`;
- текущий repair head до этого handoff: `1056af845a0b664d8972bbfae7dd6d0c60bd773d`;
- D1.1 pause commit: `9527dff75971d86a634ab437618d26cc03c3c87a`;
- uNews saved state after message 54: `ccd3b8b4400deef478411215bb8038de35742300`.

Следующий точный шаг:

- дождаться зелёных Actions на новом head PR #24, объединить PR; затем вернуться в `sunpole/uNews`, завершить `0.3.7`, выполнить полный dry-run и только после нулевого отчёта запустить Telegram FIFO.

Что нельзя делать при продолжении:

- не повторно публиковать `23.8.0`;
- не менять project, series, version или queued_at старых патчноутов;
- не создавать пять новых дублирующих новостей вместо ремонта неопубликованных записей;
- не использовать одно общее изображение для разных патчей;
- не менять runtime, PWA, Service Worker, package metadata или базу;
- не создавать новую D1.1 ветку и не удалять `docs/data-provenance-d1.1`;
- не продолжать D1.1 до подтверждения Telegram recovery.

## Источник истины

Реальные GitHub-факты — `main`, открытые Pull Request, commits, Actions, uNews `data/published.json`, `data/health.json` и Telegram `post_url` — имеют приоритет над памятью ИИ, старыми чатами и незапушенными локальными изменениями.
