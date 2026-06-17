import { db } from "@/lib/db";
import { tests, questions, submissions, answers } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, ApiError, apiError } from "@/lib/db/helpers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.testCode?.trim()) {
      return apiError(400, "Test code is required");
    }
    if (!body.studentName?.trim()) {
      return apiError(400, "Student name is required");
    }
    if (!body.answers?.length) {
      return apiError(400, "At least one answer is required");
    }

    const normalized = body.testCode.toUpperCase();

    const test = await db.query.tests.findFirst({
      where: eq(tests.code, normalized),
      with: {
        questions: {
          orderBy: questions.order,
        },
      },
    });

    if (!test) {
      return apiError(404, "Test not found");
    }

    let totalPoints = 0;
    let earnedPoints = 0;
    const answerRows: { id: string; submissionId: string; questionId: string; answer: string }[] = [];

    for (const q of test.questions) {
      const qPoints = q.points ?? 1;
      totalPoints += qPoints;
      const studentAnswer = body.answers.find(
        (a: { questionId: string }) => a.questionId === q.id,
      );
      const answerValue = studentAnswer?.answer ?? "";
      const isCorrect = answerValue === q.correctAnswer;
      if (isCorrect) earnedPoints += qPoints;

      answerRows.push({
        id: crypto.randomUUID(),
        submissionId: "",
        questionId: q.id,
        answer: answerValue,
      });
    }

    const submissionId = crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(submissions).values({
        id: submissionId,
        testId: test.id,
        studentName: body.studentName.trim(),
        score: earnedPoints,
        totalQuestions: totalPoints,
        teacherId: test.teacherId,
      });

      for (const row of answerRows) {
        row.submissionId = submissionId;
        await tx.insert(answers).values(row);
      }
    });

    return Response.json({
      id: submissionId,
      testId: test.id,
      testTitle: test.title,
      studentName: body.studentName.trim(),
      score: earnedPoints,
      totalQuestions: totalPoints,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error.status, error.message);
    }
    return apiError(500, "Internal server error");
  }
}

export async function GET(request: Request) {
  try {
    const teacherId = await requireAuth();
    const url = new URL(request.url);
    const testId = url.searchParams.get("testId");

    if (!testId) {
      return apiError(400, "testId query parameter is required");
    }

    const test = await db.query.tests.findFirst({
      where: eq(tests.id, testId),
    });

    if (!test || test.teacherId !== teacherId) {
      return apiError(404, "Test not found");
    }

    const result = await db.query.submissions.findMany({
      where: eq(submissions.testId, testId),
      with: {
        answers: true,
      },
      orderBy: desc(submissions.submittedAt),
    });

    const testQuestions = await db.query.questions.findMany({
      where: eq(questions.testId, testId),
      orderBy: questions.order,
    });

    return Response.json({
      test,
      submissions: result.map((s) => ({
        id: s.id,
        studentName: s.studentName,
        score: s.score,
        totalQuestions: s.totalQuestions,
        submittedAt: s.submittedAt,
        answers: s.answers.map((a) => {
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
      })),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error.status, error.message);
    }
    return apiError(500, "Internal server error");
  }
}
