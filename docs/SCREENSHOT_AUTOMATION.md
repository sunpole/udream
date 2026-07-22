# Реальные скриншоты для патчноутов и uNews

## Цель

Каждый новый патчноут uDream должен использовать новое реальное изображение, относящееся именно к фактически выполненному изменению.

Для пользовательских изменений основной способ — автоматический снимок настоящего Chromium через Playwright. Для документационных изменений допускается реальный снимок GitHub-страницы, отчёта Actions или актуального документа, отрендеренного из точного commit.

## Реализованная система 23.8.7

Автоматизация находится отдельно от публичного runtime:

```text
tools/screenshots/
├── package.json
├── package-lock.json
├── playwright.config.mjs
├── prepare-artifacts.mjs
├── capture.spec.mjs
├── scenarios/
│   ├── homepage-desktop.json
│   ├── search-water-desktop.json
│   ├── search-water-mobile.json
│   └── russian-alias-mobile.json
├── README.md
└── v23.8.7-selected-image.json

.github/workflows/capture-screenshots.yml
scripts/validate-screenshot-tooling.mjs
```

`@playwright/test`, `playwright` и `playwright-core` зафиксированы отдельным lockfile на версии `1.61.1`. Эти зависимости отсутствуют в корневом package и не импортируются `index.html`, `script.js`, `src/` или `sw.js`.

## Что считается реальным скриншотом

Подходит изображение, которое:

- создано браузером из точного commit или рабочей ветки;
- показывает фактический интерфейс, документ, Release, Pull Request или результат проверки;
- соответствует версии и функции патчноута;
- не было взято из старого патча;
- не скрывает ошибку, пустое состояние или старый кеш;
- имеет записанные источник, цель, commit и время захвата.

Не подходит:

- старая картинка ради обязательного поля `image`;
- изображение другой функции или другой версии;
- вручную нарисованная схема, выдаваемая за снимок сайта;
- AI-изображение вместо подтверждения реальной функции;
- скриншот, на котором не видно заявленного результата;
- снимок с токенами, ключами, приватными данными или локальными путями пользователя.

## Канонический процесс захвата

```text
branch / Pull Request
    ↓
GitHub Actions checkout точного commit
    ↓
npm ci из отдельного tools/screenshots package
    ↓
установка Chromium и системных зависимостей
    ↓
локальный HTTP-сервер из корня checkout
    ↓
JSON-сценарий с разрешёнными действиями
    ↓
assertions ожидаемого состояния
    ↓
PNG desktop / mobile
    ↓
manifest с commit, UTC-временем, viewport и размером
    ↓
workflow artifact
    ↓
визуальная проверка человеком или ответственным агентом
    ↓
одобренный PNG добавляется в news/
    ↓
патчноут проходит validator и PR review
    ↓
merge делает запись доступной uNews
```

Постоянный workflow имеет только `contents: read`. Он не может выполнить `git commit`, `git push` или автоматически изменить `main`.

## Запуск в GitHub Actions

Workflow:

```text
.github/workflows/capture-screenshots.yml
```

Он запускается:

- для Pull Request, затрагивающего runtime, данные активной базы, screenshot tooling или сам workflow;
- вручную через `workflow_dispatch`;
- для всех сценариев либо для списка ID из input `scenarios`.

Постоянные шаги:

```text
npm ci
npx playwright install --with-deps chromium
npm run capture
```

Результат загружается как artifact с хранением 30 дней:

```text
artifacts/screenshots/
├── images/*.png
├── entries/*.json
├── manifest.json
├── playwright-results.json
└── test-results/
```

## Сценарный runner

Сценарии хранятся как JSON и не могут исполнять произвольный JavaScript.

Разрешены только действия:

- `waitFor`;
- `fill`;
- `press`;
- `click`;
- `clickIfVisible`;
- `scrollIntoView`;
- `waitForTimeout` до двух секунд;
- `assertVisible`;
- `assertText`;
- `assertFirstText`;
- `assertCountAtLeast`.

Каждый сценарий обязан содержать хотя бы один assertion. Runner проверяет локальный URL, безопасный selector, допустимый viewport, PNG-сигнатуру, фактические размеры и минимальный размер файла.

`assertText` ищет совпадение среди всех элементов selector. Это важно для списков алиасов и тегов, где selector закономерно возвращает несколько элементов.

## Воспроизводимость

Runner:

- использует один worker;
- создаёт свежий browser context;
- очищает localStorage и sessionStorage до запуска страницы;
- блокирует Service Worker, чтобы старый кеш не искажал UI-снимок;
- использует светлую тему, русскую локаль и reduced motion;
- отключает transitions и animations;
- ждёт готовность шрифтов и два animation frame;
- закрывает install banner, когда он видим;
- запускает сайт через `python3 -m http.server 8019 --bind 127.0.0.1`.

Перед каждым полным запуском `prepare-artifacts.mjs` очищает только каталог, оканчивающийся на `artifacts/screenshots`, и заново создаёт `images/` и `entries/`.

