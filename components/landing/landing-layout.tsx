import { type ReactNode } from "react";

export function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-background">
      <div className="relative flex w-full flex-col items-center justify-start">
        <div className="relative flex min-h-screen w-full max-w-7xl flex-col items-start justify-start">

          <div className="absolute top-0 left-4 z-0 h-full w-px bg-muted/40 sm:left-6 md:left-8 lg:left-0"></div>

          <div className="absolute top-0 right-4 z-0 h-full w-px bg-muted/40 sm:right-6 md:right-8 lg:right-0"></div>

          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none border-x border-muted/50">
            <div className="relative h-full w-full opacity-[0.15]">
              {Array.from({ length: 180 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-px bg-primary origin-top-left -rotate-45"
                  style={{
                    top: `${i * 24 - 200}px`,
                    left: "-100%",
                    width: "350%",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    opacity: 0.60,
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-4 self-stretch overflow-hidden sm:gap-6 md:gap-8">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
