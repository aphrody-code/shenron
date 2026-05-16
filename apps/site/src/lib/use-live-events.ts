"use client";

import { useEffect, useRef, useState } from "react";

export type BotEvent = {
	name: string;
	payload?: unknown;
	ts?: number;
};

type Options = {
	max?: number;
	filter?: (e: BotEvent) => boolean;
};

/**
 * Hook React qui consomme le SSE `/api/bot-admin/events` (proxy vers bot).
 * Le proxy ajoute le Bearer token côté server, le client ne voit rien.
 * Reconnexion auto via EventSource natif.
 */
export function useLiveEvents({ max = 100, filter }: Options = {}) {
	const [events, setEvents] = useState<BotEvent[]>([]);
	const [status, setStatus] = useState<"connecting" | "open" | "closed">(
		"connecting",
	);
	const sourceRef = useRef<EventSource | null>(null);

	useEffect(() => {
		const es = new EventSource("/api/bot-admin/events");
		sourceRef.current = es;

		es.onopen = () => setStatus("open");
		es.onerror = () => setStatus("closed");
		es.onmessage = (msg) => {
			try {
				const data = JSON.parse(msg.data) as BotEvent;
				if (filter && !filter(data)) return;
				setEvents((prev) => {
					const next = [data, ...prev];
					if (next.length > max) next.length = max;
					return next;
				});
			} catch {
				/* malformed event, ignore */
			}
		};

		return () => {
			es.close();
			sourceRef.current = null;
		};
	}, [max, filter]);

	return { events, status };
}
