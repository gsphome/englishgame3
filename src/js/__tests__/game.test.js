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
            <div id="sorting-container"></div>
            <div id="matching-completion-modal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 hidden">
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
                        <button id="matching-completion-replay-btn" class=""></button>
                        <button id="matching-completion-back-to-menu-btn" class=""></button>
                    </div>
                </div>
            </div>
            <div id="sorting-completion-modal" class="hidden"></div>
            <div id="explanation-modal" class="hidden"></div>
            <button id="close-explanation-modal-btn"></button>
            <button id="sorting-completion-replay-btn"></button>
            <button id="sorting-completion-back-to-menu-btn"></button>
            <button id="undo-btn"></button>
            <button id="check-btn"></button>
            <button id="back-to-menu-sorting-btn"></button>
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

    // Test for renderHeader when no user is logged in
    test('should hide score, username, and hamburger button if no user is logged in', async () => {
        jest.spyOn(auth, 'getUser').mockReturnValue(null);
        game.renderHeader();
        expect(document.getElementById('score-container').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('username-display').classList.contains('hidden')).toBe(true);
        expect(document.getElementById('hamburger-btn').classList.contains('hidden')).toBe(true);
    });

    // Test for renderMenu hiding session score and showing hamburger menu
    test('should hide session score display and show hamburger menu when rendering menu', async () => {
        const user = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
        await initializeGame(user);

        const sessionScoreDisplay = document.getElementById('session-score-display');
        sessionScoreDisplay.classList.remove('hidden'); // Ensure it's visible before test

        game.renderMenu();

        expect(sessionScoreDisplay.classList.contains('hidden')).toBe(true);
        expect(document.getElementById('hamburger-menu').classList.contains('hidden')).toBe(false);
    });

    // test('should restore menu scroll position when rendering menu', async () => {
    //     const user = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
    //     await initializeGame(user);

    //     // Add a scroll wrapper to the DOM for this test
    //     document.getElementById('app-container').innerHTML = `
    //         <div id="main-menu-scroll-wrapper" style="height: 100px; overflow: scroll;">
    //             <div style="height: 500px;"></div>
    //         </div>
    //     `;
    //     game.modal = document.getElementById('confirmation-modal'); // Re-assign modal after innerHTML change
    //     game.hamburgerMenu = document.getElementById('hamburger-menu');

    //     const scrollWrapper = document.getElementById('main-menu-scroll-wrapper');
    //     game.menuScrollPosition = 50; // Set a scroll position

    //     game.renderMenu();

    //     expect(scrollWrapper.scrollTop).toBe(50);
    // });

    // Test for renderCurrentView
    test('should call renderMenu and remove module-active class when currentView is menu', () => {
        game.currentView = 'menu';
        const renderMenuSpy = jest.spyOn(game, 'renderMenu');
        document.body.classList.add('module-active'); // Add class to ensure it's removed
        game.renderCurrentView();
        expect(renderMenuSpy).toHaveBeenCalled();
        expect(document.body.classList.contains('module-active')).toBe(false);
    });

    test('should call renderFlashcard when currentView is flashcard', () => {
        game.currentView = 'flashcard';
        const renderFlashcardSpy = jest.spyOn(game, 'renderFlashcard');
        game.renderCurrentView();
        expect(renderFlashcardSpy).toHaveBeenCalledWith(game.currentModule);
    });

    test('should call renderQuiz when currentView is quiz', () => {
        game.currentView = 'quiz';
        const renderQuizSpy = jest.spyOn(game, 'renderQuiz');
        game.renderCurrentView();
        expect(renderQuizSpy).toHaveBeenCalledWith(game.currentModule);
    });

    test('should call renderCompletion when currentView is completion', () => {
        game.currentView = 'completion';
        const renderCompletionSpy = jest.spyOn(game, 'renderCompletion');
        game.renderCurrentView();
        expect(renderCompletionSpy).toHaveBeenCalledWith(game.currentModule);
    });

    test('should call renderSorting when currentView is sorting', () => {
        game.currentView = 'sorting';
        const renderSortingSpy = jest.spyOn(game, 'renderSorting');
        game.renderCurrentView();
        expect(renderSortingSpy).toHaveBeenCalledWith(game.currentModule);
    });

    // Test for updateFooterVisibility
    test('should hide footer when currentView is not menu', () => {
        game.currentView = 'flashcard'; // Set to a non-menu view
        document.body.innerHTML += `
            <div id="main-footer-copyright" style="display: block;"></div>
            <div id="footer-web-text"></div>
            <div id="footer-mobile-text"></div>
        `;
        game.updateFooterVisibility();
        expect(document.getElementById('main-footer-copyright').style.display).toBe('none');
    });

    // Test for renderSorting specific branch
    test('should call sortingModule.updateText and not init if already in sorting view with container', async () => {
        // Initialize game once to set up the DOM and modules
        await initializeGame({ username: 'testuser', globalScore: { correct: 0, incorrect: 0 } });
        game.currentView = 'sorting';
        game.renderSorting(mockedLearningModules.find(m => m.gameMode === 'sorting'));

        const sortingModuleInitSpy = jest.spyOn(game.sortingModule, 'init');
        const sortingModuleUpdateTextSpy = jest.spyOn(game.sortingModule, 'updateText');

        // Clear calls to these specific spies before the second renderSorting call
        sortingModuleInitSpy.mockClear();
        sortingModuleUpdateTextSpy.mockClear();

        // Call renderSorting again to trigger the updateText branch
        game.renderSorting({}); // Pass empty module data as it's not used in this branch

        expect(sortingModuleUpdateTextSpy).toHaveBeenCalledTimes(1); // Expect exactly one call
        expect(sortingModuleInitSpy).not.toHaveBeenCalled();
    });
});

