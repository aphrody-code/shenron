"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
	Activity,
	Cpu,
	Server,
	Users,
	BookOpen,
	Shield,
	Coins,
	MessageSquare,
	TrendingUp,
	Settings,
	ArrowUpRight,
	RefreshCw,
	Command,
} from "lucide-react";
import { api } from "@/lib/admin-api";
import { formatBytes, formatDuration, fmtNum } from "@/lib/admin-format";
import { useBots, type BotSummary } from "@/components/admin/BotSelector";

type MonitoringResponse = {
	botStatus: { online: boolean; uptime: number | null };
	pid: { cpu: number; memory: number; uptime: number; rss: number };
	host: {
		cpu: { count: number; usage: number };
		memory: { total: number; free: number; used: number; usage: number };
		platform: string;
		uptime: number;
	};
	latency: { ws: number; db: number };
};

type TotalsResponse = {
	stats: {
		totalUsers: number;
		totalGuilds: number;
		totalActiveUsers: number;
		totalCommands: number;
	};
};

// ---------------------------------------------------------------------------
// Cartes "Que voulez-vous faire ?" — accès rapide pour l'admin
// ---------------------------------------------------------------------------

const QUICK_ACTIONS = [
	{
		href: "/admin/wiki",
		label: "Encyclopédie Dragon Ball",
		description: "Gérer le wiki, les sagas, films et jeux",
		icon: <BookOpen className="h-6 w-6" />,
		color: "text-dbz-yellow",
		bg: "bg-dbz-yellow/10 hover:bg-dbz-yellow/20 border-dbz-yellow/30 hover:border-dbz-yellow/60",
	},
	{
		href: "/admin/levels",
		label: "Membres & Niveaux",
		description: "Voir la progression XP de vos membres",
		icon: <TrendingUp className="h-6 w-6" />,
		color: "text-brand-400",
		bg: "bg-brand-400/10 hover:bg-brand-400/20 border-brand-400/30 hover:border-brand-400/60",
	},
	{
		href: "/admin/moderation",
		label: "Modération",
		description: "Gérer les sanctions et les rôles",
		icon: <Shield className="h-6 w-6" />,
		color: "text-dbz-red",
		bg: "bg-dbz-red/10 hover:bg-dbz-red/20 border-dbz-red/30 hover:border-dbz-red/60",
	},
	{
		href: "/admin/economy",
		label: "Économie",
		description: "Zénies, boutique et transactions",
		icon: <Coins className="h-6 w-6" />,
		color: "text-namek",
		bg: "bg-namek/10 hover:bg-namek/20 border-namek/30 hover:border-namek/60",
	},
	{
		href: "/admin/send",
		label: "Envoyer un message",
		description: "Diffuser une annonce via le bot",
		icon: <MessageSquare className="h-6 w-6" />,
		color: "text-dbz-blue-light",
		bg: "bg-dbz-blue/10 hover:bg-dbz-blue/20 border-dbz-blue-light/20 hover:border-dbz-blue-light/40",
	},
	{
		href: "/admin/settings",
		label: "Paramètres",
		description: "Configurer le comportement du bot",
		icon: <Settings className="h-6 w-6" />,
		color: "text-white/70",
		bg: "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/25",
	},
];

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

