<p align="center">
  <img src="icon-192.png" width="112" height="112" alt="Логотип uDream">
</p>

<h1 align="center">uDream · UDREAM</h1>

<p align="center">
  Христианский справочник символов снов с быстрым поиском, историей и установкой как PWA.
</p>

<p align="center">
  <a href="https://sunpole.github.io/udream/"><img alt="GitHub Pages" src="https://img.shields.io/badge/Открыть_сайт-GitHub_Pages-222222?logo=github"></a>
  <a href="https://github.com/sunpole/udream/releases"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/sunpole/udream?display_name=tag&sort=semver"></a>
  <a href="https://github.com/sunpole/udream/actions/workflows/validate.yml"><img alt="Проверка проекта" src="https://github.com/sunpole/udream/actions/workflows/validate.yml/badge.svg"></a>
  <a href="https://t.me/uNewsLog"><img alt="Новости в Telegram" src="https://img.shields.io/badge/Telegram-@uNewsLog-26A5E4?logo=telegram&logoColor=white"></a>
  <a href="LICENSE"><img alt="Лицензия кода MIT" src="https://img.shields.io/badge/код-MIT-green"></a>
</p>

![Предварительный вид uDream](preview.jpg)

## О проекте

uDream — статическое веб-приложение для поиска и чтения толкований символов из христианской литературы о снах и видениях. Оно заменяет ручной поиск по большим PDF-файлам удобным мобильным интерфейсом.

Проект работает непосредственно в браузере: сервер, регистрация и база данных на стороне сервера не требуются. Интерфейс исторически показывает название `UDREAM v19`; в семействе проектов и публикациях uNews используется имя `uDream`.

### Возможности

- поиск по символам, синонимам, описаниям и тегам;
- подсказки при вводе и алфавитная навигация;
- карточки символов, перекрёстные ссылки и хлебные крошки;
- история просмотров, светлая и тёмная темы;
- русский и английский интерфейс;
- установка на устройство как PWA;
- каталог сохранённых рабочих версий.

## Открыть

- [Текущий сайт](https://sunpole.github.io/udream/)
- [Сохранённые версии](https://sunpole.github.io/udream/versions/)
- [Релизы](https://github.com/sunpole/udream/releases)
- [Новости разработки в Telegram](https://t.me/uNewsLog)

## Текущее состояние

| Параметр | Значение |
|---|---|
| Стабильная точка восстановления | `v3.6.0` |
| Текущая линия разработки | после `v3.6.0` ещё не начата |
| Историческая метка интерфейса | `v19` |
| Активная база | `data/divinity_code_ru.json` |
| Количество записей | 4 086 |
| Публикация | GitHub Pages из ветки `main` |
| Технологии | HTML, CSS, JavaScript ES Modules, JSON, PWA |

## Структура репозитория

```text
udream/
├── index.html, script.js        # текущий сайт и оркестрация
├── src/                         # поиск, данные, история, локализация и безопасное представление
├── tests/                       # регрессионные тесты модулей
├── manifest.json, sw.js         # PWA и автономная работа
├── favicon.svg, icon-*.png      # оформление сайта
├── data/                        # текущая база и сохранённые варианты данных
├── versions/                    # запускаемые контрольные версии
├── news/                        # патчноуты для uNews и Telegram
├── docs/                        # документация проекта
├── scripts/                     # автоматические проверки репозитория
├── _archive/                    # исторические версии и исходные материалы
├── AGENTS.md                    # обязательные правила разработки
├── CHANGELOG.md                 # история изменений
├── ROADMAP.md                   # планы
└── VERSION.md                   # состояние версий
```

Файлы текущего сайта намеренно находятся в корне: GitHub Pages публикует их напрямую. Исторические эксперименты хранятся отдельно в `_archive/` и не являются рабочим приложением.

Подробная карта находится в [docs/FILE_MAP.md](docs/FILE_MAP.md).

## Локальный запуск

```bash
python3 -m http.server 8019
```

После этого откройте `http://localhost:8019/`. Запуск простым открытием `index.html` через `file://` не считается корректной проверкой: браузеры ограничивают `fetch()` и service worker.

Проверка структуры, базы и патчноутов:

```bash
node scripts/validate-project.mjs
```

## Новости и патчноуты

Каждое пользовательски заметное изменение сопровождается файлом в `news/`. Система [uNews](https://github.com/sunpole/uNews) проверяет новые патчноуты из публичной ветки `main` и через GitHub Actions публикует их в Telegram-канале [@uNewsLog](https://t.me/uNewsLog).

Правила оформления описаны в [docs/NEWS_PUBLISHING.md](docs/NEWS_PUBLISHING.md). Секреты Telegram в этом репозитории не хранятся.

## Авторство, лицензия и исходные книги

© 2026 Антон Магомедов. Программная оболочка, поисковая логика, структура интерфейса и оригинальная документация uDream распространяются по лицензии [MIT](LICENSE).

Тексты книг, выдержки, словарные толкования, иллюстрации и PDF-файлы третьих лиц **не становятся MIT-контентом** и не объявляются собственностью автора приложения. Права на них сохраняются за соответствующими авторами и правообладателями. Репозиторий не является официальным изданием исходных книг.

Владелец проекта сообщает, что сохранённые PDF были получены из открытых источников, где они предлагались для открытого распространения. Конкретные адреса источников и формулировки разрешений ещё предстоит сохранить в репозитории как подтверждение происхождения; до этого проект не приписывает этим материалам неизвестную свободную лицензию.

Подробнее: [права на код и материалы](docs/CONTENT_AND_RIGHTS.md) и [уведомления о сторонних материалах](THIRD_PARTY_NOTICES.md).

## Документация

- [Текущее состояние](docs/PROJECT_STATE.md)
- [Архитектура](docs/ARCHITECTURE.md)
- [Формат базы](docs/DATABASE_FORMAT.md)
- [Карта файлов](docs/FILE_MAP.md)
- [Публикация новостей](docs/NEWS_PUBLISHING.md)
- [Права на код и материалы](docs/CONTENT_AND_RIGHTS.md)
- [Релизы и восстановление](docs/RELEASE_AND_ROLLBACK.md)
- [Исторический контекст](docs/HISTORICAL_CONTEXT.md)
- [План развития](ROADMAP.md)
- [История изменений](CHANGELOG.md)

Вклад в проект принимается по правилам [CONTRIBUTING.md](CONTRIBUTING.md).
