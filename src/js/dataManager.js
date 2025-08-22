/**
 * Fetches all learning modules from the game database JSON file.
 * @returns {Promise<Array>} A promise that resolves to an array of learning module metadata.
 */
export async function fetchAllLearningModules() {
    try {
        const response = await fetch('src/assets/data/game-db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to load learning modules:', error);
        return [];
    }
}

/**
 * Fetches the detailed data for a specific learning module.
 * @param {string} moduleId - The ID of the module to fetch data for.
 * @returns {Promise<object|null>} A promise that resolves to the module object with its data, or null if not found or an error occurs.
 */
export async function fetchModuleData(moduleId) {
    const allModules = await fetchAllLearningModules();
    const moduleMeta = allModules.find(m => m.id === moduleId);
    if (!moduleMeta) {
        console.error(`Module with ID ${moduleId} not found.`);
        return null;
    }

    try {
        const response = await fetch(moduleMeta.dataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedData = await response.json();

        const moduleWithData = Array.isArray(fetchedData)
            ? { ...moduleMeta, data: fetchedData }
            : { ...moduleMeta, ...fetchedData };

        return moduleWithData;
    } catch (error) {
        console.error('Failed to load module data:', error);
        return null;
    }
}
