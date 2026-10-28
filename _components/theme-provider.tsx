"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";

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
  if (typeof window === "undefined") return "light";
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
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
      return defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => getSystemTheme());

  const resolvedTheme = typeof window === "undefined"
    ? undefined
    : theme === "system"
      ? systemTheme
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
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-transitions");
      });
    }
  }, [resolvedTheme, disableTransitionOnChange]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    setSystemTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
