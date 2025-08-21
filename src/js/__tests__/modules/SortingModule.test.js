
import SortingModule from '../../modules/SortingModule.js';

// Mock dependencies
const authInstance = {
    updateGlobalScore: jest.fn(),
};

const messagesInstance = {
    get: jest.fn(key => key), // Return the key itself for simplicity
};

const gameCallbacks = {
    shuffleArray: jest.fn(array => array), // Return the array as is for predictable testing
    updateSessionScoreDisplay: jest.fn(),
    showSortingCompletionModal: jest.fn(),
    renderMenu: jest.fn(),
};

// Mock module data
const moduleData = {
    categories: [
        { category_id: 'fruits', category_show: 'Fruits' },
        { category_id: 'vegetables', category_show: 'Vegetables' },
    ],
    data: [
        { word: 'apple', category: 'fruits' },
        { word: 'banana', category: 'fruits' },
        { word: 'carrot', category: 'vegetables' },
        { word: 'broccoli', category: 'vegetables' },
    ],
};

describe('SortingModule', () => {
    let sortingModule;

    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML = '<div id="app-container"></div>';
        sortingModule = new SortingModule(authInstance, messagesInstance, gameCallbacks);
        sortingModule.init(moduleData);
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('constructor and init', () => {
        // Re-initialize after clearing mocks to ensure shuffleArray call is captured
        sortingModule = new SortingModule(authInstance, messagesInstance, gameCallbacks);
        sortingModule.init(moduleData);

        expect(sortingModule.auth).toBe(authInstance);
        expect(sortingModule.MESSAGES).toBe(messagesInstance);
        expect(sortingModule.gameCallbacks).toBe(gameCallbacks);
        expect(sortingModule.moduleData).toBe(moduleData);
        expect(sortingModule.appContainer).toBeDefined();
        expect(sortingModule.words.length).toBeGreaterThan(0);
        expect(sortingModule.categories.length).toBeGreaterThan(0);
        expect(gameCallbacks.shuffleArray).toHaveBeenCalled(); // Verify shuffleArray is called
    });

    test('renderInitialView', () => {
        const sortingContainer = document.getElementById('sorting-container');
        expect(sortingContainer).not.toBeNull();

        const wordBank = document.getElementById('word-bank');
        expect(wordBank).not.toBeNull();

        const categoriesContainer = document.getElementById('categories-container');
        expect(categoriesContainer).not.toBeNull();

        const checkBtn = document.getElementById('check-btn');
        expect(checkBtn).not.toBeNull();

        const undoBtn = document.getElementById('undo-btn');
        expect(undoBtn).not.toBeNull();

        const backToMenuBtn = document.getElementById('back-to-menu-sorting-btn');
        expect(backToMenuBtn).not.toBeNull();
    });

    test('checkAnswers should correctly identify correct and incorrect answers', () => {
        // Move 'apple' to fruits, 'banana' to vegetables (incorrect)
        const appleWordElem = document.getElementById('word-apple');
        const bananaWordElem = document.getElementById('word-banana');
        const fruitsCategoryElem = document.getElementById('category-fruits');
        const vegetablesCategoryElem = document.getElementById('category-vegetables');

        fruitsCategoryElem.appendChild(appleWordElem);
        vegetablesCategoryElem.appendChild(bananaWordElem); // Incorrect placement for banana

        sortingModule.checkAnswers();

        expect(sortingModule.sessionScore.correct).toBe(1); // apple is correct
        expect(sortingModule.sessionScore.incorrect).toBe(3); // banana, carrot, broccoli are incorrect
        expect(authInstance.updateGlobalScore).toHaveBeenCalledWith({ correct: 1, incorrect: 3 });
        expect(gameCallbacks.updateSessionScoreDisplay).toHaveBeenCalled();

        expect(appleWordElem.classList.contains('bg-green-500')).toBe(true);
        expect(bananaWordElem.classList.contains('bg-red-500')).toBe(true);
    });

    test('checkAnswers should call showSortingCompletionModal when all answers are correct', () => {
        const fruitsCategoryElem = document.getElementById('category-fruits');
        const vegetablesCategoryElem = document.getElementById('category-vegetables');

        // Correctly place all words
        moduleData.data.forEach(item => {
            const wordElem = document.getElementById('word-' + item.word.replace(/\s+/g, '-').toLowerCase());
            if (item.category === 'fruits') {
                fruitsCategoryElem.appendChild(wordElem);
            } else {
                vegetablesCategoryElem.appendChild(wordElem);
            }
        });

        sortingModule.checkAnswers();

        expect(sortingModule.sessionScore.correct).toBe(4);
        expect(sortingModule.sessionScore.incorrect).toBe(0);
        expect(gameCallbacks.showSortingCompletionModal).toHaveBeenCalledWith(moduleData);
    });

    test('undo should move the last moved word back to its previous container', () => {
        const word = sortingModule.words[0];
        const wordElem = document.getElementById('word-' + word.replace(/\s+/g, '-').toLowerCase());
        const wordBank = document.getElementById('word-bank');
        const category = sortingModule.categories[0];
        const categoryElem = document.getElementById('category-' + category.category_id);

        // 1. Move word to category
        categoryElem.appendChild(wordElem);
        sortingModule.history.push({
            wordId: wordElem.id,
            from: 'word-bank',
            to: categoryElem.id,
            isCorrectMove: true
        });

        // 2. Undo
        sortingModule.undo();

        // 3. Check if the word is back in the word bank
        expect(wordBank.contains(wordElem)).toBe(true);
        expect(gameCallbacks.updateSessionScoreDisplay).toHaveBeenCalled();
    });

    test('undo should clear feedback if feedback is active', () => {
        const word = sortingModule.words[0];
        const wordElem = document.getElementById('word-' + word.replace(/\s+/g, '-').toLowerCase());
        wordElem.classList.add('bg-green-500');
        sortingModule.feedbackActive = true;

        sortingModule.undo();
        expect(wordElem.classList.contains('bg-green-500')).toBe(false);
        expect(sortingModule.feedbackActive).toBe(false);
    });

    test('clearFeedback should remove feedback classes from words', () => {
        const word = sortingModule.words[0];
        const wordElem = document.getElementById('word-' + word.replace(/\s+/g, '-').toLowerCase());

        wordElem.classList.add('bg-green-500', 'text-white');

        sortingModule.clearFeedback();

        expect(wordElem.classList.contains('bg-green-500')).toBe(false);
        expect(wordElem.classList.contains('text-white')).toBe(false);
        expect(wordElem.classList.contains('bg-gray-100')).toBe(true);
    });

    test('drag should set draggedElementId', () => {
        const word = sortingModule.words[0];
        const wordElem = document.getElementById('word-' + word.replace(/\s+/g, '-').toLowerCase());
        const mockEvent = { target: wordElem };
        sortingModule.drag(mockEvent);
        expect(sortingModule.draggedElementId).toBe(wordElem.id);
    });

    test('allowDrop should prevent default', () => {
        const mockEvent = { preventDefault: jest.fn() };
        sortingModule.allowDrop(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    describe('drop', () => {
        let wordElem;
        let wordBank;
        let categoryElem;

        beforeEach(() => {
            wordElem = document.getElementById('word-apple');
            wordBank = document.getElementById('word-bank');
            categoryElem = document.getElementById('category-fruits');
            sortingModule.draggedElementId = wordElem.id; // Simulate drag
        });

        test('should move word from word-bank to category', () => {
            const mockEvent = { preventDefault: jest.fn(), target: categoryElem };
            sortingModule.drop(mockEvent);

            expect(categoryElem.contains(wordElem)).toBe(true);
            expect(sortingModule.history.length).toBe(1);
            expect(sortingModule.history[0].wordId).toBe(wordElem.id);
            expect(sortingModule.history[0].from).toBe(wordBank.id);
            expect(sortingModule.history[0].to).toBe(categoryElem.id);
            expect(sortingModule.history[0].isCorrectMove).toBe(true);
            expect(sortingModule.userAnswers['apple']).toBe('fruits');
            expect(sortingModule.draggedElementId).toBeNull();
        });

        test('should move word from one category to another', () => {
            const vegetablesCategoryElem = document.getElementById('category-vegetables');
            vegetablesCategoryElem.appendChild(wordElem); // Put it in vegetables first
            sortingModule.history.push({ wordId: wordElem.id, from: vegetablesCategoryElem.id, to: categoryElem.id, isCorrectMove: false }); // Simulate initial move

            const mockEvent = { preventDefault: jest.fn(), target: categoryElem };
            sortingModule.drop(mockEvent);

            expect(categoryElem.contains(wordElem)).toBe(true);
            expect(vegetablesCategoryElem.contains(wordElem)).toBe(false);
            expect(sortingModule.history.length).toBe(2); // Original push + new push
            expect(sortingModule.history[1].from).toBe(vegetablesCategoryElem.id);
            expect(sortingModule.history[1].to).toBe(categoryElem.id);
            expect(sortingModule.history[1].isCorrectMove).toBe(true);
            expect(sortingModule.userAnswers['apple']).toBe('fruits');
        });

        test('should move word from category back to word-bank', () => {
            categoryElem.appendChild(wordElem); // Put it in fruits first
            sortingModule.history.push({ wordId: wordElem.id, from: categoryElem.id, to: wordBank.id, isCorrectMove: false }); // Simulate initial move

            const mockEvent = { preventDefault: jest.fn(), target: wordBank };
            sortingModule.drop(mockEvent);

            expect(wordBank.contains(wordElem)).toBe(true);
            expect(categoryElem.contains(wordElem)).toBe(false);
            expect(sortingModule.history.length).toBe(2);
            expect(sortingModule.history[1].from).toBe(categoryElem.id);
            expect(sortingModule.history[1].to).toBe(wordBank.id);
            expect(sortingModule.history[1].isCorrectMove).toBe(false); // Moving back to word-bank is not "correct" in terms of final placement
            expect(sortingModule.userAnswers['apple']).toBe(''); // Should clear answer if moved back to word-bank
        });

        test('should not move word if target is same as current parent', () => {
            categoryElem.appendChild(wordElem); // Put it in fruits first
            const initialHistoryLength = sortingModule.history.length;

            const mockEvent = { preventDefault: jest.fn(), target: categoryElem };
            sortingModule.drop(mockEvent);

            expect(categoryElem.contains(wordElem)).toBe(true); // Still in the same category
            expect(sortingModule.history.length).toBe(initialHistoryLength); // History should not change
        });

        test('should not move word if draggedElementId is null', () => {
            sortingModule.draggedElementId = null;
            const initialHistoryLength = sortingModule.history.length;
            const mockEvent = { preventDefault: jest.fn(), target: categoryElem };
            sortingModule.drop(mockEvent);
            expect(sortingModule.history.length).toBe(initialHistoryLength);
        });

        test('should find correct target even if event target is a child element', () => {
            const categoryTitle = categoryElem.querySelector('h3');
            const mockEvent = { preventDefault: jest.fn(), target: categoryTitle }; // Target the h3 inside category
            sortingModule.drop(mockEvent);
            expect(categoryElem.contains(wordElem)).toBe(true);
        });
    });

    describe('renderWords', () => {
        test('should render word elements correctly', () => {
            // Re-initialize to ensure renderWords is called
            document.body.innerHTML = '<div id="app-container"></div>';
            sortingModule = new SortingModule(authInstance, messagesInstance, gameCallbacks);
            sortingModule.init(moduleData);

            const wordBank = document.getElementById('word-bank');
            expect(wordBank.children.length).toBe(sortingModule.words.length);

            sortingModule.words.forEach(word => {
                const wordId = 'word-' + word.replace(/\s+/g, '-').toLowerCase();
                const wordElem = document.getElementById(wordId);
                expect(wordElem).not.toBeNull();
                expect(wordElem.textContent).toBe(word);
                expect(wordElem.getAttribute('draggable')).toBe('true');
                expect(wordElem.dataset.word).toBe(word);
            });
        });
    });

    describe('renderCategories', () => {
        test('should render category elements correctly', () => {
            // Re-initialize to ensure renderCategories is called
            document.body.innerHTML = '<div id="app-container"></div>';
            sortingModule = new SortingModule(authInstance, messagesInstance, gameCallbacks);
            sortingModule.init(moduleData);

            const categoriesContainer = document.getElementById('categories-container');
            expect(categoriesContainer.children.length).toBe(sortingModule.categories.length);

            sortingModule.categories.forEach(categoryObj => {
                const categoryId = 'category-' + categoryObj.category_id;
                const categoryElem = document.getElementById(categoryId);
                expect(categoryElem).not.toBeNull();
                expect(categoryElem.querySelector('h3').textContent).toBe(categoryObj.category_show);
            });
        });
    });

    describe('render', () => {
        test('should move words to their assigned containers and re-apply feedback', () => {
            const appleWordElem = document.getElementById('word-apple');
            const fruitsCategoryElem = document.getElementById('category-fruits');
            const wordBank = document.getElementById('word-bank');

            // Simulate moving 'apple' to 'fruits' category
            fruitsCategoryElem.appendChild(appleWordElem);
            sortingModule.userAnswers['apple'] = 'category-fruits';

            // Simulate feedback being active and 'apple' being correct
            sortingModule.feedbackActive = true;
            sortingModule.wordFeedbackStatus['apple'] = true;

            sortingModule.render();

            expect(fruitsCategoryElem.contains(appleWordElem)).toBe(true);
            expect(appleWordElem.classList.contains('bg-green-500')).toBe(true);
            expect(appleWordElem.classList.contains('text-white')).toBe(true);

            // Simulate moving 'banana' to an incorrect category and feedback being active
            const bananaWordElem = document.getElementById('word-banana');
            const vegetablesCategoryElem = document.getElementById('category-vegetables');
            vegetablesCategoryElem.appendChild(bananaWordElem);
            sortingModule.userAnswers['banana'] = 'category-vegetables';
            sortingModule.wordFeedbackStatus['banana'] = false;

            sortingModule.render();

            expect(vegetablesCategoryElem.contains(bananaWordElem)).toBe(true);
            expect(bananaWordElem.classList.contains('bg-red-500')).toBe(true);
            expect(bananaWordElem.classList.contains('text-white')).toBe(true);

            // Test fallback to word-bank if target container is not found
            const carrotWordElem = document.getElementById('word-carrot');
            sortingModule.userAnswers['carrot'] = 'non-existent-category';
            sortingModule.render();
            expect(wordBank.contains(carrotWordElem)).toBe(true);
        });
    });

    describe('updateText', () => {
        test('should update button texts and category titles', () => {
            // Set up initial texts (they are mocked to return key, so this is fine)
            document.getElementById('undo-btn').textContent = 'Old Undo';
            document.getElementById('check-btn').textContent = 'Old Check';
            document.getElementById('back-to-menu-sorting-btn').textContent = 'Old Back';
            document.getElementById('categories-container').innerHTML = `
                <div id="category-fruits"><h3 class="text-l font-bold mb-2 capitalize">Old Fruits</h3></div>
                <div id="category-vegetables"><h3 class="text-l font-bold mb-2 capitalize">Old Vegetables</h3></div>
            `;
            // Add a score display element for testing
            const scoreDisplay = document.createElement('div');
            scoreDisplay.id = 'score-display';
            document.getElementById('app-container').appendChild(scoreDisplay);


            sortingModule.updateText();

            expect(document.getElementById('undo-btn').textContent).toBe('undoButton');
            expect(document.getElementById('check-btn').textContent).toBe('checkButton');
            expect(document.getElementById('back-to-menu-sorting-btn').textContent).toBe('backToMenu');
            expect(document.getElementById('category-fruits').querySelector('h3').textContent).toBe('Fruits');
            expect(document.getElementById('category-vegetables').querySelector('h3').textContent).toBe('Vegetables');
        });

        test('should update score display when all correct', () => {
            const scoreDisplay = document.createElement('div');
            scoreDisplay.id = 'score-display';
            document.getElementById('app-container').appendChild(scoreDisplay);

            sortingModule.sessionScore.correct = 4;
            sortingModule.words = ['apple', 'banana', 'carrot', 'broccoli']; // Ensure words array matches correct score
            sortingModule.updateText();
            expect(scoreDisplay.textContent).toBe('allCorrectMessage');
        });

        test('should clear score display when not all correct', () => {
            const scoreDisplay = document.createElement('div');
            scoreDisplay.id = 'score-display';
            document.getElementById('app-container').appendChild(scoreDisplay);

            sortingModule.sessionScore.correct = 2;
            sortingModule.words = ['apple', 'banana', 'carrot', 'broccoli'];
            sortingModule.updateText();
            expect(scoreDisplay.textContent).toBe('');
        });
    });

    describe('Touch Events', () => {
        let wordElem;
        let wordBank;
        let categoryElem;

        beforeEach(() => {
            wordElem = document.getElementById('word-apple');
            wordBank = document.getElementById('word-bank');
            categoryElem = document.getElementById('category-fruits');
        });

        test('handleTouchStart should create a ghost element and set up touchmove/touchend listeners', () => {
            const mockTouch = { clientX: 10, clientY: 20 };
            const mockEvent = { preventDefault: jest.fn(), touches: [mockTouch] };

            // Mock getBoundingClientRect for the word element
            wordElem.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 50 });

            sortingModule.handleTouchStart(mockEvent, wordElem);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(sortingModule.currentDraggedElement).toBe(wordElem);
            expect(sortingModule.touchStartX).toBe(10);
            expect(sortingModule.touchStartY).toBe(20);
            expect(sortingModule.currentGhostElement).not.toBeNull();
            expect(document.body.contains(sortingModule.currentGhostElement)).toBe(true);
            expect(wordElem.style.opacity).toBe('0');
        });

        test('handleTouchMove should update ghost element position', () => {
            // Setup initial state for handleTouchMove
            sortingModule.currentGhostElement = document.createElement('div');
            document.body.appendChild(sortingModule.currentGhostElement);
            // Mock getBoundingClientRect for the ghost element
            sortingModule.currentGhostElement.getBoundingClientRect = () => ({ width: 100, height: 50 });

            const mockTouch = { clientX: 50, clientY: 60 };
            const mockEvent = { preventDefault: jest.fn(), touches: [mockTouch] };

            sortingModule.handleTouchMove(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            // Check if position is updated (approximate due to scrollX/Y)
            expect(sortingModule.currentGhostElement.style.left).not.toBe('0px');
            expect(sortingModule.currentGhostElement.style.top).not.toBe('0px');
        });

        test('handleTouchEnd should move word and clean up', () => {
            // Setup initial state for handleTouchEnd
            sortingModule.currentDraggedElement = wordElem;
            sortingModule.currentGhostElement = document.createElement('div');
            document.body.appendChild(sortingModule.currentGhostElement);

            // Mock getDropTarget to return a valid target
            jest.spyOn(sortingModule, 'getDropTarget').mockReturnValue(categoryElem);

            const mockTouch = { clientX: 100, clientY: 100 };
            const mockEvent = { changedTouches: [mockTouch] };

            sortingModule.handleTouchEnd(mockEvent);

            expect(categoryElem.contains(wordElem)).toBe(true);
            expect(sortingModule.history.length).toBe(1);
            expect(sortingModule.currentGhostElement).toBeNull();
            expect(sortingModule.currentDraggedElement).toBeNull();
            expect(document.body.contains(sortingModule.currentGhostElement)).toBe(false); // Should be removed
            expect(wordElem.style.opacity).toBe('1'); // Original element visible again
            expect(sortingModule.userAnswers['apple']).toBe('category-fruits');
            expect(sortingModule.getDropTarget).toHaveBeenCalledWith(100, 100);
        });

        test('handleTouchEnd should not move word if no valid drop target', () => {
            // Setup initial state
            sortingModule.currentDraggedElement = wordElem;
            sortingModule.currentGhostElement = document.createElement('div');
            document.body.appendChild(sortingModule.currentGhostElement);

            // Mock getDropTarget to return null
            jest.spyOn(sortingModule, 'getDropTarget').mockReturnValue(null);

            const initialParent = wordElem.parentElement;
            const initialHistoryLength = sortingModule.history.length;

            const mockTouch = { clientX: 100, clientY: 100 };
            const mockEvent = { changedTouches: [mockTouch] };

            sortingModule.handleTouchEnd(mockEvent);

            expect(initialParent.contains(wordElem)).toBe(true); // Word should not have moved
            expect(sortingModule.history.length).toBe(initialHistoryLength);
        });

        test('getDropTarget should return the correct target', () => {
            // Mock bounding rectangles for word-bank and category-fruits
            const wordBank = document.getElementById('word-bank');
            const categoryFruits = document.getElementById('category-fruits');

            jest.spyOn(wordBank, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, right: 100, bottom: 100 });
            jest.spyOn(categoryFruits, 'getBoundingClientRect').mockReturnValue({ left: 100, top: 0, right: 200, bottom: 100 });

            // Test point within word-bank
            expect(sortingModule.getDropTarget(50, 50)).toBe(wordBank);

            // Test point within category-fruits
            expect(sortingModule.getDropTarget(150, 50)).toBe(categoryFruits);

            // Test point outside any target
            expect(sortingModule.getDropTarget(300, 300)).toBeNull();
        });
    });
});
