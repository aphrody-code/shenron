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

// Bannières par niveau (assets/banners/banner-NN.ext fournies par Omar 2026-05-12, 19 disponibles)
const BANNERS: Record<number, string> = {
	1: "assets/banners/banner-01.jpg",
	2: "assets/banners/banner-02.jpg",
	3: "assets/banners/banner-03.png",
	4: "assets/banners/banner-04.jpg",
	5: "assets/banners/banner-05.jpg",
	6: "assets/banners/banner-06.jpg",
	7: "assets/banners/banner-07.jpg",
	8: "assets/banners/banner-08.jpg",
	9: "assets/banners/banner-09.png",
	10: "assets/banners/banner-10.jpg",
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
