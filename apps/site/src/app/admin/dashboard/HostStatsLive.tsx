"use client";

import { useEffect, useState } from "react";

type HostStats = {
	cpuLoad?: number[];
	memTotal?: number;
	memUsed?: number;
	memFree?: number;
	uptime?: number;
	[k: string]: unknown;
};

type PidUsage = {
	cpu?: number;
	memory?: number;
	heapUsed?: number;
	heapTotal?: number;
	[k: string]: unknown;
};

function fmtBytes(b: number | undefined): string {
	if (!b || !Number.isFinite(b)) return "—";
	if (b < 1024) return `${b} B`;
	if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
	if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
	return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function HostStatsLive() {
	const [host, setHost] = useState<HostStats | null>(null);
	const [pid, setPid] = useState<PidUsage | null>(null);
	const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

	useEffect(() => {
		let mounted = true;
		const tick = async () => {
			try {
				const [h, p] = await Promise.all([
					fetch("/api/bot-admin/health/host", { cache: "no-store" }).then(
						(r) => (r.ok ? r.json() : null),
					),
					fetch("/api/bot-admin/health/usage", { cache: "no-store" }).then(
						(r) => (r.ok ? r.json() : null),
					),
				]);
				if (!mounted) return;
				setHost(h);
				setPid(p);
				setUpdatedAt(new Date());
			} catch {
				/* network blip */
			}
		};
		void tick();
		const id = setInterval(tick, 15_000);
		return () => {
			mounted = false;
			clearInterval(id);
		};
	}, []);

	const cpu1 = host?.cpuLoad?.[0];
	const memUsedPct =
		host?.memTotal && host?.memUsed
			? (host.memUsed / host.memTotal) * 100
			: undefined;

	return (
		<div className="dbz-panel p-5">
			<div className="flex items-baseline justify-between mb-4">
				<h2 className="text-xl font-saiyan text-cyan-300 uppercase">
					Host live · refresh 15s
				</h2>
				<span className="text-[10px] font-scouter tracking-widest text-white/40">
					{updatedAt
						? `MAJ ${updatedAt.toLocaleTimeString("fr-FR")}`
						: "Chargement…"}
				</span>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
				<Cell
					label="CPU load 1m"
					value={cpu1 !== undefined ? cpu1.toFixed(2) : "—"}
				/>
				<Cell
					label="Mem host"
					value={
						memUsedPct !== undefined
							? `${memUsedPct.toFixed(0)}%`
							: fmtBytes(host?.memUsed)
					}
					hint={
						host?.memUsed && host?.memTotal
							? `${fmtBytes(host.memUsed)} / ${fmtBytes(host.memTotal)}`
							: undefined
					}
				/>
				<Cell
					label="Process CPU"
					value={pid?.cpu !== undefined ? `${pid.cpu.toFixed(1)}%` : "—"}
				/>
				<Cell
					label="Process RAM"
					value={fmtBytes(pid?.memory)}
					hint={
						pid?.heapUsed && pid?.heapTotal
							? `heap ${fmtBytes(pid.heapUsed)}/${fmtBytes(pid.heapTotal)}`
							: undefined
					}
				/>
			</div>
		</div>
	);
}

function Cell({
	label,
	value,
	hint,
}: {
	label: string;
	value: string;
	hint?: string;
}) {
	return (
		<div>
			<div className="text-[10px] uppercase tracking-widest text-white/40">
				{label}
			</div>
			<div className="text-2xl font-saiyan text-fuchsia-200 mt-1">{value}</div>
			{hint && <div className="text-[10px] text-white/50 mt-1">{hint}</div>}
		</div>
	);
}
