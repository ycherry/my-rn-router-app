import { eq } from "drizzle-orm";
import { db } from "../../index";
import { implementations } from "../../tables/implementations";

export const implementationsDao = {
  async findById(id: number) {
    const result = await db.select().from(implementations).where(eq(implementations.id, id)).limit(1);
    return result[0] || null;
  },

  async findByBattleId(battleId: number) {
    return await db.select().from(implementations).where(eq(implementations.battleId, battleId));
  },

  async create(data: typeof implementations.$inferInsert) {
    const result = await db.insert(implementations).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<typeof implementations.$inferInsert>) {
    const result = await db.update(implementations).set(data).where(eq(implementations.id, id)).returning();
    return result[0];
  },

  async delete(id: number) {
    await db.delete(implementations).where(eq(implementations.id, id));
  },
};