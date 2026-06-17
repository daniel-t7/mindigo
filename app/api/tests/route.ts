import { db } from "@/lib/db";
import { tests, questions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, generateUniqueCode, ApiError, apiError } from "@/lib/db/helpers";

export async function POST(request: Request) {
  try {
    const teacherId = await requireAuth();
    const body = await request.json();

    if (!body.title?.trim()) {
      return apiError(400, "Title is required");
    }
    if (!body.questions?.length) {
      return apiError(400, "At least one question is required");
    }

    const code = await generateUniqueCode();
    const testId = crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(tests).values({
        id: testId,
        title: body.title.trim(),
        timeLimitMinutes: body.timeLimitMinutes ?? 30,
        code,
        teacherId,
        scoringFormula: body.scoringFormula?.length
          ? JSON.stringify(body.scoringFormula)
          : null,
        isPublic: body.isPublic ? 1 : 0,
      });

      for (let i = 0; i < body.questions.length; i++) {
        const q = body.questions[i];
        await tx.insert(questions).values({
          id: crypto.randomUUID(),
          testId,
          type: q.type,
          text: q.text,
          options: q.options?.length ? JSON.stringify(q.options) : null,
          correctAnswer: q.correctAnswer,
          imageUrl: q.imageUrl || null,
          codeBlock: q.codeBlock ? JSON.stringify(q.codeBlock) : null,
          points: q.points ?? 1,
          order: i,
        });
      }
    });

    return Response.json({ id: testId, title: body.title.trim(), code });
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
    const testId = url.searchParams.get("id");

    if (testId) {
      const test = await db.query.tests.findFirst({
        where: eq(tests.id, testId),
        with: {
          questions: {
            orderBy: questions.order,
          },
        },
      });

      if (!test || test.teacherId !== teacherId) {
        return apiError(404, "Test not found");
      }

      return Response.json(test);
    }

    const teacherTests = await db.query.tests.findMany({
      where: eq(tests.teacherId, teacherId),
      with: {
        questions: {
          columns: { id: true },
        },
      },
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    });

    const result = teacherTests.map((t) => ({
      id: t.id,
      title: t.title,
      timeLimitMinutes: t.timeLimitMinutes,
      code: t.code,
      createdAt: t.createdAt,
      questionCount: t.questions.length,
    }));

    return Response.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error.status, error.message);
    }
    return apiError(500, "Internal server error");
  }
}
