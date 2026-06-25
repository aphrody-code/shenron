import { WikiMarkdown } from "@/components/wiki/WikiMarkdown";
import { getShenronGame, getShenronGames } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import { ogMeta } from "@/lib/og";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
	const list = await getShenronGames();
	return list.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const game = await getShenronGame(slug);
	if (!game) return { title: "Jeu Dragon Ball — DBFR" };
	const description = game.description ?? `Fiche détaillée du jeu ${game.title}.`;
	return {
		title: `${game.title} — Jeu Dragon Ball | DBFR`,
		description,
		...ogMeta({
			title: `${game.title} — DBFR`,
			description,
			image: game.cover ? assetUrl(game.cover) : undefined,
			canonical: `/wiki/dragon-ball/games/${slug}`,
		}),
	};
}

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const game = await getShenronGame(slug);

	if (!game) notFound();

	return (
		<article
			data-entity={game.title}
			data-source-id="db_games"
			data-lang="fr"
			className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24 reveal-up"
		>
			<Link
				href="/wiki/dragon-ball"
				className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest mb-12 link-underline"
			>
				<span>← Retour à l'index</span>
			</Link>

			<div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
				<div className="w-full lg:w-1/3 xl:w-1/4">
					<div className="dbz-panel p-4 border-2 border-dbz-orange/30 bg-dbz-card relative overflow-hidden group">
						<div className="absolute inset-0 halftone opacity-20" />
						{game.cover ? (
							<img
								src={assetUrl(game.cover)}
								alt={game.title}
								className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,178,0,0.3)]"
							/>
						) : (
							<div className="aspect-[3/4] flex items-center justify-center bg-zinc-900">
								<span className="text-zinc-700 font-saiyan text-6xl">?</span>
							</div>
						)}
					</div>

					{game.officialUrl && (
						<a
							href={game.officialUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="dbz-button w-full mt-6 text-center"
						>
							SITE OFFICIEL
						</a>
					)}
				</div>

				<div className="flex-1 space-y-10">
					<header>
						<p className="font-display font-semibold text-[12px] tracking-[0.3em] uppercase text-dbz-orange mb-4">
							Archives Vidéoludiques
						</p>
						<h1 className="font-saiyan text-5xl lg:text-7xl text-white mb-6 tracking-widest leading-tight">
							{game.title}
						</h1>
						{game.titleJa && (
							<p className="font-jp text-2xl text-dbz-orange/80 mb-8">{game.titleJa}</p>
						)}
						<div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest">
							{game.releaseDate && (
								<span className="px-3 py-1 bg-white/5 border border-white/10 text-white/60">
									📅 {new Date(Number(game.releaseDate) * 1000).getFullYear()}
								</span>
							)}
							{game.developer && (
								<span className="px-3 py-1 bg-white/5 border border-white/10 text-white/60">
									🛠️ {game.developer}
								</span>
							)}
							{game.publisher && (
								<span className="px-3 py-1 bg-white/5 border border-white/10 text-white/60">
									🏢 {game.publisher}
								</span>
							)}
						</div>
					</header>

					{game.platforms && (
						<section className="space-y-4">
							<h2 className="font-saiyan text-2xl text-white uppercase tracking-widest">
								Plateformes
							</h2>
							<div className="flex flex-wrap gap-2">
								{game.platforms.split(",").map((p) => (
									<span
										key={p}
										className="px-4 py-2 bg-dbz-bg border border-dbz-border text-white font-bold text-[10px] uppercase tracking-widest rounded"
									>
										{p.trim()}
									</span>
								))}
							</div>
						</section>
					)}

					{game.description && (
						<section className="dbz-panel p-8 relative overflow-hidden">
							<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />
							<h2 className="font-saiyan text-2xl text-dbz-orange mb-4 uppercase tracking-widest">
								Présentation
							</h2>
							<div className="prose prose-invert max-w-none wiki-content">
								<WikiMarkdown body={game.description} />
							</div>
						</section>
					)}
				</div>
			</div>
		</article>
	);
}
