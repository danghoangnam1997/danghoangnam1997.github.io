// src/components/scene/Effects.jsx (Lighter & Faster Version)
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

/**
 * Effects - A performance-focused post-processing stack.
 *
 * This version is much lighter because:
 * 1. It COMPLETELY REMOVES DepthOfField, which is very GPU-intensive.
 * 2. The Bloom effect is toned down with a smaller kernel size and intensity,
 *    making it faster to compute.
 * 3. Vignette is kept because it's a very cheap effect that adds a lot of atmosphere.
 */
export function Effects() {
  return (
    <EffectComposer>
      {/* A much less intense Bloom effect for a subtle glow. */}
      <Bloom
        luminanceThreshold={0.3} // Only brighter things will bloom
        intensity={0.8}          // Less intense glow
        mipmapBlur
        kernelSize={2}           // Smaller kernel size is much faster
      />
      {/* Vignette is very performant and helps focus the scene. */}
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
