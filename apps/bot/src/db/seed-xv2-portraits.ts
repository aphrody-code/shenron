import "reflect-metadata";
import { existsSync } from "node:fs";
import { eq } from "drizzle-orm";
import { container } from "tsyringe";
import { DatabaseService } from "~/db/index";
import { dbCharacters } from "~/db/schema";

/**
 * Seed des portraits Xenoverse 2 sur db_characters.portraitXv2.
 *
 * Les portraits (visages de l'écran de sélection XV2) sont extraits de
 * l'atlas du jeu `ui/texture/CHARA01.emb` via le toolkit dbxv2, puis copiés
 * dans `assets/dbz/xv2-portraits/<CODE>.png` (1 PNG par code perso 3 lettres).
 * Manifest complet : `assets/dbz/xv2-portraits/xv2-portraits.json`.
 *
 * Cette table mappe les **codes XV2** (connus de la communauté de modding) vers
 * les **id de db_characters** (cf. bot.db). Mapping curé/conservateur : seuls les
 * codes dont l'identité est certaine sont inclus, pour ne jamais afficher le
 * mauvais portrait. Pour les formes multiples, on choisit la forme de base la
 * plus reconnaissable (ex. Cell parfait, Trunks du futur, Gohan adulte).
 *
 * Lancer : `bun src/db/seed-xv2-portraits.ts` (ou `bun db:seed-xv2-portraits`).
 */
const PORTRAIT_DIR = "./assets/dbz/xv2-portraits";

// id db_characters -> code portrait XV2
const PORTRAIT_MAP: Record<number, string> = {
	1: "GOK", // Goku
	2: "VGT", // Vegeta
	3: "PIC", // Piccolo
	4: "BUL", // Bulma
	5: "FRZ", // Freezer (forme finale)
	6: "ZBN", // Zarbon
	7: "DDR", // Dodoria
	8: "GNY", // Ginyu
	9: "CL4", // Celula / Cell (parfait)
	10: "GHL", // Gohan (adulte)
	11: "KLL", // Krillin
	13: "YMC", // Yamcha
	15: "GTX", // Gotenks
	16: "TRX", // Trunks (du futur)
	18: "BDK", // Bardock
	22: "G17", // Android 17
	23: "G16", // Android 16
	26: "G13", // Android 13
	29: "NIL", // Nail
	30: "RAD", // Raditz
	32: "BUU", // Majin Buu (gros)
	33: "BLS", // Bills / Beerus
	34: "WIS", // Whis
	38: "JRN", // Jiren
	39: "TPO", // Toppo
	64: "G18", // Android 18
	65: "GGT", // Gogeta
	66: "VTO", // Vegetto / Vegito
	67: "JNB", // Janemba
	68: "BRL", // Broly
};

const dbs = container.resolve(DatabaseService);
const db = dbs.db;

let updated = 0;
let missing = 0;
for (const [idStr, code] of Object.entries(PORTRAIT_MAP)) {
	const id = Number(idStr);
	const rel = `${PORTRAIT_DIR}/${code}.png`;
	if (!existsSync(rel)) {
		console.warn(`  ⚠ portrait introuvable: ${rel} (id ${id})`);
		missing++;
		continue;
	}
	const res = await db
		.update(dbCharacters)
		.set({ portraitXv2: rel })
		.where(eq(dbCharacters.id, id));
	// drizzle/bun:sqlite renvoie { changes } ; on compte simplement l'intention.
	void res;
	updated++;
	console.log(`  ✓ id ${id.toString().padStart(2)} → ${code}.png`);
}

console.log(`✓ ${updated} portraits XV2 seedés${missing ? ` (${missing} manquants)` : ""}`);
dbs.close();
