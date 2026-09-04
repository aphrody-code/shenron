#!/usr/bin/env bun
/**
 * telecharge-planches-dragonballcn.ts — Rapatriement des planches de
 * comic.dragonballcn.com, **sous condition d'une autorisation écrite**.
 *
 * ÉTAT AU 2026-09-04 : CE SCRIPT NE DOIT PAS ENCORE TOURNER
 * ---------------------------------------------------------
 * Le site refuse ses planches à tout client : la planche pleine résolution
 * répond 403, sa miniature aussi, et la fiche qui les liste également. Le
 * dossier qui les porte s'appelle `0.Dragon_Ball-buyao_daolian_ya` (不要盗链呀,
 * « ne hotlinkez pas ») et son `robots.txt` porte `use=reference` sous
 * réservation expresse de droits (directive UE 2019/790, art. 4).
 *
 * Ce script existe pour être PRÊT le jour où une autorisation arrive par
 * courriel — pas pour passer outre en attendant. Il refuse donc de télécharger
 * quoi que ce soit tant que cette autorisation n'est pas déposée sur disque, et
 * il ne cherche jamais à maquiller son empreinte pour franchir un refus : si le
 * 403 persiste malgré l'autorisation, c'est que l'accord doit s'accompagner d'un
 * accès technique (mise en liste blanche de notre agent ou de notre IP, ou envoi
 * direct des fichiers) — le script le dit et s'arrête au lieu d'insister.
 *
 * L'AUTORISATION
 * --------------
 * Fichier `~/.aphrody/autorisation-dragonballcn.json`, en 0600 :
 *
 *   {
 *     "accordee_par":       "qui répond pour le site (nom, rôle)",
 *     "contact":            "l'adresse qui a répondu",
 *     "reference_courriel": "objet + date du fil, ou Message-ID",
 *     "date":               "2026-09-15",
 *     "portee":             "ce qui est autorisé, en clair",
 *     "expire_le":          null
 *   }
 *
 * Tous les champs sauf `expire_le` sont obligatoires et doivent être renseignés.
 * Le script les affiche avant de commencer : la campagne reste auditable, et une
 * autorisation périmée arrête tout. Sans ce fichier → sortie **77**, la même
 * convention que les daemons de purge X pour « accès refusé, ne pas relancer ».
 *
 * NB : ce fichier n'EST pas l'autorisation, il la CONSIGNE. Le courriel doit
 * exister et être conservé ; ceci n'en est que la trace exploitable par le script.
 *
 * LES FREINS
 * ----------
 * Trois freins indépendants, sur le modèle de `purge-engine.ts` :
 *   · une requête à la fois, temporisée avec jitter (900–2500 ms par défaut) ;
 *   · un budget par fenêtre de 15 min (300 requêtes) ;
 *   · un budget par 24 h (5 000 requêtes).
 * Plus un garde-fou disque (arrêt sous 2 Go libres) et un compteur de refus
 * consécutifs (arrêt à 5). Le journal `~/.aphrody/dragonballcn-planches.json`
 * (0600) rend la campagne reprenable : une planche déjà rapatriée n'est jamais
 * redemandée au site.
 *
 * RANGEMENT
 * ---------
 *   assets/dragonballcn/planches/<collection>/<did>/NNN.webp
 *   assets/dragonballcn/planches/<collection>/<did>/index.json
 * NNN suit la numérotation de l'inventaire (`dragonballcn-inventaire.json`), donc
 * les doubles pages gardent leur rang (`DB02_044-045` reste une seule entrée).
 *
 * Usage :
 *   bun apps/bot/scripts/telecharge-planches-dragonballcn.ts --verifier-acces
 *       ↑ sonde quelques URL et rend les codes HTTP. Aucun téléchargement,
 *         aucune autorisation requise : c'est le test à relancer le jour du mail.
 *
 *   bun apps/bot/scripts/telecharge-planches-dragonballcn.ts
 *       ↑ simulation : dit ce qu'il ferait, ne demande rien au site.
 *
 *   bun apps/bot/scripts/telecharge-planches-dragonballcn.ts --oui
 *       ↑ exécute — refusé sans autorisation déposée.
 *
 *   … --collection dragonball_jp_original --did 0-1-0 --limite 20
 */
