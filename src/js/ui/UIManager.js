// Main UI Manager that coordinates all UI components
import { HeaderComponent } from './HeaderComponent.js';
import { HamburgerMenuComponent } from './HamburgerMenuComponent.js';
import { ConfirmationModalComponent } from './ConfirmationModalComponent.js';
import { GameSummaryComponent } from './GameSummaryComponent.js';
import { FooterComponent } from './FooterComponent.js';
import { SortingCompletionComponent } from './SortingCompletionComponent.js';
import { MESSAGES } from '../i18n.js';

export class UIManager {
    constructor(auth, gameManager, app) {
        this.auth = auth;
        this.gameManager = gameManager;
        this.app = app;
        this.components = {};
        this.init();
    }

    init() {
        // Initialize all components
        this.components.header = new HeaderComponent(this.auth);
        this.components.hamburgerMenu = new HamburgerMenuComponent(this.app);
        this.components.confirmationModal = new ConfirmationModalComponent(this.auth);
        this.components.gameSummary = new GameSummaryComponent(this.gameManager, this.app);
        this.components.footer = new FooterComponent();
        this.components.sortingCompletion = new SortingCompletionComponent(this.gameManager, this.app);

        // Setup i18n listeners
        this.setupI18nListeners();
        
        // Initial updates
        this.updateAllTexts();
    }

    setupI18nListeners() {
        MESSAGES.addListener(() => this.updateAllTexts());
    }

    updateAllTexts() {
        this.components.header.render();
        this.components.hamburgerMenu.updateText();
        this.components.confirmationModal.updateText();
        this.components.footer.updateText();
    }

    // Delegate methods to specific components
    renderHeader() {
        this.components.header.render();
    }

    updateSessionScoreDisplay(correct, incorrect, total) {
        this.components.header.updateSessionScore(correct, incorrect, total);
    }

    toggleHamburgerMenu(show) {
        this.components.hamburgerMenu.toggle(show);
    }

    showLogoutConfirmation() {
        this.components.confirmationModal.showLogoutConfirmation();
    }

    showFlashcardSummary(count) {
        this.components.gameSummary.showFlashcardSummary(count);
    }

    showMatchingSummary(matchedPairs, moduleData) {
        this.components.gameSummary.showMatchingSummary(matchedPairs, moduleData);
    }

    updateFooterVisibility(currentView) {
        this.components.footer.updateVisibility(currentView);
    }

    showSortingCompletionModal(moduleData) {
        this.components.sortingCompletion.show(moduleData);
    }

    // Utility methods
    isMobile() {
        return window.innerWidth <= 768;
    }

    // Legacy methods for backward compatibility
    toggleModal(modalElement, show) {
        if (modalElement) {
            modalElement.classList.toggle('hidden', !show);
        }
    }

    showExplanationModal(modalElement, wordData) {
        if (!modalElement) return;
        
        document.getElementById('explanation-word').textContent = wordData.word;
        document.getElementById('explanation-word-translation').textContent = wordData.translation_es;
        document.getElementById('explanation-example-en').textContent = `"${wordData.example}"`;
        document.getElementById('explanation-example-es').textContent = `"${wordData.example_es}"`;
        document.body.appendChild(modalElement);
        modalElement.classList.remove('hidden');
    }

    // Cleanup method
    destroy() {
        Object.values(this.components).forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
    }
}