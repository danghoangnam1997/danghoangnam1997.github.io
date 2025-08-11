// src/components/scene/Blossom.jsx (Rewritten for Elegance)
import { useState, useRef } from 'react';
import * as THREE from 'three';
import { useCursor, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { lerp } from 'maath/misc';

// Import the global state store for view-switching and cursor state.
import { useStore } from '../../store';

// Define our target colors outside the component for performance.
const nonHoverColor = new THREE.Color('#ffffff'); // The emissive color when not hovered
const hoverColor = new THREE.Color('hotpink'); // The emissive color on hover

/**
 * Blossom - An interactive 3D node representing a single project.
 *
 * This rewritten version focuses on a lighter, more elegant animation by using
 * the `useFrame` hook for manual interpolation (lerping) instead of a physics library.
 * The visual effect is more subtle and refined.
 */
export function Blossom({ projectId, position }) {
  // Refs to directly manipulate the mesh and material properties in the animation loop.
  const meshRef = useRef();
  const materialRef = useRef();

  // Local state to track hover status.
  const [isHovered, setIsHovered] = useState(false);

  // Get actions from our global Zustand store.
  const { selectProject, setHovering } = useStore((state) => ({
    selectProject: state.selectProject,
    setHovering: state.setHovering,
  }));

  // Hook to change the system cursor to a pointer on hover.
  useCursor(isHovered);

  // --- LIGHTWEIGHT ANIMATION LOOP ---
  // `useFrame` runs on every single rendered frame. This is our animation engine.
  useFrame((state, delta) => {
    // Safety check for the refs.
    if (!meshRef.current || !materialRef.current) return;

    // Determine the target values based on the hover state.
    const targetScale = isHovered ? 1.2 : 1; // A gentler scale-up
    const targetEmissiveIntensity = isHovered ? 4.0 : 1.0; // A strong but not overwhelming glow
    const targetColor = isHovered ? hoverColor : nonHoverColor;

    // Use `lerp` to smoothly interpolate the current values towards the target values.
    // `delta` is the time since the last frame, ensuring the animation is smooth
    // regardless of the user's frame rate. The multiplier (e.g., `delta * 10`) controls the speed.
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
    materialRef.current.emissiveIntensity = lerp(materialRef.current.emissiveIntensity, targetEmissiveIntensity, delta * 10);
    materialRef.current.emissive.lerp(targetColor, delta * 7);
  });

  // --- EVENT HANDLERS ---
  const handleClick = (e) => {
    e.stopPropagation();
    selectProject(projectId);
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    setHovering(true);
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    setHovering(false);
  };

  return (
    <Sphere
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      args={[0.4, 32, 32]}
    >
      <meshStandardMaterial
        ref={materialRef}
        color="#ffffff" // The sphere's base color is always white.
        emissive="#ffffff" // The initial glow color is white.
        emissiveIntensity={1.0}
        toneMapped={false}
        transparent
        opacity={0.85}
      />
    </Sphere>
  );
}
