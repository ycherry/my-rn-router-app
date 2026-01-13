import { eq } from "drizzle-orm";
import { db } from "../../index";
import { votes } from "../../tables/votes";

export const votesDao = {
  async findById(id: number) {
    const result = await db.select().from(votes).where(eq(votes.id, id)).limit(1);
    return result[0] || null;
  },

  async findAll() {
    return await db.select().from(votes);
  },

  async create(data: typeof votes.$inferInsert) {
    const result = await db.insert(votes).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<typeof votes.$inferInsert>) {
    const result = await db.update(votes).set(data).where(eq(votes.id, id)).returning();
    return result[0];
  },

  async delete(id: number) {
    await db.delete(votes).where(eq(votes.id, id));
  },
};