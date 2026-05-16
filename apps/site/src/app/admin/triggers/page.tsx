import { botAdmin } from "@/lib/bot-admin";
import {
	TriggerCreateForm,
	TriggerRowActions,
	RegexTester,
} from "./TriggerForms";

export const dynamic = "force-dynamic";

type Trigger = {
	code: string;
	description: string | null;
	pattern: string;
	flags: string | null;
	enabled: boolean;
};

export default async function AdminTriggersPage() {
	const data = await botAdmin.triggers
		.list()
		.catch(() => ({ rows: [] as Trigger[] }));
	const rows = data.rows as Trigger[];

	return (
		<div className="w-full max-w-5xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					TRIGGERS · ACHIEVEMENTS
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{rows.length} patterns regex → succès auto-attribués
				</p>
			</header>

			<RegexTester />
			<TriggerCreateForm />

			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[700px] text-xs">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Code
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Pattern
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Flags
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Description
							</th>
							<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-dbz-border">
						{rows.map((t) => (
							<tr key={t.code} className="hover:bg-dbz-blue-light/5">
								<td className="p-2 font-mono text-dbz-orange">{t.code}</td>
								<td className="p-2 font-mono text-fuchsia-200 break-all max-w-md">
									{t.pattern}
								</td>
								<td className="p-2 font-mono text-cyan-300">
									{t.flags ?? "i"}
								</td>
								<td className="p-2 text-white/70 text-[10px]">
									{t.description ?? "—"}
								</td>
								<td className="p-2 text-right">
									<TriggerRowActions code={t.code} enabled={t.enabled} />
								</td>
							</tr>
						))}
						{rows.length === 0 && (
							<tr>
								<td colSpan={5} className="p-6 text-center text-white/50">
									Aucun trigger configuré.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
