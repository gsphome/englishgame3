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
            <button id="undo-btn"></button>
            <button id="prev-btn"></button>
            <button id="next-btn"></button>
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
        expect(quizModule.isViewingHistory).toBe(false);
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
            expect(quizModule.isViewingHistory).toBe(false);
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

        test('should call render and updateNavigationButtons', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            const updateNavButtonsSpy = jest.spyOn(quizModule, 'updateNavigationButtons');
            quizModule.init(mockModuleData);
            expect(renderSpy).toHaveBeenCalled();
            expect(updateNavButtonsSpy).toHaveBeenCalled();
            renderSpy.mockRestore();
            updateNavButtonsSpy.mockRestore();
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

        test('should shuffle options if randomMode is true and not viewing history', () => {
            mockGameCallbacks.randomMode = true;
            mockGameCallbacks.shuffleArray.mockImplementation((arr) => [...arr].reverse()); // Mock shuffle behavior
            quizModule.render();

            const options = document.querySelectorAll('#options-container button');
            expect(options[0].innerHTML).toContain('<span class="font-bold mr-4">A</span><span>A2</span>'); // Expect reversed order
            expect(options[1].innerHTML).toContain('<span class="font-bold mr-4">B</span><span>A1</span>');
        });

        test('should not shuffle options if randomMode is true but viewing history', () => {
            mockGameCallbacks.randomMode = true;
            quizModule.isViewingHistory = true;
            mockGameCallbacks.shuffleArray.mockClear(); // Clear any previous calls
            quizModule.render();

            expect(mockGameCallbacks.shuffleArray).not.toHaveBeenCalled();
            const options = document.querySelectorAll('#options-container button');
            expect(options[0].innerHTML).toContain('<span class="font-bold mr-4">A</span><span>A1</span>'); // Expect original order
            expect(options[1].innerHTML).toContain('<span class="font-bold mr-4">B</span><span>A2</span>');
        });

        test('should call updateNavigationButtons', () => {
            const updateNavButtonsSpy = jest.spyOn(quizModule, 'updateNavigationButtons');
            quizModule.render();
            expect(updateNavButtonsSpy).toHaveBeenCalled();
            updateNavButtonsSpy.mockRestore();
        });

        test('should re-render previously answered question with correct state when not viewing history', () => {
            // Ensure DOM is rendered before simulating answer
            quizModule.render(); // Call render explicitly here to set up DOM
            
            // Simulate answering Q1
            quizModule.handleAnswer('A1');
            
            // Move to Q2
            quizModule.currentIndex = 1;
            quizModule.render();
            
            // Now go back to Q1 (which should be rendered as answered)
            quizModule.currentIndex = 0;
            quizModule.isViewingHistory = false; // Ensure we are not in history viewing mode
            quizModule.render(quizModule.history[0]); 

            const optionA1 = document.querySelector('[data-option="A1"]');
            const optionA2 = document.querySelector('[data-option="A2"]');

            expect(optionA1).toHaveClass('bg-green-500', 'text-white');
            expect(optionA2).toHaveClass('bg-white');
            expect(optionA1).toBeDisabled();
            expect(optionA2).toBeDisabled();
            expect(document.getElementById('feedback-container')).toHaveTextContent('Exp1');
        });
    });

    describe('handleAnswer', () => {
        const mockModuleData = {
            data: [
                { sentence: "Q1", options: ["A", "B"], correct: "A", explanation: "Exp1" },
            ],
        };

        beforeEach(() => {
            quizModule.init(mockModuleData);
            quizModule.render();
            jest.clearAllMocks(); // Clear mocks after init/render
        });

        test('should set isViewingHistory to false', () => {
            quizModule.isViewingHistory = true;
            quizModule.handleAnswer('A');
            expect(quizModule.isViewingHistory).toBe(false);
        });

        test('should truncate history if historyPointer is not at the end', () => {
            quizModule.handleAnswer('A'); // Action 1
            quizModule.currentIndex = 0;
            quizModule.historyPointer = 0; // Simulate being in history
            quizModule.handleAnswer('B'); // New action for Q1

            expect(quizModule.history.length).toBe(2);
            expect(quizModule.history[0].selectedOption).toBe('A');
            expect(quizModule.history[1].selectedOption).toBe('B');
            expect(quizModule.historyPointer).toBe(1);
        });

        test('should handle correct answer: update score and history', () => {
            quizModule.sessionScore = { correct: 0, incorrect: 0 };
            quizModule.handleAnswer('A');

            expect(quizModule.sessionScore.correct).toBe(1);
            expect(quizModule.sessionScore.incorrect).toBe(0);
            expect(mockAuth.updateGlobalScore).toHaveBeenCalledWith({ correct: 1, incorrect: 0 });
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(1, 0, mockModuleData.data.length);

            expect(quizModule.history.length).toBe(1);
            expect(quizModule.history[0].isCorrect).toBe(true);
            expect(quizModule.history[0].selectedOption).toBe('A');
            expect(quizModule.history[0].correctAnswer).toBe('A');
            expect(document.getElementById('feedback-container')).toHaveTextContent('Exp1');
            expect(document.querySelector('[data-option="A"]')).toHaveClass('bg-green-500');
            expect(document.querySelector('[data-option="B"]')).toHaveClass('bg-white');
            expect(document.querySelector('[data-option="A"]')).toBeDisabled();
        });

        test('should handle incorrect answer: update score and history', () => {
            quizModule.handleAnswer('B');

            expect(quizModule.sessionScore.correct).toBe(0);
            expect(quizModule.sessionScore.incorrect).toBe(1);
            expect(mockAuth.updateGlobalScore).toHaveBeenCalledWith({ correct: 0, incorrect: 1 });
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 1, mockModuleData.data.length);

            expect(quizModule.history.length).toBe(1);
            expect(quizModule.history[0].isCorrect).toBe(false);
            expect(quizModule.history[0].selectedOption).toBe('B');
            expect(quizModule.history[0].correctAnswer).toBe('A');
            expect(document.getElementById('feedback-container')).toHaveTextContent('Exp1');
            expect(document.querySelector('[data-option="B"]')).toHaveClass('bg-red-500');
            expect(document.querySelector('[data-option="A"]')).toHaveClass('bg-green-500');
            expect(document.querySelector('[data-option="B"]')).toBeDisabled();
        });

        test('should not update score if scoreFrozen is true', () => {
            quizModule.scoreFrozen = true;
            quizModule.handleAnswer('A');
            expect(quizModule.sessionScore).toEqual({ correct: 0, incorrect: 0 });
            expect(mockAuth.updateGlobalScore).not.toHaveBeenCalled();
            expect(mockGameCallbacks.updateSessionScoreDisplay).not.toHaveBeenCalled();
        });

        test('should call updateNavigationButtons', () => {
            const updateNavButtonsSpy = jest.spyOn(quizModule, 'updateNavigationButtons');
            quizModule.handleAnswer('A');
            expect(updateNavButtonsSpy).toHaveBeenCalled();
            updateNavButtonsSpy.mockRestore();
        });
    });

    describe('prev', () => {
        const mockModuleData = {
            data: [
                { sentence: "Q1", options: ["A", "B"], correct: "A", explanation: "Exp1" },
                { sentence: "Q2", options: ["C", "D"], correct: "C", explanation: "Exp2" },
                { sentence: "Q3", options: ["E", "F"], correct: "E", explanation: "Exp3" },
            ],
        };

        beforeEach(() => {
            quizModule.init(mockModuleData);
            quizModule.render();
            jest.clearAllMocks(); // Clear mocks after init/render
        });

        test('should decrement currentIndex and re-render if not at the beginning and current question is unanswered', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            quizModule.currentIndex = 1; // Start at Q2
            quizModule.prev();
            expect(quizModule.currentIndex).toBe(0);
            expect(renderSpy).toHaveBeenCalled();
            expect(quizModule.scoreFrozen).toBe(false);
            expect(quizModule.isViewingHistory).toBe(false);
            renderSpy.mockRestore();
        });

        test('should enter history viewing mode if current question is answered', () => {
            const renderHistoryStateSpy = jest.spyOn(quizModule, 'renderHistoryState');
            quizModule.handleAnswer('A'); // Answer Q1
            jest.clearAllMocks();

            quizModule.prev();
            expect(quizModule.isViewingHistory).toBe(true);
            expect(quizModule.historyPointer).toBe(0); // Pointing to the answered Q1
            expect(renderHistoryStateSpy).toHaveBeenCalled();
            renderHistoryStateSpy.mockRestore();
        });

        test('should navigate back in history if already viewing history', () => {
            const renderHistoryStateSpy = jest.spyOn(quizModule, 'renderHistoryState');
            quizModule.handleAnswer('A'); // Answer Q1
            quizModule.currentIndex = 1;
            quizModule.handleAnswer('C'); // Answer Q2
            jest.clearAllMocks();

            quizModule.isViewingHistory = true;
            quizModule.historyPointer = 1; // Currently viewing Q2 history

            quizModule.prev(); // Go back to Q1 history
            expect(quizModule.historyPointer).toBe(0);
            expect(renderHistoryStateSpy).toHaveBeenCalled();
            renderHistoryStateSpy.mockRestore();
        });

        test('should exit history viewing mode and go to previous question if at beginning of history', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            quizModule.handleAnswer('A'); // Answer Q1
            quizModule.currentIndex = 1;
            quizModule.handleAnswer('C'); // Answer Q2
            jest.clearAllMocks();

            quizModule.isViewingHistory = true;
            quizModule.historyPointer = 0; // Currently viewing Q1 history

            quizModule.prev(); // Should go to previous unanswered question (none in this case, but logic applies)
            expect(quizModule.isViewingHistory).toBe(false);
            expect(quizModule.scoreFrozen).toBe(false);
            expect(quizModule.currentIndex).toBe(0); // Stays at Q1 as no previous unanswered question
            expect(renderSpy).toHaveBeenCalled();
            renderSpy.mockRestore();
        });

        test('should do nothing if at the beginning of the quiz and not viewing history', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            quizModule.currentIndex = 0; // Set to first question
            quizModule.prev();
            expect(quizModule.currentIndex).toBe(0);
            expect(renderSpy).not.toHaveBeenCalled();
            renderSpy.mockRestore();
        });

        test('should call updateNavigationButtons', () => {
            const updateNavButtonsSpy = jest.spyOn(quizModule, 'updateNavigationButtons');
            quizModule.prev();
            expect(updateNavButtonsSpy).toHaveBeenCalled();
            updateNavButtonsSpy.mockRestore();
        });
    });

    describe('next', () => {
        const mockModuleData = {
            data: [
                { sentence: "Q1", options: ["A", "B"], correct: "A", explanation: "Exp1" },
                { sentence: "Q2", options: ["C", "D"], correct: "C", explanation: "Exp2" },
                { sentence: "Q3", options: ["E", "F"], correct: "E", explanation: "Exp3" },
            ],
        };

        beforeEach(() => {
            quizModule.init(mockModuleData);
            quizModule.render();
            jest.clearAllMocks(); // Clear mocks after init/render
        });

        test('should increment currentIndex and re-render if not at the end and current question is answered', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            quizModule.handleAnswer('A'); // Answer Q1
            jest.clearAllMocks();

            quizModule.next();
            expect(quizModule.currentIndex).toBe(1);
            expect(renderSpy).toHaveBeenCalled();
            expect(quizModule.scoreFrozen).toBe(false);
            expect(quizModule.isViewingHistory).toBe(false);
            renderSpy.mockRestore();
        });

        test('should navigate forward in history if already viewing history', () => {
            const renderHistoryStateSpy = jest.spyOn(quizModule, 'renderHistoryState');
            quizModule.handleAnswer('A'); // Answer Q1
            quizModule.currentIndex = 1;
            quizModule.handleAnswer('C'); // Answer Q2
            jest.clearAllMocks();

            quizModule.isViewingHistory = true;
            quizModule.historyPointer = 0; // Currently viewing Q1 history

            quizModule.next(); // Go forward to Q2 history
            expect(quizModule.historyPointer).toBe(1);
            expect(renderHistoryStateSpy).toHaveBeenCalled();
            renderHistoryStateSpy.mockRestore();
        });

        test('should exit history viewing mode and go to next question if at end of history', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            quizModule.handleAnswer('A'); // Answer Q1
            quizModule.currentIndex = 1;
            quizModule.handleAnswer('C'); // Answer Q2
            jest.clearAllMocks();

            quizModule.isViewingHistory = true;
            quizModule.historyPointer = 1; // Currently viewing Q2 history (end of history)

            quizModule.next(); // Should go to next unanswered question (Q3)
            expect(quizModule.isViewingHistory).toBe(false);
            expect(quizModule.scoreFrozen).toBe(false);
            expect(quizModule.currentIndex).toBe(2);
            expect(renderSpy).toHaveBeenCalled();
            renderSpy.mockRestore();
        });

        test('should call showFinalScore if at the end and current question is answered', () => {
            const showFinalScoreSpy = jest.spyOn(quizModule, 'showFinalScore');
            quizModule.currentIndex = mockModuleData.data.length - 1; // Last question
            quizModule.handleAnswer('E'); // Answer last question
            jest.clearAllMocks();

            quizModule.next();
            expect(showFinalScoreSpy).toHaveBeenCalled();
            showFinalScoreSpy.mockRestore();
        });

        test('should do nothing if current question is not answered', () => {
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

        test('should call updateNavigationButtons', () => {
            const updateNavButtonsSpy = jest.spyOn(quizModule, 'updateNavigationButtons');
            quizModule.handleAnswer('A'); // Simulate answering a question
            jest.clearAllMocks(); // Clear handleAnswer's call to updateNavButtons
            quizModule.next();
            expect(updateNavButtonsSpy).toHaveBeenCalled();
            updateNavButtonsSpy.mockRestore();
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
            jest.clearAllMocks(); // Clear mocks after init/render/handleAnswer
        });

        test('should revert UI, session score, current index, remove from history, and re-render', () => {
            const renderSpy = jest.spyOn(quizModule, 'render');
            quizModule.undo();

            expect(quizModule.history.length).toBe(0); // History should be empty
            expect(quizModule.historyPointer).toBe(-1);
            expect(quizModule.scoreFrozen).toBe(false); // Score is no longer frozen
            expect(quizModule.isViewingHistory).toBe(false);
            expect(document.getElementById('feedback-container')).toBeEmptyDOMElement();
            
            // Check if options are re-enabled and styles removed
            document.querySelectorAll('[data-option]').forEach(button => {
                expect(button).not.toBeDisabled();
                expect(button).not.toHaveClass('bg-green-500', 'text-white', 'bg-red-500', 'bg-white');
                expect(button).toHaveClass('bg-gray-100', 'hover:bg-gray-200');
            });
            expect(quizModule.sessionScore.correct).toBe(0);
            expect(quizModule.sessionScore.incorrect).toBe(0);
            expect(quizModule.currentIndex).toBe(0);
            expect(renderSpy).toHaveBeenCalled();
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 0, mockModuleData.data.length);
            renderSpy.mockRestore();
        });

        test('should do nothing if historyPointer is -1', () => {
            quizModule.history = []; // Simulate no history
            quizModule.historyPointer = -1;
            jest.clearAllMocks(); // Clear mocks from beforeEach setup
            const updateSessionScoreDisplaySpy = jest.spyOn(mockGameCallbacks, 'updateSessionScoreDisplay');
            quizModule.undo();
            expect(quizModule.historyPointer).toBe(-1);
            expect(updateSessionScoreDisplaySpy).not.toHaveBeenCalled();
            updateSessionScoreDisplaySpy.mockRestore();
        });

        test('should do nothing if isViewingHistory is true', () => {
            quizModule.isViewingHistory = true;
            const renderSpy = jest.spyOn(quizModule, 'render');
            quizModule.undo();
            expect(renderSpy).not.toHaveBeenCalled();
            expect(quizModule.history.length).toBe(1); // History should remain unchanged
            expect(quizModule.historyPointer).toBe(0); // Pointer should remain unchanged
            renderSpy.mockRestore();
        });

        test('should call updateNavigationButtons', () => {
            const updateNavButtonsSpy = jest.spyOn(quizModule, 'updateNavigationButtons');
            quizModule.undo();
            expect(updateNavButtonsSpy).toHaveBeenCalled();
            updateNavButtonsSpy.mockRestore();
        });
    });

    describe('renderHistoryState', () => {
        const mockModuleData = {
            data: [
                { sentence: "Q1 ______", options: ["A", "B"], correct: "A", explanation: "Exp1" },
                { sentence: "Q2 ______", options: ["C", "D"], correct: "C", explanation: "Exp2" },
            ],
        };

        beforeEach(() => {
            quizModule.init(mockModuleData);
            quizModule.render();
            quizModule.handleAnswer('A'); // Answer Q1 correctly
            quizModule.currentIndex = 1;
            quizModule.handleAnswer('D'); // Answer Q2 incorrectly
            jest.clearAllMocks(); // Clear mocks after setup
        });

        test('should render the correct question from history', () => {
            quizModule.historyPointer = 0; // Point to Q1 history
            quizModule.renderHistoryState();
            expect(quizModule.currentIndex).toBe(0);
            expect(document.getElementById('quiz-question')).toHaveTextContent('Q1');
        });

        test('should set scoreFrozen to true and isViewingHistory to true', () => {
            quizModule.historyPointer = 0;
            quizModule.renderHistoryState();
            expect(quizModule.scoreFrozen).toBe(true);
            expect(quizModule.isViewingHistory).toBe(true);
        });

        test('should display selected and correct options with appropriate styling for correct answer', () => {
            quizModule.historyPointer = 0; // Point to Q1 history (correct answer A)
            quizModule.renderHistoryState();

            const optionA = document.querySelector('[data-option="A"]');
            const optionB = document.querySelector('[data-option="B"]');

            expect(optionA).toHaveClass('bg-green-500', 'text-white');
            expect(optionB).toHaveClass('bg-white');
            expect(optionA).toBeDisabled();
            expect(optionB).toBeDisabled();
        });

        test('should display selected and correct options with appropriate styling for incorrect answer', () => {
            quizModule.historyPointer = 1; // Point to Q2 history (incorrect answer D, correct C)
            quizModule.renderHistoryState();

            const optionC = document.querySelector('[data-option="C"]');
            const optionD = document.querySelector('[data-option="D"]');

            expect(optionD).toHaveClass('bg-red-500', 'text-white');
            expect(optionC).toHaveClass('bg-green-500', 'text-white');
            expect(optionC).toBeDisabled();
            expect(optionD).toBeDisabled();
        });

        test('should display feedback HTML from history entry', () => {
            quizModule.historyPointer = 0; // Point to Q1 history
            quizModule.renderHistoryState();
            expect(document.getElementById('feedback-container')).toHaveTextContent('Exp1');

            quizModule.historyPointer = 1; // Point to Q2 history
            quizModule.renderHistoryState();
            expect(document.getElementById('feedback-container')).toHaveTextContent('Exp2');
        });

        test('should update session score display to reflect score at that history point', () => {
            quizModule.historyPointer = 0; // Point to Q1 history (score before Q1 was 0,0)
            quizModule.renderHistoryState();
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 0, mockModuleData.data.length);

            mockGameCallbacks.updateSessionScoreDisplay.mockClear();
            quizModule.historyPointer = 1; // Point to Q2 history (score before Q2 was 1,0)
            quizModule.renderHistoryState();
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(1, 0, mockModuleData.data.length);
        });

        test('should call updateNavigationButtons', () => {
            const updateNavButtonsSpy = jest.spyOn(quizModule, 'updateNavigationButtons');
            quizModule.historyPointer = 0;
            quizModule.renderHistoryState();
            expect(updateNavButtonsSpy).toHaveBeenCalled();
            updateNavButtonsSpy.mockRestore();
        });

        test('should log error and fallback if historyPointer is invalid', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const renderSpy = jest.spyOn(quizModule, 'render');

            quizModule.historyPointer = -1; // Invalid
            quizModule.renderHistoryState();
            expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid history pointer for rendering history state.");
            expect(quizModule.isViewingHistory).toBe(false);
            expect(renderSpy).toHaveBeenCalled(); // Fallback to normal render
            consoleErrorSpy.mockRestore();
            renderSpy.mockRestore();
        });
    });

    describe('updateNavigationButtons', () => {
        const mockModuleData = {
            data: [
                { sentence: "Q1", options: ["A", "B"], correct: "A", explanation: "Exp1" },
                { sentence: "Q2", options: ["C", "D"], correct: "C", explanation: "Exp2" },
                { sentence: "Q3", options: ["E", "F"], correct: "E", explanation: "Exp3" },
            ],
        };

        beforeEach(() => {
            quizModule.init(mockModuleData);
            quizModule.render();
            jest.clearAllMocks();
        });

        test('should disable prev and undo buttons at start of quiz (normal mode)', () => {
            quizModule.currentIndex = 0;
            quizModule.isViewingHistory = false;
            quizModule.history = [];
            quizModule.historyPointer = -1;
            quizModule.updateNavigationButtons();
            expect(document.getElementById('prev-btn')).toBeDisabled();
            expect(document.getElementById('undo-btn')).toBeDisabled();
            expect(document.getElementById('next-btn')).toBeDisabled(); // Next should be disabled if not answered
        });

        test('should enable prev and undo buttons after answering a question (normal mode)', () => {
            quizModule.handleAnswer('A'); // Answer Q1
            quizModule.updateNavigationButtons();
            expect(document.getElementById('prev-btn')).not.toBeDisabled();
            expect(document.getElementById('undo-btn')).not.toBeDisabled();
            expect(document.getElementById('next-btn')).not.toBeDisabled();
        });

        test('should disable next button if current question is unanswered', () => {
            quizModule.currentIndex = 0;
            quizModule.isViewingHistory = false;
            // Options are not disabled by default
            quizModule.updateNavigationButtons();
            expect(document.getElementById('next-btn')).toBeDisabled();
        });

        test('should enable next button if current question is answered', () => {
            quizModule.handleAnswer('A'); // Answer Q1
            quizModule.updateNavigationButtons();
            expect(document.getElementById('next-btn')).not.toBeDisabled();
        });

        test('should disable undo button if not on the last action of the current question', () => {
            quizModule.handleAnswer('A'); // Q1 answered
            quizModule.currentIndex = 1;
            quizModule.render(); // Move to Q2
            quizModule.updateNavigationButtons();
            expect(document.getElementById('undo-btn')).toBeDisabled(); // Undo should be disabled as we are on Q2, not Q1
        });

        test('should disable undo button if history is empty', () => {
            quizModule.history = [];
            quizModule.historyPointer = -1;
            quizModule.updateNavigationButtons();
            expect(document.getElementById('undo-btn')).toBeDisabled();
        });

        test('should disable undo button when in history viewing mode', () => {
            quizModule.handleAnswer('A'); // Answer Q1
            quizModule.isViewingHistory = true;
            quizModule.historyPointer = 0;
            quizModule.updateNavigationButtons();
            expect(document.getElementById('undo-btn')).toBeDisabled();
        });

        test('should disable prev button at beginning of history viewing mode', () => {
            quizModule.handleAnswer('A'); // Answer Q1
            quizModule.currentIndex = 1;
            quizModule.handleAnswer('C'); // Answer Q2
            quizModule.isViewingHistory = true;
            quizModule.historyPointer = 0; // Viewing Q1 history
            quizModule.updateNavigationButtons();
            expect(document.getElementById('prev-btn')).toBeDisabled();
            expect(document.getElementById('next-btn')).not.toBeDisabled();
        });

        test('should disable next button at end of history viewing mode', () => {
            quizModule.handleAnswer('A'); // Answer Q1
            quizModule.currentIndex = 1;
            quizModule.handleAnswer('C'); // Answer Q2
            quizModule.isViewingHistory = true;
            quizModule.historyPointer = 1; // Viewing Q2 history
            quizModule.updateNavigationButtons();
            expect(document.getElementById('prev-btn')).not.toBeDisabled();
            expect(document.getElementById('next-btn')).toBeDisabled();
        });

        test('should enable both prev and next buttons in middle of history viewing mode', () => {
            quizModule.handleAnswer('A'); // Answer Q1
            quizModule.currentIndex = 1;
            quizModule.handleAnswer('C'); // Answer Q2
            quizModule.currentIndex = 2;
            quizModule.handleAnswer('E'); // Answer Q3
            quizModule.isViewingHistory = true;
            quizModule.historyPointer = 1; // Viewing Q2 history
            quizModule.updateNavigationButtons();
            expect(document.getElementById('prev-btn')).not.toBeDisabled();
            expect(document.getElementById('next-btn')).not.toBeDisabled();
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

        test('should update feedback container based on history if not empty and correct (normal mode)', () => {
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

            quizModule.history = [{ index: 0, isCorrect: true, selectedOption: 'A', correctAnswer: 'A', feedbackHtml: '<p>Exp1</p>', sessionScoreBefore: { correct: 0, incorrect: 0 } }];
            quizModule.historyPointer = 0;
            quizModule.isViewingHistory = false;
            quizModule.updateText();
            expect(document.getElementById('feedback-container')).toHaveTextContent('Exp1');
        });

        test('should update feedback container based on history if not empty and incorrect (normal mode)', () => {
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

            quizModule.history = [{ index: 0, isCorrect: false, selectedOption: 'B', correctAnswer: 'A', feedbackHtml: '<p>Exp1</p>', sessionScoreBefore: { correct: 0, incorrect: 0 } }];
            quizModule.historyPointer = 0;
            quizModule.isViewingHistory = false;
            quizModule.updateText();
            expect(document.getElementById('feedback-container')).toHaveTextContent('Exp1');
        });

        test('should update feedback container when in history viewing mode', () => {
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

            quizModule.history = [
                { index: 0, isCorrect: true, selectedOption: 'A', correctAnswer: 'A', feedbackHtml: '<p>Exp1</p>', sessionScoreBefore: { correct: 0, incorrect: 0 } },
                { index: 1, isCorrect: false, selectedOption: 'D', correctAnswer: 'C', feedbackHtml: '<p>Exp2</p>', sessionScoreBefore: { correct: 1, incorrect: 0 } }
            ];
            quizModule.historyPointer = 1; // Point to Q2 history
            quizModule.isViewingHistory = true;
            quizModule.updateText();
            expect(document.getElementById('feedback-container')).toHaveTextContent('Exp2');
        });

        test('should clear feedback container if history is empty or not relevant', () => {
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
            quizModule.historyPointer = -1;
            quizModule.isViewingHistory = false;
            quizModule.updateText();
            expect(document.getElementById('feedback-container')).toBeEmptyDOMElement();
        });
    });
});
