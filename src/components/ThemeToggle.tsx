import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = `Switch to ${theme === "light" ? "dark" : "light"} theme`;

  return (
    <button
      type="button"
      className="theme-toggle"
      data-cursor="control"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle__disc" aria-hidden="true">
        <Sun className="theme-toggle__sun" size={18} strokeWidth={1.6} />
        <Moon className="theme-toggle__moon" size={18} strokeWidth={1.6} />
      </span>
    </button>
  );
}
