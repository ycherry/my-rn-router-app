import { relations } from "drizzle-orm/relations";
import { users, account, battles, implementations, session, userPaymentMethods } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(account),
	battles: many(battles),
	implementations: many(implementations),
	sessions: many(session),
	userPaymentMethods: many(userPaymentMethods),
}));

export const battlesRelations = relations(battles, ({one, many}) => ({
	user: one(users, {
		fields: [battles.createdBy],
		references: [users.id]
	}),
	implementations: many(implementations),
}));

export const implementationsRelations = relations(implementations, ({one}) => ({
	battle: one(battles, {
		fields: [implementations.battleId],
		references: [battles.id]
	}),
	user: one(users, {
		fields: [implementations.authorId],
		references: [users.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const userPaymentMethodsRelations = relations(userPaymentMethods, ({one}) => ({
	user: one(users, {
		fields: [userPaymentMethods.userId],
		references: [users.id]
	}),
}));