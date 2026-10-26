import { BloomEffect } from "postprocessing";

/** Keep the compiled effect alive, but skip its invisible offscreen passes. */
export class VisibleBloomEffect extends BloomEffect {
  private warmed = false;

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
    super.update(...args);
    this.warmed = true;
  }
}
