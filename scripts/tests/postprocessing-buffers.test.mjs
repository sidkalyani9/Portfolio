import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import * as postprocessing from 'postprocessing';
import * as three from 'three';
import ts from 'typescript';

function loadSource(path, imports) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  });
  const module = { exports: {} };
  runInNewContext(outputText, {
    module, exports: module.exports,
    require(name) {
      assert.ok(name in imports, `Unexpected dependency: ${name}`);
      return imports[name];
    },
  }, { filename: path });
  return module.exports;
}

const { preparePostprocessingBuffers } = loadSource('../../src/three/preparePostprocessingBuffers.ts', {});
const { VisibleBloomEffect } = loadSource('../../src/three/VisibleBloomEffect.ts', { postprocessing });
const jsx = (type, props) => ({ type, props });
const jsxRuntime = { jsx, jsxs: jsx };

function hooks(layouts, effects = []) {
  return {
    useMemo: (factory) => factory(),
    useCallback: (callback) => callback,
    useRef: (current) => ({ current }),
    useLayoutEffect: (effect) => layouts.push(effect),
    useEffect: (effect) => effects.push(effect),
    memo: (component) => component,
    forwardRef: (component) => component,
    createContext: () => ({ Provider: 'provider' }),
    useImperativeHandle: (ref, factory) => layouts.push(() => ref(factory())),
  };
}

// Run the production PostFX declarations and the installed React composer's
// actual grouping logic. Only React scheduling and GPU submission are replaced.
function pipeline({ optimized, theme, strength }) {
  const layouts = [];
  const wrapEffect = (EffectClass, defaults) => ({ EffectClass, defaults });
  const { PostFX } = loadSource('../../src/three/PostFX.tsx', {
    react: hooks(layouts),
    'react/jsx-runtime': jsxRuntime,
    '@react-three/postprocessing': {
      EffectComposer: 'composer', wrapEffect,
      ...Object.fromEntries(['ChromaticAberration', 'Noise', 'Vignette', 'ToneMapping'].map((name) => [name, wrapEffect(postprocessing[`${name}Effect`])])),
    },
    postprocessing, three,
    '@/components/ThemeProvider': { useTheme: () => ({ theme }) },
    '@/three/VisibleBloomEffect': { VisibleBloomEffect },
    '@/three/preparePostprocessingBuffers': { preparePostprocessingBuffers },
  });
  const element = PostFX({ strength });
  const effectInstances = Array.from(element.props.children, ({ type, props }) => {
    const effect = new type.EffectClass({ ...type.defaults, ...props });
    if (props.blendFunction !== undefined) effect.blendMode.blendFunction = props.blendFunction;
    props.ref.current = effect;
    return effect;
  });

  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera();
  const draws = [];
  const usedTargets = new Set();
  const contents = new WeakMap();
  let width = 1920, height = 1080, target, composer;
  function textureValue(value) {
    if (value?.isTexture) return {
      target: contents.get(value) ?? (value === composer.inputBuffer.texture ? 'input' : value === composer.outputBuffer.texture ? 'output' : value.name),
      width: value.image.width, height: value.image.height,
      type: value.type, format: value.format, colorSpace: value.colorSpace,
    };
    return value?.toArray ? value.toArray() : value;
  }
  const renderer = {
    autoClear: true, toneMapping: three.ACESFilmicToneMapping,
    outputColorSpace: three.SRGBColorSpace,
    shadowMap: { autoUpdate: true },
    getSize: (out) => out.set(width, height),
    getDrawingBufferSize: (out) => out.set(Math.floor(width * 1.5), Math.floor(height * 1.5)),
    setSize(w, h) { width = w; height = h; },
    getContext: () => ({ getContextAttributes: () => ({ alpha: false, depth: false, stencil: false, antialias: false }) }),
    getClearAlpha: () => 1,
    setRenderTarget(next) { target = next; },
    clear() {},
    render(renderedScene) {
      const material = renderedScene === scene ? null : renderedScene.children[0].material;
      const targetRole = material === effectInstances[0].luminancePass.fullscreenMaterial ? 'LuminancePass.Target'
        : target === null ? 'screen' : target === composer.inputBuffer ? 'input' : target === composer.outputBuffer ? 'output' : target.texture.name;
      if (renderedScene === scene) {
        assert.strictEqual(target, composer.inputBuffer, 'the 3D scene must retain its original input target');
        assert.equal(target.depthBuffer, true, 'scene occlusion still requires depth');
      } else {
        assert.equal(material.depthTest, false, 'every fullscreen draw ignores depth');
        assert.equal(material.depthWrite, false, 'every fullscreen draw leaves depth untouched');
        for (const uniform of Object.values(material.uniforms)) {
          if (target !== null) assert.notStrictEqual(uniform.value, target.texture, 'a draw must never sample its destination texture');
        }
      }
      draws.push({
        target: targetRole,
        size: target === null ? [width * 1.5, height * 1.5] : [target.width, target.height],
        shader: material && { vertex: material.vertexShader, fragment: material.fragmentShader, defines: { ...material.defines } },
        uniforms: material && Object.fromEntries(Object.entries(material.uniforms).map(([key, uniform]) => [key, textureValue(uniform.value)])),
      });
      if (target !== null) {
        usedTargets.add(target);
        contents.set(target.texture, targetRole);
      }
    },
  };

  const composerLayouts = [], composerEffects = [];
  const { EffectComposer } = loadSource('../../node_modules/@react-three/postprocessing/src/EffectComposer.tsx', {
    react: hooks(composerLayouts, composerEffects),
    'react/jsx-runtime': {
      ...jsxRuntime,
      jsx(type, props) {
        if (type === 'group') props.ref.current = { __r3f: { children: effectInstances.map((object) => ({ object })) } };
        return jsx(type, props);
      },
    },
    three, postprocessing,
    '@react-three/fiber': { useThree: () => ({ gl: renderer, scene, camera, size: { width, height } }), useFrame() {} },
  });
  EffectComposer(element.props, (value) => {
    composer = value;
    if (optimized) element.props.ref(value);
  });
  composerLayouts.forEach((effect) => effect());
  composerEffects.forEach((effect) => effect());
  layouts.forEach((effect) => effect());

  return {
    composer,
    bloom: effectInstances[0],
    usedTargets,
    setTheme(theme) {
      const opacity = theme === 'dark' ? 1 : 0;
      for (const effect of effectInstances) effect.blendMode.opacity.value = effect instanceof postprocessing.NoiseEffect ? (opacity ? 0.22 : 0.025) * strength : opacity;
    },
    trace() {
      draws.length = 0;
      composer.render(1 / 60);
      return JSON.parse(JSON.stringify(draws));
    },
  };
}

