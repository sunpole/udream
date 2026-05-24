(function(){
    // --- состояние
    let db = [];
    let currentMode = "symbol";
    let theme = localStorage.getItem("clientTheme") || "light";
    let lang = localStorage.getItem("clientLang") || "ru";
    let historyStack = [];
    let historyIndex = -1;
    let lastDisplayedRecord = null;
    let dbLoaded = false;
    let currentDbName = "база по умолчанию";

    // настройки видимости строк алфавита
    let showLatin = localStorage.getItem("showLatin") !== "false";
    let showCyrillic = localStorage.getItem("showCyrillic") !== "false";
    let showDigits = localStorage.getItem("showDigits") !== "false";
    // выделение текста
    let allowSelection = localStorage.getItem("allowSelection") === "true";

    // DOM элементы
    const themeToggle = document.getElementById("themeToggle");
    const langToggle = document.getElementById("langToggle");
    const langToggleText = document.getElementById("langToggleText");
    const burgerBtn = document.getElementById("burgerBtn");
    const menuPanel = document.getElementById("menuPanel");
    const menuOverlay = document.getElementById("menuOverlay");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const statsPanel = document.getElementById("statsPanel");
    const dbInfoPanel = document.getElementById("dbInfoPanel");
    const showHelpBtn = document.getElementById("showHelpBtn");
    const latinRow = document.getElementById("latinRow");
    const cyrillicRow = document.getElementById("cyrillicRow");
    const digitsRow = document.getElementById("digitsRow");
    const alphabetContainer = document.getElementById("alphabetContainer");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const autocompleteList = document.getElementById("autocompleteList");
    const resultCard = document.getElementById("resultCard");
    const backBtn = document.getElementById("backBtn");
    const forwardBtn = document.getElementById("forwardBtn");
    const breadcrumbsDiv = document.getElementById("breadcrumbs");
    const reloadFab = document.getElementById("reloadFab");
    const openTagsModalBtn = document.getElementById("openTagsModalBtn");
    // переключатели в меню
    const toggleLatin = document.getElementById("toggleLatin");
    const toggleCyrillic = document.getElementById("toggleCyrillic");
    const toggleDigits = document.getElementById("toggleDigits");
    const toggleSelection = document.getElementById("toggleSelection");

    // i18n
    const i18n = {
        ru: {
            stats: "📊 Записей: {count} | 📦 Вес: {size}",
            loading: "Загрузка базы...",
            empty: "База пуста. Загрузите JSON-файл.",
            notFound: "😕 Ничего не найдено",
            enterQuery: "Введите слово для поиска",
            tagFound: "🔍 Найдено {count} символов с тегом \"{tag}\":",
            aliasNotFound: "Символ \"{sym}\" не найден",
            back: "Назад", forward: "Вперёд",
            optSymbol: "Название", optAliases: "Алиасы", optDesc: "Описание", optTags: "Теги", optAll: "Везде",
            searchPlaceholder: "Найти символ, алиас или тег...",
            searchBtn: "Найти",
            books: "📚 Книги",
            instructions: "📖 Инструкция",
            close: "Закрыть",
            thanks: "Супруге — за идею и тестирование. Церковь «Семья Божья», Минск. Живите с миром.",
            upload: "Загрузить JSON",
            dbInfo: "📁 База: {name} | 📝 Записей: {count} | 📄 Символов: {chars} | 💾 {size}",
            showAll: "📖 Показать все",
            allTags: "Все теги",
            colorTitle: "🎨 Цвета",
            digitsTitle: "🔢 Символы с цифрами",
            noDigits: "С цифрами карт нет",
            noColors: "Цветов пока нет"
        },
        en: {
            stats: "📊 Records: {count} | 📦 Size: {size}",
            loading: "Loading database...",
            empty: "Database empty. Upload JSON.",
            notFound: "😕 Nothing found",
            enterQuery: "Enter a symbol to search",
            tagFound: "🔍 Found {count} symbols with tag \"{tag}\":",
            aliasNotFound: "Symbol \"{sym}\" not found",
            back: "Back", forward: "Forward",
            optSymbol: "Title", optAliases: "Aliases", optDesc: "Description", optTags: "Tags", optAll: "All",
            searchPlaceholder: "Search symbol, alias or tag...",
            searchBtn: "Search",
            books: "📚 Books",
            instructions: "📖 Instructions",
            close: "Close",
            thanks: "Thanks to my wife for the idea. Family of God Church, Minsk. Live in peace.",
            upload: "Upload JSON",
            dbInfo: "📁 DB: {name} | 📝 Records: {count} | 📄 Chars: {chars} | 💾 {size}",
            showAll: "📖 Show all",
            allTags: "All tags",
            colorTitle: "🎨 Colors",
            digitsTitle: "🔢 Symbols with digits",
            noDigits: "No symbols with digits",
            noColors: "No colors yet"
        }
    };

    function t(key, vars = {}) {
        let str = i18n[lang][key] || i18n.ru[key] || key;
        for(let k in vars) str = str.replace(`{${k}}`, vars[k]);
        return str;
    }

    function applyLocalization() {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.dataset.i18n;
            if(key) el.textContent = t(key);
        });
        searchInput.placeholder = t("searchPlaceholder");
        const searchSpan = document.querySelector("#searchBtn span");
        if(searchSpan) searchSpan.textContent = t("searchBtn");
        document.querySelector("#menuStatsTitle").innerHTML = "📊 " + t("stats").replace(/\s.*/, "");
        updateStatsUI();
        updateDbInfoPanel();
        const thanksDiv = document.querySelector(".footer div:last-child");
        if(thanksDiv) thanksDiv.innerHTML = t("thanks");
        // обновить кнопку "Показать все"
        const showAllBtn = document.getElementById("showAllBtn");
        if(showAllBtn) showAllBtn.innerHTML = t("showAll");
        // обновить кнопку "Все теги"
        const tagsBtn = document.getElementById("openTagsModalBtn");
        if(tagsBtn) {
            const span = tagsBtn.querySelector("span");
            if(span) span.textContent = t("allTags");
        }
    }

    function updateLangToggleButton() { langToggleText.textContent = lang === "ru" ? "EN" : "RU"; }
    function setLang(l) { lang = l; localStorage.setItem("clientLang", l); updateLangToggleButton(); applyLocalization(); if (lastDisplayedRecord) showRecord(lastDisplayedRecord); }
    langToggle.onclick = () => setLang(lang === "ru" ? "en" : "ru");

    function updateStatsUI() {
        if(!db.length) { statsPanel.innerHTML = t("stats", { count: 0, size: "0 KB" }); return; }
        const totalChars = JSON.stringify(db).length;
        let sizeStr = (totalChars / 1024).toFixed(1) + " KB";
        if(totalChars > 1024*1024) sizeStr = (totalChars / (1024*1024)).toFixed(1) + " MB";
        statsPanel.innerHTML = t("stats", { count: db.length, size: sizeStr });
    }

    function updateDbInfoPanel() {
        const totalChars = JSON.stringify(db).length;
        let sizeStr = (totalChars / 1024).toFixed(1) + " KB";
        if(totalChars > 1024*1024) sizeStr = (totalChars / (1024*1024)).toFixed(1) + " MB";
        dbInfoPanel.innerHTML = t("dbInfo", { name: currentDbName, count: db.length, chars: totalChars, size: sizeStr });
    }

    // Цвета для фильтра
    const colorList = ["red","green","blue","yellow","black","white","purple","orange","pink","brown","gray","grey","cyan","magenta","violet","indigo","gold","silver","bronze","beige","coral","ivory","lavender","lime","maroon","navy","olive","tan","teal","turquoise","wheat","amber"];

    // Слова чисел для фильтра цифр
    const digitWordsEn = ["zero","one","two","three","four","five","six","seven","eight","nine","ten"];
    const digitWordsRu = ["ноль","один","два","три","четыре","пять","шесть","семь","восемь","девять","десять"];

    function escapeHtml(str) { if(!str) return ""; return str.replace(/[&<>]/g, m => m==='&'?'&amp;':m==='<'?'&lt;':m==='>'?'&gt;':m); }

    // --- История и крошки
    function addToHistory(record) {
        if(!record) return;
        historyStack = historyStack.slice(0, historyIndex+1);
        historyStack.push({ symbol: record.symbol, id: record.id });
        historyIndex = historyStack.length-1;
        updateHistoryNav();
        renderBreadcrumbs();
    }
    function updateHistoryNav() {
        backBtn.disabled = historyIndex <= 0;
        forwardBtn.disabled = historyIndex >= historyStack.length-1;
    }
    function goBack() {
        if(historyIndex > 0) {
            historyIndex--;
            const rec = db.find(r => r.id === historyStack[historyIndex].id);
            if(rec) showRecord(rec);
        }
    }
    function goForward() {
        if(historyIndex < historyStack.length-1) {
            historyIndex++;
            const rec = db.find(r => r.id === historyStack[historyIndex].id);
            if(rec) showRecord(rec);
        }
    }
    function renderBreadcrumbs() {
        const start = Math.max(0, historyIndex - 9);
        const items = historyStack.slice(start, historyIndex+1);
        breadcrumbsDiv.innerHTML = items.map((item, idx) => {
            const isLast = (start+idx === historyIndex);
            return `<span class="breadcrumb-item" data-id="${item.id}">${escapeHtml(item.symbol)}</span>${!isLast ? '<span class="breadcrumb-arrow"> → </span>' : ''}`;
        }).join("");
        document.querySelectorAll(".breadcrumb-item").forEach(el => {
            el.addEventListener("click", () => {
                const id = parseInt(el.dataset.id);
                const rec = db.find(r => r.id === id);
                if(rec) showRecord(rec);
            });
        });
    }

    // --- Алфавит
    function renderAlphabet() {
        if(!db.length) {
            latinRow.innerHTML = "<span class='alpha-letter'>Нет данных</span>";
            cyrillicRow.innerHTML = "";
            digitsRow.innerHTML = "";
            return;
        }

        const latinLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const cyrillicLetters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");

        // Группировка по первой букве
        const grouped = {};
        db.forEach(item => {
            let first = item.symbol.charAt(0).toUpperCase();
            let letter = /[A-Z]/i.test(first) ? first.toUpperCase() : (/[А-ЯЁ]/i.test(first) ? first.toUpperCase() : null);
            if(letter) {
                if(!grouped[letter]) grouped[letter] = [];
                grouped[letter].push(item);
            }
        });

        // Латиница
        latinRow.innerHTML = latinLetters.map(l => {
            const count = grouped[l] ? grouped[l].length : 0;
            return `<span class="alpha-letter" data-letter="${l}">${l} ${count ? '('+count+')' : ''}</span>`;
        }).join('');

        // Кириллица
        cyrillicRow.innerHTML = cyrillicLetters.map(l => {
            const count = grouped[l] ? grouped[l].length : 0;
            return `<span class="alpha-letter" data-letter="${l}">${l} ${count ? '('+count+')' : ''}</span>`;
        }).join('');

        // Цифры и Color
        digitsRow.innerHTML = `
            <span class="alpha-letter" data-letter="digits">0-9</span>
            <span class="alpha-letter" data-letter="colors">🎨 Color</span>
        `;

        // Кнопка "Показать все"
        let showAllBtn = document.getElementById("showAllBtn");
        if(!showAllBtn) {
            showAllBtn = document.createElement("span");
            showAllBtn.id = "showAllBtn";
            showAllBtn.className = "show-all-btn";
            showAllBtn.innerHTML = t("showAll");
            alphabetContainer.insertBefore(showAllBtn, alphabetContainer.firstChild);
        }
        showAllBtn.onclick = () => showAllSymbols();

        // Применяем видимость строк
        applyAlphabetVisibility();

        // Обработчики для букв
        document.querySelectorAll(".alpha-letter[data-letter]").forEach(el => {
            el.addEventListener("click", () => {
                const letter = el.dataset.letter;
                if(letter === "colors") {
                    showColorSymbols();
                    return;
                }
                if(letter === "digits") {
                    showDigitSymbols();
                    return;
                }
                // Обычная буква
                const filtered = grouped[letter] || [];
                if(filtered.length) {
                    showWordList(filtered, `${lang==='ru'?'Символы на букву':'Symbols starting with'} ${letter}`, letter);
                } else {
                    resultCard.innerHTML = `<div>${lang==='ru'?'Нет символов на букву':'No symbols for letter'} ${letter}</div>`;
                }
            });
        });
    }

    function applyAlphabetVisibility() {
        latinRow.style.display = showLatin ? '' : 'none';
        cyrillicRow.style.display = showCyrillic ? '' : 'none';
        digitsRow.style.display = showDigits ? '' : 'none';
    }

    function showAllSymbols() {
        showWordList([...db], t("showAll"), "all");
    }

    function showColorSymbols() {
        const filtered = db.filter(item => colorList.includes(item.symbol.toLowerCase()));
        if(filtered.length) {
            showWordList(filtered, t("colorTitle"), "colors");
        } else {
            resultCard.innerHTML = `<div>${t("noColors")}</div>`;
        }
    }

    function showDigitSymbols() {
        const digitPattern = /\d/;
        const filtered = db.filter(item => {
            const sym = item.symbol.toLowerCase();
            if(digitPattern.test(sym)) return true;
            // Проверка слов
            for(let word of digitWordsEn.concat(digitWordsRu)) {
                if(sym.includes(word)) return true;
            }
            return false;
        });
        if(filtered.length) {
            showWordList(filtered, t("digitsTitle"), "digits");
        } else {
            resultCard.innerHTML = `<div>${t("noDigits")}</div>`;
        }
    }

    function showWordList(list, title, contextId = null) {
        const container = document.createElement("div");
        container.innerHTML = `
            <div class="stats-header">
                <strong>${escapeHtml(title)} (${list.length})</strong>
                <button class="eye-icon toggle-words-btn"><i class="fas fa-eye"></i></button>
            </div>
            <div class="word-list words-list-content">
                ${list.map(r => `<div class="word-item" data-id="${r.id}">${escapeHtml(r.symbol)}</div>`).join("")}
            </div>
        `;
        resultCard.innerHTML = "";
        resultCard.appendChild(container);

        // глазок
        const eyeBtn = container.querySelector(".toggle-words-btn");
        const listDiv = container.querySelector(".words-list-content");
        let visible = true;
        eyeBtn.addEventListener("click", () => {
            if(visible) {
                listDiv.classList.add("collapsed");
                eyeBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                listDiv.classList.remove("collapsed");
                eyeBtn.innerHTML = '<i class="fas fa-eye"></i>';
            }
            visible = !visible;
        });

        // клики по словам
        container.querySelectorAll(".word-item").forEach(el => {
            el.addEventListener("click", () => {
                const id = parseInt(el.dataset.id);
                const rec = db.find(r => r.id === id);
                if(rec) { showRecord(rec); addToHistory(rec); }
            });
        });
    }

    // --- Отображение карточки
    function showRecord(record) {
        if(!record) return;
        lastDisplayedRecord = record;
        const sourceText = record.source ? `<i class="fas fa-book"></i> ${escapeHtml(record.source)}` : "";
        const dateText = record.date_added ? `📅 ${record.date_added}` : "";
        const aliasesHtml = (record.aliases && record.aliases.length) ? `
            <div class="aliases"><strong>🔗 ${lang==='ru'?'Синонимы':'Aliases'}:</strong> ${record.aliases.map(a => `<span class="tag alias-tag" data-symbol="${escapeHtml(a)}">${escapeHtml(a)}</span>`).join(" ")}</div>
        ` : "";
        const tagsHtml = (record.tags && record.tags.length) ? `
            <div class="tags"><strong>🏷️ ${lang==='ru'?'Теги':'Tags'}:</strong> ${record.tags.map(t => `<span class="tag tag-filter" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`).join(" ")}</div>
        ` : "";
        const notesHtml = record.notes ? `<div class="notes"><b>📝 ${lang==='ru'?'Заметка':'Notes'}:</b><br>${marked.parse(record.notes)}</div>` : "";
        resultCard.innerHTML = `
            <div class="symbol-name">${escapeHtml(record.symbol)}</div>
            <div class="meta">${sourceText} ${dateText}</div>
            ${aliasesHtml}
            <div class="desc">${escapeHtml(record.description)}</div>
            ${tagsHtml}
            ${notesHtml}
        `;
        // алиасы
        document.querySelectorAll(".alias-tag").forEach(el => {
            el.addEventListener("click", () => {
                const sym = el.dataset.symbol;
                const found = db.find(r => r.symbol.toLowerCase() === sym.toLowerCase());
                if(found) { showRecord(found); addToHistory(found); }
                else alert(t("aliasNotFound", { sym }));
            });
        });
        // теги
        document.querySelectorAll(".tag-filter").forEach(el => {
            el.addEventListener("click", () => {
                const tag = el.dataset.tag;
                const filtered = db.filter(r => r.tags && r.tags.includes(tag));
                if(filtered.length) {
                    showWordList(filtered, t("tagFound", { count: filtered.length, tag }), tag);
                } else alert("Нет символов с таким тегом");
            });
        });
    }

    // --- Поиск с автодополнением
    function updateAutocomplete() {
        const q = searchInput.value.trim().toLowerCase();
        if(!q) { autocompleteList.classList.remove("show"); return; }
        const matches = db.filter(item => item.symbol.toLowerCase().includes(q) || (item.aliases && item.aliases.some(a=>a.toLowerCase().includes(q)))).slice(0,8);
        if(matches.length) {
            autocompleteList.innerHTML = matches.map(m => `<div class="autocomplete-item" data-id="${m.id}">${escapeHtml(m.symbol)}</div>`).join("");
            autocompleteList.classList.add("show");
            document.querySelectorAll(".autocomplete-item").forEach(el => {
                el.addEventListener("click", () => {
                    const id = parseInt(el.dataset.id);
                    const rec = db.find(r => r.id === id);
                    if(rec) { showRecord(rec); addToHistory(rec); }
                    autocompleteList.classList.remove("show");
                });
            });
        } else autocompleteList.classList.remove("show");
    }

    function performSearch() {
        const q = searchInput.value.trim().toLowerCase();
        if(!q) { resultCard.innerHTML = `<div>${t("enterQuery")}</div>`; return; }
        let filtered = [];
        for(let item of db) {
            let match = false;
            if(currentMode === "symbol") match = item.symbol.toLowerCase().includes(q) || (item.aliases && item.aliases.some(a=>a.toLowerCase().includes(q)));
            else if(currentMode === "aliases") match = item.aliases && item.aliases.some(a=>a.toLowerCase().includes(q));
            else if(currentMode === "desc") match = (item.description || "").toLowerCase().includes(q);
            else if(currentMode === "tags") match = item.tags && item.tags.some(t=>t.toLowerCase().includes(q));
            else if(currentMode === "all") match = item.symbol.toLowerCase().includes(q) || (item.aliases && item.aliases.some(a=>a.toLowerCase().includes(q))) || (item.description || "").toLowerCase().includes(q) || (item.tags && item.tags.some(t=>t.toLowerCase().includes(q)));
            if(match) filtered.push(item);
        }
        if(filtered.length === 0) { resultCard.innerHTML = `<div>${t("notFound")}</div>`; return; }
        if(filtered.length === 1) { showRecord(filtered[0]); addToHistory(filtered[0]); }
        else {
            showWordList(filtered, `${lang==='ru'?'Найдено совпадений':'Matches'}: ${filtered.length}`, "search");
        }
    }

    // --- Модалка "Все теги"
    function showAllTagsModal() {
        const allTags = new Set();
        db.forEach(item => {
            if(item.tags) item.tags.forEach(t => allTags.add(t));
        });
        const sorted = Array.from(allTags).sort((a,b) => a.localeCompare(b));
        if(!sorted.length) {
            alert("Нет тегов в базе");
            return;
        }
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.innerHTML = `
            <div class="modal-content">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4>🏷️ ${t("allTags")}</h4>
                    <button class="mini-btn close-modal-btn">✖</button>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.8rem;">
                    ${sorted.map(tag => `<span class="tag tag-modal-item" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</span>`).join("")}
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector(".close-modal-btn");
        const closeModal = () => overlay.remove();
        closeBtn.addEventListener("click", closeModal);
        overlay.addEventListener("click", (e) => { if(e.target === overlay) closeModal(); });

        overlay.querySelectorAll(".tag-modal-item").forEach(el => {
            el.addEventListener("click", () => {
                const tag = el.dataset.tag;
                const filtered = db.filter(r => r.tags && r.tags.includes(tag));
                if(filtered.length) {
                    showWordList(filtered, t("tagFound", { count: filtered.length, tag }), tag);
                }
                closeModal();
            });
        });
    }

    // --- Инструкция (та же)
    function showHelpModal() {
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.innerHTML = `
            <div class="modal-content">
                <div style="display:flex; justify-content:flex-end;"><button class="mini-btn close-modal-btn">✖</button></div>
                <h3>📖 ${lang==='ru'?'Как пользоваться словарём':'How to use the dictionary'}</h3>
                <p><strong>Curtains (занавесы):</strong> (1) Плотская завеса; (2) Сердце; (3) Небеса; (4) Покрытие; (5) Окончание; (6) Смерть.<br><em>См. также Veil.</em><br>(1) Евр.10:20; (2) 2Кор.3:15; (3) Пс.103:2; Ис.40:22</p>
                <ul><li>• Нумерованные толкования от наиболее вероятного к наименее.</li><li>• Скобки уточняют контекст.</li><li>• Перекрёстные ссылки.</li></ul>
                <p><strong>Life Raft:</strong> (1) Нужда в спасении; (2) Потерянный; (3) В опасности потерять спасение; (4) Ковчег (Христос).<br><em>См. также Adrift, Boat, Sea.</em></p>
                <p>• cf. = сравни, ff. = и следующие.</p>
                <p><strong>Mouse/Mice:</strong> (1) Скрытый нечистый дух; (2) Показатель духовного обслуживания; (3) Неверующий (нечистый); (4) Малый; (5) Язва; (6) Суд.<br>‘&’ = объединить стихи.</p>
            </div>
        `;
        document.body.appendChild(overlay);
        const closeBtn = overlay.querySelector(".close-modal-btn");
        const closeModal = () => overlay.remove();
        closeBtn.addEventListener("click", closeModal);
        overlay.addEventListener("click", (e) => { if(e.target === overlay) closeModal(); });
    }

    // --- Тема
    function setTheme(th) { theme = th; localStorage.setItem("clientTheme", th); if(th === "dark") document.body.classList.add("dark"); else document.body.classList.remove("dark"); }
    themeToggle.onclick = () => setTheme(theme === "light" ? "dark" : "light");

    // --- Выделение текста
    function applySelectionSetting() {
        if(allowSelection) {
            document.body.classList.add("allow-selection");
        } else {
            document.body.classList.remove("allow-selection");
        }
    }
    function setSelectionAllowed(val) {
        allowSelection = val;
        localStorage.setItem("allowSelection", val);
        toggleSelection.checked = val;
        applySelectionSetting();
    }

    // --- Обработчики
    searchInput.addEventListener("input", () => { updateAutocomplete(); performSearch(); });
    searchBtn.addEventListener("click", () => { autocompleteList.classList.remove("show"); performSearch(); });
    document.querySelectorAll("[data-opt]").forEach(opt => {
        opt.addEventListener("click", () => {
            document.querySelectorAll("[data-opt]").forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            currentMode = opt.dataset.opt;
            performSearch();
        });
    });

    function toggleMenu(open) {
        if(open) {
            menuPanel.classList.add("open");
            menuOverlay.classList.add("open");
        } else {
            menuPanel.classList.remove("open");
            menuOverlay.classList.remove("open");
        }
    }
    burgerBtn.onclick = () => toggleMenu(true);
    closeMenuBtn.onclick = () => toggleMenu(false);
    menuOverlay.onclick = () => toggleMenu(false);
    showHelpBtn.onclick = () => showHelpModal();
    backBtn.onclick = () => goBack();
    forwardBtn.onclick = () => goForward();
    reloadFab.onclick = () => tryAutoLoad();
    openTagsModalBtn.onclick = () => showAllTagsModal();

    // Переключатели в меню
    toggleLatin.checked = showLatin;
    toggleCyrillic.checked = showCyrillic;
    toggleDigits.checked = showDigits;
    toggleSelection.checked = allowSelection;

    toggleLatin.addEventListener("change", () => {
        showLatin = toggleLatin.checked;
        localStorage.setItem("showLatin", showLatin);
        applyAlphabetVisibility();
    });
    toggleCyrillic.addEventListener("change", () => {
        showCyrillic = toggleCyrillic.checked;
        localStorage.setItem("showCyrillic", showCyrillic);
        applyAlphabetVisibility();
    });
    toggleDigits.addEventListener("change", () => {
        showDigits = toggleDigits.checked;
        localStorage.setItem("showDigits", showDigits);
        applyAlphabetVisibility();
    });
    toggleSelection.addEventListener("change", () => {
        setSelectionAllowed(toggleSelection.checked);
    });

    // Загрузка JSON
    async function tryAutoLoad() {
        resultCard.innerHTML = `<div class="loader"></div><div style="text-align:center">${t("loading")}</div>`;
        const paths = ["/udream/data/db.json", "data/db.json", "../data/db.json"];
        for (let url of paths) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length) {
                        db = data;
                        currentDbName = url.split('/').pop();
                        updateStatsUI(); updateDbInfoPanel();
                        renderAlphabet();
                        if(db.length) {
                            showRecord(db[0]); addToHistory(db[0]);
                        } else {
                            resultCard.innerHTML = `<div>${t("empty")}</div>`;
                        }
                        dbLoaded = true;
                        return;
                    }
                }
            } catch(e) {}
        }
        dbLoaded = false;
        db = [];
        updateStatsUI(); updateDbInfoPanel();
        resultCard.innerHTML = `<div>⚠️ ${t("empty")}<br><button id="manualLoadBtn" class="mini-btn" style="margin-top:1rem;">📂 ${t("upload")}</button></div>`;
        document.getElementById("manualLoadBtn")?.addEventListener("click", () => {
            const inp = document.createElement("input"); inp.type="file"; inp.accept="application/json";
            inp.onchange = e => {
                const file = e.target.files[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        if(Array.isArray(data) && data.length) {
                            db = data;
                            currentDbName = file.name;
                            updateStatsUI(); updateDbInfoPanel();
                            renderAlphabet();
                            if(db.length) { showRecord(db[0]); addToHistory(db[0]); }
                            else resultCard.innerHTML = `<div>${t("empty")}</div>`;
                            dbLoaded = true;
                        } else throw new Error("Не массив");
                    } catch(err) { alert("Ошибка: файл должен быть массивом JSON"); }
                };
                reader.readAsText(file);
            };
            inp.click();
        });
        renderAlphabet();
    }

    // Инициализация
    setTheme(theme);
    updateLangToggleButton();
    setLang(lang);
    applySelectionSetting();
    applyAlphabetVisibility();
    tryAutoLoad();
})();
