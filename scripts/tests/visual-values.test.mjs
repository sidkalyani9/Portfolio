import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));
const file = 'src/components/CinematicFallback.tsx';
const original = execFileSync('git', ['show', `c1cfd41:${file}`], { cwd: root, encoding: 'utf8' });
const current = readFileSync(new URL(file, `file://${root}`), 'utf8');

function harness(source) {
  let theme;
  let value;
  let update;
  const element = { style: {} };
  const jsx = (type, props) => {
    if (props.ref) props.ref.current = element;
    return { type, props };
  };
  const imports = {
    react: { useRef: (current) => ({ current }) },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    '@/components/ThemeProvider': { useTheme: () => ({ theme }) },
    '@/hooks/useScrollProgress': {
      useScrollProgress: () => value,
      useScrollProgressRef: () => ({ current: value }),
      useScrollProgressEffect: (callback) => { update = callback; },
    },
  };
  const module = { exports: {} };
  runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, {
    module, exports: module.exports,
    require(name) { assert.ok(name in imports, name); return imports[name]; },
  });
  return {
    render(nextTheme, nextValue) {
      theme = nextTheme; value = nextValue;
      return module.exports.CinematicFallback().props.children[0].props.style;
    },
    update(nextValue) { update(nextValue); return element.style; },
  };
}

test('both atmosphere palettes retain the exact original CSS at every sampled scroll position', () => {
  const before = harness(original);
  const after = harness(current);
  for (const theme of ['dark', 'light']) {
    for (const mode of ['home', 'case-study']) {
      for (const section of ['home', 'about', 'pipeline', 'systems', 'contact']) {
        const start = { progress: 0, mode, section };
        assert.deepEqual({ ...after.render(theme, start) }, { ...before.render(theme, start) });
        for (let i = 0; i <= 100; i++) {
          const value = { progress: i / 100, mode, section };
          assert.deepEqual({ ...after.update(value) }, { ...before.render(theme, value) });
        }
      }
    }
  }
});

test('gas shaders, dust, stylesheet and motion constants remain unchanged', () => {
  for (const path of ['src/three/DustField.tsx', 'src/three/journeyGraph.ts', 'src/index.css', 'src/lib/motion.ts']) {
    assert.equal(readFileSync(new URL(path, `file://${root}`), 'utf8'), execFileSync('git', ['show', `c1cfd41:${path}`], { cwd: root, encoding: 'utf8' }), path);
  }
  const path = 'src/three/FluidField.tsx';
  const shaders = (source) => [...source.matchAll(/const (?:VERT|FRAG) = \/\* glsl \*\/ `([\s\S]*?)`;/g)].map((match) => match[1]);
  const before = shaders(execFileSync('git', ['show', `c1cfd41:${path}`], { cwd: root, encoding: 'utf8' }));
  assert.equal(before.length, 2);
  assert.deepEqual(shaders(readFileSync(new URL(path, `file://${root}`), 'utf8')), before);
});