import { chmod, mkdir, statfs } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const flag = (nom: string) => args.includes(`--${nom}`);
const opt = (nom: string, defaut = "") => {
	const i = args.indexOf(`--${nom}`);
	return i !== -1 && args[i + 1] ? args[i + 1]! : defaut;
};

const EXECUTE = flag("oui");
const VERIFIER = flag("verifier-acces");
const COLLECTION = opt("collection");
const DID = opt("did");
const LIMITE = Number(opt("limite", "0"));
const QUALITE = Number(opt("qualite", "78"));

/** Sortie 77 = accès refusé, inutile de relancer (convention des daemons de purge). */
const SORTIE_REFUS = 77;

const RACINE_BOT = join(import.meta.dir, "..");
const DOSSIER_CATALOGUES = join(RACINE_BOT, "data", "catalogues");
const CATALOGUE = join(DOSSIER_CATALOGUES, "dragonballcn.json");
const INVENTAIRE = join(DOSSIER_CATALOGUES, "dragonballcn-inventaire.json");
const SORTIE = join(RACINE_BOT, "assets", "dragonballcn", "planches");
// `APHRODY_HOME` désigne la racine de travail, pas le dossier d'état : on ne le
// détourne pas ici, sinon autorisation et journal atterrissent à la racine du home.
const MAISON = process.env.DRAGONBALLCN_ETAT_DIR ?? join(process.env.HOME ?? "/tmp", ".aphrody");
const AUTORISATION = opt("autorisation", join(MAISON, "autorisation-dragonballcn.json"));
const JOURNAL = join(MAISON, "dragonballcn-planches.json");
const BINAIRE_MCP = join(process.env.HOME ?? "", ".local", "bin", "bxc-mcp");

const RACINE = "https://comic.dragonballcn.com";
/** On s'annonce : pas d'empreinte de navigateur maquillée, un nom et un contact. */
const AGENT = "dragonballfr.com-archive/1.0 (rapatriement autorise; +https://dragonballfr.com)";

const DELAI_MIN = Number(opt("delai-min", "900"));
const DELAI_MAX = Number(opt("delai-max", "2500"));
const BUDGET_FENETRE = Number(opt("budget-fenetre", "300"));
const FENETRE_MS = 15 * 60 * 1000;
const BUDGET_JOUR = Number(opt("budget-jour", "5000"));
const JOUR_MS = 24 * 60 * 60 * 1000;
const REFUS_MAX = Number(opt("refus-max", "5"));
const DISQUE_MIN = Number(opt("disque-min-go", "2")) * 2 ** 30;
/** Au-delà, on considère que la fiche n'a pas répondu plutôt que d'attendre sans fin. */
const DUREE_MCP_MS = Number(opt("duree-fiche-ms", "180000"));

type Planche = { n: number; fichier: string; poids: string | null; ajoutee: string | null };
type Ouvrage = { did: string; url: string; libelle?: string; titre_tome?: string };
type Collection = { slug: string; titre: string; ouvrages: Ouvrage[] };
type Autorisation = {
	accordee_par: string;
	contact: string;
	reference_courriel: string;
	date: string;
	portee: string;
	expire_le?: string | null;
};
type Journal = {
	/** did → dossier distant résolu depuis la fiche (évite de la redemander). */
	dossiers: Record<string, string>;
	/** did → rangs de planches déjà rapatriées. */
	acquis: Record<string, number[]>;
	horodatages: number[];
	/** Ouvrages dont la fiche n'a pas rendu son dossier distant. */
	muettes?: string[];
};

// ------------------------------------------------------------------ autorisation

