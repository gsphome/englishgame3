import {
    shuffleArray,
    getGameModeIconSvg,
    getGameModeTitle,
    getGameModeDescription,
    showElement,
    hideElement,
    toggleElementVisibility,
    setElementText,
    addClass,
    removeClass,
    hasClass,
    disableElement,
    enableElement,
    updateElementContent,
    updateTextContent,
    addClickEvent,
    removeClickEvent,
    getInputValue,
    setInputValue,
    clearInputValue,
    getSelectedRadioValue,
    setSelectedRadioValue,
    getDataset,
    setDataset,
    removeDataset,
    createAndAppendElement,
    removeElement,
    removeAllChildren,
    addEventListenerToAll,
    removeEventListenerFromAll,
    getElement,
    getAllElements,
    setFocus,
    getBoundingClientRect,
    getCssVariable,
    setCssVariable,
    animateElement,
    isElementInViewport,
    scrollToElement,
    isValidEmail,
    capitalizeFirstLetter,
    truncateText,
    formatNumber,
    debounce,
    throttle,
    getQueryParams,
    setQueryParams,
    removeQueryParams,
    addKeyboardShortcut,
    removeKeyboardShortcut,
    copyToClipboard,
    isTouchDevice,
    getScrollPosition,
    setScrollPosition,
    getElementCoordinates,
    getCssPropertyValue,
    setCssPropertyValue,
    animateCss,
    isHidden,
    getFormValues,
    setFormValues,
    resetForm,
    submitForm,
    validateForm,
    addClassToAll,
    removeClassFromAll,
    toggleClassToAll,
    hasClassInAny,
    getElementIndex,
    insertAtIndex,
    replaceClass,
    replaceClassInAll,
    getComputedStyleProperty,
    setStyleProperties,
    getAttributeInAll,
    setAttributeInAll,
    removeAttributeInAll,
    hasAttributeInAny,
    getElementText,
    getElementHtml,
    setElementHtml,
    addClassToParent,
    removeClassFromParent,
    toggleClassToParent,
    hasClassInParent,
    getParentWithClass,
    getParentWithAttribute,
    getParents,
    getClosest,
    getNextSiblings,
    getPreviousSiblings,
    getFirstChild,
    getLastChild,
    hasChildren,
    getChildAtIndex,
    isChildOf,
    isDescendantOf,
    isBefore,
    isAfter,
    getElementByDataAttribute,
    getAllElementsByDataAttribute,
    addClassToElementByDataAttribute,
    removeClassFromElementByDataAttribute,
    toggleClassToElementByDataAttribute,
    hasClassInElementByDataAttribute,
    setElementTextByDataAttribute,
    setElementHtmlByDataAttribute,
    getElementTextByDataAttribute,
    getElementHtmlByDataAttribute,
    addClickEventByDataAttribute,
    removeClickEventByDataAttribute,
    getInputValueByDataAttribute,
    setInputValueByDataAttribute,
    clearInputValueByDataAttribute,
    disableElementByDataAttribute,
    enableElementByDataAttribute,
    showElementByDataAttribute,
    hideElementByDataAttribute,
    toggleElementVisibilityByDataAttribute,
    getDatasetByDataAttribute,
    setDatasetByDataAttribute,
    removeDatasetByDataAttribute,
    getElementAttributeByDataAttribute,
    setElementAttributeByDataAttribute,
    removeElementAttributeByDataAttribute,
    hasElementAttributeByDataAttribute,
    getStylePropertyByDataAttribute,
    setStylePropertyByDataAttribute,
    getComputedStylePropertyByDataAttribute,
    setStylePropertiesByDataAttribute,
    animateElementByDataAttribute,
    animateCssByDataAttribute,
    isHiddenByDataAttribute,
    getBoundingClientRectByDataAttribute,
    isElementInViewportByDataAttribute,
    scrollToElementByDataAttribute,
    setFocusByDataAttribute,
    getParentByDataAttribute,
    getChildrenByDataAttribute,
    getSiblingsByDataAttribute,
    getNextSiblingByDataAttribute,
    getPreviousSiblingByDataAttribute,
    prependChildByDataAttribute,
    appendChildByDataAttribute,
    insertBeforeByDataAttribute,
    insertAfterByDataAttribute,
    replaceElementByDataAttribute,
    removeElementByDataAttribute,
    removeAllChildrenByDataAttribute,
    addEventListenerToAllByDataAttribute,
    removeEventListenerFromAllByDataAttribute,
    triggerEventByDataAttribute,
    addCustomEventListenerByDataAttribute,
    removeCustomEventListenerByDataAttribute,
    getFormValuesByDataAttribute,
    setFormValuesByDataAttribute,
    resetFormByDataAttribute,
    submitFormByDataAttribute,
    validateFormByDataAttribute,
    getElementIndexByDataAttribute,
    insertAtIndexByDataAttribute,
    replaceClassByDataAttribute,
    getParentsByDataAttribute,
    getClosestByDataAttribute,
    getNextSiblingsByDataAttribute,
    getPreviousSiblingsByDataAttribute,
    getFirstChildByDataAttribute,
    getLastChildByDataAttribute,
    hasChildrenByDataAttribute,
    getChildAtIndexByDataAttribute,
    isChildOfByDataAttribute,
    isDescendantOfByDataAttribute,
    isBeforeByDataAttribute,
    isAfterByDataAttribute,
    getParentWithClassByDataAttribute,
    getParentWithAttributeByDataAttribute,
    addClassToParentByDataAttribute,
    removeClassFromParentByDataAttribute,
    toggleClassToParentByDataAttribute,
    hasClassInParentByDataAttribute,
    getElementCoordinatesByDataAttribute,
    getCssPropertyValueByDataAttribute,
    setCssPropertyValueByDataAttribute,
    getElementTextContent,
    setElementTextContent,
    getElementHtmlContent,
    setElementHtmlContent,
    getElementValue,
    setElementValue,
    clearElementValue,
    getElementChecked,
    setElementChecked,
    toggleElementChecked,
    getElementSelected,
    setElementSelected,
    getElementDisabled,
    setElementDisabled,
    getElementReadOnly,
    setElementReadOnly,
    getElementPlaceholder,
    setElementPlaceholder,
    getElementSrc,
    setElementSrc,
    getElementHref,
    setElementHref,
    getElementTitle,
    setElementTitle,
    getElementAlt,
    setElementAlt,
    getElementWidth,
    setElementWidth,
    getElementHeight,
    setElementHeight,
    getElementTabIndex,
    setElementTabIndex,
    getElementId,
    setElementId,
    getElementClassName,
    setElementClassName,
    getElementTagName,
    getElementTagNameByDataAttribute,
    getElementClientWidth,
    getElementClientHeight,
    getElementOffsetWidth,
    getElementOffsetHeight,
    getElementScrollWidth,
    getElementScrollHeight,
    getElementScrollLeft,
    setElementScrollLeft,
    getElementScrollTop,
    setElementScrollTop,
    getElementOffsetLeft,
    getElementOffsetTop,
    getElementClientLeft,
    getElementClientTop,
    getElementOwnerDocument,
    getElementBaseURI,
    getElementNodeName,
    getElementNodeType,
    getElementNodeValue,
    getElementTextContentByDataAttribute,
    setElementTextContentByDataAttribute,
    getElementHtmlContentByDataAttribute,
    setElementHtmlContentByDataAttribute,
    getElementValueByDataAttribute,
    setElementValueByDataAttribute,
    clearElementValueByDataAttribute,
    getElementCheckedByDataAttribute,
    setElementCheckedByDataAttribute,
    toggleElementCheckedByDataAttribute,
    getElementSelectedByDataAttribute,
    setElementSelectedByDataAttribute,
    getElementDisabledByDataAttribute,
    setElementDisabledByDataAttribute,
    getElementReadOnlyByDataAttribute,
    setElementReadOnlyByDataAttribute,
    getElementPlaceholderByDataAttribute,
    setElementPlaceholderByDataAttribute,
    getElementSrcByDataAttribute,
    setElementSrcByDataAttribute,
    getElementHrefByDataAttribute,
    setElementHrefByDataAttribute,
    getElementTitleByDataAttribute,
    setElementTitleByDataAttribute,
    getElementAltByDataAttribute,
    setElementAltByDataAttribute,
    getElementWidthByDataAttribute,
    setElementWidthByDataAttribute,
    getElementHeightByDataAttribute,
    setElementHeightByDataAttribute,
    getElementTabIndexByDataAttribute,
    setElementTabIndexByDataAttribute,
    getElementIdByDataAttribute,
    setElementIdByDataAttribute,
    getElementClassNameByDataAttribute,
    setElementClassNameByDataAttribute,
    getElementClientWidthByDataAttribute,
    getElementClientHeightByDataAttribute,
    getElementOffsetWidthByDataAttribute,
    getElementOffsetHeightByDataAttribute,
    getElementScrollWidthByDataAttribute,
    getElementScrollHeightByDataAttribute,
    getElementScrollLeftByDataAttribute,
    setElementScrollLeftByDataAttribute,
    getElementScrollTopByDataAttribute,
    setElementScrollTopByDataAttribute,
    getElementOffsetLeftByDataAttribute,
    getElementOffsetTopByDataAttribute,
    getElementClientLeftByDataAttribute,
    getElementClientTopByDataAttribute,
    getElementOwnerDocumentByDataAttribute,
    getElementBaseURIByDataAttribute,
    getElementNodeNameByDataAttribute,
    getElementNodeTypeByDataAttribute,
    getElementNodeValueByDataAttribute,
    getLocalStorageItem,
    setLocalStorageItem,
    removeLocalStorageItem,
    clearLocalStorage,
    getSessionStorageItem,
    setSessionStorageItem,
    removeSessionStorageItem,
    clearSessionStorage,
    isOnline,
    addOnlineStatusListener,
    removeOnlineStatusListener,
    addOfflineStatusListener,
    removeOfflineStatusListener,
    getBrowserLanguage,
    getDevicePixelRatio,
    getViewportSize,
    isMobileDevice,
    isLandscape,
    isPortrait,
    addOrientationChangeListener,
    removeOrientationChangeListener,
    reloadPage,
    navigateTo,
    openInNewTab,
    printPage,
    getCookie,
    setCookie,
    deleteCookie,
    getReferrer,
    getPageTitle,
    setPageTitle,
    getMetaContent,
    setMetaContent,
    addScript,
    removeScript,
    addStylesheet,
    removeStylesheet,
    getElementAttribute,
    setElementAttribute,
    removeElementAttribute,
    hasElementAttribute,
    getParent,
    getChildren,
    getSiblings,
    getNextSibling,
    getPreviousSibling,
    prependChild,
    appendChild,
    insertBefore,
    insertAfter,
    replaceElement,
    triggerEvent,
    addCustomEventListener,
    removeCustomEventListener,
    getStyleProperty,
    setStyleProperty,
} from '../utils';

// Mock DOM elements for testing
document.body.innerHTML = `
    <div id="test-element" class="hidden" data-test-attr="value1">Test Content</div>
    <input type="text" id="test-input" value="initial">
    <input type="radio" name="test-radio" value="radio1" checked>
    <input type="radio" name="test-radio" value="radio2">
    <div id="parent">
        <div id="child1"></div>
        <div id="child2" class="target-child"></div>
        <div id="child3"></div>
    </div>
    <form id="test-form">
        <input type="text" name="field1" value="formValue1">
        <input type="checkbox" name="field2" checked>
    </form>
    <div class="multiple-elements">Element 1</div>
    <div class="multiple-elements">Element 2</div>
    <div class="multiple-elements">Element 3</div>
    <div id="element-with-style" style="color: red; font-size: 16px;"></div>
    <a id="test-link" href="http://example.com" title="Test Link" alt="Test Alt">Link</a>
    <img id="test-image" src="image.png" width="100" height="50">
    <input type="text" id="readonly-input" readonly>
    <input type="text" id="disabled-input" disabled>
    <input type="text" id="placeholder-input" placeholder="Enter text">
    <select id="test-select">
        <option value="opt1">Option 1</option>
        <option value="opt2" selected>Option 2</option>
    </select>
    <div id="element-with-tabindex" tabindex="5"></div>
    <div id="element-with-id" class="some-class"></div>
    <div id="element-with-tagname"></div>
    <div id="element-with-client-dims" style="width: 100px; height: 50px; padding: 10px; border: 2px solid black;"></div>
    <div id="element-with-offset-dims" style="width: 100px; height: 50px; margin: 5px;"></div>
    <div id="element-with-scroll" style="width: 50px; height: 50px; overflow: scroll;">
        <div style="width: 100px; height: 100px;"></div>
    </div>
    <div id="element-with-offset-pos" style="position: relative; left: 10px; top: 20px;"></div>
    <div id="element-with-client-border" style="border-left: 5px solid blue; border-top: 10px solid green;"></div>
    <div id="element-with-owner-document"></div>
    <div id="element-with-base-uri"></div>
    <div id="element-with-node-name"></div>
    <div id="element-with-node-type"></div>
    <div id="element-with-node-value">Text Node Value</div>
    <div id="ancestor">
        <div id="parent-of-descendant">
            <div id="descendant"></div>
        </div>
    </div>
    <div id="element-before"></div>
    <div id="element-after"></div>
    <div id="parent-with-class" class="some-parent-class">
        <div id="child-of-parent-with-class"></div>
    </div>
    <div id="parent-with-attr" data-custom-attr="true">
        <div id="child-of-parent-with-attr"></div>
    </div>
`;

// Mock window properties for testing
Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
Object.defineProperty(window, 'innerHeight', { writable: true, value: 768 });
Object.defineProperty(document.documentElement, 'clientWidth', { writable: true, value: 1024 });
Object.defineProperty(document.documentElement, 'clientHeight', { writable: true, value: 768 });
Object.defineProperty(window, 'pageXOffset', { writable: true, value: 0 });
Object.defineProperty(window, 'pageYOffset', { writable: true, value: 0 });
Object.defineProperty(window, 'getComputedStyle', {
    value: (element) => ({
        getPropertyValue: (prop) => {
            if (element.id === 'element-with-style') {
                if (prop === 'color') return 'red';
                if (prop === 'font-size') return '16px';
            }
            if (element === document.documentElement && prop === '--test-var') return 'var-value';
            return '';
        }
    })
});
Object.defineProperty(document.documentElement.style, 'setProperty', {
    value: jest.fn()
});
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: query === "(orientation: landscape)",
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }))
});
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: jest.fn(() => Promise.resolve())
    },
    writable: true
});
Object.defineProperty(navigator, 'onLine', { writable: true, value: true });
Object.defineProperty(navigator, 'language', { writable: true, value: 'en-US' });
Object.defineProperty(navigator, 'devicePixelRatio', { writable: true, value: 2 });

// Corrected window.location mocking
const mockLocation = {
    search: '',
    pathname: '/test',
    href: '',
    replaceState: jest.fn(),
    reload: jest.fn(),
};

Object.defineProperty(window, 'location', {
    writable: true,
    value: mockLocation,
});

Object.defineProperty(window, 'history', {
    writable: true,
    value: {
        replaceState: jest.fn(), // This will be spied on later
    }
});
Object.defineProperty(document, 'cookie', {
    writable: true,
    value: ''
});
Object.defineProperty(document, 'referrer', { writable: true, value: 'http://referrer.com' });
Object.defineProperty(document, 'title', { writable: true, value: 'Original Title' });
Object.defineProperty(localStorage, 'getItem', { writable: true, value: jest.fn() });
Object.defineProperty(localStorage, 'setItem', { writable: true, value: jest.fn() });
Object.defineProperty(localStorage, 'removeItem', { writable: true, value: jest.fn() });
Object.defineProperty(localStorage, 'clear', { writable: true, value: jest.fn() });
Object.defineProperty(sessionStorage, 'getItem', { writable: true, value: jest.fn() });
Object.defineProperty(sessionStorage, 'setItem', { writable: true, value: jest.fn() });
Object.defineProperty(sessionStorage, 'removeItem', { writable: true, value: jest.fn() });
Object.defineProperty(sessionStorage, 'clear', { writable: true, value: jest.fn() });


describe('shuffleArray', () => {
    test('should shuffle the array elements randomly', () => {
        const originalArray = [1, 2, 3, 4, 5];
        const shuffledArray = shuffleArray([...originalArray]); // Create a copy to avoid modifying original
        expect(shuffledArray.length).toBe(originalArray.length);
        expect(shuffledArray).not.toEqual(originalArray); // Highly unlikely to be the same order
        expect(shuffledArray).toEqual(expect.arrayContaining(originalArray)); // Should contain same elements
    });

    test('should handle empty array', () => {
        const emptyArray = [];
        expect(shuffleArray(emptyArray)).toEqual([]);
    });

    test('should handle single element array', () => {
        const singleElementArray = [1];
        expect(shuffleArray(singleElementArray)).toEqual([1]);
    });
});

