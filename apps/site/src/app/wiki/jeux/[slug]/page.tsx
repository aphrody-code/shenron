import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const g = await dbUniverse.game(slug);
	if (!g) return { title: "Jeu — DBFR" };
	return {
		title: `${g.title} — Jeu vidéo Dragon Ball | DBFR`,
		description:
			g.description ?? `${g.title} (${g.developer ?? "Bandai Namco"}).`,
	};
}

export default async function GamePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const g = await dbUniverse.game(slug);
	if (!g) notFound();

	const platforms = (g.platforms ?? "")
		.split(",")
		.map((p) => p.trim())
		.filter(Boolean);

	return (
		<div className="mx-auto max-w-[920px] px-6 lg:px-10 py-16 lg:py-24">
			<Link
				href="/wiki/jeux"
				className="inline-flex items-center gap-2 text-[13px] font-display font-semibold tracking-[0.10em] uppercase text-dbz-orange hover:text-white transition-colors mb-8"
			>
				← Tous les jeux
			</Link>

			<header className="mb-12">
				<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-3">
					Bandai Namco Entertainment
				</p>
				<h1 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white mb-3">
					{g.title}
				</h1>
				{g.title_ja && (
					<p className="font-jp text-[20px] text-dbz-orange/85 mb-6">
						{g.title_ja}
					</p>
				)}
			</header>

			<dl className="grid sm:grid-cols-2 gap-6 mb-12 p-6 rounded-xl bg-white/[0.04] border border-white/[0.06]">
				{g.release_date && (
					<div>
						<dt className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1.5">
							Date de sortie
						</dt>
						<dd className="text-white text-[15px]">
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
						<dt className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1.5">
							Développeur
						</dt>
						<dd className="text-white text-[15px]">{g.developer}</dd>
					</div>
				)}
				{g.publisher && (
					<div>
						<dt className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1.5">
							Éditeur
						</dt>
						<dd className="text-white text-[15px]">{g.publisher}</dd>
					</div>
				)}
				{platforms.length > 0 && (
					<div>
						<dt className="font-display font-semibold text-[11px] tracking-[0.16em] uppercase text-white/45 mb-1.5">
							Plateformes
						</dt>
						<dd className="flex flex-wrap gap-1.5">
							{platforms.map((p) => (
								<span
									key={p}
									className="text-[11px] font-display font-semibold tracking-[0.10em] uppercase px-2.5 py-1 rounded-full bg-dbz-orange/15 text-dbz-orange"
								>
									{p}
								</span>
							))}
						</dd>
					</div>
				)}
			</dl>

			{g.description && (
				<section className="mb-12">
					<h2 className="font-display font-bold text-[20px] text-white border-b border-white/10 pb-2 mb-4">
						Description
					</h2>
					<p className="text-[16px] leading-relaxed text-white/75 whitespace-pre-line">
						{g.description}
					</p>
				</section>
			)}

			{g.official_url && (
				<a
					href={g.official_url}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center h-12 px-6 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[13px] tracking-[0.10em] uppercase transition-colors"
				>
					Page officielle Bandai Namco
				</a>
			)}
		</div>
	);
}
