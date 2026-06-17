ALTER TABLE `questions` ADD `points` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `tests` ADD `scoring_formula` text;