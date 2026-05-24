// script.js — UDREAM v13.2 (исправленный)
(function() {
    // --- состояние
    let db = [];
    let currentMode = "symbol";
    let theme = localStorage.getItem("clientTheme") || "light";
    let lang = localStorage.getItem("clientLang") || "ru";
    let historyStack = [];
    let historyIndex = -1;
    let lastDisplayedRecord = null;
    let currentDbName = "";
    let showLatin = true, showCyrillic = true, showDigits = true;
    let textSelectionAllowed = false; // по умолчанию запрещено

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
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const autocompleteList = document.getElementById("autocompleteList");
    const resultCard = document.getElementById("resultCard");
    const backBtn = document.getElementById("backBtn");
    const forwardBtn = document.getElementById("forwardBtn");
    const breadcrumbsDiv = document.getElementById("breadcrumbs");
    const reloadFab = document.getElementById("reloadFab");
    const book1Link = document.getElementById("book1Link");
    const book2Link = document.getElementById("book2Link");
    const loadFileBtn = document.getElementById("loadFileBtn");
    const logoHomeBtn = document.getElementById("logoHomeBtn");
    const showAllWrapper = document.getElementById("showAllWrapper");
    const tagsCloudDiv = document.getElementById("tagsCloud");
    const tagsListDiv = document.getElementById("tagsList");
    const closeTagsCloudBtn = document.getElementById("closeTagsCloud");
    const toggleLatinBtn = document.getElementById("toggleLatinBtn");
    const toggleCyrillicBtn = document.getElementById("toggleCyrillicBtn");
    const toggleDigitsBtn = document.getElementById("toggleDigitsBtn");
    const toggleSelectBtn = document.getElementById("toggleSelectBtn");

    // i18n
    const i18n = {
        ru: {
            stats: "📊 Записей: {count} | 📦 Вес: {size}",
            loading: "Загрузка базы...",
            empty: "База пуста. Убедитесь, что файл /udream/data/db.json существует.",
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
            showAll: "📖 Показать все ({count})",
            allowSelect: "✅ Разрешить",
            forbidSelect: "🚫 Запретить"
        },
        en: {
            stats: "📊 Records: {count} | 📦 Size: {size}",
            loading: "Loading database...",
            empty: "Database empty. Make sure /udream/data/db.json exists.",
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
            showAll: "📖 Show all ({count})",
            allowSelect: "✅ Allow",
            forbidSelect: "🚫 Forbid"
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
        document.querySelector("#uploadBtnText").textContent = t("upload");
        document.querySelector("#helpBtnText").textContent = t("instructions");
        document.querySelector("#closeBtnText").textContent = t("close");
        // обновить текст кнопки выделения в зависимости от состояния
        if(textSelectionAllowed) {
            toggleSelectBtn.textContent = t("allowSelect");
            toggleSelectBtn.classList.add("active");
        } else {
            toggleSelectBtn.textContent = t("forbidSelect");
            toggleSelectBtn.classList.remove("active");
        }
        updateStatsUI();
        updateDbInfoPanel();
        const thanksDiv = document.querySelector(".footer div:last-child");
        if(thanksDiv) thanksDiv.innerHTML = t("thanks");
        const showAllBtn = document.getElementById("showAllBtn");
        if(showAllBtn && db.length) {
            showAllBtn.innerHTML = t("showAll", { count: db.length });
        }
    }

    function updateLangToggleButton() {
        langToggleText.textContent = lang === "ru" ? "EN" : "RU";
    }
    function setLang(l) {
        lang = l;
        localStorage.setItem("clientLang", l);
        updateLangToggleButton();
        applyLocalization();
        if (lastDisplayedRecord) showRecord(lastDisplayedRecord);
    }
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
        dbInfoPanel.innerHTML = t("dbInfo", { name: currentDbName || "не загружена", count: db.length, chars: totalChars, size: sizeStr });
    }

    // Загрузка JSON из выбранного файла (ручная)
    function loadJSONFromFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    db = data;
                    currentDbName = file.name;
                    updateStatsUI(); updateDbInfoPanel();
                    buildAlphabetRows();
                    rebuildTagsCloud();
                    if (db.length) {
                        showRecord(db[0]);
                        addToHistory(db[0]);
                    } else {
                        resultCard.innerHTML = `<div>${t("empty")}</div>`;
                    }
                } else throw new Error("Не массив");
            } catch(err) { alert("Ошибка: файл должен быть массивом JSON"); }
        };
        reader.readAsText(file);
    }

    // Автоматическая загрузка из /udream/data/db.json (или других путей)
    async function loadMainDatabase() {
        resultCard.innerHTML = `<div class="loader"></div><div style="text-align:center">${t("loading")}</div>`;
        // Определяем базовый путь: если страница открыта из папки 13, то корень проекта на уровень выше
        const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        const possiblePaths = [
            "/udream/data/db.json",                           // абсолютный путь от корня сайта
            basePath + "data/db.json",                        // data/db.json относительно текущей папки
            "./data/db.json",
            "../data/db.json",
            "/data/db.json"
        ];
        for (let url of possiblePaths) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length) {
                        db = data;
                        currentDbName = url.split('/').pop();
                        updateStatsUI(); updateDbInfoPanel();
                        buildAlphabetRows();
                        rebuildTagsCloud();
                        showRecord(db[0]);
                        addToHistory(db[0]);
                        return;
                    } else {
                        console.warn("Файл найден, но не является массивом:", url);
                    }
                }
            } catch(e) {}
        }
        // Если не загрузилось, показываем сообщение и кнопку ручной загрузки
        db = [];
        updateStatsUI(); updateDbInfoPanel();
        resultCard.innerHTML = `<div>⚠️ ${t("empty")}<br><button id="manualLoadBtn" class="mini-btn" style="margin-top:1rem;">📂 ${t("upload")}</button></div>`;
        document.getElementById("manualLoadBtn")?.addEventListener("click", () => {
            const inp = document.createElement("input"); inp.type="file"; inp.accept="application/json";
            inp.onchange = e => { if(e.target.files[0]) loadJSONFromFile(e.target.files[0]); };
            inp.click();
        });
        buildAlphabetRows(); // очистит алфавит
        rebuildTagsCloud();
    }

    function escapeHtml(str) { if(!str) return ""; return str.replace(/[&<>]/g, m => m==='&'?'&amp;':m==='<'?'&lt;':m==='>'?'&gt;':m); }

    // Список цветов для кнопки Color
    const colorNames = [
        "red", "green", "blue", "yellow", "black", "white", "purple", "orange",
        "pink", "brown", "gray", "grey", "cyan", "magenta", "violet", "indigo",
        "gold", "silver", "bronze", "beige", "coral", "ivory", "lavender", "lime",
        "maroon", "navy", "olive", "tan", "teal", "turquoise", "wheat", "amber"
    ];
    function filterColorSymbols() {
        return db.filter(item => colorNames.includes(item.symbol.toLowerCase()) || (item.tags && item.tags.some(t => colorNames.includes(t.toLowerCase()))));
    }

    let groupedAll = {};
    function buildAlphabetRows() {
        // Очищаем все строки
        latinRow.innerHTML = "";
        cyrillicRow.innerHTML = "";
        digitsRow.innerHTML = "";
        showAllWrapper.innerHTML = "";
        if(!db.length) return;
        
        groupedAll = {};
        db.forEach(item => {
            let first = item.symbol.charAt(0).toUpperCase();
            let letter = /[A-Z]/i.test(first) ? first.toUpperCase() : (/[А-ЯЁ]/i.test(first) ? first.toUpperCase() : (/[0-9]/.test(first) ? "0-9" : "#"));
            if(!groupedAll[letter]) groupedAll[letter] = [];
            groupedAll[letter].push(item);
        });
        const latinLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const cyrillicLetters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");
        
        function renderRow(container, letters, type, extraItems = []) {
            if(!container) return;
            let html = "";
            for(let l of letters) {
                const count = groupedAll[l] ? groupedAll[l].length : 0;
                html += `<span class="alpha-letter" data-letter="${l}" data-type="${type}">${l} ${count ? '('+count+')' : ''}</span>`;
            }
            for(let extra of extraItems) {
                html += `<span class="alpha-letter" data-letter="${extra.value}" data-type="${type}">${extra.label}</span>`;
            }
            container.innerHTML = html;
            container.querySelectorAll(".alpha-letter").forEach(el => {
                let visible = true;
                if(type === "latin") visible = showLatin;
                else if(type === "cyrillic") visible = showCyrillic;
                else if(type === "digits") visible = showDigits;
                el.style.display = visible ? "inline-block" : "none";
                el.addEventListener("click", (e) => {
                    const letter = el.dataset.letter;
                    if(letter === "colors") {
                        const colorSymbols = filterColorSymbols();
                        if(colorSymbols.length) {
                            showWordList(colorSymbols.map(r => ({ id: r.id, symbol: r.symbol })), `🎨 ${lang==='ru'?'Символы-цвета':'Color symbols'} (${colorSymbols.length})`);
                        } else {
                            resultCard.innerHTML = "<div>Нет цветовых символов</div>";
                        }
                        return;
                    }
                    let items = groupedAll[letter] || [];
                    if(items.length) {
                        showWordList(items, `🔍 ${lang==='ru'?'Символы на букву':'Symbols starting with'} ${letter}: (${items.length})`);
                    } else {
                        resultCard.innerHTML = "<div>Нет символов</div>";
                    }
                });
            });
        }
        renderRow(latinRow, latinLetters, "latin");
        renderRow(cyrillicRow, cyrillicLetters, "cyrillic");
        renderRow(digitsRow, ["0-9"], "digits", [{ value: "colors", label: "🎨 Color" }]);

        showAllWrapper.innerHTML = `<button id="showAllBtn" class="mini-btn" style="background:var(--bg-active); color:white;">${t("showAll", { count: db.length })}</button>`;
        document.getElementById("showAllBtn")?.addEventListener("click", () => {
            showWordList(db.map(item => ({ id: item.id, symbol: item.symbol })), `📖 ${lang==='ru'?'Все символы':'All symbols'} (${db.length})`);
        });
    }

    function showWordList(items, title) {
        const container = document.createElement("div");
        const blockId = "dynamicWordList" + Date.now();
        container.id = blockId;
        container.innerHTML = `
            <div class="stats-header">
                <div><strong>${title}</strong></div>
                <button class="eye-icon" id="toggleWordListEye"><i class="fas fa-eye"></i></button>
            </div>
            <div id="wordListContent" class="word-list">${items.map(r => `<div class="word-item" data-id="${r.id}">${escapeHtml(r.symbol)}</div>`).join("")}</div>
        `;
        resultCard.innerHTML = "";
        resultCard.appendChild(container);
        document.querySelectorAll(".word-item").forEach(el => {
            el.addEventListener("click", () => {
                const rec = db.find(r => r.id === parseInt(el.dataset.id));
                if(rec) { showRecord(rec); addToHistory(rec); }
            });
        });
        const eye = document.getElementById("toggleWordListEye");
        let visible = true;
        eye.addEventListener("click", () => {
            const content = document.getElementById("wordListContent");
            if(visible) {
                content.classList.add("collapsed");
                eye.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                content.classList.remove("collapsed");
                eye.innerHTML = '<i class="fas fa-eye"></i>';
            }
            visible = !visible;
        });
    }

    // История и крошки
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

    // Отображение карточки
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
        document.querySelectorAll(".alias-tag").forEach(el => {
            el.addEventListener("click", () => {
                const sym = el.dataset.symbol;
                const found = db.find(r => r.symbol.toLowerCase() === sym.toLowerCase());
                if(found) { showRecord(found); addToHistory(found); }
                else alert(t("aliasNotFound", { sym }));
            });
        });
        document.querySelectorAll(".tag-filter").forEach(el => {
            el.addEventListener("click", () => {
                const tag = el.dataset.tag;
                const filtered = db.filter(r => r.tags && r.tags.includes(tag));
                if(filtered.length) {
                    showWordList(filtered.map(r => ({ id: r.id, symbol: r.symbol })), t("tagFound", { count: filtered.length, tag }));
                } else alert("Нет символов с таким тегом");
            });
        });
    }

    // Облако тегов
    let allTagsSet = new Set();
    function rebuildTagsCloud() {
        if(!db.length) {
            tagsCloudDiv.style.display = "none";
            return;
        }
        allTagsSet.clear();
        db.forEach(item => {
            if(item.tags) item.tags.forEach(t => allTagsSet.add(t));
        });
        const sortedTags = Array.from(allTagsSet).sort((a,b) => a.localeCompare(b));
        if(sortedTags.length === 0) {
            tagsCloudDiv.style.display = "none";
            return;
        }
        tagsListDiv.innerHTML = sortedTags.map(tag => `<span class="tag tag-cloud-item" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</span>`).join("");
        tagsListDiv.querySelectorAll(".tag-cloud-item").forEach(el => {
            el.addEventListener("click", () => {
                const tag = el.dataset.tag;
                const filtered = db.filter(r => r.tags && r.tags.includes(tag));
                if(filtered.length) {
                    showWordList(filtered.map(r => ({ id: r.id, symbol: r.symbol })), t("tagFound", { count: filtered.length, tag }));
                }
            });
        });
        tagsCloudDiv.style.display = "block";
    }
    function closeTagsCloud() {
        tagsCloudDiv.style.display = "none";
    }
    closeTagsCloudBtn.addEventListener("click", closeTagsCloud);

    // Поиск
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
            showWordList(filtered.map(r => ({ id: r.id, symbol: r.symbol })), `🔍 ${lang==='ru'?`Найдено ${filtered.length} совпадений`:`Found ${filtered.length} matches`}`);
        }
    }

    // Инструкция
    function showHelpModal() {
        const modal = document.createElement("div");
        modal.className = "modal";
        Object.assign(modal.style, {position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000});
        modal.innerHTML = `<div style="background: var(--bg-card); max-width:500px; width:90%; border-radius:32px; padding:1.5rem; max-height:80%; overflow:auto;">
            <div style="display:flex; justify-content:flex-end;"><button id="closeModalBtn" class="mini-btn">✖</button></div>
            <h3>📖 ${lang==='ru'?'Как пользоваться словарём':'How to use the dictionary'}</h3>
            <p><strong>Curtains (занавесы):</strong> (1) Плотская завеса; (2) Сердце; (3) Небеса; (4) Покрытие; (5) Окончание; (6) Смерть.<br><em>См. также Veil.</em><br>(1) Евр.10:20; (2) 2Кор.3:15; (3) Пс.103:2; Ис.40:22</p>
            <ul><li>• Нумерованные толкования от наиболее вероятного к наименее.</li><li>• Скобки уточняют контекст.</li><li>• Перекрёстные ссылки.</li></ul>
            <p><strong>Life Raft:</strong> (1) Нужда в спасении; (2) Потерянный; (3) В опасности потерять спасение; (4) Ковчег (Христос).<br><em>См. также Adrift, Boat, Sea.</em></p>
            <p>• cf. = сравни, ff. = и следующие.</p>
            <p><strong>Mouse/Mice:</strong> (1) Скрытый нечистый дух; (2) Показатель духовного обслуживания; (3) Неверующий (нечистый); (4) Малый; (5) Язва; (6) Суд.<br>‘&’ = объединить стихи.</p>
        </div>`;
        document.body.appendChild(modal);
        modal.querySelector("#closeModalBtn").onclick = () => modal.remove();
        modal.addEventListener("click", (e) => { if(e.target === modal) modal.remove(); });
    }

    // Тема
    function setTheme(th) { theme = th; localStorage.setItem("clientTheme", th); if(th === "dark") document.body.classList.add("dark"); else document.body.classList.remove("dark"); }
    themeToggle.onclick = () => setTheme(theme === "light" ? "dark" : "light");
    setTheme(theme);

    // Выделение текста
    function setTextSelection(allow) {
        textSelectionAllowed = allow;
        if(allow) {
            document.body.classList.remove("no-select");
            toggleSelectBtn.textContent = t("allowSelect");
            toggleSelectBtn.classList.add("active");
        } else {
            document.body.classList.add("no-select");
            toggleSelectBtn.textContent = t("forbidSelect");
            toggleSelectBtn.classList.remove("active");
        }
    }
    toggleSelectBtn.addEventListener("click", () => {
        setTextSelection(!textSelectionAllowed);
    });
    setTextSelection(false); // по умолчанию запрещено

    // Видимость строк алфавита
    function updateAlphabetRowsVisibility() {
        document.querySelectorAll("#latinRow .alpha-letter").forEach(el => { el.style.display = showLatin ? "inline-block" : "none"; });
        document.querySelectorAll("#cyrillicRow .alpha-letter").forEach(el => { el.style.display = showCyrillic ? "inline-block" : "none"; });
        document.querySelectorAll("#digitsRow .alpha-letter").forEach(el => { el.style.display = showDigits ? "inline-block" : "none"; });
        toggleLatinBtn.classList.toggle("active", showLatin);
        toggleCyrillicBtn.classList.toggle("active", showCyrillic);
        toggleDigitsBtn.classList.toggle("active", showDigits);
    }
    toggleLatinBtn.addEventListener("click", () => { showLatin = !showLatin; updateAlphabetRowsVisibility(); });
    toggleCyrillicBtn.addEventListener("click", () => { showCyrillic = !showCyrillic; updateAlphabetRowsVisibility(); });
    toggleDigitsBtn.addEventListener("click", () => { showDigits = !showDigits; updateAlphabetRowsVisibility(); });

    // Гамбургер
    function toggleMenu(open) { if(open) { menuPanel.classList.add("open"); menuOverlay.classList.add("open"); } else { menuPanel.classList.remove("open"); menuOverlay.classList.remove("open"); } }
    burgerBtn.onclick = () => toggleMenu(true);
    closeMenuBtn.onclick = () => toggleMenu(false);
    menuOverlay.onclick = () => toggleMenu(false);

    // Кнопки загрузки
    loadFileBtn.onclick = () => {
        const inp = document.createElement("input");
        inp.type = "file";
        inp.accept = "application/json";
        inp.onchange = e => { if(e.target.files[0]) loadJSONFromFile(e.target.files[0]); };
        inp.click();
    };
    reloadFab.onclick = () => loadMainDatabase();

    // Логотип – переход на главную страницу проекта (корень)
    logoHomeBtn.addEventListener("click", () => {
        window.location.href = "/udream/";
    });

    // Ссылки на PDF
    book1Link.href = "/udream/The_Divinity_Code_to_Understanding_Your_Dreams_and_Visions_PDF_Room.pdf";
    book2Link.href = "/udream/Unlocking-Your-Dream-Student-Ma.pdf";

    // Обработчики поиска
    document.querySelectorAll("[data-opt]").forEach(opt => {
        opt.addEventListener("click", () => {
            document.querySelectorAll("[data-opt]").forEach(o => o.classList.remove("active"));
            opt.classList.add("active");
            currentMode = opt.dataset.opt;
            performSearch();
        });
    });
    searchInput.addEventListener("input", () => { updateAutocomplete(); performSearch(); });
    searchBtn.addEventListener("click", () => { autocompleteList.classList.remove("show"); performSearch(); });

    backBtn.addEventListener("click", goBack);
    forwardBtn.addEventListener("click", goForward);
    showHelpBtn.addEventListener("click", showHelpModal);

    // Кнопка тегов в поиске
    const tagsBtn = document.createElement("button");
    tagsBtn.className = "mini-btn";
    tagsBtn.innerHTML = "<i class='fas fa-tags'></i> Теги";
    tagsBtn.style.marginLeft = "0.5rem";
    document.querySelector(".search-options").appendChild(tagsBtn);
    tagsBtn.addEventListener("click", () => {
        rebuildTagsCloud();
    });

    // Инициализация
    updateLangToggleButton();
    setLang(lang);
    loadMainDatabase(); // загружаем основную базу из /udream/data/db.json
})();
