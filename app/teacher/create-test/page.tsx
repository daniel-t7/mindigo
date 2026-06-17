"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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

export default function CreateTestPage() {
  const t = useTranslations("teacher.createTest");
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [questions, setQuestions] = useState<QuestionForm[]>([freshQuestion()]);
  const [scoringFormula, setScoringFormula] = useState<GradeThreshold[]>([
    { minPoints: 0, label: "F" },
  ]);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);

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
      toast.error(t("toastMissingTitle"));
      return;
    }

    if (questions.length === 0) {
      toast.error(t("toastMissingQuestion"));
      return;
    }

    for (const q of questions) {
      if (!q.text.trim()) {
        toast.error(t("toastMissingText"));
        return;
      }
      if ((q.type === "multiple-choice" || q.type === "true-false") && !q.correctAnswer) {
        toast.error(t("toastMissingCorrectAnswer"));
        return;
      }
      if (q.type === "open" && !q.correctAnswer.trim()) {
        toast.error(t("toastMissingModelAnswer"));
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
      const res = await fetch("/api/tests", {
        method: "POST",
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
        throw new Error(err.error ?? "Failed to create test");
      }

      const test = await res.json();
      toast.success(t("toastCreated", { code: test.code }));
      router.push("/teacher/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("toastFailed"));
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("testDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("testTitle")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("titlePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-limit">{t("timeLimit")}</Label>
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
                {t("publicSwitch")}
              </Label>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>{t("scoringFormula")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("scoringDescription")}
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
                      placeholder={t("min")}
                    />
                    <span className="text-xs text-muted-foreground">{t("pts")}</span>
                    <Input
                      value={threshold.label}
                      onChange={(e) =>
                        updateThreshold(idx, "label", e.target.value)
                      }
                      placeholder={t("gradeLabelPlaceholder")}
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
                {t("addThreshold")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("questions")}</h2>
            <Button type="button" variant="outline" onClick={addQuestion}>
              {t("addQuestion")}
            </Button>
          </div>

          {questions.map((question, idx) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle>{t("questionTitle", { n: idx + 1 })}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    {t("remove")}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>{t("questionType")}</Label>
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
                        <SelectItem value="multiple-choice">{t("multipleChoice")}</SelectItem>
                        <SelectItem value="true-false">{t("trueFalse")}</SelectItem>
                        <SelectItem value="open">{t("openAnswer")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>{t("points")}</Label>
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
                  <Label>{t("questionText")}</Label>
                  <Textarea
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(question.id, "text", e.target.value)
                    }
                    placeholder={t("questionPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("imageUrl")}</Label>
                  <Input
                    value={question.imageUrl}
                    onChange={(e) =>
                      updateQuestion(question.id, "imageUrl", e.target.value)
                    }
                    placeholder={t("imagePlaceholder")}
                  />
                  {question.imageUrl && (
                    <div className="relative mt-2 overflow-hidden rounded-lg border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={question.imageUrl}
                        alt={t("imageAlt")}
                        className="max-h-48 w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t("codeBlock")}</Label>
                  <div className="flex gap-2">
                    <Select
                      value={question.codeLanguage}
                      onValueChange={(v) =>
                        updateQuestion(question.id, "codeLanguage", v)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder={t("language")} />
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
                        {t("remove")}
                      </Button>
                    )}
                  </div>
                  {question.codeLanguage && (
                    <Textarea
                      value={question.codeCode}
                      onChange={(e) =>
                        updateQuestion(question.id, "codeCode", e.target.value)
                      }
                      placeholder={t("codePlaceholder", { language: question.codeLanguage })}
                      className="min-h-[100px] font-mono text-sm"
                    />
                  )}
                </div>

                {(question.type === "multiple-choice") && (
                  <div className="space-y-3">
                    <Label>{t("answerOptions")}</Label>
                    {question.options.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(question.id, optIdx, e.target.value)}
                          placeholder={t("optionPlaceholder", { n: optIdx + 1 })}
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
                      {t("addOption")}
                    </Button>
                    <Separator />
                    <div className="space-y-2">
                      <Label>{t("correctAnswer")}</Label>
                      <Select
                        value={question.correctAnswer}
                        onValueChange={(v) =>
                          updateQuestion(question.id, "correctAnswer", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectCorrectAnswer")} />
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
                    <Label>{t("correctAnswer")}</Label>
                    <Select
                      value={question.correctAnswer}
                      onValueChange={(v) =>
                        updateQuestion(question.id, "correctAnswer", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCorrectAnswer")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="True">{t("true")}</SelectItem>
                        <SelectItem value="False">{t("false")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {question.type === "open" && (
                  <div className="space-y-2">
                    <Label>{t("modelAnswer")}</Label>
                    <Textarea
                      value={question.correctAnswer}
                      onChange={(e) =>
                        updateQuestion(question.id, "correctAnswer", e.target.value)
                      }
                      placeholder={t("modelAnswerPlaceholder")}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? t("creating") : t("createTest")}
          </Button>
        </div>
      </form>
    </div>
  );
}
