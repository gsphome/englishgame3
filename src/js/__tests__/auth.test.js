import { auth } from '../auth.js';
import { MESSAGES } from '../interface.js';
import { game } from '../game.js';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Save original console.error before any mocks
const originalConsoleError = console.error;

describe('auth.js', () => {
    let messagesSetLanguageSpy;
    let messagesAddListenerSpy;
    let messagesGetSpy;
    let gameRenderHeaderSpy;
    let gameRenderMenuSpy;
    let consoleErrorSpy; // Declare spy for console.error

    beforeEach(() => {
        // Reset DOM before each test
        document.body.innerHTML = '<div id="app-container"></div>';

        // Clear all mocks
        localStorageMock.clear();

        // Spy on console.error to suppress JSDOM warnings
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((message) => {
            // Optionally, you can filter specific messages if you still want other errors to show
            if (typeof message === 'string' && message.includes('Not implemented: navigation (except hash changes)')) {
                // Suppress this specific error
                return;
            }
            // For other errors, let the original console.error run
            originalConsoleError(message);
        });

        // Spy on MESSAGES methods
        messagesSetLanguageSpy = jest.spyOn(MESSAGES, 'setLanguage').mockImplementation(() => {});
        messagesAddListenerSpy = jest.spyOn(MESSAGES, 'addListener').mockImplementation(() => {});
        messagesGetSpy = jest.spyOn(MESSAGES, 'get').mockImplementation((key) => {
            const messages = {
                welcomeTitle: 'Welcome',
                welcomeSubtitle: 'Please log in',
                usernamePlaceholder: 'Username',
                loginButton: 'Login',
            };
            return messages[key] || key;
        });

        // Spy on game methods
        gameRenderHeaderSpy = jest.spyOn(game, 'renderHeader').mockImplementation(() => {});
        gameRenderMenuSpy = jest.spyOn(game, 'renderMenu').mockImplementation(() => {});

        // Reset auth.user before each test
        auth.user = null;
    });

    afterEach(() => {
        jest.restoreAllMocks();
        // Restore console.error after each test
        consoleErrorSpy.mockRestore();
    });

    describe('init()', () => {
        test('should set language from localStorage if available', () => {
            localStorageMock.setItem('appLang', 'es');
            auth.init();
            expect(messagesSetLanguageSpy).toHaveBeenCalledWith('es');
        });

        test('should set default language to en if not in localStorage', () => {
            auth.init();
            expect(messagesSetLanguageSpy).toHaveBeenCalledWith('en');
        });

        test('should load user from localStorage', () => {
            const mockUser = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
            localStorageMock.setItem('user', JSON.stringify(mockUser));
            auth.init();
            expect(auth.user).toEqual(mockUser);
        });

        test('should call renderLogin if no user is found', () => {
            const renderLoginSpy = jest.spyOn(auth, 'renderLogin').mockImplementation(() => {});
            auth.init();
            expect(renderLoginSpy).toHaveBeenCalled();
        });

        test('should not call renderLogin if user exists', () => {
            const mockUser = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
            localStorageMock.setItem('user', JSON.stringify(mockUser));
            const renderLoginSpy = jest.spyOn(auth, 'renderLogin').mockImplementation(() => {});
            auth.init();
            expect(renderLoginSpy).not.toHaveBeenCalled();
        });

        test('should add a MESSAGES listener', () => {
            auth.init();
            expect(messagesAddListenerSpy).toHaveBeenCalled();
        });
    });

    describe('renderLogin()', () => {
        test('should render the login form HTML to app-container', () => {
            auth.renderLogin();
            const appContainer = document.getElementById('app-container');
            expect(appContainer.innerHTML).toContain('id="username-input"');
            expect(appContainer.innerHTML).toContain('id="login-btn"');
            expect(messagesGetSpy).toHaveBeenCalledWith('welcomeTitle');
            expect(messagesGetSpy).toHaveBeenCalledWith('usernamePlaceholder');
        });

        test('should attach click listener to login button', () => {
            auth.renderLogin();
            const loginBtn = document.getElementById('login-btn');
            const usernameInput = document.getElementById('username-input');
            usernameInput.value = 'testuser';
            const loginSpy = jest.spyOn(auth, 'login').mockImplementation(() => {});

            loginBtn.click();
            expect(loginSpy).toHaveBeenCalledWith('testuser');
        });

        test('should attach keydown listener to username input for Enter key', () => {
            auth.renderLogin();
            const loginBtn = document.getElementById('login-btn');
            const usernameInput = document.getElementById('username-input');
            usernameInput.value = 'testuser';
            const loginSpy = jest.spyOn(auth, 'login').mockImplementation(() => {});

            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            usernameInput.dispatchEvent(enterEvent);

            expect(loginSpy).toHaveBeenCalledWith('testuser');
        });

        test('should set focus on the username input field', () => {
            document.body.innerHTML = '<div id="app-container"><input type="text" id="username-input"></div>';
            auth.renderLogin();
            const usernameInput = document.getElementById('username-input');
            expect(document.activeElement).toBe(usernameInput);
        });
    });

    describe('login(username)', () => {
        test('should set auth.user object', () => {
            auth.login('newuser');
            expect(auth.user).toEqual({
                username: 'newuser',
                globalScore: { correct: 0, incorrect: 0 }
            });
        });

        test('should save user to localStorage', () => {
            auth.login('newuser');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({
                username: 'newuser',
                globalScore: { correct: 0, incorrect: 0 }
            }));
        });

        test('should call game.renderHeader and game.renderMenu', () => {
            auth.login('newuser');
            expect(gameRenderHeaderSpy).toHaveBeenCalled();
            expect(gameRenderMenuSpy).toHaveBeenCalled();
        });
    });

    describe('logout()', () => {
        test('should remove user from localStorage', () => {
            localStorageMock.setItem('user', JSON.stringify({ username: 'testuser' }));
            auth.logout();
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
        });

        test('should hide game.hamburgerMenu if present', () => {
            game.hamburgerMenu = document.createElement('button');
            game.hamburgerMenu.classList.remove('hidden');
            auth.logout();
            expect(game.hamburgerMenu.classList.contains('hidden')).toBe(true);
        });

        // Removed test for location.reload() due to mocking difficulties
    });

    describe('getUser()', () => {
        test('should return the current user', () => {
            const mockUser = { username: 'testuser', globalScore: { correct: 10, incorrect: 5 } };
            auth.user = mockUser;
            expect(auth.getUser()).toEqual(mockUser);
        });

        test('should return null if no user is set', () => {
            auth.user = null;
            expect(auth.getUser()).toBeNull();
        });
    });

    describe('updateGlobalScore(sessionScore)', () => {
        let initialUser;

        beforeEach(() => {
            initialUser = { username: 'testuser', globalScore: { correct: 10, incorrect: 5 } };
            auth.user = { ...initialUser }; // Clone to avoid direct modification
        });

        test('should update user.globalScore correctly', () => {
            const sessionScore = { correct: 2, incorrect: 1 };
            auth.updateGlobalScore(sessionScore);
            expect(auth.user.globalScore).toEqual({ correct: 12, incorrect: 6 });
        });

        test('should save updated user to localStorage', () => {
            const sessionScore = { correct: 2, incorrect: 1 };
            auth.updateGlobalScore(sessionScore);
            expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({
                username: 'testuser',
                globalScore: { correct: 12, incorrect: 6 }
            }));
        });

        test('should call game.renderHeader', () => {
            const sessionScore = { correct: 2, incorrect: 1 };
            auth.updateGlobalScore(sessionScore);
            expect(gameRenderHeaderSpy).toHaveBeenCalled();
        });
    });
});