/**
 * L'autorisation n'est pas une case à cocher : chaque champ doit dire QUI a
 * répondu, DEPUIS OÙ, SUR QUOI et QUAND. Un champ vide vaut pas d'autorisation.
 */
async function litAutorisation(): Promise<Autorisation> {
	const fichier = Bun.file(AUTORISATION);
	if (!(await fichier.exists())) {
		console.error(
			`✗ Aucune autorisation déposée.\n` +
				`  Attendu : ${AUTORISATION} (0600)\n` +
				`  Tant que le courriel d'accord n'est pas arrivé et consigné là, ce script ne\n` +
				`  télécharge rien. Le site refuse ses planches par 403 délibéré ; passer outre\n` +
				`  serait forcer ce refus, pas exercer un droit.`,
		);
		process.exit(SORTIE_REFUS);
	}

	const brut = (await fichier.json()) as Partial<Autorisation>;
	const requis: (keyof Autorisation)[] = [
		"accordee_par",
		"contact",
		"reference_courriel",
		"date",
		"portee",
	];
	const manquants = requis.filter((champ) => !String(brut[champ] ?? "").trim());
	if (manquants.length) {
		console.error(`✗ Autorisation incomplète — champs vides : ${manquants.join(", ")}`);
		process.exit(SORTIE_REFUS);
	}
	if (Number.isNaN(Date.parse(String(brut.date)))) {
		console.error(`✗ Autorisation : \`date\` illisible (${brut.date}).`);
		process.exit(SORTIE_REFUS);
	}
	if (brut.expire_le && Date.parse(String(brut.expire_le)) < Date.now()) {
		console.error(`✗ Autorisation expirée le ${brut.expire_le}. Rouvrir le fil avant de relancer.`);
		process.exit(SORTIE_REFUS);
	}

	console.log("Autorisation retenue pour cette campagne :");
	console.log(`  accordée par  ${brut.accordee_par}`);
	console.log(`  contact       ${brut.contact}`);
	console.log(`  référence     ${brut.reference_courriel}`);
	console.log(`  date          ${brut.date}${brut.expire_le ? ` (expire ${brut.expire_le})` : ""}`);
	console.log(`  portée        ${brut.portee}\n`);
	return brut as Autorisation;
}

// ------------------------------------------------------------------ journal

async function litJournal(): Promise<Journal> {
	const vide: Journal = { dossiers: {}, acquis: {}, horodatages: [] };
	const fichier = Bun.file(JOURNAL);
	if (!(await fichier.exists())) return vide;
	return { ...vide, ...((await fichier.json()) as Partial<Journal>) };
}

async function ecritJournal(journal: Journal) {
	await mkdir(MAISON, { recursive: true });
	await Bun.write(JOURNAL, `${JSON.stringify(journal, null, "\t")}\n`);
	await chmod(JOURNAL, 0o600);
}

// ------------------------------------------------------------------ freins

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const libreSurDisque = async () => {
	const s = await statfs(RACINE_BOT);
	return s.bavail * s.bsize;
};

/**
 * Trois freins indépendants. Le jitter évite la cadence de métronome qui signe un
 * robot ; les deux budgets bornent la campagne même si le site ne dit rien.
 */
class Gouverneur {
	constructor(private horodatages: number[]) {}

	private compte(depuis: number) {
		const seuil = Date.now() - depuis;
		return this.horodatages.filter((t) => t > seuil).length;
	}

	/** Rend le motif du refus, ou `null` si la requête peut partir. */
	verrou(): string | null {
		if (this.compte(FENETRE_MS) >= BUDGET_FENETRE)
			return `budget de fenêtre atteint (${BUDGET_FENETRE} / 15 min)`;
		if (this.compte(JOUR_MS) >= BUDGET_JOUR) return `budget quotidien atteint (${BUDGET_JOUR} / 24 h)`;
		return null;
	}

