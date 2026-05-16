import { singleton, inject } from "tsyringe";
import { eq, like, sql } from "drizzle-orm";
import { DatabaseService } from "~/db/index";
import { dbCharacters, dbPlanets, dbTransformations, type DBCharacter, type DBPlanet, type DBTransformation } from "~/db/schema";
import { logger } from "~/lib/logger";

export type { DBCharacter, DBPlanet, DBTransformation };

export interface CharacterWithRelations extends DBCharacter {
  transformations: DBTransformation[];
  originPlanet: DBPlanet | null;
}

@singleton()
export class WikiService {
  constructor(@inject(DatabaseService) private dbs: DatabaseService) {}

  private get db() {
    return this.dbs.db;
  }

  /** Liste tous les personnages (local DB, rapide). */
  async listAll(): Promise<DBCharacter[]> {
    return this.db.select().from(dbCharacters);
  }

  /** Recherche fuzzy par nom (partial, case-insensitive). */
  async search(query: string, limit = 25): Promise<DBCharacter[]> {
    const q = query.trim();
    if (!q) return this.db.select().from(dbCharacters).limit(limit);
    return this.db
      .select()
      .from(dbCharacters)
      .where(like(sql`LOWER(${dbCharacters.name})`, `%${q.toLowerCase()}%`))
      .limit(limit);
  }

  async getCharacter(id: number): Promise<CharacterWithRelations | null> {
    const c = await this.db.query.dbCharacters.findFirst({ where: eq(dbCharacters.id, id) });
    if (!c) return null;
    const transformations = await this.db
      .select()
      .from(dbTransformations)
      .where(eq(dbTransformations.characterId, id));
    const originPlanet = c.originPlanetId
      ? (await this.db.query.dbPlanets.findFirst({ where: eq(dbPlanets.id, c.originPlanetId) })) ?? null
      : null;
    return { ...c, transformations, originPlanet };
  }

  async getPlanet(id: number): Promise<DBPlanet | null> {
    return (await this.db.query.dbPlanets.findFirst({ where: eq(dbPlanets.id, id) })) ?? null;
  }

  async listPlanets(): Promise<DBPlanet[]> {
    return this.db.select().from(dbPlanets);
  }

  async listRaces(): Promise<string[]> {
    const rows = await this.db.selectDistinct({ race: dbCharacters.race }).from(dbCharacters);
    return rows.map((r) => r.race).filter((r): r is string => !!r);
  }

  async listByRace(race: string): Promise<DBCharacter[]> {
    return this.db.select().from(dbCharacters).where(eq(dbCharacters.race, race));
  }

  async count(): Promise<{ characters: number; transformations: number; planets: number }> {
    const [c] = await this.db.select({ n: sql<number>`count(*)` }).from(dbCharacters);
    const [t] = await this.db.select({ n: sql<number>`count(*)` }).from(dbTransformations);
    const [p] = await this.db.select({ n: sql<number>`count(*)` }).from(dbPlanets);
    return {
      characters: Number(c?.n ?? 0),
      transformations: Number(t?.n ?? 0),
      planets: Number(p?.n ?? 0),
    };
  }

  /** Retourne true si la DB est déjà seedée (>0 personnages). */
  async isSeeded(): Promise<boolean> {
    const { characters } = await this.count();
    return characters > 0;
  }
}
