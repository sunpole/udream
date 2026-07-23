---
type: architecture
project: uDream
series: udream
title: Спроектирована безопасная архитектура двух книг
version: 23.8.11
queued_at: 2026-07-23T08:15:00Z
repo_url: https://github.com/sunpole/udream
web_url: https://sunpole.github.io/udream/
image: 2026-07-23-udream-v23-8-11-two-book-architecture.png
image_source: document-render
image_target: docs/TWO_BOOK_ARCHITECTURE.md
image_commit: b5c819de9e573f5d47de0a7aec19eb0bee050fea
image_captured_at: 2026-07-23T08:15:00Z
---

# uDream 23.8.11: архитектура двух книг определена до реализации

Завершён architecture-only этап D1.4. Он определяет, как uDream сможет безопасно работать с двумя исходными книгами, не меняя текущий сайт и базу.

- Текущий default остаётся `ru-current-v1`.
- Вторая сохранённая PDF-книга пока не считается готовым dataset.
- Глобальная идентичность записи определена как `(dataset_id, record_id)`.
- Первым будущим режимом рекомендовано отдельное переключение зарегистрированных баз.
- Combined search должен быть federated по отдельным индексам, а не через разрушительное объединение JSON.
- Side-by-side comparison разрешён только через явную проверенную relation map.
- Для результатов и карточек обязательны source work, dataset, translation/variant и известная source reference.
- URL, история и sharing должны сохранять dataset identity.
- Новая база активируется атомарно только после проверки, а при ошибке приложение возвращается к `ru-current-v1`.
- Cache cleanup не должен затрагивать другие проекты на том же origin.
- Созданы `docs/TWO_BOOK_ARCHITECTURE.md`, `docs/two-book-architecture.json` и постоянный validator.
- Существующие data files, runtime, PWA, package metadata, `versions/` и `_archive/` не изменены.

Короткий текст для Telegram:

uDream 23.8.11 завершает D1.4 — архитектуру двух книг до реализации. Текущая база ru-current-v1 остаётся стабильной, вторая PDF ещё не считается готовым dataset. Зафиксированы identity `(dataset_id, record_id)`, отдельный режим как первый этап, federated combined search без destructive merge, reviewed relation map для сравнения и автоматический fallback к стабильной базе. Runtime и 4 086 записей не менялись.
