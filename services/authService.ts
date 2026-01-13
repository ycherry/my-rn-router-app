import { db } from "@/db";
import { users, verification, account } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { randomBytes } from "node:crypto";

export const AuthService = {
  // Check if email is already registered
  checkEmailExists: async (email: string): Promise<boolean> => {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return existingUser.length > 0;
  },

  // Check if username is already taken
  checkUsernameExists: async (username: string): Promise<boolean> => {
    const existingUsername = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return existingUsername.length > 0;
  },

  // Insert verification code
  insertVerificationCode: async (identifier: string, code: string, expiresAt: Date): Promise<void> => {
    await db.insert(verification).values({
      id: randomBytes(16).toString("hex"),
      identifier,
      value: code,
      expiresAt,
      updatedAt: new Date(),
    });
  },

  // Get the latest verification record for an identifier
  getLatestVerification: async (identifier: string) => {
    const verificationRecords = await db.select().from(verification).where(eq(verification.identifier, identifier)).orderBy(desc(verification.createdAt)).limit(1);
    return verificationRecords[0] || null;
  },

  // Insert new user
  insertUser: async (userData: { id: string; username: string; name: string; email: string; emailVerified: boolean }): Promise<void> => {
    await db.insert(users).values({
      ...userData,
      updatedAt: new Date(),
    });
  },

  // Insert account for password authentication
  insertAccount: async (accountData: { id: string; userId: string; accountId: string; providerId: string; password: string }): Promise<void> => {
    await db.insert(account).values({
      ...accountData,
      updatedAt: new Date(),
    });
  },

  // Delete verification record
  deleteVerification: async (id: string): Promise<void> => {
    await db.delete(verification).where(eq(verification.id, id));
  },
};