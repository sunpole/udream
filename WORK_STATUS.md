# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, рабочего ПК, MacBook, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит живую текущую задачу и точку продолжения.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — hotfix готов, выполняется финальная проверка PR №23 |
| Рабочая ветка | `fix/unews-pwa-image-v23.8.0` |
| Открытый Pull Request | `#23` — `fix: replace invalid v23.8.0 Telegram image` |
| Стабильный релиз | `v23.8.0` |
| Документационный и automation baseline | `v23.8.7` |
| Последнее завершённое изменение в `main` | PR #22, squash merge `464b61cf7df8f27ba14bb9a4cf5ed50c8479cef8`; READY commit `422972a3dd497801156d7345be67e7cecdd9de60` |
| Сохранённая параллельно работа | D1.1 поставлен на `PAUSED` в ветке `docs/data-provenance-d1.1`, commit `9527dff75971d86a634ab437618d26cc03c3c87a` |
| Активная задача | объединить PR №23, подтвердить Telegram-публикацию всей FIFO-очереди и вернуть D1.1 в работу |

## Текущая точка продолжения

Статус: `IN_PROGRESS`

Начато: `2026-07-22 Europe/Berlin`

Устройство/среда: `ChatGPT + GitHub connector + GitHub Actions + Playwright Chromium`

Ветка: `fix/unews-pwa-image-v23.8.0`

Pull Request: `#23`

Цель: заменить повреждённый файл `news/2026-07-20-udream-v23-8-0-pwa-update.png`, который имел расширение PNG без PNG-сигнатуры и был отклонён Telegram с `IMAGE_PROCESS_FAILED`; сохранить тот же FIFO-ключ, версию, `queued_at` и имя изображения; не создавать дублирующий Telegram-пост.

Планируемые файлы:

- `WORK_STATUS.md`
- `news/2026-07-20-udream-v23-8-0-pwa-update.md`
- `news/2026-07-20-udream-v23-8-0-pwa-update.png`
- `tools/screenshots/v23.8.0-pwa-image-repair.json`
- `scripts/validate-patchnote-diff.mjs`
- `scripts/validate-project.mjs`
- `docs/NEWS_PUBLISHING.md`

Критерии завершения:

- новый файл имеет настоящую PNG-сигнатуру и размер не менее 10 000 байт;
- мобильный Chromium подтверждает runtime `v23.8.0`, заголовок баннера установки и раскрытую ручную инструкцию;
- патчноут сохраняет прежние `project`, `series`, `version`, `queued_at` и имя изображения;
- provenance содержит exact source commit и UTC-время;
- CI допускает только доказанный ремонт ранее невалидного изображения, а не произвольную замену существующих публикаций;
- тесты и валидаторы проходят;
- runtime, PWA, база, package metadata, `versions/` и `_archive/` не изменены;
- hotfix объединён в `main`;
- uNews повторно запущен и записал `message_id`, `post_url`, `published_at` для ожидающих записей;
- `data/health.json` uNews показывает success, а служебный Issue закрыт;
- после этого D1.1 возвращён из `PAUSED` в `IN_PROGRESS` в прежней ветке.

Уже сделано:

- uNews обновлён до `0.3.5`, PR #4 объединён commit `cf69fe7f0264a64709177e674cbd8fec8c5df64c`;
- новый uNews workflow впервые сохранил точную фатальную причину вместо тихого сбоя;
- доказано, что старый файл `23.8.0` не имел PNG-сигнатуры;
- Playwright Chromium создал новый мобильный PNG `390×844`, 102 637 байт;
- capture подтвердил `v23.8.0`, текст «Установите UDREAM на телефон» и видимость ручной инструкции;
- provenance сохранена в `tools/screenshots/v23.8.0-pwa-image-repair.json`;
- существующий неопубликованный патчноут обновлён без изменения FIFO-идентичности;
- PR-validator доказывает неверную сигнатуру базового файла и неизменность FIFO-полей;
- project validator постоянно проверяет repaired image и provenance;
- публикационная инструкция описывает узкое исключение без создания дубля;
- одноразовый capture-workflow удалён;
- PR №23 открыт, changed files: 7;
- `Validate uDream` run №76 — success;
- regression tests, database, WORK_STATUS, screenshot tooling, repair-mode и JavaScript syntax — success;
- `Capture uDream screenshots` run №22 — success;
- runtime, PWA, package metadata, база, `versions/` и `_archive/` отсутствуют в diff.

Последний проверенный commit:

- source capture commit `5f7af86864134b608402e8cf2dc9db4071071b64`;
- screenshot capture time `2026-07-22T09:47:22Z`;
- проверенный PR head перед этим handoff: `0f07dee3010d25a9cbfd0108e5a6716aa11e1342`.

Следующий точный шаг:

- дождаться повторных GitHub Actions на новом head; при успехе объединить PR №23, вернуть `WORK_STATUS.md` в `READY` на `main`, перезапустить uNews и проверить каждый Telegram checkpoint; затем продолжить D1.1.

Что нельзя делать при продолжении:

- не менять runtime, PWA, Service Worker, package metadata или базу;
- не менять версию, `queued_at`, project, series или имя изображения старого патчноута;
- не создавать новый дублирующий патчноут только ради ремонта ещё не опубликованного файла;
- не обходить `23.8.0` публикацией `23.8.1–23.8.7`;
- не начинать новую ветку D1.1;
- не удалять сохранённую ветку `docs/data-provenance-d1.1`.

## Обязательный порядок работы

На новом устройстве или в новом чате сначала проверить реальные GitHub-факты, этот файл, открытые Pull Request и последние commits. При `IN_PROGRESS`, `PAUSED` или `BLOCKED` продолжать только указанную ветку и задачу. Старые чаты, память ИИ и незапушенные локальные изменения не являются источником истины.

## Значения статуса

- `READY` — незавершённой задачи нет.
- `IN_PROGRESS` — задача выполняется в указанной ветке.
- `PAUSED` — работа сохранена в GitHub и может быть продолжена.
- `BLOCKED` — продолжение невозможно до устранения препятствия.
- `COMPLETED` — реализация закончена, но handoff ещё должен быть финализирован.

При конфликте `WORK_STATUS.md` с GitHub фактами приоритет имеют `main`, открытые Pull Request, commits, tags, Releases и Actions results; файл нужно исправить немедленно.