Каждый успешный сценарий записывает собственный `entries/<id>.json`. Итоговый manifest собирается из этих файлов, поэтому retry отдельного теста не может потерять результаты уже успешных сценариев.

## Реальные проверенные сценарии

В первом полном успешном Chromium-run прошли четыре сценария:

1. `homepage-desktop` — загрузка текущего runtime, логотип, 4 086 записей и активный режим «Везде»;
2. `search-water-desktop` — `water` стоит первым в desktop autocomplete;
3. `search-water-mobile` — тот же порядок на viewport `390×844`;
4. `russian-alias-mobile` — запрос `вода` через Enter открывает основную карточку `water` и показывает алиас `вода`.

Первый полностью успешный artifact создан для commit:

```text
34d2b13c2e0f16b597572701485df24a538609c8
```

Одобренный патчноутный кадр создан отдельным повторным запуском сценария `russian-alias-mobile`:

```text
commit: d6cb082d8d1aa1990d26a9a5f72e6e61ae56fb47
capturedAt: 2026-07-22T08:22:53Z
viewport: 390×844
PNG: 108002 bytes
```

Точная provenance-запись сохранена в:

```text
tools/screenshots/v23.8.7-selected-image.json
```

## Почему artifact не коммитится сразу в main

Автоматический браузер может получить:

- временную ошибку загрузки;
- пустую карточку;
- неверный viewport;
- старое состояние кеша;
- неожиданное модальное окно;
- неправильный текст из-за изменения данных;
- ошибку самого сценария или runner.

Поэтому постоянный workflow сначала создаёт artifact. Изображение добавляется в branch только после содержательной и визуальной проверки, а в `main` попадает исключительно через Pull Request.

## PWA и кеш

Обычный Chromium UI-снимок не является доказательством полной PWA-проверки.

Для изменений Service Worker отдельно проверяются:

- первый запуск;
- повторный запуск;
- обновление со старого кеша;
- сохранение безопасных пользовательских настроек;
- offline fallback после успешной установки;
- отсутствие удаления чужих origin caches.

Текущий screenshot runner намеренно блокирует Service Worker, чтобы кадр интерфейса не зависел от старого браузерного кеша.

## Документационные изображения

Для документационного патча допускается реальный снимок:

- актуального `WORK_STATUS.md`;
- GitHub Release;
- Pull Request с точным списком файлов;
- успешного GitHub Actions run;
- документа, отрендеренного из точного branch commit.

Изображение должно честно называться документальным снимком, а не демонстрацией пользовательской функции.

## Метаданные патчноута

Для каждого нового патчноута обязательны:

```yaml
image: 2026-07-22-udream-example.png
image_source: playwright
image_target: scenario/search-water-mobile
image_commit: abc1234
image_captured_at: 2026-07-22T07:30:00Z
```

Допустимые `image_source`:

- `playwright` — автоматический Chromium;
- `manual-browser` — ручной снимок реального браузера;
- `github-ui` — реальный снимок GitHub Issue, PR, Release или Actions;
- `document-render` — снимок актуального документа из точного commit.

`image_target` называет URL, сценарий или документ. `image_commit` указывает показанный commit. `image_captured_at` хранится в UTC.

## Проверки Pull Request

Автоматический validator требует:

- новый Markdown-файл;
- новый PNG или JPEG в том же PR;
- отсутствие повторного использования существующего изображения;
- обязательные screenshot metadata;
- корректную сигнатуру PNG/JPEG;
- существующий `image_commit` в Git history;
- отсутствие secret-подобного текста;
- `project: uDream` и `series: udream`.

`scripts/validate-screenshot-tooling.mjs` дополнительно проверяет:

- точные package и lockfile версии;
- отсутствие Playwright в корневом runtime package;
- read-only разрешения workflow;
- обязательные команды установки и capture;
- безопасную очистку artifacts;
- наличие desktop и mobile сценариев;
- assertions в каждом сценарии;
- отсутствие ссылок на screenshot tooling в runtime-файлах.

Валидатор не может полностью доказать содержательную правдивость изображения. Поэтому до merge остаётся визуальная проверка.

## Имена файлов

Рекомендуемый формат:

```text
YYYY-MM-DD-udream-vVERSION-short-scenario.png
```

## Секреты и приватность

Перед снимком необходимо:

- использовать только публичные или тестовые данные;
- не отображать environment variables и GitHub Secrets;
- не показывать локальные домашние пути;
- не включать email, токены, cookies и приватные Issue;
- очищать test artifacts от случайных данных.

## Ответственность uNews

uNews публикует файл, указанный в патчноуте. Он не должен самостоятельно подменять, генерировать или выбирать другую картинку.

Если изображение неверно до публикации, исправляется самый ранний непубликованный патчноут проекта. Если неверное изображение уже опубликовано, используется документированная команда обслуживания uNews по известному `message_id`, а не новый дублирующий пост.

## Следующий этап

Автоматизация `23.8.7` завершает подготовку реальных screenshot artifacts. Следующая утверждённая продуктовая задача — D1.1: исследование происхождения данных без изменения активной базы.
