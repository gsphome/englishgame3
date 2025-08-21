import FlashcardModule from '../../modules/FlashcardModule.js';
import '@testing-library/jest-dom';

// Mock dependencies
const mockAuth = {
    updateGlobalScore: jest.fn(),
};

const mockMessages = {
    get: jest.fn((key) => key), // Return the key itself for simplicity
};

const mockGameCallbacks = {
    renderMenu: jest.fn(),
    shuffleArray: jest.fn((arr) => arr), // Return array as is for now
    updateSessionScoreDisplay: jest.fn(),
    randomMode: false,
    showFlashcardSummary: jest.fn(),
};

// Mock DOM elements
document.body.innerHTML = `
    <div id="app-container"></div>
    <div id="session-score-display" class="hidden"></div>
`;

describe('FlashcardModule', () => {
    let flashcardModule;
    let appContainer;
    let sessionScoreDisplay;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Re-initialize DOM elements for each test to ensure a clean state
        document.body.innerHTML = `
            <div id="app-container"></div>
            <div id="session-score-display" class="hidden"></div>
        `;
        appContainer = document.getElementById('app-container');
        sessionScoreDisplay = document.getElementById('session-score-display');

        flashcardModule = new FlashcardModule(mockAuth, mockMessages, mockGameCallbacks);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should initialize with correct properties in constructor', () => {
        expect(flashcardModule.auth).toBe(mockAuth);
        expect(flashcardModule.MESSAGES).toBe(mockMessages);
        expect(flashcardModule.gameCallbacks).toBe(mockGameCallbacks);
        expect(flashcardModule.currentIndex).toBe(0);
        expect(flashcardModule.moduleData).toBeNull();
        expect(flashcardModule.appContainer).toBeNull();
        expect(flashcardModule.isTransitioning).toBe(false);
        expect(flashcardModule.sessionScore).toEqual({ correct: 0, incorrect: 0 });
    });

    describe('init', () => {
        const mockModuleData = {
            data: [
                { en: "Hello", es: "Hola", ipa: "/həˈloʊ/", example: "Hello world", example_es: "Hola mundo" },
                { en: "Goodbye", es: "Adiós", ipa: "/ˌɡʊdˈbaɪ/", example: "Goodbye for now", example_es: "Adiós por ahora" },
            ],
        };

        beforeEach(() => {
            mockGameCallbacks.randomMode = false; // Reset randomMode for each test in this block
        });

        test('should initialize module data and app container', () => {
            flashcardModule.init(mockModuleData);

            expect(flashcardModule.currentIndex).toBe(0);
            expect(flashcardModule.moduleData).toBe(mockModuleData);
            expect(flashcardModule.appContainer).toBe(appContainer);
            expect(flashcardModule.isTransitioning).toBe(false);
            expect(flashcardModule.sessionScore).toEqual({ correct: 0, incorrect: 0 });
        });

        test('should shuffle module data if randomMode is true', () => {
            mockGameCallbacks.randomMode = true;
            mockGameCallbacks.shuffleArray.mockReturnValueOnce([...mockModuleData.data].reverse()); // Mock shuffle behavior

            // Pass a copy of the module data to avoid modifying the original mockModuleData
            flashcardModule.init({ ...mockModuleData, data: [...mockModuleData.data] });

            expect(mockGameCallbacks.shuffleArray).toHaveBeenCalledWith(expect.arrayContaining(mockModuleData.data));
            expect(flashcardModule.moduleData.data).toEqual([...mockModuleData.data].reverse());
        });

        test('should not shuffle module data if randomMode is false', () => {
            flashcardModule.init(mockModuleData);
            expect(mockGameCallbacks.shuffleArray).not.toHaveBeenCalled();
            expect(flashcardModule.moduleData.data).toEqual(mockModuleData.data);
        });

        test('should call render', () => {
            const renderSpy = jest.spyOn(flashcardModule, 'render');
            flashcardModule.init(mockModuleData);
            expect(renderSpy).toHaveBeenCalled();
            renderSpy.mockRestore();
        });
    });

    describe('render', () => {
        const mockModuleData = {
            data: [
                { en: "Hello", es: "Hola", ipa: "/həˈloʊ/", example: "Hello world", example_es: "Hola mundo" },
                { en: "Goodbye", es: "Adiós", ipa: "/ˌɡʊdˈbaɪ/", example: "Goodbye for now", example_es: "Adiós por ahora" },
            ],
        };

        beforeEach(() => {
            // Clear appContainer before each render test to simulate initial render
            document.body.innerHTML = `
                <div id="app-container"></div>
                <div id="session-score-display" class="hidden"></div>
            `;
            appContainer = document.getElementById('app-container');
            flashcardModule.appContainer = appContainer; // Manually set appContainer for render tests
            flashcardModule.moduleData = mockModuleData;
        });

        test('should call renderMenu and log error if moduleData is invalid or empty', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            flashcardModule.moduleData = null;
            flashcardModule.render();
            expect(consoleErrorSpy).toHaveBeenCalledWith("Flashcard module data is invalid or empty.");
            expect(mockGameCallbacks.renderMenu).toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });

        test('should render initial flashcard container if it does not exist', () => {
            flashcardModule.render();
            expect(appContainer).not.toHaveClass('main-menu-active');
            expect(document.getElementById('flashcard-container')).toBeInTheDocument();
            expect(document.querySelector('.flashcard')).toBeInTheDocument();
            expect(document.getElementById('flashcard-front-text')).toBeInTheDocument();
            expect(document.getElementById('flashcard-back-text')).toBeInTheDocument();
            expect(document.getElementById('prev-btn')).toBeInTheDocument();
            expect(document.getElementById('next-btn')).toBeInTheDocument();
            expect(document.getElementById('back-to-menu-flashcard-btn')).toBeInTheDocument();
        });

        test('should update existing flashcard content', () => {
            // Initial render to create the elements
            flashcardModule.render();

            // Change current index to simulate next card
            flashcardModule.currentIndex = 1;
            flashcardModule.render();

            expect(document.getElementById('flashcard-front-text')).toHaveTextContent('Goodbye');
            expect(document.getElementById('flashcard-back-text')).toHaveTextContent('Adiós');
        });

        test('should attach event listeners on initial render', () => {
            const addEventListenerSpy = jest.spyOn(Element.prototype, 'addEventListener');
            flashcardModule.render();

            expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            // Expecting 4 calls: prev-btn, next-btn, back-to-menu-flashcard-btn, flashcardElement
            expect(addEventListenerSpy).toHaveBeenCalledTimes(4);
            addEventListenerSpy.mockRestore();
        });

        test('should update button texts', () => {
            flashcardModule.render();
            expect(document.getElementById('prev-btn')).toHaveTextContent('prevButton');
            expect(document.getElementById('next-btn')).toHaveTextContent('nextButton');
            expect(document.getElementById('back-to-menu-flashcard-btn')).toHaveTextContent('backToMenu');
        });

        test('should add card-active class to flashcard', () => {
            flashcardModule.render();
            const card = document.querySelector('.flashcard');
            expect(card).toHaveClass('card-active');
        });
    });

    describe('navigation and flip', () => {
        const mockModuleData = {
            data: [
                { en: "Q1", es: "A1", ipa: "/iː/", example: "Ex1", example_es: "Ej1" },
                { en: "Q2", es: "A2", ipa: "/tuː/", example: "Ex2", example_es: "Ej2" },
                { en: "Q3", es: "A3", ipa: "/θriː/", example: "Ex3", example_es: "Ej3" },
            ],
        };

        let card;

        beforeEach(() => {
            jest.useFakeTimers();
            flashcardModule.moduleData = mockModuleData;
            flashcardModule.appContainer = document.getElementById('app-container');
            flashcardModule.currentIndex = 0;
            flashcardModule.isTransitioning = false;

            // Initialize and render the module to ensure DOM elements are present
            flashcardModule.init(mockModuleData);
            card = flashcardModule.appContainer.querySelector('.flashcard'); // Get the actual card element from the module's container

            // Spy on classList methods of the real DOM element
            // These spies need to be reset before each test
            jest.spyOn(card.classList, 'add');
            jest.spyOn(card.classList, 'remove');
            jest.spyOn(card.classList, 'contains');
            jest.spyOn(card.classList, 'toggle');

            jest.spyOn(flashcardModule, 'render');
            jest.spyOn(mockGameCallbacks, 'showFlashcardSummary'); // Corrected spyOn target
        });

        afterEach(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
            jest.restoreAllMocks(); // Restore querySelector mock
        });

        describe('prev', () => {
            let prevBtn;
            let nextBtn;

            beforeEach(() => {
                prevBtn = document.getElementById('prev-btn');
                nextBtn = document.getElementById('next-btn');

                // Clear classList mocks for each test in this nested describe block
                card.classList.add.mockClear();
                card.classList.remove.mockClear();
                card.classList.contains.mockClear();
            });

            test('should go to previous card and render', () => {
                flashcardModule.currentIndex = 1;
                flashcardModule.prev();

                expect(flashcardModule.isTransitioning).toBe(true);
                expect(prevBtn.disabled).toBe(true);
                expect(nextBtn.disabled).toBe(true);
                // Only expect remove('flipped') if it was actually flipped
                expect(card.classList.remove).not.toHaveBeenCalledWith('flipped');
                expect(card.classList.add).toHaveBeenCalledWith('flash-effect');

                jest.runAllTimers();

                expect(card.classList.remove).toHaveBeenCalledWith('flash-effect');
                expect(flashcardModule.currentIndex).toBe(0);
                expect(flashcardModule.render).toHaveBeenCalled();
                expect(prevBtn.disabled).toBe(false);
                expect(nextBtn.disabled).toBe(false);
                expect(flashcardModule.isTransitioning).toBe(false);
            });

            test('should remove flipped class if card is flipped', () => {
                flashcardModule.currentIndex = 1;
                card.classList.contains.mockReturnValueOnce(true);
                flashcardModule.prev();
                expect(card.classList.remove).toHaveBeenCalledWith('flipped');
                jest.runAllTimers();
            });
        });

        describe('next', () => {
            let prevBtn;
            let nextBtn;

            beforeEach(() => {
                prevBtn = document.getElementById('prev-btn');
                nextBtn = document.getElementById('next-btn');

                // Clear classList mocks for each test in this nested describe block
                card.classList.add.mockClear();
                card.classList.remove.mockClear();
                card.classList.contains.mockClear();
            });

            test('should go to next card and render', () => {
                flashcardModule.currentIndex = 0;
                flashcardModule.next();

                expect(flashcardModule.isTransitioning).toBe(true);
                expect(prevBtn.disabled).toBe(true);
                expect(nextBtn.disabled).toBe(true);
                // Only expect remove('flipped') if it was actually flipped
                expect(card.classList.remove).not.toHaveBeenCalledWith('flipped');
                expect(card.classList.add).toHaveBeenCalledWith('flash-effect');

                jest.runAllTimers();

                expect(card.classList.remove).toHaveBeenCalledWith('flash-effect');
                expect(flashcardModule.currentIndex).toBe(1);
                expect(flashcardModule.render).toHaveBeenCalled();
                expect(prevBtn.disabled).toBe(false);
                expect(nextBtn.disabled).toBe(false);
                expect(flashcardModule.isTransitioning).toBe(false);
            });

            test('should remove flipped class if card is flipped', () => {
                flashcardModule.currentIndex = 0;
                card.classList.contains.mockReturnValueOnce(true);
                flashcardModule.next();
                expect(card.classList.remove).toHaveBeenCalledWith('flipped');
                jest.runAllTimers();
            });
        });

        describe('flip', () => {
            beforeEach(() => {
                // Clear classList mocks for each test in this nested describe block
                card.classList.toggle.mockClear();
            });

            test('should toggle flipped class', () => {
                flashcardModule.isTransitioning = false;
                flashcardModule.flip();
                expect(card.classList.toggle).toHaveBeenCalledWith('flipped');
            });
        });
    });
});
