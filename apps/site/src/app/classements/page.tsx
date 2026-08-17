import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CommunityTopsFull } from "@/components/ratings/CommunityTops";
import { getCommunityTops } from "@/lib/community-tops-data";
import { COMMUNITY_TOP_BOARDS } from "@/lib/community-tops";
import { ogMeta } from "@/lib/og";

export const revalidate = 60;

export const metadata: Metadata = {
	title: "Classements — Top 3 de la communauté",
	description:
		"Top 3 épisodes DB, DBZ, Super, GT, Daima, Kai, top 3 arcs, films et jeux — classés par les notes de la communauté DBFR. Note tes favoris pour le podium.",
	...ogMeta({
		title: "Classements — Top 3 de la communauté",
		description: "Les Top 3 épisodes, arcs, films et jeux notés par la communauté Dragon Ball FR.",
		type: "website",
		canonical: "/classements",
	}),
};

export default async function ClassementsPage() {
	const data = await getCommunityTops();

	return (
		<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
			<PageHeader title="CLASSEMENTS" subtitle="Les Top 3 de la communauté — notes 1 à 5 ★" />

			<p className="mb-8 max-w-2xl text-sm leading-relaxed text-white/60">
				Chaque membre connecté (Discord) peut noter épisodes, arcs, films et jeux. Les podiums se
				mettent à jour en direct : plus un titre est bien noté (et voté), plus il grimpe. Les #1, #2
				et #3 affichent un <strong className="text-white/80">badge communauté</strong> sur leur
				fiche.{" "}
				{data.globalVotes > 0 ? (
					<>
						<strong className="text-white/80">{data.globalVotes}</strong> vote
						{data.globalVotes > 1 ? "s" : ""} comptabilisé
						{data.globalVotes > 1 ? "s" : ""}.
					</>
				) : (
					<>Sois le premier à noter et occupe le podium.</>
				)}
			</p>

			{/* Ancres rapides */}
			<nav aria-label="Aller à un classement" className="mb-10 flex flex-wrap gap-2">
				{COMMUNITY_TOP_BOARDS.map((b) => (
					<a
						key={b.id}
						href={`#${b.id}`}
						className="rounded-lg border border-dbz-border px-3 py-1.5 text-sm font-semibold text-white/65 transition-colors hover:border-dbz-orange/50 hover:text-white"
					>
						<span className="mr-1 font-saiyan text-[11px] opacity-60">{b.kanji}</span>
						{b.label}
					</a>
				))}
			</nav>

			<CommunityTopsFull data={data} />

			<div className="mt-14 rounded-2xl border border-dbz-orange/25 bg-dbz-orange/5 p-6 text-center">
				<p className="font-saiyan text-xl uppercase text-dbz-orange">À toi de jouer</p>
				<p className="mx-auto mt-2 max-w-lg text-sm text-white/60">
					Connecte-toi avec Discord, ouvre une fiche épisode / film / jeu, et laisse ta note. Ton
					vote peut faire basculer le podium.
				</p>
				<div className="mt-4 flex flex-wrap items-center justify-center gap-3">
					<Link href="/wiki/episodes" className="btn btn-primary">
						Noter un épisode
					</Link>
					<Link href="/wiki/films" className="btn btn-ghost">
						Films
					</Link>
					<Link href="/wiki/jeux" className="btn btn-ghost">
						Jeux
					</Link>
				</div>
			</div>
		</div>
	);
}
