const SHENRON_API = process.env.SHENRON_API_URL ?? "https://shenron.rpbey.fr";

const PUBLIC_ROUTES = [
	{
		method: "GET",
		path: "/api/public/user/:discordId",
		desc: "Profil enrichi user (XP, zéni, niveau, succès, inventaire, fusion, bannière)",
	},
	{
		method: "GET",
		path: "/api/public/shop",
		desc: "Catalogue items boutique (cartes/badges/couleurs/titres/bannières)",
	},
	{
		method: "GET",
		path: "/api/public/leaderboard?limit=100&enrich=1",
		desc: "Top XP avec avatars + usernames Discord",
	},
	{
		method: "GET",
		path: "/api/public/stats",
		desc: "Stats globales : users, totalXp, totalZeni, achievementsUnlocked, shopItems, inventoryItems",
	},
	{
		method: "GET",
		path: "/api/public/personas",
		desc: "6 personas Discord (status, ping, command count)",
	},
	{
		method: "GET",
		path: "/api/public/commands",
		desc: "Liste complète des slash commands groupées par persona",
	},
	{
		method: "GET",
		path: "/api/public/wiki/characters",
		desc: "Personnages DB (filtrable via ?q=)",
	},
	{
		method: "GET",
		path: "/api/public/wiki/characters/:id",
		desc: "Détail personnage + transformations + planète",
	},
	{
		method: "GET",
		path: "/api/public/wiki/planets",
		desc: "Liste planètes DB",
	},
	{
		method: "GET",
		path: "/api/public/wiki/planets/:id",
		desc: "Détail planète",
	},
	{
		method: "GET",
		path: "/api/public/profile/:id/card.png",
		desc: "Image profile card canvas (8 thèmes via ?theme=)",
	},
	{
		method: "GET",
		path: "/api/public/profile/:id/scan.png",
		desc: "Image scouter / scan canvas",
	},
];

const ADMIN_ROUTES = [
	{
		method: "GET",
		path: "/api/bots",
		desc: "Liste 6 personas + statut détaillé",
	},
	{
		method: "GET",
		path: "/api/bots/:id/commands",
		desc: "Commandes filtrées par persona",
	},
	{
		method: "GET",
		path: "/api/bots/:id/guild/roles",
		desc: "Liste rôles guild (role picker)",
	},
	{
		method: "GET",
		path: "/api/cron",
		desc: "Cron jobs (lastRunAt, intervalMs, runCount, lastError)",
	},
	{
		method: "POST",
		path: "/api/cron/:name/trigger",
		desc: "Déclenche un cron manuellement",
	},
	{
		method: "GET",
		path: "/api/services",
		desc: "Liste services tsyringe exposés",
	},
	{
		method: "POST",
		path: "/api/services/:service/:action",
		desc: "Invoque méthode whitelistée d'un service",
	},
	{
		method: "GET",
		path: "/api/database/tables",
		desc: "Liste 16 tables mutables",
	},
	{
		method: "GET/PUT/DELETE",
		path: "/api/database/:table[/:id]",
		desc: "CRUD générique par table",
	},
	{
		method: "GET",
		path: "/api/economy/leaderboard?limit=50",
		desc: "Top économique (admin enriched)",
	},
	{
		method: "POST",
		path: "/api/economy/give",
		desc: "Crédite Zéni un user (userId, amount, reason)",
	},
	{ method: "POST", path: "/api/economy/set", desc: "Définit XP/zéni absolu" },
	{
		method: "GET",
		path: "/api/audit/logs?limit=50",
		desc: "Logs actions modération + admin",
	},
	{ method: "GET", path: "/api/giveaways", desc: "Giveaways actifs + finis" },
	{
		method: "POST",
		path: "/api/giveaways/:id/end",
		desc: "Termine un giveaway et tire les gagnants",
	},
	{
		method: "GET",
		path: "/api/discord/{channels,roles,members,guild}",
		desc: "Browse data Discord live",
	},
	{
		method: "GET",
		path: "/api/canvas/profile/:userId",
		desc: "Profile card admin (debug)",
	},
	{ method: "GET", path: "/api/canvas/scouter/:userId", desc: "Scouter admin" },
	{
		method: "GET",
		path: "/api/health/{check,usage,host,monitoring,logs,latency}",
		desc: "Métriques host + bot",
	},
	{
		method: "GET",
		path: "/api/a2a/events",
		desc: "SSE stream events temps réel (level-up, achievement…)",
	},
	{
		method: "POST",
		path: "/api/a2a/jsonrpc",
		desc: "JSON-RPC 2.0 endpoint Agent2Agent",
	},
];

