import { getShenronLeaderboard } from "@/lib/shenron";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function LeaderboardPage() {
	const entries = await getShenronLeaderboard(100, true);

	return (
		<div className="container mx-auto px-4 py-12 max-w-4xl">
			<header className="text-center mb-12">
				<h1
					className="text-5xl md:text-7xl text-dbz-yellow mb-4"
					style={{ textShadow: "4px 4px 0px rgba(168, 85, 247, 0.6), 0 0 24px rgba(56, 189, 248, 0.3)" }}
				>
					CLASSEMENT
				</h1>
				<p className="text-dbz-blue-light font-bold tracking-widest uppercase">
					Top 100 guerriers du serveur · XP cumulé
				</p>
			</header>

			{entries.length === 0 ? (
				<div className="dbz-panel p-8 text-center">
					<p className="text-2xl font-saiyan text-dbz-orange uppercase">
						Aucune donnée encore. Reviens après avoir discuté !
					</p>
				</div>
			) : (
				<div className="dbz-panel overflow-hidden">
					<table className="w-full">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Rang
								</th>
								<th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Guerrier
								</th>
								<th className="p-4 text-right text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Niv
								</th>
								<th className="p-4 text-right text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									XP
								</th>
								<th className="hidden md:table-cell p-4 text-right text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Zéni
								</th>
							</tr>
						</thead>
						<tbody className="divide-y-2 divide-dbz-border">
							{entries.map((e) => (
								<tr
									key={e.discordId}
									className={`hover:bg-dbz-blue-light/10 transition-colors ${e.rank <= 3 ? "bg-dbz-yellow/5" : ""}`}
								>
									<td className="p-4 font-saiyan text-2xl">
										<span
											className={
												e.rank === 1
													? "text-dbz-yellow"
													: e.rank === 2
														? "text-gray-300"
														: e.rank === 3
															? "text-dbz-orange"
															: "text-dbz-blue-light"
											}
										>
											#{e.rank}
										</span>
									</td>
									<td className="p-4">
										<a
											href={`/profil/${e.discordId}`}
											className="flex items-center gap-3 group"
										>
											{e.avatarUrl && (
												<img
													src={e.avatarUrl}
													alt=""
													className="w-10 h-10 rounded-none border-2 border-dbz-border group-hover:border-dbz-orange transition-colors"
												/>
											)}
											<span className="font-bold text-white group-hover:text-dbz-orange transition-colors">
												{e.username ?? `Guerrier ${e.discordId.slice(-4)}`}
											</span>
										</a>
									</td>
									<td className="p-4 text-right font-saiyan text-xl text-dbz-orange">
										{e.level}
									</td>
									<td className="p-4 text-right font-mono text-sm text-gray-300">
										{e.xp.toLocaleString("fr-FR")}
									</td>
									<td className="hidden md:table-cell p-4 text-right font-mono text-sm text-dbz-yellow">
										{e.zeni.toLocaleString("fr-FR")} ¥
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
