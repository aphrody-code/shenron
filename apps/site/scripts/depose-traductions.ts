#!/usr/bin/env bun
/**
 * Dépose les traductions françaises des planches de databook.
 *
 *   bun apps/site/scripts/depose-traductions.ts /tmp/traductions-01.jsonl
 *   bun apps/site/scripts/depose-traductions.ts /tmp/… --appliquer
 *
 * Entrée : un JSONL, une ligne par planche —
 *   {"databookId":4,"page":12,"fr":"…"}
 *
 * Écriture : la clé `text_fr` de la planche dans `bot.db_databooks.pages`, plus
 * `text_fr_by` (qui a traduit) et `text_fr_at` (quand). **Le japonais d'origine
 * n'est jamais touché** : la traduction s'ajoute à côté de sa source, ce qui
 * permet de la rejouer, de la comparer, et de l'écarter sans rien perdre.
 *
 * **Simulation par défaut** (`--appliquer` pour écrire), une révision
 * `public.wiki_revisions` par ouvrage et par dépôt — pas par planche : 10 000
 * révisions d'une ligne noieraient l'historique du wiki.
 *
 * Garde-fous, tous mesurés sur des sorties de modèle réelles :
 *   - une traduction qui contient encore des kana n'est pas une traduction ;
 *   - une traduction trois fois plus longue que sa source japonaise, ou dix fois
 *     plus courte, est un dérapage (glose, boucle, ou abandon) ;
 *   - les signatures d'échec du corpus (`classerDefaut`) valent aussi pour le
 *     français produit : une boucle reste une boucle.
 * Une ligne refusée n'interrompt pas le dépôt : elle est comptée et listée.
 */
import postgres from "postgres";
import { refus } from "../src/lib/databooks-traduction";

const args = process.argv.slice(2);
const flag = (nom: string) => args.includes(`--${nom}`);
const opt = (nom: string, def?: string) => {
	const i = args.indexOf(`--${nom}`);
	return i >= 0 ? (args[i + 1] ?? def) : def;
};
const fichier = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--par");

if (!fichier) {
	console.error(await Bun.file(import.meta.path).text().then((t) => t.split("*/")[0]!.replace(/^#!.*\n/, "")));
	process.exit(2);
}

const APPLIQUER = flag("appliquer");
const PAR = opt("par", "machine:sonnet")!;
async function urlBase(): Promise<string> {
	const brut = await Bun.file(new URL("../.env", import.meta.url).pathname).text();
	const lignes = brut.split("\n").filter((l) => l.startsWith("DATABASE_URL="));
	const url = lignes.at(-1)?.slice("DATABASE_URL=".length).replace(/^"|"$/g, "").trim();
	if (!url) throw new Error("DATABASE_URL introuvable dans apps/site/.env");
	return url;
}

const sql = postgres(await urlBase(), { max: 2, prepare: false });
/** `sql.json()` et jamais `JSON.stringify(...)::jsonb` : le driver ré-encoderait la chaîne. */
const jsonb = (valeur: unknown) => sql.json(valeur as Parameters<typeof sql.json>[0]);
const idRevision = () =>
	Array.from({ length: 24 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");

interface Ligne { databookId: number; page: number; fr: string }

try {
	const contenu = await Bun.file(fichier).text();
	const lignes: Ligne[] = [];
	let illisibles = 0;
	for (const l of contenu.split("\n")) {
		const brut = l.trim();
		if (!brut) continue;
		try {
			const o = JSON.parse(brut) as Ligne;
			if (!Number.isInteger(o.databookId) || !Number.isInteger(o.page) || typeof o.fr !== "string") {
				illisibles++;
				continue;
			}
			lignes.push(o);
		} catch {
			illisibles++;
		}
	}
	if (lignes.length === 0) throw new Error("aucune ligne exploitable");

	const ids = [...new Set(lignes.map((l) => l.databookId))];
	// `= any(${tableau})` casse avec postgres-js (« malformed array literal ») :
	// la forme qui marche est `in ${sql(tableau)}`, que le driver développe.
	const ouvrages = await sql<{ id: string; title: string; pages: unknown[] }[]>`
		SELECT id, title, pages FROM bot.db_databooks WHERE id in ${sql(ids)}
	`;

	let deposees = 0;
	let refusees = 0;
	const rapports: string[] = [];

	for (const ouvrage of ouvrages) {
		const miennes = lignes.filter((l) => l.databookId === Number(ouvrage.id));
		const pages = (ouvrage.pages ?? []) as Record<string, unknown>[];
		const index = new Map(pages.map((p, i) => [Number(p.number), i]));
		const avant: Record<string, unknown> = {};
		const apres: Record<string, unknown> = {};
		let touchees = 0;

		for (const ligne of miennes) {
			const i = index.get(ligne.page);
			if (i === undefined) {
				rapports.push(`  ✗ ${ouvrage.id}/${ligne.page} — planche absente de l'ouvrage`);
				refusees++;
				continue;
			}
			const ja = String(pages[i]!.text ?? "");
			const motif = refus(ligne.fr, ja);
			if (motif) {
				rapports.push(`  ✗ ${ouvrage.id}/${ligne.page} — ${motif}`);
				refusees++;
				continue;
			}
			avant[String(ligne.page)] = pages[i]!.text_fr ?? null;
			apres[String(ligne.page)] = ligne.fr.trim();
			pages[i] = { ...pages[i], text_fr: ligne.fr.trim(), text_fr_by: PAR, text_fr_at: Date.now() };
			touchees++;
			deposees++;
		}

		if (touchees === 0) continue;
		console.log(`${ouvrage.title} (#${ouvrage.id}) : ${touchees} planches traduites`);
		if (!APPLIQUER) continue;

		await sql.begin(async (tx) => {
			await tx`UPDATE bot.db_databooks SET pages = ${jsonb(pages)} WHERE id = ${Number(ouvrage.id)}`;
			await tx`INSERT INTO public.wiki_revisions ${tx({
				id: idRevision(),
				tableName: "db_databooks",
				rowId: String(ouvrage.id),
				action: "update",
				label: `${ouvrage.title} — traduction FR de ${touchees} planches`,
				before: jsonb({ text_fr: avant }),
				after: jsonb({ text_fr: apres }),
				editorId: "agent",
				editorName: `Traduction ja→fr (${PAR})`,
			})}`;
		});
	}

	if (rapports.length) console.log(`\nrefus :\n${rapports.join("\n")}`);
	console.log(
		`\n${deposees} traductions retenues, ${refusees} refusées${illisibles ? `, ${illisibles} lignes illisibles` : ""}.`,
	);
	if (!APPLIQUER) console.log("(simulation — relancer avec --appliquer)");
} catch (e) {
	console.error(`✗ ${(e as Error).message}`);
	process.exitCode = 1;
} finally {
	await sql.end();
}
