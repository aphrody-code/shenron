import { botAdmin } from "@/lib/bot-admin";
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
	const data = await botAdmin.messages().catch(() => ({ events: [] }));
	return (
		<div className="w-full max-w-5xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">MESSAGES</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{data.events.length} events configurables (level-up, join, leave,
					daily quest…)
				</p>
			</header>
			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[500px] text-xs">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Event
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Activé
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Channel
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-dbz-border">
						{data.events.map((e) => (
							<tr key={e.event} className="hover:bg-dbz-blue-light/5">
								<td className="p-2 font-saiyan text-dbz-yellow uppercase">
									{e.event}
								</td>
								<td className="p-2">
									{e.enabled ? (
										<span className="text-green-400">●</span>
									) : (
										<span className="text-red-400">○</span>
									)}
								</td>
								<td className="p-2 font-mono text-gray-300">
									{e.channelId ?? "—"}
								</td>
							</tr>
						))}
						{data.events.length === 0 && (
							<tr>
								<td
									colSpan={3}
									className="p-6 text-center text-gray-500 font-saiyan uppercase"
								>
									Aucun event
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
