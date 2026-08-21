"use client";

/**
 * Podium Top 3 communautaires — onglets par série / type.
 * Encourage les notes : empty state + CTA vers les grilles d'épisodes/films/jeux.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Crown, Medal, Star, Trophy } from "lucide-react";
import { WikiImg } from "@/components/wiki/WikiImg";
import type { CommunityTopBoard, CommunityTopsPayload } from "@/lib/community-tops";
import { onTablistKeyDown } from "@/lib/tablist-keys";

const RANK_META: Record<
	1 | 2 | 3,
	{ label: string; medal: string; ring: string; height: string; Icon: typeof Crown }
> = {
	1: {
		label: "1er",
		medal: "text-amber-300",
		ring: "border-amber-400/60 shadow-[0_0_28px_rgba(251,191,36,0.25)]",
		height: "pt-2 sm:pt-0",
		Icon: Crown,
	},
	2: {
		label: "2e",
		medal: "text-slate-200",
		ring: "border-slate-300/40",
		height: "pt-6 sm:pt-8",
		Icon: Medal,
	},
	3: {
		label: "3e",
		medal: "text-orange-400",
		ring: "border-orange-400/40",
		height: "pt-8 sm:pt-12",
		Icon: Medal,
	},
};

/** Ordre d'affichage podium : 2e · 1er · 3e */
const PODIUM_ORDER: (1 | 2 | 3)[] = [2, 1, 3];

function EmptySlot({ rank, browseHref }: { rank: 1 | 2 | 3; browseHref: string }) {
	const meta = RANK_META[rank];
	return (
		<div
			className={`flex flex-1 flex-col items-center ${meta.height}`}
			aria-label={`Place ${meta.label} encore libre`}
		>
			<div
				className={`relative flex w-full max-w-[9.5rem] flex-col overflow-hidden rounded-xl border border-dashed border-white/15 bg-black/25 sm:max-w-[11rem] ${meta.ring}`}
			>
				<div className="flex aspect-[2/3] items-center justify-center bg-gradient-to-b from-white/[0.04] to-transparent">
					<span className={`font-saiyan text-3xl opacity-30 ${meta.medal}`}>{rank}</span>
				</div>
				<div className="space-y-1 p-2.5 text-center">
					<p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
						Place libre
					</p>
					<p className="text-[10px] leading-snug text-white/50">Note pour l&apos;occuper</p>
				</div>
			</div>
			<Link
				href={browseHref}
				className="mt-2 text-[10px] font-bold uppercase tracking-widest text-dbz-orange/70 hover:text-dbz-orange"
			>
				Noter →
			</Link>
		</div>
	);
}

