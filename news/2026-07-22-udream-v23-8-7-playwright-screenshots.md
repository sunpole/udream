---
type: feature
project: uDream
series: udream
title: Реальные скриншоты через Playwright и GitHub Actions
version: 23.8.7
queued_at: 2026-07-22T08:28:00Z
repo_url: https://github.com/sunpole/udream
web_url: https://sunpole.github.io/udream/
image: 2026-07-22-udream-v23-8-7-playwright-screenshots.png
image_source: playwright
image_target: scenario/russian-alias-mobile
image_commit: d6cb082d8d1aa1990d26a9a5f72e6e61ae56fb47
image_captured_at: 2026-07-22T08:22:53Z
---

# uDream 23.8.7: реальные скриншоты создаёт настоящий Chromium

Для uDream добавлена отдельная автоматическая система, которая открывает точный commit проекта в настоящем Chromium, проверяет ожидаемый результат и только после этого создаёт PNG.

- Playwright изолирован в `tools/screenshots/` и не входит в публичный сайт или PWA.
- `@playwright/test`, `playwright` и `playwright-core` зафиксированы на версии `1.61.1` через отдельный lockfile.
- GitHub Actions устанавливает зависимости командой `npm ci` и Chromium через официальный Playwright installer.
- Снимки создаются одним worker для воспроизводимости.
- Сайт запускается из точного checkout через локальный HTTP-сервер.
- JSON-сценарии не исполняют произвольный JavaScript и поддерживают только разрешённые действия.
- Каждый сценарий обязан сначала выполнить assertions, а затем сохранить изображение.
- Проверяются PNG-сигнатура, размеры и минимальный размер файла.
- Создаются desktop и mobile кадры.
- Manifest записывает commit, UTC-время, URL, viewport, фактические размеры и число байтов.
- Workflow имеет только `contents: read` и не может сам изменить репозиторий.
- Результаты сначала сохраняются как GitHub Actions artifact и требуют визуальной проверки.
- Добавлены четыре проверенных сценария: стартовая страница, ранжирование `water` на desktop/mobile и русский алиас `вода` на mobile.
- Первый полный Chromium-run создал четыре изображения и прошёл все сценарии.
- Для этого патчноута используется новый Playwright-кадр, где запрос `вода` открывает основную карточку `water`.
- Runtime, PWA, Service Worker и активная база из 4 086 записей не изменялись.

Следующим этапом становится D1.1 — восстановление происхождения текущих файлов данных без изменения активной базы.

Короткий текст для Telegram:

Обновление uDream 23.8.7 автоматизирует настоящие скриншоты: GitHub Actions запускает точный commit в Chromium, проверяет сценарий и создаёт desktop/mobile PNG с manifest. Старые картинки не переиспользуются, а результаты сначала проходят визуальную проверку. Первый полный запуск успешно проверил четыре сценария, включая русский запрос «вода», который открывает карточку water. Runtime и база из 4 086 записей не изменялись.
