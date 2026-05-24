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
    let currentDbName = "db.json";

    // настройки видимости
    let showLatin = localStorage.getItem("showLatin") !== "false";
    let showCyrillic = localStorage.getItem("showCyrillic") !== "false";
    let showDigits = localStorage.getItem("showDigits") !== "false";
    let showBreadcrumbs = localStorage.getItem("showBreadcrumbs") === "true";
    let showTagsCloud = localStorage.getItem("showTagsCloud") === "true";
    let allowSelection = localStorage.getItem("allowSelection") === "true";

    // ---------- DOM ----------
    const themeToggle = document.getElementById("themeToggle");
    const langToggle = document.getElementById("langToggle");
    const langToggleText = document.getElementById("langToggleText");
    const burgerBtn = document.getElementById("burgerBtn");
    const menuPanel = document.getElementById("menuPanel");
    const menuOverlay = document.getElementById("menuOverlay");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const statsPanel = document.getElementById("statsPanel");
    const showHelpBtn = document.getElementById("showHelpBtn");
    const latinRow = document.getElementById("latinRow");
    const cyrillicRow = document.getElementById("cyrillicRow");
    const digitsRow = document.getElementById("digitsRow");
    const alphabetContainer = document.getElementById("alphabetContainer");
    const showAllBtnContainer = document.getElementById("showAllBtnContainer");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const autocompleteList = document.getElementById("autocompleteList");
    const resultCard = document.getElementById("resultCard");
    const backBtn = document.getElementById("backBtn");
    const forwardBtn = document.getElementById("forwardBtn");
    const breadcrumbsDiv = document.getElementById("breadcrumbs");
    const breadcrumbsArea = document.getElementById("breadcrumbsArea");
    const historyNav = document.getElementById("historyNav");
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    const tagCloudBlock = document.getElementById("tagCloudBlock");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");

    const toggleLatinCont = document.getElementById("toggleLatinContainer");
    const toggleCyrillicCont = document.getElementById("toggleCyrillicContainer");
    const toggleDigitsCont = document.getElementById("toggleDigitsContainer");
    const toggleBreadcrumbsCont = document.getElementById("toggleBreadcrumbsContainer");
    const toggleTagsCloudCont = document.getElementById("toggleTagsCloudContainer");
    const toggleSelectionCont = document.getElementById("toggleSelectionContainer");

    // ---------- i18n ----------
    const i18n = {
        ru: {
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
            back: "Назад", forward: "Вперёд",
            optSymbol: "Название", optAliases: "Алиасы", optDesc: "Описание", optTags: "Теги", optAll: "Везде",
            searchPlaceholder: "Найти символ, алиас или тег...",
            searchBtn: "Найти",
            showAll: "📖 Показать все",
            allTags: "Все теги",
            colorTitle: "🎨 Цвета",
            digitsTitle: "🔢 Символы с цифрами",
            noDigits: "С цифрами карт нет",
            noColors: "Цветов пока нет",
            shareText: "Поделиться текстом",
            shareImage: "Поделиться картинкой",
            historyCleared: "История очищена",
            instructions: "📖 Инструкция"
        },
        en: {
            statsLine1: "📁 DB: {name}",
            statsLine2: "📊 Records: {count}",
            statsLine3: "📦 Size: {size}",
            statsLine4: "📄 Chars: {chars}",
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
            showAll: "📖 Show all",
            allTags: "All tags",
            colorTitle: "🎨 Colors",
            digitsTitle: "🔢 Symbols with digits",
            noDigits: "No symbols with digits",
            noColors: "No colors yet",
            shareText: "Share as text",
            shareImage: "Share as image",
            historyCleared: "History cleared",
            instructions: "📖 Instructions"
        }
    };

    function t(key, vars = {}) {
        let str = i18n[lang][key] || i18n.ru[key] || key;
        for(let k in vars) str = str.replace(`{${k}}`, vars[k]);
        return str;
    }

    function applyLocalization() {
        searchInput.placeholder = t("searchPlaceholder");
        const searchSpan = document.querySelector("#searchBtn span");
        if(searchSpan) searchSpan.textContent = t("searchBtn");
        updateStatsUI();
        if (lastDisplayedRecord) showRecord(lastDisplayedRecord);
        else showDefaultInstructions();
    }

    function updateLangToggleButton() { langToggleText.textContent = lang === "ru" ? "EN" : "RU"; }
    function setLang(l) { lang = l; localStorage.setItem("clientLang", l); updateLangToggleButton(); applyLocalization(); }
    langToggle.onclick = () => setLang(lang === "ru" ? "en" : "ru");

    function updateStatsUI() {
        if(!db.length) {
            statsPanel.innerHTML = "База не загружена";
            return;
        }
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

    // цвета и цифры
    const colorList = ["red","green","blue","yellow","black","white","purple","orange","pink","brown","gray","grey","cyan","magenta","violet","indigo","gold","silver","bronze","beige","coral","ivory","lavender","lime","maroon","navy","olive","tan","teal","turquoise","wheat","amber"];
    const digitWordsEn = ["zero","one","two","three","four","five","six","seven","eight","nine","ten"];
    const digitWordsRu = ["ноль","один","два","три","четыре","пять","шесть","семь","восемь","девять","десять"];

    function escapeHtml(str) { if(!str) return ""; return str.replace(/[&<>]/g, m => m==='&'?'&amp;':m==='<'?'&lt;':m==='>'?'&gt;':m); }

    // История
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
        if(historyIndex > 0) { historyIndex--; const rec = db.find(r => r.id === historyStack[historyIndex].id); if(rec) showRecord(rec); }
    }
    function goForward() {
        if(historyIndex < historyStack.length-1) { historyIndex++; const rec = db.find(r => r.id === historyStack[historyIndex].id); if(rec) showRecord(rec); }
    }
    function renderBreadcrumbs() {
        if(!showBreadcrumbs) { breadcrumbsDiv.innerHTML = ""; return; }
        const start = Math.max(0, historyIndex - 9);
        const items = historyStack.slice(start, historyIndex+1);
        breadcrumbsDiv.innerHTML = items.map((item, idx) => {
            const isLast = (start+idx === historyIndex);
            return `<span class="breadcrumb-item" data-id="${item.id}">${escapeHtml(item.symbol)}</span>${!isLast ? ' → ' : ''}`;
        }).join("");
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

    // Алфавит
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

        latinRow.innerHTML = latinLetters.map(l => {
            const count = grouped[l] ? grouped[l].length : 0;
            return `<span class="alpha-letter" data-letter="${l}">${l} ${count ? '('+count+')' : ''}</span>`;
        }).join('');
        cyrillicRow.innerHTML = cyrillicLetters.map(l => {
            const count = grouped[l] ? grouped[l].length : 0;
            return `<span class="alpha-letter" data-letter="${l}">${l} ${count ? '('+count+')' : ''}</span>`;
        }).join('');
        digitsRow.innerHTML = `
            <span class="alpha-letter" data-letter="digits">0-9</span>
            <span class="alpha-letter" data-letter="colors">🎨 Color</span>
        `;

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
                if(filtered.length) showWordList(filtered, `${lang==='ru'?'Символы на букву':'Symbols starting with'} ${letter}`);
                else resultCard.innerHTML = `<div>${lang==='ru'?'Нет символов':'No symbols'} ${letter}</div>`;
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
        else resultCard.innerHTML = `<div>${t("noColors")}</div>`;
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
        else resultCard.innerHTML = `<div>${t("noDigits")}</div>`;
    }

    function showWordList(list, title) {
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
        // Скролл к началу результата
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Карточка
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
            <div class="share-buttons">
                <button class="share-btn share-text-btn"><i class="fas fa-share-alt"></i> ${t("shareText")}</button>
                <button class="share-btn share-image-btn"><i class="fas fa-image"></i> ${t("shareImage")}</button>
            </div>
        `;

        // Обработчики алиасов/тегов
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
                if(filtered.length) showWordList(filtered, t("tagFound", { count: filtered.length, tag }));
            });
        });

        document.querySelector(".share-text-btn")?.addEventListener("click", () => shareAsText(record));
        document.querySelector(".share-image-btn")?.addEventListener("click", () => shareAsImage(record));

        // Скролл к карточке
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function shareAsText(record) {
        const text = `Символ: ${record.symbol}
Источник: ${record.source || '-'}
Дата: ${record.date_added || '-'}
Описание: ${record.description}
${record.aliases ? 'Синонимы: ' + record.aliases.join(', ') : ''}
${record.tags ? 'Теги: ' + record.tags.join(', ') : ''}
${record.notes ? 'Заметка: ' + record.notes : ''}`;
        if(navigator.share) {
            navigator.share({ title: record.symbol, text: text }).catch(()=>{});
        } else alert("Sharing not supported");
    }

    async function shareAsImage(record) {
        const tempDiv = document.createElement("div");
        tempDiv.style.cssText = "position:absolute;left:-9999px;top:0;width:600px;background:white;padding:20px;font-family:Inter,sans-serif;color:#2c2825;";
        tempDiv.innerHTML = `
            <h1 style="font-size:24px;margin-bottom:10px">${escapeHtml(record.symbol)}</h1>
            <p style="font-size:14px;color:#666">${record.source ? 'Источник: '+escapeHtml(record.source) : ''} ${record.date_added ? '📅 '+record.date_added : ''}</p>
            <div style="font-size:16px;margin:10px 0;white-space:pre-wrap">${escapeHtml(record.description)}</div>
            ${record.aliases ? '<p><b>Синонимы:</b> '+record.aliases.join(', ')+'</p>' : ''}
            ${record.tags ? '<p><b>Теги:</b> '+record.tags.join(', ')+'</p>' : ''}
            ${record.notes ? '<div style="font-size:14px;border-top:1px solid #ccc;margin-top:10px;padding-top:10px">'+marked.parse(record.notes)+'</div>' : ''}
        `;
        document.body.appendChild(tempDiv);
        try {
            // Повышаем качество: scale 2.5, максимальный размер ~500 КБ
            const canvas = await html2canvas(tempDiv, { scale: 2.5, backgroundColor: "#ffffff" });
            let quality = 0.9;
            let blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
            // Уменьшаем качество, если размер > 500 КБ
            while (blob.size > 500 * 1024 && quality > 0.3) {
                quality -= 0.1;
                blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
            }
            if (navigator.share) {
                const file = new File([blob], `${record.symbol}.jpg`, { type: 'image/jpeg' });
                await navigator.share({ files: [file] });
            } else {
                alert("Sharing not supported");
            }
        } catch(e) { console.error(e); }
        finally { document.body.removeChild(tempDiv); }
    }

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
        else showWordList(filtered, `${lang==='ru'?'Найдено совпадений':'Matches'}: ${filtered.length}`);
    }

    // Облако тегов
    function buildTagCloud() {
        const allTags = new Set();
        db.forEach(item => { if(item.tags) item.tags.forEach(t => allTags.add(t)); });
        const sorted = Array.from(allTags).sort((a,b)=>a.localeCompare(b));
        tagCloudBlock.innerHTML = sorted.map(tag => `<span class="tag tag-cloud-item" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</span>`).join("");
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

    // Инструкция
    function showDefaultInstructions() {
        resultCard.innerHTML = `
            <div style="padding:1rem">
                <h3>📖 ${lang==='ru'?'Как пользоваться словарём':'How to use the dictionary'}</h3>
                <p style="margin:0.5rem 0; font-size:0.85rem;">${lang==='ru'?'Откройте меню (гамбургер) — там можно включить дополнительные элементы навигации.':'Open menu (hamburger) to enable extra navigation elements.'}</p>
                <p><strong>Curtains (занавесы):</strong> (1) Плотская завеса; (2) Сердце; (3) Небеса; (4) Покрытие; (5) Окончание; (6) Смерть.<br><em>См. также Veil.</em><br>(1) Евр.10:20; (2) 2Кор.3:15; (3) Пс.103:2; Ис.40:22</p>
                <ul><li>• Нумерованные толкования от наиболее вероятного к наименее.</li><li>• Скобки уточняют контекст.</li><li>• Перекрёстные ссылки.</li></ul>
                <p><strong>Life Raft:</strong> (1) Нужда в спасении; (2) Потерянный; (3) В опасности потерять спасение; (4) Ковчег (Христос).<br><em>См. также Adrift, Boat, Sea.</em></p>
                <p>• cf. = сравни, ff. = и следующие.</p>
                <p><strong>Mouse/Mice:</strong> (1) Скрытый нечистый дух; (2) Показатель духовного обслуживания; (3) Неверующий (нечистый); (4) Малый; (5) Язва; (6) Суд.<br>‘&’ = объединить стихи.</p>
            </div>
        `;
    }

    // Переключатели
    function setSwitch(container, value, onChange) {
        if(value) container.classList.add("active"); else container.classList.remove("active");
        container.onclick = () => {
            const newVal = !container.classList.contains("active");
            if(newVal) container.classList.add("active"); else container.classList.remove("active");
            onChange(newVal);
        };
    }

    function updateSwitchesUI() {
        if(showLatin) toggleLatinCont.classList.add("active"); else toggleLatinCont.classList.remove("active");
        if(showCyrillic) toggleCyrillicCont.classList.add("active"); else toggleCyrillicCont.classList.remove("active");
        if(showDigits) toggleDigitsCont.classList.add("active"); else toggleDigitsCont.classList.remove("active");
        if(showBreadcrumbs) toggleBreadcrumbsCont.classList.add("active"); else toggleBreadcrumbsCont.classList.remove("active");
        if(showTagsCloud) toggleTagsCloudCont.classList.add("active"); else toggleTagsCloudCont.classList.remove("active");
        if(allowSelection) toggleSelectionCont.classList.add("active"); else toggleSelectionCont.classList.remove("active");
    }

    function bindSwitches() {
        setSwitch(toggleLatinCont, showLatin, (val) => {
            showLatin = val; localStorage.setItem("showLatin", val); applyAlphabetVisibility();
        });
        setSwitch(toggleCyrillicCont, showCyrillic, (val) => {
            showCyrillic = val; localStorage.setItem("showCyrillic", val); applyAlphabetVisibility();
        });
        setSwitch(toggleDigitsCont, showDigits, (val) => {
            showDigits = val; localStorage.setItem("showDigits", val); applyAlphabetVisibility();
        });
        setSwitch(toggleBreadcrumbsCont, showBreadcrumbs, (val) => {
            showBreadcrumbs = val; localStorage.setItem("showBreadcrumbs", val);
            updateBreadcrumbsVisibility();
        });
        setSwitch(toggleTagsCloudCont, showTagsCloud, (val) => {
            showTagsCloud = val; localStorage.setItem("showTagsCloud", val);
            updateTagCloudVisibility();
        });
        setSwitch(toggleSelectionCont, allowSelection, (val) => {
            allowSelection = val; localStorage.setItem("allowSelection", val);
            if(val) document.body.classList.add("allow-selection");
            else document.body.classList.remove("allow-selection");
        });
    }

    // Кнопка "вверх"
    function handleScroll() {
        if(window.scrollY > 300) scrollTopBtn.classList.add("visible");
        else scrollTopBtn.classList.remove("visible");
    }

    // Очистка истории
    clearHistoryBtn.onclick = () => {
        if(confirm(lang==='ru'?'Удалить всю историю просмотров?':'Delete all browsing history?')) {
            historyStack = [];
            historyIndex = -1;
            updateHistoryNav();
            renderBreadcrumbs();
            alert(t("historyCleared"));
        }
    };

    // Меню
    function toggleMenu(open) {
        if(open) { menuPanel.classList.add("open"); menuOverlay.classList.add("open"); }
        else { menuPanel.classList.remove("open"); menuOverlay.classList.remove("open"); }
    }

    // Загрузка БД
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
                        updateStatsUI();
                        renderAlphabet();
                        updateTagCloudVisibility();
                        showDefaultInstructions();
                        dbLoaded = true;
                        return;
                    }
                }
            } catch(e) {}
        }
        dbLoaded = false;
        db = [];
        updateStatsUI();
        resultCard.innerHTML = `<div>⚠️ ${t("empty")}<br><button id="manualLoadBtn" class="mini-btn" style="margin-top:1rem;">📂 Загрузить JSON</button></div>`;
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
                            updateStatsUI();
                            renderAlphabet();
                            updateTagCloudVisibility();
                            showDefaultInstructions();
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

    // ---------- ИНИЦИАЛИЗАЦИЯ ----------
    function init() {
        setTheme(theme);
        updateLangToggleButton();
        setLang(lang);
        if(allowSelection) document.body.classList.add("allow-selection");
        else document.body.classList.remove("allow-selection");
        updateBreadcrumbsVisibility();
        updateTagCloudVisibility();
        bindSwitches();
        updateSwitchesUI();

        themeToggle.onclick = () => setTheme(theme === "light" ? "dark" : "light");
        burgerBtn.onclick = () => toggleMenu(true);
        closeMenuBtn.onclick = () => toggleMenu(false);
        menuOverlay.onclick = () => toggleMenu(false);
        showHelpBtn.onclick = () => showDefaultInstructions();
        backBtn.onclick = () => goBack();
        forwardBtn.onclick = () => goForward();
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
        window.addEventListener("scroll", handleScroll);
        scrollTopBtn.onclick = () => window.scrollTo({top:0, behavior:'smooth'});

        tryAutoLoad();
    }

    function setTheme(th) { theme = th; localStorage.setItem("clientTheme", th); if(th === "dark") document.body.classList.add("dark"); else document.body.classList.remove("dark"); }

    init();
})();
