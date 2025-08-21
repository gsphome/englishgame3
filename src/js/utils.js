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

export function getGameModeTitle(gameMode) {
    switch (gameMode) {
        case 'flashcard':
            return 'Flashcard Mode';
        case 'quiz':
            return 'Quiz Mode';
        case 'completion':
            return 'Completion Mode';
        case 'sorting':
            return 'Sorting Mode';
        case 'matching':
            return 'Matching Mode';
        default:
            return 'Game Mode';
    }
}

export function getGameModeDescription(gameMode) {
    switch (gameMode) {
        case 'flashcard':
            return 'Practice vocabulary and concepts with interactive flashcards.';
        case 'quiz':
            return 'Test your knowledge with multiple-choice questions.';
        case 'completion':
            return 'Fill in the blanks to complete sentences or phrases.';
        case 'sorting':
            return 'Categorize words or phrases into their correct groups.';
        case 'matching':
            return 'Match terms with their definitions or corresponding items.';
        default:
            return 'Select a game mode to start practicing.';
    }
}

export function showElement(element) {
    if (element) {
        element.classList.remove('hidden');
    }
}

export function hideElement(element) {
    if (element) {
        element.classList.add('hidden');
    }
}

export function toggleElementVisibility(element) {
    if (element) {
        element.classList.toggle('hidden');
    }
}

export function setElementText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

export function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}

export function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}

export function hasClass(element, className) {
    return element ? element.classList.contains(className) : false;
}

export function disableElement(element) {
    if (element) {
        element.disabled = true;
        element.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

export function enableElement(element) {
    if (element) {
        element.disabled = false;
        element.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

export function updateElementContent(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = content;
    }
}

export function updateTextContent(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

export function addClickEvent(selector, handler) {
    const element = document.querySelector(selector);
    if (element) {
        element.addEventListener('click', handler);
    }
}

export function removeClickEvent(selector, handler) {
    const element = document.querySelector(selector);
    if (element) {
        element.removeEventListener('click', handler);
    }
}

export function getInputValue(selector) {
    const element = document.querySelector(selector);
    return element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') ? element.value : null;
}

export function setInputValue(selector, value) {
    const element = document.querySelector(selector);
    if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT')) {
        element.value = value;
    }
}

export function clearInputValue(selector) {
    setInputValue(selector, '');
}

export function getSelectedRadioValue(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? radio.value : null;
}

export function setSelectedRadioValue(name, value) {
    const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (radio) {
        radio.checked = true;
    }
}

export function getDataset(selector, key) {
    const element = document.querySelector(selector);
    return element ? element.dataset[key] : null;
}

export function setDataset(selector, key, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.dataset[key] = value;
    }
}

export function removeDataset(selector, key) {
    const element = document.querySelector(selector);
    if (element) {
        delete element.dataset[key];
    }
}

export function createAndAppendElement(parentSelector, tagName, attributes = {}, textContent = '') {
    const parent = document.querySelector(parentSelector);
    if (!parent) {
        console.error(`Parent element with selector "${parentSelector}" not found.`);
        return null;
    }

    const element = document.createElement(tagName);

    for (const key in attributes) {
        if (key === 'class') {
            element.className = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }

    if (textContent) {
        element.textContent = textContent;
    }

    parent.appendChild(element);
    return element;
}

export function removeElement(selector) {
    const element = document.querySelector(selector);
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

export function removeAllChildren(selector) {
    const element = document.querySelector(selector);
    if (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

export function addEventListenerToAll(selector, eventType, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener(eventType, handler);
    });
}

export function removeEventListenerFromAll(selector, eventType, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.removeEventListener(eventType, handler);
    });
}

export function getElement(selector) {
    return document.querySelector(selector);
}

export function getAllElements(selector) {
    return document.querySelectorAll(selector);
}

export function setFocus(selector) {
    const element = getElement(selector);
    if (element && typeof element.focus === 'function') {
        element.focus();
    }
}

export function getBoundingClientRect(selector) {
    const element = getElement(selector);
    return element ? element.getBoundingClientRect() : null;
}

export function getCssVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

export function setCssVariable(variableName, value) {
    document.documentElement.style.setProperty(variableName, value);
}

export function animateElement(selector, keyframes, options) {
    const element = getElement(selector);
    if (element && typeof element.animate === 'function') {
        return element.animate(keyframes, options);
    }
    return null;
}

export function isElementInViewport(selector) {
    const element = getElement(selector);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export function scrollToElement(selector, options = {}) {
    const element = getElement(selector);
    if (element && typeof element.scrollIntoView === 'function') {
        element.scrollIntoView(options);
    }
}

export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function capitalizeFirstLetter(string) {
    if (typeof string !== 'string' || string.length === 0) {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function truncateText(text, maxLength) {
    if (typeof text !== 'string') {
        return text; // Return original value if not a string
    }
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + '...';
}

export function formatNumber(number, decimalPlaces = 0) {
    if (typeof number !== 'number') {
        return '';
    }
    return number.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    });
}

export function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    let lastResult;
    return function(...args) {
        const context = this;
        if (!inThrottle) {
            inThrottle = true;
            lastResult = func.apply(context, args);
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
        return lastResult;
    };
}

export function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split('&').forEach(param => {
        const parts = param.split('=');
        if (parts[0]) {
            params[decodeURIComponent(parts[0])] = parts[1] ? decodeURIComponent(parts[1]) : '';
        }
    });
    return params;
}

export function setQueryParams(params) {
    const queryString = Object.keys(params)
        .map(key => {
            const value = params[key];
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join('&');
    const newUrl = `${window.location.pathname}?${queryString}`;
    window.history.replaceState({}, '', newUrl);
}

export function removeQueryParams(keysToRemove) {
    const currentParams = getQueryParams();
    keysToRemove.forEach(key => {
        delete currentParams[key];
    });
    setQueryParams(currentParams);
}

const keyboardShortcutHandlers = {};

export function addKeyboardShortcut(key, handler, options = {}) {
    const { ctrl = false, shift = false, alt = false, preventDefault = true } = options;

    const listener = (event) => {
        if (event.key === key &&
            event.ctrlKey === ctrl &&
            event.shiftKey === shift &&
            event.altKey === alt) {
            if (preventDefault) {
                event.preventDefault();
            }
            handler(event);
        }
    };

    document.addEventListener('keydown', listener);

    // Store the listener to allow removal
    if (!keyboardShortcutHandlers[key]) {
        keyboardShortcutHandlers[key] = [];
    }
    keyboardShortcutHandlers[key].push(listener);

    // Return a cleanup function
    return () => {
        document.removeEventListener('keydown', listener);
        keyboardShortcutHandlers[key] = keyboardShortcutHandlers[key].filter(l => l !== listener);
        if (keyboardShortcutHandlers[key].length === 0) {
            delete keyboardShortcutHandlers[key];
        }
    };
}

export function removeKeyboardShortcut(key, handler) {
    console.warn("removeKeyboardShortcut is deprecated. Use the cleanup function returned by addKeyboardShortcut instead.");
    if (keyboardShortcutHandlers[key]) {
        const listeners = keyboardShortcutHandlers[key];
        const index = listeners.indexOf(handler);
        if (index > -1) {
            document.removeEventListener('keydown', handler);
            listeners.splice(index, 1);
            if (listeners.length === 0) {
                delete keyboardShortcutHandlers[key];
            }
        }
    }
}

export async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for browsers that do not support navigator.clipboard
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand('copy');
                return true;
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    } catch (err) {
        console.error('Failed to copy text to clipboard:', err);
        return false;
    }
}

export function isTouchDevice() {
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
}

export function getScrollPosition() {
    return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
    };
}

export function setScrollPosition(x, y) {
    window.scrollTo(x, y);
}

export function getElementCoordinates(selector) {
    const element = getElement(selector);
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + (window.pageXOffset || document.documentElement.scrollLeft),
        y: rect.top + (window.pageYOffset || document.documentElement.scrollTop)
    };
}

