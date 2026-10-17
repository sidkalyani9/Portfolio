import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Theme = "light" | "dark";
const STORAGE_KEY = "portfolio-theme";
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // index.html restores the preference before the first paint. New visitors
  // always start in light mode, regardless of their operating-system theme.
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const reduced = usePrefersReducedMotion();
  const transitioning = useRef(false);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content", theme === "dark" ? "#0a0712" : "#ffffff",
    );
  }, [theme]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setTheme(event.newValue === "dark" ? "dark" : "light");
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const toggleTheme = () => {
    if (transitioning.current) return;
    const next = theme === "light" ? "dark" : "light";
    const update = () => {
      flushSync(() => setTheme(next));
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Private browsing may block storage. */ }
    };

    if (reduced || !document.startViewTransition) {
      update();
      return;
    }

    transitioning.current = true;
    const transition = document.startViewTransition(async () => {
      update();
      // Let the existing WebGL / 2D canvas paint its new palette before the
      // browser captures it. Preserve the scene, scroll position and animation.
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
    void transition.ready.catch(() => { /* A skipped snapshot still applies the theme. */ });
    void transition.finished.finally(() => { transitioning.current = false; }).catch(() => {});
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
