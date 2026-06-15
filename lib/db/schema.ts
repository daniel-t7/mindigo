import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const tests = sqliteTable('tests', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    timeLimitMinutes: integer('time_limit_minutes').notNull(),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});