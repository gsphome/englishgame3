import { ModalComponent } from './ModalComponent.js';
import { MESSAGES } from '../i18n.js';
import { settingsManager } from '../settingsManager.js';

export class SettingsModalComponent extends ModalComponent {
    constructor() {
        super('settings-modal');
        this.formContainer = document.getElementById('settings-form-container');
        this.saveBtn = document.getElementById('settings-save-btn');
        this.closeBtn = document.getElementById('settings-close-btn');
        this.setupListeners();
    }

    setupListeners() {
        if (this.closeBtn) {
            this.addListener(this.closeBtn, 'click', () => this.hide());
        }
        if (this.saveBtn) {
            this.addListener(this.saveBtn, 'click', () => this.handleSave());
        }
    }

    show() {
        this.renderForm();
        this.updateText();
        super.show();
    }

    async handleSave() {
        try {
            // Visual feedback
            this.saveBtn.textContent = MESSAGES.get('saving') || 'Saving...';
            this.saveBtn.disabled = true;
            
            const formData = this.getFormData();
            await this.applyChanges(formData);
            
            // Success feedback
            this.saveBtn.textContent = MESSAGES.get('saved') || 'Saved!';
            this.saveBtn.className = 'bg-green-600 text-white font-bold py-2 px-4 rounded';
            
            setTimeout(() => {
                this.hide();
                this.resetSaveButton();
            }, 1000);
            
        } catch (error) {
            console.error('Error saving settings:', error);
            this.saveBtn.textContent = MESSAGES.get('errorSaving') || 'Error!';
            this.saveBtn.className = 'bg-red-600 text-white font-bold py-2 px-4 rounded';
            
            setTimeout(() => {
                this.resetSaveButton();
            }, 2000);
        }
    }

    resetSaveButton() {
        this.saveBtn.textContent = MESSAGES.get('saveButton');
        this.saveBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200';
        this.saveBtn.disabled = false;
    }

    renderForm() {
        if (!this.formContainer) return;
        
        this.formContainer.innerHTML = '';
        const settings = settingsManager.settings;

        const mainTitle = document.createElement('h2');
        mainTitle.className = 'text-lg font-bold mb-2 text-center';
        mainTitle.textContent = MESSAGES.get('settingsTitle');
        this.formContainer.appendChild(mainTitle);

        this.buildForm(settings);
    }

    buildForm(obj, prefix = '') {
        for (const key in obj) {
            const keyPath = prefix ? `${prefix}.${key}` : key;
            
            if (Array.isArray(obj[key])) {
                if (keyPath.startsWith('gameSettings.')) {
                    this.createArrayDisplay(keyPath, obj[key]);
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.createSectionTitle(keyPath);
                this.buildForm(obj[key], keyPath);
            } else {
                this.createInputField(keyPath, obj[key]);
            }
        }
    }

    createInputField(keyPath, value) {
        const settingRow = document.createElement('div');
        settingRow.className = 'flex justify-between items-center mb-2';

        const label = document.createElement('label');
        label.className = 'text-gray-700 text-sm font-semibold flex-1';
        label.textContent = MESSAGES.get(this.keyPathToI18nKey(keyPath));
        settingRow.appendChild(label);

        let inputElement;
        if (keyPath === 'defaultLanguage') {
            inputElement = this.createLanguageSelect(value, keyPath);
        } else if (typeof value === 'number') {
            inputElement = this.createNumberInput(value, keyPath);
        } else {
            inputElement = this.createTextInput(value, keyPath);
        }
        
        settingRow.appendChild(inputElement);
        this.formContainer.appendChild(settingRow);
    }

    createLanguageSelect(value, keyPath) {
        const select = document.createElement('select');
        select.className = 'shadow appearance-none border rounded w-full py-0.5 px-1 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline';
        select.dataset.keyPath = keyPath;
        
        const enOption = document.createElement('option');
        enOption.value = 'en';
        enOption.textContent = MESSAGES.get('languageEn');
        select.appendChild(enOption);
        
        const esOption = document.createElement('option');
        esOption.value = 'es';
        esOption.textContent = MESSAGES.get('languageEs');
        select.appendChild(esOption);
        
        select.value = value;
        return select;
    }

    createNumberInput(value, keyPath) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'shadow appearance-none border rounded py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 w-20 text-center';
        input.value = value;
        input.dataset.keyPath = keyPath;
        input.min = "1";
        input.max = "50";
        return input;
    }

