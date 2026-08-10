import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { FluidField } from "@/three/FluidField";
import { NodeConstellation } from "@/three/NodeConstellation";
import { DustField } from "@/three/DustField";
import { CameraRig } from "@/three/CameraRig";
import { PostFX } from "@/three/PostFX";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function SceneBridge({ highQuality }: { highQuality: boolean }) {
  const { progress, journey, nodes, mode } = useScrollProgress();

  return (
    <>
      <CameraRig journey={journey} nodes={nodes} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 2]} intensity={0.55} color="#cfe8ff" />
      <FluidField intensity={highQuality ? 1 : 0.7} progress={progress} />
      <DustField count={highQuality ? 320 : 160} />
      <NodeConstellation journey={journey} nodes={nodes} />
      <PostFX
        enabled={highQuality}
        strength={mode === "case-study" ? 0.75 : highQuality ? 1 : 0.65}
      />
    </>
  );
}

/**
 * Fixed full-viewport cinematic WebGL world (Option C).
 */
export function CinematicWorld() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const fine = useMediaQuery("(pointer: fine)");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const enabled = !reduced && isDesktop && fine;

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return [1, 1.25] as [number, number];
    return [1, Math.min(1.5, window.devicePixelRatio || 1)] as [number, number];
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {visible ? (
        <Canvas
          gl={{
            alpha: false,
            antialias: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          dpr={dpr}
          camera={{ position: [0, 1.2, 7.5], fov: 45, near: 0.1, far: 60 }}
          style={{ width: "100%", height: "100%" }}
          frameloop="always"
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#0a0712"), 1);
          }}
        >
          <Suspense fallback={null}>
            <SceneBridge highQuality={isDesktop} />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}
