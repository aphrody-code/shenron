/**
 * Télémétrie web unifiée du SITE — un seul `track()` qui fan-out vers :
 *   1. Vercel Web Analytics (custom events `track()` de `@vercel/analytics`),
 *   2. Google Tag Manager (`window.dataLayer.push`),
 *   3. l'ingest first-party `/api/telemetry` (Postgres → reco / perso).
 *
 * Distincte du gameplay du bot (XP/messages, SQLite côté bot) : ceci mesure la
 * NAVIGATION WEB pour nourrir recommandations + personnalisation.
 *
 * Privacy-first / RGPD (cible France/UE) :
 *   - SSR-safe : tout est no-op hors navigateur (les imports server ne plantent
 *     pas) ; aucune dépendance `postgres`/`drizzle` → jamais dans un bundle… mais
 *     ce module EST client (`track` de @vercel/analytics est browser-side).
 *   - Respecte le Do-Not-Track navigateur (`navigator.doNotTrack`).
 *   - Respecte le consentement local (cf. `consent.ts`) : sans consentement, on
 *     n'envoie RIEN aux destinations non-essentielles (Vercel/GTM/first-party).
 *   - Le first-party endpoint anonymise côté serveur (hash IP+UA salé, jamais
 *     d'IP brute ; cf. `/api/telemetry`).
 *
 * Ce module est volontairement SANS dépendance React → utilisable depuis
 * n'importe quel Client Component ou handler d'event.
 */
import { track as vercelTrack } from "@vercel/analytics";
import {
	type ConsentState,
	getConsent,
	onConsentChange,
} from "@/lib/consent";

// --- Union typée des events du site -----------------------------------------

/** Valeurs de propriété acceptées (contrainte Vercel Analytics : scalaires). */
export type TelemetryPropValue = string | number | boolean | null;

/** Catalogue typé des events. Ajouter ici tout nouvel event web. */
export type TelemetryEvent =
	// Vue d'une fiche wiki (perso, saga, film, épisode, planète, technique…).
	| {
			name: "wiki_view";
			props: {
				entityType:
					| "character"
					| "saga"
					| "movie"
					| "episode"
					| "planet"
					| "technique"
					| "game"
					| "manga"
					| "race"
					| "arc";
				entityId: string | number;
				entityName?: string;
				series?: string;
			};
	  }
	// Recherche (palette ⌘K ou page /wiki/search).
	| { name: "search"; props: { query: string; resultCount?: number } }
	// Clic sur une section de la homepage (scènes héro).
	| { name: "home_section"; props: { section: string; index?: number } }
	// Clic sur un call-to-action (Discord, lecture, lien sortant…).
	| {
			name: "cta_click";
			props: { cta: string; href?: string; location?: string };
	  }
	// Ouverture d'un lecteur (épisode/film VF/VOSTFR).
	| {
			name: "play_open";
			props: {
				entityType: "episode" | "movie";
				entityId: string | number;
				lang?: string;
				player?: string;
			};
	  }
	// Event générique (échappatoire typée — préférer un event nommé).
	| { name: string; props?: Record<string, TelemetryPropValue> };

type AnyEventName = TelemetryEvent["name"];

// --- Garde-fous environnement -----------------------------------------------

const isBrowser = typeof window !== "undefined";

/** Do-Not-Track navigateur (legacy mais toujours respecté en UE). */
function isDoNotTrack(): boolean {
	if (!isBrowser) return false;
	const nav = navigator as Navigator & {
		doNotTrack?: string;
		msDoNotTrack?: string;
	};
	const dnt =
		nav.doNotTrack ??
		(window as unknown as { doNotTrack?: string }).doNotTrack ??
		nav.msDoNotTrack;
	return dnt === "1" || dnt === "yes";
}

/** True si on a le droit d'émettre des events analytics non-essentiels. */
function canTrack(consent?: ConsentState): boolean {
	if (!isBrowser) return false;
	if (isDoNotTrack()) return false;
	const c = consent ?? getConsent();
	return c.analytics === true;
}

// --- Session de navigation (regroupe les events d'une visite) ---------------

const SESSION_KEY = "dbfr_sid";
const SESSION_TTL = 30 * 60 * 1000; // 30 min d'inactivité = nouvelle session.

function genId(): string {
	if (isBrowser && "randomUUID" in crypto) return crypto.randomUUID();
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Id de session de navigation (sessionStorage, rotaté après 30 min). */
function getSessionId(): string {
	if (!isBrowser) return "ssr";
	try {
		const raw = sessionStorage.getItem(SESSION_KEY);
		const now = Date.now();
		if (raw) {
			const parsed = JSON.parse(raw) as { id: string; at: number };
			if (now - parsed.at < SESSION_TTL) {
				sessionStorage.setItem(
					SESSION_KEY,
					JSON.stringify({ id: parsed.id, at: now }),
				);
				return parsed.id;
			}
		}
		const id = genId();
		sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, at: now }));
		return id;
	} catch {
		return "no-storage";
	}
}

