import { dbUniverse, assetUrl, type Saga } from "@/lib/db-universe";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { SAGAS_HERO } from "@/lib/db-banners";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Sagas Dragon Ball — DBFR",
	description:
		"Toutes les sagas Dragon Ball, Dragon Ball Z, Dragon Ball Super, DBGT, DB Daima — résumées en français.",
};

const SERIES_LABELS: Record<string, string> = {
	DB: "Dragon Ball",
	DBZ: "Dragon Ball Z",
	DBGT: "Dragon Ball GT",
	DBS: "Dragon Ball Super (anime)",
	DBS_MANGA: "Dragon Ball Super (manga)",
	DBS_MOVIE: "Films Dragon Ball Super",
	DB_DAIMA: "Dragon Ball Daima",
};

const SERIES_ORDER = ["DB", "DBZ", "DBGT", "DBS", "DBS_MANGA", "DBS_MOVIE", "DB_DAIMA"];

export default async function SagasPage() {
	const data = await dbUniverse.sagas();
	if (!data || data.sagas.length === 0) notFound();
	const sagas = data.sagas;

	const bySeries = SERIES_ORDER.map((s) => ({
		key: s,
		label: SERIES_LABELS[s] ?? s,
		sagas: sagas.filter((sg) => sg.series === s).sort((a, b) => a.order_idx - b.order_idx),
	})).filter((g) => g.sagas.length > 0);

	return (
		<>
			<PageHero
				eyebrow="Univers Dragon Ball"
				title="Toutes les sagas"
				lead="De la quête des Dragon Balls par Goku enfant jusqu'au Monde des Démons de Daima — chaque arc narratif raconté en français."
				image={SAGAS_HERO}
				imageAlt="Bannière officielle Dragon Ball"
			/>
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
				{bySeries.map((g) => (
					<section key={g.key} className="mb-16">
						<h2 className="font-display font-bold text-[24px] text-white border-b border-white/10 pb-3 mb-6">
							{g.label} <span className="text-white/40">— {g.sagas.length}</span>
						</h2>
						<ol className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{g.sagas.map((s: Saga) => (
								<li key={s.id}>
									<Link
										href={`/wiki/sagas/${s.slug}`}
										className="group block rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-dbz-orange/60 hover:bg-white/[0.07] transition-colors h-full overflow-hidden"
									>
										{s.image ? (
											<>
												<div className="relative aspect-[16/5] w-full overflow-hidden">
													<img
														src={assetUrl(s.image)}
														alt={s.name}
														className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
														loading="lazy"
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
													<div className="absolute bottom-0 inset-x-0 p-4">
														<p className="font-display font-semibold text-[10px] tracking-[0.16em] uppercase text-dbz-orange mb-0.5">
															Saga {s.order_idx}
														</p>
														<h3 className="font-saiyan text-[18px] text-white leading-tight tracking-widest group-hover:text-dbz-orange transition-colors">
															{s.name}
														</h3>
														{s.name_ja && (
															<p className="font-jp text-[11px] text-dbz-orange/80 mt-1">
																{s.name_ja}
															</p>
														)}
													</div>
												</div>
												{s.description && (
													<p className="text-[12px] leading-relaxed text-white/65 line-clamp-2 px-4 py-3">
														{s.description}
													</p>
												)}
											</>
										) : (
											<div className="p-5">
												<p className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-dbz-orange mb-2">
													Saga {s.order_idx}
												</p>
												<h3 className="font-display font-bold text-[18px] text-white leading-tight mb-1.5 group-hover:text-dbz-orange transition-colors">
													{s.name}
												</h3>
												{s.name_ja && (
													<p className="font-jp text-[12px] text-dbz-orange/80 mb-3">{s.name_ja}</p>
												)}
												{s.description && (
													<p className="text-[13px] leading-relaxed text-white/65 line-clamp-3">
														{s.description}
													</p>
												)}
											</div>
										)}
									</Link>
								</li>
							))}
						</ol>
					</section>
				))}
			</div>
		</>
	);
}
