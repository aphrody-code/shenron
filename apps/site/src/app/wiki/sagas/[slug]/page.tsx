import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const SERIES_LABELS: Record<string, string> = {
	DB: "Dragon Ball",
	DBZ: "Dragon Ball Z",
	DBGT: "Dragon Ball GT",
	DBS: "Dragon Ball Super (anime)",
	DBS_MANGA: "Dragon Ball Super (manga)",
	DBS_MOVIE: "Films Dragon Ball Super",
	DB_DAIMA: "Dragon Ball Daima",
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const data = await dbUniverse.saga(slug);
	if (!data) return { title: "Saga — DBFR" };
	return {
		title: `${data.saga.name} — Saga Dragon Ball | DBFR`,
		description:
			data.saga.description ??
			`Saga ${data.saga.name} de ${SERIES_LABELS[data.saga.series] ?? data.saga.series}.`,
	};
}

export default async function SagaPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const data = await dbUniverse.saga(slug);
	if (!data) notFound();
	const { saga, arcs } = data;
	const seriesLabel = SERIES_LABELS[saga.series] ?? saga.series;

	return (
		<div className="mx-auto max-w-[920px] px-6 lg:px-10 py-16 lg:py-24">
			<Link
				href="/wiki/sagas"
				className="inline-flex items-center gap-2 text-[13px] font-display font-semibold tracking-[0.10em] uppercase text-dbz-orange hover:text-white transition-colors mb-8"
			>
				← Toutes les sagas
			</Link>

			<header className="mb-12">
				<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-3">
					{seriesLabel} · Saga {saga.order_idx}
				</p>
				<h1 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white mb-4">
					{saga.name}
				</h1>
				{saga.name_ja && (
					<p className="font-jp text-[20px] text-dbz-orange/85 mb-6">
						{saga.name_ja}
					</p>
				)}
				{saga.description && (
					<p className="text-[17px] leading-relaxed text-white/75">
						{saga.description}
					</p>
				)}
			</header>

			{arcs.length > 0 && (
				<section className="mb-16">
					<h2 className="font-display font-bold text-[24px] text-white border-b border-white/10 pb-3 mb-6">
						Arcs narratifs{" "}
						<span className="text-white/40">— {arcs.length}</span>
					</h2>
					<ol className="space-y-3">
						{arcs.map((a) => (
							<li
								key={a.id}
								className="p-5 rounded-xl bg-white/[0.04] border border-white/[0.06]"
							>
								<p className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-dbz-orange mb-1">
									Arc {a.order_idx}
								</p>
								<h3 className="font-display font-bold text-[18px] text-white">
									{a.name}
								</h3>
								{a.name_ja && (
									<p className="font-jp text-[12px] text-dbz-orange/80 mt-1">
										{a.name_ja}
									</p>
								)}
								{a.description && (
									<p className="text-[14px] text-white/70 leading-relaxed mt-2">
										{a.description}
									</p>
								)}
							</li>
						))}
					</ol>
				</section>
			)}

			<section className="p-8 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
				<h2 className="font-display font-bold text-[18px] text-white mb-3">
					Aller plus loin
				</h2>
				<div className="flex flex-wrap gap-3">
					<Link
						href={`/wiki/episodes?series=${saga.series}`}
						className="inline-flex items-center h-10 px-4 rounded-full bg-dbz-orange text-black font-display font-bold text-[12px] tracking-[0.10em] uppercase hover:bg-white transition-colors"
					>
						Voir les épisodes
					</Link>
					<Link
						href="/wiki/dragon-ball"
						className="inline-flex items-center h-10 px-4 rounded-full border border-white/20 hover:border-dbz-orange text-white font-display font-semibold text-[12px] tracking-[0.10em] uppercase transition-colors"
					>
						Personnages de la saga
					</Link>
				</div>
			</section>
		</div>
	);
}
