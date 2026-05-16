import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

const cuid = () =>
	text("id")
		.primaryKey()
		.$defaultFn(() => createId());

// --- Core App Tables ---

export const users = pgTable("User", {
	id: cuid(),
	discordId: text("discordId").notNull().unique(),
	username: text("username").notNull(),
	avatar: text("avatar"),
	roleAdmin: boolean("roleAdmin").notNull().default(false),
	createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const posts = pgTable("Post", {
	id: cuid(),
	slug: text("slug").notNull().unique(),
	title: text("title").notNull(),
	cover: text("cover"),
	excerpt: text("excerpt").notNull(),
	body: text("body").notNull(),
	published: boolean("published").notNull().default(false),
	authorId: text("authorId")
		.notNull()
		.references(() => users.id),
	createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const comments = pgTable("Comment", {
	id: cuid(),
	postId: text("postId")
		.notNull()
		.references(() => posts.id, { onDelete: "cascade" }),
	authorId: text("authorId")
		.notNull()
		.references(() => users.id),
	body: text("body").notNull(),
	createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const wikiCategories = pgTable("WikiCategory", {
	id: cuid(),
	parentId: text("parentId"),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	order: integer("order").notNull().default(0),
});

export const wikiPages = pgTable("WikiPage", {
	id: cuid(),
	categoryId: text("categoryId")
		.notNull()
		.references(() => wikiCategories.id),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	body: text("body").notNull(),
	order: integer("order").notNull().default(0),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

// --- Better Auth Tables ---

export const baUser = pgTable("ba_user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const baSession = pgTable("ba_session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => baUser.id),
});

export const baAccount = pgTable("ba_account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => baUser.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const baVerification = pgTable("ba_verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt"),
});

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	comments: many(comments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
	comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, { fields: [comments.postId], references: [posts.id] }),
	author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

export const wikiCategoriesRelations = relations(
	wikiCategories,
	({ one, many }) => ({
		parent: one(wikiCategories, {
			fields: [wikiCategories.parentId],
			references: [wikiCategories.id],
			relationName: "CategoryTree",
		}),
		children: many(wikiCategories, { relationName: "CategoryTree" }),
		pages: many(wikiPages),
	}),
);

export const wikiPagesRelations = relations(wikiPages, ({ one }) => ({
	category: one(wikiCategories, {
		fields: [wikiPages.categoryId],
		references: [wikiCategories.id],
	}),
}));

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type WikiCategory = typeof wikiCategories.$inferSelect;
export type WikiPage = typeof wikiPages.$inferSelect;
