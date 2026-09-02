#!/usr/bin/env bun
/**
 * forum-anime.ts — Publie l'animé (sagas, saisons, films) dans un forum Discord,
 * avec les lecteurs voir-anime, les médias du site et la chronologie.
 *
 * La matière vient de la base du site (PostgreSQL local, schéma `bot`) : sagas,
 * épisodes, films, et les `players` scrapés par bxc. Rien n'est rédigé ici — le
 * forum est une VUE de la base, régénérable, jamais une seconde source.
 *
 * Deux étapes séparées, parce qu'écrire dans un serveur communautaire ne se
 * répare pas d'un `git revert` :
 *
 *   1. `plan`     — construit tout le contenu (fils, messages, embeds) et l'écrit
 *                   dans `data/forum-anime/plan.json`. Aucune requête d'écriture
 *                   vers Discord : on lit le résultat AVANT de le publier.
 *   2. `applique` — crée le forum s'il n'existe pas, puis crée les fils manquants.
 *                   Idempotent : un fil déjà présent (même nom) est complété, pas
 *                   dupliqué ; relancer après un 429 ou une coupure reprend où
 *                   c'en était.
 *
 *   bun apps/bot/scripts/forum-anime.ts plan
 *   bun apps/bot/scripts/forum-anime.ts applique [--limite N] [--seulement <motif>] [--categorie <id>]
 *   bun apps/bot/scripts/forum-anime.ts etat
 *
 * Jeton : `DISCORD_TOKEN_GRAND_PRETRE` (administrateur de la guilde).
 * Base   : `DATABASE_URL` de `~/.shenron-neon.env` (la DERNIÈRE ligne — cf. CLAUDE.md).
 */

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { SQL } from "bun";
import { clientDiscord, enParallele, jetonDiscord } from "./lib/discord-rest";

// ── Constantes de publication ───────────────────────────────────────────────

const GUILDE = "934894610545770506";
const CATEGORIE_DEFAUT = "1034596410668101642"; // ⌈🐉⌋ ⌜DRAGON BALL⌟
const NOM_FORUM = "🎬・animes-et-films";
const SUJET_FORUM =
	"***Tout l'animé Dragon Ball : sagas, saisons, films et OAV, épisode par épisode, avec les lecteurs VF et VOSTFR.***\n" +
	"🔎 • ``Un fil par saga, par saison et par film — utilisez la recherche pour trouver un épisode.``\n" +
	"🗃️ • ``Les tags servent à filtrer par série.``\n" +
	"🕒 • ``Le fil « Chronologie » donne l'ordre complet, par date de diffusion.``";
const SITE = "https://dragonballfr.com";
const ASSETS = "https://bot.dragonballfr.com";
const RACINE = new URL("../data/forum-anime", import.meta.url).pathname;
const CHEMIN_PLAN = join(RACINE, "plan.json");

/** Priorité des hébergeurs : mesurée, pas supposée (cf. mémoire link-rot 2026-08). */
const RANG_PROVIDER: Readonly<Record<string, number>> = { vidmoly: 0, yourupload: 1, mailru: 2 };

// ── Formes lues en base ─────────────────────────────────────────────────────

interface Lecteur {
	readonly lang?: "vf" | "vostfr" | null;
	readonly name?: string;
	readonly provider?: string;
	readonly embedUrl?: string;
}

interface LigneSaga {
	readonly id: string;
	readonly slug: string | null;
	readonly name: string;
	readonly name_ja: string | null;
	readonly series: string | null;
	readonly episode_series: string | null;
	readonly episode_start: string | null;
	readonly episode_end: string | null;
	readonly manga_volume_start: string | null;
	readonly manga_volume_end: string | null;
	readonly description: string | null;
	readonly image: string | null;
	readonly order_idx: string | null;
}

interface LigneEpisode {
	readonly id: string;
	readonly series: string;
	readonly number_in_series: string;
	readonly title: string | null;
	readonly title_ja: string | null;
	readonly air_date: string | null;
	readonly synopsis: string | null;
	readonly image: string | null;
	readonly players: readonly Lecteur[] | null;
}

