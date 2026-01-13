import { eq } from "drizzle-orm";
import { db } from "../../index";
import { users } from "../../tables/betterAuthTables";

export const usersDao = {
  async findById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  },

  async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  },

  async findByUsername(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0] || null;
  },

  async findByGithubId(githubId: string) {
    const result = await db.select().from(users).where(eq(users.githubId, githubId)).limit(1);
    return result[0] || null;
  },

  async create(data: {
    email: string;
    username: string;
    name?: string; // Better Auth required field
    displayName?: string;
    avatarUrl?: string;
    githubId?: string;
    githubUsername?: string;
  }) {
    // Ensure name field is populated (Better Auth requirement)
    const insertData = {
      id: crypto.randomUUID(), // Generate UUID for id
      ...data,
      name: data.name || data.username, // Use username as fallback for name
    };
    const result = await db.insert(users).values(insertData).returning();
    return result[0];
  },

  async update(id: string, data: Partial<typeof users.$inferInsert>) {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  },
};