test('the actual effect pipeline preserves scene depth, HDR, resolution and every draw input', () => {
  for (const theme of ['light', 'dark']) {
    for (const strength of [1, 0.75]) {
      const baseline = pipeline({ optimized: false, theme, strength });
      const optimized = pipeline({ optimized: true, theme, strength });
      try {
        const { composer } = optimized;
        assert.deepEqual(composer.passes.map((pass) => pass.effects?.map((effect) => effect.name) ?? pass.name), [
          'RenderPass', ['BloomEffect'], ['ChromaticAberrationEffect'], ['NoiseEffect', 'VignetteEffect', 'ToneMappingEffect'],
        ]);
        assert.equal(composer.outputBuffer.depthBuffer, false);
        assert.equal(composer.inputBuffer.depthBuffer, true);
        for (const buffer of [composer.inputBuffer, composer.outputBuffer]) {
          assert.equal(buffer.texture.type, three.HalfFloatType);
          assert.equal(buffer.samples, 0);
          assert.deepEqual([buffer.width, buffer.height], [2880, 1620]);
        }
        for (let frame = 0; frame < 3; frame++) {
          const actual = optimized.trace();
          assert.deepEqual(actual, baseline.trace(), `${theme}, strength ${strength}, frame ${frame}`);
          assert.deepEqual(actual.filter((draw) => ['input', 'output', 'screen'].includes(draw.target)).map((draw) => draw.target), ['input', 'output', 'input', 'screen']);
        }
        assert.equal(baseline.usedTargets.size, 18);
        assert.equal(optimized.usedTargets.size, 17);
        assert.equal(optimized.usedTargets.has(optimized.bloom.luminancePass.renderTarget), false, 'the original luminance target never reaches GPU submission');
        const allocatedColorBytes = (app) => [...app.usedTargets].reduce((bytes, target) => bytes + target.width * target.height * 8, 0);
        assert.equal(allocatedColorBytes(baseline) - allocatedColorBytes(optimized), 2880 * 1620 * 8);
        for (const nextTheme of ['dark', 'light', 'dark']) {
          baseline.setTheme(nextTheme);
          optimized.setTheme(nextTheme);
          assert.deepEqual(optimized.trace(), baseline.trace(), `theme transition to ${nextTheme}`);
        }
        baseline.composer.setSize(1366, 768);
        composer.setSize(1366, 768);
        assert.equal(composer.outputBuffer.depthBuffer, false);
        assert.equal(composer.inputBuffer.depthBuffer, true);
        assert.deepEqual([composer.outputBuffer.width, composer.outputBuffer.height], [2049, 1152]);
        assert.deepEqual(optimized.trace(), baseline.trace(), 'resize preserves all draw inputs and the scene depth allocation');
      } finally {
        baseline.composer.dispose();
        optimized.composer.dispose();
      }
    }
  }
});

