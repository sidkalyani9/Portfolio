import { useLayoutEffect, useMemo, useRef } from "react";
import { EffectComposer, wrapEffect, ChromaticAberration, Vignette, Noise, ToneMapping } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode, type BloomEffect, type ChromaticAberrationEffect, type VignetteEffect, type NoiseEffect, type ToneMappingEffect } from "postprocessing";
import { Vector2 } from "three";
import { useTheme } from "@/components/ThemeProvider";
import { VisibleBloomEffect } from "@/three/VisibleBloomEffect";

// Match the React Bloom wrapper's ADD blend (the raw class defaults to SCREEN).
const VisibleBloom = wrapEffect(VisibleBloomEffect, { blendFunction: BlendFunction.ADD });

/** Keep the GPU pipeline compiled; a theme change only updates uniforms. */
export function PostFX({ enabled = true, strength = 1 }: { enabled?: boolean; strength?: number }) {
  const { theme } = useTheme();
  const bloom = useRef<BloomEffect>(null);
  const aberration = useRef<ChromaticAberrationEffect>(null);
  const noise = useRef<NoiseEffect>(null);
  const vignette = useRef<VignetteEffect>(null);
  const toneMapping = useRef<ToneMappingEffect>(null);

  // EffectComposer rebuilds its passes when children change identity. Keep
  // these elements stable even when theme or scroll-driven strength changes.
  const effects = useMemo(() => [
    <VisibleBloom key="bloom" ref={bloom} intensity={0.55} luminanceThreshold={0.35} luminanceSmoothing={0.4} mipmapBlur />,
    <ChromaticAberration key="aberration" ref={aberration} blendFunction={BlendFunction.NORMAL} offset={new Vector2(0.0009, 0.0007)} radialModulation={false} modulationOffset={0} />,
    <Noise key="noise" ref={noise} premultiply blendFunction={BlendFunction.SOFT_LIGHT} />,
    <Vignette key="vignette" ref={vignette} eskil={false} offset={0.22} darkness={0.72} />,
    // SRC (the default) ignores opacity; NORMAL preserves white when inactive.
    <ToneMapping key="tone" ref={toneMapping} blendFunction={BlendFunction.NORMAL} mode={ToneMappingMode.ACES_FILMIC} />,
  ], []);

  useLayoutEffect(() => {
    const night = theme === "dark" ? 1 : 0;
    for (const effect of [bloom.current, aberration.current, vignette.current, toneMapping.current]) {
      if (effect) effect.blendMode.opacity.value = night;
    }
    if (bloom.current) bloom.current.intensity = 0.55 * strength;
    if (aberration.current) aberration.current.offset.set(0.0009 * strength, 0.0007 * strength);
    if (noise.current) noise.current.blendMode.opacity.value = (night ? 0.22 : 0.025) * strength;
  }, [theme, strength, enabled]);

  if (!enabled) return null;
  return <EffectComposer multisampling={0} enableNormalPass={false}>{effects}</EffectComposer>;
}