interface LigneFilm {
	readonly id: string;
	readonly slug: string | null;
	readonly title: string;
	readonly title_ja: string | null;
	readonly series: string | null;
	readonly release_date: string | null;
	readonly duration_min: string | null;
	readonly synopsis: string | null;
	readonly poster: string | null;
	readonly trailer_url: string | null;
	readonly players: readonly Lecteur[] | null;
}

// ── Le plan (contrat entre les deux étapes) ─────────────────────────────────

interface Embed {
	readonly title?: string;
	readonly description?: string;
	readonly url?: string;
	readonly color?: number;
	readonly image?: { readonly url: string };
	readonly thumbnail?: { readonly url: string };
	readonly footer?: { readonly text: string };
}

interface MessagePlan {
	readonly content?: string;
	readonly embeds?: readonly Embed[];
}

interface FilPlan {
	readonly cle: string;
	readonly nom: string;
	readonly tags: readonly string[];
	readonly premier: MessagePlan;
	readonly suite: readonly MessagePlan[];
}

interface Plan {
	readonly genereLe: string;
	readonly forum: { readonly nom: string; readonly sujet: string; readonly tags: readonly string[] };
	readonly fils: readonly FilPlan[];
}

// ── Outils de présentation ──────────────────────────────────────────────────

const ERES: Readonly<Record<string, { readonly tag: string; readonly couleur: number }>> = {
	DB: { tag: "Dragon Ball", couleur: 0xf5a623 },
	DBZ: { tag: "Dragon Ball Z", couleur: 0xff5a1f },
	DBGT: { tag: "Dragon Ball GT", couleur: 0x38b000 },
	DBS: { tag: "Dragon Ball Super", couleur: 0x3aa0ff },
	DB_DAIMA: { tag: "Daima", couleur: 0xb47cff },
	DBZ_KAI: { tag: "Kai", couleur: 0xffb703 },
	DBZ_KAI_FINAL: { tag: "Kai", couleur: 0xffb703 },
};

function ere(series: string | null | undefined): { tag: string; couleur: number } {
	return ERES[series ?? ""] ?? { tag: "Films", couleur: 0x9ca3af };
}

const TAGS_FORUM = [
	"Dragon Ball",
	"Dragon Ball Z",
	"Dragon Ball GT",
	"Dragon Ball Super",
	"Daima",
	"Kai",
	"Films",
	"OAV & TV specials",
	"Chronologie",
] as const;

function asset(chemin: string | null | undefined): string | undefined {
	if (!chemin) return undefined;
	if (chemin.startsWith("http")) return chemin;
	return `${ASSETS}/${chemin.replace(/^\.?\/*/, "")}`;
}

function date(epoch: string | null | undefined): string | null {
	const n = Number(epoch);
	return Number.isFinite(n) && n > 0 ? `<t:${Math.trunc(n)}:D>` : null;
}

function coupe(texte: string | null | undefined, taille: number): string {
	const propre = (texte ?? "").replace(/\s+/g, " ").trim();
	if (propre.length <= taille) return propre;
	return `${propre.slice(0, taille - 1).trimEnd()}…`;
}

/**
 * Un lien par langue, en préférant l'hébergeur qui survit.
 *
 * Un épisode porte jusqu'à quatre lecteurs (deux langues × deux hébergeurs) :
 * les afficher tous noie la ligne, et le second hébergeur n'apporte rien tant
 * que le premier répond.
 */
function liensLecteurs(players: readonly Lecteur[] | null | undefined): string[] {
	const parLangue = new Map<string, Lecteur>();
	for (const p of players ?? []) {
		if (!p.embedUrl) continue;
		const langue = p.lang === "vostfr" ? "VOSTFR" : p.lang === "vf" ? "VF" : "Autre";
		const actuel = parLangue.get(langue);
		const rang = RANG_PROVIDER[p.provider ?? ""] ?? 9;
		const rangActuel = actuel ? (RANG_PROVIDER[actuel.provider ?? ""] ?? 9) : 99;
		if (rang < rangActuel) parLangue.set(langue, p);
	}
	const ordre = ["VF", "VOSTFR", "Autre"];
	return ordre
		.filter((l) => parLangue.has(l))
		.map((l) => `[${l}](${parLangue.get(l)?.embedUrl})`);
}

