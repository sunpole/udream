# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, рабочего ПК, MacBook, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план проекта, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит **живую точку передачи текущей работы**.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — D1.1 возобновлён после полного восстановления Telegram FIFO |
| Рабочая ветка | `docs/data-provenance-d1.1` |
| Открытый Pull Request | ещё не открыт |
| Стабильный релиз | `v23.8.0` |
| Документационный и automation baseline | `v23.8.7` |
| Актуальный `main` | `acc91a1162521a35fcdd3d3cfbc11811f2988508` — repair PR #24 |
| Сохранённая D1.1 точка | `9527dff75971d86a634ab437618d26cc03c3c87a` |
| Внешний блокер | устранён: uNews `0.3.7`, messages `54–64`, pending `0`, errors `0`, Issue №3 закрыт |
| Активная задача | синхронизировать evidence-ветку с `main`, оформить постоянный provenance-документ и validator без изменения данных |

## Текущая точка продолжения

Статус: `IN_PROGRESS`

Начато D1.1: `2026-07-22 10:48 Europe/Berlin`

Возобновлено: `2026-07-22 после 11:56 Europe/Berlin`

Устройство/среда: `ChatGPT + GitHub connector + GitHub Actions`

Ветка: `docs/data-provenance-d1.1`

Pull Request: ещё не открыт

Issue: `#19` — техническое задание D1.1

Цель: восстановить настолько, насколько позволяют доказательства, происхождение, историю создания и связь текущих файлов данных uDream; создать `docs/DATA_PROVENANCE.md`; не менять содержимое активной базы, runtime, PWA, сохранённые версии или архивы.

## Почему работа снова разрешена

Telegram-публикационная часть завершена и больше не блокирует D1.1:

- uDream PR #24 заменил повреждённые и нерелевантные pending-изображения; merge commit `acc91a1162521a35fcdd3d3cfbc11811f2988508`;
- uNews PR #6 выпустил `0.3.7` с GET, deep image validation, PNG CRC/zlib и Blob upload; merge commit `b7c0c279546b4eaddffb7788cc3e042fc1e14c81`;
- actual-main dry-run: 35 проектов, 10 pending, 10 ready, 0 errors;
- реальная очередь опубликовала uDream `23.8.1–23.8.7` как messages `55–61`;
- uNews `0.3.5–0.3.7` опубликованы как messages `62–64`;
- ранее восстановленный uDream `23.8.0` остался message `54` и не был продублирован;
- `data/health.json` uNews: `success`, pending `0`, error count `0`, `last_error: null`;
- `data/errors.json`: `[]`;
- служебный uNews Issue №3 закрыт автоматически как completed;
- полный uNews recovery-документ объединён commit `017636eeb9ecfbd0ead33ece332446b9f62a36f4`.

## Что фактически сделано в D1.1 до паузы

- создана ветка `docs/data-provenance-d1.1` и ранний handoff;
- GitHub Actions собрал byte-level inventory файлов `data/` и архивных материалов;
- вычислены текущие SHA-256, размеры и структура трёх JSON-наборов;
- подтверждено, что все три JSON имеют одинаковый набор 4 086 ID;
- опровергнуто прежнее утверждение о байтовом равенстве `data/bd2.json` и `data/db.json`;
- доказано, что `bd2.json` и `db.json` различаются во всех 4 086 записях: у всех записей отличаются `tags`, у 3 935 — `note`;
- подтверждено, что поля `id`, `symbol`, `aliases`, `description`, `source` у `bd2.json` и `db.json` совпадают;
- активная русская база по полю `note` значительно ближе к `db.json`: 3 888 совпадений против 93 совпадений с `bd2.json`;
- собраны Git history, historical snapshots, reference hits и candidate scripts/reports;
- `data/report.txt` классифицирован как исторический отчёт качества, но не как доказательство точного pipeline перевода;
- активные data-файлы, runtime, PWA, `versions/` и `_archive/` не изменялись.

## Планируемые файлы

- `WORK_STATUS.md`;
- `docs/DATA_PROVENANCE.md`;
- `docs/DATABASE_FORMAT.md`;
- `docs/FILE_MAP.md`;
- `docs/PROJECT_STATE.md`;
- `README.md`;
- `ROADMAP.md`;
- `VERSION.md`;
- `CHANGELOG.md`;
- `scripts/validate-data-provenance.mjs`;
- `scripts/validate-project.mjs`;
- D1.1 патчноут и новый реальный проверенный PNG.

Файлы исследования, которые нельзя изменять:

