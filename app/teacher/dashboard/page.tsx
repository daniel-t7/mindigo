"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TestSummary {
  id: string;
  title: string;
  timeLimitMinutes: number;
  code: string;
  createdAt: string;
  questionCount: number;
}

export default function TeacherDashboard() {
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Tests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your tests and view student results.
          </p>
        </div>
        <Button asChild>
          <Link href="/teacher/create-test">Create New Test</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading tests...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
          <h3 className="text-lg font-medium">No tests yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first test to get started.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/teacher/create-test">Create New Test</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <Badge variant="outline" className="mt-1 w-fit">
                  Code: {test.code}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>{test.questionCount} questions</p>
                <p>{test.timeLimitMinutes} min time limit</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/teacher/results/${test.id}`}>View Results</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
