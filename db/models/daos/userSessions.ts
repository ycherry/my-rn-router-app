import { eq, sql } from "drizzle-orm";
import { db } from "../../index";
import { session } from "../../tables/betterAuthTables";

export const userSessionsDao = {
  async findByUserId(userId: string) {
    return await db.select().from(session).where(eq(session.userId, userId));
  },

  async findByToken(token: string) {
    const result = await db.select().from(session).where(eq(session.token, token)).limit(1);
    return result[0] || null;
  },

  async create(data: typeof session.$inferInsert) {
    const result = await db.insert(session).values(data).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof session.$inferInsert>) {
    const result = await db.update(session).set(data).where(eq(session.id, id)).returning();
    return result[0];
  },

  async delete(id: string) {
    return await db.delete(session).where(eq(session.id, id));
  },

  async deleteExpired() {
    return await db.delete(session).where(sql`expires_at < NOW()`);
  },
};