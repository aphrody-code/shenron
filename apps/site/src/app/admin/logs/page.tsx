"use client";

import { useQuery } from "@tanstack/react-query";
import { Terminal, RefreshCw } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/admin-api";

interface LogEntry {
	time?: string;
	host?: string;
	unit?: string;
	message?: string;
	raw?: string;
}

function colorClass(message: string): string {
	if (/\bERROR\b|\berror\b|\bFAIL\b|\bfail\b/.test(message))
		return "text-red-400";
	if (/\bWARN\b|\bwarn\b/.test(message)) return "text-amber-400";
	if (/\bINFO\b|\binfo\b/.test(message)) return "text-green-400";
	return "text-zinc-300";
}

export default function LogsPage() {
	const [lines, setLines] = useState(100);
	const { data, isLoading, refetch, isFetching } = useQuery({
		queryKey: ["logs", lines],
		queryFn: () =>
			api.get<{ logs: LogEntry[]; count: number }>(
				`/health/logs?lines=${lines}`,
			),
		refetchInterval: 10_000,
	});

	return (
		<div className="space-y-4">
			<div className="dbz-panel p-4">
				<div className="flex items-center gap-2 mb-2">
					<Terminal className="h-5 w-5 text-dbz-orange" />
					<h2 className="text-lg font-saiyan text-dbz-orange uppercase">
						Journal du bot
					</h2>
				</div>
				<p className="text-sm text-zinc-300">
					Ce journal regroupe tous les messages que le bot écrit en arrière-plan
					: démarrages, erreurs, connexions Discord, exécutions de tâches… C'est
					la première chose à consulter en cas de problème.
				</p>
				<p className="mt-1 text-xs text-dbz-blue-light">
					Source : <code>journalctl -u shenron</code> · rafraîchissement
					automatique toutes les 10 secondes · lignes les plus récentes en
					premier
				</p>
			</div>

			<div className="dbz-panel p-3 flex flex-wrap items-center gap-3">
				<label className="text-sm text-zinc-300">
					Nombre de lignes affichées
				</label>
				<select
					className="bg-dbz-bg border border-dbz-border rounded px-2 py-1 text-sm text-zinc-200 focus:border-dbz-orange outline-none"
					value={lines}
					onChange={(e) => setLines(Number(e.target.value))}
				>
					{[50, 100, 200, 500].map((n) => (
						<option key={n} value={n}>
							{n} lignes
						</option>
					))}
				</select>
				<button
					type="button"
					onClick={() => refetch()}
					disabled={isFetching}
					className="dbz-button !text-xs !px-3 !py-1.5 ml-auto"
				>
					<RefreshCw
						className={`h-3 w-3 inline-block mr-1 ${isFetching ? "animate-spin" : ""}`}
					/>
					{isFetching ? "Actualisation…" : "Actualiser"}
				</button>
				{data && (
					<span className="text-xs text-zinc-500">
						{data.count} ligne{data.count > 1 ? "s" : ""} chargée
						{data.count > 1 ? "s" : ""}
					</span>
				)}
			</div>

			{isLoading ? (
				<div className="dbz-panel p-8 text-center text-zinc-500 text-sm">
					Chargement du journal…
				</div>
			) : data?.logs.length === 0 ? (
				<div className="dbz-panel p-8 text-center text-zinc-500 text-sm">
					Aucune entrée de journal pour l'instant.
				</div>
			) : (
				<div className="dbz-panel overflow-x-auto p-3 font-mono text-xs bg-zinc-950/80">
					{data?.logs.map((log, i) => (
						<div
							key={i}
							className="whitespace-pre-wrap py-0.5 border-b border-zinc-900/50 last:border-0"
						>
							{log.raw ? (
								<span className="text-zinc-300">{log.raw}</span>
							) : (
								<>
									<span className="text-zinc-600 mr-2 shrink-0">
										{log.time}
									</span>
									<span className={colorClass(log.message ?? "")}>
										{log.message}
									</span>
								</>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
