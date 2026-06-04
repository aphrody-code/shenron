/**
 * AutonomousChat.ts — Événement messageCreate pour l'indexation Redis temps réel
 * et les réponses autonomes (Whis, Beerus, Shenron) basées sur le LLM RAG-grounded.
 */
import { inject, injectable } from "tsyringe";
import { Bot, Discord, On, type ArgsOf } from "@rpbey/discordy";
import { DatabaseService } from "~/db/index";
import { RedisIndexerService } from "~/lib/redis-indexer";
import { hybridSearch } from "~/lib/rag";
import { generateLlmAnswer } from "~/lib/llm";
import { logger } from "~/lib/logger";

class BaseAutonomousChat {
  constructor(
    protected dbs: DatabaseService,
    protected redisIndexer: RedisIndexerService,
    protected personaId: "whis" | "beerus" | "shenron",
  ) {}

  async handleMessage(message: ArgsOf<"messageCreate">[0]) {
    if (!message.inGuild() || message.author.bot) return;

    // 1. Indexation automatique en temps réel dans Redis
    try {
      this.redisIndexer.indexSingleMessage(
        message.id,
        message.content || "",
        message.author.id,
        message.channelId,
        message.createdAt,
      );
    } catch (e) {
      logger.error(e as Error, "[REDIS INDEX] Échec d'indexation temps réel");
    }

    // 2. Réponses autonomes si le bot est mentionné, interpellé ou de manière proactive
    const botUser = message.client.user;
    if (!botUser) return;

    const isMentioned = message.mentions.has(botUser.id);
    const lowercaseContent = (message.content || "").toLowerCase();
    
    // Vérifier si le message interpelle le nom de la persona
    const isNameCalled = lowercaseContent.includes(this.personaId);

    let shouldRespond = isMentioned || isNameCalled;

    // Déclenchement proactif intelligent (seulement pour Whis pour éviter les collisions multi-bots)
    if (!shouldRespond && this.personaId === "whis") {
      const isQuestion = lowercaseContent.includes("?") || 
                         /^(comment|pourquoi|qui|quel|quelle|où|est-ce|combien)/i.test(lowercaseContent);
      
      const LORE_KEYWORDS = ["goku", "vegeta", "freezer", "cell", "buu", "gohan", "trunks", "piccolo", "whis", "beerus", "bulma", "krillin", "broly", "bardock", "kamehameha", "fusion", "daima"];
      const containsDbzTerms = LORE_KEYWORDS.some(k => lowercaseContent.includes(k));
      
      // 3% de chance de s'insérer de manière autonome pour guider les mortels
      if (isQuestion && containsDbzTerms && Math.random() < 0.03) {
        shouldRespond = true;
        logger.info(`[PROACTIVE CHAT] Whis s'active proactivement pour la question : "${message.content}"`);
      }
    }

    if (shouldRespond) {
      logger.info(`[AUTONOMOUS CHAT] ${this.personaId.toUpperCase()} s'active dans le salon ${message.channelId}`);
      
      // Nettoyer la question (retirer la mention)
      const query = message.content
        .replace(new RegExp(`<@!?${botUser.id}>`, "g"), "")
        .replace(new RegExp(this.personaId, "gi"), "")
        .trim();

      if (query.length < 3) {
        if (this.personaId === "whis") {
          await message.reply("Oh oh, posez une question plus précise sur nos archives, s'il vous plaît !");
        } else if (this.personaId === "beerus") {
          await message.reply("Parle plus clairement si tu ne veux pas que je te détruise !");
        } else {
          await message.reply("Exprime ton souhait plus clairement...");
        }
        return;
      }

      // Indiquer que le bot écrit
      await message.channel.sendTyping();

      try {
        // Exécuter la recherche sémantique
        const { results } = await hybridSearch(this.dbs.sqlite, query, 5);
        
        if (results.length === 0) {
          if (this.personaId === "whis") {
            await message.reply("Oh oh, mes archives de l'Univers 7 restent bien silencieuses à ce sujet.");
          } else if (this.personaId === "beerus") {
            await message.reply("Cette question est insignifiante. Même mes archives n'en parlent pas.");
          } else {
            await message.reply("Je ne peux accomplir ce souhait, cette information m'est inconnue.");
          }
          return;
        }

        // Générer la réponse personnalisée grondée
        const answer = await generateLlmAnswer(this.dbs.sqlite, query, results, this.personaId);
        
        if (answer) {
          await message.reply(answer);
        } else {
          // Fallback gracieux si échec LLM
          if (this.personaId === "whis") {
            await message.reply("Je rencontre une petite perturbation spirituelle pour formuler ma réponse, veuillez m'en excuser.");
          } else {
            await message.reply("Mes pouvoirs de communication sont perturbés...");
          }
        }
      } catch (err) {
        logger.error(err as Error, `[AUTONOMOUS CHAT] Échec de génération pour ${this.personaId}`);
      }
    }
  }
}

@Discord()
@Bot("whis")
@injectable()
export class WhisAutonomousChat extends BaseAutonomousChat {
  constructor(
    @inject(DatabaseService) dbs: DatabaseService,
    @inject(RedisIndexerService) redisIndexer: RedisIndexerService,
  ) {
    super(dbs, redisIndexer, "whis");
  }

  @On({ event: "messageCreate" })
  async onMessage([message]: ArgsOf<"messageCreate">) {
    await this.handleMessage(message);
  }
}

@Discord()
@Bot("beerus")
@injectable()
export class BeerusAutonomousChat extends BaseAutonomousChat {
  constructor(
    @inject(DatabaseService) dbs: DatabaseService,
    @inject(RedisIndexerService) redisIndexer: RedisIndexerService,
  ) {
    super(dbs, redisIndexer, "beerus");
  }

  @On({ event: "messageCreate" })
  async onMessage([message]: ArgsOf<"messageCreate">) {
    await this.handleMessage(message);
  }
}

@Discord()
@Bot("shenron")
@injectable()
export class ShenronAutonomousChat extends BaseAutonomousChat {
  constructor(
    @inject(DatabaseService) dbs: DatabaseService,
    @inject(RedisIndexerService) redisIndexer: RedisIndexerService,
  ) {
    super(dbs, redisIndexer, "shenron");
  }

  @On({ event: "messageCreate" })
  async onMessage([message]: ArgsOf<"messageCreate">) {
    await this.handleMessage(message);
  }
}
