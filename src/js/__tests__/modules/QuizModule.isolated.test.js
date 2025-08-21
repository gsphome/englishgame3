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

describe('QuizModule - Isolated handleAnswer tests', () => {
    let quizModule;
    let appContainer;

    const mockModuleData = {
        data: [
            { sentence: "Question 1 ______", options: ["A1", "A2"], correct: "A1", explanation: "Exp1" },
            { sentence: "Question 2 ______", options: ["B1", "B2"], correct: "B1", explanation: "Exp2" },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = `
            <div id="app-container"></div>
            <div id="session-score-display" class="hidden"></div>
        `;
        appContainer = document.getElementById('app-container');
        quizModule = new QuizModule(mockAuth, mockMessages, mockGameCallbacks);
        quizModule.currentIndex = 0;
        quizModule.init(mockModuleData); // Initialize and render the module
    });

    test('should not update score if scoreFrozen is true', () => {
        quizModule.scoreFrozen = true;
        jest.clearAllMocks();
        quizModule.handleAnswer('A1');

        expect(quizModule.sessionScore.correct).toBe(0);
        expect(quizModule.sessionScore.incorrect).toBe(0);
        expect(mockAuth.updateGlobalScore).not.toHaveBeenCalled();
        expect(mockGameCallbacks.updateSessionScoreDisplay).not.toHaveBeenCalled();
    });

    test('should truncate history if historyPointer is not at the end', () => {
        quizModule.handleAnswer('A1'); // Action 1
        quizModule.currentIndex = 1;
        quizModule.render();
        quizModule.handleAnswer('B1'); // Action 2

        quizModule.historyPointer = 0;

        quizModule.currentIndex = 0;
        quizModule.render();
        quizModule.handleAnswer('A2'); // New action for Q1

        expect(quizModule.history.length).toBe(2);
        expect(quizModule.history[0].selectedOption).toBe('A1');
        expect(quizModule.history[1].selectedOption).toBe('A2');
        expect(quizModule.historyPointer).toBe(1);
    });

    test('should handle correct answer: update score and history', () => {
        quizModule.sessionScore = { correct: 0, incorrect: 0 };
        quizModule.handleAnswer('A1');

        expect(quizModule.sessionScore.correct).toBe(1);
        expect(quizModule.sessionScore.incorrect).toBe(0);
        expect(mockAuth.updateGlobalScore).toHaveBeenCalledWith({ correct: 1, incorrect: 0 });
        expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(1, 0, mockModuleData.data.length);

        expect(quizModule.history.length).toBe(1);
        expect(quizModule.history[0].isCorrect).toBe(true);
        expect(quizModule.history[0].selectedOption).toBe('A1');
        expect(quizModule.history[0].correctAnswer).toBe('A1');
    });

    test('should handle incorrect answer: update score and history', () => {
        quizModule.handleAnswer('A2');

        expect(quizModule.sessionScore.correct).toBe(0);
        expect(quizModule.sessionScore.incorrect).toBe(1);
        expect(mockAuth.updateGlobalScore).toHaveBeenCalledWith({ correct: 0, incorrect: 1 });
        expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 1, mockModuleData.data.length);

        expect(quizModule.history.length).toBe(1);
        expect(quizModule.history[0].isCorrect).toBe(false);
        expect(quizModule.history[0].selectedOption).toBe('A2');
        expect(quizModule.history[0].correctAnswer).toBe('A1');
    });

    test('should set isViewingHistory to false when handleAnswer is called', () => {
        quizModule.isViewingHistory = true; // Set to true to ensure it's reset
        quizModule.handleAnswer('A1');
        expect(quizModule.isViewingHistory).toBe(false);
    });
});
