import { botAdmin } from "@/lib/bot-admin";

export const dynamic = "force-dynamic";

type CmdRow = {
	name: string;
	description: string;
	type?: number;
	options?: Array<{
		name: string;
		description?: string;
		type?: number;
		required?: boolean;
	}>;
	default_member_permissions?: string | null;
	nsfw?: boolean;
};

type GuildRow = {
	id: string;
	name: string;
	memberCount?: number;
	joinedAt?: string;
};

export default async function AdminBotStatus() {
	const [health, expanded, guilds] = await Promise.all([
		botAdmin.health().catch(() => null),
		botAdmin
			.fetch<{ commands: CmdRow[]; count?: number }>(
				"/api/bot/commands/expanded",
				{
					revalidate: 60,
				},
			)
			.catch(() => ({ commands: [], count: 0 })),
		botAdmin
			.fetch<{ guilds: GuildRow[] }>("/api/bot/guilds", { revalidate: 60 })
			.catch(() => ({ guilds: [] })),
	]);

	const cmds = expanded.commands ?? [];

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8">
			<h1 className="text-4xl font-saiyan text-dbz-orange uppercase">
				BOT · STATUT DÉTAILLÉ
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="dbz-panel p-6">
					<p className="text-[10px] font-bold text-dbz-blue-light uppercase tracking-widest mb-2">
						État
					</p>
					<div className="flex items-center gap-3">
						<div
							className={`w-4 h-4 ${health?.online ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
						/>
						<span className="text-2xl font-saiyan text-white">
							{health?.online ? "OPÉRATIONNEL" : "HORS LIGNE"}
						</span>
					</div>
				</div>
				<div className="dbz-panel p-6">
					<p className="text-[10px] font-bold text-dbz-blue-light uppercase tracking-widest mb-2">
						Uptime
					</p>
					<p className="scouter-text text-2xl">
						{health
							? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m`
							: "—"}
					</p>
				</div>
				<div className="dbz-panel p-6">
					<p className="text-[10px] font-bold text-dbz-blue-light uppercase tracking-widest mb-2">
						Version
					</p>
					<p className="scouter-text text-2xl">
						{health?.version ? `v${health.version}` : "—"}
					</p>
				</div>
			</div>

			<section>
				<h2 className="text-2xl font-saiyan text-cyan-300 mb-3">
					🏛 Serveurs ({guilds.guilds.length})
				</h2>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[500px] text-xs">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									Nom
								</th>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									ID
								</th>
								<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
									Membres
								</th>
								<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
									Joint
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border">
							{guilds.guilds.map((g) => (
								<tr key={g.id} className="hover:bg-dbz-blue-light/5">
									<td className="p-2 text-white font-bold">{g.name}</td>
									<td className="p-2 font-mono text-white/40">{g.id}</td>
									<td className="p-2 text-right font-mono text-fuchsia-300">
										{g.memberCount?.toLocaleString("fr-FR") ?? "—"}
									</td>
									<td className="p-2 text-right text-white/40">
										{g.joinedAt
											? new Date(g.joinedAt).toLocaleDateString("fr-FR")
											: "—"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-saiyan text-fuchsia-300 mb-3">
					⚡ Commandes ({cmds.length})
				</h2>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[700px] text-xs">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									Nom
								</th>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									Description
								</th>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									Options
								</th>
								<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
									NSFW
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border">
							{cmds.map((c) => (
								<tr key={c.name} className="hover:bg-dbz-blue-light/5">
									<td className="p-2 font-mono text-dbz-orange">/{c.name}</td>
									<td className="p-2 text-white/70 max-w-md truncate">
										{c.description}
									</td>
									<td className="p-2 text-[10px]">
										{c.options && c.options.length > 0 ? (
											<div className="flex flex-wrap gap-1">
												{c.options.map((o) => (
													<span
														key={o.name}
														className={`px-1.5 py-0.5 rounded font-mono ${
															o.required
																? "bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/40"
																: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
														}`}
														title={o.description}
													>
														{o.name}
													</span>
												))}
											</div>
										) : (
											<span className="text-white/30">—</span>
										)}
									</td>
									<td className="p-2 text-right">
										{c.nsfw ? (
											<span className="text-red-400 text-[10px] font-bold">
												NSFW
											</span>
										) : (
											<span className="text-white/30">—</span>
										)}
									</td>
								</tr>
							))}
							{cmds.length === 0 && (
								<tr>
									<td colSpan={4} className="p-8 text-center text-white/50">
										Aucune commande
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
