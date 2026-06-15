import { auth, clerkClient } from "@clerk/nextjs/server";
import { apiError, ApiError } from "@/lib/db/helpers";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError(401, "Unauthorized");
    }

    const body = await request.json();
    const { role } = body;

    if (role !== "teacher" && role !== "student") {
      return apiError(400, "Role must be 'teacher' or 'student'");
    }

    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role },
    });

    return Response.json({ role });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error.status, error.message);
    }
    return apiError(500, "Internal server error");
  }
}
