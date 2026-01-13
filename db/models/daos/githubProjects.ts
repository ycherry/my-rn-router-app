import { eq } from "drizzle-orm";
import { db } from "../../index";
import { githubProjects } from "../../tables/githubProjects";

export const githubProjectsDao = {
  async findById(id: number) {
    const result = await db.select().from(githubProjects).where(eq(githubProjects.id, id)).limit(1);
    return result[0] || null;
  },

  async findAll() {
    return await db.select().from(githubProjects);
  },

  async findByUserId(userId: string) {
    return await db.select().from(githubProjects).where(eq(githubProjects.userId, userId));
  },

  async findByUrl(url: string) {
    const result = await db.select().from(githubProjects).where(eq(githubProjects.url, url)).limit(1);
    return result[0] || null;
  },

  async create(data: typeof githubProjects.$inferInsert) {
    const result = await db.insert(githubProjects).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<typeof githubProjects.$inferInsert>) {
    const result = await db.update(githubProjects).set(data).where(eq(githubProjects.id, id)).returning();
    return result[0];
  },

  async delete(id: number) {
    await db.delete(githubProjects).where(eq(githubProjects.id, id));
  },
};
