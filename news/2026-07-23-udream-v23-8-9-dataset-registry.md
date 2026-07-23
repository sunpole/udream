---
type: documentation
project: uDream
series: udream
title: Создан проверяемый реестр наборов данных uDream
version: 23.8.9
queued_at: 2026-07-23T06:34:14Z
repo_url: https://github.com/sunpole/udream
web_url: https://sunpole.github.io/udream/
image: 2026-07-23-udream-v23-8-9-dataset-registry.png
image_source: document-render
image_target: docs/DATASET_REGISTRY.md
image_commit: 80dde35b412a8de0462f0f612fdeb0eb85e6e5ca
image_captured_at: 2026-07-23T06:34:14Z
---

# uDream 23.8.9: создан реестр наборов данных

Завершён этап D1.2 — текущие файлы данных получили проверяемые логические и физические идентификаторы без изменения существующих баз или приложения.

- Добавлен машинно-читаемый реестр `data/datasets.json`.
- Английский набор зарегистрирован один раз как `source-divinity-code-en`.
- Текущий локализованный набор зарегистрирован как `ru-current-v1`.
- `data/bd2.json` получил physical ID `source-divinity-code-en-bd2` и выбран canonical maintained serialization.
- `data/db.json` получил physical ID `source-divinity-code-en-db` и сохранён как retained equivalent compatibility serialization.
- Выбор `data/bd2.json` зафиксирован как project-governance decision и не выдаётся за доказательство исторического оригинала.
- Создан `docs/DATASET_REGISTRY.md` с правилами identity, retention, migration и rollback.
- Создан постоянный `scripts/validate-dataset-registry.mjs`, который сверяет реестр с реальными bytes, hashes, canonical JSON и 4 086 ordered IDs.
- GitHub Actions теперь обязательно запускает registry-validator.
- Физическая миграция имеет статус `planned-not-executed`: существующие файлы не удалялись, не переименовывались и не изменялись.
- Runtime, PWA, Service Worker, package metadata, сохранённые версии и архив не менялись.

Изображение к публикации — новый реальный Chromium document-render страницы `docs/DATASET_REGISTRY.md` из точного commit.

Короткий текст для Telegram:

Документационное обновление uDream 23.8.9 завершает D1.2. Создан проверяемый реестр наборов: один logical English dataset `source-divinity-code-en`, текущий `ru-current-v1`, canonical `data/bd2.json` и retained compatibility `data/db.json`. Добавлены постоянный validator, migration и rollback rules. Существующие базы, runtime и PWA не изменялись.
