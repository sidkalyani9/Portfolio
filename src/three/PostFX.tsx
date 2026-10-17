import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise, ToneMapping } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Vector2 } from "three";
import { useTheme } from "@/components/ThemeProvider";
import { useMemo } from "react";

/**
 * Restore the luminous cinematic stack at night; keep only fine texture on white.
 */
export function PostFX({
  enabled = true,
  strength = 1,
}: {
  enabled?: boolean;
  strength?: number;
}) {
  const { theme } = useTheme();
  const aberration = useMemo(() => new Vector2(0.0009 * strength, 0.0007 * strength), [strength]);
  if (!enabled) return null;

  if (theme === "dark") {
    return (
      <EffectComposer key="dark" multisampling={0} enableNormalPass={false}>
        <Bloom intensity={0.55 * strength} luminanceThreshold={0.35} luminanceSmoothing={0.4} mipmapBlur />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={aberration} radialModulation={false} modulationOffset={0} />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.22 * strength} />
        <Vignette eskil={false} offset={0.22} darkness={0.72} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer key="light" multisampling={0} enableNormalPass={false}>
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.025 * strength}
      />
    </EffectComposer>
  );
}
