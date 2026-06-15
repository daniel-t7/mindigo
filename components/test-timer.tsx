"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TestTimerProps {
  startedAt: string;
  timeLimitMinutes: number;
  onExpire: () => void;
}

export function TestTimer({ startedAt, timeLimitMinutes, onExpire }: TestTimerProps) {
  const calcRemaining = useCallback(() => {
    const start = new Date(startedAt).getTime();
    const end = start + timeLimitMinutes * 60 * 1000;
    const now = Date.now();
    return Math.max(0, Math.floor((end - now) / 1000));
  }, [startedAt, timeLimitMinutes]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      const r = calcRemaining();
      setRemaining(r);
      if (r <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [calcRemaining, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining < 60;

  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-1.5 text-sm font-medium tabular-nums",
        isLow
          ? "border-destructive/50 bg-destructive/10 text-destructive animate-pulse"
          : "border-border text-foreground",
      )}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
