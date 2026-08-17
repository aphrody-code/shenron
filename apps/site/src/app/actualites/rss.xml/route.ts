import { db } from "@/lib/db";
import { posts as postsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { publicPostFilter } from "@/lib/posts";
import { SITE_URL } from "@/lib/config";

/**
 * Flux RSS 2.0 du journal.
 *
 * Segment statique `rss.xml` : Next le résout avant la route dynamique
 * `/actualites/[slug]`, il n'y a donc pas de collision avec un article dont le
 * slug serait « rss.xml ».
 */

export const revalidate = 600;

/** Échappe les 5 caractères réservés XML. */
function xml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export async function GET() {
	const rows = await db.query.posts.findMany({
		where: publicPostFilter(),
		orderBy: [desc(postsTable.publishedAt)],
		limit: 50,
		with: { author: true },
	});

	const items = rows
		.map((post) => {
			const url = `${SITE_URL}/actualites/${post.slug}`;
			const cover = post.cover
				? post.cover.startsWith("http")
					? post.cover
					: `${SITE_URL}${post.cover}`
				: null;

			return `		<item>
			<title>${xml(post.title)}</title>
			<link>${xml(url)}</link>
			<guid isPermaLink="true">${xml(url)}</guid>
			<description>${xml(post.excerpt)}</description>${
				post.publishedAt ? `\n			<pubDate>${post.publishedAt.toUTCString()}</pubDate>` : ""
			}${post.author?.username ? `\n			<dc:creator>${xml(post.author.username)}</dc:creator>` : ""}${(
				post.tags ?? []
			)
				.map((t) => `\n			<category>${xml(t)}</category>`)
				.join("")}${cover ? `\n			<enclosure url="${xml(cover)}" type="image/jpeg" />` : ""}${
				post.contentHtml
					? `\n			<content:encoded><![CDATA[${post.contentHtml.replace(/]]>/g, "]]&gt;")}]]></content:encoded>`
					: ""
			}
		</item>`;
		})
		.join("\n");

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Le Journal — Dragon Ball France</title>
		<link>${SITE_URL}/actualites</link>
		<description>Sorties anime, chapitres du manga, films, événements et analyses Dragon Ball.</description>
		<language>fr-FR</language>
		<atom:link href="${SITE_URL}/actualites/rss.xml" rel="self" type="application/rss+xml" />${
			rows[0]?.publishedAt
				? `\n		<lastBuildDate>${rows[0].publishedAt.toUTCString()}</lastBuildDate>`
				: ""
		}
${items}
	</channel>
</rss>`;

	return new Response(body, {
		headers: {
			"content-type": "application/rss+xml; charset=utf-8",
			"cache-control": "public, max-age=600, s-maxage=600, stale-while-revalidate=86400",
		},
	});
}
