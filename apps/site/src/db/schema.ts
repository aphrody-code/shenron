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

export const users = pgTable("User", {
	id: cuid(),
	discordId: text("discordId").notNull().unique(),
	username: text("username").notNull(),
	avatar: text("avatar"),
	roleAdmin: boolean("roleAdmin").notNull().default(false),
	createdAt: timestamp("createdAt", { precision: 3 })
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
	createdAt: timestamp("createdAt", { precision: 3 })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updatedAt", { precision: 3 })
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
	createdAt: timestamp("createdAt", { precision: 3 })
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
	updatedAt: timestamp("updatedAt", { precision: 3 })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

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
