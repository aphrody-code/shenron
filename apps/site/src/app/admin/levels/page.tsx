import { botAdmin } from "@/lib/bot-admin";

export const dynamic = "force-dynamic";

export default async function AdminLevelsPage() {
	const [rewards, dist] = await Promise.all([
		botAdmin.levels.rewards().catch(() => ({ rewards: [] })),
		botAdmin.levels.distribution().catch(() => ({ distribution: [] })),
	]);
	const maxCount = Math.max(1, ...dist.distribution.map((d) => d.count));

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">LEVELS</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{rewards.rewards.length} paliers configurés
				</p>
			</header>

			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-4">
					Récompenses
				</h2>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[600px]">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Niv
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									XP requis
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Rôle
								</th>
								<th className="p-2 text-right text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Bonus Zéni
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Bannière
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border">
							{rewards.rewards.map((r) => (
								<tr key={r.level} className="hover:bg-dbz-blue-light/5">
									<td className="p-2 font-saiyan text-2xl text-dbz-orange">
										{r.level}
									</td>
									<td className="p-2 font-mono text-sm text-gray-300">
										{r.xpThreshold.toLocaleString("fr-FR")}
									</td>
									<td className="p-2 font-mono text-xs text-dbz-yellow">
										{r.roleId}
									</td>
									<td className="p-2 text-right font-mono text-dbz-yellow">
										{r.zeniBonus.toLocaleString("fr-FR")} ¥
									</td>
									<td className="p-2">
										{r.bannerUrl ? (
											/* eslint-disable-next-line @next/next/no-img-element */
											<img
												src={`/${r.bannerUrl.replace(/^assets\//, "")}`}
												alt=""
												className="w-32 h-12 object-cover border border-dbz-border"
												loading="lazy"
											/>
										) : (
											<span className="text-gray-600 text-xs italic">—</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-4">
					Distribution
				</h2>
				<div className="dbz-panel p-4 space-y-2">
					{dist.distribution.map((d) => (
						<div key={d.level} className="flex items-center gap-3">
							<span className="font-saiyan text-lg text-dbz-orange w-8 text-right">
								{d.level}
							</span>
							<div className="flex-1 bg-dbz-bg border border-dbz-border h-6 relative">
								<div
									className="absolute inset-y-0 left-0 bg-dbz-orange/60"
									style={{ width: `${(d.count / maxCount) * 100}%` }}
								/>
							</div>
							<span className="font-mono text-sm text-gray-300 w-16 text-right">
								{d.count}
							</span>
						</div>
					))}
					{dist.distribution.length === 0 && (
						<p className="text-center text-gray-500 font-saiyan uppercase">
							Pas de data
						</p>
					)}
				</div>
			</section>
		</div>
	);
}
