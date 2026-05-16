import { botAdmin } from "@/lib/bot-admin";
import {
	WebhookCreateForm,
	WebhookDeleteButton,
	WebhookExecuteModal,
} from "./WebhookForms";

export const dynamic = "force-dynamic";

export default async function AdminWebhooksPage() {
	const data = await botAdmin.webhooks().catch(() => ({ webhooks: [] }));
	return (
		<div className="w-full max-w-5xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					WEBHOOKS · CRUD
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{data.webhooks.length} webhooks · create / delete / execute
				</p>
			</header>

			<WebhookCreateForm />

			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[600px] text-xs">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Nom
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Channel
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								ID
							</th>
							<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-dbz-border">
						{data.webhooks.map((w) => (
							<tr key={w.id} className="hover:bg-dbz-blue-light/5">
								<td className="p-2 font-saiyan text-dbz-yellow">{w.name}</td>
								<td className="p-2 font-mono text-fuchsia-200">
									{w.channelId}
								</td>
								<td className="p-2 font-mono text-white/40">{w.id}</td>
								<td className="p-2 text-right">
									<div className="flex gap-2 justify-end">
										{w.url && <WebhookExecuteModal url={w.url} />}
										<WebhookDeleteButton id={w.id} />
									</div>
								</td>
							</tr>
						))}
						{data.webhooks.length === 0 && (
							<tr>
								<td
									colSpan={4}
									className="p-6 text-center text-white/50 font-saiyan uppercase"
								>
									Aucun webhook configuré
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
