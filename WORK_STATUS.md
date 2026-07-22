# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, рабочего ПК, MacBook, другого устройства или любого ИИ-чата.

Он отвечает на пять вопросов:

1. Начата ли сейчас работа?
2. Какая цель и в какой ветке выполняется?
3. Что уже сделано фактически?
4. Где именно остановились?
5. Какой следующий точный шаг?

`ROADMAP.md` хранит общий план проекта, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит **живую точку передачи текущей работы**.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — реализация 23.8.7 завершена, выполняется финальная проверка Pull Request |
| Рабочая ветка | `ops/playwright-screenshots-v23.8.7` |
| Открытый Pull Request | draft `#22` — `ops: automate real Playwright screenshots v23.8.7` |
| Стабильный релиз | `v23.8.0` |
| Документационный и automation baseline | кандидат `v23.8.7` — реальные Chromium screenshot artifacts |
| Последнее завершённое изменение в `main` | PR #21, squash merge `58ebaea07ef488e0131bd9c3b5c359a191d6275e`; READY commit `b7d2bcebbf57cf9d99d1503e54310a43966ff290` |
| Активная задача | проверить final head PR #22, перевести PR из draft и объединить только после двух успешных workflow |
| Следующая утверждённая работа после merge | `D1.1` — происхождение данных без изменения активной базы |

## Текущая точка продолжения

Статус: `IN_PROGRESS`

Начато: `2026-07-22 09:55 Europe/Berlin`

Устройство/среда: `ChatGPT + GitHub connector + GitHub Actions + Playwright Chromium`

Ветка: `ops/playwright-screenshots-v23.8.7`

Pull Request: draft `#22`

Цель: добавить изолированную Playwright-систему, которая запускает точный checkout uDream в настоящем Chromium, проверяет ожидаемое состояние, создаёт desktop/mobile PNG и сохраняет их как GitHub Actions artifacts до визуального одобрения.

Планировалось:

- изолировать зависимости Playwright от публичного runtime;
- зафиксировать Playwright и lockfile;
- создать безопасный сценарный runner;
- добавить реальные desktop/mobile сценарии;
- запускать точный checkout через локальный HTTP-сервер;
- сохранять PNG, per-scenario provenance, manifest и test results как artifact;
- не разрешать постоянному workflow изменять репозиторий;
- добавить фактический патчноут и новый проверенный PNG;
- синхронизировать документацию;
- сохранить runtime, PWA и активную базу без изменений.

Планируемые файлы:

- `WORK_STATUS.md`
- `.gitignore`
- `.github/workflows/capture-screenshots.yml`
- `.github/workflows/validate.yml`
- `tools/screenshots/**`
- `scripts/validate-project.mjs`
- `scripts/validate-screenshot-tooling.mjs`
- `AGENTS.md`
- `README.md`
- `ROADMAP.md`
- `VERSION.md`
- `CHANGELOG.md`
- `docs/PROJECT_STATE.md`
- `docs/FILE_MAP.md`
- `docs/SCREENSHOT_AUTOMATION.md`
- `docs/NEWS_PUBLISHING.md`
- новый uNews-патчноут и новый Playwright PNG

Критерии завершения:

- GitHub Actions устанавливает package через `npm ci`;
- Chromium и системные зависимости устанавливаются официальной командой Playwright;
- сценарии работают с одним worker;
- точный checkout поднимается через локальный HTTP-сервер;
- каждый сценарий выполняет assertions до capture;
- создаются desktop и mobile изображения;
- artifact содержит PNG, entries, manifest, results и trace при ошибке;
- manifest сохраняет все успешные сценарии даже при retry;
- постоянный workflow имеет только `contents: read`;
- screenshot tooling отсутствует в browser bundle;
- активная база остаётся на 4 086 записях;
- новый патчноут использует новый визуально проверенный PNG;
- основной validator и Chromium workflow проходят на final head;
- после merge `WORK_STATUS.md` возвращается в `READY`, следующий шаг — D1.1.

Уже сделано:

- создан отдельный package `tools/screenshots/`;
- `@playwright/test`, `playwright` и `playwright-core` закреплены на `1.61.1`;
- создан read-only workflow `capture-screenshots.yml`;
- создан JSON-runner без произвольного JavaScript;
- добавлены четыре сценария: homepage desktop, `water` desktop/mobile, `вода` mobile;
- добавлена безопасная очистка `artifacts/screenshots/`;
- добавлены PNG signature, dimensions и minimum-size checks;
- manifest собирается из per-scenario entries и не теряет успешные результаты при retry;
- первый неполный run выявил две реальные ошибки runner: strict assertion для множества алиасов и потерю manifest entries при retry;
- обе ошибки исправлены, не скрыты и повторно проверены;
- полный Chromium-run для commit `34d2b13c2e0f16b597572701485df24a538609c8` прошёл четыре из четырёх сценариев;
- artifact скачан, manifest проверен и все четыре PNG визуально открыты;
- для патчноута выбран mobile-сценарий `russian-alias-mobile`;
- выбранный PNG повторно создан из commit `d6cb082d8d1aa1990d26a9a5f72e6e61ae56fb47` в `2026-07-22T08:22:53Z`;
- PNG имеет размер `390×844`, 108 002 байта и корректную PNG-сигнатуру;
- provenance сохранена в `tools/screenshots/v23.8.7-selected-image.json`;
- добавлен патчноут `news/2026-07-22-udream-v23-8-7-playwright-screenshots.md`;
- синхронизированы VERSION, CHANGELOG, README, ROADMAP, PROJECT_STATE, FILE_MAP, AGENTS, NEWS_PUBLISHING и SCREENSHOT_AUTOMATION;
- PR #22 содержит 28 ожидаемых файлов;
- runtime, PWA, root package metadata, `data/`, `versions/` и `_archive/` отсутствуют в diff;
- основной `Validate uDream` уже прошёл на commit `3fa856e00b496d786d1ee5cec8c9d9c35b65a6e7`.

