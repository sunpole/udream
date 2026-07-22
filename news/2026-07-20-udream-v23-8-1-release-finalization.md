---
type: docs
project: uDream
series: udream
title: Релиз v23.8.0 получает точный тег и GitHub Release
version: 23.8.1
queued_at: 2026-07-20T18:35:00Z
repo_url: https://github.com/sunpole/udream
web_url: https://sunpole.github.io/udream/
image: 2026-07-20-udream-v23-8-1-release-finalization.png
image_source: github-ui
image_target: https://github.com/sunpole/udream/releases/tag/v23.8.0
image_commit: 24dece593bea679485057d7551a2583f7f1f5acf
image_captured_at: 2026-07-22T10:34:43Z
publication_repair: unpublished-invalid-image
publication_repair_reason: replace the unpublished PNG whose PLTE chunk had an invalid CRC and could not be decoded by Telegram
---

# uDream 23.8.1: финальная фиксация релиза v23.8.0

Добавлен безопасный релизный workflow для окончательной фиксации уже опубликованного обновления PWA.

- Релиз `v23.8.0` привязывается к точному функциональному merge-коммиту `24dece593bea679485057d7551a2583f7f1f5acf`.
- Перед публикацией workflow повторно запускает регрессионные тесты, валидатор проекта и проверку синтаксиса ключевых JavaScript-файлов.
- Проверяется совпадение версии в `package.json`, `src/version.js` и `version.json`.
- Тег создаётся только при отсутствии и никогда не перемещается.
- Если тег уже существует, workflow проверяет, что он указывает именно на утверждённый SHA.
- GitHub Release создаётся только при отсутствии и может безопасно восстанавливаться повторным ручным запуском workflow.
- В описание релиза включены основные изменения, точный commit и способ отката.
- Код приложения и активная база из 4 086 записей в этом документационном обновлении не изменяются.

Изображение — настоящий Playwright Chromium-снимок публичной страницы GitHub Release `v23.8.0`. До сохранения PNG сценарий подтвердил видимость названия релиза и тега `v23.8.0`; точный URL, commit, время, размеры и byte size записаны в `tools/screenshots/v23.8.1-v23.8.5-publication-repairs.json`.

Публикационный ремонт выполнен до первого Telegram-поста. Прежний PNG имел неверный CRC chunk `PLTE`, поэтому `pngcheck`, ImageMagick и Telegram не могли его декодировать. FIFO-идентичность патчноута сохранена, дублирующая публикация не создаётся.

Короткий текст для Telegram:

Документационное обновление uDream 23.8.1 завершает публикацию v23.8.0: точный commit 24dece5 получает неизменяемый Git tag и GitHub Release после повторной проверки тестов, валидатора и версий. Код приложения и база из 4 086 записей не меняются.
