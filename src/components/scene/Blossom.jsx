import { useState } from 'react';
import { useCursor, Sphere } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

// Import the global state store to get actions for view-switching and cursor state.
import { useStore } from '../../store';

// We create an "animated" version of the Sphere component.
// This allows react-spring to animate its properties directly and performantly on the GPU.
const AnimatedSphere = a(Sphere);

/**
 * Blossom - An interactive 3D node representing a single project.
 *
 * This component is the primary point of interaction within the 3D scene.
 * It is responsible for:
 * 1. Rendering a sphere at a given position.
 * 2. Managing its own hover state for visual feedback.
 * 3. Using physics-based spring animations for smooth scaling and color changes on hover.
 * 4. Changing the system cursor to a pointer on hover to indicate interactivity.
 * 5. Firing global state actions on click (to open the project detail page) and on hover
 *    (to change the custom cursor's appearance).
 *
 * @param {object} props - The component's props.
 * @param {string} props.projectId - The unique ID of the project this blossom represents.
 * @param {THREE.Vector3} props.position - The 3D position where the blossom should be rendered.
 */
export function Blossom({ projectId, position }) {
  // Local state to track if the mouse is currently hovering over this specific blossom.
  const [isHovered, setIsHovered] = useState(false);

  // Get the state-setting actions from our global Zustand store.
  // We destructure them here for easy access.
  const { selectProject, setHovering } = useStore((state) => ({
    selectProject: state.selectProject,
    setHovering: state.setHovering,
  }));

  // useCursor is a drei hook that changes the document's cursor style.
  // When `isHovered` is true, it sets the cursor to 'pointer'.
  // This is a crucial and simple UX improvement.
  useCursor(isHovered);

  // --- SPRING ANIMATION ---
  // `useSpring` creates a physics-based animation. It will automatically
  // animate values to their new target whenever the `isHovered` state changes.
  const springProps = useSpring({
    // The scale of the sphere. It grows 1.5x larger on hover.
    scale: isHovered ? 1.5 : 1,
    // The intensity of the emissive glow. It brightens significantly on hover.
    emissiveIntensity: isHovered ? 6 : 2,
    // The color of the sphere. We can use a brand color for the hover state.
    color: isHovered ? 'hotpink' : '#ffffff',
    // Configuration for the spring physics to give it a nice, slightly bouncy feel.
    config: { mass: 1, tension: 280, friction: 40 },
  });

  // --- EVENT HANDLERS ---
  const handleClick = (e) => {
    // Stop the event from bubbling up to the canvas or other 3D objects.
    e.stopPropagation();
    // Call the global action to set the selected project ID, which will
    // trigger the App.jsx component to render the ProjectDetailPage.
    selectProject(projectId);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    // Set both the local hover state and the global hover state to true.
    setIsHovered(true);
    setHovering(true);
  };

  const handlePointerOut = () => {
    // Set both the local and global hover states back to false.
    setIsHovered(false);
    setHovering(false);
  };

  return (
    // We render the animated version of the Sphere component.
    // The animated properties (scale, etc.) are passed directly from our spring.
    <AnimatedSphere
      position={position}
      scale={springProps.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      args={[0.4, 32, 32]} // [radius, widthSegments, heightSegments]
    >
      {/* 
        The material determines how the object looks.
        Its properties are also driven by our spring animation for a cohesive effect.
        - `toneMapped={false}` is crucial for emissive materials to work correctly with Bloom.
      */}
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
