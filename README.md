# The Digital Weaver - An Immersive WebGL Portfolio

![Digital Weaver Screenshot](/public/screenshot.jpg) <!-- Add a nice screenshot here -->

This is the source code for my personal portfolio, an interactive and immersive experience built with modern web technologies. The core concept is a "digital weaver," where the user's scroll action weaves a glowing 3D thread through the page, connecting the story of my skills and projects.

**Live Site:** [https://your-username.github.io/your-repo-name/](https://your-username.github.io/your-repo-name/)

---

## Core Technologies & Concepts

This project was built to showcase a high level of proficiency in modern front-end and creative development. Key technologies include:

-   **React & Vite:** A modern, fast, and robust foundation for the application.
-   **Three.js & React Three Fiber:** For rendering the entire 3D scene, including the main thread and interactive project "blossoms."
-   **GSAP (GreenSock Animation Platform):** Used for all high-performance, scroll-driven animations. `ScrollTrigger` is used to orchestrate the entire narrative.
-   **@studio-freight/lenis:** For a buttery-smooth, interpolated scrolling experience that is properly synced with ScrollTrigger.
-   **Framer Motion:** For handling enter/exit animations on UI elements, particularly the project detail overlay.
-   **Zustand:** For simple, clean global state management.
-   **Code Splitting:** `React.lazy` is used to load the heavy `ProjectDetailPage` component only when it's needed, significantly improving initial load performance.

---

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    This project uses `npm`.
    ```bash
    npm install
    ```

3.  **Run the development server:**
    This will start a local server, typically on `http://localhost:5173`.
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    This will create an optimized, static build in the `/dist` folder, which is ready for deployment.
    ```bash
    npm run build
    ```

---

## Project Structure

The codebase is organized with a strong emphasis on separation of concerns:

-   `src/components/scene`: Contains all 3D/WebGL-related components.
-   `src/components/ui`: Contains standard 2D UI components.
-   `src/pages`: Contains top-level page components that represent different "views."
-   `src/hooks`: Contains reusable custom React hooks, like `useSmoothScroll`.
-   `src/data`: Contains centralized project data for easy updates.
-   `src/store.js`: The global state management setup.

---
