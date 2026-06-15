"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function RoleSetupPage() {
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
      toast.success(`Account set up as ${role}`);
      router.push(role === "teacher" ? "/teacher/dashboard" : "/student/join");
    } catch {
      toast.error("Failed to set role. Please try again.");
      setSaving(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
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
            Choose Your Role
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Are you a teacher or a student?
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full"
            disabled={saving}
            onClick={() => setRole("teacher")}
          >
            {saving ? "Saving..." : "I'm a Teacher"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            disabled={saving}
            onClick={() => setRole("student")}
          >
            {saving ? "Saving..." : "I'm a Student"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
