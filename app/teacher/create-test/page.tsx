"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { Question, QuestionType } from "@/lib/store";
import { useTestStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface QuestionForm {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswer: string;
}

function freshQuestion(): QuestionForm {
  return {
    id: crypto.randomUUID(),
    type: "multiple-choice",
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  };
}

export default function CreateTestPage() {
  const router = useRouter();
  const { user } = useUser();
  const addTest = useTestStore((s) => s.addTest);
  const [title, setTitle] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [questions, setQuestions] = useState<QuestionForm[]>([freshQuestion()]);

  function addQuestion() {
    setQuestions((prev) => [...prev, freshQuestion()]);
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateQuestion(id: string, field: keyof QuestionForm, value: unknown) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  }

  function updateOption(questionId: string, index: number, value: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((o, i) => (i === index ? value : o)) }
          : q,
      ),
    );
  }

  function addOption(questionId: string) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, options: [...q.options, ""] } : q)),
    );
  }

  function removeOption(questionId: string, index: number) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q,
      ),
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a test title");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    for (const q of questions) {
      if (!q.text.trim()) {
        toast.error("Each question needs text");
        return;
      }
      if ((q.type === "multiple-choice" || q.type === "true-false") && !q.correctAnswer) {
        toast.error("Each question needs a correct answer selected");
        return;
      }
      if (q.type === "open" && !q.correctAnswer.trim()) {
        toast.error("Each open question needs a model answer");
        return;
      }
    }

    const mapped: Question[] = questions.map((q) => ({
      id: q.id,
      type: q.type,
      text: q.text,
      options: q.type === "multiple-choice"
        ? q.options.filter((o) => o.trim())
        : q.type === "true-false"
          ? ["True", "False"]
          : [],
      correctAnswer: q.correctAnswer,
    }));

    const test = addTest({
      title: title.trim(),
      timeLimitMinutes,
      questions: mapped,
      teacherId: user?.id ?? "unknown",
    });

    toast.success(`Test created! Code: ${test.code}`);
    router.push("/teacher/dashboard");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Create New Test</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Test Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midterm Exam"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-limit">Time Limit (minutes)</Label>
              <Input
                id="time-limit"
                type="number"
                min={1}
                max={999}
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Questions</h2>
            <Button type="button" variant="outline" onClick={addQuestion}>
              Add Question
            </Button>
          </div>

          {questions.map((question, idx) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle>Question {idx + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    Remove
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(v: QuestionType) =>
                      updateQuestion(question.id, "type", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True / False</SelectItem>
                      <SelectItem value="open">Open Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(question.id, "text", e.target.value)
                    }
                    placeholder="Enter the question..."
                  />
                </div>

                {(question.type === "multiple-choice") && (
                  <div className="space-y-3">
                    <Label>Answer Options</Label>
                    {question.options.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(question.id, optIdx, e.target.value)}
                          placeholder={`Option ${optIdx + 1}`}
                        />
                        {question.options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(question.id, optIdx)}
                          >
                            &times;
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(question.id)}
                    >
                      Add Option
                    </Button>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Select
                        value={question.correctAnswer}
                        onValueChange={(v) =>
                          updateQuestion(question.id, "correctAnswer", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.filter((o) => o.trim()).map((opt, optIdx) => (
                            <SelectItem key={optIdx} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {question.type === "true-false" && (
                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Select
                      value={question.correctAnswer}
                      onValueChange={(v) =>
                        updateQuestion(question.id, "correctAnswer", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="True">True</SelectItem>
                        <SelectItem value="False">False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {question.type === "open" && (
                  <div className="space-y-2">
                    <Label>Model Answer (for grading)</Label>
                    <Textarea
                      value={question.correctAnswer}
                      onChange={(e) =>
                        updateQuestion(question.id, "correctAnswer", e.target.value)
                      }
                      placeholder="Enter the expected correct answer..."
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Test</Button>
        </div>
      </form>
    </div>
  );
}
