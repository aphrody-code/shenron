"use client";

import { useEffect, useState } from "react";

type LogEntry = {
	time?: string;
	host?: string;
	unit?: string;
	message?: string;
	raw?: string;
};

const LEVEL_COLORS: Record<string, string> = {
	ERROR: "text-red-400",
	WARN: "text-yellow-300",
	WARNING: "text-yellow-300",
	INFO: "text-cyan-300",
	DEBUG: "text-white/50",
	FATAL: "text-pink-400",
};

function levelOf(line: string): keyof typeof LEVEL_COLORS | null {
	for (const lvl of Object.keys(LEVEL_COLORS)) {
		if (line.includes(lvl)) return lvl as keyof typeof LEVEL_COLORS;
	}
	return null;
}

export function LogsAutoRefresh({
	initial,
	lines,
}: {
	initial: LogEntry[];
	lines: number;
}) {
	const [logs, setLogs] = useState<LogEntry[]>(initial);
	const [paused, setPaused] = useState(false);
	const [fetching, setFetching] = useState(false);

	useEffect(() => {
		if (paused) return;
		const tick = async () => {
			setFetching(true);
			try {
				const res = await fetch(`/api/bot-admin/health/logs?lines=${lines}`, {
					cache: "no-store",
				});
				if (res.ok) {
					const data = (await res.json()) as { logs: LogEntry[] };
					setLogs(data.logs ?? []);
				}
			} catch {
				/* ignore network blips */
			} finally {
				setFetching(false);
			}
		};
		const id = setInterval(tick, 10_000);
		return () => clearInterval(id);
	}, [paused, lines]);

	return (
		<div className="dbz-panel p-0 overflow-hidden">
			<div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-dbz-border bg-black/30">
				<div className="flex items-center gap-2">
					<span className={`led ${paused ? "opacity-30" : ""}`} aria-hidden />
					<span className="font-scouter text-[10px] tracking-[0.3em] text-cyan-300">
						{paused ? "PAUSED" : fetching ? "FETCHING…" : "LIVE"}
					</span>
				</div>
				<button
					type="button"
					onClick={() => setPaused((p) => !p)}
					className="dbz-button-ghost !text-[10px] !py-1 !px-3"
				>
					{paused ? "Reprendre" : "Pause"}
				</button>
			</div>

			<div className="bg-black/60 max-h-[70vh] overflow-y-auto font-mono text-[11px] leading-relaxed">
				{logs.length === 0 ? (
					<p className="p-6 text-white/50 italic">Aucun log disponible.</p>
				) : (
					<table className="w-full">
						<tbody>
							{logs.map((l, i) => {
								const lvl = levelOf(l.message ?? l.raw ?? "");
								return (
									<tr
										key={i}
										className="border-b border-dbz-border/30 hover:bg-fuchsia-500/5"
									>
										<td className="px-3 py-1 text-white/40 whitespace-nowrap align-top w-40">
											{l.time?.replace("T", " ").slice(0, 19) ?? "—"}
										</td>
										<td
											className={`px-3 py-1 whitespace-pre-wrap break-all ${lvl ? LEVEL_COLORS[lvl] : "text-white/85"}`}
										>
											{l.message ?? l.raw ?? "(vide)"}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
