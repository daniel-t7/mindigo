"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ThemeSwitch from "@/components/ui/theme-switch";

export function LandingHeader() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border border-muted/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-scooter-600 dark:text-scooter-400">
            testche
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="#search" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Find Tests
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Testimonials
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          {isSignedIn ? (
            <Button asChild size="sm">
              <Link href="/teacher/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
