import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const tests = sqliteTable('tests', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    timeLimitMinutes: integer('time_limit_minutes').notNull(),
    code: text('code').notNull().unique(),
    teacherId: text('teacher_id').notNull(),
    scoringFormula: text('scoring_formula'),
    isPublic: integer('is_public').notNull().default(0),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

export const questions = sqliteTable('questions', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    testId: text('test_id').notNull().references(() => tests.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    text: text('text').notNull(),
    options: text('options'),
    correctAnswer: text('correct_answer').notNull(),
    imageUrl: text('image_url'),
    codeBlock: text('code_block'),
    points: integer('points').notNull().default(1),
    order: integer('order').notNull(),
});

export const submissions = sqliteTable('submissions', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    testId: text('test_id').notNull().references(() => tests.id, { onDelete: 'cascade' }),
    studentName: text('student_name').notNull(),
    score: integer('score').notNull(),
    totalQuestions: integer('total_questions').notNull(),
    submittedAt: text('submitted_at').$defaultFn(() => new Date().toISOString()),
    teacherId: text('teacher_id').notNull(),
});

export const answers = sqliteTable('answers', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    submissionId: text('submission_id').notNull().references(() => submissions.id, { onDelete: 'cascade' }),
    questionId: text('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
    answer: text('answer').notNull(),
});

export const testsRelations = relations(tests, ({ many }) => ({
    questions: many(questions),
    submissions: many(submissions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
    test: one(tests, { fields: [questions.testId], references: [tests.id] }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
    test: one(tests, { fields: [submissions.testId], references: [tests.id] }),
    answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
    submission: one(submissions, { fields: [answers.submissionId], references: [submissions.id] }),
    question: one(questions, { fields: [answers.questionId], references: [questions.id] }),
}));
