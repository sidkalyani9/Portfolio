import{r as l,j as u,C as y,u as M,V as d,a as w,b as R,L as x}from"./three-DthGHSTo.js";import{u as b,a as k}from"./index-TLmOxgM7.js";import"./motion-CuvA2zXY.js";const C=" ·:=~+x%#@01{}",E=`
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,T=`
  precision highp float;

  uniform sampler2D uAtlas;
  uniform vec2 uRes;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseV;
  uniform float uCell;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 cell = floor(frag / uCell);
    vec2 uv = fract(frag / uCell);

    // slow flow field
    float t = uTime * 0.055;
    float n = fbm(cell * 0.052 + vec2(t, -t * 0.7));
    n = n * 0.78 + 0.18 * noise(cell * 0.19 - t);

    // cursor: the field bends toward the pointer
    float d = distance(frag, uMouse);
    float bump = smoothstep(250.0, 0.0, d);
    n += bump * (0.42 + uMouseV * 0.55);

    // sparse shimmer — cells re-roll like a live stream
    float shimmer = hash(cell + floor(uTime * 2.5) * 0.317);
    n += (shimmer - 0.5) * 0.07;

    n = clamp(n, 0.0, 0.999);

    // pick a glyph by density from the 16-slot atlas row
    float g = floor(n * 16.0);
    vec2 auv = vec2((g + uv.x) / 16.0, uv.y);
    float a = texture2D(uAtlas, auv).a;

    vec3 dim = vec3(0.42, 0.41, 0.39);
    vec3 accent = vec3(0.18, 0.90, 0.65);
    vec3 ink = vec3(0.88, 0.11, 0.28);

    float bright = smoothstep(0.60, 0.95, n);
    vec3 col = mix(dim, accent, bright);

    // rare ink sparks — dropped packets in the stream
    float spark = step(0.9965, hash(cell + floor(uTime * 1.5) * 0.731));
    col = mix(col, ink, spark * 0.85);

    float alpha = a * mix(0.045, 0.8, smoothstep(0.10, 0.9, n));
    gl_FragColor = vec4(col, alpha);
  }
`;function j(){const t=document.createElement("canvas");t.width=768,t.height=48;const s=t.getContext("2d");s.clearRect(0,0,t.width,t.height),s.fillStyle="#ffffff",s.font=`500 ${Math.floor(48*.62)}px "IBM Plex Mono", monospace`,s.textAlign="center",s.textBaseline="middle",C.padEnd(16," ").slice(0,16).split("").forEach((m,n)=>{s.fillText(m,n*48+48/2,48/2+1)});const o=new R(t);return o.minFilter=x,o.magFilter=x,o.generateMipmaps=!1,o}function F(){const f=l.useRef(null),{gl:t,size:s}=M(),i=l.useRef({x:-9999,y:-9999,sx:-9999,sy:-9999,v:0}),o=l.useMemo(()=>j(),[]),m=l.useMemo(()=>({uAtlas:{value:o},uRes:{value:new d(1,1)},uTime:{value:0},uMouse:{value:new d(-9999,-9999)},uMouseV:{value:0},uCell:{value:16}}),[o]);return l.useEffect(()=>{const n=a=>{const c=t.domElement.getBoundingClientRect(),e=t.getPixelRatio();i.current.x=(a.clientX-c.left)*e,i.current.y=(c.height-(a.clientY-c.top))*e};return window.addEventListener("pointermove",n,{passive:!0}),()=>window.removeEventListener("pointermove",n)},[t]),w((n,a)=>{const r=f.current;if(!r)return;const c=t.getPixelRatio();r.uniforms.uRes.value.set(s.width*c,s.height*c),r.uniforms.uTime.value=n.clock.getElapsedTime(),r.uniforms.uCell.value=16*c;const e=i.current,v=1-Math.exp(-a*9);e.sx<-999&&(e.sx=e.x,e.sy=e.y);const p=e.x-e.sx,h=e.y-e.sy;e.sx+=p*v,e.sy+=h*v;const g=Math.hypot(p,h)/Math.max(a,.001);e.v+=(Math.min(g/2400,1)-e.v)*.08,r.uniforms.uMouse.value.set(e.sx,e.sy),r.uniforms.uMouseV.value=e.v}),u.jsxs("mesh",{frustumCulled:!1,children:[u.jsx("planeGeometry",{args:[2,2]}),u.jsx("shaderMaterial",{ref:f,vertexShader:E,fragmentShader:T,uniforms:m,transparent:!0,depthWrite:!1,depthTest:!1})]})}function S({className:f=""}){const t=b(),s=k("(min-width: 768px)"),i=l.useRef(null),[o,m]=l.useState(!0);return l.useEffect(()=>{const n=i.current;if(!n)return;const a=new IntersectionObserver(([r])=>m(r.isIntersecting),{rootMargin:"80px"});return a.observe(n),()=>a.disconnect()},[]),t||!s?null:u.jsx("div",{ref:i,className:f,"aria-hidden":!0,children:o?u.jsx(y,{gl:{alpha:!0,antialias:!1,powerPreference:"high-performance"},dpr:[1,1.5],frameloop:"always",camera:{position:[0,0,1]},style:{background:"transparent"},eventSource:typeof document<"u"?document.documentElement:void 0,eventPrefix:"client",children:u.jsx(F,{})}):null})}export{S as GlyphField};
