# English Learning App

## Description

This is a web-based application designed for learning English, built with modern web technologies. It offers a dynamic and interactive user experience for mastering vocabulary, grammar, and more.

## Technologies Used

*   **HTML5:** For structuring the web content.
*   **CSS3 (Tailwind CSS):** For modern and responsive styling.
*   **JavaScript:** For core application logic, interactivity, and dynamic content generation.
*   **localStorage:** For persisting user progress and settings locally in the browser.

## Key Features

*   **Login System:** User progress and global scores are saved using `localStorage`.
*   **Global Score:** Tracks the user's overall performance across all learning modules.
*   **Keyboard Navigation:** Full control of the application using keyboard shortcuts for efficient learning.
*   **Dynamic Content:** The application's learning content is generated dynamically from the `game-db.json` file, allowing for easy expansion.
*   **Multiple Game Modes:** Includes flashcards, quizzes, sentence completion, and sorting exercises to cater to different learning styles.
*   **Multi-language Support:** The interface supports both English and Spanish, with easy toggling.
*   **Dark Mode:** A toggleable dark mode for improved readability and user comfort.
*   **Random Mode:** Option to randomize the order of questions within modules for varied practice.
*   **Mobile-friendly Design:** Responsive layout with intuitive swipe gestures for navigation on touch devices.

## Setup and Running

To get this application up and running on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd english-learning-app
    ```
2.  **Install dependencies:**
    This project uses `http-server` to serve the application and `eslint` for code linting.
    ```bash
    npm install
    ```
3.  **Start the application:**
    ```bash
    npm start
    ```
    This will typically open the application in your default web browser.

## How to Add New Learning Modules

To add new content to the application, you need to modify the `game-db.json` file. This file contains an array called `learningModules`.

1.  **Open `game-db.json`:** Locate the `learningModules` array.
2.  **Add a New Module Object:** Add a new object to the array with the following structure:

    ```javascript
    {
        id: 'unique-id', // A unique identifier for the module
        name: 'Module Name', // The name to be displayed in the menu
        gameMode: 'flashcard' | 'quiz' | 'completion' | 'sorting', // The type of game
        data: [ /* ... content ... */ ] // An array of data for the module
    }
    ```

3.  **Provide Data for the Module:** The structure of the `data` array depends on the `gameMode`:

    *   For `flashcard` mode:

        ```javascript
        { en: "Word", es: "Palabra", ipa: "/pron/", example: "...", example_es: "..." }
        ```

    *   For `quiz` and `completion` modes:

        ```javascript
        { sentence: "...", options: ["...", "..."], correct: "...", explanation: "...", tip: "..." }
        ```

    *   For `sorting` mode:

        ```javascript
        { word: "...", category: "..." }
        ```
        And the module object should also include a `categories` array:
        ```javascript
        {
            id: 'unique-id',
            name: 'Module Name',
            gameMode: 'sorting',
            data: [ /* ... content ... */ ],
            categories: ["category1", "category2", "category3"]
        }
        ```
