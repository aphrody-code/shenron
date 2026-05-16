import { botAdmin } from "@/lib/bot-admin";

export const dynamic = "force-dynamic";

type Channel = { id: string; name: string; type: number; parentId?: string };
type Role = {
	id: string;
	name: string;
	color: number;
	hexColor?: string;
	position: number;
	managed: boolean;
	memberCount?: number;
};

const CHANNEL_TYPES: Record<number, { label: string; icon: string }> = {
	0: { label: "TEXT", icon: "💬" },
	2: { label: "VOICE", icon: "🔊" },
	4: { label: "CATEGORY", icon: "📁" },
	5: { label: "ANNOUNCE", icon: "📢" },
	13: { label: "STAGE", icon: "🎙️" },
	15: { label: "FORUM", icon: "💭" },
};

export default async function AdminDiscordPage() {
	const [channelsData, rolesData] = await Promise.all([
		botAdmin.discord.channels().catch(() => ({ channels: [] })),
		botAdmin
			.bots()
			.then(() => botAdmin.roles("shenron"))
			.catch(() => ({ roles: [] })),
	]);
	const channels = channelsData.channels as Channel[];
	const roles = (rolesData.roles ?? []) as Role[];

	const groupedChannels = channels.reduce<Record<number, Channel[]>>(
		(acc, c) => {
			(acc[c.type] ??= []).push(c);
			return acc;
		},
		{},
	);

	return (
		<div className="w-full max-w-6xl mx-auto space-y-10">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">DISCORD</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					Vue live de la guild · {channels.length} salons · {roles.length} rôles
				</p>
			</header>

			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-4">
					Salons ({channels.length})
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{Object.entries(groupedChannels)
						.sort((a, b) => Number(a[0]) - Number(b[0]))
						.map(([type, list]) => {
							const meta = CHANNEL_TYPES[Number(type)] ?? {
								label: `TYPE ${type}`,
								icon: "📄",
							};
							return (
								<div key={type} className="dbz-panel p-4">
									<h3 className="font-saiyan text-lg text-dbz-blue-light mb-2 uppercase">
										{meta.icon} {meta.label} ({list.length})
									</h3>
									<ul className="space-y-1 text-xs">
										{list.map((c) => (
											<li key={c.id} className="flex justify-between font-mono">
												<span className="text-white">{c.name}</span>
												<span className="text-gray-600">{c.id}</span>
											</li>
										))}
									</ul>
								</div>
							);
						})}
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-4">
					Rôles ({roles.length})
				</h2>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[500px]">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Pos
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Nom
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Couleur
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									ID
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Flags
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border">
							{[...roles]
								.sort((a, b) => b.position - a.position)
								.map((r) => (
									<tr key={r.id} className="hover:bg-dbz-blue-light/5">
										<td className="p-2 font-mono text-xs text-gray-500">
											{r.position}
										</td>
										<td className="p-2">
											<span
												className="font-bold"
												style={{
													color:
														r.color !== 0
															? `#${r.color.toString(16).padStart(6, "0")}`
															: undefined,
												}}
											>
												{r.name}
											</span>
										</td>
										<td className="p-2 flex items-center gap-2">
											<span
												className="w-4 h-4 border border-dbz-border"
												style={{
													backgroundColor:
														r.color !== 0
															? `#${r.color.toString(16).padStart(6, "0")}`
															: "transparent",
												}}
											/>
											<code className="text-[10px] font-mono text-gray-400">
												{r.hexColor ??
													`#${r.color.toString(16).padStart(6, "0")}`}
											</code>
										</td>
										<td className="p-2 font-mono text-[10px] text-gray-600">
											{r.id}
										</td>
										<td className="p-2 text-[10px] text-dbz-orange">
											{r.managed ? "MANAGED" : ""}
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