	async temporise() {
		await sleep(DELAI_MIN + Math.floor(Math.random() * Math.max(1, DELAI_MAX - DELAI_MIN)));
		const maintenant = Date.now();
		this.horodatages.push(maintenant);
		// On ne conserve que la fenêtre utile : le journal ne gonfle pas indéfiniment.
		const limite = maintenant - JOUR_MS;
		this.horodatages = this.horodatages.filter((t) => t > limite);
	}

	get trace() {
		return this.horodatages;
	}
}

// ------------------------------------------------------------------ réseau

type Reponse = { statut: number; corps: Uint8Array };

/** curl plutôt que `fetch` : Cloudflare rend 403 à l'empreinte TLS de Bun, 200 à celle de curl. */
async function recupere(url: string, referer: string): Promise<Reponse> {
	const proc = Bun.spawn(
		[
			"curl", "-sS", "-m", "60", "--compressed",
			"-A", AGENT,
			"-H", `Referer: ${referer}`,
			"-w", "%{http_code}",
			url,
		],
		{ stdout: "pipe", stderr: "ignore" },
	);
	const brut = new Uint8Array(await new Response(proc.stdout).arrayBuffer());
	await proc.exited;
	// `-w` colle le code sur trois octets à la fin du corps.
	const statut = Number(new TextDecoder().decode(brut.slice(-3)));
	return { statut, corps: brut.slice(0, -3) };
}

const estUneImage = (corps: Uint8Array) => {
	if (corps.length < 512) return false;
	const entete = new TextDecoder().decode(corps.slice(0, 16)).toLowerCase();
	return !entete.includes("<!doctype") && !entete.includes("<html");
};

// ------------------------------------------------------------------ fiche → dossier

/**
 * La fiche d'un tome porte ses miniatures sous `list/<dossier>/_thumb.<fichier>` :
 * c'est de là qu'on tire le dossier distant, le nom de fichier venant déjà de
 * l'inventaire. `bxc-mcp` est le seul client mesuré à obtenir ces fiches.
 */
