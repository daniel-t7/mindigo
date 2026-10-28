import { type ReactNode } from "react";

export function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-15"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, var(--primary) 0, var(--primary) 1px, transparent 1px, transparent 24px)",
          backgroundSize: "100% 200px",
        }}
      />
      {children}
    </div>
  );
}
