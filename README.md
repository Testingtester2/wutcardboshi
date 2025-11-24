# Wutcardboshi - Deck Builder

A responsive deck building tool for Wutcardboshi traits with drag-and-drop functionality, filtering, and community sharing.

## ⚠️ Important Setup for Images

**You must manually add your images for them to appear in the app.**

1.  Open your project directory (where `package.json` is).
2.  Create a new folder named **`public`**.
3.  Paste all your card images (`.webp` files) into this `public` folder.

The app is configured to look for images at the root (e.g., `/system-shock.webp`).

## Features

-   **Complete Collection**: Browse all 502 cards with accurate metadata.
-   **Advanced Filtering**: Filter by Head, Mouth, Eyes, Clothes, Accessories, Discipline, and Fur traits.
-   **Deck Builder**: Drag and drop cards to build your deck (max 30 cards, max 2 copies per card).
-   **Dogjo (Community)**: Save your decks, view decks created by others, like, and comment.
-   **Export**: Export your deck list as text.
-   **Responsive Design**: Works on desktop and mobile.

## Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

## Technologies

-   React 18
-   TypeScript
-   Tailwind CSS
-   Vite
-   Lucide React