describe('game.js keyboard listeners', () => {
    let user;

    beforeEach(async () => {
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
            <div id="sorting-container"></div>
            <div id="matching-completion-modal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 hidden">
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
                        <button id="matching-completion-replay-btn" class=""></button>
                        <button id="matching-completion-back-to-menu-btn" class=""></button>
                    </div>
                </div>
            </div>
            <div id="sorting-completion-modal" class="hidden"></div>
            <div id="explanation-modal" class="hidden"></div>
            <button id="close-explanation-modal-btn"></button>
            <button id="sorting-completion-replay-btn"></button>
            <button id="sorting-completion-back-to-menu-btn"></button>
            <button id="undo-btn"></button>
            <button id="check-btn"></button>
            <button id="back-to-menu-sorting-btn"></button>
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
            <div class="flashcard"></div>
            <div id="flashcard-summary-container" class="hidden">
                <button id="flashcard-summary-back-to-menu-btn"></button>
            </div>
            <div id="feedback-container"></div>
            <button data-option="A"></button>
            <button data-option="B"></button>
            <button data-option="C"></button>
            <button data-option="D"></button>
            <input id="completion-input" />
            <div id="sorting-container"></div>
        `;

        localStorageMock.clear();
        global.fetch.mockClear();

        jest.spyOn(auth, 'init').mockImplementation(() => {});
        jest.spyOn(auth, 'logout').mockImplementation(() => {});
        jest.spyOn(auth, 'getUser').mockImplementation(() => null);
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
            };
            return messages[key] || key;
        });
        jest.spyOn(MESSAGES, 'addListener').mockImplementation(() => {});
        jest.spyOn(MESSAGES, 'setLanguage').mockImplementation(() => {});
        jest.spyOn(MESSAGES, 'getLanguage').mockImplementation(() => 'en');

        jest.spyOn(FlashcardModule.prototype, 'init').mockImplementation(() => {});
        jest.spyOn(QuizModule.prototype, 'init').mockImplementation(() => {});
        jest.spyOn(CompletionModule.prototype, 'init').mockImplementation(() => {});
        jest.spyOn(SortingModule.prototype, 'init').mockImplementation(() => {});
        jest.spyOn(MatchingModule.prototype, 'init').mockImplementation(() => {});

        // Initialize game for each test in this block
        user = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
        await initializeGame(user); // Call initializeGame to set up game object and DOM elements

        // Mock game.showSortingCompletionModal as it's called by SortingModule.checkAnswers
        jest.spyOn(game, 'showSortingCompletionModal').mockImplementation(() => {});

        // Call addKeyboardListeners once for all tests in this block
        game.addKeyboardListeners();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Helper to dispatch keyboard events
    const dispatchKeyEvent = (key, options = {}) => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key, ...options }));
    };

    // Test for Explanation Modal
    test('should close explanation modal on Escape key', () => {
        game.explanationModal.classList.remove('hidden');
        const closeBtnSpy = jest.spyOn(document.getElementById('close-explanation-modal-btn'), 'click');
        dispatchKeyEvent('Escape');
        expect(closeBtnSpy).toHaveBeenCalled();
        expect(game.explanationModal.classList.contains('hidden')).toBe(true);
    });

    test('should close explanation modal on Enter key', () => {
        game.explanationModal.classList.remove('hidden');
        const closeBtnSpy = jest.spyOn(document.getElementById('close-explanation-modal-btn'), 'click');
        dispatchKeyEvent('Enter');
        expect(closeBtnSpy).toHaveBeenCalled();
        expect(game.explanationModal.classList.contains('hidden')).toBe(true);
    });

    // Test for Sorting Completion Modal
    test('should click replay button in sorting completion modal on Enter key', () => {
        game.sortingCompletionModal.classList.remove('hidden');
        const replayBtnSpy = jest.spyOn(document.getElementById('sorting-completion-replay-btn'), 'click');
        dispatchKeyEvent('Enter');
        expect(replayBtnSpy).toHaveBeenCalled();
    });

    test('should click back to menu button in sorting completion modal on Escape key', () => {
        game.sortingCompletionModal.classList.remove('hidden');
        const backToMenuBtnSpy = jest.spyOn(document.getElementById('sorting-completion-back-to-menu-btn'), 'click');
        dispatchKeyEvent('Escape');
        expect(backToMenuBtnSpy).toHaveBeenCalled();
    });

    // Test for Confirmation Modal (Logout)
    test('should click yes button in confirmation modal on Enter key', () => {
        game.toggleModal(true); // Show modal
        const authLogoutSpy = jest.spyOn(auth, 'logout');
        const toggleModalSpy = jest.spyOn(game, 'toggleModal');
        dispatchKeyEvent('Enter');
        expect(authLogoutSpy).toHaveBeenCalled();
        expect(toggleModalSpy).toHaveBeenCalledWith(false); // Expect it to be called to hide the modal
        expect(game.modal.classList.contains('hidden')).toBe(true);
    });

    

    // Test for Hamburger Menu
    test('should close hamburger menu on Escape key', () => {
        document.body.classList.add('hamburger-menu-open');
        dispatchKeyEvent('Escape');
        expect(document.body.classList.contains('hamburger-menu-open')).toBe(false);
    });

    // Test for general Escape behavior
    test('should render menu when Escape is pressed in sorting view', () => {
        game.currentView = 'sorting';
        const renderMenuSpy = jest.spyOn(game, 'renderMenu');
        dispatchKeyEvent('Escape');
        expect(renderMenuSpy).toHaveBeenCalled();
    });

    test('should show logout confirmation modal when Escape is pressed in main menu', () => {
        game.currentView = 'menu';
        document.getElementById('app-container').classList.add('main-menu-active');
        const toggleModalSpy = jest.spyOn(game, 'toggleModal');
        dispatchKeyEvent('Escape');
        expect(toggleModalSpy).toHaveBeenCalledWith(true);
    });

    test('should render menu when Escape is pressed in other game views (e.g., flashcard)', async () => {
        // No need to initialize game fully for this specific test, just set the state
        game.currentView = 'flashcard';
        document.getElementById('app-container').classList.remove('main-menu-active'); // Ensure it's not in main menu
        document.body.classList.add('module-active'); // Simulate being in a module view

        dispatchKeyEvent('Escape');
        expect(game.currentView).toBe('menu'); // Assert that currentView changes to 'menu'
    });

    // Test for language toggle with '.' key
    test('should toggle language and update views on "." key press', () => {
        const setLanguageSpy = jest.spyOn(MESSAGES, 'setLanguage');
        const getLanguageSpy = jest.spyOn(MESSAGES, 'getLanguage');
        const renderCurrentViewSpy = jest.spyOn(game, 'renderCurrentView');
        const updateMenuTextSpy = jest.spyOn(game, 'updateMenuText');

        // Test from 'en' to 'es'
        getLanguageSpy.mockReturnValueOnce('en');
        dispatchKeyEvent('.');
        expect(setLanguageSpy).toHaveBeenCalledWith('es');
        expect(localStorage.setItem).toHaveBeenCalledWith('appLang', 'es');
        expect(renderCurrentViewSpy).toHaveBeenCalled();
        expect(updateMenuTextSpy).toHaveBeenCalled();

        // Test from 'es' to 'en'
        getLanguageSpy.mockReturnValueOnce('es');
        dispatchKeyEvent('.');
        expect(setLanguageSpy).toHaveBeenCalledWith('en');
        expect(localStorage.setItem).toHaveBeenCalledWith('appLang', 'en');
        // renderCurrentViewSpy and updateMenuTextSpy would have been called again
    });

    // Test for module selection (A-Z) in menu view
    test('should start module when corresponding letter key is pressed in menu view', async () => {
        await initializeGame({ username: 'testuser', globalScore: { correct: 0, incorrect: 0 } });
        game.currentView = 'menu'; // Ensure currentView is menu
        game.renderMenu(); // Ensure module buttons are rendered by the game itself

        const startModuleSpy = jest.spyOn(game, 'startModule').mockImplementation(() => {});

        dispatchKeyEvent('a', { shiftKey: false }); // Simulate 'a' key press
        expect(startModuleSpy).toHaveBeenCalledWith('flashcard-1');
        startModuleSpy.mockClear();

        dispatchKeyEvent('B', { shiftKey: true }); // Simulate 'B' key press
        expect(startModuleSpy).toHaveBeenCalledWith('quiz-1');
    });

    // Test for Flashcard view keyboard interactions
    describe('Flashcard view keyboard interactions', () => {
        let flashcardFlipSpy;
        let flashcardNextSpy;
        let flashcardPrevSpy;
        let showFlashcardSummarySpy;

        beforeEach(async () => {
            jest.useFakeTimers(); // Use fake timers for setTimeout
            game.currentView = 'flashcard';
            // Mock moduleData for flashcardModule to simulate card count *before* rendering
            game.flashcardModule.moduleData = { data: [{}, {}, {}] }; // 3 cards
            game.flashcardModule.currentIndex = 0;

            game.renderFlashcard(mockedLearningModules.find(m => m.gameMode === 'flashcard')); // Render flashcard view

            flashcardFlipSpy = jest.spyOn(game.flashcardModule, 'flip').mockImplementation(() => {});
            flashcardNextSpy = jest.spyOn(game.flashcardModule, 'next').mockImplementation(() => {});
            flashcardPrevSpy = jest.spyOn(game.flashcardModule, 'prev').mockImplementation(() => {});
            showFlashcardSummarySpy = jest.spyOn(game, 'showFlashcardSummary').mockImplementation(() => {});
        });

        

        test('should go to previous flashcard on Backspace key', () => {
            dispatchKeyEvent('Backspace');
            expect(flashcardPrevSpy).toHaveBeenCalled();
        });

        test('should click back to menu button from flashcard summary on Enter key', () => {
            document.getElementById('flashcard-summary-container').classList.remove('hidden');
            const backToMenuBtnSpy = jest.spyOn(document.getElementById('flashcard-summary-back-to-menu-btn'), 'click');
            dispatchKeyEvent('Enter');
            expect(backToMenuBtnSpy).toHaveBeenCalled();
        });
    });

    // Test for Quiz view keyboard interactions
    describe('Quiz view keyboard interactions', () => {
        let quizNextSpy;
        let quizPrevSpy;
        let renderMenuSpy;

        beforeEach(async () => {
            game.currentView = 'quiz';
            game.quizModule.moduleData = { data: [{}, {}, {}] }; // Add mock data
            game.renderQuiz(mockedLearningModules.find(m => m.gameMode === 'quiz')); // Render quiz view

            quizNextSpy = jest.spyOn(game.quizModule, 'next').mockImplementation(() => {});
            quizPrevSpy = jest.spyOn(game.quizModule, 'prev').mockImplementation(() => {});
            renderMenuSpy = jest.spyOn(game, 'renderMenu').mockImplementation(() => {});
        });

        test('should render menu from quiz summary on Enter key', () => {
            document.getElementById('quiz-summary-container').classList.remove('hidden');
            dispatchKeyEvent('Enter');
            expect(renderMenuSpy).toHaveBeenCalled();
        });

        

        test('should go to previous quiz question on Backspace key', () => {
            dispatchKeyEvent('Backspace');
            expect(quizPrevSpy).toHaveBeenCalled();
        });

        test('should click correct option button on A, B, C, D key press', () => {
            const optionA = document.querySelector('[data-option="A"]');
            const optionBSpy = jest.spyOn(document.querySelector('[data-option="B"]'), 'click');
            const optionCSpy = jest.spyOn(document.querySelector('[data-option="C"]'), 'click');
            const optionDSpy = jest.spyOn(document.querySelector('[data-option="D"]'), 'click');

            const optionASpy = jest.spyOn(optionA, 'click');
            dispatchKeyEvent('a');
            expect(optionASpy).toHaveBeenCalled();

            dispatchKeyEvent('B');
            expect(optionBSpy).toHaveBeenCalled();

            dispatchKeyEvent('c');
            expect(optionCSpy).toHaveBeenCalled();

            dispatchKeyEvent('D');
            expect(optionDSpy).toHaveBeenCalled();
        });
    });

    // Test for Completion view keyboard interactions
    describe('Completion view keyboard interactions', () => {
        let completionHandleNextActionSpy;
        let completionPrevSpy;

        beforeEach(async () => {
            game.currentView = 'completion';
            game.renderCompletion(mockedLearningModules.find(m => m.gameMode === 'completion')); // Render completion view
            game.completionModule.appContainer = document.getElementById('app-container'); // Explicitly set appContainer

            completionHandleNextActionSpy = jest.spyOn(game.completionModule, 'handleNextAction').mockImplementation(() => {});
            completionPrevSpy = jest.spyOn(game.completionModule, 'prev').mockImplementation(() => {});
        });

        test('should click back to menu button from completion summary on Enter key', () => {
            game.completionModule.showFinalScore(); // Ensure summary is shown and button exists
            document.getElementById('completion-summary-container').classList.remove('hidden'); // Ensure it's visible
            const backToMenuBtnSpy = jest.spyOn(document.querySelector('#completion-summary-container button'), 'click');
            dispatchKeyEvent('Enter');
            expect(backToMenuBtnSpy).toHaveBeenCalled();
        });

        

        test('should allow default Backspace behavior if completion input is active', () => {
            const inputElement = document.getElementById('completion-input');
            inputElement.focus(); // Simulate input being active
            const event = new KeyboardEvent('keydown', { key: 'Backspace' });
            const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
            document.dispatchEvent(event);
            expect(preventDefaultSpy).not.toHaveBeenCalled(); // Should not prevent default
            expect(completionPrevSpy).not.toHaveBeenCalled();
        });

        test('should call prev on Backspace key if completion input is not active', () => {
            const inputElement = document.getElementById('completion-input');
            inputElement.blur(); // Simulate input not being active
            dispatchKeyEvent('Backspace');
            expect(completionPrevSpy).toHaveBeenCalled();
        });
    });

    

    // Test for Sorting view keyboard interactions
    describe('Sorting view keyboard interactions', () => {
        let sortingCheckAnswersSpy;
        let sortingUndoSpy;

        beforeEach(() => {
            game.currentView = 'sorting';
            sortingCheckAnswersSpy = jest.spyOn(game.sortingModule, 'checkAnswers').mockImplementation(() => {});
            sortingUndoSpy = jest.spyOn(game.sortingModule, 'undo').mockImplementation(() => {});
        });

        test('should call checkAnswers on Enter key', () => {
            dispatchKeyEvent('Enter');
            expect(sortingCheckAnswersSpy).toHaveBeenCalled();
        });

        test('should call undo on Backspace key', () => {
            dispatchKeyEvent('Backspace');
            expect(sortingUndoSpy).toHaveBeenCalled();
        });
    });
});

