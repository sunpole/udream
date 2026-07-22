<p align="center">
  <img src="icon-192.png" width="112" height="112" alt="Логотип uDream">
</p>

<h1 align="center">uDream · UDREAM</h1>

<p align="center">
  Христианский справочник символов снов с быстрым поиском, историей и установкой как PWA.
</p>

<p align="center">
  <a href="https://sunpole.github.io/udream/"><img alt="Открыть uDream" src="https://img.shields.io/badge/Открыть_uDream-GitHub_Pages-222222?logo=github"></a>
  <a href="https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip"><img alt="Скачать uDream v23.8.0" src="https://img.shields.io/badge/Скачать-v23.8.0_ZIP-2ea44f?logo=github"></a>
  <a href="https://github.com/sunpole/udream/releases/tag/v23.8.0"><img alt="GitHub Release v23.8.0" src="https://img.shields.io/badge/release-v23.8.0-blue?logo=github"></a>
  <img alt="Записей в активной базе" src="https://img.shields.io/badge/записей-4_086-8a2be2">
  <img alt="PWA" src="https://img.shields.io/badge/PWA-устанавливается-orange?logo=pwa">
</p>

<p align="center">
  <a href="https://github.com/sunpole/udream/actions/workflows/validate.yml"><img alt="Проверка проекта" src="https://github.com/sunpole/udream/actions/workflows/validate.yml/badge.svg"></a>
  <a href="https://github.com/sunpole/udream/actions/workflows/capture-screenshots.yml"><img alt="Реальные Chromium-скриншоты" src="https://img.shields.io/badge/screenshots-Playwright_Chromium-45ba4b?logo=playwright"></a>
  <a href="https://t.me/uNewsLog"><img alt="Новости в Telegram" src="https://img.shields.io/badge/Telegram-@uNewsLog-26A5E4?logo=telegram&logoColor=white"></a>
  <a href="LICENSE"><img alt="Лицензия кода MIT" src="https://img.shields.io/badge/код-MIT-green"></a>
</p>

![Предварительный вид uDream](preview.jpg)

## Быстрый старт

