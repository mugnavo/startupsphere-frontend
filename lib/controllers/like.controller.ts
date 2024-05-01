import { and, eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { likes, type Like } from "~/lib/schema";

export default class LikeController {
  static async getAllLikes() {
    const likes = await db.query.likes.findMany();
    return likes;
  }

  static async getLikeById(userId: string, startupId: number) {
    const like = await db.query.likes.findFirst({
      where: and(eq(likes.userId, userId), eq(likes.startupId, startupId)),
    });
    return like;
  }

  static async createLike(data: Like) {
    await db.insert(likes).values(data);
    return { success: true };
  }

  static async deleteLike(userId: string, startupId: number) {
    await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.startupId, startupId)));
    return { success: true };
  }
}
