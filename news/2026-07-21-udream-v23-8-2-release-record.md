---
type: docs
project: uDream
series: udream
title: Документация синхронизирована с релизом v23.8.0
version: 23.8.2
queued_at: 2026-07-21T03:48:27Z
repo_url: https://github.com/sunpole/udream
web_url: https://sunpole.github.io/udream/
image: 2026-07-21-udream-v23-8-2-release-record.png
image_source: document-render
image_target: VERSION.md@de2759670fc3979ec5ad63f57ab32754b42eb99c
image_commit: de2759670fc3979ec5ad63f57ab32754b42eb99c
image_captured_at: 2026-07-22T10:41:52Z
publication_repair: unpublished-invalid-image
publication_repair_reason: replace the shared unpublished PNG whose PLTE chunk had an invalid CRC with a dedicated VERSION.md render
---

# uDream 23.8.2: состояние проекта приведено к релизу v23.8.0

Документация проекта теперь соответствует уже опубликованной версии приложения `v23.8.0`.

- `VERSION.md` фиксирует `v23.8.0` как текущую точку восстановления.
- Записан точный функциональный commit `24dece593bea679485057d7551a2583f7f1f5acf`.
- README, roadmap, changelog, состояние проекта и инструкция отката синхронизированы с новым PWA-релизом.
- Устаревшие формулировки о ветке разработки и проверке до merge удалены.
- Предыдущая точка восстановления `v23.7.0` сохранена.
- Независимый запускаемый fallback `versions/v3.0.0/` сохранён.
- Код приложения, PWA-логика, package metadata и активная база из 4 086 записей не изменяются.

Изображение — отдельный документальный рендер `VERSION.md` на историческом commit `de275967…`. На нём видны текущая точка восстановления `v23.8.0`, точный tag commit, дата публикации и проверенное состояние базы. SVG-источник и provenance сохранены в `tools/screenshots/publication-repairs/`.

Публикационный ремонт выполнен до первого Telegram-поста. Прежняя запись повторно использовала тот же повреждённый PNG, что и `23.8.1`; новый уникальный файл сохраняет прежние `version`, `queued_at`, project и series и не создаёт дополнительной новости.

Короткий текст для Telegram:

Документационное обновление uDream 23.8.2 завершает фиксацию релиза v23.8.0. README, VERSION, CHANGELOG, ROADMAP, состояние проекта и инструкция отката теперь указывают на точный commit 24dece5. Код приложения и база из 4 086 записей не меняются.
