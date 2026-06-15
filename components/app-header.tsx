"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { user } = useUser();
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
          {user && <UserButton />}
        </div>
      </div>
    </header>
  );
}
