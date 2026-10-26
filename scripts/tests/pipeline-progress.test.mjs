import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));
const file = 'src/sections/PipelineSection.tsx';
const original = execFileSync('git', ['show', `1e7e31a:${file}`], { cwd: root, encoding: 'utf8' });
const current = readFileSync(new URL(file, `file://${root}`), 'utf8');

function harness(source, { desktop = true, reduced = false } = {}) {
  const slots = [];
  const effects = [];
  const triggers = [];
  const listeners = new Map();
  const pending = new Map();
  let slot = 0;
  let dispatches = 0;
  let nextFrame = 0;
  let trackTop = 0;
  const jsx = (type, props) => ({ type, props });
  const track = { offsetHeight: 4800, getBoundingClientRect: () => ({ top: trackTop }) };
  const imports = {
    react: {
      useRef(value) {
        const i = slot++;
        return slots[i] ??= { current: value };
      },
      useState(initial) {
        const i = slot++;
        slots[i] ??= { value: typeof initial === 'function' ? initial() : initial };
        return [slots[i].value, (next) => {
          const value = typeof next === 'function' ? next(slots[i].value) : next;
          if (!Object.is(value, slots[i].value)) {
            slots[i].value = value;
            dispatches += 1;
          }
        }];
      },
      useCallback(callback, deps) {
        const i = slot++;
        if (!slots[i] || deps.some((value, j) => value !== slots[i].deps[j])) slots[i] = { callback, deps };
        return slots[i].callback;
      },
      useEffect(effect) { effects.push(effect); },
    },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    gsap: { default: { registerPlugin() {}, context(fn) { fn(); return { revert() {} }; } } },
    'gsap/ScrollTrigger': { ScrollTrigger: { create(options) { triggers.push(options); } } },
    'lucide-react': Object.fromEntries(['FileInput', 'ListTree', 'Network', 'FilePenLine', 'ShieldCheck', 'Gauge'].map((name) => [name, name])),
    '@/components/ui/SectionHeading': { SectionHeading: 'SectionHeading' },
    '@/hooks/usePrefersReducedMotion': { usePrefersReducedMotion: () => reduced },
    '@/hooks/useMediaQuery': { useMediaQuery: () => desktop },
    '@/hooks/useScrollProgress': { useScrollProgressSelector: (select) => select({ section: 'pipeline' }) },
    '@/lib/motion': { HEADER_OFFSET: 88 },
    '@/lib/cn': { cn: (...values) => values.filter(Boolean).join(' ') },
  };
  const module = { exports: {} };
  const exports = '\nexports.JourneyHud = JourneyHud; exports.MobileJourneyHud = MobileJourneyHud;'
    + (source.includes('function usePipelineProgress') ? '\nexports.usePipelineProgress = usePipelineProgress;' : '');
  runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText + exports, {
    module, exports: module.exports,
    require(name) { assert.ok(name in imports, name); return imports[name]; },
    window: {
      innerHeight: 800,
      addEventListener: (name, fn) => listeners.set(name, fn),
      removeEventListener: (name) => listeners.delete(name),
      setTimeout: () => 1,
      clearTimeout() {},
    },
    requestAnimationFrame(fn) { const id = nextFrame++; pending.set(id, fn); return id; },
    cancelAnimationFrame: (id) => pending.delete(id),
  });
  return {
    ...module.exports, triggers, listeners, pending, effects,
    get dispatches() { return dispatches; },
    hook() { slot = 0; return module.exports.usePipelineProgress(); },
    section() {
      slot = 0;
      const tree = module.exports.PipelineSection();
      walk(tree, (node) => { if (node.props.ref) node.props.ref.current = track; });
      return tree;
    },
    scroll(top) { trackTop = top; listeners.get('scroll')?.(); },
    frame() { const jobs = [...pending.values()]; pending.clear(); for (const job of jobs) job(); },
  };
}

function walk(node, visit) {
  if (Array.isArray(node)) { node.forEach((child) => walk(child, visit)); return; }
  if (!node || typeof node !== 'object') return;
  visit(node);
  walk(node.props.children, visit);
}

function textOf(node) {
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node == null || typeof node === 'boolean') return '';
  return typeof node === 'object' ? textOf(node.props.children) : String(node);
}

function bindRefs(tree) {
  walk(tree, (node) => {
    if (!node.props.ref) return;
    node.element = { style: { ...node.props.style }, textContent: textOf(node.props.children) };
    node.props.ref.current = node.element;
  });
  return tree;
}

