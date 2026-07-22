# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит живую текущую задачу и точку продолжения.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — ремонтируются все неопубликованные изображения `23.8.1–23.8.5` |
| Рабочая ветка | `fix/pending-publication-images-v23.8.1-v23.8.5` |
| Открытый Pull Request | ещё не открыт |
| Стабильный релиз | `v23.8.0` |
| Документационный и automation baseline | `v23.8.7` |
| Последнее завершённое изменение | PR #23, squash merge `7172d09f6f862927fd3ae4752ef17c7e5767b837`; main handoff `e21bc8b2288591dcfdc6ad2e3d9a2524bd47b0f6` |
| Уже опубликовано | `uDream 23.8.0`, Telegram message `54`, `https://t.me/uNewsLog/54` |
| Сохранённая работа | D1.1 branch commit `9527dff75971d86a634ab437618d26cc03c3c87a` |
| Активная задача | дать `23.8.1–23.8.5` пять уникальных, реальных и исторически точных GitHub-снимков; затем подтвердить uNews CRC-аудитом и Telegram FIFO |

## Текущая точка продолжения

Статус: `IN_PROGRESS`

Начато: `2026-07-22 Europe/Berlin`

Устройство/среда: `ChatGPT + GitHub connector + GitHub Actions + Playwright Chromium`

Ветка: `fix/pending-publication-images-v23.8.1-v23.8.5`

Pull Request: ещё не открыт

Цель: устранить все известные технические и содержательные дефекты неопубликованных изображений `23.8.1–23.8.5`, не меняя FIFO-идентичность патчноутов, runtime, PWA, базу, сохранённые версии или архив.

Планируемые изменения:

- `23.8.1` — заменить PNG с неверным CRC `PLTE` на реальный снимок GitHub Release `v23.8.0`;
- `23.8.2` — дать отдельный снимок исторического `VERSION.md` с release checkpoint;
- `23.8.3` — дать отдельный снимок исторического `docs/PRODUCT_VISION.md`;
- `23.8.4` — дать отдельный снимок исторического `docs/TRANSLATION_WORKFLOW.md`;
- `23.8.5` — дать отдельный снимок исторического `WORK_STATUS.md` baseline `ac7dfe6b`;
- сохранить точные `project`, `series`, `version` и `queued_at` каждого патчноута;
- добавить `image_source`, `image_target`, `image_commit`, `image_captured_at` и repair metadata;
- расширить CI для пакетного ремонта только неопубликованных изображений с сохранением FIFO-идентичности;
- пройти uDream validator и полный uNews byte/CRC dry-run;
- объединить repair PR и продолжить очередь без повторной отправки message `54`.

Критерии завершения:

- пять изображений уникальны и относятся к конкретным патчам;
- каждый PNG проходит сигнатуру, PNG chunk CRC, декодирование и размерные проверки;
- GitHub UI/документ на снимке соответствует историческому commit своего этапа;
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

- `uDream 23.8.0` успешно опубликован как Telegram message `54`; ключ и `published_at` сохранены, дубль исключён;
- uNews `0.3.6` настроил Git identity до publisher-step и защитил порядок source-check;
- полный uNews audit проверил все девять оставшихся pending-изображений;
- доказано: `23.8.1` и `23.8.2` используют один PNG с неверным CRC chunk `PLTE`;
- доказано: размеры повреждённого PNG `600×315`, но `pngcheck` и ImageMagick decode завершаются ошибкой;
- доказано: `23.8.3–23.8.5` технически декодируются, но повторно используют старое нерелевантное изображение;
- определены исторические commits: release target `24dece5`, release docs `de27596`, product vision `75e3e96`, translation `8adae19`, work status `ac7dfe6`;
- создана отдельная repair-ветка от актуального `main`;
- D1.1 остаётся сохранённым на паузе и не изменяется.

Последний проверенный commit:

- uDream `main`: `e21bc8b2288591dcfdc6ad2e3d9a2524bd47b0f6`;
- D1.1 pause commit: `9527dff75971d86a634ab437618d26cc03c3c87a`;
- uNews saved state commit after message 54: `ccd3b8b4400deef478411215bb8038de35742300`.

Следующий точный шаг:

- запустить один Playwright workflow, получить пять GitHub UI screenshots и provenance manifest; затем обновить пять существующих неопубликованных патчноутов и валидаторы.

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
