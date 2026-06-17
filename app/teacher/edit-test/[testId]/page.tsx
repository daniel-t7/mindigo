"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { QuestionType, GradeThreshold } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
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
  imageUrl: string;
  codeLanguage: string;
  codeCode: string;
  points: number;
}

function freshQuestion(): QuestionForm {
  return {
    id: crypto.randomUUID(),
    type: "multiple-choice",
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    imageUrl: "",
    codeLanguage: "",
    codeCode: "",
    points: 1,
  };
}

const CODE_LANGUAGES = [
  "C#",
  "Java",
  "JavaScript",
  "Python",
  "C++",
  "TypeScript",
  "Go",
  "Rust",
  "SQL",
  "HTML",
  "CSS",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Other",
];

export default function EditTestPage() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [scoringFormula, setScoringFormula] = useState<GradeThreshold[]>([
    { minPoints: 0, label: "F" },
  ]);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  function updateThreshold(index: number, field: keyof GradeThreshold, value: unknown) {
    setScoringFormula((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  }

  function addThreshold() {
    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const nextMin = scoringFormula.length > 0
      ? scoringFormula[scoringFormula.length - 1].minPoints + 1
      : 0;
    setScoringFormula((prev) => [
      ...prev,
      { minPoints: Math.min(nextMin, maxPoints), label: "" },
    ]);
  }

  function removeThreshold(index: number) {
    setScoringFormula((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    fetch(`/api/tests/${testId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Test not found");
        return res.json();
      })
      .then((data) => {
        setTitle(data.title);
        setTimeLimitMinutes(data.timeLimitMinutes);
        setScoringFormula(data.scoringFormula ? JSON.parse(data.scoringFormula) : [{ minPoints: 0, label: "F" }]);
        setIsPublic(data.isPublic ?? false);
        setQuestions(
          data.questions.map((q: {
            id: string;
            type: string;
            text: string;
            options: string | null;
            correctAnswer: string;
            imageUrl: string | null;
            codeBlock: string | null;
            points: number | null;
          }) => {
            const parsedCodeBlock = q.codeBlock ? JSON.parse(q.codeBlock) : null;
            return {
              id: q.id,
              type: q.type as QuestionType,
              text: q.text,
              options: q.options ? JSON.parse(q.options) : [],
              correctAnswer: q.correctAnswer,
              imageUrl: q.imageUrl ?? "",
              codeLanguage: parsedCodeBlock?.language ?? "",
              codeCode: parsedCodeBlock?.code ?? "",
              points: q.points ?? 1,
            };
          }),
        );
      })
      .catch(() => {
        toast.error("Test not found");
        router.push("/teacher/dashboard");
      })
      .finally(() => setLoading(false));
  }, [testId, router]);

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

  async function handleSubmit(e: React.FormEvent) {
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

    setSaving(true);

    const sortedFormula = [...scoringFormula].sort((a, b) => a.minPoints - b.minPoints);

    const mapped = questions.map((q) => ({
      id: q.id,
      type: q.type,
      text: q.text,
      options: q.type === "multiple-choice"
        ? q.options.filter((o) => o.trim())
        : q.type === "true-false"
          ? ["True", "False"]
          : [],
      correctAnswer: q.correctAnswer,
      imageUrl: q.imageUrl || undefined,
      codeBlock: q.codeLanguage && q.codeCode
        ? { language: q.codeLanguage, code: q.codeCode }
        : undefined,
      points: q.points,
    }));

    try {
      const res = await fetch(`/api/tests/${testId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          timeLimitMinutes,
          questions: mapped,
          scoringFormula: sortedFormula,
          isPublic,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save test");
      }

      toast.success("Test saved");
      router.push("/teacher/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save test");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading test...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Edit Test</h1>

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

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
              <Label htmlFor="is-public" className="cursor-pointer">
                Make this test publicly searchable
              </Label>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Scoring Formula (optional)</Label>
              <p className="text-xs text-muted-foreground">
                Define grade thresholds based on total points earned.
              </p>
              <div className="space-y-2">
                {scoringFormula.map((threshold, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      className="w-24"
                      value={threshold.minPoints}
                      onChange={(e) =>
                        updateThreshold(idx, "minPoints", Number(e.target.value))
                      }
                      placeholder="Min"
                    />
                    <span className="text-xs text-muted-foreground">pts</span>
                    <Input
                      value={threshold.label}
                      onChange={(e) =>
                        updateThreshold(idx, "label", e.target.value)
                      }
                      placeholder="Grade label (e.g. A, B, C...)"
                      className="flex-1"
                    />
                    {scoringFormula.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeThreshold(idx)}
                      >
                        &times;
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addThreshold}
              >
                Add Threshold
              </Button>
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
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
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
                  <div className="w-24 space-y-2">
                    <Label>Points</Label>
                    <Input
                      type="number"
                      min={1}
                      value={question.points}
                      onChange={(e) =>
                        updateQuestion(question.id, "points", Math.max(1, Number(e.target.value)))
                      }
                    />
                  </div>
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

                <div className="space-y-2">
                  <Label>Image URL (optional)</Label>
                  <Input
                    value={question.imageUrl}
                    onChange={(e) =>
                      updateQuestion(question.id, "imageUrl", e.target.value)
                    }
                    placeholder="https://example.com/image.png"
                  />
                  {question.imageUrl && (
                    <div className="relative mt-2 overflow-hidden rounded-lg border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={question.imageUrl}
                        alt="Preview"
                        className="max-h-48 w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Code Block (optional)</Label>
                  <div className="flex gap-2">
                    <Select
                      value={question.codeLanguage}
                      onValueChange={(v) =>
                        updateQuestion(question.id, "codeLanguage", v)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {CODE_LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {question.codeLanguage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateQuestion(question.id, "codeLanguage", "");
                          updateQuestion(question.id, "codeCode", "");
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  {question.codeLanguage && (
                    <Textarea
                      value={question.codeCode}
                      onChange={(e) =>
                        updateQuestion(question.id, "codeCode", e.target.value)
                      }
                      placeholder={`Paste your ${question.codeLanguage} code here...`}
                      className="min-h-[100px] font-mono text-sm"
                    />
                  )}
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
          <Button type="button" variant="outline" onClick={() => router.push("/teacher/dashboard")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
