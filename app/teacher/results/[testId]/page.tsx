"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useTestStore, useResultsStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function TestResultsPage() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();
  const { user } = useUser();
  const tests = useTestStore((s) => s.tests);
  const allResults = useResultsStore((s) => s.results);

  const test = useMemo(() => tests.find((t) => t.id === testId), [tests, testId]);
  const results = useMemo(() => allResults.filter((r) => r.testId === testId), [allResults, testId]);

  if (!test || test.teacherId !== user?.id) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-medium">Test not found</h2>
        <Button className="mt-4" onClick={() => router.push("/teacher/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{test.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Code: {test.code} &middot; {test.questions.length} questions &middot;{" "}
            {test.timeLimitMinutes} min
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/teacher/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
          <h3 className="text-lg font-medium">No results yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Students haven&apos;t submitted any results for this test.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{results.length}</span>
            submission{results.length !== 1 ? "s" : ""}
          </div>

          {results.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <CardTitle>{result.studentName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    {result.score} / {result.totalQuestions}
                  </span>
                  <Badge
                    variant={
                      result.score === result.totalQuestions
                        ? "default"
                        : result.score >= result.totalQuestions / 2
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-sm"
                  >
                    {Math.round((result.score / result.totalQuestions) * 100)}%
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Answer Breakdown</h4>
                  {result.answers.map((answer, idx) => {
                    const question = test.questions.find(
                      (q) => q.id === answer.questionId,
                    );
                    if (!question) return null;
                    const isCorrect = answer.answer === question.correctAnswer;
                    return (
                      <div
                        key={answer.questionId}
                        className="rounded-lg border p-3"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Q{idx + 1}: {question.text}
                          </span>
                          <Badge
                            variant={isCorrect ? "default" : "destructive"}
                          >
                            {isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>
                            Student answer:{" "}
                            <span
                              className={
                                isCorrect
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-destructive"
                              }
                            >
                              {answer.answer || "(no answer)"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              Correct answer:{" "}
                              <span className="text-green-600 dark:text-green-400">
                                {question.correctAnswer}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
