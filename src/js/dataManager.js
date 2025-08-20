import { learningModules } from '../assets/data/game-db.js';

export async function fetchModuleData(moduleId) {
    const moduleMeta = learningModules.find(m => m.id === moduleId);
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
