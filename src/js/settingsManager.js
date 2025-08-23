
class SettingsManager {
    constructor() {
        this.settings = {};
        this.events = {};
        this.loadSettings();
    }

    async loadSettings() {
        try {
            const response = await fetch('src/assets/data/app-config.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.settings = await response.json();
            console.log('Settings loaded:', this.settings);
        } catch (error) {
            console.error('Failed to load settings, using default:', error);
            // Fallback to default settings if loading fails
            this.settings = {
                "defaultLanguage": "en",
                "gameSettings": {
                    "matchingGame": {
                        "wordCount": 3
                    },
                    "sortingGame": {
                        "wordCount": 3
                    },
                    "flashcardGame": {
                        "wordCount": 10
                    },
                    "quizGame": {
                        "questionCount": 10
                    },
                    "completionGame": {
                        "itemCount": 10
                    }
                }
            };
        }
    }

    getSetting(keyPath) {
        let current = this.settings;
        const path = keyPath.split('.');
        for (let i = 0; i < path.length; i++) {
            if (current === null || typeof current !== 'object' || !current.hasOwnProperty(path[i])) {
                return undefined; // Or throw an error, depending on desired behavior
            }
            current = current[path[i]];
        }
        return current;
    }

    setSetting(keyPath, value) {
        let current = this.settings;
        const path = keyPath.split('.');
        const lastKeyIndex = path.length - 1;

        for (let i = 0; i < lastKeyIndex; i++) {
            const key = path[i];
            if (current === null || typeof current !== 'object' || !current.hasOwnProperty(key)) {
                // Create the path if it doesn't exist
                current[key] = {};
            }
            current = current[key];
        }

        if (current !== null && typeof current === 'object') {
            current[path[lastKeyIndex]] = value;
            this.emit(`setting:${keyPath}`, value);
            console.log(`Setting updated: ${keyPath} = ${value}`);
        } else {
            console.error(`Cannot set setting at ${keyPath}: path is not an object.`);
        }
    }

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => callback(data));
        }
    }
}

export const settingsManager = new SettingsManager();
