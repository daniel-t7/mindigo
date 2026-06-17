"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActiveTestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startSession = useActiveTestStore((s) => s.startSession);
  const [code, setCode] = useState(() => searchParams.get("code")?.toUpperCase() ?? "");
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      toast.error("Please enter a test code");
      setLoading(false);
      return;
    }

    if (!studentName.trim()) {
      toast.error("Please enter your name");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/tests/code/${normalized}`);
      if (!res.ok) {
        toast.error("Test not found. Check the code and try again.");
        setLoading(false);
        return;
      }

      const test = await res.json();
      startSession(test, studentName.trim());
      router.push(`/student/test/${normalized}`);
    } catch {
      toast.error("Failed to look up test. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Join a Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Test Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABC123"
                className="text-center text-lg font-mono tracking-widest uppercase"
                maxLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Joining..." : "Start Test"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function JoinTestPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center p-4"><p className="text-muted-foreground">Loading...</p></div>}>
      <JoinForm />
    </Suspense>
  );
}
