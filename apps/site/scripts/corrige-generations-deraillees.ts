#!/usr/bin/env bun
/**
 * Correcteur des **générations qui ont déraillé** dans les transcriptions de
 * databooks.
 *
 * Applique le module pur `../src/lib/databooks-ocr/generations-deraillees.ts`
 * (boucles dégénérées du modèle de vision, pavé halluciné recollé sous chaque
 * titre) sur `bot.db_databooks`, et dépose le résultat par l'API en mode
 * « merge » — idempotent, et chaque appel écrit une révision dans
 * `public.wiki_revisions`, donc réversible depuis /admin/wiki/history.
 *
 * Jumeau de `corrige-transcriptions-ocr.ts`, dont il partage les conventions
 * (mêmes modes, même lecture de `.env`, même dépôt) mais **pas** les règles :
 * les deux runners visent des familles de défauts disjointes et peuvent tourner
 * l'un après l'autre dans n'importe quel ordre.
 *
 * Modes (un seul requis) :
 *   --simulation            n'écrit rien, imprime un rapport chiffré + diffs
 *   --appliquer             dépose les corrections via l'API
 *
 * Filtres :
 *   --fiche <id>            une seule fiche (databook id)
 *   --limite N              limite le nombre de PLANCHES examinées
 *   --echantillons N        nombre de diffs affichés (défaut 5)
 *   --paquet N              pages par requête de dépôt (défaut 50)
 *
 * ## Le garde-fou des 50 %, et la seule voie qui le franchit
 *
 * `corrige-transcriptions-ocr.ts` écarte toute planche dont le texte corrigé
 * ferait moins de 50 % de l'original : aucune de ses règles n'est censée faire
 * disparaître autant de matière. Ici, **c'est le cas normal** — une planche de
 * 8 168 signes dont 8 120 sont « ？！ » répété doit tomber à 50 signes, et
 * perdre 99 % du texte EST la correction.
 *
 * Le garde reste donc actif et nominatif : il n'est franchi que si **toutes**
 * les règles qui ont agi appartiennent à `REGLES_BOUCLE_DEGENEREE`
 * (cf. `EXCEPTION_BOUCLE_DEGENEREE` plus bas). Toute autre coupe massive —
 * qui ne pourrait venir que d'une règle ajoutée plus tard sans y penser — est
 * écartée et listée pour relecture humaine, exactement comme dans l'autre
 * runner.
 *
 * ## Ce qu'une planche corrigée devient
 *
 * Rien ne disparaît : une planche vidée de sa boucle garde son préfixe lu, et
 * `classerDefaut` (`src/lib/databooks-defauts.ts`) la reclasse toute seule.
 * Si le préfixe est trop court ou porte encore une signature d'échec, elle
 * repart dans la file de `scripts/planches-a-relire.ts`. Le rapport les liste
 * nommément pour qu'aucune ne se perde.
 *
 * **Avant tout `--appliquer` en production, prendre un dump de
 * `bot.db_databooks`** — ce script n'écrit que par l'API et ne le fait pas
 * lui-même.
 */
import postgres from "postgres";
import {
	REGLES_BOUCLE_DEGENEREE,
	corrigerGenerationsDeraillees,
	type BoucleDetectee,
	type RapportRegle,
} from "../src/lib/databooks-ocr/generations-deraillees";
import { SEUIL_COURT, classerDefaut } from "../src/lib/databooks-defauts";
import { paquets } from "./depose-transcriptions";
import { origineSite } from "./_origine-site";

const args = process.argv.slice(2);
const flag = (nom: string) => args.includes(`--${nom}`);
const opt = (nom: string): string | undefined => {
	const i = args.indexOf(`--${nom}`);
	return i >= 0 ? args[i + 1] : undefined;
};

const SIMULATION = flag("simulation");
const APPLIQUER = flag("appliquer");
const FICHE = opt("fiche") ? Number(opt("fiche")) : null;
const LIMITE = opt("limite") ? Number(opt("limite")) : null;
const N_ECHANTILLONS = Number(opt("echantillons") ?? 5);
const PAQUET = Number(opt("paquet") ?? 50);

if (SIMULATION === APPLIQUER) {
	console.error("erreur : il faut choisir exactement un mode, --simulation OU --appliquer.");
	process.exit(2);
}

/** Dernière ligne qui matche : le `.env` a une ligne Neon commentée AVANT la locale. */
async function lireEnv(cle: string): Promise<string | undefined> {
	const contenu = await Bun.file(new URL("../.env", import.meta.url).pathname).text();
	return contenu
		.split("\n")
		.filter((l) => l.startsWith(`${cle}=`))
		.pop()
		?.slice(cle.length + 1)
		.replace(/^"|"$/g, "")
		.trim();
}

const DATABASE_URL = await lireEnv("DATABASE_URL");
if (!DATABASE_URL) throw new Error("DATABASE_URL introuvable dans apps/site/.env");
const sql = postgres(DATABASE_URL, { max: 2 });