/** Tous les lecteurs, groupés par langue — pour un film, où la place ne manque pas. */
function detailLecteurs(players: readonly Lecteur[] | null | undefined): string {
	const lignes: string[] = [];
	for (const langue of ["vf", "vostfr"] as const) {
		const liste = (players ?? [])
			.filter((p) => p.lang === langue && p.embedUrl)
			.toSorted((a, b) => (RANG_PROVIDER[a.provider ?? ""] ?? 9) - (RANG_PROVIDER[b.provider ?? ""] ?? 9));
		if (liste.length === 0) continue;
		const liens = liste.map((p) => `[${p.provider ?? "lecteur"}](${p.embedUrl})`).join(" · ");
		lignes.push(`${langue === "vf" ? "🇫🇷 **VF**" : "🇯🇵 **VOSTFR**"} — ${liens}`);
	}
	return lignes.join("\n");
}

/** Découpe une liste de lignes en messages qui tiennent dans les 2 000 signes. */
function enMessages(lignes: readonly string[], entete?: string): MessagePlan[] {
	const messages: MessagePlan[] = [];
	let tampon = entete ? [entete] : [];
	let taille = entete ? entete.length : 0;
	for (const ligne of lignes) {
		if (taille + ligne.length + 1 > 1900 && tampon.length > 0) {
			messages.push({ content: tampon.join("\n") });
			tampon = [];
			taille = 0;
		}
		tampon.push(ligne);
		taille += ligne.length + 1;
	}
	if (tampon.length > 0) messages.push({ content: tampon.join("\n") });
	return messages;
}

// ── Construction du plan ────────────────────────────────────────────────────

async function connexion(): Promise<SQL> {
	const direct = process.env.DATABASE_URL?.trim();
	if (direct) return new SQL(direct);
	const texte = await Bun.file(`${process.env.HOME}/.shenron-neon.env`)
		.text()
		.catch(() => "");
	// La DERNIÈRE ligne fait foi : l'ancienne URL Neon est conservée AU-DESSUS, en commentaire.
	const lignes = texte.split("\n").filter((l) => l.trim().startsWith("DATABASE_URL="));
	const valeur = lignes.at(-1)?.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
	if (!valeur) throw new Error("DATABASE_URL introuvable (env ou ~/.shenron-neon.env)");
	return new SQL(valeur);
}

/** Un embed compact par épisode : synopsis, date, lecteurs, fiche, vignette. */
function embedEpisode(ep: LigneEpisode, couleur: number): Embed {
	const liens = liensLecteurs(ep.players);
	const morceaux = [
		date(ep.air_date) ? `📅 ${date(ep.air_date)}` : null,
		liens.length > 0 ? `▶️ ${liens.join(" · ")}` : "▶️ *aucun lecteur disponible*",
		`🔎 [Fiche](${SITE}/wiki/episodes/${ep.id})`,
	].filter((x): x is string => x !== null);
	const synopsis = coupe(ep.synopsis, 260);
	return {
		title: coupe(`${ep.number_in_series}. ${ep.title ?? "Sans titre"}`, 250),
		url: `${SITE}/wiki/episodes/${ep.id}`,
		description: [synopsis, morceaux.join(" · ")].filter(Boolean).join("\n\n"),
		color: couleur,
		thumbnail: asset(ep.image) ? { url: asset(ep.image) as string } : undefined,
		footer: ep.title_ja ? { text: coupe(ep.title_ja, 120) } : undefined,
	};
}

/** Les embeds d'épisodes, par paquets de 10 (limite Discord par message). */
function messagesEpisodes(episodes: readonly LigneEpisode[], couleur: number): MessagePlan[] {
	const messages: MessagePlan[] = [];
	for (let i = 0; i < episodes.length; i += 10)
		messages.push({ embeds: episodes.slice(i, i + 10).map((ep) => embedEpisode(ep, couleur)) });
	return messages;
}

