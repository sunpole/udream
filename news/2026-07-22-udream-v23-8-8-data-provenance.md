---
type: documentation
project: uDream
series: udream
title: Проверено происхождение и равенство текущих файлов данных
version: 23.8.8
queued_at: 2026-07-22T16:51:53Z
repo_url: https://github.com/sunpole/udream
web_url: https://sunpole.github.io/udream/
image: 2026-07-22-udream-v23-8-8-data-provenance.png
image_source: document-render
image_target: docs/DATA_PROVENANCE.md
image_commit: 0b257ff27b676107976a9e7a4aa59410d98cde13
image_captured_at: 2026-07-23T06:00:08Z
---

# uDream 23.8.8: проверенная provenance-база данных

Завершён документационный этап D1.1: восстановлено настолько, насколько позволяют сохранённые доказательства, происхождение и взаимосвязь текущих файлов данных uDream.

- Создан постоянный документ `docs/DATA_PROVENANCE.md`.
- Исправлено прежнее утверждение о том, что `data/bd2.json` и `data/db.json` полностью совпадают по байтам.
- Файлы имеют разные размеры и разные raw SHA-256, но их parsed JSON и canonical JSON полностью одинаковы.
- Во всех 4 086 записях совпадают порядок, ID, набор полей и значения.
- Поэтому это две физические сериализации одного логического английского набора, а не две независимые базы или два перевода.
- Для активного `data/divinity_code_ru.json` подтверждено сохранение `id`, `symbol`, `description`, `source` и `date_added`.
- Отличия активной базы зафиксированы в `aliases`, `notes` и `tags` с точными количествами.
- Доказанные факты, обоснованные выводы и неизвестные сведения разделены в документе явно.
- Точный generation/translation pipeline, prompts, последовательность провайдеров и полнота человеческой проверки остаются неизвестными.
- Добавлен постоянный `scripts/validate-data-provenance.mjs`, который проверяет raw/canonical hashes, schema, ordered IDs, семантическое равенство сериализаций и точные field-difference counts.
- Validator подключён к общей проверке проекта.
- Ни один из поддерживаемых файлов данных не изменялся.
- Runtime, PWA, Service Worker, package metadata, `versions/` и `_archive/` не изменялись.

Изображение к публикации — новый document-render точного D1.1-документа с исправленным выводом, hashes и командой постоянной проверки.

Короткий текст для Telegram:

uDream 23.8.8 завершает D1.1 — проверку происхождения текущих файлов данных. Выяснено, что bd2.json и db.json различаются по байтам и raw SHA-256, но содержат один и тот же canonical JSON из 4 086 записей. Созданы постоянный DATA_PROVENANCE.md и validator, который фиксирует hashes, schema, ordered IDs и точные отличия активной базы. Файлы данных, runtime и PWA не изменялись.