function PodiumCard({ board, rank }: { board: CommunityTopBoard; rank: 1 | 2 | 3 }) {
	const entry = board.entries.find((e) => e.rank === rank);
	const meta = RANK_META[rank];
	if (!entry) {
		return <EmptySlot rank={rank} browseHref={board.def.browseHref} />;
	}
	const Icon = meta.Icon;
	const isFirst = rank === 1;

	return (
		<div className={`flex flex-1 flex-col items-center ${meta.height}`}>
			<Link
				href={entry.href}
				className={`group relative flex w-full max-w-[9.5rem] flex-col overflow-hidden rounded-xl border bg-black/40 transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange sm:max-w-[11rem] ${meta.ring} ${
					isFirst ? "max-w-[11rem] sm:max-w-[12.5rem]" : ""
				}`}
				style={{
					borderColor: isFirst
						? "color-mix(in oklch, var(--tops-accent) 55%, transparent)"
						: undefined,
				}}
			>
				<div className="relative aspect-[2/3] overflow-hidden bg-dbz-bg">
					{entry.image ? (
						<WikiImg
							src={entry.image}
							alt={entry.title}
							sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
							loading="lazy"
						/>
					) : (
						<div className="absolute inset-0 flex items-center justify-center text-white/15">
							<Trophy className="h-10 w-10" />
						</div>
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
					<span
						className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.medal}`}
					>
						<Icon className="h-3 w-3" aria-hidden />
						{meta.label}
					</span>
					<span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-bold text-dbz-orange">
						<Star className="h-3 w-3 fill-current" aria-hidden />
						{entry.average.toFixed(1)}
					</span>
				</div>
				<div className="space-y-0.5 p-2.5">
					<p
						className={`line-clamp-2 font-display font-bold leading-tight text-white group-hover:text-dbz-orange ${
							isFirst ? "text-sm sm:text-[15px]" : "text-[12px] sm:text-sm"
						}`}
					>
						{entry.title}
					</p>
					{entry.subtitle && (
						<p className="line-clamp-1 text-[10px] uppercase tracking-wider text-white/50">
							{entry.subtitle}
						</p>
					)}
					<p className="text-[10px] text-white/50">
						{entry.count} note{entry.count > 1 ? "s" : ""}
					</p>
				</div>
			</Link>
		</div>
	);
}

function BoardPodium({ board }: { board: CommunityTopBoard }) {
	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-end justify-between gap-2">
				<div>
					<p
						className="text-[10px] font-bold uppercase tracking-[0.2em]"
						style={{ color: "var(--tops-accent)" }}
					>
						Classement communautaire
					</p>
					<h3 className="mt-1 font-saiyan text-xl uppercase leading-none text-white sm:text-2xl">
						{board.def.title}
					</h3>
					<p className="mt-1.5 max-w-xl text-sm text-white/55">{board.def.teaser}</p>
				</div>
				<div className="text-right text-[11px] uppercase tracking-wider text-white/50">
					{board.ratedCount > 0 ? (
						<>
							<span className="text-dbz-orange">{board.ratedCount}</span> noté
							{board.ratedCount > 1 ? "s" : ""} ·{" "}
							<span className="text-white/60">{board.totalVotes}</span> vote
							{board.totalVotes > 1 ? "s" : ""}
						</>
					) : (
						<span className="text-white/50">Aucun vote encore — sois le premier</span>
					)}
				</div>
			</div>

			<div className="flex items-end justify-center gap-2 sm:gap-4">
				{PODIUM_ORDER.map((rank) => (
					<PodiumCard key={rank} board={board} rank={rank} />
				))}
			</div>

			<div className="flex flex-wrap items-center justify-center gap-3 pt-1">
				<Link href={board.def.browseHref} className="home-cta home-cta--ghost text-sm">
					Voir tout & noter
				</Link>
				{board.entries.length > 0 && board.entries.length < 3 && (
					<p className="text-[11px] text-white/50">
						Encore {3 - board.entries.length} place
						{3 - board.entries.length > 1 ? "s" : ""} à prendre sur le podium
					</p>
				)}
			</div>
		</div>
	);
}

export function CommunityTops({
	data,
	compact = false,
	showHeader = true,
}: {
	data: CommunityTopsPayload;
	/** Mode home (moins de padding). */
	compact?: boolean;
	showHeader?: boolean;
}) {
	const boards = data.boards;
	const firstWithVotes = boards.findIndex((b) => b.entries.length > 0);
	const [active, setActive] = useState(
		firstWithVotes >= 0 ? boards[firstWithVotes]!.def.id : (boards[0]?.def.id ?? "episodes-dbz")
	);

	const board = useMemo(
		() => boards.find((b) => b.def.id === active) ?? boards[0],
		[boards, active]
	);

	if (!board) return null;

	return (
		<div
			className={compact ? "space-y-4" : "space-y-6"}
			style={{ ["--tops-accent" as string]: board.def.accent }}
			data-no-advance
		>
			{showHeader && (
				<div className="flex flex-wrap items-end justify-between gap-3">
					<div>
						<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-dbz-orange">
							Notes communautaires
						</p>
						<h2 className="mt-1 font-saiyan text-2xl uppercase text-white sm:text-3xl">
							Les Top 3 de la communauté
						</h2>
						<p className="mt-1 max-w-2xl text-sm text-white/55">
							Épisodes, films et jeux classés par vos notes. Note ton favori pour le faire entrer —
							ou rester — sur le podium.
							{data.globalVotes > 0 && (
								<>
									{" "}
									<span className="text-white/50">
										· {data.globalVotes} vote{data.globalVotes > 1 ? "s" : ""} au total
									</span>
								</>
							)}
						</p>
					</div>
					<Link
						href="/classements"
						className="text-[11px] font-bold uppercase tracking-widest text-dbz-orange/80 hover:text-dbz-orange"
					>
						Tous les classements →
					</Link>
				</div>
			)}

			<div
				className="flex flex-wrap gap-2"
				role="tablist"
				aria-label="Choisir un top 3"
				onKeyDown={onTablistKeyDown}
			>
				{boards.map((b) => {
					const selected = b.def.id === board.def.id;
					return (
						<button
							key={b.def.id}
							type="button"
							role="tab"
							aria-selected={selected}
							tabIndex={selected ? 0 : -1}
							onClick={() => setActive(b.def.id)}
							className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
								selected
									? "border-dbz-orange bg-dbz-orange/10 text-white"
									: "border-dbz-border text-white/60 hover:border-dbz-orange/40 hover:text-white"
							}`}
						>
							<span className="font-saiyan text-[11px] opacity-70" aria-hidden>
								{b.def.kanji}
							</span>
							{b.def.label}
							{b.entries.length > 0 && (
								<span className="rounded bg-white/10 px-1 text-[10px] tabular-nums text-dbz-orange">
									{b.entries[0]?.average.toFixed(1)}
								</span>
							)}
						</button>
					);
				})}
			</div>

			<div
				role="tabpanel"
				className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-6"
				style={{
					boxShadow: `inset 0 0 60px color-mix(in oklch, var(--tops-accent) 12%, transparent)`,
				}}
			>
				<BoardPodium board={board} />
			</div>
		</div>
	);
}

/** Variante page complète : tous les boards empilés (sans tabs). */
export function CommunityTopsFull({ data }: { data: CommunityTopsPayload }) {
	return (
		<div className="space-y-12">
			{data.boards.map((board) => (
				<section
					key={board.def.id}
					id={board.def.id}
					className="scroll-mt-24 rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-6"
					style={{ ["--tops-accent" as string]: board.def.accent }}
				>
					<BoardPodium board={board} />
				</section>
			))}
		</div>
	);
}
