import { getShenronRaces } from "@/lib/shenron";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SAGAS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Races Dragon Ball — DBFR",
	description:
		"Les 15 races de l'univers Dragon Ball : Saiyans, Nameks, Humains, Cyborgs, Démons du Froid.",
};

export default async function RacesPage() {
	const races = await getShenronRaces();

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Wiki"
				title="Races & Peuples"
				lead={`${races.length} races répertoriées — Saiyans, Nameks, Démons du Froid et bien plus. Chaque fiche liste les personnages représentants.`}
				image={SAGAS_HERO}
				imageAlt="Races Dragon Ball"
			/>

			<div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-24">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{races.map((race, idx) => (
						<Link
							key={race.id}
							href={`/wiki/races/${race.slug}`}
							className="dbz-panel p-8 hover:border-dbz-orange transition-all group reveal-up"
							style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
						>
							<div className="flex justify-between items-start mb-4">
								<div>
									<h2 className="text-3xl font-saiyan text-white group-hover:text-dbz-orange transition-colors tracking-widest leading-tight">
										{race.name}
									</h2>
									{race.nameJa && (
										<p className="font-jp text-base text-dbz-orange/60 mt-1">
											{race.nameJa}
										</p>
									)}
								</div>
								<span className="text-dbz-orange opacity-0 group-hover:opacity-100 transition-opacity text-2xl shrink-0 ml-4">
									→
								</span>
							</div>
							{race.description && (
								<p className="text-gray-400 line-clamp-3 font-sans leading-relaxed text-sm">
									{race.description}
								</p>
							)}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
