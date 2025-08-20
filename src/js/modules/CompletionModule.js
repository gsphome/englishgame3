// src/js/modules/CompletionModule.js

class CompletionModule {
    constructor(authInstance, messagesInstance, gameCallbacks) {
        this.auth = authInstance;
        this.MESSAGES = messagesInstance;
        this.gameCallbacks = gameCallbacks; // Object containing specific game functions

        this.currentIndex = 0;
        this.sessionScore = { correct: 0, incorrect: 0 };
        this.history = [];
        this.moduleData = null;
        this.appContainer = null;
    }

    init(module) {
        this.currentIndex = 0;
        this.sessionScore = { correct: 0, incorrect: 0 };
        this.moduleData = module;
        this.appContainer = document.getElementById('app-container');
        if (this.gameCallbacks.randomMode && Array.isArray(this.moduleData.data)) {
            this.moduleData.data = this.gameCallbacks.shuffleArray([...this.moduleData.data]);
        }
        this.render();
        const sessionScoreDisplay = document.getElementById('session-score-display');
        if (sessionScoreDisplay) {
            sessionScoreDisplay.classList.remove('hidden');
        }
    }

    render() {
        if (!this.moduleData || !Array.isArray(this.moduleData.data) || this.moduleData.data.length === 0) {
            console.error("Completion module data is invalid or empty.");
            this.gameCallbacks.renderMenu();
            return;
        }
        const questionData = this.moduleData.data[this.currentIndex];
        this.appContainer.classList.remove('main-menu-active');

        if (!document.getElementById('completion-container')) {
            this.appContainer.innerHTML = `
                <div id="completion-container" class="max-w-2xl mx-auto">
                    <div class="bg-white p-8 rounded-lg shadow-md">
                        <p class="text-base md:text-xl" id="completion-question"></p>
                        ${questionData.tip ? `<p class="text-lg text-gray-500 mb-4" id="completion-tip">Tip: ${questionData.tip}</p>` : ''}
                        <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button id="undo-btn" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4">${this.MESSAGES.get('undoButton')}</button>
                        <div>
                            <button id="prev-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l md:py-2 md:px-4">${this.MESSAGES.get('prevButton')}</button>
                            <button id="next-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r md:py-2 md:px-4">${this.MESSAGES.get('nextButton')}</button>
                        </div>
                    </div>
                    <button id="back-to-menu-completion-btn" class="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg md:mt-4 md:py-2 md:px-4">${this.MESSAGES.get('backToMenu')}</button>
                </div>
            `;

            document.getElementById('prev-btn').addEventListener('click', () => this.prev());
            document.getElementById('next-btn').addEventListener('click', () => this.handleNextAction());
            document.getElementById('undo-btn').addEventListener('click', () => this.undo());
            document.getElementById('back-to-menu-completion-btn').addEventListener('click', () => this.gameCallbacks.renderMenu());

            // const inputElement = document.getElementById('completion-input'); // Moved outside
            // setTimeout(() => {
            //     inputElement.value = ''; // Clear the input field
            //     inputElement.focus();
            // }, 0);
        }

        // Update question and input field for every render
        document.getElementById('completion-question').innerHTML = questionData.sentence.replace('______', '<input type="text" id="completion-input" class="border-b-2 border-gray-400 focus:border-blue-500 outline-none text-left w-[20px] bg-transparent" autocomplete="off" />');
        document.getElementById('feedback-container').innerHTML = ''; // Clear feedback

        let inputElement = document.getElementById('completion-input');
        inputElement.value = ''; // Clear the input field
        inputElement.disabled = false; // Enable input field
        inputElement.classList.remove('text-green-500', 'text-red-500'); // Remove color classes
        inputElement.focus();

        const completionTipElement = document.getElementById('completion-tip');
        if (questionData.tip) {
            if (completionTipElement) {
                completionTipElement.textContent = `Tip: ${questionData.tip}`;
                completionTipElement.classList.remove('hidden');
            } else {
                // If the element doesn't exist, create and insert it
                const feedbackContainer = document.getElementById('feedback-container');
                const newTipElement = document.createElement('p');
                newTipElement.id = 'completion-tip';
                newTipElement.className = 'text-lg text-gray-500 mb-4';
                newTipElement.textContent = `Tip: ${questionData.tip}`;
                feedbackContainer.parentNode.insertBefore(newTipElement, feedbackContainer);
            }
        }
        else {
            if (completionTipElement) {
                completionTipElement.classList.add('hidden');
            }
        }
    }