Последний проверенный commit:

- `3fa856e00b496d786d1ee5cec8c9d9c35b65a6e7` — основной validator success; Chromium final-head run выполнялся до этого handoff commit.

Следующий точный шаг:

- дождаться `Validate uDream` и `Capture uDream screenshots` для нового final head; если оба успешны, обновить PR #22, перевести его из draft, объединить squash merge и вернуть `WORK_STATUS.md` в `READY` на `main`.

Что нельзя делать при продолжении:

- не создавать параллельную ветку для `23.8.7`;
- не начинать D1.1 до завершения PR #22;
- не добавлять Playwright в корневые runtime-зависимости;
- не импортировать screenshot tooling из `script.js`, `src/` или `sw.js`;
- не коммитить browser binaries и временные artifacts;
- не менять активную базу, ID или переводы;
- не переиспользовать старый PNG;
- не объединять PR при неуспешном основном validator или Chromium workflow.

## Обязательный порядок перед началом работы

На любом устройстве или у любого нового агента:

```bash
git switch main
git pull --ff-only origin main
cat WORK_STATUS.md
```

Затем обязательно:

1. проверить открытые Pull Request и последние commits;
2. при `IN_PROGRESS`, `PAUSED` или `BLOCKED` продолжать только указанную ветку и задачу;
3. при `READY` создать отдельную ветку для следующей утверждённой работы;
4. до первого существенного изменения обновить этот файл до `IN_PROGRESS` и отправить handoff в GitHub;
5. зафиксировать цель, планируемые файлы, критерии завершения и первый точный шаг;
6. только после этого изменять проект.

## Как зафиксировать паузу

Если работу нельзя закончить на текущем устройстве, нельзя оставлять только фразу «продолжить позже». Нужно записать:

```text
Статус: PAUSED или BLOCKED
Что фактически сделано:
- ...

Что не сделано:
- ...

Почему остановились:
- ...

Последний commit:
- ...

Незакоммиченные изменения:
- нет | точный список

Следующий точный шаг:
- конкретное действие или команда

Что нельзя делать при продолжении:
- ...
```

При паузе изменения этого файла должны быть закоммичены и отправлены в GitHub. Локальная незапушенная запись не является передачей работы между устройствами.

## Как завершить задачу

Перед завершением обновить файл фактическими данными:

```text
Статус: COMPLETED
Планировалось:
- ...

Сделано фактически:
- ...

Не вошло в задачу:
- ...

Изменённые файлы:
- ...

Проверки:
- команда — результат

Pull Request / merge:
- ...

Релиз / версия:
- ...

Оставшиеся риски:
- ...

Следующая утверждённая работа:
- ...
```

После merge вернуть верхний быстрый сигнал в состояние `READY`, указать последний завершённый PR/commit и следующий утверждённый шаг.

## Значения статуса

- `READY` — незавершённой задачи нет, можно начинать следующую утверждённую работу.
- `IN_PROGRESS` — задача начата и продолжается в указанной ветке.
- `PAUSED` — работа сохранена в GitHub и может быть продолжена с другого устройства.
- `BLOCKED` — продолжение невозможно до устранения явно записанного препятствия.
- `COMPLETED` — реализация закончена, но перед возвратом к `READY` должны быть записаны проверки, PR/merge и следующий шаг.

## Главные правила

- Нельзя начинать новую крупную задачу, если здесь записана незавершённая `IN_PROGRESS`, `PAUSED` или `BLOCKED` работа, пока не принято явное решение продолжить или закрыть её.
- Нельзя объявлять запланированное выполненным без diff, commit или проверки.
- Нельзя оставлять точку продолжения только в чате, на одном устройстве или в локальном терминале.
- Старый чат, память ИИ и локальная ветка без push не являются источником истины.
- Pull Request подробно объясняет конкретный patch, но `WORK_STATUS.md` показывает общую текущую точку проекта.
- При конфликте этого файла с GitHub фактами приоритет имеют `main`, открытый Pull Request и реальные commits; конфликт нужно сразу исправить в этом файле.
