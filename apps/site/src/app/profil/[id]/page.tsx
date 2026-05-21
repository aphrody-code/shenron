import { getShenronUser, getProfileCardUrl } from "@/lib/shenron";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const fmt = (n: number | null | undefined) =>
	typeof n === "number" && Number.isFinite(n) ? n.toLocaleString("fr-FR") : "0";

export default async function ProfilePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const user = await getShenronUser(id);

	if (!user) notFound();

	const equipped = user.equipped || {};
	const username = user.username || "Guerrier Inconnu";
	const avatar =
		user.avatarUrl ||
		`https://cdn.discordapp.com/embed/avatars/${(Number.parseInt(id, 10) || 0) % 5}.png`;
	// Carte de guerrier rendue par le canvas du bot (la vraie feature).
	const cardUrl = getProfileCardUrl(id);

	const progressPct = user.xpProgress
		? Math.min(
				100,
				Math.max(
					0,
					(user.xpProgress.current / Math.max(1, user.xpProgress.nextLevelXp)) *
						100,
				),
			)
		: 0;

	return (
		<div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl space-y-8">
			{/* ── Carte de guerrier officielle (canvas bot) ───────────────── */}
			<section className="dbz-panel p-4 md:p-6">
				<div className="flex items-center justify-between mb-3">
					<h2 className="font-saiyan text-xl md:text-2xl text-dbz-orange uppercase tracking-wide">
						Carte de guerrier
					</h2>
					<a
						href={cardUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="font-scouter text-[10px] tracking-widest text-dbz-blue-light hover:text-dbz-orange transition-colors"
					>
						TÉLÉCHARGER PNG →
					</a>
				</div>
				{ }
				<img
					src={cardUrl}
					alt={`Carte de ${username}`}
					className="w-full max-w-2xl mx-auto rounded-lg border border-dbz-border"
					loading="lazy"
				/>
				<p className="text-center text-[10px] uppercase tracking-widest text-white/40 mt-3">
					Rendue en direct par le bot · identique à <code>/profil</code> sur
					Discord
				</p>
			</section>

			<div className="dbz-panel overflow-hidden border-4">
				{/* Banner */}
				<div className="h-48 md:h-64 w-full relative border-b-4 border-dbz-blue-light">
					{user.banner ? (
						 
						<img
							src={user.banner}
							alt="Banner"
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full bg-dbz-bg flex items-center justify-center">
							<span className="font-saiyan text-6xl text-dbz-border opacity-50 uppercase tracking-widest">
								DBFR
							</span>
						</div>
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-dbz-card to-transparent" />
				</div>

				{/* Profile Info Header */}
				<div className="px-6 md:px-12 pb-12 relative">
					<div className="relative -mt-20 md:-mt-24 mb-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
						<div className="relative">
							<div className="w-32 h-32 md:w-44 md:h-44 border-4 md:border-8 border-dbz-blue-light bg-dbz-bg relative z-10 p-1">
								{ }
								<img
									src={avatar}
									alt={username}
									className="w-full h-full object-cover border-2 border-dbz-card"
								/>
							</div>
							<div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-dbz-orange text-white px-4 py-1 border-2 border-dbz-orange-dark z-20 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
								<span className="font-saiyan text-2xl uppercase whitespace-nowrap">
									LVL {user.level ?? 0}
								</span>
							</div>
						</div>

						<div className="flex-1 text-center md:text-left space-y-2 md:space-y-4 mt-4 md:mt-0">
							<div className="space-y-1">
								<h1
									className="text-4xl md:text-6xl font-saiyan text-white"
									style={{ textShadow: "3px 3px 0px rgba(0,0,0,0.8)" }}
								>
									{username}
								</h1>
								{equipped.title && (
									<div className="inline-block px-3 py-1 bg-dbz-bg border-2 border-dbz-yellow text-dbz-yellow font-bold text-xs uppercase tracking-widest">
										{equipped.title}
									</div>
								)}
							</div>

							{/* XP Progress Bar */}
							{user.xpProgress && (
								<div className="max-w-md mx-auto md:mx-0">
									<div className="flex justify-between items-end mb-1">
										<span className="text-[10px] font-bold text-dbz-blue-light uppercase tracking-widest">
											Progression Niveau {user.xpProgress.nextLevel}
										</span>
										<span className="text-[10px] font-bold text-gray-400">
											{fmt(user.xpProgress.current)} /{" "}
											{fmt(user.xpProgress.nextLevelXp)} XP
										</span>
									</div>
									<div className="h-4 bg-dbz-bg border-2 border-dbz-border p-0.5 relative overflow-hidden">
										<div
											className="h-full shadow-[0_0_12px_rgba(255,107,26,0.6)]"
											style={{
												width: `${progressPct}%`,
												background:
													"linear-gradient(90deg,#6366f1,#a855f7,#38bdf8)",
											}}
										/>
									</div>
								</div>
							)}

							{/* Fusion Status */}
							{user.fusion && (
								<div className="flex justify-center md:justify-start">
									<Link
										href={`/profil/${user.fusion.partnerId}`}
										className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-widest hover:bg-pink-500/20 transition-colors"
									>
										<div className="w-2 h-2 bg-pink-500 animate-pulse rounded-full" />
										Fusion avec {user.fusion.partnerName}
									</Link>
								</div>
							)}
						</div>
					</div>

					{/* Stats Scouter style */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
						<StatBox
							label="XP Total"
							value={fmt(user.xp)}
							tint="text-dbz-orange"
						/>
						<StatBox
							label="Zénis"
							value={fmt(user.zeni)}
							tint="text-dbz-yellow"
						/>
						<StatBox
							label="Succès"
							value={fmt(user.achievements?.length)}
							tint="text-white"
						/>
						<StatBox
							label="Objets"
							value={fmt(user.inventory?.length)}
							tint="text-white"
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
						{/* Left Column: Equipped */}
						<div className="lg:col-span-1 space-y-6">
							<h3 className="font-saiyan text-3xl text-dbz-orange border-b-2 border-dbz-orange pb-2">
								ÉQUIPEMENTS
							</h3>
							<div className="space-y-4">
								<EquippedItem label="CARTE" value={equipped.card} />
								<EquippedItem label="BADGE" value={equipped.badge} />
								<EquippedItem label="COULEUR" value={equipped.color} />
								<EquippedItem label="TITRE" value={equipped.title} />
							</div>
						</div>

						{/* Right Column: Inventory & Achievements */}
						<div className="lg:col-span-2 space-y-8 md:space-y-12">
							<section>
								<h3 className="font-saiyan text-3xl text-dbz-orange border-b-2 border-dbz-orange pb-2 mb-6">
									INVENTAIRE ({user.inventory?.length || 0})
								</h3>
								<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
									{user.inventory && user.inventory.length > 0 ? (
										user.inventory.map((item, i) => (
											<div
												key={`${item.type}-${item.key}-${i}`}
												className="aspect-square bg-dbz-bg border-2 border-dbz-border p-2 flex flex-col items-center justify-center text-center hover:border-dbz-blue-light transition-colors group"
												title={`${item.type} · ${item.key}`}
											>
												<span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter break-all group-hover:text-dbz-blue-light transition-colors">
													{item.key}
												</span>
											</div>
										))
									) : (
										<p className="text-sm text-gray-500 font-bold uppercase">
											Inventaire vide.
										</p>
									)}
								</div>
							</section>

							<section>
								<h3 className="font-saiyan text-3xl text-dbz-orange border-b-2 border-dbz-orange pb-2 mb-6">
									DERNIERS SUCCÈS
								</h3>
								<div className="flex flex-wrap gap-3">
									{user.achievements && user.achievements.length > 0 ? (
										user.achievements.slice(0, 12).map((ach, i) => (
											<div
												key={`${ach.code}-${i}`}
												className="px-3 py-2 bg-dbz-bg border-2 border-dbz-yellow flex items-center gap-2 hover:bg-dbz-yellow/10 transition-colors"
											>
												<div className="w-2 h-2 bg-dbz-yellow animate-pulse" />
												<span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">
													{ach.code}
												</span>
											</div>
										))
									) : (
										<p className="text-sm text-gray-500 font-bold uppercase">
											Aucun succès débloqué.
										</p>
									)}
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function StatBox({
	label,
	value,
	tint,
}: {
	label: string;
	value: string;
	tint: string;
}) {
	return (
		<div className="bg-dbz-bg border-2 border-dbz-border p-4 text-center">
			<p className="text-[10px] md:text-xs font-bold text-dbz-blue-light uppercase tracking-widest mb-1">
				{label}
			</p>
			<p className={`scouter-text text-xl md:text-3xl ${tint}`}>{value}</p>
		</div>
	);
}

function EquippedItem({
	label,
	value,
}: {
	label: string;
	value: string | null | undefined;
}) {
	return (
		<div className="flex items-center justify-between p-3 bg-dbz-bg border-2 border-dbz-border hover:border-dbz-blue-light transition-colors">
			<span className="text-xs font-bold text-dbz-blue-light uppercase tracking-widest">
				{label}
			</span>
			<span
				className={
					value
						? "text-sm font-bold text-white uppercase tracking-wider"
						: "text-[10px] font-bold text-gray-600 uppercase"
				}
			>
				{value || "VIDE"}
			</span>
		</div>
	);
}