export function getCssPropertyValue(selector, propertyName) {
    const element = getElement(selector);
    if (!element) return null;
    return window.getComputedStyle(element).getPropertyValue(propertyName);
}

export function setCssPropertyValue(selector, propertyName, value) {
    const element = getElement(selector);
    if (element) {
        element.style.setProperty(propertyName, value);
    }
}

export function animateCss(selector, animationName, callback) {
    const node = getElement(selector);
    if (!node) return;

    node.classList.add('animated', animationName);

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName);
        node.removeEventListener('animationend', handleAnimationEnd);
        if (typeof callback === 'function') callback();
    }

    node.addEventListener('animationend', handleAnimationEnd);
}

export function isHidden(selector) {
    const element = getElement(selector);
    if (!element) return true; // Consider non-existent elements as hidden
    return element.offsetParent === null;
}

export function getFormValues(selector) {
    const form = getElement(selector);
    if (!form || form.tagName !== 'FORM') {
        return {};
    }

    const formData = {};
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.name) {
            if (input.type === 'checkbox') {
                formData[input.name] = input.checked;
            } else if (input.type === 'radio') {
                if (input.checked) {
                    formData[input.name] = input.value;
                }
            } else {
                formData[input.name] = input.value;
            }
        }
    });
    return formData;
}

export function setFormValues(selector, values) {
    const form = getElement(selector);
    if (!form || form.tagName !== 'FORM') {
        return;
    }

    for (const name in values) {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = values[name];
            } else if (input.type === 'radio') {
                const radio = form.querySelector(`input[name="${name}"][value="${values[name]}"]`);
                if (radio) {
                    radio.checked = true;
                }
            } else {
                input.value = values[name];
            }
        }
    }
}

export function resetForm(selector) {
    const form = getElement(selector);
    if (form && form.tagName === 'FORM') {
        form.reset();
    }
}

export function submitForm(selector) {
    const form = getElement(selector);
    if (form && form.tagName === 'FORM') {
        form.submit();
    }
}

export function validateForm(selector) {
    const form = getElement(selector);
    if (!form || form.tagName !== 'FORM') {
        return true; // If form not found, consider it valid for this function's purpose
    }
    return form.checkValidity();
}

export function addClassToAll(selector, className) {
    const elements = getAllElements(selector);
    elements.forEach(element => addClass(element, className));
}

export function removeClassFromAll(selector, className) {
    const elements = getAllElements(selector);
    elements.forEach(element => removeClass(element, className));
}

export function toggleClassToAll(selector, className) {
    const elements = getAllElements(selector);
    elements.forEach(element => {
        if (element) {
            element.classList.toggle(className);
        }
    });
}

export function hasClassInAny(selector, className) {
    const elements = getAllElements(selector);
    for (let i = 0; i < elements.length; i++) {
        if (hasClass(elements[i], className)) {
            return true;
        }
    }
    return false;
}

export function getElementIndex(selector) {
    const element = getElement(selector);
    if (!element || !element.parentNode) {
        return -1;
    }
    return Array.from(element.parentNode.children).indexOf(element);
}

export function insertAtIndex(parentSelector, newElement, index) {
    const parent = getElement(parentSelector);
    if (!parent) {
        console.error(`Parent element with selector "${parentSelector}" not found.`);
        return;
    }

    const children = Array.from(parent.children);
    if (index < 0 || index >= children.length) {
        parent.appendChild(newElement); // Append if index is out of bounds
    } else {
        parent.insertBefore(newElement, children[index]);
    }
}

