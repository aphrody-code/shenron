import { botAdmin } from "@/lib/bot-admin";
import { PermCreateForm, PermDeleteButton } from "./PermForms";

export const dynamic = "force-dynamic";

export default async function AdminCommandPermsPage() {
	const data = await botAdmin.commandPerms.list().catch(() => ({ rows: [] }));

	return (
		<div className="w-full max-w-5xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					COMMAND PERMS ❯ RBAC
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{data.rows.length} règles · permissions fines slash commands (table
					command_permissions)
				</p>
			</header>

			<PermCreateForm />

			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[700px] text-xs">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							{["Command", "Scope", "Cible", "Allow/Deny", ""].map((h) => (
								<th
									key={h}
									className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-dbz-border">
						{data.rows.map((r, i) => (
							<tr key={i} className="hover:bg-dbz-blue-light/5">
								<td className="p-2 font-mono text-fuchsia-300">/{r.command}</td>
								<td className="p-2 font-mono text-cyan-300">{r.scope}</td>
								<td className="p-2 font-mono text-white/70">
									{r.roleId
										? `role ${r.roleId}`
										: r.userId
											? `user ${r.userId}`
											: "global"}
								</td>
								<td className="p-2">
									{r.allow ? (
										<span className="text-green-300 font-bold">ALLOW</span>
									) : (
										<span className="text-red-300 font-bold">DENY</span>
									)}
								</td>
								<td className="p-2 text-right">
									<PermDeleteButton
										command={r.command}
										scope={r.scope}
										roleId={r.roleId}
										userId={r.userId}
									/>
								</td>
							</tr>
						))}
						{data.rows.length === 0 && (
							<tr>
								<td colSpan={5} className="p-6 text-center text-white/50">
									Aucune règle · les permissions par défaut s'appliquent (guards
									Admin/Mod/Owner).
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
