import Link from "next/link";
import { dbUniverse } from "@/lib/db-universe";

/** Pertinence normalisée → libellé + couleur (heuristique d'affichage). */
function relevance(score?: number): { label: string; cls: string } | null {
	if (typeof score !== "number") return null;
	if (score >= 0.66) return { label: "Très pertinent", cls: "text-emerald-300 border-emerald-400/40" };
	if (score >= 0.45) return { label: "Pertinent", cls: "text-amber-300 border-amber-400/40" };
	return { label: "Contexte", cls: "text-zinc-400 border-zinc-500/40" };
}

export default async function WikiRagArchives({
	query,
	limit = 4,
}: {
	query: string;
	limit?: number;
}) {
	const ragData = await dbUniverse.rag(query, limit);
	if (!ragData || ragData.results.length === 0) return null;

	return (
		<section className="space-y-8 pt-12 reveal-up animate-fade-in">
			<div className="flex items-center gap-6">
				<h2 className="font-saiyan text-2xl sm:text-4xl md:text-5xl text-emerald-400 uppercase tracking-widest flex items-center gap-2">
					<span>📟</span> ARCHIVES DE RECHERCHE IA (RAG)
				</h2>
				<div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{ragData.results.map((r, i) => (
					<div
						key={i}
						className="dbz-panel p-6 border-l-4 border-l-emerald-500/40 bg-emerald-950/5 relative overflow-hidden group"
					>
						<div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500/30 group-hover:border-emerald-400 transition-colors" />
						<div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/30 group-hover:border-emerald-400 transition-colors" />

						<div className="flex justify-between items-start mb-3 gap-2">
							<h4 className="font-display font-bold text-white group-hover:text-emerald-400 transition-colors text-sm">
								{r.title}
							</h4>
							<div className="flex items-center gap-1.5 shrink-0">
								{(() => {
									const rel = relevance(r.score);
									return rel ? (
										<span
											className={`text-[9px] font-mono bg-black/30 border ${rel.cls} px-2 py-0.5 rounded font-bold uppercase`}
										>
											{rel.label}
										</span>
									) : null;
								})()}
								<span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">
									{r.kind}
								</span>
							</div>
						</div>
						<p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-4">
							{r.snippet}
						</p>
						<div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap justify-between items-center text-[10px] font-mono text-emerald-500/40 gap-2">
							<span>
								SOURCE:{" "}
								{r.url.startsWith("/")
									? "dragonballfr.com"
									: r.url.replace("https://", "").replace("http://", "").split("/")[0]}
							</span>
							{r.url.startsWith("/") ? (
								<Link
									href={r.url}
									className="text-emerald-400 hover:text-white transition-colors uppercase tracking-widest font-bold flex items-center gap-1"
								>
									Consulter{" "}
									<span className="translate-x-0 group-hover:translate-x-0.5 transition-transform">
										→
									</span>
								</Link>
							) : (
								<a
									href={r.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-emerald-400 hover:text-white transition-colors uppercase tracking-widest font-bold flex items-center gap-1"
								>
									Consulter{" "}
									<span className="translate-x-0 group-hover:translate-x-0.5 transition-transform">
										→
									</span>
								</a>
							)}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
