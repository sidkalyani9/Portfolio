import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Concept E micro-3D: single agent-atom, no post stack, idle only */
function Atom({ animate }: { animate: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.35;
      mesh.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.25;
      ring.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial
          color="#c77dff"
          emissive="#c77dff"
          emissiveIntensity={0.28}
          roughness={0.28}
          metalness={0.35}
          flatShading
        />
      </mesh>
      <mesh ref={ring} scale={1.15}>
        <torusGeometry args={[0.95, 0.012, 8, 64]} />
        <meshBasicMaterial color="#e8a0bf" transparent opacity={0.45} />
      </mesh>
      <mesh scale={1.35}>
        <torusGeometry args={[0.95, 0.006, 8, 64]} />
        <meshBasicMaterial color="#c77dff" transparent opacity={0.15} />
      </mesh>
      <pointLight position={[2, 1, 2]} intensity={1.1} color="#c77dff" />
      <pointLight position={[-1.5, -1, 1]} intensity={0.4} color="#e8a0bf" />
      <ambientLight intensity={0.45} />
    </group>
  );
}

export function MicroOrb({ className = "" }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const animate = !reduced && visible && pageVisible;

  return (
    <div
      ref={wrap}
      className={className}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={animate ? "always" : "demand"}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Atom animate={animate} />
      </Canvas>
    </div>
  );
}
