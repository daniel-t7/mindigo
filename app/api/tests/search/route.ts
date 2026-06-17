import { db } from "@/lib/db";
import { tests } from "@/lib/db/schema";
import { like, or, eq, and } from "drizzle-orm";
import { apiError } from "@/lib/db/helpers";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return Response.json({ results: [] });
    }

    const query = `%${q}%`;
    const results = await db.query.tests.findMany({
      columns: {
        id: true,
        title: true,
        timeLimitMinutes: true,
        code: true,
      },
      where: and(
        eq(tests.isPublic, 1),
        or(like(tests.title, query), like(tests.code, query)),
      ),
      limit: 20,
    });

    return Response.json({ results });
  } catch {
    return apiError(500, "Internal server error");
  }
}
