"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function LandingActions() {
  const t = useTranslations("landingActions");
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const role = user?.publicMetadata?.role as string | undefined;

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && !role) {
      router.push("/role-setup");
    }
  }, [isLoaded, isSignedIn, role, router]);

  if (!isLoaded) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (isSignedIn && role === "teacher") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("welcomeBackTeacher", { firstName: user.firstName ?? "" })}</h1>
        <p className="mt-2 text-muted-foreground">{t("teacherSubtitle")}</p>
        <Button className="mt-6" onClick={() => router.push("/teacher/dashboard")}>
          {t("goToDashboard")}
        </Button>
      </div>
    );
  }

  if (isSignedIn && role === "student") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("welcomeStudent", { firstName: user.firstName ?? "" })}</h1>
        <p className="mt-2 text-muted-foreground">{t("studentSubtitle")}</p>
        <Button className="mt-6" onClick={() => router.push("/student/join")}>
          {t("joinTest")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{t("siteName")}</h1>
      <p className="mt-3 max-w-md text-lg text-muted-foreground">
        {t("tagline")}
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button size="lg" onClick={() => router.push("/sign-in")}>
          {t("imATeacher")}
        </Button>
        <Button size="lg" variant="outline" onClick={() => router.push("/student/join")}>
          {t("imAStudent")}
        </Button>
      </div>
    </div>
  );
}