function filSaga(saga: LigneSaga, episodes: readonly LigneEpisode[]): FilPlan {
	const { tag, couleur } = ere(saga.episode_series ?? saga.series);
	const bornes =
		episodes.length > 0
			? `épisodes ${episodes[0]?.number_in_series} à ${episodes.at(-1)?.number_in_series}`
			: "sans épisode";
	const champs = [
		`**Série** — ${tag}`,
		`**Épisodes** — ${episodes.length} (${bornes})`,
		saga.manga_volume_start ? `**Manga** — tomes ${saga.manga_volume_start} à ${saga.manga_volume_end}` : null,
		episodes[0]?.air_date ? `**Diffusion** — ${date(episodes[0].air_date)} → ${date(episodes.at(-1)?.air_date)}` : null,
		saga.name_ja ? `**Titre japonais** — ${saga.name_ja}` : null,
		saga.slug ? `🔎 [Fiche de la saga](${SITE}/wiki/sagas/${saga.slug})` : null,
	].filter((x): x is string => x !== null);

	const premier: MessagePlan = {
		embeds: [
			{
				title: coupe(saga.name, 250),
				url: saga.slug ? `${SITE}/wiki/sagas/${saga.slug}` : undefined,
				description: [coupe(saga.description, 1200), champs.join("\n")].filter(Boolean).join("\n\n"),
				color: couleur,
				image: asset(saga.image) ? { url: asset(saga.image) as string } : undefined,
				footer: { text: "Lecteurs VF/VOSTFR dans les messages suivants" },
			},
		],
	};

	return {
		cle: `saga:${saga.id}`,
		nom: coupe(`${tag} — ${saga.name}${episodes.length > 0 ? ` (ép. ${episodes[0]?.number_in_series}-${episodes.at(-1)?.number_in_series})` : ""}`, 95),
		tags: [tag, "Saga"].filter((t) => (TAGS_FORUM as readonly string[]).includes(t)),
		premier,
		suite: messagesEpisodes(episodes, couleur),
	};
}

function filSerie(serie: string, titre: string, episodes: readonly LigneEpisode[]): FilPlan {
	const { tag, couleur } = ere(serie);
	const premier: MessagePlan = {
		embeds: [
			{
				title: titre,
				description: [
					`**Série** — ${tag}`,
					`**Épisodes** — ${episodes.length} (1 à ${episodes.at(-1)?.number_in_series})`,
					episodes[0]?.air_date
						? `**Diffusion** — ${date(episodes[0].air_date)} → ${date(episodes.at(-1)?.air_date)}`
						: null,
					`🔎 [Tous les épisodes](${SITE}/wiki/episodes/serie/${serie.toLowerCase()})`,
				]
					.filter(Boolean)
					.join("\n"),
				color: couleur,
				footer: { text: "Lecteurs VF/VOSTFR dans les messages suivants" },
			},
		],
	};
	return {
		cle: `serie:${serie}`,
		nom: coupe(titre, 95),
		tags: [tag],
		premier,
		suite: messagesEpisodes(episodes, couleur),
	};
}

function filFilm(film: LigneFilm): FilPlan {
	const estOav = (film.series ?? "").includes("OVA") || (film.series ?? "").includes("SPECIAL");
	const { couleur } = ere(film.series);
	const annee = Number(film.release_date);
	const anneeTexte = Number.isFinite(annee) && annee > 0 ? new Date(annee * 1000).getUTCFullYear() : null;
	const lecteurs = detailLecteurs(film.players);
	const champs = [
		film.release_date ? `**Sortie** — ${date(film.release_date)}` : null,
		film.duration_min ? `**Durée** — ${film.duration_min} min` : null,
		film.title_ja ? `**Titre japonais** — ${film.title_ja}` : null,
		film.trailer_url ? `🎞️ [Bande-annonce](${film.trailer_url})` : null,
		film.slug ? `🔎 [Fiche du film](${SITE}/wiki/films/${film.slug})` : null,
	].filter((x): x is string => x !== null);

	return {
		cle: `film:${film.id}`,
		nom: coupe(`${estOav ? "OAV" : "Film"}${anneeTexte ? ` ${anneeTexte}` : ""} — ${film.title}`, 95),
		tags: [estOav ? "OAV & TV specials" : "Films", ere(film.series).tag].filter(
			(t, i, l) => (TAGS_FORUM as readonly string[]).includes(t) && l.indexOf(t) === i,
		),
		premier: {
			embeds: [
				{
					title: coupe(film.title, 250),
					url: film.slug ? `${SITE}/wiki/films/${film.slug}` : undefined,
					description: [coupe(film.synopsis, 1500), champs.join("\n")].filter(Boolean).join("\n\n"),
					color: couleur,
					image: asset(film.poster) ? { url: asset(film.poster) as string } : undefined,
				},
			],
		},
		suite: lecteurs ? [{ content: `**▶️ Lecteurs**\n${lecteurs}` }] : [],
	};
}

