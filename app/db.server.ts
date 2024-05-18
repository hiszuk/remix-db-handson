import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export function createClient() {
  const sqlite = new Database("./db/sqlite.db");
  return drizzle(sqlite)
}