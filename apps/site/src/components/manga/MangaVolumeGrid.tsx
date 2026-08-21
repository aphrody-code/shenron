"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Library, Layers, Search, Award, Lock, Trophy, Palette } from "lucide-react";
import { assetUrl } from "@/lib/assets";

/** Un chapitre est « couleur » (édition Full Color) si son titre le signale. */
const isColorChapter = (title?: string | null) => /full\s*color|couleur/i.test(title ?? "");

export interface Volume {
	id: number;
	series: string;
	volumeNumber: number;
	title: string | null;
	cover: string | null;
}

export interface Chapter {
	id: number;
	chapter_number: number;
	title: string | null;
	series: string;
	cover: string | null;
	pages?: string[] | null;
	volume_id?: number | null;
}

interface LastReadChapter {
	id: number;
	chapter_number: number;
	title: string | null;
	series: string;
}

interface Achievement {
	id: string;
	title: string;
	desc: string;
	required: number;
}

interface MangaVolumeGridProps {
	dbVolumes: Volume[];
	dbsVolumes: Volume[];
	readableChapters: Chapter[];
}

const ACHIEVEMENTS: Achievement[] = [
	{
		id: "initiate",
		title: "Initié Z",
		desc: "Commencez votre entraînement en ouvrant et lisant au moins 1 chapitre.",
		required: 1,
	},
	{
		id: "warrior",
		title: "Guerrier de l'Espace",
		desc: "Dépassez la puissance moyenne d'un humain en lisant 10 chapitres.",
		required: 10,
	},
	{
		id: "super_saiyan",
		title: "Super Saiyan",
		desc: "Éveillez la légendaire colère dorée des Saiyans en lisant 30 chapitres.",
		required: 30,
	},
	{
		id: "divine",
		title: "Super Saiyan Divin",
		desc: "Ressentez le Ki divin et repoussez les limites mortelles en lisant 60 chapitres.",
		required: 60,
	},
	{
		id: "god",
		title: "Super Saiyan Blue",
		desc: "Combinez la puissance du Super Saiyan avec le Ki divin en lisant 80 chapitres.",
		required: 80,
	},
	{
		id: "instinct",
		title: "Ultra Instinct",
		desc: "Maîtrisez l'esprit et le corps sans y penser en lisant 100 chapitres.",
		required: 100,
	},
];

