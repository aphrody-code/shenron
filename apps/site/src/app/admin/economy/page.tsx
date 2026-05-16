import { botAdmin } from "@/lib/bot-admin";
import { GiveZeniForm } from "./GiveZeniForm";

export const dynamic = "force-dynamic";

type LBEntry = {
	rank?: number;
	discordId: string;
	username?: string;
	avatarUrl?: string;
	level: number;
	xp: number;
	zeni: number;
};

type Tx = {
	id?: number;
	userId: string;
	delta: number;
	reason?: string | null;
	createdAt?: number | string;
};

export default async function AdminEconomy() {
	const [lb, stats, txs] = await Promise.all([
		botAdmin.economyLeaderboard(50).catch(() => ({ leaderboard: [] })),
		botAdmin.economyStats().catch(() => null),
		botAdmin.economyTransactions(30).catch(() => ({ transactions: [] })),
	]);
	const entries = (lb.leaderboard ?? []) as LBEntry[];
	const transactions = (txs.transactions ?? []) as Tx[];

	const counters = stats
		? [
				{
					k: "Total zénis",
					v: stats.zeni.total.toLocaleString("fr-FR"),
					c: "text-fuchsia-300",
				},
				{
					k: "Moyenne",
					v: Math.round(stats.zeni.avg).toLocaleString("fr-FR"),
					c: "text-cyan-300",
				},
				{
					k: "Max",
					v: stats.zeni.max.toLocaleString("fr-FR"),
					c: "text-violet-300",
				},
				{ k: "Riches (≥10k)", v: stats.zeni.rich, c: "text-emerald-300" },
				{ k: "Zéros", v: stats.zeni.zero, c: "text-red-300" },
				{ k: "Fusions", v: stats.fusions, c: "text-pink-300" },
			]
		: [];

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					ECONOMY · FULL
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					Stats globales · top 50 · 30 dernières txs · give/remove zénis
				</p>
			</header>

			{counters.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-6 gap-3">
					{counters.map((c) => (
						<div key={c.k} className="dbz-panel p-3 text-center">
							<div className={`text-2xl font-saiyan ${c.c}`}>{c.v}</div>
							<div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">
								{c.k}
							</div>
						</div>
					))}
				</div>
			)}

			<GiveZeniForm />

			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow mb-3">🏆 Top 50</h2>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[600px]">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									#
								</th>
								<th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									User
								</th>
								<th className="p-3 text-right text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Niv
								</th>
								<th className="p-3 text-right text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									XP
								</th>
								<th className="p-3 text-right text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Zéni
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border">
							{entries.map((e, i) => (
								<tr key={e.discordId} className="hover:bg-dbz-blue-light/10">
									<td className="p-3 font-saiyan text-dbz-blue-light">
										{e.rank ?? i + 1}
									</td>
									<td className="p-3">
										<div className="flex items-center gap-2">
											{e.avatarUrl && (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={e.avatarUrl}
													alt=""
													className="w-6 h-6 rounded-full border border-dbz-border"
												/>
											)}
											<span className="text-sm font-bold text-white">
												{e.username ?? e.discordId}
											</span>
										</div>
									</td>
									<td className="p-3 text-right font-saiyan text-dbz-orange">
										{e.level}
									</td>
									<td className="p-3 text-right font-mono text-sm text-gray-300">
										{e.xp.toLocaleString("fr-FR")}
									</td>
									<td className="p-3 text-right font-mono text-sm text-dbz-yellow">
										{e.zeni.toLocaleString("fr-FR")} ¥
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-saiyan text-cyan-300 mb-3">
					📝 30 dernières transactions
				</h2>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[500px] text-xs">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									User
								</th>
								<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
									Δ
								</th>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									Raison
								</th>
								<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
									Date
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border">
							{transactions.map((t, i) => (
								<tr key={t.id ?? i} className="hover:bg-dbz-blue-light/5">
									<td className="p-2 font-mono text-fuchsia-200">{t.userId}</td>
									<td
										className={`p-2 text-right font-mono ${t.delta > 0 ? "text-green-300" : "text-red-300"}`}
									>
										{t.delta > 0 ? "+" : ""}
										{t.delta} z
									</td>
									<td className="p-2 text-white/70">{t.reason ?? "—"}</td>
									<td className="p-2 text-right text-white/40">
										{t.createdAt
											? new Date(t.createdAt).toLocaleString("fr-FR")
											: "—"}
									</td>
								</tr>
							))}
							{transactions.length === 0 && (
								<tr>
									<td
										colSpan={4}
										className="p-4 text-center text-white/40 font-saiyan uppercase"
									>
										Aucune transaction
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
