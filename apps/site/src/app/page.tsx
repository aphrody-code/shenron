import { db } from "@/lib/db";
import { getShenronPersonas } from "@/lib/shenron";
import { env } from "@/lib/env";
import { LandingHero } from "@/components/landing/LandingHero";
import { UniverseGrid } from "@/components/landing/UniverseGrid";
import {
	CharactersTeaser,
	type CharacterTeaser,
} from "@/components/landing/CharactersTeaser";
import { PersonasShowcase } from "@/components/landing/PersonasShowcase";
import { BlogTeaser } from "@/components/landing/BlogTeaser";
import { CtaFinal } from "@/components/landing/CtaFinal";

export const dynamic = "force-dynamic";
export const revalidate = 120;

const HERO_CHARACTERS = [1, 2, 3, 11, 18, 23];

async function fetchHeroCharacters(): Promise<CharacterTeaser[]> {
	try {
		const res = await fetch(
			`${env.SHENRON_API_URL}/api/public/wiki/characters`,
			{ next: { revalidate: 600 } },
		);
		if (!res.ok) return [];
		const data = (await res.json()) as { characters: CharacterTeaser[] };
		const byId = new Map(data.characters.map((c) => [c.id, c]));
		return HERO_CHARACTERS.flatMap((id) => {
			const c = byId.get(id);
			return c ? [c] : [];
		});
	} catch {
		return [];
	}
}

export default async function Home() {
	const [posts, personas, characters] = await Promise.all([
		db.query.posts.findMany({
			where: (p, { eq }) => eq(p.published, true),
			orderBy: (p, { desc }) => desc(p.createdAt),
			limit: 3,
			with: { author: true },
		}),
		getShenronPersonas().catch(() => []),
		fetchHeroCharacters(),
	]);

	return (
		<div className="flex-1 flex flex-col">
			<LandingHero />
			<UniverseGrid />
			<CharactersTeaser characters={characters} />
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
