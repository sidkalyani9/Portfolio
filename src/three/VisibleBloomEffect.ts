import { BloomEffect } from "postprocessing";
import type { WebGLRenderTarget } from "three";

function matchingTargets(a: WebGLRenderTarget, b: WebGLRenderTarget) {
  const x = a.texture;
  const y = b.texture;
  return a.width === b.width && a.height === b.height && a.depth === b.depth
    && a.textures.length === 1 && b.textures.length === 1
    && a.depthBuffer === b.depthBuffer && a.stencilBuffer === b.stencilBuffer
    && a.depthTexture === null && b.depthTexture === null
    && a.samples === b.samples && a.scissorTest === b.scissorTest
    && a.viewport.equals(b.viewport) && a.scissor.equals(b.scissor)
    && x.type === y.type && x.format === y.format && x.internalFormat === y.internalFormat
    && x.colorSpace === y.colorSpace && x.minFilter === y.minFilter && x.magFilter === y.magFilter
    && x.generateMipmaps === y.generateMipmaps && x.wrapS === y.wrapS && x.wrapT === y.wrapT
    && x.anisotropy === y.anisotropy && x.flipY === y.flipY && x.premultiplyAlpha === y.premultiplyAlpha;
}

/** Keep the compiled effect alive, but skip its invisible offscreen passes. */
export class VisibleBloomEffect extends BloomEffect {
  private warmed = false;
  // Effect.dispose() disposes enumerable render-target properties. This target
  // belongs to the composer, so keep the borrowed reference in a native field.
  #scratchTarget: WebGLRenderTarget | null = null;

  setScratchTarget(target: WebGLRenderTarget | null) {
    this.#scratchTarget = target;
  }

  initialize(...args: Parameters<BloomEffect["initialize"]>) {
    super.initialize(...args);
    this.warmed = false;
  }

  setSize(...args: Parameters<BloomEffect["setSize"]>) {
    super.setSize(...args);
    this.warmed = false;
  }

  update(...args: Parameters<BloomEffect["update"]>) {
    // Warm shaders and render targets once, even when loading a saved light
    // preference. The first dark toggle must not pay their initialization cost.
    if (this.warmed && this.blendMode.opacity.value === 0) return;
    // The installed LuminancePass exposes this target at runtime but omits it
    // from its declaration file.
    const luminance = this.luminancePass as BloomEffect["luminancePass"] & { renderTarget: WebGLRenderTarget };
    const original = luminance.renderTarget;
    const scratch = this.#scratchTarget;
    const input = args[1];
    // Bloom composites into the other composer buffer only after all luminance
    // and mip draws finish. Its original luminance target can stay unallocated.
    // Fall back automatically if a future pipeline/configuration differs.
    const borrow = scratch !== null && scratch.texture !== input.texture
      && luminance.enabled && !luminance.renderToScreen
      && this.mipmapBlurPass.enabled && matchingTargets(original, scratch);
    if (borrow) luminance.renderTarget = scratch;
    try {
      super.update(...args);
    } finally {
      luminance.renderTarget = original;
    }
    this.warmed = true;
  }

  dispose() {
    this.#scratchTarget = null;
    super.dispose();
  }
}
