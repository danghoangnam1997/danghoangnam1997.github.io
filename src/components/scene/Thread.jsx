import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Import the global state store to get the scroll progress.
import { useStore } from '../../store';

/**
 * --- Defining the Path ---
 * This is the 3D curve our thread will follow.
 * It's defined *outside* the component so it's only calculated once, not on every render.
 * This is a critical performance optimization.
 * We are creating a smooth Catmull-Rom curve from a series of 3D points (Vector3).
 *
 * The coordinate system in Three.js is typically:
 * - X-axis: left (-) to right (+)
 * - Y-axis: down (-) to up (+)
 * - Z-axis: towards you (+) to away from you (-)
 *
 * Our path will start at the top (y=5) and meander downwards (y=-45).
 */
const pathPoints = [
  new THREE.Vector3(0, 5, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(2, -5, 3),
  new THREE.Vector3(-2, -12, -2),
  new THREE.Vector3(2, -19, 3),
  new THREE.Vector3(-1, -25, -1),
  new THREE.Vector3(0, -32, 2),
  new THREE.Vector3(0, -40, 0),
];

// Create the curve object from our points.
export const curve = new THREE.CatmullRomCurve3(pathPoints);

/**
 * Thread Component - The visual core of the "Digital Weaver" experience.
 *
 * This component renders a tube geometry that follows the predefined `curve`.
 * It uses the `useFrame` hook to animate the drawing of this tube on every frame,
 * based on the `scrollProgress` value from our global Zustand store.
 *
 * The animation is achieved by manipulating the `drawRange` of the geometry,
 * which is a highly performant method for this kind of "growing" effect.
 */
export function Thread() {
  // A ref to hold the tube geometry. This allows us to directly manipulate it.
  const geometryRef = useRef();

  // Subscribe to the `scrollProgress` state from our Zustand store.
  // Whenever `scrollProgress` changes, this component will re-render,
  // but the core animation logic is handled efficiently in `useFrame`.
  const scrollProgress = useStore((state) => state.scrollProgress);

  // useFrame is a React Three Fiber hook that executes a function on every single frame.
  // This is the heart of our real-time animation.
  useFrame(() => {
    // Safety check: ensure the geometry ref is populated before we try to use it.
    if (geometryRef.current) {
      // Get the total number of vertices in our tube geometry.
      // This is constant after the geometry is created.
      const totalVertices = geometryRef.current.attributes.position.count;

      // Calculate how many vertices should be visible based on the scroll progress.
      // `scrollProgress` is a float from 0 to 1.
      const drawCount = Math.floor(totalVertices * scrollProgress);

      // This is the magic! setDrawRange tells WebGL which part of the geometry
      // to render. By updating it every frame, we create the illusion of the
      // thread drawing itself along the path.
      geometryRef.current.setDrawRange(0, drawCount);
    }
  });

  return (
    // A mesh is a combination of a geometry (the shape) and a material (the skin).
    <mesh>
      {/* 
        <tubeGeometry> creates a 3D tube shape along the provided curve.
        - ref: Attaches our `geometryRef` so we can access it in `useFrame`.
        - args: [path, tubularSegments, radius, radialSegments, closed]
          - curve: The path to follow.
          - 128: Number of segments along the length of the tube. Higher is smoother.
          - 0.1: The radius of the tube.
          - 8:   Number of segments around the circumference. Higher is rounder.
          - false: The tube is not a closed loop.
      */}
      <tubeGeometry ref={geometryRef} args={[curve, 32, 0.1, 8, false]} />

      {/*
        The material determines how the object looks.
        - <meshStandardMaterial> is a good general-purpose, physically-based material.
        - emissive: The color of light that the material emits. This makes it glow.
        - emissiveIntensity: The strength of the glow. A value > 1 makes it bloom with post-processing.
        - toneMapped={false}: Crucial for emissive materials to work well with bloom effects.
      */}
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={4}
        toneMapped={false}
      />
    </mesh>
  );
}
