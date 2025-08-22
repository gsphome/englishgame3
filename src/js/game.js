import FlashcardModule from './modules/FlashcardModule.js';
import QuizModule from './modules/QuizModule.js';
import CompletionModule from './modules/CompletionModule.js';
import SortingModule from './modules/SortingModule.js';
import MatchingModule from './modules/MatchingModule.js';
import { auth } from './auth.js';
import { MESSAGES } from './interface.js';

import { shuffleArray, getGameModeIconSvg, toggleModal, showExplanationModal, toggleHamburgerMenu, updateSessionScoreDisplay, updateFooterVisibility, renderHeader as renderHeaderUtil } from './utils.js';
import { fetchModuleData, fetchAllLearningModules } from './dataManager.js';

export const game = {
    shuffleArray: shuffleArray, // Make shuffleArray accessible via game object

    modal: null,
    menuScrollPosition: 0,
    yesButton: null,
    noButton: null,
    messageElement: null,
    currentView: null, // To keep track of the current active view (e.g., 'menu', 'flashcard', 'quiz')
    currentModule: null, // To keep track of the current module data
    randomMode: true, // New property for random mode
    startX: 0,
    startY: 0,
    flashcardModule: null,

    toggleModal(show) {
        toggleModal(this.modal, show);
        if (show) {
            this.messageElement.textContent = MESSAGES.get('confirmLogoutMessage');
        }
    },

    async init() {
        this.modal = document.getElementById('confirmation-modal');
        auth.init();
        this.allLearningModules = await fetchAllLearningModules();
        const gameCallbacks = {
            renderMenu: this.renderMenu.bind(this),
            showFlashcardSummary: this.showFlashcardSummary.bind(this),
            updateSessionScoreDisplay: updateSessionScoreDisplay, // Directly use the imported function
            randomMode: this.randomMode,
            shuffleArray: this.shuffleArray,
            showSortingCompletionModal: this.showSortingCompletionModal.bind(this),
            showMatchingSummary: this.showMatchingSummary.bind(this),
            renderHeader: this.renderHeader.bind(this),
            toggleHamburgerMenu: toggleHamburgerMenu, // Add toggleHamburgerMenu from utils.js
        };

        this.flashcardModule = new FlashcardModule(auth, MESSAGES, gameCallbacks);
        this.quizModule = new QuizModule(auth, MESSAGES, gameCallbacks);
        this.completionModule = new CompletionModule(auth, MESSAGES, gameCallbacks);
        this.sortingModule = new SortingModule(auth, MESSAGES, gameCallbacks);
        this.matchingModule = new MatchingModule(auth, MESSAGES, gameCallbacks);
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
        const savedRandomMode = localStorage.getItem('randomMode');
        this.randomMode = savedRandomMode === 'true'; // Explicitly check for 'true' string

        // Dark Mode Initialization
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'enabled') {
            document.body.classList.add('dark-mode');
        }

        this.yesButton.addEventListener('click', () => {
            auth.logout();
            toggleModal(this.modal, false); // Use imported toggleModal
        });

        this.noButton.addEventListener('click', () => {
            toggleModal(this.modal, false); // Use imported toggleModal
        });

        this.closeMenuBtn.addEventListener('click', () => toggleHamburgerMenu(false)); // Use imported toggleHamburgerMenu
        this.menuOverlay.addEventListener('click', () => toggleHamburgerMenu(false)); // Use imported toggleHamburgerMenu

        this.menuLangToggleBtn.addEventListener('click', () => {
            const newLang = MESSAGES.getLanguage() === 'en' ? 'es' : 'en';
            MESSAGES.setLanguage(newLang);
            localStorage.setItem('appLang', newLang);
            this.updateMenuText(); // This is a method of game, so keep this.
            if (this.currentView === 'menu') { // Only re-render menu if currently on main menu
                this.renderMenu();
            }
            updateFooterVisibility(this.currentView, MESSAGES); // Use imported updateFooterVisibility
        });

        this.menuLogoutBtn.addEventListener('click', () => {
            toggleHamburgerMenu(false); // Use imported toggleHamburgerMenu
            game.showLogoutConfirmation();
        });

        this.menuRandomModeBtn.addEventListener('click', () => {
            this.randomMode = !this.randomMode;
            localStorage.setItem('randomMode', this.randomMode);
            this.updateMenuText(); // This is a method of game, so keep this.
        });

        if (this.menuDarkModeToggleBtn) {
            this.menuDarkModeToggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    localStorage.setItem('darkMode', 'disabled');
                }
                this.updateMenuText(); // This is a method of game, so keep this.
            });
        }

        // Sorting Completion Modal Listeners
        this.sortingCompletionModal = document.getElementById('sorting-completion-modal');
        this.sortingCompletionReplayBtn = document.getElementById('sorting-completion-replay-btn');
        this.sortingCompletionBackToMenuBtn = document.getElementById('sorting-completion-back-to-menu-btn');

        if (this.sortingCompletionReplayBtn) {
            this.sortingCompletionReplayBtn.addEventListener('click', () => {
                this.sortingCompletionModal.classList.add('hidden');
                this.renderSorting(this.currentModule); // This is a method of game, so keep this.
            });
        }

        if (this.sortingCompletionBackToMenuBtn) {
            this.sortingCompletionBackToMenuBtn.addEventListener('click', () => {
                this.sortingCompletionModal.classList.add('hidden');
                this.renderMenu(); // This is a method of game, so keep this.
            });
        }

        // Explanation Modal Listeners
        this.explanationModal = document.getElementById('explanation-modal');
        this.closeExplanationModalBtn = document.getElementById('close-explanation-modal-btn');

        if (this.closeExplanationModalBtn) {
            this.closeExplanationModalBtn.addEventListener('click', () => {
                this.explanationModal.classList.add('hidden');
            });
        }

        MESSAGES.addListener(this.renderHeader.bind(this)); // Use imported updateHeaderText
        MESSAGES.addListener(this.updateMenuText.bind(this)); // This is a method of game, so keep this.
        this.updateMenuText(); // This is a method of game, so keep this.

        // Initial user check and rendering
        auth.user = JSON.parse(localStorage.getItem('user')); // Initialize auth.user
        this.renderHeader(); // Use imported renderHeader
        if (!auth.user) {
            auth.renderLogin();
        } else {
            this.renderMenu(); // This is a method of game, so keep this.
        }
    },

    showExplanationModal(wordData) {
        showExplanationModal(this.explanationModal, wordData); // Use imported showExplanationModal
    },

    renderHeader() {
        const user = auth.getUser();
        const scoreContainer = document.getElementById('score-container');
        const usernameDisplay = document.getElementById('username-display');
        const hamburgerBtn = document.getElementById('hamburger-btn');
    
        if (user) {
            scoreContainer.classList.remove('hidden');
            usernameDisplay.classList.remove('hidden');
            hamburgerBtn.classList.remove('hidden'); // Ensure hamburger button is visible if user is logged in
            hamburgerBtn.addEventListener('click', () => toggleHamburgerMenu(true));
            renderHeaderUtil(auth, MESSAGES, toggleHamburgerMenu);
        } else {
            scoreContainer.classList.add('hidden');
            usernameDisplay.classList.add('hidden');
            hamburgerBtn.classList.add('hidden'); // Hide hamburger button if no user
        }
    },

    updateFooterVisibility() { // This is a method of game, so keep this.
        updateFooterVisibility(this.currentView, MESSAGES); // Use imported updateFooterVisibility
    },

    updateMenuText() { // This is a method of game, so keep this.
        if (this.menuLangToggleBtn) {
            const currentLang = MESSAGES.getLanguage();
            this.menuLangToggleBtn.innerHTML = currentLang === 'en' ? 'Lenguaje 🇪🇸' : 'Language 🇬🇧';
        }
        if (this.menuLogoutBtn) {
            this.menuLogoutBtn.innerHTML = `${MESSAGES.get('logoutButton')} 🚪`;
        }
        if (this.menuDarkModeToggleBtn) {
            const isDarkMode = document.body.classList.contains('dark-mode');
            this.menuDarkModeToggleBtn.innerHTML = isDarkMode ? `${MESSAGES.get('lightMode')} ☀️` : `${MESSAGES.get('darkMode')} 🌙`;
        }
        if (this.menuRandomModeBtn) {
            this.menuRandomModeBtn.innerHTML = `${MESSAGES.get('randomMode')} ${this.randomMode ? 'ON' : 'OFF'}`;
        }

        // Update sorting completion modal text if visible
        const sortingCompletionModal = document.getElementById('sorting-completion-modal');
        if (sortingCompletionModal && !sortingCompletionModal.classList.contains('hidden')) {
            document.getElementById('sorting-completion-title').textContent = MESSAGES.get('sortingCompletionTitle');
            document.getElementById('sorting-completion-message').textContent = MESSAGES.get('sortingCompletionMessage');
            document.getElementById('sorting-completion-replay-btn').textContent = MESSAGES.get('replayButton');
            document.getElementById('sorting-completion-back-to-menu-btn').textContent = MESSAGES.get('backToMenu');
        }
    },

    renderCurrentView() { // This is a method of game, so keep this.
        switch (this.currentView) {
            case 'menu':
                document.body.classList.remove('module-active');
                this.renderMenu();
                break;
            case 'flashcard':
                this.renderFlashcard(this.currentModule);
                break;
            case 'quiz':
                this.renderQuiz(this.currentModule);
                break;
            case 'completion':
                this.renderCompletion(this.currentModule);
                break;
            case 'sorting':
                this.renderSorting(this.currentModule);
                break;
            case 'matching': // Added matching case
                this.renderMatching(this.currentModule);
                break;
        }
    },

    renderFlashcard(module) { // This is a method of game, so keep this.
        this.currentView = 'flashcard';
        document.body.classList.add('module-active');
        document.getElementById('app-container').classList.remove('main-menu-active');
        // Clear app-container before rendering flashcard module
        document.getElementById('app-container').innerHTML = '';
        this.flashcardModule.init(module);
        updateFooterVisibility(this.currentView, MESSAGES); // Use imported updateFooterVisibility
    },

    renderMenu() { // This is a method of game, so keep this.
        this.removeCurrentModuleKeyboardListeners(); // Remove listeners from previous module
        document.body.classList.remove('module-active');
        this.currentView = 'menu';
        const sessionScoreDisplay = document.getElementById('session-score-display');
        if (sessionScoreDisplay) {
            sessionScoreDisplay.classList.add('hidden');
        }
        const appContainer = document.getElementById('app-container');

        // Get the template content
        const template = document.getElementById('main-menu-template');
        const menuContent = template.content.cloneNode(true);

        // Set the main menu title
        menuContent.getElementById('main-menu-title').textContent = MESSAGES.get('mainMenu');

        const moduleButtonsContainer = menuContent.getElementById('module-buttons-container');
        const colors = ['bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-teal-600', 'bg-cyan-600', 'bg-emerald-600'];

        this.allLearningModules.forEach((module, index) => {
            const colorClass = colors[index % colors.length];
            const icon = module.icon || '📚'; // Placeholder icon
            const description = module.description || ''; // Placeholder description

            const buttonTemplate = document.getElementById('module-button-template');
            const button = buttonTemplate.content.cloneNode(true).querySelector('button');

            button.classList.add(colorClass); // Add the dynamic color class
            button.dataset.moduleId = module.id;

            // Only add letter for modules A-Z
            if (index <= 25) { // ASCII for 'A' is 65, 'Z' is 90. 65 + 25 = 90
                button.querySelector('[data-module-index]').textContent = `${String.fromCharCode(65 + index)}.`;
            } else {
                // If index is beyond 'Z', do not add a letter.
                // The button will still be generated but without a letter prefix.
            }
            button.querySelector('[data-module-name]').textContent = module.name.replace('Flashcard: ', '').replace('Quiz: ', '').replace('Completion: ', '');
            button.querySelector('[data-game-mode-icon]').innerHTML = getGameModeIconSvg(module.gameMode);

            moduleButtonsContainer.appendChild(button);
        });

        appContainer.innerHTML = ''; // Clear existing content
        appContainer.appendChild(menuContent); // Append the new content
        appContainer.classList.add('main-menu-active');

        // Show hamburger menu when main menu is rendered
        if (this.hamburgerMenu) {
            this.hamburgerMenu.classList.remove('hidden');
        }

        // Restore scroll position
        const scrollWrapper = document.getElementById('main-menu-scroll-wrapper');
        if (scrollWrapper) {
            scrollWrapper.scrollTop = this.menuScrollPosition;
        }

        document.querySelectorAll('[data-module-id]').forEach(button => {
            // All buttons should be clickable via mouse, regardless of whether they have a letter.
            button.addEventListener('click', () => {
                // Save scroll position before navigating away
                const currentScrollWrapper = document.getElementById('main-menu-scroll-wrapper');
                if (currentScrollWrapper) {
                    this.menuScrollPosition = currentScrollWrapper.scrollTop;
                }
                const moduleId = button.dataset.moduleId;
                this.startModule(moduleId);
            });
        });
        updateFooterVisibility(this.currentView, MESSAGES); // Use imported updateFooterVisibility
    },

    getMenuMaxWidth() { // This is a method of game, so keep this.
        const width = window.innerWidth;
        if (this.isMobile()) { // Use this.isMobile()
            return '300px'; // Ancho para móviles
        }
        // Si el ancho es para 4 columnas (entre 768px y 1024px)
        if (width >= 768 && width < 1024) {
            return '582px'; // Usamos el ancho calculado para 4 columnas
        }
        // Para 5 columnas (1024px en adelante) o cualquier otro caso
        return '760px'; // Usamos el ancho original
    },

    async startModule(moduleId) { // This is a method of game, so keep this.
        this.removeCurrentModuleKeyboardListeners(); // Remove listeners from previous module
        const moduleMeta = this.allLearningModules.find(m => m.id === moduleId);
        if (!moduleMeta) return;

        try {
            const moduleWithData = await fetchModuleData(moduleId);
            if (!moduleWithData) {
                console.error(`Failed to load data for module ${moduleId}`);
                return;
            }

            this.currentModule = moduleWithData;
            switch (moduleWithData.gameMode) {
                case 'flashcard':
                    this.renderFlashcard(moduleWithData);
                    break;
                case 'quiz':
                    this.renderQuiz(moduleWithData);
                    break;
                case 'completion':
                    this.renderCompletion(moduleWithData);
                    break;
                case 'sorting':
                    this.renderSorting(moduleWithData);
                    break;
                case 'matching':
                    this.renderMatching(moduleWithData);
                    break;
            }
        } catch (error) {
            console.error('Failed to load module data:', error);
        }
    },

    addKeyboardListeners() { // This is a method of game, so keep this.
        const modal = this.modal;
        const yesButton = this.yesButton;
        const noButton = this.noButton;

        yesButton.addEventListener('click', () => {
            auth.logout();
            toggleModal(this.modal, false); // Use imported toggleModal
        });

        noButton.addEventListener('click', () => {
            toggleModal(this.modal, false); // Use imported toggleModal
        });

        document.addEventListener('keydown', (e) => {
            // 1. Handle explanation modal (highest priority)
            const explanationModal = document.getElementById('explanation-modal');
            if (explanationModal && !explanationModal.classList.contains('hidden')) {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    document.getElementById('close-explanation-modal-btn').click();
                }
                return; // Consume event if modal is handled
            }

            // 2. Handle sorting completion modal (next priority)
            const sortingCompletionModal = document.getElementById('sorting-completion-modal');
            if (sortingCompletionModal && !sortingCompletionModal.classList.contains('hidden')) {
                if (e.key === 'Enter') {
                    document.getElementById('sorting-completion-replay-btn').click();
                } else if (e.key === 'Escape') {
                    document.getElementById('sorting-completion-back-to-menu-btn').click();
                }
                return; // Consume event if modal is handled
            }

            // 3. Handle general modals (logout confirmation)
            if (!modal.classList.contains('hidden')) { // If logout modal is open
                if (e.key === 'Enter') {
                    yesButton.click();
                } else if (e.key === 'Escape') {
                    toggleModal(this.modal, false); // Use imported toggleModal
                }
                return; // Consume event if modal is handled
            }

            // 4. Handle hamburger menu
            if (document.body.classList.contains('hamburger-menu-open')) { // If hamburger menu is open
                if (e.key === 'Escape') {
                    toggleHamburgerMenu(false); // Use imported toggleHamburgerMenu
                }
                return; // Consume event if menu is handled
            }

            // 5. Handle game-specific escape behavior (lowest priority)
            if (e.key === 'Escape') {
                if (this.currentView === 'sorting') { // If sorting is active, go back to menu
                    this.renderMenu(); // This is a method of game, so keep this.
                } else if (document.getElementById('app-container').classList.contains('main-menu-active')) {
                    toggleModal(this.modal, true); // Use imported toggleModal
                } else {
                    this.renderMenu(); // This is a method of game, so keep this.
                }
            } else if (e.key === '.') {
                const newLang = MESSAGES.getLanguage() === 'en' ? 'es' : 'en';
                MESSAGES.setLanguage(newLang);
                localStorage.setItem('appLang', newLang);
                this.renderCurrentView(); // This is a method of game, so keep this.
                this.updateMenuText(); // This is a method of game, so keep this.
            } else if (this.currentView === 'menu') { // Check if main menu is active
                const pressedKey = e.key.toUpperCase();
                const moduleButtons = document.querySelectorAll('[data-module-id]');
                moduleButtons.forEach((button, index) => {
                    if (String.fromCharCode(65 + index) === pressedKey) {
                        button.click();
                    }
                });
            } else if (this.currentView === 'flashcard') {
                this.flashcardModule.addKeyboardListeners();
            } else if (this.currentView === 'quiz') {
                this.quizModule.addKeyboardListeners();
            } else if (this.currentView === 'completion') {
                this.completionModule.addKeyboardListeners();
            } else if (this.currentView === 'matching') {
                this.matchingModule.addKeyboardListeners();
            } else if (this.currentView === 'sorting') {
                this.sortingModule.addKeyboardListeners();
            }
        });
    },

    showSortingCompletionModal(moduleData) { // This is a method of game, so keep this.
        const modal = this.sortingCompletionModal;
        const title = document.getElementById('sorting-completion-title');
        const message = document.getElementById('sorting-completion-message');
        const replayBtn = document.getElementById('sorting-completion-replay-btn');
        const backToMenuBtn = document.getElementById('sorting-completion-back-to-menu-btn');
        const wordsContainer = document.createElement('div');
        wordsContainer.id = 'sorting-completion-words-container';
        wordsContainer.className = 'mt-4 mb-4 text-left pr-4';

        title.textContent = MESSAGES.get('sortingCompletionTitle');
        message.textContent = MESSAGES.get('sortingCompletionMessage');
        replayBtn.textContent = MESSAGES.get('replayButton');
        backToMenuBtn.textContent = MESSAGES.get('backToMenu');

        // Clear previous words if any
        const existingWordsContainer = modal.querySelector('#sorting-completion-words-container');
        if (existingWordsContainer) {
            existingWordsContainer.remove();
        }

        // Add words to the modal
        const presentedWords = this.sortingModule.words; // Get the words actually presented in the game
        const wordsToExplain = moduleData.data.filter(item => presentedWords.includes(item.word));

        // Create a map for category lookup
        const categoryMap = new Map();
        this.sortingModule.categories.forEach(cat => {
            categoryMap.set(cat.category_id, cat.category_show);
        });

        wordsToExplain.forEach(item => {
            const wordItem = document.createElement('div');
            wordItem.className = 'sorting-summary-item-grid py-2 border-b border-gray-200 items-center';
            const categoryDisplayName = categoryMap.get(item.category) || 'N/A'; // Get display name, fallback to N/A
            wordItem.innerHTML = `
                <span class="text-sm text-gray-500 font-medium">${categoryDisplayName}</span>
                <span class="text-lg font-semibold">${item.word}</span>
                <span class="text-base text-gray-700 italic">${item.translation_es}</span>
                <button title="${MESSAGES.get('showExplanation')}" aria-label="${MESSAGES.get('showExplanation')}" class="explanation-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out text-sm justify-self-center mr-1">
                    &#x2139;
                </button>
            `;
            wordItem.querySelector('.explanation-btn').addEventListener('click', () => {
                showExplanationModal(this.explanationModal, item); // Use imported showExplanationModal
            });
            wordsContainer.appendChild(wordItem);
        });

        // Insert words container before the buttons
        modal.querySelector('.flex.justify-center.space-x-4').before(wordsContainer);

        modal.classList.remove('hidden');
    },

    showFlashcardSummary(totalCards) { // This is a method of game, so keep this.
        const appContainer = document.getElementById('app-container');
        appContainer.classList.remove('main-menu-active');

        if (!document.getElementById('flashcard-summary-container')) {
            appContainer.innerHTML = `
                <div id="flashcard-summary-container" class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 id="flashcard-summary-title" class="text-2xl font-bold mb-4">${MESSAGES.get('sessionScore')}</h1>
                    <p id="flashcard-summary-message" class="text-xl mb-4">${MESSAGES.get('flashcardSummaryMessage').replace('{count}', totalCards)}</p>
                    <button id="flashcard-summary-back-to-menu-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out" onclick="game.renderMenu()">${MESSAGES.get('backToMenu')}</button>
                </div>
            `;
        } else {
            document.getElementById('flashcard-summary-title').textContent = MESSAGES.get('sessionScore');
            document.getElementById('flashcard-summary-message').textContent = MESSAGES.get('flashcardSummaryMessage').replace('{count}', totalCards);
            document.getElementById('flashcard-summary-back-to-menu-btn').textContent = MESSAGES.get('backToMenu');
        }
    },

    showMatchingSummary() { // This is a method of game, so keep this.
        const appContainer = document.getElementById('app-container');
        appContainer.classList.remove('main-menu-active');

        let modal = document.getElementById('matching-completion-modal');
        if (!modal) {
            modal = document.createElement('div');
            
            modal.id = 'matching-completion-modal';
            modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 hidden';
            modal.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-xl w-full text-center">
                    <h2 id="matching-completion-title" class="text-2xl font-bold mb-4">${MESSAGES.get('sessionScore')}</h2>
                    <p id="matching-completion-message" class="text-xl mb-4">${MESSAGES.get('matchingCompletionMessage')}</p>
                    <div class="mb-4 text-left max-h-60 overflow-y-auto pr-2">
                        <div class="grid grid-cols-2 gap-2 font-bold border-b-2 border-gray-300 pb-2 mb-2">
                            <span>${MESSAGES.get('terms')}</span>
                            <span>${MESSAGES.get('translationLabel')}</span>
                        </div>
                        <div id="matched-pairs-grid" class="grid grid-cols-2 gap-2">
                            <!-- Matched pairs and explanation buttons will be listed here -->
                        </div>
                    </div>
                    <div class="flex justify-center space-x-4">
                        <button id="matching-completion-replay-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out">
                            ${MESSAGES.get('replayButton')}
                        </button>
                        <button id="matching-completion-back-to-menu-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out">
                            ${MESSAGES.get('backToMenu')}
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add event listeners for the new buttons
            document.getElementById('matching-completion-replay-btn').addEventListener('click', () => {
                
                modal.classList.add('hidden');
                game.renderMatching(game.currentModule); // This is a method of game, so keep this.
            });
            document.getElementById('matching-completion-back-to-menu-btn').addEventListener('click', () => {
                
                modal.classList.add('hidden');
                game.renderMenu(); // This is a method of game, so keep this.
            });
        }

        // Update modal content
        // Use modal.querySelector to get elements within the newly created modal
        modal.querySelector('#matching-completion-title').textContent = MESSAGES.get('sessionScore');
        modal.querySelector('#matching-completion-message').textContent = MESSAGES.get('matchingCompletionMessage');
        modal.querySelector('#matching-completion-replay-btn').textContent = MESSAGES.get('replayButton');
        modal.querySelector('#matching-completion-back-to-menu-btn').textContent = MESSAGES.get('backToMenu');

        const matchedPairsGrid = document.getElementById('matched-pairs-grid');
        matchedPairsGrid.innerHTML = ''; // Clear previous pairs

        // Display matched pairs
        game.matchingModule.matchedPairs.forEach(pair => {
            const termData = game.matchingModule.moduleData.data.find(item => item.id === pair.termId);
            if (termData) {
                const termSpan = document.createElement('span');
                termSpan.className = 'font-semibold';
                termSpan.textContent = termData.term;
                matchedPairsGrid.appendChild(termSpan);

                const translationContainer = document.createElement('div');
                translationContainer.className = 'flex items-center justify-between'; // To align translation and button

                const translationSpan = document.createElement('span');
                translationSpan.textContent = termData.term_es; // Use term_es for translation
                translationContainer.appendChild(translationSpan);

                // Add explanation button
                const explanationButton = document.createElement('button');
                explanationButton.className = 'explanation-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-md text-sm justify-self-center mr-1';
                explanationButton.innerHTML = '&#x2139;'; // Info icon
                explanationButton.title = MESSAGES.get('showExplanation');
                explanationButton.ariaLabel = MESSAGES.get('showExplanation');
                explanationButton.addEventListener('click', () => {
                    showExplanationModal({ // Use imported showExplanationModal
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

        modal.classList.remove('hidden'); // Show the modal
    },

    showLogoutConfirmation() { // This is a method of game, so keep this.
        toggleModal(this.modal, true); // Use imported toggleModal
    },

    renderQuiz(module) { // This is a method of game, so keep this.
        this.currentView = 'quiz';
        document.body.classList.add('module-active');
        document.getElementById('app-container').classList.remove('main-menu-active');
        this.quizModule.init(module);
        updateFooterVisibility(this.currentView, MESSAGES); // Use imported updateFooterVisibility
    },

    renderCompletion(module) { // This is a method of game, so keep this.
        this.currentView = 'completion';
        document.body.classList.add('module-active');
        document.getElementById('app-container').classList.remove('main-menu-active');
        this.completionModule.init(module);
        updateFooterVisibility(this.currentView, MESSAGES); // Use imported updateFooterVisibility
    },

    renderSorting(module) { // This is a method of game, so keep this.
        // If we are already in sorting view and the container exists, just update text
        if (this.currentView === 'sorting' && document.getElementById('sorting-container')) {
            this.sortingModule.updateText();
            // No need to re-init or re-add module-active class if already active
            return;
        }
        this.currentView = 'sorting';
        document.body.classList.add('module-active');
        document.getElementById('app-container').classList.remove('main-menu-active');
        this.sortingModule.init(module);
        updateFooterVisibility(this.currentView, MESSAGES); // Use imported updateFooterVisibility
    },

    renderMatching(module) { // This is a method of game, so keep this.
        this.currentView = 'matching';
        document.body.classList.add('module-active');
        document.getElementById('app-container').classList.remove('main-menu-active');
        this.matchingModule.init(module);
        updateFooterVisibility(this.currentView, MESSAGES); // Use imported updateFooterVisibility
    },

    addSwipeListeners() { // This is a method of game, so keep this.
        const appContainer = document.getElementById('app-container');
        const SWIPE_THRESHOLD = 50; // pixels

        appContainer.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        });

        appContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = endX - this.startX;
            const diffY = endY - this.startY;

            // Determine if it's a horizontal or vertical swipe
            if (Math.abs(diffX) > Math.abs(diffY)) { // Horizontal swipe
                if (Math.abs(diffX) > SWIPE_THRESHOLD) {
                    if (diffX > 0) { // Swiped right (prev)
                        if (this.currentView === 'flashcard') {
                            this.flashcardModule.prev();
                        } else if (this.currentView === 'quiz') {
                            this.quizModule.prev();
                        } else if (this.currentView === 'completion') {
                            this.completionModule.prev();
                        }
                    } else { // Swiped left (next)
                        if (this.currentView === 'flashcard') {
                            this.flashcardModule.next();
                        }
                    }
                }
            } else { // Vertical swipe (for flashcard flip)
                if (Math.abs(diffY) > SWIPE_THRESHOLD) {
                    if (this.currentView === 'flashcard') {
                        this.flashcardModule.flip();
                    }
                }
            }
        });
    },

    isMobile() { // Added isMobile function
        return window.innerWidth <= 768; // Example breakpoint for mobile
    },

    removeCurrentModuleKeyboardListeners() {
        switch (this.currentView) {
            case 'flashcard':
                if (this.flashcardModule && typeof this.flashcardModule.removeKeyboardListeners === 'function') {
                    this.flashcardModule.removeKeyboardListeners();
                }
                break;
            case 'quiz':
                if (this.quizModule && typeof this.quizModule.removeKeyboardListeners === 'function') {
                    this.quizModule.removeKeyboardListeners();
                }
                break;
            case 'completion':
                if (this.completionModule && typeof this.completionModule.removeKeyboardListeners === 'function') {
                    this.completionModule.removeKeyboardListeners();
                }
                break;
            case 'sorting':
                if (this.sortingModule && typeof this.sortingModule.removeKeyboardListeners === 'function') {
                    this.sortingModule.removeKeyboardListeners();
                }
                break;
            case 'matching':
                if (this.matchingModule && typeof this.matchingModule.removeKeyboardListeners === 'function') {
                    this.matchingModule.removeKeyboardListeners();
                }
                break;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    game.init();
});

window.game = game;