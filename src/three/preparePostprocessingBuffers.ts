import type { EffectComposer } from "postprocessing";
import type { VisibleBloomEffect } from "@/three/VisibleBloomEffect";

/** Apply before the composer's first frame, through its ref callback. */
export function preparePostprocessingBuffers(composer: EffectComposer | null, bloom?: VisibleBloomEffect | null) {
  bloom?.setScratchTarget(composer?.outputBuffer ?? null);
  if (!composer || !composer.outputBuffer.depthBuffer) return;

  // RenderPass always draws the 3D scene into inputBuffer. The other target
  // only receives fullscreen effects, whose materials neither test nor write
  // depth. Keep the scene's depth attachment and both HDR color textures.
  composer.outputBuffer.depthBuffer = false;
  composer.outputBuffer.dispose();
}
