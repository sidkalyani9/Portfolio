import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
import { Vector3 } from 'three';

const root = fileURLToPath(new URL('../../', import.meta.url));

// Execute the real components with controlled browser/hooks, without rendering
// a browser or adding exports/test switches to production application code.
function loadSource(relative, imports, globals = {}, extra = '') {
  const source = readFileSync(new URL(relative, `file://${root}`), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
  const module = { exports: {} };
  runInNewContext(outputText + extra, {
    module,
    exports: module.exports,
    require(name) {
      assert.ok(name in imports, `Unexpected dependency: ${name}`);
      return imports[name];
    },
    ...globals,
  }, { filename: relative });
  return module.exports;
}

function mobileHarness({ hidden = false, reduced = false } = {}) {
  const effects = [];
  const pending = new Map();
  const listeners = new Map();
  let nextId = 0; // Zero is a valid RAF ID; the owner must use an explicit sentinel.
  let paints = 0;
  const radialCalls = [];
  const context = new Proxy({}, {
    get(_target, name) {
      if (name === 'clearRect') return () => { paints += 1; };
      if (name === 'createRadialGradient') return (...args) => {
        radialCalls.push(args);
        return { addColorStop() {} };
      };
      if (name === 'createLinearGradient') return () => ({ addColorStop() {} });
      return () => {};
    },
    set() { return true; },
  });
  const canvas = {
    getContext: () => context,
    getBoundingClientRect: () => ({ width: 390, height: 844 }),
  };
  const doc = {
    visibilityState: hidden ? 'hidden' : 'visible',
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
  };
  const nodes = [
    { id: 'a', position: [-1, 0.9, 0] },
    { id: 'b', position: [1, 1.3, 0] },
  ];
  const module = loadSource('src/components/MobileWorld.tsx', {
    react: {
      useEffect: (effect) => effects.push(effect),
      useRef: (current) => ({ current }),
    },
    'react/jsx-runtime': {
      jsx: (_type, props) => { props.ref.current = canvas; return null; },
    },
    '@/components/ThemeProvider': { useTheme: () => ({ theme: 'dark' }) },
    '@/hooks/useScrollProgress': { useScrollProgressRef: () => ({ current: { journey: 0, progress: 0, nodes } }) },
    '@/hooks/usePrefersReducedMotion': { usePrefersReducedMotion: () => reduced },
    '@/three/journeyGraph': { activeIndexFromJourney: () => 0 },
  }, {
    document: doc,
    window: { devicePixelRatio: 1, addEventListener() {}, removeEventListener() {} },
    performance: { now: () => 100 },
    requestAnimationFrame(callback) {
      const id = nextId++;
      pending.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => pending.delete(id),
  });
  module.MobileWorld();
  const cleanups = effects.map((effect) => effect()).filter(Boolean);
  return {
    pending,
    listeners,
    radialCalls,
    get paints() { return paints; },
    visibility(value) {
      doc.visibilityState = value;
      listeners.get('visibilitychange')?.();
    },
    frame(now) {
      // The browser runs the callbacks already queued for this frame; callbacks
      // added while running belong to the next frame.
      const callbacks = [...pending];
      pending.clear();
      for (const [, callback] of callbacks) callback(now);
    },
    cleanup() { for (const cleanup of cleanups) cleanup(); },
  };
}

test('mobile visibility changes retain exactly one animation owner', () => {
  const app = mobileHarness();
  assert.equal(app.pending.size, 1);
  for (let i = 0; i < 100; i++) {
    // Suspend a still-pending RAF, as browsers do for a background tab.
    app.visibility('hidden');
    assert.equal(app.pending.size, 0);
    app.visibility('visible');
    app.visibility('visible');
    assert.equal(app.pending.size, 1);
    const before = app.paints;
    app.frame(116 + i * 16);
    assert.equal(app.paints, before + 1);
    assert.equal(app.pending.size, 1);
  }
  const lateCallback = [...app.pending.values()][0];
  const beforeCleanup = app.paints;
  app.cleanup();
  assert.equal(app.pending.size, 0);
  assert.equal(app.listeners.size, 0);
  lateCallback(4000);
  assert.equal(app.paints, beforeCleanup);
  assert.equal(app.pending.size, 0);
});

test('mobile initially hidden and reduced-motion modes schedule no animation', () => {
  const hidden = mobileHarness({ hidden: true });
  assert.equal(hidden.pending.size, 0);
  assert.equal(hidden.paints, 0);
  hidden.visibility('visible');
  assert.equal(hidden.pending.size, 1);
  hidden.cleanup();

  const reduced = mobileHarness({ reduced: true });
  assert.equal(reduced.paints, 1); // Existing resize() static frame.
  for (let i = 0; i < 5; i++) {
    reduced.visibility('hidden');
    reduced.visibility('visible');
  }
  assert.equal(reduced.pending.size, 0);
  assert.equal(reduced.paints, 1);
  reduced.cleanup();
});

test('mobile visibility resume preserves the original elapsed animation clock', () => {
  const app = mobileHarness();
  app.frame(116);
  app.visibility('hidden');
  app.visibility('visible');
  app.radialCalls.length = 0;
  app.frame(3100); // t0 remains 100, so the original trajectory uses elapsed=3000.
  const firstCloud = app.radialCalls[0];
  assert.equal(firstCloud[0], 390 * 0.2 + Math.sin(3000 * 0.00015) * 24);
  assert.equal(firstCloud[1], 844 * 0.22 + Math.cos(3000 * 0.00012) * 18);
  app.cleanup();
});

let allocations = 0;
class CountedVector3 extends Vector3 {
  constructor(...args) { super(...args); allocations += 1; }
}
const { samplePath } = loadSource('src/three/CameraRig.tsx', {
  react: {},
  '@react-three/fiber': {},
  three: { Vector3: CountedVector3 },
  '@/three/journeyGraph': {},
  '@/hooks/useScrollProgress': {},
}, {}, '\nexports.samplePath = samplePath;');

// Archived pre-optimization interpolation. Exact equality, rather than a
// tolerance, guards the camera trajectory against arithmetic/order changes.
function originalCatmull(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return new Vector3(
    0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
    0.5 * (2 * p1.z + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3),
  );
}
function originalSample(points, t) {
  const n = points.length - 1;
  if (n < 1) return (points[0] ?? new Vector3()).clone();
  const f = Math.min(0.999, Math.max(0, t)) * n;
  const i = Math.floor(f);
  return originalCatmull(points[Math.max(0, i - 1)], points[i], points[Math.min(n, i + 1)], points[Math.min(n, i + 2)], f - i);
}

test('camera sampling retains every coordinate exactly without transient vectors', () => {
  const paths = [
    [],
    [new Vector3(1, -2, 0.5)],
    [new Vector3(-2.2, 0.85, 0.3), new Vector3(0.2, 1.05, 0.6), new Vector3(2.6, 0.7, 0.15)],
    Array.from({ length: 10 }, (_, i) => new Vector3(Math.sin(i) * 5, Math.cos(i * 0.7), i * 0.41 - 1.4)),
  ];
  const out = new CountedVector3();
  const before = allocations;
  for (const path of paths) {
    for (let i = -100; i <= 1100; i++) {
      const t = i / 1000;
      samplePath(path, t, out);
      assert.deepEqual(out.toArray(), originalSample(path, t).toArray(), `path ${path.length}, t ${t}`);
    }
  }
  assert.equal(allocations, before);
});
