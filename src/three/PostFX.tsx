import { EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * A trace of texture on white. Bloom and a dark vignette wash out pigment
 * and dirty the paper edges, so neither belongs in the light palette.
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
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.025 * strength}
      />
    </EffectComposer>
  );
}