    handleAnswer() {
        const inputElement = document.getElementById('completion-input');
        const userAnswer = inputElement.value.trim();

        if (userAnswer === '') {
            return; // Do nothing if the input is empty or just whitespace
        }

        const questionData = this.moduleData.data[this.currentIndex];
        const isCorrect = userAnswer.toLowerCase() === questionData.correct.toLowerCase();

        if (isCorrect) {
            this.sessionScore.correct++;
            this.auth.updateGlobalScore({ correct: 1, incorrect: 0 });
            inputElement.classList.add('text-green-500');
            document.getElementById('feedback-container').innerHTML = `<p class="text-lg">Correct Answer: <strong>${questionData.correct}</strong></p><p class="text-lg">${questionData.explanation}</p>`;
            this.lastFeedback = { isCorrect: true, correct: questionData.correct, explanation: questionData.explanation, index: this.currentIndex, userAnswer: userAnswer };
        } else {
            this.sessionScore.incorrect++;
            this.auth.updateGlobalScore({ correct: 0, incorrect: 1 });
            inputElement.classList.add('text-red-500');
            document.getElementById('feedback-container').innerHTML = `<p class="text-lg">Correct Answer: <strong>${questionData.correct}</strong></p><p class="text-lg">${questionData.explanation}</p>`;
            this.lastFeedback = { isCorrect: false, correct: questionData.correct, explanation: questionData.explanation, index: this.currentIndex, userAnswer: userAnswer };
        }
        inputElement.disabled = true;
        this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
    }

    undo() {
        const lastAction = this.history.pop();
        if (lastAction) {
            if (lastAction.isCorrect) {
                this.sessionScore.correct--;
                this.auth.updateGlobalScore({ correct: -1, incorrect: 0 });
            } else {
                this.sessionScore.incorrect--;
                this.auth.updateGlobalScore({ correct: 0, incorrect: -1 });
            }
            this.currentIndex = lastAction.index;
            this.render();
            this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.render();
        }
    }

    next() {
        if (this.currentIndex < this.moduleData.data.length - 1) {
            this.currentIndex++;
            this.render();
        }
        else {
            this.showFinalScore();
        }
    }

    handleNextAction() {
        const inputElement = document.getElementById('completion-input');
        if (inputElement && !inputElement.disabled) {
            this.handleAnswer();
        } else {
            this.next();
        }
    }

    showFinalScore() {
        this.auth.updateGlobalScore(this.sessionScore);
        this.gameCallbacks.renderHeader();

        if (!document.getElementById('completion-summary-container')) {
            this.appContainer.innerHTML = `
                 <div id="completion-summary-container" class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 id="completion-summary-title" class="text-2xl font-bold mb-4">${this.MESSAGES.get('sessionScore')}</h1>
                    <p id="completion-summary-correct" class="text-xl mb-2">${this.MESSAGES.get('correct')}: ${this.sessionScore.correct}</p>
                    <p id="completion-summary-incorrect" class="text-xl mb-4">${this.MESSAGES.get('incorrect')}: ${this.sessionScore.incorrect}</p>
                    <button id="completion-summary-back-to-menu-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4">${this.MESSAGES.get('backToMenu')}</button>
                 </div>
            `;
            document.getElementById('completion-summary-back-to-menu-btn').addEventListener('click', () => this.game.renderMenu());
        } else {
            document.getElementById('completion-summary-title').textContent = this.MESSAGES.get('sessionScore');
            document.getElementById('completion-summary-correct').textContent = `${this.MESSAGES.get('correct')}: ${this.sessionScore.correct}`;
            document.getElementById('completion-summary-incorrect').textContent = `${this.MESSAGES.get('incorrect')}: ${this.sessionScore.incorrect}`;
            document.getElementById('completion-summary-back-to-menu-btn').textContent = this.MESSAGES.get('backToMenu');
        }
    }

    updateText() {
        const questionData = this.moduleData.data[this.currentIndex];
        const currentInputValue = document.getElementById('completion-input') ? document.getElementById('completion-input').value : ''; // Save current value
        document.getElementById('completion-question').innerHTML = questionData.sentence.replace('______', '<input type="text" id="completion-input" class="border-b-2 border-gray-400 focus:border-blue-500 outline-none text-left w-[20px] bg-transparent" autocomplete="off" />');
        let inputElement = document.getElementById('completion-input'); // Re-get the element after innerHTML update
        inputElement.value = currentInputValue; // Restore saved value
        inputElement.focus();

        // Restore feedback if available for the current question
        if (this.lastFeedback && this.lastFeedback.index === this.currentIndex) {
            const feedbackHtml = `<p class="text-lg">Correct Answer: <strong>${this.lastFeedback.correct}</strong></p><p class="text-lg">${this.lastFeedback.explanation}</p>`;
            document.getElementById('feedback-container').innerHTML = feedbackHtml;
            inputElement.disabled = true; // Keep disabled
            if (this.lastFeedback.isCorrect) {
                inputElement.classList.add('text-green-500');
            } else {
                inputElement.classList.add('text-red-500');
            }
        } else {
            document.getElementById('feedback-container').innerHTML = ''; // Clear feedback if no relevant feedback is stored
            inputElement.disabled = false; // Enable if no feedback
            inputElement.classList.remove('text-green-500', 'text-red-500'); // Remove colors if no feedback
        }
    }
}

export default CompletionModule;