import { botAdmin } from "@/lib/bot-admin";

export const dynamic = "force-dynamic";

export default async function AdminSyncPage() {
	const [cron, bots, stats] = await Promise.all([
		botAdmin.cron().catch(() => ({ jobs: [] })),
		botAdmin.bots().catch(() => ({ bots: [] })),
		botAdmin.stats().catch(() => null),
	]);

	const onlinePersonas = bots.bots.filter((b) => b.online).length;

	return (
		<div className="w-full max-w-5xl mx-auto space-y-8">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">SYNC</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					Architecture de synchronisation DB ↔ Discord ↔ Site
				</p>
			</header>

			{/* État global */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				<div className="dbz-panel p-4 text-center">
					<div className="text-3xl font-saiyan text-green-400">
						{onlinePersonas}/6
					</div>
					<div className="text-xs uppercase tracking-widest text-dbz-blue-light mt-1">
						Personas online
					</div>
				</div>
				<div className="dbz-panel p-4 text-center">
					<div className="text-3xl font-saiyan text-dbz-yellow">
						{stats?.users ?? "—"}
					</div>
					<div className="text-xs uppercase tracking-widest text-dbz-blue-light mt-1">
						Users en DB
					</div>
				</div>
				<div className="dbz-panel p-4 text-center">
					<div className="text-3xl font-saiyan text-dbz-orange">
						{cron.jobs.length}
					</div>
					<div className="text-xs uppercase tracking-widest text-dbz-blue-light mt-1">
						Cron jobs
					</div>
				</div>
				<div className="dbz-panel p-4 text-center">
					<div className="text-3xl font-saiyan text-pink-400">2</div>
					<div className="text-xs uppercase tracking-widest text-dbz-blue-light mt-1">
						Systemd timers
					</div>
				</div>
			</div>

			{/* Diagramme architecture */}
			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-3">
					Pipeline temps réel
				</h2>
				<div className="dbz-panel p-6 space-y-3 font-mono text-xs leading-relaxed">
					<div className="text-dbz-orange">▸ Discord guild events</div>
					<div className="pl-4 text-gray-300">
						<div>
							• guildMemberAdd → JoinLeave.onJoin →{" "}
							<span className="text-dbz-yellow">users.insert(id)</span> +
							invitesLog
						</div>
						<div>
							• guildMemberRemove → JoinLeave.onLeave →{" "}
							<span className="text-red-400">users.delete CASCADE</span>{" "}
							(xp/zeni/inventaire/succès)
						</div>
						<div>
							• guildMemberUpdate → re-derive lastLevelReached +
							currentLevelRoleId
						</div>
						<div>
							• messageCreate → MessageXP (Kaïo) → ensureUser + xp+= + ZÉNI
						</div>
						<div>• voiceStateUpdate → VoiceXP (Kaïo) tick 60s → +20 XP</div>
						<div>
							• presenceUpdate → BioRole (Grand Prêtre) → role URL-in-bio
						</div>
					</div>
					<div className="text-dbz-orange mt-4">
						▸ CronRegistry interne (Bun setInterval)
					</div>
					<div className="pl-4 text-gray-300">
						{cron.jobs.map((j) => (
							<div key={j.name}>
								• <span className="text-dbz-yellow">{j.name}</span> every{" "}
								{(j.intervalMs / 1000).toFixed(0)}s · runs={j.runCount} · last=
								{j.lastRunAt
									? new Date(j.lastRunAt).toLocaleString("fr-FR")
									: "—"}
							</div>
						))}
					</div>
					<div className="text-dbz-orange mt-4">
						▸ Systemd timers (réconciliation externe)
					</div>
					<div className="pl-4 text-gray-300">
						<div>
							• <span className="text-dbz-yellow">shenron-backup.timer</span>{" "}
							daily 03:00 UTC → VACUUM INTO + gzip rétention 14j
						</div>
						<div>
							•{" "}
							<span className="text-dbz-yellow">shenron-guild-sync.timer</span>{" "}
							daily 04:00 UTC → scan-ids + reconstruct + 24h messages parse
						</div>
					</div>
					<div className="text-dbz-orange mt-4">▸ Site Next.js (lecture)</div>
					<div className="pl-4 text-gray-300">
						<div>• Drizzle Neon → posts/wiki/users (le site)</div>
						<div>
							• Bot REST /api/public/* → leaderboard/profil/shop/stats (cache
							30-300s)
						</div>
						<div>• SSE /api/a2a/events → /admin/events temps réel push</div>
					</div>
				</div>
			</section>

			{/* Réconciliation manuelle */}
			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-3">
					Réconciliation manuelle
				</h2>
				<div className="dbz-panel p-6 space-y-3 text-sm">
					<p className="text-gray-300">
						Si la DB et Discord divergent (perte data, bug d'event, etc.),
						lancer en SSH sur le VPS :
					</p>
					<pre className="bg-dbz-bg border border-dbz-border p-3 text-xs text-dbz-yellow overflow-x-auto">
						{`# Reconcile members + level roles (fast, < 30s)
bash /home/ubuntu/vps/scripts/ops/shenron-guild-sync.sh

# OU déclencher via systemd (= même chose)
sudo systemctl start shenron-guild-sync.service
sudo journalctl -u shenron-guild-sync -f

# Recovery profond (parse 30/60/90 derniers jours de messages)
cd /home/ubuntu/shenron/apps/bot
bun scripts/recover-from-discord-history.ts --days 90 --concurrency 6`}
					</pre>
					<p className="text-xs text-gray-500 uppercase tracking-widest">
						Auto-exécuté chaque nuit à 04:00 UTC via shenron-guild-sync.timer
					</p>
				</div>
			</section>
		</div>
	);
}
