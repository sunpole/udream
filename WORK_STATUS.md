# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит живую текущую задачу и точный следующий шаг.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — D1.3 audit core и deterministic reports созданы; продолжается CI/documentation/publication package |
| Начато | `2026-07-23 08:47 Europe/Berlin` |
| Среда | `ChatGPT + GitHub connector + GitHub Actions` |
| Рабочая ветка | `audit/d1.3-data-quality-v23.8.10` |
| Открытый Pull Request | `#29` — `https://github.com/sunpole/udream/pull/29` |
| Issue | `#28` — D1.3 data-quality audit |
| Стабильный функциональный релиз | `v23.8.0` |
| Текущий baseline | `23.8.9` — D1.2 dataset registry завершён |
| Последний проверенный branch head | `0090584fc714d0ebe75e4fef463cdd7a253dbf6e` |
| Активная база | `data/divinity_code_ru.json`, 4 086 записей; не изменена |

Цель: спроектировать и выполнить воспроизводимый неразрушающий аудит качества зарегистрированных source/current datasets, создать permanent audit script и deterministic machine/human reports, не исправляя и не перезаписывая данные.

## Что уже сделано фактически

- создан `scripts/audit-data-quality.mjs`;
- создан `docs/DATA_QUALITY_AUDIT.md` с severity model, rules, determinism и limitations;
- GitHub Actions выполнил audit на реальных зарегистрированных datasets;
- созданы byte-deterministic reports `reports/data-quality-audit.json` и `reports/data-quality-audit.md`;
- audit охватывает `source-divinity-code-en` и `ru-current-v1`;
- оба набора содержат 4 086 unique ordered IDs `1–4086`;
- source/current IDs aligned;
- preserved fields `id`, `symbol`, `description`, `source`, `date_added` имеют 0 differences;
- ожидаемые changed-field counts: aliases 4 083, notes 4 086, tags 4 086;
- structural gate: PASS;
- structural errors: 0;
- warnings: 0;
- human-review instances: 5 022 в 5 aggregated groups;
- findings не исправлялись и не объявлены доказанными content errors;
- одноразовый report-generation workflow удалён после commit reports;
- draft PR №29 открыт;
- existing data files, runtime, PWA, package metadata, `versions/` и `_archive/` не изменены.

## Фактические audit findings

| Rule | Dataset | Count | Classification |
|---|---|---:|---|
| alias collision across records | `ru-current-v1` | 854 | human/source review |
| alias matches another primary symbol | `ru-current-v1` | 1 145 | routing review |
| alias collision across records | `source-divinity-code-en` | 693 | human/source review |
| alias matches another primary symbol | `source-divinity-code-en` | 1 145 | routing review |
| empty notes | `source-divinity-code-en` | 1 185 | review; may be intentional source structure |

Эти counts не означают 5 022 доказанных ошибок: один record может входить в несколько aggregated findings, а shared aliases могут быть намеренными.

## Планируемые файлы

Планируемые файлы:

- `scripts/audit-data-quality.mjs`;
- `docs/DATA_QUALITY_AUDIT.md`;
- `reports/data-quality-audit.json`;
- `reports/data-quality-audit.md`;
- `.github/workflows/validate.yml`;
- `README.md`;
- `VERSION.md`;
- `CHANGELOG.md`;
- `ROADMAP.md`;
- `docs/PROJECT_STATE.md`;
- `docs/FILE_MAP.md`;
- `docs/DATABASE_FORMAT.md`;
- `AGENTS.md`;
- `WORK_STATUS.md`;
- новый factual patchnote `23.8.10` и новое real report/document image.

## Критерии завершения

Критерии завершения:

- audit охватывает logical datasets `source-divinity-code-en` и `ru-current-v1`;
- все 4 086 IDs проверяются без изменения data files;
- structural errors, warnings, human-review findings и info statistics разделены;
- report rules и limitations документированы;
- JSON и Markdown reports deterministic и проверяются CI;
- source/current alignment и preserved-field equality проверяются;
- эвристика не выдаётся за доказанную content error;
- existing data files, runtime, PWA, package metadata, `versions/` и `_archive/` отсутствуют в diff;
- provenance, registry, audit и project validators проходят;
- GitHub Actions зелёные;
- factual patchnote и новое изображение соответствуют D1.3;
- PR объединён, Issue #28 закрыт, `main/WORK_STATUS.md` возвращён в `READY`;
- следующая задача — D1.4 two-book product architecture.

## Следующий точный шаг

Подключить `node scripts/audit-data-quality.mjs --check` к permanent CI, синхронизировать поддерживаемую документацию с factual report, затем создать patchnote `23.8.10` и новое real report image.

## Главные запреты

- не менять `data/bd2.json`, `data/db.json`, `data/divinity_code_ru.json` или `data/report.txt`;
- не менять IDs, тексты, aliases, notes, tags или record order;
- не выполнять physical migration;
- не исправлять findings в этом PR;
- не добавлять database selector;
- не начинать D1.4 или D1.5;
- не считать heuristic finding доказанной смысловой ошибкой;
- не объединять PR при красных или незавершённых проверках.

## Источник истины

Реальные GitHub-факты — `main`, текущая ветка, commits, Pull Request, Actions и Issues — имеют приоритет над памятью ИИ, старыми чатами и локальными незапушенными изменениями.