| Действие | Ссылка или способ |
|---|---|
| Открыть приложение | [sunpole.github.io/udream](https://sunpole.github.io/udream/) |
| Установить на телефон | Открыть сайт и нажать баннер установки либо выбрать в меню браузера «Установить приложение» / «Добавить на главный экран» |
| Продолжить разработку из любого чата или устройства | Сначала открыть [WORK_STATUS.md](WORK_STATUS.md), проверить указанные branch/PR/commits и следовать [единому GitHub-протоколу](docs/AI_GITHUB_WORKFLOW.md) |
| Создать реальные screenshot artifacts | Запустить [Capture uDream screenshots](https://github.com/sunpole/udream/actions/workflows/capture-screenshots.yml) либо использовать `tools/screenshots/` локально |
| Скачать стабильный исходный код | [uDream v23.8.0 ZIP](https://github.com/sunpole/udream/archive/refs/tags/v23.8.0.zip) |
| Посмотреть точный релиз | [GitHub Release v23.8.0](https://github.com/sunpole/udream/releases/tag/v23.8.0) |
| Открыть сохранённую версию | [Каталог версий](https://sunpole.github.io/udream/versions/) |
| Следить за обновлениями | [Telegram @uNewsLog](https://t.me/uNewsLog) |

Отдельного APK сейчас нет: uDream устанавливается непосредственно из браузера как PWA. ZIP содержит исходный код точного стабильного релиза и предназначен для разработки, аудита или самостоятельного размещения.

## О проекте

uDream — статическое веб-приложение для поиска и чтения толкований символов из христианской литературы о снах и видениях. Оно заменяет ручной поиск по большим PDF-файлам удобным мобильным интерфейсом.

Проект работает непосредственно в браузере: сервер, регистрация и база данных на стороне сервера не требуются. Текущий интерфейс использует единую версию `UDREAM v23.8.0`. Метка `v19` сохраняется только как историческая интерфейсная итерация в архиве.

Единая миссия, конечный образ продукта, правила сохранения баз и переводов и граница следующего этапа зафиксированы в [видении продукта](docs/PRODUCT_VISION.md).

### Возможности

- релевантный поиск по символам, синонимам, описаниям и тегам с поддержкой Enter и русских алиасов;
- подсказки при вводе и алфавитная навигация;
- карточки символов, перекрёстные ссылки и хлебные крошки;
- история просмотров, светлая и тёмная темы;
- русский и английский интерфейс;
- установка на устройство как PWA;
- автоматическая проверка и получение новой PWA-версии без зависания на старом кэше;
- каталог сохранённых рабочих версий;
- регрессионные тесты и автоматическая проверка базы, runtime-файлов, handoff и патчноутов;
- реальные desktop/mobile-скриншоты из точного commit через Playwright Chromium и GitHub Actions artifacts.

## Текущее состояние

| Параметр | Значение |
|---|---|
| Стабильная точка восстановления | `v23.8.0` |
| Текущая версия приложения | `v23.8.0` |
| Документационный и automation baseline | `v23.8.7` — реальные Chromium screenshot artifacts |
| Оперативная точка продолжения | [WORK_STATUS.md](WORK_STATUS.md) — состояние нельзя дублировать из старого чата |
| Источник GitHub-процесса | [docs/AI_GITHUB_WORKFLOW.md](docs/AI_GITHUB_WORKFLOW.md) |
| Screenshot tooling | `tools/screenshots/` + read-only workflow `capture-screenshots.yml` |
| Следующая утверждённая серия | `D1` — происхождение данных и архитектура нескольких наборов |
| Следующая точная задача | `D1.1` — восстановить происхождение текущих файлов данных без изменения активной базы |
| Историческая метка интерфейса | `v19` — только архив |
| Активная база | `data/divinity_code_ru.json` |
| Количество записей | 4 086 |
| Публикация | GitHub Pages из ветки `main` |
| Технологии | HTML, CSS, JavaScript ES Modules, JSON, PWA |

Новый чат, Codex или устройство сначала проверяет реальные GitHub-факты и `WORK_STATUS.md`. Память ИИ, старое сообщение или локальная незапушенная ветка не являются источником истины.

Playwright-автоматизация завершена: четыре сценария запускают настоящий Chromium, проверяют ожидаемое состояние и сохраняют desktop/mobile PNG с точным manifest. Результаты сначала становятся GitHub Actions artifact и только после визуальной проверки могут попасть в `news/`.

Следующий этап D1.1 остаётся исследованием и проектированием и не меняет активные 4 086 записей.

## План данных и переводов

Целевая модель после D1:

- одна каноническая исходная база;
- один текущий опубликованный русский перевод;
- до двух самостоятельных альтернативных русских переводов, только когда их качество и происхождение можно проверить.

Точные дубликаты не считаются отдельными переводами. Для `data/bd2.json` и `data/db.json` сначала будет доказан канонический вариант и подготовлен обратимый план миграции. Если надёжно существует только один русский перевод, проект сохранит один перевод вместо создания искусственных вариантов.

DeepSeek API рассматривается как дополнительный инструмент для создания кандидатного перевода. Ключ никогда не встраивается в сайт или PWA; перевод должен выполняться локальным служебным скриптом либо GitHub Actions с encrypted secret. Любой результат сохраняется как отдельная кандидатная версия и проходит автоматическую и человеческую проверку.

Будущий переключатель баз допускается только после утверждения D1 и обязан проверять полный набор данных, перезагружать приложение согласованно, безопасно очищать кеш и автоматически возвращаться к стабильной базе при ошибке.

Подробнее: [переводы и AI-assisted workflow](docs/TRANSLATION_WORKFLOW.md) и [формат данных](docs/DATABASE_FORMAT.md).

## Структура репозитория

```text
udream/
├── index.html, script.js        # текущий сайт и оркестрация
├── src/                         # поиск, данные, история, локализация, представление и PWA
├── tests/                       # регрессионные тесты модулей
├── manifest.json, version.json  # PWA metadata и проверка опубликованной версии
├── sw.js                        # offline cache и обновление runtime
├── favicon.svg, icon-*.png      # оформление сайта
├── data/                        # текущая база и сохранённые варианты данных
├── versions/                    # запускаемые контрольные версии
├── news/                        # патчноуты и новые реальные изображения для uNews
├── tools/screenshots/           # изолированные Playwright-сценарии и package
├── docs/                        # видение, состояние, процессы, данные и screenshot policy
├── scripts/                     # автоматические проверки репозитория, PR и screenshot tooling
├── .github/workflows/           # validation, screenshot artifacts и release automation
├── _archive/                    # исторические версии и исходные материалы
├── WORK_STATUS.md               # текущая задача и GitHub-handoff
├── AGENTS.md                    # обязательные правила разработки
├── CHANGELOG.md                 # история изменений
├── ROADMAP.md                   # завершённое, следующий этап и backlog
└── VERSION.md                   # состояние версий
```

Файлы текущего сайта намеренно находятся в корне: GitHub Pages публикует их напрямую. Исторические эксперименты хранятся отдельно в `_archive/` и не являются рабочим приложением.

Подробная карта находится в [docs/FILE_MAP.md](docs/FILE_MAP.md).

## Локальный запуск

```bash
python3 -m http.server 8019
```

После этого откройте `http://localhost:8019/`. Запуск простым открытием `index.html` через `file://` не считается корректной проверкой: браузеры ограничивают `fetch()` и service worker.

Проверка тестов, структуры, базы, handoff, screenshot tooling и патчноутов:

```bash
npm test
node scripts/validate-project.mjs
```

Локальный Playwright capture:

```bash
cd tools/screenshots
npm ci
npx playwright install --with-deps chromium
npm run capture
```

## Новости и патчноуты

Каждое пользовательски заметное изменение сопровождается файлом в `news/`. Система [uNews](https://github.com/sunpole/uNews) проверяет новые патчноуты из публичной ветки `main` и через GitHub Actions публикует их в Telegram-канале [@uNewsLog](https://t.me/uNewsLog).

Для новых патчноутов требуется новый реальный PNG/JPEG в том же Pull Request и метаданные источника, цели, commit и UTC-времени захвата. Старую картинку использовать повторно нельзя. Постоянный Playwright workflow сначала создаёт read-only artifact; изображение добавляется в `news/` только после визуальной проверки. Правила описаны в [docs/NEWS_PUBLISHING.md](docs/NEWS_PUBLISHING.md) и [docs/SCREENSHOT_AUTOMATION.md](docs/SCREENSHOT_AUTOMATION.md).

Секреты Telegram и ключи переводческих API в этом репозитории не хранятся.

## Авторство, лицензия и исходные книги

© 2026 Антон Магомедов. Программная оболочка, поисковая логика, структура интерфейса и оригинальная документация uDream распространяются по лицензии [MIT](LICENSE).

Тексты книг, выдержки, словарные толкования, иллюстрации и PDF-файлы третьих лиц **не становятся MIT-контентом** и не объявляются собственностью автора приложения. Права на них сохраняются за соответствующими авторами и правообладателями. Репозиторий не является официальным изданием исходных книг.

Владелец проекта сообщает, что сохранённые PDF были получены из открытых источников, где они предлагались для открытого распространения. Конкретные адреса источников и формулировки разрешений ещё предстоит сохранить в репозитории как подтверждение происхождения; до этого проект не приписывает этим материалам неизвестную свободную лицензию.

Подробнее: [права на код и материалы](docs/CONTENT_AND_RIGHTS.md) и [уведомления о сторонних материалах](THIRD_PARTY_NOTICES.md).

## Документация

- [Текущая задача и точка продолжения](WORK_STATUS.md)
- [Единая работа ИИ, GitHub, чатов и устройств](docs/AI_GITHUB_WORKFLOW.md)
- [Видение и конечная цель продукта](docs/PRODUCT_VISION.md)
- [Переводы и AI-assisted workflow](docs/TRANSLATION_WORKFLOW.md)
- [Реальные скриншоты и Playwright-автоматизация](docs/SCREENSHOT_AUTOMATION.md)
- [Текущее состояние](docs/PROJECT_STATE.md)
- [Архитектура](docs/ARCHITECTURE.md)
- [Формат и сохранение вариантов базы](docs/DATABASE_FORMAT.md)
- [Карта файлов](docs/FILE_MAP.md)
- [Завершённый план модульного перехода](docs/MODULARIZATION_PLAN.md)
- [Публикация новостей](docs/NEWS_PUBLISHING.md)
- [Права на код и материалы](docs/CONTENT_AND_RIGHTS.md)
- [Релизы и восстановление](docs/RELEASE_AND_ROLLBACK.md)
- [Исторический контекст](docs/HISTORICAL_CONTEXT.md)
- [План развития](ROADMAP.md)
- [История изменений](CHANGELOG.md)

Вклад в проект принимается по правилам [CONTRIBUTING.md](CONTRIBUTING.md).