// Ignore refs and an unstyled inline span around the desktop percentage. Keep
// every visible class, style, text, node order and accessibility attribute.
function snapshot(node) {
  if (Array.isArray(node)) {
    const values = node.flatMap((child) => {
      const normalized = snapshot(child);
      return Array.isArray(normalized) ? normalized : [normalized];
    }).filter((child) => child !== null);
    return values.reduce((out, child) => {
      if (typeof child === 'string' && typeof out.at(-1) === 'string') out[out.length - 1] += child;
      else out.push(child);
      return out;
    }, []);
  }
  if (node == null || typeof node === 'boolean') return null;
  if (typeof node !== 'object') return String(node);
  const { ref, children, ...props } = node.props;
  if (node.element && props.style) props.style = { ...node.element.style };
  const content = node.element && node.type === 'span' ? node.element.textContent : children;
  if (node.type === 'span' && !Object.keys(props).length) return snapshot([content]);
  return { type: node.type, props: JSON.parse(JSON.stringify(props)), children: snapshot([content]) };
}

const propsFor = (progress) => ({
  progress,
  packetPct: Math.min(100, progress * 100),
  activeIndex: Math.min(5, Math.floor(progress * (6 - 0.001))),
});

const samples = [...new Set([
  ...Array.from({ length: 1001 }, (_, i) => i / 1000),
  ...[0.01, 0.02, 0.98, ...Array.from({ length: 5 }, (_, i) => (i + 1) / (6 - 0.001))]
    .flatMap((value) => [value - Number.EPSILON, value, value + Number.EPSILON]),
])].sort((a, b) => a - b);

test('pipeline retains baseline text, nodes, classes and exact continuous styles in both directions', () => {
  for (const name of ['JourneyHud', 'MobileJourneyHud']) {
    const before = harness(original);
    const after = harness(current);
    let hook = after.hook();
    let tree = bindRefs(after[name]({ ...propsFor(hook.progress), elements: hook.elements }));
    let commits = after.dispatches;
    for (const progress of [...samples, ...samples.toReversed()]) {
      hook.setProgress(progress);
      if (after.dispatches !== commits) {
        hook = after.hook();
        tree = bindRefs(after[name]({ ...propsFor(hook.progress), elements: hook.elements }));
        commits = after.dispatches;
      }
      assert.deepEqual(snapshot(tree), snapshot(before[name](propsFor(progress))), `${name}, progress ${progress}`);
    }
    // A parent render between semantic boundaries must read the latest value.
    hook.setProgress(0.41321);
    hook = after.hook();
    tree = bindRefs(after[name]({ ...propsFor(hook.progress), elements: hook.elements }));
    assert.deepEqual(snapshot(tree), snapshot(before[name](propsFor(0.41321))));
  }
});

test('10,000 pipeline progress updates dispatch only the eight existing semantic transitions', () => {
  const app = harness(current);
  const hook = app.hook();
  for (let i = 1; i <= 10000; i++) hook.setProgress(i / 10000);
  assert.equal(app.dispatches, 8); // five node changes, .01, .02 and .98.
  for (let i = 0; i < 10000; i++) hook.setProgress(1);
  assert.equal(app.dispatches, 8);
});

test('desktop trigger timing, mobile measurement cadence and reduced-motion markup stay unchanged', () => {
  const before = harness(original);
  const after = harness(current);
  for (const app of [before, after]) {
    app.section();
    app.effects.forEach((effect) => effect());
  }
  const config = ({ trigger, onUpdate, ...rest }) => ({ ...rest });
  assert.deepEqual(config(after.triggers[0]), config(before.triggers[0]));
  assert.deepEqual(
    snapshot(after.JourneyHud({ ...propsFor(1), staticTimeline: true })),
    snapshot(before.JourneyHud({ ...propsFor(1), staticTimeline: true })),
  );
  const mobile = harness(current, { desktop: false });
  mobile.section();
  const cleanups = mobile.effects.map((effect) => effect()).filter(Boolean);
  assert.equal(mobile.triggers.length, 0);
  mobile.scroll(-2000);
  assert.equal(mobile.pending.size, 1);
  mobile.frame();
  const section = mobile.section();
  let hud;
  walk(section, (node) => { if (node.type === mobile.MobileJourneyHud) hud = node; });
  assert.equal(hud.props.progress, 0.5); // -top / (4800 - 800), unchanged.
  assert.equal(mobile.pending.size, 0);
  mobile.scroll(-2200);
  cleanups.forEach((cleanup) => cleanup());
  assert.equal(mobile.pending.size, 0);
  assert.equal(mobile.listeners.size, 0);
  const reduced = harness(current, { reduced: true });
  reduced.section();
  reduced.effects.forEach((effect) => effect());
  assert.equal(reduced.triggers.length, 0);
  assert.equal(reduced.pending.size, 0);
  assert.equal(reduced.listeners.size, 0);
});
