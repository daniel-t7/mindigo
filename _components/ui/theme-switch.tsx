"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/_components/theme-provider";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/_components/ui/button";

const ThemeSwitch = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    if (!resolvedTheme) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className={cn("rounded-full", className)}
      aria-label="Toggle theme"
    >
      {mounted && resolvedTheme === "dark" ? (
        <SunIcon size={16} />
      ) : (
        <MoonIcon size={16} />
      )}
    </Button>
  );
};

export default ThemeSwitch;
