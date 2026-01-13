import { eq } from "drizzle-orm";
import { db } from "../../index";
import { account } from "../../tables/betterAuthTables";

export const userTokensDao = {
  async findByUserId(userId: string) {
    return await db.select().from(account).where(eq(account.userId, userId));
  },

  async findByProviderId(providerId: string) {
    return await db.select().from(account).where(eq(account.providerId, providerId));
  },

  async create(data: typeof account.$inferInsert) {
    const result = await db.insert(account).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof account.$inferInsert>) {
    const result = await db.update(account).set(data).where(eq(account.id, id)).returning();
    return result[0];
  },

  async delete(id: string) {
    return await db.delete(account).where(eq(account.id, id));
  },
};