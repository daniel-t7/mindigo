"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useActiveTestStore } from "@/lib/store";
import { Button } from "@/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import { Badge } from "@/_components/ui/badge";
import { CodeBlock } from "@/_components/ui/code-block";

interface AnswerDetail {
  questionId: string;
  questionText: string;
  questionType: string;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
  imageUrl: string | null;
  codeBlock: { language: string; code: string } | null;
  points: number;
}

interface GradeThreshold {
  minPoints: number;
  label: string;
}

interface ResultData {
  testTitle: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
  answers: AnswerDetail[];
  scoringFormula: string | null;
}

function computeGrade(earned: number, total: number, formulaJson: string | null): string | null {
  if (!formulaJson) return null;
  try {
    const thresholds: GradeThreshold[] = JSON.parse(formulaJson);
    if (!thresholds.length) return null;
    let grade = thresholds[0].label;
    for (const t of thresholds) {
      if (earned >= t.minPoints) grade = t.label;
    }
    return grade;
  } catch {
    return null;
  }
}

export default function StudentResultsPage() {
  const t = useTranslations("student.results");
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
        scoringFormula: data.scoringFormula,
      }))
      .catch(() => setResult(null));
  }, [session]);

  if (result === "fetching") {
    if (!session) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-lg font-medium">{t("noSession")}</h2>
          <Button className="mt-4" onClick={() => router.push("/student/join")}>
            {t("joinTest")}
          </Button>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-medium">{t("noResults")}</h2>
        <Button className="mt-4" onClick={() => router.push("/student/join")}>
          {t("joinAnotherTest")}
        </Button>
      </div>
    );
  }

  const grade = computeGrade(result.score, result.totalQuestions, result.scoringFormula);
  const percentage = result.totalQuestions > 0
    ? Math.round((result.score / result.totalQuestions) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {result.testTitle}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("submittedOn", {
            date: new Date(result.submittedAt).toLocaleDateString(undefined, {
              dateStyle: "long",
            }),
          })}
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="flex flex-col items-center py-10">
          <div className="text-5xl font-bold">{percentage}%</div>
          <div className="mt-2 text-lg text-muted-foreground">
            {t("points", { score: result.score, totalQuestions: result.totalQuestions })}
          </div>
          {grade && (
            <Badge className="mt-3 text-lg px-4 py-1">
              {t("grade", { grade })}
            </Badge>
          )}
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
              ? t("excellent")
              : percentage >= 60
                ? t("goodJob")
                : percentage >= 40
                  ? t("keepPracticing")
                  : t("needsImprovement")}
          </Badge>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">{t("answerReview")}</h2>
        {result.answers.map((answer, idx) => (
          <Card key={answer.questionId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {t("questionLabel", { n: idx + 1, text: answer.questionText })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {t("pts", { count: answer.points })}
                  </span>
                  <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                    {answer.isCorrect ? t("correct") : t("incorrect")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {answer.imageUrl && (
                <div className="overflow-hidden rounded-lg border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={answer.imageUrl}
                    alt="Question illustration"
                    className="max-h-40 w-full object-contain"
                  />
                </div>
              )}
              {answer.codeBlock && (
                <CodeBlock
                  language={answer.codeBlock.language}
                  code={answer.codeBlock.code}
                />
              )}
              <p>
                {t("yourAnswer", { answer: answer.answer || t("noAnswer") })}
              </p>
              {!answer.isCorrect && (
                <p>
                  {t("correctAnswer", { answer: answer.correctAnswer })}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button variant="outline" onClick={() => router.push("/student/join")}>
          {t("joinAnotherTest")}
        </Button>
      </div>
    </div>
  );
}
