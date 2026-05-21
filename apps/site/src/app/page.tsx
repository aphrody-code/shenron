import { db } from "@/lib/db";
import { getShenronPersonas } from "@/lib/shenron";
import { LandingHero } from "@/components/landing/LandingHero";
import { UniverseGrid } from "@/components/landing/UniverseGrid";
import { PersonasShowcase } from "@/components/landing/PersonasShowcase";
import { BlogTeaser } from "@/components/landing/BlogTeaser";
import { CtaFinal } from "@/components/landing/CtaFinal";

export const dynamic = "force-dynamic";
export const revalidate = 120;

export default async function Home() {
	const [posts, personas] = await Promise.all([
		db.query.posts.findMany({
			where: (p, { eq }) => eq(p.published, true),
			orderBy: (p, { desc }) => desc(p.createdAt),
			limit: 3,
			with: { author: true },
		}),
		getShenronPersonas().catch(() => []),
	]);

	return (
		<div className="flex-1 flex flex-col">
			<LandingHero />
			<UniverseGrid />
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
			<PersonasShowcase
				personas={personas.map((p) => ({
					id: p.id,
					name: p.name,
					avatar: p.avatar,
				}))}
			/>
			<CtaFinal />
		</div>
	);
}
