import { eq, sql, type SQL } from "drizzle-orm";
import { container } from "tsyringe";
import { DatabaseService } from "~/db/index";
import * as schema from "~/db/schema";
import { logger } from "~/lib/logger";

/**
 * Whitelist des tables CRUD-able depuis le dashboard.
 *
 * Pour chaque table on déclare :
 *   - `table` : la drizzle table
 *   - `pk` : nom de la colonne primary key (utilisée par GET/PUT/DELETE par id)
 *   - `readonly` : si true, seul GET autorisé
 *   - `mutableColumns` : whitelist des colonnes éditables via PUT (sécurité)
 *
 * Les tables non listées ici sont **invisibles** depuis l'API — pas de fuite
 * accidentelle (ex: `vocal_tempo` qui contient des IDs voice cache, n'a pas
 * besoin d'être éditable depuis un dashboard).
 */

interface TableSpec {
	name: string;
	table: any;
	pk: string;
	readonly?: boolean;
	mutableColumns?: string[];
	description?: string;
}

export const TABLES: TableSpec[] = [
	{
		name: "users",
		table: schema.users,
		pk: "id",
		mutableColumns: [
			"xp",
			"zeni",
			"currentLevelRoleId",
			"lastLevelReached",
			"messageCount",
			"totalVoiceMs",
			"equippedCard",
			"equippedBadge",
			"equippedColor",
			"equippedTitle",
		],
		description: "Joueurs (XP, zeni, équipement)",
	},
	{
		name: "inventory",
		table: schema.inventory,
		pk: "id",
		mutableColumns: [],
		description: "Possessions des joueurs (read-only — utilise /custom give)",
		readonly: true,
	},
	{
		name: "shop_items",
		table: schema.shopItems,
		pk: "key",
		mutableColumns: [
			"name",
			"description",
			"price",
			"roleId",
			"meta",
			"enabled",
		],
		description: "Items du shop",
	},
	{
		name: "achievements",
		table: schema.achievements,
		pk: "id",
		readonly: true,
		description: "Succès débloqués par utilisateur",
	},
	{
		name: "achievement_triggers",
		table: schema.achievementTriggers,
		pk: "code",
		mutableColumns: ["description", "pattern", "flags", "enabled"],
		description: "Patterns regex de succès",
	},
	{
		name: "level_rewards",
		table: schema.levelRewards,
		pk: "level",
		mutableColumns: ["roleId", "zeniBonus", "xpThreshold"],
		description: "Niveau → rôle + bonus zeni",
	},
	{
		name: "guild_settings",
		table: schema.guildSettings,
		pk: "key",
		mutableColumns: ["value"],
		description: "Settings runtime",
	},
	{
		name: "warns",
		table: schema.warns,
		pk: "id",
		mutableColumns: ["active"],
		description: "Avertissements",
	},
	{
		name: "jails",
		table: schema.jails,
		pk: "userId",
		mutableColumns: ["expiresAt", "active"],
		description: "Joueurs en jail",
	},
	{
		name: "tickets",
		table: schema.tickets,
		pk: "id",
		mutableColumns: ["status", "closedAt"],
		description: "Tickets de support",
	},
	{
		name: "giveaways",
		table: schema.giveaways,
		pk: "id",
		mutableColumns: ["title", "description", "winners", "endsAt", "ended"],
		description: "Giveaways",
	},
	{
		name: "fusions",
		table: schema.fusions,
		pk: "id",
		readonly: true,
		description: "Fusions actives",
	},
	{
		name: "db_planets",
		table: schema.dbPlanets,
		pk: "id",
		mutableColumns: [
			"name",
			"nameJa",
			"nameRomaji",
			"image",
			"isDestroyed",
			"description",
		],
		description: "Wiki planètes",
	},
	{
		name: "db_characters",
		table: schema.dbCharacters,
		pk: "id",
		mutableColumns: [
			"name",
			"nameJa",
			"nameRomaji",
			"image",
			"ki",
			"maxKi",
			"race",
			"gender",
			"affiliation",
			"description",
			"originPlanetId",
		],
		description: "Wiki personnages",
	},
	{
		name: "db_transformations",
		table: schema.dbTransformations,
		pk: "id",
		mutableColumns: ["name", "image", "ki", "characterId"],
		description: "Wiki transformations",
	},
	{
		name: "db_sagas",
		table: schema.dbSagas,
		pk: "id",
		mutableColumns: [
			"slug",
			"name",
			"nameJa",
			"series",
			"orderIdx",
			"description",
			"image",
		],
		description: "Wiki sagas",
	},
	{
		name: "db_arcs",
		table: schema.dbArcs,
		pk: "id",
		mutableColumns: [
			"sagaId",
			"slug",
			"name",
			"nameJa",
			"orderIdx",
			"description",
		],
		description: "Wiki arcs narratifs",
	},
	{
		name: "db_episodes",
		table: schema.dbEpisodes,
		pk: "id",
		mutableColumns: [
			"series",
			"numberInSeries",
			"title",
			"titleJa",
			"titleRomaji",
			"arcId",
			"airDate",
			"durationSec",
			"synopsis",
			"image",
			"videoUrl",
			"malId",
		],
		description: "Wiki épisodes",
	},
	{
		name: "db_movies",
		table: schema.dbMovies,
		pk: "id",
		mutableColumns: [
			"slug",
			"title",
			"titleJa",
			"titleRomaji",
			"series",
			"releaseDate",
			"durationMin",
			"synopsis",
			"poster",
			"malId",
			"anilistId",
		],
		description: "Wiki films",
	},
	{
		name: "db_games",
		table: schema.dbGames,
		pk: "id",
		mutableColumns: [
			"slug",
			"title",
			"titleJa",
			"platforms",
			"releaseDate",
			"publisher",
			"developer",
			"description",
			"cover",
			"officialUrl",
		],
		description: "Wiki jeux",
	},
	{
		name: "db_manga_volumes",
		table: schema.dbMangaVolumes,
		pk: "id",
		mutableColumns: [
			"series",
			"volumeNumber",
			"title",
			"titleJa",
			"publishedAt",
			"cover",
			"isbn",
		],
		description: "Wiki tomes manga",
	},
	{
		name: "db_manga_chapters",
		table: schema.dbMangaChapters,
		pk: "id",
		mutableColumns: [
			"series",
			"chapterNumber",
			"title",
			"titleJa",
			"volumeId",
			"publishedAt",
		],
		description: "Wiki chapitres manga",
	},
	{
		name: "db_races",
		table: schema.dbRaces,
		pk: "id",
		mutableColumns: ["slug", "name", "nameJa", "homePlanetId", "description"],
		description: "Wiki races",
	},
	{
		name: "db_techniques",
		table: schema.dbTechniques,
		pk: "id",
		mutableColumns: [
			"slug",
			"name",
			"nameJa",
			"nameRomaji",
			"type",
			"creatorId",
			"description",
			"debutEpisodeId",
			"debutChapterId",
		],
		description: "Wiki techniques",
	},
	{
		name: "db_tools",
		table: schema.dbTools,
		pk: "id",
		mutableColumns: [
			"slug",
			"name",
			"description",
			"url",
			"author",
			"language",
			"category",
			"targetGameId",
			"stars",
		],
		description: "Wiki outils",
	},
	{
		name: "db_news",
		table: schema.dbNews,
		pk: "id",
		mutableColumns: [
			"sourceId",
			"sourceUrl",
			"title",
			"titleJa",
			"excerpt",
			"category",
			"publishedAt",
			"image",
		],
		description: "Wiki news",
	},
	{
		name: "db_sources",
		table: schema.dbSources,
		pk: "id",
		mutableColumns: ["name", "url", "licenseKey", "attributionTemplate"],
		description: "Wiki sources/attribution",
	},
	{
		name: "db_licenses",
		table: schema.dbLicenses,
		pk: "key",
		mutableColumns: ["name", "url", "requiresAttribution", "shareAlike"],
		description: "Wiki licences",
	},
	{
		name: "db_assets",
		table: schema.dbAssets,
		pk: "id",
		mutableColumns: [
			"path",
			"sourceId",
			"sourceUrl",
			"licenseKey",
			"attribution",
			"mimeType",
			"width",
			"height",
			"entityType",
			"entityId",
			"role",
		],
		description: "Wiki médias/assets traçables",
	},
	{
		name: "action_logs",
		table: schema.actionLogs,
		pk: "id",
		readonly: true,
		description: "Audit trail",
	},
];

