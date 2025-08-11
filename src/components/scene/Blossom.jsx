// src/components/scene/Blossom.jsx (Hyper-Optimized Version)
import { useState, useRef } from 'react';
import * as THREE from 'three';
import { useCursor, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Import the global state store.
import { useStore } from '../../store';

// Define target colors once.
const nonHoverColor = new THREE.Color('#ffffff');
const hoverColor = new THREE.Color('hotpink');

/**
 * Blossom - A hyper-optimized interactive 3D node.
 *
 * This version prioritizes performance above all else by:
 * 1. Using a very low-poly sphere geometry to reduce GPU load.
 * 2. Continuing to use a lightweight `useFrame` animation loop.
 */
export function Blossom({ projectId, position }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const { selectProject, setHovering } = useStore((state) => ({
    selectProject: state.selectProject,
    setHovering: state.setHovering,
  }));

  useCursor(isHovered);

  // --- Animation Loop ---
  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    // Interpolate scale and emissive properties smoothly.
    const targetScale = isHovered ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
    materialRef.current.emissiveIntensity += (isHovered ? 4.0 - materialRef.current.emissiveIntensity : 1.0 - materialRef.current.emissiveIntensity) * (delta * 10);
    materialRef.current.emissive.lerp(isHovered ? hoverColor : nonHoverColor, delta * 7);
  });

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
    // THE KEY CHANGE IS HERE: We drastically reduce the sphere's detail.
    // From [32, 32] (4096 faces) down to [12, 12] (288 faces).
    // This is a >90% reduction in geometry for each blossom.
    <Sphere
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      args={[0.4, 12, 12]} // [radius, widthSegments, heightSegments]
    >
      <meshStandardMaterial
        ref={materialRef}
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={1.0}
        toneMapped={false}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
}
