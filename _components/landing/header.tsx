"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Button } from "@/_components/ui/button";
import ThemeSwitch from "@/_components/ui/theme-switch";

export function LandingHeader() {
  const t = useTranslations("landing.header");
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold">Mindigo</span>
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeSwitch />
          {isSignedIn ? (
            <Button asChild size="sm">
              <Link href="/teacher/dashboard">{t("dashboard")}</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">{t("signIn")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">{t("getStarted")}</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
