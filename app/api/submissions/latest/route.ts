import { db } from "@/lib/db";
import { tests, submissions, answers, questions } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { ApiError, apiError } from "@/lib/db/helpers";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const testCode = url.searchParams.get("testCode");
    const studentName = url.searchParams.get("studentName");

    if (!testCode || !studentName) {
      return apiError(400, "testCode and studentName query parameters are required");
    }

    const test = await db.query.tests.findFirst({
      where: eq(tests.code, testCode.toUpperCase()),
    });

    if (!test) {
      return apiError(404, "Test not found");
    }

    const submission = await db.query.submissions.findFirst({
      where: and(
        eq(submissions.testId, test.id),
        eq(submissions.studentName, studentName),
      ),
      orderBy: desc(submissions.submittedAt),
    });

    if (!submission) {
      return apiError(404, "Submission not found");
    }

    const submissionAnswers = await db.query.answers.findMany({
      where: eq(answers.submissionId, submission.id),
    });

    const testQuestions = await db.query.questions.findMany({
      where: eq(questions.testId, test.id),
      orderBy: questions.order,
    });

    return Response.json({
      id: submission.id,
      testId: test.id,
      testTitle: test.title,
      studentName: submission.studentName,
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      submittedAt: submission.submittedAt,
      scoringFormula: test.scoringFormula ?? null,
      answers: submissionAnswers.map((a) => {
        const q = testQuestions.find((tq) => tq.id === a.questionId);
        return {
          questionId: a.questionId,
          questionText: q?.text ?? "",
          questionType: q?.type ?? "",
          answer: a.answer,
          correctAnswer: q?.correctAnswer ?? "",
          isCorrect: a.answer === q?.correctAnswer,
          imageUrl: q?.imageUrl ?? null,
          codeBlock: q?.codeBlock ? JSON.parse(q.codeBlock) : null,
          points: q?.points ?? 1,
        };
      }),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error.status, error.message);
    }
    return apiError(500, "Internal server error");
  }
}
