import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	unique,
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

// --- Tierlists communautaires ---
// Un item = une carte (personnage/technique/… du wiki) figée dans la tierlist.
// Une tier = une ligne (S/A/B/C/D…) + sa couleur + ses items ordonnés.
export type TierlistItem = {
	id: string;
	label: string;
	image: string | null;
	// Catégorie d'origine du pool (Saiyans, Androïdes, Mes ajouts…) — sert au
	// filtre/recherche de l'éditeur. Non persisté dans le snapshot sauvegardé.
	category?: string | null;
};
export type TierlistTier = { id: string; label: string; color: string; items: TierlistItem[] };

export const tierlists = pgTable("Tierlist", {
	id: cuid(),
	slug: text("slug").notNull().unique(),
	title: text("title").notNull(),
	description: text("description"),
	// Clé du template d'origine (pool d'images), ex: "personnages". Null = libre.
	templateKey: text("templateKey"),
	tiers: jsonb("tiers").$type<TierlistTier[]>().notNull(),
	published: boolean("published").notNull().default(true),
	// Tier list « officielle » créée par l'équipe (badge éditorial + curation).
	official: boolean("official").notNull().default(false),
	// Épinglée / mise en avant (remontée en tête de galerie & accueil). Indépendant
	// d'`official` : une tierlist communautaire remarquable peut être featured.
	featured: boolean("featured").notNull().default(false),
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

// Un « like » par membre et par tierlist (toggle). Unicité (tierlist, user).
export const tierlistVotes = pgTable(
	"TierlistVote",
	{
		id: cuid(),
		tierlistId: text("tierlistId")
			.notNull()
			.references(() => tierlists.id, { onDelete: "cascade" }),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	},
	(t) => [unique("TierlistVote_tierlist_user_unique").on(t.tierlistId, t.userId)]
);

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

// --- First-party web telemetry (RGPD-safe) ---
//
// Télémétrie web maison du SITE, séparée du gameplay du bot (XP/messages :
// SQLite côté bot). Alimente recommandations + personnalisation selon les
// habitudes de navigation. Privacy-first :
//   - jamais d'IP brute : `visitorHash` = SHA-256(IP+UA+sel quotidien), rotaté
//     chaque jour → ré-identification impossible passé 24 h.
//   - `userId` rattaché seulement si session Better Auth (connecté).
//   - `anonId` = cookie httpOnly signé (pseudonyme stable, pas un identifiant
//     personnel) pour relier les vues d'un même visiteur anonyme.
//   - aucune donnée non-essentielle écrite sans consentement (cf. ConsentGate).

export const siteEvents = pgTable(
	"site_events",
	{
		id: cuid(),
		// Horodatage serveur (la source de vérité ; on ignore l'horloge client).
		ts: timestamp("ts", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		// Type d'event (union typée côté client : wiki_view, search, cta_click…).
		type: text("type").notNull(),
		// Utilisateur connecté (Better Auth) — null si anonyme.
		userId: text("userId"),
		// Pseudonyme stable du visiteur anonyme (cookie httpOnly signé).
		anonId: text("anonId").notNull(),
		// Session de navigation (regroupe les events d'une même visite, ~30 min).
		sessionId: text("sessionId").notNull(),
		// Entité concernée (character, saga, movie, episode…) + son id, pour la reco.
		entityType: text("entityType"),
		entityId: text("entityId"),
		// Chemin de la page (sans query string — pas de données perso dans l'URL).
		path: text("path").notNull(),
		// Référent interne/externe normalisé (host seul pour l'externe).
		referrer: text("referrer"),
		// Hash visiteur rotaté quotidiennement (anti-doublon, jamais d'IP brute).
		visitorHash: text("visitorHash"),
		// Propriétés libres typées par event (jsonb).
		props: jsonb("props").$type<Record<string, unknown>>(),
	},
	(t) => [
		index("site_events_user_idx").on(t.userId),
		index("site_events_anon_idx").on(t.anonId),
		index("site_events_entity_idx").on(t.entityType, t.entityId),
		index("site_events_type_ts_idx").on(t.type, t.ts),
		// Index analytics (dashboard « Activité du site ») : top pages (path),
		// sources de trafic (referrer), comptage de sessions (sessionId) et séries
		// temporelles globales tous types confondus (ts seul).
		index("site_events_path_idx").on(t.path),
		index("site_events_referrer_idx").on(t.referrer),
		index("site_events_session_idx").on(t.sessionId),
		index("site_events_ts_idx").on(t.ts),
	]
);

// Préférences dérivées (agrégat des events) — une ligne par identité
// (userId si connu, sinon anonId). Rafraîchie par le module recommendations.
export const userPreferences = pgTable(
	"user_preferences",
	{
		id: cuid(),
		// Clé d'identité : "u:<userId>" ou "a:<anonId>" (unique).
		identity: text("identity").notNull().unique(),
		userId: text("userId"),
		anonId: text("anonId"),
		// Préférences dérivées : ères favorites, persos/sagas vus, sections,
		// langue, séries préférées… Forme libre, faite évoluer sans migration.
		prefs: jsonb("prefs").$type<Record<string, unknown>>().notNull().default({}),
		// Nombre d'events agrégés (fraîcheur / poids de confiance).
		eventCount: integer("eventCount").notNull().default(0),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	},
	(t) => [
		index("user_preferences_user_idx").on(t.userId),
		index("user_preferences_anon_idx").on(t.anonId),
	]
);

export type SiteEvent = typeof siteEvents.$inferSelect;
export type SiteEventInsert = typeof siteEvents.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Configuration éditable de la home — document JSON unique (singleton `default`).
// Édité depuis /admin/home, lu par la page `/`. Cf. lib/home-config.ts.
export const homeConfig = pgTable("HomeConfig", {
	id: text("id").primaryKey(),
	data: jsonb("data").$type<Record<string, unknown>>().notNull(),
	updatedBy: text("updatedBy"),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export type HomeConfigRow = typeof homeConfig.$inferSelect;

// Thème de design global — document JSON unique (singleton `default`).
// Édité depuis /admin/design, injecté en :root par le layout. Cf. lib/site-theme.ts.
export const siteTheme = pgTable("SiteTheme", {
	id: text("id").primaryKey(),
	data: jsonb("data").$type<Record<string, unknown>>().notNull(),
	updatedBy: text("updatedBy"),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export type SiteThemeRow = typeof siteTheme.$inferSelect;

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	comments: many(comments),
	tierlists: many(tierlists),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
	comments: many(comments),
}));

export const tierlistsRelations = relations(tierlists, ({ one }) => ({
	author: one(users, { fields: [tierlists.authorId], references: [users.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, { fields: [comments.postId], references: [posts.id] }),
	author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

export const wikiCategoriesRelations = relations(wikiCategories, ({ one, many }) => ({
	parent: one(wikiCategories, {
		fields: [wikiCategories.parentId],
		references: [wikiCategories.id],
		relationName: "CategoryTree",
	}),
	children: many(wikiCategories, { relationName: "CategoryTree" }),
	pages: many(wikiPages),
}));

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
