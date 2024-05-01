import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { startups, type Startup } from "~/lib/schema";

export default class StartupController {
  static async getAllStartups() {
    const startups = await db.query.startups.findMany();
    return startups;
  }

  static async getStartUpbyID(id: number) {
    const startup = await db.query.startups.findFirst({
      where: eq(startups.id, id),
    });
    return startup;
  }

  static async createStartup(data: Startup) {
    await db.insert(startups).values(data);
    return { success: true };
  }

  static async updateStartup(id: number, data: Partial<Startup>) {
    await db.update(startups).set(data).where(eq(startups.id, id));
    return { success: true };
  }

  static async deleteStartup(id: number) {
    await db.delete(startups).where(eq(startups.id, id));
    return { success: true };
  }
}