test('preparing the output target is idempotent and never disposes the scene target', () => {
  const composer = new postprocessing.EffectComposer(null, { frameBufferType: three.HalfFloatType });
  let inputDisposals = 0, outputDisposals = 0;
  composer.inputBuffer.addEventListener('dispose', () => inputDisposals++);
  composer.outputBuffer.addEventListener('dispose', () => outputDisposals++);
  preparePostprocessingBuffers(null);
  preparePostprocessingBuffers(composer);
  preparePostprocessingBuffers(composer);
  assert.equal(inputDisposals, 0);
  assert.equal(outputDisposals, 1);
  assert.equal(composer.inputBuffer.depthBuffer, true);
  composer.dispose();
});

function bloomHarness() {
  const bloom = new VisibleBloomEffect({ mipmapBlur: true });
  bloom.setSize(2880, 1620);
  bloom.initialize(null, false, three.HalfFloatType);
  const original = bloom.luminancePass.renderTarget;
  const scratch = original.clone();
  const input = original.clone();
  bloom.setScratchTarget(scratch);
  let target;
  const targets = [];
  const renderer = {
    setRenderTarget(next) { target = next; },
    render(scene) {
      for (const uniform of Object.values(scene.children[0].material.uniforms)) {
        if (target !== null) assert.notStrictEqual(uniform.value, target.texture);
      }
      targets.push(target);
    },
  };
  return {
    bloom, original, scratch, input, renderer,
    trace() {
      targets.length = 0;
      bloom.update(renderer, input, 1 / 60);
      assert.strictEqual(bloom.luminancePass.renderTarget, original, 'borrowed target must never replace ownership');
      return [...targets];
    },
    dispose() { bloom.dispose(); scratch.dispose(); input.dispose(); },
  };
}

test('scratch reuse warms, skips hidden frames and survives resize and reinitialization', () => {
  const app = bloomHarness();
  try {
    app.bloom.blendMode.opacity.value = 0;
    const initial = app.trace();
    assert.equal(initial.length, 16);
    assert.strictEqual(initial[0], app.scratch);
    assert.equal(app.trace().length, 0);
    app.bloom.initialize(null, false, three.HalfFloatType);
    assert.strictEqual(app.trace()[0], app.scratch, 'initialization warms the same scratch storage again');
    assert.equal(app.trace().length, 0);
    app.bloom.setSize(2049, 1152);
    app.input.setSize(2049, 1152);
    assert.strictEqual(app.trace()[0], app.original, 'an unmatched resize uses the normal target');
    app.scratch.setSize(2049, 1152);
    app.bloom.blendMode.opacity.value = 1;
    assert.strictEqual(app.trace()[0], app.scratch, 'reuse resumes when dimensions match');
    app.bloom.setScratchTarget(null);
    assert.strictEqual(app.trace()[0], app.original);
  } finally { app.dispose(); }
});

