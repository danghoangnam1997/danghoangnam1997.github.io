import { Canvas } from '@react-three/fiber';

// Import our custom 3D components and helpers
import { Effects } from './Effects';
import { Thread, curve } from './Thread';
import { Blossom } from './Blossom';

// Import the project data to dynamically create a blossom for each project
import { projects } from '../../data/projects';

/**
 * --- Calculating Blossom Positions ---
 * This logic is placed outside the component to prevent recalculation on every render.
 * It maps over our project data and uses the `curve` object (exported from Thread.jsx)
 * to calculate a precise 3D position for each project's "blossom" along the thread's path.
 */
const blossomData = projects.map((project, index) => {
  // We distribute the blossoms along the middle 50% of the thread's path.
  // This avoids placing them too close to the start or end.
  // The calculation is: start_point + (progress_through_projects * available_range)
  const progressAlongCurve = 0.3 + (index / (projects.length - 1)) * 0.5;
  
  return {
    id: project.id,
    position: curve.getPointAt(progressAlongCurve),
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
 * 5. Applying the centralized post-processing stack from the <Effects /> component.
 */
export function Scene() {
  return (
    // The <Canvas> component is the root of our 3D scene.
    // - camera: Sets initial camera properties.
    //   - position: [x, y, z] - We place it slightly up and in front of the start of the thread.
    //   - fov: Field of view, defines the extent of the scene that is seen.
    <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
      
      {/* --- LIGHTING --- */}
      {/* AmbientLight provides a soft, non-directional base light to the entire scene. */}
      <ambientLight intensity={0.5} />
      {/* PointLight acts like a single lightbulb, casting light and shadows from a point. */}
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* --- 3D OBJECTS --- */}
      <Thread />
      
      {/* 
        We map over our `blossomData` array to render a Blossom component for each project.
        This makes our scene data-driven and easy to update.
        We pass the calculated position and project ID as props. A unique `key` is essential for React.
      */}
      {blossomData.map(data => (
        <Blossom key={data.id} projectId={data.id} position={data.position} />
      ))}

      {/* 
        --- POST-PROCESSING ---
        This single component cleanly encapsulates our entire stack of visual effects
        (Bloom, Depth of Field, Vignette, etc.), keeping our main scene file organized.
      */}
      <Effects />

    </Canvas>
  );
}