// --- Fan-out -----------------------------------------------------------------

type GtmWindow = Window & { dataLayer?: Record<string, unknown>[] };

/** Pousse un event dans le dataLayer GTM (no-op si GTM pas chargé / SSR). */
function pushDataLayer(name: AnyEventName, props: Record<string, unknown>): void {
	if (!isBrowser) return;
	const w = window as GtmWindow;
	w.dataLayer ??= [];
	w.dataLayer.push({ event: name, ...props });
}

/** Vercel Analytics : ne garde que les props scalaires (contrainte API). */
function toScalarProps(
	props: Record<string, unknown>,
): Record<string, string | number | boolean | null> {
	const out: Record<string, string | number | boolean | null> = {};
	for (const [k, v] of Object.entries(props)) {
		if (v == null) out[k] = null;
		else if (
			typeof v === "string" ||
			typeof v === "number" ||
			typeof v === "boolean"
		)
			out[k] = v;
		else out[k] = String(v);
	}
	return out;
}

// File d'attente first-party + flush groupé (debounce léger pour limiter les POST).
type QueuedEvent = {
	type: string;
	props: Record<string, unknown>;
	path: string;
	referrer: string | null;
	sessionId: string;
	entityType: string | null;
	entityId: string | null;
	ts: number;
};

let queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_DEBOUNCE = 1500;
const MAX_BATCH = 20;

function scheduleFlush(): void {
	if (flushTimer) return;
	flushTimer = setTimeout(flush, FLUSH_DEBOUNCE);
}

function flush(): void {
	flushTimer = null;
	if (!isBrowser || queue.length === 0) return;
	const batch = queue.slice(0, MAX_BATCH);
	queue = queue.slice(MAX_BATCH);
	const body = JSON.stringify({ events: batch });
	// `keepalive` → l'envoi survit à la navigation/fermeture d'onglet.
	try {
		void fetch("/api/telemetry", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body,
			keepalive: true,
			credentials: "include",
		}).catch(() => {});
	} catch {
		/* ignore */
	}
	if (queue.length > 0) scheduleFlush();
}

// Flush résiduel quand l'onglet passe en arrière-plan / se ferme.
if (isBrowser) {
	const finalFlush = () => {
		if (queue.length === 0) return;
		const batch = queue;
		queue = [];
		try {
			const blob = new Blob([JSON.stringify({ events: batch })], {
				type: "application/json",
			});
			navigator.sendBeacon?.("/api/telemetry", blob);
		} catch {
			/* ignore */
		}
	};
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") finalFlush();
	});
	window.addEventListener("pagehide", finalFlush);
}

// --- API publique ------------------------------------------------------------

/**
 * Émet un event de télémétrie typé. SSR-safe, no-op sans consentement / sous DNT.
 *
 * @example
 * track("wiki_view", { entityType: "character", entityId: 42, entityName: "Goku" });
 * track("search", { query: "kamehameha", resultCount: 7 });
 */
export function track<N extends AnyEventName>(
	name: N,
	props?: Record<string, unknown>,
): void {
	if (!isBrowser) return;
	if (!canTrack()) return;

	const p = props ?? {};
	const path = window.location.pathname;
	const referrer = document.referrer || null;
	const sessionId = getSessionId();
	const entityType =
		typeof p.entityType === "string" ? p.entityType : null;
	const entityId =
		p.entityId != null ? String(p.entityId) : null;

	// 1) Vercel Web Analytics (custom event).
	try {
		vercelTrack(name, toScalarProps(p));
	} catch {
		/* ignore */
	}

	// 2) Google Tag Manager dataLayer.
	pushDataLayer(name, p);

	// 3) First-party (queue + flush groupé).
	queue.push({
		type: name,
		props: p,
		path,
		referrer,
		sessionId,
		entityType,
		entityId,
		ts: Date.now(),
	});
	scheduleFlush();
}

/** Helper RSC-friendly : émet une `wiki_view` typée (sucre sur `track`). */
export function trackWikiView(
	entityType: Extract<
		TelemetryEvent,
		{ name: "wiki_view" }
	>["props"]["entityType"],
	entityId: string | number,
	extra?: { entityName?: string; series?: string },
): void {
	track("wiki_view", { entityType, entityId, ...extra });
}

// Si le consentement passe à "refusé" en cours de session, on vide la file
// first-party en attente (rien ne part sans accord).
if (isBrowser) {
	onConsentChange((c) => {
		if (c.analytics !== true) {
			queue = [];
			if (flushTimer) {
				clearTimeout(flushTimer);
				flushTimer = null;
			}
		}
	});
}
