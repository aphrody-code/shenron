import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 1800;

export const metadata: Metadata = {
	title: "Épisodes anime Dragon Ball — DBFR",
	description:
		"Tous les épisodes Dragon Ball / DBZ / DBZ Kai / GT / DB Super / Daima — index complet avec titres FR/JP, date de diffusion et synopsis.",
};

const SERIES_LABELS: Record<string, string> = {
	DB: "Dragon Ball (1986-1989)",
	DBZ: "Dragon Ball Z (1989-1996)",
	DBZ_KAI: "Dragon Ball Z Kai (2009-2011)",
	DBZ_KAI_FINAL: "Dragon Ball Z Kai – Final Chapters (2014-2015)",
	DBGT: "Dragon Ball GT (1996-1997)",
	DBS: "Dragon Ball Super (2015-2018)",
	DB_DAIMA: "Dragon Ball Daima (2024-2025)",
};

export default async function EpisodesIndex({
	searchParams,
}: {
	searchParams: Promise<{ series?: string; page?: string }>;
}) {
	const sp = await searchParams;
	const series = sp.series ?? "DBZ";
	const page = Math.max(1, parseInt(sp.page ?? "1", 10));
	const limit = 100;
	const offset = (page - 1) * limit;

	const data = await dbUniverse.episodes(series, limit, offset);
	if (!data || data.episodes.length === 0) notFound();
	const { episodes, total } = data;
	const pages = Math.ceil(total / limit);

	return (
		<div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16 lg:py-24">
			<header className="mb-10">
				<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4">
					Anime
				</p>
				<h1 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white mb-5">
					Épisodes
				</h1>
				<p className="text-[17px] leading-relaxed text-white/70 max-w-2xl mb-8">
					Index complet des séries Dragon Ball — chaque épisode avec titre
					original japonais, date de diffusion et synopsis.
				</p>

				<nav className="flex flex-wrap gap-2">
					{Object.entries(SERIES_LABELS).map(([key, label]) => (
						<Link
							key={key}
							href={`/wiki/episodes?series=${key}`}
							className={`px-3 py-1.5 rounded-full font-display font-semibold text-[12px] tracking-[0.08em] uppercase transition-colors ${
								series === key
									? "bg-dbz-orange text-black"
									: "bg-white/[0.06] text-white/72 hover:bg-white/[0.12]"
							}`}
						>
							{label.split(" (")[0]}
						</Link>
					))}
				</nav>
			</header>

			<h2 className="font-display font-bold text-[20px] text-white border-b border-white/10 pb-3 mb-6">
				{SERIES_LABELS[series] ?? series}{" "}
				<span className="text-white/40">— {total} épisodes</span>
			</h2>

			<ol className="divide-y divide-white/[0.06]">
				{episodes.map((ep) => (
					<li
						key={ep.id}
						className="grid grid-cols-[60px_1fr_auto] gap-5 py-4 items-baseline"
					>
						<span className="font-display font-bold text-[16px] text-dbz-orange tabular-nums">
							{String(ep.number_in_series).padStart(3, "0")}
						</span>
						<div>
							<p className="font-display font-semibold text-[15px] text-white leading-snug">
								{ep.title}
							</p>
							{ep.title_ja && (
								<p className="font-jp text-[12px] text-dbz-orange/75 mt-0.5">
									{ep.title_ja}
								</p>
							)}
						</div>
						<span className="text-[12px] text-white/50 whitespace-nowrap font-display tracking-wide">
							{ep.air_date
								? new Date(ep.air_date).toLocaleDateString("fr-FR", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})
								: ""}
						</span>
					</li>
				))}
			</ol>

			{pages > 1 && (
				<nav className="mt-10 flex items-center justify-center gap-2 flex-wrap">
					{Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
						<Link
							key={p}
							href={`/wiki/episodes?series=${series}&page=${p}`}
							className={`min-w-[36px] h-9 px-3 rounded-md grid place-items-center font-display font-semibold text-[13px] transition-colors ${
								p === page
									? "bg-dbz-orange text-black"
									: "bg-white/[0.06] text-white/72 hover:bg-white/[0.12]"
							}`}
						>
							{p}
						</Link>
					))}
				</nav>
			)}
		</div>
	);
}
