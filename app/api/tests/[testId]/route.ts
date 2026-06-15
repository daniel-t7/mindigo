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
