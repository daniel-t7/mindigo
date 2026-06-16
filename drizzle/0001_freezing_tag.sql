PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_answers` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`question_id` text NOT NULL,
	`answer` text NOT NULL,
	FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_answers`("id", "submission_id", "question_id", "answer") SELECT "id", "submission_id", "question_id", "answer" FROM `answers`;--> statement-breakpoint
DROP TABLE `answers`;--> statement-breakpoint
ALTER TABLE `__new_answers` RENAME TO `answers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`test_id` text NOT NULL,
	`student_name` text NOT NULL,
	`score` integer NOT NULL,
	`total_questions` integer NOT NULL,
	`submitted_at` text,
	`teacher_id` text NOT NULL,
	FOREIGN KEY (`test_id`) REFERENCES `tests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_submissions`("id", "test_id", "student_name", "score", "total_questions", "submitted_at", "teacher_id") SELECT "id", "test_id", "student_name", "score", "total_questions", "submitted_at", "teacher_id" FROM `submissions`;--> statement-breakpoint
DROP TABLE `submissions`;--> statement-breakpoint
ALTER TABLE `__new_submissions` RENAME TO `submissions`;