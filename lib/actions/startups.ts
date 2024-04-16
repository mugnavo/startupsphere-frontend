"use server";

import { generateId } from "lucia";

import { db } from "~/lib/db";
import { startups, type Startup } from "~/lib/schema";

export async function getAllStartups() {
  const startups = await db.query.startups.findMany();
  return startups;
}

export async function createStartup(data: Omit<Startup, "id">) {
  const id = generateId(15);
  await db.insert(startups).values({ ...data, id });
  return { success: true };
}
