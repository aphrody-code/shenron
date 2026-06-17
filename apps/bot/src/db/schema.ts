import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import type { EpisodeFrame } from "./episode-frames";

export const users = sqliteTable(
	"users",
	{
		id: text("id").primaryKey(), // ID Discord
		xp: integer("xp").notNull().default(0),
		zeni: integer("zeni").notNull().default(1000),

		// Progression
		currentLevelRoleId: text("current_level_role_id"),
		lastLevelReached: integer("last_level_reached").notNull().default(0),

		// Activite
		lastMessageAt: integer("last_message_at", { mode: "timestamp_ms" }),
		lastVoiceJoinAt: integer("last_voice_join_at", { mode: "timestamp_ms" }),
		totalVoiceMs: integer("total_voice_ms").notNull().default(0),
		messageCount: integer("message_count").notNull().default(0),

		// Quete quotidienne
		lastDailyQuestAt: integer("last_daily_quest_at", { mode: "timestamp_ms" }),
		dailyStreak: integer("daily_streak").notNull().default(0),

		// Customisation
		equippedCard: text("equipped_card"),
		equippedBadge: text("equipped_badge"),
		equippedColor: text("equipped_color"),
		equippedTitle: text("equipped_title"),
		equippedBanner: text("equipped_banner"),

		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [index("idx_users_xp").on(t.xp), index("idx_users_zeni").on(t.zeni)]
);

export const inventory = sqliteTable(
	"inventory",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		itemType: text("item_type", {
			enum: ["card", "badge", "color", "title", "banner"],
		}).notNull(),
		itemKey: text("item_key").notNull(),
		acquiredAt: integer("acquired_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [
		uniqueIndex("uq_inventory_user_item").on(t.userId, t.itemType, t.itemKey),
		index("idx_inventory_user").on(t.userId),
	]
);

export const shopItems = sqliteTable(
	"shop_items",
	{
		key: text("key").primaryKey(),
		type: text("type", {
			enum: ["card", "badge", "color", "title", "banner"],
		}).notNull(),
		name: text("name").notNull(),
		description: text("description"),
		price: integer("price").notNull(),
		// Pour color: roleId que l'on donne. Pour badge/title: meta JSON.
		roleId: text("role_id"),
		meta: text("meta"), // JSON sérialisé
		enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
	},
	(t) => [index("idx_shop_type").on(t.type)]
);

export const achievements = sqliteTable(
	"achievements",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		code: text("code").notNull(), // ex: FIRST_MESSAGE, DAILY_7_STREAK
		unlockedAt: integer("unlocked_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [
		uniqueIndex("uq_achievement_user_code").on(t.userId, t.code),
		index("idx_achievement_user").on(t.userId),
	]
);

export const fusions = sqliteTable(
	"fusions",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		userA: text("user_a").notNull(),
		userB: text("user_b").notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [
		uniqueIndex("uq_fusion_pair").on(t.userA, t.userB),
		index("idx_fusion_user_a").on(t.userA),
		index("idx_fusion_user_b").on(t.userB),
	]
);

export const warns = sqliteTable(
	"warns",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		userId: text("user_id").notNull(),
		moderatorId: text("moderator_id").notNull(),
		reason: text("reason"),
		active: integer("active", { mode: "boolean" }).notNull().default(true),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [index("idx_warns_user").on(t.userId)]
);

export const jails = sqliteTable(
	"jails",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		userId: text("user_id").notNull(),
		moderatorId: text("moderator_id").notNull(),
		reason: text("reason"),
		expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
		releasedAt: integer("released_at", { mode: "timestamp_ms" }),
		// Snapshot des rôles du user pour restore au unjail
		previousRoles: text("previous_roles"), // liste JSON sérialisée
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [index("idx_jails_user").on(t.userId), index("idx_jails_expires").on(t.expiresAt)]
);

export const bans = sqliteTable(
	"bans",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		userId: text("user_id").notNull(),
		moderatorId: text("moderator_id"),
		reason: text("reason"),
		active: integer("active", { mode: "boolean" }).notNull().default(true),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [index("idx_bans_user").on(t.userId)]
);

export const tickets = sqliteTable(
	"tickets",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		channelId: text("channel_id").notNull().unique(),
		ownerId: text("owner_id").notNull(),
		kind: text("kind", { enum: ["report", "achat", "shop", "abus"] }).notNull(),
		context: text("context"),
		closed: integer("closed", { mode: "boolean" }).notNull().default(false),
		closedAt: integer("closed_at", { mode: "timestamp_ms" }),
		closedBy: text("closed_by"),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [index("idx_tickets_owner").on(t.ownerId), index("idx_tickets_closed").on(t.closed)]
);

export const vocalTempo = sqliteTable(
	"vocal_tempo",
	{
		channelId: text("channel_id").primaryKey(),
		ownerId: text("owner_id").notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [index("idx_vocal_owner").on(t.ownerId)]
);

export const vocalTempoBans = sqliteTable(
	"vocal_tempo_bans",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		ownerId: text("owner_id").notNull(),
		bannedUserId: text("banned_user_id").notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [uniqueIndex("uq_voctempo_ban").on(t.ownerId, t.bannedUserId)]
);

export const giveaways = sqliteTable(
	"giveaways",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		messageId: text("message_id").notNull().unique(),
		channelId: text("channel_id").notNull(),
		hostId: text("host_id").notNull(),
		title: text("title").notNull(),
		reward: text("reward").notNull(),
		description: text("description"),
		winners: integer("winners").notNull().default(1),
		endsAt: integer("ends_at", { mode: "timestamp_ms" }).notNull(),
		ended: integer("ended", { mode: "boolean" }).notNull().default(false),
		winnerIds: text("winner_ids"), // liste JSON sérialisée
	},
	(t) => [index("idx_giveaway_ends").on(t.endsAt), index("idx_giveaway_ended").on(t.ended)]
);

export const giveawayEntries = sqliteTable(
	"giveaway_entries",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		giveawayId: integer("giveaway_id")
			.notNull()
			.references(() => giveaways.id, { onDelete: "cascade" }),
		userId: text("user_id").notNull(),
		enteredAt: integer("entered_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [uniqueIndex("uq_giveaway_entry").on(t.giveawayId, t.userId)]
);

export const actionLogs = sqliteTable(
	"action_logs",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		userId: text("user_id"),
		moderatorId: text("moderator_id"),
		action: text("action").notNull(), // jail, unjail, mute, unmute, warn, unwarn, ban, unban, kick, purge, etc.
		reason: text("reason"),
		meta: text("meta"), // JSON
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [
		index("idx_log_user").on(t.userId),
		index("idx_log_action").on(t.action),
		index("idx_log_created").on(t.createdAt),
	]
);

/* ============================================================
 * DragonBall wiki — personnages, transformations, planètes
 * Source : dump MySQL de api-dragonball (intentodepirata/api-dragonball)
 * ========================================================= */
export const dbPlanets = sqliteTable("db_planets", {
	id: integer("id").primaryKey(),
	name: text("name").notNull().unique(),
	nameJa: text("name_ja"), // 漢字/カナ d'AniList
	nameRomaji: text("name_romaji"), // translittération canon EN
	image: text("image").notNull(),
	isDestroyed: integer("is_destroyed", { mode: "boolean" }).notNull().default(false),
	description: text("description"),
});

export const dbCharacters = sqliteTable(
	"db_characters",
	{
		id: integer("id").primaryKey(),
		name: text("name").notNull().unique(),
		nameJa: text("name_ja"), // 孫悟空, ベジータ — natif AniList
		nameRomaji: text("name_romaji"), // "Son Gokuu", "Vegeta" — canon JP romanisé
		image: text("image").notNull(), // path local dans assets/dbz/characters/
		portraitXv2: text("portrait_xv2"), // portrait HQ extrait de Xenoverse 2 (assets/dbz/xv2-portraits/<CODE>.png), prioritaire sur image
		ki: text("ki"),
		maxKi: text("max_ki"),
		race: text("race"),
		gender: text("gender"),
		affiliation: text("affiliation"),
		description: text("description"),
		originPlanetId: integer("origin_planet_id"),
	},
	(t) => [index("idx_db_char_race").on(t.race), index("idx_db_char_affiliation").on(t.affiliation)]
);

/**
 * Thèmes de cartes profil — éditables via dashboard.
 * Remplace le dict hardcodé CARDS dans CardService.ts.
 * Le bot lit la table au render (cache 60s), reload via SettingsService.
 */
export const cardThemes = sqliteTable("card_themes", {
	id: text("id").primaryKey(), // key courte (ex: "goku", "vegeta") utilisée par users.equippedCard
	name: text("name").notNull(), // libellé affiché
	accent: text("accent").notNull(), // #RRGGBB couleur principale (ring, highlights)
	aura: text("aura").notNull(), // #RRGGBB couleur aura avatar + barre XP
	bgGrad1: text("bg_grad_1").notNull(), // 1er stop dégradé fond
	bgGrad2: text("bg_grad_2").notNull(),
	bgGrad3: text("bg_grad_3").notNull(),
	bgFile: text("bg_file"), // chemin relatif assets/banners|backgrounds/... (nullable)
	textShadow: text("text_shadow").notNull(), // rgba(...) pour ombres
	// Contrôle fin du rendu (cf. CardService.render). Defaults = anciens hardcodes.
	overlayOpacity: real("overlay_opacity").notNull().default(0.78), // assombrissement de l'image de fond (0-1)
	tintStrength: real("tint_strength").notNull().default(0.08), // teinte aura par-dessus le fond (0-1)
	gradientAngle: integer("gradient_angle").notNull().default(135), // angle du dégradé sans image (deg)
	enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const dbTransformations = sqliteTable(
	"db_transformations",
	{
		id: integer("id").primaryKey(),
		name: text("name").notNull(),
		image: text("image").notNull(),
		ki: text("ki"),
		characterId: integer("character_id").notNull(),
	},
	(t) => [index("idx_db_transfo_char").on(t.characterId)]
);

export const achievementTriggers = sqliteTable("achievement_triggers", {
	code: text("code").primaryKey(), // code du succès attribué si le pattern matche
	description: text("description"),
	pattern: text("pattern").notNull(), // regex JavaScript
	flags: text("flags").default("i"), // flags de la regex
	enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
});

export const levelRewards = sqliteTable("level_rewards", {
	level: integer("level").primaryKey(),
	roleId: text("role_id").notNull(),
	zeniBonus: integer("zeni_bonus").notNull().default(1000),
	xpThreshold: integer("xp_threshold").notNull(), // exp necessaire pour atteindre ce palier
	bannerUrl: text("banner_url"), // chemin relatif (assets/banners/...) ou URL absolue
});

/**
 * Settings runtime overridables sans redeploy. Toutes les rows sont stockées en
 * key/value texte — coercion par lecture côté SettingsService.
 *
 * Keys connues (cf. SettingsService.SETTINGS_KEYS) :
 *   xp.message.min            (int, default 5)
 *   xp.message.max            (int, default 15)
 *   xp.message.cooldown_ms    (int, default 60000)
 *   xp.voice.per_minute       (int, default 5)
 *   zeni.daily_quest          (int, default 50)
 *   channel.announce          (snowflake, override env)
 *   channel.achievement       (snowflake, override env)
 *   channel.commands          (snowflake, override env)
 */
export const guildSettings = sqliteTable("guild_settings", {
	key: text("key").primaryKey(),
	value: text("value").notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
});

/**
 * Templates configurables des messages que le bot envoie pour chaque événement
 * (welcome, farewell, level_up, achievement_unlocked, daily_quest, first_message,
 *  anti_link_jail, jail_expired, giveaway_winner, vocal_tempo_*).
 *
 * `event` — clé du catalogue (cf. `lib/message-templates.ts::EVENTS`).
 * `template` — texte avec placeholders `{var}` (ex: `{user}`, `{level}`, `{xp}`).
 *   Si null → utilise le défaut hardcodé du catalogue.
 * `channelKey` — clé `guild_settings` du salon où envoyer (ex: `channel.announce`).
 *   Si null → utilise le canal par défaut du catalogue.
 * `enabled` — false pour désactiver complètement le message.
 */
export const messageTemplates = sqliteTable("message_templates", {
	event: text("event").primaryKey(),
	template: text("template"),
	channelKey: text("channel_key"),
	enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
});

/**
 * Permissions par commande slash gérées depuis le dashboard.
 *
 * `name` — nom canonique de la commande :
 *   - commande racine : `"daily"`, `"profile"`
 *   - sous-commande / groupe : `"admin reload"`, `"economy give"`
 *   - jokers (fallback) : `"admin *"` matche toute sous-commande de `/admin`
 *     si pas de règle exacte plus spécifique.
 *
 * `enabled` — false → commande désactivée pour TOUS sauf bypass owner/Admin Discord.
 * `allowedRoles` — JSON array de roleId. Si non vide → membre DOIT avoir au moins un.
 * `deniedRoles`  — JSON array de roleId. Si membre a un de ces rôles → refus.
 * `deniedUsers`  — JSON array de userId. Refus exact.
 *
 * Bypass automatique : OWNER_ID, BOT_DEV_ID, et toute personne avec la permission
 * Discord native `Administrator` (garde-fou anti lock-out).
 */
/**
 * Log persistant des invitations Discord — qui a invité qui via quel code.
 * Alimenté par `InviteTracker.detectInviter` à chaque `guildMemberAdd`.
 * Utilisé par `/invitations` pour afficher les stats par membre.
 *
 * `inviterId` est NULL si on n'a pas pu détecter (race condition Discord ou
 * lien vanity sans tracker).
 */
export const invitesLog = sqliteTable(
	"invites_log",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		userId: text("user_id").notNull(),
		inviterId: text("inviter_id"),
		code: text("code"),
		joinedAt: integer("joined_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(t) => [
		index("idx_invites_inviter").on(t.inviterId),
		index("idx_invites_user").on(t.userId),
		index("idx_invites_joined").on(t.joinedAt),
	]
);

export const commandPermissions = sqliteTable("command_permissions", {
	name: text("name").primaryKey(),
	enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
	allowedRoles: text("allowed_roles").notNull().default("[]"),
	deniedRoles: text("denied_roles").notNull().default("[]"),
	deniedUsers: text("denied_users").notNull().default("[]"),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`(unixepoch() * 1000)`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type InventoryItem = typeof inventory.$inferSelect;
export type ShopItem = typeof shopItems.$inferSelect;
export type Warn = typeof warns.$inferSelect;
export type Jail = typeof jails.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type Giveaway = typeof giveaways.$inferSelect;
export type ActionLog = typeof actionLogs.$inferSelect;
export type LevelReward = typeof levelRewards.$inferSelect;
export type Fusion = typeof fusions.$inferSelect;
export type AchievementTrigger = typeof achievementTriggers.$inferSelect;
export type DBPlanet = typeof dbPlanets.$inferSelect;
export type DBCharacter = typeof dbCharacters.$inferSelect;
export type DBTransformation = typeof dbTransformations.$inferSelect;
export type GuildSetting = typeof guildSettings.$inferSelect;
export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type CommandPermission = typeof commandPermissions.$inferSelect;
export type NewCommandPermission = typeof commandPermissions.$inferInsert;
export type InviteLog = typeof invitesLog.$inferSelect;

// ──────────────────────────────────────────────────────────────────────
// Better Auth — schema standard (4 tables) avec préfixe `ba_` pour ne
// pas collisionner avec les autres tables. Géré par drizzleAdapter.
// Doc: https://www.better-auth.com/docs/concepts/database#schema
// ──────────────────────────────────────────────────────────────────────
export const baUser = sqliteTable("ba_user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const baSession = sqliteTable("ba_session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => baUser.id, { onDelete: "cascade" }),
	token: text("token").notNull().unique(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const baAccount = sqliteTable("ba_account", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => baUser.id, { onDelete: "cascade" }),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at", {
		mode: "timestamp",
	}),
	refreshTokenExpiresAt: integer("refresh_token_expires_at", {
		mode: "timestamp",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const baVerification = sqliteTable("ba_verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }),
	updatedAt: integer("updated_at", { mode: "timestamp" }),
});

/* ============================================================
 * DragonBall Universe — extension complète canon
 * Couvre : races, techniques, sagas, arcs, épisodes, manga,
 *          films, jeux, news + médias/attribution traçables.
 * Source de vérité unifiée pour bot + site DBFR.
 * ========================================================= */

// --- Métadonnées sources/licences ---
export const dbSources = sqliteTable("db_sources", {
	id: text("id").primaryKey(), // "dragonball-api", "fandom-fr", "bandai-eu", "jikan", etc.
	name: text("name").notNull(), // libellé public
	url: text("url").notNull(),
	licenseKey: text("license_key").notNull(), // FK db_licenses.key
	attributionTemplate: text("attribution_template"), // "© Source — {title}" (interpolable)
});

export const dbLicenses = sqliteTable("db_licenses", {
	key: text("key").primaryKey(), // "MIT", "CC-BY-SA-3", "FAIR-USE-EDITORIAL", "API-PUBLIC"
	name: text("name").notNull(),
	url: text("url"), // lien vers la licence
	requiresAttribution: integer("requires_attribution", { mode: "boolean" }).notNull().default(true),
	shareAlike: integer("share_alike", { mode: "boolean" }).notNull().default(false),
});

export const dbAssets = sqliteTable(
	"db_assets",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		path: text("path").notNull().unique(), // path relatif sous public/db/
		sourceId: text("source_id")
			.notNull()
			.references(() => dbSources.id),
		sourceUrl: text("source_url"), // URL d'origine
		licenseKey: text("license_key").notNull(),
		attribution: text("attribution"), // string finale "© Bird Studio / Shueisha"
		sha256: text("sha256"),
		mimeType: text("mime_type"),
		bytes: integer("bytes"),
		width: integer("width"),
		height: integer("height"),
		entityType: text("entity_type"), // "character", "planet", "movie", "game", "news"
		entityId: integer("entity_id"),
		role: text("role"), // "thumbnail", "banner", "still", "poster", "logo"
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(t) => [
		index("idx_db_assets_entity").on(t.entityType, t.entityId),
		index("idx_db_assets_source").on(t.sourceId),
	]
);

// --- Canon Dragon Ball ---
export const dbRaces = sqliteTable("db_races", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	slug: text("slug").notNull().unique(), // "saiyan", "namekian", "frieza-race"
	name: text("name").notNull(),
	nameJa: text("name_ja"),
	homePlanetId: integer("home_planet_id"),
	description: text("description"),
});

export const dbTechniques = sqliteTable(
	"db_techniques",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		slug: text("slug").notNull().unique(), // "kamehameha", "genkidama"
		name: text("name").notNull(),
		nameJa: text("name_ja"),
		nameRomaji: text("name_romaji"),
		type: text("type"), // "energy", "physical", "fusion", "transformation-aid"
		creatorId: integer("creator_id"), // FK db_characters
		description: text("description"),
		debutEpisodeId: integer("debut_episode_id"),
		debutChapterId: integer("debut_chapter_id"),
	},
	(t) => [index("idx_db_techniques_creator").on(t.creatorId)]
);

export const dbCharacterTechniques = sqliteTable(
	"db_character_techniques",
	{
		characterId: integer("character_id").notNull(),
		techniqueId: integer("technique_id").notNull(),
	},
	(t) => [
		index("idx_db_char_tech_char").on(t.characterId),
		index("idx_db_char_tech_tech").on(t.techniqueId),
	]
);

// --- Narration ---
export const dbSagas = sqliteTable("db_sagas", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	slug: text("slug").notNull().unique(), // "saiyan", "frieza", "cell", "buu", "tournament-of-power"
	name: text("name").notNull(),
	nameJa: text("name_ja"),
	series: text("series").notNull(), // "DB", "DBZ", "DBGT", "DBS", "DB_DAIMA"
	orderIdx: integer("order_idx").notNull(),
	description: text("description"),
	image: text("image"),
});

export const dbArcs = sqliteTable(
	"db_arcs",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		sagaId: integer("saga_id").notNull(),
		slug: text("slug").notNull().unique(),
		name: text("name").notNull(),
		nameJa: text("name_ja"),
		orderIdx: integer("order_idx").notNull(),
		description: text("description"),
	},
	(t) => [index("idx_db_arcs_saga").on(t.sagaId)]
);

export const dbEpisodes = sqliteTable(
	"db_episodes",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		series: text("series").notNull(), // "DB", "DBZ", "DBGT", "DBS", "DB_DAIMA", "DBZ_KAI"
		numberInSeries: integer("number_in_series").notNull(),
		title: text("title").notNull(),
		titleJa: text("title_ja"),
		titleRomaji: text("title_romaji"),
		arcId: integer("arc_id"),
		airDate: integer("air_date", { mode: "timestamp" }),
		durationSec: integer("duration_sec"),
		synopsis: text("synopsis"),
		image: text("image"),
		videoUrl: text("video_url"), // URL vers l'épisode (ex: ADN, Crunchyroll, YouTube)
		malId: integer("mal_id"), // MyAnimeList episode ID (via Jikan)
		// Feature « Scènes d'épisode » : frames extraites (ffmpeg/fandom) + preview animé.
		// Source de vérité = Neon (jsonb `frames` + text `scene_preview`) ; SQLite = replica
		// de lecture (reverse-sync Neon→SQLite). Colonnes nullable → boot safe.
		frames: text("frames", { mode: "json" }).$type<EpisodeFrame[]>(),
		scenePreview: text("scene_preview"), // chemin relatif MP4 montage, ex. ./assets/ext/db_episodes_frames/<series>/ep<NNN>/preview.mp4
	},
	(t) => [
		index("idx_db_episodes_series_num").on(t.series, t.numberInSeries),
		index("idx_db_episodes_arc").on(t.arcId),
	]
);

// --- Manga ---
export const dbMangaVolumes = sqliteTable(
	"db_manga_volumes",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		series: text("series").notNull(), // "DB", "DBS"
		volumeNumber: integer("volume_number").notNull(),
		title: text("title"),
		titleJa: text("title_ja"),
		publishedAt: integer("published_at", { mode: "timestamp" }),
		cover: text("cover"),
		isbn: text("isbn"),
	},
	(t) => [index("idx_db_manga_vol").on(t.series, t.volumeNumber)]
);

