import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/db-universe";
import { PageHero } from "@/components/PageHero";
import { SAGAS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Manga Dragon Ball — DBFR",
	description:
		"Index complet des volumes et chapitres du manga Dragon Ball et Dragon Ball Super. Couvertures HD et résumés.",
};

export default async function MangaIndex({
	searchParams,
}: {
	searchParams: Promise<{ series?: string }>;
}) {
	const sp = await searchParams;
	const series = sp.series ?? "DB";
	const data = await dbUniverse.mangaVolumes(series);
	const volumes = data?.volumes ?? [];

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Manga"
				title={series === "DB" ? "Dragon Ball" : "Dragon Ball Super"}
				lead="L'œuvre originale d'Akira Toriyama et sa suite par Toyotaro. Explorez tous les volumes et chapitres."
				image={SAGAS_HERO}
				imageAlt="Manga Dragon Ball"
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
				<nav className="mb-12 flex gap-4">
					<Link
						href="/wiki/manga?series=DB"
						className={`dbz-button-ghost !px-8 ${series === "DB" ? "bg-dbz-orange/20 border-dbz-orange text-white" : ""}`}
					>
						Dragon Ball
					</Link>
					<Link
						href="/wiki/manga?series=DBS"
						className={`dbz-button-ghost !px-8 ${series === "DBS" ? "bg-dbz-orange/20 border-dbz-orange text-white" : ""}`}
					>
						Dragon Ball Super
					</Link>
				</nav>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
					{volumes.map((v, idx) => (
						<Link
							key={v.id}
							href={`/wiki/manga/volume/${v.id}`}
							className="group flex flex-col dbz-panel overflow-hidden hover:scale-105 transition-all duration-300"
							style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
						>
							<div className="relative aspect-[2/3] bg-dbz-bg overflow-hidden">
								<div className="absolute inset-0 halftone opacity-10 z-10 pointer-events-none" />
								{v.cover ? (
									<Image
										src={assetUrl(v.cover)}
										alt={`Volume ${v.volume_number}`}
										fill
										sizes="(max-width: 640px) 50vw, 20vw"
										className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center bg-zinc-900">
										<span className="text-zinc-700 font-saiyan text-4xl">{v.volume_number}</span>
									</div>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
								<div className="absolute top-3 left-3 z-30">
									<span className="bg-dbz-orange text-black font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-widest">
										Vol. {v.volume_number}
									</span>
								</div>
							</div>
							<div className="p-4 bg-dbz-card/50 border-t border-dbz-border">
								<h3 className="font-display font-bold text-xs text-white line-clamp-2 group-hover:text-dbz-orange transition-colors">
									{v.title || `Volume ${v.volume_number}`}
								</h3>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
