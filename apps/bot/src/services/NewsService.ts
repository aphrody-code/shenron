import { singleton, inject } from "tsyringe";
import { DatabaseService } from "~/db/index";
import { dbNews } from "~/db/schema";
import { logger } from "~/lib/logger";
import { eq, desc } from "drizzle-orm";

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

	async syncFromSitemap(url: string, sourceId: string) {
		logger.info(`[NewsService] Syncing news from ${url} (${sourceId})`);
		// Implementation for parsing sitemap and fetching news items
		// This will be expanded with actual fetch and parse logic
	}
}
