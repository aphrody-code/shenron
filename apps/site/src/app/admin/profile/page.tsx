"use client";

import { useQuery } from "@tanstack/react-query";
import {
	Crown,
	ShieldCheck,
	Mail,
	AlertCircle,
	ExternalLink,
	Calendar,
	Globe,
} from "lucide-react";
import { api, ApiError } from "@/lib/admin-api";
import { authClient } from "@/lib/auth-client";

interface DiscordUser {
	id: string;
	username: string;
	global_name: string | null;
	avatar: string | null;
	banner: string | null;
	accent_color: number | null;
	email?: string;
	verified?: boolean;
	locale?: string;
	public_flags?: number;
	discriminator?: string;
}

interface MeResponse {
	user: DiscordUser;
}

interface SessionUser {
	id?: string;
	username?: string;
	avatar?: string | null;
	avatarUrl?: string;
	email?: string | null;
	source: "token" | "discord" | "better-auth";
}

interface GuildEntry {
	id: string;
	name: string;
	icon: string | null;
	iconUrl: string | null;
	owner: boolean;
	permissions: string;
	features: string[];
	approximate_member_count?: number;
	approximate_presence_count?: number;
	isCurrent: boolean;
}

interface MemberResponse {
	member: {
		nick: string | null;
		avatar: string | null;
		roles: string[];
		joined_at: string;
		premium_since: string | null;
		pending: boolean;
		communication_disabled_until: string | null;
	};
}

/**
 * Construit l'URL d'avatar Discord.
 */
function avatarUrl(
	user: { id?: string; avatar?: string | null },
	size = 256,
): string | null {
	if (!user.id) return null;
	if (!user.avatar) {
		const idx = Number(BigInt(user.id) >> 22n) % 6;
		return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
	}
	const ext = user.avatar.startsWith("a_") ? "gif" : "webp";
	return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${size}`;
}

function bannerUrl(
	user: { id: string; banner: string | null },
	size = 1024,
): string | null {
	if (!user.banner) return null;
	const ext = user.banner.startsWith("a_") ? "gif" : "webp";
	return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=${size}`;
}

