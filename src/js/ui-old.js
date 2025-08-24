// src/js/ui.js
import { MESSAGES } from './i18n.js';
import { auth } from './auth.js';
import { learningManager } from './learningManager.js';
import { settingsManager } from './settingsManager.js';

export const ui = {
    // Properties (will be initialized in init)
    modal: null,
    settingsModal: null,
    settingsFormContainer: null,
    settingsEditBtn: null,
    settingsCancelBtn: null,
    settingsSaveBtn: null,
    yesButton: null,
    noButton: null,
    messageElement: null,
    hamburgerMenu: null,
    menuOverlay: null,
    closeMenuBtn: null,
    menuLangToggleBtn: null,
    menuLogoutBtn: null,
    menuRandomModeBtn: null,
    menuDarkModeToggleBtn: null,
    sortingCompletionModal: null,
    sortingCompletionReplayBtn: null,
    sortingCompletionBackToMenuBtn: null,
    explanationModal: null,
    closeExplanationModalBtn: null,
    aboutBtn: null,
    aboutModal: null,
    closeAboutModalBtn: null,
    menuSettingsBtn: null,
    flashcardSummaryContainer: null,
    matchingSummaryContainer: null,

    init(appInstance) {
        this.app = appInstance;

        // Initialize DOM elements
        this.modal = document.getElementById('confirmation-modal');
        this.flashcardSummaryContainer = document.getElementById('flashcard-summary-container');
        
        this.yesButton = document.getElementById('confirm-yes');
        this.noButton = document.getElementById('confirm-no');
        this.messageElement = document.getElementById('confirmation-message');
        this.hamburgerMenu = document.getElementById('hamburger-menu');
        this.menuOverlay = document.getElementById('menu-overlay');
        this.closeMenuBtn = document.getElementById('close-menu-btn');
        this.menuLangToggleBtn = document.getElementById('menu-lang-toggle-btn');
        this.menuLogoutBtn = document.getElementById('menu-logout-btn');
        this.menuRandomModeBtn = document.getElementById('menu-random-mode-btn');
        this.menuDarkModeToggleBtn = document.getElementById('menu-dark-mode-toggle-btn');
        this.sortingCompletionModal = document.getElementById('sorting-completion-modal');
        this.sortingCompletionReplayBtn = document.getElementById('sorting-completion-replay-btn');
        this.sortingCompletionBackToMenuBtn = document.getElementById('sorting-completion-back-to-menu-btn');
        this.explanationModal = document.getElementById('explanation-modal');
        this.closeExplanationModalBtn = document.getElementById('close-explanation-modal-btn');
        this.aboutBtn = document.getElementById('menu-about-btn');
        this.aboutModal = document.getElementById('about-modal');
        this.closeAboutModalBtn = document.getElementById('close-about-modal-btn');
        this.menuSettingsBtn = document.getElementById('menu-settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.settingsFormContainer = document.getElementById('settings-form-container');
        this.settingsCloseBtn = document.getElementById('settings-close-btn');
        this.settingsSaveBtn = document.getElementById('settings-save-btn');

        // Setup all event listeners
        this.setupConfirmationModalListeners();
        this.setupHamburgerMenuListeners();
        this.setupSortingCompletionModalListeners();
        this.setupExplanationModalListeners();
        this.setupAboutModalListeners();
        this.setupSettingsModalListeners();

        // Initial UI updates
        MESSAGES.addListener(this.renderHeader.bind(this));
        MESSAGES.addListener(this.updateMenuText.bind(this));
        MESSAGES.addListener(this.updateConfirmationModalText.bind(this));
        MESSAGES.addListener(this.updateAboutModalText.bind(this));
        MESSAGES.addListener(this.updateFlashcardSummaryText.bind(this));
        MESSAGES.addListener(this.updateMatchingSummaryText.bind(this));
        MESSAGES.addListener(this.updateSortingCompletionModalText.bind(this));
        MESSAGES.addListener(this.updateSettingsModalText.bind(this));
        this.updateMenuText();
        this.updateConfirmationModalText();
        this.updateAboutModalText();
        this.updateSettingsModalText();
    },

    // Helper functions moved from utils.js
    toggleModal(modalElement, show) {
        modalElement.classList.toggle('hidden', !show);
    },

    showExplanationModal(modalElement, wordData) {
        document.getElementById('explanation-word').textContent = wordData.word;
        document.getElementById('explanation-word-translation').textContent = wordData.translation_es;
        document.getElementById('explanation-example-en').textContent = `"${wordData.example}"`;
        document.getElementById('explanation-example-es').textContent = `"${wordData.example_es}"`;
        document.body.appendChild(modalElement);
        modalElement.classList.remove('hidden');
    },

    toggleHamburgerMenu(show) {
        document.body.classList.toggle('hamburger-menu-open', show);
    },

    updateSessionScoreDisplay(correct, incorrect, total) {
        const sessionScoreDisplay = document.getElementById('session-score-display');
        if (sessionScoreDisplay) {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const correctColor = isDarkMode ? 'text-green-400' : 'text-green-700';
            const incorrectColor = isDarkMode ? 'text-red-400' : 'text-red-700';
            const totalColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';

            sessionScoreDisplay.innerHTML = `
                <span class="text-sm font-semibold">${MESSAGES.get('sessionLabel')}:</span>
                <span class="ml-1 ${correctColor} font-bold">${MESSAGES.get('correctIcon')} ${correct}</span>
                <span class="ml-1 ${incorrectColor} font-bold">${MESSAGES.get('incorrectIcon')} ${incorrect}</span>
                <span class="ml-1 ${totalColor} font-bold">${MESSAGES.get('totalLabel')}: ${total}</span>
            `;
            sessionScoreDisplay.classList.remove('hidden');
        }
    },

    renderHeader() {
        const user = auth.getUser();
        const scoreContainer = document.getElementById('score-container');
        const usernameDisplay = document.getElementById('username-display');
        const hamburgerBtn = document.getElementById('hamburger-btn');
    
        if (user) {
            scoreContainer.classList.remove('hidden');
            usernameDisplay.classList.remove('hidden');
            hamburgerBtn.classList.remove('hidden');
            hamburgerBtn.addEventListener('click', () => this.toggleHamburgerMenu(true));
            
            const isDarkMode = document.body.classList.contains('dark-mode');
            const correctColor = isDarkMode ? 'text-green-400' : 'text-green-700';
            const incorrectColor = isDarkMode ? 'text-red-400' : 'text-red-700';

            const globalScoreEl = document.getElementById('global-score');
            if (globalScoreEl) {
                globalScoreEl.innerHTML = `
                    <span class="text-sm font-semibold">${MESSAGES.get('globalScore')}:</span>
                    <span class="ml-1 ${correctColor} font-bold">✅ ${user.globalScore.correct}</span>
                    <span class="ml-1 ${incorrectColor} font-bold">❌ ${user.globalScore.incorrect}</span>
                `;
            }

            const usernameDisplayEl = document.getElementById('username-display');
            if (usernameDisplayEl) {
                usernameDisplayEl.innerHTML = `<span class="text-lg font-bold">${MESSAGES.get('userIcon')} ${user.username}</span>`;
            }
        } else {
            scoreContainer.classList.add('hidden');
            usernameDisplay.classList.add('hidden');
            hamburgerBtn.classList.add('hidden');
        }
    },

    updateFooterVisibility(currentView) {
        const footer = document.getElementById('main-footer-copyright');
        const footerWebText = document.getElementById('footer-web-text');
        const footerMobileText = document.getElementById('footer-mobile-text');

        if (footer && footerWebText && footerMobileText) {
            if (currentView === 'menu') {
                footer.style.display = 'block';
                footerWebText.textContent = MESSAGES.get('footerWeb');
                footerMobileText.textContent = MESSAGES.get('footerMobile');
            } else {
                footer.style.display = 'none';
            }
        }
    },

    isMobile() {
        return window.innerWidth <= 768;
    },

    // Specific UI setup methods
    setupConfirmationModalListeners() {
        if (this.yesButton) {
            this.yesButton.addEventListener('click', () => {
                auth.logout();
                this.toggleModal(this.modal, false);
            });
        }
        if (this.noButton) {
            this.noButton.addEventListener('click', () => {
                this.toggleModal(this.modal, false);
            });
        }
    },

    setupHamburgerMenuListeners() {
        if (this.closeMenuBtn) {
            this.closeMenuBtn.addEventListener('click', () => this.toggleHamburgerMenu(false));
        }
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => this.toggleHamburgerMenu(false));
        }
        if (this.menuLangToggleBtn) {
            this.menuLangToggleBtn.addEventListener('click', () => {
                const newLang = MESSAGES.getLanguage() === 'en' ? 'es' : 'en';
                MESSAGES.setLanguage(newLang);
                localStorage.setItem('appLang', newLang);
                this.updateMenuText();
                if (this.app.currentView === 'menu') {
                    this.app.renderMenu();
                }
                this.updateFooterVisibility(this.app.currentView);
            });
        }
        if (this.menuLogoutBtn) {
            this.menuLogoutBtn.addEventListener('click', () => {
                this.toggleHamburgerMenu(false);
                this.messageElement.textContent = MESSAGES.get('confirmLogoutMessage');
                this.toggleModal(this.modal, true);
            });
        }
        if (this.menuRandomModeBtn) {
            this.menuRandomModeBtn.addEventListener('click', () => {
                this.app.randomMode = !this.app.randomMode;
                localStorage.setItem('randomMode', this.app.randomMode);
                this.updateMenuText();
            });
        }
        if (this.menuDarkModeToggleBtn) {
            this.menuDarkModeToggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    localStorage.setItem('darkMode', 'disabled');
                }
                this.updateMenuText();
            });
        }
    },

    setupSortingCompletionModalListeners() {
        if (this.sortingCompletionReplayBtn) {
            this.sortingCompletionReplayBtn.addEventListener('click', () => {
                this.sortingCompletionModal.classList.add('hidden');
                learningManager.startModule(this.app.currentModule.id);
            });
        }
        if (this.sortingCompletionBackToMenuBtn) {
            this.sortingCompletionBackToMenuBtn.addEventListener('click', () => {
                this.sortingCompletionModal.classList.add('hidden');
                this.app.renderMenu();
            });
        }
    },

    setupExplanationModalListeners() {
        if (this.closeExplanationModalBtn) {
            this.closeExplanationModalBtn.addEventListener('click', () => {
                this.explanationModal.classList.add('hidden');
            });
        }
    },

    setupAboutModalListeners() {
        if (this.aboutBtn && this.aboutModal && this.closeAboutModalBtn) {
            this.aboutBtn.addEventListener('click', () => {
                this.aboutModal.classList.remove('hidden');
                if (this.hamburgerMenu) {
                    this.hamburgerMenu.classList.remove('translate-x-0');
                    this.hamburgerMenu.classList.add('translate-x-full');
                }
            });

            this.closeAboutModalBtn.addEventListener('click', () => {
                this.aboutModal.classList.add('hidden');
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !this.aboutModal.classList.contains('hidden')) {
                    this.aboutModal.classList.add('hidden');
                }
            });
        }
    },

    setupSettingsModalListeners() {
        if (this.menuSettingsBtn) {
            this.menuSettingsBtn.addEventListener('click', () => {
                this.toggleHamburgerMenu(false);
                this.toggleModal(this.settingsModal, true);
                this.renderSettingsForm();
                this.updateSettingsModalText();
            });
        }

        if (this.settingsCloseBtn) {
            this.settingsCloseBtn.addEventListener('click', () => {
                this.toggleModal(this.settingsModal, false);
            });
        }

        if (this.settingsSaveBtn) {
            this.settingsSaveBtn.addEventListener('click', () => {
                const formData = this.getSettingsFormData();
                this.applySettingsChanges(formData);
                this.toggleModal(this.settingsModal, false);
            });
        }
    },

    // Helper to convert keyPath to i18n key
    keyPathToI18nKey(keyPath) {
        const parts = keyPath.split('.');
        if (parts[0] === 'learningSettings' && parts.length > 1) {
            let i18nKey = 'settings';
            for (let i = 1; i < parts.length; i++) {
                i18nKey += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
            }
            return i18nKey;
        } else {
            let i18nKey = 'settings';
            for (const part of parts) {
                i18nKey += part.charAt(0).toUpperCase() + part.slice(1);
            }
            return i18nKey;
        }
    },

    renderSettingsForm() {
        this.settingsFormContainer.innerHTML = '';
        const settings = settingsManager.settings;

        const mainTitle = document.createElement('h2');
        mainTitle.className = 'text-lg font-bold mb-2 text-center';
        mainTitle.textContent = MESSAGES.get('settingsTitle');
        this.settingsFormContainer.appendChild(mainTitle);

        const createInputField = (keyPath, value, type = 'number') => {
            const settingRow = document.createElement('div');
            settingRow.className = 'flex flex-col mb-1';

            const label = document.createElement('label');
            label.className = 'text-gray-700 text-sm font-semibold';
            label.textContent = MESSAGES.get(this.keyPathToI18nKey(keyPath));
            settingRow.appendChild(label);

            let inputElement;
            if (keyPath === 'defaultLanguage') {
                inputElement = document.createElement('select');
                inputElement.className = 'shadow appearance-none border rounded w-full py-0.5 px-1 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline';
                inputElement.dataset.keyPath = keyPath;
                const enOption = document.createElement('option');
                enOption.value = 'en';
                enOption.textContent = MESSAGES.get('languageEn');
                inputElement.appendChild(enOption);
                const esOption = document.createElement('option');
                esOption.value = 'es';
                esOption.textContent = MESSAGES.get('languageEs');
                inputElement.appendChild(esOption);
                inputElement.value = value;
                settingRow.appendChild(inputElement);
            } else {
                inputElement = document.createElement('input');
                inputElement.type = type;
                inputElement.className = 'shadow appearance-none border rounded py-0.5 px-1 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline ' + (type === 'number' ? 'w-16 text-center' : 'w-full');
                inputElement.value = value;
                inputElement.dataset.keyPath = keyPath;

                if (type === 'number') {
                    inputElement.min = "1";
                    inputElement.max = "50";
                }
                settingRow.appendChild(inputElement);
            }
            return settingRow;
        };

        const buildForm = (obj, prefix = '') => {
            for (const key in obj) {
                const keyPath = prefix ? `${prefix}.${key}` : key;
                
                if (Array.isArray(obj[key])) {
                    if (keyPath.startsWith('learningSettings.')) {
                        const settingRow = document.createElement('div');
                        settingRow.className = 'mb-2';

                        const label = document.createElement('div');
                        label.className = 'text-gray-700 text-sm font-semibold mb-1';
                        label.textContent = keyPath === 'learningSettings.categories' ? MESSAGES.get('settingsCategories') : MESSAGES.get(this.keyPathToI18nKey(keyPath));
                        settingRow.appendChild(label);

                        const valueContainer = document.createElement('div');
                        valueContainer.className = 'grid grid-cols-2 gap-1 text-xs';
                        
                        const categoryLabels = {
                            'Vocabulary': '📚 Vocabulary',
                            'Grammar': '📝 Grammar', 
                            'PhrasalVerbs': '🔗 Phrasal Verbs',
                            'Idioms': '💭 Idioms'
                        };
                        
                        obj[key].forEach(item => {
                            const itemSpan = document.createElement('span');
                            itemSpan.className = 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-center';
                            itemSpan.textContent = categoryLabels[item] || item;
                            valueContainer.appendChild(itemSpan);
                        });
                        
                        settingRow.appendChild(valueContainer);
                        this.settingsFormContainer.appendChild(settingRow);
                    }
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    const sectionTitle = document.createElement('h3');
                    sectionTitle.className = 'text-base font-bold mt-2 mb-1 pb-0.5 border-b border-gray-200';
                    sectionTitle.textContent = MESSAGES.get(this.keyPathToI18nKey(keyPath));
                    this.settingsFormContainer.appendChild(sectionTitle);
                    buildForm(obj[key], keyPath);
                } else {
                    if (keyPath.startsWith('learningSettings.')) {
                        const settingRow = document.createElement('div');
                        settingRow.className = 'flex justify-between items-center mb-1';

                        const label = document.createElement('span');
                        label.className = 'text-gray-700 text-sm font-semibold';
                        label.textContent = MESSAGES.get(this.keyPathToI18nKey(keyPath));
                        settingRow.appendChild(label);

                        const valueSpan = document.createElement('span');
                        valueSpan.className = 'text-gray-600 text-sm';
                        valueSpan.textContent = obj[key];
                        settingRow.appendChild(valueSpan);

                        this.settingsFormContainer.appendChild(settingRow);
                    } else {
                        this.settingsFormContainer.appendChild(createInputField(keyPath, obj[key]));
                    }
                }
            }
        };

        buildForm(settings);

        this.settingsSaveBtn.classList.remove('hidden');
        this.settingsCloseBtn.classList.remove('hidden');
    },

    getSettingsFormData() {
        const formData = {};
        this.settingsFormContainer.querySelectorAll('input[data-key-path], select[data-key-path]').forEach(input => {
            const keyPath = input.dataset.keyPath;
            let value = input.value;
            if (input.type === 'number' && !isNaN(value) && !isNaN(parseFloat(value))) {
                value = parseFloat(value);
            }
            formData[keyPath] = value;
        });
        return formData;
    },

    applySettingsChanges(formData) {
        for (const keyPath in formData) {
            settingsManager.setSetting(keyPath, formData[keyPath]);
        }
    },

    updateMenuText() {
        if (this.menuLangToggleBtn) {
            const currentLang = MESSAGES.getLanguage();
            this.menuLangToggleBtn.innerHTML = currentLang === 'en' ? MESSAGES.get('languageEs') : MESSAGES.get('languageEn');
        }
        if (this.menuLogoutBtn) {
            this.menuLogoutBtn.innerHTML = `${MESSAGES.get('logoutButton')}${MESSAGES.get('logoutIcon')}`;
        }
        if (this.menuDarkModeToggleBtn) {
            const isDarkMode = document.body.classList.contains('dark-mode');
            this.menuDarkModeToggleBtn.innerHTML = isDarkMode ? `${MESSAGES.get('lightMode')}${MESSAGES.get('lightModeIcon')}` : `${MESSAGES.get('darkMode')}${MESSAGES.get('darkModeIcon')}`;
        }
        if (this.menuRandomModeBtn) {
            this.menuRandomModeBtn.innerHTML = `${MESSAGES.get('randomMode')} ${this.app.randomMode ? MESSAGES.get('onText') : MESSAGES.get('offText')}`;
        }
        if (this.aboutBtn) {
            this.aboutBtn.innerHTML = `${MESSAGES.get('aboutButton')} ${MESSAGES.aboutIcon}`;
        }
        if (this.menuSettingsBtn) {
            this.menuSettingsBtn.innerHTML = `${MESSAGES.get('settingsButton')} ${MESSAGES.settingsIcon}`;
        }

        if (this.sortingCompletionModal && !this.sortingCompletionModal.classList.contains('hidden')) {
            document.getElementById('sorting-completion-title').textContent = MESSAGES.get('sortingCompletionTitle');
            document.getElementById('sorting-completion-message').textContent = MESSAGES.get('sortingCompletionMessage');
            document.getElementById('sorting-completion-replay-btn').textContent = MESSAGES.get('replayButton');
            document.getElementById('sorting-completion-back-to-menu-btn').textContent = MESSAGES.get('backToMenu');
        }
    },

    updateConfirmationModalText() {
        if (this.yesButton) {
            this.yesButton.textContent = MESSAGES.get('yesButton');
        }
        if (this.noButton) {
            this.noButton.textContent = MESSAGES.get('noButton');
        }
    },

    updateAboutModalText() {
        const aboutModal = document.getElementById('about-modal');
        if (aboutModal) {
            aboutModal.querySelector('[data-i18n="aboutTitle"]').textContent = MESSAGES.get('aboutTitle');
            aboutModal.querySelector('[data-i18n="aboutText1"]').textContent = MESSAGES.get('aboutText1');
            aboutModal.querySelector('[data-i18n="aboutText2"]').textContent = MESSAGES.get('aboutText2');
            aboutModal.querySelector('[data-i18n="closeButton"]').textContent = MESSAGES.get('closeButton');
        }
    },

    updateFlashcardSummaryText() {
        const messageElement = document.getElementById('flashcard-summary-message');
        const replayBtn = document.getElementById('flashcard-summary-replay-btn');
        const backToMenuBtn = document.getElementById('flashcard-summary-back-to-menu-btn');

        if (replayBtn) {
            replayBtn.textContent = MESSAGES.get('replayButton');
        }
        if (backToMenuBtn) {
            backToMenuBtn.textContent = MESSAGES.get('backToMenu');
        }
    },

    updateMatchingSummaryText(matchedPairs, moduleData) {
        const modal = document.getElementById('matching-completion-modal');
        if (!modal) return;

        modal.querySelector('#matching-completion-title').textContent = MESSAGES.get('sessionScore');
        modal.querySelector('#matching-completion-message').textContent = MESSAGES.get('matchingCompletionMessage');
        modal.querySelector('#matching-completion-replay-btn').textContent = MESSAGES.get('replayButton');
        modal.querySelector('#matching-completion-back-to-menu-btn').textContent = MESSAGES.get('backToMenu');
        modal.querySelector('.grid.grid-cols-2.gap-2.font-bold.border-b-2.border-gray-300.pb-2.mb-2 > span:first-child').textContent = MESSAGES.get('terms');
        modal.querySelector('.grid.grid-cols-2.gap-2.font-bold.border-b-2.border-gray-300.pb-2.mb-2 > span:last-child').textContent = MESSAGES.get('translationLabel');

        const matchedPairsGrid = document.getElementById('matched-pairs-grid');
        if (matchedPairsGrid) {
            matchedPairsGrid.querySelectorAll('.explanation-btn').forEach(button => {
                button.title = MESSAGES.get('showExplanation');
                button.ariaLabel = MESSAGES.get('showExplanation');
            });
        }
    },

    updateSortingCompletionModalText() {
        const title = document.getElementById('sorting-completion-title');
        const message = document.getElementById('sorting-completion-message');
        const replayBtn = document.getElementById('sorting-completion-replay-btn');
        const backToMenuBtn = document.getElementById('sorting-completion-back-to-menu-btn');

        if (title) {
            title.textContent = MESSAGES.get('sortingCompletionTitle');
        }
        if (message) {
            message.textContent = MESSAGES.get('sortingCompletionMessage');
        }
        if (replayBtn) {
            replayBtn.textContent = MESSAGES.get('replayButton');
        }
        if (backToMenuBtn) {
            backToMenuBtn.textContent = MESSAGES.get('backToMenu');
        }

        const wordsContainer = document.getElementById('sorting-completion-words-container');
        if (wordsContainer) {
            wordsContainer.querySelectorAll('.explanation-btn').forEach(button => {
                button.title = MESSAGES.get('showExplanation');
                button.ariaLabel = MESSAGES.get('showExplanation');
            });
        }
    },

    showSortingCompletionModal(moduleData) {
        const modal = this.sortingCompletionModal;
        const wordsContainer = document.createElement('div');
        wordsContainer.id = 'sorting-completion-words-container';
        wordsContainer.className = 'mt-4 mb-4 text-left pr-4';

        this.updateSortingCompletionModalText();

        const existingWordsContainer = modal.querySelector('#sorting-completion-words-container');
        if (existingWordsContainer) {
            existingWordsContainer.remove();
        }

        const presentedWords = learningManager.sortingModule.words;
        const wordsToExplain = moduleData.data.filter(item => presentedWords.includes(item.word));

        const categoryMap = new Map();
        learningManager.sortingModule.categories.forEach(cat => {
            categoryMap.set(cat.category_id, cat.category_show);
        });

        wordsToExplain.forEach(item => {
            const wordItem = document.createElement('div');
            wordItem.className = 'sorting-summary-item-grid py-2 border-b border-gray-200 items-center';
            const categoryDisplayName = categoryMap.get(item.category) || 'N/A';
            wordItem.innerHTML = `
                <span class="text-sm text-gray-500 font-medium">${categoryDisplayName}</span>
                <span class="text-lg font-semibold">${item.word}</span>
                <span class="text-base text-gray-700 italic">${item.translation_es}</span>
                <button title="${MESSAGES.get('showExplanation')}" aria-label="${MESSAGES.get('showExplanation')}" class="explanation-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out text-sm justify-self-center mr-1">
                    &#x2139;
                </button>
            `;
            wordItem.querySelector('.explanation-btn').addEventListener('click', () => {
                this.showExplanationModal(this.explanationModal, item);
            });
            wordsContainer.appendChild(wordItem);
        });

        modal.querySelector('.flex.justify-center.space-x-4').before(wordsContainer);
        modal.classList.remove('hidden');
    },

    showFlashcardSummary(count) {
        if (this.flashcardSummaryContainer) {
            const messageElement = document.getElementById('flashcard-summary-message');
            const replayBtn = document.getElementById('flashcard-summary-replay-btn');
            const backToMenuBtn = document.getElementById('flashcard-summary-back-to-menu-btn');

            if (messageElement) {
                messageElement.textContent = MESSAGES.get('flashcardSummaryMessage', { count: count });
            }

            if (replayBtn) {
                replayBtn.textContent = MESSAGES.get('replayButton');
                replayBtn.onclick = () => {
                    this.toggleModal(this.flashcardSummaryContainer, false);
                    learningManager.replayModule();
                };
            }

            if (backToMenuBtn) {
                backToMenuBtn.textContent = MESSAGES.get('backToMenu');
                backToMenuBtn.onclick = () => {
                    this.toggleModal(this.flashcardSummaryContainer, false);
                    this.app.renderMenu();
                };
            }

            this.toggleModal(this.flashcardSummaryContainer, true);
        }
    },

    showMatchingSummary(matchedPairs, moduleData) {
        const appContainer = document.getElementById('app-container');
        appContainer.classList.remove('main-menu-active');

        let modal = document.getElementById('matching-completion-modal');
        if (!modal) {
            modal = document.createElement('div');
            
            modal.id = 'matching-completion-modal';
            modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 hidden';
            modal.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-xl w-full text-center">
                    <h2 id="matching-completion-title" class="text-2xl font-bold mb-4"></h2>
                    <p id="matching-completion-message" class="text-xl mb-4"></p>
                    <div class="mb-4 text-left max-h-60 overflow-y-auto pr-2">
                        <div class="grid grid-cols-2 gap-2 font-bold border-b-2 border-gray-300 pb-2 mb-2">
                            <span></span>
                            <span></span>
                        </div>
                        <div id="matched-pairs-grid" class="grid grid-cols-2 gap-2">
                            <!-- Matched pairs and explanation buttons will be listed here -->
                        </div>
                    </div>
                    <div class="flex justify-center space-x-4">
                        <button id="matching-completion-replay-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out">
                        </button>
                        <button id="matching-completion-back-to-menu-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out">
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('matching-completion-replay-btn').addEventListener('click', () => {
                modal.classList.add('hidden');
                learningManager.startModule(this.app.currentModule.id);
            });
            document.getElementById('matching-completion-back-to-menu-btn').addEventListener('click', () => {
                modal.classList.add('hidden');
                this.app.renderMenu();
            });
        }

        this.updateMatchingSummaryText(matchedPairs, moduleData);

        const matchedPairsGrid = document.getElementById('matched-pairs-grid');
        matchedPairsGrid.innerHTML = '';

        matchedPairs.forEach(pair => {
            const termData = moduleData.data.find(item => item.id === pair.termId);
            if (termData) {
                const termSpan = document.createElement('span');
                termSpan.className = 'font-semibold';
                termSpan.textContent = termData.term;
                matchedPairsGrid.appendChild(termSpan);

                const translationContainer = document.createElement('div');
                translationContainer.className = 'flex items-center justify-between';

                const translationSpan = document.createElement('span');
                translationSpan.textContent = termData.term_es;
                translationContainer.appendChild(translationSpan);

                const explanationButton = document.createElement('button');
                explanationButton.className = 'explanation-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-md text-sm justify-self-center mr-1';
                explanationButton.innerHTML = '&#x2139;';
                explanationButton.title = MESSAGES.get('showExplanation');
                explanationButton.ariaLabel = MESSAGES.get('showExplanation');
                explanationButton.addEventListener('click', () => {
                    this.showExplanationModal(this.explanationModal, {
                        word: termData.term,
                        translation_es: termData.term_es,
                        example: termData.explanation,
                        example_es: termData.explanation_es
                    });
                });
                translationContainer.appendChild(explanationButton);
                matchedPairsGrid.appendChild(translationContainer);
            }
        });

        modal.classList.remove('hidden');
    },

    updateSettingsModalText() {
        if (this.settingsSaveBtn) {
            this.settingsSaveBtn.textContent = MESSAGES.get('saveButton');
        }
        if (this.settingsCloseBtn) {
            this.settingsCloseBtn.textContent = MESSAGES.get('closeButton');
        }
    },
};