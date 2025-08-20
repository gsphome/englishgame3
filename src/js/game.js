import FlashcardModule from './modules/FlashcardModule.js';
import QuizModule from './modules/QuizModule.js';
import CompletionModule from './modules/CompletionModule.js';
import SortingModule from './modules/SortingModule.js';
import MatchingModule from './modules/MatchingModule.js';
import { auth } from './auth.js';
import { MESSAGES } from './interface.js';
import { learningModules } from '../assets/data/game-db.js';
import { shuffleArray, getGameModeIconSvg } from './utils.js';

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
        this.modal.classList.toggle('hidden', !show);
        if (show) {
            this.messageElement.textContent = MESSAGES.get('confirmLogoutMessage');
        }
    },

    init() {
        this.modal = document.getElementById('confirmation-modal');
        auth.init();
        this.flashcardModule = new FlashcardModule(this, auth, MESSAGES);
        this.quizModule = new QuizModule(this, auth, MESSAGES);
        this.completionModule = new CompletionModule(this, auth, MESSAGES);
        this.sortingModule = new SortingModule(this, auth, MESSAGES);
        this.matchingModule = new MatchingModule(this, auth, MESSAGES);
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
        this.randomMode = localStorage.getItem('randomMode') !== 'false'; // Initialize from localStorage, default to true

        // Dark Mode Initialization
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'enabled') {
            document.body.classList.add('dark-mode');
        }

        this.yesButton.addEventListener('click', () => {
            auth.logout();
            this.toggleModal(false);
        });

        this.noButton.addEventListener('click', () => {
            this.toggleModal(false);
        });

        this.closeMenuBtn.addEventListener('click', () => this.toggleHamburgerMenu(false));
        this.menuOverlay.addEventListener('click', () => this.toggleHamburgerMenu(false));

        this.menuLangToggleBtn.addEventListener('click', () => {
            const newLang = MESSAGES.getLanguage() === 'en' ? 'es' : 'en';
            MESSAGES.setLanguage(newLang);
            localStorage.setItem('appLang', newLang);
            // Removed this.renderCurrentView() as it causes module to advance
            this.updateMenuText(); // Explicitly call to update menu buttons
        });

        this.menuLogoutBtn.addEventListener('click', () => {
            this.toggleHamburgerMenu(false); // Close menu before showing confirmation
            game.showLogoutConfirmation();
        });

        this.menuRandomModeBtn.addEventListener('click', () => {
            this.randomMode = !this.randomMode;
            localStorage.setItem('randomMode', this.randomMode);
            this.updateMenuText();
        });

        if (this.menuDarkModeToggleBtn) {
            this.menuDarkModeToggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    localStorage.setItem('darkMode', 'disabled');
                }
                this.updateMenuText(); // Update button text and icon
            });
        }

        // Sorting Completion Modal Listeners
        this.sortingCompletionModal = document.getElementById('sorting-completion-modal');
        this.sortingCompletionReplayBtn = document.getElementById('sorting-completion-replay-btn');
        this.sortingCompletionBackToMenuBtn = document.getElementById('sorting-completion-back-to-menu-btn');

        if (this.sortingCompletionReplayBtn) {
            this.sortingCompletionReplayBtn.addEventListener('click', () => {
                this.sortingCompletionModal.classList.add('hidden');
                this.renderSorting(this.currentModule); // Replay the current sorting module
            });
        }

        if (this.sortingCompletionBackToMenuBtn) {
            this.sortingCompletionBackToMenuBtn.addEventListener('click', () => {
                this.sortingCompletionModal.classList.add('hidden');
                this.renderMenu(); // Go back to main menu
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

        MESSAGES.addListener(this.updateHeaderText.bind(this));
        MESSAGES.addListener(this.updateMenuText.bind(this)); // New listener for menu text
        this.updateMenuText(); // Call explicitly to set initial menu button text

        // Initial render will be handled after user check
        MESSAGES.addListener(() => {
            if (!this.modal.classList.contains('hidden')) {
                this.messageElement.textContent = MESSAGES.get('confirmLogoutMessage');
            }

            // Update current game view if active
            if (this.currentView === 'flashcard') {
                this.flashcardModule.updateText();
            } else if (this.currentView === 'quiz') {
                this.quizModule.updateText();
            } else if (this.currentView === 'completion') {
                this.completionModule.updateText();
            } else if (this.currentView === 'sorting') {
                this.sortingModule.updateText();
            } else if (this.currentView === 'matching') {
                this.matchingModule.updateText();
            }

            // Re-render summary screens if active
            const flashcardSummaryContainer = document.getElementById('flashcard-summary-container');
            const quizSummaryContainer = document.getElementById('quiz-summary-container');
            const completionSummaryContainer = document.getElementById('completion-summary-container');
            const matchingSummaryContainer = document.getElementById('matching-summary-container');

            if (flashcardSummaryContainer && !flashcardSummaryContainer.classList.contains('hidden')) {
                // Re-render flashcard summary with current data
                this.showFlashcardSummary(this.flashcardModule.moduleData.data.length); // Assuming moduleData is still available
            } else if (quizSummaryContainer && !quizSummaryContainer.classList.contains('hidden')) {
                // Re-render quiz summary with current data
                this.quizModule.showFinalScore(); // This function re-renders the summary
            } else if (completionSummaryContainer && !completionSummaryContainer.classList.contains('hidden')) {
                // Re-render completion summary with current data
                this.completionModule.showFinalScore(); // This function re-renders the summary
            } else if (matchingSummaryContainer && !matchingSummaryContainer.classList.contains('hidden')) {
                // Re-render matching summary with current data
                this.showMatchingSummary();
            }
            // Update matching completion modal text if visible
            const matchingCompletionModal = document.getElementById('matching-completion-modal');
            if (matchingCompletionModal && !matchingCompletionModal.classList.contains('hidden')) {
                document.getElementById('matching-completion-title').textContent = MESSAGES.get('sessionScore');
                document.getElementById('matching-completion-message').textContent = MESSAGES.get('matchingCompletionMessage');
                document.getElementById('matching-completion-replay-btn').textContent = MESSAGES.get('replayButton');
                document.getElementById('matching-completion-back-to-menu-btn').textContent = MESSAGES.get('backToMenu');
            }
        });

        this.addKeyboardListeners();
        this.addSwipeListeners();

        // Initial user check and rendering
        auth.user = JSON.parse(localStorage.getItem('user')); // Initialize auth.user
        this.renderHeader(); // Always render header
        if (!auth.user) {
            auth.renderLogin();
        } else {
            this.renderMenu(); // Render main menu for logged-in user
        }
    },

    showExplanationModal(wordData) {
        const modal = this.explanationModal;
        document.getElementById('explanation-word').textContent = wordData.word;
        document.getElementById('explanation-word-translation').textContent = wordData.translation_es;
        document.getElementById('explanation-example-en').textContent = `"${wordData.example}"`;
        document.getElementById('explanation-example-es').textContent = `"${wordData.example_es}"`;
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
    },

    updateMenuText() {
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
                <span class="text-sm font-semibold">Session:</span>
                <span class="ml-1 ${correctColor} font-bold">✅ ${correct}</span>
                <span class="ml-1 ${incorrectColor} font-bold">❌ ${incorrect}</span>
                <span class="ml-1 ${totalColor} font-bold">Total: ${total}</span>
            `;
            sessionScoreDisplay.classList.remove('hidden');
        }
    },

    updateHeaderText() {
        const user = auth.getUser();
        if (!user) return;

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
            usernameDisplayEl.innerHTML = `<span class="text-lg font-bold">👤 ${user.username}</span>`;
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
            hamburgerBtn.classList.remove('hidden'); // Ensure hamburger button is visible if user is logged in
            hamburgerBtn.addEventListener('click', () => this.toggleHamburgerMenu(true));
            this.updateHeaderText();
        } else {
            scoreContainer.classList.add('hidden');
            usernameDisplay.classList.add('hidden');
            hamburgerBtn.classList.add('hidden'); // Hide hamburger button if no user
        }
    },

    renderCurrentView() {

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
        }
    },

    updateFooterVisibility() {
        const footer = document.getElementById('main-footer-copyright');
        const footerWebText = document.getElementById('footer-web-text');
        const footerMobileText = document.getElementById('footer-mobile-text');

        if (footer && footerWebText && footerMobileText) {
            if (this.currentView === 'menu') {
                footer.style.display = 'block';
                footerWebText.textContent = MESSAGES.get('footerWeb');
                footerMobileText.textContent = MESSAGES.get('footerMobile');
            } else {
                footer.style.display = 'none';
            }
        }
    },

    

    renderFlashcard(module) {
        this.currentView = 'flashcard';
        document.body.classList.add('module-active');
        this.flashcardModule.init(module);
        this.updateFooterVisibility();
    },

    renderMenu() {
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

        learningModules.forEach((module, index) => {
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
        this.updateFooterVisibility();
    },

    getMenuMaxWidth() {
        const width = window.innerWidth;
        if (game.isMobile()) {
            return '300px'; // Ancho para móviles
        }
        // Si el ancho es para 4 columnas (entre 768px y 1024px)
        if (width >= 768 && width < 1024) {
            return '582px'; // Usamos el ancho calculado para 4 columnas
        }
        // Para 5 columnas (1024px en adelante) o cualquier otro caso
        return '760px'; // Usamos el ancho original
    },

    async startModule(moduleId) {
        const moduleMeta = learningModules.find(m => m.id === moduleId);
        if (!moduleMeta) return;

        try {
            const response = await fetch(moduleMeta.dataPath);
            const fetchedData = await response.json();

            const moduleWithData = Array.isArray(fetchedData)
                ? { ...moduleMeta, data: fetchedData }
                : { ...moduleMeta, ...fetchedData };

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

    addKeyboardListeners() {
        const modal = this.modal;
        const yesButton = this.yesButton;
        const noButton = this.noButton;

        yesButton.addEventListener('click', () => {
            auth.logout();
            this.toggleModal(false);
        });

        noButton.addEventListener('click', () => {
            this.toggleModal(false);
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
                    this.toggleModal(false); // Close modal on Escape
                }
                return; // Consume event if modal is handled
            }

            // 4. Handle hamburger menu
            if (document.body.classList.contains('hamburger-menu-open')) { // If hamburger menu is open
                if (e.key === 'Escape') {
                    this.toggleHamburgerMenu(false); // Close hamburger menu on Escape
                }
                return; // Consume event if menu is handled
            }

            // 5. Handle game-specific escape behavior (lowest priority)
            if (e.key === 'Escape') {
                if (this.currentView === 'sorting') { // If sorting is active, go back to menu
                    this.renderMenu();
                } else if (document.getElementById('app-container').classList.contains('main-menu-active')) {
                    this.toggleModal(true); // Show logout modal if in main menu
                } else {
                    this.renderMenu(); // Go back to main menu from other games
                }
            } else if (e.key === '.') {
                const newLang = MESSAGES.getLanguage() === 'en' ? 'es' : 'en';
                MESSAGES.setLanguage(newLang);
                localStorage.setItem('appLang', newLang);
                this.renderCurrentView();
                this.updateMenuText();
            } else if (this.currentView === 'menu') { // Check if main menu is active
                const pressedKey = e.key.toUpperCase();
                const moduleButtons = document.querySelectorAll('[data-module-id]');
                moduleButtons.forEach((button, index) => {
                    if (String.fromCharCode(65 + index) === pressedKey) {
                        button.click();
                    }
                });
            } else if (this.currentView === 'flashcard') { // If flashcard is active
                const flashcardSummaryContainer = document.getElementById('flashcard-summary-container');
                if (flashcardSummaryContainer && e.key === 'Enter') {
                    document.getElementById('flashcard-summary-back-to-menu-btn').click();
                    return; // Exit early if summary handled
                }

                if (e.key === 'Enter') {
                    const card = document.querySelector('.flashcard');
                    if (card) {
                        if (card.classList.contains('flipped')) {
                            card.classList.remove('flipped'); // Unflip the card
                            setTimeout(() => {
                                if (this.flashcardModule.currentIndex === this.flashcardModule.moduleData.data.length - 1) {
                                    game.showFlashcardSummary(this.flashcardModule.moduleData.data.length);
                                } else {
                                    this.flashcardModule.next();
                                }
                            }, 150); // Small delay to allow unflip animation
                        } else {
                            this.flashcardModule.flip();
                        }
                    }
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    this.flashcardModule.prev();
                }
            } else if (this.currentView === 'quiz') { // If quiz is active
                const quizSummaryContainer = document.getElementById('quiz-summary-container');
                if (quizSummaryContainer && e.key === 'Enter') {
                    game.renderMenu(); // Go back to menu from summary
                    return; // Exit early if summary handled
                }

                const feedbackContainer = document.getElementById('feedback-container');
                const optionsDisabled = document.querySelectorAll('[data-option][disabled]').length > 0;

                if (e.key === 'Enter' && optionsDisabled) {
                    this.quizModule.next();
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    this.quizModule.prev();
                } else {
                    const pressedKey = e.key.toUpperCase();
                    const optionLetters = ['A', 'B', 'C', 'D'];
                    const optionIndex = optionLetters.indexOf(pressedKey);
                    if (optionIndex !== -1) {
                        const options = document.querySelectorAll('[data-option]');
                        if (options[optionIndex]) {
                            options[optionIndex].click();
                        }
                    }
                }
            } else if (this.currentView === 'completion') { // If completion is active
                const completionSummaryContainer = document.getElementById('completion-summary-container');
                if (completionSummaryContainer && e.key === 'Enter') {
                    document.querySelector('#completion-summary-container button').click(); // Click the back to menu button
                    return; // Exit early if summary handled
                }

                if (e.key === 'Enter') {
                    this.completionModule.handleNextAction();
                } else if (e.key === 'Backspace') {
                    const inputElement = document.getElementById('completion-input');
                    if (inputElement && document.activeElement === inputElement) {
                        // Allow default backspace behavior for input field
                        return;
                    }
                    e.preventDefault();
                    this.completionModule.prev();
                }
            } else if (this.currentView === 'matching') { // If matching is active
                const matchingCompletionModal = document.getElementById('matching-completion-modal');
                if (matchingCompletionModal && !matchingCompletionModal.classList.contains('hidden')) {
                    if (e.key === 'Enter') {
                        document.getElementById('matching-completion-replay-btn').click();
                    } else if (e.key === 'Escape') {
                        document.getElementById('matching-completion-back-to-menu-btn').click();
                    }
                    return; // Consume event if modal is handled
                }
            } else if (this.currentView === 'sorting') { // If sorting is active
                if (e.key === 'Enter') {
                    this.sortingModule.checkAnswers();
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    this.sortingModule.undo();
                }
            }
        });
    },

    showSortingCompletionModal(moduleData) {
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
                this.showExplanationModal(item);
            });
            wordsContainer.appendChild(wordItem);
        });

        // Insert words container before the buttons
        modal.querySelector('.flex.justify-center.space-x-4').before(wordsContainer);

        modal.classList.remove('hidden');
    },

    showFlashcardSummary(totalCards) {
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

    showMatchingSummary() {
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
                        <div class="grid grid-cols-3 gap-2 font-bold border-b-2 border-gray-300 pb-2 mb-2">
                            <span>${MESSAGES.get('terms')}</span>
                            <span>${MESSAGES.get('definitions')}</span>
                            <span></span>
                        </div>
                        <div id="matched-pairs-grid" class="grid grid-cols-3 gap-2">
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
                game.renderMatching(game.currentModule); // Replay the current matching module
            });
            document.getElementById('matching-completion-back-to-menu-btn').addEventListener('click', () => {
                modal.classList.add('hidden');
                game.renderMenu(); // Go back to main menu
            });
        }

        // Update modal content
        document.getElementById('matching-completion-title').textContent = MESSAGES.get('sessionScore');
        document.getElementById('matching-completion-message').textContent = MESSAGES.get('matchingCompletionMessage');
        document.getElementById('matching-completion-replay-btn').textContent = MESSAGES.get('replayButton');
        document.getElementById('matching-completion-back-to-menu-btn').textContent = MESSAGES.get('backToMenu');

        const matchedPairsGrid = document.getElementById('matched-pairs-grid');
        matchedPairsGrid.innerHTML = ''; // Clear previous pairs

        // Display matched pairs
        game.matching.matchedPairs.forEach(pair => {
            const termData = game.matching.moduleData.data.find(item => item.id === pair.termId);
            if (termData) {
                const termSpan = document.createElement('span');
                termSpan.className = 'font-semibold';
                termSpan.textContent = termData.term;
                matchedPairsGrid.appendChild(termSpan);

                const definitionSpan = document.createElement('span');
                definitionSpan.textContent = termData.definition;
                matchedPairsGrid.appendChild(definitionSpan);

                // Add explanation button
                const explanationButton = document.createElement('button');
                explanationButton.className = 'explanation-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-md text-sm justify-self-center mr-1';
                explanationButton.innerHTML = '&#x2139;'; // Info icon
                explanationButton.title = MESSAGES.get('showExplanation');
                explanationButton.ariaLabel = MESSAGES.get('showExplanation');
                explanationButton.addEventListener('click', () => {
                    game.showExplanationModal({
                        word: termData.term,
                        translation_es: termData.term_es,
                        example: termData.explanation,
                        example_es: termData.explanation_es
                    });
                });
                matchedPairsGrid.appendChild(explanationButton);
            }
        });

        modal.classList.remove('hidden'); // Show the modal
    },

    showLogoutConfirmation() {
        this.toggleModal(true);
    },

    renderQuiz(module) {
        this.currentView = 'quiz';
        document.body.classList.add('module-active');
        this.quizModule.init(module);
        this.updateFooterVisibility();
    },

    renderCompletion(module) {
        this.currentView = 'completion';
        document.body.classList.add('module-active');
        this.completionModule.init(module);
        this.updateFooterVisibility();
    },

    renderSorting(module) {
        // If we are already in sorting view and the container exists, just update text
        if (this.currentView === 'sorting' && document.getElementById('sorting-container')) {
            this.sortingModule.updateText();
            // No need to re-init or re-add module-active class if already active
            return;
        }

        this.currentView = 'sorting';
        document.body.classList.add('module-active');
        this.sortingModule.init(module);
        this.updateFooterVisibility();
    },

    renderMatching(module) {
        this.currentView = 'matching';
        document.body.classList.add('module-active');
        this.matchingModule.init(module);
        this.updateFooterVisibility();
    },

    addSwipeListeners() {
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
                        } else if (this.currentView === 'quiz') {
                            const optionsDisabled = document.querySelectorAll('[data-option][disabled]').length > 0;
                            if (optionsDisabled) {
                                this.quizModule.next();
                            }
                        } else if (this.currentView === 'completion') {
                            const inputElement = document.getElementById('completion-input');
                            if (inputElement && inputElement.disabled) {
                                this.completionModule.next();
                            }
                        } else if (this.currentView === 'sorting') {
                            // No next/prev for sorting, but can add swipe for check/undo if needed
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
    }
};

document.addEventListener('DOMContentLoaded', () => {
    game.init();
});

window.game = game;