export const dbMangaChapters = sqliteTable(
	"db_manga_chapters",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		series: text("series").notNull(),
		chapterNumber: integer("chapter_number").notNull(),
		title: text("title"),
		titleJa: text("title_ja"),
		volumeId: integer("volume_id"),
		publishedAt: integer("published_at", { mode: "timestamp" }),
	},
	(t) => [
		index("idx_db_manga_chap").on(t.series, t.chapterNumber),
		index("idx_db_manga_chap_vol").on(t.volumeId),
	]
);

// --- Médias dérivés ---
export const dbMovies = sqliteTable("db_movies", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	slug: text("slug").notNull().unique(),
	title: text("title").notNull(),
	titleJa: text("title_ja"),
	titleRomaji: text("title_romaji"),
	series: text("series").notNull(), // "DB_MOVIE", "DBZ_MOVIE", "DBS_MOVIE", "DB_DAIMA_MOVIE"
	releaseDate: integer("release_date", { mode: "timestamp" }),
	durationMin: integer("duration_min"),
	synopsis: text("synopsis"),
	poster: text("poster"),
	malId: integer("mal_id"),
	anilistId: integer("anilist_id"),
});

export const dbGames = sqliteTable("db_games", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	slug: text("slug").notNull().unique(),
	title: text("title").notNull(),
	titleJa: text("title_ja"),
	platforms: text("platforms"), // CSV "PS5,XSX,PC,Switch"
	releaseDate: integer("release_date", { mode: "timestamp" }),
	publisher: text("publisher").default("Bandai Namco Entertainment"),
	developer: text("developer"),
	description: text("description"),
	cover: text("cover"),
	officialUrl: text("official_url"),
});

