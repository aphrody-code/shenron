import { botAdmin } from "@/lib/bot-admin";
import Link from "next/link";

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

type DiscordEntry = {
	id?: string;
	action_type?: number;
	user_id?: string;
	target_id?: string;
	reason?: string | null;
	[k: string]: unknown;
};

const DISCORD_ACTION_TYPES: Record<number, string> = {
	1: "GUILD_UPDATE",
	10: "CHANNEL_CREATE",
	11: "CHANNEL_UPDATE",
	12: "CHANNEL_DELETE",
	20: "MEMBER_KICK",
	21: "MEMBER_PRUNE",
	22: "MEMBER_BAN_ADD",
	23: "MEMBER_BAN_REMOVE",
	24: "MEMBER_UPDATE",
	25: "MEMBER_ROLE_UPDATE",
	28: "MEMBER_DISCONNECT",
	30: "ROLE_CREATE",
	31: "ROLE_UPDATE",
	32: "ROLE_DELETE",
	72: "MESSAGE_DELETE",
};

export default async function AdminAuditPage({
	searchParams,
}: {
	searchParams: Promise<{ source?: string; page?: string }>;
}) {
	const sp = await searchParams;
	const source = sp.source === "discord" ? "discord" : "local";
	const page = Math.max(0, Number(sp.page) || 0);
	const limit = 50;

	let localLogs: AuditLog[] = [];
	let discordLogs: DiscordEntry[] = [];
	let total = 0;

	if (source === "local") {
		const data = await botAdmin
			.auditLogs(limit, page * limit)
			.catch(() => ({ logs: [], total: 0 }));
		localLogs = (data.logs ?? []) as AuditLog[];
		total = data.total ?? localLogs.length;
	} else {
		const data = await botAdmin
			.auditDiscord(limit)
			.catch(() => ({ audit_logs: [], entries: [] }));
		discordLogs = (data.audit_logs ?? data.entries ?? []) as DiscordEntry[];
		total = discordLogs.length;
	}

	const totalPages = Math.max(1, Math.ceil(total / limit));

	return (
		<div className="w-full max-w-6xl mx-auto">
			<header className="mb-6 flex items-end justify-between flex-wrap gap-4">
				<div>
					<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
						AUDIT LOGS
					</h1>
					<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
						{source === "local"
							? "Action logs internes bot"
							: "Audit Discord natif"}{" "}
						· page {page + 1}/{totalPages} · {total} entrées
					</p>
				</div>
				<div className="flex gap-2 text-xs">
					<Link
						href="?source=local"
						className={`px-3 py-1.5 border rounded ${
							source === "local"
								? "border-fuchsia-400 bg-fuchsia-500/20 text-white"
								: "border-dbz-border hover:border-fuchsia-400 text-white/60"
						}`}
					>
						LOCAL
					</Link>
					<Link
						href="?source=discord"
						className={`px-3 py-1.5 border rounded ${
							source === "discord"
								? "border-cyan-400 bg-cyan-500/20 text-white"
								: "border-dbz-border hover:border-cyan-400 text-white/60"
						}`}
					>
						DISCORD
					</Link>
				</div>
			</header>

			<div className="dbz-panel overflow-x-auto mb-4">
				{source === "local" ? (
					<table className="w-full min-w-[700px] text-xs">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								{[
									"Type",
									"Action",
									"Cible",
									"Modérateur",
									"Raison",
									"Date",
								].map((h, i) => (
									<th
										key={h}
										className={`p-2 ${i === 5 ? "text-right" : "text-left"} font-bold uppercase tracking-widest text-dbz-blue-light`}
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border">
							{localLogs.map((l, i) => (
								<tr key={l.id ?? i} className="hover:bg-dbz-blue-light/5">
									<td className="p-2 font-mono text-dbz-yellow">
										{l.type ?? "—"}
									</td>
									<td className="p-2 font-mono text-fuchsia-300">
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
									<td className="p-2 text-right font-mono text-white/40">
										{l.createdAt
											? new Date(l.createdAt).toLocaleString("fr-FR")
											: "—"}
									</td>
								</tr>
							))}
							{localLogs.length === 0 && (
								<tr>
									<td colSpan={6} className="p-8 text-center text-white/50">
										Aucun log
									</td>
								</tr>
							)}
						</tbody>
					</table>
				) : (
					<table className="w-full min-w-[700px] text-xs">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								{["Action", "User", "Target", "Reason"].map((h) => (
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
							{discordLogs.map((l, i) => (
								<tr key={l.id ?? i} className="hover:bg-dbz-blue-light/5">
									<td className="p-2 font-mono text-cyan-300">
										{l.action_type !== undefined
											? (DISCORD_ACTION_TYPES[l.action_type] ??
												`TYPE_${l.action_type}`)
											: "—"}
									</td>
									<td className="p-2 font-mono text-gray-300">
										{l.user_id ?? "—"}
									</td>
									<td className="p-2 font-mono text-gray-300">
										{l.target_id ?? "—"}
									</td>
									<td className="p-2 text-gray-400 max-w-md truncate">
										{l.reason ?? "—"}
									</td>
								</tr>
							))}
							{discordLogs.length === 0 && (
								<tr>
									<td colSpan={4} className="p-8 text-center text-white/50">
										Aucun audit Discord
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</div>

			{source === "local" && totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 text-xs">
					{page > 0 && (
						<Link
							href={`?source=local&page=${page - 1}`}
							className="dbz-button-ghost !text-[10px] !py-1 !px-3"
						>
							← Préc
						</Link>
					)}
					<span className="text-white/50">
						{page + 1} / {totalPages}
					</span>
					{page < totalPages - 1 && (
						<Link
							href={`?source=local&page=${page + 1}`}
							className="dbz-button-ghost !text-[10px] !py-1 !px-3"
						>
							Suiv →
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
