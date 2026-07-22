---
type: docs
project: uDream
series: udream
title: План переводов и страница репозитория обновлены
version: 23.8.4
queued_at: 2026-07-21T05:10:00Z
repo_url: https://github.com/sunpole/udream
web_url: https://sunpole.github.io/udream/
image: 2026-07-21-udream-v23-8-4-translation-workflow.png
image_source: github-ui
image_target: https://github.com/sunpole/udream/blob/8adae192515de0a1cf1e0e3b9a3c85cfbe8f882a/docs/TRANSLATION_WORKFLOW.md
image_commit: 8adae192515de0a1cf1e0e3b9a3c85cfbe8f882a
image_captured_at: 2026-07-22T10:34:49Z
publication_repair: unpublished-image-upgrade
publication_repair_reason: replace a reused generic repository image with a dedicated historical TRANSLATION_WORKFLOW.md screenshot before publication
---

# uDream 23.8.4: варианты перевода, безопасный API-workflow и обновлённый README

Документация уточняет будущую структуру данных и делает публичную страницу репозитория удобнее.

- Целевая модель включает одну каноническую исходную базу, один текущий русский перевод и до двух действительно самостоятельных альтернативных переводов.
- Точные дубликаты больше не считаются отдельными вариантами: D1 должен выбрать канонический файл и подготовить обратимую миграцию до удаления лишней физической копии.
- Если качественно получается только один русский перевод, проект оставляет один перевод вместо искусственного создания вариантов.
- Добавлен отдельный документ `docs/TRANSLATION_WORKFLOW.md`.
- DeepSeek рассматривается только как вспомогательный генератор отдельного кандидата перевода.
- Ключ API запрещено помещать в сайт, PWA, Git, JSON, логи и патчноуты; допускается локальная переменная окружения или GitHub encrypted secret.
- Каждый AI-assisted запуск должен сохранять исходный hash, модель, версию prompt, выходной hash, отчёт проверки и статус человеческой проверки.
- README получил более понятные badges, быстрый старт, инструкцию установки PWA и прямую ссылку на ZIP стабильного релиза `v23.8.0`.
- Код приложения, PWA и активная база из 4 086 записей не изменяются.

Изображение — настоящий Playwright Chromium-снимок `docs/TRANSLATION_WORKFLOW.md` на точном историческом commit `8adae19…`. Сценарий подтвердил видимость заголовка «Переводы и AI-assisted workflow» и раздела «Целевой набор данных»; точный URL, commit, время, размеры и byte size записаны в `tools/screenshots/v23.8.1-v23.8.5-publication-repairs.json`.

Публикационный upgrade выполнен до первого Telegram-поста. FIFO-идентичность записи сохранена, новый PNG уникален для `23.8.4` и не повторяет общую картинку раннего документационного патча.

Короткий текст для Telegram:

Документационное обновление uDream 23.8.4 закрепляет будущую модель данных: одна исходная база, текущий русский перевод и до двух реальных альтернатив без искусственных дублей. Добавлены безопасные правила DeepSeek-assisted перевода, а README получил установку PWA, быстрый старт и прямое скачивание стабильного v23.8.0 ZIP.
