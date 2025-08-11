import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the top-level App component, which acts as the orchestrator for the entire site.
import App from './App.jsx';

// Import the global stylesheet. This is the first CSS file to be loaded,
// containing our CSS variables (design tokens), font-face definitions,
// and base style resets. This ensures a consistent foundation for all other styles.
import './styles/global.css';

/**
 * main.jsx - The Application Entry Point
 *
 * This is the very first JavaScript file that executes in the application.
 * Its responsibilities are:
 * 1. Find the root DOM element (the <div id="root"> in `index.html`).
 * 2. Create a React root attached to that DOM element.
 * 3. Render the main <App /> component into the root.
 *
 * It also wraps the App in <React.StrictMode> to help identify potential problems
 * and enforce best practices during development.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
