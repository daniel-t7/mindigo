"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { Separator } from "@/components/ui/separator";

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

interface SubmissionSummary {
  id: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
  answers: AnswerDetail[];
}

interface TestInfo {
  id: string;
  title: string;
  timeLimitMinutes: number;
  code: string;
  scoringFormula: string | null;
}

export default function TestResultsPage() {
  const t = useTranslations("teacher.results");
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();
  const { isLoaded } = useUser();
  const [test, setTest] = useState<TestInfo | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    Promise.all([
      fetch(`/api/tests/${testId}`).then((r) => r.json()),
      fetch(`/api/submissions?testId=${testId}`).then((r) => r.json()),
    ])
      .then(([testData, subsData]) => {
        if (testData.error) { setTest(null); return; }
        setTest(testData);
        setSubmissions(subsData.submissions ?? []);
      })
      .catch(() => setTest(null))
      .finally(() => setLoading(false));
  }, [testId, isLoaded]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-medium">{t("notFound")}</h2>
        <Button className="mt-4" onClick={() => router.push("/teacher/dashboard")}>
          {t("backToDashboard")}
        </Button>
      </div>
    );
  }

  const selectedSubmission = selectedStudent
    ? submissions.find((s) => s.studentName === selectedStudent)
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{test.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("testInfo", { code: test.code, minutes: test.timeLimitMinutes })}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/teacher/dashboard")}>
          {t("backToDashboard")}
        </Button>
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
          <h3 className="text-lg font-medium">{t("noResults")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("noResultsDescription")}
          </p>
        </div>
      ) : selectedSubmission ? (
        <div>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setSelectedStudent(null)}
          >
            {t("backToAllStudents")}
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>{selectedSubmission.studentName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-bold">
                  {selectedSubmission.score} / {selectedSubmission.totalQuestions}
                </span>
                {(() => {
                  const grade = computeGrade(selectedSubmission.score, selectedSubmission.totalQuestions, test.scoringFormula);
                  return grade ? (
                    <Badge className="text-sm px-3 py-1">
                      {t("grade", { grade })}
                    </Badge>
                  ) : null;
                })()}
                <Badge
                  variant={
                    selectedSubmission.score === selectedSubmission.totalQuestions
                      ? "default"
                      : selectedSubmission.score >= selectedSubmission.totalQuestions / 2
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-sm"
                >
                  {Math.round((selectedSubmission.score / selectedSubmission.totalQuestions) * 100)}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                </span>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">{t("answerBreakdown")}</h4>
                {selectedSubmission.answers.map((answer, idx) => (
                  <div key={answer.questionId} className="rounded-lg border p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("questionLabel", { n: idx + 1, text: answer.questionText })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t("pts", { count: answer.points })}
                      </span>
                      <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                        {answer.isCorrect ? t("correct") : t("incorrect")}
                      </Badge>
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground">
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
                      <div>
                        <p>
                          {t("studentAnswer", { answer: answer.answer || t("noAnswer") })}
                        </p>
                        {!answer.isCorrect && (
                          <p>
                            {t("correctAnswer", { answer: answer.correctAnswer })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{t("submissions", { count: submissions.length })}</span>
          </div>

          {submissions.map((sub) => (
            <Card
              key={sub.id}
              className="cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() => setSelectedStudent(sub.studentName)}
            >
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{sub.studentName}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">
                    {sub.score} / {sub.totalQuestions}
                  </span>
                  {(() => {
                    const grade = computeGrade(sub.score, sub.totalQuestions, test.scoringFormula);
                    return grade ? (
                      <Badge variant="outline" className="text-xs">
                        {grade}
                      </Badge>
                    ) : null;
                  })()}
                  <Badge
                    variant={
                      sub.score === sub.totalQuestions
                        ? "default"
                        : sub.score >= sub.totalQuestions / 2
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {Math.round((sub.score / sub.totalQuestions) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
