"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider, useTheme } from "@/_components/theme-provider";
import { type ReactNode } from "react";

function ClerkThemed({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider appearance={resolvedTheme === "dark" ? dark : undefined}>
      {children}
    </ClerkProvider>
  );
}

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" disableTransitionOnChange>
      <ClerkThemed>
        {children}
      </ClerkThemed>
    </ThemeProvider>
  );
}
