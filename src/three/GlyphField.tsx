import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** Glyphs ordered by visual density — the ramp the field maps onto. */
const RAMP = " ·:=~+x%#@01{}";

const VERT = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
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
`;

function buildAtlas(): THREE.CanvasTexture {
  const cell = 48;
  const canvas = document.createElement("canvas");
  canvas.width = 16 * cell;
  canvas.height = cell;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = `500 ${Math.floor(cell * 0.62)}px "IBM Plex Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const chars = RAMP.padEnd(16, " ").slice(0, 16).split("");
  chars.forEach((ch, i) => {
    ctx.fillText(ch, i * cell + cell / 2, cell / 2 + 1);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

function GlyphScene() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { gl, size } = useThree();
  const mouse = useRef({ x: -9999, y: -9999, sx: -9999, sy: -9999, v: 0 });

  const atlas = useMemo(() => buildAtlas(), []);
  const uniforms = useMemo(
    () => ({
      uAtlas: { value: atlas },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uMouseV: { value: 0 },
      uCell: { value: 16 },
    }),
    [atlas],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const canvas = gl.domElement;
      const r = canvas.getBoundingClientRect();
      const dpr = gl.getPixelRatio();
      mouse.current.x = (e.clientX - r.left) * dpr;
      mouse.current.y = (r.height - (e.clientY - r.top)) * dpr;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl]);

  useFrame((state, delta) => {
    const m = matRef.current;
    if (!m) return;
    const dpr = gl.getPixelRatio();
    (m.uniforms.uRes.value as THREE.Vector2).set(
      size.width * dpr,
      size.height * dpr,
    );
    m.uniforms.uTime.value = state.clock.getElapsedTime();
    m.uniforms.uCell.value = 16 * dpr;

    // critically-damped mouse follow + velocity for the "wake"
    const cur = mouse.current;
    const k = 1 - Math.exp(-delta * 9);
    if (cur.sx < -999) {
      cur.sx = cur.x;
      cur.sy = cur.y;
    }
    const dx = cur.x - cur.sx;
    const dy = cur.y - cur.sy;
    cur.sx += dx * k;
    cur.sy += dy * k;
    const speed = Math.hypot(dx, dy) / Math.max(delta, 0.001);
    cur.v += (Math.min(speed / 2400, 1) - cur.v) * 0.08;

    (m.uniforms.uMouse.value as THREE.Vector2).set(cur.sx, cur.sy);
    m.uniforms.uMouseV.value = cur.v;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/**
 * The signature hero field — a stream of glyphs flowing through a noise
 * field, bending around the pointer. Desktop + full-motion only.
 */
export function GlyphField({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (reduced || !isDesktop) return null;

  return (
    <div ref={wrap} className={className} aria-hidden>
      {visible ? (
        <Canvas
          gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          frameloop="always"
          camera={{ position: [0, 0, 1] }}
          style={{ background: "transparent" }}
          eventSource={typeof document !== "undefined" ? document.documentElement : undefined}
          eventPrefix="client"
        >
          <GlyphScene />
        </Canvas>
      ) : null}
    </div>
  );
}
