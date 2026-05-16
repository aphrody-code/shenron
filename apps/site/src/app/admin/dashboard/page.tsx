import { botAdmin, BOT_API_URL } from "@/lib/bot-admin";
import Link from "next/link";
import { HostStatsLive } from "./HostStatsLive";

export const dynamic = "force-dynamic";
export const revalidate = 10;

function uptime(s: number): string {
	if (s < 60) return `${s.toFixed(0)}s`;
	if (s < 3600) return `${(s / 60).toFixed(1)}m`;
	if (s < 86400) return `${(s / 3600).toFixed(1)}h`;
	return `${(s / 86400).toFixed(1)}j`;
}

export default async function AdminDashboard() {
	const [bots, health, stats] = await Promise.all([
		botAdmin.bots().catch(() => ({ bots: [] })),
		botAdmin.health().catch(() => null),
		botAdmin.stats().catch(() => null),
	]);

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8">
			<div>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">DASHBOARD</h1>
				<p className="text-xs text-dbz-blue-light font-bold uppercase tracking-widest">
					État opérationnel du multi-bot · {BOT_API_URL}
				</p>
			</div>

			{/* Health + global stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				<div className="dbz-panel p-4">
					<div className="text-xs text-dbz-blue-light uppercase mb-1">État</div>
					<div
						className={`text-2xl font-saiyan ${health?.online ? "text-green-500" : "text-red-500"}`}
					>
						{health?.online ? "ONLINE" : "OFFLINE"}
					</div>
				</div>
				<div className="dbz-panel p-4">
					<div className="text-xs text-dbz-blue-light uppercase mb-1">
						Uptime
					</div>
					<div className="text-2xl font-saiyan text-dbz-yellow">
						{health ? uptime(health.uptime / 1000) : "—"}
					</div>
				</div>
				<div className="dbz-panel p-4">
					<div className="text-xs text-dbz-blue-light uppercase mb-1">
						Users
					</div>
					<div className="text-2xl font-saiyan text-dbz-orange">
						{stats?.users ?? "—"}
					</div>
				</div>
				<div className="dbz-panel p-4">
					<div className="text-xs text-dbz-blue-light uppercase mb-1">
						Commands
					</div>
					<div className="text-2xl font-saiyan text-dbz-orange">
						{stats?.commands ?? "—"}
					</div>
				</div>
			</div>

			<HostStatsLive />

			{/* Bots multi-persona grid */}
			<div>
				<h2 className="text-2xl font-saiyan text-dbz-yellow mb-4 uppercase">
					Personas Discord ({bots.bots.length})
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{bots.bots.map((b) => (
						<Link
							key={b.id}
							href={`/admin/bot/${b.id}`}
							className="dbz-panel p-4 hover:border-dbz-orange transition-colors group"
						>
							<div className="flex items-center gap-3 mb-3">
								<img
									src={b.avatar}
									alt={b.name}
									className="w-12 h-12 rounded-none border-2 border-dbz-border group-hover:border-dbz-orange"
								/>
								<div className="flex-1">
									<div className="font-saiyan text-lg text-white group-hover:text-dbz-orange">
										{b.name}
									</div>
									<div className="text-xs text-gray-500 font-mono">
										{b.username}
									</div>
								</div>
								<div
									className={`w-3 h-3 rounded-full ${b.online ? "bg-green-500" : "bg-red-500"} shadow-[0_0_8px_currentColor]`}
								/>
							</div>
							<div className="grid grid-cols-3 gap-2 text-center text-xs">
								<div>
									<div className="text-dbz-orange font-saiyan text-lg">
										{b.commandCount}
									</div>
									<div className="text-gray-500 uppercase">cmds</div>
								</div>
								<div>
									<div className="text-dbz-yellow font-saiyan text-lg">
										{b.wsPing}
									</div>
									<div className="text-gray-500 uppercase">ms</div>
								</div>
								<div>
									<div className="text-dbz-blue-light font-saiyan text-lg">
										{b.guildCount}
									</div>
									<div className="text-gray-500 uppercase">guild</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* Quick links */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				<Link href="/admin/cron" className="dbz-button text-center">
					CRON
				</Link>
				<Link href="/admin/services" className="dbz-button text-center">
					SERVICES
				</Link>
				<Link href="/admin/database" className="dbz-button text-center">
					DATABASE
				</Link>
				<Link href="/admin/economy" className="dbz-button text-center">
					ECONOMY
				</Link>
			</div>
		</div>
	);
}
