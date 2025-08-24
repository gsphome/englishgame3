// New UI implementation using SOLID principles
import { UIManager } from './ui/UIManager.js';
import { auth } from './auth.js';
import { gameManager } from './gameManager.js';

let uiManager = null;

export const ui = {
    // Properties for backward compatibility
    modal: null,
    explanationModal: null,
    sortingCompletionModal: null,
    hamburgerMenu: null,
    messageElement: null,
    sortingCompletionBackToMenuBtn: null,

    init(appInstance) {
        uiManager = new UIManager(auth, gameManager, appInstance);
        
        // Initialize DOM references for backward compatibility
        this.modal = document.getElementById('confirmation-modal');
        this.explanationModal = document.getElementById('explanation-modal');
        this.sortingCompletionModal = document.getElementById('sorting-completion-modal');
        this.hamburgerMenu = document.getElementById('hamburger-menu');
        this.messageElement = document.getElementById('confirmation-message');
        this.sortingCompletionBackToMenuBtn = document.getElementById('sorting-completion-back-to-menu-btn');
    },

    // Delegate all methods to UIManager
    renderHeader() {
        return uiManager?.renderHeader();
    },

    updateSessionScoreDisplay(correct, incorrect, total) {
        return uiManager?.updateSessionScoreDisplay(correct, incorrect, total);
    },

    toggleHamburgerMenu(show) {
        return uiManager?.toggleHamburgerMenu(show);
    },

    showFlashcardSummary(count) {
        return uiManager?.showFlashcardSummary(count);
    },

    showMatchingSummary(matchedPairs, moduleData) {
        return uiManager?.showMatchingSummary(matchedPairs, moduleData);
    },

    updateFooterVisibility(currentView) {
        return uiManager?.updateFooterVisibility(currentView);
    },

    isMobile() {
        return uiManager?.isMobile() || false;
    },

    // Legacy methods for backward compatibility
    toggleModal(modalElement, show) {
        return uiManager?.toggleModal(modalElement, show);
    },

    showExplanationModal(modalElement, wordData) {
        return uiManager?.showExplanationModal(modalElement, wordData);
    },

    showSortingCompletionModal(moduleData) {
        return uiManager?.showSortingCompletionModal(moduleData);
    },

    updateMenuText() {
        // Delegate to UIManager
        uiManager?.updateAllTexts();
    },

    updateConfirmationModalText() {
        // Handled by UIManager automatically
    },

    updateAboutModalText() {
        // Handled by AboutModalComponent
    },

    updateFlashcardSummaryText() {
        // Handled by GameSummaryComponent
    },

    updateMatchingSummaryText() {
        // Handled by GameSummaryComponent
    },

    updateSortingCompletionModalText() {
        // Handled by SortingCompletionComponent
    },

    updateSettingsModalText() {
        // Handled by SettingsModalComponent
    },

    showAboutModal() {
        return uiManager?.showAboutModal();
    },

    showSettingsModal() {
        return uiManager?.showSettingsModal();
    },

    // Settings related methods - TODO: Move to SettingsComponent
    renderSettingsForm() {
        console.log('renderSettingsForm not yet implemented in new UI');
    },

    getSettingsFormData() {
        console.log('getSettingsFormData not yet implemented in new UI');
        return {};
    },

    applySettingsChanges(formData) {
        console.log('applySettingsChanges not yet implemented in new UI');
    },

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
    },

    // Cleanup
    destroy() {
        uiManager?.destroy();
        uiManager = null;
    }
};