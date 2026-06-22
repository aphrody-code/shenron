"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { assetUrl } from "@/lib/assets";

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
	}, []);

	// Calculer la progression
	const readableChapters = chapters.filter((ch) => ch.pages && ch.pages.length > 0);
	const readReadableChapters = readableChapters.filter((ch) => readChapterIds.includes(ch.id));
	const progressPercent =
		readableChapters.length > 0
			? Math.round((readReadableChapters.length / readableChapters.length) * 100)
			: 0;

	return (
		<div className="space-y-6">
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
									{ch.title || `Chapitre ${ch.chapter_number}`}
									{isRead && (
										<span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
											<Check className="w-2.5 h-2.5" /> Lu
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
					<p className="text-white/40 italic">Chapitres de ce tome en cours d&apos;ajout.</p>
				)}
			</div>
		</div>
	);
}
