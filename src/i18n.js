// @ts-check

const DEFAULT_LANGUAGE = "ru";

/** @type {Record<string, Record<string, string>>} */
const messages = {
  ru: {
    closeMenu: "✕ Закрыть меню", clearHistory: "🗑 Очистить историю", latin: "Латиница",
    cyrillic: "Кириллица", digits: "Цифры и Color", breadcrumbsSwitch: "Хлебные крошки и стрелки",
    tagsCloudSwitch: "Облако тегов", historyBlockSwitch: "История просмотров",
    selectionSwitch: "Выделение текста", scrollbarSwitch: "Широкий скроллбар",
    versions: "🕘 Версии сайта", openVersions: "Открыть сохранённые версии", books: "📚 Книги",
    booksNotice: "Все данные взяты из этих книг. Книги в свободном доступе, также доступны в проекте для просмотра и скачивания.",
    contacts: "📞 Контакты", church: "Церковь Family of God",
    thanks: "Благодарность Супруге — за вдохновение.<br>Я часть Церкви «Семья Божья», г. Минск.<br>Живите с миром.",
    searchPlaceholder: "Найти символ, алиас или тег...", searchBtn: "Найти", optSymbol: "📖 Название",
    optAliases: "🏷️ Алиасы", optDesc: "📄 Описание", optTags: "🔖 Теги", optAll: "🔍 Везде",
    back: "Назад", forward: "Вперёд", showAll: "📖 Показать все",
    statsLine1: "📁 База: {name}", statsLine2: "📊 Записей: {count}", statsLine3: "📦 Вес: {size}",
    statsLine4: "📄 Символов: {chars}", dbNotLoaded: "База не загружена", loading: "Загрузка базы...",
    empty: "База пуста. Загрузите JSON-файл.", notFound: "😕 Ничего не найдено",
    enterQuery: "Введите слово для поиска", tagFound: "🔍 Найдено {count} символов с тегом \"{tag}\":",
    aliasNotFound: "Символ \"{sym}\" не найден", colorTitle: "🎨 Цвета", digitsTitle: "🔢 Символы с цифрами",
    noDigits: "С цифрами карт нет", noColors: "Цветов пока нет", noData: "Нет данных",
    symbolsForLetter: "Символы на букву {letter} ({count})", noSymbolsForLetter: "Нет символов {letter}",
    matches: "Найдено совпадений: {count}", aliasesLabel: "Синонимы", tagsLabel: "Теги",
    notesLabel: "Заметка", shareText: "Поделиться текстом", shareImage: "Поделиться картинкой",
    shareUnsupported: "Системная функция «Поделиться» недоступна", imageShareUnavailable: "Создание изображения недоступно",
    shareSymbol: "Символ", shareSource: "Источник", shareDate: "Дата", shareDescription: "Описание",
    historyEmpty: "История пуста", historyCleared: "История очищена", manualLoad: "📂 Загрузить JSON",
    invalidJson: "Не удалось прочитать JSON-файл"
  },
  en: {
    closeMenu: "✕ Close menu", clearHistory: "🗑 Clear history", latin: "Latin", cyrillic: "Cyrillic",
    digits: "Digits & Color", breadcrumbsSwitch: "Breadcrumbs & arrows", tagsCloudSwitch: "Tags cloud",
    historyBlockSwitch: "Browsing history", selectionSwitch: "Text selection", scrollbarSwitch: "Wide scrollbar",
    versions: "🕘 Site versions", openVersions: "Open saved versions", books: "📚 Books",
    booksNotice: "All data taken from these books. Books are freely available, also accessible in the project for viewing and downloading.",
    contacts: "📞 Contacts", church: "Family of God Church",
    thanks: "Thanks to my wife for inspiration.<br>I'm part of the Family of God Church, Minsk.<br>Live in peace.",
    searchPlaceholder: "Search symbol, alias or tag...", searchBtn: "Search", optSymbol: "📖 Title",
    optAliases: "🏷️ Aliases", optDesc: "📄 Description", optTags: "🔖 Tags", optAll: "🔍 All",
    back: "Back", forward: "Forward", showAll: "📖 Show all",
    statsLine1: "📁 DB: {name}", statsLine2: "📊 Records: {count}", statsLine3: "📦 Size: {size}",
    statsLine4: "📄 Chars: {chars}", dbNotLoaded: "Database is not loaded", loading: "Loading database...",
    empty: "Database empty. Upload JSON file.", notFound: "😕 Nothing found", enterQuery: "Enter a word to search",
    tagFound: "🔍 Found {count} symbols with tag \"{tag}\":", aliasNotFound: "Symbol \"{sym}\" not found",
    colorTitle: "🎨 Colors", digitsTitle: "🔢 Symbols with digits", noDigits: "No symbols with digits",
    noColors: "No colors yet", noData: "No data", symbolsForLetter: "Symbols for letter {letter} ({count})",
    noSymbolsForLetter: "No symbols {letter}", matches: "Matches: {count}", aliasesLabel: "Aliases",
    tagsLabel: "Tags", notesLabel: "Notes", shareText: "Share as text", shareImage: "Share as image",
    shareUnsupported: "System sharing is not supported", imageShareUnavailable: "Image sharing is not available",
    shareSymbol: "Symbol", shareSource: "Source", shareDate: "Date", shareDescription: "Description",
    historyEmpty: "History is empty", historyCleared: "History cleared", manualLoad: "📂 Upload JSON",
    invalidJson: "Could not read the JSON file"
  }
};

