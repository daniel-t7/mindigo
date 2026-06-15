import { auth } from "@clerk/nextjs/server";
import { db } from "./index";
import { tests } from "./schema";
import { eq } from "drizzle-orm";

export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  return userId;
}

export function apiError(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function generateUniqueCode(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 100; attempt++) {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    const existing = await db
      .select({ id: tests.id })
      .from(tests)
      .where(eq(tests.code, code))
      .limit(1);
    if (existing.length === 0) return code;
  }
  throw new ApiError(500, "Failed to generate unique test code");
}
