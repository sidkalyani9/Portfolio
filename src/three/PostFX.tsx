import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise, ToneMapping } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Vector2 } from "three";

/**
 * Cinematic post stack — bloom, chromatic aberration, film grain, vignette.
 * Keep modest on intensity; spectacle without headache.
 */
export function PostFX({
  enabled = true,
  strength = 1,
}: {
  enabled?: boolean;
  strength?: number;
}) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.55 * strength}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0009 * strength, 0.0007 * strength)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.22 * strength}
      />
      <Vignette eskil={false} offset={0.22} darkness={0.72} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
