/**
 * WikiArticle — rendu d'un article wiki long-format (Fandom-like) + ses sources.
 *
 * Article = corps markdown riche (sections, listes, tableaux, HTML mis en page)
 * rendu via <WikiMarkdown/> (sanitize owner-trust). Le bloc « Sources » liste les
 * références citées dans l'article (`articleSources`) en pied façon encyclopédie,
 * avec lien externe quand l'URL est connue. RSC pur (aucun "use client").
 *
 * Drop-in sur toute page détail wiki (personnage, planète, saga, arc, technique).
 */
import type { WikiSource } from "@/lib/shenron";
import { WikiMarkdown } from "./WikiMarkdown";

/** Libellé court du type de source (kind RAG → étiquette FR). */
function kindLabel(kind: string): string {
	switch (kind) {
		case "manga_chapter":
		case "manga_volume":
			return "Manga";
		case "character":
		case "technique":
		case "transformation":
		case "planet":
		case "saga":
		case "arc":
		case "race":
			return "Base DBFR";
		case "episode":
			return "Épisode";
		case "movie":
			return "Film";
		case "game":
			return "Jeu";
		default:
			return "Source";
	}
}

export function WikiArticle({
	article,
	sources,
	heading = "Article",
	accent = "orange",
}: {
	article: string;
	sources?: WikiSource[] | null;
	heading?: string;
	/** Couleur d'accent du bandeau (orange par défaut, varie par type d'entité). */
	accent?: "orange" | "blue" | "red";
}) {
	const accentClass =
		accent === "blue"
			? "text-dbz-blue-light"
			: accent === "red"
				? "text-dbz-red"
				: "text-dbz-orange";
	const barClass =
		accent === "blue" ? "bg-dbz-blue-light" : accent === "red" ? "bg-dbz-red" : "bg-dbz-orange";
	const lineClass =
		accent === "blue"
			? "from-dbz-blue-light/50"
			: accent === "red"
				? "from-dbz-red/50"
				: "from-dbz-orange/50";

	const cited = (sources ?? []).filter((s) => s && s.label);

	return (
		<section className="reveal-up" style={{ animationDelay: "0.45s" }}>
			<div className="dbz-panel p-6 sm:p-8 lg:p-10 overflow-hidden relative">
				<div className={`absolute top-0 left-0 w-1 h-full ${barClass}`} />
				<div className="flex items-center gap-6 mb-8">
					<h2
						className={`${accentClass} font-saiyan text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest`}
					>
						{heading}
					</h2>
					<div className={`h-px flex-1 bg-gradient-to-r ${lineClass} to-transparent`} />
				</div>

				<div className="prose prose-invert max-w-none wiki-content wiki-lore">
					<WikiMarkdown body={article} />
				</div>

				{cited.length > 0 && (
					<footer className="mt-10 pt-6 border-t border-white/10">
						<h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4">
							Sources & références
						</h3>
						<ol className="space-y-1.5 text-sm">
							{cited.map((s) => (
								<li key={s.n} className="flex gap-3 text-white/60">
									<span className={`shrink-0 font-mono text-xs ${accentClass}`}>[{s.n}]</span>
									{s.url ? (
										<a
											href={s.url}
											target="_blank"
											rel="noopener noreferrer nofollow"
											className="hover:text-white transition-colors link-underline break-words"
										>
											{s.label}
											<span className="ml-2 text-[10px] uppercase tracking-widest text-white/30">
												{kindLabel(s.kind)}
											</span>
										</a>
									) : (
										<span className="break-words">
											{s.label}
											<span className="ml-2 text-[10px] uppercase tracking-widest text-white/30">
												{kindLabel(s.kind)}
											</span>
										</span>
									)}
								</li>
							))}
						</ol>
					</footer>
				)}
			</div>
		</section>
	);
}
