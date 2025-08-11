import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import the global state store and the main 3D scene
import { useStore } from '../store';
import { Scene } from '../components/scene/Scene';

// Import the CSS for this page
import '../styles/HomePage.css';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

/**
 * HomePage - The main orchestrator of the portfolio experience.
 * This component handles:
 * 1. The overall layout of fixed 3D scene and scrollable HTML content.
 * 2. Using GSAP ScrollTrigger to monitor the user's scroll.
 * 3. Updating a global state (Zustand) with the current scroll progress.
 *    This progress value (0 to 1) is what drives the animation inside the 3D scene.
 * 4. Animating the HTML content sections into view as the user scrolls.
 */
export function HomePage() {
  // A ref for the main container, which will be the trigger for our scroll animations.
  const mainRef = useRef(null);

  // A ref for the hero section's content, to animate it separately.
  const heroContentRef = useRef(null);

  // Get the 'setScrollProgress' function from our Zustand store.
  const setScrollProgress = useStore((state) => state.setScrollProgress);

  // useLayoutEffect is used for DOM measurements and manipulations.
  // It runs synchronously after all DOM mutations, making it perfect for setting up animations
  // that depend on the final layout of elements, preventing any flicker.
  useLayoutEffect(() => {
    // GSAP Context provides a scope for our animations and makes cleanup easy.
    const ctx = gsap.context(() => {
      // --- MAIN 3D SCENE SCROLL-DRIVEN ANIMATION ---
      // This is the primary ScrollTrigger that tracks the overall page scroll.
      ScrollTrigger.create({
        trigger: mainRef.current, // The trigger element is the main container.
        start: 'top top',        // Starts when the top of the trigger hits the top of the viewport.
        end: 'bottom bottom',    // Ends when the bottom of the trigger hits the bottom of the viewport.
        scrub: 1.5,              // Smoothly interpolates the progress value over 1.5s. `true` is instant.
        // The onUpdate callback fires every time the scroll position changes.
        onUpdate: (self) => {
          // 'self.progress' is a value from 0 to 1 representing the scroll progress.
          // We update our global state with this value. The 3D scene listens to this
          // state and updates the thread animation accordingly.
          setScrollProgress(self.progress);
        },
      });

      // --- HTML CONTENT ANIMATIONS ---
      // Animate the hero section content (name and title) on load.
      gsap.from(heroContentRef.current, {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.5,
      });

      // Animate the "About" section as it scrolls into view.
      gsap.from('.about-section .content-wrapper', {
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 80%', // Starts animation when the top of the section is 80% down the viewport.
          end: 'bottom 90%',
          scrub: 1,
        },
        opacity: 0,
        y: 100,
        duration: 1,
      });

      // Animate the "Projects" section title as it scrolls into view.
      gsap.from('.projects-section .section-title', {
        scrollTrigger: {
          trigger: '.projects-section',
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
        opacity: 0,
        y: 50,
      });
    }, mainRef); // Scope the context to our main container.

    // Cleanup function: This is crucial for React.
    // It reverts all GSAP animations and ScrollTriggers created within the context
    // when the component unmounts, preventing memory leaks.
    return () => ctx.revert();
  }, [setScrollProgress]); // Dependency array.

  return (
    <main ref={mainRef}>
      {/* The 3D canvas is fixed to the background. It does not scroll. */}
      <div className="scene-container">
        <Scene />
      </div>

      {/* The HTML content container scrolls over the 3D scene. */}
      <div className="content-container">
        <section className="hero-section">
          <div ref={heroContentRef} className="hero-content">
            <h1>Jane Doe</h1>
            <p>Creative Developer & Digital Weaver</p>
          </div>
        </section>

        <section className="about-section">
          <div className="content-wrapper">
            <h2>About Me</h2>
            <p>
              I craft immersive digital experiences by weaving together code and creativity.
              My passion lies in building beautiful, interactive websites that tell a story
              and leave a lasting impression.
            </p>
          </div>
        </section>

        <section className="projects-section">
          <h2 className="section-title">Selected Work</h2>
          {/* Project components would be mapped here, but the main 3D blossoms are in the Scene */}
        </section>

        <section className="contact-section">
          <div className="content-wrapper">
            <h2>Let's Create Together</h2>
            <p>
              <a href="mailto:email@example.com">email@example.com</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
