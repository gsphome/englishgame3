import CompletionModule from '../modules/CompletionModule';
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

describe('CompletionModule', () => {
    let completionModule;
    let appContainer;
    let sessionScoreDisplay;
    let originalReplace;
    let originalGetElementById;

    // Mock inputElement and its properties/methods
    const mockInputElement = {
        value: '',
        disabled: false,
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
        },
        focus: jest.fn(),
    };

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

        // Store original getElementById and then mock it globally
        originalGetElementById = document.getElementById;
        jest.spyOn(document, 'getElementById').mockImplementation((id) => {
            if (id === 'completion-input') {
                return mockInputElement;
            } else {
                return originalGetElementById.call(document, id);
            }
        });

        // Store original replace and then mock it
        originalReplace = String.prototype.replace;
        jest.spyOn(String.prototype, 'replace').mockImplementation(function(searchValue, replaceValue) {
            if (searchValue === '______') {
                // Simplified mock: just return a string with the input tag
                return `Test sentence with <input type="text" id="completion-input" />`;
            }
            return originalReplace.apply(this, arguments);
        });

        completionModule = new CompletionModule(mockAuth, mockMessages, mockGameCallbacks);
    });

    afterEach(() => {
        // Restore original functions after each test
        jest.restoreAllMocks();
    });

    test('should initialize with correct properties in constructor', () => {
        expect(completionModule.auth).toBe(mockAuth);
        expect(completionModule.MESSAGES).toBe(mockMessages);
        expect(completionModule.gameCallbacks).toBe(mockGameCallbacks);
        expect(completionModule.currentIndex).toBe(0);
        expect(completionModule.sessionScore).toEqual({ correct: 0, incorrect: 0 });
        expect(completionModule.history).toEqual([]);
        expect(completionModule.moduleData).toBeNull();
        expect(completionModule.appContainer).toBeNull(); // appContainer is set in init, not constructor
    });

    describe('init', () => {
        const mockModuleData = {
            data: [
                { sentence: "Test ____.", correct: "answer1", explanation: "Exp1" },
                { sentence: "Another ____.", correct: "answer2", explanation: "Exp2" },
            ],
        };

        test('should initialize module data and app container', () => {
            completionModule.init(mockModuleData);

            expect(completionModule.currentIndex).toBe(0);
            expect(completionModule.sessionScore).toEqual({ correct: 0, incorrect: 0 });
            expect(completionModule.moduleData).toBe(mockModuleData);
            expect(completionModule.appContainer).toBe(appContainer);
            expect(sessionScoreDisplay).not.toHaveClass('hidden');
        });

        test('should shuffle module data if randomMode is true', () => {
            mockGameCallbacks.randomMode = true;
            mockGameCallbacks.shuffleArray.mockReturnValueOnce([...mockModuleData.data].reverse()); // Mock shuffle behavior

            // Pass a copy of the module data to avoid modifying the original mockModuleData
            completionModule.init({ ...mockModuleData, data: [...mockModuleData.data] });

            expect(mockGameCallbacks.shuffleArray).toHaveBeenCalledWith(expect.arrayContaining(mockModuleData.data));
            expect(completionModule.moduleData.data).toEqual([...mockModuleData.data].reverse());
            mockGameCallbacks.randomMode = false; // Reset for other tests
        });

        test('should not shuffle module data if randomMode is false', () => {
            completionModule.init(mockModuleData);
            expect(mockGameCallbacks.shuffleArray).not.toHaveBeenCalled();
            expect(completionModule.moduleData.data).toEqual(mockModuleData.data);
        });

        test('should call render', () => {
            const renderSpy = jest.spyOn(completionModule, 'render');
            completionModule.init(mockModuleData);
            expect(renderSpy).toHaveBeenCalled();
            renderSpy.mockRestore();
        });
    });

    describe('render', () => {
        const mockModuleData = {
            data: [
                { sentence: "Test ____.", correct: "answer1", explanation: "Exp1", tip: "Tip1" },
                { sentence: "Another ____.", correct: "answer2", explanation: "Exp2" },
            ],
        };

        beforeEach(() => {
            // Clear appContainer before each render test to simulate initial render
            document.body.innerHTML = `
                <div id="app-container"></div>
                <div id="session-score-display" class="hidden"></div>
            `;
            appContainer = document.getElementById('app-container');
            completionModule.appContainer = appContainer; // Manually set appContainer for render tests
            completionModule.moduleData = mockModuleData;
        });

        test('should call renderMenu and log error if moduleData is invalid or empty', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            completionModule.moduleData = null;
            completionModule.render();
            expect(consoleErrorSpy).toHaveBeenCalledWith("Completion module data is invalid or empty.");
            expect(mockGameCallbacks.renderMenu).toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });

        test('should render initial completion container if it does not exist', () => {
            completionModule.render();
            expect(appContainer).not.toHaveClass('main-menu-active');
            expect(document.getElementById('completion-container')).toBeInTheDocument();
            expect(document.getElementById('completion-question')).toBeInTheDocument();
            expect(document.getElementById('completion-input')).toBe(mockInputElement); // Expect our mock element
            expect(document.getElementById('feedback-container')).toBeInTheDocument();
            expect(document.getElementById('undo-btn')).toBeInTheDocument();
            expect(document.getElementById('prev-btn')).toBeInTheDocument();
            expect(document.getElementById('next-btn')).toBeInTheDocument();
            expect(document.getElementById('back-to-menu-completion-btn')).toBeInTheDocument();

            expect(mockInputElement.focus).toHaveBeenCalled();
            expect(mockInputElement.classList.remove).toHaveBeenCalledWith('text-green-500', 'text-red-500');
            expect(mockInputElement.value).toBe('');
            expect(mockInputElement.disabled).toBe(false);
        });

        test('should update question and input field for every render', () => {
            // First render to create the elements
            completionModule.render();

            // Re-fetch questionElement after the first render to ensure it's the updated one
            let questionElement = document.getElementById('completion-question');
            const feedbackContainer = document.getElementById('feedback-container');

            // Re-render to test update logic
            completionModule.render();

            // Re-fetch questionElement again after the second render
            questionElement = document.getElementById('completion-question');

            expect(questionElement.innerHTML).toContain('<input type="text" id="completion-input"');
            expect(mockInputElement.value).toBe('');
            expect(mockInputElement.disabled).toBe(false);
            expect(mockInputElement.classList.remove).toHaveBeenCalledWith('text-green-500', 'text-red-500');
            expect(mockInputElement.focus).toHaveBeenCalled();
            expect(feedbackContainer.innerHTML).toBe('');
        });

        test('should display tip if questionData has a tip', () => {
            completionModule.render();
            const completionTipElement = document.getElementById('completion-tip');
            expect(completionTipElement).toBeInTheDocument();
            expect(completionTipElement).not.toHaveClass('hidden');
            expect(completionTipElement.textContent).toBe('Tip: Tip1');
        });

        test('should hide tip if questionData does not have a tip', () => {
            // Ensure the tip element is present in the DOM before calling render
            // This simulates the scenario where the tip was present for a previous question
            // and now needs to be hidden.
            document.body.innerHTML = `
                <div id="app-container">
                    <div id="completion-container">
                        <p id="completion-question"></p>
                        <p id="completion-tip" class="text-lg text-gray-500 mb-4"></p>
                        <div id="feedback-container"></div>
                    </div>
                </div>
                <div id="session-score-display" class="hidden"></div>
            `;
            completionModule.appContainer = document.getElementById('app-container');
            completionModule.moduleData = mockModuleData;
            completionModule.currentIndex = 1; // Question without tip
            completionModule.render();
            const completionTipElement = document.getElementById('completion-tip');
            expect(completionTipElement).toBeInTheDocument();
            expect(completionTipElement).toHaveClass('hidden');
        });

        test('should attach event listeners on initial render', () => {
            // Mock addEventListener to check if it's called
            const addEventListenerSpy = jest.spyOn(Element.prototype, 'addEventListener');

            completionModule.render();

            expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            expect(addEventListenerSpy).toHaveBeenCalledTimes(4); // undo, prev, next, back-to-menu

            addEventListenerSpy.mockRestore();
        });
    });

    describe('handleAnswer', () => {
        const mockModuleData = {
            data: [
                { sentence: "Test ____.", correct: "answer1", explanation: "Exp1" },
                { sentence: "Another ____.", correct: "answer2", explanation: "Exp2" },
            ],
        };

        beforeEach(() => {
            completionModule.moduleData = mockModuleData;
            completionModule.appContainer = document.getElementById('app-container');
            // Ensure feedback-container exists for handleAnswer tests
            document.body.innerHTML = `
                <div id="app-container">
                    <div id="feedback-container"></div>
                </div>
            `;
            // Reset mockInputElement properties before each test in this describe block
            mockInputElement.value = '';
            mockInputElement.disabled = false;
            mockInputElement.classList.add.mockClear();
            mockInputElement.classList.remove.mockClear();
        });

        test('should handle correct answer', () => {
            mockInputElement.value = 'answer1';
            completionModule.handleAnswer();

            expect(completionModule.sessionScore.correct).toBe(1);
            expect(completionModule.sessionScore.incorrect).toBe(0);
            expect(mockAuth.updateGlobalScore).toHaveBeenCalledWith({ correct: 1, incorrect: 0 });
            expect(mockInputElement.classList.add).toHaveBeenCalledWith('text-green-500');
            expect(document.getElementById('feedback-container').innerHTML).toContain('Correct Answer: <strong>answer1</strong>');
            expect(document.getElementById('feedback-container').innerHTML).toContain('Exp1');
            expect(mockInputElement.disabled).toBe(true);
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(1, 0, mockModuleData.data.length);
            expect(completionModule.lastFeedback).toEqual({ isCorrect: true, correct: "answer1", explanation: "Exp1", index: 0, userAnswer: "answer1" });
        });

        test('should handle incorrect answer', () => {
            mockInputElement.value = 'wrong answer';
            completionModule.handleAnswer();

            expect(completionModule.sessionScore.correct).toBe(0);
            expect(completionModule.sessionScore.incorrect).toBe(1);
            expect(mockAuth.updateGlobalScore).toHaveBeenCalledWith({ correct: 0, incorrect: 1 });
            expect(mockInputElement.classList.add).toHaveBeenCalledWith('text-red-500');
            expect(document.getElementById('feedback-container').innerHTML).toContain('Correct Answer: <strong>answer1</strong>');
            expect(document.getElementById('feedback-container').innerHTML).toContain('Exp1');
            expect(mockInputElement.disabled).toBe(true);
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 1, mockModuleData.data.length);
            expect(completionModule.lastFeedback).toEqual({ isCorrect: false, correct: "answer1", explanation: "Exp1", index: 0, userAnswer: "wrong answer" });
        });

        test('should do nothing if input is empty', () => {
            mockInputElement.value = '';
            completionModule.handleAnswer();

            expect(completionModule.sessionScore.correct).toBe(0);
            expect(completionModule.sessionScore.incorrect).toBe(0);
            expect(mockAuth.updateGlobalScore).not.toHaveBeenCalled();
            expect(mockInputElement.classList.add).not.toHaveBeenCalled();
            expect(document.getElementById('feedback-container').innerHTML).toBe('');
            expect(mockInputElement.disabled).toBe(false); // Should remain false
            expect(mockGameCallbacks.updateSessionScoreDisplay).not.toHaveBeenCalled();
        });
    });

    describe('navigation and score', () => {
        const mockModuleData = {
            data: [
                { sentence: "Q1 ____.", correct: "A1", explanation: "Exp1" },
                { sentence: "Q2 ____.", correct: "A2", explanation: "Exp2" },
                { sentence: "Q3 ____.", correct: "A3", explanation: "Exp3" },
            ],
        };

        beforeEach(() => {
            completionModule.moduleData = mockModuleData;
            completionModule.appContainer = document.getElementById('app-container');
            completionModule.sessionScore = { correct: 0, incorrect: 0 };
            completionModule.currentIndex = 0;
            completionModule.history = [];
            jest.spyOn(completionModule, 'render');
            jest.spyOn(completionModule, 'showFinalScore');

            // Ensure feedback-container and other buttons are present for handleAnswer calls within this block
            document.body.innerHTML = `
                <div id="app-container">
                    <div id="completion-container">
                        <p id="completion-question"></p>
                        <div id="feedback-container"></div>
                        <button id="undo-btn"></button>
                        <button id="prev-btn"></button>
                        <button id="next-btn"></button>
                        <button id="back-to-menu-completion-btn"></button>
                    </div>
                </div>
            `;
        });

        describe('undo', () => {
            test('should undo last correct action', () => {
                completionModule.sessionScore.correct = 1;
                completionModule.history.push({ isCorrect: true, index: 0 });
                completionModule.undo();

                expect(completionModule.sessionScore.correct).toBe(0);
                expect(mockAuth.updateGlobalScore).toHaveBeenCalledWith({ correct: -1, incorrect: 0 });
                expect(completionModule.currentIndex).toBe(0);
                expect(completionModule.render).toHaveBeenCalled();
                expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 0, mockModuleData.data.length);
            });

            test('should undo last incorrect action', () => {
                completionModule.sessionScore.incorrect = 1;
                completionModule.history.push({ isCorrect: false, index: 0 });
                completionModule.undo();

                expect(completionModule.sessionScore.incorrect).toBe(0);
                expect(mockAuth.updateGlobalScore).toHaveBeenCalledWith({ correct: 0, incorrect: -1 });
                expect(completionModule.currentIndex).toBe(0);
                expect(completionModule.render).toHaveBeenCalled();
                expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 0, mockModuleData.data.length);
            });

            test('should do nothing if history is empty', () => {
                completionModule.undo();

                expect(completionModule.sessionScore.correct).toBe(0);
                expect(completionModule.sessionScore.incorrect).toBe(0);
                expect(mockAuth.updateGlobalScore).not.toHaveBeenCalled();
                expect(completionModule.render).not.toHaveBeenCalled();
                expect(mockGameCallbacks.updateSessionScoreDisplay).not.toHaveBeenCalled();
            });
        });

        describe('prev', () => {
            test('should go to previous question if not at the beginning', () => {
                completionModule.currentIndex = 1;
                completionModule.prev();

                expect(completionModule.currentIndex).toBe(0);
                expect(completionModule.render).toHaveBeenCalled();
            });

            test('should do nothing if at the beginning', () => {
                completionModule.currentIndex = 0;
                completionModule.prev();

                expect(completionModule.currentIndex).toBe(0);
                expect(completionModule.render).not.toHaveBeenCalled();
            });
        });

        describe('next', () => {
            test('should go to next question if not at the end', () => {
                completionModule.currentIndex = 0;
                completionModule.next();

                expect(completionModule.currentIndex).toBe(1);
                expect(completionModule.render).toHaveBeenCalled();
                expect(completionModule.showFinalScore).not.toHaveBeenCalled();
            });

            test('should show final score if at the end', () => {
                completionModule.currentIndex = mockModuleData.data.length - 1;
                completionModule.next();

                expect(completionModule.currentIndex).toBe(mockModuleData.data.length - 1);
                expect(completionModule.render).not.toHaveBeenCalled();
                expect(completionModule.showFinalScore).toHaveBeenCalled();
            });
        });

        describe('handleNextAction', () => {
            beforeEach(() => {
                // Ensure mockInputElement is reset for these tests
                mockInputElement.disabled = false;
                mockInputElement.value = 'some value';
                jest.spyOn(completionModule, 'handleAnswer');
                jest.spyOn(completionModule, 'next');
            });

            test('should call handleAnswer if input is enabled', () => {
                mockInputElement.disabled = false;
                completionModule.handleNextAction();
                expect(completionModule.handleAnswer).toHaveBeenCalled();
                expect(completionModule.next).not.toHaveBeenCalled();
            });

            test('should call next if input is disabled', () => {
                mockInputElement.disabled = true;
                completionModule.handleNextAction();
                expect(completionModule.handleAnswer).not.toHaveBeenCalled();
                expect(completionModule.next).toHaveBeenCalled();
            });
        });

        describe('showFinalScore', () => {
            beforeEach(() => {
                completionModule.sessionScore = { correct: 5, incorrect: 2 };
                // Ensure appContainer is clean for initial render of summary
                document.body.innerHTML = `<div id="app-container"></div>`;
                completionModule.appContainer = document.getElementById('app-container');
            });

            test('should render initial summary container', () => {
                completionModule.showFinalScore();

                expect(mockGameCallbacks.renderHeader).toHaveBeenCalled();
                expect(document.getElementById('completion-summary-container')).toBeInTheDocument();
                expect(document.getElementById('completion-summary-title')).toHaveTextContent('sessionScore');
                expect(document.getElementById('completion-summary-correct')).toHaveTextContent('correct: 5');
                expect(document.getElementById('completion-summary-incorrect')).toHaveTextContent('incorrect: 2');
                expect(document.getElementById('completion-summary-back-to-menu-btn')).toBeInTheDocument();
            });

            test('should update existing summary container', () => {
                // Simulate existing summary container
                document.body.innerHTML = `
                    <div id="app-container">
                        <div id="completion-summary-container">
                            <h1 id="completion-summary-title"></h1>
                            <p id="completion-summary-correct"></p>
                            <p id="completion-summary-incorrect"></p>
                            <button id="completion-summary-back-to-menu-btn"></button>
                        </div>
                    </div>
                `;
                completionModule.appContainer = document.getElementById('app-container');
                completionModule.showFinalScore();

                expect(mockGameCallbacks.renderHeader).toHaveBeenCalled();
                expect(document.getElementById('completion-summary-container')).toBeInTheDocument();
                expect(document.getElementById('completion-summary-title')).toHaveTextContent('sessionScore');
                expect(document.getElementById('completion-summary-correct')).toHaveTextContent('correct: 5');
                expect(document.getElementById('completion-summary-incorrect')).toHaveTextContent('incorrect: 2');
                expect(document.getElementById('completion-summary-back-to-menu-btn')).toBeInTheDocument();
            });

            test('should attach event listener to back to menu button', () => {
                const addEventListenerSpy = jest.spyOn(Element.prototype, 'addEventListener');
                completionModule.showFinalScore();
                expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
                addEventListenerSpy.mockRestore();
            });
        });

        describe('updateText', () => {
            const mockModuleData = {
                data: [
                    { sentence: "Q1 ____.", correct: "A1", explanation: "Exp1" },
                ],
            };

            beforeEach(() => {
                completionModule.moduleData = mockModuleData;
                completionModule.currentIndex = 0;
                // Ensure necessary DOM elements are present
                document.body.innerHTML = `
                    <div id="app-container">
                        <p id="completion-question"></p>
                        <div id="feedback-container"></div>
                    </div>
                `;
                completionModule.appContainer = document.getElementById('app-container');
                mockInputElement.value = '';
                mockInputElement.disabled = false;
                mockInputElement.classList.add.mockClear();
                mockInputElement.classList.remove.mockClear();
            });

            test('should restore feedback if lastFeedback exists and matches current index', () => {
                completionModule.lastFeedback = { isCorrect: true, correct: "A1", explanation: "Exp1", index: 0, userAnswer: "A1" };
                completionModule.updateText();

                expect(document.getElementById('feedback-container').innerHTML).toContain('Correct Answer: <strong>A1</strong>');
                expect(document.getElementById('feedback-container').innerHTML).toContain('Exp1');
                expect(mockInputElement.disabled).toBe(true);
                expect(mockInputElement.classList.add).toHaveBeenCalledWith('text-green-500');
                expect(mockInputElement.classList.remove).not.toHaveBeenCalledWith('text-red-500');
            });

            test('should clear feedback if lastFeedback does not exist', () => {
                completionModule.lastFeedback = null;
                completionModule.updateText();

                expect(document.getElementById('feedback-container').innerHTML).toBe('');
                expect(mockInputElement.disabled).toBe(false);
                expect(mockInputElement.classList.remove).toHaveBeenCalledWith('text-green-500', 'text-red-500');
            });

            test('should clear feedback if lastFeedback exists but does not match current index', () => {
                completionModule.lastFeedback = { isCorrect: true, correct: "A1", explanation: "Exp1", index: 1, userAnswer: "A1" };
                completionModule.updateText();

                expect(document.getElementById('feedback-container').innerHTML).toBe('');
                expect(mockInputElement.disabled).toBe(false);
                expect(mockInputElement.classList.remove).toHaveBeenCalledWith('text-green-500', 'text-red-500');
            });
        });
    });
});