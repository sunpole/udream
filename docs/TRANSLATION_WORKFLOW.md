# Переводы и AI-assisted workflow

## Назначение

Этот документ фиксирует целевую модель переводов uDream и безопасный порядок экспериментов с API-переводом. Он не означает, что новые переводы уже созданы или что активная база должна быть немедленно изменена.

Стабильные IDs определены в `data/datasets.json` и `docs/DATASET_REGISTRY.md`. Current quality baseline хранится в `docs/DATA_QUALITY_AUDIT.md` и `reports/`.

## Текущие зарегистрированные наборы

| Dataset ID | Роль | Статус |
|---|---|---|
| `source-divinity-code-en` | один logical English source dataset | retained source |
| `ru-current-v1` | текущий localized/augmented dataset | runtime current |

Точный historical translation pipeline, prompts, provider sequence и полный human-review record остаются неизвестными.

## Целевая модель

1. `source-divinity-code-en` — canonical logical source dataset.
2. `ru-current-v1` — current published localized dataset.
3. Alternative Russian translation A — новый independent dataset ID.
4. Alternative Russian translation B — только если качество и проверяемость это оправдывают.

Если надёжно получается только один русский перевод, проект сохраняет один. Количество вариантов не важнее качества и provenance.

## Эквивалентные английские сериализации

D1.1 доказал:

- `data/bd2.json` и `data/db.json` имеют разные raw bytes/hashes;
- parsed/canonical JSON полностью одинаков;
- оба файла содержат одинаковые 4 086 ordered records;
- это две physical serializations одного `source-divinity-code-en`.

D1.2 утвердил:

```text
source-divinity-code-en-bd2 -> data/bd2.json
source-divinity-code-en-db  -> data/db.json
```

`data/bd2.json` — canonical maintained serialization по project-governance decision. Это не доказательство historical original. `data/db.json` остаётся retained equivalent compatibility serialization.

```text
migration: planned-not-executed
remove_or_rename_approved: false
```

## Идентичность варианта

Каждый самостоятельный dataset/translation должен иметь:

- stable logical dataset ID;
- stable physical file ID;
- source/book и language;
- version/date;
- source commit/hash;
- получение и transformation method;
- translator/tool/model;
- prompt-template version;
- editorial rules;
- validation result;
- human-review status;
- связь с предыдущей версией.

Несколько physical files относятся к одному logical dataset только при доказанной canonical identity.

Примеры будущих IDs:

```text
ru-deepseek-candidate-v1
ru-alternative-reviewed-v1
ru-alternative-reviewed-v2
```

Новый перевод не может использовать ID `ru-current-v1` и не может перезаписывать его файл.

## D1.3 quality baseline

D1.3 проверил `source-divinity-code-en` и `ru-current-v1` read-only аудитом.

Подтверждено:

- по 4 086 unique ordered IDs;
- source/current IDs aligned;
- preserved-field differences: 0;
- structural errors: 0;
- warnings: 0;
- review instances: 5 022 in 5 aggregated groups.

Review findings не являются доказанными translation errors. Они могут пересекаться и требуют source/human review. Audit не меняет данные и не выбирает «лучший» перевод.

## Использование DeepSeek API

DeepSeek может создавать только отдельный candidate dataset или расширять непереведённые поля в отдельном кандидате. Результат не считается автоматически правильным, опубликованным или богословски проверенным.

### Допустимое место запуска

- локальный служебный script; или
- отдельный GitHub Actions workflow с encrypted secret.

Public site и PWA никогда не обращаются к paid translation API напрямую.

### Хранение ключа

Ключ:

- не записывается в Git;
- не попадает в browser code, JSON, patchnotes, docs, screenshots, logs или artifacts;
- локально передаётся через environment variable/ignored `.env`;
- в Actions хранится только как encrypted secret;
- при подозрении на утечку отзывается.

```text
DEEPSEEK_API_KEY
```

`.env.example` может содержать только пустое имя variable.

## Безопасный AI pipeline

1. выбрать registered source dataset ID и exact hash;
2. назначить новый candidate dataset ID;
3. определить разрешённые fields;
4. запретить изменение IDs, sources и Bible references;
5. обрабатывать resumable batches;
6. сохранять raw response отдельно от normalized candidate;
7. записывать model, date, parameters и prompt version;
8. проверять count, IDs, types и references;
9. формировать diff с `ru-current-v1`;
10. выполнять human review;
11. регистрировать candidate file/hashes после validation;
12. публиковать только отдельным data release.

Сбой не должен портить опубликованный файл. Script обязан иметь checkpoint/resume.

## Что нельзя автоматизировать без проверки

- новые Bible references;
- усиление/изменение смысла;
- объединение книг в одну запись;
- удаление неоднозначности;
- замена source;
- изменение stable ID;
- выбор окончательного перевода.

## Future UI modes

Будущая архитектура может поддерживать:

- выбор source dataset;
- выбор current/alternative translation;
- side-by-side comparison;
- combined search with visible source/variant.

Selector не реализуется до завершения D1.4, полного validation contract и отдельного functional release. `ru-current-v1` остаётся единственным runtime dataset.

## Критерии допуска нового перевода

- зарегистрирован exact source ID/hash;
- создан новый logical dataset ID и separate physical file;
- current dataset не перезаписан;
- count/identity объяснены;
- automatic checks прошли;
- diff report создан;
- disputed wording/references проверены человеком;
- provenance/rights не ухудшились;
- существует rollback;
- оформлены separate PR, data release и uNews patchnote.

## Текущий этап

D1.1 provenance, D1.2 registry и D1.3 quality audit завершены.

Следующий этап — **D1.4 two-book product architecture**. Он должен определить relationship двух книг, visible provenance, switching/combined/side-by-side UX, dataset-aware history/deep links, validation/cache/fallback и migration plan. Реализация selector требует отдельной functional phase.

D1.5 AI-assisted translation experiment начинается только после завершения D1.4.
