import type { GuildMember } from "discord.js";
import { RACE_IDS, RACES, type RaceId } from "~/lib/races";

/**
 * Échelle de transformations (rôles de palier) PAR RACE.
 *
 * Chaque race possède sa propre suite de rôles « transformation » attribués au fil
 * des paliers de niveau (1..10, cf. LEVEL_THRESHOLDS). Quand un membre change de
 * race, on RETIRE les rôles de palier des autres races et on (re)pose ceux de sa
 * race actuelle jusqu'à son niveau (cf. LevelService.syncRaceLevelRoles).
 *
 * Saiyan = échelle canonique historique (Kaioken → Perfect Ultra Instinct), reprise
 * de data/guild-scan.json — c'est la seule source de vérité des roleId Saiyan
 * (le seed level_rewards la réutilise). Les AUTRES races sont à COMPLÉTER avec les
 * rôles Discord fournis par l'admin (rôles à créer côté serveur) : laissées vides
 * pour l'instant → tant qu'une race n'a pas de paliers, ses membres n'ont pas de
 * rôle de transformation (et passer à cette race retire bien les transfos de
 * l'ancienne race).
 *
 * Module PUR (aucune dépendance DB) → testable.
 */
export const RACE_LEVEL_ROLES: Record<RaceId, Partial<Record<number, string>>> = {
	saiyan: {
		1: "1058910891124457482", // Kaioken
		2: "1058910426164908075", // Super Saiyan
		3: "1058910477847109743", // Super Saiyan 2
		4: "1058910518720593920", // Super Saiyan 3
		5: "1058910672068563024", // Super Saiyan 4
		6: "1058910743736614962", // Super Saiyan God
		7: "1058910776687087637", // Super Saiyan Blue
		8: "1074616048487247902", // Super Saiyan Blue Évolution
		9: "1074616052350193674", // Ultra Instinct
		10: "1074619485450932304", // Perfect Ultra Instinct
	},
	// À compléter (rôles Discord par palier fournis par l'admin) :
	humain: {},
	namek: {},
	mutant: {},
	cyborg: {},
	majin: {},
};

/** Race de repli pour l'attribution des paliers quand aucun rôle de race n'est posé. */
export const DEFAULT_LEVEL_RACE: RaceId = "saiyan";

const ROLE_TO_RACE = new Map<string, RaceId>(RACE_IDS.map((id) => [RACES[id].roleId, id]));

/** Tous les rôles de transformation, toutes races confondues (pour le nettoyage). */
export const ALL_RACE_LEVEL_ROLE_IDS: readonly string[] = RACE_IDS.flatMap((id) =>
	Object.values(RACE_LEVEL_ROLES[id]).filter((r): r is string => !!r)
);

/** Rôles de palier d'une race jusqu'au niveau `uptoLevel` inclus. */
export function raceLevelRoleIds(race: RaceId, uptoLevel: number): string[] {
	const map = RACE_LEVEL_ROLES[race];
	const out: string[] = [];
	for (let lvl = 1; lvl <= uptoLevel; lvl++) {
		const r = map[lvl];
		if (r) out.push(r);
	}
	return out;
}

/** Niveau associé à un rôle de palier (toutes races) ou null. */
export function levelOfRoleId(roleId: string): number | null {
	for (const id of RACE_IDS) {
		for (const [lvl, rid] of Object.entries(RACE_LEVEL_ROLES[id])) {
			if (rid === roleId) return Number(lvl);
		}
	}
	return null;
}

/** Race effective d'un membre = la race dont il porte le rôle Discord, sinon null. */
export function memberRaceId(member: GuildMember): RaceId | null {
	for (const [roleId, race] of ROLE_TO_RACE) {
		if (member.roles.cache.has(roleId)) return race;
	}
	return null;
}
