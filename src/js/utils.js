// src/js/utils.js

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // ES6 swap
    }
    return array;
}

export function getGameModeIconSvg(gameMode) {
    switch (gameMode) {
        case 'flashcard':
            return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>`;
        case 'quiz':
            return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>`;
        case 'completion':
            return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>`;
        case 'sorting':
            return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>`;
        case 'matching':
            return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" /></svg>`;
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block align-middle mr-1"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" /></svg>`; // Default icon (e.g., a question mark or generic icon)
    }
}

export function toggleModal(modalElement, show) {
    modalElement.classList.toggle('hidden', !show);
}

export function showExplanationModal(modalElement, wordData) {
    document.getElementById('explanation-word').textContent = wordData.word;
    document.getElementById('explanation-word-translation').textContent = wordData.translation_es;
    document.getElementById('explanation-example-en').textContent = `"${wordData.example}"`;
    document.getElementById('explanation-example-es').textContent = `"${wordData.example_es}"`;
    document.body.appendChild(modalElement);
    modalElement.classList.remove('hidden');
}

export function toggleHamburgerMenu(show) {
    document.body.classList.toggle('hamburger-menu-open', show);
}

export function updateSessionScoreDisplay(correct, incorrect, total, MESSAGES) {
    const sessionScoreDisplay = document.getElementById('session-score-display');
    if (sessionScoreDisplay) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const correctColor = isDarkMode ? 'text-green-400' : 'text-green-700';
        const incorrectColor = isDarkMode ? 'text-red-400' : 'text-red-700';
        const totalColor = isDarkMode ? 'text-gray-300' : 'text-gray-600';

        sessionScoreDisplay.innerHTML = `
            <span class="text-sm font-semibold">Session:</span>
            <span class="ml-1 ${correctColor} font-bold">✅ ${correct}</span>
            <span class="ml-1 ${incorrectColor} font-bold">❌ ${incorrect}</span>
            <span class="ml-1 ${totalColor} font-bold">Total: ${total}</span>
        `;
        sessionScoreDisplay.classList.remove('hidden');
    }
}

export function renderHeader(auth, MESSAGES, toggleHamburgerMenu) {
    const user = auth.getUser();
    if (!user) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const correctColor = isDarkMode ? 'text-green-400' : 'text-green-700';
    const incorrectColor = isDarkMode ? 'text-red-400' : 'text-red-700';

    const globalScoreEl = document.getElementById('global-score');
    if (globalScoreEl) {
        globalScoreEl.innerHTML = `
            <span class="text-sm font-semibold">${MESSAGES.get('globalScore')}:</span>
            <span class="ml-1 ${correctColor} font-bold">✅ ${user.globalScore.correct}</span>
            <span class="ml-1 ${incorrectColor} font-bold">❌ ${user.globalScore.incorrect}</span>
        `;
    }

    const usernameDisplayEl = document.getElementById('username-display');
    if (usernameDisplayEl) {
        usernameDisplayEl.innerHTML = `<span class="text-lg font-bold">👤 ${user.username}</span>`;
    }
}

export function updateFooterVisibility(currentView, MESSAGES) {
    const footer = document.getElementById('main-footer-copyright');
    const footerWebText = document.getElementById('footer-web-text');
    const footerMobileText = document.getElementById('footer-mobile-text');

    if (footer && footerWebText && footerMobileText) {
        if (currentView === 'menu') {
            footer.style.display = 'block';
            footerWebText.textContent = MESSAGES.get('footerWeb');
            footerMobileText.textContent = MESSAGES.get('footerMobile');
        } else {
            footer.style.display = 'none';
        }
    }
}

