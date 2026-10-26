/** Run with: node scripts/check-visible-bloom.mjs (uses installed TypeScript). */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { BloomEffect, BlendFunction } from "postprocessing";
import { WebGLRenderTarget } from "three";
import ts from "typescript";

// Load the actual helper on Node 20 as well as newer Node versions. Only its
// import location changes; all behavior comes from the production source.
const source = await readFile(new URL("../src/three/VisibleBloomEffect.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const moduleText = outputText.replace('from "postprocessing"', `from ${JSON.stringify(import.meta.resolve("postprocessing"))}`);
const { VisibleBloomEffect } = await import(`data:text/javascript;base64,${Buffer.from(moduleText).toString("base64")}`);

// The React Bloom wrapper uses ADD, unlike the raw class's SCREEN default.
const options = {
  blendFunction: BlendFunction.ADD,
  intensity: 0.55,
  luminanceThreshold: 0.35,
  luminanceSmoothing: 0.4,
  mipmapBlur: true,
};
const original = new BloomEffect(options);
const optimized = new VisibleBloomEffect(options);
const input = new WebGLRenderTarget(1280, 720);
input.texture.name = "Input";
original.setSize(1280, 720);
optimized.setSize(1280, 720);

function uniformValue(value) {
  if (value?.isTexture) {
    return { texture: value.name, colorSpace: value.colorSpace, width: value.image?.width, height: value.image?.height };
  }
  return value?.toArray ? value.toArray() : value;
}

// Exercise the real luminance/downsample/upsample passes. A recorder replaces
// only WebGL submission, allowing complete draw-input comparison without a GPU.
function trace(effect, opacity) {
  effect.blendMode.opacity.value = opacity;
  let target;
  const draws = [];
  effect.update({
    setRenderTarget(next) { target = next; },
    render(scene) {
      const material = scene.children[0].material;
      draws.push({
        target: target.texture.name,
        width: target.width,
        height: target.height,
        fragment: material.fragmentShader,
        vertex: material.vertexShader,
        defines: { ...material.defines },
        uniforms: Object.fromEntries(Object.entries(material.uniforms).map(([key, uniform]) => [key, uniformValue(uniform.value)])),
      });
    },
  }, input, 1 / 60);
  return draws;
}

const resources = {
  renderTarget: optimized.renderTarget,
  luminancePass: optimized.luminancePass,
  mipmapBlurPass: optimized.mipmapBlurPass,
  texture: optimized.texture,
  uniforms: optimized.uniforms,
  blendMode: optimized.blendMode,
};

try {
  assert.equal(optimized.getFragmentShader(), original.getFragmentShader());
  assert.equal(optimized.getVertexShader(), original.getVertexShader());
  assert.equal(optimized.blendMode.blendFunction, BlendFunction.ADD);
  assert.equal(trace(original, 0).length, 16, "baseline still renders all invisible bloom passes");
  assert.deepEqual(trace(optimized, 0), trace(original, 0), "initial light mode warms the original passes once");
  assert.equal(trace(optimized, 0).length, 0, "subsequent light frames skip all offscreen bloom draws");

  // Covers light→dark, fractional opacity, dark→light→dark, and a nonzero value
  // near zero: only exactly invisible bloom may be skipped.
  for (const opacity of [1, 0.5, 0, 1, Number.EPSILON]) {
    const before = trace(original, opacity);
    const after = trace(optimized, opacity);
    if (opacity === 0) {
      assert.equal(after.length, 0);
    } else {
      assert.equal(after.length, 16);
      assert.deepEqual(after, before, `draw inputs must match at opacity ${opacity}`);
    }
    for (const [key, resource] of Object.entries(resources)) {
      assert.strictEqual(optimized[key], resource, `${key} must survive opacity changes`);
    }
    assert.equal(optimized.blendMode.blendFunction, BlendFunction.ADD);
  }
  original.setSize(1920, 1080);
  optimized.setSize(1920, 1080);
  assert.deepEqual(trace(optimized, 0), trace(original, 0), "resize warms new render-target sizes once");
  assert.equal(trace(optimized, 0).length, 0);
  assert.deepEqual(trace(optimized, 1), trace(original, 1));
  console.log("PASS: hidden bloom draws 16 → 0 after one warm-up; visible draw order, sizes, shaders, uniforms, ADD blending and resource identities preserved.");
} finally {
  original.dispose();
  optimized.dispose();
  input.dispose();
}