export const dbGameCharacters = sqliteTable(
	"db_game_characters",
	{
		gameId: integer("game_id").notNull(),
		characterId: integer("character_id").notNull(),
	},
	(t) => [index("idx_db_gc_game").on(t.gameId), index("idx_db_gc_char").on(t.characterId)]
);

export const dbTools = sqliteTable(
	"db_tools",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		slug: text("slug").notNull().unique(),
		name: text("name").notNull(),
		description: text("description"),
		url: text("url").notNull(),
		author: text("author"),
		language: text("language"),
		category: text("category"), // "modding", "shader", "api", "engine", "utility"
		targetGameId: integer("target_game_id"), // FK db_games
		stars: integer("stars").default(0),
	},
	(t) => [index("idx_db_tools_game").on(t.targetGameId)]
);

// --- Agrégateur news ---
export const dbNews = sqliteTable(
	"db_news",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		sourceId: text("source_id").notNull(),
		sourceUrl: text("source_url").notNull().unique(),
		title: text("title").notNull(),
		titleJa: text("title_ja"),
		excerpt: text("excerpt"),
		category: text("category"), // "anime", "manga", "movie", "game", "event", "column"
		publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
		fetchedAt: integer("fetched_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		image: text("image"),
	},
	(t) => [
		index("idx_db_news_published").on(t.publishedAt),
		index("idx_db_news_source").on(t.sourceId),
		index("idx_db_news_category").on(t.category),
	]
);

