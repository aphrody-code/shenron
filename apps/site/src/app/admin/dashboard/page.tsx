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
} from "lucide-react";
import { api } from "@/lib/admin-api";
import { formatBytes, formatDuration, fmtNum } from "@/lib/admin-format";
import { useBots, type BotSummary } from "@/components/admin/BotSelector";

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
		queryFn: () => api.get<any>("/health/monitoring"),
		refetchInterval: 30_000,
	});
	const stats = useQuery({
		queryKey: ["stats", "totals"],
		queryFn: () => api.get<any>("/stats/totals"),
		refetchInterval: 60_000,
	});

	const onlineCount = bots.data?.bots.filter((b) => b.online).length ?? 0;
	const totalCount = bots.data?.bots.length ?? 0;
	const avgPing =
		bots.data && onlineCount > 0
			? Math.round(
					bots.data.bots
						.filter((b) => b.online)
						.reduce((s, b) => s + Math.max(0, b.wsPing), 0) /
						Math.max(1, onlineCount),
				)
			: null;

	return (
		<div className="space-y-8">
			{/* En-tête accueillant */}
			<div className="dbz-panel px-6 py-5">
				<div className="flex items-start gap-4">
					<div className="flex-1">
						<h1 className="font-saiyan text-3xl text-dbz-yellow leading-tight">
							Bienvenue dans votre espace admin
						</h1>
						<p className="mt-2 text-white/60 text-sm leading-relaxed max-w-xl">
							Depuis ici, gérez le bot Dragon Ball France : membres, économie,
							encyclopédie, modération et bien plus. Utilisez le menu à gauche
							ou les raccourcis ci-dessous.
						</p>
					</div>
					<div className="hidden sm:flex items-center gap-2 shrink-0">
						<span
							className={`h-2.5 w-2.5 rounded-full ${onlineCount > 0 ? "bg-namek animate-pulse" : "bg-dbz-red"}`}
						/>
						<span className="text-xs text-white/50">
							{onlineCount > 0
								? `${onlineCount} persona${onlineCount > 1 ? "s" : ""} en ligne`
								: "Bot hors ligne"}
						</span>
					</div>
				</div>
			</div>

			{/* Accès rapides — que voulez-vous faire ? */}
			<div>
				<h2 className="mb-4 text-base font-semibold text-white/70 uppercase tracking-widest text-[11px]">
					Que voulez-vous faire ?
				</h2>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{QUICK_ACTIONS.map((a) => (
						<Link
							key={a.href}
							href={a.href}
							className={`dbz-quick-action group flex items-start gap-4 p-4 rounded-xl border transition-all ${a.bg}`}
						>
							<span className={`mt-0.5 shrink-0 ${a.color}`}>{a.icon}</span>
							<div className="min-w-0">
								<p className={`font-display font-semibold text-sm ${a.color}`}>
									{a.label}
								</p>
								<p className="mt-0.5 text-xs text-white/50 leading-snug">
									{a.description}
								</p>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* KPIs — vue d'ensemble du système */}
			<div>
				<h2 className="mb-4 text-base font-semibold text-white/70 uppercase tracking-widest text-[11px]">
					État du système
				</h2>
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
							{stats.data ? fmtNum(stats.data.stats.totalActiveUsers) : "—"}{" "}
							actifs &middot;{" "}
							{stats.data ? fmtNum(stats.data.stats.totalGuilds) : "—"} serveur
							{(stats.data?.stats.totalGuilds ?? 0) > 1 ? "s" : ""}
						</p>
					</KPICard>

					<KPICard
						label="Latence Discord"
						icon={<Activity className="h-4 w-4" />}
					>
						<p className="text-3xl font-bold">
							{avgPing !== null ? avgPing : "—"}
							<span className="text-sm text-zinc-500"> ms</span>
						</p>
						<p className="mt-2 text-xs text-zinc-400">
							WebSocket &middot; base de données{" "}
							{health.data?.latency.db ?? "—"}&nbsp;ms
						</p>
					</KPICard>

					<KPICard label="Mémoire utilisée" icon={<Cpu className="h-4 w-4" />}>
						<p className="text-3xl font-bold">
							{health.data
								? formatBytes(health.data.pid.rss).split(" ")[0]
								: "—"}
							<span className="text-sm text-zinc-500">
								{" "}
								{health.data
									? formatBytes(health.data.pid.rss).split(" ")[1]
									: ""}
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
					Personas Discord
				</h2>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{bots.data?.bots.map((b) => <BotCard key={b.id} bot={b} />) ?? (
						<div className="text-zinc-500 text-sm">Chargement…</div>
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
								<span className="text-zinc-500">
									({health.data.host.memory.usage} %)
								</span>
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
							{bot.wsPing} ms &middot; actif depuis{" "}
							{bot.uptime ? formatDuration(bot.uptime) : "—"}
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
