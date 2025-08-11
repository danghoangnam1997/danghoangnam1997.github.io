import { useProgress } from '@react-three/drei';
import { useEffect } from 'react';
import './Loader.css'; // We'll create this CSS file next.

/**
 * Loader - A custom loading screen component.
 *
 * This component uses the `useProgress` hook from @react-three/drei to get
 * detailed information about the asset loading progress.
 *
 * It displays a simple progress bar and a percentage counter.
 * Crucially, it uses the `active` state from the hook to know when loading
 * has started and finished, allowing for smooth fade-in and fade-out animations.
 */
export function Loader() {
  // `useProgress` provides `active`, `progress`, `errors`, `item`, `loaded`, `total`.
  // - `active`: A boolean that is true when something is loading.
  // - `progress`: A number from 0 to 100 representing the percentage.
  const { active, progress } = useProgress();

  useEffect(() => {
    // When loading is active, we prevent the user from scrolling the main page.
    // This is important because the page layout might not be final yet.
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      // Once loading is complete, we restore scrolling.
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to ensure scrolling is restored if the component unmounts unexpectedly.
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [active]);

  // We only want to render the loader when it's active.
  // The `data-active` attribute will be used by our CSS to handle the fade-in/out.
  return (
    <div className="loader-container" data-active={active}>
      <div className="loader-content">
        <div className="loader-progress-bar-container">
          {/* The style is updated dynamically based on the loading progress. */}
          <div className="loader-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="loader-progress-text">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}