// --- Relations Wiki ---

export const dbCharactersRelations = relations(dbCharacters, ({ one, many }) => ({
	originPlanet: one(dbPlanets, {
		fields: [dbCharacters.originPlanetId],
		references: [dbPlanets.id],
	}),
	transformations: many(dbTransformations),
	techniques: many(dbCharacterTechniques),
	games: many(dbGameCharacters),
}));

export const dbPlanetsRelations = relations(dbPlanets, ({ many }) => ({
	characters: many(dbCharacters),
	races: many(dbRaces),
}));

export const dbRacesRelations = relations(dbRaces, ({ one, many }) => ({
	homePlanet: one(dbPlanets, {
		fields: [dbRaces.homePlanetId],
		references: [dbPlanets.id],
	}),
}));

export const dbTransformationsRelations = relations(dbTransformations, ({ one }) => ({
	character: one(dbCharacters, {
		fields: [dbTransformations.characterId],
		references: [dbCharacters.id],
	}),
}));

export const dbCharacterTechniquesRelations = relations(dbCharacterTechniques, ({ one }) => ({
	character: one(dbCharacters, {
		fields: [dbCharacterTechniques.characterId],
		references: [dbCharacters.id],
	}),
	technique: one(dbTechniques, {
		fields: [dbCharacterTechniques.techniqueId],
		references: [dbTechniques.id],
	}),
}));

