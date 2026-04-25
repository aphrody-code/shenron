import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

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

    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => [index("idx_users_xp").on(t.xp), index("idx_users_zeni").on(t.zeni)],
);

export const inventory = sqliteTable(
  "inventory",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemType: text("item_type", { enum: ["card", "badge", "color", "title"] }).notNull(),
    itemKey: text("item_key").notNull(),
    acquiredAt: integer("acquired_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => [
    uniqueIndex("uq_inventory_user_item").on(t.userId, t.itemType, t.itemKey),
    index("idx_inventory_user").on(t.userId),
  ],
);

export const shopItems = sqliteTable(
  "shop_items",
  {
    key: text("key").primaryKey(),
    type: text("type", { enum: ["card", "badge", "color", "title"] }).notNull(),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    // Pour color: roleId que l'on donne. Pour badge/title: meta JSON.
    roleId: text("role_id"),
    meta: text("meta"), // JSON sérialisé
    enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  },
  (t) => [index("idx_shop_type").on(t.type)],
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
  ],
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
  ],
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
  (t) => [index("idx_warns_user").on(t.userId)],
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
  (t) => [index("idx_jails_user").on(t.userId), index("idx_jails_expires").on(t.expiresAt)],
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
  (t) => [index("idx_tickets_owner").on(t.ownerId), index("idx_tickets_closed").on(t.closed)],
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
  (t) => [index("idx_vocal_owner").on(t.ownerId)],
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
  (t) => [uniqueIndex("uq_voctempo_ban").on(t.ownerId, t.bannedUserId)],
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
  (t) => [index("idx_giveaway_ends").on(t.endsAt), index("idx_giveaway_ended").on(t.ended)],
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
  (t) => [uniqueIndex("uq_giveaway_entry").on(t.giveawayId, t.userId)],
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
  ],
);

/* ============================================================
 * DragonBall wiki — personnages, transformations, planètes
 * Source : dump MySQL de api-dragonball (intentodepirata/api-dragonball)
 * ========================================================= */
export const dbPlanets = sqliteTable("db_planets", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  image: text("image").notNull(),
  isDestroyed: integer("is_destroyed", { mode: "boolean" }).notNull().default(false),
  description: text("description"),
});

export const dbCharacters = sqliteTable(
  "db_characters",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull().unique(),
    image: text("image").notNull(), // path local dans assets/dbz/characters/
    ki: text("ki"),
    maxKi: text("max_ki"),
    race: text("race"),
    gender: text("gender"),
    affiliation: text("affiliation"),
    description: text("description"),
    originPlanetId: integer("origin_planet_id"),
  },
  (t) => [index("idx_db_char_race").on(t.race), index("idx_db_char_affiliation").on(t.affiliation)],
);

export const dbTransformations = sqliteTable(
  "db_transformations",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    image: text("image").notNull(),
    ki: text("ki"),
    characterId: integer("character_id").notNull(),
  },
  (t) => [index("idx_db_transfo_char").on(t.characterId)],
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
