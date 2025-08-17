const MESSAGES = {
    _currentLanguage: 'en', // Default language
    _listeners: [],

    es: {
        loginTitle: "Bienvenido",
        welcomeTitle: "¡Empieza tu Viaje en Inglés!",
        welcomeSubtitle: "Practica, aprende y domina el inglés con ejercicios divertidos.",
        loginButton: "Iniciar Sesión",
        logoutButton: "Cerrar Sesión",
        globalScore: "Puntaje Global",
        mainMenu: "Menú Principal",
        nextButton: "Siguiente",
        prevButton: "Anterior",
        undoButton: "Deshacer",
        backToMenu: "Volver al Menú",
        sessionScore: "Puntaje de la Sesión",
        correct: "Correcto",
        incorrect: "Incorrecto",
        confirmLogout: "Confirmar Cierre de Sesión",
        confirmLogoutMessage: "¿Estás seguro de que quieres cerrar sesión?",
        flashcardSummaryMessage: "¡Felicidades! Has estudiado {count} tarjetas.",
        usernamePlaceholder: "Ingresa tu nombre",
        randomMode: "Aleatorio",
        sortingGameTitle: "Juego de Clasificación de Palabras",
        checkButton: "Comprobar",
        allCorrectMessage: "¡Todo correcto! ¡Bien hecho!",
        lightMode: "Modo Claro",
        darkMode: "Modo Oscuro",
        footerWeb: "Advanced Learning App",
        footerMobile: "App de Aprendizaje Avanzado",
        sortingCompletionTitle: "¡Modo de Clasificación Completado!",
        sortingCompletionMessage: "¡Has clasificado todas las palabras correctamente!",
        replayButton: "Ver Resumen",
        translationLabel: "Traducción",
        matchingGameTitle: "Juego de Emparejamiento",
        matchingCompletionMessage: "¡Has emparejado todos los elementos correctamente!",
        terms: "Términos",
        definitions: "Definiciones",
        resetButton: "Reiniciar",
        moreInfoButton: "Más Información",
        showExplanation: "Mostrar Explicación"
    },
    en: {
        loginTitle: "Welcome",
        welcomeTitle: "Start Your English Journey!",
        welcomeSubtitle: "Practice, learn, and master English with fun exercises.",
        loginButton: "Login",
        logoutButton: "Logout",
        globalScore: "Global Score",
        mainMenu: "Main Menu",
        nextButton: "Next",
        prevButton: "Previous",
        undoButton: "Undo",
        backToMenu: "Back to Menu",
        sessionScore: "Session Score",
        correct: "Correct",
        incorrect: "Incorrect",
        confirmLogout: "Confirm Logout",
        confirmLogoutMessage: "Are you sure you want to logout?",
        flashcardSummaryMessage: "Congratulations! You have studied {count} cards.",
        usernamePlaceholder: "Enter your name",
        randomMode: "Random",
        sortingGameTitle: "Word Sorting Game",
        checkButton: "Check",
        allCorrectMessage: "All correct! Well done!",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        footerWeb: "Advanced Learning App",
        footerMobile: "Advanced Learning App",
        sortingCompletionTitle: "Sorting Mode Completed!",
        sortingCompletionMessage: "You have sorted all the words correctly!",
        replayButton: "View Summary",
        translationLabel: "Translation",
        matchingGameTitle: "Matching Game",
        matchingCompletionMessage: "You have matched all items correctly!",
        terms: "Terms",
        definitions: "Definitions",
        resetButton: "Reset",
        moreInfoButton: "More Info",
        showExplanation: "Show Explanation"
    },

    get(key) {
        return this[this._currentLanguage][key];
    },

    setLanguage(lang) {
        if (this[lang]) {
            this._currentLanguage = lang;
            this._listeners.forEach(listener => listener(lang));
        }
    },

    getLanguage() {
        return this._currentLanguage;
    },

    addListener(listener) {
        this._listeners.push(listener);
    }
};

// About Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const aboutBtn = document.getElementById('menu-about-btn');
    const aboutModal = document.getElementById('about-modal');
    const closeAboutModalBtn = document.getElementById('close-about-modal-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const hamburgerMenu = document.getElementById('hamburger-menu');

    if (aboutBtn && aboutModal && closeAboutModalBtn && menuOverlay && hamburgerMenu) {
        aboutBtn.addEventListener('click', () => {
            aboutModal.classList.remove('hidden');
            // menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
            // menuOverlay.classList.add('opacity-50', 'pointer-events-auto');
            // Close hamburger menu when About is clicked
            hamburgerMenu.classList.remove('translate-x-0');
            hamburgerMenu.classList.add('translate-x-full');
        });

        closeAboutModalBtn.addEventListener('click', () => {
            aboutModal.classList.add('hidden');
            // menuOverlay.classList.remove('opacity-50', 'pointer-events-auto');
            // menuOverlay.classList.add('opacity-0', 'pointer-events-none');
        });

        menuOverlay.addEventListener('click', () => {
            if (!aboutModal.classList.contains('hidden')) { // Only close about modal if it's open
                aboutModal.classList.add('hidden');
                // menuOverlay.classList.remove('opacity-50', 'pointer-events-auto');
                // menuOverlay.classList.add('opacity-0', 'pointer-events-none');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !aboutModal.classList.contains('hidden')) {
                aboutModal.classList.add('hidden');
                // menuOverlay.classList.remove('opacity-50', 'pointer-events-auto');
                // menuOverlay.classList.add('opacity-0', 'pointer-events-none');
            }
        });
    }
});