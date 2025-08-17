const game = {
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

    toggleModal(show) {
        this.modal.classList.toggle('hidden', !show);
        if (show) {
            this.messageElement.textContent = MESSAGES.get('confirmLogoutMessage');
        }
    },

    init() {
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
                this.flashcard.updateText();
            } else if (this.currentView === 'quiz') {
                this.quiz.updateText();
            } else if (this.currentView === 'completion') {
                this.completion.updateText();
            } else if (this.currentView === 'sorting') {
                this.sorting.updateText();
            } else if (this.currentView === 'matching') {
                this.matching.updateText();
            }

            // Re-render summary screens if active
            const flashcardSummaryContainer = document.getElementById('flashcard-summary-container');
            const quizSummaryContainer = document.getElementById('quiz-summary-container');
            const completionSummaryContainer = document.getElementById('completion-summary-container');
            const matchingSummaryContainer = document.getElementById('matching-summary-container');

            if (flashcardSummaryContainer && !flashcardSummaryContainer.classList.contains('hidden')) {
                // Re-render flashcard summary with current data
                this.showFlashcardSummary(this.flashcard.moduleData.data.length); // Assuming moduleData is still available
            } else if (quizSummaryContainer && !quizSummaryContainer.classList.contains('hidden')) {
                // Re-render quiz summary with current data
                this.quiz.showFinalScore(); // This function re-renders the summary
            } else if (completionSummaryContainer && !completionSummaryContainer.classList.contains('hidden')) {
                // Re-render completion summary with current data
                this.completion.showFinalScore(); // This function re-renders the summary
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
            button.querySelector('[data-game-mode-icon]').innerHTML = game.getGameModeIconSvg(module.gameMode);

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

            let moduleWithData;
            if (Array.isArray(fetchedData)) {
                moduleWithData = { ...moduleMeta, data: fetchedData };
            } else {
                moduleWithData = { ...moduleMeta, ...fetchedData };
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
                                if (game.flashcard.currentIndex === game.flashcard.moduleData.data.length - 1) {
                                    game.showFlashcardSummary(game.flashcard.moduleData.data.length);
                                } else {
                                    game.flashcard.next();
                                }
                            }, 150); // Small delay to allow unflip animation
                        } else {
                            game.flashcard.flip();
                        }
                    }
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    game.flashcard.prev();
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
                    game.quiz.next();
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    game.quiz.prev();
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
                    game.completion.handleNextAction();
                } else if (e.key === 'Backspace') {
                    const inputElement = document.getElementById('completion-input');
                    if (inputElement && document.activeElement === inputElement) {
                        // Allow default backspace behavior for input field
                        return;
                    }
                    e.preventDefault();
                    game.completion.prev();
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
                    document.getElementById('check-btn').click();
                } else if (e.key === 'Backspace') {
                    e.preventDefault();
                    document.getElementById('undo-btn').click();
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
        const presentedWords = game.sorting.words; // Get the words actually presented in the game
        const wordsToExplain = moduleData.data.filter(item => presentedWords.includes(item.word));

        // Create a map for category lookup
        const categoryMap = new Map();
        game.sorting.categories.forEach(cat => {
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

    flashcard: {
        currentIndex: 0,
        moduleData: null,
        appContainer: null,
        isTransitioning: false, // To prevent multiple clicks during transition
        sessionScore: { correct: 0, incorrect: 0 },

        init(module) {
            this.currentIndex = 0;
            this.moduleData = module;
            this.appContainer = document.getElementById('app-container');
            this.isTransitioning = false;
            this.sessionScore = { correct: 0, incorrect: 0 }; // Initialize session score
            if (game.randomMode && Array.isArray(this.moduleData.data)) {
                this.moduleData.data = game.shuffleArray([...this.moduleData.data]);
            }
            this.render();
        },

        render() {
            if (!this.moduleData || !Array.isArray(this.moduleData.data) || this.moduleData.data.length === 0) {
                // Display an error message or return to the main menu
                console.error("Flashcard module data is invalid or empty.");
                game.renderMenu(); // Go back to the main menu
                return;
            }
            const cardData = this.moduleData.data[this.currentIndex];
            this.appContainer.classList.remove('main-menu-active');

            // Check if the flashcard view is already rendered
            if (!document.getElementById('flashcard-container')) { // Assuming a main container for flashcard view
                this.appContainer.innerHTML = `
                    <div id="flashcard-container" class="max-w-2xl mx-auto">
                        <div class="flashcard h-64 w-full cursor-pointer shadow-lg rounded-xl" onclick="game.flashcard.flip()">
                            <div class="flashcard-inner">
                                <div class="flashcard-front bg-white">
                                    <p class="flashcard-en-word text-base md:text-xl" id="flashcard-front-text">${cardData.en}</p>
                                    <p class="text-sm text-gray-500 md:text-lg" id="flashcard-front-ipa">${cardData.ipa}</p>
                                </div>
                                <div class="flashcard-back bg-blue-100">
                                    <div>
                                        <p class="flashcard-en-word text-base md:text-xl" id="flashcard-back-en-text">${cardData.en}</p>
                                        <p class="text-sm text-gray-500 md:text-lg" id="flashcard-back-ipa">${cardData.ipa}</p>
                                        <p class="text-base font-bold md:text-xl" id="flashcard-back-text">${cardData.es}</p>
                                        <p class="mt-1 italic text-sm md:mt-2" id="flashcard-example">"${cardData.example}"</p>
                                        <p class="text-gray-500 italic" id="flashcard-example-es">"${cardData.example_es}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between mt-4">
                            <button id="prev-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out">
                                ${MESSAGES.get('prevButton')}
                            </button>
                            <button id="next-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out">
                                ${MESSAGES.get('nextButton')}
                            </button>
                        </div>
                         <button id="back-to-menu-flashcard-btn" class="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out" onclick="game.renderMenu()">${MESSAGES.get('backToMenu')}</button>
                    </div>
                `;

                document.getElementById('prev-btn').addEventListener('click', () => this.prev());
                document.getElementById('next-btn').addEventListener('click', () => this.next());
                document.getElementById('back-to-menu-flashcard-btn').addEventListener('click', () => game.renderMenu());
            }
            // Update existing text content by re-rendering innerHTML of front and back
            const flashcardFront = document.querySelector('.flashcard-front');
            const flashcardBack = document.querySelector('.flashcard-back');

            if (flashcardFront) {
                flashcardFront.innerHTML = `
                    <p class="flashcard-en-word text-base md:text-xl" id="flashcard-front-text">${cardData.en}</p>
                    <p class="text-sm text-gray-500 md:text-lg" id="flashcard-front-ipa">${cardData.ipa}</p>
                    <p class="mt-1 italic text-sm md:mt-2" id="flashcard-example">"${cardData.example}"</p>
                `;
            }

            if (flashcardBack) {
                flashcardBack.innerHTML = `
                    <div>
                        <p class="flashcard-en-word text-base md:text-xl" id="flashcard-back-en-text">${cardData.en}</p>
                        <p class="text-sm text-gray-500 md:text-lg" id="flashcard-back-ipa">${cardData.ipa}</p>
                        <p class="text-base font-bold md:text-xl" id="flashcard-back-text">${cardData.es}</p>
                        <p class="mt-1 italic text-sm md:mt-2" id="flashcard-example">"${cardData.example}"</p>
                        <p class="text-gray-500 italic" id="flashcard-example-es">"${cardData.example_es}"</p>
                    </div>
                `;
            }

            game.updateSessionScoreDisplay(0, 0, this.moduleData.data.length);

            // Update button texts regardless of whether the container was just created or already existed
            document.getElementById('prev-btn').textContent = MESSAGES.get('prevButton');
            document.getElementById('next-btn').textContent = MESSAGES.get('nextButton');
            document.getElementById('back-to-menu-flashcard-btn').textContent = MESSAGES.get('backToMenu');

            // Add card-active class after rendering or updating
            const card = this.appContainer.querySelector('.flashcard');
            if (card) {
                card.classList.add('card-active');
            }
        },

        prev() {
            if (this.isTransitioning || this.currentIndex <= 0) return;
            this.isTransitioning = true;

            const card = this.appContainer.querySelector('.flashcard');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');

            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;

            if (card) {
                if (card.classList.contains('flipped')) {
                    card.classList.remove('flipped');
                }
                card.classList.add('flash-effect');
            }

            setTimeout(() => {
                if (card) card.classList.remove('flash-effect');
                this.currentIndex--;
                this.render();

                // Re-enable buttons after rendering the new card
                const newPrevBtn = document.getElementById('prev-btn');
                const newNextBtn = document.getElementById('next-btn');
                if (newPrevBtn) newPrevBtn.disabled = false;
                if (newNextBtn) newNextBtn.disabled = false;
                this.isTransitioning = false;
            }, 300); // Duration of the flash effect
        },

        next() {
            if (this.isTransitioning) return;

            if (this.currentIndex >= this.moduleData.data.length - 1) {
                game.showFlashcardSummary(this.moduleData.data.length);
                return;
            }

            this.isTransitioning = true;

            const card = this.appContainer.querySelector('.flashcard');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');

            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;

            if (card) {
                if (card.classList.contains('flipped')) {
                    card.classList.remove('flipped');
                }
                card.classList.add('flash-effect');
            }

            setTimeout(() => {
                if (card) card.classList.remove('flash-effect');
                this.currentIndex++;
                this.render();

                // Re-enable buttons after rendering the new card
                const newPrevBtn = document.getElementById('prev-btn');
                const newNextBtn = document.getElementById('next-btn');
                if (newPrevBtn) newPrevBtn.disabled = false;
                if (newNextBtn) newNextBtn.disabled = false;
                this.isTransitioning = false;
            }, 300); // Duration of the flash effect
        },

        flip() {
            if (this.isTransitioning) return;
            const card = this.appContainer.querySelector('.flashcard');
            if (card) {
                card.classList.toggle('flipped');
            }
        },

        handleFlashcardAnswer(isCorrect) {
            if (isCorrect) {
                this.sessionScore.correct++;
                auth.updateGlobalScore({ correct: 1, incorrect: 0 });
            } else {
                this.sessionScore.incorrect++;
                auth.updateGlobalScore({ correct: 0, incorrect: 1 });
            }
            game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);

            if (this.currentIndex >= this.moduleData.data.length - 1) {
                game.showFlashcardSummary(this.moduleData.data.length);
            } else {
                this.next();
            }
        },

        updateText() {
            const cardData = this.moduleData.data[this.currentIndex];
            const flashcardFront = document.querySelector('.flashcard-front');
            const flashcardBack = document.querySelector('.flashcard-back');

            if (flashcardFront) {
                flashcardFront.innerHTML = `
                    <p class="flashcard-en-word text-base md:text-xl" id="flashcard-front-text">${cardData.en}</p>
                    <p class="text-sm text-gray-500 md:text-lg" id="flashcard-front-ipa">${cardData.ipa}</p>
                    <p class="mt-1 italic text-sm md:mt-2" id="flashcard-example">"${cardData.example}"</p>
                `;
            }

            if (flashcardBack) {
                flashcardBack.innerHTML = `
                    <div>
                        <p class="flashcard-en-word text-base md:text-xl" id="flashcard-back-en-text">${cardData.en}</p>
                        <p class="text-sm text-gray-500 md:text-lg" id="flashcard-back-ipa">${cardData.ipa}</p>
                        <p class="text-base font-bold md:text-xl" id="flashcard-back-text">${cardData.es}</p>
                        <p class="mt-1 italic text-sm md:mt-2" id="flashcard-example">"${cardData.example}"</p>
                        <p class="text-gray-500 italic" id="flashcard-example-es">"${cardData.example_es}"</p>
                    </div>
                `;
            }

            // Update button texts
            document.getElementById('prev-btn').textContent = MESSAGES.get('prevButton');
            document.getElementById('next-btn').textContent = MESSAGES.get('nextButton');
            document.getElementById('back-to-menu-flashcard-btn').textContent = MESSAGES.get('backToMenu');
        }
    },

    renderFlashcard(module) {
        this.currentView = 'flashcard';
        document.body.classList.add('module-active');
        this.flashcard.init(module);
        this.updateFooterVisibility();
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

    quiz: {
        currentIndex: 0,
        sessionScore: { correct: 0, incorrect: 0 },
        history: [],
        moduleData: null,
        appContainer: null,

        init(module) {
            this.currentIndex = 0;
            this.sessionScore = { correct: 0, incorrect: 0 };
            this.history = [];
            this.moduleData = module;
            this.appContainer = document.getElementById('app-container');
            this.scoreFrozen = false;

            if (game.randomMode && Array.isArray(this.moduleData.data)) {
                this.moduleData.data = game.shuffleArray([...this.moduleData.data]);
            }
            this.render();
        },

        render() {
            if (!this.moduleData || !Array.isArray(this.moduleData.data) || this.moduleData.data.length === 0) {
                console.error("Quiz module data is invalid or empty.");
                game.renderMenu();
                return;
            }
            const questionData = this.moduleData.data[this.currentIndex];
            this.appContainer.classList.remove('main-menu-active');

            // Create a copy of options to shuffle, so the original data is not permanently altered
            let optionsToRender = [...questionData.options];

            // Shuffle options if random mode is active
            if (game.randomMode) {
                optionsToRender = game.shuffleArray(optionsToRender);
            }

            if (!document.getElementById('quiz-container')) {
                let optionsHtml = '';
                const optionLetters = ['A', 'B', 'C', 'D'];
                optionsToRender.forEach((option, index) => {
                    optionsHtml += `
                            <button class="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out flex items-center border border-gray-300" data-option="${option}">
                            <span class="font-bold mr-4">${optionLetters[index]}</span>
                            <span>${option}</span>
                        </button>
                    `;
                });

                this.appContainer.innerHTML = `
                    <div id="quiz-container" class="max-w-2xl mx-auto">
                        <div class="bg-white p-8 rounded-lg shadow-md">
                            <p class="text-base mb-6 md:text-xl" id="quiz-question">${questionData.sentence.replace('______', '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>')}</p>
                            ${questionData.tip ? `<p class="text-lg text-gray-500 mb-4" id="quiz-tip">Tip: ${questionData.tip}</p>` : ''}
                            <div id="options-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">${optionsHtml}</div>
                            <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                        </div>
                        <div class="flex justify-between mt-4">
                            <button id="undo-btn" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4">${MESSAGES.get('undoButton')}</button>
                            <div>
                                <button id="prev-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l md:py-2 md:px-4">${MESSAGES.get('prevButton')}</button>
                                <button id="next-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r md:py-2 md:px-4">${MESSAGES.get('nextButton')}</button>
                            </div>
                        </div>
                         <button id="back-to-menu-quiz-btn" class="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg md:mt-4 md:py-2 md:px-4" onclick="game.renderMenu()">${MESSAGES.get('backToMenu')}</button>
                    </div>
                `;

            }

            document.getElementById('prev-btn').addEventListener('click', () => this.prev());
            document.getElementById('next-btn').addEventListener('click', () => this.next());
            document.getElementById('undo-btn').addEventListener('click', () => this.undo());

            game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
            document.getElementById('quiz-question').innerHTML = questionData.sentence.replace('______', '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>');
            const quizTipElement = document.getElementById('quiz-tip');
            if (questionData.tip) {
                if (quizTipElement) {
                    quizTipElement.textContent = `Tip: ${questionData.tip}`;
                    quizTipElement.classList.remove('hidden');
                } else {
                    // If the element doesn't exist, create and insert it
                    const feedbackContainer = document.getElementById('feedback-container');
                    const newTipElement = document.createElement('p');
                    newTipElement.id = 'quiz-tip';
                    newTipElement.className = 'text-lg text-gray-500 mb-4';
                    newTipElement.textContent = `Tip: ${questionData.tip}`;
                    feedbackContainer.parentNode.insertBefore(newTipElement, feedbackContainer);
                }
            } else {
                if (quizTipElement) {
                    quizTipElement.classList.add('hidden');
                }
            }
            document.getElementById('undo-btn').textContent = MESSAGES.get('undoButton');
            document.getElementById('prev-btn').textContent = MESSAGES.get('prevButton');
            document.getElementById('next-btn').textContent = MESSAGES.get('nextButton');
            document.getElementById('back-to-menu-quiz-btn').textContent = MESSAGES.get('backToMenu');

            // Update options
            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';
            const optionLetters = ['A', 'B', 'C', 'D'];
            optionsToRender.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = "w-full text-left bg-white hover:bg-gray-200 text-gray-800 font-semibold py-3 px-5 rounded-lg shadow-md transition duration-300 flex items-center";
                button.dataset.option = option;
                button.innerHTML = `<span class="font-bold mr-4">${optionLetters[index]}</span><span>${option}</span>`;
                button.addEventListener('click', (e) => this.handleAnswer(e.target.closest('[data-option]').dataset.option));
                optionsContainer.appendChild(button);
            });
            document.getElementById('feedback-container').innerHTML = ''; // Clear feedback
        },

        handleAnswer(selectedOption) {
            const questionData = this.moduleData.data[this.currentIndex];
            const isCorrect = selectedOption === questionData.correct;
            const feedbackHtml = document.getElementById('feedback-container').innerHTML;
            const optionsContainer = document.getElementById('options-container');
            const currentOptions = Array.from(optionsContainer.children).map(button => ({
                option: button.dataset.option,
                className: button.className,
                disabled: button.disabled
            }));

            this.history.push({
                index: this.currentIndex,
                selectedOption: selectedOption,
                correctAnswer: questionData.correct,
                isCorrect: isCorrect,
                shuffledOptions: currentOptions, // Store the state of the options as they were rendered
                feedbackHtml: feedbackHtml, // Store the feedback HTML
                sessionScoreBefore: { ...this.sessionScore } // Store the session score before this action
            });

            console.log('quiz.handleAnswer(): sessionScore before update:', { ...this.sessionScore });
            if (!this.scoreFrozen) { // Only update score if not frozen
                if (isCorrect) {
                    this.sessionScore.correct++;
                    auth.updateGlobalScore({ correct: 1, incorrect: 0 });
                    document.querySelector(`[data-option="${selectedOption}"]`).classList.add('bg-green-500', 'text-white');
                } else {
                    this.sessionScore.incorrect++;
                    auth.updateGlobalScore({ correct: 0, incorrect: 1 });
                    document.querySelector(`[data-option="${selectedOption}"]`).classList.add('bg-red-500', 'text-white');
                    document.querySelector(`[data-option="${questionData.correct}"]`).classList.add('bg-green-500', 'text-white');
                }
            

            document.getElementById('feedback-container').innerHTML = `<p class="text-lg">${questionData.explanation}</p>`;
            document.querySelectorAll('[data-option]').forEach(b => {
                b.disabled = true;
                b.classList.remove('hover:bg-gray-200');
            });
            if (!this.scoreFrozen) { // Only update score display if not frozen
                game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
            }
        },

        prev() {
            if (this.currentIndex > 0) {
                const optionsDisabled = document.querySelectorAll('[data-option][disabled]').length > 0;
                if (optionsDisabled) {
                    // If the current question has been answered, undo it
                    this.undo();
                } else {
                    // If not answered, just go back to the previous question
                    this.scoreFrozen = false; // Reset scoreFrozen when moving to a new question
                    this.currentIndex--;
                    this.render();
                }
                game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
            }
        },

        next() {
            // Prevent advancing if no option has been selected for the current question
            const optionsDisabled = document.querySelectorAll('[data-option][disabled]').length > 0;
            if (!optionsDisabled && this.moduleData.data[this.currentIndex].options) { // Check if it's a quiz question and no option is selected
                // Optionally, provide feedback to the user that an option must be selected
                // For now, just prevent advancement
                return;
            }

            if (this.currentIndex < this.moduleData.data.length - 1) {
                this.scoreFrozen = false; // Reset scoreFrozen when moving to a new question
                this.currentIndex++;
                this.render();
            } else {
                this.showFinalScore();
            }
        },

        undo() {
            if (this.history.length > 0) {
                const lastAction = this.history.pop();
                this.scoreFrozen = true;

                // Do not revert scores on undo, as per new logic.
                // Scores are only updated when a new answer is submitted.
                // if (lastAction.isCorrect) {
                //     this.sessionScore.correct--;
                //     auth.updateGlobalScore({ correct: -1, incorrect: 0 });
                // } else {
                //     this.sessionScore.incorrect--;
                //     auth.updateGlobalScore({ correct: 0, incorrect: -1 });
                // }

                // Set current index to the question that was undone
                // Restore the UI state for the undone question
                const optionsContainer = document.getElementById('options-container');
                const feedbackContainer = document.getElementById('feedback-container');

                // Clear feedback
                feedbackContainer.innerHTML = '';

                // Re-enable all options and remove color classes
                document.querySelectorAll('[data-option]').forEach(button => {
                    button.disabled = false;
                    button.classList.remove('bg-green-500', 'text-white', 'bg-red-500');
                    button.classList.add('bg-gray-100', 'hover:bg-gray-200'); // Restore default classes
                });

                
                game.updateSessionScoreDisplay(lastAction.sessionScoreBefore.correct, lastAction.sessionScoreBefore.incorrect, this.moduleData.data.length);
                
            }
        },

        showFinalScore() {
            auth.updateGlobalScore(this.sessionScore);
            game.renderHeader();

            if (!document.getElementById('quiz-summary-container')) {
                this.appContainer.innerHTML = `
                     <div id="quiz-summary-container" class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                        <h1 id="quiz-summary-title" class="text-2xl font-bold mb-4">${MESSAGES.get('sessionScore')}</h1>
                        <p id="quiz-summary-correct" class="text-xl mb-2">${MESSAGES.get('correct')}: ${this.sessionScore.correct}</p>
                        <p id="quiz-summary-incorrect" class="text-xl mb-4">${MESSAGES.get('incorrect')}: ${this.sessionScore.incorrect}</p>
                        <button id="quiz-summary-back-to-menu-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4" onclick="game.renderMenu()">${MESSAGES.get('backToMenu')}</button>
                     </div>
                `;
            } else {
                document.getElementById('quiz-summary-title').textContent = MESSAGES.get('sessionScore');
                document.getElementById('quiz-summary-correct').textContent = `${MESSAGES.get('correct')}: ${this.sessionScore.correct}`;
                document.getElementById('quiz-summary-incorrect').textContent = `${MESSAGES.get('incorrect')}: ${this.sessionScore.incorrect}`;
                document.getElementById('quiz-summary-back-to-menu-btn').textContent = MESSAGES.get('backToMenu');
            }
        },

        updateText() {
            const questionData = this.moduleData.data[this.currentIndex];
            document.getElementById('quiz-question').innerHTML = questionData.sentence.replace('______', '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>');
            const quizTipElement = document.getElementById('quiz-tip');
            if (questionData.tip) {
                if (quizTipElement) {
                    quizTipElement.textContent = `Tip: ${questionData.tip}`;
                    quizTipElement.classList.remove('hidden');
                } else {
                    const feedbackContainer = document.getElementById('feedback-container');
                    const newTipElement = document.createElement('p');
                    newTipElement.id = 'quiz-tip';
                    newTipElement.className = 'text-lg text-gray-500 mb-4';
                    newTipElement.textContent = `Tip: ${questionData.tip}`;
                    feedbackContainer.parentNode.insertBefore(newTipElement, feedbackContainer);
                }
            } else {
                if (quizTipElement) {
                    quizTipElement.classList.add('hidden');
                }
            }

            // Update option texts
            const optionsContainer = document.getElementById('options-container');
            const optionButtons = optionsContainer.querySelectorAll('[data-option]');
            const optionLetters = ['A', 'B', 'C', 'D'];
            // Assuming optionsToRender is still available or can be re-derived if needed
            // For now, let's assume the options are in the same order as they were rendered
            optionButtons.forEach((button, index) => {
                const optionTextSpan = button.querySelector('span:last-child');
                if (optionTextSpan) {
                    // This is a bit tricky without knowing the exact order of optionsToRender
                    // For simplicity, we'll just update the letter, assuming the text content is static for the current question
                    // A more robust solution would involve re-creating the buttons or mapping them to the shuffled options
                    optionTextSpan.textContent = button.dataset.option; // Re-set the text content from data-option
                }
                const optionLetterSpan = button.querySelector('span:first-child');
                if (optionLetterSpan) {
                    optionLetterSpan.textContent = optionLetters[index];
                }
            });

            // Update button texts
            document.getElementById('undo-btn').textContent = MESSAGES.get('undoButton');
            document.getElementById('prev-btn').textContent = MESSAGES.get('prevButton');
            document.getElementById('next-btn').textContent = MESSAGES.get('nextButton');
            document.getElementById('back-to-menu-quiz-btn').textContent = MESSAGES.get('backToMenu');

            // Update feedback container if it has content
            const feedbackContainer = document.getElementById('feedback-container');
            if (feedbackContainer.innerHTML !== '') {
                // If there's feedback, re-render it based on the current language
                // This assumes the feedback message is simple and can be re-generated
                // For more complex feedback, we might need to store the feedback type
                const isCorrect = this.history.length > 0 ? this.history[this.history.length - 1].correct : null;
                if (isCorrect !== null) {
                    const lastQuestionData = this.moduleData.data[this.history[this.history.length - 1].index];
                    if (isCorrect) {
                        feedbackContainer.innerHTML = `<p class="text-lg">${lastQuestionData.explanation}</p>`;
                    } else {
                        feedbackContainer.innerHTML = `<p class="text-lg">${lastQuestionData.explanation}</p>`;
                    }
                }
            }
        }
    },

    renderQuiz(module) {
        this.currentView = 'quiz';
        document.body.classList.add('module-active');
        this.quiz.init(module);
        this.updateFooterVisibility();
    },

    renderCompletion(module) {
        this.currentView = 'completion';
        document.body.classList.add('module-active');
        this.completion.init(module);
        this.updateFooterVisibility();
    },

    renderSorting(module) {
        // If we are already in sorting view and the container exists, just update text
        if (this.currentView === 'sorting' && document.getElementById('sorting-container')) {
            this.sorting.updateText();
            // No need to re-init or re-add module-active class if already active
            return;
        }

        this.currentView = 'sorting';
        document.body.classList.add('module-active');
        this.sorting.init(module);
        this.updateFooterVisibility();
    },

    renderMatching(module) {
        this.currentView = 'matching';
        document.body.classList.add('module-active');
        this.matching.init(module);
        this.updateFooterVisibility();
    },

    

    completion: {
        currentIndex: 0,
        sessionScore: { correct: 0, incorrect: 0 },
        history: [],
        moduleData: null,
        appContainer: null,

        init(module) {
            this.currentIndex = 0;
            this.sessionScore = { correct: 0, incorrect: 0 };
            this.moduleData = module;
            this.appContainer = document.getElementById('app-container');
            if (game.randomMode && Array.isArray(this.moduleData.data)) {
                this.moduleData.data = game.shuffleArray([...this.moduleData.data]);
            }
            this.render();
            const sessionScoreDisplay = document.getElementById('session-score-display');
            if (sessionScoreDisplay) {
                sessionScoreDisplay.classList.remove('hidden');
            }
        },

        render() {
            if (!this.moduleData || !Array.isArray(this.moduleData.data) || this.moduleData.data.length === 0) {
                console.error("Completion module data is invalid or empty.");
                game.renderMenu();
                return;
            }
            const questionData = this.moduleData.data[this.currentIndex];
            this.appContainer.classList.remove('main-menu-active');

            if (!document.getElementById('completion-container')) {
                this.appContainer.innerHTML = `
                    <div id="completion-container" class="max-w-2xl mx-auto">
                        <div class="bg-white p-8 rounded-lg shadow-md">
                            <p class="text-base md:text-xl" id="completion-question"></p>
                            ${questionData.tip ? `<p class="text-lg text-gray-500 mb-4" id="completion-tip">Tip: ${questionData.tip}</p>` : ''}
                            <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                        </div>
                        <div class="flex justify-between mt-4">
                            <button id="undo-btn" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4">${MESSAGES.get('undoButton')}</button>
                            <div>
                                <button id="prev-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l md:py-2 md:px-4">${MESSAGES.get('prevButton')}</button>
                                <button id="next-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r md:py-2 md:px-4">${MESSAGES.get('nextButton')}</button>
                            </div>
                        </div>
                        <button id="back-to-menu-completion-btn" class="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg md:mt-4 md:py-2 md:px-4" onclick="game.renderMenu()">${MESSAGES.get('backToMenu')}</button>
                    </div>
                `;

                document.getElementById('prev-btn').addEventListener('click', () => this.prev());
                document.getElementById('next-btn').addEventListener('click', () => this.handleNextAction());
                document.getElementById('undo-btn').addEventListener('click', () => this.undo());

                // const inputElement = document.getElementById('completion-input'); // Moved outside
                // setTimeout(() => {
                //     inputElement.value = ''; // Clear the input field
                //     inputElement.focus();
                // }, 0);
            }

            // Update question and input field for every render
            document.getElementById('completion-question').innerHTML = questionData.sentence.replace('______', '<input type="text" id="completion-input" class="border-b-2 border-gray-400 focus:border-blue-500 outline-none text-left w-[20px] bg-transparent" autocomplete="off" />');
            document.getElementById('feedback-container').innerHTML = ''; // Clear feedback

            let inputElement = document.getElementById('completion-input');
            inputElement.value = ''; // Clear the input field
            inputElement.disabled = false; // Enable input field
            inputElement.classList.remove('text-green-500', 'text-red-500'); // Remove color classes
            inputElement.focus();

            const completionTipElement = document.getElementById('completion-tip');
            if (questionData.tip) {
                if (completionTipElement) {
                    completionTipElement.textContent = `Tip: ${questionData.tip}`;
                    completionTipElement.classList.remove('hidden');
                } else {
                    // If the element doesn't exist, create and insert it
                    const feedbackContainer = document.getElementById('feedback-container');
                    const newTipElement = document.createElement('p');
                    newTipElement.id = 'completion-tip';
                    newTipElement.className = 'text-lg text-gray-500 mb-4';
                    newTipElement.textContent = `Tip: ${questionData.tip}`;
                    feedbackContainer.parentNode.insertBefore(newTipElement, feedbackContainer);
                }
            } else {
                if (completionTipElement) {
                    completionTipElement.classList.add('hidden');
                }
            }
        },

        handleAnswer() {
            const inputElement = document.getElementById('completion-input');
            const userAnswer = inputElement.value.trim();

            if (userAnswer === '') {
                return; // Do nothing if the input is empty or just whitespace
            }

            const questionData = this.moduleData.data[this.currentIndex];
            const isCorrect = userAnswer.toLowerCase() === questionData.correct.toLowerCase();

            if (isCorrect) {
                this.sessionScore.correct++;
                auth.updateGlobalScore({ correct: 1, incorrect: 0 });
                inputElement.classList.add('text-green-500');
                document.getElementById('feedback-container').innerHTML = `<p class="text-lg">Correct Answer: <strong>${questionData.correct}</strong></p><p class="text-lg">${questionData.explanation}</p>`;
                this.lastFeedback = { isCorrect: true, correct: questionData.correct, explanation: questionData.explanation, index: this.currentIndex, userAnswer: userAnswer };
            } else {
                this.sessionScore.incorrect++;
                auth.updateGlobalScore({ correct: 0, incorrect: 1 });
                inputElement.classList.add('text-red-500');
                document.getElementById('feedback-container').innerHTML = `<p class="text-lg">Correct Answer: <strong>${questionData.correct}</strong></p><p class="text-lg">${questionData.explanation}</p>`;
                this.lastFeedback = { isCorrect: false, correct: questionData.correct, explanation: questionData.explanation, index: this.currentIndex, userAnswer: userAnswer };
            }
            inputElement.disabled = true;
            game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        },

        undo() {
            const lastAction = this.history.pop();
            if (lastAction) {
                if (lastAction.isCorrect) {
                    this.sessionScore.correct--;
                    auth.updateGlobalScore({ correct: -1, incorrect: 0 });
                } else {
                    this.sessionScore.incorrect--;
                    auth.updateGlobalScore({ correct: 0, incorrect: -1 });
                }
                this.currentIndex = lastAction.index;
                this.render();
                game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
            }
        },

        

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.render();
            }
        },

        next() {
            if (this.currentIndex < this.moduleData.data.length - 1) {
                this.currentIndex++;
                this.render();
            } else {
                this.showFinalScore();
            }
        },

        handleNextAction() {
            const inputElement = document.getElementById('completion-input');
            if (inputElement && !inputElement.disabled) {
                this.handleAnswer();
            } else {
                this.next();
            }
        },

        showFinalScore() {
            auth.updateGlobalScore(this.sessionScore);
            game.renderHeader();

            if (!document.getElementById('completion-summary-container')) {
                this.appContainer.innerHTML = `
                     <div id="completion-summary-container" class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                        <h1 id="completion-summary-title" class="text-2xl font-bold mb-4">${MESSAGES.get('sessionScore')}</h1>
                        <p id="completion-summary-correct" class="text-xl mb-2">${MESSAGES.get('correct')}: ${this.sessionScore.correct}</p>
                        <p id="completion-summary-incorrect" class="text-xl mb-4">${MESSAGES.get('incorrect')}: ${this.sessionScore.incorrect}</p>
                        <button id="completion-summary-back-to-menu-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4" onclick="game.renderMenu()">${MESSAGES.get('backToMenu')}</button>
                     </div>
                `;
            } else {
                document.getElementById('completion-summary-title').textContent = MESSAGES.get('sessionScore');
                document.getElementById('completion-summary-correct').textContent = `${MESSAGES.get('correct')}: ${this.sessionScore.correct}`;
                document.getElementById('completion-summary-incorrect').textContent = `${MESSAGES.get('incorrect')}: ${this.sessionScore.incorrect}`;
                document.getElementById('completion-summary-back-to-menu-btn').textContent = MESSAGES.get('backToMenu');
            }
        },

        updateText() {
            const questionData = this.moduleData.data[this.currentIndex];
            const currentInputValue = document.getElementById('completion-input') ? document.getElementById('completion-input').value : ''; // Save current value
            document.getElementById('completion-question').innerHTML = questionData.sentence.replace('______', '<input type="text" id="completion-input" class="border-b-2 border-gray-400 focus:border-blue-500 outline-none text-left w-[20px] bg-transparent" autocomplete="off" />');
            let inputElement = document.getElementById('completion-input'); // Re-get the element after innerHTML update
            inputElement.value = currentInputValue; // Restore saved value
            inputElement.focus();

            // Restore feedback if available for the current question
            if (this.lastFeedback && this.lastFeedback.index === this.currentIndex) {
                const feedbackHtml = `<p class="text-lg">Correct Answer: <strong>${this.lastFeedback.correct}</strong></p><p class="text-lg">${this.lastFeedback.explanation}</p>`;
                document.getElementById('feedback-container').innerHTML = feedbackHtml;
                inputElement.disabled = true; // Keep disabled
                if (this.lastFeedback.isCorrect) {
                    inputElement.classList.add('text-green-500');
                } else {
                    inputElement.classList.add('text-red-500');
                }
            } else {
                document.getElementById('feedback-container').innerHTML = ''; // Clear feedback if no relevant feedback is stored
                inputElement.disabled = false; // Enable if no feedback
                inputElement.classList.remove('text-green-500', 'text-red-500'); // Remove colors if no feedback
            }
        }
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
                            this.flashcard.prev();
                        } else if (this.currentView === 'quiz') {
                            this.quiz.prev();
                        } else if (this.currentView === 'completion') {
                            this.completion.prev();
                        }
                    } else { // Swiped left (next)
                        if (this.currentView === 'flashcard') {
                            this.flashcard.next();
                        } else if (this.currentView === 'quiz') {
                            const optionsDisabled = document.querySelectorAll('[data-option][disabled]').length > 0;
                            if (optionsDisabled) {
                                this.quiz.next();
                            }
                        } else if (this.currentView === 'completion') {
                            const inputElement = document.getElementById('completion-input');
                            if (inputElement && inputElement.disabled) {
                                this.completion.next();
                            }
                        } else if (this.currentView === 'sorting') {
                            // No next/prev for sorting, but can add swipe for check/undo if needed
                        }
                    }
                }
            } else { // Vertical swipe (for flashcard flip)
                if (Math.abs(diffY) > SWIPE_THRESHOLD) {
                    if (this.currentView === 'flashcard') {
                        this.flashcard.flip();
                    }
                }
            }
        });
    },

    sorting: {
        moduleData: null,
        appContainer: null,
        words: [],
        categories: [],
        userAnswers: {}, // Stores the current category for each word
        originalWordPositions: {}, // To track initial positions for Undo/Reset
        sessionScore: { correct: 0, incorrect: 0 },
        history: [], // To store actions for undo functionality
        draggedElementId: null,
        touchStartX: 0,
        touchStartY: 0,
        currentDraggedElement: null,
        currentGhostElement: null,

        init(module) {
            console.log("Current module data:", this.moduleData);
            this.moduleData = module;
            this.appContainer = document.getElementById('app-container');
            // Determine the categories that will actually be rendered
            // this.categories now stores objects { category_id, category_show }
            this.categories = game.shuffleArray([...module.categories]).slice(0, this.maxCategoriesToRender);
            this.userAnswers = {};
            this.originalWordPositions = {};
            this.sessionScore = { correct: 0, incorrect: 0 };
            this.history = [];
            this.feedbackActive = false;
            this.wordFeedbackStatus = {}; // Initialize word feedback status
            this.clearFeedback(); // Clear any previous feedback colors

            // Group words by category_id from the original module data
            const wordsByCategory = {};
            module.data.forEach(item => {
                if (!wordsByCategory[item.category]) {
                    wordsByCategory[item.category] = [];
                }
                wordsByCategory[item.category].push(item.word);
            });

            let selectedWords = [];
            let allWordsFromSelectedCategories = [];

            // Collect all words that belong to the *selected* categories (using category_id)
            this.categories.forEach(categoryObj => {
                if (wordsByCategory[categoryObj.category_id]) {
                    allWordsFromSelectedCategories = allWordsFromSelectedCategories.concat(wordsByCategory[categoryObj.category_id]);
                }
            });

            // Shuffle all words from the selected categories
            allWordsFromSelectedCategories = game.shuffleArray(allWordsFromSelectedCategories);

            // Select a subset of these words for the game
            // Ensure at least one word from each *displayed* category if possible, then fill up to a total
            const wordsPerCategory = {};
            this.categories.forEach(categoryObj => wordsPerCategory[categoryObj.category_id] = []);

            // Distribute words to ensure representation from each category (using category_id)
            module.data.forEach(item => {
                // Check if the item's category_id is among the selected categories
                if (this.categories.some(cat => cat.category_id === item.category)) {
                    wordsPerCategory[item.category].push(item.word);
                }
            });

            // Select one word from each category, if available (using category_id)
            this.categories.forEach(categoryObj => {
                if (wordsPerCategory[categoryObj.category_id].length > 0) {
                    const word = wordsPerCategory[categoryObj.category_id].shift(); // Take one word
                    selectedWords.push(word);
                }
            });

            // Fill the rest up to 5 words from the remaining words in selected categories
            let remainingWords = [];
            for (const categoryId in wordsPerCategory) { // Iterate over category_ids
                remainingWords = remainingWords.concat(wordsPerCategory[categoryId]);
            }
            remainingWords = game.shuffleArray(remainingWords); // Shuffle remaining words

            let i = 0;
            while (selectedWords.length < 5 && i < remainingWords.length) {
                const wordToAdd = remainingWords[i];
                if (!selectedWords.includes(wordToAdd)) { // Avoid duplicates
                    selectedWords.push(wordToAdd);
                }
                i++;
            }

            this.words = game.shuffleArray(selectedWords); // Final shuffle of the words to be displayed
            this.renderInitialView();
            this.render(); // Call the new render method after initial view is set up
        },

        renderInitialView() {
            this.appContainer.classList.remove('main-menu-active');
            this.appContainer.innerHTML = `
            <div id="sorting-container" class="max-w-2xl mx-auto p-4">

                <div id="word-bank" class="bg-white p-4 rounded-lg shadow-md mb-6 min-h-[100px] border-2 border-gray-300 flex flex-wrap justify-center items-center" ondrop="game.sorting.drop(event)" ondragover="game.sorting.allowDrop(event)">
                    <!-- Words will be rendered here -->
                </div>

                <div id="categories-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <!-- Categories will be rendered here -->
                </div>

                <div class="flex justify-between mt-4">
                        <button id="undo-btn" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg">${MESSAGES.get('undoButton')}</button>
                        <button id="check-btn" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">${MESSAGES.get('checkButton')}</button>
                    </div>
                    <button id="back-to-menu-sorting-btn" class="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg" onclick="game.renderMenu()">${MESSAGES.get('backToMenu')}</button>

                </div>
            `;

            this.renderWords();
            this.renderCategories();
            this.addEventListeners();
            game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.words.length);
        },

        checkAnswers() {
            this.sessionScore = { correct: 0, incorrect: 0 };
            let allCorrect = true;

            this.words.forEach(word => {
                const wordElem = document.getElementById('word-' + word.replace(/\s+/g, '-').toLowerCase());
                if (!wordElem) return; // Word might not be rendered yet or missing

                const currentCategoryElement = wordElem.parentElement;
                const currentCategoryId = currentCategoryElement ? currentCategoryElement.id.replace('category-', '') : 'word-bank';

                // Find the correct category for the current word from the original module data
                const originalWordData = this.moduleData.data.find(item => item.word === word);
                const correctCategory = originalWordData ? originalWordData.category : null;

                // Remove previous feedback classes
                wordElem.classList.remove('bg-green-500', 'bg-red-500', 'text-white');

                if (currentCategoryId === correctCategory) {
                    this.sessionScore.correct++;
                    this.wordFeedbackStatus[word] = true; // Store as correct
                    wordElem.classList.add('bg-green-500', 'text-white');
                } else {
                    this.sessionScore.incorrect++;
                    this.wordFeedbackStatus[word] = false; // Store as incorrect
                    wordElem.classList.add('bg-red-500', 'text-white');
                    allCorrect = false;
                }
            });

            if (allCorrect && this.sessionScore.correct === this.words.length) {
                game.showSortingCompletionModal(this.moduleData);
            }
            auth.updateGlobalScore(this.sessionScore); // Update global score on every check
            this.feedbackActive = true;
            game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.words.length);
        },

        undo() {
            if (this.feedbackActive) {
                this.clearFeedback();
                this.feedbackActive = false;
                return;
            }

            if (this.history.length > 0) {
                const lastAction = this.history.pop();
                const wordElem = document.getElementById(lastAction.wordId);
                const previousParent = document.getElementById(lastAction.from);

                if (wordElem && previousParent) {
                    previousParent.appendChild(wordElem);
                    this.clearFeedback(); // Clear feedback on undo

                    // Do not revert scores on undo, as per new logic.
                    // Scores are only updated when a new answer is submitted.
                    // if (lastAction.isCorrectMove) {
                    //     this.sessionScore.correct--;
                    //     auth.updateGlobalScore({ correct: -1, incorrect: 0 });
                    // } else {
                    //     this.sessionScore.incorrect--;
                    //     auth.updateGlobalScore({ correct: 0, incorrect: -1 });
                    // }
                    game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.words.length);
                }
            }
        },

        clearFeedback() {
            document.querySelectorAll('.word').forEach(wordElem => {
                wordElem.classList.remove('bg-green-500', 'bg-red-500', 'text-white');
                wordElem.classList.add('bg-gray-100', 'hover:bg-gray-200', 'text-gray-800', 'dark:text-black');
            });
        },

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },

        allowDrop(ev) {
            ev.preventDefault();
        },

        drag(ev) {
            this.draggedElementId = ev.target.id;
        },

        drop(ev) {
            ev.preventDefault();
            const wordId = this.draggedElementId;
            if (!wordId) return;

            const wordElem = document.getElementById(wordId);
            let target = ev.target;

            // Find the actual category or word-bank element
            while (target && !target.id.startsWith('category-') && target.id !== 'word-bank') {
                target = target.parentElement;
            }

            if (target && (target.id.startsWith('category-') || target.id === 'word-bank')) {
                const oldParentId = wordElem.parentElement.id;
                const newParentId = target.id;

                if (oldParentId !== newParentId) {
                    // Record the action for undo
                    // Determine if the move is correct or incorrect for scoring
                    const word = wordElem.dataset.word;
                    const originalWordData = this.moduleData.data.find(item => item.word === word);
                    const correctCategory = originalWordData ? originalWordData.category : null;
                    const isCorrectMove = (newParentId === 'word-bank' && correctCategory === null) || (newParentId === `category-${correctCategory}`);

                    game.sorting.history.push({
                        wordId: wordId,
                        from: oldParentId,
                        to: newParentId,
                        isCorrectMove: isCorrectMove // Store correctness of the move
                    });
                    target.appendChild(wordElem);
                    game.sorting.userAnswers[wordElem.dataset.word] = newParentId.replace('category-', '').replace('word-', '');
                    game.sorting.clearFeedback(); // Clear feedback on new move
                }
            }
            this.draggedElementId = null; // Reset the dragged element ID
        },

        getDropTarget(x, y) {
            const wordBank = document.getElementById('word-bank');
            const categories = document.querySelectorAll('.category');
            const potentialTargets = [wordBank, ...Array.from(categories)];

            for (const target of potentialTargets) {
                const rect = target.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    return target;
                }
            }
            return null;
        },

        handleTouchStart(e, wordElem) {
            if (e.touches) { // Check if it's a touch event
                e.preventDefault(); // Prevent scrolling
                this.currentDraggedElement = wordElem;
                this.touchStartX = e.touches[0].clientX;
                this.touchStartY = e.touches[0].clientY;

                // Create a ghost element for visual feedback
                this.currentGhostElement = wordElem.cloneNode(true);
                this.currentGhostElement.style.position = 'absolute';
                this.currentGhostElement.style.width = wordElem.offsetWidth + 'px';
                this.currentGhostElement.style.height = wordElem.offsetHeight + 'px';
                this.currentGhostElement.style.pointerEvents = 'none'; // Make it non-interactive
                this.currentGhostElement.style.opacity = '0.7';
                this.currentGhostElement.style.zIndex = '1000';
                this.currentGhostElement.style.left = (wordElem.getBoundingClientRect().left + window.scrollX) + 'px';
                this.currentGhostElement.style.top = (wordElem.getBoundingClientRect().top + window.scrollY) + 'px';
                document.body.appendChild(this.currentGhostElement);

                // Hide the original element temporarily
                wordElem.style.opacity = '0';

                document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
                document.addEventListener('touchend', this.handleTouchEnd.bind(this), { once: true });
            }
        },

        handleTouchMove(e) {
            if (this.currentGhostElement) {
                e.preventDefault(); // Prevent scrolling
                const touch = e.touches[0];
                this.currentGhostElement.style.left = (touch.clientX + window.scrollX - this.currentGhostElement.offsetWidth / 2) + 'px';
                this.currentGhostElement.style.top = (touch.clientY + window.scrollY - this.currentGhostElement.offsetHeight / 2) + 'px';
            }
        },

        handleTouchEnd(e) {
            if (this.currentGhostElement) {
                const touch = e.changedTouches[0];
                const dropTarget = this.getDropTarget(touch.clientX, touch.clientY);

                if (dropTarget && (dropTarget.id.startsWith('category-') || dropTarget.id === 'word-bank')) {
                    const oldParentId = this.currentDraggedElement.parentElement.id;
                    const newParentId = dropTarget.id;

                    if (oldParentId !== newParentId) {
                        // Determine if the move is correct or incorrect for scoring
                        const word = this.currentDraggedElement.dataset.word;
                        const originalWordData = this.moduleData.data.find(item => item.word === word);
                        const correctCategory = originalWordData ? originalWordData.category : null;
                        const isCorrectMove = (newParentId === 'word-bank' && correctCategory === null) || (newParentId === `category-${correctCategory}`);

                        game.sorting.history.push({
                            wordId: this.currentDraggedElement.id,
                            from: oldParentId,
                            to: newParentId,
                            isCorrectMove: isCorrectMove // Store correctness of the move
                        });
                        dropTarget.appendChild(this.currentDraggedElement);
                        game.sorting.userAnswers[this.currentDraggedElement.dataset.word] = newParentId;
                        game.sorting.clearFeedback();
                        this.render(); // Re-render to update positions
                    }
                }

                // Restore original element's visibility
                this.currentDraggedElement.style.opacity = '1';

                // Clean up ghost element and event listeners
                document.body.removeChild(this.currentGhostElement);
                this.currentGhostElement = null;
                this.currentDraggedElement = null;
                document.removeEventListener('touchmove', this.handleTouchMove.bind(this));
            }
        },

        renderWords() {
            const wordBank = document.getElementById('word-bank');
            wordBank.innerHTML = ''; // Clear existing words
            this.words.forEach(word => {
                const wordElem = document.createElement('div');
                wordElem.id = 'word-' + word.replace(/\s+/g, '-').toLowerCase();
                wordElem.className = 'word bg-gray-100 hover:bg-gray-200 text-gray-800 dark:text-black font-semibold py-2 px-4 rounded-lg shadow-sm cursor-grab m-2';
                wordElem.setAttribute('draggable', true);
                wordElem.textContent = word;
                wordElem.dataset.word = word; // Store original word for easy lookup
                wordElem.addEventListener('dragstart', (e) => this.drag(e));
                wordElem.addEventListener('touchstart', (e) => this.handleTouchStart(e, wordElem));
                wordBank.appendChild(wordElem);
            });
        },

        maxCategoriesToRender: 3, // Global variable to limit categories
        renderCategories() {
            const categoriesContainer = document.getElementById('categories-container');
            categoriesContainer.innerHTML = ''; // Clear existing categories
            // Shuffle categories and then take the first 'maxCategoriesToRender'
            const categoriesToRender = game.shuffleArray([...this.categories]).slice(0, this.maxCategoriesToRender);
            categoriesToRender.forEach(categoryObj => { // Changed 'category' to 'categoryObj'
                const categoryElem = document.createElement('div');
                categoryElem.id = 'category-' + categoryObj.category_id; // Use category_id for ID
                categoryElem.className = 'category bg-white p-4 rounded-lg shadow-md min-h-[120px] border-2 border-gray-300 flex flex-col items-center';
                categoryElem.innerHTML = `<h3 class="text-l font-bold mb-2 capitalize">${categoryObj.category_show}</h3>`; // Use category_show for display
                categoryElem.addEventListener('drop', (e) => this.drop(e));
                categoryElem.addEventListener('dragover', (e) => this.allowDrop(e));
                categoriesContainer.appendChild(categoryElem);
            });
        },

        addEventListeners() {
            document.getElementById('check-btn').addEventListener('click', () => this.checkAnswers());
            document.getElementById('undo-btn').addEventListener('click', () => this.undo());
            document.getElementById('back-to-menu-sorting-btn').addEventListener('click', () => game.renderMenu());
        },

        render() {
            // Move words to their current assigned containers
            this.words.forEach(word => {
                const wordId = 'word-' + word.replace(/\s+/g, '-').toLowerCase();
                const wordElem = document.getElementById(wordId);
                if (wordElem) {
                    const currentCategory = this.userAnswers[word] || 'word-bank';
                    const targetContainer = document.getElementById(currentCategory.startsWith('category-') ? currentCategory : 'word-bank');
                    if (targetContainer) {
                        targetContainer.appendChild(wordElem);
                    } else {
                        document.getElementById('word-bank').appendChild(wordElem); // Fallback
                    }

                    // Re-apply colors if feedback is active
                    if (this.feedbackActive) {
                        wordElem.classList.remove('bg-green-500', 'bg-red-500', 'text-white'); // Clear existing colors first
                        const isCorrect = this.wordFeedbackStatus[word];
                        if (isCorrect === true) {
                            wordElem.classList.add('bg-green-500', 'text-white');
                        } else if (isCorrect === false) {
                            wordElem.classList.add('bg-red-500', 'text-white');
                        }
                    }
                }
            });
            this.updateText(); // Update texts and scores after re-rendering words
        },

        updateText() {
            // Update button texts
            document.getElementById('undo-btn').textContent = MESSAGES.get('undoButton');
            document.getElementById('check-btn').textContent = MESSAGES.get('checkButton');
            document.getElementById('back-to-menu-sorting-btn').textContent = MESSAGES.get('backToMenu');

            // Update score display if visible
            const scoreDisplay = document.getElementById('score-display');
            if (scoreDisplay) {
                // Re-render score based on current sessionScore
                if (this.sessionScore.correct === this.words.length && this.words.length > 0) {
                    scoreDisplay.textContent = `${MESSAGES.get('allCorrectMessage')}`;
                } else {
                    scoreDisplay.textContent = '';
                }
            }

            // Update category titles
            this.categories.forEach(categoryObj => { // Changed 'category' to 'categoryObj'
                const categoryElem = document.getElementById('category-' + categoryObj.category_id); // Use category_id for ID
                if (categoryElem) {
                    const h3 = categoryElem.querySelector('h3');
                    if (h3) {
                        h3.textContent = categoryObj.category_show; // Use category_show for display
                    }
                }
            });
        }
    },

    matching: {
        currentIndex: 0,
        moduleData: null,
        appContainer: null,
        sessionScore: { correct: 0, incorrect: 0 },
        selectedTerm: null,
        selectedDefinition: null,
        matchedPairs: [], // Stores { termId: 'id', definitionId: 'id' }
        allPairs: [], // Stores all possible pairs from moduleData
        feedbackActive: false,

        init(module) {
            this.currentIndex = 0;
            this.moduleData = module;
            this.appContainer = document.getElementById('app-container');
            this.sessionScore = { correct: 0, incorrect: 0 };
            this.selectedTerm = null;
            this.selectedDefinition = null;
            this.matchedPairs = [];
            this.feedbackActive = false;
            if (game.randomMode && Array.isArray(this.moduleData.data)) {
                this.moduleData.data = game.shuffleArray([...this.moduleData.data]);
            }
            this.moduleData.data = this.moduleData.data.slice(0, 5);
            this.render();
        },

        handleItemClick(element) {
            if (this.feedbackActive) return; // Prevent clicks if feedback is active

            const id = element.dataset.id;
            const type = element.dataset.type;

            // Clear previous selections of the same type
            if (type === 'term' && this.selectedTerm) {
                document.getElementById(`term-${this.selectedTerm.id}`).classList.remove('selected');
            } else if (type === 'definition' && this.selectedDefinition) {
                document.getElementById(`definition-${this.selectedDefinition.id}`).classList.remove('selected');
            }

            // Set new selection
            element.classList.add('selected');
            if (type === 'term') {
                this.selectedTerm = { id: id, element: element };
            } else {
                this.selectedDefinition = { id: id, element: element };
            }

            // Attempt to match if both a term and a definition are selected
            if (this.selectedTerm && this.selectedDefinition) {
                this.attemptMatch();
            }
        },

        attemptMatch() {
            if (this.selectedTerm.id === this.selectedDefinition.id) {
                // Correct match
                this.matchedPairs.push({
                    termId: this.selectedTerm.id,
                    definitionId: this.selectedDefinition.id
                });

                // Visually confirm match and disable elements
                this.selectedTerm.element.classList.remove('selected', 'bg-gray-100', 'hover:bg-gray-200');
                this.selectedTerm.element.classList.add('matched', 'bg-green-200', 'cursor-default');
                this.selectedTerm.element.removeEventListener('click', this.handleItemClick);

                this.selectedDefinition.element.classList.remove('selected', 'bg-gray-100', 'hover:bg-gray-200');
                this.selectedDefinition.element.classList.add('matched', 'bg-green-200', 'cursor-default');
                this.selectedDefinition.element.removeEventListener('click', this.handleItemClick);

                // Update score (optional, can be done on final check)
                this.sessionScore.correct++;
                game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);

            } else {
                // Incorrect match - provide temporary feedback
                this.sessionScore.incorrect++;
                game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);

                const termElement = this.selectedTerm.element;
                const defElement = this.selectedDefinition.element;

                termElement.classList.remove('selected');
                defElement.classList.remove('selected');

                termElement.classList.add('incorrect');
                defElement.classList.add('incorrect');

                setTimeout(() => {
                    termElement.classList.remove('incorrect');
                    defElement.classList.remove('incorrect');
                }, 500); // Remove feedback after 0.5 seconds
            }

            // Reset selections
            this.selectedTerm = null;
            this.selectedDefinition = null;

            // Check if all pairs are matched
            if (this.matchedPairs.length === this.moduleData.data.length) {
                this.feedbackActive = true; // Disable further interaction
                // Show the matching summary modal
                setTimeout(() => {
                    game.showMatchingSummary();
                }, 500);
            }
        },

        undo() {
            if (this.matchedPairs.length > 0) {
                const lastMatch = this.matchedPairs.pop();
                const termElement = document.getElementById(`term-${lastMatch.termId}`);
                const defElement = document.getElementById(`definition-${lastMatch.definitionId}`);

                if (termElement) {
                    termElement.classList.remove('matched', 'bg-green-200', 'cursor-default');
                    termElement.classList.add('bg-gray-100', 'hover:bg-gray-200', 'cursor-pointer');
                    termElement.addEventListener('click', (e) => this.handleItemClick(e.target));
                }
                if (defElement) {
                    defElement.classList.remove('matched', 'bg-green-200', 'cursor-default');
                    defElement.classList.add('bg-gray-100', 'hover:bg-gray-200', 'cursor-pointer');
                    defElement.addEventListener('click', (e) => this.handleItemClick(e.target));
                }
                this.sessionScore.correct--;
                game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
            }
        },

        resetGame() {
            this.matchedPairs = [];
            this.sessionScore = { correct: 0, incorrect: 0 };
            this.feedbackActive = false;

            // Re-enable all terms and definitions
            document.querySelectorAll('.matching-item').forEach(element => {
                element.classList.remove('matched', 'bg-green-200', 'incorrect', 'bg-red-200', 'cursor-default', 'selected');
                element.classList.add('bg-gray-100', 'hover:bg-gray-200', 'cursor-pointer');
                element.addEventListener('click', (e) => this.handleItemClick(e.target));
            });
            game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        },

        

        

        render() {
            if (!this.moduleData || !Array.isArray(this.moduleData.data) || this.moduleData.data.length === 0) {
                console.error("Matching module data is invalid or empty.");
                game.renderMenu();
                return;
            }
            this.appContainer.classList.remove('main-menu-active');
            const terms = game.shuffleArray(this.moduleData.data.map(item => ({ id: item.id, text: item.term, type: 'term' })));
            const definitions = game.shuffleArray(this.moduleData.data.map(item => ({ id: item.id, text: item.definition, type: 'definition' })));

            this.appContainer.innerHTML = `
                <div id="matching-container" class="max-w-4xl mx-auto p-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div id="terms-column" class="bg-white p-4 rounded-lg shadow-md">
                            <h3 class="text-xl font-semibold mb-3">${MESSAGES.get('terms')}</h3>
                            <!-- Terms will be rendered here -->
                        </div>
                        <div id="definitions-column" class="bg-white p-4 rounded-lg shadow-md">
                            <h3 class="text-xl font-semibold mb-3">${MESSAGES.get('definitions')}</h3>
                            <!-- Definitions will be rendered here -->
                        </div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button id="undo-matching-btn" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg">${MESSAGES.get('undoButton')}</button>
                        <div>
                            <button id="check-matching-btn" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">${MESSAGES.get('checkButton')}</button>
                            <button id="reset-matching-btn" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg">${MESSAGES.get('resetButton')}</button>
                        </div>
                    </div>
                    <button id="back-to-menu-matching-btn" class="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">${MESSAGES.get('backToMenu')}</button>
                </div>
            `;

            const termsColumn = document.getElementById('terms-column');
            const definitionsColumn = document.getElementById('definitions-column');

            terms.forEach(item => {
                const termElem = document.createElement('div');
                termElem.id = `term-${item.id}`;
                termElem.className = 'matching-item term bg-gray-100 hover:bg-gray-200 text-gray-800 dark:text-black font-semibold py-3 px-4 rounded-lg shadow-sm cursor-pointer mb-2';
                termElem.textContent = item.text;
                termElem.dataset.id = item.id;
                termElem.dataset.type = item.type;
                termElem.addEventListener('click', (e) => this.handleItemClick(e.target));
                termsColumn.appendChild(termElem);
            });

            definitions.forEach(item => {
                const defElem = document.createElement('div');
                defElem.id = `definition-${item.id}`;
                defElem.className = 'matching-item definition bg-gray-100 hover:bg-gray-200 text-gray-800 dark:text-black font-semibold py-3 px-4 rounded-lg shadow-sm cursor-pointer mb-2';
                defElem.textContent = item.text;
                defElem.dataset.id = item.id;
                defElem.dataset.type = item.type;
                defElem.addEventListener('click', (e) => this.handleItemClick(e.target));
                definitionsColumn.appendChild(defElem);
            });

            document.getElementById('undo-matching-btn').addEventListener('click', () => this.undo());
            document.getElementById('check-matching-btn').addEventListener('click', () => this.checkAnswers());
            document.getElementById('reset-matching-btn').addEventListener('click', () => this.resetGame());
            document.getElementById('back-to-menu-matching-btn').addEventListener('click', () => game.renderMenu());
            document.getElementById('back-to-menu-matching-btn').textContent = MESSAGES.get('backToMenu');
            game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
            document.getElementById('back-to-menu-matching-btn').textContent = MESSAGES.get('backToMenu');
            game.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        },

        updateText() {
            document.getElementById('back-to-menu-matching-btn').textContent = MESSAGES.get('backToMenu');
            document.getElementById('undo-matching-btn').textContent = MESSAGES.get('undoButton');
            document.getElementById('check-matching-btn').textContent = MESSAGES.get('checkAnswers');
            document.getElementById('reset-matching-btn').textContent = MESSAGES.get('resetButton');
            document.querySelector('#terms-column h3').textContent = MESSAGES.get('terms');
            document.querySelector('#definitions-column h3').textContent = MESSAGES.get('definitions');
        }
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    getGameModeIconSvg(gameMode) {
        const svgAttributes = 'class="w-6 h-6 inline-block align-middle ml-2" fill="currentColor" viewBox="0 0 24 24"';
        switch (gameMode) {
            case 'flashcard':
                return `<svg ${svgAttributes}><path d="M20 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h14v12zM10 10h4v2h-4zM10 14h4v2h-4z"/></svg>`; // Two overlapping cards
            case 'quiz':
                return `<svg ${svgAttributes}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`; // Question mark in a circle
            case 'sorting':
                return `<svg ${svgAttributes}><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2zm18 3v-2h-6v2h6zM15 9l6 6V9h-6z"/></svg>`; // Up and down arrows with lines
            case 'matching':
                return `<svg ${svgAttributes}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 15H9v-2h2v2zm0-4H9V9h2v2zm4 4h-2v-2h2v2zm0-4h-2V9h2v2z"/></svg>`; // Puzzle pieces in a circle
            case 'completion':
                return `<svg ${svgAttributes}><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 18H6v-2h6v2zm0-4H6v-2h6v2zm4-4H6V6h10v6zM10 10h4v2h-4z"/></svg>`; // Document with a blank line
            default:
                return `<svg ${svgAttributes}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`; // Generic placeholder
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    game.init();
});
