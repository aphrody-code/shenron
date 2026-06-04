/**
 * redis-indexer.ts — Gestionnaire de l'indexation Redis.
 * Spawne le worker Bun en arrière-plan et gère la file d'attente d'indexation.
 */
import { Client, ChannelType } from "discord.js";
import { injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export class RedisIndexerService {
  private worker: Worker | null = null;
  private isIndexationActive = false;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      const workerUrl = new URL("../workers/indexer.ts", import.meta.url);
      this.worker = new Worker(workerUrl.href, { type: "module" });
      
      this.worker.onmessage = (event) => {
        const { status, type, count, error } = event.data;
        if (status === "success") {
          console.log(`[REDIS INDEXER] Succès de type ${type} : ${count} items indexés.`);
        } else {
          console.error(`[REDIS INDEXER] Erreur type ${type} :`, error || "Échec d'insertion");
        }
      };

      this.worker.onerror = (err) => {
        console.error(`[REDIS INDEXER] Erreur globale du Worker :`, err);
      };
    } catch (e) {
      console.error("[REDIS INDEXER] Impossible de démarrer le Bun Worker :", e);
    }
  }

  /** Lance l'indexation complète de tous les serveurs connectés */
  async indexAll(client: Client) {
    if (this.isIndexationActive) {
      console.warn("[REDIS INDEXER] Une indexation est déjà en cours.");
      return;
    }

    this.isIndexationActive = true;
    console.log("[REDIS INDEXER] Démarrage de l'indexation complète dans Redis...");

    try {
      const guilds = Array.from(client.guilds.cache.values());
      
      for (const guild of guilds) {
        // 1. Indexation des salons
        const channels = Array.from(guild.channels.cache.values()).map((ch) => ({
          id: ch.id,
          name: ch.name || "",
          type: String(ch.type),
          parentId: ch.parentId,
        }));
        
        if (channels.length > 0 && this.worker) {
          this.worker.postMessage({ type: "INDEX_CHANNELS", data: channels });
        }

        // 2. Indexation des utilisateurs (membres)
        try {
          const membersList = await guild.members.fetch();
          const users = Array.from(membersList.values()).map((m) => ({
            id: m.user.id,
            username: m.user.username,
            displayName: m.displayName,
            bot: m.user.bot,
            joinedAt: m.joinedAt?.toISOString() || null,
          }));

          if (users.length > 0 && this.worker) {
            // Découpage en paquets de 100 pour ne pas saturer
            const chunkSize = 100;
            for (let i = 0; i < users.length; i += chunkSize) {
              this.worker.postMessage({
                type: "INDEX_USERS",
                data: users.slice(i, i + chunkSize),
              });
            }
          }
        } catch (err) {
          console.error(`[REDIS INDEXER] Impossible de fetch les membres de la guilde ${guild.name}:`, err);
        }

        // 3. Indexation des derniers messages des salons textuels
        const textChannels = guild.channels.cache.filter(
          (c) => c.type === ChannelType.GuildText || c.type === ChannelType.GuildAnnouncement
        );

        for (const [chId, ch] of textChannels) {
          if (!ch.isTextBased()) continue;
          
          try {
            const fetched = await ch.messages.fetch({ limit: 50 });
            const messages = Array.from(fetched.values()).map((m) => ({
              id: m.id,
              content: m.content || "",
              authorId: m.author.id,
              channelId: m.channelId,
              createdAt: m.createdAt.toISOString(),
            }));

            if (messages.length > 0 && this.worker) {
              this.worker.postMessage({ type: "INDEX_MESSAGES", data: messages });
            }
          } catch (e) {
            // Souvent des problèmes de permissions de lecture dans certains salons
            // On ignore silencieusement
          }
        }
      }
    } catch (err) {
      console.error("[REDIS INDEXER] Erreur fatale durant l'indexation :", err);
    } finally {
      this.isIndexationActive = false;
      console.log("[REDIS INDEXER] Indexation complète achevée.");
    }
  }

  /** Indexation temps-réel d'un message unique */
  indexSingleMessage(msgId: string, content: string, authorId: string, channelId: string, createdAt: Date) {
    if (!this.worker) return;
    this.worker.postMessage({
      type: "INDEX_MESSAGES",
      data: [{
        id: msgId,
        content,
        authorId,
        channelId,
        createdAt: createdAt.toISOString(),
      }],
    });
  }
}