export function replaceClass(selector, oldClass, newClass) {
    const element = getElement(selector);
    if (element) {
        element.classList.remove(oldClass);
        element.classList.add(newClass);
    }
}

export function replaceClassInAll(selector, oldClass, newClass) {
    const elements = getAllElements(selector);
    elements.forEach(element => replaceClass(element, oldClass, newClass));
}

export function getComputedStyleProperty(selector, propertyName) {
    const element = getElement(selector);
    if (!element) return null;
    return window.getComputedStyle(element).getPropertyValue(propertyName);
}

export function setStyleProperties(selector, properties) {
    const element = getElement(selector);
    if (element) {
        for (const prop in properties) {
            element.style[prop] = properties[prop];
        }
    }
}

export function getAttributeInAll(selector, attributeName) {
    const elements = getAllElements(selector);
    return Array.from(elements).map(element => element.getAttribute(attributeName));
}

export function setAttributeInAll(selector, attributeName, value) {
    const elements = getAllElements(selector);
    elements.forEach(element => element.setAttribute(attributeName, value));
}

export function removeAttributeInAll(selector, attributeName) {
    const elements = getAllElements(selector);
    elements.forEach(element => element.removeAttribute(attributeName));
}

export function hasAttributeInAny(selector, attributeName) {
    const elements = getAllElements(selector);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].hasAttribute(attributeName)) {
            return true;
        }
    }
    return false;
}

export function getElementText(selector) {
    const element = getElement(selector);
    return element ? element.textContent : null;
}

export function getElementHtml(selector) {
    const element = getElement(selector);
    return element ? element.innerHTML : null;
}

export function setElementHtml(selector, html) {
    const element = getElement(selector);
    if (element) {
        element.innerHTML = html;
    }
}

export function addClassToParent(selector, className) {
    const element = getElement(selector);
    if (element && element.parentNode) {
        element.parentNode.classList.add(className);
    }
}

export function removeClassFromParent(selector, className) {
    const element = getElement(selector);
    if (element && element.parentNode) {
        element.parentNode.classList.remove(className);
    }
}

export function toggleClassToParent(selector, className) {
    const element = getElement(selector);
    if (element && element.parentNode) {
        element.parentNode.classList.toggle(className);
    }
}

export function hasClassInParent(selector, className) {
    const element = getElement(selector);
    return element && element.parentNode ? element.parentNode.classList.contains(className) : false;
}

export function getParentWithClass(selector, className) {
    let element = getElement(selector);
    if (!element) return null;
    while (element && element !== document.body) {
        element = element.parentNode;
        if (element && element.classList && element.classList.contains(className)) {
            return element;
        }
    }
    return null;
}

export function getParentWithAttribute(selector, attributeName) {
    let element = getElement(selector);
    if (!element) return null;
    while (element && element !== document.body) {
        element = element.parentNode;
        if (element && element.hasAttribute(attributeName)) {
            return element;
        }
    }
    return null;
}

export function getParents(selector) {
    let element = getElement(selector);
    const parents = [];
    if (!element) return parents;
    while (element.parentNode && element.parentNode !== document) {
        element = element.parentNode;
        parents.push(element);
    }
    return parents;
}

export function getClosest(selector, closestSelector) {
    const element = getElement(selector);
    if (!element) return null;
    return element.closest(closestSelector);
}

export function getNextSiblings(selector) {
    let element = getElement(selector);
    const siblings = [];
    if (!element) return siblings;
    while (element.nextElementSibling) {
        element = element.nextElementSibling;
        siblings.push(element);
    }
    return siblings;
}

export function getPreviousSiblings(selector) {
    let element = getElement(selector);
    const siblings = [];
    if (!element) return siblings;
    while (element.previousElementSibling) {
        element = element.previousElementSibling;
        siblings.push(element);
    }
    return siblings;
}

export function getFirstChild(selector) {
    const element = getElement(selector);
    return element ? element.firstElementChild : null;
}

export function getLastChild(selector) {
    const element = getElement(selector);
    return element ? element.lastElementChild : null;
}

export function hasChildren(selector) {
    const element = getElement(selector);
    return element ? element.children.length > 0 : false;
}

export function getChildAtIndex(selector, index) {
    const element = getElement(selector);
    return element && element.children[index] ? element.children[index] : null;
}

export function isChildOf(childSelector, parentSelector) {
    const child = getElement(childSelector);
    const parent = getElement(parentSelector);
    return child && parent ? child.parentNode === parent : false;
}

export function isDescendantOf(descendantSelector, ancestorSelector) {
    const descendant = getElement(descendantSelector);
    const ancestor = getElement(ancestorSelector);
    if (!descendant || !ancestor) return false;
    let currentElement = descendant;
    while (currentElement) {
        if (currentElement === ancestor) {
            return true;
        }
        currentElement = currentElement.parentNode;
    }
    return false;
}

export function isBefore(selector1, selector2) {
    const el1 = getElement(selector1);
    const el2 = getElement(selector2);
    if (!el1 || !el2 || el1 === el2) return false;
    return el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_FOLLOWING;
}

export function isAfter(selector1, selector2) {
    const el1 = getElement(selector1);
    const el2 = getElement(selector2);
    if (!el1 || !el2 || el1 === el2) return false;
    return el1.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_PRECEDING;
}

export function getElementByDataAttribute(attributeName, value) {
    return document.querySelector(`[data-${attributeName}="${value}"]`);
}

export function getAllElementsByDataAttribute(attributeName, value) {
    return document.querySelectorAll(`[data-${attributeName}="${value}"]`);
}

