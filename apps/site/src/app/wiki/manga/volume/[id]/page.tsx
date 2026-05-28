import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import { assetUrl } from "@/lib/db-universe";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const volume = await dbUniverse.mangaVolume(parseInt(id));
	if (!volume) return { title: "Volume Manga — DBFR" };
	return {
		title: `${volume.series} Volume ${volume.volume_number} — Manga Dragon Ball | DBFR`,
		description: volume.title ?? `Volume ${volume.volume_number} du manga ${volume.series}.`,
	};
}

export default async function MangaVolumePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const volume = await dbUniverse.mangaVolume(parseInt(id));
	if (!volume) notFound();

	return (
		<div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24 reveal-up">
			<Link
				href={`/wiki/manga?series=${volume.series}`}
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-12 link-underline"
			>
				<span>← Retour à la liste</span>
			</Link>

			<div className="flex flex-col md:flex-row gap-12 lg:gap-20">
				<div className="w-full md:w-1/3 lg:w-1/4">
					<div className="dbz-panel p-4 border-2 border-dbz-orange/30 bg-dbz-card relative overflow-hidden group">
						<div className="absolute inset-0 halftone opacity-20" />
						{volume.cover ? (
							<img
								src={assetUrl(volume.cover)}
								alt={`Volume ${volume.volume_number}`}
								className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,178,0,0.3)]"
							/>
						) : (
							<div className="aspect-[2/3] flex items-center justify-center bg-zinc-900">
								<span className="text-zinc-700 font-saiyan text-6xl">{volume.volume_number}</span>
							</div>
						)}
					</div>
				</div>

				<div className="flex-1 space-y-10">
					<header>
						<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-dbz-orange mb-4">
							{volume.series === "DB" ? "Dragon Ball" : "Dragon Ball Super"} · Volume {volume.volume_number}
						</p>
						<h1 className="font-saiyan text-5xl lg:text-7xl text-white mb-6 tracking-widest leading-tight">
							{volume.title || `VOLUME ${volume.volume_number}`}
						</h1>
						<div className="h-1 w-24 bg-dbz-orange" />
					</header>

					<section className="space-y-6">
						<div className="flex items-center gap-6">
							<h2 className="font-saiyan text-3xl text-white uppercase tracking-widest">
								Sommaire des Chapitres
							</h2>
							<div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
						</div>
						
						<div className="grid gap-3">
							{volume.chapters.map((ch) => (
								<div
									key={ch.id}
									className="dbz-panel p-5 flex items-center justify-between hover:bg-white/5 transition-colors group"
								>
									<div className="flex items-center gap-6">
										<span className="scouter-text text-xl text-dbz-orange min-w-[60px]">
											#{ch.chapter_number}
										</span>
										<p className="font-display font-bold text-white group-hover:text-dbz-orange transition-colors">
											{ch.title || `Chapitre ${ch.chapter_number}`}
										</p>
									</div>
									<span className="text-dbz-orange/40 font-scouter text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
										SCAN_READY
									</span>
								</div>
							))}
							{volume.chapters.length === 0 && (
								<p className="text-white/40 italic">Aucun chapitre répertorié pour ce volume.</p>
							)}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
