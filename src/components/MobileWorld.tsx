import { useEffect, useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  activeIndexFromJourney,
  type GraphNode,
} from "@/three/journeyGraph";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  phase: number;
  warm: boolean;
};

type Pt2 = { x: number; y: number };

/**
 * Soft constellation: wide, low-opacity, sits behind content.
 * Horizontal-ish path across the upper/mid field so it never
 * fights dense copy in the middle of cards.
 */
function layoutNodes(nodes: GraphNode[], w: number, h: number): Pt2[] {
  const n = nodes.length;
  if (n === 0) return [];

  const padX = w * 0.08;
  const usableW = w - padX * 2;
  // Keep the path in the upper 55% so section cards stay clean
  const yBase = h * 0.18;
  const yAmp = h * 0.22;

  return nodes.map((node, i) => {
    const t = n <= 1 ? 0.5 : i / (n - 1);
    const [, py] = node.position;
    // gentle wave from source y + sine
    const wave = Math.sin(t * Math.PI * 1.6) * 0.55 + (py - 0.9) * 0.15;
    return {
      x: padX + t * usableW,
      y: yBase + ((wave + 1) / 2) * yAmp,
    };
  });
}

function packetOnPath(pts: Pt2[], journey: number): Pt2 | null {
  if (pts.length === 0) return null;
  if (pts.length === 1) return pts[0];
  const j = Math.min(1, Math.max(0, journey));
  if (j >= 1 - 1e-4) return pts[pts.length - 1];
  const nEdges = pts.length - 1;
  const f = j * nEdges;
  const i = Math.min(nEdges - 1, Math.floor(f));
  const local = f - i;
  const a = pts[i];
  const b = pts[i + 1];
  return {
    x: a.x + (b.x - a.x) * local,
    y: a.y + (b.y - a.y) * local,
  };
}

function seedParticles(count: number, w: number, h: number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const warm = Math.random() > 0.72;
    out.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: -0.12 - Math.random() * 0.35,
      r: 1.2 + Math.random() * 2.8,
      a: 0.35 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      warm,
    });
  }
  return out;
}

/**
 * Mobile cinematic layer — visible dust field + soft ambient graph.
 * No labels, no UI chrome. Content stays fully readable.
 */
