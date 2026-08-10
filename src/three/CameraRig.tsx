import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HOME_GRAPH_NODES, type GraphNode } from "@/three/journeyGraph";

function catmull(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3,
  t: number,
) {
  const t2 = t * t;
  const t3 = t2 * t;
  return new THREE.Vector3(
    0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
    0.5 *
      (2 * p1.z +
        (-p0.z + p2.z) * t +
        (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 +
        (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3),
  );
}

function samplePath(points: THREE.Vector3[], t: number, out: THREE.Vector3) {
  const n = points.length - 1;
  if (n < 1) {
    out.copy(points[0] ?? new THREE.Vector3());
    return;
  }
  const f = Math.min(0.999, Math.max(0, t)) * n;
  const i = Math.floor(f);
  const local = f - i;
  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[Math.min(n, i + 1)];
  const p3 = points[Math.min(n, i + 2)];
  out.copy(catmull(p0, p1, p2, p3, local));
}

/**
 * Camera follows the active graph's continuous journey.
 */
export function CameraRig({
  journey,
  nodes = HOME_GRAPH_NODES,
}: {
  journey: number;
  nodes?: GraphNode[];
}) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0.6, 0));
  const pos = useRef(new THREE.Vector3(0, 1.2, 7.5));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const smoothJourney = useRef(0);

  const camPath = useMemo(() => {
    return nodes.map(
      (n) =>
        new THREE.Vector3(
          n.position[0] * 0.55 - 0.4,
          n.position[1] + 1.1,
          n.position[2] + 5.8,
        ),
    );
  }, [nodes]);

  const lookPath = useMemo(
    () => nodes.map((n) => new THREE.Vector3(...n.position)),
    [nodes],
  );

  useFrame((_, delta) => {
    const kJ = 1 - Math.exp(-delta * 5.5);
    smoothJourney.current += (journey - smoothJourney.current) * kJ;
    const t = Math.min(1, Math.max(0, smoothJourney.current));

    samplePath(camPath, t, targetPos.current);
    samplePath(lookPath, t, targetLook.current);

    const k = 1 - Math.exp(-delta * 2.8);
    pos.current.lerp(targetPos.current, k);
    look.current.lerp(targetLook.current, k);
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}
