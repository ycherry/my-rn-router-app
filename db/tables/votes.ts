import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "@/db/tables/betterAuthTables";
import { implementations } from "@/db/tables/implementations";

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  implementationId: integer("implementation_id").references(() => implementations.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  votesUserImplementationUnique: unique("votes_user_implementation_unique").on(table.userId, table.implementationId),
}));