function filChronologie(
	sagas: readonly LigneSaga[],
	parSaga: ReadonlyMap<string, readonly LigneEpisode[]>,
	films: readonly LigneFilm[],
	series: ReadonlyMap<string, readonly LigneEpisode[]>,
): FilPlan {
	interface Entree {
		readonly quand: number;
		readonly texte: string;
	}
	const entrees: Entree[] = [];

	for (const saga of sagas) {
		const episodes = parSaga.get(saga.id) ?? [];
		if (episodes.length === 0) continue;
		const debut = Number(episodes[0]?.air_date ?? 0);
		const { tag } = ere(saga.episode_series ?? saga.series);
		entrees.push({
			quand: debut,
			texte: `**${saga.name}** · ${tag} · ép. ${episodes[0]?.number_in_series}-${episodes.at(-1)?.number_in_series} · ${date(episodes[0]?.air_date) ?? "date inconnue"}`,
		});
	}
	for (const film of films) {
		const quand = Number(film.release_date ?? 0);
		entrees.push({
			quand,
			texte: `🎬 **${film.title}** · ${date(film.release_date) ?? "date inconnue"}${film.slug ? ` · [fiche](${SITE}/wiki/films/${film.slug})` : ""}`,
		});
	}
	for (const [serie, episodes] of series) {
		if (!serie.startsWith("DBZ_KAI")) continue;
		entrees.push({
			quand: Number(episodes[0]?.air_date ?? 0),
			texte: `**${serie === "DBZ_KAI" ? "Dragon Ball Z Kai" : "Dragon Ball Z Kai — Chapitres finaux"}** · ${episodes.length} épisodes · ${date(episodes[0]?.air_date) ?? "date inconnue"}`,
		});
	}

	const ordonnees = entrees.toSorted((a, b) => a.quand - b.quand);
	const lignes = ordonnees.map((e, i) => `\`${String(i + 1).padStart(3, " ")}.\` ${e.texte}`);
	const entete =
		"**Ordre de diffusion — arcs de l'animé, films et OAV mêlés.**\n" +
		`Chaque date est celle de la première diffusion japonaise. Frise complète et interactive : ${SITE}/wiki/chronologie\n`;

	const [premierMessage, ...reste] = enMessages(lignes, entete);
	return {
		cle: "chronologie",
		nom: "🕒 Chronologie complète — ordre de diffusion",
		tags: ["Chronologie"],
		premier: premierMessage ?? { content: entete },
		suite: reste,
	};
}

async function construirePlan(): Promise<Plan> {
	const sql = await connexion();
	const sagas = (await sql`
		select id, slug, name, name_ja, series, episode_series, episode_start, episode_end,
		       manga_volume_start, manga_volume_end, description, image, order_idx
		from bot.db_sagas
		where visible is not false
		order by order_idx nulls last, id
	`) as unknown as LigneSaga[];

	const episodes = (await sql`
		select id, series, number_in_series, title, title_ja, air_date,
		       coalesce(synopsis_fr, synopsis) as synopsis, image, players
		from bot.db_episodes
		where visible is not false
		order by series, number_in_series
	`) as unknown as LigneEpisode[];

	const films = (await sql`
		select id, slug, title, title_ja, series, release_date, duration_min,
		       coalesce(synopsis_fr, synopsis) as synopsis, poster, trailer_url, players
		from bot.db_movies
		where visible is not false
		order by release_date nulls last, id
	`) as unknown as LigneFilm[];
	await sql.end();

	const parSerie = new Map<string, LigneEpisode[]>();
	for (const ep of episodes) {
		const liste = parSerie.get(ep.series) ?? [];
		liste.push(ep);
		parSerie.set(ep.series, liste);
	}

	// Une saga ne « possède » ses épisodes que si ses bornes sont posées ; sans
	// bornes (Bardock, Broly, Moro…) elle relève du manga ou d'un film, pas d'un
	// fil d'épisodes — la lister à vide donnerait un fil creux.
	const parSaga = new Map<string, LigneEpisode[]>();
	const revendiques = new Set<string>();
	for (const saga of sagas) {
		const serie = saga.episode_series;
		const debut = Number(saga.episode_start);
		const fin = Number(saga.episode_end);
		if (!serie || !Number.isFinite(debut) || !Number.isFinite(fin)) continue;
		const liste = (parSerie.get(serie) ?? []).filter((ep) => {
			const n = Number(ep.number_in_series);
			return n >= debut && n <= fin;
		});
		parSaga.set(saga.id, liste);
		for (const ep of liste) revendiques.add(ep.id);
	}

	const fils: FilPlan[] = [];
	fils.push(filChronologie(sagas, parSaga, films, parSerie));
	for (const saga of sagas) {
		const liste = parSaga.get(saga.id);
		if (!liste || liste.length === 0) continue;
		fils.push(filSaga(saga, liste));
	}
	// Les deux Kai n'ont aucune saga en base : ils font une saison chacun.
	for (const [serie, titre] of [
		["DBZ_KAI", "Dragon Ball Z Kai — la saison intégrale"],
		["DBZ_KAI_FINAL", "Dragon Ball Z Kai — Chapitres finaux"],
	] as const) {
		const liste = parSerie.get(serie);
		if (liste && liste.length > 0) fils.push(filSerie(serie, titre, liste));
	}
	for (const film of films) fils.push(filFilm(film));

	const plan: Plan = {
		genereLe: new Date().toISOString(),
		forum: { nom: NOM_FORUM, sujet: SUJET_FORUM, tags: TAGS_FORUM },
		fils,
	};
	await mkdir(RACINE, { recursive: true });
	await Bun.write(CHEMIN_PLAN, `${JSON.stringify(plan, null, "\t")}\n`);
	return plan;
}

