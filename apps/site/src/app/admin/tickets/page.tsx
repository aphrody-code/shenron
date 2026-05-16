import { botAdmin } from "@/lib/bot-admin";
export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
	const data = await botAdmin.tickets().catch(() => ({ tickets: [] }));
	const open = data.tickets.filter((t) => !t.closed);
	const closed = data.tickets.filter((t) => t.closed);
	return (
		<div className="w-full max-w-5xl mx-auto space-y-8">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">TICKETS</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{open.length} ouverts · {closed.length} fermés
				</p>
			</header>
			{[
				{ title: "Ouverts", list: open, c: "text-green-400 border-green-400" },
				{ title: "Fermés", list: closed, c: "text-gray-500 border-dbz-border" },
			].map((s) => (
				<section key={s.title}>
					<h2
						className={`text-xl font-saiyan uppercase mb-3 border-b-2 pb-2 ${s.c}`}
					>
						{s.title} ({s.list.length})
					</h2>
					<div className="dbz-panel overflow-x-auto">
						<table className="w-full min-w-[500px] text-xs">
							<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
								<tr>
									<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
										#
									</th>
									<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
										Kind
									</th>
									<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
										Owner
									</th>
									<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
										Channel
									</th>
									<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
										Créé
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-dbz-border">
								{s.list.map((t) => (
									<tr key={t.id} className="hover:bg-dbz-blue-light/5">
										<td className="p-2 font-mono text-gray-500">#{t.id}</td>
										<td className="p-2 font-saiyan text-dbz-yellow uppercase">
											{t.kind}
										</td>
										<td className="p-2 font-mono text-dbz-orange">
											{t.ownerId}
										</td>
										<td className="p-2 font-mono text-gray-300">
											{t.channelId}
										</td>
										<td className="p-2 text-right text-gray-500">
											{new Date(t.createdAt).toLocaleString("fr-FR")}
										</td>
									</tr>
								))}
								{s.list.length === 0 && (
									<tr>
										<td
											colSpan={5}
											className="p-4 text-center text-gray-500 font-saiyan uppercase"
										>
											aucun
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</section>
			))}
		</div>
	);
}
