import { botAdmin } from "@/lib/bot-admin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
	const data = await botAdmin.settings().catch(() => ({ schema: [] }));
	return (
		<div className="w-full max-w-5xl mx-auto">
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">SETTINGS</h1>
			<p className="text-xs text-dbz-blue-light uppercase tracking-widest mb-6">
				{data.schema.length} clés runtime overridables (table guild_settings,
				cache 30s)
			</p>
			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[600px] text-xs">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Clé
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Type
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Default
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Courant
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Description
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-dbz-border">
						{data.schema.map((s) => (
							<tr key={s.key} className="hover:bg-dbz-blue-light/5">
								<td className="p-2 font-mono text-dbz-orange">{s.key}</td>
								<td className="p-2 text-dbz-yellow text-[10px] uppercase">
									{s.type}
								</td>
								<td className="p-2 font-mono text-gray-500">
									{JSON.stringify(s.default)}
								</td>
								<td className="p-2 font-mono text-white">
									{JSON.stringify(s.current)}
								</td>
								<td className="p-2 text-gray-400">{s.description ?? "—"}</td>
							</tr>
						))}
						{data.schema.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className="p-8 text-center text-gray-500 font-saiyan uppercase"
								>
									Aucun setting
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<p className="mt-4 text-xs text-gray-500 text-center">
				Édition via Discord{" "}
				<code className="text-dbz-orange">
					/config set &lt;key&gt; &lt;value&gt;
				</code>
			</p>
		</div>
	);
}
