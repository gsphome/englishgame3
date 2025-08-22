import { auth } from '../auth.js';
import { MESSAGES } from '../interface.js';
import { game } from '../game.js';
jest.mock('../utils.js');
import * as utils from '../utils.js';

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





describe('auth.js', () => {
    let messagesSetLanguageSpy;
    let messagesAddListenerSpy;
    let messagesGetSpy;
    let gameRenderMenuSpy;
    let renderHeaderSpy; // Add this line
    let toggleHamburgerMenuSpy; // Add this line

    beforeEach(() => {
        // Reset DOM before each test
        document.body.innerHTML = '<div id="app-container"></div>';

        // Clear all mocks
        localStorageMock.clear();

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

        // Spy on imported functions and game methods
        renderHeaderSpy = jest.spyOn(utils, 'renderHeader').mockImplementation(() => {}); // Modify this line
        gameRenderMenuSpy = jest.spyOn(game, 'renderMenu').mockImplementation(() => {});
        toggleHamburgerMenuSpy = jest.spyOn(utils, 'toggleHamburgerMenu').mockImplementation(() => {});

        // Reset auth.user before each test
        auth.user = null;
    });

    afterEach(() => {
        jest.restoreAllMocks();
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

        test('should set default language to en if appLang is not in localStorage', () => {
            localStorageMock.removeItem('appLang'); // Ensure appLang is not in localStorage
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
            // Get the listener function that was added
            const listenerCallback = messagesAddListenerSpy.mock.calls[0][0];
            // Manually trigger the listener
            listenerCallback();
            expect(renderLoginSpy).toHaveBeenCalled();
        });

        test('should not call renderLogin if user exists', () => {
            const mockUser = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
            localStorageMock.setItem('user', JSON.stringify(mockUser));
            const renderLoginSpy = jest.spyOn(auth, 'renderLogin').mockImplementation(() => {});
            auth.init();
            expect(renderLoginSpy).not.toHaveBeenCalled();
        });

        test('should not call renderLogin if user is found in localStorage on init', () => {
            const renderLoginSpy = jest.spyOn(auth, 'renderLogin').mockImplementation(() => {});
            const mockUser = { username: 'existinguser', globalScore: { correct: 10, incorrect: 5 } };
            localStorageMock.setItem('user', JSON.stringify(mockUser));
            auth.init();
            expect(renderLoginSpy).not.toHaveBeenCalled();
            expect(auth.user).toEqual(mockUser);
        });

        test('should add a MESSAGES listener', () => {
            auth.init();
            expect(messagesAddListenerSpy).toHaveBeenCalled();
        });

        test('should not call renderLogin if user exists when MESSAGES listener is triggered', () => {
            const renderLoginSpy = jest.spyOn(auth, 'renderLogin').mockImplementation(() => {});
            const mockUser = { username: 'testuser', globalScore: { correct: 0, incorrect: 0 } };
            localStorageMock.setItem('user', JSON.stringify(mockUser)); // Simulate user exists
            auth.init();

            // Get the listener function that was added
            const listenerCallback = messagesAddListenerSpy.mock.calls[0][0];
            
            // Manually trigger the listener
            listenerCallback();

            expect(renderLoginSpy).not.toHaveBeenCalled();
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

        test('should call renderHeader and game.renderMenu', () => { // Updated test description
            auth.login('newuser');
            expect(renderHeaderSpy).toHaveBeenCalled(); // Use the new spy
            expect(gameRenderMenuSpy).toHaveBeenCalled();
        });
    });

    describe('logout()', () => {
        let reloadPageSpy;

        beforeEach(() => {
            reloadPageSpy = jest.spyOn(auth, '_reloadPage').mockImplementation(() => {});
        });

        afterEach(() => {
            reloadPageSpy.mockRestore();
        });

        test('should remove user from localStorage and reload page', () => {
            localStorageMock.setItem('user', JSON.stringify({ username: 'testuser' }));
            auth.logout();
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
            expect(reloadPageSpy).toHaveBeenCalled();
        });
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

        test('should call renderHeader', () => { // Updated test description
            const sessionScore = { correct: 2, incorrect: 1 };
            auth.updateGlobalScore(sessionScore);
            expect(renderHeaderSpy).toHaveBeenCalled(); // Use the new spy
        });
    });

    describe('_reloadPage()', () => {
        test('should call the provided reload function', () => {
            const mockReloadFn = jest.fn();
            auth._reloadPage(mockReloadFn);
            expect(mockReloadFn).toHaveBeenCalled();
        });

        test('should call _internalReloadPage() by default', () => {
            const internalReloadSpy = jest.spyOn(auth, '_internalReloadPage').mockImplementation(() => {});
            auth._reloadPage();
            expect(internalReloadSpy).toHaveBeenCalled();
            internalReloadSpy.mockRestore();
        });
    });

    
});