const trustedHtmlKeys = new Set(["thanks"]);

/** @param {unknown} value */
export function normalizeLanguage(value) {
  return value === "en" ? "en" : DEFAULT_LANGUAGE;
}

/**
 * @param {unknown} language
 * @param {string} key
 * @param {Record<string, unknown>} [variables]
 */
export function translate(language, key, variables = {}) {
  const lang = normalizeLanguage(language);
  let result = messages[lang][key] ?? messages[DEFAULT_LANGUAGE][key] ?? key;
  for (const [name, value] of Object.entries(variables)) {
    result = result.split(`{${name}}`).join(String(value ?? ""));
  }
  return result;
}

/** @param {string} key */
export function isTrustedHtmlTranslation(key) {
  return trustedHtmlKeys.has(key);
}

/** @param {unknown} language */
export function getInstructionHtml(language) {
  if (normalizeLanguage(language) === "en") {
    return `
      <button class="close-instruction-btn" id="closeInstructionBtn">&times;</button>
      <h3>📖 How to use the site</h3>
      <p><strong>🔍 Search</strong> — type a word. Choose search scope: title, aliases, description, tags, or all. Autocomplete is available.</p>
      <p><strong>📚 Alphabet</strong> — click a letter to see all symbols starting with it. Latin, Cyrillic, digits and colors can be enabled in the menu.</p>
      <p><strong>🏷️ Tag cloud</strong> — shows tags with record counts. Sort alphabetically or by frequency and click a tag to filter records.</p>
      <p><strong>📜 Browsing history</strong> — stores viewed cards with date and time on this device.</p>
      <p><strong>🍞 Breadcrumbs</strong> — show up to 10 recently viewed symbols. Back and Forward navigate this in-app history.</p>
      <p><strong>🌙 Dark theme</strong> — toggled in the top bar and stored on this device.</p>
      <p><strong>🌐 Two interface languages</strong> — Russian and English. Dictionary records remain in the language of the selected database.</p>
      <p><strong>📱 Installation</strong> — a compatible browser may offer UDREAM as an installable PWA when its requirements are met.</p>
      <p><strong>🔧 Additional settings</strong> — use the menu (☰) to control navigation rows, tags, history, scrollbar and text selection.</p>
      <hr>
      <h3>📖 How to read the dictionary</h3>
      <p>Numbered interpretations are ordered from more likely to less likely. Parentheses clarify context; “cf.” means compare and “ff.” means the following verses.</p>
      <p>Cross-references such as <em>See also Veil</em> point to related symbols. “&amp;” means that the cited verses should be read together.</p>`;
  }

  return `
    <button class="close-instruction-btn" id="closeInstructionBtn">&times;</button>
    <h3>📖 Как пользоваться сайтом</h3>
    <p><strong>🔍 Поиск</strong> — введите слово и выберите область: название, алиасы, описание, теги или везде. Доступно автодополнение.</p>
    <p><strong>📚 Алфавит</strong> — нажмите букву, чтобы увидеть начинающиеся с неё символы. Латиница, кириллица, цифры и цвета включаются в меню.</p>
    <p><strong>🏷️ Облако тегов</strong> — показывает теги с количеством записей. Доступна сортировка по алфавиту или частоте и фильтрация по нажатию.</p>
    <p><strong>📜 История просмотров</strong> — сохраняет просмотренные карточки с датой и временем на этом устройстве.</p>
    <p><strong>🍞 Хлебные крошки</strong> — показывают до 10 недавних символов. Кнопки «Назад» и «Вперёд» перемещают по внутренней истории.</p>
    <p><strong>🌙 Тёмная тема</strong> — переключается в верхней панели и сохраняется на устройстве.</p>
    <p><strong>🌐 Два языка интерфейса</strong> — русский и английский. Записи словаря остаются на языке выбранной базы.</p>
    <p><strong>📱 Установка</strong> — совместимый браузер может предложить установить UDREAM как PWA, когда выполнены его требования.</p>
    <p><strong>🔧 Дополнительные настройки</strong> — меню (☰) управляет строками навигации, тегами, историей, скроллбаром и выделением текста.</p>
    <hr>
    <h3>📖 Как читать словарь</h3>
    <p>Нумерованные толкования идут от более вероятных к менее вероятным. Скобки уточняют контекст; «cf.» означает «сравни», а «ff.» — последующие стихи.</p>
    <p>Перекрёстные ссылки вроде <em>См. также Veil</em> ведут к связанным символам. Знак «&amp;» означает, что указанные стихи следует читать вместе.</p>`;
}

