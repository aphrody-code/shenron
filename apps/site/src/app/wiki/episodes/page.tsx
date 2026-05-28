import { dbUniverse, assetUrl } from "@/lib/db-universe";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { bannerForSeries } from "@/lib/db-banners";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Épisodes anime Dragon Ball — DBFR",
	description:
		"Tous les épisodes Dragon Ball / DBZ / DBZ Kai / GT / DB Super / Daima — index complet avec vignettes, titres FR/JP, date de diffusion et synopsis.",
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

function excerpt(text: string | null, max = 160): string {
	if (!text) return "";
	const clean = text
		.replace(/_?\(Sources?\s*:[^)]*\)_?/gi, "")
		.replace(/[*_#>`]/g, "")
		.replace(/\s+/g, " ")
		.trim();
	return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

export default async function EpisodesIndex({
	searchParams,
}: {
	searchParams: Promise<{ series?: string; page?: string; view?: string }>;
}) {
	const sp = await searchParams;
	const series = sp.series ?? "DBZ";
	const page = Math.max(1, parseInt(sp.page ?? "1", 10));
	const view = sp.view ?? "grid";
	const limit = view === "grid" ? 48 : 100;
	const offset = (page - 1) * limit;

	const data = await dbUniverse.episodes(series, limit, offset);
	if (!data || data.episodes.length === 0) notFound();
	const { episodes, total } = data;
	const pages = Math.ceil(total / limit);

	return (
		<>
			<PageHero
				eyebrow="Anime"
				title={SERIES_LABELS[series] ?? series}
				lead="Index complet des épisodes — vignettes, titres japonais, dates de diffusion, synopsis."
				image={bannerForSeries(series)}
				imageAlt={`Bannière ${SERIES_LABELS[series] ?? series}`}
			/>
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
				<div className="mb-10 flex flex-wrap items-center justify-between gap-4">
					<nav className="flex flex-wrap gap-2">
						{Object.entries(SERIES_LABELS).map(([key, label]) => (
							<Link
								key={key}
								href={`/wiki/episodes?series=${key}&view=${view}`}
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
					<div className="flex gap-2 shrink-0">
						<Link
							href={`/wiki/episodes?series=${series}&view=grid`}
							className={`px-3 py-1.5 rounded-lg font-display font-semibold text-[11px] uppercase tracking-wider transition-colors ${
								view === "grid"
									? "bg-dbz-orange text-black"
									: "bg-white/[0.06] text-white/60 hover:bg-white/[0.12]"
							}`}
						>
							Grille
						</Link>
						<Link
							href={`/wiki/episodes?series=${series}&view=list`}
							className={`px-3 py-1.5 rounded-lg font-display font-semibold text-[11px] uppercase tracking-wider transition-colors ${
								view === "list"
									? "bg-dbz-orange text-black"
									: "bg-white/[0.06] text-white/60 hover:bg-white/[0.12]"
							}`}
						>
							Liste
						</Link>
					</div>
				</div>

				<h2 className="font-display font-bold text-[20px] text-white border-b border-white/10 pb-3 mb-6">
					{SERIES_LABELS[series] ?? series}{" "}
					<span className="text-white/40">— {total} épisodes</span>
				</h2>

				{view === "grid" ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{episodes.map((ep, idx) => (
							<Link
								key={ep.id}
								href={`/wiki/episodes/${ep.id}`}
								className="group dbz-panel overflow-hidden hover:scale-[1.03] transition-all duration-300"
								style={{ animationDelay: `${0.01 * (idx % 12)}s` }}
							>
								<div className="relative aspect-video bg-dbz-bg overflow-hidden">
									{ep.image ? (
										<img
											src={assetUrl(ep.image)}
											alt={ep.title}
											className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
											loading="lazy"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-zinc-900">
											<span className="text-zinc-700 font-saiyan text-lg">
												{String(ep.number_in_series).padStart(3, "0")}
											</span>
										</div>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
									<div className="absolute top-1.5 left-1.5">
										<span className="scouter-text text-[9px] text-dbz-orange bg-black/60 px-1.5 py-0.5">
											#{String(ep.number_in_series).padStart(3, "0")}
										</span>
									</div>
									<div className="absolute inset-x-0 bottom-0 p-2">
										<p className="font-display font-bold text-[10px] text-white leading-tight group-hover:text-dbz-orange transition-colors line-clamp-2">
											{ep.title}
										</p>
										{ep.title_ja && (
											<p className="font-jp text-[9px] text-white/30 mt-0.5 truncate">
												{ep.title_ja}
											</p>
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<ol className="divide-y divide-white/[0.06]">
						{episodes.map((ep) => (
							<li key={ep.id}>
								<Link
									href={`/wiki/episodes/${ep.id}`}
									className="grid grid-cols-[60px_auto_1fr_auto] gap-5 py-4 items-center group hover:bg-white/[0.02] px-4 -mx-4 rounded-lg transition-colors"
								>
									<span className="scouter-text text-lg text-dbz-orange">
										{String(ep.number_in_series).padStart(3, "0")}
									</span>
									{ep.image ? (
										<div className="w-20 aspect-video overflow-hidden rounded bg-dbz-bg shrink-0">
											<img
												src={assetUrl(ep.image)}
												alt=""
												className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
												loading="lazy"
											/>
										</div>
									) : (
										<div className="w-20 aspect-video rounded bg-zinc-900 shrink-0" />
									)}
									<div>
										<p className="font-display font-bold text-[15px] text-white group-hover:text-dbz-orange transition-colors leading-snug">
											{ep.title}
										</p>
										{ep.title_ja && (
											<p className="font-jp text-[12px] text-white/30 mt-1">
												{ep.title_ja}
											</p>
										)}
										{ep.synopsis && (
											<p className="text-[12px] text-white/45 mt-1.5 line-clamp-2 hidden md:block">
												{excerpt(ep.synopsis)}
											</p>
										)}
									</div>
									<div className="flex items-center gap-4">
										<span className="text-[11px] text-white/40 whitespace-nowrap font-display tracking-widest uppercase hidden sm:block">
											{ep.air_date
												? new Date(ep.air_date * 1000).toLocaleDateString("fr-FR", {
														month: "short",
														year: "numeric",
													})
												: ""}
										</span>
										<span className="text-dbz-orange opacity-0 group-hover:opacity-100 transition-opacity text-xl">
											→
										</span>
									</div>
								</Link>
							</li>
						))}
					</ol>
				)}

				{pages > 1 && (
					<nav className="mt-10 flex items-center justify-center gap-2 flex-wrap">
						{Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
							<Link
								key={p}
								href={`/wiki/episodes?series=${series}&page=${p}&view=${view}`}
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
		</>
	);
}
