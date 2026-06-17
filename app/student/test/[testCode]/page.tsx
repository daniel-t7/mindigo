"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActiveTestStore } from "@/lib/store";
import { ProgressBar } from "@/components/progress-bar";
import { QuestionRenderer } from "@/components/question-renderer";
import { CodeBlock } from "@/components/ui/code-block";
import { TestTimer } from "@/components/test-timer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function TakeTestPage() {
  const { testCode } = useParams<{ testCode: string }>();
  const router = useRouter();
  const session = useActiveTestStore((s) => s.session);
  const setAnswer = useActiveTestStore((s) => s.setAnswer);
  const nextQuestion = useActiveTestStore((s) => s.nextQuestion);
  const prevQuestion = useActiveTestStore((s) => s.prevQuestion);
  const endSession = useActiveTestStore((s) => s.endSession);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session || session.testCode !== testCode) {
      router.replace("/student/join");
    }
  }, [session, testCode, router]);

  const handleSubmit = useCallback(async () => {
    if (!session) return;

    const unanswered = session.questions.filter(
      (q) => !session.answers[q.id],
    );
    if (unanswered.length > 0) {
      toast.error(
        `You have ${unanswered.length} unanswered question${unanswered.length > 1 ? "s" : ""}. Please review before submitting.`,
      );
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testCode,
          studentName: session.studentName,
          answers: Object.entries(session.answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to submit");
      }

      endSession();
      toast.success("Test submitted successfully!");
      router.push("/student/results");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit test");
      setSubmitting(false);
    }
  }, [session, testCode, endSession, router]);

  const handleExpire = useCallback(async () => {
    if (!session) return;

    try {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testCode,
          studentName: session.studentName,
          answers: Object.entries(session.answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        }),
      });
    } catch {
      // submission attempted, proceed anyway
    }

    endSession();
    toast.error("Time's up! Your test has been auto-submitted.");
    router.push("/student/results");
  }, [session, testCode, endSession, router]);

  if (!session) return null;

  const currentIndex = session.currentQuestionIndex;
  const total = session.questions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;
  const currentQuestion = session.questions[currentIndex];
  const answerValue = session.answers[currentQuestion?.id ?? ""] ?? "";
  const answeredCount = Object.keys(session.answers).length;

  function handleAnswerChange(value: string) {
    if (currentQuestion) {
      setAnswer(currentQuestion.id, value);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl flex-col px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {session.testTitle}
        </div>
        <TestTimer
          startedAt={session.startedAt}
          timeLimitMinutes={session.timeLimitMinutes}
          onExpire={handleExpire}
        />
      </div>

      <div className="mb-8">
        <ProgressBar
          total={total}
          current={currentIndex}
          answered={session.answers}
        />
      </div>

      <div className="mb-4 text-center text-sm text-muted-foreground">
        {answeredCount} of {total} answered
      </div>

      <div className="flex flex-1 gap-8">
        <div className="w-1/2">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-2xl border bg-card p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Question {currentIndex + 1} of {total}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {currentQuestion?.points ?? 1} pt{currentQuestion?.points !== 1 ? "s" : ""}
                </span>
              </div>
              <h2 className="text-lg font-semibold leading-relaxed">
                {currentQuestion?.text}
              </h2>
            </div>
            {currentQuestion?.imageUrl && (
              <div className="overflow-hidden rounded-2xl border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentQuestion.imageUrl}
                  alt="Question illustration"
                  className="w-full object-contain"
                />
              </div>
            )}
            {currentQuestion?.codeBlock && (
              <CodeBlock
                language={currentQuestion.codeBlock.language}
                code={currentQuestion.codeBlock.code}
              />
            )}
          </div>
        </div>

        <div className="flex w-1/2 flex-col">
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Your Answer
            </div>
            {currentQuestion && (
              <QuestionRenderer
                question={currentQuestion}
                value={answerValue}
                onChange={handleAnswerChange}
              />
            )}
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={isFirst}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {!isLast ? (
            <Button onClick={nextQuestion}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Test"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