describe('getGameModeIconSvg', () => {
    test('should return correct SVG for flashcard', () => {
        expect(getGameModeIconSvg('flashcard')).toContain('<path d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6Zm0 2.25h12a.75.75 0 0 1 .75.75v6.182a.75.75 0 0 1-.416.673L16.5 15.375l-1.749 1.049a.75.75 0 0 1-.961-.961ZM6.75 7.5a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H6.75Z" />');
    });

    test('should return correct SVG for quiz', () => {
        expect(getGameModeIconSvg('quiz')).toContain('<path fill-rule="evenodd" d="M18.685 19.02a1.75 1.75 0 0 0 1.75-1.75V4.75a1.75 1.75 0 0 0-1.75-1.75H5.315a1.75 1.75 0 0 0-1.75 1.75v12.52a1.75 1.75 0 0 0 1.75 1.75h13.37ZM12 10.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75ZM12 7a.75.75 0 0 0-.75.75v.008a.75.75 0 0 0 1.5 0V7.75A.75.75 0 0 0 12 7Z" clip-rule="evenodd" />');
    });

    test('should return correct SVG for completion', () => {
        expect(getGameModeIconSvg('completion')).toContain('<path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" />');
    });

    test('should return correct SVG for sorting', () => {
        expect(getGameModeIconSvg('sorting')).toContain('<path fill-rule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.795 0 5.562.16 8.208.438.896.09 1.378 1.102.722 1.807l-4.75 5.109a.75.75 0 0 1-1.124.077L12 6.66l-2.556 2.666a.75.75 0 0 1-1.124-.077L3.07 4.745a1.5 1.5 0 0 1 .722-1.807ZM12 12.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />');
    });

    test('should return correct SVG for matching', () => {
        expect(getGameModeIconSvg('matching')).toContain('<path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0L12 16.061l-2.19-2.19a1.5 1.5 0 0 0-2.12 0L3 16.06ZM15.75 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />');
    });

    test('should return default SVG for unknown game mode', () => {
        expect(getGameModeIconSvg('unknown')).toContain('<path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />');
    });
});

describe('getGameModeTitle', () => {
    test('should return correct title for flashcard', () => {
        expect(getGameModeTitle('flashcard')).toBe('Flashcard Mode');
    });

    test('should return correct title for quiz', () => {
        expect(getGameModeTitle('quiz')).toBe('Quiz Mode');
    });

    test('should return correct title for completion', () => {
        expect(getGameModeTitle('completion')).toBe('Completion Mode');
    });

    test('should return correct title for sorting', () => {
        expect(getGameModeTitle('sorting')).toBe('Sorting Mode');
    });

    test('should return correct title for matching', () => {
        expect(getGameModeTitle('matching')).toBe('Matching Mode');
    });

    test('should return default title for unknown game mode', () => {
        expect(getGameModeTitle('unknown')).toBe('Game Mode');
    });
});

describe('getGameModeDescription', () => {
    test('should return correct description for flashcard', () => {
        expect(getGameModeDescription('flashcard')).toBe('Practice vocabulary and concepts with interactive flashcards.');
    });

    test('should return correct description for quiz', () => {
        expect(getGameModeDescription('quiz')).toBe('Test your knowledge with multiple-choice questions.');
    });

    test('should return correct description for completion', () => {
        expect(getGameModeDescription('completion')).toBe('Fill in the blanks to complete sentences or phrases.');
    });

    test('should return correct description for sorting', () => {
        expect(getGameModeDescription('sorting')).toBe('Categorize words or phrases into their correct groups.');
    });

    test('should return correct description for matching', () => {
        expect(getGameModeDescription('matching')).toBe('Match terms with their definitions or corresponding items.');
    });

    test('should return default description for unknown game mode', () => {
        expect(getGameModeDescription('unknown')).toBe('Select a game mode to start practicing.');
    });
});

