// src/hooks/useSmoothScroll.js
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * useSmoothScroll - A custom React hook to implement smooth scrolling.
 *
 * This hook initializes the Lenis smooth scrolling library and integrates it
 * seamlessly with GSAP's ScrollTrigger. This is crucial because ScrollTrigger
 * needs to be aware of the virtual scroll position provided by Lenis, not the
 * native browser scroll position.
 *
 * The hook handles:
 * 1. Creating a single instance of Lenis for the entire application.
 * 2. Setting up a `requestAnimationFrame` loop for Lenis to update the scroll.
 * 3. Ticking GSAP's ScrollTrigger on every Lenis scroll event.
 * 4. Cleaning up the instance and event listeners when the component unmounts.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // How long the scroll animation lasts
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      smoothTouch: true, // Enable smooth scrolling for touch devices
    });

    // 2. Integrate with GSAP ScrollTrigger
    // When Lenis scrolls, we update ScrollTrigger's internal state.
    lenis.on('scroll', ScrollTrigger.update);

    // This function tells GSAP to use the Lenis scroller as the source of truth for scroll positions.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Lenis uses milliseconds, GSAP uses seconds.
    });

    // This sets the default lag for all GSAP ticker events to 0, which is
    // recommended when using an external RAF (requestAnimationFrame) manager like Lenis.
    gsap.ticker.lagSmoothing(0);

    // 3. Setup the animation frame loop
    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);


    // 4. Cleanup function
    // This is essential to prevent memory leaks when the component unmounts.
    return () => {
      // Destroy the Lenis instance
      lenis.destroy();
      // Cancel the animation frame loop
      cancelAnimationFrame(animationFrameId);
      // It's also good practice to remove the GSAP ticker listener,
      // though GSAP's context-based cleanup often handles this.
      const tickerFunctions = gsap.ticker.lagSmoothing(); // Hacky way to get ticker funcs
      if (tickerFunctions && tickerFunctions.length) {
          gsap.ticker.remove(tickerFunctions[tickerFunctions.length - 1]);
      }
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // The hook itself doesn't need to return anything as it just sets up global listeners.
  return null;
}
