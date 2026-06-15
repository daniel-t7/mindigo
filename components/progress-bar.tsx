"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  total: number;
  current: number;
  answered: Record<string, string>;
}

export function ProgressBar({ total, current, answered }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = i === current;
        const isAnswered = answered[Object.keys(answered)[i] ?? ""] !== undefined;
        const isCompleted = i < current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                isActive && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                isCompleted && "bg-primary/20 text-primary",
                !isActive && !isCompleted && isAnswered && "border-2 border-primary/40 text-muted-foreground",
                !isActive && !isCompleted && !isAnswered && "border-2 border-muted-foreground/30 text-muted-foreground",
              )}
            >
              {step}
            </div>
            {i < total - 1 && (
              <div
                className={cn(
                  "h-0.5 w-6 rounded",
                  isCompleted ? "bg-primary" : "bg-muted-foreground/20",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
