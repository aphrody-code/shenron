"use client";

// État LIVE du bot pour la home : poll des stats publiques + personas en ligne
// toutes les 25 s (gelé quand l'onglet est masqué) + flux SSE `a2a/events` pour
// la pulsation temps réel. Tout est défensif (try/catch, fallback sur l'état SSR
// initial) : la home reflète l'état réel mais ne casse jamais si l'API hoquette.
import { useEffect, useRef, useState } from "react";
import { API_URL as API_BASE } from "@/lib/config";

export interface BotStats {
	users: number;
	totalXp: number;
	totalZeni: number;
	achievementsUnlocked: number;
	shopItems: number;
	inventoryItems: number;
}

export interface PersonaLive {
	id: string;
	name: string;
	avatar: string | null;
	avatarUrl?: string | null;
	online: boolean;
}

export interface TopMember {
	rank: number;
	discordId: string;
	username: string | null;
	avatarUrl: string | null;
	xp: number;
	level: number;
}

export interface PresenceMember {
	id: string;
	username: string;
	avatarUrl: string;
	status: string;
}
export interface PresenceState {
	total: number;
	online: number;
	members: PresenceMember[];
}

export interface LiveEvent {
	key: number;
	type: string;
	label: string;
}

export interface LiveState {
	stats: BotStats;
	personas: PersonaLive[];
	topMembers: TopMember[];
	presence: PresenceState;
	onlineCount: number;
	connected: boolean;
	events: LiveEvent[];
	refreshedAt: number;
}

function labelForEvent(type: string, data: unknown): string {
	const d = (data ?? {}) as Record<string, unknown>;
	const who = (d.username as string) || (d.name as string) || "Un guerrier";
	switch (type) {
		case "level-up":
		case "levelup":
			return `${who} passe niveau ${d.level ?? ""}`.trim();
		case "achievement":
			return `${who} débloque un succès`;
		case "message-xp":
		case "xp":
			return `${who} gagne de l'XP`;
		case "fusion":
			return `Fusion accomplie`;
		default:
			// Type non mappé du bus a2a → libellé FR neutre (jamais le type brut).
			return "Activité sur le serveur";
	}
}

export function useLiveBotState(initial: {
	stats: BotStats;
	personas: PersonaLive[];
	topMembers?: TopMember[];
	presence?: PresenceState;
}): LiveState {
	const [stats, setStats] = useState<BotStats>(initial.stats);
	const [personas, setPersonas] = useState<PersonaLive[]>(initial.personas);
	const [topMembers, setTopMembers] = useState<TopMember[]>(initial.topMembers ?? []);
	const [presence, setPresence] = useState<PresenceState>(
		initial.presence ?? { total: 0, online: 0, members: [] }
	);
	const [connected, setConnected] = useState(false);
	const [events, setEvents] = useState<LiveEvent[]>([]);
	const [refreshedAt, setRefreshedAt] = useState(0);
	const evKey = useRef(0);

	// ── Poll stats + personas ───────────────────────────────────────────────
	useEffect(() => {
		let alive = true;
		const ac = new AbortController();

		async function pull() {
			if (typeof document !== "undefined" && document.hidden) return;
			try {
				const [s, p, lb, pr] = await Promise.all([
					fetch(`${API_BASE}/api/public/stats`, {
						signal: ac.signal,
						cache: "no-store",
					}).then((r) => (r.ok ? r.json() : null)),
					fetch(`${API_BASE}/api/public/personas`, {
						signal: ac.signal,
						cache: "no-store",
					}).then((r) => (r.ok ? r.json() : null)),
					fetch(`${API_BASE}/api/public/leaderboard?enrich=1&limit=12`, {
						signal: ac.signal,
						cache: "no-store",
					}).then((r) => (r.ok ? r.json() : null)),
					fetch(`${API_BASE}/api/public/presence`, {
						signal: ac.signal,
						cache: "no-store",
					}).then((r) => (r.ok ? r.json() : null)),
				]);
				if (!alive) return;
				if (s && typeof s.users === "number") setStats((prev) => ({ ...prev, ...s }));
				const list = p?.personas;
				if (Array.isArray(list) && list.length) setPersonas(list);
				if (Array.isArray(lb?.leaderboard)) setTopMembers(lb.leaderboard);
				if (pr && typeof pr.online === "number") setPresence(pr);
				setRefreshedAt(performance.now());
			} catch {
				/* réseau capricieux → on garde l'état précédent */
			}
		}

		const id = setInterval(pull, 25_000);
		const onVis = () => {
			if (!document.hidden) pull();
		};
		document.addEventListener("visibilitychange", onVis);
		pull();
		return () => {
			alive = false;
			ac.abort();
			clearInterval(id);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, []);

	// ── SSE temps réel (a2a/events public) ──────────────────────────────────
	useEffect(() => {
		if (typeof window === "undefined" || !("EventSource" in window)) return;
		let es: EventSource | null = null;
		let retry: ReturnType<typeof setTimeout> | null = null;

		const connect = () => {
			try {
				es = new EventSource(`${API_BASE}/api/a2a/events`);
			} catch {
				return;
			}
			es.onopen = () => setConnected(true);
			es.onmessage = (e) => {
				let type = "event";
				let data: unknown = null;
				try {
					const parsed = JSON.parse(e.data);
					type = parsed.type ?? parsed.event ?? "event";
					data = parsed.data ?? parsed;
				} catch {
					/* keep-alive / message brut */
				}
				if (type === "ping" || type === "keep-alive") return;
				evKey.current += 1;
				const ev: LiveEvent = {
					key: evKey.current,
					type,
					label: labelForEvent(type, data),
				};
				setEvents((prev) => [ev, ...prev].slice(0, 6));
			};
			es.onerror = () => {
				setConnected(false);
				es?.close();
				retry = setTimeout(connect, 8_000);
			};
		};
		connect();
		return () => {
			es?.close();
			if (retry) clearTimeout(retry);
		};
	}, []);

	const onlineCount = personas.reduce((n, p) => n + (p.online ? 1 : 0), 0);
	return { stats, personas, topMembers, presence, onlineCount, connected, events, refreshedAt };
}
