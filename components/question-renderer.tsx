"use client";

import type { Question } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface QuestionRendererProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  if (question.type === "multiple-choice") {
    return (
      <RadioGroup value={value} onValueChange={onChange} className="gap-3">
        {question.options.map((option, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-lg border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
            <RadioGroupItem value={option} id={`q-${question.id}-o-${idx}`} />
            <Label htmlFor={`q-${question.id}-o-${idx}`} className="flex-1 cursor-pointer text-sm">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  }

  if (question.type === "true-false") {
    return (
      <RadioGroup value={value} onValueChange={onChange} className="gap-3">
        {["True", "False"].map((option) => (
          <div key={option} className="flex items-center gap-3 rounded-lg border p-3 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
            <RadioGroupItem value={option} id={`q-${question.id}-tf-${option}`} />
            <Label htmlFor={`q-${question.id}-tf-${option}`} className="flex-1 cursor-pointer text-sm">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  }

  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer here..."
      className="min-h-[120px] resize-y"
    />
  );
}
