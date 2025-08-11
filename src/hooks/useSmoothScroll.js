// src/hooks/useSmoothScroll.js
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useSmoothScroll() {
  useEffect(() => {
    // 1. Initialize Lenis with more responsive settings
    const lenis = new Lenis({
      duration: 0.8, // Reduced duration for a snappier feel
      easing: (t) => t, // A linear easing for direct response
      smoothTouch: false, // Often feels better on mobile to use native scroll
      syncTouch: true,
    });

    // 2. Integrate with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time) => {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // 3. Cleanup function
    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return null;
}
