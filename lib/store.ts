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

export interface Test {
  id: string;
  title: string;
  timeLimitMinutes: number;
  code: string;
  questions: Question[];
  teacherId: string;
  createdAt: string;
}

export interface Answer {
  questionId: string;
  answer: string;
}

export interface StudentResult {
  id: string;
  testId: string;
  testTitle: string;
  studentName: string;
  answers: Answer[];
  score: number;
  totalQuestions: number;
  submittedAt: string;
  teacherId: string;
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

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generateId(): string {
  return crypto.randomUUID();
}

interface TestStore {
  tests: Test[];
  addTest: (data: {
    title: string;
    timeLimitMinutes: number;
    questions: Question[];
    teacherId: string;
  }) => Test;
  getTestByCode: (code: string) => Test | undefined;
  getTestsByTeacher: (teacherId: string) => Test[];
  getTestById: (id: string) => Test | undefined;
}

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      tests: [],
      addTest: (data) => {
        const test: Test = {
          id: generateId(),
          title: data.title,
          timeLimitMinutes: data.timeLimitMinutes,
          code: generateCode(),
          questions: data.questions,
          teacherId: data.teacherId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tests: [...state.tests, test] }));
        return test;
      },
      getTestByCode: (code) => get().tests.find((t) => t.code === code),
      getTestsByTeacher: (teacherId) =>
        get().tests.filter((t) => t.teacherId === teacherId),
      getTestById: (id) => get().tests.find((t) => t.id === id),
    }),
    { name: "testche-tests" },
  ),
);

interface ActiveTestStore {
  session: ActiveTestSession | null;
  startSession: (test: Test, studentName: string) => void;
  setAnswer: (questionId: string, answer: string) => void;
  goToQuestion: (index: number) => void;
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
      goToQuestion: (index) => {
        const session = get().session;
        if (!session) return;
        if (index < 0 || index >= session.questions.length) return;
        set({ session: { ...session, currentQuestionIndex: index } });
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

interface ResultsStore {
  results: StudentResult[];
  addResult: (data: {
    testId: string;
    testTitle: string;
    studentName: string;
    answers: Answer[];
    questions: Question[];
    teacherId: string;
  }) => StudentResult;
  getResultsByTest: (testId: string) => StudentResult[];
  getResultsByTeacher: (teacherId: string) => StudentResult[];
  getResultById: (id: string) => StudentResult | undefined;
}

export const useResultsStore = create<ResultsStore>()(
  persist(
    (set, get) => ({
      results: [],
      addResult: (data) => {
        let score = 0;
        for (const answer of data.answers) {
          const question = data.questions.find(
            (q) => q.id === answer.questionId,
          );
          if (question && question.correctAnswer === answer.answer) {
            score++;
          }
        }
        const result: StudentResult = {
          id: generateId(),
          testId: data.testId,
          testTitle: data.testTitle,
          studentName: data.studentName,
          answers: data.answers,
          score,
          totalQuestions: data.questions.length,
          submittedAt: new Date().toISOString(),
          teacherId: data.teacherId,
        };
        set((state) => ({ results: [...state.results, result] }));
        return result;
      },
      getResultsByTest: (testId) =>
        get().results.filter((r) => r.testId === testId),
      getResultsByTeacher: (teacherId) =>
        get().results.filter((r) => r.teacherId === teacherId),
      getResultById: (id) => get().results.find((r) => r.id === id),
    }),
    { name: "testche-results" },
  ),
);
