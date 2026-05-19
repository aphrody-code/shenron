import { botAdmin } from "@/lib/bot-admin";
import { CronTriggerButton } from "./trigger-button";
import { CronIntervalEditor } from "./IntervalEditor";

export const dynamic = "force-dynamic";

function fmtMs(ms: number | null): string {
	if (!ms) return "—";
	if (ms < 1000) return `${ms}ms`;
	return `${(ms / 1000).toFixed(2)}s`;
}

function fmtDate(ts: number | null): string {
	if (!ts) return "—";
	const d = new Date(ts);
	const diff = (Date.now() - ts) / 1000;
	if (Math.abs(diff) < 60) return `il y a ${Math.abs(diff).toFixed(0)}s`;
	if (Math.abs(diff) < 3600)
		return `il y a ${(Math.abs(diff) / 60).toFixed(0)}min`;
	return d.toLocaleString("fr-FR");
}

export default async function AdminCron() {
	const { jobs } = await botAdmin.cron().catch(() => ({ jobs: [] }));

	return (
		<div className="w-full max-w-6xl mx-auto">
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-8">CRON JOBS</h1>

			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[700px]">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							<th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
								Job
							</th>
							<th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
								Interval
							</th>
							<th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
								Last run
							</th>
							<th className="p-4 text-right text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
								Durée
							</th>
							<th className="p-4 text-right text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
								#
							</th>
							<th className="p-4 text-center text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
								Trigger
							</th>
						</tr>
					</thead>
					<tbody className="divide-y-2 divide-dbz-border">
						{jobs.map((j) => (
							<tr key={j.name} className="hover:bg-dbz-blue-light/10">
								<td className="p-4 font-mono text-sm text-white">{j.name}</td>
								<td className="p-4 text-sm text-dbz-yellow">
									<CronIntervalEditor name={j.name} intervalMs={j.intervalMs} />
								</td>
								<td className="p-4 text-sm text-gray-300">
									{fmtDate(j.lastRunAt)}
								</td>
								<td className="p-4 text-right text-sm font-mono text-dbz-orange">
									{fmtMs(j.lastDurationMs)}
								</td>
								<td className="p-4 text-right text-sm font-mono text-dbz-blue-light">
									{j.runCount}
								</td>
								<td className="p-4 text-center">
									<CronTriggerButton name={j.name} />
								</td>
							</tr>
						))}
						{jobs.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className="p-8 text-center text-gray-500 font-saiyan uppercase"
								>
									Aucun cron job
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
