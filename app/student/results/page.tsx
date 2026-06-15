"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveTestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnswerDetail {
  questionId: string;
  questionText: string;
  questionType: string;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface ResultData {
  testTitle: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
  answers: AnswerDetail[];
}

export default function StudentResultsPage() {
  const router = useRouter();
  const session = useActiveTestStore((s) => s.session);
  const [result, setResult] = useState<ResultData | null | "fetching">("fetching");

  useEffect(() => {
    if (!session) return;

    fetch(`/api/submissions/latest?testCode=${session.testCode}&studentName=${encodeURIComponent(session.studentName)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setResult({
        testTitle: data.testTitle,
        score: data.score,
        totalQuestions: data.totalQuestions,
        submittedAt: data.submittedAt,
        answers: data.answers,
      }))
      .catch(() => setResult(null));
  }, [session]);

  if (result === "fetching") {
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
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  if (!result) {
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
    (result.score / result.totalQuestions) * 100,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {result.testTitle}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submitted on{" "}
          {new Date(result.submittedAt).toLocaleDateString(undefined, {
            dateStyle: "long",
          })}
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="flex flex-col items-center py-10">
          <div className="text-5xl font-bold">{percentage}%</div>
          <div className="mt-2 text-lg text-muted-foreground">
            {result.score} / {result.totalQuestions} correct
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
        {result.answers.map((answer, idx) => (
          <Card key={answer.questionId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Q{idx + 1}: {answer.questionText}
                </CardTitle>
                <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                  {answer.isCorrect ? "Correct" : "Incorrect"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>
                Your answer:{" "}
                <span
                  className={
                    answer.isCorrect
                      ? "text-green-600 dark:text-green-400"
                      : "text-destructive"
                  }
                >
                  {answer.answer || "(no answer)"}
                </span>
              </p>
              {!answer.isCorrect && (
                <p>
                  Correct answer:{" "}
                  <span className="text-green-600 dark:text-green-400">
                    {answer.correctAnswer}
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button variant="outline" onClick={() => router.push("/student/join")}>
          Join Another Test
        </Button>
      </div>
    </div>
  );
}
