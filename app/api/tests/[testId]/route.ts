import { db } from "@/lib/db";
import { tests, questions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, ApiError, apiError } from "@/lib/db/helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ testId: string }> },
) {
  try {
    const teacherId = await requireAuth();
    const { testId } = await params;

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
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error.status, error.message);
    }
    return apiError(500, "Internal server error");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ testId: string }> },
) {
  try {
    const teacherId = await requireAuth();
    const { testId } = await params;
    const body = await request.json();

    const test = await db.query.tests.findFirst({
      where: eq(tests.id, testId),
      with: { questions: { columns: { id: true } } },
    });

    if (!test || test.teacherId !== teacherId) {
      return apiError(404, "Test not found");
    }

    await db.transaction(async (tx) => {
      if (body.title !== undefined || body.timeLimitMinutes !== undefined || body.scoringFormula !== undefined || body.isPublic !== undefined) {
        await tx
          .update(tests)
          .set({
            ...(body.title !== undefined && { title: body.title.trim() }),
            ...(body.timeLimitMinutes !== undefined && {
              timeLimitMinutes: body.timeLimitMinutes,
            }),
            ...(body.scoringFormula !== undefined && {
              scoringFormula: body.scoringFormula?.length
                ? JSON.stringify(body.scoringFormula)
                : null,
            }),
            ...(body.isPublic !== undefined && { isPublic: body.isPublic ? 1 : 0 }),
          })
          .where(eq(tests.id, testId));
      }

      if (body.questions !== undefined) {
        const existingIds = new Set(
          test.questions.map((q: { id: string }) => q.id),
        );
        const receivedIds = new Set<string>();

        for (let i = 0; i < body.questions.length; i++) {
          const q = body.questions[i];
          const qId = q.id ?? crypto.randomUUID();
          receivedIds.add(qId);

          const values = {
            type: q.type,
            text: q.text,
            options: q.options?.length ? JSON.stringify(q.options) : null,
            correctAnswer: q.correctAnswer,
            imageUrl: q.imageUrl || null,
            codeBlock: q.codeBlock ? JSON.stringify(q.codeBlock) : null,
            points: q.points ?? 1,
            order: i,
          };

          if (existingIds.has(qId)) {
            await tx
              .update(questions)
              .set(values)
              .where(eq(questions.id, qId));
          } else {
            await tx.insert(questions).values({
              id: qId,
              testId,
              ...values,
            });
          }
        }

        for (const oldId of test.questions.map(
          (q: { id: string }) => q.id,
        )) {
          if (!receivedIds.has(oldId)) {
            await tx.delete(questions).where(eq(questions.id, oldId));
          }
        }
      }
    });

    const updated = await db.query.tests.findFirst({
      where: eq(tests.id, testId),
      with: {
        questions: { orderBy: questions.order },
      },
    });

    return Response.json(updated);
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error.status, error.message);
    }
    return apiError(500, "Internal server error");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ testId: string }> },
) {
  try {
    const teacherId = await requireAuth();
    const { testId } = await params;

    const test = await db.query.tests.findFirst({
      where: eq(tests.id, testId),
      columns: { id: true, teacherId: true },
    });

    if (!test || test.teacherId !== teacherId) {
      return apiError(404, "Test not found");
    }

    await db.delete(tests).where(eq(tests.id, testId));

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error.status, error.message);
    }
    return apiError(500, "Internal server error");
  }
}
