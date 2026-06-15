import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuestionType = "multiple-choice" | "true-false" | "open";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface ActiveTestSession {
  testCode: string;
  testTitle: string;
  timeLimitMinutes: number;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  startedAt: string;
  studentName: string;
}

interface ActiveTestStore {
  session: ActiveTestSession | null;
  startSession: (test: {
    code: string;
    title: string;
    timeLimitMinutes: number;
    questions: Question[];
  }, studentName: string) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  endSession: () => void;
}

export const useActiveTestStore = create<ActiveTestStore>()(
  persist(
    (set, get) => ({
      session: null,
      startSession: (test, studentName) => {
        set({
          session: {
            testCode: test.code,
            testTitle: test.title,
            timeLimitMinutes: test.timeLimitMinutes,
            questions: test.questions,
            currentQuestionIndex: 0,
            answers: {},
            startedAt: new Date().toISOString(),
            studentName,
          },
        });
      },
      setAnswer: (questionId, answer) => {
        const session = get().session;
        if (!session) return;
        set({
          session: {
            ...session,
            answers: { ...session.answers, [questionId]: answer },
          },
        });
      },
      nextQuestion: () => {
        const session = get().session;
        if (!session) return;
        const next = session.currentQuestionIndex + 1;
        if (next >= session.questions.length) return;
        set({ session: { ...session, currentQuestionIndex: next } });
      },
      prevQuestion: () => {
        const session = get().session;
        if (!session) return;
        const prev = session.currentQuestionIndex - 1;
        if (prev < 0) return;
        set({ session: { ...session, currentQuestionIndex: prev } });
      },
      endSession: () => set({ session: null }),
    }),
    { name: "testche-active-test" },
  ),
);
