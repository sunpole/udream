# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит живую текущую задачу и точку продолжения.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — пакет ремонта `23.8.1–23.8.5` реализован, готовится Pull Request |
| Рабочая ветка | `fix/pending-publication-images-v23.8.1-v23.8.5` |
| Открытый Pull Request | ещё не открыт |
| Стабильный релиз | `v23.8.0` |
| Документационный и automation baseline | `v23.8.7` |
| Последнее завершённое изменение | PR #23, squash merge `7172d09f6f862927fd3ae4752ef17c7e5767b837`; main handoff `e21bc8b2288591dcfdc6ad2e3d9a2524bd47b0f6` |
| Уже опубликовано | `uDream 23.8.0`, Telegram message `54`, `https://t.me/uNewsLog/54` |
| Сохранённая работа | D1.1 branch commit `9527dff75971d86a634ab437618d26cc03c3c87a` |
| Активная задача | пройти PR-проверки пяти уникальных document-render PNG, затем подтвердить uNews CRC-аудитом и Telegram FIFO |

## Текущая точка продолжения

Статус: `IN_PROGRESS`

Начато: `2026-07-22 Europe/Berlin`

Устройство/среда: `ChatGPT + GitHub connector + GitHub Actions + deterministic document render`

Ветка: `fix/pending-publication-images-v23.8.1-v23.8.5`

Pull Request: ещё не открыт

Цель: устранить все известные технические и содержательные дефекты неопубликованных изображений `23.8.1–23.8.5`, не меняя FIFO-идентичность патчноутов, runtime, PWA, базу, сохранённые версии или архив.

Планируемые файлы:

- пять существующих неопубликованных патчноутов `23.8.1–23.8.5`;
- пять отдельных PNG в `news/`;
- пять SVG-источников и manifest в `tools/screenshots/publication-repairs/`;
- `scripts/validate-patchnote-diff.mjs`;
- `scripts/validate-project.mjs`;
- `docs/NEWS_PUBLISHING.md`;
- `WORK_STATUS.md`.

Критерии завершения:

- пять изображений уникальны и относятся к конкретным патчам;
- каждый PNG проходит сигнатуру, PNG chunk CRC, декодирование и размерные проверки;
- документ на снимке соответствует историческому commit своего этапа;
- body-текст не выходит за границы панели;
- старое общее изображение больше не используется `23.8.2–23.8.5`;
- повреждённый `23.8.1` PNG заменён;
- FIFO-поля патчноутов не изменены;
- runtime, PWA, package metadata, `data/`, `versions/` и `_archive/` отсутствуют в diff;
- uNews `0.3.7` dry-run сообщает 0 image errors;
- Telegram публикует оставшиеся записи с отдельным checkpoint после каждого поста;
- `health.json` завершает запуск со status success и `last_error: null`;
- Issue uNews №3 закрыт;
- D1.1 возвращён в `IN_PROGRESS` в существующей ветке.

Уже сделано:

- `uDream 23.8.0` опубликован как Telegram message `54`; ключ и `published_at` сохранены, дубль исключён;
- полный uNews CRC-аудит доказал повреждение общего PNG `23.8.1/23.8.2` в chunk `PLTE`;
- доказано, что `23.8.3–23.8.5` использовали технически исправное, но нерелевантное общее изображение;
- определены исторические commits `24dece5`, `de27596`, `75e3e96`, `8adae19`, `ac7dfe6`;
- созданы пять уникальных SVG document-render источников из точных Git commits и GitHub Release metadata;
- созданы пять PNG `1200×675`, каждый прошёл `pngcheck` и ImageMagick;
- при содержательной проверке обнаружено переполнение текста в `23.8.2`;
- все SVG ограничены десятью строками тела, последняя базовая линия `y=555`, нижняя граница панели `y=587`;
- PNG повторно отрендерены и проверены;
- manifest хранит пять unique entries, exact commits, capture time, размеры и byte size;
- пять патчноутов обновлены без изменения `project`, `series`, `version` и `queued_at`;
- добавлены repair markers `unpublished-invalid-image` и `unpublished-image-upgrade`;
- PR-validator проверяет пакетный repair, FIFO-поля, уникальность файлов, PNG CRC и исторические commits;
- project-validator постоянно проверяет repaired images, CRC и provenance;
- D1.1 остаётся сохранённым на паузе и не изменяется.

Последний проверенный commit:

- uDream `main`: `e21bc8b2288591dcfdc6ad2e3d9a2524bd47b0f6`;
- D1.1 pause commit: `9527dff75971d86a634ab437618d26cc03c3c87a`;
- uNews saved state after message 54: `ccd3b8b4400deef478411215bb8038de35742300`;
- последний implementation commit перед этим handoff: `ccb03dd49598009cc12d36066581b33227ebc34b`.

Следующий точный шаг:

- обновить публикационную документацию, удалить одноразовые workflow, проверить итоговый diff и открыть Pull Request; после merge повторить полный uNews CRC dry-run и завершить `0.3.7`.

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
