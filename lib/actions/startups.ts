"use server";

import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { startups, type Startup } from "~/lib/schema";

export async function getAllStartups() {
  const startups = await db.query.startups.findMany();
  return startups;
}

export async function getStartUpbyID(id: number) {
  const startup = await db.query.startups.findFirst({
    where: eq(startups.id, id),
  });
  return startup;
}

export async function createStartup(data: Startup) {
  await db.insert(startups).values(data);
  return { success: true };
}

export async function updateStartup(id: number, data: Partial<Startup>) {
  await db.update(startups).set(data).where(eq(startups.id, id));
  return { success: true };
}

export async function deleteStartup(id: number) {
  await db.delete(startups).where(eq(startups.id, id));
  return { success: true };
}
