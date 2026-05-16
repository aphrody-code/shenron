import { botAdmin } from "@/lib/bot-admin";

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

export default async function AdminEconomy() {
	const data = await botAdmin.economyLeaderboard(100).catch(() => null);
	const entries = (data?.leaderboard ?? []) as LBEntry[];

	return (
		<div className="w-full max-w-6xl mx-auto">
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-8">ECONOMY</h1>

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
					<tbody className="divide-y-2 divide-dbz-border">
						{entries.map((e, i) => (
							<tr key={e.discordId} className="hover:bg-dbz-blue-light/10">
								<td className="p-3 font-saiyan text-dbz-blue-light">
									{e.rank ?? i + 1}
								</td>
								<td className="p-3">
									<div className="flex items-center gap-2">
										{e.avatarUrl && (
											<img
												src={e.avatarUrl}
												alt=""
												className="w-6 h-6 rounded-none border border-dbz-border"
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
						{entries.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className="p-8 text-center text-gray-500 font-saiyan uppercase"
								>
									Aucune donnée économique
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
