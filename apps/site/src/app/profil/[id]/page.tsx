import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserNav } from "@/components/user/UserNav";
import { ContinueRail } from "@/components/history/ContinueRail";
import { SectionUnavailable } from "@/components/wiki/SectionUnavailable";
import { readPublicProfileActivity } from "@/lib/account-data";
import { getProfileCardUrl } from "@/lib/assets";
import { getShenronUserResult } from "@/lib/shenron";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";
const fmt = (n: number | null | undefined) =>
	typeof n === "number" && Number.isFinite(n) ? n.toLocaleString("fr-FR") : "0";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const res = await getShenronUserResult(id);
	const username = res.status === "ok" ? res.user.username : null;
	return {
		title: username ? `Profil de ${username}` : "Profil de membre",
		description: username
			? `Niveau, statistiques et carte de ${username} sur Dragon Ball France.`
			: "Profil d'un membre Dragon Ball France.",
		robots: { index: false, follow: true },
	};
}

export default async function ProfilePage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ member?: string }>;
}) {
	const [{ id }, query] = await Promise.all([params, searchParams]);
	const memberView = query.member === "1";
	const [result, siteActivity, viewer] = await Promise.all([
		getShenronUserResult(id),
		readPublicProfileActivity(id).catch(() => null),
		memberView ? getCurrentUser() : Promise.resolve(null),
	]);
	const ownProfile = memberView && viewer?.discordId === id;
	if (result.status === "unavailable") {
		const unavailable = (
			<SectionUnavailable
				title="Profil temporairement indisponible"
				message="Le service des profils ne répond pas. Réessaie dans un instant — rien n'est perdu."
				links={[
					{ href: "/leaderboard", label: "Le classement" },
					{ href: "/", label: "Accueil" },
				]}
			/>
		);
		if (!ownProfile) return unavailable;
		return (
			<main className="min-h-screen bg-[#0e0d0b] px-4 py-8 text-white md:px-8 md:py-14">
				<div className="mx-auto max-w-6xl">
					<UserNav />
					{unavailable}
				</div>
			</main>
		);
	}
	if (result.status === "absent") notFound();
	const user = result.user;
	const username = user.username || "Guerrier inconnu";
	const avatar =
		user.avatarUrl ||
		`https://cdn.discordapp.com/embed/avatars/${(Number.parseInt(id, 10) || 0) % 5}.png`;
	const cardUrl = getProfileCardUrl(id);
	const equipped = user.equipped || {};
	const progress = user.xpProgress
		? Math.min(
				100,
				Math.max(0, (user.xpProgress.current / Math.max(1, user.xpProgress.nextLevelXp)) * 100)
			)
		: 0;
	const stats = [
		["XP total", fmt(user.xp)],
		["Zénis", fmt(user.zeni)],
		["Succès", fmt(user.achievements?.length)],
		["Objets", fmt(user.inventory?.length)],
	];
	const gear = [
		["Carte", equipped.card],
		["Badge", equipped.badge],
		["Couleur", equipped.color],
		["Titre", equipped.title],
	];
	return (
		<main className="min-h-screen bg-[radial-gradient(circle_at_75%_0%,rgba(243,132,24,.14),transparent_35%),#0e0d0b] text-white">
			<div className="mx-auto max-w-6xl px-4 py-8 pb-24 md:px-8 md:py-14">
				{ownProfile && <UserNav />}
				<div className="mb-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="font-scouter text-[11px] uppercase tracking-[.24em] text-dbz-orange">
							Fiche de guerrier
						</p>
						<h1 className="mt-2 font-saiyan text-4xl leading-none md:text-6xl">{username}</h1>
					</div>
					<Link
						href="/leaderboard"
						className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/65 transition hover:border-dbz-orange hover:text-white"
					>
						Classement
					</Link>
				</div>
				<section className="relative overflow-hidden rounded-[2rem] border border-dbz-orange/30 bg-[#191611] shadow-[0_24px_80px_rgba(0,0,0,.4)]">
					<div
						className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(246,177,45,.08),transparent_70%)]"
						aria-hidden
					/>
					<div className="relative grid gap-8 p-5 md:grid-cols-[1.05fr_.95fr] md:p-10">
						<div className="flex flex-col justify-between gap-8">
							<div className="flex items-center gap-5 md:gap-7">
								<div className="relative shrink-0">
									<img
										src={avatar}
										alt=""
										width="128"
										height="128"
										fetchPriority="high"
										className="h-24 w-24 rounded-2xl border-2 border-dbz-orange object-cover shadow-[0_0_0_5px_rgba(243,132,24,.12)] md:h-32 md:w-32"
									/>
									<span className="absolute -bottom-3 -right-3 rounded-full border-4 border-[#191611] bg-dbz-orange px-3 py-1 font-bold text-black">
										Niv. {user.level ?? 0}
									</span>
								</div>
								<div>
									<p className="text-sm text-white/50">Dragon Ball France</p>
									<p className="mt-2 text-sm text-white/70">
										Progression vers le niveau {user.xpProgress?.nextLevel ?? (user.level ?? 0) + 1}
									</p>
									<div className="mt-3 h-3 w-48 overflow-hidden rounded-full bg-black/60">
										<div
											className="h-full rounded-full bg-gradient-to-r from-dbz-orange to-yellow-300"
											style={{ width: `${progress}%` }}
										/>
									</div>
									<p className="mt-2 text-xs text-white/45">
										{fmt(user.xpProgress?.current)} / {fmt(user.xpProgress?.nextLevelXp)} XP
									</p>
								</div>
							</div>
							{user.fusion && (
								<Link
									href={`/profil/${user.fusion.partnerId}`}
									className="inline-flex w-fit items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-200 hover:bg-fuchsia-400/20"
								>
									✦ Fusion avec {user.fusion.partnerName}
								</Link>
							)}
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
								{stats.map(([label, value]) => (
									<div key={label} className="rounded-xl border border-white/10 bg-black/20 p-3">
										<p className="text-[10px] uppercase tracking-wider text-white/45">{label}</p>
										<p className="mt-1 text-xl font-semibold text-dbz-orange">{value}</p>
									</div>
								))}
							</div>
						</div>
						<figure className="rounded-2xl border border-white/10 bg-black/25 p-3 md:p-4">
							<div className="mb-3 flex items-center justify-between">
								<figcaption className="font-scouter text-[11px] uppercase tracking-[.18em] text-white/55">
									Carte officielle
								</figcaption>
								<a
									href={cardUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-dbz-orange hover:text-yellow-200"
								>
									PNG ↗
								</a>
							</div>
							<img
								src={cardUrl}
								alt={`Carte de ${username}`}
								width="1200"
								height="630"
								fetchPriority="high"
								className="w-full rounded-xl border border-dbz-orange/20"
							/>
							<p className="mt-3 text-center text-xs text-white/40">
								Rendue en direct par le bot · synchronisée avec Discord
							</p>
						</figure>
					</div>
				</section>
				{ownProfile && (
					<>
						<ContinueRail title={`Reprendre avec ${username}`} className="mt-8" />
						<MemberLibrary />
					</>
				)}
				{siteActivity && <SiteActivity activity={siteActivity} />}
				<div className="mt-6 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
					<section className="rounded-2xl border border-white/10 bg-[#141311] p-5 md:p-7">
						<h2 className="font-saiyan text-2xl text-dbz-orange">Équipement</h2>
						<dl className="mt-5 divide-y divide-white/10">
							{gear.map(([label, value]) => (
								<div key={label} className="flex items-center justify-between gap-4 py-4">
									<dt className="text-xs uppercase tracking-widest text-white/45">{label}</dt>
									<dd
										className={
											value
												? "text-right font-semibold text-white"
												: "text-right text-sm text-white/25"
										}
									>
										{value || "Non équipé"}
									</dd>
								</div>
							))}
						</dl>
					</section>
					<div className="space-y-6">
						<section className="rounded-2xl border border-white/10 bg-[#141311] p-5 md:p-7">
							<div className="flex items-end justify-between gap-4">
								<div>
									<h2 className="font-saiyan text-2xl text-dbz-orange">Inventaire</h2>
									<p className="mt-1 text-sm text-white/45">
										{user.inventory?.length || 0} objet(s) collecté(s)
									</p>
								</div>
								<Link href="/shop" className="text-sm text-dbz-blue-light hover:text-dbz-orange">
									Boutique ↗
								</Link>
							</div>
							{user.inventory?.length ? (
								<ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
									{user.inventory.map((item, i) => (
										<li
											key={`${item.type}-${item.key}-${i}`}
											className="rounded-xl border border-white/10 bg-black/20 p-4"
										>
											<span className="block truncate text-sm font-semibold text-white">
												{item.key}
											</span>
											<span className="mt-1 block text-[10px] uppercase tracking-wider text-white/40">
												{item.type}
											</span>
										</li>
									))}
								</ul>
							) : (
								<p className="mt-5 rounded-xl border border-dashed border-white/15 p-5 text-sm text-white/40">
									L’inventaire attend sa première collecte.
								</p>
							)}
						</section>
						<section className="rounded-2xl border border-white/10 bg-[#141311] p-5 md:p-7">
							<h2 className="font-saiyan text-2xl text-dbz-orange">Derniers succès</h2>
							{user.achievements?.length ? (
								<ul className="mt-5 flex flex-wrap gap-2">
									{user.achievements.slice(0, 12).map((ach, i) => (
										<li
											key={`${ach.code}-${i}`}
											className="rounded-full border border-yellow-300/25 bg-yellow-300/10 px-3 py-2 text-xs text-yellow-100"
										>
											✦ {ach.code}
										</li>
									))}
								</ul>
							) : (
								<p className="mt-5 text-sm text-white/40">Aucun succès débloqué pour le moment.</p>
							)}
						</section>
					</div>
				</div>
			</div>
		</main>
	);
}

