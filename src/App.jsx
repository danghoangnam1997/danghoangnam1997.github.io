import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';

// --- Component & Page Imports ---
// Import components that are always present or needed for the initial view.
import { HomePage } from './pages/HomePage';
import { Loader } from './components/ui/Loader';
import { CustomCursor } from './components/ui/CustomCursor';

// --- Hooks and State Management ---
import { useStore } from './store';
import { useSmoothScroll } from './hooks/useSmoothScroll';

// --- Lazy Loading for Performance ---
// We import ProjectDetailPage lazily. This means its code will be split into a
// separate JavaScript file and only downloaded from the server when a user
// first clicks on a project "blossom." This is a critical optimization
// that significantly improves the initial load time of the site.
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));

/**
 * App.jsx - The Top-Level Application Shell, Router, and Orchestrator
 *
 * This component sits at the root of the application and is responsible for:
 * 1. Initializing global hooks like `useSmoothScroll`.
 * 2. Rendering persistent UI elements like the `CustomCursor` and `Loader`.
 * 3. Managing the high-level view state (showing the main page vs. a project detail page).
 * 4. Using React.lazy and Suspense to code-split and load the project detail page on demand.
 * 5. Using Framer Motion's AnimatePresence to handle smooth transitions between views.
 */
export default function App() {
  // --- Initialize Global Hooks ---
  // This custom hook sets up Lenis for smooth scrolling and integrates it
  // with GSAP's ScrollTrigger for the entire application session.
  useSmoothScroll();

  // --- Subscribe to Global State ---
  // We get the currently selected project ID and the action to clear it
  // from our central Zustand store. This component will re-render whenever
  // `selectedProjectId` changes.
  const selectedProjectId = useStore((state) => state.selectedProjectId);
  const clearProject = useStore((state) => state.clearProject);

  return (
    // We use a React Fragment as a wrapper because we're returning multiple sibling elements.
    <>
      {/* --- Persistent UI Elements --- */}
      {/* These components are rendered once and persist throughout the app's lifecycle. */}
      <CustomCursor />
      <Loader />

      {/* --- Main Background View --- */}
      {/* HomePage is always rendered in the background. This is crucial because it contains
          the 3D canvas. Unmounting it would destroy the WebGL context and all our
          3D assets, causing a long reload every time a project detail page is closed. */}
      <HomePage />

      {/* --- Animated, Conditional Overlay --- */}
      {/* AnimatePresence enables exit animations. When `selectedProjectId` becomes null,
          it will wait for ProjectDetailPage's exit animation to complete before
          removing it from the DOM. */}
      <AnimatePresence>
        {selectedProjectId && (
          // Suspense is required for React.lazy. If the code for ProjectDetailPage
          // hasn't been downloaded yet, Suspense will catch it and can show a fallback UI.
          // We use `fallback={null}` for a seamless experience on fast connections.
          <Suspense fallback={null}>
            <ProjectDetailPage
              // The `key` prop is essential. It tells React and AnimatePresence
              // to treat each project view as a distinct instance, allowing for
              // re-animation if the user closes one project and opens another.
              key={selectedProjectId}
              projectId={selectedProjectId}
              // We pass the `clearProject` action from our store as the `onClose` handler.
              // This cleanly decouples the detail page from how the state is managed.
              onClose={clearProject}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}