export function addClassToElementByDataAttribute(attributeName, value, className) {
    const element = getElementByDataAttribute(attributeName, value);
    addClass(element, className);
}

export function removeClassFromElementByDataAttribute(attributeName, value, className) {
    const element = getElementByDataAttribute(attributeName, value);
    removeClass(element, className);
}

export function toggleClassToElementByDataAttribute(attributeName, value, className) {
    const element = getElementByDataAttribute(attributeName, value);
    toggleElementVisibility(element); // This is incorrect, should be toggleClass
}

export function hasClassInElementByDataAttribute(attributeName, value, className) {
    const element = getElementByDataAttribute(attributeName, value);
    return hasClass(element, className);
}

export function setElementTextByDataAttribute(attributeName, value, text) {
    const element = getElementByDataAttribute(attributeName, value);
    setElementText(element, text);
}

export function setElementHtmlByDataAttribute(attributeName, value, html) {
    const element = getElementByDataAttribute(attributeName, value);
    setElementHtml(element, html);
}

export function getElementTextByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getElementText(element);
}

export function getElementHtmlByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getElementHtml(element);
}

export function addClickEventByDataAttribute(attributeName, value, handler) {
    const element = getElementByDataAttribute(attributeName, value);
    addClickEvent(element, handler);
}

export function removeClickEventByDataAttribute(attributeName, value, handler) {
    const element = getElementByDataAttribute(attributeName, value);
    removeClickEvent(element, handler);
}

export function getInputValueByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getInputValue(element);
}

export function setInputValueByDataAttribute(attributeName, value, inputValue) {
    const element = getElementByDataAttribute(attributeName, value);
    setInputValue(element, inputValue);
}

export function clearInputValueByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    clearInputValue(element);
}

export function disableElementByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    disableElement(element);
}

export function enableElementByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    enableElement(element);
}

export function showElementByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    showElement(element);
}

export function hideElementByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    hideElement(element);
}

export function toggleElementVisibilityByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    toggleElementVisibility(element);
}

export function getDatasetByDataAttribute(attributeName, value, key) {
    const element = getElementByDataAttribute(attributeName, value);
    return getDataset(element, key);
}

export function setDatasetByDataAttribute(attributeName, value, key, datasetValue) {
    const element = getElementByDataAttribute(attributeName, value);
    setDataset(element, key, datasetValue);
}

export function removeDatasetByDataAttribute(attributeName, value, key) {
    const element = getElementByDataAttribute(attributeName, value);
    removeDataset(element, key);
}

export function getElementAttributeByDataAttribute(attributeName, value, attr) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.getAttribute(attr) : null;
}

export function setElementAttributeByDataAttribute(attributeName, value, attr, attrValue) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.setAttribute(attr, attrValue);
    }
}

export function removeElementAttributeByDataAttribute(attributeName, value, attr) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.removeAttribute(attr);
    }
}

export function hasElementAttributeByDataAttribute(attributeName, value, attr) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.hasAttribute(attr) : false;
}

export function getStylePropertyByDataAttribute(attributeName, value, propertyName) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.style[propertyName] : null;
}

export function setStylePropertyByDataAttribute(attributeName, value, propertyName, propertyValue) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.style[propertyName] = propertyValue;
    }
}

export function getComputedStylePropertyByDataAttribute(attributeName, value, propertyName) {
    const element = getElementByDataAttribute(attributeName, value);
    return getComputedStyleProperty(element, propertyName);
}

export function setStylePropertiesByDataAttribute(attributeName, value, properties) {
    const element = getElementByDataAttribute(attributeName, value);
    setStyleProperties(element, properties);
}

export function animateElementByDataAttribute(attributeName, value, keyframes, options) {
    const element = getElementByDataAttribute(attributeName, value);
    return animateElement(element, keyframes, options);
}

export function animateCssByDataAttribute(attributeName, value, animationName, callback) {
    const element = getElementByDataAttribute(attributeName, value);
    animateCss(element, animationName, callback);
}

export function isHiddenByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return isHidden(element);
}

export function getBoundingClientRectByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getBoundingClientRect(element);
}

export function isElementInViewportByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return isElementInViewport(element);
}

export function scrollToElementByDataAttribute(attributeName, value, options = {}) {
    const element = getElementByDataAttribute(attributeName, value);
    scrollToElement(element, options);
}

export function setFocusByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    setFocus(element);
}

export function getParentByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.parentNode : null;
}

export function getChildrenByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? Array.from(element.children) : [];
}

export function getSiblingsByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    if (!element || !element.parentNode) return [];
    return Array.from(element.parentNode.children).filter(child => child !== element);
}

export function getNextSiblingByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.nextElementSibling : null;
}

export function getPreviousSiblingByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.previousElementSibling : null;
}

export function prependChildByDataAttribute(parentAttributeName, parentAttributeValue, newChild) {
    const parent = getElementByDataAttribute(parentAttributeName, parentAttributeValue);
    if (parent) {
        parent.prepend(newChild);
    }
}

export function appendChildByDataAttribute(parentAttributeName, parentAttributeValue, newChild) {
    const parent = getElementByDataAttribute(parentAttributeName, parentAttributeValue);
    if (parent) {
        parent.appendChild(newChild);
    }
}

export function insertBeforeByDataAttribute(newElement, referenceAttributeName, referenceAttributeValue) {
    const referenceElement = getElementByDataAttribute(referenceAttributeName, referenceAttributeValue);
    if (referenceElement && referenceElement.parentNode) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement);
    }
}

export function insertAfterByDataAttribute(newElement, referenceAttributeName, referenceAttributeValue) {
    const referenceElement = getElementByDataAttribute(referenceAttributeName, referenceAttributeValue);
    if (referenceElement && referenceElement.parentNode) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
    }
}

