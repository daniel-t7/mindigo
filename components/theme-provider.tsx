"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark" | undefined;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: undefined,
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeClass(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  disableTransitionOnChange = false,
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      return (localStorage.getItem("theme") as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const resolvedTheme = typeof window === "undefined"
    ? undefined
    : theme === "system"
      ? getSystemTheme()
      : theme;

  const setTheme = useCallback((newTheme: Theme) => {
    try { localStorage.setItem("theme", newTheme); } catch {}
    setThemeState(newTheme);
  }, []);

  useEffect(() => {
    if (!resolvedTheme) return;
    if (disableTransitionOnChange) {
      document.documentElement.classList.add("no-transitions");
      void document.documentElement.offsetHeight;
    }
    applyThemeClass(resolvedTheme);
    if (disableTransitionOnChange) {
      requestAnimationFrame(() => document.documentElement.classList.remove("no-transitions"));
    }
  }, [resolvedTheme, disableTransitionOnChange]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyThemeClass(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
