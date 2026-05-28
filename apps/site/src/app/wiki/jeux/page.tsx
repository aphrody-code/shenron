import { dbUniverse, assetUrl } from "@/lib/db-universe";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { GAMES_HERO } from "@/lib/db-banners";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Jeux vidéo Dragon Ball — DBFR",
	description:
		"Catalogue des jeux vidéo officiels Dragon Ball : Kakarot, Sparking ZERO, Xenoverse, FighterZ, Dokkan Battle, Legends et plus.",
};

function excerpt(text: string | null | undefined, max = 180): string {
	if (!text) return "";
	const clean = text
		.replace(/_?\(Sources?\s*:[^)]*\)_?/gi, "")
		.replace(/[*_#>`]/g, "")
		.replace(/\s+/g, " ")
		.trim();
	return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

export default async function JeuxPage() {
	const data = await dbUniverse.games();
	if (!data || data.games.length === 0) notFound();
	const games = data.games;

	return (
		<>
			<PageHero
				eyebrow="Bandai Namco Entertainment"
				title="Jeux vidéo Dragon Ball"
				lead={`${games.length} titres officiels — du fighting de FighterZ au RPG narratif de Kakarot, du mobile gacha Dokkan à Sparking ZERO sur PS5.`}
				image={GAMES_HERO}
				imageAlt="Jeux Dragon Ball"
			/>
			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
					{games.map((g) => (
						<Link
							key={g.id}
							href={`/wiki/jeux/${g.slug}`}
							className="block rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-dbz-orange/60 hover:bg-white/[0.07] transition-all overflow-hidden"
						>
							{g.cover && (
								<div className="relative aspect-[3/4] bg-black">
									<Image
										src={assetUrl(g.cover)}
										alt={g.title}
										fill
										sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
										className="object-cover"
									/>
								</div>
							)}
							<div className="p-6">
								<h3 className="font-display font-bold text-[20px] text-white mb-1.5">
									{g.title}
								</h3>
								{g.title_ja && (
									<p className="font-jp text-[12px] text-dbz-orange/80 mb-4">
										{g.title_ja}
									</p>
								)}
								{g.description && (
									<p className="text-[12.5px] leading-relaxed text-white/55 mb-4 line-clamp-3">
										{excerpt(g.description)}
									</p>
								)}
								<div className="flex flex-wrap gap-1.5 mb-4">
									{(g.platforms ?? "")
										.split(",")
										.filter(Boolean)
										.map((p) => (
											<span
												key={p}
												className="text-[10px] font-display font-semibold tracking-[0.10em] uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-white/80"
											>
												{p.trim()}
											</span>
										))}
								</div>
								<dl className="text-[12px] text-white/65 space-y-1">
									{g.release_date && (
										<div>
											<dt className="inline text-white/45">Sortie : </dt>
											<dd className="inline">
												{new Date(g.release_date).toLocaleDateString("fr-FR", {
													day: "numeric",
													month: "long",
													year: "numeric",
												})}
											</dd>
										</div>
									)}
									{g.developer && (
										<div>
											<dt className="inline text-white/45">Studio : </dt>
											<dd className="inline">{g.developer}</dd>
										</div>
									)}
									{g.publisher && (
										<div>
											<dt className="inline text-white/45">Éditeur : </dt>
											<dd className="inline">{g.publisher}</dd>
										</div>
									)}
								</dl>
							</div>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}
