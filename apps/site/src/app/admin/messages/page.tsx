import { botAdmin } from "@/lib/bot-admin";
import { MessageEditor } from "./MessageEditor";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
	const data = await botAdmin.messages().catch(() => ({ events: [] }));
	return (
		<div className="w-full max-w-5xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					MESSAGES · TEMPLATES
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{data.events.length} events configurables (level-up, join, leave,
					daily quest…) · template editor + preview live
				</p>
			</header>
			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[700px] text-xs">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Event
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Channel
							</th>
							<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
								Template (extrait)
							</th>
							<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
								État
							</th>
							<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-dbz-border">
						{data.events.map((e) => (
							<tr key={e.event} className="hover:bg-dbz-blue-light/5">
								<td className="p-2 font-mono text-fuchsia-300">{e.event}</td>
								<td className="p-2 font-mono text-cyan-300 text-[10px]">
									{e.channelKey ?? e.channelId ?? "—"}
								</td>
								<td className="p-2 text-white/70 text-[10px] max-w-md truncate">
									{e.template ? (
										e.template.slice(0, 80) +
										(e.template.length > 80 ? "…" : "")
									) : (
										<span className="text-white/30 italic">défaut</span>
									)}
								</td>
								<td className="p-2 text-right">
									{e.enabled ? (
										<span className="text-green-400">●</span>
									) : (
										<span className="text-red-400">○</span>
									)}
								</td>
								<td className="p-2 text-right">
									<MessageEditor
										event={e.event}
										initial={{
											template: e.template ?? null,
											channelKey: e.channelKey ?? null,
											enabled: e.enabled,
										}}
									/>
								</td>
							</tr>
						))}
						{data.events.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className="p-6 text-center text-white/50 font-saiyan uppercase"
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
