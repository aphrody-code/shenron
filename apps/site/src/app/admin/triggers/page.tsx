import { botAdmin } from "@/lib/bot-admin";
export const dynamic = "force-dynamic";

type Trigger = {
	id: number;
	pattern: string;
	reply: string;
	enabled: number;
	[k: string]: unknown;
};

export default async function AdminTriggersPage() {
	const data = await botAdmin
		.table("triggers", 100, 0)
		.catch(() => ({ rows: [], total: 0, columns: [] }));
	const triggers = (data.rows ?? []) as Trigger[];
	return (
		<div className="w-full max-w-5xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">TRIGGERS</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{triggers.length} triggers regex → reply auto
				</p>
			</header>
			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[500px] text-xs">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								#
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Pattern regex
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Reply
							</th>
							<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
								Actif
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-dbz-border">
						{triggers.map((t) => (
							<tr key={t.id} className="hover:bg-dbz-blue-light/5">
								<td className="p-2 font-mono text-gray-500">#{t.id}</td>
								<td className="p-2 font-mono text-dbz-orange max-w-xs truncate">
									{t.pattern}
								</td>
								<td className="p-2 text-gray-300 max-w-md truncate">
									{t.reply}
								</td>
								<td className="p-2 text-right">
									{t.enabled ? (
										<span className="text-green-400">●</span>
									) : (
										<span className="text-red-400">○</span>
									)}
								</td>
							</tr>
						))}
						{triggers.length === 0 && (
							<tr>
								<td
									colSpan={4}
									className="p-6 text-center text-gray-500 font-saiyan uppercase"
								>
									Aucun trigger
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
