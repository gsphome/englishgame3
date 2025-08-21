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
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block align-middle mr-1"><path d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6Zm0 2.25h12a.75.75 0 0 1 .75.75v6.182a.75.75 0 0 1-.416.673L16.5 15.375l-1.749 1.049a.75.75 0 0 1-.961-.961ZM6.75 7.5a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H6.75Z" /></svg>`;
        case 'quiz':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block align-middle mr-1"><path fill-rule="evenodd" d="M18.685 19.02a1.75 1.75 0 0 0 1.75-1.75V4.75a1.75 1.75 0 0 0-1.75-1.75H5.315a1.75 1.75 0 0 0-1.75 1.75v12.52a1.75 1.75 0 0 0 1.75 1.75h13.37ZM12 10.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75ZM12 7a.75.75 0 0 0-.75.75v.008a.75.75 0 0 0 1.5 0V7.75A.75.75 0 0 0 12 7Z" clip-rule="evenodd" /></svg>`;
        case 'completion':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block align-middle mr-1"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" /></svg>`;
        case 'sorting':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block align-middle mr-1"><path fill-rule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.795 0 5.562.16 8.208.438.896.09 1.378 1.102.722 1.807l-4.75 5.109a.75.75 0 0 1-1.124.077L12 6.66l-2.556 2.666a.75.75 0 0 1-1.124-.077L3.07 4.745a1.5 1.5 0 0 1 .722-1.807ZM12 12.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>`;
        case 'matching':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block align-middle mr-1"><path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0L12 16.061l-2.19-2.19a1.5 1.5 0 0 0-2.12 0L3 16.06ZM15.75 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg>`;
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 inline-block align-middle mr-1"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" /></svg>`; // Default icon (e.g., a question mark or generic icon)
    }
}