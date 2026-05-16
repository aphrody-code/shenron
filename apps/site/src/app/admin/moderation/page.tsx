import { botAdmin } from "@/lib/bot-admin";
import {
	DeleteWarnButton,
	ClearWarnsButton,
	UnjailButton,
} from "./ModerationButtons";

export const dynamic = "force-dynamic";

export default async function AdminModerationPage() {
	const [stats, warns, jails] = await Promise.all([
		botAdmin.moderation
			.stats()
			.catch(() => ({ warns: 0, jails: 0, bans: 0, kicks: 0, mutes: 0 })),
		botAdmin.moderation.warns().catch(() => ({ warns: [] })),
		botAdmin.moderation.jails().catch(() => ({ jails: [] })),
	]);

	const counters = [
		{ k: "warns", v: stats.warns, c: "text-dbz-yellow" },
		{ k: "jails", v: stats.jails, c: "text-red-400" },
		{ k: "bans", v: stats.bans, c: "text-red-500" },
		{ k: "kicks", v: stats.kicks, c: "text-orange-400" },
		{ k: "mutes", v: stats.mutes, c: "text-purple-400" },
	];

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					MODERATION
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					Stats globales + warns actifs + jails en cours
				</p>
			</header>

			<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
				{counters.map((c) => (
					<div key={c.k} className="dbz-panel p-4 text-center">
						<div className={`text-4xl font-saiyan ${c.c}`}>{c.v}</div>
						<div className="text-xs uppercase tracking-widest text-dbz-blue-light mt-1">
							{c.k}
						</div>
					</div>
				))}
			</div>

			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-3">
					Warns ({warns.warns.length})
				</h2>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[500px] text-xs">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									User
								</th>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									Mod
								</th>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									Raison
								</th>
								<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
									Date
								</th>
								<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
									Actif
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border">
							{warns.warns.map((w) => (
								<tr key={w.id} className="hover:bg-dbz-blue-light/5">
									<td className="p-2 font-mono text-dbz-yellow">{w.userId}</td>
									<td className="p-2 font-mono text-gray-300">
										{w.moderatorId}
									</td>
									<td className="p-2 text-gray-300 max-w-xs truncate">
										{w.reason ?? "—"}
									</td>
									<td className="p-2 text-right text-gray-500">
										{new Date(w.createdAt).toLocaleString("fr-FR")}
									</td>
									<td className="p-2 text-right">
										<div className="flex justify-end gap-1">
											{w.active ? (
												<DeleteWarnButton id={w.id} />
											) : (
												<span className="text-white/30">✗</span>
											)}
											<ClearWarnsButton userId={w.userId} />
										</div>
									</td>
								</tr>
							))}
							{warns.warns.length === 0 && (
								<tr>
									<td
										colSpan={5}
										className="p-4 text-center text-gray-500 font-saiyan uppercase"
									>
										Aucun warn
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-3">
					Jails ({jails.jails.length})
				</h2>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[500px] text-xs">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									User
								</th>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									Mod
								</th>
								<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
									Raison
								</th>
								<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
									Expire
								</th>
								<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
									État
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border">
							{jails.jails.map((j) => (
								<tr key={j.id} className="hover:bg-dbz-blue-light/5">
									<td className="p-2 font-mono text-dbz-yellow">{j.userId}</td>
									<td className="p-2 font-mono text-gray-300">
										{j.moderatorId}
									</td>
									<td className="p-2 text-gray-300 max-w-xs truncate">
										{j.reason ?? "—"}
									</td>
									<td className="p-2 text-right text-gray-500">
										{j.expiresAt
											? new Date(j.expiresAt).toLocaleString("fr-FR")
											: "permanent"}
									</td>
									<td className="p-2 text-right text-xs">
										{j.releasedAt ? (
											<span className="text-white/30">released</span>
										) : (
											<UnjailButton userId={j.userId} />
										)}
									</td>
								</tr>
							))}
							{jails.jails.length === 0 && (
								<tr>
									<td
										colSpan={5}
										className="p-4 text-center text-gray-500 font-saiyan uppercase"
									>
										Aucune jail
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