    createTextInput(value, keyPath) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'shadow appearance-none border rounded py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 w-32';
        input.value = value;
        input.dataset.keyPath = keyPath;
        return input;
    }

    createReadOnlyField(keyPath, value) {
        const settingRow = document.createElement('div');
        settingRow.className = 'flex justify-between items-center mb-1';

        const label = document.createElement('span');
        label.className = 'text-gray-700 text-sm font-semibold';
        label.textContent = MESSAGES.get(this.keyPathToI18nKey(keyPath));
        settingRow.appendChild(label);

        const valueSpan = document.createElement('span');
        valueSpan.className = 'text-gray-600 text-sm';
        valueSpan.textContent = value;
        settingRow.appendChild(valueSpan);

        this.formContainer.appendChild(settingRow);
    }

    createSectionTitle(keyPath) {
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'text-base font-bold mt-2 mb-1 pb-0.5 border-b border-gray-200';
        sectionTitle.textContent = MESSAGES.get(this.keyPathToI18nKey(keyPath));
        this.formContainer.appendChild(sectionTitle);
    }

    createArrayDisplay(keyPath, array) {
        const settingRow = document.createElement('div');
        settingRow.className = 'mb-2';

        const label = document.createElement('div');
        label.className = 'text-gray-700 text-sm font-semibold mb-1';
        label.textContent = keyPath === 'gameSettings.categories' ? MESSAGES.get('settingsCategories') : MESSAGES.get(this.keyPathToI18nKey(keyPath));
        settingRow.appendChild(label);

        const valueContainer = document.createElement('div');
        valueContainer.className = 'grid grid-cols-2 gap-1 text-xs';
        
        const categoryLabels = {
            'Vocabulary': '📚 Vocabulary',
            'Grammar': '📝 Grammar', 
            'PhrasalVerbs': '🔗 Phrasal Verbs',
            'Idioms': '💭 Idioms'
        };
        
        array.forEach(item => {
            const itemSpan = document.createElement('span');
            itemSpan.className = 'bg-gray-100 text-gray-700 px-2 py-1 rounded text-center';
            itemSpan.textContent = categoryLabels[item] || item;
            valueContainer.appendChild(itemSpan);
        });
        
        settingRow.appendChild(valueContainer);
        this.formContainer.appendChild(settingRow);
    }

    keyPathToI18nKey(keyPath) {
        const parts = keyPath.split('.');
        if (parts[0] === 'gameSettings' && parts.length > 1) {
            let i18nKey = 'settings';
            for (let i = 1; i < parts.length; i++) {
                i18nKey += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
            }
            return i18nKey;
        } else {
            let i18nKey = 'settings';
            for (const part of parts) {
                i18nKey += part.charAt(0).toUpperCase() + part.slice(1);
            }
            return i18nKey;
        }
    }

    getFormData() {
        const formData = {};
        this.formContainer.querySelectorAll('input[data-key-path], select[data-key-path]').forEach(input => {
            const keyPath = input.dataset.keyPath;
            let value = input.value;
            if (input.type === 'number' && !isNaN(value) && !isNaN(parseFloat(value))) {
                value = parseFloat(value);
            }
            formData[keyPath] = value;
        });
        return formData;
    }

    async applyChanges(formData) {
        // Validate data before saving
        for (const keyPath in formData) {
            const value = formData[keyPath];
            
            // Validate numeric values
            if (typeof value === 'number' && (value < 1 || value > 50)) {
                throw new Error(`Invalid value for ${keyPath}: ${value}`);
            }
            
            settingsManager.setSetting(keyPath, value);
        }
        
        // Save to localStorage for persistence
        localStorage.setItem('userSettings', JSON.stringify(settingsManager.settings));
        
        // Notify gameManager to refresh module settings
        if (window.gameManager && typeof window.gameManager.refreshModuleSettings === 'function') {
            window.gameManager.refreshModuleSettings();
            
            // If currently in a game, restart it with new settings
            if (window.app && window.app.currentModule) {
                window.gameManager.startModule(window.app.currentModule.id);
            }
        }
    }

    updateText() {
        if (this.saveBtn) {
            this.saveBtn.textContent = MESSAGES.get('saveButton');
            this.saveBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200';
        }
        if (this.closeBtn) {
            this.closeBtn.textContent = MESSAGES.get('closeButton');
            this.closeBtn.className = 'bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200';
        }
    }
}