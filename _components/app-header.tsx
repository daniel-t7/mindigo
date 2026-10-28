"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTranslations } from "next-intl";
import { Button } from "@/_components/ui/button";
import ThemeSwitch from "@/_components/ui/theme-switch";
import { useTheme } from "@/_components/theme-provider";

export function AppHeader() {
  const t = useTranslations("appHeader");
  const { user } = useUser();
  const { resolvedTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight"
          >
            {t("siteName")}
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            <Button variant="link" asChild>
              <Link href="/student/join">{t("joinTest")}</Link>
            </Button>
            {user && (
              <>
                <Button variant="link" asChild>
                  <Link href="/teacher/dashboard">{t("dashboard")}</Link>
                </Button>
                <Button variant="link" asChild>
                  <Link href="/teacher/create-test">{t("createTest")}</Link>
                </Button>
                <Button variant="link" asChild>
                  <Link href="/settings">{t("settings")}</Link>
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
                <Link href="/sign-in">{t("signIn")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">{t("signUp")}</Link>
              </Button>
            </div>
          )}
          {user && <UserButton appearance={resolvedTheme === "dark" ? dark : undefined} />}
        </div>
      </div>
    </header>
  );
}
