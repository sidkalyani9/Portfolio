import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html, Line } from "@react-three/drei";
import {
  HOME_GRAPH_NODES,
  activeIndexFromJourney,
  type GraphNode,
} from "@/three/journeyGraph";

export { activeIndexFromJourney };

/** Re-export for consumers */
export type JourneyNode = GraphNode;
export const JOURNEY_NODES = HOME_GRAPH_NODES;

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

function Edges({ journey, nodes }: { journey: number; nodes: GraphNode[] }) {
  const points = useMemo(
    () => nodes.map((n) => n.position as [number, number, number]),
    [nodes],
  );
  const packet = useRef<THREE.Mesh>(null);
  const nEdges = Math.max(0, nodes.length - 1);

  useFrame(() => {
    if (!packet.current || nEdges < 1 || nodes.length < 2) return;
    const j = Math.min(1, Math.max(0, journey));
    // Sit fully on the last node when journey completes
    if (j >= 1 - 1e-4) {
      const last = nodes[nodes.length - 1].position;
      packet.current.position.set(last[0], last[1], last[2]);
      return;
    }
    const f = j * nEdges;
    const i = Math.min(nEdges - 1, Math.floor(f));
    const local = f - i;
    const a = nodes[i].position;
    const b = nodes[i + 1].position;
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
 * Background constellation.
 * `nodes` switches between home sections and case-study essay arc.
 */
export function NodeConstellation({
  journey = 0,
  nodes = HOME_GRAPH_NODES,
}: {
  journey?: number;
  nodes?: GraphNode[];
}) {
  const group = useRef<THREE.Group>(null);
  const n = nodes.length;
  const activeIndex = activeIndexFromJourney(journey, n);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.07) * 0.035;
  });

  // Center case-study path a bit more; home path already laid out wide
  const offsetX = n <= 6 ? -0.6 : -0.4;

  return (
    <group ref={group} position={[offsetX, 0, 0]} key={nodes.map((nd) => nd.id).join("|")}>
      <Edges journey={journey} nodes={nodes} />
      {nodes.map((node, i) => (
        <NodeMesh
          key={node.id}
          node={node}
          index={i}
          active={i === activeIndex}
          // last node when active is also "reached" (glow), not left dark
          passed={i < activeIndex || (i === activeIndex && i === n - 1)}
        />
      ))}
      <pointLight position={[0, 2, 2]} intensity={1.15} color="#c77dff" distance={14} />
      <pointLight position={[4, -1, -2]} intensity={0.55} color="#8b5cf6" distance={12} />
    </group>
  );
}
