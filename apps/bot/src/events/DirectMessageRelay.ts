import { injectable, inject } from "tsyringe";
import { Bot, Discord, On, type ArgsOf } from "@rpbey/discordy";
import { and, eq, sql } from "drizzle-orm";
import { DatabaseService } from "~/db/index";
import { dmContacts, dmMessages } from "~/db/schema";
import { logger } from "~/lib/logger";

/**
 * Relais de messages privés — réception.
 *
 * Shenron sert de boîte aux lettres entre une personne et l'agent qui opère la
 * production : ce qu'on lui écrit en privé est enregistré, l'agent le lit via
 * `GET /api/dm/inbox` et répond via `POST /api/dm/send`. Le bot ne compose
 * jamais de réponse lui-même — c'est un relais, pas un interlocuteur. Aucune IA
 * n'intervient ici (`ShenronAutonomousChat` sort sur `!message.inGuild()`).
 *
 * **Liste blanche.** N'importe qui peut écrire à un bot public. Un correspondant
 * inconnu est donc enregistré avec `allowed = false` : son message est conservé
 * — savoir qui a tenté d'écrire fait partie de l'information — mais il n'est
 * jamais servi à l'agent, et il ne reçoit aucune réponse au-delà d'un accusé
 * neutre. L'autorisation est un geste explicite du propriétaire
 * (`POST /api/dm/contacts/:id/allow`).
 *
 * **Accusé de réception.** Sans retour, l'expéditeur ne sait pas si son message
 * est parti dans le vide. Un correspondant autorisé reçoit une réaction ✅ ;
 * un inconnu reçoit une phrase, une seule fois — la répéter à chaque message
 * transformerait le refus poli en harcèlement.
 */
@Discord()
@Bot("shenron")
@injectable()
export class DirectMessageRelay {
	constructor(@inject(DatabaseService) private dbs: DatabaseService) {}

	@On({ event: "messageCreate" })
	async onDirectMessage([message]: ArgsOf<"messageCreate">) {
		// Un message de serveur ne concerne pas le relais, et un message de bot
		// (y compris les nôtres) n'a rien à y faire — sans ce filtre, l'accusé de
		// réception d'une persona déclencherait celui d'une autre.
		if (message.inGuild() || message.author.bot) return;

		const contenu = (message.content ?? "").trim();
		// Une pièce jointe seule arrive avec un contenu vide : on garde la trace
		// de l'échange plutôt que de laisser croire que rien n'a été envoyé.
		const texte = contenu || (message.attachments.size > 0 ? "(pièce jointe sans texte)" : "");
		if (!texte) return;

		const userId = message.author.id;
		const username = message.author.username;
		const displayName = message.author.globalName ?? null;

		try {
			const db = this.dbs.db;

			// Le contact est créé au premier contact, jamais autorisé d'office.
			// `onConflictDoUpdate` ne touche PAS `allowed` : une autorisation déjà
			// accordée ne doit pas être révoquée par un simple nouveau message, et
			// un refus ne doit pas être levé par insistance.
			await db
				.insert(dmContacts)
				.values({ userId, username, displayName, allowed: false })
				.onConflictDoUpdate({
					target: dmContacts.userId,
					set: { username, displayName, lastSeenAt: new Date() },
				});

			const [contact] = await db
				.select({ allowed: dmContacts.allowed })
				.from(dmContacts)
				.where(eq(dmContacts.userId, userId))
				.limit(1);
			const autorise = contact?.allowed === true;

			await db.insert(dmMessages).values({
				userId,
				direction: "in",
				content: texte,
				persona: "shenron",
				messageId: message.id,
				// Un message d'inconnu est marqué lu d'emblée : il ne sera jamais
				// servi comme « à traiter », mais il reste consultable à la demande.
				readAt: autorise ? null : new Date(),
			});

			if (autorise) {
				await message.react("✅").catch(() => undefined);
				logger.info(`[DM] message de ${username} (${userId}) mis en attente de lecture`);
				return;
			}

			// Un seul message d'explication par correspondant, jamais répété :
			// on compte les `out` déjà envoyés plutôt que de poser un drapeau,
			// ce qui garde la table comme seule source de vérité.
			const [{ n }] = await db
				.select({ n: sql<number>`count(*)` })
				.from(dmMessages)
				.where(and(eq(dmMessages.userId, userId), eq(dmMessages.direction, "out")));

			if (Number(n) === 0) {
				const reponse =
					"Bonjour — ce salon privé est un relais réservé. Votre message a bien été " +
					"enregistré, mais je ne peux pas y répondre tant que l'accès ne vous a pas " +
					"été ouvert. Si vous êtes attendu, prévenez la personne qui vous a orienté ici.";
				await message.author.send(reponse).catch(() => undefined);
				await db.insert(dmMessages).values({
					userId,
					direction: "out",
					content: reponse,
					persona: "shenron",
				});
			}
			logger.warn(`[DM] message d'un correspondant non autorisé : ${username} (${userId})`);
		} catch (e) {
			// Un relais qui casse ne doit pas emporter le client Discord avec lui.
			logger.error(e as Error, "[DM] échec du relais de message privé");
		}
	}
}
