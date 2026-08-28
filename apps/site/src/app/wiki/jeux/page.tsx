import { SectionUnavailable } from "@/components/wiki/SectionUnavailable";
import { dbUniverse, assetUrl } from "@/lib/db-universe";
import { getRatingSummaries } from "@/lib/ratings";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { GAMES_HERO } from "@/lib/db-banners";
import { RatingBadge } from "@/components/ratings/Stars";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Jeux vidéo Dragon Ball",
	description:
		"Catalogue des jeux vidéo officiels Dragon Ball : Kakarot, Sparking ZERO, Xenoverse, FighterZ, Dokkan Battle, Legends et plus.",
	alternates: { canonical: "/wiki/jeux" },
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
	if (!data || data.games.length === 0)
		return <SectionUnavailable title="Jeux vidéo Dragon Ball" />;
	const games = data.games;
	const ratings = await getRatingSummaries(
		"game",
		games.map((g) => String(g.id))
	);

	return (
		<>
			<PageHero
				eyebrow="Bandai Namco Entertainment"
				title="Jeux vidéo Dragon Ball"
				lead={`${games.length} titres officiels — du fighting de FighterZ au RPG narratif de Kakarot, du mobile gacha Dokkan à Sparking ZERO sur PS5. Note-les pour départager Xenoverse 2 et Sparking ZERO.`}
				image={GAMES_HERO}
				imageAlt="Jeux Dragon Ball"
			/>
			<div className="w-full mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24">
				<Breadcrumbs className="mb-8" items={[{ label: "Jeux vidéo" }]} />
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
									{(() => {
										const r = ratings.get(String(g.id));
										if (!r || r.count <= 0) return null;
										return (
											<span className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full bg-black/75 backdrop-blur-sm border border-dbz-orange/40 px-2 py-0.5 text-[11px] font-display font-bold text-dbz-orange">
												★ {r.average.toFixed(1)}
											</span>
										);
									})()}
								</div>
							)}
							<div className="p-6">
								<h3 className="font-display font-bold text-[20px] text-white mb-1.5">{g.title}</h3>
								{(() => {
									const r = ratings.get(String(g.id));
									return (
										<div className="mb-2">
											<RatingBadge average={r?.average ?? 0} count={r?.count ?? 0} />
										</div>
									);
								})()}
								{g.title_ja && (
									<p className="font-jp text-[12px] text-dbz-orange/80 mb-4">{g.title_ja}</p>
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
											<dt className="inline text-white/50">Sortie : </dt>
											<dd className="inline">
												{new Date(g.release_date * 1000).toLocaleDateString("fr-FR", {
													day: "numeric",
													month: "long",
													year: "numeric",
												})}
											</dd>
										</div>
									)}
									{g.developer && (
										<div>
											<dt className="inline text-white/50">Studio : </dt>
											<dd className="inline">{g.developer}</dd>
										</div>
									)}
									{g.publisher && (
										<div>
											<dt className="inline text-white/50">Éditeur : </dt>
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
