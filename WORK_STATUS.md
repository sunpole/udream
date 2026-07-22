# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит **живую незавершённую работу: что уже сделано, где остановились, что делает агент, что требуется от владельца и какой следующий точный шаг**.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — содержательная часть D1.1 почти завершена, но cleanup, проверки, реальный screenshot, patchnote и Pull Request ещё не закончены |
| Рабочая ветка | `docs/data-provenance-d1.1` |
| Открытый Pull Request | ещё не открыт |
| Стабильный функциональный релиз | `v23.8.0` |
| Текущий документационный/provenance baseline ветки | `v23.8.8` |
| Актуальный `main` | `acc91a1162521a35fcdd3d3cfbc11811f2988508` |
| Последний сохранённый branch commit до этого handoff | `76814693bab08ee0d3dfceddb9d47564536df274` |
| Синхронизация с `main` | ветка впереди `main` и не отстаёт: `behind_by: 0` |
| Внешний блокер uNews | устранён: Telegram FIFO завершён, pending `0`, errors `0`, Issue uNews №3 закрыт |
| Активная задача | завершить чистый D1.1 пакет и объединить его без изменения runtime, PWA или файлов данных |

## Текущая точка продолжения

Статус: `IN_PROGRESS`

Начато D1.1: `2026-07-22 10:48 Europe/Berlin`

Текущая среда: `ChatGPT + GitHub connector + GitHub Actions`

Ветка: `docs/data-provenance-d1.1`

Pull Request: ещё не открыт

Issue: `#19` — исходное техническое задание D1.1

Цель: восстановить настолько, насколько позволяют доказательства, происхождение и связь текущих файлов данных uDream; создать постоянный provenance-документ и validator; не менять содержимое активной базы, runtime, PWA, сохранённые версии или архивы.

## Что уже действительно сделано и сохранено в GitHub

- ветка `docs/data-provenance-d1.1` безопасно синхронизирована с актуальным `main`; evidence не потеряны;
- `main` является merge-base, ветка не отстаёт от него;
- повторно вычислены exact bytes, raw SHA-256, canonical JSON SHA-256, схема, количество записей и набор ID;
- создан исправленный отчёт `diagnostics/d1.1-corrected-evidence.{json,txt}`;
- создан постоянный документ `docs/DATA_PROVENANCE.md`;
- создан постоянный validator `scripts/validate-data-provenance.mjs`;
- provenance-validator подключён к `scripts/validate-project.mjs`;
- исправлены `README.md`, `docs/DATABASE_FORMAT.md`, `docs/PROJECT_STATE.md`, `docs/FILE_MAP.md`, `docs/TRANSLATION_WORKFLOW.md`;
- `VERSION.md` переведён на документационный/provenance baseline `23.8.8`, при этом приложение и tag остаются `v23.8.0`;
- `ROADMAP.md` отмечает D1.1 завершённым по содержанию и ставит D1.2 следующим этапом;
- все четыре поддерживаемых data-файла относительно `main` не изменены;
- runtime, PWA, `versions/` и `_archive/` не изменены.

## Исправленные факты — использовать только их

### `data/bd2.json` и `data/db.json`

- raw bytes различаются;
- raw SHA-256 различаются;
- parsed JSON полностью одинаков;
- canonical JSON полностью одинаков;
- все 4 086 записей, порядок, ID, поля и значения совпадают;
- это **две физические сериализации одного логического английского набора**, а не два перевода и не byte-for-byte duplicate.

Raw SHA-256:

```text
data/bd2.json  814c5d33444160e6f1ab20278f9356090ec0e9cc04943cd14ad99d9038be6e28
data/db.json   4e166959d318778be57557349a152c2b466ad9db14e5634f5e5df3c87ca2cdc0
```

Общий canonical JSON SHA-256:

```text
5ebe0d973f9cfd1c9db65a9d5abebe0ca16788261219299a710ed9fe78bb25d1
```

### Активная база

`data/divinity_code_ru.json`:

- 4 086 записей;
- SHA-256 `1def80216e238b0c2a8640aaf1b4e95dd0669d5944a67f4e7c4421fad55a6e64`;
- сохраняет те же ordered IDs `1–4086`;
- сохраняет `symbol`, `description`, `source`, `date_added`;
- отличается от английского логического набора в `aliases` у 4 083 записей и в `notes`/`tags` у всех 4 086 записей;
- точный generation/translation pipeline, prompt, provider sequence и human-review record остаются неизвестными.

### Ошибочные промежуточные выводы, которые запрещено использовать

Следующие старые утверждения были результатом дефектной промежуточной диагностики и опровергнуты:

- будто `bd2.json` и `db.json` отличаются по `tags` и `note` во всех/почти всех записях;
- будто активная русская база «ближе» к одному из этих файлов по полю `note`;
- будто `bd2.json` и `db.json` имеют одинаковый raw SHA-256 и являются byte-for-byte duplicate.

