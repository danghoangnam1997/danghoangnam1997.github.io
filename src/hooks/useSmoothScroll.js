// src/hooks/useSmoothScroll.js
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * useSmoothScroll - A custom React hook to implement smooth scrolling.
 *
 * This hook initializes the Lenis smooth scrolling library and integrates it
 * seamlessly with GSAP's ScrollTrigger. This is the professional way to ensure
 * scroll-based animations work perfectly with a virtual scroller.
 *
 * The hook handles:
 * 1. Creating a single, persistent instance of Lenis.
 * 2. Adding a function to GSAP's main animation loop ('ticker') to keep Lenis updated.
 *    This is the crucial step for synchronization.
 * 3. Ensuring ScrollTrigger uses Lenis for its scroll position calculations.
 * 4. Cleaning up everything properly when the application unmounts.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Initialize the Lenis smooth scroller.
    const lenis = new Lenis();

    // Sync GSAP's ScrollTrigger with the scroll events from Lenis.
    // This tells ScrollTrigger to update its positions whenever Lenis reports a scroll.
    lenis.on('scroll', ScrollTrigger.update);

    // Define a function that will be called by GSAP's ticker on every animation frame.
    // This function is responsible for telling Lenis to update its state.
    const ticker = (time) => {
      // Lenis requires time in seconds, but GSAP provides it in seconds by default.
      // We pass it directly to lenis.raf (request animation frame).
      lenis.raf(time);
    }

    // Add our ticker function to GSAP's main animation loop.
    // This ensures that Lenis and GSAP are perfectly synchronized.
    gsap.ticker.add(ticker);
    
    // Recommended for optimal performance with external tickers like Lenis.
    gsap.ticker.lagSmoothing(0);

    // Cleanup function that runs when the component unmounts.
    return () => {
      // Remove our ticker function from GSAP's loop to prevent memory leaks.
      gsap.ticker.remove(ticker);
      // Destroy the Lenis instance to stop all smooth scrolling.
      lenis.destroy();
    };
  }, []); // The empty dependency array ensures this effect runs only ONCE.

  // This hook does not render any JSX, it just sets up global effects.
  return null;
}
