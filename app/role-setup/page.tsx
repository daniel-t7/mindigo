"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function RoleSetupPage() {
  const t = useTranslations("roleSetup");
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function setRole(role: "teacher" | "student") {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        throw new Error("Failed to set role");
      }
      toast.success(t("toastSetup", { role }));
      router.push(role === "teacher" ? "/teacher/dashboard" : "/student/join");
    } catch {
      toast.error(t("toastError"));
      setSaving(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {t("title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center mt-1">
            {t("description")}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full"
            disabled={saving}
            onClick={() => setRole("teacher")}
          >
            {saving ? t("saving") : t("imATeacher")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            disabled={saving}
            onClick={() => setRole("student")}
          >
            {saving ? t("saving") : t("imAStudent")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