function RouteRow({
	r,
	scheme,
}: {
	r: { method: string; path: string; desc: string };
	scheme: "public" | "admin";
}) {
	return (
		<tr className="border-b border-dbz-border hover:bg-dbz-blue-light/5">
			<td className="p-2 align-top">
				<span
					className={`font-mono text-[10px] font-bold px-2 py-0.5 border-2 ${scheme === "public" ? "text-green-400 border-green-400" : "text-red-400 border-red-400"}`}
				>
					{r.method}
				</span>
			</td>
			<td className="p-2 font-mono text-xs text-dbz-orange align-top">
				{r.path}
			</td>
			<td className="p-2 text-xs text-gray-300 align-top">{r.desc}</td>
		</tr>
	);
}

export default function ApiDocsPage() {
	return (
		<div className="container mx-auto px-4 py-12 max-w-6xl">
			<header className="text-center mb-10">
				<h1
					className="text-5xl md:text-7xl text-dbz-yellow mb-4"
					style={{ textShadow: "4px 4px 0px rgba(168, 85, 247, 0.6), 0 0 24px rgba(56, 189, 248, 0.3)" }}
				>
					API
				</h1>
				<p className="text-dbz-blue-light font-bold tracking-widest uppercase">
					Base URL · <code className="text-dbz-orange">{SHENRON_API}</code> ·
					OpenAPI 3.0.1 sur <code className="text-dbz-orange">/openapi</code>
				</p>
			</header>

			<section className="mb-12">
				<h2 className="text-3xl font-saiyan text-green-400 uppercase mb-4">
					Routes publiques ({PUBLIC_ROUTES.length})
				</h2>
				<p className="text-xs text-gray-400 mb-3">
					CORS open · rate-limit 60 req/min/IP · cache 30s à 1h selon endpoint ·
					aucun token requis
				</p>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[700px]">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light w-24">
									Méthode
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Path
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Description
								</th>
							</tr>
						</thead>
						<tbody>
							{PUBLIC_ROUTES.map((r) => (
								<RouteRow key={r.path} r={r} scheme="public" />
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className="text-3xl font-saiyan text-red-400 uppercase mb-4">
					Routes admin ({ADMIN_ROUTES.length}+)
				</h2>
				<p className="text-xs text-gray-400 mb-3">
					Authentification :{" "}
					<code className="text-dbz-orange">
						Authorization: Bearer $API_ADMIN_TOKEN
					</code>{" "}
					· accessible via le proxy site{" "}
					<code className="text-dbz-orange">/api/bot-admin/[...]</code> si{" "}
					<strong>roleAdmin</strong>
				</p>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[700px]">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light w-24">
									Méthode
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Path
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Description
								</th>
							</tr>
						</thead>
						<tbody>
							{ADMIN_ROUTES.map((r) => (
								<RouteRow key={r.path} r={r} scheme="admin" />
							))}
						</tbody>
					</table>
				</div>
			</section>

			<footer className="mt-8 text-center text-xs text-gray-500 uppercase tracking-widest">
				Total : 104 endpoints · Bun.serve native · tscord-compatible
			</footer>
		</div>
	);
}