export function getTableSpec(name: string): TableSpec | undefined {
	return TABLES.find((t) => t.name === name);
}

export async function listRows(spec: TableSpec, limit: number, offset: number) {
	const dbs = container.resolve(DatabaseService);
	const rows = await dbs.db
		.select()
		.from(spec.table)
		.limit(limit)
		.offset(offset);
	const [{ count = 0 } = { count: 0 }] = await dbs.db
		.select({ count: sql<number>`COUNT(*)` })
		.from(spec.table);
	return { rows, total: Number(count), limit, offset };
}

export async function getRow(spec: TableSpec, id: string | number) {
	const dbs = container.resolve(DatabaseService);
	const cond = pkCond(spec, id);
	const rows = await dbs.db.select().from(spec.table).where(cond).limit(1);
	return rows[0] ?? null;
}

export async function insertRow(
	spec: TableSpec,
	body: Record<string, unknown>,
) {
	if (spec.readonly) throw new Error(`Table ${spec.name} en read-only.`);
	const dbs = container.resolve(DatabaseService);
	await dbs.db.insert(spec.table).values(body as any);
}

export async function updateRow(
	spec: TableSpec,
	id: string | number,
	body: Record<string, unknown>,
) {
	if (spec.readonly) throw new Error(`Table ${spec.name} en read-only.`);
	if (!spec.mutableColumns?.length)
		throw new Error(`Table ${spec.name} : aucune colonne mutable.`);
	const dbs = container.resolve(DatabaseService);
	const filtered: Record<string, unknown> = {};
	for (const col of spec.mutableColumns) {
		if (col in body) filtered[col] = body[col];
	}
	if (Object.keys(filtered).length === 0) {
		throw new Error("Aucune colonne mutable fournie.");
	}
	const cond = pkCond(spec, id);
	await dbs.db.update(spec.table).set(filtered).where(cond);
	logger.info(
		{ table: spec.name, id, cols: Object.keys(filtered) },
		"row updated via API",
	);
}

export async function deleteRow(spec: TableSpec, id: string | number) {
	if (spec.readonly) throw new Error(`Table ${spec.name} en read-only.`);
	const dbs = container.resolve(DatabaseService);
	const cond = pkCond(spec, id);
	await dbs.db.delete(spec.table).where(cond);
}

function pkCond(spec: TableSpec, id: string | number): SQL {
	const col = spec.table[spec.pk];
	if (!col) throw new Error(`PK ${spec.pk} introuvable sur ${spec.name}`);
	const coerced =
		typeof spec.table[spec.pk]?.dataType === "number" ? Number(id) : String(id);
	return eq(col, coerced as any);
}
