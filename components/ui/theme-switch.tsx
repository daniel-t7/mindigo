"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ThemeSwitch = ({ className }: { className?: string }) => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  if (!resolvedTheme) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className={cn("rounded-full", className)}
    >
      {resolvedTheme === "dark" ? (
        <SunIcon size={16} />
      ) : (
        <MoonIcon size={16} />
      )}
    </Button>
  );
};

export default ThemeSwitch;