export default function ProfilePage() {
	// Session du SITE (Better Auth) — source de vérité de l'admin connecté.
	// NB: le bot a sa propre session cookie, inaccessible via le proxy bearer
	// (`/auth/me` → 404, `/discord/*` → 401). On lit donc la session locale.
	const { data: siteSession, isPending: sessionPending } =
		authClient.useSession();
	const sessionUser: SessionUser | undefined = siteSession?.user
		? {
				id: siteSession.user.id,
				username: siteSession.user.name ?? undefined,
				avatarUrl: siteSession.user.image ?? undefined,
				email: siteSession.user.email ?? null,
				source: "better-auth",
			}
		: undefined;

	// Profil Discord enrichi via OAuth — nécessite la session OAuth côté bot,
	// indisponible derrière le proxy bearer : échoue proprement (401) et la page
	// retombe sur la carte de session du site.
	const me = useQuery({
		queryKey: ["discord", "me"],
		queryFn: () => api.get<MeResponse>("/discord/me"),
		retry: false,
		enabled: !!sessionUser,
	});
	const guilds = useQuery({
		queryKey: ["discord", "guilds"],
		queryFn: () => api.get<{ guilds: GuildEntry[] }>("/discord/guilds"),
		retry: false,
		enabled: !!me.data,
	});
	const member = useQuery({
		queryKey: ["discord", "guild-member"],
		queryFn: () => api.get<MemberResponse>("/discord/guild-member"),
		retry: false,
		enabled: !!me.data,
	});

	// Chargement initial
	if (sessionPending || me.isLoading) {
		return (
			<div className="dbz-panel p-8 text-center">
				<p className="text-dbz-blue-light font-saiyan text-xl mb-2">
					CHARGEMENT…
				</p>
				<p className="text-sm text-white/40">
					Récupération de votre profil Discord en cours.
				</p>
			</div>
		);
	}

	// Pas de session OAuth Discord → invitation à se connecter
	if (me.isError || !me.data) {
		const sUser = sessionUser;
		const isOAuthMissing =
			me.error instanceof ApiError &&
			(me.error.status === 401 || me.error.status === 503);
		return (
			<div className="space-y-4 max-w-2xl">
				<header>
					<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
						MON PROFIL
					</h1>
					<p className="text-sm text-white/50">
						Consultez et gérez votre compte Discord lié au tableau de bord.
					</p>
				</header>
				<SessionCard user={sUser} />
				<div className="dbz-panel p-5 border-l-4 border-dbz-yellow">
					<div className="flex items-start gap-3">
						<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-dbz-yellow" />
						<div className="flex-1 space-y-3">
							<h3 className="font-saiyan text-dbz-yellow">
								Profil Discord complet non disponible
							</h3>
							<p className="text-sm text-white/70">
								{isOAuthMissing
									? "Vous êtes connecté via le jeton administrateur. Pour afficher votre avatar, votre bannière et vos serveurs Discord, connectez-vous via votre compte Discord."
									: me.error instanceof Error
										? `Erreur de connexion : ${me.error.message}`
										: "Le serveur Discord ne répond pas. Réessayez dans un instant."}
							</p>
							<button
								type="button"
								onClick={async () => {
									const res = await fetch("/api/auth/sign-in/social", {
										method: "POST",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify({
											provider: "discord",
											callbackURL: "/admin/profile",
										}),
									});
									if (res.ok) {
										const { url } = (await res.json()) as { url?: string };
										if (url) {
											window.location.href = url;
											return;
										}
									}
									window.location.href = "/auth/discord";
								}}
								className="dbz-button !text-sm inline-flex items-center gap-2"
							>
								Se connecter avec Discord
								<ExternalLink className="h-3 w-3" />
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Profil OAuth complet
	const u = me.data.user;
	const banner = bannerUrl({ id: u.id, banner: u.banner });
	const accentBg =
		u.accent_color != null
			? `#${u.accent_color.toString(16).padStart(6, "0")}`
			: "linear-gradient(to right, #18181b, #27272a)";
	const avatar = avatarUrl(u);
	const displayName = u.global_name ?? u.username;

	return (
		<div className="space-y-6 max-w-4xl">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					MON PROFIL
				</h1>
				<p className="text-sm text-white/50">
					Informations de votre compte Discord.
				</p>
			</header>

			{/* Carte profil */}
			<div className="dbz-panel overflow-hidden p-0">
				{/* Bannière */}
				<div
					className="h-32 w-full"
					style={
						banner
							? {
									backgroundImage: `url(${banner})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}
							: { background: accentBg }
					}
				/>
				{/* Avatar + nom */}
				<div className="-mt-10 flex items-end gap-4 px-6">
					{avatar ? (
						<img
							src={avatar}
							alt=""
							className="h-24 w-24 rounded-full border-4 border-dbz-bg object-cover"
						/>
					) : (
						<div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-dbz-bg bg-dbz-border text-2xl font-bold text-white">
							{displayName.slice(0, 2).toUpperCase()}
						</div>
					)}
					<div className="pb-4">
						<h2 className="text-2xl font-bold text-white">{displayName}</h2>
						<p className="text-sm text-white/50">@{u.username}</p>
					</div>
				</div>
				{/* Champs détaillés */}
				<div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-4">
					<Field
						icon={<ShieldCheck className="h-4 w-4" />}
						label="Identifiant Discord"
						value={u.id}
						mono
						hint="Numéro unique de votre compte"
					/>
					<Field
						icon={<Mail className="h-4 w-4" />}
						label="Adresse e-mail"
						value={
							u.email
								? `${u.email}${u.verified ? " (vérifiée)" : " (non vérifiée)"}`
								: "—"
						}
					/>
					<Field
						icon={<Globe className="h-4 w-4" />}
						label="Langue Discord"
						value={u.locale ? u.locale.toUpperCase() : "—"}
					/>
					<Field
						icon={<Crown className="h-4 w-4" />}
						label="Badges publics"
						value={
							u.public_flags
								? `Valeur : ${u.public_flags}`
								: "Aucun badge spécial"
						}
					/>
				</div>
			</div>

			{/* Membership sur le serveur */}
			{member.isLoading && (
				<div className="dbz-panel p-4 text-sm text-white/40">
					Chargement de votre statut sur le serveur…
				</div>
			)}
			{member.isError && (
				<div className="dbz-panel p-4 text-sm text-white/40">
					Impossible de récupérer votre statut sur le serveur.
				</div>
			)}
			{member.data && (
				<div className="dbz-panel p-5">
					<h3 className="font-saiyan text-dbz-yellow text-lg mb-4 uppercase">
						Votre statut sur le serveur
					</h3>
					<dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
						<div>
							<dt className="text-white/40 text-xs uppercase tracking-widest mb-1">
								Surnom
							</dt>
							<dd className="text-white font-medium">
								{member.data.member.nick ?? "—"}
							</dd>
						</div>
						<div>
							<dt className="text-white/40 text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								Date d&apos;arrivée
							</dt>
							<dd className="text-white font-medium">
								{new Date(member.data.member.joined_at).toLocaleDateString(
									"fr-FR",
									{ year: "numeric", month: "long", day: "numeric" },
								)}
							</dd>
						</div>
						<div>
							<dt className="text-white/40 text-xs uppercase tracking-widest mb-1">
								Boost actif depuis
							</dt>
							<dd className="text-white font-medium">
								{member.data.member.premium_since
									? new Date(
											member.data.member.premium_since,
										).toLocaleDateString("fr-FR", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})
									: "Pas de boost actif"}
							</dd>
						</div>
						<div>
							<dt className="text-white/40 text-xs uppercase tracking-widest mb-1">
								Statut
							</dt>
							<dd>
								{member.data.member.communication_disabled_until &&
								new Date(member.data.member.communication_disabled_until) >
									new Date() ? (
									<span className="px-2 py-0.5 text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 rounded">
										Réduit au silence
									</span>
								) : member.data.member.pending ? (
									<span className="px-2 py-0.5 text-xs font-bold bg-dbz-yellow/20 text-dbz-yellow border border-dbz-yellow/40 rounded">
										En attente de vérification
									</span>
								) : (
									<span className="px-2 py-0.5 text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/40 rounded">
										Membre actif
									</span>
								)}
							</dd>
						</div>
						<div className="sm:col-span-2 lg:col-span-3">
							<dt className="text-white/40 text-xs uppercase tracking-widest mb-2">
								Vos rôles ({member.data.member.roles.length})
							</dt>
							<dd>
								{member.data.member.roles.length === 0 ? (
									<span className="text-white/30 text-sm">
										Aucun rôle attribué
									</span>
								) : (
									<div className="flex flex-wrap gap-1">
										{member.data.member.roles.map((rid) => (
											<span
												key={rid}
												className="px-2 py-0.5 text-xs font-mono bg-dbz-border text-white/60 rounded border border-dbz-border/80"
												title={`ID Discord du rôle : ${rid}`}
											>
												{rid}
											</span>
										))}
									</div>
								)}
							</dd>
						</div>
					</dl>
				</div>
			)}

			{/* Serveurs Discord */}
			<div className="dbz-panel p-5">
				<h3 className="font-saiyan text-dbz-yellow text-lg mb-1 uppercase">
					Mes serveurs Discord
					{guilds.data ? ` (${guilds.data.guilds.length})` : ""}
				</h3>
				<p className="text-xs text-white/30 mb-4">
					Serveurs Discord où vous êtes présent. Le serveur du bot est mis en
					avant.
				</p>
				{guilds.isLoading && (
					<div className="text-sm text-white/40">
						Chargement de vos serveurs…
					</div>
				)}
				{guilds.isError && (
					<div className="text-sm text-white/40">
						Liste des serveurs indisponible.
					</div>
				)}
				{guilds.data && guilds.data.guilds.length === 0 && (
					<div className="text-sm text-white/40">Aucun serveur en commun.</div>
				)}
				{guilds.data && guilds.data.guilds.length > 0 && (
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{guilds.data.guilds.map((g) => (
							<div
								key={g.id}
								className={`flex items-center gap-3 rounded-lg border p-3 ${
									g.isCurrent
										? "border-dbz-orange/60 bg-dbz-orange/5"
										: "border-dbz-border bg-dbz-bg/40"
								}`}
							>
								{g.iconUrl ? (
									<img
										src={g.iconUrl}
										alt=""
										className="h-10 w-10 rounded-full shrink-0"
									/>
								) : (
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-dbz-border text-xs font-bold text-white shrink-0">
										{g.name
											.split(" ")
											.map((w) => w[0])
											.slice(0, 2)
											.join("")
											.toUpperCase()}
									</div>
								)}
								<div className="min-w-0 flex-1">
									<p
										className="truncate text-sm font-semibold text-white"
										title={g.name}
									>
										{g.isCurrent ? (
											<span className="text-dbz-orange">{g.name}</span>
										) : (
											g.name
										)}
									</p>
									<p className="text-xs text-white/40">
										{g.owner && "Propriétaire · "}
										{g.approximate_member_count?.toLocaleString("fr-FR") ?? "?"}{" "}
										membres
										{g.isCurrent && " · serveur du bot"}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function SessionCard({ user }: { user: SessionUser | undefined }) {
	if (!user) return null;
	const sourceLabel: Record<SessionUser["source"], string> = {
		token: "Jeton administrateur",
		discord: "Connexion Discord (classique)",
		"better-auth": "Connexion Discord (OAuth)",
	};
	const initials = (user.username ?? "??").slice(0, 2).toUpperCase();
	return (
		<div className="dbz-panel p-5">
			<h3 className="font-saiyan text-dbz-yellow text-base mb-3 uppercase">
				Session active
			</h3>
			<div className="flex items-center gap-4">
				{user.avatarUrl ? (
					<img
						src={user.avatarUrl}
						alt=""
						className="h-16 w-16 rounded-full border border-dbz-border object-cover"
					/>
				) : (
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-dbz-border font-bold text-white">
						{initials}
					</div>
				)}
				<div className="space-y-1 text-sm">
					<div className="font-semibold text-white">
						{user.username ?? "Utilisateur"}
					</div>
					{user.id && (
						<div
							className="font-mono text-xs text-white/40"
							title="Identifiant Discord"
						>
							{user.id}
						</div>
					)}
					{user.email && <div className="text-white/50">{user.email}</div>}
					<div className="text-xs">
						<span className="px-2 py-0.5 border border-dbz-border text-white/50 text-[10px] uppercase tracking-widest rounded">
							{sourceLabel[user.source]}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function Field({
	icon,
	label,
	value,
	mono,
	hint,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	mono?: boolean;
	hint?: string;
}) {
	return (
		<div>
			<div className="mb-1 flex items-center gap-2 text-xs text-white/40">
				{icon}
				<span>{label}</span>
			</div>
			<p
				className={`text-sm text-white ${mono ? "font-mono break-all" : ""}`}
				title={hint}
			>
				{value}
			</p>
			{hint && <p className="text-[10px] text-white/20 mt-0.5">{hint}</p>}
		</div>
	);
}
