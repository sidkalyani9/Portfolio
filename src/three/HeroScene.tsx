import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function AgentGraph({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo(
    () => [
      new THREE.Vector3(-1.4, 0.6, 0),
      new THREE.Vector3(-0.2, 1.1, 0.3),
      new THREE.Vector3(1.1, 0.5, -0.2),
      new THREE.Vector3(0.3, -0.5, 0.5),
      new THREE.Vector3(-0.9, -0.7, -0.3),
      new THREE.Vector3(1.5, -0.3, 0.4),
    ],
    [],
  );

  const edges = useMemo(
    () => [
      [0, 1],
      [1, 2],
      [1, 3],
      [0, 4],
      [3, 5],
      [2, 5],
      [4, 3],
    ],
    [],
  );

  useFrame((state) => {
    if (!group.current || !animate) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.12;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.08;
  });

  return (
    <group ref={group}>
      {edges.map(([a, b], i) => (
        <Line
          key={i}
          points={[nodes[a], nodes[b]]}
          color="#2ee6a6"
          lineWidth={1}
          transparent
          opacity={0.35}
        />
      ))}
      {nodes.map((pos, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
          <mesh position={pos}>
            <icosahedronGeometry args={[0.14 + (i % 3) * 0.02, 0]} />
            <meshStandardMaterial
              color={i === 1 ? "#7c5cff" : "#2ee6a6"}
              emissive={i === 1 ? "#7c5cff" : "#2ee6a6"}
              emissiveIntensity={0.35}
              roughness={0.35}
              metalness={0.2}
            />
          </mesh>
        </Float>
      ))}
      <mesh>
        <torusGeometry args={[1.8, 0.008, 12, 100]} />
        <meshBasicMaterial color="#2ee6a6" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function FrameController({ active }: { active: boolean }) {
  const { invalidate, setFrameloop } = useThree();
  useEffect(() => {
    setFrameloop(active ? "always" : "demand");
    if (active) invalidate();
  }, [active, invalidate, setFrameloop]);
  return null;
}

export function HeroScene() {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
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
    <div ref={wrapRef} className="absolute inset-0 -z-0 opacity-80" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={animate ? "always" : "demand"}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <FrameController active={animate} />
        <ambientLight intensity={0.55} />
        <pointLight position={[3, 2, 4]} intensity={1.2} color="#2ee6a6" />
        <pointLight position={[-3, -1, 2]} intensity={0.6} color="#7c5cff" />
        <AgentGraph animate={animate} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg-0 via-bg-0/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-0 via-transparent to-bg-0/50" />
    </div>
  );
}
