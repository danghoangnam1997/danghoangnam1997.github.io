import { useEffect } from 'react';
import { motion } from 'framer-motion';

// Import helper function and reusable components
import { getProjectById } from '../data/projects';
import { Button } from '../components/ui/Button';

// Import the specific CSS for this component
import '../styles/ProjectDetailPage.css';

/**
 * ProjectDetailPage - A component to display the detailed case study of a single project.
 *
 * This component is designed to appear as an overlay or a new "view" in the application.
 * It's wrapped in a `motion.div` to be animated by Framer Motion's AnimatePresence.
 *
 * @param {object} props - The component's props.
 * @param {string} props.projectId - The ID of the project to display.
 * @param {Function} props.onClose - The function to call to close this view.
 */
export function ProjectDetailPage({ projectId, onClose }) {
  // Fetch the project data from our centralized data file.
  const project = getProjectById(projectId);

  // An effect to handle the 'Escape' key press for closing the detail view.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]); // Dependency array ensures the effect is set up correctly.

  // A robust fallback: If for some reason no project is found, render nothing.
  if (!project) {
    return null;
  }

  return (
    // This `motion.div` is the main container that will be animated.
    // The `initial`, `animate`, and `exit` props define the animation states.
    <motion.div
      className="project-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      // Clicking the backdrop also closes the modal.
      onClick={onClose}
    >
      <motion.article
        className="project-detail-content"
        // Prevent clicks inside the content from closing the modal.
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {/* --- CLOSE BUTTON --- */}
        <button className="close-button" onClick={onClose} aria-label="Close project details">
          &times;
        </button>

        {/* --- HEADER --- */}
        <header className="project-header">
          <h1 className="project-title">{project.title}</h1>
          <p className="project-tagline">{project.tagline}</p>
        </header>

        {/* --- HERO IMAGE --- */}
        <div className="project-hero-image">
          <img src={project.image_hero} alt={`${project.title} hero shot`} />
        </div>

        {/* --- MAIN CONTENT --- */}
        <section className="project-body">
          <div className="project-description">
            <h2>About this Project</h2>
            <p>{project.description}</p>
          </div>

          <aside className="project-sidebar">
            <div className="tech-stack">
              <h3>Technologies Used</h3>
              <ul>
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
            <div className="project-links">
              {/* --- Refactored to use the reusable Button component --- */}
              {project.liveUrl && (
                <Button href={project.liveUrl}>
                  Live Site
                </Button>
              )}
              {project.repoUrl && (
                <Button href={project.repoUrl} variant="secondary">
                  View Code
                </Button>
              )}
            </div>
          </aside>
        </section>
      </motion.article>
    </motion.div>
  );
}
