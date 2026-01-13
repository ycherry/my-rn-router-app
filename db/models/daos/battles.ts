import { eq } from "drizzle-orm";
import { db } from "../../index";
import { battles } from "../../tables/battles";

export const battlesDao = {
  async findById(id: number) {
    const result = await db.select().from(battles).where(eq(battles.id, id)).limit(1);
    return result[0] || null;
  },

  async findAll() {
    return await db.select().from(battles);
  },

  async findByCreatedBy(createdBy: string) {
    return await db.select().from(battles).where(eq(battles.createdBy, createdBy));
  },

  async create(data: typeof battles.$inferInsert) {
    const result = await db.insert(battles).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<typeof battles.$inferInsert>) {
    const result = await db.update(battles).set(data).where(eq(battles.id, id)).returning();
    return result[0];
  },

  async delete(id: number) {
    await db.delete(battles).where(eq(battles.id, id));
  },
};