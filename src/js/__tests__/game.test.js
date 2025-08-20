import { game } from '../game.js';
import { auth } from '../auth.js';
import { MESSAGES } from '../interface.js';
import { getGameModeIconSvg } from '../utils.js';
import FlashcardModule from '../modules/FlashcardModule.js';
import QuizModule from '../modules/QuizModule.js';
import CompletionModule from '../modules/CompletionModule.js';
import SortingModule from '../modules/SortingModule.js';
import MatchingModule from '../modules/MatchingModule.js';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock global fetch
global.fetch = jest.fn();

// Define a minimal `learningModules` for testing `renderMenu` and `startModule`
// This is also used to mock the game-db.json import for game.js
const mockedLearningModules = [
    { id: 'flashcard-1', name: 'Flashcard Module 1', gameMode: 'flashcard', dataPath: '/data/flashcard-1.json' },
    { id: 'quiz-1', name: 'Quiz Module 1', gameMode: 'quiz', dataPath: '/data/quiz-1.json' },
    { id: 'completion-1', name: 'Completion Module 1', gameMode: 'completion', dataPath: '/data/completion-1.json' },
    { id: 'sorting-1', name: 'Sorting Module 1', gameMode: 'sorting', dataPath: '/data/sorting-1.json' },
    { id: 'matching-1', name: 'Matching Module 1', gameMode: 'matching', dataPath: '/data/matching-1.json' },
];

// Mock the game-db.json file itself for game.js
jest.mock('../../assets/data/game-db.json', () => mockedLearningModules);

