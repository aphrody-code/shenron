import { botAdmin } from "@/lib/bot-admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

const METRICS = [
	{ key: "xp", label: "XP", color: "text-fuchsia-300" },
	{ key: "zeni", label: "Zénis", color: "text-yellow-300" },
	{ key: "voice", label: "Vocal", color: "text-cyan-300" },
	{ key: "messages", label: "Messages", color: "text-violet-300" },
	{ key: "streak", label: "Streak", color: "text-pink-300" },
] as const;

type Metric = (typeof METRICS)[number]["key"];

export default async function LeaderboardsPage({
	searchParams,
}: {
	searchParams: Promise<{ metric?: string }>;
}) {
	const sp = await searchParams;
	const metric = (METRICS.find((m) => m.key === sp.metric)?.key ??
		"xp") as Metric;
	const data = await botAdmin.levelsTop(metric, 50).catch(() => ({ top: [] }));
	const tint =
		METRICS.find((m) => m.key === metric)?.color ?? "text-fuchsia-300";

	return (
		<div className="w-full max-w-5xl mx-auto">
			<header className="mb-6 flex items-end justify-between flex-wrap gap-4">
				<div>
					<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
						LEADERBOARDS · {metric.toUpperCase()}
					</h1>
					<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
						Top 50 utilisateurs · classement par {metric}
					</p>
				</div>
				<div className="flex flex-wrap gap-1 text-xs">
					{METRICS.map((m) => (
						<Link
							key={m.key}
							href={`?metric=${m.key}`}
							className={`px-3 py-1.5 border rounded uppercase tracking-widest ${
								m.key === metric
									? `${m.color} border-current bg-current/20`
									: "border-dbz-border text-white/40 hover:border-current"
							}`}
						>
							{m.label}
						</Link>
					))}
				</div>
			</header>

			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[600px] text-xs">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
								#
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								User
							</th>
							{metric !== "xp" && (
								<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
									Niv
								</th>
							)}
							<th
								className={`p-2 text-right font-bold uppercase tracking-widest ${tint}`}
							>
								{metric}
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-dbz-border">
						{data.top.map((e, i) => (
							<tr key={e.discordId} className="hover:bg-dbz-blue-light/5">
								<td className="p-2 text-right font-saiyan text-dbz-blue-light">
									{e.rank ?? i + 1}
								</td>
								<td className="p-2">
									<div className="flex items-center gap-2">
										{e.avatarUrl && (
											 
											<img
												src={e.avatarUrl}
												alt=""
												className="w-6 h-6 rounded-full border border-dbz-border"
											/>
										)}
										<span className="font-mono text-white">
											{e.username ?? e.discordId}
										</span>
									</div>
								</td>
								{metric !== "xp" && (
									<td className="p-2 text-right font-saiyan text-fuchsia-300">
										{e.level ?? "—"}
									</td>
								)}
								<td className={`p-2 text-right font-mono ${tint}`}>
									{e.value.toLocaleString("fr-FR")}
								</td>
							</tr>
						))}
						{data.top.length === 0 && (
							<tr>
								<td colSpan={4} className="p-6 text-center text-white/50">
									Aucune donnée
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