test('changed target configuration always falls back without changing bloom settings', () => {
  const changes = [
    (t) => t.setSize(t.width - 1, t.height),
    (t) => { t.texture.type = three.UnsignedByteType; },
    (t) => { t.texture.format = three.RedFormat; },
    (t) => { t.texture.internalFormat = 'RGBA16F'; },
    (t) => { t.texture.minFilter = three.NearestFilter; },
    (t) => { t.texture.magFilter = three.NearestFilter; },
    (t) => { t.texture.colorSpace = three.SRGBColorSpace; },
    (t) => { t.texture.generateMipmaps = true; },
    (t) => { t.texture.wrapS = three.RepeatWrapping; },
    (t) => { t.texture.flipY = true; },
    (t) => { t.texture.premultiplyAlpha = true; },
    (t) => { t.texture.anisotropy = 2; },
    (t) => { t.depthBuffer = true; },
    (t) => { t.stencilBuffer = true; },
    (t) => { t.depthTexture = new three.DepthTexture(t.width, t.height); },
    (t) => { t.samples = 2; },
    (t) => { t.scissorTest = true; },
    (t) => { t.scissor.z -= 1; },
    (t) => { t.viewport.z -= 1; },
    (t) => { t.textures.push(t.texture.clone()); },
  ];
  for (const change of changes) {
    const app = bloomHarness();
    try {
      change(app.scratch);
      const originalType = app.original.texture.type;
      assert.strictEqual(app.trace()[0], app.original, change.toString());
      assert.equal(app.original.texture.type, originalType);
      assert.deepEqual([app.original.width, app.original.height], [2880, 1620]);
    } finally { app.dispose(); }
  }
  const app = bloomHarness();
  try {
    app.bloom.setScratchTarget(app.input);
    assert.strictEqual(app.trace()[0], app.original, 'never overwrite the incoming image');
    app.bloom.setScratchTarget(app.scratch);
    app.bloom.mipmapBlurPass.enabled = false;
    assert.strictEqual(app.trace()[0], app.original, 'other bloom algorithms retain their normal storage');
  } finally { app.dispose(); }
});

test('render failure restores target ownership and does not mark an incomplete warm-up ready', () => {
  const app = bloomHarness();
  try {
    app.bloom.blendMode.opacity.value = 0;
    assert.throws(() => app.bloom.update({
      ...app.renderer,
      render() { throw new Error('GPU submission failed'); },
    }, app.input, 1 / 60), /GPU submission failed/);
    assert.strictEqual(app.bloom.luminancePass.renderTarget, app.original);
    assert.equal(app.trace().length, 16);
    assert.equal(app.trace().length, 0);
  } finally { app.dispose(); }
});

test('effect disposal never disposes borrowed composer storage', () => {
  const app = bloomHarness();
  let scratchDisposals = 0, originalDisposals = 0;
  app.scratch.addEventListener('dispose', () => scratchDisposals++);
  app.original.addEventListener('dispose', () => originalDisposals++);
  app.trace();
  assert.equal(Object.values(app.bloom).includes(app.scratch), false);
  app.bloom.dispose();
  assert.equal(scratchDisposals, 0);
  assert.equal(originalDisposals, 1);
  app.scratch.dispose();
  app.input.dispose();
});

test('the display canvas requests no unused default depth, stencil or MSAA buffers', () => {
  const source = readFileSync(new URL('../../src/three/CinematicWorld.tsx', import.meta.url), 'utf8');
  const gl = source.match(/gl=\{\{([\s\S]*?)\}\}/)?.[1];
  assert.ok(gl, 'expected a Canvas context configuration');
  for (const flag of ['depth', 'stencil', 'antialias']) assert.match(gl, new RegExp(`\\b${flag}: false\\b`));
  assert.match(source, /dpr=\{dpr\}/);
});
