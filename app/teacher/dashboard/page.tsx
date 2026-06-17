"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TestSummary {
  id: string;
  title: string;
  timeLimitMinutes: number;
  code: string;
  createdAt: string;
  questionCount: number;
}

export default function TeacherDashboard() {
  const t = useTranslations("teacher.dashboard");
  const { isLoaded } = useUser();
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    fetch("/api/tests")
      .then((res) => res.json())
      .then((data) => setTests(data))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, [isLoaded]);

  async function handleDelete(testId: string, title: string) {
    if (!window.confirm(t("confirmDelete", { title }))) return;

    try {
      const res = await fetch(`/api/tests/${testId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setTests((prev) => prev.filter((t) => t.id !== testId));
      toast.success(t("toastDeleted"));
    } catch {
      toast.error(t("toastDeleteFailed"));
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href="/teacher/create-test">{t("createNewTest")}</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
          <h3 className="text-lg font-medium">{t("emptyTitle")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("emptyDescription")}
          </p>
          <Button className="mt-4" asChild>
            <Link href="/teacher/create-test">{t("createNewTest")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <Badge variant="outline" className="mt-1 w-fit">
                  {t("code", { code: test.code })}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>{t("questions", { count: test.questionCount })}</p>
                <p>{t("timeLimit", { minutes: test.timeLimitMinutes })}</p>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <div className="flex w-full gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/teacher/results/${test.id}`}>{t("results")}</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/teacher/edit-test/${test.id}`}>{t("edit")}</Link>
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDelete(test.id, test.title)}
                >
                  {t("delete")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
