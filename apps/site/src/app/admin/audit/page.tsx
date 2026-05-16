import { botAdmin } from "@/lib/bot-admin";

export const dynamic = "force-dynamic";

type AuditLog = {
	id?: number;
	type?: string;
	userId?: string;
	moderatorId?: string;
	target?: string;
	action?: string;
	reason?: string;
	createdAt?: number;
	[k: string]: unknown;
};

export default async function AdminAuditPage() {
	const data = await botAdmin.auditLogs(100).catch(() => ({ logs: [] }));
	const logs = (data.logs ?? []) as AuditLog[];

	return (
		<div className="w-full max-w-6xl mx-auto">
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">AUDIT LOGS</h1>
			<p className="text-xs text-dbz-blue-light uppercase tracking-widest mb-6">
				{logs.length} dernières actions modération + admin
			</p>

			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[700px] text-xs">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Type
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Action
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Cible
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Modérateur
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
						{logs.map((l, i) => (
							<tr key={l.id ?? i} className="hover:bg-dbz-blue-light/5">
								<td className="p-2 font-mono text-dbz-yellow">
									{l.type ?? "—"}
								</td>
								<td className="p-2 font-mono text-dbz-orange">
									{l.action ?? "—"}
								</td>
								<td className="p-2 font-mono text-gray-300">
									{l.target ?? l.userId ?? "—"}
								</td>
								<td className="p-2 font-mono text-gray-300">
									{l.moderatorId ?? "—"}
								</td>
								<td className="p-2 text-gray-400 max-w-xs truncate">
									{l.reason ?? "—"}
								</td>
								<td className="p-2 text-right font-mono text-gray-500">
									{l.createdAt
										? new Date(l.createdAt).toLocaleString("fr-FR")
										: "—"}
								</td>
							</tr>
						))}
						{logs.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className="p-8 text-center text-gray-500 font-saiyan uppercase"
								>
									Aucun log
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
