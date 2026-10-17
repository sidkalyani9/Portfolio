import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "portfolio-theme";
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // index.html restores the preference before the first paint. New visitors
  // always start in light mode, regardless of their operating-system theme.
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );

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

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* Storage may be unavailable. */ }
  }, [theme]);

  // No page snapshots, render waits, or click lock. The icon animates in CSS;
  // the existing canvas updates its uniforms without interrupting the UI.
  const toggleTheme = () => setTheme((current) => current === "light" ? "dark" : "light");

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
