---
type: documentation
project: uDream
series: udream
title: Проверена извлекаемость второй книги
version: 23.8.12
queued_at: 2026-07-29T04:40:00Z
repo_url: https://github.com/sunpole/udream
web_url: https://sunpole.github.io/udream/
image: 2026-07-29-udream-v23-8-12-second-book-evidence.png
image_source: document-render
image_target: docs/SECOND_BOOK_EVIDENCE.md
image_commit: c9879b2c4f38d33da2a1403ba8874ee126a781a6
image_captured_at: 2026-07-29T04:40:00Z
---

# uDream 23.8.12: вторая книга технически пригодна для прямого извлечения

Завершён этап D1.4a — проверка второй сохранённой книги и проектирование безопасного extraction contract.

- Проверен PDF `_archive/source-files/Unlocking-Your-Dream-Student-Ma.pdf`.
- Зафиксированы размер `740193` bytes, SHA-256, Git blob и Git history.
- Подтверждены 55 страниц и полноценный текстовый слой на всех 55 страницах.
- Searchable ratio равен `1.0`.
- Извлечено для технического анализа 85 103 символа и 12 479 слов без сохранения полного текста книги в репозитории.
- Технический вывод: `direct-text-extraction-viable`.
- Созданы постоянные evidence JSON/Markdown, extraction contract и validator.
- Определены immutable raw extraction, page-level provenance, local IDs, source references, validation, review и rollback.
- Наличие извлекаемого текста не объявляется готовой базой и не доказывает права на публичное распространение производного текста.
- Текущие 4 086 записей, runtime, PWA, Service Worker, package metadata, `versions/` и `_archive/` не изменялись.

Следующий этап — частный или непубличный pilot extraction с отдельными файлами страниц, manifest и небольшой проверенной segmentation sample. Новый logical dataset пока не создаётся.

Короткий текст для Telegram:

uDream 23.8.12 подтвердил, что все 55 страниц второй книги имеют извлекаемый текстовый слой. Зафиксированы точные hash/metadata, создан безопасный extraction contract и validator. Полный текст не публикуется, текущая база из 4 086 записей не меняется; следующий шаг — непубличный pilot extraction с provenance и ручной проверкой.
