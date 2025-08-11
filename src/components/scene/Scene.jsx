import { Canvas } from '@react-three/fiber';
import { CameraControls, Effects as DreiEffects } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

// Import our 3D components and the curve for positioning
import { Thread, curve } from './Thread';
import { Blossom } from './Blossom';

// Import our project data to dynamically create blossoms
import { projects } from '../../data/projects';

/**
 * --- Calculating Blossom Positions ---
 * We do this outside the main component to avoid recalculation on every render.
 * We use the `curve.getPointAt(t)` method, where `t` is a value from 0 (start) to 1 (end).
 * This function returns a THREE.Vector3 at that point along the curve.
 *
 * We link each project to a specific point on the curve.
 */
const blossomData = projects.map((project, index) => {
  // Distribute the blossoms evenly along the middle part of the curve.
  // We start at 30% (0.3) and end at 80% (0.8) of the path.
  const progress = 0.3 + (index / (projects.length - 1)) * 0.5;
  return {
    id: project.id,
    position: curve.getPointAt(progress),
  };
});

/**
 * Scene Component - The main stage for the 3D experience.
 *
 * This component sets up the R3F Canvas and is responsible for:
 * 1. Configuring the main camera.
 * 2. Adding essential lighting to the scene.
 * 3. Rendering all our 3D components (`Thread`, `Blossom`).
 * 4. Dynamically placing `Blossom` components based on project data.
 * 5. Implementing post-processing effects like 'Bloom' to create the glowing look.
 */
export function Scene() {
  return (
    // The <Canvas> component is the root of our 3D scene.
    // - camera: Sets initial camera properties.
    //   - position: [x, y, z] - We place it slightly up and in front of the start of the thread.
    //   - fov: Field of view, defines the extent of the scene that is seen.
    <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>

      {/* --- LIGHTING --- */}
      {/* AmbientLight provides a soft, general illumination to the entire scene. */}
      <ambientLight intensity={0.5} />
      {/* PointLight acts like a single lightbulb, casting light from a specific point. */}
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* --- 3D OBJECTS --- */}
      <Thread />
      
      {/* 
        We map over our `blossomData` array to render a Blossom component for each project.
        This makes our scene data-driven and easy to update.
        We pass the calculated position and project ID as props.
      */}
      {blossomData.map(data => (
        <Blossom key={data.id} projectId={data.id} position={data.position} />
      ))}

      {/* 
        --- POST-PROCESSING EFFECTS ---
        <EffectComposer> is the wrapper for all post-processing passes.
        It allows us to apply screen-space effects like bloom, depth of field, etc.
      */}
      <EffectComposer>
        {/*
          <Bloom> creates the glowing "halo" effect around bright objects.
          This is what makes our emissive thread and blossoms truly shine.
          - luminanceThreshold: How bright a pixel needs to be to start blooming.
          - intensity: The strength of the bloom effect.
          - mipmapBlur: Creates a more natural, feathered bloom.
        */}
        <Bloom
          luminanceThreshold={0.2}
          intensity={1.2}
          mipmapBlur
          kernelSize={3}
        />
      </EffectComposer>

      {/* 
        --- DEBUG CONTROLS (optional but highly recommended) ---
        <CameraControls> from drei is a powerful tool for navigating your scene during development.
        Uncomment it to be able to orbit, pan, and zoom with your mouse.
        Remember to remove or disable it for the final production build.
      */}
      {/* <CameraControls /> */}
    </Canvas>
  );
}
