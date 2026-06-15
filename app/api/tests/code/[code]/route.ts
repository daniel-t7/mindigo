import { db } from "@/lib/db";
import { tests, questions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ApiError, apiError } from "@/lib/db/helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;
    const normalized = code.toUpperCase();

    const test = await db.query.tests.findFirst({
      where: eq(tests.code, normalized),
      columns: {
        id: true,
        title: true,
        timeLimitMinutes: true,
        code: true,
        createdAt: true,
      },
      with: {
        questions: {
          columns: {
            id: true,
            type: true,
            text: true,
            options: true,
            order: true,
          },
          orderBy: questions.order,
        },
      },
    });

    if (!test) {
      return apiError(404, "Test not found");
    }

    const parsed = {
      ...test,
      questions: test.questions.map((q) => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : [],
      })),
    };

    return Response.json(parsed);
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error.status, error.message);
    }
    return apiError(500, "Internal server error");
  }
}
