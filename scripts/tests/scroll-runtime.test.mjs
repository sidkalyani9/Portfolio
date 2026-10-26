import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));
const baselineRef = 'c1cfd41';
const providerPath = 'src/hooks/useScrollProgress.ts';
const graphPath = 'src/three/journeyGraph.ts';
const sourceAt = (path, baseline) => baseline
  ? execFileSync('git', ['show', `${baselineRef}:${path}`], { cwd: root, encoding: 'utf8' })
  : readFileSync(new URL(path, `file://${root}`), 'utf8');
const compile = (source) => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const compiled = {
  baseline: { provider: compile(sourceAt(providerPath, true)), graph: compile(sourceAt(graphPath, true)) },
  current: { provider: compile(sourceAt(providerPath, false)), graph: compile(sourceAt(graphPath, false)) },
  store: compile(sourceAt('src/lib/scrollProgressStore.ts', false)),
};

function load(code, imports = {}, globals = {}) {
  const module = { exports: {} };
  runInNewContext(code, {
    module, exports: module.exports,
    require(name) {
      assert.ok(name in imports, `Unexpected dependency: ${name}`);
      return imports[name];
    },
    ...globals,
  });
  return module.exports;
}

// A minimal hook/effect lifecycle executes both actual provider implementations.
// No smoothing, section mapping, or end-snap formulas are reimplemented here.
function providerHarness(version, { booted = true } = {}) {
  const hooks = [];
  const pending = new Map();
  const timers = new Map();
  const listeners = new Map();
  let now = 0;
  let nextId = 0; // Exercise a legitimate RAF ID of zero.
  let nextTimer = 1;
  let cursor = 0;
  let dirty = false;
  let effects = [];
  let provided;
  let pathname = '/';
  const offsets = new Map();
  const doc = {
    documentElement: { scrollHeight: 17000, scrollTop: 0 },
    body: { scrollHeight: 17000 },
    getElementById(id) {
      return offsets.has(id) ? { getBoundingClientRect: () => ({ top: offsets.get(id) - win.scrollY }) } : null;
    },
  };
  const win = {
    innerHeight: 900,
    scrollY: 0,
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) {
      listeners.get(name)?.delete(callback);
      if (!listeners.get(name)?.size) listeners.delete(name);
    },
    setTimeout(callback, delay) {
      const id = nextTimer++;
      timers.set(id, { callback, due: now + delay });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
  };
  const globals = {
    window: win, document: doc,
    requestAnimationFrame(callback) {
      const id = nextId++;
      pending.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => pending.delete(id),
  };
  const depsChanged = (previous, next) => !previous || !next || previous.length !== next.length || previous.some((value, index) => !Object.is(value, next[index]));
  const effectHook = (callback, deps) => {
    const index = cursor++;
    const previous = hooks[index];
    if (depsChanged(previous?.deps, deps)) {
      hooks[index] = { deps, cleanup: previous?.cleanup };
      effects.push({ index, callback });
    }
  };
  const react = {
    createContext: (value) => ({ value, Provider: {} }),
    createElement(_type, props) { provided = props.value; return null; },
    useContext: (context) => context.value,
    useEffect: effectHook,
    useLayoutEffect: effectHook,
    useMemo(factory, deps) {
      const index = cursor++;
      if (depsChanged(hooks[index]?.deps, deps)) hooks[index] = { deps, value: factory() };
      return hooks[index].value;
    },
    useRef(current) {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { current };
      return hooks[index];
    },
    useState(initial) {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { value: typeof initial === 'function' ? initial() : initial };
      const slot = hooks[index];
      return [slot.value, (next) => {
        const value = typeof next === 'function' ? next(slot.value) : next;
        if (!Object.is(slot.value, value)) { slot.value = value; dirty = true; }
      }];
    },
    useSyncExternalStore: (_subscribe, getSnapshot) => getSnapshot(),
  };
  const graph = load(compiled[version].graph, {}, globals);
  graph.GRAPH_SECTION_IDS.forEach((id, index) => offsets.set(id, index * 1500 + index * index * 4));
  const provider = load(compiled[version].provider, {
    react,
    'react-router-dom': { useLocation: () => ({ pathname }) },
    '@/components/Boot': { useBooted: () => booted },
    '@/three/journeyGraph': graph,
    '@/lib/scrollProgressStore': load(compiled.store),
  }, globals);

  function render() {
    let turns = 0;
    do {
      assert.ok(turns++ < 10, 'Hook harness render loop did not settle');
      dirty = false;
      cursor = 0;
      effects = [];
      provider.ScrollProgressProvider({ children: null });
      const changed = effects;
      // React cleans old effects before installing replacement effects.
      for (const { index } of changed) hooks[index].cleanup?.();
      for (const { index, callback } of changed) hooks[index].cleanup = callback();
    } while (dirty);
  }
  const snapshot = () => version === 'current' ? provided.getSnapshot() : provided;
  const dispatch = (name) => { for (const callback of listeners.get(name) ?? []) callback(); };
  render();
  return {
    pending, timers, listeners, graph,
    get store() { return version === 'current' ? provided : undefined; },
    snapshot,
    scroll(y, { fallback = false } = {}) {
      win.scrollY = fallback ? 0 : y;
      doc.documentElement.scrollTop = y;
      dispatch('scroll');
    },
    resize(height, docHeight = doc.documentElement.scrollHeight) {
      win.innerHeight = height;
      doc.documentElement.scrollHeight = doc.body.scrollHeight = docHeight;
      dispatch('resize');
    },
    route(path, y = 0) {
      pathname = path;
      win.scrollY = doc.documentElement.scrollTop = y;
      render();
    },
    boot(value) { booted = value; render(); },
    frame() {
      now += 1000 / 60;
      for (const [id, timer] of [...timers]) {
        if (timer.due <= now) { timers.delete(id); timer.callback(); }
      }
      const callbacks = [...pending.values()];
      pending.clear();
      for (const callback of callbacks) callback(now);
      if (dirty) render();
    },
    cleanup() {
      for (const hook of hooks) hook.cleanup?.();
    },
  };
}

function pair(options) {
  const baseline = providerHarness('baseline', options);
  const current = providerHarness('current', options);
  let frameIndex = 0;
  const equal = () => {
    const a = baseline.snapshot();
    const b = current.snapshot();
    for (const field of ['progress', 'y', 'journey', 'section', 'sectionIndex', 'sectionLocal', 'mode']) {
      assert.ok(Object.is(a[field], b[field]), `frame ${frameIndex}: ${field}: ${a[field]} !== ${b[field]}`);
    }
    assert.deepEqual(Array.from(b.nodes, (node) => node.id), Array.from(a.nodes, (node) => node.id));
    assert.equal(b.nodes, current.graph.nodesForMode(b.mode), 'Topology retains canonical node-array identity');
  };
  equal();
  return {
    baseline, current, equal,
    both(method, ...args) { baseline[method](...args); current[method](...args); },
    frames(count) {
      for (let i = 0; i < count; i++) {
        baseline.frame(); current.frame(); frameIndex += 1;
        equal();
        assert.ok(current.pending.size <= 1, 'Only one smoothing RAF may be pending');
      }
    },
    cleanup() { baseline.cleanup(); current.cleanup(); },
  };
}

test('scroll and resize trajectories match the actual c1cfd41 provider exactly', () => {
  const app = pair();
  // Several events before the initial RAF must still leave only one owner,
  // including when the pending frame has ID zero.
  for (const y of [12, 90, 250]) app.both('scroll', y);
  assert.equal(app.current.pending.size, 1);
  app.frames(45);
  for (const y of [0, 24, 580, 2600, 7300, 12100, 4500, 1200]) {
    app.both('scroll', y);
    app.frames(37);
  }
  app.both('resize', 720, 18000);
  app.frames(61);
  app.both('scroll', 3100, { fallback: true });
  app.frames(43);
  app.both('resize', 1000, 16500);
  app.frames(55);
  app.cleanup();
});

test('route resets, home/case-study topology, and end snap preserve baseline outputs', () => {
  const app = pair();
  const stableStore = app.current.store;
  app.both('scroll', 8400);
  app.frames(20);
  app.both('route', '/work/bidstream-ai', 1800);
  app.equal();
  assert.equal(app.current.snapshot().journey, 0);
  assert.equal(app.current.snapshot().mode, 'case-study');
  assert.equal(app.current.snapshot().nodes.length, 3);
  app.frames(80);
  app.both('resize', 900, 6000);
  app.both('scroll', 5100 * 0.996);
  app.frames(1);
  assert.equal(app.current.snapshot().journey, 1);
  app.frames(70);
  // A route change within the same topology must still reset the trajectory.
  app.both('route', '/work/grantflow', 350);
  app.equal();
  assert.equal(app.current.snapshot().journey, 0);
  app.frames(35);
  app.both('resize', 900, 17000);
  app.both('route', '/', 0);
  app.equal();
  assert.equal(app.current.snapshot().nodes.length, 10);
  assert.equal(app.current.store, stableStore, 'Provider store identity survives route changes');
  app.frames(80);
  app.both('scroll', 16100 * 0.996);
  app.frames(1);
  assert.equal(app.current.snapshot().journey, 1);
  app.cleanup();
});

test('exact numerical settling sleeps, scroll/resize wake it, and cleanup releases work', () => {
  const app = pair();
  app.both('scroll', 3210);
  let frames = 0;
  while ((app.current.pending.size || app.current.timers.size) && frames < 3000) {
    app.frames(1); frames += 1;
  }
  assert.ok(frames > 100, 'Retain the full original smoothing tail');
  assert.ok(frames < 3000, 'The unchanged numerical state eventually sleeps');
  assert.equal(app.current.pending.size, 0);
  assert.equal(app.baseline.pending.size, 1, 'Baseline continues publishing while idle');
  const settled = app.current.snapshot();
  let notifications = 0;
  const unsubscribe = app.current.store.subscribe(() => { notifications += 1; });
  app.frames(120);
  assert.equal(app.current.snapshot(), settled);
  assert.equal(notifications, 0);

  app.both('scroll', 3210); // Unchanged measurement wakes one frame, then sleeps.
  assert.equal(app.current.pending.size, 1);
  app.frames(1);
  assert.equal(app.current.pending.size, 0);
  assert.equal(app.current.snapshot(), settled);
  app.both('scroll', 6500);
  assert.equal(app.current.pending.size, 1);
  app.frames(20);
  assert.ok(notifications > 0);
  app.both('resize', 780, 19000);
  app.frames(20);
  unsubscribe();

  const lateCallback = [...app.current.pending.values()][0];
  const finalSnapshot = app.current.snapshot();
  app.cleanup();
  for (const harness of [app.current, app.baseline]) {
    assert.equal(harness.pending.size, 0);
    assert.equal(harness.timers.size, 0);
    assert.equal(harness.listeners.size, 0);
  }
  lateCallback?.();
  assert.equal(app.current.snapshot(), finalSnapshot);
  assert.equal(app.current.pending.size, 0);
});

test('boot gate and effect teardown retain baseline behavior', () => {
  const app = pair({ booted: false });
  assert.equal(app.current.pending.size, 0);
  assert.equal(app.current.listeners.size, 0);
  app.frames(5);
  app.both('boot', true);
  app.frames(25);
  app.both('boot', false);
  for (const harness of [app.current, app.baseline]) {
    assert.equal(harness.pending.size, 0);
    assert.equal(harness.timers.size, 0);
    assert.equal(harness.listeners.size, 0);
  }
  app.frames(5);
  app.both('boot', true);
  app.frames(25);
  app.cleanup();
});

test('store snapshots and subscribers remain stable for no-op publications', () => {
  const { createScrollProgressStore } = load(compiled.store);
  const nodes = [{ id: 'a' }];
  const initial = { progress: 0, y: 0, section: 'home', journey: 0, sectionIndex: 0, sectionLocal: 0, mode: 'home', nodes };
  const store = createScrollProgressStore(initial);
  const ref = store.ref;
  const getSnapshot = store.getSnapshot;
  const subscribe = store.subscribe;
  let calls = 0;
  const seen = [];
  const listener = () => { calls += 1; seen.push(store.getSnapshot()); };
  const unsubscribe = store.subscribe(listener);
  assert.equal(store.publish({ ...initial }), false);
  assert.equal(calls, 0);
  assert.equal(store.getSnapshot(), initial);
  assert.equal(store.ref.current, initial);

  const updates = { progress: 0.4, y: 120, journey: 0.6, section: 'about', sectionIndex: 2, sectionLocal: 0.7, mode: 'case-study', nodes: [{ id: 'other' }] };
  for (const [field, value] of Object.entries(updates)) {
    const next = { ...store.getSnapshot(), [field]: value };
    assert.equal(store.publish(next), true, `${field} change must publish`);
    assert.equal(store.getSnapshot(), next);
    assert.equal(seen.at(-1), next, 'Subscribers read the new snapshot synchronously');
    assert.equal(store.publish({ ...next }), false);
  }
  assert.equal(calls, Object.keys(updates).length);
  assert.equal(store.ref, ref);
  assert.equal(store.getSnapshot, getSnapshot);
  assert.equal(store.subscribe, subscribe);
  unsubscribe();
  unsubscribe();
  store.publish({ ...store.getSnapshot(), y: 500 });
  assert.equal(calls, Object.keys(updates).length, 'Unsubscribed listeners receive no further calls');
});
