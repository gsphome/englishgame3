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
