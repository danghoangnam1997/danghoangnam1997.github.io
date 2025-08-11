// src/components/scene/Effects.jsx
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';

/**
 * Effects - A centralized component for all post-processing effects.
 *
 * This component wraps the <EffectComposer> and all the desired visual effect passes.
 * Centralizing them here cleans up the main <Scene> component and makes it easy
 * to manage and tweak the final look and feel of the WebGL canvas.
 *
 * It includes:
 * - Bloom: Creates a glowing halo around bright, emissive objects.
 * - DepthOfField: Blurs objects that are not in focus, creating a cinematic,
 *   photographic effect that helps guide the user's eye.
 * - Vignette: Darkens the corners of the screen, further focusing attention
 *   on the center of the scene.
 */
export function Effects() {
  return (
    <EffectComposer>
      {/*
        The Bloom effect we previously had in Scene.jsx.
        It's the primary effect for our "glowing" aesthetic.
      */}
      <Bloom
        luminanceThreshold={0.2}
        intensity={1.2}
        mipmapBlur
        kernelSize={3}
      />
      {/*
        Depth of Field adds a powerful sense of realism and focus.
        - focusDistance: How far from the camera the focal plane is. 0 = near, 1 = far.
        - focalLength: The distance between the lens and the focal plane. Affects bokeh strength.
        - bokehScale: The size of the blur effect (the "bokeh" circles).
        - height: The resolution of the blur. Lower for better performance.
      */}
      <DepthOfField
        focusDistance={0}
        focalLength={0.02}
        bokehScale={4}
        height={480}
      />
      {/*
        Vignette is a subtle but effective way to frame the scene.
        - eskil: If false, it's a hard-edged vignette. If true, it's a smooth, soft one.
        - offset: How far the vignette starts from the center (0 to 1).
        - darkness: How dark the vignette is (0 to 1).
      */}
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
