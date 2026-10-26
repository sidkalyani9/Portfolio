import type { GraphMode, GraphNode } from "@/three/journeyGraph";

export type ScrollProgressValue = {
  progress: number;
  y: number;
  section: string | null;
  journey: number;
  sectionIndex: number;
  sectionLocal: number;
  mode: GraphMode;
  nodes: GraphNode[];
};

/** Continuous animation data stays outside React; subscribers select what they display. */
export function createScrollProgressStore(initial: ScrollProgressValue) {
  const ref = { current: initial };
  const listeners = new Set<() => void>();
  return {
    ref,
    getSnapshot: () => ref.current,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    publish(next: ScrollProgressValue) {
      const previous = ref.current;
      if (
        previous.progress === next.progress && previous.y === next.y &&
        previous.journey === next.journey && previous.section === next.section &&
        previous.sectionIndex === next.sectionIndex && previous.sectionLocal === next.sectionLocal &&
        previous.mode === next.mode && previous.nodes === next.nodes
      ) return false;
      ref.current = next;
      listeners.forEach((listener) => listener());
      return true;
    },
  };
}