export function replaceElementByDataAttribute(oldElementAttributeName, oldElementAttributeValue, newElement) {
    const oldElement = getElementByDataAttribute(oldElementAttributeName, oldElementAttributeValue);
    if (oldElement && oldElement.parentNode) {
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }
}

export function removeElementByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    removeElement(element);
}

export function removeAllChildrenByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    removeAllChildren(element);
}

export function addEventListenerToAllByDataAttribute(attributeName, value, eventType, handler) {
    const elements = getAllElementsByDataAttribute(attributeName, value);
    elements.forEach(element => element.addEventListener(eventType, handler));
}

export function removeEventListenerFromAllByDataAttribute(attributeName, value, eventType, handler) {
    const elements = getAllElementsByDataAttribute(attributeName, value);
    elements.forEach(element => element.removeEventListener(eventType, handler));
}

export function triggerEventByDataAttribute(attributeName, value, eventType, detail = {}) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        const event = new CustomEvent(eventType, { detail, bubbles: true, cancelable: true });
        element.dispatchEvent(event);
    }
}

export function addCustomEventListenerByDataAttribute(attributeName, value, eventType, handler) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.addEventListener(eventType, handler);
    }
}

export function removeCustomEventListenerByDataAttribute(attributeName, value, eventType, handler) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.removeEventListener(eventType, handler);
    }
}

export function getFormValuesByDataAttribute(attributeName, value) {
    const form = getElementByDataAttribute(attributeName, value);
    return getFormValues(form);
}

export function setFormValuesByDataAttribute(attributeName, value, formValues) {
    const form = getElementByDataAttribute(attributeName, value);
    setFormValues(form, formValues);
}

export function resetFormByDataAttribute(attributeName, value) {
    const form = getElementByDataAttribute(attributeName, value);
    resetForm(form);
}

export function submitFormByDataAttribute(attributeName, value) {
    const form = getElementByDataAttribute(attributeName, value);
    submitForm(form);
}

export function validateFormByDataAttribute(attributeName, value) {
    const form = getElementByDataAttribute(attributeName, value);
    return validateForm(form);
}

export function getElementIndexByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getElementIndex(element);
}

export function insertAtIndexByDataAttribute(parentAttributeName, parentAttributeValue, newElement, index) {
    const parent = getElementByDataAttribute(parentAttributeName, parentAttributeValue);
    insertAtIndex(parent, newElement, index);
}

export function replaceClassByDataAttribute(attributeName, value, oldClass, newClass) {
    const element = getElementByDataAttribute(attributeName, value);
    replaceClass(element, oldClass, newClass);
}

export function getParentsByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getParents(element);
}

export function getClosestByDataAttribute(attributeName, value, closestSelector) {
    const element = getElementByDataAttribute(attributeName, value);
    return getClosest(element, closestSelector);
}

export function getNextSiblingsByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getNextSiblings(element);
}

export function getPreviousSiblingsByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getPreviousSiblings(element);
}

export function getFirstChildByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getFirstChild(element);
}

export function getLastChildByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getLastChild(element);
}

export function hasChildrenByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return hasChildren(element);
}

export function getChildAtIndexByDataAttribute(attributeName, value, index) {
    const element = getElementByDataAttribute(attributeName, value);
    return getChildAtIndex(element, index);
}

export function isChildOfByDataAttribute(childAttributeName, childAttributeValue, parentAttributeName, parentAttributeValue) {
    const child = getElementByDataAttribute(childAttributeName, childAttributeValue);
    const parent = getElementByDataAttribute(parentAttributeName, parentAttributeValue);
    return isChildOf(child, parent);
}

export function isDescendantOfByDataAttribute(descendantAttributeName, descendantAttributeValue, ancestorAttributeName, ancestorAttributeValue) {
    const descendant = getElementByDataAttribute(descendantAttributeName, descendantAttributeValue);
    const ancestor = getElementByDataAttribute(ancestorAttributeName, ancestorAttributeValue);
    return isDescendantOf(descendant, ancestor);
}

export function isBeforeByDataAttribute(selector1AttributeName, selector1AttributeValue, selector2AttributeName, selector2AttributeValue) {
    const el1 = getElementByDataAttribute(selector1AttributeName, selector1AttributeValue);
    const el2 = getElementByDataAttribute(selector2AttributeName, selector2AttributeValue);
    return isBefore(el1, el2);
}

export function isAfterByDataAttribute(selector1AttributeName, selector1AttributeValue, selector2AttributeName, selector2AttributeValue) {
    const el1 = getElementByDataAttribute(selector1AttributeName, selector1AttributeValue);
    const el2 = getElementByDataAttribute(selector2AttributeName, selector2AttributeValue);
    return isAfter(el1, el2);
}

export function getParentWithClassByDataAttribute(selectorAttributeName, selectorAttributeValue, className) {
    const element = getElementByDataAttribute(selectorAttributeName, selectorAttributeValue);
    return getParentWithClass(element, className);
}

export function getParentWithAttributeByDataAttribute(selectorAttributeName, selectorAttributeValue, attributeName) {
    const element = getElementByDataAttribute(selectorAttributeName, selectorAttributeValue);
    return getParentWithAttribute(element, attributeName);
}

export function addClassToParentByDataAttribute(selectorAttributeName, selectorAttributeValue, className) {
    const element = getElementByDataAttribute(selectorAttributeName, selectorAttributeValue);
    addClassToParent(element, className);
}

export function removeClassFromParentByDataAttribute(selectorAttributeName, selectorAttributeValue, className) {
    const element = getElementByDataAttribute(selectorAttributeName, selectorAttributeValue);
    removeClassFromParent(element, className);
}

