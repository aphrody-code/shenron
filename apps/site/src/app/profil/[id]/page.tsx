import { getShenronUser, ShenronUser } from "@/lib/shenron";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

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
		`https://cdn.discordapp.com/embed/avatars/${parseInt(id) % 5}.png`;

	return (
		<div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
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
								<img
									src={avatar}
									alt={username}
									className="w-full h-full object-cover border-2 border-dbz-card"
								/>
							</div>
							<div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-dbz-orange text-white px-4 py-1 border-2 border-dbz-orange-dark z-20 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
								<span className="font-saiyan text-2xl uppercase whitespace-nowrap">
									LVL {user.level}
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
											{user.xpProgress.current.toLocaleString()} /{" "}
											{user.xpProgress.nextLevelXp.toLocaleString()} XP
										</span>
									</div>
									<div className="h-4 bg-dbz-bg border-2 border-dbz-border p-0.5 relative overflow-hidden">
										<div
											className="h-full shadow-[0_0_12px_rgba(168,85,247,0.6)]"
											style={{
												width: `${Math.min(100, (user.xpProgress.current / user.xpProgress.nextLevelXp) * 100)}%`,
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
						<div className="bg-dbz-bg border-2 border-dbz-border p-4 text-center">
							<p className="text-[10px] md:text-xs font-bold text-dbz-blue-light uppercase tracking-widest mb-1">
								XP Total
							</p>
							<p className="scouter-text text-xl md:text-3xl text-dbz-orange">
								{user.xp.toLocaleString()}
							</p>
						</div>
						<div className="bg-dbz-bg border-2 border-dbz-border p-4 text-center">
							<p className="text-[10px] md:text-xs font-bold text-dbz-blue-light uppercase tracking-widest mb-1">
								Zénis
							</p>
							<p className="scouter-text text-xl md:text-3xl text-dbz-yellow">
								{user.zeni.toLocaleString()}
							</p>
						</div>
						<div className="bg-dbz-bg border-2 border-dbz-border p-4 text-center">
							<p className="text-[10px] md:text-xs font-bold text-dbz-blue-light uppercase tracking-widest mb-1">
								Succès
							</p>
							<p className="scouter-text text-xl md:text-3xl text-white">
								{user.achievements?.length || 0}
							</p>
						</div>
						<div className="bg-dbz-bg border-2 border-dbz-border p-4 text-center">
							<p className="text-[10px] md:text-xs font-bold text-dbz-blue-light uppercase tracking-widest mb-1">
								Objets
							</p>
							<p className="scouter-text text-xl md:text-3xl text-white">
								{user.inventory?.length || 0}
							</p>
						</div>
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
									{user.inventory?.map((item: any, i: number) => (
										<div
											key={i}
											className="aspect-square bg-dbz-bg border-2 border-dbz-border p-2 flex flex-col items-center justify-center text-center hover:border-dbz-blue-light transition-colors group"
										>
											<span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter break-all group-hover:text-dbz-blue-light transition-colors">
												{item.key}
											</span>
										</div>
									)) || (
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
									{user.achievements
										?.slice(0, 12)
										.map((ach: any, i: number) => (
											<div
												key={i}
												className="px-3 py-2 bg-dbz-bg border-2 border-dbz-yellow flex items-center gap-2 hover:bg-dbz-yellow/10 transition-colors"
											>
												<div className="w-2 h-2 bg-dbz-yellow animate-pulse" />
												<span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">
													{ach.code}
												</span>
											</div>
										)) || (
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
