"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTestStore, useActiveTestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function JoinTestPage() {
  const router = useRouter();
  const getTestByCode = useTestStore((s) => s.getTestByCode);
  const startSession = useActiveTestStore((s) => s.startSession);
  const [code, setCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);

  function handleJoin(e: React.FormEvent) {
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

    const test = getTestByCode(normalized);
    if (!test) {
      toast.error("Test not found. Check the code and try again.");
      setLoading(false);
      return;
    }

    startSession(test, studentName.trim());
    router.push(`/student/test/${normalized}`);
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