type PublicActivity = NonNullable<Awaited<ReturnType<typeof readPublicProfileActivity>>>;

const LIBRARY_LINKS = [
	{
		href: "/wiki/episodes",
		title: "Épisodes",
		text: "Dragon Ball, Z, GT, Super et Daima en VF ou VOSTFR",
	},
	{ href: "/wiki/films", title: "Films", text: "Longs-métrages, OVA et téléfilms" },
	{ href: "/wiki/manga", title: "Manga", text: "Tomes et chapitres à lire en ligne" },
	{
		href: "/wiki/databooks",
		title: "Databooks",
		text: "Guides, artbooks et paroles d’auteur",
	},
] as const;

function MemberLibrary() {
	return (
		<section aria-labelledby="library-title" className="mt-8">
			<div className="mb-4 flex items-end justify-between gap-4">
				<div>
					<h2 id="library-title" className="font-saiyan text-3xl text-dbz-orange">
						Votre bibliothèque
					</h2>
					<p className="mt-1 text-sm text-white/45">Choisissez ce que vous voulez explorer</p>
				</div>
				<Link href="/favoris" className="text-sm font-semibold text-white/60 hover:text-dbz-orange">
					Ma liste
				</Link>
			</div>
			<ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{LIBRARY_LINKS.map((item) => (
					<li key={item.href}>
						<Link
							href={item.href}
							className="group flex h-full min-h-32 flex-col justify-end rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(243,132,24,.11),rgba(255,255,255,.025))] p-5 hover:border-dbz-orange/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dbz-orange"
						>
							<h3 className="text-lg font-semibold text-white group-hover:text-dbz-orange">
								{item.title}
							</h3>
							<p className="mt-1 text-sm leading-snug text-white/45">{item.text}</p>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}

function SiteActivity({ activity }: { activity: PublicActivity }) {
	const hasRecent = activity.recentRatings.length > 0 || activity.recentTierlists.length > 0;
	return (
		<section
			aria-labelledby="site-activity-title"
			className="mt-8 rounded-3xl border border-white/10 bg-[#141311] p-5 md:p-7"
		>
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 id="site-activity-title" className="font-saiyan text-3xl text-dbz-orange">
						Activité sur DBFR
					</h2>
					<p className="mt-1 text-sm text-white/45">Contributions et créations publiques</p>
				</div>
				<Link
					href="/tierlists"
					className="text-sm font-semibold text-white/60 hover:text-dbz-orange"
				>
					Voir les tier lists
				</Link>
			</div>
			<dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
				<SiteMetric label="Notes" value={activity.counts.ratings} />
				<SiteMetric label="Tier lists" value={activity.counts.tierlists} />
				<SiteMetric label="Contributions acceptées" value={activity.counts.contributions} />
				<SiteMetric label="Commentaires" value={activity.counts.comments} />
			</dl>
			{hasRecent && (
				<div className="mt-6 grid gap-6 md:grid-cols-2">
					{activity.recentRatings.length > 0 && (
						<div>
							<h3 className="text-sm font-semibold text-white/75">Dernières notes</h3>
							<ul className="mt-2 divide-y divide-white/10">
								{activity.recentRatings.map((rating) => (
									<li key={rating.id}>
										<Link
											href={ratingHref(rating.targetType, rating.targetId)}
											className="flex min-h-11 items-center justify-between gap-4 py-2 text-sm hover:text-dbz-orange"
										>
											<span>{ratingLabel(rating.targetType)}</span>
											<strong className="text-dbz-orange">{rating.score}/5</strong>
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
					{activity.recentTierlists.length > 0 && (
						<div>
							<h3 className="text-sm font-semibold text-white/75">Tier lists récentes</h3>
							<ul className="mt-2 divide-y divide-white/10">
								{activity.recentTierlists.map((tierlist) => (
									<li key={tierlist.id}>
										<Link
											href={`/tierlists/${tierlist.slug}`}
											className="flex min-h-11 items-center py-2 text-sm font-medium hover:text-dbz-orange"
										>
											{tierlist.title}
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}
		</section>
	);
}

function SiteMetric({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-2xl border border-white/10 bg-black/20 p-4">
			<dt className="text-xs leading-snug text-white/45">{label}</dt>
			<dd className="mt-1 font-saiyan text-3xl text-white">{fmt(value)}</dd>
		</div>
	);
}

function ratingLabel(type: string) {
	return { episode: "Épisode", movie: "Film", game: "Jeu", arc: "Arc" }[type] ?? "Fiche";
}

function ratingHref(type: string, id: string) {
	if (type === "episode") return `/wiki/episodes/${encodeURIComponent(id)}`;
	return { movie: "/wiki/films", game: "/wiki/jeux", arc: "/wiki/arcs" }[type] ?? "/wiki";
}
