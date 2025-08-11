import { useState } from 'react';
import { useCursor, Sphere, Html } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

// We create an 'animated' version of the Sphere component from drei.
// This allows react-spring to animate its properties directly and performantly.
const AnimatedSphere = a(Sphere);

/**
 * Blossom Component - An interactive node representing a single project.
 *
 * This component is responsible for:
 * 1. Rendering a sphere at a given position.
 * 2. Managing its own hover state.
 * 3. Changing the mouse cursor to a pointer on hover to indicate interactivity.
 * 4. Using spring animations for smooth scaling and color changes on hover.
 * 5. Handling click events to eventually navigate to a project detail page.
 */
export function Blossom({ projectId, position }) {
  // State to track if the mouse is currently hovering over this blossom.
  const [isHovered, setIsHovered] = useState(false);

  // useCursor is a drei hook that changes the document's cursor style on hover.
  // It's a small detail that greatly improves user experience.
  useCursor(isHovered);

  // --- SPRING ANIMATION ---
  // useSpring is a hook from react-spring that creates a physics-based animation.
  // We define the "to" state based on the `isHovered` boolean. When `isHovered` changes,
  // the spring will automatically animate the values to their new target.
  const springProps = useSpring({
    // The scale of the sphere. It grows 1.5x larger on hover.
    scale: isHovered ? 1.5 : 1,
    // The intensity of the emissive glow. It brightens on hover.
    emissiveIntensity: isHovered ? 6 : 2,
    // The color of the sphere.
    color: isHovered ? '#ff69b4' : '#ffffff', // A hotpink on hover
    // Configuration for the spring physics.
    config: { mass: 1, tension: 280, friction: 60 },
  });

  // Function to handle the click event.
  const handleClick = () => {
    // In a full application, this would use a router or state manager
    // to trigger the "fly-in" animation and navigate to the project page.
    console.log(`Clicked on project: ${projectId}`);
    // e.g., setAppState({ currentProject: projectId, view: 'detail' });
  };

  return (
    // We use the animated version of the Sphere component.
    // The animated properties (scale, emissiveIntensity) are passed directly from our spring.
    <AnimatedSphere
      position={position}
      scale={springProps.scale}
      onPointerOver={(e) => {
        e.stopPropagation(); // Prevents events from bubbling up to other 3D objects
        setIsHovered(true);
      }}
      onPointerOut={() => setIsHovered(false)}
      onClick={handleClick}
      args={[0.4, 32, 32]} // [radius, widthSegments, heightSegments]
    >
      <meshStandardMaterial
        color={springProps.color}
        emissive={springProps.color}
        emissiveIntensity={springProps.emissiveIntensity}
        toneMapped={false}
        transparent
        opacity={0.85}
      />
    </AnimatedSphere>
  );
}
