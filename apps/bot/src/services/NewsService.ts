import { singleton, inject } from "tsyringe";
import type { Message } from "discord.js";
import { DatabaseService } from "~/db/index";
import { dbNews } from "~/db/schema";
import { logger } from "~/lib/logger";
import { eq, desc } from "drizzle-orm";

const NEWS_TITLE_MAX = 140;
const NEWS_EXCERPT_MAX = 600;

export interface DBNews {
	id: number;
	sourceId: string;
	sourceUrl: string;
	title: string;
	titleJa: string | null;
	excerpt: string | null;
	category: string | null;
	publishedAt: Date;
	fetchedAt: Date;
	image: string | null;
}

@singleton()
export class NewsService {
	constructor(@inject(DatabaseService) private dbs: DatabaseService) {}

	private get db() {
		return this.dbs.db;
	}

	async getLatestNews(limit = 10): Promise<DBNews[]> {
		return this.db
			.select()
			.from(dbNews)
			.orderBy(desc(dbNews.publishedAt))
			.limit(limit) as unknown as Promise<DBNews[]>;
	}

	async saveNews(news: Omit<DBNews, "id" | "fetchedAt">) {
		try {
			await this.db
				.insert(dbNews)
				.values({
					...news,
					fetchedAt: new Date(),
				})
				.onConflictDoUpdate({
					target: dbNews.sourceUrl,
					set: {
						title: news.title,
						titleJa: news.titleJa,
						excerpt: news.excerpt,
						category: news.category,
						publishedAt: news.publishedAt,
						image: news.image,
					},
				});
		} catch (e) {
			logger.error(`[NewsService] Failed to save news: ${e instanceof Error ? e.message : e}`);
		}
	}

	/** Première image exploitable d'un message (attachment image > embed image/thumbnail). */
	private extractImage(message: Message): string | null {
		const att = message.attachments.find((a) =>
			(a.contentType ?? "").startsWith("image/"),
		);
		if (att) return att.url;
		for (const e of message.embeds) {
			if (e.image?.url) return e.image.url;
			if (e.thumbnail?.url) return e.thumbnail.url;
		}
		return null;
	}

	/**
	 * Mappe un message d'un salon d'annonces Discord vers `db_news` (alimente la
	 * page Actualités du site). Titre = 1re ligne, excerpt = reste, image = 1re
	 * pièce jointe/embed. Idempotent via `sourceUrl` (lien message). Retourne
	 * `false` si rien d'exploitable (message vide sans image).
	 */
	async saveFromDiscord(message: Message, category = "Annonce"): Promise<boolean> {
		const raw = (message.content ?? "").trim();
		const embedText = message.embeds
			.map((e) => [e.title, e.description].filter(Boolean).join("\n"))
			.join("\n")
			.trim();
		const body = raw || embedText;
		const image = this.extractImage(message);
		if (!body && !image) return false;

		const lines = body
			.split("\n")
			.map((l) => l.replace(/^[#>*\-\s]+/, "").trim())
			.filter(Boolean);
		const title = (lines[0] ?? message.embeds[0]?.title ?? "Annonce").slice(
			0,
			NEWS_TITLE_MAX,
		);
		const excerpt = lines.slice(1).join(" ").slice(0, NEWS_EXCERPT_MAX) || null;

		await this.saveNews({
			sourceId: `discord:${message.channelId}`,
			sourceUrl: message.url,
			title,
			titleJa: null,
			excerpt,
			category,
			publishedAt: message.createdAt,
			image,
		});
		return true;
	}

	async deleteBySourceUrl(url: string) {
		await this.db.delete(dbNews).where(eq(dbNews.sourceUrl, url));
	}

	async syncFromSitemap(url: string, sourceId: string) {
		logger.info(`[NewsService] Syncing news from ${url} (${sourceId})`);
		// Implementation for parsing sitemap and fetching news items
		// This will be expanded with actual fetch and parse logic
	}
}
