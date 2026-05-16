"use client";

import { useLiveEvents } from "@/lib/use-live-events";

const STATUS_LABEL = {
	connecting: "CONNECTING…",
	open: "LIVE",
	closed: "OFFLINE",
} as const;

const STATUS_COLOR = {
	connecting: "text-dbz-yellow",
	open: "text-green-400",
	closed: "text-red-400",
} as const;

export function LiveEventsStream() {
	const { events, status } = useLiveEvents({ max: 200 });

	return (
		<div className="dbz-panel p-4">
			<div className="flex items-center justify-between mb-4 px-2">
				<div className="flex items-center gap-2">
					<span
						className={`led ${status === "open" ? "" : "opacity-40"}`}
						aria-hidden
					/>
					<span
						className={`font-scouter text-xs tracking-[0.3em] ${STATUS_COLOR[status]}`}
					>
						{STATUS_LABEL[status]}
					</span>
				</div>
				<span className="font-scouter text-[10px] tracking-widest text-dbz-blue-light/70">
					{events.length} events ❯ buffer 200
				</span>
			</div>

			<div className="font-mono text-xs space-y-1 max-h-[70vh] overflow-y-auto bg-dbz-bg/60 p-3 border border-dbz-border">
				{events.length === 0 && (
					<p className="text-dbz-blue-light/50 italic">En attente d'events…</p>
				)}
				{events.map((e, i) => (
					<div
						key={i}
						className="border-l-2 border-dbz-orange/40 pl-2 py-1 hover:border-dbz-orange transition-colors"
					>
						<div className="flex items-center gap-3">
							<span className="text-dbz-yellow font-bold">{e.name}</span>
							{e.ts && (
								<span className="text-dbz-blue-light/50 text-[10px]">
									{new Date(e.ts).toLocaleTimeString("fr-FR")}
								</span>
							)}
						</div>
						{e.payload !== undefined && (
							<pre className="text-[10px] text-dbz-blue-light/80 mt-1 whitespace-pre-wrap break-all">
								{JSON.stringify(e.payload, null, 2)}
							</pre>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
