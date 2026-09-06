"use client";

/**
 * Rail « Reprendre » — les dernières fiches ouvertes, tirées de l'historique local.
 *
 * Rend `null` tant qu'il n'y a rien : un nouveau visiteur ne doit pas voir un
 * bloc vide. Le premier rendu est donc TOUJOURS `null` côté serveur ET au
 * montage client, puis l'état arrive après l'effet — c'est ce qui évite une
 * divergence d'hydratation (le serveur n'a aucun accès à `localStorage`).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Croix } from "@/components/icones";
import { assetUrl } from "@/lib/assets";
import { forgetHistory, readHistory, HISTORY_EVENT, type HistoryEntry } from "@/lib/history";

const KIND_LABEL: Record<HistoryEntry["kind"], string> = {
	episode: "Épisode",
	movie: "Film",
	chapter: "Chapitre",
	databook: "Databook",
};

export function ContinueRail({
	limit = 12,
	kinds,
	title = "Reprendre",
	className = "",
}: {
	limit?: number;
	/** Restreint le rail à certains types (ex. `["chapter"]` sur /wiki/manga). */
	kinds?: ReadonlyArray<HistoryEntry["kind"]>;
	title?: string;
	className?: string;
}) {
	const [items, setItems] = useState<HistoryEntry[] | null>(null);

	useEffect(() => {
		const load = () => {
			const all = readHistory();
			setItems((kinds ? all.filter((e) => kinds.includes(e.kind)) : all).slice(0, limit));
		};
		load();
		window.addEventListener(HISTORY_EVENT, load);
		return () => window.removeEventListener(HISTORY_EVENT, load);
	}, [limit, kinds]);

	if (!items || items.length === 0) return null;

	return (
		<section className={`mb-9 lg:mb-12 ${className}`} aria-label={title}>
			<h2 className="mb-3 flex items-baseline gap-2 font-display text-[19px] font-bold text-white">
				<span className="inline-block h-4 w-1 rounded-full bg-dbz-orange" aria-hidden />
				{title}
				<span className="text-[13px] font-normal text-white/50">{items.length}</span>
			</h2>
			<ul className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{items.map((e) => (
					<li key={`${e.kind}:${e.id}`} className="relative shrink-0 snap-start">
						<Link
							href={e.href}
							className="group block w-[240px] overflow-hidden rounded-lg border border-white/[0.08] bg-dbz-card transition-colors hover:border-dbz-orange/50"
						>
							<div className="relative aspect-video overflow-hidden bg-black/40">
								{e.image ? (
									<img
										src={assetUrl(e.image)}
										alt=""
										loading="lazy"
										className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
									/>
								) : (
									<div className="grid h-full w-full place-items-center text-white/50">
										{KIND_LABEL[e.kind]}
									</div>
								)}
							</div>
							<div className="p-2.5">
								<p className="truncate text-[13px] font-semibold text-white">{e.title}</p>
								<p className="mt-0.5 truncate text-[11px] text-white/50">
									{e.caption ?? KIND_LABEL[e.kind]}
								</p>
							</div>
						</Link>
						<button
							type="button"
							onClick={() => forgetHistory(e.kind, e.id)}
							aria-label={`Retirer « ${e.title} » de l'historique`}
							className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white/70 opacity-0 transition-opacity hover:text-white focus-visible:opacity-100 group-hover:opacity-100 md:opacity-0"
						>
							<Croix className="h-3.5 w-3.5" aria-hidden />
						</button>
					</li>
				))}
			</ul>
		</section>
	);
}
