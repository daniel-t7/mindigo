"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useActiveTestStore, useResultsStore, useTestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentResultsPage() {
  const router = useRouter();
  const session = useActiveTestStore((s) => s.session);
  const results = useResultsStore((s) => s.results);
  const tests = useTestStore((s) => s.tests);

  const latestResult = useMemo(() => {
    if (!session) { return undefined; }
    const test = tests.find((t) => t.code === session.testCode);
    const studentResults = results.filter(
      (r) => r.studentName === session.studentName && r.testId === test?.id,
    );
    const last = studentResults[studentResults.length - 1];
    if (!last || !test) { return undefined; }
    return {
      testTitle: last.testTitle,
      score: last.score,
      totalQuestions: last.totalQuestions,
      submittedAt: last.submittedAt,
      answers: last.answers,
      questions: test.questions,
    };
  }, [session, tests, results]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-medium">No active session</h2>
        <Button className="mt-4" onClick={() => router.push("/student/join")}>
          Join a Test
        </Button>
      </div>
    );
  }

  if (!latestResult) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-medium">No results found</h2>
        <Button className="mt-4" onClick={() => router.push("/student/join")}>
          Join Another Test
        </Button>
      </div>
    );
  }

  const percentage = Math.round(
    (latestResult.score / latestResult.totalQuestions) * 100,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {latestResult.testTitle}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submitted on{" "}
          {new Date(latestResult.submittedAt).toLocaleDateString(undefined, {
            dateStyle: "long",
          })}
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="flex flex-col items-center py-10">
          <div className="text-5xl font-bold">{percentage}%</div>
          <div className="mt-2 text-lg text-muted-foreground">
            {latestResult.score} / {latestResult.totalQuestions} correct
          </div>
          <Badge
            variant={
              percentage === 100
                ? "default"
                : percentage >= 50
                  ? "secondary"
                  : "destructive"
            }
            className="mt-3 text-sm"
          >
            {percentage >= 80
              ? "Excellent!"
              : percentage >= 60
                ? "Good Job!"
                : percentage >= 40
                  ? "Keep Practicing"
                  : "Needs Improvement"}
          </Badge>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Answer Review</h2>
        {latestResult.answers.map((answer, idx) => {
          const question = latestResult.questions.find(
            (q) => q.id === answer.questionId,
          );
          if (!question) return null;
          const isCorrect = answer.answer === question.correctAnswer;
          return (
            <Card key={answer.questionId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Q{idx + 1}: {question.text}
                  </CardTitle>
                  <Badge variant={isCorrect ? "default" : "destructive"}>
                    {isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>
                  Your answer:{" "}
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button variant="outline" onClick={() => router.push("/student/join")}>
          Join Another Test
        </Button>
      </div>
    </div>
  );
}