/** Carte d'un chapitre lisible (onglet Scans). Met en avant les éditions couleur. */
function MangaChapterCard({ chapter, idx }: { chapter: Chapter; idx: number }) {
	const color = isColorChapter(chapter.title);
	const prefetch = () => {
		chapter.pages?.slice(0, 3).forEach((page) => {
			const img = new window.Image();
			img.src = assetUrl(page);
		});
	};
	return (
		<Link
			href={`/wiki/manga/${chapter.id}`}
			onMouseEnter={prefetch}
			onTouchStart={prefetch}
			className={`group dbz-panel overflow-hidden transition-all duration-300 hover:scale-105 ${
				color ? "border-fuchsia-500/30 hover:border-fuchsia-400" : "hover:border-dbz-orange"
			}`}
			style={{ animationDelay: `${idx * 0.03}s` }}
		>
			<div className="relative aspect-[3/4] bg-dbz-bg overflow-hidden">
				<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
				{chapter.cover ? (
					<Image
						src={assetUrl(chapter.cover)}
						alt={chapter.title ?? `Chapitre ${chapter.chapter_number}`}
						fill
						sizes="(max-width: 768px) 50vw, 16vw"
						className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
						priority={idx < 6}
					/>
				) : (
					<div className="grid h-full w-full place-items-center">
						<BookOpen className="w-10 h-10 text-dbz-orange/20" aria-hidden="true" />
					</div>
				)}
				{color && (
					<span className="absolute top-2 right-2 z-30 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-black shadow-[0_0_10px_rgba(217,70,239,0.5)]">
						<Palette className="w-2.5 h-2.5" /> Couleur
					</span>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
				<div className="absolute inset-x-0 bottom-0 p-4 z-30">
					<span
						className={`scouter-text text-xs block mb-1 font-mono ${color ? "text-fuchsia-300" : "text-dbz-orange"}`}
					>
						{color ? "Dragon Ball · Couleur" : `${chapter.series} #${chapter.chapter_number}`}
					</span>
					<p className="font-display font-bold text-sm text-white group-hover:text-dbz-orange transition-colors line-clamp-2">
						{chapter.title ?? `Chapitre ${chapter.chapter_number}`}
					</p>
				</div>
			</div>
		</Link>
	);
}

export function MangaVolumeGrid({ dbVolumes, dbsVolumes, readableChapters }: MangaVolumeGridProps) {
	const [tab, setTab] = useState<"dbs" | "db" | "scans" | "achievements">("dbs");
	const [lastRead, setLastRead] = useState<LastReadChapter | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [readChapterIds, setReadChapterIds] = useState<number[]>([]);

	useEffect(() => {
		try {
			const savedLast = localStorage.getItem("dbfr_last_read_chapter");
			if (savedLast) {
				const parsed = JSON.parse(savedLast);
				if (parsed && typeof parsed === "object" && "id" in parsed) {
					setLastRead(parsed as LastReadChapter);
				}
			}

			const savedRead = localStorage.getItem("dbfr_read_chapters");
			if (savedRead) {
				const parsed = JSON.parse(savedRead);
				if (Array.isArray(parsed)) {
					setReadChapterIds(parsed.map(Number));
				}
			}
		} catch (e) {
			console.error("Failed to load reading states from localStorage", e);
		}
	}, []);

	// Seuls les tomes ayant au moins un chapitre lisible sont affichés : pas de
	// volume « mort » menant à une page de placeholders « Bientôt disponible ».
	const scanVolumeIds = new Set(
		readableChapters.map((c) => c.volume_id).filter((v): v is number => v != null)
	);

	// Filtrage par barre de recherche (+ tomes disponibles uniquement)
	const q = searchQuery.toLowerCase().trim();
	const matchesQuery = (vol: Volume) =>
		!q || vol.title?.toLowerCase().includes(q) || vol.volumeNumber.toString().includes(q);
	const filteredDbs = dbsVolumes.filter((vol) => scanVolumeIds.has(vol.id) && matchesQuery(vol));
	const filteredDb = dbVolumes.filter((vol) => scanVolumeIds.has(vol.id) && matchesQuery(vol));

	const filteredChapters = readableChapters.filter((ch) => {
		if (!q) return true;
		return ch.title?.toLowerCase().includes(q) || ch.chapter_number.toString().includes(q);
	});

	const colorChapters = filteredChapters.filter((ch) => isColorChapter(ch.title));
	const bwChapters = filteredChapters.filter((ch) => !isColorChapter(ch.title));
	// L'onglet « Dragon Ball » présente l'œuvre originale : édition couleur (DB).
	const dbColorChapters = colorChapters.filter((ch) => ch.series === "DB");

	// Métriques de succès
	const totalReadChapters = readChapterIds.length;
	const unlockedCount = ACHIEVEMENTS.filter((ach) => totalReadChapters >= ach.required).length;

	let currentRank = "Terrien";
	if (totalReadChapters >= 100) currentRank = "Ultra Instinct";
	else if (totalReadChapters >= 80) currentRank = "Super Saiyan Blue";
	else if (totalReadChapters >= 60) currentRank = "Super Saiyan Divin";
	else if (totalReadChapters >= 30) currentRank = "Super Saiyan";
	else if (totalReadChapters >= 10) currentRank = "Guerrier Saiyan";
	else if (totalReadChapters >= 1) currentRank = "Disciple de Tortue Géniale";

	const tabBtn =
		"flex items-center gap-2 px-5 py-3 border-b-2 border-transparent text-sm font-display font-semibold tracking-wider text-white/70 hover:text-white focus-visible:outline-none focus-visible:text-dbz-orange transition-all duration-300 whitespace-nowrap";
	const tabBtnActive =
		"flex items-center gap-2 px-5 py-3 border-b-2 border-dbz-orange text-sm font-display font-semibold tracking-wider text-dbz-orange transition-all duration-300 whitespace-nowrap";

	return (
		<div className="space-y-10">
			{/* Banner "Reprendre la lecture" */}
			{lastRead && (
				<div className="reveal-up dbz-panel p-5 bg-gradient-to-r from-dbz-orange/10 via-dbz-orange/5 to-transparent border border-dbz-orange/30 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(255,178,0,0.05)]">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-dbz-orange/10 rounded-full text-dbz-orange border border-dbz-orange/30 animate-pulse">
							<BookOpen className="w-5 h-5" />
						</div>
						<div className="space-y-1 text-center sm:text-left">
							<span className="scouter-text text-xs text-dbz-orange block tracking-wider font-mono">
								REPRENDRE_LA_LECTURE // ACTIVE_SESSION
							</span>
							<p className="font-display font-extrabold text-white text-base">
								{lastRead.series === "DB" ? "Dragon Ball" : "Dragon Ball Super"} · Chapitre{" "}
								{lastRead.chapter_number}
								{lastRead.title && (
									<span className="text-white/60 font-normal"> — {lastRead.title}</span>
								)}
							</p>
						</div>
					</div>
					<Link
						href={`/wiki/manga/${lastRead.id}`}
						className="px-5 py-2.5 bg-dbz-orange hover:bg-white text-black font-display font-black text-xs uppercase tracking-widest rounded shadow-[0_0_15px_rgba(255,178,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
					>
						Continuer la lecture →
					</Link>
				</div>
			)}

			{/* Sélecteur d'onglets (style Scouter) et recherche */}
			<div className="flex flex-col lg:flex-row border-b border-white/10 gap-4 pb-px justify-between items-start lg:items-center">
				<div
					role="tablist"
					className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none"
				>
					<button
						type="button"
						role="tab"
						id="manga-tab-dbs"
						aria-controls="manga-panel-dbs"
						aria-selected={tab === "dbs"}
						onClick={() => setTab("dbs")}
						className={tab === "dbs" ? tabBtnActive : tabBtn}
					>
						<Layers className="w-4 h-4" />
						Dragon Ball Super ({filteredDbs.length})
					</button>
					<button
						type="button"
						role="tab"
						id="manga-tab-db"
						aria-controls="manga-panel-db"
						aria-selected={tab === "db"}
						onClick={() => setTab("db")}
						className={tab === "db" ? tabBtnActive : tabBtn}
					>
						<Library className="w-4 h-4" />
						Dragon Ball ({filteredDb.length + dbColorChapters.length})
					</button>
					<button
						type="button"
						role="tab"
						id="manga-tab-scans"
						aria-controls="manga-panel-scans"
						aria-selected={tab === "scans"}
						onClick={() => setTab("scans")}
						className={tab === "scans" ? tabBtnActive : tabBtn}
					>
						<BookOpen className="w-4 h-4" />
						Scans ({filteredChapters.length})
					</button>
					<button
						type="button"
						role="tab"
						id="manga-tab-achievements"
						aria-controls="manga-panel-achievements"
						aria-selected={tab === "achievements"}
						onClick={() => setTab("achievements")}
						className={tab === "achievements" ? tabBtnActive : tabBtn}
					>
						<Award className="w-4 h-4" />
						Succès ({unlockedCount}/{ACHIEVEMENTS.length})
					</button>
				</div>

				{tab !== "achievements" && (
					<div className="relative w-full lg:w-72 flex-shrink-0">
						<span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dbz-orange/50">
							<Search className="w-4 h-4" />
						</span>
						<input
							type="text"
							placeholder="Rechercher un tome ou chapitre..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full bg-black/60 border border-white/10 rounded-md py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/30 focus:border-dbz-orange focus:ring-1 focus:ring-dbz-orange outline-none transition-all font-display font-medium shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]"
						/>
					</div>
				)}
			</div>

			{/* Grilles de contenu */}
			{tab === "dbs" && (
				<div
					role="tabpanel"
					id="manga-panel-dbs"
					aria-labelledby="manga-tab-dbs"
					className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 reveal-up"
				>
					{filteredDbs.map((vol, idx) => (
						<Link
							key={vol.id}
							href={`/wiki/manga/volume/${vol.id}`}
							className="group dbz-panel overflow-hidden hover:scale-105 hover:border-dbz-orange transition-all duration-300"
							style={{ animationDelay: `${idx * 0.02}s` }}
						>
							<div className="relative aspect-[2/3] bg-dbz-bg overflow-hidden">
								<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
								{vol.cover ? (
									<Image
										src={assetUrl(vol.cover)}
										alt={vol.title ?? `Tome ${vol.volumeNumber}`}
										fill
										sizes="(max-width: 768px) 50vw, 16vw"
										className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
										priority={idx < 6}
									/>
								) : (
									<div className="grid h-full w-full place-items-center bg-zinc-900 border border-white/5">
										<span className="font-saiyan text-5xl text-white/20 select-none">
											{vol.volumeNumber}
										</span>
									</div>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent z-20" />
								<div className="absolute inset-x-0 bottom-0 p-4 z-30">
									<span className="scouter-text text-xs text-dbz-orange block mb-1">
										Tome {vol.volumeNumber}
									</span>
									<p className="font-display font-bold text-sm text-white group-hover:text-dbz-orange transition-colors line-clamp-1">
										{vol.title ?? `Tome ${vol.volumeNumber}`}
									</p>
								</div>
							</div>
						</Link>
					))}
					{filteredDbs.length === 0 && (
						<div className="col-span-full py-16 text-center text-white/50 italic">
							Aucun volume ne correspond à votre recherche.
						</div>
					)}
				</div>
			)}

			{tab === "db" && (
				<div
					role="tabpanel"
					id="manga-panel-db"
					aria-labelledby="manga-tab-db"
					className="space-y-12 reveal-up"
				>
					{/* Dragon Ball original — édition couleur (contenu propre, self-hosté). */}
					{dbColorChapters.length > 0 && (
						<div className="space-y-5">
							<div className="flex items-center gap-3">
								<Palette className="w-5 h-5 text-fuchsia-400" aria-hidden="true" />
								<h3 className="font-saiyan text-2xl text-white tracking-widest">Édition Couleur</h3>
								<span className="text-[9px] px-2 py-0.5 rounded bg-gradient-to-r from-fuchsia-500 to-amber-400 text-black font-mono font-black uppercase tracking-wider">
									Full Color
								</span>
								<div className="h-px flex-1 bg-gradient-to-r from-fuchsia-500/40 to-transparent" />
							</div>
							<p className="text-xs text-white/50 max-w-2xl font-display">
								L&apos;œuvre originale d&apos;Akira Toriyama en couleur, téléchargée et lue
								directement sur DBFR.
							</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
								{dbColorChapters.map((chapter, idx) => (
									<MangaChapterCard key={chapter.id} chapter={chapter} idx={idx} />
								))}
							</div>
						</div>
					)}

					{filteredDb.length > 0 && (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
							{filteredDb.map((vol, idx) => (
								<Link
									key={vol.id}
									href={`/wiki/manga/volume/${vol.id}`}
									className="group dbz-panel overflow-hidden hover:scale-105 hover:border-dbz-orange transition-all duration-300"
									style={{ animationDelay: `${idx * 0.01}s` }}
								>
									<div className="relative aspect-[2/3] bg-dbz-bg overflow-hidden">
										<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
										{vol.cover ? (
											<Image
												src={assetUrl(vol.cover)}
												alt={vol.title ?? `Tome ${vol.volumeNumber}`}
												fill
												sizes="(max-width: 768px) 50vw, 16vw"
												className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
												priority={idx < 6}
											/>
										) : (
											<div className="grid h-full w-full place-items-center bg-zinc-900 border border-white/5">
												<span className="font-saiyan text-5xl text-white/20 select-none">
													{vol.volumeNumber}
												</span>
											</div>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent z-20" />
										<div className="absolute inset-x-0 bottom-0 p-4 z-30">
											<span className="scouter-text text-xs text-dbz-orange block mb-1">
												Tome {vol.volumeNumber}
											</span>
											<p className="font-display font-bold text-sm text-white group-hover:text-dbz-orange transition-colors line-clamp-1">
												{vol.title ?? `Tome ${vol.volumeNumber}`}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					)}

					{filteredDb.length === 0 && dbColorChapters.length === 0 && (
						<div className="py-16 text-center text-white/50 italic">
							Aucun volume ne correspond à votre recherche.
						</div>
					)}
				</div>
			)}

			{tab === "scans" && (
				<div
					role="tabpanel"
					id="manga-panel-scans"
					aria-labelledby="manga-tab-scans"
					className="space-y-12 reveal-up"
				>
					{/* Édition couleur (Full Color) mise en avant. */}
					{colorChapters.length > 0 && (
						<div className="space-y-5">
							<div className="flex items-center gap-3">
								<Palette className="w-5 h-5 text-fuchsia-400" aria-hidden="true" />
								<h3 className="font-saiyan text-2xl text-white tracking-widest">Édition Couleur</h3>
								<span className="text-[9px] px-2 py-0.5 rounded bg-gradient-to-r from-fuchsia-500 to-amber-400 text-black font-mono font-black uppercase tracking-wider">
									Full Color
								</span>
								<div className="h-px flex-1 bg-gradient-to-r from-fuchsia-500/40 to-transparent" />
							</div>
							<p className="text-xs text-white/50 max-w-2xl font-display">
								Dragon Ball en couleur, téléchargé et lu directement sur DBFR — aucune redirection
								vers un site externe.
							</p>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
								{colorChapters.map((chapter, idx) => (
									<MangaChapterCard key={chapter.id} chapter={chapter} idx={idx} />
								))}
							</div>
						</div>
					)}

					{/* Scans N&B. */}
					{bwChapters.length > 0 && (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
							{bwChapters.map((chapter, idx) => (
								<MangaChapterCard key={chapter.id} chapter={chapter} idx={idx} />
							))}
						</div>
					)}

					{filteredChapters.length === 0 && (
						<div className="py-16 text-center text-white/50 italic">
							Aucun chapitre ne correspond à votre recherche.
						</div>
					)}
				</div>
			)}

			{/* Onglet Succès & Gamification */}
			{tab === "achievements" && (
				<div
					role="tabpanel"
					id="manga-panel-achievements"
					aria-labelledby="manga-tab-achievements"
					className="reveal-up space-y-8"
				>
					<div className="dbz-panel p-6 bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
						<div className="space-y-1">
							<span className="scouter-text text-xs text-dbz-orange block tracking-wider font-mono">
								PROFIL_COMBATTANT // LEVEL_METRICS
							</span>
							<p className="font-display font-black text-2xl text-white">Statistiques de Lecture</p>
						</div>
						<div className="grid grid-cols-2 gap-8 text-center md:text-left">
							<div>
								<span className="block text-[10px] uppercase text-white/50 tracking-wider font-mono">
									Chapitres Lus
								</span>
								<span className="font-saiyan text-3xl text-dbz-orange tracking-widest leading-none">
									{totalReadChapters}
								</span>
							</div>
							<div>
								<span className="block text-[10px] uppercase text-white/50 tracking-wider font-mono">
									Rang Débloqué
								</span>
								<span className="font-saiyan text-2xl text-white tracking-widest leading-none block mt-1">
									{currentRank}
								</span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{ACHIEVEMENTS.map((ach) => {
							const isUnlocked = totalReadChapters >= ach.required;
							return (
								<div
									key={ach.id}
									className={`dbz-panel p-6 border transition-all duration-300 relative overflow-hidden group ${
										isUnlocked
											? "border-dbz-orange/30 bg-dbz-card shadow-[0_0_15px_rgba(255,178,0,0.05)] hover:border-dbz-orange"
											: "border-white/5 bg-zinc-950/20 opacity-60"
									}`}
								>
									<div className="absolute inset-0 halftone opacity-5 pointer-events-none" />
									<div className="relative z-10 flex items-start gap-4">
										<div
											className={`p-3 rounded-lg border ${
												isUnlocked
													? "bg-dbz-orange/10 text-dbz-orange border-dbz-orange/20"
													: "bg-zinc-900 text-zinc-600 border-zinc-800"
											}`}
										>
											{isUnlocked ? <Trophy className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
										</div>
										<div className="space-y-1 flex-1">
											<div className="flex justify-between items-start gap-2">
												<h4 className="font-display font-extrabold text-sm text-white group-hover:text-dbz-orange transition-colors">
													{ach.title}
												</h4>
												<span
													className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase ${
														isUnlocked
															? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
															: "bg-zinc-800 text-zinc-500"
													}`}
												>
													{isUnlocked ? "Obtenu" : `${totalReadChapters}/${ach.required}`}
												</span>
											</div>
											<p className="text-xs text-white/60 font-display leading-relaxed">
												{ach.desc}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
