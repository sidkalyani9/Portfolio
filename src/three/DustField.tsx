import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Normal blending preserves pigment on white; additive blending restores night glow.
 */
export function DustField({ count = 280 }: { count?: number }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      speeds[i] = 0.15 + Math.random() * 0.45;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta * 0.35;
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -4;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={dark ? 0.035 : 0.025}
        color={dark ? "#c77dff" : "#8850c7"}
        transparent
        opacity={dark ? 0.55 : 0.3}
        depthWrite={false}
        sizeAttenuation
        blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}
