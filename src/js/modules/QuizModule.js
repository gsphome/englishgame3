// src/js/modules/QuizModule.js

class QuizModule {
    constructor(authInstance, messagesInstance, gameCallbacks) {
        this.auth = authInstance;
        this.MESSAGES = messagesInstance;
        this.gameCallbacks = gameCallbacks; // Object containing specific game functions

        this.currentIndex = 0;
        this.sessionScore = { correct: 0, incorrect: 0 };
        this.history = [];
        this.moduleData = null;
        this.appContainer = null;
        this.historyPointer = -1;
        this.scoreFrozen = false;
    }

    init(module) {
        this.currentIndex = 0;
        this.sessionScore = { correct: 0, incorrect: 0 };
        this.history = [];
        this.historyPointer = -1; // Initialize history pointer
        this.moduleData = module;
        this.appContainer = document.getElementById('app-container');
        this.scoreFrozen = false;

        if (this.gameCallbacks.randomMode && Array.isArray(this.moduleData.data)) {
            this.moduleData.data = this.gameCallbacks.shuffleArray([...this.moduleData.data]);
        }
        this.render();
    }

    render() {
        if (!this.moduleData || !Array.isArray(this.moduleData.data) || this.moduleData.data.length === 0) {
            console.error("Quiz module data is invalid or empty.");
            this.gameCallbacks.renderMenu();
            return;
        }
        const questionData = this.moduleData.data[this.currentIndex];
        this.appContainer.classList.remove('main-menu-active');

        // Create a copy of options to shuffle, so the original data is not permanently altered
        let optionsToRender = [...questionData.options];

        // Shuffle options if random mode is active
        if (this.gameCallbacks.randomMode) {
            optionsToRender = this.gameCallbacks.shuffleArray(optionsToRender);
        }

        if (!document.getElementById('quiz-container')) {
            let optionsHtml = '';
            const optionLetters = ['A', 'B', 'C', 'D'];
            optionsToRender.forEach((option, index) => {
                optionsHtml += `
                        <button class="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-5 rounded-lg shadow-md transition duration-200 ease-in-out flex items-center border border-gray-300" data-option="${option}">
                        <span class="font-bold mr-4">${optionLetters[index]}</span>
                        <span>${option}</span>
                    </button>
                `;
            });

            this.appContainer.innerHTML = `
                <div id="quiz-container" class="max-w-2xl mx-auto">
                    <div class="bg-white p-8 rounded-lg shadow-md">
                        <p class="text-base mb-6 md:text-xl" id="quiz-question">${questionData.sentence.replace('______', '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>')}</p>
                        ${questionData.tip ? `<p class="text-lg text-gray-500 mb-4" id="quiz-tip">Tip: ${questionData.tip}</p>` : ''}
                        <div id="options-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">${optionsHtml}</div>
                        <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button id="undo-btn" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4">${this.MESSAGES.get('undoButton')}</button>
                        <div>
                            <button id="prev-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l md:py-2 md:px-4">${this.MESSAGES.get('prevButton')}</button>
                            <button id="next-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r md:py-2 md:px-4">${this.MESSAGES.get('nextButton')}</button>
                        </div>
                    </div>
                                         <button id="quiz-summary-back-to-menu-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4">${this.MESSAGES.get('backToMenu')}</button>
                </div>
            `;

        }

        document.getElementById('prev-btn').addEventListener('click', () => this.prev());
        document.getElementById('next-btn').addEventListener('click', () => this.next());
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('quiz-summary-back-to-menu-btn').addEventListener('click', () => this.gameCallbacks.renderMenu());

        this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        document.getElementById('quiz-question').innerHTML = questionData.sentence.replace('______', '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>');
        const quizTipElement = document.getElementById('quiz-tip');
        if (questionData.tip) {
            if (quizTipElement) {
                quizTipElement.textContent = `Tip: ${questionData.tip}`;
                quizTipElement.classList.remove('hidden');
            } else {
                const feedbackContainer = document.getElementById('feedback-container');
                const newTipElement = document.createElement('p');
                newTipElement.id = 'quiz-tip';
                newTipElement.className = 'text-lg text-gray-500 mb-4';
                newTipElement.textContent = `Tip: ${questionData.tip}`;
                feedbackContainer.parentNode.insertBefore(newTipElement, feedbackContainer);
            }
        } else {
            if (quizTipElement) {
                quizTipElement.classList.add('hidden');
            }
        }
        document.getElementById('undo-btn').textContent = this.MESSAGES.get('undoButton');
        document.getElementById('prev-btn').textContent = this.MESSAGES.get('prevButton');
        document.getElementById('next-btn').textContent = this.MESSAGES.get('nextButton');
        document.getElementById('quiz-summary-back-to-menu-btn').textContent = this.MESSAGES.get('backToMenu');

        // Update options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        const optionLetters = ['A', 'B', 'C', 'D'];
        optionsToRender.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = "w-full text-left bg-white hover:bg-gray-200 text-gray-800 font-semibold py-3 px-5 rounded-lg shadow-md transition duration-300 flex items-center";
            button.dataset.option = option;
            button.innerHTML = `<span class="font-bold mr-4">${optionLetters[index]}</span><span>${option}</span>`;
            button.addEventListener('click', (e) => this.handleAnswer(e.target.closest('[data-option]').dataset.option));
            optionsContainer.appendChild(button);
        });
        document.getElementById('feedback-container').innerHTML = ''; // Clear feedback
    }

    handleAnswer(selectedOption) {
        const questionData = this.moduleData.data[this.currentIndex];
        const isCorrect = selectedOption === questionData.correct;
        const feedbackHtml = document.getElementById('feedback-container').innerHTML;
        const optionsContainer = document.getElementById('options-container');
        const currentOptions = Array.from(optionsContainer.children).map(button => ({
            option: button.dataset.option,
            className: button.className,
            disabled: button.disabled
        }));

        // If we are not at the end of history (i.e., user has undone some actions),
        // truncate history from historyPointer + 1 onwards.
        if (this.historyPointer < this.history.length - 1) {
            this.history.splice(this.historyPointer + 1);
        }

        const newAction = {
            index: this.currentIndex,
            selectedOption: selectedOption,
            correctAnswer: questionData.correct,
            isCorrect: isCorrect,
            shuffledOptions: currentOptions, // Store the state of the options as they were rendered
            feedbackHtml: feedbackHtml, // Store the feedback HTML
            sessionScoreBefore: { ...this.sessionScore } // Store the session score before this action
        };
        this.history.push(newAction);
        this.historyPointer = this.history.length - 1; // Update history pointer

        console.log('quiz.handleAnswer(): sessionScore before update:', { ...this.sessionScore });
        if (!this.scoreFrozen) { // Only update score if not frozen
            if (isCorrect) {
                this.sessionScore.correct++;
                this.auth.updateGlobalScore({ correct: 1, incorrect: 0 });
            } else {
                this.sessionScore.incorrect++;
                this.auth.updateGlobalScore({ correct: 0, incorrect: 1 });
            }
        }

        // Visual feedback (always apply)
        const selectedOptionElement = document.querySelector(`[data-option="${selectedOption}"]`);
        const correctOptionElement = document.querySelector(`[data-option="${questionData.correct}"]`);

        if (isCorrect) {
            if (selectedOptionElement) {
                selectedOptionElement.classList.add('bg-green-500', 'text-white');
            }
        } else {
            if (selectedOptionElement) {
                selectedOptionElement.classList.add('bg-red-500', 'text-white');
            }
        }

        // Always highlight the correct answer in green
        if (correctOptionElement) {
            correctOptionElement.classList.add('bg-green-500', 'text-white');
        }
        

        document.getElementById('feedback-container').innerHTML = `<p class="text-lg">${questionData.explanation}</p>`;
        document.querySelectorAll('[data-option]').forEach(b => {
            b.disabled = true;
            b.classList.remove('hover:bg-gray-200');
        });
        if (!this.scoreFrozen) { // Only update score display if not frozen
            this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            const optionsDisabled = document.querySelectorAll('[data-option][disabled]').length > 0;
            if (optionsDisabled) {
                // If the current question has been answered, undo it
                this.undo();
            } else {
                // If not answered, just go back to the previous question
                this.scoreFrozen = false; // Reset scoreFrozen when moving to a new question
                this.currentIndex--;
                this.render();
            }
        }
    }

    next() {
        // Prevent advancing if no option has been selected for the current question
        const optionsDisabled = document.querySelectorAll('[data-option][disabled]').length > 0;
        if (!optionsDisabled && this.moduleData.data[this.currentIndex].options) { // Check if it's a quiz question and no option is selected
            // Optionally, provide feedback to the user that an option must be selected
            // For now, just prevent advancement
            return;
        }

        if (this.currentIndex < this.moduleData.data.length - 1) {
            this.scoreFrozen = false; // Reset scoreFrozen when moving to a new question
            this.currentIndex++;
            this.render();
        } else {
            this.showFinalScore();
        }
    }

    undo() {
        if (this.historyPointer >= 0) {
            const lastAction = this.history[this.historyPointer];
            this.historyPointer--;
            this.scoreFrozen = true;

            // Do not revert scores on undo, as per new logic.
            // Scores are only updated when a new answer is submitted.
            // if (lastAction.isCorrect) {
            //     this.sessionScore.correct--;
            //     auth.updateGlobalScore({ correct: -1, incorrect: 0 });
            // } else {
            //     this.sessionScore.incorrect--;
            //     auth.updateGlobalScore({ correct: 0, incorrect: -1 });
            // }

            // Restore the UI state for the undone question
            const optionsContainer = document.getElementById('options-container');
            const feedbackContainer = document.getElementById('feedback-container');

            // Clear feedback
            feedbackContainer.innerHTML = '';

            // Re-enable all options and remove color classes
            document.querySelectorAll('[data-option]').forEach(button => {
                button.disabled = false;
                button.classList.remove('bg-green-500', 'text-white', 'bg-red-500');
                button.classList.add('bg-gray-100', 'hover:bg-gray-200'); // Restore default classes
            });

            // Set current index to the question that was undone
            // Restore the UI state for the undone question
            

            
            this.gameCallbacks.updateSessionScoreDisplay(lastAction.sessionScoreBefore.correct, lastAction.sessionScoreBefore.incorrect, this.moduleData.data.length);
        }
    }

    showFinalScore() {
        this.auth.updateGlobalScore(this.sessionScore);
        this.gameCallbacks.renderHeader();

        if (!document.getElementById('quiz-summary-container')) {
            this.appContainer.innerHTML = `
                 <div id="quiz-summary-container" class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                    <h1 id="quiz-summary-title" class="text-2xl font-bold mb-4">${this.MESSAGES.get('sessionScore')}</h1>
                    <p id="quiz-summary-correct" class="text-xl mb-2">${this.MESSAGES.get('correct')}: ${this.sessionScore.correct}</p>
                    <p id="quiz-summary-incorrect" class="text-xl mb-4">${this.MESSAGES.get('incorrect')}: ${this.sessionScore.incorrect}</p>
                    <button id="quiz-summary-back-to-menu-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4">${this.MESSAGES.get('backToMenu')}</button>
                 </div>
            `;
            document.getElementById('quiz-summary-back-to-menu-btn').addEventListener('click', () => this.gameCallbacks.renderMenu());
        } else {
            document.getElementById('quiz-summary-title').textContent = this.MESSAGES.get('sessionScore');
            document.getElementById('quiz-summary-correct').textContent = `${this.MESSAGES.get('correct')}: ${this.sessionScore.correct}`;
            document.getElementById('quiz-summary-incorrect').textContent = `${this.MESSAGES.get('incorrect')}: ${this.sessionScore.incorrect}`;
            document.getElementById('quiz-summary-back-to-menu-btn').textContent = this.MESSAGES.get('backToMenu');
        }
    }

    updateText() {
        const questionData = this.moduleData.data[this.currentIndex];
        document.getElementById('quiz-question').innerHTML = questionData.sentence.replace('______', '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>');
        const quizTipElement = document.getElementById('quiz-tip');
        if (questionData.tip) {
            if (quizTipElement) {
                quizTipElement.textContent = `Tip: ${questionData.tip}`;
                quizTipElement.classList.remove('hidden');
            } else {
                const feedbackContainer = document.getElementById('feedback-container');
                const newTipElement = document.createElement('p');
                newTipElement.id = 'quiz-tip';
                newTipElement.className = 'text-lg text-gray-500 mb-4';
                newTipElement.textContent = `Tip: ${questionData.tip}`;
                feedbackContainer.parentNode.insertBefore(newTipElement, feedbackContainer);
            }
        } else {
            if (quizTipElement) {
                quizTipElement.classList.add('hidden');
            }
        }

        // Update option texts
        const optionsContainer = document.getElementById('options-container');
        const optionButtons = optionsContainer.querySelectorAll('[data-option]');
        const optionLetters = ['A', 'B', 'C', 'D'];
        // Assuming optionsToRender is still available or can be re-derived if needed
        // For now, let's assume the options are in the same order as they were rendered
        optionButtons.forEach((button, index) => {
            const optionTextSpan = button.querySelector('span:last-child');
            if (optionTextSpan) {
                // This is a bit tricky without knowing the exact order of optionsToRender
                // For simplicity, we'll just update the letter, assuming the text content is static for the current question
                // A more robust solution would involve re-creating the buttons or mapping them to the shuffled options
                optionTextSpan.textContent = button.dataset.option; // Re-set the text content from data-option
            }
            const optionLetterSpan = button.querySelector('span:first-child');
            if (optionLetterSpan) {
                optionLetterSpan.textContent = optionLetters[index];
            }
        });

        // Update button texts
        document.getElementById('undo-btn').textContent = this.MESSAGES.get('undoButton');
        document.getElementById('prev-btn').textContent = this.MESSAGES.get('prevButton');
        document.getElementById('next-btn').textContent = this.MESSAGES.get('nextButton');
        document.getElementById('quiz-summary-back-to-menu-btn').textContent = this.MESSAGES.get('backToMenu');

        // Update feedback container if it has content
        const feedbackContainer = document.getElementById('feedback-container');
        if (feedbackContainer.innerHTML !== '') {
            // If there's feedback, re-render it based on the current language
            // This assumes the feedback message is simple and can be re-generated
            // For more complex feedback, we might need to store the feedback type
            const isCorrect = this.history.length > 0 ? this.history[this.history.length - 1].correct : null;
            if (isCorrect !== null) {
                const lastQuestionData = this.moduleData.data[this.history[this.history.length - 1].index];
                if (isCorrect) {
                    feedbackContainer.innerHTML = `<p class="text-lg">${lastQuestionData.explanation}</p>`;
                } else {
                    feedbackContainer.innerHTML = `<p class="text-lg">${lastQuestionData.explanation}</p>`;
                }
            }
        }
    }
}

export default QuizModule;
