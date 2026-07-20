import { registerServiceWorkerOnLoad } from "./src/pwa.js";
import { loadFirstAvailableDatabase, parseDatabaseText } from "./src/data.js";
import {
    appendFullHistory,
    appendNavigationHistory,
    getBreadcrumbWindow,
    groupFullHistoryByDay,
    moveNavigationHistory
} from "./src/history.js";
import { matchesAutocomplete, matchesSearch } from "./src/search.js";
import { createInitialState } from "./src/state.js";
import {
    getInstructionHtml,
    isTrustedHtmlTranslation,
    normalizeLanguage,
    translate
} from "./src/i18n.js";
import {
    buildAutocompleteHtml,
    buildBreadcrumbsHtml,
    buildFullHistoryHtml,
    buildRecordCardHtml,
    buildShareFileName,
    buildShareImageHtml,
    buildShareText,
    buildStatsHtml,
    buildTagCloudHtml,
    buildWordListHtml,
    escapeHtml
} from "./src/presentation.js";
import {
    removeStoredValue,
    writeBoolean,
    writeJson,
    writeString
} from "./src/storage.js";

(function(){
    // ---------- СОСТОЯНИЕ ----------
    const initialState = createInitialState(localStorage);
    let {
        db,
        currentMode,
        theme,
        lang,
        historyStack,
        historyIndex,
        lastDisplayedRecord,
        dbLoaded,
        currentDbName,
        fullHistory,
        showLatin,
        showCyrillic,
        showDigits,
        showBreadcrumbs,
        showTagsCloud,
        showHistoryBlock,
        allowSelection,
        wideScrollbar,
        tagSortMode,
        instructionVisible
    } = initialState;

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

    function t(key, vars = {}) {
        return translate(lang, key, vars);
    }

        // Полная локализация интерфейса
    function applyLocalization() {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.dataset.i18n;
            if (!key) return;
            if (isTrustedHtmlTranslation(key)) el.innerHTML = t(key);
            else el.textContent = t(key);
        });
        const placeholderEl = document.querySelector("[data-i18n-placeholder]");
        if (placeholderEl) placeholderEl.placeholder = t(placeholderEl.dataset.i18nPlaceholder);
        const showAllBtn = document.getElementById("showAllBtn");
        if (showAllBtn) showAllBtn.textContent = t("showAll");
        updateStatsUI();
        if (lastDisplayedRecord) showRecord(lastDisplayedRecord);
        else if (instructionVisible) showDefaultInstructions();
    }

    function updateLangToggleButton() { langToggleText.textContent = lang === "ru" ? "EN" : "RU"; }
    function setLang(l) {
        lang = normalizeLanguage(l); writeString(localStorage, "clientLang", lang);
        updateLangToggleButton();
        const scrollY = window.scrollY;
        applyLocalization();
        window.scrollTo(0, scrollY);
    }
    langToggle.onclick = () => setLang(lang === "ru" ? "en" : "ru");

    function updateStatsUI() {
        if(!db.length) { statsPanel.innerHTML = buildStatsHtml(null, lang); return; }
        const totalChars = JSON.stringify(db).length;
        let sizeStr = (totalChars / 1024).toFixed(1) + " KB";
        if(totalChars > 1024*1024) sizeStr = (totalChars / (1024*1024)).toFixed(1) + " MB";
        statsPanel.innerHTML = buildStatsHtml({ name: currentDbName, count: db.length, size: sizeStr, chars: totalChars }, lang);
    }

    const colorList = [
    // English colors (basic and extended, over 80)
    "red","green","blue","yellow","black","white","purple","orange","pink","brown","gray","grey","cyan","magenta","violet","indigo","gold","silver","bronze","beige","coral","ivory","lavender","lime","maroon","navy","olive","tan","teal","turquoise","wheat","amber","apricot","aqua","aquamarine","azure","bisque","chartreuse","chocolate","crimson","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","greenyellow","honeydew","hotpink","indianred","khaki","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightsteelblue","lightyellow","limegreen","linen","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","oldlace","olivedrab","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","plum","powderblue","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","skyblue","slateblue","slategray","snow","springgreen","steelblue","thistle","tomato","whitesmoke","yellowgreen",
    // Russian colors (over 60)
    "красный","зелёный","синий","жёлтый","чёрный","белый","фиолетовый","оранжевый","розовый","коричневый","серый","голубой","пурпурный","лавандовый","лаймовый","бордовый","тёмно-синий","оливковый","бежевый","бирюзовый","янтарный","абрикосовый","аквамариновый","амарантовый","аметистовый","багровый","васильковый","вишнёвый","горчичный","гранатовый","изумрудный","индиго","карминный","коралловый","лазурный","лиловый","малиновый","мятный","нефритовый","пшеничный","рубиновый","сапфировый","серебряный","сиреневый","сливовый","терракотовый","фисташковый","хаки","хвойный","циан","шафрановый","шартрез","айвори","бронзовый","золотой","лавандово-розовый","лососёвый","оливково-зелёный","персиковый","песочный","сепия","стальной","фуксия","шоколадный","электрик","ягодный"
    ];
    const digitWordsEn = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twenty-one","twenty-two","twenty-three","twenty-four","twenty-five","twenty-six","twenty-seven","twenty-eight","twenty-nine","thirty"];
    const digitWordsRu = ["ноль","один","два","три","четыре","пять","шесть","семь","восемь","девять","десять","одиннадцать","двенадцать","тринадцать","четырнадцать","пятнадцать","шестнадцать","семнадцать","восемнадцать","девятнадцать","двадцать","двадцать один","двадцать два","двадцать три","двадцать четыре","двадцать пять","двадцать шесть","двадцать семь","двадцать восемь","двадцать девять","тридцать"];

    // ---------- ИСТОРИЯ ----------
    function addToHistory(record) {
        if(!record) return;
        const navigation = appendNavigationHistory(historyStack, historyIndex, record);
        historyStack = navigation.stack;
        historyIndex = navigation.index;
        updateHistoryNav();
        renderBreadcrumbs();
        addToFullHistory(record);
    }
    function updateHistoryNav() {
        backBtn.disabled = historyIndex <= 0;
        forwardBtn.disabled = historyIndex >= historyStack.length-1;
    }
    function navigateHistory(direction) {
        const navigation = moveNavigationHistory(historyStack, historyIndex, direction);
        if(!navigation.entry) return;
        historyIndex = navigation.index;
        const rec = db.find(r => r.id === navigation.entry.id);
        if(rec) showRecord(rec);
    }
    function goBack() { navigateHistory(-1); }
    function goForward() { navigateHistory(1); }
    function renderBreadcrumbs() {
        if(!showBreadcrumbs) { breadcrumbsDiv.innerHTML = ""; return; }
        const { start, items } = getBreadcrumbWindow(historyStack, historyIndex);
        breadcrumbsDiv.innerHTML = buildBreadcrumbsHtml(items, start, historyIndex);
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
        fullHistory = appendFullHistory(fullHistory, record);
        writeJson(localStorage, "fullHistory", fullHistory);
        if(showHistoryBlock) renderFullHistory();
    }
    function renderFullHistory() {
        if(!showHistoryBlock) { historyBlock.style.display = 'none'; return; }
        historyBlock.style.display = 'block';
        if(!fullHistory.length) { historyBlock.innerHTML = `<div>${escapeHtml(t("historyEmpty"))}</div>`; return; }
        historyBlock.innerHTML = buildFullHistoryHtml(groupFullHistoryByDay(fullHistory));
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
        removeStoredValue(localStorage, "fullHistory");
        updateHistoryNav();
        renderBreadcrumbs();
        renderFullHistory();
    }

    // ---------- АЛФАВИТ ----------
    function renderAlphabet() {
        if(!db.length) {
            latinRow.innerHTML = `<span class="alpha-letter">${escapeHtml(t("noData"))}</span>`;
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
            showAllBtn.textContent = t("showAll");
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
                if(filtered.length) showWordList(filtered, t("symbolsForLetter", { letter, count: filtered.length }));
                else resultCard.innerHTML = `<div class="card">${escapeHtml(t("noSymbolsForLetter", { letter }))}</div>`;
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
        else resultCard.innerHTML = `<div class="card">${escapeHtml(t("noColors"))}</div>`;
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
        else resultCard.innerHTML = `<div class="card">${escapeHtml(t("noDigits"))}</div>`;
    }

    function showWordList(list, title) {
        const container = document.createElement("div");
        container.className = "card";
        container.innerHTML = buildWordListHtml(list, title);
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
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = buildRecordCardHtml(record, lang);
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
        const text = buildShareText(record, lang);
        if(navigator.share) navigator.share({ title: record.symbol, text }).catch(()=>{});
        else alert(t("shareUnsupported"));
    }

    async function shareAsImage(record) {
        if(typeof html2canvas === 'undefined') { alert(t("imageShareUnavailable")); return; }
        const tempDiv = document.createElement("div");
        tempDiv.style.cssText = "position:absolute;left:-9999px;top:0;width:600px;background:white;padding:20px;font-family:Inter,sans-serif;color:#2c2825;";
        tempDiv.innerHTML = buildShareImageHtml(record, lang);
        document.body.appendChild(tempDiv);
        try {
            const canvas = await html2canvas(tempDiv, { scale: 2.5, backgroundColor: "#ffffff" });
            let blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
            let quality = 0.9;
            while(blob.size > 500*1024 && quality > 0.3) { quality -= 0.1; blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality)); }
            if(navigator.share && blob) { const file = new File([blob], buildShareFileName(record.symbol), { type: 'image/jpeg' }); await navigator.share({ files: [file] }); }
        } catch(e) { console.error(e); }
        finally { document.body.removeChild(tempDiv); }
    }

    // ---------- ПОИСК И АВТОДОПОЛНЕНИЕ ----------
    function updateAutocomplete() {
        const q = searchInput.value.trim();
        if(!q) { autocompleteList.classList.remove("show"); autocompleteSpacer.style.height = "0"; return; }
        const matches = db.filter(item => matchesAutocomplete(item, q, currentMode)).slice(0, 7);
        if(matches.length) {
            autocompleteList.innerHTML = buildAutocompleteHtml(matches);
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
            else resultCard.innerHTML = `<div class="card">${escapeHtml(t("enterQuery"))}</div>`;
            return;
        }
        const filtered = db.filter((item) => matchesSearch(item, q, currentMode));
        if(filtered.length === 0) { resultCard.innerHTML = `<div class="card">${escapeHtml(t("notFound"))}</div>`; return; }
        if(filtered.length === 1) { showRecord(filtered[0]); addToHistory(filtered[0]); }
        else showWordList(filtered, t("matches", { count: filtered.length }));
        instructionVisible = false;
    }

    // ---------- ОБЛАКО ТЕГОВ ----------
    function buildTagCloud() {
        const tagCounts = {};
        db.forEach(item => { if(item.tags) item.tags.forEach(t => tagCounts[t] = (tagCounts[t]||0)+1); });
        let tagsArray = Object.entries(tagCounts).map(([tag, count]) => ({tag, count}));
        if(tagSortMode === "alpha") tagsArray.sort((a,b) => a.tag.localeCompare(b.tag));
        else tagsArray.sort((a,b) => b.count - a.count || a.tag.localeCompare(b.tag));
        tagCloudBlock.innerHTML = buildTagCloudHtml(tagsArray, tagSortMode);
        document.getElementById("toggleTagSortBtn").addEventListener("click", () => {
            tagSortMode = tagSortMode === "alpha" ? "count" : "alpha";
            writeString(localStorage, "tagSortMode", tagSortMode);
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
        card.innerHTML = getInstructionHtml(lang);
        resultCard.innerHTML = "";
        resultCard.appendChild(card);
        document.getElementById("closeInstructionBtn").addEventListener("click", () => {
            instructionVisible = false;
            resultCard.innerHTML = `<div class="card">${escapeHtml(t("enterQuery"))}</div>`;
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
        setSwitch(toggleLatinCont, showLatin, v => { showLatin=v; writeBoolean(localStorage, "showLatin", v); applyAlphabetVisibility(); });
        setSwitch(toggleCyrillicCont, showCyrillic, v => { showCyrillic=v; writeBoolean(localStorage, "showCyrillic", v); applyAlphabetVisibility(); });
        setSwitch(toggleDigitsCont, showDigits, v => { showDigits=v; writeBoolean(localStorage, "showDigits", v); applyAlphabetVisibility(); });
        setSwitch(toggleBreadcrumbsCont, showBreadcrumbs, v => { showBreadcrumbs=v; writeBoolean(localStorage, "showBreadcrumbs", v); updateBreadcrumbsVisibility(); });
        setSwitch(toggleTagsCloudCont, showTagsCloud, v => { showTagsCloud=v; writeBoolean(localStorage, "showTagsCloud", v); updateTagCloudVisibility(); });
        setSwitch(toggleHistoryBlockCont, showHistoryBlock, v => { showHistoryBlock=v; writeBoolean(localStorage, "showHistoryBlock", v); renderFullHistory(); });
        setSwitch(toggleSelectionCont, allowSelection, v => { allowSelection=v; writeBoolean(localStorage, "allowSelection", v); document.body.classList.toggle("allow-selection", v); });
        setSwitch(toggleScrollbarCont, wideScrollbar, v => { wideScrollbar=v; writeBoolean(localStorage, "wideScrollbar", v); document.body.classList.toggle("custom-scrollbar", v); });
    }

    function handleScroll() {
        if(window.scrollY > 300) scrollTopBtn.classList.add("visible");
        else scrollTopBtn.classList.remove("visible");
    }

    function toggleMenu(open) { menuPanel.classList.toggle("open", open); menuOverlay.classList.toggle("open", open); }

    // ---------- ЗАГРУЗКА БД ----------
    async function tryAutoLoad() {
        resultCard.innerHTML = `<div class="card"><div class="loader"></div><div style="text-align:center">${escapeHtml(t("loading"))}</div></div>`;

        const loaded = await loadFirstAvailableDatabase();
        if(loaded) {
            db = loaded.records;
            currentDbName = loaded.name;
            updateStatsUI();
            renderAlphabet();
            updateTagCloudVisibility();
            showDefaultInstructions();
            dbLoaded = true;
            return;
        }

        dbLoaded = false;
        db = [];
        updateStatsUI();
        resultCard.innerHTML = `<div class="card">⚠️ ${escapeHtml(t("empty"))}<br><button id="manualLoadBtn" class="mini-btn" style="margin-top:1rem;">${escapeHtml(t("manualLoad"))}</button></div>`;
        document.getElementById("manualLoadBtn")?.addEventListener("click", () => {
            const inp = document.createElement("input");
            inp.type = "file";
            inp.accept = "application/json";
            inp.onchange = e => {
                const file = e.target.files[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const loadedFile = parseDatabaseText(String(e.target.result), file.name);
                        db = loadedFile.records;
                        currentDbName = loadedFile.name;
                        updateStatsUI();
                        renderAlphabet();
                        updateTagCloudVisibility();
                        showDefaultInstructions();
                        dbLoaded = true;
                    } catch(err) {
                        alert(t("invalidJson"));
                    }
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

    function setTheme(th) { theme = th; writeString(localStorage, "clientTheme", th); document.body.classList.toggle("dark", th==="dark"); }

        init();

    registerServiceWorkerOnLoad();

})();
