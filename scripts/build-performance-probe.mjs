/** Local-only production instrumentation; never imported by the website.
 * node scripts/build-performance-probe.mjs [git-ref|working] [output-dir]
 * Serve the output, then open /?profile to use the measurement controls.
 */
import { build } from 'vite';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const ref = process.argv[2] ?? 'working';
const outDir = process.argv[3] ?? '/tmp/portfolio-performance-probe';
const sources = new Map();
if (ref !== 'working') {
  for (const file of execFileSync('git', ['ls-tree', '-r', '--name-only', ref, 'src'], {cwd:root,encoding:'utf8'}).trim().split('\n')) {
    sources.set(file, execFileSync('git',['show',`${ref}:${file}`],{cwd:root,encoding:'utf8'}));
  }
}
const markers = {
  'src/hooks/useScrollProgress.ts': ['ScrollProgressProvider', '  const booted = useBooted();'],
  'src/sections/HeroSection.tsx': ['HeroSection', '  const resume = useResumeHref();'],
  'src/sections/PipelineSection.tsx': ['PipelineSection', '  const reduced = usePrefersReducedMotion();'],
  'src/components/MobileWorld.tsx': ['MobileWorld', '  const { theme } = useTheme();'],
  'src/components/CinematicFallback.tsx': ['CinematicFallback', '  const { theme } = useTheme();'],
  'src/components/SectionRail.tsx': ['SectionRail', '  const { introVisible } = useIntroControls();'],
  'src/three/CinematicWorld.tsx': ['SceneBridge', '  const { theme } = useTheme();'],
  'src/three/NodeConstellation.tsx': ['NodeMesh', '  const { theme } = useTheme();'],
};
const probe = `
if (new URLSearchParams(location.search).has('profile')) {
  const p = { active:false, counts:{}, callbackMs:0, gaps:[] };
  window.__portfolioCount = name => { if(p.active) p.counts[name]=(p.counts[name]||0)+1; };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = fn => raf(t => { const start=performance.now(); fn(t); if(p.active) p.callbackMs+=performance.now()-start; });
  const rect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function(...args) { window.__portfolioCount('layoutReads'); return rect.apply(this,args); };
  for (const Context of [window.WebGLRenderingContext, window.WebGL2RenderingContext].filter(Boolean)) {
    for (const name of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']) {
      const original=Context.prototype[name]; if(!original) continue;
      Context.prototype[name]=function(...args){ window.__portfolioCount('gpuDraws'); return original.apply(this,args); };
    }
  }
  addEventListener('DOMContentLoaded', () => {
    const panel=document.createElement('aside'); panel.id='performance-probe';
    panel.style.cssText='position:fixed;bottom:10px;left:10px;z-index:2147483647;background:#fff;color:#111;border:1px solid #777;padding:8px;font:12px monospace;max-width:380px';
    panel.innerHTML='<button id="profile-idle">Measure idle (4s)</button> <button id="profile-scroll">Measure scroll (4s)</button><pre id="profile-result" style="max-height:180px;overflow:auto;margin:4px 0 0">Ready</pre>';
    document.body.append(panel);
    function run(scroll) {
      if(p.active) return;
      p.counts={};p.callbackMs=0;p.gaps=[];p.active=true;
      const start=performance.now();let last=start;const from=scrollY;
      const output=document.querySelector('#profile-result');output.textContent='Measuring';
      function frame(now) {
        p.gaps.push(now-last);last=now;
        if(scroll) window.scrollTo(0,from+Math.min(1,(now-start)/4000)*1200);
        if(now-start<4000) raf(frame);
        else {
          p.active=false;const gaps=p.gaps.slice(1).sort((a,b)=>a-b);
          const result={ref:${JSON.stringify(ref)},theme:document.documentElement.dataset.theme,scenario:scroll?'scroll':'idle',width:innerWidth,height:innerHeight,durationMs:Math.round(now-start),frames:p.gaps.length,frameMedianMs:gaps[Math.floor(gaps.length/2)],frameP95Ms:gaps[Math.floor(gaps.length*.95)],longFrames:gaps.filter(n=>n>50).length,rafCallbackMs:Math.round(p.callbackMs*10)/10,counts:p.counts};
          output.textContent=JSON.stringify(result,null,2);console.info('PORTFOLIO_PROFILE '+JSON.stringify(result));
        }
      } raf(frame);
    }
    document.querySelector('#profile-idle').onclick=()=>run(false);
    document.querySelector('#profile-scroll').onclick=()=>run(true);
  });
}
`;
await build({root,logLevel:'warn',build:{outDir},plugins:[{
 name:'local-performance-probe',enforce:'pre',
 transform(source,id){
   const file=path.relative(root,id).split(path.sep).join('/');
   if(!file.startsWith('src/') || !/\.tsx?$/.test(file)) return;
   let code=sources.get(file)??source;
   const marker=markers[file];
   if(marker) {
     if(!code.includes(marker[1])) throw new Error(`Missing instrumentation anchor: ${file}`);
     code=code.replace(marker[1],`  window.__portfolioCount?.('${marker[0]}');\n${marker[1]}`);
   }
   return {code,map:null};
 },
 transformIndexHtml:{order:'pre',handler:html=>html.replace('<head>','<head><script>'+probe+'</script>')},
}]});
console.log(`Profile build ${ref}: ${outDir}`);