export function MobileWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { journey, nodes, progress } = useScrollProgress();
  const reduced = usePrefersReducedMotion();

  const stateRef = useRef({
    journey: 0,
    progress: 0,
    nodes: nodes as GraphNode[],
  });
  stateRef.current = { journey, progress, nodes };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let alive = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let t0 = performance.now();
    let visible = document.visibilityState === "visible";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Plenty of visible dust on phones
      const count = Math.min(160, Math.max(80, Math.floor((w * h) / 9000)));
      particles = seedParticles(count, w, h);
    };

    const onVis = () => {
      visible = document.visibilityState === "visible";
      if (visible && alive && !reduced) {
        raf = requestAnimationFrame(frame);
      }
    };

    const paint = (elapsed: number) => {
      const s = stateRef.current;
      const pts = layoutNodes(s.nodes, w, h);
      const active = activeIndexFromJourney(s.journey, s.nodes.length);
      const packet = packetOnPath(pts, s.journey);
      const shift = s.progress;

      ctx.clearRect(0, 0, w, h);

      // --- Ambient orbs (stronger so the void feels alive) ---
      const orbs = [
        {
          x: w * (0.2 + shift * 0.12),
          y: h * 0.22,
          r: w * 0.55,
          c0: "rgba(199,125,255,0.22)",
          c1: "rgba(199,125,255,0)",
        },
        {
          x: w * (0.85 - shift * 0.08),
          y: h * 0.48,
          r: w * 0.5,
          c0: "rgba(139,92,246,0.18)",
          c1: "rgba(139,92,246,0)",
        },
        {
          x: w * 0.5,
          y: h * (0.88 - shift * 0.05),
          r: w * 0.6,
          c0: "rgba(232,160,191,0.1)",
          c1: "rgba(232,160,191,0)",
        },
      ];
      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        const ox = o.x + Math.sin(elapsed * 0.00015 + i * 1.7) * 24;
        const oy = o.y + Math.cos(elapsed * 0.00012 + i) * 18;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        g.addColorStop(0, o.c0);
        g.addColorStop(1, o.c1);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, o.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Particles (bright, readable) ---
      ctx.save();
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx + Math.sin(elapsed * 0.0012 + p.phase) * 0.06;
          p.y += p.vy;
          if (p.y < -12) {
            p.y = h + 12;
            p.x = Math.random() * w;
          }
          if (p.x < -12) p.x = w + 12;
          if (p.x > w + 12) p.x = -12;
        }
        const tw =
          0.55 + 0.45 * Math.sin(elapsed * 0.0028 + p.phase);
        const alpha = Math.min(1, p.a * tw);
        // soft glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
        if (p.warm) {
          glow.addColorStop(0, `rgba(232,160,191,${alpha * 0.55})`);
          glow.addColorStop(1, "rgba(232,160,191,0)");
        } else {
          glow.addColorStop(0, `rgba(199,125,255,${alpha * 0.65})`);
          glow.addColorStop(1, "rgba(199,125,255,0)");
        }
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.beginPath();
        ctx.fillStyle = p.warm
          ? `rgba(255,220,235,${alpha})`
          : `rgba(232,210,255,${alpha})`;
        ctx.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // --- Ambient graph (very soft, no labels) ---
      if (pts.length >= 2) {
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // faint full path
        ctx.strokeStyle = "rgba(199,125,255,0.14)";
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          const prev = pts[i - 1];
          const cur = pts[i];
          const mx = (prev.x + cur.x) / 2;
          ctx.quadraticCurveTo(prev.x + (cur.x - prev.x) * 0.35, prev.y, mx, (prev.y + cur.y) / 2);
          ctx.quadraticCurveTo(
            cur.x - (cur.x - prev.x) * 0.35,
            cur.y,
            cur.x,
            cur.y,
          );
        }
        ctx.stroke();

        // lit progress path
        if (s.journey > 0.002) {
          const nEdges = pts.length - 1;
          const f = Math.min(1, s.journey) * nEdges;
          const ei = Math.min(nEdges - 1, Math.floor(f));
          const local = f - ei;
          ctx.strokeStyle = "rgba(199,125,255,0.38)";
          ctx.lineWidth = 1.6;
          ctx.shadowColor = "rgba(199,125,255,0.35)";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i <= ei; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          if (ei < nEdges) {
            const a = pts[ei];
            const b = pts[ei + 1];
            ctx.lineTo(a.x + (b.x - a.x) * local, a.y + (b.y - a.y) * local);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // nodes — soft dots only
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const isActive = i === active;
          const isPassed = i < active;
          const bob = reduced
            ? 0
            : Math.sin(elapsed * 0.0016 + i * 0.9) * (isActive ? 1.5 : 0.7);
          const cy = p.y + bob;
          const coreR = isActive ? 4.5 : isPassed ? 2.8 : 2;
          const glowR = isActive ? 16 : isPassed ? 8 : 5;
          const alpha = isActive ? 0.9 : isPassed ? 0.45 : 0.22;

          const gg = ctx.createRadialGradient(p.x, cy, 0, p.x, cy, glowR);
          gg.addColorStop(0, `rgba(199,125,255,${alpha * 0.5})`);
          gg.addColorStop(1, "rgba(199,125,255,0)");
          ctx.fillStyle = gg;
          ctx.beginPath();
          ctx.arc(p.x, cy, glowR, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = `rgba(210,170,255,${alpha})`;
          ctx.arc(p.x, cy, coreR, 0, Math.PI * 2);
          ctx.fill();
        }

        // packet
        if (packet) {
          const pr = 3.4 + (reduced ? 0 : Math.sin(elapsed * 0.005) * 0.5);
          const pg = ctx.createRadialGradient(
            packet.x,
            packet.y,
            0,
            packet.x,
            packet.y,
            pr * 5,
          );
          pg.addColorStop(0, "rgba(232,210,255,0.9)");
          pg.addColorStop(0.3, "rgba(199,125,255,0.35)");
          pg.addColorStop(1, "rgba(199,125,255,0)");
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.arc(packet.x, packet.y, pr * 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = "#f0e4ff";
          ctx.arc(packet.x, packet.y, pr, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Light bottom fade only — keep particles visible mid-screen
      const fade = ctx.createLinearGradient(0, h * 0.55, 0, h);
      fade.addColorStop(0, "rgba(10,7,18,0)");
      fade.addColorStop(1, "rgba(10,7,18,0.35)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, h * 0.55, w, h * 0.45);
    };

    const frame = (now: number) => {
      if (!alive || !visible) return;
      paint(now - t0);
      if (!reduced) raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    if (reduced) {
      paint(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
      aria-hidden
      style={{ width: "100%", height: "100%" }}
    />
  );
}
