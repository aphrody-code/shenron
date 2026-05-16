import { botAdmin } from "@/lib/bot-admin";
import { LogsAutoRefresh } from "./LogsAutoRefresh";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage({
	searchParams,
}: {
	searchParams: Promise<{ lines?: string }>;
}) {
	const sp = await searchParams;
	const lines = Math.min(500, Math.max(10, Number(sp.lines) || 100));
	const data = await botAdmin
		.healthLogs(lines)
		.catch(() => ({ logs: [], count: 0 }));

	return (
		<div className="w-full max-w-6xl mx-auto">
			<header className="mb-6 flex items-end justify-between gap-4 flex-wrap">
				<div>
					<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
						JOURNALCTL ❯ SHENRON
					</h1>
					<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
						{data.count} lignes · service systemd · refresh auto 10s
					</p>
				</div>
				<form className="flex items-center gap-2 text-xs">
					<label className="font-scouter tracking-widest text-white/60">
						LIGNES
					</label>
					{[50, 100, 200, 500].map((n) => (
						<a
							key={n}
							href={`?lines=${n}`}
							className={`px-3 py-1.5 border rounded ${
								n === lines
									? "border-fuchsia-400 bg-fuchsia-500/20 text-white"
									: "border-dbz-border hover:border-fuchsia-400 text-white/60"
							}`}
						>
							{n}
						</a>
					))}
				</form>
			</header>

			<LogsAutoRefresh initial={data.logs} lines={lines} />
		</div>
	);
}
