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

    // Pigment suspended in white, rather than light added to a dark field.
    // Keep the left reading area quiet; concentrate the gas to the right.
    vec3 paper = vec3(1.0);
    vec3 lilac = vec3(0.58, 0.3, 0.82);
    vec3 violet = vec3(0.46, 0.23, 0.72);
    float spread = mix(0.16, 1.0, smoothstep(-0.65, 0.65, p.x));
    float edge = 1.0 - smoothstep(0.65, 1.7, length(p * vec2(0.75, 0.9)));
    float body = smoothstep(0.28, 0.76, f);
    float folds = smoothstep(0.38, 0.82, r.x);
    float density = (body * 0.72 + folds * 0.28) * spread * edge * uIntensity;
    vec3 col = mix(paper, lilac, density);

    float fil = pow(smoothstep(0.48, 0.84, f), 2.0);
    col = mix(col, violet, fil * 0.15 * spread * edge * uIntensity);

    // Stationary, almost imperceptible texture avoids sparkling on white.
    col -= hash(gl_FragCoord.xy) * 0.003 * density;

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
