import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as schema from "./schema";

const connection = new Client({ connectionString: process.env.DATABASE_URL! });

export const db = drizzle(connection, { schema });
