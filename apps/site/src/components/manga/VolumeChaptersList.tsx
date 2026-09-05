"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coche, Livre, Palette } from "@/components/icones";
import { assetUrl } from "@/lib/assets";
import { editionDe, LIBELLE_EDITION, type Edition } from "@/lib/manga-editions";
import { Etoile } from "@/components/MotifsCouverture";

interface Chapter {
	id: number;
	chapter_number: number;
	title: string | null;
	series: string;
	cover: string | null;
	pages?: string[] | null;
}

interface VolumeChaptersListProps {
	chapters: Chapter[];
}

export function VolumeChaptersList({ chapters }: VolumeChaptersListProps) {
	const [readChapterIds, setReadChapterIds] = useState<number[]>([]);
	const [edition, setEdition] = useState<Edition | null>(null);

	useEffect(() => {
		try {
			const saved = localStorage.getItem("dbfr_read_chapters");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					setReadChapterIds(parsed.map(Number));
				}
			}
		} catch (e) {
			console.error("Failed to load read chapters", e);
		}
		// L'édition demandée est lue depuis l'URL au montage, et NON via
		// `useSearchParams` : ce hook bascule la page en rendu dynamique et lui
		// ferait perdre son cache CDN, pour un simple onglet par défaut.
		try {
			const demandee = new URLSearchParams(window.location.search).get("edition");
			if (demandee === "couleur" || demandee === "nb") setEdition(demandee);
		} catch {
			// Pas d'URL exploitable : on garde le choix par défaut.
		}
	}, []);

	const tousLisibles = chapters.filter((ch) => ch.pages && ch.pages.length > 0);
	const parEdition: Record<Edition, typeof tousLisibles> = {
		nb: tousLisibles.filter((ch) => editionDe(ch) === "nb"),
		couleur: tousLisibles.filter((ch) => editionDe(ch) === "couleur"),
	};
	const editionsPresentes = (["nb", "couleur"] as const).filter((e) => parEdition[e].length > 0);
	// Une édition demandée mais absente de ce tome ne doit pas vider la page.
	const editionActive: Edition =
		edition && parEdition[edition].length > 0 ? edition : (editionsPresentes[0] ?? "nb");

	const readableChapters = editionsPresentes.length ? parEdition[editionActive] : tousLisibles;
	const readReadableChapters = readableChapters.filter((ch) => readChapterIds.includes(ch.id));
	const progressPercent =
		readableChapters.length > 0
			? Math.round((readReadableChapters.length / readableChapters.length) * 100)
			: 0;

	return (
		<div className="space-y-6">
			{/* Sélecteur d'édition : n'apparaît que si le tome existe dans les deux. */}
			{editionsPresentes.length > 1 && (
				<div className="flex flex-wrap gap-2" role="group" aria-label="Choisir l'édition à lire">
					{editionsPresentes.map((e) => {
						const actif = e === editionActive;
						const Icone = e === "couleur" ? Palette : Livre;
						return (
							<button
								key={e}
								type="button"
								onClick={() => setEdition(e)}
								aria-pressed={actif}
								className={`inline-flex h-11 items-center gap-2 rounded px-4 font-display text-sm font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60 ${
									actif
										? e === "couleur"
											? "bg-gradient-to-r from-fuchsia-500 to-amber-400 text-black"
											: "bg-dbz-orange text-black"
										: "border border-white/10 bg-black/40 text-white/70 hover:text-white"
								}`}
							>
								<Icone className="h-4 w-4" aria-hidden="true" />
								{LIBELLE_EDITION[e]}
								<span className="font-mono text-[10px] opacity-70 tabular-nums">
									{parEdition[e].length}
								</span>
							</button>
						);
					})}
				</div>
			)}

			{/* Barre de progression style Scouter */}
			{readableChapters.length > 0 && (
				<div className="dbz-panel p-4 bg-black/40 border border-white/5 space-y-2">
					<div className="flex justify-between items-center text-xs font-mono">
						<span className="scouter-text text-dbz-orange tracking-wider">
							PROGRESSION_LECTURE //
						</span>
						<span className="text-white font-bold">
							{readReadableChapters.length} / {readableChapters.length} CHAPITRES ({progressPercent}
							%)
						</span>
					</div>
					<div className="h-2 w-full bg-zinc-950 rounded overflow-hidden border border-white/5 relative">
						<div
							className="h-full bg-gradient-to-r from-dbz-orange/60 to-dbz-orange shadow-[0_0_10px_rgba(255,178,0,0.5)] transition-all duration-500 ease-out"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
				</div>
			)}

			<div className="grid gap-3">
				{readableChapters.map((ch) => {
					const isRead = readChapterIds.includes(ch.id);
					return (
						<Link
							key={ch.id}
							href={`/wiki/manga/${ch.id}`}
							onMouseEnter={() => {
								ch.pages?.slice(0, 3).forEach((page) => {
									const img = new Image();
									img.src = assetUrl(page);
								});
							}}
							className={`dbz-panel p-5 flex items-center justify-between hover:bg-white/5 transition-all group ${
								isRead
									? "border-emerald-500/20"
									: "hover:border-dbz-orange hover:shadow-[0_0_15px_rgba(255,178,0,0.15)]"
							}`}
						>
							<div className="flex items-center gap-6">
								<span
									className={`scouter-text text-xl min-w-[60px] ${isRead ? "text-emerald-400" : "text-dbz-orange"}`}
								>
									#{ch.chapter_number}
								</span>
								<p className="font-display font-bold text-white group-hover:text-dbz-orange transition-colors flex items-center gap-2">
									{/* Puce d'étoile : la ligne de titre du support s'ouvre ainsi. */}
									<Etoile taille={10} className="text-[var(--color-logo-rouge)]" />
									{ch.title || `Chapitre ${ch.chapter_number}`}
									{isRead && (
										<span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
											<Coche className="w-2.5 h-2.5" /> Lu
										</span>
									)}
								</p>
							</div>
							<span className="px-3 py-1 bg-dbz-orange/10 border border-dbz-orange text-dbz-orange rounded text-[10px] uppercase font-bold tracking-widest font-mono shadow-[0_0_10px_rgba(255,178,0,0.2)]">
								LIRE
							</span>
						</Link>
					);
				})}
				{readableChapters.length === 0 && (
					<p className="text-white/50 italic">Chapitres de ce tome en cours d&apos;ajout.</p>
				)}
			</div>
		</div>
	);
}