Причина одной ошибки: промежуточный скрипт проверял несуществующее поле `note`; фактическое поле называется `notes`.

Источник исправленных фактов: `docs/DATA_PROVENANCE.md`, `scripts/validate-data-provenance.mjs` и `diagnostics/d1.1-corrected-evidence.json`.

## Что ещё не завершено

1. Удалить пять одноразовых D1.1 workflows:
   - `.github/workflows/audit-data-provenance-d1.1.yml`;
   - `.github/workflows/compare-current-data-d1.1.yml`;
   - `.github/workflows/correct-data-provenance-d1.1.yml`;
   - `.github/workflows/extract-data-lineage-d1.1.yml`;
   - `.github/workflows/prepend-d1-1-changelog.yml`.
2. Перенести нужную changelog-запись `23.8.8` постоянным способом и удалить временный prepend-workflow.
3. После того как доказанные факты уже перенесены в постоянный документ, удалить временные `diagnostics/d1.1-*` файлы из итогового PR.
4. Проверить и при необходимости обновить `AGENTS.md`, чтобы любой агент обязан обновлять `WORK_STATUS.md` не только при старте/паузе, но после каждого существенного сохранённого этапа.
5. Создать D1.1 patchnote версии `23.8.8`.
6. Создать **новый реальный** screenshot, относящийся именно к provenance-документу/проверке, с точным source commit и UTC-временем; старое изображение не использовать.
7. Выполнить:

```bash
npm test
node scripts/validate-data-provenance.mjs
node scripts/validate-project.mjs
git diff --check
git diff --name-only origin/main...HEAD -- data versions _archive index.html script.js src manifest.json version.json sw.js package.json
```

8. Подтвердить, что diff не содержит data/runtime/PWA/saved-version/archive изменений.
9. Открыть D1.1 Pull Request, дождаться зелёных Actions и проверить полный diff.
10. Объединить PR, закрыть Issue #19 как completed.
11. На `main` записать `WORK_STATUS.md` со статусом `READY`, следующая задача — D1.2.

## Следующий точный шаг

Сначала удалить временный changelog-workflow и остальные одноразовые audit workflows, затем добавить постоянную changelog-запись `23.8.8`. После этого удалить временные diagnostics, обновить `AGENTS.md` и снова обновить этот handoff перед созданием screenshot/patchnote.

## Что делает ИИ сейчас

- самостоятельно очищает временную инфраструктуру;
- сохраняет каждую существенную точку в GitHub;
- поддерживает `WORK_STATUS.md` как живой handoff;
- создаёт и проверяет документацию, validator, screenshot, patchnote и Pull Request;
- не просит владельца выполнять доступные через подключённый GitHub рутинные действия.

## Что требуется от Антона сейчас

Никаких технических действий не требуется. Владелец подключается только если инструмент не позволяет выполнить действие, нужен секрет, физическая проверка на устройстве или содержательное человеческое решение.

## Запрещённые изменения в D1.1

- не менять `data/divinity_code_ru.json`, `data/bd2.json`, `data/db.json` или `data/report.txt`;
- не менять IDs, тексты или порядок 4 086 записей;
- не удалять и не переименовывать data-файлы;
- не менять runtime, PWA, Service Worker, package metadata, `versions/` или `_archive/`;
- не создавать database selector;
- не начинать D1.2 до merge D1.1;
- не выдавать предположение за доказанный факт;
- не использовать старые ошибочные intermediate conclusions.

## Продолжение с любого другого устройства или чата

```bash
git fetch origin
git switch docs/data-provenance-d1.1
git pull --ff-only origin docs/data-provenance-d1.1
git status --short --branch
git log -1 --oneline
cat WORK_STATUS.md
```

Затем проверить реальные GitHub facts: `main`, branch diff, открытые PR, Actions и Issue #19. При расхождении память ИИ или старого чата всегда проигрывает данным GitHub и этому актуальному handoff.

## Значения статуса

- `READY` — незавершённой задачи нет.
- `IN_PROGRESS` — задача начата и продолжается в указанной ветке.
- `PAUSED` — работа сохранена в GitHub и может быть продолжена.
- `BLOCKED` — продолжение невозможно до устранения препятствия.
- `COMPLETED` — реализация закончена, но handoff ещё должен быть финализирован.

## Главные правила

- Нельзя начинать новую крупную задачу при незавершённой работе без явного решения.
- Нельзя объявлять запланированное выполненным без diff, commit или проверки.
- После каждого существенного сохранённого этапа нужно обновить этот файл, если изменилась точка продолжения.
- Нельзя оставлять точку продолжения только в чате или локально.
- Старый чат, память ИИ и локальная ветка без push не являются источником истины.
