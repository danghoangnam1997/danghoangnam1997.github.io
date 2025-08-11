import { lazy, Suspense } from 'react'; // <-- Import lazy and Suspense from React
import { AnimatePresence } from 'framer-motion';

// Import components and the store
import { HomePage } from './pages/HomePage';
import { Loader } from './components/ui/Loader';
import { useStore } from './store';

// --- LAZY LOADING ---
// Instead of a direct import, we use React.lazy().
// This creates a special component that will only fetch the code for ProjectDetailPage
// when it is first rendered. The 'webpackChunkName' comment is a hint for bundlers
// like Vite/Webpack to name the split file for easier debugging.
const ProjectDetailPage = lazy(() =>
  import(/* webpackChunkName: "ProjectDetailPage" */ './pages/ProjectDetailPage')
);

/**
 * App.jsx - The Performance-Optimized Application Shell
 *
 * This version introduces code-splitting via React.lazy and Suspense.
 * The heavy `ProjectDetailPage` component is no longer part of the initial
 * JavaScript bundle. Its code is now fetched from the server only when a user
 * actually clicks on a project blossom. This significantly reduces the initial
 * load time and improves the site's Core Web Vitals.
 */
export default function App() {
  const selectedProjectId = useStore((state) => state.selectedProjectId);
  const clearProject = useStore((state) => state.clearProject);

  return (
    <>
      <Loader />
      <HomePage />

      <AnimatePresence>
        {selectedProjectId && (
          // --- SUSPENSE WRAPPER ---
          // When a user clicks a blossom, `selectedProjectId` gets a value.
          // React tries to render `ProjectDetailPage`, but its code hasn't been loaded yet.
          // `Suspense` catches this and displays the `fallback` UI instead.
          // Once the code is downloaded, Suspense automatically swaps the fallback
          // with the fully rendered ProjectDetailPage component.
          <Suspense fallback={null}> {/* We can show a spinner, but null is fine for a quick load */}
            <ProjectDetailPage
              key={selectedProjectId}
              projectId={selectedProjectId}
              onClose={clearProject}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}
