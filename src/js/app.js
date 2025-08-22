import { auth } from './auth.js';
import { MESSAGES } from './i18n.js';
import { ui } from './ui.js';
import { gameManager } from './gameManager.js'; // Import gameManager module

import { shuffleArray, getGameModeIconSvg } from './utils.js';
import { fetchAllLearningModules } from './dataManager.js'; // fetchModuleData moved to gameManager

/**
 * @file Manages the main application flow, module initialization, and global state.
 * @namespace app
 */
export const app = {
    shuffleArray: shuffleArray, // Still a property of app, used by gameManager
    modal: null, // Confirmation modal reference
    menuScrollPosition: 0,
    currentView: null,
    currentModule: null, // Now updated by gameManager
    randomMode: true,
    startX: 0, // For swipe listeners
    startY: 0, // For swipe listeners
    allLearningModules: null, // Fetched from dataManager

    /**
     * Initializes the main application, setting up modals, authentication, learning modules, and event listeners.
     * @returns {Promise<void>}
     */
    async init() {
        this.modal = document.getElementById('confirmation-modal');
        auth.init();
        this.allLearningModules = await fetchAllLearningModules();

        ui.init(this); // Initialize UI module, pass app instance
        gameManager.init(this); // Initialize GameManager, pass app instance

        // All game module instantiation moved to gameManager.init()
        // All gameCallbacks are now handled by gameManager

        // Initial user check and rendering
        auth.user = JSON.parse(localStorage.getItem('user'));
        ui.renderHeader();
        if (!auth.user) {
            auth.renderLogin();
        } else {
            this.renderMenu();
        }
    },

    renderCurrentView() {
        switch (this.currentView) {
            case 'menu':
                document.body.classList.remove('module-active');
                this.renderMenu();
                break;
            case 'flashcard':
                // Delegated to gameManager.startModule
                gameManager.startModule(this.currentModule.id);
                break;
            case 'quiz':
                // Delegated to gameManager.startModule
                gameManager.startModule(this.currentModule.id);
                break;
            case 'completion':
                // Delegated to gameManager.startModule
                gameManager.startModule(this.currentModule.id);
                break;
            case 'sorting':
                // Delegated to gameManager.startModule
                gameManager.startModule(this.currentModule.id);
                break;
            case 'matching':
                // Delegated to gameManager.startModule
                gameManager.startModule(this.currentModule.id);
                break;
        }
    },

    // renderFlashcard method moved to gameManager.startModule
    // renderQuiz method moved to gameManager.startModule
    // renderCompletion method moved to gameManager.startModule
    // renderSorting method moved to gameManager.startModule
    // renderMatching method moved to gameManager.startModule

    renderMenu() {
        gameManager.removeCurrentModuleKeyboardListeners(); // Use gameManager's method
        document.body.classList.remove('module-active');
        this.currentView = 'menu';
        const sessionScoreDisplay = document.getElementById('session-score-display');
        if (sessionScoreDisplay) {
            sessionScoreDisplay.classList.add('hidden');
        }
        const appContainer = document.getElementById('app-container');

        const template = document.getElementById('main-menu-template');
        const menuContent = template.content.cloneNode(true);

        menuContent.getElementById('main-menu-title').textContent = MESSAGES.get('mainMenu');

        const moduleButtonsContainer = menuContent.getElementById('module-buttons-container');
        const colors = ['bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-teal-600', 'bg-cyan-600', 'bg-emerald-600'];

        this.allLearningModules.forEach((module, index) => {
            const colorClass = colors[index % colors.length];
            const icon = module.icon || '📚';
            const description = module.description || '';

            const buttonTemplate = document.getElementById('module-button-template');
            const button = buttonTemplate.content.cloneNode(true).querySelector('button');

            button.classList.add(colorClass);
            button.dataset.moduleId = module.id;

            if (index <= 25) {
                button.querySelector('[data-module-index]').textContent = `${String.fromCharCode(65 + index)}.`;
            } else {
            }
            button.querySelector('[data-module-name]').textContent = module.name.replace('Flashcard: ', '').replace('Quiz: ', '').replace('Completion: ', '');
            button.querySelector('[data-game-mode-icon]').innerHTML = getGameModeIconSvg(module.gameMode);

            moduleButtonsContainer.appendChild(button);
        });

        appContainer.innerHTML = '';
        appContainer.appendChild(menuContent);
        appContainer.classList.add('main-menu-active');

        if (ui.hamburgerMenu) {
            ui.hamburgerMenu.classList.remove('hidden');
        }

        const scrollWrapper = document.getElementById('main-menu-scroll-wrapper');
        if (scrollWrapper) {
            scrollWrapper.scrollTop = this.menuScrollPosition;
        }

        document.querySelectorAll('[data-module-id]').forEach(button => {
            button.addEventListener('click', () => {
                const currentScrollWrapper = document.getElementById('main-menu-scroll-wrapper');
                if (currentScrollWrapper) {
                    this.menuScrollPosition = currentScrollWrapper.scrollTop;
                }
                const moduleId = button.dataset.moduleId;
                gameManager.startModule(moduleId); // Use gameManager's method
            });
        });
        ui.updateFooterVisibility(this.currentView);
    },

    getMenuMaxWidth() {
        const width = window.innerWidth;
        if (ui.isMobile()) {
            return '300px';
        }
        if (width >= 768 && width < 1024) {
            return '582px';
        }
        return '760px';
    },

    // startModule method moved to gameManager.js

    addKeyboardListeners() {
        const modal = ui.modal;
        const yesButton = ui.yesButton;
        const noButton = ui.noButton;

        document.addEventListener('keydown', (e) => {
            const explanationModal = ui.explanationModal;
            if (explanationModal && !explanationModal.classList.contains('hidden')) {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    ui.closeExplanationModalBtn.click();
                }
                return;
            }

            const sortingCompletionModal = ui.sortingCompletionModal;
            if (sortingCompletionModal && !sortingCompletionModal.classList.contains('hidden')) {
                if (e.key === 'Enter') {
                    ui.sortingCompletionReplayBtn.click();
                } else if (e.key === 'Escape') {
                    ui.sortingCompletionBackToMenuBtn.click();
                }
                return;
            }

            if (!modal.classList.contains('hidden')) {
                if (e.key === 'Enter') {
                    yesButton.click();
                }
                else if (e.key === 'Escape') {
                    ui.toggleModal(modal, false);
                }
                return;
            }

            if (document.body.classList.contains('hamburger-menu-open')) {
                if (e.key === 'Escape') {
                    ui.toggleHamburgerMenu(false);
                }
                return;
            }

            if (e.key === 'Escape') {
                if (this.currentView === 'sorting') {
                    this.renderMenu();
                } else if (document.getElementById('app-container').classList.contains('main-menu-active')) {
                    ui.toggleModal(modal, true);
                } else {
                    this.renderMenu();
                }
            } else if (e.key === '.') {
                const newLang = MESSAGES.getLanguage() === 'en' ? 'es' : 'en';
                MESSAGES.setLanguage(newLang);
                localStorage.setItem('appLang', newLang);
                this.renderCurrentView();
                ui.updateMenuText();
            } else if (this.currentView === 'menu') {
                const pressedKey = e.key.toUpperCase();
                const moduleButtons = document.querySelectorAll('[data-module-id]');
                moduleButtons.forEach((button, index) => {
                    if (String.fromCharCode(65 + index) === pressedKey) {
                        button.click();
                    }
                });
            } else if (this.currentView === 'flashcard') {
                gameManager.flashcardModule.addKeyboardListeners(); // Use gameManager's module
            } else if (this.currentView === 'quiz') {
                gameManager.quizModule.addKeyboardListeners(); // Use gameManager's module
            } else if (this.currentView === 'completion') {
                gameManager.completionModule.addKeyboardListeners(); // Use gameManager's module
            } else if (this.currentView === 'matching') {
                gameManager.matchingModule.addKeyboardListeners(); // Use gameManager's module
            } else if (this.currentView === 'sorting') {
                gameManager.sortingModule.addKeyboardListeners(); // Use gameManager's module
            }
        });
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
                            gameManager.flashcardModule.prev(); // Use gameManager's module
                        }
                    } else { // Swiped left (next)
                        if (this.currentView === 'flashcard') {
                            gameManager.flashcardModule.next(); // Use gameManager's module
                        }
                    }
                }
            } else { // Vertical swipe (for flashcard flip)
                if (Math.abs(diffY) > SWIPE_THRESHOLD) {
                    if (this.currentView === 'flashcard') {
                        gameManager.flashcardModule.flip(); // Use gameManager's module
                    }
                }
            }
        });
    },

    // removeCurrentModuleKeyboardListeners method moved to gameManager.js
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

window.app = app;