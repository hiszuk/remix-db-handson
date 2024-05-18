CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_label` text,
	`task_status` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO tasks(task_label, task_status) VALUES
('タスク一覧を表示する', true),
('タスクを新規登録する', false),
('タスクの状態を変更する', false),
('タスクを一件削除する', false);