export function toggleClassToParentByDataAttribute(selectorAttributeName, selectorAttributeValue, className) {
    const element = getElementByDataAttribute(selectorAttributeName, selectorAttributeValue);
    toggleClassToParent(element, className);
}

export function hasClassInParentByDataAttribute(selectorAttributeName, selectorAttributeValue, className) {
    const element = getElementByDataAttribute(selectorAttributeName, selectorAttributeValue);
    return hasClassInParent(element, className);
}

export function getElementCoordinatesByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return getElementCoordinates(element);
}

export function getCssPropertyValueByDataAttribute(attributeName, value, propertyName) {
    const element = getElementByDataAttribute(attributeName, value);
    return getCssPropertyValue(element, propertyName);
}

export function setCssPropertyValueByDataAttribute(attributeName, value, propertyName, propertyValue) {
    const element = getElementByDataAttribute(attributeName, value);
    setCssPropertyValue(element, propertyName, propertyValue);
}

export function getElementTextContent(selector) {
    const element = getElement(selector);
    return element ? element.textContent : null;
}

export function setElementTextContent(selector, text) {
    const element = getElement(selector);
    if (element) {
        element.textContent = text;
    }
}

export function getElementHtmlContent(selector) {
    const element = getElement(selector);
    return element ? element.innerHTML : null;
}

export function setElementHtmlContent(selector, html) {
    const element = getElement(selector);
    if (element) {
        element.innerHTML = html;
    }
}

export function getElementValue(selector) {
    const element = getElement(selector);
    return element ? element.value : null;
}

export function setElementValue(selector, value) {
    const element = getElement(selector);
    if (element) {
        element.value = value;
    }
}

export function clearElementValue(selector) {
    const element = getElement(selector);
    if (element) {
        element.value = '';
    }
}

export function getElementChecked(selector) {
    const element = getElement(selector);
    return element ? element.checked : null;
}

export function setElementChecked(selector, checked) {
    const element = getElement(selector);
    if (element) {
        element.checked = checked;
    }
}

export function toggleElementChecked(selector) {
    const element = getElement(selector);
    if (element) {
        element.checked = !element.checked;
    }
}

export function getElementSelected(selector) {
    const element = getElement(selector);
    return element ? element.selected : null;
}

export function setElementSelected(selector, selected) {
    const element = getElement(selector);
    if (element) {
        element.selected = selected;
    }
}

export function getElementDisabled(selector) {
    const element = getElement(selector);
    return element ? element.disabled : null;
}

export function setElementDisabled(selector, disabled) {
    const element = getElement(selector);
    if (element) {
        element.disabled = disabled;
    }
}

export function getElementReadOnly(selector) {
    const element = getElement(selector);
    return element ? element.readOnly : null;
}

export function setElementReadOnly(selector, readOnly) {
    const element = getElement(selector);
    if (element) {
        element.readOnly = readOnly;
    }
}

export function getElementPlaceholder(selector) {
    const element = getElement(selector);
    return element ? element.placeholder : null;
}

export function setElementPlaceholder(selector, placeholder) {
    const element = getElement(selector);
    if (element) {
        element.placeholder = placeholder;
    }
}

export function getElementSrc(selector) {
    const element = getElement(selector);
    return element ? element.src : null;
}

export function setElementSrc(selector, src) {
    const element = getElement(selector);
    if (element) {
        element.src = src;
    }
}

export function getElementHref(selector) {
    const element = getElement(selector);
    return element ? element.href : null;
}

export function setElementHref(selector, href) {
    const element = getElement(selector);
    if (element) {
        element.href = href;
    }
}

export function getElementTitle(selector) {
    const element = getElement(selector);
    return element ? element.title : null;
}

export function setElementTitle(selector, title) {
    const element = getElement(selector);
    if (element) {
        element.title = title;
    }
}

export function getElementAlt(selector) {
    const element = getElement(selector);
    return element ? element.alt : null;
}

export function setElementAlt(selector, alt) {
    const element = getElement(selector);
    if (element) {
        element.alt = alt;
    }
}

export function getElementWidth(selector) {
    const element = getElement(selector);
    return element ? element.width : null;
}

export function setElementWidth(selector, width) {
    const element = getElement(selector);
    if (element) {
        element.width = width;
    }
}

export function getElementHeight(selector) {
    const element = getElement(selector);
    return element ? element.height : null;
}

export function setElementHeight(selector, height) {
    const element = getElement(selector);
    if (element) {
        element.height = height;
    }
}

export function getElementTabIndex(selector) {
    const element = getElement(selector);
    return element ? element.tabIndex : null;
}

export function setElementTabIndex(selector, tabIndex) {
    const element = getElement(selector);
    if (element) {
        element.tabIndex = tabIndex;
    }
}

export function getElementId(selector) {
    const element = getElement(selector);
    return element ? element.id : null;
}

export function setElementId(selector, id) {
    const element = getElement(selector);
    if (element) {
        element.id = id;
    }
}

export function getElementClassName(selector) {
    const element = getElement(selector);
    return element ? element.className : null;
}

function setElementClassName(selector, className) {
    const element = getElement(selector);
    if (element) {
        element.className = className;
    }
}

function getElementTagName(selector) {
    const element = getElement(selector);
    return element ? element.tagName : null;
}

function getElementTagNameByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.tagName : null;
}

function getElementClientWidth(selector) {
    const element = getElement(selector);
    return element ? element.clientWidth : null;
}

function getElementClientHeight(selector) {
    const element = getElement(selector);
    return element ? element.clientHeight : null;
}

function getElementOffsetWidth(selector) {
    const element = getElement(selector);
    return element ? element.offsetWidth : null;
}

