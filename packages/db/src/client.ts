import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const fallbackDatabaseUrl = "postgres://labs:labs_dev_password@localhost:5432/labs";

const queryClient = postgres(process.env.DATABASE_URL ?? fallbackDatabaseUrl);

export const db = drizzle({
  client: queryClient,
  schema,
});

export type Db = typeof db;
