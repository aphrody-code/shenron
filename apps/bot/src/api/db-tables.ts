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
    mutableColumns: ["name", "description", "price", "roleId", "meta", "enabled"],
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
    mutableColumns: ["name", "description", "isDestroyed", "imageLocal"],
    description: "Wiki planètes",
  },
  {
    name: "db_characters",
    table: schema.dbCharacters,
    pk: "id",
    mutableColumns: ["name", "ki", "race", "gender", "description", "imageLocal"],
    description: "Wiki personnages",
  },
  {
    name: "db_transformations",
    table: schema.dbTransformations,
    pk: "id",
    mutableColumns: ["name", "ki", "imageLocal"],
    description: "Wiki transformations",
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
  const rows = await dbs.db.select().from(spec.table).limit(limit).offset(offset);
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

export async function insertRow(spec: TableSpec, body: Record<string, unknown>) {
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
  if (!spec.mutableColumns?.length) throw new Error(`Table ${spec.name} : aucune colonne mutable.`);
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
  logger.info({ table: spec.name, id, cols: Object.keys(filtered) }, "row updated via API");
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
  const coerced = typeof spec.table[spec.pk]?.dataType === "number" ? Number(id) : String(id);
  return eq(col, coerced as any);
}
