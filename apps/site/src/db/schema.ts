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

// --- Articles / journal éditorial ---
// Cycle de vie d'un article. `published` (booléen historique) est CONSERVÉ et
// tenu synchrone avec `status` : le sitemap, la home et les requêtes publiques
// existantes s'appuient dessus, et un article « programmé » ne doit pas fuiter
// avant l'heure. `status` porte l'intention éditoriale, `published` porte la
// visibilité effective.
export const POST_STATUSES = ["draft", "scheduled", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

/** Document Tiptap sérialisé (ProseMirror JSON). Typé large : le schéma exact vit côté éditeur. */
export type PostContentDoc = { type: string; content?: unknown[]; [k: string]: unknown };

export const posts = pgTable(
	"Post",
	{
		id: cuid(),
		slug: text("slug").notNull().unique(),
		title: text("title").notNull(),
		cover: text("cover"),
		excerpt: text("excerpt").notNull(),
		/**
		 * Corps historique en **Markdown**. Conservé tel quel pour les articles
		 * écrits avant l'éditeur riche : tant que `contentHtml` est NULL, c'est lui
		 * qui est rendu (via ReactMarkdown). Les articles créés/édités dans le
		 * nouvel éditeur y stockent le texte brut extrait du document (recherche,
		 * calcul du temps de lecture, repli ultime).
		 */
		body: text("body").notNull(),
		/** Document Tiptap — source de vérité pour l'ÉDITION. */
		contentJson: jsonb("contentJson").$type<PostContentDoc>(),
		/** HTML rendu depuis `contentJson` — source de vérité pour l'AFFICHAGE public. */
		contentHtml: text("contentHtml"),
		published: boolean("published").notNull().default(false),
		status: text("status").$type<PostStatus>().notNull().default("draft"),
		/** Date de mise en ligne (peut être future = programmé). NULL tant que brouillon. */
		publishedAt: timestamp("publishedAt", { precision: 3, mode: "date" }),
		coverAlt: text("coverAlt"),
		coverCaption: text("coverCaption"),
		tags: jsonb("tags").$type<string[]>().notNull().default([]),
		/** Mise en avant éditoriale (une seule tête d'affiche en haut du journal). */
		featured: boolean("featured").notNull().default(false),
		// --- SEO ---
		seoTitle: text("seoTitle"),
		seoDescription: text("seoDescription"),
		/** Image sociale dédiée. À défaut, `cover` sert d'OG image. */
		ogImage: text("ogImage"),
		/** Canonique externe — à poser UNIQUEMENT si l'article est republié depuis ailleurs. */
		canonicalUrl: text("canonicalUrl"),
		noindex: boolean("noindex").notNull().default(false),
		readingMinutes: integer("readingMinutes").notNull().default(1),
		wordCount: integer("wordCount").notNull().default(0),
		authorId: text("authorId")
			.notNull()
			.references(() => users.id),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	},
	(t) => [
		// Le journal public trie systématiquement les articles publiés par date de
		// parution décroissante — index composite pour éviter le tri en mémoire.
		index("Post_published_publishedAt_idx").on(t.published, t.publishedAt),
		index("Post_status_idx").on(t.status),
	]
);

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
// (userId si connu, sinon anonId). Porte aussi les favoris des comptes connectés
// (cf. /api/favorites) ; le moteur de recommandations qui la remplissait a été
// retiré le 2026-08-21, faute d'avoir jamais été branché.
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

// Curation de la chronologie universelle (/wiki/chronologie) — document JSON
// unique (singleton `default`). Édité depuis /admin/chronologie, appliqué sur la
// frise publique (fixe). Cf. lib/chronology-config.ts + lib/chronology.ts.
export const chronologyConfig = pgTable("ChronologyConfig", {
	id: text("id").primaryKey(),
	data: jsonb("data").$type<Record<string, unknown>>().notNull(),
	updatedBy: text("updatedBy"),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export type ChronologyConfigRow = typeof chronologyConfig.$inferSelect;

/**
 * Lancement wiki : quelles catégories sont ouvertes au public (gating bêta).
 * Singleton `"default"`, `data.openKeys: string[]` (clés de `wiki-launch.ts`).
 * Lu par le proxy (gating), la nav et le teaser ; édité depuis /admin/lancement.
 */
export const wikiLaunch = pgTable("WikiLaunch", {
	id: text("id").primaryKey(),
	data: jsonb("data").$type<{ openKeys: string[] }>().notNull(),
	updatedBy: text("updatedBy"),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export type WikiLaunchRow = typeof wikiLaunch.$inferSelect;

// --- Signalements utilisateurs (tickets) ---
//
// « Signaler une erreur » : un membre connecté (compte Discord lié) nous remonte
// un problème depuis n'importe quelle page. Chaque signalement = un ticket
// consultable dans /admin/signalements (workflow open → in_progress → resolved
// → closed). L'identité du rapporteur est dénormalisée (discordId/username figés)
// pour rester lisible même si le compte évolue.
export const siteReports = pgTable(
	"site_reports",
	{
		id: cuid(),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		// Rapporteur connecté (users.id cuid) + copies figées pour l'affichage.
		userId: text("userId"),
		discordId: text("discordId"),
		username: text("username"),
		// Contexte de la page signalée.
		path: text("path").notNull(),
		pageTitle: text("pageTitle"),
		// bug | contenu | lien | suggestion | autre
		category: text("category").notNull().default("bug"),
		message: text("message").notNull(),
		userAgent: text("userAgent"),
		// Workflow ticket : open | in_progress | resolved | closed
		status: text("status").notNull().default("open"),
		// Note interne de l'équipe (traitement).
		adminNote: text("adminNote"),
		resolvedBy: text("resolvedBy"),
		resolvedAt: timestamp("resolvedAt", { precision: 3, mode: "date" }),
	},
	(t) => [
		index("site_reports_status_idx").on(t.status),
		index("site_reports_created_idx").on(t.createdAt),
		index("site_reports_user_idx").on(t.userId),
	]
);

export type SiteReport = typeof siteReports.$inferSelect;
export type SiteReportInsert = typeof siteReports.$inferInsert;

// --- Notes communautaires (étoiles 1–5 + commentaire optionnel) ---
//
// Membres connectés (Discord lié) notent jeux, épisodes, films, arcs.
// Une note par (type, id, user) — upsert. Les sagas affichent la moyenne
// agrégée de leurs arcs. Commentaires facultatifs ; delete auteur/admin.
export const RATING_TARGET_TYPES = ["game", "episode", "movie", "arc"] as const;
export type RatingTargetType = (typeof RATING_TARGET_TYPES)[number];

export const siteRatings = pgTable(
	"site_ratings",
	{
		id: cuid(),
		// game | episode | movie | arc
		targetType: text("targetType").notNull(),
		// id métier stringifié
		targetId: text("targetId").notNull(),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		// 1..5
		score: integer("score").notNull(),
		comment: text("comment"),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	},
	(t) => [
		unique("site_ratings_target_user_unique").on(t.targetType, t.targetId, t.userId),
		index("site_ratings_target_idx").on(t.targetType, t.targetId),
		index("site_ratings_user_idx").on(t.userId),
		index("site_ratings_created_idx").on(t.createdAt),
	]
);

export type SiteRating = typeof siteRatings.$inferSelect;
export type SiteRatingInsert = typeof siteRatings.$inferInsert;

// --- Page banners (singleton admin-editable heroes / series art) ---
export const pageBanners = pgTable("PageBanners", {
	id: text("id").primaryKey(),
	data: jsonb("data").$type<Record<string, unknown>>().notNull(),
	updatedBy: text("updatedBy"),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export type PageBanners = typeof pageBanners.$inferSelect;

// --- Historique des révisions du wiki (versioning CMS) ---
//
// Chaque écriture éditoriale passant par /api/wiki-admin (create/update/delete +
// bascule de visibilité) laisse une trace ici : snapshot AVANT/APRÈS (colonnes
// mutables uniquement, camelCase), auteur figé, horodatage. Sert au flux
// d'activité /admin/wiki/history, au panneau « Historique » du studio, et au
// **retour arrière** en un clic (restauration du snapshot `before`).
//
// Schéma `public` = table 100% site (comme site_events) → isolée de la sync
// bot↔SQLite (le reverse-sync ne la touche jamais). `before`/`after` sont des
// jsonb bornés aux colonnes éditables (pas de blob jsonb type `frames`).
export const wikiRevisions = pgTable(
	"wiki_revisions",
	{
		id: cuid(),
		// Table wiki concernée (db_characters, db_sagas…) + pk figée de la ligne
		// (stringifiée ; pk composite jointe par ":").
		tableName: text("tableName").notNull(),
		rowId: text("rowId").notNull(),
		// create | update | delete | visibility | revert
		action: text("action").notNull(),
		// Libellé lisible de l'entité au moment de l'édit (nom/titre figé).
		label: text("label"),
		// Snapshots des colonnes mutables (null selon l'action).
		before: jsonb("before").$type<Record<string, unknown> | null>(),
		after: jsonb("after").$type<Record<string, unknown> | null>(),
		// Auteur : users.id + username figé (null pour un edit système/token).
		editorId: text("editorId"),
		editorName: text("editorName"),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	},
	(t) => [
		index("wiki_revisions_entity_idx").on(t.tableName, t.rowId),
		index("wiki_revisions_created_idx").on(t.createdAt),
		index("wiki_revisions_editor_idx").on(t.editorId),
		index("wiki_revisions_action_idx").on(t.action),
	]
);

export type WikiRevision = typeof wikiRevisions.$inferSelect;
export type WikiRevisionInsert = typeof wikiRevisions.$inferInsert;

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	comments: many(comments),
	tierlists: many(tierlists),
	ratings: many(siteRatings),
}));

export const siteRatingsRelations = relations(siteRatings, ({ one }) => ({
	author: one(users, { fields: [siteRatings.userId], references: [users.id] }),
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

// --- Brouillons d'édition (autosauvegarde du module d'édition) -------------
//
// Filet de sécurité du rédacteur : chaque éditeur du site pousse ici son état
// courant toutes les quelques secondes, sous une clé logique stable
// (`post:<id>`, `wiki:<table>:<row>:<colonne>`, `section:<id>`…). Si l'onglet
// meurt, si la session expire ou si l'enregistrement échoue, la reprise propose
// le brouillon au lieu de laisser le texte partir en fumée.
//
// Schéma `public` = table 100 % site (comme `site_events`) → jamais touchée par
// la sync bot ↔ SQLite. Un brouillon est **par utilisateur** : deux admins qui
// éditent la même fiche ne s'écrasent pas l'un l'autre.
export const editorDrafts = pgTable(
	"editor_drafts",
	{
		id: cuid(),
		// Clé logique du document édité (stable entre deux sessions).
		docKey: text("docKey").notNull(),
		userId: text("userId").notNull(),
		// "doc" (JSON ProseMirror sérialisé) | "markdown" | "text"
		format: text("format").notNull().default("markdown"),
		content: text("content").notNull(),
		// Libellé lisible pour un futur écran « mes brouillons ».
		label: text("label"),
		createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
	},
	(t) => [
		unique("editor_drafts_doc_user_key").on(t.docKey, t.userId),
		index("editor_drafts_user_idx").on(t.userId, t.updatedAt),
	]
);

export type EditorDraft = typeof editorDrafts.$inferSelect;
export type EditorDraftInsert = typeof editorDrafts.$inferInsert;