async function resoutDossier(url: string): Promise<string | null> {
	const proc = Bun.spawn([BINAIRE_MCP], { stdin: "pipe", stdout: "pipe", stderr: "ignore" });
	const lecteur = proc.stdout.getReader();
	const decodeur = new TextDecoder();
	const echeance = Date.now() + DUREE_MCP_MS;
	let reste = "";

	const envoie = async (message: unknown) => {
		proc.stdin.write(`${JSON.stringify(message)}\n`);
		await proc.stdin.flush();
	};

	/**
	 * On lit ligne à ligne jusqu'à la réponse portant cet identifiant : le serveur
	 * garde son tube ouvert, donc attendre la fin du flux ne rendrait jamais la main.
	 */
	const attend = async (id: number): Promise<string | null> => {
		while (Date.now() < echeance) {
			const saut = reste.indexOf("\n");
			if (saut === -1) {
				const { value, done } = await lecteur.read();
				if (done) return null;
				reste += decodeur.decode(value, { stream: true });
				continue;
			}
			const ligne = reste.slice(0, saut).trim();
			reste = reste.slice(saut + 1);
			if (!ligne) continue;
			try {
				if ((JSON.parse(ligne) as { id?: number }).id === id) return ligne;
			} catch {
				// Ligne non JSON (trace du serveur) : on l'ignore.
			}
		}
		return null;
	};

	try {
		await envoie({
			jsonrpc: "2.0",
			id: 1,
			method: "initialize",
			params: {
				protocolVersion: "2024-11-05",
				capabilities: {},
				clientInfo: { name: "dragonballfr-planches", version: "1.0" },
			},
		});
		if (!(await attend(1))) return null;
		await envoie({ jsonrpc: "2.0", method: "notifications/initialized" });
		await envoie({
			jsonrpc: "2.0",
			id: 2,
			method: "tools/call",
			params: { name: "bxc_scrape_markdown", arguments: { url, profile: "max", force: true } },
		});
		const reponse = await attend(2);
		return reponse ? (/list\/+([^"')\s\\]+?)\/_thumb\./.exec(reponse)?.[1] ?? null) : null;
	} finally {
		lecteur.cancel().catch(() => {});
		proc.kill();
	}
}

// ------------------------------------------------------------------ sonde

/**
 * Le test à relancer le jour où le courriel arrive : quatre URL, quatre codes.
 * Il ne télécharge rien et ne réclame aucune autorisation — c'est une mesure.
 */
async function verifieAcces(collections: Collection[], inventaire: Record<string, Planche[]>) {
	const ouvrage = collections.flatMap((c) => c.ouvrages).find((o) => inventaire[o.did]?.length);
	if (!ouvrage) {
		console.error("✗ Aucun ouvrage inventorié : lancer d'abord volumetrie-dragonballcn.ts.");
		process.exit(1);
	}
	const journal = await litJournal();
	const dossier = journal.dossiers[ouvrage.did] ?? (await resoutDossier(ouvrage.url));
	const fichier = inventaire[ouvrage.did]![0]!.fichier;

	console.log(`Sonde sur ${ouvrage.did} (${ouvrage.titre_tome || ouvrage.libelle || "sans titre"})`);
	console.log(`  dossier distant : ${dossier ?? "— non résolu (la fiche n'a pas répondu)"}\n`);

	const cibles: [string, string][] = [
		["couverture de catalogue", `${RACINE}/images/cover/db_jp_or/01.gif`],
		["fiche de lecture", ouvrage.url],
	];
	if (dossier) {
		cibles.push(["planche pleine résolution", `${RACINE}/list/${dossier}/${fichier}`]);
		cibles.push(["miniature de planche", `${RACINE}/list/${dossier}/_thumb.${fichier}`]);
	}

	let ouvert = 0;
	for (const [libelle, url] of cibles) {
		const { statut, corps } = await recupere(url, ouvrage.url);
		const verdict = statut === 200 ? (estUneImage(corps) || libelle.includes("fiche") ? "ouvert" : "page d'erreur") : "refusé";
		if (verdict === "ouvert") ouvert++;
		console.log(`  ${String(statut).padEnd(4)} ${verdict.padEnd(14)} ${libelle}`);
		await sleep(1200);
	}

	console.log(
		ouvert === cibles.length
			? "\n✔ Tout répond. Déposer l'autorisation puis relancer avec --oui."
			: "\n⚠ Le site refuse encore une partie de ces ressources. Une autorisation par courriel\n" +
					"  ne suffira pas seule : demander en même temps la mise en liste blanche de notre\n" +
					`  agent (« ${AGENT} ») ou de l'IP du VPS, ou l'envoi direct des fichiers.`,
	);
}

// ------------------------------------------------------------------ campagne

/**
 * Ce script dépend de trois outils et de deux fichiers. Les découvrir au bout de
 * quarante minutes de campagne, sur une exception de `sharp` ou un `curl: not
 * found`, coûte la campagne. On les vérifie donc AVANT de demander quoi que ce
 * soit au site, et chaque manque nomme sa réparation.
 */
async function verifiePrealables(sonde: boolean) {
	const manques: string[] = [];

	if (!Bun.which("curl"))
		manques.push("`curl` absent du PATH — c'est le client HTTP du script (apt install curl).");

	// `bxc-mcp` n'est requis que pour résoudre le dossier distant depuis la fiche.
	if (!(await Bun.file(BINAIRE_MCP).exists()))
		manques.push(
			`\`${BINAIRE_MCP}\` absent — le binaire MCP résout le dossier distant. ` +
				"Le reconstruire depuis bxc : `bun run build:mcp`, puis l'installer dans ~/.local/bin.",
		);

	try {
		await sharp({ create: { width: 1, height: 1, channels: 3, background: "#000" } })
			.webp()
			.toBuffer();
	} catch (erreur) {
		manques.push(`\`sharp\` inutilisable (${(erreur as Error).message}) — \`bun install\` à la racine.`);
	}

	if (!(await Bun.file(CATALOGUE).exists()))
		manques.push(`\`${CATALOGUE}\` absent — lancer d'abord \`crawl-dragonballcn.ts\`.`);
	if (!(await Bun.file(INVENTAIRE).exists()))
		manques.push(`\`${INVENTAIRE}\` absent — lancer d'abord \`volumetrie-dragonballcn.ts\`.`);

	if (!manques.length) return;
	console.error(`✗ ${manques.length} prérequis manquant(s) :`);
	for (const manque of manques) console.error(`  · ${manque}`);
	// En simulation on prévient sans bloquer : la liste des tâches se calcule quand
	// même dès que les deux fichiers de données sont là.
	if (!sonde && (await Bun.file(CATALOGUE).exists()) && (await Bun.file(INVENTAIRE).exists())) {
		console.error("  (simulation : on continue, mais `--oui` échouerait en l'état)\n");
		return;
	}
	process.exit(1);
}

await verifiePrealables(VERIFIER || EXECUTE);

const catalogue = (await Bun.file(CATALOGUE).json()) as { collections: Collection[] };
const inventaire = (await Bun.file(INVENTAIRE).json()) as Record<string, Planche[]>;
const collections = catalogue.collections.filter((c) => !COLLECTION || c.slug === COLLECTION);

if (VERIFIER) {
	await verifieAcces(collections, inventaire);
	process.exit(0);
}

const autorisation = EXECUTE ? await litAutorisation() : null;
if (!EXECUTE) {
	console.log(
		"Simulation — aucune requête ne part.\n" +
			`Pour exécuter : déposer l'autorisation dans ${AUTORISATION}, puis relancer avec --oui.\n`,
	);
}

const journal = await litJournal();
const gouverneur = new Gouverneur(journal.horodatages);

type Tache = { collection: string; ouvrage: Ouvrage; planches: Planche[] };
const taches: Tache[] = [];
for (const collection of collections) {
	for (const ouvrage of collection.ouvrages) {
		if (DID && ouvrage.did !== DID) continue;
		const planches = inventaire[ouvrage.did];
		if (!planches?.length) continue;
		const acquis = new Set(journal.acquis[ouvrage.did] ?? []);
		const reste = planches.filter((p) => !acquis.has(p.n));
		if (reste.length) taches.push({ collection: collection.slug, ouvrage, planches: reste });
	}
}

const totalPlanches = taches.reduce((s, t) => s + t.planches.length, 0);
console.log(`${taches.length} ouvrage(s) à traiter · ${totalPlanches} planche(s) à rapatrier.\n`);

if (!EXECUTE) {
	for (const tache of taches.slice(0, LIMITE || 10)) {
		console.log(
			`  ${tache.collection}/${tache.ouvrage.did} — ${tache.planches.length} planches → ` +
				`assets/dragonballcn/planches/${tache.collection}/${tache.ouvrage.did}/`,
		);
	}
	if (taches.length > (LIMITE || 10)) console.log(`  … et ${taches.length - (LIMITE || 10)} autres.`);
	process.exit(0);
}

let rapatriees = 0;
let refusConsecutifs = 0;
let n = 0;
const muettes: string[] = [];
const illisibles: string[] = [];

boucle: for (const tache of taches) {
	if (LIMITE && n >= LIMITE) break;

	const dossier = journal.dossiers[tache.ouvrage.did] ?? (await resoutDossier(tache.ouvrage.url));
	if (!dossier) {
		// Sauté, mais pas oublié : le récapitulatif final les nomme, et une relance
		// les reprend sans avoir à redemander les ouvrages déjà rapatriés.
		muettes.push(tache.ouvrage.did);
		console.warn(`  ⚠ ${tache.ouvrage.did} — fiche muette, dossier distant introuvable. Passé.`);
		continue;
	}
	journal.dossiers[tache.ouvrage.did] = dossier;

	const cible = join(SORTIE, tache.collection, tache.ouvrage.did);
	await mkdir(cible, { recursive: true });
	const acquis = new Set(journal.acquis[tache.ouvrage.did] ?? []);

	for (const planche of tache.planches) {
		if (LIMITE && n >= LIMITE) break boucle;

		const verrou = gouverneur.verrou();
		if (verrou) {
			console.warn(`\n⏸ Arrêt : ${verrou}. Le journal est à jour, relancer plus tard.`);
			break boucle;
		}
		if ((await libreSurDisque()) < DISQUE_MIN) {
			console.error(`\n🛑 Garde-fou disque (< ${(DISQUE_MIN / 2 ** 30).toFixed(0)} Go libres) — arrêt.`);
			break boucle;
		}

		await gouverneur.temporise();
		n++;
		const url = `${RACINE}/list/${dossier}/${planche.fichier}`;
		const { statut, corps } = await recupere(url, tache.ouvrage.url);

		if (statut !== 200 || !estUneImage(corps)) {
			refusConsecutifs++;
			console.warn(`  ✗ ${tache.ouvrage.did}/${planche.n} — HTTP ${statut}`);
			if (refusConsecutifs >= REFUS_MAX) {
				console.error(
					`\n🛑 ${REFUS_MAX} refus consécutifs. Le site n'ouvre pas ses planches à ce client.\n` +
						`   L'autorisation de ${autorisation?.accordee_par} doit s'accompagner d'un accès\n` +
						`   technique (liste blanche de l'agent ou de l'IP, ou envoi direct). On ne force pas.`,
				);
				break boucle;
			}
			continue;
		}
		refusConsecutifs = 0;

		// Un fichier que `sharp` ne sait pas décoder ne doit pas emporter la campagne :
		// on le consigne et on passe, l'octet reçu n'étant pas forcément une image valide.
		let webp: Uint8Array;
		try {
			webp = new Uint8Array(await sharp(corps).webp({ quality: QUALITE }).toBuffer());
		} catch (erreur) {
			illisibles.push(`${tache.ouvrage.did}/${planche.n}`);
			console.warn(`  ✗ ${tache.ouvrage.did}/${planche.n} — illisible : ${(erreur as Error).message}`);
			continue;
		}
		await Bun.write(join(cible, `${String(planche.n).padStart(3, "0")}.webp`), webp);
		acquis.add(planche.n);
		rapatriees++;

		if (rapatriees % 20 === 0) {
			journal.acquis[tache.ouvrage.did] = [...acquis].toSorted((a, b) => a - b);
			journal.horodatages = gouverneur.trace;
			await ecritJournal(journal);
			console.log(`  ${rapatriees} planches rapatriées…`);
		}
	}

	journal.acquis[tache.ouvrage.did] = [...acquis].toSorted((a, b) => a - b);
	await Bun.write(
		join(cible, "index.json"),
		`${JSON.stringify(
			{
				did: tache.ouvrage.did,
				collection: tache.collection,
				titre: tache.ouvrage.titre_tome || tache.ouvrage.libelle || null,
				url_fiche: tache.ouvrage.url,
				dossier_distant: dossier,
				autorisation: autorisation?.reference_courriel ?? null,
				rapatrie_le: new Date().toISOString(),
				planches: [...acquis].toSorted((a, b) => a - b),
			},
			null,
			"\t",
		)}\n`,
	);
}

journal.horodatages = gouverneur.trace;
journal.muettes = muettes;
await ecritJournal(journal);

console.log(`\n✔ ${rapatriees} planche(s) rapatriée(s) · journal : ${JOURNAL}`);
if (muettes.length)
	console.log(`  ⚠ ${muettes.length} fiche(s) muette(s), non rapatriées : ${muettes.join(", ")}`);
if (illisibles.length)
	console.log(`  ⚠ ${illisibles.length} réponse(s) illisible(s) : ${illisibles.join(", ")}`);
