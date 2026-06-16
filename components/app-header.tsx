"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Button } from "@/components/ui/button";
import ThemeSwitch from "@/components/ui/theme-switch";
import { useTheme } from "@/components/theme-provider";

export function AppHeader() {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const role = user?.publicMetadata?.role as string | undefined;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight"
          >
            testche
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            <Button variant="link" asChild>
              <Link href="/student/join">Join Test</Link>
            </Button>
            {role === "teacher" && (
              <>
                <Button variant="link" asChild>
                  <Link href="/teacher/dashboard">Dashboard</Link>
                </Button>
                <Button variant="link" asChild>
                  <Link href="/teacher/create-test">Create Test</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          {!user && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
          {user && <UserButton appearance={resolvedTheme === "dark" ? dark : undefined} />}
        </div>
      </div>
    </header>
  );
}