- `data/divinity_code_ru.json`;
- `data/bd2.json`;
- `data/db.json`;
- `data/report.txt`;
- `_archive/old-data/**`;
- `_archive/source-files/**`;
- `versions/**`;
- runtime и PWA-файлы.

## Критерии завершения

- создан `docs/DATA_PROVENANCE.md`;
- для каждого текущего data-файла записаны доказанные hash, размер, язык/роль и известная история;
- различия `bd2.json` и `db.json` описаны по актуальным hash и byte/record comparison;
- происхождение активной русской базы описано без выдачи предположений за факты;
- сведения разделены на «Доказано», «Обоснованно предполагается» и «Неизвестно»;
- предложено каноническое имя исходного набора, но ничего не удалено и не переименовано;
- постоянный provenance-validator подтверждает неизменность ожидаемых файлов и доказательств;
- активная база остаётся на 4 086 записях с теми же bytes и hash;
- runtime, PWA, `versions/` и `_archive/` отсутствуют в diff;
- одноразовые diagnostic workflows и временные evidence-файлы удалены после переноса фактов в постоянные документы;
- новый патчноут использует новый реальный проверенный PNG;
- GitHub Actions проходит;
- после merge Issue #19 закрыт, `WORK_STATUS.md` возвращён в `READY`, следующий шаг — D1.2.

## Что ещё не сделано

- ветка D1.1 ещё не синхронизирована с актуальным `main` после PR #24;
- не создан окончательный `docs/DATA_PROVENANCE.md`;
- не создан постоянный `scripts/validate-data-provenance.mjs`;
- не исправлены старые документы, называющие `bd2.json` и `db.json` дубликатами;
- не удалены одноразовые D1.1 diagnostic workflows и временные evidence-файлы;
- не создан D1.1 патчноут и реальный PNG;
- не открыт D1.1 Pull Request.

## Последний проверенный commit

- D1.1 branch до возобновления: `9527dff75971d86a634ab437618d26cc03c3c87a`;
- uDream `main`: `acc91a1162521a35fcdd3d3cfbc11811f2988508`;
- uNews final state: `064cbde39ca3c46cf746bcce65027eef517f45ef`;
- uNews final documentation: `017636eeb9ecfbd0ead33ece332446b9f62a36f4`.

## Следующий точный шаг

1. сравнить `docs/data-provenance-d1.1` с актуальным `main` и перечислить конфликты до синхронизации;
2. сохранить все доказательные D1.1 файлы и их provenance;
3. синхронизировать ветку с `main` без перезаписи уже собранных evidence;
4. проверить, какие temporary workflows/reports действительно одноразовые;
5. перенести подтверждённые факты в первый постоянный черновик `docs/DATA_PROVENANCE.md`;
6. только после этого удалить временную диагностику и создать постоянный validator.

## Что нельзя делать при продолжении

- не создавать новую реализацию D1.1 в другой ветке;
- не удалять ветку `docs/data-provenance-d1.1`;
- не force-reset ветку на `main`, потому что это уничтожит уже собранные evidence;
- не менять `data/divinity_code_ru.json`, его 4 086 записей, ID и тексты;
- не удалять и не переименовывать `data/bd2.json`, `data/db.json`, отчёты и архивные варианты;
- не менять runtime, PWA, `versions/` и `_archive/` в рамках D1.1;
- не начинать D1.2 до завершения и merge D1.1;
- не описывать предположение как доказанный факт;
- не удалять diagnostic evidence до переноса фактов в постоянный документ.

## Обязательный порядок перед началом работы

На любом устройстве или у любого нового агента:

```bash
git fetch origin
git switch docs/data-provenance-d1.1
git status --short
cat WORK_STATUS.md
```

Затем обязательно проверить `main`, открытые Pull Request, commits и diff ветки. При конфликте handoff с GitHub фактами приоритет имеют реальные GitHub commits, Actions, `data/published.json`, `data/health.json` и Telegram `post_url`.

## Значения статуса

- `READY` — незавершённой задачи нет.
- `IN_PROGRESS` — задача начата и продолжается в указанной ветке.
- `PAUSED` — работа сохранена в GitHub и может быть продолжена.
- `BLOCKED` — продолжение невозможно до устранения препятствия.
- `COMPLETED` — реализация закончена, но handoff ещё должен быть финализирован.

## Главные правила

- Нельзя начинать новую крупную задачу при незавершённой работе без явного решения.
- Нельзя объявлять запланированное выполненным без diff, commit или проверки.
- Нельзя оставлять точку продолжения только в чате или локально.
- Старый чат, память ИИ и локальная ветка без push не являются источником истины.
