import { db } from "@/lib/db";
import { getShenronPersonas, getShenronStats } from "@/lib/shenron";
import { LandingHero } from "@/components/landing/LandingHero";
import { StatsTicker } from "@/components/landing/StatsTicker";
import { GamesShowcase } from "@/components/landing/GamesShowcase";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { UniverseGrid } from "@/components/landing/UniverseGrid";
import { PersonasShowcase } from "@/components/landing/PersonasShowcase";
import { BlogTeaser } from "@/components/landing/BlogTeaser";
import { CtaFinal } from "@/components/landing/CtaFinal";

export const dynamic = "force-dynamic";
export const revalidate = 120;

export default async function Home() {
	const [posts, personas, stats] = await Promise.all([
		db.query.posts.findMany({
			where: (p, { eq }) => eq(p.published, true),
			orderBy: (p, { desc }) => desc(p.createdAt),
			limit: 3,
			with: { author: true },
		}),
		getShenronPersonas().catch(() => []),
		getShenronStats(),
	]);

	return (
		<div className="flex-1 flex flex-col">
			<LandingHero />
			{/* Vrais chiffres live du bot (membres, XP, zénis, succès) */}
			<StatsTicker stats={stats} />
			{/* Vrais mini-jeux jouables (2048 embarqué + PFC/Morpion/Bingo/Pendu) */}
			<GamesShowcase />
			{/* Vraies features → liens vers wiki / profil / shop / classement / blog */}
			<FeaturesGrid />
			<UniverseGrid />
			<PersonasShowcase
				personas={personas.map((p) => ({
					id: p.id,
					name: p.name,
					avatar: p.avatar,
				}))}
			/>
			{posts.length > 0 && (
				<BlogTeaser
					posts={posts.map((p) => ({
						id: p.id,
						slug: p.slug,
						title: p.title,
						excerpt: p.excerpt,
						cover: p.cover,
						createdAt: p.createdAt,
						author: {
							username: p.author.username,
							avatar: p.author.avatar,
						},
					}))}
				/>
			)}
			<CtaFinal />
		</div>
	);
}
