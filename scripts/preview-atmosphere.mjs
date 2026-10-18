/**
 * Local visual comparison only. Builds the accepted gas and the current trial
 * at the same atmosphere time without changing source files or production UI.
 * Run: node scripts/preview-atmosphere.mjs [baseline-ref] [time-in-seconds]
 * Baseline: http://127.0.0.1:4174/  Trial: http://127.0.0.1:4175/
 */
import { execFileSync } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build, preview } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const baseline = process.argv[2] ?? "d0ee45d";
const time = Number(process.argv[3] ?? 24);
if (!Number.isFinite(time) || time < 0) throw new Error("Use a non-negative atmosphere time.");
const output = await mkdtemp(path.join(tmpdir(), "portfolio-atmosphere-review-"));
const atmosphereFiles = [
  "src/three/FluidField.tsx",
  "src/components/CinematicFallback.tsx",
  "src/components/MobileWorld.tsx",
];
const oldSources = new Map(atmosphereFiles.map((file) => [
  file, execFileSync("git", ["show", `${baseline}:${file}`], { cwd: root, encoding: "utf8" }),
]));

for (const [index, variant] of ["baseline", "trial"].entries()) {
  const outDir = path.join(output, variant);
  await build({
    root,
    logLevel: "warn",
    plugins: [{
      name: "local-atmosphere-comparison",
      enforce: "pre",
      transform(source, id) {
        const file = path.relative(root, id).split(path.sep).join("/");
        if (!atmosphereFiles.includes(file)) return;
        let code = variant === "baseline" ? oldSources.get(file) : source;
        if (file === "src/three/FluidField.tsx") {
          code = code.replace("state.clock.elapsedTime", String(time));
        }
        return { code, map: null };
      },
      transformIndexHtml(html) {
        return html.replace('let theme = "dark";', 'let theme = "light";');
      },
    }],
    build: { outDir },
  });
  await preview({ root, build: { outDir }, preview: { host: "127.0.0.1", port: 4174 + index, strictPort: true } });
  console.log(`${variant}: http://127.0.0.1:${4174 + index}/ (gas time ${time}s)`);
}
