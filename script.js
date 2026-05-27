(function(){
    // ---------- СОСТОЯНИЕ ----------
    let db = [];
    let currentMode = "symbol";
    let theme = localStorage.getItem("clientTheme") || "light";
    let lang = localStorage.getItem("clientLang") || "ru";
    let historyStack = [];
    let historyIndex = -1;
    let lastDisplayedRecord = null;
    let dbLoaded = false;
    // let currentDbName = "bd2.json";
    let currentDbName = "divinity_code_ru.json";

    let fullHistory = JSON.parse(localStorage.getItem("fullHistory") || "[]");

    // настройки видимости (по умолчанию включены только хлебные крошки)
    let showLatin = localStorage.getItem("showLatin") === "true";
    let showCyrillic = localStorage.getItem("showCyrillic") === "true";
    let showDigits = localStorage.getItem("showDigits") === "true";
    let showBreadcrumbs = localStorage.getItem("showBreadcrumbs") !== "false"; // true по умолчанию
    let showTagsCloud = localStorage.getItem("showTagsCloud") === "true";
    let showHistoryBlock = localStorage.getItem("showHistoryBlock") === "true";
    let allowSelection = localStorage.getItem("allowSelection") === "true";
    let wideScrollbar = localStorage.getItem("wideScrollbar") === "true";

    let tagSortMode = localStorage.getItem("tagSortMode") || "alpha";
    let instructionVisible = true;

    // ---------- DOM ----------
    const themeToggle = document.getElementById("themeToggle");
    const langToggle = document.getElementById("langToggle");
    const langToggleText = document.getElementById("langToggleText");
    const burgerBtn = document.getElementById("burgerBtn");
    const menuPanel = document.getElementById("menuPanel");
    const menuOverlay = document.getElementById("menuOverlay");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const statsPanel = document.getElementById("statsPanel");
    const latinRow = document.getElementById("latinRow");
    const cyrillicRow = document.getElementById("cyrillicRow");
    const digitsRow = document.getElementById("digitsRow");
    const showAllBtnContainer = document.getElementById("showAllBtnContainer");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const autocompleteList = document.getElementById("autocompleteList");
    const autocompleteSpacer = document.getElementById("autocompleteSpacer");
    const resultCard = document.getElementById("resultCard");
    const backBtn = document.getElementById("backBtn");
    const forwardBtn = document.getElementById("forwardBtn");
    const breadcrumbsDiv = document.getElementById("breadcrumbs");
    const breadcrumbsArea = document.getElementById("breadcrumbsArea");
    const historyNav = document.getElementById("historyNav");
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    const tagCloudBlock = document.getElementById("tagCloudBlock");
    const historyBlock = document.getElementById("historyBlock");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");

    const toggleLatinCont = document.getElementById("toggleLatinContainer");
    const toggleCyrillicCont = document.getElementById("toggleCyrillicContainer");
    const toggleDigitsCont = document.getElementById("toggleDigitsContainer");
    const toggleBreadcrumbsCont = document.getElementById("toggleBreadcrumbsContainer");
    const toggleTagsCloudCont = document.getElementById("toggleTagsCloudContainer");
    const toggleHistoryBlockCont = document.getElementById("toggleHistoryBlockContainer");
    const toggleSelectionCont = document.getElementById("toggleSelectionContainer");
    const toggleScrollbarCont = document.getElementById("toggleScrollbarContainer");

    // ---------- ПОЛНЫЙ СЛОВАРЬ ЛОКАЛИЗАЦИИ ----------
    const i18n = {
        ru: {
            closeMenu: "✕ Закрыть меню",
            clearHistory: "🗑 Очистить историю",
            latin: "Латиница",
            cyrillic: "Кириллица",
            digits: "Цифры и Color",
            breadcrumbsSwitch: "Хлебные крошки и стрелки",
            tagsCloudSwitch: "Облако тегов",
            historyBlockSwitch: "История просмотров",
            selectionSwitch: "Выделение текста",
            scrollbarSwitch: "Широкий скроллбар",
            books: "📚 Книги",
            booksNotice: "Все данные взяты из этих книг. Книги в свободном доступе, также доступны в проекте для просмотра и скачивания.",
            contacts: "📞 Контакты",
            church: "Церковь Family of God",
            thanks: "Благодарность Супруге — за вдохновение.<br>Я часть Церкви «Семья Божья», г. Минск.<br>Живите с миром.",
            searchPlaceholder: "Найти символ, алиас или тег...",
            searchBtn: "Найти",
            optSymbol: "📖 Название",
            optAliases: "🏷️ Алиасы",
            optDesc: "📄 Описание",
            optTags: "🔖 Теги",
            optAll: "🔍 Везде",
            back: "Назад",
            forward: "Вперёд",
            showAll: "📖 Показать все",
            statsLine1: "📁 База: {name}",
            statsLine2: "📊 Записей: {count}",
            statsLine3: "📦 Вес: {size}",
            statsLine4: "📄 Символов: {chars}",
            loading: "Загрузка базы...",
            empty: "База пуста. Загрузите JSON-файл.",
            notFound: "😕 Ничего не найдено",
            enterQuery: "Введите слово для поиска",
            tagFound: "🔍 Найдено {count} символов с тегом \"{tag}\":",
            aliasNotFound: "Символ \"{sym}\" не найден",
            colorTitle: "🎨 Цвета",
            digitsTitle: "🔢 Символы с цифрами",
            noDigits: "С цифрами карт нет",
            noColors: "Цветов пока нет",
            shareText: "Поделиться текстом",
            shareImage: "Поделиться картинкой",
            historyCleared: "История очищена"
        },
        en: {
            closeMenu: "✕ Close menu",
            clearHistory: "🗑 Clear history",
            latin: "Latin",
            cyrillic: "Cyrillic",
            digits: "Digits & Color",
            breadcrumbsSwitch: "Breadcrumbs & arrows",
            tagsCloudSwitch: "Tags cloud",
            historyBlockSwitch: "Browsing history",
            selectionSwitch: "Text selection",
            scrollbarSwitch: "Wide scrollbar",
            books: "📚 Books",
            booksNotice: "All data taken from these books. Books are freely available, also accessible in the project for viewing and downloading.",
            contacts: "📞 Contacts",
            church: "Family of God Church",
            thanks: "Thanks to my wife for inspiration.<br>I'm part of the Family of God Church, Minsk.<br>Live in peace.",
            searchPlaceholder: "Search symbol, alias or tag...",
            searchBtn: "Search",
            optSymbol: "📖 Title",
            optAliases: "🏷️ Aliases",
            optDesc: "📄 Description",
            optTags: "🔖 Tags",
            optAll: "🔍 All",
            back: "Back",
            forward: "Forward",
            showAll: "📖 Show all",
            statsLine1: "📁 DB: {name}",
            statsLine2: "📊 Records: {count}",
            statsLine3: "📦 Size: {size}",
            statsLine4: "📄 Chars: {chars}",
            loading: "Loading database...",
            empty: "Database empty. Upload JSON file.",
            notFound: "😕 Nothing found",
            enterQuery: "Enter a word to search",
            tagFound: "🔍 Found {count} symbols with tag \"{tag}\":",
            aliasNotFound: "Symbol \"{sym}\" not found",
            colorTitle: "🎨 Colors",
            digitsTitle: "🔢 Symbols with digits",
            noDigits: "No symbols with digits",
            noColors: "No colors yet",
            shareText: "Share as text",
            shareImage: "Share as image",
            historyCleared: "History cleared"
        }
    };

    function t(key, vars = {}) {
        let str = i18n[lang][key] || i18n.ru[key] || key;
        for(let k in vars) str = str.replace(`{${k}}`, vars[k]);
        return str;
    }

        // Полная локализация интерфейса
    function applyLocalization() {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.dataset.i18n;
            if (key) el.innerHTML = t(key);   // ← было textContent, стало innerHTML
        });
        const placeholderEl = document.querySelector("[data-i18n-placeholder]");
        if (placeholderEl) placeholderEl.placeholder = t(placeholderEl.dataset.i18nPlaceholder);
        const showAllBtn = document.getElementById("showAllBtn");
        if (showAllBtn) showAllBtn.innerHTML = t("showAll");
        updateStatsUI();
        if (lastDisplayedRecord) showRecord(lastDisplayedRecord);
        else if (instructionVisible) showDefaultInstructions();
    }

    function updateLangToggleButton() { langToggleText.textContent = lang === "ru" ? "EN" : "RU"; }
    function setLang(l) {
        lang = l; localStorage.setItem("clientLang", l);
        updateLangToggleButton();
        const scrollY = window.scrollY;
        applyLocalization();
        window.scrollTo(0, scrollY);
    }
    langToggle.onclick = () => setLang(lang === "ru" ? "en" : "ru");

    function updateStatsUI() {
        if(!db.length) { statsPanel.innerHTML = "<div>База не загружена</div>"; return; }
        const totalChars = JSON.stringify(db).length;
        let sizeStr = (totalChars / 1024).toFixed(1) + " KB";
        if(totalChars > 1024*1024) sizeStr = (totalChars / (1024*1024)).toFixed(1) + " MB";
        statsPanel.innerHTML = `
            <div>${t("statsLine1", { name: currentDbName })}</div>
            <div>${t("statsLine2", { count: db.length })}</div>
            <div>${t("statsLine3", { size: sizeStr })}</div>
            <div>${t("statsLine4", { chars: totalChars })}</div>
        `;
    }

    const colorList = ["red","green","blue","yellow","black","white","purple","orange","pink","brown","gray","grey","cyan","magenta","violet","indigo","gold","silver","bronze","beige","coral","ivory","lavender","lime","maroon","navy","olive","tan","teal","turquoise","wheat","amber"];
    const digitWordsEn = ["zero","one","two","three","four","five","six","seven","eight","nine","ten"];
    const digitWordsRu = ["ноль","один","два","три","четыре","пять","шесть","семь","восемь","девять","десять"];

    function escapeHtml(str) { if(!str) return ""; return str.replace(/[&<>]/g, m => m==='&'?'&amp;':m==='<'?'&lt;':m==='>'?'&gt;':m); }
    function wrapShortWords(text) {
        return text.replace(/(\b\w{1,4}\b)/g, '<span style="white-space:nowrap;">$1</span>');
    }

    // ---------- ИСТОРИЯ ----------
    function addToHistory(record) {
        if(!record) return;
        historyStack = historyStack.slice(0, historyIndex+1);
        historyStack.push({ symbol: record.symbol, id: record.id });
        historyIndex = historyStack.length-1;
        updateHistoryNav();
        renderBreadcrumbs();
        addToFullHistory(record);
    }
    function updateHistoryNav() {
        backBtn.disabled = historyIndex <= 0;
        forwardBtn.disabled = historyIndex >= historyStack.length-1;
    }
    function goBack() { if(historyIndex>0){ historyIndex--; const rec=db.find(r=>r.id===historyStack[historyIndex].id); if(rec) showRecord(rec); } }
    function goForward() { if(historyIndex<historyStack.length-1){ historyIndex++; const rec=db.find(r=>r.id===historyStack[historyIndex].id); if(rec) showRecord(rec); } }
    function renderBreadcrumbs() {
        if(!showBreadcrumbs) { breadcrumbsDiv.innerHTML = ""; return; }
        const start = Math.max(0, historyIndex - 9);
        const items = historyStack.slice(start, historyIndex+1);
        breadcrumbsDiv.innerHTML = items.map((item, idx) => `<span class="breadcrumb-item" data-id="${item.id}">${escapeHtml(item.symbol)}</span>${(start+idx!==historyIndex)?' → ':''}`).join("");
        document.querySelectorAll(".breadcrumb-item").forEach(el => {
            el.addEventListener("click", () => {
                const id = parseInt(el.dataset.id);
                const rec = db.find(r => r.id === id);
                if(rec) showRecord(rec);
            });
        });
    }
    function updateBreadcrumbsVisibility() {
        breadcrumbsArea.style.display = showBreadcrumbs ? 'flex' : 'none';
        historyNav.style.display = showBreadcrumbs ? 'flex' : 'none';
        renderBreadcrumbs();
    }

    function addToFullHistory(record) {
        const now = new Date();
        fullHistory.push({ symbol: record.symbol, id: record.id, timestamp: now.toISOString() });
        localStorage.setItem("fullHistory", JSON.stringify(fullHistory));
        if(showHistoryBlock) renderFullHistory();
    }
    function renderFullHistory() {
        if(!showHistoryBlock) { historyBlock.style.display = 'none'; return; }
        historyBlock.style.display = 'block';
        if(!fullHistory.length) { historyBlock.innerHTML = '<div>История пуста</div>'; return; }
        const groups = {};
        fullHistory.slice().reverse().forEach(entry => {
            const day = entry.timestamp.slice(0,10);
            if(!groups[day]) groups[day] = [];
            groups[day].push(entry);
        });
        let html = '';
        for(const [day, entries] of Object.entries(groups)) {
            html += `<div class="history-day"><div class="history-day-title">${day}</div>`;
            entries.forEach(e => {
                const time = e.timestamp.slice(11,19);
                html += `<div class="history-entry" data-id="${e.id}">${time} — ${escapeHtml(e.symbol)}</div>`;
            });
            html += '</div>';
        }
        historyBlock.innerHTML = html;
        document.querySelectorAll(".history-entry").forEach(el => {
            el.addEventListener("click", () => {
                const id = parseInt(el.dataset.id);
                const rec = db.find(r => r.id === id);
                if(rec) showRecord(rec);
            });
        });
    }
    function clearAllHistory() {
        historyStack = [];
        historyIndex = -1;
        fullHistory = [];
        localStorage.removeItem("fullHistory");
        updateHistoryNav();
        renderBreadcrumbs();
        renderFullHistory();
    }

    // ---------- АЛФАВИТ ----------
    function renderAlphabet() {
        if(!db.length) {
            latinRow.innerHTML = "<span class='alpha-letter'>Нет данных</span>";
            cyrillicRow.innerHTML = "";
            digitsRow.innerHTML = "";
            showAllBtnContainer.innerHTML = "";
            return;
        }
        const latinLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const cyrillicLetters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");
        const grouped = {};
        db.forEach(item => {
            let first = item.symbol.charAt(0).toUpperCase();
            let letter = /[A-Z]/i.test(first) ? first.toUpperCase() : (/[А-ЯЁ]/i.test(first) ? first.toUpperCase() : null);
            if(letter) {
                if(!grouped[letter]) grouped[letter] = [];
                grouped[letter].push(item);
            }
        });
        latinRow.innerHTML = latinLetters.map(l => `<span class="alpha-letter" data-letter="${l}">${l}</span>`).join('');
        cyrillicRow.innerHTML = cyrillicLetters.map(l => `<span class="alpha-letter" data-letter="${l}">${l}</span>`).join('');
        digitsRow.innerHTML = `<span class="alpha-letter" data-letter="digits">0-9</span><span class="alpha-letter" data-letter="colors">🎨 Color</span>`;

        let showAllBtn = document.getElementById("showAllBtn");
        if(!showAllBtn) {
            showAllBtn = document.createElement("span");
            showAllBtn.id = "showAllBtn";
            showAllBtn.className = "show-all-btn";
            showAllBtn.innerHTML = t("showAll");
            showAllBtn.onclick = () => showAllSymbols();
            showAllBtnContainer.appendChild(showAllBtn);
        }
        updateShowAllButtonVisibility();
        applyAlphabetVisibility();

        document.querySelectorAll(".alpha-letter[data-letter]").forEach(el => {
            el.addEventListener("click", () => {
                const letter = el.dataset.letter;
                if(letter === "colors") { showColorSymbols(); return; }
                if(letter === "digits") { showDigitSymbols(); return; }
                const filtered = grouped[letter] || [];
                if(filtered.length) showWordList(filtered, `${lang==='ru'?'Символы на букву':'Symbols for letter'} ${letter} (${filtered.length})`);
                else resultCard.innerHTML = `<div class="card">${lang==='ru'?'Нет символов':'No symbols'} ${letter}</div>`;
            });
        });
    }

    function applyAlphabetVisibility() {
        latinRow.style.display = showLatin ? '' : 'none';
        cyrillicRow.style.display = showCyrillic ? '' : 'none';
        digitsRow.style.display = showDigits ? '' : 'none';
        updateShowAllButtonVisibility();
        updateSwitchesUI();
    }
    function updateShowAllButtonVisibility() {
        const btn = document.getElementById("showAllBtn");
        if(btn) btn.style.display = (showLatin || showCyrillic || showDigits) ? '' : 'none';
    }
    function showAllSymbols() { showWordList([...db], t("showAll")); }
    function showColorSymbols() {
        const filtered = db.filter(item => colorList.includes(item.symbol.toLowerCase()));
        if(filtered.length) showWordList(filtered, t("colorTitle"));
        else resultCard.innerHTML = `<div class="card">${t("noColors")}</div>`;
    }
    function showDigitSymbols() {
        const digitPattern = /\d/;
        const filtered = db.filter(item => {
            const sym = item.symbol.toLowerCase();
            if(digitPattern.test(sym)) return true;
            for(let word of digitWordsEn.concat(digitWordsRu)) if(sym.includes(word)) return true;
            return false;
        });
        if(filtered.length) showWordList(filtered, t("digitsTitle"));
        else resultCard.innerHTML = `<div class="card">${t("noDigits")}</div>`;
    }

    function showWordList(list, title) {
        const container = document.createElement("div");
        container.className = "card";
        container.innerHTML = `
            <div class="stats-header"><strong>${escapeHtml(title)}</strong><button class="eye-icon toggle-words-btn"><i class="fas fa-eye"></i></button></div>
            <div class="word-list words-list-content">${list.map(r => `<div class="word-item" data-id="${r.id}">${escapeHtml(r.symbol)}</div>`).join("")}</div>`;
        resultCard.innerHTML = "";
        resultCard.appendChild(container);
        const eyeBtn = container.querySelector(".toggle-words-btn");
        const listDiv = container.querySelector(".words-list-content");
        let visible = true;
        eyeBtn.addEventListener("click", () => {
            if(visible) { listDiv.classList.add("collapsed"); eyeBtn.innerHTML = '<i class="fas fa-eye-slash"></i>'; }
            else { listDiv.classList.remove("collapsed"); eyeBtn.innerHTML = '<i class="fas fa-eye"></i>'; }
            visible = !visible;
        });
        container.querySelectorAll(".word-item").forEach(el => {
            el.addEventListener("click", () => {
                const id = parseInt(el.dataset.id);
                const rec = db.find(r => r.id === id);
                if(rec) { showRecord(rec); addToHistory(rec); }
            });
        });
    }

    // ---------- КАРТОЧКА СИМВОЛА ----------
    function showRecord(record) {
        if(!record) return;
        lastDisplayedRecord = record;
        instructionVisible = false;
        const sourceText = record.source ? `<i class="fas fa-book"></i> ${escapeHtml(record.source)}` : "";
        const dateText = record.date_added ? `📅 ${record.date_added}` : "";
        const aliasesHtml = (record.aliases && record.aliases.length) ? `<div class="aliases"><strong>🔗 ${lang==='ru'?'Синонимы':'Aliases'}:</strong> ${record.aliases.map(a => `<span class="tag alias-tag" data-symbol="${escapeHtml(a)}">${escapeHtml(a)}</span>`).join(" ")}</div>` : "";
        const tagsHtml = (record.tags && record.tags.length) ? `<div class="tags"><strong>🏷️ ${lang==='ru'?'Теги':'Tags'}:</strong> ${record.tags.map(t => `<span class="tag tag-filter" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`).join(" ")}</div>` : "";
        const safeMarked = typeof marked !== 'undefined' ? marked.parse(record.notes || "") : escapeHtml(record.notes || "");
        const notesHtml = record.notes ? `<div class="notes"><b>📝 ${lang==='ru'?'Заметка':'Notes'}:</b><br>${safeMarked}</div>` : "";

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="symbol-name">${escapeHtml(record.symbol)}</div>
            <div class="meta">${sourceText} ${dateText}</div>
            ${aliasesHtml}
            <div class="desc">${wrapShortWords(escapeHtml(record.description))}</div>
            ${tagsHtml}
            ${notesHtml}
            <div class="share-buttons">
                <button class="share-btn share-text-btn"><i class="fas fa-share-alt"></i> ${t("shareText")}</button>
                <button class="share-btn share-image-btn"><i class="fas fa-image"></i> ${t("shareImage")}</button>
            </div>`;
        resultCard.innerHTML = "";
        resultCard.appendChild(card);

        card.querySelectorAll(".alias-tag").forEach(el => {
            el.addEventListener("click", () => {
                const sym = el.dataset.symbol;
                const found = db.find(r => r.symbol.toLowerCase() === sym.toLowerCase());
                if(found) { showRecord(found); addToHistory(found); }
                else alert(t("aliasNotFound", { sym }));
            });
        });
        card.querySelectorAll(".tag-filter").forEach(el => {
            el.addEventListener("click", () => {
                const tag = el.dataset.tag;
                const filtered = db.filter(r => r.tags && r.tags.includes(tag));
                if(filtered.length) showWordList(filtered, t("tagFound", { count: filtered.length, tag }));
            });
        });
        card.querySelector(".share-text-btn")?.addEventListener("click", () => shareAsText(record));
        card.querySelector(".share-image-btn")?.addEventListener("click", () => shareAsImage(record));
    }

    function shareAsText(record) {
        const text = `Символ: ${record.symbol}\nИсточник: ${record.source||'-'}\nДата: ${record.date_added||'-'}\nОписание: ${record.description}\n${record.aliases?'Синонимы: '+record.aliases.join(', '):''}\n${record.tags?'Теги: '+record.tags.join(', '):''}\n${record.notes?'Заметка: '+record.notes:''}`;
        if(navigator.share) navigator.share({ title: record.symbol, text }).catch(()=>{});
        else alert("Sharing not supported");
    }

    async function shareAsImage(record) {
        if(typeof html2canvas === 'undefined') { alert("Image sharing not available"); return; }
        const tempDiv = document.createElement("div");
        tempDiv.style.cssText = "position:absolute;left:-9999px;top:0;width:600px;background:white;padding:20px;font-family:Inter,sans-serif;color:#2c2825;";
        const safeMarked = typeof marked !== 'undefined' ? marked.parse(record.notes || "") : escapeHtml(record.notes || "");
        tempDiv.innerHTML = `<h1 style="font-size:24px;margin-bottom:10px">${escapeHtml(record.symbol)}</h1><p style="font-size:14px;color:#666">${record.source?'Источник: '+escapeHtml(record.source):''} ${record.date_added?'📅 '+record.date_added:''}</p><div style="font-size:16px;margin:10px 0;white-space:pre-wrap">${escapeHtml(record.description)}</div>${record.aliases?'<p><b>Синонимы:</b> '+record.aliases.join(', ')+'</p>':''}${record.tags?'<p><b>Теги:</b> '+record.tags.join(', ')+'</p>':''}${record.notes?`<div style="font-size:14px;border-top:1px solid #ccc;margin-top:10px;padding-top:10px">${safeMarked}</div>`:''}`;
        document.body.appendChild(tempDiv);
        try {
            const canvas = await html2canvas(tempDiv, { scale: 2.5, backgroundColor: "#ffffff" });
            let blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
            let quality = 0.9;
            while(blob.size > 500*1024 && quality > 0.3) { quality -= 0.1; blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality)); }
            if(navigator.share) { const file = new File([blob], `${record.symbol}.jpg`, { type: 'image/jpeg' }); await navigator.share({ files: [file] }); }
        } catch(e) { console.error(e); }
        finally { document.body.removeChild(tempDiv); }
    }

    // ---------- ПОИСК И АВТОДОПОЛНЕНИЕ ----------
    function filterByMode(item, query) {
        const q = query.toLowerCase();
        if(currentMode === "symbol") return item.symbol.toLowerCase().startsWith(q) || (item.aliases && item.aliases.some(a => a.toLowerCase().startsWith(q)));
        if(currentMode === "aliases") return item.aliases && item.aliases.some(a => a.toLowerCase().startsWith(q));
        if(currentMode === "desc") return (item.description || "").toLowerCase().startsWith(q);
        if(currentMode === "tags") return item.tags && item.tags.some(t => t.toLowerCase().startsWith(q));
        if(currentMode === "all") return item.symbol.toLowerCase().startsWith(q) || (item.aliases && item.aliases.some(a => a.toLowerCase().startsWith(q))) || (item.description || "").toLowerCase().startsWith(q) || (item.tags && item.tags.some(t => t.toLowerCase().startsWith(q)));
        return false;
    }

    function updateAutocomplete() {
        const q = searchInput.value.trim();
        if(!q) { autocompleteList.classList.remove("show"); autocompleteSpacer.style.height = "0"; return; }
        const matches = db.filter(item => filterByMode(item, q)).slice(0, 7);
        if(matches.length) {
            autocompleteList.innerHTML = matches.map(m => `<div class="autocomplete-item" data-id="${m.id}">${escapeHtml(m.symbol)}</div>`).join("");
            autocompleteList.classList.add("show");
            requestAnimationFrame(() => { autocompleteSpacer.style.height = autocompleteList.scrollHeight + "px"; });
            document.querySelectorAll(".autocomplete-item").forEach(el => {
                el.addEventListener("click", () => {
                    const id = parseInt(el.dataset.id);
                    const rec = db.find(r => r.id === id);
                    if(rec) { showRecord(rec); addToHistory(rec); }
                    autocompleteList.classList.remove("show");
                    autocompleteSpacer.style.height = "0";
                });
            });
        } else { autocompleteList.classList.remove("show"); autocompleteSpacer.style.height = "0"; }
    }

    function performSearch() {
        const q = searchInput.value.trim().toLowerCase();
        if(!q) {
            if(instructionVisible) showDefaultInstructions();
            else resultCard.innerHTML = `<div class="card">${t("enterQuery")}</div>`;
            return;
        }
        let filtered = db.filter(item => {
            if(currentMode === "symbol") return item.symbol.toLowerCase().includes(q) || (item.aliases && item.aliases.some(a => a.toLowerCase().includes(q)));
            if(currentMode === "aliases") return item.aliases && item.aliases.some(a => a.toLowerCase().includes(q));
            if(currentMode === "desc") return (item.description || "").toLowerCase().includes(q);
            if(currentMode === "tags") return item.tags && item.tags.some(t => t.toLowerCase().includes(q));
            return item.symbol.toLowerCase().includes(q) || (item.aliases && item.aliases.some(a => a.toLowerCase().includes(q))) || (item.description || "").toLowerCase().includes(q) || (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));
        });
        if(filtered.length === 0) { resultCard.innerHTML = `<div class="card">${t("notFound")}</div>`; return; }
        if(filtered.length === 1) { showRecord(filtered[0]); addToHistory(filtered[0]); }
        else showWordList(filtered, `${lang==='ru'?'Найдено совпадений':'Matches'}: ${filtered.length}`);
        instructionVisible = false;
    }

    // ---------- ОБЛАКО ТЕГОВ ----------
    function buildTagCloud() {
        const tagCounts = {};
        db.forEach(item => { if(item.tags) item.tags.forEach(t => tagCounts[t] = (tagCounts[t]||0)+1); });
        let tagsArray = Object.entries(tagCounts).map(([tag, count]) => ({tag, count}));
        if(tagSortMode === "alpha") tagsArray.sort((a,b) => a.tag.localeCompare(b.tag));
        else tagsArray.sort((a,b) => b.count - a.count || a.tag.localeCompare(b.tag));
        const sortIcon = tagSortMode === "alpha" ? "🔤" : "🔢";
        tagCloudBlock.innerHTML = `<button class="tag-sort-btn" id="toggleTagSortBtn">${sortIcon}</button>` + tagsArray.map(({tag, count}) => `<span class="tag tag-cloud-item" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)} (${count})</span>`).join(" ");
        document.getElementById("toggleTagSortBtn").addEventListener("click", () => {
            tagSortMode = tagSortMode === "alpha" ? "count" : "alpha";
            localStorage.setItem("tagSortMode", tagSortMode);
            buildTagCloud();
        });
        document.querySelectorAll(".tag-cloud-item").forEach(el => {
            el.addEventListener("click", () => {
                const tag = el.dataset.tag;
                const filtered = db.filter(r => r.tags && r.tags.includes(tag));
                if(filtered.length) showWordList(filtered, t("tagFound", { count: filtered.length, tag }));
            });
        });
    }
    function updateTagCloudVisibility() {
        tagCloudBlock.style.display = showTagsCloud ? 'flex' : 'none';
        if(showTagsCloud && db.length) buildTagCloud();
    }

        // ---------- ИНСТРУКЦИЯ ----------
    function showDefaultInstructions() {
        instructionVisible = true;
        const card = document.createElement("div");
        card.className = "card";
        card.style.position = "relative";
        
        // Текст инструкции на русском и английском
        let instructionHtml = '';
        if (lang === 'ru') {
            instructionHtml = `
                <button class="close-instruction-btn" id="closeInstructionBtn">&times;</button>
                <h3>📖 Как пользоваться сайтом</h3>
                <p><strong>🔍 Поиск</strong> — введите слово в строку поиска. Выберите область поиска: название, алиасы, описание, теги или везде. Работает автодополнение.</p>
                <p><strong>📚 Алфавит</strong> — кликните на букву, чтобы увидеть все символы, начинающиеся с неё. Можно включить/отключить латиницу, кириллицу, цифры и цвета в меню.</p>
                <p><strong>🏷️ Облако тегов</strong> — показывает все теги с количеством символов. Сортировка по алфавиту или по частоте. Нажмите на тег, чтобы найти все связанные записи.</p>
                <p><strong>📜 История просмотров</strong> — сохраняет все просмотренные карточки с датой и временем. Можно вернуться к любому ранее просмотренному символу.</p>
                <p><strong>🍞 Хлебные крошки</strong> — показывают последние 10 просмотренных символов для быстрой навигации. Кнопки «Назад» и «Вперёд» работают как в браузере.</p>
                <p><strong>🌙 Тёмная тема</strong> — переключается кнопкой в верхней панели. Сохраняется в памяти устройства.</p>
                <p><strong>🌐 Два языка</strong> — русский и английский. Интерфейс и переводы словаря переключаются мгновенно.</p>
                <p><strong>📱 Установка приложения</strong> — сайт можно установить на телефон как PWA (работает офлайн). Кнопка «Установить» появляется в браузере после нескольких посещений.</p>
                <p><strong>🔧 Дополнительные настройки</strong> — в меню (☰) можно включить/отключить: латиницу, кириллицу, цифры и цвета, облако тегов, историю, широкий скроллбар, выделение текста.</p>
                <hr>
                <h3>📖 Как пользоваться словарём</h3>
                <p>Откройте меню (гамбургер) — там можно включить дополнительные элементы навигации.</p>
                <p><strong>Curtains (занавесы):</strong> (1) Плотская завеса; (2) Сердце; (3) Небеса; (4) Покрытие; (5) Окончание; (6) Смерть.<br><em>См. также Veil.</em><br>(1) Евр.10:20; (2) 2Кор.3:15; (3) Пс.103:2; Ис.40:22</p>
                <ul><li>• Нумерованные толкования от наиболее вероятного к наименее.</li><li>• Скобки уточняют контекст.</li><li>• Перекрёстные ссылки.</li></ul>
                <p><strong>Life Raft:</strong> (1) Нужда в спасении; (2) Потерянный; (3) В опасности потерять спасение; (4) Ковчег (Христос).<br><em>См. также Adrift, Boat, Sea.</em></p>
                <p>• cf. = сравни, ff. = и следующие.</p>
                <p><strong>Mouse/Mice:</strong> (1) Скрытый нечистый дух; (2) Показатель духовного обслуживания; (3) Неверующий (нечистый); (4) Малый; (5) Язва; (6) Суд.<br>‘&’ = объединить стихи.</p>
            `;
        } else {
            instructionHtml = `
                <button class="close-instruction-btn" id="closeInstructionBtn">&times;</button>
                <h3>📖 How to use the site</h3>
                <p><strong>🔍 Search</strong> — type a word. Choose search scope: title, aliases, description, tags, or all. Autocomplete works.</p>
                <p><strong>📚 Alphabet</strong> — click a letter to see all symbols starting with it. You can enable/disable Latin, Cyrillic, digits & colors in the menu.</p>
                <p><strong>🏷️ Tag cloud</strong> — shows all tags with counts. Sort by alphabet or frequency. Click a tag to find all related entries.</p>
                <p><strong>📜 Browsing history</strong> — saves all viewed cards with date and time. You can return to any previously viewed symbol.</p>
                <p><strong>🍞 Breadcrumbs</strong> — show the last 10 viewed symbols for quick navigation. Back/Forward buttons work like in a browser.</p>
                <p><strong>🌙 Dark theme</strong> — toggle button in the top bar. Saved in device memory.</p>
                <p><strong>🌐 Two languages</strong> — Russian and English. Interface and dictionary translations switch instantly.</p>
                <p><strong>📱 Install app</strong> — the site can be installed as PWA (works offline). The "Install" button appears after a few visits.</p>
                <p><strong>🔧 Additional settings</strong> — in the menu (☰) you can enable/disable: Latin, Cyrillic, digits & colors, tag cloud, history, wide scrollbar, text selection.</p>
                <hr>
                <h3>📖 How to use the dictionary</h3>
                <p>Open the menu (hamburger) — you can enable extra navigation elements there.</p>
                <p><strong>Curtains:</strong> (1) Fleshly veil; (2) Heart; (3) Heavens; (4) Covering; (5) End; (6) Death.<br><em>See also Veil.</em><br>(1) Heb.10:20; (2) 2Cor.3:15; (3) Ps.104:2; Is.40:22</p>
                <ul><li>• Numbered interpretations from most likely to least.</li><li>• Parentheses clarify context.</li><li>• Cross-references.</li></ul>
                <p><strong>Life Raft:</strong> (1) Need for salvation; (2) Lost; (3) In danger of losing salvation; (4) Ark (Christ).<br><em>See also Adrift, Boat, Sea.</em></p>
                <p>• cf. = compare, ff. = and following.</p>
                <p><strong>Mouse/Mice:</strong> (1) Hidden unclean spirit; (2) Indicator of spiritual service; (3) Unbeliever (unclean); (4) Small; (5) Plague; (6) Judgment.<br>‘&’ = combine verses.</p>
            `;
        }
        
        card.innerHTML = instructionHtml;
        resultCard.innerHTML = "";
        resultCard.appendChild(card);
        document.getElementById("closeInstructionBtn").addEventListener("click", () => {
            instructionVisible = false;
            resultCard.innerHTML = `<div class="card">${t("enterQuery")}</div>`;
        });
    }

    // ---------- ПЕРЕКЛЮЧАТЕЛИ ----------
    function setSwitch(container, value, onChange) {
        if(value) container.classList.add("active"); else container.classList.remove("active");
        container.onclick = () => {
            const newVal = !container.classList.contains("active");
            if(newVal) container.classList.add("active"); else container.classList.remove("active");
            onChange(newVal);
        };
    }
    function updateSwitchesUI() {
        toggleLatinCont.classList.toggle("active", showLatin);
        toggleCyrillicCont.classList.toggle("active", showCyrillic);
        toggleDigitsCont.classList.toggle("active", showDigits);
        toggleBreadcrumbsCont.classList.toggle("active", showBreadcrumbs);
        toggleTagsCloudCont.classList.toggle("active", showTagsCloud);
        toggleHistoryBlockCont.classList.toggle("active", showHistoryBlock);
        toggleSelectionCont.classList.toggle("active", allowSelection);
        toggleScrollbarCont.classList.toggle("active", wideScrollbar);
    }
    function bindSwitches() {
        setSwitch(toggleLatinCont, showLatin, v => { showLatin=v; localStorage.setItem("showLatin",v); applyAlphabetVisibility(); });
        setSwitch(toggleCyrillicCont, showCyrillic, v => { showCyrillic=v; localStorage.setItem("showCyrillic",v); applyAlphabetVisibility(); });
        setSwitch(toggleDigitsCont, showDigits, v => { showDigits=v; localStorage.setItem("showDigits",v); applyAlphabetVisibility(); });
        setSwitch(toggleBreadcrumbsCont, showBreadcrumbs, v => { showBreadcrumbs=v; localStorage.setItem("showBreadcrumbs",v); updateBreadcrumbsVisibility(); });
        setSwitch(toggleTagsCloudCont, showTagsCloud, v => { showTagsCloud=v; localStorage.setItem("showTagsCloud",v); updateTagCloudVisibility(); });
        setSwitch(toggleHistoryBlockCont, showHistoryBlock, v => { showHistoryBlock=v; localStorage.setItem("showHistoryBlock",v); renderFullHistory(); });
        setSwitch(toggleSelectionCont, allowSelection, v => { allowSelection=v; localStorage.setItem("allowSelection",v); document.body.classList.toggle("allow-selection", v); });
        setSwitch(toggleScrollbarCont, wideScrollbar, v => { wideScrollbar=v; localStorage.setItem("wideScrollbar",v); document.body.classList.toggle("custom-scrollbar", v); });
    }

    function handleScroll() {
        if(window.scrollY > 300) scrollTopBtn.classList.add("visible");
        else scrollTopBtn.classList.remove("visible");
    }

    function toggleMenu(open) { menuPanel.classList.toggle("open", open); menuOverlay.classList.toggle("open", open); }

    // ---------- ЗАГРУЗКА БД ----------
    async function tryAutoLoad() {
        resultCard.innerHTML = `<div class="card"><div class="loader"></div><div style="text-align:center">${t("loading")}</div></div>`;
        const paths = ["/udream/data/bd2.json", "data/bd2.json", "../data/bd2.json"];
        for(let url of paths) {
            try {
                const resp = await fetch(url);
                if(resp.ok) {
                    const data = await resp.json();
                    if(Array.isArray(data) && data.length) {
                        db = data; currentDbName = url.split('/').pop();
                        updateStatsUI(); renderAlphabet(); updateTagCloudVisibility();
                        showDefaultInstructions(); dbLoaded = true;
                        return;
                    }
                }
            } catch(e) {}
        }
        dbLoaded = false; db = [];
        updateStatsUI();
        resultCard.innerHTML = `<div class="card">⚠️ ${t("empty")}<br><button id="manualLoadBtn" class="mini-btn" style="margin-top:1rem;">📂 Загрузить JSON</button></div>`;
        document.getElementById("manualLoadBtn")?.addEventListener("click", () => {
            const inp = document.createElement("input"); inp.type="file"; inp.accept="application/json";
            inp.onchange = e => {
                const file = e.target.files[0]; if(!file) return;
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        if(Array.isArray(data) && data.length) {
                            db = data; currentDbName = file.name; updateStatsUI(); renderAlphabet(); updateTagCloudVisibility(); showDefaultInstructions(); dbLoaded = true;
                        } else throw new Error("Не массив");
                    } catch(err) { alert("Ошибка: файл должен быть массивом JSON"); }
                };
                reader.readAsText(file);
            };
            inp.click();
        });
        renderAlphabet();
    }

    // ---------- ИНИЦИАЛИЗАЦИЯ ----------
    function init() {
        setTheme(theme);
        updateLangToggleButton();
        setLang(lang);
        document.body.classList.toggle("allow-selection", allowSelection);
        document.body.classList.toggle("custom-scrollbar", wideScrollbar);
        updateBreadcrumbsVisibility();
        updateTagCloudVisibility();
        renderFullHistory();
        bindSwitches();
        updateSwitchesUI();

        themeToggle.onclick = () => setTheme(theme==="light"?"dark":"light");
        burgerBtn.onclick = () => toggleMenu(true);
        closeMenuBtn.onclick = () => toggleMenu(false);
        menuOverlay.onclick = () => toggleMenu(false);
        backBtn.onclick = goBack;
        forwardBtn.onclick = goForward;
        searchInput.addEventListener("input", updateAutocomplete);
        searchBtn.addEventListener("click", () => { autocompleteList.classList.remove("show"); autocompleteSpacer.style.height="0"; performSearch(); });
        document.querySelectorAll("[data-opt]").forEach(opt => opt.addEventListener("click", function() {
            document.querySelectorAll("[data-opt]").forEach(o=>o.classList.remove("active"));
            this.classList.add("active");
            currentMode = this.dataset.opt;
            updateAutocomplete();
            performSearch();
        }));
        window.addEventListener("scroll", handleScroll);
        scrollTopBtn.onclick = () => window.scrollTo({top:0, behavior:'smooth'});

        clearHistoryBtn.onclick = () => {
            if(confirm(t("historyCleared")+'?')) {
                clearAllHistory();
                alert(t("historyCleared"));
            }
        };

        tryAutoLoad();
    }

    function setTheme(th) { theme = th; localStorage.setItem("clientTheme", th); document.body.classList.toggle("dark", th==="dark"); }

        init();

    // ---------- РЕГИСТРАЦИЯ SERVICE WORKER ----------
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/udream/sw.js').then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
        });
    }
    
})();
