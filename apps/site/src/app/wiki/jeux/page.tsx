import { dbUniverse } from "@/lib/db-universe";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Jeux vidéo Dragon Ball — DBFR",
	description:
		"Catalogue des jeux vidéo officiels Dragon Ball : Kakarot, Sparking ZERO, Xenoverse, FighterZ, Dokkan Battle, Legends et plus.",
};

export default async function JeuxPage() {
	const data = await dbUniverse.games();
	if (!data || data.games.length === 0) notFound();
	const games = data.games;

	return (
		<div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16 lg:py-24">
			<header className="mb-12 max-w-3xl">
				<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4">
					Bandai Namco Entertainment
				</p>
				<h1 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white mb-5">
					Jeux vidéo Dragon Ball
				</h1>
				<p className="text-[17px] leading-relaxed text-white/70">
					{games.length} titres officiels — du fighting de FighterZ au RPG
					narratif de Kakarot, du mobile gacha Dokkan à Sparking ZERO sur PS5.
				</p>
			</header>

			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{games.map((g) => (
					<Link
						key={g.id}
						href={`/wiki/jeux/${g.slug}`}
						className="block p-6 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-dbz-orange/60 hover:bg-white/[0.07] transition-all"
					>
						<h3 className="font-display font-bold text-[20px] text-white mb-1.5">
							{g.title}
						</h3>
						{g.title_ja && (
							<p className="font-jp text-[12px] text-dbz-orange/80 mb-4">
								{g.title_ja}
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
					</Link>
				))}
			</div>
		</div>
	);
}
