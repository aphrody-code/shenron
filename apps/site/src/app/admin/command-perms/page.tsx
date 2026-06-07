import { botAdmin } from "@/lib/bot-admin";
import { PermCreateForm, PermDeleteButton } from "./PermForms";

export const dynamic = "force-dynamic";

export default async function AdminCommandPermsPage() {
	const data = await botAdmin.commandPerms.list().catch(() => ({ rows: [] }));

	return (
		<div className="w-full max-w-5xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">PERMISSIONS FINES</h1>
				<p className="text-sm text-zinc-300 mb-1">
					Règles avancées d'accès aux commandes Discord, stockées en base de données. Chaque règle
					précise si un rôle ou un utilisateur peut (ALLOW) ou ne peut pas (DENY) utiliser une
					commande. Plus spécifique qu'une règle de groupe, elle prime sur les réglages généraux.
				</p>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{data.rows.length} règle{data.rows.length > 1 ? "s" : ""} · hiérarchie : commande exacte
					&gt; groupe * &gt; joker global *
				</p>
			</header>

			<PermCreateForm />

			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[700px] text-xs">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							{["Commande", "Portée", "Cible (rôle / utilisateur)", "Autorisation", ""].map((h) => (
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
								<td className="p-2 text-white/70">
									{r.roleId
										? `Rôle ${r.roleId}`
										: r.userId
											? `Utilisateur ${r.userId}`
											: "Tout le monde"}
								</td>
								<td className="p-2">
									{r.allow ? (
										<span className="text-green-300 font-bold">AUTORISÉ</span>
									) : (
										<span className="text-red-300 font-bold">INTERDIT</span>
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
									Aucune règle fine définie. Les protections par défaut s'appliquent (gardes Admin /
									Modérateur / Propriétaire).
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
