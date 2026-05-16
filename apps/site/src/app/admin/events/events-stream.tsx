"use client";

import { useEffect, useRef, useState } from "react";

type Event = {
	id: number;
	ts: number;
	type: string;
	data: unknown;
};

const COLOR_BY_TYPE: Record<string, string> = {
	"level-up": "text-dbz-yellow border-dbz-yellow",
	"achievement-unlocked": "text-purple-400 border-purple-400",
	"fusion-created": "text-pink-400 border-pink-400",
	"message-xp": "text-cyan-400 border-cyan-400",
	"voice-xp": "text-cyan-400 border-cyan-400",
	sanction: "text-red-400 border-red-400",
	jail: "text-red-400 border-red-400",
	"daily-quest": "text-green-400 border-green-400",
};

export function EventsStream() {
	const [events, setEvents] = useState<Event[]>([]);
	const [connected, setConnected] = useState(false);
	const counterRef = useRef(0);

	useEffect(() => {
		const es = new EventSource("/api/bot-admin/a2a/events");
		es.onopen = () => setConnected(true);
		es.onerror = () => setConnected(false);
		es.onmessage = (e) => {
			try {
				const parsed = JSON.parse(e.data);
				counterRef.current++;
				setEvents((prev) =>
					[
						{
							id: counterRef.current,
							ts: Date.now(),
							type: parsed.type ?? "unknown",
							data: parsed.data ?? parsed,
						},
						...prev,
					].slice(0, 100),
				);
			} catch {
				/* ignore */
			}
		};
		return () => es.close();
	}, []);

	return (
		<div className="space-y-4">
			<div className="dbz-panel p-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div
						className={`w-3 h-3 rounded-full ${connected ? "bg-green-500 shadow-[0_0_8px_currentColor]" : "bg-red-500"}`}
					/>
					<span className="font-saiyan text-sm uppercase tracking-widest">
						{connected ? "Connecté" : "Déconnecté"}
					</span>
				</div>
				<div className="text-xs text-gray-500 font-mono">
					{events.length} events · max 100
				</div>
			</div>

			<div className="space-y-2">
				{events.length === 0 ? (
					<div className="dbz-panel p-8 text-center text-gray-500 font-saiyan uppercase">
						En attente d'events bot...
					</div>
				) : (
					events.map((e) => {
						const colorClass =
							COLOR_BY_TYPE[e.type] ?? "text-dbz-blue-light border-dbz-border";
						return (
							<article
								key={e.id}
								className={`dbz-panel p-3 border-l-4 ${colorClass} hover:bg-dbz-blue-light/5`}
							>
								<div className="flex items-baseline justify-between mb-1">
									<code
										className={`font-mono text-sm font-bold ${colorClass.split(" ")[0]}`}
									>
										{e.type}
									</code>
									<span className="text-[10px] text-gray-500 font-mono">
										{new Date(e.ts).toLocaleTimeString("fr-FR", {
											hour12: false,
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
										})}
									</span>
								</div>
								<pre className="text-[11px] text-gray-300 font-mono overflow-x-auto bg-dbz-bg p-2 mt-1 max-h-32">
									{JSON.stringify(e.data, null, 2)}
								</pre>
							</article>
						);
					})
				)}
			</div>
		</div>
	);
}
