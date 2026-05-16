import { db } from "@/lib/db";
import { getShenronPersonas } from "@/lib/shenron";
import { env } from "@/lib/env";
import { LandingHero } from "@/components/landing/LandingHero";
import { StatsTicker } from "@/components/landing/StatsTicker";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { PersonasShowcase } from "@/components/landing/PersonasShowcase";
import { BlogTeaser } from "@/components/landing/BlogTeaser";
import { CtaFinal } from "@/components/landing/CtaFinal";

export const dynamic = "force-dynamic";
export const revalidate = 120;

type BotStats = {
	users: number;
	totalXp: number;
	totalZeni: number;
	achievementsUnlocked: number;
};

async function fetchBotStats(): Promise<BotStats> {
	try {
		const res = await fetch(`${env.SHENRON_API_URL}/api/public/stats`, {
			next: { revalidate: 60 },
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return (await res.json()) as BotStats;
	} catch {
		return {
			users: 0,
			totalXp: 0,
			totalZeni: 0,
			achievementsUnlocked: 0,
		};
	}
}

export default async function Home() {
	const [posts, stats, personas] = await Promise.all([
		db.query.posts.findMany({
			where: (p, { eq }) => eq(p.published, true),
			orderBy: (p, { desc }) => desc(p.createdAt),
			limit: 3,
			with: { author: true },
		}),
		fetchBotStats(),
		getShenronPersonas().catch(() => []),
	]);

	return (
		<div className="flex-1 flex flex-col">
			<LandingHero />
			<StatsTicker stats={stats} />
			<FeaturesGrid />
			<PersonasShowcase
				personas={personas.map((p) => ({
					id: p.id,
					name: p.name,
					avatar: p.avatar,
				}))}
			/>
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
			<CtaFinal />
		</div>
	);
}
