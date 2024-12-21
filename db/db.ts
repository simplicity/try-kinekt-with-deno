import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.ts";

const { Pool } = pg;

// TODO fall back to in-memory sqlite db when this isn't provided
const pool = new Pool({ connectionString: Deno.env.get("DATABASE_URL") });

export const db = drizzle(pool, {
  schema,
  logger: false,
  casing: "snake_case",
});
