// src/components/ui/CustomCursor.jsx
import { useEffect, useRef } from 'react';
import { useStore } from '../../store';
import './CustomCursor.css';

/**
 * CustomCursor - A smooth, animated cursor that follows the user's mouse.
 *
 * This component operates with a high-performance animation loop outside of React's render cycle.
 * It listens to global mouse movements and updates the position of two DOM elements (a dot and a circle)
 * using CSS transforms.
 *
 * It subscribes to a global state (`isHovering`) to change its appearance when the user
 * hovers over interactive elements like the 3D blossoms.
 */
export function CustomCursor() {
  const dotRef = useRef(null);
  const circleRef = useRef(null);

  // Subscribe to the global hover state.
  const isHovering = useStore((state) => state.isHovering);

  useEffect(() => {
    // Hide the default system cursor.
    document.body.style.cursor = 'none';

    // Target positions for the cursor elements.
    let mouseX = 0;
    let mouseY = 0;

    // Current animated positions.
    let dotX = 0;
    let dotY = 0;
    let circleX = 0;
    let circleY = 0;

    // The 'lerp' function for smooth motion.
    const lerp = (start, end, amount) => (1 - amount) * start + amount * end;

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    // The animation loop.
    const animate = () => {
      // Don't run if the refs aren't set up yet.
      if (!dotRef.current || !circleRef.current) return;

      // Lerp the positions for a smooth trailing effect.
      dotX = lerp(dotX, mouseX, 0.9);
      dotY = lerp(dotY, mouseY, 0.9);
      circleX = lerp(circleX, mouseX, 0.1);
      circleY = lerp(circleY, mouseY, 0.1);

      // Apply the new positions using CSS transforms for performance.
      dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      circleRef.current.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;

      // Continue the loop on the next frame.
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    // Cleanup function.
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto'; // Restore the default cursor.
    };
  }, []); // Run this effect only once on mount.

  // The component renders two simple divs that will be controlled by the effect.
  // We use a `data-hovering` attribute to apply CSS styles based on the global state.
  return (
    <>
      <div ref={dotRef} className="cursor-dot"></div>
      <div
        ref={circleRef}
        className="cursor-circle"
        data-hovering={isHovering}
      ></div>
    </>
  );
}
