import MatchingModule from '../../modules/MatchingModule.js';
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
    showMatchingSummary: jest.fn(),
};

// Mock DOM elements
document.body.innerHTML = `
    <div id="app-container"></div>
    <div id="session-score-display" class="hidden"></div>
`;

describe('MatchingModule', () => {
    let matchingModule;
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

        matchingModule = new MatchingModule(mockAuth, mockMessages, mockGameCallbacks);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should initialize with correct properties in constructor', () => {
        expect(matchingModule.auth).toBe(mockAuth);
        expect(matchingModule.MESSAGES).toBe(mockMessages);
        expect(matchingModule.gameCallbacks).toBe(mockGameCallbacks);
        expect(matchingModule.currentIndex).toBe(0);
        expect(matchingModule.moduleData).toBeNull();
        expect(matchingModule.appContainer).toBeNull();
        expect(matchingModule.sessionScore).toEqual({ correct: 0, incorrect: 0 });
        expect(matchingModule.selectedTerm).toBeNull();
        expect(matchingModule.selectedDefinition).toBeNull();
        expect(matchingModule.matchedPairs).toEqual([]);
        expect(matchingModule.allPairs).toEqual([]);
        expect(matchingModule.feedbackActive).toBe(false);
    });

    describe('init', () => {
        const mockModuleData = {
            data: [
                { id: '1', term: "Term 1", definition: "Definition 1" },
                { id: '2', term: "Term 2", definition: "Definition 2" },
                { id: '3', term: "Term 3", definition: "Definition 3" },
                { id: '4', term: "Term 4", definition: "Definition 4" },
                { id: '5', term: "Term 5", definition: "Definition 5" },
                { id: '6', term: "Term 6", definition: "Definition 6" }, // Extra data
            ],
        };

        beforeEach(() => {
            mockGameCallbacks.randomMode = false; // Reset randomMode for each test in this block
        });

        test('should initialize module data and app container', () => {
            matchingModule.init(mockModuleData);

            expect(matchingModule.currentIndex).toBe(0);
            expect(matchingModule.moduleData.data.length).toBe(3); // Should slice to 3
            expect(matchingModule.appContainer).toBe(appContainer);
            expect(matchingModule.sessionScore).toEqual({ correct: 0, incorrect: 0 });
            expect(matchingModule.selectedTerm).toBeNull();
            expect(matchingModule.selectedDefinition).toBeNull();
            expect(matchingModule.matchedPairs).toEqual([]);
            expect(matchingModule.feedbackActive).toBe(false);
        });

        test('should shuffle module data if randomMode is true', () => {
            mockGameCallbacks.randomMode = true;
            mockGameCallbacks.shuffleArray.mockImplementation((arr) => [...arr].reverse()); // Mock shuffle behavior

            matchingModule.init({ ...mockModuleData, data: [...mockModuleData.data] });

            expect(mockGameCallbacks.shuffleArray).toHaveBeenCalledWith(expect.arrayContaining(mockModuleData.data.slice(0, 3)));
            expect(matchingModule.moduleData.data).toEqual(mockModuleData.data.slice(0, 3).reverse());
        });

        test('should not shuffle module data if randomMode is false', () => {
            matchingModule.init(mockModuleData);
            expect(mockGameCallbacks.shuffleArray).not.toHaveBeenCalled();
            expect(matchingModule.moduleData.data).toEqual(mockModuleData.data.slice(0, 3));
        });

        test('should call render', () => {
            const renderSpy = jest.spyOn(matchingModule, 'render');
            matchingModule.init(mockModuleData);
            expect(renderSpy).toHaveBeenCalled();
            renderSpy.mockRestore();
        });
    });

    describe('render', () => {
        const mockModuleData = {
            data: [
                { id: '1', term: "Term 1", definition: "Definition 1" },
                { id: '2', term: "Term 2", definition: "Definition 2" },
            ],
        };

        beforeEach(() => {
            matchingModule.appContainer = appContainer;
            matchingModule.moduleData = mockModuleData;
        });

        test('should call renderMenu and log error if moduleData is invalid or empty', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            matchingModule.moduleData = null;
            matchingModule.render();
            expect(consoleErrorSpy).toHaveBeenCalledWith("Matching module data is invalid or empty.");
            expect(mockGameCallbacks.renderMenu).toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });

        test('should render matching container and columns', () => {
            matchingModule.render();
            expect(appContainer).not.toHaveClass('main-menu-active');
            expect(document.getElementById('matching-container')).toBeInTheDocument();
            expect(document.getElementById('terms-column')).toBeInTheDocument();
            expect(document.getElementById('definitions-column')).toBeInTheDocument();
        });

        test('should render terms and definitions with correct data and attributes', () => {
            matchingModule.render();
            const term1 = document.getElementById('term-1');
            const def1 = document.getElementById('definition-1');

            expect(term1).toBeInTheDocument();
            expect(term1).toHaveTextContent('Term 1');
            expect(term1).toHaveAttribute('data-id', '1');
            expect(term1).toHaveAttribute('data-type', 'term');

            expect(def1).toBeInTheDocument();
            expect(def1).toHaveTextContent('Definition 1');
            expect(def1).toHaveAttribute('data-id', '1');
            expect(def1).toHaveAttribute('data-type', 'definition');
        });

        test('should attach event listeners to buttons and items', () => {
            const addEventListenerSpy = jest.spyOn(Element.prototype, 'addEventListener');
            matchingModule.render();

            // Check for item click listeners (terms and definitions)
            expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            // Check for button click listeners
            expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));

            // Expecting listeners for: undo, check, reset, back-to-menu, and each term/definition item
            // 4 buttons + 2 terms + 2 definitions = 8 listeners
            expect(addEventListenerSpy).toHaveBeenCalledTimes(8);
            addEventListenerSpy.mockRestore();
        });

        test('should update button and header texts', () => {
            matchingModule.render();
            expect(document.getElementById('undo-matching-btn')).toHaveTextContent('undoButton');
            expect(document.getElementById('check-matching-btn')).toHaveTextContent('checkButton');
            expect(document.getElementById('reset-matching-btn')).toHaveTextContent('resetButton');
            expect(document.getElementById('back-to-menu-matching-btn')).toHaveTextContent('backToMenu');
            expect(document.querySelector('#terms-column h3')).toHaveTextContent('terms');
            expect(document.querySelector('#definitions-column h3')).toHaveTextContent('definitions');
        });

        test('should update session score display', () => {
            matchingModule.render();
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 0, mockModuleData.data.length);
        });

        test('should shuffle terms and definitions if randomMode is true', () => {
            mockGameCallbacks.randomMode = true;
            mockGameCallbacks.shuffleArray.mockImplementation((arr) => [...arr].reverse()); // Mock shuffle behavior

            matchingModule.render();

            const termsColumn = document.getElementById('terms-column');
            const definitionsColumn = document.getElementById('definitions-column');

            // Check if terms are rendered in reversed order
            expect(termsColumn.children[1]).toHaveTextContent('Term 2'); // First term after title
            expect(termsColumn.children[2]).toHaveTextContent('Term 1'); // Second term after title

            // Check if definitions are rendered in reversed order
            expect(definitionsColumn.children[1]).toHaveTextContent('Definition 2'); // First definition after title
            expect(definitionsColumn.children[2]).toHaveTextContent('Definition 1'); // Second definition after title

            expect(mockGameCallbacks.shuffleArray).toHaveBeenCalledTimes(2); // Once for terms, once for definitions
            mockGameCallbacks.randomMode = false; // Reset for other tests
        });
    });

    describe('handleItemClick', () => {
        const mockModuleData = {
            data: [
                { id: '1', term: "Term 1", definition: "Definition 1" },
                { id: '2', term: "Term 2", definition: "Definition 2" },
            ],
        };

        let term1Element, definition1Element, term2Element;

        beforeEach(() => {
            jest.clearAllMocks();
            matchingModule.init(mockModuleData); // Initialize and render the module
            term1Element = document.getElementById('term-1');
            definition1Element = document.getElementById('definition-1');
            term2Element = document.getElementById('term-2');

            // Spy on attemptMatch
            jest.spyOn(matchingModule, 'attemptMatch');
        });

        test('should select a term', () => {
            matchingModule.handleItemClick(term1Element);
            expect(term1Element).toHaveClass('selected');
            expect(matchingModule.selectedTerm).toEqual({ id: '1', element: term1Element });
            expect(matchingModule.selectedDefinition).toBeNull();
            expect(matchingModule.attemptMatch).not.toHaveBeenCalled();
        });

        test('should select a definition', () => {
            matchingModule.handleItemClick(definition1Element);
            expect(definition1Element).toHaveClass('selected');
            expect(matchingModule.selectedDefinition).toEqual({ id: '1', element: definition1Element });
            expect(matchingModule.selectedTerm).toBeNull();
            expect(matchingModule.attemptMatch).not.toHaveBeenCalled();
        });

        test('should deselect previous term when a new term is selected', () => {
            matchingModule.handleItemClick(term1Element); // Select term 1
            expect(term1Element).toHaveClass('selected');

            matchingModule.handleItemClick(term2Element); // Select term 2
            expect(term1Element).not.toHaveClass('selected');
            expect(term2Element).toHaveClass('selected');
            expect(matchingModule.selectedTerm).toEqual({ id: '2', element: term2Element });
            expect(matchingModule.selectedDefinition).toBeNull(); // Ensure definition remains null
        });

        test('should deselect previous definition when a new definition is selected', () => {
            matchingModule.handleItemClick(definition1Element); // Select definition 1
            expect(definition1Element).toHaveClass('selected');

            const definition2Element = document.getElementById('definition-2');
            matchingModule.handleItemClick(definition2Element); // Select definition 2
            expect(definition1Element).not.toHaveClass('selected');
            expect(definition2Element).toHaveClass('selected');
            expect(matchingModule.selectedDefinition).toEqual({ id: '2', element: definition2Element });
            expect(matchingModule.selectedTerm).toBeNull(); // Ensure term remains null
        });

        test('should call attemptMatch when both term and definition are selected', () => {
            matchingModule.handleItemClick(term1Element); // Select term
            matchingModule.handleItemClick(definition1Element); // Select definition
            expect(matchingModule.attemptMatch).toHaveBeenCalled();
        });

        test('should not process click if feedbackActive is true', () => {
            matchingModule.feedbackActive = true;
            matchingModule.handleItemClick(term1Element);
            expect(term1Element).not.toHaveClass('selected');
            expect(matchingModule.selectedTerm).toBeNull();
            expect(matchingModule.attemptMatch).not.toHaveBeenCalled();
        });
    });

    describe('attemptMatch', () => {
        const mockModuleData = {
            data: [
                { id: '1', term: "Term 1", definition: "Definition 1" },
                { id: '2', term: "Term 2", definition: "Definition 2" },
            ],
        };

        let term1Element, definition1Element, term2Element, definition2Element;

        // No beforeEach here, setup done in each test for isolation

        test('should handle correct match', () => {
            // Manual setup for this test
            matchingModule.init(mockModuleData);
            appContainer.innerHTML = `
                <div id="matching-container">
                    <div id="terms-column">
                        <div id="term-1" class="matching-item term" data-id="1" data-type="term">Term 1</div>
                        <div id="term-2" class="matching-item term" data-id="2" data-type="term">Term 2</div>
                    </div>
                    <div id="definitions-column">
                        <div id="definition-1" class="matching-item definition" data-id="1" data-type="definition">Definition 1</div>
                        <div id="definition-2" class="matching-item definition" data-id="2" data-type="definition">Definition 2</div>
                    </div>
                </div>
            `;
            term1Element = document.getElementById('term-1');
            definition1Element = document.getElementById('definition-1');
            term2Element = document.getElementById('term-2');
            definition2Element = document.getElementById('definition-2');

            matchingModule.selectedTerm = { id: '1', element: term1Element };
            matchingModule.selectedDefinition = { id: '1', element: definition1Element };

            const removeEventListenerSpy = jest.spyOn(Element.prototype, 'removeEventListener');

            matchingModule.attemptMatch();

            expect(matchingModule.matchedPairs).toEqual([{ termId: '1', definitionId: '1' }]);
            expect(term1Element).toHaveClass('matched', 'bg-green-200', 'cursor-default');
            expect(term1Element).not.toHaveClass('selected', 'bg-gray-100', 'hover:bg-gray-200');
            expect(definition1Element).toHaveClass('matched', 'bg-green-200', 'cursor-default');
            expect(definition1Element).not.toHaveClass('selected', 'bg-gray-100', 'hover:bg-gray-200');
            expect(matchingModule.sessionScore).toEqual({ correct: 1, incorrect: 0 });
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(1, 0, mockModuleData.data.length);
            expect(matchingModule.selectedTerm).toBeNull();
            expect(matchingModule.selectedDefinition).toBeNull();

            // Verify SVG is added
            expect(term1Element.innerHTML).toContain('<svg');
            expect(definition1Element.innerHTML).toContain('<svg');

            // Verify removeEventListener was called
            expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledTimes(2); // Once for term, once for definition
            removeEventListenerSpy.mockRestore();
        });

        test('should handle incorrect match', (done) => {
            // Manual setup for this test
            matchingModule.init(mockModuleData);
            appContainer.innerHTML = `
                <div id="matching-container">
                    <div id="terms-column">
                        <div id="term-1" class="matching-item term" data-id="1" data-type="term">Term 1</div>
                        <div id="term-2" class="matching-item term" data-id="2" data-type="term">Term 2</div>
                    </div>
                    <div id="definitions-column">
                        <div id="definition-1" class="matching-item definition" data-id="1" data-type="definition">Definition 1</div>
                        <div id="definition-2" class="matching-item definition" data-id="2" data-type="definition">Definition 2</div>
                    </div>
                </div>
            `;
            term1Element = document.getElementById('term-1');
            definition1Element = document.getElementById('definition-1');
            term2Element = document.getElementById('term-2');
            definition2Element = document.getElementById('definition-2');

            matchingModule.selectedTerm = { id: '1', element: term1Element };
            matchingModule.selectedDefinition = { id: '2', element: definition2Element }; // Incorrect match

            matchingModule.attemptMatch();

            expect(matchingModule.matchedPairs).toEqual([]);
            expect(matchingModule.sessionScore).toEqual({ correct: 0, incorrect: 1 });
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 1, mockModuleData.data.length);

            expect(term1Element).toHaveClass('incorrect');
            expect(definition2Element).toHaveClass('incorrect');

            // Expect classes to be removed after timeout
            setTimeout(() => {
                expect(term1Element).not.toHaveClass('incorrect');
                expect(definition2Element).not.toHaveClass('incorrect');
                done();
            }, 500);

            expect(matchingModule.selectedTerm).toBeNull();
            expect(matchingModule.selectedDefinition).toBeNull();
        });

        test('should call showMatchingSummary when all pairs are matched', () => {
            jest.useFakeTimers();
            // Manual setup for this test
            matchingModule.moduleData = {
                data: [
                    { id: '1', term: "Term 1", definition: "Definition 1" },
                    { id: '2', term: "Term 2", definition: "Definition 2" },
                ],
            };
            appContainer.innerHTML = `
                <div id="matching-container">
                    <div id="terms-column">
                        <div id="term-1" class="matching-item term" data-id="1" data-type="term">Term 1</div>
                        <div id="term-2" class="matching-item term" data-id="2" data-type="term">Term 2</div>
                    </div>
                    <div id="definitions-column">
                        <div id="definition-1" class="matching-item definition" data-id="1" data-type="definition">Definition 1</div>
                        <div id="definition-2" class="matching-item definition" data-id="2" data-type="definition">Definition 2</div>
                    </div>
                </div>
            `;
            term1Element = document.getElementById('term-1');
            definition1Element = document.getElementById('definition-1');
            term2Element = document.getElementById('term-2');
            definition2Element = document.getElementById('definition-2');

            // Simulate all but one pair matched
            matchingModule.matchedPairs = [
                { termId: '2', definitionId: '2' },
            ];

            matchingModule.selectedTerm = { id: '1', element: term1Element };
            matchingModule.selectedDefinition = { id: '1', element: definition1Element };

            matchingModule.attemptMatch();

            expect(matchingModule.feedbackActive).toBe(true);
            jest.runAllTimers(); // Advance timers
            expect(mockGameCallbacks.showMatchingSummary).toHaveBeenCalled();
            jest.useRealTimers();
        });

        test('should handle incorrect match', () => {
            jest.useFakeTimers();
            // Manual setup for this test
            matchingModule.init(mockModuleData);
            appContainer.innerHTML = `
                <div id="matching-container">
                    <div id="terms-column">
                        <div id="term-1" class="matching-item term" data-id="1" data-type="term">Term 1</div>
                        <div id="term-2" class="matching-item term" data-id="2" data-type="term">Term 2</div>
                    </div>
                    <div id="definitions-column">
                        <div id="definition-1" class="matching-item definition" data-id="1" data-type="definition">Definition 1</div>
                        <div id="definition-2" class="matching-item definition" data-id="2" data-type="definition">Definition 2</div>
                    </div>
                </div>
            `;
            term1Element = document.getElementById('term-1');
            definition1Element = document.getElementById('definition-1');
            term2Element = document.getElementById('term-2');
            definition2Element = document.getElementById('definition-2');

            matchingModule.selectedTerm = { id: '1', element: term1Element };
            matchingModule.selectedDefinition = { id: '2', element: definition2Element }; // Incorrect match

            matchingModule.attemptMatch();

            expect(matchingModule.matchedPairs).toEqual([]);
            expect(matchingModule.sessionScore).toEqual({ correct: 0, incorrect: 1 });
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 1, mockModuleData.data.length);

            expect(term1Element).toHaveClass('incorrect');
            expect(definition2Element).toHaveClass('incorrect');

            jest.runAllTimers(); // Advance timers

            // Expect classes to be removed after timeout
            expect(term1Element).not.toHaveClass('incorrect');
            expect(definition2Element).not.toHaveClass('incorrect');

            expect(matchingModule.selectedTerm).toBeNull();
            expect(matchingModule.selectedDefinition).toBeNull();
            jest.useRealTimers();
        });
    });

    describe('undo', () => {
        const mockModuleData = {
            data: [
                { id: '1', term: "Term 1", definition: "Definition 1" },
                { id: '2', term: "Term 2", definition: "Definition 2" },
            ],
        };

        let term1Element, definition1Element;

        beforeEach(() => {
            matchingModule.init(mockModuleData);
            appContainer.innerHTML = `
                <div id="matching-container">
                    <div id="terms-column">
                        <div id="term-1" class="matching-item term" data-id="1" data-type="term">Term 1<svg></svg></div>
                    </div>
                    <div id="definitions-column">
                        <div id="definition-1" class="matching-item definition" data-id="1" data-type="definition">Definition 1<svg></svg></div>
                    </div>
                </div>
            `;
            term1Element = document.getElementById('term-1');
            definition1Element = document.getElementById('definition-1');
            matchingModule.matchedPairs = [{ termId: '1', definitionId: '1' }];
            matchingModule.sessionScore.correct = 1;
            mockGameCallbacks.updateSessionScoreDisplay.mockClear(); // Clear calls from init
        });

        test('should undo the last match and restore elements', () => {
            matchingModule.undo();

            expect(matchingModule.matchedPairs).toEqual([]);
            expect(matchingModule.sessionScore.correct).toBe(0);
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 0, mockModuleData.data.length);

            expect(term1Element).not.toHaveClass('matched', 'bg-green-200', 'cursor-default');
            expect(term1Element).toHaveClass('bg-gray-100', 'hover:bg-gray-200', 'cursor-pointer');
            expect(term1Element.innerHTML).not.toContain('<svg'); // Check SVG removal
            expect(definition1Element).not.toHaveClass('matched', 'bg-green-200', 'cursor-default');
            expect(definition1Element).toHaveClass('bg-gray-100', 'hover:bg-gray-200', 'cursor-pointer');
            expect(definition1Element.innerHTML).not.toContain('<svg'); // Check SVG removal
        });

        test('should re-attach event listeners to undone elements', () => {
            const addEventListenerSpy = jest.spyOn(term1Element, 'addEventListener');
            const removeEventListenerSpy = jest.spyOn(term1Element, 'removeEventListener');

            // Simulate a match and then undo
            matchingModule.selectedTerm = { id: '1', element: term1Element };
            matchingModule.selectedDefinition = { id: '1', element: definition1Element };
            matchingModule.attemptMatch(); // This will remove the listener

            expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            removeEventListenerSpy.mockClear(); // Clear the spy for the next assertion

            matchingModule.undo(); // This should re-attach the listener

            expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            addEventListenerSpy.mockRestore();
            removeEventListenerSpy.mockRestore();
        });

        test('should do nothing if no matched pairs', () => {
            matchingModule.matchedPairs = [];
            matchingModule.sessionScore.correct = 0;
            matchingModule.undo();

            expect(matchingModule.matchedPairs).toEqual([]);
            expect(matchingModule.sessionScore.correct).toBe(0);
            expect(mockGameCallbacks.updateSessionScoreDisplay).not.toHaveBeenCalled();
        });

        test('should handle cases where termElement or defElement are null', () => {
            // Mock document.getElementById to return null for specific IDs
            const originalGetElementById = document.getElementById;
            document.getElementById = jest.fn((id) => {
                if (id === 'term-1') return null;
                if (id === 'definition-1') return null;
                return originalGetElementById(id);
            });

            matchingModule.matchedPairs = [{ termId: '1', definitionId: '1' }];
            matchingModule.sessionScore.correct = 1;
            mockGameCallbacks.updateSessionScoreDisplay.mockClear();

            matchingModule.undo();

            expect(matchingModule.matchedPairs).toEqual([]);
            expect(matchingModule.sessionScore.correct).toBe(0);
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 0, mockModuleData.data.length);

            // Restore original document.getElementById
            document.getElementById = originalGetElementById;
        });
    });

    describe('resetGame', () => {
        const mockModuleData = {
            data: [
                { id: '1', term: "Term 1", definition: "Definition 1" },
            ],
        };

        let term1Element, definition1Element;

        beforeEach(() => {
            matchingModule.init(mockModuleData);
            appContainer.innerHTML = `
                <div id="matching-container">
                    <div id="terms-column">
                        <div id="term-1" class="matching-item term matched" data-id="1" data-type="term">Term 1</div>
                    </div>
                    <div id="definitions-column">
                        <div id="definition-1" class="matching-item definition matched" data-id="1" data-type="definition">Definition 1</div>
                    </div>
                </div>
            `;
            term1Element = document.getElementById('term-1');
            definition1Element = document.getElementById('definition-1');
            matchingModule.matchedPairs = [{ termId: '1', definitionId: '1' }];
            matchingModule.sessionScore.correct = 1;
            matchingModule.feedbackActive = true;
            mockGameCallbacks.updateSessionScoreDisplay.mockClear(); // Clear calls from init
        });

        test('should reset game state and element classes', () => {
            matchingModule.resetGame();

            expect(matchingModule.matchedPairs).toEqual([]);
            expect(matchingModule.sessionScore).toEqual({ correct: 0, incorrect: 0 });
            expect(matchingModule.feedbackActive).toBe(false);

            expect(term1Element).not.toHaveClass('matched', 'incorrect', 'cursor-default', 'selected');
            expect(term1Element).toHaveClass('bg-gray-100', 'hover:bg-gray-200', 'cursor-pointer');
            expect(definition1Element).not.toHaveClass('matched', 'incorrect', 'cursor-default', 'selected');
            expect(definition1Element).toHaveClass('bg-gray-100', 'hover:bg-gray-200', 'cursor-pointer');
            expect(mockGameCallbacks.updateSessionScoreDisplay).toHaveBeenCalledWith(0, 0, mockModuleData.data.length);

            // Verify event listeners are re-attached
            const addEventListenerSpy = jest.spyOn(term1Element, 'addEventListener');
            matchingModule.resetGame(); // Call again to trigger re-attachment if not already
            expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            addEventListenerSpy.mockRestore();
        });
    });

    describe('checkAnswers', () => {
        const mockModuleData = {
            data: [
                { id: '1', term: "Term 1", definition: "Definition 1" },
                { id: '2', term: "Term 2", definition: "Definition 2" },
            ],
        };

        beforeEach(() => {
            matchingModule.init(mockModuleData);
            mockGameCallbacks.showMatchingSummary.mockClear();
        });

        test('should call showMatchingSummary if all pairs are matched', () => {
            matchingModule.matchedPairs = [
                { termId: '1', definitionId: '1' },
                { termId: '2', definitionId: '2' },
            ];
            matchingModule.checkAnswers();
            expect(mockGameCallbacks.showMatchingSummary).toHaveBeenCalled();
        });

        test('should do nothing if not all pairs are matched', () => {
            matchingModule.matchedPairs = [
                { termId: '1', definitionId: '1' },
            ];
            matchingModule.checkAnswers();
            expect(mockGameCallbacks.showMatchingSummary).not.toHaveBeenCalled();
        });
    });

    describe('updateText', () => {
        beforeEach(() => {
            // Mock the necessary DOM elements for updateText
            document.body.innerHTML = `
                <button id="back-to-menu-matching-btn"></button>
                <button id="undo-matching-btn"></button>
                <button id="check-matching-btn"></button>
                <button id="reset-matching-btn"></button>
                <div id="terms-column"><h3></h3></div>
                <div id="definitions-column"><h3></h3></div>
            `;
            matchingModule.MESSAGES.get.mockImplementation((key) => `mock_${key}`);
        });

        test('should update text content of relevant elements', () => {
            matchingModule.updateText();

            expect(document.getElementById('back-to-menu-matching-btn')).toHaveTextContent('mock_backToMenu');
            expect(document.getElementById('undo-matching-btn')).toHaveTextContent('mock_undoButton');
            expect(document.getElementById('check-matching-btn')).toHaveTextContent('mock_checkAnswers');
            expect(document.getElementById('reset-matching-btn')).toHaveTextContent('mock_resetButton');
            expect(document.querySelector('#terms-column h3')).toHaveTextContent('mock_terms');
            expect(document.querySelector('#definitions-column h3')).toHaveTextContent('mock_definitions');

            expect(matchingModule.MESSAGES.get).toHaveBeenCalledWith('backToMenu');
            expect(matchingModule.MESSAGES.get).toHaveBeenCalledWith('undoButton');
            expect(matchingModule.MESSAGES.get).toHaveBeenCalledWith('checkAnswers');
            expect(matchingModule.MESSAGES.get).toHaveBeenCalledWith('resetButton');
            expect(matchingModule.MESSAGES.get).toHaveBeenCalledWith('terms');
            expect(matchingModule.MESSAGES.get).toHaveBeenCalledWith('definitions');
        });
    });
});