export default function DashboardPage() {
	const bots = useBots();
	const health = useQuery({
		queryKey: ["health", "monitoring"],
		queryFn: () => api.get<MonitoringResponse>("/health/monitoring"),
		refetchInterval: 30_000,
	});
	const stats = useQuery({
		queryKey: ["stats", "totals"],
		queryFn: () => api.get<TotalsResponse>("/stats/totals"),
		refetchInterval: 60_000,
	});

	const onlineCount = bots.data?.bots.filter((b) => b.online).length ?? 0;
	const totalCount = bots.data?.bots.length ?? 0;
	const avgPing =
		bots.data && onlineCount > 0
			? Math.round(
					bots.data.bots.filter((b) => b.online).reduce((s, b) => s + Math.max(0, b.wsPing), 0) /
						Math.max(1, onlineCount)
				)
			: null;
	const hasError = bots.isError || health.isError || stats.isError;
	const refresh = () => {
		void bots.refetch();
		void health.refetch();
		void stats.refetch();
	};

	return (
		<div className="space-y-8 pb-8">
			{/* En-tête accueillant */}
			<div className="relative overflow-hidden rounded-2xl border border-dbz-orange/30 bg-[radial-gradient(circle_at_80%_0%,rgba(243,132,24,.18),transparent_38%),#171511] px-6 py-6 shadow-[0_20px_60px_rgba(0,0,0,.25)] md:px-8 md:py-7">
				<div
					className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border border-dbz-orange/20"
					aria-hidden
				/>
				<div className="flex items-start gap-4">
					<div className="flex-1">
						<div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.2em] text-dbz-orange">
							<span className="h-2 w-2 rounded-full bg-namek shadow-[0_0_12px_rgba(80,200,120,.8)]" />
							Centre de contrôle DBFR
						</div>
						<h1 className="font-saiyan text-3xl leading-tight text-white md:text-4xl">
							Bonjour, administrateur
						</h1>
						<p className="mt-2 text-white/60 text-sm leading-relaxed max-w-xl">
							Pilotez le bot, le wiki et la communauté depuis un seul espace. Les indicateurs
							ci-dessous sont actualisés automatiquement.
						</p>
						<div className="mt-5 flex flex-wrap gap-2">
							<Link
								href="/admin/live"
								className="inline-flex items-center gap-2 rounded-full bg-dbz-orange px-4 py-2 text-xs font-bold text-black transition hover:bg-yellow-300"
							>
								Voir l’activité en direct <ArrowUpRight className="h-3.5 w-3.5" />
							</Link>
							<Link
								href="/admin/console"
								className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/75 transition hover:border-dbz-orange hover:text-white"
							>
								<Command className="h-3.5 w-3.5" /> Ouvrir la console
							</Link>
						</div>
					</div>
					<div className="hidden sm:flex items-center gap-2 shrink-0">
						<span
							className={`h-2.5 w-2.5 rounded-full ${bots.isPending || bots.isError ? "bg-white/30" : onlineCount > 0 ? "bg-namek animate-pulse" : "bg-dbz-red"}`}
						/>
						<span className="text-xs text-white/50">
							{bots.isPending
								? "Connexion au bot…"
								: bots.isError
									? "État indisponible"
									: onlineCount > 0
										? `${onlineCount} bot${onlineCount > 1 ? "s" : ""} en ligne`
										: "Bot hors ligne"}
						</span>
					</div>
				</div>
			</div>
			{hasError && (
				<div
					role="alert"
					className="flex flex-col gap-3 rounded-xl border border-yellow-300/25 bg-yellow-300/5 p-4 text-sm text-yellow-100/75 sm:flex-row sm:items-center sm:justify-between"
				>
					<p>
						Certains indicateurs ne répondent pas. Les valeurs manquantes ne sont pas interprétées
						comme des zéros.
					</p>
					<button
						type="button"
						onClick={refresh}
						className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-yellow-200/30 px-4 font-semibold hover:bg-yellow-200/10"
					>
						<RefreshCw className="h-4 w-4" /> Réessayer
					</button>
				</div>
			)}
			<div className="flex items-center justify-between border-b border-white/10 pb-3">
				<div>
					<h2 className="text-base font-semibold text-white">Accès rapides</h2>
					<p className="mt-1 text-xs text-white/45">Les opérations les plus fréquentes</p>
				</div>
				<span className="hidden text-xs text-white/40 sm:inline-flex sm:items-center sm:gap-1">
					{QUICK_ACTIONS.length} raccourcis <ArrowUpRight className="h-3 w-3" />
				</span>
			</div>

			{/* Accès rapides — que voulez-vous faire ? */}
			<div>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{QUICK_ACTIONS.map((a) => (
						<Link
							key={a.href}
							href={a.href}
							className={`dbz-quick-action group flex items-start gap-4 p-4 rounded-xl border transition-all ${a.bg}`}
						>
							<span className={`mt-0.5 shrink-0 ${a.color}`}>{a.icon}</span>
							<div className="min-w-0">
								<p className={`font-display font-semibold text-sm ${a.color}`}>{a.label}</p>
								<p className="mt-0.5 text-xs text-white/50 leading-snug">{a.description}</p>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* KPIs — vue d'ensemble du système */}
			<div>
				<div className="mb-4 flex items-end justify-between">
					<div>
						<h2 className="text-base font-semibold text-white">Santé du système</h2>
						<p className="mt-1 text-xs text-white/45">Bot, données et ressources de la machine</p>
					</div>
					<span className="inline-flex items-center gap-1.5 text-[11px] text-white/40">
						<RefreshCw className="h-3 w-3" /> auto · 30 s
					</span>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<KPICard label="Bots en ligne" icon={<Server className="h-4 w-4" />}>
						<p className="text-3xl font-bold text-brand-400">
							{onlineCount}
							<span className="text-sm text-zinc-500"> / {totalCount}</span>
						</p>
						<p className="mt-2 text-xs text-zinc-400">
							{totalCount > 0
								? onlineCount === totalCount
									? "Tous opérationnels"
									: `${totalCount - onlineCount} hors ligne`
								: "—"}
						</p>
					</KPICard>

					<KPICard label="Joueurs en base" icon={<Users className="h-4 w-4" />}>
						<p className="text-3xl font-bold text-brand-400">
							{stats.data ? fmtNum(stats.data.stats.totalUsers) : "—"}
						</p>
						<p className="mt-2 text-xs text-zinc-400">
							{stats.data ? fmtNum(stats.data.stats.totalActiveUsers) : "—"} actifs &middot;{" "}
							{stats.data ? fmtNum(stats.data.stats.totalGuilds) : "—"} serveur
							{(stats.data?.stats.totalGuilds ?? 0) > 1 ? "s" : ""}
						</p>
					</KPICard>

					<KPICard label="Latence Discord" icon={<Activity className="h-4 w-4" />}>
						<p className="text-3xl font-bold">
							{avgPing !== null ? avgPing : "—"}
							<span className="text-sm text-zinc-500"> ms</span>
						</p>
						<p className="mt-2 text-xs text-zinc-400">
							WebSocket &middot; base de données {health.data?.latency.db ?? "—"}&nbsp;ms
						</p>
					</KPICard>

					<KPICard label="Mémoire utilisée" icon={<Cpu className="h-4 w-4" />}>
						<p className="text-3xl font-bold">
							{health.data ? formatBytes(health.data.pid.rss).split(" ")[0] : "—"}
							<span className="text-sm text-zinc-500">
								{" "}
								{health.data ? formatBytes(health.data.pid.rss).split(" ")[1] : ""}
							</span>
						</p>
						<p className="mt-2 text-xs text-zinc-400">
							CPU {health.data?.pid.cpu ?? "—"} % &middot; machine{" "}
							{health.data?.host.cpu.usage ?? "—"} %
						</p>
					</KPICard>
				</div>
			</div>

			{/* Personas — état de chacun */}
			<div>
				<h2 className="mb-4 text-base font-semibold text-white/70 uppercase tracking-widest text-[11px]">
					Bot Discord unifié
				</h2>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{bots.isPending ? (
						Array.from({ length: 3 }, (_, index) => (
							<div key={index} className="h-24 animate-pulse rounded-xl bg-white/[.04]" />
						))
					) : bots.isError ? (
						<div className="text-zinc-500 text-sm">Inventaire des bots indisponible.</div>
					) : bots.data.bots.length ? (
						bots.data.bots.map((b) => <BotCard key={b.id} bot={b} />)
					) : (
						<div className="text-zinc-500 text-sm">Aucun client Gateway déclaré.</div>
					)}
				</div>
			</div>

			{/* Machine hôte */}
			<div className="card">
				<h2 className="mb-4 text-base font-semibold">Machine hôte (VPS)</h2>
				{health.data ? (
					<dl className="grid gap-2 text-sm sm:grid-cols-2">
						<div className="flex justify-between border-b border-zinc-900 py-1">
							<dt className="text-zinc-400">Système d&rsquo;exploitation</dt>
							<dd>{health.data.host.platform}</dd>
						</div>
						<div className="flex justify-between border-b border-zinc-900 py-1">
							<dt className="text-zinc-400">Cœurs CPU</dt>
							<dd>{health.data.host.cpu.count}</dd>
						</div>
						<div className="flex justify-between border-b border-zinc-900 py-1">
							<dt className="text-zinc-400">Mémoire</dt>
							<dd>
								{formatBytes(health.data.host.memory.used)} /{" "}
								{formatBytes(health.data.host.memory.total)}{" "}
								<span className="text-zinc-500">({health.data.host.memory.usage} %)</span>
							</dd>
						</div>
						<div className="flex justify-between border-b border-zinc-900 py-1">
							<dt className="text-zinc-400">Temps de fonctionnement</dt>
							<dd>{formatDuration(health.data.host.uptime * 1000)}</dd>
						</div>
					</dl>
				) : (
					<p className="text-zinc-500 text-sm">Connexion à la machine hôte…</p>
				)}
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Composants internes
// ---------------------------------------------------------------------------

function KPICard({
	label,
	icon,
	children,
}: {
	label: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="card">
			<div className="mb-3 flex items-center gap-2 text-zinc-400">
				{icon}
				<h3 className="text-sm font-medium">{label}</h3>
			</div>
			{children}
		</div>
	);
}

function BotCard({ bot }: { bot: BotSummary }) {
	return (
		<div
			className={`card flex gap-3 ${bot.online ? "" : "opacity-60"}`}
			title={bot.username ?? bot.name}
		>
			{bot.avatar ? (
				<img
					src={bot.avatar}
					alt=""
					className={`h-12 w-12 shrink-0 rounded-full ${bot.online ? "" : "grayscale"}`}
				/>
			) : (
				<div className="h-12 w-12 shrink-0 rounded-full bg-zinc-800" />
			)}
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<h3 className="truncate font-semibold">{bot.name}</h3>
					<span
						className={`h-2 w-2 shrink-0 rounded-full ${bot.online ? "bg-emerald-400" : "bg-red-500"}`}
						title={bot.online ? "En ligne" : "Hors ligne"}
					/>
				</div>
				<p className="mt-0.5 text-xs text-zinc-500">
					{bot.online ? (
						<>
							{bot.wsPing} ms &middot; actif depuis {bot.uptime ? formatDuration(bot.uptime) : "—"}
						</>
					) : (
						"Hors ligne"
					)}
				</p>
				<p className="mt-1 text-xs text-zinc-400">
					{bot.commandCount} commande{bot.commandCount > 1 ? "s" : ""}
					{" · "}
					{bot.guildCount} serveur{bot.guildCount > 1 ? "s" : ""}
				</p>
			</div>
		</div>
	);
}
