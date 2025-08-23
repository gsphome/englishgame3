export const MESSAGES = {
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
        showExplanation: "Mostrar Explicación",
        yesButton: "Sí",
        noButton: "No",
        aboutTitle: "Acerca de Esta Aplicación",
        aboutText1: "Esta es una aplicación de aprendizaje avanzado diseñada para ayudarte a mejorar tu vocabulario y comprensión del inglés a través de ejercicios interactivos.",
        aboutText2: "Desarrollado por Genil Suarez.",
        closeButton: "Cerrar"
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
        sortingModeTitle: "Word Sorting Game",
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
        matchingModeTitle: "Matching Game",
        matchingCompletionMessage: "You have matched all items correctly!",
        terms: "Terms",
        definitions: "Definitions",
        resetButton: "Reset",
        moreInfoButton: "More Info",
        showExplanation: "Show Explanation",
        yesButton: "Yes",
        noButton: "No",
        aboutTitle: "About This App",
        aboutText1: "This is an advanced learning application designed to help you improve your English vocabulary and understanding through interactive exercises.",
        aboutText2: "Developed by Genil Suarez.",
        closeButton: "Close"
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

