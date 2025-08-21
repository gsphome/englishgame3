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

    describe('handleAnswer', () => {
        const mockModuleData = {
            data: [
                { sentence: "Question 1 ______", options: ["A1", "A2"], correct: "A1", explanation: "Exp1" },
                { sentence: "Question 2 ______", options: ["B1", "B2"], correct: "B1", explanation: "Exp2" },
            ],
        };

        let optionA1, optionA2;

        beforeEach(() => {
            quizModule = new QuizModule(mockAuth, mockMessages, mockGameCallbacks);
            appContainer.innerHTML = '';
            jest.clearAllMocks();
            quizModule.currentIndex = 0;
            quizModule.init(mockModuleData); // Initialize and render the module
            optionA1 = document.querySelector('[data-option="A1"]');
            optionA2 = document.querySelector('[data-option="A2"]');
        });

        test('should not update score if scoreFrozen is true', () => {
            quizModule.scoreFrozen = true;
            jest.clearAllMocks(); // Clear mocks right before the action
            quizModule.handleAnswer('A1');

            expect(quizModule.sessionScore.correct).toBe(0);
            expect(quizModule.sessionScore.incorrect).toBe(0);
            expect(mockAuth.updateGlobalScore).not.toHaveBeenCalled();
            expect(mockGameCallbacks.updateSessionScoreDisplay).not.toHaveBeenCalled();
        });

        test('should truncate history if historyPointer is not at the end', () => {
            // Simulate some history and then going back
            quizModule.handleAnswer('A1'); // Action 1
            quizModule.currentIndex = 1; // Move to next question
            quizModule.render();
            quizModule.handleAnswer('B1'); // Action 2

            // Simulate undoing one action
            quizModule.historyPointer = 0; // Point to Action 1

            // Now, answer a new question (or re-answer current one)
            quizModule.currentIndex = 0; // Go back to first question
            quizModule.render();
            quizModule.handleAnswer('A2'); // New action for Q1

            expect(quizModule.history.length).toBe(2); // Should have Action 1 and new Action for Q1
            expect(quizModule.history[0].selectedOption).toBe('A1');
            expect(quizModule.history[1].selectedOption).toBe('A2');
            expect(quizModule.historyPointer).toBe(1);
        });
    });
});
