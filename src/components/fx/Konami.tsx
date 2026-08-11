import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "@/content/profile";
import { openPalette } from "@/components/CommandPalette";

const SEQ = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

/**
 * Konami easter egg — unlocks a root shell toast + opens the command palette
 * pre-armed for `sudo hire siddharth`.
 */
export function Konami() {
  const idx = useRef(0);
  const [flash, setFlash] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, [contenteditable]")) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = SEQ[idx.current];
      const match =
        key === expected ||
        (expected.length === 1 && key === expected.toLowerCase());

      if (match) {
        idx.current += 1;
        if (idx.current >= SEQ.length) {
          idx.current = 0;
          setFlash(true);
          // open palette after a beat so the toast is seen
          window.setTimeout(() => openPalette(), 700);
        }
      } else {
        idx.current = key === SEQ[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!flash || !toastRef.current) return;
    const el = toastRef.current;
    const tl = gsap.timeline({
      onComplete: () => setFlash(false),
    });
    tl.fromTo(
      el,
      { autoAlpha: 0, y: 16, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "expo.out" },
    ).to(el, { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.in", delay: 2.4 });
    return () => {
      tl.kill();
    };
  }, [flash]);

  if (!flash) return null;

  return (
    <div
      ref={toastRef}
      className="pointer-events-none fixed bottom-8 left-1/2 z-[160] w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl border border-accent/40 bg-bg-1/95 p-5 font-mono text-sm shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      role="status"
    >
      <p className="text-accent">root@portfolio:~#</p>
      <p className="mt-2 text-fg-0">
        cheat code accepted · god mode enabled for {profile.firstName}
      </p>
      <p className="mt-1 text-xs text-fg-2">
        opening palette — try <span className="text-accent">sudo hire siddharth</span>
      </p>
    </div>
  );
}
