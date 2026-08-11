import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uProgress;
  uniform float uIntensity;

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
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
    float t = uTime * 0.08;

    p += vec2(uProgress * 0.55, -uProgress * 0.35);

    vec2 m = (uMouse - 0.5 * uRes) / min(uRes.x, uRes.y);
    float md = length(p - m);
    p += normalize(p - m + 0.0001) * exp(-md * 2.4) * 0.12 * uIntensity;

    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t * 0.7));
    vec2 r = vec2(
      fbm(p + 1.8 * q + vec2(1.7, 9.2) + t * 0.3),
      fbm(p + 1.8 * q + vec2(8.3, 2.8) - t * 0.25)
    );
    float f = fbm(p + 2.4 * r);

    vec3 cDeep = vec3(0.039, 0.027, 0.071);
    vec3 cMid  = vec3(0.07, 0.047, 0.11);
    vec3 cLilac = vec3(0.78, 0.49, 1.0);
    vec3 cVio  = vec3(0.545, 0.361, 0.965);
    vec3 cInk  = vec3(0.91, 0.63, 0.75);

    float bands = smoothstep(0.15, 0.75, f);
    vec3 col = mix(cDeep, cMid, bands);
    col = mix(col, cLilac * 0.55, smoothstep(0.45, 0.9, r.x) * 0.55);
    col = mix(col, cVio * 0.5, smoothstep(0.4, 0.95, r.y) * 0.4 * (0.4 + uProgress));

    float fil = pow(smoothstep(0.55, 0.95, f), 3.0);
    col += cLilac * fil * 0.35;
    col += cInk * pow(smoothstep(0.82, 1.0, noise(r * 4.0 + t)), 8.0) * 0.45;

    float vig = smoothstep(1.25, 0.25, length(p * vec2(0.85, 1.0)));
    col *= mix(0.45, 1.0, vig);

    float g = hash(gl_FragCoord.xy + floor(uTime * 20.0)) * 0.035;
    col += g;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * Full-viewport fluid gradient field — atmospheric base of Option C.
 */
export function FluidField({
  intensity = 1,
  progress = 0,
}: {
  intensity?: number;
  progress?: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const mouse = useRef(new THREE.Vector2(-9999, -9999));
  const mouseSm = useRef(new THREE.Vector2(-9999, -9999));
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uProgress: { value: 0 },
      uIntensity: { value: intensity },
    }),
    [intensity],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      mouse.current.set(e.clientX * dpr, (window.innerHeight - e.clientY) * dpr);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uRes.value.set(size.width * dpr, size.height * dpr);
    m.uniforms.uIntensity.value = intensity;
    m.uniforms.uProgress.value = progressRef.current;

    const k = 1 - Math.exp(-delta * 6);
    mouseSm.current.lerp(mouse.current, k);
    (m.uniforms.uMouse.value as THREE.Vector2).copy(mouseSm.current);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
