// src/js/ui.js
import { MESSAGES } from './i18n.js'; // Assuming i18n.js is the new name for messages
import { auth } from './auth.js'; // For renderHeader and logout
import { gameManager } from './gameManager.js'; // Import gameManager module

export const ui = {
    // Properties (will be initialized in init)
    modal: null,
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

    init(appInstance) { // Pass app instance to allow calling app methods
        this.app = appInstance; // Store app instance

        // Initialize DOM elements
        this.modal = document.getElementById('confirmation-modal');
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


        // Setup all event listeners
        this.setupConfirmationModalListeners();
        this.setupHamburgerMenuListeners();
        this.setupSortingCompletionModalListeners();
        this.setupExplanationModalListeners();
        this.setupAboutModalListeners();

        // Initial UI updates
        MESSAGES.addListener(this.renderHeader.bind(this));
        MESSAGES.addListener(this.updateMenuText.bind(this));
        MESSAGES.addListener(this.updateConfirmationModalText.bind(this));
        MESSAGES.addListener(this.updateAboutModalText.bind(this));
        MESSAGES.addListener(this.updateFlashcardSummaryText.bind(this));
        MESSAGES.addListener(this.updateMatchingSummaryText.bind(this));
        MESSAGES.addListener(this.updateSortingCompletionModalText.bind(this));
        this.updateMenuText();
        this.updateConfirmationModalText();
        this.updateAboutModalText();
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
            // Original renderHeaderUtil from utils.js is now this.renderHeader
            // This function is now part of ui.js, so it will handle its own rendering.
            // The app.js will call ui.renderHeader()
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
                this.app.randomMode = !this.app.randomMode; // Update app's randomMode
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
                gameManager.startModule(this.app.currentModule.id);
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
                if (this.hamburgerMenu) { // Ensure hamburger menu is defined
                    this.hamburgerMenu.classList.remove('translate-x-0');
                    this.hamburgerMenu.classList.add('translate-x-full');
                }
            });

            this.closeAboutModalBtn.addEventListener('click', () => {
                this.aboutModal.classList.add('hidden');
            });

            // This listener was on menuOverlay in app.js, but it's more specific to aboutModal here
            // if (this.menuOverlay) {
            //     this.menuOverlay.addEventListener('click', () => {
            //         if (!this.aboutModal.classList.contains('hidden')) {
            //             this.aboutModal.classList.add('hidden');
            //         }
            //     });
            // }

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !this.aboutModal.classList.contains('hidden')) {
                    this.aboutModal.classList.add('hidden');
                }
            });
        }
    },

    // UI update methods (moved from app.js)
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
            this.menuRandomModeBtn.innerHTML = `${MESSAGES.get('randomMode')} ${this.app.randomMode ? MESSAGES.get('onText') : MESSAGES.get('offText')}`; // Use this.app.randomMode
        }
        if (this.aboutBtn) {
            this.aboutBtn.innerHTML = `${MESSAGES.get('aboutButton')}`;
        }

        // Update sorting completion modal text if visible
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

        // Update explanation buttons within the words container
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

        // This part needs access to app.sortingModule, which is in app.js.
        // We need to pass app.sortingModule or the relevant data to ui.js
        // For now, I'll assume app.sortingModule is accessible via this.app
        const presentedWords = gameManager.sortingModule.words;
        const wordsToExplain = moduleData.data.filter(item => presentedWords.includes(item.word));

        const categoryMap = new Map();
        gameManager.sortingModule.categories.forEach(cat => {
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

    updateFlashcardSummaryText(totalCards) {
        const flashcardSummaryTitle = document.getElementById('flashcard-summary-title');
        const flashcardSummaryMessage = document.getElementById('flashcard-summary-message');
        const flashcardSummaryBackToMenuBtn = document.getElementById('flashcard-summary-back-to-menu-btn');

        if (flashcardSummaryTitle) {
            flashcardSummaryTitle.textContent = MESSAGES.get('sessionScore');
        }
        if (flashcardSummaryMessage) {
            flashcardSummaryMessage.textContent = MESSAGES.get('flashcardSummaryMessage').replace('{count}', totalCards);
        }
        if (flashcardSummaryBackToMenuBtn) {
            flashcardSummaryBackToMenuBtn.textContent = MESSAGES.get('backToMenu');
        }
    },

    showFlashcardSummary(totalCards) {
        const appContainer = document.getElementById('app-container');
        appContainer.classList.remove('main-menu-active');

        if (!document.getElementById('flashcard-summary-container')) {
            appContainer.innerHTML = `
                <div id="flashcard-summary-container" class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 id="flashcard-summary-title" class="text-2xl font-bold mb-4"></h1>
                    <p id="flashcard-summary-message" class="text-xl mb-4"></p>
                    <button id="flashcard-summary-back-to-menu-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out" onclick="app.renderMenu()"></button>
                </div>
            `;
        }
        this.updateFlashcardSummaryText(totalCards);
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
                gameManager.startModule(this.app.currentModule.id);
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

    updateFlashcardSummaryText(totalCards) {
        const flashcardSummaryTitle = document.getElementById('flashcard-summary-title');
        const flashcardSummaryMessage = document.getElementById('flashcard-summary-message');
        const flashcardSummaryBackToMenuBtn = document.getElementById('flashcard-summary-back-to-menu-btn');

        if (flashcardSummaryTitle) {
            flashcardSummaryTitle.textContent = MESSAGES.get('sessionScore');
        }
        if (flashcardSummaryMessage) {
            flashcardSummaryMessage.textContent = MESSAGES.get('flashcardSummaryMessage').replace('{count}', totalCards);
        }
        if (flashcardSummaryBackToMenuBtn) {
            flashcardSummaryBackToMenuBtn.textContent = MESSAGES.get('backToMenu');
        }
    },

    showFlashcardSummary(totalCards) {
        const appContainer = document.getElementById('app-container');
        appContainer.classList.remove('main-menu-active');

        if (!document.getElementById('flashcard-summary-container')) {
            appContainer.innerHTML = `
                <div id="flashcard-summary-container" class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 id="flashcard-summary-title" class="text-2xl font-bold mb-4"></h1>
                    <p id="flashcard-summary-message" class="text-xl mb-4"></p>
                    <button id="flashcard-summary-back-to-menu-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out" onclick="app.renderMenu()"></button>
                </div>
            `;
        }
        this.updateFlashcardSummaryText(totalCards);
    },

    updateMatchingSummaryText(matchedPairs, moduleData) {
        const modal = document.getElementById('matching-completion-modal');
        if (!modal) return; // If modal doesn't exist, nothing to update

        modal.querySelector('#matching-completion-title').textContent = MESSAGES.get('sessionScore');
        modal.querySelector('#matching-completion-message').textContent = MESSAGES.get('matchingCompletionMessage');
        modal.querySelector('#matching-completion-replay-btn').textContent = MESSAGES.get('replayButton');
        modal.querySelector('#matching-completion-back-to-menu-btn').textContent = MESSAGES.get('backToMenu');
        modal.querySelector('.grid.grid-cols-2.gap-2.font-bold.border-b-2.border-gray-300.pb-2.mb-2 > span:first-child').textContent = MESSAGES.get('terms');
        modal.querySelector('.grid.grid-cols-2.gap-2.font-bold.border-b-2.border-gray-300.pb-2.mb-2 > span:last-child').textContent = MESSAGES.get('translationLabel');

        // Update explanation buttons within the matched pairs grid
        const matchedPairsGrid = document.getElementById('matched-pairs-grid');
        if (matchedPairsGrid) {
            matchedPairsGrid.querySelectorAll('.explanation-btn').forEach(button => {
                button.title = MESSAGES.get('showExplanation');
                button.ariaLabel = MESSAGES.get('showExplanation');
            });
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
                gameManager.startModule(this.app.currentModule.id);
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
};