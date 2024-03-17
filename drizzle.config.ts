import type { Config } from "drizzle-kit";

export default {
  out: "./.drizzle",
  schema: "./lib/schema.ts",
  breakpoints: true,
  driver: "mysql2",
  dbCredentials: {
    host: process.env.MYSQL_HOST!,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE!,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
} satisfies Config;
