import { and, eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { favorites, type Favorite } from "~/lib/schema";

export default class FavoriteController {
  static async getAllFavorites() {
    const favorites = await db.query.favorites.findMany();
    return favorites;
  }

  static async getFavoriteByID(userId: string, startupId: number) {
    const favorite = await db.query.favorites.findFirst({
      where: and(eq(favorites.userId, userId), eq(favorites.startupId, startupId)),
    });
    return favorite;
  }

  static async createFavorite(data: Favorite) {
    await db.insert(favorites).values(data);
    return { success: true };
  }

  static async deleteFavorite(userId: string, startupId: number) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.startupId, startupId)));
    return { success: true };
  }
}
