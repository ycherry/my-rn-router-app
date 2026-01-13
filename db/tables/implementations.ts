import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "@/db/tables/betterAuthTables";
import { battles } from "./battles";

export const implementations = pgTable("implementations", {
  id: serial("id").primaryKey(),
  battleId: integer("battle_id")
    .references(() => battles.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  code: text("code").notNull(),
  authorId: text("author_id").references(() => users.id),
  author: text("author").notNull(), // 保留作为显示名称
  votes: integer("votes").default(0).notNull(),
  pros: jsonb("pros").$type<string[]>().default([]).notNull(),
  cons: jsonb("cons").$type<string[]>().default([]).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});