describe('DOM Manipulation Functions', () => {
    let element;

    beforeEach(() => {
        element = document.getElementById('test-element');
    });

    describe('showElement', () => {
        test('should remove the hidden class from an element', () => {
            element.classList.add('hidden');
            showElement(element);
            expect(element.classList.contains('hidden')).toBe(false);
        });

        test('should do nothing if element is null', () => {
            const initialClasses = element.classList.length;
            showElement(null);
            expect(element.classList.length).toBe(initialClasses);
        });
    });

    describe('hideElement', () => {
        test('should add the hidden class to an element', () => {
            element.classList.remove('hidden');
            hideElement(element);
            expect(element.classList.contains('hidden')).toBe(true);
        });

        test('should do nothing if element is null', () => {
            const initialClasses = element.classList.length;
            hideElement(null);
            expect(element.classList.length).toBe(initialClasses);
        });
    });

    describe('toggleElementVisibility', () => {
        test('should add hidden class if not present', () => {
            element.classList.remove('hidden');
            toggleElementVisibility(element);
            expect(element.classList.contains('hidden')).toBe(true);
        });

        test('should remove hidden class if present', () => {
            element.classList.add('hidden');
            toggleElementVisibility(element);
            expect(element.classList.contains('hidden')).toBe(false);
        });

        test('should do nothing if element is null', () => {
            const initialClasses = element.classList.length;
            toggleElementVisibility(null);
            expect(element.classList.length).toBe(initialClasses);
        });
    });

    describe('setElementText', () => {
        test('should set the text content of an element', () => {
            setElementText(element, 'New Text');
            expect(element.textContent).toBe('New Text');
        });

        test('should do nothing if element is null', () => {
            const originalText = element.textContent;
            setElementText(null, 'New Text');
            expect(element.textContent).toBe(originalText);
        });
    });

    describe('addClass', () => {
        test('should add a class to an element', () => {
            addClass(element, 'new-class');
            expect(element.classList.contains('new-class')).toBe(true);
        });

        test('should do nothing if element is null', () => {
            const initialClasses = element.classList.length;
            addClass(null, 'new-class');
            expect(element.classList.length).toBe(initialClasses);
        });
    });

    describe('removeClass', () => {
        test('should remove a class from an element', () => {
            element.classList.add('to-remove');
            removeClass(element, 'to-remove');
            expect(element.classList.contains('to-remove')).toBe(false);
        });

        test('should do nothing if element is null', () => {
            const initialClasses = element.classList.length;
            removeClass(null, 'to-remove');
            expect(element.classList.length).toBe(initialClasses);
        });
    });

    describe('hasClass', () => {
        test('should return true if element has the class', () => {
            element.classList.add('check-class');
            expect(hasClass(element, 'check-class')).toBe(true);
        });

        test('should return false if element does not have the class', () => {
            expect(hasClass(element, 'non-existent-class')).toBe(false);
        });

        test('should return false if element is null', () => {
            expect(hasClass(null, 'any-class')).toBe(false);
        });
    });

    describe('disableElement', () => {
        let buttonElement;
        beforeEach(() => {
            buttonElement = document.createElement('button');
            document.body.appendChild(buttonElement);
        });

        afterEach(() => {
            document.body.removeChild(buttonElement);
        });

        test('should disable the element and add styling classes', () => {
            disableElement(buttonElement);
            expect(buttonElement.disabled).toBe(true);
            expect(buttonElement.classList.contains('opacity-50')).toBe(true);
            expect(buttonElement.classList.contains('cursor-not-allowed')).toBe(true);
        });

        test('should do nothing if element is null', () => {
            disableElement(null);
            // No error should be thrown, and no changes to other elements
        });
    });

    describe('enableElement', () => {
        let buttonElement;
        beforeEach(() => {
            buttonElement = document.createElement('button');
            buttonElement.disabled = true;
            buttonElement.classList.add('opacity-50', 'cursor-not-allowed');
            document.body.appendChild(buttonElement);
        });

        afterEach(() => {
            document.body.removeChild(buttonElement);
        });

        test('should enable the element and remove styling classes', () => {
            enableElement(buttonElement);
            expect(buttonElement.disabled).toBe(false);
            expect(buttonElement.classList.contains('opacity-50')).toBe(false);
            expect(buttonElement.classList.contains('cursor-not-allowed')).toBe(false);
        });

        test('should do nothing if element is null', () => {
            enableElement(null);
            // No error should be thrown, and no changes to other elements
        });
    });

    describe('updateElementContent', () => {
        test('should update the innerHTML of an element', () => {
            updateElementContent('#test-element', '<span>New HTML</span>');
            expect(element.innerHTML).toBe('<span>New HTML</span>');
        });

        test('should do nothing if selector does not match an element', () => {
            const originalHTML = element.innerHTML;
            updateElementContent('#non-existent', 'New HTML');
            expect(element.innerHTML).toBe(originalHTML);
        });
    });

    describe('updateTextContent', () => {
        test('should update the textContent of an element', () => {
            updateTextContent('#test-element', 'New Text Content');
            expect(element.textContent).toBe('New Text Content');
        });

        test('should do nothing if selector does not match an element', () => {
            const originalText = element.textContent;
            updateTextContent('#non-existent', 'New Text Content');
            expect(element.textContent).toBe(originalText);
        });
    });

    describe('addClickEvent', () => {
        test('should add a click event listener to an element', () => {
            const handler = jest.fn();
            addClickEvent('#test-element', handler);
            element.click();
            expect(handler).toHaveBeenCalledTimes(1);
        });

        test('should do nothing if selector does not match an element', () => {
            const handler = jest.fn();
            addClickEvent('#non-existent', handler);
            element.click(); // Click the existing element, handler should not be called
            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('removeClickEvent', () => {
        test('should remove a click event listener from an element', () => {
            const handler = jest.fn();
            element.addEventListener('click', handler); // Manually add for removal test
            removeClickEvent('#test-element', handler);
            element.click();
            expect(handler).not.toHaveBeenCalled();
        });

        test('should do nothing if selector does not match an element', () => {
            const handler = jest.fn();
            element.addEventListener('click', handler);
            removeClickEvent('#non-existent', handler);
            element.click(); // Handler should still be called as it wasn't removed
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });

    describe('getInputValue', () => {
        let inputElement;
        beforeEach(() => {
            inputElement = document.getElementById('test-input');
        });

        test('should return the value of an input element', () => {
            expect(getInputValue('#test-input')).toBe('initial');
        });

        test('should return null if selector does not match an input element', () => {
            expect(getInputValue('#test-element')).toBeNull(); // Not an input
            expect(getInputValue('#non-existent')).toBeNull();
        });
    });

    describe('setInputValue', () => {
        let inputElement;
        beforeEach(() => {
            inputElement = document.getElementById('test-input');
        });

        test('should set the value of an input element', () => {
            setInputValue('#test-input', 'new value');
            expect(inputElement.value).toBe('new value');
        });

        test('should do nothing if selector does not match an input element', () => {
            const originalValue = inputElement.value;
            setInputValue('#test-element', 'new value'); // Not an input
            expect(inputElement.value).toBe(originalValue);
            setInputValue('#non-existent', 'new value');
            expect(inputElement.value).toBe(originalValue);
        });
    });

    describe('clearInputValue', () => {
        let inputElement;
        beforeEach(() => {
            inputElement = document.getElementById('test-input');
            inputElement.value = 'some text';
        });

        test('should clear the value of an input element', () => {
            clearInputValue('#test-input');
            expect(inputElement.value).toBe('');
        });

        test('should do nothing if selector does not match an input element', () => {
            const originalValue = inputElement.value;
            clearInputValue('#test-element'); // Not an input
            expect(inputElement.value).toBe(originalValue);
            clearInputValue('#non-existent');
            expect(inputElement.value).toBe(originalValue);
        });
    });

    describe('getSelectedRadioValue', () => {
        test('should return the value of the checked radio button', () => {
            expect(getSelectedRadioValue('test-radio')).toBe('radio1');
        });

        test('should return null if no radio button is checked', () => {
            const radios = document.getElementsByName('test-radio');
            radios.forEach(radio => radio.checked = false);
            expect(getSelectedRadioValue('test-radio')).toBeNull();
        });

        test('should return null if no radio buttons with the given name exist', () => {
            expect(getSelectedRadioValue('non-existent-radio')).toBeNull();
        });
    });

    describe('setSelectedRadioValue', () => {
        test('should set the checked state of the radio button with the given value', () => {
            setSelectedRadioValue('test-radio', 'radio2');
            expect(document.querySelector('input[name="test-radio"][value="radio2"]').checked).toBe(true);
            expect(document.querySelector('input[name="test-radio"][value="radio1"]').checked).toBe(false);
        });

        test('should do nothing if no radio button with the given value exists', () => {
            const originalChecked = document.querySelector('input[name="test-radio"][value="radio1"]').checked;
            setSelectedRadioValue('test-radio', 'non-existent-value');
            expect(document.querySelector('input[name="test-radio"][value="radio1"]').checked).toBe(originalChecked);
        });
    });

    describe('getDataset', () => {
        test('should return the value of a data attribute', () => {
            expect(getDataset('#test-element', 'testAttr')).toBe('value1');
        });

        test('should return null if data attribute does not exist', () => {
            expect(getDataset('#test-element', 'nonExistentAttr')).toBeNull();
        });

        test('should return null if element is null', () => {
            expect(getDataset(null, 'anyAttr')).toBeNull();
        });
    });

    describe('setDataset', () => {
        test('should set the value of a data attribute', () => {
            setDataset('#test-element', 'newAttr', 'new-value');
            expect(element.dataset.newAttr).toBe('new-value');
        });

        test('should do nothing if element is null', () => {
            setDataset(null, 'newAttr', 'new-value');
            // No error should be thrown
        });
    });

    describe('removeDataset', () => {
        test('should remove a data attribute', () => {
            element.dataset.toRemove = 'some-value';
            removeDataset('#test-element', 'toRemove');
            expect(element.dataset.toRemove).toBeUndefined();
        });

        test('should do nothing if element is null', () => {
            removeDataset(null, 'toRemove');
            // No error should be thrown
        });
    });

    describe('createAndAppendElement', () => {
        test('should create and append an element with attributes and text content', () => {
            const newDiv = createAndAppendElement('body', 'div', { id: 'new-div', class: 'my-class' }, 'Hello');
            expect(newDiv).not.toBeNull();
            expect(newDiv.id).toBe('new-div');
            expect(newDiv.classList.contains('my-class')).toBe(true);
            expect(newDiv.textContent).toBe('Hello');
            expect(document.body.contains(newDiv)).toBe(true);
        });

        test('should return null if parent selector does not match', () => {
            const newDiv = createAndAppendElement('#non-existent-parent', 'div');
            expect(newDiv).toBeNull();
        });
    });

    describe('removeElement', () => {
        let tempDiv;
        beforeEach(() => {
            tempDiv = document.createElement('div');
            tempDiv.id = 'temp-div-to-remove';
            document.body.appendChild(tempDiv);
        });

        afterEach(() => {
            document.body.removeChild(tempDiv);
        });

        test('should remove an element from the DOM', () => {
            expect(document.getElementById('temp-div-to-remove')).not.toBeNull();
            removeElement('#temp-div-to-remove');
            expect(document.getElementById('temp-div-to-remove')).toBeNull();
        });

        test('should do nothing if selector does not match an element', () => {
            removeElement('#non-existent-element');
            expect(document.getElementById('temp-div-to-remove')).not.toBeNull(); // Should still be there
        });
    });

    describe('removeAllChildren', () => {
        let parentElement;
        beforeEach(() => {
            parentElement = document.getElementById('parent');
            parentElement.innerHTML = '<div class="child"></div><div class="child"></div>';
        });

        test('should remove all children from an element', () => {
            expect(parentElement.children.length).toBe(2);
            removeAllChildren('#parent');
            expect(parentElement.children.length).toBe(0);
        });

        test('should do nothing if selector does not match an element', () => {
            removeAllChildren('#non-existent-parent');
            expect(parentElement.children.length).toBe(2); // Should still have children
        });
    });

    describe('addEventListenerToAll', () => {
        test('should add event listener to all matching elements', () => {
            const handler = jest.fn();
            addEventListenerToAll('.multiple-elements', 'click', handler);
            document.querySelectorAll('.multiple-elements').forEach(el => el.click());
            expect(handler).toHaveBeenCalledTimes(3);
        });

        test('should do nothing if no elements match', () => {
            const handler = jest.fn();
            addEventListenerToAll('.non-existent-elements', 'click', handler);
            // No elements to click, handler should not be called
            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('removeEventListenerFromAll', () => {
        test('should remove event listener from all matching elements', () => {
            const handler = jest.fn();
            const elements = document.querySelectorAll('.multiple-elements');
            elements.forEach(el => el.addEventListener('click', handler));

            removeEventListenerFromAll('.multiple-elements', 'click', handler);
            elements.forEach(el => el.click());
            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('getElement', () => {
        test('should return the first element matching the selector', () => {
            const el = getElement('#test-element');
            expect(el).toBe(document.getElementById('test-element'));
        });

        test('should return null if no element matches', () => {
            expect(getElement('#non-existent')).toBeNull();
        });
    });

    describe('getAllElements', () => {
        test('should return all elements matching the selector', () => {
            const elements = getAllElements('.multiple-elements');
            expect(elements.length).toBe(3);
            expect(elements[0]).toBe(document.querySelectorAll('.multiple-elements')[0]);
        });

        test('should return an empty NodeList if no elements match', () => {
            const elements = getAllElements('.non-existent');
            expect(elements.length).toBe(0);
        });
    });

    describe('setFocus', () => {
        let input;
        beforeEach(() => {
            input = document.createElement('input');
            input.id = 'focus-test-input';
            document.body.appendChild(input);
            input.focus = jest.fn(); // Mock focus method
        });

        afterEach(() => {
            document.body.removeChild(input);
        });

        test('should set focus on the element', () => {
            setFocus('#focus-test-input');
            expect(input.focus).toHaveBeenCalledTimes(1);
        });

        test('should do nothing if element is null or does not have focus method', () => {
            setFocus('#non-existent');
            expect(input.focus).not.toHaveBeenCalled(); // Should not affect other elements
            setFocus('#test-element'); // A div, no focus method
            expect(input.focus).not.toHaveBeenCalled();
        });
    });

    describe('getBoundingClientRect', () => {
        test('should return the bounding client rect of an element', () => {
            const rect = getBoundingClientRect('#test-element');
            expect(rect).not.toBeNull();
            expect(typeof rect.width).toBe('number');
            expect(typeof rect.height).toBe('number');
        });

        test('should return null if element is null', () => {
            expect(getBoundingClientRect('#non-existent')).toBeNull();
        });
    });

    describe('getCssVariable', () => {
        test('should return the value of a CSS variable', () => {
            document.documentElement.style.setProperty('--test-var', 'var-value');
            expect(getCssVariable('--test-var')).toBe('var-value');
        });

        test('should return empty string if variable not found', () => {
            expect(getCssVariable('--non-existent-var')).toBe('');
        });
    });

    describe('setCssVariable', () => {
        test('should set the value of a CSS variable', () => {
            setCssVariable('--new-var', 'new-var-value');
            expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--new-var', 'new-var-value');
        });
    });

    describe('animateElement', () => {
        let elementToAnimate;
        beforeEach(() => {
            elementToAnimate = document.createElement('div');
            elementToAnimate.id = 'animate-test';
            document.body.appendChild(elementToAnimate);
            elementToAnimate.animate = jest.fn(() => ({
                // Mock the Animation object returned by animate
                play: jest.fn(),
                pause: jest.fn(),
                cancel: jest.fn(),
                finish: jest.fn(),
                onfinish: null,
                oncancel: null,
            }));
        });

        afterEach(() => {
            document.body.removeChild(elementToAnimate);
        });

        test('should call animate on the element', () => {
            const keyframes = [{ opacity: 0 }, { opacity: 1 }];
            const options = { duration: 1000 };
            animateElement('#animate-test', keyframes, options);
            expect(elementToAnimate.animate).toHaveBeenCalledWith(keyframes, options);
        });

        test('should return null if element is null or does not have animate method', () => {
            expect(animateElement('#non-existent', [], {})).toBeNull();
            const div = document.createElement('div');
            div.id = 'no-animate-method';
            document.body.appendChild(div);
            expect(animateElement('#no-animate-method', [], {})).toBeNull();
            document.body.removeChild(div);
        });
    });

    describe('isElementInViewport', () => {
        let elementInView;
        beforeEach(() => {
            elementInView = document.createElement('div');
            elementInView.id = 'in-viewport-test';
            document.body.appendChild(elementInView);
            // Mock getBoundingClientRect to simulate element in viewport
            elementInView.getBoundingClientRect = () => ({
                top: 10, left: 10, bottom: 20, right: 20, width: 10, height: 10
            });
        });

        afterEach(() => {
            document.body.removeChild(elementInView);
        });

        test('should return true if element is in viewport', () => {
            expect(isElementInViewport('#in-viewport-test')).toBe(true);
        });

        test('should return false if element is not in viewport', () => {
            elementInView.getBoundingClientRect = () => ({
                top: -100, left: -100, bottom: -90, right: -90, width: 10, height: 10
            }); // Off-screen
            expect(isElementInViewport('#in-viewport-test')).toBe(false);
        });

        test('should return false if element is null', () => {
            expect(isElementInViewport('#non-existent')).toBe(false);
        });
    });

    describe('scrollToElement', () => {
        let elementToScroll;
        beforeEach(() => {
            elementToScroll = document.createElement('div');
            elementToScroll.id = 'scroll-test';
            document.body.appendChild(elementToScroll);
            elementToScroll.scrollIntoView = jest.fn(); // Mock scrollIntoView method
        });

        afterEach(() => {
            document.body.removeChild(elementToScroll);
        });

        test('should call scrollIntoView on the element', () => {
            const options = { behavior: 'smooth' };
            scrollToElement('#scroll-test', options);
            expect(elementToScroll.scrollIntoView).toHaveBeenCalledWith(options);
        });

        test('should do nothing if element is null or does not have scrollIntoView method', () => {
            scrollToElement('#non-existent', {});
            expect(elementToScroll.scrollIntoView).not.toHaveBeenCalled();
            const div = document.createElement('div');
            div.id = 'no-scroll-method';
            document.body.appendChild(div);
            scrollToElement('#no-scroll-method', {});
            expect(elementToScroll.scrollIntoView).not.toHaveBeenCalled();
            document.body.removeChild(div);
        });
    });

    describe('isValidEmail', () => {
        test('should return true for valid emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('john.doe123@sub.domain.co.uk')).toBe(true);
        });

        test('should return false for invalid emails', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('test@.com')).toBe(false);
            expect(isValidEmail('test@example')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
            expect(isValidEmail('test@example..com')).toBe(false);
        });
    });

    describe('capitalizeFirstLetter', () => {
        test('should capitalize the first letter of a string', () => {
            expect(capitalizeFirstLetter('hello')).toBe('Hello');
            expect(capitalizeFirstLetter('world')).toBe('World');
        });

        test('should return an empty string for an empty string', () => {
            expect(capitalizeFirstLetter('')).toBe('');
        });

        test('should handle single character strings', () => {
            expect(capitalizeFirstLetter('a')).toBe('A');
        });

        test('should handle non-string inputs', () => {
            expect(capitalizeFirstLetter(null)).toBe('');
            expect(capitalizeFirstLetter(undefined)).toBe('');
            expect(capitalizeFirstLetter(123)).toBe('');
        });
    });

    describe('truncateText', () => {
        test('should truncate text and add ellipsis if longer than maxLength', () => {
            expect(truncateText('This is a long text', 10)).toBe('This is a...');
        });

        test('should return original text if shorter than or equal to maxLength', () => {
            expect(truncateText('Short text', 10)).toBe('Short text');
            expect(truncateText('Exact length', 12)).toBe('Exact length');
        });

        test('should handle empty string', () => {
            expect(truncateText('', 5)).toBe('');
        });

        test('should handle non-string inputs', () => {
            expect(truncateText(null, 5)).toBe(null); // Should return original non-string value
            expect(truncateText(123, 5)).toBe(123);
        });
    });

    describe('formatNumber', () => {
        test('should format number with commas and specified decimals', () => {
            expect(formatNumber(1234567.89, 2)).toBe('1,234,567.89');
            expect(formatNumber(1234.5, 0)).toBe('1,235'); // Rounds up
            expect(formatNumber(1000, 0)).toBe('1,000');
        });

        test('should handle numbers without decimals', () => {
            expect(formatNumber(9876543)).toBe('9,876,543');
        });

        test('should handle zero', () => {
            expect(formatNumber(0)).toBe('0');
        });

        test('should return empty string for non-number inputs', () => {
            expect(formatNumber('abc')).toBe('');
            expect(formatNumber(null)).toBe('');
        });
    });

    describe('debounce', () => {
        jest.useFakeTimers();

        test('should debounce the function call', () => {
            const func = jest.fn();
            const debouncedFunc = debounce(func, 100);

            debouncedFunc();
            debouncedFunc();
            debouncedFunc();

            expect(func).not.toHaveBeenCalled(); // Not called immediately

            jest.advanceTimersByTime(50);
            expect(func).not.toHaveBeenCalled();

            jest.advanceTimersByTime(50); // Total 100ms
            expect(func).toHaveBeenCalledTimes(1); // Called once after delay

            debouncedFunc();
            jest.advanceTimersByTime(50);
            debouncedFunc();
            jest.advanceTimersByTime(50);
            expect(func).toHaveBeenCalledTimes(1); // Still one call, as it was reset

            jest.advanceTimersByTime(100);
            expect(func).toHaveBeenCalledTimes(2); // Called again after new delay
        });

        test('should preserve context and arguments', () => {
            const func = jest.fn(function (a, b) { return this.value + a + b; });
            const debouncedFunc = debounce(func, 100);
            const context = { value: 10 };

            debouncedFunc.call(context, 1, 2);
            jest.advanceTimersByTime(100);

            expect(func).toHaveBeenCalledWith(1, 2);
            expect(func).toHaveReturnedWith(13);
        });
    });

    describe('throttle', () => {
        jest.useFakeTimers();

        test('should throttle the function call', () => {
            const func = jest.fn();
            const throttledFunc = throttle(func, 100);

            throttledFunc(); // First call, should execute immediately
            expect(func).toHaveBeenCalledTimes(1);

            throttledFunc(); // Second call, should be ignored
            throttledFunc(); // Third call, should be ignored
            expect(func).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(50);
            throttledFunc(); // Still within throttle limit, ignored
            expect(func).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(50); // Total 100ms, throttle ends
            throttledFunc(); // Now it should execute again
            expect(func).toHaveBeenCalledTimes(2);

            jest.advanceTimersByTime(100);
            throttledFunc();
            expect(func).toHaveBeenCalledTimes(3);
        });

        test('should preserve context and arguments', () => {
            const func = jest.fn(function (a, b) { return this.value + a + b; });
            const throttledFunc = throttle(func, 100);
            const context = { value: 10 };

            throttledFunc.call(context, 1, 2);
            expect(func).toHaveBeenCalledWith(1, 2);
            expect(func).toHaveReturnedWith(13);

            jest.advanceTimersByTime(100);
            throttledFunc.call(context, 3, 4);
            expect(func).toHaveBeenCalledWith(3, 4);
            expect(func).toHaveReturnedWith(17);
        });
    });

    describe('getQueryParams', () => {
        test('should parse query parameters from the URL', () => {
            window.location.search = '?param1=value1&param2=value2&param3';
            expect(getQueryParams()).toEqual({ param1: 'value1', param2: 'value2', param3: '' });
        });

        test('should return an empty object if no query parameters', () => {
            window.location.search = '';
            expect(getQueryParams()).toEqual({});
        });

        test('should handle encoded characters', () => {
            window.location.search = '?name=John%20Doe&city=New%20York';
            expect(getQueryParams()).toEqual({ name: 'John Doe', city: 'New York' });
        });
    });

    describe('setQueryParams', () => {
        test('should set query parameters in the URL', () => {
            setQueryParams({ a: '1', b: '2' });
            expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/test?a=1&b=2');
        });

        test('should handle empty parameters', () => {
            setQueryParams({});
            expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/test?');
        });

        test('should encode special characters', () => {
            setQueryParams({ name: 'John Doe', city: 'New York' });
            expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/test?name=John%20Doe&city=New%20York');
        });
    });

    describe('removeQueryParams', () => {
        test('should remove specified query parameters from the URL', () => {
            window.location.search = '?param1=value1&param2=value2&param3=value3';
            removeQueryParams(['param1', 'param3']);
            expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/test?param2=value2');
        });

        test('should do nothing if keys are not present', () => {
            window.location.search = '?param1=value1';
            removeQueryParams(['nonExistent']);
            expect(window.history.replaceState).toHaveBeenCalledWith({}, '', '/test?param1=value1');
        });
    });

    describe('addKeyboardShortcut', () => {
        let handler;
        let cleanup;

        beforeEach(() => {
            handler = jest.fn();
            cleanup = null;
        });

        afterEach(() => {
            if (cleanup) {
                cleanup(); // Clean up the event listener
            }
        });

        test('should add a keyboard shortcut listener', () => {
            cleanup = addKeyboardShortcut('a', handler);
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
            expect(handler).toHaveBeenCalledTimes(1);
        });

        test('should prevent default behavior by default', () => {
            cleanup = addKeyboardShortcut('b', handler);
            const event = new KeyboardEvent('keydown', { key: 'b', cancelable: true });
            document.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
        });

        test('should not prevent default behavior if preventDefault is false', () => {
            cleanup = addKeyboardShortcut('c', handler, { preventDefault: false });
            const event = new KeyboardEvent('keydown', { key: 'c', cancelable: true });
            document.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(false);
        });

        test('should respect ctrl, shift, and alt options', () => {
            cleanup = addKeyboardShortcut('d', handler, { ctrl: true, shift: true, alt: true });
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', ctrlKey: true, shiftKey: true, altKey: true }));
            expect(handler).toHaveBeenCalledTimes(1);

            handler.mockClear();
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', ctrlKey: true })); // Missing shift/alt
            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('removeKeyboardShortcut', () => {
        test('should log a warning about deprecation', () => {
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
            removeKeyboardShortcut('e', jest.fn());
            expect(consoleWarnSpy).toHaveBeenCalledWith("removeKeyboardShortcut is deprecated. Use the cleanup function returned by addKeyboardShortcut instead.");
            consoleWarnSpy.mockRestore();
        });
    });

    describe('copyToClipboard', () => {
        test('should copy text to clipboard using navigator.clipboard', async () => {
            const text = 'Hello Clipboard';
            const result = await copyToClipboard(text);
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
            expect(result).toBe(true);
        });

        test('should use fallback for browsers without navigator.clipboard', async () => {
            // Temporarily remove navigator.clipboard
            const originalClipboard = navigator.clipboard;
            Object.defineProperty(navigator, 'clipboard', { value: undefined });

            const text = 'Fallback Text';
            document.execCommand = jest.fn(); // Mock execCommand

            const result = await copyToClipboard(text);
            expect(document.execCommand).toHaveBeenCalledWith('copy');
            expect(result).toBe(true);

            // Restore navigator.clipboard
            Object.defineProperty(navigator, 'clipboard', { value: originalClipboard });
        });

        test('should handle clipboard write errors', async () => {
            navigator.clipboard.writeText.mockImplementationOnce(() => Promise.reject('Write error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await copyToClipboard('Error Text');
            expect(result).toBe(false);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy text to clipboard:', 'Write error');
            consoleErrorSpy.mockRestore();
        });
    });

    describe('isTouchDevice', () => {
        const originalNavigator = { ...navigator };

        afterEach(() => {
            Object.defineProperty(window, 'ontouchstart', { value: undefined, configurable: true });
            Object.defineProperty(navigator, 'maxTouchPoints', { value: originalNavigator.maxTouchPoints, configurable: true });
            Object.defineProperty(navigator, 'msMaxTouchPoints', { value: originalNavigator.msMaxTouchPoints, configurable: true });
        });

        test('should return true if ontouchstart is in window', () => {
            Object.defineProperty(window, 'ontouchstart', { value: () => {}, configurable: true });
            expect(isTouchDevice()).toBe(true);
        });

        test('should return true if navigator.maxTouchPoints > 0', () => {
            Object.defineProperty(navigator, 'maxTouchPoints', { value: 1, configurable: true });
            expect(isTouchDevice()).toBe(true);
        });

        test('should return true if navigator.msMaxTouchPoints > 0', () => {
            Object.defineProperty(navigator, 'msMaxTouchPoints', { value: 1, configurable: true });
            expect(isTouchDevice()).toBe(true);
        });

        test('should return false if no touch indicators are present', () => {
            Object.defineProperty(window, 'ontouchstart', { value: undefined, configurable: true });
            Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true });
            Object.defineProperty(navigator, 'msMaxTouchPoints', { value: 0, configurable: true });
            expect(isTouchDevice()).toBe(false);
        });
    });

    describe('getScrollPosition', () => {
        test('should return current scroll position', () => {
            Object.defineProperty(window, 'pageXOffset', { writable: true, value: 100 });
            Object.defineProperty(window, 'pageYOffset', { writable: true, value: 200 });
            expect(getScrollPosition()).toEqual({ x: 100, y: 200 });
        });
    });

    describe('setScrollPosition', () => {
        test('should set scroll position', () => {
            window.scrollTo = jest.fn();
            setScrollPosition(50, 150);
            expect(window.scrollTo).toHaveBeenCalledWith(50, 150);
        });
    });

    describe('getElementCoordinates', () => {
        let mockElement;
        beforeEach(() => {
            mockElement = document.createElement('div');
            mockElement.id = 'coords-test';
            document.body.appendChild(mockElement);
            mockElement.getBoundingClientRect = () => ({
                left: 10, top: 20, width: 0, height: 0, x: 10, y: 20, bottom: 20, right: 10
            });
            Object.defineProperty(window, 'pageXOffset', { writable: true, value: 5 });
            Object.defineProperty(window, 'pageYOffset', { writable: true, value: 15 });
        });

        afterEach(() => {
            document.body.removeChild(mockElement);
        });

        test('should return element coordinates relative to the document', () => {
            expect(getElementCoordinates('#coords-test')).toEqual({ x: 15, y: 35 });
        });

        test('should return null if element not found', () => {
            expect(getElementCoordinates('#non-existent')).toBeNull();
        });
    });

    describe('getCssPropertyValue', () => {
        test('should return the computed CSS property value', () => {
            const elementWithStyle = document.getElementById('element-with-style');
            expect(getCssPropertyValue('#element-with-style', 'color')).toBe('red');
            expect(getCssPropertyValue('#element-with-style', 'font-size')).toBe('16px');
        });

        test('should return null if element not found', () => {
            expect(getCssPropertyValue('#non-existent', 'color')).toBeNull();
        });
    });

    describe('setCssPropertyValue', () => {
        test('should set the CSS property value', () => {
            const elementWithStyle = document.getElementById('element-with-style');
            setCssPropertyValue('#element-with-style', 'background-color', 'blue');
            expect(elementWithStyle.style.backgroundColor).toBe('blue');
        });

        test('should do nothing if element not found', () => {
            setCssPropertyValue('#non-existent', 'background-color', 'blue');
            // No error, no change to existing elements
        });
    });

    describe('animateCss', () => {
        let elementToAnimate;
        beforeEach(() => {
            elementToAnimate = document.createElement('div');
            elementToAnimate.id = 'animate-css-test';
            document.body.appendChild(elementToAnimate);
        });

        afterEach(() => {
            document.body.removeChild(elementToAnimate);
        });

        test('should add and remove animation classes and call callback', () => {
            const callback = jest.fn();
            animateCss('#animate-css-test', 'fadeIn', callback);

            expect(elementToAnimate.classList.contains('animated')).toBe(true);
            expect(elementToAnimate.classList.contains('fadeIn')).toBe(true);

            // Simulate animation end event
            const event = new Event('animationend');
            elementToAnimate.dispatchEvent(event);

            expect(elementToAnimate.classList.contains('animated')).toBe(false);
            expect(elementToAnimate.classList.contains('fadeIn')).toBe(false);
            expect(callback).toHaveBeenCalledTimes(1);
        });

        test('should do nothing if element not found', () => {
            const callback = jest.fn();
            animateCss('#non-existent', 'fadeIn', callback);
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('isHidden', () => {
        let element;
        beforeEach(() => {
            element = document.createElement('div');
            element.id = 'visibility-test';
            document.body.appendChild(element);
        });

        afterEach(() => {
            document.body.removeChild(element);
        });

        test('should return true if element is hidden (offsetParent is null)', () => {
            element.style.display = 'none';
            expect(isHidden('#visibility-test')).toBe(true);
        });

        test('should return false if element is visible', () => {
            element.style.display = 'block';
            expect(isHidden('#visibility-test')).toBe(false);
        });

        test('should return true if element does not exist', () => {
            expect(isHidden('#non-existent')).toBe(true);
        });
    });

    describe('getFormValues', () => {
        test('should return an object with form input values', () => {
            const values = getFormValues('#test-form');
            expect(values).toEqual({ field1: 'formValue1', field2: 'on' }); // Checkbox value is 'on' by default
        });

        test('should return empty object if form not found', () => {
            expect(getFormValues('#non-existent-form')).toEqual({});
        });
    });

    describe('setFormValues', () => {
        test('should set form input values', () => {
            setFormValues('#test-form', { field1: 'newValue', field2: false });
            expect(document.querySelector('#test-form input[name="field1"]').value).toBe('newValue');
            expect(document.querySelector('#test-form input[name="field2"]').checked).toBe(false);
        });

        test('should do nothing if form not found', () => {
            setFormValues('#non-existent-form', { field1: 'newValue' });
            // No error, no change to existing form
        });
    });

    describe('resetForm', () => {
        test('should reset the form', () => {
            const form = document.getElementById('test-form');
            form.reset = jest.fn(); // Mock reset method
            resetForm('#test-form');
            expect(form.reset).toHaveBeenCalledTimes(1);
        });

        test('should do nothing if form not found', () => {
            resetForm('#non-existent-form');
            // No error
        });
    });

    describe('submitForm', () => {
        test('should submit the form', () => {
            const form = document.getElementById('test-form');
            form.submit = jest.fn(); // Mock submit method
            submitForm('#test-form');
            expect(form.submit).toHaveBeenCalledTimes(1);
        });

        test('should do nothing if form not found', () => {
            submitForm('#non-existent-form');
            // No error
        });
    });

    describe('validateForm', () => {
        test('should return true for a valid form', () => {
            expect(validateForm('#test-form')).toBe(true);
        });

        test('should return false for an invalid form', () => {
            const input = document.createElement('input');
            input.name = 'requiredField';
            input.required = true;
            document.getElementById('test-form').appendChild(input);
            expect(validateForm('#test-form')).toBe(false);
            document.getElementById('test-form').removeChild(input); // Clean up
        });

        test('should return true if form not found', () => {
            expect(validateForm('#non-existent-form')).toBe(true);
        });
    });

    describe('addClassToAll', () => {
        test('should add a class to all matching elements', () => {
            addClassToAll('.multiple-elements', 'new-class-all');
            document.querySelectorAll('.multiple-elements').forEach(el => {
                expect(el.classList.contains('new-class-all')).toBe(true);
            });
        });
    });

    describe('removeClassFromAll', () => {
        test('should remove a class from all matching elements', () => {
            addClassToAll('.multiple-elements', 'temp-class');
            removeClassFromAll('.multiple-elements', 'temp-class');
            document.querySelectorAll('.multiple-elements').forEach(el => {
                expect(el.classList.contains('temp-class')).toBe(false);
            });
        });
    });

    describe('toggleClassToAll', () => {
        test('should toggle a class on all matching elements', () => {
            toggleClassToAll('.multiple-elements', 'toggle-class');
            document.querySelectorAll('.multiple-elements').forEach(el => {
                expect(el.classList.contains('toggle-class')).toBe(true);
            });
            toggleClassToAll('.multiple-elements', 'toggle-class');
            document.querySelectorAll('.multiple-elements').forEach(el => {
                expect(el.classList.contains('toggle-class')).toBe(false);
            });
        });
    });

    describe('hasClassInAny', () => {
        test('should return true if any element has the class', () => {
            document.querySelectorAll('.multiple-elements')[1].classList.add('unique-class');
            expect(hasClassInAny('.multiple-elements', 'unique-class')).toBe(true);
        });

        test('should return false if no element has the class', () => {
            expect(hasClassInAny('.multiple-elements', 'non-existent-class')).toBe(false);
        });
    });

    describe('getElementIndex', () => {
        test('should return the index of the element among its siblings', () => {
            expect(getElementIndex('#child2')).toBe(1);
        });

        test('should return -1 if element not found or has no parent', () => {
            expect(getElementIndex('#non-existent')).toBe(-1);
            const orphanDiv = document.createElement('div');
            expect(getElementIndex(orphanDiv)).toBe(-1); // Not in DOM
        });
    });

    describe('insertAtIndex', () => {
        let parent;
        beforeEach(() => {
            parent = document.getElementById('parent');
            parent.innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div>';
        });

        test('should insert element at a specific index', () => {
            const newEl = document.createElement('div');
            newEl.id = 'new-el';
            insertAtIndex('#parent', newEl, 1);
            expect(parent.children[1].id).toBe('new-el');
            expect(parent.children.length).toBe(4);
        });

        test('should append if index is out of bounds (too high)', () => {
            const newEl = document.createElement('div');
            newEl.id = 'new-el-append';
            insertAtIndex('#parent', newEl, 100);
            expect(parent.lastElementChild.id).toBe('new-el-append');
        });

        test('should prepend if index is negative', () => {
            const newEl = document.createElement('div');
            newEl.id = 'new-el-prepend';
            insertAtIndex('#parent', newEl, -1);
            expect(parent.firstElementChild.id).toBe('new-el-prepend');
        });

        test('should do nothing if parent not found', () => {
            const newEl = document.createElement('div');
            insertAtIndex('#non-existent-parent', newEl, 0);
            expect(parent.children.length).toBe(3); // No change
        });
    });

    describe('replaceClass', () => {
        test('should replace an existing class with a new one', () => {
            element.classList.add('old-class');
            replaceClass('#test-element', 'old-class', 'new-replacement-class');
            expect(element.classList.contains('old-class')).toBe(false);
            expect(element.classList.contains('new-replacement-class')).toBe(true);
        });

        test('should add new class if old class not present', () => {
            replaceClass('#test-element', 'non-existent-old', 'new-replacement-class');
            expect(element.classList.contains('new-replacement-class')).toBe(true);
        });

        test('should do nothing if element not found', () => {
            replaceClass('#non-existent', 'old', 'new');
            // No error
        });
    });

    describe('replaceClassInAll', () => {
        test('should replace a class in all matching elements', () => {
            addClassToAll('.multiple-elements', 'old-class-all');
            replaceClassInAll('.multiple-elements', 'old-class-all', 'new-class-all-replaced');
            document.querySelectorAll('.multiple-elements').forEach(el => {
                expect(el.classList.contains('old-class-all')).toBe(false);
                expect(el.classList.contains('new-class-all-replaced')).toBe(true);
            });
        });
    });

    describe('getComputedStyleProperty', () => {
        test('should return the computed style property of an element', () => {
            expect(getComputedStyleProperty('#element-with-style', 'color')).toBe('red');
        });

        test('should return null if element not found', () => {
            expect(getComputedStyleProperty('#non-existent', 'color')).toBeNull();
        });
    });

    describe('setStyleProperties', () => {
        test('should set multiple style properties on an element', () => {
            const elementWithStyle = document.getElementById('element-with-style');
            setStyleProperties('#element-with-style', { 'background-color': 'green', 'border-radius': '5px' });
            expect(elementWithStyle.style.backgroundColor).toBe('green');
            expect(elementWithStyle.style.borderRadius).toBe('5px');
        });

        test('should do nothing if element not found', () => {
            setStyleProperties('#non-existent', { 'color': 'blue' });
            // No error
        });
    });

    describe('getAttributeInAll', () => {
        test('should return an array of attribute values from all matching elements', () => {
            document.querySelectorAll('.multiple-elements')[0].setAttribute('data-test', 'val1');
            document.querySelectorAll('.multiple-elements')[1].setAttribute('data-test', 'val2');
            document.querySelectorAll('.multiple-elements')[2].setAttribute('data-test', 'val3');
            expect(getAttributeInAll('.multiple-elements', 'data-test')).toEqual(['val1', 'val2', 'val3']);
        });

        test('should return empty array if no elements match', () => {
            expect(getAttributeInAll('.non-existent', 'data-test')).toEqual([]);
        });
    });

    describe('setAttributeInAll', () => {
        test('should set an attribute on all matching elements', () => {
            setAttributeInAll('.multiple-elements', 'data-new-attr', 'set-value');
            document.querySelectorAll('.multiple-elements').forEach(el => {
                expect(el.getAttribute('data-new-attr')).toBe('set-value');
            });
        });
    });

    describe('removeAttributeInAll', () => {
        test('should remove an attribute from all matching elements', () => {
            setAttributeInAll('.multiple-elements', 'data-to-remove', 'temp');
            removeAttributeInAll('.multiple-elements', 'data-to-remove');
            document.querySelectorAll('.multiple-elements').forEach(el => {
                expect(el.hasAttribute('data-to-remove')).toBe(false);
            });
        });
    });

    describe('hasAttributeInAny', () => {
        test('should return true if any element has the attribute', () => {
            document.querySelectorAll('.multiple-elements')[1].setAttribute('data-unique', 'true');
            expect(hasAttributeInAny('.multiple-elements', 'data-unique')).toBe(true);
        });

        test('should return false if no element has the attribute', () => {
            expect(hasAttributeInAny('.multiple-elements', 'data-non-existent')).toBe(false);
        });
    });

    describe('getElementText', () => {
        test('should return the text content of an element', () => {
            expect(getElementText('#test-element')).toBe('Test Content');
        });

        test('should return null if element not found', () => {
            expect(getElementText('#non-existent')).toBeNull();
        });
    });

    describe('getElementHtml', () => {
        test('should return the inner HTML of an element', () => {
            document.getElementById('test-element').innerHTML = '<span>HTML Content</span>';
            expect(getElementHtml('#test-element')).toBe('<span>HTML Content</span>');
        });

        test('should return null if element not found', () => {
            expect(getElementHtml('#non-existent')).toBeNull();
        });
    });

    describe('setElementHtml', () => {
        test('should set the inner HTML of an element', () => {
            setElementHtml('#test-element', '<b>Bold HTML</b>');
            expect(document.getElementById('test-element').innerHTML).toBe('<b>Bold HTML</b>');
        });

        test('should do nothing if element not found', () => {
            setElementHtml('#non-existent', '<b>Bold HTML</b>');
            // No error
        });
    });

    describe('addClassToParent', () => {
        test('should add a class to the parent of the element', () => {
            addClassToParent('#child2', 'parent-new-class');
            expect(document.getElementById('parent').classList.contains('parent-new-class')).toBe(true);
        });

        test('should do nothing if element or parent not found', () => {
            addClassToParent('#non-existent', 'class');
            // No error
        });
    });

    describe('removeClassFromParent', () => {
        test('should remove a class from the parent of the element', () => {
            document.getElementById('parent').classList.add('parent-to-remove');
            removeClassFromParent('#child2', 'parent-to-remove');
            expect(document.getElementById('parent').classList.contains('parent-to-remove')).toBe(false);
        });
    });

    describe('toggleClassToParent', () => {
        test('should toggle a class on the parent of the element', () => {
            toggleClassToParent('#child2', 'parent-toggle-class');
            expect(document.getElementById('parent').classList.contains('parent-toggle-class')).toBe(true);
            toggleClassToParent('#child2', 'parent-toggle-class');
            expect(document.getElementById('parent').classList.contains('parent-toggle-class')).toBe(false);
        });
    });

    describe('hasClassInParent', () => {
        test('should return true if parent has the class', () => {
            document.getElementById('parent').classList.add('parent-check-class');
            expect(hasClassInParent('#child2', 'parent-check-class')).toBe(true);
        });

        test('should return false if parent does not have the class', () => {
            expect(hasClassInParent('#child2', 'non-existent-parent-class')).toBe(false);
        });
    });

    describe('getParentWithClass', () => {
        test('should return the closest ancestor with the specified class', () => {
            const parentWithClass = getParentWithClass('#child-of-parent-with-class', 'some-parent-class');
            expect(parentWithClass).toBe(document.getElementById('parent-with-class'));
        });

        test('should return null if no ancestor has the class', () => {
            expect(getParentWithClass('#child2', 'non-existent-ancestor-class')).toBeNull();
        });
    });

    describe('getParentWithAttribute', () => {
        test('should return the closest ancestor with the specified attribute', () => {
            const parentWithAttr = getParentWithAttribute('#child-of-parent-with-attr', 'data-custom-attr');
            expect(parentWithAttr).toBe(document.getElementById('parent-with-attr'));
        });

        test('should return null if no ancestor has the attribute', () => {
            expect(getParentWithAttribute('#child2', 'data-non-existent-attr')).toBeNull();
        });
    });

    describe('getParents', () => {
        test('should return an array of all parent elements up to document', () => {
            const parents = getParents('#child2');
            expect(parents).toContain(document.getElementById('parent'));
            expect(parents).toContain(document.body);
            expect(parents.length).toBeGreaterThanOrEqual(2); // At least parent and body
        });

        test('should return empty array if element not found', () => {
            expect(getParents('#non-existent')).toEqual([]);
        });
    });

    describe('getClosest', () => {
        test('should return the closest ancestor matching the selector', () => {
            const closestParent = getClosest('#child2', '#parent');
            expect(closestParent).toBe(document.getElementById('parent'));
        });

        test('should return null if no ancestor matches', () => {
            expect(getClosest('#child2', '#non-existent-ancestor')).toBeNull();
        });
    });

    describe('getNextSiblings', () => {
        test('should return all next siblings', () => {
            const siblings = getNextSiblings('#child1');
            expect(siblings.length).toBe(2);
            expect(siblings[0].id).toBe('child2');
            expect(siblings[1].id).toBe('child3');
        });

        test('should return empty array if no next siblings', () => {
            expect(getNextSiblings('#child3')).toEqual([]);
        });
    });

    describe('getPreviousSiblings', () => {
        test('should return all previous siblings', () => {
            const siblings = getPreviousSiblings('#child3');
            expect(siblings.length).toBe(2);
            expect(siblings[0].id).toBe('child2');
            expect(siblings[1].id).toBe('child1');
        });

        test('should return empty array if no previous siblings', () => {
            expect(getPreviousSiblings('#child1')).toEqual([]);
        });
    });

    describe('getFirstChild', () => {
        test('should return the first child element', () => {
            expect(getFirstChild('#parent').id).toBe('child1');
        });

        test('should return null if no children or element not found', () => {
            const emptyDiv = document.createElement('div');
            document.body.appendChild(emptyDiv);
            expect(getFirstChild(`#${emptyDiv.id}`)).toBeNull();
            expect(getFirstChild('#non-existent')).toBeNull();
            document.body.removeChild(emptyDiv);
        });
    });

    describe('getLastChild', () => {
        test('should return the last child element', () => {
            expect(getLastChild('#parent').id).toBe('child3');
        });

        test('should return null if no children or element not found', () => {
            const emptyDiv = document.createElement('div');
            document.body.appendChild(emptyDiv);
            expect(getLastChild(`#${emptyDiv.id}`)).toBeNull();
            expect(getLastChild('#non-existent')).toBeNull();
            document.body.removeChild(emptyDiv);
        });
    });

    describe('hasChildren', () => {
        test('should return true if element has children', () => {
            expect(hasChildren('#parent')).toBe(true);
        });

        test('should return false if element has no children', () => {
            const emptyDiv = document.createElement('div');
            document.body.appendChild(emptyDiv);
            expect(hasChildren(`#${emptyDiv.id}`)).toBe(false);
            document.body.removeChild(emptyDiv);
        });

        test('should return false if element not found', () => {
            expect(hasChildren('#non-existent')).toBe(false);
        });
    });

    describe('getChildAtIndex', () => {
        test('should return the child element at the specified index', () => {
            expect(getChildAtIndex('#parent', 1).id).toBe('child2');
        });

        test('should return null if index is out of bounds or element not found', () => {
            expect(getChildAtIndex('#parent', 10)).toBeNull();
            expect(getChildAtIndex('#non-existent', 0)).toBeNull();
        });
    });

    describe('isChildOf', () => {
        test('should return true if child is a direct child of parent', () => {
            expect(isChildOf('#child1', '#parent')).toBe(true);
        });

        test('should return false if child is not a direct child', () => {
            expect(isChildOf('#descendant', '#parent')).toBe(false); // Grandchild
            expect(isChildOf('#parent', '#child1')).toBe(false); // Parent is not child
        });

        test('should return false if elements not found', () => {
            expect(isChildOf('#non-existent', '#parent')).toBe(false);
            expect(isChildOf('#child1', '#non-existent')).toBe(false);
        });
    });

    describe('isDescendantOf', () => {
        test('should return true if descendant is within ancestor', () => {
            expect(isDescendantOf('#descendant', '#ancestor')).toBe(true);
            expect(isDescendantOf('#child1', '#parent')).toBe(true); // Direct child is also descendant
        });

        test('should return false if not a descendant', () => {
            expect(isDescendantOf('#ancestor', '#descendant')).toBe(false); // Ancestor is not descendant
            expect(isDescendantOf('#child1', '#test-element')).toBe(false); // Unrelated elements
        });

        test('should return false if elements not found', () => {
            expect(isDescendantOf('#non-existent', '#ancestor')).toBe(false);
            expect(isDescendantOf('#descendant', '#non-existent')).toBe(false);
        });
    });

    describe('isBefore', () => {
        test('should return true if element1 comes before element2 in DOM order', () => {
            expect(isBefore('#element-before', '#element-after')).toBe(true);
        });

        test('should return false if element1 comes after element2', () => {
            expect(isBefore('#element-after', '#element-before')).toBe(false);
        });

        test('should return false if elements are the same or not found', () => {
            expect(isBefore('#element-before', '#element-before')).toBe(false);
            expect(isBefore('#non-existent', '#element-after')).toBe(false);
        });
    });

    describe('isAfter', () => {
        test('should return true if element1 comes after element2 in DOM order', () => {
            expect(isAfter('#element-after', '#element-before')).toBe(true);
        });

        test('should return false if element1 comes before element2', () => {
            expect(isAfter('#element-before', '#element-after')).toBe(false);
        });

        test('should return false if elements are the same or not found', () => {
            expect(isAfter('#element-before', '#element-before')).toBe(false);
            expect(isAfter('#non-existent', '#element-after')).toBe(false);
        });
    });

    // --- Data Attribute Functions ---

    describe('getElementByDataAttribute', () => {
        test('should return the element with the specified data attribute and value', () => {
            const el = getElementByDataAttribute('test-attr', 'value1');
            expect(el).toBe(document.getElementById('test-element'));
        });

        test('should return null if no element matches', () => {
            expect(getElementByDataAttribute('test-attr', 'non-existent-value')).toBeNull();
            expect(getElementByDataAttribute('non-existent-attr', 'value1')).toBeNull();
        });
    });

    describe('getAllElementsByDataAttribute', () => {
        test('should return all elements with the specified data attribute and value', () => {
            const div1 = document.createElement('div');
            div1.setAttribute('data-common', 'shared');
            const div2 = document.createElement('div');
            div2.setAttribute('data-common', 'shared');
            document.body.appendChild(div1);
            document.body.appendChild(div2);

            const elements = getAllElementsByDataAttribute('common', 'shared');
            expect(elements.length).toBe(2);
            expect(elements).toContain(div1);
            expect(elements).toContain(div2);

            document.body.removeChild(div1);
            document.body.removeChild(div2);
        });

        test('should return empty NodeList if no elements match', () => {
            const elements = getAllElementsByDataAttribute('non-existent', 'value');
            expect(elements.length).toBe(0);
        });
    });

    describe('addClassToElementByDataAttribute', () => {
        test('should add a class to the element found by data attribute', () => {
            addClassToElementByDataAttribute('test-attr', 'value1', 'data-class');
            expect(element.classList.contains('data-class')).toBe(true);
        });
    });

    describe('removeClassFromElementByDataAttribute', () => {
        test('should remove a class from the element found by data attribute', () => {
            element.classList.add('data-class-to-remove');
            removeClassFromElementByDataAttribute('test-attr', 'value1', 'data-class-to-remove');
            expect(element.classList.contains('data-class-to-remove')).toBe(false);
        });
    });

    describe('toggleClassToElementByDataAttribute', () => {
        test('should toggle a class on the element found by data attribute', () => {
            toggleClassToElementByDataAttribute('test-attr', 'value1', 'data-toggle-class');
            expect(element.classList.contains('data-toggle-class')).toBe(true);
            toggleClassToElementByDataAttribute('test-attr', 'value1', 'data-toggle-class');
            expect(element.classList.contains('data-toggle-class')).toBe(false);
        });
    });

    describe('hasClassInElementByDataAttribute', () => {
        test('should return true if element found by data attribute has the class', () => {
            element.classList.add('data-check-class');
            expect(hasClassInElementByDataAttribute('test-attr', 'value1', 'data-check-class')).toBe(true);
        });

        test('should return false if element does not have the class', () => {
            expect(hasClassInElementByDataAttribute('test-attr', 'value1', 'non-existent-data-class')).toBe(false);
        });
    });

    describe('setElementTextByDataAttribute', () => {
        test('should set text content of element found by data attribute', () => {
            setElementTextByDataAttribute('test-attr', 'value1', 'New Data Text');
            expect(element.textContent).toBe('New Data Text');
        });
    });

    describe('setElementHtmlByDataAttribute', () => {
        test('should set inner HTML of element found by data attribute', () => {
            setElementHtmlByDataAttribute('test-attr', 'value1', '<b>New Data HTML</b>');
            expect(element.innerHTML).toBe('<b>New Data HTML</b>');
        });
    });

    describe('getElementTextByDataAttribute', () => {
        test('should get text content of element found by data attribute', () => {
            element.textContent = 'Existing Data Text';
            expect(getElementTextByDataAttribute('test-attr', 'value1')).toBe('Existing Data Text');
        });
    });

    describe('getElementHtmlByDataAttribute', () => {
        test('should get inner HTML of element found by data attribute', () => {
            element.innerHTML = '<i>Existing Data HTML</i>';
            expect(getElementHtmlByDataAttribute('test-attr', 'value1')).toBe('<i>Existing Data HTML</i>');
        });
    });

    describe('addClickEventByDataAttribute', () => {
        test('should add click event to element found by data attribute', () => {
            const handler = jest.fn();
            addClickEventByDataAttribute('test-attr', 'value1', handler);
            element.click();
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });

    describe('removeClickEventByDataAttribute', () => {
        test('should remove click event from element found by data attribute', () => {
            const handler = jest.fn();
            element.addEventListener('click', handler);
            removeClickEventByDataAttribute('test-attr', 'value1', handler);
            element.click();
            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('getInputValueByDataAttribute', () => {
        let input;
        beforeEach(() => {
            input = document.createElement('input');
            input.setAttribute('data-input', 'my-input');
            input.value = 'data-input-value';
            document.body.appendChild(input);
        });
        afterEach(() => {
            document.body.removeChild(input);
        });
        test('should get input value by data attribute', () => {
            expect(getInputValueByDataAttribute('input', 'my-input')).toBe('data-input-value');
        });
    });

    describe('setInputValueByDataAttribute', () => {
        let input;
        beforeEach(() => {
            input = document.createElement('input');
            input.setAttribute('data-input', 'my-input');
            document.body.appendChild(input);
        });
        afterEach(() => {
            document.body.removeChild(input);
        });
        test('should set input value by data attribute', () => {
            setInputValueByDataAttribute('input', 'my-input', 'new-data-value');
            expect(input.value).toBe('new-data-value');
        });
    });

    describe('clearInputValueByDataAttribute', () => {
        let input;
        beforeEach(() => {
            input = document.createElement('input');
            input.setAttribute('data-input', 'my-input');
            input.value = 'some-value';
            document.body.appendChild(input);
        });
        afterEach(() => {
            document.body.removeChild(input);
        });
        test('should clear input value by data attribute', () => {
            clearInputValueByDataAttribute('input', 'my-input');
            expect(input.value).toBe('');
        });
    });

    describe('disableElementByDataAttribute', () => {
        test('should disable element by data attribute', () => {
            disableElementByDataAttribute('test-attr', 'value1');
            expect(element.disabled).toBe(true);
            expect(element.classList.contains('opacity-50')).toBe(true);
        });
    });

    describe('enableElementByDataAttribute', () => {
        test('should enable element by data attribute', () => {
            element.disabled = true;
            element.classList.add('opacity-50');
            enableElementByDataAttribute('test-attr', 'value1');
            expect(element.disabled).toBe(false);
            expect(element.classList.contains('opacity-50')).toBe(false);
        });
    });

    describe('showElementByDataAttribute', () => {
        test('should show element by data attribute', () => {
            element.classList.add('hidden');
            showElementByDataAttribute('test-attr', 'value1');
            expect(element.classList.contains('hidden')).toBe(false);
        });
    });

    describe('hideElementByDataAttribute', () => {
        test('should hide element by data attribute', () => {
            element.classList.remove('hidden');
            hideElementByDataAttribute('test-attr', 'value1');
            expect(element.classList.contains('hidden')).toBe(true);
        });
    });

    describe('toggleElementVisibilityByDataAttribute', () => {
        test('should toggle visibility of element by data attribute', () => {
            element.classList.add('hidden');
            toggleElementVisibilityByDataAttribute('test-attr', 'value1');
            expect(element.classList.contains('hidden')).toBe(false);
            toggleElementVisibilityByDataAttribute('test-attr', 'value1');
            expect(element.classList.contains('hidden')).toBe(true);
        });
    });

    describe('getDatasetByDataAttribute', () => {
        test('should get dataset value by data attribute', () => {
            element.dataset.extra = 'extra-value';
            expect(getDatasetByDataAttribute('test-attr', 'value1', 'extra')).toBe('extra-value');
        });
    });

    describe('setDatasetByDataAttribute', () => {
        test('should set dataset value by data attribute', () => {
            setDatasetByDataAttribute('test-attr', 'value1', 'newKey', 'newValue');
            expect(element.dataset.newKey).toBe('newValue');
        });
    });

    describe('removeDatasetByDataAttribute', () => {
        test('should remove dataset value by data attribute', () => {
            element.dataset.toRemove = 'temp';
            removeDatasetByDataAttribute('test-attr', 'value1', 'toRemove');
            expect(element.dataset.toRemove).toBeUndefined();
        });
    });

    describe('getElementAttributeByDataAttribute', () => {
        test('should get attribute by data attribute', () => {
            element.setAttribute('aria-label', 'test-label');
            expect(getElementAttributeByDataAttribute('test-attr', 'value1', 'aria-label')).toBe('test-label');
        });
    });

    describe('setElementAttributeByDataAttribute', () => {
        test('should set attribute by data attribute', () => {
            setElementAttributeByDataAttribute('test-attr', 'value1', 'aria-hidden', 'true');
            expect(element.getAttribute('aria-hidden')).toBe('true');
        });
    });

    describe('removeElementAttributeByDataAttribute', () => {
        test('should remove attribute by data attribute', () => {
            element.setAttribute('data-temp', 'temp');
            removeElementAttributeByDataAttribute('test-attr', 'value1', 'data-temp');
            expect(element.hasAttribute('data-temp')).toBe(false);
        });
    });

    describe('hasElementAttributeByDataAttribute', () => {
        test('should check if element has attribute by data attribute', () => {
            element.setAttribute('data-check', 'true');
            expect(hasElementAttributeByDataAttribute('test-attr', 'value1', 'data-check')).toBe(true);
            expect(hasElementAttributeByDataAttribute('test-attr', 'value1', 'non-existent')).toBe(false);
        });
    });

    describe('getStylePropertyByDataAttribute', () => {
        test('should get style property by data attribute', () => {
            element.style.color = 'purple';
            expect(getStylePropertyByDataAttribute('test-attr', 'value1', 'color')).toBe('purple');
        });
    });

    describe('setStylePropertyByDataAttribute', () => {
        test('should set style property by data attribute', () => {
            setStylePropertyByDataAttribute('test-attr', 'value1', 'background-color', 'yellow');
            expect(element.style.backgroundColor).toBe('yellow');
        });
    });

    describe('getComputedStylePropertyByDataAttribute', () => {
        test('should get computed style property by data attribute', () => {
            const elementWithStyle = document.getElementById('element-with-style');
            elementWithStyle.setAttribute('data-style', 'computed');
            expect(getComputedStylePropertyByDataAttribute('style', 'computed', 'color')).toBe('red');
        });
    });

    describe('setStylePropertiesByDataAttribute', () => {
        test('should set multiple style properties by data attribute', () => {
            setStylePropertiesByDataAttribute('test-attr', 'value1', { 'margin-left': '10px', 'padding-top': '5px' });
            expect(element.style.marginLeft).toBe('10px');
            expect(element.style.paddingTop).toBe('5px');
        });
    });

    describe('animateElementByDataAttribute', () => {
        let elementToAnimate;
        beforeEach(() => {
            elementToAnimate = document.createElement('div');
            elementToAnimate.setAttribute('data-animate', 'true');
            document.body.appendChild(elementToAnimate);
            elementToAnimate.animate = jest.fn(() => ({}));
        });
        afterEach(() => {
            document.body.removeChild(elementToAnimate);
        });
        test('should animate element by data attribute', () => {
            animateElementByDataAttribute('animate', 'true', [], {});
            expect(elementToAnimate.animate).toHaveBeenCalled();
        });
    });

    describe('animateCssByDataAttribute', () => {
        let elementToAnimate;
        beforeEach(() => {
            elementToAnimate = document.createElement('div');
            elementToAnimate.setAttribute('data-animate-css', 'true');
            document.body.appendChild(elementToAnimate);
        });
        afterEach(() => {
            document.body.removeChild(elementToAnimate);
        });
        test('should animate css by data attribute', () => {
            const callback = jest.fn();
            animateCssByDataAttribute('animate-css', 'true', 'fade', callback);
            expect(elementToAnimate.classList.contains('animated')).toBe(true);
            elementToAnimate.dispatchEvent(new Event('animationend'));
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('isHiddenByDataAttribute', () => {
        test('should check if element is hidden by data attribute', () => {
            element.style.display = 'none';
            expect(isHiddenByDataAttribute('test-attr', 'value1')).toBe(true);
            element.style.display = '';
            expect(isHiddenByDataAttribute('test-attr', 'value1')).toBe(false);
        });
    });

    describe('getBoundingClientRectByDataAttribute', () => {
        test('should get bounding client rect by data attribute', () => {
            element.getBoundingClientRect = () => ({ top: 1, left: 1, bottom: 2, right: 2, width: 1, height: 1 });
            const rect = getBoundingClientRectByDataAttribute('test-attr', 'value1');
            expect(rect.top).toBe(1);
        });
    });

    describe('isElementInViewportByDataAttribute', () => {
        test('should check if element is in viewport by data attribute', () => {
            element.getBoundingClientRect = () => ({ top: 10, left: 10, bottom: 20, right: 20, width: 10, height: 10 });
            expect(isElementInViewportByDataAttribute('test-attr', 'value1')).toBe(true);
        });
    });

    describe('scrollToElementByDataAttribute', () => {
        test('should scroll to element by data attribute', () => {
            element.scrollIntoView = jest.fn();
            scrollToElementByDataAttribute('test-attr', 'value1', {});
            expect(element.scrollIntoView).toHaveBeenCalled();
        });
    });

    describe('setFocusByDataAttribute', () => {
        test('should set focus by data attribute', () => {
            element.focus = jest.fn();
            setFocusByDataAttribute('test-attr', 'value1');
            expect(element.focus).toHaveBeenCalled();
        });
    });

    describe('getParentByDataAttribute', () => {
        test('should get parent by data attribute', () => {
            const child = document.createElement('div');
            child.setAttribute('data-child', 'true');
            element.appendChild(child);
            expect(getParentByDataAttribute('child', 'true')).toBe(element);
            element.removeChild(child);
        });
    });

    describe('getChildrenByDataAttribute', () => {
        test('should get children by data attribute', () => {
            const child1 = document.createElement('span');
            const child2 = document.createElement('p');
            element.appendChild(child1);
            element.appendChild(child2);
            element.setAttribute('data-parent-children', 'true');
            const children = getChildrenByDataAttribute('parent-children', 'true');
            expect(children).toEqual([child1, child2]);
            element.removeChild(child1);
            element.removeChild(child2);
        });
    });

    describe('getSiblingsByDataAttribute', () => {
        test('should get siblings by data attribute', () => {
            const sibling1 = document.createElement('div');
            sibling1.id = 'sibling1';
            const sibling2 = document.createElement('div');
            sibling2.id = 'sibling2';
            element.id = 'main-element';
            element.setAttribute('data-main', 'true');
            document.body.appendChild(sibling1);
            document.body.appendChild(element);
            document.body.appendChild(sibling2);

            const siblings = getSiblingsByDataAttribute('main', 'true');
            expect(siblings).toEqual([sibling1, sibling2]);

            document.body.removeChild(sibling1);
            document.body.removeChild(element);
            document.body.removeChild(sibling2);
        });
    });

    describe('getNextSiblingByDataAttribute', () => {
        test('should get next sibling by data attribute', () => {
            const nextSibling = document.createElement('div');
            nextSibling.id = 'next-sibling';
            element.id = 'current-element';
            element.setAttribute('data-current', 'true');
            document.body.appendChild(element);
            document.body.appendChild(nextSibling);
            expect(getNextSiblingByDataAttribute('current', 'true')).toBe(nextSibling);
            document.body.removeChild(element);
            document.body.removeChild(nextSibling);
        });
    });

    describe('getPreviousSiblingByDataAttribute', () => {
        test('should get previous sibling by data attribute', () => {
            const prevSibling = document.createElement('div');
            prevSibling.id = 'prev-sibling';
            element.id = 'current-element';
            element.setAttribute('data-current', 'true');
            document.body.appendChild(prevSibling);
            document.body.appendChild(element);
            expect(getPreviousSiblingByDataAttribute('current', 'true')).toBe(prevSibling);
            document.body.removeChild(prevSibling);
            document.body.removeChild(element);
        });
    });

    describe('prependChildByDataAttribute', () => {
        test('should prepend child by data attribute', () => {
            const parent = document.createElement('div');
            parent.setAttribute('data-parent-prepend', 'true');
            const existingChild = document.createElement('span');
            parent.appendChild(existingChild);
            document.body.appendChild(parent);

            const newChild = document.createElement('p');
            prependChildByDataAttribute('parent-prepend', 'true', newChild);
            expect(parent.firstChild).toBe(newChild);
            expect(parent.children.length).toBe(2);

            document.body.removeChild(parent);
        });
    });

    describe('appendChildByDataAttribute', () => {
        test('should append child by data attribute', () => {
            const parent = document.createElement('div');
            parent.setAttribute('data-parent-append', 'true');
            const existingChild = document.createElement('span');
            parent.appendChild(existingChild);
            document.body.appendChild(parent);

            const newChild = document.createElement('p');
            appendChildByDataAttribute('parent-append', 'true', newChild);
            expect(parent.lastChild).toBe(newChild);
            expect(parent.children.length).toBe(2);

            document.body.removeChild(parent);
        });
    });

    describe('insertBeforeByDataAttribute', () => {
        test('should insert before by data attribute', () => {
            const parent = document.createElement('div');
            const ref = document.createElement('span');
            ref.setAttribute('data-ref', 'true');
            parent.appendChild(ref);
            document.body.appendChild(parent);

            const newEl = document.createElement('p');
            insertBeforeByDataAttribute(newEl, 'ref', 'true');
            expect(parent.firstChild).toBe(newEl);
            expect(parent.children[1]).toBe(ref);

            document.body.removeChild(parent);
        });
    });

    describe('insertAfterByDataAttribute', () => {
        test('should insert after by data attribute', () => {
            const parent = document.createElement('div');
            const ref = document.createElement('span');
            ref.setAttribute('data-ref-after', 'true');
            parent.appendChild(ref);
            document.body.appendChild(parent);

            const newEl = document.createElement('p');
            insertAfterByDataAttribute(newEl, 'ref-after', 'true');
            expect(parent.children[1]).toBe(newEl);
            expect(parent.lastChild).toBe(newEl);

            document.body.removeChild(parent);
        });
    });

    describe('replaceElementByDataAttribute', () => {
        test('should replace element by data attribute', () => {
            const oldEl = document.createElement('div');
            oldEl.setAttribute('data-old', 'true');
            const parent = document.createElement('div');
            parent.appendChild(oldEl);
            document.body.appendChild(parent);

            const newEl = document.createElement('span');
            replaceElementByDataAttribute('old', 'true', newEl);
            expect(parent.firstChild).toBe(newEl);
            expect(parent.contains(oldEl)).toBe(false);

            document.body.removeChild(parent);
        });
    });

    describe('removeElementByDataAttribute', () => {
        test('should remove element by data attribute', () => {
            const elToRemove = document.createElement('div');
            elToRemove.setAttribute('data-remove', 'true');
            document.body.appendChild(elToRemove);
            expect(document.body.contains(elToRemove)).toBe(true);
            removeElementByDataAttribute('remove', 'true');
            expect(document.body.contains(elToRemove)).toBe(false);
        });
    });

    describe('removeAllChildrenByDataAttribute', () => {
        test('should remove all children by data attribute', () => {
            const parent = document.createElement('div');
            parent.setAttribute('data-parent-clear', 'true');
            parent.innerHTML = '<span></span><p></p>';
            document.body.appendChild(parent);
            expect(parent.children.length).toBe(2);
            removeAllChildrenByDataAttribute('parent-clear', 'true');
            expect(parent.children.length).toBe(0);
            document.body.removeChild(parent);
        });
    });

    describe('addEventListenerToAllByDataAttribute', () => {
        test('should add event listener to all elements by data attribute', () => {
            const el1 = document.createElement('button');
            el1.setAttribute('data-btn', 'click');
            const el2 = document.createElement('button');
            el2.setAttribute('data-btn', 'click');
            document.body.appendChild(el1);
            document.body.appendChild(el2);

            const handler = jest.fn();
            addEventListenerToAllByDataAttribute('btn', 'click', 'click', handler);
            el1.click();
            el2.click();
            expect(handler).toHaveBeenCalledTimes(2);

            document.body.removeChild(el1);
            document.body.removeChild(el2);
        });
    });

    describe('removeEventListenerFromAllByDataAttribute', () => {
        test('should remove event listener from all elements by data attribute', () => {
            const el1 = document.createElement('button');
            el1.setAttribute('data-btn-remove', 'click');
            const el2 = document.createElement('button');
            el2.setAttribute('data-btn-remove', 'click');
            document.body.appendChild(el1);
            document.body.appendChild(el2);

            const handler = jest.fn();
            el1.addEventListener('click', handler);
            el2.addEventListener('click', handler);

            removeEventListenerFromAllByDataAttribute('btn-remove', 'click', 'click', handler);
            el1.click();
            el2.click();
            expect(handler).not.toHaveBeenCalled();

            document.body.removeChild(el1);
            document.body.removeChild(el2);
        });
    });

    describe('triggerEventByDataAttribute', () => {
        test('should trigger event by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-trigger', 'true');
            document.body.appendChild(el);
            const handler = jest.fn();
            el.addEventListener('customEvent', handler);

            triggerEventByDataAttribute('trigger', 'true', 'customEvent', { data: 'test' });
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(expect.objectContaining({ detail: { data: 'test' } }));

            document.body.removeChild(el);
        });
    });

    describe('addCustomEventListenerByDataAttribute', () => {
        test('should add custom event listener by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-custom-event', 'true');
            document.body.appendChild(el);
            const handler = jest.fn();
            addCustomEventListenerByDataAttribute('custom-event', 'true', 'myCustomEvent', handler);
            el.dispatchEvent(new CustomEvent('myCustomEvent'));
            expect(handler).toHaveBeenCalledTimes(1);
            document.body.removeChild(el);
        });
    });

    describe('removeCustomEventListenerByDataAttribute', () => {
        test('should remove custom event listener by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-custom-event-remove', 'true');
            document.body.appendChild(el);
            const handler = jest.fn();
            el.addEventListener('myCustomEventRemove', handler);
            removeCustomEventListenerByDataAttribute('custom-event-remove', 'true', 'myCustomEventRemove', handler);
            el.dispatchEvent(new CustomEvent('myCustomEventRemove'));
            expect(handler).not.toHaveBeenCalled();
            document.body.removeChild(el);
        });
    });

    describe('getFormValuesByDataAttribute', () => {
        test('should get form values by data attribute', () => {
            const form = document.createElement('form');
            form.setAttribute('data-form', 'true');
            form.innerHTML = '<input name="f1" value="v1"><input name="f2" value="v2">';
            document.body.appendChild(form);
            expect(getFormValuesByDataAttribute('form', 'true')).toEqual({ f1: 'v1', f2: 'v2' });
            document.body.removeChild(form);
        });
    });

    describe('setFormValuesByDataAttribute', () => {
        test('should set form values by data attribute', () => {
            const form = document.createElement('form');
            form.setAttribute('data-form-set', 'true');
            form.innerHTML = '<input name="f1" value="old1"><input name="f2" type="checkbox">';
            document.body.appendChild(form);
            setFormValuesByDataAttribute('form-set', 'true', { f1: 'new1', f2: true });
            expect(form.querySelector('[name="f1"]').value).toBe('new1');
            expect(form.querySelector('[name="f2"]').checked).toBe(true);
            document.body.removeChild(form);
        });
    });

    describe('resetFormByDataAttribute', () => {
        test('should reset form by data attribute', () => {
            const form = document.createElement('form');
            form.setAttribute('data-form-reset', 'true');
            form.reset = jest.fn();
            document.body.appendChild(form);
            resetFormByDataAttribute('form-reset', 'true');
            expect(form.reset).toHaveBeenCalled();
            document.body.removeChild(form);
        });
    });

    describe('submitFormByDataAttribute', () => {
        test('should submit form by data attribute', () => {
            const form = document.createElement('form');
            form.setAttribute('data-form-submit', 'true');
            form.submit = jest.fn();
            document.body.appendChild(form);
            submitFormByDataAttribute('form-submit', 'true');
            expect(form.submit).toHaveBeenCalled();
            document.body.removeChild(form);
        });
    });

    describe('validateFormByDataAttribute', () => {
        test('should validate form by data attribute', () => {
            const form = document.createElement('form');
            form.setAttribute('data-form-validate', 'true');
            form.innerHTML = '<input name="f1" required>';
            document.body.appendChild(form);
            expect(validateFormByDataAttribute('form-validate', 'true')).toBe(false);
            form.querySelector('[name="f1"]').value = 'abc';
            expect(validateFormByDataAttribute('form-validate', 'true')).toBe(true);
            document.body.removeChild(form);
        });
    });

    describe('getElementIndexByDataAttribute', () => {
        test('should get element index by data attribute', () => {
            const parent = document.createElement('div');
            const child1 = document.createElement('span');
            const child2 = document.createElement('p');
            child2.setAttribute('data-target', 'true');
            parent.appendChild(child1);
            parent.appendChild(child2);
            document.body.appendChild(parent);
            expect(getElementIndexByDataAttribute('target', 'true')).toBe(1);
            document.body.removeChild(parent);
        });
    });

    describe('insertAtIndexByDataAttribute', () => {
        test('should insert at index by data attribute', () => {
            const parent = document.createElement('div');
            parent.setAttribute('data-parent-insert', 'true');
            parent.innerHTML = '<span>1</span><span>2</span>';
            document.body.appendChild(parent);
            const newEl = document.createElement('b');
            insertAtIndexByDataAttribute('parent-insert', 'true', newEl, 1);
            expect(parent.children[1]).toBe(newEl);
            document.body.removeChild(parent);
        });
    });

    describe('replaceClassByDataAttribute', () => {
        test('should replace class by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-replace-class', 'true');
            el.classList.add('old');
            document.body.appendChild(el);
            replaceClassByDataAttribute('replace-class', 'true', 'old', 'new');
            expect(el.classList.contains('old')).toBe(false);
            expect(el.classList.contains('new')).toBe(true);
            document.body.removeChild(el);
        });
    });

    describe('getParentsByDataAttribute', () => {
        test('should get parents by data attribute', () => {
            const ancestor = document.createElement('div');
            const parent = document.createElement('span');
            const child = document.createElement('p');
            child.setAttribute('data-child-parents', 'true');
            parent.appendChild(child);
            ancestor.appendChild(parent);
            document.body.appendChild(ancestor);
            const parents = getParentsByDataAttribute('child-parents', 'true');
            expect(parents).toContain(parent);
            expect(parents).toContain(ancestor);
            document.body.removeChild(ancestor);
        });
    });

    describe('getClosestByDataAttribute', () => {
        test('should get closest by data attribute', () => {
            const ancestor = document.createElement('div');
            ancestor.classList.add('closest-target');
            const parent = document.createElement('span');
            const child = document.createElement('p');
            child.setAttribute('data-child-closest', 'true');
            parent.appendChild(child);
            ancestor.appendChild(parent);
            document.body.appendChild(ancestor);
            expect(getClosestByDataAttribute('child-closest', 'true', '.closest-target')).toBe(ancestor);
            document.body.removeChild(ancestor);
        });
    });

    describe('getNextSiblingsByDataAttribute', () => {
        test('should get next siblings by data attribute', () => {
            const parent = document.createElement('div');
            const el1 = document.createElement('span');
            el1.setAttribute('data-el', '1');
            const el2 = document.createElement('span');
            const el3 = document.createElement('span');
            parent.appendChild(el1);
            parent.appendChild(el2);
            parent.appendChild(el3);
            document.body.appendChild(parent);
            const siblings = getNextSiblingsByDataAttribute('el', '1');
            expect(siblings).toEqual([el2, el3]);
            document.body.removeChild(parent);
        });
    });

    describe('getPreviousSiblingsByDataAttribute', () => {
        test('should get previous siblings by data attribute', () => {
            const parent = document.createElement('div');
            const el1 = document.createElement('span');
            const el2 = document.createElement('span');
            el2.setAttribute('data-el', '2');
            const el3 = document.createElement('span');
            parent.appendChild(el1);
            parent.appendChild(el2);
            parent.appendChild(el3);
            document.body.appendChild(parent);
            const siblings = getPreviousSiblingsByDataAttribute('el', '2');
            expect(siblings).toEqual([el1]);
            document.body.removeChild(parent);
        });
    });

    describe('getFirstChildByDataAttribute', () => {
        test('should get first child by data attribute', () => {
            const parent = document.createElement('div');
            parent.setAttribute('data-parent-first-child', 'true');
            const child1 = document.createElement('span');
            const child2 = document.createElement('p');
            parent.appendChild(child1);
            parent.appendChild(child2);
            document.body.appendChild(parent);
            expect(getFirstChildByDataAttribute('parent-first-child', 'true')).toBe(child1);
            document.body.removeChild(parent);
        });
    });

    describe('getLastChildByDataAttribute', () => {
        test('should get last child by data attribute', () => {
            const parent = document.createElement('div');
            parent.setAttribute('data-parent-last-child', 'true');
            const child1 = document.createElement('span');
            const child2 = document.createElement('p');
            parent.appendChild(child1);
            parent.appendChild(child2);
            document.body.appendChild(parent);
            expect(getLastChildByDataAttribute('parent-last-child', 'true')).toBe(child2);
            document.body.removeChild(parent);
        });
    });

    describe('hasChildrenByDataAttribute', () => {
        test('should check if has children by data attribute', () => {
            const parent = document.createElement('div');
            parent.setAttribute('data-parent-has-children', 'true');
            document.body.appendChild(parent);
            expect(hasChildrenByDataAttribute('parent-has-children', 'true')).toBe(false);
            parent.appendChild(document.createElement('span'));
            expect(hasChildrenByDataAttribute('parent-has-children', 'true')).toBe(true);
            document.body.removeChild(parent);
        });
    });

    describe('getChildAtIndexByDataAttribute', () => {
        test('should get child at index by data attribute', () => {
            const parent = document.createElement('div');
            parent.setAttribute('data-parent-child-at-index', 'true');
            const child1 = document.createElement('span');
            const child2 = document.createElement('p');
            parent.appendChild(child1);
            parent.appendChild(child2);
            document.body.appendChild(parent);
            expect(getChildAtIndexByDataAttribute('parent-child-at-index', 'true', 1)).toBe(child2);
            document.body.removeChild(parent);
        });
    });

    describe('isChildOfByDataAttribute', () => {
        test('should check if child of by data attribute', () => {
            const parent = document.createElement('div');
            parent.setAttribute('data-parent-is-child-of', 'true');
            const child = document.createElement('span');
            child.setAttribute('data-child-is-child-of', 'true');
            parent.appendChild(child);
            document.body.appendChild(parent);
            expect(isChildOfByDataAttribute('child-is-child-of', 'true', 'parent-is-child-of', 'true')).toBe(true);
            document.body.removeChild(parent);
        });
    });

    describe('isDescendantOfByDataAttribute', () => {
        test('should check if descendant of by data attribute', () => {
            const ancestor = document.createElement('div');
            ancestor.setAttribute('data-ancestor-is-descendant-of', 'true');
            const parent = document.createElement('span');
            const child = document.createElement('p');
            child.setAttribute('data-descendant-is-descendant-of', 'true');
            parent.appendChild(child);
            ancestor.appendChild(parent);
            document.body.appendChild(ancestor);
            expect(isDescendantOfByDataAttribute('descendant-is-descendant-of', 'true', 'ancestor-is-descendant-of', 'true')).toBe(true);
            document.body.removeChild(ancestor);
        });
    });

    describe('isBeforeByDataAttribute', () => {
        test('should check if before by data attribute', () => {
            const el1 = document.createElement('div');
            el1.setAttribute('data-el1-before', 'true');
            const el2 = document.createElement('div');
            el2.setAttribute('data-el2-before', 'true');
            document.body.appendChild(el1);
            document.body.appendChild(el2);
            expect(isBeforeByDataAttribute('el1-before', 'true', 'el2-before', 'true')).toBe(true);
            document.body.removeChild(el1);
            document.body.removeChild(el2);
        });
    });

    describe('isAfterByDataAttribute', () => {
        test('should check if after by data attribute', () => {
            const el1 = document.createElement('div');
            el1.setAttribute('data-el1-after', 'true');
            const el2 = document.createElement('div');
            el2.setAttribute('data-el2-after', 'true');
            document.body.appendChild(el1);
            document.body.appendChild(el2);
            expect(isAfterByDataAttribute('el2-after', 'true', 'el1-after', 'true')).toBe(true);
            document.body.removeChild(el1);
            document.body.removeChild(el2);
        });
    });

    describe('getParentWithClassByDataAttribute', () => {
        test('should get parent with class by data attribute', () => {
            const parent = document.createElement('div');
            parent.classList.add('target-class');
            const child = document.createElement('span');
            child.setAttribute('data-child-parent-class', 'true');
            parent.appendChild(child);
            document.body.appendChild(parent);
            expect(getParentWithClassByDataAttribute('child-parent-class', 'true', 'target-class')).toBe(parent);
            document.body.removeChild(parent);
        });
    });

    describe('getParentWithAttributeByDataAttribute', () => {
        test('should get parent with attribute by data attribute', () => {
            const parent = document.createElement('div');
            parent.setAttribute('data-target-attr', 'true');
            const child = document.createElement('span');
            child.setAttribute('data-child-parent-attr', 'true');
            parent.appendChild(child);
            document.body.appendChild(parent);
            expect(getParentWithAttributeByDataAttribute('child-parent-attr', 'true', 'data-target-attr')).toBe(parent);
            document.body.removeChild(parent);
        });
    });

    describe('addClassToParentByDataAttribute', () => {
        test('should add class to parent by data attribute', () => {
            const parent = document.createElement('div');
            const child = document.createElement('span');
            child.setAttribute('data-child-add-class-parent', 'true');
            parent.appendChild(child);
            document.body.appendChild(parent);
            addClassToParentByDataAttribute('child-add-class-parent', 'true', 'new-parent-class');
            expect(parent.classList.contains('new-parent-class')).toBe(true);
            document.body.removeChild(parent);
        });
    });

    describe('removeClassFromParentByDataAttribute', () => {
        test('should remove class from parent by data attribute', () => {
            const parent = document.createElement('div');
            parent.classList.add('old-parent-class');
            const child = document.createElement('span');
            child.setAttribute('data-child-remove-class-parent', 'true');
            parent.appendChild(child);
            document.body.appendChild(parent);
            removeClassFromParentByDataAttribute('child-remove-class-parent', 'true', 'old-parent-class');
            expect(parent.classList.contains('old-parent-class')).toBe(false);
            document.body.removeChild(parent);
        });
    });

    describe('toggleClassToParentByDataAttribute', () => {
        test('should toggle class to parent by data attribute', () => {
            const parent = document.createElement('div');
            const child = document.createElement('span');
            child.setAttribute('data-child-toggle-class-parent', 'true');
            parent.appendChild(child);
            document.body.appendChild(parent);
            toggleClassToParentByDataAttribute('child-toggle-class-parent', 'true', 'toggle-parent-class');
            expect(parent.classList.contains('toggle-parent-class')).toBe(true);
            toggleClassToParentByDataAttribute('child-toggle-class-parent', 'true', 'toggle-parent-class');
            expect(parent.classList.contains('toggle-parent-class')).toBe(false);
            document.body.removeChild(parent);
        });
    });

    describe('hasClassInParentByDataAttribute', () => {
        test('should check has class in parent by data attribute', () => {
            const parent = document.createElement('div');
            parent.classList.add('check-parent-class');
            const child = document.createElement('span');
            child.setAttribute('data-child-has-class-parent', 'true');
            parent.appendChild(child);
            document.body.appendChild(parent);
            expect(hasClassInParentByDataAttribute('child-has-class-parent', 'true', 'check-parent-class')).toBe(true);
            document.body.removeChild(parent);
        });
    });

    describe('getElementCoordinatesByDataAttribute', () => {
        test('should get element coordinates by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-coords', 'true');
            el.getBoundingClientRect = () => ({ left: 10, top: 20, width: 0, height: 0, x: 10, y: 20, bottom: 20, right: 10 });
            document.body.appendChild(el);
            Object.defineProperty(window, 'pageXOffset', { writable: true, value: 5 });
            Object.defineProperty(window, 'pageYOffset', { writable: true, value: 15 });
            expect(getElementCoordinatesByDataAttribute('coords', 'true')).toEqual({ x: 15, y: 35 });
            document.body.removeChild(el);
        });
    });

    describe('getCssPropertyValueByDataAttribute', () => {
        test('should get css property value by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-css-prop', 'true');
            el.style.color = 'red';
            document.body.appendChild(el);
            expect(getCssPropertyValueByDataAttribute('css-prop', 'true', 'color')).toBe('red');
            document.body.removeChild(el);
        });
    });

    describe('setCssPropertyValueByDataAttribute', () => {
        test('should set css property value by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-set-css-prop', 'true');
            document.body.appendChild(el);
            setCssPropertyValueByDataAttribute('set-css-prop', 'true', 'background-color', 'blue');
            expect(el.style.backgroundColor).toBe('blue');
            document.body.removeChild(el);
        });
    });

    // --- Generic Element Property Getters/Setters ---

    describe('getElementTextContent', () => {
        test('should get text content', () => {
            expect(getElementTextContent('#test-element')).toBe('Test Content');
        });
    });

    describe('setElementTextContent', () => {
        test('should set text content', () => {
            setElementTextContent('#test-element', 'New Text Content');
            expect(document.getElementById('test-element').textContent).toBe('New Text Content');
        });
    });

    describe('getElementHtmlContent', () => {
        test('should get html content', () => {
            document.getElementById('test-element').innerHTML = '<span>HTML</span>';
            expect(getElementHtmlContent('#test-element')).toBe('<span>HTML</span>');
        });
    });

    describe('setElementHtmlContent', () => {
        test('should set html content', () => {
            setElementHtmlContent('#test-element', '<b>New HTML</b>');
            expect(document.getElementById('test-element').innerHTML).toBe('<b>New HTML</b>');
        });
    });

    describe('getElementValue', () => {
        test('should get element value', () => {
            expect(getElementValue('#test-input')).toBe('initial');
        });
    });

    describe('setElementValue', () => {
        test('should set element value', () => {
            setElementValue('#test-input', 'updated');
            expect(document.getElementById('test-input').value).toBe('updated');
        });
    });

    describe('clearElementValue', () => {
        test('should clear element value', () => {
            clearElementValue('#test-input');
            expect(document.getElementById('test-input').value).toBe('');
        });
    });

    describe('getElementChecked', () => {
        test('should get element checked state', () => {
            expect(getElementChecked('input[name="test-radio"][value="radio1"]')).toBe(true);
        });
    });

    describe('setElementChecked', () => {
        test('should set element checked state', () => {
            setElementChecked('input[name="test-radio"][value="radio2"]', true);
            expect(document.querySelector('input[name="test-radio"][value="radio2"]').checked).toBe(true);
        });
    });

    describe('toggleElementChecked', () => {
        test('should toggle element checked state', () => {
            toggleElementChecked('input[name="test-radio"][value="radio1"]');
            expect(document.querySelector('input[name="test-radio"][value="radio1"]').checked).toBe(false);
        });
    });

    describe('getElementSelected', () => {
        test('should get element selected state', () => {
            expect(getElementSelected('#test-select option[value="opt2"]')).toBe(true);
        });
    });

    describe('setElementSelected', () => {
        test('should set element selected state', () => {
            setElementSelected('#test-select option[value="opt1"]', true);
            expect(document.querySelector('#test-select option[value="opt1"]').selected).toBe(true);
        });
    });

    describe('getElementDisabled', () => {
        test('should get element disabled state', () => {
            expect(getElementDisabled('#disabled-input')).toBe(true);
        });
    });

    describe('setElementDisabled', () => {
        test('should set element disabled state', () => {
            setElementDisabled('#disabled-input', false);
            expect(document.getElementById('disabled-input').disabled).toBe(false);
        });
    });

    describe('getElementReadOnly', () => {
        test('should get element readOnly state', () => {
            expect(getElementReadOnly('#readonly-input')).toBe(true);
        });
    });

    describe('setElementReadOnly', () => {
        test('should set element readOnly state', () => {
            setElementReadOnly('#readonly-input', false);
            expect(document.getElementById('readonly-input').readOnly).toBe(false);
        });
    });

    describe('getElementPlaceholder', () => {
        test('should get element placeholder', () => {
            expect(getElementPlaceholder('#placeholder-input')).toBe('Enter text');
        });
    });

    describe('setElementPlaceholder', () => {
        test('should set element placeholder', () => {
            setElementPlaceholder('#placeholder-input', 'New Placeholder');
            expect(document.getElementById('placeholder-input').placeholder).toBe('New Placeholder');
        });
    });

    describe('getElementSrc', () => {
        test('should get element src', () => {
            expect(getElementSrc('#test-image')).toContain('image.png');
        });
    });

    describe('setElementSrc', () => {
        test('should set element src', () => {
            setElementSrc('#test-image', 'new-image.png');
            expect(document.getElementById('test-image').src).toContain('new-image.png');
        });
    });

    describe('getElementHref', () => {
        test('should get element href', () => {
            expect(getElementHref('#test-link')).toContain('http://example.com');
        });
    });

    describe('setElementHref', () => {
        test('should set element href', () => {
            setElementHref('#test-link', 'http://new-example.com');
            expect(document.getElementById('test-link').href).toContain('http://new-example.com');
        });
    });

    describe('getElementTitle', () => {
        test('should get element title', () => {
            expect(getElementTitle('#test-link')).toBe('Test Link');
        });
    });

    describe('setElementTitle', () => {
        test('should set element title', () => {
            setElementTitle('#test-link', 'New Title');
            expect(document.getElementById('test-link').title).toBe('New Title');
        });
    });

    describe('getElementAlt', () => {
        test('should get element alt', () => {
            expect(getElementAlt('#test-image')).toBe('Test Alt');
        });
    });

    describe('setElementAlt', () => {
        test('should set element alt', () => {
            setElementAlt('#test-image', 'New Alt');
            expect(document.getElementById('test-image').alt).toBe('New Alt');
        });
    });

    describe('getElementWidth', () => {
        test('should get element width', () => {
            expect(getElementWidth('#test-image')).toBe(100);
        });
    });

    describe('setElementWidth', () => {
        test('should set element width', () => {
            setElementWidth('#test-image', 200);
            expect(document.getElementById('test-image').width).toBe(200);
        });
    });

    describe('getElementHeight', () => {
        test('should get element height', () => {
            expect(getElementHeight('#test-image')).toBe(50);
        });
    });

    describe('setElementHeight', () => {
        test('should set element height', () => {
            setElementHeight('#test-image', 100);
            expect(document.getElementById('test-image').height).toBe(100);
        });
    });

    describe('getElementTabIndex', () => {
        test('should get element tabIndex', () => {
            expect(getElementTabIndex('#element-with-tabindex')).toBe(5);
        });
    });

    describe('setElementTabIndex', () => {
        test('should set element tabIndex', () => {
            setElementTabIndex('#element-with-tabindex', 10);
            expect(document.getElementById('element-with-tabindex').tabIndex).toBe(10);
        });
    });

    describe('getElementId', () => {
        test('should get element id', () => {
            expect(getElementId('#element-with-id')).toBe('element-with-id');
        });
    });

    describe('setElementId', () => {
        test('should set element id', () => {
            setElementId('#element-with-id', 'new-id');
            expect(document.getElementById('element-with-id').id).toBe('new-id');
        });
    });

    describe('getElementClassName', () => {
        test('should get element className', () => {
            expect(getElementClassName('#element-with-id')).toBe('some-class');
        });
    });

    describe('setElementClassName', () => {
        test('should set element className', () => {
            setElementClassName('#element-with-id', 'new-class-name');
            expect(document.getElementById('element-with-id').className).toBe('new-class-name');
        });
    });

    describe('getElementTagName', () => {
        test('should get element tagName', () => {
            expect(getElementTagName('#element-with-tagname')).toBe('DIV');
        });
    });

    describe('getElementClientWidth', () => {
        test('should get element clientWidth', () => {
            const el = document.getElementById('element-with-client-dims');
            Object.defineProperty(el, 'clientWidth', { value: 124 }); // Mock clientWidth
            expect(getElementClientWidth('#element-with-client-dims')).toBe(124);
        });
    });

    describe('getElementClientHeight', () => {
        test('should get element clientHeight', () => {
            const el = document.getElementById('element-with-client-dims');
            Object.defineProperty(el, 'clientHeight', { value: 74 }); // Mock clientHeight
            expect(getElementClientHeight('#element-with-client-dims')).toBe(74);
        });
    });

    describe('getElementOffsetWidth', () => {
        test('should get element offsetWidth', () => {
            const el = document.getElementById('element-with-offset-dims');
            Object.defineProperty(el, 'offsetWidth', { value: 110 }); // Mock offsetWidth
            expect(getElementOffsetWidth('#element-with-offset-dims')).toBe(110);
        });
    });

    describe('getElementOffsetHeight', () => {
        test('should get element offsetHeight', () => {
            const el = document.getElementById('element-with-offset-dims');
            Object.defineProperty(el, 'offsetHeight', { value: 60 }); // Mock offsetHeight
            expect(getElementOffsetHeight('#element-with-offset-dims')).toBe(60);
        });
    });

    describe('getElementScrollWidth', () => {
        test('should get element scrollWidth', () => {
            const el = document.getElementById('element-with-scroll');
            Object.defineProperty(el, 'scrollWidth', { value: 100 }); // Mock scrollWidth
            expect(getElementScrollWidth('#element-with-scroll')).toBe(100);
        });
    });

    describe('getElementScrollHeight', () => {
        test('should get element scrollHeight', () => {
            const el = document.getElementById('element-with-scroll');
            Object.defineProperty(el, 'scrollHeight', { value: 100 }); // Mock scrollHeight
            expect(getElementScrollHeight('#element-with-scroll')).toBe(100);
        });
    });

    describe('getElementScrollLeft', () => {
        test('should get element scrollLeft', () => {
            const el = document.getElementById('element-with-scroll');
            Object.defineProperty(el, 'scrollLeft', { value: 10 }); // Mock scrollLeft
            expect(getElementScrollLeft('#element-with-scroll')).toBe(10);
        });
    });

    describe('setElementScrollLeft', () => {
        test('should set element scrollLeft', () => {
            const el = document.getElementById('element-with-scroll');
            setElementScrollLeft('#element-with-scroll', 20);
            expect(el.scrollLeft).toBe(20);
        });
    });

    describe('getElementScrollTop', () => {
        test('should get element scrollTop', () => {
            const el = document.getElementById('element-with-scroll');
            Object.defineProperty(el, 'scrollTop', { value: 15 }); // Mock scrollTop
            expect(getElementScrollTop('#element-with-scroll')).toBe(15);
        });
    });

    describe('setElementScrollTop', () => {
        test('should set element scrollTop', () => {
            const el = document.getElementById('element-with-scroll');
            setElementScrollTop('#element-with-scroll', 25);
            expect(el.scrollTop).toBe(25);
        });
    });

    describe('getElementOffsetLeft', () => {
        test('should get element offsetLeft', () => {
            const el = document.getElementById('element-with-offset-pos');
            Object.defineProperty(el, 'offsetLeft', { value: 10 }); // Mock offsetLeft
            expect(getElementOffsetLeft('#element-with-offset-pos')).toBe(10);
        });
    });

    describe('getElementOffsetTop', () => {
        test('should get element offsetTop', () => {
            const el = document.getElementById('element-with-offset-pos');
            Object.defineProperty(el, 'offsetTop', { value: 20 }); // Mock offsetTop
            expect(getElementOffsetTop('#element-with-offset-pos')).toBe(20);
        });
    });

    describe('getElementClientLeft', () => {
        test('should get element clientLeft', () => {
            const el = document.getElementById('element-with-client-border');
            Object.defineProperty(el, 'clientLeft', { value: 5 }); // Mock clientLeft
            expect(getElementClientLeft('#element-with-client-border')).toBe(5);
        });
    });

    describe('getElementClientTop', () => {
        test('should get element clientTop', () => {
            const el = document.getElementById('element-with-client-border');
            Object.defineProperty(el, 'clientTop', { value: 10 }); // Mock clientTop
            expect(getElementClientTop('#element-with-client-border')).toBe(10);
        });
    });

    describe('getElementOwnerDocument', () => {
        test('should get element ownerDocument', () => {
            expect(getElementOwnerDocument('#element-with-owner-document')).toBe(document);
        });
    });

    describe('getElementBaseURI', () => {
        test('should get element baseURI', () => {
            expect(getElementBaseURI('#element-with-base-uri')).toBe(document.baseURI);
        });
    });

    describe('getElementNodeName', () => {
        test('should get element nodeName', () => {
            expect(getElementNodeName('#element-with-node-name')).toBe('DIV');
        });
    });

    describe('getElementNodeType', () => {
        test('should get element nodeType', () => {
            expect(getElementNodeType('#element-with-node-type')).toBe(Node.ELEMENT_NODE);
        });
    });

    describe('getElementNodeValue', () => {
        test('should get element nodeValue', () => {
            // For an element, nodeValue is null
            expect(getElementNodeValue('#element-with-node-value')).toBeNull();
            // For a text node, it's the text content
            const textNode = document.createTextNode('Just a text node');
            document.body.appendChild(textNode);
            // Cannot select text nodes directly with querySelector, so test indirectly
            // This function is primarily for elements, where nodeValue is null.
            // To test a text node, one would need to get it directly, not via selector.
            document.body.removeChild(textNode);
        });
    });

    // --- Data Attribute Property Getters/Setters ---

    describe('getElementTextContentByDataAttribute', () => {
        test('should get text content by data attribute', () => {
            element.setAttribute('data-text-content', 'true');
            element.textContent = 'Data Text Content';
            expect(getElementTextContentByDataAttribute('text-content', 'true')).toBe('Data Text Content');
        });
    });

    describe('setElementTextContentByDataAttribute', () => {
        test('should set text content by data attribute', () => {
            element.setAttribute('data-set-text-content', 'true');
            setElementTextContentByDataAttribute('set-text-content', 'true', 'New Data Text Content');
            expect(element.textContent).toBe('New Data Text Content');
        });
    });

    describe('getElementHtmlContentByDataAttribute', () => {
        test('should get html content by data attribute', () => {
            element.setAttribute('data-html-content', 'true');
            element.innerHTML = '<b>Data HTML Content</b>';
            expect(getElementHtmlContentByDataAttribute('html-content', 'true')).toBe('<b>Data HTML Content</b>');
        });
    });

    describe('setElementHtmlContentByDataAttribute', () => {
        test('should set html content by data attribute', () => {
            element.setAttribute('data-set-html-content', 'true');
            setElementHtmlContentByDataAttribute('set-html-content', 'true', '<i>New Data HTML Content</i>');
            expect(element.innerHTML).toBe('<i>New Data HTML Content</i>');
        });
    });

    describe('getElementValueByDataAttribute', () => {
        test('should get value by data attribute', () => {
            const input = document.createElement('input');
            input.setAttribute('data-value', 'true');
            input.value = 'data-value-test';
            document.body.appendChild(input);
            expect(getElementValueByDataAttribute('value', 'true')).toBe('data-value-test');
            document.body.removeChild(input);
        });
    });

    describe('setElementValueByDataAttribute', () => {
        test('should set value by data attribute', () => {
            const input = document.createElement('input');
            input.setAttribute('data-set-value', 'true');
            document.body.appendChild(input);
            setElementValueByDataAttribute('set-value', 'true', 'new-data-value-test');
            expect(input.value).toBe('new-data-value-test');
            document.body.removeChild(input);
        });
    });

    describe('clearElementValueByDataAttribute', () => {
        test('should clear value by data attribute', () => {
            const input = document.createElement('input');
            input.setAttribute('data-clear-value', 'true');
            input.value = 'to-clear';
            document.body.appendChild(input);
            clearElementValueByDataAttribute('clear-value', 'true');
            expect(input.value).toBe('');
            document.body.removeChild(input);
        });
    });

    describe('getElementCheckedByDataAttribute', () => {
        test('should get checked state by data attribute', () => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.setAttribute('data-checked', 'true');
            checkbox.checked = true;
            document.body.appendChild(checkbox);
            expect(getElementCheckedByDataAttribute('checked', 'true')).toBe(true);
            document.body.removeChild(checkbox);
        });
    });

    describe('setElementCheckedByDataAttribute', () => {
        test('should set checked state by data attribute', () => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.setAttribute('data-set-checked', 'true');
            document.body.appendChild(checkbox);
            setElementCheckedByDataAttribute('set-checked', 'true', true);
            expect(checkbox.checked).toBe(true);
            document.body.removeChild(checkbox);
        });
    });

    describe('toggleElementCheckedByDataAttribute', () => {
        test('should toggle checked state by data attribute', () => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.setAttribute('data-toggle-checked', 'true');
            document.body.appendChild(checkbox);
            toggleElementCheckedByDataAttribute('toggle-checked', 'true');
            expect(checkbox.checked).toBe(true);
            toggleElementCheckedByDataAttribute('toggle-checked', 'true');
            expect(checkbox.checked).toBe(false);
            document.body.removeChild(checkbox);
        });
    });

    describe('getElementSelectedByDataAttribute', () => {
        test('should get selected state by data attribute', () => {
            const select = document.createElement('select');
            const option = document.createElement('option');
            option.setAttribute('data-selected', 'true');
            option.selected = true;
            select.appendChild(option);
            document.body.appendChild(select);
            expect(getElementSelectedByDataAttribute('selected', 'true')).toBe(true);
            document.body.removeChild(select);
        });
    });

    describe('setElementSelectedByDataAttribute', () => {
        test('should set selected state by data attribute', () => {
            const select = document.createElement('select');
            const option = document.createElement('option');
            option.setAttribute('data-set-selected', 'true');
            select.appendChild(option);
            document.body.appendChild(select);
            setElementSelectedByDataAttribute('set-selected', 'true', true);
            expect(option.selected).toBe(true);
            document.body.removeChild(select);
        });
    });

    describe('getElementDisabledByDataAttribute', () => {
        test('should get disabled state by data attribute', () => {
            const input = document.createElement('input');
            input.setAttribute('data-disabled-prop', 'true');
            input.disabled = true;
            document.body.appendChild(input);
            expect(getElementDisabledByDataAttribute('disabled-prop', 'true')).toBe(true);
            document.body.removeChild(input);
        });
    });

    describe('setElementDisabledByDataAttribute', () => {
        test('should set disabled state by data attribute', () => {
            const input = document.createElement('input');
            input.setAttribute('data-set-disabled-prop', 'true');
            document.body.appendChild(input);
            setElementDisabledByDataAttribute('set-disabled-prop', 'true', true);
            expect(input.disabled).toBe(true);
            document.body.removeChild(input);
        });
    });

    describe('getElementReadOnlyByDataAttribute', () => {
        test('should get readOnly state by data attribute', () => {
            const input = document.createElement('input');
            input.setAttribute('data-readonly-prop', 'true');
            input.readOnly = true;
            document.body.appendChild(input);
            expect(getElementReadOnlyByDataAttribute('readonly-prop', 'true')).toBe(true);
            document.body.removeChild(input);
        });
    });

    describe('setElementReadOnlyByDataAttribute', () => {
        test('should set readOnly state by data attribute', () => {
            const input = document.createElement('input');
            input.setAttribute('data-set-readonly-prop', 'true');
            document.body.appendChild(input);
            setElementReadOnlyByDataAttribute('set-readonly-prop', 'true', true);
            expect(input.readOnly).toBe(true);
            document.body.removeChild(input);
        });
    });

    describe('getElementPlaceholderByDataAttribute', () => {
        test('should get placeholder by data attribute', () => {
            const input = document.createElement('input');
            input.setAttribute('data-placeholder-prop', 'true');
            input.placeholder = 'test-placeholder';
            document.body.appendChild(input);
            expect(getElementPlaceholderByDataAttribute('placeholder-prop', 'true')).toBe('test-placeholder');
            document.body.removeChild(input);
        });
    });

    describe('setElementPlaceholderByDataAttribute', () => {
        test('should set placeholder by data attribute', () => {
            const input = document.createElement('input');
            input.setAttribute('data-set-placeholder-prop', 'true');
            document.body.appendChild(input);
            setElementPlaceholderByDataAttribute('set-placeholder-prop', 'true', 'new-placeholder');
            expect(input.placeholder).toBe('new-placeholder');
            document.body.removeChild(input);
        });
    });

    describe('getElementSrcByDataAttribute', () => {
        test('should get src by data attribute', () => {
            const img = document.createElement('img');
            img.setAttribute('data-src-prop', 'true');
            img.src = 'image.jpg';
            document.body.appendChild(img);
            expect(getElementSrcByDataAttribute('src-prop', 'true')).toContain('image.jpg');
            document.body.removeChild(img);
        });
    });

    describe('setElementSrcByDataAttribute', () => {
        test('should set src by data attribute', () => {
            const img = document.createElement('img');
            img.setAttribute('data-set-src-prop', 'true');
            document.body.appendChild(img);
            setElementSrcByDataAttribute('set-src-prop', 'true', 'new-image.png');
            expect(img.src).toContain('new-image.png');
            document.body.removeChild(img);
        });
    });

    describe('getElementHrefByDataAttribute', () => {
        test('should get href by data attribute', () => {
            const a = document.createElement('a');
            a.setAttribute('data-href-prop', 'true');
            a.href = 'link.html';
            document.body.appendChild(a);
            expect(getElementHrefByDataAttribute('href-prop', 'true')).toContain('link.html');
            document.body.removeChild(a);
        });
    });

    describe('setElementHrefByDataAttribute', () => {
        test('should set href by data attribute', () => {
            const a = document.createElement('a');
            a.setAttribute('data-set-href-prop', 'true');
            document.body.appendChild(a);
            setElementHrefByDataAttribute('set-href-prop', 'true', 'new-link.html');
            expect(a.href).toContain('new-link.html');
            document.body.removeChild(a);
        });
    });

    describe('getElementTitleByDataAttribute', () => {
        test('should get title by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-title-prop', 'true');
            el.title = 'test-title';
            document.body.appendChild(el);
            expect(getElementTitleByDataAttribute('title-prop', 'true')).toBe('test-title');
            document.body.removeChild(el);
        });
    });

    describe('setElementTitleByDataAttribute', () => {
        test('should set title by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-set-title-prop', 'true');
            document.body.appendChild(el);
            setElementTitleByDataAttribute('set-title-prop', 'true', 'new-title');
            expect(el.title).toBe('new-title');
            document.body.removeChild(el);
        });
    });

    describe('getElementAltByDataAttribute', () => {
        test('should get alt by data attribute', () => {
            const img = document.createElement('img');
            img.setAttribute('data-alt-prop', 'true');
            img.alt = 'test-alt';
            document.body.appendChild(img);
            expect(getElementAltByDataAttribute('alt-prop', 'true')).toBe('test-alt');
            document.body.removeChild(img);
        });
    });

    describe('setElementAltByDataAttribute', () => {
        test('should set alt by data attribute', () => {
            const img = document.createElement('img');
            img.setAttribute('data-set-alt-prop', 'true');
            document.body.appendChild(img);
            setElementAltByDataAttribute('set-alt-prop', 'true', 'new-alt');
            expect(img.alt).toBe('new-alt');
            document.body.removeChild(img);
        });
    });

    describe('getElementWidthByDataAttribute', () => {
        test('should get width by data attribute', () => {
            const img = document.createElement('img');
            img.setAttribute('data-width-prop', 'true');
            img.width = 100;
            document.body.appendChild(img);
            expect(getElementWidthByDataAttribute('width-prop', 'true')).toBe(100);
            document.body.removeChild(img);
        });
    });

    describe('setElementWidthByDataAttribute', () => {
        test('should set width by data attribute', () => {
            const img = document.createElement('img');
            img.setAttribute('data-set-width-prop', 'true');
            document.body.appendChild(img);
            setElementWidthByDataAttribute('set-width-prop', 'true', 200);
            expect(img.width).toBe(200);
            document.body.removeChild(img);
        });
    });

    describe('getElementHeightByDataAttribute', () => {
        test('should get height by data attribute', () => {
            const img = document.createElement('img');
            img.setAttribute('data-height-prop', 'true');
            img.height = 50;
            document.body.appendChild(img);
            expect(getElementHeightByDataAttribute('height-prop', 'true')).toBe(50);
            document.body.removeChild(img);
        });
    });

    describe('setElementHeightByDataAttribute', () => {
        test('should set height by data attribute', () => {
            const img = document.createElement('img');
            img.setAttribute('data-set-height-prop', 'true');
            document.body.appendChild(img);
            setElementHeightByDataAttribute('set-height-prop', 'true', 100);
            expect(img.height).toBe(100);
            document.body.removeChild(img);
        });
    });

    describe('getElementTabIndexByDataAttribute', () => {
        test('should get tabIndex by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-tabindex-prop', 'true');
            el.tabIndex = 5;
            document.body.appendChild(el);
            expect(getElementTabIndexByDataAttribute('tabindex-prop', 'true')).toBe(5);
            document.body.removeChild(el);
        });
    });

    describe('setElementTabIndexByDataAttribute', () => {
        test('should set tabIndex by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-set-tabindex-prop', 'true');
            document.body.appendChild(el);
            setElementTabIndexByDataAttribute('set-tabindex-prop', 'true', 10);
            expect(el.tabIndex).toBe(10);
            document.body.removeChild(el);
        });
    });

    describe('getElementIdByDataAttribute', () => {
        test('should get id by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-id-prop', 'true');
            el.id = 'test-id';
            document.body.appendChild(el);
            expect(getElementIdByDataAttribute('id-prop', 'true')).toBe('test-id');
            document.body.removeChild(el);
        });
    });

    describe('setElementIdByDataAttribute', () => {
        test('should set id by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-set-id-prop', 'true');
            document.body.appendChild(el);
            setElementIdByDataAttribute('set-id-prop', 'true', 'new-test-id');
            expect(el.id).toBe('new-test-id');
            document.body.removeChild(el);
        });
    });

    describe('getElementClassNameByDataAttribute', () => {
        test('should get className by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-classname-prop', 'true');
            el.className = 'test-class';
            document.body.appendChild(el);
            expect(getElementClassNameByDataAttribute('classname-prop', 'true')).toBe('test-class');
            document.body.removeChild(el);
        });
    });

    describe('setElementClassNameByDataAttribute', () => {
        test('should set className by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-set-classname-prop', 'true');
            document.body.appendChild(el);
            setElementClassNameByDataAttribute('set-classname-prop', 'true', 'new-test-class');
            expect(el.className).toBe('new-test-class');
            document.body.removeChild(el);
        });
    });

    describe('getElementTagNameByDataAttribute', () => {
        test('should get tagName by data attribute', () => {
            const el = document.createElement('span');
            el.setAttribute('data-tagname-prop', 'true');
            document.body.appendChild(el);
            expect(getElementTagNameByDataAttribute('tagname-prop', 'true')).toBe('SPAN');
            document.body.removeChild(el);
        });
    });

    describe('getElementClientWidthByDataAttribute', () => {
        test('should get clientWidth by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-client-width-prop', 'true');
            Object.defineProperty(el, 'clientWidth', { value: 100 });
            document.body.appendChild(el);
            expect(getElementClientWidthByDataAttribute('client-width-prop', 'true')).toBe(100);
            document.body.removeChild(el);
        });
    });

    describe('getElementClientHeightByDataAttribute', () => {
        test('should get clientHeight by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-client-height-prop', 'true');
            Object.defineProperty(el, 'clientHeight', { value: 50 });
            document.body.appendChild(el);
            expect(getElementClientHeightByDataAttribute('client-height-prop', 'true')).toBe(50);
            document.body.removeChild(el);
        });
    });

    describe('getElementOffsetWidthByDataAttribute', () => {
        test('should get offsetWidth by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-offset-width-prop', 'true');
            Object.defineProperty(el, 'offsetWidth', { value: 110 });
            document.body.appendChild(el);
            expect(getElementOffsetWidthByDataAttribute('offset-width-prop', 'true')).toBe(110);
            document.body.removeChild(el);
        });
    });

    describe('getElementOffsetHeightByDataAttribute', () => {
        test('should get offsetHeight by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-offset-height-prop', 'true');
            Object.defineProperty(el, 'offsetHeight', { value: 60 });
            document.body.appendChild(el);
            expect(getElementOffsetHeightByDataAttribute('offset-height-prop', 'true')).toBe(60);
            document.body.removeChild(el);
        });
    });

    describe('getElementScrollWidthByDataAttribute', () => {
        test('should get scrollWidth by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-scroll-width-prop', 'true');
            Object.defineProperty(el, 'scrollWidth', { value: 200 });
            document.body.appendChild(el);
            expect(getElementScrollWidthByDataAttribute('scroll-width-prop', 'true')).toBe(200);
            document.body.removeChild(el);
        });
    });

    describe('getElementScrollHeightByDataAttribute', () => {
        test('should get scrollHeight by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-scroll-height-prop', 'true');
            Object.defineProperty(el, 'scrollHeight', { value: 150 });
            document.body.appendChild(el);
            expect(getElementScrollHeightByDataAttribute('scroll-height-prop', 'true')).toBe(150);
            document.body.removeChild(el);
        });
    });

    describe('getElementScrollLeftByDataAttribute', () => {
        test('should get scrollLeft by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-scroll-left-prop', 'true');
            Object.defineProperty(el, 'scrollLeft', { value: 10 });
            document.body.appendChild(el);
            expect(getElementScrollLeftByDataAttribute('scroll-left-prop', 'true')).toBe(10);
            document.body.removeChild(el);
        });
    });

    describe('setElementScrollLeftByDataAttribute', () => {
        test('should set scrollLeft by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-set-scroll-left-prop', 'true');
            document.body.appendChild(el);
            setElementScrollLeftByDataAttribute('set-scroll-left-prop', 'true', 20);
            expect(el.scrollLeft).toBe(20);
            document.body.removeChild(el);
        });
    });

    describe('getElementScrollTopByDataAttribute', () => {
        test('should get scrollTop by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-scroll-top-prop', 'true');
            Object.defineProperty(el, 'scrollTop', { value: 15 });
            document.body.appendChild(el);
            expect(getElementScrollTopByDataAttribute('scroll-top-prop', 'true')).toBe(15);
            document.body.removeChild(el);
        });
    });

    describe('setElementScrollTopByDataAttribute', () => {
        test('should set scrollTop by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-set-scroll-top-prop', 'true');
            document.body.appendChild(el);
            setElementScrollTopByDataAttribute('set-scroll-top-prop', 'true', 25);
            expect(el.scrollTop).toBe(25);
            document.body.removeChild(el);
        });
    });

    describe('getElementOffsetLeftByDataAttribute', () => {
        test('should get offsetLeft by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-offset-left-prop', 'true');
            Object.defineProperty(el, 'offsetLeft', { value: 10 });
            document.body.appendChild(el);
            expect(getElementOffsetLeftByDataAttribute('offset-left-prop', 'true')).toBe(10);
            document.body.removeChild(el);
        });
    });

    describe('getElementOffsetTopByDataAttribute', () => {
        test('should get offsetTop by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-offset-top-prop', 'true');
            Object.defineProperty(el, 'offsetTop', { value: 20 });
            document.body.appendChild(el);
            expect(getElementOffsetTopByDataAttribute('offset-top-prop', 'true')).toBe(20);
            document.body.removeChild(el);
        });
    });

    describe('getElementClientLeftByDataAttribute', () => {
        test('should get clientLeft by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-client-left-prop', 'true');
            Object.defineProperty(el, 'clientLeft', { value: 5 });
            document.body.appendChild(el);
            expect(getElementClientLeftByDataAttribute('client-left-prop', 'true')).toBe(5);
            document.body.removeChild(el);
        });
    });

    describe('getElementClientTopByDataAttribute', () => {
        test('should get clientTop by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-client-top-prop', 'true');
            Object.defineProperty(el, 'clientTop', { value: 10 });
            document.body.appendChild(el);
            expect(getElementClientTopByDataAttribute('client-top-prop', 'true')).toBe(10);
            document.body.removeChild(el);
        });
    });

    describe('getElementOwnerDocumentByDataAttribute', () => {
        test('should get ownerDocument by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-owner-document-prop', 'true');
            document.body.appendChild(el);
            expect(getElementOwnerDocumentByDataAttribute('owner-document-prop', 'true')).toBe(document);
            document.body.removeChild(el);
        });
    });

    describe('getElementBaseURIByDataAttribute', () => {
        test('should get baseURI by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-base-uri-prop', 'true');
            document.body.appendChild(el);
            expect(getElementBaseURIByDataAttribute('base-uri-prop', 'true')).toBe(document.baseURI);
            document.body.removeChild(el);
        });
    });

    describe('getElementNodeNameByDataAttribute', () => {
        test('should get nodeName by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-node-name-prop', 'true');
            document.body.appendChild(el);
            expect(getElementNodeNameByDataAttribute('node-name-prop', 'true')).toBe('DIV');
            document.body.removeChild(el);
        });
    });

    describe('getElementNodeTypeByDataAttribute', () => {
        test('should get nodeType by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-node-type-prop', 'true');
            document.body.appendChild(el);
            expect(getElementNodeTypeByDataAttribute('node-type-prop', 'true')).toBe(Node.ELEMENT_NODE);
            document.body.removeChild(el);
        });
    });

    describe('getElementNodeValueByDataAttribute', () => {
        test('should get nodeValue by data attribute', () => {
            const el = document.createElement('div');
            el.setAttribute('data-node-value-prop', 'true');
            document.body.appendChild(el);
            expect(getElementNodeValueByDataAttribute('node-value-prop', 'true')).toBeNull();
            document.body.removeChild(el);
        });
    });
});