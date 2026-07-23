# WORK_STATUS — передача работы между устройствами

Этот файл — единая оперативная точка продолжения разработки uDream с телефона, Windows, macOS, другого устройства или любого ИИ-чата.

`ROADMAP.md` хранит общий план, `docs/PROJECT_STATE.md` — проверенное состояние продукта, а этот файл хранит живую текущую задачу и точный следующий шаг.

## Быстрый сигнал

| Поле | Текущее значение |
|---|---|
| Состояние | **IN_PROGRESS** — начат D1.3 non-destructive data-quality audit |
| Начато | `2026-07-23 08:47 Europe/Berlin` |
| Среда | `ChatGPT + GitHub connector + GitHub Actions` |
| Рабочая ветка | `audit/d1.3-data-quality-v23.8.10` |
| Открытый Pull Request | ещё не открыт |
| Issue | `#28` — D1.3 data-quality audit |
| Стабильный функциональный релиз | `v23.8.0` |
| Текущий baseline | `23.8.9` — D1.2 dataset registry завершён |
| Последний подтверждённый main перед стартом | `4fae1d8dd13c345bd3cf459f0c896891e64e497b` |
| Активная база | `data/divinity_code_ru.json`, 4 086 записей; менять запрещено |

Цель: спроектировать и выполнить воспроизводимый неразрушающий аудит качества зарегистрированных source/current datasets, создать permanent audit script и deterministic machine/human reports, не исправляя и не перезаписывая данные.

Последний проверенный commit: `4fae1d8dd13c345bd3cf459f0c896891e64e497b` — D1.2 завершён, main READY, Issue #28 создан.

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
- существующие data files, runtime, PWA, package metadata, `versions/` и `_archive/` отсутствуют в diff;
- provenance, registry, audit и project validators проходят;
- GitHub Actions зелёные;
- factual patchnote и новое изображение соответствуют D1.3;
- PR объединён, Issue #28 закрыт, `main/WORK_STATUS.md` возвращён в `READY`;
- следующая задача — D1.4 two-book product architecture.

## Следующий точный шаг

Создать audit specification и permanent deterministic audit script. Затем через GitHub Actions сгенерировать reports из реальных зарегистрированных datasets и зафиксировать фактические counts/findings.

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
