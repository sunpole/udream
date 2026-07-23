---
type: audit
project: uDream
series: udream
title: Проверены все 4 086 записей без изменения базы
version: 23.8.10
queued_at: 2026-07-23T07:10:00Z
repo_url: https://github.com/sunpole/udream
web_url: https://sunpole.github.io/udream/
image: 2026-07-23-udream-v23-8-10-data-quality-audit.png
image_source: document-render
image_target: reports/data-quality-audit.md
image_commit: cd6aa539a418861108d58f2206050291642e7fcb
image_captured_at: 2026-07-23T07:09:49Z
---

# uDream 23.8.10: неразрушающий аудит качества данных

Завершён D1.3 — зарегистрированные source/current datasets проверены детерминированным read-only аудитом без исправления или перезаписи данных.

- Проверены logical datasets `source-divinity-code-en` и `ru-current-v1`.
- В каждом наборе подтверждены 4 086 unique ordered IDs `1–4086`.
- Source/current IDs полностью aligned.
- Поля `id`, `symbol`, `description`, `source` и `date_added` имеют 0 различий.
- Подтверждены ожидаемые differences: aliases 4 083, notes 4 086, tags 4 086.
- Structural gate прошёл: 0 errors и 0 warnings.
- Зафиксированы 5 022 human-review instances в пяти агрегированных группах.
- Эти 5 022 instances не являются 5 022 доказанными ошибками: группы пересекаются, shared aliases могут быть намеренными, а пустые source notes могут отражать структуру исходника.
- Добавлены deterministic reports `reports/data-quality-audit.json` и `reports/data-quality-audit.md`.
- Добавлен permanent `scripts/audit-data-quality.mjs` с режимом `--check`.
- GitHub Actions проверяет актуальность reports и structural gate.
- Ни один существующий data-файл, runtime, PWA, package metadata, saved version или archive не изменён.

Изображение к публикации — новый реальный Chromium document-render точного GitHub report page.

Короткий текст для Telegram:

uDream 23.8.10 завершает D1.3: все 4 086 записей source/current datasets проверены детерминированным read-only аудитом. Structural gate прошёл с 0 errors и 0 warnings. Отчёт содержит 5 022 пересекающихся human-review instances — это кандидаты на проверку, а не доказанные ошибки. Базы, runtime и PWA не изменялись.
