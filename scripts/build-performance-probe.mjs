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
  window.__portfolioCapture = new URLSearchParams(location.search).has('capture');
  let captureNext = false;
  const p = { active:false, counts:{}, callbackMs:0, gaps:[] };
  const contexts = [];
  const context = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(...args) {
    const gl = context.apply(this,args);
    if(gl && /^webgl2?$/.test(args[0]) && !contexts.some(c=>c.gl===gl)) {
      const buffers = new Map(); let bound = null;
      const bind = gl.bindRenderbuffer.bind(gl), storage = gl.renderbufferStorage.bind(gl), dispose = gl.deleteRenderbuffer.bind(gl);
      gl.bindRenderbuffer = (target,buffer) => { bound=buffer; return bind(target,buffer); };
      gl.renderbufferStorage = (target,format,width,height) => { buffers.set(bound,{format,width,height}); return storage(target,format,width,height); };
      gl.deleteRenderbuffer = buffer => { buffers.delete(buffer); return dispose(buffer); };
      if(window.__portfolioCapture) {
        const names=new WeakMap(), locate=gl.getUniformLocation.bind(gl), scalar=gl.uniform1f.bind(gl);
        gl.getUniformLocation=(program,name)=>{ const location=locate(program,name); if(location) names.set(location,name); return location; };
        gl.uniform1f=(location,value)=>scalar(location,/^(time|uTime)$/.test(names.get(location)) ? 15 : value);
      }
      contexts.push({gl,buffers});
    }
    return gl;
  };
  window.__portfolioCount = name => { if(p.active) p.counts[name]=(p.counts[name]||0)+1; };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = fn => raf(t => { const start=performance.now(); fn(t); if(p.active) p.callbackMs+=performance.now()-start; });
  const rect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function(...args) { window.__portfolioCount('layoutReads'); return rect.apply(this,args); };
  for (const Context of [window.WebGLRenderingContext, window.WebGL2RenderingContext].filter(Boolean)) {
    for (const name of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']) {
      const original=Context.prototype[name]; if(!original) continue;
      Context.prototype[name]=function(...args){
        window.__portfolioCount('gpuDraws'); const result=original.apply(this,args);
        if(captureNext && this.getParameter(this.FRAMEBUFFER_BINDING)===null) {
          captureNext=false; const width=this.drawingBufferWidth,height=this.drawingBufferHeight;
          const bytes=new Uint8Array(width*height*4); this.readPixels(0,0,width,height,this.RGBA,this.UNSIGNED_BYTE,bytes);
          crypto.subtle.digest('SHA-256',bytes).then(hash=>{
            document.querySelector('#profile-result').textContent=JSON.stringify({ref:${JSON.stringify(ref)},theme:document.documentElement.dataset.theme,width,height,sha256:[...new Uint8Array(hash)].map(n=>n.toString(16).padStart(2,'0')).join('')});
          });
        }
        return result;
      };
    }
  }
  addEventListener('DOMContentLoaded', () => {
    const panel=document.createElement('aside'); panel.id='performance-probe';
    panel.style.cssText='position:fixed;bottom:10px;left:10px;z-index:2147483647;background:#fff;color:#111;border:1px solid #777;padding:8px;font:12px monospace;max-width:380px';
    panel.innerHTML='<button id="profile-idle">Measure idle (4s)</button> <button id="profile-scroll">Measure scroll (4s)</button> <button id="profile-buffers">Inspect buffers</button> <button id="profile-capture">Hash frame</button><pre id="profile-result" style="max-height:180px;overflow:auto;margin:4px 0 0">Ready</pre>';
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
    document.querySelector('#profile-buffers').onclick=()=>{
      document.querySelector('#profile-result').textContent=JSON.stringify({ref:${JSON.stringify(ref)},viewport:[innerWidth,innerHeight,devicePixelRatio],contexts:contexts.filter(c=>!c.gl.isContextLost()).map(({gl,buffers})=>({size:[gl.drawingBufferWidth,gl.drawingBufferHeight],depth:gl.getContextAttributes().depth,renderbuffers:[...buffers.values()].map(b=>[b.format,b.width,b.height])}))});
    };
    document.querySelector('#profile-capture').onclick=()=>{ document.querySelector('#profile-result').textContent=window.__portfolioCapture?'Reading next frame':'Reload with &capture for deterministic visual comparison (not timing)'; captureNext=!!window.__portfolioCapture; };
  });
}
`;
await build({root,logLevel:'warn',build:{outDir},plugins:[{
 name:'local-performance-probe',enforce:'pre',
 transform(source,id){
   const file=path.relative(root,id).split(path.sep).join('/');
   if(!file.startsWith('src/') || !/\.tsx?$/.test(file)) return;
   let code=sources.get(file)??source;
   if(file.startsWith('src/three/')) {
     code=code.replaceAll('state.clock.elapsedTime','(window.__portfolioCapture ? 15 : state.clock.elapsedTime)');
     if(file.endsWith('DustField.tsx')) {
       code=code.replace('const positions = new Float32Array(count * 3);', 'let seed=123; const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}; const positions = new Float32Array(count * 3);');
       code=code.replaceAll('Math.random()', '(window.__portfolioCapture ? random() : Math.random())');
       code=code.replace('useFrame((_, delta) => {', 'useFrame((_, delta) => { if(window.__portfolioCapture) delta=0;');
     }
     if(file.endsWith('FluidField.tsx')) code=code.replace('useFrame((state, delta) => {', 'useFrame((state, delta) => { if(window.__portfolioCapture) delta=0;');
     if(file.endsWith('CameraRig.tsx')) code=code.replace('useFrame((_, delta) => {', 'useFrame((_, delta) => { if(window.__portfolioCapture) delta=1;');
   }
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
