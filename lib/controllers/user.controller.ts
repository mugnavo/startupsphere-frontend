import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { UserWithPassword, users, type User } from "~/lib/schema";

export default class UserController {
  static async getAllUsers() {
    const users = await db.query.users.findMany();
    return users;
  }

  static async getUserbyID(id: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return user;
  }

  static async createUser(data: UserWithPassword) {
    await db.insert(users).values(data);
    return { success: true };
  }

  static async updateUser(id: string, data: Partial<User>) {
    await db.update(users).set(data).where(eq(users.id, id));
    return { success: true };
  }

  static async deleteUser(id: string) {
    await db.delete(users).where(eq(users.id, id));
    return { success: true };
  }
}
