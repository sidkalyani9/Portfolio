import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html, Line } from "@react-three/drei";

export type JourneyNode = {
  id: string;
  label: string;
  sub: string;
  position: [number, number, number];
};

export const JOURNEY_NODES: JourneyNode[] = [
  { id: "intake", label: "intake", sub: "multimodal", position: [-4.2, 0.6, -1.2] },
  { id: "planner", label: "planner", sub: "decompose", position: [-2.4, 1.4, 0.4] },
  { id: "retriever", label: "retriever", sub: "GraphRAG", position: [-0.4, 0.2, 1.6] },
  { id: "writer", label: "writer", sub: "grounded", position: [1.6, 1.1, 0.2] },
  { id: "reviewer", label: "reviewer", sub: "persona", position: [3.4, 0.3, -0.8] },
  { id: "score", label: "score", sub: "matrix", position: [5.0, 1.0, 0.6] },
];

function NodeMesh({
  node,
  index,
  active,
  passed,
}: {
  node: JourneyNode;
  index: number;
  active: boolean;
  passed: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 1.2 + index * 0.9) * 0.06;
    ref.current.position.y = node.position[1] + bob;
    if (glow.current) {
      glow.current.position.copy(ref.current.position);
      const s = active ? 1.35 + Math.sin(t * 4) * 0.08 : passed ? 1.05 : 0.85;
      glow.current.scale.setScalar(s);
    }
  });

  const color = active ? "#2ee6a6" : passed ? "#7c5cff" : "#3a3f4d";
  const emissive = active ? "#2ee6a6" : passed ? "#7c5cff" : "#111318";

  return (
    <group>
      <mesh ref={glow} position={node.position}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.18 : passed ? 0.08 : 0.03}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ref} position={node.position}>
        <icosahedronGeometry args={[0.22, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={active ? 1.6 : passed ? 0.55 : 0.12}
          roughness={0.35}
          metalness={0.45}
        />
      </mesh>
      {active ? (
        <Html
          position={[node.position[0], node.position[1] + 0.55, node.position[2]]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none", userSelect: "none" }}
          zIndexRange={[10, 0]}
        >
          <div
            className="whitespace-nowrap font-mono text-[10px] tracking-wide"
            style={{
              color: "#2ee6a6",
              textShadow: "0 2px 12px rgba(0,0,0,0.85)",
            }}
          >
            {node.label}
            <span style={{ opacity: 0.55 }}> · {node.sub}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Edges({ activeFloat }: { activeFloat: number }) {
  const points = useMemo(
    () => JOURNEY_NODES.map((n) => n.position as [number, number, number]),
    [],
  );
  const packet = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!packet.current) return;
    const n = JOURNEY_NODES.length - 1;
    const t = Math.min(1, Math.max(0, activeFloat / n));
    const f = t * n;
    const i = Math.min(n - 1, Math.floor(f));
    const local = f - i;
    const a = JOURNEY_NODES[i].position;
    const b = JOURNEY_NODES[i + 1].position;
    packet.current.position.set(
      a[0] + (b[0] - a[0]) * local,
      a[1] + (b[1] - a[1]) * local,
      a[2] + (b[2] - a[2]) * local,
    );
  });

  return (
    <group>
      <Line
        points={points}
        color="#2ee6a6"
        lineWidth={1.5}
        transparent
        opacity={0.35}
      />
      <mesh ref={packet}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#2ee6a6" />
      </mesh>
    </group>
  );
}

export function NodeConstellation({ journey = 0 }: { journey?: number }) {
  const group = useRef<THREE.Group>(null);
  const n = JOURNEY_NODES.length;
  const activeFloat = journey * (n - 0.001);
  const activeIndex = Math.min(n - 1, Math.floor(activeFloat));

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
  });

  return (
    <group ref={group}>
      <Edges activeFloat={activeFloat} />
      {JOURNEY_NODES.map((node, i) => (
        <NodeMesh
          key={node.id}
          node={node}
          index={i}
          active={i === activeIndex && journey > 0.02}
          passed={i < activeIndex}
        />
      ))}
      <pointLight position={[0, 2, 2]} intensity={1.2} color="#2ee6a6" distance={12} />
      <pointLight position={[4, -1, -2]} intensity={0.6} color="#7c5cff" distance={10} />
    </group>
  );
}
