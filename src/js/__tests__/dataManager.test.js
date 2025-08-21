import { fetchAllLearningModules, fetchModuleData } from '../dataManager.js';

describe('dataManager.js', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        // Mock global fetch
        global.fetch = jest.fn();
        // Spy on console.error to prevent test output pollution and assert on calls
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('fetchAllLearningModules()', () => {
        test('should return parsed JSON data on successful fetch', async () => {
            const mockData = [{ id: 'flashcard-1', name: 'Flashcard 1' }];
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockData),
            });

            const result = await fetchAllLearningModules();
            expect(result).toEqual(mockData);
            expect(global.fetch).toHaveBeenCalledWith('src/assets/data/game-db.json'); // Updated path
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        test('should return an empty array and log error on HTTP error', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
            });

            const result = await fetchAllLearningModules();
            expect(result).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load learning modules:', expect.any(Error));
        });

        test('should return an empty array and log error on network error', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Network down'));

            const result = await fetchAllLearningModules();
            expect(result).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load learning modules:', expect.any(Error));
        });
    });

    describe('fetchModuleData(moduleId)', () => {
        const mockAllModules = [
            { id: 'flashcard-1', name: 'Flashcard 1', gameMode: 'flashcard', dataPath: './assets/data/flashcard-1.json' },
            { id: 'quiz-1', name: 'Quiz 1', gameMode: 'quiz', dataPath: './assets/data/quiz-1.json' },
        ];

        test('should return null and log error if module ID is not found', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAllModules),
            });

            const result = await fetchModuleData('non-existent-id');
            expect(result).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Module with ID non-existent-id not found.');
        });

        test('should return combined module metadata and data on successful fetch', async () => {
            const mockModuleData = [{ en: 'word', es: 'palabra' }];

            // Mock fetchAllLearningModules first
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAllModules),
            });

            // Mock fetch for the specific module data
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockModuleData),
            });

            const result = await fetchModuleData('flashcard-1');
            expect(result).toEqual({
                id: 'flashcard-1',
                name: 'Flashcard 1',
                gameMode: 'flashcard',
                dataPath: './assets/data/flashcard-1.json',
                data: mockModuleData,
            });
            expect(global.fetch).toHaveBeenCalledWith('src/assets/data/game-db.json'); // Updated path
            expect(global.fetch).toHaveBeenCalledWith('./assets/data/flashcard-1.json');
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        test('should return null and log error on HTTP error during module data fetch', async () => {
            // Mock fetchAllLearningModules first
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAllModules),
            });

            // Mock HTTP error for the specific module data fetch
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            const result = await fetchModuleData('quiz-1');
            expect(result).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load module data:', expect.any(Error));
        });

        test('should return null and log error on network error during module data fetch', async () => {
            // Mock fetchAllLearningModules first
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAllModules),
            });

            // Mock network error for the specific module data fetch
            global.fetch.mockRejectedValueOnce(new Error('Module data network down'));

            const result = await fetchModuleData('quiz-1');
            expect(result).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load module data:', expect.any(Error));
        });

        test('should return combined module metadata and non-array data on successful fetch', async () => {
            const mockModuleData = { title: 'Test Module', content: 'Some content' };

            // Mock fetchAllLearningModules first
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAllModules),
            });

            // Mock fetch for the specific module data
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockModuleData),
            });

            const result = await fetchModuleData('quiz-1'); // Using quiz-1 as it's available in mockAllModules
            expect(result).toEqual({
                id: 'quiz-1',
                name: 'Quiz 1',
                gameMode: 'quiz',
                dataPath: './assets/data/quiz-1.json',
                title: 'Test Module',
                content: 'Some content',
            });
            expect(global.fetch).toHaveBeenCalledWith('src/assets/data/game-db.json');
            expect(global.fetch).toHaveBeenCalledWith('./assets/data/quiz-1.json');
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });
});