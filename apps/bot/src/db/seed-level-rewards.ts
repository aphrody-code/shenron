import "reflect-metadata";
import { container } from "tsyringe";
import { DatabaseService } from "~/db/index";
import { levelRewards } from "~/db/schema";
import { LEVEL_THRESHOLDS, ZENI_PER_LEVEL } from "~/lib/constants";

/**
 * Mapping palier XP → rôle DBZ existant sur Dragon Ball FR.
 * Les IDs proviennent de data/guild-scan.json (scan du 2026-04-24).
 * Chaque palier LEVEL_THRESHOLDS (1..10) est attaché à un rôle distinct
 * en suivant la progression canonique Saiyan (Kaioken → UI Parfait).
 */
const LEVEL_ROLE_MAP: Record<number, { roleId: string; roleName: string }> = {
	1: { roleId: "1058910891124457482", roleName: "Kaioken" },
	2: { roleId: "1058910426164908075", roleName: "Super Saiyan" },
	3: { roleId: "1058910477847109743", roleName: "Super Saiyan 2" },
	4: { roleId: "1058910518720593920", roleName: "Super Saiyan 3" },
	5: { roleId: "1058910672068563024", roleName: "Super Saiyan 4" },
	6: { roleId: "1058910743736614962", roleName: "Super Saiyan God" },
	7: { roleId: "1058910776687087637", roleName: "Super Saiyan Blue" },
	8: { roleId: "1074616048487247902", roleName: "Super Saiyan Blue Évolution" },
	9: { roleId: "1074616052350193674", roleName: "Ultra Instinct" },
	10: { roleId: "1074619485450932304", roleName: "Perfect Ultra Instinct" },
};

const dbs = container.resolve(DatabaseService);
const db = dbs.db;

await db.delete(levelRewards);

/**
 * Bannières par niveau — mapping CANON DBZ après analyse visuelle + fact-check
 * Google (Dragon Ball Wiki, kanzenshuu) le 2026-05-16. Chaque palier reflète
 * une étape narrative de la franchise, du début enfance DB à l'apex Ultra Instinct.
 *
 *   L1  Goku enfant + Shenron (DB Original — début de l'aventure)
 *   L2  Goku + Gohan enfant (DBZ Saga Saiyan/Namek — avant SSJ)
 *   L3  Goku SSJ vs Frieza (DBZ Namek — 1er Super Saiyan canon)
 *   L4  Goku SSJ Kamehameha (DBZ — puissance brute SSJ)
 *   L5  5 Super Saiyans ère Cell (Goku, Trunks adulte, Gohan, Trunks bébé, Piccolo)
 *   L6  Goku SSJ3 (DBZ Saga Buu — apex DBZ classique)
 *   L7  Goku SSG rosé vs Beerus (DBS Battle of Gods — entrée dans le divin)
 *   L8  Goku+Vegeta SSJ4 (DB GT — apex Saiyan)
 *   L9  Merged Zamasu (DBS Future Trunks — antagoniste ultime, demi-visage violet mutilé)
 *   L10 Goku Ultra Instinct Maîtrisé silhouette rainbow (DBS TdP ep.130 — endgame absolu)
 *
 * Les 9 bannières restantes (01,03,05,09,13,15,16,18,19) sont disponibles
 * comme items "banner_*" dans le shop (cosmétiques, prix échelonnés Zéni).
 */
const BANNERS: Record<number, string> = {
	1: "assets/banners/banner-17.jpg", // Goku enfant + Shenron
	2: "assets/banners/banner-14.jpg", // Goku + Gohan enfant
	3: "assets/banners/banner-06.jpg", // Goku SSJ vs Frieza
	4: "assets/banners/banner-08.jpg", // Goku SSJ Kamehameha
	5: "assets/banners/banner-04.jpg", // 5 SSJ ère Cell
	6: "assets/banners/banner-12.jpg", // Goku SSJ3
	7: "assets/banners/banner-10.jpg", // Goku SSG vs Beerus
	8: "assets/banners/banner-07.jpg", // Goku+Vegeta SSJ4 (GT)
	9: "assets/banners/banner-11.jpg", // Merged Zamasu
	10: "assets/banners/banner-02.jpg", // Ultra Instinct Maîtrisé silhouette
};

for (const { level, xp } of LEVEL_THRESHOLDS) {
	const map = LEVEL_ROLE_MAP[level];
	if (!map) continue;
	await db.insert(levelRewards).values({
		level,
		roleId: map.roleId,
		xpThreshold: xp,
		zeniBonus: ZENI_PER_LEVEL * level,
		bannerUrl: BANNERS[level] ?? null,
	});
	console.log(
		`  L${level.toString().padStart(2)} (${xp.toLocaleString("fr").padStart(11)} XP) → ${map.roleName} · ${BANNERS[level] ?? "—"}`,
	);
}

console.log(`✓ ${LEVEL_THRESHOLDS.length} level rewards seeded`);
dbs.close();
