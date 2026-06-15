"use client";

import { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActiveTestStore, useTestStore, useResultsStore } from "@/lib/store";
import { ProgressBar } from "@/components/progress-bar";
import { QuestionRenderer } from "@/components/question-renderer";
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
  const getTestByCode = useTestStore((s) => s.getTestByCode);
  const addResult = useResultsStore((s) => s.addResult);

  useEffect(() => {
    if (!session || session.testCode !== testCode) {
      router.replace("/student/join");
    }
  }, [session, testCode, router]);

  const handleSubmit = useCallback(() => {
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

    const test = getTestByCode(testCode);
    if (!test) return;

    addResult({
      testId: test.id,
      testTitle: test.title,
      studentName: session.studentName,
      answers: Object.entries(session.answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
      questions: test.questions,
      teacherId: test.teacherId,
    });

    endSession();
    toast.success("Test submitted successfully!");
    router.push("/student/results");
  }, [session, testCode, getTestByCode, addResult, endSession, router]);

  const handleExpire = useCallback(() => {
    if (!session) return;
    const test = getTestByCode(testCode);
    if (!test) return;

    addResult({
      testId: test.id,
      testTitle: test.title,
      studentName: session.studentName,
      answers: Object.entries(session.answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
      questions: test.questions,
      teacherId: test.teacherId,
    });

    endSession();
    toast.error("Time's up! Your test has been auto-submitted.");
    router.push("/student/results");
  }, [session, testCode, getTestByCode, addResult, endSession, router]);

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
      {/* Header Bar: progress + timer */}
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

      {/* Split Layout */}
      <div className="flex flex-1 gap-8">
        {/* Left: Question text (fixed) */}
        <div className="w-1/2">
          <div className="sticky top-20 rounded-2xl border bg-card p-6">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Question {currentIndex + 1} of {total}
            </div>
            <h2 className="text-lg font-semibold leading-relaxed">
              {currentQuestion?.text}
            </h2>
          </div>
        </div>

        {/* Right: Answer input */}
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

      {/* Navigation */}
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
            <Button onClick={handleSubmit}>Submit Test</Button>
          )}
        </div>
      </div>
    </div>
  );
}