export const dbTechniquesRelations = relations(dbTechniques, ({ one, many }) => ({
	creator: one(dbCharacters, {
		fields: [dbTechniques.creatorId],
		references: [dbCharacters.id],
	}),
	characters: many(dbCharacterTechniques),
}));

export const dbSagasRelations = relations(dbSagas, ({ many }) => ({
	arcs: many(dbArcs),
}));

export const dbArcsRelations = relations(dbArcs, ({ one, many }) => ({
	saga: one(dbSagas, {
		fields: [dbArcs.sagaId],
		references: [dbSagas.id],
	}),
	episodes: many(dbEpisodes),
}));

export const dbEpisodesRelations = relations(dbEpisodes, ({ one }) => ({
	arc: one(dbArcs, {
		fields: [dbEpisodes.arcId],
		references: [dbArcs.id],
	}),
}));

export const dbMangaVolumesRelations = relations(dbMangaVolumes, ({ many }) => ({
	chapters: many(dbMangaChapters),
}));

export const dbMangaChaptersRelations = relations(dbMangaChapters, ({ one }) => ({
	volume: one(dbMangaVolumes, {
		fields: [dbMangaChapters.volumeId],
		references: [dbMangaVolumes.id],
	}),
}));

export const dbMoviesRelations = relations(dbMovies, ({ many }) => ({
	assets: many(dbAssets, { relationName: "movieAssets" }),
}));

export const dbGamesRelations = relations(dbGames, ({ many }) => ({
	characters: many(dbGameCharacters),
}));

export const dbGameCharactersRelations = relations(dbGameCharacters, ({ one }) => ({
	game: one(dbGames, {
		fields: [dbGameCharacters.gameId],
		references: [dbGames.id],
	}),
	character: one(dbCharacters, {
		fields: [dbGameCharacters.characterId],
		references: [dbCharacters.id],
	}),
}));

export const dbNewsRelations = relations(dbNews, ({ one }) => ({
	source: one(dbSources, {
		fields: [dbNews.sourceId],
		references: [dbSources.id],
	}),
}));

export const dbToolsRelations = relations(dbTools, ({ one }) => ({
	targetGame: one(dbGames, {
		fields: [dbTools.targetGameId],
		references: [dbGames.id],
	}),
}));

export const dbAssetsRelations = relations(dbAssets, ({ one }) => ({
	source: one(dbSources, {
		fields: [dbAssets.sourceId],
		references: [dbSources.id],
	}),
	license: one(dbLicenses, {
		fields: [dbAssets.licenseKey],
		references: [dbLicenses.key],
	}),
}));
