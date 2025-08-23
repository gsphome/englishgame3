// src/js/modules/MatchingModule.js

class MatchingGame {
    constructor(authInstance, messagesInstance, gameCallbacks, settings) {
        this.auth = authInstance;
        this.MESSAGES = messagesInstance;
        this.gameCallbacks = gameCallbacks; // Object containing specific game functions
        this.settings = settings; // New: Store game settings

        this.currentIndex = 0;
        this.moduleData = null;
        this.appContainer = null;
        this.sessionScore = { correct: 0, incorrect: 0 };
        this.selectedTerm = null;
        this.selectedDefinition = null;
        this.matchedPairs = []; // Stores { termId: 'id', definitionId: 'id' }
        this.feedbackActive = false;

        // Bind event handlers
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    /**
     * Initializes the Matching module with the given module data.
     * @param {object} module - The module data containing matching exercises.
     */
    init(module) {
        this.currentIndex = 0;
        this.moduleData = module;
        this.appContainer = document.getElementById('app-container');
        this.sessionScore = { correct: 0, incorrect: 0 };
        this.selectedTerm = null;
        this.selectedDefinition = null;
        this.matchedPairs = [];
        this.feedbackActive = false;
        if (this.gameCallbacks.randomMode && Array.isArray(this.moduleData.data)) {
            this.moduleData.data = this.gameCallbacks.shuffleArray([...this.moduleData.data]);
        }
        // Limit the number of items based on settings
        if (this.settings && this.settings.wordCount && this.moduleData.data.length > this.settings.wordCount) {
            this.moduleData.data = this.moduleData.data.slice(0, this.settings.wordCount);
        }
        this.render();
        this.addKeyboardListeners();
        this.MESSAGES.addListener(this.updateText.bind(this));
    }

    handleItemClick(element) {
        if (this.feedbackActive) return; // Prevent clicks if feedback is active

        const id = element.dataset.id;
        const type = element.dataset.type;

        // Clear previous selections of the same type
        if (type === 'term' && this.selectedTerm) {
            document.getElementById(`term-${this.selectedTerm.id}`).classList.remove('selected');
        } else if (type === 'definition' && this.selectedDefinition) {
            document.getElementById(`definition-${this.selectedDefinition.id}`).classList.remove('selected');
        }

        // Set new selection
        element.classList.add('selected');
        if (type === 'term') {
            this.selectedTerm = { id: id, element: element };
        } else {
            this.selectedDefinition = { id: id, element: element };
        }

        // Attempt to match if both a term and a definition are selected
        if (this.selectedTerm && this.selectedDefinition) {
            this.attemptMatch();
        }
    }

    attemptMatch() {
        if (this.selectedTerm.id === this.selectedDefinition.id) {
            // Correct match
            this.matchedPairs.push({
                termId: this.selectedTerm.id,
                definitionId: this.selectedDefinition.id
            });

            // Visually confirm match and disable elements
            this.selectedTerm.element.classList.remove('selected', 'bg-gray-100', 'hover:bg-gray-200');
            this.selectedTerm.element.classList.add('matched', 'bg-green-200', 'cursor-default');
            this.selectedTerm.element.removeEventListener('click', this.handleItemClick);
            this.selectedTerm.element.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block ml-2 match-icon"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9.5 14.25a.75.75 0 0 1-1.172.036L3.25 12.25a.75.75 0 0 1 1.06-1.06l5.353 5.353 9.006-13.509a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd" /></svg>';

            this.selectedDefinition.element.classList.remove('selected', 'bg-gray-100', 'hover:bg-gray-200');
            this.selectedDefinition.element.classList.add('matched', 'bg-green-200', 'cursor-default');
            this.selectedDefinition.element.removeEventListener('click', this.handleItemClick);
            this.selectedDefinition.element.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block ml-2 match-icon"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9.5 14.25a.75.75 0 0 1-1.172.036L3.25 12.25a.75.75 0 0 1 1.06-1.06l5.353 5.353 9.006-13.509a.75.75 0 0 1 1.04-.208Z" clip-rule="evenodd" /></svg>';

            // Update score (optional, can be done on final check)
            this.sessionScore.correct++;
            this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);

        } else {
            // Incorrect match - provide temporary feedback
            this.sessionScore.incorrect++;
            this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);

            const termElement = this.selectedTerm.element;
            const defElement = this.selectedDefinition.element;

            termElement.classList.remove('selected');
            defElement.classList.remove('selected');

            termElement.classList.add('incorrect');
            defElement.classList.add('incorrect');

            setTimeout(() => {
                termElement.classList.remove('incorrect');
                defElement.classList.remove('incorrect');
            }, 500); // Remove feedback after 0.5 seconds
        }

        // Reset selections
        this.selectedTerm = null;
        this.selectedDefinition = null;

