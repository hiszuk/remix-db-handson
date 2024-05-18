import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("task_label"),
  status: integer("task_status", { mode: "boolean" }).notNull().default(false),
});
