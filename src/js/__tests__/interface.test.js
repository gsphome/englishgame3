import { MESSAGES } from '../interface';

describe('MESSAGES', () => {
    test('should have a default language of English', () => {
        expect(MESSAGES._currentLanguage).toBe('en');
    });

    test('should return the correct message for a given key in the current language', () => {
        expect(MESSAGES.get('welcomeTitle')).toBe('Start Your English Journey!');
        MESSAGES.setLanguage('es');
        expect(MESSAGES.get('welcomeTitle')).toBe('¡Empieza tu Viaje en Inglés!');
    });

    test('should change the current language when setLanguage is called with a valid language', () => {
        MESSAGES.setLanguage('es');
        expect(MESSAGES._currentLanguage).toBe('es');
        MESSAGES.setLanguage('en'); // Reset for other tests
        expect(MESSAGES._currentLanguage).toBe('en');
    });

    test('should not change the language if an invalid language is provided', () => {
        const originalLanguage = MESSAGES._currentLanguage;
        MESSAGES.setLanguage('fr'); // 'fr' is not a defined language
        expect(MESSAGES._currentLanguage).toBe(originalLanguage);
    });

    test('should notify listeners when the language changes', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        MESSAGES.addListener(listener1);
        MESSAGES.addListener(listener2);

        MESSAGES.setLanguage('es');

        expect(listener1).toHaveBeenCalledWith('es');
        expect(listener2).toHaveBeenCalledWith('es');

        MESSAGES.setLanguage('en'); // Reset for other tests
    });

    test('should return the current language', () => {
        MESSAGES.setLanguage('es');
        expect(MESSAGES.getLanguage()).toBe('es');
        MESSAGES.setLanguage('en'); // Reset
        expect(MESSAGES.getLanguage()).toBe('en');
    });
});

// Mock DOM elements for the about modal logic
document.body.innerHTML = `
    <button id="menu-about-btn"></button>
    <div id="about-modal" class="hidden">
        <button id="close-about-modal-btn"></button>
    </div>
    <div id="menu-overlay"></div>
    <div id="hamburger-menu" class="translate-x-full"></div>
`;

// Manually dispatch DOMContentLoaded to trigger event listeners in interface.js
document.dispatchEvent(new Event('DOMContentLoaded'));

// Re-import interface.js to ensure DOMContentLoaded listener runs with mocked DOM
// This is a common pattern in Jest for DOM-related tests
import '../interface';

describe('About Modal Logic', () => {
    const aboutBtn = document.getElementById('menu-about-btn');
    const aboutModal = document.getElementById('about-modal');
    const closeAboutModalBtn = document.getElementById('close-about-modal-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const hamburgerMenu = document.getElementById('hamburger-menu');

    beforeEach(() => {
        // Reset modal state before each test
        aboutModal.classList.add('hidden');
        hamburgerMenu.classList.add('translate-x-full');
        hamburgerMenu.classList.remove('translate-x-0');
    });

    test('should open the about modal and close hamburger menu when about button is clicked', () => {
        aboutBtn.click();
        expect(aboutModal.classList.contains('hidden')).toBe(false);
        expect(hamburgerMenu.classList.contains('translate-x-full')).toBe(true);
        expect(hamburgerMenu.classList.contains('translate-x-0')).toBe(false);
    });

    test('should close the about modal when close button is clicked', () => {
        aboutModal.classList.remove('hidden'); // Open it first
        closeAboutModalBtn.click();
        expect(aboutModal.classList.contains('hidden')).toBe(true);
    });

    test('should close the about modal when overlay is clicked', () => {
        aboutModal.classList.remove('hidden'); // Open it first
        menuOverlay.click();
        expect(aboutModal.classList.contains('hidden')).toBe(true);
    });

    test('should close the about modal when Enter key is pressed and modal is open', () => {
        aboutModal.classList.remove('hidden'); // Open it first
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        document.dispatchEvent(event);
        expect(aboutModal.classList.contains('hidden')).toBe(true);
    });

    test('should not close the about modal when Enter key is pressed and modal is hidden', () => {
        aboutModal.classList.add('hidden'); // Ensure it's hidden
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        document.dispatchEvent(event);
        expect(aboutModal.classList.contains('hidden')).toBe(true); // Should remain hidden
    });

    test('should not close the about modal when a non-Enter key is pressed', () => {
        aboutModal.classList.remove('hidden'); // Open it first
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
        expect(aboutModal.classList.contains('hidden')).toBe(false); // Should remain open
    });
});
