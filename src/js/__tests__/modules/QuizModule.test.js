import QuizModule from '../../modules/QuizModule.js';
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
    renderHeader: jest.fn(),
};

// Mock DOM elements
document.body.innerHTML = `
    <div id="app-container"></div>
    <div id="session-score-display" class="hidden"></div>
`;

describe('QuizModule', () => {
    let quizModule;
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

        quizModule = new QuizModule(mockAuth, mockMessages, mockGameCallbacks);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should initialize with correct properties in constructor', () => {
        expect(quizModule.auth).toBe(mockAuth);
        expect(quizModule.MESSAGES).toBe(mockMessages);
        expect(quizModule.gameCallbacks).toBe(mockGameCallbacks);
        expect(quizModule.currentIndex).toBe(0);
        expect(quizModule.sessionScore).toEqual({ correct: 0, incorrect: 0 });
        expect(quizModule.history).toEqual([]);
        expect(quizModule.moduleData).toBeNull();
        expect(quizModule.appContainer).toBeNull();
        expect(quizModule.historyPointer).toBe(-1);
        expect(quizModule.scoreFrozen).toBe(false);
    });

    describe('init', () => {
        const mockModuleData = {
            data: [
                { sentence: "Question 1 ______", options: ["A1", "A2"], correct: "A1", explanation: "Exp1" },
                { sentence: "Question 2 ______", options: ["B1", "B2"], correct: "B1", explanation: "Exp2" },
            ],
        };

        beforeEach(() => {
            mockGameCallbacks.randomMode = false; // Reset randomMode for each test in this block
        });

        test('should initialize module data and app container', () => {
            quizModule.init(mockModuleData);

            expect(quizModule.currentIndex).toBe(0);
            expect(quizModule.sessionScore).toEqual({ correct: 0, incorrect: 0 });
            expect(quizModule.history).toEqual([]);
            expect(quizModule.historyPointer).toBe(-1);
            expect(quizModule.moduleData).toBe(mockModuleData);
            expect(quizModule.appContainer).toBe(appContainer);
            expect(quizModule.scoreFrozen).toBe(false);
        });

        test('should shuffle module data if randomMode is true', () => {
            mockGameCallbacks.randomMode = true;
            mockGameCallbacks.shuffleArray.mockImplementation((arr) => [...arr].reverse()); // Mock shuffle behavior

            quizModule.init({ ...mockModuleData, data: [...mockModuleData.data] });

            expect(mockGameCallbacks.shuffleArray).toHaveBeenCalledWith(expect.arrayContaining(mockModuleData.data));
            expect(quizModule.moduleData.data).toEqual([...mockModuleData.data].reverse());
        });

        test('should not shuffle module data if randomMode is false', () => {
            quizModule.init(mockModuleData);
            expect(mockGameCallbacks.shuffleArray).not.toHaveBeenCalled();
            expect(quizModule.moduleData.data).toEqual(mockModuleData.data);
        });

        test('should call render', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            quizModule.init(mockModuleData);
            expect(renderSpy).toHaveBeenCalled();
            renderSpy.mockRestore();
        });
    });

    describe('render', () => {
        const mockModuleData = {
            data: [
                { sentence: "Question 1 ______", options: ["A1", "A2"], correct: "A1", explanation: "Exp1", tip: "Tip 1" },
                { sentence: "Question 2 ______", options: ["B1", "B2"], correct: "B1", explanation: "Exp2" },
            ],
        };

        beforeEach(() => {
            quizModule.appContainer = appContainer;
            quizModule.moduleData = mockModuleData;
            quizModule.currentIndex = 0;
            mockGameCallbacks.randomMode = false; // Ensure options are not shuffled by default
        });

        test('should call renderMenu and log error if moduleData is invalid or empty', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            quizModule.moduleData = null;
            quizModule.render();
            expect(consoleErrorSpy).toHaveBeenCalledWith("Quiz module data is invalid or empty.");
            expect(mockGameCallbacks.renderMenu).toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });

        test('should render quiz container and question', () => {
            quizModule.render();
            expect(appContainer).not.toHaveClass('main-menu-active');
            expect(document.getElementById('quiz-container')).toBeInTheDocument();
            expect(document.getElementById('quiz-question')).toBeInTheDocument();
            expect(document.getElementById('quiz-question')).toHaveTextContent('Question 1');
            expect(document.getElementById('quiz-question').innerHTML).toContain('<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>');
        });

        test('should render options with correct data and attributes', () => {
            quizModule.render();
            const options = document.querySelectorAll('#options-container button');
            expect(options.length).toBe(2);
            expect(options[0].innerHTML).toContain('<span class="font-bold mr-4">A</span><span>A1</span>');
            expect(options[0]).toHaveAttribute('data-option', 'A1');
            expect(options[1].innerHTML).toContain('<span class="font-bold mr-4">B</span><span>A2</span>');
            expect(options[1]).toHaveAttribute('data-option', 'A2');
        });

        test('should render tip if available', () => {
            quizModule.render();
            expect(document.getElementById('quiz-tip')).toBeInTheDocument();
            expect(document.getElementById('quiz-tip')).toHaveTextContent('Tip: Tip 1');
        });

        test('should hide tip if not available', () => {
            quizModule.currentIndex = 1; // Question without tip
            quizModule.render();
            expect(document.getElementById('quiz-tip')).not.toBeInTheDocument();
        });

        test('should attach event listeners to buttons and options', () => {
            const addEventListenerSpy = jest.spyOn(Element.prototype, 'addEventListener');
            quizModule.render();

            // Expecting listeners for: undo, prev, next, back-to-menu, and each option button
            // 4 buttons + 2 options = 6 listeners
            expect(addEventListenerSpy).toHaveBeenCalledTimes(6);
            addEventListenerSpy.mockRestore();
        });

        test('should update button and header texts', () => {
            quizModule.render();
            expect(document.getElementById('undo-btn')).toHaveTextContent('undoButton');
            expect(document.getElementById('prev-btn')).toHaveTextContent('prevButton');
            expect(document.getElementById('next-btn')).toHaveTextContent('nextButton');
            expect(document.getElementById('quiz-summary-back-to-menu-btn')).toHaveTextContent('backToMenu');
        });

        test('should update session score display', () => {
            quizModule.render();
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 0, mockModuleData.data.length);
        });

        test('should shuffle options if randomMode is true', () => {
            mockGameCallbacks.randomMode = true;
            mockGameCallbacks.shuffleArray.mockImplementation((arr) => [...arr].reverse()); // Mock shuffle behavior
            quizModule.render();

            const options = document.querySelectorAll('#options-container button');
            expect(options[0].innerHTML).toContain('<span class="font-bold mr-4">A</span><span>A2</span>'); // Expect reversed order
            expect(options[1].innerHTML).toContain('<span class="font-bold mr-4">B</span><span>A1</span>');
        });
    });

    

    describe('prev', () => {
        const mockModuleData = {
            data: [
                { sentence: "Q1", options: ["A", "B"], correct: "A", explanation: "Exp1" },
                { sentence: "Q2", options: ["C", "D"], correct: "C", explanation: "Exp2" },
            ],
        };

        beforeEach(() => {
            quizModule.init(mockModuleData);
            quizModule.currentIndex = 1; // Start at the second question
            quizModule.render(); // Render the second question
        });

        test('should decrement currentIndex and re-render if not at the beginning and options are not disabled', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            quizModule.prev();
            expect(quizModule.currentIndex).toBe(0);
            expect(renderSpy).toHaveBeenCalled();
            expect(quizModule.scoreFrozen).toBe(false);
            renderSpy.mockRestore();
        });

        test('should call undo if options are disabled', () => {
            const undoSpy = jest.spyOn(quizModule, 'undo');
            // Simulate options being disabled (e.g., after answering)
            document.querySelectorAll('[data-option]').forEach(b => b.disabled = true);
            quizModule.prev();
            expect(undoSpy).toHaveBeenCalled();
            expect(quizModule.currentIndex).toBe(1); // Should not change current index
            undoSpy.mockRestore();
        });

        test('should do nothing if at the beginning of the quiz', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            quizModule.currentIndex = 0; // Set to first question
            quizModule.prev();
            expect(quizModule.currentIndex).toBe(0);
            expect(renderSpy).not.toHaveBeenCalled();
            renderSpy.mockRestore();
        });
    });

    describe('next', () => {
        const mockModuleData = {
            data: [
                { sentence: "Q1", options: ["A", "B"], correct: "A", explanation: "Exp1" },
                { sentence: "Q2", options: ["C", "D"], correct: "C", explanation: "Exp2" },
            ],
        };

        beforeEach(() => {
            quizModule.init(mockModuleData);
            quizModule.render();
        });

        test('should increment currentIndex and re-render if not at the end and options are disabled', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            // Simulate options being disabled (answered)
            document.querySelectorAll('[data-option]').forEach(b => b.disabled = true);
            quizModule.next();
            expect(quizModule.currentIndex).toBe(1);
            expect(renderSpy).toHaveBeenCalled();
            expect(quizModule.scoreFrozen).toBe(false);
            renderSpy.mockRestore();
        });

        test('should call showFinalScore if at the end and options are disabled', () => {
            const showFinalScoreSpy = jest.spyOn(quizModule, 'showFinalScore');
            quizModule.currentIndex = mockModuleData.data.length - 1; // Last question
            // Simulate options being disabled (answered)
            document.querySelectorAll('[data-option]').forEach(b => b.disabled = true);
            quizModule.next();
            expect(showFinalScoreSpy).toHaveBeenCalled();
            showFinalScoreSpy.mockRestore();
        });

        test('should do nothing if options are not disabled', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            const showFinalScoreSpy = jest.spyOn(quizModule, 'showFinalScore');
            // Options are not disabled by default after render
            quizModule.next();
            expect(quizModule.currentIndex).toBe(0);
            expect(renderSpy).not.toHaveBeenCalled();
            expect(showFinalScoreSpy).not.toHaveBeenCalled();
            renderSpy.mockRestore();
            showFinalScoreSpy.mockRestore();
        });
    });

    describe('undo', () => {
        const mockModuleData = {
            data: [
                { sentence: "Q1", options: ["A", "B"], correct: "A", explanation: "Exp1" },
            ],
        };

        beforeEach(() => {
            quizModule.init(mockModuleData);
            quizModule.render();
            quizModule.handleAnswer('A'); // Answer correctly to create history
        });

        test('should revert UI and session score if historyPointer is valid', () => {
            const initialCorrect = quizModule.sessionScore.correct;
            const initialIncorrect = quizModule.sessionScore.incorrect;

            quizModule.undo();

            expect(quizModule.historyPointer).toBe(-1);
            expect(quizModule.scoreFrozen).toBe(true);
            expect(document.getElementById('feedback-container')).toBeEmptyDOMElement();
            
            // Check if options are re-enabled and styles removed
            document.querySelectorAll('[data-option]').forEach(button => {
                expect(button).not.toBeDisabled();
                expect(button).not.toHaveClass('bg-green-500', 'text-white', 'bg-red-500');
                expect(button).toHaveClass('bg-gray-100', 'hover:bg-gray-200');
            });
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 0, mockModuleData.data.length);
        });

        test('should do nothing if historyPointer is -1', () => {
            quizModule.historyPointer = -1; // Simulate no history
            jest.clearAllMocks(); // Clear mocks from beforeEach setup
            const updateSessionScoreDisplaySpy = jest.spyOn(mockGameCallbacks, 'updateSessionScoreDisplay');
            quizModule.undo();
            expect(quizModule.historyPointer).toBe(-1);
            expect(updateSessionScoreDisplaySpy).not.toHaveBeenCalled();
            updateSessionScoreDisplaySpy.mockRestore();
        });
    });

    describe('showFinalScore', () => {
        beforeEach(() => {
            quizModule.sessionScore = { correct: 5, incorrect: 2 };
            quizModule.appContainer = appContainer;
        });

        test('should render final score and back to menu button initially', () => {
            quizModule.showFinalScore();

            expect(mockAuth.updateGlobalScore).toHaveBeenCalledWith({ correct: 5, incorrect: 2 });
            expect(mockGameCallbacks.renderHeader).toHaveBeenCalled();
            expect(document.getElementById('quiz-summary-container')).toBeInTheDocument();
            expect(document.getElementById('quiz-summary-title')).toHaveTextContent('sessionScore');
            expect(document.getElementById('quiz-summary-correct')).toHaveTextContent('correct: 5');
            expect(document.getElementById('quiz-summary-incorrect')).toHaveTextContent('incorrect: 2');
            expect(document.getElementById('quiz-summary-back-to-menu-btn')).toHaveTextContent('backToMenu');
        });

        test('should update existing final score display', () => {
            // First render
            quizModule.showFinalScore();
            // Change score and call again to update
            quizModule.sessionScore = { correct: 7, incorrect: 3 };
            quizModule.showFinalScore();

            expect(mockAuth.updateGlobalScore).toHaveBeenCalledWith({ correct: 7, incorrect: 3 });
            expect(document.getElementById('quiz-summary-title')).toHaveTextContent('sessionScore');
            expect(document.getElementById('quiz-summary-correct')).toHaveTextContent('correct: 7');
            expect(document.getElementById('quiz-summary-incorrect')).toHaveTextContent('incorrect: 3');
        });
    });

    describe('updateText', () => {
        const mockModuleData = {
            data: [
                { sentence: "Q1 ______", options: ["A", "B"], correct: "A", explanation: "Exp1", tip: "Tip 1" },
                { sentence: "Q2 ______", options: ["C", "D"], correct: "C", explanation: "Exp2" },
            ],
        };

        // No beforeEach here, setup done in each test for isolation

        test('should update question text and tip based on current index', () => {
            // Manual setup for this test
            quizModule.moduleData = mockModuleData;
            appContainer.innerHTML = `
                <div id="quiz-container" class="max-w-2xl mx-auto">
                    <div class="bg-white p-8 rounded-lg shadow-md">
                        <p class="text-base mb-6 md:text-xl" id="quiz-question"></p>
                        <p class="text-lg text-gray-500 mb-4" id="quiz-tip"></p>
                        <div id="options-container" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                        <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button id="undo-btn"></button>
                        <div>
                            <button id="prev-btn"></button>
                            <button id="next-btn"></button>
                        </div>
                    </div>
                    <button id="quiz-summary-back-to-menu-btn"></button>
                </div>
            `;

            // Test for Q1 (with tip)
            quizModule.currentIndex = 0;
            quizModule.updateText();
            expect(document.getElementById('quiz-question')).toHaveTextContent('Q1');
            expect(document.getElementById('quiz-tip')).toHaveTextContent('Tip: Tip 1');
            expect(document.getElementById('quiz-tip')).not.toHaveClass('hidden');

            // Test for Q2 (without tip)
            quizModule.currentIndex = 1;
            quizModule.updateText();
            expect(document.getElementById('quiz-question')).toHaveTextContent('Q2');
            expect(document.getElementById('quiz-tip')).toHaveClass('hidden');
        });

        test('should create tip element if not present and tip exists', () => {
            // Manual setup for this test
            quizModule.moduleData = mockModuleData;
            appContainer.innerHTML = `
                <div id="quiz-container" class="max-w-2xl mx-auto">
                    <div class="bg-white p-8 rounded-lg shadow-md">
                        <p class="text-base mb-6 md:text-xl" id="quiz-question"></p>
                        <div id="options-container" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                        <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button id="undo-btn"></button>
                        <div>
                            <button id="prev-btn"></button>
                            <button id="next-btn"></button>
                        </div>
                    </div>
                    <button id="quiz-summary-back-to-menu-btn"></button>
                </div>
            `;

            // Remove tip element to simulate it not being present initially
            const tipElement = document.getElementById('quiz-tip');
            if (tipElement) {
                tipElement.remove();
            }

            quizModule.currentIndex = 0; // Q1 with tip
            quizModule.updateText();
            expect(document.getElementById('quiz-tip')).toBeInTheDocument();
            expect(document.getElementById('quiz-tip')).toHaveTextContent('Tip: Tip 1');
            expect(document.getElementById('quiz-tip')).not.toHaveClass('hidden');
        });

        test('should update button texts based on messages', () => {
            // Manual setup for this test
            quizModule.moduleData = mockModuleData;
            appContainer.innerHTML = `
                <div id="quiz-container" class="max-w-2xl mx-auto">
                    <div class="bg-white p-8 rounded-lg shadow-md">
                        <p class="text-base mb-6 md:text-xl" id="quiz-question"></p>
                        <p class="text-lg text-gray-500 mb-4" id="quiz-tip"></p>
                        <div id="options-container" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                        <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button id="undo-btn"></button>
                        <div>
                            <button id="prev-btn"></button>
                            <button id="next-btn"></button>
                        </div>
                    </div>
                    <button id="quiz-summary-back-to-menu-btn"></button>
                </div>
            `;

            mockMessages.get.mockImplementation((key) => `Translated_${key}`);
            quizModule.updateText();
            expect(document.getElementById('undo-btn')).toHaveTextContent('Translated_undoButton');
            expect(document.getElementById('prev-btn')).toHaveTextContent('Translated_prevButton');
            expect(document.getElementById('next-btn')).toHaveTextContent('Translated_nextButton');
            expect(document.getElementById('quiz-summary-back-to-menu-btn')).toHaveTextContent('Translated_backToMenu');
        });

        test('should update feedback container based on history if not empty and correct', () => {
            // Manual setup for this test
            quizModule.moduleData = mockModuleData;
            appContainer.innerHTML = `
                <div id="quiz-container" class="max-w-2xl mx-auto">
                    <div class="bg-white p-8 rounded-lg shadow-md">
                        <p class="text-base mb-6 md:text-xl" id="quiz-question"></p>
                        <p class="text-lg text-gray-500 mb-4" id="quiz-tip"></p>
                        <div id="options-container" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                        <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button id="undo-btn"></button>
                        <div>
                            <button id="prev-btn"></button>
                            <button id="next-btn"></button>
                        </div>
                    </div>
                    <button id="quiz-summary-back-to-menu-btn"></button>
                </div>
            `;

            quizModule.history = [{ index: 0, isCorrect: true, selectedOption: 'A', correctAnswer: 'A' }];
            quizModule.updateText();
            expect(document.getElementById('feedback-container')).toHaveTextContent('Exp1');
        });

        test('should update feedback container based on history if not empty and incorrect', () => {
            // Manual setup for this test
            quizModule.moduleData = mockModuleData;
            appContainer.innerHTML = `
                <div id="quiz-container" class="max-w-2xl mx-auto">
                    <div class="bg-white p-8 rounded-lg shadow-md">
                        <p class="text-base mb-6 md:text-xl" id="quiz-question"></p>
                        <p class="text-lg text-gray-500 mb-4" id="quiz-tip"></p>
                        <div id="options-container" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                        <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button id="undo-btn"></button>
                        <div>
                            <button id="prev-btn"></button>
                            <button id="next-btn"></button>
                        </div>
                    </div>
                    <button id="quiz-summary-back-to-menu-btn"></button>
                </div>
            `;

            quizModule.history = [{ index: 0, isCorrect: false, selectedOption: 'B', correctAnswer: 'A' }];
            quizModule.updateText();
            expect(document.getElementById('feedback-container')).toHaveTextContent('Exp1');
        });

        test('should not update feedback container if history is empty', () => {
            // Manual setup for this test
            quizModule.moduleData = mockModuleData;
            appContainer.innerHTML = `
                <div id="quiz-container" class="max-w-2xl mx-auto">
                    <div class="bg-white p-8 rounded-lg shadow-md">
                        <p class="text-base mb-6 md:text-xl" id="quiz-question"></p>
                        <p class="text-lg text-gray-500 mb-4" id="quiz-tip"></p>
                        <div id="options-container" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                        <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button id="undo-btn"></button>
                        <div>
                            <button id="prev-btn"></button>
                            <button id="next-btn"></button>
                        </div>
                    </div>
                    <button id="quiz-summary-back-to-menu-btn"></button>
                </div>
            `;

            document.getElementById('feedback-container').innerHTML = 'Some old feedback';
            quizModule.history = []; // Clear history
            quizModule.updateText();
            expect(document.getElementById('feedback-container')).toHaveTextContent('Some old feedback');
        });
    });
});
