import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { JOURNEY_NODES } from "@/three/NodeConstellation";

function catmull(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, t: number) {
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
  const f = Math.min(0.999, Math.max(0, t)) * n;
  const i = Math.floor(f);
  const local = f - i;
  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[Math.min(n, i + 1)];
  const p3 = points[Math.min(n, i + 2)];
  const v = catmull(p0, p1, p2, p3, local);
  out.copy(v);
}

/**
 * Scroll-driven cinematic camera — flies past the agent constellation.
 */
export function CameraRig({
  progress,
  journey,
  section,
}: {
  progress: number;
  journey: number;
  section: string | null;
}) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0.6, 0));
  const pos = useRef(new THREE.Vector3(0, 1.2, 7.5));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  const camPath = useMemo(
    () => [
      new THREE.Vector3(-1.5, 1.4, 8.5),
      new THREE.Vector3(-3.5, 1.6, 4.2),
      new THREE.Vector3(-1.0, 1.0, 3.2),
      new THREE.Vector3(1.2, 1.4, 3.6),
      new THREE.Vector3(3.5, 1.0, 3.0),
      new THREE.Vector3(5.2, 1.6, 4.5),
      new THREE.Vector3(2.0, 2.2, 7.0),
    ],
    [],
  );

  const lookPath = useMemo(
    () => [
      new THREE.Vector3(-1.0, 0.6, 0),
      ...JOURNEY_NODES.map((n) => new THREE.Vector3(...n.position)),
      new THREE.Vector3(2.0, 0.8, 0),
    ],
    [],
  );

  useFrame((_, delta) => {
    let t = progress;
    if (section === "pipeline" || section === "systems") {
      t = 0.35 + journey * 0.45;
    } else if (section === "home" || section === "telemetry") {
      t = progress * 0.25;
    } else if (section === "contact" || section === "work") {
      t = 0.75 + progress * 0.2;
    }

    samplePath(camPath, t, targetPos.current);
    samplePath(lookPath, Math.min(1, t * 1.05), targetLook.current);

    const k = 1 - Math.exp(-delta * 2.4);
    pos.current.lerp(targetPos.current, k);
    look.current.lerp(targetLook.current, k);
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}