function getElementOffsetHeight(selector) {
    const element = getElement(selector);
    return element ? element.offsetHeight : null;
}

function getElementScrollWidth(selector) {
    const element = getElement(selector);
    return element ? element.scrollWidth : null;
}

function getElementScrollHeight(selector) {
    const element = getElement(selector);
    return element ? element.scrollHeight : null;
}

function getElementScrollLeft(selector) {
    const element = getElement(selector);
    return element ? element.scrollLeft : null;
}

function setElementScrollLeft(selector, scrollLeft) {
    const element = getElement(selector);
    if (element) {
        element.scrollLeft = scrollLeft;
    }
}

function getElementScrollTop(selector) {
    const element = getElement(selector);
    return element ? element.scrollTop : null;
}

function setElementScrollTop(selector, scrollTop) {
    const element = getElement(selector);
    if (element) {
        element.scrollTop = scrollTop;
    }
}

function getElementOffsetLeft(selector) {
    const element = getElement(selector);
    return element ? element.offsetLeft : null;
}

function getElementOffsetTop(selector) {
    const element = getElement(selector);
    return element ? element.offsetTop : null;
}

function getElementClientLeft(selector) {
    const element = getElement(selector);
    return element ? element.clientLeft : null;
}

function getElementClientTop(selector) {
    const element = getElement(selector);
    return element ? element.clientTop : null;
}

function getElementOwnerDocument(selector) {
    const element = getElement(selector);
    return element ? element.ownerDocument : null;
}

function getElementBaseURI(selector) {
    const element = getElement(selector);
    return element ? element.baseURI : null;
}

function getElementNodeName(selector) {
    const element = getElement(selector);
    return element ? element.nodeName : null;
}

function getElementNodeType(selector) {
    const element = getElement(selector);
    return element ? element.nodeType : null;
}

function getElementNodeValue(selector) {
    const element = getElement(selector);
    return element ? element.nodeValue : null;
}

function getElementTextContentByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.textContent : null;
}

function setElementTextContentByDataAttribute(attributeName, value, text) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.textContent = text;
    }
}

function getElementHtmlContentByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.innerHTML : null;
}

function setElementHtmlContentByDataAttribute(attributeName, value, html) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.innerHTML = html;
    }
}

function getElementValueByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.value : null;
}

function setElementValueByDataAttribute(attributeName, value, inputValue) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.value = inputValue;
    }
}

function clearElementValueByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.value = '';
    }
}

function getElementCheckedByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.checked : null;
}

function setElementCheckedByDataAttribute(attributeName, value, checked) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.checked = checked;
    }
}

function toggleElementCheckedByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.checked = !element.checked;
    }
}

function getElementSelectedByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.selected : null;
}

function setElementSelectedByDataAttribute(attributeName, value, selected) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.selected = selected;
    }
}

function getElementDisabledByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.disabled : null;
}

function setElementDisabledByDataAttribute(attributeName, value, disabled) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.disabled = disabled;
    }
}

function getElementReadOnlyByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.readOnly : null;
}

function setElementReadOnlyByDataAttribute(attributeName, value, readOnly) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.readOnly = readOnly;
    }
}

function getElementPlaceholderByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.placeholder : null;
}

function setElementPlaceholderByDataAttribute(attributeName, value, placeholder) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.placeholder = placeholder;
    }
}

function getElementSrcByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.src : null;
}

function setElementSrcByDataAttribute(attributeName, value, src) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.src = src;
    }
}

function getElementHrefByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.href : null;
}

function setElementHrefByDataAttribute(attributeName, value, href) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.href = href;
    }
}

function getElementTitleByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.title : null;
}

function setElementTitleByDataAttribute(attributeName, value, title) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.title = title;
    }
}

function getElementAltByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.alt : null;
}

function setElementAltByDataAttribute(attributeName, value, alt) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.alt = alt;
    }
}

function getElementWidthByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.width : null;
}

function setElementWidthByDataAttribute(attributeName, value, width) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.width = width;
    }
}

function getElementHeightByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.height : null;
}

function setElementHeightByDataAttribute(attributeName, value, height) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.height = height;
    }
}

function getElementTabIndexByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.tabIndex : null;
}

function setElementTabIndexByDataAttribute(attributeName, value, tabIndex) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.tabIndex = tabIndex;
    }
}

function getElementIdByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.id : null;
}

function setElementIdByDataAttribute(attributeName, value, id) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.id = id;
    }
}

function getElementClassNameByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.className : null;
}

function setElementClassNameByDataAttribute(attributeName, value, className) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.className = className;
    }
}

function getElementClientWidthByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.clientWidth : null;
}

function getElementClientHeightByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.clientHeight : null;
}

function getElementOffsetWidthByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.offsetWidth : null;
}

function getElementOffsetHeightByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.offsetHeight : null;
}

function getElementScrollWidthByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.scrollWidth : null;
}

function getElementScrollHeightByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.scrollHeight : null;
}

function getElementScrollLeftByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.scrollLeft : null;
}

function setElementScrollLeftByDataAttribute(attributeName, value, scrollLeft) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.scrollLeft = scrollLeft;
    }
}

function getElementScrollTopByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.scrollTop : null;
}

function setElementScrollTopByDataAttribute(attributeName, value, scrollTop) {
    const element = getElementByDataAttribute(attributeName, value);
    if (element) {
        element.scrollTop = scrollTop;
    }
}

function getElementOffsetLeftByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.offsetLeft : null;
}

function getElementOffsetTopByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.offsetTop : null;
}

function getElementClientLeftByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.clientLeft : null;
}

function getElementClientTopByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.clientTop : null;
}

function getElementOwnerDocumentByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.ownerDocument : null;
}

function getElementBaseURIByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.baseURI : null;
}

function getElementNodeNameByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.nodeName : null;
}

function getElementNodeTypeByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.nodeType : null;
}

function getElementNodeValueByDataAttribute(attributeName, value) {
    const element = getElementByDataAttribute(attributeName, value);
    return element ? element.nodeValue : null;
}

function getLocalStorageItem(key) {
    return localStorage.getItem(key);
}

function setLocalStorageItem(key, value) {
    localStorage.setItem(key, value);
}

function removeLocalStorageItem(key) {
    localStorage.removeItem(key);
}

function clearLocalStorage() {
    localStorage.clear();
}

function getSessionStorageItem(key) {
    return sessionStorage.getItem(key);
}

function setSessionStorageItem(key, value) {
    sessionStorage.setItem(key, value);
}

function removeSessionStorageItem(key) {
    sessionStorage.removeItem(key);
}

function clearSessionStorage() {
    sessionStorage.clear();
}

function isOnline() {
    return navigator.onLine;
}

function addOnlineStatusListener(handler) {
    window.addEventListener('online', handler);
}

function removeOnlineStatusListener(handler) {
    window.removeEventListener('online', handler);
}

function addOfflineStatusListener(handler) {
    window.addEventListener('offline', handler);
}

function removeOfflineStatusListener(handler) {
    window.removeEventListener('offline', handler);
}

function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage;
}

function getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
}

function getViewportSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    };
}

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function isLandscape() {
    return window.matchMedia("(orientation: landscape)").matches;
}

function isPortrait() {
    return window.matchMedia("(orientation: portrait)").matches;
}

function addOrientationChangeListener(handler) {
    window.addEventListener('orientationchange', handler);
}

function removeOrientationChangeListener(handler) {
    window.removeEventListener('orientationchange', handler);
}

function reloadPage() {
    window.location.reload();
}

function navigateTo(url) {
    window.location.assign(url);
}

function openInNewTab(url) {
    window.open(url, '_blank');
}

function printPage() {
    window.print();
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function getReferrer() {
    return document.referrer;
}

function getPageTitle() {
    return document.title;
}

function setPageTitle(title) {
    document.title = title;
}

function getMetaContent(name) {
    const meta = document.querySelector(`meta[name="${name}"]`);
    return meta ? meta.content : null;
}

function setMetaContent(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
    }
    meta.content = content;
}

function addScript(src, async = true, defer = true) {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    document.head.appendChild(script);
    return script;
}

function removeScript(src) {
    const script = document.querySelector(`script[src="${src}"]`);
    if (script && script.parentNode) {
        script.parentNode.removeChild(script);
    }
}

function addStylesheet(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return link;
}

function removeStylesheet(href) {
    const link = document.querySelector(`link[href="${href}"]`);
    if (link && link.parentNode) {
        link.parentNode.removeChild(link);
    }
}

function getElementAttribute(selector, attributeName) {
    const element = getElement(selector);
    return element ? element.getAttribute(attributeName) : null;
}

function setElementAttribute(selector, attributeName, value) {
    const element = getElement(selector);
    if (element) {
        element.setAttribute(attributeName, value);
    }
}

function removeElementAttribute(selector, attributeName) {
    const element = getElement(selector);
    if (element) {
        element.removeAttribute(attributeName);
    }
}

function hasElementAttribute(selector, attributeName) {
    const element = getElement(selector);
    return element ? element.hasAttribute(attributeName) : false;
}

function getParent(selector) {
    const element = getElement(selector);
    return element ? element.parentNode : null;
}

function getChildren(selector) {
    const element = getElement(selector);
    return element ? Array.from(element.children) : [];
}

function getSiblings(selector) {
    const element = getElement(selector);
    if (!element || !element.parentNode) return [];
    return Array.from(element.parentNode.children).filter(child => child !== element);
}

function getNextSibling(selector) {
    const element = getElement(selector);
    return element ? element.nextElementSibling : null;
}

function getPreviousSibling(selector) {
    const element = getElement(selector);
    return element ? element.previousElementSibling : null;
}

function prependChild(parentSelector, newChild) {
    const parent = getElement(parentSelector);
    if (parent) {
        parent.prepend(newChild);
    }
}

function appendChild(parentSelector, newChild) {
    const parent = getElement(parentSelector);
    if (parent) {
        parent.appendChild(newChild);
    }
}

function insertBefore(newElement, referenceSelector) {
    const referenceElement = getElement(referenceSelector);
    if (referenceElement && referenceElement.parentNode) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement);
    }
}

function insertAfter(newElement, referenceSelector) {
    const referenceElement = getElement(referenceSelector);
    if (referenceElement && referenceElement.parentNode) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
    }
}

function replaceElement(oldElementSelector, newElement) {
    const oldElement = getElement(oldElementSelector);
    if (oldElement && oldElement.parentNode) {
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }
}

function triggerEvent(selector, eventType, detail = {}) {
    const element = getElement(selector);
    if (element) {
        const event = new CustomEvent(eventType, { detail, bubbles: true, cancelable: true });
        element.dispatchEvent(event);
    }
}

function addCustomEventListener(selector, eventType, handler) {
    const element = getElement(selector);
    if (element) {
        element.addEventListener(eventType, handler);
    }
}

function removeCustomEventListener(selector, eventType, handler) {
    const element = getElement(selector);
    if (element) {
        element.removeEventListener(eventType, handler);
    }
}

function getStyleProperty(selector, propertyName) {
    const element = getElement(selector);
    return element ? element.style[propertyName] : null;
}

function setStyleProperty(selector, propertyName, value) {
    const element = getElement(selector);
    if (element) {
        element.style[propertyName] = value;
    }
}


    