// ── Application vers Discord ────────────────────────────────────────────────

interface SalonForum {
	readonly id: string;
	readonly name: string;
	readonly available_tags?: readonly { readonly id: string; readonly name: string }[];
}

interface FilExistant {
	readonly id: string;
	readonly name: string;
	readonly parent_id?: string;
	readonly message_count?: number;
	readonly thread_metadata?: { readonly archive_timestamp?: string };
}

async function lirePlan(): Promise<Plan> {
	const fichier = Bun.file(CHEMIN_PLAN);
	if (!(await fichier.exists())) throw new Error(`Plan absent : ${CHEMIN_PLAN} (lancer « plan » d'abord)`);
	return (await fichier.json()) as Plan;
}

type Appel = ReturnType<typeof clientDiscord>;

/** Le forum, créé au besoin — repéré par son nom dans la catégorie visée. */
async function forum(api: Appel, categorie: string): Promise<SalonForum> {
	const salons = await api<readonly (SalonForum & { type: number; parent_id?: string })[]>(
		`/guilds/${GUILDE}/channels`,
	);
	const existant = salons.find((c) => c.type === 15 && c.parent_id === categorie && c.name === NOM_FORUM);
	if (existant) return api<SalonForum>(`/channels/${existant.id}`);
	return api<SalonForum>(`/guilds/${GUILDE}/channels`, {
		methode: "POST",
		corps: {
			name: NOM_FORUM,
			type: 15,
			parent_id: categorie,
			topic: SUJET_FORUM,
			default_auto_archive_duration: 10080,
			available_tags: TAGS_FORUM.map((name) => ({ name, moderated: false })),
		},
	});
}

/** Tous les fils du forum, actifs et archivés — la base de l'idempotence. */
async function filsExistants(api: Appel, forumId: string): Promise<Map<string, FilExistant>> {
	const parNom = new Map<string, FilExistant>();
	const actifs = await api<{ threads: FilExistant[] }>(`/guilds/${GUILDE}/threads/active`);
	for (const f of actifs.threads.filter((t) => t.parent_id === forumId)) parNom.set(f.name, f);
	let avant: string | undefined;
	for (;;) {
		const q = new URLSearchParams({ limit: "100" });
		if (avant) q.set("before", avant);
		const page = await api<{ threads: FilExistant[]; has_more: boolean }>(
			`/channels/${forumId}/threads/archived/public?${q}`,
		);
		for (const f of page.threads) parNom.set(f.name, f);
		const ts = page.threads.at(-1)?.thread_metadata?.archive_timestamp;
		if (!page.has_more || !ts) break;
		avant = ts;
	}
	return parNom;
}

