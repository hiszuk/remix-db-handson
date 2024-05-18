import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./app/drizzle/schema.server.ts",
  out: "./app/drizzle",
  dbCredentials: {
    url: "./db/sqlite.db"
  },
});