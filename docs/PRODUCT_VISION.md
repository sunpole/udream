# Видение продукта uDream

## Миссия

uDream превращает трудоёмкий ручной поиск по христианской литературе о снах и видениях в быстрый, понятный и проверяемый мобильный справочник.

Проект помогает:

- найти символ, синоним или связанную тему;
- увидеть толкование и источник;
- различать книги, редакции и переводы;
- возвращаться к просмотренным карточкам;
- пользоваться справочником как сайтом и PWA;
- сохранять доступ к проверенным прежним версиям.

uDream является поисковым интерфейсом к источникам, а не заменой книг и не официальным изданием их содержания.

## Для кого создаётся продукт

Основной сценарий — человек открывает uDream на телефоне, вводит слово из сна и быстро получает подходящие карточки без просмотра больших PDF-файлов.

Дополнительные сценарии:

- изучение связанных символов и библейских ссылок;
- сравнение толкований из разных источников;
- повторное открытие карточек из локальной истории;
- работа после установки PWA;
- безопасная подготовка и проверка новых вариантов данных.

## Конечный образ продукта

Завершённый uDream должен включать:

1. быстрый предсказуемый поиск;
2. понятное указание источника каждого толкования;
3. поддержку двух книг без потери происхождения;
4. безопасный выбор базы/перевода или согласованный объединённый поиск;
5. мобильный, доступный и устанавливаемый интерфейс;
6. воспроизводимый процесс подготовки, перевода, проверки и публикации данных;
7. административный процесс вне риска для публичной базы;
8. неизменяемые релизы и понятный откат;
9. автоматические тесты данных, поиска, PWA и запуска;
10. прозрачные правила прав и происхождения материалов.

## Текущее состояние

Стабильная версия `v23.8.0` предоставляет:

- статический сайт на GitHub Pages;
- PWA с безопасным обновлением;
- активную базу из 4 086 записей;
- поиск, релевантность, строгие фильтры и русские алиасы;
- историю, темы, RU/EN-интерфейс и sharing;
- ES Modules без сборщика и сервера;
- тесты, валидаторы, GitHub Actions и uNews;
- неизменяемые релизы и runnable fallback.

Data baseline `23.8.10` дополнительно фиксирует:

- доказанное происхождение текущих файлов;
- stable logical/physical dataset IDs;
- canonical и retained equivalent английские сериализации;
- current localized dataset;
- machine-readable registry и permanent validators;
- deterministic read-only quality reports;
- passing structural audit gate без изменения данных.

## Обязательная стратегия данных

### Никаких разрушительных замен

Ни одна база, редакция или версия перевода не должна молча перезаписывать другую.

Для каждого набора сохраняются:

- stable logical dataset ID;
- stable physical file IDs;
- source/book и language;
- version/date;
- получение и transformation method;
- exact hashes;
- validation/review status;
- связь с предыдущими версиями.

### Текущие идентификаторы

```text
source-divinity-code-en
ru-current-v1

source-divinity-code-en-bd2  -> data/bd2.json
source-divinity-code-en-db   -> data/db.json
ru-current-v1-runtime        -> data/divinity_code_ru.json
```

`data/bd2.json` и `data/db.json` — raw-distinct сериализации одного canonical JSON. `data/bd2.json` выбран canonical maintained serialization как project-governance decision, а не доказанный исторический оригинал. `data/db.json` остаётся retained equivalent compatibility serialization.

```text
physical migration: planned-not-executed
remove_or_rename_approved: false
```

### Сохранение переводов

Новый перевод получает новый dataset ID и physical file. Прежний вариант остаётся recoverable.

Запрещено:

- массово менять опубликованный перевод без data release;
- смешивать источник, перевод и редакторские дополнения без маркировки;
- удалять старый вариант только из-за появления нового;
- менять stable IDs без migration.

Целевая модель:

1. один canonical source dataset;
2. один current localized dataset;
3. до двух действительно независимых альтернативных русских переводов;
4. меньше вариантов, если качественно существует только один перевод.

### AI как вспомогательный инструмент

DeepSeek или другой API может создать только отдельный candidate dataset. Результат не считается автоматически правильным или опубликованным.

API key не попадает в браузер, JSON, Git, патчноуты, screenshots или logs. Каждый запуск фиксирует source hash, candidate ID, model, prompt version, parameters, output hash, validation и human review.

### Две исходные книги

До утверждения D1.4 материалы двух книг должны оставаться различимыми.

Возможные будущие режимы:

- поиск по одной книге;
- поиск по выбранной редакции/переводу;
- объединённый поиск с visible provenance;
- side-by-side comparison.

Объединённый индекс не должен уничтожать отдельные source datasets.

## Проверяемость данных

D1.3 добавил deterministic read-only audit:

```text
scripts/audit-data-quality.mjs
reports/data-quality-audit.json
reports/data-quality-audit.md
```

Подтверждено:

- 4 086 unique ordered IDs в source/current datasets;
- полное ID alignment;
- 0 preserved-field differences;
- 0 structural errors и 0 warnings;
- 5 022 overlapping human-review instances в пяти aggregated groups.

Review findings — не доказанные content errors. Audit не исправляет данные. Любая коррекция требует отдельного evidence-based data PR и human review.

## Технические принципы

- GitHub `main` — источник опубликованного сайта.
- Tags/Releases — неизменяемые restoration points.
- Проект остаётся статическим, пока backend не доказан задачей.
- JavaScript ES Modules, JSDoc и `@ts-check` остаются основой.
- UI, data, PWA, architecture и content corrections выполняются раздельно.
- Исторические каталоги, PDFs и saved versions не удаляются как cleanup.
- Секреты и персональные данные не хранятся в репозитории.
- Утверждения о проверке должны соответствовать реально выполненным checks.

## Готовность к следующему этапу

После D1.3 baseline `23.8.10`:

- documentation согласована с runtime;
- current release и restoration SHA зафиксированы;
- provenance, registry и quality reports воспроизводимы;
- open work разделено на next phase и backlog;
- protected data не изменены;
- next phase имеет отдельную architecture-only границу.

## Следующий этап

Следующая утверждённая задача — **D1.4: two-book product architecture**.

D1.4 должна:

1. идентифицировать и зарегистрировать вторую книгу настолько, насколько позволяет evidence;
2. сравнить switching, combined search и side-by-side comparison;
3. определить visible provenance для каждого результата;
4. определить dataset-aware history, sharing и deep links;
5. определить validation, reload, cache-clearing и automatic fallback contracts;
6. подготовить migration/rollback plan;
7. не реализовывать selector без отдельной functional phase.

После D1.4 отдельно выполняется D1.5 AI-assisted translation experiment.

## Что не считается завершённым

- воспроизводимый historical translation pipeline;
- reviewed alternative Russian translations;
- полная human/source review всех D1.3 findings;
- physical migration/removal retained serialization;
- подтверждённые source URLs/permissions для PDFs;
- user-facing two-book/translation selector;
- восстановленный admin editor;
- полный accessibility audit;
- расширенные browser smoke tests;
- итоговый privacy/sharing audit.

Этот документ задаёт продуктовую цель. Current technical state хранится в `docs/PROJECT_STATE.md`, dataset identity — в `data/datasets.json` и `docs/DATASET_REGISTRY.md`, audit — в `docs/DATA_QUALITY_AUDIT.md` и `reports/`, architecture — в `docs/ARCHITECTURE.md`, очередь работ — в `ROADMAP.md`.
