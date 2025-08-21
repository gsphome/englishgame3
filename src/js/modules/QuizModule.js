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
        this.isViewingHistory = false; // New flag
    }

    init(module) {
        this.currentIndex = 0;
        this.sessionScore = { correct: 0, incorrect: 0 };
        this.history = [];
        this.historyPointer = -1; // Initialize history pointer
        this.moduleData = module;
        this.appContainer = document.getElementById('app-container');
        this.scoreFrozen = false;
        this.isViewingHistory = false; // Reset on init

        if (this.gameCallbacks.randomMode && Array.isArray(this.moduleData.data)) {
            this.moduleData.data = this.gameCallbacks.shuffleArray([...this.moduleData.data]);
        }
        this.render();
        this.updateNavigationButtons(); // Update buttons after initial render
    }

    render(historyEntry = null) {
        if (!this.moduleData || !Array.isArray(this.moduleData.data) || this.moduleData.data.length === 0) {
            console.error("Quiz module data is invalid or empty.");
            this.gameCallbacks.renderMenu();
            return;
        }
        const questionData = this.moduleData.data[this.currentIndex];
        
        if (!document.getElementById('quiz-container')) {
            this.appContainer.innerHTML = `
                <div id="quiz-container" class="max-w-2xl mx-auto">
                    <div class="bg-white p-8 rounded-lg shadow-md">
                        <p class="text-base mb-6 md:text-xl" id="quiz-question"></p>
                        ${questionData.tip ? `<p class="text-lg text-gray-500 mb-4" id="quiz-tip">Tip: ${questionData.tip}</p>` : ''}
                        <div id="options-container" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                        <div id="feedback-container" class="mt-6" style="min-height: 5rem;"></div>
                    </div>
                    <div class="flex justify-between mt-4">
                        <button id="undo-btn" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4"></button>
                        <div>
                            <button id="prev-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l md:py-2 md:px-4"></button>
                            <button id="next-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r md:py-2 md:px-4"></button>
                        </div>
                    </div>
                    <button id="quiz-summary-back-to-menu-btn" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg md:py-2 md:px-4"></button>
                </div>
            `;
            document.getElementById('prev-btn').addEventListener('click', () => this.prev());
            document.getElementById('next-btn').addEventListener('click', () => this.next());
            document.getElementById('undo-btn').addEventListener('click', () => this.undo());
            document.getElementById('quiz-summary-back-to-menu-btn').addEventListener('click', () => this.gameCallbacks.renderMenu());
        }

    this.appContainer.classList.remove('main-menu-active');
        document.getElementById('quiz-question').innerHTML = questionData.sentence.replace('______', '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>');
        
        let optionsToRender = [...questionData.options];
        // Only shuffle if not viewing history AND not rendering a specific history entry
        if (this.gameCallbacks.randomMode && !this.isViewingHistory && !historyEntry) {
            optionsToRender = this.gameCallbacks.shuffleArray(optionsToRender);
        } else if (historyEntry && historyEntry.shuffledOptions) {
            // If rendering a history entry, use its shuffled options to maintain order
            optionsToRender = historyEntry.shuffledOptions.map(opt => opt.option);
        }

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        const optionLetters = ['A', 'B', 'C', 'D'];
        optionsToRender.forEach((option, index) => {
            const button = document.createElement('button');
            // Base class for all options
            let classes = "w-full text-left text-gray-800 font-semibold py-3 px-5 rounded-lg shadow-md transition duration-300 flex items-center";
            
            if (historyEntry) {
                // If rendering a history entry, apply specific styling and disable
                button.disabled = true;
                if (option === historyEntry.selectedOption) {
                    if (historyEntry.isCorrect) {
                        classes += ' bg-green-500 text-white';
                    } else {
                        classes += ' bg-red-500 text-white';
                    }
                } else if (option === historyEntry.correctAnswer) {
                    classes += ' bg-green-500 text-white';
                } else {
                    classes += ' bg-white'; // Unselected options in history view are white
                }
            } else {
                // Normal unanswered state
                classes += ' bg-gray-100 hover:bg-gray-200';
                button.disabled = false; // Ensure enabled for unanswered questions
            }
            button.className = classes;

            button.dataset.option = option;
            button.innerHTML = `<span class="font-bold mr-4">${optionLetters[index]}</span><span>${option}</span>`;
            button.addEventListener('click', (e) => this.handleAnswer(e.target.closest('[data-option]').dataset.option));
            optionsContainer.appendChild(button);
        });

        let quizTipElement = document.getElementById('quiz-tip');
        if (questionData.tip) {
            if (quizTipElement) {
                quizTipElement.textContent = `Tip: ${questionData.tip}`;
                quizTipElement.classList.remove('hidden');
            } else {
                quizTipElement = document.createElement('p');
                quizTipElement.id = 'quiz-tip';
                quizTipElement.className = 'text-lg text-gray-500 mb-4';
                document.getElementById('quiz-question').after(quizTipElement);
                quizTipElement.textContent = `Tip: ${questionData.tip}`;
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

        const feedbackContainer = document.getElementById('feedback-container');
        if (historyEntry) {
            feedbackContainer.innerHTML = historyEntry.feedbackHtml;
            this.gameCallbacks.updateSessionScoreDisplay(historyEntry.sessionScoreBefore.correct, historyEntry.sessionScoreBefore.incorrect, this.moduleData.data.length);
        } else {
            feedbackContainer.innerHTML = ''; // Clear feedback for normal unanswered state
            this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        }
        this.updateNavigationButtons(); // Update buttons after render
    }

    handleAnswer(selectedOption) {
        const questionData = this.moduleData.data[this.currentIndex];
        const isCorrect = selectedOption === questionData.correct;
        const feedbackHtml = `<p class="text-lg">${questionData.explanation}</p>`; // Capture feedback HTML here
        const optionsContainer = document.getElementById('options-container');
        const currentOptions = Array.from(optionsContainer.children).map(button => ({
            option: button.dataset.option,
            className: button.className,
            disabled: button.disabled
        }));

        this.isViewingHistory = false; // No longer viewing history when a new answer is given

        if (this.historyPointer < this.history.length - 1) {
            this.history.splice(this.historyPointer + 1);
        }

        const newAction = {
            index: this.currentIndex,
            selectedOption: selectedOption,
            correctAnswer: questionData.correct,
            isCorrect: isCorrect,
            shuffledOptions: currentOptions, 
            feedbackHtml: feedbackHtml, 
            sessionScoreBefore: { ...this.sessionScore } 
        };
        this.history.push(newAction);
        this.historyPointer = this.history.length - 1; 

        if (!this.scoreFrozen) { 
            if (isCorrect) {
                this.sessionScore.correct++;
                this.auth.updateGlobalScore({ correct: 1, incorrect: 0 });
            } else {
                this.sessionScore.incorrect++;
                this.auth.updateGlobalScore({ correct: 0, incorrect: 1 });
            }
        }

        const selectedOptionElement = document.querySelector(`[data-option="${selectedOption}"]`);
        const correctOptionElement = document.querySelector(`[data-option="${questionData.correct}"]`);

                        document.querySelectorAll('[data-option]').forEach(b => {
                    b.disabled = true;
                    // Remove all background-related classes before adding new ones
                    b.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'bg-white', 'bg-green-500', 'bg-red-500');
                });

        if (isCorrect) {
            if (selectedOptionElement) {
                selectedOptionElement.classList.add('bg-green-500', 'text-white');
            }
            document.querySelectorAll('[data-option]').forEach(b => {
                if (b !== correctOptionElement) {
                    b.classList.add('bg-white');
                }
            });
        } else {
            if (selectedOptionElement) {
                selectedOptionElement.classList.add('bg-red-500', 'text-white');
            }
        }

        if (correctOptionElement) {
            correctOptionElement.classList.add('bg-green-500', 'text-white');
        }
        

        document.getElementById('feedback-container').innerHTML = feedbackHtml;
        
        if (!this.scoreFrozen) { 
            this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        }
        this.updateNavigationButtons(); // Update buttons after handling answer
    }

    prev() {
        if (this.isViewingHistory) {
            if (this.historyPointer > 0) {
                this.historyPointer--;
                this.renderHistoryState();
            } else {
                // If we are at the beginning of history, go to the actual previous question
                this.isViewingHistory = false;
                this.scoreFrozen = false;
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    this.render();
                }
            }
        } else {
            const optionsDisabled = document.querySelectorAll('[data-option][disabled]').length > 0;
            if (optionsDisabled) {
                // If current question is answered, and we are not viewing history,
                // start viewing history from the current question's history entry
                const currentQuestionHistoryEntry = this.history.find(entry => entry.index === this.currentIndex);
                if (currentQuestionHistoryEntry) {
                    this.historyPointer = this.history.indexOf(currentQuestionHistoryEntry);
                    this.isViewingHistory = true;
                    this.renderHistoryState();
                } else if (this.currentIndex > 0) { // If no history for current, just go back to previous question
                    this.currentIndex--;
                    this.render();
                }
            } else if (this.currentIndex > 0) {
                this.scoreFrozen = false;
                this.currentIndex--;
                this.render();
            }
        }
        this.updateNavigationButtons(); // Update buttons after prev
    }

    next() {
        if (this.isViewingHistory) {
            if (this.historyPointer < this.history.length - 1) {
                this.historyPointer++;
                this.renderHistoryState();
            } else {
                // If we are at the end of history, go to the next actual question
                this.isViewingHistory = false;
                this.scoreFrozen = false;
                if (this.currentIndex < this.moduleData.data.length - 1) {
                    this.currentIndex++;
                    this.render();
                } else {
                    this.showFinalScore();
                }
            }
        } else {
            const optionsDisabled = document.querySelectorAll('[data-option][disabled]').length > 0;
            if (!optionsDisabled && this.moduleData.data[this.currentIndex].options) { 
                return; // Current question not answered yet
            }

            if (this.currentIndex < this.moduleData.data.length - 1) {
                this.scoreFrozen = false; 
                this.currentIndex++;
                this.render();
            } else {
                this.showFinalScore();
            }
        }
        this.updateNavigationButtons(); // Update buttons after next
    }

    undo() {
        if (this.isViewingHistory) {
            // If viewing history, undo button should be disabled or have different behavior
            // For now, let's just return if in history viewing mode
            return;
        }

        if (this.historyPointer >= 0) {
            const lastAction = this.history[this.historyPointer];
            this.history.pop(); // Remove the last action
            this.historyPointer--; // Move pointer back

            this.scoreFrozen = false; // Allow score to be updated again after undo

            // Revert score
            this.sessionScore = { ...lastAction.sessionScoreBefore };

            // Re-render the question that was just undone
            this.currentIndex = lastAction.index;
            this.render(); // Render the question in its initial state (unanswered)

            // Re-enable options and remove styling
            document.querySelectorAll('[data-option]').forEach(button => {
                button.disabled = false;
                button.classList.remove('bg-green-500', 'text-white', 'bg-red-500', 'bg-white');
                button.classList.add('bg-gray-100', 'hover:bg-gray-200');
            });

            document.getElementById('feedback-container').innerHTML = ''; // Clear feedback

            this.gameCallbacks.updateSessionScoreDisplay(this.sessionScore.correct, this.sessionScore.incorrect, this.moduleData.data.length);
        }
        this.updateNavigationButtons(); // Update buttons after undo
    }

    renderHistoryState() {
        if (this.historyPointer < 0 || this.historyPointer >= this.history.length) {
            console.error("Invalid history pointer for rendering history state.");
            this.isViewingHistory = false;
            this.render(); // Fallback to normal render
            return;
        }

        const historyEntry = this.history[this.historyPointer];
        this.currentIndex = historyEntry.index;
        this.scoreFrozen = true; // Always freeze score when viewing history
        this.isViewingHistory = true; // Ensure flag is set

        // 1. Render the question in its default, unanswered state
        this.render(); // This will create fresh buttons with default styling

        // 2. Now, apply the historical selections and feedback
        const optionsContainer = document.getElementById('options-container');
        const allOptionButtons = optionsContainer.querySelectorAll('[data-option]');

        // First, disable all and set to default background (bg-white)
        allOptionButtons.forEach(b => {
            b.disabled = true;
            b.classList.remove('hover:bg-gray-200', 'bg-gray-100'); // Remove default background and hover
            b.classList.add('bg-white'); // Set to white background
        });

        // Then, apply correct/incorrect styling
        const reSelectedOptionElement = document.querySelector(`[data-option="${historyEntry.selectedOption}"]`);
        const reCorrectOptionElement = document.querySelector(`[data-option="${historyEntry.correctAnswer}"]`);

        if (reSelectedOptionElement) {
            if (historyEntry.isCorrect) {
                reSelectedOptionElement.classList.add('bg-green-500', 'text-white');
            } else {
                reSelectedOptionElement.classList.add('bg-red-500', 'text-white');
            }
        }

        if (reCorrectOptionElement) {
            reCorrectOptionElement.classList.add('bg-green-500', 'text-white');
        }

        document.getElementById('feedback-container').innerHTML = historyEntry.feedbackHtml;

        // Update score display to reflect the score at the time of this history entry
        this.gameCallbacks.updateSessionScoreDisplay(historyEntry.sessionScoreBefore.correct, historyEntry.sessionScoreBefore.incorrect, this.moduleData.data.length);

        this.updateNavigationButtons(); // Update buttons after rendering history state
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
        let quizTipElement = document.getElementById('quiz-tip'); // Use let
        if (questionData.tip) {
            if (quizTipElement) {
                quizTipElement.textContent = `Tip: ${questionData.tip}`;
                quizTipElement.classList.remove('hidden');
            } else {
                // Create the tip element if it doesn't exist
                quizTipElement = document.createElement('p'); // Assign to quizTipElement
                quizTipElement.id = 'quiz-tip';
                quizTipElement.className = 'text-lg text-gray-500 mb-4';
                document.getElementById('quiz-question').after(quizTipElement); // Insert after question
                quizTipElement.textContent = `Tip: ${questionData.tip}`;
            }
        } else {
            if (quizTipElement) {
                quizTipElement.classList.add('hidden');
            }
        }

        const optionsContainer = document.getElementById('options-container');
        const optionButtons = optionsContainer.querySelectorAll('[data-option]');
        const optionLetters = ['A', 'B', 'C', 'D'];
        optionButtons.forEach((button, index) => {
            const optionTextSpan = button.querySelector('span:last-child');
            if (optionTextSpan) {
                optionTextSpan.textContent = button.dataset.option; 
            }
            const optionLetterSpan = button.querySelector('span:first-child');
            if (optionLetterSpan) {
                optionLetterSpan.textContent = optionLetters[index];
            }
        });

        document.getElementById('undo-btn').textContent = this.MESSAGES.get('undoButton');
        document.getElementById('prev-btn').textContent = this.MESSAGES.get('prevButton');
        document.getElementById('next-btn').textContent = this.MESSAGES.get('nextButton');
        document.getElementById('quiz-summary-back-to-menu-btn').textContent = this.MESSAGES.get('backToMenu');

        const feedbackContainer = document.getElementById('feedback-container');
        // Only update feedback if not in history viewing mode, or if it's the current history entry's feedback
        if (!this.isViewingHistory && this.history.length > 0 && this.historyPointer === this.history.length - 1) {
            const lastQuestionData = this.moduleData.data[this.history[this.history.length - 1].index];
            feedbackContainer.innerHTML = `<p class="text-lg">${lastQuestionData.explanation}</p>`;
        } else if (this.isViewingHistory && this.historyPointer >= 0) {
            feedbackContainer.innerHTML = this.history[this.historyPointer].feedbackHtml;
        } else {
            feedbackContainer.innerHTML = ''; // Clear feedback if no relevant history or not viewing history
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const undoBtn = document.getElementById('undo-btn');

        if (!prevBtn || !nextBtn || !undoBtn) {
            // Buttons might not be rendered yet
            return;
        }

        if (this.isViewingHistory) {
            // In history viewing mode
            prevBtn.disabled = this.historyPointer <= 0;
            nextBtn.disabled = this.historyPointer >= this.history.length - 1;
            undoBtn.disabled = true; // Undo is blocked in history view
        } else {
            // Normal quiz mode
            const currentQuestionAnswered = document.querySelectorAll('[data-option][disabled]').length > 0;

            prevBtn.disabled = this.currentIndex === 0 && !currentQuestionAnswered; // Disabled if at Q0 and not answered
            nextBtn.disabled = !currentQuestionAnswered; // Disabled if not answered

            // Undo is disabled if no history, or if the current question is not the one that was last answered
            const lastAction = this.history[this.historyPointer];
            undoBtn.disabled = this.history.length === 0 || this.historyPointer < 0 || (lastAction && lastAction.index !== this.currentIndex);
        }
    }
}

export default QuizModule;
