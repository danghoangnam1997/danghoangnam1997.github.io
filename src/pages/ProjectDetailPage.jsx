import { useEffect } from 'react';
import { getProjectById } from '../data/projects';
import '../styles/ProjectDetailPage.css';

/**
 * ProjectDetailPage - A component to display the detailed case study of a single project.
 *
 * This component is designed to appear as an overlay or a new "view" in the application.
 * It's responsible for:
 * 1. Fetching the correct project data using the provided `projectId`.
 * 2. Displaying all project details in a clean, readable layout.
 * 3. Providing a "close" button that calls the `onClose` function passed in props,
 *    which will trigger the transition back to the main 3D scene.
 */
export function ProjectDetailPage({ projectId, onClose }) {
  // Fetch the project data from our centralized data file.
  const project = getProjectById(projectId);

  // An effect to handle the 'Escape' key press for closing the detail view.
  // This is a common and important UX feature for modal-like views.
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
    // The main container for the detail page with a class for styling and animation.
    <div className="project-detail-overlay">
      <article className="project-detail-content">
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
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="cta-button">
                  Live Site
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="cta-button secondary">
                  View Code
                </a>
              )}
            </div>
          </aside>
        </section>
      </article>
    </div>
  );
}
