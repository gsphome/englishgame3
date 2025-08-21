
import SortingModule from '../../modules/SortingModule.js';

// Mock dependencies
const authInstance = {
    updateGlobalScore: jest.fn(),
};

const messagesInstance = {
    get: jest.fn(key => key), // Return the key itself for simplicity
};

const gameCallbacks = {
    shuffleArray: jest.fn(array => array), // Return the array as is
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
    });

    test('constructor and init', () => {
        expect(sortingModule.auth).toBe(authInstance);
        expect(sortingModule.MESSAGES).toBe(messagesInstance);
        expect(sortingModule.gameCallbacks).toBe(gameCallbacks);
        expect(sortingModule.moduleData).toBe(moduleData);
        expect(sortingModule.appContainer).toBeDefined();
        expect(sortingModule.words.length).toBeGreaterThan(0);
        expect(sortingModule.categories.length).toBeGreaterThan(0);
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
        // Move all words to the 'fruits' category
        const fruitsCategoryElem = document.getElementById('category-fruits');
        sortingModule.words.forEach(word => {
            const wordElem = document.getElementById('word-' + word.replace(/\s+/g, '-').toLowerCase());
            fruitsCategoryElem.appendChild(wordElem);
        });

        sortingModule.checkAnswers();

        // There are 2 fruits and 2 vegetables in the mock data
        expect(sortingModule.sessionScore.correct).toBe(2);
        expect(sortingModule.sessionScore.incorrect).toBe(2);
        expect(authInstance.updateGlobalScore).toHaveBeenCalled();
        expect(gameCallbacks.updateSessionScoreDisplay).toHaveBeenCalled();
    });

    test('checkAnswers should call showSortingCompletionModal when all answers are correct', () => {
        const fruitsCategoryElem = document.getElementById('category-fruits');
        const vegetablesCategoryElem = document.getElementById('category-vegetables');

        sortingModule.words.forEach(word => {
            const wordElem = document.getElementById('word-' + word.replace(/\s+/g, '-').toLowerCase());
            const wordData = moduleData.data.find(d => d.word === word);
            if (wordData.category === 'fruits') {
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
});