const API = origineSite();
const JETON = ((await lireEnv("DATABOOKS_API_TOKEN")) ?? (await lireEnv("SHENRON_ADMIN_TOKEN")) ?? "").trim();
if (APPLIQUER && JETON.length < 16) {
	console.error("erreur : jeton absent — DATABOOKS_API_TOKEN ou SHENRON_ADMIN_TOKEN doit être dans apps/site/.env");
	process.exit(2);
}

interface Planche {
	id: number;
	titre: string;
	numero: number;
	texte: string;
}

console.log("· lecture des transcriptions…");
const planches = await sql<Planche[]>`
	SELECT d.id, d.title AS titre, (p ->> 'number')::int AS numero, p ->> 'text' AS texte
	FROM bot.db_databooks d, LATERAL jsonb_array_elements(
		CASE WHEN jsonb_typeof(d.pages) = 'array' THEN d.pages ELSE '[]'::jsonb END
	) p
	WHERE nullif(btrim(p ->> 'text'), '') IS NOT NULL
	${FICHE !== null ? sql`AND d.id = ${FICHE}` : sql``}
	ORDER BY d.id, numero
	${LIMITE !== null ? sql`LIMIT ${LIMITE}` : sql``}
`;
console.log(`  ${planches.length} planche(s) examinée(s)${FICHE !== null ? ` (fiche #${FICHE})` : ""}\n`);
if (planches.length === 0) {
	console.log("rien à faire.");
	await sql.end();
	process.exit(0);
}

// ---------------------------------------------------------------------------
// Correction
// ---------------------------------------------------------------------------

const SEUIL_SECURITE_LONGUEUR = 0.5;

interface Modification {
	planche: Planche;
	texteCorrige: string;
	regles: RapportRegle[];
	coupes: BoucleDetectee[];
	ratio: number;
	/** Le garde-fou des 50 % a-t-il été franchi par la voie nommée ? */
	exception: boolean;
}

/**
 * **La voie explicite.** Une planche peut passer sous les 50 % de sa longueur
 * d'origine si, et seulement si, toutes les règles qui ont agi sur elle sont
 * des règles de boucle dégénérée — les seules dont on ait prouvé que la
 * matière retirée est du texte que le modèle a inventé, pas du texte lu.
 *
 * Écrit comme un prédicat nommé plutôt qu'en désactivant le garde : le jour où
 * une règle est ajoutée à ce module, elle ne franchira le garde que si on
 * l'inscrit sciemment dans `REGLES_BOUCLE_DEGENEREE`.
 */
function EXCEPTION_BOUCLE_DEGENEREE(regles: RapportRegle[]): boolean {
	const agissantes = regles.filter((r) => r.corrections > 0);
	return agissantes.length > 0 && agissantes.every((r) => REGLES_BOUCLE_DEGENEREE.has(r.code));
}

const modifications: Modification[] = [];
const ecartesSecurite: { planche: Planche; ratio: number; regles: RapportRegle[] }[] = [];
const totauxParRegle = new Map<string, { planches: number; corrections: number }>();

for (const p of planches) {
	const { texte, modifie, rapport, coupes } = corrigerGenerationsDeraillees(p.texte);
	if (!modifie) continue;

	for (const r of rapport) {
		if (r.corrections === 0) continue;
		const acc = totauxParRegle.get(r.code) ?? { planches: 0, corrections: 0 };
		acc.planches++;
		acc.corrections += r.corrections;
		totauxParRegle.set(r.code, acc);
	}

	const ratio = p.texte.length > 0 ? texte.length / p.texte.length : 1;
	const exception = EXCEPTION_BOUCLE_DEGENEREE(rapport);
	if (ratio < SEUIL_SECURITE_LONGUEUR && !exception) {
		ecartesSecurite.push({ planche: p, ratio, regles: rapport });
		continue;
	}
	modifications.push({ planche: p, texteCorrige: texte, regles: rapport, coupes, ratio, exception });
}

// ---------------------------------------------------------------------------
// Rapport
// ---------------------------------------------------------------------------

const LIBELLES: Record<string, string> = {
	"boucle-degeneree": "Boucle dégénérée (motif répété en rafale)",
	"bloc-hallucine-repete": "Pavé halluciné recollé sous chaque titre",
};

console.log("=".repeat(78));
console.log("RÈGLES");
console.log("=".repeat(78));
for (const [code, libelle] of Object.entries(LIBELLES)) {
	const acc = totauxParRegle.get(code);
	console.log(
		`${libelle.padEnd(46)} ${String(acc?.planches ?? 0).padStart(5)} planche(s)  ${String(acc?.corrections ?? 0).padStart(6)} coupe(s)`
	);
}
const parException = modifications.filter((m) => m.ratio < SEUIL_SECURITE_LONGUEUR);
console.log(`\nplanches modifiées : ${modifications.length} / ${planches.length}`);
console.log(
	`  dont sous les ${Math.round(SEUIL_SECURITE_LONGUEUR * 100)} % de la longueur d'origine, admises par EXCEPTION_BOUCLE_DEGENEREE : ${parException.length}`
);
if (ecartesSecurite.length > 0) {
	console.log(`\n⚠ ${ecartesSecurite.length} planche(s) ÉCARTÉE(S) par le garde-fou (hors voie d'exception) — À RELIRE :`);
	for (const e of ecartesSecurite) {
		console.log(`  #${e.planche.id} "${e.planche.titre}" p.${e.planche.numero} — ratio ${(e.ratio * 100).toFixed(0)} %`);
	}
}

// Ce qui, après correction, doit repartir en relecture humaine : le texte
// gardé porte encore une signature d'échec, ou n'a plus assez de matière.
const aRelire = modifications
	.map((m) => ({ m, defaut: classerDefaut(m.texteCorrige) }))
	.filter((x) => x.defaut !== null);
console.log(`\n${"-".repeat(78)}`);
console.log(`RENVOYÉES EN RELECTURE HUMAINE APRÈS CORRECTION : ${aRelire.length} planche(s)`);
console.log(`(seuil « courte » = ${SEUIL_COURT} signes ; la file scripts/planches-a-relire.ts les reprend d'elle-même)`);
for (const { m, defaut } of aRelire) {
	console.log(
		`  #${m.planche.id} "${m.planche.titre}" p.${m.planche.numero} — ${m.planche.texte.length} → ${m.texteCorrige.length} signes, défaut résiduel : ${defaut}`
	);
}
const propres = modifications.length - aRelire.length;
console.log(`\n${propres} planche(s) ne portent plus AUCUNE signature d'échec après correction.`);

if (N_ECHANTILLONS > 0 && modifications.length > 0) {
	console.log(`\n${"=".repeat(78)}`);
	console.log(`ÉCHANTILLONS (${N_ECHANTILLONS} des coupes les plus profondes)`);
	console.log("=".repeat(78));
	const tries = [...modifications].sort((a, b) => a.ratio - b.ratio).slice(0, N_ECHANTILLONS);
	for (const m of tries) {
		const motifs = m.coupes
			.map((c) => `${c.repetitions.toFixed(0)}× « ${m.planche.texte.slice(c.debut, c.debut + c.periode).replace(/\n/g, "⏎")} »`)
			.join(" | ");
		console.log(`\n[#${m.planche.id} "${m.planche.titre}" p.${m.planche.numero}] ${m.planche.texte.length} → ${m.texteCorrige.length} (${(m.ratio * 100).toFixed(0)} %)`);
		console.log(`  motif(s) : ${motifs}`);
		console.log(`  avant : ${m.planche.texte.slice(0, 180).replace(/\n/g, "⏎")}…`);
		console.log(`  après : ${m.texteCorrige.slice(0, 240).replace(/\n/g, "⏎")}`);
	}
}

// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------

if (SIMULATION) {
	console.log(
		`\n(simulation : rien n'a été écrit — relancer avec --appliquer pour déposer ${modifications.length} planche(s))`
	);
	await sql.end();
	process.exit(0);
}

console.log(`\n${"=".repeat(78)}`);
console.log(`APPLICATION — dépôt de ${modifications.length} planche(s) via ${API}`);
console.log("=".repeat(78));

const parOuvrage = new Map<number, Modification[]>();
for (const m of modifications) {
	const liste = parOuvrage.get(m.planche.id) ?? [];
	liste.push(m);
	parOuvrage.set(m.planche.id, liste);
}

let deposees = 0;
let echecs = 0;
for (const [databookId, liste] of [...parOuvrage.entries()].sort((a, b) => a[0] - b[0])) {
	for (const lot of paquets(liste, PAQUET)) {
		const corps = JSON.stringify({
			mode: "merge",
			pages: lot.map((m) => ({ number: m.planche.numero, text: m.texteCorrige })),
		});
		let ok = false;
		let detail = "";
		for (let essai = 1; essai <= 2; essai++) {
			try {
				const r = await fetch(`${API}/api/databooks/${databookId}/transcription`, {
					method: "POST",
					headers: { Authorization: `Bearer ${JETON}`, "Content-Type": "application/json" },
					body: corps,
				});
				detail = await r.text();
				if (r.ok) {
					ok = true;
					break;
				}
				if (r.status < 500 || essai === 2) break;
			} catch (e) {
				detail = (e as Error).message;
				if (essai === 2) break;
			}
			await new Promise((res) => setTimeout(res, 5_000));
		}
		if (ok) {
			deposees += lot.length;
			console.log(`  #${databookId} ${lot.length} page(s) -> ${detail.slice(0, 140)}`);
		} else {
			echecs += lot.length;
			console.error(`  #${databookId} ÉCHEC : ${detail.slice(0, 200)}`);
		}
	}
}

console.log(`\n${deposees} page(s) déposée(s), ${echecs} en échec.`);
await sql.end();
if (echecs > 0) process.exit(1);
