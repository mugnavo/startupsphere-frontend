"use server";

import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { db } from "~/lib/db";
import { startups, type Startup } from "~/lib/schema";

export async function getAllStartups() {
  const startups = await db.query.startups.findMany();
  return startups;
}

export async function getStartUpbyID(id: string) {
  const startup = await db.query.startups.findFirst({
    where: eq(startups.id, id),
  });
  return startup;
}

export async function createStartup(data: Omit<Startup, "id">) {
  const id = generateId(15);
  await db.insert(startups).values({ ...data, id });
  return { success: true };
}

export async function updateStartup(id: string, data: Partial<Startup>) {
  await db.update(startups).set(data).where(eq(startups.id, id));
  return { success: true };
}