        // Check if all pairs are matched
        if (this.matchedPairs.length === this.moduleData.data.length) {
            this.feedbackActive = true; // Disable further interaction
            // Show the matching summary modal
            setTimeout(() => {
                this.gameCallbacks.showMatchingSummary(this.matchedPairs, this.moduleData);
            }, 500);
        }
    }

    undo() {
        if (this.matchedPairs.length > 0) {
            const lastMatch = this.matchedPairs.pop();
            const termElement = document.getElementById(`term-${lastMatch.termId}`);
            const defElement = document.getElementById(`definition-${lastMatch.definitionId}`);

            if (termElement) {
                termElement.classList.remove('matched', 'bg-green-200', 'cursor-default');
                termElement.classList.add('bg-gray-100', 'hover:bg-gray-200', 'cursor-pointer');
                termElement.innerHTML = termElement.textContent; // Remove SVG
                termElement.addEventListener('click', (e) => this.handleItemClick(e.target));
            }
            if (defElement) {
                defElement.classList.remove('matched', 'bg-green-200', 'cursor-default');
                defElement.classList.add('bg-gray-100', 'hover:bg-gray-200', 'cursor-pointer');
                defElement.innerHTML = defElement.textContent; // Remove SVG
                defElement.addEventListener('click', (e) => this.handleItemClick(e.target));
            }
            this.sessionScore.correct--;
            this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        }
    }

    

    render() {
        if (!this.moduleData || !Array.isArray(this.moduleData.data) || this.moduleData.data.length === 0) {
            console.error("Matching module data is invalid or empty.");
            this.gameCallbacks.renderMenu();
            return;
        }
        this.appContainer.classList.remove('main-menu-active');
        let terms = this.moduleData.data.map(item => ({ id: item.id, text: item.term, type: 'term' }));
        let definitions = this.moduleData.data.map(item => ({ id: item.id, text: item.definition, type: 'definition' }));

        if (this.gameCallbacks.randomMode) {
            terms = this.gameCallbacks.shuffleArray(terms);
            definitions = this.gameCallbacks.shuffleArray(definitions);
        }

        this.appContainer.innerHTML = `
            <div id="matching-container" class="max-w-4xl mx-auto p-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div id="terms-column" class="bg-white p-4 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold mb-3"></h3>
                        <!-- Terms will be rendered here -->
                    </div>
                    <div id="definitions-column" class="bg-white p-4 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold mb-3"></h3>
                        <!-- Definitions will be rendered here -->
                    </div>
                </div>
                <div class="flex justify-end mt-4">
                    <button id="undo-matching-btn" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg"></button>
                </div>
                <div class="mt-1">
                    <button id="back-to-menu-matching-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"></button>
                </div>
            </div>
        `;

        const termsColumn = document.getElementById('terms-column');
        const definitionsColumn = document.getElementById('definitions-column');

        terms.forEach(item => {
            const termElem = document.createElement('div');
            termElem.id = `term-${item.id}`;
            termElem.className = 'matching-item term bg-gray-100 hover:bg-gray-200 text-gray-800 dark:text-black font-semibold py-3 px-4 rounded-lg shadow-sm cursor-pointer mb-2';
            termElem.textContent = item.text;
            termElem.dataset.id = item.id;
            termElem.dataset.type = item.type;
            termElem.addEventListener('click', (e) => this.handleItemClick(e.target));
            termsColumn.appendChild(termElem);
        });

        definitions.forEach(item => {
            const defElem = document.createElement('div');
            defElem.id = `definition-${item.id}`;
            defElem.className = 'matching-item definition bg-gray-100 hover:bg-gray-200 text-gray-800 dark:text-black font-semibold py-3 px-4 rounded-lg shadow-sm cursor-pointer mb-2';
            defElem.textContent = item.text;
            defElem.dataset.id = item.id;
            defElem.dataset.type = item.type;
            defElem.addEventListener('click', (e) => this.handleItemClick(e.target));
            definitionsColumn.appendChild(defElem);
        });

        document.getElementById('undo-matching-btn').addEventListener('click', () => this.undo());
        document.getElementById('back-to-menu-matching-btn').addEventListener('click', () => this.gameCallbacks.renderMenu());
        this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        this.updateText(); // Call updateText after rendering HTML
    }

    updateText() {
        document.getElementById('back-to-menu-matching-btn').textContent = this.MESSAGES.get('backToMenu');
        document.getElementById('undo-matching-btn').textContent = this.MESSAGES.get('undoButton');
        document.querySelector('#terms-column h3').textContent = this.MESSAGES.get('terms');
        document.querySelector('#definitions-column h3').textContent = this.MESSAGES.get('definitions');
    }

    _handleKeyboardEvent(e) {
        // Only handle keyboard events if the matching container is visible
        const matchingContainer = document.getElementById('matching-container');
        if (!matchingContainer || matchingContainer.closest('.hidden')) {
            return;
        }

        const matchingCompletionModal = document.getElementById('matching-completion-modal');
        if (matchingCompletionModal && !matchingCompletionModal.classList.contains('hidden')) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent default action (e.g., form submission)
            } else if (e.key === 'Escape') {
                document.getElementById('matching-completion-back-to-menu-btn').click();
            }
            return; // Consume event if modal is handled
        }
    }

    addKeyboardListeners() {
        this._boundHandleKeyboardEvent = this._handleKeyboardEvent.bind(this);
        document.addEventListener('keydown', this._boundHandleKeyboardEvent);
    }

    removeKeyboardListeners() {
        document.removeEventListener('keydown', this._boundHandleKeyboardEvent);
    }
}

export default MatchingGame;