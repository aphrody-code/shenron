import { singleton, inject } from "tsyringe";
import { redis } from "bun";
import { logger } from "~/lib/logger";
import { env } from "~/lib/env";
import type { Client, TextChannel } from "discord.js";
import { DatabaseService } from "~/db/index";

@singleton()
export class AutoEvalService {
  private client: Client | null = null;

  constructor(
    @inject(DatabaseService) private dbs: DatabaseService
  ) {}

  setClient(client: Client) {
    this.client = client;
  }

  /**
   * Lance les scripts d'évaluations en arrière-plan sans bloquer le bot
   */
  async runEvaluationPipeline(): Promise<void> {
    logger.info("[AUTO-EVAL] Lancement du pipeline d'auto-évaluation en arrière-plan...");

    try {
      // 1. Lancer rag-eval.ts (métriques de retrieval, lecture seule)
      const ragProc = Bun.spawn(["bun", "scripts/rag-eval.ts"], {
        stdout: "inherit",
        stderr: "inherit",
      });
      await ragProc.exited;
      logger.info("[AUTO-EVAL] Fin de l'évaluation RAG.");

      // 2. Éval HONNÊTE de notre LLM maison (non-vide + grounding, sans juge LLM flaky).
      const llmProc = Bun.spawn(["bun", "scripts/llm/eval-own.ts", "--persona", "whis"], {
        stdout: "inherit",
        stderr: "inherit",
      });
      await llmProc.exited;
      logger.info("[AUTO-EVAL] Fin de l'évaluation du modèle maison.");

      // 3. Vérifier les métriques et envoyer l'alerte si nécessaire
      if (this.client) {
        await this.checkMetricsAndAlert();
      }
    } catch (err) {
      logger.error(err as Error, "[AUTO-EVAL] Échec lors de l'exécution du pipeline d'auto-évaluation");
    }
  }

  /**
   * Vérifie les rapports dans Redis et envoie une alerte Discord si les métriques régressent
   */
  async checkMetricsAndAlert(): Promise<void> {
    if (!this.client) {
      logger.warn("[AUTO-EVAL] Impossible de vérifier les métriques: Client Discord non défini.");
      return;
    }

    try {
      const ragReportRaw = await redis.get("dbz:eval:report:rag");
      const ownReportRaw = await redis.get("dbz:eval:report:own");

      if (!ragReportRaw || !ownReportRaw) {
        logger.info("[AUTO-EVAL] Rapports d'évaluation insuffisants dans Redis pour envoyer une alerte.");
        return;
      }

      const ragReport = JSON.parse(ragReportRaw);
      const ownReport = JSON.parse(ownReportRaw);

      // Meilleur Recall@5 servi (le sidecar sert tout en hybrid -> lexical=0, ne pas s'y fier).
      const rows: Array<{ recall?: Record<string, number> }> = ragReport.rows ?? [];
      const recall5 = Math.max(
        ragReport.lexical?.recall5 ?? 0,
        ...rows.map((r) => r.recall?.[5] ?? r.recall?.["5"] ?? 0),
      );
      const nonEmptyPct = ownReport.nonEmptyPct ?? 0;
      const groundingPct = ownReport.groundingPct ?? 0;

      const thresholdRecall = 0.70;
      const isRagDegraded = recall5 < thresholdRecall;
      const isReliabilityDegraded = nonEmptyPct < 95; // doit rester ~100% (repli extractif)
      const isGroundingDegraded = groundingPct < 50;

      if (isRagDegraded || isReliabilityDegraded || isGroundingDegraded) {
        logger.warn(
          { recall5, nonEmptyPct, groundingPct },
          "[AUTO-EVAL] Métriques de qualité dégradées ! Envoi d'une alerte divine..."
        );

        // Envoyer l'alerte sur Discord dans le salon de logs des messages
        const logChannelId = env.LOG_MESSAGE_CHANNEL_ID || "1032622751845990401";
        const channel = await this.client.channels.fetch(logChannelId).catch(() => null) as TextChannel | null;

        if (channel && channel.isTextBased()) {
          const embed = {
            title: "⚖️ ALERTE DIVINE : DÉGRADATION DE L'INTELLIGENCE DÉTECTÉE",
            description: "Le Grand Prêtre a observé une baisse de pertinence ou de qualité dans les réponses de nos divinités.",
            color: 0xef4444, // Rouge danger
            fields: [
              {
                name: "RAG Pertinence (Recall@5)",
                value: `🔴 **${(recall5 * 100).toFixed(1)}%** (Seuil: ${(thresholdRecall * 100).toFixed(0)}%) - ${
                  isRagDegraded ? "Indexation à revoir" : "Optimal"
                }`,
                inline: false,
              },
              {
                name: "Fiabilité (réponses non vides)",
                value: `${isReliabilityDegraded ? "🔴" : "🟢"} **${nonEmptyPct.toFixed(1)}%** (Seuil: 95%)`,
                inline: true,
              },
              {
                name: "Grounding (faits ancrés)",
                value: `${isGroundingDegraded ? "🔴" : "🟢"} **${groundingPct.toFixed(1)}%** (Seuil: 50%)`,
                inline: true,
              },
            ],
            footer: {
              text: "Usine à LLM Dragon Ball - Auto-Correction Loop",
            },
            timestamp: new Date().toISOString(),
          };

          await channel.send({ embeds: [embed] }).catch((e) => {
            logger.error(e as Error, "[AUTO-EVAL] Impossible d'envoyer l'embed d'alerte Discord");
          });
        }
      } else {
        logger.info("[AUTO-EVAL] Toutes les métriques sont optimales. Aucune alerte requise.");
      }
    } catch (err) {
      logger.error(err as Error, "[AUTO-EVAL] Erreur durant la vérification des métriques");
    }
  }
}
