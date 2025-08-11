// src/App.jsx (Final Version)
import { AnimatePresence } from 'framer-motion';

// Import our two main "views"
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';

// Import our global store to access the application's state
import { useStore } from './store';

/**
 * App.jsx - The Top-Level Application Shell and Router
 *
 * This component acts as the director of the entire application.
 * Its sole responsibility is to manage the current view state and render the
 * appropriate page component based on that state.
 *
 * It uses the global Zustand store to determine if a project has been selected.
 * - If `selectedProjectId` is null, it renders the main `HomePage`.
 * - If `selectedProjectId` has a value, it renders the `ProjectDetailPage`.
 *
 * It uses `framer-motion`'s `<AnimatePresence>` to orchestrate smooth
 * fade-in/fade-out transitions between these two states.
 */
export default function App() {
  // Subscribe to the state from our Zustand store.
  // This component will automatically re-render when these values change.
  const selectedProjectId = useStore((state) => state.selectedProjectId);
  const clearProject = useStore((state) => state.clearProject);

  return (
    <>
      {/* 
        The HomePage is always rendered in the background. 
        This is because our 3D scene is part of it, and we don't want to unmount/remount
        that expensive canvas every time we open or close a project. It remains persistent.
      */}
      <HomePage />

      {/*
        AnimatePresence is a powerful component from Framer Motion.
        It enables animations on components when they are added to or removed from the React tree.
        When `selectedProjectId` changes from a value to null, AnimatePresence will wait for
        the exit animation of `ProjectDetailPage` to complete before removing it from the DOM.
      */}
      <AnimatePresence>
        {selectedProjectId && (
          // If a project is selected, we render the detail page.
          // The `key` prop is crucial for AnimatePresence to track the component.
          <ProjectDetailPage
            key={selectedProjectId}
            projectId={selectedProjectId}
            onClose={clearProject} // Pass the 'clearProject' action as the close handler.
          />
        )}
      </AnimatePresence>
    </>
  );
}
