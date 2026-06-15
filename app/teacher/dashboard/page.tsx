"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TeacherDashboard() {
  const { user } = useUser();
  const tests = useTestStore((s) => s.tests);
  const teacherTests = tests.filter((t) => t.teacherId === user?.id);

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

      {teacherTests.length === 0 ? (
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
          {teacherTests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <Badge variant="outline" className="mt-1 w-fit">
                  Code: {test.code}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>{test.questions.length} questions</p>
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
