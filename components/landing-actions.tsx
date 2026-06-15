"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LandingActions() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const role = user?.publicMetadata?.role as string | undefined;

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && !role) {
      router.push("/role-setup");
    }
  }, [isLoaded, isSignedIn, role, router]);

  if (!isLoaded) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isSignedIn && role === "teacher") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.firstName}</h1>
        <p className="mt-2 text-muted-foreground">Manage your tests and view student results.</p>
        <Button className="mt-6" onClick={() => router.push("/teacher/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (isSignedIn && role === "student") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.firstName}</h1>
        <p className="mt-2 text-muted-foreground">Enter a test code to begin your exam.</p>
        <Button className="mt-6" onClick={() => router.push("/student/join")}>
          Join a Test
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">testche</h1>
      <p className="mt-3 max-w-md text-lg text-muted-foreground">
        Online testing platform for teachers and students.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button size="lg" onClick={() => router.push("/sign-in")}>
          I&apos;m a Teacher
        </Button>
        <Button size="lg" variant="outline" onClick={() => router.push("/student/join")}>
          I&apos;m a Student
        </Button>
      </div>
    </div>
  );
}
