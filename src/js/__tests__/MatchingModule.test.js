import MatchingModule from '../modules/MatchingModule';
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
            expect(matchingModule.moduleData.data.length).toBe(5); // Should slice to 5
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

            expect(mockGameCallbacks.shuffleArray).toHaveBeenCalledWith(expect.arrayContaining(mockModuleData.data.slice(0, 5)));
            expect(matchingModule.moduleData.data).toEqual(mockModuleData.data.slice(0, 5).reverse());
        });

        test('should not shuffle module data if randomMode is false', () => {
            matchingModule.init(mockModuleData);
            expect(mockGameCallbacks.shuffleArray).not.toHaveBeenCalled();
            expect(matchingModule.moduleData.data).toEqual(mockModuleData.data.slice(0, 5));
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
});
