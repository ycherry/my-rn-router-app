import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../schema";

export const userPaymentMethods = pgTable("user_payment_methods", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(), // 'paypal'
  vaultId: text("vault_id").notNull(),
  email: text("email"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});
