import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const file = 'src/sections/HeroSection.tsx';
const before = execFileSync('git', ['show', `1e7e31a:${file}`], { encoding: 'utf8' });
const after = readFileSync(file, 'utf8');

function mount(source, initialProgress = 0) {
  let callback;
  let writes = 0;
  const style = new Proxy({}, { set(target, key, value) { target[key] = String(value); writes++; return true; } });
  const element = { style };
  const scroll = { current: { progress: initialProgress, nodes: [], journey: 0 } };
  const jsx = (type, props) => {
    if (props.ref) { props.ref.current = element; Object.assign(style, props.style); }
    return { type, props };
  };
  const mocks = {
    react: { useRef: current => ({ current }) },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    '@/hooks/useScrollProgress': {
      useScrollProgressRef: () => scroll,
      useScrollProgressEffect: fn => { callback = fn; },
      useScrollProgressSelector: fn => fn(scroll.current),
    },
    '@/hooks/useResumeHref': { useResumeHref: () => ({ href: '/resume.pdf', label: 'Resume' }) },
    '@/components/Boot': { useBooted: () => true, useIntroControls: () => ({ introVisible: false, titleInIntro: false }) },
    '@/components/SmoothScroll': { useScrollTo: () => ({ scrollToId() {} }) },
    '@/three/journeyGraph': { activeIndexFromJourney: () => 0 },
    '@/content/profile': { profile: { location: 'Ahmedabad' } },
  };
  const module = { exports: {} };
  runInNewContext(ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText, {
    module, exports: module.exports,
    require: name => mocks[name] ?? new Proxy({}, { get: (_, key) => key }),
  });
  module.exports.HeroSection();
  writes = 0;
  return { style, update(progress) { callback({ progress }); }, get writes() { return writes; } };
}

test('hero parallax retains exact styles while skipping saturated and duplicate writes', () => {
  for (const initialProgress of [0, 0.1, 0.3, 1]) {
    const original = mount(before, initialProgress);
    const optimized = mount(after, initialProgress);
    assert.deepEqual({ ...optimized.style }, { ...original.style });
    const samples = [initialProgress, ...Array.from({ length: 1001 }, (_, i) => i / 1000), 0.25, 7 / 24];
    samples.push(...samples.slice().reverse());
    for (const progress of samples) {
      original.update(progress); optimized.update(progress);
      assert.deepEqual({ ...optimized.style }, { ...original.style });
    }
    assert.ok(optimized.writes < original.writes * 0.35);
    optimized.update(1);
    const settledWrites = optimized.writes;
    for (let i = 0; i < 100; i++) optimized.update(0.3 + i / 150);
    assert.equal(optimized.writes, settledWrites);
  }
});