describe('game.js integration tests', () => {
    let gameRenderMenuSpy;
    let authRenderLoginSpy;
    let gameInitSpy; // Spy for game.init

    beforeEach(() => {
        // Reset DOM before each test
        document.body.innerHTML = `
            <div id="app-container"></div>
            <div id="confirmation-modal" class="hidden">
                <button id="confirm-yes"></button>
                <button id="confirm-no"></button>
                <p id="confirmation-message"></p>
            </div>
            <button id="hamburger-menu"></button>
            <div id="menu-overlay"></div>
            <button id="close-menu-btn"></button>
            <button id="menu-lang-toggle-btn"></button>
            <button id="menu-logout-btn"></button>
            <button id="menu-random-mode-btn"></button>
            <button id="menu-dark-mode-toggle-btn"></button>
            <!-- Removed flashcard-summary-container from initial DOM to force creation by game.js -->
            <div id="quiz-summary-container" class="hidden"></div>
            <div id="completion-summary-container" class="hidden"></div>
            <div id="matching-completion-modal" class="hidden"></div>
            <div id="sorting-completion-modal" class="hidden"></div>
            <div id="explanation-modal" class="hidden"></div>
            <button id="close-explanation-modal-btn"></button>
            <button id="sorting-completion-replay-btn"></button>
            <button id="sorting-completion-back-to-menu-btn"></button>
            <div id="score-container" class="hidden"></div>
            <div id="global-score"></div>
            <div id="username-display"></div>
            <button id="hamburger-btn"></button>
            
            <!-- Templates must be directly in the body or a known parent -->
            <template id="main-menu-template">
                <h1 id="main-menu-title"></h1>
                <div id="module-buttons-container"></div>
            </template>
            <template id="module-button-template">
                <button data-module-id="">
                    <span data-module-index></span>
                    <span data-module-name></span>
                    <span data-game-mode-icon></span>
                </button>
            </template>

            <div id="main-footer-copyright"></div>
            <div id="footer-web-text"></div>
            <div id="footer-mobile-text"></div>
            <div id="session-score-display"></div>
        `;

        // Clear all mocks
        localStorageMock.clear();
        global.fetch.mockClear();

        // Spy on game methods that are called during init or tested directly
        gameRenderMenuSpy = jest.spyOn(game, 'renderMenu');

        // Mock auth and MESSAGES methods that game.js directly calls or relies on
        authRenderLoginSpy = jest.spyOn(auth, 'renderLogin').mockImplementation(() => {});
        jest.spyOn(auth, 'init').mockImplementation(() => {});
        jest.spyOn(auth, 'logout').mockImplementation(() => {});
        jest.spyOn(auth, 'getUser').mockImplementation(() => null); // Default to no user
        jest.spyOn(auth, 'updateGlobalScore').mockImplementation(() => {});

        jest.spyOn(MESSAGES, 'get').mockImplementation((key) => {
            const messages = {
                confirmLogoutMessage: 'Are you sure you want to log out?',
                mainMenu: 'Main Menu',
                logoutButton: 'Logout',
                prevButton: 'Previous',
                nextButton: 'Next',
                backToMenu: 'Back to Menu',
                sessionScore: 'Session Score',
                flashcardSummaryMessage: 'You have completed {count} flashcards.',
                terms: 'Terms',
                definitions: 'Definitions',
                showExplanation: 'Show Explanation',
                undoButton: 'Undo',
                checkButton: 'Check',
                resetButton: 'Reset',
                correct: 'Correct',
                incorrect: 'Incorrect',
                globalScore: 'Global Score',
                lightMode: 'Light Mode',
                darkMode: 'Dark Mode',
                randomMode: 'Random Mode',
                replayButton: 'Replay',
                sortingCompletionTitle: 'Sorting Complete',
                sortingCompletionMessage: 'You have completed the sorting module.',
                matchingCompletionMessage: 'You have completed the matching module.',
                // Add other messages as needed for tests
            };
            return messages[key] || key;
        });
        jest.spyOn(MESSAGES, 'addListener').mockImplementation(() => {});
        jest.spyOn(MESSAGES, 'setLanguage').mockImplementation(() => {});
        jest.spyOn(MESSAGES, 'getLanguage').mockImplementation(() => 'en');

        // Mock the module constructors to prevent them from doing actual DOM manipulation
        // or complex logic during game.init if we only want to test game's orchestration.
        // If we want to test the modules themselves, we'd import and test them separately.
        jest.spyOn(FlashcardModule.prototype, 'init').mockImplementation(() => {});
        jest.spyOn(QuizModule.prototype, 'init').mockImplementation(() => {});
        jest.spyOn(CompletionModule.prototype, 'init').mockImplementation(() => {});
        jest.spyOn(SortingModule.prototype, 'init').mockImplementation(() => {});
        jest.spyOn(MatchingModule.prototype, 'init').mockImplementation(() => {});

        // game.init() is now called explicitly in each test that requires it
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Helper function to simulate game initialization for tests
    const initializeGame = async (user = null) => {
        localStorageMock.clear();
        if (user) {
            localStorageMock.setItem('user', JSON.stringify(user));
            jest.spyOn(auth, 'getUser').mockReturnValue(user);
        } else {
            jest.spyOn(auth, 'getUser').mockReturnValue(null);
        }

        // Simulate game.allLearningModules being set
        game.allLearningModules = mockedLearningModules;

        // Simulate module instantiations (as done in game.init)
        game.flashcardModule = new FlashcardModule(auth, MESSAGES, {});
        game.quizModule = new QuizModule(auth, MESSAGES, {});
        game.completionModule = new CompletionModule(auth, MESSAGES, {});
        game.sortingModule = new SortingModule(game, auth, MESSAGES);
        game.matchingModule = new MatchingModule(game, auth, MESSAGES);

        // Simulate DOM element assignments (as done in game.init)
        game.modal = document.getElementById('confirmation-modal');
        game.yesButton = document.getElementById('confirm-yes');
        game.noButton = document.getElementById('confirm-no');
        game.messageElement = document.getElementById('confirmation-message');
        game.hamburgerMenu = document.getElementById('hamburger-menu');
        game.menuOverlay = document.getElementById('menu-overlay');
        game.closeMenuBtn = document.getElementById('close-menu-btn');
        game.menuLangToggleBtn = document.getElementById('menu-lang-toggle-btn');
        game.menuLogoutBtn = document.getElementById('menu-logout-btn');
        game.menuRandomModeBtn = document.getElementById('menu-random-mode-btn');
        game.menuDarkModeToggleBtn = document.getElementById('menu-dark-mode-toggle-btn');
        game.sortingCompletionModal = document.getElementById('sorting-completion-modal');
        game.sortingCompletionReplayBtn = document.getElementById('sorting-completion-replay-btn');
        game.sortingCompletionBackToMenuBtn = document.getElementById('sorting-completion-back-to-menu-btn');
        game.explanationModal = document.getElementById('explanation-modal');
        game.closeExplanationModalBtn = document.getElementById('close-explanation-modal-btn');

        // Mock fetch for fetchAllLearningModules (called by game.init)
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockedLearningModules),
        });

        // Call game.init() directly
        await game.init();
    };

    // Example test: Check if renderLogin is called when no user is logged in
    test('should call auth.renderLogin if no user is logged in', async () => {
        await initializeGame(null);
        expect(authRenderLoginSpy).toHaveBeenCalled();
        expect(gameRenderMenuSpy).not.toHaveBeenCalled();
    });

    // Example test: Check if renderMenu is called when a user is logged in
    test('should call game.renderMenu if a user is logged in', async () => {
        const user = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
        await initializeGame(user);
        expect(authRenderLoginSpy).not.toHaveBeenCalled();
        expect(gameRenderMenuSpy).toHaveBeenCalled();
    });

    // Test for logout confirmation
    test('should show logout confirmation modal when menu logout button is clicked', async () => {
        const user = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
        await initializeGame(user);
        
        const menuLogoutBtn = document.getElementById('menu-logout-btn');
        menuLogoutBtn.click();

        const confirmationModal = document.getElementById('confirmation-modal');
        expect(confirmationModal.classList.contains('hidden')).toBe(false);
        expect(document.getElementById('confirmation-message').textContent).toBe('Are you sure you want to log out?');
    });

    // Test for logout functionality
    test('should call auth.logout and hide modal when confirm-yes is clicked', async () => {
        const user = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
        await initializeGame(user);
        
        const menuLogoutBtn = document.getElementById('menu-logout-btn');
        menuLogoutBtn.click(); // Show modal

        const confirmYesBtn = document.getElementById('confirm-yes');
        confirmYesBtn.click();

        expect(auth.logout).toHaveBeenCalled();
        expect(document.getElementById('confirmation-modal').classList.contains('hidden')).toBe(true);
    });

    // Test for canceling logout
    test('should hide modal when confirm-no is clicked', async () => {
        const user = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
        await initializeGame(user);
        
        const menuLogoutBtn = document.getElementById('menu-logout-btn');
        menuLogoutBtn.click(); // Show modal

        const confirmNoBtn = document.getElementById('confirm-no');
        confirmNoBtn.click();

        expect(auth.logout).not.toHaveBeenCalled();
        expect(document.getElementById('confirmation-modal').classList.contains('hidden')).toBe(true);
    });

    // Test for rendering menu and module buttons
    test('should render module buttons in the main menu', async () => {
        const user = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
        await initializeGame(user);
        // gameRenderMenuSpy.mockRestore(); // No need to restore if initializeGame calls it
        // game.renderMenu(); // No need to call again if initializeGame calls it

        const moduleButtonsContainer = document.getElementById('module-buttons-container');
        expect(moduleButtonsContainer).not.toBeNull();
        expect(moduleButtonsContainer.children.length).toBe(mockedLearningModules.length);

        // Check content of a sample button
        const firstButton = moduleButtonsContainer.querySelector('button');
        expect(firstButton).not.toBeNull();
        expect(firstButton.dataset.moduleId).toBe(mockedLearningModules[0].id);
        expect(firstButton.querySelector('[data-module-name]').textContent).toContain(mockedLearningModules[0].name.replace('Flashcard: ', '').replace('Quiz: ', '').replace('Completion: ', ''));
        // Use a more flexible check for SVG innerHTML
        expect(firstButton.querySelector('[data-game-mode-icon]').innerHTML).toContain('<svg');
        expect(firstButton.querySelector('[data-game-mode-icon]').innerHTML).toContain('</svg>');
    });

    // Test for startModule and module initialization
    test('should call init on the correct module when startModule is called', async () => {
        const user = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
        await initializeGame(user);

        // Mock fetch response for specific module data (second fetch call in startModule)
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{ en: 'word', es: 'palabra', ipa: '/wɜrd/', example: 'example', example_es: 'ejemplo' }])
        });

        const flashcardModuleMeta = mockedLearningModules.find(m => m.gameMode === 'flashcard');
        await game.startModule(flashcardModuleMeta.id);

        expect(FlashcardModule.prototype.init).toHaveBeenCalledWith(expect.objectContaining({
            id: flashcardModuleMeta.id,
            gameMode: 'flashcard',
            data: expect.any(Array) // Ensure data is passed
        }));
        expect(game.currentModule).toEqual(expect.objectContaining({
            id: flashcardModuleMeta.id,
            gameMode: 'flashcard',
            data: expect.any(Array)
        }));
        expect(game.currentView).toBe('flashcard');
    });

    // Test for updateHeaderText with user data
    test('should update header text with user global score and username', async () => {
        const user = { username: 'testuser', globalScore: { correct: 10, incorrect: 5 } };
        await initializeGame(user);

        const globalScoreEl = document.getElementById('global-score');
        const usernameDisplayEl = document.getElementById('username-display');

        expect(globalScoreEl.innerHTML).toContain('✅ 10');
        expect(globalScoreEl.innerHTML).toContain('❌ 5');
        expect(usernameDisplayEl.innerHTML).toContain('👤 testuser');
    });

    // Test for updateSessionScoreDisplay
    test('should update session score display', () => {
        game.updateSessionScoreDisplay(5, 2, 7);
        const sessionScoreDisplay = document.getElementById('session-score-display');
        expect(sessionScoreDisplay.classList.contains('hidden')).toBe(false);
        expect(sessionScoreDisplay.innerHTML).toContain('✅ 5');
        expect(sessionScoreDisplay.innerHTML).toContain('❌ 2');
        expect(sessionScoreDisplay.innerHTML).toContain('Total: 7');
    });

    // Test for showFlashcardSummary
    test('should show flashcard summary and back to menu button', () => {
        // Ensure app-container is empty before calling showFlashcardSummary
        document.getElementById('app-container').innerHTML = '';
        game.showFlashcardSummary(10);
        
        // Now, the flashcard-summary-container should have been created and appended to app-container
        const flashcardSummaryContainer = document.getElementById('flashcard-summary-container');
        expect(flashcardSummaryContainer).not.toBeNull(); // Ensure the container is created
        expect(flashcardSummaryContainer.classList.contains('hidden')).toBe(false);
        expect(document.getElementById('flashcard-summary-message').textContent).toContain('You have completed 10 flashcards.');
        expect(document.getElementById('flashcard-summary-back-to-menu-btn')).not.toBeNull();
    });

    // Test for toggleHamburgerMenu
    test('should toggle hamburger menu visibility', () => {
        game.toggleHamburgerMenu(true);
        expect(document.body.classList.contains('hamburger-menu-open')).toBe(true);
        game.toggleHamburgerMenu(false);
        expect(document.body.classList.contains('hamburger-menu-open')).toBe(false);
    });

    // Test for updateMenuText
    test('should update menu button texts based on language and mode', async () => {
        jest.spyOn(MESSAGES, 'getLanguage').mockReturnValue('es'); // Simulate Spanish language
        localStorageMock.setItem('randomMode', 'false'); // Ensure random mode is off for this test
        document.body.classList.add('dark-mode'); // Simulate dark mode

        const user = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
        await initializeGame(user); // Initialize game to set up menu elements

        game.updateMenuText();

        expect(document.getElementById('menu-lang-toggle-btn').innerHTML).toContain('Language 🇬🇧');
        expect(document.getElementById('menu-logout-btn').innerHTML).toContain('Logout 🚪');
        expect(document.getElementById('menu-random-mode-btn').innerHTML).toContain('Random Mode OFF');
        expect(document.getElementById('menu-dark-mode-toggle-btn').innerHTML).toContain('Light Mode ☀️');

        jest.spyOn(MESSAGES, 'getLanguage').mockRestore(); // Restore mock
    });
});