async function appliquer(): Promise<void> {
	const plan = await lirePlan();
	const api = clientDiscord(await jetonDiscord("GRAND_PRETRE"));
	const categorie = option("categorie") ?? CATEGORIE_DEFAUT;
	const motif = option("seulement");
	const limite = Number(option("limite") ?? Number.POSITIVE_INFINITY);

	const salon = await forum(api, categorie);
	const idTag = new Map((salon.available_tags ?? []).map((t) => [t.name, t.id]));
	console.log(`[forum] ${salon.name} (${salon.id}) · ${idTag.size} tags`);

	const dejaLa = await filsExistants(api, salon.id);
	const aFaire = plan.fils
		.filter((f) => (motif ? f.nom.toLowerCase().includes(motif.toLowerCase()) : true))
		.filter((f) => !dejaLa.has(f.nom))
		.slice(0, Number.isFinite(limite) ? limite : undefined);
	console.log(`[forum] ${plan.fils.length} fils au plan · ${dejaLa.size} déjà publiés · ${aFaire.length} à créer`);

	let faits = 0;
	// Concurrence basse : Discord limite fortement la création de fils, et un
	// 429 sur un fil à demi rempli coûte plus cher qu'une minute de patience.
	await enParallele(aFaire, 2, async (fil) => {
		const cree = await api<{ id: string }>(`/channels/${salon.id}/threads`, {
			methode: "POST",
			corps: {
				name: fil.nom,
				applied_tags: fil.tags.map((t) => idTag.get(t)).filter((x): x is string => Boolean(x)),
				auto_archive_duration: 10080,
				message: fil.premier,
			},
		});
		// Les messages d'un fil sont ordonnés : ils partent en série, jamais en parallèle.
		for (const message of fil.suite) {
			await api(`/channels/${cree.id}/messages`, { methode: "POST", corps: message });
		}
		faits++;
		process.stdout.write(`\r[forum] fils publiés : ${faits}/${aFaire.length} — ${coupe(fil.nom, 40)}          `);
	});
	process.stdout.write("\n");
	console.log(`[forum] terminé : ${faits} fils publiés dans ${salon.name}`);
}

async function etat(): Promise<void> {
	const plan = await lirePlan();
	const messages = plan.fils.reduce((s, f) => s + 1 + f.suite.length, 0);
	const embeds = plan.fils.reduce(
		(s, f) => s + (f.premier.embeds?.length ?? 0) + f.suite.reduce((t, m) => t + (m.embeds?.length ?? 0), 0),
		0,
	);
	console.log(`Plan du ${plan.genereLe} → ${plan.fils.length} fils, ${messages} messages, ${embeds} embeds`);
	for (const fil of plan.fils.slice(0, 8)) console.log(`  · ${fil.nom} (${1 + fil.suite.length} messages)`);
	console.log(`  … et ${Math.max(0, plan.fils.length - 8)} autres`);

	const api = clientDiscord(await jetonDiscord("GRAND_PRETRE"));
	const salons = await api<readonly { id: string; name: string; type: number; parent_id?: string }[]>(
		`/guilds/${GUILDE}/channels`,
	);
	const salon = salons.find((c) => c.type === 15 && c.name === NOM_FORUM);
	if (!salon) {
		console.log("Forum non créé sur Discord.");
		return;
	}
	const dejaLa = await filsExistants(api, salon.id);
	const manquants = plan.fils.filter((f) => !dejaLa.has(f.nom));
	console.log(`Sur Discord : ${dejaLa.size} fils · manquants : ${manquants.length}`);
}

// ── Entrée ──────────────────────────────────────────────────────────────────

const args: readonly string[] = process.argv.slice(2);
function option(nom: string): string | undefined {
	const i = args.indexOf(`--${nom}`);
	return i === -1 ? undefined : args[i + 1];
}

switch (args[0] ?? "plan") {
	case "plan": {
		const plan = await construirePlan();
		const messages = plan.fils.reduce((s, f) => s + 1 + f.suite.length, 0);
		console.log(`[plan] ${plan.fils.length} fils · ${messages} messages → ${CHEMIN_PLAN}`);
		break;
	}
	case "applique":
		await appliquer();
		break;
	case "etat":
		await etat();
		break;
	default:
		console.error(`Commande inconnue « ${args[0]} » — attendu : plan | applique | etat`);
		process.exit(1);
}
