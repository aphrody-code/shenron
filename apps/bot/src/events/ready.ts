import { Bot, Discord, Once } from "@rpbey/discordy";
import type { Client } from "discord.js";
import { inject, injectable } from "tsyringe";
import { logger } from "~/lib/logger";
import { RedisIndexerService } from "~/lib/redis-indexer";
import { CronRegistry } from "~/api/cron-registry";
import { AutoEvalService } from "~/services/AutoEvalService";

@Discord()
@Bot("shenron")
@injectable()
export class ReadyEvent {
	constructor(
		@inject(RedisIndexerService) private redisIndexer: RedisIndexerService,
		@inject(CronRegistry) private cron: CronRegistry,
		@inject(AutoEvalService) private autoEval: AutoEvalService
	) {}

	@Once({ event: "clientReady" })
	async ready([client]: [Client]) {
		logger.info(`✓ Bot ready — ${client.user?.username} on ${client.guilds.cache.size} guild(s)`);

		// Lier le client Discord pour l'envoi des alertes d'évaluation
		this.autoEval.setClient(client);

		// Lancer l'indexation Redis globale en arrière-plan au boot
		try {
			this.redisIndexer.indexAll(client).catch((e) => {
				logger.error(e as Error, "[REDIS INDEXER] Échec de l'indexation complète au démarrage");
			});
		} catch (err) {
			logger.error(err as Error, "[REDIS INDEXER] Erreur lors du lancement de l'indexation");
		}

		// Lancer le pipeline d'auto-évaluation au démarrage en arrière-plan
		this.autoEval.runEvaluationPipeline().catch((err) => {
			logger.error(
				err as Error,
				"[AUTO-EVAL] Échec lors du démarrage de l'auto-évaluation au boot"
			);
		});

		// Enregistrer la tâche planifiée d'indexation Redis (toutes les 15 minutes)
		try {
			this.cron.register({
				name: "redis-indexer",
				description:
					"Indexation périodique de tous les messages, utilisateurs et salons dans Redis",
				intervalMs: 15 * 60_000,
				fn: () => this.redisIndexer.indexAll(client),
			});
		} catch (err) {
			logger.error(err as Error, "[REDIS INDEXER] Impossible d'enregistrer la tâche cron");
		}

		// Enregistrer la tâche planifiée d'auto-évaluation (toutes les 24 heures)
		try {
			this.cron.register({
				name: "auto-eval",
				description: "Pipeline d'auto-évaluation et alerte en cas de baisse de pertinence ou style",
				intervalMs: 24 * 60 * 60_000, // 24 heures
				fn: () => this.autoEval.runEvaluationPipeline(),
			});
		} catch (err) {
			logger.error(
				err as Error,
				"[AUTO-EVAL] Impossible d'enregistrer la tâche cron d'auto-évaluation"
			);
		}
	}
}
