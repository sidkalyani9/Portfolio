import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html, Line } from "@react-three/drei";
import { GRAPH_NODES, type GraphNode } from "@/three/journeyGraph";

/** Re-export for CameraRig / consumers */
export type JourneyNode = GraphNode;
export const JOURNEY_NODES = GRAPH_NODES;

function NodeMesh({
  node,
  index,
  active,
  passed,
}: {
  node: GraphNode;
  index: number;
  active: boolean;
  passed: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 1.1 + index * 0.85) * 0.05;
    ref.current.position.y = node.position[1] + bob;
    if (glow.current) {
      glow.current.position.copy(ref.current.position);
      const s = active ? 1.32 + Math.sin(t * 3.2) * 0.06 : passed ? 1.04 : 0.82;
      glow.current.scale.setScalar(s);
    }
  });

  const color = active ? "#c77dff" : passed ? "#8b5cf6" : "#3a3548";
  const emissive = active ? "#c77dff" : passed ? "#8b5cf6" : "#15101f";

  return (
    <group>
      <mesh ref={glow} position={node.position}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.2 : passed ? 0.09 : 0.03}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ref} position={node.position}>
        <icosahedronGeometry args={[0.2, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={active ? 1.55 : passed ? 0.5 : 0.1}
          roughness={0.35}
          metalness={0.45}
        />
      </mesh>
      {active ? (
        <Html
          position={[node.position[0], node.position[1] + 0.52, node.position[2]]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none", userSelect: "none" }}
          zIndexRange={[10, 0]}
        >
          <div
            className="whitespace-nowrap font-mono text-[10px] tracking-wide"
            style={{
              color: "#c77dff",
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

function Edges({ journey }: { journey: number }) {
  const points = useMemo(
    () => GRAPH_NODES.map((n) => n.position as [number, number, number]),
    [],
  );
  const packet = useRef<THREE.Mesh>(null);
  const nEdges = GRAPH_NODES.length - 1;

  useFrame(() => {
    if (!packet.current || nEdges < 1) return;
    // journey 0→1 maps linearly along the polyline (no discrete jumps)
    const f = Math.min(0.9999, Math.max(0, journey)) * nEdges;
    const i = Math.min(nEdges - 1, Math.floor(f));
    const local = f - i;
    const a = GRAPH_NODES[i].position;
    const b = GRAPH_NODES[i + 1].position;
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
        color="#c77dff"
        lineWidth={1.5}
        transparent
        opacity={0.32}
      />
      <mesh ref={packet}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#c77dff" />
      </mesh>
    </group>
  );
}

/**
 * Background constellation — one node per page section.
 * `journey` is continuous 0→1 from section geometry (never remapped).
 */
export function NodeConstellation({ journey = 0 }: { journey?: number }) {
  const group = useRef<THREE.Group>(null);
  const n = GRAPH_NODES.length;
  // active node: which segment we're on
  const edgeT = Math.min(0.999, Math.max(0, journey)) * Math.max(1, n - 1);
  const activeIndex = Math.min(n - 1, Math.floor(edgeT));

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.07) * 0.035;
  });

  return (
    <group ref={group} position={[-0.4, 0, 0]}>
      <Edges journey={journey} />
      {GRAPH_NODES.map((node, i) => (
        <NodeMesh
          key={node.id}
          node={node}
          index={i}
          active={i === activeIndex}
          passed={i < activeIndex}
        />
      ))}
      <pointLight position={[0, 2, 2]} intensity={1.15} color="#c77dff" distance={14} />
      <pointLight position={[5, -1, -2]} intensity={0.55} color="#8b5cf6" distance={12} />
    </group>
  );
}
