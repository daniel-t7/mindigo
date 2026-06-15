CREATE TABLE `answers` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`question_id` text NOT NULL,
	`answer` text NOT NULL,
	FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`test_id` text NOT NULL,
	`type` text NOT NULL,
	`text` text NOT NULL,
	`options` text,
	`correct_answer` text NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`test_id`) REFERENCES `tests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`test_id` text NOT NULL,
	`student_name` text NOT NULL,
	`score` integer NOT NULL,
	`total_questions` integer NOT NULL,
	`submitted_at` text,
	`teacher_id` text NOT NULL,
	FOREIGN KEY (`test_id`) REFERENCES `tests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tests` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`time_limit_minutes` integer NOT NULL,
	`code` text NOT NULL,
	`teacher_id` text NOT NULL,
	`created_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tests_code_unique` ON `tests` (`code`);